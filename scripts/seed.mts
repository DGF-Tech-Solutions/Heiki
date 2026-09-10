/**
 * Popolamento iniziale del database.
 *
 * Un database migrato ma vuoto non fa funzionare l'app: il feed ha bisogno degli
 * hub, il profilo dei badge e dei cosmetici, le build della dataset version. Le
 * migrazioni creano la forma, questo script mette il contenuto minimo perche' il
 * sito sia usabile.
 *
 * E' idempotente: si puo' rilanciare su un database gia' popolato senza
 * duplicare niente. Serve perche' verra' rilanciato ogni volta che si aggiunge
 * un gioco o un badge.
 *
 * Le fonti sono le stesse che usa l'applicazione - il catalogo dei giochi, il
 * registro dei moduli, il catalogo dei cosmetici - quindi non esiste un elenco
 * parallelo da tenere allineato a mano.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";

loadEnv();

const { db } = await import("@/lib/db");
const schema = await import("@/lib/db/schema");
const { listGames } = await import("@/lib/games/catalog");
const { getGameModule } = await import("@/lib/games/registry");
const { HUBS } = await import("@/lib/community/types");
const customization = await import("@/lib/profile/customization");

/** Legge .env senza dipendenze: poche righe, niente pacchetto in piu'. */
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

const BADGES = [
  {
    code: "platform.first-guide",
    family: "PLATFORM" as const,
    name: "Prima guida pubblicata",
    description: "Hai scritto una guida approvata dalla redazione.",
    rarity: 2,
    iconKey: "quill",
    criteria: { type: "guidesPublished", min: 1 },
  },
  {
    code: "platform.hundred-votes",
    family: "PLATFORM" as const,
    name: "100 voti ricevuti",
    description: "Cento voti positivi sui tuoi contenuti.",
    rarity: 2,
    iconKey: "arrow-up",
    criteria: { type: "votesReceived", min: 100 },
  },
  {
    code: "platform.beta",
    family: "PLATFORM" as const,
    name: "Beta tester",
    description: "C'eri prima che il sito fosse pronto.",
    rarity: 3,
    iconKey: "diamond",
    criteria: { type: "manual" },
  },
  {
    code: "platform.helpful",
    family: "PLATFORM" as const,
    name: "Risposta utile",
    description: "Una tua risposta è stata segnata come utile.",
    rarity: 1,
    iconKey: "check",
    criteria: { type: "helpfulComments", min: 1 },
  },
  {
    code: "game.full-roster",
    family: "GAME" as const,
    name: "Roster completo",
    description: "Possiedi tutti i personaggi del gioco.",
    rarity: 3,
    iconKey: "star",
    criteria: { type: "rosterComplete" },
  },
  {
    code: "game.perfect-gear",
    family: "GAME" as const,
    name: "Equipaggiamento perfetto",
    description: "Un set con valori massimi su tutte le statistiche utili.",
    rarity: 3,
    iconKey: "gem",
    criteria: { type: "perfectGear", min: 1 },
  },
];

async function seedGames(): Promise<Map<string, string>> {
  const ids = new Map<string, string>();

  for (const [index, game] of listGames().entries()) {
    const module = getGameModule(game.slug);
    const paradigm =
      module?.paradigm === "stochastic"
        ? "STOCHASTIC"
        : module?.paradigm === "turn"
          ? "TURN"
          : "TIMELINE";

    const existing = await db.query.games.findFirst({
      where: eq(schema.games.slug, game.slug),
      columns: { id: true },
    });

    if (existing) {
      await db
        .update(schema.games)
        .set({ name: game.name, publisher: game.publisher, active: game.available, sortIndex: index })
        .where(eq(schema.games.id, existing.id));
      ids.set(game.slug, existing.id);
      continue;
    }

    const [created] = await db
      .insert(schema.games)
      .values({
        slug: game.slug,
        name: game.name,
        publisher: game.publisher,
        paradigm,
        active: game.available,
        sortIndex: index,
      })
      .returning({ id: schema.games.id });

    if (created) ids.set(game.slug, created.id);
  }

  return ids;
}

async function seedDatasets(gameIds: ReadonlyMap<string, string>): Promise<void> {
  for (const [slug, gameId] of gameIds) {
    const module = getGameModule(slug);
    if (!module) continue;

    await db
      .insert(schema.datasetVersions)
      .values({
        gameId,
        patch: module.dataset.patch,
        checksum: module.dataset.checksum,
        releasedAt: new Date(module.dataset.releasedAt),
        isCurrent: true,
      })
      .onConflictDoNothing();
  }
}

/**
 * Gli hub sono per gioco: la stessa sezione esiste in ognuno. Lo slug porta il
 * gioco davanti perche' e' unico a livello di tabella - la stessa convenzione
 * usata dall'archivio quando crea un hub al volo.
 */
async function seedHubs(gameIds: ReadonlyMap<string, string>): Promise<void> {
  for (const [slug, gameId] of gameIds) {
    if (!getGameModule(slug)) continue;

    for (const hub of HUBS) {
      await db
        .insert(schema.hubs)
        .values({
          gameId,
          slug: `${slug}:${hub.slug}`,
          name: hub.name,
          description: hub.description,
        })
        .onConflictDoNothing();
    }
  }
}

async function seedBadges(gameIds: ReadonlyMap<string, string>): Promise<void> {
  const grandCross = gameIds.get("grand-cross") ?? null;

  for (const badge of BADGES) {
    await db
      .insert(schema.badges)
      .values({
        code: badge.code,
        family: badge.family,
        gameId: badge.family === "GAME" ? grandCross : null,
        name: badge.name,
        description: badge.description,
        rarity: badge.rarity,
        iconKey: badge.iconKey,
        criteria: badge.criteria,
      })
      .onConflictDoNothing();
  }
}

/**
 * I cosmetici acquistabili nascono dal catalogo dell'editor: se domani si
 * aggiunge un'opzione premium, questo script la porta nel listino senza che
 * qualcuno debba ricordarsi di aggiornare due elenchi.
 */
async function seedCosmetics(): Promise<void> {
  const groups = [
    { type: "THEME" as const, options: customization.ACCENTS, price: 200 },
    { type: "FRAME" as const, options: customization.FRAMES, price: 150 },
    { type: "BACKGROUND" as const, options: customization.BACKGROUNDS, price: 150 },
    { type: "LAYOUT" as const, options: customization.LAYOUTS, price: 0 },
  ];

  for (const group of groups) {
    for (const option of group.options) {
      await db
        .insert(schema.cosmetics)
        .values({
          code: `${group.type.toLowerCase()}.${option.id}`,
          type: group.type,
          name: option.label,
          description: option.description,
          priceCents: option.premium ? group.price : 0,
          premiumOnly: option.premium,
          active: true,
        })
        .onConflictDoNothing();
    }
  }
}

async function seedSponsor(gameIds: ReadonlyMap<string, string>): Promise<void> {
  const existing = await db.query.sponsorPlacements.findFirst({ columns: { id: true } });
  if (existing) return;

  const now = new Date();
  const end = new Date(now.getTime() + 365 * 24 * 3_600_000);

  await db.insert(schema.sponsorPlacements).values({
    gameId: gameIds.get("grand-cross") ?? null,
    advertiser: "Esempio",
    title: "Questo spazio è uno slot sponsorizzato",
    body: "Sta fuori dal feed organico e resta etichettato. I post a pagamento dentro la lista non esistono, per scelta.",
    targetUrl: "https://example.com",
    startsAt: now,
    endsAt: end,
    active: true,
  });
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL non impostata: copia .env.example in .env");
  }

  console.log("Popolamento in corso…");

  const gameIds = await seedGames();
  console.log(`  giochi: ${gameIds.size}`);

  await seedDatasets(gameIds);
  await seedHubs(gameIds);
  await seedBadges(gameIds);
  await seedCosmetics();
  await seedSponsor(gameIds);

  const counts = await Promise.all([
    db.$count(schema.games),
    db.$count(schema.datasetVersions),
    db.$count(schema.hubs),
    db.$count(schema.badges),
    db.$count(schema.cosmetics),
    db.$count(schema.sponsorPlacements),
  ]);

  console.log("Fatto:");
  console.log(`  games              ${counts[0]}`);
  console.log(`  dataset_versions   ${counts[1]}`);
  console.log(`  hubs               ${counts[2]}`);
  console.log(`  badges             ${counts[3]}`);
  console.log(`  cosmetics          ${counts[4]}`);
  console.log(`  sponsor_placements ${counts[5]}`);

  process.exit(0);
}

await main();
