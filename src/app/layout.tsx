import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

/**
 * Tre ruoli tipografici distinti.
 *
 * Bricolage Grotesque ha un asse di larghezza variabile: i titoli si stringono
 * senza cambiare famiglia. IBM Plex Mono e' riservato ai numeri - in un sito che
 * vende calcoli le cifre devono incolonnarsi, e il mono le distingue dalla prosa
 * a colpo d'occhio.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GachaZone",
  description:
    "Calcolo dei danni, rotazioni e profili per i giochi gacha. Ogni risultato e' una distribuzione, non un numero singolo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bricolage.variable} ${instrument.variable} ${plexMono.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <footer className="foot">
          <div className="shell">
            <p>
              GachaZone non e' affiliato ne' approvato da Netmarble, HoYoverse o Kuro Games. Tutti
              i marchi, i nomi e i contenuti di gioco appartengono ai rispettivi proprietari.
            </p>
            <p className="mono">Motore di calcolo v0.1 · dati di gioco segnaposto</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
