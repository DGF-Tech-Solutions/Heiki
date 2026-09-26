"use client";

import { useId, useState } from "react";
import { AccountControls } from "@/components/account-buff/account-controls";
import { useAccountSetup } from "@/components/account-buff/use-account-setup";
import { cx, numeric } from "@/components/ui";
import type { AccountSliderData } from "@/lib/games/account-buff-types";
import { battleStats, heroCombatClass } from "@/lib/games/account-buff";
import { setupEffect } from "@/lib/games/account-setup";
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
    ultimate: "Ultimate",
    rangoUltimate: (n: number) => `Ultimate al rango ${n}`,
    veroRisveglio: "Vero risveglio",
    soloClasse: "questi due contano solo nella classe di combattimento",
    tuttoAlMassimo: "Tutto al massimo",
    scheda: "Scheda",
    battaglia: "In battaglia",
    tutte: (n: number) => `Tutte le statistiche (${n})`,
    principali: "Solo le principali",
    classe: "Classe di combattimento",
    classeNota:
      "Come la calcola il gioco (ogni statistica per il suo peso, più 500 per la passiva unica, 400 per rango dell'ultimate e 1.500 col Vero risveglio), ma senza equipaggiamento. Titoli e costellazioni il gioco non li conta nella classe.",
    battagliaNota:
      "In battaglia: la percentuale del titolo della classe dell'account si aggiunge alla statistica di scheda, poi si sommano le costellazioni, come fa il gioco. Restano fuori equipaggiamento e passive.",
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
    ultimate: "Ultimate",
    rangoUltimate: (n: number) => `Ultimate Move at rank ${n}`,
    veroRisveglio: "True Awakening",
    soloClasse: "these two only count toward Combat Class",
    tuttoAlMassimo: "Everything maxed",
    scheda: "Hero page",
    battaglia: "In battle",
    tutte: (n: number) => `All stats (${n})`,
    principali: "Main stats only",
    classe: "Combat Class",
    classeNota:
      "The way the game computes it (each stat times its weight, plus 500 for the Unique passive, 400 per Ultimate Move rank and 1,500 with True Awakening), but without gear. The game doesn't count titles and constellations in Combat Class.",
    battagliaNota:
      "In battle: the account Combat Class title's percentage is added to the hero-page stat, then the constellations are added, the way the game does it. Gear and passives are left out.",
  },
});

/**
 * Le righe della tabella: le cinque che si guardano davvero, e le altre sette
 * a richiesta, coi nomi della schermata del gioco. Le costellazioni toccano
 * soprattutto queste sette (Perforazione, Resistenza, Rigenerazione...), per
 * questo dal 26/09 si possono aprire.
 *
 * "Potenza combattimento" (`fPower`) e' stata tolta il 26/09: era il solo bonus
 * del Vero risveglio, 1.500 per tutti gli eroi. La classe di combattimento vera
 * ora ha la sua riga, calcolata con la formula del client (heroCombatClass).
 */
const ROWS: readonly { key: string; label: Bilingual; percent?: boolean; extra?: boolean }[] = [
  { key: "atk", label: { it: "Attacco", en: "Attack" } },
  { key: "def", label: { it: "Difesa", en: "Defense" } },
  { key: "hp", label: { it: "Salute", en: "HP" } },
  { key: "critPer", label: { it: "Tasso critico", en: "Crit Chance" }, percent: true },
  { key: "critAtkPer", label: { it: "Danno critico", en: "Crit Damage" }, percent: true },
  { key: "fixedAtkPer", label: { it: "Perforazione", en: "Pierce Rate" }, percent: true, extra: true },
  { key: "critResPer", label: { it: "Resistenza critico", en: "Crit Resistance" }, percent: true, extra: true },
  { key: "critDefPer", label: { it: "Difesa critico", en: "Crit Defense" }, percent: true, extra: true },
  { key: "fixedDefPer", label: { it: "Resistenza", en: "Resistance" }, percent: true, extra: true },
  { key: "hpRecoveryPer", label: { it: "Velocità di recupero", en: "Recovery Rate" }, percent: true, extra: true },
  { key: "hpStealPer", label: { it: "Furto di vita", en: "Lifesteal" }, percent: true, extra: true },
  { key: "hpRegenPer", label: { it: "Velocità di rigenerazione", en: "Regeneration Rate" }, percent: true, extra: true },
];

/**
 * `useGrouping: "always"` e non il default: in italiano il raggruppamento
 * automatico salta i numeri di quattro cifre, e nella stessa colonna uscivano
 * `7412` e `10.002`.
 */
const numero = (n: number, locale: Locale) =>
  n.toLocaleString(intlLocale(locale), { useGrouping: "always", maximumFractionDigits: 2 });

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
 *
 * Dal 26/09, se il gioco ha i dati dei buff dell'account (`account`), sotto i
 * comandi dell'eroe ci sono quelli del tuo account: classe dell'account e
 * costellazioni. Valgono per tutte le schede, quindi stanno nel browser e non
 * nello stato di questo componente; quando aggiungono qualcosa la tabella ha una
 * seconda colonna, «In battaglia». Il rango dell'ultimate e il Vero risveglio
 * invece sono dell'eroe, e toccano solo la classe di combattimento.
 */
export function StatSlider({
  steps,
  max,
  starSrc,
  account,
  gameSlug,
  accountHref,
  gemSrcs,
}: {
  steps?: HeroStatSteps;
  /** senza `steps` la tabella resta quella del massimo, senza comandi */
  max: Readonly<Record<string, number>>;
  /** la stella dei ranghi del gioco; senza, un ★ disegnato col testo */
  starSrc?: string;
  /** i buff dell'account ridotti ai totali; senza, niente classe e niente comandi dell'account */
  account?: AccountSliderData;
  /** il gioco: la chiave dell'account salvato nel browser */
  gameSlug?: string;
  /** la pagina «Buff dell'account» */
  accountHref?: string;
  /** le sei pietre dei ranghi dell'ultimate; senza, i numeri */
  gemSrcs?: readonly string[];
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const id = useId();
  const [chosen, setChosen] = useState<StatSelection | null>(() => (steps ? maxSelection(steps) : null));
  const [ultimateRank, setUltimateRank] = useState(6);
  const [trueAwakening, setTrueAwakening] = useState(true);
  const [allRows, setAllRows] = useState(false);
  const [setup, saveSetup] = useAccountSetup(gameSlug ?? "");

  const selection = steps && chosen ? clampSelection(steps, chosen) : null;
  const values = steps && selection ? statsAt(steps, selection) : max;
  const change = (patch: Partial<StatSelection>) =>
    setChosen((current) => (steps && current ? clampSelection(steps, { ...current, ...patch }) : current));
  const atMax =
    (steps && selection ? SAME(selection, maxSelection(steps)) : true) && ultimateRank === 6 && trueAwakening;

  const effect = account && gameSlug ? setupEffect(account, setup) : null;
  const battle = effect?.active ? battleStats(values, effect.tier, effect.bonus) : null;
  const power = account
    ? heroCombatClass(values, account.heroPower, { ultimateRank, trueAwakening })
    : null;
  const rows = ROWS.filter((row) => values[row.key] !== undefined && (allRows || !row.extra));
  const extraRows = ROWS.filter((row) => row.extra && values[row.key] !== undefined).length;

  return (
    // Comandi e tabella affiancati quando la scheda e' larga (dal 26/09 le
    // statistiche hanno una scheda loro, che e' un contenitore): muovendo lo
    // slider i numeri restano in vista. Prima la tabella stava sotto i comandi,
    // che col tuo account sono alti circa 600px. Stretta, torna una colonna.
    <div className="grid items-start gap-x-6 gap-y-4 @4xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
      {steps && selection ? (
        <div className="grid max-w-[560px] gap-3 rounded-card border border-rule bg-paper-2 p-4 text-[13px]">
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

          {account ? (
            <div className="grid gap-1.5">
              <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
                <legend className="float-left mr-3 p-0 text-ink-2">{t.ultimate}</legend>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 6 }, (_, position) => {
                    const rank = position + 1;
                    return (
                      <label key={rank} className="cursor-pointer" title={t.rangoUltimate(rank)}>
                        <input
                          type="radio"
                          name={`${id}-ultimate`}
                          value={rank}
                          checked={ultimateRank === rank}
                          onChange={() => setUltimateRank(rank)}
                          className="peer sr-only"
                        />
                        <span className="sr-only">{t.rangoUltimate(rank)}</span>
                        <span
                          aria-hidden
                          className={cx(
                            "grid h-7 w-7 place-items-center rounded-[3px] border peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                            ultimateRank === rank ? "border-brand bg-brand-soft" : "border-transparent",
                          )}
                        >
                          {gemSrcs?.[position] ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={gemSrcs[position]}
                              alt=""
                              width={24}
                              height={24}
                              className={cx("h-5 w-5 object-contain", rank > ultimateRank && "opacity-30")}
                            />
                          ) : (
                            <span className={cx(numeric, "text-[12px]", rank <= ultimateRank ? "text-ink" : "text-ink-3")}>
                              {rank}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <label className="flex cursor-pointer items-start gap-2 text-ink-2">
                <input
                  type="checkbox"
                  checked={trueAwakening}
                  onChange={(event) => setTrueAwakening(event.target.checked)}
                  className="mt-0.5 accent-[var(--color-brand)]"
                />
                {t.veroRisveglio}
              </label>
              <span className="text-[12px] text-ink-3">{t.soloClasse}</span>
            </div>
          ) : null}

          {!atMax ? (
            <button
              type="button"
              onClick={() => {
                setChosen(maxSelection(steps));
                setUltimateRank(6);
                setTrueAwakening(true);
              }}
              className="justify-self-start text-[12px] text-brand hover:underline"
            >
              {t.tuttoAlMassimo}
            </button>
          ) : null}

          {account && gameSlug && accountHref ? (
            <AccountControls data={account} setup={setup} save={saveSetup} href={accountHref} locale={locale} />
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0">
        {/* Una colonna di numeri, due quando l'account aggiunge qualcosa: stretta,
            perche' larga quanto la scheda il valore finirebbe a mille pixel dalla
            sua etichetta. `aria-live` fa sentire i numeri nuovi a chi usa un
            lettore di schermo mentre muove lo slider. */}
        <table className="w-full max-w-[460px] border-collapse text-[13px]" aria-live="polite">
          {battle ? (
            <thead>
              <tr className="border-b border-rule text-left">
                <th className="py-1.5 pr-3 font-normal" />
                <th className="py-1.5 pr-3 text-right text-[12px] font-medium text-ink-3">{t.scheda}</th>
                <th className="py-1.5 text-right text-[12px] font-medium text-ink-2">{t.battaglia}</th>
              </tr>
            </thead>
          ) : null}
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-rule/60">
                <td className="py-1.5 pr-3 text-ink-2">{row.label[locale]}</td>
                <td className={cx(numeric, "py-1.5 text-right", battle ? "pr-3 text-ink-2" : "font-medium")}>
                  {numero(values[row.key]!, locale)}
                  {row.percent ? "%" : ""}
                </td>
                {battle ? (
                  <td className={cx(numeric, "py-1.5 text-right font-medium")}>
                    {numero(battle[row.key]!, locale)}
                    {row.percent ? "%" : ""}
                  </td>
                ) : null}
              </tr>
            ))}
            {power !== null ? (
              <tr className="border-b border-rule/60">
                <td className="py-1.5 pr-3 text-ink-2">{t.classe}</td>
                <td className={cx(numeric, "py-1.5 text-right", battle ? "pr-3" : "font-medium")}>
                  {numero(power, locale)}
                </td>
                {battle ? <td className="py-1.5 text-right text-ink-3">—</td> : null}
              </tr>
            ) : null}
          </tbody>
        </table>
        {extraRows > 0 ? (
          <button
            type="button"
            onClick={() => setAllRows((current) => !current)}
            aria-expanded={allRows}
            className="mt-1.5 text-[12px] text-brand hover:underline"
          >
            {allRows ? t.principali : t.tutte(rows.length + extraRows)}
          </button>
        ) : null}
        {power !== null ? <p className="mt-2 max-w-[70ch] text-[12px] text-ink-3">{t.classeNota}</p> : null}
        {battle ? <p className="mt-1 max-w-[70ch] text-[12px] text-ink-3">{t.battagliaNota}</p> : null}
      </div>
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
