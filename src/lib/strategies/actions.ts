"use server";

/**
 * Azioni delle strategie dell'Endgame: scrivere (o modificare) e rivedere.
 *
 * Il modulo nel browser manda la bozza in JSON (campo `strategy`): una squadra
 * di quattro posti con gli associati e una nota per fase non entra bene nei
 * campi piatti di un FormData. Il controllo vero e' `checkStrategy`, qui.
 *
 * La regola della revisione (scelta dell'utente, 11/10): senza testo e' un
 * consiglio di squadra e si pubblica subito; con un testo e' una guida e la
 * decide un moderatore. Una guida pubblicata che l'autore modifica torna in
 * revisione solo se cambia il testo: squadra e set non sono cio' che il
 * moderatore ha letto.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable } from "@/lib/db";
import { notifyModerators } from "@/lib/discord";
import { getGameModule } from "@/lib/games/registry";
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { MODE_SLUGS, autoTitle, checkStrategy, selectionLabel, strategyKind, type StrategyProblem } from "./rules";
import { createStrategy, decideStrategy, getStrategy, strategyOwner, updateStrategy } from "./server";
import { STRATEGY_LIMITS, type StrategyDraft, type StrategySelection, type StrategyStatus } from "./types";

/** Il campo da evidenziare nel modulo quando c'e' un errore. */
export type StrategyField = "mode" | "target" | "level" | "team" | "set" | "title" | "notes" | "phases";

export interface StrategyActionState {
  error?: string;
  field?: StrategyField;
  /** il posto della squadra (da 0) che ha il problema */
  slot?: number;
  /** la fase (da 0) che ha il problema */
  phase?: number;
}

const TESTI = testi({
  it: {
    serveDatabase: "Le strategie si scrivono solo col database acceso.",
    entra: "Entra per pubblicare una strategia.",
    datiNonValidi: "Dati non validi.",
    nonTua: "Puoi modificare solo le tue strategie.",
    problemi: {
      mode: "Scegli una modalità.",
      target: "Scegli il boss o la bestia.",
      level: "Scegli la difficoltà.",
      "team-size": "Servono quattro eroi.",
      hero: (n: number) => `Il posto ${n} ha un eroe che non esiste.`,
      duplicate: (n: number) =>
        `Al posto ${n} c'è un personaggio già in squadra: eroi e associati devono essere otto personaggi diversi.`,
      banned: (n: number) => `L'eroe del posto ${n} non può entrare in questa modalità.`,
      attribute: (n: number) => `L'eroe del posto ${n} non ha un attributo ammesso a questa difficoltà.`,
      set: "Questo set di artefatti non vale in questa modalità.",
      phases: "Le note delle fasi non corrispondono alla difficoltà scelta.",
      "title-missing": "Una guida ha bisogno di un titolo.",
      "title-short": `Il titolo deve avere almeno ${STRATEGY_LIMITS.titleMin} caratteri.`,
      "title-long": `Il titolo non può superare i ${STRATEGY_LIMITS.titleMax} caratteri.`,
      "title-only":
        "Il titolo serve alle guide: scrivi qualcosa nelle note o nelle fasi, oppure lascialo vuoto e il consiglio di squadra si pubblica subito.",
      "notes-long": `Le note non possono superare i ${STRATEGY_LIMITS.notesMax} caratteri.`,
      "phase-long": (n: number) => `La nota della fase ${n} supera i ${STRATEGY_LIMITS.phaseMax} caratteri.`,
    },
    soloModeratori: "Solo un moderatore decide le guide.",
    nonLaTua: "Una guida tua la decide un altro moderatore.",
    giaDecisa: "Un altro moderatore l'ha già decisa.",
    serveMotivo: "Scrivi il motivo del rifiuto: lo legge chi l'ha scritta.",
    motivoLungo: "Il motivo è troppo lungo.",
  },
  en: {
    serveDatabase: "Strategies can only be written with the database running.",
    entra: "Log in to post a strategy.",
    datiNonValidi: "Invalid data.",
    nonTua: "You can only edit your own strategies.",
    problemi: {
      mode: "Pick a mode.",
      target: "Pick the boss or the beast.",
      level: "Pick the difficulty.",
      "team-size": "Four heroes are needed.",
      hero: (n: number) => `Slot ${n} has a hero that doesn't exist.`,
      duplicate: (n: number) =>
        `Slot ${n} has a character already in the team: heroes and associates must be eight different characters.`,
      banned: (n: number) => `The hero in slot ${n} can't join this mode.`,
      attribute: (n: number) => `The hero in slot ${n} doesn't have an attribute allowed at this difficulty.`,
      set: "This artifact set doesn't apply in this mode.",
      phases: "The phase notes don't match the chosen difficulty.",
      "title-missing": "A guide needs a title.",
      "title-short": `The title must be at least ${STRATEGY_LIMITS.titleMin} characters long.`,
      "title-long": `The title can't be longer than ${STRATEGY_LIMITS.titleMax} characters.`,
      "title-only":
        "Titles are for guides: write something in the notes or the phases, or leave it empty and the team recommendation goes live right away.",
      "notes-long": `The notes can't be longer than ${STRATEGY_LIMITS.notesMax} characters.`,
      "phase-long": (n: number) => `The note for phase ${n} is longer than ${STRATEGY_LIMITS.phaseMax} characters.`,
    },
    soloModeratori: "Only a moderator decides guides.",
    nonLaTua: "Another moderator decides your own guides.",
    giaDecisa: "Another moderator already decided it.",
    serveMotivo: "Write the reason for the rejection: the author will read it.",
    motivoLungo: "The reason is too long.",
  },
});

/** Il messaggio e il campo di un problema della bozza. */
function explain(problem: StrategyProblem, locale: Locale): StrategyActionState {
  const p = TESTI[locale].problemi;
  switch (problem.code) {
    case "mode":
    case "target":
    case "level":
      return { error: p[problem.code], field: problem.code };
    case "team-size":
      return { error: p["team-size"], field: "team" };
    case "hero":
    case "duplicate":
    case "banned":
    case "attribute":
      return { error: p[problem.code](problem.slot + 1), field: "team", slot: problem.slot };
    case "set":
      return { error: p.set, field: "set" };
    case "phases":
      return { error: p.phases, field: "phases" };
    case "phase-long":
      return { error: p["phase-long"](problem.phase + 1), field: "phases", phase: problem.phase };
    case "notes-long":
      return { error: p["notes-long"], field: "notes" };
    case "title-missing":
    case "title-short":
    case "title-long":
    case "title-only":
      return { error: p[problem.code], field: "title" };
  }
}

/** Le pagine in cui la strategia compare: il feed, la pagina della modalita' (e del boss). */
function revalidateStrategy(game: string, selection: StrategySelection, postId: string) {
  revalidatePath(`/${game}/discussioni`);
  revalidatePath(`/${game}/post/${postId}`);
  const base = `/${game}/${MODE_SLUGS[selection.mode]}`;
  revalidatePath(base);
  if (selection.target) revalidatePath(`${base}/${selection.target}`);
}

const sameText = (a: Pick<StrategyDraft, "title" | "notes" | "phases">, b: Pick<StrategyDraft, "title" | "notes" | "phases">) =>
  a.title === b.title &&
  a.notes === b.notes &&
  a.phases.length === b.phases.length &&
  a.phases.every((phase, i) => phase === b.phases[i]);

/**
 * Salva una strategia: nuova, o la modifica di una dell'autore (`postId`).
 *
 * FormData: `game` (lo slug), `strategy` (StrategyDraft in JSON), `postId`
 * facoltativo. Se va bene porta alla pagina del post; se no torna l'errore,
 * gia' nella lingua di chi scrive.
 */
export async function saveStrategyAction(
  _previous: StrategyActionState,
  formData: FormData,
): Promise<StrategyActionState> {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!(await databaseReachable())) return { error: t.serveDatabase };
  const viewer = await currentViewer();
  if (!viewer) return { error: t.entra };

  const game = formData.get("game");
  const gameModule = typeof game === "string" ? getGameModule(game) : undefined;
  if (!gameModule || typeof game !== "string") return { error: t.datiNonValidi };

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("strategy") ?? ""));
  } catch {
    return { error: t.datiNonValidi };
  }
  const checked = checkStrategy(raw, gameModule);
  if (!checked.draft) return explain(checked.problem, locale);
  const draft = checked.draft;

  const limit = rateLimit("post", viewer.id);
  if (!limit.allowed) return { error: retryMessage(limit, locale) };
  const suspension = await suspensionFor(viewer.id);
  if (suspension.active) return { error: suspensionMessage(suspension, locale) };

  const kind = strategyKind(draft);
  const input = {
    game,
    draft,
    // il titolo automatico si salva nella lingua di chi scrive: e' quello che
    // leggono le pagine che non sanno delle strategie (profilo, ricerca); le altre
    // lo rifanno nella lingua di chi legge
    title: kind === "team" ? autoTitle(gameModule, draft, locale) : draft.title,
    autoTitle: kind === "team",
    authorId: viewer.id,
  };

  const rawPostId = formData.get("postId");
  let postId: string;
  let status: StrategyStatus;

  if (typeof rawPostId === "string" && rawPostId.length > 0) {
    const owner = await strategyOwner(rawPostId);
    if (!owner || owner.authorId !== viewer.id) return { error: t.nonTua };
    const before = await getStrategy(rawPostId);
    // il gioco del modulo deve essere quello della strategia: se no la si
    // controllerebbe coi dati di un altro gioco (segnalato dalla sessione sulla sicurezza)
    if (!before || before.game !== game) return { error: t.datiNonValidi };
    status =
      kind === "team"
        ? "PUBLISHED"
        : owner.status === "PUBLISHED" && sameText(before, draft)
          ? "PUBLISHED"
          : "IN_REVIEW";
    await updateStrategy(rawPostId, input, status);
    postId = rawPostId;
    revalidateStrategy(game, before, postId);
  } else {
    status = kind === "team" ? "PUBLISHED" : "IN_REVIEW";
    postId = await createStrategy(input, status);
  }

  revalidateStrategy(game, draft, postId);

  if (status === "IN_REVIEW") {
    after(async () => {
      await notifyModerators({
        title: "Nuova guida dell'Endgame da rivedere",
        path: "/moderazione#guide",
        fields: [
          { name: "Autore", value: viewer.username },
          { name: "Dove", value: selectionLabel(gameModule, draft, "it") },
          { name: "Titolo", value: draft.title },
        ],
      });
    });
  }

  redirect(`/${game}/post/${postId}`);
}

export interface ReviewResult {
  error?: string;
  ok?: boolean;
}

/** Un moderatore pubblica o respinge una guida in revisione. Il motivo serve al rifiuto. */
export async function reviewStrategyAction(input: {
  postId: string;
  decision: "approve" | "reject";
  note: string;
}): Promise<ReviewResult> {
  const locale = await getLocale();
  const t = TESTI[locale];
  if (!(await databaseReachable())) return { error: t.serveDatabase };

  const viewer = await currentViewer();
  if (!viewer || !can(viewer.role, "moderate")) return { error: t.soloModeratori };
  const suspension = await suspensionFor(viewer.id);
  if (suspension.active) return { error: suspensionMessage(suspension, locale) };

  if (typeof input?.postId !== "string" || (input.decision !== "approve" && input.decision !== "reject")) {
    return { error: t.datiNonValidi };
  }
  const note = typeof input.note === "string" ? input.note.trim() : "";
  if (input.decision === "reject" && note.length < 5) return { error: t.serveMotivo };
  if (note.length > 600) return { error: t.motivoLungo };

  const owner = await strategyOwner(input.postId);
  if (!owner) return { error: t.datiNonValidi };
  if (owner.authorId === viewer.id) return { error: t.nonLaTua };

  const done = await decideStrategy({
    postId: input.postId,
    moderatorId: viewer.id,
    approve: input.decision === "approve",
    note: note || null,
  });
  if (!done) return { error: t.giaDecisa };

  const record = await getStrategy(input.postId);
  if (record) revalidateStrategy(record.game, record, input.postId);
  revalidatePath("/moderazione");
  return { ok: true };
}
