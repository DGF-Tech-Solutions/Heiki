import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artOf, HeroStage } from "@/components/heroes/hero-stage";
import { buttonClass, cx, display, eyebrow, numeric } from "@/components/ui";
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
 * Il movimento della pagina e' uno: i comandi entrano uno dopo l'altro
 * (`hub-command`, globals.css), come i menu del gioco a cui il sito si ispira.
 */

const TESTI = testi({
  it: {
    descrizione: (gioco: string) => `Eroi, uscite, endgame e strumenti di ${gioco}, coi dati letti dal gioco.`,
    riga: (eroi: number, aggiornamenti: number) => `${eroi} eroi · ${aggiornamenti} aggiornamenti nel calendario · dati letti dal client del gioco`,
    menu: "Sezioni",
    ultimoEroe: "L'ultimo eroe uscito",
    apri: "Apri la scheda",
    ultimi: "Gli ultimi eroi",
    tutti: "Tutti gli eroi →",
    prossimo: "Prossimo aggiornamento",
    ultimo: "Ultimo aggiornamento",
    nelCalendario: "Nel calendario →",
    eroiNuovi: (n: number) => (n === 1 ? "1 eroe nuovo" : `${n} eroi nuovi`),
    nessunEroe: "Nessun eroe nuovo",
  },
  en: {
    descrizione: (game: string) => `${game} heroes, releases, endgame and tools, with data read from the game.`,
    riga: (heroes: number, updates: number) => `${heroes} heroes · ${updates} updates in the calendar · data read from the game client`,
    menu: "Sections",
    ultimoEroe: "The latest hero released",
    apri: "Open the page",
    ultimi: "The latest heroes",
    tutti: "All heroes →",
    prossimo: "Next update",
    ultimo: "Latest update",
    nelCalendario: "In the calendar →",
    eroiNuovi: (n: number) => (n === 1 ? "1 new hero" : `${n} new heroes`),
    nessunEroe: "No new heroes",
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
  const day = (value: string) =>
    new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(`${value}T00:00:00Z`),
    );
  const byId = new Map(heroes.map((h) => [h.id, h]));

  return (
    <main className="pt-6 pb-20">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,440px)]">
        <div className="min-w-0">
          <h1 className={cx(display, "text-[clamp(40px,6.4vw,84px)] leading-[0.9]")}>{entry.name}</h1>
          <p className={cx(numeric, "mt-3 text-[13px] text-ink-2")}>{t.riga(heroes.length, updates.length)}</p>

          {/*
            I comandi: il primo enorme, poi a scalare. Ogni comando porta alla
            prima voce del suo gruppo, e sotto ha le altre, piccole.
          */}
          <nav aria-label={t.menu} className="mt-8">
            <ol className="hub-menu m-0 grid list-none gap-5 p-0">
              {groups.map((group, index) => {
                const [main, ...rest] = group.items;
                if (!main) return null;
                return (
                  <li key={group.label} className="hub-command" style={{ "--i": index } as React.CSSProperties}>
                    <p className={cx(eyebrow, "m-0 mb-1")}>{group.label}</p>
                    <Link
                      href={`/${game}${main.path}`}
                      title={main.hint}
                      className={cx("hub-command-link p5-menu-item", `hub-command--${Math.min(index, 4)}`)}
                    >
                      {main.label}
                    </Link>
                    {rest.length > 0 ? (
                      <ul className="m-0 mt-1.5 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
                        {rest.map((item) => (
                          <li key={item.path}>
                            <Link
                              href={`/${game}${item.path}`}
                              title={item.hint}
                              className="font-display text-[15px] font-extrabold uppercase tracking-[0.02em] text-ink-2 [font-variation-settings:'wdth'_82] hover:text-brand-deep"
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
          <aside aria-label={t.ultimoEroe} className="lg:sticky lg:top-[76px]">
            <p className={cx(eyebrow, "m-0 mb-2")}>{t.ultimoEroe}</p>
            <HeroStage
              game={game}
              hero={latest}
              locale={locale}
              affinity={affinity}
              badges={affinity ? [{ label: affinityLabel(affinity.id, locale) }, { label: `${latest.obtainedAs} → ${latest.rarity}` }] : undefined}
              priority
              art={artOf(gameModule?.heroAssets?.[latest.id])}
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
        <section className="mt-12">
          <div className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-brand pb-2">
            <h2 className={cx(display, "text-2xl")}>{t.ultimi}</h2>
            <Link href={`/${game}/eroi`} className="text-[13px] font-semibold text-brand-deep hover:underline">
              {t.tutti}
            </Link>
          </div>
          <ul className="m-0 grid list-none grid-cols-4 gap-2.5 p-0 sm:grid-cols-6 lg:grid-cols-8">
            {heroes.slice(0, 8).map((hero) => (
              <li key={hero.id} className="min-w-0">
                <Link href={`/${game}/eroi/${hero.id}`} className="hero-card group block">
                  <span className="hero-card-art block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroCardSrc(game, hero.id)} alt="" width={128} height={128} loading="lazy" className="block aspect-square w-full bg-paper-2" />
                  </span>
                  <span className="mt-1 block truncate text-[12px] text-ink-3">{heroEpithet(hero, locale)}</span>
                  <span className="hero-card-name line-clamp-2 font-display text-[12px] font-black uppercase leading-[1.08] [font-variation-settings:'wdth'_72]">
                    {heroName(hero, locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {update ? (
        <section className="mt-10">
          <div className="p5-corner grid gap-3 border border-rule bg-paper-2 p-5 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:items-start">
            <div>
              <p className={cx(eyebrow, "m-0")}>{next ? t.prossimo : t.ultimo}</p>
              <p className={cx(display, "m-0 mt-1 text-[28px] leading-none")}>{day(update.date)}</p>
              <p className="m-0 mt-1.5 text-[13px] text-ink-2">{heroesIn(update) > 0 ? t.eroiNuovi(heroesIn(update)) : t.nessunEroe}</p>
              <Link href={`/${game}/uscite#u-${update.date}`} className="mt-2 inline-block text-[13px] font-semibold text-brand-deep hover:underline">
                {t.nelCalendario}
              </Link>
            </div>
            <div className="grid gap-2">
              {update.heroes.length > 0 ? (
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {update.heroes.map((released) => {
                    const hero = released.heroId ? byId.get(released.heroId) : undefined;
                    return (
                      <li key={`${released.name}-${released.rarity}`}>
                        {hero ? (
                          <Link href={`/${game}/eroi/${hero.id}`} className="flex items-center gap-2 bg-paper px-2 py-1.5 hover:bg-paper-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={heroCardSrc(game, hero.id)} alt="" width={40} height={40} className="h-10 w-10" loading="lazy" />
                            <span className="text-[13px] font-semibold">{heroName(hero, locale)}</span>
                          </Link>
                        ) : (
                          <span className="block bg-paper px-2 py-1.5 text-[13px]" lang="en">
                            {released.name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
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
