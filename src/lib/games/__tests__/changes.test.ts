/**
 * I cambiamenti di patch: le funzioni della pagina, e sui dati veri le promesse
 * del confronto. I pezzi di un testo cambiato ricompongono esattamente il testo
 * di prima (uguali + tolti) e quello di dopo (uguali + aggiunti), nelle due
 * lingue: se la pipeline sbagliasse il confronto, la pagina mostrerebbe un testo
 * che il gioco non ha mai scritto.
 */

import { describe, expect, it } from "vitest";
import { CHANGES } from "../grand-cross/changes.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { compressRanges, groupChanges, heroHistory, patchAnchor, touchupParts } from "../changes";
import type { ChangesIndex, HeroChange } from "../changes-types";

const text = (it: string, en: string) => ({ it, en });

describe("compressRanges", () => {
  it("scrive corti i ranghi consecutivi", () => {
    expect(compressRanges([2, 3, 4, 5, 6])).toBe("2–6");
    expect(compressRanges([6, 2, 3, 8, 3])).toBe("2–3, 6, 8");
    expect(compressRanges([1])).toBe("1");
    expect(compressRanges([])).toBe("");
  });
});

describe("groupChanges", () => {
  const change = (part: HeroChange["part"], which: number | null, field: string): HeroChange => ({
    part,
    which,
    field,
    kind: "cambiato",
    before: text("a", "a"),
    after: text("b", "b"),
  });

  it("mette le parti nell'ordine della scheda, i ranghi in ordine e il nome prima del testo", () => {
    const groups = groupChanges([
      change("stats", null, "atk"),
      change("skillsB", 3, "explain"),
      change("skillsB", 1, "explain"),
      change("skillsB", 1, "name"),
      change("passive", 0, "explain"),
    ]);
    expect(groups.map((g) => g.part)).toEqual(["passive", "skillsB", "stats"]);
    expect(groups[1]!.changes.map((c) => `${c.which}:${c.field}`)).toEqual(["1:name", "1:explain", "3:explain"]);
  });

  it("separa reliquie, legami e costumi per id", () => {
    const groups = groupChanges([change("costume", 7, "name"), change("costume", 3, "name"), change("fates", 1015001, "explain")]);
    expect(groups.map((g) => `${g.part}:${g.id}`)).toEqual(["fates:1015001", "costume:3", "costume:7"]);
  });
});

describe("touchupParts e heroHistory", () => {
  const index: ChangesIndex = {
    patches: ["2026-09-23", "2026-09-30", "2026-10-07"],
    comparisons: [
      {
        from: "2026-09-30",
        to: "2026-10-07",
        newHeroes: ["2"],
        heroes: { "1": [{ part: "stats", which: null, field: "atk", kind: "cambiato", before: 100, after: 110 }] },
        touchups: {},
        other: [],
        texts: { added: 0, changed: 0, removed: 0 },
      },
      {
        from: "2026-09-23",
        to: "2026-09-30",
        newHeroes: [],
        heroes: {},
        touchups: { "1": [3, 2, 4].map((which) => ({ part: "skillsSpecial" as const, which, field: "explain" })) },
        other: [],
        texts: { added: 0, changed: 0, removed: 0 },
      },
    ],
  };

  it("raccoglie i ranghi ritoccati per parte", () => {
    expect(touchupParts(index.comparisons[1]!.touchups["1"]!)).toEqual([{ part: "skillsSpecial", which: [3, 2, 4] }]);
  });

  it("la storia di un eroe va dalla patch piu' recente e salta quelle in cui non c'e'", () => {
    expect(heroHistory(index, "1").map((h) => h.comparison.to)).toEqual(["2026-10-07", "2026-09-30"]);
    expect(heroHistory(index, "2").map((h) => [h.comparison.to, h.isNew])).toEqual([["2026-10-07", true]]);
    expect(heroHistory(index, "3")).toEqual([]);
  });

  it("l'ancora di una patch e' la sua data", () => {
    expect(patchAnchor(index.comparisons[0]!)).toBe("p-2026-10-07");
  });
});

describe("i cambiamenti veri", () => {
  const roster = new Set(HEROES.map((hero) => hero.id));

  it("le patch sono in ordine e ogni confronto unisce due patch consecutive, dal piu' recente", () => {
    expect([...CHANGES.patches].sort()).toEqual(CHANGES.patches);
    expect(CHANGES.comparisons).toHaveLength(Math.max(0, CHANGES.patches.length - 1));
    CHANGES.comparisons.forEach((c, i) => {
      const j = CHANGES.patches.length - 1 - i;
      expect([c.from, c.to]).toEqual([CHANGES.patches[j - 1], CHANGES.patches[j]]);
    });
  });

  it("ogni eroe nominato e' nel roster", () => {
    for (const c of CHANGES.comparisons) {
      for (const id of [...c.newHeroes, ...Object.keys(c.heroes), ...Object.keys(c.touchups)]) {
        expect(roster.has(id), `${c.to}: ${id}`).toBe(true);
      }
    }
  });

  it("i pezzi di un testo cambiato ricompongono il testo di prima e quello di dopo", () => {
    for (const c of CHANGES.comparisons) {
      for (const [id, list] of Object.entries(c.heroes)) {
        for (const change of list) {
          if (!change.segments) continue;
          for (const lang of ["it", "en"] as const) {
            const before = change.segments[lang].filter(([op]) => op !== "+").map(([, s]) => s).join("");
            const after = change.segments[lang].filter(([op]) => op !== "-").map(([, s]) => s).join("");
            const where = `${c.to} ${id} ${change.part}/${change.which}/${change.field} ${lang}`;
            expect(before, where).toBe((change.before as { it: string; en: string })[lang] ?? "");
            expect(after, where).toBe((change.after as { it: string; en: string })[lang] ?? "");
          }
        }
      }
    }
  });

  it("un ritocco di formattazione non e' anche un cambiamento della stessa voce", () => {
    for (const c of CHANGES.comparisons) {
      for (const [id, touchups] of Object.entries(c.touchups)) {
        const changed = new Set((c.heroes[id] ?? []).map((ch) => `${ch.part}/${ch.which}/${ch.field}`));
        for (const t of touchups) expect(changed.has(`${t.part}/${t.which}/${t.field}`)).toBe(false);
      }
    }
  });
});
