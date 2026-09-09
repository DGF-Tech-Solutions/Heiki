import type { Metadata } from "next";
import { Archivo, DM_Mono, Public_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
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
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GachaZone — quanto fa male davvero la tua squadra",
  description:
    "Simula la tua squadra migliaia di volte e scopri quanto danno fa, quanto spesso, e se regge il piano. Build, rotazioni e numeri verificabili.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${archivo.variable} ${publicSans.variable} ${dmMono.variable}`}
    >
      <body>
        <SiteHeader />
        {children}
        <footer className="border-t-2 border-ink bg-paper-2 px-0 pt-7 pb-10 text-xs text-ink-3">
          <div className="mx-auto w-full max-w-[1200px] px-6">
            <p className="m-0 mb-1.5 max-w-[76ch]">
              GachaZone non e&apos; affiliato ne&apos; approvato da Netmarble, HoYoverse o Kuro
              Games. Tutti i marchi, i nomi e i contenuti di gioco appartengono ai rispettivi
              proprietari.
            </p>
            <p className="m-0 font-mono">Motore v0.1 · dati di gioco segnaposto</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
