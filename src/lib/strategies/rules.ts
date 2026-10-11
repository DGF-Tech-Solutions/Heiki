/**
 * Le regole delle strategie dell'Endgame, senza React e senza database.
 *
 * Il modello di ogni modalita' (bersagli, difficolta', fasi, chi non puo'
 * entrare) si legge dagli indici dell'Endgame del modulo del gioco: e' lo stesso
 * dato delle pagine, quindi una fase in piu' dopo una patch compare nel modulo
 * di scrittura senza toccare niente. Il controllo di una bozza (`checkStrategy`)
 * gira sul server col modulo, mai col modello mandato al browser.
 */

import { plainHeroText } from "@/lib/games/hero-markup";
import { inLingua, type Locale } from "@/lib/i18n/locale";
import type { ArtifactSet } from "@/lib/games/artifact-types";
import type { HeroLabel, HeroAffinity, HeroEntry, GameModule } from "@/lib/games/types";
import {
  STRATEGY_LIMITS,
  STRATEGY_MODES,
  TEAM_SIZE,
  type EndgameMode,
  type StrategyDraft,
  type StrategyKind,
  type StrategySelection,
  type StrategySlot,
} from "./types";

/* ------------------------------------------------------- le modalita' -- */

/** Il percorso della pagina di ogni modalita': anche il valore di `?modalita=`. */
export const MODE_SLUGS: Readonly<Record<EndgameMode, string>> = {
  "death-match": "scontri-finali",
  "creature-nest": "bestie-demoniache",
  "demon-king": "re-demone",
  "supreme-deity": "divinita-suprema",
};

export function isStrategyMode(value: unknown): value is EndgameMode {
  return typeof value === "string" && (STRATEGY_MODES as readonly string[]).includes(value);
}

export function modeFromSlug(slug: string | null | undefined): EndgameMode | null {
  const found = STRATEGY_MODES.find((mode) => MODE_SLUGS[mode] === slug);
  return found ?? null;
}

/** Il nome della modalita' come lo scrive il gioco; null se il modulo non ce l'ha. */
export function modeName(module: GameModule, mode: EndgameMode): HeroLabel | null {
  switch (mode) {
    case "death-match":
      return module.deathMatch?.name ?? null;
    case "creature-nest":
      return module.creatureNest?.name ?? null;
    case "demon-king":
      return module.demonKing?.name ?? null;
    case "supreme-deity":
      return module.supremeDeity?.name ?? null;
  }
}

/** Le modalita' che il modulo ha davvero. */
export function availableModes(module: GameModule): EndgameMode[] {
  return STRATEGY_MODES.filter((mode) => modeName(module, mode) !== null);
}

/** Se il gioco ha almeno una modalita' dell'Endgame: senza, niente strategie. */
export function hasStrategies(module: GameModule | undefined): boolean {
  return module !== undefined && availableModes(module).length > 0;
}

/* ------------------------------------------- bersagli e difficolta' -- */

const PHASE: (n: number) => HeroLabel = (n) => ({ it: `Fase ${n}`, en: `Phase ${n}` });

/** Una difficolta' come la usano il modulo e il controllo, coi testi ancora nelle due lingue. */
export interface LevelSpec {
  readonly level: number | null;
  readonly transcendent: boolean;
  readonly name: HeroLabel;
  readonly color: string | null;
  readonly phases: readonly { readonly label: HeroLabel; readonly detail: HeroLabel | null }[];
  readonly allowedAttributes: readonly number[] | null;
  readonly banned: readonly string[];
}

export interface TargetSpec {
  readonly key: string | null;
  readonly name: HeroLabel;
  /** il percorso dell'immagine sotto endgame/, se c'e' */
  readonly image: string | null;
  readonly levels: readonly LevelSpec[];
}

/** Il testo nudo di un'etichetta del gioco, nelle due lingue (i nomi hanno `[b]`). */
function plain(label: HeroLabel | null | undefined): HeroLabel | null {
  if (!label) return null;
  return {
    it: label.it === null ? null : plainHeroText(label.it),
    en: label.en === null ? null : plainHeroText(label.en),
  };
}

/** Piu' nomi in uno, nella stessa lingua: «Ludociel, Sariel». */
function joined(labels: readonly (HeroLabel | null)[]): HeroLabel | null {
  const pick = (locale: Locale) => {
    const parts = labels.map((label) => inLingua(label, locale)).filter((text): text is string => !!text);
    return parts.length > 0 ? [...new Set(parts)].join(", ") : null;
  };
  const it = pick("it");
  const en = pick("en");
  return it === null && en === null ? null : { it, en };
}

/**
 * I bersagli di una modalita' con le loro difficolta' e le fasi.
 *
 * Bestie: due «difficolta'», i piani normali (le fasi del terzo, il piu' duro) e
 * il trascendente, solo per le bestie che ce l'hanno. Divinita' Suprema: le fasi
 * sono i quattro Giudizi, il Giudizio finale e, dove c'e', quello nascosto.
 */
export function targetsFor(module: GameModule, mode: EndgameMode): TargetSpec[] {
  switch (mode) {
    case "death-match": {
      const index = module.deathMatch;
      if (!index) return [];
      return index.bosses.map((boss) => ({
        key: boss.key,
        name: boss.name,
        image: boss.cutIn ? `scontri/${boss.key}-cutin.png` : boss.image ? `scontri/${boss.key}.png` : null,
        levels: boss.difficulties.map((difficulty) => ({
          level: difficulty.level,
          transcendent: false,
          name: difficulty.name,
          color: difficulty.color,
          phases: difficulty.phases.map((phase, i) => ({
            label: PHASE(i + 1),
            detail: plain(index.monsters[phase.foe.monster]?.name),
          })),
          allowedAttributes: difficulty.allowedAttributes,
          banned: difficulty.bannedHeroes,
        })),
      }));
    }
    case "creature-nest": {
      const index = module.creatureNest;
      if (!index) return [];
      return index.beasts.map((beast) => {
        const regular = beast.floors.filter((floor) => !floor.transcendent);
        const hardest = regular[regular.length - 1];
        const transcendent = beast.floors.find((floor) => floor.transcendent);
        const levels: LevelSpec[] = [];
        if (hardest) {
          levels.push({
            level: null,
            transcendent: false,
            name: { it: `Piani 1-${hardest.floor}`, en: `Floors 1-${hardest.floor}` },
            color: hardest.color,
            phases: hardest.phases.map((phase, i) => ({ label: PHASE(i + 1), detail: plain(phase.description) })),
            allowedAttributes: null,
            banned: [],
          });
        }
        if (transcendent) {
          levels.push({
            level: null,
            transcendent: true,
            name: { it: "Trascendente", en: "Transcendent" },
            color: transcendent.color,
            phases: transcendent.phases.map((phase, i) => ({ label: PHASE(i + 1), detail: plain(phase.description) })),
            allowedAttributes: null,
            banned: [],
          });
        }
        return { key: beast.key, name: beast.name, image: beast.image ? `bestie/${beast.key}.png` : null, levels };
      });
    }
    case "demon-king": {
      const index = module.demonKing;
      if (!index) return [];
      return [
        {
          key: null,
          name: index.name,
          image: null,
          levels: index.difficulties.map((difficulty) => ({
            level: difficulty.level,
            transcendent: false,
            name: difficulty.name,
            color: difficulty.color,
            phases: difficulty.phases.map((phase, i) => ({
              label: PHASE(i + 1),
              detail: plain(index.monsters[phase.foe.monster]?.name),
            })),
            allowedAttributes: null,
            banned: index.banned,
          })),
        },
      ];
    }
    case "supreme-deity": {
      const index = module.supremeDeity;
      if (!index) return [];
      return [
        {
          key: null,
          name: index.name,
          image: null,
          levels: index.difficulties.map((difficulty) => ({
            level: difficulty.level,
            transcendent: false,
            name: difficulty.name,
            color: difficulty.color,
            phases: [
              ...difficulty.judgments.map((judgment) => ({
                label: plain(judgment.name) ?? PHASE(0),
                detail: plain(judgment.group.name),
              })),
              {
                label: { it: "Giudizio finale", en: "Final Judgment" },
                detail: { it: "Il gruppo dipende dalla magia accumulata", en: "The group depends on the magic gathered" },
              },
              ...(difficulty.hidden
                ? [
                    {
                      label: { it: "Giudizio nascosto", en: "Hidden Judgment" },
                      detail: joined(difficulty.hidden.groups.map((group) => plain(group.name))),
                    },
                  ]
                : []),
            ],
            allowedAttributes: null,
            banned: index.banned,
          })),
        },
      ];
    }
  }
}

export function findTarget(module: GameModule, mode: EndgameMode, target: string | null): TargetSpec | null {
  return targetsFor(module, mode).find((item) => item.key === target) ?? null;
}

export function findLevel(target: TargetSpec, selection: Pick<StrategySelection, "level" | "transcendent">): LevelSpec | null {
  return (
    target.levels.find((item) => item.level === selection.level && item.transcendent === selection.transcendent) ??
    null
  );
}

/* ------------------------------------------------------------ gli eroi -- */

/**
 * I codici d'attributo di un eroe (1-5). Tristan Luce/Oscurita' non ha un'icona
 * sua nel gioco: vale come Luce e come Oscurita'.
 */
export function heroAttributes(hero: Pick<HeroEntry, "affinity">, affinities: readonly HeroAffinity[]): number[] {
  const affinity = affinities.find((item) => item.id === hero.affinity);
  if (affinity?.iconKey) return [Number(affinity.iconKey)];
  if (hero.affinity === "Luce/Oscurita") return [4, 5];
  return [];
}

/** Perche' un eroe non puo' entrare in squadra a quella difficolta', o null. */
export function heroBlock(
  hero: { readonly id: string; readonly attributes: readonly number[] },
  level: Pick<LevelSpec, "allowedAttributes" | "banned">,
): "banned" | "attribute" | null {
  if (level.banned.includes(hero.id)) return "banned";
  if (level.allowedAttributes && !hero.attributes.some((code) => level.allowedAttributes!.includes(code))) {
    return "attribute";
  }
  return null;
}

/* ----------------------------------------------------- i set artefatto -- */

/**
 * In quali modalita' vale un set, dal filtro «Contenuto» del gioco
 * (`DB_artifact_card_union_filter_group`, la stessa icona delle passive):
 * 1 tutti i contenuti, 3 esclusi i PvP, 4 solo lo Scontro finale, 5 escluso lo
 * Scontro finale, 8 solo la Bestia demoniaca; 2 PvP, 6 Forte, 7 Zuffa, 9 Boss
 * dell'Ordine non sono modalita' dell'Endgame. Un set senza filtro vale ovunque.
 */
export function setModes(set: Pick<ArtifactSet, "filters">): EndgameMode[] {
  const codes = set.filters.contents;
  if (codes.length === 0) return [...STRATEGY_MODES];
  const modes = new Set<EndgameMode>();
  for (const code of codes) {
    if (code === 1 || code === 3) STRATEGY_MODES.forEach((mode) => modes.add(mode));
    if (code === 4) modes.add("death-match");
    if (code === 5) (["creature-nest", "demon-king", "supreme-deity"] as const).forEach((mode) => modes.add(mode));
    if (code === 8) modes.add("creature-nest");
  }
  return STRATEGY_MODES.filter((mode) => modes.has(mode));
}

/* ----------------------------------------------------- testo e tipo -- */

/** Il testo come lo salva il sito: a capo uniformi, niente spazi in testa e in coda. */
export function cleanText(value: string): string {
  return value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}

/** Una guida ha un testo; un consiglio di squadra no. Il titolo conta come testo. */
export function strategyKind(draft: Pick<StrategyDraft, "title" | "notes" | "phases">): StrategyKind {
  const text = [draft.title, draft.notes, ...draft.phases].some((part) => cleanText(part).length > 0);
  return text ? "guide" : "team";
}

/* --------------------------------------------------------- il controllo -- */

export type StrategyProblem =
  | { readonly code: "mode" }
  | { readonly code: "target" }
  | { readonly code: "level" }
  | { readonly code: "team-size" }
  | { readonly code: "hero"; readonly slot: number }
  | { readonly code: "duplicate"; readonly slot: number }
  | { readonly code: "banned"; readonly slot: number }
  | { readonly code: "attribute"; readonly slot: number }
  | { readonly code: "set" }
  | { readonly code: "phases" }
  | { readonly code: "title-missing" }
  | { readonly code: "title-short" }
  | { readonly code: "title-long" }
  | { readonly code: "title-only" }
  | { readonly code: "notes-long" }
  | { readonly code: "phase-long"; readonly phase: number };

export type StrategyCheck =
  | { readonly draft: StrategyDraft; readonly problem: null }
  | { readonly draft: null; readonly problem: StrategyProblem };

const fail = (problem: StrategyProblem): StrategyCheck => ({ draft: null, problem });

/**
 * Controlla e ripulisce una bozza arrivata dal browser.
 *
 * Il valore e' `unknown` di proposito: e' JSON scritto da chiunque. Ogni campo
 * si legge col suo tipo, e il modello della modalita' si prende dal modulo:
 * bersaglio, difficolta', numero di fasi, eroi esclusi e attributi ammessi. Gli
 * Eroi associati non combattono: per loro vale solo il personaggio diverso
 * (otto personaggi diversi, come il gioco).
 */
export function checkStrategy(raw: unknown, module: GameModule): StrategyCheck {
  if (typeof raw !== "object" || raw === null) return fail({ code: "mode" });
  const value = raw as Record<string, unknown>;

  const mode = value["mode"];
  if (!isStrategyMode(mode) || !availableModes(module).includes(mode)) return fail({ code: "mode" });

  const targetKey = typeof value["target"] === "string" && value["target"] !== "" ? value["target"] : null;
  const target = findTarget(module, mode, targetKey);
  if (!target) return fail({ code: "target" });

  const levelValue = typeof value["level"] === "number" && Number.isInteger(value["level"]) ? value["level"] : null;
  const transcendent = value["transcendent"] === true;
  const level = findLevel(target, { level: levelValue, transcendent });
  if (!level) return fail({ code: "level" });

  const heroes = module.roster?.heroes ?? [];
  const affinities = module.roster?.affinities ?? [];
  const byId = new Map(heroes.map((hero) => [hero.id, hero]));

  const rawTeam = value["team"];
  if (!Array.isArray(rawTeam) || rawTeam.length !== TEAM_SIZE) return fail({ code: "team-size" });
  const team: StrategySlot[] = [];
  const groups = new Set<string>();
  for (const [slot, item] of rawTeam.entries()) {
    const entry = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    const hero = typeof entry["hero"] === "string" ? byId.get(entry["hero"]) : undefined;
    if (!hero) return fail({ code: "hero", slot });
    const block = heroBlock({ id: hero.id, attributes: heroAttributes(hero, affinities) }, level);
    if (block) return fail({ code: block, slot });
    if (groups.has(hero.group)) return fail({ code: "duplicate", slot });
    groups.add(hero.group);
    team.push({ hero: hero.id, associate: null });
  }
  // gli associati dopo gli eroi: un associato non deve rubare il personaggio a un
  // eroe che viene dopo di lui nella squadra
  for (const [slot, item] of rawTeam.entries()) {
    const entry = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    const id = entry["associate"];
    if (id === null || id === undefined || id === "") continue;
    const associate = typeof id === "string" ? byId.get(id) : undefined;
    if (!associate) return fail({ code: "hero", slot });
    if (groups.has(associate.group)) return fail({ code: "duplicate", slot });
    groups.add(associate.group);
    team[slot] = { hero: team[slot]!.hero, associate: associate.id };
  }

  let artifactSet: string | null = null;
  if (value["artifactSet"] !== null && value["artifactSet"] !== undefined && value["artifactSet"] !== "") {
    const set = module.artifacts?.sets.find((item) => item.id === value["artifactSet"]);
    if (!set || !setModes(set).includes(mode)) return fail({ code: "set" });
    artifactSet = set.id;
  }

  const text = (key: string) => (typeof value[key] === "string" ? cleanText(value[key] as string) : "");
  const title = text("title").replace(/\s+/g, " ");
  const notes = text("notes");

  const rawPhases = value["phases"];
  if (rawPhases !== undefined && (!Array.isArray(rawPhases) || rawPhases.length > level.phases.length)) {
    return fail({ code: "phases" });
  }
  const phases = level.phases.map((_, i) => {
    const item = Array.isArray(rawPhases) ? rawPhases[i] : undefined;
    return typeof item === "string" ? cleanText(item) : "";
  });

  if (notes.length > STRATEGY_LIMITS.notesMax) return fail({ code: "notes-long" });
  const longPhase = phases.findIndex((phase) => phase.length > STRATEGY_LIMITS.phaseMax);
  if (longPhase >= 0) return fail({ code: "phase-long", phase: longPhase });

  const body = notes.length > 0 || phases.some((phase) => phase.length > 0);
  if (title.length > 0 && !body) return fail({ code: "title-only" });
  if (body && title.length === 0) return fail({ code: "title-missing" });
  if (body && title.length < STRATEGY_LIMITS.titleMin) return fail({ code: "title-short" });
  if (title.length > STRATEGY_LIMITS.titleMax) return fail({ code: "title-long" });

  return {
    draft: {
      mode,
      target: target.key,
      level: level.level,
      transcendent: level.transcendent,
      team,
      artifactSet,
      title,
      notes,
      phases,
    },
    problem: null,
  };
}

/* ------------------------------------------------- nomi e indirizzi -- */

/** «Demone rosso · Inferno», «Hraesvelgr · Trascendente», «La Battaglia del Re Demone · Caos». */
export function selectionLabel(module: GameModule, selection: StrategySelection, locale: Locale): string {
  const target = findTarget(module, selection.mode, selection.target);
  if (!target) return inLingua(modeName(module, selection.mode), locale) ?? selection.mode;
  const level = findLevel(target, selection);
  const name = plainHeroText(inLingua(target.name, locale) ?? "");
  return level ? `${name} · ${inLingua(level.name, locale) ?? ""}` : name;
}

/** Il titolo di un consiglio di squadra: lo scrive il sito, nella lingua di chi legge. */
export function autoTitle(module: GameModule, selection: StrategySelection, locale: Locale): string {
  const label = selectionLabel(module, selection, locale);
  return locale === "en" ? `Team: ${label}` : `Squadra: ${label}`;
}

/** La pagina dell'Endgame dove sta la strategia, con la difficolta' giusta e l'ancora delle squadre. */
export function selectionPageHref(game: string, selection: StrategySelection, module?: GameModule): string {
  const base = `/${game}/${MODE_SLUGS[selection.mode]}`;
  switch (selection.mode) {
    case "death-match":
      return `${base}/${selection.target ?? ""}?difficolta=${selection.level ?? ""}#squadre`;
    case "creature-nest": {
      // il piano da aprire: il trascendente, o il terzo
      const beast = module?.creatureNest?.beasts.find((item) => item.key === selection.target);
      const floors = beast?.floors.filter((floor) => floor.transcendent === selection.transcendent) ?? [];
      const floor = floors[floors.length - 1]?.floor;
      return `${base}/${selection.target ?? ""}${floor ? `?piano=${floor}` : ""}#squadre`;
    }
    default:
      return `${base}?difficolta=${selection.level ?? ""}#squadre`;
  }
}

/**
 * La scelta nell'indirizzo del modulo di scrittura:
 * `?modalita=scontri-finali&bersaglio=red-demon&difficolta=4`, `&trascendente=1`.
 * Le pagine dell'Endgame ci portano coi campi gia' scelti.
 */
export function selectionQuery(selection: Partial<StrategySelection>): string {
  const query = new URLSearchParams();
  if (selection.mode) query.set("modalita", MODE_SLUGS[selection.mode]);
  if (selection.target) query.set("bersaglio", selection.target);
  if (selection.level !== null && selection.level !== undefined) query.set("difficolta", String(selection.level));
  if (selection.transcendent) query.set("trascendente", "1");
  const text = query.toString();
  return text ? `?${text}` : "";
}

export function newStrategyHref(game: string, selection: Partial<StrategySelection> = {}): string {
  return `/${game}/strategie/nuova${selectionQuery(selection)}`;
}

type Params = Readonly<Record<string, string | string[] | undefined>>;

/** Il contrario di `selectionQuery`: quello che l'indirizzo porta, senza controllarlo contro i dati. */
export function selectionFromParams(params: Params): Partial<StrategySelection> {
  const first = (key: string) => {
    const raw = params[key];
    return Array.isArray(raw) ? raw[0] : raw;
  };
  const mode = modeFromSlug(first("modalita"));
  const level = Number(first("difficolta"));
  return {
    ...(mode ? { mode } : {}),
    ...(first("bersaglio") ? { target: first("bersaglio")! } : {}),
    ...(Number.isInteger(level) && first("difficolta") ? { level } : {}),
    ...(first("trascendente") === "1" ? { transcendent: true } : {}),
  };
}
