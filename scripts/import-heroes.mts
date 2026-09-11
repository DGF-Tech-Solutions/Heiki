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
const DEST_TEXTS = resolve(ROOT, "src/lib/games", GAME, "hero-texts.generated.ts");
const DEST_ASSETS = resolve(ROOT, "src/lib/games", GAME, "hero-assets.generated.ts");

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

/* --------------------------------------------------------------- testi -- */

/**
 * I testi del gioco, se la pipeline li ha gia' estratti.
 *
 * Li produce `python estrai_testi.py` dai due database SQLite di
 * localizzazione, che sono cifrati: la cartella _7dsgc porta sia lo strumento
 * sia la spiegazione del cifrario. Qui si legge solo il risultato, perche' un
 * decodificatore duplicato in TypeScript sarebbe una seconda cosa da tenere
 * allineata al gioco.
 *
 * Se il file manca, il roster resta quello di prima: nomi, rarita' e
 * attributi. La scheda del singolo eroe mostrera' meno, non si rompera'.
 */
interface SourceText {
  nome?: Record<string, string>;
  titolo?: Record<string, string>;
  epiteto?: Record<string, string>;
  descrizione?: Record<string, string>;
  evocazione?: Record<string, string>;
  caricamento?: Record<string, string>;
}

const textsJson = resolve(SOURCE, "eroi/testi_eroi.json");

if (!existsSync(textsJson)) {
  console.log(`  testi_eroi.json non trovato: salto i testi.`);
  console.log(`  (si genera con: python estrai_testi.py, dentro _7dsgc)`);
} else {
  const source = JSON.parse(readFileSync(textsJson, "utf8")) as Record<string, SourceText>;

  // Italiano quando c'e', inglese quando il gioco non ha tradotto. Il ripiego
  // e' silenzioso di proposito: sono due voci su 313, e segnalarle in pagina
  // costerebbe piu' attenzione di quanta ne valgano.
  const pick = (field?: Record<string, string>) => field?.it ?? field?.en;

  const entries: string[] = [];
  let withText = 0;
  let fallbacks = 0;

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const text = source[hid];
    if (!text) continue;

    const fields: [string, string | undefined][] = [
      ["name", pick(text.nome)],
      ["title", pick(text.titolo)],
      ["epithet", pick(text.epiteto)],
      ["description", pick(text.descrizione)],
      ["summon", pick(text.evocazione)],
      ["loading", pick(text.caricamento)],
    ];
    const written = fields.filter(([, value]) => value !== undefined);
    if (written.length === 0) continue;

    if (text.descrizione && !text.descrizione.it && text.descrizione.en) fallbacks++;
    withText++;
    const body = written.map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`).join("\n");
    entries.push(`  ${JSON.stringify(hid)}: {
${body}
  },`);
  }

  const generatedTexts = `/**
 * Testi degli eroi di Grand Cross, dal client del gioco.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * Sta in un file separato dal roster perche' ha un destinatario diverso: il
 * roster viaggia fino al browser per far funzionare i filtri, questi testi no.
 * Li legge solo la scheda del singolo eroe, che e' renderizzata sul server, e
 * tenerli qui evita di spedire ${withText} descrizioni a chi sta solo sfogliando
 * la griglia.
 *
 * Sono ${withText} eroi su ${heroes.length}: agli altri il gioco assegna i testi dal
 * server, e nel client non ci sono.
 */

import type { HeroText } from "../types";

export const HERO_TEXTS: Readonly<Record<string, HeroText>> = {
${entries.join("\n")}
};
`;

  writeFileSync(DEST_TEXTS, generatedTexts, "utf8");
  console.log(`  testi scritti per ${withText}/${heroes.length} eroi` +
    (fallbacks > 0 ? ` (${fallbacks} descrizioni rimaste in inglese)` : ""));
}

/* --------------------------------------------------------------- asset -- */

/**
 * Illustrazione e icona dell'abilita' esclusiva.
 *
 * Le mappa `python mappa_asset.py` nella cartella della pipeline. Qui si
 * copiano solo i collegamenti CERTI, cioe' quelli il cui nome di file contiene
 * l'heroId a 7 cifre: illustrazione e icona abilita'. Le icone dei ritratti no,
 * perche' l'heroId non c'e' e il collegamento passa da uno slug che restringe
 * al personaggio ma non alla variante - va bene per indagare, non per
 * pubblicare.
 */
interface SourceAssets {
  splash?: string;
  abilita?: string;
  slug?: string;
  carte?: string[];
  carte_certezza?: string;
  colpi?: string;
}

/**
 * Legge `skill_attack_count_<id>.bytes`: quanti colpi porta ogni carta.
 *
 * Formato: un intero col numero di record, poi per ciascuno la lunghezza del
 * nome su un byte, il nome, e il valore su quattro byte. Il nome dice quale
 * carta e a che rango - `skill_a_1_atk` e' l'abilita' A al rango 1,
 * `skill_b_2_3_atk` la B ai ranghi 2 e 3.
 */
function readHits(path: string): Record<string, number> {
  const raw = readFileSync(path);
  const out: Record<string, number> = {};
  let i = 4;
  while (i + 1 <= raw.length) {
    const len = raw[i]!;
    if (len === 0 || i + 1 + len + 4 > raw.length) break;
    const name = raw.toString("utf8", i + 1, i + 1 + len);
    out[name] = raw.readInt32LE(i + 1 + len);
    i += 1 + len + 4;
  }
  return out;
}

const assetsJson = resolve(SOURCE, "eroi/asset_eroi.json");
const ASSET_KINDS = [
  { key: "splash" as const, dir: "splash" },
  { key: "abilita" as const, dir: "abilita" },
];

if (!existsSync(assetsJson)) {
  console.log(`  asset_eroi.json non trovato: salto illustrazioni e icone abilita'.`);
  console.log(`  (si genera con: python mappa_asset.py, dentro _7dsgc)`);
} else {
  const mappa = JSON.parse(readFileSync(assetsJson, "utf8")) as Record<string, SourceAssets>;
  const estratti = resolve(SOURCE, "7dsgc_estratti");
  const rows: string[] = [];
  const copied: Record<string, number> = { splash: 0, abilita: 0, carte: 0 };

  for (const kind of ASSET_KINDS) {
    mkdirSync(resolve(DEST_IMAGES, kind.dir), { recursive: true });
  }

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const voce = mappa[hid];
    if (!voce) continue;

    const flags: string[] = [];
    for (const kind of ASSET_KINDS) {
      const rel = voce[kind.key];
      if (!rel) continue;
      const from = resolve(estratti, rel);
      if (!existsSync(from)) continue;
      if (copyIfNewer(from, resolve(DEST_IMAGES, kind.dir, `${hid}.png`))) copied[kind.dir]!++;
      flags.push(`${kind.key === "abilita" ? "skill" : "splash"}: true`);
    }

    // Carte d'attacco: numerate da 1, nella cartella dell'eroe. Il numero nel
    // nome del file di origine non e' contiguo - il gioco salta dei valori -
    // quindi si rinumera, e l'ordine resta quello.
    if (voce.carte && voce.carte.length > 0) {
      const dir = resolve(DEST_IMAGES, "carte", hid);
      mkdirSync(dir, { recursive: true });
      let n = 0;
      for (const rel of voce.carte) {
        const from = resolve(estratti, rel);
        if (!existsSync(from)) continue;
        n++;
        if (copyIfNewer(from, resolve(dir, `${n}.png`))) copied.carte!++;
      }
      if (n > 0) {
        flags.push(`cards: ${n}`);
        // "solo slug" e' il ripiego: stesso personaggio, sigla di rarita'
        // diversa. Vale la pena mostrarlo, ma dichiarandolo.
        if (voce.carte_certezza === "solo slug") flags.push(`cardsApprox: true`);
      }
    }

    // Colpi per carta: questo e' certo, l'heroId e' nel nome del file.
    if (voce.colpi) {
      const from = resolve(estratti, voce.colpi);
      if (existsSync(from)) {
        const hits = readHits(from);
        if (Object.keys(hits).length > 0) flags.push(`hits: ${JSON.stringify(hits)}`);
      }
    }

    if (flags.length > 0) rows.push(`  ${JSON.stringify(hid)}: { ${flags.join(", ")} },`);
  }

  const generatedAssets = `/**
 * Quali immagini esistono per ogni eroe.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * Sono bandierine e non percorsi: il percorso lo costruisce heroSplashSrc, e
 * averlo in un posto solo evita che una cartella rinominata vada corretta in
 * ${rows.length} righe. Servono perche' le immagini non sono versionate: senza,
 * la scheda mostrerebbe un riquadro rotto a chi non ha lanciato l'importazione.
 */

import type { HeroAssets } from "../types";

export const HERO_ASSETS: Readonly<Record<string, HeroAssets>> = {
${rows.join("\n")}
};
`;

  writeFileSync(DEST_ASSETS, generatedAssets, "utf8");
  console.log(
    `  ${copied.splash} illustrazioni, ${copied.abilita} icone abilita', ` +
      `${copied.carte} carte d'attacco copiate ` +
      `(${rows.length}/${heroes.length} eroi con almeno un asset)`,
  );
}

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
