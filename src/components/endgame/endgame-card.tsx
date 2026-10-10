/**
 * La card di un boss o di una bestia negli indici del gruppo Endgame.
 *
 * Scelta dell'utente (26/09): Scontri finali e Bestie demoniache come la
 * griglia degli eroi, un pulsante per boss che porta alla sua pagina, invece di
 * tutti i boss in una pagina da scorrere. La stessa card, piu' piccola, sta in
 * fondo a ogni pagina di dettaglio per passare agli altri.
 *
 * Il taglio d'angolo sta su un riquadro DENTRO il collegamento, non sul
 * collegamento: il clip-path taglierebbe anche il contorno del fuoco da
 * tastiera, che e' disegnato fuori dal riquadro.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/components/ui";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function EndgameCard({
  href,
  image,
  stamp,
  title,
  children,
  compact,
  current,
  fit = "cover",
}: {
  href: string;
  /** l'immagine, gia' col percorso; null se l'import non l'ha trovata */
  image: string | null;
  /**
   * la targhetta sull'immagine: «Battaglie boss» con le stelle del gioco.
   * Sull'immagine e non sopra il nome, che resta la prima cosa che si legge
   */
  stamp?: ReactNode;
  title: string;
  /** le righe sotto il nome */
  children?: ReactNode;
  /** la versione piccola, per «gli altri» in fondo a una pagina */
  compact?: boolean;
  /** la card della pagina in cui si e' */
  current?: boolean;
  /**
   * Come sta l'immagine nel riquadro, piu' largo che alto. I cut-in dei boss
   * (512px, il volto al centro) lo riempiono: si taglia un sesto sopra e sotto,
   * dove il volto non c'e'. I ritratti delle bestie (256px) restano interi e
   * centrati sulla lama: allargati per riempire si sgranavano.
   */
  fit?: "cover" | "contain";
}) {
  if (compact) {
    return (
      <Link href={href} aria-current={current ? "page" : undefined} className={cx("group block min-w-0", FOCUS)}>
        {/* la card in cui si e' si accende di bianco, come la scelta nelle lame del sito */}
        <span
          className={cx(
            "p5-corner flex min-w-0 items-center gap-3 border p-2 transition-colors",
            current ? "border-ink bg-ink text-paper" : "border-rule bg-paper group-hover:border-ink-3",
          )}
        >
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 shrink-0 bg-paper-2 object-cover"
            />
          ) : null}
          <span className="min-w-0">
            <span
              className={cx(
                "block text-[13px] font-semibold leading-tight",
                !current && "group-hover:text-brand-deep",
              )}
            >
              {title}
            </span>
            {stamp ? <span className="mt-1 block">{stamp}</span> : null}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={cx("group block h-full min-w-0", FOCUS)}>
      <span
        className={cx(
          "p5-corner flex h-full min-w-0 flex-col overflow-hidden border bg-paper transition-colors",
          current ? "border-ink" : "border-rule group-hover:border-ink-3",
        )}
      >
        {/* il fondo della selezione del personaggio: retino e lama rossa, fermi */}
        <span className="relative isolate block aspect-[3/2] overflow-hidden bg-paper-2">
          <span aria-hidden className="stage-dots absolute inset-0 -z-10" />
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-brand [clip-path:polygon(68%_0,100%_0,100%_100%,46%_100%)]"
          />
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              width={512}
              height={512}
              loading="lazy"
              className={cx(
                "h-full w-full transition-transform duration-300 group-hover:scale-[1.04]",
                fit === "cover"
                  ? "object-cover object-center"
                  : "object-contain object-center p-3 [filter:drop-shadow(8px_6px_0_#000)]",
              )}
            />
          ) : null}
          {stamp ? <span className="absolute left-3 top-3">{stamp}</span> : null}
        </span>
        <span className="block p-4">
          <span className="block font-display text-[20px] font-extrabold uppercase leading-[1.05] tracking-[0.01em] [font-variation-settings:'wdth'_85] group-hover:text-brand-deep">
            {title}
          </span>
          {children ? <span className="mt-2 block text-[13px] leading-snug text-ink-2">{children}</span> : null}
        </span>
      </span>
    </Link>
  );
}

/** La targhetta di una card: nera e tagliata, come le etichette del palco. */
export function CardStamp({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className="p5-cut-sm inline-flex h-7 items-center gap-1.5 bg-paper px-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink"
    >
      {children}
    </span>
  );
}
