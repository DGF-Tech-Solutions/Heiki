/**
 * Un indirizzo `mailto:` con oggetto e testo gia' scritti, per chi segnala o
 * chiede una rimozione: parte dalla casella del gestore con tutti i campi da
 * riempire, e la richiesta arriva completa.
 *
 * Gli spazi diventano %20 e non «+» (come farebbe URLSearchParams): diversi
 * programmi di posta mostrano il «+» cosi' com'e', e il testo arriverebbe
 * pieno di segni.
 */
export function mailtoHref(email: string, subject?: string, body?: string): string {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}${parts.length > 0 ? `?${parts.join("&")}` : ""}`;
}
