import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GachaZone",
    short_name: "GachaZone",
    description:
      "Schede personaggio, simulazioni di danno verificabili e community per i giochi gacha.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6425ff",
    lang: "it",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
