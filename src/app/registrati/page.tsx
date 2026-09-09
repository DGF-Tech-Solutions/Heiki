import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
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
    <main className="shell auth">
      <div>
        <p className="eyebrow">Registrazione</p>
        <h1 className="display" style={{ fontSize: "clamp(32px, 4.6vw, 52px)", marginTop: 16 }}>
          Il profilo e&apos; la tua firma.
        </h1>
        <p className="lede" style={{ marginTop: 18 }}>
          Build salvate, squadre, personaggi preferiti e i badge che ti sei guadagnato, tutto su una
          pagina che puoi mandare in giro con un link.
        </p>

        <ul style={{ margin: "26px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
          <li className="lede" style={{ fontSize: 14, margin: 0 }}>
            <strong style={{ color: "var(--chalk)" }}>I badge si guadagnano.</strong> Quelli
            verificati leggono il tuo profilo di gioco pubblico. Non chiediamo mai le credenziali
            del tuo account di gioco.
          </li>
          <li className="lede" style={{ fontSize: 14, margin: 0 }}>
            <strong style={{ color: "var(--chalk)" }}>Il livello sale con i riconoscimenti.</strong>{" "}
            Guide approvate e voti ricevuti, non numero di messaggi pubblicati.
          </li>
        </ul>
      </div>

      <div className="auth__panel">
        <DemoNotice />
        <RegisterForm demoMode={demoMode} />

        <SetupHint />

        <p className="form-foot">
          Hai gia&apos; un profilo? <Link href="/entra">Entra</Link>.
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
