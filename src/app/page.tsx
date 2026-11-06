import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { HeroStage, stageArtOf } from "@/components/heroes/hero-stage";
import { buttonClass, cx, display, MoreLink, numeric, SectionHead } from "@/components/ui";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { gameGroups, listGames } from "@/lib/games/catalog";
import { heroName } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Radice del sito: una frase che dice cos'e', il gioco, le pagine per cui si viene.
 *
 * Una sola voce forte: la frase, sul palco con l'ultimo eroe uscito, come la testa della
 * scheda. Sotto le quattro pagine piu' cercate. Niente di piu': ricerca, lingua e accesso
 * sono gia' nell'intestazione.
 */

const TESTI = testi({
  it: {
    titoloPagina: "Heiki: schede, dati e community per i giochi gacha",
    descrizione: (giochi: string): string =>
      `Schede degli eroi, tier list, squadre e calendario delle uscite di ${giochi}, con i numeri presi dal gioco.`,
    titolo: (giochi: string): string => `Ogni eroe di ${giochi}, con i numeri presi dal gioco`,
    giochi: "Giochi",
    pagine: (gioco: string): string => `Le pagine di ${gioco}`,
    inArrivo: (giochi: string): string => `In arrivo anche ${giochi}.`,
    apri: (gioco: string): string => `Apri ${gioco}`,
    ultimaUscita: (eroe: string): string => `Ultima uscita: ${eroe}`,
    // solo la parola: il numero va nel monospaziato, la parola no
    eroi: (n: number): string => (n === 1 ? "eroe" : "eroi"),
    ultimiPost: "Ultimi post",
    community: "Community",
  },
  en: {
    titoloPagina: "Heiki: hero pages, data and community for gacha games",
    descrizione: (giochi: string): string =>
      `Hero pages, tier lists, teams and the release calendar for ${giochi}, with the numbers taken from the game.`,
    titolo: (giochi: string): string => `Every ${giochi} hero, with the numbers taken from the game`,
    giochi: "Games",
    pagine: (gioco: string): string => `${gioco} pages`,
    inArrivo: (giochi: string): string => `Also on the way: ${giochi}.`,
    apri: (gioco: string): string => `Open ${gioco}`,
    ultimaUscita: (eroe: string): string => `Latest release: ${eroe}`,
    eroi: (n: number): string => (n === 1 ? "hero" : "heroes"),
    ultimiPost: "Latest posts",
    community: "Community",
  },
});

/**
 * Le pagine sotto il palco (24/10): quelle per cui si arriva, nell'ordine in cui
 * le si cerca. I nomi li da' il catalogo, cosi' restano quelli del menu; se un
 * gioco non ne ha una, la voce non c'e'.
 */
const SCORCIATOIE = ["/eroi", "/tierlist", "/squadra", "/uscite"] as const;

/** Una voce di quelle pagine: come le voci del menu, col passaggio di `p5-menu-item`. */
const COMANDO = "p5-menu-item block whitespace-nowrap px-3 py-2 font-display text-[16px] no-underline";

/** I nomi dei giochi in una frase: «Grand Cross», «Genshin Impact e Wuthering Waves». */
function elenco(nomi: readonly string[], locale: Locale): string {
  return new Intl.ListFormat(intlLocale(locale), { type: "conjunction" }).format(nomi);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = TESTI[locale];
  const giochi = listGames().filter((game) => game.available);
  return {
    title: t.titoloPagina,
    description: t.descrizione(elenco(giochi.map((game) => game.shortName), locale)),
  };
}

export default async function Home() {
  const games = listGames();
  const locale = await getLocale();
  const t = TESTI[locale];

  const store = await getStore();
  const latest = sortFeed(await store.listPosts(null, null, null), "hot").slice(0, 3);

  // Il gioco attivo in grande, gli altri in una riga (10/10: prima quattro giochi
  // «in arrivo» occupavano l'80% della pagina, alla pari dell'unico che c'e').
  const active = games.filter((game) => game.available);
  const planned = games.filter((game) => !game.available);

  return (
    <main className="mx-auto w-full max-w-shell px-6 pt-8 pb-20">
      <section aria-label={t.giochi} className="grid gap-10">
        {active.map((game, index) => {
          const gameModule = getGameModule(game.slug);
          const heroes = gameModule?.roster?.heroes ?? [];
          const newest = heroes[0];
          const affinity = newest ? gameModule?.roster?.affinities.find((a) => a.id === newest.affinity) : undefined;
          const pagine = gameGroups(game.slug, locale).flatMap((group) => group.items);
          const scorciatoie = SCORCIATOIE.flatMap((path) => pagine.filter((item) => item.path === path));
          // la voce forte e' una: la frase su cos'e' il sito, sul palco del primo gioco
          const titolo = index === 0 ? t.titolo(elenco(active.map((voce) => voce.shortName), locale)) : game.name;
          const Titolo = index === 0 ? "h1" : "h2";
          return (
            <div key={game.slug}>
              {newest ? (
                <HeroStage
                  game={game.slug}
                  hero={newest}
                  locale={locale}
                  affinity={affinity}
                  size="hero"
                  priority
                  headingLevel={Titolo}
                  plate={{ kicker: t.ultimaUscita(heroName(newest, locale)), title: titolo }}
                  art={stageArtOf(gameModule?.heroAssets?.[newest.id])}
                >
                  <span className="flex flex-wrap items-center gap-3">
                    {/* «Apri» e il nome del gioco: «Entra» nell'intestazione e' l'accesso (24/10) */}
                    <Link href={`/${game.slug}`} className={buttonClass("primary", "md")}>
                      {t.apri(game.shortName)}
                    </Link>
                    <span className="text-[13px] text-ink-2">
                      <span className={cx(numeric, "font-medium text-ink")}>{heroes.length}</span> {t.eroi(heroes.length)}
                    </span>
                  </span>
                </HeroStage>
              ) : (
                <Titolo className={cx(display, "text-[clamp(38px,6vw,76px)]")}>
                  <Link href={`/${game.slug}`}>{titolo}</Link>
                </Titolo>
              )}
              {scorciatoie.length > 0 ? (
                <nav aria-label={t.pagine(game.shortName)} className="mt-6 border-t border-rule pt-3">
                  <ul className="m-0 flex list-none flex-wrap gap-x-1 p-0 max-sm:-mx-3">
                    {scorciatoie.map((item) => (
                      <li key={item.path}>
                        <Link href={item.href} title={item.hint} className={COMANDO}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>
          );
        })}
      </section>

      {/*
        I giochi che arriveranno: una frase coi nomi interi, senza etichetta e
        senza collegamenti, perche' pagine non ne hanno (fino al 10/10 i nomi
        corti nel carattere dei comandi si prendevano per collegamenti).

        La riga «Discussioni: ancora nessuna discussione» e' sparita il 24/10:
        a chi arriva diceva che il sito e' vuoto. Le Discussioni tornano qui coi
        primi post, sotto.
      */}
      {planned.length > 0 ? (
        <p className="m-0 mt-8 max-w-[65ch] text-sm text-ink-3">{t.inArrivo(elenco(planned.map((game) => game.name), locale))}</p>
      ) : null}

      {latest.length > 0 ? (
        <section className="mt-12">
          <SectionHead
            title={t.ultimiPost}
            aside={
              <MoreLink href={`/${active[0]?.slug ?? ""}/discussioni`} className="shrink-0">
                {t.community}
              </MoreLink>
            }
          />
          <div className="grid gap-3.5">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
