import { describe, expect, it } from "vitest";
import {
  excerptFromMarkdown,
  parseInline,
  parseMarkdown,
  plainText,
  safeHref,
  slugify,
  tableOfContents,
  type Block,
} from "../markdown";

function kinds(blocks: readonly Block[]): string[] {
  return blocks.map((block) => block.kind);
}

describe("safeHref", () => {
  it("accetta http, https e percorsi interni", () => {
    expect(safeHref("https://example.com/pagina")).toBe("https://example.com/pagina");
    expect(safeHref("http://example.com")).toBe("http://example.com/");
    expect(safeHref("/grand-cross/guide")).toBe("/grand-cross/guide");
  });

  /**
   * E' il controllo che giustifica l'esistenza della funzione: `javascript:`
   * eseguirebbe codice al clic, e nessun controllo sul solo testo lo fermerebbe.
   */
  it("rifiuta gli schemi che eseguono codice o servono contenuto arbitrario", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("JavaScript:alert(1)")).toBeNull();
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHref("vbscript:msgbox(1)")).toBeNull();
  });

  it("rifiuta i percorsi protocol-relative, che escono dal sito", () => {
    expect(safeHref("//example.com/fuori")).toBeNull();
  });

  it("rifiuta quello che non è un indirizzo", () => {
    expect(safeHref("non un indirizzo")).toBeNull();
    expect(safeHref("")).toBeNull();
  });
});

describe("parseInline", () => {
  it("riconosce grassetto, corsivo e codice", () => {
    const parts = parseInline("prima **forte** poi *piano* e `codice`");
    expect(parts.map((part) => part.kind)).toEqual([
      "text",
      "strong",
      "text",
      "em",
      "text",
      "code",
    ]);
    expect(plainText(parts)).toBe("prima forte poi piano e codice");
  });

  it("un collegamento con indirizzo rifiutato resta come testo", () => {
    const parts = parseInline("clicca [qui](javascript:alert(1)) subito");
    expect(parts.some((part) => part.kind === "link")).toBe(false);
    // La parola non sparisce: cancellarla lascerebbe la frase incompleta.
    expect(plainText(parts)).toContain("qui");
  });

  it("un collegamento valido porta l'indirizzo", () => {
    const parts = parseInline("vedi [la guida](/grand-cross/guide)");
    const link = parts.find((part) => part.kind === "link");
    expect(link).toMatchObject({ kind: "link", value: "la guida", href: "/grand-cross/guide" });
  });

  it("il testo senza marcatori resta un unico pezzo", () => {
    expect(parseInline("solo testo")).toEqual([{ kind: "text", value: "solo testo" }]);
  });
});

describe("parseMarkdown", () => {
  it("separa i paragrafi sulla riga vuota e unisce quelle contigue", () => {
    const blocks = parseMarkdown("prima riga\nseconda riga\n\nnuovo paragrafo");
    expect(kinds(blocks)).toEqual(["paragraph", "paragraph"]);
    expect(plainText((blocks[0] as Extract<Block, { kind: "paragraph" }>).text)).toBe(
      "prima riga seconda riga",
    );
  });

  it("riconosce i titoli e riporta # a livello 2", () => {
    const blocks = parseMarkdown("# Uno\n\n## Due\n\n### Tre");
    expect(blocks.map((block) => (block.kind === "heading" ? block.level : null))).toEqual([
      2, 2, 3,
    ]);
  });

  it("distingue elenchi puntati e numerati, e li separa quando cambiano", () => {
    const blocks = parseMarkdown("- uno\n- due\n1. primo\n2. secondo");
    expect(kinds(blocks)).toEqual(["list", "list"]);
    expect(blocks[0]).toMatchObject({ kind: "list", ordered: false });
    expect(blocks[1]).toMatchObject({ kind: "list", ordered: true });
  });

  it("dentro un blocco di codice i marcatori non valgono", () => {
    const blocks = parseMarkdown("```\n- non è un elenco\n## non è un titolo\n```");
    expect(kinds(blocks)).toEqual(["code"]);
    expect(blocks[0]).toMatchObject({
      kind: "code",
      value: "- non è un elenco\n## non è un titolo",
    });
  });

  it("un blocco di codice mai chiuso non fa perdere il testo", () => {
    const blocks = parseMarkdown("```\nrimasto aperto");
    expect(kinds(blocks)).toEqual(["code"]);
    expect(blocks[0]).toMatchObject({ value: "rimasto aperto" });
  });

  it("riconosce citazioni e linee separatrici", () => {
    expect(kinds(parseMarkdown("> nota\n\n---\n\ntesto"))).toEqual([
      "quote",
      "rule",
      "paragraph",
    ]);
  });

  /**
   * Nessun testo dell'autore diventa markup: l'HTML scritto a mano deve
   * arrivare in pagina come caratteri, non come elementi.
   */
  it("l'HTML scritto nel testo resta testo", () => {
    const blocks = parseMarkdown("<script>alert(1)</script>");
    expect(kinds(blocks)).toEqual(["paragraph"]);
    expect(plainText((blocks[0] as Extract<Block, { kind: "paragraph" }>).text)).toBe(
      "<script>alert(1)</script>",
    );
  });

  it("un testo vuoto non produce blocchi", () => {
    expect(parseMarkdown("")).toEqual([]);
    expect(parseMarkdown("\n\n   \n")).toEqual([]);
  });

  it("normalizza le interruzioni di riga di Windows", () => {
    expect(kinds(parseMarkdown("## Titolo\r\n\r\ntesto"))).toEqual(["heading", "paragraph"]);
  });
});

describe("tableOfContents", () => {
  it("prende solo i titoli, con ancore ricavate dal testo", () => {
    const toc = tableOfContents(parseMarkdown("## Turno 1\n\ntesto\n\n### Dettagli"));
    expect(toc).toEqual([
      { id: "turno-1", level: 2, label: "Turno 1" },
      { id: "dettagli", level: 3, label: "Dettagli" },
    ]);
  });

  it("due titoli identici non condividono l'ancora", () => {
    const toc = tableOfContents(parseMarkdown("## Note\n\n## Note\n\n## Note"));
    expect(toc.map((entry) => entry.id)).toEqual(["note", "note-2", "note-3"]);
  });

  it("un titolo senza caratteri utili riceve comunque un'ancora", () => {
    const toc = tableOfContents(parseMarkdown("## ***"));
    expect(toc[0]?.id.length).toBeGreaterThan(0);
  });
});

describe("slugify", () => {
  it("toglie i diacritici invece di cancellare la lettera", () => {
    expect(slugify("Città perché")).toBe("citta-perche");
  });

  it("non lascia trattini ai bordi", () => {
    expect(slugify("  --- Turno 1! ---  ")).toBe("turno-1");
  });
});

describe("excerptFromMarkdown", () => {
  it("prende il primo paragrafo, non il titolo", () => {
    expect(excerptFromMarkdown("## Titolo\n\nIl corpo della guida.")).toBe(
      "Il corpo della guida.",
    );
  });

  it("taglia su una parola intera e segnala il taglio", () => {
    const excerpt = excerptFromMarkdown(`${"parola ".repeat(60)}fine`, 40);
    expect(excerpt.length).toBeLessThanOrEqual(41);
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerpt).not.toContain("paro…");
  });

  it("un testo corto resta intero e senza puntini", () => {
    expect(excerptFromMarkdown("Corto.")).toBe("Corto.");
  });
});
