/**
 * Test di ricerca e filtri sul roster.
 *
 * Il roster vero ha centinaia di voci e cambia a ogni aggiornamento del gioco:
 * i test lavorano su un campione scritto a mano, cosi' verificano il
 * comportamento e non il contenuto del dataset del momento. L'unico controllo
 * sui dati veri sta in fondo, ed e' sul contratto, non sui numeri.
 */

import { describe, expect, it } from "vitest";
import {
  countHeroes,
  filterHeroes,
  heroCardSrc,
  heroEpithet,
  heroName,
  sortHeroes,
} from "../heroes";
import { grandCrossModule } from "../grand-cross";
import type { HeroEntry } from "../types";

function hero(overrides: Partial<HeroEntry> & { id: string }): HeroEntry {
  return {
    group: "Meliodas",
    name: "The Dragon Sin of Wrath",
    epithet: "Assault Mode",
    rarity: "UR",
    obtainedAs: "SSR",
    affinity: "Forza",
    ...overrides,
  };
}

const SAMPLE: readonly HeroEntry[] = [
  hero({ id: "1", name: "Zeldris the Piety", epithet: "Ruler of Purgatory", affinity: "Oscurita" }),
  hero({ id: "2", name: "Escanor the One", epithet: "Sunshine", rarity: "LR", affinity: "Luce" }),
  hero({ id: "3", name: "Ban the Undead", epithet: "Fox Sin", group: "Ban", obtainedAs: "SR" }),
  hero({ id: "4", name: "Meliodas Assault", epithet: "Velocità Pura", affinity: "Velocita" }),
];

describe("filterHeroes", () => {
  it("senza criteri non toglie niente", () => {
    expect(filterHeroes(SAMPLE, {})).toHaveLength(4);
  });

  it("filtra per rarita'", () => {
    expect(filterHeroes(SAMPLE, { rarity: "LR" }).map((h) => h.id)).toEqual(["2"]);
  });

  it("filtra per attributo", () => {
    expect(filterHeroes(SAMPLE, { affinity: "Luce" }).map((h) => h.id)).toEqual(["2"]);
  });

  it("filtra per rarita' di uscita", () => {
    expect(filterHeroes(SAMPLE, { obtainable: "SR" }).map((h) => h.id)).toEqual(["3"]);
  });

  it("somma i criteri invece di alternarli", () => {
    expect(filterHeroes(SAMPLE, { rarity: "LR", affinity: "Oscurita" })).toEqual([]);
  });

  it("un criterio nullo non restringe", () => {
    expect(filterHeroes(SAMPLE, { rarity: null, affinity: null })).toHaveLength(4);
  });

  it("cerca nel nome senza badare alle maiuscole", () => {
    expect(filterHeroes(SAMPLE, { search: "ZELDRIS" }).map((h) => h.id)).toEqual(["1"]);
  });

  it("cerca anche nell'epiteto", () => {
    expect(filterHeroes(SAMPLE, { search: "purgatory" }).map((h) => h.id)).toEqual(["1"]);
  });

  it("cerca per identificativo", () => {
    expect(filterHeroes(SAMPLE, { search: "3" }).map((h) => h.id)).toEqual(["3"]);
  });

  it("richiede tutte le parole, in qualsiasi ordine", () => {
    expect(filterHeroes(SAMPLE, { search: "undead ban" }).map((h) => h.id)).toEqual(["3"]);
    expect(filterHeroes(SAMPLE, { search: "undead zeldris" })).toEqual([]);
  });

  it("ignora gli accenti, perche' chi cerca non li digita", () => {
    expect(filterHeroes(SAMPLE, { search: "velocita" }).map((h) => h.id)).toEqual(["4"]);
  });

  it("ignora le parentesi quadre dell'epiteto", () => {
    expect(filterHeroes(SAMPLE, { search: "[Sunshine]" }).map((h) => h.id)).toEqual(["2"]);
  });

  it("una ricerca di soli spazi non filtra", () => {
    expect(filterHeroes(SAMPLE, { search: "   " })).toHaveLength(4);
  });

  it("trova un eroe per nome ed epiteto in tutte e due le lingue", () => {
    const bilingue = [
      ...SAMPLE,
      hero({
        id: "5",
        group: "Ban",
        name: "Brawler Ban",
        epithet: "Snatch",
        nameIt: "Ban attaccabrighe",
        epithetIt: "Furto",
      }),
    ];
    expect(filterHeroes(bilingue, { search: "attaccabrighe" }).map((h) => h.id)).toEqual(["5"]);
    expect(filterHeroes(bilingue, { search: "brawler" }).map((h) => h.id)).toEqual(["5"]);
    expect(filterHeroes(bilingue, { search: "furto" }).map((h) => h.id)).toEqual(["5"]);
    expect(filterHeroes(bilingue, { search: "snatch ban" }).map((h) => h.id)).toEqual(["5"]);
  });
});

describe("heroName e heroEpithet", () => {
  const ban = hero({
    id: "5",
    name: "Brawler Ban",
    epithet: "Snatch",
    nameIt: "Ban attaccabrighe",
    epithetIt: "Furto",
  });

  it("in italiano mostrano l'italiano, in inglese l'inglese", () => {
    expect([heroName(ban, "it"), heroEpithet(ban, "it")]).toEqual(["Ban attaccabrighe", "Furto"]);
    expect([heroName(ban, "en"), heroEpithet(ban, "en")]).toEqual(["Brawler Ban", "Snatch"]);
  });

  it("senza l'italiano ripiegano sul nome del roster", () => {
    const soloInglese = hero({ id: "6", name: "Escanor the One", epithet: "Sunshine" });
    expect([heroName(soloInglese, "it"), heroEpithet(soloInglese, "it")]).toEqual([
      "Escanor the One",
      "Sunshine",
    ]);
  });
});

describe("countHeroes", () => {
  it("conta le voci per valore", () => {
    const counts = countHeroes(SAMPLE, "rarity");
    expect(counts.get("UR")).toBe(3);
    expect(counts.get("LR")).toBe(1);
  });

  it("non inventa valori assenti", () => {
    expect(countHeroes(SAMPLE, "affinity").get("PS")).toBeUndefined();
  });

  it("conta sull'elenco che riceve, gia' filtrato", () => {
    const counts = countHeroes(filterHeroes(SAMPLE, { rarity: "UR" }), "affinity");
    expect(counts.get("Luce")).toBeUndefined();
    expect(counts.get("Oscurita")).toBe(1);
  });
});

describe("sortHeroes", () => {
  it("lascia l'ordine del roster", () => {
    expect(sortHeroes(SAMPLE, "roster").map((h) => h.id)).toEqual(["1", "2", "3", "4"]);
  });

  it("ordina per nome", () => {
    expect(sortHeroes(SAMPLE, "name").map((h) => h.name[0])).toEqual(["B", "E", "M", "Z"]);
  });

  it("ordina per personaggio, poi per nome", () => {
    const ordered = sortHeroes(SAMPLE, "group");
    expect(ordered[0]?.group).toBe("Ban");
    expect(ordered.slice(1).map((h) => h.name)).toEqual([
      "Escanor the One",
      "Meliodas Assault",
      "Zeldris the Piety",
    ]);
  });

  it("non tocca l'elenco ricevuto", () => {
    const before = SAMPLE.map((h) => h.id);
    sortHeroes(SAMPLE, "name");
    expect(SAMPLE.map((h) => h.id)).toEqual(before);
  });
});

describe("heroCardSrc", () => {
  it("indirizza alla card e alla sua variante densa", () => {
    expect(heroCardSrc("grand-cross", "1004001")).toBe("/eroi/grand-cross/1004001.png");
    expect(heroCardSrc("grand-cross", "1004001", 2)).toBe("/eroi/grand-cross/2x/1004001.png");
  });
});

describe("roster di Grand Cross", () => {
  const roster = grandCrossModule.roster;

  it("il modulo lo espone", () => {
    expect(roster).toBeDefined();
  });

  it("ogni eroe ha un attributo dichiarato fra quelli del gioco", () => {
    const known = new Set(roster?.affinities.map((a) => a.id));
    const orphans = roster?.heroes.filter((h) => !known.has(h.affinity)) ?? [];
    expect(orphans.map((h) => `${h.name} (${h.affinity})`)).toEqual([]);
  });

  it("ogni eroe ha una rarita' fra quelle dichiarate", () => {
    const known = new Set(roster?.rarities);
    expect(roster?.heroes.filter((h) => !known.has(h.rarity))).toEqual([]);
  });

  it("ogni eroe ha una rarita' di uscita fra quelle dichiarate", () => {
    const known = new Set(roster?.obtainable);
    expect(roster?.heroes.filter((h) => !known.has(h.obtainedAs))).toEqual([]);
  });

  it("gli identificativi sono unici: sono anche i nomi dei file immagine", () => {
    const ids = roster?.heroes.map((h) => h.id) ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });

  /**
   * Gli epiteti arrivano decorati in tre modi diversi - quadre esterne,
   * virgolette, BBCode rimasto dentro - e a ripulirli e' lo script di
   * importazione. Questo controllo e' l'unico che se ne accorge: senza, una
   * fonte che cambia forma finirebbe in pagina come "b]Sunshine[/b".
   *
   * Le quadre non si possono vietare in blocco: "[Boar Hat] Tavern" e' un
   * epiteto vero, e le sue parentesi fanno parte del nome della taverna.
   */
  function decorated(epithet: string): boolean {
    if (/\[\/?[biu]\]/i.test(epithet)) return true;
    if (/^".*"$/.test(epithet)) return true;
    if (epithet.startsWith("[") && epithet.indexOf("]") === epithet.length - 1) return true;
    return epithet.split("[").length !== epithet.split("]").length;
  }

  it("nessun epiteto conserva la decorazione della fonte", () => {
    expect(roster?.heroes.filter((h) => decorated(h.epithet)).map((h) => h.epithet)).toEqual([]);
  });

  /*
   * Nome ed epiteto italiani arrivano dal client, e dove il client non li ha da
   * 7dshub in italiano: oggi ci sono per tutti. Se una fonte li perdesse, la
   * griglia in italiano tornerebbe all'inglese senza dare errore.
   */
  it("ogni eroe ha nome ed epiteto in italiano, senza decorazione", () => {
    const senza = roster?.heroes.filter((h) => !h.nameIt || !h.epithetIt).map((h) => h.id) ?? [];
    expect(senza).toEqual([]);
    const decorati =
      roster?.heroes.filter((h) => h.epithetIt && decorated(h.epithetIt)).map((h) => h.epithetIt) ?? [];
    expect(decorati).toEqual([]);
  });
});

/**
 * I testi in italiano: controlli sul contratto, non sui numeri.
 *
 * `textsInItalian` promette che la scheda in italiano non deve avvertire di
 * niente: se un rango restasse senza `textIt`, la pagina lo mostrerebbe in
 * inglese SENZA la nota che lo dice. E U+FEFF, che la fonte italiana si porta
 * dietro in 37 stringhe, non si vede ma rompe ricerche e confronti.
 */
describe("testi in italiano di Grand Cross", () => {
  const abilities = grandCrossModule.heroAbilities;
  const texts = grandCrossModule.heroTexts;
  const specials = grandCrossModule.heroSpecials;
  const roster = grandCrossModule.roster;

  it("con textsInItalian ogni testo inglese ha il suo italiano", () => {
    const senza: string[] = [];
    for (const [hid, voce] of Object.entries(abilities ?? {})) {
      if (!voce.textsInItalian) continue;
      for (const card of [...voce.cards, ...(voce.ultimate ? [voce.ultimate] : [])]) {
        for (const rank of card.ranks) {
          if (rank.text && !rank.textIt) senza.push(`${hid} ${card.slot} rango ${rank.rank}`);
        }
      }
      if (voce.passive?.text && !voce.passive.textIt) senza.push(`${hid} passiva`);
      for (const step of voce.passive?.ultimateSteps ?? []) {
        if (step.text && !step.textIt) senza.push(`${hid} passiva dal rango ${step.fromUltimateRank}`);
      }
    }
    expect(senza).toEqual([]);
  });

  it("i testi italiani non contengono U+FEFF", () => {
    const italiani: [string, string | null | undefined][] = [];
    for (const hero of roster?.heroes ?? []) {
      italiani.push([`${hero.id} nome`, hero.nameIt], [`${hero.id} epiteto`, hero.epithetIt]);
    }
    for (const [hid, text] of Object.entries(texts ?? {})) {
      for (const [campo, label] of Object.entries(text.i18n ?? {})) {
        italiani.push([`${hid} ${campo}`, label.it]);
      }
    }
    for (const [hid, voce] of Object.entries(abilities ?? {})) {
      for (const card of [...voce.cards, ...(voce.ultimate ? [voce.ultimate] : [])]) {
        italiani.push([`${hid} ${card.slot} nome`, card.nameI18n?.it]);
        for (const rank of card.ranks) italiani.push([`${hid} ${card.slot} ${rank.rank}`, rank.textIt]);
      }
      italiani.push([`${hid} passiva nome`, voce.passive?.nameI18n?.it], [`${hid} passiva`, voce.passive?.textIt]);
      for (const step of voce.passive?.ultimateSteps ?? []) {
        italiani.push([`${hid} passiva ${step.fromUltimateRank}`, step.textIt]);
      }
    }
    for (const [id, ability] of Object.entries(specials?.abilities ?? {})) {
      italiani.push([`${id} nome`, ability.name.it], [`${id} testo`, ability.textIt]);
      for (const step of ability.ultimateSteps ?? []) {
        italiani.push([`${id} ${step.fromUltimateRank}`, step.textIt]);
      }
    }
    expect(italiani.filter(([, value]) => value?.includes("﻿")).map(([where]) => where)).toEqual([]);
  });
});

/**
 * Contesto degli effetti: controlli sul CONTRATTO, non sui numeri.
 *
 * Il dataset cambia a ogni patch del gioco, quindi qui non si verifica che
 * Meliodas abbia tre effetti: si verifica che i due pezzi si tengano. Il
 * contesto e' un indice - glossario e nomi dei codici scritti una volta, gli
 * eroi che li citano - e un indice si rompe in silenzio: una chiave che non
 * risolve piu' non da' errore, fa sparire una riga dalla scheda.
 */
describe("contesto di Grand Cross", () => {
  const context = grandCrossModule.heroContext;
  const abilities = grandCrossModule.heroAbilities;

  it("il modulo lo espone", () => {
    expect(context).toBeDefined();
    expect(Object.keys(context?.heroes ?? {}).length).toBeGreaterThan(0);
  });

  function keysOf(hid: string): string[] {
    const hero = context?.heroes[hid];
    if (!hero) return [];
    return Object.values(hero.cards).flatMap((card) => [
      ...card.effects,
      ...Object.values(card.onlyAtRanks ?? {}).flatMap((keys) => [...keys]),
    ]);
  }

  it("ogni effetto citato da un eroe esiste nel glossario", () => {
    const orphans: string[] = [];
    for (const hid of Object.keys(context?.heroes ?? {})) {
      for (const key of keysOf(hid)) {
        if (!context?.glossary[key]) orphans.push(`${hid} -> ${key}`);
      }
    }
    expect(orphans).toEqual([]);
  });

  it("ogni voce del glossario ha un'etichetta in almeno una lingua", () => {
    const mute = Object.entries(context?.glossary ?? {})
      .filter(([, effect]) => !effect.label.it && !effect.label.en)
      .map(([key]) => key);
    expect(mute).toEqual([]);
  });

  /**
   * Le condizioni della passiva sono un indice come il glossario: un codice
   * che non risolve piu' non da' errore, fa sparire un'icona dalla scheda.
   */
  it("ogni condizione di passiva citata esiste, con una frase in almeno una lingua", () => {
    const orfane: string[] = [];
    for (const [hid, hero] of Object.entries(context?.heroes ?? {})) {
      for (const code of hero.passiveConditions ?? []) {
        const condition = context?.passiveConditions[String(code)];
        if (!condition || (!condition.description.it && !condition.description.en)) {
          orfane.push(`${hid} -> ${code}`);
        }
      }
    }
    expect(orfane).toEqual([]);
  });

  /**
   * La distinzione fra dichiarato e dedotto e' il motivo per cui il campo
   * esiste: se un terzo valore comparisse, la pagina lo renderebbe come se
   * fosse dichiarato senza che nessuno se ne accorga.
   */
  it("la certezza e' solo dichiarata o dedotta", () => {
    const strane = [
      ...new Set(Object.values(context?.glossary ?? {}).map((effect) => effect.certainty)),
    ].filter((value) => value !== "dichiarato" && value !== "dedotto");
    expect(strane).toEqual([]);
  });

  /**
   * `canReachLr` e' una lettura di `max`, non un dato a parte: se i due si
   * separassero, la scheda direbbe "puo' arrivare a LR" a un eroe che arriva
   * a UR. E' esattamente l'affermazione falsa che questo campo serve a evitare.
   */
  it("puo' arrivare a LR solo chi ha LR come tetto", () => {
    const incoerenti = Object.entries(context?.heroes ?? {})
      .filter(([, hero]) => hero.rarity.canReachLr !== (hero.rarity.max === "LR"))
      .map(([hid]) => hid);
    expect(incoerenti).toEqual([]);
  });

  /**
   * Il contesto e le abilita' vengono da due fonti diverse - il client e
   * 7dshub - e la pagina le accosta per `slot`. Se una delle due rinominasse
   * le sigle, gli effetti smetterebbero di comparire senza rompere niente.
   */
  it("le sigle delle carte combaciano con quelle delle abilita'", () => {
    const daAbilita = new Set<string>();
    for (const voce of Object.values(abilities ?? {})) {
      for (const card of voce.cards) if (card.slot) daAbilita.add(card.slot);
      if (voce.ultimate?.slot) daAbilita.add(voce.ultimate.slot);
    }
    const daContesto = new Set<string>();
    for (const hero of Object.values(context?.heroes ?? {})) {
      for (const slot of Object.keys(hero.cards)) daContesto.add(slot);
    }
    // La passiva sta nel contesto ma non e' una carta: e' l'unica differenza
    // ammessa fra i due insiemi.
    const soloNelleAbilita = [...daAbilita].filter((slot) => !daContesto.has(slot));
    expect(soloNelleAbilita).toEqual([]);
    expect(daContesto.has("passiva")).toBe(true);
  });

  /**
   * La passiva che segue l'ultimate si accende rango per rango, con sei agganci
   * scritti per esteso nella scheda. Una versione fuori ordine, oltre l'ultimo
   * rango dell'ultimate o oltre il sesto lascerebbe un rango senza testo, e la
   * scheda non darebbe errore: mostrerebbe una passiva vuota.
   */
  it("i testi della passiva cadono in ordine dentro i ranghi dell'ultimate", () => {
    const storte: string[] = [];
    for (const [hid, voce] of Object.entries(abilities ?? {})) {
      const steps = voce.passive?.ultimateSteps ?? [];
      if (steps.length === 0) continue;
      const top = Math.min(voce.ultimate?.ranks.length ?? 0, 6);
      let last = 1;
      for (const step of steps) {
        if (step.fromUltimateRank <= last || step.fromUltimateRank > top || !step.text) {
          storte.push(`${hid} -> rango ${step.fromUltimateRank} su ${top}`);
        }
        last = step.fromUltimateRank;
      }
    }
    expect(storte).toEqual([]);
  });
});

/**
 * Abilita' speciali: controlli sul contratto, come per il contesto.
 *
 * Anche qui un indice si rompe in silenzio: un id che non risolve piu', un tipo
 * rinominato o un codice di condizione nuovo farebbero sparire una sezione o
 * un'icona dalla scheda senza dare errore.
 */
describe("abilita' speciali di Grand Cross", () => {
  const specials = grandCrossModule.heroSpecials;
  const conditions = grandCrossModule.heroContext?.passiveConditions;

  it("il modulo le espone", () => {
    expect(Object.keys(specials?.heroes ?? {}).length).toBeGreaterThan(0);
  });

  it("ogni abilita' citata da un eroe esiste, e il suo tipo e' dichiarato", () => {
    const orfane: string[] = [];
    for (const [hid, ids] of Object.entries(specials?.heroes ?? {})) {
      for (const id of ids) {
        const ability = specials?.abilities[id];
        if (!ability || !specials?.kinds[ability.kind]) orfane.push(`${hid} -> ${id}`);
      }
    }
    expect(orfane).toEqual([]);
  });

  it("le condizioni delle abilita' speciali esistono nella tabella delle passive", () => {
    const orfane = Object.entries(specials?.abilities ?? {}).flatMap(([id, ability]) =>
      ability.conditions.filter((code) => !conditions?.[String(code)]).map((code) => `${id} -> ${code}`),
    );
    expect(orfane).toEqual([]);
  });

  it("i testi che seguono l'ultimate cadono in ordine fra il rango 2 e il 6", () => {
    const storte = Object.entries(specials?.abilities ?? {}).flatMap(([id, ability]) => {
      let last = 1;
      return (ability.ultimateSteps ?? []).flatMap((step) => {
        const fuori = step.fromUltimateRank <= last || step.fromUltimateRank > 6;
        last = step.fromUltimateRank;
        return fuori ? [`${id} -> rango ${step.fromUltimateRank}`] : [];
      });
    });
    expect(storte).toEqual([]);
  });
});
