/**
 * Copia del database.
 *
 *   npm run db:backup                    il database di DATABASE_URL
 *   npm run db:backup -- --tieni 30      quante copie tenere (di serie 14)
 *   DATABASE_URL=postgresql://... npm run db:backup     un altro database
 *
 * Scrive `backups/gachazone-AAAA-MM-GG-HHMM.dump` (formato «custom» di pg_dump:
 * compresso, e si ripristina anche una tabella sola) e cancella le copie piu'
 * vecchie oltre il numero da tenere. `backups/` non e' nel repo.
 *
 * pg_dump gira dentro l'immagine ufficiale di Postgres, della stessa versione del
 * database (17): non serve installarlo, basta Docker, e una versione di pg_dump
 * piu' vecchia del server si rifiuterebbe di copiarlo. Dentro un container
 * «localhost» e' il container stesso: un indirizzo locale diventa
 * host.docker.internal, cioe' il computer su cui gira Docker.
 *
 * Per ripristinare (cancella e riscrive le tabelle del database di destinazione):
 *
 *   docker run --rm -i postgres:17-alpine pg_restore --clean --if-exists --no-owner \
 *     -d "postgresql://..." < backups/gachazone-....dump
 *
 * Nel database ci sono gli account, gli hash delle password e le schermate in
 * attesa di verifica: le copie vanno tenute come il database, non in giro.
 */

import { spawn } from "node:child_process";
import {
  createWriteStream,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";

import { loadEnv, requireDatabaseUrl } from "./env.mjs";

loadEnv();
const url = requireDatabaseUrl();

const tieniArg = process.argv.indexOf("--tieni");
const tieni = tieniArg > 0 ? Number(process.argv[tieniArg + 1]) : 14;
if (!Number.isInteger(tieni) || tieni < 1) {
  console.error("--tieni vuole un numero intero da 1 in su.");
  process.exit(1);
}

const dalContainer = url.replace(/@(localhost|127\.0\.0\.1)([:/])/, "@host.docker.internal$2");

const cartella = resolve(process.cwd(), "backups");
mkdirSync(cartella, { recursive: true });

const ora = new Date();
const due = (n: number) => String(n).padStart(2, "0");
const nome = `gachazone-${ora.getFullYear()}-${due(ora.getMonth() + 1)}-${due(ora.getDate())}-${due(ora.getHours())}${due(ora.getMinutes())}.dump`;
const finale = join(cartella, nome);
// si scrive accanto e si rinomina alla fine: una copia interrotta a meta' non deve
// sembrare buona, ne' far cancellare una copia vecchia che lo e'
const parziale = `${finale}.parziale`;

const esito = await new Promise<{ codice: number | null; errore: string }>((risolvi) => {
  const processo = spawn(
    "docker",
    ["run", "--rm", "postgres:17-alpine", "pg_dump", "--format=custom", "--no-owner", "--no-privileges", dalContainer],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let errore = "";
  processo.stderr.on("data", (pezzo: Buffer) => (errore += pezzo.toString()));
  // il processo puo' chiudersi prima che il file sia scritto tutto: si aspettano
  // tutte e due le cose
  const file = createWriteStream(parziale);
  const scritto = new Promise<void>((fatto) => file.on("close", () => fatto()));
  processo.stdout.pipe(file);
  processo.on("error", (e) => risolvi({ codice: -1, errore: e.message }));
  processo.on("close", (codice) => void scritto.then(() => risolvi({ codice, errore })));
});

if (esito.codice !== 0) {
  rmSync(parziale, { force: true });
  console.error(`Copia non riuscita (pg_dump ha dato ${esito.codice}).\n${esito.errore.trim()}`);
  if (/ENOENT|not recognized|non .* riconosciuto/i.test(esito.errore)) {
    console.error("Serve Docker: e' acceso?");
  }
  process.exit(1);
}

// pg_dump in formato custom comincia sempre con «PGDMP»: un file senza non e' una copia
const { size } = statSync(parziale);
if (readFileSync(parziale).subarray(0, 5).toString("latin1") !== "PGDMP") {
  rmSync(parziale, { force: true });
  console.error("Il file scritto non e' una copia di pg_dump: niente salvato.");
  process.exit(1);
}
renameSync(parziale, finale);

const copie = readdirSync(cartella)
  .filter((f) => /^gachazone-\d{4}-\d{2}-\d{2}-\d{4}\.dump$/.test(f))
  .sort()
  .reverse();
for (const vecchia of copie.slice(tieni)) rmSync(join(cartella, vecchia));

console.log(
  `Copia scritta: backups/${nome} (${(size / 1024).toFixed(0)} KB). ` +
    `Copie tenute: ${Math.min(copie.length, tieni)}${copie.length > tieni ? `, cancellate ${copie.length - tieni}` : ""}.`,
);
