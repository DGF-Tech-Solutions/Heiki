"use client";

/**
 * Barra laterale del gioco, con le sezioni che si aprono e si chiudono (06/11).
 *
 * Sostituisce la fila di voci in alto: con i gruppi la navigazione cresce senza
 * essere ripensata. Di partenza tutto aperto: chiudere e' una scelta di chi legge, non
 * del sito.
 *
 * La scelta sta in SezioniProvider, una sola per la barra del computer e per il menu del
 * telefono, e si ricorda in un cookie invece che nel localStorage: lo legge il layout sul
 * server, e il primo disegno ha gia' le sezioni giuste. Col localStorage a ogni
 * caricamento si vedrebbero tutte aperte e poi le chiuse richiudersi.
 *
 * Una sezione si riconosce dal percorso della sua prima voce: il nome cambia con la
 * lingua, e la posizione con un riordino del menu.
 *
 * E' un componente client anche per sapere dove ci si trova: la voce attiva la decide il
 * percorso corrente, non il chiamante. Quali voci esistano lo decide invece il chiamante,
 * che gira sul server: risolverle qui costringerebbe a importare il registro dei moduli, e
 * con esso i dataset, nel bundle del browser.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { GameSectionGroup } from "@/lib/games/catalog";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { IconChevronDown } from "./icons";

const TESTI = testi({
  it: { sezioni: "Sezioni del gioco" },
  en: { sezioni: "Game sections" },
});

const SezioniContext = createContext<{ chiuse: ReadonlySet<string>; alterna: (chiave: string) => void }>({
  chiuse: new Set(),
  alterna: () => {},
});

export function SezioniProvider({
  cookie,
  chiuse: iniziali,
  children,
}: {
  cookie: string;
  chiuse: readonly string[];
  children: React.ReactNode;
}) {
  const [chiuse, setChiuse] = useState<ReadonlySet<string>>(() => new Set(iniziali));

  function alterna(chiave: string) {
    const nuove = new Set(chiuse);
    if (!nuove.delete(chiave)) nuove.add(chiave);
    setChiuse(nuove);
    document.cookie = `${cookie}=${encodeURIComponent([...nuove].join(" "))}; path=/; max-age=31536000; samesite=lax`;
  }

  return <SezioniContext.Provider value={{ chiuse, alterna }}>{children}</SezioniContext.Provider>;
}

export function GameSidebar({
  game,
  groups,
  dove,
}: {
  game: string;
  groups: readonly GameSectionGroup[];
  /** La stessa barra sta due volte nella pagina: distingue gli id delle voci. */
  dove: "barra" | "menu";
}) {
  const pathname = usePathname();
  const t = TESTI[useLocale()];
  const { chiuse, alterna } = useContext(SezioniContext);
  const base = `/${game}`;
  // La voce attiva e' quella col percorso PIU' LUNGO che contiene la pagina: in «I tuoi
  // eroi» anche «Il mio account» ne era l'inizio, e si accendevano tutte e due (10/10). La
  // radice del gioco vale solo per uguaglianza, se no risulterebbe attiva ovunque.
  const activeHref = groups
    .flatMap((group) => group.items.map((item) => item.href))
    .filter((href) => (href === base ? pathname === base : pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.length - a.length)[0];

  // La barra scorre per conto suo: se dove sei e' fuori dalla parte visibile, lo si porta a
  // un terzo dell'altezza. Con la sezione chiusa il primo `aria-current` e' il suo titolo.
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const aside = nav.current?.closest("aside");
    const punto = nav.current?.querySelector("[aria-current]");
    if (!aside || !punto || aside.scrollHeight <= aside.clientHeight) return;
    const box = aside.getBoundingClientRect();
    const item = punto.getBoundingClientRect();
    if (item.top < box.top || item.bottom > box.bottom) aside.scrollTop += item.top - box.top - box.height / 3;
  }, [activeHref]);

  return (
    <nav ref={nav} aria-label={t.sezioni} className="barra-sezioni">
      {groups.map((group, indice) => {
        const chiave = group.items[0]?.path ?? group.label;
        const chiusa = chiuse.has(chiave);
        const dentro = group.items.some((item) => item.href === activeHref);
        const voci = `${dove}-sezione-${indice}`;

        return (
          <div key={chiave} className="sezione" data-chiusa={chiusa || undefined}>
            {/* chiusa, la sezione dove sei fa lei da blocco bianco: se no chi la chiude perde il posto */}
            <button
              type="button"
              className="sezione-titolo font-display"
              aria-expanded={!chiusa}
              aria-controls={voci}
              aria-current={chiusa && dentro ? "location" : undefined}
              onClick={() => alterna(chiave)}
            >
              <span>{group.label}</span>
              <IconChevronDown size={13} className="sezione-freccia" aria-hidden />
            </button>

            {/* due contenitori: l'altezza va a zero solo su quello senza margini interni */}
            <div id={voci} className="sezione-voci">
              <div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.href}
                        title={item.hint}
                        aria-current={item.href === activeHref ? "page" : undefined}
                        className="p5-menu-item block px-3 py-2.5 font-display lg:py-1 lg:leading-tight"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
