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

/**
 * I colori delle righe. Sono anche gli unici che il salvataggio accetta
 * (validation.ts): un colore qualsiasi finirebbe tale e quale nel PNG.
 */
export const TIER_COLORS: readonly TierColorOption[] = [
  { label: { it: "Rosso", en: "Red" }, hex: "#e61421" },
  { label: { it: "Arancione", en: "Orange" }, hex: "#ff6b00" },
  { label: { it: "Ambra", en: "Amber" }, hex: "#f59e0b" },
  { label: { it: "Oro", en: "Gold" }, hex: "#ffd21f" },
  { label: { it: "Verde smeraldo", en: "Emerald" }, hex: "#10b981" },
  { label: { it: "Verde chiaro", en: "Light green" }, hex: "#5fd38a" },
  { label: { it: "Ciano", en: "Cyan" }, hex: "#06b6d4" },
  { label: { it: "Azzurro", en: "Sky blue" }, hex: "#38bdf8" },
  { label: { it: "Blu", en: "Blue" }, hex: "#3b82f6" },
  { label: { it: "Viola", en: "Purple" }, hex: "#a855f7" },
  { label: { it: "Magenta", en: "Magenta" }, hex: "#ec4899" },
  { label: { it: "Rosa acceso", en: "Hot pink" }, hex: "#ff4f9a" },
  { label: { it: "Grigio ardesia", en: "Slate gray" }, hex: "#64748b" },
];

export function defaultTiers(): TierRow[] {
  return [
    { id: "tier-s-plus", label: "S+", color: "#e61421", heroIds: [] },
    { id: "tier-s", label: "S", color: "#ff6b00", heroIds: [] },
    { id: "tier-a", label: "A", color: "#ffd21f", heroIds: [] },
    { id: "tier-b", label: "B", color: "#5fd38a", heroIds: [] },
    { id: "tier-c", label: "C", color: "#38bdf8", heroIds: [] },
    { id: "tier-d", label: "D", color: "#a855f7", heroIds: [] },
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
