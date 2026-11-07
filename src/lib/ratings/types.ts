/**
 * Tipi e costanti per il sistema di valutazione degli eroi.
 *
 * Gli utenti possono valutare ogni eroe su due dimensioni principali (PvE e PvP),
 * indicare il contenuto di gioco in cui secondo loro l'eroe spicca di piu' e
 * lasciare un commento o consiglio facoltativo.
 */

import type { Role } from "@/lib/auth/permissions";
import { intlLocale, type Locale } from "@/lib/i18n/locale";

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

export function isBestContentKey(value: string): value is BestContentKey {
  return Object.hasOwn(BEST_CONTENTS, value);
}

/**
 * Lunghezza massima del commento. Un numero solo per il modulo, che taglia
 * mentre si scrive, e per il controllo sul server, che non si fida del modulo.
 */
export const COMMENT_MAX_LENGTH = 280;

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
    role: Role;
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

/** Un voto medio con una cifra decimale, nel formato della lingua: 4,5 e non 4.5. */
export function formatScore(score: number, locale: Locale): string {
  return score.toLocaleString(intlLocale(locale), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
