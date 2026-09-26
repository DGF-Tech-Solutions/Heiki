/**
 * I pezzi che servono a piu' schede della pagina di un eroe: il testo nella
 * lingua della pagina e le icone del gioco.
 *
 * Stavano in fondo alla pagina della scheda, che fino al 26/09 era un file solo
 * di 2.330 righe. Divisa per schede (Abilita', Reliquia, Info...), quello che
 * serve a tutte sta qui.
 */

import { cx } from "@/components/ui";
import { gameIconSrc, type IconFamily } from "@/lib/games/heroes";
import type { HeroLabel } from "@/lib/games/types";
import { inLingua, type Locale } from "@/lib/i18n/locale";

/**
 * Un testo del dataset nella lingua della pagina.
 *
 * `label` e' la coppia italiano-inglese, `current` il valore di sempre - che
 * e' l'italiano col ripiego sull'inglese, scelto dall'importazione. Senza la
 * coppia (un dataset importato senza la fonte italiana) resta `current`.
 */
export function localized(
  label: HeroLabel | undefined,
  current: string | undefined,
  locale: Locale,
): string | undefined {
  return (label ? inLingua(label, locale) : null) ?? current;
}

/**
 * Il testo di un rango, di una passiva o di un'abilita' speciale nella lingua
 * della pagina. `text` e' l'inglese di 7dshub e c'e' sempre; `textIt` l'italiano,
 * che manca solo dove la fonte italiana ha un segnaposto.
 */
export function textIn(item: { text: string; textIt?: string }, locale: Locale): string {
  return locale === "it" ? (item.textIt ?? item.text) : item.text;
}

/**
 * Un'icona del gioco, se e' stata estratta.
 *
 * `icons` e' l'elenco di quelle disponibili, e senza questo controllo chi clona
 * il repo senza lanciare `npm run eroi:import` vedrebbe un riquadro rotto su
 * ogni scheda: le immagini sono asset di Netmarble e non sono versionate.
 *
 * L'`alt` porta il nome e non e' decorativo: qui l'icona SOSTITUISCE una
 * parola, quindi senza di esso l'informazione sparirebbe per chi usa un lettore
 * di schermo. Dove invece l'icona accompagna un testo gia' scritto - la razza -
 * il chiamante passa la stessa parola e il `title` la ripete al passaggio del
 * mouse.
 */
export function hasIcon(
  icons: Readonly<Record<string, readonly string[]>> | undefined,
  family: IconFamily,
  key: string,
): boolean {
  return icons?.[family]?.includes(key) ?? false;
}

export function GameIcon({
  game,
  family,
  iconKey,
  label,
  size,
  className,
}: {
  game: string;
  family: IconFamily;
  iconKey: string;
  label: string;
  size: number;
  className?: string;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={gameIconSrc(game, family, iconKey)}
      alt={label}
      title={label}
      width={size}
      height={size}
      className={cx("inline-block", className)}
      style={{ width: size, height: "auto" }}
    />
  );
}
