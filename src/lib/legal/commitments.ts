/**
 * Gli impegni che i documenti legali prendono con chi legge, in un posto solo:
 * lo stesso numero compare in piu' pagine (Termini, Privacy, Copyright) e non
 * deve poter divergere.
 */

/**
 * L'eta' minima per avere un account: in Italia dai 14 anni si da' da soli il
 * consenso ai servizi online (art. 2-quinquies del Codice privacy). Sotto non
 * si apre un account: gestire il consenso dei genitori chiederebbe verifiche
 * che un sito come questo non puo' fare bene.
 */
export const MIN_AGE = 14;

/**
 * Entro quanti giorni lavorativi si risponde ai titolari dei diritti e si
 * tolgono i contenuti di Heiki di cui chiedono la rimozione. Scelta
 * dell'utente (25/10), sul modello dei 2-3 giorni delle procedure AGCOM.
 */
export const RIGHTS_RESPONSE_WORKING_DAYS = 2;

/** Entro quanto si risponde a una richiesta sui dati personali (art. 12, par. 3 GDPR). */
export const PRIVACY_RESPONSE_MONTHS = 1;

/**
 * Le copie di sicurezza del database che `npm run db:backup` tiene di serie
 * (scripts/backup-db.mts, `--tieni`): un dato cancellato sparisce anche da li'
 * quando la copia che lo contiene esce dalla rotazione.
 */
export const BACKUP_COPIES = 14;
