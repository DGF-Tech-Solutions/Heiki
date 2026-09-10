"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonClass, cx, display, eyebrow } from "@/components/ui";

/**
 * Errore imprevisto.
 *
 * Due cose che un messaggio di errore deve fare e che quello di default non fa:
 * offrire un modo per riprovare senza perdere il posto, e dare un riferimento
 * (il digest) che chi segnala il problema possa citare. Senza, la segnalazione
 * e' "non funziona" e non si puo' fare niente.
 *
 * Non si mostra lo stack: a chi legge non serve, e puo' contenere dettagli
 * dell'infrastruttura.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In sviluppo il messaggio serve in console; in produzione ci andrebbe un
    // servizio di raccolta errori, che non c'e' ancora.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-[700px] px-6 pt-16 pb-24">
      <p className={eyebrow}>Errore</p>
      <h1 className={cx(display, "mt-3 text-[clamp(28px,4.6vw,44px)]")}>
        Qualcosa si è rotto
      </h1>
      <p className="mt-4 text-base text-ink-2">
        Non è colpa tua. Riprova: se ricapita, il riferimento qui sotto ci aiuta a capire dove.
      </p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-ink-3">riferimento {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Button variant="primary" onClick={reset}>
          Riprova
        </Button>
        <Link href="/" className={buttonClass("outline")}>
          Torna ai giochi
        </Link>
      </div>
    </main>
  );
}
