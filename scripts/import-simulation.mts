/**
 * Importazione dei dati del simulatore delle statistiche al primo turno
 * (src/lib/games/grand-cross/simulation.ts).
 *
 *   npm run simulazione:import    (lo lancia anche npm run eroi:import, in coda)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/simulazione.json   python script/simulazione_dati.py
 *
 * il pacchetto delle tabelle del gioco e delle regole che il simulatore legge (solo
 * le righe e le colonne che servono), e scrive:
 *
 *   src/lib/games/grand-cross/simulation.generated.ts
 *
 * Non traduce niente: le righe tengono i nomi di colonna del client e le regole le
 * chiavi del loro schema (SCHEMA.md della pipeline), come le legge simula.py. Le
 * parole delle regole diventano liste [parola, voci] perche' il loro ordine conta
 * (a pari indirizzo vince la prima): in un oggetto JavaScript una chiave che sembra
 * un intero passerebbe davanti, e l'import si ferma se ne trova una. I caratteri
 * fuori dall'ASCII (i nomi offuscati del client) si scrivono in escape.
 *
 * Se il JSON manca non tocca niente.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { HERO_STATS } from "../src/lib/games/grand-cross/hero-stats.generated";
import type { SimData, SimJson, SimNode, SimWord } from "../src/lib/games/grand-cross/simulation-types";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/simulazione.json");
const DEST = resolve(ROOT, "src/lib/games/grand-cross/simulation.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

interface Source {
  meta: SimNode;
  eroi: SimNode[];
  esclusive: SimNode[];
  skin: SimNode[];
  reliquie: SimNode[];
  passive: SimNode[];
  buff: SimNode[];
  regole: {
    parole: Record<string, SimNode[]>;
    buff: Record<string, SimNode[]>;
    dare_buff: SimNode[];
    cariche_primo_turno: SimNode[];
    togli_buff: SimNode[];
  };
}

if (!existsSync(SOURCE_JSON)) {
  console.log(`  simulazione.json non trovato: salto il simulatore.`);
  console.log(`  (si genera con: python script\\simulazione_dati.py, dentro _7dsgc)`);
  process.exit(0);
}

const source = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Source;

/* ------------------------------------------------------------- i controlli -- */

for (const key of ["eroi", "esclusive", "skin", "reliquie", "passive", "buff", "regole"] as const) {
  if (!source[key]) fail(`simulazione.json senza «${key}»: rilanciare python script\\simulazione_dati.py`);
}

/** Le parole in ordine: Object.entries rispetta l'inserimento solo se nessuna chiave sembra un intero. */
function words(record: Record<string, SimNode[]>, where: string): SimWord[] {
  const out = Object.entries(record);
  for (const [kw, voci] of out) {
    if (/^\d+$/.test(kw)) fail(`${where}: la parola «${kw}» sembra un intero, l'ordine non sarebbe quello del file`);
    for (const v of voci) {
      const at = String(v.ordine ?? "").trim().split(/\s+/)[0] ?? "";
      if (Number.isNaN(Number.parseInt(at, 16))) fail(`${where} ${kw}: ordine illeggibile «${String(v.ordine)}»`);
    }
  }
  return out;
}

for (const [table, col] of [["eroi", "id"], ["esclusive", "hero_id"], ["passive", "id"], ["buff", "id"], ["skin", "id"]] as const) {
  const seen = new Set<SimJson>();
  for (const row of source[table]) {
    const id = row[col];
    if (typeof id !== "number") fail(`${table}: riga senza ${col} numerico (${JSON.stringify(row).slice(0, 80)})`);
    if (seen.has(id)) fail(`${table}: ${col} ${id} ripetuto`);
    seen.add(id);
  }
}

const data: SimData = {
  meta: source.meta,
  heroes: source.eroi,
  exclusives: source.esclusive,
  skins: source.skin,
  relics: source.reliquie,
  passives: source.passive,
  buffs: source.buff,
  rules: {
    words: words(source.regole.parole, "parole"),
    buffWords: words(source.regole.buff, "buff"),
    giveBuff: source.regole.dare_buff,
    charges: source.regole.cariche_primo_turno,
    removeBuff: source.regole.togli_buff,
  },
};

/* --------------------------------------------------------------- scrittura -- */

/** JSON in una riga, coi caratteri fuori dall'ASCII in escape */
function json(value: unknown): string {
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

function rows(name: string, list: readonly unknown[]): string[] {
  return [`  ${name}: [`, ...list.map((r) => `    ${json(r)},`), "  ],"];
}

const steps = Object.entries(HERO_STATS).flatMap(([id, entry]) => (entry.steps ? [[id, entry.steps] as const] : []));
const voci = data.rules.words.reduce((n, [, v]) => n + v.length, 0);
const buffVoci = data.rules.buffWords.reduce((n, [, v]) => n + v.length, 0);
const body = [
  `export const SIMULATION_DATA: SimData = {`,
  `  meta: ${json(data.meta)},`,
  ...rows("heroes", data.heroes),
  ...rows("exclusives", data.exclusives),
  ...rows("skins", data.skins),
  ...rows("relics", data.relics),
  ...rows("passives", data.passives),
  ...rows("buffs", data.buffs),
  "  rules: {",
  "    words: [",
  ...data.rules.words.map((w) => `      ${json(w)},`),
  "    ],",
  "    buffWords: [",
  ...data.rules.buffWords.map((w) => `      ${json(w)},`),
  "    ],",
  "    giveBuff: [",
  ...data.rules.giveBuff.map((v) => `      ${json(v)},`),
  "    ],",
  "    charges: [",
  ...data.rules.charges.map((v) => `      ${json(v)},`),
  "    ],",
  "    removeBuff: [",
  ...data.rules.removeBuff.map((v) => `      ${json(v)},`),
  "    ],",
  "  },",
  "};",
  "",
  // I gradini delle statistiche di ogni eroe, per i numeri d'inizio (team-start.ts):
  // stanno qui e non si prendono da hero-stats.generated.ts perche' la pagina Squadra
  // li scarica solo quando servono, insieme al simulatore (team-sim-load.ts), e
  // quel file pesa il doppio (anche massimi ed equipaggiamento). Li scrive
  // import-heroes.mts, che in eroi:import gira prima di questo.
  "export const SIMULATION_STEPS: Readonly<Record<string, HeroStatSteps>> = {",
  ...steps.map(([id, s]) => `  ${json(id)}: ${json(s)},`),
  "};",
  "",
].join("\n");

const header = [
  "/**",
  " * GENERATO da scripts/import-simulation.mts: non modificare a mano.",
  " *",
  " * I dati del simulatore delle statistiche al primo turno (simulation.ts): le righe",
  " * delle tabelle del gioco e le regole che il motore legge, nella forma di",
  " * simulation-types.ts. Fonte: _7dsgc/eroi/simulazione.json (python",
  " * script/simulazione_dati.py), dalle tabelle del client e da regole_parole.json.",
  " *",
  ` * ${data.heroes.length} eroi, ${data.passives.length} passive, ${data.buffs.length} buff; regole: ${data.rules.words.length} parole (${voci} voci),`,
  ` * ${data.rules.buffWords.length} parole di buff (${buffVoci} voci), ${data.rules.giveBuff.length} voci di dare_buff, ${data.rules.charges.length} di cariche.`,
  ` * In fondo i gradini delle statistiche di ${steps.length} eroi (da hero-stats.generated.ts).`,
  " */",
  "",
  'import type { HeroStatSteps } from "../types";',
  'import type { SimData } from "./simulation-types";',
  "",
  "",
].join("\n");

const text = header + body;
writeFileSync(DEST, text);
const raw = Buffer.byteLength(text);
const zipped = gzipSync(text, { level: 9 }).length;

console.log(`  simulatore: ${data.heroes.length} eroi, ${data.passives.length} passive, ${data.buffs.length} buff`);
console.log(`  regole: ${data.rules.words.length} parole (${voci} voci), ${data.rules.buffWords.length} parole di buff (${buffVoci} voci)`);
console.log(`  peso: ${(raw / 1024).toFixed(1)} KB, gzip ${(zipped / 1024).toFixed(1)} KB`);
console.log(`  scritto ${DEST}`);
