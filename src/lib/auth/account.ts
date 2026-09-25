/**
 * Costanti condivise fra le azioni sull'account e i moduli che le usano.
 *
 * Stanno in un file a parte per un vincolo preciso: da un modulo marcato
 * "use server" si possono esportare SOLO funzioni asincrone, perche' ogni
 * export diventa un punto raggiungibile dal client. Una costante esportata da
 * li' fa fallire la compilazione di produzione - e lo fa solo in produzione, il
 * che la rende una trappola: in sviluppo sembra funzionare.
 */

import type { Bilingual, Locale } from "@/lib/i18n/locale";

/** Parola da digitare per confermare l'eliminazione dell'account. */
export const DELETE_PHRASE = "ELIMINA";

/**
 * La stessa parola nelle due lingue: chi legge in inglese scrive DELETE.
 * L'azione le accetta entrambe, perche' la lingua puo' cambiare fra il momento
 * in cui il modulo si disegna e quello in cui si invia.
 */
export const DELETE_PHRASES: Bilingual = { it: DELETE_PHRASE, en: "DELETE" };

export function deletePhrase(locale: Locale): string {
  return DELETE_PHRASES[locale];
}

/**
 * Lunghezza minima di una password.
 *
 * Dieci e non otto: senza un limite di tentativi condiviso fra piu' istanze del
 * server, la lunghezza e' la difesa che regge da sola.
 */
export const PASSWORD_MIN = 10;
