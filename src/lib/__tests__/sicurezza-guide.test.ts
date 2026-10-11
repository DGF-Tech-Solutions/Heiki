import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Le difese delle guide trovate dall'audit dell'11/10: chi puo' spostare una
 * guida, chi la vede, cosa succede a database fermo, sospensioni e id scritti
 * a mano.
 *
 * Database, sessione, sospensioni e lingua sono sostituiti: interessa la
 * decisione che le azioni prendono, non Postgres. `env` decide, test per
 * test, se il database e' configurato, se risponde e chi e' collegato.
 */
const env = vi.hoisted(() => ({
  configured: false,
  reachable: false,
  sessionUserId: null as string | null,
  user: null as null | { id: string; username: string; role: string },
  guide: null as null | {
    authorId: string;
    status: string;
    slug: string;
    game: { slug: string };
  },
  suspended: false,
  /** ogni scrittura fatta dentro una transazione: tabella e valori */
  writes: [] as { table: unknown; values?: Record<string, unknown> }[],
}));

vi.mock("@/lib/db", () => {
  // Transazione finta: esegue davvero il corpo, e ogni update e insert lascia
  // una traccia in `env.writes`. Basta a vedere cosa l'archivio scrive e in
  // quale tabella, senza Postgres.
  const tx = {
    query: { guides: { findFirst: async () => ({ publishedAt: null, bodyMd: "testo" }) } },
    update: (table: unknown) => ({
      set: (values: Record<string, unknown>) => ({
        where: () => {
          env.writes.push({ table, values });
          return {
            returning: async () => [{ id: "aggiornata" }],
            then: (resolve: (value: undefined) => void) => resolve(undefined),
          };
        },
      }),
    }),
    insert: (table: unknown) => ({
      values: async (values: Record<string, unknown>) => {
        env.writes.push({ table, values });
      },
    }),
  };
  return {
    isDatabaseConfigured: () => env.configured,
    databaseReachable: async () => env.configured && env.reachable,
    db: {
      query: {
        users: { findFirst: async () => (env.user ? { ...env.user, profile: null } : undefined) },
        guides: { findFirst: async () => env.guide ?? undefined },
      },
      transaction: async (body: (t: typeof tx) => Promise<unknown>) => body(tx),
    },
  };
});
vi.mock("@/lib/auth", () => ({
  auth: async () => (env.sessionUserId ? { user: { id: env.sessionUserId } } : null),
}));
vi.mock("@/lib/moderation/suspension", () => ({
  suspensionFor: async () => (env.suspended ? { active: true, reason: "prova" } : { active: false }),
  suspensionMessage: () => "SOSPESO",
}));
vi.mock("@/lib/i18n/server", () => ({ getLocale: async () => "it" }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Error(`redirect:${to}`);
  },
}));

const { guides, modActions } = await import("@/lib/db/schema");
const { canMoveGuide, canViewGuide, guideTransitions, getGuideStore, isGuideDemo } = await import(
  "../guides/store"
);
const { createGuideAction, setGuideStatusAction, setVerifiedPatchAction } = await import(
  "../guides/actions"
);

const AUTHOR_ID = "11111111-1111-4111-8111-111111111111";
const EDITOR_ID = "22222222-2222-4222-8222-222222222222";
const GUIDE_ID = "33333333-3333-4333-8333-333333333333";

const BODY = "Un corpo abbastanza lungo. ".repeat(12);

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

beforeEach(() => {
  env.configured = false;
  env.reachable = false;
  env.sessionUserId = null;
  env.user = null;
  env.guide = null;
  env.suspended = false;
  env.writes = [];
  globalThis.__gachazoneGuides = undefined;
});

/* --------------------------------------------------------- regole pure -- */

describe("canMoveGuide", () => {
  const author = { own: true, editor: false };
  const editor = { own: false, editor: true };
  const stranger = { own: false, editor: false };

  it("l'autore manda in revisione e ritira in bozza, e basta", () => {
    expect(canMoveGuide("DRAFT", "IN_REVIEW", author)).toBe(true);
    expect(canMoveGuide("IN_REVIEW", "DRAFT", author)).toBe(true);
    expect(canMoveGuide("DRAFT", "PUBLISHED", author)).toBe(false);
    expect(canMoveGuide("IN_REVIEW", "ARCHIVED", author)).toBe(false);
  });

  /** Il difetto: una guida archiviata da un redattore tornava in coda da sola. */
  it("l'autore non riapre una guida archiviata ne' ritira una pubblicata", () => {
    expect(canMoveGuide("ARCHIVED", "DRAFT", author)).toBe(false);
    expect(canMoveGuide("ARCHIVED", "IN_REVIEW", author)).toBe(false);
    expect(canMoveGuide("PUBLISHED", "DRAFT", author)).toBe(false);
    expect(canMoveGuide("PUBLISHED", "IN_REVIEW", author)).toBe(false);
  });

  it("il redattore fa tutti i passaggi, chi non e' ne' autore ne' redattore nessuno", () => {
    expect(canMoveGuide("ARCHIVED", "PUBLISHED", editor)).toBe(true);
    expect(canMoveGuide("IN_REVIEW", "ARCHIVED", editor)).toBe(true);
    expect(canMoveGuide("DRAFT", "IN_REVIEW", stranger)).toBe(false);
  });

  it("restare nello stesso stato non e' un passaggio", () => {
    expect(canMoveGuide("DRAFT", "DRAFT", editor)).toBe(false);
  });

  it("la tabella per i pulsanti segue la stessa regola", () => {
    expect(guideTransitions(author)).toEqual({
      DRAFT: ["IN_REVIEW"],
      IN_REVIEW: ["DRAFT"],
      PUBLISHED: [],
      ARCHIVED: [],
    });
    expect(guideTransitions(editor).ARCHIVED).toEqual(["DRAFT", "IN_REVIEW", "PUBLISHED"]);
  });
});

describe("canViewGuide", () => {
  it("una guida non pubblicata la vedono solo autore e redattori", () => {
    for (const status of ["DRAFT", "IN_REVIEW", "ARCHIVED"] as const) {
      expect(canViewGuide(status, { own: false, editor: false })).toBe(false);
      expect(canViewGuide(status, { own: true, editor: false })).toBe(true);
      expect(canViewGuide(status, { own: false, editor: true })).toBe(true);
    }
    expect(canViewGuide("PUBLISHED", { own: false, editor: false })).toBe(true);
  });
});

describe("isGuideDemo", () => {
  it("dimostrativa solo senza database configurato, non a database fermo", async () => {
    const store = await getGuideStore();
    expect(store.volatile).toBe(true);
    expect(isGuideDemo(store)).toBe(true);

    env.configured = true;
    env.reachable = false;
    const fallback = await getGuideStore();
    expect(fallback.volatile).toBe(true);
    expect(isGuideDemo(fallback)).toBe(false);
  });
});

/* -------------------------------------------------------------- azioni -- */

describe("database configurato ma fermo", () => {
  /**
   * Prima si scriveva come redattore dimostrativo nell'archivio in memoria,
   * visibile a tutti. Ora e' un errore, anche per chi non e' collegato.
   */
  it("nessuna azione scrive, e nessuna risponde come ospite o redattore", async () => {
    env.configured = true;
    env.reachable = false;

    const created = await createGuideAction(
      {},
      form({ game: "grand-cross", title: "Titolo abbastanza lungo", body: BODY }),
    );
    expect(created.error).toMatch(/database/i);

    const moved = await setGuideStatusAction("demo-guida-1", "grand-cross", "ARCHIVED");
    expect(moved.error).toMatch(/database/i);
    expect(moved.success).toBeUndefined();

    const patched = await setVerifiedPatchAction(
      {},
      form({ id: "demo-guida-1", game: "grand-cross", slug: "x", patch: "9.9" }),
    );
    expect(patched.error).toMatch(/database/i);

    // la guida di esempio e' ancora pubblicata
    const store = await getGuideStore();
    const list = await store.list("grand-cross");
    expect(list.some((guide) => guide.id === "demo-guida-1")).toBe(true);
  });
});

describe("con il database", () => {
  beforeEach(() => {
    env.configured = true;
    env.reachable = true;
  });

  function loginAs(id: string, role: string) {
    env.sessionUserId = id;
    env.user = { id, username: id === AUTHOR_ID ? "autore" : "redattore", role };
  }

  it("un id che non e' un UUID e' un rifiuto pulito, non un errore 500", async () => {
    loginAs(EDITOR_ID, "EDITOR");
    expect(await setGuideStatusAction("1 or 1=1", "grand-cross", "PUBLISHED")).toEqual({
      error: expect.stringContaining("non esiste"),
    });
    expect(
      await setVerifiedPatchAction(
        {},
        form({ id: "non-un-uuid", game: "grand-cross", slug: "x", patch: "1.0" }),
      ),
    ).toEqual({ error: expect.stringContaining("non esiste") });
  });

  it("un redattore sospeso non pubblica ne' dichiara la patch", async () => {
    loginAs(EDITOR_ID, "EDITOR");
    env.suspended = true;
    env.guide = { authorId: AUTHOR_ID, status: "IN_REVIEW", slug: "una-guida", game: { slug: "grand-cross" } };

    expect(await setGuideStatusAction(GUIDE_ID, "grand-cross", "PUBLISHED")).toEqual({
      error: "SOSPESO",
    });
    expect(
      await setVerifiedPatchAction(
        {},
        form({ id: GUIDE_ID, game: "grand-cross", slug: "una-guida", patch: "1.0" }),
      ),
    ).toEqual({ error: "SOSPESO" });
    expect(env.writes).toEqual([]);
  });

  it("l'autore non riporta in bozza una guida archiviata", async () => {
    loginAs(AUTHOR_ID, "CONTRIBUTOR");
    env.guide = { authorId: AUTHOR_ID, status: "ARCHIVED", slug: "una-guida", game: { slug: "grand-cross" } };

    const result = await setGuideStatusAction(GUIDE_ID, "grand-cross", "DRAFT");
    expect(result.error).toBeDefined();
    expect(env.writes).toEqual([]);
  });

  it("l'autore manda in revisione la propria bozza, e non finisce nel registro", async () => {
    loginAs(AUTHOR_ID, "CONTRIBUTOR");
    env.guide = { authorId: AUTHOR_ID, status: "DRAFT", slug: "una-guida", game: { slug: "grand-cross" } };

    const result = await setGuideStatusAction(GUIDE_ID, "grand-cross", "IN_REVIEW");
    expect(result.success).toBeDefined();
    expect(env.writes.map((write) => write.table)).toEqual([guides]);
    expect(env.writes[0]?.values).toMatchObject({ status: "IN_REVIEW" });
  });

  it("il redattore che pubblica la guida di un altro scrive nel registro, nella stessa transazione", async () => {
    loginAs(EDITOR_ID, "EDITOR");
    env.guide = { authorId: AUTHOR_ID, status: "IN_REVIEW", slug: "una-guida", game: { slug: "grand-cross" } };

    expect((await setGuideStatusAction(GUIDE_ID, "grand-cross", "PUBLISHED")).success).toBeDefined();
    expect(env.writes.map((write) => write.table)).toEqual([guides, modActions]);
    expect(env.writes[1]?.values).toEqual({
      moderatorId: EDITOR_ID,
      targetType: "GUIDE",
      targetId: GUIDE_ID,
      action: "status_published",
    });
  });

  it("la dichiarazione di patch va nel registro con la patch come motivo", async () => {
    loginAs(EDITOR_ID, "EDITOR");
    env.guide = { authorId: AUTHOR_ID, status: "PUBLISHED", slug: "una-guida", game: { slug: "grand-cross" } };

    const result = await setVerifiedPatchAction(
      {},
      form({ id: GUIDE_ID, game: "grand-cross", slug: "una-guida", patch: "1.2" }),
    );
    expect(result.success).toBeDefined();
    expect(env.writes.find((write) => write.table === modActions)?.values).toEqual({
      moderatorId: EDITOR_ID,
      targetType: "GUIDE",
      targetId: GUIDE_ID,
      action: "verified_patch",
      reason: "1.2",
    });
  });

  it("una guida di un altro gioco non si sposta dall'indirizzo sbagliato", async () => {
    loginAs(EDITOR_ID, "EDITOR");
    env.guide = { authorId: AUTHOR_ID, status: "IN_REVIEW", slug: "una-guida", game: { slug: "altro" } };
    expect((await setGuideStatusAction(GUIDE_ID, "grand-cross", "PUBLISHED")).error).toBeDefined();
    expect(env.writes).toEqual([]);
  });
});

describe("createGuideAction", () => {
  it("rifiuta un gioco che non e' nel registro", async () => {
    const result = await createGuideAction(
      {},
      form({ game: "gioco-inventato", title: "Titolo abbastanza lungo", body: BODY }),
    );
    expect(result.error).toBeDefined();
    expect((await (await getGuideStore()).list("gioco-inventato", { includeUnpublished: true })).length).toBe(0);
  });

  it("rifiuta un personaggio che il gioco non ha", async () => {
    const result = await createGuideAction(
      {},
      form({
        game: "grand-cross",
        title: "Titolo abbastanza lungo",
        body: BODY,
        characterId: "personaggio-inventato",
      }),
    );
    expect(result.error).toBeDefined();
  });

  it("nella modalita' dimostrativa crea la bozza e porta alla sua pagina", async () => {
    await expect(
      createGuideAction({}, form({ game: "grand-cross", title: "Titolo abbastanza lungo", body: BODY })),
    ).rejects.toThrow(/^redirect:\/grand-cross\/guide\//);
  });
});
