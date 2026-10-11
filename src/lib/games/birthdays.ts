/**
 * Le regole del calendario dei compleanni: quale giorno e' oggi per chi guarda,
 * quanti giorni mancano, chi festeggia in una data. Pure: le usano la pagina
 * (server, il calendario) e il riquadro «Oggi» (browser, con la data di chi guarda).
 */

import type { BirthdaysIndex, MonthDay, TavernGuest } from "./birthdays-types";

/** «07-25»: l'ancora di un giorno nel calendario e la chiave delle mappe. */
export function dayKey([month, day]: MonthDay): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Il giorno scelto nell'indirizzo (`?giorno=07-25`): cliccando una data del
 * calendario la si apre in grande. Una data impossibile (13-01, 02-30) vale come
 * nessuna scelta; di un parametro ripetuto vale il primo, come nel resto del sito.
 */
export function parseDayParam(value: string | readonly string[] | undefined): MonthDay | null {
  const raw = typeof value === "string" ? value : value?.[0];
  const m = raw?.match(/^(\d{2})-(\d{2})$/);
  if (!m) return null;
  const month = Number(m[1]);
  const day = Number(m[2]);
  // 2024 e' bisestile: il 29 febbraio e' una data che esiste
  if (month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(2024, month, 0)).getUTCDate()) return null;
  return [month, day];
}

/** Oggi nel calendario di chi guarda: i giorni reali, nel suo fuso orario. */
export function localDay(now: Date): { year: number; date: MonthDay } {
  return { year: now.getFullYear(), date: [now.getMonth() + 1, now.getDate()] };
}

/**
 * Quanti giorni mancano al prossimo `date` partendo da `today` (0 = oggi).
 *
 * In UTC e a mezzogiorno: i giorni si contano senza che un cambio d'ora legale
 * faccia perdere o guadagnare un'ora, e quindi un giorno. Nessun compleanno del
 * gioco cade il 29 febbraio (l'import non lo vieta: in un anno non bisestile
 * Date lo porterebbe al primo marzo, che e' il giorno dopo il 28, come ci si
 * aspetta).
 */
export function daysUntil(date: MonthDay, today: { year: number; date: MonthDay }): number {
  const start = Date.UTC(today.year, today.date[0] - 1, today.date[1], 12);
  let next = Date.UTC(today.year, date[0] - 1, date[1], 12);
  if (next < start) next = Date.UTC(today.year + 1, date[0] - 1, date[1], 12);
  return Math.round((next - start) / 86_400_000);
}

/** Un personaggio in una data: le sue versioni che hanno quel compleanno. */
export interface BirthdayCharacter {
  group: string;
  /** dal piu' recente, nell'ordine del roster */
  heroes: string[];
  /** cliente della taverna che festeggia in questa data */
  guest: TavernGuest | null;
}

export interface BirthdayDay {
  date: MonthDay;
  characters: BirthdayCharacter[];
}

/**
 * Il calendario: ogni data con almeno un compleanno, in ordine di mese e giorno,
 * e in ogni data i personaggi con le loro versioni.
 *
 * Per personaggio e non per versione: Meliodas ha quindici versioni il 25 luglio, e
 * un calendario di quindici card uguali non dice niente in piu'. Un personaggio puo'
 * stare in due date se le sue versioni non concordano (Ludociel dei Quattro Arcangeli
 * il 17 febbraio, Ludociel del Patto il 7 luglio; Sariel lo stesso), e un eroe doppio
 * (King & Diane) sta in tutte e due le sue.
 *
 * `rosterOrder` sono gli id del roster nel loro ordine (dal piu' recente): decide
 * quale versione si vede per prima.
 */
export function birthdayCalendar(index: BirthdaysIndex, rosterOrder: readonly string[]): BirthdayDay[] {
  const rank = new Map(rosterOrder.map((id, i) => [id, i]));
  const days = new Map<string, { date: MonthDay; groups: Map<string, string[]> }>();
  for (const [id, hero] of Object.entries(index.heroes)) {
    for (const date of hero.dates) {
      if (!date) continue;
      const key = dayKey(date);
      const day = days.get(key) ?? { date, groups: new Map() };
      days.set(key, day);
      const heroes = day.groups.get(hero.group) ?? [];
      if (!heroes.includes(id)) heroes.push(id);
      day.groups.set(hero.group, heroes);
    }
  }
  const guests = new Map(index.guests.map((guest) => [`${dayKey(guest.date)}:${guest.group}`, guest]));
  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, day]) => ({
      date: day.date,
      characters: [...day.groups.entries()]
        .map(([group, heroes]) => ({
          group,
          heroes: heroes.sort((a, b) => (rank.get(a) ?? 1e9) - (rank.get(b) ?? 1e9)),
          guest: guests.get(`${key}:${group}`) ?? null,
        }))
        // prima i festeggiati della taverna, poi chi ha piu' versioni
        .sort((a, b) => Number(!!b.guest) - Number(!!a.guest) || b.heroes.length - a.heroes.length),
    }));
}

/** Le prossime `count` date con un compleanno, da oggi compreso. */
export function upcomingDays(
  calendar: readonly BirthdayDay[],
  today: { year: number; date: MonthDay },
  count: number,
): { day: BirthdayDay; inDays: number }[] {
  return calendar
    .map((day) => ({ day, inDays: daysUntil(day.date, today) }))
    .sort((a, b) => a.inDays - b.inDays)
    .slice(0, count);
}

/** I punti Affetto di un regalo: in un giorno qualunque e nel giorno della festa. */
export function giftAffection(affection: number, multiplier: number): { normal: number; birthday: number } {
  return { normal: affection, birthday: affection * multiplier };
}

/** Gli eroi del roster il cui profilo dice «Sconosciuto» (o che non hanno una data). */
export function unknownBirthdays(index: BirthdaysIndex): string[] {
  return Object.entries(index.heroes)
    .filter(([, hero]) => !hero.dates.some(Boolean))
    .map(([id]) => id);
}

/** I testi del gioco portano «\n» scritto: in una riga sola diventa uno spazio. */
export function oneLine(text: string): string {
  return text.replace(/\\n|\n/g, " ").replace(/\s+/g, " ").trim();
}
