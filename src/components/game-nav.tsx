import Link from "next/link";
import { listGames } from "@/lib/games/catalog";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { cx } from "./ui";

const TESTI = testi({
  it: {
    gioco: "Gioco",
    nonPronto: (nome: string) => `${nome} — modulo non ancora pronto`,
    inArrivo: "in arrivo",
  },
  en: {
    gioco: "Game",
    nonPronto: (nome: string) => `${nome} — module not ready yet`,
    inArrivo: "coming soon",
  },
});

/**
 * Selettore del gioco.
 *
 * Sta in cima e dice una cosa sola: in quale gioco ti trovi. Le sezioni sono
 * nella barra laterale, che regge la crescita meglio di una fila orizzontale.
 *
 * I giochi non ancora pronti restano visibili ma non cliccabili: nasconderli
 * farebbe sembrare il sito monogioco, mostrarli come attivi sarebbe una bugia.
 */
export async function GameSwitcher({ game }: { game: string }) {
  const games = listGames();
  const t = TESTI[await getLocale()];

  return (
    <div className="border-b border-rule bg-paper">
      <nav
        aria-label={t.gioco}
        className="mx-auto flex w-full max-w-shell flex-wrap items-center gap-1 px-6 py-2"
      >
        {games.map((entry) =>
          entry.available ? (
            <Link
              key={entry.slug}
              href={`/${entry.slug}`}
              aria-current={entry.slug === game ? "true" : undefined}
              // il gioco scelto e' una lama rossa tagliata, gli altri si
              // accendono di bianco al passaggio: lo stesso gesto della barra laterale
              className={cx(
                "p5-cut px-3.5 py-1 font-display text-[13px] font-extrabold uppercase tracking-[0.02em] transition-colors [font-variation-settings:'wdth'_82]",
                entry.slug === game
                  ? "bg-brand text-white"
                  : "text-ink-2 hover:bg-ink hover:text-paper",
              )}
            >
              {entry.shortName}
            </Link>
          ) : (
            <span
              key={entry.slug}
              title={t.nonPronto(entry.name)}
              className="cursor-not-allowed rounded-sm px-2.5 py-1 text-[13px] text-ink-3/60"
            >
              {entry.shortName}
              <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider">
                {t.inArrivo}
              </span>
            </span>
          ),
        )}
      </nav>
    </div>
  );
}
