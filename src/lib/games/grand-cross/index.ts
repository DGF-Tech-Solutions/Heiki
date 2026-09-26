/**
 * Modulo Grand Cross (Netmarble) - paradigma STOCASTICO.
 *
 * E' il gioco piu' anomalo dei cinque previsti, ed e' esattamente per questo che
 * e' il primo modulo implementato: se il contratto GameModule regge lui, regge
 * anche Genshin, HSR, ZZZ e WuWa, che sono deterministici e piu' semplici.
 *
 * Il combattimento e' a carte pescate casualmente: non esiste "una rotazione" da
 * sommare, esiste una STRATEGIA su pescate aleatorie. Quindi non si puo' usare il
 * risolutore di rotazioni condiviso, e il modulo fornisce il proprio
 * `simulateOnce` che il runner ripete in Monte Carlo.
 *
 * Conseguenza sul contratto: `rotation.steps` qui NON e' una sequenza temporale,
 * e' una LISTA DI PRIORITA' - quali carte l'utente preferisce giocare quando le
 * pesca. `rotation.repeat`, se maggiore di 1, e' il tetto di turni.
 */

import {
  applyModifiers,
  standardDamage,
  type ActionDefinition,
  type BuffDefinition,
  type DamageContext,
  type HitDefinition,
  type HitResult,
  type ResolvedActor,
  type Rng,
  type SimulationInput,
  type SimulationOutcome,
  type StatModifier,
} from "@/lib/engine";
import type { GameBuildPayload, GameModule } from "../types";
import {
  ATTRIBUTE_ADVANTAGE,
  ATTRIBUTE_DISADVANTAGE,
  CHARACTERS,
  DATASET,
  DEFAULT_MAX_TURNS,
  DRAW_COUNT,
  GAUGE_PER_CARD,
  MAX_CARD_RANK,
  PLAYS_PER_TURN,
  RANK_MULTIPLIER,
  STAT_MODEL,
  TARGETS,
  ULTIMATE_GAUGE_COST,
  findUnit,
  type Attribute,
  type SkillData,
} from "./data";
import { HERO_ABILITIES } from "./hero-abilities.generated";
import { HERO_ASSETS } from "./hero-assets.generated";
import { HERO_CONTEXT } from "./hero-context.generated";
import { HERO_SPECIALS } from "./hero-specials.generated";
import { HERO_RELICS } from "./hero-relics.generated";
import { RELEASES } from "./releases.generated";
import { CREATURE_NEST } from "./creature-nest.generated";
import { DEATH_MATCH } from "./death-match.generated";
import { DEMON_KING } from "./demon-king.generated";
import { ENDGAME_HEROES } from "./endgame-heroes.generated";
import { SUPREME_DEITY } from "./supreme-deity.generated";
import { GAME_ICONS } from "./game-icons.generated";
import { HERO_STATS } from "./hero-stats.generated";
import { HERO_TEXTS } from "./hero-texts.generated";
import { ROSTER } from "./roster";

export interface GrandCrossBuild extends GameBuildPayload {
  characterId: string;
  level: number;
  /** grado di risveglio dell'unita' */
  rank: number;
  /** statistiche aggiunte dall'equipaggiamento */
  gear?: Readonly<Record<string, number>>;
}

/** Chi batte chi sul triangolo degli attributi. */
const BEATS: Readonly<Record<Attribute, Attribute>> = {
  strength: "dexterity",
  dexterity: "hp",
  hp: "strength",
};

interface Card {
  actorId: string;
  actionId: string;
  rank: number;
}

interface ActiveBuff {
  buffId: string;
  ownerId: string;
  definition: BuffDefinition;
  remaining: number;
}

// ------------------------------------------------------------------ modulo

function toAction(skill: SkillData, attribute: Attribute, isUltimate: boolean): ActionDefinition {
  const hit: HitDefinition = {
    id: `${skill.id}-hit`,
    offset: 0,
    motionValue: skill.motionValue,
    scalingStat: "attack",
    damageTag: attribute,
    category: skill.category,
    canCrit: true,
  };

  return {
    id: skill.id,
    name: skill.name,
    names: skill.names,
    duration: 1,
    cooldown: 0,
    hits: [hit],
    grantsBuffs: skill.grantsBuffs,
    meta: { isUltimate },
  };
}

function resolveActor(build: GrandCrossBuild, slotId: string): ResolvedActor {
  const unit = findUnit(build.characterId);
  if (unit === undefined) {
    throw new Error(`Grand Cross: unita' sconosciuta "${build.characterId}"`);
  }

  const stats: Record<string, number> = { ...unit.baseStats };
  for (const definition of STAT_MODEL) {
    if (stats[definition.key] === undefined) {
      stats[definition.key] = definition.defaultValue;
    }
  }
  for (const [key, value] of Object.entries(build.gear ?? {})) {
    stats[key] = (stats[key] ?? 0) + value;
  }

  const actions: Record<string, ActionDefinition> = {};
  for (const skill of unit.skills) {
    actions[skill.id] = toAction(skill, unit.attribute, false);
  }
  actions[unit.ultimate.id] = toAction(unit.ultimate, unit.attribute, true);

  const buffs: Record<string, BuffDefinition> = {};
  for (const buff of unit.buffs) {
    buffs[buff.id] = {
      id: buff.id,
      name: buff.name,
      names: buff.names,
      duration: buff.duration,
      maxStacks: buff.maxStacks,
      appliesTo: buff.appliesTo,
      modifiers: buff.modifiers.map((modifier) => ({
        stat: modifier.stat,
        mode: modifier.mode,
        value: modifier.value,
      })),
    };
  }

  return {
    id: slotId,
    characterId: unit.id,
    name: unit.name,
    level: build.level,
    stats,
    actions,
    buffs,
    meta: { attribute: unit.attribute, awakening: build.rank },
  };
}

/**
 * Formula di danno: quella standard piu' il triangolo degli attributi.
 * `rollCrit` e' attivo perche' il paradigma e' gia' stocastico - la varianza del
 * critico e' parte dell'informazione utile, non rumore da mediare via.
 */
function computeDamage(ctx: DamageContext): number {
  return standardDamage(ctx, {
    rollCrit: true,
    extraMultiplier: attributeMultiplier(ctx),
  });
}

function attributeMultiplier(ctx: DamageContext): number {
  const attackerAttribute = ctx.actor.meta?.["attribute"];
  if (typeof attackerAttribute !== "string") return 1;

  const targetTag = ctx.target.tags.find((tag) => tag.startsWith("attribute:"));
  if (targetTag === undefined) return 1;
  const targetAttribute = targetTag.slice("attribute:".length);

  const beaten = BEATS[attackerAttribute as Attribute];
  if (beaten === targetAttribute) return ATTRIBUTE_ADVANTAGE;
  if (BEATS[targetAttribute as Attribute] === attackerAttribute) return ATTRIBUTE_DISADVANTAGE;
  return 1;
}

// ------------------------------------------------------------ simulazione

function simulateOnce(input: SimulationInput, rng: Rng): SimulationOutcome {
  const actorsById = new Map(input.actors.map((actor) => [actor.id, actor]));
  const priority = buildPriority(input);
  const maxTurns =
    input.rotation.repeat > 1 ? Math.floor(input.rotation.repeat) : DEFAULT_MAX_TURNS;

  const pool = buildDrawPool(input.actors);
  if (pool.length === 0) {
    return { totalDamage: 0, duration: 0, dps: 0, timeToKill: null, hits: [] };
  }

  const gauge = new Map<string, number>();
  const active: ActiveBuff[] = [];
  const hits: HitResult[] = [];

  let totalDamage = 0;
  let timeToKill: number | null = null;
  let turn = 0;

  while (turn < maxTurns && timeToKill === null) {
    turn++;

    const hand = mergeHand(drawHand(pool, rng));
    const plays = choosePlays(hand, input.actors, gauge, priority);

    for (const card of plays) {
      const actor = actorsById.get(card.actorId);
      if (actor === undefined) continue;
      const action = actor.actions[card.actionId];
      if (action === undefined) continue;

      for (const buffId of action.grantsBuffs) {
        const definition = actor.buffs[buffId];
        if (definition === undefined || definition.duration <= 0) continue;
        active.push({
          buffId,
          ownerId: actor.id,
          definition,
          remaining: definition.duration,
        });
      }

      if (action.meta?.["isUltimate"] !== true) {
        gauge.set(actor.id, (gauge.get(actor.id) ?? 0) + GAUGE_PER_CARD);
      }

      const { modifiers, names } = modifiersFor(active, actor.id);
      const stats = applyModifiers(actor.stats, modifiers);
      const rankBonus = RANK_MULTIPLIER[card.rank] ?? 1;

      for (const hit of action.hits) {
        const scaled: HitDefinition = { ...hit, motionValue: hit.motionValue * rankBonus };
        const damage = computeDamage({
          hit: scaled,
          actor,
          stats,
          target: input.target,
          time: turn,
          rng,
        });

        totalDamage += damage;
        hits.push({
          time: turn,
          actorId: actor.id,
          actionId: action.id,
          hitId: hit.id,
          damageTag: hit.damageTag,
          category: hit.category,
          damage,
          activeBuffs: names,
        });

        if (timeToKill === null && totalDamage >= input.target.maxHp) {
          timeToKill = turn;
        }
      }
    }

    tickBuffs(active);
  }

  return {
    totalDamage,
    duration: turn,
    dps: turn > 0 ? totalDamage / turn : 0,
    timeToKill,
    hits,
  };
}

/** Solo le carte non-ultimate finiscono nel mazzo: l'ultimate si carica a gauge. */
function buildDrawPool(actors: readonly ResolvedActor[]): Card[] {
  const pool: Card[] = [];
  for (const actor of actors) {
    for (const action of Object.values(actor.actions)) {
      if (action.meta?.["isUltimate"] === true) continue;
      pool.push({ actorId: actor.id, actionId: action.id, rank: 1 });
    }
  }
  return pool;
}

function drawHand(pool: readonly Card[], rng: Rng): Card[] {
  const hand: Card[] = [];
  for (let i = 0; i < DRAW_COUNT; i++) {
    const card = rng.pick(pool);
    hand.push({ actorId: card.actorId, actionId: card.actionId, rank: 1 });
  }
  return hand;
}

/**
 * Fusione delle carte identiche.
 *
 * Si procede per rango crescente cosi' le fusioni possono incatenarsi: quattro
 * carte di rango 1 producono due di rango 2 e quindi una di rango 3.
 */
function mergeHand(hand: readonly Card[]): Card[] {
  let current = hand.slice();

  for (let rank = 1; rank < MAX_CARD_RANK; rank++) {
    const carried: Card[] = [];
    const buckets = new Map<string, { actorId: string; actionId: string; count: number }>();

    for (const card of current) {
      if (card.rank !== rank) {
        carried.push(card);
        continue;
      }
      const key = `${card.actorId} ${card.actionId}`;
      const bucket = buckets.get(key);
      if (bucket === undefined) {
        buckets.set(key, { actorId: card.actorId, actionId: card.actionId, count: 1 });
      } else {
        bucket.count++;
      }
    }

    for (const bucket of buckets.values()) {
      const merged = Math.floor(bucket.count / 2);
      const leftover = bucket.count % 2;
      for (let i = 0; i < merged; i++) {
        carried.push({ actorId: bucket.actorId, actionId: bucket.actionId, rank: rank + 1 });
      }
      for (let i = 0; i < leftover; i++) {
        carried.push({ actorId: bucket.actorId, actionId: bucket.actionId, rank });
      }
    }

    current = carried;
  }

  return current;
}

/**
 * Politica di gioco: prima gli ultimate carichi, poi le carte migliori secondo
 * la priorita' dichiarata dall'utente e, a parita', il danno stimato.
 */
function choosePlays(
  hand: readonly Card[],
  actors: readonly ResolvedActor[],
  gauge: Map<string, number>,
  priority: ReadonlyMap<string, number>,
): Card[] {
  const plays: Card[] = [];

  for (const actor of actors) {
    if (plays.length >= PLAYS_PER_TURN) break;
    const available = gauge.get(actor.id) ?? 0;
    if (available < ULTIMATE_GAUGE_COST) continue;

    const ultimate = Object.values(actor.actions).find(
      (action) => action.meta?.["isUltimate"] === true,
    );
    if (ultimate === undefined) continue;

    gauge.set(actor.id, available - ULTIMATE_GAUGE_COST);
    plays.push({ actorId: actor.id, actionId: ultimate.id, rank: MAX_CARD_RANK });
  }

  const actorsById = new Map(actors.map((actor) => [actor.id, actor]));
  const ranked = hand.slice().sort((a, b) => {
    const priorityA = priority.get(cardKey(a)) ?? Number.MAX_SAFE_INTEGER;
    const priorityB = priority.get(cardKey(b)) ?? Number.MAX_SAFE_INTEGER;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return estimateValue(b, actorsById) - estimateValue(a, actorsById);
  });

  for (const card of ranked) {
    if (plays.length >= PLAYS_PER_TURN) break;
    plays.push(card);
  }

  return plays;
}

/** Stima grezza usata solo per ordinare la mano, non per il danno reale. */
function estimateValue(card: Card, actorsById: ReadonlyMap<string, ResolvedActor>): number {
  const actor = actorsById.get(card.actorId);
  if (actor === undefined) return 0;
  const action = actor.actions[card.actionId];
  if (action === undefined) return 0;

  const motion = action.hits.reduce((sum, hit) => sum + hit.motionValue, 0);
  return motion * (RANK_MULTIPLIER[card.rank] ?? 1);
}

function cardKey(card: Card): string {
  return `${card.actorId}:${card.actionId}`;
}

function buildPriority(input: SimulationInput): Map<string, number> {
  const priority = new Map<string, number>();
  input.rotation.steps.forEach((step, index) => {
    const key = `${step.actorId}:${step.actionId}`;
    if (!priority.has(key)) priority.set(key, index);
  });
  return priority;
}

/** Stessa semantica di stacking del risolutore deterministico. */
function modifiersFor(
  active: readonly ActiveBuff[],
  actorId: string,
): { modifiers: StatModifier[]; names: string[] } {
  const stacks = new Map<string, { definition: BuffDefinition; count: number }>();

  for (const buff of active) {
    if (buff.remaining <= 0) continue;
    if (buff.definition.appliesTo === "self" && buff.ownerId !== actorId) continue;

    const entry = stacks.get(buff.buffId);
    if (entry === undefined) {
      stacks.set(buff.buffId, { definition: buff.definition, count: 1 });
    } else {
      entry.count++;
    }
  }

  const modifiers: StatModifier[] = [];
  const names: string[] = [];

  for (const [buffId, entry] of stacks) {
    const count = Math.min(entry.count, Math.max(1, entry.definition.maxStacks));
    names.push(count > 1 ? `${buffId} x${count}` : buffId);
    for (const modifier of entry.definition.modifiers) {
      modifiers.push({
        stat: modifier.stat,
        mode: modifier.mode,
        value: modifier.value * count,
      });
    }
  }

  return { modifiers, names };
}

function tickBuffs(active: ActiveBuff[]): void {
  for (let i = active.length - 1; i >= 0; i--) {
    const buff = active[i];
    if (buff === undefined) continue;
    buff.remaining--;
    if (buff.remaining <= 0) active.splice(i, 1);
  }
}

// ------------------------------------------------------------------ export

export const grandCrossModule: GameModule<GrandCrossBuild> = {
  id: "grand-cross",
  slug: "grand-cross",
  name: "The Seven Deadly Sins: Grand Cross",
  publisher: "Netmarble",
  paradigm: "stochastic",
  timeUnit: "turns",
  dataset: DATASET,
  statModel: STAT_MODEL,
  targets: TARGETS,
  characters: CHARACTERS,
  roster: ROSTER,
  heroTexts: HERO_TEXTS,
  heroAssets: HERO_ASSETS,
  heroAbilities: HERO_ABILITIES,
  heroStats: HERO_STATS,
  heroContext: HERO_CONTEXT,
  heroSpecials: HERO_SPECIALS,
  heroRelics: HERO_RELICS,
  releases: RELEASES,
  deathMatch: DEATH_MATCH,
  creatureNest: CREATURE_NEST,
  demonKing: DEMON_KING,
  supremeDeity: SUPREME_DEITY,
  endgameHeroes: ENDGAME_HEROES,
  icons: GAME_ICONS,
  resolveActor,
  computeDamage,
  simulateOnce,
  defaultIterations: 3000,
};
