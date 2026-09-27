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
 *
 * e scrive src/lib/games/grand-cross/hero-fates.generated.ts.
 *
 * Si ferma se le due lingue non dicono gli stessi legami nello stesso ordine, se
 * un eroe associato non e' nel roster, se il nome di un effetto non ha la forma
 * «... Lv. {0}» che qui si toglie, o se due legami con lo stesso effetto hanno
 * testi diversi. Se i JSON mancano non tocca niente.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { HeroFate, HeroFateEffect, HeroFatesIndex } from "../src/lib/games/hero-fates-types";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_EN = resolve(SOURCE, "eroi/client/abilita.json");
const SOURCE_IT = resolve(SOURCE, "eroi/client/abilita_it.json");
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

if (!existsSync(SOURCE_EN) || !existsSync(SOURCE_IT)) {
  console.log(`  ${SOURCE_EN} o la versione _it non trovati: salto i legami. (si generano con: python script/scheda_client.py, dentro _7dsgc)\n`);
  process.exit(0);
}

const en = JSON.parse(readFileSync(SOURCE_EN, "utf8")) as Src;
const it = JSON.parse(readFileSync(SOURCE_IT, "utf8")) as Src;
const heroIds = new Set(HEROES.map((hero) => hero.id));

// «Superior Resistance Lv. {0}»: il numero e' il grado, e qui l'effetto vale al
// grado UR. Si toglie; una forma diversa vuol dire che una patch l'ha cambiata.
const LEVEL = /\s+(?:Lv|Liv)\.\s*\{0\}$/;
function effectName(name: string, hero: string): string {
  if (!LEVEL.test(name)) fail(`legami di ${hero}: il nome «${name}» non finisce con «Lv. {0}»`);
  return name.replace(LEVEL, "");
}

const effects: HeroFateEffect[] = [];
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

    const effect: HeroFateEffect = {
      name: { it: effectName(other.passive.name, hero.id), en: effectName(fate.passive.name, hero.id) },
      text: { it: other.passive.explain, en: fate.passive.explain },
    };
    let index = effectOf.get(fate.passive.id);
    if (index === undefined) {
      index = effects.push(effect) - 1;
      effectOf.set(fate.passive.id, index);
    } else if (JSON.stringify(effects[index]) !== JSON.stringify(effect)) {
      fail(`l'effetto ${fate.passive.id} ha testi diversi in due legami`);
    }
    if (fate.canCoop) combined++;
    return [associate, index, fate.canCoop ? 1 : 0] as const;
  });
}

const index: HeroFatesIndex = { effects, heroes };

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
 * \`fate_hero_id\`, la passiva del grado UR e le carte combinate.
 *
 * GENERATO DA scripts/import-hero-fates.mts - NON MODIFICARE A MANO.
 *
 * Un legame e' [eroe associato, effetto, attacco combinato]: l'effetto e' la
 * posizione in EFFECTS, perche' in tutto il gioco gli effetti sono ${effects.length}.
 */

import type { HeroFatesIndex } from "../hero-fates-types";

const EFFECTS: HeroFatesIndex["effects"] = [
${effects.map((effect) => `  ${JSON.stringify(effect)},`).join("\n")}
];

const HEROES: HeroFatesIndex["heroes"] = {
${lines}
};

export const HERO_FATES: HeroFatesIndex = { effects: EFFECTS, heroes: HEROES };
`,
  "utf8",
);

const total = Object.values(heroes).reduce((sum, fates) => sum + fates.length, 0);
const without = HEROES.filter((hero) => !heroes[hero.id]).map((hero) => hero.id);
console.log(`  legami: ${total} per ${Object.keys(heroes).length} eroi, ${combined} con l'Attacco combinato, ${effects.length} effetti`);
console.log(`  eroi senza legami: ${without.length ? without.join(", ") : "nessuno"}\n`);
