/**
 * Guide: tipi condivisi.
 *
 * Una guida qui non e' un articolo: e' un contenuto che dichiara in quale patch
 * e' stato verificato. E' la differenza fra un sito di guide che invecchia in
 * silenzio e uno in cui chi legge sa quanto fidarsi. Il campo `verifiedPatch`
 * non e' un extra: e' il motivo per cui questa sezione esiste.
 */

import type { Bilingual, Locale } from "@/lib/i18n/locale";
import { slugify } from "@/lib/markdown";

export const GUIDE_STATUSES = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;

export type GuideStatus = (typeof GUIDE_STATUSES)[number];

const STATUS_NAMES: Readonly<Record<GuideStatus, Bilingual>> = {
  DRAFT: { it: "Bozza", en: "Draft" },
  IN_REVIEW: { it: "In revisione", en: "In review" },
  PUBLISHED: { it: "Pubblicata", en: "Published" },
  ARCHIVED: { it: "Archiviata", en: "Archived" },
};

/** Lo stato di una guida nella lingua del sito. */
export function statusLabel(status: GuideStatus, locale: Locale): string {
  return STATUS_NAMES[status][locale];
}

/** I nomi in italiano. Per chi non passa ancora la lingua: usa statusLabel. */
export const STATUS_LABELS: Readonly<Record<GuideStatus, string>> = {
  DRAFT: STATUS_NAMES.DRAFT.it,
  IN_REVIEW: STATUS_NAMES.IN_REVIEW.it,
  PUBLISHED: STATUS_NAMES.PUBLISHED.it,
  ARCHIVED: STATUS_NAMES.ARCHIVED.it,
};

export interface GuideAuthor {
  username: string;
  displayName: string;
  accent: string;
}

export interface GuideSummary {
  id: string;
  game: string;
  slug: string;
  title: string;
  excerpt: string;
  status: GuideStatus;
  /** patch in cui i numeri sono stati controllati; null = mai dichiarata */
  verifiedPatch: string | null;
  /** personaggio a cui la guida e' agganciata, se ce n'e' uno */
  characterId: string | null;
  author: GuideAuthor;
  publishedAt: string | null;
  updatedAt: string;
}

export interface GuideDetail extends GuideSummary {
  body: string;
  /** cronologia delle modifiche: chi ha cambiato cosa e in quale patch */
  revisions: readonly GuideRevision[];
}

export interface GuideRevision {
  id: string;
  editor: string;
  patch: string | null;
  note: string | null;
  createdAt: string;
}

export interface CreateGuideInput {
  game: string;
  title: string;
  body: string;
  characterId: string | null;
}

/**
 * Uno slug leggibile ricavato dal titolo.
 *
 * Non e' l'identificativo: quello resta l'id. Lo slug serve solo a rendere
 * l'indirizzo leggibile, quindi se due guide finiscono con lo stesso testo la
 * seconda prende un suffisso invece di rubare l'indirizzo alla prima.
 */
export function guideSlug(title: string, taken: ReadonlySet<string> = new Set()): string {
  // La normalizzazione e' la stessa delle ancore dei titoli: due funzioni
  // diverse produrrebbero indirizzi diversi per lo stesso testo.
  const base = slugify(title).slice(0, 70) || "guida";

  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

/**
 * Una guida e' da rivedere quando la patch dichiarata non e' quella corrente.
 *
 * Anche l'assenza di dichiarazione conta come "da rivedere": non sapere in che
 * patch e' stata controllata e' esattamente la condizione da segnalare.
 */
export function isStale(verifiedPatch: string | null, currentPatch: string): boolean {
  return verifiedPatch !== currentPatch;
}
