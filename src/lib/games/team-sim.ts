import { buffTurns, simulate } from "./grand-cross/simulation";
import type { SimData, SimHeroInput, SimNode, SimStat, SimTraceEntry } from "./grand-cross/simulation-types";
import type { HeroBox } from "./hero-box";
import {
  relicOf,
  TEAM_SLOTS,
  teamTotals,
  ultimateOf,
  type BattlePart,
  type BattleStat,
  type HeroBattle,
  type StatTotal,
  type TeamAnalysis,
  type TeamData,
  type TeamSetup,
  type TeamTotals,
} from "./team";
import { startStatsOf, type HeroStart, type StartAccount, type StartStat, type StartStatsData } from "./team-start";
import type { TeamIndex, TeamSource } from "./team-types";

/**
 * I numeri della squadra al primo turno, dal simulatore del gioco
 * (grand-cross/simulation.ts) invece che dal testo delle passive.
 *
 * Richiesta dell'utente dell'11/11, dopo una sua battaglia: «non devi indovinare
 * ma basarti sulle tabelle e numeri di gioco, creando quasi una vera e propria
 * simulazione». Il testo diceva +21% per l'Unica di Escanor e il gioco fa ×1,12
 * poi ×1,09; diceva che la Fiamma eterna vale usando carte, e il gioco la conta
 * sempre. Il simulatore rifa' UnitBase.RefreshStatus passo per passo, con le
 * regole lette nel codice del client e le tabelle, e sulla battaglia dell'utente
 * torna su nove numeri entro 1,4 punti.
 *
 * Qui si prepara la squadra per lui (i numeri d'inizio da team-start.ts, rango e
 * Reliquia di ognuno, quanti nemici) e si riporta il risultato nei totali della
 * pagina: le dodici statistiche vengono dal simulatore, coi numeri veri e passiva
 * per passiva; i danni inflitti e subiti, che il gioco conta al momento del colpo
 * e non in RefreshStatus, restano quelli letti dalle frasi, come le righe «in
 * certi momenti».
 */

/** Le dodici statistiche: il nome del sito, quello dei numeri d'inizio, quello del gioco. */
const STATS: readonly (readonly [BattleStat, StartStat, SimStat])[] = [
  ["atk", "atk", "ATK"],
  ["fixed_atk_per", "fixedAtkPer", "FIXED_ATK_PER"],
  ["crit_per", "critPer", "CRIT_PER"],
  ["crit_atk_per", "critAtkPer", "CRIT_ATK_PER"],
  ["def", "def", "DEF"],
  ["fixed_def_per", "fixedDefPer", "FIXED_DEF_PER"],
  ["crit_res_per", "critResPer", "CRIT_RES_PER"],
  ["crit_def_per", "critDefPer", "CRIT_DEF_PER"],
  ["hp", "hp", "MAX_HP"],
  ["hp_regen_per", "hpRegenPer", "HP_REGEN_PER"],
  ["hp_recovery_per", "hpRecoveryPer", "HP_RECOVERY_PER"],
  ["hp_steal_per", "hpStealPer", "HP_STEAL_PER"],
];
const SITE_OF = new Map<SimStat, BattleStat>(STATS.map(([site, , sim]) => [sim, site]));
const BATTLE_STATS = new Set<string>(STATS.map(([site]) => site));
/** Attacco, Difesa e PS sono numeri; le altre sono percentuali, che il gioco tiene in frazione (0,5 = 50%). */
const FLAT = new Set<BattleStat>(["atk", "def", "hp"]);
const toSite = (stat: BattleStat, value: number) => (FLAT.has(stat) ? value : value * 100);
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Quello che serve oltre alla squadra: le regole del simulatore, i numeri d'inizio, il box, l'account. */
export interface SimContext {
  readonly sim: SimData;
  readonly start: StartStatsData;
  readonly box: HeroBox;
  readonly account: StartAccount | null;
}

/** Quale passiva del sito e' quella da cui viene una voce del simulatore. */
function sourceOf(team: TeamIndex, from: string | null, origin: SimTraceEntry["origin"]): TeamSource | null {
  if (!from) return null;
  const sources = team.heroes[from] ?? [];
  const special = (name: string) => sources.find((s) => s.kind === "special" && s.special === name) ?? null;
  switch (origin) {
    case "unique":
    case "hidden": // le righe nascoste sono pezzi dell'Unica: il testo dell'Unica le descrive
      return sources.find((s) => s.kind === "unique") ?? null;
    case "relic":
      return sources.find((s) => s.kind === "relic") ?? null;
    case "commandment":
      return special("comandamento");
    case "grace":
      return special("grazia");
    case "unity":
      return special("unita");
    default:
      return null;
  }
}

/** La traccia del simulatore come parti della pagina: una per passiva (o buff), nell'ordine del gioco. */
function partsOf(trace: readonly SimTraceEntry[], team: TeamIndex, sim: SimData): BattlePart[] {
  const parts = new Map<string, BattlePart & { changes: BattlePart["changes"][number][] }>();
  const buffs = buffRows(sim);
  for (const entry of trace) {
    const stat = SITE_OF.get(entry.stat);
    if (!stat) continue;
    const key = `${entry.from}:${entry.passive}:${entry.buff ?? ""}:${entry.origin}`;
    const part = parts.get(key) ?? {
      from: entry.from,
      source: sourceOf(team, entry.from, entry.origin),
      passive: entry.passive,
      buff: entry.buff ?? null,
      turns: entry.buff ? buffTurns(buffs.get(entry.buff)!) : null,
      changes: [],
    };
    part.changes.push({
      stat,
      mode: entry.mode,
      value: entry.value,
      before: toSite(stat, entry.before),
      after: toSite(stat, entry.after),
    });
    parts.set(key, part);
  }
  return [...parts.values()];
}

/**
 * Gli eroi con la forma LR (una skin con rating 7, SkinData.IsLegendSkin): per
 * loro il sito descrive l'Unica LR (`exclusive_passive_id_2`, scheda_client.py),
 * e il simulatore la usa con lui. Agli altri `lr` farebbe lanciare un errore.
 */
const legendCache = new WeakMap<SimData, ReadonlySet<string>>();
function legendHeroes(sim: SimData): ReadonlySet<string> {
  let out = legendCache.get(sim);
  if (!out) {
    out = new Set(sim.skins.filter((skin) => skin.rating === 7).map((skin) => String(skin.matching_hero_id)));
    legendCache.set(sim, out);
  }
  return out;
}

const buffCache = new WeakMap<SimData, ReadonlyMap<number, SimNode>>();
function buffRows(sim: SimData): ReadonlyMap<number, SimNode> {
  let out = buffCache.get(sim);
  if (!out) {
    out = new Map(sim.buffs.map((row) => [Number(row.id), row]));
    buffCache.set(sim, out);
  }
  return out;
}

/** Le statistiche d'inizio coi nomi del gioco, le percentuali in frazione. */
function simStatsOf(start: HeroStart): Partial<Record<SimStat, number>> {
  return Object.fromEntries(
    STATS.map(([site, key, sim]) => [sim, FLAT.has(site) ? start.stats[key] : start.stats[key] / 100]),
  );
}

/**
 * I totali della squadra al primo turno. Come `teamTotals`, con in piu' per ogni
 * eroe in campo `battle`; le dodici statistiche sono quelle del simulatore.
 * Attacco, Difesa e PS in percentuale sul numero d'inizio (il gioco moltiplica),
 * le altre in punti.
 */
export function simTotals(
  setup: TeamSetup,
  data: TeamData,
  analysis: TeamAnalysis,
  ctx: SimContext,
  // falso: senza gli effetti a tempo, cioe' quello che resta quando scadono (il secondo numero, 14/11)
  timed = true,
): TeamTotals {
  const base = teamTotals(setup, data, analysis);
  const starts = new Map<string, HeroStart>();
  const heroes: (SimHeroInput | null)[] = setup.mains.map((id, slot) => {
    if (!id) return null;
    const steps = ctx.start.steps[id];
    const start = steps ? startStatsOf(steps, ctx.box.heroes[id] ?? null, ctx.start.gear, ctx.account) : null;
    if (start) starts.set(id, start);
    return {
      id,
      bench: setup.bench && slot === TEAM_SLOTS - 1,
      lr: legendHeroes(ctx.sim).has(id),
      ultimate: ultimateOf(setup, id),
      unique: 1,
      relic: relicOf(setup, id),
      stats: start ? simStatsOf(start) : {},
    };
  });
  const result = simulate({ content: setup.content, heroes, enemies: { count: setup.enemies }, timed }, ctx.sim);
  const simulated = new Map(result.heroes.map((hero) => [hero.id, hero]));

  return {
    heroes: base.heroes.map((row) => {
      const sim = simulated.get(row.hero);
      const start = starts.get(row.hero);
      if (!sim || !start) return row;
      const startStats = Object.fromEntries(STATS.map(([site, , key]) => [site, toSite(site, sim.start[key] ?? 0)])) as Record<
        BattleStat,
        number
      >;
      const firstTurn = Object.fromEntries(STATS.map(([site, , key]) => [site, toSite(site, sim.firstTurn[key] ?? 0)])) as Record<
        BattleStat,
        number
      >;
      const fromSim: StatTotal[] = STATS.flatMap(([site]) => {
        const value = FLAT.has(site)
          ? startStats[site] > 0
            ? round1((firstTurn[site] / startStats[site] - 1) * 100)
            : 0
          : round1(firstTurn[site] - startStats[site]);
        return value === 0 ? [] : [{ key: site, value, parts: [] }];
      });
      const battle: HeroBattle = { from: start.from, start: startStats, firstTurn, parts: partsOf(sim.trace, data.team, ctx.sim) };
      return {
        ...row,
        // dalle frasi restano i danni e le varianti per colpo («Possibilita' critico della Mossa finale»)
        totals: [...row.totals.filter((total) => !BATTLE_STATS.has(total.key)), ...fromSim],
        battle,
      };
    }),
    enemies: base.enemies,
  };
}

/**
 * I due numeri della pagina (scelta dell'utente del 14/11, «entrambi»): il primo
 * turno con tutto, e accanto `battle.lasting`, la stessa squadra senza gli effetti
 * a tempo (buff con una durata in turni). Il secondo dice quanto resta quando
 * scadono, per esempio i +150% di Difesa di Campione Taizoo che si provoca il
 * nemico per un turno. Non e' un numero di dopo: la Fiamma eterna di Escanor dura
 * 3 turni ma se ne aggiunge una ogni turno, e il secondo numero la toglie.
 */
export function simTotalsBoth(setup: TeamSetup, data: TeamData, analysis: TeamAnalysis, ctx: SimContext): TeamTotals {
  const first = simTotals(setup, data, analysis, ctx, true);
  const lasting = new Map(simTotals(setup, data, analysis, ctx, false).heroes.map((row) => [row.hero, row.battle]));
  return {
    ...first,
    heroes: first.heroes.map((row) => {
      const other = lasting.get(row.hero);
      return row.battle && other ? { ...row, battle: { ...row.battle, lasting: other.firstTurn } } : row;
    }),
  };
}
