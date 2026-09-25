import Link from "next/link";
import type { Metadata } from "next";
import { buttonClass, cx, display, eyebrow } from "@/components/ui";
import { listGames } from "@/lib/games/catalog";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Pagina non trovata · GachaZone",
    errore: "Errore 404",
    titolo: "Questa pagina non esiste",
    spiegazione:
      "Può essere un indirizzo scritto a mano, un contenuto rimosso, o un gioco che non abbiamo ancora aperto.",
    tornaAiGiochi: "Torna ai giochi",
    cercala: "Se pensi che dovrebbe esistere, cercala:",
    vaiAllaRicerca: "vai alla ricerca",
  },
  en: {
    titoloPagina: "Page not found · GachaZone",
    errore: "Error 404",
    titolo: "This page doesn't exist",
    spiegazione:
      "It may be a hand-typed address, removed content, or a game we haven't opened yet.",
    tornaAiGiochi: "Back to games",
    cercala: "If you think it should exist, search for it:",
    vaiAllaRicerca: "go to search",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

/**
 * Pagina inesistente.
 *
 * Un 404 che dice solo "non trovato" costringe a tornare indietro col pulsante
 * del browser. Qui si offrono le strade che la persona stava probabilmente
 * cercando, cosi' il vicolo cieco diventa un bivio.
 */
export default async function NotFound() {
  const games = listGames().filter((game) => game.available);
  const t = TESTI[await getLocale()];

  return (
    <main className="mx-auto w-full max-w-[700px] px-6 pt-16 pb-24">
      <p className={eyebrow}>{t.errore}</p>
      <h1 className={cx(display, "mt-3 text-[clamp(30px,5vw,48px)]")}>{t.titolo}</h1>
      <p className="mt-4 text-base text-ink-2">{t.spiegazione}</p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Link href="/" className={buttonClass("primary")}>
          {t.tornaAiGiochi}
        </Link>
        {games.map((game) => (
          <Link key={game.slug} href={`/${game.slug}`} className={buttonClass("outline")}>
            {game.shortName}
          </Link>
        ))}
      </div>

      <p className="mt-8 border-l-[3px] border-brand pl-3.5 text-[13px] text-ink-2">
        {t.cercala}{" "}
        <Link href="/cerca" className="font-semibold text-brand hover:underline">
          {t.vaiAllaRicerca}
        </Link>
        .
      </p>
    </main>
  );
}
