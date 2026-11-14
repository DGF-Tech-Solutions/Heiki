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
import { formatPercent, numberLines, otherStatsLine, TESTI } from "@/components/team-builder/team-labels";
import {
  analyzeTeam,
  emptySetup,
  parseSetup,
  plainSum,
  relicOf,
  sentencesOf,
  setupToQuery,
  suggest,
  teamHeroesOf,
  teamTotals,
  textAt,
  totalValue,
  ultimateOf,
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
  it("a squadra vuota non si consiglia nessuno: non ci sono compagni da guardare", () => {
    // fino al 07/11 Chandler prendeva +4 da solo: «tutti gli alleati sono applicabili» e' vero se c'e' solo lui
    expect(suggest(team([]), 0, [...heroes.values()], data)).toEqual([]);
  });

  it("una condizione «tutti» conta come rispettata solo a squadra piena, ma si puo' rompere prima", () => {
    const CHANDLER = "1911501";
    expect(analyzeTeam(team([CHANDLER]), data).allMet).toBe(0);
    expect(analyzeTeam(team([CHANDLER]), data).fieldFull).toBe(false);
    expect(analyzeTeam(team([CHANDLER, KING]), data).allBroken).toBeGreaterThan(0);
  });

  it("per il posto libero accanto a King e Diane ogni consiglio dice cosa cambia", () => {
    const setup = team([KING, DIANE]);
    const list = suggest(setup, 2, [...heroes.values()], data);
    expect(list.length).toBeGreaterThan(0);
    for (const s of list) {
      const brings = s.lights.length + s.boosts.length + s.gives.length + s.wakes.length + s.receives.length;
      expect(brings).toBeGreaterThan(s.breaks.length);
      // i motivi hanno sempre le frasi del gioco dietro
      for (const c of [...s.lights, ...s.boosts, ...s.gives, ...s.wakes, ...s.receives, ...s.breaks]) {
        expect(c.sentences.length).toBeGreaterThan(0);
      }
    }
    // chi sta in cima si scambia passive con King e Diane: ne riceve da tutti e due
    const top = list[0]!;
    expect(new Set(top.receives.map((c) => c.hero))).toEqual(new Set([KING, DIANE]));
    // nessun personaggio gia' in squadra
    expect(list.some((s) => heroes.get(s.hero)!.group === heroes.get(KING)!.group)).toBe(false);
    // un personaggio una volta sola, nella versione che porta di piu'
    const groups = list.map((s) => heroes.get(s.hero)!.group);
    expect(new Set(groups).size).toBe(groups.length);
  });
});

describe("il totale dei numeri", () => {
  const DERIERI = "1575001"; // Demone e Comandamento: alleata applicabile di Meliodas Nemesi
  const KING_ELAINE = "1866503"; // «For each ally ... basic stats +7%, damage dealt +10%»
  const JOKER = "2011501"; // «For each Applicable Ally ... basic stats +6%, Max HP +5%»
  const totals = (mains: (string | null)[], more: Partial<TeamSetup> = {}) => teamTotals(team(mains, more), data);
  const row = (all: ReturnType<typeof totals>, id: string) => all.heroes.find((h) => h.hero === id);

  it("conta per ognuno, e ognuno comprende l'eroe (Meliodas Nemesi, 15% e 7% per ogni applicabile)", () => {
    const all = totals([MELIODAS_NEMESI, DERIERI]);
    // 15 e 7 stanno sulla stessa riga (701661), ma in due colonne: si moltiplicano.
    // Fino all'11/11 qui si chiedeva la somma (29): la battaglia di Escanor ha detto di no
    expect(totalValue(row(all, MELIODAS_NEMESI), "atk")).toBeCloseTo((1.15 * 1.14 - 1) * 100, 1);
    expect(totalValue(row(all, MELIODAS_NEMESI), "crit_per")).toBe(14); // solo «all stats»
    expect(totalValue(row(all, DERIERI), "atk")).toBe(15);
    expect(totalValue(row(all, DERIERI), "crit_per")).toBe(0);
  });

  it("su Attacco, Difesa e PS le parole chiave diverse si moltiplicano; i danni si sommano", () => {
    const all = totals([MELIODAS_NEMESI, DERIERI, KING_ELAINE, JOKER]);
    const nemesi = row(all, MELIODAS_NEMESI);
    // Nemesi (1 + 0,15) x (1 + 0,07 x 4), King (1 + 0,07 x 4), Joker (1 + 0,06 x 3)
    expect(totalValue(nemesi, "atk")).toBeCloseTo((1.15 * 1.28 * 1.28 * 1.18 - 1) * 100, 0);
    // i PS di Joker sono 6% e 5% sulla stessa riga, in due colonne: si moltiplicano anche loro
    expect(totalValue(nemesi, "hp")).toBeCloseTo((1.15 * 1.28 * 1.28 * 1.18 * 1.15 - 1) * 100, 0);
    expect(totalValue(nemesi, "dmg")).toBe(40); // 10 x 4
  });

  it("una battaglia vera dell'utente (11/11): Yeon Yihwa, Escanor «Luce del sole», Priscilla, Sigurd in panchina", () => {
    // Cavalieri ribelli, senza associati e senza artefatti. Il rapporto fra la finestra degli
    // effetti al primo turno e la schermata della squadra, eroe per eroe:
    // Yeon Yihwa 18.324 / 10.758, 17.132 / 10.058, 333.902 / 196.024 (x1,7033 tutte e tre)
    // Escanor 20.917 / 12.956, 362.621 / 224.602 (x1,6145); Priscilla 22.840 / 15.420 (x1,4812)
    const YEON = "1970501";
    const ESCANOR = "1475002";
    const PRISCILLA = "1999501";
    const all = totals([YEON, ESCANOR, PRISCILLA, "1895502"], { bench: true, ultimate: 1 });
    // quattro Uniche, quattro parole chiave: 1,15 x 1,12 x 1,15 x 1,15. Sigurd da' dalla panchina
    // e non conta fra chi partecipa (x3, non x4)
    for (const stat of ["atk", "def", "hp"] as const) expect(totalValue(row(all, YEON), stat)).toBeCloseTo((18324 / 10758 - 1) * 100, 0);
    expect(totalValue(row(all, PRISCILLA), "def")).toBeCloseTo((20982 / 14166 - 1) * 100, 0);
    // la riga 701680 di Escanor: 4 agli alleati e 3 (sub_value) a lui, che si moltiplicano.
    // Sommati sarebbero +60,0%, il gioco fa +61,45%
    expect(totalValue(row(all, ESCANOR), "def")).toBeCloseTo((20917 / 12956 - 1) * 100, 0);
    expect(totalValue(row(all, ESCANOR), "hp")).toBeCloseTo((362621 / 224602 - 1) * 100, 0);
    // l'Attacco di Escanor (55.850 / 19.845) no: lo alzano anche la Reliquia (meta' della Difesa)
    // e la Fiamma eterna sui nemici, che il totale non conta
  });

  it("«alleati» comprende l'eroe, come DistributePassive; «other than the hero» no", () => {
    const giver = "1876503"; // «Increases allies' Defense by 50%»
    expect(totalValue(row(totals([giver]), giver), "def")).toBeGreaterThanOrEqual(50);
    const other = "1695003"; // «...by 15% for each Human ally other than the hero...»
    const human = [...heroes.values()].find((h) => h.race === 3 && h.group !== heroes.get(other)!.group)!;
    const alone = row(totals([other]), other)!.totals.find((t) => t.key === "atk");
    expect(alone?.parts.some((p) => p.count > 0 && TEAM.sentences[p.sentence]!.en!.includes("other than the hero")) ?? false).toBe(false);
    const pair = row(totals([other, human.id]), other)!.totals.find((t) => t.key === "atk")!;
    const part = pair.parts.find((p) => TEAM.sentences[p.sentence]!.en!.includes("other than the hero"))!;
    expect(part.count).toBe(1);
    expect(part.value).toBe(15);
  });

  it("quello che dipende dalla battaglia si mostra e non si somma", () => {
    // la reliquia di King: «+15% danni inflitti, poi +15% agli alleati protetti dalla barriera»
    const alone = row(totals([KING_ELAINE]), KING_ELAINE)!;
    expect(totalValue(alone, "dmg")).toBe(25); // 15 della reliquia + 10 x 1
    expect(totalValue(alone, "atk")).toBe(7); // niente 15% della barriera
    const sentences = alone.sometimes.map((s) => TEAM.sentences[s.sentence]!.en!);
    expect(sentences.some((s) => s.includes("protected by the hero's barrier"))).toBe(true);
  });

  it("segue dove si gioca, le reliquie e la panchina", () => {
    const pvp = "1144002"; // «Increases allies' Defense-related stats by 30% in PVP»
    expect(totalValue(row(totals([pvp], { content: "pvp" }), pvp), "def")).toBeGreaterThanOrEqual(30);
    expect(totalValue(row(totals([pvp]), pvp), "def")).toBeLessThan(30);

    const withRelic = totals([JOKER, MELIODAS_NEMESI]);
    const withoutRelic = totals([JOKER, MELIODAS_NEMESI], { relics: false });
    expect(totalValue(row(withRelic, JOKER), "dmg_taken")).toBe(-40); // 20 x 2
    expect(totalValue(row(withoutRelic, JOKER), "dmg_taken")).toBe(0);

    // in panchina non riceve e non da': Joker e' il quarto
    const bench = totals([MELIODAS_NEMESI, DERIERI, null, JOKER], { bench: true });
    expect(row(bench, JOKER)).toBeUndefined();
    expect(totalValue(row(bench, DERIERI), "dmg_taken")).toBe(0);
  });

  it("i consigli dicono quanto cambiano i numeri, e chi porta di piu' viene prima a parita' di passive", () => {
    const setup = team([MELIODAS_NEMESI, DERIERI]);
    const list = suggest(setup, 2, [...heroes.values()], data, 40);
    const joker = list.find((s) => s.hero === JOKER)!;
    expect(joker.numbers.some((n) => n.hero === MELIODAS_NEMESI && n.key === "dmg_taken" && n.delta === -60)).toBe(true);
    const sameFirstKey = list.filter((s) => s.lights.length + s.boosts.length - s.breaks.length === 1);
    for (let i = 1; i < sameFirstKey.length; i++) {
      expect(sameFirstKey[i - 1]!.numbersSum).toBeGreaterThanOrEqual(sameFirstKey[i]!.numbersSum);
    }
  });

  it("le riduzioni dei danni subiti contano fino a -80% nella somma", () => {
    const hero = (value: number) => ({ hero: "x", sometimes: [], totals: [{ key: "dmg_taken" as const, value, parts: [] }] });
    expect(plainSum([hero(-50)])).toBe(50);
    expect(plainSum([hero(-160)])).toBe(80);
    expect(plainSum([hero(20)])).toBe(-20);
  });

  it("i dati: ogni effetto sa a chi va, e i numeri che valgono sempre sono pochi per frase", () => {
    let effects = 0;
    for (const text of TEAM.texts) {
      for (const line of text.numbers ?? []) {
        expect(TEAM.sentences[line.sentence]).toBeTruthy();
        for (const effect of line.effects) {
          effects++;
          expect(effect.stats.length).toBeGreaterThan(0);
          expect(Number.isFinite(effect.value)).toBe(true);
          if (effect.to === "team") expect(effect.who?.length).toBeGreaterThan(0);
          else expect(effect.who).toBeUndefined();
        }
      }
    }
    expect(effects).toBeGreaterThan(1000);
  });
});

describe("le parole dei numeri", () => {
  const t = TESTI.it;

  it("scrive le percentuali con la virgola e il meno vero", () => {
    expect(formatPercent(15, "it")).toBe("+15%");
    expect(formatPercent(-7.5, "it")).toBe("−7,5%");
    expect(formatPercent(0, "it")).toBe("0%");
    expect(formatPercent(7.5, "en")).toBe("+7.5%");
  });

  it("una riga per eroe, coi gruppi del gioco, e lui per ultimo", () => {
    const lines = numberLines(
      [
        { hero: "a", key: "atk", delta: 10 },
        { hero: "a", key: "def", delta: 10 },
        { hero: "a", key: "hp", delta: 10 },
        { hero: "a", key: "crit_per", delta: 10 },
        { hero: "b", key: "dmg_taken", delta: -30 },
        { hero: "b", key: "dmg", delta: -5 },
      ],
      "a",
      t,
      "it",
    );
    expect(lines.map((l) => l.hero)).toEqual(["b", "a"]);
    expect(lines[1]!.parts).toEqual([{ text: "Statistiche di base +10%", bad: false }]);
    expect(lines[0]!.parts).toEqual([
      { text: "Danni subiti −30%", bad: false },
      { text: "Danni inflitti −5%", bad: true },
    ]);
  });

  it("le altre statistiche uguali stanno insieme", () => {
    const others = ["fixed_atk_per", "crit_per", "crit_atk_per", "fixed_def_per", "crit_res_per", "crit_def_per", "hp_regen_per", "hp_recovery_per", "hp_steal_per"] as const;
    expect(otherStatsLine(others.map((key) => ({ key, value: 28 })), t, "it")).toBe("Tutte le altre statistiche +28%");
    expect(otherStatsLine([{ key: "crit_per", value: 10 }, { key: "dmg:single", value: 5 }], t, "it")).toBe(
      "Possibilità critico +10% · Danni inflitti con attacchi a bersaglio singolo +5%",
    );
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
      enemies: 2,
    };
    const params = new URLSearchParams(setupToQuery(setup));
    expect(parseSetup((k) => params.get(k), known)).toEqual(setup);
  });

  it("la partenza non scrive niente, e i valori senza senso tornano alla partenza", () => {
    expect(setupToQuery(emptySetup())).toBe("");
    const junk = new URLSearchParams("s=abc.1095001.99999999&c=arena&u=9&p=x&r=2&n=9");
    const setup = parseSetup((k) => junk.get(k), known);
    expect(setup.mains).toEqual([null, KING, null, null]);
    expect(setup.content).toBe("pve");
    expect(setup.ultimate).toBe(6);
    expect(setup.bench).toBe(true);
    expect(setup.relics).toBe(true);
    expect(setup.enemies).toBe(3);
  });

  it("il rango e la Reliquia del box valgono per quell'eroe, e non finiscono nell'indirizzo", () => {
    const setup: TeamSetup = { ...emptySetup(), ultimate: 6, relics: true, byHero: { [KING]: { ultimate: 2, relic: false } } };
    expect(ultimateOf(setup, KING)).toBe(2);
    expect(relicOf(setup, KING)).toBe(false);
    expect(ultimateOf(setup, DIANE)).toBe(6);
    expect(relicOf(setup, DIANE)).toBe(true);
    expect(setupToQuery(setup)).toBe("");
  });
});
