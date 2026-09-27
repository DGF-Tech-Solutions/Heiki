/**
 * Il contratto dell'equipaggiamento e dei costumi: quello che serve al
 * calcolatore della scheda eroe e alla scheda Costumi.
 *
 * Nel client l'equipaggiamento si chiama «weapon» (WeaponData, DB_weapon_*). Lo
 * scrive la pipeline (script/equipaggiamento.py, script/costumi.py, con gli studi
 * EQUIPAGGIAMENTO.md e COSTUMI_ASSOCIAZIONI.md nella sua radice), lo porta qui
 * scripts/import-gear.mts. Sta in un file suo come gli artefatti: types.ts ne
 * importa solo gli indici, per i campi del modulo.
 *
 * Come si sommano le statistiche lo dice il codice del client, e sta in gear.ts:
 * qui solo i numeri delle tabelle.
 */

import type { HeroLabel } from "./types";

/**
 * Come si somma una passiva (SkinData.GetApplyPassiveStat): `percent` moltiplica
 * la statistica senza passive (le «inc_per»: Attacco%, Difesa%, PS%), `points`
 * aggiunge punti percentuali (le «add_per»: Possibilita' critico, Perforazione...),
 * `flat` aggiunge un valore (le «add»: Attacco +280 di un legame).
 */
export type PassiveMode = "percent" | "points" | "flat";

/** Un set: con `pieces` pezzi indossati la sua passiva, con il doppio due volte. */
export interface GearSet {
  readonly id: number;
  readonly name: HeroLabel;
  /** 2 o 4 */
  readonly pieces: number;
  readonly stat: string;
  readonly mode: PassiveMode;
  readonly value: number;
  /**
   * false per Pazienza, Perforazione e Rigenerazione: i pezzi esistono nelle
   * tabelle ma nessuna ricompensa del client li da', e il menu del gioco non li
   * mostra (`tab_on` 0). Il calcolatore li tiene in fondo, segnati.
   */
  readonly obtainable: boolean;
}

/** Una delle sei parti: Braccialetto, Collana, Cintura, Anello, Orecchini, Runa. */
export interface GearPart {
  /** 1-6, `weapon_parts` */
  readonly part: number;
  readonly name: HeroLabel;
  /** la statistica principale (GetMainStatusType) */
  readonly stat: "atk" | "def" | "hp";
  /** il gruppo dei suoi effetti bonus (`random_option_id`, uguale al tipo del pezzo) */
  readonly group: number;
}

/** La statistica principale di una parte a una rarita': il tiro fra min e max, e quanto aggiunge ogni miglioramento. */
export interface GearValue {
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

/** Un effetto bonus: uno per risveglio del pezzo, del gruppo della sua parte. */
export interface GearOption {
  readonly id: number;
  readonly group: number;
  readonly name: HeroLabel;
  readonly stat: string;
  readonly mode: PassiveMode;
  /** in punti percentuali; il gioco va a passi di `rules.optionStep` */
  readonly min: number;
  readonly max: number;
}

/**
 * Le icone quadrate degli oggetti come le disegna il gioco (IconItem): strati
 * gia' al loro posto, della misura dell'icona, da impilare nell'ordine dato.
 * L'immagine dell'oggetto (il pezzo, il costume) e' l'unica che va messa in un
 * riquadro, `objectBox`, perche' e' quella del client cosi' com'e'.
 */
export interface ItemIconLayers {
  /** il lato della tela degli strati, 128 */
  readonly size: number;
  /** [x, y, larghezza, altezza] dell'immagine dell'oggetto nella tela */
  readonly objectBox: readonly [number, number, number, number];
  /** [x, y, larghezza, altezza] dell'esagono col glifo del set: puo' uscire un poco dalla tela */
  readonly setBox: readonly [number, number, number, number];
  /** l'ordine degli strati dal basso, coi nomi dei file: `oggetto` e' l'immagine dell'oggetto */
  readonly order: {
    readonly gear: readonly string[];
    readonly costume: readonly string[];
  };
  /** 1-7 -> C, UC, R, SR, SSR, UR, LR (RatingType del client) */
  readonly rarity: Readonly<Record<string, string>>;
  /** gli strati che ci sono: `sfondo_6`, `cornice_6`, `lettera_6`, `stelle_5`, `piu_5`, `esagono`, `set_1`, `marchio_costume`... */
  readonly layers: readonly string[];
}

export interface GearIndex {
  readonly rules: {
    /** 5: ogni risveglio del pezzo si fa a +5, e i miglioramenti in tutto sono 30 */
    readonly upgradesPerAwakening: number;
    readonly awakenings: number;
    /** 0,1: gli effetti bonus arrivano dal server in decimi di punto */
    readonly optionStep: number;
    /** le rarita' che si ottengono, C-SSR: UR e' un SSR inciso */
    readonly obtainableRatings: readonly number[];
  };
  readonly sets: readonly GearSet[];
  readonly parts: readonly GearPart[];
  /** parte -> rarita' (1-6) -> valori */
  readonly values: Readonly<Record<string, Readonly<Record<string, GearValue>>>>;
  readonly options: readonly GearOption[];
  readonly icons: ItemIconLayers;
  /** `<set>_<parte>` che hanno l'immagine del pezzo */
  readonly pieceImages: readonly string[];
  /** le parti che hanno l'immagine dello slot vuoto */
  readonly slotImages: readonly number[];
}

/* ------------------------------------------------------------------ costumi -- */

export type CostumeKind = "body" | "weapon" | "head";

export interface Costume {
  readonly kind: CostumeKind;
  /** la rarita' dell'oggetto, 3-7 (R-LR): da qui parte il potenziamento */
  readonly rarity: number;
  /** 26 costumi non hanno nome nel client (chiave -1): forse non ancora usciti */
  readonly name?: HeroLabel;
  readonly description?: HeroLabel;
  /** le percentuali, in punti: fisse, non crescono col potenziamento */
  readonly percents: Readonly<Record<string, number>>;
  /** il set di costumi (DB_set_costume), che non da' statistiche */
  readonly set?: number;
  /** condiviso fra le versioni del personaggio */
  readonly shared?: true;
  /** false: il client non ha l'immagine (63 costumi) */
  readonly icon: boolean;
}

/** I costumi registrati di un eroe: quanti posti, tutti i suoi costumi, i cinque di partenza. */
export interface HeroCostumes {
  readonly slots: Readonly<Record<CostumeKind | "relic", number>>;
  readonly all: Readonly<Record<CostumeKind, readonly string[]>>;
  /** quelli delle statistiche massime (scheda_client.costumi_che_contano) */
  readonly start: Readonly<Record<CostumeKind, readonly string[]>>;
}

export interface CostumeIndex {
  /** la statistica piatta di ogni tipo: corpo Difesa, arma Attacco, testa PS */
  readonly flatStat: Readonly<Record<CostumeKind, "atk" | "def" | "hp">>;
  /**
   * tipo -> rarita' (3-7) -> [valore al livello 0, aumento per livello, ultimo
   * livello] (DB_costume_stat). La scala continua da una rarita' all'altra fino a
   * UR livello 30; i costumi LR vanno da LR 0 a LR 30.
   */
  readonly scale: Readonly<Record<CostumeKind, Readonly<Record<string, readonly [number, number, number]>>>>;
  readonly sets: Readonly<Record<string, { readonly name: HeroLabel }>>;
  readonly costumes: Readonly<Record<string, Costume>>;
  readonly heroes: Readonly<Record<string, HeroCostumes>>;
}
