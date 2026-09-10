import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, DM_Mono, Public_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { CookieBanner } from "@/components/cookie-banner";
import { SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

/**
 * Tre ruoli tipografici distinti.
 *
 * Archivo ha un asse di larghezza variabile: i titoli si stringono e si fanno
 * pesanti senza cambiare famiglia, e sembrano copertine sportive invece che
 * intestazioni di documento. Public Sans regge il testo lungo. DM Mono e'
 * riservato ai numeri: in un sito che vende calcoli le cifre devono
 * incolonnarsi, e il monospaziato le distingue subito dalla prosa.
 */
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public", display: "swap" });
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Serve agli URL assoluti dei metadati di condivisione: senza, Next li
  // costruisce relativi e le anteprime sui social restano vuote.
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — build, calcoli e community per i giochi gacha`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Schede personaggio, simulazioni di danno verificabili e community per i giochi gacha.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "it_IT",
  },
  twitter: { card: "summary_large_image" },
};

const FOOTER_LINKS = [
  { href: "/premium", label: "Premium" },
  { href: "/legale/privacy", label: "Privacy" },
  { href: "/legale/termini", label: "Termini" },
  { href: "/legale/cookie", label: "Cookie" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${archivo.variable} ${publicSans.variable} ${dmMono.variable}`}
    >
      <body>
        {/* Chi naviga da tastiera altrimenti deve attraversare tutta
            l'intestazione a ogni pagina prima di arrivare al contenuto. */}
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-card focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-paper"
        >
          Salta al contenuto
        </a>

        <SiteHeader />

        <div id="contenuto">{children}</div>

        <footer className="border-t-2 border-ink bg-paper-2 pt-7 pb-10 text-xs text-ink-3">
          <div className="mx-auto w-full max-w-[1200px] px-6">
            <nav aria-label="Collegamenti del sito" className="mb-4 flex flex-wrap gap-4">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="font-medium hover:text-brand">
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="m-0 mb-1.5 max-w-[76ch]">
              {SITE_NAME} non e&apos; affiliato ne&apos; approvato da Netmarble, HoYoverse o Kuro
              Games. Tutti i marchi, i nomi e i contenuti di gioco appartengono ai rispettivi
              proprietari.
            </p>
            <p className="m-0 font-mono">Motore v0.1 · dati di gioco segnaposto</p>
          </div>
        </footer>

        <CookieBanner />
      </body>
    </html>
  );
}
