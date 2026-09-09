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
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Il motore di calcolo gira lato client: niente di esso deve finire nel bundle server.
    optimizePackageImports: ["@/lib/engine"],
  },
};

export default nextConfig;
