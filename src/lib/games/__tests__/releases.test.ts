/**
 * Test del calendario delle uscite.
 *
 * Come per il roster: le funzioni si provano su un campione scritto a mano, e
 * in fondo si controllano i dati veri di Grand Cross, ma sul contratto - ogni
 * collegamento porta a un eroe che esiste, la griglia e' davvero in ordine
 * d'uscita - e non sui numeri del momento.
 */

import { describe, expect, it } from "vitest";
import { gameGroups } from "../catalog";
import { grandCrossModule } from "../grand-cross";
import { daysBetween, heroesIn, launchDate, pickRegion, releaseYears } from "../releases";
import type { ReleaseCalendar, ReleaseHero, ReleaseRegion, ReleaseUpdate } from "../types";

function hero(name: string, heroId?: string): ReleaseHero {
  return { name, colors: ["R"], rarity: "SSR", method: { it: "Pescata", en: "Pick Up Draw" }, heroId };
}

const SAMPLE: readonly ReleaseUpdate[] = [
  { number: "1", date: "2019-06-04", heroes: [], launch: true, launchHeroes: ["10", "11"] },
  { number: "2", date: "2019-06-13", heroes: [hero("Elizabeth", "20"), hero("Elizabeth", "21")] },
  { number: "3", date: "2020-01-02", heroes: [], noHeroes: "banner" },
  { number: "4", date: "2020-01-09", heroes: [], noHeroes: "banner" },
  { number: "5", date: "2021-05-06", heroes: [hero("Merlin", "30")] },
];

describe("releaseYears", () => {
  it("dal piu' recente divide per anno partendo dall'ultimo", () => {
    const years = releaseYears(SAMPLE, "recenti");
    expect(years.map((y) => y.year)).toEqual(["2021", "2020", "2019"]);
    expect(years[2]?.updates.map((u) => u.date)).toEqual(["2019-06-13", "2019-06-04"]);
  });

  it("dal lancio tiene l'ordine della fonte", () => {
    expect(releaseYears(SAMPLE, "primi").flatMap((y) => y.updates.map((u) => u.number))).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
  });

  it("conta gli eroi dell'anno, compresi quelli del lancio", () => {
    expect(releaseYears(SAMPLE, "primi").map((y) => y.heroes)).toEqual([4, 0, 1]);
  });

  it("con solo gli eroi nuovi toglie le settimane vuote, e gli anni rimasti senza niente", () => {
    const years = releaseYears(SAMPLE, "recenti", true);
    expect(years.map((y) => y.year)).toEqual(["2021", "2019"]);
    expect(years.flatMap((y) => y.updates).every((u) => heroesIn(u) > 0)).toBe(true);
  });

  it("non tocca l'elenco ricevuto", () => {
    const before = SAMPLE.map((u) => u.date);
    releaseYears(SAMPLE, "recenti");
    expect(SAMPLE.map((u) => u.date)).toEqual(before);
  });
});

describe("daysBetween", () => {
  it("conta i giorni di calendario", () => {
    expect(daysBetween("2019-06-04", "2019-06-13")).toBe(9);
    expect(daysBetween("2019-06-04", "2019-06-04")).toBe(0);
  });

  it("non perde un giorno col cambio dell'ora legale", () => {
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(daysBetween("2025-10-25", "2025-10-27")).toBe(2);
  });

  it("attraversa gli anni bisestili", () => {
    expect(daysBetween("2019-06-04", "2025-10-09")).toBe(2319);
  });
});

describe("launchDate", () => {
  it("e' l'aggiornamento segnato come lancio", () => {
    expect(launchDate([SAMPLE[1]!, SAMPLE[0]!])).toBe("2019-06-04");
  });

  it("senza un lancio segnato e' il primo aggiornamento", () => {
    expect(launchDate(SAMPLE.slice(1))).toBe("2019-06-13");
  });
});

describe("pickRegion", () => {
  const both = { schedules: { global: [], jp: [] } } as unknown as ReleaseCalendar;
  const onlyJp = { schedules: { jp: [] } } as unknown as ReleaseCalendar;

  it("parte dal globale", () => {
    expect(pickRegion(both, undefined)).toBe("global");
  });

  it("da' il calendario chiesto, se c'e'", () => {
    expect(pickRegion(both, "jp")).toBe("jp");
    expect(pickRegion(onlyJp, "global")).toBe("jp");
  });
});

describe("calendario di Grand Cross", () => {
  const releases = grandCrossModule.releases;
  const roster = grandCrossModule.roster;
  const known = new Set(roster?.heroes.map((h) => h.id));
  const regions: ReleaseRegion[] = ["global", "jp"];
  const schedule = (region: ReleaseRegion) => releases?.schedules[region] ?? [];

  it("il modulo lo espone coi due calendari, e la sezione Uscite compare", () => {
    expect(releases).toBeDefined();
    expect(schedule("global").length).toBeGreaterThan(0);
    expect(schedule("jp").length).toBeGreaterThan(0);
    expect(gameGroups("grand-cross").flatMap((g) => g.items.map((i) => i.path))).toContain("/uscite");
  });

  for (const region of regions) {
    describe(region, () => {
      const updates = schedule(region);

      it("ogni collegamento porta a un eroe del roster", () => {
        const ids = updates.flatMap((u) => [
          ...u.heroes.flatMap((h) => h.heroId ?? []),
          ...(u.launchHeroes ?? []),
          ...(u.lrEvolutions ?? []).flatMap((lr) => lr.heroId ?? []),
        ]);
        expect(ids.filter((id) => !known.has(id))).toEqual([]);
      });

      it("un eroe esce una volta sola", () => {
        const ids = updates.flatMap((u) => [...u.heroes.flatMap((h) => h.heroId ?? []), ...(u.launchHeroes ?? [])]);
        expect(ids.length - new Set(ids).size).toBe(0);
      });

      it("le date sono uniche e in ordine: l'ancora di una riga e' la sua data", () => {
        const dates = updates.map((u) => u.date);
        expect(new Set(dates).size).toBe(dates.length);
        expect([...dates].sort()).toEqual(dates);
      });

      it("ogni modo di ottenimento ha l'italiano: un pezzo nuovo va aggiunto a METHOD_IT dell'importazione", () => {
        const missing = updates.flatMap((u) => u.heroes.filter((h) => !h.method.it).map((h) => h.method.en));
        expect([...new Set(missing)]).toEqual([]);
      });
    });
  }

  it("nel globale ogni eroe del roster ha la sua riga, o sta fra quelli del lancio", () => {
    const ids = new Set(schedule("global").flatMap((u) => [...u.heroes.flatMap((h) => h.heroId ?? []), ...(u.launchHeroes ?? [])]));
    expect([...known].filter((id) => !ids.has(id))).toEqual([]);
  });

  /*
   * Dall'allineamento il globale riprende le righe giapponesi, lo stesso giorno;
   * solo i rari aggiornamenti arrivati il mercoledi' prima (Odino) hanno una data
   * diversa, un giorno prima, e la tengono in `jpDate`. Se la pipeline cambiasse
   * regola, o una riga si perdesse per strada, le due viste non racconterebbero
   * piu' le stesse uscite.
   */
  it("dopo l'allineamento il globale e' il calendario giapponese, lo stesso giorno salvo gli anticipi", () => {
    const sync = releases?.sync;
    expect(sync).toBeDefined();
    const jp = schedule("jp").filter((u) => u.date >= sync!);
    const global = schedule("global").filter((u) => u.fromJp);
    expect(global.map((u) => u.jpDate ?? u.date)).toEqual(jp.map((u) => u.date));
    expect(global.filter((u) => u.jpDate && daysBetween(u.date, u.jpDate) !== 1).map((u) => u.date)).toEqual([]);
    expect(schedule("global").filter((u) => !u.fromJp && u.date >= sync!).map((u) => u.date)).toEqual([]);
  });

  it("gli anticipi al mercoledi' sono pochi, e Odino e' fra questi", () => {
    const early = schedule("global").filter((u) => u.jpDate);
    expect(early.length).toBeLessThanOrEqual(5);
    expect(early.some((u) => u.heroes.some((h) => h.heroId === "2016501"))).toBe(true);
  });

  it("ogni eroe del roster ha una data d'uscita nei due calendari", () => {
    expect([...known].filter((id) => !releases?.heroes[id]?.jp || !releases?.heroes[id]?.global)).toEqual([]);
  });

  it("la riga del calendario di un eroe e' quella in cui compare, e la data e' la sua", () => {
    const wrong: string[] = [];
    for (const [id, release] of Object.entries(releases?.heroes ?? {})) {
      for (const [region, date, update] of [
        ["global", release.global, release.updateGlobal],
        ["jp", release.jp, release.updateJp],
      ] as const) {
        if (!update) continue;
        const row = schedule(region).find((u) => u.date === update);
        const there = row?.heroes.some((h) => h.heroId === id) || row?.launchHeroes?.includes(id);
        if (!there || date !== update) wrong.push(`${id} ${region}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("la griglia degli eroi parte in ordine d'uscita globale, dal piu' recente", () => {
    const dates = roster?.heroes.map((h) => releases?.heroes[h.id]?.global ?? "") ?? [];
    const outOfOrder = dates.flatMap((date, i) => (i > 0 && date > dates[i - 1]! ? [roster!.heroes[i]!.id] : []));
    expect(outOfOrder).toEqual([]);
  });
});
