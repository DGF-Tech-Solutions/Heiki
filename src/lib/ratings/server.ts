/**
 * Lettura e aggregazione delle valutazioni degli eroi sul database.
 */

import { and, desc, eq, sql } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { games, heroRatings, profiles, users } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import {
  BEST_CONTENTS,
  type BestContentKey,
  type CommunityRatingEntry,
  type ContentDistributionItem,
  type HeroRatingSummary,
  type UserRatingRecord,
} from "./types";

export function emptyRatingSummary(heroId: string): HeroRatingSummary {
  return {
    heroId,
    pveAvg: 0,
    pvpAvg: 0,
    totalRatings: 0,
    distribution: [],
    userRating: null,
    recentRatings: [],
  };
}

/**
 * Chi guarda la pagina, per trovare la sua valutazione: il suo id (lo passa
 * scripts/smoke-db.mts) o l'utente intero come lo da' currentViewer().
 */
type RatingViewer = string | { readonly id: string } | null | undefined;

/**
 * Il riepilogo delle valutazioni di un eroe.
 *
 * `viewer` puo' arrivare come promessa: la pagina lo chiede insieme al
 * riepilogo invece che prima, e solo la lettura della valutazione propria lo
 * aspetta, mentre le altre query sono gia' partite. Si passa la promessa di
 * currentViewer() stessa, che la pagina attende comunque, e non una derivata
 * (`.then(v => v?.id)`): se qui si esce prima di leggerla (database spento,
 * gioco assente), la derivata resterebbe un rifiuto che nessuno raccoglie.
 */
export async function getHeroRatingSummary(
  gameSlug: string,
  heroId: string,
  viewer?: RatingViewer | PromiseLike<RatingViewer>,
): Promise<HeroRatingSummary> {
  if (!(await databaseReachable())) {
    return emptyRatingSummary(heroId);
  }

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, gameSlug),
    columns: { id: true },
  });
  if (!gameRow) return emptyRatingSummary(heroId);

  const thisHero = and(eq(heroRatings.gameId, gameRow.id), eq(heroRatings.heroId, heroId));

  // Le quattro letture dipendono solo dalla riga del gioco: partono insieme.
  // In fila erano cinque viaggi al database a ogni visita della scheda eroe.
  const [[stats], distributionRows, userRow, recentRows] = await Promise.all([
    // 1. Statistiche aggregate (media PvE, media PvP, totale)
    db
      .select({
        count: sql<number>`count(*)::int`,
        pveAvg: sql<number | null>`round(avg(${heroRatings.pveScore})::numeric, 1)::float`,
        pvpAvg: sql<number | null>`round(avg(${heroRatings.pvpScore})::numeric, 1)::float`,
      })
      .from(heroRatings)
      .where(thisHero),

    // 2. Distribuzione del contenuto in cui spicca di piu'
    db
      .select({
        content: heroRatings.bestContent,
        count: sql<number>`count(*)::int`,
      })
      .from(heroRatings)
      .where(
        and(
          thisHero,
          sql`${heroRatings.bestContent} IS NOT NULL AND ${heroRatings.bestContent} != ''`,
        ),
      )
      .groupBy(heroRatings.bestContent)
      .orderBy(desc(sql`count(*)`)),

    // 3. Valutazione di chi guarda (se ha accesso)
    (async () => {
      const who = await viewer;
      const userId = typeof who === "string" ? who : who?.id;
      if (!userId) return undefined;
      return db.query.heroRatings.findFirst({
        where: and(thisHero, eq(heroRatings.userId, userId)),
      });
    })(),

    // 4. Recensioni recenti con i dati di chi le ha scritte
    db
      .select({
        id: heroRatings.id,
        pveScore: heroRatings.pveScore,
        pvpScore: heroRatings.pvpScore,
        bestContent: heroRatings.bestContent,
        comment: heroRatings.comment,
        updatedAt: heroRatings.updatedAt,
        userId: users.id,
        username: users.username,
        role: users.role,
        displayName: profiles.displayName,
        cosmetics: profiles.cosmetics,
      })
      .from(heroRatings)
      .innerJoin(users, eq(heroRatings.userId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(thisHero)
      .orderBy(desc(heroRatings.updatedAt))
      .limit(20),
  ]);

  const totalRatings = stats?.count ?? 0;
  const pveAvg = stats?.pveAvg ?? 0;
  const pvpAvg = stats?.pvpAvg ?? 0;

  if (totalRatings === 0) {
    return emptyRatingSummary(heroId);
  }

  const totalWithContent = distributionRows.reduce((acc, row) => acc + row.count, 0);
  const distribution: ContentDistributionItem[] = [];
  for (const row of distributionRows) {
    if (!row.content) continue;
    const key = row.content as BestContentKey;
    const def = BEST_CONTENTS[key];
    if (def) {
      distribution.push({
        key,
        label: def.label,
        count: row.count,
        percentage: totalWithContent > 0 ? Math.round((row.count / totalWithContent) * 100) : 0,
      });
    }
  }

  const userRating: UserRatingRecord | null = userRow
    ? {
        id: userRow.id,
        pveScore: userRow.pveScore,
        pvpScore: userRow.pvpScore,
        bestContent: (userRow.bestContent as BestContentKey) ?? null,
        comment: userRow.comment ?? null,
        createdAt: userRow.createdAt.toISOString(),
        updatedAt: userRow.updatedAt.toISOString(),
      }
    : null;

  const recentRatings: CommunityRatingEntry[] = recentRows.map((row) => ({
    id: row.id,
    user: {
      id: row.userId,
      username: row.username,
      displayName: row.displayName ?? row.username,
      role: row.role,
      accent: normalizeCustomization(row.cosmetics).accent,
    },
    pveScore: row.pveScore,
    pvpScore: row.pvpScore,
    bestContent: (row.bestContent as BestContentKey) ?? null,
    comment: row.comment ?? null,
    updatedAt: row.updatedAt.toISOString(),
  }));

  return {
    heroId,
    pveAvg,
    pvpAvg,
    totalRatings,
    distribution,
    userRating,
    recentRatings,
  };
}
