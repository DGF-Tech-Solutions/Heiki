/**
 * Il contratto dei legami: gli Eroi associati.
 *
 * Nel gioco ogni eroe della squadra ha uno Slot associazione, e ci va un altro
 * eroe. Qualunque eroe ci puo' stare; con alcuni pero' l'eroe ha un legame
 * (DB_fate: `main_hero_id` -> `fate_hero_id`), e allora si attiva l'Effetto
 * associazione, una passiva che dipende dal grado. Alcuni legami danno anche
 * l'Attacco combinato: con l'Eroe associato speciale la Mossa finale diventa un
 * attacco a due (`special_coop_card_id_*`, «Associazione speciale» nel gioco).
 *
 * Li scrive la pipeline nelle schede del client (script/scheda_client.py,
 * `fates`, eroi/client/abilita(_it).json), li porta qui
 * scripts/import-hero-fates.mts. Sta in un file suo come le meccaniche: types.ts
 * ne importa solo l'indice, per il campo del modulo.
 */

import type { HeroLabel } from "./types";

/**
 * Un Effetto associazione. Sono dodici in tutto il gioco, uno per statistica:
 * gli eroi li condividono, e per questo stanno in un elenco a parte.
 */
export interface HeroFateEffect {
  /** «Resistenza superiore»: il nome del gioco senza «Liv. {0}», che e' il grado */
  readonly name: HeroLabel;
  /**
   * «Resistenza [00FF31]+24.6%[-]»: il testo al grado UR, col markup del gioco.
   * UR anche per gli eroi LR, come lo mostra la scheda del client (scheda_client.py).
   */
  readonly text: HeroLabel;
}

/** Un legame: l'eroe associato, il suo effetto (posizione in `effects`), 1 se da' l'Attacco combinato. */
export type HeroFate = readonly [associate: string, effect: number, combined: 0 | 1];

export interface HeroFatesIndex {
  readonly effects: readonly HeroFateEffect[];
  /** eroe principale -> i suoi legami, nell'ordine del gioco. Un eroe senza legami non c'e' */
  readonly heroes: Readonly<Record<string, readonly HeroFate[]>>;
}
