import type { NextConfig } from "next";

/**
 * `next dev` e `next build` scrivono entrambi in .next: se girano insieme, la
 * build sovrascrive gli asset del dev server e il browser inizia a ricevere 404
 * su CSS e chunk - la pagina resta senza grafica pur rispondendo 200.
 *
 * NEXT_DIST_DIR permette di dirottare una build di verifica su un'altra
 * cartella mentre il dev server e' acceso:
 *
 *     NEXT_DIST_DIR=.next-check npx next build
 *
 * Senza la variabile il comportamento resta quello standard, quindi il deploy
 * non cambia.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Richiesto dall'immagine Docker: produce .next/standalone, un server
  // autosufficiente senza node_modules. In sviluppo non cambia nulla.
  output: "standalone",
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Il motore di calcolo gira lato client: niente di esso deve finire nel bundle server.
    optimizePackageImports: ["@/lib/engine"],
    // La schermata della verifica della classe viaggia in un'azione del server:
    // il limite di serie (1 MB) e' poco per una schermata del telefono anche
    // ridotta. Il server ne accetta al massimo 3 MB (SCREENSHOT_MAX_BYTES).
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
