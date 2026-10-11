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
import { databaseReachable, db, isDatabaseConfigured } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getGameModule } from "@/lib/games/registry";
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { normalizeCustomization } from "@/lib/profile/customization";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { canMoveGuide, getGuideStore, type GuideStore, type GuideWriter } from "./store";
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
    databaseFermo: "Il database non risponde: riprova fra poco. Niente è stato salvato.",
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
    databaseFermo: "The database isn't responding: try again shortly. Nothing was saved.",
  },
});

type Testi = (typeof TESTI)["it"];

const DEMO_WRITER: GuideWriter = {
  id: "demo",
  username: "franz",
  displayName: "Franz",
  accent: "brand",
};

type Writer =
  | { ok: true; writer: GuideWriter; role: Role; store: GuideStore }
  | { ok: false; reason: "ospite" | "offline" };

/**
 * Chi scrive, e su quale archivio.
 *
 * Senza database si scrive come autore dimostrativo: e' la stessa scelta fatta
 * per la community, e serve a poter provare la sezione prima di avere un
 * account. Il ruolo, in quel caso, e' quello che consente di vedere tutto il
 * percorso - altrimenti la modalita' di prova mostrerebbe solo un modulo che
 * non porta a niente.
 *
 * Dimostrativa solo se il database NON e' configurato. Configurato ma per un
 * attimo irraggiungibile, fino all'11/10 chiunque - anche senza sessione -
 * scriveva come redattore nell'archivio in memoria, e quello che pubblicava lo
 * vedevano tutti finche' il server restava acceso. Ora e' un errore: niente
 * ospite, niente redattore, niente salvato.
 */
async function writer(): Promise<Writer> {
  if (!isDatabaseConfigured()) {
    return { ok: true, writer: DEMO_WRITER, role: "EDITOR", store: await getGuideStore() };
  }
  if (!(await databaseReachable())) return { ok: false, reason: "offline" };

  const session = await auth();
  if (!session?.user?.id) return { ok: false, reason: "ospite" };

  const row = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { id: true, username: true, role: true },
    with: { profile: { columns: { displayName: true, cosmetics: true } } },
  });
  if (!row) return { ok: false, reason: "ospite" };

  // Fra la sonda qui sopra e questa il database puo' essere caduto: con un
  // database configurato, l'archivio in memoria non si usa mai per scrivere.
  const store = await getGuideStore();
  if (store.volatile) return { ok: false, reason: "offline" };

  return {
    ok: true,
    writer: {
      id: row.id,
      username: row.username,
      displayName: row.profile?.displayName ?? row.username,
      accent: normalizeCustomization(row.profile?.cosmetics).accent,
    },
    role: row.role,
    store,
  };
}

/**
 * Il messaggio di sospensione, o null se chi scrive puo' scrivere.
 *
 * Vale per ogni azione che cambia una guida, comprese quelle del redattore:
 * fino all'11/10 un redattore sospeso non poteva correggere una virgola ma
 * poteva ancora pubblicare, archiviare e dichiarare la patch verificata.
 * Nella modalita' dimostrativa non c'e' un account vero da sospendere.
 */
async function suspendedMessage(
  current: Extract<Writer, { ok: true }>,
  locale: Locale,
): Promise<string | null> {
  if (current.store.volatile) return null;
  const suspension = await suspensionFor(current.writer.id);
  return suspension.active ? suspensionMessage(suspension, locale) : null;
}

/**
 * Col database gli id sono UUID; nella modalita' dimostrativa no. Un id scritto
 * a mano che non e' un UUID farebbe fallire la query con un errore 500: si
 * respinge prima, come guida che non esiste.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validId(store: GuideStore, id: string): boolean {
  return store.volatile || UUID.test(id);
}

/** Solo i giochi del sito: un nome inventato creerebbe guide che nessuna pagina mostra. */
const gameField = (t: Testi) =>
  z.string().refine((slug) => getGameModule(slug) !== undefined, { message: t.datiNonValidi });

// Gli schemi si costruiscono con i testi della lingua di chi scrive: i
// messaggi di validazione arrivano a video cosi' come sono.
const titleField = (t: Testi) => z.string().trim().min(10, t.titoloCorto).max(140, t.titoloLungo);

const bodyField = (t: Testi) => z.string().trim().min(200, t.testoCorto).max(60000, t.testoLungo);

const createSchema = (t: Testi) =>
  z
    .object({
      game: gameField(t),
      title: titleField(t),
      body: bodyField(t),
      characterId: z.string().trim().max(80).optional(),
    })
    // il personaggio deve essere uno di quelli che l'editor offre per quel gioco
    .refine(
      (data) =>
        !data.characterId ||
        (getGameModule(data.game)?.characters.some((entry) => entry.id === data.characterId) ??
          false),
      { message: t.datiNonValidi },
    );

export async function createGuideAction(
  _previous: GuideActionState,
  formData: FormData,
): Promise<GuideActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const current = await writer();
  if (!current.ok) {
    return { error: current.reason === "offline" ? t.databaseFermo : t.entraPerScrivere };
  }

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

  const suspended = await suspendedMessage(current, locale);
  if (suspended) return { error: suspended };

  const store = current.store;
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
    id: z.string().min(1).max(64),
    game: gameField(t),
    slug: z.string().min(1).max(200),
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
  if (!current.ok) {
    return { error: current.reason === "offline" ? t.databaseFermo : t.entraPerModificare };
  }

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

  const store = current.store;
  if (!validId(store, parsed.data.id)) return { error: t.nonEsiste };
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

  const suspended = await suspendedMessage(current, locale);
  if (suspended) return { error: suspended };

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

const statusSchema = (t: Testi) =>
  z.object({
    id: z.string().min(1).max(64),
    game: gameField(t),
    status: z.enum(GUIDE_STATUSES),
  });

export async function setGuideStatusAction(
  id: string,
  game: string,
  status: string,
): Promise<GuideActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const current = await writer();
  if (!current.ok) {
    return { error: current.reason === "offline" ? t.databaseFermo : t.entraPerFarlo };
  }

  const parsed = statusSchema(t).safeParse({ id, game, status });
  if (!parsed.success) return { error: t.statoNonValido };

  const store = current.store;
  if (!validId(store, parsed.data.id)) return { error: t.nonEsiste };
  const state = await store.stateOf(parsed.data.id);
  // il gioco dell'indirizzo deve essere quello della guida, come in updateGuideAction
  if (state === null || state.game !== parsed.data.game) return { error: t.nonEsiste };

  const own = state.authorId === current.writer.id;
  const editor = can(current.role, "publishGuide");

  // Chi lo ha gia' fatto (un altro clic, un'altra scheda) non riceve un rifiuto.
  if (state.status === parsed.data.status) return { success: t.statoAggiornato };

  // Mandare in revisione e ritirare in bozza sono azioni dell'autore, e solo
  // fra le sue bozze. Pubblicare e archiviare no, e questa e' la regola che
  // tiene in piedi il significato del contrassegno di patch verificata.
  if (!canMoveGuide(state.status, parsed.data.status, { own, editor })) {
    return { error: t.senzaPermessi };
  }

  const suspended = await suspendedMessage(current, locale);
  if (suspended) return { error: suspended };

  // `expected`: il permesso vale per lo stato appena letto. Se nel frattempo
  // e' cambiato, il passaggio non si fa e chi agisce lo rivede da capo.
  const moved = await store.setStatus(parsed.data.id, parsed.data.status, {
    expected: state.status,
    audit: editor && !own ? { moderatorId: current.writer.id } : undefined,
  });
  if (!moved) return { error: t.senzaPermessi };

  revalidatePath(`/${parsed.data.game}/guide`);
  revalidatePath(`/${parsed.data.game}/guide/${state.slug}`);
  revalidatePath("/", "layout");
  return { success: t.statoAggiornato };
}

const patchSchema = (t: Testi) =>
  z.object({
    id: z.string().min(1).max(64),
    game: gameField(t),
    slug: z.string().min(1).max(200),
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
  const locale = await getLocale();
  const t = TESTI[locale];

  const current = await writer();
  if (!current.ok) {
    return { error: current.reason === "offline" ? t.databaseFermo : t.entraPerFarlo };
  }

  if (!can(current.role, "publishGuide")) {
    return { error: t.soloRedattore };
  }

  const parsed = patchSchema(t).safeParse({
    id: formData.get("id"),
    game: formData.get("game"),
    slug: formData.get("slug"),
    patch: formData.get("patch") ?? "",
  });
  if (!parsed.success) return { error: t.datiNonValidi };

  const store = current.store;
  if (!validId(store, parsed.data.id)) return { error: t.nonEsiste };
  // id, gioco e indirizzo devono indicare la stessa guida: il modulo si
  // ricostruisce a mano, e fino all'11/10 un id inesistente riceveva comunque
  // il messaggio di patch verificata
  const state = await store.stateOf(parsed.data.id);
  if (state === null || state.game !== parsed.data.game || state.slug !== parsed.data.slug) {
    return { error: t.nonEsiste };
  }

  const suspended = await suspendedMessage(current, locale);
  if (suspended) return { error: suspended };

  // Nel registro anche quando il redattore certifica una guida sua: la
  // dichiarazione la fa sempre un redattore, e quella sulla propria guida e'
  // proprio quella che un giorno qualcuno vorra' ricontrollare.
  await store.setVerifiedPatch(
    parsed.data.id,
    parsed.data.patch.length > 0 ? parsed.data.patch : null,
    current.writer,
    { moderatorId: current.writer.id },
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
