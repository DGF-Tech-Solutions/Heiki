"use client";

import { useState } from "react";
import { cx, numeric } from "@/components/ui";
import type { GearIndex } from "@/lib/games/gear-types";
import {
  GEAR_PRESETS,
  canEngrave,
  clampPiece,
  gearValue,
  mainOption,
  maxPiece,
  optionsOf,
  pieceMain,
  presetBuild,
  presetOf,
  shownRating,
  type GearBuild,
  type GearPiece,
  type GearTotals,
} from "@/lib/games/gear";
import { useLocale } from "@/lib/i18n/client";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";
import { ChoiceRow, LinkButton, Panel, RangeField, StarRow } from "./controls";
import { ItemIcon, SetBadge, pieceSrc, slotSrc } from "./item-icon";
import { formatStat, statName } from "./stat-rows";

const TESTI = testi({
  it: {
    titolo: "Equipaggiamento",
    setPronti: "Set pronti",
    nessuno: "Nessuno",
    nessunoTitolo: "Togli tutti i pezzi",
    vuoto: "vuoto",
    set: "Set",
    rarita: "Rarità",
    inciso: "Inciso per questo eroe (UR)",
    incisoNota: "si incide a +5 coi cinque risvegli: prende i valori UR",
    risveglio: "Risveglio",
    risvegli: (n: number) => (n === 0 ? "nessun risveglio" : n === 1 ? "1 risveglio" : `${n} risvegli`),
    miglioramento: "Miglioramento",
    base: "Statistica di base",
    effetti: "Effetti bonus",
    effettiNota: "uno per risveglio",
    nessunEffetto: "Gli effetti bonus arrivano coi risvegli del pezzo.",
    effetto: (n: number) => `Effetto bonus ${n}`,
    togli: "Togli il pezzo",
    alMassimo: "Al massimo",
    metti: "Metti un pezzo di questo set:",
    nonOttenibile: "non si ottiene più: i pezzi esistono nelle tabelle, ma nessuna ricompensa li dà",
    pezzi: (n: number, di: number) => `${n}/${di}`,
    nessunSet: "Nessun set completo.",
    volte: (n: number) => (n > 1 ? ` ×${n}` : ""),
    pezzoDi: (parte: string, set: string) => `${parte} · ${set}`,
    iconaPezzo: (parte: string, set: string, rarita: string, stelle: number, piu: number) =>
      `${parte} ${set}, ${rarita}, ${stelle} risvegli, +${piu}`,
    slotVuoto: (parte: string) => `${parte}: nessun pezzo`,
  },
  en: {
    titolo: "Gear",
    setPronti: "Presets",
    nessuno: "None",
    nessunoTitolo: "Remove every piece",
    vuoto: "empty",
    set: "Set",
    rarita: "Rarity",
    inciso: "Engraved for this hero (UR)",
    incisoNota: "engraving needs +5 and five awakenings: it takes the UR values",
    risveglio: "Awakening",
    risvegli: (n: number) => (n === 0 ? "no awakening" : n === 1 ? "1 awakening" : `${n} awakenings`),
    miglioramento: "Enhancement",
    base: "Base stat",
    effetti: "Bonus Effects",
    effettiNota: "one per awakening",
    nessunEffetto: "Bonus Effects come with the piece's awakenings.",
    effetto: (n: number) => `Bonus Effect ${n}`,
    togli: "Remove the piece",
    alMassimo: "Max it out",
    metti: "Put on a piece of this set:",
    nonOttenibile: "no longer obtainable: the pieces exist in the tables, but no reward gives them",
    pezzi: (n: number, di: number) => `${n}/${di}`,
    nessunSet: "No set completed.",
    volte: (n: number) => (n > 1 ? ` ×${n}` : ""),
    pezzoDi: (parte: string, set: string) => `${parte} · ${set}`,
    iconaPezzo: (parte: string, set: string, rarita: string, stelle: number, piu: number) =>
      `${parte} ${set}, ${rarita}, ${stelle} awakenings, +${piu}`,
    slotVuoto: (parte: string) => `${parte}: no piece`,
  },
});

/**
 * I sei pezzi: i set pronti, gli slot come nel gioco, e sotto il pezzo scelto con
 * tutto quello che il gioco permette di cambiare. Ogni modifica passa da
 * clampPiece, cosi' non si arriva mai a un pezzo che il gioco non ha.
 */
export function GearPanel({
  game,
  gear,
  pieces,
  totals,
  onChange,
  starSrc,
}: {
  game: string;
  gear: GearIndex;
  pieces: GearBuild;
  totals: GearTotals;
  onChange: (next: GearBuild) => void;
  starSrc?: string;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [selected, setSelected] = useState(1);
  const preset = presetOf(gear, pieces);
  const setName = (id: number) => inLingua(gear.sets.find((s) => s.id === id)?.name, locale) ?? String(id);
  const setPiece = (part: number, piece: GearPiece | null) =>
    onChange(pieces.map((current, i) => (i === part - 1 ? (piece ? clampPiece(gear, part, piece) : null) : current)));

  return (
    <Panel title={t.titolo}>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.setPronti}>
        {GEAR_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={preset === p.key}
            onClick={() => onChange(presetBuild(gear, p))}
            className={cx(
              "border px-2.5 py-1 text-[12px]",
              preset === p.key ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-2 hover:text-ink",
            )}
          >
            {inLingua(p.name, locale)}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={pieces.every((piece) => piece === null)}
          title={t.nessunoTitolo}
          onClick={() => onChange(gear.parts.map(() => null))}
          className={cx(
            "border px-2.5 py-1 text-[12px]",
            pieces.every((piece) => piece === null) ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3 hover:text-ink",
          )}
        >
          {t.nessuno}
        </button>
      </div>

      {/* Tre colonne, una per statistica: Attacco (Braccialetto, Anello), Difesa
          (Collana, Orecchini), PS (Cintura, Runa). */}
      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-3 sm:max-w-[360px]">
        {gear.parts.map((part) => {
          const piece = pieces[part.part - 1] ?? null;
          const name = inLingua(part.name, locale) ?? String(part.part);
          const active = selected === part.part;
          return (
            <button
              key={part.part}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(part.part)}
              className={cx(
                "grid w-full justify-items-center gap-1 p-1 text-center",
                active ? "bg-brand-soft outline outline-1 outline-brand" : "hover:bg-paper-3",
              )}
            >
              {piece ? (
                <ItemIcon
                  game={game}
                  icons={gear.icons}
                  kind="gear"
                  object={gear.pieceImages.includes(`${piece.set}_${part.part}`) ? pieceSrc(game, piece.set, part.part) : null}
                  rating={shownRating(piece)}
                  stars={piece.awakening}
                  plus={piece.engraved ? 0 : piece.plus}
                  set={piece.set}
                  size={72}
                  label={t.iconaPezzo(name, setName(piece.set), gear.icons.rarity[String(shownRating(piece))] ?? "", piece.awakening, piece.plus)}
                />
              ) : (
                <EmptySlot game={game} part={part.part} has={gear.slotImages.includes(part.part)} label={t.slotVuoto(name)} />
              )}
              <span className="text-[12px] leading-tight text-ink-2">{name}</span>
            </button>
          );
        })}
      </div>

      <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
        {totals.sets.length === 0 ? <span className="text-ink-3">{t.nessunSet}</span> : null}
        {totals.sets.map(({ set, count, times }) => (
          <span key={set.id} className={cx("inline-flex items-center gap-1", times > 0 ? "text-ink" : "text-ink-3")}>
            <SetBadge game={game} icons={gear.icons} set={set.id} size={18} />
            {inLingua(set.name, locale)} {t.pezzi(count, set.pieces)}
            {times > 0 ? (
              <span className={numeric}>
                · {statName(set.stat, locale)} +{formatStat(set.value * times, locale)}%{t.volte(times)}
              </span>
            ) : null}
          </span>
        ))}
      </p>

      <PieceEditor
        key={selected}
        game={game}
        gear={gear}
        part={selected}
        piece={pieces[selected - 1] ?? null}
        onChange={(piece) => setPiece(selected, piece)}
        starSrc={starSrc}
        locale={locale}
      />
    </Panel>
  );
}

function EmptySlot({ game, part, has, label }: { game: string; part: number; has: boolean; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="grid h-[72px] w-[72px] place-items-center border border-dashed border-rule bg-paper"
    >
      {has ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slotSrc(game, part)} alt="" className="h-10 w-10 object-contain opacity-70" />
      ) : null}
    </span>
  );
}

function PieceEditor({
  game,
  gear,
  part,
  piece,
  onChange,
  starSrc,
  locale,
}: {
  game: string;
  gear: GearIndex;
  part: number;
  piece: GearPiece | null;
  onChange: (piece: GearPiece | null) => void;
  starSrc?: string;
  locale: Locale;
}) {
  const t = TESTI[locale];
  // id fissi, non useId(): vedi stat-calculator.tsx
  const id = `calc-pezzo-${part}`;
  const info = gear.parts.find((p) => p.part === part)!;
  const partName = inLingua(info.name, locale) ?? String(part);
  const sets = [...gear.sets].sort((a, b) => Number(b.obtainable) - Number(a.obtainable));

  const setChips = (value: number | null, pick: (set: number) => void) => (
    <div className="flex flex-wrap gap-1">
      {sets.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-pressed={value === s.id}
          title={s.obtainable ? undefined : t.nonOttenibile}
          onClick={() => pick(s.id)}
          className={cx(
            "inline-flex items-center gap-1 border py-0.5 pr-2 pl-1 text-[12px]",
            value === s.id ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-2 hover:text-ink",
            !s.obtainable && "border-dashed opacity-70",
          )}
        >
          <SetBadge game={game} icons={gear.icons} set={s.id} size={20} />
          {inLingua(s.name, locale)}
          {s.obtainable ? "" : " *"}
        </button>
      ))}
    </div>
  );

  if (!piece) {
    return (
      <div className="grid gap-2 border-t border-rule pt-3">
        <p className="m-0 font-medium text-ink">{partName}</p>
        <p className="m-0 text-ink-3">{t.metti}</p>
        {setChips(null, (set) => onChange(maxPiece(gear, part, set)))}
      </div>
    );
  }

  const row = gearValue(gear, part, piece.rating);
  const main = pieceMain(gear, part, piece);
  const options = optionsOf(gear, part);
  const change = (patch: Partial<GearPiece>) => onChange({ ...piece, ...patch });
  const setAwakening = (awakening: number) => {
    // gli effetti che mancano arrivano come l'effetto della statistica del pezzo al massimo
    const fill = mainOption(gear, part);
    const next = piece.options.slice(0, awakening);
    while (next.length < awakening) next.push({ id: fill.id, value: fill.max });
    change({ awakening, options: next });
  };
  const setRating = (rating: number) => {
    // il tiro resta alla stessa posizione fra minimo e massimo della rarita' nuova
    const to = gearValue(gear, part, rating);
    const ratio = row.max === row.min ? 1 : (piece.roll - row.min) / (row.max - row.min);
    change({ rating, roll: Math.round(to.min + (to.max - to.min) * ratio) });
  };
  const rarityName = (r: number) => gear.icons.rarity[String(r)] ?? String(r);

  return (
    <div className="grid gap-3 border-t border-rule pt-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="m-0 font-medium text-ink">
          {t.pezzoDi(partName, inLingua(gear.sets.find((s) => s.id === piece.set)?.name, locale) ?? "")}
          <span className={cx(numeric, "ml-2 text-ink-2")}>
            {statName(info.stat, locale)} +{formatStat(main, locale)}
          </span>
        </p>
        <span className="flex gap-3">
          <LinkButton onClick={() => onChange(maxPiece(gear, part, piece.set))}>{t.alMassimo}</LinkButton>
          <LinkButton onClick={() => onChange(null)}>{t.togli}</LinkButton>
        </span>
      </div>

      <div className="grid gap-1.5">
        <span className="text-ink-2">{t.set}</span>
        {setChips(piece.set, (set) => change({ set }))}
      </div>

      <ChoiceRow
        legend={t.rarita}
        name={`${id}-rarita`}
        value={piece.rating}
        onChange={setRating}
        options={gear.rules.obtainableRatings.map((r) => ({ value: r, label: rarityName(r), title: rarityName(r) }))}
      />
      <label className={cx("flex items-start gap-2", canEngrave(gear, piece) ? "cursor-pointer text-ink-2" : "text-ink-3")}>
        <input
          type="checkbox"
          checked={piece.engraved}
          disabled={!canEngrave(gear, piece)}
          onChange={(event) => change({ engraved: event.target.checked })}
          className="mt-0.5 accent-[var(--color-brand)]"
        />
        <span>
          {t.inciso}
          <span className="block text-[12px] text-ink-3">{t.incisoNota}</span>
        </span>
      </label>

      <StarRow
        legend={t.risveglio}
        name={`${id}-risveglio`}
        count={gear.rules.awakenings}
        value={piece.awakening}
        onChange={setAwakening}
        starSrc={starSrc}
        title={t.risvegli}
      />
      <ChoiceRow
        legend={t.miglioramento}
        name={`${id}-piu`}
        value={piece.plus}
        onChange={(plus) => change({ plus })}
        options={Array.from({ length: gear.rules.upgradesPerAwakening + 1 }, (_, n) => ({ value: n, label: `+${n}`, title: `+${n}` }))}
      />
      <RangeField
        id={`${id}-base`}
        label={t.base}
        min={row.min}
        max={row.max}
        value={piece.roll}
        onChange={(roll) => change({ roll })}
      />

      <div className="grid gap-2">
        <span className="text-ink-2">
          {t.effetti} <span className="text-[12px] text-ink-3">· {t.effettiNota}</span>
        </span>
        {piece.awakening === 0 ? <p className="m-0 text-[12px] text-ink-3">{t.nessunEffetto}</p> : null}
        {piece.options.slice(0, piece.awakening).map((roll, i) => {
          const option = options.find((o) => o.id === roll.id) ?? options[0]!;
          const setOption = (next: { id: number; value: number }) =>
            change({ options: piece.options.map((o, j) => (j === i ? next : o)) });
          return (
            // una riga per effetto quando la scheda e' larga: cinque effetti in colonna erano alti 450px
            <div key={i} className="grid items-center gap-x-3 gap-y-1 @lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)]">
              <select
                aria-label={t.effetto(i + 1)}
                value={option.id}
                onChange={(event) => {
                  const next = options.find((o) => o.id === Number(event.target.value))!;
                  // al cambio di effetto, il valore resta alla stessa altezza del suo intervallo
                  const ratio = (roll.value - option.min) / (option.max - option.min || 1);
                  setOption({ id: next.id, value: next.min + (next.max - next.min) * ratio });
                }}
                className="w-full min-w-0 border border-rule bg-paper px-2 py-1 text-ink"
              >
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {inLingua(o.name, locale)} ({formatStat(o.min, locale)}–{formatStat(o.max, locale)}%)
                  </option>
                ))}
              </select>
              <RangeField
                id={`${id}-effetto-${i}`}
                label={<span className="sr-only">{t.effetto(i + 1)}</span>}
                min={option.min}
                max={option.max}
                step={gear.rules.optionStep}
                value={roll.value}
                suffix="%"
                onChange={(value) => setOption({ id: option.id, value })}
                after={roll.value >= option.max ? <span className="text-[12px] font-semibold text-gold">MAX</span> : null}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
