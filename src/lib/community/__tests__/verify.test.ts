/**
 * La riverifica e' la funzione su cui si regge la fiducia nel sito: se dicesse
 * "verificato" a numeri inventati, o "non riprodotto" a numeri onesti, farebbe
 * piu' danno che non esistere.
 *
 * I tre esiti vanno tenuti distinti. "Non verificabile" significa che mancano
 * i dati per rifare il conto; "non riprodotto" che il conto e' stato fatto e da'
 * un altro numero. Confonderli marchierebbe come sospetti dei post che sono solo
 * vecchi.
 */

import { describe, expect, it } from "vitest";
import { checkAttachment } from "../verify";
import type { SimulationAttachment } from "../types";
import { ITERATIONS, simulateTeam } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";

const GAME = "grand-cross";
const module = requireGameModule(GAME);

/** Allegato onesto: prodotto dal motore, come farebbe il sito. */
function honestAttachment(seed = 4242): SimulationAttachment {
  const ids = module.characters.slice(0, 2).map((character) => character.id);
  const result = simulateTeam(module, ids, undefined, { seed, iterations: ITERATIONS });
  if (!result) throw new Error("simulazione non disponibile");

  return {
    kind: "simulation",
    game: module.name,
    character: module.characters[0]?.name ?? "",
    team: ids.map((id) => module.characters.find((c) => c.id === id)?.name ?? id),
    median: result.damage.median,
    p10: result.damage.p10,
    p90: result.damage.p90,
    timeToKill: result.timeToKill?.median ?? null,
    timeUnit: module.timeUnit,
    killRate: result.killRate,
    patch: module.dataset.patch,
    seed,
    iterations: result.iterations,
    characterIds: ids,
  };
}

describe("checkAttachment", () => {
  it("conferma i numeri prodotti dal motore", () => {
    const check = checkAttachment(GAME, honestAttachment());

    expect(check.status).toBe("match");
    expect(check.deviation).toBeLessThanOrEqual(0.005);
  });

  it("l'esito non dipende dal seed scelto", () => {
    for (const seed of [1, 999, 20260909]) {
      expect(checkAttachment(GAME, honestAttachment(seed)).status).toBe("match");
    }
  });

  it("smaschera una mediana gonfiata", () => {
    const honest = honestAttachment();
    const inflated = { ...honest, median: honest.median * 1.4 };

    const check = checkAttachment(GAME, inflated);
    expect(check.status).toBe("mismatch");
    expect(check.declared).toBeCloseTo(honest.median * 1.4, 6);
    expect(check.recomputed).toBeCloseTo(honest.median, 6);
  });

  it("smaschera anche uno scostamento piccolo ma oltre la tolleranza", () => {
    const honest = honestAttachment();
    // +2%: sotto l'occhio umano, sopra lo 0,5% di tolleranza.
    const check = checkAttachment(GAME, { ...honest, median: honest.median * 1.02 });
    expect(check.status).toBe("mismatch");
  });

  it("tollera l'arrotondamento di chi trascrive a mano", () => {
    const honest = honestAttachment();
    const rounded = { ...honest, median: Math.round(honest.median) };
    expect(checkAttachment(GAME, rounded).status).toBe("match");
  });

  it("un altro numero di iterazioni non e' disonestà: e' un altro calcolo", () => {
    // Rieseguito con le iterazioni dichiarate, il risultato coincide. Il campo
    // esiste proprio per non accusare qualcuno per un parametro diverso.
    const honest = honestAttachment();
    const other = simulateTeam(module, honest.characterIds ?? [], undefined, {
      seed: honest.seed,
      iterations: 300,
    });
    expect(other).not.toBeNull();
    expect(other?.damage.median).not.toBe(honest.median);
    expect(checkAttachment(GAME, honest).status).toBe("match");
  });

  it("dichiara non verificabile un allegato di un'altra patch", () => {
    const check = checkAttachment(GAME, { ...honestAttachment(), patch: "9.9.9" });

    expect(check.status).toBe("unverifiable");
    expect(check.reason).toContain("9.9.9");
  });

  it("dichiara non verificabile un personaggio sconosciuto", () => {
    const check = checkAttachment(GAME, {
      ...honestAttachment(),
      characterIds: ["non-esiste"],
      team: ["Non Esiste"],
      character: "Non Esiste",
    });
    expect(check.status).toBe("unverifiable");
  });

  it("dichiara non verificabile un gioco senza modulo", () => {
    const check = checkAttachment("genshin-impact", honestAttachment());
    expect(check.status).toBe("unverifiable");
  });

  it("rifiuta una mediana dichiarata non valida invece di dividere per zero", () => {
    const check = checkAttachment(GAME, { ...honestAttachment(), median: 0 });
    expect(check.status).toBe("unverifiable");
    expect(Number.isFinite(check.deviation ?? 0)).toBe(true);
  });

  it("i nomi funzionano come riserva quando gli id mancano", () => {
    const honest = honestAttachment();
    const { characterIds: _omitted, ...withoutIds } = honest;
    expect(checkAttachment(GAME, withoutIds).status).toBe("match");
  });
});
