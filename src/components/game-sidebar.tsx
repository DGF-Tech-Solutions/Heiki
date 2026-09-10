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
import { cx, eyebrow } from "./ui";

export function GameSidebar({
  game,
  groups,
}: {
  game: string;
  groups: readonly GameSectionGroup[];
}) {
  const pathname = usePathname();
  const base = `/${game}`;

  return (
    <nav aria-label="Sezioni del gioco" className="grid gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className={cx(eyebrow, "mb-2")}>{group.label}</p>

          <ul className="m-0 grid list-none gap-px p-0">
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
                    className={cx(
                      "block rounded-sm px-2.5 py-1.5 text-[13px] transition-colors",
                      active
                        ? "bg-brand-soft font-semibold text-brand-deep"
                        : "text-ink-2 hover:bg-paper-2 hover:text-ink",
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
