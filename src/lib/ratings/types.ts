/**
 * Tipi e costanti per il sistema di valutazione degli eroi.
 *
 * Gli utenti possono valutare ogni eroe su due dimensioni principali (PvE e PvP),
 * indicare il contenuto di gioco in cui secondo loro l'eroe spicca di piu' e
 * lasciare un commento o consiglio facoltativo.
 */

export const BEST_CONTENTS = {
  pvp: {
    key: "pvp",
    label: { it: "PvP (Scontro)", en: "PvP" },
  },
  "creature-nest": {
    key: "creature-nest",
    label: { it: "Bestie Demoniache", en: "Demonic Beasts" },
  },
  "death-match": {
    key: "death-match",
    label: { it: "Scontri Finali", en: "Death Match" },
  },
  "demon-king": {
    key: "demon-king",
    label: { it: "Re Demone", en: "Demon King" },
  },
  "supreme-deity": {
    key: "supreme-deity",
    label: { it: "Divinità Suprema", en: "Supreme Deity" },
  },
  "hero-arena": {
    key: "hero-arena",
    label: { it: "Arena degli Eroi", en: "Hero Arena" },
  },
  "guild-boss": {
    key: "guild-boss",
    label: { it: "Boss dell'Ordine", en: "Knighthood Boss" },
  },
  "general-pve": {
    key: "general-pve",
    label: { it: "Storia & Farming PvE", en: "Story & General PvE" },
  },
} as const;

export type BestContentKey = keyof typeof BEST_CONTENTS;

export const BEST_CONTENT_KEYS = Object.keys(BEST_CONTENTS) as readonly BestContentKey[];

export interface UserRatingRecord {
  id: string;
  pveScore: number;
  pvpScore: number;
  bestContent: BestContentKey | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityRatingEntry {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    accent?: string | null;
  };
  pveScore: number;
  pvpScore: number;
  bestContent: BestContentKey | null;
  comment: string | null;
  updatedAt: string;
}

export interface ContentDistributionItem {
  key: BestContentKey;
  label: { readonly it: string; readonly en: string };
  count: number;
  percentage: number;
}

export interface HeroRatingSummary {
  heroId: string;
  pveAvg: number;
  pvpAvg: number;
  totalRatings: number;
  distribution: ContentDistributionItem[];
  userRating: UserRatingRecord | null;
  recentRatings: CommunityRatingEntry[];
}
