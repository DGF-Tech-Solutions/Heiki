"use client";

/**
 * Un pulsante che apre, sotto di se', un pannello di comandi: il menu di ogni
 * riga della tier list e, sul telefono, le azioni che non stanno nella barra.
 *
 * Nato il 24/10: i comandi della riga erano sei glifi da 8-20 px sparsi sul
 * colore (▲ ▼ 🎨 ✎ «Svuota» ✕), con la ✕ di «Elimina riga» a un dito da
 * «Svuota». Raccolti qui sono comandi veri, con nome, icona e almeno 44 px sul
 * tocco, e la riga resta pulita: la lettera, gli eroi, un pulsante.
 *
 * E' un pulsante che mostra e nasconde (aria-expanded), non un `role="menu"`:
 * dentro ci sono pulsanti normali e il Tab li percorre. Esc chiude e rimette il
 * fuoco sul pulsante; un tocco fuori, o il fuoco che esce, chiude e basta.
 */

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cx } from "@/components/ui";

/** Una voce del pannello: la lama delle voci di menu del sito (`p5-menu-item`). */
export const menuItemClass =
  "p5-menu-item flex min-h-10 w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left font-display " +
  "text-[14px] font-extrabold uppercase tracking-[0.02em] text-ink-2 hover:text-on-plate [font-variation-settings:'wdth'_82] " +
  "max-lg:min-h-11 pointer-coarse:min-h-11 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-40";

/** Il pannello: come il menu dell'utente nell'intestazione, bordo pieno e ombra sfalsata. */
const PANEL =
  "absolute top-full z-[15] mt-1.5 grid gap-0.5 border-2 border-ink bg-paper p-2 text-ink " +
  "shadow-[6px_6px_0_0_var(--color-mark)]";

export function MenuButton({
  label,
  children,
  content,
  className,
  panelClassName,
  align = "end",
  buttonRef,
}: {
  /** il nome del pulsante, per chi usa un lettore di schermo e nel suggerimento */
  label: string;
  /** cosa si vede sul pulsante: un'icona, o un'icona e una parola */
  content: ReactNode;
  /** il pannello: riceve `close`, da chiamare dopo un comando che lo chiude */
  children: (close: (refocus?: boolean) => void) => ReactNode;
  className?: string;
  panelClassName?: string;
  /** da che lato del pulsante si allinea il pannello */
  align?: "start" | "end";
  buttonRef?: (element: HTMLButtonElement | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    // il fuoco entra sul primo comando, come in un menu
    root.current
      ?.querySelector<HTMLElement>(`[data-menu-panel] button:not([disabled]), [data-menu-panel] input`)
      ?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
      onBlur={(event) => {
        // il fuoco passato a un altro comando della pagina chiude il pannello;
        // un clic sul fondo del pannello (relatedTarget nullo) no
        const next = event.relatedTarget as Node | null;
        if (open && next && !root.current?.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={(element) => {
          button.current = element;
          buttonRef?.(element);
        }}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        onClick={() => setOpen((value) => !value)}
        className={className}
      >
        {content}
      </button>
      <div
        id={panelId}
        data-menu-panel
        hidden={!open}
        className={cx(PANEL, align === "end" ? "right-0" : "left-0", panelClassName)}
      >
        {open ? children(close) : null}
      </div>
    </div>
  );
}
