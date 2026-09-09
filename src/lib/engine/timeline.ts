/**
 * Risolutore di rotazioni deterministico.
 *
 * E' il cuore del "rotation builder": prende una sequenza di azioni, la dispone
 * su una linea del tempo rispettando i cooldown, calcola quali buff sono attivi
 * nell'istante esatto di ogni colpo, e somma il danno.
 *
 * Lo usano i paradigmi "timeline" (Genshin, ZZZ, WuWa) e "turn" (HSR): l'unica
 * differenza e' l'unita' di misura di durate e cooldown, secondi contro turni.
 * Il paradigma "stochastic" non passa di qui e fornisce il proprio simulatore.
 */

import { applyModifiers } from "./stats";
import type {
  ActionDefinition,
  BuffDefinition,
  DamageFn,
  HitResult,
  ResolvedActor,
  SimulateOnce,
  SimulationInput,
  SimulationOutcome,
  StatModifier,
} from "./types";
import type { Rng } from "./rng";

interface ScheduledAction {
  actor: ResolvedActor;
  action: ActionDefinition;
  start: number;
}

interface BuffInstance {
  buffId: string;
  ownerId: string;
  definition: BuffDefinition;
  start: number;
  end: number;
}

interface PendingHit {
  time: number;
  order: number;
  actor: ResolvedActor;
  action: ActionDefinition;
  hitIndex: number;
}

/** Costruisce un simulatore deterministico attorno alla formula di un gioco. */
export function createTimelineSimulator(damageFn: DamageFn): SimulateOnce {
  return (input, rng) => resolveTimeline(input, damageFn, rng);
}

export function resolveTimeline(
  input: SimulationInput,
  damageFn: DamageFn,
  rng: Rng,
): SimulationOutcome {
  const actorsById = new Map(input.actors.map((actor) => [actor.id, actor]));

  const { schedule, duration } = buildSchedule(input, actorsById);
  const buffs = collectBuffs(schedule);
  const hits = collectHits(schedule);

  hits.sort((a, b) => (a.time === b.time ? a.order - b.order : a.time - b.time));

  const results: HitResult[] = [];
  let totalDamage = 0;
  let timeToKill: number | null = null;

  for (const pending of hits) {
    const hit = pending.action.hits[pending.hitIndex];
    if (hit === undefined) continue;

    const { modifiers, active } = activeModifiersAt(buffs, pending.time, pending.actor.id);
    const stats = applyModifiers(pending.actor.stats, modifiers);

    const damage = damageFn({
      hit,
      actor: pending.actor,
      stats,
      target: input.target,
      time: pending.time,
      rng,
    });

    totalDamage += damage;

    if (timeToKill === null && totalDamage >= input.target.maxHp) {
      timeToKill = pending.time;
    }

    results.push({
      time: pending.time,
      actorId: pending.actor.id,
      actionId: pending.action.id,
      hitId: hit.id,
      damageTag: hit.damageTag,
      category: hit.category,
      damage,
      activeBuffs: active,
    });
  }

  return {
    totalDamage,
    duration,
    dps: duration > 0 ? totalDamage / duration : 0,
    timeToKill,
    hits: results,
  };
}

/**
 * Dispone gli step sulla linea del tempo.
 *
 * Uno step senza `at` esplicito parte quando finisce il precedente. Se l'azione
 * e' ancora in cooldown la partenza slitta: la rotazione resta eseguibile invece
 * di produrre numeri impossibili nel gioco reale.
 */
function buildSchedule(
  input: SimulationInput,
  actorsById: ReadonlyMap<string, ResolvedActor>,
): { schedule: ScheduledAction[]; duration: number } {
  const schedule: ScheduledAction[] = [];
  const readyAt = new Map<string, number>();
  const repeat = Math.max(1, Math.floor(input.rotation.repeat));
  let cursor = 0;

  for (let iteration = 0; iteration < repeat; iteration++) {
    for (const step of input.rotation.steps) {
      const actor = actorsById.get(step.actorId);
      if (actor === undefined) {
        throw new Error(
          `Rotazione "${input.rotation.name}": nessun attore con id "${step.actorId}"`,
        );
      }

      const action = actor.actions[step.actionId];
      if (action === undefined) {
        throw new Error(
          `Rotazione "${input.rotation.name}": l'attore "${actor.name}" non ha l'azione "${step.actionId}"`,
        );
      }

      const key = `${actor.id}:${action.id}`;
      const available = readyAt.get(key) ?? 0;
      const requested = step.at ?? cursor;
      const start = Math.max(requested, available);

      schedule.push({ actor, action, start });
      readyAt.set(key, start + action.cooldown);
      cursor = start + action.duration;
    }
  }

  return { schedule, duration: cursor };
}

function collectBuffs(schedule: readonly ScheduledAction[]): BuffInstance[] {
  const instances: BuffInstance[] = [];

  for (const entry of schedule) {
    for (const buffId of entry.action.grantsBuffs) {
      const definition = entry.actor.buffs[buffId];
      if (definition === undefined) {
        throw new Error(
          `L'azione "${entry.action.id}" di "${entry.actor.name}" applica il buff "${buffId}", che non e' definito sull'attore`,
        );
      }
      if (definition.duration <= 0) continue;

      instances.push({
        buffId,
        ownerId: entry.actor.id,
        definition,
        start: entry.start,
        end: entry.start + definition.duration,
      });
    }
  }

  return instances;
}

function collectHits(schedule: readonly ScheduledAction[]): PendingHit[] {
  const hits: PendingHit[] = [];
  let order = 0;

  for (const entry of schedule) {
    for (let index = 0; index < entry.action.hits.length; index++) {
      const hit = entry.action.hits[index];
      if (hit === undefined) continue;
      hits.push({
        time: entry.start + hit.offset,
        order: order++,
        actor: entry.actor,
        action: entry.action,
        hitIndex: index,
      });
    }
  }

  return hits;
}

/**
 * Buff attivi nell'istante `time` per un dato attore.
 *
 * Intervallo semiaperto [start, end): un buff applicato a t=0 e' attivo per un
 * colpo con offset 0, e scade esattamente allo scadere della durata.
 * Gli stack si contano per id di buff e si limitano a maxStacks; il valore di
 * ogni modificatore viene moltiplicato per il numero di stack.
 */
function activeModifiersAt(
  buffs: readonly BuffInstance[],
  time: number,
  actorId: string,
): { modifiers: StatModifier[]; active: string[] } {
  const stacks = new Map<string, { definition: BuffDefinition; count: number }>();

  for (const instance of buffs) {
    if (instance.start > time || instance.end <= time) continue;
    if (instance.definition.appliesTo === "self" && instance.ownerId !== actorId) continue;

    const current = stacks.get(instance.buffId);
    if (current === undefined) {
      stacks.set(instance.buffId, { definition: instance.definition, count: 1 });
    } else {
      current.count++;
    }
  }

  const modifiers: StatModifier[] = [];
  const active: string[] = [];

  for (const [buffId, entry] of stacks) {
    const count = Math.min(entry.count, Math.max(1, entry.definition.maxStacks));
    active.push(count > 1 ? `${buffId} x${count}` : buffId);

    for (const modifier of entry.definition.modifiers) {
      modifiers.push({
        stat: modifier.stat,
        mode: modifier.mode,
        value: modifier.value * count,
      });
    }
  }

  return { modifiers, active };
}
