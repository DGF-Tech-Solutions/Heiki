import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { Button, display, eyebrow } from "@/components/ui";
import { enabledOauthProviders } from "@/lib/auth/config";
import { auth, signIn } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";

export const metadata: Metadata = {
  title: "Entra · GachaZone",
};

export default async function LoginPage() {
  const session = await safeSession();
  if (session?.user) redirect(`/u/${session.user.username}`);

  const providers = enabledOauthProviders();
  const demoMode = !(await databaseReachable());

  return (
    <main className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-6 pt-13 pb-20 lg:grid-cols-[1fr_0.85fr]">
      <div>
        <p className={eyebrow}>Accesso</p>
        <h1 className={`${display} mt-4 text-[clamp(32px,4.6vw,52px)]`}>Bentornato.</h1>
        <p className="mt-4 max-w-[46ch] text-base text-ink-2">
          Le tue build, le tue squadre e le rotazioni salvate sono dove le hai lasciate.
        </p>
        <p className="mt-6 max-w-[44ch] border-l-[3px] border-brand pl-3.5 text-[13px] text-ink-2">
          Il calcolatore è libero anche senza account. Serve per salvare e condividere, non per
          usarlo.
        </p>
      </div>

      <div className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-7">
        <DemoNotice />
        <LoginForm demoMode={demoMode} />

        {providers.length > 0 ? (
          <>
            <div className="my-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 before:h-px before:flex-1 before:bg-rule after:h-px after:flex-1 after:bg-rule">
              oppure
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
                  Continua con {provider.label}
                </Button>
              </form>
            ))}
          </>
        ) : null}

        <SetupHint />

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          Non hai un profilo?{" "}
          <Link href="/registrati" className="font-semibold text-brand hover:underline">
            Creane uno
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
