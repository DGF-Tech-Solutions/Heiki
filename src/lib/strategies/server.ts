/**
 * Le strategie dell'Endgame sul database.
 *
 * Solo col database: senza, non si scrivono e le pagine non ne mostrano. La
 * community ha un archivio in memoria per provarla senza Postgres; le strategie
 * no, perche' vivono della revisione di un moderatore, che senza account veri
 * non esiste.
 *
 * Chi vede cosa lo decide chi chiama: `getStrategy` restituisce una strategia in
 * qualunque stato, le liste solo quelle pubblicate e con il post non nascosto.
 */

import { and, desc, eq, inArray, isNull, ne, sql } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { games, modActions, notifications, postStrategies, posts, users, votes } from "@/lib/db/schema";
import { ensureHub } from "@/lib/community/hubs";
import { normalizeCustomization } from "@/lib/profile/customization";
import type {
  EndgameMode,
  StrategyAuthor,
  StrategyBrief,
  StrategyCardData,
  StrategyDraft,
  StrategyKind,
  StrategyRecord,
  StrategySelection,
  StrategySlot,
  StrategyStatus,
} from "./types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** L'hub dei post dell'Endgame (`HUBS` in community/types.ts). */
export const STRATEGY_HUB = "endgame";

/* ------------------------------------------------------------ letture -- */

function readTeam(value: unknown): StrategySlot[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry["hero"] !== "string") return [];
    return [{ hero: entry["hero"], associate: typeof entry["associate"] === "string" ? entry["associate"] : null }];
  });
}

function readPhases(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => (typeof item === "string" ? item : "")) : [];
}

const kindOf = (title: string, notes: string, phases: readonly string[]): StrategyKind =>
  !title.trim() && !notes.trim() && phases.every((phase) => !phase.trim()) ? "team" : "guide";

type StrategyRow = typeof postStrategies.$inferSelect;

function selectionOf(row: StrategyRow): StrategySelection {
  return {
    mode: row.mode,
    target: row.target === "" ? null : row.target,
    level: row.level,
    transcendent: row.transcendent,
  };
}

function authorOf(row: { username: string; profile: { displayName: string | null; cosmetics: unknown } | null }): StrategyAuthor {
  return {
    username: row.username,
    displayName: row.profile?.displayName ?? row.username,
    accent: normalizeCustomization(row.profile?.cosmetics).accent,
  };
}

/** Una strategia in qualunque stato, o null. La pagina decide chi puo' vederla. */
export async function getStrategy(postId: string): Promise<StrategyRecord | null> {
  if (!UUID.test(postId) || !(await databaseReachable())) return null;
  const row = await db.query.postStrategies.findFirst({
    where: eq(postStrategies.postId, postId),
    with: { post: { with: { author: true } }, game: true },
  });
  if (!row) return null;
  // il titolo automatico non e' testo dell'autore: per il modulo la guida ha il titolo vuoto
  const title = row.autoTitle ? "" : row.post.title;
  return {
    ...selectionOf(row),
    postId: row.postId,
    game: row.game.slug,
    team: readTeam(row.team),
    artifactSet: row.artifactSet,
    title,
    notes: row.post.bodyMd,
    phases: readPhases(row.phases),
    status: row.status,
    autoTitle: row.autoTitle,
    reviewNote: row.reviewNote,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    authorUsername: row.post.author.username,
  };
}

async function gameIdOf(slug: string): Promise<string | null> {
  const row = await db.query.games.findFirst({ where: eq(games.slug, slug), columns: { id: true } });
  return row?.id ?? null;
}

/** Il filtro di una scelta: per Re Demone e Divinita' il bersaglio e' "", per le bestie il livello null. */
function selectionWhere(selection: StrategySelection) {
  return and(
    eq(postStrategies.mode, selection.mode),
    eq(postStrategies.target, selection.target ?? ""),
    selection.level === null ? isNull(postStrategies.level) : eq(postStrategies.level, selection.level),
    eq(postStrategies.transcendent, selection.transcendent),
  );
}

/**
 * Le strategie pubblicate per una scelta, dalla piu' votata (a parita', la piu'
 * recente). Una pagina dell'Endgame ne mostra poche: il tetto e' largo.
 */
export async function listStrategies(game: string, selection: StrategySelection, limit = 30): Promise<StrategyCardData[]> {
  if (!(await databaseReachable())) return [];
  const gameId = await gameIdOf(game);
  if (!gameId) return [];

  const rows = await db
    .select({ strategy: postStrategies, post: posts })
    .from(postStrategies)
    .innerJoin(posts, eq(posts.id, postStrategies.postId))
    .where(
      and(
        eq(postStrategies.gameId, gameId),
        selectionWhere(selection),
        eq(postStrategies.status, "PUBLISHED"),
        eq(posts.hidden, false),
      ),
    )
    .orderBy(desc(posts.score), desc(posts.createdAt))
    .limit(limit);

  const authorIds = [...new Set(rows.map((row) => row.post.authorId))];
  const authors =
    authorIds.length === 0
      ? []
      : await db.query.users.findMany({ where: inArray(users.id, authorIds), with: { profile: true } });
  const byId = new Map(authors.map((author) => [author.id, authorOf(author)]));

  return rows.map(({ strategy, post }) => {
    const phases = readPhases(strategy.phases);
    return {
      ...selectionOf(strategy),
      postId: post.id,
      game,
      kind: kindOf(strategy.autoTitle ? "" : post.title, post.bodyMd, phases),
      title: post.title,
      autoTitle: strategy.autoTitle,
      team: readTeam(strategy.team),
      artifactSet: strategy.artifactSet,
      phaseNotes: phases.filter((phase) => phase.trim()).length,
      author: byId.get(post.authorId) ?? { username: "?", displayName: "?", accent: "brand" },
      score: post.score,
      commentCount: post.commentCount,
      createdAt: post.createdAt.toISOString(),
    };
  });
}

/** Quante strategie pubblicate per ogni difficolta' di un bersaglio: i collegamenti «altre difficolta'». */
export async function strategyCounts(
  game: string,
  mode: EndgameMode,
  target: string | null,
): Promise<{ level: number | null; transcendent: boolean; count: number }[]> {
  if (!(await databaseReachable())) return [];
  const gameId = await gameIdOf(game);
  if (!gameId) return [];
  return db
    .select({
      level: postStrategies.level,
      transcendent: postStrategies.transcendent,
      count: sql<number>`count(*)::int`,
    })
    .from(postStrategies)
    .innerJoin(posts, eq(posts.id, postStrategies.postId))
    .where(
      and(
        eq(postStrategies.gameId, gameId),
        eq(postStrategies.mode, mode),
        eq(postStrategies.target, target ?? ""),
        eq(postStrategies.status, "PUBLISHED"),
        eq(posts.hidden, false),
      ),
    )
    .groupBy(postStrategies.level, postStrategies.transcendent);
}

/** I voti di chi guarda sui post delle schede: senza, il pulsante sembrerebbe sempre da premere. */
export async function myVotes(viewerId: string | null, postIds: readonly string[]): Promise<Map<string, -1 | 0 | 1>> {
  const result = new Map<string, -1 | 0 | 1>();
  const ids = postIds.filter((id) => UUID.test(id));
  if (!viewerId || !UUID.test(viewerId) || ids.length === 0) return result;
  const rows = await db
    .select({ targetId: votes.targetId, value: votes.value })
    .from(votes)
    .where(and(eq(votes.userId, viewerId), eq(votes.targetType, "POST"), inArray(votes.targetId, ids)));
  for (const row of rows) result.set(row.targetId, row.value === 1 ? 1 : row.value === -1 ? -1 : 0);
  return result;
}

/** Il riassunto delle strategie di alcuni post, per il feed. */
export async function strategyBriefs(postIds: readonly string[]): Promise<Map<string, StrategyBrief>> {
  const result = new Map<string, StrategyBrief>();
  const ids = postIds.filter((id) => UUID.test(id));
  if (ids.length === 0) return result;
  const rows = await db
    .select({ strategy: postStrategies, title: posts.title, body: posts.bodyMd })
    .from(postStrategies)
    .innerJoin(posts, eq(posts.id, postStrategies.postId))
    .where(inArray(postStrategies.postId, ids));
  for (const { strategy, title, body } of rows) {
    result.set(strategy.postId, {
      ...selectionOf(strategy),
      kind: kindOf(strategy.autoTitle ? "" : title, body, readPhases(strategy.phases)),
      heroes: readTeam(strategy.team).map((slot) => slot.hero),
    });
  }
  return result;
}

/**
 * I post che il feed non deve mostrare perche' la loro guida non e' pubblicata
 * (in revisione o respinta): una sottoquery per `notInArray`.
 */
export function unpublishedStrategyPosts() {
  return db
    .select({ id: postStrategies.postId })
    .from(postStrategies)
    .where(ne(postStrategies.status, "PUBLISHED"));
}

/* ----------------------------------------------------------- scritture -- */

export interface SaveInput {
  readonly game: string;
  readonly draft: StrategyDraft;
  /** il titolo da salvare: quello dell'autore, o quello automatico nella sua lingua */
  readonly title: string;
  readonly autoTitle: boolean;
  readonly authorId: string;
}

const strategyValues = (draft: StrategyDraft) => ({
  mode: draft.mode,
  target: draft.target ?? "",
  level: draft.level,
  transcendent: draft.transcendent,
  team: draft.team.map((slot) => ({ hero: slot.hero, associate: slot.associate })),
  artifactSet: draft.artifactSet,
  phases: [...draft.phases],
});

/** Una strategia nuova: il post (nell'hub dell'Endgame, col voto dell'autore) e la sua scheda. */
export async function createStrategy(input: SaveInput, status: StrategyStatus): Promise<string> {
  const gameId = await gameIdOf(input.game);
  if (!gameId) throw new Error(`Gioco sconosciuto: ${input.game}`);
  const hubId = await ensureHub(STRATEGY_HUB, input.game);

  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(posts)
      .values({ hubId, authorId: input.authorId, title: input.title, bodyMd: input.draft.notes, score: 1 })
      .returning({ id: posts.id });
    if (!created) throw new Error("Creazione del post non riuscita");
    await tx.insert(votes).values({ userId: input.authorId, targetType: "POST", targetId: created.id, value: 1 });
    await tx.insert(postStrategies).values({
      postId: created.id,
      gameId,
      ...strategyValues(input.draft),
      autoTitle: input.autoTitle,
      status,
    });
    return created.id;
  });
}

/**
 * La modifica dell'autore. Lo stato lo decide chi chiama; qui si azzera la
 * revisione quando la guida torna in coda, e si tiene quando resta pubblicata.
 */
export async function updateStrategy(postId: string, input: SaveInput, status: StrategyStatus): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .update(posts)
      .set({ title: input.title, bodyMd: input.draft.notes, updatedAt: new Date() })
      .where(eq(posts.id, postId));
    await tx
      .update(postStrategies)
      .set({
        ...strategyValues(input.draft),
        autoTitle: input.autoTitle,
        status,
        ...(status === "IN_REVIEW"
          ? { reviewerId: null, reviewedAt: null, reviewNote: null, submittedAt: new Date() }
          : {}),
      })
      .where(eq(postStrategies.postId, postId));
  });
}

/** L'autore di un post e lo stato della sua strategia, per le azioni. */
export async function strategyOwner(postId: string): Promise<{ authorId: string; status: StrategyStatus } | null> {
  if (!UUID.test(postId)) return null;
  const row = await db
    .select({ authorId: posts.authorId, status: postStrategies.status })
    .from(postStrategies)
    .innerJoin(posts, eq(posts.id, postStrategies.postId))
    .where(eq(postStrategies.postId, postId))
    .limit(1);
  return row[0] ?? null;
}

/**
 * La decisione di un moderatore su una guida IN_REVIEW. Condizionata allo stato:
 * due moderatori che decidono insieme non si sovrascrivono (vince il primo, il
 * secondo riceve false). Registra la decisione nel registro della moderazione e
 * avvisa l'autore.
 */
export async function decideStrategy(input: {
  postId: string;
  moderatorId: string;
  approve: boolean;
  note: string | null;
}): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(postStrategies)
      .set({
        status: input.approve ? "PUBLISHED" : "REJECTED",
        reviewerId: input.moderatorId,
        reviewedAt: new Date(),
        reviewNote: input.note,
      })
      .where(and(eq(postStrategies.postId, input.postId), eq(postStrategies.status, "IN_REVIEW")))
      .returning({ postId: postStrategies.postId });
    if (!updated) return false;

    const post = await tx.query.posts.findFirst({ where: eq(posts.id, input.postId), columns: { authorId: true } });
    await tx.insert(modActions).values({
      moderatorId: input.moderatorId,
      targetType: "POST",
      targetId: input.postId,
      action: input.approve ? "approve" : "reject",
      reason: input.note,
    });
    if (post && post.authorId !== input.moderatorId) {
      await tx.insert(notifications).values({
        userId: post.authorId,
        actorId: input.moderatorId,
        type: input.approve ? "STRATEGY_PUBLISHED" : "STRATEGY_REJECTED",
        postId: input.postId,
      });
    }
    return true;
  });
}

/* ------------------------------------------------------- la coda -- */

export interface StrategyQueueItem extends StrategySelection {
  readonly postId: string;
  readonly game: string;
  readonly title: string;
  readonly notes: string;
  readonly phases: readonly string[];
  readonly team: readonly StrategySlot[];
  readonly artifactSet: string | null;
  readonly author: StrategyAuthor;
  readonly authorId: string;
  readonly submittedAt: string;
  /** era gia' stata pubblicata o respinta: e' una modifica */
  readonly resubmitted: boolean;
}

/** Le guide da rivedere, dalla piu' vecchia: chi aspetta da piu' tempo passa prima. */
export async function strategyQueue(): Promise<StrategyQueueItem[]> {
  const rows = await db.query.postStrategies.findMany({
    where: eq(postStrategies.status, "IN_REVIEW"),
    orderBy: [postStrategies.submittedAt],
    limit: 50,
    with: { post: { with: { author: { with: { profile: true } } } }, game: true },
  });
  const decided = rows.length
    ? await db
        .select({ targetId: modActions.targetId })
        .from(modActions)
        .where(
          and(
            inArray(
              modActions.targetId,
              rows.map((row) => row.postId),
            ),
            inArray(modActions.action, ["approve", "reject"]),
          ),
        )
    : [];
  const seen = new Set(decided.map((row) => row.targetId));
  return rows
    .filter((row) => !row.post.hidden)
    .map((row) => ({
      ...selectionOf(row),
      postId: row.postId,
      game: row.game.slug,
      title: row.post.title,
      notes: row.post.bodyMd,
      phases: readPhases(row.phases),
      team: readTeam(row.team),
      artifactSet: row.artifactSet,
      author: authorOf(row.post.author),
      authorId: row.post.authorId,
      submittedAt: row.submittedAt.toISOString(),
      resubmitted: seen.has(row.postId),
    }));
}
