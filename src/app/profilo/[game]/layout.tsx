import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTabs } from "@/components/section-tabs";
import { cx, MoreArrow, moreLinkClass } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { profileGame } from "@/lib/profile/games";

const TESTI = testi({
  it: {
    sezioni: (gioco: string) => `Le tue pagine di ${gioco}`,
    account: "Account di gioco",
    eroi: "I tuoi eroi",
    alGioco: (gioco: string) => `Vai a ${gioco}`,
  },
  en: {
    sezioni: (game: string) => `Your ${game} pages`,
    account: "Game account",
    eroi: "Your heroes",
    alGioco: (game: string) => `Go to ${game}`,
  },
});

/**
 * Le pagine di un gioco nel profilo: l'account di gioco e il box. Un gioco senza
 * pagine nel profilo (o uno slug che non e' un gioco) non ha niente da
 * mostrare: 404, come nel guscio delle pagine del gioco.
 */
export default async function ProfileGameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  const entry = profileGame(game);
  if (!entry) notFound();
  const t = TESTI[await getLocale()];

  const tabs = [
    ...(entry.account ? [{ href: `/profilo/${game}`, label: t.account }] : []),
    ...(entry.heroes ? [{ href: `/profilo/${game}/eroi`, label: t.eroi }] : []),
  ];

  return (
    <>
      {/*
        Le voci «Il tuo profilo» del menu del gioco portano qui, fuori dal guscio
        del gioco (menu laterale compreso): un collegamento per tornarci
        (critica della ricerca, 25/10)
      */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* una scheda sola non e' una scelta: con una pagina sola non c'e' la fila */}
        {tabs.length > 1 ? <SectionTabs label={t.sezioni(entry.shortName)} tabs={tabs} className="flex flex-wrap gap-1.5" /> : null}
        <Link href={`/${game}`} className={cx(moreLinkClass, "pointer-coarse:min-h-11")}>
          {t.alGioco(entry.shortName)}
          <MoreArrow />
        </Link>
      </div>
      {children}
    </>
  );
}
