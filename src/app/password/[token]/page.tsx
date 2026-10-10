import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass, cx, display, Notice } from "@/components/ui";
import { isResetTokenValid } from "@/lib/auth/password-reset";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { CompleteResetForm } from "./complete-form";

const TESTI = testi({
  it: {
    nuovaPassword: "Nuova password",
    nonPiuValido: "Questo collegamento non è più valido. Vale un'ora e si consuma al primo uso.",
    chiedineUnAltro: "Chiedine un altro",
  },
  en: {
    nuovaPassword: "New password",
    nonPiuValido: "This link is no longer valid. It lasts one hour and is used up the first time it's opened.",
    chiedineUnAltro: "Request another one",
  },
});

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.nuovaPassword,
    robots: { index: false, follow: false },
  };
}

export default async function PasswordResetPage({ params }: Props) {
  const { token } = await params;
  const t = TESTI[await getLocale()];

  // Si controlla prima di disegnare il modulo: far compilare due campi per poi
  // dire che il collegamento e' scaduto e' una perdita di tempo evitabile.
  const valid = await isResetTokenValid(token);

  return (
    <main className="mx-auto w-full max-w-[520px] px-6 pt-13 pb-24">
      <h1 className={cx(display, "mb-6 text-[clamp(32px,5vw,48px)]")}>{t.nuovaPassword}</h1>

      {valid ? (
        <div className="p5-corner border border-rule bg-paper-2 p-6 sm:p-7">
          <CompleteResetForm token={token} />
        </div>
      ) : (
        <>
          <Notice tone="error" className="mb-6">
            {t.nonPiuValido}
          </Notice>

          <Link href="/password" className={buttonClass("primary")}>
            {t.chiedineUnAltro}
          </Link>
        </>
      )}
    </main>
  );
}
