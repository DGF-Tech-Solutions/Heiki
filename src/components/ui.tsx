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
import { IconChevronRight } from "./icons";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* --------------------------------------------------------------- testo -- */

/** Titolo: pesante, stretto, maiuscolo. La voce della pagina. */
export const display =
  "p5-title font-display font-black uppercase leading-[1.02] tracking-[-0.02em] [font-variation-settings:'wdth'_80]";

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

// Tagliati in obliquo come i comandi dei menu di Persona: il taglio e' clip-path
// (p5-cut, in globals.css), quindi la misura del bottone non cambia. Il passaggio
// e la pressione li fa `p5-btn` (la lama che spazza, il comando che affonda): qui
// solo i quattro colori di ogni variante, a riposo e al passaggio.
const BUTTON_BASE =
  "p5-cut p5-btn inline-flex items-center justify-center gap-2 font-display font-extrabold uppercase " +
  "tracking-[0.03em] [font-variation-settings:'wdth'_85] " +
  "cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "[--btn-bg:var(--color-brand)] [--btn-fg:#fff] [--btn-hi:var(--color-ink)] [--btn-hi-fg:var(--color-paper)]",
  outline: "[--btn-bg:var(--color-ink)] [--btn-fg:var(--color-paper)] [--btn-hi:var(--color-brand)] [--btn-hi-fg:#fff]",
  ghost: "[--btn-bg:transparent] [--btn-fg:var(--color-ink-2)] [--btn-hi:var(--color-ink)] [--btn-hi-fg:var(--color-paper)]",
};

/**
 * I colori della lama dei filtri (`p5-btn`): spenta, scelta in rosso, scelta
 * quieta (in nero, per le scelte che hanno sempre un valore). La scelta non
 * cambia al passaggio: e' gia' accesa.
 */
export function chipColors(active: boolean, quiet = false): string {
  return active && quiet
    ? "font-bold [--btn-bg:var(--color-ink)] [--btn-fg:var(--color-paper)] [--btn-hi:var(--color-ink)] [--btn-hi-fg:var(--color-paper)]"
    : active
      ? "font-bold [--btn-bg:var(--color-brand)] [--btn-fg:#fff] [--btn-hi:var(--color-brand)] [--btn-hi-fg:#fff]"
      : "font-semibold";
}

const BUTTON_SIZE: Record<ButtonSize, string> = {
  md: "h-[38px] px-[22px] text-sm",
  sm: "h-8 px-3.5 text-[13px]",
};

/** Solo i colori di una variante, per i comandi con una forma loro (icone, frecce). */
export function buttonColors(variant: ButtonVariant): string {
  return cx("p5-btn", BUTTON_VARIANT[variant]);
}

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
  neutral: "bg-ink text-paper",
  brand: "bg-brand text-white",
  gold: "bg-gold text-paper",
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
        "p5-cut-sm inline-flex h-5 items-center gap-1 whitespace-nowrap px-[9px]",
        "font-mono text-[11px] font-medium uppercase tracking-[0.06em]",
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
        "p5-corner border border-rule bg-paper-2 p-5",
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
      <h2 className={cx(display, "text-2xl")}>{title}</h2>
      {aside}
    </div>
  );
}

/**
 * La testata di una pagina (10/10): il titolo e, a destra, una riga che dice cosa
 * c'e'. Niente etichetta sopra il titolo (la striscia del gioco e le briciole
 * dicono gia' dove sei) e niente paragrafi di metodo: quelli vanno in `HowItWorks`
 * o in fondo alla pagina. Una forma sola, perche' prima ogni pagina aveva la sua.
 */
export function PageHeader({
  title,
  children,
  className,
}: {
  title: ReactNode;
  /** una o due righe: cosa c'e' nella pagina */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cx(
        "mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-brand pb-4",
        className,
      )}
    >
      <h1 className={cx(display, "text-[clamp(34px,5vw,58px)]")}>{title}</h1>
      {children ? <div className="m-0 max-w-[48ch] text-sm text-ink-2 [&_p]:m-0">{children}</div> : null}
    </header>
  );
}

/**
 * «Come funziona»: la spiegazione di metodo (da dove vengono i dati, come si
 * legge una tabella), chiusa finche' non la si apre. Prima stava in testa alle
 * pagine, prima dello strumento (10/10).
 */
export function HowItWorks({
  summary,
  children,
  open,
  className,
}: {
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
  className?: string;
}) {
  return (
    <details open={open} className={cx("group/come border-y border-rule-2 py-2", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink-2 [font-variation-settings:'wdth'_85] hover:text-ink [&::-webkit-details-marker]:hidden">
        <IconChevronRight size={14} className="transition-transform group-open/come:rotate-90" />
        {summary}
      </summary>
      <div className="mt-2.5 max-w-[48ch] text-sm leading-relaxed text-ink-2 [&_p]:m-0 [&_p+p]:mt-2">{children}</div>
    </details>
  );
}

/**
 * La forma dei pulsanti di scelta (filtri, ordini, «server»), per chi li fa con
 * un collegamento invece che con un pulsante: la stessa lama di `Chip`
 * (filter-chips.tsx). Rossa se la scelta restringe l'elenco, bianca se e' una
 * scelta che c'e' sempre (un ordine, un server).
 */
export function chipClass(active: boolean, quiet = false, className?: string): string {
  return cx(
    // 40px sul telefono e non 36: si centrano col pollice (10/10)
    "p5-cut-sm p5-btn inline-flex h-9 cursor-pointer items-center gap-1.5 px-3 text-[12px] uppercase tracking-[0.04em] no-underline max-sm:h-10",
    chipColors(active, quiet),
    className,
  );
}

/**
 * Una scelta fra poche voci, con i pulsanti di radio del browser nascosti sotto
 * la lama dei filtri (`chipClass`, quieta: c'e' sempre un valore). Prima ogni
 * strumento aveva i suoi rettangoli rosso scuro bordati.
 *
 * Il fuoco si disegna sull'etichetta e non sulla lama: il taglio obliquo e' un
 * clip-path, e ritaglierebbe anche il contorno del fuoco.
 */
export function RadioChips<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: ReactNode; title?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1.5 border-0 p-0">
      <legend className={cx(eyebrow, "float-left mr-1.5 p-0 leading-9")}>{legend}</legend>
      {options.map((option) => (
        <label
          key={String(option.value)}
          title={option.title}
          className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
        >
          <input
            type="radio"
            name={name}
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          {option.title ? <span className="sr-only">{option.title}</span> : null}
          <span aria-hidden={option.title ? true : undefined} className={chipClass(value === option.value, true)}>
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    // un riquadro con l'angolo tagliato come le altre note, non il tratteggio (10/10)
    <p className="p5-corner m-0 border border-rule bg-paper-2 p-6 text-center text-sm text-ink-2">
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
      <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">{label}</dt>
      <dd
        className={cx(
          numeric,
          "m-0 mt-1 font-medium tracking-[-0.02em]",
          small ? "text-[15px]" : "text-xl",
        )}
      >
        {value}
        {unit ? <small className="ml-1 text-[12px] font-normal text-ink-3">{unit}</small> : null}
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
      <span className="mb-1.5 flex items-baseline justify-between gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
        {label}
        {hint ? <span className="text-[12px] normal-case tracking-normal">{hint}</span> : null}
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
        // Il filo colorato a sinistra e' diventato l'angolo tagliato del riquadro;
        // i testi erano scuri su fondo scuro (resti del tema chiaro): ora chiari
        "p5-corner flex gap-3 border px-4 py-3 text-[13px]",
        tone === "error"
          ? "border-hot bg-hot-soft text-[#ffc2dc]"
          : tone === "warn"
            ? "border-gold bg-gold-soft text-[#ffe890]"
            : "border-brand bg-brand-soft text-ink",
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
