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

/**
 * Una statistica come la chiamano le tabelle del client (concetti/statistiche.json),
 * piu' i danni inflitti e subiti, che nel gioco sono un numero solo per colpo.
 */
export type TeamStat =
  | "atk"
  | "fixed_atk_per"
  | "crit_per"
  | "crit_atk_per"
  | "def"
  | "fixed_def_per"
  | "crit_res_per"
  | "crit_def_per"
  | "hp"
  | "hp_regen_per"
  | "hp_recovery_per"
  | "hp_steal_per"
  | "dmg"
  | "dmg_taken";

/**
 * Un effetto numerico di una frase: «basic stats of Applicable Allies +15%». Letto dal
 * testo da numeri_passive.py e controllato contro le righe di DB_skill_passive: delle
 * 597 voci che valgono sempre (09/11), una sola non sta nelle righe, ed e' `sometimes`:
 * l'Unica di Mono 1685503 scrive «-20%» e la sua riga dice 10.
 */
export interface TeamEffect {
  readonly stats: readonly TeamStat[];
  /** col segno, in punti percentuali: 15 vuol dire +15% */
  readonly value: number;
  readonly to: "self" | "team" | "enemies";
  /** per `to: "team"`: chi lo riceve, l'uno O l'altro */
  readonly who?: readonly TeamWho[];
  /** si moltiplica per quanti in squadra corrispondono */
  readonly each?: TeamWho;
  /** vale solo se la squadra rispetta queste condizioni */
  readonly needs?: readonly TeamCondition[];
  /** il valore non supera questo («up to a maximum of 30%») */
  readonly cap?: number;
  /** il conteggio non supera questo («(Limit 5 times)») */
  readonly times?: number;
  /**
   * Dipende da cosa succede in battaglia (un turno, un colpo, uno stato) e non da chi
   * c'e' in squadra: si mostra e non si somma.
   */
  readonly sometimes?: true;
  /** solo con certi colpi; assente vuol dire tutti */
  readonly on?: "single" | "all" | "ultimate";
  /** «final damage taken»: nel gioco vale la riduzione piu' forte, non la somma */
  readonly final?: true;
  /**
   * La parola chiave della riga, come numero: valori con la stessa si sommano, con
   * parole diverse si moltiplicano. Serve solo a confrontarle: il nome resta in squadra.json.
   */
  readonly keyword?: number;
}

/** Una frase con dei numeri, anche se non nomina nessun compagno («Increases all stats of the hero by 10%»). */
export interface TeamEffectLine {
  readonly sentence: number;
  readonly effects: readonly TeamEffect[];
  readonly notSelf?: true;
  readonly withBench?: true;
  readonly fromBench?: true;
  readonly only?: readonly TeamPlace[];
  readonly except?: readonly TeamPlace[];
}

/** Un testo di passiva: il suo gruppo «applicabili» (posizione in `TeamIndex.groups`), le frasi lette e i numeri. */
export interface TeamText {
  readonly group: number | null;
  readonly links: readonly TeamLink[];
  readonly numbers?: readonly TeamEffectLine[];
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
