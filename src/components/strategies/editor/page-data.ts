/**
 * Quello che le due pagine del modulo (nuova, modifica) preparano sul server
 * oltre al modello delle strategie.
 *
 * Gli attributi stanno qui e non nel modello (`strategyTemplate`) perche' il
 * modello e' di un'altra parte del lavoro: servono al modulo per il filtro della
 * scelta e per dire, sotto la difficolta', quali attributi sono ammessi, con
 * l'icona del gioco e il nome nella lingua della pagina. Sono cinque righe.
 */

import { gameIconSrc } from "@/lib/games/heroes";
import { inLingua, type Locale } from "@/lib/i18n/locale";
import type { GameModule } from "@/lib/games/types";
import type { EditorAttribute } from "./editor-state";

/**
 * Gli attributi che hanno un'icona del gioco (1-5). L'attributo doppio di
 * Tristan non ha un'icona sua e non e' un filtro: `heroAttributes` gli da' Luce e
 * Oscurita', quindi compare filtrando per l'uno o per l'altra.
 */
export function strategyAttributes(module: GameModule, locale: Locale): EditorAttribute[] {
  const codes = module.heroContext?.codes.attribute ?? {};
  const icons = new Set(module.icons?.["attributo"] ?? []);
  const affinities = module.roster?.affinities ?? [];
  return affinities
    .filter((affinity) => affinity.iconKey)
    .map((affinity) => {
      const code = Number(affinity.iconKey);
      return {
        code,
        name: inLingua(codes[String(code)], locale) ?? affinity.label,
        icon: icons.has(String(code)) ? gameIconSrc(module.slug, "attributo", code) : null,
        color: affinity.color,
      };
    })
    .filter((attribute) => Number.isInteger(attribute.code))
    .sort((a, b) => a.code - b.code);
}
