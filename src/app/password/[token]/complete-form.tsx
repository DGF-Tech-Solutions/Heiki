"use client";

import Link from "next/link";
import { useActionState } from "react";
import { completeResetAction, type ResetState } from "@/lib/auth/password-reset";
import { Button, buttonClass, Field, Input, Notice } from "@/components/ui";

const INITIAL: ResetState = {};

export function CompleteResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(completeResetAction, INITIAL);

  // A operazione riuscita il modulo sparisce: lasciarlo lascerebbe credere che
  // qualcosa sia rimasto da fare.
  if (state.success) {
    return (
      <>
        <Notice className="mb-5">{state.success}</Notice>
        <Link href="/entra" className={buttonClass("primary")}>
          Entra
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

      <Field label="Nuova password" hint="almeno 10 caratteri">
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          autoFocus
        />
      </Field>

      <Field label="Ripetila">
        <Input type="password" name="repeat" autoComplete="new-password" required />
      </Field>

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Imposto…" : "Imposta la password"}
      </Button>

      <p className="mt-3 text-[11px] text-ink-3">
        Impostandola chiudiamo tutte le sessioni aperte su questo account.
      </p>
    </form>
  );
}
