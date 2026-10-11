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
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { normalizeCustomization } from "@/lib/profile/customization";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { getGuideStore, type GuideWriter } from "./store";
import { GUIDE_STATUSES } from "./types";

export interface GuideActionState {
  error?: string;
  success?: string;
}

const TESTI = testi({
  it: {
    titoloCorto: "Il titolo deve avere almeno 10 caratteri",
    titoloLungo: "Il titolo non può superare i 140 caratteri",
    testoCorto: "Una guida sotto i 200 caratteri è un commento: scrivila nella community",
    testoLungo: "Il testo è troppo lungo",
    entraPerScrivere: "Entra per scrivere una guida.",
    serveRuolo:
      "Per proporre una guida serve il ruolo di collaboratore. Scrivi nella community: è da lì che si assegna.",
    datiNonValidi: "Dati non validi.",
    entraPerModificare: "Entra per modificare la guida.",
    nonEsiste: "Questa guida non esiste più.",
    soloTue: "Puoi modificare solo le tue guide.",
    modificheSalvate: "Modifiche salvate. La versione precedente è nella cronologia.",
    tornaInRevisione:
      "Modifiche salvate. La guida era pubblicata: torna in revisione, e la patch verificata va dichiarata di nuovo.",
    entraPerFarlo: "Entra per farlo.",
    statoNonValido: "Stato non valido.",
    senzaPermessi: "Non hai i permessi per questo passaggio.",
    statoAggiornato: "Stato aggiornato.",
    soloRedattore: "Solo un redattore può dichiarare la patch di verifica.",
    verificataPer: (patch: string) => `Verificata per la patch ${patch}.`,
    dichiarazioneRimossa: "Dichiarazione rimossa: la guida risulta da rivedere.",
  },
  en: {
    titoloCorto: "The title must be at least 10 characters long",
    titoloLungo: "The title can't be longer than 140 characters",
    testoCorto: "A guide under 200 characters is a comment: post it in the community",
    testoLungo: "The text is too long",
    entraPerScrivere: "Log in to write a guide.",
    serveRuolo:
      "Proposing a guide requires the contributor role. Post in the community: that's where it's granted.",
    datiNonValidi: "Invalid data.",
    entraPerModificare: "Log in to edit the guide.",
    nonEsiste: "This guide no longer exists.",
    soloTue: "You can only edit your own guides.",
    modificheSalvate: "Changes saved. The previous version is in the history.",
    tornaInRevisione:
      "Changes saved. The guide was published: it goes back to review, and the verified patch must be declared again.",
    entraPerFarlo: "Log in to do this.",
    statoNonValido: "Invalid status.",
    senzaPermessi: "You don't have permission for this step.",
    statoAggiornato: "Status updated.",
    soloRedattore: "Only an editor can declare the verification patch.",
    verificataPer: (patch: string) => `Verified for patch ${patch}.`,
    dichiarazioneRimossa: "Declaration removed: the guide is now flagged for review.",
  },
});

type Testi = (typeof TESTI)["it"];

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

// Gli schemi si costruiscono con i testi della lingua di chi scrive: i
// messaggi di validazione arrivano a video cosi' come sono.
const titleField = (t: Testi) => z.string().trim().min(10, t.titoloCorto).max(140, t.titoloLungo);

const bodyField = (t: Testi) => z.string().trim().min(200, t.testoCorto).max(60000, t.testoLungo);

const createSchema = (t: Testi) =>
  z.object({
    game: z.string().min(1),
    title: titleField(t),
    body: bodyField(t),
    characterId: z.string().trim().max(80).optional(),
  });

export async function createGuideAction(
  _previous: GuideActionState,
  formData: FormData,
): Promise<GuideActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const current = await writer();
  if (!current) return { error: t.entraPerScrivere };

  if (!can(current.role, "submitGuide")) {
    return { error: t.serveRuolo };
  }

  const parsed = createSchema(t).safeParse({
    game: formData.get("game"),
    title: formData.get("title"),
    body: formData.get("body"),
    characterId: formData.get("characterId") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  if (await databaseReachable()) {
    const suspension = await suspensionFor(current.writer.id);
    if (suspension.active) return { error: suspensionMessage(suspension, locale) };
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

const updateSchema = (t: Testi) =>
  z.object({
    id: z.string().min(1),
    game: z.string().min(1),
    slug: z.string().min(1),
    title: titleField(t),
    body: bodyField(t),
    note: z.string().trim().max(300).optional(),
  });

export async function updateGuideAction(
  _previous: GuideActionState,
  formData: FormData,
): Promise<GuideActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const current = await writer();
  if (!current) return { error: t.entraPerModificare };

  const parsed = updateSchema(t).safeParse({
    id: formData.get("id"),
    game: formData.get("game"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    body: formData.get("body"),
    note: formData.get("note") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const store = await getGuideStore();
  const authorId = await store.authorOf(parsed.data.id);
  if (authorId === null) return { error: t.nonEsiste };

  // Il proprio contenuto si modifica sempre; quello di altri solo da redattore
  // in su. Il controllo sta qui e non nell'interfaccia: il modulo nel browser
  // si puo' ricostruire a mano.
  const own = authorId === current.writer.id;
  const editor = can(current.role, "publishGuide");
  if (!own && !editor) {
    return { error: t.soloTue };
  }

  if (await databaseReachable()) {
    const suspension = await suspensionFor(current.writer.id);
    if (suspension.active) return { error: suspensionMessage(suspension, locale) };
  }

  // la guida dell'indirizzo deve essere quella dell'id: il modulo si ricostruisce a mano
  const before = await store.get(parsed.data.game, parsed.data.slug);
  if (!before || before.id !== parsed.data.id) return { error: t.nonEsiste };

  await store.update(
    parsed.data.id,
    { title: parsed.data.title, body: parsed.data.body },
    current.writer,
    parsed.data.note,
  );

  // Una guida pubblicata con la patch verificata non cambia senza che un
  // redattore la riveda: fino all'11/10 l'autore poteva riscriverla da capo e
  // restava pubblica, col contrassegno «verificata» (la regola in testa al file)
  const backToReview = !editor && before.status === "PUBLISHED";
  if (backToReview) {
    await store.setStatus(parsed.data.id, "IN_REVIEW");
    await store.setVerifiedPatch(parsed.data.id, null, current.writer);
  }

  revalidatePath(`/${parsed.data.game}/guide/${parsed.data.slug}`);
  revalidatePath(`/${parsed.data.game}/guide`);
  return { success: backToReview ? t.tornaInRevisione : t.modificheSalvate };
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
  const t = TESTI[await getLocale()];

  const current = await writer();
  if (!current) return { error: t.entraPerFarlo };

  const parsed = statusSchema.safeParse({ id, game, status });
  if (!parsed.success) return { error: t.statoNonValido };

  const store = await getGuideStore();
  const authorId = await store.authorOf(id);
  if (authorId === null) return { error: t.nonEsiste };

  const own = authorId === current.writer.id;

  // Mandare in revisione e' un'azione dell'autore: e' lui che dichiara di aver
  // finito. Pubblicare e archiviare no, e questa e' la riga che tiene in piedi
  // il significato del contrassegno di patch verificata.
  const allowed =
    parsed.data.status === "IN_REVIEW" || parsed.data.status === "DRAFT"
      ? own || can(current.role, "publishGuide")
      : can(current.role, "publishGuide");

  if (!allowed) return { error: t.senzaPermessi };

  await store.setStatus(id, parsed.data.status);

  revalidatePath(`/${game}/guide`);
  revalidatePath("/", "layout");
  return { success: t.statoAggiornato };
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
  const t = TESTI[await getLocale()];

  const current = await writer();
  if (!current) return { error: t.entraPerFarlo };

  if (!can(current.role, "publishGuide")) {
    return { error: t.soloRedattore };
  }

  const parsed = patchSchema.safeParse({
    id: formData.get("id"),
    game: formData.get("game"),
    slug: formData.get("slug"),
    patch: formData.get("patch") ?? "",
  });
  if (!parsed.success) return { error: t.datiNonValidi };

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
        ? t.verificataPer(parsed.data.patch)
        : t.dichiarazioneRimossa,
  };
}
