/**
 * Handle e nomi che un utente non puo' prendersi.
 *
 * Fino all'11/10 chiunque poteva chiamarsi `admin`, `moderatore` o
 * `eliminato-1a2b3c4d` (il segnaposto che prende un account cancellato), e
 * scriversi «Amministratore» come nome visualizzato con caratteri invisibili o
 * di direzione del testo in mezzo. Post, commenti e notifiche mostrano il nome
 * visualizzato: era il modo piu' semplice di fingersi lo staff.
 *
 * Modulo puro: lo usano registrazione, profilo e gli account creati da OAuth.
 */

const RESERVED = new Set([
  "admin", "administrator", "amministratore", "amministrazione", "root", "sistema", "system",
  "moderatore", "moderatori", "moderator", "moderators", "mod", "mods", "staff", "team",
  "supporto", "support", "aiuto", "help", "assistenza", "sicurezza", "security",
  "heiki", "heiki-app", "heiki_app", "gachazone", "gacha-zone", "gacha_zone", "ufficiale", "official", "netmarble",
  "eliminato", "deleted", "anonimo", "anonymous", "utente", "user", "ospite", "guest",
  "null", "undefined", "api", "www", "redazione", "editor", "noreply", "no-reply",
]);

/** Prefissi riservati: `eliminato-` e' il segnaposto degli account cancellati. */
const RESERVED_PREFIXES = ["eliminato-", "deleted-", "admin-", "mod-", "staff-", "heiki-", "gachazone-"];

export function isReservedHandle(handle: string): boolean {
  const value = handle.trim().toLowerCase();
  return RESERVED.has(value) || RESERVED_PREFIXES.some((prefix) => value.startsWith(prefix));
}

/**
 * Caratteri di controllo e di formato (direzione del testo, larghezza zero,
 * a capo): in un nome non servono a niente di onesto.
 */
const INVISIBLE = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u;

/** Parole che fanno sembrare un nome quello dello staff. */
const STAFF_WORDS = /\b(admin|administrator|amministrat\w*|moderat\w*|staff|heiki|gachazone|supporto|support)\b/i;

export type DisplayNameProblem = "invisibile" | "staff";

/** Perche' un nome visualizzato non va, o null se va bene. */
export function displayNameProblem(name: string): DisplayNameProblem | null {
  if (INVISIBLE.test(name)) return "invisibile";
  if (STAFF_WORDS.test(name.normalize("NFKC"))) return "staff";
  return null;
}

/**
 * `.invalid` (RFC 2606) e' il dominio dei segnaposto degli account cancellati:
 * chi se ne prendeva uno prima della vittima ne bloccava la cancellazione.
 */
export function isReservedEmail(email: string): boolean {
  return /\.invalid$/i.test(email.trim());
}
