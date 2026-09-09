/**
 * Simulazioni pronte per le pagine del sito.
 *
 * Le schede personaggio, la classifica e gli strumenti hanno bisogno degli
 * stessi identici calcoli. Farli qui, in un posto solo, evita che tre pagine
 * mostrino tre numeri diversi per la stessa cosa - che e' il modo piu' rapido
 * per perdere la fiducia di chi legge.
 *
 * Tutto passa dal contratto GameModule: nessuna pagina conosce i dettagli di un
 * gioco specifico, quindi queste funzioni continueranno a valere quando i
 * moduli saranno cinque.
 */

import type { ResolvedActor, SimulationResult, Target } from "@/lib/engine";
import { simulate } from "./registry";
import type { CharacterSummary, GameModule } from "./types";

/** Livello di riferimento per i confronti. Uguale per tutti, altrimenti la
 *  classifica misurerebbe gli investimenti e non i personaggi. */
export const REFERENCE_LEVEL = 80;
const ITERATIONS = 1500;
const SEED = 20260909;
const MAX_TURNS = 20;

export function resolveCharacter(
  module: GameModule,
  characterId: string,
  slot = "slot1",
): ResolvedActor | null {
  try {
    return module.resolveActor(
      { characterId, level: REFERENCE_LEVEL, rank: 0 },
      slot,
    );
  } catch {
    return null;
  }
}

export function findCharacter(
  module: GameModule,
  characterId: string,
): CharacterSummary | undefined {
  return module.characters.find((character) => character.id === characterId);
}

export function defaultTarget(module: GameModule, targetId?: string): Target | undefined {
  if (targetId) {
    const wanted = module.targets.find((target) => target.id === targetId);
    if (wanted) return wanted;
  }
  return module.targets[0];
}

/** Simula una squadra. Restituisce null se manca qualcosa per calcolare. */
export function simulateTeam(
  module: GameModule,
  characterIds: readonly string[],
  targetId?: string,
): SimulationResult | null {
  const target = defaultTarget(module, targetId);
  if (target === undefined || characterIds.length === 0) return null;

  const actors: ResolvedActor[] = [];
  characterIds.forEach((id, index) => {
    const actor = resolveCharacter(module, id, `slot${index + 1}`);
    if (actor) actors.push(actor);
  });

  if (actors.length === 0) return null;

  return simulate(
    module,
    {
      gameId: module.id,
      datasetPatch: module.dataset.patch,
      actors,
      rotation: { id: `team-${characterIds.join("-")}`, name: "Confronto", steps: [], repeat: MAX_TURNS },
      target,
    },
    { iterations: ITERATIONS, seed: SEED },
  );
}

export function simulateSolo(
  module: GameModule,
  characterId: string,
  targetId?: string,
): SimulationResult | null {
  return simulateTeam(module, [characterId], targetId);
}

export interface RankedCharacter {
  character: CharacterSummary;
  result: SimulationResult;
}

/**
 * Classifica per danno mediano simulato.
 *
 * Non e' una tier list di opinioni: e' l'output del motore, con lo stesso
 * livello, lo stesso bersaglio e lo stesso seed per tutti. Discutibile nei
 * presupposti - che sono dichiarati - ma non nell'aritmetica.
 */
export function rankCharacters(module: GameModule, targetId?: string): RankedCharacter[] {
  const ranked: RankedCharacter[] = [];

  for (const character of module.characters) {
    const result = simulateSolo(module, character.id, targetId);
    if (result) ranked.push({ character, result });
  }

  return ranked.sort((a, b) => b.result.damage.median - a.result.damage.median);
}
