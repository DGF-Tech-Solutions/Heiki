import type { Metadata } from "next";
import Link from "next/link";
import { cx, display, eyebrow } from "@/components/ui";
import { RequestResetForm } from "./request-form";

export const metadata: Metadata = {
  title: "Recupera la password",
  robots: { index: false, follow: false },
};

export default function PasswordRequestPage() {
  return (
    <main className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-6 pt-13 pb-24 lg:grid-cols-[1fr_0.85fr]">
      <div>
        <p className={eyebrow}>Recupero</p>
        <h1 className={cx(display, "mt-4 text-[clamp(30px,4.4vw,48px)]")}>
          Hai perso la password
        </h1>
        <p className="mt-4 max-w-[48ch] text-base text-ink-2">
          Inserisci l&apos;indirizzo con cui ti sei iscritto. Se corrisponde a un account, ti
          arriva un collegamento per impostarne una nuova.
        </p>

        <p className="mt-6 max-w-[46ch] border-l-[3px] border-brand pl-3.5 text-[13px] text-ink-2">
          Rispondiamo allo stesso modo sia che l&apos;indirizzo esista sia che non esista. Non è
          scortesia: altrimenti questo modulo diventerebbe un modo per scoprire chi è iscritto.
        </p>
      </div>

      <div className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-7">
        <RequestResetForm />

        <p className="mt-4.5 border-t border-rule-2 pt-4 text-[13px] text-ink-2">
          Ti è tornata in mente?{" "}
          <Link href="/entra" className="font-semibold text-brand hover:underline">
            Entra
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
