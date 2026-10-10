"use client";

import { useEffect } from "react";

/**
 * Nella scheda «Abilita'», la colonna corta che resta ferma mentre scorre la
 * lunga.
 *
 * Le due colonne (Unica e abilita' speciali a sinistra, carte a destra) quasi
 * mai sono alte uguali: Derieri a 1400 fa 481px contro 1.105, King 419, un eroe
 * senza abilita' speciali 200. Sotto la corta restava un vuoto di 600-900px,
 * proprio mentre si leggevano le carte. Ferma sotto la barra delle schede,
 * l'Unica resta accanto alle carte che si leggono, e il vuoto non si vede.
 *
 * Il CSS da solo non basta, ed e' per questo che c'e' JavaScript: fermarla in
 * alto va bene SOLO se la colonna sta nello schermo. Una colonna piu' alta
 * dello schermo, ferma in alto, nasconderebbe il suo fondo finche' non finisce
 * l'altra (Tristan ha un'Unica e un Talento per 1.058px, Meliodas Nemesi
 * un'Unica di 1.300). Qui si misura, e la colonna piu' corta delle due
 * affiancate riceve `data-ferma`:
 * - `alto` se sta nello spazio sotto la barra: resta in cima mentre l'altra
 *   scorre;
 * - `basso` se non ci sta: si legge scorrendo come sempre, e quando il suo fondo
 *   arriva in fondo allo schermo resta li' (in fondo alla sua cella e ferma in
 *   basso, `self-end` e `bottom`). Il vuoto finisce sopra di lei, fuori dallo
 *   schermo, invece che sotto, accanto alle carte che si stanno leggendo.
 * Le classi della colonna fanno il resto. Si rimisura quando cambia una
 * misura: la finestra, o un rango scelto che allunga un testo.
 *
 * Non disegna niente, come HeroTabUrl. Senza JavaScript le colonne scorrono
 * insieme, come prima.
 */
export function HeroStickyColumns({ gridId, top }: { gridId: string; top: number }) {
  useEffect(() => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const columns = [...grid.children].filter((child): child is HTMLElement => child instanceof HTMLElement);
    if (columns.length !== 2) return;
    const [a, b] = columns as [HTMLElement, HTMLElement];

    const check = () => {
      // affiancate, e non una sotto l'altra (scheda stretta, o nascosta): lo
      // dice il bordo sinistro, che fermarsi non sposta (l'altezza si')
      const side = a.getBoundingClientRect().left + 1 < b.getBoundingClientRect().left;
      // lo spazio sotto la barra delle schede, con un margine in fondo
      const room = window.innerHeight - top - 16;
      for (const [column, other] of [
        [a, b],
        [b, a],
      ] as const) {
        // 40px di differenza almeno: sotto, il vuoto non si nota e fermarla non serve
        if (side && column.offsetHeight + 40 < other.offsetHeight) {
          column.setAttribute("data-ferma", column.offsetHeight <= room ? "alto" : "basso");
        } else {
          column.removeAttribute("data-ferma");
        }
      }
    };

    check();
    // fermarsi non cambia la misura della colonna: niente giri a vuoto
    const observer = new ResizeObserver(check);
    observer.observe(a);
    observer.observe(b);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [gridId, top]);

  return null;
}
