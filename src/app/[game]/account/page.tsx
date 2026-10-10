import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameAccountEditor, type ChallengeHero } from "@/components/game-account/game-account-editor";
import { IconChevronRight } from "@/components/icons";
import { cx, display, PageHeader } from "@/components/ui";
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
 *
 * In cima, prima dei campi, la porta per «I tuoi eroi» (il box): chiesta
 * dall'utente il 10/10, perche' dall'account non ci si arrivava se non dal menu.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Il mio account di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: il tuo account di gioco sul sito, con la classe di combattimento dell'account, le costellazioni e la verifica della classe.`,
    titolo: "Il mio account",
    introduzione:
      "Il tuo account del gioco, sul sito: chi sei, la classe di combattimento dell'account e le costellazioni. Le schede degli eroi le usano per le statistiche in battaglia, e la classe verificata compare sul tuo profilo.",
    box: "I tuoi eroi",
    boxRiga: "Il tuo box: chi hai nel gioco e a che punto è. Le schede degli eroi partono dai tuoi numeri.",
    apriBox: "Apri il box",
  },
  en: {
    titoloPagina: (gioco: string) => `My ${gioco} account`,
    descrizione: (gioco: string) =>
      `${gioco}: your game account on the site, with the Account Combat Class, the constellations and the class verification.`,
    titolo: "My account",
    introduzione:
      "Your game account, on the site: who you are, the Account Combat Class and the constellations. The hero pages use them for in-battle stats, and the verified class appears on your profile.",
    box: "Your heroes",
    boxRiga: "Your box: who you have in the game and how far along. The hero pages start from your numbers.",
    apriBox: "Open the box",
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

  // le card della porta del box: gli ultimi eroi usciti, come la prima fila della griglia Eroi
  const boxCards = roster.heroes.slice(0, 4);

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <PageHeader title={t.titolo}>
        <p>{t.introduzione}</p>
      </PageHeader>

      <div className="max-w-[860px]">
        {/*
          La porta del box: tutta la fascia e' il collegamento, con la lama rossa e
          le card come il palco della griglia Eroi. Sta sopra i campi perche' e'
          quello che si apre piu' spesso; i campi si scrivono una volta.
        */}
        <Link
          href={`/${game}/account/eroi`}
          className="group relative isolate mb-5 flex min-h-[132px] items-center gap-4 overflow-hidden border border-rule bg-paper-2 p-4 text-ink no-underline transition-colors hover:border-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-5"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_srgb,var(--color-brand)_34%,transparent)_1.1px,transparent_1.8px)] bg-[length:8px_8px] [mask-image:linear-gradient(110deg,transparent_30%,#000_100%)]"
          />
          <span aria-hidden className="absolute inset-0 -z-10 bg-brand [clip-path:polygon(72%_0,100%_0,100%_100%,60%_100%)] sm:[clip-path:polygon(66%_0,100%_0,100%_100%,54%_100%)]" />
          <span className="min-w-0 flex-1">
            <span className={cx(display, "block text-[clamp(24px,3.4vw,34px)]")}>{t.box}</span>
            <span className="mt-1.5 block max-w-[46ch] text-[13px] leading-snug text-ink-2">{t.boxRiga}</span>
            <span className="p5-cut mt-3 inline-flex h-9 items-center gap-1.5 bg-ink px-4 font-display text-[13px] font-extrabold tracking-[0.03em] text-paper uppercase [font-variation-settings:'wdth'_85] transition-colors group-hover:bg-brand group-hover:text-white">
              {t.apriBox}
              <IconChevronRight size={14} />
            </span>
          </span>
          {/* le card in fila, sovrapposte: solo da 640px, sul telefono la fascia resta testo e comando */}
          <span aria-hidden className="hidden shrink-0 sm:flex">
            {boxCards.map((hero, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita'
              <img
                key={hero.id}
                src={heroCardSrc(game, hero.id)}
                srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
                alt=""
                width={76}
                height={76}
                className={cx("block h-[76px] w-[76px] bg-paper-2 shadow-[4px_4px_0_var(--color-paper)] transition-transform group-hover:-translate-y-0.5", i > 0 && "-ml-5")}
              />
            ))}
          </span>
        </Link>

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
