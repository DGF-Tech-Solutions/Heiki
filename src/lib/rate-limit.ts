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

import { createHash } from "node:crypto";
import type { Locale } from "@/lib/i18n/locale";

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
  /**
   * L'accesso e' il bersaglio piu' ovvio: pochi tentativi, finestra lunga.
   * Dall'11/10 la chiave e' email + indirizzo: prima era la sola email, e
   * chiunque poteva tenere fuori una persona sbagliando apposta la sua password
   * otto volte ogni cinque minuti.
   */
  login: { limit: 8, windowSeconds: 300 },
  /**
   * Lo stesso controllo dentro Auth.js, per chi chiama direttamente
   * /api/auth/callback/credentials. Un po' piu' largo di `login`: chi passa
   * dal modulo incontra prima quello, col messaggio che dice quanto aspettare.
   */
  credentials: { limit: 10, windowSeconds: 300 },
  /**
   * Un indirizzo che prova molte email diverse: una password comune provata su
   * tanti account. Largo, perche' dietro un indirizzo ci puo' essere una scuola.
   */
  credentialsIp: { limit: 40, windowSeconds: 900 },
  /**
   * Un account provato da molti indirizzi. Largo apposta: tiene fermo chi ha
   * una rete di macchine, e una persona che sbaglia non ci arriva mai.
   */
  credentialsAccount: { limit: 60, windowSeconds: 3600 },
  /** La registrazione crea righe: si limita per non farne creare a macchina. */
  register: { limit: 5, windowSeconds: 3600 },
  /** Account creati a macchina cambiando email a ogni giro. */
  registerIp: { limit: 10, windowSeconds: 3600 },
  /** Il recupero manda email: un limite basso protegge il destinatario. */
  passwordReset: { limit: 3, windowSeconds: 3600 },
  passwordResetIp: { limit: 10, windowSeconds: 3600 },
  /** Pubblicare troppo in fretta e' spam, anche in buona fede. */
  post: { limit: 10, windowSeconds: 3600 },
  comment: { limit: 30, windowSeconds: 3600 },
  report: { limit: 20, windowSeconds: 3600 },
  /** Un voto e' un clic: il tetto e' alto, ferma solo chi vota a macchina. */
  vote: { limit: 120, windowSeconds: 600 },
  /** Seguire e smettere manda una notifica a ogni giro: senza tetto e' un modo di molestare. */
  follow: { limit: 30, windowSeconds: 600 },
  /**
   * L'account di gioco si salva da solo mentre si muovono gli slider (dopo un
   * attimo di pausa): il tetto ferma un ciclo impazzito, non una persona.
   */
  accountSave: { limit: 60, windowSeconds: 600 },
  /** Chiedere l'eroe del giorno, cambiarlo, caricare una schermata. */
  verification: { limit: 12, windowSeconds: 3600 },
  /** Valutare gli eroi (PvE, PvP e consigli). */
  heroRating: { limit: 30, windowSeconds: 600 },
  /** Salvataggio e creazione tier list per l'account. */
  tierListSave: { limit: 30, windowSeconds: 600 },
} as const satisfies Record<string, RateLimitRule>;

export type RuleName = keyof typeof RULES;

/**
 * Oltre questo numero di chiavi si buttano le piu' vecchie. Senza un tetto, chi
 * manda tentativi con email sempre diverse riempirebbe la memoria del processo
 * (le azioni accettano fino a 4 MB per richiesta, e la chiave era il testo
 * intero: l'11/10 bastavano poche centinaia di richieste).
 */
const MAX_KEYS = 50_000;

/** La chiave salvata e' un'impronta di lunghezza fissa, qualunque cosa arrivi. */
function storedKey(rule: RuleName, key: string): string {
  return `${rule}:${createHash("sha256").update(key).digest("base64url")}`;
}

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
  const compositeKey = storedKey(rule, key);

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
  // tolta e rimessa: la Map tiene l'ordine d'inserimento, e cosi' le chiavi in
  // fondo sono quelle usate da poco
  store().delete(compositeKey);
  store().set(compositeKey, { hits: recent });

  // Pulizia opportunistica: senza, la mappa crescerebbe per sempre in un
  // processo di lunga durata.
  if (store().size > MAX_KEYS) sweep(now);

  return { allowed: true, remaining: limit - recent.length, retryAfter: 0 };
}

function sweep(now: number): void {
  const map = store();
  // prima le voci scadute, ognuna con la finestra della sua regola
  for (const [key, entry] of map) {
    const rule = RULES[key.slice(0, key.indexOf(":")) as RuleName];
    const windowMs = (rule?.windowSeconds ?? 3600) * 1000;
    if (entry.hits.every((at) => now - at >= windowMs)) map.delete(key);
  }
  // poi, se non basta, le meno recenti fino a tre quarti del tetto: la pulizia
  // costa un giro della mappa, e cosi' non si ripete a ogni richiesta
  if (map.size > MAX_KEYS) {
    let excess = map.size - Math.floor(MAX_KEYS * 0.75);
    for (const key of map.keys()) {
      if (excess-- <= 0) break;
      map.delete(key);
    }
  }
}

/** Messaggio pronto da mostrare, nella lingua del sito e senza gergo. */
export function retryMessage(result: RateLimitResult, locale: Locale = "it"): string {
  if (result.retryAfter >= 60) {
    const minutes = Math.ceil(result.retryAfter / 60);
    return locale === "en"
      ? `Too many attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`
      : `Troppi tentativi. Riprova fra ${minutes} ${minutes === 1 ? "minuto" : "minuti"}.`;
  }
  return locale === "en"
    ? `Too many attempts. Try again in ${result.retryAfter} seconds.`
    : `Troppi tentativi. Riprova fra ${result.retryAfter} secondi.`;
}

/** Azzera i contatori. Solo per i test. */
export function resetRateLimits(): void {
  globalThis.__gachazoneRateLimit = new Map();
}
