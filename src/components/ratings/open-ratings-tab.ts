/**
 * Il clic sul badge delle valutazioni (in testa alla scheda eroe): accende la
 * scheda Valutazioni sulla stessa pagina invece di ricaricarla.
 *
 * Una funzione a parte, e senza React, perche' i test la chiamano con un
 * documento finto: prima il test ne ricopiava il corpo, e passava anche se il
 * componente cambiava.
 *
 * Il collegamento resta un <a href="?scheda=valutazioni"> vero: senza
 * JavaScript, o con un clic che chiede una scheda nuova, fa il suo lavoro.
 */

/** Gli id che mette HeroTabs: il radio della scheda e il contenitore delle schede. */
export const RATINGS_RADIO_ID = "schede-valutazioni";
export const TABS_ID = "schede";

/** Quello che serve dell'evento: React.MouseEvent lo soddisfa, e anche un oggetto dei test. */
export interface TabLinkClick {
  readonly button: number;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}

/** Quello che serve del documento. */
export interface TabDocument {
  getElementById(id: string): HTMLElement | null;
}

export function openRatingsTab(event: TabLinkClick, doc: TabDocument = document): void {
  // Ctrl/Cmd/Shift/Alt+clic o un tasto che non e' il sinistro: chi li usa vuole
  // la scheda nuova, la finestra nuova o lo scaricamento, e fermarli toglieva
  // quella scelta. Li lascia al browser, come fa next/link.
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  // senza le schede (una pagina che non le ha) il collegamento fa il suo giro normale
  const radio = doc.getElementById(RATINGS_RADIO_ID) as HTMLInputElement | null;
  if (!radio) return;

  event.preventDefault();
  if (!radio.checked) {
    radio.checked = true;
    // spuntare il radio da codice non lancia `change`: HeroTabUrl lo ascolta
    // per scrivere ?scheda=valutazioni nell'indirizzo
    radio.dispatchEvent(new Event("change", { bubbles: true }));
  }
  // il fuoco segue la scheda, cosi' la tastiera riparte da li' (le frecce
  // cambiano scheda). preventScroll: il salto immediato verso il radio
  // litigherebbe con lo scorrimento morbido qui sotto, e la pagina rimbalzerebbe
  radio.focus({ preventScroll: true });
  doc.getElementById(TABS_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
