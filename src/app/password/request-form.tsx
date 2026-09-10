"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestResetAction, type ResetState } from "@/lib/auth/password-reset";
import { Button, Field, Input, Notice } from "@/components/ui";

const INITIAL: ResetState = {};

export function RequestResetForm() {
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
                <strong>Sviluppo:</strong> l&apos;invio email non è configurato, quindi il
                collegamento è qui.{" "}
                <Link href={state.devLink} className="font-semibold text-brand hover:underline">
                  Reimposta la password
                </Link>
              </>
            ) : null}
          </span>
        </Notice>
      ) : null}

      <Field label="Email">
        <Input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="tu@esempio.it"
        />
      </Field>

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Invio…" : "Manda il collegamento"}
      </Button>
    </form>
  );
}
