import type { AccountPowerTier, StatBag } from "./account-buff-types";
import type { Costume, CostumeIndex, GearIndex, HeroCostumes } from "./gear-types";
import type { HeroFate, HeroFatesIndex } from "./hero-fates-types";
import {
  COSTUME_KINDS,
  FLAT_STATS,
  GEAR_PRESETS,
  applyGear,
  clampCostumes,
  clampPiece,
  costumeTotals,
  fateContribution,
  fateEffectAt,
  commonFatePercent,
  gearTotals,
  presetBuild,
  startCostumes,
  type CostumeBuild,
  type GearBuild,
  type GearTotals,
} from "./gear";
import { clampSelection, maxSelection, statsAt } from "./hero-stats";
import type { HeroLabel, HeroStatSteps } from "./types";

/**
 * Il calcolatore della scheda eroe: cosa arriva dal server, la configurazione
 * che l'utente sceglie, e il conto completo.
 *
 * La configurazione (livello, risvegli, equipaggiamento, costumi, reliquia,
 * associato) si salva nel browser per ogni eroe: chi mette il suo equipaggiamento
 * vero su un eroe lo ritrova tornando. Per questo `parseBuild` controlla tutto
 * quello che rilegge: dati vecchi dopo una patch (un costume sparito, un set
 * nuovo) non devono rompere la scheda.
 */

type Stats = Record<string, number>;

export interface CalculatorRelic {
  readonly id: string;
  readonly name: HeroLabel;
  readonly image: boolean;
  readonly stats: Readonly<Stats>;
  /** i tre potenziamenti, in ordine: ognuno aggiunge il suo */
  readonly upgrades: readonly Readonly<Stats>[];
}

export interface CalculatorAssociate {
  readonly id: string;
  /** nella lingua della pagina */
  readonly name: string;
  /** i gradi che puo' avere, 3 R ... 7 LR: da quello d'uscita al tetto */
  readonly grades: readonly number[];
  /** al massimo, senza equipaggiamento (la scheda del sito) */
  readonly max: Readonly<Record<"atk" | "def" | "hp", number>>;
}

/** Quello che il server passa al calcolatore di un eroe: solo i suoi dati, piu' l'equipaggiamento. */
export interface CalculatorData {
  readonly heroId: string;
  readonly steps: HeroStatSteps;
  readonly gear: GearIndex;
  readonly costumes: Pick<CostumeIndex, "flatStat" | "scale"> & {
    readonly hero: HeroCostumes;
    /** i costumi di questo eroe, senza le descrizioni (le mostra la scheda Costumi) */
    readonly items: Readonly<Record<string, Costume>>;
  };
  readonly relics: readonly CalculatorRelic[];
  readonly fates?: Pick<HeroFatesIndex, "common" | "effects"> & { readonly links: readonly HeroFate[] };
  readonly associates?: readonly CalculatorAssociate[];
}

export interface AssociateChoice {
  readonly hero: string;
  /** il rango della sua Mossa finale, 1-6 */
  readonly ultimateRank: number;
  /** il suo grado, 3 R ... 7 LR */
  readonly grade: number;
  /** con lo stesso equipaggiamento di questo eroe (senza incisione, che vale per un eroe solo) */
  readonly sameGear: boolean;
}

export interface HeroBuild {
  readonly level: number;
  readonly awaken: number;
  readonly superAwaken: number;
  /** per la classe di combattimento */
  readonly ultimateRank: number;
  /**
   * i due Vero risveglio (exceed_type 1 coi materiali del Re Demone, 2 della
   * Divinita' Suprema): nella classe contano una volta sola, 1.500 con uno o due
   */
  readonly trueAwakening: readonly [boolean, boolean];
  readonly relic: { readonly id: string; readonly upgrades: number } | null;
  readonly costumes: CostumeBuild;
  readonly gear: GearBuild;
  readonly associate: AssociateChoice | null;
}

const GRADE: Readonly<Record<string, number>> = { R: 3, SR: 4, SSR: 5, UR: 6, LR: 7 };

/**
 * I dati del calcolatore di un eroe, dagli indici del modulo del gioco: solo i
 * suoi costumi (senza le descrizioni), le sue reliquie, i suoi legami, e di ogni
 * altro eroe quello che serve a sceglierlo come associato (nome, gradi possibili,
 * Attacco, Difesa e PS al massimo). La usano la pagina e i test.
 */
export function calculatorDataFor(input: {
  heroId: string;
  steps: HeroStatSteps | undefined;
  gear: GearIndex | undefined;
  costumes: CostumeIndex | undefined;
  relics: readonly { id: string; relic: { name: HeroLabel; image: boolean; stats: Readonly<Stats>; upgrades: readonly { stats: Readonly<Stats> }[] } }[];
  fates?: HeroFatesIndex;
  roster?: readonly { id: string; rarity: string; obtainedAs: string; name: string }[];
  heroStats?: Readonly<Record<string, { max: Readonly<Stats> }>>;
}): CalculatorData | null {
  const hero = input.costumes?.heroes[input.heroId];
  if (!input.steps || !input.gear || !input.costumes || !hero) return null;
  const ids = new Set([...hero.all.body, ...hero.all.weapon, ...hero.all.head]);
  const items = Object.fromEntries(
    [...ids].flatMap((id) => {
      const costume = input.costumes!.costumes[id];
      if (!costume) return [];
      const { description: _description, ...rest } = costume;
      return [[id, rest as Costume]];
    }),
  );
  const associates = input.roster
    ?.flatMap((entry) => {
      const max = input.heroStats?.[entry.id]?.max;
      const from = GRADE[entry.obtainedAs];
      const to = GRADE[entry.rarity];
      if (!max || from === undefined || to === undefined) return [];
      return [
        {
          id: entry.id,
          name: entry.name,
          grades: Array.from({ length: to - from + 1 }, (_, i) => from + i),
          max: { atk: max.atk ?? 0, def: max.def ?? 0, hp: max.hp ?? 0 },
        },
      ];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    heroId: input.heroId,
    steps: input.steps,
    gear: input.gear,
    costumes: { flatStat: input.costumes.flatStat, scale: input.costumes.scale, hero, items },
    relics: input.relics.map(({ id, relic }) => ({
      id,
      name: relic.name,
      image: relic.image,
      stats: relic.stats,
      upgrades: relic.upgrades.map((upgrade) => upgrade.stats),
    })),
    ...(input.fates
      ? { fates: { common: input.fates.common, effects: input.fates.effects, links: input.fates.heroes[input.heroId] ?? [] } }
      : {}),
    ...(associates ? { associates } : {}),
  };
}

/** l'indice dei costumi ridotto a questo eroe: le funzioni di gear.ts lo accettano cosi' */
export function costumeIndexOf(data: CalculatorData): CostumeIndex {
  return {
    flatStat: data.costumes.flatStat,
    scale: data.costumes.scale,
    sets: {},
    costumes: data.costumes.items,
    heroes: { [data.heroId]: data.costumes.hero },
  };
}

/** Tutto al massimo, coi costumi di partenza e l'equipaggiamento PS/Difesa: i numeri che la scheda mostrava. */
export function defaultBuild(data: CalculatorData): HeroBuild {
  const selection = maxSelection(data.steps);
  const relic = data.relics[0];
  return {
    level: selection.level,
    awaken: selection.awaken,
    superAwaken: selection.superAwaken,
    ultimateRank: 6,
    trueAwakening: [true, true],
    relic: relic ? { id: relic.id, upgrades: relic.upgrades.length } : null,
    costumes: startCostumes(costumeIndexOf(data), data.heroId),
    gear: presetBuild(data.gear, GEAR_PRESETS[0]!),
    associate: null,
  };
}

/**
 * La configurazione di partenza per un eroe che hai nel box (hero-box.ts): i tuoi
 * livello, Risvegli, Super risvegli, rango dell'ultimate, Vero risveglio e
 * Reliquia; equipaggiamento e costumi restano quelli di partenza (il box non li
 * dice). Vale finche' non cambi qualcosa nel calcolatore (10/10).
 */
export function buildFromBox(
  data: CalculatorData,
  entry: {
    level: number;
    awaken: number;
    superAwaken: number;
    ultimateRank: number;
    trueAwakening: readonly [boolean, boolean];
    relic: boolean;
  },
): HeroBuild {
  const base = defaultBuild(data);
  return parseBuild(
    {
      ...base,
      level: entry.level,
      awaken: entry.awaken,
      superAwaken: entry.superAwaken,
      ultimateRank: entry.ultimateRank,
      trueAwakening: [...entry.trueAwakening],
      relic: entry.relic ? base.relic : null,
    },
    data,
  );
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const num = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);

/** La configurazione come la permette il gioco, qualunque cosa arrivi dal browser. */
export function parseBuild(raw: unknown, data: CalculatorData): HeroBuild {
  const base = defaultBuild(data);
  if (!isRecord(raw)) return base;
  const selection = clampSelection(data.steps, {
    level: num(raw.level, base.level),
    awaken: num(raw.awaken, base.awaken),
    superAwaken: num(raw.superAwaken, base.superAwaken),
    relic: false,
    costumes: false,
  });
  let relic = base.relic;
  if (raw.relic === null) relic = null;
  else if (isRecord(raw.relic)) {
    const saved = raw.relic;
    const found = data.relics.find((r) => r.id === saved.id);
    const upgrades = found ? Math.min(found.upgrades.length, Math.max(0, Math.round(num(saved.upgrades, 0)))) : 0;
    relic = found ? { id: found.id, upgrades } : base.relic;
  }
  const gear: GearBuild = Array.isArray(raw.gear)
    ? data.gear.parts.map((part, i) => {
        const piece = (raw.gear as unknown[])[i];
        if (!isRecord(piece)) return null;
        return clampPiece(data.gear, part.part, {
          set: num(piece.set, 0),
          rating: num(piece.rating, 5),
          engraved: piece.engraved === true,
          awakening: num(piece.awakening, 0),
          plus: num(piece.plus, 0),
          roll: num(piece.roll, 0),
          options: Array.isArray(piece.options)
            ? piece.options.flatMap((o) => (isRecord(o) ? [{ id: num(o.id, 0), value: num(o.value, 0) }] : []))
            : [],
        });
      })
    : base.gear;
  const costumes = isRecord(raw.costumes)
    ? clampCostumes(
        costumeIndexOf(data),
        data.heroId,
        Object.fromEntries(
          COSTUME_KINDS.map((kind) => {
            const list = (raw.costumes as Record<string, unknown>)[kind];
            return [
              kind,
              Array.isArray(list)
                ? list.map((c) => (isRecord(c) && typeof c.id === "string" ? { id: c.id, step: num(c.step, 0) } : null))
                : [],
            ];
          }),
        ),
      )
    : base.costumes;
  let associate: AssociateChoice | null = null;
  if (isRecord(raw.associate) && data.associates) {
    const found = data.associates.find((a) => a.id === (raw.associate as Record<string, unknown>).hero && a.id !== data.heroId);
    if (found) {
      const grade = Math.round(num(raw.associate.grade, found.grades[found.grades.length - 1]!));
      associate = {
        hero: found.id,
        ultimateRank: Math.min(6, Math.max(1, Math.round(num(raw.associate.ultimateRank, 6)))),
        grade: found.grades.includes(grade) ? grade : found.grades[found.grades.length - 1]!,
        sameGear: raw.associate.sameGear !== false,
      };
    }
  }
  return {
    level: selection.level,
    awaken: selection.awaken,
    superAwaken: selection.superAwaken,
    ultimateRank: Math.min(6, Math.max(1, Math.round(num(raw.ultimateRank, base.ultimateRank)))),
    // fino al 27/09 notte tardi era un si'/no solo: vale per tutti e due
    trueAwakening: Array.isArray(raw.trueAwakening)
      ? [raw.trueAwakening[0] !== false, raw.trueAwakening[1] !== false]
      : [raw.trueAwakening !== false, raw.trueAwakening !== false],
    relic,
    costumes,
    gear,
    associate,
  };
}

export function relicStats(data: CalculatorData, relic: HeroBuild["relic"]): Stats {
  const found = relic ? data.relics.find((r) => r.id === relic.id) : undefined;
  const out: Stats = {};
  if (!found || !relic) return out;
  for (const part of [found.stats, ...found.upgrades.slice(0, relic.upgrades)]) {
    for (const [key, value] of Object.entries(part)) out[key] = (out[key] ?? 0) + value;
  }
  return out;
}

function plus(a: Readonly<Stats>, b: Readonly<Stats>): Stats {
  const out: Stats = { ...a };
  for (const [key, value] of Object.entries(b)) if (out[key] !== undefined) out[key] = out[key]! + value;
  return out;
}

export interface BuildResult {
  /** l'eroe coi costumi e la reliquia, senza equipaggiamento: come la scheda di prima */
  readonly without: Stats;
  /** con l'equipaggiamento: la schermata dell'eroe del gioco */
  readonly withGear: Stats;
  readonly gear: GearTotals;
  /** l'associato scelto: quanto aggiunge prima e dopo le percentuali, e il legame */
  readonly fate: {
    readonly associate: CalculatorAssociate;
    readonly percent: number;
    readonly before: Stats;
    readonly after: Stats;
    readonly link: ReturnType<typeof fateEffectAt>;
    readonly combined: boolean;
  } | null;
}

/**
 * Il conto completo. Senza equipaggiamento: base + livello + risvegli + costumi
 * + reliquia (SkinData.GetTotalStatWithoutPassive); con: in piu' la principale
 * dei pezzi e le passive dei pezzi (GetApplyPassiveStat). L'associato si conta a
 * parte, perche' vale solo in battaglia (battleWith).
 */
export function computeBuild(data: CalculatorData, build: HeroBuild): BuildResult {
  const hero = statsAt(data.steps, {
    level: build.level,
    awaken: build.awaken,
    superAwaken: build.superAwaken,
    relic: false,
    costumes: false,
  });
  const without = plus(plus(hero, relicStats(data, build.relic)), costumeTotals(costumeIndexOf(data), build.costumes));
  const gear = gearTotals(data.gear, build.gear);
  const withGear = applyGear(without, gear);

  let fate: BuildResult["fate"] = null;
  const associate = build.associate && data.associates?.find((a) => a.id === build.associate!.hero);
  if (build.associate && associate && data.fates) {
    const own = build.associate.sameGear ? applyGear(associate.max, gearTotals(data.gear, build.gear, false)) : associate.max;
    const link = data.fates.links.find(([other]) => other === associate.id);
    const effect = link ? fateEffectAt(data.fates, link, build.associate.grade) : null;
    const { before, after } = fateContribution(data.fates, own, build.associate.ultimateRank, effect);
    fate = {
      associate,
      percent: commonFatePercent(data.fates, build.associate.ultimateRank),
      before,
      after,
      link: effect,
      combined: link?.[2] === 1,
    };
  }
  return { without, withGear, gear, fate };
}

/**
 * Le statistiche in battaglia (TeamHeroData.GetTotalAllStat), nell'ordine del
 * gioco: all'eroe senza passive si aggiunge l'effetto comune dell'associato; poi
 * le passive per parola chiave, in ordine di id, ognuna sul totale che cresce
 * (EQUIPAGGIAMENTO.md § 4): prima l'equipaggiamento (2001xx), poi il titolo della
 * classe dell'account (5000xx), poi il legame (6001xx, piatto o in punti); fuori
 * dalle passive le costellazioni. Le passive dell'eroe restano fuori, come nel
 * resto della scheda.
 */
export function battleWith(
  result: BuildResult,
  tier: Pick<AccountPowerTier, "atk" | "def" | "hp"> | null,
  constellations: StatBag,
): Stats {
  const out = applyGear(plus(result.without, result.fate?.before ?? {}), result.gear);
  for (const stat of FLAT_STATS) {
    if (out[stat] !== undefined && tier) out[stat] = out[stat]! * (1 + (tier[stat] ?? 0) / 100);
  }
  for (const [key, value] of [...Object.entries(result.fate?.after ?? {}), ...Object.entries(constellations)]) {
    if (out[key] !== undefined && value !== undefined) out[key] = out[key]! + value;
  }
  return out;
}
