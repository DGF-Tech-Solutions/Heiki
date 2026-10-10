"use client";

import { AccountControls } from "@/components/account-buff/account-controls";
import { cx, numeric } from "@/components/ui";
import type { AccountSliderData } from "@/lib/games/account-buff-types";
import type { AccountSetup } from "@/lib/games/account-setup";
import { fateEffectAt } from "@/lib/games/gear";
import type { BuildResult, CalculatorData, HeroBuild } from "@/lib/games/hero-build";
import { useLocale } from "@/lib/i18n/client";
import { inLingua, testi } from "@/lib/i18n/locale";
import { ChoiceRow, Panel } from "./controls";
import { formatStat, statName } from "./stat-rows";

const TESTI = testi({
  it: {
    titolo: "In battaglia",
    associato: "Eroe associato",
    nessuno: "Nessuno",
    conLegame: "Con un legame",
    altri: "Tutti gli altri eroi",
    mossa: "Mossa finale",
    rango: (n: number) => `Mossa finale al rango ${n}`,
    grado: "Grado",
    stessoEquip: "con lo stesso equipaggiamento di questo eroe (senza incisione)",
    comune: (p: number) => `Effetto comune: il ${p}% di Attacco, Difesa e PS dell'associato`,
    legame: "Effetto del legame",
    nessunLegame: "Nessun legame con questo eroe: vale solo l'effetto comune.",
    combinato: "Attacco combinato: +1.000 alla classe di combattimento della squadra",
    nota: "L'associazione vale solo in battaglia: la scheda del gioco non la conta. Le statistiche dell'associato sono quelle della sua scheda al massimo.",
  },
  en: {
    titolo: "In battle",
    associato: "Associated Hero",
    nessuno: "None",
    conLegame: "With a bond",
    altri: "Every other hero",
    mossa: "Ultimate Move",
    rango: (n: number) => `Ultimate Move at rank ${n}`,
    grado: "Grade",
    stessoEquip: "with the same gear as this hero (without engraving)",
    comune: (p: number) => `Common effect: ${p}% of the associate's Attack, Defense and HP`,
    legame: "Bond effect",
    nessunLegame: "No bond with this hero: only the common effect applies.",
    combinato: "Combined Attack: +1,000 to the team's Combat Class",
    nota: "Association only works in battle: the game's hero page doesn't count it. The associate's stats are those of its hero page, maxed.",
  },
});

/**
 * Quello che conta solo in battaglia: il tuo account (titolo della classe e
 * costellazioni, salvati nel browser per tutte le schede) e l'Eroe associato,
 * che da' all'eroe una parte delle sue statistiche e, se c'e' un legame, un
 * effetto che dipende dal suo grado.
 */
export function BattlePanel({
  data,
  build,
  result,
  onChange,
  account,
  setup,
  saveSetup,
  accountHref,
  gemSrcs,
}: {
  data: CalculatorData;
  build: HeroBuild;
  result: BuildResult;
  onChange: (associate: HeroBuild["associate"]) => void;
  account?: AccountSliderData;
  setup: AccountSetup;
  saveSetup: (next: AccountSetup) => void;
  accountHref?: string;
  gemSrcs?: readonly string[];
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  // id fissi, non useId(): vedi stat-calculator.tsx
  const id = "calc-battaglia";
  const associates = data.associates ?? [];
  const links = new Map((data.fates?.links ?? []).map((fate) => [fate[0], fate]));
  const chosen = build.associate;
  const associate = chosen ? associates.find((a) => a.id === chosen.hero) : undefined;
  const linked = associates.filter((a) => links.has(a.id));
  const rest = associates.filter((a) => !links.has(a.id) && a.id !== data.heroId);
  const gradeName = (g: number) => ({ 3: "R", 4: "SR", 5: "SSR", 6: "UR", 7: "LR" })[g] ?? String(g);
  const effectLabel = (heroId: string) => {
    const fate = links.get(heroId);
    const effect = fate && data.fates ? fateEffectAt(data.fates, fate, 6) : null;
    return effect ? ` · ${inLingua(effect.effect.name, locale)}` : "";
  };

  return (
    <Panel title={t.titolo}>
      {data.associates && data.fates ? (
        <div className="grid gap-2">
          <label htmlFor={`${id}-associato`} className="text-ink-2">
            {t.associato}
          </label>
          <select
            id={`${id}-associato`}
            value={chosen?.hero ?? ""}
            onChange={(event) => {
              const next = associates.find((a) => a.id === event.target.value);
              onChange(
                next
                  ? {
                      hero: next.id,
                      ultimateRank: chosen?.ultimateRank ?? 6,
                      grade: next.grades[next.grades.length - 1]!,
                      sameGear: chosen?.sameGear ?? true,
                    }
                  : null,
              );
            }}
            className="w-full min-w-0 border border-rule bg-paper px-2 py-1.5 text-ink"
          >
            <option value="">{t.nessuno}</option>
            {linked.length > 0 ? (
              <optgroup label={t.conLegame}>
                {linked.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                    {effectLabel(a.id)}
                  </option>
                ))}
              </optgroup>
            ) : null}
            <optgroup label={t.altri}>
              {rest.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </optgroup>
          </select>

          {chosen && associate ? (
            <>
              <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
                <legend className="float-left mr-3 p-0 text-ink-2">{t.mossa}</legend>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 6 }, (_, position) => {
                    const rank = position + 1;
                    return (
                      <label key={rank} className="cursor-pointer" title={t.rango(rank)}>
                        <input
                          type="radio"
                          name={`${id}-mossa`}
                          checked={chosen.ultimateRank === rank}
                          onChange={() => onChange({ ...chosen, ultimateRank: rank })}
                          className="peer sr-only"
                        />
                        <span className="sr-only">{t.rango(rank)}</span>
                        <span
                          aria-hidden
                          className={cx(
                            "grid h-7 w-7 place-items-center border peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                            chosen.ultimateRank === rank ? "border-brand bg-brand-soft" : "border-transparent",
                          )}
                        >
                          {gemSrcs?.[position] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={gemSrcs[position]}
                              alt=""
                              width={24}
                              height={24}
                              className={cx("h-5 w-5 object-contain", rank > chosen.ultimateRank && "opacity-30")}
                            />
                          ) : (
                            <span className={cx(numeric, "text-[12px]")}>{rank}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <ChoiceRow
                legend={t.grado}
                name={`${id}-grado`}
                value={chosen.grade}
                onChange={(grade) => onChange({ ...chosen, grade })}
                options={associate.grades.map((g) => ({ value: g, label: gradeName(g), title: gradeName(g) }))}
              />
              <label className="flex cursor-pointer items-start gap-2 text-ink-2">
                <input
                  type="checkbox"
                  checked={chosen.sameGear}
                  onChange={(event) => onChange({ ...chosen, sameGear: event.target.checked })}
                  className="mt-0.5 accent-[var(--color-brand)]"
                />
                {t.stessoEquip}
              </label>
              {result.fate ? (
                <div className="grid gap-1 border border-rule/70 bg-paper px-2.5 py-2 text-[12px]">
                  <span className="text-ink-2">{t.comune(result.fate.percent)}</span>
                  <span className={cx(numeric, "text-ink")}>
                    {(["atk", "def", "hp"] as const)
                      .map((stat) => `${statName(stat, locale)} +${formatStat(Math.round(result.fate!.before[stat] ?? 0), locale)}`)
                      .join(" · ")}
                  </span>
                  {result.fate.link ? (
                    <span className="text-ink">
                      {t.legame}: {inLingua(result.fate.link.effect.name, locale)}{" "}
                      <span className={numeric}>
                        {statName(result.fate.link.effect.stat, locale)} +{formatStat(result.fate.link.value, locale)}
                        {result.fate.link.effect.mode === "points" ? "%" : ""}
                      </span>
                    </span>
                  ) : (
                    <span className="text-ink-3">{t.nessunLegame}</span>
                  )}
                  {result.fate.combined ? <span className="text-ink-2">{t.combinato}</span> : null}
                </div>
              ) : null}
            </>
          ) : null}
          <p className="m-0 max-w-[70ch] text-[12px] text-ink-3">{t.nota}</p>
        </div>
      ) : null}

      {account && accountHref ? (
        <AccountControls data={account} setup={setup} save={saveSetup} href={accountHref} locale={locale} idPrefix="calc-account" />
      ) : null}
    </Panel>
  );
}
