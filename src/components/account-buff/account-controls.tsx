"use client";

import Link from "next/link";
import { useId } from "react";
import { cx, numeric } from "@/components/ui";
import type { AccountSliderData } from "@/lib/games/account-buff-types";
import type { ManaMode } from "@/lib/games/account-buff";
import { EMPTY_SETUP, setupEffect, type AccountSetup } from "@/lib/games/account-setup";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    titolo: "Il tuo account",
    pagina: "Buff dell'account",
    valeOvunque: "Vale per tutte le schede: si salva in questo browser.",
    classe: "Classe dell'account",
    nessunTitolo: "sotto 500.000: nessun titolo",
    buff: (atk: string, def: string, hp: string) =>
      [atk && `Attacco +${atk}%`, def && `Difesa +${def}%`, hp && `PS +${hp}%`].filter(Boolean).join(" · "),
    soglia: (soglia: string) => `titolo da ${soglia}`,
    costellazioni: "Costellazioni",
    complete: (n: number) => (n === 0 ? "nessuna costellazione completa" : n === 1 ? "1 costellazione completa" : `${n} costellazioni complete`),
    fino: (nome: string) => `complete fino a: ${nome}`,
    pietreMana: "Pietre del mana",
    mana: { min: "minimo", avg: "medie", max: "massimo" } satisfies Record<ManaMode, string>,
    manaAiuto: "Il loro valore è casuale: medie vuol dire il valore atteso col Caos al livello 1.",
    personalizzate: "Scelte pietra per pietra nella pagina Buff dell'account.",
    tornaRapide: "usa le costellazioni complete",
    vecchie:
      "Le scelte pietra per pietra sono di dati vecchi: il gioco ha cambiato le costellazioni. Rifalle nella pagina Buff dell'account.",
    azzera: "Azzera l'account",
  },
  en: {
    titolo: "Your account",
    pagina: "Account Buffs",
    valeOvunque: "It applies to every hero page: it is saved in this browser.",
    classe: "Account Combat Class",
    nessunTitolo: "below 500,000: no title",
    buff: (atk: string, def: string, hp: string) =>
      [atk && `Attack +${atk}%`, def && `Defense +${def}%`, hp && `HP +${hp}%`].filter(Boolean).join(" · "),
    soglia: (soglia: string) => `${soglia} title`,
    costellazioni: "Constellations",
    complete: (n: number) => (n === 0 ? "no constellation completed" : n === 1 ? "1 constellation completed" : `${n} constellations completed`),
    fino: (nome: string) => `completed up to: ${nome}`,
    pietreMana: "Mana Stones",
    mana: { min: "minimum", avg: "average", max: "maximum" } satisfies Record<ManaMode, string>,
    manaAiuto: "Their value is random: average means the expected value with Chaos at level 1.",
    personalizzate: "Chosen stone by stone on the Account Buffs page.",
    tornaRapide: "use completed constellations",
    vecchie:
      "The stone-by-stone choices are from old data: the game changed the constellations. Redo them on the Account Buffs page.",
    azzera: "Reset the account",
  },
});

const MANA_MODES: readonly ManaMode[] = ["min", "avg", "max"];

const numero = (n: number, locale: Locale) => n.toLocaleString(intlLocale(locale), { useGrouping: "always" });

/**
 * I comandi del tuo account nello slider delle statistiche: la classe di
 * combattimento dell'account (uno slider sulle soglie dei titoli, e il numero da
 * scrivere) e le costellazioni (quante complete, come i Risvegli, e il valore
 * delle pietre del mana). Scelta dell'utente del 26/09: «gli switch devono
 * essere come lo slider livello e risveglio».
 *
 * Le costellazioni scelte pietra per pietra si fanno nella pagina «Buff
 * dell'account»; qui si vedono, e toccare le costellazioni rapide le sostituisce.
 */
export function AccountControls({
  data,
  setup,
  save,
  href,
  locale,
}: {
  data: AccountSliderData;
  setup: AccountSetup;
  save: (next: AccountSetup) => void;
  href: string;
  locale: Locale;
}) {
  const t = TESTI[locale];
  const id = useId();
  const effect = setupEffect(data, setup);
  const tier = effect.tier;
  // lo slider scorre sulle soglie: 0 e' «nessun titolo», N la soglia N
  const tierIndex = tier ? data.tiers.findIndex((entry) => entry.threshold === tier.threshold) + 1 : 0;
  const percent = (value: number) => (value ? value.toLocaleString(intlLocale(locale)) : "");
  const quick = !effect.custom;
  const completedName = setup.completed > 0 ? data.constellations[setup.completed - 1]?.name : undefined;

  const change = (patch: Partial<AccountSetup>) => save({ ...setup, ...patch });
  const quickChange = (patch: Partial<AccountSetup>) => save({ ...setup, ...patch, custom: null });

  return (
    <div className="grid gap-3 border-t border-rule pt-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-semibold text-ink">{t.titolo}</span>
        <Link href={href} className="text-[12px] text-brand underline-offset-2 hover:underline">
          {t.pagina} →
        </Link>
      </div>

      <div className="grid gap-1">
        {/* sotto i 640 px lo slider va su una riga sua: accanto al numero restava lungo due dita */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <label htmlFor={`${id}-classe`} className="text-ink-2">
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
              change({ power: index === 0 ? 0 : data.tiers[index - 1]!.threshold });
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
              if (event.target.value !== "" && Number.isFinite(value)) change({ power: Math.max(0, Math.round(value)) });
            }}
            className={cx(numeric, "w-[112px] rounded-[3px] border border-rule bg-paper px-2 py-1 text-right text-ink")}
          />
        </div>
        <p className="m-0 text-[12px] text-ink-3">
          {tier ? (
            <>
              <span className="text-ink-2">{t.buff(percent(tier.atk), percent(tier.def), percent(tier.hp))}</span>
              {" · "}
              {t.soglia(numero(tier.threshold, locale))}
            </>
          ) : (
            t.nessunTitolo
          )}
        </p>
      </div>

      <fieldset className="m-0 grid gap-1.5 border-0 p-0">
        <legend className="float-left mb-1 p-0 text-ink-2">{t.costellazioni}</legend>
        <div className="clear-both flex flex-wrap items-center gap-1">
          {Array.from({ length: data.constellations.length + 1 }, (_, n) => {
            const constellation = n > 0 ? data.constellations[n - 1] : undefined;
            const lit = quick && n <= setup.completed;
            return (
              <label key={n} className="cursor-pointer" title={constellation ? constellation.name : t.complete(0)}>
                <input
                  type="radio"
                  name={`${id}-costellazioni`}
                  value={n}
                  checked={quick && setup.completed === n}
                  onChange={() => quickChange({ completed: n })}
                  className="peer sr-only"
                />
                <span className="sr-only">{constellation ? t.fino(constellation.name) : t.complete(0)}</span>
                <span
                  aria-hidden
                  className={cx(
                    "grid h-8 w-8 place-items-center rounded-[3px] border peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                    quick && setup.completed === n ? "border-brand bg-brand-soft" : "border-transparent",
                    n === 0 && cx(numeric, "border-rule text-[12px]", quick && setup.completed === 0 ? "text-ink" : "text-ink-3"),
                  )}
                >
                  {n === 0 ? (
                    "0"
                  ) : constellation?.symbol ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={constellation.symbol}
                      alt=""
                      width={140}
                      height={140}
                      className={cx("h-7 w-7 object-contain transition-opacity", !lit && "opacity-25")}
                    />
                  ) : (
                    <span className={cx(numeric, "text-[12px]", lit ? "text-ink" : "text-ink-3")}>{n}</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
        {quick ? (
          <p className="m-0 text-[12px] text-ink-3">
            {completedName ? `${t.complete(setup.completed)} · ${t.fino(completedName)}` : t.complete(0)}
          </p>
        ) : null}
      </fieldset>

      {quick ? (
        <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0" disabled={setup.completed === 0}>
          <legend className="float-left mr-3 p-0 text-ink-2">{t.pietreMana}</legend>
          <div className="flex items-center gap-1">
            {MANA_MODES.map((mode) => (
              <label key={mode} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-mana`}
                  value={mode}
                  checked={setup.mana === mode}
                  onChange={() => change({ mana: mode })}
                  className="peer sr-only"
                />
                <span
                  className={cx(
                    "inline-block rounded-[3px] border px-2 py-1 text-[12px] peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
                    setup.mana === mode ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3",
                  )}
                >
                  {t.mana[mode]}
                </span>
              </label>
            ))}
          </div>
          <span className="basis-full text-[12px] text-ink-3">{t.manaAiuto}</span>
        </fieldset>
      ) : (
        <p className="m-0 text-[12px] text-ink-2">
          {t.personalizzate}{" "}
          <button type="button" onClick={() => quickChange({})} className="text-brand hover:underline">
            {t.tornaRapide}
          </button>
        </p>
      )}

      {effect.stale ? <p className="m-0 text-[12px] text-ink-2">{t.vecchie}</p> : null}

      <p className="m-0 text-[12px] text-ink-3">
        {t.valeOvunque}
        {effect.active || setup.custom ? (
          <>
            {" "}
            <button type="button" onClick={() => save(EMPTY_SETUP)} className="text-brand hover:underline">
              {t.azzera}
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
