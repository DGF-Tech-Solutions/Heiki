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
  // `iconKey` e' il codice di TeamUnitData.Attribute, che e' anche il numero
  // nel nome dell'icona del gioco: RED=1 -> icon_filter_attribute_01.
  { id: "Forza", label: "Forza", color: "#E03B3B", iconKey: "1" },
  { id: "PS", label: "PS", color: "#3FBF5F", iconKey: "2" },
  { id: "Velocita", label: "Velocità", color: "#3B82E0", iconKey: "3" },
  { id: "Luce", label: "Luce", color: "#E8C33A", iconKey: "4" },
  { id: "Oscurita", label: "Oscurità", color: "#8B5CC7", iconKey: "5" },
  // Un solo eroe lo possiede - Tristan - e ha due colori invece di uno. Il
  // gioco non gli da' un'icona: resta il quadrato bicolore.
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
