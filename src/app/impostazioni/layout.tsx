import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { cx, display, eyebrow } from "@/components/ui";

const TABS = [
  { href: "/impostazioni/profilo", label: "Profilo" },
  { href: "/impostazioni/account", label: "Account" },
];

/**
 * Guscio delle impostazioni.
 *
 * Le due aree sono separate di proposito: il profilo e' cio' che gli altri
 * vedono, l'account e' cio' con cui entri. Mescolarle significa mettere il campo
 * della password accanto alla scelta del colore, e far sembrare ugualmente
 * reversibili due cose che non lo sono.
 *
 * Il controllo della sessione sta qui e non nelle pagine: una pagina che si
 * dimentica di farlo mostrerebbe i dati di qualcun altro.
 */
export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  if (!(await databaseReachable())) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-6 py-12">
        <DemoNotice />
        <SetupHint />
      </main>
    );
  }

  const session = await auth();
  if (!session?.user?.id) redirect("/entra");

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 pt-9 pb-24">
      <header className="mb-6">
        <p className={eyebrow}>Impostazioni</p>
        <h1 className={cx(display, "mt-2.5 text-[32px]")}>Il tuo account</h1>
      </header>

      <nav aria-label="Sezioni delle impostazioni" className="mb-8 flex gap-5 border-b border-rule">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="-mb-px border-b-2 border-transparent pb-2.5 text-sm text-ink-2 hover:border-ink-3 hover:text-ink"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </main>
  );
}
