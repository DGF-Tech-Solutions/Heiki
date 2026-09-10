import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { cx, display, Empty, eyebrow, Input, SectionHead, Tag } from "@/components/ui";
import { currentViewer } from "@/lib/community/actions";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";

export const metadata: Metadata = {
  title: "Cerca · GachaZone",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

/**
 * Ricerca su post e personaggi.
 *
 * Il filtro e' in memoria e non in SQL: a questa scala i post sono al massimo
 * un centinaio e i personaggi una manciata, quindi una query full-text
 * aggiungerebbe complessita' senza risolvere un problema che ancora non
 * esiste. Quando i numeri cresceranno, il punto da cambiare e' solo questo.
 */
export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const needle = query.toLowerCase();

  const viewer = await currentViewer();
  const store = await getStore();

  const posts =
    needle.length >= 2
      ? sortFeed(
          (await store.listPosts(null, null, viewer)).filter(
            (post) =>
              post.title.toLowerCase().includes(needle) ||
              post.excerpt.toLowerCase().includes(needle),
          ),
          "hot",
        )
      : [];

  const characters =
    needle.length >= 2
      ? listGames()
          .filter((game) => game.available)
          .flatMap((game) => {
            const module = getGameModule(game.slug);
            if (!module) return [];
            return module.characters
              .filter((character) => character.name.toLowerCase().includes(needle))
              .map((character) => ({ game, character }));
          })
      : [];

  return (
    <main className="mx-auto w-full max-w-[900px] px-6 pt-8 pb-20">
      <p className={eyebrow}>Ricerca</p>
      <h1 className={cx(display, "mt-2 mb-5 text-[32px]")}>
        {query ? `“${query}”` : "Cerca"}
      </h1>

      <form action="/cerca" className="mb-8">
        <Input
          name="q"
          defaultValue={query}
          placeholder="Nome di un personaggio o parole di un post"
          aria-label="Termini di ricerca"
        />
      </form>

      {needle.length < 2 ? (
        <Empty>Scrivi almeno due caratteri.</Empty>
      ) : (
        <>
          <section className="mb-9">
            <SectionHead
              title="Personaggi"
              aside={<span className={eyebrow}>{characters.length}</span>}
            />
            {characters.length === 0 ? (
              <Empty>Nessun personaggio con questo nome.</Empty>
            ) : (
              <ul className="m-0 grid list-none gap-2 p-0">
                {characters.map(({ game, character }) => (
                  <li key={`${game.slug}-${character.id}`}>
                    <Link
                      href={`/${game.slug}/personaggi/${character.id}`}
                      className="flex flex-wrap items-center gap-3 rounded-card border border-rule bg-paper px-4 py-2.5 hover:border-brand"
                    >
                      <span className="font-semibold">{character.name}</span>
                      <Tag>{game.shortName}</Tag>
                      <Tag>{character.role}</Tag>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionHead
              title="Discussioni"
              aside={<span className={eyebrow}>{posts.length}</span>}
            />
            {posts.length === 0 ? (
              <Empty>Nessuna discussione con queste parole.</Empty>
            ) : (
              <div className="grid gap-3.5">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
