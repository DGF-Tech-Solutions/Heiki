import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { SectionTabs } from "@/components/section-tabs";
import { PageHeader } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    ilTuoAccount: "Il tuo account",
    sezioni: "Sezioni delle impostazioni",
    profilo: "Profilo",
    account: "Account",
  },
  en: {
    ilTuoAccount: "Your account",
    sezioni: "Settings sections",
    profilo: "Profile",
    account: "Account",
  },
});

const TABS = [
  { href: "/impostazioni/profilo", key: "profilo" },
  { href: "/impostazioni/account", key: "account" },
] as const;

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

  const t = TESTI[await getLocale()];

  return (
    <main className="mx-auto w-full max-w-[980px] px-6 pt-9 pb-24">
      <PageHeader title={t.ilTuoAccount} />

      {/* le schede dicono dove sei (10/10: prima erano due collegamenti uguali) */}
      <SectionTabs
        label={t.sezioni}
        tabs={TABS.map((tab) => ({ href: tab.href, label: t[tab.key] }))}
        className="mb-8 flex flex-wrap gap-1.5"
      />

      {children}
    </main>
  );
}
