/**
 * I temi del sito: varianti di colore che sceglie chi legge (11/10, l'utente:
 * «giusto delle varianti di colore, niente di piu'»). Cambiano fondo, grigi,
 * bordi e accento; forme, caratteri e impaginazione restano quelli.
 *
 * Tutti SCURI, di proposito: i colori del gioco (le tinte delle abilita', gli
 * attributi, le icone) sono nati per un fondo nero, e un tema chiaro andrebbe
 * rifatto colore per colore (vedi game-color.ts).
 *
 * I COLORI stanno in globals.css e solo li': il tema predefinito e' il blocco
 * `@theme`, ogni altro e' un blocco `:root[data-theme="…"]` che ridefinisce gli
 * stessi token. Qui c'e' quello che il CSS non sa dire: quali temi esistono,
 * quale vale senza scelta, il cookie che la ricorda.
 *
 * Due valori per tema sono ripetuti in `THEME_COLORS`, perche' servono fuori dal
 * CSS: il fondo va in `<meta name="theme-color">` e nel manifest (la barra del
 * browser sul telefono), l'accento disegna il campione nel selettore, che deve
 * mostrare i colori di un tema mentre ne e' acceso un altro. Una copia puo'
 * divergere: il test (__tests__/themes.test.ts) legge globals.css e si ferma
 * se anche un solo valore e' diverso, o se un tema c'e' da una parte sola.
 *
 * Questo modulo non importa niente del server ne' del browser, come locale.ts.
 */

export const THEMES = ["persona", "notte", "giada", "viola", "ambra"] as const;

export type Theme = (typeof THEMES)[number];

/** Senza cookie il sito e' com'era: il rosso «Persona». */
export const DEFAULT_THEME: Theme = "persona";

/** Il cookie che ricorda la scelta: tecnico, lo imposta chi legge scegliendo un tema. */
export const THEME_COOKIE = "tema";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/** Fondo (`--color-paper`) e accento (`--color-brand`) di ogni tema: la copia controllata, vedi sopra. */
export const THEME_COLORS: Readonly<Record<Theme, { readonly paper: string; readonly brand: string }>> = {
  persona: { paper: "#0b0a0a", brand: "#e61421" },
  notte: { paper: "#080a10", brand: "#1c64e8" },
  giada: { paper: "#070b0a", brand: "#0b836b" },
  viola: { paper: "#0a0910", brand: "#8b51ef" },
  ambra: { paper: "#0c0a07", brand: "#c5500d" },
};
