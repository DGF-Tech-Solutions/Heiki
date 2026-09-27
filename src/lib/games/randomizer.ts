/**
 * Il sorteggio del Randomizer: quattro eroi in campo e quattro nei loro Slot
 * associazione.
 *
 * Richiesta dell'utente del 27/09: un pulsante che pesca a caso quattro eroi e
 * altri quattro da associare, e una modalita' «Sinergia» in cui gli eroi usciti
 * hanno per forza una sinergia fra loro. Funzioni pure, separate dalla pagina
 * come quelle della griglia (heroes.ts): chi pesca e' il browser, ma le regole si
 * verificano con dei test.
 *
 * Le regole del gioco che si rispettano: nella squadra un personaggio sta una
 * volta sola, associazioni comprese («Lo stesso Eroe non puo' essere impostato in
 * uno Slot associazione», `UI_team_setting_notice_04`), e «stesso eroe» e' il
 * personaggio (`HeroEntry.group`), non la versione. Another Ban e Another
 * Meliodas il client li tiene in un gruppo loro («IF Ban», «IF Meliodas») e
 * possono stare in squadra con Ban e Meliodas: l'ha confermato l'utente il 27/09.
 *
 * Cosa vuol dire «sinergia» l'ha precisato l'utente, la stessa sera: le passive
 * dei quattro IN CAMPO funzionano fra loro; gli associati non c'entrano. Qui
 * diventa: nessuna Unica resta senza i suoi alleati. Almeno tre dei quattro hanno
 * un'Unica che nomina degli «alleati applicabili» (una nota «※Applicable Allies:
 * ...», i gruppi delle parole blu), e ognuna vale per tutti gli altri in campo; il
 * quarto ha un'Unica cosi' anche lui, oppure una non specifica (vale per tutti, o
 * solo per se'), e allora basta che le altre tre valgano per lui. Misurato il
 * 27/09: 10.604 squadre con quattro Uniche specifiche e 243.834 col quarto non
 * specifico (5.740 e 99.900 senza collaborazioni). Una razza o una caratteristica
 * in comune da sola non conta: senza un'Unica che la nomini, in battaglia non fa
 * niente. Una prima versione, lo stesso giorno, chiedeva l'Unica al solo primo
 * eroe e un legame a ogni associato: non era la sinergia che l'utente intendeva.
 */

import type { HeroFate, HeroFatesIndex } from "./hero-fates-types";
import { inGroup, parseTarget, textKey, type TermMember } from "./hero-terms";
import type { HeroTermGroup, HeroTermsIndex } from "./hero-terms-types";
import type { HeroAbilities } from "./types";

/** Un numero in [0, 1): `Math.random` nel browser, un generatore con seme nei test. */
export type Rng = () => number;

/** Gli eroi di una squadra: quattro in campo, e per ognuno quello nello Slot associazione. */
export interface TeamSlot {
  readonly main: string;
  readonly associate: string;
}

export interface TeamDraw {
  readonly slots: readonly TeamSlot[];
  /** true se le Uniche dei quattro in campo valgono l'una per l'altra (modalita' Sinergia) */
  readonly synergy: boolean;
}

/**
 * Chi copre l'Unica di un eroe: i gruppi «applicabili» che nomina, e gli eroi che
 * ne fanno parte, tolto il suo personaggio.
 */
export interface UniqueCover {
  readonly hero: string;
  /** posizioni in `HeroTermsIndex.groups`: quasi sempre una */
  readonly groups: readonly number[];
  readonly covers: ReadonlySet<string>;
}

/** Quanti eroi in campo, come nel gioco. */
export const TEAM_SIZE = 4;

/**
 * La caratteristica delle collaborazioni: `TeamUnitData.JobGroup.COLLABO` del
 * client, «Collab» nei suoi testi. La portano 71 eroi, 64 personaggi.
 */
export const COLLAB_FACTION = 3;

export function isCollab(hero: Pick<TermMember, "factions">): boolean {
  return hero.factions.includes(COLLAB_FACTION);
}

function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/**
 * `count` eroi a caso, di personaggi diversi fra loro e da quelli in `used`
 * (che si aggiorna). Lancia se non ce ne sono abbastanza.
 */
function pickDistinct(heroes: readonly TermMember[], count: number, used: Set<string>, rng: Rng): string[] {
  const picked: string[] = [];
  for (const hero of shuffled(heroes, rng)) {
    if (picked.length === count) break;
    if (used.has(hero.group)) continue;
    used.add(hero.group);
    picked.push(hero.id);
  }
  if (picked.length < count) throw new Error("randomizer: non ci sono abbastanza personaggi diversi");
  return picked;
}

function team(mains: readonly string[], associates: readonly string[], synergy: boolean): TeamDraw {
  return { slots: mains.map((main, i) => ({ main, associate: associates[i]! })), synergy };
}

/**
 * Quattro in campo e quattro associati, tutti a caso fra `heroes`, otto
 * personaggi diversi. Chi vuole togliere qualcuno (le collaborazioni) passa
 * l'elenco gia' ristretto. Lancia se non ci sono otto personaggi.
 */
export function drawRandom(heroes: readonly TermMember[], rng: Rng): TeamDraw {
  const picked = pickDistinct(heroes, TEAM_SIZE * 2, new Set(), rng);
  return team(picked.slice(0, TEAM_SIZE), picked.slice(TEAM_SIZE), false);
}

/**
 * Gli eroi la cui Unica nomina degli alleati applicabili, col gruppo nominato.
 *
 * Si leggono le parole blu dei testi dell'Unica (quello del rango 1 e quelli che
 * cambiano col rango dell'ultimate): un bersaglio `g:<n>` e' una nota
 * «applicabili». I gruppi di nemici («Applicable Enemies») non sono una sinergia.
 */
export function unicaLeaders(
  abilities: Readonly<Record<string, HeroAbilities>>,
  terms: HeroTermsIndex,
): { hero: string; group: number }[] {
  const leaders: { hero: string; group: number }[] = [];
  for (const [hero, own] of Object.entries(abilities)) {
    const passive = own.passive;
    if (!passive?.text) continue;
    const groups = new Set<number>();
    for (const text of [passive.text, ...(passive.ultimateSteps ?? []).map((step) => step.text)]) {
      for (const target of terms.texts[textKey(text)] ?? []) {
        if (target) for (const group of parseTarget(target).groups) groups.add(group);
      }
    }
    for (const group of [...groups].sort((a, b) => a - b)) {
      if (!terms.groups[group]?.enemies) leaders.push({ hero, group });
    }
  }
  return leaders;
}

/**
 * Per ogni eroe di `leaders`, chi copre la sua Unica fra `heroes`. Se un'Unica
 * nomina due gruppi (col rango dell'ultimate cambia la nota), vale l'uno O
 * l'altro.
 */
export function uniqueCovers(
  heroes: readonly TermMember[],
  leaders: readonly { hero: string; group: number }[],
  /** per posizione, come `HeroTermsIndex.groups`; null dove al chiamante il gruppo non serve */
  groups: readonly (HeroTermGroup | null)[],
): Map<string, UniqueCover> {
  const byId = new Map(heroes.map((hero) => [hero.id, hero]));
  const covers = new Map<string, { hero: string; groups: number[]; covers: Set<string> }>();
  for (const { hero, group } of leaders) {
    const leader = byId.get(hero);
    const rule = groups[group];
    if (!leader || !rule) continue;
    const entry = covers.get(hero) ?? { hero, groups: [], covers: new Set<string>() };
    entry.groups.push(group);
    for (const other of heroes) {
      if (other.group !== leader.group && inGroup(rule, other, leader.id)) entry.covers.add(other.id);
    }
    covers.set(hero, entry);
  }
  return covers;
}

/** Le Uniche di `a` e di `b` valgono l'una per l'altro. */
export function coverEachOther(covers: ReadonlyMap<string, UniqueCover>, a: string, b: string): boolean {
  return !!covers.get(a)?.covers.has(b) && !!covers.get(b)?.covers.has(a);
}

/**
 * Una squadra con la sinergia per forza (la regola e' in cima al file): tre eroi
 * di `heroes` con un'Unica che nomina alleati, che si coprono a vicenda; un quarto
 * con un'Unica cosi' anche lui, o non specifica e coperto dagli altri tre; poi
 * quattro associati a caso, di personaggi diversi.
 *
 * I tre si cercano a ritroso partendo dagli eroi mescolati: un eroe entra se la
 * sua Unica e quelle di chi c'e' gia' si coprono a vicenda. E' piu' semplice che
 * elencare le squadre possibili, e ogni pesca parte da un ordine diverso. Per il
 * quarto si sceglie prima, a meta', fra un'Unica specifica e una non specifica:
 * pescandolo fra tutti i candidati insieme, le squadre con quattro Uniche
 * specifiche (una ogni venti) non uscirebbero quasi mai. Lancia se in `heroes`
 * non c'e' nessuna squadra cosi'.
 */
export function drawSynergy(
  heroes: readonly TermMember[],
  covers: ReadonlyMap<string, UniqueCover>,
  rng: Rng,
): TeamDraw {
  const groupOf = new Map(heroes.map((hero) => [hero.id, hero.group]));
  const candidates = shuffled(
    [...covers.keys()].filter((id) => groupOf.has(id)),
    rng,
  );
  const plain = heroes.filter((hero) => !covers.has(hero.id)).map((hero) => hero.id);

  /** il quarto per tre eroi che si coprono gia' a vicenda, o null se non c'e' */
  function complete(three: readonly string[]): readonly string[] | null {
    const used = new Set(three.map((id) => groupOf.get(id)));
    const covered = (id: string) =>
      !used.has(groupOf.get(id)) && three.every((member) => covers.get(member)!.covers.has(id));
    const kinds = [
      candidates.filter((id) => covered(id) && three.every((member) => coverEachOther(covers, member, id))),
      plain.filter(covered),
    ].filter((kind) => kind.length > 0);
    if (kinds.length === 0) return null;
    const kind = kinds[Math.floor(rng() * kinds.length)]!;
    return [...three, kind[Math.floor(rng() * kind.length)]!];
  }

  function extend(chosen: readonly string[]): readonly string[] | null {
    if (chosen.length === TEAM_SIZE - 1) return complete(chosen);
    const used = new Set(chosen.map((id) => groupOf.get(id)));
    for (const next of candidates) {
      if (used.has(groupOf.get(next))) continue;
      if (!chosen.every((member) => coverEachOther(covers, member, next))) continue;
      const found = extend([...chosen, next]);
      if (found) return found;
    }
    return null;
  }

  for (const start of candidates) {
    const mains = extend([start]);
    if (!mains) continue;
    const used = new Set(mains.map((id) => groupOf.get(id)!));
    const associates = pickDistinct(heroes, TEAM_SIZE, used, rng);
    return team(shuffled(mains, rng), associates, true);
  }
  throw new Error("drawSynergy: nessuna squadra in cui le Uniche valgano l'una per l'altra");
}

/** Il legame fra un eroe e il suo associato, se c'e'. */
export function fateBetween(fates: HeroFatesIndex, main: string, associate: string): HeroFate | undefined {
  return fates.heroes[main]?.find(([other]) => other === associate);
}
