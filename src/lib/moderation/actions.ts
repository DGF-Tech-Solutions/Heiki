"use server";

/**
 * Segnalazioni e moderazione.
 *
 * Una community senza strumenti di moderazione non e' una community aperta: e'
 * una community che sara' chiusa in fretta. Vanno costruiti prima che servano,
 * perche' il giorno in cui servono non c'e' tempo di scriverli.
 *
 * Tre principi:
 *
 * 1. Nascondere, non cancellare. Un contenuto nascosto resta nel database con
 *    chi lo ha nascosto e perche': se la decisione era sbagliata si torna
 *    indietro, e c'e' una traccia di chi ha deciso.
 * 2. Sospendere non cancella cio' che la persona ha scritto. Sono due decisioni
 *    diverse e vanno prese separatamente.
 * 3. Ogni azione finisce nel registro. Un moderatore che agisce senza traccia e'
 *    un problema piu' grande di quello che sta risolvendo.
 */

import { revalidatePath } from "next/cache";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { can, type Role } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { comments, modActions, posts, reports, suspensions, users } from "@/lib/db/schema";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { REPORT_REASON_IDS } from "./reasons";

export interface ModResult {
  ok: boolean;
  error?: string;
  message?: string;
}

type Target = "POST" | "COMMENT";

async function viewer(): Promise<{ id: string; role: Role } | null> {
  if (!(await databaseReachable())) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  return { id: session.user.id, role: session.user.role };
}

/** Solo chi puo' moderare passa. Il controllo sta nell'azione, non nella pagina. */
async function moderator(): Promise<{ id: string; role: Role } | null> {
  const current = await viewer();
  if (!current || !can(current.role, "moderate")) return null;
  return current;
}

/* ------------------------------------------------------- segnalazione -- */

const reportSchema = z.object({
  targetType: z.enum(["POST", "COMMENT"]),
  targetId: z.string().uuid("Bersaglio non valido"),
  reason: z.enum(REPORT_REASON_IDS),
  details: z.string().trim().max(1000).optional(),
});

export async function reportAction(
  _previous: ModResult,
  formData: FormData,
): Promise<ModResult> {
  // In modalita' dimostrativa la community vive in memoria e non esiste una
  // coda dove mettere la segnalazione: dirlo e' meglio di un "entra" che
  // manderebbe a cercare un accesso che qui non serve.
  if (!(await databaseReachable())) {
    return {
      ok: false,
      error: "In modalità dimostrativa non c'è una coda di moderazione. Serve il database.",
    };
  }

  const current = await viewer();
  if (!current) return { ok: false, error: "Entra per segnalare." };

  const parsed = reportSchema.safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    reason: formData.get("reason"),
    details: formData.get("details") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const limit = rateLimit("report", current.id);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit) };

  // Una seconda segnalazione della stessa persona sullo stesso contenuto non
  // aggiunge informazione e gonfierebbe la coda.
  const existing = await db.query.reports.findFirst({
    where: and(
      eq(reports.reporterId, current.id),
      eq(reports.targetType, parsed.data.targetType),
      eq(reports.targetId, parsed.data.targetId),
    ),
    columns: { id: true },
  });
  if (existing) {
    return { ok: true, message: "Avevi già segnalato questo contenuto. Ce ne stiamo occupando." };
  }

  await db.insert(reports).values({
    reporterId: current.id,
    targetType: parsed.data.targetType,
    targetId: parsed.data.targetId,
    reason: parsed.data.reason,
    details: parsed.data.details ?? null,
  });

  return { ok: true, message: "Segnalazione inviata. La guarda un moderatore." };
}

/* --------------------------------------------------------- moderazione -- */

async function logAction(
  moderatorId: string,
  targetType: Target,
  targetId: string,
  action: string,
  reason?: string,
): Promise<void> {
  await db.insert(modActions).values({
    moderatorId,
    targetType,
    targetId,
    action,
    reason: reason ?? null,
  });
}

export async function setHiddenAction(
  targetType: Target,
  targetId: string,
  hidden: boolean,
): Promise<ModResult> {
  const mod = await moderator();
  if (!mod) return { ok: false, error: "Non hai i permessi per farlo." };

  if (targetType === "POST") {
    await db.update(posts).set({ hidden }).where(eq(posts.id, targetId));
  } else {
    await db.update(comments).set({ hidden }).where(eq(comments.id, targetId));
  }

  await logAction(mod.id, targetType, targetId, hidden ? "hide" : "unhide");

  revalidatePath("/moderazione");
  revalidatePath("/", "layout");
  return { ok: true, message: hidden ? "Contenuto nascosto." : "Contenuto ripristinato." };
}

export async function resolveReportAction(
  reportId: string,
  outcome: "RESOLVED" | "DISMISSED",
): Promise<ModResult> {
  const mod = await moderator();
  if (!mod) return { ok: false, error: "Non hai i permessi per farlo." };

  const report = await db.query.reports.findFirst({
    where: eq(reports.id, reportId),
    columns: { targetType: true, targetId: true },
  });
  if (!report) return { ok: false, error: "Segnalazione inesistente." };

  await db.update(reports).set({ status: outcome }).where(eq(reports.id, reportId));
  await logAction(
    mod.id,
    report.targetType as Target,
    report.targetId,
    outcome === "RESOLVED" ? "resolve" : "dismiss",
  );

  revalidatePath("/moderazione");
  return {
    ok: true,
    message: outcome === "RESOLVED" ? "Segnalazione chiusa." : "Segnalazione archiviata.",
  };
}

const suspendSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().trim().min(5, "Scrivi il motivo: serve a chi lo legge dopo").max(500),
  days: z.coerce.number().int().min(0).max(3650),
});

export async function suspendAction(
  _previous: ModResult,
  formData: FormData,
): Promise<ModResult> {
  const mod = await moderator();
  if (!mod) return { ok: false, error: "Non hai i permessi per farlo." };

  const parsed = suspendSchema.safeParse({
    userId: formData.get("userId"),
    reason: formData.get("reason"),
    days: formData.get("days") ?? 0,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const target = await db.query.users.findFirst({
    where: eq(users.id, parsed.data.userId),
    columns: { id: true, role: true },
  });
  if (!target) return { ok: false, error: "Utente inesistente." };

  // Un moderatore non sospende un amministratore: la gerarchia va rispettata,
  // altrimenti chi ha il ruolo minore puo' disattivare chi lo sorveglia.
  if (target.role === "ADMIN") {
    return { ok: false, error: "Non puoi sospendere un amministratore." };
  }
  if (target.id === mod.id) {
    return { ok: false, error: "Non puoi sospendere te stesso." };
  }

  await db.insert(suspensions).values({
    userId: target.id,
    moderatorId: mod.id,
    reason: parsed.data.reason,
    // 0 giorni significa a tempo indeterminato: e' piu' chiaro di una data
    // lontanissima, e la differenza si legge nella colonna.
    until: parsed.data.days > 0 ? new Date(Date.now() + parsed.data.days * 86_400_000) : null,
  });

  revalidatePath("/moderazione");
  return { ok: true, message: "Utente sospeso." };
}

export async function liftSuspensionAction(suspensionId: string): Promise<ModResult> {
  const mod = await moderator();
  if (!mod) return { ok: false, error: "Non hai i permessi per farlo." };

  await db
    .update(suspensions)
    .set({ liftedAt: new Date() })
    .where(eq(suspensions.id, suspensionId));

  revalidatePath("/moderazione");
  return { ok: true, message: "Sospensione revocata." };
}

/* ------------------------------------------------------------- lettura -- */

export interface QueueItem {
  id: string;
  targetType: Target;
  targetId: string;
  reason: string;
  details: string | null;
  createdAt: string;
  reporter: string;
  /** anteprima del contenuto segnalato, per decidere senza aprire altre pagine */
  preview: string | null;
  hidden: boolean;
  gameSlug: string | null;
  postId: string | null;
  /** autore del contenuto segnalato: serve per sospendere l'account giusto */
  authorId: string | null;
  authorUsername: string | null;
}

export async function reportQueue(): Promise<QueueItem[]> {
  const mod = await moderator();
  if (!mod) return [];

  const rows = await db.query.reports.findMany({
    where: eq(reports.status, "OPEN"),
    orderBy: [desc(reports.createdAt)],
    limit: 100,
    with: { reporter: true },
  });

  const items: QueueItem[] = [];

  for (const row of rows) {
    let preview: string | null = null;
    let hidden = false;
    let gameSlug: string | null = null;
    let postId: string | null = null;
    let authorId: string | null = null;
    let authorUsername: string | null = null;

    if (row.targetType === "POST") {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, row.targetId),
        columns: { title: true, bodyMd: true, hidden: true, id: true },
        with: { hub: { with: { game: true } }, author: true },
      });
      if (post) {
        preview = `${post.title} — ${post.bodyMd.slice(0, 160)}`;
        hidden = post.hidden;
        gameSlug = post.hub.game?.slug ?? null;
        postId = post.id;
        authorId = post.author.id;
        authorUsername = post.author.username;
      }
    } else if (row.targetType === "COMMENT") {
      const comment = await db.query.comments.findFirst({
        where: eq(comments.id, row.targetId),
        columns: { bodyMd: true, hidden: true, postId: true },
        with: { post: { with: { hub: { with: { game: true } } } }, author: true },
      });
      if (comment) {
        preview = comment.bodyMd.slice(0, 200);
        hidden = comment.hidden;
        gameSlug = comment.post?.hub.game?.slug ?? null;
        postId = comment.postId;
        authorId = comment.author.id;
        authorUsername = comment.author.username;
      }
    }

    items.push({
      id: row.id,
      targetType: row.targetType as Target,
      targetId: row.targetId,
      reason: row.reason,
      details: row.details,
      createdAt: row.createdAt.toISOString(),
      reporter: row.reporter.username,
      preview,
      hidden,
      gameSlug,
      postId,
      authorId,
      authorUsername,
    });
  }

  return items;
}

export interface ActiveSuspension {
  id: string;
  username: string;
  reason: string;
  until: string | null;
  createdAt: string;
}

export async function activeSuspensions(): Promise<ActiveSuspension[]> {
  const mod = await moderator();
  if (!mod) return [];

  const rows = await db.query.suspensions.findMany({
    where: isNull(suspensions.liftedAt),
    orderBy: [desc(suspensions.createdAt)],
    limit: 50,
    with: { user: true },
  });

  return rows.map((row) => ({
    id: row.id,
    username: row.user.username,
    reason: row.reason,
    until: row.until?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

/** Registro delle azioni: rende verificabile chi ha deciso cosa. */
export async function recentModActions(limit = 30) {
  const mod = await moderator();
  if (!mod) return [];

  const rows = await db.query.modActions.findMany({
    orderBy: [desc(modActions.createdAt)],
    limit,
    with: { moderator: true },
  });

  return rows.map((row) => ({
    id: row.id,
    action: row.action,
    targetType: row.targetType,
    moderator: row.moderator.username,
    createdAt: row.createdAt.toISOString(),
  }));
}
