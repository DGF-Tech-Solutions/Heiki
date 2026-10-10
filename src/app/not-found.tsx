import Link from "next/link";
import type { Metadata } from "next";
import { buttonClass, cx, display } from "@/components/ui";
import { listGames } from "@/lib/games/catalog";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Pagina non trovata",
    titolo: "Questa pagina non esiste",
    spiegazione:
      "Può essere un indirizzo scritto a mano, un contenuto rimosso, o un gioco che non abbiamo ancora aperto.",
    tornaAiGiochi: "Torna ai giochi",
    cercala: "Se pensi che dovrebbe esistere, cercala:",
    vaiAllaRicerca: "vai alla ricerca",
  },
  en: {
    titoloPagina: "Page not found",
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
    <main className="relative isolate mx-auto w-full max-w-[700px] overflow-hidden px-6 pt-16 pb-24">
      {/*
        Il numero dell'errore enorme e a contorno dietro il titolo, come il nome
        sul palco della griglia Eroi: prima stava in un'etichetta sopra il titolo (10/10).
      */}
      <p
        aria-hidden
        className="absolute top-8 right-2 -z-10 m-0 font-display text-[clamp(120px,26vw,220px)] leading-none font-black text-transparent [-webkit-text-stroke:2px_color-mix(in_srgb,var(--color-brand)_45%,transparent)] [font-variation-settings:'wdth'_62]"
      >
        404
      </p>
      <h1 className={cx(display, "text-[clamp(36px,6vw,60px)]")}>{t.titolo}</h1>
      <p className="mt-4 max-w-[52ch] text-base text-ink-2">{t.spiegazione}</p>

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

      <p className="p5-corner border border-rule bg-paper-2 px-4 py-3 mt-8 text-[13px] text-ink-2">
        {t.cercala}{" "}
        <Link href="/cerca" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep">
          {t.vaiAllaRicerca}
        </Link>
        .
      </p>
    </main>
  );
}
