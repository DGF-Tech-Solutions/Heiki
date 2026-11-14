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
 * (`suggest`: cosa cambia nelle passive, detto a parole, senza un punteggio); per
 * gli associati, i legami dell'eroe del posto.
 *
 * L'ordine della pagina (10/10): prima la squadra, che e' lo strumento; sotto i
 * suoi comandi (link, svuota), poi la scelta, poi dove si gioca, e in fondo il
 * resoconto. I posti sono quelli di una schermata di scelta del personaggio
 * (party-slot.tsx), e il primo libero e' segnato in rosso: dice da dove
 * cominciare.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { useAccountSetup } from "@/components/account-buff/use-account-setup";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { IconCheck, IconChevronRight, IconClose, IconLink } from "@/components/icons";
import { AssociateStrip, ChooseMark, PartyPanel, partyGridClass } from "@/components/party-slot";
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
  MAX_ENEMIES,
  parseSetup,
  withBox,
  sentenceText,
  setupToQuery,
  suggest,
  TEAM_SLOTS,
  type PassiveChange,
  type Suggestion,
  type TeamData,
  type TeamSetup,
  type TotalsOf,
} from "@/lib/games/team";
import { setupEffect } from "@/lib/games/account-setup";
import type { TeamSimLoaded } from "@/lib/games/grand-cross/team-sim-load";
import type { SimContext } from "@/lib/games/team-sim";
import type { TeamContent } from "@/lib/games/team-types";
import { useLocale } from "@/lib/i18n/client";
import { inLingua } from "@/lib/i18n/locale";
import { TeamReport } from "./team-report";
import { numberLines, slotLabel, TESTI, type BuilderData, type BuilderHero, type Texts } from "./team-labels";
import { moveLegacyStorage } from "@/lib/legacy-storage";
import { rem } from "@/lib/rem";

/** Il nome di una passiva che cambia, in parole: «Unica di King», «Comandamento di Derieri». */
function whose(change: PassiveChange, t: Texts, data: BuilderData, heroes: ReadonlyMap<string, BuilderHero>): string {
  const { source } = change;
  const kind = source.kind === "special" && source.special ? (data.specials[source.special]?.label ?? t.tipo.special) : t.tipo[source.kind];
  return t.passivaDi(kind, heroes.get(change.hero)?.name ?? change.hero);
}

/**
 * I motivi di un consiglio, nell'ordine in cui contano: solo quelli che ci sono, e
 * ogni passiva una volta sola. Una stessa Unica puo' crescere con lui e arrivargli
 * insieme, o partire da lui e scattare coi compagni: la si dice dove pesa di piu'.
 */
function reasonGroups(s: Suggestion, t: Texts) {
  const said = new Set<string>();
  const once = (changes: readonly PassiveChange[]) =>
    changes.filter((c) => {
      const key = `${c.hero}:${c.source.kind}:${c.source.id}`;
      if (said.has(key)) return false;
      said.add(key);
      return true;
    });
  return [
    { label: t.spegneLe, changes: once(s.breaks), bad: true },
    { label: t.accendeLe, changes: once(s.lights), bad: false },
    { label: t.faCrescere, changes: once(s.boosts), bad: false },
    { label: t.arrivaA, changes: once(s.gives), bad: false },
    { label: t.scattaCon, changes: once(s.wakes), bad: false },
    { label: t.riceveLe, changes: once(s.receives), bad: false },
  ].filter((group) => group.changes.length > 0);
}

/** Le frasi di una passiva che cambia: da tutti i motivi in cui compare, una volta sola. */
function sentencesOfChange(s: Suggestion, change: PassiveChange): number[] {
  const same = [...s.breaks, ...s.lights, ...s.boosts, ...s.gives, ...s.wakes, ...s.receives].filter(
    (c) => c.hero === change.hero && c.source.kind === change.source.kind && c.source.id === change.source.id,
  );
  return [...new Set(same.flatMap((c) => c.sentences))];
}

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
  // Per gli eroi del tuo box valgono il loro rango della Mossa finale e la loro
  // Reliquia, come nel calcolatore della scheda eroe (11/11); l'indirizzo e i
  // comandi restano quelli scelti, e valgono per gli altri
  const played = useMemo(() => withBox(setup, box), [setup, box]);
  const analysis = useMemo(() => analyzeTeam(played, teamData), [played, teamData]);
  // Il simulatore del primo turno: i numeri d'inizio vengono dal box e, se l'hai
  // impostato, dal titolo e dalle costellazioni dell'account, come nel calcolatore
  const [accountSetup] = useAccountSetup(data.game);
  // Arriva dopo la pagina, in un pezzo a parte (team-sim-load.ts, scelta del 14/11):
  // finche' non c'e', numeri e consigli aspettano; se non arriva, si torna ai
  // numeri letti dalle frasi
  const [loaded, setLoaded] = useState<TeamSimLoaded | "failed" | null>(null);
  useEffect(() => {
    if (!data.simulation) return;
    let live = true;
    import("@/lib/games/grand-cross/team-sim-load").then(
      (module) => {
        if (live) setLoaded(module.TEAM_SIM);
      },
      () => {
        if (live) setLoaded("failed");
      },
    );
    return () => {
      live = false;
    };
  }, [data.simulation]);
  const simPending = data.simulation && loaded === null;
  const totalsOf: TotalsOf | null = useMemo(() => {
    if (!loaded || loaded === "failed") return null;
    const effect = data.account ? setupEffect(data.account, accountSetup) : null;
    const context: SimContext = {
      sim: loaded.simulation,
      start: loaded.start,
      box,
      account: effect?.active ? { tier: effect.tier, bonus: effect.bonus } : null,
    };
    return (setup, analysis) => loaded.simTotals(setup, teamData, analysis, context);
  }, [loaded, data.account, accountSetup, box, teamData]);

  // L'indirizzo e il browser. Al primo disegno, se l'indirizzo non porta una
  // squadra, si riprende l'ultima salvata; poi ogni cambio si scrive in tutti e due.
  const storageKey = `heiki:${data.game}:squadra`;
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (initial.mains.some(Boolean) || initial.associates.some(Boolean)) return;
    try {
      moveLegacyStorage();
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
      <ol className={partyGridClass}>
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
                  benchNote={t.panchinaNota}
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
              setSetup((before) => ({
                ...emptySetup(),
                content: before.content,
                bench: before.bench,
                ultimate: before.ultimate,
                relics: before.relics,
                enemies: before.enemies,
              }));
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
          setup={played}
          totalsOf={totalsOf}
          simPending={simPending}
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

      {filled ? (
        <TeamReport
          t={t}
          data={data}
          heroes={heroes}
          setup={played}
          analysis={analysis}
          totalsOf={totalsOf}
          simPending={simPending}
        />
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- comandi -- */

const BENCH_BY_CONTENT: Partial<Record<TeamContent, { bench: boolean }>> = {
  destroy: { bench: true },
  nest: { bench: false },
};

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
        // Dove il gioco lo dice, il quarto eroe segue il contenuto: `stage_hero_entry_all`
        // vale 0 su tutti i 118 livelli dello Scontro finale e 1 su tutti i 30 delle
        // Bestie. Storia e PvP mescolano modalita' diverse: li' si lascia la scelta fatta
        onChange={(content) => update({ content, ...BENCH_BY_CONTENT[content] })}
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
                    width={18} style={{ width: rem(18) }}
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
      <RadioChips
        legend={t.nemici}
        name="squadra-nemici"
        value={String(setup.enemies)}
        onChange={(value) => update({ enemies: Number(value) })}
        options={Array.from({ length: MAX_ENEMIES }, (_, i) => ({ value: String(i + 1), label: String(i + 1), title: t.nemiciTitolo(i + 1) }))}
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
            "p5-btn absolute grid h-9 w-9 cursor-pointer place-items-center border-0 [--btn-bg:color-mix(in_srgb,var(--color-paper)_85%,transparent)] [--btn-fg:var(--color-ink)] [--btn-hi:var(--color-piastra-forte)] [--btn-hi-fg:var(--color-ink)]",
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
  totalsOf,
  simPending,
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
  /** i totali dal simulatore, quando e' arrivato; senza, dalle frasi */
  totalsOf: TotalsOf | null;
  /** il simulatore deve ancora arrivare: i consigli aspettano */
  simPending: boolean;
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

  // I numeri dei consigli sono quelli del simulatore, come quelli del resoconto, e
  // costano: 280 ms in Node su 373 candidati (14/11), contro 26 dal testo, perche'
  // quasi tutti portano qualcosa ai compagni. Il pannello si apre subito coi suoi
  // eroi, e i consigli arrivano col disegno dopo, che React fa quando ha tempo
  const asked = useMemo(() => ({ picking, setup, pool }), [picking, setup, pool]);
  const ready = useDeferredValue(asked, null);
  const suggestions: Suggestion[] | null = useMemo(
    () =>
      !ready || simPending
        ? null
        : ready.picking.kind === "main"
          ? suggest(ready.setup, ready.picking.slot, ready.pool, teamData, 12, totalsOf ?? undefined)
          : [],
    [ready, teamData, totalsOf, simPending],
  );

  // senza compagni non c'e' niente da incastrare: nessun consiglio, e lo si dice
  const teammates = setup.mains.filter((id, i) => id && !(picking.kind === "main" && i === picking.slot)).length;

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
      className="p5-corner mt-5 max-w-[1100px] scroll-mt-24 border border-rule border-t-[3px] border-t-mark bg-paper-2 p-4"
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
          {suggestions === null ? (
            <p className="m-0 text-[13px] text-ink-3" role="status">
              {t.cercoConsigli}
            </p>
          ) : suggestions.length === 0 ? (
            <p className="m-0 text-[13px] text-ink-3">{teammates === 0 ? t.primaUnEroe : t.nessunSuggerimento}</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 items-start gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((s) => {
                const hero = heroes.get(s.hero)!;
                const groups = reasonGroups(s, t);
                const numbers = numberLines(s.numbers, s.hero, t, locale);
                return (
                  <li key={s.hero} className="border border-rule bg-paper">
                    <button
                      type="button"
                      onClick={() => onPlace(s.hero)}
                      className="group flex w-full cursor-pointer items-center gap-2.5 p-1.5 text-left text-ink transition-colors hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                      <img src={heroCardSrc(data.game, hero.id)} alt="" width={44} style={{ width: rem(44) }} height={44} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] text-ink-3" style={hero.color ? { color: hero.color } : undefined}>
                          {hero.epithet}
                        </span>
                        <span className="block truncate font-display text-[13px] font-black uppercase [font-variation-settings:'wdth'_80] group-hover:text-brand-deep">{hero.name}</span>
                      </span>
                    </button>
                    <ul className="m-0 list-none border-t border-rule px-2 py-1.5 text-[12px] leading-snug text-ink-2">
                      {numbers.length > 0 ? (
                        <li className="mb-1">
                          <span className="font-bold">{t.numeriConsiglio}</span>
                          {numbers.map((line) => (
                            <span key={line.hero} className="block">
                              {heroes.get(line.hero)?.name ?? line.hero}:{" "}
                              {line.parts.map((part, i) => (
                                <span key={i} className={part.bad ? "text-down" : "font-mono text-ink"}>
                                  {i > 0 ? ", " : ""}
                                  {part.text}
                                </span>
                              ))}
                            </span>
                          ))}
                        </li>
                      ) : null}
                      {groups.map((group) => (
                        <li key={group.label} className={group.bad ? "text-down" : undefined}>
                          <span className="font-bold">{group.label}:</span> {group.changes.map((c) => whose(c, t, data, heroes)).join(", ")}
                        </li>
                      ))}
                    </ul>
                    <details className="border-t border-rule">
                      <summary className="cursor-pointer px-2 py-1.5 text-[12px] text-ink-3 max-sm:py-3">{t.perche2}</summary>
                      <ul className="m-0 list-none px-2 pb-2 text-[12px] leading-snug text-ink-2">
                        {groups.flatMap((group) =>
                          group.changes.map((c) => (
                            <li key={`${group.label}-${c.hero}-${c.source.id}`} className="mt-1.5">
                              <span className="font-bold">{whose(c, t, data, heroes)}</span>
                              {sentencesOfChange(s, c).map((n) => {
                                const sentence = sentenceText(data.team, n, locale);
                                return (
                                  <span key={n} className="block" lang={sentence.english ? "en" : undefined}>
                                    {sentence.text}
                                  </span>
                                );
                              })}
                            </li>
                          )),
                        )}
                      </ul>
                    </details>
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
                      <img src={heroCardSrc(data.game, id)} alt="" width={44} style={{ width: rem(44) }} height={44} className="shrink-0" />
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
