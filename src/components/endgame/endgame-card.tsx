/**
 * La card di un boss o di una bestia negli indici del gruppo Endgame.
 *
 * Scelta dell'utente (26/09): Scontri finali e Bestie demoniache come la
 * griglia degli eroi, un pulsante per boss che porta alla sua pagina, invece di
 * tutti i boss in una pagina da scorrere. La stessa card, piu' piccola, sta in
 * fondo a ogni pagina di dettaglio per passare agli altri.
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
   * una riga sotto il nome nella card piccola (le stelle delle Battaglie boss).
   * Nella card grande non c'e' piu' (24/10): stava sull'immagine, «BATTAGLIE
   * BOSS ★» uguale su ogni boss; le stelle ora le scrive chi riempie la card
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
   * centrati: allargati per riempire si sgranavano.
   */
  fit?: "cover" | "contain";
}) {
  if (compact) {
    return (
      <Link href={href} aria-current={current ? "page" : undefined} className={cx("group block min-w-0", FOCUS)}>
        {/* la card in cui si e' e' il blocco bianco, come «dove sei» nel menu */}
        <span
          className={cx(
            "flex min-w-0 items-center gap-3 p-2 transition-colors",
            current ? "bg-select text-on-select" : "bg-piastra-fondo group-hover:bg-piastra",
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
          "flex h-full min-w-0 flex-col overflow-hidden transition-colors",
          current ? "bg-select text-on-select" : "bg-piastra-fondo group-hover:bg-piastra",
        )}
      >
        <span className="block aspect-[3/2] overflow-hidden">
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
                  : "object-contain object-center p-3",
              )}
            />
          ) : null}
        </span>
        <span className="block p-4">
          <span className="block font-display text-[20px] font-extrabold leading-[1.05]">
            {title}
          </span>
          {children ? <span className="mt-2 block text-[13px] leading-snug text-ink-2">{children}</span> : null}
        </span>
      </span>
    </Link>
  );
}
