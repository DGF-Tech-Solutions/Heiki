"use client";

/**
 * Quello che le modalita' di «Indovina l'eroe» hanno in comune: la partita (eroe
 * del giorno o libera), il salvataggio dei tentativi del giorno nel browser, i
 * comandi, la casella di ricerca, gli aiuti che si sbloccano, la fine della
 * partita con la condivisione, e l'eroe di ieri.
 *
 * Nato dalla prima modalita' (hero-guess.tsx, gli indizi) quando l'utente ha
 * chiesto le altre di Loldle (carta, Unica, testo): quattro copie della stessa
 * partita avrebbero preso quattro strade al primo ritocco. Ogni modalita' ci
 * mette il suo: cosa si mostra da indovinare, e come si presentano i tentativi.
 *
 * Il giorno lo sa solo il browser (il fuso e' di chi gioca): sul server e al
 * primo disegno non c'e', e la casella si accende subito dopo.
 */

import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { IconCheck, IconClose } from "@/components/icons";
import { buttonClass, chipClass, cx, display, eyebrow, RadioChips } from "@/components/ui";
import {
  dailyAnswer,
  dayKey,
  previousDay,
  seedOf,
  VARIANT_LABELS,
  type GuessVariant,
  type HintKey,
} from "@/lib/games/hero-guess";
import { filterHeroes, heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi } from "@/lib/i18n/locale";

/** Quello che serve di un eroe per giocarlo: la voce del roster (nome, epiteto, ricerca nelle due lingue). */
export type Playable = HeroEntry;

export type GuessMode = "giorno" | "libera";

const TESTI = testi({
  it: {
    modalita: "Partita",
    modi: { giorno: "Eroe del giorno", libera: "Partita libera" },
    spiegaModo: {
      giorno: "Lo stesso eroe per tutti, fino a mezzanotte. I tentativi restano salvati in questo browser.",
      libera: "Un eroe a caso, quante partite vuoi.",
    },
    nuova: "Nuova partita",
    arrenditi: "Mostra la risposta",
    cerca: "Scrivi il nome di un eroe…",
    cercaEtichetta: "Il tuo tentativo",
    nessuno: "Nessun eroe con questo nome (o l'hai già provato).",
    tentativi: (n: number) => (n === 1 ? "1 tentativo" : `${n} tentativi`),
    aiuti: "Aiuti",
    fraTentativi: (n: number) => (n === 1 ? "tra 1 tentativo" : `tra ${n} tentativi`),
    mostra: "Mostra",
    vinto: (nome: string, n: number) => `Era ${nome}: indovinato in ${n === 1 ? "1 tentativo" : `${n} tentativi`}!`,
    arreso: (nome: string) => `Era ${nome}.`,
    scheda: "Scheda dell'eroe",
    condividi: "Copia il risultato",
    copiato: "Copiato!",
    condividiTesto: (modalita: string, giorno: string, n: number) =>
      `Heiki · Indovina l'eroe (${modalita}) · ${giorno}\nIndovinato in ${n === 1 ? "1 tentativo" : `${n} tentativi`}`,
    ieri: "L'eroe di ieri era",
    giusto: "giusto",
    sbagliato: "sbagliato",
  },
  en: {
    modalita: "Game",
    modi: { giorno: "Hero of the day", libera: "Free play" },
    spiegaModo: {
      giorno: "The same hero for everyone, until midnight. Your guesses stay saved in this browser.",
      libera: "A random hero, as many games as you like.",
    },
    nuova: "New game",
    arrenditi: "Show the answer",
    cerca: "Type a hero's name…",
    cercaEtichetta: "Your guess",
    nessuno: "No hero with this name (or you already tried it).",
    tentativi: (n: number) => (n === 1 ? "1 guess" : `${n} guesses`),
    aiuti: "Hints",
    fraTentativi: (n: number) => (n === 1 ? "in 1 guess" : `in ${n} guesses`),
    mostra: "Show",
    vinto: (nome: string, n: number) => `It was ${nome}: found in ${n === 1 ? "1 guess" : `${n} guesses`}!`,
    arreso: (nome: string) => `It was ${nome}.`,
    scheda: "Hero page",
    condividi: "Copy the result",
    copiato: "Copied!",
    condividiTesto: (modalita: string, giorno: string, n: number) =>
      `Heiki · Guess the Hero (${modalita}) · ${giorno}\nFound in ${n === 1 ? "1 guess" : `${n} guesses`}`,
    ieri: "Yesterday's hero was",
    giusto: "right",
    sbagliato: "wrong",
  },
});

/* ------------------------------------------------------ dati nel browser -- */

/** Il giorno di chi gioca; sul server null. Si ricontrolla ogni minuto, per la mezzanotte. */
function subscribeClock(notify: () => void): () => void {
  const timer = window.setInterval(notify, 60_000);
  return () => window.clearInterval(timer);
}

function useToday(): string | null {
  return useSyncExternalStore(subscribeClock, () => dayKey(new Date()), () => null);
}

const EVENT = "heiki:indovina";
const OLD_EVENT = "gachazone:indovina";
const memory = new Map<string, string>();
const parsed = new Map<string, { raw: string | null; value: readonly string[] }>();
const NONE: readonly string[] = [];

function readGuesses(key: string): readonly string[] {
  let raw: string | null = null;
  if (memory.has(key)) raw = memory.get(key)!;
  else {
    try {
      raw = window.localStorage.getItem(key) ?? window.localStorage.getItem(key.replace(/^heiki:/, "gachazone:"));
    } catch {
      raw = null;
    }
  }
  const cached = parsed.get(key);
  // lo stesso array finche' il testo non cambia: useSyncExternalStore lo pretende
  if (cached && cached.raw === raw) return cached.value;
  let value: readonly string[] = NONE;
  try {
    const data: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(data) && data.every((item) => typeof item === "string")) value = data;
  } catch {
    value = NONE;
  }
  parsed.set(key, { raw, value });
  return value;
}

function subscribeStorage(notify: () => void): () => void {
  window.addEventListener("storage", notify);
  window.addEventListener(EVENT, notify);
  window.addEventListener(OLD_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(EVENT, notify);
    window.removeEventListener(OLD_EVENT, notify);
  };
}

/** I tentativi dell'eroe del giorno, salvati nel browser (in memoria se il browser rifiuta). */
function useDailyGuesses(key: string | null): readonly [readonly string[], (next: readonly string[]) => void] {
  const guesses = useSyncExternalStore(
    subscribeStorage,
    () => (key ? readGuesses(key) : NONE),
    () => NONE,
  );
  const save = useCallback(
    (next: readonly string[]) => {
      if (!key) return;
      const raw = JSON.stringify(next);
      try {
        window.localStorage.setItem(key, raw);
        memory.delete(key);
      } catch {
        memory.set(key, raw);
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [guesses, save] as const;
}

/**
 * Dove si salvano i tentativi del giorno. La classica tiene la chiave di prima
 * delle altre modalita', per non perdere la partita di chi l'aveva cominciata.
 */
function storageKey(game: string, variant: GuessVariant, day: string): string {
  return variant === "classico" ? `heiki:${game}:indovina:${day}` : `heiki:${game}:indovina-${variant}:${day}`;
}

/* --------------------------------------------------------------- partita -- */

export interface GuessGame<T extends Playable> {
  readonly mode: GuessMode;
  readonly chooseMode: (mode: GuessMode) => void;
  readonly startFree: () => void;
  readonly giveUp: () => void;
  readonly today: string | null;
  readonly answer: T | undefined;
  readonly yesterday: T | undefined;
  /** i tentativi, dal primo */
  readonly guesses: readonly T[];
  readonly isRight: (hero: T) => boolean;
  readonly solved: boolean;
  readonly over: boolean;
  readonly wrong: number;
  /** un numero fisso per la partita: quale carta, dove ingrandirla */
  readonly seed: number;
  readonly guess: (hero: T) => void;
  /** chi si puo' provare */
  readonly pool: readonly T[];
  readonly revealed: readonly HintKey[];
  readonly reveal: (key: HintKey) => void;
}

/**
 * Lo stato di una partita. `accepts` dice se un tentativo e' la risposta: di
 * solito lo stesso eroe, ma nel testo dell'Unica due eroi con lo stesso testo
 * valgono tutti e due.
 */
export function useGuessGame<T extends Playable>({
  game,
  variant,
  heroes,
  accepts = (guess, answer) => guess.id === answer.id,
}: {
  game: string;
  variant: GuessVariant;
  heroes: readonly T[];
  accepts?: (guess: T, answer: T) => boolean;
}): GuessGame<T> {
  const byId = useMemo(() => new Map(heroes.map((hero) => [hero.id, hero])), [heroes]);
  const today = useToday();
  const [daily, saveDaily] = useDailyGuesses(today ? storageKey(game, variant, today) : null);

  const [mode, setMode] = useState<GuessMode>("giorno");
  const [free, setFree] = useState<{ answer: string; seed: number; guesses: readonly string[]; gaveUp: boolean } | null>(
    null,
  );
  const [shown, setShown] = useState<Readonly<Record<string, readonly HintKey[]>>>({});

  const todayHero = useMemo(() => (today ? dailyAnswer(heroes, today, variant) : undefined), [heroes, today, variant]);
  const yesterdayHero = useMemo(
    () => (today ? dailyAnswer(heroes, previousDay(today), variant) : undefined),
    [heroes, today, variant],
  );

  const answer = mode === "giorno" ? todayHero : free ? byId.get(free.answer) : undefined;
  const guessIds = mode === "giorno" ? daily : (free?.guesses ?? NONE);
  const guesses = guessIds.map((id) => byId.get(id)).filter((hero): hero is T => !!hero);
  const isRight = (hero: T) => !!answer && accepts(hero, answer);
  const solved = guesses.some(isRight);
  const over = solved || (mode === "libera" && !!free?.gaveUp);
  const gameKey = `${mode}:${mode === "giorno" ? today : free?.answer}`;

  // «Senza collaborazioni» c'era anche qui, e l'utente l'ha tolto: serviva solo al Randomizer
  function startFree() {
    const next = heroes[Math.floor(Math.random() * heroes.length)];
    if (next) setFree({ answer: next.id, seed: Math.floor(Math.random() * 2 ** 31), guesses: [], gaveUp: false });
  }

  return {
    mode,
    chooseMode: (next) => {
      setMode(next);
      if (next === "libera" && !free) startFree();
    },
    startFree,
    giveUp: () => free && setFree({ ...free, gaveUp: true }),
    today,
    answer,
    yesterday: mode === "giorno" ? yesterdayHero : undefined,
    guesses,
    isRight,
    solved,
    over,
    wrong: solved ? guesses.length - 1 : guesses.length,
    seed: mode === "giorno" ? seedOf(`${variant}:${today}:dettagli`) : (free?.seed ?? 0),
    guess: (hero) => {
      if (!answer || over || guessIds.includes(hero.id)) return;
      if (mode === "giorno") saveDaily([...daily, hero.id]);
      else if (free) setFree({ ...free, guesses: [...free.guesses, hero.id] });
    },
    pool: heroes,
    revealed: shown[gameKey] ?? [],
    reveal: (key) => setShown({ ...shown, [gameKey]: [...(shown[gameKey] ?? []), key] }),
  };
}

/* ------------------------------------------------------------------ pezzi -- */

/** I comandi: la partita (del giorno o libera) con la lama dei filtri, e i pulsanti della partita libera. */
export function GuessControls<T extends Playable>({ g }: { g: GuessGame<T> }) {
  const t = TESTI[useLocale()];
  return (
    <div className="flex max-w-[640px] flex-wrap items-center gap-x-5 gap-y-2.5 text-[13px]">
      <RadioChips
        legend={t.modalita}
        name="indovina-modalita"
        value={g.mode}
        onChange={g.chooseMode}
        options={(["giorno", "libera"] as const).map((value) => ({ value, label: t.modi[value] }))}
      />

      {g.mode === "libera" ? (
        <div className="ml-auto flex flex-wrap gap-2">
          {!g.over ? (
            <button type="button" onClick={g.giveUp} className={buttonClass("ghost", "sm")}>
              {t.arrenditi}
            </button>
          ) : null}
          <button type="button" onClick={g.startFree} className={buttonClass("primary", "sm")}>
            {t.nuova}
          </button>
        </div>
      ) : null}

      <p className="m-0 basis-full text-[13px] text-ink-2">{t.spiegaModo[g.mode]}</p>
    </div>
  );
}

/** La casella del tentativo, con i suggerimenti mentre si scrive (nomi ed epiteti nelle due lingue). */
export function GuessSearch<T extends Playable>({ game, g }: { game: string; g: GuessGame<T> }) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const tried = g.guesses;
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const done = new Set(tried.map((hero) => hero.id));
    return filterHeroes(
      g.pool.filter((hero) => !done.has(hero.id)),
      { search: query },
    ).slice(0, 8);
  }, [g.pool, tried, query]);

  if (g.over) return null;

  function choose(hero: T) {
    g.guess(hero);
    setQuery("");
    setActive(0);
    setOpen(false);
  }

  function onKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = suggestions[active] ?? suggestions[0];
      if (chosen) choose(chosen);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const listId = "indovina-suggerimenti";
  return (
    <div className="relative mt-5 max-w-[420px]">
      <label htmlFor="indovina-cerca" className="sr-only">
        {t.cercaEtichetta}
      </label>
      <input
        id="indovina-cerca"
        type="text"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && suggestions[active] ? `${listId}-${suggestions[active].id}` : undefined}
        autoComplete="off"
        disabled={!g.answer}
        value={query}
        placeholder={t.cerca}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKey}
        // la casella e' il gioco: la lama bianca della ricerca della griglia Eroi, e il
        // fuoco come filo rosso in basso (il contorno lo taglierebbe l'obliquo)
        className="p5-cut h-12 w-full border-0 bg-ink px-5 text-[15px] font-semibold text-paper placeholder:font-normal placeholder:text-paper/65 focus:shadow-[inset_0_-3px_0_var(--color-brand)] focus:outline-none disabled:opacity-50"
      />
      {open && query.trim() ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-20 m-0 mt-1 max-h-[360px] list-none overflow-y-auto border border-rule bg-paper-2 p-1 shadow-[5px_5px_0_#000]"
        >
          {suggestions.length === 0 ? (
            <li className="px-2 py-2 text-[13px] text-ink-3">{t.nessuno}</li>
          ) : (
            suggestions.map((hero, i) => (
              <li
                key={hero.id}
                id={`${listId}-${hero.id}`}
                role="option"
                aria-selected={i === active}
                // mousedown e non click: il click arriva dopo il blur, che chiude l'elenco
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(hero);
                }}
                onMouseEnter={() => setActive(i)}
                className={cx("flex cursor-pointer items-center gap-2.5 px-2 py-1.5", i === active && "bg-brand text-white")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte, come nella griglia Eroi */}
                <img src={heroCardSrc(game, hero.id)} alt="" width={36} height={36} />
                <span className="min-w-0">
                  <span className={cx("block truncate text-[12px]", i === active ? "text-white/85" : "text-ink-3")}>{heroEpithet(hero, locale)}</span>
                  <span className="block truncate font-display text-[13px] font-black uppercase [font-variation-settings:'wdth'_80]">
                    {heroName(hero, locale)}
                  </span>
                </span>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

/** La fine della partita: la risposta, la scheda, e il risultato da copiare (solo per l'eroe del giorno). */
export function GuessEnd<T extends Playable>({
  game,
  g,
  variant,
  grid,
}: {
  game: string;
  g: GuessGame<T>;
  variant: GuessVariant;
  /** i quadratini dei tentativi, per il risultato da condividere */
  grid: string;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [copied, setCopied] = useState<string | null>(null);
  const answer = g.answer;
  if (!g.over || !answer) return null;
  const copyKey = `${g.mode}:${answer.id}`;

  async function share() {
    if (!g.today) return;
    const day = new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "short" }).format(new Date(`${g.today}T12:00:00`));
    const text = `${t.condividiTesto(VARIANT_LABELS[variant][locale], day, g.guesses.length)}\n${grid}\n${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(copyKey);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section className="p5-corner mt-5 flex max-w-[640px] flex-wrap items-center gap-4 border border-rule border-t-[3px] border-t-brand bg-paper-2 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte, come nella griglia Eroi */}
      <img src={heroCardSrc(game, answer.id, 2)} alt="" width={96} height={96} className="shadow-[4px_4px_0_var(--color-brand)]" />
      <div className="min-w-0 flex-1 text-sm">
        <p className={cx(display, "m-0 text-[clamp(18px,2.4vw,22px)]")}>
          {g.solved ? t.vinto(heroName(answer, locale), g.guesses.length) : t.arreso(heroName(answer, locale))}
        </p>
        <p className="m-0 mt-0.5 text-[13px] text-ink-3">{heroEpithet(answer, locale)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/${game}/eroi/${answer.id}`} className={buttonClass("outline", "sm")}>
            {t.scheda}
          </Link>
          {g.mode === "giorno" && g.solved ? (
            <button type="button" onClick={share} className={buttonClass("primary", "sm")}>
              {copied === copyKey ? t.copiato : t.condividi}
            </button>
          ) : null}
          {g.mode === "libera" ? (
            <button type="button" onClick={g.startFree} className={buttonClass("primary", "sm")}>
              {t.nuova}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Gli aiuti: si sbloccano coi tentativi sbagliati, e si scoprono con un clic (o da soli a fine partita). */
export function GuessHints<T extends Playable>({
  g,
  items,
}: {
  g: GuessGame<T>;
  items: readonly { key: HintKey; after: number; label: string; content: React.ReactNode }[];
}) {
  const t = TESTI[useLocale()];
  if (!g.answer) return null;
  return (
    <section className="mt-5 max-w-[640px]">
      <h2 className={cx(eyebrow, "m-0")}>{t.aiuti}</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {items.map(({ key, after, label, content }) => {
          const unlocked = g.over || g.wrong >= after;
          const visible = g.over || g.revealed.includes(key);
          return (
            <div key={key} className="flex min-h-[72px] items-center gap-3 border border-rule bg-paper-2 p-3 text-[13px]">
              <div className="min-w-0 flex-1">
                <p className="m-0 text-ink-2">{label}</p>
                {!unlocked ? (
                  <p className="m-0 mt-0.5 text-[12px] text-ink-3">{t.fraTentativi(after - g.wrong)}</p>
                ) : visible ? (
                  <div className="mt-0.5 font-semibold text-ink">{content}</div>
                ) : (
                  <button type="button" onClick={() => g.reveal(key)} className={chipClass(false, false, "mt-1 border-0")}>
                    {t.mostra}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** I tentativi delle modalita' senza caselle: la card e il nome, rosso o verde, dal piu' recente. */
export function GuessList<T extends Playable>({ game, g }: { game: string; g: GuessGame<T> }) {
  const locale = useLocale();
  const t = TESTI[locale];
  if (g.guesses.length === 0) return null;
  return (
    <section className="mt-6 max-w-[640px]">
      <p className="m-0 mb-2 text-[13px] text-ink-2">{t.tentativi(g.guesses.length)}</p>
      <ol className="m-0 grid list-none gap-1.5 p-0">
        {[...g.guesses].reverse().map((hero, i) => {
          const right = g.isRight(hero);
          return (
            <li
              key={hero.id}
              className={cx(
                "flex items-center gap-3 border px-2 py-1.5 text-white",
                right ? "border-[#2f9a52] bg-[#237a3f]" : "border-[#a3333f] bg-[#7d2230]",
                i === 0 && "motion-safe:animate-[indovina-gira_0.45s_ease-out_both]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte, come nella griglia Eroi */}
              <img src={heroCardSrc(game, hero.id)} alt="" width={40} height={40} className="shrink-0" />
              <Link href={`/${game}/eroi/${hero.id}`} className="min-w-0 flex-1 hover:underline">
                <span className="block truncate text-[12px] opacity-80">{heroEpithet(hero, locale)}</span>
                <span className="block truncate text-[13px] font-semibold">{heroName(hero, locale)}</span>
              </Link>
              <span className="inline-flex shrink-0 items-center gap-1 text-[12px]">
                {right ? <IconCheck size={12} /> : <IconClose size={12} />}
                {right ? t.giusto : t.sbagliato}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** L'eroe di ieri, per l'eroe del giorno. */
export function GuessYesterday<T extends Playable>({ game, g }: { game: string; g: GuessGame<T> }) {
  const locale = useLocale();
  const t = TESTI[locale];
  if (!g.yesterday) return null;
  return (
    <p className="mt-6 text-[13px] text-ink-3">
      {t.ieri}{" "}
      <Link href={`/${game}/eroi/${g.yesterday.id}`} className="text-ink-2 underline decoration-rule underline-offset-2 hover:text-brand-deep">
        {heroName(g.yesterday, locale)} · {heroEpithet(g.yesterday, locale)}
      </Link>
    </p>
  );
}

/** Quanti tentativi, sopra la tabella della classica. */
export function guessCount(locale: "it" | "en", n: number): string {
  return TESTI[locale].tentativi(n);
}
