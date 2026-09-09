/**
 * L'ordinamento del feed e' una decisione di prodotto, non un dettaglio di
 * query: decide cosa vede per primo chi arriva sul sito. Va verificato.
 */

import { describe, expect, it } from "vitest";
import { hotScore, isFeedSort, relativeTime, sortFeed } from "../ranking";
import type { FeedPost } from "../types";

const NOW = new Date("2026-09-09T12:00:00.000Z");

function post(id: string, score: number, hoursAgo: number): FeedPost {
  return {
    id,
    game: "grand-cross",
    hub: "build",
    hubName: "Build e numeri",
    title: id,
    excerpt: "",
    author: { username: "u", displayName: "U", role: "USER", accent: "brand" },
    score,
    commentCount: 0,
    createdAt: new Date(NOW.getTime() - hoursAgo * 3_600_000).toISOString(),
    attachment: null,
    myVote: 0,
  };
}

describe("hotScore", () => {
  it("a parita' di eta' vince chi ha piu' voti", () => {
    const older = hotScore(10, new Date(NOW.getTime() - 3_600_000), NOW);
    const better = hotScore(50, new Date(NOW.getTime() - 3_600_000), NOW);
    expect(better).toBeGreaterThan(older);
  });

  it("a parita' di voti vince il piu' recente", () => {
    const fresh = hotScore(10, new Date(NOW.getTime() - 3_600_000), NOW);
    const stale = hotScore(10, new Date(NOW.getTime() - 72 * 3_600_000), NOW);
    expect(fresh).toBeGreaterThan(stale);
  });

  it("un post nuovo senza voti non vale zero", () => {
    // Senza il +1 un post appena pubblicato resterebbe in fondo per sempre:
    // nessuno lo vede, quindi nessuno lo vota, quindi nessuno lo vede.
    expect(hotScore(0, NOW, NOW)).toBeGreaterThan(0);
  });

  it("un post vecchissimo molto votato non batte uno nuovo discreto", () => {
    const ancient = hotScore(500, new Date(NOW.getTime() - 24 * 30 * 3_600_000), NOW);
    const fresh = hotScore(12, new Date(NOW.getTime() - 3_600_000), NOW);
    expect(fresh).toBeGreaterThan(ancient);
  });

  it("una data futura non produce un punteggio infinito", () => {
    const future = hotScore(5, new Date(NOW.getTime() + 10 * 3_600_000), NOW);
    expect(Number.isFinite(future)).toBe(true);
    expect(future).toBeGreaterThan(0);
  });
});

describe("sortFeed", () => {
  const posts = [post("vecchio-top", 300, 400), post("recente", 4, 1), post("medio", 40, 10)];

  it("'new' ordina solo per data", () => {
    expect(sortFeed(posts, "new", NOW).map((p) => p.id)).toEqual([
      "recente",
      "medio",
      "vecchio-top",
    ]);
  });

  it("'top' ordina solo per voti", () => {
    expect(sortFeed(posts, "top", NOW).map((p) => p.id)).toEqual([
      "vecchio-top",
      "medio",
      "recente",
    ]);
  });

  it("'hot' seppellisce il piu' votato di sempre", () => {
    const order = sortFeed(posts, "hot", NOW).map((p) => p.id);
    expect(order[0]).not.toBe("vecchio-top");
    expect(order.at(-1)).toBe("vecchio-top");
  });

  it("'hot' pesa i voti sull'eta', non sceglie uno dei due estremi", () => {
    // 40 voti in 10 ore battono 4 voti in 1 ora: e' trazione vera, non anzianita'.
    // Ma entrambi battono 300 voti raccolti sedici giorni fa.
    expect(sortFeed(posts, "hot", NOW).map((p) => p.id)).toEqual([
      "medio",
      "recente",
      "vecchio-top",
    ]);
  });

  it("a parita' di trazione vince il piu' recente", () => {
    const pair = [post("vecchio", 20, 12), post("nuovo", 20, 1)];
    expect(sortFeed(pair, "hot", NOW)[0]?.id).toBe("nuovo");
  });

  it("non muta l'array ricevuto", () => {
    const original = posts.map((p) => p.id);
    sortFeed(posts, "top", NOW);
    expect(posts.map((p) => p.id)).toEqual(original);
  });

  it("a parita' di voti 'top' usa la data come secondo criterio", () => {
    const tied = [post("a", 10, 50), post("b", 10, 2)];
    expect(sortFeed(tied, "top", NOW).map((p) => p.id)).toEqual(["b", "a"]);
  });

  it("regge la lista vuota", () => {
    expect(sortFeed([], "hot", NOW)).toEqual([]);
  });
});

describe("isFeedSort", () => {
  it("accetta solo i valori previsti", () => {
    expect(isFeedSort("hot")).toBe(true);
    expect(isFeedSort("new")).toBe(true);
    expect(isFeedSort("top")).toBe(true);
    expect(isFeedSort("qualsiasi")).toBe(false);
    expect(isFeedSort(undefined)).toBe(false);
  });
});

describe("relativeTime", () => {
  it("copre le soglie principali", () => {
    const at = (minutes: number) =>
      relativeTime(new Date(NOW.getTime() - minutes * 60_000).toISOString(), NOW);

    expect(at(0)).toBe("ora");
    expect(at(5)).toBe("5 min");
    expect(at(180)).toBe("3 h");
    expect(at(60 * 24 * 2)).toBe("2 g");
    expect(at(60 * 24 * 60)).toBe("2 mesi");
  });

  it("restituisce stringa vuota su una data non valida", () => {
    expect(relativeTime("non-una-data", NOW)).toBe("");
  });
});
