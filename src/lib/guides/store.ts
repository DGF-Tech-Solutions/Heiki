/**
 * Archivio delle guide.
 *
 * Stessa struttura della community: due implementazioni dietro una sola
 * interfaccia, cosi' la sezione si puo' provare - e scrivere davvero - anche
 * senza database. La differenza e' dichiarata da `volatile`, non nascosta.
 */

import { and, desc, eq } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { games, guideRevisions, guides, users } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import { excerptFromMarkdown } from "@/lib/markdown";
import { DEMO_GUIDES } from "./demo-seed";
import { guideSlug } from "./types";
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
  setStatus(id: string, status: GuideStatus): Promise<void>;
  setVerifiedPatch(id: string, patch: string | null, writer: GuideWriter): Promise<void>;
  /** id dell'autore: serve per decidere se chi modifica ne ha il diritto */
  authorOf(id: string): Promise<string | null>;
}

export async function getGuideStore(): Promise<GuideStore> {
  return (await databaseReachable()) ? dbGuides : memoryGuides;
}

/* ==================================================== archivio in memoria */

interface GuideMemory {
  guides: GuideDetail[];
  next: number;
}

declare global {
  var __gachazoneGuides: GuideMemory | undefined;
}

function memory(): GuideMemory {
  if (!globalThis.__gachazoneGuides) {
    globalThis.__gachazoneGuides = {
      guides: DEMO_GUIDES.map((guide) => JSON.parse(JSON.stringify(guide)) as GuideDetail),
      next: 1,
    };
  }
  return globalThis.__gachazoneGuides;
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

  async setStatus(id, status) {
    const guide = memory().guides.find((entry) => entry.id === id);
    if (!guide) return;
    guide.status = status;
    guide.publishedAt =
      status === "PUBLISHED" ? (guide.publishedAt ?? new Date().toISOString()) : guide.publishedAt;
    guide.updatedAt = new Date().toISOString();
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
};

/* ======================================================== archivio su DB */

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
      with: { author: { with: { profile: true } } },
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
        author: { with: { profile: true } },
        game: true,
        revisions: { with: { editor: true }, orderBy: [desc(guideRevisions.createdAt)], limit: 20 },
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

  async setStatus(id, status) {
    const current = await db.query.guides.findFirst({
      where: eq(guides.id, id),
      columns: { publishedAt: true },
    });

    await db
      .update(guides)
      .set({
        status,
        // La data di pubblicazione si scrive una volta sola: una guida
        // ripubblicata dopo un'archiviazione non e' un contenuto nuovo.
        publishedAt:
          status === "PUBLISHED" ? (current?.publishedAt ?? new Date()) : (current?.publishedAt ?? null),
        updatedAt: new Date(),
      })
      .where(eq(guides.id, id));
  },

  async setVerifiedPatch(id, patch, writer) {
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
    });
  },

  async authorOf(id) {
    const row = await db.query.guides.findFirst({
      where: eq(guides.id, id),
      columns: { authorId: true },
    });
    return row?.authorId ?? null;
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
