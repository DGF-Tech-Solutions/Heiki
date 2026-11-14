/**
 * Il simulatore delle statistiche al primo turno: la traduzione di simula.py
 * (_7dsgc/simulazione_11-11/simulatore), funzione per funzione, con gli stessi
 * nomi tradotti in inglese e lo stesso ordine. Il contratto e il perche' stanno in
 * simulation-types.ts; le scelte di simula.py (riduzioni sempre valide, ordine
 * del dizionario, nessuna posa al primo turno...) sono in NOTE.md della pipeline.
 *
 * Il codice non sa niente delle singole passive: esegue i nodi delle regole.
 * Dove Python e JavaScript farebbero numeri diversi si rifa' Python:
 *   - round(x, 5) arrotonda a pari merito alla cifra pari (toFixed al piu' grande);
 *   - sum() di Python 3.12 somma i float con la compensazione di Neumaier;
 *   - .get(colonna, vuoto) e `x or y` hanno la verita' di Python (0, "", [] falsi);
 *   - l'ordine conta in tre dizionari (le parole del passo 3, i buff del passo 5,
 *     le parole delle regole): qui sono Map e liste, mai oggetti con chiavi intere.
 * Niente DOM e niente Node: gira nel browser.
 */

import type {
  SimContent,
  SimData,
  SimHeroInput,
  SimHeroResult,
  SimInput,
  SimJson,
  SimNode,
  SimOrigin,
  SimResult,
  SimStat,
  SimTraceEntry,
} from "./simulation-types";
import { SIM_STATS } from "./simulation-types";

type Stats = Record<SimStat, number>;
type Camp = "allies" | "enemies";

const GROUPS: Record<string, readonly SimStat[]> = {
  attacco: ["ATK", "FIXED_ATK_PER", "CRIT_PER", "CRIT_ATK_PER"],
  difesa: ["DEF", "FIXED_DEF_PER", "CRIT_RES_PER", "CRIT_DEF_PER"],
  ps: ["MAX_HP", "HP_STEAL_PER", "HP_REGEN_PER", "HP_RECOVERY_PER"],
  tutte: SIM_STATS,
  atk_def_hp: ["ATK", "DEF", "MAX_HP"],
};
// ÇÄÆÔËÝÛàÙ(TYPE[]) 0x3ec1f8c: ATK, DEF, MAX_HP moltiplicano, le altre sommano
const MULTIPLY = new Set<SimStat>(["ATK", "DEF", "MAX_HP"]);
// BuffManager.BuffType; la colonna buff_type del buff e' il nome in minuscolo
const BUFF_TYPE = new Map<string, number>([
  ["buff", 0], ["debuff", 1], ["defence", 2], ["counter", 3], ["eternal_buff", 4], ["heal", 5],
  ["eternal_debuff", 7], ["eternal_turn_buff", 8], ["eternal_turn_debuff", 9],
]);
const CATEGORY = new Map<string, number>([
  ["Normal", 0], ["SevenSin", 1], ["Collabo_Slime", 3], ["Collabo_Giant", 4], ["Collabo_KOF", 5],
  ["Collabo_Nst", 6], ["Collabo_Rezero", 7], ["Collabo_spy", 8], ["Collabo_zen", 9], ["Collabo_meta", 10],
  ["Collabo_Mit", 11], ["Collabo_Test", 12], ["Collabo_Eva", 13], ["Collabo_Lol", 14], ["Collabo_kzm", 15],
  ["Collabo_ffx", 16], ["Collabo_uiop", 17], ["Collabo_sat", 18], ["Original", 20], ["Ragnarok", 21],
  ["Fkoa", 22],
]);
// list_array_apply_contents (0x488B168): i valori che passano per contenuto
const CONTENTS: Record<SimContent, ReadonlySet<number>> = {
  pve: new Set([1, 2, 41]),
  pvp: new Set([1, 3]),
  destroy: new Set([1, 4, 41]),
  nest: new Set([1, 2, 26]),
};
// CheckForeverDisablePassive 0x474C1E8-0x474C3DC: per queste tre l'attributo puo' venire da (int)Sub
const ATTRIBUTE_FROM_SUB = new Set(["pass_atk_all_inc_add_per", "pass_def_all_inc_add_per", "pass_hp_all_inc_add_per"]);
const RANK_FROM_BENCH = "pass_exist_one_buff_kind_target_or_array_apply_hero_job_group_atk_all_inc_per"; // 0x43E
// l'ordine dei momenti prima del primo ricalcolo (buff_primo_turno par. 1)
const MOMENTS = ["inizio_battaglia", "dopo_inizio", "primo_turno", "inizio_turno", "dopo_pescata"] as const;
const CAP_KEYWORD = "tetto 20%";
// ÌÒØÄØÔÙÆÞ 0x488e3a4, il nome offuscato con cui le regole dicono «scegli secondo (int)Sub»: in escape,
// perche' un editor non cambi i caratteri
const SELECT_BY_SUB = "\u00cc\u00d2\u00d8\u00c4\u00d8\u00d4\u00d9\u00c6\u00de";

/* ------------------------------------------------------- Python in piccolo -- */

/** La verita' di Python: 0, "", [], {} e null sono falsi. */
function truthy(x: SimJson | undefined): boolean {
  if (x === null || x === undefined) return false;
  if (typeof x === "boolean") return x;
  if (typeof x === "number") return x !== 0;
  if (typeof x === "string") return x.length > 0;
  if (Array.isArray(x)) return x.length > 0;
  return Object.keys(x).length > 0;
}

/** Il valore come chiave di un set di Python: True == 1, 1 == 1.0, "1" != 1. */
function key(x: SimJson | undefined): SimJson | undefined {
  return typeof x === "boolean" ? Number(x) : x;
}

function pyEq(a: SimJson | undefined, b: SimJson | undefined): boolean {
  return key(a) === key(b) || (a == null && b == null);
}

/** dict.get(k, default): il default solo se la chiave manca (un null resta null). */
function get(node: SimNode, k: string, fallback: SimJson = null): SimJson {
  return Object.prototype.hasOwnProperty.call(node, k) ? (node[k] as SimJson) : fallback;
}

/** `dict.get(k) or fallback` */
function getOr(node: SimNode, k: string, fallback: SimJson): SimJson {
  const v = get(node, k);
  return truthy(v) ? v : fallback;
}

function has(node: SimNode, k: string): boolean {
  return Object.prototype.hasOwnProperty.call(node, k);
}

function node(x: SimJson | undefined, where: string): SimNode {
  if (x === null || x === undefined || typeof x !== "object" || Array.isArray(x)) {
    throw new Error(`simulazione: atteso un nodo in ${where}, trovato ${JSON.stringify(x)}`);
  }
  return x as SimNode;
}

function list(x: SimJson | undefined): readonly SimJson[] {
  return Array.isArray(x) ? (x as readonly SimJson[]) : [];
}

/** float(x) di Python */
function pyFloat(x: SimJson | undefined): number {
  if (typeof x === "number") return x;
  if (typeof x === "boolean") return Number(x);
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x))) return Number(x);
  throw new Error(`simulazione: float(${JSON.stringify(x)})`);
}

/** int(x) di Python: tronca i numeri, legge le stringhe di cifre */
function pyInt(x: SimJson | undefined): number {
  if (typeof x === "number") return Math.trunc(x);
  if (typeof x === "boolean") return Number(x);
  if (typeof x === "string" && /^\s*[+-]?\d+\s*$/.test(x)) return Number.parseInt(x, 10);
  throw new Error(`simulazione: int(${JSON.stringify(x)})`);
}

/**
 * round(x, 5) di Python (FPReal, 5 decimali): il decimale piu' vicino, a pari merito
 * la cifra pari. toFixed da' lo stesso decimale tranne nei pari merito esatti, dove
 * sceglie il piu' grande; un pari merito esatto a 5 decimali c'e' solo se x*64 e' un
 * intero dispari (x = j/64: x*1e5 = j*1562,5), e x*64 e' esatto in binario.
 */
export function round5(x: number): number {
  if (!Number.isFinite(x)) return x;
  const m = x * 64;
  if (Number.isInteger(m) && Math.abs(m % 2) === 1) {
    const low = Math.floor(x * 100000); // esatto: j*3125/2 sta nei 53 bit
    return (low % 2 === 0 ? low : low + 1) / 100000;
  }
  return Number(x.toFixed(5));
}

/**
 * sum() di Python 3.12 su float: compensazione di Neumaier (bltinmodule.c). Un int
 * in mezzo ai float Python lo somma senza compensazione: qui non si distingue, ma
 * nelle regole nessuna somma mette un int diverso da 0 accanto a un float non
 * intero (analisi_somme.py della pipeline), quindi il risultato e' lo stesso.
 */
export function pySum(values: readonly number[]): number {
  let total = 0;
  let c = 0;
  for (const x of values) {
    const t = total + x;
    c += Math.abs(total) >= Math.abs(x) ? total - t + x : x - t + total;
    total = t;
  }
  return c !== 0 && Number.isFinite(c) ? total + c : total;
}

function minOf(values: readonly number[]): number {
  if (values.length === 0) throw new Error("simulazione: min() di niente");
  return values.reduce((a, b) => (b < a ? b : a));
}

function maxOf(values: readonly number[]): number {
  if (values.length === 0) throw new Error("simulazione: max() di niente");
  return values.reduce((a, b) => (b > a ? b : a));
}

/** int("0x3ee9da0 ...".split()[0], 16): l'indirizzo che ordina le voci */
function address(v: SimNode): number {
  const word = String(get(v, "ordine", "")).trim().split(/\s+/)[0] ?? "";
  const n = Number.parseInt(word, 16);
  if (Number.isNaN(n)) throw new Error(`simulazione: ordine illeggibile ${word}`);
  return n;
}

/* ------------------------------------------------------------ i dati -- */

interface Voce {
  readonly node: SimNode;
  readonly keyword: string;
  /** il passo per la traccia: un numero in RefreshStatus */
  readonly step: number | "buff" | "cariche";
}

interface Prepared {
  readonly passives: Map<number, SimNode>;
  readonly exclusives: Map<number, SimNode>;
  readonly heroes: Map<number, SimNode>;
  readonly skins: Map<SimJson, SimNode>;
  readonly skinsByHero: Map<SimJson, SimNode[]>;
  readonly relicsByHero: Map<SimJson, SimNode[]>;
  readonly buffs: Map<number, SimNode>;
  readonly words: Map<string, readonly SimNode[]>;
  readonly buffWords: Map<string, readonly SimNode[]>;
  /** passo 3: le voci di ogni parola, per indirizzo */
  readonly step3: Map<string, Voce[]>;
  /** passi 2, 4, 6, 7, 8: voci_del_passo, gia' ordinate (ordinamento stabile come sorted) */
  readonly steps: Map<number, Voce[]>;
  readonly giveBuff: readonly SimNode[];
  readonly charges: readonly SimNode[];
  readonly removeBuff: readonly SimNode[];
}

const PREPARED = new WeakMap<SimData, Prepared>();

function byId(rows: readonly SimNode[], col: string): Map<number, SimNode> {
  const out = new Map<number, SimNode>();
  for (const r of rows) out.set(key(get(r, col)) as number, r);
  return out;
}

function grouped(rows: readonly SimNode[], col: string, many: boolean): Map<SimJson, SimNode[]> {
  const out = new Map<SimJson, SimNode[]>();
  for (const r of rows) {
    for (const k of many ? list(getOr(r, col, [])) : [get(r, col)]) {
      const kk = key(k) as SimJson;
      const l = out.get(kk);
      if (l) l.push(r);
      else out.set(kk, [r]);
    }
  }
  return out;
}

/** voci_del_passo: le parole, poi (passi 4, 7, 8) i buff, ordinate per indirizzo */
function sequence(data: SimData, step: number): Voce[] {
  const out: { voce: Voce; at: number }[] = [];
  for (const [kw, voci] of data.rules.words) {
    for (const v of voci) if (pyEq(get(v, "passo"), step)) out.push({ voce: { node: v, keyword: kw, step }, at: address(v) });
  }
  if (step === 4 || step === 7 || step === 8) {
    for (const [kw, voci] of data.rules.buffWords) {
      for (const v of voci) if (pyEq(get(v, "passo"), step)) out.push({ voce: { node: v, keyword: kw, step }, at: address(v) });
    }
  }
  return out.sort((a, b) => a.at - b.at).map((x) => x.voce);
}

function prepare(data: SimData): Prepared {
  const known = PREPARED.get(data);
  if (known) return known;
  const step3 = new Map<string, Voce[]>();
  for (const [kw, voci] of data.rules.words) {
    const three = voci
      .filter((v) => pyEq(get(v, "passo"), 3))
      .map((v) => ({ voce: { node: v, keyword: kw, step: 3 } as Voce, at: address(v) }))
      .sort((a, b) => a.at - b.at)
      .map((x) => x.voce);
    step3.set(kw, three);
  }
  const prepared: Prepared = {
    passives: byId(data.passives, "id"),
    exclusives: byId(data.exclusives, "hero_id"),
    heroes: byId(data.heroes, "id"),
    skins: new Map(data.skins.map((s): [SimJson, SimNode] => [key(get(s, "id")) as SimJson, s])),
    skinsByHero: grouped(data.skins, "matching_hero_id", false),
    relicsByHero: grouped(data.relics, "list_array_matching_hero_id", true),
    buffs: byId(data.buffs, "id"),
    words: new Map(data.rules.words),
    buffWords: new Map(data.rules.buffWords),
    step3,
    steps: new Map([2, 4, 6, 7, 8].map((s): [number, Voce[]] => [s, sequence(data, s)])),
    giveBuff: data.rules.giveBuff,
    charges: data.rules.charges,
    removeBuff: data.rules.removeBuff,
  };
  PREPARED.set(data, prepared);
  return prepared;
}

/* ------------------------------------------------ l'eroe e le sue passive -- */

interface Source {
  readonly type: number;
  readonly id: number;
  readonly origin: SimOrigin;
}

interface Passive {
  id: number;
  row: SimNode;
  keyword: string;
  type: number;
  origin: SimOrigin | null;
  target: SimJson;
  owner: string;
  giver: string;
  copy: boolean;
  off: boolean;
  disabled: boolean;
  offByData: boolean;
  orig: number;
  sub: number;
  third: number;
  extra: number[];
  charges: number;
  max: number;
  counters?: Map<string, number>;
  /** la presa «nessuna»: una PassiveData finta, solo per la traccia */
  fake?: boolean;
}

interface Buff {
  id: number;
  keyword: string;
  type: number;
  from: string | null;
  value: number;
  sub: number;
  overlap: number;
  limit: number;
  target: SimJson;
  /** la passiva che l'ha dato e la sua origine: solo per la traccia */
  passive: number | null;
  origin: SimOrigin | null;
}

interface Unit {
  guid: string;
  camp: Camp;
  slot: number;
  id: number | null;
  bench: boolean;
  alive: boolean;
  kind: SimJson;
  subKind: SimJson;
  job: readonly SimJson[];
  heroGroup: SimJson;
  category: number;
  attribute: SimJson;
  female: boolean;
  rank: number;
  orb: number;
  fullBar: boolean;
  power: number;
  sources: Source[];
  stat0: Stats;
  passives: Passive[];
  buffs: Buff[];
  off: Set<number>;
  ingame: Stats | null;
}

interface State {
  data: Prepared;
  content: SimContent;
  units: Unit[];
  register: Map<string, Map<string, number>>;
  target: Unit | null;
}

function zeroStats(from?: Partial<Record<SimStat, number>>): Stats {
  const out = {} as Stats;
  for (const s of SIM_STATS) out[s] = pyFloat(from?.[s] ?? 0);
  return out;
}

/** scegli_skin: forma LR = la skin legend (rating 7); altrimenti la skin di base */
function chooseSkin(hero: SimHeroInput, hid: number, data: Prepared): SimNode {
  if (hero.lr) {
    for (const s of data.skinsByHero.get(hid) ?? []) if (pyEq(get(s, "rating"), 7)) return s;
    throw new Error(`${hid}: nessuna skin legend`);
  }
  const base = get(data.heroes.get(hid)!, "base_skin");
  const skin = data.skins.get(key(base) as SimJson);
  if (skin && truthy(skin)) return skin;
  return (data.skinsByHero.get(hid) ?? [{}])[0] ?? {};
}

/** passive_dell_eroe: TeamHeroData.GetPassiveList, con l'origine per la traccia */
function heroSources(hero: SimHeroInput, hid: number, skin: SimNode, data: Prepared): Source[] {
  const row = data.exclusives.get(hid) ?? {};
  const legend = pyEq(get(skin, "rating"), 7);
  const level = hero.unique ?? 1;
  const out: { type: number; id: SimJson; origin: SimOrigin }[] = [];
  if (level >= 1) {
    const ids = [get(row, "exclusive_passive_id_1", 0), get(row, "exclusive_passive_id_2", 0), get(row, "exclusive_passive_id_3", 0)];
    const uid = legend ? ids[1] : level <= 3 ? ids[level - 1] : 0;
    if (truthy(uid)) out.push({ type: 8, id: uid ?? null, origin: "unique" });
  }
  for (const [col, type, origin] of [
    ["taboo_exclusive_passive_id", 9, "commandment"],
    ["grace_exclusive_passive_id", 12, "grace"],
    ["solidarity_exclusive_passive_id", 17, "unity"],
  ] as const) {
    if (pyFloat(get(row, col, 0)) >= 1) out.push({ type, id: get(row, col), origin });
  }
  const ids = [...list(getOr(row, "list_array_ability_exclusive_passive_id", [])), ...list(getOr(row, "list_array_attribute_exclusive_passive_id", []))];
  const rules = list(getOr(row, "list_array_attribute_exclusive_passive_rule", []));
  if (ids.length > 0 && ids.length === rules.length) {
    ids.forEach((pid, i) => {
      const rule = key(rules[i]);
      if (rule === 1) out.push({ type: 15, id: pid, origin: "hidden" });
      else if (rule === 2 && !legend && level > 0) out.push({ type: 8, id: pid, origin: "hidden" });
      else if (rule === 3 && legend && level > 0) out.push({ type: 8, id: pid, origin: "hidden" });
      else if ((rule === 4 || rule === 5) && level > 0) out.push({ type: 8, id: pid, origin: "hidden" });
      else if (rule !== 1 && rule !== 2 && rule !== 3 && rule !== 4 && rule !== 5) out.push({ type: 8, id: pid, origin: "hidden" });
    });
  }
  if (truthy(hero.relic ?? null)) {
    const relics = data.relicsByHero.get(hid) ?? [];
    const chosen = relics.find((c) => pyEq(get(c, "id"), hero.relic ?? null)) ?? relics[0];
    if (chosen) {
      for (const pid of [get(chosen, "passive_id"), ...list(getOr(chosen, "list_array_add_passive_id", []))]) {
        if (pyFloat(pid) >= 1) out.push({ type: 8, id: pid, origin: "relic" });
      }
    }
  }
  return out.filter((s) => typeof s.id === "number" && data.passives.has(s.id)) as Source[];
}

/** sottorazza: TeamHeroData.GetSubKind secondo sub_kind_check (dedotto) */
function subKindOf(hb: SimNode, hasUnique: boolean, hasRelic: boolean): SimJson {
  const use = key(get(hb, "sub_kind_check", 0));
  const sub = get(hb, "sub_kind", 0);
  if (use === 2) return sub;
  if (use === 1) return hasUnique ? sub : 0;
  if (use === 3) return hasRelic ? sub : 0;
  if (use === 4) return hasUnique ? sub : 0; // dedotto
  return 0;
}

function createUnit(hero: SimHeroInput, slot: number, data: Prepared): Unit {
  const hid = pyInt(hero.id);
  const hb = data.heroes.get(hid);
  if (!hb) throw new Error(`simulazione: l'eroe ${hero.id} non e' nel pacchetto`);
  const skin = chooseSkin(hero, hid, data);
  const sources = heroSources(hero, hid, skin, data);
  const category = get(hb, "hero_category");
  return {
    guid: `A${slot}`,
    camp: "allies",
    slot,
    id: hid,
    bench: Boolean(hero.bench),
    alive: true,
    kind: get(hb, "kind", 0),
    subKind: subKindOf(hb, sources.some((s) => s.type === 8), truthy(hero.relic ?? null)),
    job: list(getOr(hb, "list_array_hero_job_group", [])),
    heroGroup: get(hb, "hero_group"),
    category: typeof category === "string" ? (CATEGORY.get(category) ?? -1) : -1,
    attribute: get(skin, "attribute", 0),
    female: pyEq(get(hb, "event_mission_gender"), 1), // dedotto: TeamUnitData.Gender.Female = 1
    rank: hero.ultimate ?? 1,
    orb: 0,
    fullBar: false,
    power: 0,
    sources,
    stat0: zeroStats(hero.stats),
    passives: [],
    buffs: [],
    off: new Set(),
    ingame: null,
  };
}

function createEnemy(i: number): Unit {
  return {
    guid: `N${i}`, camp: "enemies", slot: i, id: null, bench: false, alive: true, kind: 0, subKind: 0, job: [],
    heroGroup: null, category: -1, attribute: 0, female: false, rank: 1, orb: 0, fullBar: false, power: 0,
    sources: [], stat0: zeroStats(), passives: [], buffs: [], off: new Set(), ingame: null,
  };
}

/* ----------------------------------------------------------- la PassiveData -- */

function fractionIf(per: boolean, x: number): number {
  return per ? x * 0.01 : x;
}

/** crea_passiva: PassiveData..ctor, valori in frazione, cariche iniziali */
function createPassive(pid: number, type: number, unit: Unit, data: Prepared, origin: SimOrigin | null): Passive {
  const r = data.passives.get(pid)!;
  const kw = String(get(r, "effect_keyword"));
  const extraV = list(getOr(r, "list_array_extra_value", []));
  const extraT = list(getOr(r, "list_array_extra_type", []));
  let charges = pyFloat(getOr(r, "first_stack", 0));
  const max = pyFloat(getOr(r, "max_stack", 0));
  if (max >= 1) charges = Math.min(charges, pyFloat(get(r, "max_stack")));
  if (kw === "pass_once_hero_dead_crit_add_per") charges = 0; // 0x474B35C: parte da 0
  return {
    id: pid, row: r, keyword: kw, type, origin, target: get(r, "target", "self"),
    owner: unit.guid, giver: unit.guid, copy: false, off: false, disabled: false, offByData: false,
    orig: fractionIf(kw.includes("per"), pyFloat(getOr(r, "effect_value", 0))),
    sub: fractionIf(get(r, "sub_value_type") === "per", pyFloat(getOr(r, "sub_value", 0))),
    third: fractionIf(get(r, "third_value_type") === "per", pyFloat(getOr(r, "third_value", 0))),
    extra: extraV.length > 0 && extraV.length === extraT.length ? extraV.map((v, i) => fractionIf(extraT[i] === "per", pyFloat(v))) : [],
    charges,
    max,
  };
}

/** copia_passiva: PassiveData..ctor(other), valori risolti, niente valori per rango */
function copyPassive(pd: Passive, receiver: Unit): Passive {
  const c: Passive = { ...pd, owner: receiver.guid, copy: true };
  if (receiver.guid !== pd.giver) c.target = "self";
  return c;
}

/** valore_rango: il valore per rango della Mossa finale del proprietario vivo in campo, o null */
function rankValue(pd: Passive, column: 1 | 2 | 3, st: State): number | null {
  const r = pd.row;
  if (pd.copy || !pyEq(get(r, "special_level_passive_value_type"), column)) return null;
  const values = list(getOr(r, "list_array_special_level_passive_value", []));
  const owner = unitByGuid(st, pd.owner, true, pd.keyword === RANK_FROM_BENCH);
  if (!owner || values.length === 0) return null;
  const i = owner.rank - 1;
  if (i < 0 || i >= values.length) return null;
  const per = column === 1 ? pd.keyword.includes("per") : get(r, column === 2 ? "sub_value_type" : "third_value_type") === "per";
  const v = fractionIf(per, pyFloat(values[i]));
  return v > 0 ? v : null;
}

function cur(pd: Passive, st: State): number {
  return rankValue(pd, 1, st) ?? round5(pd.orig * pd.charges);
}

function orig(pd: Passive, st: State): number {
  return rankValue(pd, 1, st) ?? pd.orig;
}

function sub(pd: Passive, st: State): number {
  return rankValue(pd, 2, st) ?? pd.sub;
}

function third(pd: Passive, st: State): number {
  return rankValue(pd, 3, st) ?? pd.third;
}

/** il passo 3 e GetKeywordSingleData saltano 0x118, 0x119 e 0x11A */
function isOn(pd: Passive): boolean {
  return !(pd.disabled || pd.off || pd.offByData);
}

/* --------------------------------------------------------------- la squadra -- */

/** IngameUnitManager.GetUnit(guid, isAliveOnly, isIncludeEntryUnit) */
function unitByGuid(st: State, guid: string | null, aliveOnly = true, withBench = false): Unit | null {
  for (const u of st.units) {
    if (u.guid === guid && (u.alive || !aliveOnly) && (!u.bench || withBench)) return u;
  }
  return null;
}

/** GetBattleUnitList: in campo, ordine dei posti, panchina esclusa */
function field(st: State, camp: Camp, aliveOnly = true): Unit[] {
  return st.units.filter((u) => u.camp === camp && !u.bench && (u.alive || !aliveOnly));
}

function bench(st: State, camp: Camp): Unit[] {
  return st.units.filter((u) => u.camp === camp && u.bench);
}

function otherCamp(camp: Camp): Camp {
  return camp === "allies" ? "enemies" : "allies";
}

function races(u: Unit): SimJson[] {
  return [u.kind, u.subKind].filter((k) => truthy(k)).map((k) => key(k) as SimJson);
}

function intersects(a: readonly SimJson[], b: readonly SimJson[]): boolean {
  const s = new Set(a.map((x) => key(x)));
  return b.some((x) => s.has(key(x)));
}

/** spenta_per_dati: CheckForeverDisablePassive sul ricevente */
function offByData(pd: Passive, receiver: Unit, st: State): boolean {
  const r = pd.row;
  if (pd.target === "global_enemy" && pd.giver === receiver.guid) return true;
  const kind = get(r, "kind_target", 0);
  if (truthy(kind) && !races(receiver).includes(key(kind) as SimJson)) return true;
  const att = get(r, "attribute_target", 0);
  if (truthy(att) && !pyEq(att, receiver.attribute)) {
    const fromSub = pyInt(getOr(r, "sub_value", 0));
    if (!(ATTRIBUTE_FROM_SUB.has(pd.keyword) && fromSub > 0 && pyEq(fromSub, receiver.attribute))) return true;
  }
  const contents = CONTENTS[st.content];
  if (!list(getOr(r, "list_array_apply_contents", [])).some((c) => contents.has(key(c) as number))) return true;
  if (pd.keyword === "pass_fixed_atk_change_add_per_ally" && pd.giver === receiver.guid) return true;
  const heroes = list(getOr(r, "list_array_hero_target", []));
  if (heroes.length > 0 && !heroes.some((h) => pyEq(h, receiver.id))) return true;
  // IsDisableArtifactPassive: 1 categoria, 2 job group, 3 l'uno o l'altro
  const check = key(get(r, "apply_artifact_passive_check", 0));
  const cats = list(getOr(r, "list_array_apply_hero_category", []))
    .filter((c) => c !== "0" && !pyEq(c, 0))
    .map((c) => (typeof c === "string" && CATEGORY.has(c) ? (CATEGORY.get(c) as number) : c));
  const jobs = list(getOr(r, "list_array_apply_hero_job_group", []));
  const noCat = cats.length > 0 && !cats.some((c) => pyEq(c, receiver.category));
  const noJob = jobs.length > 0 && !intersects(jobs, receiver.job);
  return (check === 1 && noCat) || (check === 2 && noJob) || (check === 3 && (noCat || noJob));
}

/** aggiungi: PassiveManager.AddPassive, controlla sul ricevente e aggiunge sempre */
function addPassive(pd: Passive, receiver: Unit, st: State): void {
  if (!pd.off) pd.offByData = offByData(pd, receiver, st);
  receiver.passives.push(pd);
}

/** distribuisci: self nella lista, global_ally copiata su campo e panchina, global_enemy sui nemici */
function distribute(pd: Passive, unit: Unit, st: State): void {
  if (pd.target === "global_ally") {
    const receivers = [...field(st, unit.camp), ...(unit.camp === "allies" ? bench(st, unit.camp) : [])];
    for (const r of receivers) addPassive(copyPassive(pd, r), r, st);
  } else if (pd.target === "global_enemy") {
    for (const r of field(st, otherCamp(unit.camp))) addPassive(copyPassive(pd, r), r, st);
    addPassive(pd, unit, st);
  } else if (pd.target === "self") {
    addPassive(pd, unit, st);
  }
}

/** flag_iniziali: Comandamento solo alla prima unita' che ne ha uno; Grazia e Unita' alla prima del gruppo */
function initialFlags(st: State): void {
  let tabooGiven = false;
  const groups = new Set<string>();
  for (const u of [...field(st, "allies", false), ...bench(st, "allies")]) {
    const row = (u.id === null ? undefined : st.data.exclusives.get(u.id)) ?? {};
    u.off = new Set();
    if (u.sources.some((s) => s.type === 9)) {
      if (tabooGiven) u.off.add(9);
      tabooGiven = true;
    }
    for (const [type, col] of [[12, "grace_exclusive_passive_group"], [17, "solidarity_exclusive_passive_group"]] as const) {
      if (u.sources.some((s) => s.type === type)) {
        const v = key(get(row, col, 0));
        const g = `${type}|${typeof v}|${String(v)}`;
        if (groups.has(g)) u.off.add(type);
        groups.add(g);
      }
    }
  }
}

/** inizializza: passive, copie, ordine per ID, cariche del primo turno, buff */
function initialize(input: SimInput, data: Prepared): State {
  const st: State = { data, content: input.content ?? "pve", units: [], register: new Map(), target: null };
  input.heroes.forEach((hero, i) => {
    if (hero) st.units.push(createUnit(hero, i, data)); // un posto vuoto: il posto degli altri resta
  });
  const enemies = input.enemies?.count ?? 0;
  for (let i = 0; i < enemies; i++) st.units.push(createEnemy(i));
  initialFlags(st);
  for (const u of [...field(st, "allies", false), ...bench(st, "allies")]) {
    for (const source of u.sources) {
      const pd = createPassive(source.id, source.type, u, data, source.origin);
      if (u.off.has(source.type)) {
        pd.off = true;
        pd.disabled = source.type === 12 || source.type === 17;
      }
      distribute(pd, u, st);
    }
  }
  for (const u of st.units) u.passives.sort((a, b) => a.id - b.id); // stabile, come list.sort
  giveBuffs(st, input);
  return st;
}

/* ------------------------------------------------------------------ i buff -- */

/** crea_buff: valore = effect_value x 0,01 se la parola ha «per»; CurBuffValue = max(0, valore) */
function createBuff(bid: number, from: string | null, data: Prepared): Buff {
  const b = data.buffs.get(bid)!;
  const kw = String(get(b, "effect_keyword", ""));
  const type = get(b, "buff_type");
  return {
    id: bid,
    keyword: kw,
    type: typeof type === "string" ? (BUFF_TYPE.get(type) ?? -1) : -1,
    from,
    value: Math.max(0, fractionIf(kw.includes("per"), pyFloat(getOr(b, "effect_value", 0)))),
    sub: fractionIf(get(b, "sub_value_type") === "per", pyFloat(getOr(b, "sub_value", 0))),
    overlap: pyFloat(getOr(b, "overlap_type", 0)),
    limit: pyFloat(getOr(b, "overlap_limit", 0)),
    target: getOr(b, "buff_target", 0),
    passive: null,
    origin: null,
  };
}

/** metti_buff: Overlap (0) istanze separate fino al limite; NonOverlap_upper (1) resta la piu' forte */
function putBuff(u: Unit, b: Buff): void {
  const same = u.buffs.filter((x) => x.id === b.id);
  const first = same[0];
  if (b.overlap === 1 && first) {
    if (b.value > first.value) {
      u.buffs.splice(u.buffs.indexOf(first), 1);
      u.buffs.push({ ...b });
    }
    return;
  }
  if (b.overlap === 0 && b.limit >= 1 && first && same.length >= b.limit) u.buffs.splice(u.buffs.indexOf(first), 1);
  u.buffs.push({ ...b });
}

/** destinatari_riga: buff_target 0 this, 3 alleati vivi in campo, 4 nemici; 1-2 il bersaglio corrente */
function rowReceivers(b: Buff, owner: Unit, st: State): Unit[] {
  const t = key(b.target);
  if (t === 0) return [owner];
  if (t === 3) return field(st, owner.camp);
  if (t === 4) return field(st, otherCamp(owner.camp));
  return st.target ? [st.target] : [];
}

/** dai_buff: cariche e buff prima del primo turno, momento per momento e unita' per unita' */
function giveBuffs(st: State, input: SimInput): void {
  const rules = st.data;
  for (const moment of MOMENTS) {
    if (moment === "inizio_turno" && input.turnStart === false) continue;
    for (const self of field(st, "allies")) {
      for (const voce of rules.charges) if (get(voce, "quando") === moment) runCharges(voce, self, st);
      for (const voce of rules.removeBuff) if (get(voce, "quando") === moment) runGiveBuff(voce, self, st);
      for (const voce of rules.giveBuff) {
        if (get(voce, "quando") === moment && get(voce, "chi") !== "panchina") runGiveBuff(voce, self, st);
      }
    }
    for (const self of bench(st, "allies")) {
      for (const voce of rules.giveBuff) {
        if (get(voce, "quando") === moment && get(voce, "chi") === "panchina") runGiveBuff(voce, self, st);
      }
    }
  }
}

/** prese_buff: le PassiveData che fanno scattare una voce di dare_buff */
function buffTriggers(voce: Voce, self: Unit, st: State): [Passive, Unit][] {
  const presa = node(get(voce.node, "presa", { tipo: "propria" }), "presa");
  const kw = voce.keyword;
  if (get(presa, "tipo") === "tutte_proprie") {
    return self.passives.filter((p) => p.keyword === kw && isOn(p)).map((p) => [p, self] as [Passive, Unit]);
  }
  if (get(presa, "tipo") === "tutte_campo") {
    const camp = truthy(get(presa, "avversari")) ? otherCamp(self.camp) : self.camp;
    const us = [...field(st, camp), ...(truthy(get(presa, "panchina")) ? bench(st, camp) : [])];
    return us.flatMap((u) => u.passives.filter((p) => p.keyword === kw && isOn(p)).map((p) => [p, u] as [Passive, Unit]));
  }
  const [pd, holder] = take(voce, self, st);
  return pd ? [[pd, holder!]] : [];
}

/** id_scelti */
function chosenIds(voce: SimNode, pd: Passive, ctx: Ctx): SimJson[] {
  const ids = [...list(getOr(pd.row, "list_array_use_buff_id", []))];
  const which = get(voce, "quali", "tutti");
  if (which === "per_rango") {
    const who = unitRef(get(voce, "rango_di", "this"), ctx) ?? ctx.self;
    const i = who.rank - 1;
    return i >= 0 && i < ids.length ? [ids[i]!] : [];
  }
  if (which === "primo" || which === "a_caso") return ids.slice(0, 1); // a caso: il primo (dubbio)
  if (which !== null && typeof which === "object" && !Array.isArray(which) && has(which as SimNode, "indice")) {
    const i = pyFloat(get(which as SimNode, "indice"));
    return i < ids.length ? [ids[i]!] : [];
  }
  return ids;
}

/** togli: DeleteBuffs, al massimo `quante` voci per id, o tutte */
function removeBuffs(spec: SimNode, ctx: Ctx): void {
  const from = get(spec, "da", "this") === "this" ? [ctx.self] : unitsOf(node(get(spec, "da"), "togli.da"), ctx);
  const howMany = get(spec, "quante", "tutte");
  for (const u of from) {
    let gone = matchingBuffs(u, spec, ctx);
    if (howMany !== "tutte") {
      const n = Math.trunc(evalExpr(howMany, ctx));
      const perId = new Map<number, number>();
      gone = gone.filter((b) => {
        perId.set(b.id, (perId.get(b.id) ?? 0) + 1);
        return (perId.get(b.id) ?? 0) <= n;
      });
    }
    // list.remove toglie il primo uguale per valore: e' sempre questo stesso (stesso id, viene prima)
    for (const b of gone) u.buffs.splice(u.buffs.indexOf(b), 1);
  }
}

/** esegui_dare_buff */
function runGiveBuff(raw: SimNode, self: Unit, st: State): void {
  const voce: Voce = { node: raw, keyword: String(get(raw, "parola")), step: "buff" };
  const chiDa = get(raw, "chi_da");
  const withBench = chiDa !== null && typeof chiDa === "object" && truthy(get(chiDa as SimNode, "panchina"));
  for (const [pd, holder] of buffTriggers(voce, self, st)) {
    const ctx: Ctx = { st, self, pd, holder, voce, giver: unitByGuid(st, pd.giver, true, withBench) };
    if (chiDa !== null && ctx.giver === null) continue;
    if (ctx.giver === null) ctx.giver = unitByGuid(st, pd.giver, false, true);
    if (!list(get(raw, "condizioni", [])).every((c) => pred(node(c, "condizione"), ctx))) continue;
    if (truthy(get(raw, "togli"))) removeBuffs(node(get(raw, "togli"), "togli"), ctx);
    if (!has(raw, "quali") && !has(raw, "a")) continue; // voce di togli_buff: nessun buff da dare
    const times = has(raw, "volte") ? Math.trunc(evalExpr(get(raw, "volte"), ctx)) : 1;
    for (let k = 0; k < times; k++) {
      for (const bid of chosenIds(raw, pd, ctx)) {
        if (typeof bid === "number" && bid >= 2 && st.data.buffs.has(bid)) {
          for (const [u, b] of buffReceivers(node(get(raw, "a", { tipo: "riga" }), "a"), bid, ctx)) {
            putBuff(u, { ...b, passive: pd.id, origin: pd.origin }); // la passiva che lo da': per la traccia
          }
        }
      }
    }
  }
}

/** destinatari: buff_target visto dal padrone, forzato, i bersagli forzati, o un bersaglio per volta */
function buffReceivers(a: SimNode, bid: number, ctx: Ctx): [Unit, Buff][] {
  const { st, self } = ctx;
  const kind = get(a, "tipo");
  if (kind === "riga" && get(a, "di") === "u") {
    const out: [Unit, Buff][] = [];
    for (const u of unitsOf(node(get(a, "conta"), "a.conta"), ctx)) {
      const b = createBuff(bid, u.guid, st.data);
      for (const x of rowReceivers(b, u, st)) out.push([x, b]);
    }
    return out;
  }
  const di = get(a, "di");
  const owner = (di === "this" || di === "giver" ? unitRef(di, ctx) : null) ?? self;
  let b = createBuff(bid, owner.guid, st.data);
  if (has(a, "forza_target")) b = { ...b, target: get(a, "forza_target") };
  if (kind === "riga") return rowReceivers(b, owner, st).map((x) => [x, b] as [Unit, Buff]);
  if (kind === "forzati") return unitsOf(node(get(a, "conta"), "a.conta"), ctx).map((x) => [x, b] as [Unit, Buff]);
  const out: [Unit, Buff][] = [];
  for (const u of unitsOf(node(get(a, "conta"), "a.conta"), ctx)) {
    st.target = u; // SetMainTarget(u) e buff_target della riga
    for (const x of rowReceivers(b, owner, st)) out.push([x, b]);
  }
  st.target = null;
  return out;
}

/** esegui_cariche: le cariche (o il contatore) cambiate prima del primo ricalcolo */
function runCharges(raw: SimNode, self: Unit, st: State): void {
  const voce: Voce = { node: raw, keyword: String(get(raw, "parola")), step: "cariche" };
  for (const pd of self.passives) {
    if (pd.keyword !== voce.keyword || !isOn(pd)) continue;
    const ctx: Ctx = { st, self, pd, holder: self, voce, giver: unitByGuid(st, pd.giver, false, true) };
    if (!list(get(raw, "condizioni", [])).every((c) => pred(node(c, "condizione"), ctx))) continue;
    const what = get(raw, "cosa", "cariche");
    if (what === "contatore_check") {
      pd.counters ??= new Map();
      const k = counterKey("check", self.guid);
      pd.counters.set(k, (pd.counters.get(k) ?? 0) + Math.trunc(evalExpr(get(raw, "aggiungi"), ctx)));
    } else if (what === "cariche") {
      const reset = get(raw, "azzera_se");
      let n = truthy(reset) && pred(node(reset, "azzera_se"), ctx) ? 0 : pd.charges;
      n += Math.trunc(evalExpr(get(raw, "aggiungi"), ctx));
      if (get(raw, "tetto") === "max_stack" && pd.max >= 1) n = Math.min(n, pd.max);
      pd.charges = n;
    }
    // livello_battaglia: il livello aggiunto in battaglia non e' simulato (dubbio)
  }
}

function counterKey(dictionary: SimJson, guid: string): string {
  return `${String(dictionary)}\u0001${guid}`;
}

/* ------------------------------------------------------------------- i nodi -- */

interface Ctx {
  st: State;
  self: Unit;
  pd: Passive;
  holder: Unit | null;
  giver: Unit | null;
  voce: Voce;
  stats?: Stats;
  register?: Map<string, number>;
  from?: number | null;
  E?: number;
  S?: number;
  T?: number;
  B?: number;
  BSub?: number;
  B1?: number;
  buffFrom?: string | null;
  buffId?: number;
  buffPassive?: number | null;
  buffOrigin?: SimOrigin | null;
  u?: Unit;
  foundWord?: SimJson;
}

/** prendi: (pd, portatore) o (null, null); la presa «nessuna» da' una PassiveData finta */
function take(voce: Voce, self: Unit, st: State): [Passive | null, Unit | null] {
  const presa = node(get(voce.node, "presa", { tipo: "nessuna" }), "presa");
  const p = get(presa, "parola");
  const kw = truthy(p) ? String(p) : voce.keyword;
  const kind = get(presa, "tipo");
  if (kind === "propria" || kind === "passo3") return [ownPassive(self, kw), self];
  if (kind === "campo") {
    const camp = truthy(get(presa, "avversari")) ? otherCamp(self.camp) : self.camp;
    for (const u of [...field(st, camp), ...(truthy(get(presa, "panchina")) ? bench(st, camp) : [])]) {
      const pd = ownPassive(u, kw);
      if (pd) return [pd, u];
    }
    return [null, null];
  }
  // presa «nessuna»: niente pd; per la traccia si ricorda la prima passiva propria con la parola
  const first = ownPassive(self, kw);
  return [
    {
      id: first?.id ?? 0, row: {}, keyword: kw, type: 0, origin: first?.origin ?? null, target: null,
      owner: self.guid, giver: first?.giver ?? self.guid, copy: true, off: false, disabled: false, offByData: false,
      orig: 0, sub: 0, third: 0, extra: [], charges: 0, max: 0, fake: true,
    },
    self,
  ];
}

/** PdPropria = GetKeywordSingleData: la prima accesa con la parola */
function ownPassive(u: Unit, kw: string): Passive | null {
  return u.passives.find((pd) => pd.keyword === kw && isOn(pd)) ?? null;
}

/** unita(ref, ctx): le unita' che un nodo puo' nominare */
function unitRef(ref: SimJson | undefined, ctx: Ctx): Unit | null {
  if (ref === "this") return ctx.self;
  if (ref === "giver") return ctx.giver;
  if (ref === "portatore") return ctx.holder;
  if (ref === "u") return ctx.u ?? null;
  return null;
}

function isExcludedColumnValue(x: SimJson): boolean {
  return x === null || x === 0 || x === false || x === "" || x === "0" || x === "none";
}

/** lista: elenco, colonna della riga di pd, unione; 0 e vuoti esclusi */
function listOf(l: SimJson | undefined, ctx: Ctx): SimJson[] {
  if (l === null || l === undefined) return [];
  if (typeof l === "object" && !Array.isArray(l) && has(l as SimNode, "unisci")) {
    return list(get(l as SimNode, "unisci")).flatMap((part) => listOf(part, ctx));
  }
  if (typeof l === "object" && !Array.isArray(l) && has(l as SimNode, "col")) {
    const v = get(ctx.pd.row, String(get(l as SimNode, "col")));
    return (Array.isArray(v) ? (v as SimJson[]) : [v]).filter((x) => !isExcludedColumnValue(x));
  }
  if (Array.isArray(l)) {
    return (l as SimJson[])
      .map((e) => (e !== null && typeof e === "object" && !Array.isArray(e) ? evalExpr(e, ctx) : e))
      .filter((x) => !(x === null || x === 0 || x === false || x === ""));
  }
  return [l];
}

/** CONTA: le unita' che passano */
function unitsOf(c: SimNode, ctx: Ctx): Unit[] {
  const { st, self } = ctx;
  const where = get(c, "dove", "campo");
  let us: Unit[];
  if (where === "campo") us = field(st, self.camp);
  else if (where === "campo_e_panchina") us = [...field(st, self.camp), ...bench(st, self.camp)];
  else if (where === "panchina") us = bench(st, self.camp);
  else if (where === "nemici") us = field(st, otherCamp(self.camp));
  else if (where === "nemici_anche_morti") us = field(st, otherCamp(self.camp), false); // al primo turno nessun morto
  else throw new Error(`simulazione: conta.dove ${String(where)}`);
  const skip = unitRef(get(c, "escludi"), ctx);
  const filter = get(c, "filtro");
  const out = us.filter((u) => !(skip !== null && u === skip) && (filter === null || pred(node(filter, "filtro"), { ...ctx, u })));
  return truthy(get(c, "scegli")) ? pick(out, node(get(c, "scegli"), "scegli"), ctx) : out;
}

/** criterio: il valore con cui CONTA.scegli ordina le unita' */
function criterion(u: Unit, crit: SimJson, ctx: Ctx): number {
  if (crit !== null && typeof crit === "object" && !Array.isArray(crit)) {
    const c = crit as SimNode;
    if (has(c, "stat_inizio")) return u.stat0[get(c, "stat_inizio") as SimStat];
    if (get(c, "da_sub") === SELECT_BY_SUB) {
      const k = Math.trunc(sub(ctx.pd, ctx.st));
      if (k === 3) return u.stat0.ATK;
      if (k === 4 || k === 8) return u.stat0.MAX_HP;
      if (k === 5) return u.stat0.DEF + u.stat0.MAX_HP;
      if (k === 7) return 1;
      return u.power;
    }
  }
  if (crit === "potenza") return u.power;
  if (crit === "ps_correnti") return u.stat0.MAX_HP;
  return 0; // ps_per, caso, carte, criteri non letti: pari (vince l'ordine dei posti)
}

/** scegli: le unita' col criterio piu' alto o piu' basso; a pari merito l'ordine dei posti */
function pick(us: Unit[], sc: SimNode, ctx: Ctx): Unit[] {
  if (us.length === 0) return us;
  const values = us.map((u) => criterion(u, get(sc, "criterio"), ctx));
  const way = get(sc, "verso");
  const best = way === "max" ? maxOf(values) : way === "min" ? minOf(values) : null;
  const howMany = get(sc, "quanti", 1);
  if (way === "caso") return us.slice(0, pyInt(howMany));
  const sorted = us
    .map((u, i) => ({ u, v: values[i]! }))
    .sort((a, b) => (way === "max" ? -a.v - -b.v : a.v - b.v))
    .map((x) => x.u);
  if (howMany === "tutti_pari") return us.filter((_, i) => values[i] === best);
  if (howMany === "tutti_tranne") return us.filter((u) => u !== sorted[0]);
  return sorted.slice(0, pyInt(howMany));
}

function buffTypes(t: SimJson): Set<SimJson> | null {
  if (t === null) return null;
  if (typeof t === "string") {
    const n = BUFF_TYPE.get(t);
    if (n === undefined) throw new Error(`simulazione: tipo di buff ${t}`);
    return new Set([n]);
  }
  return new Set(list(t).map((x) => key(x) as SimJson));
}

/** buff_che_passano */
function matchingBuffs(u: Unit, spec: SimNode, ctx: Ctx): Buff[] {
  const words = get(spec, "parole") === null ? null : new Set(listOf(get(spec, "parole"), ctx).map((x) => key(x)));
  const ids = get(spec, "id") === null ? null : new Set(listOf(get(spec, "id"), ctx).map((x) => key(x)));
  const types = buffTypes(get(spec, "tipo"));
  return u.buffs.filter(
    (b) => (words === null || words.has(b.keyword)) && (ids === null || ids.has(b.id)) && (types === null || types.has(b.type)),
  );
}

function buffUnits(on: SimJson, ctx: Ctx): Unit[] {
  const { st, self } = ctx;
  if (on === "this" || on === "giver" || on === "u" || on === "portatore") {
    const u = unitRef(on, ctx);
    return u ? [u] : [];
  }
  if (on === "campo") return field(st, self.camp);
  if (on === "nemici") return field(st, otherCamp(self.camp));
  if (on === "tutti") return [...field(st, "allies"), ...field(st, "enemies")];
  throw new Error(`simulazione: conta_buff.su ${String(on)}`);
}

/** conta_buff: quante voci BuffData */
function countBuffs(spec: SimNode, ctx: Ctx): number {
  let n = 0;
  const filter = get(spec, "filtro");
  for (const u of buffUnits(get(spec, "su", "this"), ctx)) {
    if (filter !== null && !pred(node(filter, "filtro"), { ...ctx, u })) continue;
    n += matchingBuffs(u, spec, ctx).length;
  }
  return n;
}

/** somma_passive: somma dei Cur o dei Sub accesi con la parola, di una unita' o del campo */
function sumPassives(spec: SimNode, ctx: Ctx): number {
  const { st, self } = ctx;
  const p = get(spec, "parola");
  const kw = truthy(p) ? String(p) : ctx.voce.keyword;
  let us: Unit[];
  if (get(spec, "di", "this") === "campo") {
    const camp = truthy(get(spec, "avversari")) ? otherCamp(self.camp) : self.camp;
    us = [...field(st, camp), ...(truthy(get(spec, "panchina")) ? bench(st, camp) : [])];
  } else {
    const u = unitRef(get(spec, "di", "this"), ctx);
    us = u ? [u] : [];
  }
  const f = get(spec, "campo", "Cur") === "Cur" ? cur : sub;
  return pySum(us.flatMap((u) => u.passives.filter((pd) => pd.keyword === kw && isOn(pd)).map((pd) => f(pd, st))));
}

/** stato_battaglia: al primo turno, prima di giocare carte; il resto parte da zero */
function battleState(n: SimNode, ctx: Ctx): number {
  const name = get(n, "stato");
  const u = unitRef(get(n, "di", "this"), ctx) ?? ctx.self;
  if (name === "orb") return u.orb;
  if (name === "orb_giver") return (ctx.giver ?? u).orb;
  if (name === "barra_piena") return u.fullBar ? 1 : 0;
  if (name === "barra_piena_giver") return (ctx.giver ?? u).fullBar ? 1 : 0;
  if (name === "turno") return 1;
  if (name === "contatore") {
    const owner = unitRef(get(n, "chiave", "this"), ctx) ?? ctx.self;
    return ctx.pd.counters?.get(counterKey(get(n, "dizionario", "check"), owner.guid)) ?? 0;
  }
  if (name === "carte") return 0;
  return 0; // morti, danno_accumulato, ps_persi, pose, valore_accumulato...
}

/** espr: il valore di un nodo ESPR */
function evalExpr(e: SimJson | undefined, ctx: Ctx): number {
  if (typeof e === "number") return e;
  if (typeof e === "boolean") return Number(e);
  if (e === null || e === undefined || typeof e !== "object" || Array.isArray(e)) {
    throw new Error(`simulazione: espr ${JSON.stringify(e)}`);
  }
  const n = e as SimNode;
  const { st, pd } = ctx;
  if (has(n, "v")) {
    const name = get(n, "v");
    if (name === "E" || name === "S" || name === "T" || name === "B" || name === "BSub" || name === "B1") {
      const v = ctx[name];
      if (v === undefined) throw new Error(`simulazione: ${name} fuori dal suo passo`);
      return v;
    }
    if (name === "Cur") return cur(pd, st);
    if (name === "Sub") return sub(pd, st);
    if (name === "Third") return third(pd, st);
    if (name === "Orig") return orig(pd, st);
    if (name === "Extra") {
      const i = pyFloat(get(n, "i", 0));
      return i < pd.extra.length ? pd.extra[i]! : 0;
    }
    if (name === "cariche") return pd.charges;
    if (name === "max_cariche") return pd.max;
  }
  if (has(n, "col")) {
    const v = get(pd.row, String(get(n, "col")), 0);
    if (typeof v === "string") return 0;
    return pyFloat(Array.isArray(v) && v.length > 0 ? (v[0] as SimJson) : truthy(v) ? v : 0);
  }
  if (has(n, "op")) {
    const a = list(get(n, "a")).map((x) => evalExpr(x, ctx));
    const op = get(n, "op");
    if (op === "*") return a.reduce((x, y) => x * y, 1);
    if (op === "+") return pySum(a);
    if (op === "-") return a[0]! - pySum(a.slice(1));
    if (op === "/") return a[1] ? a[0]! / a[1] : 0;
    if (op === "min") return minOf(a);
    if (op === "max") return maxOf(a);
  }
  if (has(n, "int")) return Math.trunc(evalExpr(get(n, "int"), ctx));
  if (has(n, "se")) return evalExpr(pred(node(get(n, "se"), "se"), ctx) ? get(n, "allora") : get(n, "altrimenti"), ctx);
  if (has(n, "conta")) return unitsOf(node(get(n, "conta"), "conta"), ctx).length;
  if (has(n, "conta_buff")) return countBuffs(node(get(n, "conta_buff"), "conta_buff"), ctx);
  if (has(n, "somma")) return sumPassives(node(get(n, "somma"), "somma"), ctx);
  if (has(n, "somma_su")) {
    return pySum(unitsOf(node(get(n, "somma_su"), "somma_su"), ctx).map((u) => evalExpr(get(n, "valore"), { ...ctx, u })));
  }
  if (has(n, "max_su_passive")) return maxOverPassives(n, ctx);
  if (has(n, "stat_inizio")) return startStat(n, ctx);
  if (has(n, "stat")) {
    const u = unitRef(get(n, "di", "this"), ctx);
    if (!u) throw new Error("simulazione: stat di nessuno");
    // fuori da RefreshStatus (buff d'inizio) valgono le statistiche d'inizio
    const stats = u === ctx.self && ctx.stats ? ctx.stats : (u.ingame ?? u.stat0);
    return stats[get(n, "stat") as SimStat];
  }
  if (has(n, "stato")) return battleState(n, ctx);
  if (has(n, "registro")) {
    if (!ctx.register) throw new Error("simulazione: registro fuori da RefreshStatus");
    return ctx.register.get(String(get(n, "registro"))) ?? 0;
  }
  if (has(n, "valore_buff")) {
    const s = node(get(n, "valore_buff"), "valore_buff");
    const u = unitRef(get(s, "di", "this"), ctx);
    if (!u) throw new Error("simulazione: valore_buff di nessuno");
    const useValue = get(s, "campo", "Cur") === "Cur";
    return pySum(u.buffs.filter((b) => b.keyword === get(s, "parola")).map((b) => (useValue ? b.value : b.sub)));
  }
  if (has(n, "conta_comandamenti")) {
    return [...field(st, "allies"), ...field(st, "enemies")].reduce((t, u) => t + u.sources.filter((s) => s.type === 9).length, 0);
  }
  if (has(n, "rango_mossa")) {
    const u = unitRef(get(n, "rango_mossa"), ctx);
    if (!u) throw new Error("simulazione: rango_mossa di nessuno");
    return u.rank;
  }
  if (has(n, "elemento")) {
    const l = listOf(get(n, "elemento"), ctx);
    const i = pyFloat(get(n, "i", 0));
    return i < l.length ? pyFloat(l[i]) : 0;
  }
  if (has(n, "lunghezza")) return listOf(get(n, "lunghezza"), ctx).length;
  if (has(n, "conta_id_mancanti")) {
    // IsExistBuffID falso (59_33, 59_36)
    const u = unitRef(get(n, "conta_id_mancanti"), ctx);
    if (!u) throw new Error("simulazione: conta_id_mancanti di nessuno");
    const present = new Set(u.buffs.map((b) => b.id));
    return list(getOr(pd.row, "list_array_use_buff_id", [])).filter((i) => !present.has(key(i) as number)).length;
  }
  if (has(n, "attributi_diversi")) {
    // 207_46: attributi diversi fra le altre unita' vive in campo, da 1 (dedotto)
    const self = ctx.self;
    const others = new Set(field(st, self.camp).filter((u) => u !== self).map((u) => key(u.attribute)));
    others.delete(key(self.attribute));
    return 1 + others.size;
  }
  throw new Error(`simulazione: espr sconosciuta ${JSON.stringify(e).slice(0, 200)}`);
}

/** stat_inizio: OriginalStatus (senza livello aggiunto in battaglia, che al primo turno non c'e') */
function startStat(n: SimNode, ctx: Ctx): number {
  const di = get(n, "di", "this");
  const stat = get(n, "stat_inizio") as SimStat;
  if (di === "nemico_piu_forte") {
    // GetHighestPowerUnit: potenza decrescente, il primo
    const enemies = field(ctx.st, otherCamp(ctx.self.camp)).sort((a, b) => -a.power - -b.power);
    return enemies[0] ? enemies[0].stat0[stat] : 0;
  }
  const u = unitRef(di, ctx);
  return u ? u.stat0[stat] : 0;
}

/** max_su_passive (486_48): il massimo, da 0, sulle passive di this con la parola, il giver di ognuna vivo */
function maxOverPassives(n: SimNode, ctx: Ctx): number {
  const { st, self } = ctx;
  const p = get(n, "parola");
  const kw = truthy(p) ? String(p) : ctx.voce.keyword;
  const chiDa = get(n, "chi_da");
  const withBench = chiDa !== null && typeof chiDa === "object" && truthy(get(chiDa as SimNode, "panchina"));
  let best = 0;
  for (const pd of self.passives) {
    if (pd.keyword !== kw || !isOn(pd)) continue;
    const g = unitByGuid(st, pd.giver, true, withBench);
    if (g === null) continue;
    best = Math.max(best, evalExpr(get(n, "max_su_passive"), { ...ctx, pd, giver: g }));
  }
  return best;
}

/** pred: un PREDICATO */
function pred(p: SimNode, ctx: Ctx): boolean {
  if (has(p, "e")) return list(get(p, "e")).every((x) => pred(node(x, "e"), ctx));
  if (has(p, "o")) return list(get(p, "o")).some((x) => pred(node(x, "o"), ctx));
  if (has(p, "non")) return !pred(node(get(p, "non"), "non"), ctx);
  if (has(p, "confronta")) {
    const [a, op, b] = list(get(p, "confronta"));
    const x = evalExpr(a, ctx);
    const y = evalExpr(b, ctx);
    if (op === ">") return x > y;
    if (op === ">=") return x >= y;
    if (op === "<") return x < y;
    if (op === "<=") return x <= y;
    if (op === "==") return x === y;
    if (op === "!=") return x !== y;
    throw new Error(`simulazione: confronto ${String(op)}`);
  }
  const u = has(p, "di") ? unitRef(get(p, "di", "this"), ctx) : null;
  const need = (): Unit => {
    if (!u) throw new Error(`simulazione: predicato senza unita' ${JSON.stringify(p).slice(0, 120)}`);
    return u;
  };
  if (has(p, "razza")) return intersects(races(need()), listOf(get(p, "razza"), ctx));
  if (has(p, "razza_tutte")) {
    const l = new Set(listOf(get(p, "razza_tutte"), ctx).map((x) => key(x)));
    const mine = new Set(races(need()));
    return l.size > 0 && [...l].every((x) => mine.has(x as SimJson));
  }
  if (has(p, "gruppo_lavoro")) return intersects(need().job, listOf(get(p, "gruppo_lavoro"), ctx));
  if (has(p, "categoria")) {
    const cats = listOf(get(p, "categoria"), ctx).map((c) => (typeof c === "string" && CATEGORY.has(c) ? (CATEGORY.get(c) as number) : c));
    return cats.some((c) => pyEq(c, need().category));
  }
  if (has(p, "attributo")) return listOf(get(p, "attributo"), ctx).some((x) => pyEq(pyInt(x), need().attribute));
  if (has(p, "gruppo_eroe")) return listOf(get(p, "gruppo_eroe"), ctx).some((x) => pyEq(pyInt(x), need().heroGroup));
  if (has(p, "eroe")) return listOf(get(p, "eroe"), ctx).some((x) => pyEq(pyInt(x), need().id));
  if (has(p, "femmina")) return need().female === get(p, "femmina");
  if (has(p, "comandamento")) {
    const isTaboo = need().sources.some((s) => s.type === 9 || get(ctx.st.data.passives.get(s.id)!, "exclusive_type") === "taboo");
    return isTaboo === get(p, "comandamento");
  }
  if (has(p, "ha_buff")) return matchingBuffs(need(), node(get(p, "ha_buff"), "ha_buff"), ctx).length >= 1;
  if (has(p, "ha_parola")) {
    const w = get(p, "ha_parola");
    return ownPassive(need(), truthy(w) ? String(w) : ctx.voce.keyword) !== null;
  }
  if (has(p, "stessa_razza")) {
    const [a, b] = list(get(p, "stessa_razza")).map((x) => unitRef(x, ctx));
    return Boolean(a && b && intersects(races(a), races(b)));
  }
  if (has(p, "stessa")) {
    const [a, b] = list(get(p, "stessa")).map((x) => unitRef(x, ctx));
    return a !== null && a !== undefined && a === b;
  }
  if (has(p, "in_panchina")) {
    const g = unitRef(get(p, "in_panchina"), ctx);
    return Boolean(g && g.bench);
  }
  if (has(p, "razze_diverse")) {
    const all = field(ctx.st, ctx.self.camp).flatMap((x) => races(x));
    return all.length === new Set(all).size;
  }
  if (has(p, "in_posizione") || has(p, "puo_difendersi")) return false; // al primo turno nessuna posa (dedotto)
  if (has(p, "turno_di")) {
    // al primo turno che si guarda e' il turno degli alleati (chi comincia: non letto)
    const g = unitRef(get(p, "turno_di"), ctx);
    return Boolean(g) && g!.camp === "allies";
  }
  if (has(p, "giver_vivo")) return Boolean(ctx.giver && ctx.giver.alive) === get(p, "giver_vivo");
  if (has(p, "stessa_categoria")) return new Set(field(ctx.st, ctx.self.camp).map((x) => x.category)).size <= 1;
  if (has(p, "attributi_diversi_campo")) {
    const att = field(ctx.st, ctx.self.camp).map((x) => key(x.attribute));
    return (att.length === new Set(att).size) === get(p, "attributi_diversi_campo");
  }
  if (has(p, "stato_flag")) return false; // m_isPrevTurnEntryBoss: falso al primo turno (dedotto)
  if (has(p, "soglia_buff_alleati")) {
    // 59_103 0x4c24934-0x4c249b4
    const s = node(get(p, "soglia_buff_alleati"), "soglia_buff_alleati");
    const threshold = evalExpr(get(s, "prima_parola_con_almeno"), ctx);
    const filter = get(s, "filtro", null);
    const allies = field(ctx.st, ctx.self.camp).filter((x) => filter === null || pred(node(filter, "filtro"), { ...ctx, u: x }));
    for (const w of listOf(get(s, "fra"), ctx)) {
      if (allies.filter((x) => x.buffs.some((b) => b.keyword === w)).length >= threshold) {
        ctx.foundWord = w;
        return true;
      }
    }
    return false;
  }
  if (has(p, "ha_la_parola_trovata")) {
    const g = unitRef(get(p, "ha_la_parola_trovata"), ctx);
    if (!g) throw new Error("simulazione: ha_la_parola_trovata di nessuno");
    return g.buffs.some((b) => b.keyword === (ctx.foundWord ?? null));
  }
  if (has(p, "sempre")) return true;
  throw new Error(`simulazione: predicato sconosciuto ${JSON.stringify(p).slice(0, 200)}`);
}

/* ------------------------------------------------------ gli aiutanti di base -- */

function statsOf(s: SimJson): readonly SimStat[] {
  if (typeof s === "string") {
    const g = GROUPS[s.split(":").slice(1).join(":")];
    if (!g) throw new Error(`simulazione: gruppo ${s}`);
    return g;
  }
  return list(s) as SimStat[];
}

/** applica: un EFFETTO sugli aiutanti di base (le riduzioni valgono sempre: ÙÆÍÝÎÉÉàÛ non letto) */
function apply(effect: SimNode, ctx: Ctx, trace: SimTraceEntry[]): void {
  if (has(effect, "imposta_registro")) {
    ctx.register!.set(String(get(effect, "imposta_registro")), evalExpr(get(effect, "valore"), ctx));
    return;
  }
  if (has(effect, "per_ogni")) {
    const one: Record<string, SimJson> = {};
    for (const k of Object.keys(effect)) if (k !== "per_ogni") one[k] = effect[k] as SimJson;
    for (const u of unitsOf(node(get(effect, "per_ogni"), "per_ogni"), ctx)) apply(one, { ...ctx, u }, trace);
    return;
  }
  if (has(effect, "se") && !pred(node(get(effect, "se"), "se"), ctx)) return;
  const v = evalExpr(get(effect, "valore"), ctx);
  if (v === 0) return;
  const mode = String(get(effect, "come"));
  const s = ctx.stats!;
  for (const t of statsOf(get(effect, "statistiche"))) {
    const before = s[t];
    if (mode === "per") s[t] = before >= 0 ? before + before * v : before; // ÇÄÆÔËÝÛàÙ(TYPE) 0x3ec2100
    else if (mode === "piu") s[t] = before + v;
    else if (mode === "meno") s[t] = before - v;
    else if (mode === "meno_per") s[t] = before - before * v;
    else if (mode === "meno_per_senza_controllo") s[t] = before >= 0 ? before - before * v : before; // passo 7
    else if (mode === "gruppo_per") s[t] = MULTIPLY.has(t) ? before * (1 + v) : before + v;
    else if (mode === "imposta") s[t] = v;
    else if (mode === "gruppo_meno_per") s[t] = MULTIPLY.has(t) ? before * (1 - v) : before - v;
    if (s[t] !== before) trace.push(traceEntry(ctx, t, mode, v, before, s[t]));
  }
}

/** la voce della traccia: per un buff, passiva e origine sono quelle della passiva che l'ha dato */
function traceEntry(ctx: Ctx, stat: SimStat, mode: string, value: number, before: number, after: number): SimTraceEntry {
  const fromBuff = ctx.buffId !== undefined && ctx.buffId !== null;
  const from = ctx.from;
  return {
    step: ctx.voce.step as number,
    keyword: ctx.voce.keyword,
    passive: fromBuff ? (ctx.buffPassive ?? null) : ctx.pd.id || null,
    buff: fromBuff ? ctx.buffId! : null,
    from: from === null || from === undefined ? null : String(from),
    origin: fromBuff ? (ctx.buffOrigin ?? null) : ctx.pd.origin,
    stat,
    mode,
    value,
    before,
    after,
  };
}

/* ------------------------------------------------------------ RefreshStatus -- */

interface Extra {
  E?: number;
  S?: number;
  T?: number;
  B?: number;
  BSub?: number;
  B1?: number;
  buffFrom?: string | null;
  buffId?: number;
  buffPassive?: number | null;
  buffOrigin?: SimOrigin | null;
}

/** esegui_voce */
function runVoce(voce: Voce, self: Unit, st: State, stats: Stats, trace: SimTraceEntry[], extra?: Extra): void {
  const [pd, holder] = take(voce, self, st);
  if (pd === null) return;
  let giver: Unit | null;
  if (!pd.fake) {
    const chiDa = get(voce.node, "chi_da");
    const withBench = chiDa !== null && typeof chiDa === "object" && truthy(get(chiDa as SimNode, "panchina"));
    giver = unitByGuid(st, pd.giver, true, withBench);
    if (chiDa !== null && giver === null) return;
    // senza controllo il giver resta quello della passiva, anche in panchina
    if (giver === null) giver = unitByGuid(st, pd.giver, false, true);
  } else {
    giver = unitByGuid(st, pd.giver, false, true);
  }
  const ctx: Ctx = {
    st, self, pd, holder, giver, voce, stats, register: st.register.get(self.guid), from: (giver ?? holder ?? self).id, ...extra,
  };
  if (extra?.buffFrom) {
    // per un buff, nella traccia: chi l'ha dato (la prima istanza)
    const who = unitByGuid(st, extra.buffFrom, false, true);
    if (who) ctx.from = who.id;
  }
  const presa = node(get(voce.node, "presa"), "presa");
  if (get(presa, "tipo") === "buff" && (ctx.B ?? 0) === 0 && (ctx.BSub ?? 0) === 0) return;
  if (list(get(voce.node, "condizioni", [])).every((c) => pred(node(c, "condizione"), ctx))) {
    for (const ef of list(get(voce.node, "effetti"))) apply(node(ef, "effetto"), ctx, trace);
  }
}

/** passo3: somma per parola sulle passive proprie accese, poi lo switch nell'ordine del dizionario */
function step3(self: Unit, st: State, stats: Stats, trace: SimTraceEntry[]): void {
  const totals = new Map<string, { E: number; S: number; T: number }>();
  for (const pd of self.passives) {
    if (!isOn(pd)) continue;
    let t = totals.get(pd.keyword);
    if (!t) {
      t = { E: 0, S: 0, T: third(pd, st) };
      totals.set(pd.keyword, t);
    }
    t.E += cur(pd, st);
    t.S += sub(pd, st);
  }
  for (const [kw, t] of totals) {
    if (!st.data.words.has(kw)) continue;
    for (const voce of st.data.step3.get(kw) ?? []) runVoce(voce, self, st, stats, trace, { E: t.E, S: t.S, T: t.T });
  }
}

/** passo_buff (5): somma di CurBuffValue per parola, poi lo switch nell'ordine del dizionario */
function step5(self: Unit, st: State, stats: Stats, trace: SimTraceEntry[]): void {
  const totals = new Map<string, Extra & { B: number; BSub: number }>();
  for (const b of self.buffs) {
    let t = totals.get(b.keyword);
    if (!t) {
      t = { B: 0, BSub: 0, B1: b.value, buffFrom: b.from, buffId: b.id, buffPassive: b.passive, buffOrigin: b.origin };
      totals.set(b.keyword, t);
    }
    t.B += b.value;
    t.BSub += b.sub;
  }
  for (const [kw, t] of totals) {
    for (const v of st.data.buffWords.get(kw) ?? []) {
      if (pyEq(get(v, "passo"), 5)) runVoce({ node: v, keyword: kw, step: 5 }, self, st, stats, trace, t);
    }
  }
}

/** totali_buff: i totali di una parola di buff per i passi 4, 7 e 8 */
function buffTotals(self: Unit, kw: string): Extra {
  const t: Extra & { B: number; BSub: number } = { B: 0, BSub: 0, B1: 0 };
  for (const b of self.buffs) {
    if (b.keyword !== kw) continue;
    if (t.B === 0 && t.BSub === 0) {
      t.B1 = b.value;
      t.buffFrom = b.from;
      t.buffId = b.id;
      t.buffPassive = b.passive;
      t.buffOrigin = b.origin;
    }
    t.B += b.value;
    t.BSub += b.sub;
  }
  return t;
}

/** passo_sequenza: i passi 2, 4, 6, 7, 8 nell'ordine degli indirizzi */
function stepSequence(self: Unit, st: State, stats: Stats, trace: SimTraceEntry[], step: number): void {
  for (const voce of st.data.steps.get(step) ?? []) {
    const presa = node(get(voce.node, "presa"), "presa");
    runVoce(voce, self, st, stats, trace, get(presa, "tipo") === "buff" ? buffTotals(self, voce.keyword) : undefined);
  }
}

/** refresh: UnitBase.RefreshStatus 0x3ee1918 */
function refresh(self: Unit, st: State): { stats: Stats; trace: SimTraceEntry[] } {
  const stats: Stats = { ...self.stat0 }; // 1. IngameStatus.Reset(OriginalStatus)
  const trace: SimTraceEntry[] = [];
  // registro del passo 6: totalBuffCount = voci di tipo Buff sulle unita' vive delle due squadre
  const all = [...field(st, "allies"), ...field(st, "enemies")];
  st.register.set(self.guid, new Map([["buff_tutti", all.reduce((n, u) => n + u.buffs.filter((b) => b.type === 0).length, 0)]]));
  stepSequence(self, st, stats, trace, 2);
  step3(self, st, stats, trace);
  stepSequence(self, st, stats, trace, 4);
  step5(self, st, stats, trace);
  stepSequence(self, st, stats, trace, 6);
  stepSequence(self, st, stats, trace, 7);
  for (const t of ["ATK", "DEF", "MAX_HP"] as const) {
    // 8b: almeno il 20% dell'originale
    const floor = self.stat0[t] * 0.2;
    if (stats[t] < floor) {
      trace.push({
        step: 8, keyword: CAP_KEYWORD, passive: null, buff: null, from: null, origin: "cap", stat: t, mode: "cap", value: 0.2,
        before: stats[t], after: floor,
      });
      stats[t] = floor;
    }
  }
  stepSequence(self, st, stats, trace, 8); // 8c e 8d: dopo il tetto
  return { stats, trace };
}

/**
 * Le statistiche al primo turno di ogni eroe in campo, con la traccia di ogni
 * passiva e buff che le cambia. Lancia un errore se un eroe non e' nel pacchetto o
 * chiede la forma LR senza averla (come simula.py).
 */
export function simulate(input: SimInput, data: SimData): SimResult {
  const st = initialize(input, prepare(data));
  const heroes: SimHeroResult[] = [];
  for (const u of field(st, "allies")) {
    const { stats, trace } = refresh(u, st);
    u.ingame = stats;
    heroes.push({ id: String(u.id), slot: u.slot, start: { ...u.stat0 }, firstTurn: stats, trace });
  }
  return { heroes };
}
