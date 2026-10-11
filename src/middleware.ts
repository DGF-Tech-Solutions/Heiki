/**
 * Il middleware: la Content-Security-Policy di ogni pagina e la porta delle
 * pagine private.
 *
 * Gira su Edge, quindi importa solo la configurazione condivisa: niente
 * adapter, niente bcrypt, niente database.
 *
 * Fino all'11/10 girava solo sulle pagine private. Ora gira su tutte, perche'
 * la CSP con il nonce si scrive richiesta per richiesta: Next legge il nonce
 * dall'intestazione della richiesta e lo mette sui suoi script. Con una
 * funzione propria Auth.js non reindirizza piu' da solo chi non e' entrato
 * (chiama la funzione anche quando `authorized` direbbe di no): la porta delle
 * pagine private e' scritta qui sotto, e le pagine la ricontrollano comunque.
 */

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig, enabledOauthProviders } from "@/lib/auth/config";
import { contentSecurityPolicy, isProtectedPath, newNonce } from "@/lib/security/headers";

const { auth } = NextAuth(authConfig);

const DEV = process.env.NODE_ENV !== "production";
const HTTPS = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? "").startsWith("https://");
const OAUTH = enabledOauthProviders().map((provider) => provider.id);

export default auth((request) => {
  if (isProtectedPath(request.nextUrl.pathname) && !request.auth?.user) {
    return NextResponse.redirect(new URL("/entra", request.nextUrl));
  }

  const policy = contentSecurityPolicy({ nonce: newNonce(), dev: DEV, https: HTTPS, oauthProviders: OAUTH });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
});

export const config = {
  // Tutto tranne i file statici e le API (che non sono pagine e controllano
  // da sole chi chiama). Le immagini del gioco stanno in /eroi.
  matcher: [
    "/((?!api/|_next/static|_next/image|eroi/|favicon\\.ico|icon\\.svg|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml).*)",
  ],
};
