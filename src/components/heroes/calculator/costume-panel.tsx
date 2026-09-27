"use client";

import { useId, useState } from "react";
import { cx, numeric } from "@/components/ui";
import type { Costume, CostumeKind, ItemIconLayers } from "@/lib/games/gear-types";
import {
  COSTUME_KINDS,
  costumeFlat,
  costumeLevel,
  costumeMaxStep,
  startCostumes,
  type CostumeBuild,
} from "@/lib/games/gear";
import { costumeIndexOf, type CalculatorData, type HeroBuild } from "@/lib/games/hero-build";
import { useLocale } from "@/lib/i18n/client";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";
import { ChoiceRow, LinkButton, Panel, RangeField } from "./controls";
import { ItemIcon, costumeSrc } from "./item-icon";
import { formatStat, statName } from "./stat-rows";

const TESTI = testi({
  it: {
    titolo: "Costumi registrati",
    partenza: "I cinque migliori, al massimo",
    tipo: { body: "Corpo", weapon: "Arma", head: "Testa" } satisfies Record<CostumeKind, string>,
    reliquia: "Reliquia sacra",
    posto: (tipo: string, n: number) => `${tipo}, posto ${n}`,
    vuoto: "vuoto",
    nota: "Nel gioco contano solo i costumi registrati, fino a cinque per tipo. Al massimo danno tutti lo stesso valore (i LR di più): cambiarli cambia soprattutto le percentuali.",
    potenziamento: "Potenziamento",
    livello: (rarita: string, livello: number) => `${rarita} · liv. ${livello}`,
    togli: "Togli",
    alMassimo: "Al massimo",
    scegli: "Registra un altro costume:",
    nessunAltro: "Non ci sono altri costumi di questo tipo.",
    senzaNome: (id: string) => `Costume ${id} (senza nome nel client)`,
    nessunaPercentuale: "nessuna percentuale",
    nessunaReliquia: "Nessuna",
    potenziamenti: "Potenziamenti",
    potenziamentiTitolo: (n: number) => (n === 0 ? "nessun potenziamento" : `${n} potenziamenti`),
    registrato: "già registrato",
  },
  en: {
    titolo: "Registered costumes",
    partenza: "The five best, maxed",
    tipo: { body: "Outfit", weapon: "Weapon", head: "Headgear" } satisfies Record<CostumeKind, string>,
    reliquia: "Holy Relic",
    posto: (tipo: string, n: number) => `${tipo}, slot ${n}`,
    vuoto: "empty",
    nota: "In the game only registered costumes count, up to five per type. Maxed out they all give the same value (LR ones more): changing them mostly changes the percentages.",
    potenziamento: "Enhancement",
    livello: (rarita: string, livello: number) => `${rarita} · Lv. ${livello}`,
    togli: "Remove",
    alMassimo: "Max it out",
    scegli: "Register another costume:",
    nessunAltro: "There are no other costumes of this type.",
    senzaNome: (id: string) => `Costume ${id} (no name in the client)`,
    nessunaPercentuale: "no percentages",
    nessunaReliquia: "None",
    potenziamenti: "Enhancements",
    potenziamentiTitolo: (n: number) => (n === 0 ? "no enhancement" : `${n} enhancements`),
    registrato: "already registered",
  },
});

type Slot = { kind: CostumeKind; index: number } | "relic";

export function costumeName(costume: Costume | undefined, id: string, locale: Locale): string {
  return inLingua(costume?.name, locale) ?? TESTI[locale].senzaNome(id);
}

export function percentsText(costume: Costume, locale: Locale): string {
  const parts = Object.entries(costume.percents).map(([stat, value]) => `${statName(stat, locale)} +${formatStat(value, locale)}%`);
  return parts.length ? parts.join(" · ") : TESTI[locale].nessunaPercentuale;
}

/**
 * I costumi registrati: tanti posti quanti ne da' la skin (5/5/5 e la reliquia),
 * e sotto il posto scelto, col suo potenziamento e l'elenco dei costumi
 * dell'eroe con cui cambiarlo. Si parte dai cinque delle statistiche massime.
 */
export function CostumePanel({
  game,
  icons,
  data,
  build,
  onChange,
}: {
  game: string;
  icons: ItemIconLayers;
  data: CalculatorData;
  build: HeroBuild;
  onChange: (patch: Pick<HeroBuild, "costumes"> | Pick<HeroBuild, "relic">) => void;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [selected, setSelected] = useState<Slot>({ kind: "body", index: 0 });
  const index = costumeIndexOf(data);
  const hero = data.costumes.hero;
  const setCostumes = (next: CostumeBuild) => onChange({ costumes: next });

  const slotButton = (kind: CostumeKind, i: number) => {
    const choice = build.costumes[kind][i] ?? null;
    const costume = choice ? data.costumes.items[choice.id] : undefined;
    const active = selected !== "relic" && selected.kind === kind && selected.index === i;
    const label = t.posto(t.tipo[kind], i + 1);
    return (
      <button
        key={`${kind}-${i}`}
        type="button"
        aria-pressed={active}
        onClick={() => setSelected({ kind, index: i })}
        className={cx("rounded-[4px] p-0.5", active ? "bg-brand-soft outline outline-1 outline-brand" : "hover:bg-paper-3")}
      >
        {choice && costume ? (
          <ItemIcon
            game={game}
            icons={icons}
            kind="costume"
            object={costume.icon ? costumeSrc(game, choice.id) : null}
            rating={costume.rarity}
            mark={costume.shared ? "condiviso" : costume.set ? "set" : "costume"}
            size={52}
            label={`${label}: ${costumeName(costume, choice.id, locale)}`}
          />
        ) : (
          <span
            role="img"
            aria-label={`${label}: ${t.vuoto}`}
            className="grid h-[52px] w-[52px] place-items-center rounded-[6px] border border-dashed border-rule bg-paper text-[18px] text-ink-3"
          >
            +
          </span>
        )}
      </button>
    );
  };

  return (
    <Panel
      title={t.titolo}
      action={<LinkButton onClick={() => setCostumes(startCostumes(index, data.heroId))}>{t.partenza}</LinkButton>}
    >
      <div className="grid gap-2">
        {COSTUME_KINDS.map((kind) =>
          hero.slots[kind] > 0 ? (
            <div key={kind} className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-2">
              <span className="text-ink-2">{t.tipo[kind]}</span>
              <div className="flex flex-wrap gap-1">{Array.from({ length: hero.slots[kind] }, (_, i) => slotButton(kind, i))}</div>
            </div>
          ) : null,
        )}
        {data.relics.length > 0 ? (
          <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-2">
            <span className="text-ink-2">{t.reliquia}</span>
            <div>
              <button
                type="button"
                aria-pressed={selected === "relic"}
                onClick={() => setSelected("relic")}
                className={cx("rounded-[4px] p-0.5", selected === "relic" ? "bg-brand-soft outline outline-1 outline-brand" : "hover:bg-paper-3")}
              >
                <RelicThumb game={game} data={data} relic={build.relic} label={t.reliquia} empty={t.vuoto} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <p className="m-0 max-w-[70ch] text-[12px] text-ink-3">{t.nota}</p>

      {selected === "relic" ? (
        <RelicEditor data={data} relic={build.relic} onChange={(relic) => onChange({ relic })} locale={locale} />
      ) : (
        <CostumeEditor
          key={`${selected.kind}-${selected.index}`}
          game={game}
          icons={icons}
          data={data}
          build={build.costumes}
          kind={selected.kind}
          slot={selected.index}
          onChange={setCostumes}
          locale={locale}
        />
      )}
    </Panel>
  );
}

function RelicThumb({
  game,
  data,
  relic,
  label,
  empty,
}: {
  game: string;
  data: CalculatorData;
  relic: HeroBuild["relic"];
  label: string;
  empty: string;
}) {
  const found = relic ? data.relics.find((r) => r.id === relic.id) : undefined;
  if (!found) {
    return (
      <span
        role="img"
        aria-label={`${label}: ${empty}`}
        className="grid h-[52px] w-[52px] place-items-center rounded-[6px] border border-dashed border-rule bg-paper text-[18px] text-ink-3"
      >
        +
      </span>
    );
  }
  return found.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/eroi/${game}/reliquie/${found.id}.png`} alt={label} width={52} height={52} className="h-[52px] w-[52px] rounded-[6px] bg-paper object-contain" />
  ) : (
    <span className="grid h-[52px] w-[52px] place-items-center rounded-[6px] bg-paper text-[11px] text-ink-2">{label}</span>
  );
}

function RelicEditor({
  data,
  relic,
  onChange,
  locale,
}: {
  data: CalculatorData;
  relic: HeroBuild["relic"];
  onChange: (relic: HeroBuild["relic"]) => void;
  locale: Locale;
}) {
  const t = TESTI[locale];
  const id = useId();
  const found = relic ? data.relics.find((r) => r.id === relic.id) : undefined;
  return (
    <div className="grid gap-3 border-t border-rule pt-3">
      <ChoiceRow
        legend={t.reliquia}
        name={`${id}-reliquia`}
        value={relic?.id ?? ""}
        onChange={(value) => {
          const next = data.relics.find((r) => r.id === value);
          onChange(next ? { id: next.id, upgrades: next.upgrades.length } : null);
        }}
        options={[
          { value: "", label: t.nessunaReliquia, title: t.nessunaReliquia },
          ...data.relics.map((r) => ({ value: r.id, label: inLingua(r.name, locale) ?? r.id, title: inLingua(r.name, locale) ?? r.id })),
        ]}
      />
      {found && relic ? (
        <ChoiceRow
          legend={t.potenziamenti}
          name={`${id}-potenziamenti`}
          value={relic.upgrades}
          onChange={(upgrades) => onChange({ id: found.id, upgrades })}
          options={Array.from({ length: found.upgrades.length + 1 }, (_, n) => ({ value: n, label: `+${n}`, title: t.potenziamentiTitolo(n) }))}
        />
      ) : null}
    </div>
  );
}

function CostumeEditor({
  game,
  icons,
  data,
  build,
  kind,
  slot,
  onChange,
  locale,
}: {
  game: string;
  icons: ItemIconLayers;
  data: CalculatorData;
  build: CostumeBuild;
  kind: CostumeKind;
  slot: number;
  onChange: (next: CostumeBuild) => void;
  locale: Locale;
}) {
  const t = TESTI[locale];
  const id = useId();
  const index = costumeIndexOf(data);
  const choice = build[kind][slot] ?? null;
  const costume = choice ? data.costumes.items[choice.id] : undefined;
  const taken = new Set(build[kind].flatMap((c, i) => (c && i !== slot ? [c.id] : [])));
  const others = data.costumes.hero.all[kind].filter((cid) => cid !== choice?.id);
  const put = (next: { id: string; step: number } | null) =>
    onChange({ ...build, [kind]: build[kind].map((c, i) => (i === slot ? next : c)) });
  const rarityName = (r: number) => icons.rarity[String(r)] ?? String(r);
  const flat = data.costumes.flatStat[kind];

  return (
    <div className="grid gap-3 border-t border-rule pt-3">
      {choice && costume ? (
        <div className="grid gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="m-0 font-medium text-ink">
              {costumeName(costume, choice.id, locale)}
              <span className={cx(numeric, "ml-2 text-ink-2")}>
                {statName(flat, locale)} +{formatStat(costumeFlat(index, costume, choice.step), locale)}
              </span>
            </p>
            <span className="flex gap-3">
              <LinkButton onClick={() => put({ id: choice.id, step: costumeMaxStep(index, costume) })}>{t.alMassimo}</LinkButton>
              <LinkButton onClick={() => put(null)}>{t.togli}</LinkButton>
            </span>
          </div>
          <p className="m-0 text-[12px] text-ink-2">{percentsText(costume, locale)}</p>
          <RangeField
            id={`${id}-livello`}
            label={t.potenziamento}
            min={0}
            max={costumeMaxStep(index, costume)}
            value={choice.step}
            onChange={(step) => put({ id: choice.id, step })}
            after={
              <span className={cx(numeric, "text-[12px] text-ink-3")}>
                {(() => {
                  const { rarity, level } = costumeLevel(index, costume, choice.step);
                  return t.livello(rarityName(rarity), level);
                })()}
              </span>
            }
          />
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <span className="text-ink-2">{t.scegli}</span>
        {others.length === 0 ? <p className="m-0 text-[12px] text-ink-3">{t.nessunAltro}</p> : null}
        <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2">
          {others.map((cid) => {
            const other = data.costumes.items[cid];
            if (!other) return null;
            const already = taken.has(cid);
            return (
              <li key={cid}>
                <button
                  type="button"
                  disabled={already}
                  onClick={() => put({ id: cid, step: costumeMaxStep(index, other) })}
                  className="flex w-full items-center gap-2 rounded-[4px] p-1 text-left hover:bg-paper-3 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ItemIcon
                    game={game}
                    icons={icons}
                    kind="costume"
                    object={other.icon ? costumeSrc(game, cid) : null}
                    rating={other.rarity}
                    mark={other.shared ? "condiviso" : other.set ? "set" : "costume"}
                    size={40}
                    label={costumeName(other, cid, locale)}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] text-ink">{costumeName(other, cid, locale)}</span>
                    <span className="block text-[11px] leading-tight text-ink-3">
                      {already ? t.registrato : percentsText(other, locale)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
