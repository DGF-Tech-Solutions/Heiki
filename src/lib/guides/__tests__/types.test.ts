import { describe, expect, it } from "vitest";
import { guideSlug, isStale, STATUS_LABELS, GUIDE_STATUSES } from "../types";

describe("guideSlug", () => {
  it("ricava un indirizzo leggibile dal titolo", () => {
    expect(guideSlug("Rotazione base per una squadra fisica")).toBe(
      "rotazione-base-per-una-squadra-fisica",
    );
  });

  it("non ruba l'indirizzo a una guida che esiste già", () => {
    const taken = new Set(["come-si-legge-una-simulazione"]);
    expect(guideSlug("Come si legge una simulazione", taken)).toBe(
      "come-si-legge-una-simulazione-2",
    );
  });

  it("continua a incrementare finché trova posto", () => {
    const taken = new Set(["nota", "nota-2", "nota-3"]);
    expect(guideSlug("Nota", taken)).toBe("nota-4");
  });

  it("un titolo senza caratteri utili non produce un indirizzo vuoto", () => {
    expect(guideSlug("!!! ??? ***")).toBe("guida");
  });
});

describe("isStale", () => {
  it("una patch diversa da quella corrente è da rivedere", () => {
    expect(isStale("6.1", "6.2")).toBe(true);
  });

  it("la patch corrente non è da rivedere", () => {
    expect(isStale("6.2", "6.2")).toBe(false);
  });

  /**
   * Non aver dichiarato niente e' proprio la condizione da segnalare: e' il
   * caso in cui chi legge non ha modo di sapere quanto sono vecchi i numeri.
   */
  it("nessuna dichiarazione conta come da rivedere", () => {
    expect(isStale(null, "6.2")).toBe(true);
  });
});

describe("etichette degli stati", () => {
  it("ogni stato ha un'etichetta in italiano", () => {
    for (const status of GUIDE_STATUSES) {
      expect(STATUS_LABELS[status]).toBeTruthy();
    }
  });
});
