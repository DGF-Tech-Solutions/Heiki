"use client";

/**
 * La griglia Eroi (rifatta il 06/11).
 *
 *   - a tutta larghezza: l'anteprima accanto alla griglia non c'e' piu', rubava spazio
 *   - sul computer i filtri sono sempre aperti, in una tabella compatta. Sul telefono
 *     stanno dietro «Filtri», e quelli scelti restano in vista come tasselli
 *   - l'ordine e' un menu nativo del browser
 *
 * I filtri si scrivono nell'indirizzo e si rileggono da li': su Indietro Next rimette la
 * pagina del primo arrivo, e uno stato seminato dal server tornerebbe vecchio (11/10).
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Chip } from "@/components/filter-chips";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { IconCheck, IconClose, IconFilters } from "@/components/icons";
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
  Select,
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
    togli: (label: string) => `Togli «${label}»`,
    vaiEroi: "Vai agli eroi",
    saltaEroi: "Salta gli eroi",
    frecce: "Nella griglia le frecce passano da una card all'altra",
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
    togli: (label: string) => `Remove “${label}”`,
    vaiEroi: "Go to the heroes",
    saltaEroi: "Skip the heroes",
    frecce: "In the grid, the arrow keys move between cards",
  },
});

const ORDERS: readonly HeroOrder[] = ["roster", "name", "group"];

/** I collegamenti che si vedono solo col fuoco della tastiera. */
const SALTO =
  "salto sr-only focus:not-sr-only focus:block focus:w-fit focus:px-3 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-ink";

/** Lo stato dei filtri, come sta nell'indirizzo. */
interface RosterQuery {
  search: string;
  rarity: string | null;
  affinity: string | null;
  obtainable: string | null;
  race: number | null;
  faction: number | null;
  order: HeroOrder;
  mine: boolean;
}

const EMPTY_QUERY: RosterQuery = {
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
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  // i filtri all'arrivo dall'indirizzo di adesso, anche tornando con Indietro
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

  // Tastiera (25/10, dalla ricerca: Pokemon Showdown, nikke.gg). Le card
  // restano tutte nel Tab; in piu' le frecce spostano il fuoco di card in card
  // (su e giu' di una riga, contando le colonne di adesso), Inizio e Fine al
  // primo e all'ultimo, Invio apre la scheda; «Salta gli eroi», prima della
  // griglia, evita 381 Tab
  const grid = useRef<HTMLUListElement>(null);
  const onGridKey = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const columns = grid.current ? getComputedStyle(grid.current).gridTemplateColumns.split(" ").length : 1;
    const focused = (event.target as HTMLElement).closest<HTMLElement>("[data-hero]")?.dataset.hero;
    const from = Math.max(0, visible.findIndex((hero) => hero.id === focused));
    const moves: Record<string, number> = {
      ArrowLeft: from - 1,
      ArrowRight: from + 1,
      ArrowUp: from - columns,
      ArrowDown: from + columns,
      Home: 0,
      End: visible.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = visible[Math.min(visible.length - 1, Math.max(0, target))];
    const card = next ? grid.current?.querySelector<HTMLElement>(`[data-hero="${next.id}"]`) : null;
    // `focus()` da solo lascia una card mezza sotto la barra ferma, o mezza fuori dallo
    // schermo: `scrollIntoView` tiene conto dei margini di scorrimento della card
    card?.focus({ preventScroll: true });
    card?.scrollIntoView({ block: "nearest" });
  };

  // I filtri scelti, in parole: sul telefono, a pannello chiuso, sono l'unico modo di
  // sapere perche' la griglia mostra meno eroi. Il numero di «Filtri» da solo non lo dice.
  const chosen: { label: string; clear: Partial<RosterQuery> }[] = [
    ...(mine ? [{ label: t.miei, clear: { mine: false } }] : []),
    ...(rarity ? [{ label: rarity, clear: { rarity: null } }] : []),
    ...(affinity ? [{ label: byAffinity.get(affinity)?.label ?? affinity, clear: { affinity: null } }] : []),
    ...(race !== null
      ? [{ label: traits?.races.find((item) => item.code === race)?.label ?? String(race), clear: { race: null } }]
      : []),
    ...(obtainable ? [{ label: `${t.esceCome} ${obtainable}`, clear: { obtainable: null } }] : []),
    ...(faction !== null
      ? [{ label: traits?.factions.find((item) => item.code === faction)?.label ?? String(faction), clear: { faction: null } }]
      : []),
  ];
  const activeCount = chosen.length;
  const filtered = activeCount > 0 || search !== "";
  const reset = () => setQuery({ ...EMPTY_QUERY, order });

  // Solo per il telefono. Parte chiuso anche arrivando gia' filtrati (`?razza=3` dalle
  // parole blu): chi arriva cosi' vuole vedere gli eroi, e i tasselli dicono quali filtri ci sono
  const [panelOpen, setPanelOpen] = useState(false);
  const panelId = useId();

  /** L'icona del gioco per un valore, solo se e' stata estratta. */
  const iconFor = (family: IconFamily, key: string | undefined) =>
    key && icons?.[family]?.includes(key) ? gameIconSrc(game, family, key) : undefined;

  return (
    <>
      {/*
        La barra: ricerca, conteggio e ordine. Sul computer resta ferma sotto
        l'intestazione: la pagina e' lunga 9.000 px, e senza si risalirebbe tutta per
        cercare o azzerare. Sotto i filtri: sul computer sempre aperti (06/11, l'utente:
        «per comodita' e velocita'»), sul telefono dietro «Filtri», perche' aperti
        lascerebbero zero card nel primo schermo.
      */}
      <div className="barra-eroi flex flex-wrap items-center gap-x-2.5 gap-y-3">
        {/* la ricerca e' un campo bianco tagliato: CONTROL lo darebbe nero, da qui gli `!` */}
        <Input
          type="search"
          value={search}
          onChange={(event) => change({ search: event.target.value })}
          placeholder={t.cercaSegnaposto}
          aria-label={t.cercaEtichetta}
          className="p5-cut h-10 border-plate! bg-plate! px-4 text-sm font-semibold text-on-plate! placeholder:text-on-plate/60 lg:min-w-[200px] lg:max-w-[440px] lg:flex-1"
        />

        <button
          type="button"
          aria-expanded={panelOpen}
          aria-controls={panelId}
          onClick={() => setPanelOpen((open) => !open)}
          className={chipClass(false, false, "barra-filtri shrink-0 lg:hidden")}
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

        <p className="m-0 ml-auto text-[14px] text-ink-2" aria-live="polite">
          <strong className={cx(numeric, "font-semibold text-ink")}>{visible.length}</strong> {t.eroi(visible.length)}
          {/* non sul telefono: accanto a «Filtri» e all'ordine la riga andrebbe a capo */}
          {filtered ? (
            <span className="text-ink-3 max-sm:hidden">
              {" "}
              {t.su} <span className={numeric}>{roster.heroes.length}</span>
            </span>
          ) : null}
        </p>

        {/* sul computer qui, accanto al conteggio; sul telefono sta con i tasselli */}
        {filtered && visible.length > 0 ? (
          <button type="button" onClick={reset} className={buttonClass("ghost", "sm", "shrink-0 max-lg:hidden")}>
            {t.azzera}
          </button>
        ) : null}

        <label className="flex shrink-0 items-center gap-2 text-[13px] text-ink-3 lg:ml-3">
          {t.ordina}
          <Select
            value={order}
            onChange={(event) => change({ order: event.target.value as HeroOrder })}
            className="barra-ordine w-auto"
          >
            {ORDERS.map((id) => (
              <option key={id} value={id}>
                {t.ordini[id]}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {/* da tastiera i filtri sono una trentina di pulsanti: chi vuole gli eroi ci salta sopra */}
      {visible.length > 0 ? (
        <a href="#eroi" className={SALTO}>
          {t.vaiEroi}
        </a>
      ) : null}

      <div
        id={panelId}
        className={cx("filtri gap-4", panelOpen ? "grid" : "hidden lg:grid")}
        onPointerOver={(event) => spingiSuccessivi(event.currentTarget, event.target)}
        onPointerLeave={(event) => spingiSuccessivi(event.currentTarget, null)}
        onFocus={(event) => spingiSuccessivi(event.currentTarget, event.target)}
        onBlur={(event) => spingiSuccessivi(event.currentTarget, null)}
      >
        {hasBox ? (
          <span title={t.mieiTitolo} className="justify-self-start">
            <Chip active={mine} onClick={() => change({ mine: !mine })} label={t.miei} count={boxSize(box)} />
          </span>
        ) : null}
        {/*
          Icona del gioco e parola insieme: l'icona del grado da sola a 22 px non si legge.
          A riposo stanno in grigio (pulito.css), se no pesano: a colori restano solo gli
          attributi (`colored`), dove il colore e' un'informazione. Caratteristica senza:
          per quelle il gioco non ha icone.
        */}
        <FilterGroup label={t.rarita}>
          {roster.rarities.map((value) => (
            <Chip
              key={value}
              active={rarity === value}
              onClick={() => change({ rarity: rarity === value ? null : value })}
              label={value}
              iconSrc={iconFor("rarita", value)}
              withLabel
              count={rarityCounts.get(value) ?? 0}
            />
          ))}
        </FilterGroup>
        <FilterGroup label={t.esceCome}>
          {roster.obtainable.map((value) => (
            <Chip
              key={value}
              active={obtainable === value}
              onClick={() => change({ obtainable: obtainable === value ? null : value })}
              label={value}
              iconSrc={iconFor("rarita", value)}
              withLabel
              count={obtainableCounts.get(value) ?? 0}
            />
          ))}
        </FilterGroup>
        <FilterGroup label={t.attributo} wide colored>
          {roster.affinities.map((item) => (
            <Chip
              key={item.id}
              active={affinity === item.id}
              onClick={() => change({ affinity: affinity === item.id ? null : item.id })}
              label={item.label}
              iconSrc={iconFor("attributo", item.iconKey)}
              withLabel
              count={affinityCounts.get(item.id) ?? 0}
              swatch={item}
            />
          ))}
        </FilterGroup>
        {traits && traits.races.length > 0 ? (
          <FilterGroup label={t.razza} wide>
            {traits.races.map((item) => (
              <Chip
                key={item.code}
                active={race === item.code}
                onClick={() => change({ race: race === item.code ? null : item.code })}
                label={item.label}
                iconSrc={iconFor("razza", item.iconKey)}
                withLabel
                count={raceCounts.get(item.code) ?? 0}
              />
            ))}
          </FilterGroup>
        ) : null}
        {traits && traits.factions.length > 0 ? (
          <FilterGroup label={t.caratteristica} wide>
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

      {activeCount > 0 ? (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 lg:hidden">
          {chosen.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => change(item.clear)}
              aria-label={t.togli(item.label)}
              className={buttonClass("ghost", "sm", "tassello shrink-0")}
            >
              {item.label}
              <IconClose size={12} />
            </button>
          ))}
          <button type="button" onClick={reset} aria-label={t.azzera} className={buttonClass("ghost", "sm", "shrink-0")}>
            <span className="max-sm:hidden">{t.azzera}</span>
            <span className="sm:hidden">{t.azzeraBreve}</span>
          </button>
        </div>
      ) : null}

      <div className="mt-5">
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
          <>
            <a href="#dopo-gli-eroi" className={SALTO}>
              {t.saltaEroi}
              <span className="block font-normal text-ink-3">{t.frecce}</span>
            </a>
            <ul
              ref={grid}
              id="eroi"
              tabIndex={-1}
              onKeyDown={onGridKey}
              className="griglia-eroi m-0 grid list-none scroll-mt-24 gap-x-2.5 gap-y-4 p-0 focus:outline-none lg:scroll-mt-36"
            >
              {visible.map((hero) => (
                <HeroCard
                  key={hero.id}
                  game={game}
                  locale={locale}
                  hero={hero}
                  owned={hasBox && ownsHero(box, hero.id)}
                  tint={byAffinity.get(hero.affinity)?.color}
                />
              ))}
            </ul>
            <span id="dopo-gli-eroi" tabIndex={-1} />
          </>
        )}
      </div>
    </>
  );
}

/**
 * Al passaggio un filtro si allunga e spinge i successivi della sua riga. La spinta e' un
 * `transform` (pulito.css), non un cambio di larghezza: con la larghezza vera un pulsante
 * finiva sulla riga sopra o sotto e la pagina saltava, a certe larghezze dello schermo.
 * Il CSS non sa quali pulsanti stanno sulla stessa riga: lo dice `offsetTop`.
 */
function spingiSuccessivi(panel: HTMLElement, target: EventTarget | null) {
  const chosen = target instanceof Element ? target.closest<HTMLElement>("button:enabled") : null;
  for (const button of panel.querySelectorAll<HTMLElement>("button")) {
    const after =
      chosen !== null &&
      button.parentElement === chosen.parentElement &&
      button.offsetTop === chosen.offsetTop &&
      Boolean(chosen.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING);
    button.toggleAttribute("data-spinto", after);
  }
}

/**
 * Una fila di pulsanti con la sua etichetta. Sul computer etichette e pulsanti entrano
 * nella tabella dei filtri (`.filtri` in pulito.css, `lg:contents`), con le etichette in
 * colonna; `wide` prende tutta la riga. Sul telefono l'etichetta sta sopra: una colonna
 * si mangerebbe un terzo dei 358 px.
 */
function FilterGroup({
  label,
  wide = false,
  colored = false,
  children,
}: {
  label: string;
  wide?: boolean;
  /** le icone restano a colori anche a riposo */
  colored?: boolean;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="grid gap-1.5 lg:contents">
      <span id={id} className={cx(eyebrow, "filtri-etichetta")}>
        {label}
      </span>
      <div className={cx("filtri-opzioni flex flex-wrap gap-1.5", wide && "filtri-ampio", colored && "filtri-colore")}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ card -- */

const HeroCard = memo(function HeroCard({
  game,
  locale,
  hero,
  owned,
  tint,
}: {
  game: string;
  locale: Locale;
  hero: HeroEntry;
  owned: boolean;
  /** il colore dell'attributo: la piastra al passaggio */
  tint?: string;
}) {
  const name = heroName(hero, locale);
  const epithet = heroEpithet(hero, locale);

  return (
    <li className="min-w-0">
      {/* tutta la card e' il bersaglio del clic, immagine compresa: si centra al primo colpo anche col pollice */}
      <Link
        href={`/${game}/eroi/${hero.id}`}
        data-hero={hero.id}
        style={tint ? ({ "--tinta": tint } as CSSProperties) : undefined}
        // col fuoco la card scorre in vista sotto intestazione e barra ferme, non dietro (WCAG 2.4.11)
        className="hero-card group block scroll-mt-24 scroll-mb-4 lg:scroll-mt-36"
      >
        <span className="hero-card-art relative block">
          {/*
            Sempre il file da 256, non quello da 128 con `srcSet` per densita': il browser
            sceglieva per la densita' dello schermo, e su uno schermo normale stirava i
            128 px sulla misura vera (130 px a 1920, 147 a 2560). Rimpicciolito resta nitido.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroCardSrc(game, hero.id, 2)}
            // Il nome e' scritto qui sotto: ripeterlo nell'alt lo farebbe
            // annunciare due volte a chi usa uno screen reader.
            alt=""
            width={256}
            height={256}
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
});
