/**
 * PRNG deterministico e seedabile.
 *
 * Serve perche' un link condiviso deve mostrare SEMPRE gli stessi numeri: seed +
 * DatasetVersion rendono ogni simulazione riproducibile. Math.random() lo
 * renderebbe impossibile.
 *
 * Algoritmo: mulberry32. Non e' crittograficamente sicuro e non deve esserlo -
 * serve solo velocita' e ripetibilita' per il Monte Carlo.
 */

export interface Rng {
  /** float in [0, 1) */
  next(): number;
  /** intero in [0, maxExclusive) */
  int(maxExclusive: number): number;
  /** float in [min, max) */
  range(min: number, max: number): number;
  /** true con probabilita' p */
  chance(p: number): boolean;
  /** elemento casuale; lancia se l'array e' vuoto */
  pick<T>(items: readonly T[]): T;
  /** copia mescolata (Fisher-Yates), non muta l'originale */
  shuffle<T>(items: readonly T[]): T[];
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const int = (maxExclusive: number): number => {
    if (maxExclusive <= 0) return 0;
    return Math.floor(next() * maxExclusive);
  };

  return {
    next,
    int,
    range: (min, max) => min + next() * (max - min),
    chance: (p) => next() < p,
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) {
        throw new Error("Rng.pick: array vuoto");
      }
      const item = items[int(items.length)];
      // Ridondante a runtime ma necessario con noUncheckedIndexedAccess.
      if (item === undefined) {
        throw new Error("Rng.pick: indice fuori range");
      }
      return item;
    },
    shuffle<T>(items: readonly T[]): T[] {
      const copy = items.slice();
      for (let i = copy.length - 1; i > 0; i--) {
        const j = int(i + 1);
        const a = copy[i];
        const b = copy[j];
        if (a === undefined || b === undefined) continue;
        copy[i] = b;
        copy[j] = a;
      }
      return copy;
    },
  };
}

/**
 * Seed stabile derivato da una stringa (es. lo slug di una build), cosi' lo
 * stesso contenuto produce sempre la stessa simulazione anche senza salvare il
 * seed. Hash FNV-1a a 32 bit.
 */
export function seedFromString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
