"use server";

/**
 * Le scritture dell'account di gioco e della sua verifica.
 *
 * Ogni azione ricontrolla chi la chiede: l'interfaccia e' solo un suggerimento.
 * La verifica della classe (idea dell'utente, 27/09): il sito pesca un eroe SR
 * del giorno, diverso per ogni utente; l'utente lo mette nei preferiti nel gioco
 * e carica una schermata della lista Eroi ordinata per preferiti, dove si vedono
 * l'eroe e la classe di combattimento dell'account. Un moderatore guarda, scrive
 * il numero che legge e decide. La schermata si cancella alla decisione.
 */

import { createHash, randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { can, type Role } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import {
  gameAccounts,
  notifications,
  powerVerifications,
  verificationScreenshots,
} from "@/lib/db/schema";
import { parseSetup, type AccountSetup } from "@/lib/games/account-setup";
import {
  cleanProfile,
  MAX_REROLLS,
  pickChallenge,
  POWER_MAX,
  SCREENSHOT_MAX_BYTES,
  sniffImage,
  utcDay,
  type GameAccountProfile,
} from "@/lib/games/game-account";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import {
  challengePoolFor,
  copyOf,
  findGameAccount,
  gameIdBySlug,
  liveVerificationIds,
  verificationSummary,
  type ServerAccountCopy,
  type VerificationSummary,
} from "./server";

const TESTI = testi({
  it: {
    databaseAssente: "Serve il database: in modalità dimostrativa l'account resta solo nel browser.",
    entra: "Entra per salvare l'account e chiedere la verifica.",
    giocoSconosciuto: "Gioco sconosciuto.",
    datiNonValidi: "Dati non validi.",
    serveClasse: "Scrivi prima la classe di combattimento del tuo account.",
    inAttesa: "La tua schermata aspetta già un moderatore: puoi ritirarla, se vuoi rifarla.",
    nessunEroe: "Non ci sono eroi da proporre per questo gioco.",
    nienteDaCambiare: "Non c'è un eroe del giorno da cambiare: chiedine uno.",
    cambiFiniti: `Hai già cambiato eroe ${MAX_REROLLS} volte oggi. Riprova domani.`,
    scaduto: "L'eroe del giorno è di ieri: chiedine uno nuovo e rifai la schermata.",
    serveFile: "Scegli la schermata da caricare.",
    troppoGrande: "La schermata è troppo grande (al massimo 3 MB).",
    formato: "Serve un'immagine PNG, JPEG o WebP.",
    giaUsata: "Questa immagine è già stata caricata per una verifica. Fai una schermata nuova.",
    classeNonValida: "La classe va da 1 a 100.000.000.",
    nienteDaRitirare: "Non c'è niente da ritirare.",
    nonHaiPermessi: "Non hai i permessi per farlo.",
    verificaInesistente: "Verifica inesistente o già decisa.",
    nonLaTua: "Non puoi decidere la verifica del tuo account.",
    serveMotivo: "Scrivi il motivo: lo legge chi l'ha chiesta.",
    approvata: "Verifica confermata.",
    rifiutata: "Verifica rifiutata.",
  },
  en: {
    databaseAssente: "The database is required: in demo mode the account stays in the browser only.",
    entra: "Log in to save the account and request verification.",
    giocoSconosciuto: "Unknown game.",
    datiNonValidi: "Invalid data.",
    serveClasse: "Enter your account's Combat Class first.",
    inAttesa: "Your screenshot is already waiting for a moderator: you can withdraw it if you want to redo it.",
    nessunEroe: "There are no heroes to propose for this game.",
    nienteDaCambiare: "There is no hero of the day to change: request one.",
    cambiFiniti: `You already changed hero ${MAX_REROLLS} times today. Try again tomorrow.`,
    scaduto: "The hero of the day is from yesterday: request a new one and retake the screenshot.",
    serveFile: "Choose the screenshot to upload.",
    troppoGrande: "The screenshot is too large (3 MB at most).",
    formato: "A PNG, JPEG or WebP image is required.",
    giaUsata: "This image has already been uploaded for a verification. Take a new screenshot.",
    classeNonValida: "The Combat Class must be between 1 and 100,000,000.",
    nienteDaRitirare: "There is nothing to withdraw.",
    nonHaiPermessi: "You don't have permission to do that.",
    verificaInesistente: "Verification not found or already decided.",
    nonLaTua: "You can't decide the verification of your own account.",
    serveMotivo: "Write the reason: the person who asked will read it.",
    approvata: "Verification confirmed.",
    rifiutata: "Verification rejected.",
  },
});

type Testi = (typeof TESTI)["it"];

export interface SaveAccountResult {
  readonly ok: boolean;
  readonly error?: string;
  /** il nuovo `updatedAt` del database, in millisecondi */
  readonly updatedAt?: number;
}

export interface VerificationResult {
  readonly ok: boolean;
  readonly error?: string;
  readonly summary?: VerificationSummary;
  readonly updatedAt?: number;
}

interface Viewer {
  readonly id: string;
  readonly role: Role;
}

async function context(): Promise<{ t: Testi; viewer: Viewer | null; error?: string }> {
  const t = TESTI[await getLocale()];
  if (!(await databaseReachable())) return { t, viewer: null, error: t.databaseAssente };
  const session = await auth();
  if (!session?.user?.id) return { t, viewer: null, error: t.entra };
  return { t, viewer: { id: session.user.id, role: session.user.role } };
}

/** Quello che arriva dal browser, riletto con le stesse regole con cui il browser lo legge. */
function readPayload(payload: unknown): { profile: GameAccountProfile; setup: AccountSetup } | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const setup = parseSetup(JSON.stringify(data.setup ?? null));
  return { profile: cleanProfile(data.profile), setup: { ...setup, power: Math.min(setup.power, POWER_MAX) } };
}

/** Crea o aggiorna l'account di gioco dell'utente per questo gioco. */
async function upsertAccount(
  userId: string,
  gameId: string,
  data: { profile: GameAccountProfile; setup: AccountSetup },
): Promise<ServerAccountCopy> {
  const now = new Date();
  const values = {
    uid: data.profile.friendCode,
    region: data.profile.server,
    nickname: data.profile.nickname || null,
    accountPower: data.setup.power > 0 ? data.setup.power : null,
    setup: data.setup as unknown as Record<string, unknown>,
    updatedAt: now,
  };
  const existing = await findGameAccount(userId, gameId);
  if (existing) {
    const [row] = await db.update(gameAccounts).set(values).where(eq(gameAccounts.id, existing.id)).returning();
    return copyOf(row!);
  }
  const [row] = await db
    .insert(gameAccounts)
    .values({ userId, gameId, ...values })
    .returning();
  return copyOf(row!);
}

/**
 * Salva l'account di gioco (lo chiama la sincronizzazione, qualche istante dopo
 * l'ultima modifica nel browser).
 */
export async function saveGameAccountAction(gameSlug: string, payload: unknown): Promise<SaveAccountResult> {
  const { t, viewer, error } = await context();
  if (!viewer) return { ok: false, error };

  const limit = rateLimit("accountSave", viewer.id);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, await getLocale()) };

  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return { ok: false, error: t.giocoSconosciuto };
  const data = readPayload(payload);
  if (!data) return { ok: false, error: t.datiNonValidi };

  const copy = await upsertAccount(viewer.id, gameId, data);
  return { ok: true, updatedAt: copy.updatedAt };
}

/**
 * L'eroe del giorno. Salva prima l'account com'e' nel browser (chi ha appena
 * scritto la classe non deve aspettare la sincronizzazione), poi restituisce la
 * verifica aperta di oggi o ne apre una nuova.
 */
export async function requestChallengeAction(gameSlug: string, payload: unknown): Promise<VerificationResult> {
  const { t, viewer, error } = await context();
  if (!viewer) return { ok: false, error };

  const limit = rateLimit("verification", viewer.id);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, await getLocale()) };

  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return { ok: false, error: t.giocoSconosciuto };
  const data = readPayload(payload);
  if (!data) return { ok: false, error: t.datiNonValidi };
  if (data.setup.power <= 0) return { ok: false, error: t.serveClasse };

  const copy = await upsertAccount(viewer.id, gameId, data);
  const account = (await findGameAccount(viewer.id, gameId))!;
  const now = new Date();
  const summary = await verificationSummary(viewer.id, gameId, now);

  if (summary.current?.status === "PENDING") return { ok: false, error: t.inAttesa, summary, updatedAt: copy.updatedAt };
  if (summary.current?.status === "OPEN") return { ok: true, summary, updatedAt: copy.updatedAt };

  // Un eroe al giorno per utente: chi ritira e richiede, o e' stato rifiutato, ritrova
  // lo stesso eroe e i cambi che gli restano. Altrimenti ritirando si pescherebbe
  // all'infinito, fino a un eroe gia' nei preferiti di una schermata vecchia.
  const today = utcDay(now);
  const earlier = await db.query.powerVerifications.findFirst({
    where: and(eq(powerVerifications.gameAccountId, account.id), eq(powerVerifications.challengeDay, today)),
    orderBy: [desc(powerVerifications.createdAt)],
    columns: { challengeHeroId: true, skippedHeroIds: true },
  });
  const hero = earlier?.challengeHeroId ?? pickChallenge(challengePoolFor(gameSlug), [], randomInt);
  if (!hero) return { ok: false, error: t.nessunEroe };

  // gli eroi di un giorno passato non valgono piu': si chiudono
  await db
    .update(powerVerifications)
    .set({ status: "CANCELLED" })
    .where(and(eq(powerVerifications.gameAccountId, account.id), eq(powerVerifications.status, "OPEN")));
  await db.insert(powerVerifications).values({
    userId: viewer.id,
    gameId,
    gameAccountId: account.id,
    challengeDay: today,
    challengeHeroId: hero,
    skippedHeroIds: earlier?.skippedHeroIds ?? [],
  });

  return { ok: true, summary: await verificationSummary(viewer.id, gameId, now), updatedAt: copy.updatedAt };
}

/** «Non ce l'ho»: un altro eroe, al massimo MAX_REROLLS volte al giorno. */
export async function rerollChallengeAction(gameSlug: string): Promise<VerificationResult> {
  const { t, viewer, error } = await context();
  if (!viewer) return { ok: false, error };

  const limit = rateLimit("verification", viewer.id);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, await getLocale()) };

  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return { ok: false, error: t.giocoSconosciuto };
  const now = new Date();
  const summary = await verificationSummary(viewer.id, gameId, now);
  const current = summary.current;
  if (!current || current.status !== "OPEN") return { ok: false, error: t.nienteDaCambiare, summary };
  if (current.rerollsLeft <= 0) return { ok: false, error: t.cambiFiniti, summary };

  const row = await db.query.powerVerifications.findFirst({ where: eq(powerVerifications.id, current.id) });
  if (!row) return { ok: false, error: t.nienteDaCambiare, summary };
  const skipped = [...row.skippedHeroIds, row.challengeHeroId];
  const hero = pickChallenge(challengePoolFor(gameSlug), skipped, randomInt);
  if (!hero) return { ok: false, error: t.nessunEroe, summary };

  await db
    .update(powerVerifications)
    .set({ challengeHeroId: hero, skippedHeroIds: skipped })
    .where(eq(powerVerifications.id, row.id));
  return { ok: true, summary: await verificationSummary(viewer.id, gameId, now) };
}

/**
 * La schermata. Nel modulo: `game`, `power` (la classe che si legge nella
 * schermata) e `screenshot`. Si accetta solo lo stesso giorno dell'eroe: il
 * giorno dopo l'eroe e' un altro, e una schermata vecchia non prova niente.
 */
export async function submitScreenshotAction(formData: FormData): Promise<VerificationResult> {
  const { t, viewer, error } = await context();
  if (!viewer) return { ok: false, error };

  const limit = rateLimit("verification", viewer.id);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, await getLocale()) };

  const gameSlug = String(formData.get("game") ?? "");
  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return { ok: false, error: t.giocoSconosciuto };

  const power = Number(formData.get("power"));
  if (!Number.isInteger(power) || power < 1 || power > POWER_MAX) return { ok: false, error: t.classeNonValida };

  const file = formData.get("screenshot");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: t.serveFile };
  if (file.size > SCREENSHOT_MAX_BYTES) return { ok: false, error: t.troppoGrande };
  const bytes = Buffer.from(await file.arrayBuffer());
  // il tipo si legge dai byte, non dal nome o da quello che dichiara il browser
  const mime = sniffImage(bytes);
  if (!mime) return { ok: false, error: t.formato };

  const now = new Date();
  const summary = await verificationSummary(viewer.id, gameId, now);
  const current = summary.current;
  if (!current) return { ok: false, error: t.scaduto, summary };
  if (current.status === "PENDING") return { ok: false, error: t.inAttesa, summary };
  if (current.challengeDay !== utcDay(now)) return { ok: false, error: t.scaduto, summary };

  // La stessa immagine vale solo per chi l'ha fatta e solo il giorno del suo eroe:
  // chi ritira la richiesta e la ricarica non va respinto, chi usa quella di un
  // altro o una vecchia si'.
  const hash = createHash("sha256").update(bytes).digest("hex");
  const earlier = await db.query.powerVerifications.findMany({
    where: and(eq(powerVerifications.screenshotHash, hash), ne(powerVerifications.id, current.id)),
    columns: { userId: true, challengeDay: true },
  });
  if (earlier.some((row) => row.userId !== viewer.id || row.challengeDay !== current.challengeDay)) {
    return { ok: false, error: t.giaUsata, summary };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(powerVerifications)
      .set({ status: "PENDING", declaredPower: power, screenshotHash: hash, submittedAt: now })
      .where(eq(powerVerifications.id, current.id));
    await tx
      .insert(verificationScreenshots)
      .values({ verificationId: current.id, mime, bytes })
      .onConflictDoUpdate({ target: verificationScreenshots.verificationId, set: { mime, bytes } });
  });

  revalidatePath("/moderazione");
  return { ok: true, summary: await verificationSummary(viewer.id, gameId, now) };
}

/** Ritira la verifica in corso (eroe del giorno o schermata in attesa): la schermata si cancella. */
export async function cancelVerificationAction(gameSlug: string): Promise<VerificationResult> {
  const { t, viewer, error } = await context();
  if (!viewer) return { ok: false, error };

  const gameId = await gameIdBySlug(gameSlug);
  if (!gameId) return { ok: false, error: t.giocoSconosciuto };
  const account = await findGameAccount(viewer.id, gameId);
  if (!account) return { ok: false, error: t.nienteDaRitirare };
  const ids = await liveVerificationIds(account.id);
  if (ids.length === 0) return { ok: false, error: t.nienteDaRitirare };

  await db.transaction(async (tx) => {
    await tx.delete(verificationScreenshots).where(inArray(verificationScreenshots.verificationId, ids));
    await tx
      .update(powerVerifications)
      .set({ status: "CANCELLED" })
      .where(inArray(powerVerifications.id, ids));
  });

  revalidatePath("/moderazione");
  return { ok: true, summary: await verificationSummary(viewer.id, gameId) };
}

/* ---------------------------------------------------------- moderazione -- */

export interface ReviewResult {
  readonly ok: boolean;
  readonly error?: string;
  readonly message?: string;
}

/**
 * La decisione del moderatore. Nel modulo: `id`, `decision` (approve o reject),
 * `power` (la classe letta nella schermata, per approvare), `note` (il motivo,
 * per rifiutare). La classe letta diventa quella dell'account, anche nel
 * browser dell'utente alla prossima sincronizzazione.
 */
export async function reviewVerificationAction(formData: FormData): Promise<ReviewResult> {
  const { t, viewer } = await context();
  if (!viewer || !can(viewer.role, "moderate")) return { ok: false, error: t.nonHaiPermessi };

  const id = String(formData.get("id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || (decision !== "approve" && decision !== "reject")) {
    return { ok: false, error: t.datiNonValidi };
  }

  const row = await db.query.powerVerifications.findFirst({
    where: and(eq(powerVerifications.id, id), eq(powerVerifications.status, "PENDING")),
    with: { gameAccount: true },
  });
  if (!row) return { ok: false, error: t.verificaInesistente };
  if (row.userId === viewer.id) return { ok: false, error: t.nonLaTua };

  const now = new Date();
  if (decision === "approve") {
    const power = Number(formData.get("power"));
    if (!Number.isInteger(power) || power < 1 || power > POWER_MAX) return { ok: false, error: t.classeNonValida };
    const setup = parseSetup(row.gameAccount.setup ? JSON.stringify(row.gameAccount.setup) : null);

    await db.transaction(async (tx) => {
      await tx
        .update(powerVerifications)
        .set({ status: "APPROVED", verifiedPower: power, reviewerId: viewer.id, reviewedAt: now })
        .where(eq(powerVerifications.id, row.id));
      await tx.delete(verificationScreenshots).where(eq(verificationScreenshots.verificationId, row.id));
      await tx
        .update(gameAccounts)
        .set({
          verifiedPower: power,
          verifiedAt: now,
          trust: "VERIFIED",
          accountPower: power,
          setup: { ...setup, power } as unknown as Record<string, unknown>,
          updatedAt: now,
        })
        .where(eq(gameAccounts.id, row.gameAccountId));
      await tx.insert(notifications).values({
        userId: row.userId,
        actorId: viewer.id,
        type: "POWER_VERIFIED",
        verificationId: row.id,
      });
    });
    revalidatePath("/moderazione");
    return { ok: true, message: t.approvata };
  }

  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (note.length < 3) return { ok: false, error: t.serveMotivo };
  await db.transaction(async (tx) => {
    await tx
      .update(powerVerifications)
      .set({ status: "REJECTED", note, reviewerId: viewer.id, reviewedAt: now })
      .where(eq(powerVerifications.id, row.id));
    await tx.delete(verificationScreenshots).where(eq(verificationScreenshots.verificationId, row.id));
    await tx.insert(notifications).values({
      userId: row.userId,
      actorId: viewer.id,
      type: "POWER_REJECTED",
      verificationId: row.id,
    });
  });
  revalidatePath("/moderazione");
  return { ok: true, message: t.rifiutata };
}
