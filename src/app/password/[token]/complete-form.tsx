"use client";

import Link from "next/link";
import { useActionState } from "react";
import { completeResetAction, type ResetState } from "@/lib/auth/password-reset";
import { Button, buttonClass, Field, Input, Notice } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    entra: "Entra",
    nuovaPassword: "Nuova password",
    almenoDieci: "almeno 10 caratteri",
    ripetila: "Ripetila",
    imposto: "Imposto…",
    impostaPassword: "Imposta la password",
    chiudiamoSessioni: "Impostandola chiudiamo tutte le sessioni aperte su questo account.",
  },
  en: {
    entra: "Log in",
    nuovaPassword: "New password",
    almenoDieci: "at least 10 characters",
    ripetila: "Repeat it",
    imposto: "Setting…",
    impostaPassword: "Set password",
    chiudiamoSessioni: "Setting it closes every open session on this account.",
  },
});

const INITIAL: ResetState = {};

export function CompleteResetForm({ token }: { token: string }) {
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(completeResetAction, INITIAL);

  // A operazione riuscita il modulo sparisce: lasciarlo lascerebbe credere che
  // qualcosa sia rimasto da fare.
  if (state.success) {
    return (
      <>
        <Notice className="mb-5">{state.success}</Notice>
        <Link href="/entra" className={buttonClass("primary")}>
          {t.entra}
        </Link>
      </>
    );
  }

  return (
    <form action={action} noValidate>
      <input type="hidden" name="token" value={token} />

      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}

      <Field label={t.nuovaPassword} hint={t.almenoDieci}>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          autoFocus
        />
      </Field>

      <Field label={t.ripetila}>
        <Input type="password" name="repeat" autoComplete="new-password" required />
      </Field>

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? t.imposto : t.impostaPassword}
      </Button>

      <p className="mt-3 text-[11px] text-ink-3">{t.chiudiamoSessioni}</p>
    </form>
  );
}
