/**
 * Registro dei moduli di gioco.
 *
 * Unico punto in cui il Core conosce l'elenco dei giochi. Aggiungerne uno = una
 * riga qui piu' la sua cartella. Nessun'altra parte dell'applicazione importa
 * direttamente un modulo specifico.
 */

import { createTimelineSimulator, runSimulation, seedFromString } from "@/lib/engine";
import type { SimulationInput, SimulationResult } from "@/lib/engine";
import { grandCrossModule } from "./grand-cross";
import type { GameModule } from "./types";

const MODULES: readonly GameModule[] = [grandCrossModule];

const BY_SLUG = new Map<string, GameModule>(MODULES.map((module) => [module.slug, module]));

export function listGameModules(): readonly GameModule[] {
  return MODULES;
}

export function getGameModule(slug: string): GameModule | undefined {
  return BY_SLUG.get(slug);
}

export function requireGameModule(slug: string): GameModule {
  const module = BY_SLUG.get(slug);
  if (module === undefined) {
    throw new Error(`Nessun modulo di gioco registrato per lo slug "${slug}"`);
  }
  return module;
}

export interface SimulateOptions {
  iterations?: number;
  seed?: number;
}

/**
 * Esegue una simulazione scegliendo il simulatore giusto per il paradigma.
 *
 * I moduli deterministici non forniscono `simulateOnce` e ricevono il risolutore
 * di rotazioni condiviso; quelli stocastici usano il proprio. Il chiamante non
 * deve sapere quale dei due sta usando: il risultato ha lo stesso tipo.
 *
 * Il seed di default deriva dal contenuto (modulo + rotazione + checksum del
 * dataset), quindi lo stesso link produce sempre gli stessi numeri anche senza
 * averlo salvato.
 */
export function simulate(
  module: GameModule,
  input: SimulationInput,
  options: SimulateOptions = {},
): SimulationResult {
  const simulator = module.simulateOnce ?? createTimelineSimulator(module.computeDamage);

  return runSimulation(simulator, input, {
    paradigm: module.paradigm,
    iterations: options.iterations ?? module.defaultIterations,
    seed:
      options.seed ??
      seedFromString(`${module.id}:${input.rotation.id}:${module.dataset.checksum}`),
  });
}
