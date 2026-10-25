/**
 * Per quanto il sito tiene i dati che non vivono e muoiono con l'account.
 *
 * Fino al 25/10 segnalazioni chiuse, registro della moderazione, sospensioni
 * finite, notifiche, richieste di verifica e versioni vecchie delle guide
 * restavano per sempre: il GDPR vuole una durata (art. 5, par. 1, lett. e) e
 * l'informativa deve dirla. Scelta dell'utente: durate fisse, e una pulizia che
 * le applica da sola (./retention-job.ts). L'informativa e la pulizia leggono
 * gli stessi numeri da qui: cambiarne uno cambia tutte e due.
 *
 * Le durate sono quelle proposte all'utente sulla base delle linee guida
 * (registri di sicurezza e moderazione 6-24 mesi): abbastanza per gestire una
 * contestazione o riconoscere chi ripete una violazione, non di piu'.
 */

export const RETENTION = {
  /** notifiche, lette o no, dalla data della notifica */
  notificationsMonths: 12,
  /** segnalazioni gia' chiuse (risolte o archiviate), dalla data della segnalazione */
  closedReportsMonths: 12,
  /** registro delle azioni di moderazione, dalla data dell'azione */
  moderationLogMonths: 24,
  /** sospensioni finite (scadute o revocate), dalla fine */
  endedSuspensionsMonths: 24,
  /** schermata di verifica su cui nessun moderatore ha deciso, dall'invio */
  pendingScreenshotDays: 30,
  /** richieste di verifica chiuse: esito, eroe del giorno, impronta della schermata */
  verificationHistoryMonths: 24,
  /** richieste di recupero della password (valgono un'ora) */
  passwordResetDays: 30,
  /** versioni precedenti delle guide */
  guideRevisionsMonths: 24,
  /**
   * richieste arrivate per email (privacy, segnalazioni, titolari dei diritti),
   * dalla chiusura: queste non le cancella il codice, stanno nella casella del
   * gestore, che si impegna a farlo
   */
  emailRequestsMonths: 24,
} as const;

/** Lo stesso giorno di N mesi prima, in UTC (il 31 diventa l'ultimo giorno del mese). */
export function monthsBefore(now: Date, months: number): Date {
  const result = new Date(now.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() - months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

export function daysBefore(now: Date, days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

/** I confini: cio' che e' piu' vecchio di questi istanti si cancella. */
export interface RetentionCutoffs {
  notifications: Date;
  closedReports: Date;
  moderationLog: Date;
  endedSuspensions: Date;
  pendingScreenshots: Date;
  verificationHistory: Date;
  passwordResets: Date;
  guideRevisions: Date;
}

export function retentionCutoffs(now: Date): RetentionCutoffs {
  return {
    notifications: monthsBefore(now, RETENTION.notificationsMonths),
    closedReports: monthsBefore(now, RETENTION.closedReportsMonths),
    moderationLog: monthsBefore(now, RETENTION.moderationLogMonths),
    endedSuspensions: monthsBefore(now, RETENTION.endedSuspensionsMonths),
    pendingScreenshots: daysBefore(now, RETENTION.pendingScreenshotDays),
    verificationHistory: monthsBefore(now, RETENTION.verificationHistoryMonths),
    passwordResets: daysBefore(now, RETENTION.passwordResetDays),
    guideRevisions: monthsBefore(now, RETENTION.guideRevisionsMonths),
  };
}
