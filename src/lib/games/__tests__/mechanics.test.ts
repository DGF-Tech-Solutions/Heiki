/**
 * Le meccaniche di combattimento: le funzioni rifanno i passi del codice del client
 * sugli esempi dello studio (MECCANICHE_COMBATTIMENTO.md nella pipeline), e i dati
 * generati si legano al roster, al contesto degli eroi e alle parole blu.
 */

import { describe, expect, it } from "vitest";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HERO_TERMS } from "../grand-cross/hero-terms.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { MECHANICS } from "../grand-cross/mechanics.generated";
import {
  attributeEdge,
  baseDamage,
  critChance,
  critMultiplier,
  damageModifier,
  drawChances,
  handLimit,
  maxDefenseCut,
  smashWeight,
} from "../mechanics";

const { config, code } = MECHANICS;

describe("il danno di un colpo", () => {
  it("senza Difesa il danno base e' l'attacco", () => {
    expect(baseDamage(20000, 0, config)).toBe(20000);
  });

  it("la stessa Difesa toglie di piu' ai colpi piccoli (esempio dello studio)", () => {
    // 10.000 di Attacco, Difesa 5.000: carta al 100% -> -27%, carta al 300% -> -12%
    expect(baseDamage(10000, 5000, config)).toBeCloseTo(7301.587, 2);
    expect(baseDamage(30000, 5000, config)).toBeCloseTo(26433.566, 2);
  });

  it("la Difesa non toglie mai piu' di b/a (circa il 74%)", () => {
    expect(maxDefenseCut(config)).toBeCloseTo(0.85 / 1.15, 9);
    expect(1 - baseDamage(1000, 1e12, config) / 1000).toBeLessThan(maxDefenseCut(config) + 1e-9);
  });

  it("il critico: un punto in piu' per il tiro, e mai sotto x1", () => {
    expect(critChance(0.3)).toBeCloseTo(0.31, 9);
    expect(critChance(0)).toBe(0);
    expect(critChance(-0.2)).toBe(0);
    expect(critChance(1)).toBe(1);
    expect(critMultiplier(1.8, 0.5, config)).toBeCloseTo(2.3, 9);
    expect(critMultiplier(1, 1.5, config)).toBe(1);
  });

  it("aumenti e riduzioni si sommano in un solo fattore, mai sotto 0,2", () => {
    expect(damageModifier(config.advantage, 0, code)).toBeCloseTo(1.3, 9);
    expect(damageModifier(0, config.disadvantage, code)).toBeCloseTo(0.8, 9);
    expect(damageModifier(config.advantage + 0.5, 0, code)).toBeCloseTo(1.8, 9);
    expect(damageModifier(0, 5, code)).toBeCloseTo(1 + code.minDifference, 9);
  });

  it("la varianza va da 1,00 a 1,09 a passi di un centesimo", () => {
    expect(config.variance).toEqual([1, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09]);
  });
});

describe("chi batte chi", () => {
  it("Forza batte PS, PS batte Velocita', Velocita' batte Forza; Luce e Oscurita' fuori", () => {
    expect(attributeEdge(1, 2, code)).toBe(1);
    expect(attributeEdge(2, 3, code)).toBe(1);
    expect(attributeEdge(3, 1, code)).toBe(1);
    expect(attributeEdge(2, 1, code)).toBe(-1);
    expect(attributeEdge(1, 1, code)).toBe(0);
    for (const fuori of code.outsideTriangle) {
      for (const altro of [1, 2, 3, 4, 5, 6]) expect(attributeEdge(fuori, altro, code)).toBe(0);
    }
  });

  it("vantaggio piu' grande dello svantaggio, tutti e due frazioni", () => {
    expect(config.advantage).toBeGreaterThan(config.disadvantage);
    expect(config.disadvantage).toBeGreaterThan(0);
    expect(config.advantage).toBeLessThan(1);
  });

  it("gli effetti di squadra: Luce agli eroi Luce, Oscurita' agli eroi Oscurita', tutti e due a Luce/Oscurita'", () => {
    for (const [id, effects] of Object.entries(MECHANICS.teamEffects)) {
      const attribute = HERO_CONTEXT.heroes[id]?.attribute ?? null;
      expect(!!effects.light, `${id} luce`).toBe(attribute === 4 || attribute === 6);
      expect(!!effects.dark, `${id} oscurita'`).toBe(attribute === 5 || attribute === 6);
    }
    const conEffetto = HEROES.filter((hero) => [4, 5, 6].includes(HERO_CONTEXT.heroes[hero.id]?.attribute ?? 0));
    expect(Object.keys(MECHANICS.teamEffects).sort()).toEqual(conEffetto.map((hero) => hero.id).sort());
  });
});

describe("la pesca delle carte", () => {
  it("ogni eroe del roster ha i pesi delle carte A e B", () => {
    for (const hero of HEROES) {
      const weights = MECHANICS.draw[hero.id];
      expect(weights, hero.id).toBeDefined();
      expect(weights![0], hero.id).toBeGreaterThan(0);
      expect(weights![1], hero.id).toBeGreaterThan(0);
    }
  });

  it("con 3 eroi in campo a 60/40: A 20%, B 13,3% a pescata", () => {
    const { a, b } = drawChances([60, 40], 3);
    expect(a).toBeCloseTo(0.2, 9);
    expect(b).toBeCloseTo(40 / 300, 9);
  });

  it("la mano: 7 con la panchina, 8 con tutti in campo, poi 6, 5, 4", () => {
    expect([4, 3, 2, 1].map((n) => handLimit(n, false, code))).toEqual([7, 6, 5, 4]);
    expect([4, 3, 2, 1].map((n) => handLimit(n, true, code))).toEqual([8, 6, 5, 4]);
  });

  it("PvP Smash: una carta pescata pesa sempre meno", () => {
    expect([0, 1, 2, 3, 4].map((t) => smashWeight(60, t, config))).toEqual([60, 18, 6, 2, 1]);
    expect([0, 1, 2, 3, 4].map((t) => smashWeight(40, t, config))).toEqual([40, 12, 4, 2, 1]);
  });
});

describe("il cumulo dei buff", () => {
  it("ogni concetto con una regola di cumulo e' una parola blu, con le carte contate", () => {
    for (const [concept, rules] of Object.entries(MECHANICS.stacking)) {
      expect(HERO_TERMS.concepts[concept], concept).toBeDefined();
      expect(rules.length, concept).toBeGreaterThan(0);
      for (const rule of rules) {
        expect(rule.cards, concept).toBeGreaterThan(0);
        expect(rule.limit, concept).toBeGreaterThanOrEqual(0);
        if (rule.rule === "piu_forte" || rule.rule === "piu_basso") expect(rule.limit, concept).toBe(0);
      }
      const counts = rules.map((rule) => rule.cards);
      expect(counts, concept).toEqual([...counts].sort((x, y) => y - x));
    }
  });
});
