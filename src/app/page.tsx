import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { HeroStage, stageArtOf } from "@/components/heroes/hero-stage";
import { buttonClass, cx, display, eyebrow, MoreLink, numeric, SectionHead } from "@/components/ui";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Radice del sito: si sceglie il gioco.
 *
 * Non c'e' una frase di apertura. Chi arriva qui sa gia' cosa cerca - o viene da
 * una ricerca, e allora atterra direttamente su una scheda personaggio. Una
 * pagina di ingresso che deve convincere serve ai prodotti che si vendono, non
 * agli strumenti che si usano.
 */

const TESTI = testi({
  it: {
    titoloPagina: "GachaZone — schede, dati e community per i giochi gacha",
    descrizione:
      "Schede degli eroi, dati e meccaniche lette dal gioco, e community per Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero e Wuthering Waves.",
    giochi: "Giochi",
    inArrivo: "In arrivo",
    entra: "Entra nel gioco",
    // solo la parola: il numero va nel monospaziato, la parola no
    eroi: (n: number): string => (n === 1 ? "eroe" : "eroi"),
    ultimiPost: "Ultimi post",
    community: "Community",
    discussioni: "Discussioni",
    nessunaDiscussione: "Ancora nessuna discussione: la prima la scrivi tu.",
    scrivi: "Apri le Discussioni",
  },
  en: {
    titoloPagina: "GachaZone — pages, data and community for gacha games",
    descrizione:
      "Hero pages, data and mechanics read from the game, and community for Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero and Wuthering Waves.",
    giochi: "Games",
    inArrivo: "Coming soon",
    entra: "Enter the game",
    eroi: (n: number): string => (n === 1 ? "hero" : "heroes"),
    ultimiPost: "Latest posts",
    community: "Community",
    discussioni: "Discussions",
    nessunaDiscussione: "No discussions yet: you write the first one.",
    scrivi: "Open the Discussions",
  },
});

/** Una riga di servizio sotto il palco: l'etichetta a sinistra, sul telefono sopra. */
const INFO_ROW = "grid gap-x-5 gap-y-1 py-3 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-baseline";

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    description: t.descrizione,
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
      <h1 className="sr-only">{t.titoloPagina}</h1>
      <section aria-label={t.giochi} className="grid gap-5">
        {active.map((game) => {
          const gameModule = getGameModule(game.slug);
          const heroes = gameModule?.roster?.heroes ?? [];
          const newest = heroes[0];
          const affinity = newest ? gameModule?.roster?.affinities.find((a) => a.id === newest.affinity) : undefined;
          return newest ? (
            <Link key={game.slug} href={`/${game.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4">
              <HeroStage
                game={game.slug}
                hero={newest}
                locale={locale}
                affinity={affinity}
                size="hero"
                priority
                headingLevel="h2"
                plate={{ kicker: game.publisher, title: game.name }}
                art={stageArtOf(gameModule?.heroAssets?.[newest.id])}
                className="p5-corner transition-[filter] duration-200 group-hover:drop-shadow-[6px_6px_0_var(--color-brand)]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className={buttonClass("primary", "md")}>{t.entra}</span>
                  <span className="text-[13px] text-ink-2">
                    <span className={cx(numeric, "font-medium text-ink")}>{heroes.length}</span> {t.eroi(heroes.length)}
                  </span>
                </span>
              </HeroStage>
            </Link>
          ) : (
            <Link key={game.slug} href={`/${game.slug}`} className={cx(display, "p5-corner block border border-rule bg-paper-2 p-6 text-4xl")}>
              {game.name}
            </Link>
          );
        })}
      </section>

      {/*
        Due righe di servizio sotto il palco, alla stessa misura: i giochi che
        arrivano e, finche' non c'e' un post, le Discussioni.

        I giochi in arrivo non hanno ancora pagine: fino al 10/10 i loro nomi
        corti erano nel carattere dei comandi (GENSHIN, STAR RAIL...) e si
        prendevano per collegamenti. Ora sono una frase, coi nomi interi.

        Senza post, al posto di «Ultimi post» c'era un riquadro con una frase:
        in una home sembrava un errore. Ora e' una riga che lo dice e porta li'.
      */}
      {planned.length > 0 || latest.length === 0 ? (
        <dl className="m-0 mt-5 divide-y divide-rule-2 border-y border-rule-2">
          {planned.length > 0 ? (
            <div className={INFO_ROW}>
              <dt className={eyebrow}>{t.inArrivo}</dt>
              <dd className="m-0 text-sm text-ink-2">
                {new Intl.ListFormat(intlLocale(locale), { type: "conjunction" }).format(planned.map((game) => game.name))}
              </dd>
            </div>
          ) : null}
          {latest.length === 0 ? (
            <div className={INFO_ROW}>
              <dt className={eyebrow}>{t.discussioni}</dt>
              <dd className="m-0 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5">
                <span className="text-sm text-ink-2">{t.nessunaDiscussione}</span>
                <MoreLink href={`/${active[0]?.slug ?? ""}/discussioni`}>{t.scrivi}</MoreLink>
              </dd>
            </div>
          ) : null}
        </dl>
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
