/**
 * Le righe d'effetto delle carte contro la base dei concetti e contro i dati
 * del sito.
 *
 * I file di data/grand-cross/effetti li scrive righe_carte.py nella pipeline,
 * che prima di scriverli prova che forme e valori rifanno il testo di ogni
 * rango. Qui si controlla quello che quella prova non vede: che i file si
 * citino fra loro senza buchi, che ogni codice usato abbia una voce nei
 * dizionari della tappa A, e che gli eroi siano quelli del sito.
 *
 * Come in concetti.test.ts, i controlli sono sulla FORMA e sui riferimenti,
 * non sui numeri del momento.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";

const DATI = path.resolve(import.meta.dirname, "../../../../data/grand-cross");

function carica<T>(nome: string): T {
  return JSON.parse(readFileSync(path.join(DATI, nome), "utf8")) as T;
}

interface Proposizione {
  forma: string;
  valori?: string[];
  bersagli?: string[];
  termini?: string[];
  minuscola?: boolean;
  parte?: string;
}

interface RigaBase {
  slot: string;
  rango: number;
  eroi: string[];
  proposizioni?: Proposizione[];
  schema?: string;
  fonti: Record<string, string>;
  [campo: string]: unknown;
}

interface Significato {
  effetto: string;
  forme: string[];
  a_chi?: string;
  statistiche?: string[];
  tassonomia?: string[];
}

interface RigaCollegata {
  carta?: string;
  carte?: string[];
  posizione?: number;
  proposizione?: number;
  significato?: Significato[];
  fonti: Record<string, string>;
  [campo: string]: unknown;
}

interface Tabella<R> {
  tabella: string;
  colonne: { nome: string; tipo: string }[];
  righe: Record<string, R>;
}

interface Effetto {
  tabella?: string;
  effetto: string;
  colonne?: Record<string, number>;
  bersaglio?: number;
  termine?: number;
  statistiche?: string[];
  in_base_a?: string;
  a_chi?: string;
  tassonomia?: string[];
}

interface Forma {
  forma: string;
  usi: number;
  parti: Record<string, number>;
  lettura: { effetti: Effetto[]; regole: string[]; certezza: string; prove: string[] } | null;
  revisione?: { esito: string; stato: string };
}

interface Segnaposto {
  etichetta: { it: string | null; en: string | null };
  nel_testo: string | null;
  tabella: string | null;
  colonna: string | null;
  colonne_possibili: string[];
  certezza: string;
  prove: string[];
}

const base = carica<Tabella<RigaBase>>("effetti/carte_base.json");
const buff = carica<Tabella<RigaCollegata>>("effetti/carte_buff.json");
const opzioni = carica<Tabella<RigaCollegata>>("effetti/carte_opzioni.json");
const forme = carica<{ forme: Record<string, Forma> }>("effetti/forme_carte.json").forme;
const segnaposto = carica<{ segnaposto: Record<string, Segnaposto> }>("effetti/segnaposto.json").segnaposto;
const carte = carica<Record<string, Record<string, unknown>>>("concetti/carte.json");
const tassonomia = carica<{ voci: Record<string, unknown> }>("concetti/tassonomia.json").voci;
const statistiche = carica<Record<"statistiche" | "gruppi", Record<string, unknown>>>("concetti/statistiche.json");
const ENUM_BERSAGLI = new Set(Object.values(carte["bersagli"] as Record<string, { enum: string }>).map((b) => b.enum));

const TABELLE: Record<string, Tabella<unknown>> = {
  [base.tabella]: base,
  [buff.tabella]: buff,
  [opzioni.tabella]: opzioni,
};
const righe = Object.entries(base.righe);
const SLOT = /<([VTK])>/g;

/** La proposizione coi suoi valori al posto degli slot, come fa ricomponi() nella pipeline. */
function riempi(p: Proposizione): string {
  const code = { V: [...(p.valori ?? [])], T: [...(p.bersagli ?? [])], K: [...(p.termini ?? [])] };
  const testo = forme[p.forma]!.forma.replace(SLOT, (_, tipo: "V" | "T" | "K") => code[tipo].shift() ?? "<?>");
  expect(code.V.length + code.T.length + code.K.length, `valori avanzati in ${p.forma}`).toBe(0);
  return p.minuscola ? testo[0]!.toLowerCase() + testo.slice(1) : testo;
}

describe("righe d'effetto delle carte: i file si citano senza buchi", () => {
  it("ogni proposizione cita una forma che esiste, con un valore per ogni slot", () => {
    for (const [id, riga] of righe) {
      for (const p of riga.proposizioni ?? []) {
        const forma = forme[p.forma];
        expect(forma, `${id} -> ${p.forma}`).toBeDefined();
        const conta = { V: 0, T: 0, K: 0 };
        for (const m of forma!.forma.matchAll(SLOT)) conta[m[1] as "V" | "T" | "K"]++;
        expect([p.valori?.length ?? 0, p.bersagli?.length ?? 0, p.termini?.length ?? 0], id).toEqual([
          conta.V,
          conta.T,
          conta.K,
        ]);
      }
    }
  });

  it("lo schema cita ogni proposizione una volta, in ordine, e si riempie senza avanzi", () => {
    for (const [id, riga] of righe) {
      if (riga.schema === undefined) continue;
      const citate = [...riga.schema.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
      expect(citate, id).toEqual((riga.proposizioni ?? []).map((_, i) => i + 1));
      const testo = riga.schema.replace(/\{(\d+)\}/g, (_, n: string) => riempi(riga.proposizioni![Number(n) - 1]!));
      expect(testo, id).not.toMatch(/<[VTK?]>|\{\d+\}/);
    }
  });

  it("gli usi di ogni forma sono le proposizioni che la citano, e nessuna forma e' orfana", () => {
    const usi = new Map<string, number>();
    for (const [, riga] of righe) {
      for (const p of riga.proposizioni ?? []) usi.set(p.forma, (usi.get(p.forma) ?? 0) + 1);
    }
    for (const [id, forma] of Object.entries(forme)) {
      expect(usi.get(id) ?? 0, id).toBe(forma.usi);
      expect(Object.values(forma.parti).reduce((a, b) => a + b, 0), id).toBe(forma.usi);
    }
  });

  it("l'id di una forma e' lo SHA-1 del suo testo: sopravvive alle rigenerazioni", () => {
    for (const [id, forma] of Object.entries(forme)) {
      expect(id).toBe("p" + createHash("sha1").update(forma.forma, "utf8").digest("hex").slice(0, 8));
    }
  });

  it("buff e opzioni si legano a ranghi che esistono, e le chiavi sintetiche dicono carta e posizione", () => {
    for (const [tabella, suffisso] of [
      [buff, "b"],
      [opzioni, "o"],
    ] as const) {
      for (const [id, riga] of Object.entries(tabella.righe)) {
        if (riga.carta !== undefined) {
          expect(base.righe[riga.carta], id).toBeDefined();
          if (riga.proposizione === undefined) {
            expect(id, id).toBe(`${riga.carta}.${suffisso}${riga.posizione}`);
          } else {
            // una riga che dice solo la lettura: il posto nella lista dei buff il testo non lo dice
            expect(id, id).toMatch(new RegExp(`^${riga.carta}\\.p${riga.proposizione}(e\\d+)?$`));
            expect(base.righe[riga.carta]!.proposizioni?.[riga.proposizione - 1], id).toBeDefined();
          }
        } else {
          // una chiave di sole cifre e' l'id vero, scritto dentro un tag buff_data_*
          expect(id).toMatch(/^\d+$/);
          for (const carta of riga.carte ?? []) expect(base.righe[carta], `${id} -> ${carta}`).toBeDefined();
        }
      }
    }
  });
});

describe("righe d'effetto delle carte: colonne, fonti e dizionari", () => {
  const segnati = new Set(Object.values(segnaposto).map((s) => s.nel_testo));

  it("ogni colonna riempita ha la sua fonte, e la fonte esiste", () => {
    for (const tabella of [base, buff, opzioni] as Tabella<RigaBase | RigaCollegata>[]) {
      const colonne = new Set(tabella.colonne.map((c) => c.nome));
      for (const [id, riga] of Object.entries(tabella.righe)) {
        for (const campo of Object.keys(riga)) {
          if (colonne.has(campo) || campo === "valore") expect(riga.fonti[campo], `${id}.${campo}`).toBeDefined();
        }
        for (const [campo, fonte] of Object.entries(riga.fonti)) {
          expect(riga[campo], `${id}.${campo}`).toBeDefined();
          if (fonte.startsWith("modello:")) expect(segnati.has(fonte.slice(8)), `${id}: ${fonte}`).toBe(true);
          else if (fonte.startsWith("lettura:")) expect(forme[fonte.slice(8)]?.lettura, `${id}: ${fonte}`).toBeTruthy();
          else expect(["7dshub", "testo"], `${id}: ${fonte}`).toContain(fonte);
        }
      }
    }
  });

  it("slot, gittata, tipo d'attacco e bersaglio hanno una voce in concetti/carte.json", () => {
    for (const [id, riga] of righe) {
      expect(carte["slot"]![riga.slot], id).toBeDefined();
      for (const [campo, dizionario] of [
        ["range_type", "gittate"],
        ["attack_type", "tipi_attacco"],
        ["target", "bersagli"],
      ] as const) {
        if (riga[campo] === undefined) continue;
        expect(carte[dizionario]![String(riga[campo])], `${id}.${campo} = ${riga[campo]}`).toBeDefined();
      }
    }
  });

  it("segnaposto: voci nella forma della base, e ogni colonna esiste nella sua tabella", () => {
    for (const [nome, voce] of Object.entries(segnaposto)) {
      expect(Object.keys(voce.etichetta).sort(), nome).toEqual(["en", "it"]);
      expect(["dichiarato", "dedotto"], nome).toContain(voce.certezza);
      if (voce.certezza === "dedotto") expect(voce.prove.length, nome).toBeGreaterThan(0);
      if (voce.tabella === null) {
        expect(voce.colonna, nome).toBeNull();
        continue;
      }
      const colonne = TABELLE[voce.tabella]!.colonne.map((c) => c.nome);
      for (const c of voce.colonne_possibili) expect(colonne, `${nome}: ${c}`).toContain(c);
      if (voce.colonna !== null) expect(voce.colonne_possibili, nome).toContain(voce.colonna);
    }
  });

  it("gli eroi delle righe sono esattamente quelli del sito", () => {
    const nelleRighe = new Set(righe.flatMap(([, riga]) => riga.eroi));
    expect([...nelleRighe].sort()).toEqual(Object.keys(HERO_CONTEXT.heroes).sort());
  });
});

describe("righe d'effetto delle carte: le letture delle forme", () => {
  // le colonne che una lettura puo' riempire, per tabella (segnaposto.json dice da dove vengono)
  const COLONNE: Record<string, string[]> = {
    base: ["atk_per"],
    buff: ["valore", "buff_turn", "buff_number"],
    opzione: ["valore"],
  };
  const percorso = (p: string) => {
    const [dizionario, chiave] = p.split(".") as ["statistiche" | "gruppi", string];
    return statistiche[dizionario]?.[chiave];
  };
  const riferimenti = (dove: string, x: { statistiche?: string[]; tassonomia?: string[] }) => {
    for (const s of x.statistiche ?? []) expect(percorso(s), `${dove}: ${s}`).toBeDefined();
    for (const t of x.tassonomia ?? []) expect(tassonomia[t], `${dove}: tassonomia ${t}`).toBeDefined();
  };

  it("ogni lettura e' dedotta o verificata, con le prove, e ogni buco che nomina e' del tipo giusto", () => {
    for (const [id, forma] of Object.entries(forme)) {
      if (forma.lettura === null) continue;
      const { effetti, regole, certezza, prove } = forma.lettura;
      // verificata: confermata o corretta dall'utente nella pagina di revisione
      expect(["dedotto", "verificato"], id).toContain(certezza);
      expect(prove.length, id).toBeGreaterThan(0);
      expect(regole.length, id).toBeGreaterThan(0);
      expect(effetti.length, id).toBeGreaterThan(0);
      const buchi = [...forma.forma.matchAll(SLOT)].map((m) => m[1]);
      for (const e of effetti) {
        for (const [colonna, pos] of Object.entries(e.colonne ?? {})) {
          expect(COLONNE[e.tabella ?? ""], `${id}: ${colonna} senza tabella`).toContain(colonna);
          expect(buchi[pos - 1], `${id}: ${colonna} -> buco ${pos}`).toBe("V");
        }
        if (e.bersaglio !== undefined) expect(buchi[e.bersaglio - 1], `${id}: bersaglio`).toBe("T");
        if (e.termine !== undefined) expect(buchi[e.termine - 1], `${id}: termine`).toBe("K");
        if (e.in_base_a !== undefined) expect(percorso(e.in_base_a), `${id}: ${e.in_base_a}`).toBeDefined();
        if (e.a_chi !== undefined) expect([...ENUM_BERSAGLI, "self", "bersaglio"], id).toContain(e.a_chi);
        riferimenti(id, e);
      }
    }
  });

  it("le decisioni della revisione hanno un esito noto, e la base le rispetta", () => {
    const file = path.join(DATI, "effetti/conferme_letture.json");
    const conferme: Record<string, { esito: string; lettura_vista: unknown; lettura?: unknown[] }> = existsSync(file)
      ? JSON.parse(readFileSync(file, "utf8")).conferme
      : {};
    for (const [id, c] of Object.entries(conferme)) {
      expect(["giusta", "sbagliata", "corretta"], id).toContain(c.esito);
      expect(c.lettura_vista === null || Array.isArray(c.lettura_vista), id).toBe(true);
      if (c.esito === "corretta") expect(c.lettura?.length, id).toBeGreaterThan(0);
      const forma = forme[id];
      if (forma === undefined) continue; // una patch ha cambiato la frase: la pipeline la elenca fra le lacune
      expect(forma.revisione?.esito, id).toBe(c.esito);
      if (forma.revisione?.stato === "sbagliata") expect(forma.lettura, id).toBeNull();
      if (forma.revisione?.stato === "confermata" || c.esito === "corretta") expect(forma.lettura?.certezza, id).toBe("verificato");
    }
    for (const [id, forma] of Object.entries(forme)) {
      if (forma.revisione) expect(conferme[id], `${id}: revisione senza decisione`).toBeDefined();
    }
  });

  it("il significato di buff e opzioni viene da forme lette, con riferimenti che esistono", () => {
    for (const tabella of [buff, opzioni]) {
      for (const [id, riga] of Object.entries(tabella.righe)) {
        // una riga nata dalla lettura ha sempre il suo significato
        if (riga.proposizione !== undefined) expect(riga.significato?.length, id).toBeGreaterThan(0);
        for (const voce of riga.significato ?? []) {
          expect(voce.forme.length, id).toBeGreaterThan(0);
          for (const f of voce.forme) expect(forme[f]?.lettura, `${id} -> ${f}`).toBeTruthy();
          // sul rango «bersaglio» e' gia' risolto nel bersaglio scritto nel testo
          if (voce.a_chi !== undefined) expect([...ENUM_BERSAGLI, "self"], id).toContain(voce.a_chi);
          riferimenti(id, voce);
        }
      }
    }
  });
});
