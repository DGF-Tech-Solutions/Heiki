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

import { and, desc, eq, ilike, inArray, like, notInArray, or, sql } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { comments, hubs, posts, profiles, users, votes } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import { DEMO_POSTS, DEMO_SPONSORS } from "./demo-seed";
import { strategyBriefs, unpublishedStrategyPosts } from "@/lib/strategies/server";
import { ensureHub } from "./hubs";
import { hubName, normalizeAttachment, toAttachmentRecord } from "./types";
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

/**
 * Filtri del feed oltre a gioco e sezione: l'autore (la pagina del profilo) e
 * le parole cercate (la ricerca). Stanno nella query: fino all'11/10 si
 * prendevano gli ultimi 100 post di tutto il sito e si filtrava dopo, e con 100
 * post piu' recenti altrove il feed di un gioco tranquillo, la cronologia di un
 * profilo o una ricerca restavano vuoti.
 */
export interface PostFilter {
  /** l'handle dell'autore */
  readonly author?: string;
  /** nel titolo o nel testo, senza distinguere le maiuscole */
  readonly search?: string;
}

export interface CommunityStore {
  readonly volatile: boolean;
  listPosts(game: string | null, hub: string | null, viewer: Viewer | null, filter?: PostFilter): Promise<FeedPost[]>;
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

  async listPosts(game, hub, _viewer, filter = {}) {
    const { posts: all, ballots } = state();
    const needle = filter.search?.toLowerCase();
    return all
      .filter((post) => game === null || post.game === game)
      .filter((post) => hub === null || post.hub === hub)
      .filter((post) => !filter.author || post.author.username.toLowerCase() === filter.author.toLowerCase())
      .filter((post) => !needle || post.title.toLowerCase().includes(needle) || post.excerpt.toLowerCase().includes(needle))
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Lo slug di un hub sul database porta il gioco davanti ("grand-cross:build")
 * perche' deve essere unico nella tabella. Verso l'esterno conta solo la parte
 * della sezione: e' quella che compare negli indirizzi e nei filtri del feed.
 */
function hubSlugOf(full: string): string {
  const separator = full.indexOf(":");
  return separator === -1 ? full : full.slice(separator + 1);
}


const dbStore: CommunityStore = {
  volatile: false,

  async listPosts(game, hub, viewer, filter = {}) {
    // lo slug dell'hub e' «<gioco>:<sezione>» (hubSlugOf): gioco e sezione sono
    // un filtro sullo slug, con le sottoquery al posto delle join
    const hubPattern = game !== null && hub !== null ? `${game}:${hub}` : game !== null ? `${game}:%` : hub !== null ? `%:${hub}` : null;
    const pattern = filter.search ? `%${filter.search.replace(/[\\%_]/g, (c) => `\\${c}`)}%` : null;
    const rows = await db.query.posts.findMany({
      where: and(
        eq(posts.hidden, false),
        // una guida dell'Endgame in revisione o respinta non e' ancora nel feed
        notInArray(posts.id, unpublishedStrategyPosts()),
        hubPattern ? inArray(posts.hubId, db.select({ id: hubs.id }).from(hubs).where(like(hubs.slug, hubPattern))) : undefined,
        filter.author ? inArray(posts.authorId, db.select({ id: users.id }).from(users).where(eq(users.username, filter.author.toLowerCase()))) : undefined,
        pattern ? or(ilike(posts.title, pattern), ilike(posts.bodyMd, pattern)) : undefined,
      ),
      orderBy: [desc(posts.createdAt)],
      limit: 100,
      with: { hub: { with: { game: true } }, author: { with: { profile: true } } },
    });

    const ballots = await ballotsFor(viewer, "POST", rows.map((row) => row.id));
    const briefs = await strategyBriefs(rows.map((row) => row.id));

    return rows
      .map((row) => ({
        id: row.id,
        game: row.hub.game?.slug ?? "",
        hub: hubSlugOf(row.hub.slug),
        hubName: row.hub.name,
        title: row.title,
        excerpt: excerptOf(row.bodyMd),
        author: authorFromRow(row.author),
        score: row.score,
        commentCount: row.commentCount,
        createdAt: row.createdAt.toISOString(),
        attachment: readAttachment(row.attachment),
        myVote: ballots.get(row.id) ?? 0,
        ...(briefs.has(row.id) ? { strategy: briefs.get(row.id) } : {}),
      }));
  },

  async getPost(id, viewer) {
    // un id che non e' un UUID arrivava a Postgres e la pagina rispondeva 500:
    // per chi chiama e' un post che non esiste (segnalato dalla sessione sulla sicurezza)
    if (!UUID.test(id)) return null;
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
      hub: hubSlugOf(row.hub.slug),
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
      hidden: row.hidden,
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
    await recordVote(viewer, "POST", postId, value);
  },

  async voteComment(commentId, value, viewer) {
    await recordVote(viewer, "COMMENT", commentId, value);
  },
};

/**
 * Registra il voto e sposta il punteggio, in una transazione sola.
 *
 * Fino all'11/10 si leggeva il voto, poi lo si scriveva, poi si leggeva il
 * punteggio e lo si riscriveva come «letto + variazione»: due richieste insieme
 * con lo stesso cambio contavano due volte (segnalato dalla sessione sulla
 * sicurezza). Ora la riga del voto si blocca (`for update`) finche' la
 * transazione non finisce, e il punteggio cresce nel database
 * (`score = score + variazione`), senza passare da una lettura.
 */
async function recordVote(
  viewer: Viewer,
  targetType: "POST" | "COMMENT",
  targetId: string,
  value: Vote,
): Promise<void> {
  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: votes.id, value: votes.value })
      .from(votes)
      .where(and(eq(votes.userId, viewer.id), eq(votes.targetType, targetType), eq(votes.targetId, targetId)))
      .for("update");

    const previous = (existing?.value ?? 0) as Vote;
    if (previous === value) return;

    if (existing) {
      if (value === 0) await tx.delete(votes).where(eq(votes.id, existing.id));
      else await tx.update(votes).set({ value }).where(eq(votes.id, existing.id));
    } else {
      // due primi voti insieme: il secondo trova la riga gia' scritta dal primo e
      // non conta (l'indice unico su utente e bersaglio fa da arbitro)
      const [created] = await tx
        .insert(votes)
        .values({ userId: viewer.id, targetType, targetId, value })
        .onConflictDoNothing()
        .returning({ id: votes.id });
      if (!created) return;
    }

    const delta = value - previous;
    if (targetType === "POST") {
      await tx.update(posts).set({ score: sql`${posts.score} + ${delta}` }).where(eq(posts.id, targetId));
    } else {
      await tx.update(comments).set({ score: sql`${comments.score} + ${delta}` }).where(eq(comments.id, targetId));
    }
  });
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
  return normalizeAttachment(value);
}
