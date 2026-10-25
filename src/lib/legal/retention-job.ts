/**
 * La pulizia che applica le durate di ./retention.ts al database.
 *
 * Gira da sola sul server di produzione (src/instrumentation.ts): un minuto dopo
 * l'avvio e poi una volta al giorno. Ogni passo e' idempotente, quindi due
 * copie del server che puliscono insieme non fanno danni: la seconda non trova
 * piu' niente. Tutto in una transazione: o si applica tutta la regola o niente.
 *
 * Non tocca account, profili, contenuti pubblicati, voti, valutazioni e tier
 * list: quelli vivono finche' vive l'account (o finche' la persona li toglie).
 */

import { and, eq, inArray, isNotNull, isNull, lt, ne, or } from "drizzle-orm";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import {
  accounts,
  guideRevisions,
  modActions,
  notifications,
  passwordResetTokens,
  powerVerifications,
  reports,
  suspensions,
  verificationScreenshots,
} from "@/lib/db/schema";
import { retentionCutoffs, type RetentionCutoffs } from "./retention";

/** La transazione che riceve `db.transaction`: i passi girano dentro una. */
export type RetentionTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Quante righe ha tolto (o svuotato) ogni passo. */
export interface RetentionReport {
  expiredVerifications: number;
  verificationHistory: number;
  notifications: number;
  closedReports: number;
  moderationLog: number;
  endedSuspensions: number;
  passwordResets: number;
  guideRevisions: number;
  oauthTokens: number;
}

/** Applica le durate. Senza database non fa niente e restituisce null. */
export async function applyRetention(now: Date = new Date()): Promise<RetentionReport | null> {
  if (!isDatabaseConfigured() || !(await databaseReachable())) return null;
  const cut = retentionCutoffs(now);
  return db.transaction((tx) => retentionSteps(tx, cut));
}

/**
 * I passi, dentro una transazione data da fuori: cosi' la prova sul database
 * li fa girare in una transazione che poi annulla, senza toccare altro.
 */
export async function retentionSteps(tx: RetentionTx, cut: RetentionCutoffs): Promise<RetentionReport> {
  // Una schermata su cui nessuno ha deciso: come un ritiro della richiesta
  // (cancelVerificationAction), la schermata si cancella e la richiesta si
  // chiude. La persona puo' chiederne un'altra.
  const expired = await tx
    .select({ id: powerVerifications.id })
    .from(powerVerifications)
    .where(and(eq(powerVerifications.status, "PENDING"), lt(powerVerifications.submittedAt, cut.pendingScreenshots)));
  const expiredIds = expired.map((row) => row.id);
  if (expiredIds.length > 0) {
    await tx.delete(verificationScreenshots).where(inArray(verificationScreenshots.verificationId, expiredIds));
    await tx.update(powerVerifications).set({ status: "CANCELLED" }).where(inArray(powerVerifications.id, expiredIds));
  }

  // Le richieste chiuse, con l'impronta della schermata: oltre la durata la
  // stessa immagine non si riconosce piu', ed e' il prezzo voluto. La classe
  // verificata resta, perche' sta nell'account di gioco e non qui; le notifiche
  // legate se ne vanno in cascata.
  const history = await tx
    .delete(powerVerifications)
    .where(and(ne(powerVerifications.status, "PENDING"), lt(powerVerifications.createdAt, cut.verificationHistory)))
    .returning({ id: powerVerifications.id });

  const oldNotifications = await tx
    .delete(notifications)
    .where(lt(notifications.createdAt, cut.notifications))
    .returning({ id: notifications.id });

  // le segnalazioni aperte restano finche' un moderatore non le chiude
  const oldReports = await tx
    .delete(reports)
    .where(and(ne(reports.status, "OPEN"), lt(reports.createdAt, cut.closedReports)))
    .returning({ id: reports.id });

  const oldActions = await tx
    .delete(modActions)
    .where(lt(modActions.createdAt, cut.moderationLog))
    .returning({ id: modActions.id });

  // finita = revocata, o scaduta da sola; quelle a tempo indeterminato e non
  // revocate sono ancora in corso e restano
  const oldSuspensions = await tx
    .delete(suspensions)
    .where(
      or(
        lt(suspensions.liftedAt, cut.endedSuspensions),
        and(isNull(suspensions.liftedAt), isNotNull(suspensions.until), lt(suspensions.until, cut.endedSuspensions)),
      ),
    )
    .returning({ id: suspensions.id });

  const oldResets = await tx
    .delete(passwordResetTokens)
    .where(lt(passwordResetTokens.createdAt, cut.passwordResets))
    .returning({ id: passwordResetTokens.id });

  const oldRevisions = await tx
    .delete(guideRevisions)
    .where(lt(guideRevisions.createdAt, cut.guideRevisions))
    .returning({ id: guideRevisions.id });

  // I gettoni di Discord e Google salvati prima del 25/10: il sito non li
  // usa e dal 25/10 non li salva piu' (linkAccount in src/lib/auth/index.ts)
  const tokens = await tx
    .update(accounts)
    .set({
      access_token: null,
      refresh_token: null,
      id_token: null,
      expires_at: null,
      token_type: null,
      scope: null,
      session_state: null,
    })
    .where(
      or(
        isNotNull(accounts.access_token),
        isNotNull(accounts.refresh_token),
        isNotNull(accounts.id_token),
        isNotNull(accounts.session_state),
      ),
    )
    .returning({ provider: accounts.provider });

  return {
    expiredVerifications: expiredIds.length,
    verificationHistory: history.length,
    notifications: oldNotifications.length,
    closedReports: oldReports.length,
    moderationLog: oldActions.length,
    endedSuspensions: oldSuspensions.length,
    passwordResets: oldResets.length,
    guideRevisions: oldRevisions.length,
    oauthTokens: tokens.length,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Avvia la pulizia periodica, una volta sola per processo. I timer non tengono
 * acceso il processo (`unref`): quando il server si ferma, si fermano con lui.
 * Il registro dice solo quante righe ha tolto, mai di chi.
 */
export function scheduleRetention(): void {
  const store = globalThis as typeof globalThis & { __heikiRetention?: boolean };
  if (store.__heikiRetention) return;
  store.__heikiRetention = true;

  const run = () => {
    applyRetention()
      .then((report) => {
        if (!report) return;
        const done = Object.entries(report).filter(([, count]) => count > 0);
        if (done.length > 0) console.info(`[pulizia] ${done.map(([what, count]) => `${what} ${count}`).join(", ")}`);
      })
      .catch((error: unknown) => {
        console.error("[pulizia] non riuscita:", error instanceof Error ? error.message : error);
      });
  };

  setTimeout(run, 60_000).unref();
  setInterval(run, DAY_MS).unref();
}
