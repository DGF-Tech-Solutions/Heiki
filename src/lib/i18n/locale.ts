/**
 * Le lingue del sito: italiano e inglese.
 *
 * Scelta dell'utente (16/09): il sito si legge in italiano o in inglese, con
 * tutti gli elementi tradotti. La lingua sta in un cookie e non nell'indirizzo:
 * le pagine si costruiscono gia' a ogni richiesta, perche' l'intestazione legge
 * la sessione, quindi il cookie non toglie niente. Un segmento /en invece
 * avrebbe spostato tutto l'albero delle pagine sotto `[lang]` e riscritto piu'
 * di cento collegamenti, e i percorsi resterebbero comunque in italiano.
 * Senza cookie il sito e' in italiano, come prima.
 *
 * Questo modulo non importa niente del server ne' del browser: lo usano tutti,
 * pagine, componenti client, azioni e dati.
 */

export const LOCALES = ["it", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "it";

/** Il cookie che ricorda la scelta: tecnico, lo imposta chi legge premendo IT o EN. */
export const LOCALE_COOKIE = "lingua";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Un testo, o qualunque valore, nelle due lingue. */
export type Bilingual<T = string> = Readonly<Record<Locale, T>>;

/**
 * I testi di un componente nelle due lingue. L'inglese deve avere esattamente
 * le voci dell'italiano: se ne manca una, o ce n'e' una in piu', il typecheck
 * si ferma. Le voci possono essere funzioni, per i testi con dentro un numero.
 *
 *   const TESTI = testi({
 *     it: { titolo: "Eroi", quanti: (n: number) => `${n} eroi` },
 *     en: { titolo: "Heroes", quanti: (n: number) => `${n} heroes` },
 *   });
 *   const t = TESTI[locale];
 */
export function testi<T>(valori: { it: T; en: NoInfer<T> }): Bilingual<T> {
  return valori;
}

/**
 * Un'etichetta dei dati del gioco, `{it, en}` con null dove la fonte non ce
 * l'ha: nella lingua chiesta, e se manca nell'altra. La decifratura dei testi
 * del client fallisce su righe diverse nelle due lingue, e un nome nell'altra
 * lingua e' meglio di un buco nella pagina.
 */
export function inLingua(
  valore: { readonly it: string | null; readonly en: string | null } | null | undefined,
  locale: Locale,
): string | null {
  if (!valore) return null;
  return locale === "en" ? (valore.en ?? valore.it) : (valore.it ?? valore.en);
}

/** Il tag da passare a Intl, per date, numeri e ordinamenti. */
export function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-US" : "it-IT";
}

/** Il codice della lingua per Open Graph. */
export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "it_IT";
}
