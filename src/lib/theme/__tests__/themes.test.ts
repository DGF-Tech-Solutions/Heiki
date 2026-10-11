/**
 * I temi reggono la lettura, e un tema nuovo non puo' regredire.
 *
 * La fonte dei colori e' globals.css: questo test la LEGGE invece di avere una
 * sua copia dei valori, cosi' quello che si misura e' quello che il browser
 * disegna. Il predefinito sta in `@theme`, gli altri nei blocchi
 * `:root[data-theme="…"]`; un tema e' il predefinito con sopra il suo blocco.
 *
 * Le soglie sono quelle WCAG (AA 4,5:1 per il testo, 3:1 per bordi e blocchi
 * di colore), piu' alte dove il sito le ha gia' scelte: 7:1 il testo principale.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, isTheme, THEME_COLORS, THEMES, type Theme } from "../themes";

const CSS = readFileSync(path.resolve(import.meta.dirname, "../../../app/globals.css"), "utf8")
  // i commenti spiegano i valori e a volte li citano: fuori, prima di cercarli
  .replace(/\/\*[\s\S]*?\*\//g, "");

/** I token del ruolo: quelli che ogni tema ridefinisce, tutti. */
const ROLE_TOKENS = [
  "paper",
  "paper-2",
  "paper-3",
  "ink",
  "ink-2",
  "ink-3",
  "rule",
  "rule-2",
  "brand",
  "brand-deep",
  "brand-soft",
];

function colors(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name = "", hex = ""] of block.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    out[name] = hex.toLowerCase();
  }
  return out;
}

const DEFAULTS = colors(CSS.match(/@theme\s*\{([^}]*)\}/)?.[1] ?? "");
const BLOCKS = new Map(
  [...CSS.matchAll(/:root\[data-theme="([\w-]+)"\]\s*\{([^}]*)\}/g)].map(([, id = "", body = ""]) => [id, colors(body)]),
);

function palette(theme: Theme): Record<string, string> {
  return { ...DEFAULTS, ...BLOCKS.get(theme) };
}

/** Luminanza relativa e rapporto di contrasto, come li definisce WCAG 2. */
function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe("i temi nel CSS", () => {
  it("il calcolo del contrasto e' quello di WCAG", () => {
    expect(contrast("#ffffff", "#000000")).toBeCloseTo(21, 5);
    // il rosso «Persona» col bianco sopra: il 4,7:1 citato in globals.css
    expect(contrast("#ffffff", "#e61421")).toBeCloseTo(4.68, 2);
  });

  it("il predefinito e' in @theme con tutti i token, e non ha un blocco suo", () => {
    expect(isTheme(DEFAULT_THEME)).toBe(true);
    for (const token of ROLE_TOKENS) expect(DEFAULTS[token], token).toMatch(/^#[0-9a-f]{6}$/);
    expect(BLOCKS.has(DEFAULT_THEME)).toBe(false);
  });

  it("ogni tema dell'elenco ha il suo blocco nel CSS, e nessun blocco e' senza tema", () => {
    expect([...BLOCKS.keys()].sort()).toEqual(THEMES.filter((t) => t !== DEFAULT_THEME).sort());
  });

  it("ogni blocco ridefinisce tutti e soli i token del ruolo", () => {
    for (const [id, block] of BLOCKS) expect(Object.keys(block).sort(), id).toEqual([...ROLE_TOKENS].sort());
  });

  it("la copia di fondo e accento in themes.ts e' uguale al CSS", () => {
    for (const theme of THEMES) {
      expect(THEME_COLORS[theme].paper, `${theme}: paper`).toBe(palette(theme).paper);
      expect(THEME_COLORS[theme].brand, `${theme}: brand`).toBe(palette(theme).brand);
    }
  });

  it("i cookie validi sono solo i nomi dei temi", () => {
    expect(isTheme("notte")).toBe(true);
    expect(isTheme("chiaro")).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});

describe.each(THEMES)("il tema %s si legge", (theme) => {
  const c = palette(theme);
  const almeno = (fg: string, bg: string, min: number) =>
    expect(contrast(c[fg] ?? fg, c[bg] ?? bg), `${theme}: ${fg} su ${bg}`).toBeGreaterThanOrEqual(min);

  it("resta scuro: il fondo e' quasi nero, e i colori del gioco ci stanno sopra come sono", () => {
    for (const fondo of ["paper", "paper-2", "paper-3"]) expect(luminance(c[fondo] ?? ""), fondo).toBeLessThanOrEqual(0.02);
    // i colori che il gioco usa davvero nei testi: valori, termini, cure, turni
    for (const gioco of ["#ffae00", "#00d5ff", "#00ff31", "#ff8000"]) almeno(gioco, "paper-3", 4.5);
  });

  it("il testo principale fa almeno 7:1 sul fondo, anche nei riquadri", () => {
    almeno("ink", "paper", 7);
    almeno("ink", "paper-2", 7);
    almeno("ink", "paper-3", 7);
  });

  it("i grigi del testo secondario fanno almeno 4,5:1 su ogni fondo", () => {
    for (const grigio of ["ink-2", "ink-3"]) {
      for (const fondo of ["paper", "paper-2", "paper-3"]) almeno(grigio, fondo, 4.5);
    }
  });

  it("l'accento regge il bianco sopra, e sul fondo si vede come blocco e come filo", () => {
    almeno("#ffffff", "brand", 4.5);
    almeno("brand", "paper", 3);
  });

  it("l'accento del testo piccolo fa almeno 4,5:1 sul fondo", () => {
    almeno("brand-deep", "paper", 4.5);
    almeno("brand-deep", "paper-2", 4.5);
  });

  it("sul fondo tinto dell'accento il testo si legge", () => {
    almeno("ink", "brand-soft", 7);
    almeno("ink-2", "brand-soft", 4.5);
  });

  it("i significati fissi (sale, scende, avviso) si leggono su questo fondo", () => {
    for (const segno of ["up", "down", "hot", "gold"]) {
      almeno(segno, "paper", 4.5);
      almeno(segno, "paper-2", 4.5);
    }
  });
});
