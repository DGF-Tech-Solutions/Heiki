/**
 * Importazione del roster di Grand Cross.
 *
 *   npm run eroi:import
 *
 * Prende i dati e le card prodotti dalla pipeline di estrazione (fuori da
 * questo repo) e ne ricava due cose molto diverse fra loro:
 *
 *   src/lib/games/grand-cross/heroes.generated.ts   dati, versionati
 *   public/eroi/grand-cross/                        immagini, NON versionate
 *
 * La separazione non e' un dettaglio. Nomi, rarita' e attributi sono fatti, e
 * stanno nel repo come qualsiasi altro dato. Le card sono asset di Netmarble
 * rielaborati: metterle in un repo su GitHub sarebbe ridistribuirle, quindi
 * restano locali e si rifanno con questo comando. Chi clona senza gli asset
 * vede il roster con i riquadri vuoti, non un sito rotto.
 *
 * E' idempotente: rilanciarlo dopo un aggiornamento del gioco riscrive il
 * dataset e ricopia solo le card cambiate.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/** Cartella della pipeline di estrazione. Fuori dal repo: e' materiale di lavoro. */
const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";

const GAME = "grand-cross";
const ROOT = process.cwd();
const DEST_IMAGES = resolve(ROOT, "public/eroi", GAME);
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "heroes.generated.ts");

/** Forma delle voci in eroi.json, come le scrive la pipeline. */
interface SourceHero {
  heroId: number;
  gruppo: string;
  nome: string;
  nickname: string;
  rarita: string;
  ottenibile_come: string;
  attributo: string;
}

function fail(message: string, hint?: string): never {
  console.error(`\n  ERRORE: ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

/* ------------------------------------------------------------- sorgente -- */

const heroesJson = resolve(SOURCE, "eroi/eroi.json");
const cardsDir = resolve(SOURCE, "card_finali");

if (!existsSync(heroesJson)) {
  fail(
    `non trovo ${heroesJson}`,
    "Imposta GC_ASSETS sulla cartella _7dsgc della pipeline di estrazione.",
  );
}

const heroes = JSON.parse(readFileSync(heroesJson, "utf8")) as SourceHero[];
console.log(`\n  ${heroes.length} eroi letti da eroi.json`);

/* ---------------------------------------------------------------- dati -- */

/**
 * Toglie la decorazione dagli epiteti.
 *
 * Nel gioco sono scritti in tre modi diversi: fra parentesi quadre, fra
 * virgolette, o con del BBCode rimasto dentro - "[b]The Fox Sin of Greed[/b]".
 * E' decorazione della fonte, non parte del nome, e va via qui: l'interfaccia
 * deve poter presentare il dato senza ripulirlo ogni volta.
 */
function clean(text: string): string {
  // Solo i tag di formattazione a una lettera. Un'espressione piu' larga
  // mangerebbe "[Sunshine]", che e' l'epiteto e non un tag.
  let out = text.replace(/\[\/?[biu]\]/gi, "").trim();

  // Le quadre esterne si tolgono solo se avvolgono TUTTO. In "[Boar Hat] Tavern"
  // fanno parte del testo, e toglierle lascerebbe una parentesi spaiata.
  if (out.startsWith("[") && out.indexOf("]") === out.length - 1) {
    out = out.slice(1, -1).trim();
  }

  if (out.length > 1 && out.startsWith('"') && out.endsWith('"')) {
    out = out.slice(1, -1).trim();
  }

  return out;
}

const rows = heroes
  .map((hero) =>
    [
      String(hero.heroId),
      hero.gruppo,
      hero.nome,
      clean(hero.nickname),
      hero.rarita,
      hero.ottenibile_come,
      hero.attributo,
    ].map((cell) => JSON.stringify(cell)),
  )
  .map((cells) => `  [${cells.join(", ")}],`)
  .join("\n");

const generated = `/**
 * Roster di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 * Si rigenera con \`npm run eroi:import\` dopo ogni aggiornamento del gioco.
 *
 * Le voci sono tuple e non oggetti perche' sono ${heroes.length}: una riga per eroe si
 * legge e si confronta in diff, ${heroes.length} oggetti su otto righe l'uno no. Il tipo
 * Row le tiene comunque controllate dal compilatore.
 *
 * L'ordine e' quello della fonte: dal piu' recente.
 */

import type { HeroEntry } from "../types";

/** id, gruppo, nome, epiteto, rarita', ottenibile come, attributo */
type Row = readonly [string, string, string, string, string, string, string];

const ROWS: readonly Row[] = [
${rows}
];

export const HEROES: readonly HeroEntry[] = ROWS.map(
  ([id, group, name, epithet, rarity, obtainedAs, affinity]) => ({
    id,
    group,
    name,
    epithet,
    rarity,
    obtainedAs,
    affinity,
  }),
);
`;

writeFileSync(DEST_DATA, generated, "utf8");
console.log(`  dataset scritto in src/lib/games/${GAME}/heroes.generated.ts`);

/* ------------------------------------------------------------ immagini -- */

if (!existsSync(cardsDir)) {
  console.log(`\n  card_finali non trovata: salto le immagini.`);
  process.exit(0);
}

mkdirSync(DEST_IMAGES, { recursive: true });
mkdirSync(resolve(DEST_IMAGES, "2x"), { recursive: true });

/**
 * Copia se il file di destinazione manca o e' piu' vecchio.
 *
 * Il riprova non e' scaramantico: su Windows la copia di centinaia di file
 * piccoli fallisce ogni tanto con EBUSY o EPERM perche' un antivirus o
 * l'indicizzatore ha ancora il file aperto. Un secondo tentativo passa sempre.
 */
function copyIfNewer(from: string, to: string): boolean {
  if (existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs) return false;

  for (let attempt = 0; ; attempt++) {
    try {
      copyFileSync(from, to);
      return true;
    } catch (error) {
      if (attempt >= 2) throw error;
    }
  }
}

const wanted = new Set(heroes.map((hero) => String(hero.heroId)));
let copied = 0;
let missing = 0;

for (const scale of ["", "2x"]) {
  const from = resolve(cardsDir, scale);
  const to = resolve(DEST_IMAGES, scale);
  if (!existsSync(from)) continue;

  const files = readdirSync(from).filter((name) => name.endsWith(".png"));
  for (const file of files) {
    if (!wanted.has(file.slice(0, -4))) continue;
    if (copyIfNewer(resolve(from, file), resolve(to, file))) copied++;
  }
}

for (const id of wanted) {
  if (!existsSync(resolve(DEST_IMAGES, `${id}.png`))) missing++;
}

console.log(`  ${copied} card copiate in public/eroi/${GAME}/`);
if (missing > 0) console.log(`  ATTENZIONE: ${missing} eroi senza card`);

console.log(`\n  Fatto. La sezione e' su /${GAME}/eroi\n`);
