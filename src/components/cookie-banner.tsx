"use client";

/**
 * Banner del consenso.
 *
 * Compare solo a chi non ha ancora scelto, e "Rifiuta" e' un pulsante alla pari
 * di "Accetta" - non un collegamento nascosto in fondo. Un consenso ottenuto
 * rendendo difficile il rifiuto non e' un consenso valido, e in UE non e'
 * nemmeno lecito.
 *
 * Non blocca la pagina: il sito funziona identico senza scegliere, perche' i
 * cookie di profilazione non sono ancora installati. Un muro che impedisce di
 * leggere finche' non si accetta e' l'altra pratica che le autorita' contestano.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, writeConsent } from "@/lib/consent";
import { Button } from "./ui";

export function CookieBanner() {
  // Si parte da "non mostrare": il primo render sul server non conosce
  // l'archiviazione locale, e far comparire il banner per poi nasconderlo
  // produrrebbe un lampo a ogni caricamento.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === "unset");
  }, []);

  if (!visible) return null;

  function decide(state: "granted" | "denied") {
    writeConsent(state);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Scelta sui cookie"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-paper px-6 py-4 shadow-[0_-6px_24px_-12px_rgba(20,22,28,0.25)]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-4">
        <p className="m-0 max-w-[62ch] flex-1 basis-72 text-[13px] text-ink-2">
          Usiamo cookie tecnici per farti restare collegato. Se accetti, in futuro potremo usarne
          anche per la pubblicità. Il sito funziona identico se rifiuti.{" "}
          <Link href="/legale/cookie" className="font-semibold text-brand hover:underline">
            Dettagli
          </Link>
        </p>

        <div className="flex flex-none gap-2.5">
          <Button onClick={() => decide("denied")}>Rifiuta</Button>
          <Button variant="primary" onClick={() => decide("granted")}>
            Accetta
          </Button>
        </div>
      </div>
    </div>
  );
}
