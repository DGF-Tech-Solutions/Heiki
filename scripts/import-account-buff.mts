/**
 * Importazione dei buff dell'account di Grand Cross: classe di combattimento
 * dell'account, costellazioni, regole della classe di un eroe.
 *
 *   npm run buff:import      (lo lancia anche npm run eroi:import, dopo gli artefatti)
 *
 * Legge dalla pipeline di estrazione (fuori dal repo, dentro _7dsgc):
 *
 *   eroi/buff_account.json   python script/buff_account.py
 *   buff_account/            gli 11 simboli delle costellazioni e le icone (PNG)
 *
 * e scrive:
 *
 *   src/lib/games/grand-cross/account-buff.generated.ts
 *   public/eroi/grand-cross/buff-account/                immagini, NON versionate
 *
 * Si ferma se un riferimento non torna: una pietra con una statistica che il
 * sito non conosce, una madre in un'altra costellazione, una pietra del mana
 * senza il suo gruppo, soglie fuori ordine. Se il JSON manca non tocca niente.
 */

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  AccountBuffIndex,
  AccountPowerTier,
  AccountStatInfo,
  AccountStatKey,
  Constellation,
  ConstellationStone,
  ManaGroup,
  StoneColor,
  StoneKind,
} from "../src/lib/games/account-buff-types";
import type { HeroLabel } from "../src/lib/games/types";

const SOURCE = process.env.GC_ASSETS ?? "C:/Users/franc/Desktop/All/Ougi/Video/GC/_7dsgc";
const GAME = "grand-cross";
const ROOT = process.cwd();
const SOURCE_JSON = resolve(SOURCE, "eroi/buff_account.json");
const SOURCE_IMAGES = resolve(SOURCE, "buff_account");
const DEST_IMAGES = resolve(ROOT, "public/eroi", GAME, "buff-account");
const DEST_DATA = resolve(ROOT, "src/lib/games", GAME, "account-buff.generated.ts");

function fail(message: string): never {
  console.error(`\n  ERRORE: ${message}`);
  process.exit(1);
}

/* ------------------------------------------------------ forma della fonte -- */

interface SrcLabel {
  it?: string | null;
  en?: string | null;
}

interface SrcStone {
  id: number;
  tipo: "partenza" | "pietra" | "mana";
  madre: number | null;
  statistica: string | null;
  valore: number | null;
  gruppo_mana: number | null;
  punti_crescita: number;
  colore: "rosso" | "blu" | "verde" | null;
  x: number;
  y: number;
}

interface Src {
  nomi: Record<string, SrcLabel | Record<string, SrcLabel> | null>;
  testi: Record<string, SrcLabel | null>;
  statistiche: Record<string, { tipo: number; chiave: string; nome: SrcLabel | null; descrizione: SrcLabel | null; percentuale: boolean }>;
  classe_eroe: {
    pesi: Record<string, number>;
    passiva_unica: number;
    per_livello_ultimate: number;
    legame: number;
    vero_risveglio: number;
  };
  classe_account: {
    soglie: {
      soglia: number;
      titolo: SrcLabel | null;
      attacco: number;
      difesa: number;
      ps: number;
      punti_crescita: number;
      testo_dice?: { testo: SrcLabel | null };
    }[];
  };
  costellazioni: {
    id: number;
    tema: number;
    nome: SrcLabel | null;
    nome_breve: SrcLabel | null;
    simbolo: string | null;
    dopo: number | null;
    completamento: { attacco: number; difesa: number; ps: number };
    punti_crescita: number;
    caos: { apre_il_caos_di: number[]; blocco: { massimo: number; costo: number[] } };
    pietre: SrcStone[];
  }[];
  pietre_del_mana: Record<string, { statistica: string; fasce: { minimo: number; massimo: number; probabilita: number[] }[] }>;
  regole: { eroi_per_aprire: number };
}

/* --------------------------------------------------------------- testi -- */

function clean(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const text = value.replaceAll("\uFEFF", "").trim();
  return text === "" || text === "NONE_DB" ? null : text;
}

function labelOrNull(value: SrcLabel | null | undefined): HeroLabel | null {
  const out = { it: clean(value?.it), en: clean(value?.en) };
  return out.it || out.en ? out : null;
}

function required(value: unknown, what: string): HeroLabel {
  const out = labelOrNull(value as SrcLabel | null);
  if (!out) fail(`${what}: nessun testo in nessuna lingua`);
  return out;
}

/* -------------------------------------------------------------- inizio -- */

console.log("\n  Buff dell'account: classe dell'account e costellazioni");
if (!existsSync(SOURCE_JSON)) {
  console.log(`  ${SOURCE_JSON} non trovato: salto i buff dell'account. (si genera con: python script/buff_account.py, dentro _7dsgc)\n`);
  process.exit(0);
}
const source = JSON.parse(readFileSync(SOURCE_JSON, "utf8")) as Src;

rmSync(DEST_IMAGES, { recursive: true, force: true });
const copied = new Set<string>();
for (const folder of ["simboli", "icone"]) {
  const from = resolve(SOURCE_IMAGES, folder);
  if (!existsSync(from)) continue;
  mkdirSync(resolve(DEST_IMAGES, folder), { recursive: true });
  for (const file of readdirSync(from)) {
    // su Windows la copia di tanti file piccoli fallisce ogni tanto: un secondo tentativo passa
    for (let attempt = 0; ; attempt++) {
      try {
        copyFileSync(resolve(from, file), resolve(DEST_IMAGES, folder, file));
        break;
      } catch (error) {
        if (attempt >= 2) throw error;
      }
    }
    copied.add(`${folder}/${file}`);
  }
}

/* --------------------------------------------------------- statistiche -- */

const KEYS: ReadonlySet<string> = new Set<AccountStatKey>([
  "atk", "fixedAtkPer", "def", "fixedDefPer", "critPer", "critAtkPer", "critResPer", "critDefPer",
  "hp", "hpRecoveryPer", "hpRegenPer", "hpStealPer", "dmgRes", "dmgInc",
]);

/** dal nome del client (CRIT_PER) alla chiave del sito (critPer) */
const keyOf = new Map<string, AccountStatKey>();
for (const [name, stat] of Object.entries(source.statistiche)) {
  if (!KEYS.has(stat.chiave)) fail(`statistica ${name}: chiave ${stat.chiave} sconosciuta al sito`);
  keyOf.set(name, stat.chiave as AccountStatKey);
}
function statKey(name: string | null, what: string): AccountStatKey {
  const key = name ? keyOf.get(name) : undefined;
  if (!key) fail(`${what}: statistica ${name} sconosciuta`);
  return key;
}

const weights: Partial<Record<AccountStatKey, number>> = {};
for (const [name, weight] of Object.entries(source.classe_eroe.pesi)) weights[statKey(name, "peso della classe")] = weight;

// l'ordine della schermata delle statistiche del gioco: UI_skin_stat_1..15
const ORDER: readonly AccountStatKey[] = [
  "atk", "def", "hp", "critPer", "critAtkPer", "fixedAtkPer", "critResPer", "critDefPer", "fixedDefPer",
  "hpRecoveryPer", "hpStealPer", "hpRegenPer", "dmgRes", "dmgInc",
];
const byKey = new Map(Object.values(source.statistiche).map((stat) => [stat.chiave, stat]));
const stats: AccountStatInfo[] = ORDER.map((key) => {
  const stat = byKey.get(key) ?? fail(`statistica ${key}: manca nel JSON`);
  return {
    key,
    name: required(stat.nome, `nome della statistica ${key}`),
    description: labelOrNull(stat.descrizione),
    percent: stat.percentuale,
    weight: weights[key] ?? 0,
  };
});

/* ------------------------------------------------------ classe dell'account -- */

let previous = -1;
const tiers: AccountPowerTier[] = source.classe_account.soglie.map((tier) => {
  if (tier.soglia <= previous) fail(`classe dell'account: soglia ${tier.soglia} fuori ordine`);
  previous = tier.soglia;
  return {
    threshold: tier.soglia,
    title: required(tier.titolo, `titolo della soglia ${tier.soglia}`),
    atk: tier.attacco,
    def: tier.difesa,
    hp: tier.ps,
    growthPoints: tier.punti_crescita,
    textSays: tier.testo_dice ? labelOrNull(tier.testo_dice.testo) : null,
  };
});

/* ---------------------------------------------------------- costellazioni -- */

const mana: Record<string, ManaGroup> = {};
for (const [id, group] of Object.entries(source.pietre_del_mana)) {
  for (const tier of group.fasce) {
    if (tier.probabilita.length !== 20) fail(`pietre del mana ${id}: ${tier.probabilita.length} livelli del Caos, attesi 20`);
    if (tier.minimo > tier.massimo) fail(`pietre del mana ${id}: fascia ${tier.minimo}-${tier.massimo}`);
  }
  mana[id] = {
    stat: statKey(group.statistica, `pietre del mana ${id}`),
    tiers: group.fasce.map((tier) => ({ min: tier.minimo, max: tier.massimo, rates: tier.probabilita })),
  };
}

const KINDS: Record<SrcStone["tipo"], StoneKind> = { partenza: "start", pietra: "stone", mana: "mana" };
const COLORS: Record<string, StoneColor> = { rosso: "red", blu: "blue", verde: "green" };

const constellations: Constellation[] = source.costellazioni.map((c) => {
  const ids = new Set(c.pietre.map((stone) => stone.id));
  const stones: ConstellationStone[] = c.pietre.map((stone) => {
    const what = `costellazione ${c.id}, pietra ${stone.id}`;
    const kind = KINDS[stone.tipo] ?? fail(`${what}: tipo ${stone.tipo}`);
    if (kind !== "start" && (stone.madre === null || !ids.has(stone.madre))) fail(`${what}: la madre ${stone.madre} non e' qui`);
    if (kind === "mana" && !mana[String(stone.gruppo_mana)]) fail(`${what}: gruppo del mana ${stone.gruppo_mana} sconosciuto`);
    if (kind === "stone" && stone.valore === null) fail(`${what}: pietra senza valore`);
    return {
      id: stone.id,
      kind,
      mother: kind === "start" ? null : stone.madre,
      stat: kind === "start" ? null : statKey(stone.statistica, what),
      value: kind === "stone" ? stone.valore : null,
      mana: kind === "mana" ? String(stone.gruppo_mana) : null,
      growthPoints: stone.punti_crescita,
      color: stone.colore ? (COLORS[stone.colore] ?? null) : null,
      x: stone.x,
      y: stone.y,
    };
  });
  if (stones.filter((stone) => stone.kind === "start").length !== 1) fail(`costellazione ${c.id}: le partenze non sono una`);
  if (c.tema !== 1 && c.tema !== 2) fail(`costellazione ${c.id}: tema ${c.tema}`);
  return {
    id: c.id,
    theme: c.tema,
    name: required(c.nome, `costellazione ${c.id}`),
    shortName: required(c.nome_breve, `nome breve della costellazione ${c.id}`),
    symbol: c.simbolo !== null && copied.has(`simboli/${c.simbolo}`),
    after: c.dopo,
    completion: { atk: c.completamento.attacco, def: c.completamento.difesa, hp: c.completamento.ps },
    growthPoints: c.punti_crescita,
    opensChaosOf: c.caos.apre_il_caos_di,
    lock: { max: c.caos.blocco.massimo, cost: c.caos.blocco.costo },
    stones,
  };
});
const constellationIds = new Set(constellations.map((c) => c.id));
for (const c of constellations) {
  if (c.after !== null && !constellationIds.has(c.after)) fail(`costellazione ${c.id}: dopo ${c.after}, che non c'e'`);
}

/* ------------------------------------------------------------ scrittura -- */

const names = source.nomi as Record<string, unknown>;
const colorNames = (value: unknown, what: string) => {
  const map = value as Record<string, SrcLabel>;
  return {
    red: required(map?.rosso, `${what} rossa`),
    blue: required(map?.blu, `${what} blu`),
    green: required(map?.verde, `${what} verde`),
  };
};

// l'impronta dei dati che una scelta pietra per pietra deve ritrovare uguali: solo
// quello che cambia i totali (pietre, bonus, pietre del mana), non nomi e posizioni,
// se no un nome corretto renderebbe «vecchie» tutte le scelte salvate
const version = createHash("sha1")
  .update(
    JSON.stringify({
      constellations: constellations.map((c) => ({
        id: c.id,
        completion: c.completion,
        stones: c.stones.map(({ id, kind, mother, stat, value, mana: group }) => [id, kind, mother, stat, value, group]),
      })),
      mana,
    }),
  )
  .digest("hex")
  .slice(0, 12);

const index: AccountBuffIndex = {
  version,
  names: {
    page: required(names.pagina, "nome della pagina"),
    powerBuff: required(names.buff_classe, "nome del buff della classe"),
    accountPower: required(names.classe_account, "nome della classe dell'account"),
    sevenSins: required(names.sette_costellazioni, "nome delle Sette Costellazioni"),
    fourKnights: required(names.quattro_cavalieri, "nome delle costellazioni dei Cavalieri"),
    constellationBuff: required(names.buff_costellazione, "nome del buff delle costellazioni"),
    stone: required(names.pietra, "nome della pietra"),
    manaStone: required(names.pietra_mana, "nome della pietra del mana"),
    stones: colorNames(names.pietre, "pietra"),
    manaStones: colorNames(names.pietre_mana, "pietra del mana"),
    chaos: required(names.caos, "nome del Caos"),
    growthPoints: required(names.punti_crescita, "nome dei Punti Crescita"),
    completion: required(names.completamento, "nome del bonus di completamento"),
  },
  texts: {
    powerRule: labelOrNull(source.testi.regola_classe),
    heroPower: labelOrNull(source.testi.classe_eroe),
    guide: labelOrNull(source.testi.guida_costellazioni),
    growthPoints: labelOrNull(source.testi.punti_crescita),
    unlock: labelOrNull(source.testi.sblocco),
    fourKnights: labelOrNull(source.testi.cavalieri),
    inOrder: labelOrNull(source.testi.in_ordine),
    chaos: ["caos", "caos_tipo", "caos_bloccate", "caos_ricarica"]
      .map((key) => labelOrNull(source.testi[key]))
      .filter((text): text is HeroLabel => text !== null),
    rates: labelOrNull(source.testi.tassi),
  },
  stats,
  heroPower: {
    weights,
    uniquePassive: source.classe_eroe.passiva_unica,
    perUltimateRank: source.classe_eroe.per_livello_ultimate,
    bond: source.classe_eroe.legame,
    trueAwakening: source.classe_eroe.vero_risveglio,
  },
  accountPower: { tiers },
  constellations,
  mana,
  rules: { heroesToOpen: source.regole.eroi_per_aprire },
  icons: [...copied].filter((file) => file.startsWith("icone/")).map((file) => file.slice("icone/".length, -".png".length)).sort(),
};

/** Una pietra per riga: dopo una patch il diff dice quale e' cambiata. */
const body = [
  ...Object.entries(index)
    .filter(([key]) => key !== "constellations" && key !== "accountPower")
    .map(([key, value]) => ` ${key}: ${JSON.stringify(value)},`),
  ` accountPower: {\n  tiers: [\n${index.accountPower.tiers.map((tier) => `   ${JSON.stringify(tier)},`).join("\n")}\n  ],\n },`,
  ` constellations: [\n${index.constellations
    .map(({ stones, ...rest }) => {
      const head = JSON.stringify(rest).slice(0, -1);
      return `  ${head},"stones":[\n${stones.map((stone) => `   ${JSON.stringify(stone)},`).join("\n")}\n  ]},`;
    })
    .join("\n")}\n ],`,
].join("\n");

writeFileSync(
  DEST_DATA,
  `/**
 * I buff dell'account di Grand Cross: la classe di combattimento dell'account
 * (le soglie e i buff dei loro titoli), le undici costellazioni pietra per pietra
 * con le posizioni della mappa del gioco, le pietre del mana, e le regole della
 * classe di combattimento di un eroe.
 *
 * FONTE: il client, via python script/buff_account.py (eroi/buff_account.json):
 * DB_constellation_*, DB_const_manastone_random, DB_mission_play_title*,
 * DB_skill_passive, DB_config_game, DB_skin_exceed; le posizioni dai prefab delle
 * mappe. Come si sommano l'ha letto la pipeline nel codice del client
 * (BUFF_ACCOUNT.md): i titoli in percentuale prima delle passive, le costellazioni
 * dopo, e nessuno dei due nella classe dell'eroe.
 *
 * GENERATO DA scripts/import-account-buff.mts - NON MODIFICARE A MANO.
 */

import type { AccountBuffIndex } from "../account-buff-types";

export const ACCOUNT_BUFF: AccountBuffIndex = {
${body}
};
`,
  "utf8",
);

const stones = constellations.reduce((sum, c) => sum + c.stones.length, 0);
console.log(`  soglie della classe dell'account: ${tiers.length}, in cima ${tiers.at(-1)?.threshold}`);
console.log(`  costellazioni: ${constellations.length}, pietre: ${stones}, gruppi del mana: ${Object.keys(mana).length}`);
console.log(`  impronta dei dati: ${version}`);
console.log(`  immagini: ${copied.size} copiate in public/eroi/${GAME}/buff-account/\n`);
