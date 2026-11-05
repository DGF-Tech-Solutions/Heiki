/**
 * I dati dell'anteprima accanto alla griglia Eroi (25/10).
 *
 * L'anteprima del 24/10 mostrava chi e' l'eroe (nome, attributo, rarita',
 * razza) e quattro righe della sua descrizione del gioco. La ricerca su altri
 * siti del genere (Prydwen, nikke.gg, GameWith, SchaleDB, StarRailStation) ha
 * mostrato cosa ci mettono quelli che funzionano: i dati che decidono il clic,
 * sempre negli stessi posti. Qui quelli che Heiki ha gia' dal client:
 *  - la classe di combattimento al massimo, senza equipaggiamento, come la
 *    calcola il gioco (SkinData.GetPower), e la posizione fra tutti gli eroi:
 *    «41.390, 12° su 377» si confronta, il numero da solo no
 *  - attacco, difesa e PS al massimo, con la loro posizione
 *  - quando e' uscito sul server globale
 *  - l'abilita' speciale (Comandamento, Grazia, Unita', Talento) e l'Unica, per nome
 *  - le righe del fine gioco (escluso, vale solo contro...)
 * Il voto della community sta nel database e arriva a parte
 * (getGameRatingOverview).
 *
 * Si calcola sul server, una volta per pagina, e al browser arriva nella lingua
 * della pagina: pochi numeri e nomi per eroe, non le schede.
 */

import { heroCombatClass } from "./account-buff";
import type { EndgameHeroLink, EndgameMode, EndgamePassiveSource } from "./endgame-types";
import { plainHeroText } from "./hero-markup";
import type { GameModule } from "./types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

/** un valore e la sua posizione fra gli eroi del gioco, 1 = il piu' alto */
export interface PeekStat {
  readonly value: number;
  readonly rank: number;
}

export interface PeekFacts {
  readonly cc?: PeekStat;
  readonly atk?: PeekStat;
  readonly def?: PeekStat;
  readonly hp?: PeekStat;
  /** uscita sul server globale, AAAA-MM-GG */
  readonly released?: string;
  /** il nome dell'Unica */
  readonly unique?: string;
  /**
   * L'abilita' speciale col suo tipo, gia' nella lingua della pagina: «Talento:
   * Lettura del cuore», o il nome solo quando dice gia' il tipo («Comandamento
   * della Verita'», «Grazia del Lampo»)
   */
  readonly special?: string;
  /** al massimo due righe brevi sul fine gioco */
  readonly endgame?: readonly string[];
}

export interface PeekIndex {
  /** su quanti eroi si contano le posizioni */
  readonly total: number;
  /** il valore piu' alto fra gli eroi del gioco: la barra di attacco, difesa e PS e' lunga quanto il valore su questo */
  readonly max: { readonly atk: number; readonly def: number; readonly hp: number };
  readonly facts: Readonly<Record<string, PeekFacts>>;
}

const TESTI = testi({
  it: {
    // [attiva solo, spenta], accordati con l'abilita' che si spegne
    abilita: {
      unique: ["Unica attiva solo", "Unica spenta"],
      relic: ["Reliquia attiva solo", "Reliquia spenta"],
      commandment: ["Comandamento attivo solo", "Comandamento spento"],
      grace: ["Grazia attiva solo", "Grazia spenta"],
      talent: ["Talento attivo solo", "Talento spento"],
      bond: ["Legame attivo solo", "Legame spento"],
    } as Record<EndgamePassiveSource, readonly [string, string]>,
    escluso: (dove: string) => `Escluso ${dove}`,
    squadraIa: (boss: string) => `Nella squadra IA contro ${boss}`,
    sangue: (bestia: string) => `Sangue cattivo di ${bestia}`,
    contro: (nome: string) => `contro ${nome}`,
    dove: {
      "death-match": "negli Scontri finali",
      "creature-nest": "contro le Bestie demoniache",
      "demon-king": "contro il Re Demone",
      "supreme-deity": "contro la Divinità Suprema",
    } as Record<EndgameMode, string>,
    da: {
      "death-match": "dagli Scontri finali",
      "creature-nest": "dalle Bestie demoniache",
      "demon-king": "dal Re Demone",
      "supreme-deity": "dalla Divinità Suprema",
    } as Record<EndgameMode, string>,
  },
  en: {
    abilita: {
      unique: ["Unique only works", "Unique off"],
      relic: ["Holy Relic only works", "Holy Relic off"],
      commandment: ["Commandment only works", "Commandment off"],
      grace: ["Grace only works", "Grace off"],
      talent: ["Talent only works", "Talent off"],
      bond: ["Bond only works", "Bond off"],
    } as Record<EndgamePassiveSource, readonly [string, string]>,
    escluso: (where: string) => `Banned ${where}`,
    squadraIa: (boss: string) => `In the AI team against ${boss}`,
    sangue: (beast: string) => `${beast}'s Bad Blood`,
    contro: (name: string) => `against ${name}`,
    dove: {
      "death-match": "in Death Match",
      "creature-nest": "against the Demonic Beasts",
      "demon-king": "against the Demon King",
      "supreme-deity": "against the Supreme Deity",
    } as Record<EndgameMode, string>,
    da: {
      "death-match": "from Death Match",
      "creature-nest": "from the Demonic Beasts",
      "demon-king": "from the Demon King",
      "supreme-deity": "from the Supreme Deity",
    } as Record<EndgameMode, string>,
  },
});

function endgameLine(link: EndgameHeroLink, locale: Locale): string {
  const t = TESTI[locale];
  const target = link.target ? plainHeroText(inLingua(link.target.name, locale) ?? "") : null;
  const where = target ? t.contro(target) : t.dove[link.mode];
  const [only, off] = t.abilita[link.source ?? "unique"];
  if (link.kind === "only") return `${only} ${where}`;
  if (link.kind === "excluded") return `${off} ${where}`;
  if (link.kind === "banned") return t.escluso(target ? t.contro(target) : t.da[link.mode]);
  if (link.kind === "ai-team") return t.squadraIa(target ?? "");
  return t.sangue(target ?? "");
}

/** Le posizioni di un valore fra tutti: a pari merito la stessa posizione (1, 2, 2, 4). */
function ranks(values: ReadonlyMap<string, number>): Map<string, number> {
  const sorted = [...values.values()].sort((a, b) => b - a);
  const firstIndex = new Map<number, number>();
  sorted.forEach((value, i) => {
    if (!firstIndex.has(value)) firstIndex.set(value, i + 1);
  });
  return new Map([...values].map(([id, value]) => [id, firstIndex.get(value) ?? sorted.length]));
}

export function peekFacts(gameModule: GameModule, locale: Locale): PeekIndex {
  const heroes = gameModule.roster?.heroes ?? [];
  const stats = gameModule.heroStats;
  const rules = gameModule.accountBuff?.heroPower;

  // classe di combattimento al massimo: ultimate al rango 6, Vero risveglio, senza equipaggiamento
  const values = { cc: new Map<string, number>(), atk: new Map<string, number>(), def: new Map<string, number>(), hp: new Map<string, number>() };
  for (const hero of heroes) {
    const max = stats?.[hero.id]?.max;
    if (!max) continue;
    if (rules) values.cc.set(hero.id, heroCombatClass(max, rules, { ultimateRank: 6, trueAwakening: true }));
    for (const key of ["atk", "def", "hp"] as const) {
      const value = max[key];
      if (typeof value === "number") values[key].set(hero.id, value);
    }
  }
  const positions = {
    cc: ranks(values.cc),
    atk: ranks(values.atk),
    def: ranks(values.def),
    hp: ranks(values.hp),
  };
  const stat = (key: keyof typeof values, id: string): PeekStat | undefined => {
    const value = values[key].get(id);
    const rank = positions[key].get(id);
    return value === undefined || rank === undefined ? undefined : { value, rank };
  };

  const facts: Record<string, PeekFacts> = {};
  for (const hero of heroes) {
    const passive = gameModule.heroAbilities?.[hero.id]?.passive;
    const unique = passive ? plainHeroText(inLingua(passive.nameI18n ?? null, locale) ?? passive.name ?? "") : "";

    const specialId = gameModule.heroSpecials?.heroes[hero.id]?.[0];
    const ability = specialId ? gameModule.heroSpecials?.abilities[specialId] : undefined;
    const kind = ability ? inLingua(gameModule.heroSpecials?.kinds[ability.kind]?.label ?? null, locale) : null;
    const specialName = ability ? plainHeroText(inLingua(ability.name, locale) ?? "") : "";
    // «Comandamenti dell'Amore...» dice gia' il tipo: basta la radice («Comand», «Grazia», «Unità», «Talent»)
    const saysKind = kind ? specialName.toLowerCase().includes(kind.toLowerCase().slice(0, 6)) : true;
    const special = specialName ? (saysKind ? specialName : `${kind}: ${specialName}`) : kind;

    // due modalita' possono dare la stessa riga («Unica spenta negli Scontri finali»): una volta sola
    const endgame = [...new Set((gameModule.endgameHeroes?.[hero.id] ?? []).map((link) => endgameLine(link, locale)))].slice(0, 2);

    facts[hero.id] = {
      cc: stat("cc", hero.id),
      atk: stat("atk", hero.id),
      def: stat("def", hero.id),
      hp: stat("hp", hero.id),
      released: gameModule.releases?.heroes[hero.id]?.global,
      unique: unique || undefined,
      special: special ?? undefined,
      endgame: endgame.length > 0 ? endgame : undefined,
    };
  }

  const highest = (map: ReadonlyMap<string, number>) => Math.max(0, ...map.values());
  return { total: heroes.length, max: { atk: highest(values.atk), def: highest(values.def), hp: highest(values.hp) }, facts };
}
