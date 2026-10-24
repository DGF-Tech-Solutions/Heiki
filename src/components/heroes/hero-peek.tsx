/**
 * L'anteprima accanto alla griglia Eroi: l'eroe sotto il mouse, o col fuoco
 * della tastiera, in grande e con la sua descrizione.
 *
 * Dal 24/10, sul modello del passaggio del mouse della pagina dei personaggi e
 * delle armi di Duet Night Abyss (richiesta dell'utente: la griglia a card resta
 * com'e', cambia solo questa parte). Prima qui c'era il palco (hero-stage.tsx),
 * che resta dov'era: scheda, home, menu del gioco, compleanni, profilo.
 *
 * Da DNA:
 *   - una cornice sola, una lama obliqua, e la figura davanti che ne esce ai lati
 *     e in cima: la cornice e' un fondale, non una finestra che ritaglia
 *   - la figura intera e sempre allo stesso posto. Si inquadra la sagoma
 *     (`HeroAssets.box`), non il file: nei 1024x1024 del gioco la sagoma e' larga
 *     dal 28 al 99% e alta dal 40 al 100%, e inquadrando il file ogni eroe finiva
 *     in un posto diverso. Ingrandita attorno al volto, come nel palco, perdeva
 *     gambe e fianchi. Qui sta intera fra nome e descrizione, centrata, coi
 *     piedi sulla stessa linea, e mai piu' grande di come ci starebbe Shinra
 *     (la «scala di Shinra», scelta dall'utente: globals.css, .peek-figure)
 *   - in alto chi e' (epiteto, nome, attributo/rarita'/razza), in basso una breve
 *     descrizione in corsivo e il comando
 *   - un movimento solo, al cambio d'eroe: la figura entra, poi arrivano il nome
 *     e la descrizione
 * Dal mondo Persona (27/09, confermato dall'utente il 24/10): la lama e' rossa
 * col primo piano a due toni del cut-in, col bordo chiaro sfalsato; la figura ha
 * la sagoma nera dietro, e la linea di terra e' il filo dell'attributo.
 *
 * Senza stato: la griglia la ridisegna a ogni eroe, e le chiavi fanno ripartire
 * l'ingresso. Tutto e' visibile anche senza animazione.
 */

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { StageArt, StageBadge } from "@/components/heroes/hero-stage";
import { heroCutInSrc, heroEpithet, heroName, heroSplashSrc } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import type { Locale } from "@/lib/i18n/locale";

/** [sinistra, cima, destra, fondo] della sagoma, in centesimi del lato del file */
export type FigureBox = readonly [number, number, number, number];

/** senza misura si inquadra tutto il file: piu' piccola, ma intera */
export const WHOLE_FILE: FigureBox = [0, 0, 100, 100];

/**
 * La figura: il file e' largo fino a ~2,4 volte la sagoma, e una sagoma stretta
 * riempie l'altezza dell'anteprima (fino a ~600 px): il file arriva a ~1100 px.
 * L'originale e' 1024, e il servizio delle immagini non ingrandisce.
 */
const FIGURE_SIZES = "1080px";
/** il cut-in nella lama: largo poco piu' dell'anteprima. L'originale e' 512 */
const CUT_IN_SIZES = "520px";

export function HeroPeek({
  game,
  hero,
  locale,
  art,
  box = WHOLE_FILE,
  badges,
  tint,
  description,
  children,
  priority = false,
}: {
  game: string;
  hero: HeroEntry;
  locale: Locale;
  art: StageArt;
  box?: FigureBox;
  /** attributo, rarita', razza */
  badges?: readonly StageBadge[];
  /** il colore dell'attributo, per la linea di terra */
  tint?: string;
  /** la descrizione del gioco, senza markup */
  description?: string;
  /** il comando: Apri la scheda */
  children?: ReactNode;
  priority?: boolean;
}) {
  const name = heroName(hero, locale);
  const epithet = heroEpithet(hero, locale);
  const [left, top, right, bottom] = box;
  const [faceX] = art.figure;
  // la parola piu' lunga decide quanto puo' essere grande il nome (.stage-name)
  const nameChars = Math.max(...name.split(/\s+/).map((word) => [...word].length));

  return (
    <div
      className="peek"
      style={
        {
          ...(tint ? { "--peek-tint": tint } : {}),
          "--box-l": left / 100,
          "--box-t": top / 100,
          "--box-r": right / 100,
          "--box-b": bottom / 100,
          // dove il file taglia la sagoma (ali, mantelli, gambe fino al bordo): li' la figura sfuma
          "--cut-l": left <= 1 ? 1 : 0,
          "--cut-t": top <= 1 ? 1 : 0,
          "--cut-r": right >= 99 ? 1 : 0,
          "--cut-b": bottom >= 99 ? 1 : 0,
          // il primo piano nella lama dalla parte opposta al volto della figura
          "--echo-side": faceX >= (left + right) / 2 ? -1 : 1,
          "--name-chars": nameChars,
        } as CSSProperties
      }
    >
      <div aria-hidden className="peek-blade">
        <div className="peek-blade-edge" />
        <div className="peek-blade-face">
          {art.cutIn ? (
            // si rimonta a ogni eroe: senza, il cut-in di prima resta finche' il nuovo non arriva
            <div key={hero.id} className="peek-cutin">
              <Image
                src={heroCutInSrc(game, hero.id)}
                alt=""
                fill
                sizes={CUT_IN_SIZES}
                priority={priority}
                className="peek-cutin-img object-cover"
              />
            </div>
          ) : null}
        </div>
        <div className="peek-ground" />
      </div>

      <div key={`${hero.id}-chi`} className="peek-head">
        {/* epiteto e nome come nel palco (.stage-epithet, .stage-name): sono gli stessi in tutto il sito */}
        <p className="stage-epithet m-0">{epithet}</p>
        <p className="stage-name m-0">{name}</p>
        {badges && badges.length > 0 ? (
          <ul className="peek-badges">
            {badges.map((badge) => (
              <li key={badge.label} className="peek-badge p5-cut-sm">
                {badge.iconSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={badge.iconSrc} alt="" width={20} height={20} className="h-5 w-auto" />
                ) : null}
                {/* il colore dell'attributo schiarito col testo: puro, sul fondo della targhetta, Forza e Oscurita' non si leggevano (.peek-badge-tinted) */}
                <span
                  className={badge.color ? "peek-badge-tinted" : undefined}
                  style={badge.color ? ({ "--badge-color": badge.color } as CSSProperties) : undefined}
                >
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div aria-hidden className="peek-stage">
        {art.art === "cutout" ? (
          <div key={hero.id} className="peek-figure">
            <Image
              src={heroSplashSrc(game, hero.id)}
              alt=""
              fill
              sizes={FIGURE_SIZES}
              priority={priority}
              className="peek-figure-img object-contain"
            />
          </div>
        ) : null}
      </div>

      <div key={`${hero.id}-testo`} className="peek-foot">
        {description ? <p className="peek-desc">{description}</p> : null}
        {children ? <div className="peek-actions">{children}</div> : null}
      </div>
    </div>
  );
}
