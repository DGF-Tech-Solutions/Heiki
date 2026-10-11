/**
 * Auth.js - parte che gira solo su runtime Node.
 *
 * Qui stanno adapter, bcrypt e le query: tutto cio' che il middleware Edge non
 * puo' importare. Il middleware usa solo ./config.ts.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { accounts, profiles, sessions, users, verificationTokens } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/security/client-ip";
import { authConfig } from "./config";
import { isReservedHandle } from "./handles";
import { EMAIL_MAX_CHARS, LOGIN_MAX_CHARS } from "./password-policy";
import { isRole } from "./permissions";

const baseAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

/**
 * Chi entra via OAuth non ha scelto un handle, ma `users.username` non e'
 * nullable perche' e' l'indirizzo del profilo pubblico. Se ne genera uno
 * derivato dal nome o dall'email; l'utente potra' cambiarlo dal profilo.
 */
const adapter: Adapter = {
  ...baseAdapter,
  async createUser(data) {
    const create = baseAdapter.createUser;
    if (!create) throw new Error("Adapter senza createUser");

    // Handle e nome pubblico neutri: fino all'11/10 nascevano dal nome del
    // provider (con Google e' nome e cognome veri) o dalla parte dell'email
    // prima della @, e finivano sulla pagina pubblica senza che nessuno l'avesse
    // scelto. L'utente li cambia dal profilo quando vuole.
    const username = await uniqueUsername(`giocatore-${randomBytes(3).toString("hex")}`);
    // l'email in minuscolo, come nella registrazione: l'indice unico distingue
    // le maiuscole, e il recupero cerca in minuscolo
    const email = data.email?.trim().toLowerCase() ?? data.email;

    const created = await create({ ...data, email, username } as AdapterUser & { username: string });
    // Il profilo nasce con l'utente, come nella registrazione con la password:
    // senza la riga, le modifiche al profilo di chi entrava con Discord o Google
    // si «salvavano» su niente (11/10)
    await db
      .insert(profiles)
      .values({ userId: created.id, displayName: username })
      .onConflictDoNothing();
    return created;
  },
};

/**
 * Un'impronta corta della password salvata, nel gettone della sessione. Le
 * sessioni sono JWT: cancellare le righe di `sessions` (che il JWT non usa) non
 * chiudeva niente, e chi aveva rubato un cookie restava dentro dopo il cambio
 * della password. Ora il gettone che porta l'impronta di una password vecchia
 * non vale piu' (11/10).
 */
export function passwordStamp(hash: string | null | undefined): string {
  return createHash("sha256").update(hash ?? "").digest("hex").slice(0, 16);
}

/**
 * Ogni quanto il gettone rilegge ruolo, handle e password dal database. Prima
 * li leggeva solo all'accesso: un moderatore declassato restava moderatore, e
 * dopo un cambio di handle il sito non riconosceva piu' il proprietario sulla
 * sua pagina. Un minuto: abbastanza vicino per un declassamento, una query di
 * chiave primaria quando scade.
 */
const RECHECK_SECONDS = 60;

/**
 * Da quanto puo' valere un gettone senza un accesso vero (password o OAuth):
 * la sessione si rinnova a ogni visita, ma dopo 60 giorni si rientra.
 */
const ABSOLUTE_MAX_SECONDS = 60 * 24 * 60 * 60;

/**
 * Un'impronta bcrypt di una password che nessuno ha: si confronta anche quando
 * l'utente non esiste, cosi' la risposta impiega lo stesso tempo. Prima un
 * indirizzo sconosciuto rispondeva in pochi millesimi e uno registrato in un
 * quarto di secondo: bastava un cronometro per sapere chi e' iscritto.
 */
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), 12);

export async function uniqueUsername(seed: string): Promise<string> {
  const base = slugifyUsername(seed) || "utente";

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}${attempt + 1}`;
    if (isReservedHandle(candidate)) continue;
    const taken = await db.query.users.findFirst({
      where: eq(users.username, candidate),
      columns: { id: true },
    });
    if (!taken) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`;
}

export function slugifyUsername(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Email e password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;
        if (email.length > EMAIL_MAX_CHARS || password.length > LOGIN_MAX_CHARS) return null;

        // Il tetto di loginAction non bastava: questa funzione risponde anche
        // a /api/auth/callback/credentials, chiamato direttamente (11/10). Tre
        // tetti: la coppia email + indirizzo (stretto), l'indirizzo che prova
        // molte email, l'account provato da molti indirizzi (larghi).
        const ip = clientIp(request.headers);
        if (
          !rateLimit("credentials", `${email}|${ip}`).allowed ||
          !rateLimit("credentialsIp", ip).allowed ||
          !rateLimit("credentialsAccount", email).allowed
        ) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        // Nessun utente, o nessuna password locale (account creato via OAuth):
        // si confronta lo stesso, per rispondere negli stessi tempi.
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user?.passwordHash || !valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * Con OAuth si entra solo con un'email che il provider ha verificato.
     * Discord accetta indirizzi non confermati: senza questo controllo chi
     * metteva sul suo Discord l'email di un altro entrava nell'account con
     * quell'email (o se lo creava prima di lui) senza averla mai letta.
     */
    signIn({ account, profile }) {
      if (account?.provider === "discord") return profile?.verified === true;
      if (account?.provider === "google") return profile?.email_verified === true;
      return true;
    },
    async jwt({ token, user }) {
      // Al primo accesso `user` e' popolato: si copiano ruolo e handle nel token.
      if (user) {
        const candidate = user as { role?: unknown; username?: unknown };
        if (isRole(candidate.role)) token.role = candidate.role;
        if (typeof candidate.username === "string") token.username = candidate.username;
        token.authAt = Math.floor(Date.now() / 1000);
      }

      // All'accesso e poi ogni RECHECK_SECONDS: ruolo, handle e password dal
      // database. Un utente cancellato, o con una password diversa da quella con
      // cui e' entrato, non ha piu' una sessione.
      const now = Math.floor(Date.now() / 1000);
      // i gettoni nati fra l'11/10 e l'arrivo di authAt lo prendono adesso
      const authAt = typeof token.authAt === "number" ? token.authAt : now;
      token.authAt = authAt;
      if (now - authAt > ABSOLUTE_MAX_SECONDS) return null;
      // letto con typeof: il tipo del gettone che arriva qui e' quello di
      // @auth/core, dove i campi in piu' sono `unknown`
      const checkedAt = typeof token.checkedAt === "number" ? token.checkedAt : 0;
      if (token.sub && (user || now - checkedAt >= RECHECK_SECONDS)) {
        // un database che non risponde per un attimo non deve far uscire nessuno:
        // il gettone resta quello che era, e si riprova alla richiesta dopo
        const stored = await db.query.users
          .findFirst({
            where: eq(users.id, token.sub),
            columns: { role: true, username: true, passwordHash: true },
          })
          .catch(() => "errore" as const);
        if (stored === "errore") return token;
        if (!stored) return null;
        const stamp = passwordStamp(stored.passwordHash);
        // Un gettone senza impronta e' di prima dell'11/10: fino ad allora la
        // prendeva qui, e un cookie vecchio rubato sopravviveva a un cambio di
        // password fatto dopo. Ora si rientra, una volta sola.
        if (user) token.pwd = stamp;
        else if (token.pwd !== stamp) return null;
        token.role = stored.role;
        token.username = stored.username;
        token.checkedAt = now;
      }

      return token;
    },
  },
});
