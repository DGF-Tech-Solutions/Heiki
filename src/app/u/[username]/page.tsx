import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { ProfileView } from "@/components/profile-view";
import { ProfileWorkspace } from "@/components/profile-workspace";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { saveProfileAction } from "@/lib/profile/actions";
import { hasActivePremium, loadProfile, pickableGames } from "@/lib/profile/load";
import { isFollowing } from "@/lib/social/actions";
import { FollowButton } from "@/components/social/follow-button";
import { PostCard } from "@/components/community/post-card";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { currentViewer } from "@/lib/community/actions";
import { Empty, eyebrow, SectionHead } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    haScritto: "Ha scritto",
    postRecenti: (n: number) => `${n} post recenti`,
    nessunPost: "Nessun post pubblicato.",
  },
  en: {
    haScritto: "Posts",
    postRecenti: (n: number) => `${n} recent ${n === 1 ? "post" : "posts"}`,
    nessunPost: "No published posts.",
  },
});

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username}` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  if (!(await databaseReachable())) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <DemoNotice />
        <SetupHint />
      </main>
    );
  }

  const locale = await getLocale();
  const t = TESTI[locale];

  const handle = username.toLowerCase();
  const loaded = await loadProfile({ by: "username", value: handle }, locale);
  if (loaded === null) notFound();
  const { ownerId, data } = loaded;

  // Il proprietario si riconosce dall'id e non dall'handle: la sessione rilegge
  // l'handle dal database solo ogni 60 secondi, e dopo averlo cambiato su
  // /u/<nuovo> non si sarebbe riconosciuti per un minuto (11/10).
  const session = await safeSession();
  const isOwner = session?.user?.id === ownerId;
  const following = session?.user?.id && !isOwner ? await isFollowing(ownerId) : false;

  // Cronologia: un profilo senza cio' che la persona ha scritto e' una carta
  // d'identita', non un profilo.
  const viewer = await currentViewer();
  const store = await getStore();
  const authored = sortFeed(
    await store.listPosts(null, null, viewer, { author: handle }),
    "new",
  ).slice(0, 5);

  const posts = (
    <section className="mt-12 border-t border-rule pt-8">
      <SectionHead
        title={t.haScritto}
        aside={<span className={eyebrow}>{t.postRecenti(authored.length)}</span>}
      />
      {authored.length === 0 ? (
        <Empty>{t.nessunPost}</Empty>
      ) : (
        <div className="grid gap-3.5">
          {authored.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );

  // Chi non e' il proprietario riceve la pagina statica: nessun codice
  // dell'editor nel suo bundle, nessun roster da scegliere, e nessun tasto che
  // non potrebbe usare.
  if (!isOwner) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-6 pt-6 pb-16">
        <ProfileView
          data={data}
          locale={locale}
          priority
          actions={
            session?.user?.id ? (
              <FollowButton
                username={data.username}
                initialFollowing={following}
                initialFollowers={data.stats?.followers ?? 0}
              />
            ) : null
          }
        />
        {posts}
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-2 pb-16">
      <ProfileWorkspace
        initial={data}
        canEdit
        canUsePremium={await hasActivePremium(ownerId)}
        demoMode={false}
        heroes={pickableGames()}
        saveAction={saveProfileAction}
      />
      {posts}
    </main>
  );
}

async function safeSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}
