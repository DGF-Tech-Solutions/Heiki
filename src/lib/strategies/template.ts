/**
 * Il modello del modulo di scrittura, nella lingua della pagina.
 *
 * Lo chiama la pagina (server) e lo passa al componente client: dentro ci sono
 * solo nomi, numeri e indirizzi, non gli indici dell'Endgame interi (le Bestie
 * da sole pesano 760 KB). Gli eroi sono quelli della griglia, nello stesso
 * ordine (uscita globale, dal piu' recente).
 */

import { endgameImageSrc } from "@/lib/games/endgame";
import { cardImageSrc, setCode } from "@/lib/games/artifacts";
import { plainHeroText } from "@/lib/games/hero-markup";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { inLingua, type Locale } from "@/lib/i18n/locale";
import type { GameModule } from "@/lib/games/types";
import { MODE_SLUGS, availableModes, heroAttributes, modeName, setModes, targetsFor } from "./rules";
import type { StrategyTemplate, TemplateHero, TemplateMode, TemplateSet } from "./types";

export function strategyTemplate(module: GameModule, locale: Locale): StrategyTemplate {
  const game = module.slug;
  const text = (label: { it: string | null; en: string | null } | null | undefined) =>
    plainHeroText(inLingua(label, locale) ?? "");

  const modes: TemplateMode[] = availableModes(module).map((mode) => ({
    mode,
    name: text(modeName(module, mode)),
    href: `/${game}/${MODE_SLUGS[mode]}`,
    targets: targetsFor(module, mode).map((target) => ({
      key: target.key,
      name: text(target.name),
      image: target.image ? endgameImageSrc(game, target.image) : null,
      levels: target.levels.map((level) => ({
        level: level.level,
        transcendent: level.transcendent,
        name: text(level.name),
        color: level.color,
        phases: level.phases.map((phase) => ({
          label: text(phase.label),
          detail: phase.detail ? text(phase.detail) || null : null,
        })),
        allowedAttributes: level.allowedAttributes,
        banned: level.banned,
      })),
    })),
  }));

  const affinities = module.roster?.affinities ?? [];
  const heroes: TemplateHero[] = (module.roster?.heroes ?? []).map((hero) => ({
    id: hero.id,
    name: heroName(hero, locale),
    epithet: heroEpithet(hero, locale),
    group: hero.group,
    attributes: heroAttributes(hero, affinities),
    color: affinities.find((affinity) => affinity.id === hero.affinity)?.color ?? null,
    rarity: hero.rarity,
    card: heroCardSrc(game, hero.id),
  }));

  const sets: TemplateSet[] = (module.artifacts?.sets ?? [])
    .map((set) => {
      const first = set.cards[0];
      const card = first ? module.artifacts?.cards.find((item) => item.id === first) : undefined;
      const bonus = set.levels[set.levels.length - 1];
      return {
        id: set.id,
        number: set.number,
        name: text(set.name),
        code: setCode(set),
        image: card?.image ? cardImageSrc(game, card.id, true) : null,
        cards: set.cards.length,
        bonus: bonus ? text(bonus) || null : null,
        modes: setModes(set),
      };
    })
    .filter((set) => set.modes.length > 0);

  return { game, modes, heroes, sets };
}
