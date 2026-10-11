"use client";

/**
 * Barra laterale del gioco.
 *
 * Sostituisce la fila di voci in alto: con i gruppi la navigazione cresce senza
 * essere ripensata, ed e' la forma che usano i siti di riferimento del settore.
 * Una barra orizzontale regge quattro voci, non dodici.
 *
 * E' un componente client solo per sapere dove ci si trova: la voce attiva la
 * decide il percorso corrente, non il chiamante.
 *
 * Quali voci esistano lo decide invece il chiamante, che gira sul server: qui
 * arrivano gia' filtrate. Risolverle qui costringerebbe a importare il registro
 * dei moduli - e con esso il motore e i dataset - nel bundle del browser. Cosi' nessuna pagina deve
 * ricordarsi di dichiarare in che sezione sta - una cosa che prima o poi
 * qualcuno dimentica, e la barra indica il posto sbagliato.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { GameSectionGroup } from "@/lib/games/catalog";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { cx, eyebrow } from "./ui";

const TESTI = testi({
  it: { sezioni: "Sezioni del gioco" },
  en: { sezioni: "Game sections" },
});

export function GameSidebar({
  game,
  groups,
}: {
  game: string;
  groups: readonly GameSectionGroup[];
}) {
  const pathname = usePathname();
  const base = `/${game}`;
  const t = TESTI[useLocale()];
  // La voce attiva e' quella col percorso PIU' LUNGO che contiene la pagina:
  // in «I tuoi eroi» (/account/eroi) anche «Il mio account» (/account) ne e'
  // l'inizio, e si accendevano tutte e due (10/10). La radice del gioco vale solo
  // per uguaglianza, se no risulterebbe attiva ovunque.
  const activePath = groups
    .flatMap((group) => group.items.map((item) => item.path))
    .filter((path) =>
      path === "" ? pathname === base : pathname === `${base}${path}` || pathname.startsWith(`${base}${path}/`),
    )
    .sort((a, b) => b.length - a.length)[0];

  // La barra scorre per conto suo (layout del gioco, 10/10): se la voce attiva e'
  // fuori dalla parte visibile, la si porta a un terzo dell'altezza. Solo la
  // barra si muove, non la pagina.
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const aside = nav.current?.closest("aside");
    const link = nav.current?.querySelector('[aria-current="page"]');
    if (!aside || !link || aside.scrollHeight <= aside.clientHeight) return;
    const box = aside.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.top < box.top || item.bottom > box.bottom) aside.scrollTop += item.top - box.top - box.height / 3;
  }, [activePath]);

  return (
    <nav ref={nav} aria-label={t.sezioni} className="grid gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          {/* il nome del gruppo e' una targhetta bianca tagliata, come le
              intestazioni dei menu di Persona */}
          <p className={cx(eyebrow, "p5-cut-sm mb-2 inline-block bg-ink px-2.5 py-0.5 text-paper")}>
            {group.label}
          </p>

          <ul className="m-0 grid list-none gap-0.5 p-0">
            {group.items.map((item) => {
              const href = `${base}${item.path}`;
              const active = item.path === activePath;

              return (
                <li key={item.path}>
                  <Link
                    href={href}
                    title={item.hint}
                    aria-current={active ? "page" : undefined}
                    // lama bianca al passaggio, lama rossa con la sagoma sfalsata
                    // sulla voce attiva: le disegna .p5-menu-item in globals.css
                    className={cx(
                      "p5-menu-item block px-3 py-1.5 font-display text-[14px] font-extrabold uppercase tracking-[0.02em] transition-colors [font-variation-settings:'wdth'_82]",
                      // il nero del passaggio va scritto qui: l'utility di riposo scavalca
                      // quello di .p5-menu-item, e il testo chiaro restava sulla lama bianca
                      active ? "text-white" : "text-ink-2 hover:text-paper",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
