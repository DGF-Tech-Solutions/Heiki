"use client";

import { useActionState, useState } from "react";
import { reportAction, type ModResult } from "@/lib/moderation/actions";
import { REPORT_REASONS } from "@/lib/moderation/reasons";
import { Button, Field, Notice, Select, Textarea } from "../ui";

const INITIAL: ModResult = { ok: false };

/**
 * Segnala.
 *
 * Sta chiuso dietro a un link piccolo e grigio: deve essere trovabile da chi lo
 * cerca senza invitare chi non lo cerca. Un pulsante grande accanto al voto
 * trasformerebbe il disaccordo in segnalazione.
 *
 * A invio riuscito il modulo si chiude e resta solo la conferma: se restasse
 * aperto si sarebbe tentati di mandarne un'altra, e la coda si riempirebbe di
 * duplicati.
 */
export function ReportButton({
  targetType,
  targetId,
  canReport,
}: {
  targetType: "POST" | "COMMENT";
  targetId: string;
  /** false per chi non ha una sessione: si mostra il perche', non si nasconde */
  canReport: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(reportAction, INITIAL);

  if (state.ok && state.message) {
    return <p className="mt-2 font-mono text-[11px] text-ink-3">{state.message}</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 hover:text-hot"
      >
        Segnala
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-card border border-rule-2 bg-paper-2 p-3.5">
      {!canReport ? (
        <>
          <Notice tone="warn">Entra per segnalare un contenuto.</Notice>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink"
          >
            Chiudi
          </button>
        </>
      ) : (
        <form action={action}>
          <input type="hidden" name="targetType" value={targetType} />
          <input type="hidden" name="targetId" value={targetId} />

          {state.error ? (
            <Notice tone="error" className="mb-3">
              {state.error}
            </Notice>
          ) : null}

          <Field label="Perché lo segnali">
            <Select name="reason" defaultValue="spam" required>
              {REPORT_REASONS.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Dettagli" hint="opzionale, ma aiuta chi legge">
            <Textarea name="details" rows={3} maxLength={1000} />
          </Field>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Invio…" : "Invia"}
            </Button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink"
            >
              Annulla
            </button>
          </div>

          <p className="mt-2.5 text-[11px] text-ink-3">
            Le segnalazioni non sono anonime per i moderatori. Non è un pulsante «non sono
            d&apos;accordo»: per quello c&apos;è il voto.
          </p>
        </form>
      )}
    </div>
  );
}
