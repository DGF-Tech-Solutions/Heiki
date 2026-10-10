import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { Button, display } from "@/components/ui";
import { enabledOauthProviders } from "@/lib/auth/config";
import { auth, signIn } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Entra",
    bentornato: "Bentornato.",
    doveLeHaiLasciate:
      "Le tue build, le tue squadre e le rotazioni salvate sono dove le hai lasciate.",
    calcolatoreLibero:
      "Il calcolatore è libero anche senza account. Serve per salvare e condividere, non per usarlo.",
    oppure: "oppure",
    continuaCon: (fornitore: string) => `Continua con ${fornitore}`,
    passwordDimenticata: "Password dimenticata?",
    nonHaiProfilo: "Non hai un profilo?",
    creaneUno: "Creane uno",
  },
  en: {
    titoloPagina: "Log in",
    bentornato: "Welcome back.",
    doveLeHaiLasciate: "Your builds, your teams and your saved rotations are right where you left them.",
    calcolatoreLibero:
      "The calculator is free to use without an account. You need one to save and share, not to use it.",
    oppure: "or",
    continuaCon: (fornitore: string) => `Continue with ${fornitore}`,
    passwordDimenticata: "Forgot your password?",
    nonHaiProfilo: "Don't have a profile?",
    creaneUno: "Create one",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina };
}

export default async function LoginPage() {
  const session = await safeSession();
  if (session?.user) redirect(`/u/${session.user.username}`);

  const t = TESTI[await getLocale()];
  const providers = enabledOauthProviders();
  const demoMode = !(await databaseReachable());

  return (
    <main className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-6 pt-13 pb-20 lg:grid-cols-[1fr_0.85fr]">
      <div>
        {/* niente etichetta sopra il titolo, e la nota in un riquadro tagliato invece del filo rosso a sinistra (10/10) */}
        <h1 className={`${display} text-[clamp(40px,6vw,72px)]`}>{t.bentornato}</h1>
        <p className="mt-4 max-w-[46ch] text-base text-ink-2">{t.doveLeHaiLasciate}</p>
        <p className="p5-corner border border-rule bg-paper-2 px-4 py-3 mt-6 max-w-[46ch] text-[13px] text-ink-2">
          {t.calcolatoreLibero}
        </p>
      </div>

      <div className="p5-corner border border-rule bg-paper-2 p-6 sm:p-7">
        <DemoNotice />
        <LoginForm demoMode={demoMode} />

        {providers.length > 0 ? (
          <>
            <div className="my-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 before:h-px before:flex-1 before:bg-rule after:h-px after:flex-1 after:bg-rule">
              {t.oppure}
            </div>
            {providers.map((provider) => (
              <form
                key={provider.id}
                className="mb-2.5"
                action={async () => {
                  "use server";
                  await signIn(provider.id, { redirectTo: "/" });
                }}
              >
                <Button type="submit" className="w-full">
                  {t.continuaCon(provider.label)}
                </Button>
              </form>
            ))}
          </>
        ) : null}

        <SetupHint />

        <p className="mt-4 text-[13px] text-ink-2">
          <Link href="/password" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep">
            {t.passwordDimenticata}
          </Link>
        </p>

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          {t.nonHaiProfilo}{" "}
          <Link href="/registrati" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep">
            {t.creaneUno}
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
