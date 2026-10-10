"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { setHiddenAction } from "@/lib/moderation/actions";

const TESTI = testi({
  it: {
    azioneNonRiuscita: "Non è stato possibile completare l’azione.",
    ripristina: "Ripristina",
    nascondi: "Nascondi",
    nascosto: "nascosto",
  },
  en: {
    azioneNonRiuscita: "The action couldn’t be completed.",
    ripristina: "Restore",
    nascondi: "Hide",
    nascosto: "hidden",
  },
});

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
  const t = TESTI[useLocale()];
  const [isHidden, setIsHidden] = useState(hidden);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function toggle() {
    setError(null);
    start(async () => {
      const next = !isHidden;
      const result = await setHiddenAction(targetType, targetId, next);
      if (result.ok) setIsHidden(next);
      else setError(result.error ?? t.azioneNonRiuscita);
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="p5-cut-sm h-7 cursor-pointer border-0 bg-hot-soft px-2.5 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-hot hover:bg-hot hover:text-white disabled:opacity-50"
      >
        {pending ? "…" : isHidden ? t.ripristina : t.nascondi}
      </button>
      {isHidden ? (
        <span className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
          {t.nascosto}
        </span>
      ) : null}
      {error ? <span className="text-[12px] text-hot">{error}</span> : null}
    </span>
  );
}
