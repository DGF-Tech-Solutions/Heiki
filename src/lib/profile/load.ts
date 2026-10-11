/**
 * Il caricamento del profilo, per la pagina pubblica (/u/<handle>) e per le
 * impostazioni.
 *
 * Fino all'11/10 ciascuna delle due pagine aveva la sua copia, quasi uguale e
 * gia' divergente: una mostrava le build private, l'altra no; una ordinava la
 * vetrina in un modo, l'altra in un altro. Ora la forma della vista nasce in un
 * posto solo, e cambia solo come si cerca l'utente: per handle o per id.
 *
 * Solo server: legge il database e il registro dei giochi.
 */

import { and, eq } from "drizzle-orm";
import { DEFAULT_STAGE_ART, stageArtOf, type StageArt } from "@/components/heroes/hero-stage";
import type { ProfileViewData } from "@/components/profile-view";
import { db } from "@/lib/db";
import { follows, posts, subscriptions, users } from "@/lib/db/schema";
import { SERVER_NAMES, isServer } from "@/lib/games/game-account";
import { getGameModule, listGameModules } from "@/lib/games/registry";
import { testi, type Locale } from "@/lib/i18n/locale";
import { normalizeCustomization, readShowcaseChosen } from "./customization";
import { resolveFavorites, type PickableGame } from "./favorite-heroes";
import { normalizeFavorites, type RosterOf } from "./favorites";

const TESTI = testi({
  it: { gioco: "Gioco" },
  en: { gioco: "Game" },
});

export interface ProfileLookup {
  readonly by: "username" | "id";
  readonly value: string;
}

export interface LoadedProfile {
  /** l'id dell'utente: il proprietario si riconosce da questo, non dall'handle (che la sessione aggiorna in ritardo) */
  readonly ownerId: string;
  readonly data: ProfileViewData;
}

/** Gli eroi di un gioco, per controllare i preferiti (favorites.ts). */
export const rosterOf: RosterOf = (game) => getGameModule(game)?.roster?.heroes;

let pickable: readonly PickableGame[] | null = null;

/**
 * Gli eroi che si possono mettere fra i preferiti, gioco per gioco, con le
 * figure per il palco (favorite-heroes.ts). Si calcola una volta: roster e
 * immagini cambiano solo con un aggiornamento del sito.
 *
 * Arriva al browser solo a chi modifica il profilo: a chi lo guarda basta la
 * copertina gia' risolta qui sul server.
 */
export function pickableGames(): readonly PickableGame[] {
  if (pickable) return pickable;
  pickable = listGameModules().flatMap((gameModule) => {
    const heroes = gameModule.roster?.heroes;
    if (!heroes || heroes.length === 0) return [];
    const figures: Record<string, StageArt["figure"]> = {};
    const art: Record<string, StageArt["art"]> = {};
    const withoutCutIn: string[] = [];
    for (const hero of heroes) {
      const stage = stageArtOf(gameModule.heroAssets?.[hero.id]);
      figures[hero.id] = stage.figure;
      if (stage.art !== DEFAULT_STAGE_ART.art) art[hero.id] = stage.art;
      if (!stage.cutIn) withoutCutIn.push(hero.id);
    }
    return [{ game: gameModule.slug, name: gameModule.name, heroes, figures, art, withoutCutIn }];
  });
  return pickable;
}

export async function hasActivePremium(userId: string): Promise<boolean> {
  try {
    const row = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
      columns: { status: true },
    });
    return row?.status === "ACTIVE" || row?.status === "TRIALING";
  } catch {
    return false;
  }
}

/**
 * Un database non ancora migrato non deve produrre una schermata di errore
 * grezza: si tratta come profilo inesistente, e la pagina lo dice in chiaro.
 */
export async function loadProfile(lookup: ProfileLookup, locale: Locale): Promise<LoadedProfile | null> {
  try {
    const row = await db.query.users.findFirst({
      where: lookup.by === "id" ? eq(users.id, lookup.value) : eq(users.username, lookup.value.toLowerCase()),
      columns: { id: true, username: true, role: true, createdAt: true },
      with: {
        profile: true,
        badges: { with: { badge: true } },
        showcase: true,
        gameAccounts: { with: { game: { columns: { slug: true } } } },
      },
    });
    if (!row) return null;

    const [followers, following, published] = await Promise.all([
      db.$count(follows, eq(follows.followingId, row.id)),
      db.$count(follows, eq(follows.followerId, row.id)),
      db.$count(posts, and(eq(posts.authorId, row.id), eq(posts.hidden, false))),
    ]);

    // I nomi dei giochi vengono dai moduli registrati, non dal database: e' il
    // modulo la fonte di verita' su come si chiama un gioco.
    const gameNames = new Map(listGameModules().map((gameModule) => [gameModule.slug, gameModule.name]));

    // La vetrina decide cosa si vede e in che ordine. Se non e' mai stata
    // scelta si mostrano tutti i badge, cosi' un profilo nuovo non appare vuoto
    // solo perche' l'utente non e' passato dalle impostazioni. «Scelta» lo dice
    // il segno nei cosmetici (11/10: prima nascondere tutto li rimostrava), o i
    // posti salvati prima che il segno esistesse.
    const order = new Map(row.showcase.map((slot) => [slot.badgeId, slot.position]));
    const chosen = readShowcaseChosen(row.profile?.cosmetics) || row.showcase.length > 0;

    const favorites = normalizeFavorites(row.profile?.favorites, rosterOf);
    const { favoriteHeroes, cover } = resolveFavorites(favorites, pickableGames(), locale);

    return {
      ownerId: row.id,
      data: {
        username: row.username,
        displayName: row.profile?.displayName ?? row.username,
        role: row.role,
        bio: row.profile?.bio ?? "",
        country: row.profile?.country ?? "",
        memberSince: row.createdAt.toISOString(),
        stats: { followers, following, posts: published },
        favorites,
        favoriteHeroes,
        cover,
        customization: normalizeCustomization(row.profile?.cosmetics),
        // Si ordina PRIMA di mappare: dopo la mappatura resta solo l'id della riga
        // di assegnazione, mentre la vetrina e' indicizzata per id del badge.
        badges: [...row.badges]
          .sort(
            (a, b) =>
              (order.get(a.badgeId) ?? Number.MAX_SAFE_INTEGER) -
              (order.get(b.badgeId) ?? Number.MAX_SAFE_INTEGER),
          )
          .map((entry) => ({
            id: entry.id,
            name: entry.badge.name,
            description: entry.badge.description,
            trust: entry.trust,
            icon: null,
            shown: chosen ? order.has(entry.badgeId) : true,
          })),
        gameAccounts: row.gameAccounts.map((account) => ({
          id: account.id,
          // il gioco si riconosce dallo slug: `gameId` e' l'id del database, non quello del modulo
          game: gameNames.get(account.game.slug) ?? TESTI[locale].gioco,
          uid: account.uid,
          nickname: account.nickname,
          trust: account.trust,
          server: isServer(account.region) ? SERVER_NAMES[account.region][locale] : null,
          power: account.accountPower,
          verifiedPower: account.verifiedPower,
          verifiedAt: account.verifiedAt?.toISOString() ?? null,
          shown: true,
        })),
      },
    };
  } catch {
    return null;
  }
}
