import { describe, expect, it } from "vitest";
import { GEAR_PRESETS, gearTotals, presetBuild } from "../gear";
import { GEAR } from "../grand-cross/gear.generated";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HERO_SPECIALS } from "../grand-cross/hero-specials.generated";
import { HERO_STATS } from "../grand-cross/hero-stats.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { SIMULATION_DATA } from "../grand-cross/simulation.generated";
import { TEAM } from "../grand-cross/team.generated";
import { EMPTY_BOX } from "../hero-box";
import { analyzeTeam, emptySetup, suggest, teamHeroesOf, totalValue, type TeamData, type TeamSetup } from "../team";
import { simTotals, simTotalsBoth, type SimContext } from "../team-sim";

/**
 * Il simulatore nella pagina Squadra: la squadra della battaglia dell'utente
 * dell'11/11 deve dare le percentuali che il gioco ha mostrato, e dire da dove
 * vengono. Le percentuali non dipendono dai numeri d'inizio, salvo le somme
 * (la Reliquia di Escanor): qui si parte dal massimo del calcolatore, e si
 * controllano Yeon e Priscilla, e Difesa e PS di Escanor.
 */

const heroes = teamHeroesOf(HEROES, HERO_CONTEXT, HERO_SPECIALS);
const data: TeamData = { team: TEAM, heroes };
const YEON = "1970501";
const ESCANOR = "1475002";
const PRISCILLA = "1999501";
const SIGURD = "1895502";

const ctx: SimContext = {
  sim: SIMULATION_DATA,
  start: {
    steps: Object.fromEntries(Object.entries(HERO_STATS).flatMap(([id, e]) => (e.steps ? [[id, e.steps]] : []))),
    gear: gearTotals(GEAR, presetBuild(GEAR, GEAR_PRESETS[0]!)),
  },
  box: EMPTY_BOX,
  account: null,
};

// i ranghi della battaglia, come se venissero dal box
const battle: TeamSetup = {
  ...emptySetup(),
  mains: [YEON, ESCANOR, PRISCILLA, SIGURD],
  byHero: {
    [YEON]: { ultimate: 1, relic: true },
    [ESCANOR]: { ultimate: 6, relic: true },
    [PRISCILLA]: { ultimate: 1, relic: true },
    [SIGURD]: { ultimate: 5, relic: true },
  },
};

describe("i numeri della squadra dal simulatore", () => {
  const totals = simTotals(battle, data, analyzeTeam(battle, data), ctx);
  const row = (id: string) => totals.heroes.find((h) => h.hero === id)!;

  it("ha le percentuali della battaglia dell'utente", () => {
    expect(totals.heroes.map((h) => h.hero)).toEqual([YEON, ESCANOR, PRISCILLA]);
    // Yeon x1,7033 (18.324 / 10.758), Priscilla x1,4812 (22.840 / 15.420), Escanor x1,6145 su Difesa e PS
    for (const stat of ["atk", "def", "hp"] as const) {
      expect(totalValue(row(YEON), stat)).toBeCloseTo((1.15 * 1.12 * 1.15 * 1.15 - 1) * 100, 1);
      expect(totalValue(row(PRISCILLA), stat)).toBeCloseTo((1.12 * 1.15 * 1.15 - 1) * 100, 1);
    }
    expect(totalValue(row(ESCANOR), "def")).toBeCloseTo((1.12 * 1.15 * 1.09 * 1.15 - 1) * 100, 1);
    expect(totalValue(row(ESCANOR), "hp")).toBeCloseTo((1.12 * 1.15 * 1.09 * 1.15 - 1) * 100, 1);
    // l'Attacco di Escanor sale di piu': la Reliquia (meta' della Difesa) e la Fiamma eterna x1,45
    expect(totalValue(row(ESCANOR), "atk")).toBeGreaterThan(totalValue(row(ESCANOR), "def") + 60);
  });

  it("dice da quale passiva viene ogni cambiamento, panchina compresa", () => {
    const parts = row(ESCANOR).battle!.parts;
    const from = (hero: string, kind: string) => parts.filter((p) => p.from === hero && p.source?.kind === kind);
    // Sigurd e' in panchina: la sua Unica vale lo stesso (codice 2, «anche nello slot secondario»)
    expect(from(SIGURD, "unique").length).toBeGreaterThan(0);
    const relic = from(ESCANOR, "relic").flatMap((p) => p.changes);
    expect(relic.some((c) => c.stat === "atk" && c.mode === "piu")).toBe(true);
    expect(row(ESCANOR).battle!.from).toBe("max");
    // i numeri in battaglia sono quelli d'inizio per le percentuali
    const b = row(YEON).battle!;
    expect(b.firstTurn.atk / b.start.atk).toBeCloseTo(1.15 * 1.12 * 1.15 * 1.15, 3);
  });

  it("i consigli usano gli stessi numeri", () => {
    const three: TeamSetup = { ...battle, mains: [YEON, ESCANOR, null, SIGURD] };
    const pool = [...heroes.values()].filter((h) => h.id === PRISCILLA);
    const [first] = suggest(three, 2, pool, data, 12, (s, a) => simTotals(s, data, a, ctx));
    expect(first?.hero).toBe(PRISCILLA);
    const yeon = first!.numbers.find((n) => n.hero === YEON && n.key === "atk");
    // Le Uniche di Yeon, Escanor e Sigurd crescono con gli alleati applicabili in
    // campo (5, 4 e 5 punti ciascuno): con due in campo valgono x1,10, x1,08 e
    // x1,10; con Priscilla, tre, valgono x1,15, x1,12 e x1,15, e c'e' la sua x1,15
    const without = 1.1 * 1.08 * 1.1;
    const withHer = 1.15 * 1.12 * 1.15 * 1.15;
    expect(yeon?.delta).toBeCloseTo((withHer - without) * 100, 0);
  });
});

describe("il secondo numero, senza effetti a tempo (14/11)", () => {
  const TAIZOO = "1373001";
  const setup: TeamSetup = { ...emptySetup(), mains: [YEON, ESCANOR, TAIZOO, SIGURD] };
  const totals = simTotalsBoth(setup, data, analyzeTeam(setup, data), ctx);
  const row = (id: string) => totals.heroes.find((h) => h.hero === id)!;

  it("toglie i +150% di Difesa che Campione Taizoo si da' per un turno", () => {
    const b = row(TAIZOO).battle!;
    // al primo turno la Difesa passa per x2,5 (701761 da' il buff 40013, buff_turn 1)
    expect(b.firstTurn.def / b.lasting!.def).toBeCloseTo(2.5, 6);
    const taunt = b.parts.find((p) => p.buff === 40013);
    expect(taunt?.turns).toBe(1);
    expect(taunt?.source?.kind).toBe("unique");
  });

  it("toglie la Fiamma eterna di Escanor, e lascia chi non ha effetti a tempo", () => {
    const escanor = row(ESCANOR).battle!;
    // la Fiamma (80214) dura 3 turni nella tabella: senza, la riga 700382 non conta niente
    expect(escanor.lasting!.atk).toBeLessThan(escanor.firstTurn.atk);
    expect(escanor.lasting!.def).toBeCloseTo(escanor.firstTurn.def, 6);
    const yeon = row(YEON).battle!;
    expect(yeon.lasting!.atk).toBeCloseTo(yeon.firstTurn.atk, 6);
  });

  it("i consigli mostrati hanno anche il secondo numero, e restano ordinati sul primo turno", () => {
    const three: TeamSetup = { ...setup, mains: [YEON, ESCANOR, null, SIGURD] };
    const pool = [...heroes.values()].filter((h) => h.id === TAIZOO || h.id === PRISCILLA);
    const first = (s: TeamSetup, a: ReturnType<typeof analyzeTeam>) => simTotals(s, data, a, ctx, true);
    const lasting = (s: TeamSetup, a: ReturnType<typeof analyzeTeam>) => simTotals(s, data, a, ctx, false);
    const list = suggest(three, 2, pool, data, 12, first, lasting);
    const taizoo = list.find((s) => s.hero === TAIZOO)!;
    const def = (n: readonly { hero: string; key: string; delta: number }[] | undefined) =>
      n?.find((x) => x.hero === TAIZOO && x.key === "def")?.delta ?? 0;
    expect(def(taizoo.numbers)).toBeGreaterThan(def(taizoo.numbersLasting) + 100);
  });
});
