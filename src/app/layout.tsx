import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Atkinson_Hyperlegible_Next, DM_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { CookieBanner } from "@/components/cookie-banner";
import { LocaleProvider } from "@/lib/i18n/client";
import { ogLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

/**
 * Tre ruoli tipografici distinti.
 *
 * Archivo ha un asse di larghezza variabile: i titoli si stringono e si fanno
 * pesanti senza cambiare famiglia, e sembrano copertine sportive invece che
 * intestazioni di documento. Il testo lungo e' in Atkinson Hyperlegible Next,
 * disegnato per la leggibilita' (I, l e 1 non si confondono; prima era Public
 * Sans, che sul fondo a retino del tema Persona si leggeva peggio). DM Mono e'
 * riservato ai numeri: in un sito che vende calcoli le cifre devono
 * incolonnarsi, e il monospaziato le distingue subito dalla prosa.
 */
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const bodyFace = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const TESTI = testi({
  it: {
    titolo: `${SITE_NAME} — schede, dati e community per i giochi gacha`,
    descrizione: "Schede degli eroi, dati e meccaniche lette dal gioco, e community per i giochi gacha.",
    salta: "Salta al contenuto",
    collegamenti: "Collegamenti del sito",
    footer: [
      { href: "/premium", label: "Premium" },
      { href: "/legale/privacy", label: "Privacy" },
      { href: "/legale/termini", label: "Termini" },
      { href: "/legale/cookie", label: "Cookie" },
    ],
    affiliazione: `${SITE_NAME} non è affiliato né approvato da Netmarble, HoYoverse o Kuro Games. Tutti i marchi, i nomi e i contenuti di gioco appartengono ai rispettivi proprietari.`,
  },
  en: {
    titolo: `${SITE_NAME} — pages, data and community for gacha games`,
    descrizione: "Hero pages, data and mechanics read from the game, and community for gacha games.",
    salta: "Skip to content",
    collegamenti: "Site links",
    footer: [
      { href: "/premium", label: "Premium" },
      { href: "/legale/privacy", label: "Privacy" },
      { href: "/legale/termini", label: "Terms" },
      { href: "/legale/cookie", label: "Cookies" },
    ],
    affiliazione: `${SITE_NAME} is not affiliated with or endorsed by Netmarble, HoYoverse or Kuro Games. All trademarks, names and game content belong to their respective owners.`,
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // La lingua viene dal cookie, e il layout la passa ai componenti client:
  // la pagina arriva gia' nella lingua scelta (vedi src/lib/i18n/locale.ts)
  const locale = await getLocale();
  const t = TESTI[locale];

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${bodyFace.variable} ${dmMono.variable}`}
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

          <footer className="border-t-[3px] border-brand bg-paper pt-7 pb-10 text-xs text-ink-3">
            <div className="mx-auto w-full max-w-shell px-6">
              <nav aria-label={t.collegamenti} className="mb-4 flex flex-wrap gap-4">
                {t.footer.map((link) => (
                  <Link key={link.href} href={link.href} className="font-medium hover:text-brand">
                    {link.label}
                  </Link>
                ))}
              </nav>

              <p className="m-0 max-w-[76ch]">{t.affiliazione}</p>
            </div>
          </footer>

          <CookieBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
