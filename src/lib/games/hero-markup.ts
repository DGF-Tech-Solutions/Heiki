/**
 * Il markup con cui il gioco scrive i propri testi.
 *
 * Quattro cose soltanto, e nessuna e' HTML:
 *
 *   \n              va a capo, scritto come due caratteri, non come newline
 *   [b]...[/b]      grassetto
 *   [i]...[/i]      corsivo, che il gioco usa per le note esplicative
 *   [FFAE00]...[-]  colore, in esadecimale senza cancelletto
 *
 * Il punto delicato sono le parentesi quadre. Nel testo ce ne sono molte che
 * NON sono markup - "[Boar Hat] Tavern", "[The Seven Deadly Sins]", gli epiteti
 * per intero - e trattarle come tali mangerebbe mezzo nome a un eroe su tre.
 * Quindi si riconoscono solo le quattro forme esatte qui sopra: tutto il resto
 * resta testo, comprese le quadre.
 *
 * Il risultato e' una struttura, non una stringa: chi rende decide i tag, e
 * niente di cio' che arriva dal gioco finisce mai in dangerouslySetInnerHTML.
 */

export interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  /** colore in forma CSS, gia' col cancelletto */
  color?: string;
}

/** Una riga e' una fila di segmenti; il testo intero e' una fila di righe. */
export type TextLine = readonly TextSegment[];

const COLOR = /^\[([0-9A-Fa-f]{6})\]/;
const BOLD_OPEN = "[b]";
const BOLD_CLOSE = "[/b]";
const ITALIC_OPEN = "[i]";
const ITALIC_CLOSE = "[/i]";
const COLOR_CLOSE = "[-]";

/**
 * Spezza il testo in righe di segmenti.
 *
 * Grassetto, corsivo e colore si accumulano invece di escludersi: il gioco li
 * annida, e una chiusura riporta allo stato precedente senza toccare gli altri.
 */
function parseLines(raw: string): TextSegment[][] {
  const lines: TextSegment[][] = [[]];
  let buffer = "";
  let bold = false;
  let italic = false;
  let color: string | undefined;

  const flush = () => {
    if (buffer === "") return;
    const segment: TextSegment = { text: buffer };
    if (bold) segment.bold = true;
    if (italic) segment.italic = true;
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
    if (rest.startsWith(ITALIC_OPEN)) {
      flush();
      italic = true;
      i += ITALIC_OPEN.length;
      continue;
    }
    if (rest.startsWith(ITALIC_CLOSE)) {
      flush();
      italic = false;
      i += ITALIC_CLOSE.length;
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
  return lines;
}

/**
 * Le righe da rendere: quelle vuote non servono a chi disegna.
 *
 * La versione non filtrata resta privata perche' serve a una cosa sola -
 * sapere dove finisce un capoverso - e l'unico a chiederlo e' splitHeroNotes.
 */
export function parseHeroText(raw: string): TextLine[] {
  return parseLines(raw).filter((line) => line.length > 0);
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

/** Il carattere con cui il gioco apre una nota che spiega un termine. */
const NOTE_MARK = "※";

/**
 * La stessa nota aperta con l'asterisco: "*Evasione: immune ad Attacco...".
 *
 * Succedeva nei testi italiani di 7dshub, in 16 ranghi su 4.812, dove gli stessi
 * ranghi in inglese portano ※. Nei testi del client, dal 25/09, le note italiane
 * hanno tutte ※: 0 con l'asterisco in carte, passive, abilita' speciali e
 * reliquie il 26/09. La regola resta, innocua, per una fonte che lo usasse
 * ancora. Vale solo in testa alla riga e seguito da un
 * nome e dai due punti: un asterisco in mezzo alla frase, o una riga che parte
 * con l'asterisco senza nominare un termine, resta testo. Il nome ha un tetto
 * di lunghezza perche' i termini sono nomi, non frasi: "*" seguito da due righe
 * di prosa con dei due punti in fondo non e' una definizione.
 *
 * Restano fuori le 15 note italiane che il gioco scrive senza nessuna marca
 * ("Solidificazione: +30% Resistenza..."): senza marca non si distinguono da un
 * effetto che nomina un termine, e restano nel corpo.
 */
const ASTERISK_NOTE = /^\*[^\s*:][^:]{0,60}:/;

export interface SplitHeroText {
  /** l'effetto vero e proprio */
  body: TextLine[];
  /** le note che spiegano i termini usati sopra */
  notes: TextLine[];
}

/**
 * Separa l'effetto dalle note che lo spiegano.
 *
 * Il gioco chiude quasi ogni abilita' con una nota che definisce i termini
 * usati - "※Flying Sword: 5x Pierce Rate Increase". E' informazione buona, ma
 * e' ripetuta IDENTICA in ogni rango della stessa carta: tre volte per una
 * carta, sei per un'ultimate. Letta di fila, la ripetizione e' piu' lunga degli
 * effetti che dovrebbe spiegare.
 *
 * Separarle permette di mostrare i ranghi (dove cambia solo un numero) e le
 * definizioni (dove non cambia niente) una volta ciascuno.
 *
 * UNA NOTA PUO' OCCUPARE PIU' RIGHE, e succede spesso: 770 righe su 3.322,
 * quasi un blocco su quattro. Quella di Gawain apre con "※Sunfire: ..." e
 * prosegue sulla riga dopo con "Damage dealt +100% against...". Fermarsi alla
 * riga che porta la marca lascerebbe quel seguito in mezzo agli effetti, dove
 * si legge come una regola che vale sempre invece che come parte della
 * definizione. Il blocco quindi continua fino alla riga vuota, che nel testo
 * del gioco e' il confine fra un capoverso e l'altro.
 */
export function splitHeroNotes(raw: string): SplitHeroText {
  const body: TextLine[] = [];
  const notes: TextLine[] = [];
  let dentroLaNota = false;

  for (const line of parseLines(raw)) {
    const plain = line
      .map((segment) => segment.text)
      .join("")
      .trim();

    if (plain === "") {
      dentroLaNota = false;
      continue;
    }
    if (plain.startsWith(NOTE_MARK) || ASTERISK_NOTE.test(plain)) {
      dentroLaNota = true;
    } else if (!dentroLaNota) {
      body.push(line);
      continue;
    }
    notes.push(line);
  }

  return { body, notes };
}

/** L'azzurro con cui il gioco evidenzia i termini: meccaniche, razze, caratteristiche. */
const TERM_COLOR = "#00D5FF";

/** Un pezzo di riga: un segmento qualunque, o una parola blu intera. */
export type LinePiece =
  | { readonly kind: "text"; readonly segment: TextSegment }
  | { readonly kind: "term"; readonly segments: readonly TextSegment[] };

/**
 * I pezzi di una riga, con le parole blu raggruppate.
 *
 * Una parola blu del gioco puo' arrivare in piu' segmenti: un grassetto o un
 * corsivo nel mezzo spezza il segmento senza chiudere il colore. Per il sito e'
 * una parola sola, e si clicca tutta insieme (26/09: le parole blu della scheda
 * aprono l'elenco degli eroi legati). Segmenti blu consecutivi fanno un termine.
 */
export function groupTerms(line: TextLine): LinePiece[] {
  const pieces: LinePiece[] = [];
  let run: TextSegment[] = [];
  const close = () => {
    if (run.length > 0) pieces.push({ kind: "term", segments: run });
    run = [];
  };
  for (const segment of line) {
    if (segment.color?.toUpperCase() === TERM_COLOR) {
      run.push(segment);
      continue;
    }
    close();
    pieces.push({ kind: "text", segment });
  }
  close();
  return pieces;
}

/**
 * Le parole blu del corpo di un testo (senza le note), in ordine, come testo.
 *
 * E' la numerazione su cui si legano le parole alla loro spiegazione: l'import
 * (scripts/import-hero-terms.mts) la conta sul testo inglese, la pagina sullo
 * stesso testo o sulla sua traduzione, e le due devono contare nello stesso
 * modo. Per questo sta qui, accanto al parser, e non in due copie.
 */
export function termWords(raw: string): string[] {
  return splitHeroNotes(raw).body.flatMap((line) =>
    groupTerms(line).flatMap((piece) =>
      piece.kind === "term" ? [piece.segments.map((segment) => segment.text).join("").trim()] : [],
    ),
  );
}

/**
 * Le note di piu' testi, ciascuna una volta sola.
 *
 * Si confronta il testo nudo e non la struttura: fra un rango e l'altro puo'
 * cambiare un tag di colore senza che cambi una parola, e due note identiche a
 * leggersi vanno mostrate una volta anche se differiscono di un tag.
 */
export function collectHeroNotes(texts: readonly string[]): TextLine[] {
  const seen = new Set<string>();
  const notes: TextLine[] = [];

  for (const raw of texts) {
    for (const line of splitHeroNotes(raw).notes) {
      const key = line
        .map((segment) => segment.text)
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      if (key === "" || seen.has(key)) continue;
      seen.add(key);
      notes.push(line);
    }
  }

  return notes;
}
