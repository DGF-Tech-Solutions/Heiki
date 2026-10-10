import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { eyebrow, Empty, Input, PageHeader, SectionHead, Tag } from "@/components/ui";
import { currentViewer } from "@/lib/community/actions";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { listGames } from "@/lib/games/catalog";
import { heroEpithet, heroName } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Cerca",
    cerca: "Cerca",
    segnaposto: "Nome di un eroe o parole di un post",
    termini: "Termini di ricerca",
    dueCaratteri: "Scrivi almeno due caratteri.",
    personaggi: "Eroi",
    nessunPersonaggio: "Nessun eroe con questo nome.",
    discussioni: "Discussioni",
    nessunaDiscussione: "Nessuna discussione con queste parole.",
  },
  en: {
    titoloPagina: "Search",
    cerca: "Search",
    segnaposto: "A hero's name or words from a post",
    termini: "Search terms",
    dueCaratteri: "Type at least two characters.",
    personaggi: "Heroes",
    nessunPersonaggio: "No heroes with this name.",
    discussioni: "Discussions",
    nessunaDiscussione: "No discussions with these words.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina };
}

interface Props {
  searchParams: Promise<{ q?: string }>;
}

/**
 * Ricerca su post e personaggi.
 *
 * Il filtro e' in memoria e non in SQL: a questa scala i post sono al massimo
 * un centinaio e gli eroi qualche centinaio, quindi una query full-text
 * aggiungerebbe complessita' senza risolvere un problema che ancora non
 * esiste. Quando i numeri cresceranno, il punto da cambiare e' solo questo.
 */
export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const needle = query.toLowerCase();
  const locale = await getLocale();
  const t = TESTI[locale];

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
            const gameModule = getGameModule(game.slug);
            if (!gameModule) return [];
            // Gli eroi del roster, per nome ed epiteto nelle due lingue. Fino al 27/09
            // qui c'erano i «personaggi» del vecchio motore di simulazione: tre unita'
            // segnaposto, tolte con le loro pagine.
            return (gameModule.roster?.heroes ?? [])
              .filter((hero) =>
                [hero.name, hero.nameIt, hero.epithet, hero.epithetIt].some((text) => text?.toLowerCase().includes(needle)),
              )
              .slice(0, 30)
              .map((hero) => ({ game, hero }));
          })
      : [];

  return (
    <main className="mx-auto w-full max-w-[900px] px-6 pt-8 pb-20">
      <PageHeader title={query ? `“${query}”` : t.cerca} />

      <form action="/cerca" className="mb-8">
        <Input name="q" defaultValue={query} placeholder={t.segnaposto} aria-label={t.termini} />
      </form>

      {needle.length < 2 ? (
        <Empty>{t.dueCaratteri}</Empty>
      ) : (
        <>
          <section className="mb-9">
            <SectionHead
              title={t.personaggi}
              aside={<span className={eyebrow}>{characters.length}</span>}
            />
            {characters.length === 0 ? (
              <Empty>{t.nessunPersonaggio}</Empty>
            ) : (
              <ul className="m-0 grid list-none gap-2 p-0">
                {characters.map(({ game, hero }) => (
                  <li key={`${game.slug}-${hero.id}`}>
                    <Link
                      href={`/${game.slug}/eroi/${hero.id}`}
                      className="flex flex-wrap items-center gap-3 border border-rule bg-paper-2 px-4 py-2.5 transition-colors hover:border-brand"
                    >
                      <span className="font-display font-black uppercase [font-variation-settings:'wdth'_80]">{heroName(hero, locale)}</span>
                      <span className="text-ink-3">{heroEpithet(hero, locale)}</span>
                      <Tag>{game.shortName}</Tag>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionHead
              title={t.discussioni}
              aside={<span className={eyebrow}>{posts.length}</span>}
            />
            {posts.length === 0 ? (
              <Empty>{t.nessunaDiscussione}</Empty>
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
