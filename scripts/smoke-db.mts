/**
 * Verifica di fumo contro il database reale.
 *
 * L'archivio in memoria e' coperto dai test unitari; quello su Postgres finora
 * non era mai stato eseguito. Sono due implementazioni della stessa interfaccia,
 * e la seconda ha tutto cio' che la prima non ha: transazioni, chiavi esterne,
 * join, conversioni di tipo. Un test unitario non le tocca.
 *
 * Questo script esercita il percorso vero: crea un utente, pubblica, commenta,
 * risponde, vota, rilegge e controlla. Lascia i dati sul posto, cosi' il sito
 * resta navigabile con contenuti reali.
 *
 *   npm run db:smoke
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

loadEnv();

const { db } = await import("../src/lib/db/index.ts");
const schema = await import("../src/lib/db/schema.ts");
const { getStore } = await import("../src/lib/community/store.ts");

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

let failures = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ok    ${label}`);
  } else {
    failures++;
    console.log(`  FALLITO ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Utente di prova, ricreato solo se manca: lo script e' rilanciabile. */
async function ensureUser(username: string, email: string, displayName: string) {
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.username, username),
    columns: { id: true },
  });
  if (existing) return existing.id;

  const passwordHash = await bcrypt.hash("prova-molto-lunga", 12);

  return db.transaction(async (tx) => {
    const [created] = await tx
      .insert(schema.users)
      .values({ email, username, name: displayName, passwordHash, role: "EDITOR" })
      .returning({ id: schema.users.id });

    if (!created) throw new Error("creazione utente fallita");

    await tx.insert(schema.profiles).values({
      userId: created.id,
      displayName,
      bio: "Utente di prova creato dalla verifica di fumo.",
      country: "Italia",
      xp: 1240,
      cosmetics: { accent: "ocean", frame: "double", background: "dots", layout: "standard" },
      favorites: ["Unità Forza"],
    });

    return created.id;
  });
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL non impostata");

  console.log("Verifica su database reale\n");

  const store = await getStore();
  check("l'archivio scelto e' quello su database", store.volatile === false);
  if (store.volatile) {
    console.log("\nPostgres non risponde: avvia `docker compose up -d`.");
    process.exit(1);
  }

  const userId = await ensureUser("collaudo", "collaudo@esempio.it", "Collaudo");
  const row = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    columns: { id: true, username: true, role: true },
    with: { profile: true },
  });
  check("utente e profilo esistono", row?.profile != null);
  check("i cosmetici sopravvivono al giro in jsonb", row?.profile?.cosmetics?.accent === "ocean");
  check("i preferiti sopravvivono al giro in jsonb", (row?.profile?.favorites ?? []).length === 1);

  const viewer = {
    id: userId,
    username: row?.username ?? "collaudo",
    displayName: row?.profile?.displayName ?? "Collaudo",
    role: row?.role ?? ("USER" as const),
    accent: "ocean",
  };

  // --- pubblicazione ------------------------------------------------------
  const postId = await store.createPost(
    {
      game: "grand-cross",
      hub: "build",
      title: "Verifica di fumo sul database reale",
      body: "Post creato dallo script di verifica per esercitare transazioni, join e conversioni di tipo.",
      attachment: {
        kind: "simulation",
        game: "The Seven Deadly Sins: Grand Cross",
        character: "Unità Forza",
        team: ["Unità Forza"],
        median: 123_456,
        p10: 98_000,
        p90: 150_000,
        timeToKill: 14,
        timeUnit: "turns",
        killRate: 0.71,
        patch: "0.0.0-placeholder",
        seed: 424242,
      },
    },
    viewer,
  );
  check("il post viene creato", typeof postId === "string" && postId.length > 0);

  const created = await store.getPost(postId, viewer);
  check("il post si rilegge", created !== null);
  check("lo slug della sezione non porta il prefisso del gioco", created?.hub === "build", created?.hub);
  check("il gioco viene risolto dall'hub", created?.game === "grand-cross", created?.game);
  check("l'allegato sopravvive al giro in jsonb", created?.attachment?.seed === 424242);
  check("l'autore vota il proprio post", created?.myVote === 1);

  // --- commenti -----------------------------------------------------------
  await store.createComment({ postId, body: "Primo commento di verifica." }, viewer);
  const withComment = await store.getPost(postId, viewer);
  const rootId = withComment?.comments[0]?.id;
  check("il commento compare", withComment?.comments.length === 1);
  check("il conteggio dei commenti si aggiorna", withComment?.commentCount === 1);

  await store.createComment({ postId, parentId: rootId, body: "Risposta annidata." }, viewer);
  const withReply = await store.getPost(postId, viewer);
  check("la risposta si annida sotto il commento giusto", withReply?.comments[0]?.replies.length === 1);
  check("il conteggio include le risposte annidate", withReply?.commentCount === 2);

  // --- voti ---------------------------------------------------------------
  const before = withReply?.score ?? 0;
  await store.votePost(postId, -1, viewer);
  const flipped = await store.getPost(postId, viewer);
  check("passare da +1 a -1 sposta di due", flipped?.score === before - 2, `${before} -> ${flipped?.score}`);

  await store.votePost(postId, 0, viewer);
  const cleared = await store.getPost(postId, viewer);
  check("annullare il voto riporta a zero", cleared?.score === before - 1, String(cleared?.score));
  check("il voto annullato non risulta piu' dato", cleared?.myVote === 0);

  // --- feed ---------------------------------------------------------------
  const feed = await store.listPosts("grand-cross", null, viewer);
  check("il post compare nel feed del gioco", feed.some((item) => item.id === postId));

  const filtered = await store.listPosts("grand-cross", "build", viewer);
  check("il filtro per sezione funziona", filtered.some((item) => item.id === postId));

  const otherGame = await store.listPosts("genshin-impact", null, viewer);
  check("il feed di un altro gioco non lo contiene", !otherGame.some((item) => item.id === postId));

  const sponsors = await store.listSponsors();
  check("lo slot sponsorizzato viene letto", sponsors.length > 0);

  console.log(
    failures === 0
      ? "\nTutti i controlli superati."
      : `\n${failures} controlli falliti.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

await main();
