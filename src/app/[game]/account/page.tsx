import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameAccountEditor, type ChallengeHero } from "@/components/game-account/game-account-editor";
import { cx, display, eyebrow } from "@/components/ui";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import {
  challengePoolFor,
  EMPTY_SUMMARY,
  gameIdBySlug,
  verificationSummary,
  type VerificationSummary,
} from "@/lib/game-account/server";
import { sliderData } from "@/lib/games/account-buff";
import { findGame } from "@/lib/games/catalog";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Il mio account: chi sei nel gioco (nickname, Codice amico, server), la classe
 * di combattimento dell'account con le costellazioni, e la verifica della classe.
 *
 * Richiesta dell'utente del 27/09: «inizia a costruire la sezione degli account»,
 * con «un modo efficace per far sì che le persone possano dire quanta classe di
 * combattimento generale del profilo in modo affidabile. 7ds non ha API pubbliche
 * o account consultabili con UID: bisogna fare un sistema di check non invasivo».
 * Letto nel client: la classe dell'account di un altro giocatore si vede solo
 * dentro l'Ordine dei Cavalieri (`GuildMemberData.JoiningAccountPower`), e i titoli
 * della classe l'utente dice che non si possono mostrare. Il metodo e' suo: un
 * eroe del giorno nei preferiti e una schermata dell'Elenco eroi, controllata da
 * un moderatore (solo moderatori, scelta sua). Gli eroi posseduti vengono dopo.
 *
 * Salvato nel browser, e per chi e' entrato anche nel database (`AccountSync` nel
 * guscio delle pagine del gioco).
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Il mio account di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco}: il tuo account di gioco sul sito, con la classe di combattimento dell'account, le costellazioni e la verifica della classe.`,
    titolo: "Il mio account",
    introduzione:
      "Il tuo account del gioco, sul sito: chi sei, la classe di combattimento dell'account e le costellazioni. Le schede degli eroi le usano per le statistiche in battaglia, e la classe verificata compare sul tuo profilo.",
  },
  en: {
    titoloPagina: (gioco: string) => `My ${gioco} account · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco}: your game account on the site, with the Account Combat Class, the constellations and the class verification.`,
    titolo: "My account",
    introduzione:
      "Your game account, on the site: who you are, the Account Combat Class and the constellations. The hero pages use them for in-battle stats, and the verified class appears on your profile.",
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? "Grand Cross"),
    description: t.descrizione(entry?.name ?? "Grand Cross"),
    // una pagina personale: niente da indicizzare
    robots: { index: false, follow: true },
  };
}

export default async function GameAccountPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();
  const { accountBuff, roster } = requireGameModule(game);
  if (!accountBuff || !roster) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const databaseReady = await databaseReachable();
  const session = databaseReady ? await auth() : null;
  const userId = session?.user?.id ?? null;

  let summary: VerificationSummary = EMPTY_SUMMARY;
  if (userId) {
    const gameId = await gameIdBySlug(game);
    if (gameId) summary = await verificationSummary(userId, gameId);
  }

  // gli eroi da cui si pesca l'eroe del giorno: 30 nomi e card, niente di piu'
  const byId = new Map(roster.heroes.map((hero) => [hero.id, hero]));
  const heroes: Record<string, ChallengeHero> = {};
  for (const id of challengePoolFor(game)) {
    const hero = byId.get(id);
    if (hero) heroes[id] = { name: heroName(hero, locale), epithet: heroEpithet(hero, locale), card: heroCardSrc(game, id) };
  }

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.titolo}</h1>
        <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">{t.introduzione}</p>
      </header>

      <div className="max-w-[860px]">
        <GameAccountEditor
          gameSlug={game}
          locale={locale}
          signedIn={userId !== null}
          databaseReady={databaseReady}
          summary={summary}
          heroes={heroes}
          slider={sliderData(accountBuff, game, locale)}
          buffHref={`/${game}/buff-account`}
          loginHref="/entra"
        />
      </div>
    </main>
  );
}
