import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { simulate } from "../grand-cross/simulation";
import { SIMULATION_DATA } from "../grand-cross/simulation.generated";
import type { SimInput, SimStat } from "../grand-cross/simulation-types";

/**
 * Il simulatore del primo turno nel sito fa gli stessi conti di simula.py, il
 * simulatore della pipeline provato su una battaglia vera dell'utente (11/11).
 *
 * Due prove. La battaglia: i numeri che il gioco ha mostrato, con la tolleranza
 * dell'arrotondamento del gioco (2 punti, come prova.py). La parita': i 136 casi
 * scritti da parita_sito.py (squadre a caso col seme fisso, ogni eroe del roster
 * almeno una volta in campo), dove ogni statistica e ogni passo della traccia
 * devono essere quelli di Python. Se qui qualcosa non torna, ha ragione Python:
 * e' lui che e' stato provato sul gioco.
 */

interface Fixture {
  readonly stats: readonly SimStat[];
  readonly keywords: readonly string[];
  readonly cases: readonly {
    readonly input: SimInput;
    readonly heroes: readonly {
      readonly id: string;
      readonly slot: number;
      readonly firstTurn: readonly number[];
      // [step, keyword (indice), passive, from, origin, stat (indice), before, after, mode, value, buff]
      readonly trace: readonly (readonly [number, number, number | null, string | null, string | null, number, number, number, string, number, number | null])[];
    }[];
  }[];
}

const fixture = JSON.parse(
  readFileSync(resolve(__dirname, "fixtures/simulation-cases.json"), "utf8"),
) as Fixture;

// i casi sono arrotondati a 4 decimali; i numeri arrivano alle centinaia di migliaia
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-3 + Math.abs(b) * 1e-9;

describe("il simulatore del primo turno", () => {
  it("rifa' la battaglia dell'utente dell'11/11 coi numeri del gioco", () => {
    const battle = fixture.cases[0]!.input;
    const result = simulate(battle, SIMULATION_DATA);
    // una lista e non un oggetto: le chiavi numeriche di un oggetto JS vanno in ordine di numero
    const game: readonly (readonly [string, number, number, number])[] = [
      ["1970501", 18324, 17132, 333902], // Yeon Yihwa
      ["1475002", 55850, 20917, 362621], // Escanor, con la Reliquia e 9 Fiamme eterne
      ["1999501", 22840, 20982, 366883], // Priscilla
    ];
    expect(result.heroes.map((hero) => hero.id)).toEqual(game.map(([id]) => id));
    for (const [i, hero] of result.heroes.entries()) {
      const [, atk, def, hp] = game[i]!;
      expect(Math.abs(hero.firstTurn.ATK - atk)).toBeLessThanOrEqual(2);
      expect(Math.abs(hero.firstTurn.DEF - def)).toBeLessThanOrEqual(2);
      expect(Math.abs(hero.firstTurn.MAX_HP - hp)).toBeLessThanOrEqual(2);
    }
  });

  it("fa gli stessi conti di simula.py su tutti i casi, traccia compresa", () => {
    expect(fixture.cases.length).toBeGreaterThan(100);
    const wrong: string[] = [];
    fixture.cases.forEach((expected, n) => {
      let result;
      try {
        result = simulate(expected.input, SIMULATION_DATA);
      } catch (error) {
        wrong.push(`caso ${n}: errore ${(error as Error).message}`);
        return;
      }
      const ids = result.heroes.map((hero) => `${hero.id}@${hero.slot}`).join(" ");
      const want = expected.heroes.map((hero) => `${hero.id}@${hero.slot}`).join(" ");
      if (ids !== want) {
        wrong.push(`caso ${n}: eroi ${ids} invece di ${want}`);
        return;
      }
      expected.heroes.forEach((hero, i) => {
        const got = result.heroes[i]!;
        fixture.stats.forEach((stat, s) => {
          if (!near(got.firstTurn[stat], hero.firstTurn[s]!)) {
            wrong.push(`caso ${n} ${hero.id} ${stat}: ${got.firstTurn[stat]} invece di ${hero.firstTurn[s]}`);
          }
        });
        if (got.trace.length !== hero.trace.length) {
          wrong.push(`caso ${n} ${hero.id}: traccia di ${got.trace.length} voci invece di ${hero.trace.length}`);
        }
        hero.trace.slice(0, got.trace.length).forEach((step, k) => {
          const [passo, keyword, passive, from, origin, stat, before, after, mode, value, buff] = step;
          const t = got.trace[k]!;
          const same =
            t.step === passo &&
            t.keyword === fixture.keywords[keyword] &&
            t.passive === passive &&
            t.from === from &&
            t.origin === origin &&
            t.stat === fixture.stats[stat] &&
            near(t.before, before) &&
            near(t.after, after) &&
            t.mode === mode &&
            near(t.value, value) &&
            t.buff === buff;
          if (!same) {
            wrong.push(
              `caso ${n} ${hero.id} voce ${k}: ${JSON.stringify([t.step, t.keyword, t.passive, t.from, t.origin, t.stat, t.before, t.after, t.mode, t.value, t.buff])} invece di ${JSON.stringify([passo, fixture.keywords[keyword], passive, from, origin, fixture.stats[stat], before, after, mode, value, buff])}`,
            );
          }
        });
      });
    });
    expect(wrong.slice(0, 25)).toEqual([]);
  });
});
