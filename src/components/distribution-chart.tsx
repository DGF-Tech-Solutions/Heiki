/**
 * L'elemento firma del sito.
 *
 * Su una piattaforma gacha la scelta ovvia sarebbe aprire con l'artwork dei
 * personaggi. Qui si apre con la distribuzione di una simulazione reale, per due
 * ragioni: e' cio' che il prodotto sa fare e nessun concorrente mette in prima
 * pagina, ed e' interamente materiale nostro - nessun asset di un publisher.
 *
 * Le barre dentro l'intervallo p10-p90 sono accese, quelle fuori spente: si
 * legge a colpo d'occhio dove cade il risultato nove volte su dieci. L'oro,
 * unico colore acceso del sistema, marca la mediana.
 */

import type { DistributionStats, Histogram } from "@/lib/engine";

interface Props {
  histogram: Histogram;
  stats: DistributionStats;
  title: string;
  caption: string;
  formatValue?: (value: number) => string;
}

const WIDTH = 420;
const HEIGHT = 150;
const PAD_BOTTOM = 18;

export function DistributionChart({ histogram, stats, title, caption, formatValue }: Props) {
  const format = formatValue ?? defaultFormat;
  const bins = histogram.bins;
  const peak = bins.reduce((max, value) => (value > max ? value : max), 0);
  const barWidth = bins.length > 0 ? WIDTH / bins.length : WIDTH;
  const plotHeight = HEIGHT - PAD_BOTTOM;
  const span = histogram.max - histogram.min;

  /** Posizione orizzontale di un valore sull'asse. */
  const xFor = (value: number) =>
    span > 0 ? ((value - histogram.min) / span) * WIDTH : WIDTH / 2;

  const medianX = xFor(stats.median);

  return (
    <figure className="plot" style={{ margin: 0 }}>
      <div className="plot__head">
        <span className="plot__title">{title}</span>
        <span className="eyebrow">{caption}</span>
      </div>

      <svg
        className="plot__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Distribuzione: mediana ${format(stats.median)}, intervallo da ${format(
          stats.p10,
        )} a ${format(stats.p90)}`}
      >
        {bins.map((count, index) => {
          const height = peak > 0 ? (count / peak) * plotHeight : 0;
          const center = histogram.min + (index + 0.5) * (histogram.binWidth || span || 1);
          const inner = center >= stats.p10 && center <= stats.p90;

          return (
            <rect
              key={index}
              className={inner ? "plot__bar plot__bar--inner" : "plot__bar"}
              x={index * barWidth}
              y={plotHeight - height}
              width={Math.max(barWidth - 1, 0.5)}
              height={height}
            />
          );
        })}

        <line className="plot__axis" x1={0} y1={plotHeight} x2={WIDTH} y2={plotHeight} />
        <line
          className="plot__median"
          x1={medianX}
          y1={0}
          x2={medianX}
          y2={plotHeight}
          strokeDasharray="3 3"
        />

        <text className="plot__tick" x={0} y={HEIGHT - 4}>
          {format(histogram.min)}
        </text>
        <text className="plot__tick" x={WIDTH} y={HEIGHT - 4} textAnchor="end">
          {format(histogram.max)}
        </text>
      </svg>

      <figcaption className="plot__legend">
        <div>
          <span className="swatch" style={{ background: "var(--violet)" }} aria-hidden />
          <span>p10</span>
          <b>{format(stats.p10)}</b>
        </div>
        <div>
          <span className="swatch" style={{ background: "var(--gold)" }} aria-hidden />
          <span>mediana</span>
          <b>{format(stats.median)}</b>
        </div>
        <div>
          <span className="swatch" style={{ background: "var(--violet)" }} aria-hidden />
          <span>p90</span>
          <b>{format(stats.p90)}</b>
        </div>
      </figcaption>
    </figure>
  );
}

function defaultFormat(value: number): string {
  return Math.round(value).toLocaleString("it-IT");
}
