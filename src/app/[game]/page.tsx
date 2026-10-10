import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { HeroStage, stageArtOf } from "@/components/heroes/hero-stage";
import { buttonClass, cx, display, eyebrow, heroEpithetClass, heroNameClass, MoreLink, numeric } from "@/components/ui";
import { findGame, gameGroups } from "@/lib/games/catalog";
import { affinityLabel } from "@/lib/games/grand-cross/roster";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { heroesIn } from "@/lib/games/releases";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * L'ingresso di un gioco: il «menu principale».
 *
 * Fino al 10/10 /<gioco> era il feed delle Discussioni, e la prima voce di ogni
 * briciola portava li': chi apriva Grand Cross trovava post di prova invece del
 * gioco. Ora e' la schermata di un menu alla Persona: i comandi grandi a
 * sinistra, di misura calante (Database, Endgame, Strumenti, Progressione, Tu e
 * la community, con le loro voci), a destra il palco con l'ultimo eroe uscito, e
 * sotto gli ultimi eroi e il prossimo aggiornamento del calendario. Il feed sta in
 * /<gioco>/discussioni.
 *
 * La scena sono i comandi. Fino alla sera del 10/10 il nome del gioco, a 84 px
 * su tre righe, si prendeva la prima meta' dello schermo e spingeva i comandi
 * sotto la piega; ora e' una testata di una o due righe, come le altre pagine, e
 * il primo comando parte subito sotto.
 *
 * Il movimento della pagina e' uno: i comandi entrano uno dopo l'altro
 * (`hub-command`, globals.css), come i menu del gioco a cui il sito si ispira.
 */

const TESTI = testi({
  it: {
    descrizione: (gioco: string) => `Eroi, uscite, endgame e strumenti di ${gioco}, coi dati letti dal gioco.`,
    // i numeri arrivano gia' composti (nel monospaziato), le parole restano nel testo
    riga: (eroi: ReactNode, aggiornamenti: ReactNode) => (
      <>
        {eroi} eroi · {aggiornamenti} aggiornamenti nel calendario · dati letti dal client del gioco
      </>
    ),
    menu: "Sezioni",
    ultimoEroe: "L'ultimo eroe uscito",
    apri: "Apri la scheda",
    ultimi: "Gli ultimi eroi",
    tutti: "Tutti gli eroi",
    prossimo: "Prossimo aggiornamento",
    ultimo: "Ultimo aggiornamento",
    nelCalendario: "Nel calendario",
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
        {heroes} heroes · {updates} updates in the calendar · data read from the game client
      </>
    ),
    menu: "Sections",
    ultimoEroe: "The latest hero released",
    apri: "Open the page",
    ultimi: "The latest heroes",
    tutti: "All heroes",
    prossimo: "Next update",
    ultimo: "Latest update",
    nelCalendario: "In the calendar",
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

/** L'ordine dei comandi: prima quello che si apre di piu'. */
const ORDER = ["Database", "Endgame", "Strumenti", "Tools", "Progressione", "Progression"];

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function GameHubPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();
  const gameModule = getGameModule(game);
  const locale = await getLocale();
  const t = TESTI[locale];

  const groups = [...gameGroups(game, locale)].sort((a, b) => {
    const rank = (label: string) => (ORDER.includes(label) ? ORDER.indexOf(label) : ORDER.length);
    return rank(a.label) - rank(b.label);
  });
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
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,440px)]">
        <div className="min-w-0">
          {/*
            La testata: il nome del gioco alla misura di un titolo di sezione, e
            sotto i conteggi, coi numeri nel monospaziato. Il filo rosso e' quello
            delle testate delle altre pagine (PageHeader).
          */}
          <header className="border-b-2 border-brand pb-3">
            <h1 className={cx(display, "text-[clamp(24px,2.2vw,30px)]")}>{entry.name}</h1>
            <p className="m-0 mt-2 text-[13px] text-ink-2">
              {t.riga(
                <span className={cx(numeric, "font-medium text-ink")}>{heroes.length}</span>,
                <span className={cx(numeric, "font-medium text-ink")}>{updates.length}</span>,
              )}
            </p>
          </header>

          {/*
            I comandi: il primo enorme, poi a scalare. Ogni comando porta alla
            prima voce del suo gruppo, e sotto ha le altre, piccole.

            Niente piu' il nome del gruppo sopra ogni comando (DATABASE sopra EROI,
            ENDGAME sopra SCONTRI FINALI): i comandi si leggono da soli, e i gruppi
            li dicono gia' il menu del telefono e la barra laterale delle altre
            pagine (qui la barra non c'e': la toglie il layout, vedendo `.hub-menu`).
            Resta per i lettori di schermo, come nome dell'elenco delle altre voci.
          */}
          <nav aria-label={t.menu} className="mt-6">
            <ol className="hub-menu m-0 grid list-none gap-6 p-0">
              {groups.map((group, index) => {
                const [main, ...rest] = group.items;
                if (!main) return null;
                return (
                  <li key={group.label} className="hub-command" style={{ "--i": index } as React.CSSProperties}>
                    <Link
                      href={`/${game}${main.path}`}
                      title={main.hint}
                      className={cx("hub-command-link p5-menu-item", `hub-command--${Math.min(index, 4)}`)}
                    >
                      {main.label}
                    </Link>
                    {rest.length > 0 ? (
                      <ul aria-label={group.label} className="m-0 mt-1 flex list-none flex-wrap gap-x-4 p-0">
                        {rest.map((item) => (
                          <li key={item.path}>
                            {/* alte 28px e non 20: si prendono col pollice */}
                            <Link
                              href={`/${game}${item.path}`}
                              title={item.hint}
                              className="inline-block py-1 font-display text-[15px] font-extrabold uppercase tracking-[0.02em] text-ink-2 [font-variation-settings:'wdth'_82] hover:text-brand-deep"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {latest ? (
          <aside aria-labelledby="hub-ultimo-eroe" className="lg:sticky lg:top-[76px]">
            {/* e' il titolo del riquadro, non un'etichetta sopra un titolo: il nome dell'eroe sta nel palco */}
            <h2 id="hub-ultimo-eroe" className={cx(eyebrow, "m-0 mb-2")}>
              {t.ultimoEroe}
            </h2>
            <HeroStage
              game={game}
              hero={latest}
              locale={locale}
              affinity={affinity}
              badges={affinity ? [{ label: affinityLabel(affinity.id, locale) }, { label: `${latest.obtainedAs} → ${latest.rarity}` }] : undefined}
              priority
              art={stageArtOf(gameModule?.heroAssets?.[latest.id])}
              className="p5-corner h-[min(640px,calc(100dvh-140px))] min-h-[480px]"
            >
              <Link href={`/${game}/eroi/${latest.id}`} className={buttonClass("primary", "md")}>
                {t.apri}
              </Link>
            </HeroStage>
          </aside>
        ) : null}
      </div>

      {heroes.length > 1 ? (
        <section aria-labelledby="hub-ultimi" className="mt-14">
          <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-brand pb-2">
            <h2 id="hub-ultimi" className={cx(display, "text-2xl")}>
              {t.ultimi}
            </h2>
            <MoreLink href={`/${game}/eroi`} className="shrink-0">
              {t.tutti}
            </MoreLink>
          </div>
          <ul className="m-0 grid list-none grid-cols-4 gap-2.5 p-0 sm:grid-cols-6 lg:grid-cols-8">
            {heroes.slice(0, 8).map((hero) => (
              <li key={hero.id} className="min-w-0">
                <Link href={`/${game}/eroi/${hero.id}`} className="hero-card group block">
                  <span className="hero-card-art block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroCardSrc(game, hero.id)} alt="" width={128} height={128} loading="lazy" className="block aspect-square w-full bg-paper-2" />
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
        Il prossimo aggiornamento. Fino al 10/10 era un riquadro a due colonne con
        la data piccola a sinistra, e a destra niente nelle settimane senza eroi
        (quasi tutte): sembrava vuoto. Ora e' una sezione come quella sopra, senza
        riquadro, con la data come nel calendario del gioco: il giorno enorme,
        accanto il mese e quanto manca. Quello che porta segue, se porta qualcosa.
      */}
      {update && when ? (
        <section aria-labelledby="hub-aggiornamento" className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-brand pb-2">
            <h2 id="hub-aggiornamento" className={cx(display, "text-2xl")}>
              {next ? t.prossimo : t.ultimo}
            </h2>
            <MoreLink href={`/${game}/uscite#u-${update.date}`} className="shrink-0">
              {t.nelCalendario}
            </MoreLink>
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <time dateTime={update.date} className="flex shrink-0 items-center gap-3.5">
              <span className="p5-title font-display text-[76px] font-black leading-[0.8] tracking-[-0.03em] [font-variation-settings:'wdth'_80]">
                {when.day}
              </span>
              <span className="grid gap-1.5">
                <span className="font-display text-[22px] font-black uppercase leading-none tracking-[-0.01em] [font-variation-settings:'wdth'_80]">
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
                          <Link href={`/${game}/eroi/${hero.id}`} className="flex items-center gap-2 bg-paper-2 px-2 py-1.5 hover:bg-paper-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={heroCardSrc(game, hero.id)} alt="" width={40} height={40} className="h-10 w-10" loading="lazy" />
                            <span className="text-[13px] font-semibold">{heroName(hero, locale)}</span>
                          </Link>
                        ) : (
                          <span className="block bg-paper-2 px-2 py-1.5 text-[13px]" lang="en">
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
