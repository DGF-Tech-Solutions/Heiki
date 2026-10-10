"use client";

import type { ReactNode } from "react";
import { chipClass, cx, numeric } from "@/components/ui";

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
          // il fuoco sull'etichetta: il taglio della lama e' un clip-path e ritaglierebbe il contorno
          <label
            key={String(option.value)}
            className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            title={option.title}
          >
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
              className={chipClass(
                value === option.value,
                true,
                cx(numeric, "h-8 min-w-8 justify-center px-2 peer-disabled:pointer-events-none peer-disabled:opacity-40"),
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
                "grid h-7 min-w-7 place-items-center px-1 peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
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

/**
 * Il rango della Mossa finale: le sei pietre del gioco (card_frame_special_
 * jewelry_01..06), accese fino a quella scelta; senza le immagini, i numeri. Le
 * usano il calcolatore della scheda e il box (10/10).
 */
export function UltimateRow({
  legend,
  name,
  value,
  onChange,
  gemSrcs,
  title,
}: {
  legend: string;
  name: string;
  value: number;
  onChange: (rank: number) => void;
  gemSrcs?: readonly string[];
  title: (rank: number) => string;
}) {
  return (
    <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
      <legend className="float-left mr-3 p-0 text-ink-2">{legend}</legend>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 6 }, (_, position) => {
          const rank = position + 1;
          return (
            <label key={rank} className="cursor-pointer" title={title(rank)}>
              <input type="radio" name={name} checked={value === rank} onChange={() => onChange(rank)} className="peer sr-only" />
              <span className="sr-only">{title(rank)}</span>
              <span
                aria-hidden
                className={cx(
                  "grid h-7 w-7 place-items-center border peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                  value === rank ? "border-brand bg-brand-soft" : "border-transparent",
                )}
              >
                {gemSrcs?.[position] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gemSrcs[position]}
                    alt=""
                    width={24}
                    height={24}
                    className={cx("h-5 w-5 object-contain", rank > value && "opacity-30")}
                  />
                ) : (
                  <span className={cx(numeric, "text-[12px]", rank <= value ? "text-ink" : "text-ink-3")}>{rank}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * I due Vero risveglio (materiali del Re Demone, della Divinita' Suprema): le
 * sfere del gioco, accese o spente. Calcolatore e box.
 */
export function TrueAwakeningRow({
  legend,
  value,
  onChange,
  srcs,
  labels,
  titles,
}: {
  legend: string;
  value: readonly [boolean, boolean];
  onChange: (value: readonly [boolean, boolean]) => void;
  srcs?: readonly [string, string];
  labels: readonly [string, string];
  titles: readonly [string, string];
}) {
  return (
    <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
      <legend className="float-left mr-3 p-0 text-ink-2">{legend}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {([0, 1] as const).map((kind) => {
          const on = value[kind];
          const toggle = (next: boolean) => onChange(kind === 0 ? [next, value[1]] : [value[0], next]);
          return (
            <label key={kind} className="flex cursor-pointer items-center gap-1.5" title={titles[kind]}>
              <input
                type="checkbox"
                checked={on}
                onChange={(event) => toggle(event.target.checked)}
                className={cx("peer accent-[var(--color-brand)]", srcs && "sr-only")}
              />
              {srcs ? (
                <span
                  aria-hidden
                  className={cx(
                    "grid h-9 w-9 place-items-center border peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                    on ? "border-brand bg-brand-soft" : "border-rule",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={srcs[kind]}
                    alt=""
                    width={32}
                    height={32}
                    className={cx("h-8 w-8 object-contain transition-opacity", !on && "opacity-30 grayscale")}
                  />
                </span>
              ) : null}
              <span className={cx("text-[12px]", on ? "text-ink-2" : "text-ink-3")}>{labels[kind]}</span>
            </label>
          );
        })}
      </div>
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
      <label id={`${id}-etichetta`} htmlFor={id} className="text-ink-2">
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
          // la casella del numero prende il nome dall'etichetta dello slider, anche
          // quando e' un elemento (gli «Effetto bonus», 10/10: erano senza nome)
          aria-labelledby={`${id}-etichetta`}
          onChange={(event) => {
            if (event.target.value !== "") onChange(Number(event.target.value));
          }}
          className={cx(numeric, "w-[4.5rem] border border-rule bg-paper px-2 py-1 text-right text-ink")}
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
    <button type="button" onClick={onClick} className="text-[12px] font-semibold text-brand-deep hover:underline">
      {children}
    </button>
  );
}
