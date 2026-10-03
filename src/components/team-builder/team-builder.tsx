"use client";

/**
 * La pagina Squadra: quattro posti e i loro Slot associazione, i comandi di dove
 * si gioca, e sotto come si influenzano gli eroi scelti (team-report.tsx).
 *
 * Componente client perche' la squadra si forma in tempo reale: ogni scelta
 * rifa' i conti (team.ts) senza passare dal server. La squadra sta nell'indirizzo
 * (un link da mandare, `setupToQuery`) e il browser ricorda l'ultima: se
 * l'indirizzo non ne porta una, al primo disegno si riprende quella salvata. Il
 * server disegna la squadra dell'indirizzo, cosi' il primo disegno coincide.
 *
 * Si sceglie un eroe cliccando un posto: si apre il riquadro della scelta, con
 * la ricerca e, per i posti in campo, gli eroi che si incastrano meglio
 * (`suggest`, contati solo sulle passive, come ha chiesto l'utente); per gli
 * associati, i legami dell'eroe del posto.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChoiceRow } from "@/components/heroes/calculator/controls";
import { buttonClass, cx, eyebrow, numeric } from "@/components/ui";
import { heroCardSrc, gameIconSrc } from "@/lib/games/heroes";
import { searchText } from "@/lib/games/hero-terms";
import {
  analyzeTeam,
  CONTENTS,
  emptySetup,
  fateOf,
  fateSuggestions,
  parseSetup,
  setupToQuery,
  suggest,
  TEAM_SLOTS,
  type Suggestion,
  type TeamData,
  type TeamSetup,
} from "@/lib/games/team";
import { useLocale } from "@/lib/i18n/client";
import { inLingua } from "@/lib/i18n/locale";
import { TeamReport } from "./team-report";
import { slotLabel, TESTI, type BuilderData, type BuilderHero, type Texts } from "./team-labels";

type Picking = { readonly kind: "main" | "associate"; readonly slot: number };

export function TeamBuilder({ data, initial }: { data: BuilderData; initial: TeamSetup }) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [setup, setSetup] = useState<TeamSetup>(initial);
  const [picking, setPicking] = useState<Picking | null>(null);
  const [noCollab, setNoCollab] = useState(false);
  const [copied, setCopied] = useState(false);

  const heroes = useMemo(() => new Map(data.heroes.map((hero) => [hero.id, hero])), [data.heroes]);
  const teamData: TeamData = useMemo(() => ({ team: data.team, heroes }), [data.team, heroes]);
  const analysis = useMemo(() => analyzeTeam(setup, teamData), [setup, teamData]);

  // L'indirizzo e il browser. Al primo disegno, se l'indirizzo non porta una
  // squadra, si riprende l'ultima salvata; poi ogni cambio si scrive in tutti e due.
  const storageKey = `gachazone:${data.game}:squadra`;
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (initial.mains.some(Boolean) || initial.associates.some(Boolean)) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const params = new URLSearchParams(saved);
      setSetup(parseSetup((key) => params.get(key), (id) => heroes.has(id)));
    } catch {
      // il browser rifiuta: si parte vuoti
    }
  }, [initial, storageKey, heroes]);
  useEffect(() => {
    if (!restored.current) return;
    const query = setupToQuery(setup);
    window.history.replaceState(window.history.state, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
    try {
      window.localStorage.setItem(storageKey, query);
    } catch {
      // niente da fare: resta l'indirizzo
    }
  }, [setup, storageKey]);

  const update = (change: Partial<TeamSetup>) => setSetup((before) => ({ ...before, ...change }));

  function place(hero: string) {
    if (!picking) return;
    setSetup((before) => {
      const key = picking.kind === "main" ? "mains" : "associates";
      const list = [...before[key]];
      list[picking.slot] = hero;
      return { ...before, [key]: list };
    });
    setPicking(null);
  }

  function remove(kind: Picking["kind"], slot: number) {
    setSetup((before) => {
      const key = kind === "main" ? "mains" : "associates";
      const list = [...before[key]];
      list[slot] = null;
      return { ...before, [key]: list };
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // senza appunti il link resta nella barra dell'indirizzo
    }
  }

  const filled = setup.mains.some(Boolean);

  return (
    <div>
      <Controls t={t} data={data} setup={setup} update={update} />

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyLink} className={buttonClass("outline", "sm")} disabled={!filled}>
          {copied ? t.copiato : t.copia}
        </button>
        <button
          type="button"
          onClick={() => {
            setSetup((before) => ({ ...emptySetup(), content: before.content, bench: before.bench, ultimate: before.ultimate, relics: before.relics }));
            setPicking(null);
          }}
          className={buttonClass("ghost", "sm")}
          disabled={!filled && !setup.associates.some(Boolean)}
        >
          {t.svuota}
        </button>
      </div>

      <h2 className="sr-only">{t.resoconto}</h2>
      <ol className="mt-6 grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 sm:max-w-[820px] sm:grid-cols-4">
        {Array.from({ length: TEAM_SLOTS }, (_, slot) => {
          const main = setup.mains[slot] ? heroes.get(setup.mains[slot]!) : undefined;
          const associate = setup.associates[slot] ? heroes.get(setup.associates[slot]!) : undefined;
          const fate = main && associate ? fateOf(data.fates, main.id, associate.id) : undefined;
          const bench = setup.bench && slot === TEAM_SLOTS - 1;
          return (
            <li key={slot} className="row-span-4 grid min-w-0 grid-rows-subgrid content-start">
              <p className={cx(eyebrow, "m-0 mb-1.5", bench && "text-gold")}>{slotLabel(slot, setup.bench, t)}</p>
              <Slot
                t={t}
                game={data.game}
                hero={main}
                size="main"
                active={picking?.kind === "main" && picking.slot === slot}
                onPick={() => setPicking({ kind: "main", slot })}
                onRemove={() => remove("main", slot)}
                label={bench ? t.scegliPanchina : t.scegliPosto(slot + 1)}
              />
              <p className={cx(eyebrow, "m-0 mt-3 mb-1.5")}>{t.associato}</p>
              <div className="min-w-0">
                <Slot
                  t={t}
                  game={data.game}
                  hero={associate}
                  size="associate"
                  active={picking?.kind === "associate" && picking.slot === slot}
                  onPick={() => setPicking({ kind: "associate", slot })}
                  onRemove={() => remove("associate", slot)}
                  label={main ? t.scegliAssociato(main.name) : t.scegliAssociatoVuoto(slot + 1)}
                />
                {fate ? (
                  <p className="mt-1.5 mb-0 text-[11px] leading-snug text-up">
                    {inLingua(data.fates.effects[fate[1]]?.name, locale)}
                    {fate[2] ? ` · ${t.combinato}` : ""}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {picking ? (
        <Picker
          key={`${picking.kind}-${picking.slot}`}
          t={t}
          data={data}
          heroes={heroes}
          teamData={teamData}
          setup={setup}
          picking={picking}
          noCollab={noCollab}
          setNoCollab={setNoCollab}
          onPlace={place}
          onClose={() => setPicking(null)}
        />
      ) : null}

      {filled ? (
        <TeamReport t={t} data={data} heroes={heroes} setup={setup} analysis={analysis} />
      ) : (
        <p className="mt-6 max-w-[68ch] text-[13px] text-ink-3">{t.vuota}</p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- comandi -- */

function Controls({
  t,
  data,
  setup,
  update,
}: {
  t: Texts;
  data: BuilderData;
  setup: TeamSetup;
  update: (change: Partial<TeamSetup>) => void;
}) {
  return (
    <div className="grid max-w-[820px] gap-3 border border-rule bg-paper-2 p-4 text-[13px]">
      <ChoiceRow
        legend={t.contenuto}
        name="squadra-contenuto"
        value={setup.content}
        onChange={(content) => update({ content })}
        options={CONTENTS.map((value) => ({ value, label: t.contenuti[value], title: t.contenutiTitolo[value] }))}
      />
      <ChoiceRow
        legend={t.quarto}
        name="squadra-panchina"
        value={setup.bench ? "panchina" : "campo"}
        onChange={(value) => update({ bench: value === "panchina" })}
        options={[
          { value: "panchina", label: t.inPanchina, title: t.quartoTitolo.panchina },
          { value: "campo", label: t.inCampo, title: t.quartoTitolo.campo },
        ]}
      />
      <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
        <legend className="float-left mr-3 p-0 text-ink-2">{t.ultimate}</legend>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <label key={n} className="cursor-pointer" title={t.ultimateTitolo(n)}>
              <input
                type="radio"
                name="squadra-ultimate"
                value={n}
                checked={setup.ultimate === n}
                onChange={() => update({ ultimate: n })}
                className="peer sr-only"
              />
              <span className="sr-only">{t.ultimateTitolo(n)}</span>
              <span
                aria-hidden
                className={cx(
                  "grid h-7 min-w-7 place-items-center rounded-[3px] px-1 peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                  !data.stones && cx(numeric, "border text-[12px]", setup.ultimate === n ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3"),
                )}
              >
                {data.stones ? (
                  // eslint-disable-next-line @next/next/no-img-element -- le pietre del gioco, gia' ritagliate
                  <img
                    src={gameIconSrc(data.game, "carta", `pietra_${n}`)}
                    alt=""
                    width={18}
                    height={18}
                    className={cx("h-[18px] w-[18px] object-contain transition-opacity", n > setup.ultimate && "opacity-25 grayscale")}
                  />
                ) : (
                  n
                )}
              </span>
            </label>
          ))}
        </div>
        <span className={cx(numeric, "text-[12px] text-ink-3")}>{setup.ultimate}/6</span>
      </fieldset>
      <ChoiceRow
        legend={t.reliquie}
        name="squadra-reliquie"
        value={setup.relics ? "si" : "no"}
        onChange={(value) => update({ relics: value === "si" })}
        options={[
          { value: "si", label: t.si, title: t.reliquieTitolo.si },
          { value: "no", label: t.no, title: t.reliquieTitolo.no },
        ]}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- posti -- */

function Slot({
  t,
  game,
  hero,
  size,
  active,
  onPick,
  onRemove,
  label,
}: {
  t: Texts;
  game: string;
  hero: BuilderHero | undefined;
  size: "main" | "associate";
  active: boolean;
  onPick: () => void;
  onRemove: () => void;
  label: string;
}) {
  const width = size === "main" ? "max-w-[128px]" : "max-w-[96px]";
  if (!hero) {
    return (
      <button
        type="button"
        onClick={onPick}
        aria-label={label}
        aria-pressed={active}
        className={cx(
          "grid aspect-square w-full cursor-pointer place-items-center self-start border border-dashed bg-paper-2 font-display text-3xl transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          active ? "border-brand text-brand" : "border-rule text-ink-3/60 hover:border-ink-3 hover:text-ink",
          width,
        )}
      >
        +
      </button>
    );
  }
  return (
    <div className={cx("relative w-full self-start", width)}>
      <button
        type="button"
        onClick={onPick}
        aria-label={`${t.cambia}: ${hero.name}`}
        aria-pressed={active}
        className={cx(
          "group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita', come nella griglia Eroi */}
        <img
          src={heroCardSrc(game, hero.id)}
          srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
          alt=""
          width={128}
          height={128}
          decoding="async"
          className={cx(
            "block w-full bg-paper-2 outline-offset-2 transition-transform group-hover:-translate-y-0.5",
            active && "outline-2 outline-brand",
          )}
        />
        <span
          className="mt-1.5 block truncate text-[11px] leading-tight text-ink-3"
          title={hero.epithet}
          style={hero.color ? { color: hero.color } : undefined}
        >
          {hero.epithet}
        </span>
        <span className="block text-[12px] font-semibold leading-tight group-hover:text-brand">{hero.name}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t.togliTitolo(hero.name)}
        title={t.togliTitolo(hero.name)}
        className="absolute top-1 right-1 grid h-6 w-6 cursor-pointer place-items-center bg-paper/85 text-[14px] leading-none text-ink hover:bg-brand hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

/* --------------------------------------------------------------- la scelta -- */

function Picker({
  t,
  data,
  heroes,
  teamData,
  setup,
  picking,
  noCollab,
  setNoCollab,
  onPlace,
  onClose,
}: {
  t: Texts;
  data: BuilderData;
  heroes: ReadonlyMap<string, BuilderHero>;
  teamData: TeamData;
  setup: TeamSetup;
  picking: Picking;
  noCollab: boolean;
  setNoCollab: (value: boolean) => void;
  onPlace: (hero: string) => void;
  onClose: () => void;
}) {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    panel.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    panel.current?.querySelector("input")?.focus({ preventScroll: true });
  }, []);

  // i personaggi gia' in squadra, tolto il posto che si sta scegliendo
  const usedGroups = useMemo(() => {
    const ids = [
      ...setup.mains.filter((_, i) => !(picking.kind === "main" && i === picking.slot)),
      ...setup.associates.filter((_, i) => !(picking.kind === "associate" && i === picking.slot)),
    ];
    return new Set(
      ids.map((id) => (id ? heroes.get(id)?.group : undefined)).filter((group): group is string => !!group),
    );
  }, [setup, picking, heroes]);

  const pool = useMemo(
    () => data.heroes.filter((hero) => !usedGroups.has(hero.group) && !(noCollab && hero.collab)),
    [data.heroes, usedGroups, noCollab],
  );

  const suggestions: Suggestion[] = useMemo(
    () => (picking.kind === "main" ? suggest(setup, picking.slot, pool, teamData, 12) : []),
    [picking, setup, pool, teamData],
  );

  const main = picking.kind === "associate" && setup.mains[picking.slot] ? heroes.get(setup.mains[picking.slot]!) : undefined;
  const bonds = useMemo(
    () =>
      main
        ? fateSuggestions(data.fates, main.id, heroes, usedGroups).filter(([id]) => !(noCollab && heroes.get(id)?.collab))
        : [],
    [main, data.fates, heroes, usedGroups, noCollab],
  );

  const found = useMemo(() => {
    const words = searchText(query);
    if (!words) return pool;
    return pool.filter((hero) => hero.search.includes(words));
  }, [pool, query]);
  const shown = found.slice(0, 48);

  const title =
    picking.kind === "main"
      ? setup.bench && picking.slot === TEAM_SLOTS - 1
        ? t.scegliPanchina
        : t.scegliPosto(picking.slot + 1)
      : main
        ? t.scegliAssociato(main.name)
        : t.scegliAssociatoVuoto(picking.slot + 1);

  return (
    <section
      ref={panel}
      aria-label={title}
      className="p5-corner mt-6 max-w-[980px] scroll-mt-24 border border-rule border-t-[3px] border-t-brand bg-paper-2 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 font-display text-[18px] font-extrabold uppercase">{title}</h3>
        <button type="button" onClick={onClose} className={buttonClass("ghost", "sm")}>
          {t.chiudi}
        </button>
      </div>

      {picking.kind === "main" ? (
        <div className="mt-3">
          <p className={cx(eyebrow, "m-0")}>{t.suggeriti}</p>
          <p className="mt-1 mb-2 max-w-[72ch] text-[12px] text-ink-3">{t.suggeritiSpiega}</p>
          {suggestions.length === 0 ? (
            <p className="m-0 text-[13px] text-ink-3">{t.nessunSuggerimento}</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((s) => {
                const hero = heroes.get(s.hero)!;
                const givesTo = new Set(s.gives.map((i) => i.to)).size;
                const from = new Set(s.receives.map((i) => i.from)).size;
                const lights = new Set(s.enables.map((i) => i.to)).size;
                const litBy = new Set(s.enabledBy.map((i) => i.from)).size;
                const reasons = [
                  givesTo ? t.daA(givesTo) : null,
                  from ? t.riceveDa(from) : null,
                  lights ? t.accende(lights) : null,
                  litBy ? t.accesoDa(litBy) : null,
                ].filter(Boolean);
                return (
                  <li key={s.hero}>
                    <button
                      type="button"
                      onClick={() => onPlace(s.hero)}
                      className="flex w-full cursor-pointer items-center gap-2.5 border border-rule bg-paper p-1.5 text-left hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                      <img src={heroCardSrc(data.game, hero.id)} alt="" width={44} height={44} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] text-ink-3" style={hero.color ? { color: hero.color } : undefined}>
                          {hero.epithet}
                        </span>
                        <span className="block truncate text-[13px] font-semibold text-ink">{hero.name}</span>
                        <span className="block text-[11px] leading-snug text-ink-3">{reasons.join(" · ")}</span>
                      </span>
                      <span title={t.guadagnoTitolo(s.gain)} className={cx(numeric, "shrink-0 bg-brand px-1.5 py-0.5 text-[12px] font-bold text-white")}>
                        {t.guadagno(s.gain)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : main ? (
        <div className="mt-3">
          <p className={cx(eyebrow, "m-0")}>{t.legami}</p>
          <p className="mt-1 mb-2 text-[12px] text-ink-3">{t.legamiSpiega}</p>
          {bonds.length === 0 ? (
            <p className="m-0 text-[13px] text-ink-3">{t.nessunLegame}</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {bonds.map(([id, effect, combined]) => {
                const hero = heroes.get(id)!;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onPlace(id)}
                      className="flex w-full cursor-pointer items-center gap-2.5 border border-rule bg-paper p-1.5 text-left hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                      <img src={heroCardSrc(data.game, id)} alt="" width={44} height={44} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">{hero.name}</span>
                        <span className="block truncate text-[11px] text-up">
                          {inLingua(data.fates.effects[effect]?.name, locale)}
                          {combined ? ` · ${t.combinato}` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className={cx(eyebrow, "m-0")}>{t.tutti(pool.length)}</p>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-2">
          <input
            type="checkbox"
            checked={noCollab}
            onChange={(event) => setNoCollab(event.target.checked)}
            className="accent-[var(--color-brand)]"
          />
          {t.senzaCollab}
        </label>
      </div>
      <label htmlFor="squadra-cerca" className="sr-only">
        {t.cercaEtichetta}
      </label>
      <input
        id="squadra-cerca"
        type="search"
        autoComplete="off"
        value={query}
        placeholder={t.cerca}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 h-10 w-full max-w-[420px] border border-rule bg-paper px-3 text-[14px] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
      />
      <p className="mt-1.5 mb-2 text-[12px] text-ink-3">
        {found.length === 0 ? t.nessuno : t.risultati(shown.length, found.length)}
      </p>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2 p-0">
        {shown.map((hero) => (
          <li key={hero.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onPlace(hero.id)}
              title={`${hero.epithet} ${hero.name}`}
              className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-brand"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
              <img
                src={heroCardSrc(data.game, hero.id)}
                alt=""
                width={76}
                height={76}
                loading="lazy"
                className="block w-full transition-transform group-hover:-translate-y-0.5"
              />
              <span className="mt-1 block truncate text-[11px] leading-tight text-ink-2 group-hover:text-brand">{hero.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 mb-0 text-[12px]">
        <Link href={`/${data.game}/eroi`} className="text-brand underline-offset-2 hover:underline">
          {t.griglia} →
        </Link>
      </p>
    </section>
  );
}
