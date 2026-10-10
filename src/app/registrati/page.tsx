import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { display } from "@/components/ui";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Crea il profilo",
    titolo: "Il profilo è la tua firma.",
    intro:
      "Build salvate, squadre, preferiti e i badge che ti sei guadagnato. Tutto su una pagina che mandi in giro con un link.",
    badgeTitolo: "I badge si guadagnano.",
    badgeTesto:
      "Quelli verificati leggono il tuo profilo di gioco pubblico. Non ti chiediamo mai le credenziali del gioco.",
    livelloTitolo: "Il livello sale se sei utile.",
    livelloTesto: "Contano le guide approvate e i voti che ricevi, non quanti messaggi scrivi.",
    haiGiaProfilo: "Hai già un profilo?",
    entra: "Entra",
  },
  en: {
    titoloPagina: "Create your profile",
    titolo: "Your profile is your signature.",
    intro:
      "Saved builds, teams, favorites and the badges you've earned. All on one page you can share with a link.",
    badgeTitolo: "Badges are earned.",
    badgeTesto:
      "Verified ones read your public game profile. We never ask for your game credentials.",
    livelloTitolo: "Your level goes up when you're helpful.",
    livelloTesto: "What counts is approved guides and the votes you receive, not how many messages you write.",
    haiGiaProfilo: "Already have a profile?",
    entra: "Log in",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina };
}

export default async function RegisterPage() {
  const session = await safeSession();
  if (session?.user) redirect(`/u/${session.user.username}`);

  const t = TESTI[await getLocale()];
  const demoMode = !(await databaseReachable());

  return (
    <main className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-6 pt-13 pb-20 lg:grid-cols-[1fr_0.85fr]">
      <div>
        <h1 className={`${display} text-[clamp(40px,6vw,72px)]`}>{t.titolo}</h1>
        <p className="mt-4 max-w-[48ch] text-base text-ink-2">{t.intro}</p>

        {/* le due promesse in riquadri tagliati: prima un filo rosso a sinistra (10/10) */}
        <ul className="mt-7 grid max-w-[52ch] list-none gap-2.5 p-0">
          <li className="p5-corner border border-rule bg-paper-2 px-4 py-3 text-sm text-ink-2">
            <strong className="text-ink">{t.badgeTitolo}</strong> {t.badgeTesto}
          </li>
          <li className="p5-corner border border-rule bg-paper-2 px-4 py-3 text-sm text-ink-2">
            <strong className="text-ink">{t.livelloTitolo}</strong> {t.livelloTesto}
          </li>
        </ul>
      </div>

      <div className="p5-corner border border-rule bg-paper-2 p-6 sm:p-7">
        <DemoNotice />
        <RegisterForm demoMode={demoMode} />
        <SetupHint />

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          {t.haiGiaProfilo}{" "}
          <Link href="/entra" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep">
            {t.entra}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

async function safeSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}
