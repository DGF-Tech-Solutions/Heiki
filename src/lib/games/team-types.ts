/**
 * Il contratto della squadra: chi riceve e chi fa scattare le passive.
 *
 * Richiesta dell'utente (03/10): una sezione dove si forma una squadra e il sito
 * dice come i personaggi si influenzano a vicenda (Unica, reliquie, abilita'
 * speciali), e suggerisce chi si incastra meglio «basandosi prettamente sulle
 * passive e su come i personaggi sinergizzano tra loro».
 *
 * Per ogni passiva che conta per la squadra la pipeline (script/squadra.py) ha
 * letto, frase per frase, A CHI va l'effetto e QUALI alleati lo fanno scattare,
 * dal testo inglese del gioco: le colonne del client non bastano (vedi la testata
 * di quello script). Le razze e le caratteristiche lette sono confrontate con le
 * colonne delle passive: 111 Uniche uguali, e le differenze sono note in cui il
 * testo del gioco dice piu' dei suoi dati. L'import (scripts/import-team.mts) lega
 * le frasi ai testi che il sito mostra e ci appaia l'italiano per posizione.
 *
 * Come si valuta una squadra sta in team.ts.
 */

import type { HeroTermGroup } from "./hero-terms-types";
import type { HeroLabel } from "./types";

/**
 * Dove si gioca. Le passive dicono dove valgono in due modi: coi codici del
 * client accanto all'Unica («Si attiva solo in PvP», `passiveConditions`), e
 * nella frase («In PVP, ...», «(Excludes Death Match)»). Il Boss dell'Ordine dei
 * Cavalieri lo nomina qualche frase, ma non e' fra le scelte: quelle frasi
 * restano spente, col motivo.
 */
export type TeamContent = "pve" | "pvp" | "destroy" | "nest";
export type TeamPlace = TeamContent | "boss_ordine";

/**
 * Chi nomina una frase. Le chiavi presenti si sommano (l'una O l'altra), tranne
 * `unity`, che si chiede in piu': «Human heroes with a Unity effect» sono gli
 * Umani CHE hanno un'Unita'.
 */
export interface TeamWho {
  /** «allies», «all allies»: chiunque in campo */
  readonly allies?: true;
  /** «Applicable Allies»: il gruppo della nota del testo (`TeamText.group`) */
  readonly group?: true;
  readonly races?: readonly number[];
  readonly factions?: readonly number[];
  readonly attributes?: readonly number[];
  /** personaggi per nome (`HeroEntry.group`): «If an allied Percival...» */
  readonly characters?: readonly string[];
  /** «allies ... are all from different races»: solo nelle condizioni «tutti» */
  readonly differentRaces?: true;
  /** «each ally of the same race»: la razza dell'eroe che ha la passiva */
  readonly sameRace?: true;
  /** «with a Unity effect»: chi ha un'Unita' fra le abilita' speciali */
  readonly unity?: true;
}

/**
 * Una condizione sulla squadra.
 *   each  «for each Applicable Ally participating in battle»: cresce col numero
 *   when  «when a Demon ally uses a skill»: scatta per mano di uno di loro
 *   if    «if an ally is a Demon», «If an allied Percival is participating»
 *   all   «if allies participating in battle are all Applicable Allies»: tutti
 */
export interface TeamCondition {
  readonly kind: "each" | "when" | "if" | "all";
  readonly who: TeamWho;
}

/** Una frase di una passiva che riguarda la squadra, e cosa se ne e' letto. */
export interface TeamLink {
  /** la frase, posizione in `TeamIndex.sentences` */
  readonly sentence: number;
  /** viene da una nota «※Nome: ...», non dal corpo */
  readonly note?: true;
  /** chi riceve l'effetto, fra gli alleati */
  readonly receives?: readonly TeamWho[];
  readonly conditions?: readonly TeamCondition[];
  /** la frase nomina l'eroe stesso («the hero's», «self») */
  readonly self?: true;
  /** «other than the hero»: l'eroe stesso non conta */
  readonly notSelf?: true;
  /** «Applies to both allies and enemies»: i Comandamenti, che colpiscono anche la tua squadra */
  readonly bothSides?: true;
  /** «including those in the Secondary Slot»: la condizione conta anche la panchina */
  readonly withBench?: true;
  /** «When the hero enters the battle from the Secondary Slot»: solo partendo in panchina */
  readonly fromBench?: true;
  /** «the hero is given the additional race Demon» */
  readonly extraRaces?: readonly number[];
  /** detto nella frase: «In PVP», «in Death Match» */
  readonly only?: readonly TeamPlace[];
  /** detto nella frase: «(Excludes PVP and Death Match)» */
  readonly except?: readonly TeamPlace[];
}

/** Un testo di passiva: il suo gruppo «applicabili» (posizione in `TeamIndex.groups`) e le frasi lette. */
export interface TeamText {
  readonly group: number | null;
  readonly links: readonly TeamLink[];
}

/**
 * Una passiva di un eroe: l'Unica, la Reliquia sacra (la classica: un eroe che ne
 * ha due ne attiva una alla volta), un Comandamento, una Grazia, un'Unita' o un
 * Talento. `steps` dice quale testo vale da quale rango della Mossa finale,
 * come `ultimateSteps` della scheda: `[1, 4]` e `[3, 9]` vogliono dire il testo 4
 * dal rango 1 e il 9 dal rango 3. Un testo senza frasi per la squadra e' -1.
 */
export interface TeamSource {
  readonly kind: "unique" | "relic" | "special";
  readonly id: string;
  readonly name: HeroLabel;
  /** comandamento, grazia, unita, talento (le chiavi di `HeroSpecialsIndex.kinds`) */
  readonly special?: string;
  /** i codici del client di dove si attiva (1-9, `HeroContextIndex.passiveConditions`) */
  readonly conditions: readonly number[];
  readonly steps: readonly (readonly [fromUltimateRank: number, text: number])[];
}

export interface TeamIndex {
  /** le frasi, una volta sola: {it, en}, l'italiano null dove le frasi non si appaiano */
  readonly sentences: readonly HeroLabel[];
  readonly groups: readonly HeroTermGroup[];
  readonly texts: readonly TeamText[];
  /** eroe -> le sue passive, nell'ordine Unica, abilita' speciali, reliquia */
  readonly heroes: Readonly<Record<string, readonly TeamSource[]>>;
}
