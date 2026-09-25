import type { HeroStatSteps } from "./types";

/**
 * Le statistiche di un eroe a un punto qualunque della sua crescita.
 *
 * E' la somma che fa il gioco (SkinData.GetTotalStatWithoutPassive), coi pezzi
 * che la pipeline legge dalle tabelle del client: con tutto al massimo ridà
 * esattamente `HeroStats.max`, e il test lo controlla eroe per eroe. Per questo
 * sta qui e non dentro il componente: lo slider e il test devono sommare con la
 * stessa funzione.
 */
export interface StatSelection {
  /** 1 .. maxLevel */
  readonly level: number;
  /** Risvegli fatti, 0-6 */
  readonly awaken: number;
  /** Super risvegli fatti, 0-6: nel gioco si fanno solo dopo il sesto Risveglio */
  readonly superAwaken: number;
  /** la Reliquia sacra potenziata al massimo */
  readonly relic: boolean;
  /** i cinque costumi migliori per tipo, al massimo */
  readonly costumes: boolean;
}

export function maxSelection(steps: HeroStatSteps): StatSelection {
  return {
    level: steps.maxLevel,
    awaken: steps.awaken.length,
    superAwaken: steps.superAwaken.length,
    relic: steps.relic !== undefined,
    costumes: true,
  };
}

/**
 * La selezione come la permette il gioco: il livello fra 1 e il massimo, i
 * Super risvegli solo a Risveglio completo, la reliquia solo se l'eroe ce l'ha.
 */
export function clampSelection(steps: HeroStatSteps, selection: StatSelection): StatSelection {
  const clamp = (value: number, max: number, min = 0) =>
    Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : max)));
  const awaken = clamp(selection.awaken, steps.awaken.length);
  return {
    level: clamp(selection.level, steps.maxLevel, 1),
    awaken,
    superAwaken: awaken < steps.awaken.length ? 0 : clamp(selection.superAwaken, steps.superAwaken.length),
    relic: selection.relic && steps.relic !== undefined,
    costumes: selection.costumes,
  };
}

export function statsAt(steps: HeroStatSteps, selection: StatSelection): Record<string, number> {
  const { level, awaken, superAwaken, relic, costumes } = clampSelection(steps, selection);
  const total: Record<string, number> = { ...steps.base };
  const add = (part: Readonly<Record<string, number>>, times = 1) => {
    for (const [key, value] of Object.entries(part)) total[key] = (total[key] ?? 0) + value * times;
  };

  add(steps.perLevel, level - 1);
  for (const step of steps.awaken.slice(0, awaken)) add(step);
  for (const step of steps.superAwaken.slice(0, superAwaken)) add(step);
  if (relic && steps.relic) add(steps.relic);
  if (costumes) add(steps.costumes);

  // Le percentuali sono mezzi punti e decimi: sommate in virgola mobile
  // lascerebbero code come 145.50000000000003.
  return Object.fromEntries(
    Object.entries(total).map(([key, value]) => [key, Math.round(value * 1e4) / 1e4]),
  );
}
