/**
 * Test dei buff dell'account: classe di combattimento dell'account, costellazioni,
 * classe di combattimento di un eroe.
 *
 * Le regole vengono dal codice del client (BUFF_ACCOUNT.md nella pipeline): qui si
 * controlla che le funzioni del sito le seguano, sui dati veri e su casi scritti
 * a mano, e che i dati rispettino il contratto (ogni pietra risale alla partenza,
 * ogni pietra del mana ha il suo gruppo).
 */

import { describe, expect, it } from "vitest";
import type { Constellation } from "../account-buff-types";
import {
  FLAT_STATS,
  activateStone,
  addBags,
  battleStats,
  customTotals,
  deactivateStone,
  heroCombatClass,
  isComplete,
  manaAverage,
  manaRange,
  manaValue,
  quickTotals,
  sliderData,
  tierFor,
} from "../account-buff";
import { EMPTY_SETUP, parseSetup, setupEffect, type AccountSetup } from "../account-setup";
import { gameGroups } from "../catalog";
import { grandCrossModule } from "../grand-cross";
import { maxSelection, statsAt } from "../hero-stats";

const data = grandCrossModule.accountBuff!;
const tiers = data.accountPower.tiers;

describe("classe di combattimento dell'account", () => {
  it("le soglie sono in ordine, da 500.000 a 25.000.000", () => {
    expect(tiers.length).toBe(53);
    expect(tiers[0]!.threshold).toBe(500_000);
    expect(tiers.at(-1)!.threshold).toBe(25_000_000);
    tiers.slice(1).forEach((tier, position) => expect(tier.threshold).toBeGreaterThan(tiers[position]!.threshold));
  });

  it("vale la soglia piu' alta raggiunta, e sotto la prima nessuna", () => {
    expect(tierFor(tiers, 0)).toBeNull();
    expect(tierFor(tiers, 499_999)).toBeNull();
    expect(tierFor(tiers, 500_000)).toMatchObject({ atk: 0, def: 0, hp: 1.5 });
    expect(tierFor(tiers, 24_999_999)!.threshold).toBe(24_500_000);
    expect(tierFor(tiers, 25_000_000)).toMatchObject({ atk: 7, def: 12, hp: 15 });
    expect(tierFor(tiers, 90_000_000)).toMatchObject({ atk: 7, def: 12, hp: 15 });
  });

  it("i titoli da 750.000 e 1.250.000 danno Difesa anche se il testo dice PS", () => {
    const wrong = tiers.filter((tier) => tier.textSays).map((tier) => tier.threshold);
    expect(wrong).toEqual([750_000, 1_250_000]);
    expect(tierFor(tiers, 750_000)).toMatchObject({ def: 2, hp: 0 });
    // un titolo solo: a 1.000.000 la Difesa del titolo di prima sparisce
    expect(tierFor(tiers, 1_000_000)).toMatchObject({ def: 0, hp: 3 });
  });
});

describe("costellazioni: i dati", () => {
  it("undici mappe, 1.463 pietre, una partenza ciascuna", () => {
    expect(data.constellations).toHaveLength(11);
    expect(data.constellations.reduce((sum, c) => sum + c.stones.length, 0)).toBe(1463);
    for (const c of data.constellations) expect(c.stones.filter((stone) => stone.kind === "start")).toHaveLength(1);
  });

  it("ogni pietra risale alla partenza della sua mappa", () => {
    for (const c of data.constellations) {
      const byId = new Map(c.stones.map((stone) => [stone.id, stone]));
      for (const stone of c.stones) {
        let current = stone;
        for (let steps = 0; current.kind !== "start"; steps++) {
          expect(steps).toBeLessThan(c.stones.length);
          const mother = byId.get(current.mother!);
          expect(mother, `${c.id}: la madre di ${current.id}`).toBeDefined();
          current = mother!;
        }
      }
    }
  });

  it("le pietre fisse sono percentuali, le pietre del mana Attacco, Difesa o PS del loro gruppo", () => {
    for (const c of data.constellations) {
      for (const stone of c.stones) {
        if (stone.kind === "stone") {
          expect(FLAT_STATS.has(stone.stat!)).toBe(false);
          expect(stone.value).toBeGreaterThan(0);
        }
        if (stone.kind === "mana") {
          expect(FLAT_STATS.has(stone.stat!)).toBe(true);
          expect(data.mana[stone.mana!]?.stat).toBe(stone.stat);
        }
      }
    }
  });

  it("i Sette Peccati vengono prima dei Quattro Cavalieri, ognuna dopo la precedente", () => {
    expect(data.constellations.map((c) => c.theme)).toEqual([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2]);
    data.constellations.forEach((c, position) => expect(c.after).toBe(position === 0 ? null : data.constellations[position - 1]!.id));
  });

  it("ogni fascia delle pietre del mana ha 20 livelli del Caos, che fanno 100", () => {
    for (const group of Object.values(data.mana)) {
      for (let level = 0; level < 20; level++) {
        expect(group.tiers.reduce((sum, tier) => sum + tier.rates[level]!, 0)).toBe(100);
      }
    }
  });
});

describe("costellazioni: i conti", () => {
  const slider = sliderData(data, "grand-cross", "it");
  const lust = data.constellations[0]!;

  it("tutte e undici complete: i numeri del client", () => {
    const min = quickTotals(slider.constellations, 11, "min");
    const max = quickTotals(slider.constellations, 11, "max");
    // completamento 8.400 + pietre del mana 1.155-3.445
    expect(min.atk).toBe(8400 + 1155);
    expect(max.atk).toBe(8400 + 3445);
    expect(min.hp).toBe(90000 + 28875);
    expect(min.critPer).toBe(18.5);
    expect(min.fixedAtkPer).toBe(31.2);
  });

  it("scelte pietra per pietra = scelta rapida, quando le pietre sono le stesse", () => {
    const active = new Set(data.constellations.slice(0, 7).flatMap((c) => c.stones.map((stone) => stone.id)));
    const mana: Record<string, number> = {};
    for (const c of data.constellations) {
      for (const stone of c.stones) if (stone.mana) mana[String(stone.id)] = manaRange(data.mana[stone.mana]!).min;
    }
    expect(customTotals(data, active, mana)).toEqual(quickTotals(slider.constellations, 7, "min"));
    expect(customTotals(data, new Set(), {})).toEqual({});
  });

  it("il bonus di completamento arriva solo con tutte le pietre", () => {
    const all = new Set(lust.stones.map((stone) => stone.id));
    expect(isComplete(lust, all)).toBe(true);
    const missing = new Set(all);
    missing.delete(lust.stones.find((stone) => stone.kind === "mana")!.id);
    expect(isComplete(lust, missing)).toBe(false);
    const full = customTotals({ constellations: [lust], mana: data.mana }, all, {});
    const partial = customTotals({ constellations: [lust], mana: data.mana }, missing, {});
    expect(full.atk! - partial.atk!).toBeGreaterThanOrEqual(lust.completion.atk);
  });

  it("attivare una pietra attiva quelle prima; spegnerla spegne quelle dopo", () => {
    const deepest = deepestStone(lust);
    const on = activateStone(lust, deepest.id, new Set());
    for (let current = deepest; current.mother !== null; current = lust.stones.find((s) => s.id === current.mother)!) {
      expect(on.has(current.id)).toBe(true);
    }
    const start = lust.stones.find((stone) => stone.kind === "start")!;
    const first = lust.stones.find((stone) => stone.mother === start.id)!;
    expect(deactivateStone(lust, first.id, on).size).toBe(1); // resta la partenza
  });

  it("le pietre del mana: la media al livello 1 del Caos, e un valore scelto resta nell'intervallo", () => {
    const group = data.mana["1"]!;
    // 40% fra 6 e 9, 40% fra 10 e 14, 20% fra 15 e 21
    expect(manaAverage(group)).toBeCloseTo(0.4 * 7.5 + 0.4 * 12 + 0.2 * 18, 5);
    expect(manaValue(group, 999)).toBe(manaRange(group).max);
    expect(manaValue(group, 1)).toBe(manaRange(group).min);
    expect(manaValue(group, undefined)).toBe(manaAverage(group));
  });
});

describe("statistiche in battaglia e classe di combattimento", () => {
  const stats = grandCrossModule.heroStats!["1575001"]!; // Derieri
  const values = statsAt(stats.steps!, maxSelection(stats.steps!));

  it("il titolo moltiplica la statistica di scheda, la costellazione si aggiunge dopo", () => {
    const out = battleStats(values, { atk: 4.5, def: 9.5, hp: 15 }, { atk: 1000, critPer: 7.7 });
    expect(out.atk).toBe(Math.round(values.atk! * 1.045 + 1000));
    expect(out.def).toBe(Math.round(values.def! * 1.095));
    expect(out.critPer).toBeCloseTo(values.critPer! + 7.7, 5);
    expect(battleStats(values, null, {})).toEqual(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, FLAT_STATS.has(k as never) ? Math.round(v) : v])));
  });

  it("la classe di Derieri al massimo, senza equipaggiamento: la formula del client", () => {
    const power = heroCombatClass(values, data.heroPower, { ultimateRank: 6, trueAwakening: true });
    // 8.671 + 7.195 × 0,8 + 102.715 × 0,2 + percentuali × pesi = 36.989,25; + 500 + 400 × 6 + 1.500
    expect(power).toBe(41390);
    expect(heroCombatClass(values, data.heroPower, { ultimateRank: 1, trueAwakening: false })).toBe(power - 5 * 400 - 1500);
  });

  it("ridà la classe mostrata dal gioco: Meliodas Nemesi dell'utente, 45.411", () => {
    // la schermata dell'eroe del 26/09, senza equipaggiamento: ultimate al rango 2,
    // Vero risveglio della Divinita' (Amplificazione danni 15%)
    const screen = {
      atk: 8889, def: 7189, hp: 120210, fixedAtkPer: 123, fixedDefPer: 108, hpRegenPer: 40, critPer: 122,
      critAtkPer: 251, critResPer: 113, critDefPer: 147, hpRecoveryPer: 127.5, hpStealPer: 17, dmgRes: 0, dmgInc: 15,
    };
    expect(heroCombatClass(screen, data.heroPower, { ultimateRank: 2, trueAwakening: true })).toBe(45411);
  });

  it("i pesi sono quelli della configurazione del gioco", () => {
    expect(data.heroPower.weights).toMatchObject({ atk: 1, def: 0.8, hp: 0.2, critPer: 5, critAtkPer: 2.5, fixedAtkPer: 5 });
    expect(data.heroPower).toMatchObject({ uniquePassive: 500, perUltimateRank: 400, trueAwakening: 1500 });
  });
});

describe("l'account salvato nel browser", () => {
  const slider = sliderData(data, "grand-cross", "it");

  it("un testo rotto o di un'altra forma torna vuoto, un campo sbagliato torna al suo valore vuoto", () => {
    expect(parseSetup(null)).toEqual(EMPTY_SETUP);
    expect(parseSetup("non json")).toEqual(EMPTY_SETUP);
    expect(parseSetup("[1,2]")).toMatchObject({ power: 0, completed: 0 });
    expect(parseSetup(JSON.stringify({ power: "tanti", completed: 3, mana: "boh" }))).toEqual({
      power: 0,
      completed: 3,
      mana: "avg",
      custom: null,
    });
  });

  it("senza niente scelto l'account non aggiunge niente", () => {
    expect(setupEffect(slider, EMPTY_SETUP)).toMatchObject({ tier: null, active: false });
  });

  it("le scelte pietra per pietra valgono solo coi dati da cui sono nate", () => {
    const custom: AccountSetup = {
      ...EMPTY_SETUP,
      completed: 2,
      custom: { version: slider.version, stones: [], mana: {}, totals: { atk: 5 } },
    };
    expect(setupEffect(slider, custom)).toMatchObject({ custom: true, stale: false, bonus: { atk: 5 } });
    const old = { ...custom, custom: { ...custom.custom!, version: "vecchia" } };
    const effect = setupEffect(slider, old);
    expect(effect).toMatchObject({ custom: false, stale: true });
    // allora vale la scelta rapida
    expect(effect.bonus).toEqual(quickTotals(slider.constellations, 2, "avg"));
    expect(parseSetup(JSON.stringify(custom))).toEqual(custom);
  });

  it("addBags somma senza code di virgola mobile", () => {
    expect(addBags({ critPer: 0.1 }, { critPer: 0.2 })).toEqual({ critPer: 0.3 });
  });
});

describe("la voce nella barra", () => {
  // dal 10/10 sta in «Progressione», con set e carte: e' quello che si fa crescere
  it("«Buff dell'account» sta nella Progressione di Grand Cross", () => {
    const progressione = gameGroups("grand-cross", "it").find((group) => group.label === "Progressione")!;
    expect(progressione.items.map((item) => item.path)).toContain("/buff-account");
  });
});

function deepestStone(c: Constellation) {
  const byId = new Map(c.stones.map((stone) => [stone.id, stone]));
  const depth = (id: number): number => {
    const mother = byId.get(id)!.mother;
    return mother === null ? 0 : 1 + depth(mother);
  };
  return c.stones.reduce((best, stone) => (depth(stone.id) > depth(best.id) ? stone : best));
}
