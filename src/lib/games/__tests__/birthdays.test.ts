/**
 * I compleanni: il conto dei giorni regge il cambio d'anno e l'ora legale, e i dati
 * generati si legano al roster e fra loro (la festa di un cliente cade nel
 * compleanno del profilo di tutte le sue versioni).
 */

import { describe, expect, it } from "vitest";
import { BIRTHDAYS } from "../grand-cross/birthdays.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import {
  birthdayCalendar,
  dayKey,
  daysUntil,
  giftAffection,
  localDay,
  oneLine,
  parseDayParam,
  unknownBirthdays,
  upcomingDays,
} from "../birthdays";
import type { MonthDay } from "../birthdays-types";

const on = (year: number, month: number, day: number) => ({ year, date: [month, day] as MonthDay });

describe("il conto dei giorni", () => {
  it("scrive la data come l'ancora del calendario", () => {
    expect(dayKey([7, 25])).toBe("07-25");
    expect(dayKey([12, 3])).toBe("12-03");
  });

  it("conta da oggi, e passa all'anno dopo", () => {
    expect(daysUntil([10, 11], on(2026, 10, 11))).toBe(0);
    expect(daysUntil([10, 16], on(2026, 10, 11))).toBe(5);
    expect(daysUntil([1, 1], on(2026, 12, 31))).toBe(1);
    expect(daysUntil([10, 10], on(2026, 10, 11))).toBe(364);
    // l'anno dopo e' bisestile: dal primo marzo al 28 febbraio sono 364 giorni
    expect(daysUntil([2, 28], on(2027, 3, 1))).toBe(364);
  });

  it("non perde un giorno col cambio d'ora legale", () => {
    expect(daysUntil([3, 30], on(2026, 3, 28))).toBe(2);
    expect(daysUntil([10, 26], on(2026, 10, 24))).toBe(2);
  });

  it("legge il giorno scelto nell'indirizzo, e scarta quelli impossibili", () => {
    expect(parseDayParam("07-25")).toEqual([7, 25]);
    expect(parseDayParam(["02-29", "03-01"])).toEqual([2, 29]);
    expect(parseDayParam("02-30")).toBeNull();
    expect(parseDayParam("13-01")).toBeNull();
    expect(parseDayParam("7-25")).toBeNull();
    expect(parseDayParam(undefined)).toBeNull();
  });

  it("legge oggi nel fuso di chi guarda", () => {
    expect(localDay(new Date(2026, 9, 11, 23, 30))).toEqual({ year: 2026, date: [10, 11] });
  });

  it("toglie gli a capo scritti dei testi del gioco", () => {
    expect(oneLine("Increase Affection\\nor by conversing")).toBe("Increase Affection or by conversing");
  });
});

describe("i dati dei compleanni", () => {
  const order = HEROES.map((hero) => hero.id);
  const calendar = birthdayCalendar(BIRTHDAYS, order);

  it("hanno una riga per ogni eroe del roster", () => {
    expect(Object.keys(BIRTHDAYS.heroes).sort()).toEqual([...order].sort());
    for (const hero of Object.values(BIRTHDAYS.heroes)) {
      expect(hero.dates.length).toBeGreaterThan(0);
      expect(BIRTHDAYS.groups[hero.group]).toBeTruthy();
    }
  });

  it("mettono ogni eroe con una data in quella data del calendario, una volta", () => {
    const where = new Map<string, string[]>();
    for (const day of calendar) {
      for (const character of day.characters) {
        for (const id of character.heroes) where.set(id, [...(where.get(id) ?? []), dayKey(day.date)]);
      }
    }
    for (const [id, hero] of Object.entries(BIRTHDAYS.heroes)) {
      const dates = hero.dates.filter((date): date is MonthDay => !!date).map(dayKey);
      expect(where.get(id) ?? []).toEqual(dates.sort());
    }
    expect(calendar.map((day) => dayKey(day.date))).toEqual([...calendar.map((day) => dayKey(day.date))].sort());
  });

  it("fanno cadere la festa nel compleanno del profilo di ogni versione del cliente", () => {
    expect(BIRTHDAYS.guests).toHaveLength(50);
    for (const guest of BIRTHDAYS.guests) {
      expect(guest.multiplier).toBe(BIRTHDAYS.multiplier);
      for (const id of guest.heroes) {
        expect(BIRTHDAYS.heroes[id]!.group).toBe(guest.group);
        expect(BIRTHDAYS.heroes[id]!.dates.map((date) => date && dayKey(date))).toContain(dayKey(guest.date));
      }
      const day = calendar.find((d) => dayKey(d.date) === dayKey(guest.date));
      expect(day?.characters.find((c) => c.group === guest.group)?.guest).toBe(guest);
    }
  });

  it("danno un regalo preferito a tutti i clienti tranne chi vive in taverna", () => {
    const without = BIRTHDAYS.guests.filter((guest) => !guest.gift).map((guest) => BIRTHDAYS.groups[guest.group]!.en);
    expect(without.sort()).toEqual(["Hawk", "Meliodas"]);
    for (const guest of BIRTHDAYS.guests) {
      if (!guest.gift) continue;
      expect(BIRTHDAYS.items[guest.gift.item]).toBeTruthy();
      expect(BIRTHDAYS.items[guest.gift.returnItem]).toBeTruthy();
    }
    // solo Hawk e' legato per deduzione: le altre righe stanno in DB_basepoint_npc
    expect(BIRTHDAYS.guests.filter((guest) => guest.deduced).map((guest) => guest.guest)).toEqual([2]);
  });

  it("moltiplicano per dieci il regalo preferito, non quello comune", () => {
    expect(BIRTHDAYS.multiplier).toBe(10);
    expect(giftAffection(500, BIRTHDAYS.multiplier)).toEqual({ normal: 500, birthday: 5000 });
    expect(BIRTHDAYS.commonGift.affection).toBe(500);
    expect(BIRTHDAYS.affectionPerHeart).toBe(20000);
  });

  it("danno 300 Diamanti per i Cuori raccolti, a passi di cinque", () => {
    expect(BIRTHDAYS.heartRewards.reduce((sum, reward) => sum + reward.count, 0)).toBe(300);
    BIRTHDAYS.heartRewards.forEach((reward, i) => expect(reward.hearts).toBe(5 * (i + 1)));
  });

  it("dicono chi non ha un compleanno nel profilo", () => {
    const unknown = unknownBirthdays(BIRTHDAYS);
    expect(unknown.length).toBe(Object.keys(BIRTHDAYS.heroes).length - Object.values(BIRTHDAYS.heroes).filter((h) => h.dates.some(Boolean)).length);
    expect(unknown.length).toBeGreaterThan(0);
  });

  it("trovano i prossimi compleanni in ordine, da oggi compreso", () => {
    const next = upcomingDays(calendar, on(2026, 7, 25), 5);
    expect(next[0]!.inDays).toBe(0);
    const first = next[0]!.day.characters[0]!.guest!;
    expect(BIRTHDAYS.groups[first.group]!.en).toBe("Meliodas");
    for (let i = 1; i < next.length; i++) expect(next[i]!.inDays).toBeGreaterThan(next[i - 1]!.inDays);
  });
});
