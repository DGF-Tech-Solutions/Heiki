import type { Metadata } from "next";
import { AccountSync } from "@/components/game-account/account-sync";
import { SectionTabs } from "@/components/section-tabs";
import { cx, display } from "@/components/ui";
import { auth } from "@/lib/auth";
import { accountCopy } from "@/lib/game-account/server";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { profileGames } from "@/lib/profile/games";

const TESTI = testi({
  it: { titolo: "Il tuo profilo", schede: "Sezioni del profilo", panoramica: "Panoramica" },
  en: { titolo: "Your profile", schede: "Profile sections", panoramica: "Overview" },
});

export const metadata: Metadata = {
  // pagine personali: niente da indicizzare
  robots: { index: false, follow: true },
};

/**
 * Il guscio del profilo del sito (25/10): /profilo e, per ogni gioco, le sue
 * pagine (/profilo/<gioco> l'account di gioco, /profilo/<gioco>/eroi il box).
 *
 * Il profilo e' del sito e non di un gioco (richiesta dell'utente: «la scheda
 * profilo dev'essere universale»): prima l'account e il box stavano nel menu di
 * Grand Cross, sotto «Il tuo account». Le schede in alto sono la panoramica e un
 * gioco per scheda; dentro un gioco, le sue pagine (layout del gioco).
 *
 * Come nelle pagine del gioco, chi e' entrato ha l'account sincronizzato col
 * database: la copia del database arriva qui e AccountSync la confronta con
 * quella del browser, gioco per gioco. Chi non e' entrato usa le stesse pagine
 * coi dati salvati nel browser: per questo /profilo non e' una pagina protetta.
 */
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const t = TESTI[await getLocale()];
  const games = profileGames();

  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;
  const copies = userId
    ? await Promise.all(
        games.filter((game) => game.account).map(async (game) => [game.slug, await accountCopy(userId, game.slug)] as const),
      )
    : [];

  return (
    <>
      {userId
        ? copies.map(([slug, server]) => <AccountSync key={slug} gameSlug={slug} userId={userId} server={server} />)
        : null}
      <main className="mx-auto w-full max-w-shell px-6 pt-8 pb-24">
        <h1 className={cx(display, "text-[clamp(34px,5vw,58px)]")}>{t.titolo}</h1>
        <SectionTabs
          label={t.schede}
          tabs={[
            { href: "/profilo", label: t.panoramica },
            ...games.map((game) => ({ href: `/profilo/${game.slug}`, label: game.shortName, nested: true })),
          ]}
          className="mt-4 mb-8 flex flex-wrap gap-1.5 border-b-2 border-mark pb-4"
        />
        {children}
      </main>
    </>
  );
}
