"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AwakenStar } from "@/components/ratings/star-display";
import { buttonClass, chipColors, cx, eyebrow } from "@/components/ui";
import { deleteHeroRatingAction, saveHeroRatingAction } from "@/lib/ratings/actions";
import {
  BEST_CONTENTS,
  BEST_CONTENT_KEYS,
  COMMENT_MAX_LENGTH,
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
    nessunContenuto: "Nessuno",
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
    nessunContenuto: "None",
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

const STARS = [1, 2, 3, 4, 5] as const;

const LEGEND = "p-0 text-xs font-bold uppercase tracking-wider text-ink-2";

/**
 * Le cinque stelle di un voto: radio veri dentro le etichette, come le stelle
 * del calcolatore nella scheda eroe. Prima erano pulsanti con role="radio", che
 * si dichiaravano radio senza comportarsi da radio: niente frecce, e il tasto
 * Tab passava da tutte e cinque. Ora il gruppo, le frecce, il Tab che entra
 * sulla stella scelta e l'annuncio «3 stelle, 3 di 5» li da' il browser.
 */
function StarPicker({
  game,
  name,
  legend,
  value,
  onChange,
  starLabel,
}: {
  game: string;
  name: string;
  legend: string;
  value: number;
  onChange: (value: number) => void;
  starLabel: (n: number) => string;
}) {
  // l'anteprima al passaggio del mouse: solo disegno, la scelta e' `value`
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset className="min-w-0">
      <legend className={LEGEND}>{legend}</legend>
      <div className="mt-2 flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
        {STARS.map((num) => (
          <label key={num} className="group cursor-pointer" onMouseEnter={() => setHover(num)}>
            <input
              type="radio"
              name={name}
              value={num}
              checked={value === num}
              onChange={() => onChange(num)}
              className="peer sr-only"
            />
            <span className="sr-only">{starLabel(num)}</span>
            {/* il radio e' invisibile: il fuoco della tastiera si disegna qui */}
            <span
              aria-hidden
              className="p5-press block rounded-sm p-1 peer-focus-visible:outline-2 peer-focus-visible:outline-ink"
            >
              <AwakenStar
                game={game}
                size={28}
                dimmed={num > shown}
                ariaHidden
                className="group-hover:scale-110"
              />
            </span>
          </label>
        ))}
        <span aria-hidden className="ml-2 font-mono text-sm font-bold text-ink">
          {shown > 0 ? `${shown}/5` : "—"}
        </span>
      </div>
    </fieldset>
  );
}

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
  const [isPending, startTransition] = useTransition();

  const [pveScore, setPveScore] = useState<number>(initialRating?.pveScore ?? 0);
  const [pvpScore, setPvpScore] = useState<number>(initialRating?.pvpScore ?? 0);

  // "" e' la scelta «Nessuno»: il campo e' facoltativo, e con dei radio serve
  // un'opzione per tornare indietro dopo averne spuntato uno
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

  // Niente router.refresh() dopo le azioni: fanno gia' revalidatePath della
  // pagina, e la risposta dell'azione porta la pagina aggiornata. Il refresh
  // in piu' la ridisegnava una seconda volta.
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
      }
    });
  };

  const contentOptions: { key: BestContentKey | ""; label: string }[] = [
    { key: "", label: t.nessunContenuto },
    ...BEST_CONTENT_KEYS.map((key) => ({ key, label: BEST_CONTENTS[key].label[locale] })),
  ];

  return (
    <form onSubmit={handleSubmit} className="p5-corner border border-rule bg-paper-2 p-5">
      <h3 className={cx(eyebrow, "mb-4 text-ink")}>
        {initialRating ? t.modificaValutazione : t.titoloTuaValutazione}
      </h3>

      {/* Selettori a stelle: PvE e PvP */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded border border-rule-2 bg-paper p-3.5">
          <StarPicker
            game={game}
            name="pveScore"
            legend={t.pveLabel}
            value={pveScore}
            onChange={setPveScore}
            starLabel={t.selezionaStelle}
          />
        </div>
        <div className="rounded border border-rule-2 bg-paper p-3.5">
          <StarPicker
            game={game}
            name="pvpScore"
            legend={t.pvpLabel}
            value={pvpScore}
            onChange={setPvpScore}
            starLabel={t.selezionaStelle}
          />
        </div>
      </div>

      {/*
        Contenuto in cui spicca: un gruppo di radio, uno solo alla volta. Prima
        erano pulsanti senza stato (chi usa un lettore di schermo non sapeva
        quale fosse scelto) sotto un <label> che non etichettava niente.
      */}
      <fieldset className="mt-5 min-w-0">
        <legend className={LEGEND}>{t.bestContentLabel}</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {contentOptions.map(({ key, label }) => {
            const isSelected = bestContent === key;
            return (
              <label key={key || "nessuno"} className="cursor-pointer">
                <input
                  type="radio"
                  name="bestContent"
                  value={key}
                  checked={isSelected}
                  onChange={() => setBestContent(key)}
                  className="peer sr-only"
                />
                <span
                  className={cx(
                    "p5-cut p5-btn block px-3 py-1.5 text-xs font-bold transition-all",
                    // il fuoco dentro il taglio, come sui comandi tagliati (globals.css):
                    // clip-path ritaglia un contorno esterno
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-current peer-focus-visible:outline-offset-[-5px]",
                    // scelta chiara come tutte le scelte del sito (24/10): era rossa
                    // col bianco caldo sopra, 4,2:1 a 12px
                    isSelected
                      ? chipColors(true)
                      : "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink-2)] hover:[--btn-fg:var(--color-ink)]",
                  )}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Commento / Consiglio facoltativo */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="rating-comment" className={LEGEND}>
            {t.commentLabel}
          </label>
          <span id="rating-comment-resto" className="text-xs text-ink-3">
            {t.caratteriRimanenti(Math.max(0, COMMENT_MAX_LENGTH - comment.length))}
          </span>
        </div>
        <textarea
          id="rating-comment"
          aria-describedby="rating-comment-resto"
          value={comment}
          maxLength={COMMENT_MAX_LENGTH}
          onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
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
