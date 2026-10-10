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

/** Un rango: le colonne della sua riga di DB_skill_card_base, e il testo. */
interface RigaBase {
  slot: string;
  rango: number;
  eroi: string[];
  tassonomia?: string[];
  segnaposto?: Record<string, string>;
  proposizioni?: Proposizione[];
  schema?: string;
  [campo: string]: unknown;
}

/** Una frase fra parentesi che precisa la frase prima, unita alla sua riga: «(Limit 3)». */
/** Un testo nelle due lingue: l'inglese della lettura, l'italiano del gioco (o null). */
interface Bilingue {
  it: string | null;
  en: string;
}

interface Precisazione {
  precisa: string;
  forme: string[];
  tassonomia?: string[];
  frase?: Bilingue;
  frase_da?: string;
  condizione?: Bilingue;
  condizione_da?: string;
}

interface Significato {
  effetto: string;
  forme: string[];
  a_chi?: string;
  statistiche?: string[];
  tassonomia?: string[];
  condizione?: Bilingue;
  condizione_da?: string;
  termine?: Bilingue;
  termine_da?: string;
  precisazioni?: Precisazione[];
}

/** Il nome italiano di una condizione, di una precisazione o di un termine, e le varianti del gioco. */
interface Glossario {
  it: string | null;
  varianti: Record<string, number>;
  usi: number;
  ritagliate: number;
  /** solo per i termini: i nomi italiani delle note che li spiegano */
  nomi_delle_note?: Record<string, number>;
}

/** Il legame fra un rango e un suo buff o opzione («<rango>.b<N>»), o un effetto che dice solo il testo («.p»). */
interface RigaCollegata {
  carta?: string;
  posizione?: number;
  id?: number;
  proposizione?: number;
  significato?: Significato[];
  fonti?: Record<string, string>;
  [campo: string]: unknown;
}

/** Una riga vera di DB_skill_card_buff o DB_skill_card_option, con chi la usa. */
interface RigaGioco {
  effect_keyword: string;
  ranghi?: string[];
  da_opzioni?: string[];
  da_buff?: string[];
  nei_testi?: string[];
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
  revisione?: { esito: string; stato: string; da?: string; decisione_superata?: string };
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
const righeBuff = carica<Tabella<RigaGioco>>("effetti/buff.json");
const righeOpzioni = carica<Tabella<RigaGioco>>("effetti/opzioni.json");
const fileForme = carica<{
  forme: Record<string, Forma>;
  condizioni: Record<string, Glossario>;
  precisazioni: Record<string, Glossario>;
  termini: Record<string, Glossario>;
}>("effetti/forme_carte.json");
const forme = fileForme.forme;
const fileSegnaposto = carica<{
  segnaposto: Record<string, Segnaposto>;
  lacune?: { cosa: string; tag?: Record<string, number> }[];
}>("effetti/segnaposto.json");
const segnaposto = fileSegnaposto.segnaposto;
const carte = carica<Record<string, Record<string, unknown>>>("concetti/carte.json");
const fileTassonomia = carica<{ voci: Record<string, unknown>; per_tag: Record<string, string> }>("concetti/tassonomia.json");
const tassonomia = fileTassonomia.voci;
const tassonomiaPerTag = fileTassonomia.per_tag;
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

  it("ogni buff e opzione della lista della carta ha il suo legame, con l'id della riga vera", () => {
    for (const [tabella, suffisso, lista, righeGioco] of [
      [buff, "b", "list_array_buff_id_list", righeBuff],
      [opzioni, "o", "list_array_option_id_list", righeOpzioni],
    ] as const) {
      const legati = new Set<string>();
      for (const [id, riga] of Object.entries(tabella.righe)) {
        const carta = base.righe[riga.carta ?? ""];
        expect(carta, id).toBeDefined();
        if (riga.proposizione === undefined) {
          // l'N-esimo della lista della carta, come il segnaposto {buff_N_val} del modello
          expect(id, id).toBe(`${riga.carta}.${suffisso}${riga.posizione}`);
          expect((carta![lista] as number[])[riga.posizione! - 1], id).toBe(riga.id);
          expect(righeGioco.righe[String(riga.id)], `${id} -> ${riga.id}`).toBeDefined();
          legati.add(id);
        } else {
          // un effetto che dice solo il testo: quale riga del gioco sia il testo non lo dice
          expect(id, id).toMatch(new RegExp(`^${riga.carta}\\.p${riga.proposizione}(e\\d+)?$`));
          expect(carta!.proposizioni?.[riga.proposizione - 1], id).toBeDefined();
          expect(riga.id, id).toBeUndefined();
        }
      }
      for (const [rid, riga] of righe) {
        (riga[lista] as number[]).forEach((_, i) => expect(legati.has(`${rid}.${suffisso}${i + 1}`), rid).toBe(true));
      }
    }
  });

  it("le righe vere di buff e opzioni: chi le usa esiste, e i rimandi portano a righe che ci sono", () => {
    for (const tabella of [righeBuff, righeOpzioni]) {
      for (const [id, riga] of Object.entries(tabella.righe)) {
        expect(typeof riga.effect_keyword, id).toBe("string");
        for (const rid of [...(riga.ranghi ?? []), ...(riga.nei_testi ?? [])]) {
          expect(base.righe[rid], `${id} -> ${rid}`).toBeDefined();
        }
        // una riga c'e' perche' qualcuno la usa
        expect((riga.ranghi ?? []).length + (riga.da_opzioni ?? []).length + (riga.da_buff ?? []).length +
          (riga.nei_testi ?? []).length, id).toBeGreaterThan(0);
      }
    }
    for (const [id, riga] of Object.entries(righeOpzioni.righe)) {
      for (const k of [1, 2, 3, 4, 5]) {
        const b = riga[`use_buff_id_${k}`] as number;
        if (b) expect(righeBuff.righe[String(b)]?.da_opzioni, `${id} -> ${b}`).toContain(id);
      }
    }
    for (const [id, riga] of Object.entries(righeBuff.righe)) {
      for (const o of riga.da_opzioni ?? []) expect(righeOpzioni.righe[o], `${id} <- ${o}`).toBeDefined();
      for (const b of riga.da_buff ?? []) expect(righeBuff.righe[b], `${id} <- ${b}`).toBeDefined();
    }
  });
});

describe("righe d'effetto delle carte: colonne, fonti e dizionari", () => {
  // I nomi dell'enum TAG_SKILLEXPLAIN, piu' i tag che i testi del client usano senza
  // un membro dell'enum, dichiarati nella lacuna di segnaposto.json: dal 08/10
  // l'ultimate di Heimdallr (1010591) porta {effect_val}701903{/effect_val}, che
  // modelli_client.py risolve col valore della passiva 701903, come nelle passive.
  const segnati = new Set([
    ...Object.values(segnaposto).map((s) => s.nel_testo),
    ...(fileSegnaposto.lacune ?? []).flatMap((l) => Object.keys(l.tag ?? {})),
  ]);

  it("le colonne dei ranghi sono della tabella; le righe «.p» hanno i numeri della lettura, con la sua fonte", () => {
    const colonne = new Set(base.colonne.map((c) => c.nome));
    for (const [id, riga] of righe) {
      for (const c of ["range_type", "attack_type", "target", "atk_per", "list_array_buff_id_list", "list_array_option_id_list"]) {
        expect(colonne.has(c), c).toBe(true);
        expect(riga[c], `${id}.${c}`).toBeDefined();
      }
      // i segnaposto del modello: nomi che i testi del client usano
      for (const chiave of Object.keys(riga.segnaposto ?? {})) {
        expect(segnati.has(chiave.split(":")[0]!), `${id}: ${chiave}`).toBe(true);
      }
    }
    for (const tabella of [buff, opzioni]) {
      for (const [id, riga] of Object.entries(tabella.righe)) {
        if (riga.proposizione === undefined) {
          expect(riga.fonti, id).toBeUndefined();
          continue;
        }
        for (const [campo, fonte] of Object.entries(riga.fonti ?? {})) {
          expect(riga[campo], `${id}.${campo}`).toBeDefined();
          expect(fonte, id).toMatch(/^lettura:/);
          expect(forme[fonte.slice(8)]?.lettura, `${id}: ${fonte}`).toBeTruthy();
        }
      }
    }
  });

  it("slot, gittata, tipo d'attacco, bersaglio e tag di ricerca hanno una voce nei dizionari", () => {
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
      const tag = riga["list_array_skill_search_tag"] as number[];
      expect(riga.tassonomia?.length, id).toBe(tag.length);
      tag.forEach((t, i) => {
        expect(tassonomiaPerTag[String(t)], `${id}: tag ${t}`).toBe(riga.tassonomia![i]);
        expect(tassonomia[riga.tassonomia![i]!], `${id}: ${riga.tassonomia![i]}`).toBeDefined();
      });
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

  it("ogni lettura e' dedotta, rivista o verificata, con le prove, e ogni buco che nomina e' del tipo giusto", () => {
    for (const [id, forma] of Object.entries(forme)) {
      if (forma.lettura === null) continue;
      const { effetti, regole, certezza, prove } = forma.lettura;
      // verificata: confermata o corretta dall'utente nella pagina di revisione;
      // rivista: da Claude, coi criteri delle letture che l'utente ha approvato
      expect(["dedotto", "rivisto", "verificato"], id).toContain(certezza);
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

  it("le decisioni della revisione, dell'utente e di Claude, hanno un esito noto, e la base le rispetta", () => {
    type Decisione = { esito: string; lettura_vista: unknown; lettura?: unknown[] };
    const leggi = (nome: string, chiave: string): Record<string, Decisione> => {
      const file = path.join(DATI, "effetti", nome);
      return existsSync(file) ? JSON.parse(readFileSync(file, "utf8"))[chiave] : {};
    };
    const conferme = leggi("conferme_letture.json", "conferme");
    const riviste = leggi("revisione_claude.json", "riviste");
    for (const [id, c] of Object.entries(conferme)) {
      expect(["giusta", "sbagliata", "corretta"], id).toContain(c.esito);
      expect(c.lettura_vista === null || Array.isArray(c.lettura_vista), id).toBe(true);
      if (c.esito === "corretta") expect(c.lettura?.length, id).toBeGreaterThan(0);
      const forma = forme[id];
      if (forma === undefined) continue; // una patch ha cambiato la frase: la pipeline la elenca fra le lacune
      if (forma.revisione?.da === "claude") {
        // l'utente aveva deciso su una lettura che le regole non danno piu', e Claude ha rivisto quella nuova
        expect(forma.revisione.decisione_superata, id).toBe(c.esito);
        expect(c.esito, `${id}: una correzione dell'utente vale sempre`).not.toBe("corretta");
        continue;
      }
      expect(forma.revisione?.esito, id).toBe(c.esito);
      if (forma.revisione?.stato === "sbagliata") expect(forma.lettura, id).toBeNull();
      if (forma.revisione?.stato === "confermata" || c.esito === "corretta") expect(forma.lettura?.certezza, id).toBe("verificato");
    }
    for (const [id, r] of Object.entries(riviste)) {
      // Claude dice giusta o dubbia: una lettura sbagliata si toglie cambiando le regole
      expect(["giusta", "dubbia"], id).toContain(r.esito);
      expect(Array.isArray(r.lettura_vista), id).toBe(true);
      const forma = forme[id];
      if (forma?.revisione?.da !== "claude") continue;
      expect(forma.revisione.esito, id).toBe(r.esito);
      expect(forma.lettura?.certezza, id).toBe(r.esito === "giusta" ? "rivisto" : "dedotto");
    }
    for (const [id, forma] of Object.entries(forme)) {
      if (forma.revisione?.da === "claude") expect(riviste[id], `${id}: revisione di Claude senza voce`).toBeDefined();
      else if (forma.revisione) expect(conferme[id], `${id}: revisione senza decisione`).toBeDefined();
      if (forma.lettura?.certezza === "rivisto") expect(forma.revisione?.stato, id).toBe("rivista da Claude");
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
          // una precisazione fra parentesi viene anche lei da una forma letta come precisazione
          for (const p of voce.precisazioni ?? []) {
            expect(["limite", "cumulabile", "esclude", "include"], id).toContain(p.precisa);
            for (const f of p.forme) {
              expect(forme[f]?.lettura?.effetti.some((e) => e.effetto === "precisazione"), `${id} -> ${f}`).toBe(true);
            }
            riferimenti(id, p);
          }
        }
      }
    }
  });

  it("condizioni, precisazioni e termini hanno l'italiano della loro carta o delle altre carte, e il glossario le nomina", () => {
    // 1 se il testo ha l'italiano, 0 se no
    const bilingue = (id: string, testo: Bilingue | undefined, da: string | undefined, glossario: Record<string, Glossario>) => {
      if (testo === undefined) return 0;
      expect(typeof testo.en, id).toBe("string");
      const voce = glossario[testo.en];
      expect(voce, `${id}: «${testo.en}» fuori dal glossario`).toBeDefined();
      if (testo.it === null) {
        expect(da, id).toBeUndefined();
        return 0;
      }
      expect(["testo della carta", "altre carte", "nome della nota"], id).toContain(da);
      // dalle altre carte e' il nome del glossario; dal nome della nota, uno dei nomi delle note del
      // termine; dal testo della carta, una delle varianti del gioco
      if (da === "altre carte") expect(testo.it, id).toBe(voce!.it);
      else if (da === "nome della nota") expect(voce!.nomi_delle_note?.[testo.it], id).toBeGreaterThan(0);
      else expect(voce!.varianti[testo.it], `${id}: «${testo.it}» non e' fra le varianti`).toBeGreaterThan(0);
      return 1;
    };
    let conItaliano = 0;
    for (const tabella of [buff, opzioni]) {
      for (const [id, riga] of Object.entries(tabella.righe)) {
        for (const voce of riga.significato ?? []) {
          conItaliano += bilingue(id, voce.condizione, voce.condizione_da, fileForme.condizioni);
          conItaliano += bilingue(id, voce.termine, voce.termine_da, fileForme.termini);
          for (const p of voce.precisazioni ?? []) {
            conItaliano += bilingue(id, p.frase, p.frase_da, fileForme.precisazioni);
            conItaliano += bilingue(id, p.condizione, p.condizione_da, fileForme.condizioni);
          }
        }
      }
    }
    expect(conItaliano).toBeGreaterThan(0);
    // il nome e' la variante piu' usata, e le varianti vengono dai ritagli
    for (const glossario of [fileForme.condizioni, fileForme.precisazioni, fileForme.termini]) {
      for (const [en, voce] of Object.entries(glossario)) {
        const usi = Object.values(voce.varianti);
        expect(usi.reduce((a, b) => a + b, 0), en).toBe(voce.ritagliate);
        expect(voce.ritagliate, en).toBeLessThanOrEqual(voce.usi);
        if (voce.it === null) expect(usi.length, en).toBe(0);
        else expect(voce.varianti[voce.it], en).toBe(Math.max(...usi));
      }
    }
  });
});
