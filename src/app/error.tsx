"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonClass, cx, display, eyebrow } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    errore: "Errore",
    titolo: "Qualcosa si è rotto",
    spiegazione: "Non è colpa tua. Riprova: se ricapita, il riferimento qui sotto ci aiuta a capire dove.",
    riferimento: "riferimento",
    riprova: "Riprova",
    tornaAiGiochi: "Torna ai giochi",
  },
  en: {
    errore: "Error",
    titolo: "Something broke",
    spiegazione: "It's not your fault. Try again: if it happens again, the reference below helps us find where.",
    riferimento: "reference",
    riprova: "Try again",
    tornaAiGiochi: "Back to games",
  },
});

/**
 * Errore imprevisto.
 *
 * Due cose che un messaggio di errore deve fare e che quello di default non fa:
 * offrire un modo per riprovare senza perdere il posto, e dare un riferimento
 * (il digest) che chi segnala il problema possa citare. Senza, la segnalazione
 * e' "non funziona" e non si puo' fare niente.
 *
 * Non si mostra lo stack: a chi legge non serve, e puo' contenere dettagli
 * dell'infrastruttura. La lingua arriva dal layout radice, che resta in piedi
 * anche quando una pagina fallisce.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = TESTI[useLocale()];

  useEffect(() => {
    // In sviluppo il messaggio serve in console; in produzione ci andrebbe un
    // servizio di raccolta errori, che non c'e' ancora.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-[700px] px-6 pt-16 pb-24">
      <p className={eyebrow}>{t.errore}</p>
      <h1 className={cx(display, "mt-3 text-[clamp(28px,4.6vw,44px)]")}>{t.titolo}</h1>
      <p className="mt-4 text-base text-ink-2">{t.spiegazione}</p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-ink-3">
          {t.riferimento} {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Button variant="primary" onClick={reset}>
          {t.riprova}
        </Button>
        <Link href="/" className={buttonClass("outline")}>
          {t.tornaAiGiochi}
        </Link>
      </div>
    </main>
  );
}
