/**
 * Quello che il server fa da solo all'avvio (Next.js chiama `register` una volta
 * per processo).
 *
 * Oggi una cosa: la pulizia dei dati scaduti (src/lib/legal/retention-job.ts),
 * con le durate che l'informativa privacy promette. Solo nel runtime Node e solo
 * in produzione: durante `next build` non deve partire niente, e nel server di
 * sviluppo una cancellazione che parte da sola sorprenderebbe chi prova il sito
 * sul database locale. Per provarla a mano c'e' `applyRetention`.
 *
 * Next compila questo file anche per l'Edge. L'import va DENTRO un `if` con la
 * condizione su NEXT_RUNTIME, che webpack sostituisce con una costante e scarta
 * intero per l'Edge: con un `return` anticipato e l'import dopo, webpack lo
 * risolveva lo stesso e la build si fermava sui moduli di Node del driver di
 * Postgres (net, tls, crypto: trovato dall'altra sessione il 25/10).
 */

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.NODE_ENV !== "production" || process.env.NEXT_PHASE === "phase-production-build") return;
    const { scheduleRetention } = await import("@/lib/legal/retention-job");
    scheduleRetention();
  }
}
