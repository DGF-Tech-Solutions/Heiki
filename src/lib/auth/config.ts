/**
 * Configurazione di Auth.js condivisa fra runtime Node ed Edge.
 *
 * Qui NON deve entrare nulla che tocchi il database o moduli solo-Node
 * (adapter, bcrypt): questo file viene incluso nel middleware, che gira su
 * Edge. Tutto il resto sta in ./index.ts.
 */

import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import { isRole, type Role } from "./permissions";

/**
 * I provider OAuth si attivano solo se le credenziali sono presenti
 * nell'ambiente: senza, il pulsante non compare invece di portare a una
 * schermata di errore del provider.
 */
function oauthProviders() {
  const providers = [];

  if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
    providers.push(
      Discord({
        clientId: process.env.AUTH_DISCORD_ID,
        clientSecret: process.env.AUTH_DISCORD_SECRET,
      }),
    );
  }

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  return providers;
}

export function enabledOauthProviders(): readonly { id: string; label: string }[] {
  const enabled: { id: string; label: string }[] = [];
  if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
    enabled.push({ id: "discord", label: "Discord" });
  }
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    enabled.push({ id: "google", label: "Google" });
  }
  return enabled;
}

export const authConfig = {
  // Sessione su JWT: obbligatorio per il provider a credenziali, e permette al
  // middleware di validare senza interrogare il database a ogni richiesta.
  // 14 giorni, rinnovati a ogni visita: chi usa il sito non esce mai, un cookie
  // rubato a qualcuno che non torna smette di valere. Il tetto assoluto (60
  // giorni dall'ultimo accesso vero) sta nel callback jwt di ./index.ts.
  session: { strategy: "jwt", maxAge: 14 * 24 * 60 * 60 },
  pages: {
    signIn: "/entra",
    error: "/entra",
  },
  providers: oauthProviders(),
  callbacks: {
    // Niente `authorized`: il middleware ha una funzione propria, e con quella
    // Auth.js ignora un `false` (vedi src/middleware.ts, che fa da porta).
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (isRole(token.role)) session.user.role = token.role;
      if (typeof token.username === "string") session.user.username = token.username;
      if (typeof token.authAt === "number") session.authAt = token.authAt;
      return session;
    },
  },
} satisfies NextAuthConfig;

export type SessionRole = Role;
