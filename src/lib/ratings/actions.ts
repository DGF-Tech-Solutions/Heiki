"use server";

/**
 * Azioni server per il salvataggio e la cancellazione delle valutazioni degli eroi.
 */

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { games, heroRatings } from "@/lib/db/schema";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { BEST_CONTENT_KEYS, type BestContentKey } from "./types";

export interface RatingActionState {
  error?: string;
  success?: boolean;
}

const TESTI = testi({
  it: {
    serveDatabase: "Le valutazioni sono disponibili solo col database attivo.",
    accedi: "Devi accedere per valutare questo eroe.",
    sospeso: "Non puoi inviare valutazioni perché il tuo account è sospeso.",
    limite: "Troppe richieste. Riprova tra poco.",
    datiNonValidi: "Dati della valutazione non validi.",
    giocoNonTrovato: "Gioco non trovato.",
    eroeNonTrovato: "Eroe non trovato nel roster di gioco.",
    pveObbligatorio: "Seleziona un voto PvE da 1 a 5 stelle.",
    pvpObbligatorio: "Seleziona un voto PvP da 1 a 5 stelle.",
    commentoLungo: "Il commento non può superare i 280 caratteri.",
    salvato: "Valutazione salvata con successo.",
    rimosso: "Valutazione rimossa.",
  },
  en: {
    serveDatabase: "Ratings are only available when the database is active.",
    accedi: "You must be logged in to rate this hero.",
    sospeso: "You cannot submit ratings because your account is suspended.",
    limite: "Too many requests. Please try again soon.",
    datiNonValidi: "Invalid rating data.",
    giocoNonTrovato: "Game not found.",
    eroeNonTrovato: "Hero not found in the game roster.",
    pveObbligatorio: "Please select a PvE rating between 1 and 5 stars.",
    pvpObbligatorio: "Please select a PvP rating between 1 and 5 stars.",
    commentoLungo: "Comment cannot exceed 280 characters.",
    salvato: "Rating saved successfully.",
    rimosso: "Rating removed.",
  },
});

const ratingInputSchema = (t: (typeof TESTI)["it"]) =>
  z.object({
    game: z.string().refine((slug) => getGameModule(slug) !== undefined, t.giocoNonTrovato),
    heroId: z.string().min(1).max(32),
    pveScore: z.coerce.number().int().min(1, t.pveObbligatorio).max(5, t.pveObbligatorio),
    pvpScore: z.coerce.number().int().min(1, t.pvpObbligatorio).max(5, t.pvpObbligatorio),
    bestContent: z
      .string()
      .optional()
      .transform((val) => (val && val.trim() ? (val.trim() as BestContentKey) : null))
      .refine(
        (val) => val === null || (BEST_CONTENT_KEYS as readonly string[]).includes(val),
        t.datiNonValidi,
      ),
    comment: z
      .string()
      .optional()
      .transform((val) => (val && val.trim() ? val.trim() : null))
      .refine((val) => val === null || val.length <= 280, t.commentoLungo),
  });

export async function saveHeroRatingAction(
  _prevState: RatingActionState,
  formData: FormData,
): Promise<RatingActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { error: t.serveDatabase };
  }

  const viewer = await currentViewer();
  if (!viewer || viewer.id === "guest") {
    return { error: t.accedi };
  }

  const suspension = await suspensionFor(viewer.id);
  if (suspension) {
    return { error: suspensionMessage(suspension, locale) };
  }

  const limit = rateLimit("heroRating", viewer.id);
  if (!limit.allowed) {
    return { error: retryMessage(limit, locale) };
  }

  const parsed = ratingInputSchema(t).safeParse({
    game: formData.get("game"),
    heroId: formData.get("heroId"),
    pveScore: formData.get("pveScore"),
    pvpScore: formData.get("pvpScore"),
    bestContent: formData.get("bestContent"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message ?? t.datiNonValidi };
  }

  const { game, heroId, pveScore, pvpScore, bestContent, comment } = parsed.data;

  const gameModule = getGameModule(game);
  if (!gameModule || !gameModule.roster) return { error: t.giocoNonTrovato };

  const heroExists = gameModule.roster.heroes.some((h) => h.id === heroId);
  if (!heroExists) return { error: t.eroeNonTrovato };

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, game),
    columns: { id: true },
  });
  if (!gameRow) return { error: t.giocoNonTrovato };

  const now = new Date();
  await db
    .insert(heroRatings)
    .values({
      gameId: gameRow.id,
      heroId,
      userId: viewer.id,
      pveScore,
      pvpScore,
      bestContent: bestContent ?? null,
      comment: comment ?? null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [heroRatings.gameId, heroRatings.heroId, heroRatings.userId],
      set: {
        pveScore,
        pvpScore,
        bestContent: bestContent ?? null,
        comment: comment ?? null,
        updatedAt: now,
      },
    });

  revalidatePath(`/${game}/eroi/${heroId}`);
  return { success: true };
}

export async function deleteHeroRatingAction(
  _prevState: RatingActionState,
  formData: FormData,
): Promise<RatingActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { error: t.serveDatabase };
  }

  const viewer = await currentViewer();
  if (!viewer || viewer.id === "guest") {
    return { error: t.accedi };
  }

  const game = String(formData.get("game") ?? "");
  const heroId = String(formData.get("heroId") ?? "");
  if (!game || !heroId) return { error: t.datiNonValidi };

  const gameModule = getGameModule(game);
  if (!gameModule || !gameModule.roster) return { error: t.giocoNonTrovato };

  const heroExists = gameModule.roster.heroes.some((h) => h.id === heroId);
  if (!heroExists) return { error: t.eroeNonTrovato };

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, game),
    columns: { id: true },
  });
  if (!gameRow) return { error: t.giocoNonTrovato };

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
