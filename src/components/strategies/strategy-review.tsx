"use client";

/**
 * La decisione di un moderatore su una guida dell'Endgame: pubblica, o respingi
 * con un motivo che l'autore leggera' nella pagina della guida.
 *
 * Sta nella coda di /moderazione e nella pagina della guida (per chi modera):
 * nei due posti la stessa decisione, con lo stesso controllo lato server.
 */

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, cx, eyebrow, Textarea } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { reviewStrategyAction } from "@/lib/strategies/actions";

const TESTI = testi({
  it: {
    controlla:
      "Controlla: il testo parla della modalità e della difficoltà indicate, non insulta, non pubblicizza, non copia una guida altrui senza dirlo. La squadra e il set si possono discutere nei commenti: non sono motivo di rifiuto.",
    nota: "Nota (obbligatoria per respingere: la legge chi l'ha scritta)",
    pubblica: "Pubblica",
    respingi: "Respingi",
    pubblicata: "Pubblicata.",
    respinta: "Respinta: l'autore vede il motivo e può correggerla.",
  },
  en: {
    controlla:
      "Check: the text is about the mode and difficulty given, doesn't insult, doesn't advertise, doesn't copy someone else's guide without saying so. Team and set can be discussed in the comments: they're not a reason to reject.",
    nota: "Note (required to reject: the author will read it)",
    pubblica: "Publish",
    respingi: "Reject",
    pubblicata: "Published.",
    respinta: "Rejected: the author sees the reason and can fix it.",
  },
});

export function StrategyReview({ postId, className }: { postId: string; className?: string }) {
  const t = TESTI[useLocale()];
  const router = useRouter();
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const fieldId = `revisione-${postId}`;

  const decide = (decision: "approve" | "reject") =>
    startTransition(async () => {
      const outcome = await reviewStrategyAction({ postId, decision, note });
      if (outcome.ok) {
        setResult({ ok: true, text: decision === "approve" ? t.pubblicata : t.respinta });
        router.refresh();
      } else {
        setResult({ ok: false, text: outcome.error ?? "" });
      }
    });

  if (result?.ok) {
    return <p className={cx("m-0 text-sm font-semibold text-ink", className)}>{result.text}</p>;
  }

  return (
    <div className={cx("grid gap-2.5", className)}>
      <p className="m-0 max-w-[68ch] text-xs leading-relaxed text-ink-2">{t.controlla}</p>
      <label htmlFor={fieldId} className={eyebrow}>
        {t.nota}
      </label>
      <Textarea id={fieldId} rows={2} maxLength={600} value={note} onChange={(event) => setNote(event.target.value)} />
      <div className="flex flex-wrap items-center gap-2.5">
        <Button type="button" variant="primary" size="sm" disabled={pending} onClick={() => decide("approve")}>
          {t.pubblica}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => decide("reject")}>
          {t.respingi}
        </Button>
        {result && !result.ok ? (
          <p role="alert" className="m-0 text-sm text-hot">
            {result.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
