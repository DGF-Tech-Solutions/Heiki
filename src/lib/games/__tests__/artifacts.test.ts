/**
 * Test degli artefatti: Carte artefatto e Set artefatto.
 *
 * Come per l'Endgame: le funzioni pure si provano su casi scritti a mano, poi si
 * controllano i dati veri di Grand Cross sul contratto - ogni carta citata
 * esiste, carta e set si citano a vicenda, ogni livello ha il suo testo e i suoi
 * punti - e non sui numeri del momento.
 */

import { describe, expect, it } from "vitest";
import type { ArtifactIndex, ArtifactPack, ArtifactSet } from "../artifact-types";
import {
  cardCode,
  cardSources,
  enhancementSteps,
  filterCards,
  filterSets,
  fold,
  packChance,
  platesFor,
  setStats,
  type ArtifactCardSummary,
  type ArtifactSetSummary,
} from "../artifacts";
import { gameGroups } from "../catalog";
import { grandCrossModule } from "../grand-cross";

const data = grandCrossModule.artifacts!;

function summary(number: number, extra: Partial<ArtifactSetSummary> = {}): ArtifactSetSummary {
  return {
    number,
    name: `Set ${number}`,
    event: null,
    cards: [],
    effect: "",
    levels: 5,
    contents: [],
    races: [],
    factions: [],
    misc: [],
    ...extra,
  };
}

function card(id: string, extra: Partial<ArtifactCardSummary> = {}): ArtifactCardSummary {
  return { id, code: "PG-1", name: id, type: 1, grade: 4, set: null, setName: null, image: true, ...extra };
}

describe("funzioni", () => {
  it("la sigla di una carta cambia con la lingua, come nel gioco", () => {
    const index = { types: { "1": { key: "character", name: { it: "Personaggio", en: "Character" }, prefix: { it: "PG", en: "CH" } } } };
    expect(cardCode(index as unknown as ArtifactIndex, { type: 1, number: 7 }, "it")).toBe("PG-7");
    expect(cardCode(index as unknown as ArtifactIndex, { type: 1, number: 7 }, "en")).toBe("CH-7");
  });

  it("la probabilita' di un pacchetto e' il peso sulla somma dei pesi", () => {
    const pack: ArtifactPack = { name: null, description: null, icon: null, cards: [], total: 353 };
    expect(packChance(pack, 76)).toBeCloseTo(21.53, 2);
    expect(packChance({ ...pack, total: 0 }, 5)).toBeNull();
  });

  it("i punti sono totali per livello, dal 2 al massimo del set", () => {
    const index = { enhancement: { classes: { "2": [1000, 2500, 5500, 13000, 35500] }, cardsPerRound: 99 } };
    const set = { enhanceClass: 2, levels: [{}, {}, {}] } as unknown as ArtifactSet;
    expect(enhancementSteps(index as unknown as ArtifactIndex, set)).toEqual([
      { level: 2, points: 1000 },
      { level: 3, points: 2500 },
    ]);
    expect(enhancementSteps(index as unknown as ArtifactIndex, { ...set, levels: [{ it: "", en: "" }] })).toEqual([]);
  });

  it("le Carte placcate si contano per eccesso", () => {
    expect(platesFor(32500, 1600)).toBe(21);
    expect(platesFor(3200, 1600)).toBe(2);
    expect(platesFor(100, 0)).toBe(0);
  });

  it("le statistiche di un set sono la somma delle sue carte", () => {
    expect(
      setStats([
        { stats: { atk: 10, def: 0, hp: 100 } },
        { stats: { atk: 5, def: 7, hp: 0 } },
      ]),
    ).toEqual({ atk: 15, def: 7, hp: 100 });
  });

  it("la ricerca non guarda maiuscole ne' accenti", () => {
    expect(fold("Città di VAIZEL")).toBe("citta di vaizel");
    const sets = [summary(1, { name: "Città sacra" }), summary(2, { name: "Altro", event: "Festa" })];
    expect(filterSets(sets, { search: "citta" }).map((set) => set.number)).toEqual([1]);
    expect(filterSets(sets, { search: "festa" }).map((set) => set.number)).toEqual([2]);
    expect(filterSets(sets, { search: "no.2" }).map((set) => set.number)).toEqual([2]);
  });

  it("i filtri dei set si sommano", () => {
    const sets = [
      summary(1, { contents: [2], races: [3] }),
      summary(2, { contents: [2], races: [4] }),
      summary(3, { contents: [4], factions: [6] }),
    ];
    expect(filterSets(sets, { content: 2 }).map((set) => set.number)).toEqual([1, 2]);
    expect(filterSets(sets, { content: 2, race: 4 }).map((set) => set.number)).toEqual([2]);
    expect(filterSets(sets, { faction: 6, content: null }).map((set) => set.number)).toEqual([3]);
  });

  it("le carte si filtrano per tipo, grado e set", () => {
    const cards = [card("a", { set: 1 }), card("b", { type: 2 }), card("c", { grade: 6, set: 2, setName: "Luce" })];
    expect(filterCards(cards, { inSet: true }).map((entry) => entry.id)).toEqual(["a", "c"]);
    expect(filterCards(cards, { inSet: false }).map((entry) => entry.id)).toEqual(["b"]);
    expect(filterCards(cards, { type: 2 }).map((entry) => entry.id)).toEqual(["b"]);
    expect(filterCards(cards, { grade: 6 }).map((entry) => entry.id)).toEqual(["c"]);
    expect(filterCards(cards, { search: "luce" }).map((entry) => entry.id)).toEqual(["c"]);
  });
});

describe("i dati di Grand Cross", () => {
  const cards = new Map(data.cards.map((entry) => [entry.id, entry]));

  it("le due voci stanno nella barra laterale", () => {
    const paths = gameGroups("grand-cross").flatMap((group) => group.items.map((item) => item.path));
    expect(paths).toContain("/set-artefatto");
    expect(paths).toContain("/carte-artefatto");
  });

  it("ogni carta del set esiste e dice di stare in quel set", () => {
    for (const set of data.sets) {
      expect([3, 5]).toContain(set.cards.length);
      for (const id of set.cards) expect(cards.get(id)?.set).toBe(set.id);
    }
    const inSets = new Set(data.sets.flatMap((set) => set.cards));
    for (const entry of data.cards) if (entry.set) expect(inSets.has(entry.id)).toBe(true);
  });

  it("le carte sono verticali, come nel gioco, non quadrate", () => {
    for (const frame of [data.images.small, data.images.large]) {
      expect(frame.height).toBeGreaterThan(frame.width * 1.1);
      expect(frame.height).toBeLessThan(frame.width * 1.5);
    }
  });

  it("i numeri dei set sono unici e fanno l'indirizzo della pagina", () => {
    const numbers = data.sets.map((set) => set.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
  });

  it("ogni livello ha il testo nelle due lingue, e i punti per arrivarci", () => {
    for (const set of data.sets) {
      expect([1, 3, 5]).toContain(set.levels.length);
      for (const level of set.levels) {
        expect(level.it).toBeTruthy();
        expect(level.en).toBeTruthy();
      }
      expect(enhancementSteps(data, set)).toHaveLength(set.levels.length - 1);
    }
  });

  it("i punti di ogni classe crescono, e le Carte placcate valgono di piu' a ogni grado", () => {
    for (const totals of Object.values(data.enhancement.classes)) {
      for (let level = 1; level < totals.length; level++) expect(totals[level]!).toBeGreaterThan(totals[level - 1]!);
    }
    const points = Object.keys(data.grades)
      .sort((a, b) => Number(a) - Number(b))
      .map((code) => data.grades[code]!.plate.points);
    for (let grade = 1; grade < points.length; grade++) expect(points[grade]!).toBeGreaterThan(points[grade - 1]!);
  });

  it("i filtri dei set hanno un nome", () => {
    const factions = grandCrossModule.heroContext?.codes.faction ?? {};
    const races = grandCrossModule.heroContext?.codes.race ?? {};
    for (const set of data.sets) {
      for (const code of set.filters.contents) expect(data.filters.contents[String(code)]).toBeDefined();
      for (const code of set.filters.misc) expect(data.filters.misc[String(code)]).toBeDefined();
      for (const code of set.filters.races) expect(races[String(code)]).toBeDefined();
      for (const code of set.filters.factions) expect(factions[String(code)]).toBeDefined();
    }
  });

  it("ogni pacchetto di una carta porta a carte che esistono, e la carta lo cita", () => {
    for (const [id, pack] of Object.entries(data.packs)) {
      for (const entry of pack.cards) {
        expect(cards.get(entry.card)?.packs).toContain(id);
      }
    }
  });

  it("ogni carta ha nome, tipo e grado noti, e la sigla del tipo nelle due lingue", () => {
    for (const entry of data.cards) {
      expect(entry.name.it ?? entry.name.en).toBeTruthy();
      expect(data.types[String(entry.type)]).toBeDefined();
      expect(data.grades[String(entry.grade)]).toBeDefined();
    }
    expect(data.types["1"]!.prefix).toEqual({ it: "PG", en: "CH" });
  });

  it("ogni boss degli Scontri finali trova il suo set per nome, per il collegamento", () => {
    for (const boss of grandCrossModule.deathMatch?.bosses ?? []) {
      if (!boss.artifactSet) continue;
      const found = data.sets.filter((set) => set.name.en === boss.artifactSet!.name.en);
      expect(found).toHaveLength(1);
    }
  });

  it("le fonti dell'Endgame puntano a pagine e difficolta' che esistono", () => {
    // Il Demone rosso cade dal suo Scontro finale: la pagina del boss deve dirlo
    const sources = cardSources(grandCrossModule, "grand-cross", "6020001");
    expect(sources.some((source) => source.mode === "death-match" && source.how === "drop")).toBe(true);
    for (const entry of data.cards) {
      for (const source of cardSources(grandCrossModule, "grand-cross", entry.id)) {
        expect(source.href).toMatch(/^\/grand-cross\/(scontri-finali|bestie-demoniache|re-demone|divinita-suprema)/);
        if (source.chance !== null) {
          expect(source.chance).toBeGreaterThan(0);
          expect(source.chance).toBeLessThanOrEqual(100);
        }
      }
    }
  });
});
