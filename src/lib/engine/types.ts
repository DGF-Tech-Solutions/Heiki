/**
 * Tipi del motore di calcolo.
 *
 * Il motore e' AGNOSTICO rispetto al gioco: non sa cosa sia un elemento, una
 * reazione o una carta. Sa solo che esistono attori con statistiche, azioni che
 * producono colpi, buff con una durata e un bersaglio da abbattere.
 * Le regole specifiche arrivano dal modulo di gioco (src/lib/games).
 *
 * Tutto qui e' serializzabile in JSON: le rotazioni vengono salvate nel DB e i
 * risultati devono essere riproducibili a distanza di mesi.
 */

import type { Rng } from "./rng";

export type StatKey = string;

/** Mappa stat -> valore. Le chiavi sono definite dal modulo di gioco. */
export type StatBlock = Readonly<Record<StatKey, number>>;

/**
 * TIMELINE   real-time, tempo continuo in secondi (Genshin, ZZZ, WuWa)
 * TURN       a turni deterministico, tempo in turni (HSR)
 * STOCHASTIC a turni con pescata casuale -> Monte Carlo (Grand Cross)
 */
export type CombatParadigm = "timeline" | "turn" | "stochastic";

export interface StatDefinition {
  key: StatKey;
  label: string;
  kind: "flat" | "percent";
  defaultValue: number;
}

export interface Target {
  id: string;
  name: string;
  level: number;
  maxHp: number;
  defense: number;
  /** resistenza per tag di danno: 0.1 = 10% */
  resistances: Readonly<Record<string, number>>;
  /** attributi liberi usati dai moduli (es. l'attributo del triangolo in Grand Cross) */
  tags: readonly string[];
}

export type ModifierMode = "flat" | "percent";

export interface StatModifier {
  stat: StatKey;
  mode: ModifierMode;
  value: number;
}

export interface BuffDefinition {
  id: string;
  name: string;
  /** durata nell'unita' di tempo del paradigma: secondi o turni */
  duration: number;
  maxStacks: number;
  /**
   * self   solo l'attore che lo genera
   * party  tutti gli attori
   * target debuff sul nemico. Per convenzione contribuisce comunque allo
   *        StatBlock di chi attacca, sotto chiavi dedicate
   *        (def_reduction, def_ignore, res_reduction_<tag>): tenere tutto in un
   *        solo blocco evita di duplicare la logica di stacking sul bersaglio.
   */
  appliesTo: "self" | "party" | "target";
  modifiers: readonly StatModifier[];
}

export interface HitDefinition {
  id: string;
  /** offset dall'inizio dell'azione, nell'unita' di tempo del paradigma */
  offset: number;
  /** moltiplicatore percentuale sulla stat di scaling: 120 = 120% */
  motionValue: number;
  scalingStat: StatKey;
  /** elemento o attributo: seleziona la resistenza del bersaglio */
  damageTag: string;
  /** categoria per i bonus condizionali: "basic" | "skill" | "ultimate" ... */
  category: string;
  canCrit: boolean;
  flatBonus?: number;
}

export interface ActionDefinition {
  id: string;
  name: string;
  /** quanto avanza la timeline dopo l'esecuzione */
  duration: number;
  cooldown: number;
  hits: readonly HitDefinition[];
  /** id dei buff applicati all'inizio dell'azione */
  grantsBuffs: readonly string[];
  /** campo libero per dati specifici del gioco (costo energia, gauge, ...) */
  meta?: Readonly<Record<string, unknown>>;
}

/**
 * Una build utente gia' risolta in qualcosa che il motore sa eseguire.
 * La conversione build -> ResolvedActor e' responsabilita' del modulo di gioco:
 * e' li' che vivono artefatti, echi, coni luce e triangoli di attributi.
 */
export interface ResolvedActor {
  /** slot nel team, univoco nella simulazione */
  id: string;
  characterId: string;
  name: string;
  level: number;
  stats: StatBlock;
  actions: Readonly<Record<string, ActionDefinition>>;
  buffs: Readonly<Record<string, BuffDefinition>>;
  meta?: Readonly<Record<string, unknown>>;
}

export interface RotationStep {
  actorId: string;
  actionId: string;
  /** tempo assoluto esplicito; se assente lo step segue il precedente */
  at?: number;
  note?: string;
}

export interface Rotation {
  id: string;
  name: string;
  steps: readonly RotationStep[];
  /** quante volte ripetere la sequenza; >= 1 */
  repeat: number;
}

export interface SimulationInput {
  gameId: string;
  /** patch del dataset: congelata insieme al risultato per riproducibilita' */
  datasetPatch: string;
  actors: readonly ResolvedActor[];
  rotation: Rotation;
  target: Target;
}

/** Contesto passato alla formula di danno del modulo di gioco. */
export interface DamageContext {
  hit: HitDefinition;
  actor: ResolvedActor;
  /** stat effettive dell'attore con i buff attivi in questo istante */
  stats: StatBlock;
  target: Target;
  time: number;
  rng: Rng;
}

export type DamageFn = (ctx: DamageContext) => number;

export interface HitResult {
  time: number;
  actorId: string;
  actionId: string;
  hitId: string;
  damageTag: string;
  category: string;
  damage: number;
  /** buff attivi allo snapshot: serve al breakdown in UI */
  activeBuffs: readonly string[];
}

export interface SimulationOutcome {
  totalDamage: number;
  /** secondi o turni, secondo il paradigma */
  duration: number;
  /** danno per unita' di tempo */
  dps: number;
  /** null se il bersaglio sopravvive alla rotazione */
  timeToKill: number | null;
  hits: readonly HitResult[];
}

export interface DistributionStats {
  mean: number;
  median: number;
  p10: number;
  p90: number;
  min: number;
  max: number;
  stdDev: number;
}

/**
 * Forma della distribuzione, gia' aggregata in bin.
 *
 * Si restituiscono i bin e non i campioni grezzi perche' una simulazione Monte
 * Carlo ne produce migliaia: la forma e' l'informazione utile, i singoli valori
 * sono peso morto da serializzare.
 */
export interface Histogram {
  /** conteggio dei campioni per intervallo, dal piu' basso al piu' alto */
  bins: readonly number[];
  min: number;
  max: number;
  binWidth: number;
}

/**
 * Risultato uniforme per tutti i paradigmi.
 *
 * Questa e' la decisione che tiene insieme giochi deterministici e stocastici:
 * il risultato e' SEMPRE una distribuzione. Per un gioco deterministico e' una
 * distribuzione degenere di un solo campione, quindi mean/median/p10/p90
 * coincidono. La UI e le query non devono sapere che paradigma stanno guardando.
 */
export interface SimulationResult {
  paradigm: CombatParadigm;
  deterministic: boolean;
  iterations: number;
  seed: number;
  datasetPatch: string;
  damage: DistributionStats;
  /** forma della distribuzione del danno, pronta da disegnare */
  damageHistogram: Histogram;
  /** null se il bersaglio non e' mai morto in nessuna iterazione */
  timeToKill: DistributionStats | null;
  /** frazione di iterazioni in cui il bersaglio muore: 0..1 */
  killRate: number;
  /** una traccia completa (l'iterazione mediana) per il dettaglio in UI */
  representative: SimulationOutcome;
}

/** Una singola iterazione. I moduli stocastici sostituiscono questa funzione. */
export type SimulateOnce = (input: SimulationInput, rng: Rng) => SimulationOutcome;
