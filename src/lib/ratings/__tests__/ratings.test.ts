import { describe, expect, it, vi } from "vitest";
import {
  openRatingsTab,
  RATINGS_RADIO_ID,
  TABS_ID,
  type TabLinkClick,
} from "@/components/ratings/open-ratings-tab";
import { RULES } from "@/lib/rate-limit";
import { emptyRatingSummary } from "@/lib/ratings/server";
import {
  BEST_CONTENTS,
  BEST_CONTENT_KEYS,
  COMMENT_MAX_LENGTH,
  isBestContentKey,
  type BestContentKey,
} from "@/lib/ratings/types";
import { parseRatingForm, ratingInputSchema } from "@/lib/ratings/validation";

describe("ratings types e costanti", () => {
  it("definisce tutti gli 8 contenuti di gioco con etichette bilingue", () => {
    expect(BEST_CONTENT_KEYS).toHaveLength(8);
    for (const key of BEST_CONTENT_KEYS) {
      const entry = BEST_CONTENTS[key];
      expect(entry.key).toBe(key);
      expect(entry.label.it.length).toBeGreaterThan(0);
      expect(entry.label.en.length).toBeGreaterThan(0);
    }
  });

  it("include le modalita' cardine di Grand Cross", () => {
    const expectedKeys: BestContentKey[] = [
      "pvp",
      "creature-nest",
      "death-match",
      "demon-king",
      "supreme-deity",
      "hero-arena",
      "guild-boss",
      "general-pve",
    ];
    for (const key of expectedKeys) {
      expect(BEST_CONTENTS[key]).toBeDefined();
    }
  });

  it("isBestContentKey riconosce solo le chiavi vere, non quelle ereditate", () => {
    expect(isBestContentKey("pvp")).toBe(true);
    expect(isBestContentKey("raid")).toBe(false);
    // `in` direbbe di si': stanno sul prototipo di ogni oggetto
    expect(isBestContentKey("toString")).toBe(false);
    expect(isBestContentKey("__proto__")).toBe(false);
  });

  it("emptyRatingSummary restituisce uno stato azzerato pulito per l'eroe", () => {
    const summary = emptyRatingSummary("1575001");
    expect(summary.heroId).toBe("1575001");
    expect(summary.pveAvg).toBe(0);
    expect(summary.pvpAvg).toBe(0);
    expect(summary.totalRatings).toBe(0);
    expect(summary.distribution).toEqual([]);
    expect(summary.userRating).toBeNull();
    expect(summary.recentRatings).toEqual([]);
  });

  it("RULES contiene la regola heroRating con finestra e limite corretti", () => {
    expect(RULES.heroRating).toBeDefined();
    expect(RULES.heroRating.limit).toBe(30);
    expect(RULES.heroRating.windowSeconds).toBe(600);
  });
});

/**
 * Il modulo come lo manda la pagina: FormData, dove un campo che non c'e' vale
 * null. Fino al 24/10 lo schema voleva string | undefined, e chi votava senza
 * «dove spicca» o senza commento non riusciva a salvare: questi test l'avrebbero
 * preso.
 */
function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const BASE = { game: "grand-cross", heroId: "1575001", pveScore: "4", pvpScore: "3" };

describe("validazione della valutazione", () => {
  it("accetta un voto senza «dove spicca» ne' commento (campi assenti = null)", () => {
    const result = parseRatingForm(form(BASE), "it");
    expect(result).toEqual({
      ok: true,
      data: { ...BASE, pveScore: 4, pvpScore: 3, bestContent: null, comment: null },
    });
  });

  it("accetta anche i campi facoltativi undefined, passati allo schema senza FormData", () => {
    const parsed = ratingInputSchema("it").safeParse(BASE);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.bestContent).toBeNull();
    expect(parsed.data?.comment).toBeNull();
  });

  it("tratta stringhe vuote e soli spazi come nessuna scelta", () => {
    const result = parseRatingForm(form({ ...BASE, bestContent: "", comment: "   \n " }), "it");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.bestContent).toBeNull();
    expect(result.data.comment).toBeNull();

    const spaces = parseRatingForm(form({ ...BASE, bestContent: "  " }), "it");
    expect(spaces.ok && spaces.data.bestContent).toBeNull();
  });

  it("tiene il contenuto scelto e il commento ripulito dagli spazi ai lati", () => {
    const result = parseRatingForm(
      form({ ...BASE, bestContent: " demon-king ", comment: "  Ottimo contro il Re Demone.  " }),
      "it",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.bestContent).toBe("demon-king");
    expect(result.data.comment).toBe("Ottimo contro il Re Demone.");
  });

  it.each([
    ["0", "fuori scala in basso"],
    ["6", "fuori scala in alto"],
    ["3.5", "non intero"],
    ["", "vuoto"],
    ["abc", "non numerico"],
  ])("rifiuta un voto PvE %s (%s) col messaggio che dice cosa fare", (pveScore) => {
    const result = parseRatingForm(form({ ...BASE, pveScore }), "it");
    expect(result).toEqual({ ok: false, error: "Seleziona un voto PvE da 1 a 5 stelle." });
  });

  it("rifiuta un voto PvP assente (null da FormData)", () => {
    const { pvpScore: _omesso, ...senzaPvp } = BASE;
    const result = parseRatingForm(form(senzaPvp), "en");
    expect(result).toEqual({ ok: false, error: "Please select a PvP rating between 1 and 5 stars." });
  });

  it("rifiuta un contenuto che non esiste", () => {
    const result = parseRatingForm(form({ ...BASE, bestContent: "raid" }), "it");
    expect(result).toEqual({ ok: false, error: "Dati della valutazione non validi." });
  });

  it(`rifiuta un commento di ${COMMENT_MAX_LENGTH + 1} caratteri e accetta quello di ${COMMENT_MAX_LENGTH}`, () => {
    const lungo = parseRatingForm(form({ ...BASE, comment: "a".repeat(COMMENT_MAX_LENGTH + 1) }), "it");
    expect(lungo).toEqual({ ok: false, error: "Il commento non può superare i 280 caratteri." });

    const giusto = parseRatingForm(form({ ...BASE, comment: "a".repeat(COMMENT_MAX_LENGTH) }), "it");
    expect(giusto.ok).toBe(true);

    // si conta dopo aver tolto gli spazi ai lati, come si salva
    const conSpazi = parseRatingForm(form({ ...BASE, comment: `  ${"a".repeat(COMMENT_MAX_LENGTH)}  ` }), "en");
    expect(conSpazi.ok).toBe(true);
  });

  it("rifiuta gioco o eroe assenti invece di passarli al database", () => {
    const { game: _gioco, ...senzaGioco } = BASE;
    expect(parseRatingForm(form(senzaGioco), "en")).toEqual({ ok: false, error: "Invalid rating data." });
    expect(parseRatingForm(form({ ...BASE, heroId: "  " }), "it")).toEqual({
      ok: false,
      error: "Dati della valutazione non validi.",
    });
  });
});

/** Un documento finto con la scheda Valutazioni: registra cosa succede, in ordine. */
function fakePage({ checked = false, withRadio = true } = {}) {
  const log: string[] = [];
  const radio = {
    checked,
    dispatchEvent: vi.fn((event: Event) => {
      log.push(`evento:${event.type}:${event.bubbles}`);
      return true;
    }),
    focus: vi.fn((options?: FocusOptions) => {
      log.push(`fuoco:${options?.preventScroll}`);
    }),
  };
  const schede = {
    scrollIntoView: vi.fn((options?: ScrollIntoViewOptions) => {
      log.push(`scorri:${options?.behavior}:${options?.block}`);
    }),
  };
  const doc = {
    getElementById: (id: string) => {
      if (id === RATINGS_RADIO_ID && withRadio) return radio as unknown as HTMLElement;
      if (id === TABS_ID) return schede as unknown as HTMLElement;
      return null;
    },
  };
  return { log, radio, schede, doc };
}

function click(overrides: Partial<TabLinkClick> = {}) {
  const event = {
    button: 0,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    preventDefault: vi.fn(),
    ...overrides,
  };
  return event;
}

describe("clic sul badge delle valutazioni (openRatingsTab)", () => {
  it("accende la scheda, lancia change, porta il fuoco senza salto e scorre morbido", () => {
    const { log, radio, doc } = fakePage();
    const event = click();
    openRatingsTab(event, doc);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(radio.checked).toBe(true);
    // il fuoco prima dello scorrimento, e senza il salto immediato del browser
    expect(log).toEqual(["evento:change:true", "fuoco:true", "scorri:smooth:start"]);
  });

  it("con la scheda gia' accesa non rilancia change, ma porta comunque fuoco e pagina", () => {
    const { log, radio, doc } = fakePage({ checked: true });
    openRatingsTab(click(), doc);

    expect(radio.dispatchEvent).not.toHaveBeenCalled();
    expect(log).toEqual(["fuoco:true", "scorri:smooth:start"]);
  });

  it.each([
    ["Ctrl", { ctrlKey: true }],
    ["Cmd", { metaKey: true }],
    ["Shift", { shiftKey: true }],
    ["Alt", { altKey: true }],
    ["tasto centrale", { button: 1 }],
    ["evento gia' gestito", { defaultPrevented: true }],
  ] as const)("con %s lascia fare al browser (scheda o finestra nuova)", (_nome, overrides) => {
    const { log, radio, doc } = fakePage();
    const event = click(overrides);
    openRatingsTab(event, doc);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(radio.checked).toBe(false);
    expect(log).toEqual([]);
  });

  it("senza le schede nella pagina il collegamento fa il suo giro normale", () => {
    const { log, doc } = fakePage({ withRadio: false });
    const event = click();
    openRatingsTab(event, doc);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(log).toEqual([]);
  });
});
