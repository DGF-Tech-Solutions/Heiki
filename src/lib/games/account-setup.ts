import type { AccountSliderData, AccountStatKey, StatBag } from "./account-buff-types";
import { STAT_ORDER, quickTotals, tierFor, type ManaMode } from "./account-buff";

/**
 * Il tuo account, come lo scegli nel sito: la classe di combattimento
 * dell'account e le costellazioni. Vale per tutte le schede degli eroi, e per
 * questo si salva nel browser (localStorage) e non nella pagina: si sceglie una
 * volta, nello slider di una scheda o nella pagina «Buff dell'account».
 *
 * Due modi per le costellazioni:
 * - rapido: le prime N complete, con le pietre del mana al minimo, nella media o
 *   al massimo. Lo si sceglie dallo slider
 * - pietra per pietra (`custom`): la pagina «Buff dell'account» salva le pietre
 *   attivate, i valori delle pietre del mana, e i TOTALI gia' sommati. La scheda
 *   legge i totali: cosi' non deve portarsi dietro le 1.463 pietre. I totali
 *   portano l'impronta dei dati (`version`): se una patch cambia le costellazioni,
 *   la scheda lo dice invece di usare numeri vecchi
 */
export interface AccountSetup {
  /** la classe di combattimento dell'account; 0 = nessun titolo */
  readonly power: number;
  /** le costellazioni complete, in ordine (modo rapido) */
  readonly completed: number;
  readonly mana: ManaMode;
  readonly custom: CustomConstellations | null;
}

export interface CustomConstellations {
  readonly version: string;
  /** gli id delle pietre attivate */
  readonly stones: readonly number[];
  /** id della pietra del mana -> il suo valore */
  readonly mana: Readonly<Record<string, number>>;
  readonly totals: StatBag;
}

export const EMPTY_SETUP: AccountSetup = { power: 0, completed: 0, mana: "avg", custom: null };

export function setupStorageKey(gameSlug: string): string {
  return `gachazone:${gameSlug}:buff-account`;
}

const MANA_MODES: readonly ManaMode[] = ["min", "avg", "max"];

/**
 * Quello che si legge dal browser, controllato: puo' mancare, essere di una
 * versione vecchia del sito o scritto a mano. Un campo sbagliato torna al suo
 * valore vuoto invece di rompere la scheda.
 */
export function parseSetup(raw: string | null): AccountSetup {
  if (!raw) return EMPTY_SETUP;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return EMPTY_SETUP;
  }
  if (!value || typeof value !== "object") return EMPTY_SETUP;
  const data = value as Record<string, unknown>;
  const number = (input: unknown, max: number) =>
    typeof input === "number" && Number.isFinite(input) ? Math.min(max, Math.max(0, Math.round(input))) : 0;
  return {
    power: number(data.power, 1_000_000_000),
    completed: number(data.completed, 99),
    mana: MANA_MODES.includes(data.mana as ManaMode) ? (data.mana as ManaMode) : "avg",
    custom: parseCustom(data.custom),
  };
}

function parseCustom(input: unknown): CustomConstellations | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;
  if (typeof data.version !== "string" || !Array.isArray(data.stones)) return null;
  const stones = data.stones.filter((id): id is number => Number.isInteger(id));
  const mana: Record<string, number> = {};
  if (data.mana && typeof data.mana === "object") {
    for (const [id, value] of Object.entries(data.mana as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value)) mana[id] = value;
    }
  }
  const totals: StatBag = {};
  if (data.totals && typeof data.totals === "object") {
    for (const key of STAT_ORDER) {
      const value = (data.totals as Record<string, unknown>)[key];
      if (typeof value === "number" && Number.isFinite(value)) totals[key as AccountStatKey] = value;
    }
  }
  return { version: data.version, stones, mana, totals };
}

export interface SetupEffect {
  /** le percentuali del titolo raggiunto, o null */
  readonly tier: { readonly threshold: number; readonly atk: number; readonly def: number; readonly hp: number } | null;
  /** quanto aggiungono le costellazioni */
  readonly bonus: StatBag;
  /** le costellazioni sono state scelte pietra per pietra */
  readonly custom: boolean;
  /** scelte pietra per pietra su dati di un'altra versione: non si usano */
  readonly stale: boolean;
  /** c'e' qualcosa da aggiungere alle statistiche */
  readonly active: boolean;
}

/** Cosa fa un account alle statistiche di un eroe. */
export function setupEffect(data: AccountSliderData, setup: AccountSetup): SetupEffect {
  const tier = tierFor(data.tiers, setup.power);
  const stale = setup.custom !== null && setup.custom.version !== data.version;
  const custom = setup.custom !== null && !stale;
  const bonus = custom
    ? setup.custom!.totals
    : quickTotals(data.constellations, Math.min(setup.completed, data.constellations.length), setup.mana);
  return { tier, bonus, custom, stale, active: tier !== null || Object.keys(bonus).length > 0 };
}
