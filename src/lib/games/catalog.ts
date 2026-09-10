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
 * Qui i gruppi sono tre, non cinque, e non e' una svista: "Guide" ed "Endgame"
 * esisteranno quando avranno contenuto. Un gruppo vuoto in navigazione promette
 * qualcosa che non c'e', e chi ci clicca una volta non ci clicca piu'.
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
  needs?: "roster";
}

export interface GameSectionGroup {
  label: string;
  items: readonly GameSection[];
}

export const GAME_GROUPS: readonly GameSectionGroup[] = [
  {
    label: "Database",
    items: [
      { path: "/eroi", label: "Eroi", hint: "Roster completo, per rarita' e attributo", needs: "roster" },
      { path: "/personaggi", label: "Personaggi", hint: "Statistiche, abilita' e danno simulato" },
      { path: "/nemici", label: "Nemici", hint: "Bersagli usati nei calcoli" },
    ],
  },
  {
    label: "Strumenti",
    items: [
      { path: "/strumenti", label: "Simulatore squadra", hint: "Componi e calcola" },
      { path: "/classifica", label: "Classifica danno", hint: "Ordinata dal motore, non a giudizio" },
    ],
  },
  {
    label: "Community",
    items: [{ path: "", label: "Discussioni", hint: "Build e rotazioni condivise" }],
  },
];

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
export function gameGroups(slug: string): GameSectionGroup[] {
  const gameModule = getGameModule(slug);

  return GAME_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.needs === undefined || gameModule?.[item.needs]),
  })).filter((group) => group.items.length > 0);
}
