import type { AccountPowerTier, StatBag } from "./account-buff-types";
import type { GearTotals } from "./gear";
import { battleWith } from "./hero-build";
import type { BoxEntry } from "./hero-box";
import { maxSelection, statsAt } from "./hero-stats";
import type { HeroStatSteps } from "./types";

/**
 * Le statistiche d'inizio battaglia di un eroe della squadra: quelle della
 * schermata della squadra del gioco (OriginalStatus), da cui il gioco parte per
 * il primo turno e il simulatore con lui (grand-cross/simulation.ts).
 *
 * Scelta dell'utente dell'11/11: se l'eroe e' nel tuo box, i tuoi numeri
 * (livello, Risvegli, Super risvegli, Reliquia); se no, quelli al massimo del
 * calcolatore della scheda eroe. Il resto come parte il calcolatore: i cinque
 * costumi migliori, l'equipaggiamento PS/Difesa, e il titolo della classe e le
 * costellazioni dell'account se li hai impostati. E' lo stesso conto
 * (`statsAt`, poi `battleWith` senza associato): un eroe al massimo torna al
 * centesimo col calcolatore (team-start.test.ts).
 *
 * Il box non dice l'equipaggiamento vero: il numero e' quello di un eroe con
 * l'equipaggiamento di partenza del calcolatore. Le percentuali della squadra
 * quasi non ne dipendono (il gioco moltiplica), i numeri si'.
 */

/** Le dodici statistiche coi nomi del sito; le percentuali in punti (33,5 vuol dire 33,5%). */
export const START_STATS = [
  "atk",
  "fixedAtkPer",
  "critPer",
  "critAtkPer",
  "def",
  "fixedDefPer",
  "critResPer",
  "critDefPer",
  "hp",
  "hpRegenPer",
  "hpRecoveryPer",
  "hpStealPer",
] as const;
export type StartStat = (typeof START_STATS)[number];

/** Quello che serve dal server: i gradini di ogni eroe e l'equipaggiamento di partenza, gia' sommato. */
export interface StartStatsData {
  readonly steps: Readonly<Record<string, HeroStatSteps>>;
  /** il set PS/Difesa al massimo (GEAR_PRESETS[0]), come parte il calcolatore */
  readonly gear: GearTotals;
}

/** L'account, se impostato: il titolo della classe moltiplica, le costellazioni si sommano. */
export interface StartAccount {
  readonly tier: Pick<AccountPowerTier, "atk" | "def" | "hp"> | null;
  readonly bonus: StatBag;
}

/** Da dove vengono i numeri di un eroe: il tuo box o il massimo del calcolatore. */
export type StartFrom = "box" | "max";

export interface HeroStart {
  readonly stats: Readonly<Record<StartStat, number>>;
  readonly from: StartFrom;
}

export function startStatsOf(
  steps: HeroStatSteps,
  entry: Pick<BoxEntry, "level" | "awaken" | "superAwaken" | "relic"> | null,
  gear: GearTotals,
  account: StartAccount | null = null,
): HeroStart {
  // Senza box: tutto al massimo, Reliquia compresa, come `defaultBuild` del calcolatore
  const selection = entry
    ? { level: entry.level, awaken: entry.awaken, superAwaken: entry.superAwaken, relic: entry.relic, costumes: true }
    : maxSelection(steps);
  const without = statsAt(steps, selection);
  const battle = battleWith(
    { without, withGear: without, gear, fate: null },
    account?.tier ?? null,
    account?.bonus ?? {},
  );
  const stats = Object.fromEntries(START_STATS.map((key) => [key, battle[key] ?? 0])) as Record<StartStat, number>;
  return { stats, from: entry ? "box" : "max" };
}
