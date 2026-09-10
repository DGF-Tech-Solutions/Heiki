/**
 * Carica il file .env negli script da riga di comando.
 *
 * Next.js legge .env da solo; `tsx` no. Senza questa chiamata uno script trova
 * DATABASE_URL vuota e si ferma dicendo di lanciare il setup - anche quando il
 * setup e' gia' stato fatto, che e' il modo piu' rapido di far perdere dieci
 * minuti a qualcuno.
 *
 * Non e' una dipendenza esterna perche' serve solo questo: leggere righe
 * `CHIAVE=valore`. Le variabili gia' presenti nell'ambiente vincono, cosi' si
 * puo' scavalcare un valore per una singola esecuzione senza toccare il file.
 *
 * Va importato PRIMA di qualunque import di `@/lib/db`: quel modulo legge
 * DATABASE_URL al momento del caricamento, quindi negli script si usa
 * `await import(...)` dopo questa chiamata.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnv(file = ".env"): void {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i.exec(line);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!key || process.env[key]) continue;

    process.env[key] = (rawValue ?? "").replace(/^["']|["']$/g, "");
  }
}

/**
 * Ferma lo script con un messaggio che dice cosa fare, non solo cosa manca.
 */
export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "\n  DATABASE_URL non impostata.\n" +
        "  Lancia `npm run setup` oppure copia .env.example in .env.\n",
    );
    process.exit(1);
  }
  return url;
}
