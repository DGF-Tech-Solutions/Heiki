"use server";

/**
 * Azioni server per il salvataggio e la cancellazione delle valutazioni degli eroi.
 *
 * Qui solo le due azioni: in un modulo "use server" ogni funzione async
 * esportata e' raggiungibile dal browser, quindi lo schema dei dati sta in
 * validation.ts, che i test possono importare.
 */

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { games, heroRatings } from "@/lib/db/schema";
import { getGameModule } from "@/lib/games/registry";
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { requireActive } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { parseRatingForm } from "./validation";

export interface RatingActionState {
  error?: string;
  success?: boolean;
}

const TESTI = testi({
  it: {
    serveDatabase: "Le valutazioni sono disponibili solo col database attivo.",
    accedi: "Devi accedere per valutare questo eroe.",
    datiNonValidi: "Dati della valutazione non validi.",
    giocoNonTrovato: "Gioco non trovato.",
    eroeNonTrovato: "Eroe non trovato nel roster di gioco.",
  },
  en: {
    serveDatabase: "Ratings are only available when the database is active.",
    accedi: "You must be logged in to rate this hero.",
    datiNonValidi: "Invalid rating data.",
    giocoNonTrovato: "Game not found.",
    eroeNonTrovato: "Hero not found in the game roster.",
  },
});

/**
 * Il cancello comune alle due azioni: database, accesso, sospensione, limite.
 * Restituisce chi scrive, o l'errore da mostrare.
 *
 * Fino al 24/10 la sospensione si controllava con `if (suspension)` sull'oggetto
 * di suspensionFor, che c'e' sempre ({ active: false } per chi e' in regola): il
 * salvataggio rispondeva «account sospeso» a tutti. E la cancellazione non
 * aveva ne' la sospensione ne' il limite: un'azione e' raggiungibile dal
 * browser anche senza la pagina, quindi i controlli stanno in tutte e due.
 */
async function writer(locale: Locale): Promise<{ id: string } | { error: string }> {
  const t = TESTI[locale];

  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { error: t.serveDatabase };
  }

  const viewer = await currentViewer();
  if (!viewer || viewer.id === "guest") {
    return { error: t.accedi };
  }

  const blocked = await requireActive(viewer.id, locale);
  if (blocked) return { error: blocked };

  // salvare e togliere contano insieme: alternarli a macchina e' lo stesso abuso
  const limit = rateLimit("heroRating", viewer.id);
  if (!limit.allowed) {
    return { error: retryMessage(limit, locale) };
  }

  return { id: viewer.id };
}

/** La riga del gioco, se gioco ed eroe esistono nel registro. */
async function ratedGame(
  game: string,
  heroId: string,
  t: (typeof TESTI)[Locale],
): Promise<{ id: string } | { error: string }> {
  const gameModule = getGameModule(game);
  if (!gameModule || !gameModule.roster) return { error: t.giocoNonTrovato };

  const heroExists = gameModule.roster.heroes.some((h) => h.id === heroId);
  if (!heroExists) return { error: t.eroeNonTrovato };

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, game),
    columns: { id: true },
  });
  return gameRow ?? { error: t.giocoNonTrovato };
}

export async function saveHeroRatingAction(
  _prevState: RatingActionState,
  formData: FormData,
): Promise<RatingActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const viewer = await writer(locale);
  if ("error" in viewer) return { error: viewer.error };

  const parsed = parseRatingForm(formData, locale);
  if (!parsed.ok) return { error: parsed.error };

  const { game, heroId, pveScore, pvpScore, bestContent, comment } = parsed.data;

  const gameRow = await ratedGame(game, heroId, t);
  if ("error" in gameRow) return { error: gameRow.error };

  const now = new Date();
  await db
    .insert(heroRatings)
    .values({
      gameId: gameRow.id,
      heroId,
      userId: viewer.id,
      pveScore,
      pvpScore,
      bestContent,
      comment,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [heroRatings.gameId, heroRatings.heroId, heroRatings.userId],
      set: {
        pveScore,
        pvpScore,
        bestContent,
        comment,
        updatedAt: now,
      },
    });

  // la lingua sta in un cookie e non nell'indirizzo: il percorso e' uno solo.
  // Chiamata da un'azione, revalidatePath fa tornare la pagina aggiornata nella
  // stessa risposta: il modulo non deve chiedere un altro giro con router.refresh()
  revalidatePath(`/${game}/eroi/${heroId}`);
  return { success: true };
}

export async function deleteHeroRatingAction(
  _prevState: RatingActionState,
  formData: FormData,
): Promise<RatingActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const viewer = await writer(locale);
  if ("error" in viewer) return { error: viewer.error };

  const game = String(formData.get("game") ?? "");
  const heroId = String(formData.get("heroId") ?? "");
  if (!game || !heroId) return { error: t.datiNonValidi };

  const gameRow = await ratedGame(game, heroId, t);
  if ("error" in gameRow) return { error: gameRow.error };

  await db
    .delete(heroRatings)
    .where(
      and(
        eq(heroRatings.gameId, gameRow.id),
        eq(heroRatings.heroId, heroId),
        eq(heroRatings.userId, viewer.id),
      ),
    );

  revalidatePath(`/${game}/eroi/${heroId}`);
  return { success: true };
}
