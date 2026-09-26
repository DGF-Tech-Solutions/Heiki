/**
 * Il calendario delle uscite: come si sfoglia.
 *
 * Funzioni pure, fuori dalla pagina come quelle del roster: il conto dei giorni
 * e il raggruppamento per anno sono la parte che si sbaglia in silenzio - un
 * giorno perso col cambio dell'ora legale, un anno che finisce nel gruppo
 * sbagliato - e qui si provano con dei test.
 *
 * Il Core non sa niente di Grand Cross: legge solo ReleaseCalendar.
 */

import type { ReleaseCalendar, ReleaseRegion, ReleaseUpdate } from "./types";

/** "recenti" dal piu' nuovo, "primi" nell'ordine della fonte, dal lancio. */
export type ReleaseOrder = "recenti" | "primi";

export interface ReleaseYear {
  year: string;
  updates: ReleaseUpdate[];
  /** eroi nuovi nell'anno, compresi quelli del lancio */
  heroes: number;
}

/** Quanti eroi porta un aggiornamento: quelli della riga, o quelli del lancio. */
export function heroesIn(update: ReleaseUpdate): number {
  return update.heroes.length + (update.launchHeroes?.length ?? 0);
}

/**
 * Gli aggiornamenti divisi per anno, nell'ordine chiesto.
 *
 * Con `onlyHeroes` restano solo quelli con eroi nuovi: una settimana su due il
 * gioco non ne porta, e chi cerca un eroe scorre la meta' delle righe. Gli anni
 * rimasti vuoti spariscono, non restano come titoli senza niente sotto.
 */
export function releaseYears(
  updates: readonly ReleaseUpdate[],
  order: ReleaseOrder,
  onlyHeroes = false,
): ReleaseYear[] {
  const kept = updates.filter((update) => !onlyHeroes || heroesIn(update) > 0);
  const ordered = order === "recenti" ? [...kept].reverse() : [...kept];
  const years: ReleaseYear[] = [];
  for (const update of ordered) {
    const year = update.date.slice(0, 4);
    let group = years.at(-1);
    if (group?.year !== year) {
      group = { year, updates: [], heroes: 0 };
      years.push(group);
    }
    group.updates.push(update);
    group.heroes += heroesIn(update);
  }
  return years;
}

/**
 * Giorni fra due date AAAA-MM-GG.
 *
 * Contati su mezzanotte UTC: con l'ora locale, una differenza che attraversa
 * il cambio dell'ora legale darebbe 23 o 25 ore, e un arrotondamento per
 * difetto perderebbe un giorno.
 */
export function daysBetween(from: string, to: string): number {
  const day = (value: string) => Date.UTC(+value.slice(0, 4), +value.slice(5, 7) - 1, +value.slice(8, 10));
  return Math.round((day(to) - day(from)) / 86_400_000);
}

/**
 * Il giorno del lancio di un calendario: l'aggiornamento segnato come tale, o il
 * primo. Ogni server ha il suo: Grand Cross e' uscito in Giappone il 4/6/2019,
 * nel globale il 2/3/2020.
 *
 * I giorni dal lancio si ricalcolano dalle date invece di prenderli dalla fonte:
 * il foglio di Grand Cross li scrive a mano, e dall'ottobre 2025 salta di 337
 * giorni in una settimana.
 */
export function launchDate(updates: readonly ReleaseUpdate[]): string | undefined {
  return (updates.find((update) => update.launch) ?? updates[0])?.date;
}

/**
 * Il calendario da mostrare: quello chiesto se c'e', se no il primo che c'e',
 * nell'ordine di `REGIONS`. Il globale viene prima: e' il server di chi legge
 * in italiano.
 */
export const REGIONS: readonly ReleaseRegion[] = ["global", "jp"];

export function pickRegion(calendar: ReleaseCalendar, wanted: ReleaseRegion | undefined): ReleaseRegion | undefined {
  if (wanted && calendar.schedules[wanted]) return wanted;
  return REGIONS.find((region) => calendar.schedules[region]);
}
