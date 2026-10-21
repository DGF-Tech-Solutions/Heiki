/**
 * Test dell'avviso ai moderatori su Discord (discord.ts): senza webhook non parte
 * niente, con un indirizzo che non e' di Discord nemmeno, e il messaggio non puo'
 * menzionare nessuno ne' portare file.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyModerators } from "../discord";

const MESSAGE = {
  title: "Nuova schermata da verificare",
  path: "/moderazione",
  fields: [{ name: "Utente", value: "@everyone" }],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("l'avviso ai moderatori", () => {
  it("senza webhook non fa niente", async () => {
    vi.stubEnv("DISCORD_WEBHOOK_MODERAZIONE", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await notifyModerators(MESSAGE)).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("un indirizzo che non e' un webhook di Discord non si chiama", async () => {
    vi.stubEnv("DISCORD_WEBHOOK_MODERAZIONE", "https://example.com/api/webhooks/1/x");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await notifyModerators(MESSAGE)).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("manda un messaggio senza menzioni, col collegamento alla coda", async () => {
    vi.stubEnv("DISCORD_WEBHOOK_MODERAZIONE", "https://discord.com/api/webhooks/123/abc");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://heiki.example");
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetch);
    expect(await notifyModerators(MESSAGE)).toBe(true);
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe("https://discord.com/api/webhooks/123/abc");
    const body = JSON.parse(init.body);
    expect(body.username).toBe("Heiki");
    expect(body.allowed_mentions).toEqual({ parse: [] });
    expect(body.embeds[0].url).toBe("https://heiki.example/moderazione");
    expect(body.attachments).toBeUndefined();
    expect(body.files).toBeUndefined();
  });

  it("se Discord non risponde non lancia", async () => {
    vi.stubEnv("DISCORD_WEBHOOK_MODERAZIONE", "https://discord.com/api/webhooks/123/abc");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("rete")));
    expect(await notifyModerators(MESSAGE)).toBe(false);
  });
});
