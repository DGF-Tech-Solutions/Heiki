/**
 * Catalogo dei giochi.
 *
 * Il sito e' partizionato per gioco, come HoYoLAB: scegli il gioco in alto e
 * cambia il contesto di tutto il resto. Questo file e' l'elenco dei giochi
 * previsti; quali siano davvero utilizzabili lo decide il registro dei moduli,
 * non una bandierina scritta a mano.
 *
 * I giochi non ancora pronti restano ELENCATI e marcati "in arrivo". Nasconderli
 * darebbe l'impressione di un sito monogioco; mostrarli come funzionanti sarebbe
 * una bugia. Dichiarare il piano e' l'unica opzione onesta delle tre.
 */

import type { Bilingual, Locale } from "@/lib/i18n/locale";
import { getGameModule, listGameModules } from "./registry";

export interface GameEntry {
  slug: string;
  /** nome per esteso, per titoli e metadati */
  name: string;
  /** nome corto per la navigazione, dove lo spazio e' poco */
  shortName: string;
  publisher: string;
  /** true = esiste un modulo registrato e il gioco e' navigabile */
  available: boolean;
}

interface PlannedGame {
  slug: string;
  name: string;
  shortName: string;
  publisher: string;
}

const PLANNED: readonly PlannedGame[] = [
  {
    slug: "grand-cross",
    name: "The Seven Deadly Sins: Grand Cross",
    shortName: "Grand Cross",
    publisher: "Netmarble",
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    shortName: "Genshin",
    publisher: "HoYoverse",
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai: Star Rail",
    shortName: "Star Rail",
    publisher: "HoYoverse",
  },
  {
    slug: "zenless-zone-zero",
    name: "Zenless Zone Zero",
    shortName: "Zenless",
    publisher: "HoYoverse",
  },
  {
    slug: "wuthering-waves",
    name: "Wuthering Waves",
    shortName: "Wuthering",
    publisher: "Kuro Games",
  },
];

export function listGames(): GameEntry[] {
  const registered = new Set(listGameModules().map((gameModule) => gameModule.slug));
  return PLANNED.map((game) => ({ ...game, available: registered.has(game.slug) }));
}

export function findGame(slug: string): GameEntry | undefined {
  return listGames().find((game) => game.slug === slug);
}

/** Un gioco elencato ma senza modulo non ha pagine: e' solo un annuncio. */
export function isPlayable(slug: string): boolean {
  return getGameModule(slug) !== undefined;
}

/** Il gioco su cui atterra chi non ne ha scelto uno. */
export function defaultGameSlug(): string {
  const first = listGames().find((game) => game.available);
  return first?.slug ?? PLANNED[0]!.slug;
}

/**
 * Sezioni dentro un gioco, raggruppate.
 *
 * La forma ricalca i siti di riferimento del settore: una barra laterale con
 * gruppi, non una fila di voci in alto. Regge la crescita - un gruppo si allunga
 * senza che la navigazione debba essere ripensata - ed e' il motivo per cui
 * Prydwen la usa con cinque gruppi.
 *
 * "Endgame" e' entrato il 26/09, quando ha avuto contenuto: Scontri finali,
 * Bestie demoniache, Re Demone e Divinita' Suprema. Prima non c'era apposta: un
 * gruppo vuoto in navigazione promette qualcosa che non c'e', e chi ci clicca
 * una volta non ci clicca piu'. "Guide" e' entrato allo stesso modo, quando la
 * sezione ha avuto pagine da mostrare.
 */
export interface GameSection {
  path: string;
  label: string;
  /** descrizione breve, mostrata come titolo del collegamento */
  hint: string;
  /**
   * Contenuto del modulo senza il quale la sezione non ha niente da mostrare.
   *
   * Non tutti i giochi arrivano allo stesso punto: il roster di Grand Cross e'
   * costato l'estrazione degli asset dal client, e per gli altri non esiste
   * ancora. Dichiararlo qui evita l'alternativa peggiore, cioe' una voce di
   * menu che porta a una pagina vuota.
   */
  needs?:
    | "roster"
    | "releases"
    | "artifacts"
    | "accountBuff"
    | "deathMatch"
    | "creatureNest"
    | "demonKing"
    | "supremeDeity";
}

export interface GameSectionGroup {
  label: string;
  items: readonly GameSection[];
}

interface SectionNames extends Omit<GameSection, "label" | "hint"> {
  label: Bilingual;
  hint: Bilingual;
}

/** Le sezioni con i nomi nelle due lingue: le risolve `sections(locale)`. */
const GROUPS: readonly { label: Bilingual; items: readonly SectionNames[] }[] = [
  {
    label: { it: "Database", en: "Database" },
    items: [
      {
        path: "/eroi",
        label: { it: "Eroi", en: "Heroes" },
        hint: { it: "Roster completo, per rarità e attributo", en: "Full roster, by rarity and attribute" },
        needs: "roster",
      },
      {
        path: "/uscite",
        label: { it: "Uscite", en: "Releases" },
        hint: {
          it: "Banner, date, eroi ed eventi, aggiornamento per aggiornamento",
          en: "Banners, dates, heroes and events, update by update",
        },
        needs: "releases",
      },
      {
        path: "/set-artefatto",
        label: { it: "Set artefatto", en: "Artifact Sets" },
        hint: {
          it: "I set bonus: carte, effetto livello per livello, potenziamento",
          en: "The set bonuses: cards, effect level by level, enhancement",
        },
        needs: "artifacts",
      },
      {
        path: "/carte-artefatto",
        label: { it: "Carte artefatto", en: "Artifact Cards" },
        hint: {
          it: "Le carte: statistiche, set e pacchetti da cui si trovano",
          en: "The cards: stats, sets and the packs they come from",
        },
        needs: "artifacts",
      },
      {
        path: "/buff-account",
        label: { it: "Buff dell'account", en: "Account Buffs" },
        hint: {
          it: "Classe di combattimento dell'account e costellazioni, pietra per pietra",
          en: "Account Combat Class and constellations, stone by stone",
        },
        needs: "accountBuff",
      },
      {
        path: "/personaggi",
        label: { it: "Personaggi", en: "Characters" },
        hint: { it: "Statistiche, abilità e danno simulato", en: "Stats, skills and simulated damage" },
      },
      {
        path: "/nemici",
        label: { it: "Nemici", en: "Enemies" },
        hint: { it: "Bersagli usati nei calcoli", en: "Targets used in the calculations" },
      },
    ],
  },
  {
    label: { it: "Endgame", en: "Endgame" },
    items: [
      {
        path: "/scontri-finali",
        label: { it: "Scontri finali", en: "Death Match" },
        hint: {
          it: "I boss che invadono i villaggi: fasi, abilità, restrizioni e ricompense",
          en: "The bosses that invade the villages: phases, skills, restrictions and rewards",
        },
        needs: "deathMatch",
      },
      {
        path: "/bestie-demoniache",
        label: { it: "Bestie demoniache", en: "Demonic Beasts" },
        hint: {
          it: "Le sei bestie della Creature Nest, piano per piano",
          en: "The six Creature Nest beasts, floor by floor",
        },
        needs: "creatureNest",
      },
      {
        path: "/re-demone",
        label: { it: "Re Demone", en: "Demon King" },
        hint: {
          it: "Le regole, il Verdetto e le quattro difficoltà",
          en: "The rules, the Verdict and the four difficulties",
        },
        needs: "demonKing",
      },
      {
        path: "/divinita-suprema",
        label: { it: "Divinità Suprema", en: "Supreme Deity" },
        hint: {
          it: "Giudizi, magia, Editti e Arcangeli",
          en: "Judgments, magic, Edicts and Archangels",
        },
        needs: "supremeDeity",
      },
    ],
  },
  {
    label: { it: "Strumenti", en: "Tools" },
    items: [
      {
        path: "/strumenti",
        label: { it: "Simulatore squadra", en: "Team simulator" },
        hint: { it: "Componi e calcola", en: "Build a team and calculate" },
      },
      {
        path: "/classifica",
        label: { it: "Classifica danno", en: "Damage ranking" },
        hint: { it: "Ordinata dal motore, non a giudizio", en: "Ordered by the engine, not by opinion" },
      },
    ],
  },
  {
    label: { it: "Guide", en: "Guides" },
    items: [
      {
        path: "/guide",
        label: { it: "Guide e rotazioni", en: "Guides and rotations" },
        hint: {
          it: "Con la patch in cui i numeri sono stati verificati",
          en: "With the patch in which the numbers were verified",
        },
      },
    ],
  },
  {
    label: { it: "Community", en: "Community" },
    items: [
      {
        path: "",
        label: { it: "Discussioni", en: "Discussions" },
        hint: { it: "Build e rotazioni condivise", en: "Shared builds and rotations" },
      },
    ],
  },
];

function sections(locale: Locale): GameSectionGroup[] {
  return GROUPS.map((group) => ({
    label: group.label[locale],
    items: group.items.map((item) => ({ ...item, label: item.label[locale], hint: item.hint[locale] })),
  }));
}

/** Le sezioni in italiano. Per chi non passa ancora la lingua: usa gameGroups. */
export const GAME_GROUPS: readonly GameSectionGroup[] = sections("it");

/** Tutte le sezioni in fila, per chi ha bisogno dell'elenco piatto. */
export const GAME_SECTIONS: readonly GameSection[] = GAME_GROUPS.flatMap((group) => group.items);

/**
 * Le sezioni di UN gioco: come GAME_GROUPS, ma senza quelle che il suo modulo
 * non puo' riempire.
 *
 * Va chiamata lato server e passata alla barra laterale gia' pronta. La
 * tentazione sarebbe farla risolvere alla barra stessa, che gia' conosce lo
 * slug; significherebbe pero' importare il registro dei moduli in un componente
 * client, e con esso il motore di calcolo e ogni dataset, dentro il bundle del
 * browser. Un elenco di voci non vale quel prezzo.
 */
export function gameGroups(slug: string, locale: Locale = "it"): GameSectionGroup[] {
  const gameModule = getGameModule(slug);

  return sections(locale).map((group) => ({
    ...group,
    items: group.items.filter((item) => item.needs === undefined || gameModule?.[item.needs]),
  })).filter((group) => group.items.length > 0);
}
