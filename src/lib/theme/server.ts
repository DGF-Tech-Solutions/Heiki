import { cookies } from "next/headers";
import { DEFAULT_THEME, isTheme, THEME_COOKIE, type Theme } from "./themes";

/**
 * Il tema di chi legge, dal cookie: il layout radice lo mette su `<html>`
 * prima che la pagina parta, cosi' il primo disegno e' gia' nei colori scelti,
 * senza un lampo di rosso prima del blu.
 *
 * Nessun try/catch attorno a cookies(), come in getLocale(): durante il
 * rendering Next usa proprio quell'eccezione per sapere che la pagina dipende
 * dalla richiesta.
 */
export async function getTheme(): Promise<Theme> {
  const valore = (await cookies()).get(THEME_COOKIE)?.value;
  return isTheme(valore) ? valore : DEFAULT_THEME;
}
