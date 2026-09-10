import Link from "next/link";
import type { Metadata } from "next";
import { buttonClass, cx, display, eyebrow } from "@/components/ui";
import { listGames } from "@/lib/games/catalog";

export const metadata: Metadata = {
  title: "Pagina non trovata · GachaZone",
  robots: { index: false, follow: false },
};

/**
 * Pagina inesistente.
 *
 * Un 404 che dice solo "non trovato" costringe a tornare indietro col pulsante
 * del browser. Qui si offrono le strade che la persona stava probabilmente
 * cercando, cosi' il vicolo cieco diventa un bivio.
 */
export default function NotFound() {
  const games = listGames().filter((game) => game.available);

  return (
    <main className="mx-auto w-full max-w-[700px] px-6 pt-16 pb-24">
      <p className={eyebrow}>Errore 404</p>
      <h1 className={cx(display, "mt-3 text-[clamp(30px,5vw,48px)]")}>
        Questa pagina non esiste
      </h1>
      <p className="mt-4 text-base text-ink-2">
        Può essere un indirizzo scritto a mano, un contenuto rimosso, o un gioco che non abbiamo
        ancora aperto.
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Link href="/" className={buttonClass("primary")}>
          Torna ai giochi
        </Link>
        {games.map((game) => (
          <Link key={game.slug} href={`/${game.slug}`} className={buttonClass("outline")}>
            {game.shortName}
          </Link>
        ))}
      </div>

      <p className="mt-8 border-l-[3px] border-brand pl-3.5 text-[13px] text-ink-2">
        Se pensi che dovrebbe esistere, cercala:{" "}
        <Link href="/cerca" className="font-semibold text-brand hover:underline">
          vai alla ricerca
        </Link>
        .
      </p>
    </main>
  );
}
