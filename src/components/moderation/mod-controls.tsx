"use client";

import { useState, useTransition } from "react";
import { setHiddenAction } from "@/lib/moderation/actions";

/**
 * Comandi di moderazione in linea.
 *
 * Compaiono solo a chi puo' moderare, e restano visivamente distinti dal resto
 * dell'interfaccia (bordo e mono maiuscolo): un pulsante che nasconde il
 * contenuto di qualcun altro non deve assomigliare a un pulsante normale.
 *
 * "Nascondi" e non "Elimina": la riga resta nel database con la traccia di chi
 * ha deciso, e la decisione si puo' revocare da qui stesso.
 */
export function ModControls({
  targetType,
  targetId,
  hidden,
}: {
  targetType: "POST" | "COMMENT";
  targetId: string;
  hidden: boolean;
}) {
  const [isHidden, setIsHidden] = useState(hidden);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function toggle() {
    setError(null);
    start(async () => {
      const next = !isHidden;
      const result = await setHiddenAction(targetType, targetId, next);
      if (result.ok) setIsHidden(next);
      else setError(result.error ?? "Non è stato possibile completare l’azione.");
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="rounded-[2px] border border-dashed border-hot px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-hot hover:bg-hot-soft disabled:opacity-50"
      >
        {pending ? "…" : isHidden ? "Ripristina" : "Nascondi"}
      </button>
      {isHidden ? (
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3">
          nascosto
        </span>
      ) : null}
      {error ? <span className="text-[11px] text-hot">{error}</span> : null}
    </span>
  );
}
