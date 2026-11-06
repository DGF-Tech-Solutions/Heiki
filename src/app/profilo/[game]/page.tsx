import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GameAccountEditor, type ChallengeHero } from "@/components/game-account/game-account-editor";
import { IconChevronRight } from "@/components/icons";
import { cx, display } from "@/components/ui";
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
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { profileGame } from "@/lib/profile/games";
import { rem } from "@/lib/rem";

/**
 * L'account di gioco: chi sei nel gioco (nickname, Codice amico, server), la
 * classe di combattimento dell'account con le costellazioni, e la verifica della
 * classe.
 *
 * Richiesta dell'utente del 27/09: «inizia a costruire la sezione degli account»,
 * con «un modo efficace per far sì che le persone possano dire quanta classe di
 * combattimento generale del profilo in modo affidabile. 7ds non ha API pubbliche
 * o account consultabili con UID: bisogna fare un sistema di check non invasivo».
 * Letto nel client: la classe dell'account di un altro giocatore si vede solo
 * dentro l'Ordine dei Cavalieri (`GuildMemberData.JoiningAccountPower`), e i titoli
 * della classe l'utente dice che non si possono mostrare. Il metodo e' suo: un
 * eroe del giorno nei preferiti e una schermata dell'Elenco eroi, controllata da
 * un moderatore (solo moderatori, scelta sua).
 *
 * Dal 25/10 sta nel profilo del sito (/profilo/<gioco>) e non piu' nel gioco
 * (/<gioco>/account, che ora reindirizza qui): il profilo e' uno per tutti i
 * giochi, e ogni gioco vi ha le sue pagine.
 *
 * Salvato nel browser, e per chi e' entrato anche nel database (`AccountSync` nel
 * guscio del profilo e in quello delle pagine del gioco).
 *
 * In cima, prima dei campi, la porta per «I tuoi eroi» (il box): chiesta
 * dall'utente il 10/10, perche' dall'account non ci si arrivava se non dal menu.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Il tuo account di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: il tuo account di gioco sul sito, con la classe di combattimento dell'account, le costellazioni e la verifica della classe.`,
    titolo: "Account di gioco",
    introduzione:
      "Chi sei nel gioco, la classe di combattimento dell'account e le costellazioni. Le schede degli eroi le usano per le statistiche in battaglia, e la classe verificata compare sul tuo profilo pubblico.",
    box: "I tuoi eroi",
    boxRiga: "Il tuo box: chi hai nel gioco e a che punto è. Le schede degli eroi partono dai tuoi numeri.",
    apriBox: "Apri il box",
  },
  en: {
    titoloPagina: (gioco: string) => `Your ${gioco} account`,
    descrizione: (gioco: string) =>
      `${gioco}: your game account on the site, with the Account Combat Class, the constellations and the class verification.`,
    titolo: "Game account",
    introduzione:
      "Who you are in the game, the Account Combat Class and the constellations. The hero pages use them for in-battle stats, and the verified class appears on your public profile.",
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
  const entry = profileGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? game),
    description: t.descrizione(entry?.name ?? game),
    robots: { index: false, follow: true },
  };
}

export default async function ProfileGameAccountPage({ params }: Props) {
  const { game } = await params;
  const entry = profileGame(game);
  if (!entry) notFound();
  // un gioco col box ma senza la classe dell'account: la sua pagina e' il box
  if (!entry.account) redirect(`/profilo/${game}/eroi`);
  const gameModule = getGameModule(game);
  const accountBuff = gameModule?.accountBuff;
  const roster = gameModule?.roster;
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
    <div className="max-w-[860px]">
      <header className="mb-5">
        <h2 className={cx(display, "text-[clamp(26px,3.4vw,38px)]")}>{t.titolo}</h2>
        <p className="m-0 mt-2 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">{t.introduzione}</p>
      </header>

      {entry.heroes ? (
        /*
          La porta del box: tutta la fascia e' il collegamento, con la lama e le
          card come il palco della griglia Eroi. Sta sopra i campi perche' e'
          quello che si apre piu' spesso; i campi si scrivono una volta.
        */
        <Link
          href={`/profilo/${game}/eroi`}
          className="group relative mb-5 flex min-h-[132px] items-center gap-4 overflow-hidden bg-piastra-fondo p-4 text-ink no-underline transition-colors hover:bg-piastra focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-5"
        >
          <span className="min-w-0 flex-1">
            <span className={cx(display, "block text-[clamp(20px,2.4vw,26px)]")}>{t.box}</span>
            <span className="mt-1.5 block max-w-[46ch] text-[13px] leading-snug text-ink-2">{t.boxRiga}</span>
            <span className="p5-cut mt-3 inline-flex h-9 items-center gap-1.5 bg-plate px-4 font-display text-[13px] font-extrabold tracking-[0.03em] text-on-plate uppercase [font-variation-settings:'wdth'_85] transition-colors group-hover:bg-brand group-hover:text-on-brand">
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
                style={{ width: rem(76) }}
                height={76}
                className={cx("block h-[76px] w-[76px] bg-paper-2 transition-transform group-hover:-translate-y-0.5", i > 0 && "-ml-5")}
              />
            ))}
          </span>
        </Link>
      ) : null}

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
  );
}
