import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./locale";

/**
 * La lingua di chi legge, dal cookie: per pagine, layout, metadati e azioni.
 *
 * Nessun try/catch attorno a cookies(): durante il rendering Next usa proprio
 * quell'eccezione per sapere che la pagina dipende dalla richiesta, e
 * inghiottirla la farebbe trattare come statica.
 */
export async function getLocale(): Promise<Locale> {
  const valore = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(valore) ? valore : DEFAULT_LOCALE;
}
