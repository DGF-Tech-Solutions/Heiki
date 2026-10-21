/**
 * Indirizzo pubblico del sito.
 *
 * Serve a sitemap, robots e metadati di condivisione, che hanno bisogno di URL
 * assoluti. Si legge dall'ambiente perche' cambia fra sviluppo, anteprima e
 * produzione, e sbagliarlo significa pubblicare una sitemap che punta a
 * localhost.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel espone il proprio host senza schema.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

export const SITE_NAME = "Heiki";
