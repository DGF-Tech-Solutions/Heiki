/**
 * Il palco di un eroe: la «selezione del personaggio» chiesta dall'utente il
 * 10/10 (griglia + eroe in grande a lato, come un picchiaduro), e la stessa forma
 * apre la scheda dell'eroe.
 *
 * Tre strati, dal fondo:
 *   - la FASCIA: una lama rossa obliqua che attraversa il palco col primo piano
 *     dell'eroe a due toni, rosso e nero, come gli «All-Out Attack» di Persona
 *     (il mondo scelto il 27/09). Il primo piano e' l'illustrazione stessa,
 *     molto ingrandita e centrata sul volto, che l'importazione trova in ogni
 *     illustrazione (`HeroAssets.face`)
 *   - la FIGURA: l'illustrazione scontornata del client, intera, con la sagoma
 *     nera sfalsata
 *   - la TARGA: epiteto su una lama bianca, nome con l'ombra rossa, attributo e
 *     rarita', i comandi
 *
 * Ogni eroe ha la sua illustrazione e solo quella (l'utente, 10/10: niente
 * cut-in). Fascia e figura chiedono la stessa immagine alla stessa misura: il
 * browser la scarica una volta.
 *
 * Il movimento e' uno solo, ed e' il momento della scelta: cambiando eroe la
 * figura entra con un taglio diagonale e la targa scatta al suo posto (classi
 * `stage-*` in globals.css; con «riduci movimento» resta una dissolvenza). Il
 * contenuto e' sempre visibile senza animazione: se lo script non parte, il
 * palco c'e' lo stesso.
 *
 * Senza stato e senza "use client": la griglia lo usa nel browser, la scheda sul
 * server.
 */

import Image from "next/image";
import type { ReactNode } from "react";
import { cx } from "@/components/ui";
import { heroEpithet, heroName, heroSplashSrc } from "@/lib/games/heroes";
import type { HeroAffinity, HeroEntry } from "@/lib/games/types";
import type { Locale } from "@/lib/i18n/locale";

/**
 * L'illustrazione di un eroe per il palco: c'e' o no, e dove sta il volto. Lo
 * dice `HeroAssets` (`splash`, `face`).
 */
export interface StageArt {
  readonly art: "cutout" | "none";
  /** il volto nell'illustrazione, in centesimi del lato: [x, y] */
  readonly face: readonly [number, number];
}

/** dove sta il volto in un'illustrazione tipo: al centro, nel quarto alto */
export const DEFAULT_FACE: readonly [number, number] = [50, 25];

export const DEFAULT_STAGE_ART: StageArt = { art: "cutout", face: DEFAULT_FACE };

export function stageArtOf(
  assets: { readonly splash?: boolean; readonly face?: readonly [number, number] } | undefined,
): StageArt {
  return {
    art: assets?.splash ? "cutout" : "none",
    face: assets?.face ?? DEFAULT_FACE,
  };
}

/**
 * Una misura sola per la fascia e per la figura, cosi' il browser sceglie lo
 * stesso file per entrambe: 1080 px a densita' 1, l'originale da 1024 sopra. Il
 * primo piano ingrandito non chiede di piu': il retino e il due toni coprono la
 * grana.
 */
const ART_SIZES = "1080px";

export interface StageBadge {
  readonly label: string;
  readonly iconSrc?: string;
  /** il colore del gioco, per l'attributo */
  readonly color?: string;
}

export function HeroStage({
  game,
  hero,
  locale,
  affinity,
  badges,
  children,
  size = "panel",
  priority = false,
  className,
  headingLevel = "p",
  plate,
  art = DEFAULT_STAGE_ART,
}: {
  game: string;
  hero: HeroEntry;
  locale: Locale;
  affinity?: HeroAffinity;
  /** attributo, rarita', razza: icona e parola, una riga */
  badges?: readonly StageBadge[];
  /** sotto la targa: i comandi (Apri la scheda) */
  children?: ReactNode;
  /** `panel` a lato della griglia, `hero` in testa alla scheda */
  size?: "panel" | "hero";
  priority?: boolean;
  className?: string;
  /** nella scheda il nome e' il titolo della pagina */
  headingLevel?: "p" | "h1" | "h2";
  /**
   * La targa con altro che l'eroe: nella home il nome del gioco sopra l'ultimo
   * eroe uscito. Il nome grande sul fondo segue la targa.
   */
  plate?: { readonly kicker: string; readonly title: string };
  art?: StageArt;
}) {
  const name = plate?.title ?? heroName(hero, locale);
  const epithet = plate?.kicker ?? heroEpithet(hero, locale);
  const tint = affinity?.color ?? "var(--color-brand)";
  const Heading = headingLevel;
  const splash = heroSplashSrc(game, hero.id);
  const [faceX, faceY] = art.face;
  // la parola piu' lunga decide quanto puo' essere grande il nome (.stage-name)
  const nameChars = Math.max(...name.split(/\s+/).map((word) => [...word].length));

  return (
    <div
      className={cx(
        "stage relative isolate overflow-hidden bg-paper-2",
        size === "hero" ? "stage--hero" : "stage--panel",
        className,
      )}
      style={
        {
          "--stage-tint": tint,
          "--fx": faceX / 100,
          "--fy": faceY / 100,
          // il primo piano dalla parte opposta al volto della figura
          "--echo-side": faceX >= 50 ? -1 : 1,
          "--name-chars": nameChars,
        } as React.CSSProperties
      }
    >
      <div aria-hidden className="stage-dots absolute inset-0 -z-10" />

      {/*
        Il nome del personaggio enorme, solo contorno, sotto la fascia: e' la
        grafica delle schermate di scelta, e dice chi e' anche a chi guarda di
        sfuggita. Decorativo per i lettori di schermo: il nome vero sta nella targa.
      */}
      <p aria-hidden className="stage-word absolute -z-10 m-0">
        {name}
      </p>

      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="stage-band-edge absolute inset-0" />
        <div className="stage-band absolute inset-0">
          {art.art === "none" ? null : (
            <div className="stage-band-art">
              <Image src={splash} alt="" fill sizes={ART_SIZES} priority={priority} className="stage-band-img object-cover" />
            </div>
          )}
        </div>
        <div className="stage-band-line absolute inset-0" />
      </div>

      {/* la figura: si rimonta a ogni eroe (key), e l'animazione riparte */}
      {art.art === "cutout" ? (
        <div key={hero.id} className="stage-figure absolute">
          <Image src={splash} alt="" fill sizes={ART_SIZES} priority={priority} className="stage-figure-img object-contain" />
        </div>
      ) : null}

      <div key={`${hero.id}-targa`} className="stage-plate absolute">
        <p className="stage-epithet m-0">{epithet}</p>
        <Heading className="stage-name m-0">{name}</Heading>
        {badges && badges.length > 0 ? (
          <ul className="stage-badges m-0 flex list-none flex-wrap gap-1.5 p-0">
            {badges.map((badge) => (
              <li key={badge.label} className="p5-cut-sm inline-flex h-7 items-center gap-1.5 bg-paper px-2.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-ink">
                {badge.iconSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={badge.iconSrc} alt="" width={20} height={20} className="h-5 w-auto" />
                ) : null}
                <span style={badge.color ? { color: badge.color } : undefined}>{badge.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {children ? <div className="stage-actions">{children}</div> : null}
      </div>
    </div>
  );
}
