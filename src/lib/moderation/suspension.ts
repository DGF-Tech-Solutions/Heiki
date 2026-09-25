/**
 * Stato di sospensione di un account.
 *
 * Vive in un file a parte e non fra le azioni di moderazione perche' lo legge
 * chi scrive un post o un commento: se stesse in un modulo "use server" ogni
 * export dovrebbe essere un'azione raggiungibile dal client, e questa e' una
 * funzione interna.
 *
 * Una sospensione non cancella nulla e non nasconde il profilo: toglie soltanto
 * la possibilita' di scrivere. Chi e' sospeso continua a leggere il sito - il
 * contrario sarebbe una punizione sproporzionata e spingerebbe solo a crearsi un
 * secondo account.
 */

import { and, desc, gt, isNull, or, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { suspensions } from "@/lib/db/schema";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    finoAl: (data: string) => `fino al ${data}`,
    aTempoIndeterminato: "a tempo indeterminato",
    motivo: (motivo: string) => ` Motivo: ${motivo}`,
    sospeso: (quando: string, motivo: string) =>
      `Il tuo account è sospeso ${quando} e non può pubblicare.${motivo}`,
  },
  en: {
    finoAl: (data: string) => `until ${data}`,
    aTempoIndeterminato: "indefinitely",
    motivo: (motivo: string) => ` Reason: ${motivo}`,
    sospeso: (quando: string, motivo: string) =>
      `Your account is suspended ${quando} and can't post.${motivo}`,
  },
});

export interface SuspensionState {
  active: boolean;
  reason?: string;
  /** null quando e' a tempo indeterminato */
  until?: Date | null;
}

/**
 * Una sospensione e' attiva se non e' stata revocata e non e' scaduta.
 * La scadenza si valuta qui e non con un lavoro periodico: senza processi
 * pianificati una sospensione a termine si spegnerebbe solo se qualcuno passasse
 * a spegnerla.
 */
export async function suspensionFor(userId: string): Promise<SuspensionState> {
  const row = await db.query.suspensions.findFirst({
    where: and(
      eq(suspensions.userId, userId),
      isNull(suspensions.liftedAt),
      or(isNull(suspensions.until), gt(suspensions.until, new Date())),
    ),
    orderBy: [desc(suspensions.createdAt)],
    columns: { reason: true, until: true },
  });

  if (!row) return { active: false };
  return { active: true, reason: row.reason, until: row.until };
}

/**
 * Messaggio da mostrare a chi prova a scrivere mentre e' sospeso.
 * Chi lo chiama da un'azione passa la lingua di `getLocale()`.
 */
export function suspensionMessage(state: SuspensionState, locale: Locale = "it"): string {
  const t = TESTI[locale];
  const when = state.until
    ? t.finoAl(state.until.toLocaleDateString(intlLocale(locale)))
    : t.aTempoIndeterminato;
  const reason = state.reason ? t.motivo(state.reason) : "";
  return t.sospeso(when, reason);
}
