"use client";

/**
 * I pulsanti dei filtri delle griglie: una fila con la sua etichetta, e il
 * pulsante con l'icona del gioco o la scritta, e il conteggio.
 *
 * Nati nella griglia degli eroi (roster-browser.tsx) e spostati qui il 26/09,
 * quando le griglie delle Carte e dei Set artefatto ne hanno avuto bisogno: tre
 * copie dello stesso pulsante avrebbero preso tre strade diverse al primo
 * ritocco.
 */

import { chipColors, cx, eyebrow, numeric } from "@/components/ui";
import type { HeroAffinity } from "@/lib/games/types";

/* --------------------------------------------------------------- filtri -- */

export function FilterRow({
  label,
  children,
  labelClassName = "w-[74px]",
}: {
  label: string;
  children: React.ReactNode;
  /** la larghezza della colonna delle etichette: le file di una griglia la condividono */
  labelClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className={cx(eyebrow, "shrink-0", labelClassName)}>{label}</span>
      {children}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  label,
  count,
  swatch,
  iconSrc,
  withLabel,
  quiet,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  /** quadrato del colore dell'attributo: il ripiego dove il gioco non da' l'icona */
  swatch?: HeroAffinity;
  /**
   * L'icona del gioco. Quando c'e' prende il posto della scritta, non le si
   * affianca: sono le stesse icone che il gioco mette sui propri filtri, e una
   * fila di pulsanti si scorre a colpo d'occhio.
   *
   * La parola non sparisce davvero: resta nell'`alt`, nel `title` e
   * nell'`aria-label` del pulsante, quindi il filtro si legge col mouse fermo
   * e funziona con un lettore di schermo.
   */
  iconSrc?: string;
  /**
   * L'icona E la scritta. Per i filtri dei Set artefatto: le icone dei contenuti
   * sono quelle delle condizioni delle passive, che da sole non si riconoscono
   * come le razze o le rarita'.
   */
  withLabel?: boolean;
  /**
   * Scelto, ma senza il rosso: per le scelte che hanno sempre un valore (l'ordine
   * della griglia). Il rosso dice «hai ristretto l'elenco», e un ordine non lo
   * restringe (10/10: i «Tutte» rossi erano la cosa piu' accesa della pagina).
   */
  quiet?: boolean;
}) {
  const empty = count === 0;
  const iconOnly = iconSrc !== undefined && !withLabel;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={empty}
      aria-pressed={active}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      className={cx(
        // h-9 e non h-7: i pulsanti dei filtri portano le icone del gioco, e a
        // 22px in un pulsante da 28 non respiravano. L'altezza e' la stessa per
        // tutti - anche per "Tutte" e per la riga Ordina, che di icona non ne
        // hanno - perche' pulsanti di altezze diverse nella stessa fila si
        // leggono come due gruppi diversi.
        // Persona: lama nera obliqua, rossa col testo bianco quando e' scelta
        // (col rosso #e61421 il bianco fa 4.7:1), bianca al passaggio: la lama
        // che spazza e l'affondo alla pressione li fa `p5-btn` (globals.css).
        "p5-cut-sm p5-btn group inline-flex h-9 cursor-pointer items-center gap-1.5 border-0 px-3 max-sm:h-10",
        "text-[12px] uppercase tracking-[0.04em] disabled:cursor-not-allowed disabled:opacity-35",
        chipColors(active, quiet),
      )}
    >
      {iconOnly ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={iconSrc} alt={label} width={22} height={22} className="block h-[22px] w-auto" />
      ) : iconSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} alt="" width={20} height={20} className="block h-5 w-auto" />
          {label}
        </>
      ) : (
        <>
          {swatch ? (
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0"
              style={{
                background: swatch.colorAlt
                  ? `linear-gradient(135deg, ${swatch.color} 50%, ${swatch.colorAlt} 50%)`
                  : swatch.color,
              }}
            />
          ) : null}
          {label}
        </>
      )}

      {count === undefined ? null : (
        <span
          className={cx(
            numeric,
            "text-[12px]",
            active && quiet ? "text-paper" : active ? "text-white" : "text-ink-3 group-enabled:group-hover:text-paper",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
