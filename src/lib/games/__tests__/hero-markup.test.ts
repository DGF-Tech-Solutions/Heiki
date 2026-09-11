/**
 * Test del markup dei testi di gioco.
 *
 * Il caso che conta davvero e' l'ultimo gruppo: nel testo di Grand Cross le
 * parentesi quadre sono quasi sempre parte del nome, non markup. Un parser
 * troppo avido si mangia "[Boar Hat]" e "[The Seven Deadly Sins]", e il danno
 * si vede solo guardando le pagine una per una.
 */

import { describe, expect, it } from "vitest";
import { parseHeroText, plainHeroText } from "../hero-markup";

const flat = (raw: string) => parseHeroText(raw).map((line) => line.map((s) => s.text));

describe("parseHeroText", () => {
  it("un testo semplice e' una riga sola", () => {
    expect(flat("Oste Meliodas")).toEqual([["Oste Meliodas"]]);
  });

  it("il testo vuoto non produce righe", () => {
    expect(parseHeroText("")).toEqual([]);
  });

  it("spezza sul capoverso scritto come due caratteri", () => {
    expect(flat("Prima\\nSeconda")).toEqual([["Prima"], ["Seconda"]]);
  });

  it("spezza anche su un capoverso vero", () => {
    expect(flat("Prima\nSeconda")).toEqual([["Prima"], ["Seconda"]]);
  });

  it("riconosce il grassetto", () => {
    const [line] = parseHeroText("Il titolo di [b]Peccato del Drago[/b] è suo");
    expect(line?.map((s) => [s.text, s.bold ?? false])).toEqual([
      ["Il titolo di ", false],
      ["Peccato del Drago", true],
      [" è suo", false],
    ]);
  });

  it("riconosce il colore e lo restituisce in forma CSS", () => {
    const [line] = parseHeroText("Perforazione [FFAE00]+50%[-] sempre");
    expect(line?.map((s) => [s.text, s.color])).toEqual([
      ["Perforazione ", undefined],
      ["+50%", "#FFAE00"],
      [" sempre", undefined],
    ]);
  });

  it("grassetto e colore si sommano invece di escludersi", () => {
    const [line] = parseHeroText("[b][00FF31]molto[-][/b]");
    expect(line?.[0]).toEqual({ text: "molto", bold: true, color: "#00FF31" });
  });

  it("chiudere il colore non spegne il grassetto", () => {
    const [line] = parseHeroText("[b]a[00FF31]b[-]c[/b]");
    expect(line?.map((s) => [s.text, s.bold, s.color])).toEqual([
      ["a", true, undefined],
      ["b", true, "#00FF31"],
      ["c", true, undefined],
    ]);
  });

  it("conserva i segnaposto del gioco senza toccarli", () => {
    expect(flat("Usa ogni {buff_1_val} turni")).toEqual([["Usa ogni {buff_1_val} turni"]]);
  });

  /* --- il punto delicato ------------------------------------------------ */

  it("non scambia per markup le quadre di un nome", () => {
    expect(flat("[Boar Hat] Tavern")).toEqual([["[Boar Hat] Tavern"]]);
  });

  it("lascia intatto un epiteto tutto fra quadre", () => {
    expect(flat("[The Seven Deadly Sins]")).toEqual([["[The Seven Deadly Sins]"]]);
  });

  it("non tratta come colore una parola di sei lettere fra quadre", () => {
    expect(flat("[Boaris] arriva")).toEqual([["[Boaris] arriva"]]);
  });

  it("riconosce il colore anche in minuscolo", () => {
    const [line] = parseHeroText("[ffae00]x[-]");
    expect(line?.[0]?.color).toBe("#ffae00");
  });
});

describe("plainHeroText", () => {
  it("toglie il markup e lascia il testo", () => {
    expect(plainHeroText("Perforazione [FFAE00]+50%[-]")).toBe("Perforazione +50%");
  });

  it("unisce le righe con uno spazio, per i metadati", () => {
    expect(plainHeroText("Prima\\nSeconda")).toBe("Prima Seconda");
  });

  it("non altera le quadre che fanno parte del nome", () => {
    expect(plainHeroText("[Boar Hat] Tavern")).toBe("[Boar Hat] Tavern");
  });
});
