/**
 * Le intestazioni di sicurezza del sito.
 *
 * Fino all'11/10 il sito non ne mandava nessuna: una pagina di Heiki si
 * poteva incorniciare in un altro sito (clickjacking sui pulsanti di voto, di
 * moderazione, «Elimina account»), e un testo che fosse riuscito a diventare
 * script sarebbe partito senza ostacoli. Le intestazioni non sostituiscono il
 * controllo dei dati (React scrive i testi come testo, il markdown passa da un
 * parser nostro): sono la seconda serratura, quella che regge se la prima cede.
 *
 * Questo modulo gira anche nel middleware (Edge): niente moduli solo-Node.
 */

/** Le pagine che chiedono di essere entrati. Le pagine stesse lo ricontrollano. */
export const PROTECTED_PREFIXES = ["/impostazioni", "/notifiche", "/moderazione", "/admin"] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * I siti dei provider OAuth a cui il modulo di accesso puo' mandare: senza
 * JavaScript «Entra con Discord» e' un modulo che risponde con un
 * reindirizzamento al provider, e Chrome applica `form-action` anche a quello.
 */
const OAUTH_FORM_TARGETS: Readonly<Record<string, string>> = {
  discord: "https://discord.com",
  google: "https://accounts.google.com",
};

export interface CspOptions {
  /** valore casuale nuovo a ogni richiesta, gia' in base64 */
  nonce: string;
  /** in sviluppo React e Turbopack valutano codice e aprono un websocket */
  dev: boolean;
  /** il sito e' servito in https: si chiede al browser di non scendere a http */
  https: boolean;
  /** i provider OAuth attivi (`discord`, `google`) */
  oauthProviders: readonly string[];
}

/**
 * La Content-Security-Policy di una pagina.
 *
 * - script: solo quelli col nonce di questa richiesta, e quelli che loro
 *   caricano (`strict-dynamic`: i pezzi di Next). Uno script iniettato in un
 *   post non ha il nonce, e il browser non lo esegue. Il JSON-LD delle briciole
 *   e' un blocco di dati, non uno script: la regola non lo tocca
 * - stili: `unsafe-inline` resta. React scrive gli stili come attributi
 *   (`style={{...}}` in 24 file) e i nonce non valgono per gli attributi;
 *   uno stile iniettato puo' cambiare l'aspetto, non eseguire codice
 * - immagini: dal sito, piu' `blob:` per l'anteprima della schermata della
 *   verifica (URL.createObjectURL) e `data:` per le icone in linea
 * - niente plugin, niente <base> altrui, moduli solo verso il sito e i provider
 *   OAuth attivi, e nessuno puo' mettere il sito in una cornice
 */
export function contentSecurityPolicy({ nonce, dev, https, oauthProviders }: CspOptions): string {
  const formTargets = oauthProviders
    .map((provider) => OAUTH_FORM_TARGETS[provider])
    .filter((target): target is string => target !== undefined);

  const directives: [string, ...string[]][] = [
    ["default-src", "'self'"],
    ["script-src", "'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(dev ? ["'unsafe-eval'"] : [])],
    ["style-src", "'self'", "'unsafe-inline'"],
    ["img-src", "'self'", "data:", "blob:"],
    ["font-src", "'self'", "data:"],
    ["connect-src", "'self'", ...(dev ? ["ws:", "wss:"] : [])],
    ["media-src", "'self'"],
    ["worker-src", "'self'", "blob:"],
    ["manifest-src", "'self'"],
    ["object-src", "'none'"],
    ["base-uri", "'self'"],
    ["form-action", "'self'", ...formTargets],
    ["frame-src", "'none'"],
    ["frame-ancestors", "'none'"],
  ];
  if (https) directives.push(["upgrade-insecure-requests"]);

  return directives.map((parts) => parts.join(" ")).join("; ");
}

/** Un nonce nuovo: 128 bit casuali, in base64 come vuole la CSP. */
export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * Le intestazioni uguali per ogni risposta, messe da next.config.ts.
 *
 * - `X-Frame-Options` ripete `frame-ancestors` per i browser vecchi
 * - `Permissions-Policy`: il sito non usa camera, microfono, posizione,
 *   pagamenti, USB; se uno script estraneo ci arrivasse, il browser glieli nega
 * - `Cross-Origin-Opener-Policy`: una finestra aperta da un altro sito non
 *   tiene un riferimento alla nostra (OAuth usa reindirizzamenti, non popup)
 * - HSTS solo in produzione: dice al browser di usare sempre https. Senza
 *   `preload`, che e' un impegno da prendere col dominio vero
 */
export function staticSecurityHeaders(production: boolean): { key: string; value: string }[] {
  const headers = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), browsing-topics=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
  if (production) {
    headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" });
  }
  return headers;
}
