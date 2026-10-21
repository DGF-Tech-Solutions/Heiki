/**
 * Archivio delle guide.
 *
 * Stessa struttura della community: due implementazioni dietro una sola
 * interfaccia, cosi' la sezione si puo' provare - e scrivere davvero - anche
 * senza database. La differenza e' dichiarata da `volatile`, non nascosta.
 */

import { and, desc, eq } from "drizzle-orm";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { games, guideRevisions, guides, modActions, users } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import { excerptFromMarkdown } from "@/lib/markdown";
import { DEMO_GUIDES } from "./demo-seed";
import { GUIDE_STATUSES, guideSlug } from "./types";
import type {
  CreateGuideInput,
  GuideAuthor,
  GuideDetail,
  GuideStatus,
  GuideSummary,
} from "./types";

export interface GuideWriter {
  id: string;
  username: string;
  displayName: string;
  accent: string;
}

/** Dove sta una guida e di chi e': quanto serve per decidere un passaggio. */
export interface GuideState {
  authorId: string;
  status: GuideStatus;
  game: string;
  slug: string;
}

/**
 * Riga del registro della moderazione da scrivere insieme alla modifica.
 *
 * La passa l'azione solo quando un redattore tocca la guida di un altro: e' il
 * caso in cui serve sapere, dopo, chi ha deciso. L'autore che manda in
 * revisione la propria bozza non modera niente.
 */
export interface GuideAudit {
  moderatorId: string;
}

export interface GuideStore {
  readonly volatile: boolean;
  /**
   * `includeUnpublished` esiste perche' un autore deve vedere le proprie bozze
   * e un redattore la coda di revisione. Senza il parametro ogni chiamante
   * dovrebbe filtrare a mano, e prima o poi uno se ne dimenticherebbe
   * pubblicando bozze altrui.
   */
  list(game: string, options?: { includeUnpublished?: boolean }): Promise<GuideSummary[]>;
  get(game: string, slug: string): Promise<GuideDetail | null>;
  create(input: CreateGuideInput, writer: GuideWriter): Promise<string>;
  update(
    id: string,
    patch: { title?: string; body?: string; characterId?: string | null },
    writer: GuideWriter,
    note?: string,
  ): Promise<void>;
  /**
   * Cambia lo stato. Con `expected` cambia solo se la guida e' ancora in quello
   * stato: il permesso si decide sullo stato letto prima, e se nel frattempo un
   * redattore l'ha archiviata il passaggio non deve scavalcarlo. Restituisce
   * se la guida e' stata aggiornata.
   */
  setStatus(
    id: string,
    status: GuideStatus,
    options?: { expected?: GuideStatus; audit?: GuideAudit },
  ): Promise<boolean>;
  setVerifiedPatch(
    id: string,
    patch: string | null,
    writer: GuideWriter,
    audit?: GuideAudit,
  ): Promise<void>;
  /** id dell'autore: serve per decidere se chi modifica ne ha il diritto */
  authorOf(id: string): Promise<string | null>;
  /** autore, stato e indirizzo di una guida, o null se non esiste */
  stateOf(id: string): Promise<GuideState | null>;
}

export async function getGuideStore(): Promise<GuideStore> {
  return (await databaseReachable()) ? dbGuides : memoryGuides;
}

/**
 * Se l'archivio in memoria e' la modalita' dimostrativa voluta.
 *
 * `volatile` da solo non basta: l'archivio in memoria arriva anche quando il
 * database e' configurato ma per un attimo non risponde, e in quel caso chi
 * guarda non e' il visitatore di una prova ma un utente qualunque. Fino
 * all'11/10 riceveva il ruolo di redattore e i comandi di pubblicazione.
 */
export function isGuideDemo(store: GuideStore): boolean {
  return store.volatile && !isDatabaseConfigured();
}

/* =========================================================== regole pure */

/** Chi guarda o agisce, rispetto a una guida. */
export interface GuideActor {
  /** e' l'autore */
  own: boolean;
  /** ha il permesso publishGuide */
  editor: boolean;
}

/** Una guida non pubblicata la vedono solo l'autore e chi la deve revisionare. */
export function canViewGuide(status: GuideStatus, actor: GuideActor): boolean {
  return status === "PUBLISHED" || actor.own || actor.editor;
}

/**
 * Quali passaggi di stato sono ammessi.
 *
 * Il redattore li fa tutti: e' lui che pubblica, archivia e respinge. L'autore
 * ne ha due, e solo fra le sue bozze: mandare in revisione quando ha finito,
 * ritirare in bozza quello che ha mandato. Fino all'11/10 poteva portare in
 * bozza o in revisione qualunque sua guida, anche una che un redattore aveva
 * archiviato: l'archiviazione si annullava da sola e la guida tornava in coda.
 *
 * Restare nello stesso stato non e' un passaggio: l'azione lo tratta a parte.
 */
export function canMoveGuide(from: GuideStatus, to: GuideStatus, actor: GuideActor): boolean {
  if (from === to) return false;
  if (actor.editor) return true;
  if (!actor.own) return false;
  return (from === "DRAFT" && to === "IN_REVIEW") || (from === "IN_REVIEW" && to === "DRAFT");
}

/**
 * Tutti i passaggi ammessi per chi guarda, stato per stato. Lo calcola la
 * pagina sul server e lo passa ai comandi: i pulsanti nel browser seguono la
 * stessa regola dell'azione senza importare questo file, che legge il database.
 */
export function guideTransitions(actor: GuideActor): Record<GuideStatus, GuideStatus[]> {
  const table = {} as Record<GuideStatus, GuideStatus[]>;
  for (const from of GUIDE_STATUSES) {
    table[from] = GUIDE_STATUSES.filter((to) => canMoveGuide(from, to, actor));
  }
  return table;
}

/* ==================================================== archivio in memoria */

interface GuideMemory {
  guides: GuideDetail[];
  next: number;
}

declare global {
  var __heikiGuides: GuideMemory | undefined;
}

function memory(): GuideMemory {
  if (!globalThis.__heikiGuides) {
    globalThis.__heikiGuides = {
      guides: DEMO_GUIDES.map((guide) => JSON.parse(JSON.stringify(guide)) as GuideDetail),
      next: 1,
    };
  }
  return globalThis.__heikiGuides;
}

function toAuthor(writer: GuideWriter): GuideAuthor {
  return { username: writer.username, displayName: writer.displayName, accent: writer.accent };
}

function summaryOf(guide: GuideDetail): GuideSummary {
  const { body: _body, revisions: _revisions, ...summary } = guide;
  return summary;
}

const memoryGuides: GuideStore = {
  volatile: true,

  async list(game, options) {
    return memory()
      .guides.filter((guide) => guide.game === game)
      .filter((guide) => options?.includeUnpublished === true || guide.status === "PUBLISHED")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(summaryOf);
  },

  async get(game, slug) {
    return memory().guides.find((guide) => guide.game === game && guide.slug === slug) ?? null;
  },

  async create(input, writer) {
    const store = memory();
    const taken = new Set(store.guides.map((guide) => guide.slug));
    const slug = guideSlug(input.title, taken);
    const now = new Date().toISOString();

    store.guides.unshift({
      id: `local-g${store.next++}`,
      game: input.game,
      slug,
      title: input.title,
      excerpt: excerptFromMarkdown(input.body),
      body: input.body,
      status: "DRAFT",
      verifiedPatch: null,
      characterId: input.characterId,
      author: toAuthor(writer),
      publishedAt: null,
      updatedAt: now,
      revisions: [],
    });

    return slug;
  },

  async update(id, patch, writer, note) {
    const guide = memory().guides.find((entry) => entry.id === id);
    if (!guide) return;

    if (patch.title !== undefined) guide.title = patch.title;
    if (patch.body !== undefined) {
      guide.body = patch.body;
      guide.excerpt = excerptFromMarkdown(patch.body);
    }
    if (patch.characterId !== undefined) guide.characterId = patch.characterId;

    guide.updatedAt = new Date().toISOString();
    guide.revisions = [
      {
        id: `local-r${memory().next++}`,
        editor: writer.username,
        patch: guide.verifiedPatch,
        note: note ?? null,
        createdAt: guide.updatedAt,
      },
      ...guide.revisions,
    ];
  },

  // In memoria il registro della moderazione non esiste: `audit` si ignora.
  async setStatus(id, status, options) {
    const guide = memory().guides.find((entry) => entry.id === id);
    if (!guide) return false;
    if (options?.expected !== undefined && guide.status !== options.expected) return false;
    guide.status = status;
    guide.publishedAt =
      status === "PUBLISHED" ? (guide.publishedAt ?? new Date().toISOString()) : guide.publishedAt;
    guide.updatedAt = new Date().toISOString();
    return true;
  },

  async setVerifiedPatch(id, patch, writer) {
    const guide = memory().guides.find((entry) => entry.id === id);
    if (!guide) return;
    guide.verifiedPatch = patch;
    guide.updatedAt = new Date().toISOString();
    guide.revisions = [
      {
        id: `local-r${memory().next++}`,
        editor: writer.username,
        patch,
        note: "patch di verifica aggiornata",
        createdAt: guide.updatedAt,
      },
      ...guide.revisions,
    ];
  },

  async authorOf(id) {
    // In memoria non esistono identificativi utente: l'autore e' sempre chi sta
    // usando la modalita' dimostrativa, quindi la proprieta' non discrimina.
    return memory().guides.some((guide) => guide.id === id) ? "demo" : null;
  },

  async stateOf(id) {
    const guide = memory().guides.find((entry) => entry.id === id);
    return guide
      ? { authorId: "demo", status: guide.status, game: guide.game, slug: guide.slug }
      : null;
  },
};

/* ======================================================== archivio su DB */

/**
 * Le colonne dell'autore che la pagina mostra, e nient'altro.
 *
 * Fino all'11/10 la relazione si caricava con `author: true` (e `editor: true`
 * nella cronologia): la riga intera di `users`, email e hash della password
 * compresi, entrava in memoria a ogni lettura di una guida. Non arrivava in
 * pagina, ma bastava un oggetto passato per intero a un componente client per
 * spedirla al browser.
 */
const AUTHOR_COLUMNS = {
  columns: { username: true },
  with: { profile: { columns: { displayName: true, cosmetics: true } } },
} as const;

function authorFromRow(row: {
  username: string;
  profile?: { displayName: string; cosmetics: Record<string, string> } | null;
}): GuideAuthor {
  return {
    username: row.username,
    displayName: row.profile?.displayName ?? row.username,
    accent: normalizeCustomization(row.profile?.cosmetics).accent,
  };
}

async function gameIdOf(slug: string): Promise<string | null> {
  const row = await db.query.games.findFirst({
    where: eq(games.slug, slug),
    columns: { id: true },
  });
  return row?.id ?? null;
}

const dbGuides: GuideStore = {
  volatile: false,

  async list(game, options) {
    const gameId = await gameIdOf(game);
    if (!gameId) return [];

    const rows = await db.query.guides.findMany({
      where:
        options?.includeUnpublished === true
          ? eq(guides.gameId, gameId)
          : and(eq(guides.gameId, gameId), eq(guides.status, "PUBLISHED")),
      orderBy: [desc(guides.updatedAt)],
      limit: 100,
      with: { author: AUTHOR_COLUMNS },
    });

    return rows.map((row) => ({
      id: row.id,
      game,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      status: row.status,
      verifiedPatch: row.verifiedPatch,
      characterId: row.characterId,
      author: authorFromRow(row.author),
      publishedAt: row.publishedAt?.toISOString() ?? null,
      updatedAt: row.updatedAt.toISOString(),
    }));
  },

  async get(game, slug) {
    const row = await db.query.guides.findFirst({
      where: eq(guides.slug, slug),
      with: {
        author: AUTHOR_COLUMNS,
        game: { columns: { slug: true } },
        revisions: {
          columns: { id: true, patch: true, note: true, createdAt: true },
          with: { editor: { columns: { username: true } } },
          orderBy: [desc(guideRevisions.createdAt)],
          limit: 20,
        },
      },
    });
    // Lo slug e' unico su tutta la tabella, ma l'indirizzo contiene anche il
    // gioco: se non combaciano la pagina non esiste, altrimenti la stessa guida
    // sarebbe raggiungibile da cinque indirizzi diversi.
    if (!row || row.game.slug !== game) return null;

    return {
      id: row.id,
      game,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      status: row.status,
      verifiedPatch: row.verifiedPatch,
      characterId: row.characterId,
      author: authorFromRow(row.author),
      publishedAt: row.publishedAt?.toISOString() ?? null,
      updatedAt: row.updatedAt.toISOString(),
      body: row.bodyMd,
      revisions: row.revisions.map((revision) => ({
        id: revision.id,
        editor: revision.editor.username,
        patch: revision.patch,
        note: revision.note,
        createdAt: revision.createdAt.toISOString(),
      })),
    };
  },

  async create(input, writer) {
    const gameId = await gameIdOf(input.game);
    if (!gameId) throw new Error(`gioco non trovato: ${input.game}`);

    const existing = await db.query.guides.findMany({ columns: { slug: true } });
    const slug = guideSlug(input.title, new Set(existing.map((row) => row.slug)));

    await db.insert(guides).values({
      gameId,
      authorId: writer.id,
      slug,
      title: input.title,
      excerpt: excerptFromMarkdown(input.body),
      bodyMd: input.body,
      characterId: input.characterId,
      status: "DRAFT",
    });

    return slug;
  },

  async update(id, patch, writer, note) {
    await db.transaction(async (tx) => {
      const current = await tx.query.guides.findFirst({
        where: eq(guides.id, id),
        columns: { bodyMd: true, verifiedPatch: true },
      });
      if (!current) return;

      await tx
        .update(guides)
        .set({
          ...(patch.title === undefined ? {} : { title: patch.title }),
          ...(patch.body === undefined
            ? {}
            : { bodyMd: patch.body, excerpt: excerptFromMarkdown(patch.body) }),
          ...(patch.characterId === undefined ? {} : { characterId: patch.characterId }),
          updatedAt: new Date(),
        })
        .where(eq(guides.id, id));

      // La revisione conserva il testo PRECEDENTE: e' quello che serve per
      // capire cosa e' cambiato. Salvare il nuovo duplicherebbe la riga della
      // guida senza aggiungere informazione.
      await tx.insert(guideRevisions).values({
        guideId: id,
        editorId: writer.id,
        bodyMd: current.bodyMd,
        patch: current.verifiedPatch,
        note: note ?? null,
      });
    });
  },

  async setStatus(id, status, options) {
    return db.transaction(async (tx) => {
      const current = await tx.query.guides.findFirst({
        where: eq(guides.id, id),
        columns: { publishedAt: true },
      });
      if (!current) return false;

      const updated = await tx
        .update(guides)
        .set({
          status,
          // La data di pubblicazione si scrive una volta sola: una guida
          // ripubblicata dopo un'archiviazione non e' un contenuto nuovo.
          publishedAt: status === "PUBLISHED" ? (current.publishedAt ?? new Date()) : current.publishedAt,
          updatedAt: new Date(),
        })
        .where(
          options?.expected === undefined
            ? eq(guides.id, id)
            : and(eq(guides.id, id), eq(guides.status, options.expected)),
        )
        .returning({ id: guides.id });
      if (updated.length === 0) return false;

      if (options?.audit) {
        await tx.insert(modActions).values({
          moderatorId: options.audit.moderatorId,
          targetType: "GUIDE",
          targetId: id,
          action: `status_${status.toLowerCase()}`,
        });
      }
      return true;
    });
  },

  async setVerifiedPatch(id, patch, writer, audit) {
    await db.transaction(async (tx) => {
      const current = await tx.query.guides.findFirst({
        where: eq(guides.id, id),
        columns: { bodyMd: true },
      });
      if (!current) return;

      await tx
        .update(guides)
        .set({ verifiedPatch: patch, updatedAt: new Date() })
        .where(eq(guides.id, id));

      await tx.insert(guideRevisions).values({
        guideId: id,
        editorId: writer.id,
        bodyMd: current.bodyMd,
        patch,
        note: "patch di verifica aggiornata",
      });

      // La patch nel motivo: e' la cosa dichiarata, ed e' quella che va
      // ritrovata se un giorno la dichiarazione si rivela falsa. null quando la
      // dichiarazione si toglie.
      if (audit) {
        await tx.insert(modActions).values({
          moderatorId: audit.moderatorId,
          targetType: "GUIDE",
          targetId: id,
          action: "verified_patch",
          reason: patch,
        });
      }
    });
  },

  async authorOf(id) {
    const row = await db.query.guides.findFirst({
      where: eq(guides.id, id),
      columns: { authorId: true },
    });
    return row?.authorId ?? null;
  },

  async stateOf(id) {
    const row = await db.query.guides.findFirst({
      where: eq(guides.id, id),
      columns: { authorId: true, status: true, slug: true },
      with: { game: { columns: { slug: true } } },
    });
    return row
      ? { authorId: row.authorId, status: row.status, game: row.game.slug, slug: row.slug }
      : null;
  },
};

/** Nome utente di un identificativo: usato dalle pagine per i collegamenti. */
export async function usernameOf(userId: string): Promise<string | null> {
  const row = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { username: true },
  });
  return row?.username ?? null;
}
