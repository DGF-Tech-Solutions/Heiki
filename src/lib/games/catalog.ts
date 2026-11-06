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
 * sezione ha avuto pagine da mostrare, e "Strumenti" il 27/09 col Randomizer
 * (c'era stato fino a quel giorno con le pagine del vecchio motore, tolte).
 */
export interface GameSection {
  /** il percorso dentro il gioco, /<gioco><path>: e' anche l'identificativo della voce */
  path: string;
  /**
   * L'indirizzo a cui porta la voce: /<gioco><path>, tranne le voci del profilo,
   * che portano alla parte di quel gioco del profilo del sito (/profilo/<gioco>,
   * dal 25/10). Chi disegna un collegamento usa questo, non `path`.
   */
  href: string;
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
    | "changes"
    | "artifacts"
    | "accountBuff"
    | "mechanics"
    | "birthdays"
    | "heroFates"
    | "team"
    | "deathMatch"
    | "creatureNest"
    | "demonKing"
    | "supremeDeity";
}

export interface GameSectionGroup {
  label: string;
  items: readonly GameSection[];
}

interface SectionNames extends Omit<GameSection, "label" | "hint" | "href"> {
  label: Bilingual;
  hint: Bilingual;
  /**
   * La voce sta nel profilo del sito: porta a /profilo/<gioco> seguito da questo
   * (25/10: «la scheda profilo dev'essere universale»). Nel menu del gioco resta
   * come scorciatoia, perche' dal gioco ci si arrivava da li'.
   */
  profile?: string;
}

/** Le sezioni con i nomi nelle due lingue: le risolve `sections(locale)`. */
const GROUPS: readonly { label: Bilingual; items: readonly SectionNames[] }[] = [
  // 24/10, dopo la revisione del design (scelta dell'utente fra due proposte):
  // sette gruppi raccolti per quello che ci fai, nello STESSO ordine ovunque
  // (barra laterale, menu del gioco, menu del telefono, pie' di pagina). Prima il
  // menu del gioco li rimescolava e nascondeva i nomi dei gruppi, cosi' la prima
  // voce di ogni gruppo sembrava il gruppo («Discussioni» sotto «Il mio
  // account»); e «Tu e la community» teneva insieme pagine tue e pagine di tutti,
  // «Strumenti» strumenti e giochi. Indovina l'eroe e Compleanni, che sono svago,
  // stanno in fondo. Dal 10/10: gruppi di quattro voci al massimo, e i buff
  // dell'account con gli artefatti, perche' sono la crescita dell'account.
  //
  // Dal 25/10 il gruppo «Il tuo account» si chiama «Il tuo profilo» e porta al
  // profilo del sito (/profilo/<gioco>, src/lib/profile/games.ts): account di
  // gioco e box non sono piu' pagine del gioco ma la parte di quel gioco di un
  // profilo unico per tutti i giochi. Qui restano come scorciatoia (`profile`).
  //
  // Dal 06/11 Set e Carte artefatto stanno nel Database (sono dati, non progressi), e
  // Cambiamenti e Guide non sono piu' nel menu: le pagine restano, ci si arriva per link.
  // Progressione e Community hanno una voce sola: l'utente pensa di aggiungerne.
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
        path: "/meccaniche",
        label: { it: "Meccaniche", en: "Mechanics" },
        hint: {
          it: "Danno, attributi, pesca delle carte e cumulo dei buff, come li calcola il gioco",
          en: "Damage, attributes, card draws and buff stacking, as the game computes them",
        },
        needs: "mechanics",
      },
    ],
  },
  {
    label: { it: "Strumenti", en: "Tools" },
    items: [
      {
        path: "/squadra",
        label: { it: "Squadra", en: "Team Builder" },
        hint: {
          it: "Forma una squadra e guarda come si influenzano gli eroi: Uniche, reliquie, abilità speciali, associati",
          en: "Build a team and see how the heroes affect each other: Uniques, relics, special abilities, associates",
        },
        needs: "team",
      },
      {
        path: "/tierlist",
        label: { it: "Tier list", en: "Tier list" },
        hint: {
          it: "Metti gli eroi in fasce, dalla S in giù, e salva o scarica la tua classifica",
          en: "Put the heroes in tiers, from S down, and save or download your ranking",
        },
        needs: "roster",
      },
      {
        path: "/randomizer",
        label: { it: "Randomizer", en: "Randomizer" },
        hint: {
          it: "Quattro eroi e i loro associati pescati a caso, anche con le Uniche in sinergia",
          en: "Four heroes and their associates drawn at random, also with their Uniques in synergy",
        },
        needs: "heroFates",
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
    label: { it: "Progressione", en: "Progression" },
    items: [
      {
        path: "/buff-account",
        label: { it: "Buff dell'account", en: "Account Buffs" },
        hint: {
          it: "Classe di combattimento dell'account e costellazioni, pietra per pietra",
          en: "Account Combat Class and constellations, stone by stone",
        },
        needs: "accountBuff",
      },
    ],
  },
  {
    label: { it: "Community", en: "Community" },
    items: [
      {
        // dal 10/10 il feed ha un indirizzo suo: /<gioco> e' l'ingresso del gioco
        path: "/discussioni",
        label: { it: "Discussioni", en: "Discussions" },
        hint: { it: "Build e rotazioni condivise", en: "Shared builds and rotations" },
      },
    ],
  },
  {
    label: { it: "Il tuo profilo", en: "Your profile" },
    items: [
      {
        path: "/account",
        profile: "",
        label: { it: "Account di gioco", en: "Game account" },
        hint: {
          it: "Nickname, Codice amico, classe dell'account e costellazioni, e la verifica della classe",
          en: "Nickname, Friend Code, Account Combat Class and constellations, and the class verification",
        },
        needs: "accountBuff",
      },
      {
        path: "/account/eroi",
        profile: "/eroi",
        label: { it: "I tuoi eroi", en: "Your heroes" },
        hint: {
          it: "Il tuo box: chi hai e a che punto è, per partire dai tuoi numeri nella scheda e nella Squadra",
          en: "Your box: who you have and how far along, to start from your numbers in the hero page and the Team Builder",
        },
        needs: "roster",
      },
    ],
  },
  {
    label: { it: "Extra", en: "Extras" },
    items: [
      {
        path: "/indovina",
        label: { it: "Indovina l'eroe", en: "Guess the Hero" },
        hint: {
          it: "Il gioco degli indizi, come Loldle: attributo, razza, caratteristiche, grado, uscita",
          en: "The clue game, like Loldle: attribute, race, characteristics, grade, release",
        },
        needs: "releases",
      },
      {
        path: "/compleanni",
        label: { it: "Compleanni", en: "Birthdays" },
        hint: {
          it: "Il compleanno di ogni eroe, chi festeggia oggi e il regalo che in taverna vale dieci volte l'Affetto",
          en: "Every hero's birthday, who is celebrating today and the gift that's worth ten times the Affection at the tavern",
        },
        needs: "birthdays",
      },
    ],
  },
];

function sections(locale: Locale, slug?: string): GameSectionGroup[] {
  return GROUPS.map((group) => ({
    label: group.label[locale],
    items: group.items.map(({ profile, ...item }) => ({
      ...item,
      // senza il gioco (GAME_GROUPS) l'indirizzo e' il solo percorso
      href: slug === undefined ? item.path : profile !== undefined ? `/profilo/${slug}${profile}` : `/${slug}${item.path}`,
      label: item.label[locale],
      hint: item.hint[locale],
    })),
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

  return sections(locale, slug).map((group) => ({
    ...group,
    items: group.items.filter((item) => item.needs === undefined || gameModule?.[item.needs]),
  })).filter((group) => group.items.length > 0);
}
