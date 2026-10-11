"use client";

import { useActionState, useState, useTransition } from "react";
import {
  setGuideStatusAction,
  setVerifiedPatchAction,
  type GuideActionState,
} from "@/lib/guides/actions";
import { statusLabel, type GuideStatus } from "@/lib/guides/types";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { Button, Field, Input, Notice } from "@/components/ui";

const TESTI = testi({
  it: {
    // Lo stato arriva gia' minuscolo: "Ora è: in revisione."
    oraE: (stato: string) => `Ora è: ${stato}.`,
    mandaRevisione: "Manda in revisione",
    riportaBozza: "Riporta in bozza",
    pubblica: "Pubblica",
    archivia: "Archivia",
    stato: "Stato:",
    verificataPatch: "Verificata per la patch",
    datasetCorrente: (patch: string) => `dataset corrente: ${patch}`,
    salvo: "Salvo…",
    aggiorna: "Aggiorna la dichiarazione",
    svuota:
      "Svuota il campo per togliere la dichiarazione: la guida tornerà segnata come da rivedere.",
  },
  en: {
    oraE: (stato: string) => `Status is now: ${stato}.`,
    mandaRevisione: "Send to review",
    riportaBozza: "Back to draft",
    pubblica: "Publish",
    archivia: "Archive",
    stato: "Status:",
    verificataPatch: "Verified for patch",
    datasetCorrente: (patch: string) => `current dataset: ${patch}`,
    salvo: "Saving…",
    aggiorna: "Update the declaration",
    svuota: "Clear the field to remove the declaration: the guide will be flagged for review again.",
  },
});

/**
 * Comandi redazionali di una guida.
 *
 * Stanno in un riquadro tratteggiato e separato dal contenuto: chi legge la
 * guida non deve confondere gli strumenti di chi la cura con la guida stessa.
 */
export function StatusControls({
  guideId,
  game,
  status,
  transitions,
}: {
  guideId: string;
  game: string;
  status: GuideStatus;
  /**
   * Per ogni stato, quelli in cui chi guarda puo' portare la guida. Li calcola
   * la pagina con la stessa regola dell'azione (canMoveGuide): fino all'11/10 i
   * pulsanti dell'autore comparivano anche su una guida archiviata, e il server
   * li accettava.
   */
  transitions: Readonly<Record<GuideStatus, readonly GuideStatus[]>>;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [current, setCurrent] = useState<GuideStatus>(status);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function move(next: GuideStatus) {
    setError(null);
    setMessage(null);
    start(async () => {
      const result = await setGuideStatusAction(guideId, game, next);
      if (result.error) setError(result.error);
      else {
        setCurrent(next);
        setMessage(t.oraE(statusLabel(next, locale).toLowerCase()));
      }
    });
  }

  // Le transizioni offerte dipendono da dove si e' adesso: elencarle tutte
  // sempre significherebbe mostrare pulsanti che non fanno niente.
  const allowed = transitions[current];
  const options: { status: GuideStatus; label: string; allowed: boolean }[] = [
    { status: "IN_REVIEW", label: t.mandaRevisione, allowed: allowed.includes("IN_REVIEW") },
    { status: "DRAFT", label: t.riportaBozza, allowed: allowed.includes("DRAFT") },
    { status: "PUBLISHED", label: t.pubblica, allowed: allowed.includes("PUBLISHED") },
    { status: "ARCHIVED", label: t.archivia, allowed: allowed.includes("ARCHIVED") },
  ];

  return (
    <div>
      <p className="m-0 mb-3 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
        {t.stato} {statusLabel(current, locale)}
      </p>

      {error ? (
        <Notice tone="error" className="mb-3">
          {error}
        </Notice>
      ) : null}
      {message ? <Notice className="mb-3">{message}</Notice> : null}

      <div className="flex flex-wrap gap-2">
        {options
          .filter((option) => option.allowed && option.status !== current)
          .map((option) => (
            <Button
              key={option.status}
              type="button"
              size="sm"
              variant={option.status === "PUBLISHED" ? "primary" : "outline"}
              disabled={pending}
              onClick={() => move(option.status)}
            >
              {option.label}
            </Button>
          ))}
      </div>
    </div>
  );
}

const INITIAL: GuideActionState = {};

/**
 * Dichiarazione della patch verificata.
 *
 * Il campo e' precompilato con la patch corrente del dataset perche' il caso
 * normale e' "ho controllato adesso". Lasciarlo vuoto rimuove la dichiarazione,
 * ed e' scritto sotto: non sapere e' uno stato legittimo e va detto.
 */
export function VerifiedPatchForm({
  guideId,
  game,
  slug,
  currentPatch,
  verifiedPatch,
}: {
  guideId: string;
  game: string;
  slug: string;
  currentPatch: string;
  verifiedPatch: string | null;
}) {
  const t = TESTI[useLocale()];
  const [state, action, pending] = useActionState(setVerifiedPatchAction, INITIAL);

  return (
    <form action={action} className="mt-5 border-t border-rule-2 pt-4">
      <input type="hidden" name="id" value={guideId} />
      <input type="hidden" name="game" value={game} />
      <input type="hidden" name="slug" value={slug} />

      {state.error ? (
        <Notice tone="error" className="mb-3">
          {state.error}
        </Notice>
      ) : null}
      {state.success ? <Notice className="mb-3">{state.success}</Notice> : null}

      <Field label={t.verificataPatch} hint={t.datasetCorrente(currentPatch)}>
        <Input name="patch" defaultValue={verifiedPatch ?? currentPatch} maxLength={40} />
      </Field>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? t.salvo : t.aggiorna}
      </Button>

      <p className="mt-2 text-[12px] text-ink-3">{t.svuota}</p>
    </form>
  );
}
