"use server";

/**
 * Seguire, smettere di seguire, notifiche.
 *
 * E' il ciclo che riporta la gente sul sito: segui qualcuno, quel qualcuno
 * scrive, tu lo vieni a sapere, torni. Senza questi due pezzi ogni visita
 * riparte da zero e una discussione muore dopo il primo messaggio, perche'
 * nessuno si accorge che e' andata avanti.
 *
 * Richiedono un'identita' vera, quindi funzionano solo con il database attivo:
 * in modalita' dimostrativa si e' "Ospite" e seguire non vorrebbe dire niente.
 */

import { revalidatePath } from "next/cache";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { comments, follows, notifications, posts, users } from "@/lib/db/schema";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

export interface SocialResult {
  ok: boolean;
  error?: string;
}

// Le frasi delle notifiche non stanno qui: si compongono nella pagina
// /notifiche, nella lingua di chi le legge. Qui solo gli esiti delle azioni.
const TESTI = testi({
  it: {
    entraPerSeguire: "Entra per seguire qualcuno.",
    profiloInesistente: "Profilo inesistente.",
    nonTeStesso: "Non puoi seguire te stesso.",
    sessioneScaduta: "Sessione scaduta.",
  },
  en: {
    entraPerSeguire: "Log in to follow someone.",
    profiloInesistente: "This profile doesn't exist.",
    nonTeStesso: "You can't follow yourself.",
    sessioneScaduta: "Your session has expired.",
  },
});

async function currentUserId(): Promise<string | null> {
  if (!(await databaseReachable())) return null;
  const session = await auth();
  return session?.user?.id ?? null;
}

/* ------------------------------------------------------------- seguire -- */

export async function toggleFollowAction(targetUsername: string): Promise<SocialResult> {
  const t = TESTI[await getLocale()];

  const followerId = await currentUserId();
  if (!followerId) return { ok: false, error: t.entraPerSeguire };

  const target = await db.query.users.findFirst({
    where: eq(users.username, targetUsername.toLowerCase()),
    columns: { id: true },
  });
  if (!target) return { ok: false, error: t.profiloInesistente };

  // Seguire se stessi non e' un errore da spiegare: e' un pulsante che non
  // dovrebbe esistere, e qui si limita a non fare niente.
  if (target.id === followerId) return { ok: false, error: t.nonTeStesso };

  const existing = await db.query.follows.findFirst({
    where: and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)),
  });

  if (existing) {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)));
  } else {
    await db.insert(follows).values({ followerId, followingId: target.id });
    await notify(target.id, followerId, "NEW_FOLLOWER", {});
  }

  revalidatePath(`/u/${targetUsername}`);
  return { ok: true };
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const followerId = await currentUserId();
  if (!followerId || followerId === targetUserId) return false;

  const row = await db.query.follows.findFirst({
    where: and(eq(follows.followerId, followerId), eq(follows.followingId, targetUserId)),
    columns: { followerId: true },
  });
  return row != null;
}

export interface FollowCounts {
  followers: number;
  following: number;
}

export async function followCounts(userId: string): Promise<FollowCounts> {
  if (!(await databaseReachable())) return { followers: 0, following: 0 };

  const [followers, following] = await Promise.all([
    db.$count(follows, eq(follows.followingId, userId)),
    db.$count(follows, eq(follows.followerId, userId)),
  ]);
  return { followers, following };
}

/** Id degli utenti seguiti: serve al feed "Seguiti". */
export async function followedUserIds(userId: string): Promise<string[]> {
  const rows = await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
    columns: { followingId: true },
  });
  return rows.map((row) => row.followingId);
}

/* ----------------------------------------------------------- notifiche -- */

type NotificationType = "POST_REPLY" | "COMMENT_REPLY" | "NEW_FOLLOWER" | "POST_VOTED";

/** Anche quelle che non nascono qui: l'esito della verifica della classe (`game-account/actions.ts`). */
type AnyNotificationType = NotificationType | "POWER_VERIFIED" | "POWER_REJECTED";

/**
 * Registra una notifica, salvo il caso in cui l'attore e il destinatario siano
 * la stessa persona: nessuno vuole essere avvisato di quello che ha appena
 * fatto lui.
 */
export async function notify(
  userId: string,
  actorId: string,
  type: NotificationType,
  // Il riferimento al commento e' opzionale: l'archivio non restituisce l'id di
  // cio' che ha appena inserito, e il post da solo basta per portare la persona
  // dove serve.
  refs: { postId?: string; commentId?: string },
): Promise<void> {
  if (userId === actorId) return;

  await db.insert(notifications).values({
    userId,
    actorId,
    type,
    postId: refs.postId ?? null,
    commentId: refs.commentId ?? null,
  });
}

export interface NotificationItem {
  id: string;
  type: AnyNotificationType;
  actor: { username: string; displayName: string };
  postId: string | null;
  postTitle: string | null;
  gameSlug: string | null;
  /** per l'esito di una verifica: la classe confermata */
  verifiedPower: number | null;
  read: boolean;
  createdAt: string;
}

export async function listNotifications(limit = 30): Promise<NotificationItem[]> {
  const userId = await currentUserId();
  if (!userId) return [];

  const rows = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
    with: {
      actor: { with: { profile: true } },
      post: { with: { hub: { with: { game: true } } } },
      verification: { columns: { verifiedPower: true }, with: { game: { columns: { slug: true } } } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    actor: {
      username: row.actor.username,
      displayName: row.actor.profile?.displayName ?? row.actor.username,
    },
    postId: row.postId,
    postTitle: row.post?.title ?? null,
    gameSlug: row.post?.hub.game?.slug ?? row.verification?.game.slug ?? null,
    verifiedPower: row.verification?.verifiedPower ?? null,
    read: row.readAt != null,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function unreadCount(): Promise<number> {
  const userId = await currentUserId();
  if (!userId) return 0;

  return db.$count(
    notifications,
    and(eq(notifications.userId, userId), isNull(notifications.readAt)),
  );
}

export async function markAllReadAction(): Promise<SocialResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: TESTI[await getLocale()].sessioneScaduta };

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

  revalidatePath("/notifiche");
  return { ok: true };
}

/**
 * Avvisa chi va avvisato quando arriva un commento: l'autore del post e, se la
 * risposta e' annidata, anche l'autore del commento padre. Sono due persone
 * diverse e vanno entrambe informate, altrimenti la conversazione si interrompe
 * per chi non e' il proprietario del post.
 */
export async function notifyOnComment(
  postId: string,
  parentId: string | null,
  actorId: string,
): Promise<void> {
  if (!(await databaseReachable())) return;

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { authorId: true },
  });
  if (post) await notify(post.authorId, actorId, "POST_REPLY", { postId });

  if (parentId) {
    const parent = await db.query.comments.findFirst({
      where: eq(comments.id, parentId),
      columns: { authorId: true },
    });
    if (parent && parent.authorId !== post?.authorId) {
      await notify(parent.authorId, actorId, "COMMENT_REPLY", { postId });
    }
  }
}

/** Utenti piu' seguiti: alimenta il pannello dei suggerimenti. */
export async function suggestedUsers(limit = 5): Promise<
  { username: string; displayName: string; followers: number }[]
> {
  if (!(await databaseReachable())) return [];

  const viewerId = await currentUserId();
  const alreadyFollowed = viewerId ? await followedUserIds(viewerId) : [];
  const excluded = viewerId ? [...alreadyFollowed, viewerId] : alreadyFollowed;

  const rows = await db
    .select({
      username: users.username,
      followers: sql<number>`count(${follows.followerId})`.mapWith(Number),
      userId: users.id,
    })
    .from(users)
    .leftJoin(follows, eq(follows.followingId, users.id))
    .groupBy(users.id, users.username)
    .orderBy(desc(sql`count(${follows.followerId})`))
    .limit(limit + excluded.length);

  const candidates = rows.filter((row) => !excluded.includes(row.userId)).slice(0, limit);
  if (candidates.length === 0) return [];

  const profiles = await db.query.users.findMany({
    where: inArray(
      users.id,
      candidates.map((row) => row.userId),
    ),
    columns: { id: true, username: true },
    with: { profile: { columns: { displayName: true } } },
  });

  const names = new Map(profiles.map((row) => [row.id, row.profile?.displayName ?? row.username]));

  return candidates.map((row) => ({
    username: row.username,
    displayName: names.get(row.userId) ?? row.username,
    followers: row.followers,
  }));
}
