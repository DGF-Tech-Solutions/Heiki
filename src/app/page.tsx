import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { cx, display, Empty, eyebrow, numeric, SectionHead, Tag } from "@/components/ui";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { rankCharacters } from "@/lib/games/preview";

/**
 * Radice del sito: si sceglie il gioco.
 *
 * Non c'e' una frase di apertura. Chi arriva qui sa gia' cosa cerca - o viene da
 * una ricerca, e allora atterra direttamente su una scheda personaggio. Una
 * pagina di ingresso che deve convincere serve ai prodotti che si vendono, non
 * agli strumenti che si usano.
 */

export const metadata: Metadata = {
  title: "GachaZone — build, calcoli e community per i giochi gacha",
  description:
    "Schede personaggio, simulazioni di danno verificabili e community per Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero e Wuthering Waves.",
};

export default async function Home() {
  const games = listGames();

  const store = await getStore();
  const latest = sortFeed(await store.listPosts(null, null, null), "hot").slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-20">
      <section>
        <SectionHead title="Giochi" aside={<span className={eyebrow}>{games.length} previsti</span>} />

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
                    <Tag>in arrivo</Tag>
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
                  <Tag tone="brand">attivo</Tag>
                </div>
                <p className="mt-2 text-xs text-ink-3">{game.publisher}</p>
                <p className={cx(numeric, "mt-3 text-xs text-ink-2")}>
                  {characters} personaggi · dati {gameModule?.dataset.patch}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-11 border-t border-rule pt-9">
        <SectionHead
          title="Ultimi post"
          aside={
            <Link
              href={`/${games.find((game) => game.available)?.slug ?? ""}`}
              className={cx(eyebrow, "text-brand hover:underline")}
            >
              Community →
            </Link>
          }
        />

        {latest.length === 0 ? (
          <Empty>Ancora nessuna discussione.</Empty>
        ) : (
          <div className="grid gap-3.5">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <TopCharacters />
    </main>
  );
}

/** Estratto della classifica: e' la porta d'ingresso alle schede personaggio. */
function TopCharacters() {
  const game = listGames().find((entry) => entry.available);
  const gameModule = game ? getGameModule(game.slug) : undefined;
  if (!game || !gameModule) return null;

  const ranked = rankCharacters(gameModule).slice(0, 5);
  if (ranked.length === 0) return null;

  return (
    <section className="mt-11 border-t border-rule pt-9">
      <SectionHead
        title={`Classifica ${game.shortName}`}
        aside={
          <Link
            href={`/${game.slug}/classifica`}
            className={cx(eyebrow, "text-brand hover:underline")}
          >
            Classifica completa →
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
              {Math.round(row.result.damage.median).toLocaleString("it-IT")}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
