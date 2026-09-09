/**
 * Test del modulo stocastico.
 *
 * Verifica il punto architetturale che conta: un gioco con danno non
 * deterministico passa dallo stesso contratto e restituisce lo stesso tipo di
 * risultato di uno deterministico, senza che il Core debba distinguerli.
 */

import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/engine";
import type { SimulationInput, Target } from "@/lib/engine";
import { grandCrossModule, type GrandCrossBuild } from "../grand-cross";
import { UNITS } from "../grand-cross/data";
import { simulate } from "../registry";

function build(characterId: string): GrandCrossBuild {
  return { characterId, level: 80, rank: 0 };
}

function party() {
  return UNITS.map((unit, index) =>
    grandCrossModule.resolveActor(build(unit.id), `slot${index + 1}`),
  );
}

const TARGET: Target = {
  id: "test-boss",
  name: "Boss di prova",
  level: 80,
  maxHp: 200_000,
  defense: 2000,
  resistances: { strength: 0, dexterity: 0, hp: 0 },
  tags: ["boss", "attribute:dexterity"],
};

function input(overrides: Partial<SimulationInput> = {}): SimulationInput {
  const actors = party();
  return {
    gameId: grandCrossModule.id,
    datasetPatch: grandCrossModule.dataset.patch,
    actors,
    rotation: {
      id: "priorita-standard",
      name: "Priorita' standard",
      // Per un modulo stocastico gli step sono una LISTA DI PRIORITA', non una
      // sequenza temporale: quali carte preferire quando escono.
      steps: [
        { actorId: "slot1", actionId: "str-heavy" },
        { actorId: "slot1", actionId: "str-break" },
        { actorId: "slot2", actionId: "dex-rally" },
      ],
      repeat: 20,
    },
    target: TARGET,
    ...overrides,
  };
}

describe("resolveActor", () => {
  it("costruisce un attore con azioni, ultimate e buff", () => {
    const actor = grandCrossModule.resolveActor(build("placeholder-str-dps"), "slot1");

    expect(actor.id).toBe("slot1");
    expect(actor.characterId).toBe("placeholder-str-dps");
    expect(Object.keys(actor.actions)).toContain("str-heavy");
    expect(Object.keys(actor.actions)).toContain("str-ultimate");
    expect(actor.actions["str-ultimate"]?.meta?.["isUltimate"]).toBe(true);
    expect(actor.buffs["str-rage"]).toBeDefined();
    expect(actor.meta?.["attribute"]).toBe("strength");
  });

  it("riempie le stat mancanti con i default del modello", () => {
    const actor = grandCrossModule.resolveActor(build("placeholder-str-dps"), "slot1");
    expect(actor.stats["dmg_bonus_all"]).toBe(0);
    expect(actor.stats["attack"]).toBeGreaterThan(0);
  });

  it("somma le statistiche dell'equipaggiamento", () => {
    const bare = grandCrossModule.resolveActor(build("placeholder-str-dps"), "slot1");
    const geared = grandCrossModule.resolveActor(
      { ...build("placeholder-str-dps"), gear: { attack: 500, crit_rate: 0.1 } },
      "slot1",
    );

    expect(geared.stats["attack"]).toBe((bare.stats["attack"] ?? 0) + 500);
    expect(geared.stats["crit_rate"]).toBeCloseTo((bare.stats["crit_rate"] ?? 0) + 0.1, 10);
  });

  it("rifiuta un'unita' sconosciuta con un errore leggibile", () => {
    expect(() => grandCrossModule.resolveActor(build("non-esiste"), "slot1")).toThrow(
      /unita' sconosciuta/i,
    );
  });
});

describe("triangolo degli attributi", () => {
  function damageAgainst(targetAttribute: string): number {
    const actor = grandCrossModule.resolveActor(build("placeholder-str-dps"), "slot1");
    return grandCrossModule.computeDamage({
      hit: {
        id: "h",
        offset: 0,
        motionValue: 100,
        scalingStat: "attack",
        damageTag: "strength",
        category: "attack",
        canCrit: false,
      },
      actor,
      stats: { attack: 1000 },
      target: { ...TARGET, defense: 0, tags: [`attribute:${targetAttribute}`] },
      time: 0,
      rng: createRng(1),
    });
  }

  it("forza batte destrezza", () => {
    expect(damageAgainst("dexterity")).toBeCloseTo(625, 6);
  });

  it("forza soccombe a vita", () => {
    expect(damageAgainst("hp")).toBeCloseTo(400, 6);
  });

  it("stesso attributo e' neutro", () => {
    expect(damageAgainst("strength")).toBeCloseTo(500, 6);
  });
});

describe("simulazione Monte Carlo", () => {
  it("gira piu' iterazioni e si dichiara non deterministica", () => {
    const result = simulate(grandCrossModule, input(), { iterations: 300 });

    expect(result.paradigm).toBe("stochastic");
    expect(result.deterministic).toBe(false);
    expect(result.iterations).toBe(300);
  });

  it("produce una distribuzione con varianza reale", () => {
    const result = simulate(grandCrossModule, input(), { iterations: 500 });

    expect(result.damage.mean).toBeGreaterThan(0);
    expect(result.damage.stdDev).toBeGreaterThan(0);
    expect(result.damage.p10).toBeLessThan(result.damage.p90);
    expect(result.damage.min).toBeLessThanOrEqual(result.damage.median);
    expect(result.damage.median).toBeLessThanOrEqual(result.damage.max);
  });

  it("lo stesso seed produce lo stesso risultato", () => {
    const a = simulate(grandCrossModule, input(), { iterations: 200, seed: 12345 });
    const b = simulate(grandCrossModule, input(), { iterations: 200, seed: 12345 });

    expect(a.damage).toEqual(b.damage);
    expect(a.killRate).toBe(b.killRate);
    expect(a.representative.totalDamage).toBe(b.representative.totalDamage);
  });

  it("seed diversi producono risultati diversi", () => {
    const a = simulate(grandCrossModule, input(), { iterations: 200, seed: 1 });
    const b = simulate(grandCrossModule, input(), { iterations: 200, seed: 999 });

    expect(a.damage.mean).not.toBe(b.damage.mean);
  });

  it("misura il time to kill in turni e riporta il tasso di successo", () => {
    const result = simulate(grandCrossModule, input(), { iterations: 400, seed: 7 });

    expect(result.killRate).toBeGreaterThan(0);
    expect(result.killRate).toBeLessThanOrEqual(1);
    expect(result.timeToKill).not.toBeNull();
    expect(result.timeToKill?.median).toBeGreaterThan(0);
    expect(result.timeToKill?.median).toBeLessThanOrEqual(20);
  });

  it("un bersaglio inarrivabile lascia killRate a zero senza rompersi", () => {
    const result = simulate(
      grandCrossModule,
      input({ target: { ...TARGET, maxHp: 500_000_000 } }),
      { iterations: 100, seed: 3 },
    );

    expect(result.killRate).toBe(0);
    expect(result.timeToKill).toBeNull();
    expect(result.damage.mean).toBeGreaterThan(0);
  });

  it("non supera mai il tetto di turni dichiarato", () => {
    const result = simulate(
      grandCrossModule,
      input({
        rotation: { id: "corta", name: "corta", steps: [], repeat: 5 },
        target: { ...TARGET, maxHp: 500_000_000 },
      }),
      { iterations: 50, seed: 4 },
    );

    expect(result.representative.duration).toBeLessThanOrEqual(5);
  });

  it("la traccia rappresentativa contiene i colpi con i buff attivi", () => {
    const result = simulate(grandCrossModule, input(), { iterations: 100, seed: 21 });
    const trace = result.representative;

    expect(trace.hits.length).toBeGreaterThan(0);
    for (const hit of trace.hits) {
      expect(hit.damage).toBeGreaterThanOrEqual(0);
      expect(hit.time).toBeGreaterThan(0);
      expect(Array.isArray(hit.activeBuffs)).toBe(true);
    }
  });

  it("gioca al massimo il numero di carte consentito per turno", () => {
    const result = simulate(grandCrossModule, input(), { iterations: 50, seed: 8 });
    const perTurn = new Map<number, number>();

    for (const hit of result.representative.hits) {
      perTurn.set(hit.time, (perTurn.get(hit.time) ?? 0) + 1);
    }
    for (const count of perTurn.values()) {
      expect(count).toBeLessThanOrEqual(3);
    }
  });
});
