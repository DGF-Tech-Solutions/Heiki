"use server";

/**
 * Server Actions per la gestione, salvataggio, cancellazione e backup delle Tier List.
 */

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { games, userTierLists } from "@/lib/db/schema";
import { getGameModule } from "@/lib/games/registry";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { exportUserTierListsBackup, getTierListById, getUserTierLists } from "./server";
import type {
  SavedTierListDetail,
  SavedTierListSummary,
  TierListBackupFile,
} from "./types";

export interface TierListActionResult {
  ok: boolean;
  error?: string;
  tierListId?: string;
  tierList?: SavedTierListDetail | SavedTierListSummary;
}

const tierRowSchema = z.object({
  id: z.string().min(1).max(64),
  label: z.string().min(1).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  heroIds: z.array(z.string().min(1).max(64)),
});

const saveTierListSchema = z.object({
  id: z.string().uuid().optional(),
  game: z.string().min(1).max(64),
  title: z
    .string()
    .trim()
    .min(1, "Inserisci un nome per la tua tier list.")
    .max(80, "Il nome non può superare gli 80 caratteri."),
  description: z.string().trim().max(300, "La descrizione non può superare i 300 caratteri.").optional(),
  tiers: z.array(tierRowSchema).min(1, "La tier list deve contenere almeno una riga."),
  isPublic: z.boolean().default(true),
});

/**
 * Salva o aggiorna una tier list legata all'account dell'utente loggato.
 */
export async function saveTierListAction(rawInput: unknown): Promise<TierListActionResult> {
  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { ok: false, error: "Database non raggiungibile. Riprova più tardi." };
  }

  const viewer = await currentViewer();
  if (!viewer) {
    return { ok: false, error: "Devi accedere per salvare la tua tier list sull'account." };
  }

  const suspension = await suspensionFor(viewer.id);
  if (suspension) {
    return { ok: false, error: suspensionMessage(suspension, "it") };
  }

  const limitCheck = rateLimit("tierListSave", viewer.id);
  if (!limitCheck.allowed) {
    return { ok: false, error: retryMessage(limitCheck, "it") };
  }

  const parseResult = saveTierListSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return { ok: false, error: issue?.message ?? "Dati non validi." };
  }

  const input = parseResult.data;

  const gameModule = getGameModule(input.game);
  if (!gameModule) {
    return { ok: false, error: "Gioco non valido o non registrato." };
  }

  const gameRow = await db.query.games.findFirst({
    where: eq(games.slug, input.game),
    columns: { id: true },
  });
  if (!gameRow) {
    return { ok: false, error: "Record di gioco non trovato." };
  }

  // Se è specificato un ID, verifichiamo che la tier list esista e sia dell'utente
  if (input.id) {
    const existing = await db.query.userTierLists.findFirst({
      where: and(eq(userTierLists.id, input.id), eq(userTierLists.userId, viewer.id)),
    });

    if (!existing) {
      return { ok: false, error: "Tier list non trovata o non autorizzata alla modifica." };
    }

    await db
      .update(userTierLists)
      .set({
        title: input.title,
        description: input.description ?? null,
        data: input.tiers,
        isPublic: input.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(userTierLists.id, input.id));

    revalidatePath(`/${input.game}/tierlist`);
    revalidatePath(`/u/${viewer.username}`);

    const detail = await getTierListById(input.id, viewer.id);
    return { ok: true, tierListId: input.id, tierList: detail ?? undefined };
  }

  // Creazione nuova tier list
  const [created] = await db
    .insert(userTierLists)
    .values({
      userId: viewer.id,
      gameId: gameRow.id,
      title: input.title,
      description: input.description ?? null,
      data: input.tiers,
      isPublic: input.isPublic,
    })
    .returning({ id: userTierLists.id });

  if (!created) {
    return { ok: false, error: "Errore durante il salvataggio della tier list." };
  }

  revalidatePath(`/${input.game}/tierlist`);
  revalidatePath(`/u/${viewer.username}`);

  const detail = await getTierListById(created.id, viewer.id);
  return { ok: true, tierListId: created.id, tierList: detail ?? undefined };
}

/**
 * Elimina una tier list salvata dall'utente.
 */
export async function deleteTierListAction(id: string): Promise<TierListActionResult> {
  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { ok: false, error: "Database non raggiungibile." };
  }

  const viewer = await currentViewer();
  if (!viewer) {
    return { ok: false, error: "Devi accedere per eliminare questa tier list." };
  }

  const existing = await db.query.userTierLists.findFirst({
    where: and(eq(userTierLists.id, id), eq(userTierLists.userId, viewer.id)),
    with: { game: { columns: { slug: true } } },
  });

  if (!existing) {
    return { ok: false, error: "Tier list non trovata o non autorizzata." };
  }

  await db.delete(userTierLists).where(eq(userTierLists.id, id));

  revalidatePath(`/${existing.game.slug}/tierlist`);
  revalidatePath(`/u/${viewer.username}`);

  return { ok: true };
}

/**
 * Recupera l'elenco delle tier list salvate dell'utente corrente.
 */
export async function getMyTierListsAction(gameSlug?: string): Promise<SavedTierListSummary[]> {
  const viewer = await currentViewer();
  if (!viewer) return [];
  return getUserTierLists(viewer.id, gameSlug);
}

/**
 * Scarica il backup completo in formato JSON per l'utente loggato.
 */
export async function getTierListBackupAction(): Promise<TierListBackupFile | null> {
  const viewer = await currentViewer();
  if (!viewer) return null;
  return exportUserTierListsBackup(viewer.id);
}

/**
 * Ripristina una o più tier list da un file di backup per l'account dell'utente corrente.
 */
export async function restoreTierListsFromBackupAction(
  backup: TierListBackupFile,
): Promise<{ ok: boolean; restoredCount: number; error?: string }> {
  if (!isDatabaseConfigured() || !(await databaseReachable())) {
    return { ok: false, restoredCount: 0, error: "Database non raggiungibile." };
  }

  const viewer = await currentViewer();
  if (!viewer) {
    return { ok: false, restoredCount: 0, error: "Devi accedere per ripristinare il backup." };
  }

  if (!backup || backup.version !== 1 || !Array.isArray(backup.tierLists)) {
    return { ok: false, restoredCount: 0, error: "Formato del file di backup non valido." };
  }

  let restored = 0;
  for (const item of backup.tierLists) {
    if (!item.title || !Array.isArray(item.tiers) || !item.game) continue;

    const gameRow = await db.query.games.findFirst({
      where: eq(games.slug, item.game),
      columns: { id: true },
    });
    if (!gameRow) continue;

    await db.insert(userTierLists).values({
      userId: viewer.id,
      gameId: gameRow.id,
      title: item.title,
      description: item.description ?? null,
      data: item.tiers,
      isPublic: true,
    });
    restored++;
  }

  revalidatePath(`/u/${viewer.username}`);
  return { ok: true, restoredCount: restored };
}

