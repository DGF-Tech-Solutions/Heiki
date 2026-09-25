/**
 * Ruoli e permessi.
 *
 * I ruoli sono una scala: chi puo' moderare puo' anche pubblicare, chi puo'
 * pubblicare puo' anche proporre. Un solo confronto numerico invece di una
 * matrice di casi.
 *
 * Il premium NON e' qui: e' un'entitlement commerciale (tabella subscriptions),
 * non un permesso redazionale. Tenerli separati significa che cambiare il piano
 * di abbonamento non tocca mai chi puo' moderare.
 */

import type { Bilingual, Locale } from "@/lib/i18n/locale";

export const ROLES = ["USER", "CONTRIBUTOR", "EDITOR", "MODERATOR", "ADMIN"] as const;

export type Role = (typeof ROLES)[number];

const RANK: Readonly<Record<Role, number>> = {
  USER: 0,
  CONTRIBUTOR: 1,
  EDITOR: 2,
  MODERATOR: 3,
  ADMIN: 4,
};

const ROLE_NAMES: Readonly<Record<Role, Bilingual>> = {
  USER: { it: "Utente", en: "User" },
  CONTRIBUTOR: { it: "Collaboratore", en: "Contributor" },
  EDITOR: { it: "Redattore", en: "Editor" },
  MODERATOR: { it: "Moderatore", en: "Moderator" },
  ADMIN: { it: "Amministratore", en: "Administrator" },
};

/** Il nome di un ruolo nella lingua del sito. */
export function roleLabel(role: Role, locale: Locale): string {
  return ROLE_NAMES[role]?.[locale] ?? ROLE_NAMES.USER[locale];
}

/** I nomi in italiano. Per chi non passa ancora la lingua: usa roleLabel. */
export const ROLE_LABELS: Readonly<Record<Role, string>> = Object.fromEntries(
  ROLES.map((role) => [role, ROLE_NAMES[role].it]),
) as Record<Role, string>;

/** Cosa si puo' fare, e da quale ruolo in su. */
export const PERMISSIONS = {
  /** salvare build e team, votare, commentare */
  saveOwnContent: "USER",
  /** proporre guide e rotazioni, che vanno in revisione */
  submitGuide: "CONTRIBUTOR",
  /** pubblicare, revisionare, assegnare il tag di patch verificata */
  publishGuide: "EDITOR",
  /** gestire segnalazioni, nascondere contenuti, sospendere utenti */
  moderate: "MODERATOR",
  /** dataset, ruoli, sponsor, configurazione */
  administer: "ADMIN",
} as const satisfies Record<string, Role>;

export type Permission = keyof typeof PERMISSIONS;

export function hasRole(role: Role | undefined, minimum: Role): boolean {
  if (role === undefined) return false;
  return RANK[role] >= RANK[minimum];
}

export function can(role: Role | undefined, permission: Permission): boolean {
  return hasRole(role, PERMISSIONS[permission]);
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
