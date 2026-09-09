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

export function isStochastic(module: GameModule): boolean {
  return module.paradigm === "stochastic";
}
