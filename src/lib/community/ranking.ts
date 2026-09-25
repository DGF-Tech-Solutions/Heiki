/**
 * Ordinamento del feed.
 *
 * "Popolari" non e' semplicemente il punteggio piu' alto: un post di sei mesi fa
 * con cento voti sotterrerebbe per sempre tutto il resto, e una community in cui
 * la prima pagina non cambia mai smette di essere frequentata. Il punteggio
 * decade con l'eta', quindi restare in alto richiede voti recenti.
 *
 * Funzioni pure e testabili: l'ordinamento e' una decisione di prodotto e deve
 * essere verificabile, non un dettaglio sepolto in una query.
 */

import type { Locale } from "@/lib/i18n/locale";
import type { FeedPost } from "./types";

export type FeedSort = "hot" | "new" | "top";

const FEED_SORT_NAMES: Readonly<Record<FeedSort, Readonly<Record<Locale, string>>>> = {
  hot: { it: "Di tendenza", en: "Trending" },
  new: { it: "Recenti", en: "Latest" },
  top: { it: "Più votati", en: "Top voted" },
};

/** Il nome di un ordinamento del feed nella lingua del sito. */
export function feedSortLabel(sort: FeedSort, locale: Locale): string {
  return FEED_SORT_NAMES[sort][locale];
}

export const FEED_SORTS: readonly { id: FeedSort; label: string }[] = [
  { id: "hot", label: "Di tendenza" },
  { id: "new", label: "Recenti" },
  { id: "top", label: "Piu' votati" },
];

export function isFeedSort(value: unknown): value is FeedSort {
  return value === "hot" || value === "new" || value === "top";
}

/** Ore di grazia: un post appena nato non deve essere penalizzato dall'eta'. */
const GRACE_HOURS = 2;
const DECAY = 1.5;

/**
 * Punteggio di tendenza.
 *
 *     hot = (voti + 1) / (ore + grazia) ^ decadimento
 *
 * Il +1 fa emergere anche i post ancora senza voti: senza, un post nuovo
 * resterebbe a zero e nessuno lo vedrebbe mai, quindi non riceverebbe voti.
 * E' la trappola classica di ogni feed che parte da una community piccola.
 */
export function hotScore(score: number, createdAt: Date, now: Date): number {
  const ageHours = Math.max(0, (now.getTime() - createdAt.getTime()) / 3_600_000);
  return (score + 1) / Math.pow(ageHours + GRACE_HOURS, DECAY);
}

export function sortFeed(
  posts: readonly FeedPost[],
  sort: FeedSort,
  now: Date = new Date(),
): FeedPost[] {
  const copy = posts.slice();

  switch (sort) {
    case "new":
      return copy.sort((a, b) => time(b.createdAt) - time(a.createdAt));

    case "top":
      // A parita' di voti vince il piu' recente: senza il secondo criterio
      // l'ordine dipenderebbe da come il database restituisce le righe.
      return copy.sort((a, b) =>
        b.score === a.score ? time(b.createdAt) - time(a.createdAt) : b.score - a.score,
      );

    case "hot":
    default:
      return copy.sort(
        (a, b) =>
          hotScore(b.score, new Date(b.createdAt), now) -
          hotScore(a.score, new Date(a.createdAt), now),
      );
  }
}

function time(iso: string): number {
  const value = new Date(iso).getTime();
  return Number.isNaN(value) ? 0 : value;
}

/** Etichetta relativa compatta: "3 min", "5 h", "2 g" ("2 d" in inglese). */
export function relativeTime(iso: string, now: Date = new Date(), locale: Locale = "it"): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const en = locale === "en";

  const seconds = Math.max(0, Math.round((now.getTime() - then) / 1000));
  if (seconds < 60) return en ? "now" : "ora";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;

  const days = Math.round(hours / 24);
  if (days < 30) return en ? `${days} d` : `${days} g`;

  const months = Math.round(days / 30);
  if (months < 12) return en ? `${months} mo` : `${months} mesi`;

  const years = Math.round(months / 12);
  return en ? `${years} y` : `${years} anni`;
}
