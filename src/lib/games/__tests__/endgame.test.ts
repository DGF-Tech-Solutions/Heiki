/**
 * Test delle modalita' di fine gioco.
 *
 * Come per le uscite: le funzioni pure si provano su casi scritti a mano, poi
 * si controllano i dati veri di Grand Cross sul contratto - ogni riferimento
 * porta a qualcosa che esiste, i pesi dei drop fanno 10.000, ogni eroe citato e'
 * nel roster - e non sui numeri del momento.
 */

import { describe, expect, it } from "vitest";
import { gameGroups } from "../catalog";
import {
  chosenLevel,
  countFoes,
  dropChance,
  dropWeightTotal,
  formatCompact,
  formatMultiplier,
  formatPercent,
  levelHref,
} from "../endgame";
import type { EndgameDictionary, EndgameDrops, EndgameFoe } from "../endgame-types";
import { grandCrossModule } from "../grand-cross";

function foe(monster: string, level = 100, extra?: string[]): EndgameFoe {
  return {
    monster,
    level,
    multipliers: { atk: 100, def: 100, hp: 100 },
    estimate: null,
    ...(extra ? { extraPassives: extra } : {}),
  };
}

describe("formati", () => {
  it("il peso di un drop e' su 10.000 per estrazione", () => {
    expect(dropChance({ weight: 50 })).toBe(0.5);
    expect(dropChance({ weight: 4000 })).toBe(40);
  });

  it("le percentuali tengono al massimo due decimali, nella lingua di chi legge", () => {
    expect(formatPercent(0.5, "it")).toBe("0,5%");
    expect(formatPercent(0.5, "en")).toBe("0.5%");
    expect(formatPercent(100 / 6, "it")).toBe("16,67%");
  });

  it("un moltiplicatore si scrive col per, non come aumento", () => {
    expect(formatMultiplier(250, "it")).toBe("×2,5");
    expect(formatMultiplier(1200, "en")).toBe("×12");
  });

  it("una stima non mostra piu' di tre cifre significative, anche in italiano", () => {
    // L'italiano non abbrevia le migliaia: senza l'arrotondamento resterebbe 370.875.
    expect(formatCompact(370875, "it")).toBe("371.000");
    expect(formatCompact(370875, "en")).toBe("371K");
    expect(formatCompact(11028000, "en")).toBe("11M");
  });
});

describe("la difficolta' nell'indirizzo", () => {
  const values = [1, 2, 3, 4];

  it("senza scelta parte dalla piu' alta", () => {
    expect(chosenLevel({}, "red-demon", values)).toBe(3);
  });

  it("prende quella dell'indirizzo se esiste, e ignora le altre", () => {
    expect(chosenLevel({ "red-demon": "2" }, "red-demon", values)).toBe(1);
    expect(chosenLevel({ "red-demon": "9" }, "red-demon", values)).toBe(3);
    expect(chosenLevel({ "red-demon": ["1", "3"] }, "red-demon", values)).toBe(0);
  });

  it("il collegamento cambia una scelta e tiene le altre, con l'ancora del boss", () => {
    const href = levelHref({ "gray-demon": "2", "red-demon": "4" }, "red-demon", 1, "red-demon");
    expect(href).toBe("?gray-demon=2&red-demon=1#red-demon");
  });
});

describe("countFoes", () => {
  it("conta i nemici uguali e tiene l'ordine della prima comparsa", () => {
    const counted = countFoes([foe("a"), foe("b"), foe("a"), foe("a", 100, ["p1"])]);
    expect(counted.map((entry) => [entry.foe.monster, entry.count])).toEqual([
      ["a", 2],
      ["b", 1],
      ["a", 1],
    ]);
  });

  it("lo stesso mostro a un livello diverso e' un altro nemico", () => {
    expect(countFoes([foe("a", 100), foe("a", 200)])).toHaveLength(2);
  });
});

/* -------------------------------------------------------- dati veri -- */

const { deathMatch, creatureNest, demonKing, supremeDeity, endgameHeroes, roster } = grandCrossModule;
const rosterIds = new Set((roster?.heroes ?? []).map((hero) => hero.id));

/** Ogni mostro, passiva e oggetto citati esistono nel dizionario della modalita'. */
function checkFoe(dict: EndgameDictionary, entry: EndgameFoe) {
  const monster = dict.monsters[entry.monster];
  expect(monster, `mostro ${entry.monster}`).toBeDefined();
  for (const id of monster?.passives ?? []) expect(dict.passives[id], `passiva ${id}`).toBeDefined();
  for (const id of entry.extraPassives ?? []) expect(dict.passives[id], `passiva ${id}`).toBeDefined();
  // Una stima c'e' solo dove ha senso: i mostri di contorno con PS 1 non ne hanno.
  if (entry.estimate) expect(entry.estimate.hp).toBeGreaterThan(100);
  expect(entry.level).toBeGreaterThan(0);
}

function checkDrops(dict: EndgameDictionary, drops: EndgameDrops, where: string) {
  expect(drops.draws, where).toBeGreaterThan(0);
  expect(dropWeightTotal(drops), where).toBe(10000);
  for (const entry of drops.entries) {
    if (entry.id) expect(dict.items[entry.id], `${where}: oggetto ${entry.id}`).toBeDefined();
    else expect(entry.byRegion, `${where}: voce senza oggetto`).toBeDefined();
    for (const id of Object.values(entry.byRegion ?? {})) expect(dict.items[id]).toBeDefined();
  }
}

function checkHeroes(ids: readonly string[]) {
  for (const id of ids) expect(rosterIds.has(id), `eroe ${id}`).toBe(true);
}

describe("i dati di Grand Cross", () => {
  it("le quattro modalita' ci sono, e la barra laterale le mostra nel gruppo Endgame", () => {
    expect(deathMatch && creatureNest && demonKing && supremeDeity).toBeTruthy();
    const endgame = gameGroups("grand-cross").find((group) => group.label === "Endgame");
    expect(endgame?.items.map((item) => item.path)).toEqual([
      "/scontri-finali",
      "/bestie-demoniache",
      "/re-demone",
      "/divinita-suprema",
    ]);
  });

  it("Scontri finali: riferimenti, drop, eroi, difficolta' distinte", () => {
    const data = deathMatch!;
    expect(data.bosses.length).toBeGreaterThan(0);
    for (const boss of data.bosses) {
      const levels = boss.difficulties.map((level) => level.level);
      expect(new Set(levels).size, boss.key).toBe(levels.length);
      for (const region of boss.regions) expect(data.regions[region], `${boss.key}: regione ${region}`).toBeDefined();
      for (const level of boss.difficulties) {
        for (const phase of level.phases) checkFoe(data, phase.foe);
        checkDrops(data, level.drops, `${boss.key} ${level.level}`);
        checkDrops(data, level.leader, `${boss.key} ${level.level} leader`);
        for (const amount of level.guaranteed) expect(data.items[amount.id]).toBeDefined();
        checkHeroes(level.bannedHeroes);
      }
      checkHeroes(boss.aiTeam?.heroes ?? []);
      for (const set of boss.costumeSets) checkHeroes(set.heroes);
      for (const id of boss.artifactSet?.levels ?? []) expect(data.passives[id]).toBeDefined();
    }
    checkHeroes([...data.heroesOnly, ...data.heroesExcluded].map((entry) => entry.heroId));
  });

  it("Scontri finali: solo i boss fissi, niente Lamek d'evento", () => {
    // Scelta dell'utente (26/09): Lamek e' un evento e non sta coi sei fissi.
    const bosses = deathMatch!.bosses;
    expect(bosses.map((boss) => boss.key)).not.toContain("lamech");
    for (const boss of bosses) expect([1, 2, 3]).toContain(boss.stars);
  });

  it("Scontri finali: una guida copiata da un altro boss non finisce sotto il boss sbagliato", () => {
    // Nel client Indura ha la guida di Bellmoth; l'import la toglie.
    const indura = deathMatch!.bosses.find((boss) => boss.key === "demon-indura-baruja");
    const guide = indura?.guide.map((line) => line.en ?? "").join(" ") ?? "";
    expect(guide).not.toMatch(/Bellmoth/);
  });

  it("Bestie demoniache: riferimenti, drop, eroi", () => {
    const data = creatureNest!;
    for (const beast of data.beasts) {
      const floors = beast.floors.map((floor) => floor.floor);
      expect(new Set(floors).size, beast.key).toBe(floors.length);
      for (const floor of beast.floors) {
        for (const phase of floor.phases) {
          for (const entry of phase.foes) checkFoe(data, entry);
          for (const id of phase.randomPassives) expect(data.passives[id]).toBeDefined();
        }
        checkDrops(data, floor.drops, `${beast.key} ${floor.floor}`);
      }
      checkHeroes(beast.relics.flatMap((relic) => relic.heroes));
      checkHeroes(beast.heroesOnly.map((entry) => entry.heroId));
      checkHeroes(beast.badBlood);
    }
  });

  it("Bestie demoniache: ogni bestia delle Reliquie sacre porta a una sezione della pagina", () => {
    const groups = new Set(creatureNest!.beasts.map((beast) => beast.group));
    for (const group of Object.keys(grandCrossModule.heroRelics?.beasts ?? {})) {
      expect(groups.has(group), `bestia ${group}`).toBe(true);
    }
  });

  it("Re Demone: ogni sequenza e' di tre richieste, e i passi del Verdetto esistono", () => {
    const data = demonKing!;
    for (const level of data.difficulties) {
      for (const phase of level.phases) {
        checkFoe(data, phase.foe);
        for (const sequence of phase.rules?.sequences ?? []) {
          expect(sequence).toHaveLength(3);
          for (const step of sequence) expect(step.length).toBeGreaterThan(0);
        }
      }
      expect(level.verdict.length).toBeGreaterThan(0);
      for (const step of level.verdict) expect(data.passives[step.passive]).toBeDefined();
      checkDrops(data, level.drops, `re demone ${level.level}`);
    }
    for (const box of Object.values(data.boxes)) for (const entry of box) expect(data.items[entry.id ?? ""]).toBeDefined();
    checkHeroes(data.banned);
  });

  it("Divinita' Suprema: Giudizi, finale per soglie, nascosto solo dove il client lo apre", () => {
    const data = supremeDeity!;
    for (const level of data.difficulties) {
      const groups = [
        ...level.judgments.map((judgment) => judgment.group),
        ...level.final.flatMap((step) => step.groups),
        ...(level.hidden?.groups ?? []),
      ];
      for (const group of groups) {
        for (const entry of group.foes) checkFoe(data, entry);
        for (const id of group.teamPassives) expect(data.passives[id]).toBeDefined();
      }
      // Le soglie del finale e degli Editti salgono e finiscono al 100%.
      const thresholds = level.final.map((step) => step.upTo);
      expect([...thresholds].sort((a, b) => a - b)).toEqual(thresholds);
      expect(thresholds.at(-1)).toBe(100);
      expect(level.edicts.map((step) => step.upTo)).toEqual(thresholds);
      checkDrops(data, level.drops, `divinita' ${level.level}`);
    }
    for (const curse of data.curses) expect(data.passives[curse.passive]).toBeDefined();
    checkHeroes(data.banned);
  });

  it("i legami della scheda eroe portano a eroi, boss e bestie che esistono", () => {
    const targets = new Set([
      ...(deathMatch?.bosses.map((boss) => boss.key) ?? []),
      ...(creatureNest?.beasts.map((beast) => beast.key) ?? []),
    ]);
    const links = Object.entries(endgameHeroes ?? {});
    expect(links.length).toBeGreaterThan(0);
    for (const [heroId, list] of links) {
      expect(rosterIds.has(heroId), `eroe ${heroId}`).toBe(true);
      for (const link of list) {
        if (link.target) expect(targets.has(link.target.key), `${heroId}: ${link.target.key}`).toBe(true);
        if (link.kind === "only" || link.kind === "excluded") expect(link.passive).toBeDefined();
      }
    }
  });
});
