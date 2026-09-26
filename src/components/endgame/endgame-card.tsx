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
import { cx, eyebrow } from "@/components/ui";

export function EndgameCard({
  href,
  image,
  kicker,
  title,
  children,
  compact,
  current,
  tile,
}: {
  href: string;
  /** l'immagine, gia' col percorso; null se l'import non l'ha trovata */
  image: string | null;
  /** la riga sopra il nome: «Battaglie boss 2☆» */
  kicker?: ReactNode;
  title: string;
  /** le righe sotto il nome */
  children?: ReactNode;
  /** la versione piccola, per «gli altri» in fondo a una pagina */
  compact?: boolean;
  /** la card della pagina in cui si e' */
  current?: boolean;
  /**
   * L'immagine grande sopra e il testo sotto, come una selezione del
   * personaggio: per i cut-in dei boss (scelta dell'utente, 26/09), disegni a
   * colori su fondo trasparente che in un quadratino da 104px si perdevano.
   * Il riquadro e' piu' largo che alto e l'immagine e' centrata: i cut-in sono
   * quadrati, e cosi' si taglia un sesto sopra e sotto, dove non c'e' il volto.
   */
  tile?: boolean;
}) {
  if (tile) {
    return (
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={cx(
          "group block min-w-0 overflow-hidden rounded-card border bg-paper transition-colors hover:border-ink-3",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          current ? "border-brand" : "border-rule",
        )}
      >
        <span className="block aspect-[3/2] overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-paper-3),var(--color-paper-2))]">
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              width={512}
              height={512}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : null}
        </span>
        <span className="block p-3">
          {kicker ? <span className={cx(eyebrow, "block")}>{kicker}</span> : null}
          <span className="mt-0.5 block text-[16px] font-semibold leading-tight group-hover:text-brand">{title}</span>
          {children ? <span className="mt-1.5 block text-[12px] leading-snug text-ink-2">{children}</span> : null}
        </span>
      </Link>
    );
  }

  const size = compact ? 48 : 104;
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cx(
        "group flex min-w-0 items-center gap-3 rounded-card border bg-paper transition-colors hover:border-ink-3",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        compact ? "p-2" : "p-3",
        current ? "border-brand bg-brand-soft" : "border-rule",
      )}
    >
      {image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          className="shrink-0 rounded-[3px] bg-paper-2 object-cover"
          style={{ width: size, height: size }}
        />
      ) : null}
      <span className="min-w-0">
        {kicker ? <span className={cx(eyebrow, "block", compact && "text-[10px]")}>{kicker}</span> : null}
        <span
          className={cx(
            "block font-semibold leading-tight group-hover:text-brand",
            compact ? "text-[13px]" : "mt-0.5 text-[16px]",
          )}
        >
          {title}
        </span>
        {children ? <span className="mt-1.5 block text-[12px] leading-snug text-ink-2">{children}</span> : null}
      </span>
    </Link>
  );
}
