import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { Button, display, eyebrow } from "@/components/ui";
import { enabledOauthProviders } from "@/lib/auth/config";
import { auth, signIn } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Entra · GachaZone",
    accesso: "Accesso",
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
    titoloPagina: "Log in · GachaZone",
    accesso: "Login",
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
        <p className={eyebrow}>{t.accesso}</p>
        <h1 className={`${display} mt-4 text-[clamp(32px,4.6vw,52px)]`}>{t.bentornato}</h1>
        <p className="mt-4 max-w-[46ch] text-base text-ink-2">{t.doveLeHaiLasciate}</p>
        <p className="mt-6 max-w-[44ch] border-l-[3px] border-brand pl-3.5 text-[13px] text-ink-2">
          {t.calcolatoreLibero}
        </p>
      </div>

      <div className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-7">
        <DemoNotice />
        <LoginForm demoMode={demoMode} />

        {providers.length > 0 ? (
          <>
            <div className="my-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 before:h-px before:flex-1 before:bg-rule after:h-px after:flex-1 after:bg-rule">
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
          <Link href="/password" className="font-semibold text-brand hover:underline">
            {t.passwordDimenticata}
          </Link>
        </p>

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          {t.nonHaiProfilo}{" "}
          <Link href="/registrati" className="font-semibold text-brand hover:underline">
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
