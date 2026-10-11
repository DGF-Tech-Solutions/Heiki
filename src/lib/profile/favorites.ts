/**
 * Gli eroi preferiti di un profilo.
 *
 * Fino all'11/10 erano testo libero («Nome del personaggio»): una scritta che non
 * portava da nessuna parte e che nessuno poteva verificare. Ora sono riferimenti
 * a un eroe del roster, `<slug del gioco>:<id dell'eroe>` (`grand-cross:1575001`):
 * la card, il collegamento alla scheda e il palco della copertina si ricavano
 * da li'. Il PRIMO e' l'«eroe in copertina».
 *
 * Funzioni pure, e senza importare il registro dei giochi: questo modulo lo
 * usa anche l'editor nel browser, e il registro si porta dietro il motore e
 * tutti i dati di Grand Cross. Chi controlla che l'eroe esista (il salvataggio,
 * il caricamento del profilo) passa il roster con `rosterOf`; e' anche quello
 * che rende le funzioni verificabili con un roster finto.
 *
 * I preferiti di testo libero salvati prima non hanno la forma giusta e si
 * perdono in silenzio: il sito non e' ancora online, nessuno li ha scritti.
 */

/** Quanti eroi si possono scegliere: una fila di card, non un secondo roster. */
export const FAVORITES_LIMIT = 8;

/** lo slug del gioco come negli indirizzi, i due punti, le sette cifre dell'id del client */
const FAVORITE_PATTERN = /^([a-z0-9]+(?:-[a-z0-9]+)*):(\d{7})$/;

export interface FavoriteRef {
  readonly game: string;
  readonly heroId: string;
}

export function favoriteKey(game: string, heroId: string): string {
  return `${game}:${heroId}`;
}

/** Il riferimento letto da una voce salvata, o null se la voce non ha la forma giusta. */
export function parseFavorite(value: unknown): FavoriteRef | null {
  if (typeof value !== "string") return null;
  const match = FAVORITE_PATTERN.exec(value.trim());
  return match ? { game: match[1]!, heroId: match[2]! } : null;
}

/** Gli eroi di un gioco, per sapere se un id esiste davvero: `getGameModule(slug)?.roster?.heroes`. */
export type RosterOf = (game: string) => readonly { readonly id: string }[] | undefined;

/**
 * I preferiti come si salvano: solo riferimenti ben formati a eroi che il
 * roster del gioco conosce, senza doppioni (vale il primo: e' l'ordine scelto),
 * al massimo `FAVORITES_LIMIT`.
 *
 * Accetta qualunque cosa, perche' le fonti sono due e nessuna e' fidata: la
 * colonna jsonb (dove ci sono ancora i nomi di testo libero) e il payload del
 * client. Un eroe tolto dal roster sparisce dai preferiti invece di lasciare
 * una card rotta.
 */
export function normalizeFavorites(values: unknown, rosterOf: RosterOf): string[] {
  if (!Array.isArray(values)) return [];

  const ids = new Map<string, Set<string>>();
  const known = (game: string, heroId: string): boolean => {
    let set = ids.get(game);
    if (!set) {
      set = new Set((rosterOf(game) ?? []).map((hero) => hero.id));
      ids.set(game, set);
    }
    return set.has(heroId);
  };

  const result: string[] = [];
  for (const value of values) {
    if (result.length >= FAVORITES_LIMIT) break;
    const ref = parseFavorite(value);
    if (!ref || !known(ref.game, ref.heroId)) continue;
    const key = favoriteKey(ref.game, ref.heroId);
    if (!result.includes(key)) result.push(key);
  }
  return result;
}

/** Sposta una voce di un elenco senza toccarlo: l'editor riordina i preferiti cosi'. */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const copy = items.slice();
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) return copy;
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved as T);
  return copy;
}
