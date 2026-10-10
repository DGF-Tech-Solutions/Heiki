/**
 * La ricerca rapida: l'indice (lo scrive /api/cerca-rapida) e come si cerca
 * dentro. Funzioni pure: le usano il pannello (quick-search.tsx) e i test.
 *
 * Come si cerca. Il testo si confronta senza accenti, maiuscole e punteggiatura,
 * parola per parola: ogni parola scritta deve stare nel nome, nell'epiteto o nel
 * personaggio, nelle due lingue («meliodas demone», «demon meliodas»). Vince chi
 * ha il nome che comincia con la ricerca, poi una parola del nome, poi il resto;
 * a parita' resta l'ordine dell'indice, che per gli eroi e' l'uscita (il piu'
 * recente prima).
 */

import type { Locale } from "@/lib/i18n/locale";

export type QuickKind = "boss" | "bestia" | "set" | "carta";

export interface QuickIndex {
  /** id, nome it, epiteto it, nome en, epiteto en, personaggio */
  readonly heroes: readonly (readonly [string, string, string, string, string, string])[];
  /** nome it, nome en, percorso dentro il gioco */
  readonly pages: readonly (readonly [string, string, string])[];
  /** tipo, nome it, nome en, percorso dentro il gioco */
  readonly items: readonly (readonly [QuickKind, string, string, string])[];
}

export interface QuickResult {
  readonly kind: "eroe" | "pagina" | QuickKind;
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  /** percorso dentro il gioco, «/eroi/1575001» */
  readonly path: string;
}

export function normalizeQuery(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Quanto bene `words` descrive `name` (con `extra` intorno); 0 se una parola manca. */
function score(words: readonly string[], query: string, name: string, extra: string): number {
  const n = normalizeQuery(name);
  const all = ` ${n} ${normalizeQuery(extra)} `;
  if (!words.every((word) => all.includes(` ${word}`) || all.includes(word))) return 0;
  if (n.startsWith(query)) return 4;
  if (` ${n}`.includes(` ${words[0]}`)) return 3;
  if (words.every((word) => all.includes(` ${word}`))) return 2;
  return 1;
}

function ranked<T>(entries: readonly T[], rate: (entry: T) => number, limit: number): T[] {
  return entries
    .map((entry, order) => ({ entry, order, value: rate(entry) }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value || a.order - b.order)
    .slice(0, limit)
    .map((x) => x.entry);
}

export function quickSearch(
  index: QuickIndex,
  text: string,
  locale: Locale,
  limits = { heroes: 8, pages: 4, items: 6 },
): { heroes: QuickResult[]; pages: QuickResult[]; items: QuickResult[] } {
  const query = normalizeQuery(text);
  const words = query.split(" ").filter(Boolean);
  if (words.length === 0) return { heroes: [], pages: [], items: [] };
  const it = locale === "it";

  const heroes = ranked(
    index.heroes,
    ([, nameIt, epithetIt, nameEn, epithetEn, group]) =>
      Math.max(
        score(words, query, it ? nameIt : nameEn, `${it ? epithetIt : epithetEn} ${group} ${it ? nameEn : nameIt} ${it ? epithetEn : epithetIt}`),
        score(words, query, it ? nameEn : nameIt, `${epithetIt} ${epithetEn} ${group}`) - 1,
      ),
    limits.heroes,
  ).map(([id, nameIt, epithetIt, nameEn, epithetEn]) => ({
    kind: "eroe" as const,
    id,
    title: it ? nameIt : nameEn,
    subtitle: it ? epithetIt : epithetEn,
    path: `/eroi/${id}`,
  }));

  const pages = ranked(index.pages, ([labelIt, labelEn]) => score(words, query, it ? labelIt : labelEn, it ? labelEn : labelIt), limits.pages).map(
    ([labelIt, labelEn, path]) => ({ kind: "pagina" as const, id: path, title: it ? labelIt : labelEn, subtitle: "", path }),
  );

  const items = ranked(index.items, ([, nameIt, nameEn]) => score(words, query, it ? nameIt : nameEn, it ? nameEn : nameIt), limits.items).map(
    ([kind, nameIt, nameEn, path]) => ({ kind, id: path, title: it ? nameIt : nameEn, subtitle: "", path }),
  );

  return { heroes, pages, items };
}
