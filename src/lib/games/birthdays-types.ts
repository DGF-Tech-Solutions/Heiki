/**
 * Il contratto dei compleanni: il profilo di ogni eroe e la festa in taverna.
 *
 * Nel gioco sono due cose. Ogni versione di un eroe ha un compleanno nel profilo
 * (`DB_hero_base.hero_birth`); la FESTA invece vale per i 50 clienti della taverna
 * (`DB_birthday`), che sono personaggi e non versioni: quel giorno il loro regalo
 * preferito da' dieci volte i punti Affetto. Chi festeggia oggi lo decide il server
 * del gioco al ripristino giornaliero; il sito usa la data di chi guarda.
 *
 * I dati li scrive `scripts/import-birthdays.mts` da `eroi/compleanni.json` della
 * pipeline (`script/compleanni.py`, dove sta la spiegazione di ogni campo).
 */

import type { HeroLabel } from "./types";

/** mese (1-12) e giorno */
export type MonthDay = readonly [month: number, day: number];

/** Un regalo per un cliente della taverna, e cosa da' indietro. */
export interface TavernGift {
  /** oggetto da regalare (chiave di `BirthdaysIndex.items`) */
  item: string;
  count: number;
  /** punti Affetto in un giorno qualunque */
  affection: number;
  returnItem: string;
  returnCount: number;
}

export interface TavernGuest {
  /** `guest_id` del gioco */
  guest: number;
  /** il personaggio (chiave di `BirthdaysIndex.groups`) */
  group: string;
  /** legame cliente-personaggio dedotto (Hawk) e non scritto in una tabella */
  deduced: boolean;
  date: MonthDay;
  /** quanto moltiplica i punti Affetto del regalo preferito, nel giorno della festa */
  multiplier: number;
  /** la battuta del festeggiato quando riceve il regalo */
  line: HeroLabel | null;
  /** l'eroe dell'illustrazione che il gioco mostra per la festa, se e' nel roster */
  artHero: string | null;
  /** le versioni del personaggio nel roster */
  heroes: readonly string[];
  /** il regalo preferito; null per Meliodas e Hawk, che in taverna ci vivono */
  gift: TavernGift | null;
}

export interface BirthdayItem {
  name: HeroLabel;
  description: HeroLabel | null;
}

export interface BirthdaysIndex {
  /** il moltiplicatore della festa: uguale per tutti i clienti (l'import lo controlla) */
  multiplier: number;
  /** punti Affetto in un Cuore (`love_point_max`) */
  affectionPerHeart: number;
  /** Cuori per ogni versione posseduta, e con la sua Affinita' al massimo */
  heartsPerVersion: number;
  heartsAtMaxAffinity: number;
  /** il regalo che vale per tutti i clienti, e che la festa NON moltiplica */
  commonGift: TavernGift;
  /** ricompense per Cuori raccolti in tutto il gioco */
  heartRewards: readonly { hearts: number; item: string; count: number }[];
  items: Readonly<Record<string, BirthdayItem>>;
  /** nome del personaggio, per numero del gruppo */
  groups: Readonly<Record<string, HeroLabel>>;
  guests: readonly TavernGuest[];
  /**
   * Il compleanno nel profilo di ogni eroe del roster: una data per persona
   * dell'eroe (due per King & Diane), null se il gioco dice «Sconosciuto».
   */
  heroes: Readonly<Record<string, { group: string; dates: readonly (MonthDay | null)[] }>>;
  /** testi del gioco, nelle due lingue */
  texts: Readonly<Record<BirthdayText, HeroLabel>>;
}

export type BirthdayText =
  | "festa"
  | "avviso"
  | "auguri"
  | "passato"
  | "escluso"
  | "compleanno"
  | "affetto"
  | "affetto_come"
  | "cuori_ricompense"
  | "clienti_regali"
  | "taverna_chiude"
  | "affetto_massimo"
  | "sconosciuto";
