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
import type { AttachmentCheck } from "@/lib/community/verify";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { IconCheck, IconClose } from "../icons";
import { cx, Stat, StatGrid, Tag } from "../ui";

const TESTI = testi({
  it: {
    turni: "turni",
    simulazione: "simulazione",
    unita: (n: number) => `${n} unità`,
    dannoMediano: "Danno mediano",
    noveSuDieci: "Nove su dieci",
    koIn: "KO in",
    mai: "mai",
    riuscita: "Riuscita",
    tentativi: (_n: number, scritto: string) => `${scritto} tentativi`,
    rifallo: "rifallo tu e ti escono gli stessi numeri",
    medianaDiversa: (ricalcolata: string, dichiarata: string) =>
      `Rieseguendo il calcolo con questo seed la mediana risulta ${ricalcolata} invece di ${dichiarata}.`,
    verificatoTitolo: "Il motore ha rifatto il calcolo con questo seed e ottiene gli stessi numeri.",
    nonRiprodottoTitolo: "Rieseguendo il calcolo con questo seed i numeri non coincidono.",
    verificato: "verificato",
    nonRiprodotto: "non riprodotto",
  },
  en: {
    turni: "turns",
    simulazione: "simulation",
    unita: (n: number) => `${n} ${n === 1 ? "unit" : "units"}`,
    dannoMediano: "Median damage",
    noveSuDieci: "Nine in ten",
    koIn: "KO in",
    mai: "never",
    riuscita: "Success rate",
    tentativi: (n: number, scritto: string) => `${scritto} ${n === 1 ? "run" : "runs"}`,
    rifallo: "run it yourself and you get the same numbers",
    medianaDiversa: (ricalcolata: string, dichiarata: string) =>
      `Rerunning the calculation with this seed gives a median of ${ricalcolata} instead of ${dichiarata}.`,
    verificatoTitolo: "The engine redid the calculation with this seed and gets the same numbers.",
    nonRiprodottoTitolo: "Rerunning the calculation with this seed, the numbers don't match.",
    verificato: "verified",
    nonRiprodotto: "not reproduced",
  },
});

type Testi = (typeof TESTI)["it"];

export async function AttachmentCard({
  data,
  check,
}: {
  data: SimulationAttachment;
  /** esito della riverifica; assente nel feed, dove non si ricalcola */
  check?: AttachmentCheck;
}) {
  const locale = await getLocale();
  const t = TESTI[locale];
  const tag = intlLocale(locale);
  const round = (value: number) => Math.round(value).toLocaleString(tag);

  const span = Math.max(1, data.p90 - data.p10);
  const position = Math.min(100, Math.max(0, ((data.median - data.p10) / span) * 100));
  const unit = data.timeUnit === "turns" ? t.turni : "s";

  return (
    <figure className="p5-corner m-0 mt-3.5 border border-rule bg-paper-2 p-3.5">
      <figcaption className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tag tone="brand">{t.simulazione}</Tag>
        {check ? <CheckBadge check={check} t={t} /> : null}
        <span className="font-mono text-[11px] text-ink-3">
          {data.character} · {t.unita(data.team.length)} · patch {data.patch}
        </span>
      </figcaption>

      <StatGrid className="bg-paper">
        <Stat label={t.dannoMediano} value={round(data.median)} />
        <Stat label={t.noveSuDieci} small value={`${round(data.p10)} – ${round(data.p90)}`} />
        <Stat
          label={t.koIn}
          value={data.timeToKill === null ? "—" : data.timeToKill}
          unit={data.timeToKill === null ? t.mai : unit}
        />
        <Stat label={t.riuscita} value={Math.round(data.killRate * 100)} unit="%" />
      </StatGrid>

      <div className="relative mt-3.5 h-1 bg-paper-3" aria-hidden>
        <span
          className="absolute -top-1 h-3 w-0.5 -translate-x-px bg-hot"
          style={{ left: `${position}%` }}
        />
      </div>

      <p className="m-0 mt-2 font-mono text-[11px] text-ink-3">
        seed {data.seed}
        {data.iterations > 0
          ? ` · ${t.tentativi(data.iterations, data.iterations.toLocaleString(tag))}`
          : ""}{" "}
        · {t.rifallo}
      </p>

      {check?.status === "mismatch" ? (
        <p className="m-0 mt-2 text-[12px] text-hot">
          {t.medianaDiversa(round(check.recomputed ?? 0), round(check.declared ?? 0))}
        </p>
      ) : null}
    </figure>
  );
}

/**
 * Etichetta dell'esito.
 *
 * "Non verificabile" non compare: un segno di dubbio su un post innocente - dati
 * di un'altra patch, personaggi non piu' presenti - fa piu' danno di nessun
 * segno. Si dichiara solo quando si ha qualcosa da dichiarare.
 */
function CheckBadge({ check, t }: { check: AttachmentCheck; t: Testi }) {
  if (check.status === "unverifiable") return null;

  const verified = check.status === "match";

  return (
    <span
      title={verified ? t.verificatoTitolo : t.nonRiprodottoTitolo}
      className={cx(
        "p5-cut-sm inline-flex h-5 items-center gap-1 px-[9px] font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em]",
        verified ? "bg-[#128a5b] text-white" : "bg-hot text-white",
      )}
    >
      {/* il segno disegnato e non il carattere: ✓ e ✗ cambiano forma da un font all'altro */}
      {verified ? <IconCheck size={11} /> : <IconClose size={11} />}
      {verified ? t.verificato : t.nonRiprodotto}
    </span>
  );
}
