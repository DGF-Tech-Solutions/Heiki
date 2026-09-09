import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { display, eyebrow } from "@/components/ui";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";

export const metadata: Metadata = {
  title: "Crea il profilo · GachaZone",
};

export default async function RegisterPage() {
  const session = await safeSession();
  if (session?.user) redirect(`/u/${session.user.username}`);

  const demoMode = !(await databaseReachable());

  return (
    <main className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-6 pt-13 pb-20 lg:grid-cols-[1fr_0.85fr]">
      <div>
        <p className={eyebrow}>Registrazione</p>
        <h1 className={`${display} mt-4 text-[clamp(32px,4.6vw,52px)]`}>
          Il profilo è la tua firma.
        </h1>
        <p className="mt-4 max-w-[48ch] text-base text-ink-2">
          Build salvate, squadre, preferiti e i badge che ti sei guadagnato. Tutto su una pagina che
          mandi in giro con un link.
        </p>

        <ul className="mt-7 grid list-none gap-4 p-0">
          <li className="border-l-[3px] border-brand pl-3.5 text-sm text-ink-2">
            <strong className="text-ink">I badge si guadagnano.</strong> Quelli verificati leggono
            il tuo profilo di gioco pubblico. Non ti chiediamo mai le credenziali del gioco.
          </li>
          <li className="border-l-[3px] border-brand pl-3.5 text-sm text-ink-2">
            <strong className="text-ink">Il livello sale se sei utile.</strong> Contano le guide
            approvate e i voti che ricevi, non quanti messaggi scrivi.
          </li>
        </ul>
      </div>

      <div className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-7">
        <DemoNotice />
        <RegisterForm demoMode={demoMode} />
        <SetupHint />

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          Hai già un profilo?{" "}
          <Link href="/entra" className="font-semibold text-brand hover:underline">
            Entra
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
