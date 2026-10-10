/**
 * Il palco di una pagina Endgame: l'illustrazione grande su una lama rossa
 * obliqua, il nome enorme con l'ombra rossa, sotto le targhette.
 *
 * E' la forma della testa della scheda eroe (hero-stage.tsx, 10/10) portata ai
 * boss: le illustrazioni sono il pezzo forte di queste pagine, e in un
 * quadrato da 220px accanto al titolo si perdevano. Ferma, a differenza del
 * palco degli eroi: li' il movimento dice «hai scelto un altro eroe», qui non si
 * sceglie niente, e un'entrata a ogni caricamento sarebbe solo decorazione.
 * Per questo delle classi del palco eroi (globals.css) usa solo quelle statiche
 * (`stage-dots`, `stage-word`, `stage-epithet`), non `stage-figure` e
 * `stage-plate`, che entrano animate.
 *
 * Tre modi per i tre tipi di immagine che il client ha, senza maschere inventate:
 *  - `cutout`: un disegno scontornato (i cut-in dei boss, i ritratti delle
 *    bestie), che esce dalla lama con la sagoma nera sfalsata dei cut-in di Persona;
 *  - `card`: la scheda color seppia con la sua cornice (il Re Demone), che ha un
 *    fondo suo e non si puo' scontornare: una carta inclinata sulla lama;
 *  - `backdrop`: un fondale (la copertina della Divinita' Suprema), a tutto
 *    palco e scurito dalla parte del nome.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { cx, display } from "@/components/ui";

export interface StageNeighbour {
  readonly href: string;
  /** cosa dice il pulsante a chi non lo vede: «Boss precedente: Demone grigio» */
  readonly label: string;
}

// La lama: piu' larga sul telefono, dove la figura sta in alto a destra e il
// nome in basso; sullo schermo largo e' la stessa inclinazione del palco eroi.
const BLADE = "[clip-path:polygon(58%_0,100%_0,100%_100%,30%_100%)] sm:[clip-path:polygon(66%_0,100%_0,100%_100%,50%_100%)]";
const THIN_BLADE = "[clip-path:polygon(52%_0,54%_0,26%_100%,24%_100%)] sm:[clip-path:polygon(61%_0,62.2%_0,46.2%_100%,45%_100%)]";

// Il nome resta leggibile sopra qualunque figura: sul telefono una base scura
// dal basso, sullo schermo largo un'ombra dall'angolo del nome.
const SHADE =
  "bg-[linear-gradient(to_top,var(--color-paper)_12%,color-mix(in_srgb,var(--color-paper)_72%,transparent)_52%,transparent)] inset-x-0 bottom-0 h-[64%] " +
  "sm:right-auto sm:h-[78%] sm:w-[66%] sm:bg-[radial-gradient(ellipse_at_0%_100%,var(--color-paper)_0%,color-mix(in_srgb,var(--color-paper)_72%,transparent)_46%,transparent_72%)]";

export function EndgameStage({
  title,
  image,
  mode,
  word,
  subtitle,
  children,
  prev,
  next,
  navLabel,
}: {
  title: string;
  /** l'immagine col suo percorso; senza, resta il palco col nome */
  image: { readonly src: string; readonly width: number; readonly height: number } | null;
  mode: "cutout" | "card" | "backdrop";
  /** il nome enorme a contorno dietro la figura; di solito il titolo */
  word?: string;
  /** una riga sotto il titolo, su una lama bianca: il nome della modalita' nel gioco */
  subtitle?: ReactNode;
  /** le targhette sotto il titolo */
  children?: ReactNode;
  /** il boss prima e dopo, per scorrere senza tornare all'indice */
  prev?: StageNeighbour | null;
  next?: StageNeighbour | null;
  navLabel?: string;
}) {
  return (
    <header className="p5-corner relative isolate mb-6 flex min-h-[360px] items-end overflow-hidden border border-rule bg-paper-2 sm:min-h-[400px]">
      {mode === "backdrop" && image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_38%]"
        />
      ) : (
        <div aria-hidden className="stage-dots absolute inset-0 -z-20" />
      )}
      <div
        aria-hidden
        className={cx("absolute inset-0 -z-10 bg-brand", BLADE, mode === "backdrop" && "opacity-90 mix-blend-multiply")}
      />
      <div aria-hidden className={cx("absolute inset-0 -z-10 bg-ink opacity-85", THIN_BLADE)} />
      {word && mode !== "backdrop" ? (
        <p aria-hidden className="stage-word absolute -z-10 m-0">
          {word}
        </p>
      ) : null}

      {mode === "cutout" && image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          fetchPriority="high"
          className={cx(
            "absolute z-0 h-auto object-contain [filter:drop-shadow(10px_8px_0_#000)]",
            image.width >= 512
              ? cx(
                  "right-[-10%] top-[-2%] w-[min(92%,340px)]",
                  // a filo del bordo destro: i cut-in finiscono netti a destra, e uno
                  // spazio di lama dopo l'immagine mostrava lo spigolo del disegno
                  "sm:right-0 sm:top-auto sm:bottom-0 sm:h-[min(100%,440px)] sm:w-auto sm:max-w-[60%]",
                )
              : // i ritratti piccoli (256px) restano interi e quasi alla loro
                // misura: allargati a tutto palco si sgranavano
                "right-[2%] top-[3%] w-[min(66%,256px)] sm:top-1/2 sm:right-[7%] sm:w-[min(34%,320px)] sm:-translate-y-1/2",
          )}
        />
      ) : null}

      {mode === "card" && image ? (
        <span className="absolute right-[7%] top-[9%] z-0 w-[46%] max-w-[300px] rotate-[3deg] sm:top-1/2 sm:w-[32%] sm:-translate-y-1/2">
          <span aria-hidden className="p5-corner absolute inset-0 translate-x-2.5 translate-y-2.5 bg-paper" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            fetchPriority="high"
            className="p5-corner relative block h-auto w-full"
          />
        </span>
      ) : null}

      <div aria-hidden className={cx("absolute z-[1]", SHADE, mode === "backdrop" && "sm:w-[78%]")} />

      <div className="relative z-[2] w-full p-5 pt-28 sm:max-w-[60%] sm:p-8">
        <h1 className={cx(display, "m-0 text-[clamp(38px,6.4vw,76px)] [text-wrap:balance]")}>{title}</h1>
        {subtitle ? <p className="stage-epithet m-0 mt-3 w-fit">{subtitle}</p> : null}
        {children ? <div className="mt-4 flex flex-wrap items-center gap-1.5">{children}</div> : null}
      </div>

      {prev || next ? (
        <nav aria-label={navLabel} className="absolute right-4 top-4 z-[3] flex gap-1.5 sm:right-6 sm:top-6">
          <NeighbourLink neighbour={prev ?? null} icon={<IconChevronLeft size={18} />} />
          <NeighbourLink neighbour={next ?? null} icon={<IconChevronRight size={18} />} />
        </nav>
      ) : null}
    </header>
  );
}

function NeighbourLink({ neighbour, icon }: { neighbour: StageNeighbour | null; icon: ReactNode }) {
  if (!neighbour) return null;
  return (
    <Link
      href={neighbour.href}
      aria-label={neighbour.label}
      title={neighbour.label}
      className="p5-cut p5-btn inline-flex h-10 w-12 items-center justify-center [--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink)]"
    >
      {icon}
    </Link>
  );
}

/** Una targhetta del palco: icona e parola su una lama nera, come gli attributi della scheda eroe. */
export function StageBadge({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={cx(
        "p5-cut-sm inline-flex h-8 items-center gap-1.5 bg-paper px-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-ink",
        title && "cursor-help",
      )}
    >
      {children}
    </span>
  );
}
