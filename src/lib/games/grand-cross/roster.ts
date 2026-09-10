/**
 * Roster di Grand Cross: le parti decise a mano.
 *
 * I dati stanno in heroes.generated.ts e si rigenerano a ogni aggiornamento del
 * gioco. Qui c'e' solo quello che una rigenerazione non deve poter cambiare:
 * come si chiamano gli attributi, di che colore sono e in che ordine compaiono
 * nei filtri. Sono decisioni di interfaccia, non dati estratti, e mescolarle al
 * file generato significherebbe riscriverle ogni volta.
 */

import type { HeroAffinity, HeroRoster } from "../types";
import { HEROES } from "./heroes.generated";

/**
 * Il triangolo degli attributi, poi Luce e Oscurita' che si contrastano fra
 * loro. L'ordine e' quello del gioco, non alfabetico: chi ci gioca lo legge
 * come una sequenza, e riordinarlo alfabeticamente lo renderebbe irriconoscibile.
 *
 * I colori sono quelli con cui il gioco tinge le cornici, presi dagli asset.
 */
export const AFFINITIES: readonly HeroAffinity[] = [
  { id: "Forza", label: "Forza", color: "#E03B3B" },
  { id: "PS", label: "PS", color: "#3FBF5F" },
  { id: "Velocita", label: "Velocità", color: "#3B82E0" },
  { id: "Luce", label: "Luce", color: "#E8C33A" },
  { id: "Oscurita", label: "Oscurità", color: "#8B5CC7" },
  // Un solo eroe lo possiede - Tristan - e ha due colori invece di uno.
  { id: "Luce/Oscurita", label: "Luce/Oscurità", color: "#C9A227", colorAlt: "#8B5CC7" },
];

export const ROSTER: HeroRoster = {
  heroes: HEROES,
  // LR sta sopra UR: e' il grado introdotto dopo, non un'abbreviazione diversa
  // della stessa cosa.
  rarities: ["LR", "UR"],
  // Dalla piu' cara alla piu' comune: e' l'informazione che interessa, perche'
  // un UR uscito come R si ottiene senza il gacha.
  obtainable: ["UR", "SSR", "SR", "R"],
  affinities: AFFINITIES,
};
