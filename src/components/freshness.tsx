import { cx, eyebrow } from "./ui";

/**
 * Dichiarazione di freschezza.
 *
 * Il difetto piu' grave di un sito di guide non e' sbagliare un numero: e'
 * mostrarne uno vecchio senza dirlo. Chi legge non ha modo di accorgersene e
 * costruisce la squadra su dati di due patch fa.
 *
 * Si dichiara su DUE assi, perche' invecchiano a velocita' diverse:
 *  - i DATI di gioco cambiano quando esce una patch;
 *  - i CALCOLI cambiano quando cambia il motore.
 * Un solo timestamp complessivo nasconderebbe quale dei due e' scaduto.
 */

export interface FreshnessEntry {
  label: string;
  value: string;
  /** true = questa dimensione e' da rivedere */
  stale?: boolean;
}

export function Freshness({
  entries,
  className,
}: {
  entries: readonly FreshnessEntry[];
  className?: string;
}) {
  if (entries.length === 0) return null;

  return (
    <dl
      className={cx(
        "m-0 flex flex-wrap gap-x-6 gap-y-2 rounded-card border border-rule bg-paper-2 px-4 py-3",
        className,
      )}
    >
      {entries.map((entry) => (
        <div key={entry.label} className="flex items-baseline gap-2">
          <dt className={eyebrow}>{entry.label}</dt>
          <dd
            className={cx(
              "m-0 font-mono text-xs",
              entry.stale ? "font-medium text-hot" : "text-ink-2",
            )}
          >
            {entry.value}
            {entry.stale ? " · da rivedere" : ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Data in forma breve e leggibile, senza dipendenze esterne. */
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
}
