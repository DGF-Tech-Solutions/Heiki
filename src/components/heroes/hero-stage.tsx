/**
 * Il palco di un eroe: apre la scheda, e la stessa forma sta nella home e nel menu del
 * gioco. Due strati:
 *   - la FIGURA: l'illustrazione scontornata del client, ingrandita col volto sempre alla
 *     stessa altezza, con una luce morbida alle spalle (pulito.css) che stacca dal nero le
 *     figure scure. La cima della sagoma (`HeroAssets.top`) e' il limite: ali, cappelli e
 *     corna restano dentro
 *   - la TARGA: epiteto, nome, attributo e rarita', i comandi
 *
 * Fino al 06/11 c'erano anche il retino, il nome a contorno e la fascia obliqua col cut-in:
 * lo stile del sito li ha tolti, e il cut-in non si scarica piu'.
 *
 * Il movimento e' uno solo, ed e' il momento della scelta: cambiando eroe la figura entra e
 * la targa scatta al suo posto (classi `stage-*` in globals.css; con «riduci movimento»
 * resta una dissolvenza). Il contenuto e' sempre visibile senza animazione: se lo script
 * non parte, il palco c'e' lo stesso.
 *
 * Senza stato e senza "use client": si usa anche dal server.
 */

import Image from "next/image";
import type { ReactNode } from "react";
import { cx } from "@/components/ui";
import { heroEpithet, heroName, heroSplashSrc } from "@/lib/games/heroes";
import type { HeroAffinity, HeroEntry } from "@/lib/games/types";
import type { Locale } from "@/lib/i18n/locale";

/**
 * Le immagini di un eroe per il palco: l'illustrazione c'e' o no, dove stanno il
 * suo volto e la cima della sagoma. Lo dice `HeroAssets` (`splash`, `face`, `top`).
 */
export interface StageArt {
  readonly art: "cutout" | "none";
  /** nell'illustrazione, in centesimi del lato: [x del volto, y del volto, cima della sagoma] */
  readonly figure: readonly [number, number, number];
}

/** un'illustrazione tipo: il volto al centro nel quarto alto, la sagoma che parte poco sotto il bordo */
export const DEFAULT_FIGURE: readonly [number, number, number] = [50, 25, 10];

export const DEFAULT_STAGE_ART: StageArt = { art: "cutout", figure: DEFAULT_FIGURE };

export function stageArtOf(
  assets:
    | {
        readonly splash?: boolean;
        readonly face?: readonly [number, number];
        readonly top?: number;
      }
    | undefined,
): StageArt {
  const [x, y] = assets?.face ?? DEFAULT_FIGURE;
  return {
    art: assets?.splash ? "cutout" : "none",
    figure: [x, y, Math.min(assets?.top ?? DEFAULT_FIGURE[2], y)],
  };
}

/** la figura: fino a ~800 px nel palco, a densita' 1 la misura da 1080; l'originale e' 1024 */
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
  tint: tintOverride,
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
   * La targa con altro che l'eroe: nella home il titolo della pagina sopra l'ultimo
   * eroe uscito.
   */
  plate?: { readonly kicker: string; readonly title: string };
  art?: StageArt;
  /** il colore del palco, se non e' quello dell'attributo (il profilo: il suo accento) */
  tint?: string;
}) {
  const name = plate?.title ?? heroName(hero, locale);
  const epithet = plate?.kicker ?? heroEpithet(hero, locale);
  const tint = tintOverride ?? affinity?.color ?? "var(--color-brand)";
  const Heading = headingLevel;
  const splash = heroSplashSrc(game, hero.id);
  const [faceX, faceY, top] = art.figure;
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
          // il primo piano dalla parte opposta al volto della figura
          "--echo-side": faceX >= 50 ? -1 : 1,
          // la figura si mette col volto a un'altezza fissa del palco (.stage-figure)
          "--face-y": faceY / 100,
          "--crown": top / 100,
          "--name-chars": nameChars,
        } as React.CSSProperties
      }
    >
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
