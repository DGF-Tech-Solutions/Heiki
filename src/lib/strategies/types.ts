/**
 * Le strategie dell'Endgame: squadre consigliate e guide.
 *
 * Una strategia e' un post della community con una scheda in piu': la modalita'
 * (Scontri finali, Bestie demoniache, Re Demone, Divinita' Suprema), il bersaglio
 * (un boss, una bestia), la difficolta' (per le bestie: piano trascendente o no),
 * la squadra, il set di artefatti e una nota per ogni fase. Chiesto dall'utente
 * l'11/10: «post in cui si tagga uno tra gli endgame... in questi template per
 * modalita' dev'essere possibile impostare un team, un set di artefatti e
 * scrivere a riguardo di ogni fase».
 *
 * Perche' un post e non una tabella a se': voti, commenti, segnalazioni,
 * moderazione e feed ci sono gia', e una squadra consigliata e' proprio una cosa
 * da votare e discutere. La scheda sta accanto al post (`post_strategies`), uno a
 * uno.
 *
 * Due tipi, decisi dal contenuto e non da una scelta: senza testo e' un
 * CONSIGLIO DI SQUADRA e si pubblica subito; con un testo (titolo, note o una
 * fase) e' una GUIDA e la rivede un moderatore. Il titolo conta come testo: e'
 * la prima cosa che si legge nelle pagine dell'Endgame, e senza revisione
 * sarebbe la via piu' corta per scriverci qualunque cosa.
 */

import type { EndgameMode } from "@/lib/games/endgame-types";

export type { EndgameMode };

export const STRATEGY_MODES = [
  "death-match",
  "creature-nest",
  "demon-king",
  "supreme-deity",
] as const satisfies readonly EndgameMode[];

/** quattro eroi in squadra, come nel gioco; il quarto e' il primo a entrare dalla panchina */
export const TEAM_SIZE = 4;

/** Le misure del testo: abbastanza per una guida vera, non per un romanzo. */
export const STRATEGY_LIMITS = {
  titleMin: 10,
  titleMax: 120,
  notesMax: 6000,
  phaseMax: 3000,
} as const;

/** Un posto della squadra: l'eroe e, se c'e', il suo Eroe associato. */
export interface StrategySlot {
  readonly hero: string;
  readonly associate: string | null;
}

/**
 * Dove vale la strategia.
 *
 *  - `target`: la chiave del boss (Scontri finali) o della bestia; null per Re
 *    Demone e Divinita' Suprema, che hanno un bersaglio solo
 *  - `level`: il `level` della difficolta'; null per le bestie
 *  - `transcendent`: solo per le bestie, se punta al piano trascendente. Per le
 *    bestie la difficolta' e' solo questo (scelta dell'utente): «non
 *    trascendente» vuol dire i tre piani normali, e le fasi sono quelle del terzo
 */
export interface StrategySelection {
  readonly mode: EndgameMode;
  readonly target: string | null;
  readonly level: number | null;
  readonly transcendent: boolean;
}

/** Quello che il modulo manda all'azione (in JSON, campo `strategy`). */
export interface StrategyDraft extends StrategySelection {
  /** sempre TEAM_SIZE posti, nell'ordine della squadra */
  readonly team: readonly StrategySlot[];
  /** ArtifactSet.id; null = nessun set indicato */
  readonly artifactSet: string | null;
  /** vuoto per un consiglio di squadra */
  readonly title: string;
  /** le note generali (il testo del post) */
  readonly notes: string;
  /** una nota per fase, nell'ordine del modello; "" = niente da dire */
  readonly phases: readonly string[];
}

export type StrategyStatus = "PUBLISHED" | "IN_REVIEW" | "REJECTED";

export type StrategyKind = "team" | "guide";

/** Una strategia salvata, con lo stato della revisione. */
export interface StrategyRecord extends StrategyDraft {
  readonly postId: string;
  readonly game: string;
  readonly status: StrategyStatus;
  /** il titolo l'ha scritto il sito (consiglio di squadra): si rifa' nella lingua di chi legge */
  readonly autoTitle: boolean;
  /** il motivo del rifiuto, o la nota di chi ha approvato */
  readonly reviewNote: string | null;
  readonly reviewedAt: string | null;
  readonly authorUsername: string;
}

/** L'autore come lo mostrano le schede. */
export interface StrategyAuthor {
  readonly username: string;
  readonly displayName: string;
  readonly accent: string;
}

/** Una strategia pubblicata, per le schede delle pagine dell'Endgame. */
export interface StrategyCardData extends StrategySelection {
  readonly postId: string;
  readonly game: string;
  readonly kind: StrategyKind;
  readonly title: string;
  readonly autoTitle: boolean;
  readonly team: readonly StrategySlot[];
  readonly artifactSet: string | null;
  /** quante fasi hanno una nota */
  readonly phaseNotes: number;
  readonly author: StrategyAuthor;
  readonly score: number;
  readonly commentCount: number;
  readonly createdAt: string;
}

/** Il riassunto che il feed mette accanto a un post con una strategia. */
export interface StrategyBrief extends StrategySelection {
  readonly kind: StrategyKind;
  readonly heroes: readonly string[];
}

/* ------------------------------------------------ il modello del modulo -- */

/**
 * Quello che il modulo di scrittura deve sapere, gia' nella lingua della pagina.
 * Lo costruisce il server (`strategyTemplate`); al browser arrivano solo nomi,
 * numeri e indirizzi.
 */
export interface TemplateHero {
  readonly id: string;
  readonly name: string;
  readonly epithet: string;
  /** il personaggio: due versioni dello stesso non stanno insieme in squadra */
  readonly group: string;
  /** codici d'attributo 1-5; Tristan Luce/Oscurita' ne ha due */
  readonly attributes: readonly number[];
  readonly color: string | null;
  readonly rarity: string;
  /** l'indirizzo della card */
  readonly card: string;
}

export interface TemplatePhase {
  /** «Fase 1», «Primo Giudizio» */
  readonly label: string;
  /** chi c'e' o cosa succede, in testo semplice: il nemico, la descrizione del gioco */
  readonly detail: string | null;
}

export interface TemplateLevel {
  readonly level: number | null;
  readonly transcendent: boolean;
  /** il nome della difficolta' come lo scrive il gioco, o «Piani 1-3» / «Trascendente» */
  readonly name: string;
  /** il colore del gioco, col cancelletto */
  readonly color: string | null;
  readonly phases: readonly TemplatePhase[];
  /** gli attributi ammessi; null = tutti */
  readonly allowedAttributes: readonly number[] | null;
  /** eroi che non possono entrare in squadra (della difficolta' e della modalita') */
  readonly banned: readonly string[];
}

export interface TemplateTarget {
  readonly key: string | null;
  readonly name: string;
  /** un'immagine del boss o della bestia, se c'e' */
  readonly image: string | null;
  readonly levels: readonly TemplateLevel[];
}

export interface TemplateMode {
  readonly mode: EndgameMode;
  readonly name: string;
  /** la pagina della modalita' nel sito */
  readonly href: string;
  readonly targets: readonly TemplateTarget[];
}

export interface TemplateSet {
  readonly id: string;
  readonly number: number;
  readonly name: string;
  /** «No. 12» */
  readonly code: string;
  /** l'immagine piccola della prima carta */
  readonly image: string | null;
  /** quante carte */
  readonly cards: number;
  /** la passiva al livello massimo, in testo semplice */
  readonly bonus: string | null;
  /** le modalita' in cui il set vale (dai filtri «Contenuto» del gioco) */
  readonly modes: readonly EndgameMode[];
}

export interface StrategyTemplate {
  readonly game: string;
  readonly modes: readonly TemplateMode[];
  readonly heroes: readonly TemplateHero[];
  readonly sets: readonly TemplateSet[];
}
