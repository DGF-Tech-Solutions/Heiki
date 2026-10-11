/**
 * Letture e notifiche del lato sociale, per i componenti server e le azioni.
 *
 * NON e' un modulo "use server", di proposito: in un modulo "use server" ogni
 * funzione esportata diventa un'azione che il browser puo' chiamare con
 * qualunque argomento. Fino all'11/10 `notify` e `notifyOnComment` stavano li':
 * chi ne conosceva l'id poteva creare notifiche a chiunque, a nome di chiunque;
 * e `followedUserIds(userId)` diceva chi segue un utente qualsiasi. Qui stanno
 * gli aiuti, e in `actions.ts` solo le vere azioni, ognuna col suo controllo.
 * (Segnalato dalla sessione che rafforza la sicurezza.)
 */

import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { comments, follows, notifications, posts, users } from "@/lib/db/schema";

/** Chi e' entrato, o null (anche senza database: senza, non c'e' nessuno da seguire). */
export async function currentUserId(): Promise<string | null> {
  if (!(await databaseReachable())) return null;
  const session = await auth();
  return session?.user?.id ?? null;
}

/* ------------------------------------------------------------- seguire -- */

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const followerId = await currentUserId();
  if (!followerId || followerId === targetUserId) return false;

  const row = await db.query.follows.findFirst({
    where: and(eq(follows.followerId, followerId), eq(follows.followingId, targetUserId)),
    columns: { followerId: true },
  });
  return row != null;
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

export type NotificationType = "POST_REPLY" | "COMMENT_REPLY" | "NEW_FOLLOWER" | "POST_VOTED";

/** Anche quelle che non nascono qui: l'esito della verifica della classe (`game-account/actions.ts`) e delle guide dell'Endgame. */
type AnyNotificationType =
  | NotificationType
  | "POWER_VERIFIED"
  | "POWER_REJECTED"
  // l'esito della revisione di una guida dell'Endgame (`strategies/server.ts`)
  | "STRATEGY_PUBLISHED"
  | "STRATEGY_REJECTED";

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

/** Le notifiche di chi e' entrato, dalle piu' recenti; al massimo 100. */
export async function listNotifications(limit = 30): Promise<NotificationItem[]> {
  const userId = await currentUserId();
  if (!userId) return [];

  const rows = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit: Math.min(Math.max(1, Math.trunc(limit)), 100),
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

/** Utenti piu' seguiti: alimenta il pannello dei suggerimenti. Al massimo 20. */
export async function suggestedUsers(limit = 5): Promise<
  { username: string; displayName: string; followers: number }[]
> {
  if (!(await databaseReachable())) return [];
  const wanted = Math.min(Math.max(1, Math.trunc(limit)), 20);

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
    .limit(wanted + excluded.length);

  const candidates = rows.filter((row) => !excluded.includes(row.userId)).slice(0, wanted);
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
