"use client";

import { useActionState, useState, useTransition } from "react";
import {
  setGuideStatusAction,
  setVerifiedPatchAction,
  type GuideActionState,
} from "@/lib/guides/actions";
import { STATUS_LABELS, type GuideStatus } from "@/lib/guides/types";
import { Button, Field, Input, Notice } from "@/components/ui";

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
  canReview,
  canSubmit,
}: {
  guideId: string;
  game: string;
  status: GuideStatus;
  /** redattore: pubblica e archivia */
  canReview: boolean;
  /** autore: manda in revisione e ritira in bozza */
  canSubmit: boolean;
}) {
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
        setMessage(`Ora è: ${STATUS_LABELS[next].toLowerCase()}.`);
      }
    });
  }

  // Le transizioni offerte dipendono da dove si e' adesso: elencarle tutte
  // sempre significherebbe mostrare pulsanti che non fanno niente.
  const options: { status: GuideStatus; label: string; allowed: boolean }[] = [
    { status: "IN_REVIEW", label: "Manda in revisione", allowed: canSubmit || canReview },
    { status: "DRAFT", label: "Riporta in bozza", allowed: canSubmit || canReview },
    { status: "PUBLISHED", label: "Pubblica", allowed: canReview },
    { status: "ARCHIVED", label: "Archivia", allowed: canReview },
  ];

  return (
    <div>
      <p className="m-0 mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
        Stato: {STATUS_LABELS[current]}
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

      <Field label="Verificata per la patch" hint={`dataset corrente: ${currentPatch}`}>
        <Input name="patch" defaultValue={verifiedPatch ?? currentPatch} maxLength={40} />
      </Field>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Salvo…" : "Aggiorna la dichiarazione"}
      </Button>

      <p className="mt-2 text-[11px] text-ink-3">
        Svuota il campo per togliere la dichiarazione: la guida tornerà segnata come da rivedere.
      </p>
    </form>
  );
}
