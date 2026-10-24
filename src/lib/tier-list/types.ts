/**
 * Tipi e costanti per il Tier List Maker.
 */

import type { Bilingual } from "@/lib/i18n/locale";

export interface TierRow {
  id: string;
  label: string;
  color: string;
  heroIds: string[];
}

export interface TierHeroItem {
  id: string;
  name: string;
  epithet?: string;
  rarity: string;
  affinity: string;
  affinityId?: number;
  cardSrc: string;
}

export interface TierColorOption {
  /** il nome nelle due lingue: e' il testo del pulsante per chi usa un lettore di schermo */
  label: Bilingual;
  hex: string;
}

/*
 * Le righe predefinite, dal fuoco alla cenere (24/10). Prima erano un
 * arcobaleno di colori di serie di Tailwind (ambra, smeraldo, ciano, viola...),
 * il segno piu' chiaro di una pagina montata e non disegnata, e le lettere
 * bianche sopra non si leggevano. Ora la scala nasce dal mondo del sito: in cima
 * il rosso di Grand Cross (lo stesso di `--color-brand`), poi il fuoco, la
 * brace, l'osso, la cenere e il carbone. Si legge in ordine senza leggere le
 * lettere: piu' caldo vuol dire piu' forte. Le scritte prendono l'inchiostro dal
 * fondo (colors.ts), e ognuno di questi regge almeno 4,5:1.
 */
export const TIER_LADDER = [
  "#e61421", // cremisi, S+
  "#f0641c", // fuoco, S
  "#f2b01e", // brace, A
  "#e8dcc2", // osso, B
  "#8c837a", // cenere, C
  "#57504b", // carbone, D
] as const;

/**
 * I colori che si possono scegliere: la scala predefinita, poi gli altri colori
 * del sito (l'oro e il rosa dei suoi segnali, il verde dei bonus, gli accenti
 * dei temi Giada, Notte e Viola). Insieme a LEGACY_TIER_COLORS sono gli unici
 * che il salvataggio accetta (validation.ts): un colore qualsiasi finirebbe tale
 * e quale nel PNG.
 */
export const TIER_COLORS: readonly TierColorOption[] = [
  { label: { it: "Cremisi", en: "Crimson" }, hex: TIER_LADDER[0] },
  { label: { it: "Fuoco", en: "Fire" }, hex: TIER_LADDER[1] },
  { label: { it: "Brace", en: "Ember" }, hex: TIER_LADDER[2] },
  { label: { it: "Osso", en: "Bone" }, hex: TIER_LADDER[3] },
  { label: { it: "Cenere", en: "Ash" }, hex: TIER_LADDER[4] },
  { label: { it: "Carbone", en: "Charcoal" }, hex: TIER_LADDER[5] },
  { label: { it: "Oro", en: "Gold" }, hex: "#ffd21f" },
  { label: { it: "Rosa", en: "Pink" }, hex: "#ff4f9a" },
  { label: { it: "Verde", en: "Green" }, hex: "#5fd38a" },
  { label: { it: "Giada", en: "Jade" }, hex: "#0b836b" },
  { label: { it: "Cobalto", en: "Cobalt" }, hex: "#1c64e8" },
  { label: { it: "Viola", en: "Violet" }, hex: "#8b51ef" },
];

/**
 * I colori della tavolozza di prima del 24/10. Non si offrono piu', ma le liste
 * salvate, i backup, i link `#data=` e le bozze nel browser li hanno ancora:
 * il controllo li accetta, altrimenti una lista vecchia non si potrebbe piu'
 * salvare e la bozza si perderebbe all'apertura.
 */
export const LEGACY_TIER_COLORS: readonly string[] = [
  "#e61421",
  "#ff6b00",
  "#f59e0b",
  "#ffd21f",
  "#10b981",
  "#5fd38a",
  "#06b6d4",
  "#38bdf8",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#ff4f9a",
  "#64748b",
];

/** Il colore di una riga aggiunta in fondo: il gradino della scala al suo posto, poi il carbone. */
export function nextTierColor(rowCount: number): string {
  return TIER_LADDER[Math.min(rowCount, TIER_LADDER.length - 1)]!;
}

export function defaultTiers(): TierRow[] {
  return [
    { id: "tier-s-plus", label: "S+", color: TIER_LADDER[0], heroIds: [] },
    { id: "tier-s", label: "S", color: TIER_LADDER[1], heroIds: [] },
    { id: "tier-a", label: "A", color: TIER_LADDER[2], heroIds: [] },
    { id: "tier-b", label: "B", color: TIER_LADDER[3], heroIds: [] },
    { id: "tier-c", label: "C", color: TIER_LADDER[4], heroIds: [] },
    { id: "tier-d", label: "D", color: TIER_LADDER[5], heroIds: [] },
  ];
}

export interface TierListAuthor {
  id: string;
  username: string;
  displayName: string;
  role?: string;
}

export interface SavedTierListSummary {
  id: string;
  title: string;
  description?: string | null;
  game: string;
  gameName?: string;
  isPublic: boolean;
  heroCount: number;
  tierCount: number;
  topHeroIds: string[];
  createdAt: string;
  updatedAt: string;
  author?: TierListAuthor;
  isOwner?: boolean;
  tiers?: TierRow[];
}

export interface SavedTierListDetail extends SavedTierListSummary {
  tiers: TierRow[];
}

export interface TierListBackupItem {
  id?: string;
  title: string;
  description?: string | null;
  game: string;
  /** se compariva nel profilo: un backup senza questo dato non dice cosa era privato */
  isPublic?: boolean;
  tiers: TierRow[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TierListBackupFile {
  version: 1;
  exportedAt: string;
  username: string;
  tierLists: TierListBackupItem[];
}
