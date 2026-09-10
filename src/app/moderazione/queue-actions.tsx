"use client";

import { useActionState, useState, useTransition } from "react";
import {
  liftSuspensionAction,
  resolveReportAction,
  setHiddenAction,
  suspendAction,
  type ModResult,
} from "@/lib/moderation/actions";
import { Button, Field, Input, Notice, Textarea } from "@/components/ui";

/**
 * I pulsanti della coda.
 *
 * Ogni riga ha tre esiti possibili e nessuno e' preselezionato: archiviare una
 * segnalazione infondata e nascondere un contenuto sono decisioni diverse, e
 * l'interfaccia non deve suggerire quale sia quella "normale".
 */
export function QueueRowActions({
  reportId,
  targetType,
  targetId,
  hidden,
}: {
  reportId: string;
  targetType: "POST" | "COMMENT";
  targetId: string;
  hidden: boolean;
}) {
  const [isHidden, setIsHidden] = useState(hidden);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run(work: () => Promise<ModResult>, after?: () => void) {
    setError(null);
    start(async () => {
      const result = await work();
      if (result.ok) {
        setDone(result.message ?? "Fatto.");
        after?.();
      } else {
        setError(result.error ?? "Non è stato possibile completare l’azione.");
      }
    });
  }

  if (done) {
    return <p className="m-0 font-mono text-[11px] text-ink-3">{done}</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          run(
            () => setHiddenAction(targetType, targetId, !isHidden),
            () => setIsHidden(!isHidden),
          )
        }
      >
        {isHidden ? "Ripristina" : "Nascondi"}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="primary"
        disabled={pending}
        onClick={() => run(() => resolveReportAction(reportId, "RESOLVED"))}
      >
        Chiudi
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run(() => resolveReportAction(reportId, "DISMISSED"))}
      >
        Archivia
      </Button>

      {error ? <span className="text-[11px] text-hot">{error}</span> : null}
    </div>
  );
}

const INITIAL: ModResult = { ok: false };

/**
 * Sospensione.
 *
 * Chiede l'identificativo dell'utente e non il nome: il nome si cambia, e una
 * sospensione deve colpire l'account, non l'etichetta che porta adesso.
 * Il motivo e' obbligatorio perche' lo legge chi eredita la coda domani.
 */
export function SuspendForm() {
  const [state, action, pending] = useActionState(suspendAction, INITIAL);

  return (
    <form action={action}>
      {state.error ? (
        <Notice tone="error" className="mb-4">
          {state.error}
        </Notice>
      ) : null}
      {state.ok && state.message ? <Notice className="mb-4">{state.message}</Notice> : null}

      <div className="grid gap-4 sm:grid-cols-[1.4fr_0.6fr]">
        <Field label="Identificativo utente" hint="lo trovi nella riga della segnalazione">
          <Input name="userId" required placeholder="00000000-0000-0000-0000-000000000000" />
        </Field>
        <Field label="Giorni" hint="0 = a tempo indeterminato">
          <Input name="days" type="number" min={0} max={3650} defaultValue={7} required />
        </Field>
      </div>

      <Field label="Motivo">
        <Textarea name="reason" rows={2} required maxLength={500} />
      </Field>

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Sospendo…" : "Sospendi"}
      </Button>
    </form>
  );
}

export function LiftButton({ suspensionId }: { suspensionId: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (done) return <span className="font-mono text-[11px] text-ink-3">revocata</span>;

  return (
    <>
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await liftSuspensionAction(suspensionId);
            if (result.ok) setDone(true);
            else setError(result.error ?? "Non è stato possibile revocarla.");
          })
        }
      >
        {pending ? "…" : "Revoca"}
      </Button>
      {error ? <span className="ml-2 text-[11px] text-hot">{error}</span> : null}
    </>
  );
}
