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
export const ITERATIONS = 1500;
export const SEED = 20260909;
const MAX_TURNS = 20;

export function resolveCharacter(
  gameModule: GameModule,
  characterId: string,
  slot = "slot1",
): ResolvedActor | null {
  try {
    return gameModule.resolveActor(
      { characterId, level: REFERENCE_LEVEL, rank: 0 },
      slot,
    );
  } catch {
    return null;
  }
}

export function findCharacter(
  gameModule: GameModule,
  characterId: string,
): CharacterSummary | undefined {
  return gameModule.characters.find((character) => character.id === characterId);
}

export function defaultTarget(gameModule: GameModule, targetId?: string): Target | undefined {
  if (targetId) {
    const wanted = gameModule.targets.find((target) => target.id === targetId);
    if (wanted) return wanted;
  }
  return gameModule.targets[0];
}

/** Simula una squadra. Restituisce null se manca qualcosa per calcolare. */
export interface SimulateOverrides {
  /** per rieseguire esattamente un calcolo pubblicato da qualcun altro */
  seed?: number;
  iterations?: number;
}

export function simulateTeam(
  gameModule: GameModule,
  characterIds: readonly string[],
  targetId?: string,
  overrides: SimulateOverrides = {},
): SimulationResult | null {
  const target = defaultTarget(gameModule, targetId);
  if (target === undefined || characterIds.length === 0) return null;

  const actors: ResolvedActor[] = [];
  characterIds.forEach((id, index) => {
    const actor = resolveCharacter(gameModule, id, `slot${index + 1}`);
    if (actor) actors.push(actor);
  });

  if (actors.length === 0) return null;

  return simulate(
    gameModule,
    {
      gameId: gameModule.id,
      datasetPatch: gameModule.dataset.patch,
      actors,
      rotation: { id: `team-${characterIds.join("-")}`, name: "Confronto", steps: [], repeat: MAX_TURNS },
      target,
    },
    {
      iterations: overrides.iterations ?? ITERATIONS,
      seed: overrides.seed ?? SEED,
    },
  );
}

export function simulateSolo(
  gameModule: GameModule,
  characterId: string,
  targetId?: string,
): SimulationResult | null {
  return simulateTeam(gameModule, [characterId], targetId);
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
export function rankCharacters(gameModule: GameModule, targetId?: string): RankedCharacter[] {
  const ranked: RankedCharacter[] = [];

  for (const character of gameModule.characters) {
    const result = simulateSolo(gameModule, character.id, targetId);
    if (result) ranked.push({ character, result });
  }

  return ranked.sort((a, b) => b.result.damage.median - a.result.damage.median);
}
