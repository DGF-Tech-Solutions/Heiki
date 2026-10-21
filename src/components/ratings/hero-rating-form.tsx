"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AwakenStar } from "@/components/ratings/star-display";
import { buttonClass, cx, eyebrow } from "@/components/ui";
import { deleteHeroRatingAction, saveHeroRatingAction } from "@/lib/ratings/actions";
import {
  BEST_CONTENTS,
  type BestContentKey,
  type UserRatingRecord,
} from "@/lib/ratings/types";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    titoloTuaValutazione: "La tua valutazione",
    modificaValutazione: "Modifica la tua valutazione",
    pveLabel: "Valutazione PvE",
    pvpLabel: "Valutazione PvP",
    selezionaStelle: (n: number) => `${n} ${n === 1 ? "stella" : "stelle"}`,
    bestContentLabel: "Dove spicca secondo te? (facoltativo)",
    commentLabel: "Consiglio o breve nota (facoltativo)",
    commentPlaceholder: "Scrivi un consiglio rapido, punti di forza o strategie per questo eroe...",
    salva: "Salva valutazione",
    aggiorna: "Aggiorna valutazione",
    salvataggioInCorso: "Salvataggio...",
    elimina: "Rimuovi valutazione",
    eliminazioneInCorso: "Rimozione...",
    accediPerValutare: "Accedi per valutare",
    messaggioAccesso: "Vuoi valutare questo eroe? Accedi con il tuo account Heiki per lasciare le tue valutazioni PvE e PvP.",
    caratteriRimanenti: (n: number) => `${n} caratteri rimasti`,
    errorePve: "Seleziona almeno 1 stella per il PvE",
    errorePvp: "Seleziona almeno 1 stella per il PvP",
    salvatoSuccesso: "Valutazione registrata con successo!",
    aggiornatoSuccesso: "Valutazione aggiornata con successo!",
    rimossoSuccesso: "Valutazione rimossa.",
  },
  en: {
    titoloTuaValutazione: "Your rating",
    modificaValutazione: "Edit your rating",
    pveLabel: "PvE Rating",
    pvpLabel: "PvP Rating",
    selezionaStelle: (n: number) => `${n} ${n === 1 ? "star" : "stars"}`,
    bestContentLabel: "Where does it shine most? (optional)",
    commentLabel: "Tip or short note (optional)",
    commentPlaceholder: "Write a quick tip, key strengths, or recommendations for this hero...",
    salva: "Submit rating",
    aggiorna: "Update rating",
    salvataggioInCorso: "Saving...",
    elimina: "Delete rating",
    eliminazioneInCorso: "Deleting...",
    accediPerValutare: "Log in to rate",
    messaggioAccesso: "Want to rate this hero? Log in with your Heiki account to share your PvE and PvP ratings.",
    caratteriRimanenti: (n: number) => `${n} characters left`,
    errorePve: "Please select at least 1 star for PvE",
    errorePvp: "Please select at least 1 star for PvP",
    salvatoSuccesso: "Rating submitted successfully!",
    aggiornatoSuccesso: "Rating updated successfully!",
    rimossoSuccesso: "Rating removed.",
  },
});

interface HeroRatingFormProps {
  game: string;
  heroId: string;
  locale: Locale;
  initialRating: UserRatingRecord | null;
  isLoggedIn: boolean;
}

export function HeroRatingForm({
  game,
  heroId,
  locale,
  initialRating,
  isLoggedIn,
}: HeroRatingFormProps) {
  const t = TESTI[locale];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [pveScore, setPveScore] = useState<number>(initialRating?.pveScore ?? 0);
  const [pveHover, setPveHover] = useState<number>(0);

  const [pvpScore, setPvpScore] = useState<number>(initialRating?.pvpScore ?? 0);
  const [pvpHover, setPvpHover] = useState<number>(0);

  const [bestContent, setBestContent] = useState<BestContentKey | "">(
    initialRating?.bestContent ?? "",
  );
  const [comment, setComment] = useState<string>(initialRating?.comment ?? "");
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});

  if (!isLoggedIn) {
    return (
      <div className="p5-corner border border-rule bg-paper-2 p-5 text-center sm:text-left">
        <h3 className={cx(eyebrow, "mb-2 text-ink")}>{t.titoloTuaValutazione}</h3>
        <p className="max-w-[54ch] text-sm text-ink-2">{t.messaggioAccesso}</p>
        <div className="mt-4">
          <Link
            href={`/entra?da=/${game}/eroi/${heroId}?scheda=valutazioni`}
            className={buttonClass("primary", "sm")}
          >
            {t.accediPerValutare}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pveScore < 1) {
      setFeedback({ error: t.errorePve });
      return;
    }
    if (pvpScore < 1) {
      setFeedback({ error: t.errorePvp });
      return;
    }

    setFeedback({});
    startTransition(async () => {
      const formData = new FormData();
      formData.set("game", game);
      formData.set("heroId", heroId);
      formData.set("pveScore", String(pveScore));
      formData.set("pvpScore", String(pvpScore));
      if (bestContent) formData.set("bestContent", bestContent);
      if (comment.trim()) formData.set("comment", comment.trim());

      const result = await saveHeroRatingAction({}, formData);
      if (result.error) {
        setFeedback({ error: result.error });
      } else {
        setFeedback({
          success: initialRating ? t.aggiornatoSuccesso : t.salvatoSuccesso,
        });
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    setFeedback({});
    startTransition(async () => {
      const formData = new FormData();
      formData.set("game", game);
      formData.set("heroId", heroId);

      const result = await deleteHeroRatingAction({}, formData);
      if (result.error) {
        setFeedback({ error: result.error });
      } else {
        setPveScore(0);
        setPvpScore(0);
        setBestContent("");
        setComment("");
        setFeedback({ success: t.rimossoSuccesso });
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p5-corner border border-rule bg-paper-2 p-5">
      <h3 className={cx(eyebrow, "mb-4 text-ink")}>
        {initialRating ? t.modificaValutazione : t.titoloTuaValutazione}
      </h3>

      {/* Selettori a stelle: PvE e PvP */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* PVE */}
        <div className="rounded border border-rule-2 bg-paper p-3.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-2">
            {t.pveLabel}
          </span>
          <div
            role="radiogroup"
            aria-label={t.pveLabel}
            className="mt-2 flex items-center gap-1.5"
            onMouseLeave={() => setPveHover(0)}
          >
            {([1, 2, 3, 4, 5] as const).map((num) => {
              const active = pveHover > 0 ? num <= pveHover : num <= pveScore;
              return (
                <button
                  key={num}
                  type="button"
                  role="radio"
                  aria-checked={num === pveScore}
                  aria-label={t.selezionaStelle(num)}
                  onClick={() => setPveScore(num)}
                  onMouseEnter={() => setPveHover(num)}
                  className="p5-press group p-1 focus:outline-hidden"
                >
                  <AwakenStar
                    game={game}
                    size={28}
                    dimmed={!active}
                    ariaHidden
                    className="cursor-pointer group-hover:scale-110"
                  />
                </button>
              );
            })}
            <span className="ml-2 font-mono text-sm font-bold text-ink">
              {(pveHover || pveScore) > 0 ? `${pveHover || pveScore}/5` : "—"}
            </span>
          </div>
        </div>

        {/* PVP */}
        <div className="rounded border border-rule-2 bg-paper p-3.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-ink-2">
            {t.pvpLabel}
          </span>
          <div
            role="radiogroup"
            aria-label={t.pvpLabel}
            className="mt-2 flex items-center gap-1.5"
            onMouseLeave={() => setPvpHover(0)}
          >
            {([1, 2, 3, 4, 5] as const).map((num) => {
              const active = pvpHover > 0 ? num <= pvpHover : num <= pvpScore;
              return (
                <button
                  key={num}
                  type="button"
                  role="radio"
                  aria-checked={num === pvpScore}
                  aria-label={t.selezionaStelle(num)}
                  onClick={() => setPvpScore(num)}
                  onMouseEnter={() => setPvpHover(num)}
                  className="p5-press group p-1 focus:outline-hidden"
                >
                  <AwakenStar
                    game={game}
                    size={28}
                    dimmed={!active}
                    ariaHidden
                    className="cursor-pointer group-hover:scale-110"
                  />
                </button>
              );
            })}
            <span className="ml-2 font-mono text-sm font-bold text-ink">
              {(pvpHover || pvpScore) > 0 ? `${pvpHover || pvpScore}/5` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Contenuto in cui spicca */}
      <div className="mt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-2">
          {t.bestContentLabel}
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.entries(BEST_CONTENTS).map(([key, item]) => {
            const isSelected = bestContent === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setBestContent(isSelected ? "" : (key as BestContentKey))}
                className={cx(
                  "p5-cut p5-btn px-3 py-1.5 text-xs font-bold transition-all",
                  isSelected
                    ? "[--btn-bg:var(--color-brand)] [--btn-fg:var(--color-ink)]"
                    : "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink-2)] hover:[--btn-fg:var(--color-ink)]",
                )}
              >
                {item.label[locale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Commento / Consiglio facoltativo */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="rating-comment" className="text-xs font-bold uppercase tracking-wider text-ink-2">
            {t.commentLabel}
          </label>
          <span className="text-xs text-ink-3">
            {t.caratteriRimanenti(Math.max(0, 280 - comment.length))}
          </span>
        </div>
        <textarea
          id="rating-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 280))}
          placeholder={t.commentPlaceholder}
          rows={2}
          className="mt-1.5 w-full rounded border border-rule-2 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-hidden"
        />
      </div>

      {feedback.error ? (
        <div
          role="alert"
          className="mt-3 flex items-center gap-2 rounded border border-red-500/30 bg-red-950/30 px-3 py-2 text-xs font-bold text-red-400"
        >
          <span aria-hidden="true">⚠</span>
          <span>{feedback.error}</span>
        </div>
      ) : null}

      {feedback.success ? (
        <div
          role="status"
          className="mt-3 flex items-center gap-2 rounded border border-up/30 bg-up/10 px-3 py-2 text-xs font-bold text-up"
        >
          <span aria-hidden="true">✓</span>
          <span>{feedback.success}</span>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={buttonClass("primary", "sm")}
        >
          {isPending
            ? t.salvataggioInCorso
            : initialRating
              ? t.aggiorna
              : t.salva}
        </button>

        {initialRating ? (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className={buttonClass("ghost", "sm")}
          >
            {isPending ? t.eliminazioneInCorso : t.elimina}
          </button>
        ) : null}
      </div>
    </form>
  );
}
