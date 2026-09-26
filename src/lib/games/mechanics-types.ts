/**
 * Il contratto delle meccaniche di combattimento: come il gioco calcola il danno,
 * chi batte chi fra gli attributi, come si pescano le carte, come si cumulano i buff.
 *
 * Le REGOLE le ha lette la pipeline nel codice del client (lo studio con le prove e'
 * MECCANICHE_COMBATTIMENTO.md, nella radice di _7dsgc); qui arrivano i NUMERI di
 * quelle regole, presi dove stanno: la configurazione del gioco (DB_config_game), le
 * costanti del codice, e per eroe e per concetto le tabelle. Li scrive
 * script/meccaniche.py (eroi/meccaniche.json), li porta qui
 * scripts/import-mechanics.mts. Sta in un file suo come artefatti e buff
 * dell'account: types.ts ne importa solo l'indice, per il campo del modulo.
 *
 * Le percentuali della configurazione sono frazioni (0,3 = 30%), come le usa il
 * gioco; quelle degli effetti Luce e Oscurita' sono punti (10 = 10%), come le
 * scrivono le tabelle.
 */

/**
 * Come si cumula lo stesso buff dato due volte (BuffManager.BuffOverlapType):
 * - "piu_forte" (NonOverlap_upper): ne resta uno, il piu' forte; a parita' si rinnova la durata
 * - "piu_basso" (NonOverlap_lower): ne resta uno, quello col valore piu' basso
 * - "accumula" (Overlap): ogni applicazione conta a parte, fino a `limit` volte (0 = senza tetto)
 * - "cariche" (Stack): le cariche si sommano fino a `limit`, la durata non si rinnova
 */
export type StackingRule = "piu_forte" | "piu_basso" | "accumula" | "cariche";

/** Una regola di cumulo dei buff che portano il nome di un concetto, con quante carte la usano. */
export interface MechanicsStacking {
  readonly rule: StackingRule;
  /** tetto di «accumula» e «cariche»; 0 = senza tetto, e per le altre regole */
  readonly limit: number;
  /** i ranghi di carta che usano un buff con questa regola */
  readonly cards: number;
}

/** L'effetto di squadra di un eroe Luce o Oscurita': una passiva nascosta del client. */
export interface MechanicsTeamEffect {
  readonly passive: number;
  /** punti: il 10% per gli alleati dello stesso attributo */
  readonly sameAttribute: number;
  /** punti: il 10% per gli altri alleati, a seconda del vantaggio d'attributo */
  readonly otherAllies: number;
}

export interface MechanicsHand {
  /** MAX_CARD_COUNT: la mano con tutti gli eroi */
  readonly max: number;
  /** SUBTRACTION_MAX_CARD_COUNT: da quanti eroi in giu' la mano si accorcia */
  readonly sub: number;
}

export interface MechanicsIndex {
  /** dalla configurazione del gioco (DB_config_game), rilette a ogni giro */
  readonly config: {
    /** balance_factor, secondo valore: il peso della Difesa al denominatore */
    readonly balanceA: number;
    /** balance_factor, primo valore: il peso della Difesa al numeratore */
    readonly balanceB: number;
    /** i fattori della varianza del danno, come li tira il gioco (1,00 ... 1,09) */
    readonly variance: readonly number[];
    /** crit_atk_add_per x number_to_per: la base del moltiplicatore del critico */
    readonly critBase: number;
    /** attribute_advantage_per: si somma agli aumenti del danno */
    readonly advantage: number;
    /** attribute_disadvantage_per: si somma alle riduzioni del danno */
    readonly disadvantage: number;
    /** pvp_smash_card_draw_per_dec: il peso di una carta pescata nel PvP Smash */
    readonly smashDraw: number;
  };
  /** letto nel codice del client: nessuna tabella lo dice */
  readonly code: {
    /** attributo -> l'attributo che batte (codici di TeamUnitData.Attribute) */
    readonly beats: Readonly<Record<string, number>>;
    /** gli attributi fuori dal triangolo: Luce, Oscurita', Luce/Oscurita' */
    readonly outsideTriangle: readonly number[];
    /** aumenti - riduzioni non scende sotto questo valore */
    readonly minDifference: number;
    /** sotto questo danno, dopo Perforazione e Resistenza, il colpo fa 0 */
    readonly minDamage: number;
    /** Attacco, Difesa e PS non scendono sotto questa frazione di quelli d'inizio battaglia */
    readonly minStats: number;
    readonly hand: {
      /** squadra con un eroe in panchina (storia, PvP normale) */
      readonly bench: MechanicsHand;
      /** tutti gli eroi in campo (boss, eventi, PvP «tutti gli eroi») */
      readonly allIn: MechanicsHand;
    };
  };
  /** heroId -> [peso della carta A, peso della carta B] di Rango 1 */
  readonly draw: Readonly<Record<string, readonly [number, number]>>;
  /** heroId -> l'effetto di squadra Luce e/o Oscurita' (solo gli eroi che ce l'hanno) */
  readonly teamEffects: Readonly<Record<string, { readonly light?: MechanicsTeamEffect; readonly dark?: MechanicsTeamEffect }>>;
  /**
   * concetto delle parole blu -> come si cumulano i buff col suo nome, la regola piu'
   * usata per prima. Il legame buff -> concetto e' per nome, quindi dedotto.
   */
  readonly stacking: Readonly<Record<string, readonly MechanicsStacking[]>>;
}
