/**
 * Dai riferimenti dei preferiti (`grand-cross:1575001`) a quello che il profilo
 * mostra: le card degli eroi e il palco dell'eroe in copertina.
 *
 * Gira in due posti, ed e' il motivo per cui sta qui e non nel caricamento del
 * profilo: sul server per chi guarda la pagina, e nel browser per l'anteprima
 * dell'editor, che deve cambiare copertina appena si sposta un preferito in
 * cima. Una funzione sola, cosi' l'anteprima e' la pagina vera.
 *
 * Il roster arriva come `PickableGame`, gia' preparato sul server
 * (`pickableGames` in load.ts): nel browser il registro dei giochi non si
 * carica, e al browser arriva solo chi puo' modificare il profilo.
 */

import { DEFAULT_FIGURE, DEFAULT_STAGE_ART, type StageArt } from "@/components/heroes/hero-stage";
import { heroEpithet, heroName } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import type { Locale } from "@/lib/i18n/locale";
import { parseFavorite } from "./favorites";

/**
 * Gli eroi di un gioco che si possono scegliere, con quanto serve al palco.
 *
 * Il palco vuole volto e cima della sagoma di ogni eroe: come nella griglia
 * Eroi (`[game]/eroi/page.tsx`) arrivano le figure di tutti, e solo per le
 * eccezioni il tipo d'illustrazione e la mancanza del cut-in. Non l'elenco
 * degli asset, che e' cinque volte piu' grande.
 */
export interface PickableGame {
  /** lo slug, come negli indirizzi */
  readonly game: string;
  readonly name: string;
  /** nell'ordine del roster: per Grand Cross dal piu' recente */
  readonly heroes: readonly HeroEntry[];
  readonly figures: Readonly<Record<string, StageArt["figure"]>>;
  /** solo gli eroi senza illustrazione scontornata */
  readonly art: Readonly<Record<string, StageArt["art"]>>;
  readonly withoutCutIn: readonly string[];
}

/** Un preferito com'e' in pagina: nome ed epiteto gia' nella lingua di chi legge. */
export interface ProfileFavoriteHero {
  /** il riferimento salvato, `<gioco>:<id>` */
  readonly key: string;
  readonly game: string;
  readonly id: string;
  readonly name: string;
  readonly epithet: string;
  readonly href: string;
}

/** L'eroe in copertina: quanto serve a HeroStage. */
export interface ProfileCover {
  readonly game: string;
  readonly hero: HeroEntry;
  readonly art: StageArt;
}

export function stageArtFor(game: PickableGame, heroId: string): StageArt {
  return {
    art: game.art[heroId] ?? DEFAULT_STAGE_ART.art,
    figure: game.figures[heroId] ?? DEFAULT_FIGURE,
    cutIn: !game.withoutCutIn.includes(heroId),
  };
}

export function findPickable(
  games: readonly PickableGame[],
  key: string,
): { game: PickableGame; hero: HeroEntry } | null {
  const ref = parseFavorite(key);
  if (!ref) return null;
  const game = games.find((candidate) => candidate.game === ref.game);
  const hero = game?.heroes.find((candidate) => candidate.id === ref.heroId);
  return game && hero ? { game, hero } : null;
}

/**
 * Le card dei preferiti e la copertina (il primo). Un riferimento che il roster
 * non conosce si salta: il salvataggio li scarta gia', ma la colonna puo'
 * contenere un eroe tolto dopo.
 */
export function resolveFavorites(
  keys: readonly string[],
  games: readonly PickableGame[],
  locale: Locale,
): { favoriteHeroes: ProfileFavoriteHero[]; cover: ProfileCover | null } {
  const favoriteHeroes: ProfileFavoriteHero[] = [];
  let cover: ProfileCover | null = null;

  for (const key of keys) {
    const found = findPickable(games, key);
    if (!found) continue;
    const { game, hero } = found;
    cover ??= { game: game.game, hero, art: stageArtFor(game, hero.id) };
    favoriteHeroes.push({
      key,
      game: game.game,
      id: hero.id,
      name: heroName(hero, locale),
      epithet: heroEpithet(hero, locale),
      href: `/${game.game}/eroi/${hero.id}`,
    });
  }

  return { favoriteHeroes, cover };
}
