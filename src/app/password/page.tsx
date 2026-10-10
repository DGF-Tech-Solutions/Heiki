import type { Metadata } from "next";
import Link from "next/link";
import { cx, display } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { RequestResetForm } from "./request-form";

const TESTI = testi({
  it: {
    titoloPagina: "Recupera la password",
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
        <h1 className={cx(display, "text-[clamp(36px,5.4vw,64px)]")}>{t.titolo}</h1>
        <p className="mt-4 max-w-[48ch] text-base text-ink-2">{t.intro}</p>

        <p className="p5-corner border border-rule bg-paper-2 px-4 py-3 mt-6 max-w-[48ch] text-[13px] text-ink-2">
          {t.stessaRisposta}
        </p>
      </div>

      <div className="p5-corner border border-rule bg-paper-2 p-6 sm:p-7">
        <RequestResetForm />

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          {t.tornataInMente}{" "}
          <Link href="/entra" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep">
            {t.entra}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
