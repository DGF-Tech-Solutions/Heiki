import { beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimit, resetRateLimits, retryMessage, RULES } from "../rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.useRealTimers();
  });

  it("consente esattamente i tentativi previsti dalla regola", () => {
    const { limit } = RULES.login;

    for (let attempt = 1; attempt <= limit; attempt += 1) {
      const result = rateLimit("login", "a@example.com");
      expect(result.allowed, `tentativo ${attempt}`).toBe(true);
      expect(result.remaining).toBe(limit - attempt);
    }

    expect(rateLimit("login", "a@example.com").allowed).toBe(false);
  });

  it("conta separatamente chiavi diverse", () => {
    for (let attempt = 0; attempt < RULES.login.limit; attempt += 1) {
      rateLimit("login", "a@example.com");
    }

    expect(rateLimit("login", "a@example.com").allowed).toBe(false);
    expect(rateLimit("login", "b@example.com").allowed).toBe(true);
  });

  it("conta separatamente regole diverse sulla stessa chiave", () => {
    for (let attempt = 0; attempt < RULES.passwordReset.limit; attempt += 1) {
      rateLimit("passwordReset", "a@example.com");
    }

    expect(rateLimit("passwordReset", "a@example.com").allowed).toBe(false);
    // Aver esaurito i recuperi password non deve impedire di provare a entrare.
    expect(rateLimit("login", "a@example.com").allowed).toBe(true);
  });

  it("riapre dopo la finestra", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    for (let attempt = 0; attempt < RULES.login.limit; attempt += 1) {
      rateLimit("login", "c@example.com");
    }
    expect(rateLimit("login", "c@example.com").allowed).toBe(false);

    vi.advanceTimersByTime(RULES.login.windowSeconds * 1000 + 1);
    expect(rateLimit("login", "c@example.com").allowed).toBe(true);
  });

  /**
   * E' la ragione per cui la finestra e' scorrevole e non a intervalli fissi:
   * con gli intervalli fissi, consumando il limite in fondo a uno e all'inizio
   * del successivo si otterrebbe il doppio dei tentativi in pochi secondi.
   */
  it("non permette il doppio dei tentativi a cavallo di due finestre", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const { limit, windowSeconds } = RULES.login;

    // quasi alla fine della prima finestra teorica
    vi.advanceTimersByTime((windowSeconds - 1) * 1000);
    for (let attempt = 0; attempt < limit; attempt += 1) {
      expect(rateLimit("login", "d@example.com").allowed).toBe(true);
    }

    // due secondi dopo: con gli intervalli fissi qui ricomincerebbe da zero
    vi.advanceTimersByTime(2000);
    expect(rateLimit("login", "d@example.com").allowed).toBe(false);
  });

  it("indica quanto attendere, mai zero quando è bloccato", () => {
    for (let attempt = 0; attempt < RULES.login.limit; attempt += 1) {
      rateLimit("login", "e@example.com");
    }

    const blocked = rateLimit("login", "e@example.com");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThanOrEqual(1);
    expect(blocked.retryAfter).toBeLessThanOrEqual(RULES.login.windowSeconds);
  });
});

describe("retryMessage", () => {
  it("usa i secondi sotto il minuto", () => {
    expect(retryMessage({ allowed: false, remaining: 0, retryAfter: 30 })).toContain("30 secondi");
  });

  it("usa i minuti sopra il minuto, arrotondando per eccesso", () => {
    expect(retryMessage({ allowed: false, remaining: 0, retryAfter: 61 })).toContain("2 minuti");
  });

  it("declina il singolare", () => {
    expect(retryMessage({ allowed: false, remaining: 0, retryAfter: 60 })).toContain("1 minuto");
  });
});
