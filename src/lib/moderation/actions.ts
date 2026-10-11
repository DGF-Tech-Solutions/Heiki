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
import { suspensionFor } from "./suspension";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { REPORT_REASON_IDS } from "./reasons";

const TESTI = testi({
  it: {
    demoSenzaCoda: "In modalità dimostrativa non c'è una coda di moderazione. Serve il database.",
    entraPerSegnalare: "Entra per segnalare.",
    datiNonValidi: "Dati non validi.",
    bersaglioNonValido: "Bersaglio non valido",
    dettagliTroppoLunghi: "I dettagli possono essere lunghi al massimo 1000 caratteri",
    giaSegnalato: "Avevi già segnalato questo contenuto. Ce ne stiamo occupando.",
    segnalazioneInviata: "Segnalazione inviata. La guarda un moderatore.",
    nonHaiPermessi: "Non hai i permessi per farlo.",
    contenutoNascosto: "Contenuto nascosto.",
    contenutoRipristinato: "Contenuto ripristinato.",
    segnalazioneInesistente: "Segnalazione inesistente.",
    segnalazioneChiusa: "Segnalazione chiusa.",
    segnalazioneArchiviata: "Segnalazione archiviata.",
    utenteNonValido: "Identificativo utente non valido",
    scriviIlMotivo: "Scrivi il motivo: serve a chi lo legge dopo",
    motivoTroppoLungo: "Il motivo può essere lungo al massimo 500 caratteri",
    giorniNonValidi: "I giorni vanno da 0 a 3650",
    utenteInesistente: "Utente inesistente.",
    nonSospendereAmministratore: "Non puoi sospendere un amministratore.",
    nonSospendereTeStesso: "Non puoi sospendere te stesso.",
    nonSospendereModeratore: "Solo un amministratore può sospendere un moderatore.",
    nonRevocareTua: "Non puoi revocare una sospensione che riguarda te.",
    utenteSospeso: "Utente sospeso.",
    sospensioneRevocata: "Sospensione revocata.",
  },
  en: {
    demoSenzaCoda: "Demo mode has no moderation queue. A database is required.",
    entraPerSegnalare: "Log in to report.",
    datiNonValidi: "Invalid data.",
    bersaglioNonValido: "Invalid target",
    dettagliTroppoLunghi: "Details can be at most 1000 characters long",
    giaSegnalato: "You had already reported this content. We're looking into it.",
    segnalazioneInviata: "Report sent. A moderator will review it.",
    nonHaiPermessi: "You don't have permission to do that.",
    contenutoNascosto: "Content hidden.",
    contenutoRipristinato: "Content restored.",
    segnalazioneInesistente: "Report not found.",
    segnalazioneChiusa: "Report closed.",
    segnalazioneArchiviata: "Report dismissed.",
    utenteNonValido: "Invalid user ID",
    scriviIlMotivo: "Write the reason: it's for whoever reads it later",
    motivoTroppoLungo: "The reason can be at most 500 characters long",
    giorniNonValidi: "Days must be between 0 and 3650",
    utenteInesistente: "User not found.",
    nonSospendereAmministratore: "You can't suspend an administrator.",
    nonSospendereTeStesso: "You can't suspend yourself.",
    nonSospendereModeratore: "Only an administrator can suspend a moderator.",
    nonRevocareTua: "You can't lift a suspension that concerns you.",
    utenteSospeso: "User suspended.",
    sospensioneRevocata: "Suspension lifted.",
  },
});

type Testi = (typeof TESTI)["it"];

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

/**
 * Solo chi puo' moderare passa. Il controllo sta nell'azione, non nella pagina.
 * Un moderatore sospeso non modera: fino all'11/10 la sospensione fermava solo
 * chi scrive, e un moderatore sospeso poteva revocarsela e sospendere chi
 * l'aveva sospeso.
 */
async function moderator(): Promise<{ id: string; role: Role } | null> {
  const current = await viewer();
  if (!current || !can(current.role, "moderate")) return null;
  if ((await suspensionFor(current.id)).active) return null;
  return current;
}

/* ------------------------------------------------------- segnalazione -- */

// Lo schema nasce dentro l'azione: i messaggi di errore vanno nella lingua di
// chi ha inviato il modulo, che si conosce solo durante la richiesta.
function reportSchema(t: Testi) {
  return z.object({
    targetType: z.enum(["POST", "COMMENT"], t.datiNonValidi),
    targetId: z.string().uuid(t.bersaglioNonValido),
    reason: z.enum(REPORT_REASON_IDS, t.datiNonValidi),
    details: z.string().trim().max(1000, t.dettagliTroppoLunghi).optional(),
  });
}

export async function reportAction(
  _previous: ModResult,
  formData: FormData,
): Promise<ModResult> {
  const locale = await getLocale();
  const t = TESTI[locale];

  // In modalita' dimostrativa la community vive in memoria e non esiste una
  // coda dove mettere la segnalazione: dirlo e' meglio di un "entra" che
  // manderebbe a cercare un accesso che qui non serve.
  if (!(await databaseReachable())) {
    return {
      ok: false,
      error: t.demoSenzaCoda,
    };
  }

  const current = await viewer();
  if (!current) return { ok: false, error: t.entraPerSegnalare };

  const parsed = reportSchema(t).safeParse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    reason: formData.get("reason"),
    details: formData.get("details") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const limit = rateLimit("report", current.id);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, locale) };

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
    return { ok: true, message: t.giaSegnalato };
  }

  await db.insert(reports).values({
    reporterId: current.id,
    targetType: parsed.data.targetType,
    targetId: parsed.data.targetId,
    reason: parsed.data.reason,
    details: parsed.data.details ?? null,
  });

  return { ok: true, message: t.segnalazioneInviata };
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
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  if (targetType === "POST") {
    await db.update(posts).set({ hidden }).where(eq(posts.id, targetId));
  } else {
    await db.update(comments).set({ hidden }).where(eq(comments.id, targetId));
  }

  await logAction(mod.id, targetType, targetId, hidden ? "hide" : "unhide");

  revalidatePath("/moderazione");
  revalidatePath("/", "layout");
  return { ok: true, message: hidden ? t.contenutoNascosto : t.contenutoRipristinato };
}

export async function resolveReportAction(
  reportId: string,
  outcome: "RESOLVED" | "DISMISSED",
): Promise<ModResult> {
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  const report = await db.query.reports.findFirst({
    where: eq(reports.id, reportId),
    columns: { targetType: true, targetId: true },
  });
  if (!report) return { ok: false, error: t.segnalazioneInesistente };

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
    message: outcome === "RESOLVED" ? t.segnalazioneChiusa : t.segnalazioneArchiviata,
  };
}

function suspendSchema(t: Testi) {
  return z.object({
    userId: z.string().uuid(t.utenteNonValido),
    reason: z.string().trim().min(5, t.scriviIlMotivo).max(500, t.motivoTroppoLungo),
    days: z.coerce
      .number(t.giorniNonValidi)
      .int(t.giorniNonValidi)
      .min(0, t.giorniNonValidi)
      .max(3650, t.giorniNonValidi),
  });
}

export async function suspendAction(
  _previous: ModResult,
  formData: FormData,
): Promise<ModResult> {
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  const parsed = suspendSchema(t).safeParse({
    userId: formData.get("userId"),
    reason: formData.get("reason"),
    days: formData.get("days") ?? 0,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const target = await db.query.users.findFirst({
    where: eq(users.id, parsed.data.userId),
    columns: { id: true, role: true },
  });
  if (!target) return { ok: false, error: t.utenteInesistente };

  // Un moderatore non sospende un amministratore: la gerarchia va rispettata,
  // altrimenti chi ha il ruolo minore puo' disattivare chi lo sorveglia.
  if (target.role === "ADMIN") {
    return { ok: false, error: t.nonSospendereAmministratore };
  }
  if (target.id === mod.id) {
    return { ok: false, error: t.nonSospendereTeStesso };
  }
  // fra moderatori decide un amministratore: se no due moderatori in lite
  // possono sospendersi a vicenda
  if (target.role === "MODERATOR" && mod.role !== "ADMIN") {
    return { ok: false, error: t.nonSospendereModeratore };
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
  return { ok: true, message: t.utenteSospeso };
}

export async function liftSuspensionAction(suspensionId: string): Promise<ModResult> {
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  if (!z.string().uuid().safeParse(suspensionId).success) return { ok: false, error: t.datiNonValidi };
  const suspension = await db.query.suspensions.findFirst({
    where: eq(suspensions.id, suspensionId),
    columns: { userId: true },
  });
  if (!suspension) return { ok: false, error: t.datiNonValidi };
  if (suspension.userId === mod.id) return { ok: false, error: t.nonRevocareTua };

  await db
    .update(suspensions)
    .set({ liftedAt: new Date() })
    .where(eq(suspensions.id, suspensionId));

  revalidatePath("/moderazione");
  return { ok: true, message: t.sospensioneRevocata };
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
