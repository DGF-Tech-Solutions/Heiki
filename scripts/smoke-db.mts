/**
 * Verifica di fumo contro il database reale.
 *
 * L'archivio in memoria e' coperto dai test unitari; quello su Postgres non lo
 * era. Sono due implementazioni della stessa interfaccia, e la seconda ha tutto
 * cio' che la prima non ha: transazioni, chiavi esterne, join, conversioni di
 * tipo, vincoli di unicita'. Un test unitario non le tocca.
 *
 * Esercita il percorso vero: crea utenti, pubblica, commenta, risponde, vota,
 * segue, notifica, riverifica un allegato. Lascia i dati sul posto, cosi' il
 * sito resta navigabile con contenuti reali.
 *
 *   npm run db:smoke
 */

import { and, eq, inArray, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { loadEnv, requireDatabaseUrl } from "./env.mjs";

loadEnv();
requireDatabaseUrl();

const { db } = await import("@/lib/db");
const schema = await import("@/lib/db/schema");
const { getStore } = await import("@/lib/community/store");
const { requireGameModule } = await import("@/lib/games/registry");
const { ITERATIONS, simulateTeam } = await import("@/lib/games/preview");
const { cachedCheck } = await import("@/lib/community/verify");
const { getGuideStore } = await import("@/lib/guides/store");
const { suspensionFor } = await import("@/lib/moderation/suspension");


let failures = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ok      ${label}`);
  } else {
    failures++;
    console.log(`  FALLITO ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Utente di prova, creato solo se manca: lo script e' rilanciabile. */
async function ensureUser(username: string, email: string, displayName: string): Promise<string> {
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

  console.log("Verifica su database reale\n");

  const store = await getStore();
  check("l'archivio scelto e' quello su database", store.volatile === false);
  if (store.volatile) {
    console.log("\nPostgres non risponde: avvia `docker compose up -d`.");
    process.exit(1);
  }

  /* ------------------------------------------------------------ utente -- */

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

  /* ----------------------------------------------------- pubblicazione -- */

  // L'allegato e' CALCOLATO dal motore, non inventato: e' l'unico modo per
  // verificare che la riverifica confermi un allegato onesto. Con numeri a caso
  // il controllo direbbe "non riprodotto" e non si saprebbe se ha ragione.
  const gameModule = requireGameModule("grand-cross");
  const teamIds = gameModule.characters.slice(0, 2).map((character) => character.id);
  const simulated = simulateTeam(gameModule, teamIds, undefined, {
    seed: 424242,
    iterations: ITERATIONS,
  });
  if (!simulated) throw new Error("simulazione non disponibile");

  const honestAttachment = {
    kind: "simulation" as const,
    game: gameModule.name,
    character: gameModule.characters[0]?.name ?? "",
    team: teamIds.map(
      (id) => gameModule.characters.find((character) => character.id === id)?.name ?? id,
    ),
    median: simulated.damage.median,
    p10: simulated.damage.p10,
    p90: simulated.damage.p90,
    timeToKill: simulated.timeToKill?.median ?? null,
    timeUnit: gameModule.timeUnit,
    killRate: simulated.killRate,
    patch: gameModule.dataset.patch,
    seed: 424242,
    iterations: simulated.iterations,
    characterIds: teamIds,
  };

  const postId = await store.createPost(
    {
      game: "grand-cross",
      hub: "build",
      title: "Verifica di fumo sul database reale",
      body: "Post creato dallo script di verifica per esercitare transazioni, join e conversioni di tipo.",
      attachment: honestAttachment,
    },
    viewer,
  );
  check("il post viene creato", typeof postId === "string" && postId.length > 0);

  const created = await store.getPost(postId, viewer);
  check("il post si rilegge", created !== null);
  check(
    "lo slug della sezione non porta il prefisso del gioco",
    created?.hub === "build",
    created?.hub,
  );
  check("il gioco viene risolto dall'hub", created?.game === "grand-cross", created?.game);
  check("l'allegato sopravvive al giro in jsonb", created?.attachment?.seed === 424242);
  check(
    "le iterazioni sopravvivono al giro in jsonb",
    created?.attachment?.iterations === ITERATIONS,
  );
  check("l'autore vota il proprio post", created?.myVote === 1);

  /* --------------------------------------------------------- commenti -- */

  await store.createComment({ postId, body: "Primo commento di verifica." }, viewer);
  const withComment = await store.getPost(postId, viewer);
  const rootId = withComment?.comments[0]?.id;
  check("il commento compare", withComment?.comments.length === 1);
  check("il conteggio dei commenti si aggiorna", withComment?.commentCount === 1);

  await store.createComment({ postId, parentId: rootId, body: "Risposta annidata." }, viewer);
  const withReply = await store.getPost(postId, viewer);
  check(
    "la risposta si annida sotto il commento giusto",
    withReply?.comments[0]?.replies.length === 1,
  );
  check("il conteggio include le risposte annidate", withReply?.commentCount === 2);

  /* -------------------------------------------------------------- voti -- */

  const before = withReply?.score ?? 0;
  await store.votePost(postId, -1, viewer);
  const flipped = await store.getPost(postId, viewer);
  check(
    "passare da +1 a -1 sposta di due",
    flipped?.score === before - 2,
    `${before} -> ${flipped?.score}`,
  );

  await store.votePost(postId, 0, viewer);
  const cleared = await store.getPost(postId, viewer);
  check("annullare il voto riporta a zero", cleared?.score === before - 1, String(cleared?.score));
  check("il voto annullato non risulta piu' dato", cleared?.myVote === 0);

  /* -------------------------------------------------------------- feed -- */

  const feed = await store.listPosts("grand-cross", null, viewer);
  check(
    "il post compare nel feed del gioco",
    feed.some((item) => item.id === postId),
  );

  const filtered = await store.listPosts("grand-cross", "build", viewer);
  check(
    "il filtro per sezione funziona",
    filtered.some((item) => item.id === postId),
  );

  const otherGame = await store.listPosts("genshin-impact", null, viewer);
  check(
    "il feed di un altro gioco non lo contiene",
    !otherGame.some((item) => item.id === postId),
  );

  // Dal 10/10 il database non ha piu' lo sponsor d'esempio (seed.mts non lo
  // crea): si controlla che la lettura riesca, non che ci sia una riga.
  const sponsors = await store.listSponsors();
  check("gli slot sponsorizzati si leggono", Array.isArray(sponsors));

  /* ----------------------------------------------------- grafo sociale -- */

  // Si opera sulle tabelle e non sulle azioni server: quelle chiamano auth(),
  // che fuori da una richiesta Next non esiste. Qui interessano vincoli, chiavi
  // esterne e conteggi, cioe' cio' che un test unitario non tocca.
  const otherId = await ensureUser("collaudo2", "collaudo2@esempio.it", "Collaudo Due");
  check("secondo utente creato", otherId !== userId);

  await db
    .insert(schema.follows)
    .values({ followerId: otherId, followingId: userId })
    .onConflictDoNothing();

  const followers = await db.$count(schema.follows, eq(schema.follows.followingId, userId));
  check("il seguace viene contato", followers >= 1, String(followers));

  // La chiave primaria composta deve impedire il doppione, non la query.
  await db
    .insert(schema.follows)
    .values({ followerId: otherId, followingId: userId })
    .onConflictDoNothing();
  const afterDuplicate = await db.$count(schema.follows, eq(schema.follows.followingId, userId));
  check("seguire due volte non duplica", afterDuplicate === followers, String(afterDuplicate));

  /* --------------------------------------------------------- notifiche -- */

  await db.insert(schema.notifications).values({
    userId,
    actorId: otherId,
    type: "POST_REPLY",
    postId,
  });

  const unread = await db.$count(
    schema.notifications,
    and(eq(schema.notifications.userId, userId), isNull(schema.notifications.readAt)),
  );
  check("la notifica risulta da leggere", unread >= 1, String(unread));

  const withRefs = await db.query.notifications.findFirst({
    where: eq(schema.notifications.userId, userId),
    with: { actor: true, post: { with: { hub: { with: { game: true } } } } },
  });
  check("la notifica risolve l'attore", withRefs?.actor.username === "collaudo2");
  check("la notifica risolve il gioco dal post", withRefs?.post?.hub.game?.slug === "grand-cross");

  await db
    .update(schema.notifications)
    .set({ readAt: new Date() })
    .where(and(eq(schema.notifications.userId, userId), isNull(schema.notifications.readAt)));

  const stillUnread = await db.$count(
    schema.notifications,
    and(eq(schema.notifications.userId, userId), isNull(schema.notifications.readAt)),
  );
  check("segnare come lette azzera il conteggio", stillUnread === 0, String(stillUnread));

  /* ----------------------------------------- riverifica dell'allegato -- */

  const attachment = created?.attachment;
  if (!attachment) {
    check("allegato presente per la riverifica", false, "assente");
  } else {
    const honest = await cachedCheck(postId, "grand-cross", attachment);
    check("un allegato onesto risulta verificato", honest.status === "match", honest.status);

    const again = await cachedCheck(postId, "grand-cross", attachment);
    check("l'esito viene memorizzato e riletto", again.status === "match");

    const stored = await db.query.attachmentChecks.findFirst({
      where: eq(schema.attachmentChecks.postId, postId),
    });
    check("l'esito e' su database con la versione del motore", stored?.engineVersion === "0.1");
    check("l'esito memorizzato dice che coincide", stored?.matches === true);

    // Secondo post con la mediana gonfiata: la riverifica deve accorgersene.
    const inflatedId = await store.createPost(
      {
        game: "grand-cross",
        hub: "build",
        title: "Allegato con mediana gonfiata, di proposito",
        body: "Serve alla verifica di fumo: i numeri dichiarati non corrispondono al seed.",
        attachment: { ...honestAttachment, median: honestAttachment.median * 1.5 },
      },
      viewer,
    );

    const inflatedPost = await store.getPost(inflatedId, viewer);
    const inflatedCheck = inflatedPost?.attachment
      ? await cachedCheck(inflatedId, "grand-cross", inflatedPost.attachment)
      : null;
    check(
      "una mediana gonfiata risulta non riprodotta",
      inflatedCheck?.status === "mismatch",
      inflatedCheck?.status,
    );
  }

  /* --------------------------------------------------- segnalazioni -- */

  // Le azioni di moderazione passano da auth() e qui non c'e' una sessione:
  // si esercita quindi il livello sotto, quello che contiene le regole sui dati
  // - inserimento della segnalazione, effetto del nascondere sul feed, stato
  // della sospensione.
  const [report] = await db
    .insert(schema.reports)
    .values({
      reporterId: otherId,
      targetType: "POST",
      targetId: postId,
      reason: "numeri",
      details: "Verifica di fumo.",
    })
    .returning({ id: schema.reports.id });

  const openReports = await db.$count(schema.reports, eq(schema.reports.status, "OPEN"));
  check("la segnalazione entra in coda aperta", openReports >= 1, String(openReports));

  await db.update(schema.posts).set({ hidden: true }).where(eq(schema.posts.id, postId));

  const hiddenFeed = await store.listPosts("grand-cross", null, viewer);
  check(
    "un post nascosto esce dal feed",
    !hiddenFeed.some((post) => post.id === postId),
    `${hiddenFeed.length} nel feed`,
  );

  const hiddenDetail = await store.getPost(postId, viewer);
  check("il post nascosto resta leggibile e si dichiara tale", hiddenDetail?.hidden === true);

  await db.update(schema.posts).set({ hidden: false }).where(eq(schema.posts.id, postId));
  const restored = await store.listPosts("grand-cross", null, viewer);
  check(
    "ripristinarlo lo riporta nel feed",
    restored.some((post) => post.id === postId),
  );

  if (report) {
    await db
      .update(schema.reports)
      .set({ status: "RESOLVED" })
      .where(eq(schema.reports.id, report.id));

    const stillOpen = await db.$count(
      schema.reports,
      and(eq(schema.reports.id, report.id), eq(schema.reports.status, "OPEN")),
    );
    check("chiudere la segnalazione la toglie dalla coda", stillOpen === 0);
  }

  /* ---------------------------------------------------- sospensioni -- */

  const beforeSuspension = await suspensionFor(otherId);
  check("senza provvedimenti l'account non risulta sospeso", beforeSuspension.active === false);

  const [suspension] = await db
    .insert(schema.suspensions)
    .values({
      userId: otherId,
      moderatorId: userId,
      reason: "Verifica di fumo: sospensione a termine.",
      until: new Date(Date.now() + 86_400_000),
    })
    .returning({ id: schema.suspensions.id });

  const during = await suspensionFor(otherId);
  check("la sospensione attiva viene letta col motivo", during.active && Boolean(during.reason));

  if (suspension) {
    await db
      .update(schema.suspensions)
      .set({ liftedAt: new Date() })
      .where(eq(schema.suspensions.id, suspension.id));
  }

  check("revocarla la spegne", (await suspensionFor(otherId)).active === false);

  // Una sospensione scaduta non deve valere: la scadenza si valuta in lettura,
  // e senza questo controllo servirebbe un lavoro periodico per spegnerla.
  const [expired] = await db
    .insert(schema.suspensions)
    .values({
      userId: otherId,
      moderatorId: userId,
      reason: "Verifica di fumo: sospensione scaduta.",
      until: new Date(Date.now() - 86_400_000),
    })
    .returning({ id: schema.suspensions.id });

  check("una sospensione scaduta non blocca piu'", (await suspensionFor(otherId)).active === false);

  if (expired) {
    await db.delete(schema.suspensions).where(eq(schema.suspensions.id, expired.id));
  }

  /* --------------------------------------------------------- guide -- */

  const guideStore = await getGuideStore();
  check("l'archivio delle guide e' quello su database", guideStore.volatile === false);

  const writer = { id: userId, username: "collaudo", displayName: "Collaudo", accent: "ocean" };
  const guideTitle = "Verifica di fumo della sezione guide";
  const guideBody = [
    "## Perche' questa guida esiste",
    "",
    "Serve alla verifica di fumo per esercitare creazione, revisione e dichiarazione della patch sul database vero, con un corpo abbastanza lungo da superare la soglia minima prevista dal modulo di scrittura.",
    "",
    "- primo punto",
    "- secondo punto",
  ].join("\n");

  const known = await guideStore.get("grand-cross", "verifica-di-fumo-della-sezione-guide");
  const guideSlugUsed =
    known?.slug ??
    (await guideStore.create(
      { game: "grand-cross", title: guideTitle, body: guideBody, characterId: null },
      writer,
    ));

  const guide = await guideStore.get("grand-cross", guideSlugUsed);

  if (!guide) {
    check("la guida di prova esiste", false, "non rileggibile");
  } else {
    // Rilanciabile: se la guida c'era gia' pubblicata, la si riporta a bozza
    // per esercitare comunque tutto il percorso.
    if (guide.status !== "DRAFT") await guideStore.setStatus(guide.id, "DRAFT");

    const draft = await guideStore.get("grand-cross", guideSlugUsed);
    check("la guida parte come bozza", draft?.status === "DRAFT", draft?.status);

    check(
      "una bozza non compare nell'elenco pubblico",
      !(await guideStore.list("grand-cross")).some((item) => item.slug === guideSlugUsed),
    );
    check(
      "la bozza compare a chi revisiona",
      (await guideStore.list("grand-cross", { includeUnpublished: true })).some(
        (item) => item.slug === guideSlugUsed,
      ),
    );

    await guideStore.setStatus(guide.id, "PUBLISHED");
    const published = await guideStore.get("grand-cross", guideSlugUsed);
    check("pubblicarla le assegna una data", published?.publishedAt !== null);
    check(
      "pubblicata compare nell'elenco pubblico",
      (await guideStore.list("grand-cross")).some((item) => item.slug === guideSlugUsed),
    );

    const patch = requireGameModule("grand-cross").dataset.patch;
    await guideStore.setVerifiedPatch(guide.id, patch, writer);
    const verified = await guideStore.get("grand-cross", guideSlugUsed);
    check("la patch dichiarata viene riletta", verified?.verifiedPatch === patch);
    check("la dichiarazione lascia traccia in cronologia", (verified?.revisions.length ?? 0) >= 1);

    await guideStore.update(guide.id, { title: guideTitle }, writer, "nota della verifica");
    const edited = await guideStore.get("grand-cross", guideSlugUsed);
    check(
      "la modifica aggiunge una voce di cronologia",
      (edited?.revisions.length ?? 0) > (verified?.revisions.length ?? 0),
    );

    // Lo slug e' unico su tutta la tabella, ma l'indirizzo contiene il gioco:
    // chiedere la stessa guida sotto un altro gioco non deve trovarla.
    check(
      "una guida non e' raggiungibile dall'indirizzo di un altro gioco",
      (await guideStore.get("genshin-impact", guideSlugUsed)) === null,
    );
  }

  // I post della verifica non restano nel database: finivano nella home e nelle
  // Discussioni come se fossero della community (10/10, tolti su richiesta)
  await db
    .delete(schema.posts)
    .where(
      and(
        eq(schema.posts.authorId, viewer.id),
        inArray(schema.posts.title, ["Verifica di fumo sul database reale", "Allegato con mediana gonfiata, di proposito"]),
      ),
    );

  console.log(failures === 0 ? "\nTutti i controlli superati." : `\n${failures} controlli falliti.`);
  process.exit(failures === 0 ? 0 : 1);
}

await main();
