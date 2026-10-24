/**
 * Una misura scritta nel JavaScript, in rem (24/10).
 *
 * Il CSS esce gia' in rem (postcss.config.mjs), e l'interfaccia cresce con la
 * base che `html` calcola dallo schermo (globals.css). Quello che il CSS non
 * vede no: un `style={{ width: 18 }}` o la misura di un'icona restano 18px
 * mentre il testo accanto cresce del 25%. Qui si scrivono in px, come nel
 * resto del codice, e diventano rem.
 */
export function rem(px: number): string {
  return `${px / 16}rem`;
}

/**
 * Quanti px vale adesso 1rem: per i conti in JavaScript che devono stare
 * allineati a una misura del CSS (la colonna ferma sotto le schede, a 135px
 * scritti nel CSS che sullo schermo largo sono di piu'). Nel server, 16.
 */
export function remPx(): number {
  if (typeof document === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}
