"use client";

/**
 * Il gioco in cui sei, nell'intestazione accanto al marchio: «HEIKI / GRAND
 * CROSS», e il nome porta al menu del gioco.
 *
 * Dal 24/10 (revisione del design) prende il posto della striscia rossa che
 * stava sotto l'intestazione su ogni pagina di un gioco: una riga intera per un
 * gioco solo e un «+4 in arrivo» che portava a del testo. I giochi in arrivo li
 * elenca la home.
 *
 * Client solo per leggere l'indirizzo: l'intestazione sta nel layout radice, che
 * non sa in che gioco si e'. La barra obliqua rossa e' quella delle briciole.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: { menu: (gioco: string) => `${gioco}: menu del gioco` },
  en: { menu: (game: string) => `${game}: game menu` },
});

export function HeaderGame({ games }: { games: readonly { slug: string; name: string }[] }) {
  const pathname = usePathname();
  const t = TESTI[useLocale()];
  const slug = pathname.split("/")[1];
  const game = games.find((entry) => entry.slug === slug);
  if (!game) return null;

  // Sotto i 640px non c'e': a 390 il nome si troncava e spingeva «Entra» fuori
  // dallo schermo. Sul telefono il gioco lo dicono il titolo del menu e la barra
  // in basso
  return (
    <span className="flex min-w-0 shrink items-center gap-2.5 max-sm:hidden">
      <span aria-hidden className="font-display text-[24px] font-black text-brand [font-variation-settings:'wdth'_80]">
        /
      </span>
      <Link
        href={`/${game.slug}`}
        aria-label={t.menu(game.name)}
        aria-current={pathname === `/${game.slug}` ? "page" : undefined}
        className="flex min-h-11 min-w-0 items-center font-display text-[17px] font-extrabold uppercase tracking-[0.02em] text-ink [font-variation-settings:'wdth'_78] hover:text-brand-deep"
      >
        <span className="truncate">{game.name}</span>
      </Link>
    </span>
  );
}
