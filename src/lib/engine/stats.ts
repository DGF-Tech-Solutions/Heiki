/**
 * Composizione delle statistiche.
 *
 * Convenzione condivisa da tutti i giochi gacha supportati:
 *
 *     totale = base * (1 + somma dei percentuali) + somma dei flat
 *
 * I percentuali si sommano tra loro e si applicano alla BASE, non si compongono
 * a cascata. E' cosi' in Genshin, HSR, ZZZ e WuWa. Un modulo che avesse regole
 * diverse puo' comunque sovrascrivere la propria formula di danno.
 */

import type { StatBlock, StatKey, StatModifier } from "./types";

export function getStat(block: StatBlock, key: StatKey, fallback = 0): number {
  const value = block[key];
  return value === undefined ? fallback : value;
}

/**
 * Applica i modificatori a un blocco base.
 *
 * `stackCounts` moltiplica il valore di ogni modificatore per il numero di
 * stack attivi del buff che lo ha generato: il chiamante ha gia' fatto il
 * conteggio e il clamp a maxStacks.
 */
export function applyModifiers(base: StatBlock, modifiers: readonly StatModifier[]): StatBlock {
  if (modifiers.length === 0) return base;

  const flat = new Map<StatKey, number>();
  const percent = new Map<StatKey, number>();

  for (const mod of modifiers) {
    const bucket = mod.mode === "flat" ? flat : percent;
    bucket.set(mod.stat, (bucket.get(mod.stat) ?? 0) + mod.value);
  }

  const result: Record<StatKey, number> = { ...base };

  for (const [key, pct] of percent) {
    const baseValue = getStat(base, key);
    result[key] = baseValue * (1 + pct);
  }

  for (const [key, add] of flat) {
    result[key] = (result[key] ?? getStat(base, key)) + add;
  }

  return result;
}

/** Somma due blocchi stat chiave per chiave. Utile per i bonus di set. */
export function mergeStats(a: StatBlock, b: StatBlock): StatBlock {
  const result: Record<StatKey, number> = { ...a };
  for (const key of Object.keys(b)) {
    result[key] = getStat(a, key) + getStat(b, key);
  }
  return result;
}

/** Crea un blocco a partire dalle definizioni, riempiendo i default mancanti. */
export function withDefaults(
  block: StatBlock,
  definitions: readonly { key: StatKey; defaultValue: number }[],
): StatBlock {
  const result: Record<StatKey, number> = { ...block };
  for (const def of definitions) {
    if (result[def.key] === undefined) {
      result[def.key] = def.defaultValue;
    }
  }
  return result;
}
