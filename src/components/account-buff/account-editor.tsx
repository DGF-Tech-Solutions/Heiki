"use client";

import { useId, useMemo, useState } from "react";
import { useAccountSetup } from "@/components/account-buff/use-account-setup";
import { cx, numeric } from "@/components/ui";
import type {
  AccountStatKey,
  Constellation,
  ManaGroup,
  StatBag,
  StoneColor,
} from "@/lib/games/account-buff-types";
import {
  STAT_ORDER,
  activateStone,
  customTotals,
  deactivateStone,
  isComplete,
  manaAverage,
  manaRange,
  manaValue,
  tierFor,
  type ManaMode,
} from "@/lib/games/account-buff";
import { EMPTY_SETUP, type AccountSetup } from "@/lib/games/account-setup";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    classe: "Classe dell'account",
    nessunTitolo: "sotto 500.000: nessun titolo",
    soglia: (soglia: string) => `titolo da ${soglia}`,
    costellazioni: "Costellazioni",
    completa: "completa",
    pietre: (attive: number, tutte: number) => `${attive} pietre su ${tutte}`,
    punti: (spesi: string, tutti: string) => `${spesi} Punti Crescita su ${tutti}`,
    attivaTutta: "Attiva tutta",
    svuota: "Svuota",
    fino: "Complete fino a questa",
    mappaAiuto:
      "Tocca una pietra per attivarla: si attivano anche quelle prima di lei, fino alla partenza, come nel gioco. Tocca una pietra attiva per spegnerla, insieme a quelle dopo.",
    dopo: (nome: string) => `Nel gioco si apre dopo aver completato ${nome}.`,
    questaDa: "Questa costellazione",
    bonus: "Bonus di completamento",
    nonCompleta: "si ottiene completandola",
    pietreMana: "Pietre del mana",
    manaAiuto:
      "Il valore di ognuna è casuale nel suo intervallo, e il Caos lo ritira. Scegli il tuo, o metti tutte le pietre allo stesso punto.",
    tutteA: "Tutte:",
    mana: { min: "al minimo", avg: "nella media", max: "al massimo" } satisfies Record<ManaMode, string>,
    nessunaMana: "Nessuna pietra del mana attivata in questa costellazione.",
    totali: "Cosa aggiungono a ogni eroe",
    totaliAiuto:
      "Tutte le costellazioni insieme: si sommano alle statistiche in battaglia, dopo la percentuale del titolo. Le schede degli eroi usano questi numeri.",
    niente: "Ancora niente: nessuna pietra attivata.",
    azzera: "Azzera l'account",
    salvato: "Salvato in questo browser: vale anche nelle schede degli eroi.",
    vecchie: "Le scelte salvate erano di dati vecchi: si riparte dalle costellazioni complete.",
    partenza: "Partenza",
  },
  en: {
    classe: "Account Combat Class",
    nessunTitolo: "below 500,000: no title",
    soglia: (soglia: string) => `${soglia} title`,
    costellazioni: "Constellations",
    completa: "complete",
    pietre: (attive: number, tutte: number) => `${attive} of ${tutte} stones`,
    punti: (spesi: string, tutti: string) => `${spesi} of ${tutti} Growth Points`,
    attivaTutta: "Activate all",
    svuota: "Clear",
    fino: "Complete up to this one",
    mappaAiuto:
      "Tap a stone to activate it: the ones before it activate too, back to the start, as in the game. Tap an active stone to turn it off, along with the ones after it.",
    dopo: (nome: string) => `In the game it opens after completing ${nome}.`,
    questaDa: "This constellation",
    bonus: "Completion bonus",
    nonCompleta: "earned by completing it",
    pietreMana: "Mana Stones",
    manaAiuto:
      "Each one's value is random within its range, and Chaos rerolls it. Pick yours, or set all the stones to the same point.",
    tutteA: "All:",
    mana: { min: "at minimum", avg: "average", max: "at maximum" } satisfies Record<ManaMode, string>,
    nessunaMana: "No Mana Stone activated in this constellation.",
    totali: "What they add to every hero",
    totaliAiuto:
      "All constellations together: they add to the stats in battle, after the title's percentage. The hero pages use these numbers.",
    niente: "Nothing yet: no stone activated.",
    azzera: "Reset the account",
    salvato: "Saved in this browser: it applies to the hero pages too.",
    vecchie: "The saved choices were from old data: starting again from completed constellations.",
    partenza: "Start",
  },
});

/** Quello che la pagina passa all'editor, gia' nella lingua della pagina. */
export interface EditorData {
  readonly version: string;
  readonly tiers: readonly { threshold: number; atk: number; def: number; hp: number }[];
  readonly constellations: readonly (Constellation & {
    readonly label: string;
    /** il nome breve, per le schede delle costellazioni */
    readonly short: string;
    readonly symbolSrc: string | null;
  })[];
  readonly mana: Readonly<Record<string, ManaGroup>>;
  readonly stats: Readonly<Record<AccountStatKey, { name: string; percent: boolean }>>;
  readonly stoneNames: Readonly<Record<StoneColor, string>>;
  readonly manaNames: Readonly<Record<StoneColor, string>>;
  /** le immagini delle pietre: rossa, blu, verde e le tre del mana */
  readonly stoneSrc: Readonly<Record<StoneColor, string | null>>;
  readonly manaSrc: Readonly<Record<StoneColor, string | null>>;
}

const numero = (n: number, locale: Locale, decimals = 2) =>
  n.toLocaleString(intlLocale(locale), { useGrouping: "always", maximumFractionDigits: decimals });

const MANA_MODES: readonly ManaMode[] = ["min", "avg", "max"];

/** Lo stato delle pietre da un account salvato: pietra per pietra se c'e', se no le prime N complete. */
function stateFrom(data: EditorData, setup: AccountSetup) {
  if (setup.custom && setup.custom.version === data.version) {
    return { active: new Set(setup.custom.stones), mana: { ...setup.custom.mana }, stale: false };
  }
  const active = new Set<number>();
  const mana: Record<string, number> = {};
  for (const constellation of data.constellations.slice(0, setup.completed)) {
    for (const stone of constellation.stones) {
      active.add(stone.id);
      const group = stone.mana ? data.mana[stone.mana] : undefined;
      if (group) mana[String(stone.id)] = modeValue(group, setup.mana);
    }
  }
  return { active, mana, stale: setup.custom !== null };
}

function modeValue(group: ManaGroup, mode: ManaMode): number {
  if (mode === "min") return manaRange(group).min;
  if (mode === "max") return manaRange(group).max;
  return manaAverage(group);
}

/**
 * L'editor del tuo account nella pagina «Buff dell'account»: la classe
 * dell'account, e le costellazioni pietra per pietra (scelta dell'utente del
 * 26/09), sulla mappa del gioco. Salva nel browser lo stesso account che legge lo
 * slider di ogni scheda eroe, con i totali gia' sommati.
 */
export function AccountEditor({ game, data }: { game: string; data: EditorData }) {
  const locale = useLocale();
  const t = TESTI[locale];
  const id = useId();
  const [setup, save] = useAccountSetup(game);
  const [selected, setSelected] = useState(0);
  const state = useMemo(() => stateFrom(data, setup), [data, setup]);
  const constellation = data.constellations[selected]!;

  const totals = useMemo(() => customTotals(data, state.active, state.mana), [data, state]);
  const tier = tierFor(data.tiers, setup.power);
  const tierIndex = tier ? data.tiers.findIndex((entry) => entry.threshold === tier.threshold) + 1 : 0;

  /** ogni modifica delle pietre diventa una scelta pietra per pietra, coi totali per le schede */
  const saveStones = (active: ReadonlySet<number>, mana: Readonly<Record<string, number>>) => {
    // solo i valori delle pietre del mana attivate: le altre non contano
    const kept = Object.fromEntries(Object.entries(mana).filter(([stone]) => active.has(Number(stone))));
    save({
      ...setup,
      custom: {
        version: data.version,
        stones: [...active].sort((a, b) => a - b),
        mana: kept,
        totals: customTotals(data, active, kept),
      },
    });
  };

  const toggle = (stoneId: number) => {
    const stone = constellation.stones.find((entry) => entry.id === stoneId);
    if (!stone || stone.kind === "start") return;
    const next = state.active.has(stoneId)
      ? deactivateStone(constellation, stoneId, state.active)
      : activateStone(constellation, stoneId, state.active);
    saveStones(next, state.mana);
  };

  const setMap = (index: number, on: boolean) => {
    const next = new Set(state.active);
    for (const stone of data.constellations[index]!.stones) {
      if (on) next.add(stone.id);
      else next.delete(stone.id);
    }
    saveStones(next, state.mana);
  };

  const completeUpTo = (index: number) => {
    const next = new Set<number>();
    data.constellations.slice(0, index + 1).forEach((c) => c.stones.forEach((stone) => next.add(stone.id)));
    saveStones(next, state.mana);
  };

  const manaStones = constellation.stones.filter((stone) => stone.kind === "mana");
  const setManaAll = (mode: ManaMode) => {
    const mana = { ...state.mana };
    for (const stone of manaStones) {
      const group = stone.mana ? data.mana[stone.mana] : undefined;
      if (group) mana[String(stone.id)] = modeValue(group, mode);
    }
    saveStones(state.active, mana);
  };

  const mapTotals = customTotals({ constellations: [constellation], mana: data.mana }, state.active, state.mana);
  const complete = isComplete(constellation, state.active);
  const activeCount = constellation.stones.filter((stone) => stone.kind !== "start" && state.active.has(stone.id)).length;
  const allCount = constellation.stones.filter((stone) => stone.kind !== "start").length;
  const spent = constellation.stones.reduce(
    (sum, stone) => sum + (stone.kind !== "start" && state.active.has(stone.id) ? stone.growthPoints : 0),
    0,
  );
  const previous = constellation.after ? data.constellations.find((c) => c.id === constellation.after) : undefined;
  const previousIncomplete = previous ? !isComplete(previous, state.active) : false;

  return (
    <div className="grid gap-5">
      {/* classe dell'account */}
      <div className="grid max-w-[640px] gap-1 rounded-card border border-rule bg-paper-2 p-4 text-[13px]">
        {/* sotto i 640 px lo slider va su una riga sua: accanto al numero restava lungo due dita */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <label htmlFor={`${id}-classe`} className="font-semibold text-ink">
            {t.classe}
          </label>
          <input
            id={`${id}-classe`}
            type="range"
            min={0}
            max={data.tiers.length}
            step={1}
            value={tierIndex}
            aria-valuetext={tier ? numero(tier.threshold, locale) : t.nessunTitolo}
            onChange={(event) => {
              const index = Number(event.target.value);
              save({ ...setup, power: index === 0 ? 0 : data.tiers[index - 1]!.threshold });
            }}
            className="order-last col-span-2 w-full min-w-0 accent-[var(--color-brand)] sm:order-none sm:col-span-1"
          />
          <input
            type="number"
            min={0}
            step={500000}
            value={setup.power}
            aria-label={t.classe}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (event.target.value !== "" && Number.isFinite(value)) save({ ...setup, power: Math.max(0, Math.round(value)) });
            }}
            className={cx(numeric, "w-[112px] rounded-[3px] border border-rule bg-paper px-2 py-1 text-right text-ink")}
          />
        </div>
        <p className="m-0 text-[12px] text-ink-3">
          {tier ? (
            <>
              <span className="text-ink-2">
                {[
                  tier.atk ? `${data.stats.atk.name} +${numero(tier.atk, locale)}%` : "",
                  tier.def ? `${data.stats.def.name} +${numero(tier.def, locale)}%` : "",
                  tier.hp ? `${data.stats.hp.name} +${numero(tier.hp, locale)}%` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              {" · "}
              {t.soglia(numero(tier.threshold, locale))}
            </>
          ) : (
            t.nessunTitolo
          )}
        </p>
      </div>

      {/* le undici mappe */}
      <div>
        <h3 className="m-0 mb-2 text-[15px] font-semibold">{t.costellazioni}</h3>
        {state.stale ? <p className="m-0 mb-2 text-[12px] text-ink-2">{t.vecchie}</p> : null}
        <div role="tablist" aria-label={t.costellazioni} className="flex flex-wrap gap-1.5">
          {data.constellations.map((c, index) => {
            const done = isComplete(c, state.active);
            const count = c.stones.filter((stone) => stone.kind !== "start" && state.active.has(stone.id)).length;
            const all = c.stones.length - 1;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={index === selected}
                onClick={() => setSelected(index)}
                title={c.label}
                className={cx(
                  "grid w-[76px] justify-items-center gap-0.5 rounded-[3px] border px-1 py-1.5 text-[11px] leading-tight",
                  index === selected ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3 hover:text-ink-2",
                )}
              >
                {c.symbolSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={c.symbolSrc}
                    alt=""
                    width={140}
                    height={140}
                    className={cx("h-9 w-9 object-contain", count === 0 && "opacity-30")}
                  />
                ) : null}
                <span className="line-clamp-2 text-center">{c.short}</span>
                <span className={cx(numeric, done ? "text-brand" : "")}>
                  {done ? t.completa : `${Math.round((count / all) * 100)}%`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {/* su un telefono la mappa intera fa pietre di dieci pixel: tiene una larghezza
              minima e scorre di lato nel suo riquadro, senza allargare la pagina */}
          <div className="overflow-x-auto">
            <StoneMap
              constellation={constellation}
              active={state.active}
              data={data}
              locale={locale}
              onToggle={toggle}
              startLabel={t.partenza}
            />
          </div>
          <p className="mt-2 max-w-[70ch] text-[12px] text-ink-3">{t.mappaAiuto}</p>
          {previous && previousIncomplete ? (
            <p className="mt-1 max-w-[70ch] text-[12px] text-ink-2">{t.dopo(previous.label)}</p>
          ) : null}
        </div>

        <div className="grid min-w-0 gap-4 text-[13px]">
          <div className="rounded-card border border-rule bg-paper-2 p-3.5">
            <p className="m-0 font-semibold text-ink">{constellation.label}</p>
            <p className="m-0 mt-0.5 text-[12px] text-ink-3">
              {t.pietre(activeCount, allCount)} · {t.punti(numero(spent, locale), numero(constellation.growthPoints, locale))}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
              <button type="button" onClick={() => setMap(selected, true)} className="text-brand hover:underline">
                {t.attivaTutta}
              </button>
              <button type="button" onClick={() => setMap(selected, false)} className="text-brand hover:underline">
                {t.svuota}
              </button>
              <button type="button" onClick={() => completeUpTo(selected)} className="text-brand hover:underline">
                {t.fino}
              </button>
            </div>
            <StatList bag={mapTotals} data={data} locale={locale} className="mt-2.5" />
            <p className="m-0 mt-2.5 text-[12px] text-ink-2">
              <span className="text-ink">{t.bonus}</span>
              {complete ? "" : ` (${t.nonCompleta})`}:{" "}
              {[
                constellation.completion.atk ? `${data.stats.atk.name} +${numero(constellation.completion.atk, locale)}` : "",
                constellation.completion.def ? `${data.stats.def.name} +${numero(constellation.completion.def, locale)}` : "",
                constellation.completion.hp ? `${data.stats.hp.name} +${numero(constellation.completion.hp, locale)}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <div className="rounded-card border border-rule bg-paper-2 p-3.5">
            <p className="m-0 font-semibold text-ink">{t.pietreMana}</p>
            <p className="m-0 mt-0.5 text-[12px] text-ink-3">{t.manaAiuto}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]">
              <span className="text-ink-3">{t.tutteA}</span>
              {MANA_MODES.map((mode) => (
                <button key={mode} type="button" onClick={() => setManaAll(mode)} className="text-brand hover:underline">
                  {t.mana[mode]}
                </button>
              ))}
            </div>
            {manaStones.some((stone) => state.active.has(stone.id)) ? (
              <ul className="m-0 mt-2 grid list-none gap-1.5 p-0">
                {manaStones
                  .filter((stone) => state.active.has(stone.id))
                  .map((stone) => {
                    const group = data.mana[stone.mana!]!;
                    const range = manaRange(group);
                    const value = manaValue(group, state.mana[String(stone.id)]);
                    const stat = data.stats[stone.stat!];
                    return (
                      <li key={stone.id} className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-2">
                        {stone.color && data.manaSrc[stone.color] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={data.manaSrc[stone.color]!} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                        ) : (
                          <span />
                        )}
                        <input
                          type="range"
                          min={range.min}
                          max={range.max}
                          step={1}
                          value={Math.round(value)}
                          aria-label={`${stat.name} ${stone.id}`}
                          onChange={(event) =>
                            saveStones(state.active, { ...state.mana, [String(stone.id)]: Number(event.target.value) })
                          }
                          className="w-full min-w-0 accent-[var(--color-brand)]"
                        />
                        <span className={cx(numeric, "w-[88px] text-right text-[12px] text-ink-2")}>
                          {stat.name} +{numero(value, locale, 0)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p className="m-0 mt-2 text-[12px] text-ink-3">{t.nessunaMana}</p>
            )}
          </div>
        </div>
      </div>

      {/* i totali di tutte le costellazioni */}
      <div className="max-w-[640px] rounded-card border border-rule p-4 text-[13px]">
        <p className="m-0 font-semibold text-ink">{t.totali}</p>
        <p className="m-0 mt-0.5 text-[12px] text-ink-3">{t.totaliAiuto}</p>
        {Object.keys(totals).length ? (
          <StatList bag={totals} data={data} locale={locale} className="mt-2.5" />
        ) : (
          <p className="m-0 mt-2.5 text-ink-3">{t.niente}</p>
        )}
        <p className="m-0 mt-3 text-[12px] text-ink-3">
          {t.salvato}{" "}
          <button type="button" onClick={() => save(EMPTY_SETUP)} className="text-brand hover:underline">
            {t.azzera}
          </button>
        </p>
      </div>
    </div>
  );
}

/** Un insieme di statistiche, nell'ordine della schermata del gioco. */
function StatList({
  bag,
  data,
  locale,
  className,
}: {
  bag: StatBag;
  data: EditorData;
  locale: Locale;
  className?: string;
}) {
  const keys = STAT_ORDER.filter((key) => bag[key]);
  if (!keys.length) return null;
  return (
    <dl className={cx("m-0 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 text-[13px]", className)}>
      {keys.map((key) => (
        <div key={key} className="contents">
          <dt className="text-ink-2">{data.stats[key].name}</dt>
          <dd className={cx(numeric, "m-0 text-right font-medium")}>
            {/* Attacco, Difesa e PS con le pietre del mana nella media hanno decimali: in pagina interi */}
            +{numero(bag[key]!, locale, data.stats[key].percent ? 2 : 0)}
            {data.stats[key].percent ? "%" : ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * La mappa di una costellazione come nel gioco: le pietre alle posizioni del
 * prefab (la y del gioco va verso l'alto, quella dello schermo verso il basso), le
 * linee da ogni pietra alla sua madre. Le pietre spente restano visibili, piu'
 * chiare: si vede cosa manca.
 */
function StoneMap({
  constellation,
  active,
  data,
  locale,
  onToggle,
  startLabel,
}: {
  constellation: EditorData["constellations"][number];
  active: ReadonlySet<number>;
  data: EditorData;
  locale: Locale;
  onToggle: (id: number) => void;
  startLabel: string;
}) {
  const stones = constellation.stones;
  const pad = 36;
  const xs = stones.map((stone) => stone.x);
  const ys = stones.map((stone) => -stone.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const width = Math.max(...xs) - Math.min(...xs) + 2 * pad;
  const height = Math.max(...ys) - Math.min(...ys) + 2 * pad;
  const byId = new Map(stones.map((stone) => [stone.id, stone]));

  const describe = (stone: (typeof stones)[number]) => {
    if (stone.kind === "start" || !stone.stat) return startLabel;
    const stat = data.stats[stone.stat];
    if (stone.kind === "mana" && stone.mana && data.mana[stone.mana]) {
      const range = manaRange(data.mana[stone.mana]!);
      const name = stone.color ? data.manaNames[stone.color] : "";
      return `${name}: ${stat.name} ${numero(range.min, locale)}-${numero(range.max, locale)}`;
    }
    const name = stone.color ? data.stoneNames[stone.color] : "";
    return `${name}: ${stat.name} +${numero(stone.value ?? 0, locale)}${stat.percent ? "%" : ""}`;
  };

  return (
    <svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="block h-auto w-full min-w-[540px] max-w-[680px] rounded-card border border-rule bg-[#0f1020]"
      role="group"
      aria-label={constellation.label}
    >
      {stones.map((stone) => {
        const mother = stone.mother !== null ? byId.get(stone.mother) : undefined;
        if (!mother) return null;
        const on = active.has(stone.id);
        return (
          <line
            key={`l${stone.id}`}
            x1={mother.x}
            y1={-mother.y}
            x2={stone.x}
            y2={-stone.y}
            stroke={on ? "#c9b98a" : "#3a3d5c"}
            strokeWidth={on ? 2 : 1.5}
          />
        );
      })}
      {stones.map((stone) => {
        const on = stone.kind === "start" || active.has(stone.id);
        const size = stone.kind === "mana" ? 34 : stone.kind === "start" ? 14 : 18;
        const src = stone.color ? (stone.kind === "mana" ? data.manaSrc[stone.color] : data.stoneSrc[stone.color]) : null;
        const label = describe(stone);
        const interactive = stone.kind !== "start";
        return (
          <g
            key={stone.id}
            transform={`translate(${stone.x} ${-stone.y})`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-pressed={interactive ? on : undefined}
            aria-label={label}
            onClick={interactive ? () => onToggle(stone.id) : undefined}
            onKeyDown={
              interactive
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onToggle(stone.id);
                    }
                  }
                : undefined
            }
            className={cx(interactive && "cursor-pointer outline-none [&:focus-visible>circle]:stroke-[#ffd66b]")}
            opacity={on ? 1 : 0.3}
          >
            <title>{label}</title>
            {/* un cerchio sotto: allarga il bersaglio del tocco e segna il fuoco */}
            <circle r={size / 2 + 4} fill="transparent" stroke="transparent" strokeWidth={2} />
            {src ? (
              <image href={src} x={-size / 2} y={-size / 2} width={size} height={size} preserveAspectRatio="xMidYMid meet" />
            ) : (
              <circle r={size / 2} fill={stone.kind === "start" ? "#ffd66b" : "#8888aa"} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
