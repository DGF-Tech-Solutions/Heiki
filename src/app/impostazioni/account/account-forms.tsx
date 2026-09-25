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
import { deletePhrase } from "@/lib/auth/account";
import { Button, cx, display, Field, Input, Notice } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    indirizzoEmail: "Indirizzo email",
    indirizzoEmailNota:
      "Serve per entrare e per recuperare la password. Cambiarlo richiede la password attuale.",
    nuovoIndirizzo: "Nuovo indirizzo",
    attuale: (indirizzo: string) => `attuale: ${indirizzo}`,
    passwordAttuale: "Password attuale",
    aggiorno: "Aggiorno…",
    cambiaIndirizzo: "Cambia indirizzo",
    password: "Password",
    passwordNota:
      "Cambiandola chiudiamo tutte le altre sessioni aperte: se sospetti un accesso altrui, è quello che serve.",
    nuovaPassword: "Nuova password",
    almenoDieci: "almeno 10 caratteri",
    ripetila: "Ripetila",
    cambiaPassword: "Cambia password",
    eliminaAccount: "Elimina l'account",
    eliminaNota: "Irreversibile. Profilo, badge, voti e notifiche vengono cancellati.",
    postPrima: "I tuoi post e commenti",
    restano: "restano",
    postDopo:
      ", senza più il collegamento al tuo nome: cancellarli spezzerebbe discussioni di altre persone, che non hanno chiesto di perderle.",
    conferma: "Conferma",
    scrivi: (parola: string) => `scrivi ${parola}`,
    elimino: "Elimino…",
    eliminaDefinitivamente: "Elimina definitivamente",
  },
  en: {
    indirizzoEmail: "Email address",
    indirizzoEmailNota:
      "Used to log in and to recover your password. Changing it requires your current password.",
    nuovoIndirizzo: "New address",
    attuale: (indirizzo: string) => `current: ${indirizzo}`,
    passwordAttuale: "Current password",
    aggiorno: "Updating…",
    cambiaIndirizzo: "Change address",
    password: "Password",
    passwordNota:
      "Changing it closes all your other open sessions: if you suspect someone else has access, that's exactly what you need.",
    nuovaPassword: "New password",
    almenoDieci: "at least 10 characters",
    ripetila: "Repeat it",
    cambiaPassword: "Change password",
    eliminaAccount: "Delete account",
    eliminaNota: "Irreversible. Your profile, badges, votes and notifications are deleted.",
    postPrima: "Your posts and comments",
    restano: "stay",
    postDopo:
      ", no longer linked to your name: deleting them would break other people's discussions, and they didn't ask to lose them.",
    conferma: "Confirm",
    scrivi: (parola: string) => `type ${parola}`,
    elimino: "Deleting…",
    eliminaDefinitivamente: "Delete permanently",
  },
});

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
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(changeEmailAction, INITIAL);

  return (
    <Panel title={t.indirizzoEmail} hint={t.indirizzoEmailNota}>
      <form action={action} noValidate>
        <Feedback state={state} />

        <Field label={t.nuovoIndirizzo} hint={t.attuale(current)}>
          <Input type="email" name="email" autoComplete="email" required defaultValue={current} />
        </Field>

        <Field label={t.passwordAttuale}>
          <Input type="password" name="password" autoComplete="current-password" required />
        </Field>

        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? t.aggiorno : t.cambiaIndirizzo}
        </Button>
      </form>
    </Panel>
  );
}

export function ChangePasswordForm() {
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(changePasswordAction, INITIAL);

  return (
    <Panel title={t.password} hint={t.passwordNota}>
      <form action={action} noValidate>
        <Feedback state={state} />

        <Field label={t.passwordAttuale}>
          <Input type="password" name="current" autoComplete="current-password" required />
        </Field>

        <Field label={t.nuovaPassword} hint={t.almenoDieci}>
          <Input type="password" name="next" autoComplete="new-password" required minLength={10} />
        </Field>

        <Field label={t.ripetila}>
          <Input type="password" name="repeat" autoComplete="new-password" required />
        </Field>

        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? t.aggiorno : t.cambiaPassword}
        </Button>
      </form>
    </Panel>
  );
}

export function DeleteAccountForm() {
  const locale = useLocale();
  const t = TESTI[locale];
  const phrase = deletePhrase(locale);
  const [state, action, pending] = useActionState(deleteAccountAction, INITIAL);

  return (
    <Panel title={t.eliminaAccount} hint={t.eliminaNota} danger>
      <form action={action} noValidate>
        <Feedback state={state} />

        <p className="mb-4 text-[13px] text-ink-2">
          {t.postPrima} <strong>{t.restano}</strong>
          {t.postDopo}
        </p>

        <Field label={t.passwordAttuale}>
          <Input type="password" name="password" autoComplete="current-password" required />
        </Field>

        <Field label={t.conferma} hint={t.scrivi(phrase)}>
          <Input name="confirm" required placeholder={phrase} className="font-mono" />
        </Field>

        <Button
          type="submit"
          disabled={pending}
          className="border-hot text-hot hover:bg-hot hover:text-white"
        >
          {pending ? t.elimino : t.eliminaDefinitivamente}
        </Button>
      </form>
    </Panel>
  );
}
