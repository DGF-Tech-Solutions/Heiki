"use client";

/**
 * Il totale dei numeri delle passive, eroe per eroe. Richiesta dell'utente del 07/11:
 * dopo chi accende le passive, quanto valgono. I conti stanno in team.ts (`teamTotals`):
 * qui ci sono solo le righe, e sotto ognuna da dove viene ogni numero, con la frase del
 * gioco, perche' un totale che non si puo' controllare non serve a niente.
 *
 * Le cinque colonne di testa sono sempre le stesse e alla stessa altezza per tutti gli
 * eroi (si confrontano a colpo d'occhio); il resto compare solo se c'e'.
 */

import { cx, display, eyebrow } from "@/components/ui";
import { heroCardSrc } from "@/lib/games/heroes";
import {
  MAIN_STATS,
  sentenceText,
  totalValue,
  type HeroTotals,
  type SometimesLine,
  type StatTotal,
  type TeamTotals,
  type TotalPart,
} from "@/lib/games/team";
import { useLocale } from "@/lib/i18n/client";
import { rem } from "@/lib/rem";
import { formatPercent, otherStatsLine, statLabel, type BuilderData, type BuilderHero, type Texts } from "./team-labels";

const MAIN = new Set<string>(MAIN_STATS);

function MainNumber({ label, value, zero }: { label: string; value: string; zero: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] leading-tight text-ink-3">{label}</dt>
      <dd className={cx("m-0 font-mono text-[15px] leading-snug", zero ? "text-ink-3" : "text-ink")}>{value}</dd>
    </div>
  );
}

/** Di chi e' una passiva, in parole: «Unica di Joker». */
function useSourceName(data: BuilderData, heroes: ReadonlyMap<string, BuilderHero>, t: Texts) {
  return (part: Pick<TotalPart, "from" | "source">) => {
    const { source } = part;
    const kind =
      source.kind === "special" && source.special ? (data.specials[source.special]?.label ?? t.tipo.special) : t.tipo[source.kind];
    return t.passivaDi(kind, heroes.get(part.from)?.name ?? part.from);
  };
}

function SentenceList({
  lines,
  data,
  heroes,
  t,
}: {
  lines: readonly (SometimesLine & { readonly count?: number })[];
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  t: Texts;
}) {
  const locale = useLocale();
  const sourceName = useSourceName(data, heroes, t);
  return (
    <ul className="m-0 grid list-none gap-2 p-0 text-[12.5px] leading-snug text-ink-2">
      {lines.map((line) => {
        const sentence = sentenceText(data.team, line.sentence, locale);
        return (
          <li key={`${line.from}-${line.source.id}-${line.sentence}`}>
            <span className="font-semibold text-ink">{sourceName(line)}</span>
            {line.count && line.count > 1 ? <span className="font-mono text-ink-3"> × {line.count}</span> : null}
            <span className="block" lang={sentence.english ? "en" : undefined}>
              {sentence.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Le parti di un eroe, una volta per frase: la stessa frase alimenta piu' statistiche. */
function partsOf(totals: readonly StatTotal[]): TotalPart[] {
  const seen = new Map<string, TotalPart>();
  for (const total of totals) {
    for (const part of total.parts) seen.set(`${part.from}:${part.source.id}:${part.sentence}`, part);
  }
  return [...seen.values()];
}

function HeroRow({
  hero,
  totals,
  t,
  data,
  heroes,
}: {
  hero: BuilderHero;
  totals: HeroTotals;
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
}) {
  const locale = useLocale();
  const others = totals.totals.filter((total) => !MAIN.has(total.key));
  const parts = partsOf(totals.totals);
  return (
    <article className="border-t border-rule py-3">
      <div className="grid items-start gap-x-4 gap-y-2 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
          <img src={heroCardSrc(data.game, hero.id)} alt="" width={44} style={{ width: rem(44) }} height={44} className="shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-[12px]" style={hero.color ? { color: hero.color } : undefined}>
              {hero.epithet}
            </span>
            <span className="block truncate text-[14px] font-semibold text-ink">{hero.name}</span>
          </span>
        </div>
        <div className="min-w-0">
          <dl className="m-0 grid grid-cols-3 gap-x-3 gap-y-2 sm:grid-cols-5">
            {MAIN_STATS.map((stat) => {
              const value = totalValue(totals, stat);
              return <MainNumber key={stat} label={t.stat[stat]} value={formatPercent(value, locale)} zero={value === 0} />;
            })}
          </dl>
          {others.length > 0 ? (
            <p className="mt-2 mb-0 text-[12.5px] leading-snug text-ink-2">{otherStatsLine(others, t, locale)}</p>
          ) : null}
          {parts.length > 0 ? (
            <details className="mt-1.5">
              <summary className="cursor-pointer py-1 text-[12px] text-ink-3 max-sm:py-3">{t.daDove(parts.length)}</summary>
              <div className="pt-1 pb-1">
                <SentenceList lines={parts} data={data} heroes={heroes} t={t} />
              </div>
            </details>
          ) : null}
          {totals.sometimes.length > 0 ? (
            <details>
              <summary className="cursor-pointer py-1 text-[12px] text-ink-3 max-sm:py-3">{t.inCertiMomenti(totals.sometimes.length)}</summary>
              <div className="pt-1 pb-1">
                <SentenceList lines={totals.sometimes} data={data} heroes={heroes} t={t} />
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function TeamNumbers({
  t,
  data,
  heroes,
  totals,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  totals: TeamTotals;
}) {
  const locale = useLocale();
  const enemies = totals.enemies;
  return (
    <section className="mt-10">
      <h2 className={cx(display, "m-0 text-[clamp(24px,3vw,32px)]")}>{t.numeriTitolo}</h2>
      <p className="mt-1.5 mb-4 max-w-[72ch] text-[13px] text-ink-2">{t.numeriSpiega}</p>
      {totals.heroes.map((row) => {
        const hero = heroes.get(row.hero);
        return hero ? <HeroRow key={row.hero} hero={hero} totals={row} t={t} data={data} heroes={heroes} /> : null;
      })}
      {enemies.length > 0 ? (
        <div className="border-t border-rule py-3">
          <p className={cx(eyebrow, "m-0 mb-1")}>{t.suiNemici}</p>
          <p className="m-0 text-[12.5px] leading-snug text-ink-2">
            {enemies.map((total) => `${statLabel(total.key, t)} ${formatPercent(total.value, locale)}`).join(" · ")}
          </p>
          <details className="mt-1.5">
            <summary className="cursor-pointer py-1 text-[12px] text-ink-3 max-sm:py-3">{t.daDove(partsOf(enemies).length)}</summary>
            <div className="pt-1 pb-1">
              <SentenceList lines={partsOf(enemies)} data={data} heroes={heroes} t={t} />
            </div>
          </details>
        </div>
      ) : null}
    </section>
  );
}
