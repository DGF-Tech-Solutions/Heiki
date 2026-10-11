/**
 * Una strategia pubblicata, nella sezione «Squadre consigliate» di una pagina
 * dell'Endgame.
 *
 * La squadra e' la prima cosa: e' quello che si cerca. Il titolo di un consiglio
 * di squadra lo scrive il sito, e qui sarebbe una ripetizione della sezione
 * («Squadra: Demone rosso · Inferno» sotto «Squadre consigliate per Demone rosso ·
 * Inferno»): al suo posto, di chi e'. Si vota dalla scheda, come nel feed.
 */

import Link from "next/link";
import { VoteControl } from "@/components/community/vote-control";
import { cx, display, moreLinkClass, MoreArrow } from "@/components/ui";
import { relativeTime } from "@/lib/community/ranking";
import { testi, type Locale } from "@/lib/i18n/locale";
import type { GameModule } from "@/lib/games/types";
import { setView, teamView } from "@/lib/strategies/view";
import type { StrategyCardData } from "@/lib/strategies/types";
import { KindTag, SetLine, TeamStrip } from "./strategy-parts";

const TESTI = testi({
  it: {
    squadraDi: (chi: string) => `La squadra di ${chi}`,
    di: "di",
    risposte: (n: number) => (n === 0 ? "nessuna risposta" : n === 1 ? "1 risposta" : `${n} risposte`),
    leggi: "Leggi la guida",
    discuti: "Discussione",
  },
  en: {
    squadraDi: (chi: string) => `${chi}'s team`,
    di: "by",
    risposte: (n: number) => (n === 0 ? "no replies" : n === 1 ? "1 reply" : `${n} replies`),
    leggi: "Read the guide",
    discuti: "Discussion",
  },
});

export function StrategyCard({
  data,
  module,
  locale,
  myVote = 0,
  now,
}: {
  data: StrategyCardData;
  module: GameModule;
  locale: Locale;
  myVote?: -1 | 0 | 1;
  now: Date;
}) {
  const t = TESTI[locale];
  const href = `/${data.game}/post/${data.postId}`;
  const set = setView(module, data.artifactSet, locale);
  const title = data.kind === "team" ? t.squadraDi(data.author.displayName) : data.title;

  return (
    <article
      data-accent={data.author.accent}
      className="p5-corner flex min-w-0 flex-col gap-3 border border-rule bg-paper-2 p-3.5 transition-colors hover:border-ink-3"
    >
      <header className="flex items-start gap-2.5">
        <VoteControl targetType="POST" targetId={data.postId} score={data.score} myVote={myVote} compact />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-ink-3">
            <KindTag kind={data.kind} phases={data.phaseNotes} locale={locale} />
            {data.kind === "guide" ? (
              <span>
                {t.di}{" "}
                <Link href={`/u/${data.author.username}`} className="font-medium text-ink-2 hover:text-ink">
                  {data.author.displayName}
                </Link>
              </span>
            ) : null}
          </div>
          <h3 className={cx(display, "m-0 text-[17px] leading-[1.15] [font-variation-settings:'wdth'_90]")}>
            <Link href={href} className="hover:text-brand-deep">
              {title}
            </Link>
          </h3>
        </div>
      </header>

      <TeamStrip team={teamView(module, data.team, locale)} locale={locale} />

      {set ? <SetLine set={set} locale={locale} /> : null}

      <footer className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-rule-2 pt-2.5 text-xs text-ink-3">
        <span className="font-mono text-[11px]">{relativeTime(data.createdAt, now, locale)}</span>
        <span>{t.risposte(data.commentCount)}</span>
        <Link href={href} className={cx(moreLinkClass, "ml-auto text-[12px]")}>
          {data.kind === "guide" ? t.leggi : t.discuti}
          <MoreArrow />
        </Link>
      </footer>
    </article>
  );
}
