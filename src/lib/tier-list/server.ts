/**
 * Operazioni database server per il salvataggio e recupero delle Tier List.
 */

import { and, desc, eq } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { games, users, userTierLists } from "@/lib/db/schema";
import type {
  SavedTierListDetail,
  SavedTierListSummary,
  TierListBackupFile,
  TierRow,
} from "./types";

function extractTopHeroIds(tiers: TierRow[], limit = 6): string[] {
  const result: string[] = [];
  for (const tier of tiers) {
    if (Array.isArray(tier.heroIds)) {
      for (const hid of tier.heroIds) {
        if (!result.includes(hid)) {
          result.push(hid);
          if (result.length >= limit) return result;
        }
      }
    }
  }
  return result;
}

function countHeroes(tiers: TierRow[]): number {
  let count = 0;
  for (const tier of tiers) {
    if (Array.isArray(tier.heroIds)) {
      count += tier.heroIds.length;
    }
  }
  return count;
}

/**
 * Recupera l'elenco delle tier list salvate da un utente (per un gioco o per tutti).
 */
export async function getUserTierLists(
  userId: string,
  gameSlug?: string,
): Promise<SavedTierListSummary[]> {
  if (!(await databaseReachable())) return [];

  let gameId: string | undefined;
  if (gameSlug) {
    const gameRow = await db.query.games.findFirst({
      where: eq(games.slug, gameSlug),
      columns: { id: true },
    });
    if (!gameRow) return [];
    gameId = gameRow.id;
  }

  const rows = await db.query.userTierLists.findMany({
    where: gameId
      ? and(eq(userTierLists.userId, userId), eq(userTierLists.gameId, gameId))
      : eq(userTierLists.userId, userId),
    orderBy: [desc(userTierLists.updatedAt)],
    with: {
      game: { columns: { slug: true, name: true } },
      user: {
        columns: { id: true, username: true, role: true },
        with: { profile: { columns: { displayName: true } } },
      },
    },
  });

  return rows.map((row) => {
    const tiers = (row.data as TierRow[]) ?? [];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      game: row.game.slug,
      gameName: row.game.name,
      isPublic: row.isPublic,
      heroCount: countHeroes(tiers),
      tierCount: tiers.length,
      topHeroIds: extractTopHeroIds(tiers),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      author: {
        id: row.user.id,
        username: row.user.username,
        displayName: row.user.profile?.displayName ?? row.user.username,
        role: row.user.role,
      },
      isOwner: true,
    };
  });
}

/**
 * Recupera una specifica tier list tramite ID per la visualizzazione o modifica.
 */
export async function getTierListById(
  id: string,
  viewerUserId?: string | null,
): Promise<SavedTierListDetail | null> {
  if (!(await databaseReachable())) return null;

  const row = await db.query.userTierLists.findFirst({
    where: eq(userTierLists.id, id),
    with: {
      game: { columns: { slug: true, name: true } },
      user: {
        columns: { id: true, username: true, role: true },
        with: { profile: { columns: { displayName: true } } },
      },
    },
  });

  if (!row) return null;

  const isOwner = Boolean(viewerUserId && viewerUserId === row.userId);
  if (!row.isPublic && !isOwner) {
    return null;
  }

  const tiers = (row.data as TierRow[]) ?? [];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    game: row.game.slug,
    gameName: row.game.name,
    isPublic: row.isPublic,
    heroCount: countHeroes(tiers),
    tierCount: tiers.length,
    topHeroIds: extractTopHeroIds(tiers),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    author: {
      id: row.user.id,
      username: row.user.username,
      displayName: row.user.profile?.displayName ?? row.user.username,
      role: row.user.role,
    },
    isOwner,
    tiers,
  };
}

/**
 * Recupera le tier list visibili nel profilo di un utente (per username).
 */
export async function getUserProfileTierLists(
  username: string,
  viewerUserId?: string | null,
): Promise<SavedTierListSummary[]> {
  if (!(await databaseReachable())) return [];

  const targetUser = await db.query.users.findFirst({
    where: eq(users.username, username.toLowerCase()),
    columns: { id: true, username: true, role: true },
    with: { profile: { columns: { displayName: true } } },
  });
  if (!targetUser) return [];

  const isOwner = Boolean(viewerUserId && viewerUserId === targetUser.id);

  const rows = await db.query.userTierLists.findMany({
    where: isOwner
      ? eq(userTierLists.userId, targetUser.id)
      : and(eq(userTierLists.userId, targetUser.id), eq(userTierLists.isPublic, true)),
    orderBy: [desc(userTierLists.updatedAt)],
    with: {
      game: { columns: { slug: true, name: true } },
    },
  });

  return rows.map((row) => {
    const tiers = (row.data as TierRow[]) ?? [];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      game: row.game.slug,
      gameName: row.game.name,
      isPublic: row.isPublic,
      heroCount: countHeroes(tiers),
      tierCount: tiers.length,
      topHeroIds: extractTopHeroIds(tiers),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      author: {
        id: targetUser.id,
        username: targetUser.username,
        displayName: targetUser.profile?.displayName ?? targetUser.username,
        role: targetUser.role,
      },
      isOwner,
    };
  });
}

/**
 * Genera il payload di backup JSON per tutte le tier list salvate dall'utente.
 */
export async function exportUserTierListsBackup(userId: string): Promise<TierListBackupFile | null> {
  if (!(await databaseReachable())) return null;

  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { username: true },
  });
  if (!targetUser) return null;

  const rows = await db.query.userTierLists.findMany({
    where: eq(userTierLists.userId, userId),
    orderBy: [desc(userTierLists.updatedAt)],
    with: {
      game: { columns: { slug: true } },
    },
  });

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    username: targetUser.username,
    tierLists: rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      game: row.game.slug,
      tiers: (row.data as TierRow[]) ?? [],
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })),
  };
}

