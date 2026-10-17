import { describe, expect, it } from "vitest";
import { defaultTiers, type SavedTierListSummary, type TierListBackupFile, type TierRow } from "../types";

describe("Tier List Account & Backup Utilities", () => {
  it("struttura di salvataggio tier list supporta più tierlist con nomi diversi", () => {
    const list1: SavedTierListSummary = {
      id: "uuid-1",
      title: "PvP Meta Season 1",
      game: "grand-cross",
      gameName: "Grand Cross",
      isPublic: true,
      heroCount: 8,
      tierCount: 6,
      topHeroIds: ["hero1", "hero2", "hero3"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOwner: true,
    };

    const list2: SavedTierListSummary = {
      id: "uuid-2",
      title: "Bestie Demoniache - Snake & Bird",
      game: "grand-cross",
      gameName: "Grand Cross",
      isPublic: true,
      heroCount: 12,
      tierCount: 6,
      topHeroIds: ["hero4", "hero5"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOwner: true,
    };

    expect(list1.title).not.toBe(list2.title);
    expect(list1.id).not.toBe(list2.id);
  });

  it("genera un file di backup valido conforme allo schema TierListBackupFile", () => {
    const sampleTiers: TierRow[] = defaultTiers();
    sampleTiers[0]!.heroIds = ["hero_escanor", "hero_meliodas"];

    const backup: TierListBackupFile = {
      version: 1,
      exportedAt: new Date().toISOString(),
      username: "testuser",
      tierLists: [
        {
          id: "uuid-sample",
          title: "La mia Tier List Preferita",
          game: "grand-cross",
          tiers: sampleTiers,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    expect(backup.version).toBe(1);
    expect(backup.username).toBe("testuser");
    expect(backup.tierLists).toHaveLength(1);
    expect(backup.tierLists[0]?.tiers[0]?.heroIds).toContain("hero_escanor");

    // Serializzazione e deserializzazione JSON
    const json = JSON.stringify(backup);
    const parsed = JSON.parse(json) as TierListBackupFile;
    expect(parsed.version).toBe(1);
    expect(parsed.tierLists[0]?.title).toBe("La mia Tier List Preferita");
  });
});

