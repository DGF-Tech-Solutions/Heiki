import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { artOf, HeroStage } from "@/components/heroes/hero-stage";
import { buttonClass, cx, display, Empty, eyebrow, numeric, SectionHead } from "@/components/ui";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
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
    eroi: (n: number) => `${n} eroi`,
    ultimiPost: "Ultimi post",
    community: "Community →",
    nessunaDiscussione: "Ancora nessuna discussione: la prima la scrivi tu.",
    scrivi: "Apri le Discussioni →",
  },
  en: {
    titoloPagina: "GachaZone — pages, data and community for gacha games",
    descrizione:
      "Hero pages, data and mechanics read from the game, and community for Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero and Wuthering Waves.",
    giochi: "Games",
    inArrivo: "Coming soon",
    entra: "Enter the game",
    eroi: (n: number) => `${n} ${n === 1 ? "hero" : "heroes"}`,
    ultimiPost: "Latest posts",
    community: "Community →",
    nessunaDiscussione: "No discussions yet: you write the first one.",
    scrivi: "Open the Discussions →",
  },
});

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
                art={artOf(gameModule?.heroAssets?.[newest.id])}
                className="p5-corner transition-[filter] duration-200 group-hover:drop-shadow-[6px_6px_0_var(--color-brand)]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className={buttonClass("primary", "md")}>{t.entra}</span>
                  <span className={cx(numeric, "text-[13px] text-ink-2")}>{t.eroi(heroes.length)}</span>
                </span>
              </HeroStage>
            </Link>
          ) : (
            <Link key={game.slug} href={`/${game.slug}`} className={cx(display, "p5-corner block border border-rule bg-paper-2 p-6 text-4xl")}>
              {game.name}
            </Link>
          );
        })}

        {planned.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-rule-2 py-3">
            <span className={eyebrow}>{t.inArrivo}</span>
            {planned.map((game) => (
              <span key={game.slug} className="font-display text-[15px] font-extrabold uppercase text-ink-3 [font-variation-settings:'wdth'_85]">
                {game.shortName}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-12">
        <SectionHead
          title={t.ultimiPost}
          aside={
            <Link
              href={`/${active[0]?.slug ?? ""}/discussioni`}
              className={buttonClass("outline", "sm", "shrink-0")}
            >
              {t.community}
            </Link>
          }
        />

        {latest.length === 0 ? (
          <Empty>
            {t.nessunaDiscussione}{" "}
            <Link href={`/${active[0]?.slug ?? ""}/discussioni`} className="font-semibold text-brand-deep hover:underline">
              {t.scrivi}
            </Link>
          </Empty>
        ) : (
          <div className="grid gap-3.5">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
