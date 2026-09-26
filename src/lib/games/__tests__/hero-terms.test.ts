/**
 * Test delle parole blu della scheda eroe.
 *
 * Le funzioni pure si provano su casi scritti a mano: come si contano le parole
 * blu (import e pagina devono contarle allo stesso modo), l'impronta del testo,
 * i bersagli, chi fa parte di un gruppo «applicabili». Poi i dati veri di Grand
 * Cross sul contratto - ogni bersaglio porta a qualcosa che esiste, ogni testo
 * della pagina ha tante voci quante parole blu - e qualche caso che l'utente
 * vedrebbe subito se fosse sbagliato.
 */

import { describe, expect, it } from "vitest";
import { grandCrossModule } from "../grand-cross";
import { groupTerms, parseHeroText, termWords } from "../hero-markup";
import { inGroup, parseTarget, searchText, targetId, textKey, type TermMember } from "../hero-terms";
import type { HeroTermGroup } from "../hero-terms-types";

const terms = grandCrossModule.heroTerms!;
const abilities = grandCrossModule.heroAbilities!;
const roster = grandCrossModule.roster!;

describe("le parole blu di un testo", () => {
  it("si contano nel corpo, non nelle note", () => {
    const text =
      "Increases basic stats by [FFAE00]50%[-] and gains [00D5FF]Evasion[-].\\n\\n[00D5FF]※Evasion: Immune to Attack.[-]";
    expect(termWords(text)).toEqual(["Evasion"]);
  });

  it("una parola spezzata da un grassetto resta una parola", () => {
    const [line] = parseHeroText("Applies [00D5FF]Mark of [b]Craving[/b][-] on one enemy");
    const terms = groupTerms(line!).filter((piece) => piece.kind === "term");
    expect(terms).toHaveLength(1);
    expect(termWords("Applies [00D5FF]Mark of [b]Craving[/b][-] on one enemy")).toEqual(["Mark of Craving"]);
  });

  it("un colore dentro il blu chiude la parola", () => {
    expect(termWords("Gains [00D5FF]Unbound Prophecy [FFAE00](★★)[-][-] now")).toEqual(["Unbound Prophecy"]);
  });

  it("i testi senza parole blu non ne hanno", () => {
    expect(termWords("Inflicts damage equal to [FFAE00]240%[-] of Attack")).toEqual([]);
  });
});

describe("impronta e bersagli", () => {
  it("l'impronta e' stabile e di otto cifre esadecimali", () => {
    expect(textKey("abc")).toBe(textKey("abc"));
    expect(textKey("abc")).not.toBe(textKey("abd"));
    expect(textKey("")).toMatch(/^[0-9a-f]{8}$/);
  });

  it("un bersaglio si legge nelle sue parti", () => {
    expect(parseTarget("c:buff_cancel|c:stance_cancel|r:3|f:6|g:12")).toEqual({
      concepts: ["buff_cancel", "stance_cancel"],
      races: [3],
      factions: [6],
      groups: [12],
    });
  });

  it("la ricerca delle tendine ignora accenti, maiuscole e parentesi", () => {
    expect(searchText("Velocità [Ragnarok] «Oceano»")).toBe("velocita ragnarok oceano");
  });

  it("l'id della tendina ha solo lettere, cifre e trattini", () => {
    expect(targetId("c:buff_cancel|r:3")).toMatch(/^blu-[a-z0-9-]+$/i);
  });
});

describe("chi fa parte di un gruppo «applicabili»", () => {
  const hero = (over: Partial<TermMember>): TermMember => ({
    id: "1",
    group: "Meliodas",
    race: 1,
    factions: [],
    attribute: 1,
    ...over,
  });
  const group = (over: Partial<HeroTermGroup>): HeroTermGroup => ({
    definition: { it: null, en: null },
    enemies: false,
    races: [],
    factions: [],
    characters: [],
    attributes: [],
    self: false,
    ...over,
  });

  it("razza, caratteristica o personaggio: basta uno", () => {
    const demoniESette = group({ races: [1], factions: [6] });
    expect(inGroup(demoniESette, hero({ race: 1 }), "x")).toBe(true);
    expect(inGroup(demoniESette, hero({ race: 3, factions: [6] }), "x")).toBe(true);
    expect(inGroup(demoniESette, hero({ race: 3, factions: [4] }), "x")).toBe(false);
    expect(inGroup(group({ characters: ["Megumin"] }), hero({ group: "Megumin", race: 3 }), "x")).toBe(true);
  });

  it("l'attributo si richiede insieme: «Strength attribute Humans»", () => {
    const umaniDiForza = group({ races: [3], attributes: [1] });
    expect(inGroup(umaniDiForza, hero({ race: 3, attribute: 1 }), "x")).toBe(true);
    expect(inGroup(umaniDiForza, hero({ race: 3, attribute: 2 }), "x")).toBe(false);
  });

  it("«Self» fa entrare l'eroe della scheda", () => {
    const self = group({ self: true, characters: ["Tamaki Kotatsu"] });
    expect(inGroup(self, hero({ id: "42", group: "Shinra" }), "42")).toBe(true);
    expect(inGroup(self, hero({ id: "43", group: "Shinra" }), "42")).toBe(false);
  });
});

describe("i dati di Grand Cross", () => {
  const heroIds = new Set(roster.heroes.map((hero) => hero.id));

  it("ogni bersaglio porta a qualcosa che esiste", () => {
    const races = new Set(Object.keys(grandCrossModule.heroContext!.codes.race).map(Number));
    const factions = new Set(Object.keys(grandCrossModule.heroContext!.codes.faction).map(Number));
    for (const targets of Object.values(terms.texts)) {
      for (const target of targets) {
        if (!target) continue;
        const parts = parseTarget(target);
        for (const concept of parts.concepts) expect(terms.concepts[concept], concept).toBeDefined();
        for (const race of parts.races) expect(races.has(race), `razza ${race}`).toBe(true);
        for (const faction of parts.factions) expect(factions.has(faction), `caratteristica ${faction}`).toBe(true);
        for (const n of parts.groups) expect(terms.groups[n], `gruppo ${n}`).toBeDefined();
      }
    }
  });

  it("ogni concetto ha un nome nelle due lingue, e dove compare sono eroi del roster", () => {
    for (const [key, concept] of Object.entries(terms.concepts)) {
      expect(concept.label.it, key).toBeTruthy();
      expect(concept.label.en, key).toBeTruthy();
    }
    for (const places of Object.values(terms.places)) {
      for (const [hid] of places) expect(heroIds.has(hid), hid).toBe(true);
    }
  });

  it("ogni testo della pagina ha una voce per parola blu, se ne ha", () => {
    let checked = 0;
    for (const hero of Object.values(abilities)) {
      for (const rank of hero.cards.flatMap((card) => card.ranks)) {
        const targets = terms.texts[textKey(rank.text)];
        if (!targets) continue;
        expect(targets).toHaveLength(termWords(rank.text).length);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(1000);
  });

  it("Perforazione: molti eroi, fra cui Merlin figlia di Belialuin sulla carta B", () => {
    const pierce = terms.places["pierce"]!;
    expect(new Set(pierce.map(([hid]) => hid)).size).toBeGreaterThan(40);
    expect(pierce).toContainEqual(["1887502", "B", 1]);
  });

  it("Evasione della carta B di Derieri: la stessa tendina, dal rango 2", () => {
    const card = abilities["1575001"]!.cards.find((c) => c.slot === "B")!;
    const rank3 = card.ranks.find((rank) => rank.rank === 3)!;
    expect(terms.texts[textKey(rank3.text)]).toContain("c:evasion");
    expect(terms.places["evasion"]).toContainEqual(["1575001", "B", 2]);
  });

  it("gli alleati applicabili di Meliodas Nemesi sono Demoni e [Seven Deadly Sins]", () => {
    const passive = abilities["2007501"]!.passive!.text!;
    const groups = (terms.texts[textKey(passive)] ?? [])
      .flatMap((target) => (target ? parseTarget(target).groups : []))
      .map((n) => terms.groups[n]!);
    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0]!.races).toEqual([1]);
    expect(groups[0]!.factions).toEqual([6]);
  });

  it("i personaggi per nome: «Goddesses, Megumin, Darkness»", () => {
    const group = terms.groups.find((g) => g.definition.en === "Goddesses, Megumin, Darkness");
    expect(group?.characters).toEqual(["Darkness", "Megumin"]);
    expect(group?.races).toEqual([5]);
  });
});
