import Link from "next/link";
import { listGames } from "@/lib/games/catalog";
import { cx } from "./ui";

/**
 * Selettore del gioco.
 *
 * Sta in cima e dice una cosa sola: in quale gioco ti trovi. Le sezioni sono
 * nella barra laterale, che regge la crescita meglio di una fila orizzontale.
 *
 * I giochi non ancora pronti restano visibili ma non cliccabili: nasconderli
 * farebbe sembrare il sito monogioco, mostrarli come attivi sarebbe una bugia.
 */
export function GameSwitcher({ game }: { game: string }) {
  const games = listGames();

  return (
    <div className="border-b border-rule bg-paper-2">
      <nav
        aria-label="Gioco"
        className="mx-auto flex w-full max-w-shell flex-wrap items-center gap-1 px-6 py-2"
      >
        {games.map((entry) =>
          entry.available ? (
            <Link
              key={entry.slug}
              href={`/${entry.slug}`}
              aria-current={entry.slug === game ? "true" : undefined}
              className={cx(
                "rounded-sm px-2.5 py-1 text-[13px] font-semibold transition-colors",
                entry.slug === game
                  ? "bg-ink text-paper"
                  : "text-ink-2 hover:bg-paper-3 hover:text-ink",
              )}
            >
              {entry.shortName}
            </Link>
          ) : (
            <span
              key={entry.slug}
              title={`${entry.name} — modulo non ancora pronto`}
              className="cursor-not-allowed rounded-sm px-2.5 py-1 text-[13px] text-ink-3/60"
            >
              {entry.shortName}
              <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider">
                in arrivo
              </span>
            </span>
          ),
        )}
      </nav>
    </div>
  );
}
