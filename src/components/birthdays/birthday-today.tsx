"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { HeroStage, type StageArt } from "@/components/heroes/hero-stage";
import { IconCake } from "@/components/icons";
import { buttonClass, cx, display, eyebrow, MoreArrow, moreLinkClass } from "@/components/ui";
import type { MonthDay } from "@/lib/games/birthdays-types";
import { dayKey, daysUntil } from "@/lib/games/birthdays";
import type { HeroAffinity, HeroEntry } from "@/lib/games/types";
import type { Locale } from "@/lib/i18n/locale";
import { CharacterChip, GiftLine, type CharacterView, type GiftLabels } from "./birthday-parts";
import { BIRTHDAY_TEXTS } from "./birthday-texts";

/**
 * «Oggi» e «Prossimi»: chi compie gli anni nel giorno di chi guarda.
 *
 * Il giorno lo decide il browser, coi giorni reali del suo fuso (richiesta
 * dell'utente: «si basano sui giorni reali»). Il server non sa dove sta chi guarda:
 * disegna la pagina col giorno UTC, e `useSyncExternalStore` la ridisegna col giorno
 * del browser subito dopo l'idratazione (lo stato del server serve proprio a non
 * avere un errore di idratazione quando i due giorni non coincidono). Dopo
 * mezzanotte il riquadro passa da solo al giorno nuovo.
 *
 * Al browser arriva solo una finestra di date, da ieri (UTC) in avanti: il giorno
 * del browser e' al massimo uno prima o uno dopo, e il calendario intero sta gia'
 * nella pagina, disegnato dal server.
 *
 * Con un giorno scelto (`?giorno=07-25`, cliccando una data del calendario) il
 * riquadro mostra quel giorno e non oggi: la finestra parte da li', e l'orologio
 * del browser non conta.
 */

export interface TodayDay {
  date: MonthDay;
  /** «25 luglio», nella lingua della pagina */
  label: string;
  characters: CharacterView[];
}

export interface TodayStage {
  hero: HeroEntry;
  affinity?: HeroAffinity;
  art: StageArt;
}

/** le parole del gioco, coi testi del client: «Buon compleanno, {0}!», «Festa di compleanno» */
export interface TodayGameTexts {
  auguri: string;
  festa: string;
  regalo: GiftLabels;
}

function isoLocal(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** avvisa a mezzanotte (locale), cosi' il riquadro cambia giorno senza ricaricare */
function subscribeMidnight(callback: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>;
  const arm = () => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    timer = setTimeout(() => {
      callback();
      arm();
    }, next.getTime() - now.getTime());
  };
  arm();
  return () => clearTimeout(timer);
}

export function BirthdayToday({
  game,
  locale,
  serverToday,
  chosen,
  days,
  stages,
  gameTexts,
}: {
  game: string;
  locale: Locale;
  /** «2026-10-11»: il giorno UTC con cui il server ha disegnato la pagina */
  serverToday: string;
  /** il giorno scelto nell'indirizzo, gia' controllato dal server; null = oggi */
  chosen: { date: MonthDay; label: string } | null;
  days: readonly TodayDay[];
  /** il palco del primo personaggio di ogni data, per id dell'eroe */
  stages: Readonly<Record<string, TodayStage>>;
  gameTexts: TodayGameTexts;
}) {
  const t = BIRTHDAY_TEXTS[locale];
  const todayIso = useSyncExternalStore(subscribeMidnight, () => isoLocal(new Date()), () => serverToday);
  const [year = 2026, month = 1, day = 1] = todayIso.split("-").map(Number);
  const today = { year, date: chosen?.date ?? ([month, day] as MonthDay) };

  const dated = days
    .map((d) => ({ day: d, inDays: daysUntil(d.date, today) }))
    .sort((a, b) => a.inDays - b.inDays);
  const todays = dated.filter((d) => d.inDays === 0);
  // una data della finestra gia' passata per il browser (un orologio molto avanti
  // rispetto al server) non e' il prossimo compleanno «fra 359 giorni»: si salta
  const next = dated.filter((d) => d.inDays > 0 && d.inDays < 300).slice(0, 5);
  const featured = todays[0] ?? next[0];
  const featuredHero = featured?.day.characters[0]?.heroes[0];
  const stage = featuredHero ? stages[featuredHero.id] : undefined;

  // il giorno di oggi nel calendario qui sotto, disegnato dal server
  const todayKey = dayKey(today.date);
  useEffect(() => {
    const row = document.getElementById(`g-${todayKey}`);
    row?.setAttribute("data-oggi", "");
    return () => row?.removeAttribute("data-oggi");
  }, [todayKey]);

  return (
    <section
      id="giorno"
      aria-labelledby="compleanni-oggi"
      className="grid scroll-mt-20 gap-6 lg:grid-cols-[minmax(320px,440px)_minmax(0,1fr)] lg:items-start"
    >
      {stage && featured ? (
        <HeroStage
          game={game}
          hero={stage.hero}
          locale={locale}
          affinity={stage.affinity}
          art={stage.art}
          plate={{
            kicker: chosen || featured.inDays !== 0 ? featured.day.label : `${t.oggi} · ${featured.day.label}`,
            title: featured.day.characters[0]?.name ?? "",
          }}
          className="p5-corner h-[min(560px,calc(100dvh-160px))] min-h-[420px] max-lg:h-[440px]"
        >
          <Link href={`/${game}/eroi/${stage.hero.id}`} className={buttonClass("primary", "md")}>
            {t.apri}
          </Link>
        </HeroStage>
      ) : null}

      <div className="min-w-0">
        <h2 id="compleanni-oggi" className={cx(display, "flex items-center gap-2.5 text-[clamp(26px,3.2vw,36px)]")}>
          <IconCake size={28} className="shrink-0 text-brand" />
          {chosen ? (todays.length ? chosen.label : t.nessunoGiorno(chosen.label)) : todays.length ? t.oggi : t.nessunoOggi}
        </h2>
        {chosen ? (
          <Link href={`/${game}/compleanni#giorno`} className={cx(moreLinkClass, "mt-2")}>
            {t.tornaOggi}
            <MoreArrow />
          </Link>
        ) : null}

        {todays.length ? (
          <ul className="m-0 mt-4 grid list-none gap-3 p-0">
            {todays.flatMap(({ day: d }) =>
              d.characters.map((character) => (
                <li key={`${dayKey(d.date)}-${character.group}`} className="p5-corner border border-rule bg-paper-2 p-4">
                  <p className="m-0 mb-3 font-display text-[18px] leading-tight font-black text-gold uppercase [font-variation-settings:'wdth'_82]">
                    {gameTexts.auguri.replace("{0}", character.name)}
                  </p>
                  <CharacterChip game={game} character={character} versionsLabel={t.versioni} guestLabel={t.cliente} card={48} />
                  <TavernNote game={game} locale={locale} character={character} gameTexts={gameTexts} />
                </li>
              )),
            )}
          </ul>
        ) : next[0] ? (
          <p className="m-0 mt-3 text-[15px] leading-relaxed text-ink-2">
            {t.prossimo} <strong className="text-ink">{next[0].day.characters.map((c) => c.name).join(", ")}</strong>,{" "}
            {next[0].day.label} ({t.tra(next[0].inDays)}).
          </p>
        ) : null}

        <h3 className={cx(eyebrow, "m-0 mt-7 mb-2")}>{t.prossimi}</h3>
        <ol className="m-0 list-none border-t border-rule-2 p-0">
          {next.map(({ day: d, inDays }) => (
            <li
              key={dayKey(d.date)}
              className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-2 border-b border-rule-2 py-3 sm:grid-cols-[112px_minmax(0,1fr)]"
            >
              <Link
                href={`/${game}/compleanni?giorno=${dayKey(d.date)}#giorno`}
                aria-label={t.apriGiorno(d.label)}
                className="text-ink no-underline hover:text-brand-deep"
              >
                <span className="block font-display text-[15px] leading-tight font-extrabold uppercase [font-variation-settings:'wdth'_84]">
                  {d.label}
                </span>
                {chosen ? null : <span className="block text-[12px] text-ink-3">{t.tra(inDays)}</span>}
              </Link>
              <span className="flex min-w-0 flex-wrap gap-x-5 gap-y-2.5">
                {d.characters.map((character) => (
                  <CharacterChip
                    key={character.group}
                    game={game}
                    character={character}
                    versionsLabel={t.versioni}
                    guestLabel={t.cliente}
                    max={2}
                    card={36}
                  />
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Cosa succede in taverna per questo personaggio, oggi. */
function TavernNote({
  game,
  locale,
  character,
  gameTexts,
}: {
  game: string;
  locale: Locale;
  character: CharacterView;
  gameTexts: TodayGameTexts;
}) {
  const t = BIRTHDAY_TEXTS[locale];
  if (!character.guest) return <p className="m-0 mt-3 text-[13px] leading-snug text-ink-3">{t.senzaFesta}</p>;
  return (
    <div className="mt-3 border-t border-rule-2 pt-3">
      <p className={cx(eyebrow, "m-0 mb-2 text-gold")}>{gameTexts.festa}</p>
      {character.guest.gift ? (
        <GiftLine game={game} gift={character.guest.gift} labels={gameTexts.regalo} locale={locale} />
      ) : (
        <p className="m-0 text-[13px] leading-snug text-ink-2">{t.vivonoInTaverna}</p>
      )}
      {character.guest.line ? (
        <blockquote className="m-0 mt-3 border-l-2 border-brand pl-3 text-[14px] leading-snug text-ink-2 italic">
          «{character.guest.line}»
        </blockquote>
      ) : null}
    </div>
  );
}
