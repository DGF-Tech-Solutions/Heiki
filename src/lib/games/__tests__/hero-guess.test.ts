/**
 * «Indovina l'eroe»: le caselle dicono il vero (uguale, in parte, freccia dalla
 * parte giusta), l'eroe del giorno e' lo stesso per lo stesso giorno, e ogni
 * eroe del roster ha tutti gli indizi.
 */

import { describe, expect, it } from "vitest";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HERO_SPECIALS } from "../grand-cross/hero-specials.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { RELEASES } from "../grand-cross/releases.generated";
import {
  cardFocus,
  cardZoom,
  CLUES,
  compareHeroes,
  dailyAnswer,
  dayKey,
  GRADES,
  GUESS_VARIANTS,
  guessHeroes,
  maskWords,
  mosaicBlocks,
  previousDay,
  seedOf,
  shareGrid,
  shareLine,
  STABLE_DAILY_FROM,
  VARIANT_HINTS,
  zoomCrop,
  type GuessHero,
} from "../hero-guess";

const heroes = guessHeroes(HEROES, HERO_CONTEXT, RELEASES, HERO_SPECIALS);
const byId = new Map(heroes.map((hero) => [hero.id, hero]));

const base: GuessHero = {
  id: "a",
  group: "Meliodas",
  attribute: 1,
  race: 1,
  factions: [6],
  obtainedAs: "SSR",
  max: "UR",
  special: null,
  date: "2021-05-04",
};

describe("le caselle", () => {
  it("lo stesso eroe e' tutto verde", () => {
    const clues = compareHeroes(base, base);
    for (const key of CLUES) expect(clues[key].verdict).toBe("giusto");
  });

  it("caratteristiche: uguali, in parte, niente in comune; nessuna e nessuna sono uguali", () => {
    expect(compareHeroes({ ...base, factions: [6, 4] }, base).caratteristiche.verdict).toBe("vicino");
    expect(compareHeroes({ ...base, factions: [2] }, base).caratteristiche.verdict).toBe("sbagliato");
    expect(compareHeroes({ ...base, factions: [] }, { ...base, factions: [] }).caratteristiche.verdict).toBe("giusto");
    expect(compareHeroes({ ...base, factions: [] }, base).caratteristiche.verdict).toBe("sbagliato");
  });

  it("l'attributo doppio di Tristan e' in parte Luce e in parte Oscurita'", () => {
    expect(compareHeroes({ ...base, attribute: 4 }, { ...base, attribute: 6 }).attributo.verdict).toBe("vicino");
    expect(compareHeroes({ ...base, attribute: 6 }, { ...base, attribute: 5 }).attributo.verdict).toBe("vicino");
    expect(compareHeroes({ ...base, attribute: 1 }, { ...base, attribute: 6 }).attributo.verdict).toBe("sbagliato");
  });

  it("il grado d'uscita ha la freccia verso quello da indovinare", () => {
    expect(compareHeroes({ ...base, obtainedAs: "SR" }, base).uscita).toEqual({ verdict: "sbagliato", direction: "su" });
    expect(compareHeroes({ ...base, obtainedAs: "UR" }, base).uscita).toEqual({ verdict: "sbagliato", direction: "giu" });
  });

  it("la data: stessa uscita verde, stesso anno giallo, e la freccia dice prima o dopo", () => {
    expect(compareHeroes({ ...base, date: "2021-01-10" }, base).data).toEqual({ verdict: "vicino", direction: "su" });
    expect(compareHeroes({ ...base, date: "2023-01-10" }, base).data).toEqual({ verdict: "sbagliato", direction: "giu" });
    expect(compareHeroes({ ...base, date: null }, base).data.verdict).toBe("sbagliato");
  });
});

describe("gli eroi del gioco", () => {
  it("ogni eroe del roster ha tutti gli indizi", () => {
    expect(heroes).toHaveLength(HEROES.length);
    for (const hero of heroes) {
      expect(hero.attribute).not.toBeNull();
      expect(hero.race).not.toBeNull();
      expect(GRADES).toContain(hero.obtainedAs);
      expect(["UR", "LR"]).toContain(hero.max);
      expect(hero.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (hero.special) expect(HERO_SPECIALS.kinds[hero.special]).toBeDefined();
    }
  });

  it("ci sono tutti i tipi di abilita' speciale, e la maggior parte degli eroi non ne ha", () => {
    const kinds = new Set(heroes.map((hero) => hero.special));
    for (const kind of Object.keys(HERO_SPECIALS.kinds)) expect(kinds.has(kind)).toBe(true);
    expect(heroes.filter((hero) => hero.special === null).length).toBeGreaterThan(heroes.length / 2);
  });

  it("Another Ban e Ban sono personaggi diversi", () => {
    const another = byId.get("2010501")!;
    const ban = heroes.find((hero) => hero.group === "Ban")!;
    expect(compareHeroes(another, ban).personaggio.verdict).toBe("sbagliato");
  });
});

describe("l'eroe del giorno", () => {
  it("lo stesso giorno, lo stesso eroe, anche col roster in un altro ordine", () => {
    const one = dailyAnswer(heroes, "2026-09-27");
    expect(dailyAnswer([...heroes].reverse(), "2026-09-27")).toBe(one);
  });

  it("in un anno cambia spesso ed esce buona parte del roster", () => {
    const seen = new Set<string>();
    let repeats = 0;
    let before = "";
    for (let i = 0; i < 365; i++) {
      const id = dailyAnswer(heroes, dayKey(new Date(2026, 0, 1 + i))).id;
      if (id === before) repeats++;
      before = id;
      seen.add(id);
    }
    expect(seen.size).toBeGreaterThan(200);
    expect(repeats).toBeLessThan(5);
  });

  it("dayKey e previousDay contano i giorni del calendario, anche a cavallo del mese", () => {
    expect(dayKey(new Date(2026, 8, 7))).toBe("2026-09-07");
    expect(previousDay("2026-03-01")).toBe("2026-02-28");
    expect(previousDay("2026-01-01")).toBe("2025-12-31");
  });
});

describe("l'eroe del giorno stabile (dal 12/10/2026)", () => {
  const giorni = (da: Date, quanti: number) =>
    Array.from({ length: quanti }, (_, i) => dayKey(new Date(da.getFullYear(), da.getMonth(), da.getDate() + i)));
  const anno = giorni(new Date(2026, 9, 12), 365);
  const nuovo = (date: string | null): GuessHero => ({ ...heroes[0]!, id: "9999999", date });

  it("fino all'11/10 vale la regola di prima: i giorni gia' giocati non cambiano", () => {
    const sorted = [...heroes].sort((a, b) => a.id.localeCompare(b.id));
    for (const day of giorni(new Date(2026, 8, 1), 41)) {
      expect(day < STABLE_DAILY_FROM).toBe(true);
      for (const variant of GUESS_VARIANTS) {
        const salt = variant === "classico" ? `gachazone-indovina:${day}` : `gachazone-indovina-${variant}:${day}`;
        expect(dailyAnswer(heroes, day, variant).id, `${day} ${variant}`).toBe(sorted[seedOf(salt) % sorted.length]!.id);
      }
    }
  });

  it("un eroe nuovo non tocca i giorni prima della sua uscita, e dopo quasi nessuno", () => {
    const uscita = "2027-03-01";
    const con = [...heroes, nuovo(uscita)];
    let cambiati = 0;
    for (const day of anno) {
      for (const variant of GUESS_VARIANTS) {
        const prima = dailyAnswer(heroes, day, variant).id;
        const dopo = dailyAnswer(con, day, variant).id;
        if (day < uscita) expect(dopo, `${day} ${variant}`).toBe(prima);
        else if (dopo !== prima) {
          // se cambia, e' perche' ha vinto proprio l'eroe nuovo
          expect(dopo).toBe("9999999");
          cambiati++;
        }
      }
    }
    // su ~4 x 200 giorni dopo l'uscita, con 377 eroi: attesi un paio
    expect(cambiati).toBeLessThan(15);
  });

  it("un eroe in piu' senza data (o gia' uscito) cambia pochi giorni su un anno", () => {
    const con = [...heroes, nuovo(null)];
    const cambiati = anno.filter((day) => dailyAnswer(con, day).id !== dailyAnswer(heroes, day).id).length;
    expect(cambiati).toBeLessThan(10);
  });

  it("non sceglie mai un eroe non ancora uscito quel giorno", () => {
    for (const day of anno) {
      const scelto = dailyAnswer(heroes, day);
      expect(!scelto.date || scelto.date <= day, `${day} ${scelto.id} ${scelto.date}`).toBe(true);
    }
    // Heimdallr esce l'08/10: non puo' essere l'eroe di un giorno prima, con la regola nuova
    const finto = heroes.map((hero) => (hero.id === "2017501" ? { ...hero, date: "2030-01-01" } : hero));
    for (const day of anno) expect(dailyAnswer(finto, day).id).not.toBe("2017501");
  });

  it("in un anno esce buona parte del roster, quasi mai lo stesso due giorni di fila, e l'ordine non conta", () => {
    const seen = new Set<string>();
    let repeats = 0;
    let before = "";
    for (const day of anno) {
      const id = dailyAnswer(heroes, day).id;
      expect(dailyAnswer([...heroes].reverse(), day).id).toBe(id);
      if (id === before) repeats++;
      before = id;
      seen.add(id);
    }
    expect(seen.size).toBeGreaterThan(200);
    expect(repeats).toBeLessThan(5);
  });
});

describe("le altre modalita'", () => {
  it("la classica tiene l'eroe del giorno di prima delle altre modalita' (27/09: Gowther giovane paesano)", () => {
    // L'eroe del giorno dipende da quanti eroi ci sono (senza server, vedi
    // dailyAnswer): il 27/09 erano gli usciti fino a quel giorno. Con Heimdallr
    // (08/10) quel giorno darebbe un altro eroe; il seme, che e' quello che si
    // controlla qui, no.
    const allora = heroes.filter((h) => !h.date || h.date <= "2026-09-27");
    expect(dailyAnswer(allora, "2026-09-27").id).toBe("1114001");
    expect(dailyAnswer(allora, "2026-09-27", "classico").id).toBe("1114001");
  });

  it("ogni modalita' ha il suo eroe del giorno", () => {
    let different = 0;
    for (let i = 0; i < 30; i++) {
      const day = dayKey(new Date(2026, 9, 1 + i));
      const ids = GUESS_VARIANTS.map((variant) => dailyAnswer(heroes, day, variant).id);
      if (new Set(ids).size > 1) different++;
    }
    expect(different).toBe(30);
  });

  it("la carta si allarga a ogni errore, e alla fine e' intera", () => {
    expect(cardZoom(0, false)).toBeCloseTo(3.2);
    expect(cardZoom(3, false)).toBeLessThan(cardZoom(2, false));
    expect(cardZoom(20, false)).toBe(1);
    expect(cardZoom(0, true)).toBe(1);
    for (let seed = 0; seed < 5000; seed += 37) {
      const { x, y } = cardFocus(seed);
      expect(x).toBeGreaterThanOrEqual(25);
      expect(x).toBeLessThanOrEqual(75);
      expect(y).toBeGreaterThanOrEqual(20);
      expect(y).toBeLessThanOrEqual(80);
    }
  });

  it("il mosaico si fa piu' fitto a ogni errore, e alla fine sparisce", () => {
    for (const kind of ["carta", "unica"] as const) {
      const steps: number[] = [];
      for (let wrong = 0; mosaicBlocks(kind, wrong, false) !== null; wrong++) steps.push(mosaicBlocks(kind, wrong, false)!);
      expect(steps.length).toBeGreaterThan(4);
      expect([...steps].sort((a, b) => a - b)).toEqual(steps);
      expect(mosaicBlocks(kind, 0, true)).toBeNull();
      expect(mosaicBlocks(kind, 50, false)).toBeNull();
    }
  });

  it("zoomCrop e' la parte che scale() mostra: intera a zoom 1, sempre dentro l'immagine", () => {
    expect(zoomCrop(128, 256, 1, { x: 40, y: 60 })).toEqual({ sx: 0, sy: 0, sw: 128, sh: 256 });
    for (let seed = 0; seed < 3000; seed += 53) {
      const focus = cardFocus(seed);
      for (const zoom of [1.2, 2, 3.2]) {
        const { sx, sy, sw, sh } = zoomCrop(128, 256, zoom, focus);
        expect(sx).toBeGreaterThanOrEqual(0);
        expect(sy).toBeGreaterThanOrEqual(0);
        expect(sx + sw).toBeLessThanOrEqual(128 + 1e-9);
        expect(sy + sh).toBeLessThanOrEqual(256 + 1e-9);
        // il punto di fuoco resta dov'era: e' l'origine della trasformazione
        expect(sx + (focus.x / 100) * sw).toBeCloseTo((focus.x / 100) * 128, 9);
      }
    }
  });

  it("maskWords nasconde il nome e non tocca il resto, markup compreso", () => {
    const text = "Increases [FFAE00]Odin[-]'s Attack. Odinson and odin stay. Deals damage to Odin.";
    expect(maskWords(text, ["Supreme", "God", "Odin"])).toBe(
      "Increases [FFAE00]???[-]'s Attack. Odinson and odin stay. Deals damage to ???.",
    );
    expect(maskWords("Aumenta l'Attacco di Freyja", ["Dea", "della", "bellezza", "Freyja"])).toBe(
      "Aumenta l'Attacco di ???",
    );
    expect(maskWords("Nothing to hide", [])).toBe("Nothing to hide");
  });

  it("gli aiuti di ogni modalita' si sbloccano in ordine", () => {
    for (const variant of GUESS_VARIANTS) {
      const afters = VARIANT_HINTS[variant].map((hint) => hint.after);
      expect([...afters].sort((a, b) => a - b)).toEqual(afters);
    }
  });

  it("shareLine: rosso gli errori, verde la risposta", () => {
    expect(shareLine(3, true)).toBe("🟥🟥🟩");
    expect(shareLine(2, false)).toBe("🟥🟥");
  });
});

describe("il risultato da condividere", () => {
  it("una riga di quadratini per tentativo, una colonna per indizio", () => {
    const rows = [compareHeroes({ ...base, factions: [6, 4], date: "2021-01-01" }, base), compareHeroes(base, base)];
    const lines = shareGrid(rows).split("\n");
    expect(lines).toHaveLength(2);
    expect([...lines[0]!]).toHaveLength(CLUES.length);
    expect(lines[1]).toBe("🟩".repeat(CLUES.length));
    expect(lines[0]).toContain("🟨");
  });
});
