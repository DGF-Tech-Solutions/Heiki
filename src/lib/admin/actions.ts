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
 */

import { revalidatePath } from "next/cache";
import { desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { hasRole, isRole, ROLES, type Role } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { modActions, sponsorPlacements, users } from "@/lib/db/schema";

export interface AdminState {
  error?: string;
  success?: string;
}

async function administrator(): Promise<{ id: string; role: Role } | null> {
  if (!(await databaseReachable())) return null;
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!hasRole(session.user.role, "ADMIN")) return null;
  return { id: session.user.id, role: session.user.role };
}

const roleSchema = z.object({
  userId: z.string().uuid("Identificativo non valido"),
  role: z.string().refine(isRole, "Ruolo inesistente"),
});

export async function setRoleAction(
  _previous: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const admin = await administrator();
  if (!admin) return { error: "Non hai i permessi per farlo." };

  const parsed = roleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  if (parsed.data.userId === admin.id) {
    return { error: "Non puoi cambiare il tuo ruolo da qui." };
  }

  const target = await db.query.users.findFirst({
    where: eq(users.id, parsed.data.userId),
    columns: { id: true, username: true, role: true },
  });
  if (!target) return { error: "Utente inesistente." };

  if (target.role === "ADMIN") {
    return { error: "Il ruolo di un amministratore si cambia dal database." };
  }
  if (parsed.data.role === target.role) {
    return { success: `${target.username} ha già questo ruolo.` };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ role: parsed.data.role as Role, updatedAt: new Date() })
      .where(eq(users.id, target.id));

    // targetType e' l'enum dei voti e non prevede "USER": si registra come
    // POST con l'identificativo dell'utente. Non e' elegante, ma la traccia
    // esiste - ed e' meglio di un cambio di ruolo invisibile. Da sistemare con
    // un enum dedicato alla prossima migrazione dello schema.
    await tx.insert(modActions).values({
      moderatorId: admin.id,
      targetType: "POST",
      targetId: target.id,
      action: `role:${parsed.data.role}`,
      reason: `da ${target.role} a ${parsed.data.role}`,
    });
  });

  revalidatePath("/admin");
  return { success: `${target.username}: ora è ${parsed.data.role}.` };
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

  const term = query.trim();

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

export async function toggleSponsorAction(id: string, active: boolean): Promise<AdminState> {
  const admin = await administrator();
  if (!admin) return { error: "Non hai i permessi per farlo." };

  await db.update(sponsorPlacements).set({ active }).where(eq(sponsorPlacements.id, id));

  revalidatePath("/admin");
  revalidatePath("/", "layout");
  return { success: active ? "Slot riattivato." : "Slot messo in pausa." };
}
