/**
 * Importazione dei compleanni di Grand Cross: il compleanno nel profilo di ogni
 * eroe e la festa dei clienti della taverna (regalo preferito, punti Affetto x10).
 *
 *   npm run compleanni:import   (lo lancia anche npm run eroi:import, in fondo)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/compleanni.json   python script/compleanni.py
 *   compleanni/<id>.png    le icone degli oggetti, gia' a 128px
 *
 * e scrive src/lib/games/grand-cross/birthdays.generated.ts e
 * public/eroi/grand-cross/compleanni/ (immagini, NON versionate).
 *
 * Si ferma se un riferimento non torna: un eroe del roster senza la sua riga, un
 * eroe che il roster non ha, un cliente senza versioni o con una data diversa da
 * quella del profilo delle sue versioni, un oggetto senza nome o senza immagine,
 * moltiplicatori diversi fra i clienti. Se il JSON manca non tocca niente.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { BirthdaysIndex, BirthdayText, MonthDay, TavernGift } from "../src/lib/games/birthdays-types";
import type { HeroLabel } from "../src/lib/games/types";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/compleanni.json");
const SOURCE_IMAGES = resolve(SOURCE, "compleanni");
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "birthdays.generated.ts");
const DEST_IMAGES = resolve(ROOT, "public/eroi", GAME, "compleanni");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

interface SrcGift {
  oggetto: number;
  quantita: number;
  affetto: number;
  ritorno: { oggetto: number; quantita: number };
}

interface Src {
  regole: {
    moltiplicatore: number;
    affetto_per_cuore: number;
    cuori_per_versione: number;
    cuori_con_affinita_massima: number;
    regalo_comune: SrcGift;
    ricompense_cuori: { cuori: number; oggetto: number; quantita: number }[];
    testi: Record<BirthdayText, HeroLabel>;
  };
  oggetti: Record<string, { nome: HeroLabel; descrizione: HeroLabel | null; immagine: string }>;
  gruppi: Record<string, HeroLabel | null>;
  clienti: {
    cliente: number;
    gruppo: number;
    legame: string;
    data: [number, number];
    moltiplicatore: number;
    battuta: HeroLabel | null;
    eroe_illustrazione: number | null;
    versioni: number[];
    regalo: SrcGift | null;
  }[];
  eroi: Record<string, { date: ([number, number] | null)[]; gruppo: number }>;
}

if (!existsSync(SOURCE_JSON)) {
  console.log(`  ${SOURCE_JSON} non trovato: salto i compleanni. (si genera con: python script/compleanni.py, dentro _7dsgc)\n`);
  process.exit(0);
}

const src = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Src;
const heroIds = new Set(HEROES.map((hero) => hero.id));
const sameDay = (a: readonly number[], b: readonly number[]) => a[0] === b[0] && a[1] === b[1];

// --- gli eroi: tutti quelli del roster, e nessun altro
for (const id of Object.keys(src.eroi)) if (!heroIds.has(id)) fail(`l'eroe ${id} non e' nel roster`);
for (const id of heroIds) if (!src.eroi[id]) fail(`l'eroe ${id} del roster non ha la riga del compleanno`);
const heroes: BirthdaysIndex["heroes"] = Object.fromEntries(
  [...heroIds].map((id) => {
    const hero = src.eroi[id] ?? fail(`l'eroe ${id} del roster non ha la riga del compleanno`);
    if (!hero.date.length) fail(`l'eroe ${id} non ha nemmeno «Sconosciuto»`);
    if (!src.gruppi[String(hero.gruppo)]) fail(`l'eroe ${id}: il gruppo ${hero.gruppo} non ha nome`);
    const dates = hero.date.map((date) => (date ? ([date[0], date[1]] as MonthDay) : null));
    return [id, { group: String(hero.gruppo), dates }];
  }),
);

// --- gli oggetti, con l'immagine
const items: Record<string, BirthdaysIndex["items"][string]> = {};
rmSync(DEST_IMAGES, { recursive: true, force: true });
mkdirSync(DEST_IMAGES, { recursive: true });
for (const [id, item] of Object.entries(src.oggetti)) {
  if (!item.nome?.it && !item.nome?.en) fail(`l'oggetto ${id} non ha nome`);
  const from = resolve(SOURCE_IMAGES, item.immagine);
  if (!existsSync(from)) fail(`l'oggetto ${id}: ${from} non c'e'`);
  copyFileSync(from, resolve(DEST_IMAGES, `${id}.png`));
  items[id] = { name: item.nome, description: item.descrizione };
}
const gift = (g: SrcGift, where: string): TavernGift => {
  for (const id of [g.oggetto, g.ritorno.oggetto]) if (!items[id]) fail(`${where}: l'oggetto ${id} non c'e'`);
  return { item: String(g.oggetto), count: g.quantita, affection: g.affetto, returnItem: String(g.ritorno.oggetto), returnCount: g.ritorno.quantita };
};

// --- i clienti della taverna
const multipliers = new Set(src.clienti.map((guest) => guest.moltiplicatore));
if (multipliers.size !== 1 || !multipliers.has(src.regole.moltiplicatore)) {
  fail(`moltiplicatori diversi: ${[...multipliers].join(", ")} (regola ${src.regole.moltiplicatore})`);
}
const guests: BirthdaysIndex["guests"] = src.clienti.map((guest) => {
  const where = `cliente ${guest.cliente}`;
  if (!guest.versioni.length) fail(`${where}: nessuna versione`);
  for (const hid of guest.versioni) {
    const id = String(hid);
    if (!heroIds.has(id)) fail(`${where}: l'eroe ${id} non e' nel roster`);
    if (!heroes[id]?.dates.some((date) => date && sameDay(date, guest.data))) {
      fail(`${where}: la festa e' il ${guest.data.join("/")}, il profilo di ${id} no`);
    }
  }
  const art = guest.eroe_illustrazione === null ? null : String(guest.eroe_illustrazione);
  if (art && !heroIds.has(art)) fail(`${where}: l'eroe dell'illustrazione ${art} non e' nel roster`);
  return {
    guest: guest.cliente,
    group: String(guest.gruppo),
    deduced: guest.legame !== "DB_basepoint_npc",
    date: [guest.data[0], guest.data[1]] as MonthDay,
    multiplier: guest.moltiplicatore,
    line: guest.battuta,
    artHero: art,
    heroes: guest.versioni.map(String),
    gift: guest.regalo ? gift(guest.regalo, where) : null,
  };
});

const groups: Record<string, HeroLabel> = {};
for (const [id, name] of Object.entries(src.gruppi)) {
  if (!name) fail(`il gruppo ${id} non ha nome`);
  groups[id] = name;
}

const index: BirthdaysIndex = {
  multiplier: src.regole.moltiplicatore,
  affectionPerHeart: src.regole.affetto_per_cuore,
  heartsPerVersion: src.regole.cuori_per_versione,
  heartsAtMaxAffinity: src.regole.cuori_con_affinita_massima,
  commonGift: gift(src.regole.regalo_comune, "regalo comune"),
  heartRewards: src.regole.ricompense_cuori.map((reward) => {
    if (!items[reward.oggetto]) fail(`ricompensa dei Cuori: l'oggetto ${reward.oggetto} non c'e'`);
    return { hearts: reward.cuori, item: String(reward.oggetto), count: reward.quantita };
  }),
  items,
  groups,
  guests,
  heroes,
  texts: src.regole.testi,
};

const LISTS = new Set(["guests", "heroes", "groups", "items"]);
const body = [
  ...Object.entries(index)
    .filter(([key]) => !LISTS.has(key))
    .map(([key, value]) => ` ${key}: ${JSON.stringify(value)},`),
  ` items: {\n${Object.entries(items).map(([id, item]) => `  ${JSON.stringify(id)}: ${JSON.stringify(item)},`).join("\n")}\n },`,
  ` groups: {\n${Object.entries(groups).map(([id, name]) => `  ${JSON.stringify(id)}: ${JSON.stringify(name)},`).join("\n")}\n },`,
  ` guests: [\n${guests.map((guest) => `  ${JSON.stringify(guest)},`).join("\n")}\n ],`,
  ` heroes: {\n${Object.entries(heroes).map(([id, hero]) => `  ${JSON.stringify(id)}: ${JSON.stringify(hero)},`).join("\n")}\n },`,
].join("\n");

writeFileSync(
  DEST_DATA,
  `/**
 * I compleanni di Grand Cross: il compleanno nel profilo di ogni eroe e la festa
 * dei clienti della taverna.
 *
 * FONTE: il client, via python script/compleanni.py (eroi/compleanni.json):
 * DB_hero_base.hero_birth, DB_birthday, DB_guest_gift, DB_basepoint_npc,
 * DB_hero_group_name, DB_config_game, DB_hero_lovepoint_reward, DB_item_info, e il
 * codice delle finestre della taverna e dei Cuori (PageNPCTalk,
 * ItemLovePointInfoGroup). DEDOTTO: il legame del cliente Hawk col suo gruppo
 * (\`deduced\`).
 *
 * GENERATO DA scripts/import-birthdays.mts - NON MODIFICARE A MANO.
 */

import type { BirthdaysIndex } from "../birthdays-types";

export const BIRTHDAYS: BirthdaysIndex = {
${body}
};
`,
  "utf8",
);

const withDate = Object.values(heroes).filter((hero) => hero.dates.some(Boolean)).length;
console.log(`  eroi: ${heroIds.size} (${withDate} con un compleanno nel profilo)`);
console.log(`  clienti della taverna: ${guests.length} (${guests.filter((guest) => guest.gift).length} con un regalo preferito)`);
console.log(`  oggetti: ${Object.keys(items).length}, immagini copiate in public/eroi/${GAME}/compleanni/\n`);
