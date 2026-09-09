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
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { authConfig } from "./config";
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

    const seed = data.name ?? data.email?.split("@")[0] ?? "utente";
    const username = await uniqueUsername(seed);

    return create({ ...data, username } as AdapterUser & { username: string });
  },
};

export async function uniqueUsername(seed: string): Promise<string> {
  const base = slugifyUsername(seed) || "utente";

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? base : `${base}${attempt + 1}`;
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
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email.trim().toLowerCase()),
        });

        // Nessuna password locale: l'account esiste ma e' stato creato via OAuth.
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

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
    async jwt({ token, user }) {
      // Al primo accesso `user` e' popolato: si copiano ruolo e handle nel token
      // cosi' le richieste successive non interrogano il database.
      if (user) {
        const candidate = user as { role?: unknown; username?: unknown };
        if (isRole(candidate.role)) token.role = candidate.role;
        if (typeof candidate.username === "string") token.username = candidate.username;
      }

      // Rete di sicurezza per gli accessi OAuth, dove l'oggetto user arriva
      // dall'adapter e potrebbe non portare i nostri campi.
      if (token.sub && (!token.role || !token.username)) {
        const stored = await db.query.users.findFirst({
          where: eq(users.id, token.sub),
          columns: { role: true, username: true },
        });
        if (stored) {
          token.role = stored.role;
          token.username = stored.username;
        }
      }

      return token;
    },
  },
});
