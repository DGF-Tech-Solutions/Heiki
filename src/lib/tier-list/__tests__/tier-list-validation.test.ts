import { describe, expect, it } from "vitest";
import { requireGameModule } from "@/lib/games/registry";
import { defaultTiers, TIER_COLORS, type TierRow } from "../types";
import {
  copyTitle,
  parseTierListId,
  parseTierRows,
  saveTierListSchema,
  TIER_LIST_LIMITS,
  tierListProblem,
  tierRowsSchema,
  type TierListProblem,
} from "../validation";

// Un roster piccolo per i casi a mano; quello vero di Grand Cross per i controlli sul gioco
const ROSTER: ReadonlySet<string> = new Set(["eroe-a", "eroe-b", "eroe-c"]);
const RED = TIER_COLORS[0]!.hex;

function row(id: string, heroIds: string[] = [], overrides: Partial<TierRow> = {}): TierRow {
  return { id, label: id.toUpperCase(), color: RED, heroIds, ...overrides };
}

/** Il problema che lo schema delle righe trova, o null se le righe vanno bene. */
function rowsProblem(raw: unknown, roster: ReadonlySet<string> = ROSTER): TierListProblem | null {
  const parsed = tierRowsSchema(roster).safeParse(raw);
  return parsed.success ? null : tierListProblem(parsed.error);
}

function saveProblem(raw: Record<string, unknown>): TierListProblem | null {
  const parsed = saveTierListSchema(ROSTER).safeParse({
    game: "grand-cross",
    title: "PvP",
    tiers: [row("s", ["eroe-a"])],
    ...raw,
  });
  return parsed.success ? null : tierListProblem(parsed.error);
}

describe("schema delle righe di una tier list", () => {
  it("accetta le righe predefinite e una lista con eroi del roster", () => {
    expect(rowsProblem(defaultTiers())).toBeNull();
    expect(rowsProblem([row("s", ["eroe-a", "eroe-b"]), row("a", ["eroe-c"])])).toBeNull();
  });

  it("controlla gli eroi sul roster vero del gioco", () => {
    const heroes = requireGameModule("grand-cross").roster!.heroes;
    const roster = new Set(heroes.map((hero) => hero.id));
    const first = heroes[0]!.id;
    expect(rowsProblem([row("s", [first])], roster)).toBeNull();
    expect(rowsProblem([row("s", [first, "non-esiste"])], roster)).toBe("hero-unknown");
  });

  it("rifiuta un eroe che il roster non ha", () => {
    expect(rowsProblem([row("s", ["eroe-z"])])).toBe("hero-unknown");
  });

  it("rifiuta lo stesso eroe due volte, nella stessa riga o in righe diverse", () => {
    expect(rowsProblem([row("s", ["eroe-a", "eroe-a"])])).toBe("hero-duplicate");
    expect(rowsProblem([row("s", ["eroe-a"]), row("a", ["eroe-b", "eroe-a"])])).toBe(
      "hero-duplicate",
    );
  });

  it("accetta solo i colori offerti dal Maker", () => {
    for (const color of TIER_COLORS) {
      expect(rowsProblem([row("s", [], { color: color.hex })])).toBeNull();
    }
    expect(rowsProblem([row("s", [], { color: "#123456" })])).toBe("color");
    expect(rowsProblem([row("s", [], { color: "red" })])).toBe("color");
    expect(rowsProblem([row("s", [], { color: "url(javascript:alert(1))" })])).toBe("color");
  });

  it("tiene le righe fra una e il tetto", () => {
    const many = (n: number) => Array.from({ length: n }, (_, i) => row(`r${i}`));
    expect(rowsProblem([])).toBe("rows-empty");
    expect(rowsProblem(many(TIER_LIST_LIMITS.rows))).toBeNull();
    expect(rowsProblem(many(TIER_LIST_LIMITS.rows + 1))).toBe("rows-many");
  });

  it("vuole un'etichetta non vuota e non piu' lunga del limite", () => {
    expect(rowsProblem([row("s", [], { label: "   " })])).toBe("label");
    expect(rowsProblem([row("s", [], { label: "x".repeat(TIER_LIST_LIMITS.label) })])).toBeNull();
    expect(rowsProblem([row("s", [], { label: "x".repeat(TIER_LIST_LIMITS.label + 1) })])).toBe(
      "label",
    );
  });

  it("rifiuta due righe con lo stesso id", () => {
    expect(rowsProblem([row("s"), row("s")])).toBe("row");
  });

  it("non cade su dati di forma sbagliata: `[{}]`, testo, null", () => {
    for (const raw of [[{}], "ciao", null, 42, [null], [{ id: "s", heroIds: "eroe-a" }]]) {
      expect(() => parseTierRows(raw, ROSTER)).not.toThrow();
      expect(parseTierRows(raw, ROSTER)).toBeNull();
    }
    expect(rowsProblem([{}])).toBe("invalid");
  });

  it("toglie i campi in piu' che arrivano da un link scritto a mano", () => {
    const parsed = parseTierRows([{ ...row("s", ["eroe-a"]), extra: "<script>" }], ROSTER);
    expect(parsed).toEqual([row("s", ["eroe-a"])]);
  });
});

describe("schema del salvataggio", () => {
  it("accetta una lista valida e la rende pubblica se non si sceglie", () => {
    const parsed = saveTierListSchema(ROSTER).parse({
      game: "grand-cross",
      title: "  PvP Meta  ",
      tiers: [row("s", ["eroe-a"])],
    });
    expect(parsed.title).toBe("PvP Meta");
    expect(parsed.isPublic).toBe(true);
    expect(saveProblem({ isPublic: false })).toBeNull();
  });

  it("controlla titolo e descrizione", () => {
    expect(saveProblem({ title: "   " })).toBe("title-missing");
    expect(saveProblem({ title: "x".repeat(TIER_LIST_LIMITS.title) })).toBeNull();
    expect(saveProblem({ title: "x".repeat(TIER_LIST_LIMITS.title + 1) })).toBe("title-long");
    expect(saveProblem({ description: "x".repeat(TIER_LIST_LIMITS.description + 1) })).toBe(
      "description-long",
    );
  });

  it("vuole un UUID come id della lista da aggiornare", () => {
    expect(saveProblem({ id: "4f9c1d2e-8b7a-4c3d-9e2f-1a2b3c4d5e6f" })).toBeNull();
    expect(saveProblem({ id: "1 OR 1=1" })).toBe("invalid");
  });

  it("passa le righe dallo stesso schema: duplicati e colori anche qui", () => {
    expect(saveProblem({ tiers: [row("s", ["eroe-a"]), row("a", ["eroe-a"])] })).toBe(
      "hero-duplicate",
    );
    expect(saveProblem({ tiers: [row("s", [], { color: "#000000" })] })).toBe("color");
  });
});

describe("id delle tier list da ?id=", () => {
  it("accetta solo un UUID", () => {
    const id = "4f9c1d2e-8b7a-4c3d-9e2f-1a2b3c4d5e6f";
    expect(parseTierListId(id)).toBe(id);
    expect(parseTierListId("abc")).toBeNull();
    expect(parseTierListId("")).toBeNull();
    expect(parseTierListId(undefined)).toBeNull();
    // `?id=a&id=b` arriva come elenco
    expect(parseTierListId([id, id])).toBeNull();
    expect(parseTierListId(`${id}' OR '1'='1`)).toBeNull();
  });
});

describe("titolo di una copia", () => {
  it("aggiunge il suffisso a un titolo corto", () => {
    expect(copyTitle("PvP", " (Copia)")).toBe("PvP (Copia)");
  });

  it("resta nel limite anche partendo da un titolo di 80 caratteri", () => {
    const copy = copyTitle("x".repeat(TIER_LIST_LIMITS.title), " (Copia)");
    expect(copy.length).toBeLessThanOrEqual(TIER_LIST_LIMITS.title);
    expect(copy.endsWith(" (Copia)")).toBe(true);
  });

  it("non spezza un'emoji a meta'", () => {
    const copy = copyTitle("🔥".repeat(TIER_LIST_LIMITS.title), " (Copy)");
    expect(copy.length).toBeLessThanOrEqual(TIER_LIST_LIMITS.title);
    expect(copy).toMatch(/^(🔥)+ \(Copy\)$/u);
  });
});
