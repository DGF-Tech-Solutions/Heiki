/**
 * Il riassunto della difficolta' scelta, in testa ai dettagli: chi si affronta,
 * cosa serve, cosa e' vietato.
 *
 * Fino all'11/10 le quattro pagine dell'Endgame davano la difficolta' scelta
 * solo come una riga accesa in una tabella di sette-otto colonne, che sul
 * telefono scorreva di lato: le restrizioni della squadra (gli attributi
 * ammessi, due icone senza nome) stavano nelle colonne fuori schermo, e gli eroi
 * esclusi sotto tutte le fasi. Qui le stesse cose, della sola difficolta'
 * scelta, in un riquadro che si legge prima di scendere nelle fasi. La tabella
 * resta, chiusa sotto il riassunto, per confrontare le difficolta'.
 *
 * Solo impaginazione: numeri e testi li passa la pagina, gli stessi di prima.
 */

import type { ReactNode } from "react";
import { readableColor } from "@/components/heroes/game-color";
import { cx, display, eyebrow, numeric } from "@/components/ui";
import { Facts } from "./endgame-parts";

type Row = readonly [string, ReactNode] | null | false;

export function BattleBrief({
  label,
  title,
  color,
  subtitle,
  image,
  stats,
  rows,
  children,
}: {
  /** il nome del riquadro per chi non vede: «La difficoltà scelta in breve» */
  label: string;
  /** il nome della difficolta' o del piano, come lo scrive il gioco */
  title: string;
  /** il colore del gioco per la difficolta' */
  color: string | null;
  subtitle?: ReactNode;
  /** la scheda color seppia del boss o del piano, a sinistra (non sul telefono, dove il palco ha gia' la figura) */
  image?: string | null;
  /** i numeri: livello, potenza, energia, fasi */
  stats: readonly Row[];
  /** le righe: squadra, esclusi, sblocco */
  rows?: readonly Row[];
  /** quello che non sta in una riga: gli eroi esclusi, le regole della difficolta' */
  children?: ReactNode;
}) {
  const shownStats = stats.filter((row): row is readonly [string, ReactNode] => !!row);
  const shownRows = (rows ?? []).filter((row): row is readonly [string, ReactNode] => !!row);
  return (
    <section aria-label={label} className="p5-corner mt-5 border border-rule border-t-[3px] border-t-brand bg-paper-2">
      <div className="flex gap-6 p-4 sm:p-5">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt=""
            width={168}
            height={168}
            loading="lazy"
            className="p5-corner hidden h-auto w-[136px] shrink-0 self-start bg-paper-3 sm:block"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex min-w-0 items-center gap-2.5">
              {color ? (
                <span
                  aria-hidden
                  className="p5-cut-sm inline-block h-4 w-5 shrink-0"
                  style={{ backgroundColor: readableColor(color) }}
                />
              ) : null}
              <span className={cx(display, "text-[clamp(22px,2.4vw,28px)]")}>{title}</span>
            </span>
            {subtitle ? <span className="text-[13px] font-normal text-ink-2">{subtitle}</span> : null}
          </h3>
          {/* sul telefono due per riga: in fila, la quarta restava sola sotto le altre */}
          {shownStats.length > 0 ? (
            <dl className="m-0 mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
              {shownStats.map(([name, value]) => (
                <div key={name} className="min-w-0">
                  <dt className={eyebrow}>{name}</dt>
                  <dd className={cx(numeric, "m-0 mt-0.5 text-[18px] leading-tight text-ink")}>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {shownRows.length > 0 ? (
            <div className="mt-4 border-t border-rule-2 pt-3">
              <Facts rows={shownRows} />
            </div>
          ) : null}
        </div>
      </div>
      {children ? <div className="grid gap-5 border-t border-rule-2 p-4 sm:p-5">{children}</div> : null}
    </section>
  );
}

/**
 * La tabella che mette a confronto le difficolta' sta chiusa sotto il riassunto:
 * i pulsanti scelgono, il riassunto dice quella scelta, e la tabella serve a chi
 * confronta. Sul telefono scorre di lato, e aperta di partenza spingeva il
 * riassunto mezzo schermo piu' giu'.
 *
 * Classi e non un componente che riceve la tabella come figlio: in sviluppo
 * React scrive nella pagina le props dei componenti server, e un componente
 * passato come figlio ci portava il sorgente intero della tabella (13 KB per
 * pagina, misurato l'11/10). Ogni pagina avvolge la sua tabella da se'.
 */
export const compareClass = {
  details: "mt-3 border-b border-rule-2",
  summary: "min-h-10 text-[13px] font-semibold text-ink-2",
  body: "overflow-x-auto pb-4",
} as const;

/** Un collegamento dentro una riga del riassunto, a una parte piu' giu' nella pagina. */
export function BriefLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-ink underline decoration-brand decoration-1 underline-offset-[3px] hover:text-brand-deep">
      {children}
    </a>
  );
}
