/**
 * Il colore delle scritte sulle righe della tier list.
 *
 * Fino al 24/10 le lettere erano sempre bianche, con un'ombra sotto: sull'oro
 * facevano 1,4:1, sul verde 1,9:1, la S sull'arancione 2,9:1 (misurato nella
 * revisione del sito). L'ombra non e' un contorno e non salva niente. Ora
 * l'inchiostro lo decide il fondo: scuro sui colori chiari, chiaro sugli scuri,
 * quello dei due che si stacca di piu'. Vale per ogni colore, anche per quelli
 * delle liste salvate prima del cambio di tavolozza.
 */

/** Inchiostro chiaro: il bianco dei comandi sul rosso, come nel resto del sito. */
export const LIGHT_INK = "#ffffff";
/** Inchiostro scuro: la carta del sito. */
export const DARK_INK = "#0b0a0a";

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminanza relativa WCAG di un `#rrggbb`. */
export function relativeLuminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1, 7), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** Rapporto di contrasto WCAG fra due `#rrggbb` (da 1 a 21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** L'inchiostro che si legge meglio sul colore di una riga. */
export function labelInk(background: string): typeof LIGHT_INK | typeof DARK_INK {
  return contrastRatio(background, LIGHT_INK) >= contrastRatio(background, DARK_INK) ? LIGHT_INK : DARK_INK;
}
