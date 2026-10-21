/**
 * Lo stato del modulo di scrittura di una strategia, senza React.
 *
 * Qui stanno le regole che il modulo fa rispettare prima di inviare: sono le
 * stesse di `checkStrategy` (src/lib/strategies/rules.ts), rilette sul modello
 * che arriva al browser invece che sul modulo del gioco. Il controllo vero resta
 * quello del server; questo serve a dire subito, vicino al campo, cosa manca,
 * invece di mandare la bozza e farsela tornare indietro.
 *
 * Lo stato non e' gia' uno `StrategyDraft` per due motivi: durante la scrittura
 * mancano dei pezzi (un posto vuoto, la difficolta' non scelta), e le note delle
 * fasi restano tutte, anche quelle in piu' quando si passa a una difficolta' con
 * meno fasi. Si buttano solo se lo dice chi scrive; all'invio va solo quello che
 * la difficolta' scelta prevede (`toDraft`).
 */

import { cleanText, heroBlock, strategyKind } from "@/lib/strategies/rules";
import {
  STRATEGY_LIMITS,
  TEAM_SIZE,
  type EndgameMode,
  type StrategyDraft,
  type StrategyKind,
  type StrategySelection,
  type StrategyTemplate,
  type TemplateHero,
  type TemplateLevel,
  type TemplateMode,
  type TemplateTarget,
} from "@/lib/strategies/types";

/** Un posto mentre si scrive: l'eroe puo' mancare ancora. */
export interface EditorSlot {
  readonly hero: string | null;
  readonly associate: string | null;
}

/** Una difficolta' come la riconosce il modello: per le bestie `level` e' null e conta `transcendent`. */
export interface LevelRef {
  readonly level: number | null;
  readonly transcendent: boolean;
}

export interface EditorState {
  readonly mode: EndgameMode | null;
  /** la chiave del bersaglio scelto; per le modalita' con un bersaglio solo e' la sua (null) */
  readonly target: string | null;
  /** null = non ancora scelta */
  readonly level: LevelRef | null;
  /** sempre TEAM_SIZE posti */
  readonly team: readonly EditorSlot[];
  readonly artifactSet: string | null;
  readonly title: string;
  readonly notes: string;
  /** per posizione; puo' essere piu' lungo delle fasi della difficolta' scelta */
  readonly phases: readonly string[];
}

/** Un attributo come lo mostra il modulo (filtro della scelta, limiti della difficolta'). */
export interface EditorAttribute {
  readonly code: number;
  readonly name: string;
  /** l'icona del gioco, se c'e' */
  readonly icon: string | null;
  readonly color: string | null;
}

export const EMPTY_SLOT: EditorSlot = { hero: null, associate: null };

export function emptyState(): EditorState {
  return {
    mode: null,
    target: null,
    level: null,
    team: Array.from({ length: TEAM_SIZE }, () => EMPTY_SLOT),
    artifactSet: null,
    title: "",
    notes: "",
    phases: [],
  };
}

/* ------------------------------------------------ modalita', bersaglio -- */

export interface Resolved {
  readonly mode: TemplateMode | null;
  readonly target: TemplateTarget | null;
  readonly level: TemplateLevel | null;
}

const sameLevel = (ref: LevelRef) => (level: TemplateLevel) =>
  level.level === ref.level && level.transcendent === ref.transcendent;

export function levelRef(level: TemplateLevel): LevelRef {
  return { level: level.level, transcendent: level.transcendent };
}

/** Modalita', bersaglio e difficolta' dello stato, cercati nel modello. */
export function resolve(template: StrategyTemplate, state: EditorState): Resolved {
  const mode = template.modes.find((item) => item.mode === state.mode) ?? null;
  if (!mode) return { mode: null, target: null, level: null };
  const target =
    mode.targets.length === 1 ? mode.targets[0]! : (mode.targets.find((item) => item.key !== null && item.key === state.target) ?? null);
  if (!target) return { mode, target: null, level: null };
  const level = state.level ? (target.levels.find(sameLevel(state.level)) ?? null) : null;
  return { mode, target, level };
}

/**
 * Rimette in ordine modalita', bersaglio e difficolta' dopo un cambio: una
 * modalita' con un bersaglio solo lo sceglie da se', un bersaglio con una
 * difficolta' sola (una bestia senza piano trascendente) pure. Una difficolta'
 * che il nuovo bersaglio non ha si toglie: tenerla vorrebbe dire mandare una
 * scelta che il server rifiuta.
 */
export function settle(template: StrategyTemplate, state: EditorState): EditorState {
  const mode = template.modes.find((item) => item.mode === state.mode);
  if (!mode) return { ...state, mode: null, target: null, level: null };
  const target =
    mode.targets.length === 1 ? mode.targets[0] : mode.targets.find((item) => item.key !== null && item.key === state.target);
  if (!target) return { ...state, target: null, level: null };
  const kept = state.level ? target.levels.find(sameLevel(state.level)) : undefined;
  const only = target.levels.length === 1 ? target.levels[0] : undefined;
  const level = kept ?? only;
  return { ...state, target: target.key, level: level ? levelRef(level) : null };
}

export function chooseMode(template: StrategyTemplate, state: EditorState, mode: EndgameMode): EditorState {
  if (state.mode === mode) return state;
  return settle(template, { ...state, mode, target: null, level: null });
}

/**
 * Cambiando bersaglio la difficolta' resta se il nuovo ce l'ha: chi passa dal
 * Demone rosso al Demone grigio a Inferno vuole ancora Inferno.
 */
export function chooseTarget(template: StrategyTemplate, state: EditorState, key: string | null): EditorState {
  return settle(template, { ...state, target: key });
}

/** Lo stato di partenza dall'indirizzo (`selectionFromParams`): quello che non torna col modello si lascia vuoto. */
export function stateFromSelection(template: StrategyTemplate, selection: Partial<StrategySelection> | null | undefined): EditorState {
  const base = emptyState();
  if (!selection?.mode) return base;
  // per le bestie l'indirizzo non porta `difficolta`: senza `trascendente=1` sono i piani normali
  const level: LevelRef = { level: selection.level ?? null, transcendent: selection.transcendent ?? false };
  return settle(template, { ...base, mode: selection.mode, target: selection.target ?? null, level });
}

/** Lo stato di partenza da una strategia salvata (la modifica). */
export function stateFromDraft(template: StrategyTemplate, draft: StrategyDraft): EditorState {
  const known = new Set(template.heroes.map((hero) => hero.id));
  const pick = (id: string | null | undefined) => (id && known.has(id) ? id : null);
  return settle(template, {
    mode: draft.mode,
    target: draft.target,
    level: { level: draft.level, transcendent: draft.transcendent },
    team: Array.from({ length: TEAM_SIZE }, (_, i) => ({
      hero: pick(draft.team[i]?.hero),
      associate: pick(draft.team[i]?.associate),
    })),
    artifactSet: template.sets.some((set) => set.id === draft.artifactSet) ? draft.artifactSet : null,
    title: draft.title,
    notes: draft.notes,
    phases: [...draft.phases],
  });
}

export function sameSelection(a: EditorState, b: EditorState): boolean {
  return (
    a.mode === b.mode &&
    a.target === b.target &&
    (a.level?.level ?? null) === (b.level?.level ?? null) &&
    (a.level?.transcendent ?? null) === (b.level?.transcendent ?? null)
  );
}

export function isEmptyState(state: EditorState): boolean {
  return (
    state.mode === null &&
    state.artifactSet === null &&
    state.team.every((slot) => !slot.hero && !slot.associate) &&
    [state.title, state.notes, ...state.phases].every((text) => text.trim() === "")
  );
}

/* ------------------------------------------------------------- le fasi -- */

/** Le note delle fasi della difficolta' scelta, nell'ordine; vuoto senza difficolta'. */
export function phasesFor(state: EditorState, level: TemplateLevel | null): string[] {
  return level ? level.phases.map((_, i) => state.phases[i] ?? "") : [];
}

/**
 * Le note scritte per fasi che la difficolta' scelta non ha (o tutte, se la
 * difficolta' non c'e' ancora): non partono con la strategia, e il modulo lo dice.
 */
export function extraPhases(state: EditorState, level: TemplateLevel | null): { index: number; text: string }[] {
  const from = level?.phases.length ?? 0;
  return state.phases
    .map((text, index) => ({ index, text }))
    .filter((item) => item.index >= from && cleanText(item.text) !== "");
}

/** Toglie le note in piu' e, se chiesto, le mette in coda alle note generali col nome della fase. */
export function dropExtraPhases(state: EditorState, level: TemplateLevel | null, label: (index: number) => string, move: boolean): EditorState {
  const from = level?.phases.length ?? 0;
  const extra = extraPhases(state, level);
  const moved = extra.map((item) => `${label(item.index)}\n${cleanText(item.text)}`);
  const notes = move && moved.length > 0 ? [cleanText(state.notes), ...moved].filter(Boolean).join("\n\n") : state.notes;
  return { ...state, notes, phases: state.phases.slice(0, from) };
}

export function kindOf(state: EditorState, level: TemplateLevel | null): StrategyKind {
  return strategyKind({ title: state.title, notes: state.notes, phases: phasesFor(state, level) });
}

/* ------------------------------------------------------------- gli eroi -- */

/** Perche' un eroe non puo' andare in un posto: escluso, attributo, personaggio gia' in squadra. */
export type HeroReason = "banned" | "attribute" | "group";

export type PickKind = "hero" | "associate";

/**
 * I personaggi gia' in squadra, tolto il posto che si sta scegliendo: otto
 * personaggi diversi fra eroi e associati, come nel gioco.
 */
export function usedGroups(
  state: EditorState,
  heroes: ReadonlyMap<string, TemplateHero>,
  except: { readonly kind: PickKind; readonly slot: number } | null,
): Set<string> {
  const groups = new Set<string>();
  state.team.forEach((slot, i) => {
    for (const kind of ["hero", "associate"] as const) {
      if (except && except.kind === kind && except.slot === i) continue;
      const id = slot[kind];
      const group = id ? heroes.get(id)?.group : undefined;
      if (group) groups.add(group);
    }
  });
  return groups;
}

/**
 * Perche' un eroe non puo' entrare in quel posto, o null. Esclusioni e
 * attributi valgono solo per chi combatte: gli associati prestano statistiche,
 * per loro conta solo il personaggio diverso (come `checkStrategy`).
 */
export function heroReason(
  hero: TemplateHero,
  kind: PickKind,
  level: TemplateLevel | null,
  groups: ReadonlySet<string>,
): HeroReason | null {
  if (kind === "hero" && level) {
    const block = heroBlock(hero, level);
    if (block) return block;
  }
  return groups.has(hero.group) ? "group" : null;
}

export interface SlotIssue {
  readonly hero: HeroReason | null;
  readonly associate: "group" | null;
}

/**
 * I problemi dei posti gia' riempiti, nello stesso ordine del server: prima gli
 * eroi, poi gli associati (un associato non ruba il personaggio a un eroe che
 * viene dopo di lui). Serve quando la difficolta' cambia sotto una squadra gia'
 * fatta: il posto lo dice, l'eroe non sparisce.
 */
export function teamIssues(
  state: EditorState,
  heroes: ReadonlyMap<string, TemplateHero>,
  level: TemplateLevel | null,
): SlotIssue[] {
  const seen = new Set<string>();
  const issues: { hero: HeroReason | null; associate: "group" | null }[] = state.team.map((slot) => {
    const hero = slot.hero ? heroes.get(slot.hero) : undefined;
    if (!hero) return { hero: null, associate: null };
    const block = level ? heroBlock(hero, level) : null;
    const reason: HeroReason | null = block ?? (seen.has(hero.group) ? "group" : null);
    seen.add(hero.group);
    return { hero: reason, associate: null };
  });
  state.team.forEach((slot, i) => {
    const associate = slot.associate ? heroes.get(slot.associate) : undefined;
    if (!associate) return;
    if (seen.has(associate.group)) issues[i]!.associate = "group";
    seen.add(associate.group);
  });
  return issues;
}

/* ------------------------------------------------------------ problemi -- */

export type EditorProblem =
  | { readonly code: "mode" }
  | { readonly code: "target" }
  | { readonly code: "level" }
  | { readonly code: "hero"; readonly slot: number }
  | { readonly code: "banned"; readonly slot: number }
  | { readonly code: "attribute"; readonly slot: number }
  | { readonly code: "duplicate"; readonly slot: number; readonly associate: boolean }
  | { readonly code: "set" }
  | { readonly code: "notes-long" }
  | { readonly code: "phase-long"; readonly phase: number }
  | { readonly code: "title-only" }
  | { readonly code: "title-missing" }
  | { readonly code: "title-short" }
  | { readonly code: "title-long" };

/** Il titolo come lo conta il server: ripulito e con gli spazi ridotti a uno. */
export function titleLength(title: string): number {
  return cleanText(title).replace(/\s+/g, " ").length;
}

/** Tutto quello che il server rifiuterebbe, nell'ordine in cui il modulo lo mostra. */
export function editorProblems(
  template: StrategyTemplate,
  state: EditorState,
  heroes: ReadonlyMap<string, TemplateHero>,
): EditorProblem[] {
  const problems: EditorProblem[] = [];
  const { mode, target, level } = resolve(template, state);
  if (!mode) problems.push({ code: "mode" });
  else if (!target) problems.push({ code: "target" });
  else if (!level) problems.push({ code: "level" });

  const issues = teamIssues(state, heroes, level);
  state.team.forEach((slot, i) => {
    const issue = issues[i];
    if (!slot.hero || !heroes.has(slot.hero)) problems.push({ code: "hero", slot: i });
    else if (issue?.hero === "group") problems.push({ code: "duplicate", slot: i, associate: false });
    else if (issue?.hero) problems.push({ code: issue.hero, slot: i });
    if (issue?.associate) problems.push({ code: "duplicate", slot: i, associate: true });
  });

  if (state.artifactSet && mode) {
    const set = template.sets.find((item) => item.id === state.artifactSet);
    if (!set || !set.modes.includes(mode.mode)) problems.push({ code: "set" });
  }

  const title = titleLength(state.title);
  const notes = cleanText(state.notes).length;
  const phases = phasesFor(state, level).map((text) => cleanText(text).length);
  if (notes > STRATEGY_LIMITS.notesMax) problems.push({ code: "notes-long" });
  phases.forEach((length, phase) => {
    if (length > STRATEGY_LIMITS.phaseMax) problems.push({ code: "phase-long", phase });
  });
  const body = notes > 0 || phases.some((length) => length > 0);
  if (title > 0 && !body && level) problems.push({ code: "title-only" });
  if (body && title === 0) problems.push({ code: "title-missing" });
  else if (body && title < STRATEGY_LIMITS.titleMin) problems.push({ code: "title-short" });
  if (title > STRATEGY_LIMITS.titleMax) problems.push({ code: "title-long" });
  return problems;
}

/** I problemi che spengono il pulsante: manca ancora un pezzo della scelta o un eroe. */
export function isMissing(problem: EditorProblem): boolean {
  return problem.code === "mode" || problem.code === "target" || problem.code === "level" || problem.code === "hero";
}

/** La bozza da mandare all'azione; null finche' la scelta non e' completa. */
export function toDraft(template: StrategyTemplate, state: EditorState): StrategyDraft | null {
  const { mode, target, level } = resolve(template, state);
  if (!mode || !target || !level) return null;
  if (state.team.some((slot) => !slot.hero)) return null;
  return {
    mode: mode.mode,
    target: target.key,
    level: level.level,
    transcendent: level.transcendent,
    team: state.team.map((slot) => ({ hero: slot.hero ?? "", associate: slot.associate })),
    artifactSet: state.artifactSet,
    title: state.title,
    notes: state.notes,
    phases: phasesFor(state, level),
  };
}

/* ------------------------------------------------- la bozza nel browser -- */

export function draftStorageKey(game: string): string {
  return `heiki:${game}:strategia-bozza`;
}

const STORED_VERSION = 1;
/** abbastanza per i limiti del server con margine; oltre e' spazzatura, non una bozza */
const STORED_TEXT_MAX = 20_000;
const STORED_PHASES_MAX = 16;

export function serializeState(state: EditorState): string {
  return JSON.stringify({ v: STORED_VERSION, ...state });
}

/**
 * Rilegge la bozza salvata. Il browser e' di chi scrive ma il contenuto puo'
 * essere di una versione vecchia del sito o di un eroe che non c'e' piu': ogni
 * campo si controlla contro il modello, e quello che non torna si lascia vuoto.
 */
export function parseStoredState(raw: string | null, template: StrategyTemplate): EditorState | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const data = value as Record<string, unknown>;
  if (data["v"] !== STORED_VERSION) return null;

  const text = (input: unknown) => (typeof input === "string" ? input.slice(0, STORED_TEXT_MAX) : "");
  const heroIds = new Set(template.heroes.map((hero) => hero.id));
  const heroId = (input: unknown) => (typeof input === "string" && heroIds.has(input) ? input : null);
  const modeValue = template.modes.find((mode) => mode.mode === data["mode"])?.mode ?? null;
  const rawLevel = data["level"];
  let level: LevelRef | null = null;
  if (typeof rawLevel === "object" && rawLevel !== null) {
    const ref = rawLevel as Record<string, unknown>;
    level = {
      level: typeof ref["level"] === "number" && Number.isInteger(ref["level"]) ? ref["level"] : null,
      transcendent: ref["transcendent"] === true,
    };
  }
  const rawTeam = Array.isArray(data["team"]) ? (data["team"] as unknown[]) : [];
  const team = Array.from({ length: TEAM_SIZE }, (_, i) => {
    const slot = rawTeam[i];
    const entry = typeof slot === "object" && slot !== null ? (slot as Record<string, unknown>) : {};
    return { hero: heroId(entry["hero"]), associate: heroId(entry["associate"]) };
  });
  const setId = typeof data["artifactSet"] === "string" ? data["artifactSet"] : null;
  const phases = Array.isArray(data["phases"]) ? (data["phases"] as unknown[]).slice(0, STORED_PHASES_MAX).map(text) : [];

  return settle(template, {
    mode: modeValue,
    target: typeof data["target"] === "string" ? data["target"] : null,
    level,
    team,
    artifactSet: template.sets.some((set) => set.id === setId) ? setId : null,
    title: text(data["title"]),
    notes: text(data["notes"]),
    phases,
  });
}
