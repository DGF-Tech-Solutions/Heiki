/**
 * Test delle strategie dell'Endgame: il modello di ogni modalita' letto dai dati
 * veri di Grand Cross, e il controllo di una bozza (`checkStrategy`), che e' il
 * confine fra quello che scrive il browser e quello che finisce nel database.
 *
 * Le squadre si scelgono dai dati (eroi con l'attributo giusto, personaggi
 * diversi) e non per id scritti a mano: una patch che aggiunge eroi non deve
 * rompere i test.
 */

import { describe, expect, it } from "vitest";
import { grandCrossModule as gc } from "@/lib/games/grand-cross";
import type { HeroEntry } from "@/lib/games/types";
import {
  autoTitle,
  checkStrategy,
  findLevel,
  findTarget,
  heroAttributes,
  heroBlock,
  newStrategyHref,
  selectionFromParams,
  selectionLabel,
  selectionPageHref,
  selectionQuery,
  setModes,
  strategyKind,
  targetsFor,
  type LevelSpec,
} from "../rules";
import { strategyTemplate } from "../template";
import { STRATEGY_LIMITS, STRATEGY_MODES, type StrategyDraft, type StrategySelection } from "../types";

const heroes = gc.roster!.heroes;
const affinities = gc.roster!.affinities;

/** Quattro eroi di personaggi diversi che possono entrare a quella difficolta', saltando quelli in `skip`. */
function teamFor(level: Pick<LevelSpec, "allowedAttributes" | "banned">, skip: ReadonlySet<string> = new Set()): HeroEntry[] {
  const picked: HeroEntry[] = [];
  const groups = new Set<string>();
  for (const hero of heroes) {
    if (picked.length === 4) break;
    if (skip.has(hero.group) || groups.has(hero.group)) continue;
    if (heroBlock({ id: hero.id, attributes: heroAttributes(hero, affinities) }, level)) continue;
    picked.push(hero);
    groups.add(hero.group);
  }
  return picked;
}

function draftFor(selection: StrategySelection, extra: Partial<StrategyDraft> = {}): StrategyDraft {
  const target = findTarget(gc, selection.mode, selection.target)!;
  const level = findLevel(target, selection)!;
  return {
    ...selection,
    team: teamFor(level).map((hero) => ({ hero: hero.id, associate: null })),
    artifactSet: null,
    title: "",
    notes: "",
    phases: level.phases.map(() => ""),
    ...extra,
  };
}

const RED_INFERNO: StrategySelection = { mode: "death-match", target: "red-demon", level: 4, transcendent: false };

describe("il modello delle modalita'", () => {
  it("ha tutte e quattro le modalita', con bersagli, difficolta' e fasi", () => {
    for (const mode of STRATEGY_MODES) {
      const targets = targetsFor(gc, mode);
      expect(targets.length, mode).toBeGreaterThan(0);
      for (const target of targets) {
        expect(target.levels.length, `${mode} ${target.key}`).toBeGreaterThan(0);
        for (const level of target.levels) expect(level.phases.length, `${mode} ${target.key}`).toBeGreaterThan(0);
      }
    }
  });

  it("le bestie hanno i piani normali e, dove c'e', il trascendente, senza livello", () => {
    for (const beast of gc.creatureNest!.beasts) {
      const target = findTarget(gc, "creature-nest", beast.key)!;
      const hasTranscendent = beast.floors.some((floor) => floor.transcendent);
      expect(target.levels.map((level) => level.transcendent)).toEqual(hasTranscendent ? [false, true] : [false]);
      expect(target.levels.every((level) => level.level === null)).toBe(true);
      // le fasi dei piani normali sono quelle del piano piu' duro
      const regular = beast.floors.filter((floor) => !floor.transcendent);
      expect(target.levels[0]!.phases.length).toBe(regular[regular.length - 1]!.phases.length);
    }
  });

  it("Re Demone e Divinita' hanno un bersaglio solo, con gli eroi esclusi della modalita'", () => {
    const king = targetsFor(gc, "demon-king");
    expect(king.map((target) => target.key)).toEqual([null]);
    expect(king[0]!.levels.every((level) => level.banned.length === gc.demonKing!.banned.length)).toBe(true);
    const deity = targetsFor(gc, "supreme-deity")[0]!;
    for (const [i, level] of deity.levels.entries()) {
      const data = gc.supremeDeity!.difficulties[i]!;
      // i quattro Giudizi, il finale e, dove c'e', quello nascosto
      expect(level.phases.length).toBe(data.judgments.length + 1 + (data.hidden ? 1 : 0));
      expect(level.banned.length).toBe(gc.supremeDeity!.banned.length);
    }
  });

  it("gli attributi ammessi degli Scontri finali arrivano al modello", () => {
    const level = findLevel(findTarget(gc, "death-match", "red-demon")!, RED_INFERNO)!;
    expect(level.allowedAttributes).toEqual(gc.deathMatch!.bosses.find((b) => b.key === "red-demon")!.difficulties.find((d) => d.level === 4)!.allowedAttributes);
  });

  it("Tristan vale come Luce e come Oscurita'", () => {
    expect(heroAttributes({ affinity: "Luce/Oscurita" }, affinities)).toEqual([4, 5]);
    expect(heroAttributes({ affinity: "Forza" }, affinities)).toEqual([1]);
  });
});

describe("i set di artefatti per modalita'", () => {
  it("un set solo PvP non vale in nessuna modalita', uno senza filtro ovunque", () => {
    expect(setModes({ filters: { contents: [2], races: [], factions: [], misc: [] } })).toEqual([]);
    expect(setModes({ filters: { contents: [], races: [], factions: [], misc: [] } })).toEqual([...STRATEGY_MODES]);
    expect(setModes({ filters: { contents: [4], races: [], factions: [], misc: [] } })).toEqual(["death-match"]);
    expect(setModes({ filters: { contents: [5], races: [], factions: [], misc: [] } })).not.toContain("death-match");
    expect(setModes({ filters: { contents: [8], races: [], factions: [], misc: [] } })).toEqual(["creature-nest"]);
  });
});

describe("checkStrategy", () => {
  it("accetta una squadra senza testo: e' un consiglio di squadra", () => {
    const result = checkStrategy(draftFor(RED_INFERNO), gc);
    expect(result.problem).toBeNull();
    expect(strategyKind(result.draft!)).toBe("team");
  });

  it("con note o fasi e' una guida, e serve un titolo", () => {
    const base = draftFor(RED_INFERNO);
    const phases = base.phases.map((_, i) => (i === 0 ? "Apri con la carta B." : ""));
    expect(checkStrategy({ ...base, phases }, gc).problem).toEqual({ code: "title-missing" });
    expect(checkStrategy({ ...base, phases, title: "Corto" }, gc).problem).toEqual({ code: "title-short" });
    const ok = checkStrategy({ ...base, phases, title: "Demone rosso a Inferno senza perdite" }, gc);
    expect(ok.problem).toBeNull();
    expect(strategyKind(ok.draft!)).toBe("guide");
  });

  it("un titolo senza testo non basta", () => {
    expect(checkStrategy({ ...draftFor(RED_INFERNO), title: "Solo un titolo qualunque" }, gc).problem).toEqual({ code: "title-only" });
  });

  it("le fasi mancanti si riempiono, quelle in piu' si respingono", () => {
    const base = draftFor(RED_INFERNO);
    const short = checkStrategy({ ...base, phases: [] }, gc);
    expect(short.draft?.phases.length).toBe(base.phases.length);
    expect(checkStrategy({ ...base, phases: [...base.phases, ""] }, gc).problem).toEqual({ code: "phases" });
    const long = "x".repeat(STRATEGY_LIMITS.phaseMax + 1);
    expect(checkStrategy({ ...base, title: "Una guida lunga abbastanza", phases: [long] }, gc).problem).toEqual({ code: "phase-long", phase: 0 });
  });

  it("respinge un attributo non ammesso, ma non per gli associati", () => {
    const level = findLevel(findTarget(gc, "death-match", "red-demon")!, RED_INFERNO)!;
    const allowed = level.allowedAttributes!;
    const base = draftFor(RED_INFERNO);
    const used = new Set(base.team.map((slot) => heroes.find((hero) => hero.id === slot.hero)!.group));
    const outsider = heroes.find(
      (hero) => !used.has(hero.group) && !heroAttributes(hero, affinities).some((code) => allowed.includes(code)),
    )!;
    const asHero = base.team.map((slot, i) => (i === 2 ? { hero: outsider.id, associate: null } : slot));
    expect(checkStrategy({ ...base, team: asHero }, gc).problem).toEqual({ code: "attribute", slot: 2 });
    const asAssociate = base.team.map((slot, i) => (i === 2 ? { ...slot, associate: outsider.id } : slot));
    expect(checkStrategy({ ...base, team: asAssociate }, gc).problem).toBeNull();
  });

  it("respinge gli eroi esclusi dal Re Demone", () => {
    const selection: StrategySelection = { mode: "demon-king", target: null, level: 4, transcendent: false };
    const base = draftFor(selection);
    const banned = heroes.find((hero) => hero.id === gc.demonKing!.banned[0])!;
    const team = base.team.map((slot, i) =>
      i === 0 && !base.team.some((other) => heroes.find((h) => h.id === other.hero)!.group === banned.group)
        ? { hero: banned.id, associate: null }
        : slot,
    );
    expect(checkStrategy({ ...base, team }, gc).problem).toEqual({ code: "banned", slot: 0 });
  });

  it("vuole otto personaggi diversi fra eroi e associati", () => {
    const base = draftFor(RED_INFERNO);
    const twin = heroes.find((hero) => hero.group === heroes.find((h) => h.id === base.team[0]!.hero)!.group && hero.id !== base.team[0]!.hero);
    const team = base.team.map((slot, i) => (i === 1 ? { ...slot, associate: base.team[0]!.hero } : slot));
    expect(checkStrategy({ ...base, team }, gc).problem).toEqual({ code: "duplicate", slot: 1 });
    if (twin) {
      const sameCharacter = base.team.map((slot, i) => (i === 3 ? { ...slot, associate: twin.id } : slot));
      expect(checkStrategy({ ...base, team: sameCharacter }, gc).problem).toEqual({ code: "duplicate", slot: 3 });
    }
  });

  it("respinge squadre incomplete, bersagli e difficolta' che non esistono", () => {
    const base = draftFor(RED_INFERNO);
    expect(checkStrategy({ ...base, team: base.team.slice(0, 3) }, gc).problem).toEqual({ code: "team-size" });
    expect(checkStrategy({ ...base, target: "lamech" }, gc).problem).toEqual({ code: "target" });
    expect(checkStrategy({ ...base, level: 9 }, gc).problem).toEqual({ code: "level" });
    expect(checkStrategy({ ...base, mode: "pvp" }, gc).problem).toEqual({ code: "mode" });
    expect(checkStrategy(null, gc).problem).toEqual({ code: "mode" });
    // una bestia senza trascendente non ha quella difficolta'
    const plain = gc.creatureNest!.beasts.find((beast) => !beast.floors.some((floor) => floor.transcendent))!;
    expect(
      checkStrategy({ ...draftFor({ mode: "creature-nest", target: plain.key, level: null, transcendent: false }), transcendent: true }, gc).problem,
    ).toEqual({ code: "level" });
  });

  it("un set vale solo nelle sue modalita'", () => {
    const base = draftFor(RED_INFERNO);
    const nestOnly = gc.artifacts!.sets.find((set) => setModes(set).join() === "creature-nest");
    if (nestOnly) expect(checkStrategy({ ...base, artifactSet: nestOnly.id }, gc).problem).toEqual({ code: "set" });
    const everywhere = gc.artifacts!.sets.find((set) => setModes(set).includes("death-match"))!;
    expect(checkStrategy({ ...base, artifactSet: everywhere.id }, gc).draft?.artifactSet).toBe(everywhere.id);
    expect(checkStrategy({ ...base, artifactSet: "nessuno" }, gc).problem).toEqual({ code: "set" });
  });

  it("ripulisce il testo: a capo uniformi, spazi in testa e in coda", () => {
    const base = draftFor(RED_INFERNO);
    const result = checkStrategy({ ...base, title: "  Una guida  con spazi  ", notes: "riga\r\nseconda  " }, gc);
    expect(result.draft?.title).toBe("Una guida con spazi");
    expect(result.draft?.notes).toBe("riga\nseconda");
  });
});

describe("nomi e indirizzi", () => {
  it("la scelta va e torna dall'indirizzo", () => {
    const nest: StrategySelection = { mode: "creature-nest", target: "hraesvelgr", level: null, transcendent: true };
    const query = selectionQuery(nest);
    expect(query).toBe("?modalita=bestie-demoniache&bersaglio=hraesvelgr&trascendente=1");
    expect(selectionFromParams(Object.fromEntries(new URLSearchParams(query)))).toEqual({
      mode: "creature-nest",
      target: "hraesvelgr",
      transcendent: true,
    });
    expect(newStrategyHref("grand-cross", RED_INFERNO)).toBe(
      "/grand-cross/strategie/nuova?modalita=scontri-finali&bersaglio=red-demon&difficolta=4",
    );
  });

  it("la pagina dell'Endgame di una strategia porta alla difficolta' e alle squadre", () => {
    expect(selectionPageHref("grand-cross", RED_INFERNO)).toBe("/grand-cross/scontri-finali/red-demon?difficolta=4#squadre");
    const trans = gc.creatureNest!.beasts.find((beast) => beast.key === "hraesvelgr")!.floors.find((floor) => floor.transcendent)!;
    expect(
      selectionPageHref("grand-cross", { mode: "creature-nest", target: "hraesvelgr", level: null, transcendent: true }, gc),
    ).toBe(`/grand-cross/bestie-demoniache/hraesvelgr?piano=${trans.floor}#squadre`);
    expect(selectionPageHref("grand-cross", { mode: "demon-king", target: null, level: 2, transcendent: false })).toBe(
      "/grand-cross/re-demone?difficolta=2#squadre",
    );
  });

  it("il titolo automatico dice dove vale, nelle due lingue", () => {
    expect(selectionLabel(gc, RED_INFERNO, "it")).toBe("Demone rosso · Inferno");
    expect(autoTitle(gc, RED_INFERNO, "it")).toBe("Squadra: Demone rosso · Inferno");
    expect(autoTitle(gc, RED_INFERNO, "en")).toMatch(/^Team: .+ · .+$/);
  });
});

describe("il modello per il modulo", () => {
  it("porta tutti gli eroi della griglia e solo set che valgono da qualche parte", () => {
    const template = strategyTemplate(gc, "it");
    expect(template.heroes.length).toBe(heroes.length);
    expect(template.sets.length).toBeGreaterThan(0);
    expect(template.sets.every((set) => set.modes.length > 0)).toBe(true);
    expect(template.modes.map((mode) => mode.mode)).toEqual([...STRATEGY_MODES]);
    // niente markup del gioco nei testi che arrivano al browser
    const texts = template.modes.flatMap((mode) =>
      mode.targets.flatMap((target) => [target.name, ...target.levels.flatMap((level) => level.phases.map((phase) => phase.detail ?? ""))]),
    );
    expect(texts.some((text) => /\[[0-9A-Fa-f]{6}\]|\[-\]|\[\/?b\]/.test(text))).toBe(false);
  });
});
