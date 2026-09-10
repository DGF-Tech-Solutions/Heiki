"use client";

/**
 * Pannello per cambiare idea, sulla pagina cookie.
 *
 * Revocare deve costare quanto acconsentire: e' un obbligo, non una cortesia.
 */

import { useEffect, useState } from "react";
import { readConsent, writeConsent, type ConsentState } from "@/lib/consent";
import { Button, cx } from "./ui";

const LABEL: Record<ConsentState, string> = {
  unset: "Non hai ancora scelto",
  granted: "Hai accettato i cookie di profilazione",
  denied: "Hai rifiutato i cookie di profilazione",
};

export function CookiePreferences() {
  const [state, setState] = useState<ConsentState>("unset");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setState(readConsent());
  }, []);

  function decide(next: "granted" | "denied") {
    writeConsent(next);
    setState(next);
    setSaved(true);
  }

  return (
    <div className="not-prose my-6 rounded-card border border-rule bg-paper-2 p-4">
      <p className="m-0 text-sm font-semibold">Stato attuale</p>
      <p
        className={cx(
          "m-0 mt-1 text-[13px]",
          state === "granted" ? "text-brand-deep" : "text-ink-2",
        )}
      >
        {LABEL[state]}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-2.5">
        <Button size="sm" onClick={() => decide("denied")} disabled={state === "denied"}>
          Rifiuta
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={() => decide("granted")}
          disabled={state === "granted"}
        >
          Accetta
        </Button>
      </div>

      {saved ? <p className="m-0 mt-2.5 text-[11px] text-ink-3">Scelta aggiornata.</p> : null}
    </div>
  );
}
