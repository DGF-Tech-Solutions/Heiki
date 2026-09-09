/**
 * Protezione delle rotte private.
 *
 * Gira su Edge, quindi importa solo la configurazione condivisa: niente
 * adapter, niente bcrypt, niente database.
 */

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  // Il calcolatore resta pubblico di proposito: chiedere l'account prima di
  // dare valore uccide la conversione. L'account serve per SALVARE.
  matcher: ["/impostazioni/:path*", "/redazione/:path*", "/admin/:path*"],
};
