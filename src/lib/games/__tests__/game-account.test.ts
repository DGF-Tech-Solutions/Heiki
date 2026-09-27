/**
 * L'account di gioco (27/09): il bacino dell'eroe del giorno (gli SR senza
 * collaborazioni, scelta dell'utente), la pesca che non ripropone gli eroi
 * scartati, quale copia vince fra browser e database, e i controlli su quello che
 * arriva dal browser e dal modulo di caricamento.
 */

import { describe, expect, it } from "vitest";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import {
  challengePool,
  cleanFriendCode,
  cleanProfile,
  EMPTY_PROFILE,
  NICKNAME_MAX,
  parseProfile,
  pickChallenge,
  sniffImage,
  syncDirection,
  utcDay,
} from "../game-account";
import { COLLAB_FACTION } from "../randomizer";

const factionsOf = (id: string) => HERO_CONTEXT.heroes[id]?.factions;
const pool = challengePool(HEROES, factionsOf);

describe("eroe del giorno", () => {
  it("si pesca fra gli eroi che escono SR, senza collaborazioni: 30", () => {
    const byId = new Map(HEROES.map((hero) => [hero.id, hero]));
    expect(pool).toHaveLength(30);
    for (const id of pool) {
      expect(byId.get(id)?.obtainedAs).toBe("SR");
      expect(factionsOf(id) ?? []).not.toContain(COLLAB_FACTION);
    }
    // Rimuru Tempest ed Eren Jaeger escono SR ma sono collaborazioni
    expect(pool).not.toContain("1464001");
    expect(pool).not.toContain("1764001");
    // tutti gli SR non di collaborazione ci sono
    const expected = HEROES.filter(
      (hero) => hero.obtainedAs === "SR" && !(factionsOf(hero.id) ?? []).includes(COLLAB_FACTION),
    );
    expect(pool).toEqual(expected.map((hero) => hero.id).sort());
  });

  it("non ripropone gli eroi scartati, e si ferma quando non ne restano", () => {
    const first = (n: number) => {
      expect(n).toBeGreaterThan(0);
      return 0;
    };
    const skipped = pool.slice(0, 2);
    expect(pickChallenge(pool, skipped, first)).toBe(pool[2]);
    expect(pickChallenge(pool, pool, first)).toBeNull();
    // l'ultimo indice possibile
    expect(pickChallenge(pool, [], (n) => n - 1)).toBe(pool[pool.length - 1]);
  });

  it("il giorno e' quello UTC", () => {
    expect(utcDay(new Date("2026-09-27T23:30:00Z"))).toBe("2026-09-27");
    // alle 01:30 in Italia d'estate, in UTC e' ancora il giorno prima
    expect(utcDay(new Date("2026-09-28T01:30:00+02:00"))).toBe("2026-09-27");
  });
});

describe("browser e database", () => {
  it("vince la copia piu' recente, a pari data il database", () => {
    expect(syncDirection({ stamp: 100, hasData: true }, { updatedAt: 200 })).toBe("to-browser");
    expect(syncDirection({ stamp: 200, hasData: true }, { updatedAt: 200 })).toBe("to-browser");
    expect(syncDirection({ stamp: 300, hasData: true }, { updatedAt: 200 })).toBe("to-server");
  });

  it("senza copia nel database manda quella del browser, se ce n'e' una", () => {
    expect(syncDirection({ stamp: 0, hasData: true }, null)).toBe("to-server");
    expect(syncDirection({ stamp: 0, hasData: false }, null)).toBe("none");
  });

  it("un browser vuoto riceve la copia del database invece di cancellarla", () => {
    expect(syncDirection({ stamp: 0, hasData: false }, { updatedAt: 1 })).toBe("to-browser");
  });
});

describe("controlli", () => {
  it("il profilo letto dal browser si ripulisce invece di rompere la pagina", () => {
    expect(parseProfile(null)).toBe(EMPTY_PROFILE);
    expect(parseProfile("{non json")).toBe(EMPTY_PROFILE);
    expect(parseProfile(JSON.stringify({ nickname: 3, friendCode: ["x"], server: "mars" }))).toEqual(EMPTY_PROFILE);
    const profile = cleanProfile({
      nickname: `  Franz\u0007${"x".repeat(80)}`,
      friendCode: "123 456-789",
      server: "jp",
    });
    expect(profile.nickname.startsWith("Franz")).toBe(true);
    expect(profile.nickname).toHaveLength(NICKNAME_MAX);
    expect(profile.friendCode).toBe("123456789");
    expect(profile.server).toBe("jp");
  });

  it("il Codice amico tiene solo lettere e cifre, al massimo 20", () => {
    expect(cleanFriendCode("ab-12 CD")).toBe("ab12CD");
    expect(cleanFriendCode("9".repeat(40))).toHaveLength(20);
  });

  it("le schermate si riconoscono dai primi byte, non dal nome", () => {
    const bytes = (...values: number[]) => new Uint8Array([...values, ...new Array(16).fill(0)]);
    expect(sniffImage(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe("image/png");
    expect(sniffImage(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("image/jpeg");
    expect(sniffImage(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50))).toBe("image/webp");
    expect(sniffImage(bytes(0x3c, 0x73, 0x76, 0x67))).toBeNull(); // «<svg»: niente immagini con script
    expect(sniffImage(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x41, 0x56, 0x45))).toBeNull(); // RIFF WAVE
  });
});
