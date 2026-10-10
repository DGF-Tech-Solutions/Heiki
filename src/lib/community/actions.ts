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
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
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

const TESTI = testi({
  it: {
    titoloCorto: "Il titolo deve avere almeno 8 caratteri",
    titoloLungo: "Il titolo non può superare i 140 caratteri",
    testoCorto: "Scrivi almeno 20 caratteri: un post di una riga non aiuta nessuno",
    testoLungo: "Il testo è troppo lungo",
    commentoCorto: "Il commento è troppo corto",
    commentoLungo: "Il commento è troppo lungo",
    entraPerPubblicare: "Entra per pubblicare.",
    datiNonValidi: "Dati non validi.",
    entraPerCommentare: "Entra per commentare.",
    entraPerVotare: "Entra per votare.",
  },
  en: {
    titoloCorto: "The title must be at least 8 characters long",
    titoloLungo: "The title can't be longer than 140 characters",
    testoCorto: "Write at least 20 characters: a one-line post doesn't help anyone",
    testoLungo: "The text is too long",
    commentoCorto: "The comment is too short",
    commentoLungo: "The comment is too long",
    entraPerPubblicare: "Log in to post.",
    datiNonValidi: "Invalid data.",
    entraPerCommentare: "Log in to comment.",
    entraPerVotare: "Log in to vote.",
  },
});

type Testi = (typeof TESTI)["it"];

const HUB_IDS = HUBS.map((hub) => hub.slug) as [string, ...string[]];

// Gli schemi si costruiscono con i testi della lingua di chi scrive: i
// messaggi di validazione arrivano a video cosi' come sono.
const postSchema = (t: Testi) =>
  z.object({
    game: z.string().min(1),
    hub: z.enum(HUB_IDS),
    title: z.string().trim().min(8, t.titoloCorto).max(140, t.titoloLungo),
    body: z.string().trim().min(20, t.testoCorto).max(8000, t.testoLungo),
  });

const commentSchema = (t: Testi) =>
  z.object({
    postId: z.string().min(1),
    parentId: z.string().nullish(),
    body: z.string().trim().min(2, t.commentoCorto).max(4000, t.commentoLungo),
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
  locale: Locale,
): Promise<ActionState | null> {
  const limit = rateLimit(rule, viewer.id);
  if (!limit.allowed) return { error: retryMessage(limit, locale) };

  if (!(await databaseReachable())) return null;

  const suspension = await suspensionFor(viewer.id);
  if (suspension.active) return { error: suspensionMessage(suspension, locale) };

  return null;
}

export async function createPostAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const viewer = await currentViewer();
  if (!viewer) return { error: t.entraPerPubblicare };

  const parsed = postSchema(t).safeParse({
    game: formData.get("game"),
    hub: formData.get("hub"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const blocked = await writeGuard(viewer, "post", locale);
  if (blocked) return blocked;

  const store = await getStore();
  const id = await store.createPost(parsed.data, viewer);

  revalidatePath(`/${parsed.data.game}`);
  revalidatePath(`/${parsed.data.game}/discussioni`);
  redirect(`/${parsed.data.game}/post/${id}`);
}

export async function createCommentAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const viewer = await currentViewer();
  if (!viewer) return { error: t.entraPerCommentare };

  const rawParent = formData.get("parentId");
  const parsed = commentSchema(t).safeParse({
    postId: formData.get("postId"),
    parentId: typeof rawParent === "string" && rawParent.length > 0 ? rawParent : null,
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const blocked = await writeGuard(viewer, "comment", locale);
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
  if (!viewer) return { error: TESTI[await getLocale()].entraPerVotare };

  const store = await getStore();
  if (targetType === "POST") await store.votePost(targetId, value, viewer);
  else await store.voteComment(targetId, value, viewer);

  revalidatePath("/", "layout");
  return {};
}
