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
 * L'invio dell'email non e' configurato. In sviluppo, e solo su un indirizzo
 * locale, il collegamento finisce nel registro del server e viene restituito,
 * cosi' il flusso e' provabile senza un fornitore di posta. Fino all'11/10 il
 * collegamento si scriveva nel registro anche in produzione: chi legge i log
 * (l'hosting, un servizio che li raccoglie) poteva chiedere il recupero per
 * l'email di chiunque e prendersi l'account. In produzione il recupero resta
 * senza invio finche' non c'e' un fornitore: il punto e' segnato qui sotto.
 */

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { databaseReachable, db } from "@/lib/db";
import { passwordResetTokens, sessions, users } from "@/lib/db/schema";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { PASSWORD_MIN } from "./account";
import { EMAIL_MAX_CHARS, passwordTooLong } from "./password-policy";
import { invalidateResetTokens } from "./reset-tokens";
import { currentIp } from "@/lib/security/client-ip";
import { siteUrl } from "@/lib/site";

const TESTI = testi({
  it: {
    emailNonValida: "Inserisci un indirizzo email valido",
    databaseAssente: "Il database non risponde: il recupero non è disponibile.",
    datiNonValidi: "Dati non validi.",
    rispostaGenerica:
      "Se quell'indirizzo è registrato, ti arriverà un collegamento per reimpostare la password. Vale un'ora.",
    passwordCorta: (min: number) => `La password deve avere almeno ${min} caratteri`,
    passwordDiverse: "Le due password non coincidono",
    passwordLunga: "La password è troppo lunga: al massimo 72 caratteri, meno se usi lettere accentate o emoji",
    collegamentoScaduto:
      "Collegamento non valido o scaduto. Chiedine un altro: quelli vecchi smettono di funzionare dopo un'ora o dopo il primo uso.",
    passwordReimpostata: "Password reimpostata. Ora puoi entrare.",
  },
  en: {
    emailNonValida: "Enter a valid email address",
    databaseAssente: "The database isn't responding: password recovery is unavailable.",
    datiNonValidi: "Invalid data.",
    rispostaGenerica:
      "If that address is registered, you'll receive a link to reset your password. It's valid for one hour.",
    passwordCorta: (min: number) => `The password must be at least ${min} characters`,
    passwordDiverse: "The two passwords don't match",
    passwordLunga: "The password is too long: at most 72 characters, fewer with accented letters or emoji",
    collegamentoScaduto:
      "Invalid or expired link. Request a new one: old links stop working after one hour or after their first use.",
    passwordReimpostata: "Password reset. You can log in now.",
  },
});

export interface ResetState {
  error?: string;
  success?: string;
  /** solo in sviluppo: il collegamento che sarebbe stato spedito */
  devLink?: string;
}

const TOKEN_TTL_MINUTES = 60;

/**
 * Il collegamento si mostra e si registra solo in sviluppo e su un indirizzo
 * locale: un'istanza di prova esposta in rete con `next dev` lo restituiva a
 * chiunque conoscesse un'email.
 */
function devLinkAllowed(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(siteUrl()).hostname);
  } catch {
    return false;
  }
}

/** L'impronta e' cio' che si conserva; il gettone vive solo nell'indirizzo. */
function fingerprint(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestResetAction(
  _previous: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!(await databaseReachable())) {
    return { error: t.databaseAssente };
  }

  const requestSchema = z.object({
    email: z.string().trim().toLowerCase().max(EMAIL_MAX_CHARS, t.emailNonValida).email(t.emailNonValida),
  });

  const parsed = requestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };

  const limit = rateLimit("passwordReset", parsed.data.email);
  if (!limit.allowed) return { error: retryMessage(limit, locale) };
  const ipLimit = rateLimit("passwordResetIp", await currentIp());
  if (!ipLimit.allowed) return { error: retryMessage(ipLimit, locale) };

  // Risposta identica in ogni caso: e' il punto dell'intera funzione.
  const generic: ResetState = { success: t.rispostaGenerica };

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
  if (!devLinkAllowed()) {
    // nel registro solo che c'e' stata una richiesta: mai l'email, mai il gettone
    console.info(`[recupero password] richiesta per l'utente ${user.id} (invio email non configurato)`);
    return generic;
  }
  console.info(`[recupero password] collegamento per ${parsed.data.email}: ${link}`);
  return { ...generic, devLink: link };
}

export async function completeResetAction(
  _previous: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!(await databaseReachable())) {
    return { error: t.databaseAssente };
  }

  const resetSchema = z
    .object({
      token: z.string().min(10),
      password: z
        .string()
        .min(PASSWORD_MIN, t.passwordCorta(PASSWORD_MIN))
        .refine((password) => !passwordTooLong(password), t.passwordLunga),
      repeat: z.string(),
    })
    .refine((data) => data.password === data.repeat, {
      message: t.passwordDiverse,
      path: ["repeat"],
    });

  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    repeat: formData.get("repeat"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };

  const row = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.tokenHash, fingerprint(parsed.data.token)),
      isNull(passwordResetTokens.usedAt),
      gt(passwordResetTokens.expiresAt, new Date()),
    ),
  });

  if (!row) {
    return { error: t.collegamentoScaduto };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const done = await db.transaction(async (tx) => {
    // Il gettone si consuma con una condizione, non dopo averlo letto: due
    // invii nello stesso istante passavano tutti e due il controllo di sopra.
    const [spent] = await tx
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(passwordResetTokens.id, row.id),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      )
      .returning({ userId: passwordResetTokens.userId });
    if (!spent) return false;

    await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, spent.userId));

    // gli altri collegamenti chiesti nel frattempo non valgono piu'
    await invalidateResetTokens(tx, spent.userId);

    // Chi reimposta la password lo fa spesso perche' ha perso il controllo
    // dell'account: le sessioni aperte da altri vanno chiuse (quelle JWT le
    // chiude l'impronta della password nel gettone, vedi auth/index.ts).
    await tx.delete(sessions).where(eq(sessions.userId, spent.userId));
    return true;
  });

  if (!done) return { error: t.collegamentoScaduto };
  return { success: t.passwordReimpostata };
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
