/**
 * Ricerca e filtri sul roster.
 *
 * Funzioni pure, separate dalla pagina di proposito: sono la parte che si puo'
 * sbagliare in silenzio - un accento che non combacia, un contatore che conta
 * le voci sbagliate - e in un componente React andrebbero verificate a occhio.
 * Qui si verificano con dei test.
 *
 * Il Core non sa niente di Grand Cross: legge solo HeroEntry.
 */

import type { HeroEntry } from "./types";

export interface HeroFilter {
  rarity?: string | null;
  affinity?: string | null;
  obtainable?: string | null;
  search?: string;
}

/** Campo su cui contare le voci per i contatori dei filtri. */
export type HeroFacet = "rarity" | "affinity" | "obtainedAs";

/**
 * Forma confrontabile di un testo.
 *
 * Gli accenti vanno tolti perche' i nomi arrivano dal gioco in inglese ma chi
 * cerca scrive all'italiana, e le parentesi quadre perche' sono nel dato ma
 * nessuno le digita: senza, cercare "free wind" non troverebbe "[Free Wind]".
 */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[[\]']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Testo su cui cerca l'utente: tutto quello che ha in mano guardando la card. */
function haystack(hero: HeroEntry): string {
  return normalize(`${hero.name} ${hero.epithet} ${hero.group} ${hero.id}`);
}

/**
 * Applica i filtri attivi.
 *
 * I criteri si sommano (rarita' E attributo), e quelli non valorizzati non
 * restringono niente: e' il comportamento che ci si aspetta da una fila di
 * pulsanti dove "Tutti" e' uno stato, non un filtro.
 *
 * La ricerca accetta piu' parole e le richiede tutte, in qualsiasi ordine:
 * "meliodas ira" trova "The Wrath of Meliodas" senza doverne indovinare la
 * forma esatta.
 */
export function filterHeroes(heroes: readonly HeroEntry[], filter: HeroFilter): HeroEntry[] {
  const words = normalize(filter.search ?? "").split(" ").filter(Boolean);

  return heroes.filter((hero) => {
    if (filter.rarity && hero.rarity !== filter.rarity) return false;
    if (filter.affinity && hero.affinity !== filter.affinity) return false;
    if (filter.obtainable && hero.obtainedAs !== filter.obtainable) return false;
    if (words.length === 0) return true;

    const text = haystack(hero);
    return words.every((word) => text.includes(word));
  });
}

/**
 * Quante voci per ogni valore di una sfaccettatura.
 *
 * Serve a scrivere il numero sui pulsanti dei filtri. Va calcolato sull'elenco
 * gia' filtrato dagli ALTRI criteri, non su quello completo: un pulsante che
 * promette 118 voci e poi ne mostra 3 e' peggio che non avere il numero.
 */
export function countHeroes(
  heroes: readonly HeroEntry[],
  facet: HeroFacet,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const hero of heroes) {
    const value = hero[facet];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

export type HeroOrder = "roster" | "name" | "group";

/**
 * Ordina senza toccare l'elenco ricevuto.
 *
 * "roster" e' l'ordine in cui il modulo li dichiara - per Grand Cross e'
 * l'ordine di uscita, dal piu' recente - ed e' il default perche' e' l'unico
 * che risponde alla domanda "cosa e' uscito ultimamente".
 */
export function sortHeroes(heroes: readonly HeroEntry[], order: HeroOrder): HeroEntry[] {
  const sorted = [...heroes];
  const byName = (a: HeroEntry, b: HeroEntry) => a.name.localeCompare(b.name, "it");

  if (order === "name") return sorted.sort(byName);
  if (order === "group") {
    return sorted.sort((a, b) => a.group.localeCompare(b.group, "it") || byName(a, b));
  }
  return sorted;
}

/**
 * Percorso della card di un eroe.
 *
 * Convenzione unica del progetto: `public/eroi/<gioco>/<id>.png` a 128px e la
 * stessa sotto `2x/` a 256px. Le immagini non sono versionate - sono asset del
 * gioco - e le mette in piedi `npm run eroi:import`.
 */
export function heroCardSrc(gameSlug: string, heroId: string, scale: 1 | 2 = 1): string {
  return scale === 2 ? `/eroi/${gameSlug}/2x/${heroId}.png` : `/eroi/${gameSlug}/${heroId}.png`;
}

/** Illustrazione a figura intera: `public/eroi/<gioco>/splash/<id>.png`. */
export function heroSplashSrc(gameSlug: string, heroId: string): string {
  return `/eroi/${gameSlug}/splash/${heroId}.png`;
}

/** Carta d'attacco n-esima: `public/eroi/<gioco>/carte/<id>/<n>.png`. */
export function heroCardArtSrc(gameSlug: string, heroId: string, n: number): string {
  return `/eroi/${gameSlug}/carte/${heroId}/${n}.png`;
}

/**
 * Carta dell'ultimate: `public/eroi/<gioco>/ultimate/<id>.png`.
 *
 * In una cartella a parte e non come `carte/<id>/ultimate.png`: la cartella
 * delle carte si mostra anche per conteggio, «le N illustrazioni», e un file in
 * piu' li' dentro rischierebbe di finire nel conto.
 */
export function heroUltimateArtSrc(gameSlug: string, heroId: string): string {
  return `/eroi/${gameSlug}/ultimate/${heroId}.png`;
}

/** Icona dell'abilita' esclusiva: `public/eroi/<gioco>/abilita/<id>.png`. */
export function heroSkillIconSrc(gameSlug: string, heroId: string): string {
  return `/eroi/${gameSlug}/abilita/${heroId}.png`;
}

/**
 * Icona di un'abilita' speciale, gia' nella sua cornice:
 * `public/eroi/<gioco>/speciali/<id abilita'>.png`. Per id dell'abilita' e non
 * dell'eroe, perche' le versioni di un personaggio la condividono.
 */
export function heroSpecialIconSrc(gameSlug: string, abilityId: string): string {
  return `/eroi/${gameSlug}/speciali/${abilityId}.png`;
}

/** Le famiglie di icone che il gioco usa per etichettare un eroe. */
export type IconFamily = "razza" | "attributo" | "rarita" | "carta" | "condizione";

/**
 * Icona del gioco per un valore: `public/eroi/<gioco>/icone/<famiglia>/<chiave>.png`.
 *
 * Sono le icone con cui il gioco stesso filtra il proprio roster - si chiamano
 * `icon_filter_kind_01`, `icon_filter_attribute_01`, `icon_filter_grade_LR` -
 * quindi la chiave e' il codice del gioco (1-6 per la razza, 1-5 per
 * l'attributo) o la sigla (R, SR, SSR, UR, LR).
 *
 * Non tutte le famiglie ce l'hanno: le FAZIONI non hanno icona, cercata su ogni
 * pista (icon_filter_*, icon_job, icon_group, icon_category, hero_category,
 * characteristic, emblem e i nomi delle nove fazioni): zero risultati. Restano
 * testo, e non e' una mancanza dell'estrazione.
 */
export function gameIconSrc(gameSlug: string, family: IconFamily, key: string | number): string {
  return `/eroi/${gameSlug}/icone/${family}/${key}.png`;
}
