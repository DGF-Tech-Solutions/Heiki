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
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { IconChevronRight } from "../icons";
import { cx, numeric } from "../ui";

const TESTI = testi({
  it: { positivo: "Voto positivo", negativo: "Voto negativo" },
  en: { positivo: "Upvote", negativo: "Downvote" },
});

interface Props {
  targetType: "POST" | "COMMENT";
  targetId: string;
  score: number;
  myVote: Vote;
  compact?: boolean;
}

// 32px e non 20: la freccia si preme anche col pollice (10/10)
const ARROW =
  "p5-btn grid place-items-center border-0 p-0 cursor-pointer " +
  "[--btn-bg:transparent] [--btn-fg:var(--color-ink-3)]";

export function VoteControl({ targetType, targetId, score, myVote, compact = false }: Props) {
  const t = TESTI[useLocale()];
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

  const size = compact ? "h-7 w-7" : "h-8 w-8";

  return (
    <div className="flex flex-none flex-col items-center gap-0.5 pt-0.5">
      <button
        type="button"
        className={cx(ARROW, size, vote === 1 && "text-[var(--accent)]")}
        aria-label={t.positivo}
        aria-pressed={vote === 1}
        onClick={() => cast(1)}
      >
        <IconChevronRight size={compact ? 14 : 16} strokeWidth={3} className="-rotate-90" />
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
        aria-label={t.negativo}
        aria-pressed={vote === -1}
        onClick={() => cast(-1)}
      >
        <IconChevronRight size={compact ? 14 : 16} strokeWidth={3} className="rotate-90" />
      </button>
    </div>
  );
}
