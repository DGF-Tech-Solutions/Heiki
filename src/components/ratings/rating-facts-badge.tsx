"use client";

import { AwakenStar } from "@/components/ratings/star-display";
import { formatScore } from "@/lib/ratings/types";
import { openRatingsTab } from "@/components/ratings/open-ratings-tab";
import { cx, tapArea } from "@/components/ui";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    valutaOra: "Valuta l'eroe",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
    votiBreve: (n: number) => `(${n})`,
    ariaLabelSummary: (pve: number, pvp: number, count: number) =>
      `Valutazione della community: PvE ${formatScore(pve, "it")}, PvP ${formatScore(pvp, "it")}, su ${count} ${count === 1 ? "valutazione" : "valutazioni"}. Clicca per vedere le recensioni.`,
    ariaLabelEmpty: "Nessuna valutazione per questo eroe. Clicca per essere il primo a valutarlo.",
  },
  en: {
    valutaOra: "Rate hero",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
    votiBreve: (n: number) => `(${n})`,
    ariaLabelSummary: (pve: number, pvp: number, count: number) =>
      `Community ratings: PvE ${formatScore(pve, "en")}, PvP ${formatScore(pvp, "en")}, based on ${count} ${count === 1 ? "rating" : "ratings"}. Click to view reviews.`,
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

/**
 * Il voto nella fascia dei dati della scheda eroe.
 *
 * «Valuta l'eroe» era 12px nel rosso pieno (`text-brand`): 4,0:1 sul fondo
 * della fascia, sotto il 4,5 che serve al testo piccolo, e alto 16px da
 * toccare. Dal 24/10 ha la forma degli altri collegamenti della fascia (il
 * personaggio, il compleanno): stretto e maiuscolo a 15px nel rosso per il
 * testo (`brand-deep`, 6,3:1), e la zona di tocco da 44px (`tapArea`).
 */
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
          tapArea,
          "p5-press inline-flex min-h-[30px] items-center gap-1.5 font-display text-[15px] font-extrabold uppercase leading-tight tracking-[0.02em] text-brand-deep no-underline [font-variation-settings:'wdth'_85] hover:text-ink",
          className,
        )}
      >
        <AwakenStar game={game} size={16} dimmed ariaHidden />
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
        tapArea,
        "p5-press inline-flex min-h-[30px] flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold text-ink no-underline hover:text-brand-deep",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className="text-ink-3">{t.pveAbbr}</span>
        <AwakenStar game={game} size={14} ariaHidden />
        <span className="font-mono">{formatScore(pveAvg, locale)}</span>
      </span>

      <span className="text-ink-3">·</span>

      <span className="inline-flex items-center gap-1">
        <span className="text-ink-3">{t.pvpAbbr}</span>
        <AwakenStar game={game} size={14} ariaHidden />
        <span className="font-mono">{formatScore(pvpAvg, locale)}</span>
      </span>

      <span className="font-mono font-normal text-ink-3">
        {t.votiBreve(totalRatings)}
      </span>
    </a>
  );
}
