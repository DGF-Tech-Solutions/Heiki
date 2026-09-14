import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GachaZone",
    short_name: "GachaZone",
    description:
      "Schede personaggio, simulazioni di danno verificabili e community per i giochi gacha.",
    start_url: "/",
    display: "standalone",
    // Gli stessi token di globals.css: `--color-paper` e `--color-brand`.
    // Il fondo qui e' la schermata d'avvio della PWA, e lasciarlo bianco
    // faceva lampeggiare una pagina chiara prima di un sito scuro.
    background_color: "#0f1117",
    theme_color: "#8b5cff",
    lang: "it",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
