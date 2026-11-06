/**
 * La testa di una pagina Endgame: il nome grande a sinistra, l'illustrazione a destra sul
 * nero, sotto le targhette. E' la forma della testa della scheda eroe portata ai boss: le
 * illustrazioni sono il pezzo forte di queste pagine.
 *
 * Tre modi per i tre tipi di immagine che il client ha, senza maschere inventate:
 *  - `cutout`: un disegno scontornato (i cut-in dei boss, i ritratti delle bestie). I cut-in
 *    il gioco li taglia di netto a destra e in basso: sul nero un taglio netto si leggerebbe
 *    come un errore, e li' sfumano. I ritratti sono interi, e restano interi;
 *  - `card`: la scheda color seppia con la sua cornice (il Re Demone), che ha un fondo suo e
 *    non si puo' scontornare: sta li' com'e';
 *  - `backdrop`: un fondale (la copertina della Divinita' Suprema), a tutto palco e scurito
 *    dalla parte del nome.
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

// Il nome resta leggibile sopra qualunque figura: sul telefono una base scura
// dal basso, sullo schermo largo un'ombra dall'angolo del nome.
const SHADE =
  "bg-[linear-gradient(to_top,var(--color-paper)_12%,color-mix(in_srgb,var(--color-paper)_72%,transparent)_52%,transparent)] inset-x-0 bottom-0 h-[64%] " +
  "sm:right-auto sm:h-[78%] sm:w-[66%] sm:bg-[radial-gradient(ellipse_at_0%_100%,var(--color-paper)_0%,color-mix(in_srgb,var(--color-paper)_72%,transparent)_46%,transparent_72%)]";

// la luce alle spalle: stacca dal nero le figure scure senza disegnare un contorno
const LUCE = "absolute inset-y-0 right-0 -z-10 w-[64%] bg-[radial-gradient(closest-side,var(--color-piastra),transparent)]";

export function EndgameStage({
  title,
  image,
  mode,
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
  /** una riga sotto il titolo: il nome della modalita' nel gioco */
  subtitle?: ReactNode;
  /** le targhette sotto il titolo */
  children?: ReactNode;
  /** il boss prima e dopo, per scorrere senza tornare all'indice */
  prev?: StageNeighbour | null;
  next?: StageNeighbour | null;
  navLabel?: string;
}) {
  const fondale = mode === "backdrop";
  return (
    <header className="relative isolate mb-6 flex min-h-[360px] items-end overflow-hidden sm:min-h-[400px]">
      {fondale && image ? (
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
        <div aria-hidden className={LUCE} />
      )}

      {mode === "cutout" && image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          fetchPriority="high"
          className={cx(
            "absolute z-0 h-auto object-contain",
            image.width >= 512
              ? cx(
                  "right-[-10%] top-[-2%] w-[min(92%,340px)]",
                  "sm:right-0 sm:top-auto sm:bottom-0 sm:h-[min(100%,440px)] sm:w-auto sm:max-w-[60%]",
                  "[mask-composite:intersect] [mask-image:linear-gradient(to_left,transparent,#000_16%),linear-gradient(to_top,transparent,#000_20%)]",
                )
              : // i ritratti piccoli (256px) restano interi e quasi alla loro
                // misura: allargati a tutto palco si sgranavano
                "right-[2%] top-[3%] w-[min(66%,256px)] sm:top-1/2 sm:right-[7%] sm:w-[min(34%,320px)] sm:-translate-y-1/2",
          )}
        />
      ) : null}

      {mode === "card" && image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          fetchPriority="high"
          className="absolute right-[4%] top-[9%] z-0 block h-auto w-[46%] max-w-[300px] sm:top-1/2 sm:w-[32%] sm:-translate-y-1/2"
        />
      ) : null}

      <div aria-hidden className={cx("absolute z-[1]", SHADE, fondale && "sm:w-[78%]")} />

      <div className={cx("relative z-[2] w-full pt-28 sm:max-w-[60%]", fondale ? "p-5 sm:p-8" : "pb-4")}>
        <h1 className={cx(display, "m-0 text-[clamp(38px,6.4vw,76px)] [text-wrap:balance]")}>{title}</h1>
        {subtitle ? <p className="stage-epithet m-0 mt-3 w-fit">{subtitle}</p> : null}
        {children ? <div className="mt-4 flex flex-wrap items-center gap-1.5">{children}</div> : null}
      </div>

      {prev || next ? (
        <nav
          aria-label={navLabel}
          className={cx("absolute z-[3] flex gap-1.5", fondale ? "right-4 top-4 sm:right-6 sm:top-6" : "right-0 top-0")}
        >
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

/** Una targhetta della testa: icona e parola, come gli attributi della scheda eroe. */
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
