"use server";

/**
 * Salvataggio del profilo.
 *
 * L'editor manda solo i campi che si possono modificare (ProfileSavePayload),
 * e qui si accetta solo cio' che l'utente ha davvero il diritto di decidere:
 *
 *  - identita' e aspetto: sono suoi, si salvano
 *  - eroi preferiti: si salvano, ma solo come riferimenti a eroi veri del
 *    roster (favorites.ts), al massimo otto
 *  - vetrina dei badge: quali esporre e in che ordine e' presentazione, si salva
 *  - il badge in se', il livello di fiducia: NON si toccano. Arrivano dalla
 *    verifica. Accettarli dal client significherebbe permettere a chiunque di
 *    assegnarsi la spunta "verificato" con una richiesta costruita a mano.
 *
 * E' il motivo per cui non si fa un update generico dal payload ricevuto.
 */

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { displayNameProblem, isReservedHandle } from "@/lib/auth/handles";
import { can } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { requireActive } from "@/lib/moderation/suspension";
import { badgeShowcaseSlots, profiles, userBadges, users } from "@/lib/db/schema";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import {
  BADGE_SHOWCASE_LIMIT,
  normalizeCustomization,
  stripPremium,
  toCosmeticRecord,
} from "./customization";
import { FAVORITES_LIMIT, normalizeFavorites } from "./favorites";
import { hasActivePremium, rosterOf } from "./load";

const TESTI = testi({
  it: {
    handleCorto: "L'handle deve avere almeno 3 caratteri",
    handleLungo: "L'handle non può superare i 20 caratteri",
    handleCaratteri: "Usa solo lettere minuscole, numeri, trattino e underscore",
    nomeCorto: "Il nome è troppo corto",
    troppiPreferiti: `Al massimo ${FAVORITES_LIMIT} eroi preferiti`,
    databaseAssente: "Database non raggiungibile: le modifiche non sono state salvate.",
    sessioneScaduta: "Sessione scaduta. Rientra e riprova.",
    datiNonValidi: "Dati non validi.",
    handlePreso: "Questo handle è già preso.",
    handleRiservato: "Questo handle è riservato al sito: scegline un altro.",
    nomeInvisibile: "Il nome contiene caratteri invisibili o di controllo: toglili.",
    nomeStaff: "Il nome non può far pensare allo staff del sito (admin, moderatore, supporto…): scegline un altro.",
  },
  en: {
    handleCorto: "The handle must be at least 3 characters",
    handleLungo: "The handle can't be longer than 20 characters",
    handleCaratteri: "Use only lowercase letters, numbers, hyphens and underscores",
    nomeCorto: "The name is too short",
    troppiPreferiti: `At most ${FAVORITES_LIMIT} favorite heroes`,
    databaseAssente: "Database unreachable: your changes were not saved.",
    sessioneScaduta: "Session expired. Log in again and retry.",
    datiNonValidi: "Invalid data.",
    handlePreso: "This handle is already taken.",
    handleRiservato: "This handle is reserved for the site: choose another one.",
    nomeInvisibile: "The name contains invisible or control characters: remove them.",
    nomeStaff: "The name can't suggest the site's staff (admin, moderator, support…): choose another one.",
  },
});

/** Cio' che l'editor manda: solo i campi modificabili, non la vista intera. */
export interface ProfileSavePayload {
  username: string;
  displayName: string;
  bio: string;
  country: string;
  /** `<gioco>:<id>` nell'ordine scelto: il primo e' la copertina */
  favorites: readonly string[];
  customization: Record<string, string>;
  /** l'ordine della vetrina e cosa si espone; id = la riga del badge posseduto */
  badges: readonly { id: string; shown?: boolean }[];
}

export interface SaveResult {
  ok: boolean;
  error?: string;
  /** l'handle salvato: se e' cambiato, la pagina /u/<vecchio> non esiste piu' */
  username?: string;
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
    favorites: z.array(z.string().max(60)).max(FAVORITES_LIMIT, t.troppiPreferiti),
    customization: z.record(z.string(), z.string()),
    badges: z.array(z.object({ id: z.string(), shown: z.boolean().optional() })).max(200),
  });
}

export async function saveProfileAction(payload: ProfileSavePayload): Promise<SaveResult> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!(await databaseReachable())) {
    return { ok: false, error: t.databaseAssente };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: t.sessioneScaduta };

  // Nome, bio e handle sono testo pubblico come un post: chi e' sospeso non li
  // cambia. Fino all'11/10 poteva, e una sospensione per un nome offensivo si
  // aggirava con un altro nome offensivo.
  const blocked = await requireActive(userId, locale);
  if (blocked) return { ok: false, error: blocked };

  // il tipo del parametro e' una promessa del client, non una garanzia: si rilegge tutto
  const parsed = payloadSchema(t).safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const { username, displayName, bio, country, favorites, customization, badges } = parsed.data;

  const current = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { username: true, role: true },
    with: { profile: { columns: { displayName: true } } },
  });
  if (!current) return { ok: false, error: t.sessioneScaduta };

  // Handle e nome si controllano quando cambiano (regole in auth/handles.ts):
  // chi li aveva gia' prima dell'11/10 - anche lo staff vero, che puo' chiamarsi
  // «admin» - non resta chiuso fuori dal proprio profilo, ma non si prende un
  // nome nuovo che imita lo staff o un account cancellato.
  if (username !== current.username && isReservedHandle(username)) {
    return { ok: false, error: t.handleRiservato };
  }
  if (displayName !== current.profile?.displayName) {
    const problem = displayNameProblem(displayName);
    if (problem === "invisibile") return { ok: false, error: t.nomeInvisibile };
    // lo staff vero puo' dirsi staff: la regola ferma chi lo imita
    if (problem === "staff" && !can(current.role, "moderate")) return { ok: false, error: t.nomeStaff };
  }

  // L'handle e' l'indirizzo pubblico del profilo: deve restare unico.
  const taken = await db.query.users.findFirst({
    where: and(eq(users.username, username), ne(users.id, userId)),
    columns: { id: true },
  });
  if (taken) return { ok: false, error: t.handlePreso };

  // Le opzioni premium richiedono un abbonamento attivo: la verifica va fatta
  // qui, non nell'interfaccia, che e' solo un suggerimento.
  const cosmetics = stripPremium(normalizeCustomization(customization), await hasActivePremium(userId));

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

  // Chi ha dei badge ha visto la vetrina nell'editor: quello che salva e' una
  // scelta, anche se e' «nessuno». Il segno lo dice al caricamento (customization.ts).
  const record = toCosmeticRecord(cosmetics, { showcaseChosen: owned.length > 0 });

  const fields = {
    displayName,
    bio: bio ?? null,
    country: country ?? null,
    favorites: normalizeFavorites(favorites, rosterOf),
    cosmetics: record,
    updatedAt: new Date(),
  };

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ username, name: displayName, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // Inserisce o aggiorna: gli account entrati con Google o Discord prima che
    // `createUser` (auth/index.ts) scrivesse la riga del profilo non ce l'hanno,
    // e un update da solo non salverebbe niente senza dirlo.
    await tx
      .insert(profiles)
      .values({ userId, ...fields })
      .onConflictDoUpdate({ target: profiles.userId, set: fields });

    await tx.delete(badgeShowcaseSlots).where(eq(badgeShowcaseSlots.userId, userId));
    if (showcase.length > 0) {
      await tx
        .insert(badgeShowcaseSlots)
        .values(showcase.map((badgeId, position) => ({ userId, badgeId, position })));
    }
  });

  // anche il vecchio indirizzo: chi l'ha in cache deve trovare la pagina che non c'e' piu'
  if (current.username !== username) revalidatePath(`/u/${current.username}`);
  revalidatePath(`/u/${username}`);
  revalidatePath("/impostazioni/profilo");

  return { ok: true, username };
}

// Fino all'11/10 qui c'erano anche `showcasedBadgeIds` e `badgesExist`: aiuti
// senza chiamanti, ma in un modulo "use server" ogni export e' un'azione, e
// chiunque poteva chiedere la vetrina di un utente qualsiasi o sondare quali id
// di badge esistono. Tolti; la vetrina la legge profile/load.ts.
