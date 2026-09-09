/**
 * Client di database.
 *
 * postgres.js non apre la connessione alla costruzione ma alla prima query.
 * Sfruttandolo, se DATABASE_URL manca si costruisce comunque il client su un
 * indirizzo segnaposto: l'app parte, le pagine pubbliche si renderizzano, e
 * solo chi tocca il database riceve un errore - che `databaseReachable`
 * intercetta per mostrare le istruzioni di setup invece di una schermata rotta.
 *
 * Il client resta un'istanza Drizzle vera e non un wrapper: l'adapter di
 * Auth.js ispeziona l'oggetto per capire quale dialetto SQL sta usando, e un
 * proxy lo manderebbe fuori strada.
 *
 * Singleton: in sviluppo l'hot reload di Next rivaluta i moduli a ogni
 * modifica, e senza cache si accumulerebbe una connessione per ricarica fino a
 * esaurire il pool di Postgres.
 */

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Client = ReturnType<typeof postgres>;
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

/** Indirizzo che non risponde mai: usato solo quando DATABASE_URL manca. */
const UNCONFIGURED_URL = "postgresql://unset:unset@127.0.0.1:1/unset";

declare global {
  // eslint-disable-next-line no-var
  var __gachazoneSql: Client | undefined;
}

export function isDatabaseConfigured(): boolean {
  return typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0;
}

const client =
  globalThis.__gachazoneSql ??
  postgres(process.env.DATABASE_URL || UNCONFIGURED_URL, {
    max: 10,
    // Senza questo un database spento tiene appesa la richiesta finche' non
    // scade il timeout di sistema, e la pagina resta bianca invece di mostrare
    // le istruzioni di setup.
    connect_timeout: 5,
    onnotice: () => {},
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__gachazoneSql = client;
}

export const db: DrizzleDb = drizzle(client, { schema });

/**
 * Variabile presente non significa database acceso. Questa sonda distingue i
 * due casi, cosi' l'interfaccia puo' dire "avvia Docker" invece di "credenziali
 * errate" quando il vero problema e' che Postgres non risponde.
 */
export async function databaseReachable(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}

export type Database = DrizzleDb;
export * from "./schema";
