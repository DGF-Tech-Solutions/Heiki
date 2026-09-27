/**
 * Importazione dei legami di Grand Cross: con quali eroi associati ogni eroe ha
 * un Effetto associazione, e quali danno l'Attacco combinato.
 *
 *   npm run legami:import   (lo lancia anche npm run eroi:import, dopo gli eroi)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/client/abilita.json      python script/scheda_client.py (`fates`, in inglese)
 *   eroi/client/abilita_it.json   lo stesso, in italiano
 *   eroi/associazioni.json        python script/associazioni.py: l'effetto di ogni
 *                                 legame a ogni grado dell'associato, e l'effetto comune
 *
 * e scrive src/lib/games/grand-cross/hero-fates.generated.ts.
 *
 * Si ferma se le due lingue non dicono gli stessi legami nello stesso ordine, se
 * un eroe associato non e' nel roster, se il nome di un effetto non ha la forma
 * «... Lv. {0}» che qui si toglie, se due legami con lo stesso effetto hanno
 * testi diversi, o se un legame o un effetto delle schede non e' in
 * associazioni.json (le due uscite vengono dalla stessa DB_fate). Se i JSON
 * mancano non tocca niente.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PassiveMode } from "../src/lib/games/gear-types";
import type { HeroFate, HeroFateEffect, HeroFatesIndex } from "../src/lib/games/hero-fates-types";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_EN = resolve(SOURCE, "eroi/client/abilita.json");
const SOURCE_IT = resolve(SOURCE, "eroi/client/abilita_it.json");
const SOURCE_GRADES = resolve(SOURCE, "eroi/associazioni.json");
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "hero-fates.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

interface SrcFate {
  skin: { heroId: number };
  passive: { id: number; name: string; explain: string };
  canCoop?: boolean;
}

type Src = Record<string, { fates?: SrcFate[] }>;

/** associazioni.json: le famiglie di effetti (una per parola chiave, coi gradi R-UR), i legami, l'effetto comune */
interface SrcText {
  it: string | null;
  en: string | null;
}

interface SrcGrades {
  comune: { base: number; per_livello: number; nome: SrcText; descrizione: SrcText; statistiche_di_base: SrcText };
  famiglie: { chiave: string; stat: string; modo: "per" | "punti" | "piu"; gradi: Record<string, { passiva: number; valore: number }> }[];
  legami: { principale: number; associato: number; passive: Record<string, number> }[];
}

if (!existsSync(SOURCE_EN) || !existsSync(SOURCE_IT) || !existsSync(SOURCE_GRADES)) {
  console.log(`  ${SOURCE_EN}, la versione _it o ${SOURCE_GRADES} non trovati: salto i legami.`);
  console.log(`  (si generano con: python script/scheda_client.py e python script/associazioni.py, dentro _7dsgc)\n`);
  process.exit(0);
}

const en = JSON.parse(readFileSync(SOURCE_EN, "utf8")) as Src;
const it = JSON.parse(readFileSync(SOURCE_IT, "utf8")) as Src;
const grades = JSON.parse(readFileSync(SOURCE_GRADES, "utf8")) as SrcGrades;

const MODE: Record<SrcGrades["famiglie"][number]["modo"], PassiveMode> = { per: "percent", punti: "points", piu: "flat" };
// la famiglia di un effetto, per la passiva UR che le schede portano
const familyOf = new Map(grades.famiglie.map((family) => [family.gradi["6"]!.passiva, family]));
// il legame, per principale e associato: la passiva del grado LR, se c'e'
const linkOf = new Map(grades.legami.map((link) => [`${link.principale}>${link.associato}`, link]));
function label(value: SrcText, what: string) {
  if (!value.it || !value.en) fail(`associazioni.json: ${what} senza una delle due lingue`);
  return { it: value.it, en: value.en };
}
const heroIds = new Set(HEROES.map((hero) => hero.id));

// «Superior Resistance Lv. {0}»: il numero e' il grado, e qui l'effetto vale al
// grado UR. Si toglie; una forma diversa vuol dire che una patch l'ha cambiata.
const LEVEL = /\s+(?:Lv|Liv)\.\s*\{0\}$/;
function effectName(name: string, hero: string): string {
  if (!LEVEL.test(name)) fail(`legami di ${hero}: il nome «${name}» non finisce con «Lv. {0}»`);
  return name.replace(LEVEL, "");
}

const effects: HeroFateEffect[] = [];
const lrDifferent: string[] = [];
const effectOf = new Map<number, number>();
const heroes: Record<string, HeroFate[]> = {};
let combined = 0;

for (const id of Object.keys(en)) if (!heroIds.has(id)) fail(`l'eroe ${id} delle schede non e' nel roster`);

for (const hero of HEROES) {
  const fatesEn = en[hero.id]?.fates ?? [];
  const fatesIt = it[hero.id]?.fates ?? [];
  if (fatesEn.length !== fatesIt.length) fail(`legami di ${hero.id}: ${fatesEn.length} in inglese, ${fatesIt.length} in italiano`);
  if (fatesEn.length === 0) continue;

  heroes[hero.id] = fatesEn.map((fate, i) => {
    const other = fatesIt[i]!;
    const associate = String(fate.skin.heroId);
    if (String(other.skin.heroId) !== associate || other.passive.id !== fate.passive.id || !!other.canCoop !== !!fate.canCoop) {
      fail(`legami di ${hero.id}: il ${i + 1}° legame non e' lo stesso nelle due lingue`);
    }
    if (!heroIds.has(associate)) fail(`legami di ${hero.id}: l'eroe associato ${associate} non e' nel roster`);

    const family = familyOf.get(fate.passive.id);
    if (!family) fail(`legami di ${hero.id}: l'effetto ${fate.passive.id} non e' la passiva UR di nessuna famiglia di associazioni.json`);
    const values = [3, 4, 5, 6].map((grade) => family.gradi[String(grade)]!.valore);
    const effect: HeroFateEffect = {
      name: { it: effectName(other.passive.name, hero.id), en: effectName(fate.passive.name, hero.id) },
      text: { it: other.passive.explain, en: fate.passive.explain },
      stat: family.stat,
      mode: MODE[family.modo],
      grades: [values[0]!, values[1]!, values[2]!, values[3]!],
    };
    let index = effectOf.get(fate.passive.id);
    if (index === undefined) {
      index = effects.push(effect) - 1;
      effectOf.set(fate.passive.id, index);
    } else if (JSON.stringify(effects[index]) !== JSON.stringify(effect)) {
      fail(`l'effetto ${fate.passive.id} ha testi diversi in due legami`);
    }
    if (fate.canCoop) combined++;
    const link = linkOf.get(`${hero.id}>${associate}`);
    if (!link || link.passive["6"] !== fate.passive.id) fail(`legami di ${hero.id}: il legame con ${associate} non e' in associazioni.json`);
    // l'effetto col grado LR: quasi sempre lo stesso di UR. Qui la passiva; la
    // posizione in EFFECTS si mette sotto, quando gli effetti ci sono tutti
    const lr = link.passive["7"];
    if (lr !== undefined && lr !== fate.passive.id) {
      lrDifferent.push(`${hero.id}>${associate}`);
      return [associate, index, fate.canCoop ? 1 : 0, lr] as const;
    }
    return [associate, index, fate.canCoop ? 1 : 0] as const;
  });
}

// l'effetto LR diverso e' la passiva UR di un'altra famiglia: diventa la sua posizione in EFFECTS
for (const fates of Object.values(heroes)) {
  fates.forEach((fate, i) => {
    if (fate[3] === undefined) return;
    const position = effectOf.get(fate[3]);
    if (position === undefined) fail(`l'effetto LR ${fate[3]} non e' l'effetto UR di nessun legame`);
    fates[i] = [fate[0], fate[1], fate[2], position];
  });
}

const index: HeroFatesIndex = {
  effects,
  heroes,
  common: {
    base: grades.comune.base,
    perLevel: grades.comune.per_livello,
    name: label(grades.comune.nome, "il nome dell'effetto comune"),
    description: label(grades.comune.descrizione, "la descrizione dell'effetto comune"),
    basicStats: label(grades.comune.statistiche_di_base, "la nota sulle statistiche di base"),
  },
};

// Una riga per eroe: dopo una patch il diff dice quali legami sono cambiati.
const lines = Object.entries(index.heroes)
  .map(([hero, fates]) => `  ${JSON.stringify(hero)}: ${JSON.stringify(fates)},`)
  .join("\n");

writeFileSync(
  DEST_DATA,
  `/**
 * I legami di Grand Cross: per ogni eroe, gli eroi associati con cui si attiva
 * l'Effetto associazione, e se il legame da' l'Attacco combinato.
 *
 * FONTE: il client, via python script/scheda_client.py (eroi/client/abilita.json
 * e abilita_it.json, campo \`fates\`), che li legge da DB_fate: \`main_hero_id\`,
 * \`fate_hero_id\`, la passiva del grado UR e le carte combinate; i valori a ogni
 * grado dell'associato e l'effetto comune da python script/associazioni.py.
 *
 * GENERATO DA scripts/import-hero-fates.mts - NON MODIFICARE A MANO.
 *
 * Un legame e' [eroe associato, effetto, attacco combinato, effetto LR se e'
 * diverso]: l'effetto e' la posizione in EFFECTS, perche' in tutto il gioco gli
 * effetti sono ${effects.length}.
 */

import type { HeroFatesIndex } from "../hero-fates-types";

const EFFECTS: HeroFatesIndex["effects"] = [
${effects.map((effect) => `  ${JSON.stringify(effect)},`).join("\n")}
];

const HEROES: HeroFatesIndex["heroes"] = {
${lines}
};

export const HERO_FATES: HeroFatesIndex = {
  effects: EFFECTS,
  heroes: HEROES,
  common: ${JSON.stringify(index.common)},
};
`,
  "utf8",
);

const total = Object.values(heroes).reduce((sum, fates) => sum + fates.length, 0);
const without = HEROES.filter((hero) => !heroes[hero.id]).map((hero) => hero.id);
console.log(`  legami: ${total} per ${Object.keys(heroes).length} eroi, ${combined} con l'Attacco combinato, ${effects.length} effetti`);
console.log(`  eroi senza legami: ${without.length ? without.join(", ") : "nessuno"}`);
console.log(`  effetto LR diverso da UR: ${lrDifferent.length ? lrDifferent.join(", ") : "nessuno"}\n`);
