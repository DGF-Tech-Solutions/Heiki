"use client";

/**
 * Le card dei giochi nella panoramica del profilo (/profilo, 25/10): per ogni
 * gioco chi sei nel gioco, la classe dell'account e quanti eroi hai nel box, con
 * le due pagine del gioco nel profilo.
 *
 * Client perche' i dati di gioco stanno nel browser (account, classe e box si
 * salvano li', e per chi e' entrato AccountSync li tiene uguali al database):
 * la stessa card serve a chi e' entrato e a chi no. La classe VERIFICATA invece
 * la sa solo il database: arriva dalla pagina.
 *
 * Dalla ricerca sui profili multi-gioco (Enka, HoYoLAB): il gioco si scrive col
 * suo nome e non si affida all'arte; nickname, server e Codice amico stanno
 * insieme; la verifica si dice accanto al numero, a parole e non solo col colore.
 */

import Link from "next/link";
import { useAccountSetup } from "@/components/account-buff/use-account-setup";
import { useGameProfile } from "@/components/game-account/local-account";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { IconCheck } from "@/components/icons";
import { buttonClass, cx, display, eyebrow, numeric } from "@/components/ui";
import { SERVER_NAMES } from "@/lib/games/game-account";
import { boxSize } from "@/lib/games/hero-box";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    senzaNickname: "Nickname non ancora scritto",
    codiceAmico: "Codice amico",
    classe: "Classe dell'account",
    verificata: (quando: string) => `verificata il ${quando}`,
    dichiarata: "dichiarata, non verificata",
    nessunaClasse: "non ancora scritta",
    box: "Eroi nel box",
    boxNumero: (n: string, totale: string) => `${n} su ${totale}`,
    account: "Account di gioco",
    eroi: "I tuoi eroi",
  },
  en: {
    senzaNickname: "No nickname yet",
    codiceAmico: "Friend Code",
    classe: "Account Combat Class",
    verificata: (when: string) => `verified on ${when}`,
    dichiarata: "declared, not verified",
    nessunaClasse: "not set yet",
    box: "Heroes in your box",
    boxNumero: (n: string, total: string) => `${n} of ${total}`,
    account: "Game account",
    eroi: "Your heroes",
  },
});

export interface ProfileGameCardData {
  readonly slug: string;
  readonly name: string;
  readonly account: boolean;
  readonly heroes: boolean;
  readonly total: number;
  /** l'ultima classe confermata da un moderatore, solo per chi e' entrato */
  readonly verified: { readonly power: number; readonly at: string } | null;
}

export function ProfileGameCard({ game }: { game: ProfileGameCardData }) {
  const locale = useLocale();
  const t = TESTI[locale];
  const number = intlLocale(locale);
  const [profile] = useGameProfile(game.slug);
  const [setup] = useAccountSetup(game.slug);
  const [box] = useHeroBox(game.slug);

  const owned = boxSize(box);
  // la classe dichiarata e' quella del browser; se coincide con la verificata, vale la verifica
  const power = setup.power > 0 ? setup.power : (game.verified?.power ?? 0);
  const verifiedNow = game.verified !== null && game.verified.power === power;
  const day = game.verified
    ? new Date(game.verified.at).toLocaleDateString(number, { timeZone: "UTC" })
    : null;

  return (
    <article className="p5-corner flex min-w-0 flex-col border border-rule bg-paper-2 p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className={cx(display, "m-0 text-[clamp(22px,2.4vw,28px)]")}>{game.name}</h3>
        {/* il server vale solo se l'account c'e': quello di partenza («Globale») non l'ha scelto nessuno */}
        {profile.nickname || profile.friendCode ? <span className={eyebrow}>{SERVER_NAMES[profile.server][locale]}</span> : null}
      </header>

      <p className={cx("m-0 mt-2 text-[17px] font-semibold wrap-break-word", profile.nickname ? "text-ink" : "text-ink-3")}>
        {profile.nickname || t.senzaNickname}
      </p>

      <dl className="m-0 mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {profile.friendCode ? (
          <div>
            <dt className={eyebrow}>{t.codiceAmico}</dt>
            <dd className={cx(numeric, "m-0 mt-0.5 text-[15px] text-ink")}>#{profile.friendCode}</dd>
          </div>
        ) : null}
        {game.account ? (
          <div>
            <dt className={eyebrow}>{t.classe}</dt>
            <dd className="m-0 mt-0.5 text-[15px] text-ink">
              {power > 0 ? (
                <>
                  <span className={numeric}>{power.toLocaleString(number)}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[13px] text-ink-3">
                    {verifiedNow && day ? (
                      <>
                        <IconCheck size={13} className="shrink-0 text-up" />
                        {t.verificata(day)}
                      </>
                    ) : (
                      t.dichiarata
                    )}
                  </span>
                </>
              ) : (
                <span className="text-ink-3">{t.nessunaClasse}</span>
              )}
            </dd>
          </div>
        ) : null}
        {game.heroes ? (
          <div>
            <dt className={eyebrow}>{t.box}</dt>
            <dd className={cx(numeric, "m-0 mt-0.5 text-[15px] text-ink")}>
              {t.boxNumero(owned.toLocaleString(number), game.total.toLocaleString(number))}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {game.account ? (
          <Link href={`/profilo/${game.slug}`} className={buttonClass("outline", "sm")}>
            {t.account}
          </Link>
        ) : null}
        {game.heroes ? (
          <Link href={`/profilo/${game.slug}/eroi`} className={buttonClass("outline", "sm")}>
            {t.eroi}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
