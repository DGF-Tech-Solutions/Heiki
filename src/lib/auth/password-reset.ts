"use server";

/**
 * Recupero della password.
 *
 * Tre scelte che contano piu' del codice:
 *
 * 1. La richiesta risponde sempre nello stesso modo, esista o no l'indirizzo.
 *    Altrimenti il modulo diventa uno strumento per scoprire chi e' iscritto -
 *    e per un sito di gaming, dove gli account valgono soldi, e' un'informazione
 *    che qualcuno vuole.
 * 2. Del gettone si memorizza l'IMPRONTA, non il gettone. Se il database
 *    finisse nelle mani sbagliate, nessuno di quei gettoni sarebbe utilizzabile.
 * 3. Il gettone e' monouso e scade in un'ora: un collegamento intercettato ha
 *    una finestra minima, e usarlo lo consuma.
 *
 * L'invio dell'email non e' configurato. In sviluppo il collegamento finisce nel
 * registro del server e viene restituito, cosi' il flusso e' provabile senza un
 * fornitore di posta. In produzione questo va sostituito con un invio vero: il
 * punto e' segnato con un commento esplicito.
 */

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { databaseReachable, db } from "@/lib/db";
import { passwordResetTokens, sessions, users } from "@/lib/db/schema";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { PASSWORD_MIN } from "./account";
import { siteUrl } from "@/lib/site";

export interface ResetState {
  error?: string;
  success?: string;
  /** solo in sviluppo: il collegamento che sarebbe stato spedito */
  devLink?: string;
}

const TOKEN_TTL_MINUTES = 60;

/** L'impronta e' cio' che si conserva; il gettone vive solo nell'indirizzo. */
function fingerprint(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email("Inserisci un indirizzo email valido"),
});

export async function requestResetAction(
  _previous: ResetState,
  formData: FormData,
): Promise<ResetState> {
  if (!(await databaseReachable())) {
    return { error: "Il database non risponde: il recupero non è disponibile." };
  }

  const parsed = requestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };

  const limit = rateLimit("passwordReset", parsed.data.email);
  if (!limit.allowed) return { error: retryMessage(limit) };

  // Risposta identica in ogni caso: e' il punto dell'intera funzione.
  const generic: ResetState = {
    success:
      "Se quell'indirizzo è registrato, ti arriverà un collegamento per reimpostare la password. Vale un'ora.",
  };

  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
    columns: { id: true },
  });
  if (!user) return generic;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000);

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash: fingerprint(token),
    expiresAt,
  });

  const link = `${siteUrl()}/password/${token}`;

  // QUI va l'invio dell'email quando ci sara' un fornitore configurato.
  console.info(`[recupero password] collegamento per ${parsed.data.email}: ${link}`);

  return process.env.NODE_ENV === "production" ? generic : { ...generic, devLink: link };
}

const resetSchema = z
  .object({
    token: z.string().min(10),
    password: z
      .string()
      .min(PASSWORD_MIN, `La password deve avere almeno ${PASSWORD_MIN} caratteri`)
      .max(200),
    repeat: z.string(),
  })
  .refine((data) => data.password === data.repeat, {
    message: "Le due password non coincidono",
    path: ["repeat"],
  });

export async function completeResetAction(
  _previous: ResetState,
  formData: FormData,
): Promise<ResetState> {
  if (!(await databaseReachable())) {
    return { error: "Il database non risponde: il recupero non è disponibile." };
  }

  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    repeat: formData.get("repeat"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };

  const row = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.tokenHash, fingerprint(parsed.data.token)),
      isNull(passwordResetTokens.usedAt),
      gt(passwordResetTokens.expiresAt, new Date()),
    ),
  });

  if (!row) {
    return {
      error:
        "Collegamento non valido o scaduto. Chiedine un altro: quelli vecchi smettono di funzionare dopo un'ora o dopo il primo uso.",
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, row.userId));

    await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, row.id));

    // Chi reimposta la password lo fa spesso perche' ha perso il controllo
    // dell'account: le sessioni aperte da altri vanno chiuse.
    await tx.delete(sessions).where(eq(sessions.userId, row.userId));
  });

  return { success: "Password reimpostata. Ora puoi entrare." };
}

/** Dice se un gettone e' ancora spendibile, per non mostrare un modulo inutile. */
export async function isResetTokenValid(token: string): Promise<boolean> {
  if (!(await databaseReachable())) return false;

  const row = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.tokenHash, fingerprint(token)),
      isNull(passwordResetTokens.usedAt),
      gt(passwordResetTokens.expiresAt, new Date()),
    ),
    columns: { id: true },
  });
  return row != null;
}
