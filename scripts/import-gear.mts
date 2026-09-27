/**
 * Importazione dell'equipaggiamento e dei costumi di Grand Cross, per il
 * calcolatore della scheda eroe e la scheda Costumi.
 *
 *   npm run equipaggiamento:import   (lo lancia anche npm run eroi:import, dopo gli eroi)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/equipaggiamento.json   python script/equipaggiamento.py: set, parti, valori,
 *                               effetti bonus, e come si impilano gli strati delle icone
 *   equipaggiamento/            gli strati (sfondo, cornice, lettera, stelle, «+N», set,
 *                               marchi), le immagini dei pezzi e degli slot vuoti
 *   eroi/costumi.json           python script/costumi.py: i costumi, la scala del
 *                               potenziamento, e per ogni eroe posti e costumi
 *   costumi/                    le immagini dei costumi
 *
 * e scrive:
 *
 *   src/lib/games/grand-cross/gear.generated.ts
 *   src/lib/games/grand-cross/costumes.generated.ts
 *   public/eroi/grand-cross/equipaggiamento/, costumi/   immagini, NON versionate
 *
 * Si ferma se un riferimento non torna: un eroe dei costumi che non e' nel
 * roster, un costume citato che non c'e', uno strato dell'icona che manca, una
 * parte senza i valori di tutte le rarita', un set senza il suo glifo. E se i
 * costumi di partenza al massimo non ridanno i costumi delle statistiche
 * (HeroStatSteps.costumes): il calcolatore partirebbe da numeri diversi dalla
 * scheda. Se i JSON mancano non tocca niente.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Costume, CostumeIndex, CostumeKind, GearIndex, PassiveMode } from "../src/lib/games/gear-types";
import { costumeFlat, costumeMaxStep } from "../src/lib/games/gear";
import type { HeroLabel } from "../src/lib/games/types";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";
import { HERO_STATS } from "../src/lib/games/grand-cross/hero-stats.generated";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_GEAR = resolve(SOURCE, "eroi/equipaggiamento.json");
const SOURCE_COSTUMES = resolve(SOURCE, "eroi/costumi.json");
const SOURCE_GEAR_IMAGES = resolve(SOURCE, "equipaggiamento");
const SOURCE_COSTUME_IMAGES = resolve(SOURCE, "costumi");
const DEST_GEAR_IMAGES = resolve(ROOT, "public/eroi", GAME, "equipaggiamento");
const DEST_COSTUME_IMAGES = resolve(ROOT, "public/eroi", GAME, "costumi");
const DEST_GEAR = resolve(ROOT, "src/lib/games", GAME, "gear.generated.ts");
const DEST_COSTUMES = resolve(ROOT, "src/lib/games", GAME, "costumes.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

interface SrcLabel {
  it: string | null;
  en: string | null;
}

type SrcMode = "per" | "punti" | "piu";

interface SrcGear {
  regole: { miglioramenti_per_risveglio: number; risvegli: number; passo_effetti: number; rarita_ottenibili: number[] };
  set: { id: number; nome: SrcLabel; pezzi: number; stat: string; modo: SrcMode; valore: number; ottenibile: boolean }[];
  parti: { parte: number; nome: SrcLabel; stat: "atk" | "def" | "hp"; gruppo: number }[];
  valori: Record<string, Record<string, { min: number; max: number; passo: number }>>;
  effetti: { id: number; gruppo: number; nome: SrcLabel; stat: string; modo: SrcMode; min: number; max: number }[];
  immagini: {
    lato: number;
    riquadro_oggetto: [number, number, number, number];
    riquadro_set: [number, number, number, number];
    ordine: { equipaggiamento: string[]; costume: string[] };
    rarita: Record<string, string>;
    file: Record<string, string>;
    slot: Record<string, string>;
    pezzi: Record<string, string>;
  };
}

interface SrcCostume {
  tipo: 1 | 2 | 3;
  rarita: number;
  nome: SrcLabel;
  descrizione: SrcLabel;
  percentuali: Record<string, number>;
  set?: number;
  condiviso?: boolean;
  icona?: string;
}

interface SrcCostumes {
  scala: Record<string, Record<string, [number, number, number]>>;
  tipi: Record<string, { statistica: "atk" | "def" | "hp" }>;
  set: Record<string, { nome: SrcLabel }>;
  costumi: Record<string, SrcCostume>;
  eroi: Record<
    string,
    {
      posti: { corpo: number; arma: number; testa: number; reliquia: number };
      corpo: number[];
      arma: number[];
      testa: number[];
      partenza: { corpo: number[]; arma: number[]; testa: number[] };
    }
  >;
}

if (!existsSync(SOURCE_GEAR) || !existsSync(SOURCE_COSTUMES)) {
  console.log(`  ${SOURCE_GEAR} o ${SOURCE_COSTUMES} non trovati: salto equipaggiamento e costumi.`);
  console.log(`  (si generano con: python script/equipaggiamento.py e python script/costumi.py, dentro _7dsgc)\n`);
  process.exit(0);
}

const gear = JSON.parse(readFileSync(SOURCE_GEAR, "utf8")) as SrcGear;
const costumes = JSON.parse(readFileSync(SOURCE_COSTUMES, "utf8")) as SrcCostumes;

const MODE: Record<SrcMode, PassiveMode> = { per: "percent", punti: "points", piu: "flat" };
const KIND: Record<string, CostumeKind> = { "1": "body", "2": "weapon", "3": "head" };
const KIND_IT: Record<CostumeKind, "corpo" | "arma" | "testa"> = { body: "corpo", weapon: "arma", head: "testa" };

function label(value: SrcLabel | null | undefined, what: string): HeroLabel {
  if (!value?.it || !value.en) fail(`${what}: manca una delle due lingue (${JSON.stringify(value)})`);
  return { it: value.it, en: value.en };
}

/** una descrizione con una lingua sola prende l'altra; senza nessuna, non c'e' */
function optionalLabel(value: SrcLabel | null | undefined): HeroLabel | undefined {
  const it = value?.it ?? value?.en;
  const en = value?.en ?? value?.it;
  return it && en ? { it, en } : undefined;
}

/* ------------------------------------------------------------ equipaggiamento -- */

const images = gear.immagini;
const layers = Object.keys(images.file).sort();
const needed = [
  ...[1, 2, 3, 4, 5, 6, 7].flatMap((r) => [`sfondo_${r}`, `cornice_${r}`, `lettera_${r}`]),
  ...[1, 2, 3, 4, 5].flatMap((n) => [`stelle_${n}`, `piu_${n}`]),
  "esagono",
  "marchio_costume",
  "marchio_set",
  "marchio_condiviso",
  ...gear.set.map((s) => `set_${s.id}`),
];
for (const layer of needed) {
  if (!images.file[layer]) fail(`manca lo strato ${layer} delle icone`);
  if (!existsSync(resolve(SOURCE_GEAR_IMAGES, images.file[layer]!))) fail(`manca il file dello strato ${layer}`);
}
for (const order of [images.ordine.equipaggiamento, images.ordine.costume]) {
  if (!order.includes("oggetto")) fail(`l'ordine degli strati ${order.join(", ")} non ha l'oggetto`);
}
for (const part of gear.parti) {
  for (let rating = 1; rating <= 6; rating++) {
    if (!gear.valori[String(part.parte)]?.[String(rating)]) fail(`parte ${part.parte}: mancano i valori della rarita' ${rating}`);
  }
  if (!gear.effetti.some((option) => option.gruppo === part.gruppo && option.stat === part.stat && option.modo === "per")) {
    fail(`parte ${part.parte}: nessun effetto bonus della sua statistica in percentuale`);
  }
}

const gearIndex: GearIndex = {
  rules: {
    upgradesPerAwakening: gear.regole.miglioramenti_per_risveglio,
    awakenings: gear.regole.risvegli,
    optionStep: gear.regole.passo_effetti,
    obtainableRatings: gear.regole.rarita_ottenibili,
  },
  sets: gear.set.map((s) => ({
    id: s.id,
    name: label(s.nome, `set ${s.id}`),
    pieces: s.pezzi,
    stat: s.stat,
    mode: MODE[s.modo],
    value: s.valore,
    obtainable: s.ottenibile,
  })),
  parts: gear.parti.map((p) => ({ part: p.parte, name: label(p.nome, `parte ${p.parte}`), stat: p.stat, group: p.gruppo })),
  values: Object.fromEntries(
    Object.entries(gear.valori).map(([part, byRating]) => [
      part,
      Object.fromEntries(Object.entries(byRating).map(([rating, v]) => [rating, { min: v.min, max: v.max, step: v.passo }])),
    ]),
  ),
  options: gear.effetti.map((o) => ({
    id: o.id,
    group: o.gruppo,
    name: label(o.nome, `effetto bonus ${o.id}`),
    stat: o.stat,
    mode: MODE[o.modo],
    min: o.min,
    max: o.max,
  })),
  icons: {
    size: images.lato,
    objectBox: images.riquadro_oggetto,
    setBox: images.riquadro_set,
    order: { gear: images.ordine.equipaggiamento, costume: images.ordine.costume },
    rarity: images.rarita,
    layers,
  },
  pieceImages: Object.keys(images.pezzi).sort(),
  slotImages: Object.keys(images.slot).map(Number).sort((a, b) => a - b),
};

/* ------------------------------------------------------------------- costumi -- */

const heroIds = new Set(HEROES.map((hero) => hero.id));
const costumeIndex: CostumeIndex = {
  flatStat: { body: costumes.tipi["1"]!.statistica, weapon: costumes.tipi["2"]!.statistica, head: costumes.tipi["3"]!.statistica },
  scale: {
    body: costumes.scala["1"]!,
    weapon: costumes.scala["2"]!,
    head: costumes.scala["3"]!,
  },
  sets: Object.fromEntries(Object.entries(costumes.set).map(([id, s]) => [id, { name: label(s.nome, `set di costumi ${id}`) }])),
  costumes: Object.fromEntries(
    Object.entries(costumes.costumi).map(([id, c]) => {
      const costume: Costume = {
        kind: KIND[String(c.tipo)] ?? fail(`costume ${id}: tipo ${c.tipo}`),
        rarity: c.rarita,
        ...(optionalLabel(c.nome) ? { name: optionalLabel(c.nome) } : {}),
        ...(optionalLabel(c.descrizione) ? { description: optionalLabel(c.descrizione) } : {}),
        percents: c.percentuali,
        ...(c.set ? { set: c.set } : {}),
        ...(c.condiviso ? { shared: true as const } : {}),
        icon: Boolean(c.icona),
      };
      if (c.set && !costumes.set[String(c.set)]) fail(`costume ${id}: il set ${c.set} non c'e'`);
      return [id, costume];
    }),
  ),
  heroes: {},
};

const heroes: Record<string, CostumeIndex["heroes"][string]> = {};
for (const [hero, h] of Object.entries(costumes.eroi)) {
  if (!heroIds.has(hero)) fail(`l'eroe ${hero} dei costumi non e' nel roster`);
  const ids = (list: number[], what: string) =>
    list.map((id) => {
      if (!costumeIndex.costumes[String(id)]) fail(`${hero}: il costume ${id} (${what}) non c'e'`);
      return String(id);
    });
  heroes[hero] = {
    slots: { body: h.posti.corpo, weapon: h.posti.arma, head: h.posti.testa, relic: h.posti.reliquia },
    all: { body: ids(h.corpo, "corpo"), weapon: ids(h.arma, "arma"), head: ids(h.testa, "testa") },
    start: {
      body: ids(h.partenza.corpo, "partenza"),
      weapon: ids(h.partenza.arma, "partenza"),
      head: ids(h.partenza.testa, "partenza"),
    },
  };
}
const index: CostumeIndex = { ...costumeIndex, heroes };

// Il controllo che conta: i costumi di partenza, al massimo, ridanno i costumi
// delle statistiche della scheda. Se no il calcolatore partirebbe da numeri
// diversi da quelli che la scheda ha sempre mostrato.
let checked = 0;
for (const hero of HEROES) {
  const h = heroes[hero.id];
  const steps = HERO_STATS[hero.id]?.steps;
  if (!h || !steps) continue;
  const total: Record<string, number> = {};
  for (const kind of ["body", "weapon", "head"] as const) {
    for (const id of h.start[kind]) {
      const costume = index.costumes[id]!;
      const flat = index.flatStat[kind];
      total[flat] = (total[flat] ?? 0) + costumeFlat(index, costume, costumeMaxStep(index, costume));
      for (const [key, value] of Object.entries(costume.percents)) total[key] = (total[key] ?? 0) + value;
    }
  }
  for (const key of new Set([...Object.keys(total), ...Object.keys(steps.costumes)])) {
    if (Math.abs((total[key] ?? 0) - (steps.costumes[key] ?? 0)) > 1e-6) {
      fail(`${hero.id}: i costumi di partenza al massimo danno ${key} ${total[key] ?? 0}, le statistiche ${steps.costumes[key] ?? 0}`);
    }
  }
  checked++;
}

/* --------------------------------------------------------------- immagini -- */

function copyDir(from: string, to: string, files: string[]) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  for (const file of files) {
    const target = resolve(to, file);
    mkdirSync(resolve(target, ".."), { recursive: true });
    copyFileSync(resolve(from, file), target);
  }
}

copyDir(SOURCE_GEAR_IMAGES, DEST_GEAR_IMAGES, [
  ...Object.values(images.file),
  ...Object.values(images.pezzi),
  ...Object.values(images.slot),
]);
const costumeFiles = Object.values(costumes.costumi).flatMap((c) => (c.icona ? [c.icona] : []));
copyDir(SOURCE_COSTUME_IMAGES, DEST_COSTUME_IMAGES, costumeFiles);
const published = readdirSync(DEST_COSTUME_IMAGES).length;
if (published !== costumeFiles.length) fail(`costumi: ${published} immagini pubblicate su ${costumeFiles.length}`);

/* ------------------------------------------------------------ file generati -- */

writeFileSync(
  DEST_GEAR,
  `/**
 * L'equipaggiamento di Grand Cross: set, parti, valori per rarita', effetti bonus,
 * e come si impilano gli strati delle icone.
 *
 * FONTE: il client, via python script/equipaggiamento.py (eroi/equipaggiamento.json;
 * lo studio e' EQUIPAGGIAMENTO.md nella radice della pipeline).
 *
 * GENERATO DA scripts/import-gear.mts - NON MODIFICARE A MANO.
 */

import type { GearIndex } from "../gear-types";

export const GEAR: GearIndex = ${JSON.stringify(gearIndex, null, 2)};
`,
  "utf8",
);

// Un costume per riga: dopo una patch il diff dice quali sono nuovi o cambiati.
const costumeLines = Object.entries(index.costumes)
  .map(([id, c]) => `  ${JSON.stringify(id)}: ${JSON.stringify(c)},`)
  .join("\n");
const heroLines = Object.entries(index.heroes)
  .map(([id, h]) => `  ${JSON.stringify(id)}: ${JSON.stringify(h)},`)
  .join("\n");

writeFileSync(
  DEST_COSTUMES,
  `/**
 * I costumi di Grand Cross: ognuno con rarita', percentuali, nome e descrizione;
 * la scala del potenziamento; per ogni eroe i posti di registrazione, tutti i
 * suoi costumi e i cinque di partenza del calcolatore.
 *
 * FONTE: il client, via python script/costumi.py (eroi/costumi.json; lo studio
 * e' COSTUMI_ASSOCIAZIONI.md nella radice della pipeline).
 *
 * GENERATO DA scripts/import-gear.mts - NON MODIFICARE A MANO.
 */

import type { CostumeIndex } from "../gear-types";

const COSTUMI: CostumeIndex["costumes"] = {
${costumeLines}
};

const EROI: CostumeIndex["heroes"] = {
${heroLines}
};

export const COSTUMES: CostumeIndex = {
  flatStat: ${JSON.stringify(index.flatStat)},
  scale: ${JSON.stringify(index.scale)},
  sets: ${JSON.stringify(index.sets)},
  costumes: COSTUMI,
  heroes: EROI,
};
`,
  "utf8",
);

const withoutIcon = Object.values(index.costumes).filter((c) => !c.icon).length;
const withoutName = Object.values(index.costumes).filter((c) => !c.name).length;
console.log(`  equipaggiamento: ${gearIndex.sets.length} set, ${gearIndex.options.length} effetti bonus, ${layers.length} strati, ${gearIndex.pieceImages.length} immagini di pezzi`);
console.log(`  costumi: ${Object.keys(index.costumes).length} (${withoutIcon} senza immagine, ${withoutName} senza nome) per ${Object.keys(heroes).length} eroi`);
console.log(`  i costumi di partenza al massimo ridanno quelli delle statistiche: ${checked} eroi`);
console.log(`  eroi del roster senza costumi: ${HEROES.filter((hero) => !heroes[hero.id]).map((hero) => hero.id).join(", ") || "nessuno"}`);
console.log(`  ${KIND_IT.body}, ${KIND_IT.weapon}, ${KIND_IT.head}: ${(["body", "weapon", "head"] as const).map((k) => Object.values(index.costumes).filter((c) => c.kind === k).length).join(", ")}\n`);
