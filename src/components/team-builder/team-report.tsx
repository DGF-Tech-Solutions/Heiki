"use client";

/**
 * Come si influenzano gli eroi della squadra: un riquadro per eroe, con le sue
 * passive (cosa da' ai compagni, chi le fa scattare, se sono spente e perche'),
 * cosa riceve dagli altri e quali passive accende. Sotto, quello che vale per
 * tutta la squadra: le regole delle abilita' speciali, gli effetti Luce e
 * Oscurita', gli associati. Scelta dell'utente del 03/10, fra tre anteprime:
 * «per eroe: da' / riceve».
 *
 * Le frasi sono quelle del gioco, nella lingua della pagina (l'inglese dove la
 * frase italiana non si appaia, e allora `lang="en"`); chi riceve e chi fa
 * scattare li dice la lettura della pipeline, e la pagina li mostra come segni
 * (spunta o croce) sui compagni. I conti stanno in team.ts.
 */

import Link from "next/link";
import { GameText } from "@/components/heroes/game-text";
import { IconCheck, IconChevronLeft, IconClose } from "@/components/icons";
import { cx, display, eyebrow, Tag } from "@/components/ui";
import { heroCardSrc, gameIconSrc } from "@/lib/games/heroes";
import {
  fateOf,
  sentenceText,
  type Influence,
  type LinkResult,
  type MemberCheck,
  type MemberResult,
  type SourceResult,
  type TeamAnalysis,
  type TeamSetup,
} from "@/lib/games/team";
import { useLocale } from "@/lib/i18n/client";
import { inLingua } from "@/lib/i18n/locale";
import {
  conditionLabel,
  describeWho,
  offLabel,
  slotLabel,
  type BuilderData,
  type BuilderHero,
  type Texts,
} from "./team-labels";

export function TeamReport({
  t,
  data,
  heroes,
  setup,
  analysis,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  setup: TeamSetup;
  analysis: TeamAnalysis;
}) {
  const accesi = new Set(analysis.enables.map((i) => `${i.to}:${i.source}`)).size;
  return (
    <section className="mt-10">
      <h2 className={cx(display, "m-0 text-[clamp(24px,3vw,32px)]")}>{t.resoconto}</h2>
      <p className="mt-1.5 mb-0 text-[13px] text-ink-2">
        {t.riepilogo(analysis.gives.length, accesi)}
        {analysis.allMet + analysis.allBroken > 0 ? ` · ${t.condTutti(analysis.allMet, analysis.allBroken)}` : ""}
        {analysis.leftmostOff > 0 ? ` · ${t.specialiSpente(analysis.leftmostOff)}` : ""}
      </p>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {analysis.members.map((member) => (
          <MemberCard key={member.hero} t={t} data={data} heroes={heroes} setup={setup} analysis={analysis} member={member} />
        ))}
      </div>

      <TeamWide t={t} data={data} heroes={heroes} setup={setup} analysis={analysis} />
    </section>
  );
}

/* ------------------------------------------------------------ un eroe -- */

function MemberCard({
  t,
  data,
  heroes,
  setup,
  analysis,
  member,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  setup: TeamSetup;
  analysis: TeamAnalysis;
  member: MemberResult;
}) {
  const locale = useLocale();
  const hero = heroes.get(member.hero)!;
  const baseRace = hero.race;
  const extra = member.races.filter((race) => race !== baseRace).map((race) => data.labels.race[race] ?? race);
  const received = analysis.gives.filter((i) => i.to === member.hero);
  const lights = analysis.enables.filter((i) => i.from === member.hero);

  return (
    <article className="p5-corner min-w-0 border border-rule bg-paper-2 p-4 text-[13px]">
      <header className="flex items-center gap-3 border-b border-rule-2 pb-3">
        <Link href={`/${data.game}/eroi/${hero.id}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
          <img src={heroCardSrc(data.game, hero.id)} alt="" width={56} height={56} className="shadow-[3px_3px_0_var(--color-brand)]" />
        </Link>
        <div className="min-w-0">
          <p className={cx(eyebrow, "m-0", member.bench && "text-gold")}>
            {slotLabel(member.slot, setup.bench, t)}
            {member.bench ? ` · ${t.inPanchinaTag}` : ""}
          </p>
          <p className="m-0 truncate text-[12px]" style={hero.color ? { color: hero.color } : undefined}>
            {hero.epithet}
          </p>
          <Link
            href={`/${data.game}/eroi/${hero.id}`}
            className="block truncate font-display text-[17px] leading-tight font-black text-ink uppercase [font-variation-settings:'wdth'_78] hover:text-brand-deep"
          >
            {hero.name}
          </Link>
          {extra.length > 0 ? <p className="m-0 text-[12px] text-ink-3">{t.ancheCome(extra.join(", "))}</p> : null}
        </div>
      </header>

      <h3 className={cx(eyebrow, "mt-4 mb-2")}>{t.lePassive}</h3>
      <div className="grid gap-3">
        {member.sources.map((source) => (
          <SourceBlock key={`${source.source.kind}-${source.source.id}`} t={t} data={data} heroes={heroes} member={member} result={source} />
        ))}
      </div>

      <h3 className={cx(eyebrow, "mt-4 mb-1.5")}>{t.riceve}</h3>
      <InfluenceList t={t} data={data} heroes={heroes} list={received} side="from" locale={locale} />

      <h3 className={cx(eyebrow, "mt-4 mb-1.5")}>{t.faScattare}</h3>
      <InfluenceList t={t} data={data} heroes={heroes} list={lights} side="to" locale={locale} />
    </article>
  );
}

function SourceBlock({
  t,
  data,
  heroes,
  member,
  result,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  member: MemberResult;
  result: SourceResult;
}) {
  const locale = useLocale();
  const { source } = result;
  const kind =
    source.kind === "special" && source.special ? (data.specials[source.special]?.label ?? t.tipo.special) : t.tipo[source.kind];
  const name = inLingua(source.name, locale) ?? source.id;
  const group = result.text >= 0 ? data.team.texts[result.text]?.group : null;
  const groupRule = group === null || group === undefined ? null : data.team.groups[group] ?? null;
  const by = result.by ? heroes.get(result.by)?.name ?? result.by : null;

  return (
    // Accesa o spenta la dice l'etichetta del tipo (rossa se la passiva vale), non
    // piu' un filo colorato a sinistra (10/10)
    <div>
      {/* div e non p: il nome passa da GameText, che disegna dei paragrafi */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Tag tone={result.active ? "brand" : "neutral"} className={result.active ? undefined : "opacity-70"}>
          {kind}
        </Tag>
        <GameText text={name} className="inline font-semibold text-ink [&>p]:inline" />
        {data.conditionIcons
          ? source.conditions.map((code) => {
              const condition = data.conditions[code];
              if (!condition) return null;
              return (
                // eslint-disable-next-line @next/next/no-img-element -- icone del gioco
                <img
                  key={code}
                  src={gameIconSrc(data.game, "condizione", condition.icon)}
                  alt={condition.text}
                  title={condition.text}
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              );
            })
          : null}
        {result.active ? null : (
          <span className="p5-cut-sm bg-paper-3 px-2 py-px text-[12px] leading-tight text-down">
            {`${t.spenta}: ${offLabel(result.off!, t, by)}`}
          </span>
        )}
      </div>
      {result.links.length === 0 ? (
        <p className="mt-1 mb-0 text-[12px] text-ink-3">{t.nessunaPerCompagni}</p>
      ) : (
        <ul className="mt-1.5 mb-0 grid list-none gap-2.5 p-0">
          {result.links.map((link, i) => (
            <LinkBlock
              key={i}
              t={t}
              data={data}
              heroes={heroes}
              member={member}
              result={link}
              sourceActive={result.active}
              group={groupRule}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function LinkBlock({
  t,
  data,
  heroes,
  member,
  result,
  sourceActive,
  group,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  member: MemberResult;
  result: LinkResult;
  sourceActive: boolean;
  group: (typeof data.team.groups)[number] | null;
}) {
  const locale = useLocale();
  const { link } = result;
  const sentence = sentenceText(data.team, link.sentence, locale);
  const hero = heroes.get(member.hero)!;
  const showOff = sourceActive && !result.active && result.off;

  return (
    <li className={cx(!result.active && "opacity-70")}>
      <p className="m-0 text-[12.5px] leading-snug text-ink-2" lang={sentence.english ? "en" : undefined}>
        «{sentence.text}»
      </p>
      {link.receives?.length ? (
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] text-ink-3">
            {t.vaA} {link.receives.map((who) => describeWho(who, data, group, locale)).join(t.o)}:
          </span>
          {result.receivers.length === 0 ? (
            <span className="text-[12px] text-ink-3">{t.nessunCompagno}</span>
          ) : (
            result.receivers.map((check) => <Check key={check.hero} check={check} heroes={heroes} />)
          )}
        </div>
      ) : null}
      {result.conditions.map((condition, i) => (
        <div key={i} className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] text-ink-3">
            {conditionLabel(condition.condition, t)} {describeWho(condition.condition.who, data, group, locale)}
            {condition.condition.kind === "each" ? ` (${t.inCampoN(condition.count)})` : ""}:
          </span>
          {condition.members.length === 0 ? (
            <span className="text-[12px] text-ink-3">{t.nessunCompagno}</span>
          ) : (
            condition.members.map((check) => <Check key={check.hero} check={check} heroes={heroes} self={check.hero === hero.id} />)
          )}
        </div>
      ))}
      {link.extraRaces?.length ? (
        <p className="mt-1 mb-0 text-[12px] text-ink-3">
          {t.razzaAggiunta(link.extraRaces.map((race) => data.labels.race[race] ?? race).join(", "))}
        </p>
      ) : null}
      {link.bothSides ? <p className="mt-1 mb-0 text-[12px] text-down">{t.dueParti}</p> : null}
      {link.withBench ? <p className="mt-1 mb-0 text-[12px] text-ink-3">{t.conPanchina}</p> : null}
      {link.notSelf ? <p className="mt-1 mb-0 text-[12px] text-ink-3">{t.tranneSe}</p> : null}
      {showOff ? <p className="mt-1 mb-0 text-[12px] text-ink-3">{`${t.spenta}: ${offLabel(result.off!, t, null)}`}</p> : null}
    </li>
  );
}

function Check({ check, heroes, self }: { check: MemberCheck; heroes: ReadonlyMap<string, BuilderHero>; self?: boolean }) {
  const hero = heroes.get(check.hero);
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 px-1.5 py-0.5 text-[12px] leading-none",
        check.ok ? "bg-up/15 text-up" : "bg-paper-3 text-ink-3 line-through decoration-ink-3/60",
        self && "outline outline-1 outline-rule",
      )}
    >
      {check.ok ? <IconCheck size={11} /> : <IconClose size={11} aria-hidden />}
      {hero?.name ?? check.hero}
    </span>
  );
}

function InfluenceList({
  t,
  data,
  heroes,
  list,
  side,
  locale,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  list: readonly Influence[];
  side: "from" | "to";
  locale: "it" | "en";
}) {
  if (list.length === 0) return <p className="m-0 text-[12px] text-ink-3">{t.niente}</p>;
  return (
    <ul className="m-0 grid list-none gap-1.5 p-0">
      {list.map((influence) => {
        const other = heroes.get(influence[side])!;
        // la passiva e' di chi da' (ricevuti) o di chi la ha accesa (`to`, per «accende»)
        const owner = side === "from" ? influence.from : influence.to;
        const source = data.team.heroes[owner]?.find((s) => s.id === influence.source);
        const kind =
          source?.kind === "special" && source.special
            ? (data.specials[source.special]?.label ?? t.tipo.special)
            : t.tipo[influence.kind];
        const sentence = sentenceText(data.team, influence.sentence, locale);
        return (
          <li key={`${influence.from}-${influence.to}`} className="text-[12px] leading-snug">
            <span className="font-semibold text-ink">{other.name}</span>
            <span className="text-ink-3"> · {kind}</span>
            <span className="block text-ink-3" lang={sentence.english ? "en" : undefined}>
              «{sentence.text}»
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ----------------------------------------------- quello di tutta la squadra -- */

function TeamWide({
  t,
  data,
  heroes,
  setup,
  analysis,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  setup: TeamSetup;
  analysis: TeamAnalysis;
}) {
  const locale = useLocale();
  const kinds = [
    ...new Set(
      analysis.members.flatMap((m) =>
        m.sources.filter((s) => s.source.kind === "special" && s.source.special).map((s) => s.source.special!),
      ),
    ),
  ].filter((kind) => data.specials[kind]?.rules.length);

  const field = analysis.members.filter((m) => !m.bench);
  const light = field.filter((m) => data.lightDark[m.hero]?.light);
  const dark = field.filter((m) => data.lightDark[m.hero]?.dark);

  const pairs = setup.mains
    .map((main, slot) => ({ main, associate: setup.associates[slot], slot }))
    .filter((p): p is { main: string; associate: string; slot: number } => !!p.main && !!p.associate);
  const common = data.fates.common;

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-3">
      {kinds.length > 0 ? (
        <section className="p5-corner border border-rule bg-paper-2 p-4 text-[13px]">
          <h3 className={cx(eyebrow, "m-0 mb-2")}>{t.regole}</h3>
          {kinds.map((kind) => (
            <div key={kind} className="mt-2 first:mt-0">
              <p className="m-0 font-semibold text-ink">{data.specials[kind]!.label}</p>
              <ul className="mt-1 mb-0 grid list-none gap-1 p-0 text-ink-2">
                {data.specials[kind]!.rules.map((rule, i) => (
                  <li key={i}>
                    <GameText text={rule} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {light.length + dark.length > 0 ? (
        <section className="p5-corner border border-rule bg-paper-2 p-4 text-[13px]">
          <h3 className={cx(eyebrow, "m-0 mb-2")}>{t.lucOsc}</h3>
          <ul className="m-0 grid list-none gap-2 p-0 text-ink-2">
            {[
              ...light.map((m, i) => ({ m, i, effect: data.lightDark[m.hero]!.light!, text: t.luce })),
              ...dark.map((m, i) => ({ m, i, effect: data.lightDark[m.hero]!.dark!, text: t.oscurita })),
            ].map(({ m, i, effect, text }) => (
              <li key={`${m.hero}-${text === t.luce ? "l" : "d"}`} className={cx(i > 0 && "opacity-60")}>
                <span className="font-semibold text-ink">{heroes.get(m.hero)?.name}</span>
                {" · "}
                {text(effect.sameAttribute, effect.otherAllies)}
                {i > 0 ? ` (${t.nonSiSomma})` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pairs.length > 0 ? (
        <section className="p5-corner border border-rule bg-paper-2 p-4 text-[13px]">
          <h3 className={cx(eyebrow, "m-0 mb-2")}>{t.associati}</h3>
          <ul className="m-0 grid list-none gap-2.5 p-0 text-ink-2">
            {pairs.map(({ main, associate, slot }) => {
              const fate = fateOf(data.fates, main, associate);
              const effect = fate ? data.fates.effects[fate[1]] : undefined;
              const text = effect ? inLingua(effect.text, locale) : null;
              return (
                <li key={slot}>
                  <span className="font-semibold text-ink">{heroes.get(main)?.name}</span>
                  {/* la freccia verso l'eroe: e' lui che riceve dall'associato */}
                  <IconChevronLeft size={12} aria-hidden className="mx-1 inline-block align-[-1px] text-ink-3" />
                  <span className="font-semibold text-ink">{heroes.get(associate)?.name}</span>
                  {effect && text ? (
                    <>
                      <span className="block text-[12px] text-ink-3">{t.legame}</span>
                      <GameText text={text} className="text-up" />
                      {fate?.[2] ? <span className="mt-1 inline-block"><Tag tone="gold">{t.combinato}</Tag></span> : null}
                    </>
                  ) : (
                    <span className="block text-[12px] text-ink-3">{t.comune(common.base, common.base + common.perLevel * 5)}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
