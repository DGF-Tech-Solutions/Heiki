import { GEAR_PRESETS, gearTotals, presetBuild } from "../gear";
import { simTotals } from "../team-sim";
import type { StartStatsData } from "../team-start";
import { GEAR } from "./gear.generated";
import { SIMULATION_DATA, SIMULATION_STEPS } from "./simulation.generated";

/**
 * Il simulatore del primo turno come lo scarica la pagina Squadra: le regole e le
 * tabelle, i gradini degli eroi per i numeri d'inizio e il motore, in un pezzo a
 * parte che il browser chiede dopo aver disegnato la pagina (team-builder.tsx, con
 * un import dinamico).
 *
 * Scelta dell'utente del 14/11, fra «solo quando servono» e «con la pagina»: sono
 * circa 95 KB compressi (dati 59, gradini 24, codice 12, misurati quel giorno),
 * piu' dei 83 KB che la pagina scaricava per la squadra. Cosi' la pagina si apre
 * leggera come prima, e i numeri arrivano un attimo dopo.
 */

const start: StartStatsData = {
  steps: SIMULATION_STEPS,
  // il set PS/Difesa al massimo: come parte il calcolatore della scheda eroe
  gear: gearTotals(GEAR, presetBuild(GEAR, GEAR_PRESETS[0]!)),
};

export const TEAM_SIM = { simulation: SIMULATION_DATA, start, simTotals };
export type TeamSimLoaded = typeof TEAM_SIM;
