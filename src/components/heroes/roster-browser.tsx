"use client";

/**
 * Sfoglia il roster: la «selezione del personaggio».
 *
 * Componente client, e qui la ragione e' concreta: le voci sono centinaia e si
 * filtrano a ogni clic. I dati arrivano gia' tutti - nomi e sigle, non foto -
 * quindi filtrare in locale e' immediato; le immagini le carica il browser solo
 * quando entrano nello schermo.
 *
 * Dal 10/10 (richiesta dell'utente: «grande enfasi sulla selezione dei
 * personaggi», scelta: griglia + eroe in grande a lato, come un picchiaduro):
 *   - sul computer, accanto alla griglia, il palco (hero-stage.tsx) mostra in
 *     grande l'eroe sotto il mouse o col fuoco della tastiera; il clic apre la
 *     scheda. Sul telefono il palco non c'e': il tocco apre la scheda, che ha il
 *     palco in testa (un tocco in piu' per vedere un eroe sarebbe un freno)
 *   - i filtri stanno su una striscia: ricerca, ordine, e le icone del gioco per
 *     rarita', attributo e razza; «Esce come» e «Caratteristica» sotto «Altri
 *     filtri». Niente pulsanti «Tutte»: un filtro si toglie ripremendolo, e nello
 *     stato di partenza non c'e' niente di rosso (prima i cinque «Tutte» rossi
 *     erano la cosa piu' accesa della pagina)
 *   - i filtri stanno nell'indirizzo (`?rarita=UR&attributo=...`): tornando da
 *     una scheda, o ricaricando, si ritrovano. Si arriva gia' filtrati anche
 *     dalle tendine delle parole blu (`?razza=3`, `?caratteristica=6`). Si
 *     leggono dall'indirizzo vivo (`useSearchParams`), non da un valore passato
 *     dalla pagina: fino all'11/10 col tasto Indietro Next ridisegnava la pagina
 *     com'era arrivata dal server, coi filtri del primo arrivo, e la griglia li
 *     riscriveva nell'indirizzo cancellando quelli scelti dopo
 *   - «I miei»: solo gli eroi del tuo box, se ne hai segnati (use-hero-box.ts)
 *
 * Sul telefono (10/10, sera) le file dei filtri occupavano tutto il primo
 * schermo: a 390x844 la prima card compariva sotto la piega. Ora sotto `lg`
 * (dove il palco non c'e') restano in vista la ricerca e un comando «Filtri»
 * che dice quanti filtri sono attivi; ordine e filtri si aprono sotto di lui.
 * Un pannello e non una striscia che scorre di lato: le file di icone hanno
 * bisogno della loro etichetta, e in una striscia unica si perderebbe dove
 * finiscono le rarita' e cominciano gli attributi.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { readableColor } from "@/components/heroes/game-color";
import { DEFAULT_STAGE_ART, HeroStage, type StageArt, type StageBadge } from "@/components/heroes/hero-stage";
import { IconCheck, IconChevronRight, IconClose, IconFilters } from "@/components/icons";
import {
  buttonClass,
  chipClass,
  cx,
  Empty,
  eyebrow,
  heroEpithetClass,
  heroNameClass,
  Input,
  numeric,
} from "@/components/ui";
import { boxSize, ownsHero } from "@/lib/games/hero-box";
import {
  countHeroes,
  countTraits,
  filterHeroes,
  gameIconSrc,
  heroCardSrc,
  heroEpithet,
  heroName,
  sortHeroes,
  type HeroOrder,
  type IconFamily,
} from "@/lib/games/heroes";
import type { HeroEntry, HeroRoster } from "@/lib/games/types";
import { useLocale } from "@/lib/i18n/client";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    ordini: { roster: "Uscita", name: "Nome", group: "Personaggio" },
    cercaSegnaposto: "Cerca per nome, epiteto o personaggio…",
    cercaEtichetta: "Cerca un eroe",
    ordina: "Ordina",
    rarita: "Rarità",
    attributo: "Attributo",
    esceCome: "Esce come",
    razza: "Razza",
    caratteristica: "Caratteristica",
    altriFiltri: "Altri filtri",
    filtri: "Filtri",
    attivi: (n: number) => (n === 1 ? "1 attivo" : `${n} attivi`),
    miei: "I miei",
    mieiTitolo: "Solo gli eroi del tuo box",
    eroi: (n: number): string => (n === 1 ? "eroe" : "eroi"),
    su: "su",
    azzera: "Azzera i filtri",
    azzeraBreve: "Azzera",
    nessunEroe: "Nessun eroe con questi filtri.",
    nessunaRicerca: (testo: string) => `Nessun eroe trovato per «${testo}».`,
    togliUltimo: (label: string) => `Togli «${label}»`,
    apri: "Apri la scheda",
    percorso: (da: string, a: string) => (da === a ? da : `${da} → ${a}`),
  },
  en: {
    ordini: { roster: "Release", name: "Name", group: "Character" },
    cercaSegnaposto: "Search by name, epithet or character…",
    cercaEtichetta: "Search for a hero",
    ordina: "Sort",
    rarita: "Rarity",
    attributo: "Attribute",
    esceCome: "Obtained as",
    razza: "Race",
    caratteristica: "Characteristic",
    altriFiltri: "More filters",
    filtri: "Filters",
    attivi: (n: number) => `${n} active`,
    miei: "Mine",
    mieiTitolo: "Only the heroes in your box",
    eroi: (n: number) => (n === 1 ? "hero" : "heroes"),
    su: "of",
    azzera: "Clear filters",
    azzeraBreve: "Clear",
    nessunEroe: "No heroes match these filters.",
    nessunaRicerca: (text: string) => `No heroes found for “${text}”.`,
    togliUltimo: (label: string) => `Remove “${label}”`,
    apri: "Open the page",
    percorso: (from: string, to: string) => (from === to ? from : `${from} → ${to}`),
  },
});

const ORDERS: readonly HeroOrder[] = ["roster", "name", "group"];

/**
 * La colonna delle etichette dei filtri, sul computer: 116 px, misurati sulle
 * parole piu' lunghe («Caratteristica» 101, «Characteristic» 102, e «More
 * filters» con la sua freccia 115). Una costante sola perche' la usano le file e
 * la riga «Altri filtri»: se divergono, la colonna si rompe.
 */
const LABEL_COLUMNS = "lg:grid-cols-[7.25rem_minmax(0,1fr)] lg:gap-x-3";

/** Lo stato dei filtri, come sta nell'indirizzo. */
export interface RosterQuery {
  search: string;
  rarity: string | null;
  affinity: string | null;
  obtainable: string | null;
  race: number | null;
  faction: number | null;
  order: HeroOrder;
  mine: boolean;
}

export const EMPTY_QUERY: RosterQuery = {
  search: "",
  rarity: null,
  affinity: null,
  obtainable: null,
  race: null,
  faction: null,
  order: "roster",
  mine: false,
};

/** I nomi dei parametri: italiani, come le altre pagine (`?scheda=`, `?razza=`). */
function toSearchParams(query: RosterQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("cerca", query.search);
  if (query.rarity) params.set("rarita", query.rarity);
  if (query.affinity) params.set("attributo", query.affinity);
  if (query.obtainable) params.set("esce", query.obtainable);
  if (query.race !== null) params.set("razza", String(query.race));
  if (query.faction !== null) params.set("caratteristica", String(query.faction));
  if (query.order !== "roster") params.set("ordine", query.order);
  if (query.mine) params.set("miei", "1");
  const text = params.toString();
  return text ? `?${text}` : "";
}

/**
 * Il contrario di `toSearchParams`. L'indirizzo lo puo' scrivere chiunque: un
 * valore vale solo se e' fra quelli che la griglia offre. Un parametro ripetuto
 * (`?cerca=a&cerca=b`) vale il primo: fino all'11/10 l'elenco finiva nella
 * ricerca e la griglia si rompeva.
 */
function fromSearchParams(
  params: Pick<URLSearchParams, "get">,
  roster: HeroRoster,
  traits: { races: readonly { code: number }[]; factions: readonly { code: number }[] } | undefined,
): RosterQuery {
  const one = (key: string, offered: readonly string[]) => {
    const value = params.get(key);
    return value !== null && offered.includes(value) ? value : null;
  };
  const code = (key: string, offered: readonly { code: number }[] | undefined) =>
    offered?.find((item) => String(item.code) === params.get(key))?.code ?? null;
  const order = params.get("ordine");
  return {
    search: (params.get("cerca") ?? "").slice(0, 80),
    rarity: one("rarita", roster.rarities),
    affinity: one("attributo", roster.affinities.map((a) => a.id)),
    obtainable: one("esce", roster.obtainable),
    race: code("razza", traits?.races),
    faction: code("caratteristica", traits?.factions),
    order: order === "name" || order === "group" ? order : "roster",
    mine: params.get("miei") === "1",
  };
}

export function RosterBrowser({
  game,
  roster,
  icons,
  traits,
  intro,
  art = {},
  figures = {},
  withoutCutIn = [],
}: {
  game: string;
  roster: HeroRoster;
  /**
   * Quali icone del gioco esistono. Sono le stesse che il gioco usa nei propri
   * filtri - si chiamano proprio `icon_filter_*` - quindi qui tornano al posto
   * per cui erano nate. Se mancano (repo clonato senza asset) i pulsanti
   * restano testuali invece di mostrare riquadri rotti.
   */
  icons?: Readonly<Record<string, readonly string[]>>;
  /** razze e caratteristiche coi nomi nella lingua della pagina; senza, niente filtri per quelle */
  traits?: {
    races: readonly { code: number; label: string; iconKey?: string }[];
    factions: readonly { code: number; label: string }[];
  };
  /**
   * Briciole e titolo della pagina: stanno nella colonna della griglia, cosi' il
   * palco parte dall'alto della pagina e su uno schermo da 900 px ci sta intero
   */
  intro?: React.ReactNode;
  /** il tipo d'illustrazione del palco, solo per chi non l'ha scontornata */
  art?: Readonly<Record<string, StageArt["art"]>>;
  /**
   * Volto e cima della sagoma nell'illustrazione di ogni eroe: la figura si
   * ingrandisce attorno al volto, il primo piano della fascia va dall'altra parte
   */
  figures?: Readonly<Record<string, StageArt["figure"]>>;
  /** gli eroi senza il cut-in della Mossa finale: la loro fascia resta vuota */
  withoutCutIn?: readonly string[];
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  // i filtri all'arrivo dall'indirizzo di adesso, anche tornando con Indietro (vedi in cima)
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<RosterQuery>(() => fromSearchParams(searchParams, roster, traits));
  const [box] = useHeroBox(game);
  const hasBox = boxSize(box) > 0;
  const { search, rarity, affinity, obtainable, race, faction, order } = query;
  const mine = query.mine && hasBox;
  const change = (patch: Partial<RosterQuery>) => setQuery((current) => ({ ...current, ...patch }));

  // l'indirizzo segue i filtri, senza una voce nella cronologia a ogni clic
  useEffect(() => {
    const next = `${window.location.pathname}${toSearchParams(query)}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [query]);

  const heroes = useMemo(
    () => (mine ? roster.heroes.filter((hero) => ownsHero(box, hero.id)) : roster.heroes),
    [roster.heroes, mine, box],
  );

  const visible = useMemo(
    () => sortHeroes(filterHeroes(heroes, { search, rarity, affinity, obtainable, race, faction }), order, locale),
    [heroes, search, rarity, affinity, obtainable, race, faction, order, locale],
  );

  // Ogni gruppo di pulsanti si conta escludendo se stesso dal filtro: il numero
  // sul pulsante dice quanti eroi si otterrebbero premendolo, non quanti ce ne
  // sono adesso (che darebbe zero su ogni pulsante non attivo).
  const rarityCounts = useMemo(
    () => countHeroes(filterHeroes(heroes, { search, affinity, obtainable, race, faction }), "rarity"),
    [heroes, search, affinity, obtainable, race, faction],
  );
  const affinityCounts = useMemo(
    () => countHeroes(filterHeroes(heroes, { search, rarity, obtainable, race, faction }), "affinity"),
    [heroes, search, rarity, obtainable, race, faction],
  );
  const obtainableCounts = useMemo(
    () => countHeroes(filterHeroes(heroes, { search, rarity, affinity, race, faction }), "obtainedAs"),
    [heroes, search, rarity, affinity, race, faction],
  );
  const raceCounts = useMemo(
    () => countTraits(filterHeroes(heroes, { search, rarity, affinity, obtainable, faction }), "race"),
    [heroes, search, rarity, affinity, obtainable, faction],
  );
  const factionCounts = useMemo(
    () => countTraits(filterHeroes(heroes, { search, rarity, affinity, obtainable, race }), "faction"),
    [heroes, search, rarity, affinity, obtainable, race],
  );

  const byAffinity = useMemo(() => new Map(roster.affinities.map((item) => [item.id, item])), [roster.affinities]);
  const raceOf = useMemo(() => new Map((traits?.races ?? []).map((item) => [item.code, item])), [traits]);

  // l'eroe sul palco: quello sotto il mouse o col fuoco; se esce dai filtri, il primo
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = visible.find((hero) => hero.id === activeId) ?? visible[0];

  // i filtri scelti nel pannello (la ricerca e' sempre in vista, e un ordine non
  // restringe l'elenco): e' il numero che il comando «Filtri» del telefono porta
  const activeCount =
    [rarity, affinity, obtainable, race, faction].filter((value) => value !== null).length + (mine ? 1 : 0);
  const filtered = activeCount > 0 || search !== "";
  const moreOpen = obtainable !== null || faction !== null;
  const reset = () => setQuery({ ...EMPTY_QUERY, order });

  // Il pannello dei filtri sul telefono parte chiuso anche arrivando gia'
  // filtrati (`?razza=3` dalle parole blu): chi arriva cosi' vuole vedere gli
  // eroi, e il comando dice comunque quanti filtri ci sono.
  const [panelOpen, setPanelOpen] = useState(false);
  const panelId = useId();

  /** L'icona del gioco per un valore, solo se e' stata estratta. */
  const iconFor = (family: IconFamily, key: string | undefined) =>
    key && icons?.[family]?.includes(key) ? gameIconSrc(game, family, key) : undefined;

  const badgesFor = (hero: HeroEntry): StageBadge[] => {
    const out: StageBadge[] = [];
    const aff = byAffinity.get(hero.affinity);
    if (aff) out.push({ label: aff.label, iconSrc: iconFor("attributo", aff.iconKey), color: readableColor(aff.color) });
    out.push({ label: t.percorso(hero.obtainedAs, hero.rarity), iconSrc: iconFor("rarita", hero.rarity) });
    const r = hero.race != null ? raceOf.get(hero.race) : undefined;
    if (r) out.push({ label: r.label, iconSrc: iconFor("razza", r.iconKey) });
    return out;
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,min(30vw,480px))]">
      <div className="min-w-0">
        {intro}
        {/*
          Ricerca, ordine, filtri e conteggio sono UNA fila che va a capo, non
          blocchi separati: cosi' gli stessi comandi si dispongono in due modi
          senza essere scritti due volte, e l'ordine del DOM resta quello che si
          vede (anche per chi va col tabulatore).
            - sul computer il pannello non e' una scatola (`lg:contents`): i suoi
              pezzi entrano nella fila. L'ordine si mette accanto alla ricerca, le
              file di icone sotto con le etichette in una colonna, poi il conteggio
            - sul telefono la ricerca prende la prima riga; sotto, il comando
              «Filtri» e il conteggio stanno accanto. Il pannello, aperto, si
              mette fra i due (e' «basis-full») e spinge giu' il conteggio
        */}
        <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-3">
          {/* la ricerca e' un campo bianco tagliato: CONTROL lo darebbe nero, da qui gli `!` */}
          <Input
            type="search"
            value={search}
            onChange={(event) => change({ search: event.target.value })}
            placeholder={t.cercaSegnaposto}
            aria-label={t.cercaEtichetta}
            className="p5-cut h-10 border-ink! bg-ink! px-4 text-sm font-semibold text-paper! placeholder:text-paper/60 focus:shadow-[inset_0_-3px_0_var(--color-brand)] lg:min-w-[200px] lg:max-w-[340px] lg:flex-1"
          />

          {/*
            Rosso se c'e' almeno un filtro, come i pulsanti dei filtri (il rosso
            dice «hai ristretto l'elenco»); bianco quieto se e' solo aperto.
          */}
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-controls={panelId}
            onClick={() => setPanelOpen((open) => !open)}
            className={chipClass(activeCount > 0 || panelOpen, activeCount === 0, "shrink-0 lg:hidden")}
          >
            <IconFilters size={16} />
            {t.filtri}
            {activeCount > 0 ? (
              <>
                <span aria-hidden className={cx(numeric, "text-[12px]")}>
                  {activeCount}
                </span>
                <span className="sr-only">{t.attivi(activeCount)}</span>
              </>
            ) : null}
          </button>

          <div
            id={panelId}
            className={cx(
              "p5-corner basis-full gap-4 border border-rule bg-paper-2 p-4 lg:contents",
              panelOpen ? "grid" : "hidden",
            )}
          >
            <FilterGroup label={t.ordina} inline>
              {ORDERS.map((id) => (
                <Chip key={id} active={order === id} quiet onClick={() => change({ order: id })} label={t.ordini[id]} />
              ))}
            </FilterGroup>
            {hasBox ? (
              <span title={t.mieiTitolo} className="justify-self-start">
                <Chip active={mine} onClick={() => change({ mine: !mine })} label={t.miei} count={boxSize(box)} />
              </span>
            ) : null}

            <div className="grid gap-4 lg:basis-full lg:gap-2">
              <FilterGroup label={t.rarita}>
                {roster.rarities.map((value) => (
                  <Chip
                    key={value}
                    active={rarity === value}
                    onClick={() => change({ rarity: rarity === value ? null : value })}
                    label={value}
                    iconSrc={iconFor("rarita", value)}
                    count={rarityCounts.get(value) ?? 0}
                  />
                ))}
              </FilterGroup>
              <FilterGroup label={t.attributo}>
                {roster.affinities.map((item) => (
                  <Chip
                    key={item.id}
                    active={affinity === item.id}
                    onClick={() => change({ affinity: affinity === item.id ? null : item.id })}
                    label={item.label}
                    iconSrc={iconFor("attributo", item.iconKey)}
                    withLabel={affinity === item.id}
                    count={affinityCounts.get(item.id) ?? 0}
                    swatch={item}
                  />
                ))}
              </FilterGroup>
              {traits && traits.races.length > 0 ? (
                <FilterGroup label={t.razza}>
                  {traits.races.map((item) => (
                    <Chip
                      key={item.code}
                      active={race === item.code}
                      onClick={() => change({ race: race === item.code ? null : item.code })}
                      label={item.label}
                      iconSrc={iconFor("razza", item.iconKey)}
                      withLabel={race === item.code}
                      count={raceCounts.get(item.code) ?? 0}
                    />
                  ))}
                </FilterGroup>
              ) : null}

              {/*
                Le due file che si usano meno, sotto un tocco. Aperte da sole se
                uno dei loro filtri e' scelto (anche arrivando dall'indirizzo).
                Chiuse, dicono cosa c'e' dentro: «Altri filtri» da solo era una
                scritta appesa, che non diceva se valeva la pena aprirla.
              */}
              <details open={moreOpen || undefined} className="group/altri">
                <summary
                  className={cx(
                    "flex min-h-9 cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-0.5 lg:grid",
                    LABEL_COLUMNS,
                    "[&::-webkit-details-marker]:hidden",
                  )}
                >
                  <span className="inline-flex items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink-2 [font-variation-settings:'wdth'_85] hover:text-ink">
                    <IconChevronRight size={14} className="transition-transform group-open/altri:rotate-90 motion-reduce:transition-none" />
                    {t.altriFiltri}
                  </span>
                  <span className="text-[12px] text-ink-3 group-open/altri:hidden">
                    {traits && traits.factions.length > 0 ? `${t.esceCome} · ${t.caratteristica}` : t.esceCome}
                  </span>
                </summary>
                <div className="mt-2 grid gap-4 lg:gap-2">
                  <FilterGroup label={t.esceCome}>
                    {roster.obtainable.map((value) => (
                      <Chip
                        key={value}
                        active={obtainable === value}
                        onClick={() => change({ obtainable: obtainable === value ? null : value })}
                        label={value}
                        iconSrc={iconFor("rarita", value)}
                        count={obtainableCounts.get(value) ?? 0}
                      />
                    ))}
                  </FilterGroup>
                  {traits && traits.factions.length > 0 ? (
                    <FilterGroup label={t.caratteristica}>
                      {traits.factions.map((item) => (
                        <Chip
                          key={item.code}
                          active={faction === item.code}
                          onClick={() => change({ faction: faction === item.code ? null : item.code })}
                          label={item.label}
                          count={factionCounts.get(item.code) ?? 0}
                        />
                      ))}
                    </FilterGroup>
                  ) : null}
                </div>
              </details>
            </div>
          </div>

          {/*
            Il conteggio e' la testata dei risultati: il numero nella lama bianca
            e «eroi» nella stessa voce dei comandi, alla stessa misura (prima
            «eroi» era una parolina grigia appesa al numero). Sul computer un filo
            lo separa dai filtri: sopra si sceglie, sotto si guarda.
          */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:basis-full lg:border-t lg:border-rule-2 lg:pt-3">
            <p className="m-0 flex items-center gap-2" aria-live="polite">
              <strong className={cx(numeric, "p5-cut-sm bg-ink px-2 text-[14px] font-bold leading-6 text-paper")}>
                {visible.length}
              </strong>
              <span className="font-display text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink [font-variation-settings:'wdth'_85]">
                {t.eroi(visible.length)}
              </span>
              {/*
                «su 375» solo da 640 px in su: sul telefono sta accanto al
                comando «Filtri» e con «Azzera» la riga andava a capo, e il
                totale e' scritto due righe sopra, sotto il titolo
              */}
              {filtered ? (
                <span className="text-[13px] text-ink-3 max-sm:hidden">
                  {t.su} <span className={numeric}>{roster.heroes.length}</span>
                </span>
              ) : null}
            </p>
            {/* con zero risultati il comando sta, piu' grande, nel riquadro vuoto: uno solo */}
            {filtered && visible.length > 0 ? (
              <button
                type="button"
                onClick={reset}
                aria-label={t.azzera}
                className={buttonClass("ghost", "sm", "shrink-0")}
              >
                <IconClose size={14} />
                <span className="max-sm:hidden">{t.azzera}</span>
                <span className="sm:hidden">{t.azzeraBreve}</span>
              </button>
            ) : null}
          </div>
        </div>

        {visible.length === 0 ? (
          <Empty>
            {/* se c'e' solo la ricerca, «con questi filtri» farebbe cercare un filtro che non c'e' */}
            {search !== "" && activeCount === 0 ? t.nessunaRicerca(search) : t.nessunEroe}
            {filtered ? (
              <span className="mt-4 flex justify-center">
                <button type="button" onClick={reset} className={buttonClass("outline", "sm")}>
                  <IconClose size={14} />
                  {t.azzera}
                </button>
              </span>
            ) : null}
          </Empty>
        ) : (
          <ul
            className="m-0 grid list-none gap-x-2.5 gap-y-4 p-0"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
          >
            {visible.map((hero) => (
              <HeroCard
                key={hero.id}
                game={game}
                locale={locale}
                hero={hero}
                active={hero.id === active?.id}
                owned={hasBox && ownsHero(box, hero.id)}
                onPeek={() => setActiveId(hero.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* il palco: solo dove c'e' spazio accanto alla griglia */}
      {active ? (
        <aside className="sticky top-[76px] mt-6 hidden h-[calc(100dvh-100px)] max-h-[780px] min-h-[540px] lg:block" aria-label={heroName(active, locale)}>
          <HeroStage
            game={game}
            hero={active}
            locale={locale}
            affinity={byAffinity.get(active.affinity)}
            badges={badgesFor(active)}
            art={{
              art: art[active.id] ?? DEFAULT_STAGE_ART.art,
              figure: figures[active.id] ?? DEFAULT_STAGE_ART.figure,
              cutIn: !withoutCutIn.includes(active.id),
            }}
            className="p5-corner h-full"
          >
            <Link href={`/${game}/eroi/${active.id}`} className={buttonClass("primary", "md")}>
              {t.apri}
            </Link>
          </HeroStage>
        </aside>
      ) : null}
    </div>
  );
}

/**
 * Una fila di pulsanti con la sua etichetta.
 *
 * Sul computer l'etichetta sta in una colonna larga quanto «Caratteristica», la
 * piu' lunga: prima ogni fila partiva dove finiva la sua parola, e i pulsanti di
 * Rarita', Attributo e Razza cominciavano a tre altezze diverse. Le file che
 * vanno a capo restano nella loro colonna invece di finire sotto l'etichetta.
 * Sul telefono l'etichetta sta sopra: una colonna si mangerebbe un terzo dei
 * 358 px, e le file di icone andrebbero a capo una volta di piu'.
 *
 * `inline`: etichetta e pulsanti di seguito, per l'ordine accanto alla ricerca.
 */
function FilterGroup({
  label,
  inline = false,
  children,
}: {
  label: string;
  inline?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={id}
      className={cx(
        "grid gap-1.5",
        inline ? "lg:flex lg:items-center lg:gap-2" : cx(LABEL_COLUMNS, "lg:items-start"),
      )}
    >
      {/* alta quanto un pulsante: resta in riga con la prima fila anche se i pulsanti vanno a capo */}
      <span id={id} className={cx(eyebrow, "lg:leading-9")}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ card -- */

function HeroCard({
  game,
  locale,
  hero,
  active,
  owned,
  onPeek,
}: {
  game: string;
  locale: Locale;
  hero: HeroEntry;
  active: boolean;
  owned: boolean;
  onPeek: () => void;
}) {
  const name = heroName(hero, locale);
  const epithet = heroEpithet(hero, locale);

  return (
    <li className="min-w-0">
      {/*
        Tutta la card e' il bersaglio del clic, immagine compresa: si centra al
        primo colpo anche col pollice. Il passaggio del mouse e il fuoco la
        mettono sul palco; il clic apre la scheda.
      */}
      <Link
        href={`/${game}/eroi/${hero.id}`}
        onMouseEnter={onPeek}
        onFocus={onPeek}
        data-active={active || undefined}
        className="hero-card group block focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="hero-card-art relative block">
          {/*
            Immagine nuda invece di next/image: le card sono grafica di
            interfaccia a 128px esatti, gia' pronte in due densita'.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroCardSrc(game, hero.id)}
            srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
            // Il nome e' scritto qui sotto: ripeterlo nell'alt lo farebbe
            // annunciare due volte a chi usa uno screen reader.
            alt=""
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            className="block aspect-square w-full bg-paper-2"
          />
          {owned ? (
            <span className="hero-card-owned" title={locale === "en" ? "In your box" : "Nel tuo box"}>
              <IconCheck size={12} />
              <span className="sr-only">{locale === "en" ? "In your box" : "Nel tuo box"}</span>
            </span>
          ) : null}
        </span>
        <span className="mt-1.5 block">
          <span className={heroEpithetClass} title={epithet}>
            {epithet}
          </span>
          {/* due righe e non una troncata: «Dio supremo Odino» non sta in 100px */}
          <span className={cx(heroNameClass, "mt-0.5")} title={name}>
            {name}
          </span>
        </span>
      </Link>
    </li>
  );
}
