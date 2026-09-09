/**
 * Dataset Grand Cross.
 *
 * ATTENZIONE - I NUMERI QUI SOTTO SONO SEGNAPOSTO.
 *
 * Netmarble non pubblica dati strutturati e non esiste una community di
 * datamining paragonabile a quella dei giochi HoYo: ogni unita', abilita' e
 * moltiplicatore va inserito a mano e calibrato sul gioco reale. Queste tre
 * unita' servono a validare il motore e il contratto, non a produrre numeri
 * corretti. Vanno sostituite prima di mostrare un solo risultato agli utenti.
 *
 * Il file e' versionato per patch: quando i valori cambiano si crea una nuova
 * DatasetVersion, e le build gia' salvate continuano a puntare alla vecchia.
 */

import type { StatDefinition, Target } from "@/lib/engine";
import type { CharacterSummary, DatasetInfo } from "../types";

export const DATASET: DatasetInfo = {
  patch: "0.0.0-placeholder",
  releasedAt: "2026-01-01",
  checksum: "placeholder",
};

/** Attributi del triangolo: STR > DEX > HP > STR. */
export const ATTRIBUTES = ["strength", "dexterity", "hp"] as const;
export type Attribute = (typeof ATTRIBUTES)[number];

/** Moltiplicatore di vantaggio sul triangolo. Da calibrare sul gioco reale. */
export const ATTRIBUTE_ADVANTAGE = 1.25;
export const ATTRIBUTE_DISADVANTAGE = 0.8;

/** Rango massimo raggiungibile fondendo le carte. */
export const MAX_CARD_RANK = 3;

/** Moltiplicatore per rango di carta, indicizzato da rango 1. Segnaposto. */
export const RANK_MULTIPLIER: readonly number[] = [1, 1, 1.3, 1.6];

/** Carte pescate per turno. */
export const DRAW_COUNT = 7;
/** Carte giocabili per turno. */
export const PLAYS_PER_TURN = 3;
/** Turni oltre i quali si considera il tentativo fallito. */
export const DEFAULT_MAX_TURNS = 30;
/** Gauge accumulata per carta giocata e soglia dell'ultimate. */
export const GAUGE_PER_CARD = 1;
export const ULTIMATE_GAUGE_COST = 4;

export const STAT_MODEL: readonly StatDefinition[] = [
  { key: "attack", label: "Attacco", kind: "flat", defaultValue: 0 },
  { key: "defense", label: "Difesa", kind: "flat", defaultValue: 0 },
  { key: "hp", label: "Punti vita", kind: "flat", defaultValue: 0 },
  { key: "crit_rate", label: "Prob. critico", kind: "percent", defaultValue: 0 },
  { key: "crit_damage", label: "Danno critico", kind: "percent", defaultValue: 0.5 },
  { key: "pierce_rate", label: "Perforazione", kind: "percent", defaultValue: 0 },
  { key: "dmg_bonus_all", label: "Bonus danno", kind: "percent", defaultValue: 0 },
  { key: "def_reduction", label: "Riduzione difesa", kind: "percent", defaultValue: 0 },
  { key: "def_ignore", label: "Ignora difesa", kind: "percent", defaultValue: 0 },
];

export interface SkillData {
  id: string;
  name: string;
  /** moltiplicatore percentuale a rango 1 */
  motionValue: number;
  category: "attack" | "buff" | "debuff" | "ultimate";
  /** buff concessi quando la carta viene giocata */
  grantsBuffs: readonly string[];
}

export interface BuffData {
  id: string;
  name: string;
  /** durata in turni */
  duration: number;
  maxStacks: number;
  appliesTo: "self" | "party" | "target";
  modifiers: readonly { stat: string; mode: "flat" | "percent"; value: number }[];
}

export interface UnitData {
  id: string;
  name: string;
  rarity: number;
  attribute: Attribute;
  role: string;
  iconKey: string;
  /** stat al livello massimo, prima dell'equipaggiamento */
  baseStats: Readonly<Record<string, number>>;
  skills: readonly SkillData[];
  ultimate: SkillData;
  buffs: readonly BuffData[];
}

export const UNITS: readonly UnitData[] = [
  {
    id: "placeholder-str-dps",
    name: "Unita' Forza (segnaposto)",
    rarity: 5,
    attribute: "strength",
    role: "dps",
    iconKey: "placeholder/str-dps",
    baseStats: {
      attack: 3200,
      defense: 1400,
      hp: 28000,
      crit_rate: 0.35,
      crit_damage: 0.9,
      pierce_rate: 0.1,
    },
    skills: [
      {
        id: "str-slash",
        name: "Fendente",
        motionValue: 210,
        category: "attack",
        grantsBuffs: [],
      },
      {
        id: "str-heavy",
        name: "Colpo pesante",
        motionValue: 320,
        category: "attack",
        grantsBuffs: ["str-rage"],
      },
      {
        id: "str-break",
        name: "Spezza guardia",
        motionValue: 150,
        category: "debuff",
        grantsBuffs: ["str-def-break"],
      },
    ],
    ultimate: {
      id: "str-ultimate",
      name: "Colpo decisivo",
      motionValue: 780,
      category: "ultimate",
      grantsBuffs: [],
    },
    buffs: [
      {
        id: "str-rage",
        name: "Furia",
        duration: 2,
        maxStacks: 3,
        appliesTo: "self",
        modifiers: [{ stat: "dmg_bonus_all", mode: "flat", value: 0.15 }],
      },
      {
        id: "str-def-break",
        name: "Difesa infranta",
        duration: 3,
        maxStacks: 1,
        appliesTo: "target",
        modifiers: [{ stat: "def_reduction", mode: "flat", value: 0.3 }],
      },
    ],
  },
  {
    id: "placeholder-dex-support",
    name: "Unita' Destrezza (segnaposto)",
    rarity: 5,
    attribute: "dexterity",
    role: "support",
    iconKey: "placeholder/dex-support",
    baseStats: {
      attack: 2400,
      defense: 1800,
      hp: 31000,
      crit_rate: 0.25,
      crit_damage: 0.6,
      pierce_rate: 0.05,
    },
    skills: [
      {
        id: "dex-strike",
        name: "Affondo",
        motionValue: 180,
        category: "attack",
        grantsBuffs: [],
      },
      {
        id: "dex-rally",
        name: "Incitamento",
        motionValue: 60,
        category: "buff",
        grantsBuffs: ["dex-attack-up"],
      },
      {
        id: "dex-focus",
        name: "Concentrazione",
        motionValue: 80,
        category: "buff",
        grantsBuffs: ["dex-crit-up"],
      },
    ],
    ultimate: {
      id: "dex-ultimate",
      name: "Danza delle lame",
      motionValue: 520,
      category: "ultimate",
      grantsBuffs: ["dex-attack-up"],
    },
    buffs: [
      {
        id: "dex-attack-up",
        name: "Attacco aumentato",
        duration: 3,
        maxStacks: 2,
        appliesTo: "party",
        modifiers: [{ stat: "attack", mode: "percent", value: 0.2 }],
      },
      {
        id: "dex-crit-up",
        name: "Critico aumentato",
        duration: 3,
        maxStacks: 2,
        appliesTo: "party",
        modifiers: [{ stat: "crit_rate", mode: "flat", value: 0.15 }],
      },
    ],
  },
  {
    id: "placeholder-hp-tank",
    name: "Unita' Vita (segnaposto)",
    rarity: 5,
    attribute: "hp",
    role: "tank",
    iconKey: "placeholder/hp-tank",
    baseStats: {
      attack: 2000,
      defense: 2600,
      hp: 42000,
      crit_rate: 0.2,
      crit_damage: 0.5,
      pierce_rate: 0,
    },
    skills: [
      {
        id: "hp-bash",
        name: "Scudata",
        motionValue: 140,
        category: "attack",
        grantsBuffs: [],
      },
      {
        id: "hp-guard",
        name: "Guardia",
        motionValue: 40,
        category: "buff",
        grantsBuffs: ["hp-shield"],
      },
      {
        id: "hp-taunt",
        name: "Provocazione",
        motionValue: 90,
        category: "debuff",
        grantsBuffs: ["hp-weaken"],
      },
    ],
    ultimate: {
      id: "hp-ultimate",
      name: "Baluardo",
      motionValue: 400,
      category: "ultimate",
      grantsBuffs: ["hp-shield"],
    },
    buffs: [
      {
        id: "hp-shield",
        name: "Barriera",
        duration: 2,
        maxStacks: 1,
        appliesTo: "party",
        modifiers: [{ stat: "defense", mode: "percent", value: 0.25 }],
      },
      {
        id: "hp-weaken",
        name: "Indebolimento",
        duration: 3,
        maxStacks: 1,
        appliesTo: "target",
        modifiers: [{ stat: "res_reduction_all", mode: "flat", value: 0.15 }],
      },
    ],
  },
];

export const TARGETS: readonly Target[] = [
  {
    id: "training-dummy",
    name: "Manichino da allenamento",
    level: 80,
    maxHp: 1_000_000,
    defense: 1500,
    resistances: { strength: 0, dexterity: 0, hp: 0 },
    tags: ["dummy"],
  },
  {
    id: "boss-strength",
    name: "Boss - attributo Forza",
    level: 85,
    maxHp: 4_500_000,
    defense: 2600,
    resistances: { strength: 0.1, dexterity: 0.1, hp: 0.1 },
    tags: ["boss", "attribute:strength"],
  },
  {
    id: "boss-dexterity",
    name: "Boss - attributo Destrezza",
    level: 85,
    maxHp: 4_500_000,
    defense: 2600,
    resistances: { strength: 0.1, dexterity: 0.1, hp: 0.1 },
    tags: ["boss", "attribute:dexterity"],
  },
];

export const CHARACTERS: readonly CharacterSummary[] = UNITS.map((unit) => ({
  id: unit.id,
  name: unit.name,
  rarity: unit.rarity,
  affinity: unit.attribute,
  role: unit.role,
  iconKey: unit.iconKey,
}));

export function findUnit(id: string): UnitData | undefined {
  return UNITS.find((unit) => unit.id === id);
}
