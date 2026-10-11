/**
 * Le regole delle password, uguali in registrazione, cambio e recupero.
 *
 * bcrypt usa solo i primi 72 BYTE: fino all'11/10 il sito accettava 200
 * caratteri (fino a 800 byte con le lettere accentate), e tutto quello che
 * stava dopo il 72° byte non contava. Due password diverse solo in fondo erano
 * la stessa password, senza che nessuno lo sapesse. Ora oltre i 72 byte la
 * password si rifiuta, con un messaggio che lo dice.
 */

export const PASSWORD_MIN_CHARS = 10;
export const PASSWORD_MAX_BYTES = 72;

/** Un tetto largo per l'accesso: oltre, e' spazzatura e non vale un bcrypt. */
export const LOGIN_MAX_CHARS = 1024;

/** Il tetto delle email (RFC 5321): oltre non e' un indirizzo vero. */
export const EMAIL_MAX_CHARS = 254;

export function passwordTooLong(password: string): boolean {
  return new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES;
}
