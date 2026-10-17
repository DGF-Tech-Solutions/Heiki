/**
 * Tipi e costanti per il Tier List Maker.
 */

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
  label: string;
  hex: string;
}

export const TIER_COLORS: readonly TierColorOption[] = [
  { label: "Rosso", hex: "#e61421" },
  { label: "Arancione", hex: "#ff6b00" },
  { label: "Ambra", hex: "#f59e0b" },
  { label: "Oro", hex: "#ffd21f" },
  { label: "Verde Smeraldo", hex: "#10b981" },
  { label: "Verde Chiaro", hex: "#5fd38a" },
  { label: "Ciano", hex: "#06b6d4" },
  { label: "Azzurro", hex: "#38bdf8" },
  { label: "Blu", hex: "#3b82f6" },
  { label: "Viola", hex: "#a855f7" },
  { label: "Magenta", hex: "#ec4899" },
  { label: "Rosa Acceso", hex: "#ff4f9a" },
  { label: "Grigio Ardesia", hex: "#64748b" },
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

