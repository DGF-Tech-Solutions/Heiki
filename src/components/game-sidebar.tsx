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

  return (
    <nav aria-label={t.sezioni} className="grid gap-5">
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
              // La sezione senza percorso e' la radice del gioco: va confrontata
              // per uguaglianza, altrimenti risulterebbe attiva su ogni pagina.
              const active = item.path === "" ? pathname === base : pathname.startsWith(href);

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
                      active ? "text-white" : "text-ink-2",
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
