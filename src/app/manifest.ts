import type { MetadataRoute } from "next";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { getTheme } from "@/lib/theme/server";
import { THEME_COLORS } from "@/lib/theme/themes";

const DESCRIZIONE = testi({
  it: "Schede degli eroi, dati e meccaniche lette dal gioco, e community per i giochi gacha.",
  en: "Hero pages, data and mechanics read from the game, and community for gacha games.",
});

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const colori = THEME_COLORS[await getTheme()];
  return {
    name: "Heiki",
    short_name: "Heiki",
    description: DESCRIZIONE[locale],
    start_url: "/",
    display: "standalone",
    // Il fondo qui e' la schermata d'avvio della PWA, e lasciarlo bianco
    // faceva lampeggiare una pagina chiara prima di un sito scuro. I colori
    // sono quelli del tema di chi installa (themes.ts, controllati sul CSS):
    // fino all'11/10 erano scritti a mano, ed erano ancora il fondo blu e il
    // viola di prima del 27/09. La barra prende il fondo, come <meta
    // name="theme-color"> nel layout: e' il seguito dell'intestazione.
    background_color: colori.paper,
    theme_color: colori.paper,
    lang: locale,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
