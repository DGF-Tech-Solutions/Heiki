import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import { Composer } from "@/components/community/composer";
import { SponsorSlot } from "@/components/community/sponsor-slot";
import { buttonClass, Card, cx, display, Empty, Notice } from "@/components/ui";
import { currentViewer } from "@/lib/community/actions";
import { FEED_SORTS, isFeedSort, sortFeed, type FeedSort } from "@/lib/community/ranking";
import { getStore } from "@/lib/community/store";
import { HUBS } from "@/lib/community/types";
import { findGame } from "@/lib/games/catalog";
import { auth } from "@/lib/auth";
import { followedUserIds, suggestedUsers } from "@/lib/social/actions";
import { databaseReachable } from "@/lib/db";

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ hub?: string; sort?: string; vista?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  return {
    title: `${entry?.shortName ?? "Community"} — community · GachaZone`,
    description: `Build, rotazioni e risultati di simulazione condivisi dai giocatori di ${entry?.name ?? "questo gioco"}.`,
  };
}

const CHIP = "inline-flex h-8 items-center rounded-card border px-3 text-[13px] transition-colors";

const CHIP_ON = "border-brand bg-brand-soft font-medium text-ink";
const CHIP_OFF = "border-rule text-ink-2 hover:border-ink-3 hover:text-ink";

export default async function GameFeedPage({ params, searchParams }: Props) {
  const { game } = await params;
  const query = await searchParams;

  const hub = HUBS.some((item) => item.slug === query.hub) ? (query.hub ?? null) : null;
  const sort: FeedSort = isFeedSort(query.sort) ? query.sort : "hot";
  const onlyFollowed = query.vista === "seguiti";

  const viewer = await currentViewer();
  const store = await getStore();
  const [rawPosts, sponsors] = await Promise.all([
    store.listPosts(game, hub, viewer),
    store.listSponsors(),
  ]);

  // Il filtro sui seguiti e' in memoria: il feed carica al massimo cento post e
  // una join in piu' non pagherebbe. Il punto da cambiare, quando i numeri
  // cresceranno, e' solo questo.
  const session = await safeSession();
  const followedUsernames = await followedNames(session?.user?.id);
  const visible = onlyFollowed
    ? rawPosts.filter((post) => followedUsernames.has(post.author.username))
    : rawPosts;

  const posts = sortFeed(visible, sort);
  const suggestions = onlyFollowed && posts.length === 0 ? await safeSuggestions() : [];
  const link = (nextHub: string | null, nextSort: FeedSort, followed = onlyFollowed) => {
    const search = new URLSearchParams();
    if (nextHub) search.set("hub", nextHub);
    if (nextSort !== "hot") search.set("sort", nextSort);
    if (followed) search.set("vista", "seguiti");
    const suffix = search.toString();
    return suffix ? `/${game}?${suffix}` : `/${game}`;
  };

  return (
    <>
      <main className="pt-6 pb-20">
        {store.volatile ? (
          <Notice className="mb-4">
            <span>
              <strong>Modalità dimostrativa.</strong> Puoi pubblicare, commentare e votare, ma i
              contenuti stanno nella memoria del server e spariscono al riavvio.
            </span>
          </Notice>
        ) : null}

        {session?.user ? (
          <nav className="mb-4 flex gap-5 border-b border-rule" aria-label="Vista">
            <Link
              href={link(hub, sort, false)}
              aria-current={!onlyFollowed ? "page" : undefined}
              className={cx(
                "-mb-px border-b-2 pb-2.5 text-sm",
                onlyFollowed
                  ? "border-transparent text-ink-2 hover:text-ink"
                  : "border-brand font-semibold text-ink",
              )}
            >
              Tutti
            </Link>
            <Link
              href={link(hub, sort, true)}
              aria-current={onlyFollowed ? "page" : undefined}
              className={cx(
                "-mb-px border-b-2 pb-2.5 text-sm",
                onlyFollowed
                  ? "border-brand font-semibold text-ink"
                  : "border-transparent text-ink-2 hover:text-ink",
              )}
            >
              Seguiti
            </Link>
          </nav>
        ) : null}

        <Composer game={game} defaultHub={hub ?? "build"} />

        <div className="my-4 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2" aria-label="Sezioni">
            <Link href={link(null, sort)} className={cx(CHIP, hub === null ? CHIP_ON : CHIP_OFF)}>
              Tutto
            </Link>
            {HUBS.map((item) => (
              <Link
                key={item.slug}
                href={link(item.slug, sort)}
                className={cx(CHIP, hub === item.slug ? CHIP_ON : CHIP_OFF)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <span className="flex flex-wrap gap-2">
            {FEED_SORTS.map((option) => (
              <Link
                key={option.id}
                href={link(hub, option.id)}
                className={cx(CHIP, sort === option.id ? CHIP_ON : CHIP_OFF)}
              >
                {option.label}
              </Link>
            ))}
          </span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
          <div className="grid gap-3.5">
            {posts.length === 0 ? (
              onlyFollowed ? (
                <Card>
                  <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>
                    Non segui ancora nessuno
                  </h2>
                  <p className="mt-2 text-[13px] text-ink-2">
                    Questa vista mostra solo i post di chi segui. Comincia da qui:
                  </p>
                  {suggestions.length === 0 ? (
                    <p className="mt-2 text-[13px] text-ink-3">
                      Nessun profilo da suggerire per ora.
                    </p>
                  ) : (
                    <ul className="mt-3 grid list-none gap-1.5 p-0">
                      {suggestions.map((person) => (
                        <li key={person.username}>
                          <Link
                            href={`/u/${person.username}`}
                            className="flex items-center gap-2.5 rounded-card border border-rule px-3 py-2 text-sm hover:border-brand"
                          >
                            <span className="font-semibold">{person.displayName}</span>
                            <span className="font-mono text-[11px] text-ink-3">
                              @{person.username}
                            </span>
                            <span className="ml-auto font-mono text-[11px] text-ink-3">
                              {person.followers} seguaci
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              ) : (
                <Empty>Ancora niente in questa sezione.</Empty>
              )
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <div className="grid gap-4 lg:sticky lg:top-[78px]">
            <SponsorSlot items={sponsors} />

            <Card>
              <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>
                Regole della sezione
              </h2>
              <ul className="mt-2.5 grid list-disc gap-1.5 pl-4.5 text-[13px] text-ink-2">
                <li>Porta i numeri: mediana e intervallo, non aggettivi.</li>
                <li>Allega il seed, così chiunque rifà il calcolo.</li>
                <li>Indica la patch su cui hai provato.</li>
                <li>Si smonta la build, non chi l&apos;ha costruita.</li>
              </ul>
            </Card>

            {viewer === null ? (
              <Card accent>
                <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>
                  Serve un profilo
                </h2>
                <p className="mt-2 text-[13px] text-ink-2">
                  Leggere è libero. Per pubblicare e votare no.
                </p>
                <Link href="/registrati" className={cx(buttonClass("primary", "sm"), "mt-3")}>
                  Crea il profilo
                </Link>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

async function safeSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

/** Username seguiti dal visitatore. Vuoto senza sessione o senza database. */
async function followedNames(userId: string | undefined): Promise<Set<string>> {
  if (!userId || !(await databaseReachable())) return new Set();

  try {
    const ids = await followedUserIds(userId);
    if (ids.length === 0) return new Set();

    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { inArray } = await import("drizzle-orm");

    const rows = await db.query.users.findMany({
      where: inArray(users.id, ids),
      columns: { username: true },
    });
    return new Set(rows.map((row) => row.username));
  } catch {
    return new Set();
  }
}

async function safeSuggestions() {
  try {
    return await suggestedUsers();
  } catch {
    return [];
  }
}
