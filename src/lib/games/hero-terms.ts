/**
 * Funzioni pure delle parole blu (il contratto sta in hero-terms-types.ts).
 *
 * Le usano l'import, che costruisce l'indice, e la scheda eroe, che lo legge:
 * l'impronta del testo e la lettura dei bersagli devono essere le stesse nei
 * due posti.
 */

import type { HeroTermGroup } from "./hero-terms-types";

/**
 * L'impronta di un testo inglese: FNV-1a a 32 bit, in esadecimale.
 *
 * L'indice lega le parole blu a un testo, e il testo intero come chiave
 * peserebbe piu' dei dati (3.148 testi, un megabyte di chiavi). Otto caratteri
 * bastano: l'import controlla che due testi diversi non abbiano la stessa
 * impronta, e si ferma se succede.
 */
export function textKey(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/** Le parti di un bersaglio: "c:pierce|r:3" -> concetti, razze, caratteristiche, gruppi. */
export interface TermTarget {
  readonly concepts: readonly string[];
  readonly races: readonly number[];
  readonly factions: readonly number[];
  readonly groups: readonly number[];
}

export function parseTarget(token: string): TermTarget {
  const concepts: string[] = [];
  const races: number[] = [];
  const factions: number[] = [];
  const groups: number[] = [];
  for (const part of token.split("|")) {
    const [kind, value] = [part.slice(0, 1), part.slice(2)];
    if (kind === "c") concepts.push(value);
    else if (kind === "r") races.push(Number(value));
    else if (kind === "f") factions.push(Number(value));
    else if (kind === "g") groups.push(Number(value));
  }
  return { concepts, races, factions, groups };
}

/**
 * L'id della tendina di un bersaglio. Un bersaglio, una tendina per pagina:
 * tutte le parole che lo citano aprono la stessa. Solo lettere, cifre e
 * trattini, perche' finisce anche in `popovertarget`.
 */
export function targetId(token: string): string {
  return `blu-${token.replace(/[^a-z0-9]+/gi, "-")}`;
}

/**
 * La forma su cui cerca la barra delle tendine: minuscole, senza accenti e
 * senza parentesi quadre, come la ricerca della griglia Eroi (heroes.ts). La
 * usano la pagina, per le righe, e il browser, per quello che si digita.
 */
export function searchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[[\]'«»"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Quello che serve di un eroe per sapere se fa parte di un gruppo. */
export interface TermMember {
  readonly id: string;
  readonly group: string;
  readonly race: number | null;
  readonly factions: readonly number[];
  readonly attribute: number | null;
}

/**
 * Fa parte del gruppo di una nota «applicabili»?
 *
 * Razza, caratteristica o personaggio: basta uno. L'attributo, se la nota lo
 * chiede, si aggiunge come condizione («Strength attribute Humans»: Umano E di
 * Forza). `self` fa entrare l'eroe della scheda, `current`.
 */
export function inGroup(group: HeroTermGroup, hero: TermMember, current: string): boolean {
  const named =
    (group.self && hero.id === current) ||
    (hero.race !== null && group.races.includes(hero.race)) ||
    hero.factions.some((faction) => group.factions.includes(faction)) ||
    group.characters.includes(hero.group);
  if (!named) return false;
  return group.attributes.length === 0 || (hero.attribute !== null && group.attributes.includes(hero.attribute));
}
