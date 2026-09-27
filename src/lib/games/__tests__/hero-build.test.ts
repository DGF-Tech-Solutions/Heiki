/**
 * Test del calcolatore della scheda eroe: la configurazione di partenza ridà i
 * numeri che la scheda ha sempre mostrato (senza equipaggiamento) e il «massimo
 * con equipaggiamento» (con), eroe per eroe, coi dati che arrivano davvero al
 * browser; quello che si rilegge dal browser non rompe niente; la battaglia segue
 * l'ordine del gioco.
 */

import { describe, expect, it } from "vitest";
import { heroName } from "../heroes";
import { shownValue } from "../gear";
import { COSTUMES } from "../grand-cross/costumes.generated";
import { GEAR } from "../grand-cross/gear.generated";
import { HERO_FATES } from "../grand-cross/hero-fates.generated";
import { HERO_RELICS } from "../grand-cross/hero-relics.generated";
import { HERO_STATS } from "../grand-cross/hero-stats.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { battleWith, calculatorDataFor, computeBuild, defaultBuild, parseBuild } from "../hero-build";

const STATS12 = ["atk", "def", "hp", "critPer", "critAtkPer", "fixedAtkPer", "critResPer", "critDefPer", "fixedDefPer", "hpRecoveryPer", "hpStealPer", "hpRegenPer"];

function dataOf(heroId: string) {
  return calculatorDataFor({
    heroId,
    steps: HERO_STATS[heroId]?.steps,
    gear: GEAR,
    costumes: COSTUMES,
    relics: (HERO_RELICS.heroes[heroId] ?? []).map((id) => ({ id, relic: HERO_RELICS.relics[id]! })),
    fates: HERO_FATES,
    roster: HEROES.map((hero) => ({ id: hero.id, rarity: hero.rarity, obtainedAs: hero.obtainedAs, name: heroName(hero, "it") })),
    heroStats: HERO_STATS,
  });
}

describe("il calcolatore parte dai numeri di sempre", () => {
  it("senza equipaggiamento e' la scheda al massimo, con e' il massimo con equipaggiamento, per ogni eroe", () => {
    let checked = 0;
    for (const hero of HEROES) {
      const stats = HERO_STATS[hero.id];
      const data = dataOf(hero.id);
      if (!stats?.steps || !data) continue;
      const result = computeBuild(data, defaultBuild(data));
      for (const key of STATS12) {
        if (stats.max[key] === undefined) continue;
        expect(result.without[key], `${hero.id} ${key}`).toBeCloseTo(stats.max[key]!, 6);
      }
      expect(shownValue("atk", result.withGear.atk!)).toBe(Math.ceil((stats.maxGeared.atk! * stats.maxGeared.atkIncPer!) / 100 - 1e-6));
      expect(shownValue("hp", result.withGear.hp!)).toBe(Math.ceil((stats.maxGeared.hp! * stats.maxGeared.hpIncPer!) / 100 - 1e-6));
      checked++;
    }
    expect(checked).toBe(HEROES.length);
  });

  it("i dati per il browser portano solo i costumi dell'eroe, senza descrizioni", () => {
    const data = dataOf("1575001")!;
    const own = new Set(Object.values(COSTUMES.heroes["1575001"]!.all).flat());
    expect(Object.keys(data.costumes.items).sort()).toEqual([...own].sort());
    expect(Object.values(data.costumes.items).every((c) => !("description" in c))).toBe(true);
    expect(data.associates!.length).toBe(HEROES.length);
  });
});

describe("quello che si rilegge dal browser", () => {
  const data = dataOf("1575001")!;

  it("cose senza senso tornano alla partenza, campo per campo", () => {
    expect(parseBuild(null, data)).toEqual(defaultBuild(data));
    const parsed = parseBuild(
      {
        level: 999,
        awaken: 2,
        superAwaken: 6,
        relic: { id: "nessuna", upgrades: 9 },
        gear: [{ set: 1, rating: 9, awakening: 9, plus: -3, roll: 1e9, engraved: true, options: [{ id: 1, value: 99 }] }, "x"],
        costumes: { body: [{ id: "non-esiste", step: 3 }] },
        associate: { hero: "1575001", ultimateRank: 9, grade: 9 },
      },
      data,
    );
    expect(parsed.level).toBe(100);
    // i Super risvegli solo a Risveglio completo
    expect(parsed.superAwaken).toBe(0);
    expect(parsed.relic).toEqual(defaultBuild(data).relic);
    expect(parsed.gear[0]).toMatchObject({ rating: 5, awakening: 5, plus: 0, roll: 520, engraved: false });
    expect(parsed.gear[0]!.options).toEqual([{ id: 1, value: 3 }]);
    expect(parsed.gear[1]).toBeNull();
    expect(parsed.costumes.body.every((c) => c === null)).toBe(true);
    // non si associa a se stesso
    expect(parsed.associate).toBeNull();
  });
});

describe("in battaglia", () => {
  it("l'effetto comune si somma prima delle percentuali, il legame dopo, il titolo moltiplica dopo l'equipaggiamento", () => {
    // Meliodas Nemesi con Principessa Elizabeth: nessun legame fra i due
    const data = dataOf("2007501")!;
    const build = { ...defaultBuild(data), associate: { hero: "1035003", ultimateRank: 6, grade: 6, sameGear: false } };
    const result = computeBuild(data, build);
    expect(result.fate!.percent).toBe(10);
    expect(result.fate!.before.atk).toBeCloseTo(893.5, 6);
    const battle = battleWith(result, { atk: 7, def: 12, hp: 15 }, { hp: 1000 });
    // PS/Difesa: PS +50% dell'equipaggiamento, poi +15% del titolo, poi le costellazioni
    const hp = (result.without.hp! + result.gear.flat.hp + result.fate!.before.hp!) * 1.5 * 1.15 + 1000;
    expect(battle.hp).toBeCloseTo(hp, 6);
  });

  it("con un legame l'effetto dipende dal grado dell'associato", () => {
    const main = Object.keys(HERO_FATES.heroes).find((id) => dataOf(id))!;
    const [associate] = HERO_FATES.heroes[main]![0]!;
    const data = dataOf(main)!;
    const link = (grade: number) =>
      computeBuild(data, { ...defaultBuild(data), associate: { hero: associate, ultimateRank: 1, grade, sameGear: true } }).fate!.link;
    const low = link(3)!;
    const high = link(6)!;
    expect(high.value).toBeGreaterThan(low.value);
    expect(high.effect.grades).toContain(high.value);
  });
});
