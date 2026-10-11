"use client";

/**
 * Il passo della guida: titolo, note generali e una casella per ogni fase della
 * difficolta' scelta, nell'ordine della battaglia, con accanto chi c'e' o cosa
 * succede (il nemico, la descrizione del gioco). Tutto facoltativo: vuoto, la
 * strategia e' un consiglio di squadra e si pubblica subito.
 *
 * I contatori contano come il server (`cleanText`): spazi in testa e in coda
 * non pesano. Niente `maxLength` sui campi: un testo incollato troppo lungo
 * verrebbe tagliato senza dirlo; cosi' resta intero, il contatore diventa rosa e
 * l'invio si ferma finche' non lo si accorcia.
 */

import { Notice, cx, eyebrow, numeric, Input, Textarea, buttonClass } from "@/components/ui";
import { cleanText } from "@/lib/strategies/rules";
import { STRATEGY_LIMITS, type TemplateLevel } from "@/lib/strategies/types";
import { extraPhases, titleLength, type EditorProblem, type EditorState } from "./editor-state";
import { problemText, type Texts } from "./editor-texts";

/** Un errore tornato dal server per un campo di questo passo. */
export interface GuideMark {
  readonly field: "title" | "notes" | "phases";
  readonly phase?: number;
  readonly message: string;
}

export function GuideStep({
  t,
  state,
  level,
  problems,
  attempted,
  mark,
  onTitle,
  onNotes,
  onPhase,
  onExtra,
}: {
  t: Texts;
  state: EditorState;
  level: TemplateLevel | null;
  problems: readonly EditorProblem[];
  /** si e' gia' provato a inviare: i problemi del testo diventano errori */
  attempted: boolean;
  mark: GuideMark | null;
  onTitle: (value: string) => void;
  onNotes: (value: string) => void;
  onPhase: (index: number, value: string) => void;
  /** le note per fasi che non ci sono: spostale nelle note generali, o buttale */
  onExtra: (move: boolean) => void;
}) {
  const label = (index: number) => level?.phases[index]?.label ?? t.faseN(index + 1);
  const titleProblem = problems.find((problem) => problem.code.startsWith("title"));
  // il titolo troppo lungo si dice subito; gli altri problemi del titolo prima
  // come consiglio, in grigio, e come errore dopo aver provato a inviare
  const titleError = titleProblem && (attempted || titleProblem.code === "title-long");
  const notesLong = problems.some((problem) => problem.code === "notes-long");
  const extra = extraPhases(state, level);

  const titleMark = mark?.field === "title" ? mark.message : null;
  const notesMark = mark?.field === "notes" ? mark.message : null;
  const phasesMark = mark?.field === "phases" && mark.phase === undefined ? mark.message : null;

  return (
    <div className="grid max-w-[1100px] gap-5">
      <div>
        <FieldHead htmlFor="strategia-titolo" label={t.titolo} count={titleLength(state.title)} max={STRATEGY_LIMITS.titleMax} t={t} />
        <Input
          id="strategia-titolo"
          value={state.title}
          onChange={(event) => onTitle(event.target.value)}
          placeholder={t.titoloPlaceholder}
          autoComplete="off"
          aria-invalid={titleError || !!titleMark || undefined}
          aria-describedby="strategia-titolo-conta strategia-titolo-nota"
          className="mt-1.5 scroll-mt-28 scroll-mb-48 placeholder:text-ink-3"
        />
        <p id="strategia-titolo-nota" className={cx("mt-1.5 mb-0 text-[12px] leading-snug", titleError || titleMark ? "text-hot" : "text-ink-3")}>
          {titleMark ?? (titleProblem ? problemText(titleProblem, t, label) : t.titoloRegola)}
        </p>
      </div>

      <div>
        <FieldHead htmlFor="strategia-note" label={t.note} count={cleanText(state.notes).length} max={STRATEGY_LIMITS.notesMax} t={t} />
        <Textarea
          id="strategia-note"
          value={state.notes}
          rows={6}
          onChange={(event) => onNotes(event.target.value)}
          placeholder={t.notePlaceholder}
          aria-invalid={notesLong || !!notesMark || undefined}
          aria-describedby={cx("strategia-note-conta", (notesLong || notesMark) && "strategia-note-errore") || undefined}
          className="mt-1.5 scroll-mt-28 scroll-mb-48 placeholder:text-ink-3"
        />
        {notesLong || notesMark ? (
          <p id="strategia-note-errore" className="mt-1.5 mb-0 text-[12px] text-hot">
            {notesMark ?? t.problema.notesLong()}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className={cx(eyebrow, "m-0 text-[13px] text-ink-2")}>{t.fasiTitolo}</h3>
        {level ? (
          <>
            <p className="mt-1 mb-3 max-w-[68ch] text-[12px] text-ink-3">{t.fasiSpiega}</p>
            {phasesMark ? <p className="mt-0 mb-3 text-[12px] text-hot">{phasesMark}</p> : null}
            <ol className="m-0 grid list-none gap-4 p-0 lg:grid-cols-2">
              {level.phases.map((phase, index) => {
                const id = `strategia-fase-${index}`;
                const value = state.phases[index] ?? "";
                const long = problems.some((problem) => problem.code === "phase-long" && problem.phase === index);
                const phaseMark = mark?.field === "phases" && mark.phase === index ? mark.message : null;
                return (
                  <li key={index} className="min-w-0">
                    <FieldHead htmlFor={id} label={phase.label} count={cleanText(value).length} max={STRATEGY_LIMITS.phaseMax} t={t} />
                    {phase.detail ? (
                      <p id={`${id}-dettaglio`} className="mt-1 mb-0 text-[12px] leading-snug text-ink-3">
                        {phase.detail}
                      </p>
                    ) : null}
                    <Textarea
                      id={id}
                      value={value}
                      rows={3}
                      onChange={(event) => onPhase(index, event.target.value)}
                      aria-invalid={long || !!phaseMark || undefined}
                      aria-describedby={
                        cx(`${id}-conta`, phase.detail && `${id}-dettaglio`, (long || phaseMark) && `${id}-errore`) || undefined
                      }
                      className="mt-1.5 scroll-mt-28 scroll-mb-48"
                    />
                    {long || phaseMark ? (
                      <p id={`${id}-errore`} className="mt-1.5 mb-0 text-[12px] text-hot">
                        {phaseMark ?? t.problema.phaseLong(phase.label)}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <p className="mt-1 mb-0 text-[13px] text-ink-3">{t.fasiPrimaDifficolta}</p>
        )}
      </div>

      {extra.length > 0 ? (
        level ? (
          <Notice tone="warn" className="flex-col gap-2">
            <p className="m-0">{t.fasiInPiu(extra.length)}</p>
            <ul className="m-0 grid list-none gap-1 p-0">
              {extra.map((item) => (
                <li key={item.index} className="line-clamp-2 min-w-0 text-[12px]">
                  <span className="font-bold">{t.faseN(item.index + 1)}: </span>
                  {cleanText(item.text)}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onExtra(true)} className={buttonClass("outline", "sm")}>
                {t.spostaNelleNote}
              </button>
              <button type="button" onClick={() => onExtra(false)} className={buttonClass("ghost", "sm")}>
                {t.eliminale}
              </button>
            </div>
          </Notice>
        ) : (
          <p className="m-0 text-[12px] text-ink-3">{t.fasiInAttesa(extra.length)}</p>
        )
      ) : null}
    </div>
  );
}

/** L'etichetta di un campo e, a destra, il contatore: grigio, oro vicino al limite, rosa oltre. */
function FieldHead({ htmlFor, label, count, max, t }: { htmlFor: string; label: string; count: number; max: number; t: Texts }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className={cx(eyebrow, "text-ink-2")}>
        {label}
      </label>
      <span
        id={`${htmlFor}-conta`}
        className={cx(numeric, "shrink-0 text-[12px]", count > max ? "font-bold text-hot" : count > max * 0.9 ? "text-gold" : "text-ink-3")}
      >
        {t.contatore(count, max)}
      </span>
    </div>
  );
}
