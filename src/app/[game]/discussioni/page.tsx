import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { PostCard } from "@/components/community/post-card";
import { Composer } from "@/components/community/composer";
import { SponsorSlot } from "@/components/community/sponsor-slot";
import { buttonClass, Card, chipColors, cx, display, Empty, Notice, PageHeader } from "@/components/ui";
import { currentViewer } from "@/lib/community/actions";
import {
  FEED_SORTS,
  feedSortLabel,
  isFeedSort,
  sortFeed,
  type FeedSort,
} from "@/lib/community/ranking";
import { getStore } from "@/lib/community/store";
import { HUBS, hubLabel } from "@/lib/community/types";
import { findGame } from "@/lib/games/catalog";
import { auth } from "@/lib/auth";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { followedUserIds, suggestedUsers } from "@/lib/social/actions";
import { databaseReachable } from "@/lib/db";

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `${gioco} — community`,
    descrizione: (gioco: string) =>
      `Discussioni, build e domande dei giocatori di ${gioco}.`,
    questoGioco: "questo gioco",
    titolo: "Discussioni",
    sottotitolo: "Build, squadre e domande dei giocatori: con i numeri e la patch su cui sono state provate.",
    demoTitolo: "Modalità dimostrativa.",
    demoTesto:
      "Puoi pubblicare, commentare e votare, ma i contenuti stanno nella memoria del server e spariscono al riavvio.",
    vista: "Vista",
    tutti: "Tutti",
    seguiti: "Seguiti",
    sezioni: "Sezioni",
    tutto: "Tutto",
    nonSegui: "Non segui ancora nessuno",
    soloSeguiti: "Questa vista mostra solo i post di chi segui. Comincia da qui:",
    nessunSuggerimento: "Nessun profilo da suggerire per ora.",
    seguaci: (n: number) => `${n} seguaci`,
    sezioneVuota: "Ancora niente in questa sezione.",
    regole: "Regole della sezione",
    regolaNumeri: "Porta i numeri: mediana e intervallo, non aggettivi.",
    regolaPatch: "Indica la patch su cui hai provato.",
    regolaRispetto: "Si smonta la build, non chi l'ha costruita.",
    serveProfilo: "Serve un profilo",
    leggereLibero: "Leggere è libero. Per pubblicare e votare no.",
    creaProfilo: "Crea il profilo",
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} — community`,
    descrizione: (gioco: string) =>
      `Discussions, builds and questions from ${gioco} players.`,
    questoGioco: "this game",
    titolo: "Discussions",
    sottotitolo: "Players' builds, teams and questions: with numbers and the patch they were tested on.",
    demoTitolo: "Demo mode.",
    demoTesto:
      "You can post, comment and vote, but content lives in the server's memory and disappears on restart.",
    vista: "View",
    tutti: "All",
    seguiti: "Following",
    sezioni: "Sections",
    tutto: "All",
    nonSegui: "You're not following anyone yet",
    soloSeguiti: "This view only shows posts from people you follow. Start here:",
    nessunSuggerimento: "No profiles to suggest for now.",
    seguaci: (n: number) => `${n} ${n === 1 ? "follower" : "followers"}`,
    sezioneVuota: "Nothing in this section yet.",
    regole: "Section rules",
    regolaNumeri: "Bring numbers: median and range, not adjectives.",
    regolaPatch: "State the patch you tested on.",
    regolaRispetto: "Take apart the build, not the person who made it.",
    serveProfilo: "You need a profile",
    leggereLibero: "Reading is free. Posting and voting aren't.",
    creaProfilo: "Create your profile",
  },
});

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ hub?: string; sort?: string; vista?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? "Community"),
    description: t.descrizione(entry?.name ?? t.questoGioco),
  };
}

// Filtri come lame tagliate: rossa quella scelta, scure le altre (bianche al passaggio)
const CHIP =
  "p5-cut-sm p5-btn inline-flex h-8 items-center px-3.5 font-display text-[13px] font-extrabold uppercase " +
  "tracking-[0.03em] [font-variation-settings:'wdth'_85]";

const CHIP_ON = chipColors(true);
const CHIP_OFF = chipColors(false);

export default async function GameFeedPage({ params, searchParams }: Props) {
  const { game } = await params;
  const query = await searchParams;
  const locale = await getLocale();
  const t = TESTI[locale];

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
    // dal 10/10 il feed sta qui, e /<gioco> e' la pagina d'ingresso del gioco
    return suffix ? `/${game}/discussioni?${suffix}` : `/${game}/discussioni`;
  };

  return (
    <>
      <main className="pt-6 pb-20">
        {/* il titolo che mancava (10/10): la pagina cominciava dal riquadro per
            scrivere, e dalle briciole e dalla barra non si capiva dove si fosse */}
        <Breadcrumb items={[{ label: findGame(game)?.shortName ?? game, href: `/${game}` }, { label: t.titolo }]} />
        <PageHeader title={t.titolo}>
          <p>{t.sottotitolo}</p>
        </PageHeader>

        {store.volatile ? (
          <Notice className="mb-4">
            <span>
              <strong>{t.demoTitolo}</strong> {t.demoTesto}
            </span>
          </Notice>
        ) : null}

        {session?.user ? (
          <nav className="mb-5 flex gap-3 border-b-[3px] border-ink pb-2" aria-label={t.vista}>
            <Link
              href={link(hub, sort, false)}
              aria-current={!onlyFollowed ? "page" : undefined}
              className={cx(
                "p5-menu-item px-4 py-1.5 font-display text-base font-black uppercase tracking-[0.02em] [font-variation-settings:'wdth'_80]",
                onlyFollowed ? "text-ink-2 hover:text-paper" : "text-white",
              )}
            >
              {t.tutti}
            </Link>
            <Link
              href={link(hub, sort, true)}
              aria-current={onlyFollowed ? "page" : undefined}
              className={cx(
                "p5-menu-item px-4 py-1.5 font-display text-base font-black uppercase tracking-[0.02em] [font-variation-settings:'wdth'_80]",
                onlyFollowed ? "text-white" : "text-ink-2 hover:text-paper",
              )}
            >
              {t.seguiti}
            </Link>
          </nav>
        ) : null}

        <Composer game={game} defaultHub={hub ?? "build"} />

        <div className="my-4 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2" aria-label={t.sezioni}>
            <Link href={link(null, sort)} className={cx(CHIP, hub === null ? CHIP_ON : CHIP_OFF)}>
              {t.tutto}
            </Link>
            {HUBS.map((item) => (
              <Link
                key={item.slug}
                href={link(item.slug, sort)}
                className={cx(CHIP, hub === item.slug ? CHIP_ON : CHIP_OFF)}
              >
                {hubLabel(item.slug, locale, item.name)}
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
                {feedSortLabel(option.id, locale)}
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
                    {t.nonSegui}
                  </h2>
                  <p className="mt-2 text-[13px] text-ink-2">{t.soloSeguiti}</p>
                  {suggestions.length === 0 ? (
                    <p className="mt-2 text-[13px] text-ink-3">{t.nessunSuggerimento}</p>
                  ) : (
                    <ul className="mt-3 grid list-none gap-1.5 p-0">
                      {suggestions.map((person) => (
                        <li key={person.username}>
                          <Link
                            href={`/u/${person.username}`}
                            className="p5-corner flex items-center gap-2.5 border border-rule bg-paper px-3 py-2 text-sm transition-colors hover:border-brand hover:bg-brand-soft"
                          >
                            <span className="font-semibold">{person.displayName}</span>
                            <span className="font-mono text-[11px] text-ink-3">
                              @{person.username}
                            </span>
                            <span className="ml-auto font-mono text-[11px] text-ink-3">
                              {t.seguaci(person.followers)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              ) : (
                <Empty>{t.sezioneVuota}</Empty>
              )
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <div className="grid gap-4 lg:sticky lg:top-[78px]">
            <SponsorSlot items={sponsors} />

            <Card>
              <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>
                {t.regole}
              </h2>
              <ul className="mt-2.5 grid list-disc gap-1.5 pl-4.5 text-[13px] text-ink-2">
                <li>{t.regolaNumeri}</li>
                <li>{t.regolaPatch}</li>
                <li>{t.regolaRispetto}</li>
              </ul>
            </Card>

            {viewer === null ? (
              <Card accent>
                <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>
                  {t.serveProfilo}
                </h2>
                <p className="mt-2 text-[13px] text-ink-2">{t.leggereLibero}</p>
                <Link href="/registrati" className={cx(buttonClass("primary", "sm"), "mt-3")}>
                  {t.creaProfilo}
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
