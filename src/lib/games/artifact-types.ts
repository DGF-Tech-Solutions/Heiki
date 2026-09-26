/**
 * Il contratto degli artefatti: le Carte artefatto e i Set artefatto.
 *
 * Nel gioco una carta si equipaggia su una squadra e ne alza le statistiche; tre
 * o cinque carte precise fanno un set, che aggiunge un effetto (il «Set Bonus
 * Artefatto») e si potenzia con le Carte placcate, cioe' i doppioni. Sta in un
 * file suo come l'Endgame: e' un mondo a parte, e types.ts ne importa solo
 * l'indice, per il campo del modulo.
 *
 * La fonte e' il client, via la pipeline (script/artefatti.py): le tabelle
 * DB_artifact_*, i pacchetti di carte, i testi. Come per gli eroi, ogni testo
 * arriva nelle due lingue col markup del gioco, e quello che la pipeline ha
 * DEDOTTO invece di leggere lo dice la pagina: i punti di potenziamento come
 * totali e le probabilita' dei pacchetti.
 *
 * Razze e caratteristiche dei filtri dei set sono gli stessi codici degli eroi:
 * i nomi li da' heroContext, non si ripetono qui.
 */

import type { HeroLabel } from "./types";

/** Una Carta artefatto. */
export interface ArtifactCard {
  readonly id: string;
  /** 1 Personaggio, 2 Mostro, 3 Storia, 4 Scena, 5 Speciale: chiave di `ArtifactIndex.types` */
  readonly type: number;
  /** il numero nel tipo: con la sigla del tipo fa «PG-1» («CH-1» in inglese) */
  readonly number: number;
  /** 1-6 (C, UC, R, SR, SSR, UR): chiave di `ArtifactIndex.grades` */
  readonly grade: number;
  readonly name: HeroLabel;
  readonly description: HeroLabel | null;
  /** le statistiche che la carta da' alla squadra su cui e' equipaggiata */
  readonly stats: { readonly atk: number; readonly def: number; readonly hp: number };
  /** l'id del set di cui fa parte: una carta sta al piu' in un set */
  readonly set: string | null;
  /** i pacchetti che la contengono: chiavi di `ArtifactIndex.packs` */
  readonly packs: readonly string[];
  /** il Pacchetto di carte del tempo (evento dei desideri): il suo peso, e quello se e' nella lista */
  readonly timePack: { readonly weight: number; readonly wishWeight: number } | null;
  /**
   * c'e' l'immagine in public/eroi/<gioco>/artefatti/carte/<id>.webp (e carte-piccole/):
   * la carta gia' composta, l'illustrazione dentro la cornice del suo grado
   */
  readonly image: boolean;
}

/** Un Set artefatto. */
export interface ArtifactSet {
  readonly id: string;
  /** il numero nella collezione del gioco («No.2»): e' anche l'indirizzo della sua pagina */
  readonly number: number;
  readonly name: HeroLabel;
  /** gli id delle carte, nell'ordine del client */
  readonly cards: readonly string[];
  /** l'effetto a ogni livello, dal primo: un livello solo, tre o cinque */
  readonly levels: readonly HeroLabel[];
  /** la classe di potenziamento: chiave di `ArtifactIndex.enhancement.classes` */
  readonly enhanceClass: number;
  /** i filtri con cui il gioco cerca i set, come codici */
  readonly filters: {
    /** chiavi di `ArtifactIndex.filters.contents` */
    readonly contents: readonly number[];
    /** razze degli eroi (1-6) */
    readonly races: readonly number[];
    /** caratteristiche degli eroi (JobGroup, 1-10) */
    readonly factions: readonly number[];
    /** chiavi di `ArtifactIndex.filters.misc` */
    readonly misc: readonly number[];
  };
  /** il nome dell'evento da cui il set e' nato, se c'e' */
  readonly event: HeroLabel | null;
}

/** Un pacchetto di carte: cosa contiene e con che peso. */
export interface ArtifactPack {
  /** null per tre pacchetti del boss finale, che nel client non hanno nome */
  readonly name: HeroLabel | null;
  readonly description: HeroLabel | null;
  /** l'icona dell'oggetto, in public/eroi/<gioco>/artefatti/pacchetti/<icon> */
  readonly icon: string | null;
  readonly cards: readonly { readonly card: string; readonly weight: number }[];
  /**
   * La somma dei pesi. La probabilita' di una carta e' peso / somma: DEDOTTO,
   * perche' l'estrazione la fa il server; quasi sempre la somma e' 10.000.
   */
  readonly total: number;
}

export interface ArtifactIndex {
  /**
   * Le misure delle carte composte, in pixel: la piccola (cornice delle liste,
   * a scala 2) e la grande (cornice della carta, allargata attorno
   * all'illustrazione quadrata). Sono verticali come nel gioco; le pagine ne
   * prendono le proporzioni.
   */
  readonly images: {
    readonly small: { readonly width: number; readonly height: number };
    readonly large: { readonly width: number; readonly height: number };
  };
  /** i nomi del gioco: «Carte artefatto», «Set Artefatto», «Pacchetto carte Artefatto»... */
  readonly names: {
    readonly cards: HeroLabel;
    readonly set: HeroLabel;
    readonly setBonus: HeroLabel;
    readonly pack: HeroLabel;
  };
  /** il tutorial del menu Artefatto, pagina per pagina */
  readonly guide: readonly HeroLabel[];
  /** il rango giocatore che apre il menu, e la frase del gioco con {0} */
  readonly unlock: { readonly rank: number; readonly text: HeroLabel | null };
  /** «Le carte gia' possedute si trasformano in Carte placcate» */
  readonly plateText: HeroLabel | null;
  readonly types: Readonly<Record<string, { readonly key: string; readonly name: HeroLabel; readonly prefix: HeroLabel }>>;
  readonly grades: Readonly<
    Record<
      string,
      {
        readonly code: string;
        readonly name: HeroLabel;
        /** la Carta placcata del grado: quanti punti di potenziamento vale, e se c'e' l'icona */
        readonly plate: { readonly name: HeroLabel; readonly points: number; readonly icon: boolean };
      }
    >
  >;
  readonly filters: {
    /** l'icona e' quella delle condizioni delle passive, in artefatti/filtri/<icon>.png */
    readonly contents: Readonly<Record<string, { readonly name: HeroLabel; readonly icon: string | null }>>;
    readonly misc: Readonly<Record<string, { readonly name: HeroLabel }>>;
  };
  /**
   * Il potenziamento dei set: per classe, i punti TOTALI per arrivare al livello
   * 2, 3, 4, 5. DEDOTTO: la tabella del client ha una riga per livello, e le 306
   * squadre del computer che usano un set hanno esattamente il totale del livello
   * massimo del loro set.
   */
  readonly enhancement: {
    readonly classes: Readonly<Record<string, readonly number[]>>;
    /** quante carte si possono usare in un potenziamento */
    readonly cardsPerRound: number;
  };
  readonly cards: readonly ArtifactCard[];
  /** in ordine di numero */
  readonly sets: readonly ArtifactSet[];
  readonly packs: Readonly<Record<string, ArtifactPack>>;
  /** il Pacchetto di carte del tempo dell'evento dei desideri, con le regole del gioco */
  readonly timePack: {
    readonly title: HeroLabel | null;
    readonly rules: readonly HeroLabel[];
    readonly cost: HeroLabel | null;
    readonly cards: number;
  } | null;
}
