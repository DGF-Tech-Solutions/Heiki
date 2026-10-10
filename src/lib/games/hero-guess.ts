/**
 * «Indovina l'eroe»: il gioco degli indizi sul modello di Loldle e Genshindle.
 *
 * Richiesta dell'utente del 27/09, nel gruppo Strumenti: si scrive il nome di un
 * eroe, e per ogni categoria una casella dice se ha la cosa in comune con quello
 * da indovinare (verde), in parte (giallo) o no (rosso), con una freccia dove i
 * valori hanno un ordine. Categorie chieste dall'utente: attributo, razza,
 * caratteristica, grado di partenza, anno d'uscita; aggiunte qui, con dati che
 * il sito ha gia': il personaggio (le versioni di Meliodas si somigliano), il
 * grado massimo (UR o LR) e l'abilita' speciale (Comandamento, Grazia, Unita',
 * Talento). L'anno e' diventato la data d'uscita globale: verde la stessa
 * uscita, giallo lo stesso anno, e la freccia dice se cercare prima o dopo.
 * Misurato il 27/09: con queste otto categorie restano indistinguibili 12
 * gruppetti di 2 o 3 eroi (25 su 375), e li separa il tentativo.
 *
 * Funzioni pure, provate dai test; la pagina e il browser le usano.
 */

import type { HeroEntry, HeroContextIndex, HeroSpecialsIndex, ReleaseCalendar } from "./types";

/** Quello che del roster serve al gioco, per un eroe. */
export interface GuessHero {
  readonly id: string;
  /** il personaggio: le versioni lo condividono */
  readonly group: string;
  /** codice del client: 1 Forza, 2 PS, 3 Velocita', 4 Luce, 5 Oscurita', 6 Luce e Oscurita' */
  readonly attribute: number | null;
  readonly race: number | null;
  readonly factions: readonly number[];
  /** come esce dal gacha: R, SR, SSR, UR */
  readonly obtainedAs: string;
  /** il grado che puo' raggiungere: UR o LR */
  readonly max: string;
  /** chiave del tipo di abilita' speciale (comandamento, grazia, unita, talento), o null */
  readonly special: string | null;
  /** uscita globale, AAAA-MM-GG */
  readonly date: string | null;
}

export const CLUES = [
  "personaggio",
  "attributo",
  "razza",
  "caratteristiche",
  "uscita",
  "massimo",
  "speciale",
  "data",
] as const;
export type ClueKey = (typeof CLUES)[number];

export type Verdict = "giusto" | "vicino" | "sbagliato";

/** Dove cercare: "su" = quello da indovinare ha un valore piu' alto (un grado sopra, un'uscita dopo). */
export type Direction = "su" | "giu";

export interface Clue {
  readonly verdict: Verdict;
  readonly direction?: Direction;
}

/** L'ordine dei gradi d'uscita. */
export const GRADES: readonly string[] = ["R", "SR", "SSR", "UR"];

/** L'attributo doppio (Tristan): vale Luce E Oscurita'. */
export const DUAL_ATTRIBUTE = 6;
const LIGHT = 4;
const DARK = 5;

export function attributesOf(code: number | null): number[] {
  if (code === null) return [];
  return code === DUAL_ATTRIBUTE ? [LIGHT, DARK] : [code];
}

/** Uguali, in parte, o niente in comune; due insiemi vuoti sono uguali. */
function sets(a: readonly number[], b: readonly number[]): Verdict {
  const same = a.length === b.length && a.every((x) => b.includes(x));
  if (same) return "giusto";
  return a.some((x) => b.includes(x)) ? "vicino" : "sbagliato";
}

function exact(a: unknown, b: unknown): Clue {
  return { verdict: a === b ? "giusto" : "sbagliato" };
}

function ordered(guess: number, answer: number): Direction | undefined {
  if (answer > guess) return "su";
  if (answer < guess) return "giu";
  return undefined;
}

/** Cosa dicono le caselle di un tentativo. */
export function compareHeroes(guess: GuessHero, answer: GuessHero): Record<ClueKey, Clue> {
  const grade = ordered(GRADES.indexOf(guess.obtainedAs), GRADES.indexOf(answer.obtainedAs));

  let date: Clue = { verdict: "sbagliato" };
  if (guess.date && answer.date) {
    if (guess.date === answer.date) date = { verdict: "giusto" };
    else {
      const direction = answer.date > guess.date ? "su" : "giu";
      date = { verdict: guess.date.slice(0, 4) === answer.date.slice(0, 4) ? "vicino" : "sbagliato", direction };
    }
  }

  return {
    personaggio: exact(guess.group, answer.group),
    attributo: { verdict: sets(attributesOf(guess.attribute), attributesOf(answer.attribute)) },
    razza: exact(guess.race, answer.race),
    caratteristiche: { verdict: sets(guess.factions, answer.factions) },
    uscita: grade ? { verdict: "sbagliato", direction: grade } : { verdict: "giusto" },
    massimo: exact(guess.max, answer.max),
    speciale: exact(guess.special, answer.special),
    data: date,
  };
}

/**
 * Gli eroi del gioco, dai dati che il sito ha gia': il roster, il contesto
 * (attributo, razza, caratteristiche, rarita'), il calendario delle uscite e le
 * abilita' speciali. Un eroe con piu' abilita' speciali prende il tipo della
 * prima (nessuno oggi ne ha di due tipi).
 */
export function guessHeroes(
  roster: readonly HeroEntry[],
  context: HeroContextIndex,
  releases: ReleaseCalendar | undefined,
  specials: HeroSpecialsIndex | undefined,
): GuessHero[] {
  return roster.map((hero) => {
    const own = context.heroes[hero.id];
    const first = specials?.heroes[hero.id]?.[0];
    return {
      id: hero.id,
      group: hero.group,
      attribute: own?.attribute ?? null,
      race: own?.race ?? null,
      factions: own?.factions ?? [],
      obtainedAs: own?.rarity.obtainedAs ?? hero.obtainedAs,
      max: own?.rarity.max ?? hero.rarity,
      special: first ? (specials?.abilities[first]?.kind ?? null) : null,
      date: releases?.heroes[hero.id]?.global ?? null,
    };
  });
}

/** Il giorno di una data nel fuso di chi gioca, AAAA-MM-GG: l'eroe del giorno cambia a mezzanotte. */
export function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function previousDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return dayKey(new Date(y!, m! - 1, d! - 1));
}

/**
 * Le modalita', come quelle di Loldle (seconda richiesta dell'utente, lo stesso
 * giorno), ognuna una sottosezione di «Indovina l'eroe»:
 * - classico: gli indizi qui sopra
 * - carta: l'illustrazione di una carta A o B, ingrandita, che si allarga a ogni
 *   errore. Le carte dell'ultimate no: 87 illustrazioni su 249 sono di piu'
 *   versioni dello stesso personaggio, e la risposta non sarebbe una. Le A e le B
 *   sono 750, tutte diverse
 * - unica: l'icona dell'Unica (375, tutte diverse)
 * - testo: il testo dell'Unica, col nome dell'eroe nascosto. Due eroi hanno lo
 *   stesso testo (1095002 e 1164001): valgono tutti e due
 */
export const GUESS_VARIANTS = ["classico", "carta", "unica", "testo"] as const;
export type GuessVariant = (typeof GUESS_VARIANTS)[number];

/** I nomi delle modalita', per le schede e il risultato da condividere. */
export const VARIANT_LABELS: Readonly<Record<GuessVariant, { readonly it: string; readonly en: string }>> = {
  classico: { it: "Classico", en: "Classic" },
  carta: { it: "Carta", en: "Card" },
  unica: { it: "Unica", en: "Unique" },
  testo: { it: "Testo", en: "Text" },
};

/** Un numero da un testo: FNV-1a a 32 bit, come l'impronta dei testi delle parole blu. */
export function seedOf(text: string): number {
  let hash = 0x811c9dc5;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Il rimescolamento finale di MurmurHash3: bit vicini del seme non danno numeri vicini. */
function mix32(hash: number): number {
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

/**
 * Il primo giorno della regola stabile (vedi dailyAnswer). Prima vale la regola di
 * prima: i giorni gia' giocati, compreso quello in cui e' cambiata, restano com'erano.
 */
export const STABLE_DAILY_FROM = "2026-10-12";

/**
 * L'eroe del giorno: lo stesso per tutti nello stesso giorno, senza server, e
 * non cambia se il roster si riordina. Ogni modalita' ha il suo; il seme della
 * classica e' quello di prima delle altre modalita'.
 *
 * Fino all'11/10/2026 era un numero dal giorno usato come posizione fra gli eroi
 * in ordine d'id: con un eroe in piu' (Heimdallr, 08/10) quasi ogni giorno, passati
 * compresi, finiva su un altro eroe, e chi aveva gia' giocato si ritrovava i
 * tentativi confrontati con un'altra risposta, e «l'eroe di ieri» era sbagliato.
 * Dal 12/10 ogni eroe ha il suo numero per quel giorno (dal giorno e dal suo id)
 * e vince il piu' basso: un eroe nuovo non tocca i numeri degli altri, e cambia
 * l'eroe di un giorno solo se il suo numero e' il piu' basso (circa una volta su
 * quanti sono gli eroi). In piu' partecipa solo dal giorno della sua uscita
 * (`date`, globale), quindi i giorni prima non li tocca mai. Chi non ha la data
 * partecipa sempre.
 */
export function dailyAnswer<T extends { readonly id: string; readonly date?: string | null }>(
  heroes: readonly T[],
  day: string,
  variant: GuessVariant = "classico",
): T {
  if (heroes.length === 0) throw new Error("dailyAnswer: nessun eroe");
  const salt = variant === "classico" ? `gachazone-indovina:${day}` : `gachazone-indovina-${variant}:${day}`;
  if (day < STABLE_DAILY_FROM) {
    const sorted = [...heroes].sort((a, b) => a.id.localeCompare(b.id));
    return sorted[seedOf(salt) % sorted.length]!;
  }
  const out = heroes.filter((hero) => !hero.date || hero.date <= day);
  let best: T | undefined;
  let bestScore = Infinity;
  for (const hero of out.length > 0 ? out : heroes) {
    const score = mix32(seedOf(`${salt}:${hero.id}`));
    if (score < bestScore || (score === bestScore && hero.id < best!.id)) {
      best = hero;
      bestScore = score;
    }
  }
  return best!;
}

/** Gli aiuti che si sbloccano coi tentativi sbagliati, per modalita'. */
export const HINTS = [
  { key: "icona", after: 4 },
  { key: "nome", after: 8 },
] as const;
export type HintKey = "icona" | "nome" | "carta" | "attributo";
export const VARIANT_HINTS: Readonly<Record<GuessVariant, readonly { key: HintKey; after: number }[]>> = {
  classico: HINTS,
  carta: [
    { key: "carta", after: 4 },
    { key: "attributo", after: 8 },
  ],
  unica: [
    { key: "nome", after: 4 },
    { key: "attributo", after: 8 },
  ],
  testo: [
    { key: "icona", after: 4 },
    { key: "nome", after: 8 },
  ],
};

/** Quanto e' ingrandita la carta: 3,2 volte all'inizio, meno 0,4 a ogni errore, intera alla fine. */
export function cardZoom(wrong: number, over: boolean): number {
  return over ? 1 : Math.max(1, 3.2 - 0.4 * wrong);
}

/**
 * Il mosaico della carta e dell'icona (richiesta dell'utente: senza, le due
 * modalita' erano troppo facili): quanti quadretti in larghezza, sempre piu' fitti
 * a ogni errore, e null quando l'immagine e' nitida (dopo l'ultimo passo, e a fine
 * partita). La prima versione (carta 8, 11, 15, 20, 28, 40) «non si notava»,
 * disse l'utente: dopo tre errori la carta aveva gia' 20 quadretti in larghezza e
 * si leggeva quasi tutta. La seconda (carta da 5, icona da 4 quadretti) era
 * «troppo mosaico». Questa sta in mezzo: parte piu' fitta della seconda e si
 * rimpicciolisce piu' piano della prima, in otto passi; poi l'utente ha chiesto,
 * due volte, due quadretti in piu' in ogni passo.
 */
const MOSAIC_STEPS: Readonly<Record<"carta" | "unica", readonly number[]>> = {
  carta: [11, 13, 15, 18, 22, 27, 34, 44],
  unica: [10, 11, 13, 15, 18, 22, 28, 36],
};

export function mosaicBlocks(kind: "carta" | "unica", wrong: number, over: boolean): number | null {
  const steps = MOSAIC_STEPS[kind];
  return over || wrong >= steps.length ? null : steps[wrong]!;
}

/**
 * La parte dell'immagine che si vede ingrandita di `zoom` volte attorno a
 * `focus` (percentuali), in pixel dell'immagine: quello che fa `scale()` del CSS
 * con `transform-origin` in quel punto. Serve al mosaico, che si calcola sulla
 * parte visibile perche' i quadretti abbiano la stessa misura sullo schermo.
 */
export function zoomCrop(
  width: number,
  height: number,
  zoom: number,
  focus: { x: number; y: number },
): { sx: number; sy: number; sw: number; sh: number } {
  const keep = 1 - 1 / zoom;
  return {
    sx: (focus.x / 100) * width * keep,
    sy: (focus.y / 100) * height * keep,
    sw: width / zoom,
    sh: height / zoom,
  };
}

/** Il punto su cui si ingrandisce la carta, in percentuale, lontano dai bordi. */
export function cardFocus(seed: number): { x: number; y: number } {
  return { x: 25 + (seed % 51), y: 20 + (Math.floor(seed / 51) % 61) };
}

/**
 * Il testo con le parole del nome dell'eroe nascoste: Odino, Salos, Freyja...
 * citano se stessi nella loro Unica (14 testi su 375). Parole intere, di almeno
 * quattro lettere, con le maiuscole come nel nome; non tocca i tag del markup.
 */
export function maskWords(text: string, words: readonly string[]): string {
  const wanted = [...new Set(words.filter((word) => /^\p{Lu}[\p{L}'-]{3,}$/u.test(word)))];
  if (wanted.length === 0) return text;
  const escaped = wanted.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text.replace(new RegExp(`(?<!\\p{L})(?:${escaped.join("|")})(?!\\p{L})`, "gu"), "???");
}

/** I tentativi in quadratini per le modalita' senza caselle: rosso gli errori, verde l'ultimo se giusto. */
export function shareLine(tries: number, solved: boolean): string {
  return "🟥".repeat(solved ? tries - 1 : tries) + (solved ? "🟩" : "");
}

/** Le caselle di ogni tentativo in quadratini, dal primo all'ultimo, per condividere il risultato. */
export function shareGrid(rows: readonly Record<ClueKey, Clue>[]): string {
  const square: Record<Verdict, string> = { giusto: "🟩", vicino: "🟨", sbagliato: "🟥" };
  return rows.map((row) => CLUES.map((key) => square[row[key].verdict]).join("")).join("\n");
}
