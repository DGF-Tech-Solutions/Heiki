"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestResetAction, type ResetState } from "@/lib/auth/password-reset";
import { Button, Field, Input, Notice } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    sviluppo: "Sviluppo:",
    invioNonConfigurato: "l'invio email non è configurato, quindi il collegamento è qui.",
    reimpostaPassword: "Reimposta la password",
    email: "Email",
    esempioEmail: "tu@esempio.it",
    invio: "Invio…",
    mandaCollegamento: "Manda il collegamento",
  },
  en: {
    sviluppo: "Development:",
    invioNonConfigurato: "email sending isn't configured, so the link is here.",
    reimpostaPassword: "Reset your password",
    email: "Email",
    esempioEmail: "you@example.com",
    invio: "Sending…",
    mandaCollegamento: "Send the link",
  },
});

const INITIAL: ResetState = {};

export function RequestResetForm() {
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(requestResetAction, INITIAL);

  return (
    <form action={action} noValidate>
      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}

      {state.success ? (
        <Notice className="mb-4">
          <span>
            {state.success}
            {/* Solo in sviluppo: senza un fornitore di posta configurato, il
                collegamento non arriverebbe da nessuna parte e il flusso
                sarebbe improvabile. In produzione questo blocco non compare. */}
            {state.devLink ? (
              <>
                <br />
                <br />
                <strong>{t.sviluppo}</strong> {t.invioNonConfigurato}{" "}
                <Link href={state.devLink} className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep">
                  {t.reimpostaPassword}
                </Link>
              </>
            ) : null}
          </span>
        </Notice>
      ) : null}

      <Field label={t.email}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder={t.esempioEmail}
        />
      </Field>

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? t.invio : t.mandaCollegamento}
      </Button>
    </form>
  );
}
