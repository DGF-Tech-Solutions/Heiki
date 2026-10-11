/**
 * I riquadri delle due pagine del modulo quando il modulo non c'e': chi non e'
 * entrato, e il sito senza database. Componenti server: leggono la lingua dal
 * cookie, come il resto delle pagine.
 *
 * Chi non e' entrato trova l'invito, non un modulo spento: un modulo da riempire
 * e poi perdere al momento dell'invio sarebbe peggio di niente.
 */

import Link from "next/link";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { buttonClass, Card, cx, display } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    serveProfilo: "Serve un profilo",
    perchePubblicare:
      "Per pubblicare una strategia devi entrare: la squadra resta firmata col tuo nome, e gli altri la votano e la commentano.",
    entra: "Entra",
    creaProfilo: "Crea il profilo",
    serveDatabase: "Le strategie si salvano nel database: finché non è acceso, il modulo non c'è.",
  },
  en: {
    serveProfilo: "You need a profile",
    perchePubblicare:
      "To publish a strategy you need to log in: the team carries your name, and others vote and comment on it.",
    entra: "Log in",
    creaProfilo: "Create your profile",
    serveDatabase: "Strategies are saved in the database: until it's running, the form isn't available.",
  },
});

export async function StrategyLoginInvite() {
  const t = TESTI[await getLocale()];
  return (
    <Card accent className="max-w-[560px]">
      <h2 className={cx(display, "text-[18px] [font-variation-settings:'wdth'_92]")}>{t.serveProfilo}</h2>
      <p className="mt-2 mb-0 text-[14px] text-ink-2">{t.perchePubblicare}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link href="/entra" className={buttonClass("primary", "sm")}>
          {t.entra}
        </Link>
        <Link href="/registrati" className={buttonClass("outline", "sm")}>
          {t.creaProfilo}
        </Link>
      </div>
    </Card>
  );
}

export async function StrategyNeedsDatabase() {
  const t = TESTI[await getLocale()];
  return (
    <>
      <DemoNotice />
      <p className="m-0 max-w-[60ch] text-[14px] text-ink-2">{t.serveDatabase}</p>
      <SetupHint />
    </>
  );
}
