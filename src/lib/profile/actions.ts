"use server";

/**
 * Salvataggio del profilo.
 *
 * L'editor manda l'intero oggetto che sta mostrando in anteprima, ma qui si
 * accetta solo cio' che l'utente ha davvero il diritto di decidere:
 *
 *  - identita' e aspetto: sono suoi, si salvano
 *  - vetrina dei badge: quali esporre e in che ordine e' presentazione, si salva
 *  - il badge in se', il livello di fiducia, l'XP: NON si toccano. Arrivano
 *    dalla verifica e dall'attivita'. Accettarli dal client significherebbe
 *    permettere a chiunque di assegnarsi la spunta "verificato" con una
 *    richiesta costruita a mano.
 *
 * E' il motivo per cui non si fa un update generico dal payload ricevuto.
 */

import { revalidatePath } from "next/cache";
import { and, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { badgeShowcaseSlots, profiles, subscriptions, userBadges, users } from "@/lib/db/schema";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import {
  BADGE_SHOWCASE_LIMIT,
  normalizeCustomization,
  stripPremium,
  toCosmeticRecord,
} from "./customization";

const TESTI = testi({
  it: {
    handleCorto: "L'handle deve avere almeno 3 caratteri",
    handleLungo: "L'handle non può superare i 20 caratteri",
    handleCaratteri: "Usa solo lettere minuscole, numeri, trattino e underscore",
    nomeCorto: "Il nome è troppo corto",
    databaseAssente: "Database non raggiungibile: le modifiche non sono state salvate.",
    sessioneScaduta: "Sessione scaduta. Rientra e riprova.",
    datiNonValidi: "Dati non validi.",
    handlePreso: "Questo handle è già preso.",
  },
  en: {
    handleCorto: "The handle must be at least 3 characters",
    handleLungo: "The handle can't be longer than 20 characters",
    handleCaratteri: "Use only lowercase letters, numbers, hyphens and underscores",
    nomeCorto: "The name is too short",
    databaseAssente: "Database unreachable: your changes were not saved.",
    sessioneScaduta: "Session expired. Log in again and retry.",
    datiNonValidi: "Invalid data.",
    handlePreso: "This handle is already taken.",
  },
});

export interface SaveResult {
  ok: boolean;
  error?: string;
}

/** Lo schema nasce con i messaggi nella lingua di chi salva. */
function payloadSchema(t: (typeof TESTI)["it"]) {
  return z.object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, t.handleCorto)
      .max(20, t.handleLungo)
      .regex(/^[a-z0-9_-]+$/, t.handleCaratteri),
    displayName: z.string().trim().min(2, t.nomeCorto).max(40),
    bio: z.string().max(280).nullish(),
    country: z.string().max(40).nullish(),
    favorites: z.array(z.string().trim().max(40)).max(12),
    customization: z.record(z.string(), z.string()),
    badges: z.array(z.object({ id: z.string(), shown: z.boolean().optional() })),
  });
}

export async function saveProfileAction(payload: unknown): Promise<SaveResult> {
  const t = TESTI[await getLocale()];

  if (!(await databaseReachable())) {
    return { ok: false, error: t.databaseAssente };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: t.sessioneScaduta };

  const parsed = payloadSchema(t).safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const { username, displayName, bio, country, favorites, customization, badges } = parsed.data;

  // L'handle e' l'indirizzo pubblico del profilo: deve restare unico.
  const taken = await db.query.users.findFirst({
    where: and(eq(users.username, username), ne(users.id, userId)),
    columns: { id: true },
  });
  if (taken) return { ok: false, error: t.handlePreso };

  // Le opzioni premium richiedono un abbonamento attivo: la verifica va fatta
  // qui, non nell'interfaccia, che e' solo un suggerimento.
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    columns: { status: true },
  });
  const premiumActive = subscription?.status === "ACTIVE" || subscription?.status === "TRIALING";
  const cosmetics = stripPremium(normalizeCustomization(customization), premiumActive);

  // Si tengono solo i badge che l'utente possiede davvero: un id inventato nel
  // payload non deve poter comparire in vetrina.
  const owned = await db.query.userBadges.findMany({
    where: eq(userBadges.userId, userId),
    columns: { id: true, badgeId: true },
  });
  const ownedByEntry = new Map(owned.map((entry) => [entry.id, entry.badgeId]));

  const showcase = badges
    .filter((badge) => badge.shown !== false)
    .map((badge) => ownedByEntry.get(badge.id))
    .filter((badgeId): badgeId is string => typeof badgeId === "string")
    .slice(0, BADGE_SHOWCASE_LIMIT);

  const favoriteList = favorites.map((name) => name.trim()).filter((name) => name.length > 0);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ username, name: displayName, updatedAt: new Date() })
      .where(eq(users.id, userId));

    await tx
      .update(profiles)
      .set({
        displayName,
        bio: bio ?? null,
        country: country ?? null,
        favorites: favoriteList,
        cosmetics: toCosmeticRecord(cosmetics),
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId));

    await tx.delete(badgeShowcaseSlots).where(eq(badgeShowcaseSlots.userId, userId));
    if (showcase.length > 0) {
      await tx
        .insert(badgeShowcaseSlots)
        .values(showcase.map((badgeId, position) => ({ userId, badgeId, position })));
    }
  });

  revalidatePath(`/u/${username}`);
  revalidatePath("/impostazioni/profilo");

  return { ok: true };
}

/** Usata dalla pagina pubblica per sapere quali badge sono in vetrina. */
export async function showcasedBadgeIds(userId: string): Promise<readonly string[]> {
  const slots = await db.query.badgeShowcaseSlots.findMany({
    where: eq(badgeShowcaseSlots.userId, userId),
    columns: { badgeId: true, position: true },
  });
  return slots.sort((a, b) => a.position - b.position).map((slot) => slot.badgeId);
}

/** Verifica che gli id badge indicati esistano davvero (usata dai test). */
export async function badgesExist(ids: readonly string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const rows = await db.query.userBadges.findMany({
    where: inArray(userBadges.id, [...ids]),
    columns: { id: true },
  });
  return rows.length === ids.length;
}
