/**
 * Test dei colori del gioco sul fondo chiaro.
 *
 * Il caso che conta e' il primo gruppo: prima di questa regola sei colori su
 * otto diventavano neri, e le abilita' si leggevano senza alcuna evidenza.
 */

import { describe, expect, it } from "vitest";
import { readableColor } from "../game-color";

const luminance = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

describe("readableColor", () => {
  it("nessun colore del gioco finisce in nero", () => {
    const colori = ["#FFAE00", "#00D5FF", "#00FF00", "#00FF31", "#FF8000", "#DC143C"];
    for (const colore of colori) {
      expect(readableColor(colore)).not.toBe("#000000");
    }
  });

  it("porta ogni colore sotto la soglia di leggibilita'", () => {
    for (const colore of ["#FFAE00", "#00D5FF", "#00FF00", "#FF8000"]) {
      expect(luminance(readableColor(colore))).toBeLessThanOrEqual(0.46);
    }
  });

  it("conserva la tinta: l'oro resta oro, l'azzurro resta azzurro", () => {
    // Il canale dominante prima deve restare dominante dopo.
    expect(readableColor("#FFAE00")).toBe("#a47000");
    expect(readableColor("#00D5FF")).toBe("#008fab");
  });

  it("lascia intatto un colore gia' abbastanza scuro", () => {
    expect(readableColor("#DC143C")).toBe("#DC143C");
  });

  it("il bianco del bersaglio diventa inchiostro pieno", () => {
    expect(readableColor("#FFFFFF")).toBe("#14161c");
  });

  it("l'argento delle note diventa inchiostro tenue", () => {
    expect(readableColor("#C0C0C0")).toBe("#767d8e");
  });

  it("due colori diversi restano distinguibili", () => {
    expect(readableColor("#FFAE00")).not.toBe(readableColor("#00D5FF"));
  });
});
