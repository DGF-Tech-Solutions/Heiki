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
  const registered = new Set(listGameModules().map((module) => module.slug));
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

/** Sezioni dentro un gioco. L'ordine e' quello della barra di navigazione. */
export const GAME_SECTIONS: readonly { path: string; label: string }[] = [
  { path: "", label: "Community" },
  { path: "/personaggi", label: "Personaggi" },
  { path: "/classifica", label: "Classifica" },
  { path: "/strumenti", label: "Strumenti" },
];
