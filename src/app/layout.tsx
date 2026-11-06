import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Archivo, Atkinson_Hyperlegible_Next } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { BackToTop } from "@/components/back-to-top";
import { CookieBanner } from "@/components/cookie-banner";
import { CONSENT_REQUIRED } from "@/lib/consent";
import { LEGAL_DOCUMENTS } from "@/lib/legal/documents";
import { OPERATOR } from "@/lib/legal/operator";
import { gameGroups, listGames } from "@/lib/games/catalog";
import { LocaleProvider } from "@/lib/i18n/client";
import { ogLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { SITE_NAME, siteUrl } from "@/lib/site";
import { getTheme } from "@/lib/theme/server";
import { THEME_COLORS } from "@/lib/theme/themes";
import "./globals.css";
import "./pulito.css";

/**
 * Due ruoli tipografici.
 *
 * Archivo ha un asse di larghezza variabile: i titoli si stringono e si fanno
 * pesanti senza cambiare famiglia, mentre comandi e menu restano in tondo a peso
 * medio. Il testo lungo e' in Atkinson Hyperlegible Next, disegnato per la
 * leggibilita' (I, l e 1 non si confondono).
 *
 * I numeri fino al 06/11 avevano un monospaziato loro (Geist Mono): era un terzo
 * carattere su ogni pagina. Ora sono Archivo con le cifre tabulari, che si incolonnano
 * lo stesso (`--font-mono` in globals.css).
 *
 * `axes: ["wdth"]`: next/font di suo scarica solo il peso, e fino al 10/10 il
 * file servito aveva `font-stretch: 100%`. Tutti i `'wdth' 75-85` dei titoli
 * non stringevano niente: i titoli «stretti» erano larghi quanto il testo.
 */
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });
const bodyFace = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});
const TESTI = testi({
  it: {
    titolo: `${SITE_NAME}: schede, dati e community per i giochi gacha`,
    descrizione: "Schede degli eroi, dati e meccaniche lette dal gioco, e community per i giochi gacha.",
    salta: "Salta al contenuto",
    collegamenti: "Collegamenti del sito",
    affiliazione: `${SITE_NAME} è un sito di fan, gratuito e non ufficiale: non è affiliato, sponsorizzato né approvato da Netmarble, Kodansha o dagli altri titolari dei diritti dei giochi citati. Nomi, marchi, immagini e testi dei giochi appartengono ai rispettivi titolari.`,
    partitaIva: "P.IVA",
  },
  en: {
    titolo: `${SITE_NAME}: hero pages, data and community for gacha games`,
    descrizione: "Hero pages, data and mechanics read from the game, and community for gacha games.",
    salta: "Skip to content",
    collegamenti: "Site links",
    affiliazione: `${SITE_NAME} is a free, unofficial fan site: it is not affiliated with, sponsored or endorsed by Netmarble, Kodansha or the other rights holders of the games mentioned. Game names, trademarks, images and text belong to their respective owners.`,
    partitaIva: "VAT",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = TESTI[locale];
  return {
    // Serve agli URL assoluti dei metadati di condivisione: senza, Next li
    // costruisce relativi e le anteprime sui social restano vuote.
    metadataBase: new URL(siteUrl()),
    title: {
      default: t.titolo,
      template: `%s · ${SITE_NAME}`,
    },
    description: t.descrizione,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: ogLocale(locale),
    },
    twitter: { card: "summary_large_image" },
  };
}

/**
 * La barra del browser sul telefono prende il fondo del tema invece del suo
 * grigio, e sembra il seguito dell'intestazione. `colorScheme` dice al browser
 * che il sito e' scuro prima che arrivi il CSS: niente lampo bianco.
 */
export async function generateViewport(): Promise<Viewport> {
  return { themeColor: THEME_COLORS[await getTheme()].paper, colorScheme: "dark" };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // La lingua viene dal cookie, e il layout la passa ai componenti client:
  // la pagina arriva gia' nella lingua scelta (vedi src/lib/i18n/locale.ts).
  // Il tema pure: `data-theme` e' gia' nell'HTML, i colori giusti dal primo disegno
  const locale = await getLocale();
  const theme = await getTheme();
  const t = TESTI[locale];

  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${archivo.variable} ${bodyFace.variable}`}
    >
      <body>
        <LocaleProvider locale={locale}>
          {/* Chi naviga da tastiera altrimenti deve attraversare tutta
              l'intestazione a ogni pagina prima di arrivare al contenuto. */}
          <a
            href="#contenuto"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-card focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-paper"
          >
            {t.salta}
          </a>

          <SiteHeader />

          <div id="contenuto">{children}</div>

          {/*
            Il pie' di pagina ripete le sezioni dei giochi (10/10): prima aveva solo
            le voci legali, e da fondo pagina non si andava da nessuna parte. Sul
            telefono lascia lo spazio della barra in basso.
          */}
          <footer className="border-t-[3px] border-mark bg-paper pt-8 pb-10 text-xs text-ink-3 max-lg:pb-24">
            <div className="mx-auto w-full max-w-shell px-6">
              {listGames()
                .filter((game) => game.available)
                .map((game) => (
                  <nav key={game.slug} aria-label={game.name} className="mb-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
                    {gameGroups(game.slug, locale).map((group) => (
                      <div key={group.label}>
                        <p className="m-0 mb-2 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">{group.label}</p>
                        <ul className="m-0 grid list-none gap-1 p-0">
                          {group.items.map((item) => (
                            <li key={item.path}>
                              <Link
                                href={item.href}
                                className="font-display text-[13px] font-extrabold uppercase text-ink-2 [font-variation-settings:'wdth'_85] hover:text-brand-deep"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                ))}
              {/* i documenti legali, coi nomi e l'ordine di LEGAL_DOCUMENTS (gli stessi delle schede di /legale);
                  «Premium» tolto il 25/10 finché non si può pagare: la pagina resta raggiungibile */}
              <nav aria-label={t.collegamenti} className="mb-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-rule-2 pt-4">
                {LEGAL_DOCUMENTS.map((doc) => (
                  // sul telefono ogni voce e' alta 44px: andando a capo, zone di tocco
                  // sovrapposte (tapArea) si ruberebbero il dito fra una riga e l'altra
                  <Link key={doc.href} href={doc.href} className="inline-flex items-center font-medium hover:text-brand-deep pointer-coarse:min-h-11">
                    {doc.label[locale]}
                  </Link>
                ))}
              </nav>

              <p className="m-0 max-w-[76ch]">{t.affiliazione}</p>
              {/* la partita IVA va nella home page del sito (art. 35 del D.P.R. 633/1972): nel piè di pagina sta in tutte */}
              {OPERATOR.name && OPERATOR.vatNumber ? (
                <p className="m-0 mt-2">
                  © {new Date().getFullYear()} {OPERATOR.name} · {t.partitaIva} {OPERATOR.vatNumber}
                </p>
              ) : null}
            </div>
          </footer>

          {/* il banner c'e' solo quando il sito ha qualcosa che chiede consenso: oggi no (vedi consent.ts) */}
          {CONSENT_REQUIRED ? <CookieBanner /> : null}
          <BackToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
