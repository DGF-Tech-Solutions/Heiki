"use server";

/**
 * Azioni della community.
 *
 * Le regole di validazione stanno qui e non solo nell'interfaccia: il modulo
 * nel browser e' un suggerimento, il confine e' questo.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { databaseReachable, db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import { notifyOnComment } from "@/lib/social/actions";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { GUEST, getStore, type Viewer } from "./store";
import { HUBS } from "./types";
import type { Vote } from "./types";

export interface ActionState {
  error?: string;
}

const HUB_IDS = HUBS.map((hub) => hub.slug) as [string, ...string[]];

const postSchema = z.object({
  game: z.string().min(1),
  hub: z.enum(HUB_IDS),
  title: z
    .string()
    .trim()
    .min(8, "Il titolo deve avere almeno 8 caratteri")
    .max(140, "Il titolo non puo' superare i 140 caratteri"),
  body: z
    .string()
    .trim()
    .min(20, "Scrivi almeno 20 caratteri: un post di una riga non aiuta nessuno")
    .max(8000, "Il testo e' troppo lungo"),
});

const commentSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().nullish(),
  body: z
    .string()
    .trim()
    .min(2, "Il commento e' troppo corto")
    .max(4000, "Il commento e' troppo lungo"),
});

/**
 * Chi sta agendo.
 *
 * Senza database non c'e' sessione, e si agisce come ospite: e' l'unico modo per
 * poter provare la community prima di avere un account. Con il database attivo
 * serve invece una sessione vera.
 */
export async function currentViewer(): Promise<Viewer | null> {
  if (!(await databaseReachable())) return GUEST;

  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const row = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { id: true, username: true, role: true },
    with: { profile: true },
  });
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    displayName: row.profile?.displayName ?? row.username,
    role: row.role,
    accent: normalizeCustomization(row.profile?.cosmetics).accent,
  };
}

/**
 * Cancello comune a chi scrive.
 *
 * Due controlli, in quest'ordine: il tetto di frequenza (che ferma anche chi
 * agisce in buona fede con uno script) e la sospensione (che ferma una persona
 * precisa). Il tetto viene prima perche' non richiede una lettura sul database.
 *
 * Nella modalita' dimostrativa la sospensione non si legge: non c'e' database e
 * non c'e' un account vero da sospendere.
 */
async function writeGuard(
  viewer: Viewer,
  rule: "post" | "comment",
): Promise<ActionState | null> {
  const limit = rateLimit(rule, viewer.id);
  if (!limit.allowed) return { error: retryMessage(limit) };

  if (!(await databaseReachable())) return null;

  const suspension = await suspensionFor(viewer.id);
  if (suspension.active) return { error: suspensionMessage(suspension) };

  return null;
}

export async function createPostAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const viewer = await currentViewer();
  if (!viewer) return { error: "Entra per pubblicare." };

  const parsed = postSchema.safeParse({
    game: formData.get("game"),
    hub: formData.get("hub"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const blocked = await writeGuard(viewer, "post");
  if (blocked) return blocked;

  const store = await getStore();
  const id = await store.createPost(parsed.data, viewer);

  revalidatePath(`/${parsed.data.game}`);
  redirect(`/${parsed.data.game}/post/${id}`);
}

export async function createCommentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const viewer = await currentViewer();
  if (!viewer) return { error: "Entra per commentare." };

  const rawParent = formData.get("parentId");
  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    parentId: typeof rawParent === "string" && rawParent.length > 0 ? rawParent : null,
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const blocked = await writeGuard(viewer, "comment");
  if (blocked) return blocked;

  const store = await getStore();
  await store.createComment(parsed.data, viewer);

  // Chi ha scritto il post e chi ha scritto il commento padre sono due persone
  // diverse: senza avviso, la conversazione si interrompe per chi non e' il
  // proprietario del post.
  await notifyOnComment(parsed.data.postId, parsed.data.parentId ?? null, viewer.id).catch(
    () => {},
  );

  revalidatePath("/", "layout");
  return {};
}

export async function voteAction(
  targetType: "POST" | "COMMENT",
  targetId: string,
  value: Vote,
): Promise<ActionState> {
  const viewer = await currentViewer();
  if (!viewer) return { error: "Entra per votare." };

  const store = await getStore();
  if (targetType === "POST") await store.votePost(targetId, value, viewer);
  else await store.voteComment(targetId, value, viewer);

  revalidatePath("/", "layout");
  return {};
}
