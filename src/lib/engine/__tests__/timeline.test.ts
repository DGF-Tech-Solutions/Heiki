/**
 * Test del risolutore di rotazioni.
 *
 * Usa un attore sintetico con numeri scelti perche' il risultato atteso sia
 * calcolabile a mano: attacco 1000, moltiplicatore 100%, attaccante e bersaglio
 * di pari livello (moltiplicatore difesa = 0.5), nessuna resistenza, nessun
 * critico. Un colpo "nudo" vale quindi esattamente 500.
 */

import { describe, expect, it } from "vitest";
import { createRng } from "../rng";
import { standardDamage } from "../formula";
import { resolveTimeline } from "../timeline";
import type {
  ActionDefinition,
  BuffDefinition,
  ResolvedActor,
  Rotation,
  SimulationInput,
  Target,
} from "../types";

const BARE_HIT_DAMAGE = 500;

const damageFn = (ctx: Parameters<typeof standardDamage>[0]) => standardDamage(ctx);

function hit(id: string, offset = 0, motionValue = 100) {
  return {
    id,
    offset,
    motionValue,
    scalingStat: "attack",
    damageTag: "physical",
    category: "skill",
    canCrit: false,
  };
}

function action(
  id: string,
  overrides: Partial<ActionDefinition> = {},
): ActionDefinition {
  return {
    id,
    name: id,
    duration: 1,
    cooldown: 0,
    hits: [hit(`${id}-h1`)],
    grantsBuffs: [],
    ...overrides,
  };
}

function actor(
  id: string,
  actions: readonly ActionDefinition[],
  buffs: readonly BuffDefinition[] = [],
): ResolvedActor {
  return {
    id,
    characterId: `char-${id}`,
    name: id,
    level: 90,
    stats: { attack: 1000, crit_rate: 0, crit_damage: 0 },
    actions: Object.fromEntries(actions.map((a) => [a.id, a])),
    buffs: Object.fromEntries(buffs.map((b) => [b.id, b])),
  };
}

const TARGET: Target = {
  id: "dummy",
  name: "Manichino",
  level: 90,
  maxHp: 10_000_000,
  defense: 0,
  resistances: { physical: 0 },
  tags: [],
};

function input(
  actors: readonly ResolvedActor[],
  steps: Rotation["steps"],
  overrides: Partial<SimulationInput> = {},
): SimulationInput {
  return {
    gameId: "test",
    datasetPatch: "test",
    actors,
    rotation: { id: "rot", name: "test", steps, repeat: 1 },
    target: TARGET,
    ...overrides,
  };
}

describe("resolveTimeline", () => {
  it("calcola un colpo nudo con la formula standard", () => {
    const a = actor("a1", [action("skill")]);
    const outcome = resolveTimeline(
      input([a], [{ actorId: "a1", actionId: "skill" }]),
      damageFn,
      createRng(1),
    );

    expect(outcome.hits).toHaveLength(1);
    expect(outcome.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE, 6);
    expect(outcome.duration).toBe(1);
    expect(outcome.dps).toBeCloseTo(BARE_HIT_DAMAGE, 6);
  });

  it("applica i buff attivi nell'istante del colpo", () => {
    const buff: BuffDefinition = {
      id: "atk_up",
      name: "Attacco su",
      duration: 5,
      maxStacks: 1,
      appliesTo: "self",
      modifiers: [{ stat: "attack", mode: "percent", value: 1 }],
    };
    const a = actor(
      "a1",
      [action("prep", { duration: 2, hits: [], grantsBuffs: ["atk_up"] }), action("skill")],
      [buff],
    );

    const outcome = resolveTimeline(
      input([a], [
        { actorId: "a1", actionId: "prep" },
        { actorId: "a1", actionId: "skill" },
      ]),
      damageFn,
      createRng(1),
    );

    // attacco raddoppiato -> danno raddoppiato
    expect(outcome.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE * 2, 6);
    expect(outcome.hits[0]?.activeBuffs).toContain("atk_up");
  });

  it("non applica un buff gia' scaduto", () => {
    const buff: BuffDefinition = {
      id: "atk_up",
      name: "Attacco su",
      duration: 1,
      maxStacks: 1,
      appliesTo: "self",
      modifiers: [{ stat: "attack", mode: "percent", value: 1 }],
    };
    const a = actor(
      "a1",
      [action("prep", { duration: 2, hits: [], grantsBuffs: ["atk_up"] }), action("skill")],
      [buff],
    );

    const outcome = resolveTimeline(
      input([a], [
        { actorId: "a1", actionId: "prep" },
        { actorId: "a1", actionId: "skill" },
      ]),
      damageFn,
      createRng(1),
    );

    // il colpo cade a t=2, il buff e' scaduto a t=1
    expect(outcome.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE, 6);
    expect(outcome.hits[0]?.activeBuffs).toHaveLength(0);
  });

  it("limita gli stack a maxStacks", () => {
    const buff: BuffDefinition = {
      id: "stack",
      name: "Stack",
      duration: 10,
      maxStacks: 2,
      appliesTo: "self",
      modifiers: [{ stat: "attack", mode: "percent", value: 0.5 }],
    };
    const a = actor(
      "a1",
      [action("gain", { hits: [], grantsBuffs: ["stack"] }), action("skill")],
      [buff],
    );

    const outcome = resolveTimeline(
      input([a], [
        { actorId: "a1", actionId: "gain" },
        { actorId: "a1", actionId: "gain" },
        { actorId: "a1", actionId: "gain" },
        { actorId: "a1", actionId: "skill" },
      ]),
      damageFn,
      createRng(1),
    );

    // 3 applicazioni ma cap a 2 -> +100% attacco, non +150%
    expect(outcome.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE * 2, 6);
    expect(outcome.hits[0]?.activeBuffs).toContain("stack x2");
  });

  it("un buff 'self' non raggiunge gli altri attori, uno 'party' si", () => {
    const selfBuff: BuffDefinition = {
      id: "solo",
      name: "Solo",
      duration: 10,
      maxStacks: 1,
      appliesTo: "self",
      modifiers: [{ stat: "attack", mode: "percent", value: 1 }],
    };
    const partyBuff: BuffDefinition = {
      id: "team",
      name: "Team",
      duration: 10,
      maxStacks: 1,
      appliesTo: "party",
      modifiers: [{ stat: "attack", mode: "percent", value: 1 }],
    };

    const support = actor(
      "sup",
      [action("giveSelf", { hits: [], grantsBuffs: ["solo"] }), action("giveParty", { hits: [], grantsBuffs: ["team"] })],
      [selfBuff, partyBuff],
    );
    const dps = actor("dps", [action("skill")]);

    const onlySelf = resolveTimeline(
      input([support, dps], [
        { actorId: "sup", actionId: "giveSelf" },
        { actorId: "dps", actionId: "skill" },
      ]),
      damageFn,
      createRng(1),
    );
    expect(onlySelf.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE, 6);

    const shared = resolveTimeline(
      input([support, dps], [
        { actorId: "sup", actionId: "giveParty" },
        { actorId: "dps", actionId: "skill" },
      ]),
      damageFn,
      createRng(1),
    );
    expect(shared.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE * 2, 6);
  });

  it("fa slittare un'azione ancora in cooldown invece di eseguirla subito", () => {
    const a = actor("a1", [action("burst", { cooldown: 10 })]);

    const outcome = resolveTimeline(
      input([a], [
        { actorId: "a1", actionId: "burst" },
        { actorId: "a1", actionId: "burst" },
      ]),
      damageFn,
      createRng(1),
    );

    expect(outcome.hits.map((h) => h.time)).toEqual([0, 10]);
    expect(outcome.duration).toBe(11);
  });

  it("rispetta il tempo assoluto dichiarato in uno step", () => {
    const a = actor("a1", [action("skill")]);

    const outcome = resolveTimeline(
      input([a], [
        { actorId: "a1", actionId: "skill" },
        { actorId: "a1", actionId: "skill", at: 7 },
      ]),
      damageFn,
      createRng(1),
    );

    expect(outcome.hits.map((h) => h.time)).toEqual([0, 7]);
  });

  it("registra il time to kill al colpo che supera gli HP del bersaglio", () => {
    const a = actor("a1", [action("skill")]);
    const outcome = resolveTimeline(
      input(
        [a],
        [
          { actorId: "a1", actionId: "skill" },
          { actorId: "a1", actionId: "skill" },
          { actorId: "a1", actionId: "skill" },
        ],
        { target: { ...TARGET, maxHp: 750 } },
      ),
      damageFn,
      createRng(1),
    );

    // 500 al primo colpo (t=0), 1000 al secondo (t=1): la soglia cade a t=1
    expect(outcome.timeToKill).toBe(1);
    expect(outcome.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE * 3, 6);
  });

  it("lascia timeToKill a null se il bersaglio sopravvive", () => {
    const a = actor("a1", [action("skill")]);
    const outcome = resolveTimeline(
      input([a], [{ actorId: "a1", actionId: "skill" }]),
      damageFn,
      createRng(1),
    );

    expect(outcome.timeToKill).toBeNull();
  });

  it("ripete la sequenza il numero di volte richiesto", () => {
    const a = actor("a1", [action("skill")]);
    const outcome = resolveTimeline(
      input([a], [{ actorId: "a1", actionId: "skill" }], {
        rotation: { id: "r", name: "r", steps: [{ actorId: "a1", actionId: "skill" }], repeat: 3 },
      }),
      damageFn,
      createRng(1),
    );

    expect(outcome.hits).toHaveLength(3);
    expect(outcome.totalDamage).toBeCloseTo(BARE_HIT_DAMAGE * 3, 6);
  });

  it("ordina i colpi per tempo assoluto anche con offset interni", () => {
    const a = actor("a1", [
      action("multi", { duration: 3, hits: [hit("late", 2), hit("early", 0)] }),
    ]);

    const outcome = resolveTimeline(
      input([a], [{ actorId: "a1", actionId: "multi" }]),
      damageFn,
      createRng(1),
    );

    expect(outcome.hits.map((h) => h.hitId)).toEqual(["early", "late"]);
  });

  it("segnala con un errore chiaro un attore o un'azione inesistenti", () => {
    const a = actor("a1", [action("skill")]);

    expect(() =>
      resolveTimeline(input([a], [{ actorId: "ghost", actionId: "skill" }]), damageFn, createRng(1)),
    ).toThrow(/nessun attore con id "ghost"/i);

    expect(() =>
      resolveTimeline(input([a], [{ actorId: "a1", actionId: "nope" }]), damageFn, createRng(1)),
    ).toThrow(/non ha l'azione "nope"/i);
  });
});
