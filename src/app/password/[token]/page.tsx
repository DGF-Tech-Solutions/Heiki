import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass, cx, display, eyebrow, Notice } from "@/components/ui";
import { isResetTokenValid } from "@/lib/auth/password-reset";
import { CompleteResetForm } from "./complete-form";

export const metadata: Metadata = {
  title: "Nuova password",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PasswordResetPage({ params }: Props) {
  const { token } = await params;

  // Si controlla prima di disegnare il modulo: far compilare due campi per poi
  // dire che il collegamento e' scaduto e' una perdita di tempo evitabile.
  const valid = await isResetTokenValid(token);

  return (
    <main className="mx-auto w-full max-w-[520px] px-6 pt-13 pb-24">
      <p className={eyebrow}>Recupero</p>
      <h1 className={cx(display, "mt-3 mb-6 text-[clamp(28px,4vw,40px)]")}>Nuova password</h1>

      {valid ? (
        <div className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-6">
          <CompleteResetForm token={token} />
        </div>
      ) : (
        <>
          <Notice tone="error" className="mb-6">
            Questo collegamento non è più valido. Vale un&apos;ora e si consuma al primo uso.
          </Notice>

          <Link href="/password" className={buttonClass("primary")}>
            Chiedine un altro
          </Link>
        </>
      )}
    </main>
  );
}
