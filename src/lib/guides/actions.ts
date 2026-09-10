"use server";

/**
 * Azioni sulle guide.
 *
 * Chi puo' fare cosa, in breve:
 *
 *  - CONTRIBUTOR   scrive e modifica le PROPRIE guide, e le manda in revisione
 *  - EDITOR        pubblica, archivia e dichiara la patch di verifica
 *  - autore stesso puo' sempre modificare la propria bozza
 *
 * La proposta non si autopubblica di proposito. Il valore di questa sezione e'
 * la dichiarazione di patch verificata: se chiunque potesse apporre quel
 * contrassegno da solo, non significherebbe piu' niente.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { can, type Role } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { normalizeCustomization } from "@/lib/profile/customization";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { getGuideStore, type GuideWriter } from "./store";
import { GUIDE_STATUSES } from "./types";

export interface GuideActionState {
  error?: string;
  success?: string;
}

const DEMO_WRITER: GuideWriter = {
  id: "demo",
  username: "franz",
  displayName: "Franz",
  accent: "brand",
};

/**
 * Chi scrive.
 *
 * Senza database si scrive come autore dimostrativo: e' la stessa scelta fatta
 * per la community, e serve a poter provare la sezione prima di avere un
 * account. Il ruolo, in quel caso, e' quello che consente di vedere tutto il
 * percorso - altrimenti la modalita' di prova mostrerebbe solo un modulo che
 * non porta a niente.
 */
async function writer(): Promise<{ writer: GuideWriter; role: Role } | null> {
  if (!(await databaseReachable())) {
    return { writer: DEMO_WRITER, role: "EDITOR" };
  }

  const session = await auth();
  if (!session?.user?.id) return null;

  const row = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { id: true, username: true, role: true },
    with: { profile: true },
  });
  if (!row) return null;

  return {
    writer: {
      id: row.id,
      username: row.username,
      displayName: row.profile?.displayName ?? row.username,
      accent: normalizeCustomization(row.profile?.cosmetics).accent,
    },
    role: row.role,
  };
}

const createSchema = z.object({
  game: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(10, "Il titolo deve avere almeno 10 caratteri")
    .max(140, "Il titolo non può superare i 140 caratteri"),
  body: z
    .string()
    .trim()
    .min(200, "Una guida sotto i 200 caratteri è un commento: scrivila nella community")
    .max(60000, "Il testo è troppo lungo"),
  characterId: z.string().trim().max(80).optional(),
});

export async function createGuideAction(
  _previous: GuideActionState,
  formData: FormData,
): Promise<GuideActionState> {
  const current = await writer();
  if (!current) return { error: "Entra per scrivere una guida." };

  if (!can(current.role, "submitGuide")) {
    return {
      error:
        "Per proporre una guida serve il ruolo di collaboratore. Scrivi nella community: è da lì che si assegna.",
    };
  }

  const parsed = createSchema.safeParse({
    game: formData.get("game"),
    title: formData.get("title"),
    body: formData.get("body"),
    characterId: formData.get("characterId") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  if (await databaseReachable()) {
    const suspension = await suspensionFor(current.writer.id);
    if (suspension.active) return { error: suspensionMessage(suspension) };
  }

  const store = await getGuideStore();
  const slug = await store.create(
    {
      game: parsed.data.game,
      title: parsed.data.title,
      body: parsed.data.body,
      characterId: parsed.data.characterId?.length ? parsed.data.characterId : null,
    },
    current.writer,
  );

  revalidatePath(`/${parsed.data.game}/guide`);
  redirect(`/${parsed.data.game}/guide/${slug}`);
}

const updateSchema = z.object({
  id: z.string().min(1),
  game: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().trim().min(10).max(140),
  body: z.string().trim().min(200).max(60000),
  note: z.string().trim().max(300).optional(),
});

export async function updateGuideAction(
  _previous: GuideActionState,
  formData: FormData,
): Promise<GuideActionState> {
  const current = await writer();
  if (!current) return { error: "Entra per modificare la guida." };

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    game: formData.get("game"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    body: formData.get("body"),
    note: formData.get("note") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const store = await getGuideStore();
  const authorId = await store.authorOf(parsed.data.id);
  if (authorId === null) return { error: "Questa guida non esiste più." };

  // Il proprio contenuto si modifica sempre; quello di altri solo da redattore
  // in su. Il controllo sta qui e non nell'interfaccia: il modulo nel browser
  // si puo' ricostruire a mano.
  const own = authorId === current.writer.id;
  if (!own && !can(current.role, "publishGuide")) {
    return { error: "Puoi modificare solo le tue guide." };
  }

  await store.update(
    parsed.data.id,
    { title: parsed.data.title, body: parsed.data.body },
    current.writer,
    parsed.data.note,
  );

  revalidatePath(`/${parsed.data.game}/guide/${parsed.data.slug}`);
  revalidatePath(`/${parsed.data.game}/guide`);
  return { success: "Modifiche salvate. La versione precedente è nella cronologia." };
}

const statusSchema = z.object({
  id: z.string().min(1),
  game: z.string().min(1),
  status: z.enum(GUIDE_STATUSES),
});

export async function setGuideStatusAction(
  id: string,
  game: string,
  status: string,
): Promise<GuideActionState> {
  const current = await writer();
  if (!current) return { error: "Entra per farlo." };

  const parsed = statusSchema.safeParse({ id, game, status });
  if (!parsed.success) return { error: "Stato non valido." };

  const store = await getGuideStore();
  const authorId = await store.authorOf(id);
  if (authorId === null) return { error: "Questa guida non esiste più." };

  const own = authorId === current.writer.id;

  // Mandare in revisione e' un'azione dell'autore: e' lui che dichiara di aver
  // finito. Pubblicare e archiviare no, e questa e' la riga che tiene in piedi
  // il significato del contrassegno di patch verificata.
  const allowed =
    parsed.data.status === "IN_REVIEW" || parsed.data.status === "DRAFT"
      ? own || can(current.role, "publishGuide")
      : can(current.role, "publishGuide");

  if (!allowed) return { error: "Non hai i permessi per questo passaggio." };

  await store.setStatus(id, parsed.data.status);

  revalidatePath(`/${game}/guide`);
  revalidatePath("/", "layout");
  return { success: "Stato aggiornato." };
}

const patchSchema = z.object({
  id: z.string().min(1),
  game: z.string().min(1),
  slug: z.string().min(1),
  patch: z.string().trim().max(40),
});

/**
 * Dichiara in quale patch i numeri sono stati controllati.
 *
 * Un campo vuoto azzera la dichiarazione, e la guida torna "da rivedere". Deve
 * essere possibile: chi si accorge di aver contrassegnato per sbaglio deve poter
 * tornare indietro, e lo stato piu' onesto e' "non lo so".
 */
export async function setVerifiedPatchAction(
  _previous: GuideActionState,
  formData: FormData,
): Promise<GuideActionState> {
  const current = await writer();
  if (!current) return { error: "Entra per farlo." };

  if (!can(current.role, "publishGuide")) {
    return { error: "Solo un redattore può dichiarare la patch di verifica." };
  }

  const parsed = patchSchema.safeParse({
    id: formData.get("id"),
    game: formData.get("game"),
    slug: formData.get("slug"),
    patch: formData.get("patch") ?? "",
  });
  if (!parsed.success) return { error: "Dati non validi." };

  const store = await getGuideStore();
  await store.setVerifiedPatch(
    parsed.data.id,
    parsed.data.patch.length > 0 ? parsed.data.patch : null,
    current.writer,
  );

  revalidatePath(`/${parsed.data.game}/guide/${parsed.data.slug}`);
  revalidatePath(`/${parsed.data.game}/guide`);
  return {
    success:
      parsed.data.patch.length > 0
        ? `Verificata per la patch ${parsed.data.patch}.`
        : "Dichiarazione rimossa: la guida risulta da rivedere.",
  };
}
