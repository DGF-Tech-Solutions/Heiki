"use client";

import Link from "next/link";
import { AwakenStar } from "@/components/ratings/star-display";
import { cx } from "@/components/ui";
import type { HeroRatingSummary } from "@/lib/ratings/types";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    valutaOra: "Valuta l'eroe",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
    votiBreve: (n: number) => `(${n})`,
    ariaLabelSummary: (pve: number, pvp: number, count: number) =>
      `Valutazione della community: PvE ${pve.toFixed(1)}, PvP ${pvp.toFixed(1)}, su ${count} valutazioni. Clicca per vedere le recensioni.`,
    ariaLabelEmpty: "Nessuna valutazione per questo eroe. Clicca per essere il primo a valutarlo.",
  },
  en: {
    valutaOra: "Rate hero",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
    votiBreve: (n: number) => `(${n})`,
    ariaLabelSummary: (pve: number, pvp: number, count: number) =>
      `Community ratings: PvE ${pve.toFixed(1)}, PvP ${pvp.toFixed(1)}, based on ${count} ratings. Click to view evaluations.`,
    ariaLabelEmpty: "No ratings for this hero yet. Click to submit the first review.",
  },
});

interface RatingFactsBadgeProps {
  game: string;
  heroId: string;
  locale: Locale;
  summary: HeroRatingSummary;
  className?: string;
}

function handleTabClick() {
  const radio = document.getElementById("schede-valutazioni") as HTMLInputElement | null;
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
  }
  const schedeSection = document.getElementById("schede");
  if (schedeSection) {
    schedeSection.scrollIntoView({ behavior: "smooth" });
  }
}

export function RatingFactsBadge({
  game,
  heroId,
  locale,
  summary,
  className,
}: RatingFactsBadgeProps) {
  const t = TESTI[locale];

  if (summary.totalRatings === 0) {
    return (
      <Link
        href={`/${game}/eroi/${heroId}?scheda=valutazioni`}
        onClick={handleTabClick}
        aria-label={t.ariaLabelEmpty}
        className={cx(
          "p5-press inline-flex items-center gap-1.5 text-xs text-brand hover:underline focus:outline-hidden",
          className,
        )}
      >
        <AwakenStar game={game} size={15} dimmed ariaHidden />
        <span>{t.valutaOra}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/${game}/eroi/${heroId}?scheda=valutazioni`}
      onClick={handleTabClick}
      aria-label={t.ariaLabelSummary(summary.pveAvg, summary.pvpAvg, summary.totalRatings)}
      className={cx(
        "p5-press inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-ink hover:text-brand focus:outline-hidden",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className="text-ink-3">{t.pveAbbr}</span>
        <AwakenStar game={game} size={14} ariaHidden />
        <span className="font-mono">{summary.pveAvg.toFixed(1)}</span>
      </span>

      <span className="text-ink-4">·</span>

      <span className="inline-flex items-center gap-1">
        <span className="text-ink-3">{t.pvpAbbr}</span>
        <AwakenStar game={game} size={14} ariaHidden />
        <span className="font-mono">{summary.pvpAvg.toFixed(1)}</span>
      </span>

      <span className="font-mono font-normal text-ink-3">
        {t.votiBreve(summary.totalRatings)}
      </span>
    </Link>
  );
}

