/**
 * Il contratto dei legami: gli Eroi associati.
 *
 * Nel gioco ogni eroe della squadra ha uno Slot associazione, e ci va un altro
 * eroe. Qualunque eroe ci puo' stare, e da' all'eroe dello slot (il principale)
 * l'Effetto associazione comune: una parte di Attacco, Difesa e PS dell'associato.
 * Con alcuni pero' l'eroe ha un legame (DB_fate: `main_hero_id` -> `fate_hero_id`),
 * e allora si attiva anche l'Effetto associazione del legame, una passiva che
 * dipende dal grado dell'associato. Alcuni legami danno l'Attacco combinato: con
 * l'Eroe associato speciale la Mossa finale diventa un attacco a due
 * (`special_coop_card_id_*`, «Associazione speciale» nel gioco). Tutto va al
 * principale, e solo in battaglia: la scheda dell'eroe del gioco non lo conta.
 *
 * Li scrive la pipeline (script/scheda_client.py, `fates`, per l'ordine e i
 * testi; script/associazioni.py per i gradi e l'effetto comune), li porta qui
 * scripts/import-hero-fates.mts. Sta in un file suo come le meccaniche: types.ts
 * ne importa solo l'indice, per il campo del modulo.
 */

import type { PassiveMode } from "./gear-types";
import type { HeroLabel } from "./types";

/**
 * Un Effetto associazione del legame. Sono dodici in tutto il gioco, uno per
 * statistica: gli eroi li condividono, e per questo stanno in un elenco a parte.
 */
export interface HeroFateEffect {
  /** «Resistenza superiore»: il nome del gioco al grado UR, senza «Liv. {0}» (che e' il livello, sempre 1) */
  readonly name: HeroLabel;
  /**
   * «Resistenza [00FF31]+24.6%[-]»: il testo al grado UR, col markup del gioco.
   * UR anche per gli eroi LR, come lo mostra la scheda del client (scheda_client.py).
   */
  readonly text: HeroLabel;
  /** la statistica, e se si aggiunge piatta (Attacco, Difesa, PS) o in punti */
  readonly stat: string;
  readonly mode: PassiveMode;
  /** il valore col grado dell'associato R, SR, SSR, UR (LR come UR, salvo `lrEffect` del legame) */
  readonly grades: readonly [number, number, number, number];
}

/**
 * Un legame: l'eroe associato, il suo effetto (posizione in `effects`), 1 se da'
 * l'Attacco combinato, e l'effetto col grado LR quando non e' lo stesso (una sola
 * riga in tutto il gioco: 1055004 con 1165001, Difesa superiore a UR e PS
 * superiore a LR).
 */
export type HeroFate = readonly [associate: string, effect: number, combined: 0 | 1, lrEffect?: number];

export interface HeroFatesIndex {
  readonly effects: readonly HeroFateEffect[];
  /** eroe principale -> i suoi legami, nell'ordine del gioco. Un eroe senza legami non c'e' */
  readonly heroes: Readonly<Record<string, readonly HeroFate[]>>;
  /**
   * L'Effetto associazione comune, con qualunque associato (TeamHeroData.CalcFateStat):
   * (base + perLevel x (Mossa finale dell'associato - 1))% di Attacco, Difesa e PS
   * dell'associato. Nel gioco 5 e 1: dal 5 al 10%.
   */
  readonly common: {
    readonly base: number;
    readonly perLevel: number;
    readonly name: HeroLabel;
    readonly description: HeroLabel;
    /** «Le statistiche di base sono la somma di Attacco, Difesa e PS», col markup */
    readonly basicStats: HeroLabel;
  };
}
