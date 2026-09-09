"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/auth/actions";
import { Button, Field, Input, Notice } from "@/components/ui";

const INITIAL: FormState = {};

export function RegisterForm({ demoMode = false }: { demoMode?: boolean }) {
  const [state, action, pending] = useActionState(registerAction, INITIAL);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate>
      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}

      <Field label="Handle" hint="gachazone.it/u/…" error={errors.username}>
        <Input
          className="font-mono"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={20}
          placeholder="ilmionome"
          aria-invalid={errors.username ? true : undefined}
        />
      </Field>

      <Field label="Nome visualizzato" error={errors.displayName}>
        <Input
          name="displayName"
          autoComplete="nickname"
          required
          maxLength={40}
          aria-invalid={errors.displayName ? true : undefined}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="tu@esempio.it"
          aria-invalid={errors.email ? true : undefined}
        />
      </Field>

      <Field label="Password" hint="almeno 10 caratteri" error={errors.password}>
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
        {pending ? "Creo…" : "Crea il profilo"}
      </Button>

      {demoMode ? (
        <p className="mt-2.5 text-[11px] text-ink-3">
          Senza database anche questo modulo porta al profilo di esempio.
        </p>
      ) : null}
    </form>
  );
}
