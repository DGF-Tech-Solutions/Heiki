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

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

loadEnv();

function loadEnv(): void {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!key || process.env[key]) continue;
    process.env[key] = (rawValue ?? "").replace(/^["']|["']$/g, "");
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL non impostata: copia .env.example in .env o lancia `npm run setup`.");
  process.exit(1);
}

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
