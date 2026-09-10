import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { ProfileView, type ProfileViewData } from "@/components/profile-view";
import { ProfileWorkspace } from "@/components/profile-workspace";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { saveProfileAction } from "@/lib/profile/actions";
import { followCounts, isFollowing } from "@/lib/social/actions";
import { FollowButton } from "@/components/social/follow-button";
import { PostCard } from "@/components/community/post-card";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";
import { currentViewer } from "@/lib/community/actions";
import { cx, Empty, eyebrow, SectionHead, Stat, StatGrid } from "@/components/ui";
import { listGameModules } from "@/lib/games/registry";
import { normalizeCustomization } from "@/lib/profile/customization";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `${username} · GachaZone` };
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

  const handle = username.toLowerCase();
  const data = await loadProfile(handle);
  if (data === null) notFound();

  const session = await safeSession();
  const isOwner = session?.user?.username?.toLowerCase() === handle;

  const owner = await ownerRow(handle);
  const counts = owner ? await followCounts(owner.id) : { followers: 0, following: 0 };
  const following = owner && !isOwner ? await isFollowing(owner.id) : false;

  // Cronologia: un profilo senza cio' che la persona ha scritto e' una carta
  // d'identita', non un profilo.
  const viewer = await currentViewer();
  const store = await getStore();
  const authored = sortFeed(
    (await store.listPosts(null, null, viewer)).filter(
      (post) => post.author.username.toLowerCase() === handle,
    ),
    "new",
  ).slice(0, 5);

  const social = (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <StatGrid columns="repeat(2, minmax(0, 140px))" className="flex-none">
          <Stat label="Seguaci" value={counts.followers} />
          <Stat label="Segue" value={counts.following} />
        </StatGrid>

        {owner && !isOwner && session?.user?.id ? (
          <FollowButton
            username={data.username}
            initialFollowing={following}
            initialFollowers={counts.followers}
          />
        ) : null}
      </div>

      <section className="mt-10 border-t border-rule pt-8">
        <SectionHead
          title="Ha scritto"
          aside={<span className={eyebrow}>{authored.length} post recenti</span>}
        />
        {authored.length === 0 ? (
          <Empty>Nessun post pubblicato.</Empty>
        ) : (
          <div className="grid gap-3.5">
            {authored.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );

  // Chi non e' il proprietario riceve la pagina statica: nessun codice
  // dell'editor nel suo bundle, e nessun tasto che non potrebbe usare.
  if (!isOwner || !session?.user?.id) {
    return (
      <main className={cx("mx-auto w-full max-w-[1200px] px-6 py-10")}>
        <ProfileView data={data} />
        {social}
      </main>
    );
  }

  const premiumActive = await hasActivePremium(session.user.id);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-2">
      <ProfileWorkspace
        initial={data}
        canEdit
        canUsePremium={premiumActive}
        demoMode={false}
        saveAction={saveProfileAction}
      />
      {social}
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

/** Serve l'id per contare seguaci e sapere se lo si segue. */
async function ownerRow(handle: string): Promise<{ id: string } | null> {
  try {
    const row = await db.query.users.findFirst({
      where: eq(users.username, handle),
      columns: { id: true },
    });
    return row ?? null;
  } catch {
    return null;
  }
}

async function hasActivePremium(userId: string): Promise<boolean> {
  try {
    const row = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
      columns: { status: true },
    });
    return row?.status === "ACTIVE" || row?.status === "TRIALING";
  } catch {
    return false;
  }
}

/**
 * Un database non ancora migrato non deve produrre una schermata di errore
 * grezza: si tratta come profilo inesistente, e la pagina 404 lo dice in chiaro.
 */
async function loadProfile(username: string): Promise<ProfileViewData | null> {
  try {
    const row = await db.query.users.findFirst({
      where: eq(users.username, username),
      columns: { id: true, username: true, role: true },
      with: {
        profile: true,
        badges: { with: { badge: true } },
        showcase: true,
        gameAccounts: true,
        builds: true,
      },
    });

    if (!row) return null;

    // I nomi dei giochi vengono dai moduli registrati, non dal database: e' il
    // modulo la fonte di verita' su come si chiama un gioco.
    const gameNames = new Map(listGameModules().map((module) => [module.id, module.name]));

    // La vetrina decide cosa si vede e in che ordine. Se non e' mai stata
    // configurata si mostrano tutti i badge, cosi' un profilo nuovo non appare
    // vuoto solo perche' l'utente non e' passato dalle impostazioni.
    const order = new Map(row.showcase.map((slot) => [slot.badgeId, slot.position]));
    const hasShowcase = row.showcase.length > 0;

    return {
      username: row.username,
      displayName: row.profile?.displayName ?? row.username,
      role: row.role,
      bio: row.profile?.bio ?? null,
      country: row.profile?.country ?? null,
      xp: row.profile?.xp ?? 0,
      favorites: row.profile?.favorites ?? [],
      customization: normalizeCustomization(row.profile?.cosmetics),
      // Si ordina PRIMA di mappare: dopo la mappatura resta solo l'id della riga
      // di assegnazione, mentre la vetrina e' indicizzata per id del badge.
      badges: [...row.badges]
        .sort(
          (a, b) =>
            (order.get(a.badgeId) ?? Number.MAX_SAFE_INTEGER) -
            (order.get(b.badgeId) ?? Number.MAX_SAFE_INTEGER),
        )
        .map((entry) => ({
          id: entry.id,
          name: entry.badge.name,
          description: entry.badge.description,
          trust: entry.trust,
          icon: null,
          shown: hasShowcase ? order.has(entry.badgeId) : true,
        })),
      gameAccounts: row.gameAccounts.map((account) => ({
        id: account.id,
        game: gameNames.get(account.gameId) ?? "Gioco",
        uid: account.uid,
        nickname: account.nickname,
        trust: account.trust,
      })),
      builds: row.builds
        .filter((build) => build.isPublic)
        .map((build) => ({
          id: build.id,
          name: build.name,
          game: gameNames.get(build.gameId) ?? "Gioco",
          character: build.characterId,
          median: readMedian(build.payload),
          patch: "—",
        })),
    };
  } catch {
    return null;
  }
}

function readMedian(payload: unknown): number {
  if (payload && typeof payload === "object" && "median" in payload) {
    const value = (payload as { median: unknown }).median;
    if (typeof value === "number") return value;
  }
  return 0;
}
