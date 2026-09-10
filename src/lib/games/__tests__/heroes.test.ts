/**
 * Test di ricerca e filtri sul roster.
 *
 * Il roster vero ha centinaia di voci e cambia a ogni aggiornamento del gioco:
 * i test lavorano su un campione scritto a mano, cosi' verificano il
 * comportamento e non il contenuto del dataset del momento. L'unico controllo
 * sui dati veri sta in fondo, ed e' sul contratto, non sui numeri.
 */

import { describe, expect, it } from "vitest";
import { countHeroes, filterHeroes, heroCardSrc, sortHeroes } from "../heroes";
import { grandCrossModule } from "../grand-cross";
import type { HeroEntry } from "../types";

function hero(overrides: Partial<HeroEntry> & { id: string }): HeroEntry {
  return {
    group: "Meliodas",
    name: "The Dragon Sin of Wrath",
    epithet: "Assault Mode",
    rarity: "UR",
    obtainedAs: "SSR",
    affinity: "Forza",
    ...overrides,
  };
}

const SAMPLE: readonly HeroEntry[] = [
  hero({ id: "1", name: "Zeldris the Piety", epithet: "Ruler of Purgatory", affinity: "Oscurita" }),
  hero({ id: "2", name: "Escanor the One", epithet: "Sunshine", rarity: "LR", affinity: "Luce" }),
  hero({ id: "3", name: "Ban the Undead", epithet: "Fox Sin", group: "Ban", obtainedAs: "SR" }),
  hero({ id: "4", name: "Meliodas Assault", epithet: "Velocità Pura", affinity: "Velocita" }),
];

describe("filterHeroes", () => {
  it("senza criteri non toglie niente", () => {
    expect(filterHeroes(SAMPLE, {})).toHaveLength(4);
  });

  it("filtra per rarita'", () => {
    expect(filterHeroes(SAMPLE, { rarity: "LR" }).map((h) => h.id)).toEqual(["2"]);
  });

  it("filtra per attributo", () => {
    expect(filterHeroes(SAMPLE, { affinity: "Luce" }).map((h) => h.id)).toEqual(["2"]);
  });

  it("filtra per rarita' di uscita", () => {
    expect(filterHeroes(SAMPLE, { obtainable: "SR" }).map((h) => h.id)).toEqual(["3"]);
  });

  it("somma i criteri invece di alternarli", () => {
    expect(filterHeroes(SAMPLE, { rarity: "LR", affinity: "Oscurita" })).toEqual([]);
  });

  it("un criterio nullo non restringe", () => {
    expect(filterHeroes(SAMPLE, { rarity: null, affinity: null })).toHaveLength(4);
  });

  it("cerca nel nome senza badare alle maiuscole", () => {
    expect(filterHeroes(SAMPLE, { search: "ZELDRIS" }).map((h) => h.id)).toEqual(["1"]);
  });

  it("cerca anche nell'epiteto", () => {
    expect(filterHeroes(SAMPLE, { search: "purgatory" }).map((h) => h.id)).toEqual(["1"]);
  });

  it("cerca per identificativo", () => {
    expect(filterHeroes(SAMPLE, { search: "3" }).map((h) => h.id)).toEqual(["3"]);
  });

  it("richiede tutte le parole, in qualsiasi ordine", () => {
    expect(filterHeroes(SAMPLE, { search: "undead ban" }).map((h) => h.id)).toEqual(["3"]);
    expect(filterHeroes(SAMPLE, { search: "undead zeldris" })).toEqual([]);
  });

  it("ignora gli accenti, perche' chi cerca non li digita", () => {
    expect(filterHeroes(SAMPLE, { search: "velocita" }).map((h) => h.id)).toEqual(["4"]);
  });

  it("ignora le parentesi quadre dell'epiteto", () => {
    expect(filterHeroes(SAMPLE, { search: "[Sunshine]" }).map((h) => h.id)).toEqual(["2"]);
  });

  it("una ricerca di soli spazi non filtra", () => {
    expect(filterHeroes(SAMPLE, { search: "   " })).toHaveLength(4);
  });
});

describe("countHeroes", () => {
  it("conta le voci per valore", () => {
    const counts = countHeroes(SAMPLE, "rarity");
    expect(counts.get("UR")).toBe(3);
    expect(counts.get("LR")).toBe(1);
  });

  it("non inventa valori assenti", () => {
    expect(countHeroes(SAMPLE, "affinity").get("PS")).toBeUndefined();
  });

  it("conta sull'elenco che riceve, gia' filtrato", () => {
    const counts = countHeroes(filterHeroes(SAMPLE, { rarity: "UR" }), "affinity");
    expect(counts.get("Luce")).toBeUndefined();
    expect(counts.get("Oscurita")).toBe(1);
  });
});

describe("sortHeroes", () => {
  it("lascia l'ordine del roster", () => {
    expect(sortHeroes(SAMPLE, "roster").map((h) => h.id)).toEqual(["1", "2", "3", "4"]);
  });

  it("ordina per nome", () => {
    expect(sortHeroes(SAMPLE, "name").map((h) => h.name[0])).toEqual(["B", "E", "M", "Z"]);
  });

  it("ordina per personaggio, poi per nome", () => {
    const ordered = sortHeroes(SAMPLE, "group");
    expect(ordered[0]?.group).toBe("Ban");
    expect(ordered.slice(1).map((h) => h.name)).toEqual([
      "Escanor the One",
      "Meliodas Assault",
      "Zeldris the Piety",
    ]);
  });

  it("non tocca l'elenco ricevuto", () => {
    const before = SAMPLE.map((h) => h.id);
    sortHeroes(SAMPLE, "name");
    expect(SAMPLE.map((h) => h.id)).toEqual(before);
  });
});

describe("heroCardSrc", () => {
  it("indirizza alla card e alla sua variante densa", () => {
    expect(heroCardSrc("grand-cross", "1004001")).toBe("/eroi/grand-cross/1004001.png");
    expect(heroCardSrc("grand-cross", "1004001", 2)).toBe("/eroi/grand-cross/2x/1004001.png");
  });
});

describe("roster di Grand Cross", () => {
  const roster = grandCrossModule.roster;

  it("il modulo lo espone", () => {
    expect(roster).toBeDefined();
  });

  it("ogni eroe ha un attributo dichiarato fra quelli del gioco", () => {
    const known = new Set(roster?.affinities.map((a) => a.id));
    const orphans = roster?.heroes.filter((h) => !known.has(h.affinity)) ?? [];
    expect(orphans.map((h) => `${h.name} (${h.affinity})`)).toEqual([]);
  });

  it("ogni eroe ha una rarita' fra quelle dichiarate", () => {
    const known = new Set(roster?.rarities);
    expect(roster?.heroes.filter((h) => !known.has(h.rarity))).toEqual([]);
  });

  it("ogni eroe ha una rarita' di uscita fra quelle dichiarate", () => {
    const known = new Set(roster?.obtainable);
    expect(roster?.heroes.filter((h) => !known.has(h.obtainedAs))).toEqual([]);
  });

  it("gli identificativi sono unici: sono anche i nomi dei file immagine", () => {
    const ids = roster?.heroes.map((h) => h.id) ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * Gli epiteti arrivano decorati in tre modi diversi - quadre esterne,
   * virgolette, BBCode rimasto dentro - e a ripulirli e' lo script di
   * importazione. Questo controllo e' l'unico che se ne accorge: senza, una
   * fonte che cambia forma finirebbe in pagina come "b]Sunshine[/b".
   *
   * Le quadre non si possono vietare in blocco: "[Boar Hat] Tavern" e' un
   * epiteto vero, e le sue parentesi fanno parte del nome della taverna.
   */
  function decorated(epithet: string): boolean {
    if (/\[\/?[biu]\]/i.test(epithet)) return true;
    if (/^".*"$/.test(epithet)) return true;
    if (epithet.startsWith("[") && epithet.indexOf("]") === epithet.length - 1) return true;
    return epithet.split("[").length !== epithet.split("]").length;
  }

  it("nessun epiteto conserva la decorazione della fonte", () => {
    expect(roster?.heroes.filter((h) => decorated(h.epithet)).map((h) => h.epithet)).toEqual([]);
  });
});
