/**
 * Mattoni della formula di danno condivisi tra i moduli di gioco.
 *
 * Non sono obbligatori: un modulo puo' ignorarli e scrivere la propria formula.
 * Ma difesa, resistenza e critico funzionano nello stesso modo in tutti e
 * quattro i giochi HoYo/Kuro, quindi tenerli qui evita quattro copie da tenere
 * allineate.
 */

import { getStat } from "./stats";
import type { DamageContext, StatBlock } from "./types";

/**
 * Riduzione da difesa.
 *
 *     mult = (lvA + K) / ((lvA + K) + (lvD + K) * (1 - riduzione) * (1 - ignore))
 *
 * K = 100 e' la costante usata dai giochi HoYo. I moduli la possono cambiare.
 */
export function defenseMultiplier(
  attackerLevel: number,
  defenderLevel: number,
  defReduction = 0,
  defIgnore = 0,
  k = 100,
): number {
  const attacker = attackerLevel + k;
  const reduction = Math.max(0, 1 - clamp01(defReduction));
  const ignore = Math.max(0, 1 - clamp01(defIgnore));
  const defender = (defenderLevel + k) * reduction * ignore;
  const denominator = attacker + defender;
  if (denominator <= 0) return 1;
  return attacker / denominator;
}

/**
 * Moltiplicatore da resistenza, con la curva a tre rami usata dai giochi gacha:
 * la resistenza negativa vale meta', quella molto alta ha rendimenti decrescenti
 * invece di azzerare il danno.
 */
export function resistanceMultiplier(resistance: number): number {
  if (resistance < 0) return 1 - resistance / 2;
  if (resistance < 0.75) return 1 - resistance;
  return 1 / (4 * resistance + 1);
}

/**
 * Critico atteso (medio), non un tiro casuale.
 *
 * Su una rotazione il valore atteso e' cio' che interessa a chi confronta build:
 * un tiro per colpo aggiungerebbe rumore senza aggiungere informazione. I moduli
 * stocastici, che gia' hanno varianza propria, possono usare `rollCritMultiplier`.
 */
export function expectedCritMultiplier(critRate: number, critDamage: number): number {
  return 1 + clamp01(critRate) * Math.max(0, critDamage);
}

/** Tiro critico effettivo, per i moduli che simulano la varianza colpo per colpo. */
export function rollCritMultiplier(critRate: number, critDamage: number, roll: number): number {
  return roll < clamp01(critRate) ? 1 + Math.max(0, critDamage) : 1;
}

/**
 * Somma dei bonus al danno applicabili a un colpo.
 *
 * Chiavi lette dallo StatBlock, tutte opzionali:
 *   dmg_bonus_all              bonus incondizionato
 *   dmg_bonus_<damageTag>      per elemento/attributo, es. dmg_bonus_hydro
 *   dmg_bonus_<category>       per tipo di azione, es. dmg_bonus_ultimate
 */
export function damageBonus(stats: StatBlock, damageTag: string, category: string): number {
  return (
    getStat(stats, "dmg_bonus_all") +
    getStat(stats, `dmg_bonus_${damageTag}`) +
    getStat(stats, `dmg_bonus_${category}`)
  );
}

export interface StandardDamageOptions {
  /** costante K della formula di difesa */
  defenseK?: number;
  /** true = tira il critico invece di usare il valore atteso */
  rollCrit?: boolean;
  /** moltiplicatore extra specifico del gioco (reazioni, triangolo attributi, ...) */
  extraMultiplier?: number;
}

/**
 * Formula di danno standard dei gacha.
 *
 *   danno = (mv% * statScaling + flat)
 *         * (1 + bonusDanno)
 *         * critico
 *         * moltDifesa
 *         * moltResistenza
 *         * (1 - riduzioneDannoSubito)
 *         * extra
 */
export function standardDamage(ctx: DamageContext, options: StandardDamageOptions = {}): number {
  const { hit, stats, target, actor } = ctx;

  const scalingValue = getStat(stats, hit.scalingStat);
  const base = (hit.motionValue / 100) * scalingValue + (hit.flatBonus ?? 0);
  if (base <= 0) return 0;

  const bonus = 1 + damageBonus(stats, hit.damageTag, hit.category);

  const critRate = getStat(stats, "crit_rate");
  const critDamage = getStat(stats, "crit_damage");
  let crit = 1;
  if (hit.canCrit) {
    crit = options.rollCrit
      ? rollCritMultiplier(critRate, critDamage, ctx.rng.next())
      : expectedCritMultiplier(critRate, critDamage);
  }

  const def = defenseMultiplier(
    actor.level,
    target.level,
    getStat(stats, "def_reduction"),
    getStat(stats, "def_ignore"),
    options.defenseK ?? 100,
  );

  const baseResistance = target.resistances[hit.damageTag] ?? 0;
  const shred = getStat(stats, `res_reduction_${hit.damageTag}`) + getStat(stats, "res_reduction_all");
  const res = resistanceMultiplier(baseResistance - shred);

  const damageReduction = 1 - getStat(stats, "target_damage_reduction");
  const extra = options.extraMultiplier ?? 1;

  return base * bonus * crit * def * res * Math.max(0, damageReduction) * extra;
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
