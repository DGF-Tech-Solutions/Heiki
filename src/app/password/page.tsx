import type { Metadata } from "next";
import Link from "next/link";
import { cx, display, eyebrow } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { RequestResetForm } from "./request-form";

const TESTI = testi({
  it: {
    titoloPagina: "Recupera la password",
    recupero: "Recupero",
    titolo: "Hai perso la password",
    intro:
      "Inserisci l'indirizzo con cui ti sei iscritto. Se corrisponde a un account, ti arriva un collegamento per impostarne una nuova.",
    stessaRisposta:
      "Rispondiamo allo stesso modo sia che l'indirizzo esista sia che non esista. Non è scortesia: altrimenti questo modulo diventerebbe un modo per scoprire chi è iscritto.",
    tornataInMente: "Ti è tornata in mente?",
    entra: "Entra",
  },
  en: {
    titoloPagina: "Recover your password",
    recupero: "Recovery",
    titolo: "Lost your password",
    intro:
      "Enter the address you signed up with. If it matches an account, you'll receive a link to set a new one.",
    stessaRisposta:
      "We reply the same way whether or not the address exists. It isn't rudeness: otherwise this form would become a way to find out who has signed up.",
    tornataInMente: "Remembered it?",
    entra: "Log in",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

export default async function PasswordRequestPage() {
  const t = TESTI[await getLocale()];

  return (
    <main className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-6 pt-13 pb-24 lg:grid-cols-[1fr_0.85fr]">
      <div>
        <p className={eyebrow}>{t.recupero}</p>
        <h1 className={cx(display, "mt-4 text-[clamp(30px,4.4vw,48px)]")}>{t.titolo}</h1>
        <p className="mt-4 max-w-[48ch] text-base text-ink-2">{t.intro}</p>

        <p className="mt-6 max-w-[46ch] border-l-[3px] border-brand pl-3.5 text-[13px] text-ink-2">
          {t.stessaRisposta}
        </p>
      </div>

      <div className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-7">
        <RequestResetForm />

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          {t.tornataInMente}{" "}
          <Link href="/entra" className="font-semibold text-brand hover:underline">
            {t.entra}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
