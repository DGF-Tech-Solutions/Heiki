/**
 * Il Randomizer: le squadre pescate rispettano le regole del gioco (un
 * personaggio una volta sola, associati compresi), «Senza collaborazioni» le
 * toglie da tutti e otto i posti, e nella modalita' Sinergia la sinergia c'e'
 * davvero: le Uniche dei quattro in campo nominano alleati applicabili e valgono
 * l'una per l'altra. Si prova sui dati veri, con un generatore con seme perche'
 * un errore si possa ripetere.
 */

import { describe, expect, it } from "vitest";
import { HERO_ABILITIES } from "../grand-cross/hero-abilities.generated";
import { HERO_CONTEXT } from "../grand-cross/hero-context.generated";
import { HERO_FATES } from "../grand-cross/hero-fates.generated";
import { HERO_TERMS } from "../grand-cross/hero-terms.generated";
import { HEROES } from "../grand-cross/heroes.generated";
import { inGroup, type TermMember } from "../hero-terms";
import {
  coverEachOther,
  drawRandom,
  drawSynergy,
  fateBetween,
  isCollab,
  TEAM_SIZE,
  uniqueCovers,
  unicaLeaders,
  type Rng,
  type TeamDraw,
} from "../randomizer";

/** mulberry32: lo stesso seme, la stessa sequenza */
function seeded(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const members: TermMember[] = HEROES.map((hero) => {
  const context = HERO_CONTEXT.heroes[hero.id];
  return {
    id: hero.id,
    group: hero.group,
    race: context?.race ?? null,
    factions: context?.factions ?? [],
    attribute: context?.attribute ?? null,
  };
});
const noCollab = members.filter((member) => !isCollab(member));
const byId = new Map(members.map((member) => [member.id, member]));
const leaders = unicaLeaders(HERO_ABILITIES, HERO_TERMS);
const covers = uniqueCovers(members, leaders, HERO_TERMS.groups);

function everyone(draw: TeamDraw): string[] {
  return draw.slots.flatMap((slot) => [slot.main, slot.associate]);
}

function characters(ids: readonly string[]): number {
  return new Set(ids.map((id) => byId.get(id)!.group)).size;
}

describe("le collaborazioni", () => {
  it("sono gli eroi con la caratteristica «Collab» del client", () => {
    expect(HERO_CONTEXT.codes.faction["3"]?.en).toBe("Collab");
    expect(noCollab.length).toBeLessThan(members.length);
    expect(noCollab.length).toBeGreaterThan(members.length / 2);
  });
});

describe("il sorteggio a caso", () => {
  it("quattro in campo e quattro associati, otto personaggi diversi del roster", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const draw = drawRandom(members, seeded(seed));
      expect(draw.slots).toHaveLength(TEAM_SIZE);
      expect(draw.synergy).toBe(false);
      const ids = everyone(draw);
      for (const id of ids) expect(byId.has(id)).toBe(true);
      expect(characters(ids)).toBe(TEAM_SIZE * 2);
    }
  });

  it("senza collaborazioni non ne esce nessuna, in nessuno degli otto posti", () => {
    for (let seed = 1; seed <= 200; seed++) {
      for (const id of everyone(drawRandom(noCollab, seeded(seed)))) expect(isCollab(byId.get(id)!)).toBe(false);
    }
  });

  it("lo stesso seme da' la stessa squadra, semi diversi squadre diverse", () => {
    expect(drawRandom(members, seeded(7))).toEqual(drawRandom(members, seeded(7)));
    const teams = new Set(Array.from({ length: 20 }, (_, i) => everyone(drawRandom(members, seeded(i + 1))).join()));
    expect(teams.size).toBe(20);
  });

  it("Another Ban non e' Ban: possono uscire insieme (confermato dall'utente)", () => {
    const another = byId.get("2010501")!;
    const ban = members.find((member) => member.group === "Ban")!;
    expect(another.group).not.toBe(ban.group);
    // otto personaggi in tutto: il sorteggio li deve prendere tutti, i due Ban compresi
    const others = members.filter((member) => !["Ban", "IF Ban"].includes(member.group));
    const six = others.filter((member, i) => others.findIndex((o) => o.group === member.group) === i).slice(0, 6);
    const ids = everyone(drawRandom([another, ban, ...six], seeded(3)));
    expect(ids).toContain(another.id);
    expect(ids).toContain(ban.id);
  });

  it("senza otto personaggi diversi si ferma", () => {
    const onlyMeliodas = Array.from({ length: 10 }, (_, i) => ({ ...members[0]!, id: `x${i}`, group: "Meliodas" }));
    expect(() => drawRandom(onlyMeliodas, seeded(1))).toThrow();
  });
});

describe("chi copre un'Unica", () => {
  it("le Uniche che nominano alleati sono quelle dei gruppi non nemici", () => {
    expect(covers.size).toBeGreaterThan(50);
    for (const { hero, group } of leaders) {
      expect(HERO_ABILITIES[hero]?.passive).toBeDefined();
      expect(HERO_TERMS.groups[group]!.enemies).toBe(false);
    }
  });

  it("copre solo eroi del suo gruppo, e mai il personaggio dell'eroe", () => {
    for (const cover of covers.values()) {
      const leader = byId.get(cover.hero)!;
      for (const id of cover.covers) {
        const member = byId.get(id)!;
        expect(member.group).not.toBe(leader.group);
        expect(cover.groups.some((group) => inGroup(HERO_TERMS.groups[group]!, member, leader.id))).toBe(true);
      }
    }
  });

  it("coverEachOther vuole le due Uniche, non una", () => {
    const [a, cover] = [...covers.entries()].find(([, c]) => [...c.covers].some((id) => !covers.has(id)))!;
    const plain = [...cover.covers].find((id) => !covers.has(id))!;
    expect(cover.covers.has(plain)).toBe(true);
    expect(coverEachOther(covers, a, plain)).toBe(false);
  });
});

describe("il sorteggio con la sinergia", () => {
  function check(pool: readonly TermMember[], seeds: number) {
    const teams = new Set<string>();
    let full = 0;
    for (let seed = 1; seed <= seeds; seed++) {
      const draw = drawSynergy(pool, covers, seeded(seed));
      const mains = draw.slots.map((slot) => slot.main);
      expect(draw.synergy).toBe(true);
      expect(draw.slots).toHaveLength(TEAM_SIZE);
      // nessuna Unica resta senza i suoi alleati, e al piu' una e' non specifica
      const specific = mains.filter((id) => covers.has(id));
      expect(specific.length).toBeGreaterThanOrEqual(TEAM_SIZE - 1);
      for (const a of specific) for (const b of mains) if (a !== b) expect(covers.get(a)!.covers.has(b)).toBe(true);
      if (specific.length === TEAM_SIZE) full++;
      expect(characters(everyone(draw))).toBe(TEAM_SIZE * 2);
      for (const id of everyone(draw)) expect(pool.some((hero) => hero.id === id)).toBe(true);
      teams.add([...mains].sort().join());
    }
    return { teams: teams.size, full };
  }

  it("ogni Unica che nomina alleati vale per gli altri tre, e le squadre cambiano", () => {
    const { teams, full } = check(members, 300);
    expect(teams).toBeGreaterThan(250);
    // escono sia le squadre con quattro Uniche specifiche sia quelle col quarto non specifico
    expect(full).toBeGreaterThan(30);
    expect(full).toBeLessThan(270);
  });

  it("anche senza collaborazioni", () => {
    const { teams, full } = check(noCollab, 300);
    expect(teams).toBeGreaterThan(200);
    expect(full).toBeGreaterThan(30);
  });

  it("gli associati sono liberi: non per forza legami", () => {
    const withoutFate = Array.from({ length: 50 }, (_, i) => drawSynergy(members, covers, seeded(i + 1))).flatMap((draw) =>
      draw.slots.filter((slot) => !fateBetween(HERO_FATES, slot.main, slot.associate)),
    );
    expect(withoutFate.length).toBeGreaterThan(0);
  });

  it("senza nessuna squadra possibile si ferma", () => {
    const nobody = members.filter((member) => !covers.has(member.id));
    expect(() => drawSynergy(nobody, covers, seeded(1))).toThrow();
  });
});

describe("i legami", () => {
  it("ogni legame porta a un eroe del roster, di un altro personaggio, con un effetto che esiste", () => {
    const roster = new Set(HEROES.map((hero) => hero.id));
    expect(HERO_FATES.effects.length).toBeGreaterThan(0);
    for (const [main, fates] of Object.entries(HERO_FATES.heroes)) {
      expect(roster.has(main)).toBe(true);
      expect(fates.length).toBeGreaterThan(0);
      for (const [associate, effect] of fates) {
        expect(roster.has(associate)).toBe(true);
        expect(byId.get(associate)!.group).not.toBe(byId.get(main)!.group);
        expect(HERO_FATES.effects[effect]).toBeDefined();
      }
    }
  });

  it("gli effetti hanno nome e testo nelle due lingue, senza il livello nel nome", () => {
    for (const effect of HERO_FATES.effects) {
      for (const label of [effect.name, effect.text]) {
        expect(label.it).toBeTruthy();
        expect(label.en).toBeTruthy();
      }
      expect(effect.name.en).not.toContain("{0}");
      expect(effect.name.it).not.toContain("{0}");
    }
  });

  it("fateBetween trova il legame e solo quello", () => {
    const [main, fates] = Object.entries(HERO_FATES.heroes)[0]!;
    expect(fateBetween(HERO_FATES, main, fates[0]![0])).toEqual(fates[0]);
    expect(fateBetween(HERO_FATES, main, main)).toBeUndefined();
  });
});
