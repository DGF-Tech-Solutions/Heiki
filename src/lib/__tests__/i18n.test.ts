import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, inLingua, intlLocale, isLocale, LOCALES, ogLocale, testi } from "../i18n/locale";

describe("le lingue del sito", () => {
  it("sono italiano e inglese, e senza scelta si parte dall'italiano", () => {
    expect([...LOCALES]).toEqual(["it", "en"]);
    expect(DEFAULT_LOCALE).toBe("it");
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("un'etichetta dei dati esce nella lingua chiesta, e se manca nell'altra", () => {
    expect(inLingua({ it: "Velocità", en: "Speed" }, "en")).toBe("Speed");
    expect(inLingua({ it: "Velocità", en: "Speed" }, "it")).toBe("Velocità");
    expect(inLingua({ it: null, en: "Speed" }, "it")).toBe("Speed");
    expect(inLingua({ it: "Velocità", en: null }, "en")).toBe("Velocità");
    expect(inLingua(null, "it")).toBeNull();
  });

  it("i testi di un componente tengono le due lingue, anche come funzioni", () => {
    const TESTI = testi({
      it: { titolo: "Eroi", quanti: (n: number) => `${n} eroi` },
      en: { titolo: "Heroes", quanti: (n: number) => `${n} heroes` },
    });
    expect(TESTI.en.titolo).toBe("Heroes");
    expect(TESTI.it.quanti(3)).toBe("3 eroi");
  });

  it("date, numeri e Open Graph seguono la lingua", () => {
    expect(intlLocale("it")).toBe("it-IT");
    expect(intlLocale("en")).toBe("en-US");
    expect(ogLocale("en")).toBe("en_US");
    // in italiano il separatore delle migliaia comincia dalle cinque cifre
    expect((12345.5).toLocaleString(intlLocale("it"))).toBe("12.345,5");
    expect((12345.5).toLocaleString(intlLocale("en"))).toBe("12,345.5");
  });
});
