/**
 * Il contratto dei cambiamenti: cosa e' cambiato da una patch all'altra.
 *
 * Richiesta dell'utente (03/10): far vedere cosa cambia a ogni patch. Scelte sue:
 * una pagina «Cambiamenti» con un blocco per patch, e nella scheda Info di ogni
 * eroe le volte che e' cambiato; conta quello che cambia gli eroi, il resto del
 * client solo come conteggio.
 *
 * La pipeline (script/cambiamenti.py) confronta le patch archiviate
 * (script/archivio_patch.py) costruendo le schede degli eroi con lo stesso codice
 * per tutte e due: le differenze vengono dai dati, non da una correzione della
 * pipeline. L'archivio comincia il 23/09/2026: le patch prima non si possono
 * ricostruire.
 */

import type { HeroLabel } from "./types";

/**
 * Di che parte della scheda e' la voce. Le carte sono quelle dei ranghi (A, B,
 * Mossa finale); `passive` e' l'Unica; `taboo`, `grace`, `solidarity`, `ability`
 * sono Comandamento, Grazia, Unita' e Talento; `craft` la Reliquia sacra.
 */
export type ChangePart =
  | "nome"
  | "stats"
  | "skillsA"
  | "skillsB"
  | "skillsSpecial"
  | "passive"
  | "taboo"
  | "grace"
  | "solidarity"
  | "ability"
  | "craft"
  | "fates"
  | "costume";

export type ChangeKind = "cambiato" | "aggiunto" | "tolto";

/** Un pezzo del confronto parola per parola: uguale, tolto o aggiunto. */
export type ChangeSegment = readonly ["=" | "-" | "+", string];

export interface HeroChange {
  readonly part: ChangePart;
  /**
   * Quale: il rango per le carte (1-3, la Mossa finale 1-6); per i testi a livelli
   * (Unica, Talento) il livello della Mossa finale da cui vale, 0 quello di base;
   * l'id per reliquie e costumi; l'heroId dell'associato per i legami.
   */
  readonly which: number | null;
  /** `name`, `nickname`, `explain`, una statistica (`atk`...) o `stat:<statistica>` della reliquia */
  readonly field: string;
  readonly kind: ChangeKind;
  /** il testo come si legge, nelle due lingue, o il numero */
  readonly before: HeroLabel | number | null;
  readonly after: HeroLabel | number | null;
  /** per un testo cambiato: le parti uguali, tolte e aggiunte, nelle due lingue */
  readonly segments?: { readonly it: readonly ChangeSegment[]; readonly en: readonly ChangeSegment[] };
}

/** Un testo cambiato solo nei codici di colore o di stile: si legge uguale. */
export interface HeroTouchup {
  readonly part: ChangePart;
  readonly which: number | null;
  readonly field: string;
}

/** Il resto del client, per gruppo di tabelle: solo quante righe. */
export interface OtherChanges {
  readonly group: string;
  readonly name: HeroLabel;
  readonly added: number;
  readonly removed: number;
  readonly changed: number;
}

export interface PatchChanges {
  /** la patch di prima e quella nuova, AAAA-MM-GG: il giorno in cui il gioco l'ha scaricata */
  readonly from: string;
  readonly to: string;
  readonly newHeroes: readonly string[];
  /** heroId -> le voci cambiate */
  readonly heroes: Readonly<Record<string, readonly HeroChange[]>>;
  readonly touchups: Readonly<Record<string, readonly HeroTouchup[]>>;
  readonly other: readonly OtherChanges[];
  /** i testi del client, per nome della chiave */
  readonly texts: { readonly added: number; readonly changed: number; readonly removed: number };
}

export interface ChangesIndex {
  /** le patch archiviate, dalla prima */
  readonly patches: readonly string[];
  /** un confronto per coppia di patch consecutive, dal piu' recente */
  readonly comparisons: readonly PatchChanges[];
}
