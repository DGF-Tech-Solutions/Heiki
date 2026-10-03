/**
 * Funzioni pure sui cambiamenti di patch: le usano la pagina «Cambiamenti» e la
 * scheda Info dell'eroe. Il contratto sta in changes-types.ts.
 */

import type { ChangePart, ChangesIndex, HeroChange, HeroTouchup, PatchChanges } from "./changes-types";

/** L'ordine delle parti nella pagina: come nella scheda eroe, poi il resto. */
export const PART_ORDER: readonly ChangePart[] = [
  "nome",
  "passive",
  "skillsA",
  "skillsB",
  "skillsSpecial",
  "taboo",
  "grace",
  "solidarity",
  "ability",
  "stats",
  "craft",
  "fates",
  "costume",
];

/** Le parti che portano un id (reliquia, associato, costume): una voce per id. */
const PER_ID: ReadonlySet<ChangePart> = new Set(["craft", "fates", "costume"]);

export interface ChangeGroup {
  readonly part: ChangePart;
  /** l'id della reliquia, dell'associato o del costume; null per le altre parti */
  readonly id: number | null;
  readonly changes: readonly HeroChange[];
}

/**
 * Le voci di un eroe raggruppate per parte (e per id dove serve), nell'ordine
 * della scheda; dentro un gruppo per rango o livello, poi per campo (il nome
 * prima del testo).
 */
export function groupChanges(changes: readonly HeroChange[]): ChangeGroup[] {
  const groups = new Map<string, { part: ChangePart; id: number | null; changes: HeroChange[] }>();
  for (const change of changes) {
    const id = PER_ID.has(change.part) ? change.which : null;
    const key = `${change.part}:${id ?? ""}`;
    const group = groups.get(key) ?? { part: change.part, id, changes: [] };
    group.changes.push(change);
    groups.set(key, group);
  }
  const fieldRank = (field: string) => (field === "name" ? 0 : field === "nickname" ? 1 : field === "explain" ? 2 : 3);
  return [...groups.values()]
    .map((group) => ({
      ...group,
      changes: [...group.changes].sort(
        (a, b) =>
          (PER_ID.has(a.part) ? 0 : (a.which ?? -1) - (b.which ?? -1)) ||
          fieldRank(a.field) - fieldRank(b.field) ||
          a.field.localeCompare(b.field),
      ),
    }))
    .sort((a, b) => PART_ORDER.indexOf(a.part) - PART_ORDER.indexOf(b.part) || (a.id ?? 0) - (b.id ?? 0));
}

/** [2, 3, 4, 5, 6, 8] -> "2–6, 8": i ranghi toccati, scritti corti. */
export function compressRanges(values: readonly number[]): string {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  const runs: string[] = [];
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j]! + 1) j++;
    runs.push(j > i ? `${sorted[i]}–${sorted[j]}` : String(sorted[i]));
    i = j + 1;
  }
  return runs.join(", ");
}

/** I ritocchi di un eroe per parte, coi ranghi o livelli toccati. */
export function touchupParts(touchups: readonly HeroTouchup[]): { part: ChangePart; which: number[] }[] {
  const byPart = new Map<ChangePart, number[]>();
  for (const touchup of touchups) {
    const list = byPart.get(touchup.part) ?? [];
    if (touchup.which !== null) list.push(touchup.which);
    byPart.set(touchup.part, list);
  }
  return [...byPart.entries()]
    .map(([part, which]) => ({ part, which }))
    .sort((a, b) => PART_ORDER.indexOf(a.part) - PART_ORDER.indexOf(b.part));
}

export interface HeroHistoryEntry {
  readonly comparison: PatchChanges;
  /** l'eroe e' arrivato con questa patch */
  readonly isNew: boolean;
  readonly changes: readonly HeroChange[];
  readonly touchups: readonly HeroTouchup[];
}

/** Le patch in cui un eroe e' arrivato o cambiato, dalla piu' recente. */
export function heroHistory(index: ChangesIndex, heroId: string): HeroHistoryEntry[] {
  return index.comparisons.flatMap((comparison) => {
    const isNew = comparison.newHeroes.includes(heroId);
    const changes = comparison.heroes[heroId] ?? [];
    const touchups = comparison.touchups[heroId] ?? [];
    return isNew || changes.length > 0 || touchups.length > 0 ? [{ comparison, isNew, changes, touchups }] : [];
  });
}

/** L'ancora della patch nella pagina: #p-AAAA-MM-GG. */
export function patchAnchor(comparison: Pick<PatchChanges, "to">): string {
  return `p-${comparison.to}`;
}
