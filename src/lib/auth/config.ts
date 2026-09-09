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
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entra",
    error: "/entra",
  },
  providers: oauthProviders(),
  callbacks: {
    authorized({ auth }) {
      return auth?.user != null;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (isRole(token.role)) session.user.role = token.role;
      if (typeof token.username === "string") session.user.username = token.username;
      return session;
    },
  },
} satisfies NextAuthConfig;

export type SessionRole = Role;
