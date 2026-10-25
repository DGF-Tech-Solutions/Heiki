/**
 * I giochi nel profilo del sito (25/10): quali hanno le pagine «account di
 * gioco» e «i tuoi eroi» sotto /profilo/<gioco>.
 *
 * Fino al 24/10 quelle pagine stavano dentro il gioco (/grand-cross/account,
 * nel gruppo «Il tuo account» del menu di Grand Cross). L'utente: «la scheda
 * profilo dev'essere universale, poi aggiungeremo piu' giochi». Ora il profilo
 * e' del sito, e ogni gioco vi aggiunge una scheda sua quando il suo modulo ha
 * di che riempirla: l'account se ha la classe dell'account (`accountBuff`), gli
 * eroi se ha roster e statistiche. Un gioco senza ne' l'una ne' l'altra cosa non
 * compare: una scheda vuota prometterebbe qualcosa che non c'e'.
 *
 * Solo server: legge il registro dei moduli.
 */

import { listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";

export interface ProfileGame {
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  /** la pagina dell'account di gioco: nickname, Codice amico, classe, verifica */
  readonly account: boolean;
  /** il box degli eroi */
  readonly heroes: boolean;
  /** quanti eroi ha il roster, per «N eroi su 377» */
  readonly total: number;
}

export function profileGames(): ProfileGame[] {
  return listGames().flatMap((game) => {
    if (!game.available) return [];
    const gameModule = getGameModule(game.slug);
    const account = Boolean(gameModule?.accountBuff);
    const heroes = Boolean(gameModule?.roster && gameModule.heroStats);
    if (!account && !heroes) return [];
    return [
      {
        slug: game.slug,
        name: game.name,
        shortName: game.shortName,
        account,
        heroes,
        total: gameModule?.roster?.heroes.length ?? 0,
      },
    ];
  });
}

/** Un gioco del profilo, o undefined se il suo indirizzo non ha pagine. */
export function profileGame(slug: string): ProfileGame | undefined {
  return profileGames().find((game) => game.slug === slug);
}

/** I giochi annunciati e non ancora pronti: nel profilo una riga sola, spenta. */
export function upcomingGames(): { readonly slug: string; readonly name: string }[] {
  return listGames()
    .filter((game) => !game.available)
    .map((game) => ({ slug: game.slug, name: game.name }));
}
