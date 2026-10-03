/**
 * La squadra: le frasi si dividono come le divide la pipeline, e una squadra si
 * valuta come dicono i testi del gioco. Si prova sui dati veri, con squadre di
 * cui si sa cosa deve uscire: King Re delle Fate da' le statistiche alle Fate e
 * ai Giganti, la sua condizione «tutti applicabili» la rompe un Demone, Eren
 * Jaeger conta anche come Gigante, due Comandamenti non valgono insieme, una
 * passiva solo PvP si spegne fuori dal PvP, e cosi' via.
 */

import { describe, expect, it } from "vitest";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HERO_SPECIALS } from "../grand-cross/hero-specials.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { TEAM } from "../grand-cross/team.generated";
import {
  analyzeTeam,
  emptySetup,
  parseSetup,
  sentencesOf,
  setupToQuery,
  suggest,
  synergyScore,
  teamHeroesOf,
  textAt,
  type TeamData,
  type TeamSetup,
} from "../team";

const heroes = teamHeroesOf(HEROES, HERO_CONTEXT, HERO_SPECIALS);
const data: TeamData = { team: TEAM, heroes };

const KING = "1095001"; // Fata, Unica per «alleati applicabili: Fate e Giganti»
const DIANE = "1045003"; // Gigante, «Increases Giant allies' damage dealt by 40%»
const ELAINE_LIKE = "2006501"; // Tioreh, Fata
const MELIODAS_NEMESI = "2007501"; // Demone
const EREN = "1937501"; // Umano, «the additional race Giant»
const GOWTHER = "1115001"; // «if allies in battle are all from different races»

function team(mains: (string | null)[], more: Partial<TeamSetup> = {}): TeamSetup {
  return { ...emptySetup(), bench: false, ...more, mains: [...mains, null, null, null, null].slice(0, 4) };
}

function member(analysis: ReturnType<typeof analyzeTeam>, id: string) {
  const found = analysis.members.find((m) => m.hero === id);
  if (!found) throw new Error(`manca ${id}`);
  return found;
}

describe("le frasi", () => {
  it("divide come la pipeline: note intere, parentesi attaccate, a capo che non chiude", () => {
    const text =
      "Increases [00D5FF]allies'[-] basic stats by [FFAE00]6%[-], up to\\n30% whenever the hero heals an ally. " +
      "Fills the gauge.\\n(Limit 5 times. Resets.)\\n[i][C0C0C0]※Applicable Allies: Fairies and Giants[-][/i]";
    expect(sentencesOf(text)).toEqual([
      { note: false, text: "Increases allies' basic stats by 6%, up to 30% whenever the hero heals an ally." },
      { note: false, text: "Fills the gauge. (Limit 5 times. Resets.)" },
      { note: true, text: "※Applicable Allies: Fairies and Giants" },
    ]);
  });

  it("una nota a meta' riga va a capo, come in parole_blu.py", () => {
    expect(sentencesOf("Ends at the turn's end.※Revenge: Immune to Debuffs.").map((s) => s.note)).toEqual([false, true]);
  });

  it("ogni frase letta e' nell'indice e ha una lettura", () => {
    for (const text of TEAM.texts) {
      for (const link of text.links) {
        expect(TEAM.sentences[link.sentence]?.en).toBeTruthy();
        expect(link.receives?.length || link.conditions?.length || link.extraRaces?.length || link.fromBench).toBeTruthy();
      }
    }
  });

  it("i passi delle passive cominciano dal rango 1 e salgono", () => {
    for (const sources of Object.values(TEAM.heroes)) {
      for (const source of sources) {
        expect(source.steps[0]?.[0]).toBe(1);
        const ranks = source.steps.map(([rank]) => rank);
        expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);
      }
    }
  });
});

describe("chi da' a chi", () => {
  it("King Re delle Fate da' alle Fate e ai Giganti, non al Demone", () => {
    const analysis = analyzeTeam(team([KING, DIANE, ELAINE_LIKE, MELIODAS_NEMESI]), data);
    const fromKing = analysis.gives.filter((g) => g.from === KING).map((g) => g.to);
    expect(fromKing).toContain(DIANE);
    expect(fromKing).toContain(ELAINE_LIKE);
    expect(fromKing).not.toContain(MELIODAS_NEMESI);
  });

  it("la condizione «tutti applicabili» la rompe il Demone, e la rispetta un Gigante", () => {
    const withDemon = member(analyzeTeam(team([KING, DIANE, ELAINE_LIKE, MELIODAS_NEMESI]), data), KING);
    const allRule = withDemon.sources[0]!.links.find((l) => l.conditions.some((c) => c.condition.kind === "all"))!;
    expect(allRule.active).toBe(false);
    expect(allRule.off).toBe("condition");
    expect(allRule.conditions[0]!.members.find((m) => m.hero === MELIODAS_NEMESI)?.ok).toBe(false);

    const withGiant = member(analyzeTeam(team([KING, DIANE, ELAINE_LIKE, "1545003"]), data), KING);
    expect(withGiant.sources[0]!.links.find((l) => l === allRule || l.link === allRule.link)?.active).toBe(true);
  });

  it("Eren Jaeger conta anche come Gigante, e riceve la passiva dei Giganti di Diane", () => {
    const analysis = analyzeTeam(team([DIANE, EREN]), data);
    expect(member(analysis, EREN).races).toEqual([2, 3]);
    expect(analysis.gives.some((g) => g.from === DIANE && g.to === EREN)).toBe(true);
  });

  it("razze tutte diverse: Gowther la vede rispettata, e rotta da due Giganti", () => {
    const diverse = member(analyzeTeam(team([GOWTHER, KING, DIANE, MELIODAS_NEMESI]), data), GOWTHER);
    const rule = (m: typeof diverse) =>
      m.sources[0]!.links.find((l) => l.conditions.some((c) => c.condition.who.differentRaces))!;
    expect(rule(diverse).active).toBe(true);
    const doubled = member(analyzeTeam(team([GOWTHER, KING, DIANE, "1545003"]), data), GOWTHER);
    expect(rule(doubled).active).toBe(false);
  });
});

describe("quando una passiva si spegne", () => {
  it("due Comandamenti: vale quello dell'eroe piu' a sinistra", () => {
    // nel PvP, dove valgono tutti e due (quello di Derieri vale solo li')
    const analysis = analyzeTeam(team(["1505001", "1575001"], { content: "pvp" }), data);
    const left = member(analysis, "1505001").sources.find((s) => s.source.special === "comandamento")!;
    const right = member(analysis, "1575001").sources.find((s) => s.source.special === "comandamento")!;
    expect(left.active).toBe(true);
    expect(right.off).toBe("leftmost");
    expect(right.by).toBe("1505001");
    expect(analysis.leftmostOff).toBe(1);
  });

  it("una passiva solo PvP si spegne fuori dal PvP", () => {
    const id = Object.entries(HERO_CONTEXT.heroes).find(([, c]) => c.passiveConditions?.includes(3))![0];
    const pve = member(analyzeTeam(team([id]), data), id).sources.find((s) => s.source.kind === "unique")!;
    const pvp = member(analyzeTeam(team([id], { content: "pvp" }), data), id).sources.find((s) => s.source.kind === "unique")!;
    expect(pve.off).toBe("content");
    expect(pvp.active).toBe(true);
  });

  it("in panchina aspetta, tranne le passive che valgono anche nello slot secondario", () => {
    const sub = Object.entries(HERO_CONTEXT.heroes).find(([, c]) => c.passiveConditions?.includes(2))![0];
    const start = Object.entries(HERO_CONTEXT.heroes).find(([, c]) => !c.passiveConditions?.includes(2))![0];
    const onBench = (id: string) =>
      member(analyzeTeam(team([KING, DIANE, ELAINE_LIKE, id], { bench: true }), data), id).sources.find(
        (s) => s.source.kind === "unique",
      )!;
    expect(onBench(sub).active).toBe(true);
    expect(onBench(start).off).toBe("bench");
  });

  it("chi e' in panchina non riceve e non conta per le condizioni dei compagni", () => {
    const analysis = analyzeTeam(team([KING, DIANE, ELAINE_LIKE, "1545003"], { bench: true }), data);
    expect(analysis.gives.some((g) => g.to === "1545003")).toBe(false);
  });

  it("le reliquie si possono spegnere", () => {
    const analysis = analyzeTeam(team([KING], { relics: false }), data);
    expect(member(analysis, KING).sources.find((s) => s.source.kind === "relic")?.off).toBe("relics");
  });
});

describe("il rango della Mossa finale", () => {
  it("sceglie il testo dell'ultimo passo raggiunto", () => {
    const source = { kind: "unique", id: "x", name: { it: null, en: null }, conditions: [], steps: [[1, 4], [3, 9]] } as const;
    expect(textAt(source, 1)).toBe(4);
    expect(textAt(source, 2)).toBe(4);
    expect(textAt(source, 6)).toBe(9);
  });
});

describe("i suggerimenti", () => {
  it("per il posto libero accanto a King e Diane vengono Fate e Giganti, con un guadagno", () => {
    const setup = team([KING, DIANE]);
    const list = suggest(setup, 2, [...heroes.values()], data);
    expect(list.length).toBeGreaterThan(0);
    for (const s of list) expect(s.gain).toBeGreaterThan(0);
    const top = heroes.get(list[0]!.hero)!;
    expect(top.race === 2 || top.race === 4 || synergyScore(analyzeTeam({ ...setup, mains: [KING, DIANE, top.id, null] }, data)) > 0).toBe(true);
    // nessun personaggio gia' in squadra
    expect(list.some((s) => heroes.get(s.hero)!.group === heroes.get(KING)!.group)).toBe(false);
    // un personaggio una volta sola, nella versione che porta di piu'
    const groups = list.map((s) => heroes.get(s.hero)!.group);
    expect(new Set(groups).size).toBe(groups.length);
  });
});

describe("l'indirizzo", () => {
  const known = (id: string) => heroes.has(id);

  it("va e torna", () => {
    const setup: TeamSetup = {
      mains: [KING, null, DIANE, ELAINE_LIKE],
      associates: [null, EREN, null, null],
      content: "pvp",
      bench: false,
      ultimate: 3,
      relics: false,
    };
    const params = new URLSearchParams(setupToQuery(setup));
    expect(parseSetup((k) => params.get(k), known)).toEqual(setup);
  });

  it("la partenza non scrive niente, e i valori senza senso tornano alla partenza", () => {
    expect(setupToQuery(emptySetup())).toBe("");
    const junk = new URLSearchParams("s=abc.1095001.99999999&c=arena&u=9&p=x&r=2");
    const setup = parseSetup((k) => junk.get(k), known);
    expect(setup.mains).toEqual([null, KING, null, null]);
    expect(setup.content).toBe("pve");
    expect(setup.ultimate).toBe(6);
    expect(setup.bench).toBe(true);
    expect(setup.relics).toBe(true);
  });
});
