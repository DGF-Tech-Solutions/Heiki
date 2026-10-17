import { describe, expect, it } from "vitest";
import { defaultTiers, TIER_COLORS } from "../types";

describe("Tier List Maker types e costanti", () => {
  it("defaultTiers restituisce i 6 livelli standard S+, S, A, B, C, D", () => {
    const tiers = defaultTiers();
    expect(tiers).toHaveLength(6);
    expect(tiers.map((t) => t.label)).toEqual(["S+", "S", "A", "B", "C", "D"]);
    for (const tier of tiers) {
      expect(tier.id).toBeDefined();
      expect(tier.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(tier.heroIds).toEqual([]);
    }
  });

  it("TIER_COLORS contiene colori esadecimali validi", () => {
    expect(TIER_COLORS.length).toBeGreaterThanOrEqual(8);
    for (const color of TIER_COLORS) {
      expect(color.label.length).toBeGreaterThan(0);
      expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("ogni tier predefinito ha un id unico", () => {
    const tiers = defaultTiers();
    const ids = tiers.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

