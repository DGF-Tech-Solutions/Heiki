import Link from "next/link";
import { GAME_SECTIONS, listGames } from "@/lib/games/catalog";
import { cx } from "./ui";

/**
 * Barra di contesto del gioco.
 *
 * Sta sotto l'intestazione e dice due cose: in quale gioco ti trovi e cosa
 * puoi farci. E' il modello HoYoLAB - scegli il gioco e cambia il contesto di
 * tutto il resto - invece di un sito unico che mescola cinque giochi.
 *
 * I giochi non ancora pronti restano visibili ma non cliccabili: nasconderli
 * farebbe sembrare il sito monogioco, mostrarli come attivi sarebbe una bugia.
 */
export function GameNav({ game, section }: { game: string; section: string }) {
  const games = listGames();

  return (
    <div className="border-b border-rule bg-paper-2">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-2">
        <nav aria-label="Gioco" className="flex flex-wrap items-center gap-1">
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

        <nav aria-label="Sezione" className="ml-auto flex flex-wrap items-center gap-4">
          {GAME_SECTIONS.map((entry) => (
            <Link
              key={entry.path}
              href={`/${game}${entry.path}`}
              aria-current={entry.path === section ? "page" : undefined}
              className={cx(
                "border-b-2 py-1 text-[13px] transition-colors",
                entry.path === section
                  ? "border-brand font-semibold text-ink"
                  : "border-transparent text-ink-2 hover:text-ink",
              )}
            >
              {entry.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
