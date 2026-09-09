"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/auth/actions";
import { Button, Field, Input, Notice } from "@/components/ui";

const INITIAL: FormState = {};

export function LoginForm({ demoMode = false }: { demoMode?: boolean }) {
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={action} noValidate>
      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}

      <Field label="Email">
        <Input type="email" name="email" autoComplete="email" required placeholder="tu@esempio.it" />
      </Field>

      <Field label="Password">
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
        {pending ? "Controllo…" : "Entra"}
      </Button>

      {demoMode ? (
        <p className="mt-2.5 text-[11px] text-ink-3">
          Senza database anche questo modulo porta al profilo di esempio.
        </p>
      ) : null}
    </form>
  );
}
