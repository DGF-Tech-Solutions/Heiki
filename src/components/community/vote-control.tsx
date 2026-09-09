"use client";

/**
 * Controllo di voto.
 *
 * Il punteggio si aggiorna subito e la richiesta parte dopo: aspettare il
 * server per un gesto cosi' piccolo fa sembrare il sito rotto. Se la richiesta
 * fallisce il valore torna indietro, invece di lasciare un numero falso.
 *
 * Ripremere il voto gia' dato lo annulla: e' quello che la gente si aspetta
 * ovunque, e non averlo sembra un difetto.
 */

import { useState, useTransition } from "react";
import { voteAction } from "@/lib/community/actions";
import type { Vote } from "@/lib/community/types";
import { cx, numeric } from "../ui";

interface Props {
  targetType: "POST" | "COMMENT";
  targetId: string;
  score: number;
  myVote: Vote;
  compact?: boolean;
}

const ARROW =
  "grid place-items-center rounded-[2px] text-[10px] text-ink-3 transition-colors " +
  "hover:bg-paper-2 hover:text-ink cursor-pointer";

export function VoteControl({ targetType, targetId, score, myVote, compact = false }: Props) {
  const [vote, setVote] = useState<Vote>(myVote);
  const [total, setTotal] = useState(score);
  const [, startTransition] = useTransition();

  function cast(next: Vote) {
    const applied: Vote = vote === next ? 0 : next;
    const previousVote = vote;
    const previousTotal = total;

    setVote(applied);
    setTotal(total + (applied - vote));

    startTransition(async () => {
      const result = await voteAction(targetType, targetId, applied);
      if (result.error) {
        setVote(previousVote);
        setTotal(previousTotal);
      }
    });
  }

  const size = compact ? "h-4 w-6" : "h-5 w-7";

  return (
    <div className="flex flex-none flex-col items-center gap-0.5 pt-0.5">
      <button
        type="button"
        className={cx(ARROW, size, vote === 1 && "text-[var(--accent)]")}
        aria-label="Voto positivo"
        aria-pressed={vote === 1}
        onClick={() => cast(1)}
      >
        ▲
      </button>

      <span
        className={cx(
          numeric,
          "min-w-6 text-center font-medium",
          compact ? "text-xs" : "text-[13px]",
          vote === 1 ? "text-[var(--accent)]" : vote === -1 ? "text-hot" : "text-ink-2",
        )}
      >
        {total}
      </span>

      <button
        type="button"
        className={cx(ARROW, size, vote === -1 && "text-hot")}
        aria-label="Voto negativo"
        aria-pressed={vote === -1}
        onClick={() => cast(-1)}
      >
        ▼
      </button>
    </div>
  );
}
