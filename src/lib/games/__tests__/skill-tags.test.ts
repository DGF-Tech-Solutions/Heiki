/**
 * Test del filtro «Effetto» della griglia Eroi, sui dati veri di Grand Cross.
 *
 * I conteggi di Annulla Atteggiamento e Recisione sono quelli del client: se
 * cambiano senza una patch, si e' rotto il legame fra carte ed eroi. Passano dal
 * modulo del gioco e non dal file generato, cosi' provano anche il collegamento.
 */

import { describe, expect, it } from "vitest";
import { grandCrossModule } from "../grand-cross";

const index = grandCrossModule.skillTags!;
const roster = new Set(grandCrossModule.roster!.heroes.map((hero) => hero.id));
const entries = index.groups.flatMap((group) => group.entries);
const named = (it: string) => entries.filter((entry) => entry.label.it === it);

describe("il filtro Effetto", () => {
  it("conta gli eroi come il client", () => {
    expect(named("Annulla Atteggiamento").map((entry) => entry.heroes.length)).toEqual([95]);
    expect(named("Recisione").map((entry) => entry.heroes.length)).toEqual([43]);
  });

  it("ha solo eroi del roster, una volta sola per voce", () => {
    for (const entry of entries) {
      expect(entry.heroes.filter((id) => !roster.has(id))).toEqual([]);
      expect(new Set(entry.heroes).size).toBe(entry.heroes.length);
    }
  });

  it("non ha voci vuote", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.heroes.length).toBeGreaterThan(0);
      expect(entry.label.it ?? entry.label.en).toBeTruthy();
    }
  });

  it("ha i quattro gruppi del gioco, senza «Tutte le abilità»", () => {
    expect(index.groups.map((group) => group.id)).toEqual(["01", "02", "03", "04"]);
    for (const group of index.groups) expect(group.entries.length).toBeGreaterThan(0);
    const labels = [...index.groups.map((group) => group.label.it), ...entries.map((entry) => entry.label.it)];
    expect(labels).not.toContain("Tutte le abilità");
  });

  it("fonde i tag con lo stesso nome: nessun doppione, nessun tag in due voci", () => {
    const names = entries.map((entry) => JSON.stringify([entry.label.it, entry.label.en]));
    expect(new Set(names).size).toBe(names.length);
    const tags = entries.flatMap((entry) => entry.tags);
    expect(new Set(tags).size).toBe(tags.length);

    const [gauge] = named("Riduzione Barra Mossa finale");
    expect(gauge?.tags).toEqual([121, 233, 407]);
    expect(gauge?.heroes).toHaveLength(87);
  });

  it("non fonde effetti diversi solo perche' in italiano si chiamano uguale", () => {
    const crush = named("Frantumazione");
    expect(crush.map((entry) => entry.label.en).sort()).toEqual(["Crush", "Shatter"]);
  });

  it("ha una descrizione in tutte e due le lingue, su una riga e senza i colori del client", () => {
    for (const entry of entries) {
      for (const text of [entry.description.it, entry.description.en]) {
        expect(text).toBeTruthy();
        expect(text).not.toMatch(/\n|\[[0-9a-f]{6}\]|\[-\]/i);
      }
    }
  });
});
