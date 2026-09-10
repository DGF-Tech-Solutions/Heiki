"use client";

import { useActionState, useState, useTransition } from "react";
import {
  setRoleAction,
  toggleSponsorAction,
  type AdminState,
  type AdminUser,
} from "@/lib/admin/actions";
import { ROLE_LABELS, ROLES } from "@/lib/auth/permissions";
import { Button, Notice, Select } from "@/components/ui";

const INITIAL: AdminState = {};

/**
 * Assegnazione di un ruolo.
 *
 * Un modulo per riga invece di un modulo unico con un elenco a tendina di
 * utenti: cosi' il ruolo si cambia guardando la persona, non scegliendola da
 * una lista dove due nomi simili si confondono.
 *
 * Il ruolo non si applica al cambio della tendina ma con un pulsante: un salvataggio
 * automatico su un permesso e' il modo piu' facile per promuovere qualcuno per errore.
 */
export function RoleForm({ user, self }: { user: AdminUser; self: boolean }) {
  const [state, action, pending] = useActionState(setRoleAction, INITIAL);
  const [role, setRole] = useState(user.role);

  const locked = self || user.role === "ADMIN";

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={user.id} />

      <Select
        name="role"
        value={role}
        onChange={(event) => setRole(event.target.value as AdminUser["role"])}
        disabled={locked || pending}
        className="h-8 w-auto text-[13px]"
      >
        {ROLES.map((option) => (
          <option key={option} value={option}>
            {ROLE_LABELS[option]}
          </option>
        ))}
      </Select>

      <Button type="submit" size="sm" disabled={locked || pending || role === user.role}>
        {pending ? "…" : "Applica"}
      </Button>

      {locked ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
          {self ? "sei tu" : "amministratore"}
        </span>
      ) : null}

      {state.error ? <span className="text-[11px] text-hot">{state.error}</span> : null}
      {state.success ? <span className="text-[11px] text-ink-3">{state.success}</span> : null}
    </form>
  );
}

export function SponsorToggle({ id, active }: { id: string; active: boolean }) {
  const [isActive, setIsActive] = useState(active);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <>
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await toggleSponsorAction(id, !isActive);
            if (result.error) setError(result.error);
            else setIsActive(!isActive);
          })
        }
      >
        {pending ? "…" : isActive ? "Metti in pausa" : "Riattiva"}
      </Button>
      {error ? <span className="ml-2 text-[11px] text-hot">{error}</span> : null}
    </>
  );
}

/** Ricerca: un modulo GET, cosi' il risultato e' un indirizzo condivisibile. */
export function UserSearch({ initial }: { initial: string }) {
  return (
    <form className="mb-5 flex flex-wrap gap-2.5">
      <input
        name="q"
        defaultValue={initial}
        placeholder="Nome utente o email"
        aria-label="Cerca un utente"
        className="h-9 w-full max-w-[320px] rounded-card border border-rule bg-paper px-3 text-sm focus:border-brand focus:outline-none"
      />
      <Button type="submit" size="sm">
        Cerca
      </Button>
    </form>
  );
}

export function Message({ state }: { state: AdminState }) {
  if (state.error) return <Notice tone="error">{state.error}</Notice>;
  if (state.success) return <Notice>{state.success}</Notice>;
  return null;
}
