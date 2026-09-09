/**
 * La riproducibilita' non e' un dettaglio: un link condiviso deve mostrare
 * sempre gli stessi numeri, altrimenti due utenti che guardano la stessa build
 * vedono risultati diversi e il sito perde credibilita'.
 */

import { describe, expect, it } from "vitest";
import { createRng, seedFromString } from "../rng";

describe("createRng", () => {
  it("lo stesso seed produce la stessa sequenza", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seriesA = Array.from({ length: 20 }, () => a.next());
    const seriesB = Array.from({ length: 20 }, () => b.next());
    expect(seriesA).toEqual(seriesB);
  });

  it("seed diversi producono sequenze diverse", () => {
    const a = Array.from({ length: 20 }, ((rng) => () => rng.next())(createRng(1)));
    const b = Array.from({ length: 20 }, ((rng) => () => rng.next())(createRng(2)));
    expect(a).not.toEqual(b);
  });

  it("next resta nell'intervallo [0, 1)", () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("int resta nell'intervallo richiesto", () => {
    const rng = createRng(7);
    for (let i = 0; i < 500; i++) {
      const value = rng.int(6);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(6);
    }
    expect(rng.int(0)).toBe(0);
  });

  it("range resta tra minimo e massimo", () => {
    const rng = createRng(9);
    for (let i = 0; i < 200; i++) {
      const value = rng.range(10, 20);
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThan(20);
    }
  });

  it("chance con probabilita' 0 e 1 e' deterministico", () => {
    const rng = createRng(3);
    expect(rng.chance(0)).toBe(false);
    expect(rng.chance(1)).toBe(true);
  });

  it("pick restituisce un elemento dell'array e rifiuta l'array vuoto", () => {
    const rng = createRng(11);
    const items = ["a", "b", "c"];
    for (let i = 0; i < 50; i++) {
      expect(items).toContain(rng.pick(items));
    }
    expect(() => rng.pick([])).toThrow(/array vuoto/i);
  });

  it("shuffle conserva gli elementi e non muta l'originale", () => {
    const rng = createRng(5);
    const original = [1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = rng.shuffle(original);

    expect(original).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(shuffled.slice().sort((a, b) => a - b)).toEqual(original);
  });
});

describe("seedFromString", () => {
  it("e' stabile per la stessa stringa", () => {
    expect(seedFromString("build:furina-vape")).toBe(seedFromString("build:furina-vape"));
  });

  it("distingue stringhe diverse", () => {
    expect(seedFromString("a")).not.toBe(seedFromString("b"));
  });

  it("produce un intero senza segno a 32 bit", () => {
    const seed = seedFromString("qualsiasi cosa");
    expect(Number.isInteger(seed)).toBe(true);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(0xffffffff);
  });
});
