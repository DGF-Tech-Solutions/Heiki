import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  HEADING_ANCHOR_PREFIX,
  isInternalHref,
  parseDocument,
  parseInline,
  parseMarkdown,
  plainText,
  safeHref,
  tableOfContents,
} from "../markdown";

/**
 * Le difese del markdown delle guide, una per difetto trovato dall'audit
 * dell'11/10. I test di comportamento normale stanno in markdown.test.ts: qui
 * c'e' solo quello che un autore malintenzionato prova a far passare.
 */

describe("safeHref: i percorsi interni restano nel sito", () => {
  /**
   * Il browser tratta "\" come "/" e toglie tabulazioni e a capo prima di
   * seguire un collegamento: tutti questi diventano "//evil.com", cioe' un
   * altro sito, e prima passavano perche' cominciano con una sola "/".
   */
  it.each([
    "/\\evil.com",
    "/\\/evil.com",
    "/\\\t/evil.com",
    "/\t/evil.com",
    "/\n/evil.com",
    "/\r/evil.com",
    "/x\u0000y",
    "/x\u007fy",
    "//evil.com",
    "/.//evil.com",
    "/a/..//evil.com",
    "/%2e//evil.com",
  ])("rifiuta %j", (raw) => {
    expect(safeHref(raw)).toBeNull();
  });

  it("mantiene il rifiuto degli schemi che eseguono codice", () => {
    for (const raw of [
      "javascript:alert(1)",
      " JaVaScRiPt:alert(1)",
      "java\tscript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
    ]) {
      expect(safeHref(raw)).toBeNull();
    }
  });

  it("restituisce la forma normalizzata, quella che il browser seguira'", () => {
    expect(safeHref("/grand-cross/guide")).toBe("/grand-cross/guide");
    expect(safeHref("/a/../grand-cross/guide?x=1#sezione")).toBe("/grand-cross/guide?x=1#sezione");
    expect(safeHref("https://example.com")).toBe("https://example.com/");
  });

  /**
   * La prova che conta: qualunque cosa safeHref dichiari interna, risolta da
   * una pagina vera del sito, resta su quel sito.
   */
  it("ogni percorso accettato, risolto da una pagina del sito, resta sul sito", () => {
    const page = "https://heiki.example/grand-cross/guide/una-guida";
    const tricky = [
      "/ok",
      "/%5Cevil.com",
      "/%2F%2Fevil.com",
      "/..%2F..%2Fevil.com",
      "/./evil.com",
      "/a/b/../../../evil.com",
      "/@evil.com",
      "/:evil.com",
      "/?//evil.com",
      "/#//evil.com",
    ];
    for (const raw of tricky) {
      const href = safeHref(raw);
      if (href === null || !isInternalHref(href)) continue;
      expect(new URL(href, page).origin).toBe("https://heiki.example");
    }
  });

  it("nel testo, un collegamento con percorso truccato resta parola", () => {
    const parts = parseInline("vai [qui](/\\evil.com) adesso");
    expect(parts.some((part) => part.kind === "link")).toBe(false);
    expect(plainText(parts)).toContain("qui");
  });
});

describe("tempi di analisi su testi costruiti per rallentare", () => {
  /**
   * Prima delle correzioni: 60.000 "[" costavano ~4,4 s, "[a](" x 20.000 ~2,2 s,
   * "1. " seguito da 60.000 "[" ~2,6 s (misurati sulla stessa macchina). La
   * pagina della guida analizzava il testo due volte, quindi il doppio.
   */
  const cases: Record<string, string> = {
    "60.000 [": "[".repeat(60000),
    "[a]( x 20.000": "[a](".repeat(20000),
    "[a x 30.000": "[a".repeat(30000),
    "30.000 [ poi ](": `${"[".repeat(30000)}](`,
    "[a](b x 15.000": "[a](b".repeat(15000),
    "[x](/ x 15.000": "[x](/".repeat(15000),
    "[a](( x 12.000": "[a]((".repeat(12000),
    "titolo di 60.000 [": `## ${"[".repeat(60000)}`,
    "voce d'elenco di 60.000 [": `1. ${"[".repeat(60000)}`,
    "citazione di [a](": `> ${"[a](".repeat(15000)}`,
    "etichette lunghe al limite": `[${"a".repeat(199)}`.repeat(300),
    "indirizzi lunghi al limite": `[a](${"b".repeat(499)}`.repeat(120),
    "*a x 30.000": "*a".repeat(30000),
    "**a x 20.000": "**a".repeat(20000),
    "12.000 titoli uguali": "## a\n".repeat(12000),
  };

  it.each(Object.entries(cases))("%s: meno di 200 ms", (_name, source) => {
    const started = performance.now();
    parseDocument(source);
    expect(performance.now() - started).toBeLessThan(200);
  });

  it("i collegamenti veri si riconoscono ancora", () => {
    const parts = parseInline("vedi [la guida](/grand-cross/guide) e [fuori](https://example.com/x)");
    expect(parts.filter((part) => part.kind === "link")).toHaveLength(2);
  });
});

describe("ancore dei titoli", () => {
  it("hanno il prefisso, cosi' non prendono l'id di un elemento della pagina", () => {
    const { headings } = parseDocument("## Main\n\ntesto\n\n### Contenuto");
    expect(headings.map((heading) => heading.id)).toEqual([
      `${HEADING_ANCHOR_PREFIX}main`,
      `${HEADING_ANCHOR_PREFIX}contenuto`,
    ]);
  });

  it("una sola analisi: un'ancora per ogni blocco titolo, nello stesso ordine", () => {
    const source = "## Uno\n\npar\n\n### Due\n\n- x\n\n## Tre";
    const { blocks, headings } = parseDocument(source);
    expect(blocks).toEqual(parseMarkdown(source));
    expect(headings.map((heading) => heading.label)).toEqual(["Uno", "Due", "Tre"]);
    expect(blocks.filter((block) => block.kind === "heading")).toHaveLength(headings.length);
  });

  it("restano uniche anche quando un titolo ha gia' la forma col suffisso", () => {
    const ids = tableOfContents(parseMarkdown("## Note\n\n## Note\n\n## Note 2\n\n## Note")).map(
      (heading) => heading.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice(0, 2)).toEqual(["note", "note-2"]);
  });
});

/**
 * La resa vera (rel, id dei titoli) non si puo' montare qui: il tsconfig del
 * progetto ha jsx "preserve" per Next, e vitest non sa trasformare i .tsx.
 * Si controlla il sorgente del componente, che e' l'unico punto in cui quegli
 * attributi nascono; la pagina servita si e' controllata a mano l'11/10.
 */
describe("resa (sorgente del componente)", () => {
  const source = readFileSync(
    fileURLToPath(new URL("../../components/markdown.tsx", import.meta.url)),
    "utf8",
  );

  it("i collegamenti esterni dichiarano che li ha scritti un utente", () => {
    expect(source).toContain('rel="ugc nofollow noopener noreferrer"');
  });

  it("interno o esterno si decide sull'indirizzo normalizzato, non sul primo carattere", () => {
    expect(source).toContain("isInternalHref(part.href)");
    expect(source).not.toContain('part.href.startsWith("/")');
  });

  it("titoli e indice usano le ancore di parseDocument, prefissate", () => {
    expect(source).toContain("parseDocument(");
    expect(source).not.toContain("tableOfContents(");
  });
});
