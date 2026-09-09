"use server";

/**
 * Azioni server per registrazione e accesso.
 *
 * Regola sui messaggi di errore: in accesso non si dice mai se a mancare sia
 * l'email o la password, altrimenti il modulo diventa uno strumento per
 * scoprire quali indirizzi sono registrati. In registrazione invece l'errore e'
 * specifico, perche' li' l'utente deve poter correggere.
 */

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { databaseReachable, db } from "@/lib/db";
import { profiles, users } from "@/lib/db/schema";
import { signIn } from "./index";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const USERNAME_RULE = /^[a-z0-9_-]+$/;

/**
 * Senza database non si puo' autenticare nessuno. Invece di restituire un
 * errore si accompagna l'utente al profilo di esempio: vede com'e' fatta la
 * schermata, e la modalita' resta dichiarata su quella pagina.
 */
const DEMO_PROFILE = "/anteprima/profilo";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "L'handle deve avere almeno 3 caratteri")
    .max(20, "L'handle non puo' superare i 20 caratteri")
    .regex(USERNAME_RULE, "Usa solo lettere minuscole, numeri, trattino e underscore"),
  displayName: z
    .string()
    .trim()
    .min(2, "Il nome visualizzato deve avere almeno 2 caratteri")
    .max(40, "Il nome visualizzato non puo' superare i 40 caratteri"),
  email: z.string().trim().toLowerCase().email("Inserisci un indirizzo email valido"),
  password: z
    .string()
    .min(10, "La password deve avere almeno 10 caratteri")
    .max(200, "La password non puo' superare i 200 caratteri"),
});

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await databaseReachable())) {
    redirect(DEMO_PROFILE);
  }

  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const { username, displayName, email, password } = parsed.data;

  const existingEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });
  if (existingEmail) {
    return { fieldErrors: { email: "Questa email e' gia' registrata" } };
  }

  const existingUsername = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true },
  });
  if (existingUsername) {
    return { fieldErrors: { username: "Questo handle e' gia' preso" } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Utente e profilo nascono insieme: un utente senza profilo non avrebbe una
  // pagina pubblica, ed e' la pagina pubblica il centro del prodotto.
  await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(users)
      .values({ email, username, name: displayName, passwordHash })
      .returning({ id: users.id });

    if (!created) throw new Error("Creazione utente fallita");

    await tx.insert(profiles).values({ userId: created.id, displayName });
  });

  await signIn("credentials", { email, password, redirectTo: `/u/${username}` });

  return {};
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await databaseReachable())) {
    redirect(DEMO_PROFILE);
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Inserisci email e password" };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o password non corrette" };
    }
    // signIn segnala il redirect riuscito lanciando: va rilanciato, non gestito.
    throw error;
  }

  return {};
}
