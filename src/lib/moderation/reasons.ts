/**
 * Motivi di segnalazione.
 *
 * File separato dalle azioni per lo stesso vincolo che vale altrove: da un
 * modulo "use server" si esportano solo funzioni asincrone, e questo e' un
 * elenco. Serve sia al modulo nel browser (per disegnare la tendina) sia
 * all'azione sul server (per validare), quindi deve stare dove entrambi lo
 * possono importare.
 *
 * L'elenco e' corto di proposito. Una tassonomia di venti voci sembra precisa e
 * produce segnalazioni peggiori: chi segnala non legge venti opzioni, sceglie la
 * prima plausibile, e chi modera perde l'informazione che l'elenco doveva dare.
 */

export const REPORT_REASONS = [
  { id: "spam", label: "Spam o pubblicità" },
  { id: "abuso", label: "Insulti o molestie" },
  { id: "dati", label: "Dati personali di qualcuno" },
  { id: "numeri", label: "Numeri dichiarati falsi" },
  { id: "copyright", label: "Materiale protetto" },
  { id: "altro", label: "Altro" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["id"];

export const REPORT_REASON_IDS = REPORT_REASONS.map((reason) => reason.id) as [
  ReportReason,
  ...ReportReason[],
];

/** Etichetta di un motivo, anche se arriva da una versione precedente. */
export function reportReasonLabel(id: string): string {
  return REPORT_REASONS.find((reason) => reason.id === id)?.label ?? id;
}
