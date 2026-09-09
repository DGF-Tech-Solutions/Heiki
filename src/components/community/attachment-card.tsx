/**
 * Il risultato di simulazione allegato a un post.
 *
 * E' il pezzo che rende questa community diversa da un forum: invece di "questa
 * build spacca", ci sono mediana, intervallo e probabilita' di riuscita, piu' il
 * seed e la patch con cui sono stati prodotti. Chiunque puo' rifare il conto e
 * ottenere gli stessi numeri, quindi non si litiga per opinioni.
 *
 * La barra sotto i valori mostra dove cade la mediana dentro l'intervallo
 * p10-p90: una build regolare la tiene al centro, una che dipende dalla fortuna
 * la spinge verso un estremo.
 */

import type { SimulationAttachment } from "@/lib/community/types";
import { Stat, StatGrid, Tag } from "../ui";

export function AttachmentCard({ data }: { data: SimulationAttachment }) {
  const span = Math.max(1, data.p90 - data.p10);
  const position = Math.min(100, Math.max(0, ((data.median - data.p10) / span) * 100));
  const unit = data.timeUnit === "turns" ? "turni" : "s";

  return (
    <figure className="m-0 mt-3.5 rounded-card border border-rule bg-paper-2 p-3.5">
      <figcaption className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tag tone="brand">simulazione</Tag>
        <span className="font-mono text-[11px] text-ink-3">
          {data.character} · {data.team.length} unità · patch {data.patch}
        </span>
      </figcaption>

      <StatGrid className="bg-paper">
        <Stat label="Danno mediano" value={Math.round(data.median).toLocaleString("it-IT")} />
        <Stat
          label="Nove su dieci"
          small
          value={`${Math.round(data.p10).toLocaleString("it-IT")} – ${Math.round(
            data.p90,
          ).toLocaleString("it-IT")}`}
        />
        <Stat
          label="KO in"
          value={data.timeToKill === null ? "—" : data.timeToKill}
          unit={data.timeToKill === null ? "mai" : unit}
        />
        <Stat label="Riuscita" value={Math.round(data.killRate * 100)} unit="%" />
      </StatGrid>

      <div className="relative mt-3.5 h-1 rounded-full bg-paper-3" aria-hidden>
        <span
          className="absolute -top-1 h-3 w-0.5 -translate-x-px rounded-sm bg-hot"
          style={{ left: `${position}%` }}
        />
      </div>

      <p className="m-0 mt-2 font-mono text-[10px] text-ink-3">
        seed {data.seed} · rifallo tu e ti escono gli stessi numeri
      </p>
    </figure>
  );
}
