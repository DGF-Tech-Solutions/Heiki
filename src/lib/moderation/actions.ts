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
import { canLiftSuspension, canSuspend, requireActive, suspensionFor } from "./suspension";
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
    contenutoInesistente: "Contenuto inesistente.",
    segnalazioneInesistente: "Segnalazione inesistente o già chiusa.",
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
    revocaSoloAmministratore:
      "Questa sospensione la revoca solo un amministratore: riguarda lo staff o l'ha data un amministratore.",
    sospensioneInesistente: "Sospensione inesistente o già revocata.",
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
    contenutoInesistente: "Content not found.",
    segnalazioneInesistente: "Report not found or already closed.",
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
    revocaSoloAmministratore:
      "Only an administrator can lift this suspension: it concerns staff or was issued by an administrator.",
    sospensioneInesistente: "Suspension not found or already lifted.",
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

  // Chi e' sospeso non segnala: fino all'11/10 poteva, e la sospensione si
  // aggirava riempiendo la coda dei moderatori.
  const blocked = await requireActive(current.id, locale);
  if (blocked) return { ok: false, error: blocked };

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

/** La transazione di Drizzle: il registro si scrive sempre dentro quella dell'azione. */
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Una riga del registro, nella stessa transazione dell'azione che racconta: se
 * una delle due fallisce non succede nessuna delle due. Fino all'11/10 erano due
 * scritture separate, e un'azione poteva riuscire senza lasciare traccia.
 */
async function logAction(
  tx: Tx,
  moderatorId: string,
  targetType: (typeof modActions.$inferInsert)["targetType"],
  targetId: string,
  action: string,
  reason?: string,
): Promise<void> {
  await tx.insert(modActions).values({
    moderatorId,
    targetType,
    targetId,
    action,
    reason: reason ?? null,
  });
}

/** Un identificativo vero: un id inventato si respinge qui, non con un errore del database. */
const UUID = z.string().uuid();

// I tipi dei parametri sono una promessa del client, non una garanzia: l'azione
// e' un indirizzo che chiunque puo' chiamare con quello che vuole. Fino all'11/10
// un targetType inventato nascondeva un commento e poi faceva fallire il registro.
const HIDDEN_INPUT = z.object({
  targetType: z.enum(["POST", "COMMENT"]),
  targetId: UUID,
  hidden: z.boolean(),
});

export async function setHiddenAction(
  targetType: Target,
  targetId: string,
  hidden: boolean,
): Promise<ModResult> {
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  const parsed = HIDDEN_INPUT.safeParse({ targetType, targetId, hidden });
  if (!parsed.success) return { ok: false, error: t.datiNonValidi };
  const input = parsed.data;

  const changed = await db.transaction(async (tx) => {
    const [row] =
      input.targetType === "POST"
        ? await tx
            .update(posts)
            .set({ hidden: input.hidden })
            .where(eq(posts.id, input.targetId))
            .returning({ id: posts.id })
        : await tx
            .update(comments)
            .set({ hidden: input.hidden })
            .where(eq(comments.id, input.targetId))
            .returning({ id: comments.id });
    // niente riga, niente registro: un'azione su un contenuto che non c'e' non e' un'azione
    if (!row) return false;
    await logAction(tx, mod.id, input.targetType, input.targetId, input.hidden ? "hide" : "unhide");
    return true;
  });
  if (!changed) return { ok: false, error: t.contenutoInesistente };

  revalidatePath("/moderazione");
  revalidatePath("/", "layout");
  return { ok: true, message: input.hidden ? t.contenutoNascosto : t.contenutoRipristinato };
}

const RESOLVE_INPUT = z.object({
  reportId: UUID,
  // solo i due esiti che chiudono: fino all'11/10 passava anche "OPEN", che
  // riapriva la segnalazione mentre il registro scriveva «dismiss»
  outcome: z.enum(["RESOLVED", "DISMISSED"]),
});

export async function resolveReportAction(
  reportId: string,
  outcome: "RESOLVED" | "DISMISSED",
): Promise<ModResult> {
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  const parsed = RESOLVE_INPUT.safeParse({ reportId, outcome });
  if (!parsed.success) return { ok: false, error: t.datiNonValidi };
  const input = parsed.data;

  // Solo una segnalazione ancora aperta: con due moderatori sulla stessa riga
  // decide il primo, e il registro non racconta due chiusure.
  const closed = await db.transaction(async (tx) => {
    const [report] = await tx
      .update(reports)
      .set({ status: input.outcome })
      .where(and(eq(reports.id, input.reportId), eq(reports.status, "OPEN")))
      .returning({ targetType: reports.targetType, targetId: reports.targetId });
    if (!report) return false;
    await logAction(
      tx,
      mod.id,
      report.targetType,
      report.targetId,
      input.outcome === "RESOLVED" ? "resolve" : "dismiss",
    );
    return true;
  });
  if (!closed) return { ok: false, error: t.segnalazioneInesistente };

  revalidatePath("/moderazione");
  return {
    ok: true,
    message: input.outcome === "RESOLVED" ? t.segnalazioneChiusa : t.segnalazioneArchiviata,
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

  // La gerarchia sta in canSuspend (suspension.ts), dove la provano i test.
  const verdict = canSuspend(mod, target);
  if (!verdict.ok) {
    const refusals = {
      nonModeratore: t.nonHaiPermessi,
      amministratore: t.nonSospendereAmministratore,
      seStesso: t.nonSospendereTeStesso,
      moderatore: t.nonSospendereModeratore,
    } as const;
    return { ok: false, error: refusals[verdict.reason] };
  }

  const { reason, days } = parsed.data;
  await db.transaction(async (tx) => {
    await tx.insert(suspensions).values({
      userId: target.id,
      moderatorId: mod.id,
      reason,
      // 0 giorni significa a tempo indeterminato: e' piu' chiaro di una data
      // lontanissima, e la differenza si legge nella colonna.
      until: days > 0 ? new Date(Date.now() + days * 86_400_000) : null,
    });
    await logAction(tx, mod.id, "USER", target.id, "suspend", reason);
  });

  revalidatePath("/moderazione");
  return { ok: true, message: t.utenteSospeso };
}

export async function liftSuspensionAction(suspensionId: string): Promise<ModResult> {
  const t = TESTI[await getLocale()];
  const mod = await moderator();
  if (!mod) return { ok: false, error: t.nonHaiPermessi };

  if (!UUID.safeParse(suspensionId).success) return { ok: false, error: t.datiNonValidi };
  const suspension = await db.query.suspensions.findFirst({
    where: and(eq(suspensions.id, suspensionId), isNull(suspensions.liftedAt)),
    columns: { id: true },
    with: {
      user: { columns: { id: true, role: true } },
      moderator: { columns: { role: true } },
    },
  });
  if (!suspension) return { ok: false, error: t.sospensioneInesistente };

  // Fino all'11/10 bastava essere moderatore: ora la revoca che tocca lo staff,
  // o che disfa la decisione di un amministratore, spetta a un amministratore.
  const verdict = canLiftSuspension({
    actor: mod,
    suspended: suspension.user,
    issuerRole: suspension.moderator.role,
  });
  if (!verdict.ok) {
    const refusals = {
      nonModeratore: t.nonHaiPermessi,
      propria: t.nonRevocareTua,
      serveAmministratore: t.revocaSoloAmministratore,
    } as const;
    return { ok: false, error: refusals[verdict.reason] };
  }

  const lifted = await db.transaction(async (tx) => {
    // condizionata a «non ancora revocata»: con due moderatori sulla stessa riga
    // la revoca e la sua traccia restano una sola
    const [row] = await tx
      .update(suspensions)
      .set({ liftedAt: new Date(), liftedBy: mod.id })
      .where(and(eq(suspensions.id, suspension.id), isNull(suspensions.liftedAt)))
      .returning({ id: suspensions.id });
    if (!row) return false;
    await logAction(tx, mod.id, "USER", suspension.user.id, "lift_suspension");
    return true;
  });
  if (!lifted) return { ok: false, error: t.sospensioneInesistente };

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

  // Delle persone si leggono solo le colonne che la coda mostra: fino all'11/10
  // si caricava la riga intera di users, email e hash della password compresi.
  const rows = await db.query.reports.findMany({
    where: eq(reports.status, "OPEN"),
    orderBy: [desc(reports.createdAt)],
    limit: 100,
    with: { reporter: { columns: { username: true } } },
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
        with: {
          hub: { columns: { id: true }, with: { game: { columns: { slug: true } } } },
          author: { columns: { id: true, username: true } },
        },
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
        with: {
          post: {
            columns: { id: true },
            with: { hub: { columns: { id: true }, with: { game: { columns: { slug: true } } } } },
          },
          author: { columns: { id: true, username: true } },
        },
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
  /**
   * L'utente sospeso e il suo ruolo, e il ruolo di oggi di chi l'ha sospeso:
   * servono alla pagina per chiedere a canLiftSuspension se mostrare «Revoca».
   */
  userId: string;
  userRole: Role;
  issuerRole: Role;
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
    with: {
      user: { columns: { id: true, username: true, role: true } },
      moderator: { columns: { role: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    username: row.user.username,
    userId: row.user.id,
    userRole: row.user.role,
    issuerRole: row.moderator.role,
    reason: row.reason,
    until: row.until?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

/** Registro delle azioni: rende verificabile chi ha deciso cosa. */
export async function recentModActions(limit = 30) {
  const mod = await moderator();
  if (!mod) return [];

  // anche questa e' un'azione richiamabile dal browser: il numero arriva da fuori
  const take = Number.isInteger(limit) ? Math.min(Math.max(limit, 1), 100) : 30;
  const rows = await db.query.modActions.findMany({
    orderBy: [desc(modActions.createdAt)],
    limit: take,
    with: { moderator: { columns: { username: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    action: row.action,
    targetType: row.targetType,
    /** il motivo o il dettaglio dell'azione (es. «USER->MODERATOR» per set_role), null se non c'e' */
    reason: row.reason ?? null,
    moderator: row.moderator.username,
    createdAt: row.createdAt.toISOString(),
  }));
}
