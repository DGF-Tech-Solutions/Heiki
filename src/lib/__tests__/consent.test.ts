import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearConsent,
  CONSENT_KEY,
  CONSENT_VERSION,
  readConsent,
  writeConsent,
} from "../consent";

/**
 * I test girano in ambiente node: `window` non esiste, quindi va simulato.
 * Si simula solo cio' che il modulo usa davvero - localStorage - perche' un
 * finto completo di window nasconderebbe un uso accidentale di altre API.
 */
function fakeStorage(options: { throwOnGet?: boolean; throwOnSet?: boolean } = {}) {
  const data = new Map<string, string>();

  return {
    data,
    storage: {
      getItem(key: string): string | null {
        if (options.throwOnGet) throw new Error("archiviazione bloccata");
        return data.get(key) ?? null;
      },
      setItem(key: string, value: string): void {
        if (options.throwOnSet) throw new Error("archiviazione piena");
        data.set(key, value);
      },
      removeItem(key: string): void {
        data.delete(key);
      },
    },
  };
}

function install(storage: unknown): void {
  vi.stubGlobal("window", { localStorage: storage });
}

describe("consenso ai cookie", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lato server risponde «non ha scelto» senza esplodere", () => {
    expect(typeof window).toBe("undefined");
    expect(readConsent()).toBe("unset");
    // Non deve lanciare: viene chiamata anche durante il rendering sul server.
    expect(() => writeConsent("granted")).not.toThrow();
  });

  it("distingue i tre stati", () => {
    const { storage } = fakeStorage();
    install(storage);

    expect(readConsent()).toBe("unset");

    writeConsent("denied");
    expect(readConsent()).toBe("denied");

    writeConsent("granted");
    expect(readConsent()).toBe("granted");
  });

  it("registra data e versione della scelta", () => {
    const { storage, data } = fakeStorage();
    install(storage);

    writeConsent("granted");

    const stored = JSON.parse(data.get(CONSENT_KEY) ?? "{}") as Record<string, unknown>;
    expect(stored.state).toBe("granted");
    expect(stored.version).toBe(CONSENT_VERSION);
    expect(typeof stored.decidedAt).toBe("string");
  });

  /**
   * E' il motivo per cui la versione e' memorizzata: se le categorie di cookie
   * cambiano, il consenso raccolto sulle vecchie non vale piu' e il banner
   * deve ricomparire.
   */
  it("ignora un consenso dato su una versione precedente", () => {
    const { storage, data } = fakeStorage();
    install(storage);

    data.set(
      CONSENT_KEY,
      JSON.stringify({ state: "granted", decidedAt: "2026-01-01T00:00:00.000Z", version: 0 }),
    );

    expect(readConsent()).toBe("unset");
  });

  it("ignora contenuto illeggibile o manomesso", () => {
    const { storage, data } = fakeStorage();
    install(storage);

    data.set(CONSENT_KEY, "{non-json");
    expect(readConsent()).toBe("unset");

    data.set(CONSENT_KEY, JSON.stringify({ state: "forse", version: CONSENT_VERSION }));
    expect(readConsent()).toBe("unset");
  });

  it("se l'archiviazione è bloccata non installa niente", () => {
    install(fakeStorage({ throwOnGet: true }).storage);
    expect(readConsent()).toBe("unset");
  });

  it("se la scrittura fallisce non lancia: il banner ricomparirà", () => {
    install(fakeStorage({ throwOnSet: true }).storage);
    expect(() => writeConsent("granted")).not.toThrow();
    expect(readConsent()).toBe("unset");
  });

  it("azzerare la scelta riporta a «non ha scelto»", () => {
    const { storage } = fakeStorage();
    install(storage);

    writeConsent("granted");
    clearConsent();

    expect(readConsent()).toBe("unset");
  });
});
