/**
 * Importazione delle meccaniche di combattimento di Grand Cross: le costanti del
 * danno, il triangolo degli attributi, i pesi di pesca e gli effetti Luce/Oscurita'
 * di ogni eroe, il cumulo dei buff per concetto delle parole blu.
 *
 *   npm run meccaniche:import   (lo lancia anche npm run eroi:import, dopo le parole blu)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/meccaniche.json   python script/meccaniche.py
 *
 * e scrive src/lib/games/grand-cross/mechanics.generated.ts.
 *
 * Si ferma se un riferimento non torna: un eroe che il roster non ha, un eroe del
 * roster senza pesi di pesca, un concetto che le parole blu non conoscono, una
 * regola di cumulo che il sito non sa dire. Se il JSON manca non tocca niente.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { MechanicsIndex, MechanicsStacking, StackingRule } from "../src/lib/games/mechanics-types";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";
import { HERO_TERMS } from "../src/lib/games/grand-cross/hero-terms.generated";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/meccaniche.json");
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "mechanics.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

interface SrcEffect {
  passiva: number;
  stesso_attributo: number;
  altri_alleati: number;
}

interface Src {
  config: {
    equilibrio_a: number;
    equilibrio_b: number;
    varianza_valori: number[];
    critico_base: number;
    vantaggio: number;
    svantaggio: number;
    smash_pesca: number;
  };
  codice: {
    batte: Record<string, number>;
    fuori_dal_triangolo: number[];
    differenza_minima: number;
    danno_minimo: number;
    minimo_statistiche: number;
    mano: Record<"con_panchina" | "tutti_in_campo", { massimo: number; sottrazione: number }>;
  };
  pesca: Record<string, [number, number]>;
  luce_oscurita: Record<string, { luce?: SrcEffect; oscurita?: SrcEffect }>;
  cumulo: Record<string, { regola: string; limite: number; carte: number }[]>;
}

if (!existsSync(SOURCE_JSON)) {
  console.log(`  ${SOURCE_JSON} non trovato: salto le meccaniche. (si genera con: python script/meccaniche.py, dentro _7dsgc)\n`);
  process.exit(0);
}

const src = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Src;
const RULES: readonly StackingRule[] = ["piu_forte", "piu_basso", "accumula", "cariche"];

const heroIds = new Set(HEROES.map((hero) => hero.id));
for (const id of Object.keys(src.pesca)) if (!heroIds.has(id)) fail(`pesca: l'eroe ${id} non e' nel roster`);
for (const id of heroIds) if (!src.pesca[id]) fail(`pesca: l'eroe ${id} del roster non ha pesi`);
for (const id of Object.keys(src.luce_oscurita)) if (!heroIds.has(id)) fail(`luce/oscurita': l'eroe ${id} non e' nel roster`);

const effect = (e: SrcEffect | undefined) =>
  e ? { passive: e.passiva, sameAttribute: e.stesso_attributo, otherAllies: e.altri_alleati } : undefined;

const stacking: Record<string, MechanicsStacking[]> = {};
for (const [concept, rules] of Object.entries(src.cumulo)) {
  if (!HERO_TERMS.concepts[concept]) fail(`cumulo: il concetto ${concept} non e' fra quelli delle parole blu`);
  stacking[concept] = rules.map((r) => {
    if (!RULES.includes(r.regola as StackingRule)) fail(`cumulo di ${concept}: regola ${r.regola} sconosciuta`);
    return { rule: r.regola as StackingRule, limit: r.limite, cards: r.carte };
  });
}

const beats = Object.fromEntries(Object.entries(src.codice.batte).map(([k, v]) => [k, v]));
if (Object.keys(beats).sort().join() !== Object.values(beats).map(String).sort().join()) {
  fail(`il triangolo non e' un giro: ${JSON.stringify(beats)}`);
}

const index: MechanicsIndex = {
  config: {
    balanceA: src.config.equilibrio_a,
    balanceB: src.config.equilibrio_b,
    variance: src.config.varianza_valori,
    critBase: src.config.critico_base,
    advantage: src.config.vantaggio,
    disadvantage: src.config.svantaggio,
    smashDraw: src.config.smash_pesca,
  },
  code: {
    beats,
    outsideTriangle: src.codice.fuori_dal_triangolo,
    minDifference: src.codice.differenza_minima,
    minDamage: src.codice.danno_minimo,
    minStats: src.codice.minimo_statistiche,
    hand: {
      bench: { max: src.codice.mano.con_panchina.massimo, sub: src.codice.mano.con_panchina.sottrazione },
      allIn: { max: src.codice.mano.tutti_in_campo.massimo, sub: src.codice.mano.tutti_in_campo.sottrazione },
    },
  },
  draw: Object.fromEntries(
    HEROES.map((hero) => [hero.id, src.pesca[hero.id]!] as const),
  ) as MechanicsIndex["draw"],
  teamEffects: Object.fromEntries(
    Object.entries(src.luce_oscurita).map(([id, e]) => [id, { light: effect(e.luce), dark: effect(e.oscurita) }]),
  ),
  stacking,
};

// Una riga per eroe e per concetto: dopo una patch il diff dice cosa e' cambiato.
const lines = (record: Record<string, unknown>) =>
  Object.entries(record)
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join("\n");

writeFileSync(
  DEST_DATA,
  `/**
 * Le meccaniche di combattimento di Grand Cross: le costanti del danno, il
 * triangolo degli attributi, i pesi di pesca e gli effetti Luce/Oscurita' di ogni
 * eroe, il cumulo dei buff per concetto delle parole blu.
 *
 * FONTE: il client, via python script/meccaniche.py (eroi/meccaniche.json): le
 * costanti da DB_config_game, le regole lette nel codice del client
 * (MECCANICHE_COMBATTIMENTO.md nella pipeline), i pesi da DB_skin_skill, gli effetti
 * da DB_skin_exclusive_passive e DB_skill_passive, il cumulo da overlap_type e
 * overlap_limit dei buff delle carte (legati ai concetti per nome).
 *
 * GENERATO DA scripts/import-mechanics.mts - NON MODIFICARE A MANO.
 */

import type { MechanicsIndex } from "../mechanics-types";

const DRAW: MechanicsIndex["draw"] = {
${lines(index.draw)}
};

const TEAM_EFFECTS: MechanicsIndex["teamEffects"] = {
${lines(index.teamEffects)}
};

const STACKING: MechanicsIndex["stacking"] = {
${lines(index.stacking)}
};

export const MECHANICS: MechanicsIndex = {
  config: ${JSON.stringify(index.config)},
  code: ${JSON.stringify(index.code)},
  draw: DRAW,
  teamEffects: TEAM_EFFECTS,
  stacking: STACKING,
};
`,
  "utf8",
);

const pairs = new Map<string, number>();
for (const [a, b] of Object.values(index.draw)) pairs.set(`${a}/${b}`, (pairs.get(`${a}/${b}`) ?? 0) + 1);
console.log(`  pesca: ${Object.keys(index.draw).length} eroi (${[...pairs].map(([k, n]) => `${k}: ${n}`).join(", ")})`);
console.log(`  effetti Luce/Oscurita': ${Object.keys(index.teamEffects).length} eroi`);
console.log(
  `  cumulo: ${Object.keys(stacking).length} concetti, ${Object.values(stacking).filter((r) => r.length > 1).length} con piu' regole\n`,
);
