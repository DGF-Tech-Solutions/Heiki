import { intlLocale, type Bilingual, type Locale } from "@/lib/i18n/locale";

/**
 * Le righe della tabella delle statistiche: le cinque che si guardano davvero, e
 * le altre sette a richiesta, coi nomi della schermata del gioco.
 *
 * "Potenza combattimento" (`fPower`) e' stata tolta il 26/09: era il solo bonus
 * del Vero risveglio, 1.500 per tutti gli eroi. La classe di combattimento vera
 * ha la sua riga, calcolata con la formula del client (heroCombatClass).
 */
export const STAT_ROWS: readonly { key: string; label: Bilingual<string>; percent?: boolean; extra?: boolean }[] = [
  { key: "atk", label: { it: "Attacco", en: "Attack" } },
  { key: "def", label: { it: "Difesa", en: "Defense" } },
  { key: "hp", label: { it: "PS", en: "HP" } },
  { key: "critPer", label: { it: "Possibilità critico", en: "Crit Chance" }, percent: true },
  { key: "critAtkPer", label: { it: "Danno critico", en: "Crit Damage" }, percent: true },
  { key: "fixedAtkPer", label: { it: "Perforazione", en: "Pierce Rate" }, percent: true, extra: true },
  { key: "critResPer", label: { it: "Resistenza critico", en: "Crit Resistance" }, percent: true, extra: true },
  { key: "critDefPer", label: { it: "Difesa critico", en: "Crit Defense" }, percent: true, extra: true },
  { key: "fixedDefPer", label: { it: "Resistenza", en: "Resistance" }, percent: true, extra: true },
  { key: "hpRecoveryPer", label: { it: "Velocità di recupero", en: "Recovery Rate" }, percent: true, extra: true },
  { key: "hpStealPer", label: { it: "Furto di vita", en: "Lifesteal" }, percent: true, extra: true },
  { key: "hpRegenPer", label: { it: "Velocità di rigenerazione", en: "Regeneration Rate" }, percent: true, extra: true },
];

export function statName(key: string, locale: Locale): string {
  return STAT_ROWS.find((row) => row.key === key)?.label[locale] ?? key;
}

export function isPercentStat(key: string): boolean {
  return STAT_ROWS.find((row) => row.key === key)?.percent ?? false;
}

/**
 * `useGrouping: "always"` e non il default: in italiano il raggruppamento
 * automatico salta i numeri di quattro cifre, e nella stessa colonna uscivano
 * `7412` e `10.002`.
 */
export function formatStat(n: number, locale: Locale, digits = 2): string {
  return n.toLocaleString(intlLocale(locale), { useGrouping: "always", maximumFractionDigits: digits });
}
