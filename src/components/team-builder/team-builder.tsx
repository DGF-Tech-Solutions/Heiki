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
 *
 * L'ordine della pagina (10/10): prima la squadra, che e' lo strumento; sotto i
 * suoi comandi (link, svuota), poi la scelta, poi dove si gioca, e in fondo il
 * resoconto. I posti sono quelli di una schermata di scelta del personaggio
 * (party-slot.tsx), e il primo libero e' segnato in rosso: dice da dove
 * cominciare.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { IconCheck, IconChevronRight, IconClose, IconLink } from "@/components/icons";
import { AssociateStrip, ChooseMark, PartyPanel } from "@/components/party-slot";
import { buttonClass, chipClass, cx, eyebrow, heroNameClass, Input, numeric, RadioChips } from "@/components/ui";
import { boxSize, ownsHero, type HeroBox } from "@/lib/games/hero-box";
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
/** l'ultimo eroe messo in un posto: solo lui entra col taglio del palco */
type Placed = Picking & { readonly hero: string };

export function TeamBuilder({ data }: { data: BuilderData }) {
  const locale = useLocale();
  const t = TESTI[locale];
  // La squadra di partenza dall'indirizzo di adesso, non da un valore passato
  // dalla pagina: fino all'11/10, tornando con Indietro, Next ridisegnava la
  // pagina com'era arrivata dal server, e la squadra di allora si riscriveva
  // nell'indirizzo e nel browser sopra le modifiche fatte dopo
  const searchParams = useSearchParams();
  const [initial] = useState(() =>
    parseSetup((key) => searchParams.get(key), (id) => data.heroes.some((hero) => hero.id === id)),
  );
  const [setup, setSetup] = useState<TeamSetup>(initial);
  const [picking, setPicking] = useState<Picking | null>(null);
  const [noCollab, setNoCollab] = useState(false);
  // «Solo i miei»: la scelta guarda solo il tuo box (use-hero-box.ts), se ne hai uno
  const [box] = useHeroBox(data.game);
  const [onlyMine, setOnlyMine] = useState(false);
  const [copied, setCopied] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);

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
    setPlaced({ ...picking, hero });
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
  const chosen = filled || setup.associates.some(Boolean);
  // il primo posto in campo ancora libero: e' quello che il posto vuoto invita a scegliere
  const next = picking ? -1 : setup.mains.findIndex((id) => !id);
  const isPlaced = (kind: Picking["kind"], slot: number, hero: string | undefined) =>
    !!hero && placed?.kind === kind && placed.slot === slot && placed.hero === hero;

  return (
    <div>
      <h2 className="sr-only">{t.resoconto}</h2>
      {/*
        Ogni posto e' una colonna di tre righe, e le righe sono quelle della
        griglia (subgrid): l'associato sta alla stessa altezza in tutte le
        colonne anche quando un nome va a capo.
      */}
      <ol className="m-0 grid max-w-[1100px] list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:grid-cols-4 sm:gap-x-4">
        {Array.from({ length: TEAM_SLOTS }, (_, slot) => {
          const main = setup.mains[slot] ? heroes.get(setup.mains[slot]!) : undefined;
          const associate = setup.associates[slot] ? heroes.get(setup.associates[slot]!) : undefined;
          const fate = main && associate ? fateOf(data.fates, main.id, associate.id) : undefined;
          const bench = setup.bench && slot === TEAM_SLOTS - 1;
          const mainActive = picking?.kind === "main" && picking.slot === slot;
          const associateActive = picking?.kind === "associate" && picking.slot === slot;
          return (
            <li key={slot} className="row-span-3 grid min-w-0 grid-rows-subgrid content-start gap-y-2">
              <Slot
                t={t}
                hero={main}
                active={mainActive}
                onPick={() => setPicking({ kind: "main", slot })}
                onRemove={() => remove("main", slot)}
                label={bench ? t.scegliPanchina : t.scegliPosto(slot + 1)}
              >
                <PartyPanel
                  game={data.game}
                  number={slot + 1}
                  label={slotLabel(slot, setup.bench, t)}
                  bench={bench}
                  hero={main}
                  state={mainActive ? "active" : slot === next ? "next" : undefined}
                  enter={isPlaced("main", slot, main?.id)}
                  empty={<ChooseMark text={t.scegli} strong={mainActive || slot === next} />}
                />
              </Slot>
              <Slot
                t={t}
                hero={associate}
                active={associateActive}
                onPick={() => setPicking({ kind: "associate", slot })}
                onRemove={() => remove("associate", slot)}
                label={main ? t.scegliAssociato(main.name) : t.scegliAssociatoVuoto(slot + 1)}
                small
              >
                <AssociateStrip
                  game={data.game}
                  label={t.associato}
                  hero={associate}
                  emptyText={t.scegli}
                  choosable
                  active={associateActive}
                  enter={isPlaced("associate", slot, associate?.id)}
                />
              </Slot>
              {fate ? (
                <p className="m-0 text-[12px] leading-snug text-up">
                  {inLingua(data.fates.effects[fate[1]]?.name, locale)}
                  {fate[2] ? ` · ${t.combinato}` : ""}
                </p>
              ) : (
                <span aria-hidden />
              )}
            </li>
          );
        })}
      </ol>

      {/*
        Sotto la squadra: il link e «Svuota» quando c'e' qualcosa da mandare o da
        togliere, prima l'invito a scegliere. Prima «Copia il link» stava grigio
        e spento finche' non si sceglieva un eroe, e sembrava rotto (10/10).
      */}
      <div className="mt-4 flex min-h-9 max-w-[1100px] flex-wrap items-center gap-x-3 gap-y-2">
        {filled ? (
          <button type="button" onClick={copyLink} className={buttonClass("outline", "sm")}>
            {copied ? <IconCheck size={13} /> : <IconLink size={14} />}
            {copied ? t.copiato : t.copia}
          </button>
        ) : null}
        {chosen ? (
          <button
            type="button"
            onClick={() => {
              setSetup((before) => ({ ...emptySetup(), content: before.content, bench: before.bench, ultimate: before.ultimate, relics: before.relics }));
              setPicking(null);
            }}
            className={buttonClass("ghost", "sm")}
          >
            {t.svuota}
          </button>
        ) : null}
        {!filled ? <p className="m-0 max-w-[48ch] text-[13px] text-ink-2">{t.vuota}</p> : null}
        <span role="status" className="sr-only">
          {copied ? t.copiato : ""}
        </span>
      </div>

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
          box={box}
          onlyMine={onlyMine}
          setOnlyMine={setOnlyMine}
          onPlace={place}
          onClose={() => setPicking(null)}
        />
      ) : null}

      <Controls t={t} data={data} setup={setup} update={update} />

      {filled ? <TeamReport t={t} data={data} heroes={heroes} setup={setup} analysis={analysis} /> : null}
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
  // Una fila di scelte e non un riquadro: sono le condizioni della partita, e
  // cambiano il resoconto qui sotto, non la squadra. Prima stavano in testa, e
  // sul telefono spingevano i posti sotto lo schermo (10/10).
  return (
    <div className="mt-8 flex max-w-[1100px] flex-wrap items-center gap-x-6 gap-y-3 border-y border-rule-2 py-3 text-[13px]">
      <RadioChips
        legend={t.contenuto}
        name="squadra-contenuto"
        value={setup.content}
        onChange={(content) => update({ content })}
        options={CONTENTS.map((value) => ({ value, label: t.contenuti[value], title: t.contenutiTitolo[value] }))}
      />
      <RadioChips
        legend={t.quarto}
        name="squadra-panchina"
        value={setup.bench ? "panchina" : "campo"}
        onChange={(value) => update({ bench: value === "panchina" })}
        options={[
          { value: "panchina", label: t.inPanchina, title: t.quartoTitolo.panchina },
          { value: "campo", label: t.inCampo, title: t.quartoTitolo.campo },
        ]}
      />
      <fieldset className="m-0 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 border-0 p-0">
        <legend className={cx(eyebrow, "float-left mr-1.5 p-0 leading-9")}>{t.ultimate}</legend>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <label
              key={n}
              className="cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
              title={t.ultimateTitolo(n)}
            >
              <input
                type="radio"
                name="squadra-ultimate"
                value={n}
                checked={setup.ultimate === n}
                onChange={() => update({ ultimate: n })}
                className="peer sr-only"
              />
              <span className="sr-only">{t.ultimateTitolo(n)}</span>
              {data.stones ? (
                // le pietre accese fino al rango scelto, come nel gioco; 36px d'altezza per il pollice
                <span aria-hidden className="grid h-9 w-8 place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- le pietre del gioco, gia' ritagliate */}
                  <img
                    src={gameIconSrc(data.game, "carta", `pietra_${n}`)}
                    alt=""
                    width={18}
                    height={18}
                    className={cx("h-[18px] w-[18px] object-contain transition-opacity", n > setup.ultimate && "opacity-25 grayscale")}
                  />
                </span>
              ) : (
                <span aria-hidden className={chipClass(setup.ultimate === n, true, cx(numeric, "mr-1"))}>
                  {n}
                </span>
              )}
            </label>
          ))}
        </div>
        <span className={cx(numeric, "text-[12px] text-ink-2")}>{setup.ultimate}/6</span>
      </fieldset>
      <RadioChips
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

/**
 * Un posto che si sceglie: tutto il posto e' il pulsante (si centra col
 * pollice), e accanto, fuori dal pulsante, la croce per togliere l'eroe.
 * L'aspetto lo da' chi sta dentro (PartyPanel, AssociateStrip).
 */
function Slot({
  t,
  hero,
  active,
  onPick,
  onRemove,
  label,
  small = false,
  children,
}: {
  t: Texts;
  hero: BuilderHero | undefined;
  active: boolean;
  onPick: () => void;
  onRemove: () => void;
  label: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-w-0 self-stretch">
      <button
        type="button"
        onClick={onPick}
        aria-label={hero ? `${t.cambia}: ${hero.name}` : label}
        aria-pressed={active}
        className="group block h-full w-full cursor-pointer border-0 bg-transparent p-0 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {children}
      </button>
      {hero ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t.togliTitolo(hero.name)}
          title={t.togliTitolo(hero.name)}
          className={cx(
            "p5-btn absolute grid h-9 w-9 cursor-pointer place-items-center border-0 [--btn-bg:color-mix(in_srgb,var(--color-paper)_85%,transparent)] [--btn-fg:var(--color-ink)] [--btn-hi:var(--color-brand)] [--btn-hi-fg:#fff]",
            small ? "top-1/2 right-0.5 -translate-y-1/2" : "top-1.5 right-1.5",
          )}
        >
          <IconClose size={16} />
        </button>
      ) : null}
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
  box,
  onlyMine,
  setOnlyMine,
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
  box: HeroBox;
  onlyMine: boolean;
  setOnlyMine: (value: boolean) => void;
  onPlace: (hero: string) => void;
  onClose: () => void;
}) {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    // lo scorrimento morbido solo a chi non ha chiesto meno movimento
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.current?.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : "auto" });
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

  // il filtro vale solo con un box: chi non ne ha non vede il comando
  const hasBox = boxSize(box) > 0;
  const mine = onlyMine && hasBox;
  const allowed = useCallback(
    (hero: BuilderHero | undefined) => !!hero && !(noCollab && hero.collab) && !(mine && !ownsHero(box, hero.id)),
    [noCollab, mine, box],
  );

  const pool = useMemo(
    () => data.heroes.filter((hero) => !usedGroups.has(hero.group) && allowed(hero)),
    [data.heroes, usedGroups, allowed],
  );

  const suggestions: Suggestion[] = useMemo(
    () => (picking.kind === "main" ? suggest(setup, picking.slot, pool, teamData, 12) : []),
    [picking, setup, pool, teamData],
  );

  const main = picking.kind === "associate" && setup.mains[picking.slot] ? heroes.get(setup.mains[picking.slot]!) : undefined;
  const bonds = useMemo(
    () =>
      main
        ? fateSuggestions(data.fates, main.id, heroes, usedGroups).filter(([id]) => allowed(heroes.get(id)))
        : [],
    [main, data.fates, heroes, usedGroups, allowed],
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
      className="p5-corner mt-5 max-w-[1100px] scroll-mt-24 border border-rule border-t-[3px] border-t-brand bg-paper-2 p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 font-display text-[20px] leading-tight font-black uppercase [font-variation-settings:'wdth'_80]">{title}</h3>
        <button type="button" onClick={onClose} className={buttonClass("ghost", "sm")}>
          <IconClose size={14} />
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
                      className="group flex w-full cursor-pointer items-center gap-2.5 border border-rule bg-paper p-1.5 text-left text-ink transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                      <img src={heroCardSrc(data.game, hero.id)} alt="" width={44} height={44} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] text-ink-3" style={hero.color ? { color: hero.color } : undefined}>
                          {hero.epithet}
                        </span>
                        <span className="block truncate font-display text-[13px] font-black uppercase [font-variation-settings:'wdth'_80] group-hover:text-brand-deep">{hero.name}</span>
                        <span className="block text-[12px] leading-snug text-ink-3">{reasons.join(" · ")}</span>
                      </span>
                      <span title={t.guadagnoTitolo(s.gain)} className={cx(numeric, "p5-cut-sm shrink-0 bg-brand px-2 py-0.5 text-[12px] font-bold text-white")}>
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
                      className="group flex w-full cursor-pointer items-center gap-2.5 border border-rule bg-paper p-1.5 text-left text-ink transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                      <img src={heroCardSrc(data.game, id)} alt="" width={44} height={44} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[13px] font-black uppercase [font-variation-settings:'wdth'_80] group-hover:text-brand-deep">{hero.name}</span>
                        <span className="block truncate text-[12px] text-up">
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
        {/* un filtro che restringe l'elenco: rosso quando e' acceso, come i filtri della griglia Eroi */}
        <Chip active={noCollab} onClick={() => setNoCollab(!noCollab)} label={t.senzaCollab} />
        {hasBox ? (
          <span title={t.soloMieiTitolo}>
            <Chip active={onlyMine} onClick={() => setOnlyMine(!onlyMine)} label={t.soloMiei} count={boxSize(box)} />
          </span>
        ) : null}
      </div>
      <label htmlFor="squadra-cerca" className="sr-only">
        {t.cercaEtichetta}
      </label>
      <Input
        id="squadra-cerca"
        type="search"
        autoComplete="off"
        value={query}
        placeholder={t.cerca}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 max-w-[420px] placeholder:text-ink-3"
      />
      <p className="mt-1.5 mb-2 text-[12px] text-ink-3">
        {found.length === 0 ? t.nessuno : t.risultati(shown.length, found.length)}
      </p>
      {/* le card della griglia Eroi (classi .hero-card): si alzano con la sagoma rossa al passaggio */}
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-x-2 gap-y-3 p-0">
        {shown.map((hero) => (
          <li key={hero.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onPlace(hero.id)}
              title={`${hero.epithet} ${hero.name}`}
              className="hero-card group block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="hero-card-art block">
                {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                <img
                  src={heroCardSrc(data.game, hero.id)}
                  srcSet={`${heroCardSrc(data.game, hero.id)} 1x, ${heroCardSrc(data.game, hero.id, 2)} 2x`}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  className="block aspect-square w-full bg-paper"
                />
              </span>
              <span className={cx(heroNameClass, "mt-1")}>
                {hero.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 mb-0 text-[12px]">
        <Link href={`/${data.game}/eroi`} className="inline-flex items-center gap-1 text-brand-deep underline-offset-2 hover:underline">
          {t.griglia}
          <IconChevronRight size={12} />
        </Link>
      </p>
    </section>
  );
}
