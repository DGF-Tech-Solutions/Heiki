"use client";

import type { ReactNode } from "react";
import { cx, numeric } from "@/components/ui";

/**
 * I comandi del calcolatore, tutti nello stile dello slider del livello e del
 * Risveglio (regola dell'utente, 26/09): radio nascosti con un riquadro o una
 * stella al posto del pallino, slider con la casella del numero accanto.
 */

/** Una fila di scelte: riquadri col testo o con un'immagine. */
export function ChoiceRow<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  disabled,
  note,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: ReactNode; title: string; disabled?: boolean }[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  note?: ReactNode;
}) {
  return (
    <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0" disabled={disabled}>
      <legend className="float-left mr-3 p-0 text-ink-2">{legend}</legend>
      <div className="flex flex-wrap items-center gap-1">
        {options.map((option) => (
          <label key={String(option.value)} className="cursor-pointer" title={option.title}>
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="sr-only">{option.title}</span>
            <span
              aria-hidden
              className={cx(
                numeric,
                "grid h-7 min-w-7 place-items-center rounded-[3px] border px-1.5 text-[12px] peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
                value === option.value ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {note ? <span className="text-[12px] text-ink-3">{note}</span> : null}
    </fieldset>
  );
}

/** Una stella accesa fino al valore scelto, spenta dopo: il Risveglio dell'eroe e quello dei pezzi. */
export function Star({ src, lit, size = 18 }: { src?: string; lit: boolean; size?: number }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={39}
        height={41}
        style={{ width: size, height: size }}
        className={cx("object-contain transition-opacity", !lit && "opacity-25 grayscale")}
      />
    );
  }
  return <span className={cx("text-[17px] leading-none", lit ? "text-gold" : "text-ink-3/40")}>★</span>;
}

/** Da 0 a `count` stelle: lo zero e' un riquadro, le altre stelle. */
export function StarRow({
  legend,
  name,
  count,
  value,
  onChange,
  starSrc,
  title,
  disabled,
  note,
}: {
  legend: string;
  name: string;
  count: number;
  value: number;
  onChange: (value: number) => void;
  starSrc?: string;
  title: (n: number) => string;
  disabled?: boolean;
  note?: ReactNode;
}) {
  return (
    <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0" disabled={disabled}>
      <legend className="float-left mr-3 p-0 text-ink-2">{legend}</legend>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: count + 1 }, (_, n) => (
          <label key={n} className="cursor-pointer" title={title(n)}>
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="peer sr-only"
            />
            <span className="sr-only">{title(n)}</span>
            <span
              aria-hidden
              className={cx(
                "grid h-7 min-w-7 place-items-center rounded-[3px] px-1 peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
                n === 0 &&
                  cx(
                    numeric,
                    "mr-1 w-7 border text-[12px]",
                    value === 0 ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3",
                  ),
              )}
            >
              {n === 0 ? "0" : <Star src={starSrc} lit={n <= value} />}
            </span>
          </label>
        ))}
      </div>
      {note ? <span className="text-[12px] text-ink-3">{note}</span> : null}
    </fieldset>
  );
}

/** Uno slider con la casella del numero, come quello del livello. */
export function RangeField({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  suffix,
  after,
}: {
  id: string;
  label: ReactNode;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  after?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
      <label htmlFor={id} className="text-ink-2">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full min-w-0 accent-[var(--color-brand)]"
      />
      <span className="flex items-center gap-1.5">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={typeof label === "string" ? label : undefined}
          onChange={(event) => {
            if (event.target.value !== "") onChange(Number(event.target.value));
          }}
          className={cx(numeric, "w-[4.5rem] rounded-[3px] border border-rule bg-paper px-2 py-1 text-right text-ink")}
        />
        {suffix ? <span className="text-ink-3">{suffix}</span> : null}
        {after}
      </span>
    </div>
  );
}

/** Il riquadro di una sezione del calcolatore. */
export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="grid gap-3 rounded-card border border-rule bg-paper-2 p-4 text-[13px]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="m-0 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-2">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function LinkButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="text-[12px] text-brand hover:underline">
      {children}
    </button>
  );
}
