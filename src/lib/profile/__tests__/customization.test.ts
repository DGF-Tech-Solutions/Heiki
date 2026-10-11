/**
 * I cosmetici arrivano da due fonti non fidate: la colonna jsonb del database
 * (che puo' contenere un'opzione ritirata mesi fa) e il payload del client (che
 * puo' contenere qualsiasi cosa). Queste funzioni sono il punto in cui entrambe
 * vengono ricondotte a valori validi.
 */

import { describe, expect, it } from "vitest";
import {
  BADGE_SHOWCASE_LIMIT,
  CUSTOMIZATION_GROUPS,
  DEFAULT_CUSTOMIZATION,
  isPremiumOption,
  normalizeCustomization,
  optionsFor,
  readShowcaseChosen,
  SHOWCASE_FLAG_CHOSEN,
  SHOWCASE_FLAG_KEY,
  stripPremium,
  toCosmeticRecord,
} from "../customization";
import { levelFromXp, levelProgress, xpForLevel, MAX_LEVEL } from "../level";

describe("normalizeCustomization", () => {
  it("conserva una combinazione valida", () => {
    const input = { accent: "ocean", frame: "notched", background: "dots", layout: "compact" };
    expect(normalizeCustomization(input)).toEqual(input);
  });

  it("sostituisce con il default un'opzione sconosciuta", () => {
    const result = normalizeCustomization({ accent: "arcobaleno", frame: "notched" });
    expect(result.accent).toBe(DEFAULT_CUSTOMIZATION.accent);
    expect(result.frame).toBe("notched");
  });

  it("regge valori non stringa senza rompersi", () => {
    const result = normalizeCustomization({ accent: 42, frame: null, background: [], layout: {} });
    expect(result).toEqual(DEFAULT_CUSTOMIZATION);
  });

  it("regge null, undefined e tipi primitivi", () => {
    expect(normalizeCustomization(null)).toEqual(DEFAULT_CUSTOMIZATION);
    expect(normalizeCustomization(undefined)).toEqual(DEFAULT_CUSTOMIZATION);
    expect(normalizeCustomization("brand")).toEqual(DEFAULT_CUSTOMIZATION);
  });

  it("ignora chiavi estranee invece di propagarle", () => {
    const result = normalizeCustomization({ accent: "ocean", isAdmin: true });
    expect(Object.keys(result).sort()).toEqual(["accent", "background", "frame", "layout"]);
  });
});

describe("stripPremium", () => {
  it("lascia intatte le scelte di chi ha il premium", () => {
    const chosen = { accent: "sunset", frame: "glow", background: "wash", layout: "editorial" };
    expect(stripPremium(chosen, true)).toEqual(chosen);
  });

  it("riporta al default solo le opzioni premium", () => {
    const chosen = { accent: "sunset", frame: "notched", background: "wash", layout: "compact" };
    const result = stripPremium(chosen, false);

    expect(result.accent).toBe(DEFAULT_CUSTOMIZATION.accent);
    expect(result.background).toBe(DEFAULT_CUSTOMIZATION.background);
    // queste due non sono premium e devono restare
    expect(result.frame).toBe("notched");
    expect(result.layout).toBe("compact");
  });

  it("non muta l'oggetto ricevuto", () => {
    const chosen = { accent: "sunset", frame: "glow", background: "grid", layout: "standard" };
    stripPremium(chosen, false);
    expect(chosen.accent).toBe("sunset");
  });
});

describe("catalogo cosmetici", () => {
  it("ogni gruppo ha un default valido e almeno un'opzione gratuita", () => {
    for (const group of CUSTOMIZATION_GROUPS) {
      const options = optionsFor(group.key);
      expect(options.length).toBeGreaterThan(0);
      expect(options.some((option) => option.id === DEFAULT_CUSTOMIZATION[group.key])).toBe(true);
      expect(options.some((option) => !option.premium)).toBe(true);
    }
  });

  it("nessun default e' a pagamento: chi non paga deve avere un profilo completo", () => {
    for (const group of CUSTOMIZATION_GROUPS) {
      expect(isPremiumOption(group.key, DEFAULT_CUSTOMIZATION[group.key])).toBe(false);
    }
  });

  it("gli id sono unici dentro ogni gruppo", () => {
    for (const group of CUSTOMIZATION_GROUPS) {
      const ids = optionsFor(group.key).map((option) => option.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("la vetrina ha un limite dichiarato", () => {
    expect(BADGE_SHOWCASE_LIMIT).toBeGreaterThan(0);
  });
});

describe("toCosmeticRecord", () => {
  it("produce esattamente le chiavi persistite", () => {
    const record = toCosmeticRecord(DEFAULT_CUSTOMIZATION);
    expect(Object.keys(record).sort()).toEqual(["accent", "background", "frame", "layout"]);
    expect(Object.values(record).every((value) => typeof value === "string")).toBe(true);
  });

  it("il giro completo salva-e-rileggi non perde informazione", () => {
    const chosen = { accent: "gold", frame: "glow", background: "stripes", layout: "editorial" };
    expect(normalizeCustomization(toCosmeticRecord(chosen))).toEqual(chosen);
  });
});

describe("segno della vetrina scelta", () => {
  it("si scrive solo se richiesto, e non diventa un cosmetico", () => {
    const record = toCosmeticRecord(DEFAULT_CUSTOMIZATION, { showcaseChosen: true });
    expect(record[SHOWCASE_FLAG_KEY]).toBe(SHOWCASE_FLAG_CHOSEN);
    expect(normalizeCustomization(record)).toEqual(DEFAULT_CUSTOMIZATION);
    expect(SHOWCASE_FLAG_KEY in toCosmeticRecord(DEFAULT_CUSTOMIZATION)).toBe(false);
  });

  it("si rilegge dalla colonna, e manca nei profili mai configurati", () => {
    expect(readShowcaseChosen(toCosmeticRecord(DEFAULT_CUSTOMIZATION, { showcaseChosen: true }))).toBe(true);
    expect(readShowcaseChosen(toCosmeticRecord(DEFAULT_CUSTOMIZATION))).toBe(false);
    expect(readShowcaseChosen({})).toBe(false);
    expect(readShowcaseChosen(null)).toBe(false);
    expect(readShowcaseChosen({ [SHOWCASE_FLAG_KEY]: "altro" })).toBe(false);
  });
});

describe("progressione di livello", () => {
  it("parte dal livello 1 senza esperienza", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(xpForLevel(1)).toBe(0);
  });

  it("le soglie crescono in modo monotono", () => {
    for (let level = 2; level <= MAX_LEVEL; level++) {
      expect(xpForLevel(level)).toBeGreaterThan(xpForLevel(level - 1));
    }
  });

  it("l'esperienza esattamente sulla soglia fa salire di livello", () => {
    const threshold = xpForLevel(5);
    expect(levelFromXp(threshold)).toBe(5);
    expect(levelFromXp(threshold - 1)).toBe(4);
  });

  it("il progresso resta tra 0 e 1", () => {
    for (const xp of [0, 50, 500, 5000, 50_000]) {
      const progress = levelProgress(xp);
      expect(progress.ratio).toBeGreaterThanOrEqual(0);
      expect(progress.ratio).toBeLessThanOrEqual(1);
    }
  });

  it("al livello massimo si dichiara completo invece di dividere per zero", () => {
    const progress = levelProgress(xpForLevel(MAX_LEVEL) + 1_000_000);
    expect(progress.maxed).toBe(true);
    expect(progress.level).toBe(MAX_LEVEL);
    expect(progress.ratio).toBe(1);
    expect(Number.isFinite(progress.needed)).toBe(true);
  });
});
