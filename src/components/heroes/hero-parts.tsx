/**
 * I pezzi che servono a piu' schede della pagina di un eroe: il testo nella
 * lingua della pagina e le icone del gioco.
 *
 * Stavano in fondo alla pagina della scheda, che fino al 26/09 era un file solo
 * di 2.330 righe. Divisa per schede (Abilita', Reliquia, Info...), quello che
 * serve a tutte sta qui.
 */

import type { ReactNode } from "react";
import { cx, display } from "@/components/ui";
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
 * della pagina. `text` e' l'inglese del client e c'e' sempre; `textIt` l'italiano,
 * che manca solo dove il client non ha il testo italiano.
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

/**
 * Il titolo di un blocco delle schede: «Unica», «Carta A», «Reliquia sacra»,
 * «Corpo». Lo stesso carattere dei titoli del sito, piccolo.
 *
 * Fino al 10/10 questi nomi erano etichette grigie appese SOPRA i riquadri:
 * sei etichette uguali in colonna che l'occhio incontrava prima dei riquadri,
 * e nessuna gerarchia fra il nome del blocco («Carta A») e quello della cosa
 * («Mano oscura»). Ora il nome del blocco e' il titolo (h3, sotto l'h2 della
 * scheda che mette `HeroTabs`) e la cosa ne e' il contenuto.
 */
// senza margini: i titoli non ne hanno (preflight), e chi lo usa aggiunge i
// suoi senza scontrarsi con un m-0 qui dentro
export const boxTitle = cx(display, "text-[20px]");

/**
 * Il riquadro di un blocco, col titolo dentro in testa.
 *
 * `gold` per l'Unica: e' la passiva dell'eroe, e l'oro la distingue dalle
 * carte (prima un filo oro a sinistra, poi il bordo). Senza `group` fra le
 * classi, e deve restare cosi': i ranghi delle carte guardano il primo antenato
 * con `group` (RANK_CLASSES in hero-abilities.tsx), e un riquadro che lo avesse
 * legherebbe fra loro le carte sbagliate.
 */
export function HeroBox({
  title,
  aside,
  tone = "rule",
  children,
  className,
}: {
  title: ReactNode;
  /** a destra del titolo, piccolo: un conteggio, una nota */
  aside?: ReactNode;
  tone?: "rule" | "gold";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "p5-corner border bg-paper-2 px-4 pt-3.5 pb-4",
        tone === "gold" ? "border-gold/45" : "border-rule",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 pr-3">
        <h3 className={boxTitle}>{title}</h3>
        {aside ? <span className="text-[13px] text-ink-3">{aside}</span> : null}
      </div>
      {children}
    </section>
  );
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
