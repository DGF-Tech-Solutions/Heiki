/**
 * L'indirizzo di chi chiama, per i tetti ai tentativi.
 *
 * Le azioni del server vedono solo le intestazioni. Next mette in
 * `X-Forwarded-For` l'indirizzo della connessione SOLO se l'intestazione manca
 * (`??=` in base-server.js): senza un proxy davanti, chi chiama puo' scriverla
 * come vuole. Per questo:
 * - si prende l'ULTIMA voce della catena, quella che aggiunge il proxy piu'
 *   vicino al sito (nginx con `proxy_add_x_forwarded_for`, Caddy, Traefik);
 *   in produzione il proxy va configurato perche' la scriva sempre
 * - i tetti per indirizzo sono larghi e affiancati da tetti per account, che
 *   non dipendono da niente che il chiamante possa inventare
 * - un IPv6 conta per la sua rete /64: chi ha una rete IPv6 ha miliardi di
 *   indirizzi, e cambiarli a ogni tentativo azzererebbe il conto
 */

import { headers } from "next/headers";

const UNKNOWN = "sconosciuto";

export function clientIp(source: Headers): string {
  const forwarded = source.get("x-forwarded-for");
  const last = forwarded?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
  const raw = last ?? source.get("x-real-ip")?.trim() ?? "";
  return normalizeIp(raw);
}

/** L'indirizzo della richiesta in corso, dentro un'azione del server. */
export async function currentIp(): Promise<string> {
  return clientIp(await headers());
}

export function normalizeIp(raw: string): string {
  let ip = raw.trim().toLowerCase();
  if (!ip || ip.length > 64) return UNKNOWN;
  // "[::1]:3000" e "1.2.3.4:5678": la porta non conta
  const bracketed = /^\[([^\]]+)\](?::\d+)?$/.exec(ip);
  if (bracketed?.[1]) ip = bracketed[1];
  else if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(ip)) ip = ip.slice(0, ip.lastIndexOf(":"));

  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(ip);
  if (mapped?.[1]) ip = mapped[1];

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return ip;
  if (/^[0-9a-f:]+$/.test(ip) && ip.includes(":")) return ipv6Prefix(ip);
  return UNKNOWN;
}

/** I primi quattro gruppi di un IPv6, con "::" espanso. */
function ipv6Prefix(ip: string): string {
  const [head = "", tail] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail !== undefined && tail !== "" ? tail.split(":") : [];
  const missing = tail === undefined ? 0 : 8 - left.length - right.length;
  if (missing < 0 || ip.split("::").length > 2) return UNKNOWN;
  const groups = [...left, ...Array<string>(missing).fill("0"), ...right];
  if (groups.length !== 8 || groups.some((g) => g.length > 4)) return UNKNOWN;
  return `${groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, "")).join(":")}::/64`;
}
