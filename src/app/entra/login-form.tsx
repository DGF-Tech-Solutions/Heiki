"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/auth/actions";
import { Button, Field, Input, Notice } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    email: "Email",
    password: "Password",
    esempioEmail: "tu@esempio.it",
    controllo: "Controllo…",
    entra: "Entra",
    senzaDatabase: "Senza database anche questo modulo porta al profilo di esempio.",
  },
  en: {
    email: "Email",
    password: "Password",
    esempioEmail: "you@example.com",
    controllo: "Checking…",
    entra: "Log in",
    senzaDatabase: "Without a database, this form also takes you to the sample profile.",
  },
});

const INITIAL: FormState = {};

export function LoginForm({ demoMode = false }: { demoMode?: boolean }) {
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={action} noValidate>
      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}

      <Field label={t.email}>
        <Input type="email" name="email" autoComplete="email" required placeholder={t.esempioEmail} />
      </Field>

      <Field label={t.password}>
        <Input type="password" name="password" autoComplete="current-password" required />
      </Field>

      {/* In modalita' dimostrativa l'azione primaria e' il pannello sopra: questo
          bottone si smorza, perche' due bottoni pieni nello stesso riquadro non
          direbbero all'utente dove guardare. */}
      <Button
        type="submit"
        variant={demoMode ? "outline" : "primary"}
        className="w-full"
        disabled={pending}
      >
        {pending ? t.controllo : t.entra}
      </Button>

      {demoMode ? (
        <p className="mt-2.5 text-[12px] text-ink-3">{t.senzaDatabase}</p>
      ) : null}
    </form>
  );
}
