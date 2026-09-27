import type {
  Costume,
  CostumeIndex,
  CostumeKind,
  GearIndex,
  GearOption,
  GearSet,
  GearValue,
} from "./gear-types";
import type { HeroFate, HeroFateEffect, HeroFatesIndex } from "./hero-fates-types";
import type { HeroLabel } from "./types";

/**
 * I conti del calcolatore della scheda eroe: equipaggiamento, costumi,
 * associazione. Le regole le dice il codice del client (EQUIPAGGIAMENTO.md e
 * COSTUMI_ASSOCIAZIONI.md nella pipeline), e stanno qui e non nei componenti per
 * lo stesso motivo di statsAt: il calcolatore, l'import e i test devono contare
 * con le stesse funzioni.
 *
 * Tutti i numeri escono senza arrotondare: il gioco arrotonda solo alla fine,
 * Attacco, Difesa e PS per eccesso (`FPMath.CeilToInt`), e lo fa `shownValue`.
 */

export const FLAT_STATS = ["atk", "def", "hp"] as const;
export type FlatStat = (typeof FLAT_STATS)[number];
export const COSTUME_KINDS: readonly CostumeKind[] = ["body", "weapon", "head"];

type Stats = Record<string, number>;

function add(target: Stats, key: string, value: number) {
  target[key] = (target[key] ?? 0) + value;
}

/* ================================================================== pezzi == */

/** Un pezzo indossato, come lo descrive il gioco (WeaponData). */
export interface GearPiece {
  /** il set (`set_id`) */
  readonly set: number;
  /** la rarita' del pezzo, 1-5 (C-SSR): l'UR e' un SSR inciso */
  readonly rating: number;
  /**
   * inciso per questo eroe (Incisione, da Merlin): vale solo a +5 con cinque
   * risvegli, e per l'eroe il pezzo prende i valori della rarita' sopra
   */
  readonly engraved: boolean;
  /** i risvegli del pezzo, 0-5: le stelle dell'icona */
  readonly awakening: number;
  /** il «+N», 0-5: i miglioramenti fatti dopo l'ultimo risveglio */
  readonly plus: number;
  /** il tiro della statistica principale, fra il minimo e il massimo della rarita' */
  readonly roll: number;
  /** gli effetti bonus: uno per risveglio */
  readonly options: readonly GearOptionRoll[];
}

export interface GearOptionRoll {
  /** l'effetto (DB_weapon_option.id) */
  readonly id: number;
  /** in punti percentuali, a passi di 0,1 */
  readonly value: number;
}

/** I sei posti, uno per parte: la posizione e' la parte meno uno. */
export type GearBuild = readonly (GearPiece | null)[];

export function gearValue(index: GearIndex, part: number, rating: number): GearValue {
  const value = index.values[String(part)]?.[String(rating)];
  if (!value) throw new Error(`equipaggiamento: nessun valore per la parte ${part} a rarita' ${rating}`);
  return value;
}

export function optionsOf(index: GearIndex, part: number): GearOption[] {
  const group = index.parts.find((p) => p.part === part)?.group;
  return index.options.filter((option) => option.group === group);
}

/** l'effetto bonus della statistica principale in percentuale (Attacco% sul Braccialetto) */
export function mainOption(index: GearIndex, part: number): GearOption {
  const stat = index.parts.find((p) => p.part === part)?.stat;
  const option = optionsOf(index, part).find((o) => o.stat === stat && o.mode === "percent");
  if (!option) throw new Error(`equipaggiamento: la parte ${part} non ha l'effetto della sua statistica`);
  return option;
}

/** i miglioramenti in tutto, 0-30 (WeaponData.GetTotalUpgradeValue) */
export function totalUpgrades(index: GearIndex, piece: GearPiece): number {
  return piece.awakening * index.rules.upgradesPerAwakening + piece.plus;
}

/** Si incide solo un pezzo a +5 coi cinque risvegli, e l'SSR inciso e' l'ultimo gradino (UR). */
export function canEngrave(index: GearIndex, piece: GearPiece): boolean {
  return (
    piece.awakening === index.rules.awakenings &&
    piece.plus === index.rules.upgradesPerAwakening &&
    piece.rating < 6
  );
}

/** la rarita' mostrata sull'icona: +1 se inciso (WeaponData.get_Rating) */
export function shownRating(piece: GearPiece): number {
  return piece.engraved ? piece.rating + 1 : piece.rating;
}

/**
 * La statistica principale di un pezzo (WeaponData.GetStatusValue): tiro +
 * miglioramenti x il loro passo. Inciso, per il suo eroe, prende la riga della
 * rarita' sopra alla stessa posizione fra minimo e massimo (FPMath.Lerp), col suo
 * passo. `engraving` false e' lo stesso pezzo addosso a un altro eroe.
 */
export function pieceMain(index: GearIndex, part: number, piece: GearPiece, engraving = true): number {
  const row = gearValue(index, part, piece.rating);
  const upgrades = totalUpgrades(index, piece);
  if (piece.engraved && engraving && canEngrave(index, piece)) {
    const up = gearValue(index, part, piece.rating + 1);
    const ratio = row.max === row.min ? 1 : (piece.roll - row.min) / (row.max - row.min);
    return up.min + (up.max - up.min) * ratio + upgrades * up.step;
  }
  return piece.roll + upgrades * row.step;
}

/**
 * Un pezzo come lo permette il gioco: set e rarita' che esistono, risvegli e
 * «+N» fra 0 e 5, il tiro intero fra minimo e massimo, gli effetti bonus del
 * gruppo della parte e non piu' dei risvegli, coi valori a passi di 0,1, e
 * l'incisione solo se il pezzo e' al massimo. Serve a quello che arriva dal
 * browser (una configurazione salvata con dati vecchi) e dai comandi.
 */
export function clampPiece(index: GearIndex, part: number, piece: GearPiece): GearPiece | null {
  if (!index.sets.some((s) => s.id === piece.set)) return null;
  const ratings = index.rules.obtainableRatings;
  const rating = ratings.includes(piece.rating) ? piece.rating : ratings[ratings.length - 1]!;
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(value) ? value : max));
  const awakening = Math.round(clamp(piece.awakening, 0, index.rules.awakenings));
  const plus = Math.round(clamp(piece.plus, 0, index.rules.upgradesPerAwakening));
  const row = gearValue(index, part, rating);
  const roll = Math.round(clamp(piece.roll, row.min, row.max));
  const allowed = optionsOf(index, part);
  const step = index.rules.optionStep;
  const options = piece.options.slice(0, awakening).flatMap((roll) => {
    const option = allowed.find((o) => o.id === roll.id);
    if (!option) return [];
    const snapped = Math.round(clamp(roll.value, option.min, option.max) / step) * step;
    return [{ id: option.id, value: Math.round(snapped * 1e4) / 1e4 }];
  });
  const next = { set: piece.set, rating, engraved: false, awakening, plus, roll, options };
  return { ...next, engraved: piece.engraved && canEngrave(index, next) };
}

/** Un pezzo al massimo: SSR inciso (UR), +5 coi cinque risvegli, tiro massimo, cinque volte l'effetto della sua statistica al massimo. */
export function maxPiece(index: GearIndex, part: number, set: number): GearPiece {
  const rating = index.rules.obtainableRatings[index.rules.obtainableRatings.length - 1]!;
  const option = mainOption(index, part);
  return {
    set,
    rating,
    engraved: true,
    awakening: index.rules.awakenings,
    plus: index.rules.upgradesPerAwakening,
    roll: gearValue(index, part, rating).max,
    options: Array.from({ length: index.rules.awakenings }, () => ({ id: option.id, value: option.max })),
  };
}

/**
 * I tre set piu' usati, come li chiama chi gioca: un set da 4 e uno da 2. Il
 * set da 4 va su Braccialetto, Collana, Cintura e Anello, quello da 2 su
 * Orecchini e Runa, come nell'equipaggiamento preimpostato dell'Arena del Destino
 * (DB_pvp_destiny_weapon_group); dove stanno non cambia i numeri, conta solo
 * quanti pezzi per set. PS/Difesa e' anche il «massimo con equipaggiamento» che
 * usava 7dshub (maxGeared): lo stesso numero per costruzione.
 */
export const GEAR_PRESETS: readonly { key: string; name: HeroLabel; four: number; two: number }[] = [
  { key: "ps-difesa", name: { it: "PS/Difesa", en: "HP/Defense" }, four: 2, two: 7 },
  { key: "attacco-difesa", name: { it: "Attacco/Difesa", en: "Attack/Defense" }, four: 1, two: 7 },
  { key: "attacco-critico", name: { it: "Attacco/Critico", en: "Attack/Crit" }, four: 1, two: 8 },
];
export const FOUR_SET_PARTS = [1, 2, 3, 4] as const;

export function presetBuild(index: GearIndex, preset: { four: number; two: number }): GearBuild {
  return index.parts.map((p) =>
    maxPiece(index, p.part, (FOUR_SET_PARTS as readonly number[]).includes(p.part) ? preset.four : preset.two),
  );
}

/** quale dei set pronti e' la configurazione, se lo e' esattamente */
export function presetOf(index: GearIndex, build: GearBuild): string | null {
  const text = JSON.stringify(build);
  return GEAR_PRESETS.find((preset) => JSON.stringify(presetBuild(index, preset)) === text)?.key ?? null;
}

/* ============================================================ i totali == */

export interface GearTotals {
  /** la statistica principale dei pezzi */
  readonly flat: Readonly<Record<FlatStat, number>>;
  /** le percentuali che moltiplicano Attacco, Difesa e PS (set ed effetti della stessa parola chiave si sommano) */
  readonly percent: Readonly<Stats>;
  /** i punti aggiunti alle altre nove statistiche */
  readonly points: Readonly<Stats>;
  /** ogni set indossato: quanti pezzi, e quante volte vale la sua passiva */
  readonly sets: readonly { readonly set: GearSet; readonly count: number; readonly times: number }[];
}

/**
 * I totali dell'equipaggiamento (SkinData.GetWeaponBasicStat e
 * GetWeaponPassiveList): la principale dei pezzi per statistica, e le passive
 * sommate per parola chiave. Un set conta `pezzi / pezzi del set` volte, per
 * difetto, qualunque sia la rarita' dei pezzi (UpdateSetWeaponOption): 6 pezzi di
 * Muro di ferro sono Difesa +60%.
 */
export function gearTotals(index: GearIndex, build: GearBuild, engraving = true): GearTotals {
  const flat: Record<FlatStat, number> = { atk: 0, def: 0, hp: 0 };
  const percent: Stats = {};
  const points: Stats = {};
  const counts = new Map<number, number>();
  const passive = (stat: string, mode: string, value: number) => {
    if (mode === "percent") add(percent, stat, value);
    else if (mode === "points") add(points, stat, value);
    else add(flat as Stats, stat, value);
  };
  build.forEach((piece, i) => {
    if (!piece) return;
    const part = index.parts[i];
    if (!part) return;
    flat[part.stat] += pieceMain(index, part.part, piece, engraving);
    for (const roll of piece.options.slice(0, piece.awakening)) {
      const option = index.options.find((o) => o.id === roll.id);
      if (option) passive(option.stat, option.mode, roll.value);
    }
    counts.set(piece.set, (counts.get(piece.set) ?? 0) + 1);
  });
  const sets = [...counts].flatMap(([id, count]) => {
    const set = index.sets.find((s) => s.id === id);
    if (!set) return [];
    const times = Math.floor(count / set.pieces);
    for (let n = 0; n < times; n++) passive(set.stat, set.mode, set.value);
    return [{ set, count, times }];
  });
  return { flat, percent, points, sets };
}

/**
 * Le statistiche con l'equipaggiamento (GetApplyPassiveStat con le sole passive
 * dei pezzi): (statistica + principale dei pezzi) x (1 + percentuali / 100) per
 * Attacco, Difesa e PS; punti aggiunti per le altre. `base` e' l'eroe senza
 * equipaggiamento e senza passive, coi costumi e la reliquia.
 */
export function applyGear(base: Readonly<Stats>, totals: GearTotals): Stats {
  const out: Stats = { ...base };
  for (const stat of FLAT_STATS) {
    if (out[stat] === undefined) continue;
    out[stat] = (out[stat]! + totals.flat[stat]) * (1 + (totals.percent[stat] ?? 0) / 100);
  }
  for (const [stat, value] of Object.entries(totals.points)) {
    if (out[stat] !== undefined) out[stat] = out[stat]! + value;
  }
  return out;
}

/** Il numero come lo mostra il gioco: Attacco, Difesa e PS per eccesso, le percentuali a due decimali. */
export function shownValue(stat: string, value: number): number {
  // una coda di virgola mobile (16726.500000001) non deve salire di uno
  const clean = Math.round(value * 1e6) / 1e6;
  return (FLAT_STATS as readonly string[]).includes(stat) ? Math.ceil(clean) : Math.round(clean * 100) / 100;
}

/* =============================================================== costumi == */

/**
 * Il potenziamento di un costume come un passo solo, da 0 (appena ottenuto) al
 * massimo: la rarita' sale da quella dell'oggetto fino a UR (LR per i LR), e
 * dentro ogni rarita' il livello da 0 all'ultimo. Un costume R ha 181 passi
 * (R 0-39, SR 0-49, SSR 0-59, UR 0-30), un UR 31, un LR 31.
 */
function costumePath(index: CostumeIndex, costume: Costume): readonly (readonly [number, number])[] {
  const scale = index.scale[costume.kind];
  const last = costume.rarity >= 7 ? 7 : 6;
  const first = Math.min(costume.rarity, last);
  const out: [number, number][] = [];
  for (let rarity = first; rarity <= last; rarity++) out.push([rarity, scale[String(rarity)]?.[2] ?? 0]);
  return out;
}

export function costumeMaxStep(index: CostumeIndex, costume: Costume): number {
  return costumePath(index, costume).reduce((sum, [, lastLevel]) => sum + lastLevel + 1, 0) - 1;
}

/** rarita' e livello di un passo */
export function costumeLevel(index: CostumeIndex, costume: Costume, step: number): { rarity: number; level: number } {
  let rest = Math.max(0, Math.round(step));
  const path = costumePath(index, costume);
  for (const [rarity, lastLevel] of path) {
    if (rest <= lastLevel) return { rarity, level: rest };
    rest -= lastLevel + 1;
  }
  const [rarity, lastLevel] = path[path.length - 1]!;
  return { rarity, level: lastLevel };
}

/** la statistica piatta del costume a un passo (DB_costume_stat[tipo][rarita'][livello]) */
export function costumeFlat(index: CostumeIndex, costume: Costume, step: number): number {
  const { rarity, level } = costumeLevel(index, costume, step);
  const [start, perLevel] = index.scale[costume.kind][String(rarity)] ?? [0, 0];
  return start + perLevel * level;
}

export interface CostumeChoice {
  readonly id: string;
  /** il passo del potenziamento, 0 .. costumeMaxStep */
  readonly step: number;
}

/** i costumi registrati, per tipo: al piu' tanti quanti i posti */
export type CostumeBuild = Readonly<Record<CostumeKind, readonly (CostumeChoice | null)[]>>;

/** i cinque di partenza, al massimo: quelli delle statistiche massime */
export function startCostumes(index: CostumeIndex, heroId: string): CostumeBuild {
  const hero = index.heroes[heroId];
  const out = {} as Record<CostumeKind, (CostumeChoice | null)[]>;
  for (const kind of COSTUME_KINDS) {
    const slots = hero?.slots[kind] ?? 0;
    const ids = hero?.start[kind] ?? [];
    out[kind] = Array.from({ length: slots }, (_, i) => {
      const id = ids[i];
      const costume = id ? index.costumes[id] : undefined;
      return id && costume ? { id, step: costumeMaxStep(index, costume) } : null;
    });
  }
  return out;
}

/** quello che danno i costumi registrati: la piatta del tipo, e le percentuali per intero */
export function costumeTotals(index: CostumeIndex, build: CostumeBuild): Stats {
  const out: Stats = {};
  for (const kind of COSTUME_KINDS) {
    for (const choice of build[kind] ?? []) {
      const costume = choice ? index.costumes[choice.id] : undefined;
      if (!choice || !costume) continue;
      add(out, index.flatStat[kind], costumeFlat(index, costume, choice.step));
      for (const [stat, value] of Object.entries(costume.percents)) add(out, stat, value);
    }
  }
  return out;
}

/**
 * I costumi scelti come li permette il gioco: tanti quanti i posti, del tipo
 * giusto, dell'eroe, nessuno due volte, col passo dentro la scala.
 */
export function clampCostumes(index: CostumeIndex, heroId: string, build: Partial<CostumeBuild>): CostumeBuild {
  const hero = index.heroes[heroId];
  const out = {} as Record<CostumeKind, (CostumeChoice | null)[]>;
  for (const kind of COSTUME_KINDS) {
    const seen = new Set<string>();
    const allowed = new Set(hero?.all[kind] ?? []);
    out[kind] = Array.from({ length: hero?.slots[kind] ?? 0 }, (_, i) => {
      const choice = build[kind]?.[i];
      const costume = choice ? index.costumes[choice.id] : undefined;
      if (!choice || !costume || !allowed.has(choice.id) || seen.has(choice.id)) return null;
      seen.add(choice.id);
      const step = Math.min(costumeMaxStep(index, costume), Math.max(0, Math.round(Number(choice.step) || 0)));
      return { id: choice.id, step };
    });
  }
  return out;
}

/* ========================================================== associazioni == */

/** gli eroi a cui questo eroe si associa: i principali che lo hanno fra i loro legami */
export function associatedTo(fates: HeroFatesIndex, heroId: string): { main: string; fate: HeroFate }[] {
  return Object.entries(fates.heroes).flatMap(([main, links]) =>
    links.filter(([associate]) => associate === heroId).map((fate) => ({ main, fate })),
  );
}

/** la percentuale dell'effetto comune con la Mossa finale dell'associato a quel rango: 5-10% */
export function commonFatePercent(fates: Pick<HeroFatesIndex, "common">, ultimateRank: number): number {
  const rank = Math.min(6, Math.max(1, Math.round(ultimateRank)));
  return fates.common.base + fates.common.perLevel * (rank - 1);
}

/** l'effetto del legame col grado dell'associato (3 R ... 7 LR), o null se il grado non c'e' */
export function fateEffectAt(
  fates: Pick<HeroFatesIndex, "effects">,
  fate: HeroFate,
  grade: number,
): { effect: HeroFateEffect; value: number } | null {
  const effect = fates.effects[grade >= 7 && fate[3] !== undefined ? fate[3] : fate[1]];
  if (!effect || grade < 3) return null;
  return { effect, value: effect.grades[Math.min(grade, 6) - 3]! };
}

/**
 * Quanto aggiunge l'associazione alle statistiche in battaglia del principale
 * (TeamHeroData.CalcFateStat e SetFateUnit): l'effetto comune, una percentuale di
 * Attacco, Difesa e PS dell'associato, da sommare PRIMA delle percentuali del
 * principale; e l'effetto del legame, piatto o in punti, dopo.
 */
export function fateContribution(
  fates: Pick<HeroFatesIndex, "common">,
  associateStats: Readonly<Stats>,
  ultimateRank: number,
  link: { effect: HeroFateEffect; value: number } | null,
): { before: Stats; after: Stats } {
  const share = commonFatePercent(fates, ultimateRank) / 100;
  const before: Stats = {};
  for (const stat of FLAT_STATS) before[stat] = (associateStats[stat] ?? 0) * share;
  const after: Stats = {};
  if (link && link.effect.mode !== "percent") after[link.effect.stat] = link.value;
  return { before, after };
}
