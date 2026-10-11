/**
 * Gettoni di recupero: l'annullamento in blocco.
 *
 * Sta fuori da password-reset.ts apposta: quello e' un modulo "use server", e
 * ogni sua funzione esportata diventa un'azione che il browser puo' chiamare.
 */

import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { passwordResetTokens } from "@/lib/db/schema";

type Executor = Pick<typeof db, "update">;

/**
 * Ogni gettone ancora aperto dell'utente smette di valere. Si chiama dopo un
 * recupero riuscito, un cambio di password e un cambio di email: chi cambia
 * la password perche' la casella era nelle mani di un altro non deve lasciare
 * aperto un collegamento gia' spedito li'.
 */
export async function invalidateResetTokens(executor: Executor, userId: string): Promise<void> {
  await executor
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResetTokens.userId, userId), isNull(passwordResetTokens.usedAt)));
}
