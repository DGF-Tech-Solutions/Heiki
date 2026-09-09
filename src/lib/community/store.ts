/**
 * Archivio della community.
 *
 * Due implementazioni dietro una sola interfaccia:
 *
 *  - `dbStore`     usa Postgres, e' quella vera
 *  - `memoryStore` tiene tutto in memoria del processo, partendo da contenuti
 *                  di esempio
 *
 * L'archivio in memoria non e' un finto: si puo' pubblicare, commentare e
 * votare davvero, e le modifiche restano finche' il server e' acceso. Serve
 * perche' una community si valuta usandola, non guardandola: un feed
 * disabilitato con scritto "serve il database" non dice se il prodotto
 * funziona. Che i contenuti siano volatili viene dichiarato nell'interfaccia.
 */

import { and, desc, eq } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { comments, games, hubs, posts, profiles, users, votes } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import { DEMO_POSTS, DEMO_SPONSORS } from "./demo-seed";
import { hubName, toAttachmentRecord } from "./types";
import type {
  Author,
  CommentNode,
  CreateCommentInput,
  CreatePostInput,
  FeedPost,
  PostDetail,
  SimulationAttachment,
  SponsorItem,
  Vote,
} from "./types";

export interface Viewer {
  id: string;
  username: string;
  displayName: string;
  role: Author["role"];
  accent: string;
}

export interface CommunityStore {
  readonly volatile: boolean;
  listPosts(game: string | null, hub: string | null, viewer: Viewer | null): Promise<FeedPost[]>;
  getPost(id: string, viewer: Viewer | null): Promise<PostDetail | null>;
  listSponsors(): Promise<SponsorItem[]>;
  createPost(input: CreatePostInput, viewer: Viewer): Promise<string>;
  createComment(input: CreateCommentInput, viewer: Viewer): Promise<void>;
  votePost(postId: string, value: Vote, viewer: Viewer): Promise<void>;
  voteComment(commentId: string, value: Vote, viewer: Viewer): Promise<void>;
}

export const GUEST: Viewer = {
  id: "guest",
  username: "ospite",
  displayName: "Ospite",
  role: "USER",
  accent: "brand",
};

export async function getStore(): Promise<CommunityStore> {
  return (await databaseReachable()) ? dbStore : memoryStore;
}

/* ===================================================== archivio in memoria */

interface MemoryState {
  posts: PostDetail[];
  /** voti dati dal visitatore: chiave `${tipo}:${id}` */
  ballots: Map<string, Vote>;
  nextId: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __gachazoneCommunity: MemoryState | undefined;
}

function state(): MemoryState {
  if (!globalThis.__gachazoneCommunity) {
    globalThis.__gachazoneCommunity = {
      posts: DEMO_POSTS.map(clonePost),
      ballots: new Map(),
      nextId: 1,
    };
  }
  return globalThis.__gachazoneCommunity;
}

function clonePost(post: PostDetail): PostDetail {
  return JSON.parse(JSON.stringify(post)) as PostDetail;
}

function applyBallots(post: PostDetail, ballots: Map<string, Vote>): PostDetail {
  const withVotes = (node: CommentNode): CommentNode => ({
    ...node,
    myVote: ballots.get(`c:${node.id}`) ?? 0,
    replies: node.replies.map(withVotes),
  });

  return {
    ...post,
    myVote: ballots.get(`p:${post.id}`) ?? 0,
    comments: post.comments.map(withVotes),
  };
}

const memoryStore: CommunityStore = {
  volatile: true,

  async listPosts(game, hub) {
    const { posts: all, ballots } = state();
    return all
      .filter((post) => game === null || post.game === game)
      .filter((post) => hub === null || post.hub === hub)
      .map((post) => applyBallots(post, ballots));
  },

  async getPost(id) {
    const { posts: all, ballots } = state();
    const found = all.find((post) => post.id === id);
    return found ? applyBallots(found, ballots) : null;
  },

  async listSponsors() {
    return DEMO_SPONSORS.map((item) => ({ ...item }));
  },

  async createPost(input, viewer) {
    const store = state();
    const id = `local-${store.nextId++}`;

    store.posts.unshift({
      id,
      game: input.game,
      hub: input.hub,
      hubName: hubName(input.hub),
      title: input.title,
      excerpt: excerptOf(input.body),
      body: input.body,
      author: toAuthor(viewer),
      score: 1,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      attachment: input.attachment ?? null,
      myVote: 1,
      comments: [],
    });
    store.ballots.set(`p:${id}`, 1);

    return id;
  },

  async createComment(input, viewer) {
    const store = state();
    const post = store.posts.find((item) => item.id === input.postId);
    if (!post) return;

    const node: CommentNode = {
      id: `local-c${store.nextId++}`,
      author: toAuthor(viewer),
      body: input.body,
      score: 1,
      createdAt: new Date().toISOString(),
      myVote: 1,
      replies: [],
    };
    store.ballots.set(`c:${node.id}`, 1);

    if (input.parentId) {
      const parent = findComment(post.comments, input.parentId);
      if (parent) {
        parent.replies = [...parent.replies, node];
      } else {
        post.comments = [...post.comments, node];
      }
    } else {
      post.comments = [...post.comments, node];
    }

    post.commentCount = countComments(post.comments);
  },

  async votePost(postId, value) {
    const store = state();
    const post = store.posts.find((item) => item.id === postId);
    if (!post) return;

    const key = `p:${postId}`;
    const previous = store.ballots.get(key) ?? 0;
    post.score += value - previous;
    if (value === 0) store.ballots.delete(key);
    else store.ballots.set(key, value);
  },

  async voteComment(commentId, value) {
    const store = state();
    for (const post of store.posts) {
      const node = findComment(post.comments, commentId);
      if (!node) continue;

      const key = `c:${commentId}`;
      const previous = store.ballots.get(key) ?? 0;
      node.score += value - previous;
      if (value === 0) store.ballots.delete(key);
      else store.ballots.set(key, value);
      return;
    }
  },
};

function findComment(nodes: readonly CommentNode[], id: string): CommentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = findComment(node.replies, id);
    if (nested) return nested;
  }
  return null;
}

function countComments(nodes: readonly CommentNode[]): number {
  return nodes.reduce((total, node) => total + 1 + countComments(node.replies), 0);
}

/* ========================================================= archivio su DB */

const dbStore: CommunityStore = {
  volatile: false,

  async listPosts(game, hub, viewer) {
    const rows = await db.query.posts.findMany({
      where: eq(posts.hidden, false),
      orderBy: [desc(posts.createdAt)],
      limit: 100,
      with: { hub: { with: { game: true } }, author: { with: { profile: true } } },
    });

    const ballots = await ballotsFor(viewer, "POST", rows.map((row) => row.id));

    return rows
      .filter((row) => game === null || row.hub.game?.slug === game)
      .filter((row) => hub === null || row.hub.slug === hub)
      .map((row) => ({
        id: row.id,
        game: row.hub.game?.slug ?? "",
        hub: row.hub.slug,
        hubName: row.hub.name,
        title: row.title,
        excerpt: excerptOf(row.bodyMd),
        author: authorFromRow(row.author),
        score: row.score,
        commentCount: row.commentCount,
        createdAt: row.createdAt.toISOString(),
        attachment: readAttachment(row.attachment),
        myVote: ballots.get(row.id) ?? 0,
      }));
  },

  async getPost(id, viewer) {
    const row = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        hub: { with: { game: true } },
        author: { with: { profile: true } },
        comments: { with: { author: { with: { profile: true } } } },
      },
    });
    if (!row) return null;

    const postBallots = await ballotsFor(viewer, "POST", [row.id]);
    const commentBallots = await ballotsFor(
      viewer,
      "COMMENT",
      row.comments.map((item) => item.id),
    );

    const flat = row.comments
      .filter((item) => !item.hidden)
      .map((item) => ({
        node: {
          id: item.id,
          author: authorFromRow(item.author),
          body: item.bodyMd,
          score: item.score,
          createdAt: item.createdAt.toISOString(),
          myVote: commentBallots.get(item.id) ?? 0,
          replies: [] as CommentNode[],
        },
        parentId: item.parentId,
      }));

    const byId = new Map(flat.map((entry) => [entry.node.id, entry.node]));
    const roots: CommentNode[] = [];
    for (const entry of flat) {
      const parent = entry.parentId ? byId.get(entry.parentId) : undefined;
      if (parent) parent.replies = [...parent.replies, entry.node];
      else roots.push(entry.node);
    }

    return {
      id: row.id,
      game: row.hub.game?.slug ?? "",
      hub: row.hub.slug,
      hubName: row.hub.name,
      title: row.title,
      excerpt: excerptOf(row.bodyMd),
      body: row.bodyMd,
      author: authorFromRow(row.author),
      score: row.score,
      commentCount: row.commentCount,
      createdAt: row.createdAt.toISOString(),
      attachment: readAttachment(row.attachment),
      myVote: postBallots.get(row.id) ?? 0,
      comments: roots,
    };
  },

  async listSponsors() {
    const now = new Date();
    const rows = await db.query.sponsorPlacements.findMany({ limit: 10 });
    return rows
      .filter((row) => row.active && row.startsAt <= now && row.endsAt >= now)
      .map((row) => ({
        id: row.id,
        advertiser: row.advertiser,
        title: row.title,
        body: row.body,
        targetUrl: row.targetUrl,
      }));
  },

  async createPost(input, viewer) {
    const hubId = await ensureHub(input.hub, input.game);
    const [created] = await db
      .insert(posts)
      .values({
        hubId,
        authorId: viewer.id,
        title: input.title,
        bodyMd: input.body,
        attachment: toAttachmentRecord(input.attachment ?? null),
        score: 1,
      })
      .returning({ id: posts.id });

    if (!created) throw new Error("Creazione del post non riuscita");

    await db
      .insert(votes)
      .values({ userId: viewer.id, targetType: "POST", targetId: created.id, value: 1 });

    return created.id;
  },

  async createComment(input, viewer) {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(comments)
        .values({
          postId: input.postId,
          authorId: viewer.id,
          parentId: input.parentId ?? null,
          bodyMd: input.body,
          score: 1,
        })
        .returning({ id: comments.id });

      if (!created) throw new Error("Creazione del commento non riuscita");

      const total = await tx.query.comments.findMany({
        where: eq(comments.postId, input.postId),
        columns: { id: true },
      });
      await tx.update(posts).set({ commentCount: total.length }).where(eq(posts.id, input.postId));
    });
  },

  async votePost(postId, value, viewer) {
    const delta = await recordVote(viewer, "POST", postId, value);
    if (delta === 0) return;
    const row = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: { score: true },
    });
    await db
      .update(posts)
      .set({ score: (row?.score ?? 0) + delta })
      .where(eq(posts.id, postId));
  },

  async voteComment(commentId, value, viewer) {
    const delta = await recordVote(viewer, "COMMENT", commentId, value);
    if (delta === 0) return;
    const row = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
      columns: { score: true },
    });
    await db
      .update(comments)
      .set({ score: (row?.score ?? 0) + delta })
      .where(eq(comments.id, commentId));
  },
};

/** Restituisce la variazione di punteggio da applicare. */
async function recordVote(
  viewer: Viewer,
  targetType: "POST" | "COMMENT",
  targetId: string,
  value: Vote,
): Promise<number> {
  const existing = await db.query.votes.findFirst({
    where: and(
      eq(votes.userId, viewer.id),
      eq(votes.targetType, targetType),
      eq(votes.targetId, targetId),
    ),
  });

  const previous = (existing?.value ?? 0) as Vote;
  if (previous === value) return 0;

  if (value === 0) {
    if (existing) await db.delete(votes).where(eq(votes.id, existing.id));
  } else if (existing) {
    await db.update(votes).set({ value }).where(eq(votes.id, existing.id));
  } else {
    await db.insert(votes).values({ userId: viewer.id, targetType, targetId, value });
  }

  return value - previous;
}

async function ballotsFor(
  viewer: Viewer | null,
  targetType: "POST" | "COMMENT",
  ids: readonly string[],
): Promise<Map<string, Vote>> {
  const result = new Map<string, Vote>();
  if (!viewer || viewer.id === GUEST.id || ids.length === 0) return result;

  const rows = await db.query.votes.findMany({
    where: and(eq(votes.userId, viewer.id), eq(votes.targetType, targetType)),
    columns: { targetId: true, value: true },
  });

  const wanted = new Set(ids);
  for (const row of rows) {
    if (wanted.has(row.targetId)) result.set(row.targetId, row.value as Vote);
  }
  return result;
}

async function ensureHub(slug: string, gameSlug: string): Promise<string> {
  // Gli hub sono per gioco: lo stesso nome di sezione esiste in ognuno.
  const key = `${gameSlug}:${slug}`;
  const existing = await db.query.hubs.findFirst({
    where: eq(hubs.slug, key),
    columns: { id: true },
  });
  if (existing) return existing.id;

  const game = await db.query.games.findFirst({
    where: eq(games.slug, gameSlug),
    columns: { id: true },
  });

  const [created] = await db
    .insert(hubs)
    .values({ slug: key, name: hubName(slug), gameId: game?.id ?? null })
    .returning({ id: hubs.id });

  if (!created) throw new Error(`Impossibile creare l'hub "${slug}"`);
  return created.id;
}

type AuthorRow = typeof users.$inferSelect & {
  profile: typeof profiles.$inferSelect | null;
};

function authorFromRow(row: AuthorRow): Author {
  return {
    username: row.username,
    displayName: row.profile?.displayName ?? row.username,
    role: row.role,
    accent: normalizeCustomization(row.profile?.cosmetics).accent,
  };
}

/* ------------------------------------------------------------- ausiliari */

function toAuthor(viewer: Viewer): Author {
  return {
    username: viewer.username,
    displayName: viewer.displayName,
    role: viewer.role,
    accent: viewer.accent,
  };
}

export function excerptOf(body: string, limit = 180): string {
  const flat = body.replace(/[#*`>_]/g, "").replace(/\s+/g, " ").trim();
  return flat.length <= limit ? flat : `${flat.slice(0, limit - 1).trimEnd()}…`;
}

function readAttachment(value: unknown): SimulationAttachment | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { kind?: unknown };
  return candidate.kind === "simulation" ? (value as SimulationAttachment) : null;
}
