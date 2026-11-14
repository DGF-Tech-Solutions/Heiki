/**
 * Il contratto del simulatore delle statistiche al primo turno (simulation.ts).
 *
 * Il simulatore rifa', passo per passo, come il client del gioco calcola le 12
 * statistiche di ogni eroe in campo al primo turno di battaglia
 * (UnitBase.RefreshStatus, le passive, i buff dati prima del primo turno). E' la
 * traduzione di simula.py della pipeline (_7dsgc/simulazione_11-11/simulatore),
 * provata su una battaglia vera: i numeri devono restare quelli di Python, e lo
 * controlla src/lib/games/__tests__/simulation.test.ts sui casi scritti da
 * parita_sito.py.
 *
 * I dati (simulation.generated.ts) sono il pacchetto di script/simulazione_dati.py:
 * righe delle tabelle del gioco con i nomi di colonna del client (le regole le
 * nominano: {"col": "list_array_kind_target"}) e le regole di regole_parole.json
 * con le chiavi del loro schema (SCHEMA.md della pipeline: "presa", "condizioni",
 * "effetti"...). Si lasciano com'erano apposta: tradurle vorrebbe dire tenere
 * due nomi per ogni nodo, e il motore le legge come le legge Python.
 */

/** StatusData.TYPE del client: l'ordine conta (gli array statici di UnitBase). */
export const SIM_STATS = [
  "ATK",
  "FIXED_ATK_PER",
  "DEF",
  "FIXED_DEF_PER",
  "CRIT_PER",
  "CRIT_ATK_PER",
  "CRIT_RES_PER",
  "CRIT_DEF_PER",
  "MAX_HP",
  "HP_RECOVERY_PER",
  "HP_REGEN_PER",
  "HP_STEAL_PER",
] as const;
export type SimStat = (typeof SIM_STATS)[number];

/** «scontro finale» del sito = destroy, «bestia» = nest. */
export type SimContent = "pve" | "pvp" | "destroy" | "nest";

/**
 * Da quale parte dell'eroe viene la passiva: l'Unica (exclusive_passive_id_*),
 * una riga nascosta (list_array_*_exclusive_passive_id), il Comandamento, la
 * Grazia, l'Unita', la Reliquia; "cap" e' il tetto del 20% (passo 8b). Per una
 * voce che viene da un buff e' l'origine della passiva che ha dato il buff.
 */
export type SimOrigin = "unique" | "hidden" | "commandment" | "grace" | "unity" | "relic" | "cap";

export interface SimHeroInput {
  readonly id: string;
  /** in panchina (le sue passive global_ally valgono per il campo) */
  readonly bench?: boolean;
  /** la forma LR: la skin con rating 7 (se l'eroe non ce l'ha, simulate lancia un errore, come Python) */
  readonly lr?: boolean;
  /** rango della Mossa finale, 1 se manca */
  readonly ultimate?: number;
  /** livello dell'Unica (1-3; 0 = nessuna Unica), 1 se manca */
  readonly unique?: number;
  /** la Reliquia sacra: true = la prima dell'eroe; un numero = quella con quell'id */
  readonly relic?: boolean | number;
  /** le statistiche d'inizio battaglia (la schermata della squadra); le percentuali sono frazioni */
  readonly stats: Partial<Record<SimStat, number>>;
}

export interface SimInput {
  readonly content: SimContent;
  /** i posti in ordine (null = posto vuoto: il posto degli altri non cambia) */
  readonly heroes: readonly (SimHeroInput | null)[];
  /** quanti nemici (senza passive, razza, attributo e statistiche: 0); nessuno se manca */
  readonly enemies?: { readonly count: number };
  /** se ProcessTurnStartEffect gira prima del primo turno (non letto nel client); vero se manca */
  readonly turnStart?: boolean;
  /**
   * con gli effetti a tempo, i buff che durano un numero di turni (buff_turn > 0); vero se
   * manca. Falso: solo quello che resta quando scadono, il secondo numero del sito (14/11)
   */
  readonly timed?: boolean;
}

export interface SimTraceEntry {
  /** il passo di RefreshStatus: 2, 3, 4, 5 (buff), 6, 7, 8 */
  readonly step: number;
  /** la parola chiave della passiva o del buff; "tetto 20%" per il tetto */
  readonly keyword: string;
  /** la passiva (per un buff: quella che l'ha dato); null se non si sa */
  readonly passive: number | null;
  /** l'id del buff, null per le passive */
  readonly buff: number | null;
  /** l'eroe che ha dato la passiva o il buff (anche se in panchina); null per il tetto */
  readonly from: string | null;
  readonly origin: SimOrigin | null;
  readonly stat: SimStat;
  /** il modo dell'effetto come in regole_parole.json ("per", "piu", "gruppo_per"...), "cap" per il tetto */
  readonly mode: string;
  /** il valore applicato: 0.12 per x1,12; per "piu" il numero sommato; 0.2 per il tetto */
  readonly value: number;
  readonly before: number;
  readonly after: number;
}

export interface SimHeroResult {
  readonly id: string;
  /** il posto nell'ingresso */
  readonly slot: number;
  readonly start: Record<SimStat, number>;
  readonly firstTurn: Record<SimStat, number>;
  readonly trace: readonly SimTraceEntry[];
}

/** Gli eroi in campo, nell'ordine dei posti (la panchina non ha un risultato: non si ricalcola). */
export interface SimResult {
  readonly heroes: readonly SimHeroResult[];
}

/* ----------------------------------------------------- i dati del pacchetto -- */

/** Un valore JSON: le righe e le regole sono dati, il motore li legge come Python. */
export type SimJson = number | string | boolean | null | readonly SimJson[] | { readonly [key: string]: SimJson };
/** Un nodo delle regole (SCHEMA.md) o una riga di una tabella del gioco. */
export type SimNode = { readonly [key: string]: SimJson };

/** Le voci di una parola chiave, nell'ordine di regole_parole.json (conta per i pari indirizzo). */
export type SimWord = readonly [keyword: string, voci: readonly SimNode[]];

export interface SimData {
  readonly meta: SimNode;
  /** DB_hero_base, solo gli eroi del roster e le colonne lette */
  readonly heroes: readonly SimNode[];
  /** DB_skin_exclusive_passive */
  readonly exclusives: readonly SimNode[];
  /** DB_skin_base: la skin di base e la prima legend di ogni eroe, nell'ordine della tabella */
  readonly skins: readonly SimNode[];
  /** DB_costume_base: le Reliquie (craft_costume_check 1), nell'ordine della tabella */
  readonly relics: readonly SimNode[];
  /** DB_skill_passive: le passive che gli eroi possono avere */
  readonly passives: readonly SimNode[];
  /** DB_skill_card_buff: i buff che le regole possono dare */
  readonly buffs: readonly SimNode[];
  readonly rules: {
    /** regole_parole.json parole (solo le eseguibili) */
    readonly words: readonly SimWord[];
    /** regole_parole.json buff */
    readonly buffWords: readonly SimWord[];
    readonly giveBuff: readonly SimNode[];
    readonly charges: readonly SimNode[];
    readonly removeBuff: readonly SimNode[];
  };
}
