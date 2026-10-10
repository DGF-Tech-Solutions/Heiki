/**
 * Il palco di un eroe: l'illustrazione grande su una lama obliqua, il nome in
 * targa, attributo e rarita'. E' la «selezione del personaggio» chiesta
 * dall'utente il 10/10 (griglia + eroe in grande a lato, come un picchiaduro), e
 * la stessa forma apre la scheda dell'eroe.
 *
 * Le illustrazioni del client sono gia' scontornate (1024 px, sfondo
 * trasparente): l'eroe esce dal pannello senza maschere inventate, e l'ombra
 * rossa piena dietro la sagoma e' quella dei cut-in di Persona (il mondo scelto,
 * 27/09), non una profondita'.
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

/** Da `HeroAssets` al tipo d'illustrazione del palco. */
export function artOf(assets: { readonly splash?: boolean; readonly splashFull?: boolean } | undefined): "cutout" | "full" | "none" {
  return assets?.splashFull ? "full" : assets?.splash ? "cutout" : "none";
}

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
  art = "cutout",
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
  /**
   * Che illustrazione c'e': scontornata (quasi tutte), con lo sfondo dipinto (9
   * su 372: va in una cornice obliqua, come una carta), o nessuna (il palco resta
   * col nome e le lame). Lo dice `HeroAssets` (`splash`, `splashFull`).
   */
  art?: "cutout" | "full" | "none";
}) {
  const name = plate?.title ?? heroName(hero, locale);
  const epithet = plate?.kicker ?? heroEpithet(hero, locale);
  const tint = affinity?.color ?? "var(--color-brand)";
  const Heading = headingLevel;

  return (
    <div
      className={cx("stage relative isolate overflow-hidden bg-paper-2", size === "hero" ? "stage--hero" : "stage--panel", className)}
      style={{ "--stage-tint": tint } as React.CSSProperties}
    >
      {/* il fondo: retino rosso, la lama dell'attributo, la lama rossa */}
      <div aria-hidden className="stage-dots absolute inset-0 -z-10" />
      <div aria-hidden className="stage-blade stage-blade--tint absolute -z-10" />
      <div aria-hidden className="stage-blade stage-blade--brand absolute -z-10" />

      {/*
        Il nome del personaggio enorme, a filo, dietro la figura: e' la grafica
        delle schermate di scelta, e dice chi e' anche a chi guarda di sfuggita.
        Decorativo per i lettori di schermo: il nome vero sta nella targa.
      */}
      <p aria-hidden className="stage-word absolute -z-10 m-0">
        {name}
      </p>

      {/* la figura: si rimonta a ogni eroe (key), e l'animazione riparte */}
      {art === "none" ? null : (
        <div key={hero.id} className={cx("stage-figure absolute", art === "full" && "stage-figure--full")}>
          {art === "full" ? (
            <div className="stage-frame">
              <div className="relative h-full w-full">
                <Image
                  src={heroSplashSrc(game, hero.id)}
                  alt=""
                  fill
                  sizes={size === "hero" ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 440px, 100vw"}
                  priority={priority}
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <Image
              src={heroSplashSrc(game, hero.id)}
              alt=""
              fill
              sizes={size === "hero" ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 440px, 100vw"}
              priority={priority}
              className="stage-figure-img object-contain"
            />
          )}
        </div>
      )}

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
