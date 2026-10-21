"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/auth/actions";
import { Button, Field, Input, Notice } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    handle: "Handle",
    esempioHandle: "ilmionome",
    nomeVisualizzato: "Nome visualizzato",
    email: "Email",
    esempioEmail: "tu@esempio.it",
    password: "Password",
    almenoDieci: "almeno 10 caratteri",
    creo: "Creo…",
    creaProfilo: "Crea il profilo",
    senzaDatabase: "Senza database anche questo modulo porta al profilo di esempio.",
  },
  en: {
    handle: "Handle",
    esempioHandle: "myname",
    nomeVisualizzato: "Display name",
    email: "Email",
    esempioEmail: "you@example.com",
    password: "Password",
    almenoDieci: "at least 10 characters",
    creo: "Creating…",
    creaProfilo: "Create profile",
    senzaDatabase: "Without a database, this form also takes you to the sample profile.",
  },
});

const INITIAL: FormState = {};

export function RegisterForm({ demoMode = false }: { demoMode?: boolean }) {
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(registerAction, INITIAL);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate>
      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}

      <Field label={t.handle} hint="heiki.it/u/…" error={errors.username}>
        <Input
          className="font-mono"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={20}
          placeholder={t.esempioHandle}
          aria-invalid={errors.username ? true : undefined}
        />
      </Field>

      <Field label={t.nomeVisualizzato} error={errors.displayName}>
        <Input
          name="displayName"
          autoComplete="nickname"
          required
          maxLength={40}
          aria-invalid={errors.displayName ? true : undefined}
        />
      </Field>

      <Field label={t.email} error={errors.email}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder={t.esempioEmail}
          aria-invalid={errors.email ? true : undefined}
        />
      </Field>

      <Field label={t.password} hint={t.almenoDieci} error={errors.password}>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          aria-invalid={errors.password ? true : undefined}
        />
      </Field>

      <Button
        type="submit"
        variant={demoMode ? "outline" : "primary"}
        className="w-full"
        disabled={pending}
      >
        {pending ? t.creo : t.creaProfilo}
      </Button>

      {demoMode ? (
        <p className="mt-2.5 text-[12px] text-ink-3">{t.senzaDatabase}</p>
      ) : null}
    </form>
  );
}
