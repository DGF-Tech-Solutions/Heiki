"use server";

/**
 * Server Actions delle Tier List salvate sull'account: salvare, eliminare,
 * elencare e scaricare il backup.
 *
 * Ogni funzione esportata qui e' raggiungibile dal browser con qualunque
 * argomento, anche senza passare dal Maker: per questo ognuna controlla da se'
 * chi chiama e cosa riceve. Lo schema della lista sta in validation.ts, lo
 * stesso che il Maker usa per il link `#data=` e per la bozza locale.
 *
 * Il ripristino da backup c'era ed e' stato tolto il 24/10: nessuna pagina lo
 * usava, e accettava qualunque file senza controlli e senza tetto, anche da un
 * account sospeso, rendendo pubblica ogni lista. Il download del backup resta.
 */

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { games, userTierLists } from "@/lib/db/schema";
import { getGameModule } from "@/lib/games/registry";
import type { GameModule } from "@/lib/games/types";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { requireActive } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { exportUserTierListsBackup, getTierListById, getUserTierLists } from "./server";
import type { SavedTierListDetail, SavedTierListSummary, TierListBackupFile } from "./types";
import {
  parseTierListId,
  saveTierListSchema,
  TIER_LIST_LIMITS,
  tierListProblem,
  type TierListProblem,
} from "./validation";

export interface TierListActionResult {
  ok: boolean;
  error?: string;
  tierListId?: string;
  /** la lista come e' stata salvata, righe comprese: il Maker la rimette nell'elenco cosi' com'e' */
  tierList?: SavedTierListDetail;
}

const TESTI = testi({
  it: {
    // 24/10: il verbo del sito e' «Entra», e ogni errore dice cosa fare dopo
    serveDatabase: "Il database non risponde: la lista non è salvata. Riprova tra qualche minuto.",
    accediSalvare: "Entra per salvare la tier list sul tuo account.",
    accediEliminare: "Entra per eliminare questa tier list.",
    giocoNonValido: "Questo gioco non ha una tier list: ricarica la pagina e riprova.",
    nonTrovata: "Tier list non trovata, o non è tua: ricarica l'elenco e riprova.",
    troppe: (n: number) =>
      `Hai già ${n} tier list salvate per questo gioco: eliminane una per salvarne un'altra.`,
    erroreSalvataggio: "La lista non è stata salvata. Riprova tra poco.",
    problemi: {
      invalid: "La lista ha dati che il sito non riconosce: ricarica la pagina e riprova.",
      "title-missing": "Inserisci un nome per la tua tier list.",
      "title-long": `Il nome non può superare i ${TIER_LIST_LIMITS.title} caratteri.`,
      "description-long": `La descrizione non può superare i ${TIER_LIST_LIMITS.description} caratteri.`,
      "rows-empty": "La tier list deve contenere almeno una riga.",
      "rows-many": `Una tier list può avere al massimo ${TIER_LIST_LIMITS.rows} righe.`,
      row: "Una riga della tier list non è valida.",
      label: `Ogni riga ha bisogno di un nome, lungo al massimo ${TIER_LIST_LIMITS.label} caratteri.`,
      color: "Una riga ha un colore che il sito non offre: scegline un altro dal menu della riga.",
      "hero-unknown": "Nella tier list c'è un eroe che questo gioco non ha.",
      "hero-duplicate": "Un eroe compare più di una volta nella tier list.",
    } satisfies Record<TierListProblem, string>,
  },
  en: {
    serveDatabase: "The database isn't responding: the list is not saved. Try again in a few minutes.",
    accediSalvare: "Log in to save the tier list to your account.",
    accediEliminare: "Log in to delete this tier list.",
    giocoNonValido: "This game has no tier list: reload the page and try again.",
    nonTrovata: "Tier list not found, or not yours: reload the list and try again.",
    troppe: (n: number) =>
      `You already have ${n} saved tier lists for this game: delete one to save another.`,
    erroreSalvataggio: "The list was not saved. Try again shortly.",
    problemi: {
      invalid: "The list has data the site doesn't recognise: reload the page and try again.",
      "title-missing": "Enter a name for your tier list.",
      "title-long": `The name can't be longer than ${TIER_LIST_LIMITS.title} characters.`,
      "description-long": `The description can't be longer than ${TIER_LIST_LIMITS.description} characters.`,
      "rows-empty": "The tier list needs at least one row.",
      "rows-many": `A tier list can have at most ${TIER_LIST_LIMITS.rows} rows.`,
      row: "A row of the tier list is not valid.",
      label: `Every row needs a name of at most ${TIER_LIST_LIMITS.label} characters.`,
      color: "A row has a color the site doesn't offer: pick another from the row's menu.",
      "hero-unknown": "The tier list contains a hero this game doesn't have.",
      "hero-duplicate": "A hero appears more than once in the tier list.",
    },
  },
});

/**
 * Il modulo del gioco nominato dalla richiesta, prima di controllare il resto:
 * gli eroi ammessi nella lista sono quelli del suo roster.
 */
function requestedGame(raw: unknown): GameModule | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const game = (raw as { game?: unknown }).game;
  return typeof game === "string" ? getGameModule(game) : undefined;
}

/**
 * Salva o aggiorna una tier list legata all'account dell'utente loggato.
 */
export async function saveTierListAction(rawInput: unknown): Promise<TierListActionResult> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { ok: false, error: t.serveDatabase };
  }

  const viewer = await currentViewer();
  if (!viewer) {
    return { ok: false, error: t.accediSalvare };
  }

  // suspensionFor restituisce sempre un oggetto ({active: false} per chi e' in
  // regola): fino al 24/10 il controllo era `if (suspension)`, sempre vero, e
  // nessuno poteva salvare. requireActive guarda `.active` e da' il messaggio.
  const suspended = await requireActive(viewer.id, locale);
  if (suspended) {
    return { ok: false, error: suspended };
  }

  const limitCheck = rateLimit("tierListSave", viewer.id);
  if (!limitCheck.allowed) {
    return { ok: false, error: retryMessage(limitCheck, locale) };
  }

  const gameModule = requestedGame(rawInput);
  if (!gameModule?.roster) {
    return { ok: false, error: t.giocoNonValido };
  }

  const roster = new Set(gameModule.roster.heroes.map((hero) => hero.id));
  const parseResult = saveTierListSchema(roster).safeParse(rawInput);
  if (!parseResult.success) {
    return { ok: false, error: t.problemi[tierListProblem(parseResult.error)] };
  }

  const input = parseResult.data;

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, gameModule.slug),
    columns: { id: true },
  });
  if (!gameRow) {
    return { ok: false, error: t.giocoNonValido };
  }

  // Con un id si aggiorna: la lista deve esistere, essere dell'utente e dello
  // stesso gioco (gli eroi sono stati controllati sul roster di questo)
  if (input.id) {
    const owned = and(
      eq(userTierLists.id, input.id),
      eq(userTierLists.userId, viewer.id),
      eq(userTierLists.gameId, gameRow.id),
    );
    const existing = await db.query.userTierLists.findFirst({
      where: owned,
      columns: { id: true },
    });

    if (!existing) {
      return { ok: false, error: t.nonTrovata };
    }

    await db
      .update(userTierLists)
      .set({
        title: input.title,
        description: input.description ?? null,
        data: input.tiers,
        isPublic: input.isPublic,
        updatedAt: new Date(),
      })
      .where(owned);

    revalidatePath(`/${gameModule.slug}/tierlist`);
    revalidatePath(`/u/${viewer.username}`);

    const detail = await getTierListById(input.id, viewer.id);
    return { ok: true, tierListId: input.id, tierList: detail ?? undefined };
  }

  // Il tetto vale alla creazione: chi e' al limite puo' ancora modificare le sue
  const count = await db.$count(
    userTierLists,
    and(eq(userTierLists.userId, viewer.id), eq(userTierLists.gameId, gameRow.id)),
  );
  if (count >= TIER_LIST_LIMITS.listsPerGame) {
    return { ok: false, error: t.troppe(TIER_LIST_LIMITS.listsPerGame) };
  }

  const [created] = await db
    .insert(userTierLists)
    .values({
      userId: viewer.id,
      gameId: gameRow.id,
      title: input.title,
      description: input.description ?? null,
      data: input.tiers,
      isPublic: input.isPublic,
    })
    .returning({ id: userTierLists.id });

  if (!created) {
    return { ok: false, error: t.erroreSalvataggio };
  }

  revalidatePath(`/${gameModule.slug}/tierlist`);
  revalidatePath(`/u/${viewer.username}`);

  const detail = await getTierListById(created.id, viewer.id);
  return { ok: true, tierListId: created.id, tierList: detail ?? undefined };
}

/**
 * Elimina una tier list salvata dall'utente.
 */
export async function deleteTierListAction(rawId: unknown): Promise<TierListActionResult> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { ok: false, error: t.serveDatabase };
  }

  const viewer = await currentViewer();
  if (!viewer) {
    return { ok: false, error: t.accediEliminare };
  }

  // anche eliminare e' scrivere: un account sospeso non tocca le sue liste
  const suspended = await requireActive(viewer.id, locale);
  if (suspended) {
    return { ok: false, error: suspended };
  }

  // un id che non e' un UUID farebbe fallire la query: vale come una lista che non c'e'
  const id = parseTierListId(rawId);
  if (!id) {
    return { ok: false, error: t.nonTrovata };
  }

  const existing = await db.query.userTierLists.findFirst({
    where: and(eq(userTierLists.id, id), eq(userTierLists.userId, viewer.id)),
    with: { game: { columns: { slug: true } } },
  });

  if (!existing) {
    return { ok: false, error: t.nonTrovata };
  }

  await db
    .delete(userTierLists)
    .where(and(eq(userTierLists.id, id), eq(userTierLists.userId, viewer.id)));

  revalidatePath(`/${existing.game.slug}/tierlist`);
  revalidatePath(`/u/${viewer.username}`);

  return { ok: true };
}

/**
 * Recupera l'elenco delle tier list salvate dell'utente corrente.
 */
export async function getMyTierListsAction(gameSlug?: unknown): Promise<SavedTierListSummary[]> {
  const viewer = await currentViewer();
  if (!viewer) return [];
  // solo uno slug di un gioco registrato arriva alla query; senza, tutte le liste
  if (gameSlug === undefined) return getUserTierLists(viewer.id);
  if (typeof gameSlug !== "string" || !getGameModule(gameSlug)) return [];
  return getUserTierLists(viewer.id, gameSlug);
}

/**
 * Scarica il backup completo in formato JSON per l'utente loggato.
 */
export async function getTierListBackupAction(): Promise<TierListBackupFile | null> {
  const viewer = await currentViewer();
  if (!viewer) return null;
  return exportUserTierListsBackup(viewer.id);
}
