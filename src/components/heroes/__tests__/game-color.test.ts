/**
 * Test dei colori del gioco sul fondo scuro.
 *
 * Il caso che conta e' il primo: il gioco sceglie i suoi colori PER un fondo
 * scuro, quindi su questo tema i colori che usa davvero non vanno toccati
 * affatto. Un adattamento che li muovesse comunque sarebbe lavoro inutile che
 * peggiora la fedelta'.
 *
 * Le asserzioni sono sulle PROPRIETA' - soglia, tinta, distinguibilita' - e non
 * su esadecimali esatti: un valore scritto a mano qui dentro fissa
 * l'implementazione invece della regola, e si rompe alla prima taratura della
 * soglia anche quando il comportamento e' ancora giusto.
 */

import { describe, expect, it } from "vitest";
import { readableColor } from "../game-color";

const luminance = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

/** I colori che il gioco usa davvero nei testi delle abilita'. */
const DEL_GIOCO = ["#FFAE00", "#00D5FF", "#00FF00", "#00FF31", "#FF8000"];

describe("readableColor", () => {
  it("i colori del gioco passano intatti: il fondo e' quello per cui sono nati", () => {
    for (const colore of DEL_GIOCO) {
      expect(readableColor(colore)).toBe(colore);
    }
  });

  it("nessun colore finisce nel nero del fondo", () => {
    for (const colore of [...DEL_GIOCO, "#DC143C", "#1a0033"]) {
      expect(luminance(readableColor(colore))).toBeGreaterThan(0.2);
    }
  });

  it("porta un colore troppo scuro sopra la soglia di leggibilita'", () => {
    for (const colore of ["#DC143C", "#1a0033", "#003300"]) {
      expect(luminance(colore)).toBeLessThan(0.45);
      expect(luminance(readableColor(colore))).toBeGreaterThanOrEqual(0.44);
    }
  });

  it("conserva la tinta: il canale dominante resta dominante", () => {
    const dominante = (hex: string) => {
      const n = Number.parseInt(hex.slice(1), 16);
      const canali = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      return canali.indexOf(Math.max(...canali));
    };
    for (const colore of ["#DC143C", "#003300", "#000080"]) {
      expect(dominante(readableColor(colore))).toBe(dominante(colore));
    }
  });

  it("il bianco del bersaglio diventa inchiostro pieno", () => {
    expect(readableColor("#FFFFFF")).toBe("#f2f4f8");
  });

  it("l'argento delle note diventa inchiostro tenue", () => {
    expect(readableColor("#C0C0C0")).toBe("#838b9c");
  });

  it("due colori diversi restano distinguibili", () => {
    expect(readableColor("#FFAE00")).not.toBe(readableColor("#00D5FF"));
    expect(readableColor("#DC143C")).not.toBe(readableColor("#000080"));
  });
});
