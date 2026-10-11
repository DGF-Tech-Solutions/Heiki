import { describe, expect, it } from "vitest";
import {
  contentSecurityPolicy,
  isProtectedPath,
  newNonce,
  staticSecurityHeaders,
} from "@/lib/security/headers";

function directives(policy: string): Map<string, string[]> {
  return new Map(
    policy.split(";").map((part) => {
      const [name, ...values] = part.trim().split(/\s+/);
      return [name ?? "", values];
    }),
  );
}

describe("Content-Security-Policy", () => {
  const base = { nonce: "abc123==", dev: false, https: true, oauthProviders: [] as string[] };

  it("in produzione gli script valgono solo col nonce, senza eval ne' inline", () => {
    const script = directives(contentSecurityPolicy(base)).get("script-src") ?? [];
    expect(script).toContain("'nonce-abc123=='");
    expect(script).toContain("'strict-dynamic'");
    expect(script).not.toContain("'unsafe-eval'");
    expect(script).not.toContain("'unsafe-inline'");
  });

  it("nessuno puo' incorniciare il sito, niente plugin, niente <base> altrui", () => {
    const d = directives(contentSecurityPolicy(base));
    expect(d.get("frame-ancestors")).toEqual(["'none'"]);
    expect(d.get("object-src")).toEqual(["'none'"]);
    expect(d.get("base-uri")).toEqual(["'self'"]);
    expect(d.get("form-action")).toEqual(["'self'"]);
  });

  it("i moduli possono portare solo ai provider OAuth attivi", () => {
    const d = directives(contentSecurityPolicy({ ...base, oauthProviders: ["discord", "sconosciuto"] }));
    expect(d.get("form-action")).toEqual(["'self'", "https://discord.com"]);
  });

  it("in sviluppo eval e websocket per Turbopack; upgrade solo in https", () => {
    const dev = directives(contentSecurityPolicy({ ...base, dev: true, https: false }));
    expect(dev.get("script-src")).toContain("'unsafe-eval'");
    expect(dev.get("connect-src")).toContain("ws:");
    expect(dev.has("upgrade-insecure-requests")).toBe(false);
    expect(directives(contentSecurityPolicy(base)).has("upgrade-insecure-requests")).toBe(true);
  });

  it("il nonce e' nuovo ogni volta e lungo 128 bit", () => {
    const seen = new Set(Array.from({ length: 50 }, newNonce));
    expect(seen.size).toBe(50);
    for (const nonce of seen) expect(atob(nonce)).toHaveLength(16);
  });
});

describe("intestazioni fisse", () => {
  it("nosniff, niente cornici, permessi del browser spenti; HSTS solo in produzione", () => {
    const dev = new Map(staticSecurityHeaders(false).map((h) => [h.key, h.value]));
    const prod = new Map(staticSecurityHeaders(true).map((h) => [h.key, h.value]));
    expect(dev.get("X-Content-Type-Options")).toBe("nosniff");
    expect(dev.get("X-Frame-Options")).toBe("DENY");
    expect(dev.get("Permissions-Policy")).toContain("camera=()");
    expect(dev.has("Strict-Transport-Security")).toBe(false);
    expect(prod.get("Strict-Transport-Security")).toMatch(/^max-age=\d{8,}/);
  });
});

describe("pagine private", () => {
  it("riconosce le sezioni e le loro sottopagine, non i nomi che cominciano uguale", () => {
    expect(isProtectedPath("/admin")).toBe(true);
    expect(isProtectedPath("/impostazioni/account")).toBe(true);
    expect(isProtectedPath("/moderazione")).toBe(true);
    expect(isProtectedPath("/notifiche")).toBe(true);
    expect(isProtectedPath("/administrator")).toBe(false);
    expect(isProtectedPath("/grand-cross/eroi")).toBe(false);
    expect(isProtectedPath("/")).toBe(false);
  });
});
