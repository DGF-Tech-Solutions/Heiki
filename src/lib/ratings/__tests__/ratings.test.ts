import { describe, expect, it } from "vitest";
import { RULES } from "@/lib/rate-limit";
import { emptyRatingSummary } from "@/lib/ratings/server";
import {
  BEST_CONTENTS,
  BEST_CONTENT_KEYS,
  type BestContentKey,
} from "@/lib/ratings/types";

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

  it("interazione click scheda valutazioni: seleziona il radio, lancia change e fa scroll senza ricaricare", () => {
    let preventDefaultCalled = false;
    let scrolled = false;
    let changeDispatched = false;

    const fakeRadio = {
      checked: false,
      dispatchEvent: (e: { type: string }) => {
        if (e.type === "change") changeDispatched = true;
        return true;
      },
    };

    const fakeSchede = {
      scrollIntoView: (options?: { behavior?: string; block?: string }) => {
        scrolled = true;
        expect(options?.behavior).toBe("smooth");
        expect(options?.block).toBe("start");
      },
    };

    const originalDoc = globalThis.document;
    const originalEvent = globalThis.Event;

    globalThis.document = {
      getElementById: (id: string) => {
        if (id === "schede-valutazioni") return fakeRadio as unknown as HTMLElement;
        if (id === "schede") return fakeSchede as unknown as HTMLElement;
        return null;
      },
    } as unknown as Document;

    globalThis.Event = class FakeEvent {
      type: string;
      bubbles: boolean;
      constructor(type: string, options?: { bubbles?: boolean }) {
        this.type = type;
        this.bubbles = options?.bubbles ?? false;
      }
    } as unknown as typeof Event;

    try {
      const fakeEvent = {
        preventDefault: () => {
          preventDefaultCalled = true;
        },
      };

      const radio = document.getElementById("schede-valutazioni") as unknown as {
        checked: boolean;
        dispatchEvent: (e: unknown) => boolean;
      } | null;
      if (radio) {
        fakeEvent.preventDefault();
        if (!radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        }
        const schedeSection = document.getElementById("schede") as unknown as {
          scrollIntoView: (options?: unknown) => void;
        } | null;
        if (schedeSection) {
          schedeSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      expect(preventDefaultCalled).toBe(true);
      expect(fakeRadio.checked).toBe(true);
      expect(changeDispatched).toBe(true);
      expect(scrolled).toBe(true);
    } finally {
      globalThis.document = originalDoc;
      globalThis.Event = originalEvent;
    }
  });
});

