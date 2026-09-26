/**
 * Funzioni pure per le pagine degli artefatti: indirizzi delle immagini, sigle
 * delle carte, probabilita' dei pacchetti, punti di potenziamento, filtri delle
 * griglie, e da dove si ottiene una carta nelle modalita' di fine gioco.
 *
 * Le fonti dell'Endgame non sono nel JSON degli artefatti: si cercano qui, nei
 * drop che le pagine Endgame gia' mostrano. Cosi' le due sezioni dicono la
 * stessa cosa per costruzione, e un drop cambiato dopo una patch si vede in
 * tutte e due.
 */

import type { ArtifactCard, ArtifactIndex, ArtifactPack, ArtifactSet } from "./artifact-types";
import type { EndgameAmount, EndgameDrop, EndgameMode } from "./endgame-types";
import type { GameModule, HeroLabel } from "./types";
import { inLingua, type Locale } from "@/lib/i18n/locale";

/* ------------------------------------------------------------ immagini -- */

/** Un'immagine degli artefatti, in public/eroi/<gioco>/artefatti/<path>. */
export function artifactImageSrc(gameSlug: string, path: string): string {
  return `/eroi/${gameSlug}/artefatti/${path}`;
}

/** L'immagine di una carta: 512 px per la pagina, 256 per le griglie. */
export function cardImageSrc(gameSlug: string, cardId: string, small = false): string {
  return artifactImageSrc(gameSlug, `${small ? "carte-piccole" : "carte"}/${cardId}.webp`);
}

/* --------------------------------------------------------------- sigle -- */

/** La sigla della carta come la scrive il gioco: «PG-1» in italiano, «CH-1» in inglese. */
export function cardCode(index: ArtifactIndex, card: Pick<ArtifactCard, "type" | "number">, locale: Locale): string {
  const prefix = inLingua(index.types[String(card.type)]?.prefix, locale) ?? "";
  return `${prefix}-${card.number}`;
}

/** Il numero di un set come lo scrive la collezione del gioco: «No.2». */
export function setCode(set: Pick<ArtifactSet, "number">): string {
  return `No.${set.number}`;
}

/* --------------------------------------------------------- pacchetti -- */

/**
 * La probabilita' di una carta in un pacchetto, in percento: peso sulla somma
 * dei pesi. DEDOTTO: l'estrazione la fa il server, e in tre pacchetti la somma
 * non e' 10.000 (10.009, 9.924 e 353).
 */
export function packChance(pack: ArtifactPack, weight: number): number | null {
  return pack.total > 0 ? (weight / pack.total) * 100 : null;
}

/** Un pacchetto di una carta sola: quelli degli eventi, che danno sempre quella. */
export function isSingleCardPack(pack: ArtifactPack): boolean {
  return pack.cards.length === 1;
}

/* ------------------------------------------------------ potenziamento -- */

/**
 * I punti per arrivare a ogni livello del set, dal 2 al massimo: totali, non
 * per passo (vedi ArtifactIndex.enhancement).
 */
export function enhancementSteps(index: ArtifactIndex, set: ArtifactSet): { level: number; points: number }[] {
  const totals = index.enhancement.classes[String(set.enhanceClass)] ?? [];
  const steps: { level: number; points: number }[] = [];
  for (let level = 2; level <= set.levels.length; level++) {
    const points = totals[level - 2];
    if (points !== undefined) steps.push({ level, points });
  }
  return steps;
}

/** Quante Carte placcate di un grado servono per un totale di punti. */
export function platesFor(points: number, platePoints: number): number {
  return platePoints > 0 ? Math.ceil(points / platePoints) : 0;
}

/** Le statistiche di tutte le carte di un set insieme. */
export function setStats(cards: readonly Pick<ArtifactCard, "stats">[]): { atk: number; def: number; hp: number } {
  return cards.reduce(
    (sum, card) => ({ atk: sum.atk + card.stats.atk, def: sum.def + card.stats.def, hp: sum.hp + card.stats.hp }),
    { atk: 0, def: 0, hp: 0 },
  );
}

/* ------------------------------------------------------------- griglie -- */

/**
 * Quello che arriva al browser per la griglia dei set: nomi gia' nella lingua
 * della pagina, l'effetto al livello massimo e i codici dei filtri. I testi di
 * tutti i livelli restano sul server.
 */
export interface ArtifactSetSummary {
  readonly number: number;
  readonly name: string;
  readonly event: string | null;
  readonly cards: readonly { readonly id: string; readonly grade: number; readonly image: boolean }[];
  /** l'effetto al livello massimo, col markup del gioco */
  readonly effect: string;
  readonly levels: number;
  readonly contents: readonly number[];
  readonly races: readonly number[];
  readonly factions: readonly number[];
  readonly misc: readonly number[];
}

export interface ArtifactCardSummary {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly type: number;
  readonly grade: number;
  /** il numero del set, per il filtro «in un set» e per la ricerca */
  readonly set: number | null;
  readonly setName: string | null;
  readonly image: boolean;
}

/** Minuscole e senza accenti: «Città» si trova scrivendo «citta». */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export interface SetFilters {
  search?: string;
  content?: number | null;
  race?: number | null;
  faction?: number | null;
  misc?: number | null;
}

export function filterSets(sets: readonly ArtifactSetSummary[], filters: SetFilters): ArtifactSetSummary[] {
  const words = fold(filters.search ?? "").split(/\s+/).filter(Boolean);
  return sets.filter((set) => {
    if (filters.content != null && !set.contents.includes(filters.content)) return false;
    if (filters.race != null && !set.races.includes(filters.race)) return false;
    if (filters.faction != null && !set.factions.includes(filters.faction)) return false;
    if (filters.misc != null && !set.misc.includes(filters.misc)) return false;
    if (words.length === 0) return true;
    const haystack = fold(`${set.name} ${set.event ?? ""} no.${set.number}`);
    return words.every((word) => haystack.includes(word));
  });
}

export interface CardFilters {
  search?: string;
  type?: number | null;
  grade?: number | null;
  /** true = solo le carte in un set, false = solo quelle fuori */
  inSet?: boolean | null;
}

export function filterCards(cards: readonly ArtifactCardSummary[], filters: CardFilters): ArtifactCardSummary[] {
  const words = fold(filters.search ?? "").split(/\s+/).filter(Boolean);
  return cards.filter((card) => {
    if (filters.type != null && card.type !== filters.type) return false;
    if (filters.grade != null && card.grade !== filters.grade) return false;
    if (filters.inSet != null && (card.set !== null) !== filters.inSet) return false;
    if (words.length === 0) return true;
    const haystack = fold(`${card.name} ${card.code} ${card.setName ?? ""}`);
    return words.every((word) => haystack.includes(word));
  });
}

/** Quante voci ha ogni valore di un campo: i numeri sui pulsanti dei filtri. */
export function countBy<T>(items: readonly T[], values: (item: T) => readonly (number | string)[]): Map<number | string, number> {
  const counts = new Map<number | string, number>();
  for (const item of items) for (const value of values(item)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

/* ------------------------------------------------------------- endgame -- */

/**
 * Dove una carta cade nelle modalita' di fine gioco.
 *
 * `how`: drop = estrazione di fine battaglia, leader = al capo del gruppo che ha
 * trovato lo Scontro finale, clear / first-clear = ricompensa di completamento,
 * guaranteed = vittoria garantita, box = dentro una cassa che la difficolta'
 * da'. `chance` in percento, dove il gioco da' un peso.
 */
export interface CardSource {
  readonly mode: EndgameMode;
  readonly href: string;
  /** il boss o la bestia; null per Re Demone e Divinita', che sono uno scontro solo */
  readonly target: HeroLabel | null;
  readonly stage: HeroLabel | null;
  readonly how: "drop" | "leader" | "clear" | "first-clear" | "guaranteed" | "box";
  readonly chance: number | null;
}

function inDrops(entries: readonly EndgameDrop[], id: string): EndgameDrop | undefined {
  return entries.find((entry) => entry.id === id || Object.values(entry.byRegion ?? {}).includes(id));
}

function inAmounts(amounts: readonly EndgameAmount[], id: string): boolean {
  return amounts.some((amount) => amount.id === id);
}

/** Le casse che contengono la carta, con la probabilita' dentro la cassa. */
function boxesWith(boxes: Readonly<Record<string, readonly EndgameDrop[]>>, id: string): Map<string, number | null> {
  const found = new Map<string, number | null>();
  for (const [box, entries] of Object.entries(boxes)) {
    const entry = inDrops(entries, id);
    if (!entry) continue;
    const total = entries.reduce((sum, item) => sum + item.weight, 0);
    found.set(box, total > 0 ? (entry.weight / total) * 100 : null);
  }
  return found;
}

export function cardSources(gameModule: GameModule, gameSlug: string, cardId: string): CardSource[] {
  const out: CardSource[] = [];

  for (const boss of gameModule.deathMatch?.bosses ?? []) {
    for (const level of boss.difficulties) {
      const base = {
        mode: "death-match" as const,
        href: `/${gameSlug}/scontri-finali/${boss.key}?difficolta=${level.level}#difficolta`,
        target: boss.name,
        stage: level.name,
      };
      const drop = inDrops(level.drops.entries, cardId);
      if (drop) out.push({ ...base, how: "drop", chance: drop.weight / 100 });
      const leader = inDrops(level.leader.entries, cardId);
      if (leader) out.push({ ...base, how: "leader", chance: leader.weight / 100 });
      if (inAmounts(level.guaranteed, cardId)) out.push({ ...base, how: "guaranteed", chance: null });
    }
  }

  for (const beast of gameModule.creatureNest?.beasts ?? []) {
    for (const floor of beast.floors) {
      const base = {
        mode: "creature-nest" as const,
        href: `/${gameSlug}/bestie-demoniache/${beast.key}?piano=${floor.floor}#piani`,
        target: beast.name,
        stage: floor.title,
      };
      const drop = inDrops(floor.drops.entries, cardId);
      if (drop) out.push({ ...base, how: "drop", chance: drop.weight / 100 });
      if (inAmounts(floor.clear, cardId)) out.push({ ...base, how: "clear", chance: null });
      if (inAmounts(floor.firstClear, cardId)) out.push({ ...base, how: "first-clear", chance: null });
    }
  }

  const modes = [
    { mode: "demon-king" as const, data: gameModule.demonKing, path: "re-demone" },
    { mode: "supreme-deity" as const, data: gameModule.supremeDeity, path: "divinita-suprema" },
  ];
  for (const { mode, data, path } of modes) {
    if (!data) continue;
    const boxes = boxesWith(data.boxes, cardId);
    for (const level of data.difficulties) {
      const base = {
        mode,
        href: `/${gameSlug}/${path}?difficolta=${level.level}#difficolta`,
        target: null,
        stage: level.name,
      };
      const drop = inDrops(level.drops.entries, cardId);
      if (drop) out.push({ ...base, how: "drop", chance: drop.weight / 100 });
      if (inAmounts(level.clear, cardId)) out.push({ ...base, how: "clear", chance: null });
      for (const [box, chance] of boxes) {
        if (inAmounts(level.clear, box) || inDrops(level.drops.entries, box)) out.push({ ...base, how: "box", chance });
      }
    }
  }

  return out;
}
