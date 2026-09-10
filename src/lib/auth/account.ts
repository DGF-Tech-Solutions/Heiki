/**
 * Costanti condivise fra le azioni sull'account e i moduli che le usano.
 *
 * Stanno in un file a parte per un vincolo preciso: da un modulo marcato
 * "use server" si possono esportare SOLO funzioni asincrone, perche' ogni
 * export diventa un punto raggiungibile dal client. Una costante esportata da
 * li' fa fallire la compilazione di produzione - e lo fa solo in produzione, il
 * che la rende una trappola: in sviluppo sembra funzionare.
 */

/** Parola da digitare per confermare l'eliminazione dell'account. */
export const DELETE_PHRASE = "ELIMINA";

/**
 * Lunghezza minima di una password.
 *
 * Dieci e non otto: senza un limite di tentativi condiviso fra piu' istanze del
 * server, la lunghezza e' la difesa che regge da sola.
 */
export const PASSWORD_MIN = 10;
