/**
 * I colori del gioco, resi leggibili sul fondo del sito.
 *
 * Il gioco sceglie i suoi colori per un fondo SCURO, ed e' il motivo per cui
 * questa funzione ha ribaltato la propria regola insieme al tema. Quando il
 * sito era su carta bianca, quei colori sbiadivano e andavano SCURITI: sei su
 * otto sarebbero finiti neri con la regola ancora precedente, e le abilita' si
 * leggevano tutte piatte. Adesso il fondo e' quello per cui erano nati, e la
 * misura lo dice: dei colori che il gioco usa davvero - #FFAE00 per i valori,
 * #00D5FF per i termini, #00FF00 e #00FF31 per le cure, #FF8000 per i turni -
 * NESSUNO viene toccato. Passano esattamente come il gioco li stampa.
 *
 * Resta da correggere il caso opposto: un colore troppo scuro sparisce nel
 * fondo. Li' si SCHIARISCE, e non moltiplicando i canali - saturerebbero,
 * spostando la tinta verso il bianco di un canale solo - ma mescolando col
 * bianco. Mescolare e' lineare anche nella luminanza, quindi la quantita'
 * esatta si calcola invece di cercarla: per portare `c` a `MIN` serve
 * t = (MIN - c) / (1 - c).
 *
 * La tinta resta l'informazione - l'oro dice "questo e' un valore", l'azzurro
 * "questo e' un termine del gioco" - e va conservata anche dove non c'e'
 * niente da approfondire: la marcatura serve alla coerenza della lettura.
 */

/** Sotto questa luminanza un colore si perde nel fondo scuro. */
const MIN_LUMINANCE = 0.45;

/** Sotto questa differenza fra i canali un colore e' un grigio, non una tinta. */
const GREY_RANGE = 12;

const INK = "#f2f4f8";
const INK_SOFT = "#838b9c";

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function readableColor(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  // I grigi non hanno tinta da salvare, e schiarirli darebbe un grigio a caso.
  // Prendono i toni del sito: il bianco marca il bersaglio ed e' l'enfasi piu'
  // forte, quindi inchiostro pieno; l'argento veste le note, che sono
  // informazione di contorno, quindi inchiostro tenue.
  if (Math.max(r, g, b) - Math.min(r, g, b) <= GREY_RANGE) {
    return Math.max(r, g, b) > 200 ? INK : INK_SOFT;
  }

  const current = luminance(r, g, b);
  if (current >= MIN_LUMINANCE) return hex;

  const t = (MIN_LUMINANCE - current) / (1 - current);
  const channel = (value: number) =>
    Math.round(value + (255 - value) * t)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(r)}${channel(g)}${channel(b)}`;
}
