"use server";

/**
 * Amministrazione.
 *
 * Qui si assegnano i ruoli, si guardano gli slot sponsorizzati e si controlla
 * lo stato del sito. Tre regole che valgono per tutto il file:
 *
 * 1. Un amministratore non modifica il proprio ruolo. Non e' fiducia: e' che
 *    un declassamento per errore chiuderebbe l'unica porta di gestione.
 * 2. Un amministratore non modifica un altro amministratore. Con un solo
 *    livello massimo, chiunque potrebbe togliere di mezzo chi lo sorveglia; il
 *    cambio si fa dal database, dove serve un accesso di infrastruttura.
 * 3. Ogni promozione finisce nel registro di moderazione, come una sanzione.
 *    Dare a qualcuno il potere di pubblicare e' una decisione tracciabile
 *    quanto quella di sospenderlo.
 * 4. Il ruolo di amministratore non si da' da qui, solo con `npm run promote`
 *    (11/10): una sessione rubata non deve poter creare altri amministratori.
 *
 * Le regole sui ruoli stanno in roles.ts, fuori da questo modulo "use server":
 * qui ogni export e' un'azione che il browser puo' chiamare con gli argomenti
 * che vuole, e ognuna ricontrolla da sola chi la chiede e cosa riceve.
 */

import { revalidatePath } from "next/cache";
import { desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { hasRole, isRole, roleLabel, ROLES, type Role } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { modActions, sponsorPlacements, users } from "@/lib/db/schema";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { suspensionFor } from "@/lib/moderation/suspension";
import { canAssignRole } from "./roles";

const TESTI = testi({
  it: {
    nonHaiPermessi: "Non hai i permessi per farlo.",
    identificativoNonValido: "Identificativo non valido",
    ruoloInesistente: "Ruolo inesistente",
    datiNonValidi: "Dati non validi.",
    nonCambiareIlTuoRuolo: "Non puoi cambiare il tuo ruolo da qui.",
    utenteInesistente: "Utente inesistente.",
    ruoloAmministratoreDalDatabase: "Il ruolo di un amministratore si cambia dal database.",
    nonDareAmministratore:
      "Il ruolo di amministratore non si assegna dal sito: si dà dal server con «npm run promote».",
    haGiaQuestoRuolo: (utente: string) => `${utente} ha già questo ruolo.`,
    oraE: (utente: string, ruolo: string) => `${utente}: ora è ${ruolo}.`,
    slotRiattivato: "Slot riattivato.",
    slotInPausa: "Slot messo in pausa.",
    slotInesistente: "Slot inesistente.",
  },
  en: {
    nonHaiPermessi: "You don't have permission to do that.",
    identificativoNonValido: "Invalid ID",
    ruoloInesistente: "Unknown role",
    datiNonValidi: "Invalid data.",
    nonCambiareIlTuoRuolo: "You can't change your own role from here.",
    utenteInesistente: "User not found.",
    ruoloAmministratoreDalDatabase: "An administrator's role can only be changed in the database.",
    nonDareAmministratore:
      "The administrator role can't be granted from the site: it's granted on the server with “npm run promote”.",
    haGiaQuestoRuolo: (utente: string) => `${utente} already has this role.`,
    oraE: (utente: string, ruolo: string) => `${utente} is now ${ruolo}.`,
    slotRiattivato: "Slot reactivated.",
    slotInPausa: "Slot paused.",
    slotInesistente: "Slot not found.",
  },
});

export interface AdminState {
  error?: string;
  success?: string;
}

async function administrator(): Promise<{ id: string; role: Role } | null> {
  if (!(await databaseReachable())) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!hasRole(session.user.role, "ADMIN")) return null;
  // come per i moderatori: un account sospeso non amministra, qualunque ruolo abbia
  if ((await suspensionFor(session.user.id)).active) return null;
  return { id: session.user.id, role: session.user.role };
}

// Lo schema nasce dentro l'azione, per avere i messaggi nella lingua di chi scrive.
function roleSchema(t: (typeof TESTI)["it"]) {
  return z.object({
    userId: z.string().uuid(t.identificativoNonValido),
    role: z.string().refine(isRole, t.ruoloInesistente),
  });
}

export async function setRoleAction(
  _previous: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const locale = await getLocale();
  const t = TESTI[locale];
  const admin = await administrator();
  if (!admin) return { error: t.nonHaiPermessi };

  const parsed = roleSchema(t).safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? t.datiNonValidi };
  }

  const role = parsed.data.role as Role;
  if (parsed.data.userId === admin.id) {
    return { error: t.nonCambiareIlTuoRuolo };
  }

  const target = await db.query.users.findFirst({
    where: eq(users.id, parsed.data.userId),
    columns: { id: true, username: true, role: true },
  });
  if (!target) return { error: t.utenteInesistente };

  // Le regole stanno in canAssignRole (roles.ts), dove le provano i test.
  const verdict = canAssignRole(admin, target, role);
  if (!verdict.ok) {
    const refusals = {
      nonAmministratore: t.nonHaiPermessi,
      seStesso: t.nonCambiareIlTuoRuolo,
      bersaglioAmministratore: t.ruoloAmministratoreDalDatabase,
      ruoloAmministratore: t.nonDareAmministratore,
    } as const;
    return { error: refusals[verdict.reason] };
  }
  if (role === target.role) {
    return { success: t.haGiaQuestoRuolo(target.username) };
  }

  await db.transaction(async (tx) => {
    await tx.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, target.id));
    // il cambio e la sua traccia insieme: un ruolo dato senza riga nel registro non deve esistere
    await tx.insert(modActions).values({
      moderatorId: admin.id,
      targetType: "USER",
      targetId: target.id,
      action: "set_role",
      reason: `${target.role}->${role}`,
    });
  });

  revalidatePath("/admin");
  return { success: t.oraE(target.username, roleLabel(role, locale)) };
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

/**
 * Ricerca utenti.
 *
 * Senza termine di ricerca mostra gli ultimi iscritti invece di tutti: un
 * elenco completo su un sito cresciuto non e' consultabile, e la ricerca e' il
 * modo in cui si trova davvero una persona.
 */
export async function findUsers(query: string): Promise<AdminUser[]> {
  const admin = await administrator();
  if (!admin) return [];

  // e' un'azione: il termine puo' arrivare come qualunque cosa (anche `?q=a&q=b`
  // dalla pagina diventa un elenco), e un .trim() su un elenco era un errore 500
  const term = typeof query === "string" ? query.trim().slice(0, 100) : "";

  const rows = await db.query.users.findMany({
    where: term.length > 0 ? or(ilike(users.username, `%${term}%`), ilike(users.email, `%${term}%`)) : undefined,
    orderBy: [desc(users.createdAt)],
    limit: 40,
    columns: { id: true, username: true, email: true, role: true, createdAt: true },
  });

  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
  }));
}

export interface RoleCount {
  role: Role;
  count: number;
}

export async function roleCounts(): Promise<RoleCount[]> {
  const admin = await administrator();
  if (!admin) return [];

  const rows = await db.query.users.findMany({ columns: { role: true } });
  const tally = new Map<Role, number>(ROLES.map((role) => [role, 0]));
  for (const row of rows) tally.set(row.role, (tally.get(row.role) ?? 0) + 1);

  return ROLES.map((role) => ({ role, count: tally.get(role) ?? 0 }));
}

export interface SponsorRow {
  id: string;
  advertiser: string;
  title: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  /** true se oggi cade nella finestra: e' quello che conta, non il flag */
  live: boolean;
}

export async function listSponsorPlacements(): Promise<SponsorRow[]> {
  const admin = await administrator();
  if (!admin) return [];

  const now = new Date();
  const rows = await db.query.sponsorPlacements.findMany({
    orderBy: [desc(sponsorPlacements.startsAt)],
    limit: 50,
  });

  return rows.map((row) => ({
    id: row.id,
    advertiser: row.advertiser,
    title: row.title,
    active: row.active,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    live: row.active && row.startsAt <= now && row.endsAt >= now,
  }));
}

const SPONSOR_INPUT = z.object({ id: z.string().uuid(), active: z.boolean() });

export async function toggleSponsorAction(id: string, active: boolean): Promise<AdminState> {
  const t = TESTI[await getLocale()];
  const admin = await administrator();
  if (!admin) return { error: t.nonHaiPermessi };

  // un id inventato si respinge qui, non con un errore del database
  const parsed = SPONSOR_INPUT.safeParse({ id, active });
  if (!parsed.success) return { error: t.datiNonValidi };
  const input = parsed.data;

  const changed = await db.transaction(async (tx) => {
    const [row] = await tx
      .update(sponsorPlacements)
      .set({ active: input.active })
      .where(eq(sponsorPlacements.id, input.id))
      .returning({ id: sponsorPlacements.id });
    if (!row) return false;
    await tx.insert(modActions).values({
      moderatorId: admin.id,
      targetType: "SPONSOR",
      targetId: row.id,
      action: input.active ? "sponsor_on" : "sponsor_off",
    });
    return true;
  });
  if (!changed) return { error: t.slotInesistente };

  revalidatePath("/admin");
  revalidatePath("/", "layout");
  return { success: input.active ? t.slotRiattivato : t.slotInPausa };
}
