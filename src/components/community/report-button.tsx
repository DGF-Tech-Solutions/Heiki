"use client";

import { useActionState, useState } from "react";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { reportAction, type ModResult } from "@/lib/moderation/actions";
import { REPORT_REASONS } from "@/lib/moderation/reasons";
import { Button, Field, Notice, Select, Textarea } from "../ui";

const INITIAL: ModResult = { ok: false };

const TESTI = testi({
  it: {
    segnala: "Segnala",
    entraPerSegnalare: "Entra per segnalare un contenuto.",
    chiudi: "Chiudi",
    perche: "Perché lo segnali",
    dettagli: "Dettagli",
    dettagliHint: "opzionale, ma aiuta chi legge",
    invio: "Invio…",
    invia: "Invia",
    annulla: "Annulla",
    nonAnonime:
      "Le segnalazioni non sono anonime per i moderatori. Non è un pulsante «non sono d'accordo»: per quello c'è il voto.",
  },
  en: {
    segnala: "Report",
    entraPerSegnalare: "Log in to report content.",
    chiudi: "Close",
    perche: "Why are you reporting it",
    dettagli: "Details",
    dettagliHint: "optional, but it helps whoever reads it",
    invio: "Sending…",
    invia: "Send",
    annulla: "Cancel",
    nonAnonime:
      "Reports are not anonymous to moderators. This isn't an “I disagree” button: that's what votes are for.",
  },
});

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
  const locale = useLocale();
  const t = TESTI[locale];
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
        className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3 hover:text-hot"
      >
        {t.segnala}
      </button>
    );
  }

  return (
    <div className="p5-corner mt-2 border border-rule bg-paper-2 p-3.5">
      {!canReport ? (
        <>
          <Notice tone="warn">{t.entraPerSegnalare}</Notice>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3 hover:text-ink"
          >
            {t.chiudi}
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

          <Field label={t.perche}>
            <Select name="reason" defaultValue="spam" required>
              {REPORT_REASONS.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.labels[locale]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={t.dettagli} hint={t.dettagliHint}>
            <Textarea name="details" rows={3} maxLength={1000} />
          </Field>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? t.invio : t.invia}
            </Button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3 hover:text-ink"
            >
              {t.annulla}
            </button>
          </div>

          <p className="mt-2.5 text-[12px] text-ink-3">{t.nonAnonime}</p>
        </form>
      )}
    </div>
  );
}
