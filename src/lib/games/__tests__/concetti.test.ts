/**
 * La base dei concetti di Grand Cross contro i dati che il sito usa davvero.
 *
 * La base (data/grand-cross/concetti) la scrive concetti.py nella pipeline, e
 * il sito ancora non la legge: questo test e' il punto in cui le due cose si
 * toccano. Se dopo una patch un eroe usa una razza, una fazione, una
 * condizione o una statistica che la base non conosce, lo si vede qui invece
 * che il giorno in cui una pagina prova a spiegarla.
 *
 * I controlli sono sulla FORMA e sui riferimenti, non sui numeri del momento:
 * quanti eroi siano Umani cambia a ogni uscita, che ogni codice usato abbia la
 * sua voce no.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HERO_STATS } from "../grand-cross/hero-stats.generated";

const CARTELLA = path.resolve(import.meta.dirname, "../../../../data/grand-cross/concetti");

interface Etichetta {
  it: string | null;
  en: string | null;
}

interface Voce {
  etichetta: Etichetta;
  certezza: string;
  prove: string[];
  [campo: string]: unknown;
}

type Dizionario = Record<string, Voce>;

function carica<T>(nome: string): T {
  return JSON.parse(readFileSync(path.join(CARTELLA, nome), "utf8")) as T;
}

const statistiche = carica<{
  statistiche: Dizionario;
  gruppi: Dizionario;
  campi_7dshub_non_nominati: Record<string, unknown>;
}>("statistiche.json");
const identita = carica<{ razze: Dizionario; attributi: Dizionario; fazioni: Dizionario; rarita: Dizionario }>(
  "identita.json",
);
const carte = carica<{ slot: Dizionario; tipi_attacco: Dizionario; gittate: Dizionario; bersagli: Dizionario }>(
  "carte.json",
);
const condizioni = carica<{ condizioni: Dizionario }>("condizioni.json");
const contenuti = carica<{ contenuti: Dizionario }>("contenuti.json");
const tassonomia = carica<{ voci: Record<string, { rimanda_a: string | null }> }>("tassonomia.json");

const DIZIONARI: Record<string, Dizionario> = {
  "statistiche.statistiche": statistiche.statistiche,
  "statistiche.gruppi": statistiche.gruppi,
  "identita.razze": identita.razze,
  "identita.attributi": identita.attributi,
  "identita.fazioni": identita.fazioni,
  "identita.rarita": identita.rarita,
  "carte.slot": carte.slot,
  "carte.tipi_attacco": carte.tipi_attacco,
  "carte.gittate": carte.gittate,
  "carte.bersagli": carte.bersagli,
  "condizioni.condizioni": condizioni.condizioni,
  "contenuti.contenuti": contenuti.contenuti,
};

const eroi = Object.values(HERO_CONTEXT.heroes);

describe("base dei concetti: la forma di ogni voce", () => {
  it.each(Object.entries(DIZIONARI))("%s: etichetta bilingue, certezza e prove", (_, dizionario) => {
    expect(Object.keys(dizionario).length).toBeGreaterThan(0);
    for (const [chiave, voce] of Object.entries(dizionario)) {
      expect(Object.keys(voce.etichetta).sort(), chiave).toEqual(["en", "it"]);
      expect(["dichiarato", "dedotto"], chiave).toContain(voce.certezza);
      expect(Array.isArray(voce.prove), chiave).toBe(true);
      // Un legame dedotto senza prove sarebbe un'affermazione: la base non ne ha.
      if (voce.certezza === "dedotto") expect(voce.prove.length, chiave).toBeGreaterThan(0);
    }
  });
});

describe("base dei concetti: i dati del sito ci stanno dentro", () => {
  it("ogni statistica di 7dshub ha una voce o e' dichiarata fra quelle non nominate", () => {
    const note = new Set(
      Object.values(statistiche.statistiche)
        .map((v) => v["chiave_7dshub"])
        .filter((k): k is string => typeof k === "string"),
    );
    for (const stat of Object.values(HERO_STATS)) {
      for (const chiave of Object.keys(stat.max)) {
        expect(note.has(chiave) || chiave in statistiche.campi_7dshub_non_nominati, chiave).toBe(true);
      }
    }
  });

  it("i gruppi citano statistiche che esistono, e «tutte» e' l'unione dei tre", () => {
    for (const [nome, gruppo] of Object.entries(statistiche.gruppi)) {
      for (const membro of gruppo["membri"] as string[]) {
        expect(statistiche.statistiche[membro], `${nome}: ${membro}`).toBeDefined();
      }
    }
    const unione = ["attacco", "difesa", "ps"].flatMap((g) => statistiche.gruppi[g]!["membri"] as string[]);
    expect(statistiche.gruppi["tutte"]!["membri"]).toEqual(unione);
  });

  it("razza, attributo e fazioni di ogni eroe hanno una voce con un nome", () => {
    for (const eroe of eroi) {
      for (const [dizionario, codici] of [
        [identita.razze, eroe.race === null ? [] : [eroe.race]],
        [identita.attributi, eroe.attribute === null ? [] : [eroe.attribute]],
        [identita.fazioni, eroe.factions],
      ] as const) {
        for (const codice of codici) {
          const voce = dizionario[String(codice)];
          expect(voce, `codice ${codice}`).toBeDefined();
          expect(voce!.etichetta.it ?? voce!.etichetta.en, `codice ${codice}`).toBeTruthy();
        }
      }
    }
  });

  it("gli slot delle carte e le condizioni delle passive usati dagli eroi esistono", () => {
    for (const eroe of eroi) {
      for (const slot of Object.keys(eroe.cards)) {
        expect(carte.slot[slot], slot).toBeDefined();
      }
      for (const codice of eroe.passiveConditions ?? []) {
        expect(condizioni.condizioni[String(codice)], `condizione ${codice}`).toBeDefined();
      }
    }
  });

  it("condizioni e contenuti si citano a vicenda senza buchi", () => {
    for (const [codice, condizione] of Object.entries(condizioni.condizioni)) {
      const nome = condizione["contenuto"] as string | null;
      if (nome === null) continue;
      expect(contenuti.contenuti[nome], `condizione ${codice}`).toBeDefined();
      expect(contenuti.contenuti[nome]!["condizioni"], `condizione ${codice}`).toContain(Number(codice));
    }
  });

  it("ogni rimando della tassonomia porta a una voce che esiste", () => {
    for (const [codice, voce] of Object.entries(tassonomia.voci)) {
      if (!voce.rimanda_a) continue;
      const [file, sezione, chiave] = voce.rimanda_a.split(".");
      expect(DIZIONARI[`${file}.${sezione}`]?.[chiave!], `${codice} -> ${voce.rimanda_a}`).toBeDefined();
    }
  });
});
