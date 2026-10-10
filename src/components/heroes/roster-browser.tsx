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
 *     dalle tendine delle parole blu (`?razza=3`, `?caratteristica=6`)
 *   - «I miei»: solo gli eroi del tuo box, se ne hai segnati (use-hero-box.ts)
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { readableColor } from "@/components/heroes/game-color";
import { HeroStage, type StageBadge } from "@/components/heroes/hero-stage";
import { IconChevronRight } from "@/components/icons";
import { buttonClass, cx, Empty, eyebrow, Input, numeric } from "@/components/ui";
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
    miei: "I miei",
    mieiTitolo: "Solo gli eroi del tuo box",
    eroi: (n: number): string => (n === 1 ? "eroe" : "eroi"),
    suTotale: (n: number) => ` su ${n}`,
    azzera: "Azzera i filtri",
    nessunEroe: "Nessun eroe con questi filtri.",
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
    miei: "Mine",
    mieiTitolo: "Only the heroes in your box",
    eroi: (n: number) => (n === 1 ? "hero" : "heroes"),
    suTotale: (n: number) => ` of ${n}`,
    azzera: "Clear filters",
    nessunEroe: "No heroes match these filters.",
    togliUltimo: (label: string) => `Remove “${label}”`,
    apri: "Open the page",
    percorso: (from: string, to: string) => (from === to ? from : `${from} → ${to}`),
  },
});

const ORDERS: readonly HeroOrder[] = ["roster", "name", "group"];

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

export function RosterBrowser({
  game,
  roster,
  icons,
  initial = EMPTY_QUERY,
  traits,
  intro,
  art = {},
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
  /** i filtri all'arrivo, letti dall'indirizzo dalla pagina */
  initial?: RosterQuery;
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
  /** le illustrazioni che non sono scontornate: «full» (sfondo dipinto) o «none» (manca) */
  art?: Readonly<Record<string, "full" | "none">>;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [query, setQuery] = useState<RosterQuery>(initial);
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

  const filtered =
    rarity !== null || affinity !== null || obtainable !== null || race !== null || faction !== null || search !== "" || mine;
  const moreOpen = obtainable !== null || faction !== null;

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
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
      <div className="min-w-0">
        {intro}
        <div className="mb-4 grid gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* la ricerca e' un campo bianco tagliato: CONTROL lo darebbe nero, da qui gli `!` */}
            <Input
              type="search"
              value={search}
              onChange={(event) => change({ search: event.target.value })}
              placeholder={t.cercaSegnaposto}
              aria-label={t.cercaEtichetta}
              className="p5-cut h-10 min-w-[200px] max-w-[340px] flex-1 border-ink! bg-ink! px-4 text-sm font-semibold text-paper! placeholder:text-paper/60 focus:shadow-[inset_0_-3px_0_var(--color-brand)]"
            />
            <div role="group" aria-label={t.ordina} className="flex items-center gap-1">
              <span className={cx(eyebrow, "mr-1")}>{t.ordina}</span>
              {ORDERS.map((id) => (
                <Chip key={id} active={order === id} quiet onClick={() => change({ order: id })} label={t.ordini[id]} />
              ))}
            </div>
            {hasBox ? (
              <span title={t.mieiTitolo}>
                <Chip
                  active={mine}
                  onClick={() => change({ mine: !mine })}
                  label={t.miei}
                  count={boxSize(box)}
                />
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <IconGroup label={t.rarita}>
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
            </IconGroup>
            <IconGroup label={t.attributo}>
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
            </IconGroup>
            {traits && traits.races.length > 0 ? (
              <IconGroup label={t.razza}>
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
              </IconGroup>
            ) : null}
          </div>

          {/*
            Le due file che si usano meno, sotto un tocco. Aperte da sole se uno
            dei loro filtri e' scelto (anche arrivando dall'indirizzo).
          */}
          <details open={moreOpen || undefined} className="group/altri">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-display text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink-2 [font-variation-settings:'wdth'_85] hover:text-ink [&::-webkit-details-marker]:hidden">
              <IconChevronRight size={14} className="transition-transform group-open/altri:rotate-90" />
              {t.altriFiltri}
            </summary>
            <div className="mt-2.5 grid gap-2.5">
              <IconGroup label={t.esceCome}>
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
              </IconGroup>
              {traits && traits.factions.length > 0 ? (
                <IconGroup label={t.caratteristica}>
                  {traits.factions.map((item) => (
                    <Chip
                      key={item.code}
                      active={faction === item.code}
                      onClick={() => change({ faction: faction === item.code ? null : item.code })}
                      label={item.label}
                      count={factionCounts.get(item.code) ?? 0}
                    />
                  ))}
                </IconGroup>
              ) : null}
            </div>
          </details>
        </div>

        <div className="mb-3.5 flex items-baseline justify-between gap-3">
          <p className="m-0 text-[13px] text-ink-2" aria-live="polite">
            <strong className={cx(numeric, "p5-cut-sm inline-block bg-ink px-2 font-bold text-paper")}>
              {visible.length}
            </strong>{" "}
            {t.eroi(visible.length)}
            {filtered ? t.suTotale(roster.heroes.length) : null}
          </p>
          {filtered ? (
            <button
              type="button"
              onClick={() => setQuery({ ...EMPTY_QUERY, order })}
              className="cursor-pointer border-0 bg-transparent p-0 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink-2 underline-offset-2 hover:text-brand-deep hover:underline"
            >
              {t.azzera}
            </button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <Empty>{t.nessunEroe}</Empty>
        ) : (
          <ul
            className="m-0 grid list-none gap-x-2.5 gap-y-3.5 p-0"
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
            art={art[active.id] ?? "cutout"}
            priority
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

function IconGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className={cx(eyebrow, "mr-0.5 shrink-0")}>{label}</span>
      {children}
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
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
                <path d="M2 6.4 4.8 9 10 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
              </svg>
              <span className="sr-only">{locale === "en" ? "In your box" : "Nel tuo box"}</span>
            </span>
          ) : null}
        </span>
        <span className="mt-1.5 block">
          <span className="block truncate text-[12px] leading-tight text-ink-3" title={epithet}>
            {epithet}
          </span>
          {/* due righe e non una troncata: «Dio supremo Odino» non sta in 100px */}
          <span
            className="hero-card-name line-clamp-2 font-display text-[13px] font-black uppercase leading-[1.08] tracking-[0.01em] [font-variation-settings:'wdth'_72]"
            title={name}
          >
            {name}
          </span>
        </span>
      </Link>
    </li>
  );
}
