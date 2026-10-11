"use server";

/**
 * Azioni della community.
 *
 * Le regole di validazione stanno qui e non solo nell'interfaccia: il modulo
 * nel browser e' un suggerimento, il confine e' questo.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { comments, posts, users } from "@/lib/db/schema";
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { normalizeCustomization } from "@/lib/profile/customization";
import { notifyOnComment } from "@/lib/social/server";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { getGameModule } from "@/lib/games/registry";
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
    nonPubblicato: "Questa guida non è ancora pubblicata: si vota e si commenta dopo la revisione.",
    nonDisponibile: "Questo contenuto non c'è più o non è aperto.",
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
    nonPubblicato: "This guide isn't published yet: voting and comments open after review.",
    nonDisponibile: "This content no longer exists or isn't open.",
  },
});

type Testi = (typeof TESTI)["it"];

/**
 * Col database gli id sono UUID; nella modalita' dimostrativa «local-N». Un id
 * scritto a mano che non e' un UUID farebbe fallire la query con un errore 500:
 * si respinge prima, come dato non valido.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function idsValid(...ids: readonly (string | null | undefined)[]): Promise<boolean> {
  if (!(await databaseReachable())) return true;
  return ids.every((id) => id == null || UUID.test(id));
}

const HUB_IDS = HUBS.map((hub) => hub.slug) as [string, ...string[]];

// Gli schemi si costruiscono con i testi della lingua di chi scrive: i
// messaggi di validazione arrivano a video cosi' come sono.
const postSchema = (t: Testi) =>
  z.object({
    // solo i giochi del sito: senza, un post a mano creava un «gioco» che nessuna
    // pagina mostra (11/10)
    game: z.string().refine((slug) => getGameModule(slug) !== undefined),
    hub: z.enum(HUB_IDS),
    title: z.string().trim().min(8, t.titoloCorto).max(140, t.titoloLungo),
    body: z.string().trim().min(20, t.testoCorto).max(8000, t.testoLungo),
  });

const commentSchema = (t: Testi) =>
  z.object({
    postId: z.string().min(1).max(64),
    parentId: z.string().max(64).nullish(),
    body: z.string().trim().min(2, t.commentoCorto).max(4000, t.commentoLungo),
  });

/**
 * Chi sta agendo.
 *
 * Senza database non c'e' sessione, e si agisce come ospite: e' l'unico modo per
 * poter provare la community prima di avere un account. Con il database attivo
 * serve invece una sessione vera.
 *
 * Ospite solo se il database NON e' configurato. Configurato ma per un attimo
 * irraggiungibile, fino all'11/10 si scriveva come ospite nell'archivio in
 * memoria, che tutti vedono: ora nessuno (segnalato dalla sessione sulla
 * sicurezza).
 */
export async function currentViewer(): Promise<Viewer | null> {
  if (!isDatabaseConfigured()) return GUEST;
  if (!(await databaseReachable())) return null;

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
 * Se si puo' votare o commentare un post: deve esistere, non essere nascosto e,
 * se e' una guida dell'Endgame, essere pubblicata. Fino all'11/10 si commentava
 * un post nascosto (e l'autore riceveva la notifica col titolo) e si votava un id
 * qualunque, lasciando righe orfane nei voti. Nella modalita' dimostrativa non
 * c'e' niente da controllare.
 */
async function postBlock(postId: string): Promise<"missing" | "unpublished" | null> {
  if (!(await databaseReachable())) return null;
  const row = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { hidden: true },
    with: { strategy: { columns: { status: true } } },
  });
  if (!row || row.hidden) return "missing";
  if (row.strategy && row.strategy.status !== "PUBLISHED") return "unpublished";
  return null;
}

/** Lo stesso per un commento: esiste, non e' nascosto, e il suo post e' aperto. */
async function commentBlock(commentId: string): Promise<"missing" | "unpublished" | null> {
  if (!(await databaseReachable())) return null;
  const row = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    columns: { hidden: true, postId: true },
  });
  if (!row || row.hidden) return "missing";
  return postBlock(row.postId);
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
  rule: "post" | "comment" | "vote",
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

  if (!(await idsValid(parsed.data.postId, parsed.data.parentId))) return { error: t.datiNonValidi };

  // una guida dell'Endgame in revisione si legge (autore e moderatori) ma non si
  // discute: prima la decide un moderatore; e un post nascosto non si commenta
  const closed = await postBlock(parsed.data.postId);
  if (closed) return { error: closed === "unpublished" ? t.nonPubblicato : t.nonDisponibile };

  // La risposta deve stare nello stesso post del commento a cui risponde: senza
  // il controllo, una richiesta a mano mandava l'avviso di risposta all'autore
  // di un commento di un'altra discussione (11/10)
  if (parsed.data.parentId && (await databaseReachable())) {
    const parent = await db.query.comments.findFirst({
      where: and(eq(comments.id, parsed.data.parentId), eq(comments.postId, parsed.data.postId)),
      columns: { id: true },
    });
    if (!parent) return { error: t.datiNonValidi };
  }

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

/**
 * Il voto arriva dal browser cosi' com'e': fino all'11/10 il valore non si
 * controllava, e il punteggio sommava qualunque numero (un voto da un milione).
 * Ora solo -1, 0, 1, col tetto di frequenza e la sospensione di chi scrive.
 */
const voteSchema = z.object({
  targetType: z.enum(["POST", "COMMENT"]),
  targetId: z.string().min(1).max(64),
  value: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
});

export async function voteAction(
  targetType: "POST" | "COMMENT",
  targetId: string,
  value: Vote,
): Promise<ActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];
  const viewer = await currentViewer();
  if (!viewer) return { error: t.entraPerVotare };

  const parsed = voteSchema.safeParse({ targetType, targetId, value });
  if (!parsed.success || !(await idsValid(parsed.data.targetId))) return { error: t.datiNonValidi };

  const blocked = await writeGuard(viewer, "vote", locale);
  if (blocked) return blocked;

  const closed =
    parsed.data.targetType === "POST"
      ? await postBlock(parsed.data.targetId)
      : await commentBlock(parsed.data.targetId);
  if (closed) return { error: closed === "unpublished" ? t.nonPubblicato : t.nonDisponibile };

  const store = await getStore();
  if (parsed.data.targetType === "POST") await store.votePost(parsed.data.targetId, parsed.data.value, viewer);
  else await store.voteComment(parsed.data.targetId, parsed.data.value, viewer);

  revalidatePath("/", "layout");
  return {};
}
