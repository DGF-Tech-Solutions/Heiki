/**
 * Preparazione dell'ambiente di sviluppo.
 *
 *   npm run setup
 *
 * Fa tutto quello che un collega dovrebbe altrimenti ricordarsi a memoria:
 * crea il .env con un segreto generato, avvia Postgres, applica le migrazioni,
 * popola i dati minimi. E' idempotente: rilanciarlo su un ambiente gia' pronto
 * non rompe niente e non duplica niente.
 *
 * Usa solo moduli di Node: deve poter girare anche prima che le dipendenze
 * siano a posto, ed e' la prima cosa che si esegue dopo il clone.
 */

import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";

const ROOT = process.cwd();
const ENV = resolve(ROOT, ".env");
const ENV_EXAMPLE = resolve(ROOT, ".env.example");

const MIN_NODE_MAJOR = 20;

let step = 0;

function say(message) {
  console.log(`\n[${++step}] ${message}`);
}

function detail(message) {
  console.log(`    ${message}`);
}

function fail(message, hint) {
  console.error(`\n  ERRORE: ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.quiet ? "pipe" : "inherit",
    shell: process.platform === "win32",
    cwd: ROOT,
    encoding: "utf8",
  });
  return result;
}

function available(command, args = ["--version"]) {
  try {
    execFileSync(command, args, { stdio: "pipe", shell: process.platform === "win32" });
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ 1. node */

say("Controllo la versione di Node");
const major = Number(process.versions.node.split(".")[0]);
if (Number.isNaN(major) || major < MIN_NODE_MAJOR) {
  fail(
    `serve Node ${MIN_NODE_MAJOR} o superiore, qui c'e' ${process.versions.node}`,
    "Scarica la versione LTS da nodejs.org",
  );
}
detail(`Node ${process.versions.node} va bene`);

/* ---------------------------------------------------------- 2. dipendenze */

say("Controllo le dipendenze");
if (!existsSync(resolve(ROOT, "node_modules"))) {
  detail("node_modules manca: installo");
  // --legacy-peer-deps serve perche' next-auth v5 e' in beta e dichiara peer
  // dependency che npm 10 rifiuta di risolvere da solo.
  const install = run("npm", ["install", "--no-audit", "--no-fund", "--legacy-peer-deps"]);
  if (install.status !== 0) fail("installazione delle dipendenze fallita");
} else {
  detail("node_modules presente");
}

/* ----------------------------------------------------------------- 3. .env */

say("Preparo il file .env");
if (existsSync(ENV)) {
  detail(".env esiste già, non lo tocco");
} else {
  if (!existsSync(ENV_EXAMPLE)) fail(".env.example non trovato");
  copyFileSync(ENV_EXAMPLE, ENV);
  detail("copiato da .env.example");
}

// Il segreto e' l'unica cosa che non puo' stare nell'esempio: va generato per
// ogni sviluppatore. Senza, Auth.js rifiuta di partire.
let env = readFileSync(ENV, "utf8");
if (/^AUTH_SECRET\s*=\s*""?\s*$/m.test(env) || !/^AUTH_SECRET=/m.test(env)) {
  const secret = randomBytes(32).toString("base64");
  env = /^AUTH_SECRET=/m.test(env)
    ? env.replace(/^AUTH_SECRET\s*=.*$/m, `AUTH_SECRET="${secret}"`)
    : `${env.trimEnd()}\nAUTH_SECRET="${secret}"\n`;
  writeFileSync(ENV, env, "utf8");
  detail("AUTH_SECRET generato");
} else {
  detail("AUTH_SECRET già impostato");
}

/* --------------------------------------------------------------- 4. docker */

say("Avvio Postgres con Docker");
if (!available("docker")) {
  fail(
    "docker non è disponibile nel PATH",
    "Installa Docker Desktop da docker.com/products/docker-desktop e riavvia questo comando.",
  );
}

const info = run("docker", ["info"], { quiet: true });
if (info.status !== 0) {
  fail(
    "il demone Docker non risponde",
    "Apri Docker Desktop, attendi che sia avviato, poi rilancia `npm run setup`.",
  );
}

const up = run("docker", ["compose", "up", "-d"]);
if (up.status !== 0) fail("`docker compose up -d` non è andato a buon fine");

/* ------------------------------------------------------- 5. attesa del db */

say("Attendo che il database sia pronto");
let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  const check = run("docker", ["exec", "gachazone-db", "pg_isready", "-U", "gachazone"], {
    quiet: true,
  });
  if (check.status === 0) {
    ready = true;
    break;
  }
  await new Promise((done) => setTimeout(done, 1000));
}
if (!ready) fail("Postgres non ha risposto entro 40 secondi", "Controlla `docker compose logs`");
detail("database raggiungibile");

/* ------------------------------------------------- 6. migrazioni e dati */

say("Applico le migrazioni");
if (run("npm", ["run", "db:migrate"]).status !== 0) fail("migrazioni fallite");

say("Popolo i dati minimi");
if (run("npm", ["run", "db:seed"]).status !== 0) fail("popolamento fallito");

/* ------------------------------------------------------------- 7. chiusura */

console.log(`
Pronto.

  npm run dev        avvia il sito su http://localhost:3000
  npm test           esegue la suite
  npm run db:smoke   verifica il percorso sul database reale
  npm run db:reset   azzera il database e ricostruisce da zero

Il database e' popolato con giochi, sezioni, badge e cosmetici, ma senza
utenti: registrane uno da /registrati.
`);
