/**
 * Importazione del filtro «Effetto» di Grand Cross: le voci della ricerca del
 * gioco, e quali eroi le hanno sulle carte.
 *
 *   npm run effetti:import    (lo lancia anche npm run eroi:import, dopo gli eroi)
 *
 * Legge dal repo, gia' pronti (non dalla pipeline, che li ha scritti):
 *
 *   data/grand-cross/effetti/carte_base.json     le carte, con i tag del gioco
 *   data/grand-cross/concetti/tassonomia.json    le voci e i gruppi della ricerca
 *
 * e scrive:
 *
 *   src/lib/games/grand-cross/skill-tags.generated.ts
 *
 * I tag stanno solo sul rango piu' alto di ogni carta: basta unire le righe di un
 * eroe, senza guardare il rango. L'Attacco combinato si salta: non e' una carta
 * dell'eroe.
 *
 * Una voce vale se almeno un eroe del roster ce l'ha. Il gruppo «Tutte le
 * abilita'» resta fuori: non e' un effetto.
 *
 * Tag diversi con lo stesso nome nelle due lingue diventano una voce sola, con
 * l'unione degli eroi: chi cerca «Riduzione Barra Mossa finale» vuole tutti quelli
 * che la riducono, e nel menu tre voci uguali non si distinguerebbero. La voce sta
 * dove sta il tag piu' basso. Il nome uguale in una lingua sola non basta: in
 * italiano Shatter e Crush sono tutte e due «Frantumazione», ma sono effetti diversi.
 *
 * Si ferma se una carta cita un tag senza voce, se una voce non ha nome o se una
 * carta e' di un eroe fuori dal roster: un buco qui darebbe un elenco sbagliato
 * senza che si noti. I dati stanno nel repo, quindi un file mancante e' un errore.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";
import type { SkillTagEntry, SkillTagGroup } from "../src/lib/games/skill-tags-types";
import type { HeroLabel } from "../src/lib/games/types";

const ROOT = process.cwd();
const CARDS_JSON = resolve(ROOT, "data/grand-cross/effetti/carte_base.json");
const TAXONOMY_JSON = resolve(ROOT, "data/grand-cross/concetti/tassonomia.json");
const DEST = resolve(ROOT, "src/lib/games/grand-cross/skill-tags.generated.ts");

/** il gruppo «Tutte le abilita'» del client */
const ALL_SKILLS = "05";

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

interface SrcCard {
  slot: "A" | "B" | "ultimate" | "coop";
  rango: number;
  eroi: string[];
  list_array_skill_search_tag: number[];
}

interface SrcEntry {
  nome: HeroLabel;
  descrizione: HeroLabel;
  tag?: number;
  gruppo?: string;
  ordine?: number;
}

interface SrcTaxonomy {
  voci: Record<string, SrcEntry>;
  /** tag -> chiave della voce: fa fede lei se piu' voci avessero lo stesso tag */
  per_tag: Record<string, string>;
  gruppi_ricerca: Record<string, { etichetta: HeroLabel }>;
}

const cards = (JSON.parse(readFileSync(CARDS_JSON, "utf8")) as { righe: Record<string, SrcCard> }).righe;
const taxonomy = JSON.parse(readFileSync(TAXONOMY_JSON, "utf8")) as SrcTaxonomy;

/* ------------------------------------------------- chi ha cosa sulle carte -- */

const roster = new Set(HEROES.map((hero) => hero.id));
const holders = new Map<number, Set<string>>();

for (const [id, card] of Object.entries(cards)) {
  if (card.slot === "coop") continue;
  for (const hero of card.eroi) {
    if (!roster.has(hero)) fail(`la carta ${id} e' dell'eroe ${hero}, che non e' nel roster`);
  }
  for (const tag of card.list_array_skill_search_tag) {
    if (!taxonomy.voci[taxonomy.per_tag[String(tag)] ?? ""]) fail(`la carta ${id} cita il tag ${tag}, che non ha una voce`);
    const heroes = holders.get(tag) ?? new Set<string>();
    for (const hero of card.eroi) heroes.add(hero);
    holders.set(tag, heroes);
  }
}

/* ------------------------------------------------ le voci, fuse per nome -- */

interface TaggedEntry {
  tag: number;
  entry: SrcEntry;
  heroes: ReadonlySet<string>;
}

const byName = new Map<string, TaggedEntry[]>();
const tagged = [...holders]
  .map(([tag, heroes]) => ({ tag, entry: taxonomy.voci[taxonomy.per_tag[String(tag)]!]!, heroes }))
  .filter(({ entry }) => entry.gruppo !== ALL_SKILLS)
  .sort((a, b) => a.tag - b.tag);

for (const item of tagged) {
  const { it, en } = item.entry.nome;
  if (!it && !en) fail(`il tag ${item.tag} ha una voce senza nome`);
  const key = JSON.stringify([it, en]);
  byName.set(key, [...(byName.get(key) ?? []), item]);
}

/** I testi del client portano colori e a capo: la riga sotto la barra e' una. */
function plain(text: string | null): string | null {
  return (
    text
      ?.replace(/\[[0-9a-f]{6}\]|\[-\]/gi, "")
      .replace(/\s*\n\s*/g, " ")
      .trim() || null
  );
}

/**
 * La descrizione di una voce. Per una voce fusa tutte quelle diverse: dicono in
 * che modi si ottiene l'effetto («riduce», «alla fine del turno nemico», «quando
 * subisce un attacco»), e tenerne una sola farebbe sembrare gli altri eroi fuori
 * posto. Il punto serve solo a staccarle: non tutte nel client chiudono con uno.
 */
function description(items: readonly TaggedEntry[], locale: keyof HeroLabel): string | null {
  const texts = [...new Set(items.flatMap((item) => plain(item.entry.descrizione[locale]) ?? []))];
  if (texts.length < 2) return texts[0] ?? null;
  return texts.map((text) => (/[.!?]$/.test(text) ? text : `${text}.`)).join(" ");
}

const entries = [...byName.values()].map((items) => {
  const [first] = items as [TaggedEntry, ...TaggedEntry[]];
  const owners = new Set(items.flatMap((item) => [...item.heroes]));
  const built: SkillTagEntry = {
    tags: items.map((item) => item.tag) as unknown as SkillTagEntry["tags"],
    label: first.entry.nome,
    description: { it: description(items, "it"), en: description(items, "en") },
    heroes: HEROES.filter((hero) => owners.has(hero.id)).map((hero) => hero.id),
  };
  return { built, group: first.entry.gruppo ?? "", order: first.entry.ordine ?? 0 };
});

/* ----------------------------------------------------------------- gruppi -- */

const groups: SkillTagGroup[] = [];
for (const id of new Set(entries.map((entry) => entry.group))) {
  const source = taxonomy.gruppi_ricerca[id];
  if (!source) fail(`il gruppo «${id}» non e' fra quelli della ricerca`);
  groups.push({
    id,
    label: source.etichetta,
    entries: entries
      .filter((entry) => entry.group === id)
      .sort((a, b) => a.order - b.order || a.built.tags[0] - b.built.tags[0])
      .map((entry) => entry.built),
  });
}
groups.sort((a, b) => a.id.localeCompare(b.id));

/* -------------------------------------------------------------- scrittura -- */

const json = (value: unknown) => JSON.stringify(value);

const lines = [
  `/**`,
  ` * Il filtro «Effetto» della griglia Eroi di Grand Cross: le voci della ricerca del`,
  ` * gioco, e quali eroi le hanno sulle carte.`,
  ` *`,
  ` * GENERATO DA scripts/import-skill-tags.mts - NON MODIFICARE A MANO.`,
  ` * Si rigenera con \`npm run effetti:import\` (o \`npm run eroi:import\`).`,
  ` *`,
  ` * FONTE: data/grand-cross/effetti/carte_base.json e`,
  ` * data/grand-cross/concetti/tassonomia.json. Il contratto sta in skill-tags-types.ts.`,
  ` */`,
  ``,
  `import type { SkillTagsIndex } from "../skill-tags-types";`,
  ``,
  `export const SKILL_TAGS: SkillTagsIndex = {`,
  `  groups: [`,
  ...groups.flatMap((group) => [
    `    {`,
    `      id: ${json(group.id)},`,
    `      label: ${json(group.label)},`,
    `      entries: [`,
    ...group.entries.map((entry) => `        ${json(entry)},`),
    `      ],`,
    `    },`,
  ]),
  `  ],`,
  `};`,
  ``,
];
writeFileSync(DEST, lines.join("\n"), "utf8");

const merged = entries.filter((entry) => entry.built.tags.length > 1);
const covered = new Set(entries.flatMap((entry) => entry.built.heroes));
const unused = Object.keys(taxonomy.per_tag).filter((tag) => !holders.has(Number(tag)));

console.log(`  filtro Effetto della griglia Eroi`);
console.log(`    tag citati dalle carte     ${holders.size}; voci della tassonomia senza eroi ${unused.length}`);
console.log(`    voci nel menu              ${entries.length}, in ${groups.length} gruppi`);
for (const group of groups) console.log(`      ${group.id} ${group.label.it}: ${group.entries.length}`);
console.log(`    voci fuse                  ${merged.length}`);
for (const { built } of merged) console.log(`      ${built.label.it} (${built.tags.join(", ")}): ${built.heroes.length} eroi`);
console.log(`    eroi con almeno una voce   ${covered.size} su ${HEROES.length}`);
console.log(`  -> ${DEST}`);
