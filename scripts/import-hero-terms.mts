/**
 * Importazione delle parole blu di Grand Cross: cosa c'e' dietro ogni parola blu
 * della scheda eroe, e quali eroi hanno la stessa cosa.
 *
 *   npm run parole:import    (lo lancia anche npm run eroi:import, dopo gli eroi)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/parole_blu.json   python script/parole_blu.py
 *
 * e dal sito i dati degli eroi gia' generati (abilita', abilita' speciali,
 * reliquie, roster): i testi sono quelli che la pagina mostra, e il
 * legame si fa su quelli. Scrive:
 *
 *   src/lib/games/grand-cross/hero-terms.generated.ts
 *
 * Come si lega una parola al suo bersaglio. La pipeline ha letto ogni parola blu
 * del testo inglese con la logica di contesto_eroi.py e ne ha scritto, in
 * ordine, cosa ha capito. Qui si contano le parole blu come le conta la pagina
 * (`termWords`, hero-markup.ts) e si accostano a quelle della pipeline per
 * testo, in ordine: una parola che la pipeline ha contato e la pagina no (una
 * riga di nota che continua) si salta, invece di spostare tutte quelle dopo.
 * Le parole italiane si legano a quelle inglesi dello stesso testo con una
 * prova (la traduzione del gioco, la nota appaiata, il nome del bersaglio), e
 * per posizione solo quelle rimaste senza prove: vedi «le parole blu
 * dell'italiano» qui sotto.
 *
 * Si ferma se due testi hanno la stessa impronta, o se un bersaglio cita un
 * concetto senza nome. Se il JSON manca non tocca niente.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { HERO_ABILITIES } from "../src/lib/games/grand-cross/hero-abilities.generated";
import { HERO_CONTEXT } from "../src/lib/games/grand-cross/hero-context.generated";
import { HERO_RELICS } from "../src/lib/games/grand-cross/hero-relics.generated";
import { HERO_SPECIALS } from "../src/lib/games/grand-cross/hero-specials.generated";
import { HEROES } from "../src/lib/games/grand-cross/heroes.generated";
import { splitHeroNotes, termWords } from "../src/lib/games/hero-markup";
import { textKey } from "../src/lib/games/hero-terms";
import type { HeroTermConcept, HeroTermGroup, HeroTermPlace } from "../src/lib/games/hero-terms-types";
import type { HeroLabel } from "../src/lib/games/types";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/parole_blu.json");
const DEST = resolve(ROOT, "src/lib/games/grand-cross/hero-terms.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

interface SrcWord {
  testo: string;
  chiavi?: string[];
  razze?: number[];
  fazioni?: number[];
}

interface SrcGroup {
  nemici: boolean;
  definizione: string;
  razze: number[];
  fazioni: number[];
  personaggi: string[];
  attributi: number[];
  se_stesso: boolean;
}

interface SrcConcept {
  etichetta: { it: string | null; en: string | null };
  definizione: { it: string | null; en: string | null };
  certezza: "dichiarato" | "dedotto";
}

interface Source {
  meta: Record<string, unknown>;
  concetti: Record<string, SrcConcept>;
  testi: Record<string, { blu: SrcWord[]; applicabili?: SrcGroup[] }>;
}

if (!existsSync(SOURCE_JSON)) {
  console.log(`  parole_blu.json non trovato: salto le parole blu.`);
  console.log(`  (si genera con: python script\\parole_blu.py, dentro _7dsgc)`);
  process.exit(0);
}

const source = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Source;

/* ------------------------------------------- i testi che la pagina mostra -- */

/** Un testo della scheda: l'inglese (la chiave), l'italiano, e di chi e' dove. */
interface PageText {
  en: string;
  it: string | undefined;
  place: HeroTermPlace;
}

const pageTexts: PageText[] = [];
for (const hero of HEROES) {
  const hid = hero.id;
  const abilities = HERO_ABILITIES[hid];
  for (const card of abilities?.cards ?? []) {
    for (const rank of card.ranks) pageTexts.push({ en: rank.text, it: rank.textIt, place: [hid, card.slot ?? "A", rank.rank] });
  }
  for (const rank of abilities?.ultimate?.ranks ?? []) {
    pageTexts.push({ en: rank.text, it: rank.textIt, place: [hid, "ultimate", rank.rank] });
  }
  const passive = abilities?.passive;
  if (passive?.text) {
    pageTexts.push({ en: passive.text, it: passive.textIt, place: [hid, "passiva", 1] });
    for (const step of passive.ultimateSteps ?? []) {
      pageTexts.push({ en: step.text, it: step.textIt, place: [hid, "passiva", step.fromUltimateRank] });
    }
  }
  for (const id of HERO_SPECIALS.heroes[hid] ?? []) {
    const ability = HERO_SPECIALS.abilities[id];
    if (!ability) continue;
    pageTexts.push({ en: ability.text, it: ability.textIt, place: [hid, `s:${id}`, 1] });
    for (const step of ability.ultimateSteps ?? []) {
      pageTexts.push({ en: step.text, it: step.textIt, place: [hid, `s:${id}`, step.fromUltimateRank] });
    }
  }
  for (const id of HERO_RELICS.heroes[hid] ?? []) {
    const text = HERO_RELICS.relics[id]?.passive?.text;
    if (text?.en) pageTexts.push({ en: text.en, it: text.it ?? undefined, place: [hid, `r:${id}`, 1] });
  }
}

/* ------------------------------------------------- le note, per l'italiano -- */

const NOTE_HEAD = /^[※*]\s*([^:]{1,60}?)\s*:\s*(.+)$/;
const plain = (line: readonly { text: string }[]) =>
  line
    .map((segment) => segment.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();

/** Le note che aprono un termine, «※Nome: definizione», in ordine. */
function noteHeads(text: string): { name: string; definition: string }[] {
  return splitHeroNotes(text).notes.flatMap((line) => {
    const match = NOTE_HEAD.exec(plain(line));
    return match ? [{ name: match[1]!.trim(), definition: match[2]!.trim() }] : [];
  });
}

/** Il valore piu' frequente, o null. */
function mostCommon(counts: Map<string, number> | undefined): string | null {
  if (!counts || counts.size === 0) return null;
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]![0];
}

function bump(map: Map<string, Map<string, number>>, key: string, value: string) {
  const inner = map.get(key) ?? new Map<string, number>();
  inner.set(value, (inner.get(value) ?? 0) + 1);
  map.set(key, inner);
}

/* -------------------------------------------------------------- il legame -- */

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
// «Applicable Allies», «Applicable Ally», «Applicable Enemies», «Applicable heroes»
const APPLICABLE = /^applicable_/;

const groups: HeroTermGroup[] = [];
const groupIndex = new Map<string, number>();
const texts = new Map<string, (string | null)[]>();
const keyOwner = new Map<string, string>();
// nome inglese di una nota -> nome e definizione italiani, per voto
const itNoteName = new Map<string, Map<string, number>>();
const itNoteDefinition = new Map<string, Map<string, number>>();
// concetto -> la parola italiana che lo dice, per voto
const itWord = new Map<string, Map<string, number>>();
// concetto -> la parola italiana alla stessa distanza da una coppia sicura (solo per il nome)
const itWordNear = new Map<string, Map<string, number>>();

let missingText = 0;
let words = 0;
let wordsMatched = 0;
let wordsTargeted = 0;
let withItalian = 0;
let italianAligned = 0;
let applicableWithoutNote = 0;
// le parole che la pagina conta e la pipeline no, per voto: la lista da guardare dopo una patch
const unmatched = new Map<string, number>();

function groupFor(src: SrcGroup, it: string | null): number {
  const group: HeroTermGroup = {
    definition: { it, en: src.definizione },
    enemies: src.nemici,
    races: src.razze,
    factions: src.fazioni,
    characters: src.personaggi,
    attributes: src.attributi,
    self: src.se_stesso,
  };
  const id = JSON.stringify(group);
  const known = groupIndex.get(id);
  if (known !== undefined) return known;
  groups.push(group);
  groupIndex.set(id, groups.length - 1);
  return groups.length - 1;
}

for (const text of pageTexts) {
  const key = textKey(text.en);
  const owner = keyOwner.get(key);
  if (owner !== undefined && owner !== text.en) fail(`due testi con la stessa impronta ${key}`);
  keyOwner.set(key, text.en);

  // le note italiane, appaiate per posizione alle inglesi: danno il nome e la
  // definizione italiani ai concetti che il glossario ha solo in inglese
  const enNotes = noteHeads(text.en);
  const itNotes = text.it ? noteHeads(text.it) : [];
  const notesPaired = enNotes.length > 0 && enNotes.length === itNotes.length;
  if (notesPaired) {
    enNotes.forEach((note, index) => {
      bump(itNoteName, note.name.toLowerCase(), itNotes[index]!.name);
      bump(itNoteDefinition, note.name.toLowerCase(), itNotes[index]!.definition);
    });
  }

  if (texts.has(key)) continue;

  const entry = source.testi[text.en];
  const pageWords = termWords(text.en);
  words += pageWords.length;
  if (!entry) {
    missingText++;
    texts.set(key, pageWords.map(() => null));
    continue;
  }

  // la frase italiana della nota «applicabili», se le note si appaiano
  const applicableIt = (enemies: boolean): string | null => {
    if (!notesPaired) return null;
    const index = enNotes.findIndex(
      (note) => /applicable/i.test(note.name) && /enem/i.test(note.name) === enemies,
    );
    return index >= 0 ? itNotes[index]!.definition : null;
  };

  let cursor = 0;
  const targets = pageWords.map((word) => {
    const wanted = normalize(word);
    // Prima la parola identica; se non c'e', quella che comincia cosi'. Un
    // colore dentro il blu («[00D5FF]Unbound Prophecy [FFAE00](★★)[-][-]») la
    // pagina lo vede come due pezzi, e la sua parola blu e' solo l'inizio di
    // quella che ha letto la pipeline.
    const at = (same: (text: string) => boolean) => {
      for (let k = cursor; k < entry.blu.length; k++) if (same(normalize(entry.blu[k]!.testo))) return k;
      return -1;
    };
    let found = at((text) => text === wanted);
    if (found < 0 && wanted.length >= 3) found = at((text) => text.startsWith(wanted));
    if (found < 0) {
      unmatched.set(wanted, (unmatched.get(wanted) ?? 0) + 1);
      return null;
    }
    cursor = found + 1;
    wordsMatched++;
    const src = entry.blu[found]!;

    const parts: string[] = [];
    for (const concept of src.chiavi ?? []) {
      if (APPLICABLE.test(concept)) {
        // «alleati applicabili» non e' un effetto da cercare negli altri eroi:
        // e' la regola della nota di questo testo, e l'elenco e' chi ne fa parte
        // La nota del tipo giusto (alleati o nemici), o quella che c'e': in 6
        // testi la parola dice «enemies» e la nota e' degli alleati.
        const enemies = /enem/i.test(word);
        const notes = entry.applicabili ?? [];
        const note = notes.find((group) => group.nemici === enemies) ?? notes[0];
        if (note) parts.push(`g:${groupFor(note, applicableIt(note.nemici))}`);
        else {
          // Senza nota nel testo (la reliquia di 1984501): si decide dopo, con
          // gli altri testi dello stesso eroe
          parts.push("?");
          applicableWithoutNote++;
        }
        continue;
      }
      parts.push(`c:${concept}`);
    }
    for (const race of src.razze ?? []) parts.push(`r:${race}`);
    for (const faction of src.fazioni ?? []) parts.push(`f:${faction}`);
    if (parts.length === 0) return null;
    return parts.join("|");
  });
  texts.set(key, targets);
}

/*
 * Le parole «applicabili» senza nota nel loro testo prendono la regola degli
 * altri testi degli stessi eroi, se e' una sola; se no non si cliccano. Un
 * elenco «gli eroi che nominano gli alleati applicabili» non direbbe niente.
 */
const heroGroups = new Map<string, Set<string>>();
for (const text of pageTexts) {
  for (const target of texts.get(textKey(text.en)) ?? []) {
    for (const part of target?.split("|") ?? []) {
      if (!part.startsWith("g:")) continue;
      const set = heroGroups.get(text.place[0]) ?? new Set<string>();
      set.add(part);
      heroGroups.set(text.place[0], set);
    }
  }
}
let applicableFromHero = 0;
for (const [key, targets] of texts) {
  if (!targets.some((target) => target?.split("|").includes("?"))) continue;
  const owners = new Set(pageTexts.filter((text) => textKey(text.en) === key).map((text) => text.place[0]));
  const candidates = new Set([...owners].flatMap((hid) => [...(heroGroups.get(hid) ?? [])]));
  const only = candidates.size === 1 ? [...candidates][0]! : null;
  texts.set(
    key,
    targets.map((target) => {
      if (!target?.split("|").includes("?")) return target;
      const parts = target.split("|").flatMap((part) => (part === "?" ? (only ? [only] : []) : [part]));
      if (only) applicableFromHero++;
      return parts.length > 0 ? parts.join("|") : null;
    }),
  );
}
wordsTargeted = [...texts.values()].reduce((sum, targets) => sum + targets.filter((target) => target !== null).length, 0);

/* -------------------------------------------- le parole blu dell'italiano -- */

/*
 * Fino al 10/10 le parole italiane si legavano per POSIZIONE: la prima parola
 * blu italiana alla tendina della prima inglese, e cosi' via, se erano tante
 * quante. Ma il gioco in italiano mette il blu dove vuole: «Removes all
 * enemies' Buffs» e «Rimuove tutti i Buff dai nemici» sono la stessa parola,
 * mentre in altri testi l'italiano colora un pezzo di frase diverso, e allora
 * con lo stesso numero di parole la tendina di una finiva sull'altra («danni
 * subiti» apriva i Dei, misurato il 10/10).
 *
 * Ora una parola italiana si lega a una inglese dello stesso testo solo con una
 * prova, e conta per prima:
 *   - la stessa parola nelle due lingue (nomi propri, sigle: «PvP»)
 *   - la traduzione del gioco: in tutti gli altri testi con lo stesso numero di
 *     parole, quella parola inglese sta di fronte a questa italiana almeno due
 *     volte su testi diversi e in almeno un caso su tre (i ranghi della stessa
 *     carta, che differiscono solo nei numeri, contano una volta)
 *   - la nota: la parola inglese e' il nome di una nota («※Evasion:») e
 *     l'italiana e' il nome della nota italiana appaiata («※Evasione:»)
 *   - il bersaglio: il nome italiano del concetto, della razza o della
 *     caratteristica sta nella parola («alleati Umani» per gli Umani)
 * Una parola con piu' prove va a quella piu' vicina di posto. Solo dopo, a
 * parita' di numero, la posizione vale per le parole rimaste, e solo se
 * nessuna delle due ha una prova verso un'altra parola del testo. Il resto
 * resta blu e non si clicca: meglio una parola che non apre niente che una che
 * apre l'elenco di un'altra.
 */
const lower = (value: string) => normalize(value).toLowerCase();
const loose = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
/** Il nome italiano sta nella parola? Per intero, o una parola lunga che comincia uguale («Umani» e «Umano»). */
function sayed(word: string, name: string | null | undefined): boolean {
  if (!name) return false;
  const w = loose(word);
  const n = loose(name);
  if (!w || !n) return false;
  if (` ${w} `.includes(` ${n} `) || ` ${n} `.includes(` ${w} `)) return true;
  const stems = (s: string) => s.split(" ").filter((t) => t.length >= 5).map((t) => t.slice(0, 4));
  const ns = stems(n);
  return ns.length > 0 && ns.every((stem) => stems(w).includes(stem));
}

interface ItalianPair {
  enKey: string;
  it: string;
  enWords: string[];
  itWords: string[];
}
const italianPairs = new Map<string, ItalianPair>();
for (const text of pageTexts) {
  if (!text.it) continue;
  const enKey = textKey(text.en);
  const pairKey = `${enKey}:${textKey(text.it)}`;
  if (italianPairs.has(pairKey)) continue;
  italianPairs.set(pairKey, { enKey, it: text.it, enWords: termWords(text.en), itWords: termWords(text.it) });
}

// le traduzioni del gioco: parola inglese -> parole italiane di fronte, per voto
const translations = new Map<string, Map<string, number>>();
const counted = new Set<string>();
for (const pair of italianPairs.values()) {
  if (pair.enWords.length === 0 || pair.enWords.length !== pair.itWords.length) continue;
  const signature = `${pair.enWords.join("|")}\u0000${pair.itWords.join("|")}`.replace(/\d+/g, "#");
  if (counted.has(signature)) continue;
  counted.add(signature);
  pair.enWords.forEach((en, index) => bump(translations, lower(en), lower(pair.itWords[index]!)));
}
const translates = (en: string, it: string): boolean => {
  const votes = translations.get(lower(en));
  const count = votes?.get(lower(it)) ?? 0;
  if (count < 2) return false;
  const total = [...votes!.values()].reduce((sum, n) => sum + n, 0);
  return count * 3 >= total;
};

const raceIt = (code: number) => HERO_CONTEXT.codes.race[String(code)]?.it;
const factionIt = (code: number) => HERO_CONTEXT.codes.faction[String(code)]?.it;
/** La parola italiana dice il bersaglio di quella inglese? */
function namesTarget(word: string, target: string | null | undefined): boolean {
  if (!target) return false;
  return target.split("|").some((part) => {
    const value = part.slice(2);
    if (part.startsWith("c:")) {
      const src = source.concetti[value];
      return sayed(word, src?.etichetta.it) || sayed(word, mostCommon(itNoteName.get(src?.etichetta.en?.toLowerCase() ?? "")));
    }
    if (part.startsWith("r:")) return sayed(word, raceIt(Number(value)));
    if (part.startsWith("f:")) return sayed(word, factionIt(Number(value)));
    if (part.startsWith("g:")) return /applicabil/i.test(word);
    return false;
  });
}

// per ogni testo italiano, a quale parola inglese va ogni sua parola blu (-1: nessuna)
const italian = new Map<string, number[]>();
let italianWords = 0;
let italianByProof = 0;
let italianByPosition = 0;
let italianChanged = 0;
for (const [pairKey, pair] of italianPairs) {
  const targets = texts.get(pair.enKey);
  if (!targets) continue;
  withItalian++;
  const { enWords, itWords } = pair;
  italianWords += itWords.length;
  const proof = (i: number, j: number) => {
    const it = itWords[i]!;
    const en = enWords[j]!;
    if (lower(it) === lower(en)) return true;
    if (translates(en, it)) return true;
    const note = mostCommon(itNoteName.get(lower(en)));
    if (note && lower(note) === lower(it)) return true;
    return namesTarget(it, targets[j]);
  };
  const candidates = itWords.map((_, i) => enWords.map((_, j) => j).filter((j) => targets[j] && proof(i, j)));
  const proofTo = new Set(candidates.flat());
  const link = itWords.map(() => -1);
  const used = new Set<number>();
  // prima le parole con una prova sola, poi le altre, la piu' vicina di posto
  const order = itWords.map((_, i) => i).sort((a, b) => candidates[a]!.length - candidates[b]!.length || a - b);
  for (const i of order) {
    const free = candidates[i]!.filter((j) => !used.has(j));
    if (free.length === 0) continue;
    const here = itWords.length > 1 ? i / (itWords.length - 1) : 0;
    const there = (j: number) => (enWords.length > 1 ? j / (enWords.length - 1) : 0);
    const j = free.sort((a, b) => Math.abs(there(a) - here) - Math.abs(there(b) - here) || a - b)[0]!;
    link[i] = j;
    used.add(j);
    italianByProof++;
  }
  if (itWords.length === enWords.length) {
    itWords.forEach((_, i) => {
      if (link[i] !== -1 || used.has(i) || !targets[i]) return;
      if (candidates[i]!.length > 0 || proofTo.has(i)) return;
      link[i] = i;
      used.add(i);
      italianByPosition++;
    });
  }
  if (itWords.length === enWords.length && link.some((j, i) => targets[i] !== (j >= 0 ? targets[j] : null))) italianChanged++;
  if (link.some((j) => j >= 0)) {
    italianAligned++;
    italian.set(pairKey, link);
  }
  // la parola italiana di ogni concetto, per il suo nome se il glossario non ce l'ha
  link.forEach((j, i) => {
    const target = j >= 0 ? targets[j] : null;
    if (target && /^c:[^|]+$/.test(target)) bump(itWord, target.slice(2), normalize(itWords[i]!));
  });
  // Solo per il NOME, se nient'altro lo dice: la parola alla stessa distanza
  // dall'ultima coppia sicura prima di lei (anche fra parole che non si
  // cliccano: «different races» / «razze diverse»). Un concetto dedotto che sta
  // in un testo solo («each use a skill» / «usa un'abilità») non ha altre prove,
  // e in quel testo l'italiano ha una parola blu in piu' («o più»)
  const anchors: [number, number][] = [];
  itWords.forEach((it, i) => {
    if (link[i]! >= 0) return void anchors.push([i, link[i]!]);
    const j = enWords.findIndex((en) => lower(en) === lower(it) || translates(en, it));
    if (j >= 0) anchors.push([i, j]);
  });
  enWords.forEach((_, j) => {
    const target = targets[j];
    if (!target || !/^c:[^|]+$/.test(target) || link.includes(j)) return;
    const before = anchors.filter(([, aj]) => aj < j).sort((a, b) => b[1] - a[1])[0] ?? [-1, -1];
    const i = before[0] + (j - before[1]);
    if (i >= 0 && i < itWords.length && link[i] === -1) bump(itWordNear, target.slice(2), normalize(itWords[i]!));
  });
}

/* ------------------------------------------------ dove compare un concetto -- */

// concetto -> eroe e abilita' -> il rango piu' basso in cui c'e'
const firstRank = new Map<string, Map<string, number>>();
for (const text of pageTexts) {
  for (const target of texts.get(textKey(text.en)) ?? []) {
    if (!target) continue;
    for (const part of target.split("|")) {
      if (!part.startsWith("c:")) continue;
      const concept = part.slice(2);
      const byPlace = firstRank.get(concept) ?? new Map<string, number>();
      const where = `${text.place[0]}\u0000${text.place[1]}`;
      byPlace.set(where, Math.min(byPlace.get(where) ?? Infinity, text.place[2]));
      firstRank.set(concept, byPlace);
    }
  }
}
const places: Record<string, HeroTermPlace[]> = {};
for (const [concept, byPlace] of [...firstRank].sort((a, b) => a[0].localeCompare(b[0]))) {
  // l'ordine d'inserimento e' quello del roster: la Map lo conserva
  places[concept] = [...byPlace].map(([where, rank]) => {
    const [hid, slot] = where.split("\u0000") as [string, string];
    return [hid, slot, rank] as const;
  });
}

/* ------------------------------------------------------------- i concetti -- */

const cited = new Set(
  [...texts.values()].flatMap((targets) =>
    targets.flatMap((target) => (target ? target.split("|").filter((p) => p.startsWith("c:")).map((p) => p.slice(2)) : [])),
  ),
);
const concepts: Record<string, HeroTermConcept> = {};
let italianFromNotes = 0;
let italianFromWords = 0;
for (const key of [...cited].sort()) {
  const src = source.concetti[key];
  if (!src) fail(`il concetto "${key}" e' citato ma parole_blu.json non lo descrive`);
  const en = src.etichetta.en?.toLowerCase() ?? "";
  // L'italiano: quello del glossario del gioco; se manca, il nome della nota
  // italiana che definisce lo stesso termine («※Evasione:» per «※Evasion:»); se
  // manca anche quella, la parola italiana che il testo usa piu' spesso.
  let labelIt = src.etichetta.it;
  if (!labelIt) {
    labelIt = mostCommon(itNoteName.get(en));
    if (labelIt) italianFromNotes++;
  }
  if (!labelIt) {
    const word = mostCommon(itWord.get(key)) ?? mostCommon(itWordNear.get(key));
    labelIt = word ? word.charAt(0).toUpperCase() + word.slice(1) : null;
    if (labelIt) italianFromWords++;
  }
  const label: HeroLabel = { it: labelIt, en: src.etichetta.en };
  // Gli «applicabili» una definizione generale non ce l'hanno: e' la regola
  // della nota di ogni eroe, e sta nel suo gruppo. Dalle note ne usciva una a
  // caso («Umani, Fate e [...]»).
  const definition: HeroLabel = APPLICABLE.test(key)
    ? { it: null, en: null }
    : { it: src.definizione.it ?? mostCommon(itNoteDefinition.get(en)), en: src.definizione.en };
  concepts[key] = { label, definition, certainty: src.certezza };
}

/* ----------------------------------------------------------------- scrive -- */

const json = (value: unknown) => JSON.stringify(value);
const lines = [
  `/**`,
  ` * Le parole blu della scheda eroe di Grand Cross: cosa c'e' dietro ognuna, e`,
  ` * quali eroi hanno la stessa cosa.`,
  ` *`,
  ` * GENERATO DA scripts/import-hero-terms.mts - NON MODIFICARE A MANO.`,
  ` * Si rigenera con \`npm run parole:import\` (o \`npm run eroi:import\`).`,
  ` *`,
  ` * FONTE: eroi/parole_blu.json della pipeline (script/parole_blu.py, la logica`,
  ` * di contesto_eroi.py), legato ai testi che la pagina mostra. Il contratto sta`,
  ` * in hero-terms-types.ts.`,
  ` */`,
  ``,
  `import type { HeroTermConcept, HeroTermGroup, HeroTermPlace, HeroTermsIndex } from "../hero-terms-types";`,
  ``,
  `const CONCEPTS: Readonly<Record<string, HeroTermConcept>> = {`,
  ...Object.entries(concepts).map(([key, value]) => `  ${json(key)}: ${json(value)},`),
  `};`,
  ``,
  `const GROUPS: readonly HeroTermGroup[] = [`,
  ...groups.map((group) => `  ${json(group)},`),
  `];`,
  ``,
  `const TEXTS: Readonly<Record<string, readonly (string | null)[]>> = {`,
  ...[...texts]
    .filter(([, targets]) => targets.some((target) => target !== null))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, targets]) => `  ${json(key)}: ${json(targets)},`),
  `};`,
  ``,
  `const ITALIAN: Readonly<Record<string, readonly number[]>> = {`,
  ...[...italian].sort((a, b) => a[0].localeCompare(b[0])).map(([key, link]) => `  ${json(key)}: ${json(link)},`),
  `};`,
  ``,
  `const PLACES: Readonly<Record<string, readonly HeroTermPlace[]>> = {`,
  ...Object.entries(places).map(([key, value]) => `  ${json(key)}: ${json(value)},`),
  `};`,
  ``,
  `export const HERO_TERMS: HeroTermsIndex = { concepts: CONCEPTS, groups: GROUPS, texts: TEXTS, italian: ITALIAN, places: PLACES };`,
  ``,
];
writeFileSync(DEST, lines.join("\n"), "utf8");

const pct = (a: number, b: number) => (b ? `${((100 * a) / b).toFixed(1)}%` : "-");
console.log(`  parole blu della scheda eroe`);
console.log(`    testi della pagina         ${pageTexts.length} (${texts.size} diversi); senza voce nella pipeline ${missingText}`);
console.log(`    parole blu                 ${words}: accostate ${wordsMatched} (${pct(wordsMatched, words)}), cliccabili ${wordsTargeted}`);
console.log(`    italiano                   ${italianAligned} testi su ${withItalian} con parole legate; parole ${italianWords}: con una prova ${italianByProof}, per posizione ${italianByPosition}, senza legame ${italianWords - italianByProof - italianByPosition}`);
console.log(`                               testi in cui il legame per posizione di prima sbagliava almeno una parola: ${italianChanged}`);
console.log(`    concetti                   ${Object.keys(concepts).length}; nome italiano dalle note ${italianFromNotes}, dalle parole ${italianFromWords}; senza ${Object.values(concepts).filter((c) => !c.label.it).length}`);
console.log(`    gruppi «applicabili»       ${groups.length}; parole «applicabili» senza nota nel loro testo ${applicableWithoutNote}, prese dagli altri testi dell'eroe ${applicableFromHero}`);
if (unmatched.size > 0) {
  console.log(`    parole non accostate, le piu' frequenti:`);
  for (const [word, count] of [...unmatched].sort((a, b) => b[1] - a[1]).slice(0, 12)) {
    console.log(`      ${String(count).padStart(4)}  ${word.slice(0, 90)}`);
  }
}
console.log(`  -> ${DEST}`);
