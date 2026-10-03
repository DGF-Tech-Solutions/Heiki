"use client";

/**
 * Un pannello `popover` che si chiude quando si tocca un suo collegamento.
 *
 * Aprirlo e chiuderlo lo fa il browser (pulsante con `popovertarget`, Esc, tocco
 * fuori). Ma intestazione e layout del gioco restano montati mentre si naviga:
 * senza questo il pannello resterebbe aperto sopra la pagina nuova. Il contenuto
 * puo' arrivare dal server, compresi i form con le azioni (Esci).
 */

import { useRef, type ReactNode } from "react";

export function PopoverPanel({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panel}
      id={id}
      popover="auto"
      className={className}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) panel.current?.hidePopover();
      }}
    >
      {children}
    </div>
  );
}
