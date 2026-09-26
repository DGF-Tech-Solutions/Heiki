/**
 * Importazione delle modalita' di fine gioco di Grand Cross.
 *
 *   npm run endgame:import      (lo lancia anche npm run eroi:import, dopo gli eroi)
 *
 * Legge tre file della pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/scontri_finali.json       python script/scontri_finali.py
 *   eroi/creature_nest.json        python script/creature_nest.py
 *   eroi/re_demone_divinita.json   python script/re_demone_divinita.py
 *
 * e ne ricava i dati delle quattro pagine del gruppo Endgame, piu' i legami
 * con gli eroi per la loro scheda:
 *
 *   src/lib/games/grand-cross/death-match.generated.ts
 *   src/lib/games/grand-cross/creature-nest.generated.ts
 *   src/lib/games/grand-cross/demon-king.generated.ts
 *   src/lib/games/grand-cross/supreme-deity.generated.ts
 *   src/lib/games/grand-cross/endgame-heroes.generated.ts
 *   public/eroi/grand-cross/endgame/                        immagini, NON versionate
 *
 * I JSON della pipeline sono fatti per ragionarci: portano i campi non capiti,
 * le chiavi dei testi, le fonti di ogni valore. Qui si tiene quello che una
 * pagina mostra, e niente di piu'. Due cose restano apposta fino in pagina:
 * quello che la pipeline ha DEDOTTO invece di leggere (statistiche stimate,
 * nomi presi da un mostro gemello, vantaggio d'attributo), e gli avvisi sui dati
 * del client che si contraddicono.
 *
 * Da NON mostrare, per gli studi (SCONTRI_FINALI.md, RE_DEMONE_DIVINITA.md,
 * CREATURE_NEST.md): i campi della Divinita' Suprema copiati da Hraesvelgr, il
 * gettone di Crockshell del Re Demone, le passive senza nome ne' testo (il gioco
 * le nasconde: se ne dice solo quante sono), gli «Effetti abilita'» degli
 * Scontri finali (il client non ne ha i testi), le modalita' senza stage
 * giocabili (Battaglia Disastro, colosseo senza stagioni), e lo Scontro finale
 * d'evento di Lamek (scelta dell'utente: e' un evento, non sta coi boss fissi).
 *
 * Se un file manca, la sua modalita' resta fuori: il modulo non la dichiara e
 * la voce non compare nella barra laterale.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type {
  CreatureNestIndex,
  DeathMatchBoss,
  DeathMatchDifficulty,
  DeathMatchIndex,
  DeityGroup,
  DemonKingDifficulty,
  DemonKingIndex,
  DemonKingPhase,
  DemonKingRuleStep,
  EndgameAmount,
  EndgameDrop,
  EndgameDrops,
  EndgameFoe,
  EndgameHeroLink,
  EndgameHeroPassive,
  EndgameItem,
  EndgameMonster,
  EndgameMode,
  EndgamePassive,
  EndgamePassiveSource,
  EndgameSkill,
  EndgameSkillSlot,
  EndgameTips,
  NestBeast,
  NestFloor,
  NestPhase,
  NestSurtrPhase,
  SupremeDeityDifficulty,
  SupremeDeityIndex,
} from "../src/lib/games/endgame-types";
import type { HeroLabel } from "../src/lib/games/types";

/** Cartella della pipeline di estrazione. Fuori dal repo: e' materiale di lavoro. */
const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const EXTRACTED = resolve(SOURCE, "7dsgc_estratti");
const DEST_IMAGES = resolve(ROOT, "public/eroi", GAME, "endgame");
const destData = (file: string) => resolve(ROOT, "src/lib/games", GAME, file);

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma delle fonti -- */

/*
 * Solo i campi che si leggono. I JSON della pipeline ne hanno molti di piu':
 * scriverli tutti qui sarebbe un secondo contratto da tenere allineato, per
 * campi che nessuna pagina usa.
 */

interface SrcLabel {
  it?: string | null;
  en?: string | null;
}

interface SrcImage {
  risorsa?: string;
  file?: string[];
}

interface SrcRef {
  id: number;
  nome?: SrcLabel | null;
}

interface SrcAmount extends SrcRef {
  quantita?: number | string;
}

interface SrcDropEntry {
  id?: number;
  nome?: SrcLabel | null;
  quantita?: number | string;
  peso: number;
  oggetto?: (SrcRef & { artefatto?: { icona_s?: SrcImage | null } | null }) | null;
  per_regione?: Record<string, SrcRef>;
}

interface SrcDrops {
  estrazioni_min?: number;
  estrazioni_max?: number;
  voci: SrcDropEntry[];
}

interface SrcSkill {
  id: number;
  nome?: SrcLabel | null;
  testo?: SrcLabel | null;
  tipo_attacco?: string | null;
  icona?: SrcImage | null;
}

interface SrcMonster {
  id: number;
  nome?: SrcLabel | null;
  descrizione?: SrcLabel | null;
  razza?: { codice: number } | null;
  attributo?: { codice: number } | null;
  passive: SrcRef[];
  abilita?: Record<string, SrcSkill>;
  probabilita_abilita?: { a?: number; b?: number } | null;
  immagini?: Record<string, SrcImage | null>;
  info_scontro?: Record<string, { testo?: SrcLabel | null } | null>;
  _dedotto?: Record<string, string>;
}

interface SrcPassive {
  nome?: SrcLabel | null;
  testo?: SrcLabel | null;
}

interface SrcItem {
  nome?: SrcLabel | null;
  icona?: SrcImage | null;
}

interface SrcDictionary {
  mostri: Record<string, SrcMonster>;
  passive: Record<string, SrcPassive>;
  oggetti: Record<string, SrcItem>;
}

interface SrcHeroRef {
  heroId: number;
}

interface SrcStats {
  atk: number;
  def: number;
  hp: number;
}

/* --------------------------------------------------------------- testi -- */

type Label = { it: string | null; en: string | null };

/**
 * Un testo del client, ripulito dei due difetti che la pipeline non tocca:
 * U+FEFF rimasto in qualche stringa e il segnaposto NONE_DB, che vale come
 * testo mancante (come nell'import degli eroi).
 */
function clean(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const text = value.replaceAll("\uFEFF", "").trim();
  return text === "" || text === "NONE_DB" ? null : text;
}

function label(value: SrcLabel | null | undefined): Label {
  return { it: clean(value?.it), en: clean(value?.en) };
}

function labelOrNull(value: SrcLabel | null | undefined): Label | null {
  const out = label(value);
  return out.it || out.en ? out : null;
}

/**
 * Le virgolette che avvolgono tutto un nome di carta («"Semina di
 * distruzione"»): il gioco le scrive, la pagina no. Solo se avvolgono il nome
 * intero, come fa `senza_virgolette` della pipeline per le carte degli eroi.
 */
function unquote(value: Label): Label {
  const strip = (text: string | null) => {
    if (!text) return text;
    const match = /^["\u201C\u201D](.*)["\u201C\u201D]$/.exec(text);
    return match && !/["\u201C\u201D]/.test(match[1]!) ? match[1]! : text;
  };
  return { it: strip(value.it), en: strip(value.en) };
}

/** «[FF007F]Inferno[-]» -> il nome e il suo colore: il bottone della difficolta' prende il colore del gioco. */
function coloredName(value: SrcLabel | null | undefined): { name: Label; color: string | null } {
  let color: string | null = null;
  const plain = (text: string | null) => {
    if (!text) return text;
    const match = /^\[([0-9A-Fa-f]{6})\](.*?)\[-\]$/.exec(text);
    if (!match) return text;
    color ??= `#${match[1]!.toUpperCase()}`;
    return match[2]!;
  };
  const source = label(value);
  return { name: { it: plain(source.it), en: plain(source.en) }, color };
}

/** Un valore "-" o "None" nelle schede dei boss vuol dire «nessuna». */
function tip(value: SrcLabel | null | undefined): Label | null {
  const out = labelOrNull(value);
  if (!out) return null;
  const empty = (text: string | null) => text === null || text === "-" || text === "None" || text === "Nessuna";
  return empty(out.it) && empty(out.en) ? null : out;
}

/* ------------------------------------------------------------ immagini -- */

let imagesCopied = 0;
const imagesMissing = new Set<string>();

/**
 * Copia un'immagine della pipeline in public/eroi/<gioco>/endgame/<rel>.
 *
 * Il riprova e' lo stesso dell'import degli eroi: su Windows la copia di tanti
 * file piccoli fallisce ogni tanto con EBUSY o EPERM, e un secondo tentativo
 * passa sempre.
 */
function copyImage(image: SrcImage | null | undefined, rel: string): boolean {
  const file = image?.file?.[0];
  if (!file) {
    if (image?.risorsa) imagesMissing.add(image.risorsa);
    return false;
  }
  const from = resolve(EXTRACTED, file);
  if (!existsSync(from)) {
    imagesMissing.add(file);
    return false;
  }
  const to = resolve(DEST_IMAGES, rel);
  mkdirSync(dirname(to), { recursive: true });
  for (let attempt = 0; ; attempt++) {
    try {
      copyFileSync(from, to);
      imagesCopied++;
      return true;
    } catch (error) {
      if (attempt >= 2) throw error;
    }
  }
}

/* ------------------------------------------------------------- eroi -- */

const rosterJson = resolve(SOURCE, "eroi/eroi.json");
if (!existsSync(rosterJson)) fail(`non trovo ${rosterJson}: imposta GC_ASSETS sulla cartella _7dsgc`);
const ROSTER = new Set(
  (JSON.parse(readFileSync(rosterJson, "utf8")) as SrcHeroRef[]).map((hero) => String(hero.heroId)),
);

/** Solo gli eroi del roster: un eroe annunciato senza scheda non ha dove portare. */
function heroIds(list: readonly SrcHeroRef[] | null | undefined): string[] {
  const out: string[] = [];
  for (const hero of list ?? []) {
    const id = String(hero.heroId);
    if (ROSTER.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

/** Il campo del client da cui viene la passiva dell'eroe, in parole della pagina. */
function passiveSource(field: string): EndgamePassiveSource {
  const head = field.split(".")[0]!;
  if (head === "reliquia") return "relic";
  if (head === "taboo_exclusive_passive_id") return "commandment";
  if (head === "grace_exclusive_passive_id") return "grace";
  if (head === "list_array_ability_exclusive_passive_id") return "talent";
  if (head === "fate") return "bond";
  if (head.startsWith("exclusive_passive_id") || head === "list_array_attribute_exclusive_passive_id") return "unique";
  fail(`fonte di passiva sconosciuta: ${field} (aggiungila a passiveSource)`);
}

interface SrcHeroPassive {
  heroId: number;
  fonte: string;
  passiva: SrcRef;
}

/**
 * Una voce per eroe e nome di passiva. Le varianti dell'unica per attributo
 * (list_array_attribute_exclusive_passive_id) hanno id diversi e lo stesso
 * nome: in pagina sarebbero la stessa riga due volte.
 */
function heroPassives(list: readonly SrcHeroPassive[]): EndgameHeroPassive[] {
  const out: EndgameHeroPassive[] = [];
  const seen = new Set<string>();
  for (const entry of list) {
    const heroId = String(entry.heroId);
    if (!ROSTER.has(heroId)) continue;
    const passive = unquote(label(entry.passiva.nome));
    const key = `${heroId}:${passive.en ?? passive.it ?? entry.passiva.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ heroId, source: passiveSource(entry.fonte), passive });
  }
  return out;
}

const heroLinks = new Map<string, EndgameHeroLink[]>();

function link(heroId: string, value: EndgameHeroLink) {
  const list = heroLinks.get(heroId) ?? [];
  const key = JSON.stringify(value);
  if (!list.some((known) => JSON.stringify(known) === key)) list.push(value);
  heroLinks.set(heroId, list);
}

/* ------------------------------------------------------ il dizionario -- */

const SKILL_SLOTS: readonly [RegExp, EndgameSkillSlot][] = [
  [/^skill_a_(\d)$/, "a"],
  [/^skill_b_(\d)$/, "b"],
  [/^skill_exclusive_a$/, "exclusive_a"],
  [/^skill_exclusive_b$/, "exclusive_b"],
  [/^special$/, "special"],
  [/^counter_attack_(\d)$/, "counter"],
];
const SLOT_ORDER: readonly EndgameSkillSlot[] = ["a", "b", "exclusive_a", "exclusive_b", "special", "counter"];

/**
 * Mostri, passive e oggetti di una modalita', scritti una volta.
 *
 * Si riempie citando: una fase chiede un mostro, il mostro le sue passive, un
 * drop i suoi oggetti. Cosi' nel file generato c'e' solo quello che la pagina
 * mostra, non i 144 mostri della nest col colosseo che non ha stagioni.
 */
class Dictionary {
  readonly monsters: Record<string, EndgameMonster> = {};
  readonly passives: Record<string, EndgamePassive> = {};
  readonly items: Record<string, EndgameItem> = {};

  constructor(private readonly source: SrcDictionary) {}

  /**
   * La passiva, se ha un nome; null per quelle che il gioco nasconde: senza
   * nome ne' testo, o col segnaposto «Unica nascosta» («Hidden Unique», testo
   * «Un effetto abilita' Unica sconosciuto»: 16 fra Scontri finali e Bestie).
   * Nella scheda del mostro si contano, non si mostrano.
   */
  passive(id: number | string | null | undefined): string | null {
    if (id === null || id === undefined) return null;
    const key = String(id);
    if (this.passives[key]) return key;
    const source = this.source.passive[key];
    const name = labelOrNull(source?.nome);
    if (!source || !name || name.en === "Hidden Unique") return null;
    this.passives[key] = { name: unquote(name), text: label(source.testo) };
    return key;
  }

  /**
   * Una passiva che la pagina nomina per forza (un passo del Verdetto, una
   * Maledizione): senza nome non c'e' niente da scrivere, e ci si ferma invece
   * di mostrare un numero.
   */
  requirePassive(ref: SrcRef): string {
    return this.passive(ref.id) ?? fail(`la passiva ${ref.id} non ha un nome, e la pagina deve nominarla`);
  }

  passiveList(list: readonly SrcRef[] | null | undefined): string[] {
    const out: string[] = [];
    for (const ref of list ?? []) {
      const id = this.passive(ref.id);
      if (id && !out.includes(id)) out.push(id);
    }
    return out;
  }

  /**
   * Un oggetto: nome e icona dal dizionario della pipeline, o dal riferimento
   * stesso quando il dizionario non l'ha (le carte artefatto nei drop hanno
   * l'icona in DB_artifact_card, non in DB_item_info).
   */
  item(ref: SrcRef, fallbackIcon?: SrcImage | null): string {
    const key = String(ref.id);
    if (this.items[key]) return key;
    const source = this.source.oggetti[key];
    const name = unquote(label(source?.nome ?? ref.nome));
    const icon = copyImage(source?.icona?.file?.length ? source.icona : (fallbackIcon ?? source?.icona), `oggetti/${key}.png`);
    this.items[key] = { name, icon };
    return key;
  }

  amounts(list: readonly SrcAmount[] | null | undefined): EndgameAmount[] {
    return (list ?? []).map((entry) => ({ id: this.item(entry), count: Number(entry.quantita ?? 1) }));
  }

  drops(source: SrcDrops | null | undefined, draws?: number): EndgameDrops {
    if (!source) return { draws: 0, entries: [] };
    const min = source.estrazioni_min ?? draws ?? 1;
    const max = source.estrazioni_max ?? draws ?? 1;
    if (min !== max) fail(`estrazioni da ${min} a ${max}: il contratto ne prevede un numero fisso`);
    const entries: EndgameDrop[] = source.voci.map((entry) => {
      const ref = entry.oggetto ?? (entry.id !== undefined ? { id: entry.id, nome: entry.nome } : null);
      const byRegion = entry.per_regione
        ? Object.fromEntries(Object.entries(entry.per_regione).map(([region, item]) => [region, this.item(item)]))
        : undefined;
      if (!ref && !byRegion) fail("una voce di drop senza oggetto");
      return {
        id: ref ? this.item(ref, entry.oggetto?.artefatto?.icona_s) : null,
        count: Number(entry.quantita ?? 1),
        weight: entry.peso,
        ...(byRegion ? { byRegion } : {}),
      };
    });
    return { draws: max, entries };
  }

  /** Il mostro, con le sue carte e le passive che hanno un nome. */
  monster(id: number, tips?: EndgameTips): string {
    const key = String(id);
    const known = this.monsters[key];
    if (known) {
      if (tips && !known.tips) this.monsters[key] = { ...known, tips };
      return key;
    }
    const source = this.source.mostri[key];
    if (!source) fail(`il mostro ${key} non e' nel dizionario della pipeline`);

    const named = this.passiveList(source.passive);
    const images = source.immagini ?? {};
    const iconSource = images.icona_modalita ?? images.icona_creaturenest ?? images.icona;
    const draw = source.probabilita_abilita;

    this.monsters[key] = {
      name: label(source.nome),
      ...(source._dedotto?.nome ? { nameDeduced: true as const } : {}),
      description: labelOrNull(source.descrizione),
      race: source.razza?.codice ?? null,
      attribute: source.attributo?.codice ?? null,
      icon: copyImage(iconSource, `mostri/${key}.png`),
      skills: this.skills(source.abilita ?? {}),
      ...(draw && typeof draw.a === "number" && typeof draw.b === "number" ? { draw: { a: draw.a, b: draw.b } } : {}),
      passives: named,
      hiddenPassives: source.passive.length - named.length,
      ...(tips ? { tips } : {}),
    };
    return key;
  }

  /** Le carte del boss per posto nel mazzo, coi ranghi in ordine. */
  private skills(source: Record<string, SrcSkill>): EndgameSkill[] {
    const bySlot = new Map<EndgameSkillSlot, { rank: number; skill: SrcSkill }[]>();
    for (const [field, skill] of Object.entries(source)) {
      const hit = SKILL_SLOTS.find(([pattern]) => pattern.test(field));
      if (!hit) fail(`carta di boss in un posto sconosciuto: ${field}`);
      const rank = Number(hit[0].exec(field)?.[1] ?? 1);
      const list = bySlot.get(hit[1]) ?? [];
      list.push({ rank, skill });
      bySlot.set(hit[1], list);
    }
    const out: EndgameSkill[] = [];
    for (const slot of SLOT_ORDER) {
      const ranks = (bySlot.get(slot) ?? []).sort((a, b) => a.rank - b.rank);
      if (ranks.length === 0) continue;
      const first = ranks[0]!.skill;
      const texts = ranks.map((entry) => label(entry.skill.testo));
      const name = unquote(label(first.nome));
      if (!name.it && !name.en && texts.every((text) => !text.it && !text.en)) continue;
      out.push({
        slot,
        name,
        ranks: texts,
        kind: first.tipo_attacco && first.tipo_attacco !== "none" ? first.tipo_attacco : null,
        icon: this.skillIcon(first.icona),
      });
    }
    return out;
  }

  skillIcon(image: SrcImage | null | undefined): string | null {
    const name = image?.risorsa;
    if (!name) return null;
    return copyImage(image, `abilita/${name}.png`) ? name : null;
  }

  /**
   * Un nemico in una fase. La stima si tiene solo se ha senso: i mostri di
   * contorno con PS 1 (i lupi piccoli di Skoll e Hati) non hanno statistiche
   * proprie, e una «stima» di 1 PS sarebbe un numero falso scritto bene.
   */
  foe(
    monster: number,
    level: number,
    multipliers: SrcStats,
    estimate: SrcStats | null | undefined,
    extra?: readonly SrcRef[] | null,
    tips?: EndgameTips,
  ): EndgameFoe {
    const extraPassives = this.passiveList(extra);
    return {
      monster: this.monster(monster, tips),
      level,
      multipliers: { atk: multipliers.atk, def: multipliers.def, hp: multipliers.hp },
      estimate: estimate && estimate.hp > 100 ? { atk: estimate.atk, def: estimate.def, hp: estimate.hp } : null,
      ...(extraPassives.length ? { extraPassives } : {}),
    };
  }

  /** Le tre tabelle, da mettere in cima all'indice della modalita'. */
  tables() {
    return { monsters: this.monsters, passives: this.passives, items: this.items };
  }
}

/** Carica un JSON della pipeline, o dice che la modalita' resta fuori. */
function load<T>(file: string, script: string): T | null {
  const path = resolve(SOURCE, "eroi", file);
  if (!existsSync(path)) {
    console.log(`  ${file} non trovato: salto la modalita'. (si genera con: python script/${script}, dentro _7dsgc)`);
    return null;
  }
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

/** Il file generato: il dato come letterale tipato, un campo per riga dove conta per i diff. */
function writeGenerated(file: string, header: string, name: string, type: string, value: unknown) {
  writeFileSync(
    destData(file),
    `/**
${header
  .trim()
  .split("\n")
  .map((line) => ` * ${line}`.trimEnd())
  .join("\n")}
 *
 * GENERATO DA scripts/import-endgame.mts - NON MODIFICARE A MANO.
 */

import type { ${type} } from "../endgame-types";

export const ${name}: ${type} = ${JSON.stringify(value, null, 1)};
`,
    "utf8",
  );
}

/* ------------------------------------------------------------ inizio -- */

console.log("\n  Endgame: Scontri finali, Bestie demoniache, Re Demone, Divinita' Suprema");
rmSync(DEST_IMAGES, { recursive: true, force: true });
mkdirSync(DEST_IMAGES, { recursive: true });

const written: string[] = [];

/* ------------------------------------------------------ Scontri finali -- */

interface SrcDeathMatch extends SrcDictionary {
  nome_modalita: { titolo: SrcLabel };
  regole: { testo: SrcLabel }[];
  configurazione: { minuti_limite: { value_int_1: number }; caos_al_giorno: { value_int_1: number } };
  regioni: { region: number; capitolo: number; villaggio: { nome: SrcLabel } }[];
  meta: { controlli: { razze_contro_passive: { discordanti: { mostro: number }[] } } };
  immagini_generali: Record<string, SrcImage | null>;
  scontri: {
    chiave: string;
    nome: SrcLabel;
    tipo: string;
    stelle: { codice: number } | null;
    regioni: { region: number }[];
    razza: { codice: number } | null;
    attributo: { codice: number } | null;
    vantaggio_elementale: { forte_contro_il_boss: { codice: number } | null } | null;
    guida: { chiave: string; testo: SrcLabel }[];
    materiale: SrcRef | null;
    respingimento_mamma_hawk: { oggetto: SrcAmount | null; aggiuntivo: SrcAmount | null } | null;
    squadra_ia: { nome: SrcLabel; potenza_mostrata: number; membri: SrcHeroRef[] } | null;
    set_artefatti: { nome: SrcLabel; carte: { nome: SrcLabel }[]; passive_per_livello: SrcRef[] } | null;
    costumi_set: { nome: SrcLabel; eroi: SrcHeroRef[]; effetto: { testo: SrcLabel } | null }[];
    immagini: {
      info: SrcImage | null;
      bottone_partecipa: SrcImage | null;
      boss: { icona_scontro: SrcImage | null; cut_in: SrcImage | null };
    };
    difficolta: {
      difficolta: number;
      nome: SrcLabel;
      livello_boss: number;
      costo: { quantita: number };
      oro: number;
      potenza_consigliata: number;
      sblocco: { quest: SrcRef | null; stage: SrcRef | null } | null;
      restrizioni: {
        attributi_ammessi: { codice: number }[] | null;
        gruppi_vietati: { eroi: SrcHeroRef[] }[] | null;
      } | null;
      fasi: {
        mostro: { id: number };
        livello: number;
        moltiplicatori_percento: SrcStats;
        stat_stimate: SrcStats | null;
        passive_fase: SrcRef[];
      }[];
      ricompense: {
        vittoria_garantita: { quantita: number; oggetto: SrcRef }[];
        drop: SrcDrops;
        leader: SrcDrops | null;
      };
    }[];
  }[];
  eroi: {
    per_eroe: {
      heroId: number;
      passive: { fonte: string; categoria: string; passiva: SrcRef }[];
    }[];
  };
}

/**
 * I consigli della finestra «Info mostro», per mostro: le sei colonne di
 * DB_stage_destroy_desc. «Effetti abilita'» no: il client non ne ha nessun testo.
 */
function destroyTips(monster: SrcMonster | undefined): EndgameTips | undefined {
  const info = monster?.info_scontro;
  if (!info) return undefined;
  return {
    favoredRaces: tip(info.razze_avvantaggiate?.testo),
    unfavoredRaces: tip(info.razze_svantaggiate?.testo),
    skills: tip(info.abilita_consigliate?.testo),
    behavior: tip(info.comportamento?.testo),
    unique: tip(info.info_unica?.testo),
  };
}

const deathMatchSource = load<SrcDeathMatch>("scontri_finali.json", "scontri_finali.py");
if (deathMatchSource) {
  const source = deathMatchSource;
  const dict = new Dictionary(source);
  const discordant = new Set(source.meta.controlli.razze_contro_passive.discordanti.map((entry) => entry.mostro));

  const regions = Object.fromEntries(
    source.regioni.map((region) => [
      String(region.region),
      { name: label(region.villaggio.nome), chapter: region.capitolo },
    ]),
  );

  // Le guide copiate. Il client da' a Indura la guida di Bellmoth (nelle regioni
  // 1-3) e a Lamek quella del Demone rosso: una guida che piu' boss condividono
  // resta solo al boss che il suo nome cita (DB_destroy_guide_reddemon_01 ->
  // red_demon). Mostrata sotto Indura, la frase su Bellmoth sarebbe falsa.
  const guideUsers = new Map<string, number>();
  for (const boss of source.scontri) {
    for (const line of new Set(boss.guida.map((entry) => entry.chiave))) {
      guideUsers.set(line, (guideUsers.get(line) ?? 0) + 1);
    }
  }
  const squash = (text: string) => text.toLowerCase().replaceAll("_", "");
  const guideOf = (boss: SrcDeathMatch["scontri"][number]) =>
    boss.guida.filter((entry) => (guideUsers.get(entry.chiave) ?? 0) < 2 || squash(entry.chiave).includes(squash(boss.chiave)));

  // Solo i boss fissi. Lamek e' uno Scontro finale d'evento («Ritorno di Lamek»,
  // regione virtuale 9304) che si gioca quando il server apre l'evento: scelta
  // dell'utente (26/09), nella sezione non ha senso che stia accanto ai sei che
  // invadono i villaggi. Resta nel JSON della pipeline.
  const permanent = source.scontri.filter((boss) => boss.tipo === "fisso");

  const bosses: DeathMatchBoss[] = permanent.map((boss) => {
    const key = boss.chiave.replaceAll("_", "-");
    const target = { key, name: label(boss.nome) };

    const difficulties: DeathMatchDifficulty[] = boss.difficolta.map((level) => {
      const banned = heroIds((level.restrizioni?.gruppi_vietati ?? []).flatMap((group) => group.eroi));
      for (const heroId of banned) link(heroId, { mode: "death-match", kind: "banned", target });
      return {
        ...coloredName(level.nome),
        level: level.difficolta,
        bossLevel: level.livello_boss,
        energy: level.costo.quantita,
        gold: level.oro,
        power: level.potenza_consigliata,
        unlock: labelOrNull(level.sblocco?.quest?.nome ?? level.sblocco?.stage?.nome),
        allowedAttributes: level.restrizioni?.attributi_ammessi?.map((attribute) => attribute.codice) ?? null,
        bannedHeroes: banned,
        phases: level.fasi.map((phase) => ({
          foe: dict.foe(
            phase.mostro.id,
            phase.livello,
            phase.moltiplicatori_percento,
            phase.stat_stimate,
            phase.passive_fase,
            destroyTips(source.mostri[String(phase.mostro.id)]),
          ),
        })),
        guaranteed: level.ricompense.vittoria_garantita.map((entry) => ({
          id: dict.item(entry.oggetto),
          count: entry.quantita,
        })),
        drops: dict.drops(level.ricompense.drop),
        leader: dict.drops(level.ricompense.leader, 1),
      };
    });

    // Gli avvisi: la pipeline controlla le razze della finestra «Info mostro»
    // contro le passive del boss, e per Indura non tornano. Si dice in pagina
    // invece di scegliere: non sappiamo quale delle due il gioco applichi.
    const contradicts = difficulties.some((level) =>
      level.phases.some((phase) => discordant.has(Number(phase.foe.monster))),
    );
    const warnings: HeroLabel[] = contradicts
      ? [
          {
            it: "La finestra «Info mostro» del gioco mette una razza fra le avvantaggiate, ma le passive del boss aumentano i danni che infligge proprio a quella razza. Il client non dice quale delle due informazioni valga.",
            en: "The game's Monster Info window lists a race as advantaged, but the boss's passives increase the damage it deals to that very race. The client does not say which of the two applies.",
          },
        ]
      : [];

    const aiTeam = boss.squadra_ia
      ? { name: label(boss.squadra_ia.nome), power: boss.squadra_ia.potenza_mostrata, heroes: heroIds(boss.squadra_ia.membri) }
      : null;
    for (const heroId of aiTeam?.heroes ?? []) link(heroId, { mode: "death-match", kind: "ai-team", target });

    const repulse = boss.respingimento_mamma_hawk;
    return {
      key,
      name: label(boss.nome),
      stars: boss.stelle ? boss.stelle.codice + 1 : fail(`lo Scontro finale ${key} non ha le stelle`),
      regions: boss.regioni.map((region) => String(region.region)).filter((region) => region in regions),
      race: boss.razza?.codice ?? null,
      attribute: boss.attributo?.codice ?? null,
      advantage: boss.vantaggio_elementale?.forte_contro_il_boss?.codice ?? null,
      guide: guideOf(boss).map((entry) => label(entry.testo)),
      warnings,
      image: copyImage(boss.immagini.info, `scontri/${key}.png`),
      icon: copyImage(boss.immagini.boss.icona_scontro, `scontri/${key}-icona.png`),
      // Il cut-in del mostro e' lo stesso file del bottone «Partecipa» dello
      // scontro (DB_stage_destroy_common): per i sei boss coincidono.
      cutIn: copyImage(boss.immagini.boss.cut_in ?? boss.immagini.bottone_partecipa, `scontri/${key}-cutin.png`),
      material: boss.materiale ? dict.item(boss.materiale) : null,
      repulse: dict.amounts([repulse?.oggetto, repulse?.aggiuntivo].filter((entry): entry is SrcAmount => !!entry)),
      aiTeam,
      artifactSet: boss.set_artefatti
        ? {
            name: unquote(label(boss.set_artefatti.nome)),
            cards: boss.set_artefatti.carte.map((card) => unquote(label(card.nome))),
            levels: dict.passiveList(boss.set_artefatti.passive_per_livello),
          }
        : null,
      costumeSets: boss.costumi_set.map((set) => ({
        name: label(set.nome),
        heroes: heroIds(set.eroi),
        effect: label(set.effetto?.testo),
      })),
      difficulties,
    };
  });

  const byCategory = (category: string) =>
    heroPassives(
      source.eroi.per_eroe.flatMap((hero) =>
        hero.passive
          .filter((entry) => entry.categoria === category)
          .map((entry) => ({ heroId: hero.heroId, fonte: entry.fonte, passiva: entry.passiva })),
      ),
    );
  const heroesOnly = byCategory("solo_scontro");
  const heroesExcluded = byCategory("esclusa");
  for (const entry of heroesOnly) link(entry.heroId, { mode: "death-match", kind: "only", passive: entry.passive });
  for (const entry of heroesExcluded) link(entry.heroId, { mode: "death-match", kind: "excluded", passive: entry.passive });

  copyImage(source.immagini_generali.icon_shortcut_destroy, "modalita/death-match.png");

  const index: DeathMatchIndex = {
    name: label(source.nome_modalita.titolo),
    rules: source.regole.map((rule) => label(rule.testo)),
    limits: {
      minutes: source.configurazione.minuti_limite.value_int_1,
      chaosPerDay: source.configurazione.caos_al_giorno.value_int_1,
    },
    regions,
    bosses,
    heroesOnly,
    heroesExcluded,
    ...dict.tables(),
  };
  writeGenerated(
    "death-match.generated.ts",
    `Gli Scontri finali («Death Match») di Grand Cross.

FONTE: il client, via python script/scontri_finali.py (eroi/scontri_finali.json).
Le 118 righe di DB_stage_destroy sono 7 boss: lo stesso boss nelle sei regioni e'
lo stesso scontro, e cambia solo il materiale dei costumi dei boss 2 e 3 stelle.
Qui i 6 fissi: Lamek, d'evento, resta fuori (scelta dell'utente, 26/09).
Lo studio, con quello che e' letto e quello che e' dedotto: SCONTRI_FINALI.md.`,
    "DEATH_MATCH",
    "DeathMatchIndex",
    index,
  );
  written.push(
    `scontri finali: ${bosses.length} boss, ${bosses.reduce((n, boss) => n + boss.difficulties.length, 0)} difficolta', ` +
      `${Object.keys(dict.monsters).length} mostri, ${heroesOnly.length} + ${heroesExcluded.length} passive di eroi`,
  );
}

/* -------------------------------------------------- Bestie demoniache -- */

interface SrcNestHero extends SrcHeroRef {
  fonte: string;
  passiva: SrcRef;
}

interface SrcNest extends SrcDictionary {
  nome_modalita: { titolo: SrcLabel };
  guida: { titolo: SrcLabel; testo: SrcLabel };
  guida_trascendente: { titolo: SrcLabel; testo: SrcLabel };
  selezione_settimanale: { titolo: SrcLabel; testo: SrcLabel };
  scambio_materiali: {
    testi: { spiegazione: SrcLabel };
    materiali_in_punti: { materiale: SrcRef; punti: number }[];
    ricompense: { ricompensa: SrcRef; punti_richiesti: number; limite_settimanale: number }[];
  };
  bestie: {
    group_id: number;
    nome: SrcLabel;
    classe_combattimento_consigliata: number;
    materiale_principale: SrcRef | null;
    testo_ricompensa_garantita: SrcLabel | null;
    immagini: { ritratto_lobby: SrcImage | null };
    surtr?: {
      per_stage: {
        stage_id: number;
        fasi: {
          fase: number;
          limite_turni: number | null;
          laevateinn: {
            righe: { risposte_per_tipo: { tipo: { testo: SrcLabel }; effetto_aggiunto: { testo: SrcLabel | null } | null }[] }[];
          } | null;
          incantesimo_di_kenaz: {
            righe: { tipo_richiesto: { testo: SrcLabel }; se_sbagliato: { testo: SrcLabel | null } | null }[];
          } | null;
          rune: { carte: { ricarica_turni: number; abilita: { nome: SrcLabel; testo: SrcLabel } }[] } | null;
        }[];
      }[];
    } | null;
    stage: {
      id: number;
      nome: SrcLabel;
      piano: number;
      difficolta: SrcLabel;
      costo: { quantita: number };
      ricompense_primo_completamento: SrcAmount[];
      ricompense_completamento: SrcAmount[];
      drop: SrcDrops;
      immagini: { info_image_1: SrcImage | null };
      passive_casuali: { per_fase: { fase: number; candidate: { passiva: SrcRef }[] }[] } | null;
      fasi: {
        fase: number;
        descrizione: SrcLabel | null;
        moltiplicatori_percento: SrcStats;
        boss: { monster_id: number; livello: number; passive_fase: SrcRef[]; stat_stimate: SrcStats | null }[];
        gauge: { nome: SrcLabel; descrizione: SrcLabel } | null;
      }[];
    }[];
    reliquie_sacre: { nome: SrcLabel; eroi: SrcHeroRef[] }[];
    eroi_legati: { passive_solo_per_questa_bestia: SrcNestHero[]; sangue_cattivo: number[] };
  }[];
  eroi: {
    per_eroe: {
      heroId: number;
      passive_nest: { fonte: string; motivi: string[]; solo_bestie: number[] | null; passiva: SrcRef }[];
    }[];
  };
}

function slug(text: string | null): string {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function surtrPhase(phase: NonNullable<SrcNest["bestie"][number]["surtr"]>["per_stage"][number]["fasi"][number]): NestSurtrPhase {
  const laevateinn = (phase.laevateinn?.righe ?? []).flatMap((row) =>
    row.risposte_per_tipo.map((answer) => ({
      type: label(answer.tipo.testo),
      effect: labelOrNull(answer.effetto_aggiunto?.testo),
    })),
  );
  const kenazRows = phase.incantesimo_di_kenaz?.righe ?? [];
  const kenaz = kenazRows.map((row) => label(row.tipo_richiesto.testo));
  // Il nome della runa e' anche la prima riga del suo testo: si toglie dal testo.
  const runes = (phase.rune?.carte ?? []).map((card) => {
    const name = label(card.abilita.nome);
    const text = label(card.abilita.testo);
    const trim = (body: string | null, head: string | null) =>
      body && head && body.startsWith(`${head}\\n`) ? body.slice(head.length + 2) : body;
    return { name, text: { it: trim(text.it, name.it), en: trim(text.en, name.en) }, cooldown: card.ricarica_turni };
  });
  return {
    laevateinn,
    kenaz,
    kenazPenalty: labelOrNull(kenazRows.find((row) => row.se_sbagliato?.testo)?.se_sbagliato?.testo),
    runes,
  };
}

const nestSource = load<SrcNest>("creature_nest.json", "creature_nest.py");
if (nestSource) {
  const source = nestSource;
  const dict = new Dictionary(source);

  const beasts: NestBeast[] = source.bestie.map((beast) => {
    const key = slug(beast.nome.en ?? beast.nome.it ?? "");
    const target = { key, name: label(beast.nome) };
    const surtr = new Map((beast.surtr?.per_stage ?? []).map((stage) => [stage.stage_id, stage]));

    const floors: NestFloor[] = beast.stage.map((stage) => {
      const random = new Map((stage.passive_casuali?.per_fase ?? []).map((entry) => [entry.fase, entry.candidate]));
      const surtrStage = surtr.get(stage.id);
      const phases: NestPhase[] = stage.fasi.map((phase) => {
        const surtrData = surtrStage?.fasi.find((entry) => entry.fase === phase.fase) ?? null;
        return {
          description: labelOrNull(phase.descrizione),
          foes: phase.boss.map((boss) =>
            dict.foe(boss.monster_id, boss.livello, phase.moltiplicatori_percento, boss.stat_stimate, boss.passive_fase),
          ),
          randomPassives: dict.passiveList((random.get(phase.fase) ?? []).map((entry) => entry.passiva)),
          gauge: phase.gauge ? { name: label(phase.gauge.nome), text: label(phase.gauge.descrizione) } : null,
          surtr: surtrData ? surtrPhase(surtrData) : null,
          turnLimit: surtrData?.limite_turni ?? null,
        };
      });
      return {
        ...coloredName(stage.difficolta),
        title: label(stage.nome),
        floor: stage.piano,
        transcendent: stage.piano === 4,
        energy: stage.costo.quantita,
        firstClear: dict.amounts(stage.ricompense_primo_completamento),
        clear: dict.amounts(stage.ricompense_completamento),
        drops: dict.drops(stage.drop),
        phases,
      };
    });

    const heroesOnly = heroPassives(
      beast.eroi_legati.passive_solo_per_questa_bestia.map((entry) => ({ ...entry })),
    );
    for (const entry of heroesOnly) link(entry.heroId, { mode: "creature-nest", kind: "only", target, passive: entry.passive });
    const badBlood = heroIds(beast.eroi_legati.sangue_cattivo.map((heroId) => ({ heroId })));
    for (const heroId of badBlood) link(heroId, { mode: "creature-nest", kind: "bad-blood", target });

    const firstInfo = beast.stage[0]?.immagini.info_image_1;
    return {
      key,
      group: String(beast.group_id),
      name: label(beast.nome),
      power: beast.classe_combattimento_consigliata > 0 ? beast.classe_combattimento_consigliata : null,
      image: copyImage(beast.immagini.ritratto_lobby, `bestie/${key}.png`),
      info: copyImage(firstInfo, `bestie/${key}-info.png`),
      material: beast.materiale_principale ? dict.item(beast.materiale_principale) : null,
      guaranteed: labelOrNull(beast.testo_ricompensa_garantita),
      floors,
      relics: beast.reliquie_sacre
        .map((relic) => ({ name: unquote(label(relic.nome)), heroes: heroIds(relic.eroi) }))
        .filter((relic) => relic.heroes.length > 0),
      heroesOnly,
      badBlood,
    };
  });

  // Le passive di tutta la nest: codice 8 senza una bestia sola; escluse: codice 9.
  const nestHeroes = (keep: (entry: { motivi: string[]; solo_bestie: number[] | null }) => boolean) =>
    heroPassives(
      source.eroi.per_eroe.flatMap((hero) =>
        hero.passive_nest
          .filter(keep)
          .map((entry) => ({ heroId: hero.heroId, fonte: entry.fonte, passiva: entry.passiva })),
      ),
    );
  const heroesOnly = nestHeroes((entry) => entry.motivi.includes("codice_8") && entry.solo_bestie === null);
  const heroesExcluded = nestHeroes((entry) => entry.motivi.includes("codice_9"));
  for (const entry of heroesOnly) link(entry.heroId, { mode: "creature-nest", kind: "only", passive: entry.passive });
  for (const entry of heroesExcluded) link(entry.heroId, { mode: "creature-nest", kind: "excluded", passive: entry.passive });

  const exchange = source.scambio_materiali;
  const index: CreatureNestIndex = {
    name: label(source.nome_modalita.titolo),
    guide: [source.guida, source.guida_trascendente, source.selezione_settimanale].map((entry) => ({
      title: label(entry.titolo),
      text: label(entry.testo),
    })),
    beasts,
    exchange: {
      text: labelOrNull(exchange.testi.spiegazione),
      points: exchange.materiali_in_punti.map((entry) => ({ id: dict.item(entry.materiale), points: entry.punti })),
      rewards: exchange.ricompense.map((entry) => ({
        id: dict.item(entry.ricompensa),
        points: entry.punti_richiesti,
        weekly: entry.limite_settimanale,
      })),
    },
    heroesOnly,
    heroesExcluded,
    ...dict.tables(),
  };
  writeGenerated(
    "creature-nest.generated.ts",
    `Le Bestie demoniache («Creature Nest») di Grand Cross.

FONTE: il client, via python script/creature_nest.py (eroi/creature_nest.json). Le
sei bestie coi loro piani; il colosseo («Prova di coraggio») resta fuori perche' nel
client non ha stagioni. Lo studio: CREATURE_NEST.md.`,
    "CREATURE_NEST",
    "CreatureNestIndex",
    index,
  );
  written.push(
    `bestie demoniache: ${beasts.length} bestie, ${beasts.reduce((n, beast) => n + beast.floors.length, 0)} piani, ` +
      `${Object.keys(dict.monsters).length} mostri, ${Object.keys(dict.passives).length} passive`,
  );
}

/* ----------------------------------------------- Re Demone e Divinita' -- */

interface SrcBanned {
  vietati: { eroi_esclusi: SrcHeroRef[] }[];
}

interface SrcOvercost {
  stage: number;
  moltiplicatore: number;
  punti_richiesti: number;
}

interface SrcBox {
  id: number;
  contenuto: { id: number; nome: SrcLabel; quantita: number; peso: number }[];
}

interface SrcDeityGroup {
  id: number;
  nome: SrcLabel | null;
  descrizione: SrcLabel | null;
  immagine_info: SrcImage | null;
  attributo_forte_contro: { codice: number } | null;
  attributo_debole_contro: { codice: number } | null;
  abilita_efficaci: SrcLabel | null;
  moltiplicatori_percento: SrcStats;
  passive_squadra: SrcRef[];
  mostri: { monster_id: number; livello: number; passive_posizione: SrcRef[]; stat_stimate: SrcStats | null }[];
}

interface SrcBosses extends SrcDictionary {
  re_demone: {
    nome: SrcLabel;
    sblocco: { nome_quest: SrcLabel | null };
    guida: { regole: SrcLabel[]; energia_perniciosa: SrcLabel; avvertenza: SrcLabel; verdetto: { testo: SrcLabel } };
    tentativi: { gratis: SrcLabel | null };
    punti_purgatorio: { da_monete_eroe: { rarita_eroe: string; punti: number }[] };
    overcost: { righe: SrcOvercost[] };
    immagini: Record<string, SrcImage | null>;
    link: { icona: SrcImage | null };
    difficolta: {
      id: number;
      livello_difficolta: number;
      difficolta: SrcLabel;
      costo_energia: { quantita: number };
      oro: number;
      potenza: { team_power: number };
      ricompense_completamento: SrcAmount[];
      drop: SrcDrops;
      passive_alleati: SrcRef[];
      restrizioni: SrcBanned;
      verdetto: { energia_perniciosa_per_passo: number; passiva: SrcRef }[];
      fasi: {
        moltiplicatori_percento: SrcStats;
        boss: { monster_id: number; livello: number; passive_fase: SrcRef[]; stat_stimate: SrcStats | null };
        scheda: {
          razza_forte_contro_il_boss: SrcLabel | null;
          razza_debole_contro_il_boss: SrcLabel | null;
          abilita_efficaci: SrcLabel | null;
          schema: SrcLabel | null;
        } | null;
        regole: { tipo: string; sequenze: { passi: { valori: number[] }[] }[] } | null;
      }[];
    }[];
    scambio_cristalli: {
      righe: { limite_settimanale: number; dai: SrcAmount; ricevi_uno_fra: SrcRef[] }[];
    };
    casse: SrcBox[];
  };
  divinita_suprema: {
    nome: SrcLabel;
    sblocco: { nome_quest: SrcLabel | null };
    guida: {
      contenuto: SrcLabel;
      punizione_celeste: { titolo: SrcLabel; testi: SrcLabel[] };
      editti_e_maledizioni: { titolo: SrcLabel; testi: SrcLabel[] };
      stigmate: { titolo: SrcLabel; testi: SrcLabel[] };
      giudizi_nascosti: { titolo: SrcLabel; testi: SrcLabel[] };
    };
    tentativi: { gratis: SrcLabel | null };
    overcost: SrcOvercost[];
    maledizioni: { nome: SrcLabel; passiva: SrcRef }[];
    stigmate: { abilita: SrcSkill }[];
    casse: SrcBox[];
    immagini: Record<string, SrcImage | null>;
    difficolta: {
      id: number;
      livello_difficolta: number;
      difficolta: SrcLabel;
      costo_energia: { quantita: number };
      oro: number;
      potenza: { team_power: number };
      ricompense_completamento: SrcAmount[];
      drop: SrcDrops;
      passiva_modalita: SrcRef | null;
      passive_eroi: SrcRef[];
      restrizioni: SrcBanned;
      magia: { aumento_per_nemico_sopravvissuto_percento: number; soglie_finale: number[]; statistiche_ereditate_percento: number };
      editti: { per_livello_di_magia: number[]; gruppi: Record<string, { testo: SrcLabel }[]> };
      giudizi: { nome: SrcLabel; limite_turni: number; candidati: SrcDeityGroup[] }[];
      giudizio_finale: { per_magia: { magia_fino_a_percento: number; candidati: SrcDeityGroup[] }[] };
      giudizio_nascosto: { si_apre_se_magia_sotto_percento: number; candidati: SrcDeityGroup[] } | null;
    }[];
  };
}

function points(rows: readonly SrcOvercost[], stage: number) {
  const at = (rate: number) => rows.find((row) => row.stage === stage && row.moltiplicatore === rate)?.punti_richiesti ?? null;
  return { x1: at(1), x3: at(3) };
}

function boxes(dict: Dictionary, list: readonly SrcBox[]): Record<string, EndgameDrop[]> {
  return Object.fromEntries(
    list.map((box) => [
      dict.item({ id: box.id }),
      box.contenuto.map((entry) => ({ id: dict.item(entry), count: entry.quantita, weight: entry.peso })),
    ]),
  );
}

function bannedOf(restrictions: SrcBanned): string[] {
  return heroIds(restrictions.vietati.flatMap((rule) => rule.eroi_esclusi));
}

const bossesSource = load<SrcBosses>("re_demone_divinita.json", "re_demone_divinita.py");
if (bossesSource) {
  /* ---- Re Demone ---- */
  {
    const source = bossesSource.re_demone;
    const dict = new Dictionary(bossesSource);
    const RULE_TYPES = new Set(["attribute_type", "card_rank", "attack_type"]);

    const difficulties: DemonKingDifficulty[] = source.difficolta.map((level) => {
      const phases: DemonKingPhase[] = level.fasi.map((phase) => {
        const sheet = phase.scheda;
        const tips: EndgameTips | undefined = sheet
          ? {
              favoredRaces: tip(sheet.razza_forte_contro_il_boss),
              unfavoredRaces: tip(sheet.razza_debole_contro_il_boss),
              skills: tip(sheet.abilita_efficaci),
              behavior: tip(sheet.schema),
              unique: null,
            }
          : undefined;
        const rules = phase.regole;
        if (rules && !RULE_TYPES.has(rules.tipo)) fail(`regola del Re Demone di tipo sconosciuto: ${rules.tipo}`);
        return {
          foe: dict.foe(
            phase.boss.monster_id,
            phase.boss.livello,
            phase.moltiplicatori_percento,
            phase.boss.stat_stimate,
            phase.boss.passive_fase,
            tips,
          ),
          rules: rules
            ? {
                type: rules.tipo as "attribute_type" | "card_rank" | "attack_type",
                sequences: rules.sequenze.map((sequence) => {
                  const steps = sequence.passi.map((step) => step.valori as DemonKingRuleStep);
                  if (steps.length !== 3) fail(`una sequenza del Re Demone con ${steps.length} richieste invece di 3`);
                  return [steps[0]!, steps[1]!, steps[2]!] as const;
                }),
              }
            : null,
        };
      });
      return {
        ...coloredName(level.difficolta),
        level: level.livello_difficolta,
        bossLevel: level.fasi[0]?.boss.livello ?? 0,
        energy: level.costo_energia.quantita,
        gold: level.oro,
        power: level.potenza.team_power,
        clear: dict.amounts(level.ricompense_completamento),
        drops: dict.drops(level.drop),
        verdict: level.verdetto.map((step) => ({
          threshold: step.energia_perniciosa_per_passo,
          passive: dict.requirePassive(step.passiva),
        })),
        points: points(source.overcost.righe, level.id),
        phases,
      };
    });

    const banned = bannedOf(source.difficolta[0]!.restrizioni);
    for (const heroId of banned) link(heroId, { mode: "demon-king", kind: "banned" });

    // Le monete di tipo 26 e 27 (normali e collaborazione) valgono uguale: una riga per rarita'.
    const coinPoints: { rarity: string; points: number }[] = [];
    for (const row of source.punti_purgatorio.da_monete_eroe) {
      if (!coinPoints.some((known) => known.rarity === row.rarita_eroe)) coinPoints.push({ rarity: row.rarita_eroe, points: row.punti });
    }

    copyImage(source.immagini.demonlord_info_01, "re-demone/info.png");
    copyImage(source.link.icona, "modalita/demon-king.png");

    const index: DemonKingIndex = {
      name: label(source.nome),
      unlock: labelOrNull(source.sblocco.nome_quest),
      guide: [
        ...source.guida.regole.map(label),
        label(source.guida.energia_perniciosa),
        label(source.guida.verdetto.testo),
        label(source.guida.avvertenza),
      ],
      attempts: labelOrNull(source.tentativi.gratis),
      coinPoints,
      allyPassives: dict.passiveList(source.difficolta[0]!.passive_alleati),
      difficulties,
      exchange: source.scambio_cristalli.righe.map((row) => ({
        give: { id: dict.item(row.dai), count: Number(row.dai.quantita ?? 1) },
        choices: row.ricevi_uno_fra.map((item) => dict.item(item)),
        weekly: row.limite_settimanale,
      })),
      boxes: boxes(dict, source.casse),
      banned,
      ...dict.tables(),
    };
    writeGenerated(
      "demon-king.generated.ts",
      `La Battaglia del Re Demone di Grand Cross.

FONTE: il client, via python script/re_demone_divinita.py (eroi/re_demone_divinita.json).
Quattro difficolta' in catena, due fasi ciascuna; le regole sono le 134 sequenze di
DB_demonlord_rule. Lo studio: RE_DEMONE_DIVINITA.md.`,
      "DEMON_KING",
      "DemonKingIndex",
      index,
    );
    written.push(
      `re demone: ${difficulties.length} difficolta', ` +
        `${difficulties.reduce((n, level) => n + level.phases.reduce((m, phase) => m + (phase.rules?.sequences.length ?? 0), 0), 0)} sequenze di regole, ` +
        `${banned.length} eroi esclusi`,
    );
  }

  /* ---- Divinita' Suprema ---- */
  {
    const source = bossesSource.divinita_suprema;
    const dict = new Dictionary(bossesSource);

    const group = (candidate: SrcDeityGroup): DeityGroup => {
      const imageKey = `divinita/${candidate.id}`;
      const image = copyImage(candidate.immagine_info, `${imageKey}.png`) ? String(candidate.id) : null;
      return {
        name: label(candidate.nome),
        description: labelOrNull(candidate.descrizione),
        image,
        strong: candidate.attributo_forte_contro?.codice ?? null,
        weak: candidate.attributo_debole_contro?.codice ?? null,
        skills: labelOrNull(candidate.abilita_efficaci),
        teamPassives: dict.passiveList(candidate.passive_squadra),
        foes: candidate.mostri.map((foe) =>
          dict.foe(foe.monster_id, foe.livello, candidate.moltiplicatori_percento, foe.stat_stimate, foe.passive_posizione),
        ),
      };
    };

    const difficulties: SupremeDeityDifficulty[] = source.difficolta.map((level) => {
      const thresholds = level.magia.soglie_finale;
      if (level.editti.per_livello_di_magia.length !== thresholds.length) {
        fail("gli Editti della Divinita' non hanno un gruppo per ogni soglia di magia");
      }
      return {
        ...coloredName(level.difficolta),
        level: level.livello_difficolta,
        energy: level.costo_energia.quantita,
        gold: level.oro,
        power: level.potenza.team_power,
        turns: level.giudizi[0]?.limite_turni ?? 0,
        modePassive: dict.passive(level.passiva_modalita?.id),
        heroPassives: dict.passiveList(level.passive_eroi),
        clear: dict.amounts(level.ricompense_completamento),
        drops: dict.drops(level.drop),
        points: points(source.overcost, level.id),
        magic: {
          perSurvivor: level.magia.aumento_per_nemico_sopravvissuto_percento,
          inherited: level.magia.statistiche_ereditate_percento,
        },
        judgments: level.giudizi.map((judgment) => {
          const [candidate] = judgment.candidati;
          if (!candidate || judgment.candidati.length !== 1) fail("un Giudizio con piu' di un gruppo fisso");
          return { name: label(judgment.nome), turns: judgment.limite_turni, group: group(candidate) };
        }),
        final: level.giudizio_finale.per_magia.map((step) => ({
          upTo: step.magia_fino_a_percento,
          groups: step.candidati.map(group),
        })),
        hidden:
          level.giudizio_nascosto && level.giudizio_nascosto.candidati.length > 0
            ? {
                opensBelow: level.giudizio_nascosto.si_apre_se_magia_sotto_percento,
                groups: level.giudizio_nascosto.candidati.map(group),
              }
            : null,
        edicts: level.editti.per_livello_di_magia.map((groupId, position) => ({
          upTo: thresholds[position]!,
          edicts: (level.editti.gruppi[String(groupId)] ?? []).map((edict) => label(edict.testo)),
        })),
      };
    });

    const banned = [...new Set(source.difficolta.flatMap((level) => bannedOf(level.restrizioni)))];
    for (const heroId of banned) link(heroId, { mode: "supreme-deity", kind: "banned" });

    const guide = source.guida;
    copyImage(source.immagini.loading_supreme_deity_01, "divinita/copertina.png");
    copyImage(source.immagini.icon_shortcut_SupremeDeity, "modalita/supreme-deity.png");

    const index: SupremeDeityIndex = {
      name: label(source.nome),
      unlock: labelOrNull(source.sblocco.nome_quest),
      guide: [
        { title: label(source.nome), texts: [label(guide.contenuto)] },
        ...[guide.punizione_celeste, guide.editti_e_maledizioni, guide.stigmate, guide.giudizi_nascosti].map((section) => ({
          title: label(section.titolo),
          texts: section.testi.map(label),
        })),
      ],
      attempts: labelOrNull(source.tentativi.gratis),
      curses: source.maledizioni.map((curse) => ({
        name: label(curse.nome),
        passive: dict.requirePassive(curse.passiva),
      })),
      stigmata: source.stigmate.map((entry) => ({
        slot: "special" as const,
        name: unquote(label(entry.abilita.nome)),
        ranks: [label(entry.abilita.testo)],
        kind: null,
        icon: dict.skillIcon(entry.abilita.icona),
      })),
      difficulties,
      boxes: boxes(dict, source.casse),
      banned,
      ...dict.tables(),
    };
    writeGenerated(
      "supreme-deity.generated.ts",
      `La Battaglia della Divinita' Suprema di Grand Cross.

FONTE: il client, via python script/re_demone_divinita.py (eroi/re_demone_divinita.json).
Tre difficolta'; ogni partita e' una serie di Giudizi, il finale scelto dalla magia
della Divinita', il nascosto (solo Inferno) con un Arcangelo. I campi della riga copiati
da Hraesvelgr non ci sono. Lo studio: RE_DEMONE_DIVINITA.md.`,
      "SUPREME_DEITY",
      "SupremeDeityIndex",
      index,
    );
    written.push(`divinita' suprema: ${difficulties.length} difficolta', ${Object.keys(dict.monsters).length} mostri, ${banned.length} eroi esclusi`);
  }
}

/* ------------------------------------------------------------ eroi -- */

const MODE_ORDER: readonly EndgameMode[] = ["death-match", "creature-nest", "demon-king", "supreme-deity"];
const heroRows = [...heroLinks.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([heroId, links]) => {
    const sorted = [...links].sort((a, b) => MODE_ORDER.indexOf(a.mode) - MODE_ORDER.indexOf(b.mode));
    return `  ${JSON.stringify(heroId)}: ${JSON.stringify(sorted)},`;
  });
writeFileSync(
  destData("endgame-heroes.generated.ts"),
  `/**
 * I legami fra gli eroi e le modalita' di fine gioco, per la scheda dell'eroe.
 *
 * GENERATO DA scripts/import-endgame.mts - NON MODIFICARE A MANO.
 *
 * Una passiva che vale solo in una modalita' (o contro un boss), una che li'
 * non si attiva, l'esclusione dalla squadra, la squadra IA di uno Scontro
 * finale, il «Sangue cattivo» di una bestia. Le reliquie no: la scheda le
 * mostra gia', con la bestia da cui si fabbricano.
 */

import type { EndgameHeroLink } from "../endgame-types";

export const ENDGAME_HEROES: Readonly<Record<string, readonly EndgameHeroLink[]>> = {
${heroRows.join("\n")}
};
`,
  "utf8",
);
written.push(`legami con gli eroi: ${heroRows.length} eroi`);

for (const line of written) console.log(`  ${line}`);
console.log(`  immagini: ${imagesCopied} copiate in public/eroi/${GAME}/endgame/`);
if (imagesMissing.size > 0) {
  console.log(`  immagini che la pipeline cita e non ci sono (${imagesMissing.size}): ${[...imagesMissing].slice(0, 12).join(", ")}`);
}
console.log("");
