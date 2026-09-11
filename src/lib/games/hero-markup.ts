/**
 * Il markup con cui il gioco scrive i propri testi.
 *
 * Tre cose soltanto, e nessuna e' HTML:
 *
 *   \n              va a capo, scritto come due caratteri, non come newline
 *   [b]...[/b]      grassetto
 *   [FFAE00]...[-]  colore, in esadecimale senza cancelletto
 *
 * Il punto delicato sono le parentesi quadre. Nel testo ce ne sono molte che
 * NON sono markup - "[Boar Hat] Tavern", "[The Seven Deadly Sins]", gli epiteti
 * per intero - e trattarle come tali mangerebbe mezzo nome a un eroe su tre.
 * Quindi si riconoscono solo le tre forme esatte qui sopra: tutto il resto
 * resta testo, comprese le quadre.
 *
 * Il risultato e' una struttura, non una stringa: chi rende decide i tag, e
 * niente di cio' che arriva dal gioco finisce mai in dangerouslySetInnerHTML.
 */

export interface TextSegment {
  text: string;
  bold?: boolean;
  /** colore in forma CSS, gia' col cancelletto */
  color?: string;
}

/** Una riga e' una fila di segmenti; il testo intero e' una fila di righe. */
export type TextLine = readonly TextSegment[];

const COLOR = /^\[([0-9A-Fa-f]{6})\]/;
const BOLD_OPEN = "[b]";
const BOLD_CLOSE = "[/b]";
const COLOR_CLOSE = "[-]";

/**
 * Spezza il testo in righe di segmenti.
 *
 * Grassetto e colore si accumulano invece di escludersi: il gioco li annida, e
 * una chiusura riporta allo stato precedente senza toccare l'altro.
 */
export function parseHeroText(raw: string): TextLine[] {
  const lines: TextSegment[][] = [[]];
  let buffer = "";
  let bold = false;
  let color: string | undefined;

  const flush = () => {
    if (buffer === "") return;
    const segment: TextSegment = { text: buffer };
    if (bold) segment.bold = true;
    if (color) segment.color = color;
    lines[lines.length - 1]!.push(segment);
    buffer = "";
  };

  const newline = () => {
    flush();
    lines.push([]);
  };

  let i = 0;
  while (i < raw.length) {
    const rest = raw.slice(i);

    // Il capoverso arriva in due forme: la sequenza letterale di due caratteri,
    // che e' quella vera dei dati, e il newline autentico che compare quando il
    // testo e' gia' passato da qualche altra parte.
    if (rest.startsWith("\\n") || rest.startsWith("\\r\\n")) {
      newline();
      i += rest.startsWith("\\r\\n") ? 4 : 2;
      continue;
    }
    if (raw[i] === "\n") {
      newline();
      i += 1;
      continue;
    }

    if (rest.startsWith(BOLD_OPEN)) {
      flush();
      bold = true;
      i += BOLD_OPEN.length;
      continue;
    }
    if (rest.startsWith(BOLD_CLOSE)) {
      flush();
      bold = false;
      i += BOLD_CLOSE.length;
      continue;
    }
    if (rest.startsWith(COLOR_CLOSE)) {
      flush();
      color = undefined;
      i += COLOR_CLOSE.length;
      continue;
    }

    const hex = COLOR.exec(rest);
    if (hex) {
      flush();
      color = `#${hex[1]}`;
      i += hex[0].length;
      continue;
    }

    buffer += raw[i];
    i += 1;
  }

  flush();
  return lines.filter((line) => line.length > 0);
}

/**
 * Il testo nudo, senza markup.
 *
 * Serve dove una struttura non entra: il titolo della pagina, la descrizione
 * nei metadati, l'attributo title di un collegamento.
 */
export function plainHeroText(raw: string): string {
  return parseHeroText(raw)
    .map((line) => line.map((segment) => segment.text).join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
