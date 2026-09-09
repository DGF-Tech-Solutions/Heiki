/**
 * Curva di progressione del livello profilo.
 *
 * Crescita superlineare: i primi livelli arrivano in fretta perche' servono a
 * far capire che il sistema esiste, quelli alti restano un traguardo. La soglia
 * e' una funzione pura del livello, quindi si puo' ricalcolare ovunque senza
 * memorizzare tabelle.
 */

export const MAX_LEVEL = 60;

/** XP cumulativo necessario per raggiungere un livello. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const capped = Math.min(level, MAX_LEVEL);
  return Math.round(80 * Math.pow(capped - 1, 1.55));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++;
  return level;
}

export interface LevelProgress {
  level: number;
  current: number;
  needed: number;
  ratio: number;
  maxed: boolean;
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelFromXp(xp);
  if (level >= MAX_LEVEL) {
    return { level: MAX_LEVEL, current: 0, needed: 0, ratio: 1, maxed: true };
  }

  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  const span = Math.max(1, ceiling - floor);
  const current = Math.max(0, xp - floor);

  return {
    level,
    current,
    needed: span,
    ratio: Math.min(1, current / span),
    maxed: false,
  };
}
