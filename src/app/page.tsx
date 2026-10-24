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
 * Fino al 24/10 non c'era una frase di apertura (il titolo era solo per i
 * lettori di schermo): si pensava che chi arriva sappia gia' cosa cerca. La
 * critica del 24/10 ha mostrato il contrario: chi atterra qui la prima volta non
 * sapeva cos'e' Heiki, e «Entra nel gioco» stava sotto l'«Entra» dell'accesso.
 * Ora una riga dice cosa trovi, il comando apre il gioco col suo nome, e sotto
 * il palco ci sono le quattro pagine piu' cercate. Niente di piu': ricerca,
 * lingua e accesso sono gia' nell'intestazione.
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

/**
 * Una voce di quelle pagine: un comando del menu del gioco in piccolo, la stessa
 * lama bianca al passaggio (`p5-menu-item`). Non un bottone: il rosso pieno resta
 * al solo «Apri», e non schede tutte uguali con icona e testo.
 */
// sul telefono una sotto l'altra, come il menu del gioco: in due colonne «Team
// Builder» andava a capo, e una voce alta 44px si prende col pollice. Niente
// `text-ink`: le utility vincono sui componenti, e al passaggio il testo restava
// chiaro sulla lama chiara (il colore lo eredita, e lo cambia `p5-menu-item`)
const COMANDO =
  "p5-menu-item -ml-[0.2em] inline-block whitespace-nowrap px-[0.2em] py-2 font-display text-[clamp(28px,2.8vw,40px)] font-black uppercase " +
  "leading-[0.95] tracking-[-0.01em] no-underline [font-variation-settings:'wdth'_68] sm:py-1.5";

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
      {/*
        La frase su cos'e' il sito, visibile (24/10): prima era solo per i
        lettori di schermo, e a chi arrivava nessuno lo diceva. Nomina i giochi
        che ci sono davvero; quelli che arriveranno stanno nella riga in fondo.
      */}
      <h1 className={cx(display, "mb-5 text-[clamp(24px,2.9vw,40px)]")}>
        {t.titolo(elenco(active.map((game) => game.shortName), locale))}
      </h1>
      <section aria-label={t.giochi} className="grid gap-10">
        {active.map((game) => {
          const gameModule = getGameModule(game.slug);
          const heroes = gameModule?.roster?.heroes ?? [];
          const newest = heroes[0];
          const affinity = newest ? gameModule?.roster?.affinities.find((a) => a.id === newest.affinity) : undefined;
          const pagine = gameGroups(game.slug, locale).flatMap((group) => group.items);
          const scorciatoie = SCORCIATOIE.flatMap((path) => pagine.filter((item) => item.path === path));
          return (
            <div key={game.slug}>
              {newest ? (
                <Link href={`/${game.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4">
                  {/*
                    Sulla lama bianca della targa c'era l'editore (NETMARBLE):
                    un'etichetta che non diceva niente. Ora dice chi e' la
                    figura, e perche' e' li' (24/10). L'eroe e' l'ultimo uscito
                    nel globale: il prossimo aggiornamento (29/10) non ne
                    annuncia, e un altro scelto a mano sarebbe inventato.
                  */}
                  <HeroStage
                    game={game.slug}
                    hero={newest}
                    locale={locale}
                    affinity={affinity}
                    size="hero"
                    priority
                    headingLevel="h2"
                    plate={{ kicker: t.ultimaUscita(heroName(newest, locale)), title: game.name }}
                    art={stageArtOf(gameModule?.heroAssets?.[newest.id])}
                    className="p5-corner transition-[filter] duration-200 group-hover:drop-shadow-[6px_6px_0_var(--color-brand)]"
                  >
                    <span className="flex flex-wrap items-center gap-3">
                      {/* «Apri» e il nome del gioco: «Entra» nell'intestazione e' l'accesso (24/10) */}
                      <span className={buttonClass("primary", "md")}>{t.apri(game.shortName)}</span>
                      <span className="text-[13px] text-ink-2">
                        <span className={cx(numeric, "font-medium text-ink")}>{heroes.length}</span> {t.eroi(heroes.length)}
                      </span>
                    </span>
                  </HeroStage>
                </Link>
              ) : (
                <Link href={`/${game.slug}`} className={cx(display, "p5-corner block border border-rule bg-paper-2 p-6 text-4xl")}>
                  {game.name}
                </Link>
              )}
              {scorciatoie.length > 0 ? (
                <nav aria-label={t.pagine(game.shortName)} className="mt-4">
                  <ul className="m-0 flex list-none flex-col items-start p-0 sm:flex-row sm:flex-wrap sm:gap-x-9">
                    {scorciatoie.map((item) => (
                      <li key={item.path}>
                        <Link href={`/${game.slug}${item.path}`} title={item.hint} className={COMANDO}>
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
