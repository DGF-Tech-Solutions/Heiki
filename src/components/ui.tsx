/**
 * Primitive dell'interfaccia.
 *
 * Un solo file: tutte le decisioni visive ricorrenti stanno qui, e le pagine le
 * compongono. Cambiare l'aspetto dei bottoni o delle etichette significa
 * toccare una riga in questo file, non cercarli in venti componenti.
 *
 * Le classi sono Tailwind e restano leggibili nel punto in cui si usano; qui si
 * estrae solo cio' che si ripete abbastanza da valere un nome.
 */

import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- testo -- */

/** Titolo: pesante, stretto, maiuscolo. La voce della pagina. */
export const display =
  "font-display font-extrabold uppercase leading-[1.02] tracking-[-0.03em] [font-variation-settings:'wdth'_88]";

/** Etichetta strutturale: sempre monospaziata, mai decorativa. */
export const eyebrow =
  "font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3";

/** Numeri: monospaziati e tabulari, cosi' le colonne non ballano. */
export const numeric = "font-mono tabular-nums";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx(eyebrow, "m-0", className)}>{children}</p>;
}

/* ------------------------------------------------------------- bottoni -- */

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "md" | "sm";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-card font-body font-semibold " +
  "transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white border-[1.5px] border-brand hover:bg-brand-deep hover:border-brand-deep " +
    "disabled:hover:bg-brand disabled:hover:border-brand",
  outline:
    "bg-paper text-ink border-[1.5px] border-ink hover:bg-ink hover:text-paper " +
    "disabled:hover:bg-paper disabled:hover:text-ink",
  ghost:
    "bg-transparent text-ink-2 border-[1.5px] border-transparent font-medium hover:bg-paper-2 hover:text-ink",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  md: "h-[38px] px-[18px] text-sm",
  sm: "h-8 px-3 text-[13px]",
};

export function buttonClass(
  variant: ButtonVariant = "outline",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cx(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className);
}

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button {...props} className={buttonClass(variant, size, className)} />;
}

/* ------------------------------------------------------------ etichette -- */

type TagTone = "neutral" | "brand" | "gold" | "accent";

const TAG_TONE: Record<TagTone, string> = {
  neutral: "bg-paper-3 text-ink-2",
  brand: "bg-brand text-white",
  gold: "bg-gold text-white",
  accent: "bg-[var(--accent)] text-white",
};

/**
 * Blocco di colore pieno, non testo colorato: e' da qui che arriva l'energia
 * del sistema. Un blocco tinto si legge a mezzo metro, una parola colorata no.
 */
export function Tag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: TagTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-[2px] px-[7px]",
        "font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
        TAG_TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------- contenitori -- */

export function Card({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  /** filo colorato in alto: usarlo solo dove serve gerarchia, non ovunque */
  accent?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-rule bg-paper p-5",
        accent && "border-t-[3px] border-t-brand",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  title,
  aside,
  className,
}: {
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("mb-6 flex items-baseline justify-between gap-5", className)}>
      <h2 className={cx(display, "text-2xl [font-variation-settings:'wdth'_90]")}>{title}</h2>
      {aside}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 rounded-card border border-dashed border-rule bg-paper-2 p-6 text-center text-sm text-ink-3">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------- letture -- */

export function StatGrid({
  children,
  columns = "repeat(auto-fit, minmax(118px, 1fr))",
  className,
}: {
  children: ReactNode;
  columns?: string;
  className?: string;
}) {
  return (
    <dl
      className={cx(
        "m-0 grid overflow-hidden rounded-card border border-rule [&>div]:border-r [&>div]:border-rule-2",
        "[&>div:last-child]:border-r-0",
        className,
      )}
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </dl>
  );
}

export function Stat({
  label,
  value,
  unit,
  small = false,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  small?: boolean;
}) {
  return (
    <div className="bg-paper px-3.5 py-3">
      <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-3">{label}</dt>
      <dd
        className={cx(
          numeric,
          "m-0 mt-1 font-medium tracking-[-0.02em]",
          small ? "text-[15px]" : "text-xl",
        )}
      >
        {value}
        {unit ? <small className="ml-1 text-[11px] font-normal text-ink-3">{unit}</small> : null}
      </dd>
    </div>
  );
}

/* ---------------------------------------------------------------- form -- */

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cx("mb-4 block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
        {label}
        {hint ? <span className="text-[11px] normal-case tracking-normal">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-hot">{error}</span> : null}
    </label>
  );
}

const CONTROL =
  "w-full rounded-card border border-rule bg-paper text-ink font-body " +
  "hover:border-ink-3 focus:outline-none focus:border-brand focus:ring-[3px] focus:ring-brand-soft";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cx(CONTROL, "h-10 px-3 text-[15px]", className)} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cx(CONTROL, "min-h-[86px] resize-y px-3 py-2.5 text-sm leading-relaxed", className)}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select {...props} className={cx(CONTROL, "h-10 px-3 text-[15px]", className)} />;
}

/* ---------------------------------------------------------------- note -- */

export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "warn" | "error";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex gap-3 rounded-card border border-rule border-l-4 px-4 py-3 text-[13px]",
        tone === "error"
          ? "border-l-hot bg-hot-soft text-[#9c0f3c]"
          : tone === "warn"
            ? "border-l-gold bg-gold-soft text-[#7a5100]"
            : "border-l-brand bg-brand-soft text-ink-2",
        className,
      )}
      role={tone === "error" ? "alert" : undefined}
    >
      {children}
    </div>
  );
}

/** Codice inline dentro le note: comandi da copiare. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[2px] bg-paper px-1.5 py-px font-mono text-xs text-brand-deep">
      {children}
    </code>
  );
}
