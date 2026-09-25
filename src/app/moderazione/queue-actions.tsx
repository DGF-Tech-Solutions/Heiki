"use client";

import { useActionState, useState, useTransition } from "react";
import {
  liftSuspensionAction,
  resolveReportAction,
  setHiddenAction,
  suspendAction,
  type ModResult,
} from "@/lib/moderation/actions";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { Button, Field, Input, Notice, Textarea } from "@/components/ui";

const TESTI = testi({
  it: {
    fatto: "Fatto.",
    azioneNonRiuscita: "Non è stato possibile completare l’azione.",
    ripristina: "Ripristina",
    nascondi: "Nascondi",
    chiudi: "Chiudi",
    archivia: "Archivia",
    identificativoUtente: "Identificativo utente",
    doveTrovarlo: "lo trovi nella riga della segnalazione",
    giorni: "Giorni",
    zeroIndeterminato: "0 = a tempo indeterminato",
    motivo: "Motivo",
    sospendo: "Sospendo…",
    sospendi: "Sospendi",
    revocata: "revocata",
    revocaNonRiuscita: "Non è stato possibile revocarla.",
    revoca: "Revoca",
  },
  en: {
    fatto: "Done.",
    azioneNonRiuscita: "The action couldn’t be completed.",
    ripristina: "Restore",
    nascondi: "Hide",
    chiudi: "Close",
    archivia: "Dismiss",
    identificativoUtente: "User ID",
    doveTrovarlo: "you’ll find it in the report row",
    giorni: "Days",
    zeroIndeterminato: "0 = indefinitely",
    motivo: "Reason",
    sospendo: "Suspending…",
    sospendi: "Suspend",
    revocata: "lifted",
    revocaNonRiuscita: "The suspension couldn’t be lifted.",
    revoca: "Lift",
  },
});

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
  const t = TESTI[useLocale()];
  const [isHidden, setIsHidden] = useState(hidden);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function run(work: () => Promise<ModResult>, after?: () => void) {
    setError(null);
    start(async () => {
      const result = await work();
      if (result.ok) {
        setDone(result.message ?? t.fatto);
        after?.();
      } else {
        setError(result.error ?? t.azioneNonRiuscita);
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
        {isHidden ? t.ripristina : t.nascondi}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="primary"
        disabled={pending}
        onClick={() => run(() => resolveReportAction(reportId, "RESOLVED"))}
      >
        {t.chiudi}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() => run(() => resolveReportAction(reportId, "DISMISSED"))}
      >
        {t.archivia}
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
  const t = TESTI[useLocale()];
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
        <Field label={t.identificativoUtente} hint={t.doveTrovarlo}>
          <Input name="userId" required placeholder="00000000-0000-0000-0000-000000000000" />
        </Field>
        <Field label={t.giorni} hint={t.zeroIndeterminato}>
          <Input name="days" type="number" min={0} max={3650} defaultValue={7} required />
        </Field>
      </div>

      <Field label={t.motivo}>
        <Textarea name="reason" rows={2} required maxLength={500} />
      </Field>

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? t.sospendo : t.sospendi}
      </Button>
    </form>
  );
}

export function LiftButton({ suspensionId }: { suspensionId: string }) {
  const t = TESTI[useLocale()];
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (done) return <span className="font-mono text-[11px] text-ink-3">{t.revocata}</span>;

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
            else setError(result.error ?? t.revocaNonRiuscita);
          })
        }
      >
        {pending ? "…" : t.revoca}
      </Button>
      {error ? <span className="ml-2 text-[11px] text-hot">{error}</span> : null}
    </>
  );
}
