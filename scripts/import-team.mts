/**
 * Importazione della squadra di Grand Cross: per ogni passiva che conta per la
 * squadra, chi riceve l'effetto e chi lo fa scattare, frase per frase.
 *
 *   npm run squadra:import    (lo lancia anche npm run eroi:import, dopo le parole blu)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/squadra.json   python script/squadra.py
 *
 * e dal sito i dati degli eroi gia' generati (abilita', abilita' speciali,
 * reliquie, contesto, parole blu): i testi sono quelli che la pagina mostra, e il
 * legame si fa su quelli, come per le parole blu. Scrive:
 *
 *   src/lib/games/grand-cross/team.generated.ts
 *
 * Le frasi. La pipeline ha diviso ogni testo inglese in frasi e ha scritto, per
 * quelle che riguardano la squadra, il numero della frase e la frase. Qui lo
 * stesso testo si divide con la stessa regola (`sentencesOf`, la copia di
 * `frasi` di squadra.py) e si controlla di ritrovare le stesse frasi agli stessi
 * numeri: se le due regole divergono l'import si ferma, invece di appaiare una
 * lettura alla frase sbagliata. Poi si divide il testo italiano, e se ha tante
 * frasi quante l'inglese (e le note negli stessi posti) le frasi si appaiano per
 * posizione; se no l'italiano di quel testo resta null e la pagina mostra la
 * frase inglese. Misurato il 03/10 sulle Uniche e sulle reliquie: 679 testi su
 * 689 si appaiano.
 *
 * Si ferma anche se un testo di passiva del sito non e' nel JSON (la pipeline e
 * il sito non leggono piu' gli stessi testi: va rilanciata). Se il JSON manca non
 * tocca niente.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { HERO_ABILITIES } from "../src/lib/games/grand-cross/hero-abilities.generated";
import { HERO_CONTEXT } from "../src/lib/games/grand-cross/hero-context.generated";
import { HERO_RELICS } from "../src/lib/games/grand-cross/hero-relics.generated";
import { HERO_SPECIALS } from "../src/lib/games/grand-cross/hero-specials.generated";
import { HERO_TERMS } from "../src/lib/games/grand-cross/hero-terms.generated";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";
import type { HeroTermGroup } from "../src/lib/games/hero-terms-types";
import { sentencesOf } from "../src/lib/games/team";
import type { TeamCondition, TeamLink, TeamPlace, TeamSource, TeamText, TeamWho } from "../src/lib/games/team-types";
import type { HeroLabel } from "../src/lib/games/types";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/squadra.json");
const DEST = resolve(ROOT, "src/lib/games/grand-cross/team.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

interface SrcWho {
  alleati?: boolean;
  gruppo?: boolean;
  razze?: number[];
  fazioni?: number[];
  attributi?: number[];
  personaggi?: string[];
  diversi?: boolean;
  stessa_razza?: boolean;
  unita?: boolean;
}

interface SrcLink {
  n: number;
  en: string;
  nota?: boolean;
  riceve?: SrcWho[];
  condizioni?: { tipo: "ogni" | "quando" | "se" | "tutti"; chi: SrcWho }[];
  se?: boolean;
  nemici?: boolean;
  senza_se?: boolean;
  due_parti?: boolean;
  con_panchina?: boolean;
  dalla_panchina?: boolean;
  razza_aggiunta?: number[];
  solo?: string[];
  tranne?: string[];
}

interface SrcGroup {
  definizione: string;
  razze: number[];
  fazioni: number[];
  personaggi: string[];
  attributi: number[];
  se_stesso: boolean;
}

interface Source {
  meta: Record<string, unknown>;
  testi: Record<string, { fonte: string; frasi: number; gruppi: SrcGroup[]; legami: SrcLink[] }>;
}

if (!existsSync(SOURCE_JSON)) {
  console.log(`  squadra.json non trovato: salto la squadra.`);
  console.log(`  (si genera con: python script\\squadra.py, dentro _7dsgc)`);
  process.exit(0);
}

const source = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Source;

/* ------------------------------------------------------- la conversione -- */

const PLACES = new Set<TeamPlace>(["pve", "pvp", "destroy", "nest", "boss_ordine"]);

function places(list: readonly string[] | undefined, where: string): TeamPlace[] | undefined {
  if (!list?.length) return undefined;
  for (const place of list) if (!PLACES.has(place as TeamPlace)) fail(`contenuto sconosciuto «${place}» in ${where}`);
  return list as TeamPlace[];
}

function who(chi: SrcWho, where: string): TeamWho {
  const out: { -readonly [K in keyof TeamWho]: TeamWho[K] } = {};
  if (chi.alleati) out.allies = true;
  if (chi.gruppo) out.group = true;
  if (chi.razze?.length) out.races = chi.razze;
  if (chi.fazioni?.length) out.factions = chi.fazioni;
  if (chi.attributi?.length) out.attributes = chi.attributi;
  if (chi.personaggi?.length) out.characters = chi.personaggi;
  if (chi.diversi) out.differentRaces = true;
  if (chi.stessa_razza) out.sameRace = true;
  if (chi.unita) out.unity = true;
  if (Object.keys(out).length === 0 || (Object.keys(out).length === 1 && out.unity)) {
    fail(`chi vuoto in ${where}: ${JSON.stringify(chi)}`);
  }
  return out;
}

const KIND: Record<string, TeamCondition["kind"]> = { ogni: "each", quando: "when", se: "if", tutti: "all" };

/* ------------------------------------------ frasi, gruppi, testi (indici) -- */

const sentences: HeroLabel[] = [];
const sentenceIndex = new Map<string, number>();
function sentence(label: HeroLabel): number {
  const key = `${label.en}\u0001${label.it ?? ""}`;
  let index = sentenceIndex.get(key);
  if (index === undefined) {
    index = sentences.length;
    sentences.push(label);
    sentenceIndex.set(key, index);
  }
  return index;
}

// La definizione italiana del gruppo: le parole blu ce l'hanno gia', accostata
// alla nota italiana. Si cerca per la frase inglese della nota.
const italianGroup = new Map(HERO_TERMS.groups.map((group) => [group.definition.en, group.definition.it]));
const groups: HeroTermGroup[] = [];
const groupIndex = new Map<string, number>();
function group(src: SrcGroup): number {
  const value: HeroTermGroup = {
    definition: { it: italianGroup.get(src.definizione) ?? null, en: src.definizione },
    enemies: false,
    races: src.razze,
    factions: src.fazioni,
    characters: src.personaggi,
    attributes: src.attributi,
    self: src.se_stesso,
  };
  const key = JSON.stringify(value);
  let index = groupIndex.get(key);
  if (index === undefined) {
    index = groups.length;
    groups.push(value);
    groupIndex.set(key, index);
  }
  return index;
}

const texts: TeamText[] = [];
const textIndex = new Map<string, number>();
const missing: string[] = [];
let italianPaired = 0;
let italianTexts = 0;

/**
 * Il testo della pagina (inglese e italiano) -> la sua posizione in `texts`, o
 * -1 se non ha frasi per la squadra.
 */
function text(en: string, it: string | undefined, where: string): number {
  const read = source.testi[en];
  if (!read) {
    missing.push(where);
    return -1;
  }
  if (read.legami.length === 0) return -1;
  const key = `${en}\u0001${it ?? ""}`;
  const known = textIndex.get(key);
  if (known !== undefined) return known;

  const enSentences = sentencesOf(en);
  if (enSentences.length !== read.frasi) {
    fail(`${where}: il sito divide il testo in ${enSentences.length} frasi, la pipeline in ${read.frasi}`);
  }
  const itSentences = it ? sentencesOf(it) : [];
  const paired =
    itSentences.length === enSentences.length && itSentences.every((s, i) => s.note === enSentences[i]!.note);
  if (it) {
    italianTexts++;
    if (paired) italianPaired++;
  }

  const links: TeamLink[] = read.legami.map((src) => {
    const here = `${where}, frase ${src.n}`;
    const mine = enSentences[src.n];
    if (!mine || mine.text !== src.en) fail(`${here}: il sito trova «${mine?.text}», la pipeline «${src.en}»`);
    const link: { -readonly [K in keyof TeamLink]: TeamLink[K] } = {
      sentence: sentence({ it: paired ? itSentences[src.n]!.text : null, en: src.en }),
    };
    if (src.nota) link.note = true;
    if (src.riceve?.length) link.receives = src.riceve.map((chi) => who(chi, here));
    if (src.condizioni?.length) {
      link.conditions = src.condizioni.map((c) => {
        const kind = KIND[c.tipo];
        if (!kind) fail(`${here}: condizione sconosciuta «${c.tipo}»`);
        return { kind, who: who(c.chi, here) };
      });
    }
    if (src.se) link.self = true;
    if (src.senza_se) link.notSelf = true;
    if (src.due_parti) link.bothSides = true;
    if (src.con_panchina) link.withBench = true;
    if (src.dalla_panchina) link.fromBench = true;
    if (src.razza_aggiunta?.length) link.extraRaces = src.razza_aggiunta;
    const only = places(src.solo, here);
    const except = places(src.tranne, here);
    if (only) link.only = only;
    if (except) link.except = except;
    return link;
  });
  const usesGroup = links.some((link) =>
    [...(link.receives ?? []), ...(link.conditions ?? []).map((c) => c.who)].some((w) => w.group),
  );
  const index = texts.length;
  texts.push({ group: usesGroup && read.gruppi[0] ? group(read.gruppi[0]) : null, links });
  textIndex.set(key, index);
  return index;
}

/** I passi di una passiva: il testo del rango 1, poi quelli che cambiano col rango dell'ultimate. */
function steps(
  base: { text: string; textIt?: string },
  more: readonly { fromUltimateRank: number; text: string; textIt?: string }[] | undefined,
  where: string,
): (readonly [number, number])[] {
  return [
    [1, text(base.text, base.textIt, where)] as const,
    ...(more ?? []).map((step) => [step.fromUltimateRank, text(step.text, step.textIt, `${where} (rango ${step.fromUltimateRank})`)] as const),
  ];
}

/* ------------------------------------------------------------ gli eroi -- */

const heroes: Record<string, TeamSource[]> = {};
let sources = 0;
for (const hero of HEROES) {
  const hid = hero.id;
  const list: TeamSource[] = [];
  const passive = HERO_ABILITIES[hid]?.passive;
  if (passive?.text) {
    list.push({
      kind: "unique",
      id: hid,
      name: passive.nameI18n ?? { it: passive.name ?? null, en: passive.name ?? null },
      conditions: HERO_CONTEXT.heroes[hid]?.passiveConditions ?? [],
      steps: steps({ text: passive.text, textIt: passive.textIt }, passive.ultimateSteps, `Unica di ${hid}`),
    });
  }
  for (const id of HERO_SPECIALS.heroes[hid] ?? []) {
    const ability = HERO_SPECIALS.abilities[id];
    if (!ability) continue;
    list.push({
      kind: "special",
      id,
      name: ability.name,
      special: ability.kind,
      conditions: ability.conditions,
      steps: steps({ text: ability.text, textIt: ability.textIt }, ability.ultimateSteps, `abilita' speciale ${id}`),
    });
  }
  // La reliquia classica: un eroe che ne ha due (Freyja) ne attiva una alla volta.
  const relicIds = HERO_RELICS.heroes[hid] ?? [];
  const relicId = relicIds.find((id) => HERO_RELICS.relics[id]?.classic) ?? relicIds[0];
  const relic = relicId ? HERO_RELICS.relics[relicId] : undefined;
  if (relicId && relic?.passive?.text.en) {
    list.push({
      kind: "relic",
      id: relicId,
      name: relic.name,
      conditions: relic.passive.conditions,
      steps: [[1, text(relic.passive.text.en, relic.passive.text.it ?? undefined, `reliquia ${relicId}`)]],
    });
  }
  if (list.length > 0) heroes[hid] = list;
  sources += list.length;
}

if (missing.length > 0) {
  fail(
    `${missing.length} testi di passiva del sito non sono in squadra.json (rilanciare python script\\squadra.py):\n    ` +
      missing.slice(0, 10).join("\n    "),
  );
}

/* ------------------------------------------------------------- scrittura -- */

const linkCount = texts.reduce((n, t) => n + t.links.length, 0);
const lines = [
  "/**",
  " * GENERATO da scripts/import-team.mts: non modificare a mano.",
  " *",
  " * Per ogni passiva che conta per la squadra (Unica, abilita' speciali, Reliquia",
  " * sacra classica) chi riceve l'effetto e chi lo fa scattare, frase per frase.",
  " * Fonte: _7dsgc/eroi/squadra.json (python script/squadra.py), letto dal testo",
  " * inglese del client; l'italiano appaiato per posizione. Il contratto sta in",
  " * team-types.ts, la valutazione di una squadra in team.ts.",
  " *",
  ` * ${Object.keys(heroes).length} eroi, ${sources} passive, ${texts.length} testi con frasi per la squadra,`,
  ` * ${linkCount} frasi lette (${sentences.length} diverse), italiano appaiato in ${italianPaired} testi su ${italianTexts}.`,
  " */",
  "",
  'import type { TeamIndex } from "../team-types";',
  "",
  "export const TEAM: TeamIndex = {",
  "  sentences: [",
  ...sentences.map((s) => `    ${JSON.stringify(s)},`),
  "  ],",
  "  groups: [",
  ...groups.map((g) => `    ${JSON.stringify(g)},`),
  "  ],",
  "  texts: [",
  ...texts.map((t) => `    ${JSON.stringify(t)},`),
  "  ],",
  "  heroes: {",
  ...Object.entries(heroes).map(([hid, list]) => `    ${JSON.stringify(hid)}: ${JSON.stringify(list)},`),
  "  },",
  "};",
  "",
];
writeFileSync(DEST, lines.join("\n"));

console.log(`  squadra: ${Object.keys(heroes).length} eroi, ${sources} passive, ${texts.length} testi con frasi per la squadra`);
console.log(`  frasi lette ${linkCount} (${sentences.length} diverse), gruppi ${groups.length}`);
console.log(`  italiano appaiato in ${italianPaired} testi su ${italianTexts}`);
console.log(`  scritto ${DEST}`);
