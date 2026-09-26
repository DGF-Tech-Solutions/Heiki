/**
 * Le regole di combattimento di Grand Cross come funzioni: servono agli esempi della
 * pagina «Meccaniche» e alle righe della scheda eroe, e le tengono i test.
 *
 * Ogni funzione rifa' un passo del codice del client, letto dalla pipeline
 * (MECCANICHE_COMBATTIMENTO.md): il numero del paragrafo dello studio e' accanto a
 * ognuna. I numeri non sono scritti qui: arrivano da `MechanicsIndex`, cioe' dalla
 * configurazione del gioco e dalle costanti lette nel codice.
 */

import type { MechanicsIndex, MechanicsStacking } from "./mechanics-types";

type Config = MechanicsIndex["config"];
type Code = MechanicsIndex["code"];

/**
 * Il danno base (§ 1.2): `A × (1 − b × D / (A + a × D))`, con A = Attacco × percentuale
 * della carta e D = Difesa del bersaglio. Con D = 0 resta A.
 */
export function baseDamage(attack: number, defense: number, config: Config): number {
  if (attack <= 0) return 0;
  const d = Math.max(0, defense);
  return attack * (1 - (config.balanceB * d) / (attack + config.balanceA * d));
}

/** Quanto al massimo la Difesa puo' togliere (§ 1.2): b / a, con Difesa infinita. */
export function maxDefenseCut(config: Config): number {
  return config.balanceB / config.balanceA;
}

/**
 * La probabilita' VERA di un critico, data quella netta (Poss. critico − Res.
 * critico, come frazione) (§ 1.3): il gioco arrotonda per eccesso ai centesimi,
 * tira un intero da 0 a 99 e fa critico se e' <= c, quindi (c + 1) / 100.
 */
export function critChance(net: number): number {
  const c = Math.min(Math.ceil(net * 100 - 1e-9), 100);
  if (c <= 0) return 0;
  if (c >= 100) return 1;
  return (c + 1) / 100;
}

/** Il moltiplicatore di un critico (§ 1.3): max(1; base + Danno critico − Difesa critico). */
export function critMultiplier(critDamage: number, critDefense: number, config: Config): number {
  return Math.max(1, config.critBase + critDamage - Math.max(0, critDefense));
}

/** Il fattore degli aumenti e delle riduzioni del danno (§ 1.4): 1 + max(aumenti − riduzioni; minimo). */
export function damageModifier(increases: number, decreases: number, code: Code): number {
  return 1 + Math.max(increases - decreases, code.minDifference);
}

/** Il confronto d'attributo (§ 2.1): 1 vantaggio, −1 svantaggio, 0 niente. */
export function attributeEdge(attacker: number | null, defender: number | null, code: Code): -1 | 0 | 1 {
  if (attacker === null || defender === null) return 0;
  if (code.beats[String(attacker)] === defender) return 1;
  if (code.beats[String(defender)] === attacker) return -1;
  return 0;
}

/**
 * La probabilita' che una pescata dia la carta A o la B di un eroe (§ 3.3), con
 * `heroes` eroi in campo tutti con gli stessi pesi: peso / somma dei pesi del mazzo.
 */
export function drawChances(weights: readonly [number, number], heroes: number): { a: number; b: number } {
  const total = (weights[0] + weights[1]) * Math.max(1, heroes);
  return { a: weights[0] / total, b: weights[1] / total };
}

/**
 * Quante carte tiene la mano (§ 3.6) con `heroes` eroi che hanno ancora carte.
 * Squadra con panchina: MAX − max(0; SUB − eroi). Tutti in campo: MAX + 1 con piu'
 * di 3 eroi, − max(0; SUB − eroi).
 */
export function handLimit(heroes: number, allIn: boolean, code: Code): number {
  const { max, sub } = allIn ? code.hand.allIn : code.hand.bench;
  return max + (allIn && heroes > 3 ? 1 : 0) - Math.max(0, sub - heroes);
}

/** Il peso di una carta nel PvP Smash dopo `times` pescate nello stesso rabbocco (§ 3.8). */
export function smashWeight(weight: number, times: number, config: Config): number {
  let w = weight;
  for (let i = 0; i < times; i += 1) w = Math.ceil(Math.fround(Math.fround(w) * Math.fround(config.smashDraw)));
  return w;
}

/** La regola di cumulo piu' usata di un concetto, o null se non ce n'e'. */
export function mainStacking(rules: readonly MechanicsStacking[] | undefined): MechanicsStacking | null {
  return rules && rules.length > 0 ? rules[0]! : null;
}
