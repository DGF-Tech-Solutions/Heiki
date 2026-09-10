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

const INLINE_PATTERN =
  /(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(`[^`\n]+`)|(\[[^\]\n]+\]\([^)\s]+\))/g;

/**
 * Sono ammessi solo indirizzi http(s) e percorsi interni.
 *
 * Il motivo e' `javascript:`: un collegamento con quello schema esegue codice
 * al clic, e passerebbe qualunque controllo fatto sul solo testo. Anche `data:`
 * resta fuori, perche' permette di servire una pagina arbitraria da un
 * indirizzo che sembra interno.
 */
export function safeHref(raw: string): string | null {
  const value = raw.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
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
  const used = new Map<string, number>();

  return blocks
    .filter((block): block is Extract<Block, { kind: "heading" }> => block.kind === "heading")
    .map((block) => {
      const label = plainText(block.text);
      const base = slugify(label) || "sezione";
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      return { id: seen === 0 ? base : `${base}-${seen + 1}`, level: block.level, label };
    });
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
