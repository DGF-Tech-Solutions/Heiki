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
  type BattleChange,
  type HeroBattle,
  type HeroTotals,
  type SometimesLine,
  type StatTotal,
  type TeamTotals,
  type TotalPart,
} from "@/lib/games/team";
import type { TeamSource } from "@/lib/games/team-types";
import { useLocale } from "@/lib/i18n/client";
import { rem } from "@/lib/rem";
import {
  battlePartLine,
  formatPercent,
  formatWhole,
  otherStatsLine,
  statLabel,
  type BuilderData,
  type BuilderHero,
  type Texts,
} from "./team-labels";

const MAIN = new Set<string>(MAIN_STATS);

function MainNumber({ label, value, zero, sub }: { label: string; value: string; zero: boolean; sub?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] leading-tight text-ink-3">{label}</dt>
      <dd className={cx("m-0 font-mono text-[15px] leading-snug", zero ? "text-ink-3" : "text-ink")}>{value}</dd>
      {sub ? <dd className={cx("m-0 font-mono text-[12px] leading-snug", zero ? "text-ink-3" : "text-ink-2")}>{sub}</dd> : null}
    </div>
  );
}

const BATTLE_MAIN = ["atk", "def", "hp"] as const;

/**
 * Da dove vengono i numeri in battaglia: i numeri d'inizio, poi passiva per
 * passiva cosa ha cambiato, nell'ordine del gioco. Le righe di una stessa passiva
 * del sito stanno insieme: l'Unica di Escanor e le sue righe nascoste sono
 * un'Unica sola.
 */
function BattleList({
  battle,
  data,
  heroes,
  t,
}: {
  battle: HeroBattle;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  t: Texts;
}) {
  const locale = useLocale();
  const sourceName = useSourceName(data, heroes, t);
  return (
    <ul className="m-0 grid list-none gap-2 p-0 text-[12.5px] leading-snug text-ink-2">
      <li>
        <span className="font-semibold text-ink">{t.partenza[battle.from]}</span>
        <span className="block font-mono">
          {BATTLE_MAIN.map((stat) => `${t.stat[stat]} ${formatWhole(battle.start[stat], locale)}`).join(" · ")}
        </span>
      </li>
      {battleGroups(battle).map((group) => (
        <li key={group.key}>
          <span className="font-semibold text-ink">
            {group.source && group.from
              ? sourceName({ from: group.from, source: group.source })
              : group.from
                ? t.passivaNascosta(heroes.get(group.from)?.name ?? group.from)
                : t.tetto}
          </span>
          {group.buff ? <span> {t.viaBuff}</span> : null}
          <span className="block">{battlePartLine(group.changes, t, locale)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Le parti del simulatore raccolte per passiva del sito, nell'ordine della prima. */
function battleGroups(battle: HeroBattle) {
  const groups = new Map<
    string,
    { key: string; from: string | null; source: TeamSource | null; buff: boolean; changes: BattleChange[] }
  >();
  for (const part of battle.parts) {
    const base = part.source ? `${part.from}:${part.source.kind}:${part.source.id}` : `${part.from}:${part.passive}`;
    const key = `${base}:${part.buff !== null ? "b" : ""}`;
    const group = groups.get(key) ?? { key, from: part.from, source: part.source, buff: part.buff !== null, changes: [] };
    group.changes.push(...part.changes);
    groups.set(key, group);
  }
  return [...groups.values()];
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
  const battle = totals.battle;
  // col simulatore, dalle frasi restano solo i danni inflitti e subiti
  const parts = partsOf(battle ? totals.totals.filter((total) => total.key.startsWith("dmg")) : totals.totals);
  const groups = battle ? battleGroups(battle).length : 0;
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
              const flat = battle && (BATTLE_MAIN as readonly string[]).includes(stat) ? battle.firstTurn[stat as (typeof BATTLE_MAIN)[number]] : null;
              return flat !== null && flat !== undefined ? (
                <MainNumber
                  key={stat}
                  label={t.stat[stat]}
                  value={formatWhole(flat, locale)}
                  sub={formatPercent(value, locale)}
                  zero={value === 0}
                />
              ) : (
                <MainNumber key={stat} label={t.stat[stat]} value={formatPercent(value, locale)} zero={value === 0} />
              );
            })}
          </dl>
          {others.length > 0 ? (
            <p className="mt-2 mb-0 text-[12.5px] leading-snug text-ink-2">{otherStatsLine(others, t, locale)}</p>
          ) : null}
          {battle ? (
            <details className="mt-1.5">
              <summary className="cursor-pointer py-1 text-[12px] text-ink-3 max-sm:py-3">{t.daDove(groups)}</summary>
              <div className="pt-1 pb-1">
                <BattleList battle={battle} data={data} heroes={heroes} t={t} />
              </div>
            </details>
          ) : null}
          {parts.length > 0 ? (
            <details className="mt-1.5">
              <summary className="cursor-pointer py-1 text-[12px] text-ink-3 max-sm:py-3">
                {battle ? t.daDoveDanni(parts.length) : t.daDove(parts.length)}
              </summary>
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
  pending,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  totals: TeamTotals;
  /** il simulatore deve ancora arrivare (team-sim-load.ts) */
  pending: boolean;
}) {
  const locale = useLocale();
  const enemies = totals.enemies;
  const simulated = pending || totals.heroes.some((row) => row.battle);
  return (
    <section className="mt-10">
      <h2 className={cx(display, "m-0 text-[clamp(24px,3vw,32px)]")}>{t.numeriTitolo}</h2>
      <p className="mt-1.5 mb-4 max-w-[72ch] text-[13px] text-ink-2">
        {simulated ? `${t.numeriSpiega} ${t.danniDalTesto}` : t.numeriSpiegaVecchio}
      </p>
      {pending ? (
        <p className="m-0 border-t border-rule py-3 text-[13px] text-ink-3" role="status">
          {t.calcoloNumeri}
        </p>
      ) : null}
      {pending
        ? null
        : totals.heroes.map((row) => {
            const hero = heroes.get(row.hero);
            return hero ? <HeroRow key={row.hero} hero={hero} totals={row} t={t} data={data} heroes={heroes} /> : null;
          })}
      {!pending && enemies.length > 0 ? (
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
