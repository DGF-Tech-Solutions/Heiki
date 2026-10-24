import { describe, expect, it } from "vitest";
import { contrastRatio, DARK_INK, labelInk, LIGHT_INK, relativeLuminance } from "../colors";
import { defaultTiers, LEGACY_TIER_COLORS, nextTierColor, TIER_COLORS, TIER_LADDER } from "../types";
import { tierRowsSchema } from "../validation";

describe("inchiostro delle righe", () => {
  it("misura il contrasto come WCAG", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 5);
    // il rosso del sito col bianco sopra: 4,7:1, il numero scritto in globals.css
    expect(contrastRatio("#e61421", "#ffffff")).toBeCloseTo(4.68, 1);
  });

  it("scrive scuro sui colori chiari e chiaro sugli scuri", () => {
    // i casi della revisione del 24/10: bianco su oro 1,4:1, su verde 1,9:1
    expect(labelInk("#ffd21f")).toBe(DARK_INK);
    expect(labelInk("#5fd38a")).toBe(DARK_INK);
    expect(labelInk("#ff6b00")).toBe(DARK_INK);
    expect(labelInk("#e61421")).toBe(LIGHT_INK);
    expect(labelInk("#1c64e8")).toBe(LIGHT_INK);
  });

  it("ogni colore offerto regge 4,5:1 con il suo inchiostro", () => {
    for (const { hex } of TIER_COLORS) {
      expect(contrastRatio(hex, labelInk(hex)), hex).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("anche i colori di prima reggono le lettere grandi (3:1)", () => {
    for (const hex of LEGACY_TIER_COLORS) {
      expect(contrastRatio(hex, labelInk(hex)), hex).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("tavolozza delle righe", () => {
  it("le righe predefinite seguono la scala, dal rosso del sito in giu'", () => {
    expect(defaultTiers().map((tier) => tier.color)).toEqual([...TIER_LADDER]);
    expect(TIER_LADDER[0]).toBe("#e61421");
  });

  it("niente doppioni fra i colori offerti", () => {
    const hexes = TIER_COLORS.map((color) => color.hex);
    expect(new Set(hexes).size).toBe(hexes.length);
  });

  it("una riga nuova prende il gradino al suo posto, poi resta sul carbone", () => {
    expect(nextTierColor(0)).toBe(TIER_LADDER[0]);
    expect(nextTierColor(3)).toBe(TIER_LADDER[3]);
    expect(nextTierColor(6)).toBe(TIER_LADDER[5]);
    expect(nextTierColor(19)).toBe(TIER_LADDER[5]);
  });

  it("le liste salvate coi colori di prima restano valide", () => {
    const schema = tierRowsSchema(new Set<string>());
    for (const [index, color] of LEGACY_TIER_COLORS.entries()) {
      const parsed = schema.safeParse([{ id: `r${index}`, label: "S", color, heroIds: [] }]);
      expect(parsed.success, color).toBe(true);
    }
  });
});
