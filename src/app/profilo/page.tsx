import type { Metadata } from "next";
import Link from "next/link";
import { ProfileGameCard, type ProfileGameCardData } from "@/components/profile-games";
import { buttonClass, cx, display, Tag } from "@/components/ui";
import { auth } from "@/lib/auth";
import { roleLabel } from "@/lib/auth/permissions";
import { databaseReachable } from "@/lib/db";
import { gameIdBySlug, verificationSummary } from "@/lib/game-account/server";
import { heroCardSrc } from "@/lib/games/heroes";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { profileGames, upcomingGames } from "@/lib/profile/games";
import { loadProfile } from "@/lib/profile/load";
import { rem } from "@/lib/rem";

const TESTI = testi({
  it: {
    titoloPagina: "Il tuo profilo",
    descrizione: "Il tuo profilo su Heiki: i tuoi giochi, l'account di ogni gioco e il box degli eroi.",
    paginaPubblica: "La tua pagina pubblica",
    personalizza: "Personalizza",
    impostazioni: "Impostazioni dell'account",
    ospiteTitolo: "Non sei entrato",
    ospite:
      "I dati dei tuoi giochi restano in questo browser e funzionano già: account, classe e box. Entrando li ritrovi su ogni dispositivo.",
    vantaggi: [
      "Account di gioco e box salvati su ogni dispositivo",
      "Una pagina pubblica tua, con gli eroi preferiti",
      "La classe dell'account verificata da un moderatore",
      "Tier list e strategie salvate e condivisibili",
    ],
    entra: "Entra",
    iscriviti: "Iscriviti",
    giochi: "I tuoi giochi",
    inArrivo: (nomi: string) => `In arrivo: ${nomi}.`,
  },
  en: {
    titoloPagina: "Your profile",
    descrizione: "Your Heiki profile: your games, the account for each game and your hero box.",
    paginaPubblica: "Your public page",
    personalizza: "Customize",
    impostazioni: "Account settings",
    ospiteTitolo: "You're not logged in",
    ospite:
      "Your game data stays in this browser and already works: account, class and box. Log in to find it on every device.",
    vantaggi: [
      "Game account and box saved on every device",
      "A public page of your own, with your favorite heroes",
      "Your Account Combat Class verified by a moderator",
      "Tier lists and strategies saved and shareable",
    ],
    entra: "Log in",
    iscriviti: "Sign up",
    giochi: "Your games",
    inArrivo: (names: string) => `Coming soon: ${names}.`,
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina, description: t.descrizione, robots: { index: false, follow: true } };
}

/**
 * La panoramica del profilo del sito (25/10): chi sei su Heiki e i tuoi giochi.
 *
 * Il profilo e' uno per tutti i giochi (richiesta dell'utente). In alto
 * l'identita' del sito, sotto una card per gioco: la forma che hanno i profili
 * multi-gioco studiati (Enka, HoYoLAB), dove l'identita' resta la stessa e ogni
 * gioco aggiunge la sua card.
 *
 * Funziona anche per chi non e' entrato: account, classe e box si salvano nel
 * browser, e la pagina lo dice, con cosa si aggiunge entrando (come la card
 * laterale di HoYoLAB e la pagina d'iscrizione di Enka). Nessuna finestra che
 * si apre da sola.
 */
export default async function ProfileOverviewPage() {
  const locale = await getLocale();
  const t = TESTI[locale];
  const games = profileGames();

  const databaseReady = await databaseReachable();
  const session = databaseReady ? await auth().catch(() => null) : null;
  const userId = session?.user?.id ?? null;
  const loaded = userId ? await loadProfile({ by: "id", value: userId }, locale) : null;
  const data = loaded?.data ?? null;

  const cards: ProfileGameCardData[] = await Promise.all(
    games.map(async (game) => {
      let verified: ProfileGameCardData["verified"] = null;
      if (userId && game.account) {
        const gameId = await gameIdBySlug(game.slug);
        const summary = gameId ? await verificationSummary(userId, gameId) : null;
        if (summary?.verifiedPower && summary.verifiedAt) verified = { power: summary.verifiedPower, at: summary.verifiedAt };
      }
      return { slug: game.slug, name: game.name, account: game.account, heroes: game.heroes, total: game.total, verified };
    }),
  );
  const upcoming = upcomingGames().map((game) => game.name);
  const cover = data?.favoriteHeroes[0];

  return (
    <>
      {data ? (
        <section aria-label={data.displayName} className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita'
            <img
              src={heroCardSrc(cover.game, cover.id)}
              srcSet={`${heroCardSrc(cover.game, cover.id)} 1x, ${heroCardSrc(cover.game, cover.id, 2)} 2x`}
              alt=""
              width={88}
              height={88}
              style={{ width: rem(88) }}
              className="block aspect-square shrink-0 bg-paper-2"
            />
          ) : (
            <span
              aria-hidden
              className="grid size-[88px] shrink-0 place-items-center bg-plate font-display text-[40px] font-black text-on-plate uppercase"
            >
              {data.displayName.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0 flex-1 basis-64">
            <h2 className={cx(display, "m-0 text-[clamp(26px,3.4vw,38px)] wrap-break-word")}>{data.displayName}</h2>
            <p className="m-0 mt-1.5 flex flex-wrap items-center gap-2.5 text-[14px] text-ink-3">
              <span className="font-mono">@{data.username}</span>
              <Tag>{roleLabel(data.role, locale)}</Tag>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/u/${data.username}`} className={buttonClass("outline", "sm")}>
              {t.paginaPubblica}
            </Link>
            <Link href="/impostazioni/profilo" className={buttonClass("ghost", "sm")}>
              {t.personalizza}
            </Link>
            <Link href="/impostazioni/account" className={buttonClass("ghost", "sm")}>
              {t.impostazioni}
            </Link>
          </div>
        </section>
      ) : (
        <section aria-labelledby="profilo-ospite" className="p5-corner mb-10 border border-rule bg-paper-2 p-5 sm:p-6">
          <h2 id="profilo-ospite" className={cx(display, "m-0 text-[clamp(22px,2.6vw,30px)]")}>
            {t.ospiteTitolo}
          </h2>
          <p className="m-0 mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">{t.ospite}</p>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0 text-[14px] text-ink sm:grid-cols-2">
            {t.vantaggi.map((vantaggio) => (
              <li key={vantaggio} className="flex items-start gap-2.5">
                <span aria-hidden className="p5-cut-sm mt-1.5 h-2 w-3.5 shrink-0 bg-mark" />
                {vantaggio}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/entra" className={buttonClass("primary", "md")}>
              {t.entra}
            </Link>
            <Link href="/registrati" className={buttonClass("outline", "md")}>
              {t.iscriviti}
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="profilo-giochi">
        <h2 id="profilo-giochi" className={cx(display, "m-0 mb-4 text-[clamp(22px,2.6vw,30px)]")}>
          {t.giochi}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((game) => (
            <ProfileGameCard key={game.slug} game={game} />
          ))}
        </div>
        {upcoming.length > 0 ? (
          <p className="m-0 mt-4 text-[13px] text-ink-3">
            {t.inArrivo(new Intl.ListFormat(intlLocale(locale), { type: "conjunction" }).format(upcoming))}
          </p>
        ) : null}
      </section>
    </>
  );
}
