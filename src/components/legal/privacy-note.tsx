"use client";

/**
 * La riga che accompagna un modulo che raccoglie dati personali: dove si legge
 * come li trattiamo, e all'iscrizione anche i Termini e l'eta' minima.
 *
 * L'art. 13 del GDPR vuole l'informativa «nel momento in cui i dati sono
 * ottenuti», cioe' accanto al modulo, non solo nel pie' di pagina. Un
 * componente solo perche' la frase sia identica ovunque: iscrizione, accesso
 * con Discord o Google, account di gioco, verifica con la schermata, profilo.
 *
 * Componente client (per `useLocale`) cosi' entra anche nei moduli che sono
 * gia' client; senza stato, non costa niente.
 */

import Link from "next/link";
import { cx } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { MIN_AGE } from "@/lib/legal/commitments";

const TESTI = testi({
  it: {
    iscrizione: "Iscrivendoti accetti i",
    oauth: "Se entri per la prima volta con Discord o Google crei un account: accetti i",
    termini: "Termini di servizio",
    eta: `e dichiari di avere almeno ${MIN_AGE} anni.`,
    comeTrattiamo: "Come trattiamo i tuoi dati:",
    comeTrattiamoQuesti: "Come trattiamo questi dati:",
    privacy: "Informativa privacy",
  },
  en: {
    iscrizione: "By signing up you accept the",
    oauth: "If you sign in with Discord or Google for the first time you create an account: you accept the",
    termini: "Terms of service",
    eta: `and confirm you are at least ${MIN_AGE} years old.`,
    comeTrattiamo: "How we handle your data:",
    comeTrattiamoQuesti: "How we handle this data:",
    privacy: "Privacy policy",
  },
});

const LINK =
  "font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep";

export function PrivacyNote({
  variant,
  className,
}: {
  /** `signup` sotto il modulo d'iscrizione, `oauth` vicino ai pulsanti dei fornitori, `data` sotto un modulo qualunque */
  variant: "signup" | "oauth" | "data";
  className?: string;
}) {
  const t = TESTI[useLocale()];
  const privacy = (
    <Link href="/legale/privacy" className={LINK}>
      {t.privacy}
    </Link>
  );

  return (
    <p className={cx("m-0 text-[12px] leading-relaxed text-ink-2", className)}>
      {variant === "data" ? (
        <>
          {t.comeTrattiamoQuesti} {privacy}.
        </>
      ) : (
        <>
          {variant === "signup" ? t.iscrizione : t.oauth}{" "}
          <Link href="/legale/termini" className={LINK}>
            {t.termini}
          </Link>{" "}
          {t.eta} {t.comeTrattiamo} {privacy}.
        </>
      )}
    </p>
  );
}
