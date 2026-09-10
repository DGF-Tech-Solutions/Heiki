/**
 * Applicazione delle migrazioni.
 *
 *   npm run db:migrate
 *
 * Fa la stessa cosa di `drizzle-kit migrate` ma tace: alla seconda esecuzione
 * Postgres emette due NOTICE ("schema drizzle already exists", "relation
 * __drizzle_migrations already exists") che drizzle-kit stampa come oggetti di
 * errore. Sono innocui, ma sembrano un guasto, e chi ha appena clonato il repo
 * non ha modo di sapere che puo' ignorarli.
 *
 * Le migrazioni continuano a essere GENERATE da drizzle-kit
 * (`npm run db:generate`): qui si applicano soltanto.
 */

import { resolve } from "node:path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { loadEnv, requireDatabaseUrl } from "./env.mjs";

loadEnv();


const url = requireDatabaseUrl();

// max: 1 perche' le migrazioni sono sequenziali; onnotice silenziato perche' i
// NOTICE di idempotenza non sono informazione utile per chi lancia il comando.
const client = postgres(url, { max: 1, onnotice: () => {} });

try {
  await migrate(drizzle(client), { migrationsFolder: resolve(process.cwd(), "drizzle") });
  console.log("Migrazioni applicate.");
} catch (error) {
  console.error("Migrazioni fallite:", error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await client.end();
}
