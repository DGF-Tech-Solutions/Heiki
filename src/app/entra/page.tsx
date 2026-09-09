import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
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
    <main className="shell auth">
      <div>
        <p className="eyebrow">Accesso</p>
        <h1 className="display" style={{ fontSize: "clamp(32px, 4.6vw, 52px)", marginTop: 16 }}>
          Bentornato.
        </h1>
        <p className="lede" style={{ marginTop: 18 }}>
          Le tue build, i tuoi team e le rotazioni salvate ti aspettano dove li hai lasciati.
        </p>
        <p className="hero__note">
          Il calcolatore resta libero anche senza accesso: l&apos;account serve per salvare e
          condividere, non per usare gli strumenti.
        </p>
      </div>

      <div className="auth__panel">
        <DemoNotice />
        <LoginForm demoMode={demoMode} />

        {providers.length > 0 ? (
          <>
            <div className="divider">oppure</div>
            {providers.map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  "use server";
                  await signIn(provider.id, { redirectTo: "/" });
                }}
                style={{ marginBottom: 10 }}
              >
                <button type="submit" className="btn btn--block">
                  Continua con {provider.label}
                </button>
              </form>
            ))}
          </>
        ) : null}

        <SetupHint />

        <p className="form-foot">
          Non hai ancora un profilo? <Link href="/registrati">Creane uno</Link>.
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
