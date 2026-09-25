/**
 * Test delle statistiche a un livello qualunque e delle Reliquie sacre.
 *
 * La prova che conta e' sui dati veri: per ogni eroe i pezzi sommati con tutto
 * al massimo devono ridare il massimo che la pipeline calcola per conto suo. Se
 * non tornano, lo slider della scheda mostrerebbe numeri che la tabella del
 * massimo smentisce. Il resto controlla i limiti del gioco su un campione
 * scritto a mano.
 */

import { describe, expect, it } from "vitest";
import { clampSelection, maxSelection, statsAt } from "../hero-stats";
import { grandCrossModule } from "../grand-cross";
import type { HeroStatSteps } from "../types";

const campione: HeroStatSteps = {
  base: { atk: 100, def: 50, hp: 1000, critPer: 5, critAtkPer: 120 },
  perLevel: { atk: 10, def: 5, hp: 100 },
  maxLevel: 100,
  awaken: [{ hp: 10 }, { atk: 1 }, { hp: 10 }, { atk: 1, critPer: 3 }, { hp: 10 }, { atk: 1 }],
  superAwaken: [{ hp: 20 }, { atk: 2 }, { hp: 20 }, { atk: 2 }, { hp: 20 }, { critAtkPer: 4.5 }],
  relic: { atk: 1000, def: 1000, hp: 10000 },
  costumes: { def: 7, critPer: 0.5 },
};

describe("statsAt", () => {
  it("al livello 1, senza niente, sono le statistiche di base", () => {
    const nudo = { level: 1, awaken: 0, superAwaken: 0, relic: false, costumes: false };
    expect(statsAt(campione, nudo)).toEqual(campione.base);
  });

  it("ogni livello aggiunge la crescita, e i Risvegli si sommano in ordine", () => {
    const stats = statsAt(campione, { level: 11, awaken: 4, superAwaken: 0, relic: false, costumes: false });
    expect(stats.atk).toBe(100 + 10 * 10 + 1 + 1);
    expect(stats.hp).toBe(1000 + 100 * 10 + 10 + 10);
    expect(stats.critPer).toBe(5 + 3);
  });

  it("le percentuali non lasciano code di virgola mobile", () => {
    const stats = statsAt(campione, maxSelection(campione));
    expect(stats.critPer).toBe(8.5);
    expect(stats.critAtkPer).toBe(124.5);
  });

  it("i Super risvegli valgono solo a Risveglio completo, come nel gioco", () => {
    expect(clampSelection(campione, { level: 50, awaken: 5, superAwaken: 3, relic: true, costumes: true }).superAwaken).toBe(0);
    expect(clampSelection(campione, { level: 50, awaken: 6, superAwaken: 3, relic: true, costumes: true }).superAwaken).toBe(3);
  });

  it("il livello resta fra 1 e il massimo, e la reliquia c'e' solo se l'eroe ce l'ha", () => {
    const fuori = clampSelection(campione, { level: 250, awaken: 9, superAwaken: -2, relic: true, costumes: true });
    expect(fuori).toMatchObject({ level: 100, awaken: 6, superAwaken: 0 });
    expect(clampSelection(campione, { ...fuori, level: 0 }).level).toBe(1);
    const senzaReliquia = { ...campione, relic: undefined };
    expect(maxSelection(senzaReliquia).relic).toBe(false);
    expect(clampSelection(senzaReliquia, maxSelection(campione)).relic).toBe(false);
  });
});

describe("dati veri: i pezzi ridanno il massimo", () => {
  const stats = grandCrossModule.heroStats ?? {};
  // Il Vero risveglio e gli `*IncPer` stanno nel massimo ma non nei pezzi: la
  // scheda non li mostra (vedi HeroStatSteps).
  const fuori = (key: string) => key.endsWith("IncPer") || ["dmgRes", "dmgInc", "fPower"].includes(key);

  it("ogni eroe con le statistiche ha anche i pezzi", () => {
    const senza = Object.entries(stats).filter(([, s]) => !s.steps).map(([id]) => id);
    expect(Object.keys(stats).length).toBeGreaterThan(300);
    expect(senza).toEqual([]);
  });

  it("per ogni eroe, tutto al massimo = il massimo", () => {
    const sbagliati: string[] = [];
    for (const [id, s] of Object.entries(stats)) {
      if (!s.steps) continue;
      const somma = statsAt(s.steps, maxSelection(s.steps));
      for (const [key, value] of Object.entries(s.max)) {
        if (fuori(key)) continue;
        if (Math.abs((somma[key] ?? 0) - value) > 1e-6) sbagliati.push(`${id} ${key}: ${somma[key]} invece di ${value}`);
      }
    }
    expect(sbagliati).toEqual([]);
  });

  it("sei Risvegli e sei Super risvegli, livello massimo 100", () => {
    for (const s of Object.values(stats)) {
      if (!s.steps) continue;
      expect(s.steps.awaken).toHaveLength(6);
      expect(s.steps.superAwaken).toHaveLength(6);
      expect(s.steps.maxLevel).toBe(100);
    }
  });
});

describe("dati veri: le Reliquie sacre", () => {
  const index = grandCrossModule.heroRelics;

  it("ogni reliquia citata esiste, con bestie e oggetti risolti", () => {
    expect(index).toBeDefined();
    const problemi: string[] = [];
    for (const [hid, ids] of Object.entries(index!.heroes)) {
      for (const id of ids) {
        const relic = index!.relics[id];
        if (!relic) {
          problemi.push(`${hid}: reliquia ${id} assente`);
          continue;
        }
        for (const beast of relic.beasts) if (!index!.beasts[beast]) problemi.push(`${id}: bestia ${beast}`);
        const amounts = [
          ...relic.materials,
          ...(relic.cost ? [relic.cost] : []),
          ...relic.upgrades.flatMap((u) => [...u.materials, ...(u.cost ? [u.cost] : [])]),
        ];
        for (const a of amounts) if (!index!.items[a.id]) problemi.push(`${id}: oggetto ${a.id}`);
        if (!relic.name.it && !relic.name.en) problemi.push(`${id}: senza nome`);
      }
    }
    expect(problemi).toEqual([]);
  });

  it("la reliquia delle statistiche e' la prima dell'eroe, coi suoi potenziamenti", () => {
    const stats = grandCrossModule.heroStats ?? {};
    const diversi: string[] = [];
    for (const [hid, ids] of Object.entries(index!.heroes)) {
      const steps = stats[hid]?.steps;
      const relic = index!.relics[ids[0]!];
      if (!steps || !relic) continue;
      for (const key of ["atk", "def", "hp"]) {
        const totale = (relic.stats[key] ?? 0) + relic.upgrades.reduce((sum, u) => sum + (u.stats[key] ?? 0), 0);
        if ((steps.relic?.[key] ?? 0) !== totale) diversi.push(`${hid} ${key}`);
      }
    }
    expect(diversi).toEqual([]);
  });
});
