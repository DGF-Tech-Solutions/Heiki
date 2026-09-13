/**
 * I colori del gioco, resi leggibili sul fondo chiaro.
 *
 * Il gioco sceglie i suoi colori per un fondo scuro, e sul nostro fondo bianco
 * quasi tutti sbiadiscono. La regola precedente li SCARTAVA quando erano troppo
 * chiari, con l'idea che un valore nero fosse meglio di uno invisibile. Il
 * risultato misurato pero' era che sei colori su otto finivano in nero - valori,
 * termini, bersaglio, cura e testo delle note - e le abilita' si leggevano
 * tutte piatte, senza piu' alcuna evidenza.
 *
 * Quindi non si scarta: si scurisce. La tinta e' l'informazione (l'oro dice
 * "questo e' un valore", l'azzurro "questo e' un termine del gioco") e va
 * conservata anche dove non c'e' niente da approfondire: la marcatura serve
 * alla coerenza della lettura, non solo a chi cerca una definizione.
 *
 * La luminanza percepita e' lineare in R, G e B: moltiplicare i tre canali per
 * k moltiplica la luminanza per k. Basta quindi un fattore solo per portare un
 * colore sotto la soglia senza spostarne la tinta.
 */

/** Oltre questa luminanza un colore non regge sul fondo chiaro. */
const MAX_LUMINANCE = 0.45;

/** Sotto questa differenza fra i canali un colore e' un grigio, non una tinta. */
const GREY_RANGE = 12;

const INK = "#14161c";
const INK_SOFT = "#767d8e";

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function readableColor(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  // I grigi non hanno tinta da salvare, e scurirli darebbe un grigio a caso.
  // Prendono i toni del sito: il bianco marca il bersaglio ed e' l'enfasi piu'
  // forte, quindi inchiostro pieno; l'argento veste le note, che sono
  // informazione di contorno, quindi inchiostro tenue.
  if (Math.max(r, g, b) - Math.min(r, g, b) <= GREY_RANGE) {
    return Math.max(r, g, b) > 200 ? INK : INK_SOFT;
  }

  const current = luminance(r, g, b);
  if (current <= MAX_LUMINANCE) return hex;

  const k = MAX_LUMINANCE / current;
  const channel = (value: number) =>
    Math.round(value * k)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(r)}${channel(g)}${channel(b)}`;
}
