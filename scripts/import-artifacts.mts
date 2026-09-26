/**
 * Importazione degli artefatti di Grand Cross: Carte artefatto e Set artefatto.
 *
 *   npm run artefatti:import      (lo lancia anche npm run eroi:import, dopo l'Endgame)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/artefatti.json     python script/artefatti.py
 *   artefatti/              le immagini gia' pronte per il sito (WebP a 512 e 256 px
 *                           per le carte, PNG per le icone): gli originali delle carte
 *                           sono PNG da 512 o 1024 px, circa 150 MB per 499 carte
 *
 * e scrive:
 *
 *   src/lib/games/grand-cross/artifacts.generated.ts
 *   public/eroi/grand-cross/artefatti/                 immagini, NON versionate
 *
 * Il JSON della pipeline porta anche i controlli, le risorse del client e i
 * campi non capiti (search_except_word): qui si tiene quello che le quattro
 * pagine mostrano. Si ferma se un riferimento non torna: una carta che cita un
 * set che non c'e', un set con una carta sconosciuta, un pacchetto con una carta
 * sconosciuta, un set senza abbastanza livelli di potenziamento, un codice di
 * filtro che non si sa nominare.
 *
 * Se il JSON manca non tocca niente: il file generato resta quello di prima.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ArtifactCard, ArtifactIndex, ArtifactPack, ArtifactSet } from "../src/lib/games/artifact-types";
import type { HeroLabel } from "../src/lib/games/types";

/** Cartella della pipeline di estrazione. Fuori dal repo: e' materiale di lavoro. */
const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/artefatti.json");
const SOURCE_IMAGES = resolve(SOURCE, "artefatti");
const DEST_IMAGES = resolve(ROOT, "public/eroi", GAME, "artefatti");
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "artifacts.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

interface SrcLabel {
  it?: string | null;
  en?: string | null;
}

interface SrcCard {
  id: number;
  tipo: number;
  numero: number;
  grado: number;
  nome: SrcLabel | null;
  descrizione: SrcLabel | null;
  statistiche: { attacco: number; difesa: number; ps: number };
  set: number | null;
  pacchetti: string[];
  pacchetto_del_tempo: { peso: number; peso_nella_lista: number } | null;
  immagine: { file: string } | null;
}

interface SrcSet {
  id: number;
  numero: number;
  nome: SrcLabel | null;
  carte: number[];
  livelli: { livello: number; testo: SrcLabel }[];
  classe: number;
  filtri: { contenuti: number[]; razze: number[]; caratteristiche: number[]; varie: number[] };
  evento: { nome: SrcLabel | null } | null;
}

interface SrcPack {
  id: number;
  nome: SrcLabel | null;
  descrizione: SrcLabel | null;
  icona: string | null;
  carte: { carta: number; peso: number }[];
  totale: number;
}

interface Src {
  nomi: { carte: SrcLabel; set: SrcLabel; set_bonus: SrcLabel; pacchetto: SrcLabel };
  guida: SrcLabel[];
  placcate_testo: SrcLabel | null;
  sblocco: { rango: number; testo: SrcLabel | null };
  tipi: Record<string, { chiave: string; nome: SrcLabel; sigla: SrcLabel }>;
  gradi: Record<string, { sigla: string; nome: SrcLabel; placcata: { nome: SrcLabel; punti: number; icona: string | null } }>;
  filtri: {
    contenuti: Record<string, { nome: SrcLabel; icona: string | null }>;
    varie: Record<string, { nome: SrcLabel }>;
  };
  potenziamento: { classi: Record<string, { livello: number; punti_totali: number }[]>; carte_per_volta: number };
  carte: SrcCard[];
  set: SrcSet[];
  pacchetti: SrcPack[];
  pacchetto_del_tempo: { titolo: SrcLabel | null; regole: SrcLabel[]; costo: SrcLabel | null; carte: number } | null;
}

/* --------------------------------------------------------------- testi -- */

/** U+FEFF rimasto in qualche stringa e il segnaposto NONE_DB valgono come testo mancante. */
function clean(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const text = value.replaceAll("\uFEFF", "").trim();
  return text === "" || text === "NONE_DB" ? null : text;
}

function label(value: SrcLabel | null | undefined): HeroLabel {
  return { it: clean(value?.it), en: clean(value?.en) };
}

function labelOrNull(value: SrcLabel | null | undefined): HeroLabel | null {
  const out = label(value);
  return out.it || out.en ? out : null;
}

/** Un nome che deve esserci: senza, la pagina avrebbe un titolo vuoto. */
function required(value: SrcLabel | null | undefined, what: string): HeroLabel {
  const out = labelOrNull(value);
  if (!out) fail(`${what}: nessun nome in nessuna lingua`);
  return out;
}

/* ------------------------------------------------------------ immagini -- */

/**
 * Copia una cartella della pipeline cosi' com'e'. Il riprova e' quello degli
 * altri import: su Windows la copia di tanti file piccoli fallisce ogni tanto
 * con EBUSY o EPERM, e un secondo tentativo passa sempre.
 */
function copyFolder(folder: string): Set<string> {
  const from = resolve(SOURCE_IMAGES, folder);
  const copied = new Set<string>();
  if (!existsSync(from)) return copied;
  const to = resolve(DEST_IMAGES, folder);
  mkdirSync(to, { recursive: true });
  for (const file of readdirSync(from)) {
    for (let attempt = 0; ; attempt++) {
      try {
        copyFileSync(resolve(from, file), resolve(to, file));
        break;
      } catch (error) {
        if (attempt >= 2) throw error;
      }
    }
    copied.add(file);
  }
  return copied;
}

/* -------------------------------------------------------------- inizio -- */

console.log("\n  Artefatti: carte e set");
if (!existsSync(SOURCE_JSON)) {
  console.log(`  ${SOURCE_JSON} non trovato: salto gli artefatti. (si genera con: python script/artefatti.py, dentro _7dsgc)\n`);
  process.exit(0);
}
const source = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Src;

rmSync(DEST_IMAGES, { recursive: true, force: true });
mkdirSync(DEST_IMAGES, { recursive: true });
const images = {
  cards: copyFolder("carte"),
  small: copyFolder("carte-piccole"),
  packs: copyFolder("pacchetti"),
  plates: copyFolder("placcate"),
  filters: copyFolder("filtri"),
};

/* ---------------------------------------------------------- dizionari -- */

const types: ArtifactIndex["types"] = Object.fromEntries(
  Object.entries(source.tipi).map(([code, type]) => [
    code,
    { key: type.chiave, name: required(type.nome, `tipo ${code}`), prefix: required(type.sigla, `sigla del tipo ${code}`) },
  ]),
);

const grades: ArtifactIndex["grades"] = Object.fromEntries(
  Object.entries(source.gradi).map(([code, grade]) => [
    code,
    {
      code: grade.sigla,
      name: required(grade.nome, `grado ${code}`),
      plate: {
        name: required(grade.placcata.nome, `Carta placcata del grado ${code}`),
        points: grade.placcata.punti,
        icon: grade.placcata.icona !== null && images.plates.has(grade.placcata.icona),
      },
    },
  ]),
);

const contents: ArtifactIndex["filters"]["contents"] = Object.fromEntries(
  Object.entries(source.filtri.contenuti).map(([code, entry]) => [
    code,
    {
      name: required(entry.nome, `filtro dei contenuti ${code}`),
      icon: entry.icona && images.filters.has(`${entry.icona}.png`) ? entry.icona : null,
    },
  ]),
);

const misc: ArtifactIndex["filters"]["misc"] = Object.fromEntries(
  Object.entries(source.filtri.varie).map(([code, entry]) => [code, { name: required(entry.nome, `filtro varie ${code}`) }]),
);

const classes: Record<string, number[]> = Object.fromEntries(
  Object.entries(source.potenziamento.classi).map(([code, levels]) => {
    levels.forEach((step, position) => {
      if (step.livello !== position + 2) fail(`classe ${code}: i livelli non partono dal 2 o hanno buchi`);
    });
    return [code, levels.map((step) => step.punti_totali)];
  }),
);

/* -------------------------------------------------------------- carte -- */

const setIds = new Set(source.set.map((set) => String(set.id)));
const packIds = new Set(source.pacchetti.map((pack) => String(pack.id)));

const cards: ArtifactCard[] = source.carte.map((card) => {
  const id = String(card.id);
  if (!types[String(card.tipo)]) fail(`carta ${id}: tipo ${card.tipo} sconosciuto`);
  if (!grades[String(card.grado)]) fail(`carta ${id}: grado ${card.grado} sconosciuto`);
  if (card.set !== null && !setIds.has(String(card.set))) fail(`carta ${id}: il set ${card.set} non c'e'`);
  for (const pack of card.pacchetti) if (!packIds.has(pack)) fail(`carta ${id}: il pacchetto ${pack} non c'e'`);
  return {
    id,
    type: card.tipo,
    number: card.numero,
    grade: card.grado,
    name: required(card.nome, `carta ${id}`),
    description: labelOrNull(card.descrizione),
    stats: { atk: card.statistiche.attacco, def: card.statistiche.difesa, hp: card.statistiche.ps },
    set: card.set === null ? null : String(card.set),
    packs: card.pacchetti,
    timePack: card.pacchetto_del_tempo
      ? { weight: card.pacchetto_del_tempo.peso, wishWeight: card.pacchetto_del_tempo.peso_nella_lista }
      : null,
    image: images.cards.has(`${id}.webp`) && images.small.has(`${id}.webp`),
  };
});
const cardIds = new Set(cards.map((card) => card.id));

/* ---------------------------------------------------------------- set -- */

const numbers = new Set<number>();
const sets: ArtifactSet[] = source.set.map((set) => {
  const id = String(set.id);
  if (numbers.has(set.numero)) fail(`set ${id}: il numero ${set.numero} e' gia' di un altro set`);
  numbers.add(set.numero);
  const cardList = set.carte.map(String);
  for (const card of cardList) {
    if (!cardIds.has(card)) fail(`set ${id}: la carta ${card} non c'e'`);
    if (cards.find((entry) => entry.id === card)?.set !== id) fail(`set ${id}: la carta ${card} dice di stare in un altro set`);
  }
  const levels = set.livelli.map((level, position) => {
    if (level.livello !== position + 1) fail(`set ${id}: i livelli non partono dall'1 o hanno buchi`);
    return required(level.testo, `set ${id}, livello ${level.livello}`);
  });
  // per arrivare al livello massimo servono i totali dei livelli 2..massimo
  if ((classes[String(set.classe)]?.length ?? 0) < levels.length - 1) {
    fail(`set ${id}: la classe ${set.classe} non ha i punti per ${levels.length} livelli`);
  }
  for (const code of set.filtri.contenuti) if (!contents[String(code)]) fail(`set ${id}: contenuto ${code} senza nome`);
  for (const code of set.filtri.varie) if (!misc[String(code)]) fail(`set ${id}: filtro varie ${code} senza nome`);
  for (const code of set.filtri.razze) if (code < 1 || code > 6) fail(`set ${id}: razza ${code} sconosciuta`);
  for (const code of set.filtri.caratteristiche) if (code < 1 || code > 10) fail(`set ${id}: caratteristica ${code} sconosciuta`);
  return {
    id,
    number: set.numero,
    name: required(set.nome, `set ${id}`),
    cards: cardList,
    levels,
    enhanceClass: set.classe,
    filters: {
      contents: set.filtri.contenuti,
      races: set.filtri.razze,
      factions: set.filtri.caratteristiche,
      misc: set.filtri.varie,
    },
    event: labelOrNull(set.evento?.nome),
  };
});
sets.sort((a, b) => a.number - b.number);

/* ---------------------------------------------------------- pacchetti -- */

const packs: Record<string, ArtifactPack> = {};
for (const pack of source.pacchetti) {
  const id = String(pack.id);
  for (const entry of pack.carte) if (!cardIds.has(String(entry.carta))) fail(`pacchetto ${id}: la carta ${entry.carta} non c'e'`);
  packs[id] = {
    name: labelOrNull(pack.nome),
    description: labelOrNull(pack.descrizione),
    icon: pack.icona && images.packs.has(pack.icona) ? pack.icona : null,
    cards: pack.carte.map((entry) => ({ card: String(entry.carta), weight: entry.peso })),
    total: pack.totale,
  };
}

/* ------------------------------------------------------------ scrittura -- */

const time = source.pacchetto_del_tempo;
const index: ArtifactIndex = {
  names: {
    cards: required(source.nomi.carte, "nome delle carte"),
    set: required(source.nomi.set, "nome dei set"),
    setBonus: required(source.nomi.set_bonus, "nome del set bonus"),
    pack: required(source.nomi.pacchetto, "nome dei pacchetti"),
  },
  guide: source.guida.map((page, position) => required(page, `guida, pagina ${position + 1}`)),
  unlock: { rank: source.sblocco.rango, text: labelOrNull(source.sblocco.testo) },
  plateText: labelOrNull(source.placcate_testo),
  types,
  grades,
  filters: {
    contents,
    misc,
  },
  enhancement: { classes, cardsPerRound: source.potenziamento.carte_per_volta },
  cards,
  sets,
  packs,
  timePack: time
    ? {
        title: labelOrNull(time.titolo),
        rules: time.regole.map((rule) => label(rule)),
        cost: labelOrNull(time.costo),
        cards: time.carte,
      }
    : null,
};

/**
 * Il dato come letterale tipato: una carta, un set e un pacchetto per riga,
 * perche' dopo una patch il diff dica quale e' cambiato.
 */
function rows(values: readonly unknown[]): string {
  return `[\n${values.map((value) => `  ${JSON.stringify(value)},`).join("\n")}\n ]`;
}

const LISTS = new Set(["cards", "sets", "packs"]);
const body = [
  ...Object.entries(index)
    .filter(([key]) => !LISTS.has(key))
    .map(([key, value]) => ` ${key}: ${JSON.stringify(value)},`),
  ` cards: ${rows(index.cards)},`,
  ` sets: ${rows(index.sets)},`,
  ` packs: {\n${Object.entries(index.packs)
    .map(([id, pack]) => `  ${JSON.stringify(id)}: ${JSON.stringify(pack)},`)
    .join("\n")}\n },`,
].join("\n");

writeFileSync(
  DEST_DATA,
  `/**
 * Gli artefatti di Grand Cross: Carte artefatto e Set artefatto.
 *
 * FONTE: il client, via python script/artefatti.py (eroi/artefatti.json): le tabelle
 * DB_artifact_*, i pacchetti di carte (DB_cardpack_artifact_*), i testi, le passive
 * dei set (DB_skill_passive), i punti di potenziamento (DB_exp.union_class_*).
 * DEDOTTI: i punti come totali per livello (306 squadre del computer su 306 li
 * confermano) e le probabilita' dei pacchetti come peso sulla somma dei pesi.
 *
 * GENERATO DA scripts/import-artifacts.mts - NON MODIFICARE A MANO.
 */

import type { ArtifactIndex } from "../artifact-types";

export const ARTIFACTS: ArtifactIndex = {
${body}
};
`,
  "utf8",
);

const missingImages = cards.filter((card) => !card.image).length;
console.log(`  carte: ${cards.length} (${cards.filter((card) => card.set).length} in un set), senza immagine: ${missingImages}`);
console.log(`  set: ${sets.length}, pacchetti: ${Object.keys(packs).length}`);
console.log(
  `  immagini: ${images.cards.size + images.small.size + images.packs.size + images.plates.size + images.filters.size} copiate in public/eroi/${GAME}/artefatti/\n`,
);
