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

export async function getHeroRatingSummary(
  gameSlug: string,
  heroId: string,
  currentUserId?: string | null,
): Promise<HeroRatingSummary> {
  if (!(await databaseReachable())) {
    return emptyRatingSummary(heroId);
  }

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, gameSlug),
    columns: { id: true },
  });
  if (!gameRow) return emptyRatingSummary(heroId);

  // 1. Statistiche aggregate (media PvE, media PvP, totale)
  const [stats] = await db
    .select({
      count: sql<number>`count(*)::int`,
      pveAvg: sql<number | null>`round(avg(${heroRatings.pveScore})::numeric, 1)::float`,
      pvpAvg: sql<number | null>`round(avg(${heroRatings.pvpScore})::numeric, 1)::float`,
    })
    .from(heroRatings)
    .where(and(eq(heroRatings.gameId, gameRow.id), eq(heroRatings.heroId, heroId)));

  const totalRatings = stats?.count ?? 0;
  const pveAvg = stats?.pveAvg ?? 0;
  const pvpAvg = stats?.pvpAvg ?? 0;

  if (totalRatings === 0) {
    return emptyRatingSummary(heroId);
  }

  // 2. Distribuzione del contenuto in cui spicca di piu'
  const distributionRows = await db
    .select({
      content: heroRatings.bestContent,
      count: sql<number>`count(*)::int`,
    })
    .from(heroRatings)
    .where(
      and(
        eq(heroRatings.gameId, gameRow.id),
        eq(heroRatings.heroId, heroId),
        sql`${heroRatings.bestContent} IS NOT NULL AND ${heroRatings.bestContent} != ''`,
      ),
    )
    .groupBy(heroRatings.bestContent)
    .orderBy(desc(sql`count(*)`));

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

  // 3. Valutazione dell'utente corrente (se presente)
  let userRating: UserRatingRecord | null = null;
  if (currentUserId) {
    const userRow = await db.query.heroRatings.findFirst({
      where: and(
        eq(heroRatings.gameId, gameRow.id),
        eq(heroRatings.heroId, heroId),
        eq(heroRatings.userId, currentUserId),
      ),
    });
    if (userRow) {
      userRating = {
        id: userRow.id,
        pveScore: userRow.pveScore,
        pvpScore: userRow.pvpScore,
        bestContent: (userRow.bestContent as BestContentKey) ?? null,
        comment: userRow.comment ?? null,
        createdAt: userRow.createdAt.toISOString(),
        updatedAt: userRow.updatedAt.toISOString(),
      };
    }
  }

  // 4. Recenti recensioni con dettagli utente
  const recentRows = await db
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
    .where(and(eq(heroRatings.gameId, gameRow.id), eq(heroRatings.heroId, heroId)))
    .orderBy(desc(heroRatings.updatedAt))
    .limit(20);

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
