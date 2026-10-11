/**
 * Markdown, sottoinsieme deliberato.
 *
 * Le guide le scrivono le persone, e quel testo finisce nelle pagine viste da
 * tutti. Due strade: prendere una libreria che converte markdown in HTML e
 * iniettarlo con dangerouslySetInnerHTML, oppure trasformare il testo in una
 * struttura ad albero e lasciare che React costruisca gli elementi.
 *
 * Qui si e' scelta la seconda. Il motivo non e' il peso della dipendenza: e'
 * che con la prima ogni HTML scritto dall'autore diventa HTML eseguito, e
 * bastano un <script> o un onerror per prendersi la sessione di chi legge. Con
 * l'albero non esiste un punto in cui del testo diventa markup: gli elementi li
 * sceglie questo file, da un elenco chiuso.
 *
 * Il prezzo e' che il markdown supportato e' un sottoinsieme. E' scritto nella
 * pagina di scrittura, cosi' nessuno scopre a pubblicazione avvenuta che la sua
 * tabella non compare.
 */

export type Inline =
  | { kind: "text"; value: string }
  | { kind: "strong"; value: string }
  | { kind: "em"; value: string }
  | { kind: "code"; value: string }
  | { kind: "link"; value: string; href: string };

export type Block =
  | { kind: "heading"; level: 2 | 3; text: Inline[] }
  | { kind: "paragraph"; text: Inline[] }
  | { kind: "list"; ordered: boolean; items: Inline[][] }
  | { kind: "quote"; text: Inline[] }
  | { kind: "code"; value: string }
  | { kind: "rule" };

/* -------------------------------------------------------------- inline -- */

/**
 * Il collegamento ha i quantificatori limitati e non ammette "[" ne' nel testo
 * ne' nell'indirizzo.
 *
 * Fino all'11/10 era `\[[^\]\n]+\]\([^)\s]+\)`: da ogni "[" il motore scorreva
 * fino in fondo alla riga cercando la chiusura, e una riga di sole "[" costava
 * un numero di passi pari al quadrato della lunghezza. 60.000 "[" tenevano il
 * server fermo 4 secondi per una sola analisi, e la pagina della guida ne
 * faceva due. Ora la scansione partita da una "[" si ferma alla "[" successiva,
 * quindi le scansioni non si sovrappongono e il costo cresce con la lunghezza
 * del testo, non col suo quadrato. I limiti (200 e 500 caratteri) sono un
 * tetto in piu': nessun collegamento vero li sfiora.
 */
const INLINE_PATTERN =
  /(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(`[^`\n]+`)|(\[[^[\]\n]{1,200}\]\([^)\s[]{1,500}\))/g;

/** Origine fittizia su cui si risolvono i percorsi interni per controllarli. */
const INTERNAL_ORIGIN = "https://x.invalid";

/**
 * Barra rovesciata e caratteri di controllo. Il browser li "corregge" prima di
 * seguire il collegamento: "\" diventa "/" e tabulazioni e a capo spariscono,
 * quindi "/\evil.com" e "/<TAB>/evil.com" diventano "//evil.com", che porta
 * fuori dal sito.
 */
const UNSAFE_PATH_CHARS = /[\\\x00-\x1f\x7f]/;

/**
 * Sono ammessi solo indirizzi http(s) e percorsi interni.
 *
 * Il motivo e' `javascript:`: un collegamento con quello schema esegue codice
 * al clic, e passerebbe qualunque controllo fatto sul solo testo. Anche `data:`
 * resta fuori, perche' permette di servire una pagina arbitraria da un
 * indirizzo che sembra interno.
 *
 * Un percorso interno non si riconosce dal primo carattere. Fino all'11/10
 * bastava cominciare con "/" e non con "//", e "/\evil.com" passava: il
 * browser lo apre come https://evil.com, e la pagina lo rendeva come
 * collegamento interno. Ora il percorso si risolve davvero, su un'origine
 * fittizia, e vale solo se ci resta; si restituisce la forma normalizzata,
 * quella che il browser seguira', non il testo scritto.
 */
export function safeHref(raw: string): string | null {
  const value = raw.trim();
  if (value.length === 0) return null;

  if (value.startsWith("/")) {
    if (UNSAFE_PATH_CHARS.test(value)) return null;
    try {
      const url = new URL(value, INTERNAL_ORIGIN);
      if (url.origin !== INTERNAL_ORIGIN) return null;
      const path = `${url.pathname}${url.search}${url.hash}`;
      // "/a/..//evil.com" resta sull'origine ma si normalizza in "//evil.com",
      // che scritto in un href torna a essere un indirizzo esterno.
      return path.startsWith("//") ? null : path;
    } catch {
      return null;
    }
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Se un indirizzo gia' passato da safeHref e' un percorso del sito. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function parseInline(source: string): Inline[] {
  const out: Inline[] = [];
  let cursor = 0;

  for (const match of source.matchAll(INLINE_PATTERN)) {
    const at = match.index;
    if (at === undefined) continue;

    if (at > cursor) out.push({ kind: "text", value: source.slice(cursor, at) });

    const token = match[0];
    if (token.startsWith("**")) {
      out.push({ kind: "strong", value: token.slice(2, -2) });
    } else if (token.startsWith("`")) {
      out.push({ kind: "code", value: token.slice(1, -1) });
    } else if (token.startsWith("[")) {
      const split = token.indexOf("](");
      const label = token.slice(1, split);
      const href = safeHref(token.slice(split + 2, -1));
      // Un collegamento con indirizzo rifiutato non sparisce: resta il testo.
      // Cancellarlo farebbe perdere una parola della frase senza dire perche'.
      if (href) out.push({ kind: "link", value: label, href });
      else out.push({ kind: "text", value: label });
    } else {
      out.push({ kind: "em", value: token.slice(1, -1) });
    }

    cursor = at + token.length;
  }

  if (cursor < source.length) out.push({ kind: "text", value: source.slice(cursor) });
  return out;
}

/* --------------------------------------------------------------- blocchi -- */

const ORDERED = /^(\d+)[.)]\s+(.*)$/;

/**
 * Divide il testo in blocchi.
 *
 * L'analisi e' riga per riga e senza ricorsione: gli elenchi annidati non sono
 * supportati di proposito. In una guida servono raramente, e ammetterli
 * significherebbe gestire l'indentazione ambigua di chi scrive a mano.
 */
export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];
  let code: string[] | null = null;

  function flushParagraph(): void {
    if (paragraph.length === 0) return;
    blocks.push({ kind: "paragraph", text: parseInline(paragraph.join(" ").trim()) });
    paragraph = [];
  }

  function flushList(): void {
    if (!list) return;
    blocks.push({
      kind: "list",
      ordered: list.ordered,
      items: list.items.map((item) => parseInline(item)),
    });
    list = null;
  }

  function flushQuote(): void {
    if (quote.length === 0) return;
    blocks.push({ kind: "quote", text: parseInline(quote.join(" ").trim()) });
    quote = [];
  }

  function flushAll(): void {
    flushParagraph();
    flushList();
    flushQuote();
  }

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Il blocco di codice ha la precedenza su tutto: dentro, un "- " e' testo.
    if (line.trim().startsWith("```")) {
      if (code === null) {
        flushAll();
        code = [];
      } else {
        blocks.push({ kind: "code", value: code.join("\n") });
        code = null;
      }
      continue;
    }
    if (code !== null) {
      code.push(raw);
      continue;
    }

    if (line.trim().length === 0) {
      flushAll();
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushAll();
      blocks.push({ kind: "rule" });
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading?.[1] && heading[2] !== undefined) {
      flushAll();
      blocks.push({
        kind: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        text: parseInline(heading[2].trim()),
      });
      continue;
    }

    // Un solo # diventa livello 2: il titolo di livello 1 della pagina e' il
    // titolo della guida, e due h1 confondono i lettori di schermo.
    const bigHeading = /^#\s+(.*)$/.exec(line);
    if (bigHeading?.[1] !== undefined) {
      flushAll();
      blocks.push({ kind: "heading", level: 2, text: parseInline(bigHeading[1].trim()) });
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quote.push(line.slice(2));
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet?.[1] !== undefined) {
      flushParagraph();
      flushQuote();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const ordered = ORDERED.exec(line);
    if (ordered?.[2] !== undefined) {
      flushParagraph();
      flushQuote();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[2]);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  }

  // Un blocco di codice mai chiuso non deve far perdere il testo che contiene.
  if (code !== null) blocks.push({ kind: "code", value: code.join("\n") });
  flushAll();

  return blocks;
}

/* ---------------------------------------------------------------- indice -- */

export interface Heading {
  id: string;
  level: 2 | 3;
  label: string;
}

/** Testo piano di una sequenza inline: serve per indice e anteprime. */
export function plainText(text: readonly Inline[]): string {
  return text.map((part) => part.value).join("");
}

/**
 * Ancore stabili e senza collisioni.
 *
 * Stabili perche' derivano dal testo: se qualcuno condivide il collegamento a
 * una sezione, quel collegamento continua a funzionare dopo una modifica altrove
 * nella pagina. Il suffisso numerico scatta solo quando due titoli coincidono.
 */
export function tableOfContents(blocks: readonly Block[]): Heading[] {
  // `taken` tiene tutte le ancore gia' date, non solo le basi: "## Note",
  // "## Note" e "## Note 2" davano due volte "note-2". `next` riparte
  // dall'ultimo suffisso usato per quella base, cosi' mille titoli uguali non
  // ricominciano a contare da capo ogni volta.
  const taken = new Set<string>();
  const next = new Map<string, number>();

  return blocks
    .filter((block): block is Extract<Block, { kind: "heading" }> => block.kind === "heading")
    .map((block) => {
      const label = plainText(block.text);
      const base = slugify(label) || "sezione";
      let suffix = next.get(base) ?? 1;
      let id = suffix === 1 ? base : `${base}-${suffix}`;
      while (taken.has(id)) {
        suffix += 1;
        id = `${base}-${suffix}`;
      }
      next.set(base, suffix);
      taken.add(id);
      return { id, level: block.level, label };
    });
}

/**
 * Prefisso delle ancore dei titoli nella pagina.
 *
 * L'ancora deriva dal testo dell'autore, e senza prefisso un titolo come
 * "## Main" o "## Contenuto" darebbe a un h2 lo stesso id di un elemento della
 * pagina: il collegamento dell'indice porterebbe altrove, e uno script che
 * cerca quell'id troverebbe il titolo della guida.
 */
export const HEADING_ANCHOR_PREFIX = "g-";

export interface MarkdownDocument {
  blocks: Block[];
  /** un elemento per ogni blocco "heading", nello stesso ordine, con l'ancora gia' prefissata */
  headings: Heading[];
}

/**
 * Blocchi e indice da una sola analisi.
 *
 * La pagina della guida analizzava il testo due volte, una per l'indice e una
 * per il corpo: chi resta su questa funzione paga l'analisi una volta sola.
 */
export function parseDocument(source: string): MarkdownDocument {
  const blocks = parseMarkdown(source);
  const headings = tableOfContents(blocks).map((heading) => ({
    ...heading,
    id: `${HEADING_ANCHOR_PREFIX}${heading.id}`,
  }));
  return { blocks, headings };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    // NFD separa la lettera dal segno diacritico, cosi' il segno si toglie con
    // un intervallo unico invece di una tabella di sostituzioni. L'intervallo e'
    // scritto con le sequenze di escape: quei caratteri, nel codice, sarebbero
    // invisibili.
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Estratto per elenchi e metadati: primo paragrafo, tagliato su una parola. */
export function excerptFromMarkdown(source: string, max = 180): string {
  const first = parseMarkdown(source).find((block) => block.kind === "paragraph");
  const text = first ? plainText(first.text) : source.trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
