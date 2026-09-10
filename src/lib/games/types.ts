/**
 * Contratto dei moduli di gioco.
 *
 * Questo file e' il confine dell'architettura. Il Core (account, profili, badge,
 * community, pagamenti) non importa NULLA da un modulo di gioco specifico: parla
 * solo con questa interfaccia. Aggiungere un gioco deve significare aggiungere
 * un modulo, non modificare il Core.
 *
 * Il contratto e' pensato per reggere due paradigmi molto diversi:
 *
 *   deterministico  il modulo fornisce solo `computeDamage`, il risolutore di
 *                   rotazioni condiviso fa il resto (Genshin, ZZZ, WuWa, HSR)
 *   stocastico      il modulo fornisce il proprio `simulateOnce`, perche' il
 *                   danno dipende da pescate casuali (Grand Cross)
 *
 * In entrambi i casi il risultato che esce e' lo stesso tipo. E' questo che
 * evita che il gioco piu' anomalo deformi l'architettura di tutti gli altri.
 */

import type {
  CombatParadigm,
  DamageFn,
  ResolvedActor,
  SimulateOnce,
  StatDefinition,
  Target,
} from "@/lib/engine";

/** Descrittore di una versione di dataset caricata dal modulo. */
export interface DatasetInfo {
  /** patch di gioco, es. "6.2" */
  patch: string;
  /** data di rilascio della patch */
  releasedAt: string;
  /** hash del contenuto: identifica il dataset in modo univoco */
  checksum: string;
}

/** Voce minima di un personaggio, quanto basta al Core per liste e ricerca. */
export interface CharacterSummary {
  id: string;
  name: string;
  rarity: number;
  /** elemento, attributo o fazione: etichetta primaria mostrata in UI */
  affinity: string;
  /** ruolo dichiarato: "dps", "support", "healer", ... */
  role: string;
  iconKey: string;
}

/**
 * Voce del roster completo, quello che si sfoglia.
 *
 * Distinta da CharacterSummary di proposito. Quella descrive le unita' che il
 * motore sa simulare: poche, con moltiplicatori calibrati a mano. Questa e'
 * l'elenco integrale come appare nel gioco - centinaia di voci - e serve a
 * cercare, filtrare e riconoscere, non a calcolare. Tenerle separate evita che
 * il roster debba aspettare la calibrazione per esistere, e che il simulatore
 * si ritrovi in lista unita' di cui non sa niente.
 */
export interface HeroEntry {
  /** identificatore nel gioco; e' anche il nome del file immagine */
  id: string;
  /** personaggio di base: piu' voci lo condividono ("Meliodas" ne ha 14) */
  group: string;
  name: string;
  /** epiteto della versione, fra parentesi quadre nel gioco */
  epithet: string;
  /** rarita' attuale */
  rarity: string;
  /** rarita' con cui esce dal gacha: dice quanto costa ottenerlo */
  obtainedAs: string;
  /** attributo o elemento; corrisponde a un HeroAffinity.id */
  affinity: string;
}

/** Attributo di un eroe, col colore con cui il gioco lo identifica. */
export interface HeroAffinity {
  id: string;
  label: string;
  color: string;
  /** secondo colore, per i rari attributi doppi */
  colorAlt?: string;
}

/**
 * Roster sfogliabile di un gioco.
 *
 * Le sfaccettature sono dichiarate invece che dedotte dalle voci: l'ordine
 * ("LR prima di UR") e i colori non si ricavano contando, e un filtro che
 * cambia ordine quando cambia il dataset e' un filtro che confonde.
 */
export interface HeroRoster {
  /** elenco completo, gia' nell'ordine di presentazione */
  readonly heroes: readonly HeroEntry[];
  /** rarita' esistenti, dalla piu' alta */
  readonly rarities: readonly string[];
  /** rarita' di uscita dal gacha, dalla piu' alta */
  readonly obtainable: readonly string[];
  /** attributi esistenti, nell'ordine del gioco */
  readonly affinities: readonly HeroAffinity[];
}

/**
 * Una build utente, nella forma specifica del gioco.
 * Il Core la tratta come opaca e la salva in `Build.payload`.
 */
export interface GameBuildPayload {
  characterId: string;
  level: number;
  /** costellazione, eidolon, rank: la scala varia per gioco */
  rank: number;
  [key: string]: unknown;
}

export interface GameModule<TBuild extends GameBuildPayload = GameBuildPayload> {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly publisher: string;
  readonly paradigm: CombatParadigm;

  /** unita' di misura del tempo, per le etichette in UI */
  readonly timeUnit: "seconds" | "turns";

  readonly dataset: DatasetInfo;

  /** statistiche esistenti in questo gioco, con i loro default */
  readonly statModel: readonly StatDefinition[];

  /** bersagli preconfigurati (nemici comuni, manichino da test) */
  readonly targets: readonly Target[];

  readonly characters: readonly CharacterSummary[];

  /**
   * Roster completo, se il modulo ce l'ha.
   *
   * Opzionale perche' dipende da quanto e' accessibile il gioco: per Grand
   * Cross e' costato l'estrazione degli asset dal client. Un modulo senza
   * roster resta valido, semplicemente non ha la sezione Eroi.
   */
  readonly roster?: HeroRoster;

  /**
   * Converte una build salvata in un attore eseguibile dal motore.
   * Qui vivono artefatti, echi, coni luce, set bonus e passive: tutto cio' che
   * il motore non deve conoscere.
   */
  resolveActor(build: TBuild, slotId: string): ResolvedActor;

  /** Formula di danno del gioco. Usata dal risolutore condiviso. */
  readonly computeDamage: DamageFn;

  /**
   * Simulatore proprio. Presente SOLO nei moduli stocastici, che non possono
   * usare il risolutore di rotazioni deterministico.
   */
  readonly simulateOnce?: SimulateOnce;

  /** iterazioni Monte Carlo di default; ignorato dai moduli deterministici */
  readonly defaultIterations?: number;
}

export function isStochastic(gameModule: GameModule): boolean {
  return gameModule.paradigm === "stochastic";
}
