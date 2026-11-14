import { describe, expect, it } from "vitest";
import { GEAR_PRESETS, gearTotals, presetBuild } from "../gear";
import { COSTUMES } from "../grand-cross/costumes.generated";
import { GEAR } from "../grand-cross/gear.generated";
import { HERO_RELICS } from "../grand-cross/hero-relics.generated";
import { HERO_STATS } from "../grand-cross/hero-stats.generated";
import { buildFromBox, calculatorDataFor, computeBuild, defaultBuild } from "../hero-build";
import { START_STATS, startStatsOf } from "../team-start";

/**
 * I numeri d'inizio della squadra sono quelli del calcolatore della scheda eroe:
 * se i due conti si separano, la squadra parte da numeri che il sito altrove non
 * mostra. Si prova su tutti gli eroi, al massimo e con un box a meta' strada.
 */

const gear = gearTotals(GEAR, presetBuild(GEAR, GEAR_PRESETS[0]!));
const dataOf = (heroId: string) =>
  calculatorDataFor({
    heroId,
    steps: HERO_STATS[heroId]?.steps,
    gear: GEAR,
    costumes: COSTUMES,
    relics: (HERO_RELICS.heroes[heroId] ?? []).map((id) => ({ id, relic: HERO_RELICS.relics[id]! })),
  });
const ids = Object.keys(HERO_STATS).filter((id) => dataOf(id));

describe("i numeri d'inizio della squadra", () => {
  it("al massimo sono quelli del calcolatore, per ogni eroe", () => {
    expect(ids.length).toBeGreaterThan(300);
    const wrong: string[] = [];
    for (const id of ids) {
      const data = dataOf(id)!;
      const calc = computeBuild(data, defaultBuild(data)).withGear;
      const mine = startStatsOf(HERO_STATS[id]!.steps!, null, gear).stats;
      for (const key of START_STATS) {
        if (Math.abs((calc[key] ?? 0) - mine[key]) > 0.01) wrong.push(`${id} ${key}: ${mine[key]} invece di ${calc[key]}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("dal box sono quelli che il calcolatore mostra per lo stesso eroe del box", () => {
    const entry = { level: 80, awaken: 6, superAwaken: 2, ultimateRank: 3, trueAwakening: [false, false] as const, relic: false };
    const wrong: string[] = [];
    for (const id of ids) {
      const data = dataOf(id)!;
      const calc = computeBuild(data, buildFromBox(data, entry)).withGear;
      const mine = startStatsOf(HERO_STATS[id]!.steps!, entry, gear);
      expect(mine.from).toBe("box");
      for (const key of START_STATS) {
        if (Math.abs((calc[key] ?? 0) - mine.stats[key]) > 0.01) wrong.push(`${id} ${key}: ${mine.stats[key]} invece di ${calc[key]}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("il titolo della classe moltiplica Attacco, Difesa e PS, le costellazioni si sommano", () => {
    const id = ids[0]!;
    const plain = startStatsOf(HERO_STATS[id]!.steps!, null, gear).stats;
    const withAccount = startStatsOf(HERO_STATS[id]!.steps!, null, gear, {
      tier: { atk: 20, def: 20, hp: 20 },
      bonus: { atk: 100, critPer: 2 },
    }).stats;
    expect(withAccount.atk).toBeCloseTo(plain.atk * 1.2 + 100, 6);
    expect(withAccount.def).toBeCloseTo(plain.def * 1.2, 6);
    expect(withAccount.critPer).toBeCloseTo(plain.critPer + 2, 6);
  });
});
