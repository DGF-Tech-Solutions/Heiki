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

/* ------------------------------------------------------- carte agli eroi -- */

/**
 * Quale carta e' di quale eroe: A, B e ultimate.
 *
 * Lo decide `python accosta_carte.py` nella pipeline, che lo scrive in
 * eroi/accostamenti_carte.json con la fonte di ogni scelta:
 *
 *   manuale            scelta a mano con rivedi_carte.py, guardando le carte
 *   wiki               il wiki cita il nome del file accanto alla carta
 *   cartella_propria   l'eroe e' l'unico della sua cartella: le prime due,
 *                      ordinate per id d'abilita'                        53/53
 *   ordine_uscita      le versioni per data d'uscita prendono le carte a
 *                      coppie consecutive                                55/57
 *   famiglia           l'ultimate con l'indice piu' basso della cartella 139/145
 *
 * Le misure sono contro gli accostamenti che il wiki dichiara. Qui non si
 * decide piu' niente: si copia, e la fonte arriva fino in pagina. Prima questa
 * sezione accostava da sola - per nome di carta dal wiki, e con "indice piu'
 * basso = carta A" all'84% - e arrivava a 478 carte su 746.
 */
interface SourceChoice {
  file: string;
  fonte: string;
}

interface CardSprite {
  n: number;
  source: string;
}

const choicesJson = resolve(SOURCE, "eroi/accostamenti_carte.json");
/** eroe -> slot "A"/"B" -> numero del file in carte/<id>/, e fonte */
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
      perSlot.set(slot, { n, source: choice.fonte });
    }
    if (perSlot.size > 0) cardSprites.set(hid, perSlot);
  }

  console.log(`  carte d'attacco: ${copied} copiate, per ${cardSprites.size} eroi`);
}

/* ---------------------------------------------- abilita' e statistiche -- */

/**
 * Carte, ultimate, passiva e statistiche dal database della pipeline.
 *
 * Lo produce `python costruisci_database.py`, che unisce due fonti perche'
 * nessuna delle due basta:
 *
 *   7dshub   QUALI abilita' ha l'eroe, e i valori risolti per ogni rango
 *   client   come si chiamano, in italiano dove il gioco l'ha tradotto
 *
 * Il legame fra eroe e abilita' non e' nel client - verificato anche cercando
 * le tabelle per percorso di progetto fra tutti i 262.420 asset: esistono sei
 * `db_*.csv`, tutti filtri di parolacce. E non si ricava dall'heroId, perche'
 * gli id delle abilita' sono una numerazione a se': Lancelot ha l'abilita'
 * 1005021 e l'heroId 1967502.
 *
 * Copre tutti e 373 gli eroi, dove il wiki si fermava a 167.
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
  passiva?: { nome?: SourceDbText; modello?: SourceDbText; livelli?: { testo_en?: string }[] };
  statistiche?: { max?: Record<string, number>; max_con_equipaggiamento?: Record<string, number> };
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
  let withStats = 0;
  let italianNames = 0;
  let pairedSprites = 0;
  const bySource: Record<string, number> = {};

  const renderCard = (card: SourceDbCard, hid: string): string | null => {
    // `clean` toglie le virgolette con cui il gioco decora i nomi delle carte -
    // sono le stesse che decorano gli epiteti, e sono della fonte, non del nome.
    const raw = pick(card.nome);
    const name = raw ? clean(raw) : undefined;
    if (!name) return null;
    const ranks = card.ranghi
      .filter((r) => r.testo_en)
      .map((r) => `{ rank: ${r.rango}, text: ${JSON.stringify(r.testo_en)} }`)
      .join(", ");
    if (!ranks) return null;
    // L'illustrazione si prende per SLOT dagli accostamenti. L'ultimate porta
    // solo la fonte: il suo file e' ultimate/<id>.png, e c'e' quando c'e'
    // `HeroAssets.ultimate`.
    const sprite = cardSprites.get(hid)?.get(card.tipo);
    const source = card.tipo === "ultimate" ? ultimateChoice.get(hid)?.fonte : sprite?.source;
    if (source) {
      pairedSprites++;
      bySource[source] = (bySource[source] ?? 0) + 1;
    }
    if (card.nome?.it) italianNames++;
    return (
      `{ name: ${JSON.stringify(name)}, slot: ${JSON.stringify(card.tipo)}` +
      (sprite ? `, sprite: ${sprite.n}` : "") +
      (source ? `, spriteSource: ${JSON.stringify(source)}` : "") +
      `, ranks: [${ranks}] }`
    );
  };

  for (const hero of heroes) {
    const hid = String(hero.heroId);
    const voce = db[hid];
    if (!voce) continue;

    const cards = voce.carte
      .filter((c) => c.tipo === "A" || c.tipo === "B")
      .map((c) => renderCard(c, hid))
      .filter((x): x is string => x !== null);

    const ultimateCard = voce.carte.find((c) => c.tipo === "ultimate");
    const ultimate = ultimateCard ? renderCard(ultimateCard, hid) : null;

    // La passiva: il nome viene dal client quando tradotto, il testo dalla
    // fonte inglese. `livelli` sono i gradi della passiva; il primo basta per
    // la scheda, gli altri restano nel database della pipeline.
    const passiveName = pick(voce.passiva?.nome);
    const passiveText = voce.passiva?.livelli?.[0]?.testo_en;

    if (cards.length === 0 && !ultimate && !passiveText) continue;

    const parts: string[] = [];
    parts.push(`    cards: [\n${cards.map((c) => `      ${c},`).join("\n")}\n    ],`);
    if (ultimate) parts.push(`    ultimate: ${ultimate},`);
    if (passiveText) {
      parts.push(
        `    passive: { name: ${JSON.stringify(passiveName ?? "")}, ` +
          `text: ${JSON.stringify(passiveText)} },`,
      );
    }
    parts.push(`    source: "7dshub.com",`);
    parts.push(`    textsInEnglish: true,`);
    abilityRows.push(`  ${JSON.stringify(hid)}: {\n${parts.join("\n")}\n  },`);

    if (cards.length > 0) withCards++;
    if (ultimate) withUltimate++;
    if (passiveText) withPassive++;

    const max = voce.statistiche?.max;
    const geared = voce.statistiche?.max_con_equipaggiamento;
    if (max && geared && Object.keys(max).length > 0) {
      statRows.push(
        `  ${JSON.stringify(hid)}: { max: ${JSON.stringify(max)}, ` +
          `maxGeared: ${JSON.stringify(geared)} },`,
      );
      withStats++;
    }
  }

  const generatedAbilities = `/**
 * Carte, ultimate e passive degli eroi di Grand Cross.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * DUE FONTI, e serve dirlo perche' danno garanzie diverse:
 *
 *   7dshub.com   quali abilita' ha l'eroe e cosa fanno a ogni rango
 *   il client    il nome della carta in italiano, dove il gioco l'ha tradotto
 *
 * I TESTI DEI RANGHI SONO IN INGLESE, e non per pigrizia: il client spedisce
 * 285 descrizioni di abilita' in tutto, e sono modelli - "damage equal to
 * {melee_val} of Attack" - che il server riempie. Provando a ricostruire
 * l'italiano sostituendo i valori nel modello si arriva a 377 ranghi su 4.812,
 * e con i valori ancora in inglese dentro la frase. Un italiano a meta' e'
 * peggio di un inglese dichiarato.
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
 * FONTE ESTERNA: 7dshub.com. Nel client non ci sono - le tiene il server del
 * gioco - e questo e' il dato che rende calibrabile il motore, oggi a
 * segnaposto in data.ts.
 *
 * Due colonne: l'eroe nudo e l'eroe equipaggiato. Mostrarne una sola
 * nasconderebbe quanto pesa l'equipaggiamento, che e' meta' del gioco.
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
      `${withPassive} con passiva`,
  );
  console.log(
    `  ${italianNames} nomi di carta in italiano; ${pairedSprites} carte con la propria illustrazione ` +
      `(${Object.entries(bySource).map(([fonte, n]) => `${fonte} ${n}`).join(", ")})`,
  );
  console.log(`  statistiche: ${withStats}/${heroes.length} eroi`);
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
      })},`,
    );
  }

  const generatedContext = `/**
 * Cosa vuol dire quello che ogni eroe fa.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * FONTE: il CLIENT, non 7dshub. Gli enum del gioco (TeamUnitData.Kind,
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

import type { HeroContext, HeroContextIndex, HeroEffect, HeroLabel } from "../types";

const GLOSSARY: Readonly<Record<string, HeroEffect>> = {
${glossaryRows.join("\n")}
};

const RACE: Readonly<Record<string, HeroLabel>> = ${JSON.stringify(ctx.codici.razza)};
const ATTRIBUTE: Readonly<Record<string, HeroLabel>> = ${JSON.stringify(ctx.codici.attributo)};
const FACTION: Readonly<Record<string, HeroLabel>> = ${JSON.stringify(ctx.codici.fazione)};

const HEROES: Readonly<Record<string, HeroContext>> = {
${heroRows.join("\n")}
};

export const HERO_CONTEXT: HeroContextIndex = {
  glossary: GLOSSARY,
  codes: { race: RACE, attribute: ATTRIBUTE, faction: FACTION },
  sources: ${JSON.stringify(ctx.fonti)},
  heroes: HEROES,
};
`;

  writeFileSync(DEST_CONTEXT, generatedContext, "utf8");
  console.log(
    `  contesto: ${heroRows.length}/${heroes.length} eroi, ${withEffects} con effetti, ` +
      `${withLr} che possono arrivare a LR`,
  );
  console.log(
    `  glossario: ${glossaryRows.length} voci, ` +
      `${Object.values(ctx.glossario).filter((v) => v.etichetta.it).length} con etichetta italiana`,
  );
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
      const rel = voce[kind.key];
      if (!rel) continue;
      const from = resolve(estratti, rel);
      if (!existsSync(from)) continue;
      if (copyIfNewer(from, resolve(DEST_IMAGES, kind.dir, `${hid}.png`))) copied[kind.dir]!++;
      flags.push(`${kind.key === "abilita" ? "skill" : "splash"}: true`);
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
 * `DBSkillCardBuffRow.icon`, che sta nelle tabelle cifrate: senza quella,
 * mettere un'icona accanto a un effetto vorrebbe dire indovinarla.
 */
const ICON_SOURCE = resolve(SOURCE, "7dsgc_estratti/m/Texture2D");

/**
 * La stella dei ranghi arriva da un'altra cartella, e c'e' un motivo.
 *
 * Non e' un file separato nel gioco: sta impacchettata dentro
 * `atlas_skillcard`, una texture unica, accanto a cornici e sfondi delle carte.
 * La ritaglia `python stella_carte.py`, per nome (`card_star`) e con la mappa
 * NGUI dell'atlas. Il lavoro di immagini sta nella pipeline perche' in questo
 * progetto lo fa Python: qui si copia e basta, come per le card.
 *
 * Prima qui arrivavano le cornici di bronzo, argento e oro, allungate per
 * stare attorno all'illustrazione: scartate, le stelle dicono il rango senza
 * ridisegnare la carta.
 */
const STAR_SOURCE = resolve(SOURCE, "stella_carte");

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
 * Sotto \`carta\` c'e' la stella dei ranghi, una sola: il rango la ripete.
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
