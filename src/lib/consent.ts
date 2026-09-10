/**
 * Consenso ai cookie.
 *
 * La scelta vive nel browser e non sul server: e' una preferenza del
 * dispositivo, non un dato dell'account, e trattarla come tale evita di dover
 * chiedere il consenso... per registrare il consenso.
 *
 * Tre stati e non due. "Non ha ancora scelto" e' diverso da "ha rifiutato": nel
 * primo caso il banner va mostrato, nel secondo no. Confonderli significa
 * riproporre il banner a chi ha gia' detto no, che e' esattamente il
 * comportamento che la gente odia.
 */

export const CONSENT_KEY = "gachazone:cookie-consent";

export type ConsentState = "unset" | "granted" | "denied";

export interface ConsentRecord {
  state: Exclude<ConsentState, "unset">;
  /** quando e' stata fatta la scelta: serve a riproporre il banner se le
   *  categorie di cookie cambiano */
  decidedAt: string;
  version: number;
}

/** Versione delle categorie: alzandola si richiede di nuovo il consenso. */
export const CONSENT_VERSION = 1;

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";

  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return "unset";

    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== CONSENT_VERSION) return "unset";
    return parsed.state === "granted" || parsed.state === "denied" ? parsed.state : "unset";
  } catch {
    // Archiviazione non disponibile (finestra privata, impostazioni del
    // browser): si tratta come "non ha scelto" e non si installa niente.
    return "unset";
  }
}

export function writeConsent(state: Exclude<ConsentState, "unset">): void {
  if (typeof window === "undefined") return;

  const record: ConsentRecord = {
    state,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Se non si puo' ricordare la scelta, il banner ricomparira'. Meglio
    // insistere che installare cookie senza permesso.
  }
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* niente da fare */
  }
}
