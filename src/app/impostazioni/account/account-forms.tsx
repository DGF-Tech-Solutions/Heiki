"use client";

/**
 * Moduli dell'account.
 *
 * Ogni operazione chiede la password attuale, anche a sessione aperta: chi si
 * siede al computer di qualcun altro non deve poter cambiare l'email e
 * prendersi l'account.
 *
 * L'eliminazione ha il bordo rosso e chiede di scrivere una parola. Non e'
 * burocrazia: e' l'unico modo per distinguere una decisione da un clic sbagliato
 * su un'azione irreversibile.
 */

import { useActionState } from "react";
import {
  changeEmailAction,
  changePasswordAction,
  deleteAccountAction,
  type AccountState,
} from "@/lib/auth/account-actions";
import { DELETE_PHRASE } from "@/lib/auth/account";
import { Button, cx, display, Field, Input, Notice } from "@/components/ui";

const INITIAL: AccountState = {};

function Panel({
  title,
  hint,
  danger = false,
  children,
}: {
  title: string;
  hint: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cx("rounded-card border bg-paper p-5", danger ? "border-hot" : "border-rule")}>
      <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>{title}</h2>
      <p className="mt-1 mb-4 text-xs text-ink-3">{hint}</p>
      {children}
    </section>
  );
}

function Feedback({ state }: { state: AccountState }) {
  if (state.error) {
    return (
      <Notice tone="error" className="mb-4">
        {state.error}
      </Notice>
    );
  }
  if (state.success) return <Notice className="mb-4">{state.success}</Notice>;
  return null;
}

export function ChangeEmailForm({ current }: { current: string }) {
  const [state, action, pending] = useActionState(changeEmailAction, INITIAL);

  return (
    <Panel
      title="Indirizzo email"
      hint="Serve per entrare e per recuperare la password. Cambiarlo richiede la password attuale."
    >
      <form action={action} noValidate>
        <Feedback state={state} />

        <Field label="Nuovo indirizzo" hint={`attuale: ${current}`}>
          <Input type="email" name="email" autoComplete="email" required defaultValue={current} />
        </Field>

        <Field label="Password attuale">
          <Input type="password" name="password" autoComplete="current-password" required />
        </Field>

        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Aggiorno…" : "Cambia indirizzo"}
        </Button>
      </form>
    </Panel>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, INITIAL);

  return (
    <Panel
      title="Password"
      hint="Cambiandola chiudiamo tutte le altre sessioni aperte: se sospetti un accesso altrui, è quello che serve."
    >
      <form action={action} noValidate>
        <Feedback state={state} />

        <Field label="Password attuale">
          <Input type="password" name="current" autoComplete="current-password" required />
        </Field>

        <Field label="Nuova password" hint="almeno 10 caratteri">
          <Input type="password" name="next" autoComplete="new-password" required minLength={10} />
        </Field>

        <Field label="Ripetila">
          <Input type="password" name="repeat" autoComplete="new-password" required />
        </Field>

        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Aggiorno…" : "Cambia password"}
        </Button>
      </form>
    </Panel>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccountAction, INITIAL);

  return (
    <Panel
      title="Elimina l'account"
      hint="Irreversibile. Profilo, badge, voti e notifiche vengono cancellati."
      danger
    >
      <form action={action} noValidate>
        <Feedback state={state} />

        <p className="mb-4 text-[13px] text-ink-2">
          I tuoi post e commenti <strong>restano</strong>, senza più il collegamento al tuo nome:
          cancellarli spezzerebbe discussioni di altre persone, che non hanno chiesto di perderle.
        </p>

        <Field label="Password attuale">
          <Input type="password" name="password" autoComplete="current-password" required />
        </Field>

        <Field label="Conferma" hint={`scrivi ${DELETE_PHRASE}`}>
          <Input name="confirm" required placeholder={DELETE_PHRASE} className="font-mono" />
        </Field>

        <Button
          type="submit"
          disabled={pending}
          className="border-hot text-hot hover:bg-hot hover:text-white"
        >
          {pending ? "Elimino…" : "Elimina definitivamente"}
        </Button>
      </form>
    </Panel>
  );
}
