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

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
// La stessa somma dello slider della scheda: il controllo dei pezzi si fa con
// la funzione che poi li usera', non con una copia.
import { maxSelection, statsAt } from "../src/lib/games/hero-stats";
import type { HeroStatSteps } from "../src/lib/games/types";

/** Cartella della pipeline di estrazione. Fuori dal repo: e' materiale di lavoro. */
const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";

const GAME = "grand-cross";
const ROOT = process.cwd();
const DEST_IMAGES = resolve(ROOT, "public/eroi", GAME);
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "heroes.generated.ts");
const DEST_TEXTS = resolve(ROOT, "src/lib/games", GAME, "hero-texts.generated.ts");
const DEST_ASSETS = resolve(ROOT, "src/lib/games", GAME, "hero-assets.generated.ts");
const DEST_ABILITIES = resolve(ROOT, "src/lib/games", GAME, "hero-abilities.generated.ts");
const DEST_STATS = resolve(ROOT, "src/lib/games", GAME, "hero-stats.generated.ts");
const DEST_CONTEXT = resolve(ROOT, "src/lib/games", GAME, "hero-context.generated.ts");
const DEST_SPECIALS = resolve(ROOT, "src/lib/games", GAME, "hero-specials.generated.ts");
const DEST_RELICS = resolve(ROOT, "src/lib/games", GAME, "hero-relics.generated.ts");
const DEST_ICONS = resolve(ROOT, "src/lib/games", GAME, "game-icons.generated.ts");

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

/* ---------------------------------------------------- testi in italiano -- */

/**
 * Le schede degli eroi in italiano, dal client del gioco.
 *
 * Le scrive la pipeline (`python scheda_client.py`, dentro _7dsgc) in
 * eroi/client/abilita_it.json, per heroId, con la stessa forma di quelle
 * inglesi: le tabelle del gioco dicono quali abilita' ha l'eroe, e i testi sono
 * i modelli del client riempiti coi numeri delle tabelle, come fa il gioco
 * (modelli_client.py). Stessi id di abilita', stessi valori per rango, stesso
 * markup: il testo italiano di un rango si accosta a quello inglese PER ID,
 * senza indovinare niente. Passiva e Talenti non hanno un id per livello e si
 * accostano per POSIZIONE, ma solo dove la sequenza coincide livello per
 * livello col suo `specialLevel`.
 *
 * Fino al 24/09 questi testi venivano da 7dshub (le schede del sito, in
 * italiano). La forma e' rimasta la stessa: per questo qui cambia solo il file.
 *
 * Due difetti dei testi si correggono qui e non in pagina:
 *
 *   U+FEFF    un carattere invisibile rimasto in 37 stringhe, dentro
 *             "l'evocazione" o subito dopo le virgolette di un nome di carta.
 *             Non si vede, ma spezza una ricerca e un confronto: si toglie.
 *   NONE_DB   al posto del testo in tre ranghi di un eroe (2008501). Vale come
 *             testo mancante, e quei ranghi restano in inglese.
 *
 * Se il file manca, il sito resta com'era: nessun campo italiano, e la scheda
 * in italiano mostra i testi inglesi dichiarandolo.
 */
interface SourceHubSkill {
  id: number;
  name?: string;
  explain?: string;
}

interface SourceHubIndex {
  explain?: string;
  specialLevel?: number | null;
}

interface SourceHubHero {
  skin?: { name?: string; nickname?: string; description?: string };
  passive?: { name?: string; indexes?: SourceHubIndex[] };
  skillsA?: SourceHubSkill[];
  skillsB?: SourceHubSkill[];
  skillsSpecial?: SourceHubSkill[];
  skillsCoop?: SourceHubSkill[];
  // Comandamento, Grazia e Unita' hanno un testo solo; il Talento ("ability")
  // puo' cambiare col rango dell'ultimate, e allora ha i livelli come la passiva.
  taboo?: SourceHubSkill;
  grace?: SourceHubSkill;
  solidarity?: SourceHubSkill;
  ability?: { id: number; name?: string; indexes?: SourceHubIndex[] };
}

/** Un testo a livelli - passiva o abilita' speciale - col livello che ne verifica la posizione. */
interface ItalianLevel {
  text?: string;
  specialLevel: number | null;
}

interface ItalianHero {
  name?: string;
  nickname?: string;
  description?: string;
  /** id dell'abilita' (= id del rango in database_eroi.json) -> nome e testo */
  skills: Map<number, { name?: string; explain?: string }>;
  passiveName?: string;
  passiveLevels: ItalianLevel[];
}

const italianJson = resolve(SOURCE, "eroi/client/abilita_it.json");
const italianHeroes = new Map<string, ItalianHero>();
/** id dell'abilita' speciale -> nome e testi, nell'ordine dei livelli */
const italianSpecials = new Map<string, { name?: string; levels: ItalianLevel[] }>();

/** Una stringa italiana usabile: senza U+FEFF, e nulla se e' vuota o un segnaposto. */
function italian(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const out = value.replace(/﻿/g, "");
  if (out.trim() === "" || out.trim() === "NONE_DB") return undefined;
  return out;
}

/**
 * Due sequenze di livelli sono la stessa se hanno la stessa lunghezza e lo
 * stesso `specialLevel` in ogni posizione. E' la condizione per accostarle per
 * posizione: senza, un testo italiano finirebbe sotto il rango sbagliato.
 */
function sameLevels(
  source: readonly { livello_speciale?: number | null }[],
  italianLevels: readonly ItalianLevel[] | undefined,
): boolean {
  return (
    italianLevels !== undefined &&
    italianLevels.length === source.length &&
    italianLevels.every((level, index) => level.specialLevel === (source[index]?.livello_speciale ?? null))
  );
}

if (!existsSync(italianJson)) {
  console.log(`  client/abilita_it.json non trovato: niente testi in italiano, restano quelli inglesi.`);
  console.log(`  (lo scrive la pipeline: python scheda_client.py, dentro _7dsgc)`);
} else {
  const hub = JSON.parse(readFileSync(italianJson, "utf8")) as Record<string, SourceHubHero>;
  const levelsOf = (indexes: readonly SourceHubIndex[] | undefined): ItalianLevel[] =>
    (indexes ?? []).map((index) => ({ text: italian(index.explain), specialLevel: index.specialLevel ?? null }));

  for (const [hid, voce] of Object.entries(hub)) {
    const skills = new Map<number, { name?: string; explain?: string }>();
    for (const list of [voce.skillsA, voce.skillsB, voce.skillsSpecial, voce.skillsCoop]) {
      for (const skill of list ?? []) {
        skills.set(skill.id, { name: italian(skill.name), explain: italian(skill.explain) });
      }
    }
    italianHeroes.set(hid, {
      name: italian(voce.skin?.name),
      nickname: italian(voce.skin?.nickname),
      description: italian(voce.skin?.description),
      skills,
      passiveName: italian(voce.passive?.name),
      passiveLevels: levelsOf(voce.passive?.indexes),
    });

    for (const special of [voce.taboo, voce.grace, voce.solidarity]) {
      if (!special) continue;
      italianSpecials.set(String(special.id), {
        name: italian(special.name),
        levels: [{ text: italian(special.explain), specialLevel: null }],
      });
    }
    if (voce.ability) {
      italianSpecials.set(String(voce.ability.id), {
        name: italian(voce.ability.name),
        levels: levelsOf(voce.ability.indexes),
      });
    }
  }
  console.log(
    `  testi in italiano da client/abilita_it.json: ${italianHeroes.size} eroi, ` +
      `${italianSpecials.size} abilita' speciali`,
  );
}

/* -------------------------------------------------------------- uscite -- */

/**
 * Il calendario delle uscite.
 *
 * Lo scrive `python script\date_uscita.py` (dentro _7dsgc) in
 * eroi/calendario_uscite.json, dal foglio della community di thefilght /
 * dreamer_plays. Il foglio ha DUE calendari, e fino al 26/09 se ne leggeva uno:
 *
 *   giappone   la scheda [UPDATE SCHEDULE], Giappone e Corea, dal 4/6/2019
 *   globale    la scheda GLOBAL SCHEDULE (nascosta, ferma dal novembre 2024)
 *              fino all'allineamento del 22/11/2024; poi le righe giapponesi,
 *              lo stesso giorno, tranne i rari aggiornamenti usciti nel globale
 *              il mercoledi' prima (date_uscita.ANTICIPI_GLOBALI: Odino, i due
 *              "Another")
 *
 * Leggendo solo il giapponese, prima dell'allineamento date e ordine erano
 * quelli del Giappone, e il globale aveva le sue: il lancio il 2/3/2020 con 60
 * eroi, e poi gli eroi in un altro ordine, di martedi'. Ogni eroe e' legato al
 * suo heroId dalla pipeline, dove il legame e' certo. Il client PC non ha date
 * d'uscita, quindi il foglio e' l'unica fonte, e viaggia col dato fino in pagina.
 *
 * Serve a due cose: la sezione Uscite, e l'ORDINE della griglia degli eroi, che
 * si scrive qui una volta invece di ricalcolarlo nel browser. E' l'ordine del
 * GLOBALE, il server di chi legge in italiano: dal piu' recente, e a parita' di
 * data nell'ordine del foglio (prima l'eroe del banner, poi gli omaggi). La data
 * di un eroe e' quella della sua riga nel calendario, e per gli eroi del lancio
 * quella della riga del lancio; solo chi non ha nessuna riga (un Jericho SR, nel
 * calendario giapponese) prende quella di uscite_jpkr.json.
 *
 * Se il file manca, il roster resta nell'ordine di eroi.json e la sezione
 * Uscite non compare.
 */
interface SourceReleaseHero {
  colori: string[];
  nome: string;
  rarita: string;
  modo: string;
  heroId?: string;
}

interface SourceReleaseUpdate {
  numero: string | null;
  data: string;
  data_giappone?: string;
  da_giappone?: boolean;
  eroi: SourceReleaseHero[];
  senza_eroi?: "eroi" | "banner";
  lancio?: boolean;
  eroi_lancio?: string[];
  dettaglio?: string;
  nota?: string;
  ritorni?: string;
  armi_ur?: string;
  reliquie?: string;
  evoluzioni_lr?: { colori: string[]; nome: string; heroId?: string }[];
  eventi?: string[];
  guerra_cavalieri?: string;
  boss_cavalieri?: string;
  arena?: string;
  stamina_dimezzata?: boolean;
}

interface SourceCalendar {
  fonte: {
    titolo: string;
    titolo_globale?: string;
    autori: string;
    indirizzo: string;
    scaricato: string;
  };
  allineamento?: string;
  giappone: SourceReleaseUpdate[];
  globale?: SourceReleaseUpdate[];
  eroi: Record<string, { gb?: string; jpkr?: string; festival?: boolean; gbLr?: string; jpkrLr?: string }>;
}

/**
 * I modi di ottenimento del foglio in italiano, pezzo per pezzo ("Freebie / Pick
 * Up Draw" sono due pezzi). Il Pick Up e' "Pescata", come chiede l'utente
 * (26/09): il client italiano dice "Raccolta" (Biglietto Raccolta), ma chi gioca
 * dice pescata, e la pescata e' gia' la parola del gioco per il gacha (Biglietto
 * pescata speciale). Lo Step Up e' "Passo avanti", il Coin Shop "Negozio monete",
 * come nel client. "600" resta com'e': il foglio non dice cosa conta, e tradurlo
 * vorrebbe dire inventarlo.
 *
 * Un pezzo che qui non c'e' lascia l'italiano a null, e la pagina mostra
 * l'inglese del foglio: l'importazione lo dice, e un test si ferma.
 */
const METHOD_IT: Readonly<Record<string, string>> = {
  "pick up draw": "Pescata",
  "pick up draw (limited)": "Pescata limitata",
  "600 pick up draw": "Pescata 600",
  "collab banner": "Pescata della collaborazione",
  "festival banner draw": "Festival",
  "festival banner draw (seasonal)": "Festival stagionale",
  "step-up summon": "Passo avanti",
  "free step-up summon": "Passo avanti gratuito",
  "coin shop": "Negozio monete",
  "hawk pass": "Hawk Pass",
  freebie: "Omaggio",
  "freebie (summon)": "Omaggio (evocazione)",
  "freebie (mission)": "Omaggio (missione)",
  "freebie (celebration reward)": "Omaggio (premio dei festeggiamenti)",
  "check-in freebie": "Omaggio per l'accesso",
  "log-in freebie": "Omaggio per l'accesso",
  "event freebie": "Omaggio dell'evento",
  regular: "normale",
  mission: "Missione",
  "pvp top 100 reward": "Premio dei primi 100 in PvP",
};

const untranslatedMethods = new Set<string>();

function methodLabel(method: string): { it: string | null; en: string } {
  const parts = method.split(/\s*\/\s*/).map((part) => part.trim());
  const it = parts.map((part) => METHOD_IT[part.toLowerCase()] ?? null);
  parts.forEach((part, index) => {
    if (it[index] === null) untranslatedMethods.add(part);
  });
  return { it: it.every((part) => part !== null) ? it.join(" / ") : null, en: method };
}

const DEST_RELEASES = resolve(ROOT, "src/lib/games", GAME, "releases.generated.ts");
const calendarJson = resolve(SOURCE, "eroi/calendario_uscite.json");
const calendarSource = existsSync(calendarJson)
  ? (JSON.parse(readFileSync(calendarJson, "utf8")) as SourceCalendar)
  : null;

/** heroId -> posizione nella griglia: 0 e' il piu' recente. */
const releaseRank = new Map<string, number>();

/** Dove sta ogni eroe in un calendario: la data della riga e la posizione. */
interface Placement {
  date: string;
  position: number;
}

if (!calendarSource) {
  console.log(`  calendario_uscite.json non trovato: roster nell'ordine di eroi.json, niente Uscite.`);
  console.log(`  (si genera con: python script\\date_uscita.py, dentro _7dsgc)`);
} else {
  const known = new Set(heroes.map((hero) => String(hero.heroId)));
  const day = (value: string | undefined) => value?.slice(0, 10);

  /**
   * Controlla un calendario e dice dove sta ogni eroe.
   *
   * L'aggiornamento si apre dalla scheda con un'ancora sulla sua data: due
   * aggiornamenti nello stesso giorno porterebbero allo stesso punto. Ogni eroe
   * al massimo una volta, e solo eroi che il roster conosce: un id sbagliato qui
   * diventerebbe un collegamento a una pagina che non esiste. Gli eroi del
   * lancio stanno tutti nella posizione della riga del lancio: fra loro decide
   * l'ordine giapponese.
   */
  const place = (name: string, updates: SourceReleaseUpdate[]) => {
    const dates = new Set<string>();
    const heroAt = new Map<string, Placement>();
    const lrAt = new Map<string, string>();
    let position = 0;
    for (const update of updates) {
      if (dates.has(update.data)) fail(`due aggiornamenti il ${update.data} nel calendario ${name}`);
      dates.add(update.data);
      const add = (id: string, at: number) => {
        if (!known.has(id)) fail(`il calendario ${name} cita ${id}, che non e' in eroi.json`);
        if (heroAt.has(id)) fail(`${id} compare due volte nel calendario ${name}`);
        heroAt.set(id, { date: update.data, position: at });
      };
      const start = position;
      position += update.eroi.length;
      update.eroi.forEach((hero, index) => {
        if (hero.heroId) add(hero.heroId, start + index);
      });
      for (const id of update.eroi_lancio ?? []) add(id, position);
      for (const lr of update.evoluzioni_lr ?? []) {
        if (!lr.heroId) continue;
        if (!known.has(lr.heroId)) fail(`il calendario ${name} cita ${lr.heroId}, che non e' in eroi.json`);
        lrAt.set(lr.heroId, update.data);
      }
    }
    return { heroAt, lrAt };
  };

  const jp = place("giappone", calendarSource.giappone);
  const gl = calendarSource.globale ? place("globale", calendarSource.globale) : null;

  const releaseHeroes: Record<string, Record<string, string | boolean>> = {};
  for (const id of [...known].sort()) {
    const dated = calendarSource.eroi[id];
    const entry: Record<string, string | boolean> = {};
    const jpDate = jp.heroAt.get(id)?.date ?? day(dated?.jpkr);
    const globalDate = gl?.heroAt.get(id)?.date ?? day(dated?.gb);
    if (jpDate) entry.jp = jpDate;
    if (globalDate) entry.global = globalDate;
    if (dated?.festival) entry.festival = true;
    const lrJp = jp.lrAt.get(id) ?? day(dated?.jpkrLr);
    const lrGlobal = gl?.lrAt.get(id) ?? day(dated?.gbLr);
    if (lrJp) entry.lrJp = lrJp;
    if (lrGlobal) entry.lrGlobal = lrGlobal;
    const inGlobal = gl?.heroAt.get(id);
    const inJp = jp.heroAt.get(id);
    if (inGlobal) entry.updateGlobal = inGlobal.date;
    if (inJp) entry.updateJp = inJp.date;
    releaseHeroes[id] = entry;
  }

  // L'ordine della griglia: il calendario globale se c'e', se no il giapponese.
  // Dal piu' recente; a parita' di data la posizione nel foglio; poi la data
  // giapponese (i 60 del lancio globale sono usciti in Giappone in otto mesi);
  // poi per id.
  const main = gl ?? jp;
  const mainDate = (id: string) => String((gl ? releaseHeroes[id]?.global : releaseHeroes[id]?.jp) ?? "");
  const ordered = [...known].sort((a, b) => {
    const da = mainDate(a);
    const db = mainDate(b);
    if (da !== db) return da < db ? 1 : -1;
    const pa = main.heroAt.get(a)?.position ?? Infinity;
    const pb = main.heroAt.get(b)?.position ?? Infinity;
    if (pa !== pb) return pa - pb;
    const ja = String(releaseHeroes[a]?.jp ?? "");
    const jb = String(releaseHeroes[b]?.jp ?? "");
    if (ja !== jb) return ja < jb ? 1 : -1;
    return a.localeCompare(b);
  });
  ordered.forEach((id, index) => releaseRank.set(id, index));

  const updateRow = (update: SourceReleaseUpdate) => {
    const out: Record<string, unknown> = {};
    if (update.numero) out.number = update.numero;
    out.date = update.data;
    if (update.da_giappone) out.fromJp = true;
    if (update.data_giappone) out.jpDate = update.data_giappone;
    out.heroes = update.eroi.map((hero) => ({
      name: hero.nome,
      colors: hero.colori,
      rarity: hero.rarita,
      method: methodLabel(hero.modo),
      ...(/festival/i.test(hero.modo) ? { festival: true } : {}),
      ...(hero.heroId ? { heroId: hero.heroId } : {}),
    }));
    if (update.senza_eroi) out.noHeroes = update.senza_eroi === "eroi" ? "heroes" : "banner";
    if (update.lancio) out.launch = true;
    if (update.eroi_lancio?.length) out.launchHeroes = update.eroi_lancio;
    if (update.dettaglio) out.detail = update.dettaglio;
    if (update.nota) out.note = update.nota;
    if (update.ritorni) out.reruns = update.ritorni;
    if (update.armi_ur) out.urGear = update.armi_ur;
    if (update.reliquie) out.holyRelics = update.reliquie;
    if (update.evoluzioni_lr?.length) {
      out.lrEvolutions = update.evoluzioni_lr.map((lr) => ({
        name: lr.nome,
        colors: lr.colori,
        ...(lr.heroId ? { heroId: lr.heroId } : {}),
      }));
    }
    if (update.eventi?.length) out.events = update.eventi;
    if (update.guerra_cavalieri) out.knighthoodWar = update.guerra_cavalieri;
    if (update.boss_cavalieri) out.knighthoodBoss = update.boss_cavalieri;
    if (update.arena) out.arena = update.arena;
    if (update.stamina_dimezzata) out.halfStamina = true;
    return `      ${JSON.stringify(out)},`;
  };

  const { fonte } = calendarSource;
  const source = {
    title: fonte.titolo,
    authors: fonte.autori,
    url: fonte.indirizzo,
    downloaded: fonte.scaricato,
    ...(fonte.titolo_globale ? { globalTitle: fonte.titolo_globale } : {}),
  };
  const schedules = [
    ...(calendarSource.globale ? [`    global: [\n${calendarSource.globale.map(updateRow).join("\n")}\n    ],`] : []),
    `    jp: [\n${calendarSource.giappone.map(updateRow).join("\n")}\n    ],`,
  ];
  writeFileSync(
    DEST_RELEASES,
    `/**
 * Il calendario delle uscite di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il foglio della community di ${fonte.autori}, copia del
 * ${fonte.scaricato}, letto da date_uscita.py (calendario_uscite.json). Due calendari:
 *   jp      la scheda [UPDATE SCHEDULE], Giappone e Corea
 *   global  la scheda GLOBAL SCHEDULE fino all'allineamento (${calendarSource.allineamento ?? "-"}), poi le righe
 *           giapponesi (\`fromJp\`), lo stesso giorno; le poche uscite nel globale il
 *           mercoledi' prima hanno la data globale, e \`jpDate\` tiene quella giapponese
 * Gli eroi sono legati al roster dalla pipeline: colore, rarita', personaggio e
 * data; dove il legame non e' certo \`heroId\` manca. I testi liberi sono quelli
 * del foglio, in inglese.
 *
 * \`heroes\` porta le date di OGNI eroe: quella della sua riga, per gli eroi del
 * lancio quella del lancio, e per chi non ha una riga quella di uscite_jpkr.json.
 */

import type { ReleaseCalendar } from "../types";

export const RELEASES: ReleaseCalendar = {
  source: ${JSON.stringify(source)},
${calendarSource.allineamento ? `  sync: ${JSON.stringify(calendarSource.allineamento)},\n` : ""}  schedules: {
${schedules.join("\n")}
  },
  heroes: ${JSON.stringify(releaseHeroes)},
};
`,
    "utf8",
  );

  const count = (updates: SourceReleaseUpdate[]) => {
    const listed = updates.reduce((sum, update) => sum + update.eroi.length, 0);
    const linked = updates.reduce((sum, update) => sum + update.eroi.filter((hero) => hero.heroId).length, 0);
    return `${updates.length} aggiornamenti, ${linked}/${listed} eroi legati al roster`;
  };
  console.log(
    `  calendario delle uscite (copia del foglio del ${fonte.scaricato}): ` +
      `globale ${calendarSource.globale ? count(calendarSource.globale) : "assente"}; ` +
      `giapponese ${count(calendarSource.giappone)}`,
  );
  if (untranslatedMethods.size > 0) {
    console.log(
      `  modi di ottenimento senza italiano (restano in inglese; vanno in METHOD_IT): ` +
        [...untranslatedMethods].join(", "),
    );
  }
}

/* ---------------------------------------------------------------- dati -- */

/**
 * Toglie la decorazione dagli epiteti.
 *
 * Nel gioco sono scritti in tre modi diversi: fra parentesi quadre, fra
 * virgolette, o con del BBCode rimasto dentro - "[b]The Fox Sin of Greed[/b]".
 * E' decorazione della fonte, non parte del nome, e va via qui: l'interfaccia
 * deve poter presentare il dato senza ripulirlo ogni volta.
 */
/**
 * Toglie i tag di formattazione del gioco: [b], [i], [u] e le chiusure.
 *
 * Solo quelli a una lettera. Un'espressione piu' larga mangerebbe "[Sunshine]",
 * che e' l'epiteto e non un tag. Serve anche ai NOMI: i Comandamenti e gli
 * Arcangeli si chiamano "Derieri of [b]Purity[/b]" nel client (26 eroi, nelle
 * due lingue), e fino al 26/09 il grassetto finiva stampato nel titolo della
 * scheda, nelle briciole e nella griglia.
 */
function untag(text: string): string {
  return text.replace(/\[\/?[biu]\]/gi, "").trim();
}

function clean(text: string): string {
  let out = untag(text);

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

/**
 * I testi del client, letti qui e non nella loro sezione: il nome e l'epiteto
 * italiani del roster vengono da li'. La forma e la provenienza del file sono
 * spiegate sotto, in "testi".
 */
interface SourceText {
  nome?: Record<string, string>;
  titolo?: Record<string, string>;
  epiteto?: Record<string, string>;
  descrizione?: Record<string, string>;
}

const textsJson = resolve(SOURCE, "eroi/testi_eroi.json");
const textsSource = existsSync(textsJson)
  ? (JSON.parse(readFileSync(textsJson, "utf8")) as Record<string, SourceText>)
  : null;

/**
 * Nome ed epiteto in italiano, accanto a quelli inglesi di eroi.json.
 *
 * Prima i testi dell'eroe (testi_eroi.json), poi la scheda italiana: vengono
 * tutti e due dal client e dicono la stessa cosa, ma i testi dell'eroe sono la
 * fonte di tutti gli altri testi della scheda, e un nome che cambia fonte da
 * una colonna all'altra sarebbe una differenza da spiegare. L'epiteto passa da `clean` come quello inglese: "\"Furto\"" arriva
 * decorato come "\"Snatch\"".
 */
let italianNames = 0;
// L'ordine d'uscita calcolato sopra, dal calendario. Senza calendario resta
// quello di eroi.json, che e' per heroId.
const rank = (hero: SourceHero) => releaseRank.get(String(hero.heroId)) ?? Infinity;
const rows = [...heroes]
  .sort((a, b) => rank(a) - rank(b) || a.heroId - b.heroId)
  .map((hero) => {
    const hid = String(hero.heroId);
    const nameIt = italian(textsSource?.[hid]?.nome?.it) ?? italianHeroes.get(hid)?.name;
    const epithetIt = italian(textsSource?.[hid]?.epiteto?.it) ?? italianHeroes.get(hid)?.nickname;
    const cells = [
      hid,
      hero.gruppo,
      untag(hero.nome),
      clean(hero.nickname),
      hero.rarita,
      hero.ottenibile_come,
      hero.attributo,
    ];
    // Le due colonne italiane si scrivono solo se ce n'e' almeno una: senza la
    // fonte italiana le righe restano di sette, com'erano.
    if (nameIt || epithetIt) {
      cells.push(nameIt ? untag(nameIt) : "", epithetIt ? clean(epithetIt) : "");
      if (nameIt && epithetIt) italianNames++;
    }
    return cells.map((cell) => JSON.stringify(cell));
  })
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
${
  calendarSource
    ? ` * L'ordine e' quello d'uscita nel GLOBALE, dal piu' recente: la data del
 * calendario delle uscite e, nello stesso giorno, l'ordine del foglio. E' il
 * default della griglia.`
    : ` * L'ordine e' quello di eroi.json, per heroId: senza il calendario delle uscite
 * non c'e' una data con cui ordinare.`
}
 *
 * Nome ed epiteto stanno in due lingue: le prime colonne sono l'inglese di
 * eroi.json, le ultime due l'italiano del client. La pagina sceglie quale
 * mostrare, e la ricerca le legge tutte e due.
 */

import type { HeroEntry } from "../types";

/** id, gruppo, nome, epiteto, rarita', ottenibile come, attributo, nome e epiteto in italiano */
type Row = readonly [string, string, string, string, string, string, string, string?, string?];

const ROWS: readonly Row[] = [
${rows}
];

export const HEROES: readonly HeroEntry[] = ROWS.map(
  ([id, group, name, epithet, rarity, obtainedAs, affinity, nameIt, epithetIt]) => ({
    id,
    group,
    name,
    epithet,
    rarity,
    obtainedAs,
    affinity,
    ...(nameIt ? { nameIt } : {}),
    ...(epithetIt ? { epithetIt } : {}),
  }),
);
`;

writeFileSync(DEST_DATA, generated, "utf8");
console.log(
  `  dataset scritto in src/lib/games/${GAME}/heroes.generated.ts ` +
    `(${italianNames}/${heroes.length} eroi con nome ed epiteto in italiano)`,
);

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
 *
 * Il file si legge piu' su, prima del roster (`textsSource`), perche' anche il
 * nome e l'epiteto italiani della griglia vengono da qui.
 */
if (!textsSource) {
  console.log(`  testi_eroi.json non trovato: salto i testi.`);
  console.log(`  (si genera con: python estrai_testi.py, dentro _7dsgc)`);
} else {
  const source = textsSource;

  // Italiano quando c'e', inglese quando il gioco non ha tradotto. Il ripiego
  // e' silenzioso di proposito: sono due voci su 313, e segnalarle in pagina
  // costerebbe piu' attenzione di quanta ne valgano.
  //
  // Questi quattro campi restano come sono, per chi li legge gia'. Accanto,
  // in `i18n`, le due lingue separate: la pagina in inglese non deve ricevere
  // l'italiano, e quella in italiano non deve ricevere l'inglese dove
  // l'italiano esiste da un'altra parte.
  const pick = (field?: Record<string, string>) => field?.it ?? field?.en;

  const entries: string[] = [];
  let withText = 0;
  let fallbacks = 0;
  let italianFromHub = 0;
  let epithetsFromRoster = 0;

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const text = source[hid];
    if (!text) continue;

    const fields: [string, string | undefined][] = [
      ["name", pick(text.nome)],
      ["title", pick(text.titolo)],
      ["epithet", pick(text.epiteto)],
      ["description", pick(text.descrizione)],
      // `evocazione` e `caricamento` restano in testi_eroi.json ma non vengono
      // piu' qui: alimentavano la sezione "In combattimento", tolta il 15/09.
    ];
    const written = fields.filter(([, value]) => value !== undefined);
    if (written.length === 0) continue;

    if (text.descrizione && !text.descrizione.it && text.descrizione.en) fallbacks++;
    withText++;

    // L'italiano: i testi dell'eroe, e dove mancano la scheda italiana. Fino al
    // 24/09 serviva per due descrizioni (1705001 e 1675001) che la decifratura a
    // punteggio perdeva; con quella esatta (testi_client.py) non serve piu', ma
    // il ripiego costa niente. Il titolo la scheda non lo porta.
    const hub = italianHeroes.get(hid);
    const withFallback = (client: string | undefined, fromHub: string | undefined) => {
      const value = italian(client);
      if (value) return value;
      if (fromHub) italianFromHub++;
      return fromHub ?? null;
    };

    // L'epiteto inglese era l'unico testo rovinato dalla decifratura a
    // punteggio: per 1065002 diceva "5biNasc&" dove il gioco scrive "Snatch".
    // Con la decifratura esatta (25/09) non succede piu'; il riscontro con
    // l'epiteto del roster resta, e dice 0 se tutto e' a posto.
    const clientEpithetEn = text.epiteto?.en;
    const epithetEn =
      clientEpithetEn === undefined || clean(clientEpithetEn) === clean(hero.nickname)
        ? (clientEpithetEn ?? hero.nickname)
        : hero.nickname;
    if (clientEpithetEn !== undefined && epithetEn !== clientEpithetEn) epithetsFromRoster++;

    const i18n = {
      name: { it: withFallback(text.nome?.it, hub?.name), en: text.nome?.en ?? null },
      title: { it: italian(text.titolo?.it) ?? null, en: text.titolo?.en ?? null },
      epithet: { it: withFallback(text.epiteto?.it, hub?.nickname), en: epithetEn },
      description: {
        it: withFallback(text.descrizione?.it, hub?.description),
        en: text.descrizione?.en ?? null,
      },
    };

    const body = written.map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`).join("\n");
    entries.push(`  ${JSON.stringify(hid)}: {
${body}
    i18n: ${JSON.stringify(i18n)},
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
  console.log(
    `  testi dell'eroe nelle due lingue: ${italianFromHub} italiani presi dalla scheda dove i testi non li hanno, ` +
      `${epithetsFromRoster} epiteti inglesi ripresi dal roster perche' il client li ha rovinati`,
  );
}

/* ------------------------------------------------------- carte agli eroi -- */

/**
 * Quale illustrazione ha ogni carta: A, B e ultimate.
 *
 * La scrive `python accosta_carte.py` nella pipeline, in
 * eroi/accostamenti_carte.json, e dal 26/09 la prende dal client: la skin
 * dell'eroe da' gli id delle carte (DB_skin_skill), e ogni carta dichiara il
 * suo sprite (DB_skill_card_resource.icon). 1.125 carte su 1.125.
 *
 * Fino al 26/09 il legame stava nelle tabelle cifrate e si ricavava da wiki,
 * regole e scelte a mano, con la fonte in pagina accanto a ogni carta: contro
 * il client 25 carte erano sbagliate. Ora e' un dato del gioco come il testo
 * della carta, e la fonte non si porta piu'.
 */
interface SourceChoice {
  file: string;
}

interface CardSprite {
  n: number;
}

const choicesJson = resolve(SOURCE, "eroi/accostamenti_carte.json");
/** eroe -> slot "A"/"B" -> numero del file in carte/<id>/ */
const cardSprites = new Map<string, Map<string, CardSprite>>();
/** eroe -> la carta dell'ultimate: si copia con gli altri asset */
const ultimateChoice = new Map<string, SourceChoice>();

if (!existsSync(choicesJson)) {
  console.log(`  accostamenti_carte.json non trovato: le carte restano senza illustrazione.`);
  console.log(`  (si genera con: python accosta_carte.py, dentro _7dsgc)`);
} else {
  const choices = JSON.parse(readFileSync(choicesJson, "utf8")) as Record<
    string,
    Partial<Record<"A" | "B" | "ultimate", SourceChoice>>
  >;
  const estratti = resolve(SOURCE, "7dsgc_estratti");
  let copied = 0;

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const voce = choices[hid];
    if (!voce) continue;
    if (voce.ultimate) ultimateChoice.set(hid, voce.ultimate);

    // La cartella si svuota prima di copiare. Prima si copiava "se piu' nuovo"
    // e non si puliva mai: i file estratti hanno date vecchie, quindi un `1.png`
    // lasciato da un accostamento precedente restava li', con l'arte di
    // un'altra carta.
    const dir = resolve(DEST_IMAGES, "carte", hid);
    rmSync(dir, { recursive: true, force: true });

    const perSlot = new Map<string, CardSprite>();
    for (const slot of ["A", "B"] as const) {
      const choice = voce[slot];
      if (!choice) continue;
      const from = resolve(estratti, choice.file);
      if (!existsSync(from)) continue;
      mkdirSync(dir, { recursive: true });
      const n = perSlot.size + 1;
      copyFileSync(from, resolve(dir, `${n}.png`));
      copied++;
      perSlot.set(slot, { n });
    }
    if (perSlot.size > 0) cardSprites.set(hid, perSlot);
  }

  console.log(`  carte d'attacco: ${copied} copiate, per ${cardSprites.size} eroi`);
}

/* ---------------------------------------------- abilita' e statistiche -- */

/**
 * Carte, ultimate, passiva e statistiche dal database della pipeline.
 *
 * Lo produce `python costruisci_database.py`, dalla scheda di ogni eroe che
 * `scheda_client.py` ricava dal client: quali abilita' ha l'eroe (la tabella
 * DB_skin_skill), i valori risolti per ogni rango, i nomi nelle due lingue.
 *
 * Fino al 24/09 il legame fra eroe e abilita' sembrava non essere nel client, e
 * veniva da 7dshub: stava nelle tabelle dei due bundle cifrati, che dal 25/09
 * si aprono (decifra_bundle.py). Gli id delle abilita' sono una numerazione a
 * se' - Lancelot ha l'abilita' 1005021 e l'heroId 1967502 - e la tabella li
 * collega uno per uno.
 *
 * Copre tutti gli eroi usciti, dove il wiki si fermava a 167.
 */
interface SourceDbText {
  it?: string;
  en?: string;
}

interface SourceDbRank {
  id: number;
  rango: number;
  nome?: SourceDbText;
  testo_en?: string;
}

interface SourceDbCard {
  tipo: string;
  nome?: SourceDbText;
  ranghi: SourceDbRank[];
}

interface SourceDbHero {
  carte: SourceDbCard[];
  passiva?: {
    nome?: SourceDbText;
    modello?: SourceDbText;
    livelli?: { testo_en?: string; livello_speciale?: number | null }[];
  };
  statistiche?: {
    max?: Record<string, number>;
    max_con_equipaggiamento?: Record<string, number>;
    /** livello 1, con `atkAdd`/`defAdd`/`hpAdd` = la crescita per livello */
    base?: Record<string, number>;
    risveglio?: Record<string, number>[];
    trascendenza?: Record<string, number>[];
    costumi?: Record<string, number>;
    eccesso?: Record<string, number>;
  };
  /** la reliquia delle statistiche massime (`craft` della scheda) */
  reliquia?: { status?: Record<string, number>; upgrades?: Record<string, number>[] } | null;
}

/**
 * I pezzi delle statistiche (HeroStatSteps), dal database della pipeline.
 *
 * Si ricompongono e si confrontano col massimo, che la pipeline calcola per
 * conto suo: se una sola cifra non torna ci si ferma, perche' lo slider della
 * scheda mostrerebbe numeri che il massimo smentisce. Il Vero risveglio
 * (`eccesso`) entra nel controllo ma non nei pezzi: tocca solo resistenza ai
 * danni e classe di combattimento, che la scheda non mostra.
 */
function statSteps(
  stats: NonNullable<SourceDbHero["statistiche"]>,
  relic: SourceDbHero["reliquia"],
  hid: string,
): HeroStatSteps | null {
  const { base: source, risveglio, trascendenza, costumi, max } = stats;
  if (!source || !risveglio || !trascendenza || !costumi || !max) return null;

  const growth = { atk: source.atkAdd ?? 0, def: source.defAdd ?? 0, hp: source.hpAdd ?? 0 };
  // Gli `*IncPer` sono il 100% di partenza, uguale per tutti: non si sommano.
  const base = Object.fromEntries(
    Object.entries(source).filter(([key]) => !key.endsWith("Add") && !key.endsWith("IncPer")),
  );
  let relicStats: Record<string, number> | undefined;
  if (relic?.status) {
    relicStats = { ...relic.status };
    for (const upgrade of relic.upgrades ?? []) {
      for (const [key, value] of Object.entries(upgrade)) relicStats[key] = (relicStats[key] ?? 0) + value;
    }
  }
  const steps: HeroStatSteps = {
    base,
    perLevel: growth,
    maxLevel: 100,
    awaken: risveglio,
    superAwaken: trascendenza,
    ...(relicStats ? { relic: relicStats } : {}),
    costumes: costumi,
  };

  const full = statsAt(steps, maxSelection(steps));
  for (const [key, value] of Object.entries(stats.eccesso ?? {})) full[key] = (full[key] ?? 0) + value;
  for (const [key, expected] of Object.entries(max)) {
    if (key.endsWith("IncPer") || key === "dmgInc") continue;
    if (Math.abs((full[key] ?? 0) - expected) > 1e-6) {
      fail(
        `${hid}: le statistiche ricomposte non ridanno il massimo (${key}: ${full[key]} invece di ${expected})`,
        "Rilancia scheda_client.py e costruisci_database.py: i pezzi e il massimo vengono dalla stessa passata.",
      );
    }
  }
  return steps;
}

const databaseJson = resolve(SOURCE, "eroi/database_eroi.json");

if (!existsSync(databaseJson)) {
  console.log(`  database_eroi.json non trovato: salto abilita' e statistiche.`);
  console.log(`  (si genera con: python costruisci_database.py, dentro _7dsgc)`);
} else {
  const db = JSON.parse(readFileSync(databaseJson, "utf8")) as Record<string, SourceDbHero>;

  // Italiano quando c'e', inglese quando il gioco non l'ha tradotto: la stessa
  // regola dei testi degli eroi.
  const pick = (t?: SourceDbText) => t?.it ?? t?.en;

  const abilityRows: string[] = [];
  const statRows: string[] = [];
  let withCards = 0;
  let withUltimate = 0;
  let withPassive = 0;
  let withPassiveSteps = 0;
  let withStats = 0;
  let withStatSteps = 0;
  let italianCardNames = 0;
  let pairedSprites = 0;
  // I testi italiani: quanti se ne scrivono, quali mancano, e quanti eroi li
  // hanno tutti. `missingInHero` si azzera a ogni eroe e decide `textsInItalian`.
  let italianRanks = 0;
  let italianPassives = 0;
  let italianSteps = 0;
  let italianNamesFromHub = 0;
  let heroesInItalian = 0;
  let missingInHero = 0;
  const missingItalian: string[] = [];

  const renderCard = (card: SourceDbCard, hid: string): string | null => {
    // `clean` toglie le virgolette con cui il gioco decora i nomi delle carte -
    // sono le stesse che decorano gli epiteti, e sono della fonte, non del nome.
    const raw = pick(card.nome);
    const name = raw ? clean(raw) : undefined;
    if (!name) return null;
    const hub = italianHeroes.get(hid);
    const ranks = card.ranghi
      .filter((r) => r.testo_en)
      .map((r) => {
        // Il rango italiano si trova per id: e' lo stesso id d'abilita' nelle
        // due schede, quindi non c'e' niente da accostare.
        const textIt = hub?.skills.get(r.id)?.explain;
        if (hub && textIt) italianRanks++;
        if (hub && !textIt) {
          missingInHero++;
          missingItalian.push(`${hid} rango ${r.id}`);
        }
        return (
          `{ rank: ${r.rango}, text: ${JSON.stringify(r.testo_en)}` +
          (textIt ? `, textIt: ${JSON.stringify(textIt)}` : "") +
          ` }`
        );
      })
      .join(", ");
    if (!ranks) return null;

    // Il nome nelle due lingue: dal database, e se manca dalla scheda italiana,
    // col nome del primo rango, che e' lo stesso per tutti i ranghi. Passa da
    // `clean` come `name`: le virgolette sono le stesse.
    const clientIt = italian(card.nome?.it);
    const hubIt = card.ranghi.map((r) => hub?.skills.get(r.id)?.name).find((value) => value !== undefined);
    if (!clientIt && hubIt) italianNamesFromHub++;
    const nameIt = clientIt ?? hubIt;
    const nameI18n = {
      it: nameIt ? clean(nameIt) : null,
      en: card.nome?.en ? clean(card.nome.en) : null,
    };
    // L'illustrazione si prende per SLOT dagli accostamenti. L'ultimate non ha
    // il numero: il suo file e' ultimate/<id>.png, e c'e' quando c'e'
    // `HeroAssets.ultimate`.
    const sprite = cardSprites.get(hid)?.get(card.tipo);
    if (card.tipo === "ultimate" ? ultimateChoice.has(hid) : sprite) pairedSprites++;
    if (card.nome?.it) italianCardNames++;
    return (
      `{ name: ${JSON.stringify(name)}, slot: ${JSON.stringify(card.tipo)}` +
      (sprite ? `, sprite: ${sprite.n}` : "") +
      `, nameI18n: ${JSON.stringify(nameI18n)}` +
      `, ranks: [${ranks}] }`
    );
  };

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const voce = db[hid];
    if (!voce) continue;
    missingInHero = 0;
    const hub = italianHeroes.get(hid);

    const cards = voce.carte
      .filter((c) => c.tipo === "A" || c.tipo === "B")
      .map((c) => renderCard(c, hid))
      .filter((x): x is string => x !== null);

    const ultimateCard = voce.carte.find((c) => c.tipo === "ultimate");
    const ultimate = ultimateCard ? renderCard(ultimateCard, hid) : null;

    // La passiva: il nome viene dal client quando tradotto, il testo dalla
    // fonte inglese.
    //
    // `livelli` NON sono gradi della passiva, come si leggeva qui prima: sono i
    // testi che la passiva prende salendo di rango l'ultimate, e la scheda segna
    // ciascuno col suo `specialLevel`. Il gioco lo dice anche a colori: i
    // valori legati al rango sono ARANCIONI (`[FF8000]`), non ambra come gli
    // altri. L'arancione pero' segna 36 di queste passive su 42, e nelle altre
    // 6 cambia un pezzo di frase senza colore: per trovarle vale il campo.
    //
    // `specialLevel` k vale dal rango k+1, e il testo senza livello dal rango 1.
    // Non sta scritto da nessuna parte: lo dicono i dati. Su 122 livelli di 42
    // eroi il valore va da 1 a 5 e non tocca MAI 6; il testo senza livello
    // viene sempre per primo; e le 8 passive che cambiano a ogni rango hanno 6
    // testi per 6 ranghi. Leggendo k come il rango stesso, in 38 eroi il testo
    // senza livello non varrebbe a nessun rango.
    //
    // Il testo italiano di ogni livello si accosta per POSIZIONE, e solo se la
    // sequenza italiana coincide con questa livello per livello: altrimenti la
    // passiva resta tutta in inglese, invece di mettere un testo sotto il rango
    // sbagliato.
    const passiveName = pick(voce.passiva?.nome);
    const allLevels = voce.passiva?.livelli ?? [];
    const passiveItalian = hub && sameLevels(allLevels, hub.passiveLevels) ? hub.passiveLevels : undefined;
    const levels = allLevels
      .map((level, index) => ({ ...level, testo_it: passiveItalian?.[index]?.text }))
      .filter((l) => l.testo_en);
    const passiveText = levels[0]?.testo_en;
    const passiveTextIt = levels[0]?.testo_it;
    const passiveSteps = ultimateStepsOf(levels, `passiva di ${hid}`);
    const passiveNameI18n = {
      it: italian(voce.passiva?.nome?.it) ?? hub?.passiveName ?? null,
      en: voce.passiva?.nome?.en ?? null,
    };

    if (hub && passiveText) {
      if (passiveTextIt) italianPassives++;
      else {
        missingInHero++;
        missingItalian.push(`${hid} passiva`);
      }
      for (const step of passiveSteps) {
        if (step.textIt) italianSteps++;
        else {
          missingInHero++;
          missingItalian.push(`${hid} passiva dal rango ${step.fromUltimateRank}`);
        }
      }
    }

    if (cards.length === 0 && !ultimate && !passiveText) continue;

    const parts: string[] = [];
    parts.push(`    cards: [\n${cards.map((c) => `      ${c},`).join("\n")}\n    ],`);
    if (ultimate) parts.push(`    ultimate: ${ultimate},`);
    if (passiveText) {
      const steps = passiveSteps.map(
        (step) =>
          `{ fromUltimateRank: ${step.fromUltimateRank}, text: ${JSON.stringify(step.text)}` +
          (step.textIt ? `, textIt: ${JSON.stringify(step.textIt)}` : "") +
          ` }`,
      );
      parts.push(
        `    passive: { name: ${JSON.stringify(passiveName ?? "")}, ` +
          `nameI18n: ${JSON.stringify(passiveNameI18n)}, ` +
          `text: ${JSON.stringify(passiveText)}` +
          (passiveTextIt ? `, textIt: ${JSON.stringify(passiveTextIt)}` : "") +
          (steps.length > 0 ? `, ultimateSteps: [${steps.join(", ")}]` : "") +
          ` },`,
      );
      if (steps.length > 0) withPassiveSteps++;
    }
    parts.push(`    source: "client del gioco",`);
    parts.push(`    textsInEnglish: true,`);
    // Tutti i testi dell'eroe hanno l'italiano: la scheda in italiano non ha
    // niente da avvertire. Ne basta uno senza perche' l'avviso resti, dato che
    // quel testo si leggera' in inglese.
    if (hub && missingInHero === 0) {
      parts.push(`    textsInItalian: true,`);
      heroesInItalian++;
    }
    abilityRows.push(`  ${JSON.stringify(hid)}: {\n${parts.join("\n")}\n  },`);

    if (cards.length > 0) withCards++;
    if (ultimate) withUltimate++;
    if (passiveText) withPassive++;

    const max = voce.statistiche?.max;
    const geared = voce.statistiche?.max_con_equipaggiamento;
    if (max && geared && Object.keys(max).length > 0) {
      const steps = statSteps(voce.statistiche!, voce.reliquia, hid);
      if (steps) withStatSteps++;
      statRows.push(
        `  ${JSON.stringify(hid)}: { max: ${JSON.stringify(max)}, ` +
          `maxGeared: ${JSON.stringify(geared)}` +
          (steps ? `, steps: ${JSON.stringify(steps)}` : "") +
          ` },`,
      );
      withStats++;
    }
  }

  const generatedAbilities = `/**
 * Carte, ultimate e passive degli eroi di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il client del gioco. Le tabelle dei bundle cifrati (aperti dal 25/09)
 * dicono quali abilita' ha l'eroe e con quali numeri; i testi sono i modelli
 * del client - "damage equal to {melee_val} of Attack" - riempiti con quei
 * numeri come fa il gioco (UnitSkillCardData.ChangeText, rifatto in
 * modelli_client.py). Fino al 24/09 venivano da 7dshub.
 *
 * I TESTI SONO IN DUE LINGUE: \`text\` in inglese e \`textIt\` in italiano, per
 * ogni rango, passiva e passo della passiva. Lo stesso modello nelle due lingue
 * con gli stessi numeri: valori e markup coincidono, e il rango italiano si
 * accosta a quello inglese per id.
 * \`textsInItalian\` dice che l'eroe li ha TUTTI: ${heroesInItalian} eroi su ${abilityRows.length}.
 *
 * Accanto a \`name\` - l'italiano col ripiego sull'inglese, com'e' sempre stato -
 * \`nameI18n\` tiene le due lingue separate, e ha l'italiano anche per le carte
 * che il client non ha tradotto.
 *
 * Sono esclusi i giudizi - valutazioni, pro e contro, consigli: quelli sono
 * opinioni, e il database deve restare la base su cui formarne di proprie.
 */

import type { HeroAbilities } from "../types";

export const HERO_ABILITIES: Readonly<Record<string, HeroAbilities>> = {
${abilityRows.join("\n")}
};
`;

  const generatedStats = `/**
 * Statistiche al massimo livello degli eroi di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il client del gioco (scheda_client.py). Il gioco somma base, crescita
 * per livello, risveglio, trascendenza, exceed e i costumi; qui al livello 100,
 * con tutto al massimo e i 5 costumi migliori per tipo. E' il dato che rende
 * calibrabile il motore, oggi a segnaposto in data.ts.
 *
 * Due colonne: l'eroe nudo e l'eroe equipaggiato. Mostrarne una sola
 * nasconderebbe quanto pesa l'equipaggiamento, che e' meta' del gioco.
 *
 * \`steps\` sono i pezzi di cui \`max\` e' la somma - base, crescita per livello,
 * i sei Risvegli, i sei Super risvegli, la Reliquia sacra, i costumi - per le
 * statistiche a un livello qualunque (lo slider della scheda). L'import li
 * ricompone e si ferma se non ridanno \`max\`.
 */

import type { HeroStats } from "../types";

export const HERO_STATS: Readonly<Record<string, HeroStats>> = {
${statRows.join("\n")}
};
`;

  writeFileSync(DEST_ABILITIES, generatedAbilities, "utf8");
  writeFileSync(DEST_STATS, generatedStats, "utf8");
  console.log(
    `  abilita': ${withCards}/${heroes.length} con carte, ${withUltimate} con ultimate, ` +
      `${withPassive} con passiva (${withPassiveSteps} che cambia col rango dell'ultimate)`,
  );
  console.log(
    `  ${italianCardNames} nomi di carta in italiano dal database, ${italianNamesFromHub} dalla scheda italiana; ` +
      `${pairedSprites} carte con la propria illustrazione`,
  );
  if (italianHeroes.size > 0) {
    console.log(
      `  testi in italiano: ${italianRanks} ranghi, ${italianPassives} passive, ${italianSteps} passi ` +
        `della passiva; ${heroesInItalian} eroi con tutti i testi in italiano` +
        (missingItalian.length > 0
          ? `; ${missingItalian.length} senza (${missingItalian.slice(0, 6).join(", ")}` +
            `${missingItalian.length > 6 ? ", ..." : ""})`
          : ""),
    );
  }
  console.log(
    `  statistiche: ${withStats}/${heroes.length} eroi, ${withStatSteps} coi pezzi per lo slider (ricomposti = massimo)`,
  );
}

/* ------------------------------------------------------------ contesto -- */

/**
 * Cosa vuol dire quello che ogni eroe fa.
 *
 * Lo produce `python contesto_eroi.py`, che legge gli ENUM del client
 * (TeamUnitData.Kind, .Attribute, .JobGroup, RatingType, SkillEffectEnum) e i
 * testi con cui il gioco spiega i propri effetti: le note dentro le abilita',
 * il dizionario dei buff, la tassonomia con cui filtra le abilita'.
 *
 * Il file di partenza e' gia' magro per costruzione: glossario, nomi dei codici
 * e fonti stanno scritti una volta sola, e ogni eroe porta chiavi e numeri.
 * Qui non si ricompatta niente, si traducono solo i nomi dei campi.
 */
interface SourceLabel {
  it: string | null;
  en: string | null;
}

interface SourceContext {
  fonti: Record<string, string>;
  codici: { razza: Record<string, SourceLabel>; attributo: Record<string, SourceLabel>;
    fazione: Record<string, SourceLabel> };
  glossario: Record<string, {
    etichetta: SourceLabel; definizione: SourceLabel;
    fonte: string; tipo: string; certezza: string;
  }>;
  /** codice -> icona e frase del gioco; il legame e' dedotto, prove in contesto_eroi.py */
  condizioni_passiva?: Record<string, { icona: string; descrizione: SourceLabel }>;
  eroi: Record<string, {
    rarita: { ottenibile_come: string | null; massima: string | null;
      puo_diventare_lr: boolean };
    attributo: number | null;
    razza: number | null;
    fazioni: number[];
    abilita: Record<string, {
      tipo: string; effetti: string[];
      solo_a_certi_ranghi?: Record<string, string[]>;
      applicabile_a?: { razze: number[]; fazioni: number[] };
    }>;
    condizioni?: number[];
  }>;
}

const contextJson = resolve(SOURCE, "eroi/contesto_sito.json");

if (!existsSync(contextJson)) {
  console.log(`  contesto_sito.json non trovato: salto il contesto degli effetti.`);
  console.log(`  (si genera con: python contesto_eroi.py, dentro _7dsgc)`);
} else {
  const ctx = JSON.parse(readFileSync(contextJson, "utf8")) as SourceContext;

  const glossaryRows = Object.entries(ctx.glossario).map(
    ([key, v]) =>
      `  ${JSON.stringify(key)}: ${JSON.stringify({
        label: v.etichetta,
        definition: v.definizione,
        source: v.fonte,
        kind: v.tipo,
        certainty: v.certezza,
      })},`,
  );

  let withLr = 0;
  let withEffects = 0;
  let withConditions = 0;
  const heroRows: string[] = [];

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const voce = ctx.eroi[hid];
    if (!voce) continue;

    const cards: Record<string, unknown> = {};
    for (const [slot, carta] of Object.entries(voce.abilita)) {
      const card: Record<string, unknown> = { slot, effects: carta.effetti };
      if (carta.solo_a_certi_ranghi) card["onlyAtRanks"] = carta.solo_a_certi_ranghi;
      if (carta.applicabile_a) {
        card["appliesTo"] = {
          races: carta.applicabile_a.razze,
          factions: carta.applicabile_a.fazioni,
        };
      }
      cards[slot] = card;
    }

    if (voce.rarita.puo_diventare_lr) withLr++;
    if (voce.condizioni?.length) withConditions++;
    if (Object.values(cards).length > 0) withEffects++;

    heroRows.push(
      `  ${JSON.stringify(hid)}: ${JSON.stringify({
        rarity: {
          obtainedAs: voce.rarita.ottenibile_come,
          max: voce.rarita.massima,
          canReachLr: voce.rarita.puo_diventare_lr,
        },
        attribute: voce.attributo,
        race: voce.razza,
        factions: voce.fazioni,
        cards,
        // Dove si attiva la passiva: solo i codici, icona e frase stanno una
        // volta sola nella tabella delle condizioni.
        ...(voce.condizioni?.length ? { passiveConditions: voce.condizioni } : {}),
      })},`,
    );
  }

  const generatedContext = `/**
 * Cosa vuol dire quello che ogni eroe fa.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il CLIENT. Gli enum del gioco (TeamUnitData.Kind,
 * .Attribute, .JobGroup, RatingType) danno il significato dei codici; le note
 * che il gioco si scrive dentro le abilita', il suo dizionario dei buff e la
 * tassonomia con cui filtra gli effetti danno le definizioni. Nessuna tabella
 * di traduzione scritta a mano: se il gioco aggiunge una fazione, compare.
 *
 * DUE GARANZIE DIVERSE, e la differenza resta visibile in pagina:
 *   dichiarato   il gioco quell'effetto lo definisce da se'
 *   dedotto      il gioco non lo definisce da nessuna parte in chiaro, e la
 *                corrispondenza viene dal suo vocabolario interno
 *                (SkillEffectEnum). Sono ${
                   Object.values(ctx.glossario).filter((v) => v.certezza === "dedotto").length
                 } voci su ${Object.keys(ctx.glossario).length}.
 *
 * Le etichette sono BILINGUI anche dove oggi il sito mostra solo l'italiano:
 * la decifratura del client fallisce su righe diverse in lingue diverse, e
 * scegliere qui butterebbe via l'unica versione buona di un'etichetta.
 */

import type {
  HeroContext,
  HeroContextIndex,
  HeroEffect,
  HeroLabel,
  HeroPassiveCondition,
} from "../types";

const GLOSSARY: Readonly<Record<string, HeroEffect>> = {
${glossaryRows.join("\n")}
};

const RACE: Readonly<Record<string, HeroLabel>> = ${JSON.stringify(ctx.codici.razza)};
const ATTRIBUTE: Readonly<Record<string, HeroLabel>> = ${JSON.stringify(ctx.codici.attributo)};
const FACTION: Readonly<Record<string, HeroLabel>> = ${JSON.stringify(ctx.codici.fazione)};

// Dove si attiva una passiva. Il legame codice-icona e' DEDOTTO: la tabella del
// client e' cifrata, le prove stanno in contesto_eroi.py (CONDIZIONI_PASSIVA).
const PASSIVE_CONDITIONS: Readonly<Record<string, HeroPassiveCondition>> = ${JSON.stringify(
    Object.fromEntries(
      Object.entries(ctx.condizioni_passiva ?? {}).map(([code, condition]) => [
        code,
        { icon: condition.icona, description: condition.descrizione },
      ]),
    ),
  )};

const HEROES: Readonly<Record<string, HeroContext>> = {
${heroRows.join("\n")}
};

export const HERO_CONTEXT: HeroContextIndex = {
  glossary: GLOSSARY,
  codes: { race: RACE, attribute: ATTRIBUTE, faction: FACTION },
  passiveConditions: PASSIVE_CONDITIONS,
  sources: ${JSON.stringify(ctx.fonti)},
  heroes: HEROES,
};
`;

  writeFileSync(DEST_CONTEXT, generatedContext, "utf8");
  console.log(
    `  contesto: ${heroRows.length}/${heroes.length} eroi, ${withEffects} con effetti, ` +
      `${withLr} che possono arrivare a LR, ${withConditions} con le condizioni della passiva ` +
      `(${Object.keys(ctx.condizioni_passiva ?? {}).length} codici)`,
  );
  console.log(
    `  glossario: ${glossaryRows.length} voci, ` +
      `${Object.values(ctx.glossario).filter((v) => v.etichetta.it).length} con etichetta italiana`,
  );
}

/* --------------------------------------------------- abilita' speciali -- */

/**
 * I testi che cambiano col rango dell'ultimate, dal `livello_speciale` della fonte.
 *
 * `livello_speciale` k vale dal rango k+1, e il primo testo, senza livello, dal
 * rango 1: le prove stanno nel commento della passiva, dove la regola e' nata.
 * Serve anche ai Talenti, che la scheda scrive con lo stesso schema. Fuori da
 * questo schema la regola non e' piu' dimostrata: ci si ferma, invece di
 * assegnare un testo al rango sbagliato.
 */
function ultimateStepsOf(
  levels: readonly { testo_en?: string; testo_it?: string | undefined; livello_speciale?: number | null }[],
  owner: string,
): { fromUltimateRank: number; text: string; textIt?: string }[] {
  let lastRank = 1;
  return levels.slice(1).map((level) => {
    const from = (level.livello_speciale ?? Number.NaN) + 1;
    if (!Number.isInteger(from) || from <= lastRank || from > 6) {
      throw new Error(
        `${owner}: livello_speciale ${level.livello_speciale} fuori schema ` +
          `(atteso 1-5, crescente). Se manca, rilancia la pipeline.`,
      );
    }
    lastRank = from;
    // `textIt` si aggiunge solo se c'e': il passo senza italiano resta com'era.
    return {
      fromUltimateRank: from,
      text: level.testo_en ?? "",
      ...(level.testo_it ? { textIt: level.testo_it } : {}),
    };
  });
}

/**
 * Comandamenti, Grazie, Unita' e Talenti.
 *
 * Li prepara `python abilita_speciali.py`: effetti e condizioni dalla scheda del client, nomi
 * e regole dal client, e le icone GIA' dentro la cornice del loro tipo, perche'
 * il lavoro di immagini in questo progetto lo fa Python. Qui si traducono i
 * nomi dei campi e si copiano le icone.
 *
 * `speciali/` si svuota prima di copiare, come `carte/`: un'icona accostata
 * diversamente al giro prima resterebbe sul disco.
 */
interface SourceSpecials {
  tipi: Record<string, { etichetta: SourceLabel; regole: SourceLabel[] }>;
  abilita: Record<string, {
    tipo: string;
    nome: SourceLabel;
    livelli: { testo_en?: string; livello_speciale?: number | null }[];
    condizioni: number[];
    icona: { file: string | null; fonte: string };
    cornice: { sprite: string; certezza: string };
  }>;
  eroi: Record<string, string[]>;
  /** heroId -> file dell'icona dell'Unica in m/Texture2D, da DB_skill_passive.icon */
  icone_uniche?: Record<string, string>;
}

const specialsJson = resolve(SOURCE, "eroi/abilita_speciali.json");
const specialsSource = existsSync(specialsJson)
  ? (JSON.parse(readFileSync(specialsJson, "utf8")) as SourceSpecials)
  : null;

if (!specialsSource) {
  console.log(`  abilita_speciali.json non trovato: salto Comandamenti, Grazie, Unita' e Talenti.`);
  console.log(`  (si genera con: python abilita_speciali.py, dentro _7dsgc)`);
} else {
  const iconDir = resolve(DEST_IMAGES, "speciali");
  rmSync(iconDir, { recursive: true, force: true });
  mkdirSync(iconDir, { recursive: true });

  const rosterIds = new Set(heroes.map((hero) => String(hero.heroId)));
  const specialRows: string[] = [];
  let copiedSpecials = 0;
  let italianSpecialTexts = 0;
  let italianSpecialNames = 0;
  const specialsWithoutItalian: string[] = [];

  for (const [id, ability] of Object.entries(specialsSource.abilita)) {
    const from = resolve(SOURCE, "abilita_speciali/icone", `${id}.png`);
    const icon = existsSync(from);
    if (icon) {
      copyFileSync(from, resolve(iconDir, `${id}.png`));
      copiedSpecials++;
    }
    // L'italiano per posizione, come per la passiva: solo se la scheda italiana
    // ha gli stessi livelli, con lo stesso `specialLevel`.
    const hub = italianSpecials.get(id);
    const italianLevels = hub && sameLevels(ability.livelli, hub.levels) ? hub.levels : undefined;
    const levels = ability.livelli
      .map((level, index) => ({ ...level, testo_it: italianLevels?.[index]?.text }))
      .filter((level) => level.testo_en);
    const steps = ultimateStepsOf(levels, `abilita' speciale ${id}`);
    const textIt = levels[0]?.testo_it;
    if (textIt && steps.every((step) => step.textIt)) italianSpecialTexts++;
    else if (italianSpecials.size > 0) specialsWithoutItalian.push(id);

    // Il nome italiano, se abilita_speciali.py non l'ha, si prende dalla scheda
    // italiana. Si tolgono solo le virgolette
    // che avvolgono tutto il nome ("\"Lettura del cuore\""), come nei nomi delle
    // carte; il grassetto resta, perche' c'e' anche nel nome inglese
    // ("Grace of [b]Sunshine[/b]") e la pagina lo rende.
    const hubName = hub?.name;
    const unquoted =
      hubName && hubName.length > 1 && hubName.startsWith('"') && hubName.endsWith('"')
        ? hubName.slice(1, -1).trim()
        : hubName;
    if (!ability.nome.it && unquoted) italianSpecialNames++;
    const name = { ...ability.nome, it: ability.nome.it ?? unquoted ?? null };

    specialRows.push(
      `    ${JSON.stringify(id)}: ${JSON.stringify({
        kind: ability.tipo,
        name,
        text: levels[0]?.testo_en ?? "",
        ...(textIt ? { textIt } : {}),
        ...(steps.length > 0 ? { ultimateSteps: steps } : {}),
        conditions: ability.condizioni,
        icon,
      })},`,
    );
  }

  const specialHeroes = Object.fromEntries(
    Object.entries(specialsSource.eroi).filter(([hid]) => rosterIds.has(hid)),
  );
  const kinds = Object.fromEntries(
    Object.entries(specialsSource.tipi).map(([kind, v]) => [kind, { label: v.etichetta, rules: v.regole }]),
  );

  writeFileSync(
    DEST_SPECIALS,
    `/**
 * Comandamenti, Grazie, Unita' e Talenti degli eroi di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il client. Effetti e condizioni dalla scheda (grace, taboo,
 * solidarity, ability), \`text\` in inglese e \`textIt\` in italiano; nomi e
 * regole nelle due lingue; icone (DB_skill_passive.icon) e cornici (dal tipo
 * della passiva, come IconExclusive.Set; i Talenti dal tipo della loro carta).
 */

import type { HeroSpecialsIndex } from "../types";

export const HERO_SPECIALS: HeroSpecialsIndex = {
  kinds: ${JSON.stringify(kinds)},
  abilities: {
${specialRows.join("\n")}
  },
  heroes: ${JSON.stringify(specialHeroes)},
};
`,
    "utf8",
  );
  console.log(
    `  abilita' speciali: ${specialRows.length} per ${Object.keys(specialHeroes).length} eroi, ` +
      `${copiedSpecials} icone incorniciate copiate`,
  );
  if (italianSpecials.size > 0) {
    console.log(
      `  abilita' speciali in italiano: ${italianSpecialTexts}/${specialRows.length} con tutti i testi, ` +
        `${italianSpecialNames} nomi presi dalla scheda italiana` +
        (specialsWithoutItalian.length > 0 ? `; senza: ${specialsWithoutItalian.join(", ")}` : ""),
    );
  }
}

/* ------------------------------------------------------ reliquie sacre -- */

/**
 * Le Reliquie sacre.
 *
 * Le prepara `python scheda_client.py` in eroi/client/reliquie.json, nelle due
 * lingue e tutte dal client: nome, descrizione ed effetto; statistiche e i tre
 * potenziamenti; la Bestia demoniaca da cui si fabbrica e i materiali; l'icona
 * grande (<arma>_c, 256px) e le icone degli oggetti. Qui si copiano le immagini
 * e si traducono i nomi dei campi.
 *
 * `reliquie/` e `oggetti/` si svuotano prima di copiare, come `speciali/`.
 */
interface SourceAmount {
  id: number;
  quantita: number;
}

interface SourceRelics {
  bestie: Record<string, SourceLabel | null>;
  oggetti: Record<string, { nome: SourceLabel; icona: { file: string | null } }>;
  reliquie: Record<
    string,
    {
      classica: boolean;
      nome: SourceLabel;
      descrizione: SourceLabel;
      icona: { file: string | null } | null;
      statistiche: Record<string, number>;
      potenziamenti: { statistiche: Record<string, number>; materiali: SourceAmount[]; costo: SourceAmount | null }[];
      passiva: { nome: SourceLabel; testo: SourceLabel; condizioni: number[] } | null;
      bestie: number[];
      materiali: SourceAmount[];
      costo: SourceAmount | null;
    }
  >;
  eroi: Record<string, number[]>;
}

const relicsJson = resolve(SOURCE, "eroi/client/reliquie.json");
const relicsSource = existsSync(relicsJson)
  ? (JSON.parse(readFileSync(relicsJson, "utf8")) as SourceRelics)
  : null;

if (!relicsSource) {
  console.log(`  reliquie.json non trovato: salto le Reliquie sacre.`);
  console.log(`  (si genera con: python scheda_client.py, dentro _7dsgc)`);
} else {
  const relicDir = resolve(DEST_IMAGES, "reliquie");
  const itemDir = resolve(DEST_IMAGES, "oggetti");
  for (const dir of [relicDir, itemDir]) {
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
  }
  const extracted = (file: string | null | undefined) =>
    file ? resolve(SOURCE, "7dsgc_estratti", file) : null;

  const rosterIds = new Set(heroes.map((hero) => String(hero.heroId)));
  const relicHeroes = Object.fromEntries(
    Object.entries(relicsSource.eroi)
      .filter(([hid]) => rosterIds.has(hid))
      .map(([hid, ids]) => [hid, ids.map(String)]),
  );
  const cited = new Set(Object.values(relicHeroes).flat());

  const amount = (a: SourceAmount | null | undefined) =>
    a ? { id: String(a.id), count: a.quantita } : undefined;
  const amounts = (list: SourceAmount[]) => list.map((a) => amount(a)!);

  let relicImages = 0;
  const relicRows: string[] = [];
  const usedItems = new Set<string>();
  for (const [id, relic] of Object.entries(relicsSource.reliquie)) {
    if (!cited.has(id)) continue;
    const from = extracted(relic.icona?.file);
    const image = from !== null && existsSync(from);
    if (image) {
      copyFileSync(from, resolve(relicDir, `${id}.png`));
      relicImages++;
    }
    const upgrades = relic.potenziamenti.map((u) => ({
      stats: u.statistiche,
      materials: amounts(u.materiali),
      ...(u.costo ? { cost: amount(u.costo) } : {}),
    }));
    const row = {
      name: relic.nome,
      description: relic.descrizione,
      image,
      classic: relic.classica,
      stats: relic.statistiche,
      upgrades,
      ...(relic.passiva
        ? { passive: { name: relic.passiva.nome, text: relic.passiva.testo, conditions: relic.passiva.condizioni } }
        : {}),
      beasts: relic.bestie.map(String),
      materials: amounts(relic.materiali),
      ...(relic.costo ? { cost: amount(relic.costo) } : {}),
    };
    for (const a of [...row.materials, row.cost, ...upgrades.flatMap((u) => [...u.materials, u.cost])]) {
      if (a) usedItems.add(a.id);
    }
    relicRows.push(`    ${JSON.stringify(id)}: ${JSON.stringify(row)},`);
  }

  let itemIcons = 0;
  const items: Record<string, { name: SourceLabel; icon: boolean }> = {};
  for (const id of [...usedItems].sort()) {
    const source = relicsSource.oggetti[id];
    const from = extracted(source?.icona.file);
    const icon = from !== null && existsSync(from);
    if (icon) {
      copyFileSync(from, resolve(itemDir, `${id}.png`));
      itemIcons++;
    }
    items[id] = { name: source?.nome ?? { it: null, en: null }, icon };
  }
  const beasts = Object.fromEntries(
    Object.entries(relicsSource.bestie).flatMap(([id, label]) => (label ? [[id, label]] : [])),
  );

  writeFileSync(
    DEST_RELICS,
    `/**
 * Le Reliquie sacre degli eroi di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il client (scheda_client.py -> eroi/client/reliquie.json). Una
 * reliquia e' un costume d'arma: DB_costume_base (statistiche, effetto),
 * DB_costume_craft (bestia e materiali), DB_craft_costume_upgrade (i tre
 * potenziamenti), DB_item_info (icone e nomi degli oggetti). Scritta una volta,
 * e gli eroi la citano: le versioni di un personaggio spesso la condividono.
 */

import type { HeroRelicsIndex } from "../types";

export const HERO_RELICS: HeroRelicsIndex = {
  beasts: ${JSON.stringify(beasts)},
  items: ${JSON.stringify(items)},
  relics: {
${relicRows.join("\n")}
  },
  heroes: ${JSON.stringify(relicHeroes)},
};
`,
    "utf8",
  );
  console.log(
    `  reliquie sacre: ${relicRows.length} per ${Object.keys(relicHeroes).length} eroi, ` +
      `${relicImages} immagini, ${itemIcons}/${usedItems.size} icone di oggetti`,
  );
}

/* --------------------------------------------------------------- asset -- */

/**
 * Illustrazione e icona dell'abilita' esclusiva (l'Unica).
 *
 * L'illustrazione la mappa `python mappa_asset.py` nella cartella della
 * pipeline: si copia solo se il nome del file contiene l'heroId a 7 cifre. Le
 * icone dei ritratti no, perche' l'heroId non c'e' e il collegamento passa da
 * uno slug che restringe al personaggio ma non alla variante.
 *
 * L'icona dell'Unica dal 26/09 la dice il client: DB_skill_passive.icon della
 * passiva che la scheda mostra, scritta da abilita_speciali.py in
 * `icone_uniche`. Il nome del file (icon_exclusive_skill_<heroId>) era giusto per
 * 362 eroi su 375: agli altri mancava l'icona, o c'era quella di un'altra
 * versione, o la sfera dell'Unita' al posto del ritratto.
 */
interface SourceAssets {
  splash?: string;
  abilita?: string;
  slug?: string;
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
  const copied: Record<string, number> = { splash: 0, abilita: 0, ultimate: 0 };

  for (const kind of ASSET_KINDS) {
    mkdirSync(resolve(DEST_IMAGES, kind.dir), { recursive: true });
  }
  mkdirSync(resolve(DEST_IMAGES, "ultimate"), { recursive: true });

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const voce = mappa[hid];
    if (!voce) continue;

    const flags: string[] = [];
    for (const kind of ASSET_KINDS) {
      // L'icona dell'Unica dal client si copia SEMPRE: il file preso prima per
      // nome puo' essere sul disco con una data piu' recente di quello giusto.
      const unica = kind.key === "abilita" ? specialsSource?.icone_uniche?.[hid] : undefined;
      const rel = unica ? `m/Texture2D/${unica}` : voce[kind.key];
      if (!rel) continue;
      const from = resolve(estratti, rel);
      if (!existsSync(from)) continue;
      const to = resolve(DEST_IMAGES, kind.dir, `${hid}.png`);
      if (unica) {
        copyFileSync(from, to);
        copied[kind.dir]!++;
      } else if (copyIfNewer(from, to)) {
        copied[kind.dir]!++;
      }
      flags.push(`${kind.key === "abilita" ? "skill" : "splash"}: true`);
      // L'illustrazione e' quasi sempre scontornata (sfondo trasparente): 9 su
      // 372 hanno lo sfondo dipinto, e sul palco della griglia e della scheda
      // (hero-stage.tsx) vanno in una cornice e non come figura (10/10)
      if (kind.key === "splash" && (await sharp(to).stats()).isOpaque) flags.push(`splashFull: true`);
    }

    // Le carte d'attacco le ha gia' copiate la sezione degli accostamenti: qui
    // si dice solo quante ce ne sono in carte/<id>/.
    const perSlot = cardSprites.get(hid);
    if (perSlot) flags.push(`cards: ${perSlot.size}`);

    // La carta dell'ultimate, dagli accostamenti. Si copia SEMPRE e non "se
    // piu' nuova", per la stessa ragione delle carte: un'ultimate accostata
    // diversamente al giro prima resterebbe al suo posto.
    const ultimate = ultimateChoice.get(hid);
    if (ultimate) {
      const from = resolve(estratti, ultimate.file);
      if (existsSync(from)) {
        copyFileSync(from, resolve(DEST_IMAGES, "ultimate", `${hid}.png`));
        copied.ultimate!++;
        flags.push(`ultimate: true`);
      }
    }

    // Il numero di colpi per carta (`skill_attack_count_<id>.bytes`, campo
    // `colpi` di asset_eroi.json) non si importa piu': tolto dalla scheda il
    // 15/09 perche' non serviva.

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
      `${copied.ultimate} carte dell'ultimate ` +
      `(${rows.length}/${heroes.length} eroi con almeno un asset)`,
  );
}

/* --------------------------------------------------------------- icone -- */

/**
 * Le icone con cui il GIOCO etichetta rarita', attributo e razza.
 *
 * Sono le stesse che usa nei propri filtri - si chiamano `icon_filter_grade_LR`,
 * `icon_filter_attribute_01`, `icon_filter_kind_01` - quindi il numero nel nome
 * e' gia' il codice che il dataset porta: nessun accostamento da indovinare.
 *
 * Le FAZIONI non ci sono, e non e' un buco dell'estrazione: cercate su ogni
 * pista plausibile (la famiglia icon_filter_*, icon_job, icon_group,
 * icon_category, hero_category, characteristic, emblem, e i nomi delle nove
 * fazioni) danno zero. Il gioco non filtra per fazione, quindi non ha l'icona.
 *
 * Nemmeno i singoli EFFETTI ce l'hanno, e qui il numero e' netto: delle 533
 * icone `icon_buff_*` solo 17 hanno lo stesso nome di una voce del glossario, e
 * coprono 22 accostamenti su 1.690 - l'1%. Il legame vero e' la colonna
 * `DB_skill_card_buff.icon`: fino al 26/09 era cifrata, ora si legge ed e' in
 * data/grand-cross/effetti/buff.json. Un'icona accanto a un effetto si potra'
 * mettere da li', senza indovinarla.
 */
const ICON_SOURCE = resolve(SOURCE, "7dsgc_estratti/m/Texture2D");

/**
 * La stella e le pietre dei ranghi arrivano da un'altra cartella, e c'e' un
 * motivo.
 *
 * Non sono file separati nel gioco: stanno impacchettate dentro
 * `atlas_skillcard`, una texture unica, accanto a cornici e sfondi delle carte.
 * Le ritaglia `python stella_carte.py`, per nome (`card_star` e
 * `card_frame_special_jewelry_01..06`) e con la mappa NGUI dell'atlas. Il lavoro
 * di immagini sta nella pipeline perche' in questo progetto lo fa Python: qui si
 * copia e basta, come per le card.
 *
 * Prima qui arrivavano le cornici di bronzo, argento e oro, allungate per
 * stare attorno all'illustrazione: scartate, le stelle dicono il rango senza
 * ridisegnare la carta.
 */
const STAR_SOURCE = resolve(SOURCE, "stella_carte");

/**
 * Le icone di dove si attiva una passiva, lette dal contesto.
 *
 * Non un elenco scritto qui: i file nel gioco sono dodici, ma le passive degli
 * eroi ne usano nove, e quali siano lo dice la tabella dei codici che
 * contesto_eroi.py ha costruito. La chiave e' il suffisso del file.
 */
function passiveConditionIcons(): string[] {
  if (!existsSync(contextJson)) return [];
  const ctx = JSON.parse(readFileSync(contextJson, "utf8")) as SourceContext;
  return Object.values(ctx.condizioni_passiva ?? {}).map((condition) => condition.icona);
}

const ICONS: readonly { family: string; key: string; file: string; dir?: string }[] = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    family: "razza",
    key: String(n),
    file: `icon_filter_kind_0${n}_58x59.png`,
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    family: "attributo",
    key: String(n),
    file: `icon_filter_attribute_0${n}_50x50.png`,
  })),
  ...["R", "SR", "SSR", "UR", "LR"].map((grade) => ({
    family: "rarita",
    key: grade,
    file: `icon_filter_grade_${grade}_60x60.png`,
  })),
  // Una stella sola: il sito la ripete una, due o tre volte secondo il rango.
  { family: "carta", key: "stella", file: "stella.png", dir: STAR_SOURCE },
  // L'ultimate ha sei ranghi e il gioco li segna con una pietra per rango, dalla
  // verdina del primo alla goccia verde chiaro del sesto.
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    family: "carta",
    key: `pietra_${n}`,
    file: `pietra_${n}.png`,
    dir: STAR_SOURCE,
  })),
  // I risvegli dell'eroe (dal 27/09): la stella rossa del Super risveglio e le due
  // sfere del Vero risveglio, 1 coi materiali del Re Demone e 2 della Divinita'
  // (exceed_type di DB_skin_exceed). Le ritaglia stella_carte.py da atlas_common e
  // atlas_awaken_vfx.
  { family: "risveglio", key: "super_stella", file: "super_stella.png", dir: STAR_SOURCE },
  ...[1, 2].map((n) => ({ family: "risveglio", key: `vero_${n}`, file: `vero_risveglio_${n}.png`, dir: STAR_SOURCE })),
  // Dove si attiva una passiva: le icone del riquadro dell'abilita' unica.
  ...passiveConditionIcons().map((icon) => ({
    family: "condizione",
    key: icon,
    file: `icon_passive_condition_${icon}_64x64.png`,
  })),
];

{
  const found: Record<string, string[]> = {};
  let copiedIcons = 0;
  const missing: string[] = [];

  for (const icon of ICONS) {
    const from = resolve(icon.dir ?? ICON_SOURCE, icon.file);
    if (!existsSync(from)) {
      missing.push(icon.file);
      continue;
    }
    const dir = resolve(DEST_IMAGES, "icone", icon.family);
    mkdirSync(dir, { recursive: true });
    if (copyIfNewer(from, resolve(dir, `${icon.key}.png`))) copiedIcons++;
    const keys = found[icon.family];
    if (keys === undefined) found[icon.family] = [icon.key];
    else keys.push(icon.key);
  }

  const iconRows = Object.entries(found).map(
    ([family, keys]) => `  ${JSON.stringify(family)}: ${JSON.stringify(keys)},`,
  );

  writeFileSync(
    DEST_ICONS,
    `/**
 * Quali icone del gioco sono state estratte.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * Le icone stesse stanno in public/eroi/${GAME}/icone/ e NON sono versionate:
 * sono grafica di Netmarble, e si rimettono con \`npm run eroi:import\`. Questo
 * elenco serve a non mostrare un riquadro rotto a chi clona senza gli asset.
 *
 * La chiave e' il codice del gioco - 1-6 per la razza, 1-5 per l'attributo, la
 * sigla per la rarita' - perche' e' gia' il numero scritto nel nome del file
 * originale. Le fazioni non compaiono: il gioco non ha un'icona per loro.
 * Sotto \`carta\` ci sono le insegne dei ranghi: la stella delle carte A e B, una
 * sola che il rango ripete, e le sei pietre dell'ultimate, una per rango.
 * Sotto \`condizione\` le icone di dove si attiva una passiva, col suffisso del
 * file come chiave (\`start_combat\`, \`sub\`, \`pvp_only\`...).
 */

export const GAME_ICONS: Readonly<Record<string, readonly string[]>> = {
${iconRows.join("\n")}
};
`,
    "utf8",
  );

  console.log(
    `  icone del gioco: ${copiedIcons} copiate, ` +
      `${ICONS.length - missing.length}/${ICONS.length} disponibili` +
      (missing.length > 0 ? ` (mancano: ${missing.join(", ")})` : ""),
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
