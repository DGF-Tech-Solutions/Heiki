/**
 * Importazione dei cambiamenti di patch di Grand Cross.
 *
 *   npm run cambiamenti:import   (lo lancia anche npm run eroi:import, alla fine)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc)
 * eroi/cambiamenti.json, scritto da `python script/cambiamenti.py` confrontando
 * le patch archiviate da `python script/archivio_patch.py`. Scrive
 * src/lib/games/grand-cross/changes.generated.ts.
 *
 * Si ferma se un eroe dei cambiamenti non e' nel roster (salvo quelli nuovi
 * della patch, che lo sono per forza dopo l'import degli eroi), se una parte o un
 * tipo non e' fra quelli che la pagina sa mostrare, o se un testo cambiato non ha
 * le due lingue: una voce che la pagina non sa dire e' meglio saperla qui.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";
import type {
  ChangeKind,
  ChangePart,
  ChangeSegment,
  ChangesIndex,
  HeroChange,
  HeroTouchup,
  PatchChanges,
} from "../src/lib/games/changes-types";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/cambiamenti.json");
const DEST = resolve(ROOT, "src/lib/games/grand-cross/changes.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

type Bilingue = { it: string | null; en: string | null };

interface SrcVoce {
  parte: string;
  quale: number | null;
  campo: string;
  tipo: string;
  prima: Bilingue | number | null;
  dopo: Bilingue | number | null;
  segmenti?: { it: [string, string][]; en: [string, string][] };
}

interface SrcConfronto {
  da: string;
  a: string;
  eroi_nuovi: number[];
  eroi: Record<string, SrcVoce[]>;
  ritocchi: Record<string, { parte: string; quale: number | null; campo: string }[]>;
  altro: { gruppo: string; nome: { it: string; en: string }; aggiunte: number; tolte: number; cambiate: number }[];
  testi: { nuovi: number; cambiati: number; tolti: number };
}

interface Src {
  patch: { data: string; bundle: string }[];
  confronti: SrcConfronto[];
}

if (!existsSync(SOURCE_JSON)) {
  console.log(`  ${SOURCE_JSON} non trovato: salto i cambiamenti. (si genera con: python script/cambiamenti.py, dentro _7dsgc)\n`);
  process.exit(0);
}

const src = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Src;

const PARTS: readonly ChangePart[] = [
  "nome", "stats", "skillsA", "skillsB", "skillsSpecial", "passive", "taboo", "grace", "solidarity", "ability", "craft",
  "fates", "costume",
];
const KINDS: readonly ChangeKind[] = ["cambiato", "aggiunto", "tolto"];
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const heroIds = new Set(HEROES.map((hero) => hero.id));

function part(value: string, where: string): ChangePart {
  if (!PARTS.includes(value as ChangePart)) fail(`${where}: parte «${value}» sconosciuta`);
  return value as ChangePart;
}

// il «prima» di una voce aggiunta (e il «dopo» di una tolta) arriva come testo
// vuoto in tutte e due le lingue: per la pagina e' «niente», non un testo vuoto
function label(value: Bilingue | number | null): HeroChange["before"] {
  if (value === null || typeof value === "number") return value;
  if (value.it == null && value.en == null) return null;
  return { it: value.it ?? null, en: value.en ?? null } as HeroChange["before"];
}

function segments(value: SrcVoce["segmenti"], where: string): HeroChange["segments"] {
  if (!value) return undefined;
  const one = (list: [string, string][] | undefined, lang: string): ChangeSegment[] => {
    if (!list) fail(`${where}: confronto senza la lingua ${lang}`);
    return list.map(([op, text]) => {
      if (op !== "=" && op !== "-" && op !== "+") fail(`${where}: pezzo «${op}» sconosciuto`);
      return [op, text] as ChangeSegment;
    });
  };
  return { it: one(value.it, "it"), en: one(value.en, "en") };
}

const comparisons: PatchChanges[] = src.confronti.map((c) => {
  if (!DAY.test(c.da) || !DAY.test(c.a)) fail(`date scritte male: ${c.da} -> ${c.a}`);
  const where = `${c.da} -> ${c.a}`;
  const newHeroes = c.eroi_nuovi.map(String);
  for (const id of [...newHeroes, ...Object.keys(c.eroi), ...Object.keys(c.ritocchi)]) {
    if (!heroIds.has(id)) fail(`${where}: l'eroe ${id} non e' nel roster`);
  }
  const heroes: Record<string, HeroChange[]> = {};
  for (const [id, voci] of Object.entries(c.eroi)) {
    heroes[id] = voci.map((v) => {
      const at = `${where}, eroe ${id}, ${v.parte}/${v.quale}/${v.campo}`;
      if (!KINDS.includes(v.tipo as ChangeKind)) fail(`${at}: tipo «${v.tipo}» sconosciuto`);
      if (v.tipo === "cambiato" && typeof v.prima === "object" && v.prima !== null && !v.segmenti) {
        fail(`${at}: testo cambiato senza il confronto parola per parola`);
      }
      const change: HeroChange = {
        part: part(v.parte, at),
        which: v.quale,
        field: v.campo,
        kind: v.tipo as ChangeKind,
        before: label(v.prima),
        after: label(v.dopo),
        ...(v.segmenti ? { segments: segments(v.segmenti, at) } : {}),
      };
      return change;
    });
  }
  const touchups: Record<string, HeroTouchup[]> = {};
  for (const [id, voci] of Object.entries(c.ritocchi)) {
    touchups[id] = voci.map((v) => ({ part: part(v.parte, `${where}, ritocco di ${id}`), which: v.quale, field: v.campo }));
  }
  return {
    from: c.da,
    to: c.a,
    newHeroes,
    heroes,
    touchups,
    other: c.altro.map((g) => ({ group: g.gruppo, name: g.nome, added: g.aggiunte, removed: g.tolte, changed: g.cambiate })),
    texts: { added: c.testi.nuovi, changed: c.testi.cambiati, removed: c.testi.tolti },
  };
});

const index: ChangesIndex = { patches: src.patch.map((p) => p.data), comparisons };

// Un confronto per riga di testa, un eroe per riga: dopo una patch il diff dice
// cosa e' entrato.
const body = comparisons
  .map((c) => {
    const heroes = Object.entries(c.heroes)
      .map(([id, list]) => `      ${JSON.stringify(id)}: ${JSON.stringify(list)},`)
      .join("\n");
    return `  {
    from: ${JSON.stringify(c.from)},
    to: ${JSON.stringify(c.to)},
    newHeroes: ${JSON.stringify(c.newHeroes)},
    heroes: {
${heroes}
    },
    touchups: ${JSON.stringify(c.touchups)},
    other: ${JSON.stringify(c.other)},
    texts: ${JSON.stringify(c.texts)},
  },`;
  })
  .join("\n");

writeFileSync(
  DEST,
  `/**
 * I cambiamenti di Grand Cross da una patch all'altra, eroe per eroe.
 *
 * FONTE: il client, via python script/cambiamenti.py (eroi/cambiamenti.json):
 * le patch archiviate da script/archivio_patch.py, confrontate costruendo le
 * schede degli eroi con lo stesso codice. L'archivio comincia il 23/09/2026.
 *
 * GENERATO da scripts/import-changes.mts: non modificare a mano.
 */

import type { ChangesIndex } from "../changes-types";

export const CHANGES: ChangesIndex = {
  patches: ${JSON.stringify(index.patches)},
  comparisons: [
${body}
  ],
};
`,
  "utf8",
);

for (const c of comparisons) {
  const voci = Object.values(c.heroes).reduce((n, list) => n + list.length, 0);
  console.log(
    `  ${c.from} -> ${c.to}: ${c.newHeroes.length} eroi nuovi, ${Object.keys(c.heroes).length} eroi cambiati (${voci} voci), ` +
      `${Object.keys(c.touchups).length} con ritocchi di formattazione, ${c.other.length} gruppi di altre tabelle`,
  );
}
console.log("");
