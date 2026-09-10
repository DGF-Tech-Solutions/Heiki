/**
 * Assegna un ruolo a un account.
 *
 * Serve perche' il primo amministratore non puo' nascere dal sito: il pannello
 * di amministrazione richiede di essere amministratori per entrarci. Qualcuno
 * deve poter rompere il cerchio, e il posto giusto e' la riga di comando - dove
 * serve accesso alla macchina e alle variabili d'ambiente, non solo una
 * password.
 *
 * L'alternativa - promuovere automaticamente il primo iscritto - regala il
 * controllo del sito a chiunque arrivi primo alla pagina di registrazione se il
 * database viene esposto prima del lancio.
 *
 * Uso:
 *   npm run promote -- franz@example.com ADMIN
 *   npm run promote -- franz ADMIN            (funziona anche col nome utente)
 */

import { eq, or } from "drizzle-orm";

const { db } = await import("@/lib/db");
const schema = await import("@/lib/db/schema");
const { ROLES, isRole } = await import("@/lib/auth/permissions");

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const [identifier, role] = process.argv.slice(2);

if (!process.env.DATABASE_URL) {
  fail("DATABASE_URL non impostata: copia .env.example in .env oppure lancia npm run setup");
}

if (!identifier || !role) {
  fail(
    `Uso: npm run promote -- <email o nome utente> <ruolo>\n  Ruoli: ${ROLES.join(", ")}`,
  );
}

const wanted = role.toUpperCase();
if (!isRole(wanted)) {
  fail(`Ruolo inesistente: ${role}\n  Ruoli validi: ${ROLES.join(", ")}`);
}

const needle = identifier.trim().toLowerCase();

const user = await db.query.users.findFirst({
  where: or(eq(schema.users.email, needle), eq(schema.users.username, needle)),
  columns: { id: true, email: true, username: true, role: true },
});

if (!user) {
  fail(`Nessun account con email o nome utente «${identifier}». Registralo dal sito, poi ripeti.`);
}

if (user.role === wanted) {
  console.log(`\n  ${user.username} è già ${wanted}. Niente da fare.\n`);
  process.exit(0);
}

await db
  .update(schema.users)
  .set({ role: wanted, updatedAt: new Date() })
  .where(eq(schema.users.id, user.id));

console.log(`\n  ${user.username} (${user.email}): da ${user.role} a ${wanted}.\n`);
process.exit(0);
