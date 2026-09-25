/**
 * Test del markup dei testi di gioco.
 *
 * Il caso che conta davvero e' l'ultimo gruppo: nel testo di Grand Cross le
 * parentesi quadre sono quasi sempre parte del nome, non markup. Un parser
 * troppo avido si mangia "[Boar Hat]" e "[The Seven Deadly Sins]", e il danno
 * si vede solo guardando le pagine una per una.
 */

import { describe, expect, it } from "vitest";
import {
  collectHeroNotes,
  parseHeroText,
  plainHeroText,
  splitHeroNotes,
} from "../hero-markup";

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

/* --- corsivo: 186 aperture in 76 eroi, e fino a ieri si vedevano in pagina - */

describe("parseHeroText, corsivo", () => {
  it("riconosce il corsivo", () => {
    const [line] = parseHeroText("prima [i]nota[/i] dopo");
    expect(line?.map((s) => [s.text, s.italic ?? false])).toEqual([
      ["prima ", false],
      ["nota", true],
      [" dopo", false],
    ]);
  });

  it("non lascia i tag di corsivo nel testo", () => {
    expect(plainHeroText("[i]※Blade: +20%[/i]")).toBe("※Blade: +20%");
  });

  it("corsivo e colore convivono", () => {
    const [line] = parseHeroText("[i][C0C0C0]nota[-][/i]");
    expect(line?.[0]).toEqual({ text: "nota", italic: true, color: "#C0C0C0" });
  });
});

describe("splitHeroNotes", () => {
  const testo = "Infligge danni.\\n※Pierce: 3x Perforazione.";

  it("tiene l'effetto e la nota separati", () => {
    const { body, notes } = splitHeroNotes(testo);
    expect(body.map((l) => l.map((s) => s.text).join(""))).toEqual(["Infligge danni."]);
    expect(notes.map((l) => l.map((s) => s.text).join(""))).toEqual(["※Pierce: 3x Perforazione."]);
  });

  it("un testo senza note resta tutto corpo", () => {
    const { body, notes } = splitHeroNotes("Infligge danni.");
    expect(body).toHaveLength(1);
    expect(notes).toHaveLength(0);
  });

  it("riconosce la nota anche dentro il corsivo che il gioco le mette intorno", () => {
    const { body, notes } = splitHeroNotes("Colpisce.\\n[i][C0C0C0]※Blade: +20%[-][/i]");
    expect(body).toHaveLength(1);
    expect(notes).toHaveLength(1);
  });

  /*
   * Il caso di Gawain, che vale il 23% dei blocchi: la nota prosegue sulla riga
   * dopo senza ripetere la marca. Se il seguito finisce nel corpo si legge come
   * una regola dell'abilita' invece che come parte della definizione.
   */
  it("tiene con la nota anche le righe che la proseguono", () => {
    const { body, notes } = splitHeroNotes(
      "Infligge danni.\\n\\n※Sunfire: 5x Perforazione.\\nDanni +100% contro chi e' Fulminato.",
    );
    expect(body.map((l) => l.map((s) => s.text).join(""))).toEqual(["Infligge danni."]);
    expect(notes.map((l) => l.map((s) => s.text).join(""))).toEqual([
      "※Sunfire: 5x Perforazione.",
      "Danni +100% contro chi e' Fulminato.",
    ]);
  });

  it("la riga vuota chiude la nota: quello che viene dopo torna effetto", () => {
    const { body } = splitHeroNotes("Colpisce.\\n※Pierce: 3x.\\n\\nPoi guarisce.");
    expect(body.map((l) => l.map((s) => s.text).join(""))).toEqual(["Colpisce.", "Poi guarisce."]);
  });

  it("il colore aperto prima della marca arriva fino al seguito della nota", () => {
    const { notes } = splitHeroNotes("Colpisce.\\n[00D5FF]※Sunfire: 5x.\\nDanni +100%.[-]");
    expect(notes[1]?.[0]?.color).toBe("#00D5FF");
  });

  /*
   * I testi italiani di 7dshub aprono 16 note con l'asterisco al posto di ※:
   * il caso vero e' Meliodas, rango 110043, "*Evasione: immune ad Attacco...".
   */
  it("riconosce la nota aperta con l'asterisco, seguito da un nome e dai due punti", () => {
    const { body, notes } = splitHeroNotes(
      "Assume un Atteggiamento per 1 turno.\\n\\n[00D5FF]*Evasione: immune ad Attacco.[-]",
    );
    expect(body.map((l) => l.map((s) => s.text).join(""))).toEqual([
      "Assume un Atteggiamento per 1 turno.",
    ]);
    expect(notes.map((l) => l.map((s) => s.text).join(""))).toEqual([
      "*Evasione: immune ad Attacco.",
    ]);
  });

  it("l'asterisco vale come marca solo in testa alla riga", () => {
    const { notes } = splitHeroNotes("Danni x2 *Evasione: immune.\\nPoi guarisce.");
    expect(notes).toEqual([]);
  });

  it("un asterisco senza un nome e i due punti resta testo", () => {
    expect(splitHeroNotes("Colpisce.\\n* nota a margine: niente").notes).toEqual([]);
    expect(splitHeroNotes("Colpisce.\\n*Evasione senza definizione").notes).toEqual([]);
  });

  it("le note con l'asterisco si raccolgono una volta sola come le altre", () => {
    const ranghi = ["Colpisce.\\n*Esplosione: danni +100%.", "Colpisce forte.\\n*Esplosione: danni +100%."];
    expect(collectHeroNotes(ranghi)).toHaveLength(1);
  });
});

describe("collectHeroNotes", () => {
  // E' il caso vero: i tre ranghi di una carta ripetono la stessa definizione,
  // e cambia solo la percentuale nell'effetto sopra.
  const ranghi = [
    "Danni pari al [FFAE00]200%[-].\\n※Pierce: 3x Perforazione.",
    "Danni pari al [FFAE00]300%[-].\\n※Pierce: 3x Perforazione.",
    "Danni pari al [FFAE00]500%[-].\\n※Pierce: 3x Perforazione.",
  ];

  it("mostra una nota ripetuta una volta sola", () => {
    expect(collectHeroNotes(ranghi)).toHaveLength(1);
  });

  it("tiene note diverse, nell'ordine in cui compaiono", () => {
    const notes = collectHeroNotes([...ranghi, "Colpisce.\\n※Spike: 2x Danno critico."]);
    expect(notes.map((l) => l.map((s) => s.text).join(""))).toEqual([
      "※Pierce: 3x Perforazione.",
      "※Spike: 2x Danno critico.",
    ]);
  });

  it("considera uguali due note che differiscono solo per un tag", () => {
    expect(
      collectHeroNotes(["※Pierce: 3x Perforazione.", "[i]※Pierce: 3x Perforazione.[/i]"]),
    ).toHaveLength(1);
  });

  it("senza note non restituisce niente", () => {
    expect(collectHeroNotes(["Infligge danni."])).toEqual([]);
  });
});
