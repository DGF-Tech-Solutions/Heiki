"use client";

import { useId, useState } from "react";
import { cx, numeric } from "@/components/ui";
import { clampSelection, maxSelection, statsAt, type StatSelection } from "@/lib/games/hero-stats";
import type { HeroStatSteps } from "@/lib/games/types";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi, type Bilingual, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    livello: "Livello",
    risveglio: "Risveglio",
    superRisveglio: "Super risveglio",
    risvegli: (n: number) => (n === 0 ? "nessun Risveglio" : n === 1 ? "1 Risveglio" : `${n} Risvegli`),
    superRisvegli: (n: number) =>
      n === 0 ? "nessun Super risveglio" : n === 1 ? "1 Super risveglio" : `${n} Super risvegli`,
    dopoIlSesto: "si sblocca col sesto Risveglio",
    reliquia: "Reliquia sacra, coi tre potenziamenti",
    costumi: "Costumi: i cinque migliori per tipo, al massimo",
    tuttoAlMassimo: "Tutto al massimo",
  },
  en: {
    livello: "Level",
    risveglio: "Awakening",
    superRisveglio: "Super Awakening",
    risvegli: (n: number) => (n === 0 ? "no Awakening" : n === 1 ? "1 Awakening" : `${n} Awakenings`),
    superRisvegli: (n: number) =>
      n === 0 ? "no Super Awakening" : n === 1 ? "1 Super Awakening" : `${n} Super Awakenings`,
    dopoIlSesto: "unlocks with the sixth Awakening",
    reliquia: "Holy Relic, with its three enhancements",
    costumi: "Costumes: the five best of each type, fully enhanced",
    tuttoAlMassimo: "Everything maxed",
  },
});

/**
 * Le righe della tabella: le cinque che si guardano davvero.
 *
 * La sesta, "Potenza combattimento" (`fPower`), e' stata tolta il 26/09: era il
 * solo bonus del Vero risveglio, 1.500 per tutti gli eroi, e scritta cosi'
 * sembrava la classe di combattimento dell'eroe, che nel gioco vale decine di
 * migliaia e si calcola con una formula che il client non espone.
 */
const ROWS: readonly { key: string; label: Bilingual; percent?: boolean }[] = [
  { key: "atk", label: { it: "Attacco", en: "Attack" } },
  { key: "def", label: { it: "Difesa", en: "Defense" } },
  { key: "hp", label: { it: "Salute", en: "HP" } },
  { key: "critPer", label: { it: "Tasso critico", en: "Crit Chance" }, percent: true },
  { key: "critAtkPer", label: { it: "Danno critico", en: "Crit Damage" }, percent: true },
];

/**
 * `useGrouping: "always"` e non il default: in italiano il raggruppamento
 * automatico salta i numeri di quattro cifre, e nella stessa colonna uscivano
 * `7412` e `10.002`.
 */
const numero = (n: number, locale: Locale) =>
  n.toLocaleString(intlLocale(locale), { useGrouping: "always" });

const SAME = (a: StatSelection, b: StatSelection) =>
  a.level === b.level &&
  a.awaken === b.awaken &&
  a.superAwaken === b.superAwaken &&
  a.relic === b.relic &&
  a.costumes === b.costumes;

/**
 * Le statistiche dell'eroe a un livello qualunque, con quanti Risvegli e Super
 * risvegli ha fatto, con o senza reliquia e costumi.
 *
 * E' l'unico pezzo della scheda che gira nel browser, e porta con se' solo i
 * pezzi di QUESTO eroe (un paio di centinaia di numeri): la somma la fa
 * `statsAt`, la stessa con cui l'import controlla che i pezzi ridiano il
 * massimo. Parte da tutto al massimo, cioe' dai numeri che la scheda mostrava
 * prima, e il primo disegno sul server e' gia' quello.
 *
 * I Super risvegli si fanno solo a Risveglio completo, come nel gioco: prima
 * restano spenti, invece di permettere una combinazione che non esiste.
 */
export function StatSlider({
  steps,
  max,
  starSrc,
}: {
  steps?: HeroStatSteps;
  /** senza `steps` la tabella resta quella del massimo, senza comandi */
  max: Readonly<Record<string, number>>;
  /** la stella dei ranghi del gioco; senza, un ★ disegnato col testo */
  starSrc?: string;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const id = useId();
  const [chosen, setChosen] = useState<StatSelection | null>(() => (steps ? maxSelection(steps) : null));

  const selection = steps && chosen ? clampSelection(steps, chosen) : null;
  const values = steps && selection ? statsAt(steps, selection) : max;
  const change = (patch: Partial<StatSelection>) =>
    setChosen((current) => (steps && current ? clampSelection(steps, { ...current, ...patch }) : current));
  const atMax = steps && selection ? SAME(selection, maxSelection(steps)) : true;

  return (
    <div className="max-w-[560px]">
      {steps && selection ? (
        <div className="mb-4 grid gap-3 rounded-card border border-rule bg-paper-2 p-4 text-[13px]">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <label htmlFor={`${id}-livello`} className="text-ink-2">
              {t.livello}
            </label>
            <input
              id={`${id}-livello`}
              type="range"
              min={1}
              max={steps.maxLevel}
              step={1}
              value={selection.level}
              onChange={(event) => change({ level: Number(event.target.value) })}
              className="w-full min-w-0 accent-[var(--color-brand)]"
            />
            <input
              type="number"
              min={1}
              max={steps.maxLevel}
              value={selection.level}
              aria-label={t.livello}
              onChange={(event) => {
                if (event.target.value !== "") change({ level: Number(event.target.value) });
              }}
              className={cx(
                numeric,
                "w-16 rounded-[3px] border border-rule bg-paper px-2 py-1 text-right text-ink",
              )}
            />
          </div>

          <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
            <legend className="float-left mr-3 p-0 text-ink-2">{t.risveglio}</legend>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: steps.awaken.length + 1 }, (_, n) => (
                <label key={n} className="cursor-pointer" title={t.risvegli(n)}>
                  <input
                    type="radio"
                    name={`${id}-risveglio`}
                    value={n}
                    checked={selection.awaken === n}
                    onChange={() => change({ awaken: n })}
                    className="peer sr-only"
                  />
                  <span className="sr-only">{t.risvegli(n)}</span>
                  <span
                    aria-hidden
                    className={cx(
                      "grid h-7 min-w-7 place-items-center rounded-[3px] px-1 peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                      // lo zero e' un riquadro come i pulsanti del Super risveglio:
                      // scelto, deve vedersi quanto una stella accesa
                      n === 0 &&
                        cx(
                          numeric,
                          "mr-1 w-7 border text-[12px]",
                          selection.awaken === 0
                            ? "border-brand bg-brand-soft text-ink"
                            : "border-rule text-ink-3",
                        ),
                    )}
                  >
                    {n === 0 ? (
                      "0"
                    ) : (
                      <Star src={starSrc} lit={n <= selection.awaken} />
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset
            className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0"
            disabled={selection.awaken < steps.awaken.length}
          >
            <legend className="float-left mr-3 p-0 text-ink-2">{t.superRisveglio}</legend>
            <div className="flex items-center gap-1">
              {Array.from({ length: steps.superAwaken.length + 1 }, (_, n) => (
                <label key={n} className="cursor-pointer" title={t.superRisvegli(n)}>
                  <input
                    type="radio"
                    name={`${id}-super`}
                    value={n}
                    checked={selection.superAwaken === n}
                    onChange={() => change({ superAwaken: n })}
                    className="peer sr-only"
                  />
                  <span className="sr-only">{t.superRisvegli(n)}</span>
                  <span
                    aria-hidden
                    className={cx(
                      numeric,
                      "grid h-7 w-7 place-items-center rounded-[3px] border text-[12px] peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
                      selection.superAwaken === n
                        ? "border-brand bg-brand-soft text-ink"
                        : n <= selection.superAwaken
                          ? "border-rule bg-paper-3 text-ink-2"
                          : "border-rule text-ink-3",
                    )}
                  >
                    {n}
                  </span>
                </label>
              ))}
            </div>
            {selection.awaken < steps.awaken.length ? (
              <span className="text-[12px] text-ink-3">{t.dopoIlSesto}</span>
            ) : null}
          </fieldset>

          <div className="grid gap-1.5">
            {steps.relic ? (
              <label className="flex cursor-pointer items-start gap-2 text-ink-2">
                <input
                  type="checkbox"
                  checked={selection.relic}
                  onChange={(event) => change({ relic: event.target.checked })}
                  className="mt-0.5 accent-[var(--color-brand)]"
                />
                {t.reliquia}
              </label>
            ) : null}
            <label className="flex cursor-pointer items-start gap-2 text-ink-2">
              <input
                type="checkbox"
                checked={selection.costumes}
                onChange={(event) => change({ costumes: event.target.checked })}
                className="mt-0.5 accent-[var(--color-brand)]"
              />
              {t.costumi}
            </label>
          </div>

          {!atMax ? (
            <button
              type="button"
              onClick={() => setChosen(maxSelection(steps))}
              className="justify-self-start text-[12px] text-brand hover:underline"
            >
              {t.tuttoAlMassimo}
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Una colonna di numeri: stretta, perche' larga quanto la scheda il
          valore finirebbe a mille pixel dalla sua etichetta. `aria-live` fa
          sentire i numeri nuovi a chi usa un lettore di schermo mentre muove
          lo slider. */}
      <table className="w-full max-w-[420px] border-collapse text-[13px]" aria-live="polite">
        <tbody>
          {ROWS.filter((row) => values[row.key] !== undefined).map((row) => (
            <tr key={row.key} className="border-b border-rule/60">
              <td className="py-1.5 pr-3 text-ink-2">{row.label[locale]}</td>
              <td className={cx(numeric, "py-1.5 text-right font-medium")}>
                {numero(values[row.key]!, locale)}
                {row.percent ? "%" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Una stella del Risveglio: accesa fino al Risveglio scelto, spenta dopo. */
function Star({ src, lit }: { src?: string; lit: boolean }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={39}
        height={41}
        className={cx("h-[18px] w-[18px] object-contain transition-opacity", !lit && "opacity-25 grayscale")}
      />
    );
  }
  return <span className={cx("text-[17px] leading-none", lit ? "text-gold" : "text-ink-3/40")}>★</span>;
}
