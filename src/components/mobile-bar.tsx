"use client";

/**
 * La barra in basso del telefono, nelle pagine di un gioco: Eroi, Uscite,
 * Cerca, Menu. Richiesta del 10/10 («migliora la navigabilita'»): sul telefono
 * il menu e la ricerca stavano in alto a sinistra, dove il pollice non arriva.
 * Quattro voci e non di piu': le piu' usate, e il menu per tutto il resto.
 *
 * Cerca apre la ricerca rapida (quick-search.tsx, con un evento); Menu apre il
 * pannello del gioco (game-menu.tsx, `popovertarget`). Sopra i 1024px non c'e':
 * la barra laterale fa la stessa cosa.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCalendar, IconHeroes, IconMenu, IconSearch } from "@/components/icons";
import { cx } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

export const OPEN_SEARCH_EVENT = "gachazone:apri-ricerca";

const TESTI = testi({
  it: { eroi: "Eroi", uscite: "Uscite", cerca: "Cerca", menu: "Menu", barra: "Navigazione del gioco" },
  en: { eroi: "Heroes", uscite: "Releases", cerca: "Search", menu: "Menu", barra: "Game navigation" },
});

export function MobileBar({ game, hasReleases }: { game: string; hasReleases: boolean }) {
  const t = TESTI[useLocale()];
  const pathname = usePathname();
  const item =
    "flex min-h-14 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 border-0 bg-transparent font-display text-[11px] font-extrabold uppercase tracking-[0.04em] [font-variation-settings:'wdth'_85]";
  const here = (path: string) => pathname === `/${game}${path}` || pathname.startsWith(`/${game}${path}/`);

  return (
    <nav
      aria-label={t.barra}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t-2 border-brand bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <Link href={`/${game}/eroi`} aria-current={here("/eroi") ? "page" : undefined} className={cx(item, here("/eroi") ? "text-brand-deep" : "text-ink-2")}>
        <IconHeroes size={20} />
        {t.eroi}
      </Link>
      {hasReleases ? (
        <Link href={`/${game}/uscite`} aria-current={here("/uscite") ? "page" : undefined} className={cx(item, here("/uscite") ? "text-brand-deep" : "text-ink-2")}>
          <IconCalendar size={20} />
          {t.uscite}
        </Link>
      ) : null}
      <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))} className={cx(item, "text-ink-2")}>
        <IconSearch size={20} />
        {t.cerca}
      </button>
      <button type="button" popoverTarget="menu-sezioni" className={cx(item, "text-ink-2")}>
        <IconMenu size={20} />
        {t.menu}
      </button>
    </nav>
  );
}
