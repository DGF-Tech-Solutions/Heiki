/**
 * Limite di tentativi.
 *
 * Senza, il modulo di accesso e' una porta aperta: si possono provare migliaia
 * di password al secondo, e la richiesta di recupero password diventa un modo
 * per inondare di email la casella di qualcun altro.
 *
 * L'archivio e' in memoria del processo. E' un limite dichiarato: con piu'
 * istanze del server ognuna conta per conto proprio, quindi il tetto reale e'
 * il tetto per il numero di istanze. Va bene per fermare un attacco banale, non
 * uno distribuito - per quello serve un archivio condiviso (Redis), e il punto
 * da cambiare e' solo questo file.
 *
 * Si e' preferito questo a nessun limite: un limite imperfetto ferma il 99% dei
 * tentativi automatici, l'assenza di limite non ne ferma nessuno.
 */

interface Window {
  /** istanti dei tentativi, in millisecondi */
  hits: number[];
}

declare global {
  var __gachazoneRateLimit: Map<string, Window> | undefined;
}

function store(): Map<string, Window> {
  if (!globalThis.__gachazoneRateLimit) {
    globalThis.__gachazoneRateLimit = new Map();
  }
  return globalThis.__gachazoneRateLimit;
}

export interface RateLimitRule {
  /** tentativi consentiti nella finestra */
  limit: number;
  /** ampiezza della finestra in secondi */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** tentativi ancora disponibili */
  remaining: number;
  /** secondi da attendere prima del prossimo tentativo utile */
  retryAfter: number;
}

/** Regole usate nel sito. Stare in un posto solo le rende confrontabili. */
export const RULES = {
  /** L'accesso e' il bersaglio piu' ovvio: pochi tentativi, finestra lunga. */
  login: { limit: 8, windowSeconds: 300 },
  /** La registrazione crea righe: si limita per non farne creare a macchina. */
  register: { limit: 5, windowSeconds: 3600 },
  /** Il recupero manda email: un limite basso protegge il destinatario. */
  passwordReset: { limit: 3, windowSeconds: 3600 },
  /** Pubblicare troppo in fretta e' spam, anche in buona fede. */
  post: { limit: 10, windowSeconds: 3600 },
  comment: { limit: 30, windowSeconds: 3600 },
  report: { limit: 20, windowSeconds: 3600 },
} as const satisfies Record<string, RateLimitRule>;

export type RuleName = keyof typeof RULES;

/**
 * Registra un tentativo e dice se e' consentito.
 *
 * Finestra scorrevole invece che a intervalli fissi: con gli intervalli fissi si
 * puo' consumare l'intero limite negli ultimi istanti di uno e ripetere subito
 * all'inizio del successivo, ottenendo il doppio dei tentativi.
 */
export function rateLimit(rule: RuleName, key: string): RateLimitResult {
  const { limit, windowSeconds } = RULES[rule];
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const compositeKey = `${rule}:${key}`;

  const entry = store().get(compositeKey) ?? { hits: [] };
  const recent = entry.hits.filter((at) => now - at < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    store().set(compositeKey, { hits: recent });
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  recent.push(now);
  store().set(compositeKey, { hits: recent });

  // Pulizia opportunistica: senza, la mappa crescerebbe per sempre in un
  // processo di lunga durata.
  if (store().size > 5000) sweep(now);

  return { allowed: true, remaining: limit - recent.length, retryAfter: 0 };
}

function sweep(now: number): void {
  const longest = Math.max(...Object.values(RULES).map((rule) => rule.windowSeconds)) * 1000;
  for (const [key, entry] of store()) {
    if (entry.hits.every((at) => now - at >= longest)) store().delete(key);
  }
}

/** Messaggio pronto da mostrare, in italiano e senza gergo. */
export function retryMessage(result: RateLimitResult): string {
  if (result.retryAfter >= 60) {
    const minutes = Math.ceil(result.retryAfter / 60);
    return `Troppi tentativi. Riprova fra ${minutes} ${minutes === 1 ? "minuto" : "minuti"}.`;
  }
  return `Troppi tentativi. Riprova fra ${result.retryAfter} secondi.`;
}

/** Azzera i contatori. Solo per i test. */
export function resetRateLimits(): void {
  globalThis.__gachazoneRateLimit = new Map();
}
