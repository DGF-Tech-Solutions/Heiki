/**
 * Il box: gli eroi che hai nel gioco, e a che punto sono.
 *
 * Richiesta dell'utente (27/09, «prima account e verifica, poi gli eroi
 * posseduti»; ripresa il 10/10 con «finisci la sezione account»). Per ogni eroe
 * che hai: livello, Risvegli, Super risvegli, rango della Mossa finale, i due Vero
 * risveglio e la Reliquia sacra. Sono i comandi del calcolatore della scheda eroe
 * (`HeroBuild`), cosi' la scheda puo' partire dai tuoi numeri invece che dal
 * massimo, e la Squadra e il Randomizer possono pescare solo fra i tuoi.
 *
 * Funzioni pure: il browser (use-hero-box.ts), il server (actions.ts) e i test
 * leggono e scrivono il box con le stesse regole.
 *
 * Nel browser e nel database il box e' compatto, una riga di cinque numeri per
 * eroe, perche' un box intero sono fino a 375 eroi:
 *   {"v":1,"h":{"1575001":[100,6,6,6,7]}}
 *   livello, Risvegli, Super risvegli, rango dell'ultimate, e i segni in un numero
 *   solo (1 Vero risveglio del Re Demone, 2 della Divinita' Suprema, 4 Reliquia)
 */

import type { HeroStatSteps } from "./types";

export interface BoxEntry {
  readonly level: number;
  /** 0-6 */
  readonly awaken: number;
  /** 0-6, solo a Risveglio completo, come nel gioco */
  readonly superAwaken: number;
  /** 1-6 */
  readonly ultimateRank: number;
  /** i due Vero risveglio: materiali del Re Demone, materiali della Divinita' Suprema */
  readonly trueAwakening: readonly [boolean, boolean];
  /** la Reliquia sacra fabbricata */
  readonly relic: boolean;
}

export interface HeroBox {
  /** id dell'eroe -> i suoi progressi; un eroe che non c'e' non ce l'hai */
  readonly heroes: Readonly<Record<string, BoxEntry>>;
}

/** Fin dove arriva un eroe: lo dicono i suoi dati (`HeroStatSteps`). */
export interface BoxLimits {
  readonly maxLevel: number;
  readonly awaken: number;
  readonly superAwaken: number;
  readonly relic: boolean;
}

export const EMPTY_BOX: HeroBox = { heroes: {} };

/** I tetti di ogni eroe dai pezzi delle sue statistiche; senza pezzi, quelli comuni a tutti. */
export function boxLimitsFrom(
  stats: Readonly<Record<string, { readonly steps?: HeroStatSteps }>>,
): Record<string, BoxLimits> {
  const out: Record<string, BoxLimits> = {};
  for (const [id, hero] of Object.entries(stats)) {
    const steps = hero.steps;
    out[id] = steps
      ? { maxLevel: steps.maxLevel, awaken: steps.awaken.length, superAwaken: steps.superAwaken.length, relic: steps.relic !== undefined }
      : { maxLevel: 100, awaken: 6, superAwaken: 6, relic: false };
  }
  return out;
}
export const ULTIMATE_RANKS = 6;

/** Tetti larghi per un box letto senza i dati del gioco (il server, una versione vecchia). */
const LOOSE: BoxLimits = { maxLevel: 200, awaken: 6, superAwaken: 6, relic: true };
const MAX_HEROES = 2000;
const HERO_ID = /^\d{1,12}$/;

export function boxStorageKey(gameSlug: string): string {
  return `heiki:${gameSlug}:box`;
}

const whole = (value: unknown, min: number, max: number, fallback: number) => {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.min(max, Math.max(min, n));
};

/** L'eroe come lo permette il gioco: Super risvegli solo a Risveglio completo, Reliquia solo se c'e'. */
export function clampEntry(entry: BoxEntry, limits: BoxLimits = LOOSE): BoxEntry {
  const awaken = whole(entry.awaken, 0, limits.awaken, limits.awaken);
  return {
    level: whole(entry.level, 1, limits.maxLevel, limits.maxLevel),
    awaken,
    superAwaken: awaken < limits.awaken ? 0 : whole(entry.superAwaken, 0, limits.superAwaken, 0),
    ultimateRank: whole(entry.ultimateRank, 1, ULTIMATE_RANKS, 1),
    trueAwakening: [entry.trueAwakening[0] === true, entry.trueAwakening[1] === true],
    relic: entry.relic === true && limits.relic,
  };
}

/**
 * L'eroe appena segnato come tuo: livello massimo e Risvegli completi, come lo
 * tiene chi lo usa, ma Super risvegli, rango dell'ultimate e Vero risveglio da
 * fare (costano copie e materiali rari). Si cambia con un tocco.
 */
export function newEntry(limits: BoxLimits): BoxEntry {
  return clampEntry(
    { level: limits.maxLevel, awaken: limits.awaken, superAwaken: 0, ultimateRank: 1, trueAwakening: [false, false], relic: false },
    limits,
  );
}

/** Tutto al massimo. */
export function maxEntry(limits: BoxLimits): BoxEntry {
  return clampEntry(
    {
      level: limits.maxLevel,
      awaken: limits.awaken,
      superAwaken: limits.superAwaken,
      ultimateRank: ULTIMATE_RANKS,
      trueAwakening: [true, true],
      relic: limits.relic,
    },
    limits,
  );
}

function decode(row: unknown, limits: BoxLimits): BoxEntry | null {
  if (!Array.isArray(row) || row.length < 5) return null;
  const flags = whole(row[4], 0, 7, 0);
  return clampEntry(
    {
      level: whole(row[0], 1, 1000, limits.maxLevel),
      awaken: whole(row[1], 0, 100, 0),
      superAwaken: whole(row[2], 0, 100, 0),
      ultimateRank: whole(row[3], 1, 100, 1),
      trueAwakening: [(flags & 1) !== 0, (flags & 2) !== 0],
      relic: (flags & 4) !== 0,
    },
    limits,
  );
}

const encode = (e: BoxEntry) => [
  e.level,
  e.awaken,
  e.superAwaken,
  e.ultimateRank,
  (e.trueAwakening[0] ? 1 : 0) | (e.trueAwakening[1] ? 2 : 0) | (e.relic ? 4 : 0),
];

/**
 * Il box da un testo salvato (browser) o da un oggetto (database), qualunque cosa
 * ci sia dentro: quello che non torna si scarta. Con `limits` si tengono solo gli
 * eroi del gioco, ognuno coi suoi tetti.
 */
export function parseBox(raw: unknown, limits?: Readonly<Record<string, BoxLimits>>): HeroBox {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return EMPTY_BOX;
    }
  }
  if (!data || typeof data !== "object") return EMPTY_BOX;
  const rows = (data as { h?: unknown }).h;
  if (!rows || typeof rows !== "object" || Array.isArray(rows)) return EMPTY_BOX;
  const heroes: Record<string, BoxEntry> = {};
  let count = 0;
  for (const [id, row] of Object.entries(rows as Record<string, unknown>)) {
    if (count >= MAX_HEROES || !HERO_ID.test(id)) continue;
    const own = limits ? limits[id] : LOOSE;
    if (!own) continue;
    const entry = decode(row, own);
    if (!entry) continue;
    heroes[id] = entry;
    count++;
  }
  return { heroes };
}

/** La forma compatta, per il browser e per il database. */
export function boxToJson(box: HeroBox): { v: 1; h: Record<string, number[]> } {
  const h: Record<string, number[]> = {};
  for (const id of Object.keys(box.heroes).sort()) h[id] = encode(box.heroes[id]!);
  return { v: 1, h };
}

export function serializeBox(box: HeroBox): string {
  return JSON.stringify(boxToJson(box));
}

/** Il box con un eroe cambiato, aggiunto o tolto (null). */
export function withHero(box: HeroBox, heroId: string, entry: BoxEntry | null): HeroBox {
  const heroes = { ...box.heroes };
  if (entry) heroes[heroId] = entry;
  else delete heroes[heroId];
  return { heroes };
}

export function ownsHero(box: HeroBox, heroId: string): boolean {
  return heroId in box.heroes;
}

export function boxSize(box: HeroBox): number {
  return Object.keys(box.heroes).length;
}

/** Due box uguali? Per non salvare (e non sincronizzare) quello che non e' cambiato. */
export function sameBox(a: HeroBox, b: HeroBox): boolean {
  return serializeBox(a) === serializeBox(b);
}
