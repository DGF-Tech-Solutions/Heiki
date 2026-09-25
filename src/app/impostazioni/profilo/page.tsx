import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ProfileWorkspace } from "@/components/profile-workspace";
import type { ProfileViewData } from "@/components/profile-view";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { display, eyebrow } from "@/components/ui";
import { normalizeCustomization } from "@/lib/profile/customization";
import { saveProfileAction } from "@/lib/profile/actions";
import { listGameModules } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Personalizza il profilo · GachaZone",
    impostazioni: "Impostazioni",
    titolo: "Personalizza il profilo",
    intro:
      "Cambi a sinistra, vedi il risultato a destra. Diventa pubblico solo quando salvi. La tua pagina è",
    gioco: "Gioco",
  },
  en: {
    titoloPagina: "Customize your profile · GachaZone",
    impostazioni: "Settings",
    titolo: "Customize your profile",
    intro:
      "Make changes on the left, see the result on the right. It only goes public when you save. Your page is",
    gioco: "Game",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

export default async function ProfileSettingsPage() {
  if (!(await databaseReachable())) {
    return (
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <DemoNotice />
        <SetupHint />
      </main>
    );
  }

  const session = await auth();
  if (!session?.user?.id) redirect("/entra");

  const t = TESTI[await getLocale()];

  const data = await loadOwnProfile(session.user.id, t.gioco);
  if (data === null) redirect("/entra");

  const premiumActive =
    session.user.id !== undefined && (await hasActivePremium(session.user.id));

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-8">
      <header style={{ marginBottom: 8 }}>
        <p className={eyebrow}>{t.impostazioni}</p>
        <h1 className={`${display} mt-3 text-[34px]`}>{t.titolo}</h1>
        <p className="mt-3 max-w-[62ch] text-[15px] text-ink-2">
          {t.intro}{" "}
          <Link href={`/u/${data.username}`} className="font-mono font-semibold text-brand hover:underline">
            /u/{data.username}
          </Link>
          .
        </p>
      </header>

      <ProfileWorkspace
        initial={data}
        canEdit
        startEditing
        canUsePremium={premiumActive}
        demoMode={false}
        saveAction={saveProfileAction}
      />
    </main>
  );
}

async function hasActivePremium(userId: string): Promise<boolean> {
  const row = await db.query.subscriptions.findFirst({
    where: (subscription, { eq: matches }) => matches(subscription.userId, userId),
    columns: { status: true },
  });
  return row?.status === "ACTIVE" || row?.status === "TRIALING";
}

/** `unknownGame` e' il nome da mostrare per un gioco non piu' registrato, nella lingua di chi legge. */
async function loadOwnProfile(userId: string, unknownGame: string): Promise<ProfileViewData | null> {
  try {
    const row = await db.query.users.findFirst({
      where: eq(users.id, userId),
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

    const gameNames = new Map(listGameModules().map((gameModule) => [gameModule.id, gameModule.name]));
    const showcased = new Set(row.showcase.map((slot) => slot.badgeId));
    const order = new Map(row.showcase.map((slot) => [slot.badgeId, slot.position]));
    const hasShowcase = row.showcase.length > 0;

    return {
      username: row.username,
      displayName: row.profile?.displayName ?? row.username,
      role: row.role,
      bio: row.profile?.bio ?? "",
      country: row.profile?.country ?? "",
      xp: row.profile?.xp ?? 0,
      favorites: row.profile?.favorites ?? [],
      customization: normalizeCustomization(row.profile?.cosmetics),
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
        // Senza vetrina configurata si mostrano tutti: un profilo nuovo non deve
        // apparire vuoto solo perche' l'utente non e' ancora passato di qui.
        shown: hasShowcase ? showcased.has(entry.badgeId) : true,
        })),
      gameAccounts: row.gameAccounts.map((account) => ({
        id: account.id,
        game: gameNames.get(account.gameId) ?? unknownGame,
        uid: account.uid,
        nickname: account.nickname,
        trust: account.trust,
        shown: true,
      })),
      builds: row.builds.map((build) => ({
        id: build.id,
        name: build.name,
        game: gameNames.get(build.gameId) ?? unknownGame,
        character: build.characterId,
        median: 0,
        patch: "—",
        isPublic: build.isPublic,
      })),
    };
  } catch {
    return null;
  }
}
