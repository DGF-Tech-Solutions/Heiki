/**
 * Stato di sospensione di un account.
 *
 * Vive in un file a parte e non fra le azioni di moderazione perche' lo legge
 * chi scrive un post o un commento: se stesse in un modulo "use server" ogni
 * export dovrebbe essere un'azione raggiungibile dal client, e questa e' una
 * funzione interna. Per lo stesso motivo stanno qui le regole pure su chi puo'
 * sospendere e revocare (canSuspend, canLiftSuspension): le provano i test.
 *
 * Una sospensione non cancella nulla e non nasconde il profilo: toglie soltanto
 * la possibilita' di scrivere. Chi e' sospeso continua a leggere il sito - il
 * contrario sarebbe una punizione sproporzionata e spingerebbe solo a crearsi un
 * secondo account.
 */

import { and, desc, gt, isNull, or, eq } from "drizzle-orm";
import { can, type Role } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { suspensions } from "@/lib/db/schema";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    finoAl: (data: string) => `fino al ${data}`,
    aTempoIndeterminato: "a tempo indeterminato",
    motivo: (motivo: string) => ` Motivo: ${motivo}`,
    sospeso: (quando: string, motivo: string) =>
      `Il tuo account è sospeso ${quando} e non può pubblicare.${motivo}`,
  },
  en: {
    finoAl: (data: string) => `until ${data}`,
    aTempoIndeterminato: "indefinitely",
    motivo: (motivo: string) => ` Reason: ${motivo}`,
    sospeso: (quando: string, motivo: string) =>
      `Your account is suspended ${quando} and can't post.${motivo}`,
  },
});

export interface SuspensionState {
  active: boolean;
  reason?: string;
  /** null quando e' a tempo indeterminato */
  until?: Date | null;
}

/**
 * Una sospensione e' attiva se non e' stata revocata e non e' scaduta.
 * La scadenza si valuta qui e non con un lavoro periodico: senza processi
 * pianificati una sospensione a termine si spegnerebbe solo se qualcuno passasse
 * a spegnerla.
 */
export async function suspensionFor(userId: string): Promise<SuspensionState> {
  const row = await db.query.suspensions.findFirst({
    where: and(
      eq(suspensions.userId, userId),
      isNull(suspensions.liftedAt),
      or(isNull(suspensions.until), gt(suspensions.until, new Date())),
    ),
    orderBy: [desc(suspensions.createdAt)],
    columns: { reason: true, until: true },
  });

  if (!row) return { active: false };
  return { active: true, reason: row.reason, until: row.until };
}

/**
 * Messaggio da mostrare a chi prova a scrivere mentre e' sospeso.
 * Chi lo chiama da un'azione passa la lingua di `getLocale()`.
 */
export function suspensionMessage(state: SuspensionState, locale: Locale = "it"): string {
  const t = TESTI[locale];
  const when = state.until
    ? t.finoAl(state.until.toLocaleDateString(intlLocale(locale)))
    : t.aTempoIndeterminato;
  const reason = state.reason ? t.motivo(state.reason) : "";
  return t.sospeso(when, reason);
}

/**
 * Il controllo comune di ogni azione che scrive: null se l'account puo' agire,
 * altrimenti il messaggio da restituire a chi l'ha chiesta.
 *
 * Fino all'11/10 ogni azione se lo ricordava da sola, e segnalazioni, profilo e
 * account di gioco se l'erano dimenticato: un account sospeso poteva riempire la
 * coda dei moderatori, rinominarsi o mandare schermate da verificare. Un'azione
 * e' raggiungibile dal browser anche senza la pagina, quindi il controllo sta
 * nell'azione.
 */
export async function requireActive(userId: string, locale: Locale = "it"): Promise<string | null> {
  const state = await suspensionFor(userId);
  return state.active ? suspensionMessage(state, locale) : null;
}

/* ------------------------------------------------- chi puo' cosa su chi -- */

/** Una delle due parti di una decisione: chi agisce o chi la subisce. */
export interface Party {
  readonly id: string;
  readonly role: Role;
}

export type Verdict<Reason extends string> = { readonly ok: true } | { readonly ok: false; readonly reason: Reason };

export type SuspendRefusal = "nonModeratore" | "amministratore" | "seStesso" | "moderatore";

/**
 * Chi puo' sospendere chi. Un amministratore non si sospende dal sito: chi ha il
 * ruolo minore potrebbe disattivare chi lo sorveglia. Nessuno sospende se stesso.
 * Fra moderatori decide un amministratore, se no due moderatori in lite si
 * sospendono a vicenda.
 */
export function canSuspend(actor: Party, target: Party): Verdict<SuspendRefusal> {
  if (!can(actor.role, "moderate")) return { ok: false, reason: "nonModeratore" };
  if (target.role === "ADMIN") return { ok: false, reason: "amministratore" };
  if (target.id === actor.id) return { ok: false, reason: "seStesso" };
  if (target.role === "MODERATOR" && actor.role !== "ADMIN") return { ok: false, reason: "moderatore" };
  return { ok: true };
}

export type LiftRefusal = "nonModeratore" | "propria" | "serveAmministratore";

/**
 * Chi puo' revocare una sospensione.
 *
 * Fino all'11/10 bastava essere moderatore e non revocare la propria: un
 * moderatore poteva cancellare la sospensione data da un amministratore, o
 * liberare un collega. Ora la revoca sale di un gradino quando tocca lo staff:
 * serve un amministratore se il sospeso e' moderatore o amministratore, o se la
 * sospensione l'ha data un amministratore. Nessuno revoca la propria, nemmeno un
 * amministratore.
 *
 * `issuerRole` e' il ruolo di oggi di chi l'ha data: quello del momento della
 * sospensione non e' scritto da nessuna parte.
 */
export function canLiftSuspension(input: {
  readonly actor: Party;
  readonly suspended: Party;
  readonly issuerRole: Role;
}): Verdict<LiftRefusal> {
  const { actor, suspended, issuerRole } = input;
  if (!can(actor.role, "moderate")) return { ok: false, reason: "nonModeratore" };
  if (suspended.id === actor.id) return { ok: false, reason: "propria" };
  const staff = suspended.role === "MODERATOR" || suspended.role === "ADMIN";
  if ((staff || issuerRole === "ADMIN") && actor.role !== "ADMIN") {
    return { ok: false, reason: "serveAmministratore" };
  }
  return { ok: true };
}
