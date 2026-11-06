import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { HeroStage, stageArtOf } from "@/components/heroes/hero-stage";
import { buttonClass, cx, display, heroEpithetClass, heroNameClass, MoreLink, numeric } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { heroesIn } from "@/lib/games/releases";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * L'ingresso di un gioco: l'ultimo eroe uscito, gli ultimi eroi, il prossimo aggiornamento.
 *
 * Fino al 06/11 era un «menu principale» alla Persona, coi comandi enormi a scalare e senza
 * barra laterale: ripeteva le stesse voci. Ora la barra c'e' anche qui, come su ogni pagina
 * del gioco, e la pagina dice quello che la barra non dice: cosa c'e' di nuovo. Il feed sta
 * in /<gioco>/discussioni.
 */

const TESTI = testi({
  it: {
    descrizione: (gioco: string) => `Eroi, uscite, endgame e strumenti di ${gioco}, coi dati letti dal gioco.`,
    // i numeri arrivano gia' composti (nel monospaziato), le parole restano nel testo
    riga: (eroi: ReactNode, aggiornamenti: ReactNode) => (
      <>
        {eroi} eroi e {aggiornamenti} aggiornamenti in calendario, coi dati presi dal gioco.
      </>
    ),
    ultimaUscita: (eroe: string) => `Ultima uscita: ${eroe}`,
    apri: "Apri la scheda",
    ultimi: "Gli ultimi eroi",
    tutti: "Tutti gli eroi",
    prossimo: "Prossimo aggiornamento",
    ultimo: "Ultimo aggiornamento",
    // il nome della voce di menu: la stessa pagina si chiamava anche «Nel calendario»
    nelCalendario: "Uscite",
    eroiNuovi: (n: number) => (n === 1 ? "1 eroe nuovo" : `${n} eroi nuovi`),
    nessunEroe: "Nessun eroe nuovo",
    quando: (giorni: number) =>
      giorni === 0
        ? "oggi"
        : giorni === 1
          ? "domani"
          : giorni === -1
            ? "ieri"
            : giorni > 0
              ? `tra ${giorni} giorni`
              : `${-giorni} giorni fa`,
  },
  en: {
    descrizione: (game: string) => `${game} heroes, releases, endgame and tools, with data read from the game.`,
    riga: (heroes: ReactNode, updates: ReactNode) => (
      <>
        {heroes} heroes and {updates} updates in the calendar, with data taken from the game.
      </>
    ),
    ultimaUscita: (hero: string) => `Latest release: ${hero}`,
    apri: "Open the page",
    ultimi: "The latest heroes",
    tutti: "All heroes",
    prossimo: "Next update",
    ultimo: "Latest update",
    nelCalendario: "Releases",
    eroiNuovi: (n: number) => (n === 1 ? "1 new hero" : `${n} new heroes`),
    nessunEroe: "No new heroes",
    quando: (days: number) =>
      days === 0
        ? "today"
        : days === 1
          ? "tomorrow"
          : days === -1
            ? "yesterday"
            : days > 0
              ? `in ${days} days`
              : `${-days} days ago`,
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return { title: entry?.shortName ?? game, description: t.descrizione(entry?.name ?? game) };
}

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function GameHubPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();
  const gameModule = getGameModule(game);
  const locale = await getLocale();
  const t = TESTI[locale];

  const heroes = gameModule?.roster?.heroes ?? [];
  const latest = heroes[0];
  const affinity = latest ? gameModule?.roster?.affinities.find((a) => a.id === latest.affinity) : undefined;

  // il prossimo aggiornamento del calendario globale; se non ce n'e', l'ultimo
  const updates = gameModule?.releases?.schedules.global ?? gameModule?.releases?.schedules.jp ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const next = [...updates].filter((u) => u.date > today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const last = [...updates].filter((u) => u.date <= today).sort((a, b) => b.date.localeCompare(a.date))[0];
  const update = next ?? last;
  const dateParts = (value: string) => {
    const date = new Date(`${value}T00:00:00Z`);
    const format = (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(intlLocale(locale), { ...options, timeZone: "UTC" }).format(date);
    return {
      day: format({ day: "numeric" }),
      monthYear: format({ month: "long", year: "numeric" }),
      weekday: format({ weekday: "long" }),
      days: Math.round((date.getTime() - Date.parse(`${today}T00:00:00Z`)) / DAY_MS),
    };
  };
  const when = update ? dateParts(update.date) : null;
  const byId = new Map(heroes.map((h) => [h.id, h]));

  return (
    <main className="pt-6 pb-20">
      {latest ? (
        <HeroStage
          game={game}
          hero={latest}
          locale={locale}
          affinity={affinity}
          size="hero"
          priority
          headingLevel="h1"
          plate={{ kicker: t.ultimaUscita(heroName(latest, locale)), title: entry.name }}
          art={stageArtOf(gameModule?.heroAssets?.[latest.id])}
        >
          <p className="m-0 mb-3 max-w-[46ch] text-[14px] text-ink-2">
            {t.riga(
              <span className={cx(numeric, "font-medium text-ink")}>{heroes.length}</span>,
              <span className={cx(numeric, "font-medium text-ink")}>{updates.length}</span>,
            )}
          </p>
          <Link href={`/${game}/eroi/${latest.id}`} className={buttonClass("primary", "md")}>
            {t.apri}
          </Link>
        </HeroStage>
      ) : (
        <h1 className={cx(display, "text-[clamp(38px,6vw,76px)]")}>{entry.name}</h1>
      )}

      {heroes.length > 1 ? (
        <section aria-labelledby="hub-ultimi" className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
            <h2 id="hub-ultimi" className="m-0 font-display text-[20px] font-semibold">
              {t.ultimi}
            </h2>
            <MoreLink href={`/${game}/eroi`} className="shrink-0">
              {t.tutti}
            </MoreLink>
          </div>
          <ul className="griglia-eroi m-0 grid list-none gap-2.5 p-0">
            {heroes.slice(0, 11).map((hero) => (
              <li key={hero.id} className="min-w-0">
                <Link href={`/${game}/eroi/${hero.id}`} className="hero-card group block">
                  <span className="hero-card-art block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroCardSrc(game, hero.id, 2)} alt="" width={256} height={256} loading="lazy" className="block aspect-square w-full bg-paper-2" />
                  </span>
                  <span className={cx(heroEpithetClass, "mt-1.5")}>{heroEpithet(hero, locale)}</span>
                  <span className={cx(heroNameClass, "mt-0.5")}>
                    {heroName(hero, locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/*
        Il prossimo aggiornamento: una sezione come quella sopra, senza riquadro, col
        giorno in grande, accanto il mese e quanto manca. Quello che porta segue, se porta
        qualcosa.
      */}
      {update && when ? (
        <section aria-labelledby="hub-aggiornamento" className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
            <h2 id="hub-aggiornamento" className="m-0 font-display text-[20px] font-semibold">
              {next ? t.prossimo : t.ultimo}
            </h2>
            <MoreLink href={`/${game}/uscite#u-${update.date}`} className="shrink-0">
              {t.nelCalendario}
            </MoreLink>
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <time dateTime={update.date} className="flex shrink-0 items-center gap-3.5">
              <span className={cx(numeric, "font-display text-[44px] leading-[0.8] font-semibold")}>
                {when.day}
              </span>
              <span className="grid gap-1.5">
                <span className="font-display text-[18px] leading-none font-semibold">
                  {when.monthYear}
                </span>
                <span className="text-[13px] leading-none text-ink-2">
                  {when.weekday} · {t.quando(when.days)}
                </span>
              </span>
            </time>

            <div className="grid min-w-0 gap-2">
              {update.heroes.length > 0 ? (
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {update.heroes.map((released) => {
                    const hero = released.heroId ? byId.get(released.heroId) : undefined;
                    return (
                      <li key={`${released.name}-${released.rarity}`}>
                        {hero ? (
                          <Link href={`/${game}/eroi/${hero.id}`} className="flex items-center gap-2 bg-piastra-fondo px-2 py-1.5 hover:bg-piastra">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={heroCardSrc(game, hero.id)} alt="" width={40} height={40} className="h-10 w-10" loading="lazy" />
                            <span className="text-[13px] font-semibold">{heroName(hero, locale)}</span>
                          </Link>
                        ) : (
                          <span className="block bg-piastra-fondo px-2 py-1.5 text-[13px]" lang="en">
                            {released.name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="m-0 text-[15px] text-ink-2">{heroesIn(update) > 0 ? t.eroiNuovi(heroesIn(update)) : t.nessunEroe}</p>
              )}
              {update.events && update.events.length > 0 ? (
                <ul className="m-0 grid list-none gap-0.5 p-0 text-[13px] text-ink-2" lang="en">
                  {update.events.slice(0, 4).map((event) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
