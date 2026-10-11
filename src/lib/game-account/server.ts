/**
 * L'account di gioco nel database: letture per la pagina «Il mio account», per
 * la sincronizzazione col browser e per la coda dei moderatori.
 *
 * Solo server (usa il database). Le scritture stanno in `actions.ts`, le regole
 * pure in `src/lib/games/game-account.ts`.
 *
 * Una riga di `game_accounts` per utente e gioco, per ora: lo schema ne ammette
 * piu' d'una (account secondari), la pagina ne gestisce una sola e prende la
 * prima creata.
 */

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { gameAccounts, games, powerVerifications } from "@/lib/db/schema";
import { parseSetup, type AccountSetup } from "@/lib/games/account-setup";
import {
  cleanProfile,
  challengePool,
  MAX_REROLLS,
  nextVerificationAt,
  utcDay,
  type GameAccountProfile,
} from "@/lib/games/game-account";
import { parseBox, type HeroBox } from "@/lib/games/hero-box";
import { getGameModule } from "@/lib/games/registry";

/** La copia del database, nella forma che il browser salva. */
export interface ServerAccountCopy {
  readonly profile: GameAccountProfile;
  readonly setup: AccountSetup;
  /** gli eroi che ha e a che punto sono (10/10) */
  readonly box: HeroBox;
  /** millisecondi: si confronta col timbro del browser */
  readonly updatedAt: number;
}

/** La verifica in corso: l'eroe del giorno da mettere nei preferiti, o la schermata in attesa. */
export interface CurrentVerification {
  readonly id: string;
  readonly status: "OPEN" | "PENDING";
  readonly challengeDay: string;
  readonly challengeHeroId: string;
  readonly rerollsLeft: number;
  readonly declaredPower: number | null;
  readonly submittedAt: string | null;
}

export interface VerificationSummary {
  readonly verifiedPower: number | null;
  readonly verifiedAt: string | null;
  readonly current: CurrentVerification | null;
  /** l'ultima decisione, se e' un rifiuto venuto dopo l'ultima conferma */
  readonly rejected: { readonly note: string | null; readonly reviewedAt: string } | null;
  /**
   * Da quando si puo' chiedere una nuova verifica, se non ancora: una settimana
   * dall'ultima approvata (VERIFICATION_COOLDOWN_DAYS). Si legge dalle richieste
   * e non da `verifiedAt` dell'account, che un cambio di Codice amico azzera:
   * togliere e rimettere il codice non accorcia l'attesa.
   */
  readonly nextRequestAt: string | null;
}

export const EMPTY_SUMMARY: VerificationSummary = {
  verifiedPower: null,
  verifiedAt: null,
  current: null,
  rejected: null,
  nextRequestAt: null,
};

type GameAccountRow = typeof gameAccounts.$inferSelect;

// l'id di un gioco non cambia mentre il server gira: lo chiedevano tutte le
// pagine del gioco per chi e' entrato, una query in piu' a ogni richiesta (11/10)
const gameIds = new Map<string, string>();

export async function gameIdBySlug(slug: string): Promise<string | null> {
  // lo slug arriva dalle azioni, cioe' dal browser: qualunque cosa che non sia
  // uno slug plausibile e' «gioco sconosciuto», non un errore del database
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,64}$/.test(slug)) return null;
  const known = gameIds.get(slug);
  if (known) return known;
  const row = await db.query.games.findFirst({ where: eq(games.slug, slug), columns: { id: true } });
  if (row) gameIds.set(slug, row.id);
  return row?.id ?? null;
}

export async function findGameAccount(userId: string, gameId: string): Promise<GameAccountRow | null> {
  const row = await db.query.gameAccounts.findFirst({
    where: and(eq(gameAccounts.userId, userId), eq(gameAccounts.gameId, gameId)),
    orderBy: [asc(gameAccounts.createdAt)],
  });
  return row ?? null;
}

export function copyOf(row: GameAccountRow): ServerAccountCopy {
  return {
    profile: cleanProfile({ nickname: row.nickname ?? "", friendCode: row.uid, server: row.region }),
    // la stessa lettura controllata del browser: il campo jsonb e' scritto da noi, ma
    // una versione vecchia del sito potrebbe averci lasciato altro
    setup: parseSetup(row.setup ? JSON.stringify(row.setup) : null),
    box: parseBox(row.box ?? null),
    updatedAt: row.updatedAt.getTime(),
  };
}

/** La copia del database per la sincronizzazione; null se non c'e' o il database non risponde. */
export async function accountCopy(userId: string, gameSlug: string): Promise<ServerAccountCopy | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const gameId = await gameIdBySlug(gameSlug);
    if (!gameId) return null;
    const row = await findGameAccount(userId, gameId);
    return row ? copyOf(row) : null;
  } catch {
    return null;
  }
}

export async function verificationSummary(
  userId: string,
  gameId: string,
  now: Date = new Date(),
): Promise<VerificationSummary> {
  const account = await findGameAccount(userId, gameId);
  if (!account) return EMPTY_SUMMARY;

  const rows = await db.query.powerVerifications.findMany({
    where: and(eq(powerVerifications.userId, userId), eq(powerVerifications.gameAccountId, account.id)),
    orderBy: [desc(powerVerifications.createdAt)],
    limit: 10,
  });

  const today = utcDay(now);
  const live = rows.find(
    (row) => row.status === "PENDING" || (row.status === "OPEN" && row.challengeDay === today),
  );
  const decided = rows.find((row) => row.status === "APPROVED" || row.status === "REJECTED");
  // l'ultima approvata a parte: fra le ultime dieci richieste potrebbe non esserci
  const approved = await db.query.powerVerifications.findFirst({
    where: and(eq(powerVerifications.gameAccountId, account.id), eq(powerVerifications.status, "APPROVED")),
    orderBy: [desc(powerVerifications.reviewedAt)],
    columns: { reviewedAt: true },
  });

  return {
    verifiedPower: account.verifiedPower,
    verifiedAt: account.verifiedAt?.toISOString() ?? null,
    current: live
      ? {
          id: live.id,
          status: live.status as "OPEN" | "PENDING",
          challengeDay: live.challengeDay,
          challengeHeroId: live.challengeHeroId,
          rerollsLeft: Math.max(0, MAX_REROLLS - live.skippedHeroIds.length),
          declaredPower: live.declaredPower,
          submittedAt: live.submittedAt?.toISOString() ?? null,
        }
      : null,
    rejected:
      decided?.status === "REJECTED" && decided.reviewedAt
        ? { note: decided.note, reviewedAt: decided.reviewedAt.toISOString() }
        : null,
    nextRequestAt: nextVerificationAt(approved?.reviewedAt ?? null, now)?.toISOString() ?? null,
  };
}

/** Il bacino dell'eroe del giorno per un gioco: vuoto se il modulo non ha roster. */
export function challengePoolFor(gameSlug: string): string[] {
  const gameModule = getGameModule(gameSlug);
  if (!gameModule?.roster) return [];
  const context = gameModule.heroContext;
  return challengePool(gameModule.roster.heroes, (heroId) => context?.heroes[heroId]?.factions);
}

/* ---------------------------------------------------------- moderazione -- */

export interface QueueItem {
  readonly id: string;
  readonly gameSlug: string;
  readonly username: string;
  readonly displayName: string;
  readonly nickname: string;
  readonly friendCode: string;
  readonly server: string;
  readonly challengeDay: string;
  readonly challengeHeroId: string;
  readonly skippedHeroIds: readonly string[];
  readonly declaredPower: number | null;
  readonly submittedAt: string | null;
  /** la classe confermata l'ultima volta, per confronto */
  readonly previousPower: number | null;
  readonly previousAt: string | null;
}

/** Le schermate che aspettano un moderatore, dalla piu' vecchia. */
export async function verificationQueue(): Promise<QueueItem[]> {
  const rows = await db.query.powerVerifications.findMany({
    where: eq(powerVerifications.status, "PENDING"),
    orderBy: [asc(powerVerifications.submittedAt)],
    limit: 50,
    with: {
      user: { columns: { username: true }, with: { profile: { columns: { displayName: true } } } },
      game: { columns: { slug: true } },
      gameAccount: true,
    },
  });
  return rows.map((row) => ({
    id: row.id,
    gameSlug: row.game.slug,
    username: row.user.username,
    displayName: row.user.profile?.displayName ?? row.user.username,
    nickname: row.gameAccount.nickname ?? "",
    friendCode: row.gameAccount.uid,
    server: row.gameAccount.region ?? "",
    challengeDay: row.challengeDay,
    challengeHeroId: row.challengeHeroId,
    skippedHeroIds: row.skippedHeroIds,
    declaredPower: row.declaredPower,
    submittedAt: row.submittedAt?.toISOString() ?? null,
    previousPower: row.gameAccount.verifiedPower,
    previousAt: row.gameAccount.verifiedAt?.toISOString() ?? null,
  }));
}

/** Le verifiche ancora aperte (eroe scelto o schermata in attesa) di un account: si chiudono insieme. */
export async function liveVerificationIds(gameAccountId: string): Promise<string[]> {
  const rows = await db.query.powerVerifications.findMany({
    where: and(
      eq(powerVerifications.gameAccountId, gameAccountId),
      inArray(powerVerifications.status, ["OPEN", "PENDING"]),
    ),
    columns: { id: true },
  });
  return rows.map((row) => row.id);
}
