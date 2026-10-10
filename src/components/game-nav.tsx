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
    altri: (n: number) => `+${n} in arrivo`,
  },
  en: {
    gioco: "Game",
    nonPronto: (nome: string) => `${nome} — module not ready yet`,
    inArrivo: "coming soon",
    altri: (n: number) => `+${n} coming soon`,
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
  const planned = games.filter((entry) => !entry.available);
  const t = TESTI[await getLocale()];

  return (
    <div className="border-b border-rule bg-paper">
      {/* sul telefono una riga sola che scorre: a capo, i giochi «in arrivo»
          prendevano tre righe sopra ogni pagina */}
      <nav
        aria-label={t.gioco}
        className="mx-auto flex w-full max-w-shell items-center gap-1 overflow-x-auto px-6 py-1.5 whitespace-nowrap [scrollbar-width:none] *:shrink-0"
      >
        {games
          .filter((entry) => entry.available)
          .map((entry) => (
            <Link
              key={entry.slug}
              href={`/${entry.slug}`}
              aria-current={entry.slug === game ? "true" : undefined}
              // il gioco scelto e' una lama rossa tagliata, gli altri si
              // accendono di bianco al passaggio: lo stesso gesto della barra laterale
              className={cx(
                "p5-cut p5-btn px-3.5 py-1 font-display text-[13px] font-extrabold uppercase tracking-[0.02em] [font-variation-settings:'wdth'_82]",
                entry.slug === game
                  ? "[--btn-bg:var(--color-brand)] [--btn-fg:#fff] [--btn-hi:var(--color-brand)] [--btn-hi-fg:#fff]"
                  : "[--btn-bg:transparent]",
              )}
            >
              {entry.shortName}
            </Link>
          ))}
        {/*
          I giochi in arrivo in una voce sola (10/10): prima erano quattro nomi
          spenti su ogni pagina, e sul telefono la riga si tagliava a meta' di un
          nome. Porta alla home, che li elenca.
        */}
        {planned.length > 0 ? (
          <Link
            href="/"
            title={planned.map((entry) => entry.name).join(", ")}
            className="ml-2 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3 hover:text-ink"
          >
            {t.altri(planned.length)}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
