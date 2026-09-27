/**
 * Test del calcolatore: equipaggiamento, costumi, associazioni.
 *
 * Le regole vengono dal codice del client (EQUIPAGGIAMENTO.md e
 * COSTUMI_ASSOCIAZIONI.md nella pipeline). Qui si controlla che gear.ts le segua
 * sui numeri calcolati negli studi, e sui dati veri: il «massimo con
 * equipaggiamento» di sempre (7dshub, maxGeared) deve uscire dal set PS/Difesa
 * per ogni eroe, e i costumi di partenza dalle statistiche della scheda.
 */

import { describe, expect, it } from "vitest";
import {
  GEAR_PRESETS,
  applyGear,
  associatedTo,
  canEngrave,
  clampCostumes,
  clampPiece,
  commonFatePercent,
  costumeFlat,
  costumeLevel,
  costumeMaxStep,
  costumeTotals,
  fateContribution,
  fateEffectAt,
  gearTotals,
  mainOption,
  maxPiece,
  pieceMain,
  presetBuild,
  presetOf,
  shownValue,
  startCostumes,
  type GearPiece,
} from "../gear";
import { COSTUMES } from "../grand-cross/costumes.generated";
import { GEAR } from "../grand-cross/gear.generated";
import { HERO_FATES } from "../grand-cross/hero-fates.generated";
import { HERO_STATS } from "../grand-cross/hero-stats.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { maxSelection, statsAt } from "../hero-stats";

const preset = (key: string) => GEAR_PRESETS.find((p) => p.key === key)!;

describe("equipaggiamento: la statistica principale", () => {
  it("un pezzo SSR a +30 e' tiro + 30 miglioramenti; inciso prende la riga UR alla stessa posizione", () => {
    // il bracciale (parte 1) SSR va da 390 a 520, +24 a miglioramento; UR da 510 a 680, +32
    const piece: GearPiece = { set: 1, rating: 5, engraved: false, awakening: 5, plus: 5, roll: 455, options: [] };
    expect(pieceMain(GEAR, 1, piece)).toBe(455 + 30 * 24);
    expect(pieceMain(GEAR, 1, { ...piece, engraved: true })).toBe(510 + 170 * 0.5 + 30 * 32);
    // lo stesso pezzo inciso addosso a un altro eroe vale come non inciso
    expect(pieceMain(GEAR, 1, { ...piece, engraved: true }, false)).toBe(1175);
  });

  it("i massimi dei sei pezzi UR", () => {
    const massimi = GEAR.parts.map((p) => pieceMain(GEAR, p.part, maxPiece(GEAR, p.part, 1)));
    // Braccialetto, Collana, Cintura, Anello, Orecchini, Runa
    expect(massimi).toEqual([1640, 820, 16400, 840, 420, 8400]);
  });

  it("si incide solo al massimo, e un pezzo sistemato non ha piu' effetti dei risvegli", () => {
    const piece = maxPiece(GEAR, 1, 1);
    expect(canEngrave(GEAR, piece)).toBe(true);
    expect(canEngrave(GEAR, { ...piece, plus: 4 })).toBe(false);
    const clamped = clampPiece(GEAR, 1, { ...piece, awakening: 2, roll: 9999 })!;
    expect(clamped.engraved).toBe(false);
    expect(clamped.options).toHaveLength(2);
    expect(clamped.roll).toBe(520);
    // un effetto di un altro gruppo (la Difesa% sta sulle parti di difesa) si toglie
    const difesa = mainOption(GEAR, 2);
    expect(clampPiece(GEAR, 1, { ...piece, options: [{ id: difesa.id, value: 3 }] })!.options).toEqual([]);
    // i valori vanno a passi di 0,1 dentro il loro intervallo
    const attacco = mainOption(GEAR, 1);
    expect(clampPiece(GEAR, 1, { ...piece, options: [{ id: attacco.id, value: 2.349 }] })!.options[0]!.value).toBe(2.3);
    expect(clampPiece(GEAR, 1, { ...piece, set: 999 })).toBeNull();
  });
});

describe("equipaggiamento: set e totali", () => {
  it("un set conta pezzi / pezzi del set volte: sei Muro di ferro sono Difesa +60%", () => {
    const muro = GEAR.parts.map((p) => ({ ...maxPiece(GEAR, p.part, 7), options: [], awakening: 0, plus: 0, engraved: false }));
    expect(gearTotals(GEAR, muro).percent.def).toBe(60);
    const carica = GEAR.parts.map((p) => ({ ...maxPiece(GEAR, p.part, 1), options: [], awakening: 0, plus: 0, engraved: false }));
    // sei pezzi di un set da quattro: una volta sola
    expect(gearTotals(GEAR, carica).percent.atk).toBe(20);
  });

  it("Derieri della Purezza con Carica + Muro di ferro al massimo: i numeri dello studio", () => {
    const max = HERO_STATS["1575001"]!.max;
    const build = presetBuild(GEAR, { four: 1, two: 7 });
    const out = applyGear(max, gearTotals(GEAR, build));
    expect(shownValue("atk", out.atk!)).toBe(16727);
    expect(shownValue("def", out.def!)).toBe(12653);
    expect(shownValue("hp", out.hp!)).toBe(165770);
    expect(out.critAtkPer).toBe(max.critAtkPer);
  });

  it("gli effetti bonus in punti si aggiungono, quelli in percentuale moltiplicano", () => {
    const max = HERO_STATS["1575001"]!.max;
    const build = presetBuild(GEAR, { four: 1, two: 7 }).map((piece, i) => {
      const part = i + 1;
      const pick = (stat: string) => GEAR.options.find((o) => o.group === GEAR.parts[i]!.group && o.stat === stat)!;
      // anello: Danno critico; orecchini: Difesa critico; runa: Furto di vita (5 volte al massimo)
      const stat = part === 4 ? "critAtkPer" : part === 5 ? "critDefPer" : part === 6 ? "hpStealPer" : null;
      if (!stat || !piece) return piece;
      const option = pick(stat);
      return { ...piece, options: Array.from({ length: 5 }, () => ({ id: option.id, value: option.max })) };
    });
    const out = applyGear(max, gearTotals(GEAR, build));
    expect(shownValue("atk", out.atk!)).toBe(15054);
    expect(shownValue("def", out.def!)).toBe(11388);
    expect(shownValue("hp", out.hp!)).toBe(146643);
    expect(out.critAtkPer).toBeCloseTo(175.5, 6);
    expect(out.critDefPer).toBeCloseTo(89.5, 6);
    expect(out.hpStealPer).toBeCloseTo(43.5, 6);
  });

  it("PS/Difesa al massimo e' il «massimo con equipaggiamento» di ogni eroe", () => {
    const totals = gearTotals(GEAR, presetBuild(GEAR, preset("ps-difesa")));
    let checked = 0;
    for (const hero of HEROES) {
      const stats = HERO_STATS[hero.id];
      if (!stats) continue;
      const out = applyGear(stats.max, totals);
      for (const [stat, inc] of [["atk", "atkIncPer"], ["def", "defIncPer"], ["hp", "hpIncPer"]] as const) {
        expect(out[stat]).toBeCloseTo((stats.maxGeared[stat]! * stats.maxGeared[inc]!) / 100, 6);
      }
      checked++;
    }
    expect(checked).toBe(HEROES.length);
  });

  it("i set pronti si riconoscono, e un pezzo cambiato non e' piu' il set pronto", () => {
    const build = presetBuild(GEAR, preset("attacco-critico"));
    expect(presetOf(GEAR, build)).toBe("attacco-critico");
    expect(presetOf(GEAR, [null, ...build.slice(1)])).toBeNull();
  });
});

describe("costumi", () => {
  const byRarity = (rarity: number, kind: string) =>
    Object.values(COSTUMES.costumes).find((c) => c.rarity === rarity && c.kind === kind)!;

  it("la scala: un R va da 30 a 210 in 181 passi, un LR da 210 a 240", () => {
    const r = byRarity(3, "body");
    expect(costumeMaxStep(COSTUMES, r)).toBe(180);
    expect(costumeFlat(COSTUMES, r, 0)).toBe(30);
    expect(costumeFlat(COSTUMES, r, 180)).toBe(210);
    expect(costumeLevel(COSTUMES, r, 40)).toEqual({ rarity: 4, level: 0 });
    const lr = byRarity(7, "head");
    expect(costumeMaxStep(COSTUMES, lr)).toBe(30);
    expect([costumeFlat(COSTUMES, lr, 0), costumeFlat(COSTUMES, lr, 30)]).toEqual([1650, 1890]);
  });

  it("i costumi di partenza al massimo ridanno i costumi delle statistiche, e con la reliquia il massimo", () => {
    for (const hero of HEROES) {
      const steps = HERO_STATS[hero.id]?.steps;
      if (!steps) continue;
      const totals = costumeTotals(COSTUMES, startCostumes(COSTUMES, hero.id));
      for (const key of new Set([...Object.keys(totals), ...Object.keys(steps.costumes)])) {
        expect(totals[key] ?? 0, `${hero.id} ${key}`).toBeCloseTo(steps.costumes[key] ?? 0, 6);
      }
    }
    const steps = HERO_STATS["1575001"]!.steps!;
    const bare = statsAt(steps, { ...maxSelection(steps), costumes: false });
    const totals = costumeTotals(COSTUMES, startCostumes(COSTUMES, "1575001"));
    expect(bare.def! + totals.def!).toBe(HERO_STATS["1575001"]!.max.def);
  });

  it("i posti vuoti, i costumi di un altro eroe e i doppioni si tolgono", () => {
    const start = startCostumes(COSTUMES, "1575001");
    const other = COSTUMES.heroes["2007501"]!.all.body[0]!;
    const first = start.body[0]!;
    const clamped = clampCostumes(COSTUMES, "1575001", {
      body: [{ id: other, step: 5 }, first, first, { id: first.id, step: 9999 }],
    });
    expect(clamped.body).toHaveLength(5);
    expect(clamped.body[0]).toBeNull();
    expect(clamped.body[1]).toEqual(first);
    expect(clamped.body[2]).toBeNull();
    expect(clamped.weapon).toHaveLength(5);
  });

  it("i posti vengono dalla skin: chi ha 5/0/5/1 non ha posti per l'arma", () => {
    const senza = Object.entries(COSTUMES.heroes).filter(([, h]) => h.slots.weapon === 0);
    expect(senza.length).toBe(12);
    for (const [, h] of senza) expect(h.all.weapon).toEqual([]);
  });
});

describe("associazioni", () => {
  it("l'effetto comune va dal 5% al 10% con la Mossa finale dell'associato", () => {
    expect([1, 6].map((rank) => commonFatePercent(HERO_FATES, rank))).toEqual([5, 10]);
  });

  it("Meliodas Nemesi con Principessa Elizabeth alla Mossa finale 6: il 10% delle sue statistiche", () => {
    const eliza = HERO_STATS["1035003"]!.max;
    const { before } = fateContribution(HERO_FATES, eliza, 6, null);
    expect(before.atk).toBeCloseTo(893.5, 6);
    expect(before.def).toBeCloseTo(830.8, 6);
    expect(before.hp).toBeCloseTo(11482, 6);
  });

  it("il legame dipende dal grado dell'associato, e c'e' una riga dove LR cambia statistica", () => {
    const fate = HERO_FATES.heroes["1055004"]!.find(([other]) => other === "1165001")!;
    expect(fateEffectAt(HERO_FATES, fate, 6)).toMatchObject({ effect: { stat: "def" }, value: 340 });
    expect(fateEffectAt(HERO_FATES, fate, 7)).toMatchObject({ effect: { stat: "hp" }, value: 1440 });
    expect(fateEffectAt(HERO_FATES, fate, 3)!.value).toBe(190);
    const others = Object.values(HERO_FATES.heroes).flat().filter((f) => f[3] !== undefined);
    expect(others).toHaveLength(1);
  });

  it("gli eroi a cui si associa: Derieri della Purezza e' associata di otto eroi", () => {
    expect(associatedTo(HERO_FATES, "1575001").map(({ main }) => main).sort()).toEqual(
      ["1030501", "1525001", "1525002", "1805001", "1805002", "1845001", "1926501", "1928501"].sort(),
    );
  });
});
