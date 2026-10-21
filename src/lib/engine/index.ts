/**
 * Motore di calcolo Heiki.
 *
 * API pubblica: tutto cio' che un modulo di gioco o la UI possono importare.
 * Il motore e' fatto di funzioni pure - nessuno stato, nessun database, nessuna
 * chiamata di rete - quindi lo stesso codice gira nel browser durante l'editing
 * e sul server quando serve generare pagine indicizzabili o la card condivisibile.
 */

export { createRng, seedFromString } from "./rng";
export type { Rng } from "./rng";

export { getStat, applyModifiers, mergeStats, withDefaults } from "./stats";

export {
  defenseMultiplier,
  resistanceMultiplier,
  expectedCritMultiplier,
  rollCritMultiplier,
  damageBonus,
  standardDamage,
} from "./formula";
export type { StandardDamageOptions } from "./formula";

export { createTimelineSimulator, resolveTimeline } from "./timeline";

export {
  runSimulation,
  distributionStats,
  buildHistogram,
  DEFAULT_STOCHASTIC_ITERATIONS,
  DEFAULT_HISTOGRAM_BINS,
} from "./runner";
export type { RunOptions } from "./runner";

export type {
  ActionDefinition,
  BuffDefinition,
  CombatParadigm,
  DamageContext,
  DamageFn,
  DistributionStats,
  HitDefinition,
  HitResult,
  Histogram,
  ModifierMode,
  ResolvedActor,
  Rotation,
  RotationStep,
  SimulateOnce,
  SimulationInput,
  SimulationOutcome,
  SimulationResult,
  StatBlock,
  StatDefinition,
  StatKey,
  StatModifier,
  Target,
} from "./types";
