/**
 * Una strategia pronta per essere mostrata: gli id del gioco diventano nomi,
 * card e collegamenti nella lingua di chi legge.
 *
 * Funzioni pure sul modulo del gioco: le usano le schede delle pagine
 * dell'Endgame, la pagina del post, il feed e la coda dei moderatori, cosi' un
 * eroe o un set si presentano allo stesso modo dappertutto.
 */

import { cardImageSrc, setCode } from "@/lib/games/artifacts";
import { plainHeroText } from "@/lib/games/hero-markup";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { inLingua, type Locale } from "@/lib/i18n/locale";
import type { GameModule } from "@/lib/games/types";
import { autoTitle, findLevel, findTarget, selectionLabel } from "./rules";
import type { StrategySelection, StrategySlot } from "./types";

export interface HeroView {
  readonly id: string;
  readonly name: string;
  readonly epithet: string;
  readonly card: string;
  readonly card2x: string;
  /** il colore dell'attributo, per il filo sotto la card */
  readonly color: string | null;
  readonly href: string;
}

export interface SlotView {
  readonly hero: HeroView;
  readonly associate: HeroView | null;
}

export interface SetView {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly image: string | null;
  readonly cards: number;
  /** la passiva al livello massimo, in testo semplice */
  readonly bonus: string | null;
  readonly href: string;
}

export interface PhaseView {
  readonly label: string;
  readonly detail: string | null;
  readonly note: string;
}

export function heroView(module: GameModule, id: string, locale: Locale): HeroView {
  const game = module.slug;
  const hero = module.roster?.heroes.find((item) => item.id === id);
  const affinity = hero ? module.roster?.affinities.find((item) => item.id === hero.affinity) : undefined;
  return {
    id,
    // un eroe tolto dal gioco dopo la strategia resta col suo id: la squadra non si rompe
    name: hero ? heroName(hero, locale) : id,
    epithet: hero ? heroEpithet(hero, locale) : "",
    card: heroCardSrc(game, id),
    card2x: heroCardSrc(game, id, 2),
    color: affinity?.color ?? null,
    href: `/${game}/eroi/${id}`,
  };
}

export function teamView(module: GameModule, team: readonly StrategySlot[], locale: Locale): SlotView[] {
  return team.map((slot) => ({
    hero: heroView(module, slot.hero, locale),
    associate: slot.associate ? heroView(module, slot.associate, locale) : null,
  }));
}

export function setView(module: GameModule, id: string | null, locale: Locale): SetView | null {
  if (!id) return null;
  const set = module.artifacts?.sets.find((item) => item.id === id);
  if (!set) return null;
  const first = set.cards[0];
  const card = first ? module.artifacts?.cards.find((item) => item.id === first) : undefined;
  const bonus = set.levels[set.levels.length - 1];
  return {
    id: set.id,
    code: setCode(set),
    name: plainHeroText(inLingua(set.name, locale) ?? ""),
    image: card?.image ? cardImageSrc(module.slug, card.id, true) : null,
    cards: set.cards.length,
    bonus: bonus ? plainHeroText(inLingua(bonus, locale) ?? "") || null : null,
    href: `/${module.slug}/set-artefatto/${set.number}`,
  };
}

/**
 * Le fasi con le note dell'autore. Le etichette vengono dai dati di oggi: se una
 * patch cambia il numero di fasi, le note restano, con «Fase N» dove il modello
 * non ne ha piu'.
 */
export function phasesView(
  module: GameModule,
  selection: StrategySelection,
  notes: readonly string[],
  locale: Locale,
): PhaseView[] {
  const target = findTarget(module, selection.mode, selection.target);
  const level = target ? findLevel(target, selection) : null;
  const count = Math.max(notes.length, level?.phases.length ?? 0);
  return Array.from({ length: count }, (_, i) => {
    const phase = level?.phases[i];
    return {
      label: phase ? (inLingua(phase.label, locale) ?? "") : locale === "en" ? `Phase ${i + 1}` : `Fase ${i + 1}`,
      detail: phase?.detail ? inLingua(phase.detail, locale) : null,
      note: notes[i] ?? "",
    };
  });
}

/** Il titolo da mostrare: quello dell'autore, o quello automatico nella lingua di chi legge. */
export function strategyTitle(
  module: GameModule,
  strategy: StrategySelection & { readonly title: string; readonly autoTitle: boolean },
  locale: Locale,
): string {
  return strategy.autoTitle ? autoTitle(module, strategy, locale) : strategy.title;
}

export { selectionLabel };
