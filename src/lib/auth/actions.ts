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
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { profiles, users } from "@/lib/db/schema";
import { currentIp } from "@/lib/security/client-ip";
import { displayNameProblem, isReservedEmail, isReservedHandle } from "./handles";
import { EMAIL_MAX_CHARS, LOGIN_MAX_CHARS, PASSWORD_MIN_CHARS, passwordTooLong } from "./password-policy";
import { signIn } from "./index";

const TESTI = testi({
  it: {
    handleCorto: "L'handle deve avere almeno 3 caratteri",
    handleLungo: "L'handle non può superare i 20 caratteri",
    handleCaratteri: "Usa solo lettere minuscole, numeri, trattino e underscore",
    nomeCorto: "Il nome visualizzato deve avere almeno 2 caratteri",
    nomeLungo: "Il nome visualizzato non può superare i 40 caratteri",
    emailNonValida: "Inserisci un indirizzo email valido",
    passwordCorta: "La password deve avere almeno 10 caratteri",
    passwordLunga: "La password è troppo lunga: al massimo 72 caratteri, meno se usi lettere accentate o emoji",
    handleRiservato: "Questo handle è riservato",
    nomeInvisibile: "Il nome contiene caratteri invisibili o di controllo",
    nomeStaff: "Il nome non può far sembrare che tu sia dello staff",
    emailRiservata: "Questo indirizzo non riceve posta: usane uno vero",
    entraOra: "Profilo creato. Entra con la tua email e la password.",
    emailRegistrata: "Questa email è già registrata",
    handlePreso: "Questo handle è già preso",
    servonoEmailPassword: "Inserisci email e password",
    credenzialiErrate: "Email o password non corrette",
  },
  en: {
    handleCorto: "The handle must be at least 3 characters",
    handleLungo: "The handle can't be longer than 20 characters",
    handleCaratteri: "Use only lowercase letters, numbers, hyphens and underscores",
    nomeCorto: "The display name must be at least 2 characters",
    nomeLungo: "The display name can't be longer than 40 characters",
    emailNonValida: "Enter a valid email address",
    passwordCorta: "The password must be at least 10 characters",
    passwordLunga: "The password is too long: at most 72 characters, fewer with accented letters or emoji",
    handleRiservato: "This handle is reserved",
    nomeInvisibile: "The name contains invisible or control characters",
    nomeStaff: "The name can't make you look like staff",
    emailRiservata: "This address doesn't receive mail: use a real one",
    entraOra: "Profile created. Sign in with your email and password.",
    emailRegistrata: "This email is already registered",
    handlePreso: "This handle is already taken",
    servonoEmailPassword: "Enter your email and password",
    credenzialiErrate: "Incorrect email or password",
  },
});

type Testi = (typeof TESTI)["it"];

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

/** Lo schema nasce con i messaggi nella lingua di chi compila il modulo. */
function registerSchema(t: Testi) {
  return z.object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, t.handleCorto)
      .max(20, t.handleLungo)
      .regex(USERNAME_RULE, t.handleCaratteri)
      .refine((handle) => !isReservedHandle(handle), t.handleRiservato),
    displayName: z
      .string()
      .trim()
      .min(2, t.nomeCorto)
      .max(40, t.nomeLungo)
      .superRefine((name, ctx) => {
        const problem = displayNameProblem(name);
        if (problem) ctx.addIssue({ code: "custom", message: problem === "staff" ? t.nomeStaff : t.nomeInvisibile });
      }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(EMAIL_MAX_CHARS, t.emailNonValida)
      .email(t.emailNonValida)
      .refine((email) => !isReservedEmail(email), t.emailRiservata),
    password: z
      .string()
      .min(PASSWORD_MIN_CHARS, t.passwordCorta)
      .refine((password) => !passwordTooLong(password), t.passwordLunga),
  });
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await databaseReachable())) {
    redirect(DEMO_PROFILE);
  }

  const locale = await getLocale();
  const t = TESTI[locale];

  const parsed = registerSchema(t).safeParse({
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

  // Il limite arriva dopo la validazione: un modulo compilato male non deve
  // consumare i tentativi di chi sta solo sbagliando a digitare. Due tetti: per
  // email, e per indirizzo (account creati a macchina cambiando email a ogni giro).
  const registerLimit = rateLimit("register", email);
  if (!registerLimit.allowed) return { error: retryMessage(registerLimit, locale) };
  const ipLimit = rateLimit("registerIp", await currentIp());
  if (!ipLimit.allowed) return { error: retryMessage(ipLimit, locale) };

  const existingEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });
  if (existingEmail) {
    return { fieldErrors: { email: t.emailRegistrata } };
  }

  const existingUsername = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: { id: true },
  });
  if (existingUsername) {
    return { fieldErrors: { username: t.handlePreso } };
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

  try {
    await signIn("credentials", { email, password, redirectTo: `/u/${username}` });
  } catch (error) {
    // l'account c'e' gia': se l'accesso automatico non riesce (per esempio
    // perche' qualcuno ha consumato i tentativi di questa email), si dice di
    // entrare a mano invece di mostrare un errore su un profilo creato
    if (error instanceof AuthError) return { error: t.entraOra };
    throw error;
  }

  return {};
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(await databaseReachable())) {
    redirect(DEMO_PROFILE);
  }

  const locale = await getLocale();
  const t = TESTI[locale];

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: t.servonoEmailPassword };
  }
  // testi enormi non sono credenziali: niente bcrypt e niente chiave da ricordare
  if (email.length > EMAIL_MAX_CHARS || password.length > LOGIN_MAX_CHARS) {
    return { error: t.credenzialiErrate };
  }

  // Senza un tetto, il modulo di accesso e' una porta aperta: si possono
  // provare migliaia di password al secondo. La chiave e' email + indirizzo:
  // con la sola email chiunque poteva tenere fuori una persona. I tetti larghi
  // (per indirizzo e per account) stanno in authorize, dove passa ogni accesso.
  const limit = rateLimit("login", `${email.toLowerCase()}|${await currentIp()}`);
  if (!limit.allowed) return { error: retryMessage(limit, locale) };

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t.credenzialiErrate };
    }
    // signIn segnala il redirect riuscito lanciando: va rilanciato, non gestito.
    throw error;
  }

  return {};
}
