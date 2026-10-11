"use client";

/**
 * Il modulo per scrivere una strategia dell'Endgame (richiesta dell'utente,
 * 11/10): si sceglie dove vale (modalita', bersaglio, difficolta'), la squadra,
 * il set artefatto e, se si vuole, si scrive una guida fase per fase.
 *
 * Un passo sotto l'altro e non una procedura a pagine: chi scrive una guida
 * torna su e giu' (cambia la difficolta' e guarda cosa succede alle fasi), e
 * una pagina sola si legge anche da chi la rivede dopo.
 *
 * Il TIPO non si sceglie: lo decide il contenuto (`strategyKind`). Senza testo
 * e' un consiglio di squadra e si pubblica subito; con un testo e' una guida e
 * la rivede un moderatore. La barra in fondo lo dice sempre, insieme al
 * pulsante, perche' e' la cosa che cambia il destino del post: scrivere il
 * titolo basta a mandarlo in revisione.
 *
 * La bozza sta nel browser (solo per una strategia nuova): si riprende al
 * ritorno e si cancella quando parte. Come: all'invio la bozza si toglie; se
 * l'azione torna con un errore, o l'invio non arriva, si rimette. Se va bene
 * l'azione porta alla pagina del post e non c'e' niente da rimettere. E' il modo
 * che non lascia una bozza vecchia dopo una pubblicata, e che perde la bozza
 * solo se la pagina si chiude nei pochi istanti dell'invio (e allora il post,
 * con ogni probabilita', e' gia' arrivato).
 */

import { unstable_rethrow } from "next/navigation";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { buttonClass, cx, Notice, Tag } from "@/components/ui";
import { searchText } from "@/lib/games/hero-terms";
import { cleanText } from "@/lib/strategies/rules";
import { useLocale } from "@/lib/i18n/client";
import { saveStrategyAction, type StrategyActionState } from "@/lib/strategies/actions";
import type { StrategyDraft, StrategySelection, StrategyStatus, StrategyTemplate, TemplateLevel } from "@/lib/strategies/types";
import {
  chooseMode,
  chooseTarget,
  draftStorageKey,
  dropExtraPhases,
  editorProblems,
  isEmptyState,
  isMissing,
  kindOf,
  parseStoredState,
  phasesFor,
  resolve,
  sameSelection,
  serializeState,
  stateFromDraft,
  stateFromSelection,
  teamIssues,
  toDraft,
  type EditorAttribute,
  type EditorProblem,
  type EditorState,
  type LevelRef,
} from "./editor-state";
import { problemText, TESTI, type Texts } from "./editor-texts";
import { GuideStep, type GuideMark } from "./guide-step";
import { LevelChoice, LevelLimits, ModeChoice, Step, TargetChoice } from "./selection-steps";
import { SetStep } from "./set-step";
import { HeroPicker, slotElementId, TeamSlots, type Picking, type PickerFilters } from "./team-step";

export interface StrategyEditorProps {
  template: StrategyTemplate;
  game: string;
  /** la strategia da modificare; null per una nuova */
  initial?: StrategyDraft | null;
  /** il post da modificare: c'e' solo nella modifica, e allora niente bozza nel browser */
  postId?: string | null;
  /** la scelta che arriva dall'indirizzo (`selectionFromParams`) */
  selection?: Partial<StrategySelection>;
  /** gli attributi con l'icona del gioco (`strategyAttributes`), per il filtro e i limiti */
  attributes?: readonly EditorAttribute[];
  /** nella modifica, lo stato della strategia salvata: una guida pubblicata resta tale se il testo non cambia */
  status?: StrategyStatus | null;
}

const NO_RESULT: StrategyActionState = {};

/* ------------------------------------------------- la bozza nel browser -- */

function writeDraft(key: string, state: EditorState): void {
  try {
    if (isEmptyState(state)) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, serializeState(state));
  } catch {
    // il browser rifiuta (navigazione privata, spazio pieno): la bozza resta nella pagina
  }
}

function forgetDraft(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // niente da togliere
  }
}

/** Porta il fuoco su un elemento del modulo, al centro dello schermo: la barra in fondo non lo copre. */
function focusElement(id: string): void {
  window.requestAnimationFrame(() => {
    const element = document.getElementById(id);
    if (!element) return;
    element.focus({ preventScroll: true });
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
  });
}

/** Dove sta, nel modulo, il campo di un problema trovato qui. */
function problemElementId(problem: EditorProblem): string {
  switch (problem.code) {
    case "mode":
      return "passo-modalita";
    case "target":
      return "passo-bersaglio";
    case "level":
      return "passo-difficolta";
    case "hero":
    case "banned":
    case "attribute":
      return slotElementId("hero", problem.slot);
    case "duplicate":
      return slotElementId(problem.associate ? "associate" : "hero", problem.slot);
    case "set":
      return "strategia-set";
    case "notes-long":
      return "strategia-note";
    case "phase-long":
      return `strategia-fase-${problem.phase}`;
    default:
      return "strategia-titolo";
  }
}

/** Dove sta il campo di un errore tornato dal server. */
function resultElementId(result: StrategyActionState): string {
  switch (result.field) {
    case "mode":
      return "passo-modalita";
    case "target":
      return "passo-bersaglio";
    case "level":
      return "passo-difficolta";
    case "team":
      return slotElementId("hero", result.slot ?? 0);
    case "set":
      return "strategia-set";
    case "title":
      return "strategia-titolo";
    case "notes":
      return "strategia-note";
    case "phases":
      return result.phase === undefined ? "passo-guida" : `strategia-fase-${result.phase}`;
    default:
      return "strategia-errori";
  }
}

/* ---------------------------------------------------------------- modulo -- */

export function StrategyEditor({
  template,
  game,
  initial = null,
  postId = null,
  selection,
  attributes = [],
  status = null,
}: StrategyEditorProps) {
  const locale = useLocale();
  const t = TESTI[locale];
  const editing = !!postId;
  const storageKey = editing ? null : draftStorageKey(game);

  // il punto di partenza: la strategia salvata, o la scelta dell'indirizzo; «Ricomincia» ci torna
  const startState = useMemo(
    () => (initial ? stateFromDraft(template, initial) : stateFromSelection(template, selection)),
    [initial, template, selection],
  );
  const [state, setState] = useState<EditorState>(startState);
  const [picking, setPicking] = useState<Picking | null>(null);
  const [placed, setPlaced] = useState<(Picking & { readonly hero: string }) | null>(null);
  const [filters, setFilters] = useState<PickerFilters>({ attribute: null, onlyMine: false });
  const [attempted, setAttempted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);
  // una bozza salvata per un'altra scelta (si arriva da un'altra pagina dell'Endgame)
  const [otherDraft, setOtherDraft] = useState<EditorState | null>(null);
  const [box] = useHeroBox(game);

  const heroes = useMemo(() => new Map(template.heroes.map((hero) => [hero.id, hero])), [template.heroes]);
  const search = useMemo(
    () => new Map(template.heroes.map((hero) => [hero.id, searchText(`${hero.name} ${hero.epithet}`)])),
    [template.heroes],
  );

  const { mode, target, level } = resolve(template, state);
  const issues = teamIssues(state, heroes, level);
  const problems = editorProblems(template, state, heroes);
  const missing = problems.filter(isMissing);
  const kind = kindOf(state, level);
  const draft = toDraft(template, state);
  const phaseLabel = (index: number) => level?.phases[index]?.label ?? t.faseN(index + 1);

  /* ---- l'invio ---- */

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [result, dispatch, pending] = useActionState(
    async (previous: StrategyActionState, formData: FormData): Promise<StrategyActionState> => {
      if (storageKey) forgetDraft(storageKey);
      try {
        const next = await saveStrategyAction(previous, formData);
        // tornato indietro con un errore: la bozza torna nel browser
        if (next.error && storageKey) writeDraft(storageKey, stateRef.current);
        return next;
      } catch (error) {
        // il redirect alla pagina del post arriva come eccezione: e' il successo, va lasciato passare
        unstable_rethrow(error);
        if (storageKey) writeDraft(storageKey, stateRef.current);
        return { error: t.erroreInvio };
      }
    },
    NO_RESULT,
  );

  // le segnalazioni del server sui campi valgono per la versione inviata: alla
  // prima modifica si spengono (resta il riquadro in alto fino al prossimo invio)
  const [staleResult, setStaleResult] = useState<StrategyActionState | null>(null);
  const fresh = result.error && result !== staleResult ? result : null;

  useEffect(() => {
    if (result.error) focusElement(resultElementId(result));
  }, [result]);

  /* ---- la bozza ---- */

  const touched = useRef(false);
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || !storageKey) return;
    restored.current = true;
    let saved: EditorState | null = null;
    try {
      saved = parseStoredState(window.localStorage.getItem(storageKey), template);
    } catch {
      saved = null;
    }
    if (!saved || isEmptyState(saved)) return;
    // l'indirizzo vince: chi arriva dalla pagina del Demone rosso vuole il Demone
    // rosso; la bozza di un'altra scelta resta, e si puo' riprendere
    const fromAddress = stateFromSelection(template, selection);
    if (fromAddress.mode === null || sameSelection(saved, fromAddress)) {
      setState(saved);
      setRestoredDraft(true);
    } else {
      setOtherDraft(saved);
    }
  }, [storageKey, template, selection]);

  useEffect(() => {
    if (!storageKey || !touched.current) return;
    writeDraft(storageKey, state);
  }, [state, storageKey]);

  /** Ogni modifica di chi scrive passa da qui. */
  function update(change: (before: EditorState) => EditorState) {
    touched.current = true;
    setState(change);
    setOtherDraft(null);
    setConfirmReset(false);
    setStaleResult(result);
  }

  function reset() {
    touched.current = false;
    setState(startState);
    setPicking(null);
    setPlaced(null);
    setAttempted(false);
    setConfirmReset(false);
    setOtherDraft(null);
    setRestoredDraft(false);
    setStaleResult(result);
    if (storageKey) forgetDraft(storageKey);
  }

  const canReset = editing ? serializeState(state) !== serializeState(startState) : !isEmptyState(state);
  // una guida gia' pubblicata a cui si cambia solo la squadra o il set resta
  // pubblicata (lo decide l'azione confrontando il testo): la barra lo dice
  const staysPublished = editing && status === "PUBLISHED" && kind === "guide" && !!initial && sameText(initial, state, level);

  /* ---- la squadra ---- */

  function pick(at: Picking) {
    setPicking((before) => (before && before.kind === at.kind && before.slot === at.slot ? null : at));
  }

  function place(hero: string) {
    if (!picking) return;
    const at = picking;
    update((before) => ({
      ...before,
      team: before.team.map((slot, i) => (i === at.slot ? { ...slot, [at.kind]: hero } : slot)),
    }));
    setPlaced({ ...at, hero });
    setPicking(null);
    // il fuoco torna al posto appena riempito: la scelta sparisce da sotto
    focusElement(slotElementId(at.kind, at.slot));
  }

  function remove(at: Picking) {
    update((before) => ({
      ...before,
      team: before.team.map((slot, i) => (i === at.slot ? { ...slot, [at.kind]: null } : slot)),
    }));
    // la croce sparisce con l'eroe: il fuoco va al posto
    window.requestAnimationFrame(() => document.getElementById(slotElementId(at.kind, at.slot))?.focus());
  }

  function closePicker() {
    const at = picking;
    setPicking(null);
    if (at) window.requestAnimationFrame(() => document.getElementById(slotElementId(at.kind, at.slot))?.focus());
  }

  /* ---- l'invio ---- */

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !draft) return;
    setAttempted(true);
    const first = problems[0];
    if (first) {
      focusElement(problemElementId(first));
      return;
    }
    const formData = new FormData();
    formData.set("game", game);
    formData.set("strategy", JSON.stringify(draft));
    if (postId) formData.set("postId", postId);
    startTransition(() => dispatch(formData));
  }

  // Invio in una casella di testo non pubblica: nel titolo o nella ricerca di un
  // eroe e' un tasto che scappa, non la decisione di mandare il post
  function blockEnter(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) event.preventDefault();
  }

  const otherLabel = otherDraft ? selectionLabel(template, otherDraft, t) : "";
  const slotMarks = new Map<number, string>();
  if (fresh?.field === "team" && fresh.error) slotMarks.set(fresh.slot ?? 0, fresh.error);
  const guideMark: GuideMark | null =
    fresh?.error && (fresh.field === "title" || fresh.field === "notes" || fresh.field === "phases")
      ? { field: fresh.field, phase: fresh.phase, message: fresh.error }
      : null;
  const stepMark = (field: "mode" | "target" | "level" | "set") =>
    fresh?.field === field && fresh.error ? <p className="mt-3 mb-0 text-[12px] text-hot">{fresh.error}</p> : null;
  const shownProblems = attempted ? problems.filter((problem) => !isMissing(problem)) : [];
  const heroCount = state.team.filter((slot) => slot.hero).length;

  return (
    <form id="strategia-modulo" onSubmit={submit} onKeyDown={blockEnter} noValidate aria-busy={pending} className="max-w-[1100px]">
      {/* la bozza e «Ricomincia» */}
      {!editing || canReset ? (
        <div className="mb-5 flex min-h-9 flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-ink-3">
          {!editing ? <span>{restoredDraft ? t.bozzaRipresa : t.bozzaSalvata}</span> : null}
          {canReset ? (
            confirmReset ? (
              <span role="group" aria-label={editing ? t.annullaModifiche : t.ricomincia} className="flex flex-wrap items-center gap-2">
                <span className="text-ink-2">{editing ? t.annullaModificheDomanda : t.ricominciaDomanda}</span>
                <button type="button" onClick={reset} className={buttonClass("outline", "sm")}>
                  {editing ? t.siAnnulla : t.siRicomincia}
                </button>
                <button type="button" onClick={() => setConfirmReset(false)} className={buttonClass("ghost", "sm")}>
                  {t.annulla}
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmReset(true)} className={buttonClass("ghost", "sm")}>
                {editing ? t.annullaModifiche : t.ricomincia}
              </button>
            )
          ) : null}
        </div>
      ) : null}

      {otherDraft ? (
        <Notice className="mb-5 flex-wrap items-center">
          <span className="min-w-0 flex-1 basis-[260px]">
            {t.bozzaAltrove(otherLabel)} {t.bozzaSostituita}
          </span>
          <button
            type="button"
            onClick={() => {
              touched.current = false;
              setState(otherDraft);
              setOtherDraft(null);
              setRestoredDraft(true);
            }}
            className={buttonClass("outline", "sm")}
          >
            {t.riprendila}
          </button>
        </Notice>
      ) : null}

      {result.error || shownProblems.length > 0 ? (
        <div id="strategia-errori" tabIndex={-1} className="mb-6 scroll-mt-24 outline-none">
          <Notice tone="error" className="flex-col gap-1.5">
            <p className="m-0 font-bold">{t.problemi}</p>
            <ul className="m-0 grid list-disc gap-1 pl-4">
              {result.error ? <li>{result.error}</li> : null}
              {shownProblems.map((problem, i) => (
                <li key={`${problem.code}-${i}`}>
                  <a
                    href={`#${problemElementId(problem)}`}
                    onClick={(event) => {
                      event.preventDefault();
                      focusElement(problemElementId(problem));
                    }}
                    className="text-inherit underline underline-offset-2"
                  >
                    {problemText(problem, t, phaseLabel)}
                  </a>
                </li>
              ))}
            </ul>
          </Notice>
        </div>
      ) : null}

      <div className="grid gap-10">
        <Step id="passo-modalita" number={1} title={t.modalita} t={t} done={!!mode} hint={<p>{t.modalitaSpiega}</p>}>
          <ModeChoice t={t} template={template} value={state.mode} onChange={(value) => update((before) => chooseMode(template, before, value))} />
          {stepMark("mode")}
        </Step>

        <Step
          id="passo-bersaglio"
          number={2}
          title={t.bersaglio}
          t={t}
          done={!!target}
          hint={mode && mode.targets.length > 1 ? <p>{mode.mode === "creature-nest" ? t.bersaglioBestia : t.bersaglioBoss}</p> : undefined}
        >
          <TargetChoice t={t} mode={mode} value={target} onChange={(key) => update((before) => chooseTarget(template, before, key))} />
          {stepMark("target")}
        </Step>

        <Step
          id="passo-difficolta"
          number={3}
          title={t.difficolta}
          t={t}
          done={!!level}
          hint={target ? <p>{mode?.mode === "creature-nest" ? t.difficoltaBestie : t.difficoltaSpiega}</p> : undefined}
        >
          <LevelChoice
            t={t}
            target={target}
            value={level}
            beasts={mode?.mode === "creature-nest"}
            onChange={(ref: LevelRef) => update((before) => ({ ...before, level: ref }))}
          />
          {level ? <LevelLimits t={t} level={level} attributes={attributes} heroes={heroes} /> : null}
          {stepMark("level")}
        </Step>

        <Step
          id="passo-squadra"
          number={4}
          title={t.squadra}
          t={t}
          done={heroCount === state.team.length && issues.every((issue) => !issue.hero && !issue.associate)}
          hint={
            <p>
              {t.squadraSpiega} <span className="text-ink-3">· {t.eroiScelti(heroCount)}</span>
            </p>
          }
        >
          <TeamSlots
            t={t}
            game={game}
            state={state}
            heroes={heroes}
            issues={issues}
            picking={picking}
            placed={placed}
            marks={slotMarks}
            onPick={pick}
            onRemove={remove}
          />
          {picking ? (
            <HeroPicker
              key={`${picking.kind}-${picking.slot}`}
              t={t}
              game={game}
              heroList={template.heroes}
              heroes={heroes}
              search={search}
              state={state}
              picking={picking}
              level={level}
              attributes={attributes}
              box={box}
              filters={filters}
              onFilters={setFilters}
              onPlace={place}
              onClose={closePicker}
            />
          ) : null}
        </Step>

        <Step id="passo-set" number={5} title={t.set} t={t} optional hint={mode ? <p>{t.setSpiega(mode.name)}</p> : undefined}>
          <SetStep
            t={t}
            sets={template.sets}
            mode={mode}
            chosen={state.artifactSet}
            invalid={problems.some((problem) => problem.code === "set")}
            onChoose={(set) => update((before) => ({ ...before, artifactSet: set }))}
          />
          {stepMark("set")}
        </Step>

        <Step id="passo-guida" number={6} title={t.guida} t={t} optional hint={<p>{t.guidaSpiega}</p>}>
          <GuideStep
            t={t}
            state={state}
            level={level}
            problems={problems}
            attempted={attempted}
            mark={guideMark}
            onTitle={(title) => update((before) => ({ ...before, title }))}
            onNotes={(notes) => update((before) => ({ ...before, notes }))}
            onPhase={(index, text) =>
              update((before) => {
                const phases = [...before.phases];
                while (phases.length < index) phases.push("");
                phases[index] = text;
                return { ...before, phases };
              })
            }
            onExtra={(move) => update((before) => dropExtraPhases(before, level, (index) => t.faseN(index + 1), move))}
          />
        </Step>
      </div>

      <SubmitBar
        t={t}
        kind={kind}
        editing={editing}
        pending={pending}
        missing={missing}
        heroesMissing={state.team.length - heroCount}
        toFix={attempted ? shownProblems.length : 0}
        staysPublished={staysPublished}
      />
    </form>
  );
}

/** Il testo e' quello salvato? Come lo confronta l'azione: ripulito, fase per fase. */
function sameText(initial: StrategyDraft, state: EditorState, level: TemplateLevel | null): boolean {
  const phases = phasesFor(state, level).map(cleanText);
  return (
    cleanText(state.title).replace(/\s+/g, " ") === initial.title &&
    cleanText(state.notes) === initial.notes &&
    phases.length === initial.phases.length &&
    phases.every((phase, i) => phase === initial.phases[i])
  );
}

/** «Demone rosso · Inferno», per dire di quale scelta e' una bozza. */
function selectionLabel(template: StrategyTemplate, state: EditorState, t: Texts): string {
  const { mode, target, level } = resolve(template, state);
  if (!mode) return t.bozzaSenzaScelta;
  if (!target) return mode.name;
  return level ? `${target.name} · ${level.name}` : target.name;
}

/* ------------------------------------------------------------- la barra -- */

/**
 * La barra in fondo, sempre in vista: il tipo che si sta per pubblicare e il
 * pulsante. Ferma in fondo allo schermo finche' il modulo scorre, poi si posa
 * alla sua fine. Sul telefono sta sopra la barra del gioco (58px) e lascia a
 * destra il posto al pulsante «Su» (back-to-top.tsx), che compare dopo due
 * schermi; sopra i 1720px il «Su» cade fuori dalla colonna e il posto non serve.
 */
function SubmitBar({
  t,
  kind,
  editing,
  pending,
  missing,
  heroesMissing,
  toFix,
  staysPublished,
}: {
  t: Texts;
  kind: "team" | "guide";
  editing: boolean;
  pending: boolean;
  missing: readonly EditorProblem[];
  heroesMissing: number;
  toFix: number;
  staysPublished: boolean;
}) {
  const guide = kind === "guide";
  const label = pending
    ? t.invio
    : editing
      ? guide
        ? t.salvaGuida
        : t.salvaSquadra
      : guide
        ? t.mandaRevisione
        : t.pubblicaSquadra;
  const lacking = [
    missing.some((problem) => problem.code === "mode") ? t.mancaModalita : null,
    missing.some((problem) => problem.code === "target") ? t.mancaBersaglio : null,
    missing.some((problem) => problem.code === "level") ? t.mancaDifficolta : null,
    heroesMissing > 0 ? t.mancanoEroi(heroesMissing) : null,
  ].filter((item): item is string => !!item);

  return (
    <div className="sticky bottom-[calc(58px+env(safe-area-inset-bottom))] z-20 mt-10 max-lg:-mx-6 lg:bottom-0">
      <div
        className={cx(
          "border-t-2 border-brand bg-paper/95 py-3 backdrop-blur max-lg:pl-6 max-[1719px]:pr-[76px]",
          "lg:border-x lg:border-x-rule lg:bg-paper-2/95 lg:pl-4 min-[1720px]:pr-4",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="min-w-0 flex-1 basis-[230px]">
            <p aria-live="polite" className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
              <Tag tone={guide ? "gold" : "brand"}>{guide ? t.tipoGuida : t.tipoSquadra}</Tag>
              <span className="text-ink-2">— {guide ? (staysPublished ? t.guidaResta : t.guidaRevisione) : t.squadraSubito}</span>
            </p>
            {lacking.length > 0 ? (
              <p className="mt-1 mb-0 text-[12px] text-ink-3">{t.mancano(lacking.join(", "))}</p>
            ) : toFix > 0 ? (
              <p className="mt-1 mb-0 text-[12px] font-semibold text-hot">{t.daSistemare(toFix)}</p>
            ) : null}
          </div>
          <button type="submit" disabled={lacking.length > 0 || pending} className={buttonClass("primary")}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
