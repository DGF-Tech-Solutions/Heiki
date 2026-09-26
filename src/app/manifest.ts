import type { MetadataRoute } from "next";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const DESCRIZIONE = testi({
  it: "Schede degli eroi, dati e meccaniche lette dal gioco, e community per i giochi gacha.",
  en: "Hero pages, data and mechanics read from the game, and community for gacha games.",
});

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  return {
    name: "GachaZone",
    short_name: "GachaZone",
    description: DESCRIZIONE[locale],
    start_url: "/",
    display: "standalone",
    // Gli stessi token di globals.css: `--color-paper` e `--color-brand`.
    // Il fondo qui e' la schermata d'avvio della PWA, e lasciarlo bianco
    // faceva lampeggiare una pagina chiara prima di un sito scuro.
    background_color: "#0f1117",
    theme_color: "#8b5cff",
    lang: locale,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
