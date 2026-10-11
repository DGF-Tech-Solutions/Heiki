/**
 * Chi puo' dare quale ruolo a chi, dal pannello /admin.
 *
 * Modulo puro, fuori da actions.ts: quello e' un modulo "use server", dove ogni
 * export diventa un indirizzo richiamabile dal browser, e una regola non deve
 * esserlo. Qui la leggono l'azione, il modulo del pannello e i test.
 *
 * Il ruolo di amministratore non si assegna dal sito (11/10): si da' dalla riga
 * di comando con `npm run promote`, dove serve l'accesso alla macchina. Cosi'
 * una sessione di amministratore rubata non puo' creare altri amministratori,
 * che resterebbero anche dopo aver chiuso la falla.
 */

import { can, ROLES, type Role } from "@/lib/auth/permissions";

export interface RoleParty {
  readonly id: string;
  readonly role: Role;
}

export type AssignRefusal = "nonAmministratore" | "seStesso" | "bersaglioAmministratore" | "ruoloAmministratore";

export type AssignVerdict = { readonly ok: true } | { readonly ok: false; readonly reason: AssignRefusal };

/** I ruoli che il pannello puo' dare: tutti tranne quello di amministratore. */
export const ASSIGNABLE_ROLES: readonly Role[] = ROLES.filter((role) => role !== "ADMIN");

/**
 * Le regole, in ordine:
 * 1. decide solo un amministratore;
 * 2. non sul proprio ruolo: un declassamento per errore chiuderebbe l'unica porta;
 * 3. non su un altro amministratore: con un solo livello massimo chiunque
 *    potrebbe togliere di mezzo chi lo sorveglia;
 * 4. non verso amministratore: vedi sopra, `npm run promote`.
 */
export function canAssignRole(actor: RoleParty, target: RoleParty, role: Role): AssignVerdict {
  if (!can(actor.role, "administer")) return { ok: false, reason: "nonAmministratore" };
  if (target.id === actor.id) return { ok: false, reason: "seStesso" };
  if (target.role === "ADMIN") return { ok: false, reason: "bersaglioAmministratore" };
  if (!ASSIGNABLE_ROLES.includes(role)) return { ok: false, reason: "ruoloAmministratore" };
  return { ok: true };
}
