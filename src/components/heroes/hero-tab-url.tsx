"use client";

import { useEffect } from "react";

/**
 * La scheda scelta nell'indirizzo, e la pagina riportata in cima alle schede.
 *
 * Le schede cambiano senza JavaScript (radio e CSS, vedi `HeroTabs`); questo
 * pezzo aggiunge due cose che il CSS non sa fare:
 *
 * - scrive `?scheda=<scelta>` nell'indirizzo con `replaceState`, cosi'
 *   ricaricare o condividere la pagina riapre la stessa scheda. `replace` e non
 *   `push`: il tasto Indietro torna alla pagina di prima, non alla scheda di
 *   prima. Per la prima scheda il parametro si toglie, e l'indirizzo resta
 *   quello di sempre. Next sincronizza il suo router con `replaceState` nativo
 *   (dalla 14.1), quindi un `router.refresh()` - il cambio di lingua - rende la
 *   stessa scheda.
 * - se si era scesi dentro una scheda lunga, riporta la pagina all'inizio delle
 *   schede: la nuova si legge dall'alto, invece di trovarsi a meta' o in fondo.
 *
 * Non disegna niente. Senza JavaScript le schede funzionano lo stesso.
 */
export function HeroTabUrl({ name, first, wrapperId }: { name: string; first: string; wrapperId: string }) {
  useEffect(() => {
    const onChange = (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "radio" || input.name !== name) return;

      const url = new URL(window.location.href);
      if (input.value === first) url.searchParams.delete(name);
      else url.searchParams.set(name, input.value);
      window.history.replaceState(null, "", url);

      const wrapper = document.getElementById(wrapperId);
      // sopra lo zero vuol dire che la barra e' ferma sotto l'intestazione e la
      // scheda comincia fuori dallo schermo
      if (wrapper && wrapper.getBoundingClientRect().top < 0) wrapper.scrollIntoView({ block: "start" });
    };
    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [name, first, wrapperId]);

  return null;
}
