"use client";

import { AwakenStar } from "@/components/ratings/star-display";
import { openRatingsTab } from "@/components/ratings/open-ratings-tab";
import { cx } from "@/components/ui";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    valutaOra: "Valuta l'eroe",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
    votiBreve: (n: number) => `(${n})`,
    ariaLabelSummary: (pve: number, pvp: number, count: number) =>
      `Valutazione della community: PvE ${pve.toFixed(1)}, PvP ${pvp.toFixed(1)}, su ${count} ${count === 1 ? "valutazione" : "valutazioni"}. Clicca per vedere le recensioni.`,
    ariaLabelEmpty: "Nessuna valutazione per questo eroe. Clicca per essere il primo a valutarlo.",
  },
  en: {
    valutaOra: "Rate hero",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
    votiBreve: (n: number) => `(${n})`,
    ariaLabelSummary: (pve: number, pvp: number, count: number) =>
      `Community ratings: PvE ${pve.toFixed(1)}, PvP ${pvp.toFixed(1)}, based on ${count} ${count === 1 ? "rating" : "ratings"}. Click to view reviews.`,
    ariaLabelEmpty: "No ratings for this hero yet. Click to submit the first review.",
  },
});

/**
 * Solo i numeri che il badge mostra. Prima riceveva l'intero riepilogo, e le
 * venti recensioni coi commenti e gli id degli utenti finivano serializzate
 * nella pagina di ogni eroe, per un componente che non le legge.
 */
interface RatingFactsBadgeProps {
  game: string;
  heroId: string;
  locale: Locale;
  pveAvg: number;
  pvpAvg: number;
  totalRatings: number;
  className?: string;
}

export function RatingFactsBadge({
  game,
  heroId,
  locale,
  pveAvg,
  pvpAvg,
  totalRatings,
  className,
}: RatingFactsBadgeProps) {
  const t = TESTI[locale];

  if (totalRatings === 0) {
    return (
      <a
        href={`/${game}/eroi/${heroId}?scheda=valutazioni`}
        onClick={(event) => openRatingsTab(event)}
        aria-label={t.ariaLabelEmpty}
        className={cx(
          "p5-press inline-flex items-center gap-1.5 text-xs text-brand hover:underline",
          className,
        )}
      >
        <AwakenStar game={game} size={15} dimmed ariaHidden />
        <span>{t.valutaOra}</span>
      </a>
    );
  }

  return (
    <a
      href={`/${game}/eroi/${heroId}?scheda=valutazioni`}
      onClick={(event) => openRatingsTab(event)}
      aria-label={t.ariaLabelSummary(pveAvg, pvpAvg, totalRatings)}
      className={cx(
        "p5-press inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-ink hover:text-brand",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className="text-ink-3">{t.pveAbbr}</span>
        <AwakenStar game={game} size={14} ariaHidden />
        <span className="font-mono">{pveAvg.toFixed(1)}</span>
      </span>

      <span className="text-ink-4">·</span>

      <span className="inline-flex items-center gap-1">
        <span className="text-ink-3">{t.pvpAbbr}</span>
        <AwakenStar game={game} size={14} ariaHidden />
        <span className="font-mono">{pvpAvg.toFixed(1)}</span>
      </span>

      <span className="font-mono font-normal text-ink-3">
        {t.votiBreve(totalRatings)}
      </span>
    </a>
  );
}
