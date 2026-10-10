"use client";

/**
 * L'indice di una pagina lunga: le sue sezioni, ferme sotto l'intestazione del
 * sito mentre si scorre, con la sezione in vista segnata in rosso come la voce
 * della pagina nella barra laterale (10/10). Prima l'indice stava solo in cima:
 * a meta' di Meccaniche, 5.000 px piu' giu', non si sapeva piu' dove si era.
 *
 * Due forme. Una fila che scorre di lato, ferma sotto l'intestazione: sul
 * telefono sempre, e sul computer nelle pagine larghe (l'editor del Buff
 * dell'account non lascia spazio a una colonna). Con `rail`, da 1280 px in su
 * l'indice diventa una colonna a destra del testo: la pagina la mette in una
 * griglia e la colonna resta ferma da sola (`self-start`).
 *
 * La sezione in vista si calcola allo scorrimento e non con un
 * IntersectionObserver: l'ultima sezione di una pagina puo' essere piu' bassa
 * dello schermo, e un osservatore non la segnerebbe mai; qui, arrivati in fondo,
 * vale lei.
 */

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { chipClass, cx, eyebrow, numeric } from "@/components/ui";

export interface IndexEntry {
  readonly id: string;
  readonly label: string;
}

/** La linea sotto cui una sezione si considera «in vista»: sotto l'intestazione e la fila dell'indice. */
const LINE = 150;

export function SectionIndex({
  label,
  entries,
  rail = false,
  numbered = true,
  className,
}: {
  /** il nome dell'indice, per i lettori di schermo e in testa alla colonna */
  label: string;
  entries: readonly IndexEntry[];
  rail?: boolean;
  /** il numero davanti a ogni voce: per sezioni in ordine, non per un elenco di date */
  numbered?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(entries[0]?.id ?? "");
  const row = useRef<HTMLOListElement>(null);
  // durante lo scorrimento animato verso una sezione la voce resta quella scelta,
  // invece di passare per tutte quelle in mezzo
  const until = useRef(0);
  const ids = entries.map((entry) => entry.id).join(" ");

  useEffect(() => {
    const list = ids.split(" ");
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (Date.now() < until.current) return;
      const root = document.documentElement;
      const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 4;
      let current = list[0] ?? "";
      for (const id of list) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= LINE) current = id;
      }
      setActive(atEnd ? (list.at(-1) ?? current) : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  // nella fila che scorre di lato la voce attiva resta visibile
  useEffect(() => {
    const list = row.current;
    const chip = list?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return;
    const left = chip.offsetLeft;
    const right = left + chip.offsetWidth;
    if (left < list.scrollLeft || right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - 8) });
    }
  }, [active]);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    until.current = calm ? 0 : Date.now() + 900;
    target.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <nav
      aria-label={label}
      className={cx(
        "sticky top-[61px] z-20 -mx-1 mb-6 border-b-2 border-brand bg-paper px-1 py-1.5",
        rail && "xl:top-[85px] xl:mx-0 xl:mb-0 xl:self-start xl:border-b-0 xl:bg-transparent xl:p-0",
        className,
      )}
    >
      {rail ? <p className={cx(eyebrow, "m-0 mb-2 hidden xl:block")}>{label}</p> : null}
      <ol
        ref={row}
        className={cx(
          "relative m-0 flex list-none gap-1 overflow-x-auto p-0 [scrollbar-width:none]",
          rail && "xl:flex-col xl:overflow-visible",
        )}
      >
        {entries.map((entry, position) => (
          // il fuoco sulla voce e non sulla lama: il taglio obliquo (clip-path) lo ritaglierebbe
          <li
            key={entry.id}
            className="shrink-0 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-[-2px] has-[a:focus-visible]:outline-ink"
          >
            <a
              href={`#${entry.id}`}
              data-section={entry.id}
              aria-current={active === entry.id ? "location" : undefined}
              onClick={(event) => go(event, entry.id)}
              className={chipClass(active === entry.id, false, cx("whitespace-nowrap", rail && "xl:flex xl:h-10 xl:w-full"))}
            >
              {numbered ? (
                <span className={cx(numeric, "text-[12px] opacity-75")}>{String(position + 1).padStart(2, "0")}</span>
              ) : null}
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
