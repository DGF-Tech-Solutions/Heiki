import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { cx, display, Empty, eyebrow, numeric, SectionHead, Tag } from "@/components/ui";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { rankCharacters } from "@/lib/games/preview";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
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
    titoloPagina: "GachaZone — build, calcoli e community per i giochi gacha",
    descrizione:
      "Schede personaggio, simulazioni di danno verificabili e community per Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero e Wuthering Waves.",
    giochi: "Giochi",
    previsti: (n: number) => `${n} previsti`,
    inArrivo: "in arrivo",
    attivo: "attivo",
    personaggiDati: (n: number, patch: string) => `${n} personaggi · dati ${patch}`,
    ultimiPost: "Ultimi post",
    community: "Community →",
    nessunaDiscussione: "Ancora nessuna discussione.",
    classifica: (gioco: string) => `Classifica ${gioco}`,
    classificaCompleta: "Classifica completa →",
  },
  en: {
    titoloPagina: "GachaZone — builds, calculations and community for gacha games",
    descrizione:
      "Character pages, verifiable damage simulations and community for Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero and Wuthering Waves.",
    giochi: "Games",
    previsti: (n: number) => `${n} planned`,
    inArrivo: "coming soon",
    attivo: "active",
    personaggiDati: (n: number, patch: string) =>
      `${n} ${n === 1 ? "character" : "characters"} · data ${patch}`,
    ultimiPost: "Latest posts",
    community: "Community →",
    nessunaDiscussione: "No discussions yet.",
    classifica: (gioco: string) => `${gioco} ranking`,
    classificaCompleta: "Full ranking →",
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
  const latest = sortFeed(await store.listPosts(null, null, null), "hot").slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-20">
      <section>
        <SectionHead title={t.giochi} aside={<span className={eyebrow}>{t.previsti(games.length)}</span>} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => {
            const gameModule = getGameModule(game.slug);
            const characters = gameModule?.characters.length ?? 0;

            if (!game.available) {
              return (
                <div
                  key={game.slug}
                  className="rounded-card border border-dashed border-rule bg-paper-2 p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={cx(display, "text-base text-ink-3 [font-variation-settings:'wdth'_92]")}
                    >
                      {game.shortName}
                    </h3>
                    <Tag>{t.inArrivo}</Tag>
                  </div>
                  <p className="mt-2 text-xs text-ink-3">{game.publisher}</p>
                </div>
              );
            }

            return (
              <Link
                key={game.slug}
                href={`/${game.slug}`}
                className="rounded-card border border-rule bg-paper p-4 transition-colors hover:border-brand"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className={cx(display, "text-base [font-variation-settings:'wdth'_92]")}>
                    {game.shortName}
                  </h3>
                  <Tag tone="brand">{t.attivo}</Tag>
                </div>
                <p className="mt-2 text-xs text-ink-3">{game.publisher}</p>
                <p className={cx(numeric, "mt-3 text-xs text-ink-2")}>
                  {t.personaggiDati(characters, gameModule?.dataset.patch ?? "")}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-11 border-t border-rule pt-9">
        <SectionHead
          title={t.ultimiPost}
          aside={
            <Link
              href={`/${games.find((game) => game.available)?.slug ?? ""}`}
              className={cx(eyebrow, "text-brand hover:underline")}
            >
              {t.community}
            </Link>
          }
        />

        {latest.length === 0 ? (
          <Empty>{t.nessunaDiscussione}</Empty>
        ) : (
          <div className="grid gap-3.5">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <TopCharacters locale={locale} />
    </main>
  );
}

/** Estratto della classifica: e' la porta d'ingresso alle schede personaggio. */
function TopCharacters({ locale }: { locale: Locale }) {
  const game = listGames().find((entry) => entry.available);
  const gameModule = game ? getGameModule(game.slug) : undefined;
  if (!game || !gameModule) return null;

  const ranked = rankCharacters(gameModule).slice(0, 5);
  if (ranked.length === 0) return null;

  const t = TESTI[locale];

  return (
    <section className="mt-11 border-t border-rule pt-9">
      <SectionHead
        title={t.classifica(game.shortName)}
        aside={
          <Link
            href={`/${game.slug}/classifica`}
            className={cx(eyebrow, "text-brand hover:underline")}
          >
            {t.classificaCompleta}
          </Link>
        }
      />

      <ol className="m-0 grid list-none gap-2 p-0">
        {ranked.map((row, index) => (
          <li
            key={row.character.id}
            className="flex flex-wrap items-center gap-3 rounded-card border border-rule bg-paper px-4 py-2.5"
          >
            <span className={cx(numeric, "w-5 text-ink-3")}>{index + 1}</span>
            <Link
              href={`/${game.slug}/personaggi/${row.character.id}`}
              className="font-semibold hover:text-brand"
            >
              {row.character.name}
            </Link>
            <Tag>{row.character.role}</Tag>
            <span className={cx(numeric, "ml-auto font-medium")}>
              {Math.round(row.result.damage.median).toLocaleString(intlLocale(locale))}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
