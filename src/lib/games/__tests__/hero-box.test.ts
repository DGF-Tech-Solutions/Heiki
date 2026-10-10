/**
 * Test del box: gli eroi che hai e a che punto sono (hero-box.ts).
 *
 * Le regole che il browser e il server condividono: la forma compatta torna
 * uguale, quello che non torna si scarta, ogni eroe resta dentro i suoi tetti
 * (Super risvegli solo a Risveglio completo, Reliquia solo se l'eroe ce l'ha), e
 * coi dati veri di Grand Cross i tetti escono per ogni eroe.
 */

import { describe, expect, it } from "vitest";
import { grandCrossModule } from "../grand-cross";
import {
  boxLimitsFrom,
  boxSize,
  boxToJson,
  clampEntry,
  EMPTY_BOX,
  maxEntry,
  newEntry,
  ownsHero,
  parseBox,
  sameBox,
  serializeBox,
  withHero,
  type BoxLimits,
} from "../hero-box";

const LIMITS: BoxLimits = { maxLevel: 100, awaken: 6, superAwaken: 6, relic: true };
const NO_RELIC: BoxLimits = { ...LIMITS, relic: false };

describe("il box", () => {
  it("si scrive e si rilegge uguale", () => {
    const box = withHero(withHero(EMPTY_BOX, "1575001", maxEntry(LIMITS)), "1065001", newEntry(LIMITS));
    const back = parseBox(serializeBox(box));
    expect(sameBox(box, back)).toBe(true);
    expect(boxSize(back)).toBe(2);
    expect(back.heroes["1575001"]).toEqual({
      level: 100,
      awaken: 6,
      superAwaken: 6,
      ultimateRank: 6,
      trueAwakening: [true, true],
      relic: true,
    });
  });

  it("la forma compatta come oggetto (quella che la sincronizzazione manda al server) si rilegge uguale", () => {
    const box = withHero(EMPTY_BOX, "1575001", maxEntry(LIMITS));
    expect(sameBox(parseBox(boxToJson(box)), box)).toBe(true);
    // l'oggetto in memoria non e' la forma da mandare: si legge come un box vuoto
    expect(boxSize(parseBox(box as unknown))).toBe(0);
  });

  it("un eroe appena segnato e' al livello massimo coi Risvegli, il resto da fare", () => {
    expect(newEntry(LIMITS)).toEqual({
      level: 100,
      awaken: 6,
      superAwaken: 0,
      ultimateRank: 1,
      trueAwakening: [false, false],
      relic: false,
    });
  });

  it("niente Super risvegli senza Risveglio completo, niente Reliquia se l'eroe non ne ha", () => {
    const e = clampEntry(
      { level: 999, awaken: 3, superAwaken: 6, ultimateRank: 9, trueAwakening: [true, false], relic: true },
      NO_RELIC,
    );
    expect(e).toEqual({ level: 100, awaken: 3, superAwaken: 0, ultimateRank: 6, trueAwakening: [true, false], relic: false });
  });

  it("quello che non torna si scarta senza rompere niente", () => {
    expect(parseBox("non e' json")).toEqual(EMPTY_BOX);
    expect(parseBox(null)).toEqual(EMPTY_BOX);
    expect(parseBox({ h: [] })).toEqual(EMPTY_BOX);
    const box = parseBox({ v: 1, h: { "1575001": [50, 2, 0, 1, 0], "<script>": [1, 1, 1, 1, 1], "1065001": "no" } });
    expect(Object.keys(box.heroes)).toEqual(["1575001"]);
  });

  it("coi tetti del gioco tiene solo gli eroi che esistono", () => {
    const limits = { "1575001": LIMITS };
    const box = parseBox({ v: 1, h: { "1575001": [100, 6, 6, 6, 7], "9999999": [100, 6, 6, 6, 7] } }, limits);
    expect(ownsHero(box, "1575001")).toBe(true);
    expect(ownsHero(box, "9999999")).toBe(false);
  });

  it("i tetti di Grand Cross escono per ogni eroe del roster", () => {
    const stats = grandCrossModule.heroStats!;
    const limits = boxLimitsFrom(stats);
    for (const hero of grandCrossModule.roster!.heroes) {
      const own = limits[hero.id];
      expect(own, hero.id).toBeDefined();
      expect(own!.maxLevel).toBeGreaterThan(1);
      expect(own!.awaken).toBeGreaterThan(0);
    }
  });
});
