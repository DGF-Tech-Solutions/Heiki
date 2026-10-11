import { afterEach, describe, expect, it } from "vitest";
import { clientIp, normalizeIp } from "@/lib/security/client-ip";
import { displayNameProblem, isReservedEmail, isReservedHandle } from "@/lib/auth/handles";
import { PASSWORD_MAX_BYTES, passwordTooLong } from "@/lib/auth/password-policy";
import { rateLimit, resetRateLimits, RULES } from "@/lib/rate-limit";

describe("indirizzo di chi chiama", () => {
  it("prende l'ultima voce di X-Forwarded-For, quella scritta dal proxy", () => {
    const headers = new Headers({ "x-forwarded-for": "6.6.6.6, 10.0.0.1, 203.0.113.7" });
    expect(clientIp(headers)).toBe("203.0.113.7");
  });

  it("senza intestazioni non inventa niente", () => {
    expect(clientIp(new Headers())).toBe("sconosciuto");
    expect(normalizeIp("non-un-indirizzo")).toBe("sconosciuto");
    expect(normalizeIp("1.2.3.4".repeat(20))).toBe("sconosciuto");
  });

  it("toglie la porta e riconosce gli IPv4 dentro IPv6", () => {
    expect(normalizeIp("1.2.3.4:5678")).toBe("1.2.3.4");
    expect(normalizeIp("::ffff:1.2.3.4")).toBe("1.2.3.4");
    expect(normalizeIp("[2001:db8::1]:443")).toBe("2001:db8:0:0::/64");
  });

  it("un IPv6 conta per la sua rete /64: cambiare indirizzo nella rete non azzera il conto", () => {
    expect(normalizeIp("2001:db8:aa:bb:1:2:3:4")).toBe(normalizeIp("2001:db8:aa:bb:ffff::9"));
    expect(normalizeIp("2001:db8:aa:bb::1")).not.toBe(normalizeIp("2001:db8:aa:bc::1"));
    expect(normalizeIp("::1")).toBe("0:0:0:0::/64");
  });
});

describe("handle e nomi", () => {
  it("riserva i nomi dello staff e il segnaposto degli account cancellati", () => {
    for (const handle of ["admin", "Moderatore", "staff", "gachazone", "eliminato-1a2b3c4d", "mod-team"]) {
      expect(isReservedHandle(handle)).toBe(true);
    }
    for (const handle of ["mario", "derieri_fan", "giocatore-1a2b3c", "modesto"]) {
      expect(isReservedHandle(handle)).toBe(false);
    }
  });

  it("rifiuta nomi con caratteri invisibili o che imitano lo staff", () => {
    expect(displayNameProblem("Mario Rossi")).toBeNull();
    expect(displayNameProblem("Giulia ♥")).toBeNull();
    expect(displayNameProblem("Mario\u202eissoR")).toBe("invisibile");
    expect(displayNameProblem("Ma\u200brio")).toBe("invisibile");
    expect(displayNameProblem("Amministratore")).toBe("staff");
    expect(displayNameProblem("Team GachaZone")).toBe("staff");
    // lettere a larghezza piena che si leggono come quelle normali
    expect(displayNameProblem("\uff21\uff44\uff4d\uff49\uff4e")).toBe("staff");
  });

  it("le email dei segnaposto non si registrano", () => {
    expect(isReservedEmail("eliminato+1a2b3c4d@gachazone.invalid")).toBe(true);
    expect(isReservedEmail("mario@example.com")).toBe(false);
  });
});

describe("password", () => {
  it("oltre i 72 byte bcrypt ignorerebbe il resto: si rifiuta", () => {
    expect(passwordTooLong("a".repeat(PASSWORD_MAX_BYTES))).toBe(false);
    expect(passwordTooLong("a".repeat(PASSWORD_MAX_BYTES + 1))).toBe(true);
    // 37 lettere accentate sono 74 byte
    expect(passwordTooLong("è".repeat(37))).toBe(true);
  });
});

describe("limitatore", () => {
  afterEach(() => resetRateLimits());

  it("una chiave enorme non resta in memoria intera", () => {
    const huge = "x".repeat(1_000_000);
    rateLimit("login", huge);
    const stored = [...(globalThis.__gachazoneRateLimit?.keys() ?? [])];
    expect(stored).toHaveLength(1);
    expect(stored[0]!.length).toBeLessThan(100);
  });

  it("molte chiavi diverse non fanno crescere la memoria all'infinito", () => {
    for (let i = 0; i < 60_000; i++) rateLimit("credentialsIp", `ip-${i}`);
    expect(globalThis.__gachazoneRateLimit?.size ?? 0).toBeLessThanOrEqual(50_000);
    // chi e' appena passato e' ancora contato
    expect(rateLimit("credentialsIp", "ip-59999").remaining).toBe(RULES.credentialsIp.limit - 2);
  });

  it("i tentativi su una coppia email+indirizzo non bloccano la stessa email da un altro indirizzo", () => {
    for (let i = 0; i < RULES.login.limit; i++) rateLimit("login", "vittima@x.it|6.6.6.6");
    expect(rateLimit("login", "vittima@x.it|6.6.6.6").allowed).toBe(false);
    expect(rateLimit("login", "vittima@x.it|203.0.113.7").allowed).toBe(true);
  });
});
