/**
 * Roster di Grand Cross: le parti decise a mano.
 *
 * I dati stanno in heroes.generated.ts e si rigenerano a ogni aggiornamento del
 * gioco. Qui c'e' solo quello che una rigenerazione non deve poter cambiare:
 * come si chiamano gli attributi, di che colore sono e in che ordine compaiono
 * nei filtri. Sono decisioni di interfaccia, non dati estratti, e mescolarle al
 * file generato significherebbe riscriverle ogni volta.
 */

import type { Bilingual, Locale } from "@/lib/i18n/locale";
import type { HeroAffinity, HeroRoster } from "../types";
import { HEROES } from "./heroes.generated";

/**
 * Il triangolo degli attributi (Forza batte PS, PS batte Velocita', Velocita'
 * batte Forza), poi Luce e Oscurita', che nel codice del gioco stanno fuori dal
 * triangolo: niente vantaggi ne' svantaggi, un effetto di squadra ciascuno
 * (data/grand-cross/concetti/identita.json, «vantaggi»). L'ordine e' quello del
 * gioco, non alfabetico: chi ci gioca lo legge come una sequenza, e riordinarlo
 * alfabeticamente lo renderebbe irriconoscibile.
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

/**
 * Il nome di un attributo nelle due lingue. `label` in AFFINITIES resta
 * l'italiano per chi non passa ancora la lingua; in inglese i nomi sono quelli
 * del gioco (Strength, HP, Speed, Light, Dark).
 */
const AFFINITY_NAMES: Readonly<Record<string, Bilingual>> = {
  Forza: { it: "Forza", en: "Strength" },
  PS: { it: "PS", en: "HP" },
  Velocita: { it: "Velocità", en: "Speed" },
  Luce: { it: "Luce", en: "Light" },
  Oscurita: { it: "Oscurità", en: "Dark" },
  "Luce/Oscurita": { it: "Luce/Oscurità", en: "Light/Dark" },
};

export function affinityLabel(id: string, locale: Locale): string {
  return AFFINITY_NAMES[id]?.[locale] ?? AFFINITIES.find((affinity) => affinity.id === id)?.label ?? id;
}

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
