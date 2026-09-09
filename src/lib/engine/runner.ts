/**
 * Esecutore delle simulazioni.
 *
 * Unifica paradigmi deterministici e stocastici: un gioco deterministico gira
 * una sola iterazione e produce una distribuzione degenere, un gioco stocastico
 * gira N iterazioni Monte Carlo. In entrambi i casi il tipo di ritorno e' lo
 * stesso, quindi la UI non deve sapere quale dei due sta mostrando.
 *
 * Gira lato client: nessuna chiamata di rete, nessuno stato condiviso. Anche con
 * molti utenti che simulano in parallelo il costo server resta zero.
 */

import { createRng } from "./rng";
import type {
  CombatParadigm,
  DistributionStats,
  Histogram,
  SimulateOnce,
  SimulationInput,
  SimulationOutcome,
  SimulationResult,
} from "./types";

export interface RunOptions {
  paradigm: CombatParadigm;
  /** ignorato per i paradigmi deterministici, che girano sempre una volta sola */
  iterations?: number;
  seed?: number;
}

export const DEFAULT_STOCHASTIC_ITERATIONS = 2000;

export function runSimulation(
  simulate: SimulateOnce,
  input: SimulationInput,
  options: RunOptions,
): SimulationResult {
  const deterministic = options.paradigm !== "stochastic";
  const seed = options.seed ?? 1;
  const iterations = deterministic
    ? 1
    : Math.max(1, Math.floor(options.iterations ?? DEFAULT_STOCHASTIC_ITERATIONS));

  const outcomes: SimulationOutcome[] = [];
  for (let i = 0; i < iterations; i++) {
    // Un seed distinto per iterazione, derivato da quello di partenza: la serie
    // resta riproducibile e le iterazioni non sono correlate.
    outcomes.push(simulate(input, createRng(seed + i * 0x9e3779b1)));
  }

  const damages = outcomes.map((outcome) => outcome.totalDamage);
  const kills = outcomes
    .map((outcome) => outcome.timeToKill)
    .filter((value): value is number => value !== null);

  return {
    paradigm: options.paradigm,
    deterministic,
    iterations,
    seed,
    datasetPatch: input.datasetPatch,
    damage: distributionStats(damages),
    damageHistogram: buildHistogram(damages),
    timeToKill: kills.length > 0 ? distributionStats(kills) : null,
    killRate: outcomes.length > 0 ? kills.length / outcomes.length : 0,
    representative: pickRepresentative(outcomes, damages),
  };
}

/**
 * L'iterazione mediana per danno totale.
 *
 * Mostrare la traccia mediana e non la prima evita di far vedere all'utente un
 * caso fortunato o sfortunato come se fosse il comportamento tipico.
 */
function pickRepresentative(
  outcomes: readonly SimulationOutcome[],
  damages: readonly number[],
): SimulationOutcome {
  const first = outcomes[0];
  if (first === undefined) {
    return { totalDamage: 0, duration: 0, dps: 0, timeToKill: null, hits: [] };
  }
  if (outcomes.length === 1) return first;

  const indices = damages.map((_, index) => index);
  indices.sort((a, b) => (damages[a] ?? 0) - (damages[b] ?? 0));
  const medianIndex = indices[Math.floor(indices.length / 2)];
  if (medianIndex === undefined) return first;

  return outcomes[medianIndex] ?? first;
}

export function distributionStats(values: readonly number[]): DistributionStats {
  if (values.length === 0) {
    return { mean: 0, median: 0, p10: 0, p90: 0, min: 0, max: 0, stdDev: 0 };
  }

  const sorted = values.slice().sort((a, b) => a - b);
  const sum = sorted.reduce((acc, value) => acc + value, 0);
  const mean = sum / sorted.length;
  const variance =
    sorted.reduce((acc, value) => acc + (value - mean) * (value - mean), 0) / sorted.length;

  return {
    mean,
    median: percentile(sorted, 0.5),
    p10: percentile(sorted, 0.1),
    p90: percentile(sorted, 0.9),
    min: sorted[0] ?? 0,
    max: sorted[sorted.length - 1] ?? 0,
    stdDev: Math.sqrt(variance),
  };
}

export const DEFAULT_HISTOGRAM_BINS = 32;

/**
 * Aggrega i campioni in bin di uguale ampiezza.
 *
 * Con un solo campione - il caso deterministico - si ottiene un bin singolo:
 * la funzione non ha bisogno di sapere quale paradigma l'ha prodotta.
 */
export function buildHistogram(
  values: readonly number[],
  binCount = DEFAULT_HISTOGRAM_BINS,
): Histogram {
  const count = Math.max(1, Math.floor(binCount));

  if (values.length === 0) {
    return { bins: new Array<number>(count).fill(0), min: 0, max: 0, binWidth: 0 };
  }

  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }

  // Tutti i campioni uguali: un solo bin pieno, altrimenti binWidth sarebbe zero
  // e ogni valore finirebbe fuori scala.
  if (min === max) {
    const bins = new Array<number>(1).fill(values.length);
    return { bins, min, max, binWidth: 0 };
  }

  const binWidth = (max - min) / count;
  const bins = new Array<number>(count).fill(0);

  for (const value of values) {
    const index = Math.min(count - 1, Math.floor((value - min) / binWidth));
    bins[index] = (bins[index] ?? 0) + 1;
  }

  return { bins, min, max, binWidth };
}

/** Percentile su array gia' ordinato, per indice piu' vicino. */
function percentile(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.round(p * (sorted.length - 1));
  const clamped = Math.min(sorted.length - 1, Math.max(0, index));
  return sorted[clamped] ?? 0;
}
