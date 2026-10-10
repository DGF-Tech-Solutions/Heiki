"use client";

import { useMemo, useState } from "react";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { useAccountSetup } from "@/components/account-buff/use-account-setup";
import { cx, numeric } from "@/components/ui";
import type { AccountSliderData } from "@/lib/games/account-buff-types";
import { heroCombatClass } from "@/lib/games/account-buff";
import { setupEffect } from "@/lib/games/account-setup";
import { shownValue } from "@/lib/games/gear";
import { battleWith, buildFromBox, computeBuild, defaultBuild, type CalculatorData, type HeroBuild } from "@/lib/games/hero-build";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { BattlePanel } from "./battle-panel";
import { LinkButton, Panel, RangeField, StarRow, TrueAwakeningRow, UltimateRow } from "./controls";
import { CostumePanel } from "./costume-panel";
import { GearPanel } from "./gear-panel";
import { STAT_ROWS, formatStat } from "./stat-rows";
import { useHeroBuild } from "./use-hero-build";

const TESTI = testi({
  it: {
    eroe: "Eroe",
    livello: "Livello",
    risveglio: "Risveglio",
    superRisveglio: "Super risveglio",
    risvegli: (n: number) => (n === 0 ? "nessun Risveglio" : n === 1 ? "1 Risveglio" : `${n} Risvegli`),
    superRisvegli: (n: number) =>
      n === 0 ? "nessun Super risveglio" : n === 1 ? "1 Super risveglio" : `${n} Super risvegli`,
    dopoIlSesto: "si sblocca col sesto Risveglio",
    ultimate: "Ultimate",
    rangoUltimate: (n: number) => `Ultimate al rango ${n}`,
    veroRisveglio: "Vero risveglio",
    vero: ["Re Demone", "Divinità Suprema"] as readonly [string, string],
    veroTitolo: [
      "Vero risveglio coi materiali del Re Demone: Resistenza ai danni",
      "Vero risveglio coi materiali della Divinità Suprema: Amplificazione danni",
    ] as readonly [string, string],
    soloClasse: "ultimate e Vero risveglio contano solo nella classe di combattimento (il Vero risveglio una volta, anche coi due)",
    tuttoAlMassimo: "Torna a tutto al massimo",
    tornaAlBox: "Torna ai numeri del tuo box",
    dalBox: "Livello, risvegli, ultimate e Vero risveglio vengono dal",
    ilTuoBox: "tuo box",
    salvata: "La configurazione di questo eroe si salva in questo browser.",
    statistica: "Statistica",
    senza: "Senza equip.",
    con: "Con equip.",
    differenza: "Differenza",
    battaglia: "In battaglia",
    tutte: (n: number) => `Tutte le statistiche (${n})`,
    principali: "Solo le principali",
    classe: "Classe di combattimento",
    notaTabella:
      "Senza equipaggiamento: livello, risvegli, costumi registrati e reliquia. Con: in più la statistica di ogni pezzo, poi le percentuali di set ed effetti bonus sommate per statistica, che moltiplicano Attacco, Difesa e PS; le altre si aggiungono in punti. Attacco, Difesa e PS per eccesso, come nel gioco. Le passive dell'eroe restano fuori.",
    classeNota:
      "Come la calcola il gioco (ogni statistica per il suo peso, più 500 per la passiva unica, 400 per rango dell'ultimate e 1.500 col Vero risveglio), con l'equipaggiamento scelto. Titoli, costellazioni e associazione il gioco non li conta nella classe.",
    battagliaNota:
      "In battaglia, nell'ordine del gioco: l'effetto comune dell'associato si somma alla statistica, poi le percentuali dell'equipaggiamento, poi quella del titolo della classe dell'account; dopo, l'effetto del legame e le costellazioni.",
    riassunto: "Con l'equipaggiamento scelto",
  },
  en: {
    eroe: "Hero",
    livello: "Level",
    risveglio: "Awakening",
    superRisveglio: "Super Awakening",
    risvegli: (n: number) => (n === 0 ? "no Awakening" : n === 1 ? "1 Awakening" : `${n} Awakenings`),
    superRisvegli: (n: number) =>
      n === 0 ? "no Super Awakening" : n === 1 ? "1 Super Awakening" : `${n} Super Awakenings`,
    dopoIlSesto: "unlocks with the sixth Awakening",
    ultimate: "Ultimate",
    rangoUltimate: (n: number) => `Ultimate Move at rank ${n}`,
    veroRisveglio: "True Awakening",
    vero: ["Demon King", "Supreme Deity"] as readonly [string, string],
    veroTitolo: [
      "True Awakening with Demon King materials: Damage Resistance",
      "True Awakening with Supreme Deity materials: Damage Amplification",
    ] as readonly [string, string],
    soloClasse: "Ultimate and True Awakening only count toward Combat Class (True Awakening once, even with both)",
    tuttoAlMassimo: "Back to everything maxed",
    tornaAlBox: "Back to your box's numbers",
    dalBox: "Level, awakenings, Ultimate and True Awakening come from",
    ilTuoBox: "your box",
    salvata: "This hero's setup is saved in this browser.",
    statistica: "Stat",
    senza: "Without gear",
    con: "With gear",
    differenza: "Difference",
    battaglia: "In battle",
    tutte: (n: number) => `All stats (${n})`,
    principali: "Main stats only",
    classe: "Combat Class",
    notaTabella:
      "Without gear: level, awakenings, registered costumes and relic. With gear: plus each piece's stat, then the set and Bonus Effect percentages summed per stat, which multiply Attack, Defense and HP; the others are added as points. Attack, Defense and HP rounded up, as the game does. The hero's passives are left out.",
    classeNota:
      "The way the game computes it (each stat times its weight, plus 500 for the Unique passive, 400 per Ultimate Move rank and 1,500 with True Awakening), with the chosen gear. The game doesn't count titles, constellations and association in Combat Class.",
    battagliaNota:
      "In battle, in the game's order: the associate's common effect is added to the stat, then the gear percentages, then the account Combat Class title's; after that, the bond effect and the constellations.",
    riassunto: "With the chosen gear",
  },
});

/**
 * Il calcolatore delle statistiche della scheda eroe (scelte dell'utente, 27/09):
 * i comandi dell'eroe come lo slider di prima, l'equipaggiamento coi set pronti e
 * ogni pezzo modificabile come nel gioco, i costumi registrati, e quello che vale
 * solo in battaglia (l'account, l'Eroe associato); a destra la tabella senza, con
 * e differenza, che resta in vista mentre si scorrono i comandi. Sul telefono una
 * striscia ferma in cima con Attacco, Difesa e PS fa lo stesso lavoro.
 *
 * I conti li fanno computeBuild e battleWith (hero-build.ts), le stesse funzioni
 * dei test. La configurazione si salva nel browser per ogni eroe
 * (use-hero-build.ts); si parte da tutto al massimo coi cinque costumi migliori e
 * l'equipaggiamento PS/Difesa: senza equipaggiamento sono i numeri che la scheda
 * ha sempre mostrato, con e' il «massimo con equipaggiamento» di 7dshub.
 */
export function StatCalculator({
  game,
  data,
  starSrc,
  superStarSrc,
  trueAwakeningSrcs,
  gemSrcs,
  account,
  accountHref,
}: {
  game: string;
  data: CalculatorData;
  /** la stella dei ranghi del gioco; senza, un ★ disegnato col testo */
  starSrc?: string;
  /** la stella rossa del Super risveglio; senza, i numeri */
  superStarSrc?: string;
  /** le due sfere del Vero risveglio, Re Demone e Divinita' Suprema; senza, due caselle */
  trueAwakeningSrcs?: readonly [string, string];
  /** le sei pietre dei ranghi dell'ultimate; senza, i numeri */
  gemSrcs?: readonly string[];
  /** i buff dell'account ridotti ai totali; senza, niente classe e niente comandi dell'account */
  account?: AccountSliderData;
  accountHref?: string;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  // Id fissi e non useId(): React ricava useId dalla posizione nell'albero, e
  // nella scheda l'albero sopra il calcolatore a volte usciva diverso fra server e
  // browser (errore di idratazione, 4 caricamenti su 6 il 10/10). Il calcolatore
  // e' uno per pagina: il nome del campo basta.
  const id = "calc";
  const [storedBuild, save, reset, saved] = useHeroBuild(game, data);
  // Se l'eroe sta nel tuo box e nel calcolatore non hai cambiato niente, si parte
  // dai tuoi numeri e non dal massimo (10/10)
  const [box] = useHeroBox(game);
  const boxEntry = box.heroes[data.heroId];
  const fromBox = useMemo(() => (!saved && boxEntry ? buildFromBox(data, boxEntry) : null), [saved, boxEntry, data]);
  const build = fromBox ?? storedBuild;
  const [setup, saveSetup] = useAccountSetup(game);
  const [allRows, setAllRows] = useState(false);
  const change = (patch: Partial<HeroBuild>) => save({ ...build, ...patch });

  const result = useMemo(() => computeBuild(data, build), [data, build]);
  const effect = account ? setupEffect(account, setup) : null;
  const battle =
    effect?.active || result.fate
      ? battleWith(result, effect?.active ? effect.tier : null, effect?.active ? effect.bonus : {})
      : null;
  const power = (values: Record<string, number>) =>
    account
      ? heroCombatClass(values, account.heroPower, {
          ultimateRank: build.ultimateRank,
          trueAwakening: build.trueAwakening.some(Boolean),
        })
      : null;
  const classWithout = power(result.without);
  const classWith = power(result.withGear);

  const rows = STAT_ROWS.filter((row) => result.without[row.key] !== undefined && (allRows || !row.extra));
  const extraRows = STAT_ROWS.filter((row) => row.extra && result.without[row.key] !== undefined).length;
  const shown = (key: string, values: Record<string, number>) => shownValue(key, values[key] ?? 0);
  const steps = data.steps;

  return (
    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-4 @4xl:grid-cols-[minmax(0,600px)_minmax(0,1fr)]">
      {/* sul telefono i numeri che cambiano stanno fermi in cima, sotto le schede */}
      <div
        aria-hidden
        className="sticky top-[104px] z-[5] -mx-1 grid grid-cols-3 gap-2 border border-rule bg-paper/95 px-3 py-1.5 text-[12px] backdrop-blur @4xl:hidden"
      >
        {(["atk", "def", "hp"] as const).map((key) => {
          const diff = shown(key, result.withGear) - shown(key, result.without);
          return (
            <span key={key} className="min-w-0">
              <span className="block text-[12px] text-ink-3">{STAT_ROWS.find((r) => r.key === key)!.label[locale]}</span>
              <span className={cx(numeric, "font-medium text-ink")}>{formatStat(shown(key, result.withGear), locale)}</span>
              {diff ? <span className={cx(numeric, "ml-1 text-[12px] text-up")}>+{formatStat(diff, locale)}</span> : null}
            </span>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-4">
        <Panel
          title={t.eroe}
          action={
            saved ? (
              <LinkButton onClick={reset}>{boxEntry ? t.tornaAlBox : t.tuttoAlMassimo}</LinkButton>
            ) : fromBox ? (
              <LinkButton onClick={() => save(defaultBuild(data))}>{t.tuttoAlMassimo}</LinkButton>
            ) : null
          }
        >
          {fromBox ? (
            <p className="m-0 text-[12px] text-ink-2">
              {t.dalBox}{" "}
              <a href={`/${game}/account/eroi`} className="font-semibold text-brand-deep hover:underline">
                {t.ilTuoBox}
              </a>
            </p>
          ) : null}
          <RangeField
            id={`${id}-livello`}
            label={t.livello}
            min={1}
            max={steps.maxLevel}
            value={build.level}
            onChange={(level) => change({ level: Math.min(steps.maxLevel, Math.max(1, Math.round(level))) })}
          />
          <StarRow
            legend={t.risveglio}
            name={`${id}-risveglio`}
            count={steps.awaken.length}
            value={build.awaken}
            onChange={(awaken) => change({ awaken, superAwaken: awaken < steps.awaken.length ? 0 : build.superAwaken })}
            starSrc={starSrc}
            title={t.risvegli}
          />
          {/* le stelle rosse del gioco (star_icon_break); senza l'immagine, i numeri */}
          {superStarSrc ? (
            <StarRow
              legend={t.superRisveglio}
              name={`${id}-super`}
              count={steps.superAwaken.length}
              value={build.superAwaken}
              onChange={(superAwaken) => change({ superAwaken })}
              starSrc={superStarSrc}
              title={t.superRisvegli}
              disabled={build.awaken < steps.awaken.length}
              note={build.awaken < steps.awaken.length ? t.dopoIlSesto : undefined}
            />
          ) : (
            <fieldset
              className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0"
              disabled={build.awaken < steps.awaken.length}
            >
              <legend className="float-left mr-3 p-0 text-ink-2">{t.superRisveglio}</legend>
              <div className="flex items-center gap-1">
                {Array.from({ length: steps.superAwaken.length + 1 }, (_, n) => (
                  <label key={n} className="cursor-pointer" title={t.superRisvegli(n)}>
                    <input
                      type="radio"
                      name={`${id}-super`}
                      checked={build.superAwaken === n}
                      onChange={() => change({ superAwaken: n })}
                      className="peer sr-only"
                    />
                    <span className="sr-only">{t.superRisvegli(n)}</span>
                    <span
                      aria-hidden
                      className={cx(
                        numeric,
                        "grid h-7 w-7 place-items-center border text-[12px] peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-disabled:cursor-not-allowed peer-disabled:opacity-40",
                        build.superAwaken === n ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3",
                      )}
                    >
                      {n}
                    </span>
                  </label>
                ))}
              </div>
              {build.awaken < steps.awaken.length ? <span className="text-[12px] text-ink-3">{t.dopoIlSesto}</span> : null}
            </fieldset>
          )}

          {account ? (
            <div className="grid gap-1.5">
              <UltimateRow
                legend={t.ultimate}
                name={`${id}-ultimate`}
                value={build.ultimateRank}
                onChange={(ultimateRank) => change({ ultimateRank })}
                gemSrcs={gemSrcs}
                title={t.rangoUltimate}
              />
              <TrueAwakeningRow
                legend={t.veroRisveglio}
                value={build.trueAwakening}
                onChange={(trueAwakening) => change({ trueAwakening })}
                srcs={trueAwakeningSrcs}
                labels={t.vero}
                titles={t.veroTitolo}
              />
              <span className="text-[12px] text-ink-3">{t.soloClasse}</span>
            </div>
          ) : null}
          {saved ? <p className="m-0 text-[12px] text-ink-3">{t.salvata}</p> : null}
        </Panel>

        <GearPanel
          game={game}
          gear={data.gear}
          pieces={build.gear}
          totals={result.gear}
          onChange={(gear) => change({ gear })}
          starSrc={starSrc}
        />
        <CostumePanel game={game} icons={data.gear.icons} data={data} build={build} onChange={(patch) => change(patch)} />
        <BattlePanel
          data={data}
          build={build}
          result={result}
          onChange={(associate) => change({ associate })}
          account={account}
          setup={setup}
          saveSetup={saveSetup}
          accountHref={accountHref}
          gemSrcs={gemSrcs}
        />
      </div>

      {/* La tabella resta in vista mentre si scorrono i comandi (60px
          dell'intestazione del sito piu' la barra delle schede). `aria-live` fa
          sentire i numeri nuovi a chi usa un lettore di schermo. */}
      <div className="min-w-0 @4xl:sticky @4xl:top-[112px]">
        <div className="overflow-x-auto">
          <table className="w-full max-w-[640px] border-collapse text-[13px]" aria-live="polite">
            <thead>
              <tr className="border-b border-rule text-left">
                <th className="py-1.5 pr-3 text-[12px] font-medium text-ink-3">{t.statistica}</th>
                <th className="py-1.5 pr-3 text-right text-[12px] font-medium text-ink-3">{t.senza}</th>
                <th className="py-1.5 pr-3 text-right text-[12px] font-medium text-ink-2">{t.con}</th>
                <th className="py-1.5 pr-3 text-right text-[12px] font-medium text-ink-3">{t.differenza}</th>
                {battle ? <th className="py-1.5 text-right text-[12px] font-medium text-ink-2">{t.battaglia}</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const without = shown(row.key, result.without);
                const withGear = shown(row.key, result.withGear);
                const diff = Math.round((withGear - without) * 100) / 100;
                const unit = row.percent ? "%" : "";
                return (
                  <tr key={row.key} className="border-b border-rule/60">
                    <td className="py-1.5 pr-3 text-ink-2">{row.label[locale]}</td>
                    <td className={cx(numeric, "py-1.5 pr-3 text-right text-ink-2")}>
                      {formatStat(without, locale)}
                      {unit}
                    </td>
                    <td className={cx(numeric, "py-1.5 pr-3 text-right font-medium")}>
                      {formatStat(withGear, locale)}
                      {unit}
                    </td>
                    <td className={cx(numeric, "py-1.5 pr-3 text-right", diff > 0 ? "text-up" : diff < 0 ? "text-down" : "text-ink-3")}>
                      {diff === 0 ? "—" : `${diff > 0 ? "+" : ""}${formatStat(diff, locale)}${unit}`}
                    </td>
                    {battle ? (
                      <td className={cx(numeric, "py-1.5 text-right font-medium")}>
                        {formatStat(shown(row.key, battle), locale)}
                        {unit}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              {classWithout !== null && classWith !== null ? (
                <tr className="border-b border-rule/60">
                  <td className="py-1.5 pr-3 text-ink-2">{t.classe}</td>
                  <td className={cx(numeric, "py-1.5 pr-3 text-right text-ink-2")}>{formatStat(classWithout, locale)}</td>
                  <td className={cx(numeric, "py-1.5 pr-3 text-right font-medium")}>{formatStat(classWith, locale)}</td>
                  <td className={cx(numeric, "py-1.5 pr-3 text-right", classWith > classWithout ? "text-up" : "text-ink-3")}>
                    {classWith === classWithout ? "—" : `+${formatStat(classWith - classWithout, locale)}`}
                  </td>
                  {battle ? <td className="py-1.5 text-right text-ink-3">—</td> : null}
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {extraRows > 0 ? (
          <button
            type="button"
            onClick={() => setAllRows((current) => !current)}
            aria-expanded={allRows}
            className="mt-1.5 text-[12px] font-semibold text-brand-deep hover:underline"
          >
            {allRows ? t.principali : t.tutte(rows.length + extraRows)}
          </button>
        ) : null}
        <p className="mt-2 max-w-[70ch] text-[12px] text-ink-3">{t.notaTabella}</p>
        {classWith !== null ? <p className="mt-1 max-w-[70ch] text-[12px] text-ink-3">{t.classeNota}</p> : null}
        {battle ? <p className="mt-1 max-w-[70ch] text-[12px] text-ink-3">{t.battagliaNota}</p> : null}
      </div>
    </div>
  );
}
