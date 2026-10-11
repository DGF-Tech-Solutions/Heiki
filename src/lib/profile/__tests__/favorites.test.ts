/**
 * I preferiti arrivano da due fonti non fidate, come i cosmetici: la colonna
 * jsonb (dove ci sono ancora i nomi di testo libero di prima dell'11/10) e il
 * payload dell'editor. Qui si verifica che ne esca sempre un elenco di eroi
 * veri, ordinato come l'ha scelto l'utente e mai piu' lungo del limite.
 */

import { describe, expect, it } from "vitest";
import { getGameModule } from "@/lib/games/registry";
import {
  FAVORITES_LIMIT,
  favoriteKey,
  moveItem,
  normalizeFavorites,
  parseFavorite,
  type RosterOf,
} from "../favorites";

const ROSTER = ["1000001", "1000002", "1000003", "1000004", "1000005", "1000006", "1000007", "1000008", "1000009"];
const fake: RosterOf = (game) => (game === "grand-cross" ? ROSTER.map((id) => ({ id })) : undefined);
const real: RosterOf = (game) => getGameModule(game)?.roster?.heroes;

describe("parseFavorite", () => {
  it("legge gioco e id da un riferimento ben formato", () => {
    expect(parseFavorite("grand-cross:1575001")).toEqual({ game: "grand-cross", heroId: "1575001" });
    expect(parseFavorite(" grand-cross:1575001 ")).toEqual({ game: "grand-cross", heroId: "1575001" });
  });

  it("scarta il testo libero di prima e le forme sbagliate", () => {
    for (const value of ["Unità Forza", "grand-cross:157500", "grand-cross:15750011", "Grand-Cross:1575001", ":1575001", "grand-cross:", 1575001, null, undefined, {}]) {
      expect(parseFavorite(value)).toBeNull();
    }
  });

  it("e' l'inverso di favoriteKey", () => {
    const ref = parseFavorite(favoriteKey("grand-cross", "2007501"));
    expect(ref).toEqual({ game: "grand-cross", heroId: "2007501" });
  });
});

describe("normalizeFavorites", () => {
  it("conserva l'ordine scelto", () => {
    const chosen = ["grand-cross:1000003", "grand-cross:1000001", "grand-cross:1000002"];
    expect(normalizeFavorites(chosen, fake)).toEqual(chosen);
  });

  it("toglie doppioni tenendo il primo, cioe' la posizione scelta", () => {
    const result = normalizeFavorites(["grand-cross:1000002", "grand-cross:1000001", "grand-cross:1000002"], fake);
    expect(result).toEqual(["grand-cross:1000002", "grand-cross:1000001"]);
  });

  it("toglie eroi che il roster non conosce e giochi che non esistono", () => {
    const result = normalizeFavorites(["grand-cross:9999999", "altro-gioco:1000001", "grand-cross:1000004"], fake);
    expect(result).toEqual(["grand-cross:1000004"]);
  });

  it("toglie in silenzio i preferiti di testo libero", () => {
    expect(normalizeFavorites(["Unità Forza", "Unità Destrezza"], fake)).toEqual([]);
  });

  it("non supera il limite", () => {
    const all = ROSTER.map((id) => favoriteKey("grand-cross", id));
    const result = normalizeFavorites(all, fake);
    expect(result).toHaveLength(FAVORITES_LIMIT);
    expect(result).toEqual(all.slice(0, FAVORITES_LIMIT));
  });

  it("il limite conta gli eroi validi, non le voci ricevute", () => {
    const noisy = ["x", "grand-cross:9999999", ...ROSTER.map((id) => favoriteKey("grand-cross", id))];
    expect(normalizeFavorites(noisy, fake)).toHaveLength(FAVORITES_LIMIT);
  });

  it("regge valori che non sono elenchi", () => {
    for (const value of [null, undefined, "grand-cross:1000001", 42, { 0: "grand-cross:1000001" }]) {
      expect(normalizeFavorites(value, fake)).toEqual([]);
    }
  });

  it("riconosce gli eroi veri del roster di Grand Cross", () => {
    const chosen = ["grand-cross:1575001", "grand-cross:2007501", "grand-cross:2017501"];
    expect(normalizeFavorites(chosen, real)).toEqual(chosen);
    expect(normalizeFavorites(["grand-cross:0000000"], real)).toEqual([]);
  });
});

describe("moveItem", () => {
  it("sposta senza toccare l'elenco ricevuto", () => {
    const items = ["a", "b", "c"];
    expect(moveItem(items, 2, 0)).toEqual(["c", "a", "b"]);
    expect(items).toEqual(["a", "b", "c"]);
  });

  it("fuori dai bordi lascia l'elenco com'e'", () => {
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 1, 2)).toEqual(["a", "b"]);
  });
});
