"use client";

import { useEffect } from "react";
import { searchText } from "@/lib/games/hero-terms";

/**
 * Quello che il JavaScript aggiunge alle tendine delle parole blu: il posto e
 * la ricerca.
 *
 * Le tendine si aprono e si chiudono da sole (`popover` del browser, vedi
 * hero-terms.tsx); senza posizione il browser le mette al centro dello schermo,
 * che resta il comportamento senza JavaScript. Qui:
 *
 * - IL POSTO. Prima che si apra, la tendina va sotto la parola cliccata, o
 *   sopra se sotto non c'e' spazio, larga al massimo quanto lo schermo meno i
 *   margini. `position: absolute` e non `fixed`: nel top layer si posiziona
 *   rispetto al blocco iniziale, che scorre con la pagina, quindi resta
 *   attaccata alla parola anche scorrendo. Quale parola l'ha aperta lo dice
 *   l'ultimo clic su un pulsante con `popovertarget` (anche Invio e Spazio danno
 *   un clic)
 * - LA RICERCA. Le caselle nascono nascoste (senza JavaScript non farebbero
 *   niente) e si accendono qui. Filtrano le righe della loro tendina per nome,
 *   epiteto e abilita', con tutte le parole scritte in qualsiasi ordine, come la
 *   ricerca della griglia Eroi. Riaprendo una tendina la ricerca riparte vuota
 */
export function TermPopoverClient() {
  useEffect(() => {
    for (const input of document.querySelectorAll<HTMLInputElement>("input.tendina-cerca")) input.hidden = false;

    const filter = (input: HTMLInputElement) => {
      const popover = input.closest(".tendina");
      if (!popover) return;
      const words = searchText(input.value).split(" ").filter(Boolean);
      for (const section of popover.querySelectorAll<HTMLElement>("[data-sezione]")) {
        let shown = 0;
        for (const row of section.querySelectorAll<HTMLElement>("li[data-cerca]")) {
          const match = words.every((word) => (row.dataset.cerca ?? "").includes(word));
          row.hidden = !match;
          if (match) shown++;
        }
        const empty = section.querySelector<HTMLElement>("[data-vuoto]");
        if (empty) empty.hidden = shown > 0 || words.length === 0;
        // il numero nella testa della parte: «19 di 108» mentre si cerca
        const count = popover.querySelector<HTMLElement>(`[data-conta="${section.dataset.sezione}"]`);
        if (count) {
          count.textContent =
            words.length === 0 ? (count.dataset.testo ?? "") : `${shown} ${count.dataset.di ?? "/"} ${count.dataset.totale ?? ""}`;
        }
      }
    };

    let invoker: Element | null = null;
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("[popovertarget]") : null;
      if (target) invoker = target;
    };
    const onInput = (event: Event) => {
      if (event.target instanceof HTMLInputElement && event.target.classList.contains("tendina-cerca")) {
        filter(event.target);
      }
    };
    const onBeforeToggle = (event: Event) => {
      const popover = event.target;
      if (!(popover instanceof HTMLElement) || !popover.classList.contains("tendina")) return;
      if ((event as ToggleEvent).newState !== "open") return;

      const search = popover.querySelector<HTMLInputElement>("input.tendina-cerca");
      if (search && search.value) {
        search.value = "";
        filter(search);
      }

      // la × dentro la tendina e' anche lei un `popovertarget`: non e' una parola
      if (!invoker || !invoker.isConnected || popover.contains(invoker)) return;
      const rect = invoker.getBoundingClientRect();
      const viewport = document.documentElement;
      const margin = 16;
      const gap = 6;
      const width = Math.min(416, viewport.clientWidth - 2 * margin);
      const left = Math.min(Math.max(margin, rect.left), viewport.clientWidth - width - margin);
      const below = viewport.clientHeight - rect.bottom - gap - margin;
      const above = rect.top - gap - margin;
      const up = below < 240 && above > below;

      const style = popover.style;
      style.position = "absolute";
      style.inset = "auto";
      style.margin = "0";
      style.width = `${width}px`;
      style.left = `${left + window.scrollX}px`;
      style.maxHeight = `${Math.max(160, Math.min(480, up ? above : below))}px`;
      if (up) {
        // il fondo della tendina sopra la parola: `bottom` si misura dal fondo del
        // blocco iniziale, alto quanto lo schermo e fermo in cima al documento
        style.top = "auto";
        style.bottom = `${viewport.clientHeight - (rect.top + window.scrollY) + gap}px`;
      } else {
        style.bottom = "auto";
        style.top = `${rect.bottom + window.scrollY + gap}px`;
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("input", onInput);
    document.addEventListener("beforetoggle", onBeforeToggle, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("input", onInput);
      document.removeEventListener("beforetoggle", onBeforeToggle, true);
    };
  }, []);

  return null;
}
