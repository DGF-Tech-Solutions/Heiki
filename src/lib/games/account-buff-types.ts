/**
 * Il contratto dei buff dell'account: la classe di combattimento dell'account e
 * le costellazioni, e le regole della classe di combattimento di un eroe.
 *
 * Nel gioco sono due sistemi che toccano TUTTI gli eroi di un account, e che la
 * scheda di un eroe non mostra: la classe dell'account (la somma delle classi
 * degli eroi) sblocca titoli che aumentano Attacco, Difesa e PS in percentuale;
 * le costellazioni sono undici mappe di pietre che aggiungono statistiche. Contano
 * in battaglia, non nella classe di combattimento dell'eroe ne' nella sua
 * schermata delle statistiche: lo dice il codice del client, e lo studio con le
 * prove sta nella pipeline (BUFF_ACCOUNT.md).
 *
 * La fonte e' il client, via la pipeline (script/buff_account.py): le tabelle
 * DB_constellation_*, DB_const_manastone_random, i titoli, la configurazione, e le
 * posizioni delle pietre lette dai prefab delle mappe. Sta in un file suo come
 * artefatti ed Endgame: types.ts ne importa solo l'indice, per il campo del modulo.
 */

import type { HeroLabel } from "./types";

/**
 * Le statistiche del client (StatusData.TYPE) con la chiave che usano gia' le
 * statistiche degli eroi del sito. Le percentuali sono in punti: 0,2 = 0,2%.
 */
export type AccountStatKey =
  | "atk"
  | "fixedAtkPer"
  | "def"
  | "fixedDefPer"
  | "critPer"
  | "critAtkPer"
  | "critResPer"
  | "critDefPer"
  | "hp"
  | "hpRecoveryPer"
  | "hpRegenPer"
  | "hpStealPer"
  | "dmgRes"
  | "dmgInc";

/** Un insieme di statistiche: solo quelle che ci sono. */
export type StatBag = Partial<Record<AccountStatKey, number>>;

export interface AccountStatInfo {
  readonly key: AccountStatKey;
  /** il nome della schermata delle statistiche del gioco (UI_skin_stat_N) */
  readonly name: HeroLabel;
  readonly description: HeroLabel | null;
  /** true: si scrive con «%», e un buff del titolo non la tocca */
  readonly percent: boolean;
  /** il peso nella classe di combattimento: per punto percentuale, o per unita' */
  readonly weight: number;
}

/** Una soglia della classe di combattimento dell'account, col buff del suo titolo. */
export interface AccountPowerTier {
  readonly threshold: number;
  readonly title: HeroLabel;
  /** i buff in percentuale: si applicano alla statistica prima delle passive */
  readonly atk: number;
  readonly def: number;
  readonly hp: number;
  readonly growthPoints: number;
  /**
   * Il testo del titolo nel gioco, quando nomina statistiche diverse dalle sue
   * passive (750.000 e 1.250.000 dicono «PS», e danno Difesa). Vale la passiva.
   */
  readonly textSays: HeroLabel | null;
}

export type StoneKind = "start" | "stone" | "mana";
export type StoneColor = "red" | "blue" | "green";

/** Una pietra di una costellazione. */
export interface ConstellationStone {
  readonly id: number;
  readonly kind: StoneKind;
  /** la pietra che va attivata prima; null per la partenza */
  readonly mother: number | null;
  /** la statistica; null per la partenza */
  readonly stat: AccountStatKey | null;
  /** il valore di una pietra; null per la partenza e per le pietre del mana (casuale) */
  readonly value: number | null;
  /** le pietre del mana: chiave di `AccountBuffIndex.mana` */
  readonly mana: string | null;
  readonly growthPoints: number;
  readonly color: StoneColor | null;
  /** la posizione nella mappa del gioco, in unita' del prefab, con la y verso l'alto */
  readonly x: number;
  readonly y: number;
}

export interface Constellation {
  readonly id: number;
  /** 1 i Sette Peccati, 2 i Quattro Cavalieri */
  readonly theme: 1 | 2;
  readonly name: HeroLabel;
  /** «Lussuria», «Lust»: come la chiama il gioco nel titolo del suo Caos */
  readonly shortName: HeroLabel;
  /** c'e' il simbolo in buff-account/simboli/<id>.png */
  readonly symbol: boolean;
  /** la costellazione da completare prima */
  readonly after: number | null;
  /** il bonus a costellazione completa */
  readonly completion: { readonly atk: number; readonly def: number; readonly hp: number };
  /** i Punti Crescita per attivare tutte le pietre */
  readonly growthPoints: number;
  /** completarla apre il Caos di queste costellazioni */
  readonly opensChaosOf: readonly number[];
  /** il Caos: quante pietre del mana si bloccano al massimo, e con quanti oggetti */
  readonly lock: { readonly max: number; readonly cost: readonly number[] };
  readonly stones: readonly ConstellationStone[];
}

/** Le tre fasce di una pietra del mana, con la probabilita' per livello del Caos (1-20). */
export interface ManaGroup {
  readonly stat: AccountStatKey;
  readonly tiers: readonly { readonly min: number; readonly max: number; readonly rates: readonly number[] }[];
}

/** Le regole della classe di combattimento di un eroe (SkinData.GetPower). */
export interface HeroPowerRules {
  /** per punto percentuale o per unita' */
  readonly weights: StatBag;
  /** con la passiva unica */
  readonly uniquePassive: number;
  /** per ogni rango dell'ultimate */
  readonly perUltimateRank: number;
  /** col legame attivo in squadra (non nella classe mostrata dalla scheda) */
  readonly bond: number;
  /** col Vero risveglio, una volta sola anche coi due tipi */
  readonly trueAwakening: number;
}

export interface AccountBuffIndex {
  /**
   * Un'impronta dei dati: le scelte pietra per pietra salvate nel browser la
   * portano, e se una patch cambia le costellazioni si sa che vanno rifatte.
   */
  readonly version: string;
  readonly names: {
    readonly page: HeroLabel;
    readonly powerBuff: HeroLabel;
    readonly accountPower: HeroLabel;
    readonly sevenSins: HeroLabel;
    readonly fourKnights: HeroLabel;
    readonly constellationBuff: HeroLabel;
    readonly stone: HeroLabel;
    readonly manaStone: HeroLabel;
    readonly stones: Readonly<Record<StoneColor, HeroLabel>>;
    readonly manaStones: Readonly<Record<StoneColor, HeroLabel>>;
    readonly chaos: HeroLabel;
    readonly growthPoints: HeroLabel;
    readonly completion: HeroLabel;
  };
  /** le spiegazioni del gioco, col suo markup */
  readonly texts: {
    readonly powerRule: HeroLabel | null;
    readonly heroPower: HeroLabel | null;
    readonly guide: HeroLabel | null;
    readonly growthPoints: HeroLabel | null;
    readonly unlock: HeroLabel | null;
    readonly fourKnights: HeroLabel | null;
    readonly inOrder: HeroLabel | null;
    readonly chaos: readonly HeroLabel[];
    readonly rates: HeroLabel | null;
  };
  /** le 14 statistiche, nell'ordine della schermata del gioco */
  readonly stats: readonly AccountStatInfo[];
  readonly heroPower: HeroPowerRules;
  readonly accountPower: { readonly tiers: readonly AccountPowerTier[] };
  readonly constellations: readonly Constellation[];
  readonly mana: Readonly<Record<string, ManaGroup>>;
  readonly rules: {
    /** gli eroi da possedere per aprire le costellazioni */
    readonly heroesToOpen: number;
  };
  /** quali immagini ci sono, in buff-account/icone/ */
  readonly icons: readonly string[];
}

/**
 * Quello che serve allo slider della scheda eroe: ogni costellazione ridotta ai
 * suoi totali. Poche centinaia di numeri, invece delle 1.463 pietre: le scelte
 * pietra per pietra le somma la pagina «Buff dell'account», e la scheda legge i
 * totali salvati.
 */
export interface AccountSliderData {
  readonly version: string;
  readonly tiers: readonly Pick<AccountPowerTier, "threshold" | "atk" | "def" | "hp">[];
  readonly constellations: readonly ConstellationTotals[];
  readonly heroPower: HeroPowerRules;
}

export interface ConstellationTotals {
  readonly id: number;
  readonly name: string;
  /** l'indirizzo del simbolo, se c'e' */
  readonly symbol: string | null;
  /** le pietre fisse, tutte attivate */
  readonly stones: StatBag;
  /** le pietre del mana, tutte al minimo, nella media (Caos al livello 1) o al massimo */
  readonly mana: { readonly min: StatBag; readonly avg: StatBag; readonly max: StatBag };
  readonly completion: StatBag;
}
