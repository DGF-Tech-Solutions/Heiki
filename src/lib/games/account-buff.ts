import type {
  AccountBuffIndex,
  AccountPowerTier,
  AccountSliderData,
  AccountStatKey,
  Constellation,
  ConstellationTotals,
  HeroPowerRules,
  ManaGroup,
  StatBag,
} from "./account-buff-types";
import { inLingua, type Locale } from "@/lib/i18n/locale";

/**
 * I conti dei buff dell'account, come li fa il client (lo studio con le prove e'
 * in BUFF_ACCOUNT.md nella pipeline). Funzioni pure: le usano lo slider della
 * scheda eroe, la pagina «Buff dell'account» e i test, e devono sommare allo
 * stesso modo.
 */

/** L'ordine della schermata delle statistiche del gioco (UI_skin_stat_1..15). */
export const STAT_ORDER: readonly AccountStatKey[] = [
  "atk",
  "def",
  "hp",
  "critPer",
  "critAtkPer",
  "fixedAtkPer",
  "critResPer",
  "critDefPer",
  "fixedDefPer",
  "hpRecoveryPer",
  "hpStealPer",
  "hpRegenPer",
  "dmgRes",
  "dmgInc",
];

/** Le tre statistiche che sono valori: le altre sono percentuali (GetStatRevisionValue). */
export const FLAT_STATS: ReadonlySet<AccountStatKey> = new Set(["atk", "def", "hp"]);

export function buffImageSrc(gameSlug: string, path: string): string {
  return `/eroi/${gameSlug}/buff-account/${path}`;
}

/* ---------------------------------------------------- classe dell'account -- */

/**
 * Il titolo che vale per una classe dell'account: la soglia PIU' ALTA raggiunta.
 * Dei titoli della classe il gioco ne prende uno solo
 * (PlayTitleManager.GetHighestMissionPlayTitleGroupRowByAccountPower): non si
 * sommano, e non vale il massimo statistica per statistica. Per questo a
 * 1.000.000 la Difesa del titolo da 750.000 sparisce.
 */
export function tierFor<T extends Pick<AccountPowerTier, "threshold">>(tiers: readonly T[], power: number): T | null {
  let found: T | null = null;
  for (const tier of tiers) if (tier.threshold <= power && (!found || tier.threshold > found.threshold)) found = tier;
  return found;
}

/* ---------------------------------------------------------- costellazioni -- */

export function addBags(...bags: readonly StatBag[]): StatBag {
  const out: StatBag = {};
  for (const bag of bags) {
    for (const [key, value] of Object.entries(bag) as [AccountStatKey, number][]) {
      out[key] = (out[key] ?? 0) + value;
    }
  }
  // le pietre valgono decimi di punto: sommate in virgola mobile lascerebbero code
  for (const key of Object.keys(out) as AccountStatKey[]) out[key] = Math.round(out[key]! * 1e4) / 1e4;
  return out;
}

/**
 * Il valore atteso di una pietra del mana a un livello del Caos: ogni fascia
 * col suo peso, e dentro la fascia ogni valore ugualmente probabile
 * («Ogni valore ha la stessa probabilità all'interno dell'intervallo»).
 */
export function manaAverage(group: ManaGroup, chaosLevel = 1): number {
  const index = Math.min(Math.max(chaosLevel, 1), 20) - 1;
  const value = group.tiers.reduce((sum, tier) => sum + ((tier.rates[index] ?? 0) / 100) * ((tier.min + tier.max) / 2), 0);
  return Math.round(value * 100) / 100;
}

export function manaRange(group: ManaGroup): { min: number; max: number } {
  return {
    min: Math.min(...group.tiers.map((tier) => tier.min)),
    max: Math.max(...group.tiers.map((tier) => tier.max)),
  };
}

/** Una costellazione ridotta ai suoi totali, per lo slider della scheda eroe. */
export function constellationTotals(
  constellation: Constellation,
  mana: Readonly<Record<string, ManaGroup>>,
  name: string,
  symbol: string | null,
): ConstellationTotals {
  const stones: StatBag[] = [];
  const min: StatBag[] = [];
  const avg: StatBag[] = [];
  const max: StatBag[] = [];
  for (const stone of constellation.stones) {
    if (!stone.stat) continue;
    if (stone.kind === "stone" && stone.value !== null) stones.push({ [stone.stat]: stone.value });
    if (stone.kind === "mana" && stone.mana) {
      const group = mana[stone.mana];
      if (!group) continue;
      const range = manaRange(group);
      min.push({ [stone.stat]: range.min });
      avg.push({ [stone.stat]: manaAverage(group) });
      max.push({ [stone.stat]: range.max });
    }
  }
  return {
    id: constellation.id,
    name,
    symbol,
    stones: addBags(...stones),
    mana: { min: addBags(...min), avg: addBags(...avg), max: addBags(...max) },
    completion: completionBag(constellation),
  };
}

function completionBag(constellation: Constellation): StatBag {
  const { atk, def, hp } = constellation.completion;
  return addBags(atk ? { atk } : {}, def ? { def } : {}, hp ? { hp } : {});
}

/** I dati dello slider: le soglie e le undici costellazioni ridotte ai totali. */
export function sliderData(index: AccountBuffIndex, gameSlug: string, locale: Locale): AccountSliderData {
  return {
    version: index.version,
    tiers: index.accountPower.tiers.map(({ threshold, atk, def, hp }) => ({ threshold, atk, def, hp })),
    constellations: index.constellations.map((constellation) =>
      constellationTotals(
        constellation,
        index.mana,
        inLingua(constellation.name, locale) ?? String(constellation.id),
        constellation.symbol ? buffImageSrc(gameSlug, `simboli/${constellation.id}.png`) : null,
      ),
    ),
    heroPower: index.heroPower,
  };
}

export type ManaMode = "min" | "avg" | "max";

/** Le prime `completed` costellazioni complete, con le pietre del mana a un valore scelto. */
export function quickTotals(
  constellations: readonly ConstellationTotals[],
  completed: number,
  mana: ManaMode,
): StatBag {
  return addBags(
    ...constellations.slice(0, Math.max(0, completed)).flatMap((c) => [c.stones, c.mana[mana], c.completion]),
  );
}

/** Una mappa e' completa quando ogni sua pietra e' attivata (la partenza lo e' sempre). */
export function isComplete(constellation: Constellation, active: ReadonlySet<number>): boolean {
  return constellation.stones.every((stone) => stone.kind === "start" || active.has(stone.id));
}

/**
 * I totali di una scelta pietra per pietra: le pietre attivate, le pietre del
 * mana al valore scelto (o alla media, se non e' stato scelto), e il bonus delle
 * mappe complete.
 */
export function customTotals(
  index: Pick<AccountBuffIndex, "constellations" | "mana">,
  active: ReadonlySet<number>,
  manaValues: Readonly<Record<string, number>>,
): StatBag {
  const parts: StatBag[] = [];
  for (const constellation of index.constellations) {
    for (const stone of constellation.stones) {
      if (stone.kind === "start" || !stone.stat || !active.has(stone.id)) continue;
      if (stone.kind === "stone" && stone.value !== null) parts.push({ [stone.stat]: stone.value });
      if (stone.kind === "mana" && stone.mana && index.mana[stone.mana]) {
        parts.push({ [stone.stat]: manaValue(index.mana[stone.mana]!, manaValues[String(stone.id)]) });
      }
    }
    if (isComplete(constellation, active)) parts.push(completionBag(constellation));
  }
  return addBags(...parts);
}

/**
 * Il valore di una pietra del mana: quello scelto, dentro l'intervallo; se no la
 * media. Non si arrotonda: lo slider da' gia' interi, e «medie» salva la media
 * con i decimali, che deve dare gli stessi totali della scelta rapida.
 */
export function manaValue(group: ManaGroup, chosen: number | undefined): number {
  const { min, max } = manaRange(group);
  if (chosen === undefined || !Number.isFinite(chosen)) return manaAverage(group);
  return Math.min(max, Math.max(min, chosen));
}

/** Attivare una pietra attiva anche quelle prima di lei, fino alla partenza. */
export function activateStone(constellation: Constellation, id: number, active: ReadonlySet<number>): Set<number> {
  const mothers = new Map(constellation.stones.map((stone) => [stone.id, stone.mother]));
  const out = new Set(active);
  let current: number | null | undefined = id;
  while (current !== null && current !== undefined) {
    out.add(current);
    current = mothers.get(current);
  }
  return out;
}

/** Spegnere una pietra spegne anche quelle che vengono dopo di lei. */
export function deactivateStone(constellation: Constellation, id: number, active: ReadonlySet<number>): Set<number> {
  const children = new Map<number, number[]>();
  for (const stone of constellation.stones) {
    if (stone.mother !== null) children.set(stone.mother, [...(children.get(stone.mother) ?? []), stone.id]);
  }
  const out = new Set(active);
  const stack = [id];
  while (stack.length) {
    const current = stack.pop()!;
    out.delete(current);
    stack.push(...(children.get(current) ?? []));
  }
  return out;
}

/* ---------------------------------------------------- statistiche in battaglia -- */

/**
 * Le statistiche in battaglia coi buff dell'account, come TeamHeroData.GetTotalAllStat:
 * la statistica senza passive, piu' la sua percentuale del titolo (la passiva
 * aggiunge base × valore%), piu' la costellazione, che si somma DOPO e non viene
 * moltiplicata. Le passive dell'eroe e l'equipaggiamento restano fuori, come
 * nella tabella del sito.
 */
export function battleStats(
  stats: Readonly<Record<string, number>>,
  tier: Pick<AccountPowerTier, "atk" | "def" | "hp"> | null,
  bonus: StatBag,
): Record<string, number> {
  const out: Record<string, number> = { ...stats };
  const percent: Partial<Record<AccountStatKey, number>> = tier ? { atk: tier.atk, def: tier.def, hp: tier.hp } : {};
  for (const key of FLAT_STATS) {
    if (out[key] === undefined) continue;
    out[key] = out[key]! * (1 + (percent[key] ?? 0) / 100);
  }
  for (const [key, value] of Object.entries(bonus)) out[key] = (out[key] ?? 0) + value;
  for (const key of Object.keys(out)) {
    out[key] = FLAT_STATS.has(key as AccountStatKey) ? Math.round(out[key]!) : Math.round(out[key]! * 100) / 100;
  }
  return out;
}

/* ------------------------------------------------------ classe dell'eroe -- */

export interface HeroPowerOptions {
  /** il rango dell'ultimate, 1-6 */
  readonly ultimateRank: number;
  /** almeno uno dei due Vero risveglio */
  readonly trueAwakening: boolean;
  /** l'eroe ha la passiva unica: tutti quelli del roster */
  readonly uniquePassive?: boolean;
}

/**
 * La classe di combattimento di un eroe come la mostra il gioco
 * (SkinData.GetPower con i flag di UpdateCachedPower): ogni statistica per il suo
 * peso, le percentuali per punto; poi 500 per la passiva unica, 400 per rango
 * dell'ultimate, il Vero risveglio; arrotondata per eccesso. Senza titoli e
 * costellazioni, che il gioco non conta nella classe. L'equipaggiamento, che il
 * gioco conta, qui manca perche' manca nelle statistiche.
 */
export function heroCombatClass(
  stats: Readonly<Record<string, number>>,
  rules: HeroPowerRules,
  options: HeroPowerOptions,
): number {
  let sum = 0;
  for (const [key, weight] of Object.entries(rules.weights) as [AccountStatKey, number][]) {
    sum += (stats[key] ?? 0) * weight;
  }
  if (options.uniquePassive ?? true) sum += rules.uniquePassive;
  sum += rules.perUltimateRank * Math.min(Math.max(Math.round(options.ultimateRank), 1), 6);
  if (options.trueAwakening) sum += rules.trueAwakening;
  // i pesi 0,8 e 0,2 in virgola mobile lasciano code: un 41389.0000000001 non deve salire a 41390
  return Math.ceil(Math.round(sum * 1e6) / 1e6);
}
