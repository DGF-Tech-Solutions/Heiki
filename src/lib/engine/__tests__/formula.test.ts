import { describe, expect, it } from "vitest";
import {
  damageBonus,
  defenseMultiplier,
  expectedCritMultiplier,
  resistanceMultiplier,
  rollCritMultiplier,
  standardDamage,
} from "../formula";
import { createRng } from "../rng";
import type { DamageContext, HitDefinition, ResolvedActor, Target } from "../types";

describe("defenseMultiplier", () => {
  it("vale 0.5 tra attaccante e bersaglio di pari livello", () => {
    expect(defenseMultiplier(90, 90)).toBeCloseTo(0.5, 10);
  });

  it("aumenta se il bersaglio e' di livello inferiore", () => {
    expect(defenseMultiplier(90, 50)).toBeGreaterThan(defenseMultiplier(90, 90));
  });

  it("la riduzione difesa alza il moltiplicatore", () => {
    expect(defenseMultiplier(90, 90, 0.5)).toBeGreaterThan(defenseMultiplier(90, 90));
  });

  it("riduzione e ignore si compongono moltiplicativamente", () => {
    // (190) / (190 + 190 * 0.5 * 0.5) = 190 / 237.5
    expect(defenseMultiplier(90, 90, 0.5, 0.5)).toBeCloseTo(190 / 237.5, 10);
  });

  it("tratta valori fuori scala senza produrre NaN o divisioni per zero", () => {
    expect(defenseMultiplier(90, 90, 2)).toBe(1);
    expect(Number.isFinite(defenseMultiplier(90, 90, -5))).toBe(true);
  });
});

describe("resistanceMultiplier", () => {
  it("resistenza nulla non cambia il danno", () => {
    expect(resistanceMultiplier(0)).toBe(1);
  });

  it("resistenza positiva sotto il 75% si sottrae linearmente", () => {
    expect(resistanceMultiplier(0.5)).toBeCloseTo(0.5, 10);
  });

  it("resistenza negativa vale meta'", () => {
    expect(resistanceMultiplier(-0.2)).toBeCloseTo(1.1, 10);
  });

  it("oltre il 75% ha rendimenti decrescenti invece di azzerare il danno", () => {
    expect(resistanceMultiplier(0.9)).toBeCloseTo(1 / 4.6, 10);
    expect(resistanceMultiplier(0.9)).toBeGreaterThan(0);
  });
});

describe("critico", () => {
  it("il valore atteso interpola tra nessun critico e critico pieno", () => {
    expect(expectedCritMultiplier(0, 1)).toBe(1);
    expect(expectedCritMultiplier(1, 1)).toBe(2);
    expect(expectedCritMultiplier(0.5, 1)).toBeCloseTo(1.5, 10);
  });

  it("una probabilita' oltre il 100% non produce piu' del critico pieno", () => {
    expect(expectedCritMultiplier(1.4, 1)).toBe(2);
  });

  it("il tiro effettivo dipende dal valore estratto", () => {
    expect(rollCritMultiplier(0.5, 1, 0.2)).toBe(2);
    expect(rollCritMultiplier(0.5, 1, 0.8)).toBe(1);
  });
});

describe("damageBonus", () => {
  it("somma bonus globale, per elemento e per categoria", () => {
    const stats = {
      dmg_bonus_all: 0.1,
      dmg_bonus_hydro: 0.2,
      dmg_bonus_ultimate: 0.3,
      dmg_bonus_pyro: 5,
    };
    expect(damageBonus(stats, "hydro", "ultimate")).toBeCloseTo(0.6, 10);
  });

  it("ignora le chiavi assenti", () => {
    expect(damageBonus({}, "hydro", "skill")).toBe(0);
  });
});

const TARGET: Target = {
  id: "t",
  name: "t",
  level: 90,
  maxHp: 1000,
  defense: 0,
  resistances: { physical: 0 },
  tags: [],
};

function context(
  stats: Record<string, number>,
  hitOverrides: Partial<HitDefinition> = {},
  targetOverrides: Partial<Target> = {},
): DamageContext {
  const actor: ResolvedActor = {
    id: "a",
    characterId: "a",
    name: "a",
    level: 90,
    stats,
    actions: {},
    buffs: {},
  };

  return {
    hit: {
      id: "h",
      offset: 0,
      motionValue: 100,
      scalingStat: "attack",
      damageTag: "physical",
      category: "skill",
      canCrit: false,
      ...hitOverrides,
    },
    actor,
    stats,
    target: { ...TARGET, ...targetOverrides },
    time: 0,
    rng: createRng(1),
  };
}

describe("standardDamage", () => {
  it("compone scaling, difesa e resistenza", () => {
    // 100% di 1000 attacco * 0.5 difesa = 500
    expect(standardDamage(context({ attack: 1000 }))).toBeCloseTo(500, 6);
  });

  it("applica il bonus danno", () => {
    expect(standardDamage(context({ attack: 1000, dmg_bonus_all: 0.5 }))).toBeCloseTo(750, 6);
  });

  it("applica il critico atteso solo se il colpo puo' critare", () => {
    const stats = { attack: 1000, crit_rate: 0.5, crit_damage: 1 };
    expect(standardDamage(context(stats, { canCrit: false }))).toBeCloseTo(500, 6);
    expect(standardDamage(context(stats, { canCrit: true }))).toBeCloseTo(750, 6);
  });

  it("la riduzione di resistenza aumenta il danno", () => {
    const base = standardDamage(context({ attack: 1000 }, {}, { resistances: { physical: 0.4 } }));
    const shredded = standardDamage(
      context({ attack: 1000, res_reduction_physical: 0.4 }, {}, { resistances: { physical: 0.4 } }),
    );
    expect(shredded).toBeGreaterThan(base);
    expect(shredded).toBeCloseTo(500, 6);
  });

  it("somma il bonus flat al moltiplicatore", () => {
    expect(standardDamage(context({ attack: 1000 }, { flatBonus: 200 }))).toBeCloseTo(600, 6);
  });

  it("restituisce zero se non c'e' nulla da scalare", () => {
    expect(standardDamage(context({ attack: 0 }))).toBe(0);
  });

  it("il moltiplicatore extra si applica in coda", () => {
    expect(standardDamage(context({ attack: 1000 }), { extraMultiplier: 1.25 })).toBeCloseTo(
      625,
      6,
    );
  });
});
