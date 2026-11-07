/**
 * Il contratto del filtro «Effetto» della griglia Eroi: le voci con cui il gioco
 * stesso filtra le abilita', e quali eroi le hanno sulle carte.
 *
 * Nella scheda eroe le azioni come «Annulla Atteggiamenti» non si cliccano piu':
 * la domanda «chi annulla gli Atteggiamenti?» trova risposta qui. Il legame
 * carta-effetto e' quello del client (`list_array_skill_search_tag`), piu'
 * completo di quello ricavato dai testi: per Annulla Atteggiamento 95 eroi
 * contro 61. Il client non etichetta le passive: una voce dice cosa c'e' sulle
 * carte e sulla Mossa finale, non tutto quello che l'eroe sa fare.
 *
 * L'import (scripts/import-skill-tags.mts) lo costruisce dai JSON in
 * data/grand-cross/.
 */

import type { HeroLabel } from "./types";

export interface SkillTagEntry {
  /**
   * I tag del gioco raccolti da questa voce, dal piu' basso. Il primo e' quello
   * che sta nell'indirizzo (`?effetto=129`). Di solito e' uno solo: piu' d'uno
   * quando il gioco da' lo stesso nome a tag diversi, che l'import fonde.
   */
  readonly tags: readonly [number, ...number[]];
  readonly label: HeroLabel;
  readonly description: HeroLabel;
  /** gli eroi che hanno la voce sulle carte, nell'ordine del roster */
  readonly heroes: readonly string[];
}

/** Un gruppo della ricerca del gioco, con le sue voci nell'ordine del gioco. */
export interface SkillTagGroup {
  /** "01", "02"...: la chiave del gruppo nel client */
  readonly id: string;
  readonly label: HeroLabel;
  readonly entries: readonly SkillTagEntry[];
}

export interface SkillTagsIndex {
  readonly groups: readonly SkillTagGroup[];
}
