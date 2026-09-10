/**
 * Diritti d'uso legati al pagamento.
 *
 * L'abbonamento e' un'ENTITLEMENT, non un ruolo. Sono due assi separati e
 * restano separati: `users.role` decide chi puo' pubblicare e moderare,
 * `subscriptions` decide cosa hai pagato. Se fossero la stessa cosa, cambiare il
 * piano commerciale toccherebbe i permessi redazionali - e un giorno qualcuno
 * comprerebbe il diritto di pubblicare.
 *
 * Cosa si vende: presentazione. Cornici, sfondi, accenti, la scheda
 * condivisibile. Cosa NON si vende: badge, livello, posizione nel feed, spunte
 * di verifica. Sono le cose che dicono agli altri quanto puoi fidarti di una
 * persona, e venderle svuoterebbe il resto del sito.
 */

import { and, eq, gt, isNull, or } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";

export interface Entitlement {
  /** true = ha accesso ai cosmetici premium */
  premium: boolean;
  status: "none" | "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED";
  /** fine del periodo pagato; null quando non c'e' un abbonamento */
  renewsAt: Date | null;
}

const NONE: Entitlement = { premium: false, status: "none", renewsAt: null };

/**
 * Un abbonamento vale se e' attivo o in prova e il periodo non e' scaduto.
 *
 * PAST_DUE non da' accesso ma non e' "none": e' la differenza fra "non hai mai
 * pagato" e "il rinnovo non e' andato a buon fine", e chi legge la propria
 * pagina deve poter distinguere i due casi.
 */
export async function entitlementFor(userId: string): Promise<Entitlement> {
  if (!(await databaseReachable())) return NONE;

  const row = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    columns: { status: true, currentPeriodEnd: true },
  });
  if (!row) return NONE;

  const live =
    (row.status === "ACTIVE" || row.status === "TRIALING") &&
    (row.currentPeriodEnd === null || row.currentPeriodEnd > new Date());

  return { premium: live, status: row.status, renewsAt: row.currentPeriodEnd ?? null };
}

/** Elenco dei diritti attivi in una sola query: usato dalle pagine di elenco. */
export async function premiumUserIds(candidates: readonly string[]): Promise<Set<string>> {
  if (candidates.length === 0 || !(await databaseReachable())) return new Set();

  const rows = await db.query.subscriptions.findMany({
    where: and(
      or(eq(subscriptions.status, "ACTIVE"), eq(subscriptions.status, "TRIALING")),
      or(isNull(subscriptions.currentPeriodEnd), gt(subscriptions.currentPeriodEnd, new Date())),
    ),
    columns: { userId: true },
  });

  const active = new Set(rows.map((row) => row.userId));
  return new Set(candidates.filter((id) => active.has(id)));
}
