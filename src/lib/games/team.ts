/**
 * La squadra: come si influenzano gli eroi in campo, con le loro passive.
 *
 * Richiesta dell'utente del 03/10 (il contratto e il perche' stanno in
 * team-types.ts). Funzioni pure, separate dalla pagina come quelle del Randomizer:
 * la squadra la forma il browser, in tempo reale, ma le regole si verificano coi
 * test.
 *
 * Cosa si valuta, per ogni passiva di ogni eroe in squadra:
 *   - se e' accesa: dove si gioca (i codici del client e la frase), la panchina
 *     (una passiva che non «si attiva anche in uno slot secondario» aspetta che
 *     l'eroe entri), la reliquia (si puo' spegnere), e le regole del gioco su
 *     Comandamenti, Grazie e Unita' (se ce ne sono due, vale quella dell'eroe piu'
 *     a sinistra: per le Grazie e le Unita' se sono dello stesso tipo)
 *   - frase per frase: a quali compagni va l'effetto, e quali compagni fanno
 *     scattare le condizioni («per ogni alleato applicabile in battaglia», «se gli
 *     alleati in battaglia sono tutti Demoni»)
 * Ne escono due relazioni fra compagni: chi DA' a chi (l'effetto va a lui) e chi
 * FA SCATTARE chi (la sua presenza accende o fa crescere la passiva dell'altro).
 * I suggerimenti contano quante relazioni nuove porta un eroe in un posto.
 *
 * Cosa si e' scelto, e non e' scritto dal gioco:
 *   - «alleati» comprende l'eroe stesso, come nel gioco («Increases allies'
 *     Attack»); dove la frase dice «other than the hero», no
 *   - chi e' in panchina non «partecipa alla battaglia»: non conta per le
 *     condizioni dei compagni, salvo le frasi che dicono «including those in the
 *     Secondary Slot»
 *   - «with a Unity effect» vuol dire chi ha un'Unita' fra le abilita' speciali (il
 *     giapponese del gioco dice «団結効果を持つ», chi possiede l'effetto Unita')
 */

import { inLingua, type Locale } from "../i18n/locale";
import type { HeroFate, HeroFatesIndex } from "./hero-fates-types";
import type { TermMember } from "./hero-terms";
import type { HeroTermGroup } from "./hero-terms-types";
import type { HeroContextIndex, HeroEntry, HeroSpecialsIndex } from "./types";
import type {
  TeamCondition,
  TeamContent,
  TeamIndex,
  TeamLink,
  TeamPlace,
  TeamSource,
  TeamWho,
} from "./team-types";

/* ------------------------------------------------------------- le frasi -- */

/** Una frase di un testo del gioco, senza markup. */
export interface Sentence {
  readonly note: boolean;
  readonly text: string;
}

const TAG = /\[(?:[0-9A-Fa-f]{6}|-|b|\/b|i|\/i)\]/g;
const CUT = /(?<=[.!])\s+(?=[A-ZÀ-ÖØ-Þ(\[<«"])/g;
const count = (text: string, char: string) => text.split(char).length - 1;

/**
 * Manda a capo le note «※» che cominciano a meta' riga: la stessa regola di
 * `note_a_capo` di parole_blu.py. Il testo porta gli a capo come barra-n.
 */
function notesOnTheirLine(text: string): string {
  return text
    .split("\\n")
    .map((row) => {
      const at = row.indexOf("※");
      const before = at > 0 ? row.slice(0, at).replace(/\\n/g, "\n").replace(TAG, "").trim() : "";
      return before ? `${row.slice(0, at)}\\n${row.slice(at)}` : row;
    })
    .join("\\n");
}

/**
 * Le frasi di un testo del gioco: la stessa regola di `frasi` di
 * script/squadra.py, e l'import controlla che le due diano le stesse frasi.
 *
 * Una riga che comincia con «※» e' una nota, intera. Una riga che non chiude
 * (niente punto, due punti o parentesi in fondo) e la seguente che comincia
 * minuscola o con una cifra sono una riga sola («up to\n30% whenever...»). Le
 * altre righe si dividono dopo un punto seguito da una maiuscola o da una
 * parentesi, ma non dentro una parentesi, e un pezzo che comincia con «(» si
 * attacca alla frase prima.
 */
export function sentencesOf(text: string): Sentence[] {
  const flat = notesOnTheirLine(text).replace(/\\n/g, "\n").replace(TAG, "");
  const rows: string[] = [];
  for (const raw of flat.split("\n")) {
    const row = raw.trim();
    const last = rows[rows.length - 1];
    if (last && row && !last.startsWith("※") && !/[.!:)\]]$/.test(last) && /^[a-zà-öø-ÿ0-9]/.test(row)) {
      rows[rows.length - 1] = `${last} ${row}`;
    } else {
      rows.push(row);
    }
  }
  const out: { note: boolean; text: string }[] = [];
  for (const row of rows) {
    if (!row) continue;
    if (row.startsWith("※")) {
      out.push({ note: true, text: row });
      continue;
    }
    const pieces: string[] = [];
    let from = 0;
    for (const match of row.matchAll(CUT)) {
      const before = row.slice(0, match.index);
      if (count(before, "(") <= count(before, ")")) {
        pieces.push(row.slice(from, match.index));
        from = match.index + match[0].length;
      }
    }
    pieces.push(row.slice(from));
    for (const raw of pieces) {
      const piece = raw.trim();
      if (!piece) continue;
      const previous = out[out.length - 1];
      if (piece.startsWith("(") && previous && !previous.note) previous.text = `${previous.text} ${piece}`;
      else out.push({ note: false, text: piece });
    }
  }
  return out;
}

/* ------------------------------------------------------------ la squadra -- */

/** Quanti eroi in squadra, come nel gioco; il quarto puo' stare in panchina. */
export const TEAM_SLOTS = 4;

/** Quello che serve di un eroe per sapere a chi vale una frase. */
export interface TeamHero extends TermMember {
  /** ha un'Unita' fra le abilita' speciali */
  readonly unity: boolean;
}

export interface TeamSetup {
  /** gli eroi in campo, da sinistra; null un posto vuoto */
  readonly mains: readonly (string | null)[];
  /** gli Slot associazione, uno per posto */
  readonly associates: readonly (string | null)[];
  readonly content: TeamContent;
  /** il quarto eroe parte in panchina (storia, PvP normale) o in campo (boss, Bestie) */
  readonly bench: boolean;
  /** il rango della Mossa finale, 1-6: alcune Uniche cambiano con lui */
  readonly ultimate: number;
  /** le Reliquie sacre create */
  readonly relics: boolean;
}

export const CONTENTS: readonly TeamContent[] = ["pve", "pvp", "destroy", "nest"];

export function emptySetup(): TeamSetup {
  return {
    mains: [null, null, null, null],
    associates: [null, null, null, null],
    content: "pve",
    bench: true,
    ultimate: 6,
    relics: true,
  };
}

/* -------------------------------------------------- l'indirizzo e il salvataggio -- */

/**
 * La squadra nell'indirizzo: `?s=<4 eroi>&a=<4 associati>&c=pvp&p=0&u=6&r=1`. Gli
 * eroi separati da punti, un posto vuoto e' vuoto («1095001..1045003.»). Solo i
 * valori diversi dalla partenza; `parseSetup` controlla tutto, perche'
 * l'indirizzo lo puo' scrivere chiunque.
 */
export function setupToQuery(setup: TeamSetup): string {
  const base = emptySetup();
  const params = new URLSearchParams();
  const list = (ids: readonly (string | null)[]) => ids.map((id) => id ?? "").join(".");
  if (setup.mains.some(Boolean)) params.set("s", list(setup.mains));
  if (setup.associates.some(Boolean)) params.set("a", list(setup.associates));
  if (setup.content !== base.content) params.set("c", setup.content);
  if (setup.bench !== base.bench) params.set("p", setup.bench ? "1" : "0");
  if (setup.ultimate !== base.ultimate) params.set("u", String(setup.ultimate));
  if (setup.relics !== base.relics) params.set("r", setup.relics ? "1" : "0");
  return params.toString();
}

export function parseSetup(
  read: (key: string) => string | null | undefined,
  known: (id: string) => boolean,
): TeamSetup {
  const base = emptySetup();
  const ids = (value: string | null | undefined): (string | null)[] => {
    const parts = (value ?? "").split(".").slice(0, TEAM_SLOTS);
    return Array.from({ length: TEAM_SLOTS }, (_, i) => {
      const id = parts[i] ?? "";
      return /^\d{7}$/.test(id) && known(id) ? id : null;
    });
  };
  const content = read("c");
  const ultimate = Number(read("u"));
  return {
    mains: ids(read("s")),
    associates: ids(read("a")),
    content: CONTENTS.includes(content as TeamContent) ? (content as TeamContent) : base.content,
    bench: read("p") === "0" ? false : read("p") === "1" ? true : base.bench,
    ultimate: Number.isInteger(ultimate) && ultimate >= 1 && ultimate <= 6 ? ultimate : base.ultimate,
    relics: read("r") === "0" ? false : base.relics,
  };
}

/* ----------------------------------------------------------- la valutazione -- */

/** Un compagno controllato da una frase: ne fa parte o no. */
export interface MemberCheck {
  readonly hero: string;
  readonly ok: boolean;
}

export interface ConditionResult {
  readonly condition: TeamCondition;
  readonly met: boolean;
  /** quanti dei controllati ne fanno parte */
  readonly count: number;
  readonly members: readonly MemberCheck[];
}

/** Perche' una frase o una passiva e' spenta. */
export type OffReason =
  | "content" // non vale dove si gioca
  | "bench" // l'eroe e' in panchina e la passiva aspetta che entri
  | "fromBench" // vale solo entrando dalla panchina, e l'eroe parte in campo
  | "relics" // reliquie spente
  | "leftmost" // c'e' gia' un Comandamento, o una Grazia o un'Unita' dello stesso tipo, piu' a sinistra
  | "condition" // una condizione «tutti» non e' rispettata
  | "nobody"; // nessuno in squadra la fa scattare

export interface LinkResult {
  readonly link: TeamLink;
  readonly active: boolean;
  readonly off?: OffReason;
  /** i compagni in campo (tolto l'eroe), e se ricevono l'effetto */
  readonly receivers: readonly MemberCheck[];
  readonly conditions: readonly ConditionResult[];
}

export interface SourceResult {
  readonly source: TeamSource;
  readonly active: boolean;
  readonly off?: OffReason;
  /** per «leftmost»: l'eroe la cui abilita' vale al suo posto */
  readonly by?: string;
  /** il testo che vale al rango scelto, posizione in `TeamIndex.texts`, o -1 */
  readonly text: number;
  readonly links: readonly LinkResult[];
}

export interface MemberResult {
  readonly hero: string;
  readonly slot: number;
  readonly bench: boolean;
  /** le razze con quelle aggiunte dalle passive («the additional race Demon») */
  readonly races: readonly number[];
  readonly sources: readonly SourceResult[];
}

/** Una relazione fra due compagni, per una frase di una passiva. */
export interface Influence {
  readonly from: string;
  readonly to: string;
  readonly kind: TeamSource["kind"];
  readonly source: string;
  readonly sentence: number;
}

export interface TeamAnalysis {
  readonly members: readonly MemberResult[];
  /** l'effetto va da `from` a `to` */
  readonly gives: readonly Influence[];
  /** `from` fa scattare (o crescere) la passiva di `to` */
  readonly enables: readonly Influence[];
  /** le condizioni «tutti» rispettate e quelle no */
  readonly allMet: number;
  readonly allBroken: number;
  /** abilita' speciali spente dalla regola dell'eroe piu' a sinistra */
  readonly leftmostOff: number;
}

export interface TeamData {
  readonly team: TeamIndex;
  readonly heroes: ReadonlyMap<string, TeamHero>;
}

/** Gli eroi del roster con quello che serve alla squadra: razza, caratteristiche, attributo, Unita'. */
export function teamHeroesOf(
  heroes: readonly HeroEntry[],
  context: HeroContextIndex,
  specials: HeroSpecialsIndex | undefined,
): Map<string, TeamHero> {
  return new Map(
    heroes.map((hero) => {
      const own = context.heroes[hero.id];
      const unity = (specials?.heroes[hero.id] ?? []).some((id) => specials?.abilities[id]?.kind === "unita");
      return [
        hero.id,
        {
          id: hero.id,
          group: hero.group,
          race: own?.race ?? null,
          factions: own?.factions ?? [],
          attribute: own?.attribute ?? null,
          unity,
        },
      ];
    }),
  );
}

/** Il testo di una passiva al rango della Mossa finale scelto. */
export function textAt(source: TeamSource, ultimate: number): number {
  let text = -1;
  for (const [from, index] of source.steps) if (from <= ultimate) text = index;
  return text;
}

/** I codici del client (passiveConditions) dicono che la passiva vale dove si gioca? */
export function codesAllow(codes: readonly number[], content: TeamContent): boolean {
  if (codes.includes(3) && content !== "pvp") return false;
  if (codes.includes(4) && content === "pvp") return false;
  if (codes.includes(5) && content !== "destroy") return false;
  if (codes.includes(6) && content === "destroy") return false;
  if (codes.includes(8) && content !== "nest") return false;
  if (codes.includes(9) && content === "nest") return false;
  return true;
}

/** La frase dice che vale dove si gioca? «In PVE» vale anche negli altri contenuti contro il computer. */
export function placesAllow(link: TeamLink, content: TeamContent): boolean {
  const here = (place: TeamPlace) => place === content || (place === "pve" && content !== "pvp");
  if (link.only?.length && !link.only.some(here)) return false;
  if (link.except?.some((place) => place === content)) return false;
  return true;
}

/** Il nome di un tipo di Grazia o Unita', senza markup: «Grazia del Lampo». */
function specialType(source: TeamSource): string {
  return (source.name.en ?? source.id).replace(/\[\/?b\]/g, "").trim();
}

function racesOf(hero: TeamHero): number[] {
  return hero.race === null ? [] : [hero.race];
}

/** Fa parte del gruppo di una nota «applicabili»: come `inGroup`, ma con le razze aggiunte. */
function inTeamGroup(group: HeroTermGroup, hero: TeamHero, races: readonly number[], giver: string): boolean {
  const named =
    (group.self && hero.id === giver) ||
    races.some((race) => group.races.includes(race)) ||
    hero.factions.some((faction) => group.factions.includes(faction)) ||
    group.characters.includes(hero.group);
  if (!named) return false;
  return group.attributes.length === 0 || (hero.attribute !== null && group.attributes.includes(hero.attribute));
}

/** Un compagno e' fra quelli che la frase nomina? */
export function matches(
  who: TeamWho,
  hero: TeamHero,
  giver: TeamHero,
  group: HeroTermGroup | null,
  races: (id: string) => readonly number[],
): boolean {
  const mine = races(hero.id);
  let named = false;
  if (who.allies) named = true;
  if (!named && who.group && group) named = inTeamGroup(group, hero, mine, giver.id);
  if (!named && who.races) named = mine.some((race) => who.races!.includes(race));
  if (!named && who.factions) named = hero.factions.some((faction) => who.factions!.includes(faction));
  if (!named && who.characters) named = who.characters.includes(hero.group);
  if (!named && who.attributes) named = hero.attribute !== null && who.attributes.includes(hero.attribute);
  if (!named && who.sameRace) named = mine.some((race) => races(giver.id).includes(race));
  if (!named) return false;
  return !who.unity || hero.unity;
}

function checkCondition(
  condition: TeamCondition,
  link: TeamLink,
  giver: TeamHero,
  field: readonly TeamHero[],
  bench: TeamHero | null,
  group: HeroTermGroup | null,
  races: (id: string) => readonly number[],
): ConditionResult {
  const pool = link.withBench && bench ? [...field, bench] : [...field];
  const who = condition.who;
  // «If an allied Percival...»: un altro, non l'eroe stesso
  const skipGiver = link.notSelf || (who.characters && !who.allies);
  const checked = pool.filter((hero) => !(skipGiver && hero.id === giver.id));
  if (who.differentRaces) {
    // tutti di razze diverse: una razza (anche aggiunta) non si ripete
    const seen = new Map<number, number>();
    for (const hero of checked) for (const race of races(hero.id)) seen.set(race, (seen.get(race) ?? 0) + 1);
    const members = checked.map((hero) => ({
      hero: hero.id,
      ok: races(hero.id).length > 0 && races(hero.id).every((race) => seen.get(race) === 1),
    }));
    const okCount = members.filter((m) => m.ok).length;
    return { condition, met: okCount === members.length, count: okCount, members };
  }
  const members = checked.map((hero) => ({ hero: hero.id, ok: matches(who, hero, giver, group, races) }));
  const okCount = members.filter((m) => m.ok).length;
  const met = condition.kind === "all" ? okCount === members.length : okCount > 0;
  return { condition, met, count: okCount, members };
}

/**
 * Come si influenzano gli eroi di una squadra. I posti vuoti si saltano; il
 * quarto, se `setup.bench`, e' in panchina.
 */
export function analyzeTeam(setup: TeamSetup, data: TeamData): TeamAnalysis {
  const { team, heroes } = data;
  const placed = setup.mains
    .map((id, slot) => (id ? { hero: heroes.get(id), slot } : null))
    .filter((x): x is { hero: TeamHero; slot: number } => !!x?.hero);
  const isBench = (slot: number) => setup.bench && slot === TEAM_SLOTS - 1;
  const field = placed.filter((p) => !isBench(p.slot)).map((p) => p.hero);
  const bench = placed.find((p) => isBench(p.slot))?.hero ?? null;

  // 1. le abilita' speciali: se due sono dello stesso tipo, vale quella piu' a sinistra
  const firstHolder = new Map<string, string>();
  const leftmostBy = new Map<string, string>(); // `${hero}:${source}` -> chi vale al suo posto
  for (const { hero } of placed) {
    for (const source of team.heroes[hero.id] ?? []) {
      if (source.kind !== "special") continue;
      const key =
        source.special === "comandamento"
          ? "comandamento"
          : source.special === "grazia" || source.special === "unita"
            ? `${source.special}:${specialType(source)}`
            : null;
      if (!key) continue;
      const first = firstHolder.get(key);
      if (first === undefined) firstHolder.set(key, hero.id);
      else if (first !== hero.id) leftmostBy.set(`${hero.id}:${source.id}`, first);
    }
  }

  // 2. lo stato delle passive, senza le condizioni sui compagni
  const sourceState = (hero: TeamHero, slot: number, source: TeamSource): { off?: OffReason; by?: string } => {
    if (source.kind === "relic" && !setup.relics) return { off: "relics" };
    if (!codesAllow(source.conditions, setup.content)) return { off: "content" };
    const by = leftmostBy.get(`${hero.id}:${source.id}`);
    if (by) return { off: "leftmost", by };
    if (isBench(slot) && !source.conditions.includes(2)) return { off: "bench" };
    return {};
  };

  // 3. le razze aggiunte («the additional race Demon»), con le condizioni sulle razze di partenza
  const baseRaces = (id: string) => racesOf(heroes.get(id)!);
  const races = new Map<string, number[]>();
  for (const { hero, slot } of placed) {
    const mine = new Set(racesOf(hero));
    for (const source of team.heroes[hero.id] ?? []) {
      if (sourceState(hero, slot, source).off) continue;
      const text = team.texts[textAt(source, setup.ultimate)];
      for (const link of text?.links ?? []) {
        if (!link.extraRaces?.length) continue;
        const group = text!.group === null ? null : team.groups[text!.group]!;
        const ok = (link.conditions ?? [])
          .filter((c) => c.kind !== "each")
          .every((c) => checkCondition(c, link, hero, field, bench, group, baseRaces).met);
        if (ok) for (const race of link.extraRaces) mine.add(race);
      }
    }
    races.set(hero.id, [...mine].sort((a, b) => a - b));
  }
  const racesNow = (id: string) => races.get(id) ?? baseRaces(id);

  // 4. frase per frase
  const gives = new Map<string, Influence>();
  const enables = new Map<string, Influence>();
  let allMet = 0;
  let allBroken = 0;
  const members: MemberResult[] = placed.map(({ hero, slot }) => {
    const onBench = isBench(slot);
    const sources: SourceResult[] = (team.heroes[hero.id] ?? []).map((source) => {
      const state = sourceState(hero, slot, source);
      const textIndex = textAt(source, setup.ultimate);
      const text = team.texts[textIndex];
      const group = text && text.group !== null ? team.groups[text.group]! : null;
      const links: LinkResult[] = (text?.links ?? []).map((link) => {
        const conditions = (link.conditions ?? []).map((c) =>
          checkCondition(c, link, hero, field, bench, group, racesNow),
        );
        const receivers = field
          .filter((other) => other.id !== hero.id)
          .map((other) => ({
            hero: other.id,
            ok: (link.receives ?? []).some((who) => matches(who, other, hero, group, racesNow)),
          }));
        let off: OffReason | undefined = state.off;
        if (!off && !placesAllow(link, setup.content)) off = "content";
        if (!off && link.fromBench && !onBench) off = "fromBench";
        if (!off && conditions.some((c) => c.condition.kind === "all" && !c.met)) off = "condition";
        if (!off && conditions.some((c) => c.condition.kind !== "all" && !c.met)) off = "nobody";
        const active = !off;
        // le condizioni «tutti» contano anche quando la passiva e' accesa per il resto
        if (!state.off && placesAllow(link, setup.content)) {
          for (const c of conditions) {
            if (c.condition.kind !== "all") continue;
            if (c.met) allMet++;
            else allBroken++;
          }
        }
        if (active) {
          for (const r of receivers) {
            if (!r.ok) continue;
            const key = `${hero.id}>${r.hero}`;
            if (!gives.has(key)) {
              gives.set(key, { from: hero.id, to: r.hero, kind: source.kind, source: source.id, sentence: link.sentence });
            }
          }
          for (const c of conditions) {
            for (const m of c.members) {
              if (!m.ok || m.hero === hero.id) continue;
              const key = `${m.hero}>${hero.id}`;
              if (!enables.has(key)) {
                enables.set(key, { from: m.hero, to: hero.id, kind: source.kind, source: source.id, sentence: link.sentence });
              }
            }
          }
        }
        return { link, active, off, receivers, conditions };
      });
      return { source, active: !state.off, off: state.off, by: state.by, text: textIndex, links };
    });
    return { hero: hero.id, slot, bench: onBench, races: racesNow(hero.id), sources };
  });

  return {
    members,
    gives: [...gives.values()],
    enables: [...enables.values()],
    allMet,
    allBroken,
    leftmostOff: leftmostBy.size,
  };
}

/**
 * Quanto si incastra una squadra: una relazione per coppia di compagni (chi da' a
 * chi, chi fa scattare chi), due punti per ogni condizione «tutti» rispettata e
 * due in meno per ognuna infranta, uno in meno per ogni abilita' speciale spenta
 * da quella di un compagno piu' a sinistra. E' un conteggio, non un giudizio: dice
 * quante passive lavorano per i compagni, non quanto valgono.
 */
export function synergyScore(analysis: TeamAnalysis): number {
  return analysis.gives.length + analysis.enables.length + 2 * analysis.allMet - 2 * analysis.allBroken - analysis.leftmostOff;
}

export interface Suggestion {
  readonly hero: string;
  /** quanto sale il punteggio mettendolo nel posto */
  readonly gain: number;
  /** le relazioni nuove che lo riguardano */
  readonly gives: readonly Influence[];
  readonly receives: readonly Influence[];
  readonly enables: readonly Influence[];
  readonly enabledBy: readonly Influence[];
}

/**
 * Gli eroi che si incastrano meglio in un posto della squadra: per ogni candidato
 * (un personaggio che non c'e' gia', associati compresi) quanto sale il
 * punteggio. Si tengono solo quelli che portano qualcosa, dal piu' alto; a parita'
 * chi da' a piu' compagni, poi l'ordine di `candidates`. Di un personaggio si
 * tiene la versione migliore: tre Drole di fila riempirebbero l'elenco con lo
 * stesso posto in squadra (nella prima prova, 6 nomi su 12 erano doppi).
 */
export function suggest(
  setup: TeamSetup,
  slot: number,
  candidates: readonly TeamHero[],
  data: TeamData,
  limit = 12,
): Suggestion[] {
  const used = new Set(
    [...setup.mains.filter((_, i) => i !== slot), ...setup.associates]
      .filter((id): id is string => !!id)
      .map((id) => data.heroes.get(id)?.group),
  );
  const base = synergyScore(analyzeTeam({ ...setup, mains: setup.mains.map((id, i) => (i === slot ? null : id)) }, data));
  const out: Suggestion[] = [];
  for (const candidate of candidates) {
    if (used.has(candidate.group)) continue;
    const mains = setup.mains.map((id, i) => (i === slot ? candidate.id : id));
    const analysis = analyzeTeam({ ...setup, mains }, data);
    const gain = synergyScore(analysis) - base;
    if (gain <= 0) continue;
    out.push({
      hero: candidate.id,
      gain,
      gives: analysis.gives.filter((i) => i.from === candidate.id),
      receives: analysis.gives.filter((i) => i.to === candidate.id),
      enables: analysis.enables.filter((i) => i.from === candidate.id),
      enabledBy: analysis.enables.filter((i) => i.to === candidate.id),
    });
  }
  const seen = new Set<string>();
  return out
    .map((s, order) => ({ s, order }))
    .sort((a, b) => b.s.gain - a.s.gain || b.s.gives.length - a.s.gives.length || a.order - b.order)
    .filter(({ s }) => {
      const group = data.heroes.get(s.hero)!.group;
      if (seen.has(group)) return false;
      seen.add(group);
      return true;
    })
    .slice(0, limit)
    .map(({ s }) => s);
}

/* ------------------------------------------------------------- associati -- */

/** Il legame fra un eroe e il suo associato, se c'e'. */
export function fateOf(fates: HeroFatesIndex, main: string, associate: string): HeroFate | undefined {
  return fates.heroes[main]?.find(([other]) => other === associate);
}

/** Gli eroi con cui `main` ha un legame, nell'ordine del gioco, tolti i personaggi gia' in squadra. */
export function fateSuggestions(
  fates: HeroFatesIndex,
  main: string,
  heroes: ReadonlyMap<string, TeamHero>,
  usedGroups: ReadonlySet<string>,
): HeroFate[] {
  return (fates.heroes[main] ?? []).filter(([other]) => {
    const hero = heroes.get(other);
    return hero && !usedGroups.has(hero.group);
  });
}

/** La frase di una relazione, nella lingua della pagina (l'inglese se l'italiano non si e' appaiato). */
export function sentenceText(team: TeamIndex, index: number, locale: Locale): { text: string; english: boolean } {
  const label = team.sentences[index];
  const mine = inLingua(label, locale);
  if (!label || !mine) return { text: "", english: false };
  return { text: mine, english: locale === "it" && !label.it };
}
