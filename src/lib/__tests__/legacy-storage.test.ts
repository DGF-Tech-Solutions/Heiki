import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Lo spostamento delle chiavi `gachazone:` su `heiki:`. Il modulo si ricorda di averlo
 * gia' fatto, quindi ogni test lo ricarica da capo (vi.resetModules).
 *
 * Il caso che conta e' l'ultimo: prima, la lettura ricadeva sulla chiave vecchia e la
 * cancellazione toglieva solo la nuova, cosi' i dati di chi era entrato prima su quel
 * browser ricomparivano dopo essere stati dimenticati.
 */
function fakeStorage(start: Record<string, string>) {
  const data = new Map(Object.entries(start));
  return {
    data,
    storage: {
      get length() {
        return data.size;
      },
      key: (i: number) => [...data.keys()][i] ?? null,
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
      removeItem: (key: string) => void data.delete(key),
    },
  };
}

async function moveWith(start: Record<string, string>) {
  const fake = fakeStorage(start);
  vi.stubGlobal("window", { localStorage: fake.storage });
  vi.resetModules();
  const { moveLegacyStorage } = await import("../legacy-storage");
  moveLegacyStorage();
  return { ...fake, moveLegacyStorage };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("chiavi di prima del cambio di nome", () => {
  it("sposta ogni chiave gachazone: sulla heiki: con lo stesso resto, e lascia le altre", async () => {
    const { data } = await moveWith({
      "gachazone:grand-cross:box": "box",
      "gachazone:cookie-consent": "consenso",
      "gachazone:grand-cross:calcolatore:1575001": "calcolo",
      gz_tierlist_grand_cross: "bozza",
    });
    expect(Object.fromEntries(data)).toEqual({
      "heiki:grand-cross:box": "box",
      "heiki:cookie-consent": "consenso",
      "heiki:grand-cross:calcolatore:1575001": "calcolo",
      gz_tierlist_grand_cross: "bozza",
    });
  });

  it("se c'e' gia' la chiave nuova vale lei, e la vecchia sparisce lo stesso", async () => {
    const { data } = await moveWith({ "gachazone:grand-cross:box": "vecchio", "heiki:grand-cross:box": "nuovo" });
    expect(Object.fromEntries(data)).toEqual({ "heiki:grand-cross:box": "nuovo" });
  });

  it("i dati dimenticati non ricompaiono dalla chiave vecchia", async () => {
    const { data, storage, moveLegacyStorage } = await moveWith({
      "gachazone:grand-cross:box": "box di chi c'era prima",
      "gachazone:grand-cross:account-owner": "utente-a",
    });
    storage.removeItem("heiki:grand-cross:box");
    moveLegacyStorage();
    expect(data.has("heiki:grand-cross:box")).toBe(false);
    expect(data.has("gachazone:grand-cross:box")).toBe(false);
    expect(data.get("heiki:grand-cross:account-owner")).toBe("utente-a");
  });

  it("senza localStorage non si ferma", async () => {
    vi.stubGlobal("window", {
      get localStorage(): Storage {
        throw new Error("archiviazione bloccata");
      },
    });
    vi.resetModules();
    const { moveLegacyStorage } = await import("../legacy-storage");
    expect(() => moveLegacyStorage()).not.toThrow();
  });
});
