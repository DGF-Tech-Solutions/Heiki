/**
 * GachaZone - schema del Core (Drizzle / PostgreSQL).
 *
 * Principio: il Core non conosce elementi, reazioni o resina. I dati statici di
 * gioco (personaggi, abilita', nemici) NON stanno qui: vivono in file versionati
 * per patch sotto src/lib/games/<gioco>/data, cosi' sono diffabili in git e
 * riproducibili. Il database memorizza solo riferimenti (characterId) + la
 * datasetVersion con cui una build e' stata calcolata.
 */

import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

/** Byte grezzi (le schermate delle verifiche): postgres.js li restituisce come Buffer. */
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

// ------------------------------------------------------------------- enum

export const userRoleEnum = pgEnum("user_role", [
  "USER",
  "CONTRIBUTOR",
  "EDITOR",
  "MODERATOR",
  "ADMIN",
]);

export const xpReasonEnum = pgEnum("xp_reason", [
  "GUIDE_APPROVED",
  "GUIDE_FEATURED",
  "UPVOTE_RECEIVED",
  "BUILD_SAVED_BY_OTHERS",
  "COMMENT_MARKED_HELPFUL",
  "MANUAL_ADJUSTMENT",
]);

/**
 * GAME     verificabile dal profilo di gioco collegato
 * PLATFORM guadagnato con l'attivita' sul sito
 * COSMETIC puramente estetico, acquistabile
 */
export const badgeFamilyEnum = pgEnum("badge_family", ["GAME", "PLATFORM", "COSMETIC"]);

/**
 * VERIFIED letto da fonte pubblica (Enka). Porta il prestigio.
 * IMPORTED da scanner locale dell'utente: JSON modificabile, fiducia media.
 * DECLARED auto-dichiarato: nessuna spunta.
 */
export const badgeTrustEnum = pgEnum("badge_trust", ["VERIFIED", "IMPORTED", "DECLARED"]);

export const cosmeticTypeEnum = pgEnum("cosmetic_type", [
  "FRAME",
  "BACKGROUND",
  "EFFECT",
  "THEME",
  "LAYOUT",
]);

export const cosmeticGrantEnum = pgEnum("cosmetic_grant", [
  "PURCHASE",
  "SUBSCRIPTION",
  "REWARD",
  "GIFT",
]);

/**
 * TIMELINE   real-time deterministico: Genshin, ZZZ, WuWa
 * TURN       a turni deterministico: HSR
 * STOCHASTIC a turni con pescata casuale: Grand Cross -> Monte Carlo
 */
export const combatParadigmEnum = pgEnum("combat_paradigm", ["TIMELINE", "TURN", "STOCHASTIC"]);

export const guideStatusEnum = pgEnum("guide_status", [
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

/**
 * Lo stato di una strategia dell'Endgame. Un consiglio di squadra nasce
 * PUBLISHED; una guida (con un testo) nasce IN_REVIEW e la decide un
 * moderatore. REJECTED resta all'autore, col motivo, per correggerla.
 */
export const strategyStatusEnum = pgEnum("strategy_status", ["PUBLISHED", "IN_REVIEW", "REJECTED"]);

/** Le quattro modalita' dell'Endgame, coi nomi di `EndgameMode`. */
export const endgameModeEnum = pgEnum("endgame_mode", [
  "death-match",
  "creature-nest",
  "demon-king",
  "supreme-deity",
]);

export const voteTargetEnum = pgEnum("vote_target", ["POST", "COMMENT", "GUIDE", "BUILD"]);

/**
 * Su cosa agisce una riga del registro della moderazione. Fino all'11/10 il
 * registro usava `vote_target`, e le azioni su utenti, sponsor e verifiche non
 * avevano dove scriversi: sospensioni, revoche, ruoli e decisioni sulle
 * verifiche non lasciavano traccia (il ruolo si registrava come «POST»).
 */
export const modTargetEnum = pgEnum("mod_target", [
  "POST",
  "COMMENT",
  "GUIDE",
  "BUILD",
  "USER",
  "SPONSOR",
  "VERIFICATION",
  "STRATEGY",
]);

export const reportStatusEnum = pgEnum("report_status", ["OPEN", "RESOLVED", "DISMISSED"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "PAST_DUE",
  "CANCELED",
  "TRIALING",
]);

// --------------------------------------------------------------- identity

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    /** nome fornito dal provider OAuth. Richiesto dall'adapter Auth.js. */
    name: text("name"),
    /** handle scelto dall'utente, usato nell'URL del profilo: /u/<username> */
    username: text("username").notNull(),
    image: text("image"),
    /** null per gli account creati via OAuth: non hanno una password locale */
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").default("USER").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_key").on(table.email),
    uniqueIndex("users_username_key").on(table.username),
    index("users_role_idx").on(table.role),
  ],
);

/**
 * Tabelle richieste da Auth.js.
 *
 * La forma non e' negoziabile: l'adapter accede alle colonne per nome e si
 * aspetta chiavi primarie precise - il token di sessione e' esso stesso la
 * chiave, gli account sono identificati dalla coppia provider + id esterno.
 * Aggiungere una colonna id di comodo qui romperebbe l'adapter.
 */
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
    index("accounts_user_idx").on(table.userId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// ------------------------------------------------- profilo e progressione

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    country: text("country"),
    level: integer("level").default(1).notNull(),
    xp: integer("xp").default(0).notNull(),
    /** personalizzazione attiva: { accent, frame, background, layout } -> id opzione */
    cosmetics: jsonb("cosmetics").$type<Record<string, string>>().default({}).notNull(),
    /** personaggi preferiti, nell'ordine scelto dall'utente */
    favorites: jsonb("favorites").$type<string[]>().default([]).notNull(),
    cardTheme: text("card_theme").default("default").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("profiles_user_key").on(table.userId),
    index("profiles_level_idx").on(table.level),
  ],
);

/**
 * XP assegnato SOLO su segnali di apprezzamento altrui, mai sul volume prodotto:
 * dare XP per "post pubblicato" produce spam. Il log serve per audit e
 * anti-abuso (il tetto giornaliero si calcola su questa tabella).
 */
export const xpEvents = pgTable(
  "xp_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: xpReasonEnum("reason").notNull(),
    sourceType: text("source_type"),
    sourceId: text("source_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("xp_events_user_created_idx").on(table.userId, table.createdAt)],
);

export const badges = pgTable(
  "badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    family: badgeFamilyEnum("family").notNull(),
    gameId: uuid("game_id").references((): AnyPgColumn => games.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    rarity: integer("rarity").default(1).notNull(),
    iconKey: text("icon_key").notNull(),
    /**
     * Criterio macchina-leggibile valutato dal verificatore, es:
     * { "type": "characterConstellation", "characterId": "furina", "min": 6 }
     */
    criteria: jsonb("criteria").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("badges_code_key").on(table.code),
    index("badges_family_game_idx").on(table.family, table.gameId),
  ],
);

export const userBadges = pgTable(
  "user_badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    trust: badgeTrustEnum("trust").default("DECLARED").notNull(),
    source: text("source"),
    /**
     * Il badge verificato e' PERMANENTE: si conserva lo snapshot del momento
     * della verifica, altrimenti chi ruota la vetrina di gioco perde i badge.
     */
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_badges_user_badge_key").on(table.userId, table.badgeId),
    index("user_badges_user_trust_idx").on(table.userId, table.trust),
  ],
);

/** Quali badge l'utente espone sulla card condivisibile, e in che ordine. */
export const badgeShowcaseSlots = pgTable(
  "badge_showcase_slots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [
    uniqueIndex("badge_showcase_user_position_key").on(table.userId, table.position),
    index("badge_showcase_user_idx").on(table.userId),
  ],
);

/**
 * REGOLA NON NEGOZIABILE: si vende presentazione, mai status.
 * Un cosmetico e' sempre design originale nostro. Nessun asset ufficiale dei
 * publisher puo' essere venduto: quella e' l'unica cosa che ci mette nei guai.
 */
export const cosmetics = pgTable(
  "cosmetics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    type: cosmeticTypeEnum("type").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").default(0).notNull(),
    premiumOnly: boolean("premium_only").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
  },
  (table) => [
    uniqueIndex("cosmetics_code_key").on(table.code),
    index("cosmetics_type_active_idx").on(table.type, table.active),
  ],
);

export const ownedCosmetics = pgTable(
  "owned_cosmetics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cosmeticId: uuid("cosmetic_id")
      .notNull()
      .references(() => cosmetics.id, { onDelete: "cascade" }),
    grantedVia: cosmeticGrantEnum("granted_via").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("owned_cosmetics_user_cosmetic_key").on(table.userId, table.cosmeticId)],
);

// ------------------------------------------------------------------ giochi

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    publisher: text("publisher").notNull(),
    paradigm: combatParadigmEnum("paradigm").notNull(),
    active: boolean("active").default(false).notNull(),
    sortIndex: integer("sort_index").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("games_slug_key").on(table.slug),
    index("games_active_sort_idx").on(table.active, table.sortIndex),
  ],
);

/**
 * Ogni build salvata punta a una datasetVersion precisa: quando una patch cambia
 * i moltiplicatori, le build vecchie NON cambiano da sole. Si mostra
 * "calcolata su 6.1 - ricalcola su 6.2?".
 */
export const datasetVersions = pgTable(
  "dataset_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    patch: text("patch").notNull(),
    checksum: text("checksum").notNull(),
    releasedAt: timestamp("released_at", { withTimezone: true }).notNull(),
    isCurrent: boolean("is_current").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("dataset_versions_game_patch_key").on(table.gameId, table.patch),
    index("dataset_versions_game_current_idx").on(table.gameId, table.isCurrent),
  ],
);

// -------------------------------------------------- dati utente per gioco

export const gameAccounts = pgTable(
  "game_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    /** il codice con cui il gioco ti fa cercare (Grand Cross: il Codice amico); "" se non dato */
    uid: text("uid").notNull(),
    region: text("region"),
    nickname: text("nickname"),
    trust: badgeTrustEnum("trust").default("DECLARED").notNull(),
    lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
    /** la classe di combattimento dell'account come la scrive l'utente */
    accountPower: integer("account_power"),
    /**
     * Quello che il sito tiene anche nel browser (classe e costellazioni, forma
     * decisa dal modulo di gioco): qui per ritrovarlo su un altro dispositivo.
     */
    setup: jsonb("setup").$type<Record<string, unknown>>(),
    /**
     * Il box: gli eroi che l'utente ha e a che punto sono (forma compatta di
     * hero-box.ts, {v, h: {heroId: [livello, ...]}}). Una colonna e non una riga
     * per eroe (`roster_entries`, del primo schema e mai usata): si sincronizza col
     * browser tutto insieme, come `setup`, col timbro `updatedAt` (10/10).
     */
    box: jsonb("box").$type<Record<string, unknown>>(),
    /** l'ultima classe confermata da un moderatore, e quando */
    verifiedPower: integer("verified_power"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    /** vince sulla copia del browser se e' piu' recente (e viceversa) */
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("game_accounts_user_game_uid_key").on(table.userId, table.gameId, table.uid),
    index("game_accounts_game_uid_idx").on(table.gameId, table.uid),
  ],
);

export const rosterEntries = pgTable(
  "roster_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameAccountId: uuid("game_account_id")
      .notNull()
      .references(() => gameAccounts.id, { onDelete: "cascade" }),
    characterId: text("character_id").notNull(),
    level: integer("level").default(1).notNull(),
    rank: integer("rank").default(0).notNull(),
    favorite: boolean("favorite").default(false).notNull(),
    trust: badgeTrustEnum("trust").default("DECLARED").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("roster_entries_account_character_key").on(
      table.gameAccountId,
      table.characterId,
    ),
    index("roster_entries_account_favorite_idx").on(table.gameAccountId, table.favorite),
  ],
);

/**
 * OPEN      l'utente ha un eroe del giorno da mettere nei preferiti, niente schermata
 * PENDING   schermata caricata, aspetta un moderatore
 * APPROVED  / REJECTED  deciso da un moderatore (la schermata non c'e' piu')
 * CANCELLED ritirata dall'utente, o sostituita da una nuova
 */
export const verificationStatusEnum = pgEnum("verification_status", [
  "OPEN",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

/**
 * La verifica della classe di combattimento dell'account.
 *
 * Il gioco non ha API e non mostra a nessuno la classe dell'account di un altro
 * (solo dentro l'Ordine dei Cavalieri), quindi si prova con una schermata. Perche'
 * sia fatta oggi, apposta e da chi ha l'account in mano, il sito pesca un eroe
 * (`challengeHeroId`, del giorno `challengeDay`, diverso per ogni utente) da
 * mettere nei preferiti: nella lista Eroi del gioco, ordinata per preferiti, si
 * vedono insieme l'eroe e la classe dell'account. Idea dell'utente, 27/09.
 *
 * Decide un moderatore, che scrive il numero letto (`verifiedPower`). La schermata
 * sta in `verificationScreenshots` e si cancella alla decisione; resta l'impronta
 * del file (`screenshotHash`), per riconoscere chi ricarica la stessa immagine.
 */
export const powerVerifications = pgTable(
  "power_verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    gameAccountId: uuid("game_account_id")
      .notNull()
      .references(() => gameAccounts.id, { onDelete: "cascade" }),
    status: verificationStatusEnum("status").default("OPEN").notNull(),
    /** giorno UTC, AAAA-MM-GG: la schermata va caricata lo stesso giorno */
    challengeDay: text("challenge_day").notNull(),
    challengeHeroId: text("challenge_hero_id").notNull(),
    /** gli eroi scartati con «non ce l'ho», in ordine */
    skippedHeroIds: jsonb("skipped_hero_ids").$type<string[]>().default([]).notNull(),
    /** la classe che l'utente dichiara quando carica la schermata */
    declaredPower: integer("declared_power"),
    screenshotHash: text("screenshot_hash"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    verifiedPower: integer("verified_power"),
    /** il motivo di un rifiuto, per chi l'ha chiesta */
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("power_verifications_status_idx").on(table.status, table.submittedAt),
    index("power_verifications_user_game_idx").on(table.userId, table.gameId, table.createdAt),
    index("power_verifications_hash_idx").on(table.screenshotHash),
  ],
);

/** A parte, per non caricare i byte con le righe e per cancellarli con una riga sola. */
export const verificationScreenshots = pgTable("verification_screenshots", {
  verificationId: uuid("verification_id")
    .primaryKey()
    .references(() => powerVerifications.id, { onDelete: "cascade" }),
  mime: text("mime").notNull(),
  bytes: bytea("bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const builds = pgTable(
  "builds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    datasetVersionId: uuid("dataset_version_id")
      .notNull()
      .references(() => datasetVersions.id),
    characterId: text("character_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    /** equipaggiamento + stat finali, forma definita dal modulo di gioco */
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("builds_slug_key").on(table.slug),
    index("builds_user_game_idx").on(table.userId, table.gameId),
    index("builds_game_character_public_idx").on(table.gameId, table.characterId, table.isPublic),
  ],
);

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("teams_slug_key").on(table.slug),
    index("teams_user_game_idx").on(table.userId, table.gameId),
  ],
);

export const teamSlots = pgTable(
  "team_slots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    buildId: uuid("build_id")
      .notNull()
      .references(() => builds.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [uniqueIndex("team_slots_team_position_key").on(table.teamId, table.position)],
);

export const rotations = pgTable(
  "rotations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    /** RotationStep[] serializzati - vedi src/lib/engine/types.ts */
    steps: jsonb("steps").$type<unknown[]>().notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("rotations_game_public_idx").on(table.gameId, table.isPublic)],
);

/**
 * Risultato congelato: seed + datasetVersion rendono la simulazione
 * riproducibile, quindi un link condiviso mostra sempre gli stessi numeri.
 */
export const simulationSnapshots = pgTable(
  "simulation_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rotationId: uuid("rotation_id")
      .notNull()
      .references(() => rotations.id, { onDelete: "cascade" }),
    datasetVersionId: uuid("dataset_version_id")
      .notNull()
      .references(() => datasetVersions.id),
    seed: integer("seed").notNull(),
    iterations: integer("iterations").notNull(),
    summary: jsonb("summary").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("simulation_snapshots_rotation_idx").on(table.rotationId, table.createdAt)],
);

// -------------------------------------------------------------- contenuti

export const guides = pgTable(
  "guides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    bodyMd: text("body_md").notNull(),
    status: guideStatusEnum("status").default("DRAFT").notNull(),
    /**
     * Patch in cui il contenuto e' stato verificato. Quando la patch corrente la
     * supera, il badge diventa "da verificare". Impossibile aggiungerlo dopo su
     * migliaia di contenuti: va previsto dal giorno uno.
     */
    verifiedPatch: text("verified_patch"),
    characterId: text("character_id"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("guides_slug_key").on(table.slug),
    index("guides_game_status_published_idx").on(table.gameId, table.status, table.publishedAt),
    index("guides_game_character_idx").on(table.gameId, table.characterId),
  ],
);

export const guideRevisions = pgTable(
  "guide_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    editorId: uuid("editor_id")
      .notNull()
      .references(() => users.id),
    bodyMd: text("body_md").notNull(),
    patch: text("patch"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("guide_revisions_guide_created_idx").on(table.guideId, table.createdAt)],
);

// -------------------------------------------------------------- community

export const hubs = pgTable(
  "hubs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id").references(() => games.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("hubs_slug_key").on(table.slug)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hubId: uuid("hub_id")
      .notNull()
      .references(() => hubs.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    bodyMd: text("body_md").notNull(),
    /**
     * Risultato di simulazione allegato al post: e' cio' che distingue questa
     * community da un forum. Porta seed e patch, quindi chiunque puo' rifare il
     * calcolo e ottenere gli stessi numeri invece di doversi fidare.
     */
    attachment: jsonb("attachment").$type<Record<string, unknown>>(),
    score: integer("score").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    pinned: boolean("pinned").default(false).notNull(),
    hidden: boolean("hidden").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("posts_hub_score_created_idx").on(table.hubId, table.score, table.createdAt),
    index("posts_author_idx").on(table.authorId),
  ],
);

/**
 * La scheda di un post «strategia dell'Endgame»: modalita', bersaglio,
 * difficolta', squadra, set di artefatti, una nota per fase. Uno a uno col post,
 * che porta titolo, note generali (`body_md`), voti e commenti.
 *
 * `target` e' "" (non null) per Re Demone e Divinita' Suprema, che hanno un
 * bersaglio solo: cosi' l'uguaglianza nelle ricerche e l'indice funzionano
 * senza casi a parte. `level` e' null per le bestie, dove conta solo
 * `transcendent`.
 */
export const postStrategies = pgTable(
  "post_strategies",
  {
    postId: uuid("post_id")
      .primaryKey()
      .references(() => posts.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    mode: endgameModeEnum("mode").notNull(),
    target: text("target").default("").notNull(),
    level: integer("level"),
    transcendent: boolean("transcendent").default(false).notNull(),
    /** [{ hero, associate }] x 4, gli id del gioco */
    team: jsonb("team").$type<{ hero: string; associate: string | null }[]>().notNull(),
    artifactSet: text("artifact_set"),
    /** una nota per fase, nell'ordine del modello; "" = niente */
    phases: jsonb("phases").$type<string[]>().notNull(),
    /** il titolo l'ha scritto il sito: si rifa' nella lingua di chi legge */
    autoTitle: boolean("auto_title").default(false).notNull(),
    status: strategyStatusEnum("status").notNull(),
    reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNote: text("review_note"),
    /** l'ultimo invio: l'ordine della coda di revisione */
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("post_strategies_lookup_idx").on(table.gameId, table.mode, table.target, table.status),
    index("post_strategies_status_idx").on(table.status, table.submittedAt),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references((): AnyPgColumn => comments.id, {
      onDelete: "cascade",
    }),
    bodyMd: text("body_md").notNull(),
    score: integer("score").default(0).notNull(),
    helpful: boolean("helpful").default(false).notNull(),
    hidden: boolean("hidden").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("comments_post_created_idx").on(table.postId, table.createdAt)],
);

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: voteTargetEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("votes_user_target_key").on(table.userId, table.targetType, table.targetId),
    index("votes_target_idx").on(table.targetType, table.targetId),
  ],
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: voteTargetEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    reason: text("reason").notNull(),
    details: text("details"),
    status: reportStatusEnum("status").default("OPEN").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("reports_status_created_idx").on(table.status, table.createdAt)],
);

export const modActions = pgTable(
  "mod_actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moderatorId: uuid("moderator_id")
      .notNull()
      .references(() => users.id),
    targetType: modTargetEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    action: text("action").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("mod_actions_target_idx").on(table.targetType, table.targetId)],
);

/**
 * Lo sponsor NON e' un flag su posts: e' una tabella separata, cosi' il feed
 * organico resta ordinabile SOLO per criteri organici. La separazione e'
 * imposta dallo schema, non dalla disciplina di chi scrive le query.
 * Etichettatura "Sponsorizzato" obbligatoria (DSA).
 */
export const sponsorPlacements = pgTable(
  "sponsor_placements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hubId: uuid("hub_id").references(() => hubs.id, { onDelete: "set null" }),
    gameId: uuid("game_id").references(() => games.id, { onDelete: "set null" }),
    advertiser: text("advertiser").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    mediaUrl: text("media_url"),
    targetUrl: text("target_url").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sponsor_placements_window_idx").on(table.active, table.startsAt, table.endsAt),
  ],
);

// ---------------------------------------------------------------- social

/**
 * Grafo di chi segue chi.
 *
 * E' la meta' del ciclo che fa tornare la gente: seguire qualcuno crea
 * l'aspettativa di trovare qualcosa di nuovo la prossima volta. Senza,
 * ogni visita riparte da zero.
 *
 * Chiave primaria composta: un utente puo' seguirne un altro una volta sola, e
 * il vincolo lo impone il database invece di una query di controllo che qualcuno
 * un giorno dimenticherebbe.
 */
export const follows = pgTable(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index("follows_following_idx").on(table.followingId),
  ],
);

export const notificationTypeEnum = pgEnum("notification_type", [
  "POST_REPLY",
  "COMMENT_REPLY",
  "NEW_FOLLOWER",
  // Riservato: avvisare a ogni voto sarebbe rumore, ma una soglia ("il tuo post
  // ha raggiunto 50 voti") ha senso. Il valore resta perche' aggiungerlo dopo
  // richiede una migrazione dell'enum, che in Postgres non e' gratis.
  "POST_VOTED",
  // l'esito della verifica della classe dell'account (actorId = il moderatore)
  "POWER_VERIFIED",
  "POWER_REJECTED",
  // l'esito della revisione di una guida dell'Endgame (postId = la guida)
  "STRATEGY_PUBLISHED",
  "STRATEGY_REJECTED",
]);

/**
 * Notifiche.
 *
 * L'altra meta' del ciclo: qualcuno risponde, tu lo vieni a sapere, torni.
 * Senza notifiche una discussione muore dopo il primo messaggio perche' nessuno
 * si accorge che e' andata avanti.
 *
 * `actorId` e' chi ha fatto la cosa, `userId` chi la riceve. Si registra il
 * riferimento al bersaglio ma non il testo: il messaggio si compone al momento
 * della lettura, cosi' se un post viene modificato la notifica non resta con
 * una copia vecchia.
 */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => comments.id, { onDelete: "cascade" }),
    verificationId: uuid("verification_id").references(() => powerVerifications.id, {
      onDelete: "cascade",
    }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_created_idx").on(table.userId, table.createdAt),
    index("notifications_unread_idx").on(table.userId, table.readAt),
  ],
);

/**
 * Esito della riverifica di un allegato.
 *
 * Un post dichiara mediana e seed; il motore rigira il calcolo e confronta. Se i
 * numeri non tornano, il post lo dice. E' il pezzo che nessun altro sito puo'
 * avere: altrove una build e' un'affermazione, qui e' un conto rifacibile.
 *
 * L'esito si memorizza per non ricalcolare a ogni visita, con la versione del
 * motore usata: quando il motore cambia, la verifica va rifatta.
 */
export const attachmentChecks = pgTable(
  "attachment_checks",
  {
    postId: uuid("post_id")
      .primaryKey()
      .references(() => posts.id, { onDelete: "cascade" }),
    engineVersion: text("engine_version").notNull(),
    /** true = i numeri dichiarati coincidono con quelli ricalcolati */
    matches: boolean("matches").notNull(),
    /** scostamento relativo sulla mediana, per mostrare quanto e' lontano */
    deviation: text("deviation"),
    checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("attachment_checks_matches_idx").on(table.matches)],
);

/**
 * Gettoni per il recupero della password.
 *
 * Si memorizza l'IMPRONTA del gettone, non il gettone: se il database finisse
 * nelle mani sbagliate, chi lo legge non potrebbe usarne nessuno per entrare in
 * un account. E' la stessa ragione per cui non si conservano le password.
 *
 * `usedAt` rende il gettone monouso: senza, un collegamento intercettato
 * resterebbe valido fino alla scadenza anche dopo essere stato usato.
 */
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("password_reset_token_key").on(table.tokenHash),
    index("password_reset_user_idx").on(table.userId),
  ],
);

/**
 * Segnalazioni gia' presenti in `reports`; qui si registra soltanto quando un
 * utente e' sospeso, perche' e' una proprieta' dell'account e non di un
 * contenuto. Un moderatore deve poter fermare qualcuno senza cancellare cio'
 * che ha scritto.
 */
export const suspensions = pgTable(
  "suspensions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moderatorId: uuid("moderator_id")
      .notNull()
      .references(() => users.id),
    reason: text("reason").notNull(),
    /** null = a tempo indeterminato */
    until: timestamp("until", { withTimezone: true }),
    liftedAt: timestamp("lifted_at", { withTimezone: true }),
    /** chi ha revocato la sospensione (dall'11/10; prima restava solo quando) */
    liftedBy: uuid("lifted_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("suspensions_user_idx").on(table.userId, table.liftedAt)],
);

// ---------------------------------------------------------------- billing

/**
 * Il premium e' un'entitlement, non un ruolo: userRole regola i permessi
 * redazionali, subscriptions regola cosa hai pagato. Tenerli separati evita di
 * dover toccare i permessi ogni volta che cambia il piano commerciale.
 */
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubId: text("stripe_sub_id"),
    tier: text("tier").default("premium").notNull(),
    status: subscriptionStatusEnum("status").default("TRIALING").notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("subscriptions_user_key").on(table.userId),
    uniqueIndex("subscriptions_stripe_sub_key").on(table.stripeSubId),
  ],
);

export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cosmeticId: uuid("cosmetic_id").references(() => cosmetics.id),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").default("EUR").notNull(),
    stripePaymentId: text("stripe_payment_id"),
    vatCountry: text("vat_country"),
    /**
     * Obbligo UE sui beni digitali: senza rinuncia esplicita al diritto di
     * recesso al momento dell'acquisto, il cliente ha 14 giorni per il rimborso.
     */
    withdrawalWaived: boolean("withdrawal_waived").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("purchases_stripe_payment_key").on(table.stripePaymentId),
    index("purchases_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export const donations = pgTable(
  "donations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").default("EUR").notNull(),
    provider: text("provider").notNull(),
    externalId: text("external_id"),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("donations_created_idx").on(table.createdAt)],
);

// -------------------------------------------------------------- relazioni

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  subscription: one(subscriptions, { fields: [users.id], references: [subscriptions.userId] }),
  accounts: many(accounts),
  sessions: many(sessions),
  gameAccounts: many(gameAccounts),
  badges: many(userBadges),
  showcase: many(badgeShowcaseSlots),
  cosmetics: many(ownedCosmetics),
  xpEvents: many(xpEvents),
  builds: many(builds),
  teams: many(teams),
  rotations: many(rotations),
  guides: many(guides),
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
  purchases: many(purchases),
  // follows punta due volte a users, quindi le due direzioni vanno nominate:
  // senza relationName Drizzle non sa quale colonna usare per quale verso.
  following: many(follows, { relationName: "following" }),
  followers: many(follows, { relationName: "followers" }),
  notifications: many(notifications, { relationName: "notificationsReceived" }),
  suspensions: many(suspensions, { relationName: "suspensionsReceived" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const xpEventsRelations = relations(xpEvents, ({ one }) => ({
  user: one(users, { fields: [xpEvents.userId], references: [users.id] }),
}));

export const badgesRelations = relations(badges, ({ one, many }) => ({
  game: one(games, { fields: [badges.gameId], references: [games.id] }),
  awarded: many(userBadges),
  showcase: many(badgeShowcaseSlots),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}));

export const badgeShowcaseSlotsRelations = relations(badgeShowcaseSlots, ({ one }) => ({
  user: one(users, { fields: [badgeShowcaseSlots.userId], references: [users.id] }),
  badge: one(badges, { fields: [badgeShowcaseSlots.badgeId], references: [badges.id] }),
}));

export const cosmeticsRelations = relations(cosmetics, ({ many }) => ({
  owners: many(ownedCosmetics),
  purchases: many(purchases),
}));

export const ownedCosmeticsRelations = relations(ownedCosmetics, ({ one }) => ({
  user: one(users, { fields: [ownedCosmetics.userId], references: [users.id] }),
  cosmetic: one(cosmetics, { fields: [ownedCosmetics.cosmeticId], references: [cosmetics.id] }),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  datasets: many(datasetVersions),
  gameAccounts: many(gameAccounts),
  builds: many(builds),
  teams: many(teams),
  rotations: many(rotations),
  guides: many(guides),
  hubs: many(hubs),
  badges: many(badges),
  sponsors: many(sponsorPlacements),
}));

export const datasetVersionsRelations = relations(datasetVersions, ({ one, many }) => ({
  game: one(games, { fields: [datasetVersions.gameId], references: [games.id] }),
  builds: many(builds),
  snapshots: many(simulationSnapshots),
}));

export const gameAccountsRelations = relations(gameAccounts, ({ one, many }) => ({
  user: one(users, { fields: [gameAccounts.userId], references: [users.id] }),
  game: one(games, { fields: [gameAccounts.gameId], references: [games.id] }),
  roster: many(rosterEntries),
  verifications: many(powerVerifications),
}));

export const powerVerificationsRelations = relations(powerVerifications, ({ one }) => ({
  user: one(users, { fields: [powerVerifications.userId], references: [users.id] }),
  game: one(games, { fields: [powerVerifications.gameId], references: [games.id] }),
  gameAccount: one(gameAccounts, {
    fields: [powerVerifications.gameAccountId],
    references: [gameAccounts.id],
  }),
}));

export const rosterEntriesRelations = relations(rosterEntries, ({ one }) => ({
  gameAccount: one(gameAccounts, {
    fields: [rosterEntries.gameAccountId],
    references: [gameAccounts.id],
  }),
}));

export const buildsRelations = relations(builds, ({ one, many }) => ({
  user: one(users, { fields: [builds.userId], references: [users.id] }),
  game: one(games, { fields: [builds.gameId], references: [games.id] }),
  datasetVersion: one(datasetVersions, {
    fields: [builds.datasetVersionId],
    references: [datasetVersions.id],
  }),
  teamSlots: many(teamSlots),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  user: one(users, { fields: [teams.userId], references: [users.id] }),
  game: one(games, { fields: [teams.gameId], references: [games.id] }),
  slots: many(teamSlots),
  rotations: many(rotations),
}));

export const teamSlotsRelations = relations(teamSlots, ({ one }) => ({
  team: one(teams, { fields: [teamSlots.teamId], references: [teams.id] }),
  build: one(builds, { fields: [teamSlots.buildId], references: [builds.id] }),
}));

export const rotationsRelations = relations(rotations, ({ one, many }) => ({
  user: one(users, { fields: [rotations.userId], references: [users.id] }),
  game: one(games, { fields: [rotations.gameId], references: [games.id] }),
  team: one(teams, { fields: [rotations.teamId], references: [teams.id] }),
  snapshots: many(simulationSnapshots),
}));

export const simulationSnapshotsRelations = relations(simulationSnapshots, ({ one }) => ({
  rotation: one(rotations, {
    fields: [simulationSnapshots.rotationId],
    references: [rotations.id],
  }),
  datasetVersion: one(datasetVersions, {
    fields: [simulationSnapshots.datasetVersionId],
    references: [datasetVersions.id],
  }),
}));

export const guidesRelations = relations(guides, ({ one, many }) => ({
  game: one(games, { fields: [guides.gameId], references: [games.id] }),
  author: one(users, { fields: [guides.authorId], references: [users.id] }),
  revisions: many(guideRevisions),
}));

export const guideRevisionsRelations = relations(guideRevisions, ({ one }) => ({
  guide: one(guides, { fields: [guideRevisions.guideId], references: [guides.id] }),
  editor: one(users, { fields: [guideRevisions.editorId], references: [users.id] }),
}));

export const hubsRelations = relations(hubs, ({ one, many }) => ({
  game: one(games, { fields: [hubs.gameId], references: [games.id] }),
  posts: many(posts),
  sponsors: many(sponsorPlacements),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  hub: one(hubs, { fields: [posts.hubId], references: [hubs.id] }),
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
  // senza `fields`: la chiave sta dall'altra parte, e cosi' drizzle la tipizza
  // come facoltativa (un post qualunque non ha una strategia)
  strategy: one(postStrategies),
}));

export const postStrategiesRelations = relations(postStrategies, ({ one }) => ({
  post: one(posts, { fields: [postStrategies.postId], references: [posts.id] }),
  game: one(games, { fields: [postStrategies.gameId], references: [games.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id] }),
  children: many(comments),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, { fields: [votes.userId], references: [users.id] }),
}));

export const sponsorPlacementsRelations = relations(sponsorPlacements, ({ one }) => ({
  hub: one(hubs, { fields: [sponsorPlacements.hubId], references: [hubs.id] }),
  game: one(games, { fields: [sponsorPlacements.gameId], references: [games.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, { fields: [purchases.userId], references: [users.id] }),
  cosmetic: one(cosmetics, { fields: [purchases.cosmeticId], references: [cosmetics.id] }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  user: one(users, { fields: [donations.userId], references: [users.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, { fields: [follows.followerId], references: [users.id], relationName: "following" }),
  following: one(users, { fields: [follows.followingId], references: [users.id], relationName: "followers" }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, { fields: [notifications.userId], references: [users.id], relationName: "notificationsReceived" }),
  actor: one(users, { fields: [notifications.actorId], references: [users.id], relationName: "notificationsCaused" }),
  post: one(posts, { fields: [notifications.postId], references: [posts.id] }),
  comment: one(comments, { fields: [notifications.commentId], references: [comments.id] }),
  verification: one(powerVerifications, {
    fields: [notifications.verificationId],
    references: [powerVerifications.id],
  }),
}));

export const attachmentChecksRelations = relations(attachmentChecks, ({ one }) => ({
  post: one(posts, { fields: [attachmentChecks.postId], references: [posts.id] }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

export const suspensionsRelations = relations(suspensions, ({ one }) => ({
  user: one(users, {
    fields: [suspensions.userId],
    references: [users.id],
    relationName: "suspensionsReceived",
  }),
  moderator: one(users, {
    fields: [suspensions.moderatorId],
    references: [users.id],
    relationName: "suspensionsIssued",
  }),
}));

/**
 * reports e modActions puntano a users una sola volta ciascuna, quindi non
 * serve nominare le relazioni: la colonna e' univoca.
 */
export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
}));

export const modActionsRelations = relations(modActions, ({ one }) => ({
  moderator: one(users, { fields: [modActions.moderatorId], references: [users.id] }),
}));
