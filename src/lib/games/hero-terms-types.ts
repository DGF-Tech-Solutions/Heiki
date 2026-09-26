/**
 * Il contratto delle parole blu: cosa c'e' dietro ogni parola blu della scheda
 * eroe, e quali eroi hanno la stessa cosa.
 *
 * Richiesta dell'utente (26/09): una parola blu - Perforazione, Evasione,
 * alleati applicabili, Demoni, [Ragnarok] - si clicca e apre l'elenco degli eroi
 * legati. Per un effetto, gli eroi che ce l'hanno e in quale abilita'; per una
 * razza, una caratteristica o gli alleati applicabili, gli eroi che ne fanno
 * parte.
 *
 * Il legame parola -> concetto lo fa la pipeline (script/parole_blu.py, con la
 * stessa logica di contesto_eroi.py) sul testo inglese; l'import
 * (scripts/import-hero-terms.mts) lo porta sulle parole come le conta il sito
 * (`termWords` in hero-markup.ts) e costruisce l'indice inverso. Le parole
 * italiane si legano per posizione: stesso testo, stesse parole blu nello stesso
 * ordine.
 */

import type { HeroLabel } from "./types";

/** Un concetto del gioco, col nome e la definizione nelle due lingue. */
export interface HeroTermConcept {
  readonly label: HeroLabel;
  readonly definition: HeroLabel;
  /** "dichiarato": il gioco lo definisce; "dedotto": l'accostamento l'ha fatto la pipeline */
  readonly certainty: "dichiarato" | "dedotto";
}

/**
 * Chi conta come «alleato applicabile» (o «nemico applicabile») per una nota
 * del gioco: «※Applicable Allies: Demons and [The Seven Deadly Sins]».
 *
 * Razze, caratteristiche e personaggi valgono l'uno O l'altro; gli attributi,
 * quando ci sono, si richiedono INSIEME al resto («Strength attribute Humans»).
 * `self`: la nota comprende l'eroe stesso («Self, Tamaki Kotatsu, and Shō
 * Kusakabe»).
 */
export interface HeroTermGroup {
  /** la frase della nota, com'e' nel gioco: la pagina la mostra in testa all'elenco */
  readonly definition: HeroLabel;
  readonly enemies: boolean;
  readonly races: readonly number[];
  readonly factions: readonly number[];
  /** nomi dei personaggi (`HeroEntry.group`): valgono tutte le loro versioni */
  readonly characters: readonly string[];
  readonly attributes: readonly number[];
  readonly self: boolean;
}

/**
 * Dove un eroe ha un concetto: l'eroe, l'abilita', e il rango da cui c'e'.
 *
 * L'abilita' e' "A", "B", "ultimate", "passiva" (l'Unica), "s:<id>" per un
 * Comandamento, una Grazia, un'Unita' o un Talento, "r:<id>" per l'effetto di
 * una Reliquia sacra. Il rango e' quello della carta; per l'Unica e i Talenti e'
 * il rango dell'ultimate da cui il testo lo dice.
 */
export type HeroTermPlace = readonly [heroId: string, where: string, fromRank: number];

export interface HeroTermsIndex {
  /** chiave del concetto -> nome e definizione */
  readonly concepts: Readonly<Record<string, HeroTermConcept>>;
  /** i gruppi delle note «applicabili», citati per posizione dai bersagli `g:<n>` */
  readonly groups: readonly HeroTermGroup[];
  /**
   * impronta del testo inglese (`textKey`) -> un bersaglio per parola blu del
   * corpo, in ordine; null per una parola che non porta a niente (una
   * condizione, un termine che nessuna fonte spiega). Il bersaglio e' una fila
   * di parti separate da "|": "c:<concetto>", "r:<razza>", "f:<caratteristica>",
   * "g:<gruppo>". «Cancels Buffs and Stances» ne ha due.
   */
  readonly texts: Readonly<Record<string, readonly (string | null)[]>>;
  /** concetto -> dove compare, nell'ordine del roster */
  readonly places: Readonly<Record<string, readonly HeroTermPlace[]>>;
}
