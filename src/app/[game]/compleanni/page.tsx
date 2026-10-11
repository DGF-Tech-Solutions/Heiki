import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  birthdayItemSrc,
  CharacterChip,
  formatCount,
  formatMonthDay,
  GiftLine,
  type CharacterView,
  type GiftLabels,
  type GiftView,
} from "@/components/birthdays/birthday-parts";
import { BIRTHDAY_TEXTS } from "@/components/birthdays/birthday-texts";
import { BirthdayToday, type TodayDay, type TodayStage } from "@/components/birthdays/birthday-today";
import { stageArtOf } from "@/components/heroes/hero-stage";
import { IconGift } from "@/components/icons";
import { Card, chipClass, cx, display, eyebrow, HowItWorks, numeric, PageHeader, SectionHead } from "@/components/ui";
import {
  birthdayCalendar,
  dayKey,
  oneLine,
  parseDayParam,
  unknownBirthdays,
  upcomingDays,
  type BirthdayCharacter,
} from "@/lib/games/birthdays";
import type { MonthDay, TavernGift } from "@/lib/games/birthdays-types";
import { findGame } from "@/lib/games/catalog";
import { heroEpithet, heroName } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, intlLocale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Compleanni: il compleanno di ogni eroe e la festa dei clienti della taverna.
 *
 * Richiesta dell'utente dell'11/10: «vedere i compleanni degli eroi, che si basano
 * sui giorni reali; durante il compleanno puoi fare i regali e ricevi piu' punti dai
 * personaggi». Il gioco tiene le due cose separate e la pagina pure: la data sta nel
 * profilo di ogni versione, la festa (il regalo preferito x10 punti Affetto) vale solo
 * per i clienti della taverna, che sono personaggi. I dati e le loro fonti sono in
 * birthdays-types.ts; le regole del calendario in src/lib/games/birthdays.ts.
 *
 * Il calendario e le tabelle li disegna il server; «Oggi» lo decide il browser
 * (birthday-today.tsx), col giorno di chi guarda.
 */

interface Props {
  params: Promise<{ game: string }>;
  /** `?giorno=07-25`: il giorno aperto in grande, cliccando una data */
  searchParams: Promise<{ giorno?: string | string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = BIRTHDAY_TEXTS[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? "Grand Cross"),
    description: t.descrizione(entry?.name ?? "Grand Cross"),
  };
}

export default async function BirthdaysPage({ params, searchParams }: Props) {
  const { game } = await params;
  const chosen = parseDayParam((await searchParams).giorno);
  const entry = findGame(game);
  if (!entry) notFound();

  const { roster, birthdays, heroAssets } = requireGameModule(game);
  // la voce di menu non compare senza i dati, ma l'indirizzo si puo' digitare
  if (!roster || !birthdays) notFound();

  const locale = await getLocale();
  const t = BIRTHDAY_TEXTS[locale];
  const label = (value: { it: string | null; en: string | null } | null | undefined) => oneLine(inLingua(value, locale) ?? "");

  const heroById = new Map(roster.heroes.map((hero) => [hero.id, hero]));
  const rank = new Map(roster.heroes.map((hero, i) => [hero.id, i]));
  const byRoster = (ids: readonly string[]) => [...ids].sort((a, b) => (rank.get(a) ?? 1e9) - (rank.get(b) ?? 1e9));
  const affinities = new Map(roster.affinities.map((affinity) => [affinity.id, affinity]));
  const calendar = birthdayCalendar(birthdays, roster.heroes.map((hero) => hero.id));

  const giftView = (gift: TavernGift, celebrates: boolean): GiftView => ({
    item: gift.item,
    name: label(birthdays.items[gift.item]?.name),
    count: gift.count,
    affection: gift.affection,
    birthday: celebrates ? gift.affection * birthdays.multiplier : null,
    returnItem: gift.returnItem,
    returnName: label(birthdays.items[gift.returnItem]?.name),
    returnCount: gift.returnCount,
  });
  const characterView = (character: BirthdayCharacter): CharacterView => ({
    group: character.group,
    name: label(birthdays.groups[character.group]),
    heroes: character.heroes.flatMap((id) => {
      const hero = heroById.get(id);
      return hero ? [{ id, name: heroName(hero, locale), epithet: heroEpithet(hero, locale) }] : [];
    }),
    guest: character.guest
      ? {
          gift: character.guest.gift ? giftView(character.guest.gift, true) : null,
          line: character.guest.line ? label(character.guest.line) : null,
        }
      : null,
  });

  // «Oggi»: il server disegna col giorno UTC, il browser corregge col suo. Gli
  // basta una finestra da ieri in avanti (il suo giorno e' al massimo uno prima o
  // dopo); con un giorno scelto, la finestra parte da quel giorno
  const now = new Date();
  const serverToday = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86_400_000);
  const nearby = upcomingDays(
    calendar,
    chosen
      ? { year: now.getUTCFullYear(), date: chosen }
      : { year: yesterday.getUTCFullYear(), date: [yesterday.getUTCMonth() + 1, yesterday.getUTCDate()] },
    8,
  );
  const todayDays: TodayDay[] = nearby.map(({ day }) => ({
    date: day.date,
    label: formatMonthDay(day.date, locale),
    characters: day.characters.map(characterView),
  }));
  const stages: Record<string, TodayStage> = {};
  for (const day of todayDays) {
    const id = day.characters[0]?.heroes[0]?.id;
    const hero = id ? heroById.get(id) : undefined;
    if (id && hero) stages[id] = { hero, affinity: affinities.get(hero.affinity), art: stageArtOf(heroAssets?.[id]) };
  }

  const giftLabels: GiftLabels = { affetto: label(birthdays.texts.affetto), festa: t.alla, ritorno: t.ritorno };
  const guestsWithGift = birthdays.guests.filter((guest) => guest.gift);
  const common = giftView(birthdays.commonGift, false);
  const firstGift = guestsWithGift[0]?.gift;
  const totalDiamonds = birthdays.heartRewards.reduce((sum, reward) => sum + reward.count, 0);
  const lastHearts = birthdays.heartRewards.at(-1)?.hearts ?? 0;

  const monthName = (month: number) =>
    new Intl.DateTimeFormat(intlLocale(locale), { month: "long", timeZone: "UTC" }).format(Date.UTC(2024, month - 1, 1));
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    days: calendar.filter((day) => day.date[0] === i + 1),
  }));

  // chi non ha una data: per personaggio, come il calendario
  const unknown = unknownBirthdays(birthdays);
  const unknownByGroup = new Map<string, string[]>();
  for (const id of roster.heroes.map((hero) => hero.id)) {
    if (!unknown.includes(id)) continue;
    const group = birthdays.heroes[id]?.group;
    if (!group) continue;
    unknownByGroup.set(group, [...(unknownByGroup.get(group) ?? []), id]);
  }
  const unknownCharacters = [...unknownByGroup.entries()]
    .map(([group, heroes]) => characterView({ group, heroes, guest: null }))
    .sort((a, b) => a.name.localeCompare(b.name, intlLocale(locale)));

  // una data apre quel giorno in grande, in cima alla pagina
  const dayHref = (date: MonthDay) => `/${game}/compleanni?giorno=${dayKey(date)}#giorno`;
  const dateCell = (date: MonthDay) => (
    <Link
      href={dayHref(date)}
      className="font-display text-[15px] leading-tight font-extrabold text-ink uppercase no-underline [font-variation-settings:'wdth'_84] hover:text-brand-deep"
    >
      {formatMonthDay(date, locale)}
    </Link>
  );

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <PageHeader title={t.titolo}>
        <p>{t.introduzione(birthdays.guests.length, birthdays.multiplier)}</p>
      </PageHeader>

      <BirthdayToday
        game={game}
        locale={locale}
        serverToday={serverToday}
        chosen={chosen ? { date: chosen, label: formatMonthDay(chosen, locale) } : null}
        days={todayDays}
        stages={stages}
        gameTexts={{ auguri: label(birthdays.texts.auguri), festa: label(birthdays.texts.festa), regalo: giftLabels }}
      />

      {/* la festa: cosa da' il regalo, e a cosa servono i punti */}
      <section aria-labelledby="compleanni-festa" className="mt-14">
        <SectionHead title={<span id="compleanni-festa">{t.festaTitolo}</span>} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="max-w-[60ch] text-[15px] leading-relaxed text-ink-2 [&_p]:m-0 [&_p+p]:mt-3">
            {firstGift ? (
              <p>
                {t.festaRegalo(
                  birthdays.multiplier,
                  formatCount(firstGift.affection, locale),
                  formatCount(firstGift.affection * birthdays.multiplier, locale),
                )}
              </p>
            ) : null}
            <p>{t.festaComune(common.name)}</p>
            <p>
              {t.festaCuori(formatCount(birthdays.affectionPerHeart, locale), birthdays.heartsPerVersion, birthdays.heartsAtMaxAffinity)}
            </p>
            <p>{t.festaRicompense(formatCount(totalDiamonds, locale), lastHearts)}</p>
            <p className="text-[13px] text-ink-3">{t.festaServer}</p>
          </div>
          <Card className="self-start">
            <p className={cx(eyebrow, "m-0 mb-3")}>{t.comuneTitolo}</p>
            <GiftLine game={game} gift={common} labels={giftLabels} locale={locale} />
            {/* la scritta del gioco, nella finestra del regalo il giorno della festa */}
            <p className="m-0 mt-3 text-[13px] leading-snug text-ink-3">{label(birthdays.texts.escluso).replace("{0}", common.name)}</p>
            <p className="m-0 mt-4 flex items-center gap-2 border-t border-rule-2 pt-3 text-[13px] text-ink-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- icona del gioco */}
              <img src={birthdayItemSrc(game, birthdays.heartRewards[0]?.item ?? "")} alt="" width={20} height={20} className="h-5 w-5" />
              <span className={numeric}>{formatCount(totalDiamonds, locale)}</span>
              {label(birthdays.items[birthdays.heartRewards[0]?.item ?? ""]?.name)} · {label(birthdays.texts.cuori_ricompense)}
            </p>
          </Card>
        </div>
      </section>

      {/* i regali preferiti, in ordine di data */}
      <section aria-labelledby="compleanni-regali" className="mt-14">
        <SectionHead title={<span id="compleanni-regali">{t.regaliTitolo}</span>} />
        <p className="m-0 mb-4 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">{t.regaliIntro}</p>
        <ul className="m-0 list-none border-t border-rule-2 p-0">
          <li aria-hidden className="hidden grid-cols-[140px_minmax(0,1fr)_minmax(0,1.3fr)] gap-4 border-b border-rule-2 py-2 md:grid">
            <span className={eyebrow}>{t.colData}</span>
            <span className={eyebrow}>{t.colPersonaggio}</span>
            <span className={eyebrow}>{t.colRegalo}</span>
          </li>
          {birthdays.guests.map((guest) => {
            const character = characterView({ group: guest.group, heroes: byRoster(guest.heroes), guest });
            return guest.gift ? (
              <li
                key={guest.guest}
                className="grid gap-x-4 gap-y-2 border-b border-rule-2 py-3 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1.3fr)] md:items-center"
              >
                {dateCell(guest.date)}
                <CharacterChip game={game} character={character} versionsLabel={t.versioni} guestLabel={t.cliente} max={2} card={36} />
                <GiftLine game={game} gift={giftView(guest.gift, true)} labels={giftLabels} locale={locale} size="sm" />
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {/* il calendario: un riquadro per mese, i giorni con i personaggi */}
      <section aria-labelledby="compleanni-calendario" className="mt-14">
        <SectionHead title={<span id="compleanni-calendario">{t.calendarioTitolo}</span>} />
        <nav aria-label={t.calendarioMesi} className="mb-5 flex flex-wrap gap-2">
          {months.map(({ month, days }) => (
            <a key={month} href={`#m-${String(month).padStart(2, "0")}`} className={chipClass(false, true, days.length ? undefined : "opacity-50")}>
              {monthName(month).slice(0, 3)}
            </a>
          ))}
        </nav>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {months.map(({ month, days }) => (
            <section
              key={month}
              id={`m-${String(month).padStart(2, "0")}`}
              aria-labelledby={`m-${month}-titolo`}
              className="p5-corner scroll-mt-24 border border-rule bg-paper-2"
            >
              <h3 id={`m-${month}-titolo`} className={cx(display, "m-0 border-b-2 border-brand px-4 pt-3 pb-2 text-[22px]")}>
                {monthName(month)}
              </h3>
              {days.length ? (
                <ol className="m-0 list-none p-0">
                  {days.map((day) => (
                    <li
                      key={dayKey(day.date)}
                      id={`g-${dayKey(day.date)}`}
                      className="grid scroll-mt-24 grid-cols-[38px_minmax(0,1fr)] gap-3 border-b border-rule-2 px-4 py-2.5 last:border-b-0 data-[oggi]:bg-brand-soft data-[oggi]:shadow-[inset_3px_0_0_var(--color-brand)]"
                    >
                      <Link
                        href={dayHref(day.date)}
                        aria-label={t.apriGiorno(formatMonthDay(day.date, locale))}
                        className={cx(numeric, "p5-press pt-1 text-[22px] leading-none font-bold text-ink no-underline hover:text-brand-deep")}
                      >
                        {day.date[1]}
                      </Link>
                      <span className="flex min-w-0 flex-col gap-2">
                        {day.characters.map((character) => (
                          <CharacterChip
                            key={character.group}
                            game={game}
                            character={characterView(character)}
                            versionsLabel={t.versioni}
                            guestLabel={t.cliente}
                            max={2}
                            card={32}
                          />
                        ))}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="m-0 px-4 py-3 text-[13px] text-ink-3">{t.nessunoMese}</p>
              )}
            </section>
          ))}
        </div>
        <p className="m-0 mt-3 flex items-center gap-1.5 text-[13px] text-ink-3">
          <IconGift size={14} className="text-gold" /> {t.cliente}
        </p>
      </section>

      {/* chi non ha una data */}
      {unknownCharacters.length ? (
        <details className="group/ignoti mt-14 border-y border-rule-2 py-3">
          <summary className={cx(display, "cursor-pointer list-none text-[20px] [&::-webkit-details-marker]:hidden")}>
            {t.sconosciutiTitolo(unknown.length)}
          </summary>
          <p className="m-0 mt-2 mb-4 text-[14px] text-ink-3">{t.sconosciutiIntro}</p>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {unknownCharacters.map((character) => (
              <li key={character.group}>
                <CharacterChip game={game} character={character} versionsLabel={t.versioni} guestLabel={t.cliente} max={2} card={32} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <HowItWorks summary={t.comeFunziona} className="mt-12 max-w-[1100px]">
        <p>{t.fonti}</p>
        <p>{t.hawk}</p>
      </HowItWorks>
    </main>
  );

}
