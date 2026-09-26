/**
 * Funzioni pure per le pagine del gruppo Endgame.
 *
 * Niente React qui: formati di numeri e percorsi, che si provano con un test e
 * che le quattro pagine usano allo stesso modo.
 */

import { intlLocale, type Locale } from "@/lib/i18n/locale";
import type { EndgameDrop, EndgameDrops, EndgameFoe } from "./endgame-types";

/** Un'immagine delle modalita': `public/eroi/<gioco>/endgame/<percorso>`. Le copia `npm run eroi:import`. */
export function endgameImageSrc(gameSlug: string, path: string): string {
  return `/eroi/${gameSlug}/endgame/${path}`;
}

/**
 * La probabilita' di una voce per estrazione, in percento.
 *
 * Il peso e' su 10.000 (i pesi di ogni stage sommano esattamente a 10.000): 50
 * e' lo 0,5%. La pipeline ha controllato la somma su tutti gli stage; qui si
 * divide e basta.
 */
export function dropChance(entry: Pick<EndgameDrop, "weight">): number {
  return entry.weight / 100;
}

/** 0,5% / 40% / 16,67%: fino a due decimali, senza zeri inutili. */
export function formatPercent(value: number, locale: Locale): string {
  return `${value.toLocaleString(intlLocale(locale), { maximumFractionDigits: 2 })}%`;
}

/** La somma dei pesi: 10.000 se lo stage e' coerente. La usa il test. */
export function dropWeightTotal(drops: EndgameDrops): number {
  return drops.entries.reduce((sum, entry) => sum + entry.weight, 0);
}

/**
 * Un moltiplicatore dal percento del client: 250 -> «×2,5».
 *
 * Il client scrive `boss_hp_inc_per 250`, e «250%» si legge come «+250%»,
 * cioe' 3,5 volte: la forma col per evita l'equivoco.
 */
export function formatMultiplier(percent: number, locale: Locale): string {
  return `×${(percent / 100).toLocaleString(intlLocale(locale), { maximumFractionDigits: 2 })}`;
}

/**
 * Un numero grande in forma breve: 11.028.000 -> «11 Mln» / «11M».
 *
 * Per le statistiche stimate: sono una stima, e sette cifre esatte direbbero
 * una precisione che non c'e'. La forma breve la decide Intl nella lingua di
 * chi legge, ma l'italiano non abbrevia le migliaia («370.875» resterebbe
 * intero): per questo prima si arrotonda a tre cifre significative, e diventa
 * «371.000».
 */
export function formatCompact(value: number, locale: Locale): string {
  const rounded = value === 0 ? 0 : Number(value.toPrecision(3));
  return rounded.toLocaleString(intlLocale(locale), { notation: "compact", maximumFractionDigits: 1 });
}

/** Un numero intero con i separatori della lingua: 2.000.000 / 2,000,000. */
export function formatNumber(value: number, locale: Locale): string {
  return value.toLocaleString(intlLocale(locale));
}

/**
 * I nemici di un gruppo, contati: tre «Guerriero della Dea» uguali sono una
 * scheda con «×3», non tre schede identiche. Uguali vuol dire stesso mostro,
 * stesso livello, stessi moltiplicatori e stesse passive in piu'; l'ordine e'
 * quello della prima comparsa.
 */
export function countFoes(foes: readonly EndgameFoe[]): { foe: EndgameFoe; count: number }[] {
  const out: { foe: EndgameFoe; count: number; key: string }[] = [];
  for (const foe of foes) {
    const key = JSON.stringify([foe.monster, foe.level, foe.multipliers, foe.extraPassives ?? []]);
    const known = out.find((entry) => entry.key === key);
    if (known) known.count++;
    else out.push({ foe, count: 1, key });
  }
  return out.map(({ foe, count }) => ({ foe, count }));
}

/** I parametri dell'indirizzo come li passa Next a una pagina. */
export type PageSearchParams = Readonly<Record<string, string | string[] | undefined>>;

/**
 * Quale difficolta' mostrare per una sezione: quella nell'indirizzo, se e' una
 * di quelle possibili, se no la piu' alta (scelta dell'utente: si parte dalla
 * piu' difficile). `values` sono i valori che l'indirizzo puo' portare, in
 * ordine; torna la posizione.
 */
export function chosenLevel(params: PageSearchParams, key: string, values: readonly number[]): number {
  const raw = params[key];
  const wanted = Number(Array.isArray(raw) ? raw[0] : raw);
  const index = values.indexOf(wanted);
  return index >= 0 ? index : values.length - 1;
}

/**
 * L'indirizzo con una difficolta' cambiata e le altre scelte intatte, piu'
 * l'ancora della sezione: dopo il clic si resta sul boss, e la scelta fatta su
 * un altro boss non si perde.
 */
export function levelHref(params: PageSearchParams, key: string, value: number, anchor: string): string {
  const query = new URLSearchParams();
  for (const [name, raw] of Object.entries(params)) {
    const text = Array.isArray(raw) ? raw[0] : raw;
    if (text !== undefined && name !== key) query.set(name, text);
  }
  query.set(key, String(value));
  return `?${query.toString()}#${anchor}`;
}
