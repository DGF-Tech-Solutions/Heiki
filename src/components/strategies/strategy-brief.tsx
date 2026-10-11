/**
 * Una strategia in una riga, per il feed: il tipo, dove vale (collegamento alla
 * pagina dell'Endgame) e la squadra in piccolo. Il resto e' nella pagina del post.
 */

import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";
import { inLingua } from "@/lib/i18n/locale";
import type { GameModule } from "@/lib/games/types";
import { modeName, selectionLabel, selectionPageHref } from "@/lib/strategies/rules";
import { heroView } from "@/lib/strategies/view";
import type { StrategyBrief } from "@/lib/strategies/types";
import { KindTag } from "./strategy-parts";

export function StrategyBriefLine({
  brief,
  module,
  game,
  locale,
}: {
  brief: StrategyBrief;
  module: GameModule;
  game: string;
  locale: Locale;
}) {
  const label = selectionLabel(module, brief, locale);
  const mode = brief.target ? inLingua(modeName(module, brief.mode), locale) : null;
  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
      <KindTag kind={brief.kind} locale={locale} />
      <Link
        href={selectionPageHref(game, brief, module)}
        className="min-w-0 text-[13px] font-semibold text-ink-2 underline decoration-rule underline-offset-2 hover:text-brand-deep"
      >
        {mode ? `${mode} · ` : ""}
        {label}
      </Link>
      <span className="flex gap-1">
        <span className="sr-only">{brief.heroes.map((id) => heroView(module, id, locale).name).join(", ")}</span>
        {brief.heroes.map((id, i) => {
          const hero = heroView(module, id, locale);
          return (
            // eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita'
            <img
              key={`${id}-${i}`}
              src={hero.card}
              srcSet={`${hero.card} 1x, ${hero.card2x} 2x`}
              alt=""
              aria-hidden
              title={hero.name}
              width={30}
              height={30}
              loading="lazy"
              decoding="async"
              className="h-[30px] w-[30px] bg-paper-3"
            />
          );
        })}
      </span>
    </div>
  );
}
