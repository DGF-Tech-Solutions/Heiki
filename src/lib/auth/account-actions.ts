"use server";

/**
 * Gestione dell'account: email, password, eliminazione.
 *
 * Tre principi che valgono per tutte e tre:
 *
 * 1. Ogni operazione chiede la password attuale. Chi si siede al computer di
 *    qualcun altro con la sessione aperta non deve poter cambiare l'email e
 *    prendersi l'account.
 * 2. Cambiare la password invalida le sessioni aperte. Se la si cambia perche'
 *    si sospetta un accesso altrui, lasciare vive le altre sessioni rende il
 *    cambio inutile.
 * 3. Eliminare l'account non cancella i post. Cancellarli spezzerebbe le
 *    discussioni di altri: si rimuove il legame con l'identita', il contenuto
 *    resta come anonimo.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth, signOut } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { comments, posts, profiles, sessions, users } from "@/lib/db/schema";
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { DELETE_PHRASES, deletePhrase, PASSWORD_MIN } from "./account";

const TESTI = testi({
  it: {
    senzaPasswordLocale:
      "Questo account è stato creato con un accesso esterno e non ha una password locale. Imposta prima una password dal recupero.",
    passwordAttualeErrata: "La password attuale non è corretta.",
    emailNonValida: "Inserisci un indirizzo email valido",
    servePasswordAttuale: "Serve la password attuale",
    sessioneScaduta: "Sessione scaduta. Rientra e riprova.",
    datiNonValidi: "Dati non validi.",
    indirizzoGiaQuesto: "L'indirizzo è già questo.",
    indirizzoUsato: "Questo indirizzo è già usato da un altro account.",
    indirizzoAggiornato: "Indirizzo aggiornato.",
    nuovaPasswordCorta: (min: number) => `La nuova password deve avere almeno ${min} caratteri`,
    passwordDiverse: "Le due password non coincidono",
    passwordIdentica: "La nuova password è identica a quella attuale.",
    passwordAggiornata: "Password aggiornata. Le altre sessioni sono state chiuse.",
    scriviPerConfermare: (parola: string) => `Scrivi ${parola} per confermare.`,
  },
  en: {
    senzaPasswordLocale:
      "This account was created with an external sign-in and has no local password. Set a password through password recovery first.",
    passwordAttualeErrata: "The current password is incorrect.",
    emailNonValida: "Enter a valid email address",
    servePasswordAttuale: "Your current password is required",
    sessioneScaduta: "Session expired. Log in again and retry.",
    datiNonValidi: "Invalid data.",
    indirizzoGiaQuesto: "That's already your address.",
    indirizzoUsato: "This address is already used by another account.",
    indirizzoAggiornato: "Address updated.",
    nuovaPasswordCorta: (min: number) => `The new password must be at least ${min} characters`,
    passwordDiverse: "The two passwords don't match",
    passwordIdentica: "The new password is the same as the current one.",
    passwordAggiornata: "Password updated. Your other sessions have been closed.",
    scriviPerConfermare: (parola: string) => `Type ${parola} to confirm.`,
  },
});

export interface AccountState {
  error?: string;
  success?: string;
}

async function currentUser() {
  if (!(await databaseReachable())) return null;
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { id: true, email: true, username: true, passwordHash: true },
  });
}

/**
 * Verifica la password attuale.
 *
 * Chi si e' registrato via OAuth non ha una password locale: in quel caso non
 * si puo' confermare l'identita' in questo modo, e si dice chiaramente invece di
 * far fallire il controllo con un messaggio fuorviante.
 */
async function confirmPassword(
  userId: string,
  hash: string | null,
  supplied: string,
  locale: Locale,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = TESTI[locale];

  // Il modulo "cambia password" e' un modo per provare la password attuale a
  // raffica: chi si e' impossessato di una sessione potrebbe indovinarla e poi
  // prendersi l'account. Il tetto vale su tutte e tre le operazioni.
  const limit = rateLimit("login", `account:${userId}`);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, locale) };

  if (!hash) {
    return { ok: false, error: t.senzaPasswordLocale };
  }

  const valid = await bcrypt.compare(supplied, hash);
  return valid ? { ok: true } : { ok: false, error: t.passwordAttualeErrata };
}

/* ------------------------------------------------------------- email ---- */

export async function changeEmailAction(
  _previous: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const user = await currentUser();
  if (!user) return { error: t.sessioneScaduta };

  const emailSchema = z.object({
    email: z.string().trim().toLowerCase().email(t.emailNonValida),
    password: z.string().min(1, t.servePasswordAttuale),
  });

  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };

  const confirmed = await confirmPassword(user.id, user.passwordHash, parsed.data.password, locale);
  if (!confirmed.ok) return { error: confirmed.error };

  if (parsed.data.email === user.email) {
    return { success: t.indirizzoGiaQuesto };
  }

  const taken = await db.query.users.findFirst({
    where: and(eq(users.email, parsed.data.email), ne(users.id, user.id)),
    columns: { id: true },
  });
  if (taken) return { error: t.indirizzoUsato };

  // emailVerified torna a null: il nuovo indirizzo non e' ancora provato, e
  // lasciarlo verificato sarebbe una bugia registrata nel database.
  await db
    .update(users)
    .set({ email: parsed.data.email, emailVerified: null, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/impostazioni/account");
  return { success: t.indirizzoAggiornato };
}

/* ---------------------------------------------------------- password ---- */

export async function changePasswordAction(
  _previous: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const user = await currentUser();
  if (!user) return { error: t.sessioneScaduta };

  const passwordSchema = z
    .object({
      current: z.string().min(1, t.servePasswordAttuale),
      next: z.string().min(PASSWORD_MIN, t.nuovaPasswordCorta(PASSWORD_MIN)).max(200),
      repeat: z.string(),
    })
    .refine((data) => data.next === data.repeat, {
      message: t.passwordDiverse,
      path: ["repeat"],
    });

  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    repeat: formData.get("repeat"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };

  const confirmed = await confirmPassword(user.id, user.passwordHash, parsed.data.current, locale);
  if (!confirmed.ok) return { error: confirmed.error };

  if (parsed.data.current === parsed.data.next) {
    return { error: t.passwordIdentica };
  }

  const passwordHash = await bcrypt.hash(parsed.data.next, 12);

  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));

    // Chi cambia password spesso lo fa perche' sospetta un accesso altrui:
    // lasciare vive le altre sessioni renderebbe il cambio inutile.
    await tx.delete(sessions).where(eq(sessions.userId, user.id));
  });

  revalidatePath("/impostazioni/account");
  return { success: t.passwordAggiornata };
}

/* ------------------------------------------------------ eliminazione ---- */

export async function deleteAccountAction(
  _previous: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const user = await currentUser();
  if (!user) return { error: t.sessioneScaduta };

  const deleteSchema = z.object({
    password: z.string().min(1, t.servePasswordAttuale),
    confirm: z.string(),
  });

  const parsed = deleteSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };

  // Digitare una parola non e' burocrazia: e' l'unico modo per distinguere una
  // decisione da un clic sbagliato su un'azione irreversibile. Vale la parola di
  // una delle due lingue: il modulo puo' essere stato disegnato nell'altra.
  const typed = parsed.data.confirm.trim().toUpperCase();
  if (!Object.values(DELETE_PHRASES).includes(typed)) {
    return { error: t.scriviPerConfermare(deletePhrase(locale)) };
  }

  const confirmed = await confirmPassword(user.id, user.passwordHash, parsed.data.password, locale);
  if (!confirmed.ok) return { error: confirmed.error };

  const anonymousSuffix = user.id.slice(0, 8);

  await db.transaction(async (tx) => {
    // I contenuti restano ma perdono l'autore: cancellarli spezzerebbe le
    // discussioni di altre persone, che non hanno chiesto di perderle.
    // Il legame passa a un utente segnaposto creato al volo.
    const [placeholder] = await tx
      .insert(users)
      .values({
        email: `eliminato+${anonymousSuffix}@gachazone.invalid`,
        username: `eliminato-${anonymousSuffix}`,
        name: "Account eliminato",
        role: "USER",
      })
      .returning({ id: users.id });

    if (!placeholder) throw new Error("impossibile creare l'utente segnaposto");

    await tx.insert(profiles).values({
      userId: placeholder.id,
      displayName: "Account eliminato",
    });

    await tx.update(posts).set({ authorId: placeholder.id }).where(eq(posts.authorId, user.id));
    await tx
      .update(comments)
      .set({ authorId: placeholder.id })
      .where(eq(comments.authorId, user.id));

    // Tutto il resto - profilo, badge, voti, notifiche, sessioni - se ne va in
    // cascata grazie alle chiavi esterne.
    await tx.delete(users).where(eq(users.id, user.id));
  });

  await signOut({ redirect: false });
  redirect("/?eliminato=1");
}
