import { describe, expect, it } from "vitest";
import type { StrategyTemplate, TemplateHero, TemplateLevel } from "@/lib/strategies/types";
import {
  chooseMode,
  chooseTarget,
  dropExtraPhases,
  editorProblems,
  emptyState,
  extraPhases,
  isMissing,
  kindOf,
  parseStoredState,
  resolve,
  serializeState,
  stateFromSelection,
  teamIssues,
  toDraft,
  type EditorState,
} from "../editor-state";

/* Un modello piccolo, fatto a mano: due boss (uno con Inferno ad attributi
   limitati), una bestia col trascendente e una senza, il Re Demone con due esclusi. */

const phase = (n: number) => ({ label: `Fase ${n}`, detail: null });
const level = (value: number | null, extra: Partial<TemplateLevel> = {}): TemplateLevel => ({
  level: value,
  transcendent: false,
  name: `L${value}`,
  color: null,
  phases: [phase(1), phase(2)],
  allowedAttributes: null,
  banned: [],
  ...extra,
});

const hero = (id: string, group: string, attributes: number[]): TemplateHero => ({
  id,
  name: id,
  epithet: "",
  group,
  attributes,
  color: null,
  rarity: "UR",
  card: `/${id}.webp`,
});

const TEMPLATE: StrategyTemplate = {
  game: "prova",
  modes: [
    {
      mode: "death-match",
      name: "Scontro finale",
      href: "/prova/scontri-finali",
      targets: [
        {
          key: "red",
          name: "Rosso",
          image: null,
          levels: [level(3), level(4, { allowedAttributes: [1, 2], phases: [phase(1), phase(2), phase(3)] })],
        },
        { key: "gray", name: "Grigio", image: null, levels: [level(4, { phases: [phase(1)] })] },
      ],
    },
    {
      mode: "creature-nest",
      name: "Bestie",
      href: "/prova/bestie-demoniache",
      targets: [
        {
          key: "hraesvelgr",
          name: "Hraesvelgr",
          image: null,
          levels: [level(null), level(null, { transcendent: true, name: "Trascendente" })],
        },
        { key: "nidhoggr", name: "Nidhoggr", image: null, levels: [level(null)] },
      ],
    },
    {
      mode: "demon-king",
      name: "Re Demone",
      href: "/prova/re-demone",
      targets: [{ key: null, name: "Re Demone", image: null, levels: [level(1, { banned: ["b"] }), level(2, { banned: ["b"] })] }],
    },
  ],
  heroes: [
    hero("a", "A", [1]),
    hero("a2", "A", [2]),
    hero("b", "B", [2]),
    hero("c", "C", [3]),
    hero("d", "D", [1]),
    hero("e", "E", [4, 5]),
    hero("f", "F", [2]),
  ],
  sets: [
    { id: "s1", number: 1, name: "Solo scontri", code: "No.1", image: null, cards: 3, bonus: null, modes: ["death-match"] },
    {
      id: "s2",
      number: 2,
      name: "Ovunque",
      code: "No.2",
      image: null,
      cards: 5,
      bonus: null,
      modes: ["death-match", "creature-nest", "demon-king"],
    },
  ],
};

const HEROES = new Map(TEMPLATE.heroes.map((item) => [item.id, item]));

const withTeam = (state: EditorState, ids: (string | null)[], associates: (string | null)[] = []): EditorState => ({
  ...state,
  team: ids.map((id, i) => ({ hero: id, associate: associates[i] ?? null })),
});

describe("scelta di modalita', bersaglio e difficolta'", () => {
  it("dall'indirizzo: boss e difficolta' riconosciuti, il resto vuoto", () => {
    const state = stateFromSelection(TEMPLATE, { mode: "death-match", target: "red", level: 4 });
    expect(state.target).toBe("red");
    expect(state.level).toEqual({ level: 4, transcendent: false });
    expect(stateFromSelection(TEMPLATE, { mode: "death-match", target: "red" }).level).toBeNull();
    expect(stateFromSelection(TEMPLATE, { mode: "death-match", target: "nessuno", level: 4 }).target).toBeNull();
  });

  it("per le bestie senza `trascendente` sono i piani normali", () => {
    const state = stateFromSelection(TEMPLATE, { mode: "creature-nest", target: "hraesvelgr" });
    expect(state.level).toEqual({ level: null, transcendent: false });
    const up = stateFromSelection(TEMPLATE, { mode: "creature-nest", target: "hraesvelgr", transcendent: true });
    expect(up.level).toEqual({ level: null, transcendent: true });
  });

  it("un bersaglio solo si sceglie da se'; una difficolta' sola pure", () => {
    const king = chooseMode(TEMPLATE, emptyState(), "demon-king");
    expect(resolve(TEMPLATE, king).target?.name).toBe("Re Demone");
    expect(king.level).toBeNull();
    const nest = chooseTarget(TEMPLATE, chooseMode(TEMPLATE, emptyState(), "creature-nest"), "nidhoggr");
    expect(nest.level).toEqual({ level: null, transcendent: false });
  });

  it("cambiando boss la difficolta' resta se c'e', se no si toglie", () => {
    const red4 = stateFromSelection(TEMPLATE, { mode: "death-match", target: "red", level: 4 });
    expect(chooseTarget(TEMPLATE, red4, "gray").level).toEqual({ level: 4, transcendent: false });
    const red3 = stateFromSelection(TEMPLATE, { mode: "death-match", target: "red", level: 3 });
    // il grigio ha solo Inferno: si sceglie da se'
    expect(chooseTarget(TEMPLATE, red3, "gray").level).toEqual({ level: 4, transcendent: false });
    expect(chooseMode(TEMPLATE, red4, "creature-nest")).toMatchObject({ target: null, level: null });
  });
});

describe("squadra", () => {
  const inferno = stateFromSelection(TEMPLATE, { mode: "death-match", target: "red", level: 4 });
  const infernoLevel = resolve(TEMPLATE, inferno).level;

  it("l'eroe che non puo' piu' entrare resta e si segnala", () => {
    const state = withTeam(inferno, ["a", "c", "d", "b"]);
    const issues = teamIssues(state, HEROES, infernoLevel);
    expect(issues.map((issue) => issue.hero)).toEqual([null, "attribute", null, null]);
    expect(state.team[1]?.hero).toBe("c");
    expect(editorProblems(TEMPLATE, state, HEROES)).toContainEqual({ code: "attribute", slot: 1 });
  });

  it("otto personaggi diversi: prima gli eroi, poi gli associati", () => {
    const state = withTeam(inferno, ["a", "b", "d", "a2"], ["b", null, null, null]);
    const issues = teamIssues(state, HEROES, infernoLevel);
    expect(issues[3]?.hero).toBe("group");
    expect(issues[0]?.associate).toBe("group");
  });

  it("le esclusioni valgono per chi combatte, non per gli associati", () => {
    const king = { ...chooseMode(TEMPLATE, emptyState(), "demon-king"), level: { level: 1, transcendent: false } };
    const state = withTeam(king, ["a", "c", "d", "e"], [null, "b", null, null]);
    expect(editorProblems(TEMPLATE, state, HEROES)).toEqual([]);
    const banned = withTeam(king, ["b", "c", "d", "e"]);
    expect(editorProblems(TEMPLATE, banned, HEROES)).toContainEqual({ code: "banned", slot: 0 });
  });

  it("finche' manca un pezzo il pulsante e' spento e la bozza non c'e'", () => {
    const state = withTeam(inferno, ["a", null, "d", "b"]);
    expect(editorProblems(TEMPLATE, state, HEROES).filter(isMissing)).toEqual([{ code: "hero", slot: 1 }]);
    expect(toDraft(TEMPLATE, state)).toBeNull();
  });
});

describe("testo e tipo", () => {
  const base = withTeam(stateFromSelection(TEMPLATE, { mode: "death-match", target: "red", level: 4 }), ["a", "b", "d", "f"]);
  const codes = (state: EditorState) => editorProblems(TEMPLATE, state, HEROES).map((problem) => problem.code);

  it("senza testo e' un consiglio di squadra, col titolo una guida", () => {
    const level = resolve(TEMPLATE, base).level;
    expect(kindOf(base, level)).toBe("team");
    expect(kindOf({ ...base, title: "Una squadra" }, level)).toBe("guide");
    expect(kindOf({ ...base, phases: ["", "", "", "fuori"] }, level)).toBe("team");
  });

  it("le regole del titolo sono quelle del server", () => {
    expect(codes(base)).toEqual([]);
    expect(codes({ ...base, title: "Titolo abbastanza lungo" })).toEqual(["title-only"]);
    expect(codes({ ...base, notes: "Note" })).toEqual(["title-missing"]);
    expect(codes({ ...base, notes: "Note", title: "Corto" })).toEqual(["title-short"]);
    expect(codes({ ...base, phases: ["", "x"], title: "   dieci   caratteri  " })).toEqual([]);
    expect(codes({ ...base, notes: "x".repeat(6001), title: "Titolo abbastanza lungo" })).toEqual(["notes-long"]);
  });

  it("le note di fasi in piu' restano, si dicono, e non partono", () => {
    const state = { ...base, title: "Titolo abbastanza lungo", phases: ["uno", "", "tre", "quattro"] };
    const level = resolve(TEMPLATE, state).level;
    expect(extraPhases(state, level)).toEqual([{ index: 3, text: "quattro" }]);
    expect(toDraft(TEMPLATE, state)?.phases).toEqual(["uno", "", "tre"]);
    const moved = dropExtraPhases(state, level, (i) => `Fase ${i + 1}`, true);
    expect(moved.phases).toEqual(["uno", "", "tre"]);
    expect(moved.notes).toBe("Fase 4\nquattro");
  });

  it("il set che non vale nella modalita' si segnala", () => {
    const nest = withTeam(stateFromSelection(TEMPLATE, { mode: "creature-nest", target: "nidhoggr" }), ["a", "b", "d", "e"]);
    expect(codes({ ...nest, artifactSet: "s1" })).toEqual(["set"]);
    expect(codes({ ...nest, artifactSet: "s2" })).toEqual([]);
  });
});

describe("la bozza nel browser", () => {
  it("torna com'era", () => {
    const state = withTeam(stateFromSelection(TEMPLATE, { mode: "death-match", target: "red", level: 4 }), ["a", null, "d", null], [
      null,
      "c",
    ]);
    const full = { ...state, artifactSet: "s2", title: "Titolo", notes: "Note", phases: ["", "fase 2", "", "in piu'"] };
    expect(parseStoredState(serializeState(full), TEMPLATE)).toEqual(full);
  });

  it("quello che non torna col modello si lascia vuoto", () => {
    const raw = JSON.stringify({
      v: 1,
      mode: "death-match",
      target: "red",
      level: { level: 9, transcendent: false },
      team: [{ hero: "sparito", associate: "a" }, "rotto"],
      artifactSet: "nessuno",
      title: 12,
      notes: "ok",
      phases: ["x", 3],
    });
    const state = parseStoredState(raw, TEMPLATE);
    expect(state).toMatchObject({ target: "red", level: null, artifactSet: null, title: "", notes: "ok", phases: ["x", ""] });
    expect(state?.team[0]).toEqual({ hero: null, associate: "a" });
    expect(state?.team).toHaveLength(4);
    expect(parseStoredState("{rotto", TEMPLATE)).toBeNull();
    expect(parseStoredState(JSON.stringify({ v: 99 }), TEMPLATE)).toBeNull();
  });
});
