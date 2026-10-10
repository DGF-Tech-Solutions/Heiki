"use client";

import { useActionState, useState, useTransition } from "react";
import {
  setRoleAction,
  toggleSponsorAction,
  type AdminState,
  type AdminUser,
} from "@/lib/admin/actions";
import { roleLabel, ROLES } from "@/lib/auth/permissions";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { Button, Notice, Select } from "@/components/ui";

const TESTI = testi({
  it: {
    applica: "Applica",
    seiTu: "sei tu",
    amministratore: "amministratore",
    mettiInPausa: "Metti in pausa",
    riattiva: "Riattiva",
    nomeOEmail: "Nome utente o email",
    cercaUnUtente: "Cerca un utente",
    cerca: "Cerca",
  },
  en: {
    applica: "Apply",
    seiTu: "you",
    amministratore: "administrator",
    mettiInPausa: "Pause",
    riattiva: "Reactivate",
    nomeOEmail: "Username or email",
    cercaUnUtente: "Search for a user",
    cerca: "Search",
  },
});

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
  const locale = useLocale();
  const t = TESTI[locale];
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
            {roleLabel(option, locale)}
          </option>
        ))}
      </Select>

      <Button type="submit" size="sm" disabled={locked || pending || role === user.role}>
        {pending ? "…" : t.applica}
      </Button>

      {locked ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
          {self ? t.seiTu : t.amministratore}
        </span>
      ) : null}

      {state.error ? <span className="text-[12px] text-hot">{state.error}</span> : null}
      {state.success ? <span className="text-[12px] text-ink-3">{state.success}</span> : null}
    </form>
  );
}

export function SponsorToggle({ id, active }: { id: string; active: boolean }) {
  const t = TESTI[useLocale()];
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
        {pending ? "…" : isActive ? t.mettiInPausa : t.riattiva}
      </Button>
      {error ? <span className="ml-2 text-[12px] text-hot">{error}</span> : null}
    </>
  );
}

/** Ricerca: un modulo GET, cosi' il risultato e' un indirizzo condivisibile. */
export function UserSearch({ initial }: { initial: string }) {
  const t = TESTI[useLocale()];

  return (
    <form className="mb-5 flex flex-wrap gap-2.5">
      <input
        name="q"
        defaultValue={initial}
        placeholder={t.nomeOEmail}
        aria-label={t.cercaUnUtente}
        className="h-9 w-full max-w-[320px] rounded-card border border-rule bg-paper px-3 text-sm focus:border-brand focus:outline-none"
      />
      <Button type="submit" size="sm">
        {t.cerca}
      </Button>
    </form>
  );
}

export function Message({ state }: { state: AdminState }) {
  if (state.error) return <Notice tone="error">{state.error}</Notice>;
  if (state.success) return <Notice>{state.success}</Notice>;
  return null;
}
