/**
 * L'elemento firma del sito.
 *
 * Su una piattaforma gacha la scelta ovvia sarebbe aprire con l'artwork dei
 * personaggi. Qui si apre con la distribuzione di una simulazione reale: e' cio'
 * che il prodotto sa fare e nessun concorrente mette in prima pagina, ed e'
 * interamente materiale nostro - nessun asset di un publisher.
 *
 * Le barre dentro l'intervallo p10-p90 sono piene, quelle fuori spente: si legge
 * a colpo d'occhio dove cade il risultato nove volte su dieci. La linea magenta
 * marca la mediana.
 */

import type { DistributionStats, Histogram } from "@/lib/engine";
import { eyebrow, numeric } from "./ui";

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

  const xFor = (value: number) =>
    span > 0 ? ((value - histogram.min) / span) * WIDTH : WIDTH / 2;

  return (
    <figure className="m-0 rounded-card border border-rule bg-paper px-5 pt-4.5 pb-3.5">
      <div className="mb-3.5 flex items-baseline justify-between gap-4 border-b border-rule-2 pb-3">
        <span className="font-display text-sm font-bold uppercase tracking-[-0.005em] [font-variation-settings:'wdth'_92]">
          {title}
        </span>
        <span className={eyebrow}>{caption}</span>
      </div>

      <svg
        className="block h-auto w-full"
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
              fill={inner ? "var(--color-brand)" : "var(--color-paper-3)"}
              x={index * barWidth}
              y={plotHeight - height}
              width={Math.max(barWidth - 1, 0.5)}
              height={height}
            />
          );
        })}

        <line
          x1={0}
          y1={plotHeight}
          x2={WIDTH}
          y2={plotHeight}
          stroke="var(--color-rule)"
          strokeWidth={1}
        />
        <line
          x1={xFor(stats.median)}
          y1={0}
          x2={xFor(stats.median)}
          y2={plotHeight}
          stroke="var(--color-hot)"
          strokeWidth={2}
        />

        <text
          x={0}
          y={HEIGHT - 4}
          className="font-mono text-[9px]"
          fill="var(--color-ink-3)"
        >
          {format(histogram.min)}
        </text>
        <text
          x={WIDTH}
          y={HEIGHT - 4}
          textAnchor="end"
          className="font-mono text-[9px]"
          fill="var(--color-ink-3)"
        >
          {format(histogram.max)}
        </text>
      </svg>

      <figcaption className="mt-3 flex flex-wrap gap-4.5 border-t border-rule-2 pt-3">
        <Legend color="var(--color-brand)" label="p10" value={format(stats.p10)} />
        <Legend color="var(--color-hot)" label="mediana" value={format(stats.median)} />
        <Legend color="var(--color-brand)" label="p90" value={format(stats.p90)} />
      </figcaption>
    </figure>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 font-mono text-[11px] text-ink-3">
      <span
        className="size-2 flex-none translate-y-px"
        style={{ background: color }}
        aria-hidden
      />
      <span>{label}</span>
      <b className={`${numeric} text-[13px] font-medium text-ink`}>{value}</b>
    </div>
  );
}

function defaultFormat(value: number): string {
  return Math.round(value).toLocaleString("it-IT");
}
