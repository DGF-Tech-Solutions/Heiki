"use client";

/**
 * Sfoglia il roster.
 *
 * Componente client, e qui la ragione e' concreta: le voci sono centinaia e i
 * filtri sono quattro. Farli passare dall'URL come fa la pagina Personaggi
 * significherebbe un giro sul server a ogni clic, e con quattro sfaccettature
 * si clicca molto. I dati arrivano gia' tutti - sono nomi e sigle, non foto -
 * quindi filtrare in locale e' immediato e non costa una richiesta.
 *
 * Le immagini invece restano fuori dal bundle: le carica il browser una alla
 * volta, solo quando entrano nello schermo.
 *
 * I nomi degli attributi arrivano gia' tradotti dalla pagina, dentro il roster:
 * qui si traducono solo le scritte del componente. Lo stesso per razze e
 * caratteristiche (`traits`), che il roster generato non porta: le aggiunge la
 * pagina dal contesto degli eroi. Dal 26/09 si filtra anche per quelle, e si
 * puo' arrivare qui gia' filtrati (`?razza=3`, `?caratteristica=6`): ci portano
 * le tendine delle parole blu della scheda eroe.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip, FilterRow } from "@/components/filter-chips";
import { cx, Empty, eyebrow, Input, numeric } from "@/components/ui";
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
import type { HeroAffinity, HeroEntry, HeroRoster } from "@/lib/games/types";
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
    tutte: "Tutte",
    tutti: "Tutti",
    eroi: (n: number): string => (n === 1 ? "eroe" : "eroi"),
    suTotale: (n: number) => ` su ${n}`,
    azzera: "Azzera i filtri",
    nessunEroe: "Nessun eroe con questi filtri.",
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
    tutte: "All",
    tutti: "All",
    eroi: (n: number) => (n === 1 ? "hero" : "heroes"),
    suTotale: (n: number) => ` of ${n}`,
    azzera: "Clear filters",
    nessunEroe: "No heroes match these filters.",
  },
});

const ORDERS: readonly HeroOrder[] = ["roster", "name", "group"];

export function RosterBrowser({
  game,
  roster,
  icons,
  initialSearch = "",
  traits,
  initialRace = null,
  initialFaction = null,
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
  /**
   * Ricerca gia' impostata all'arrivo.
   *
   * Serve ai collegamenti che portano qui da una scheda - "altre versioni di
   * Meliodas" - e che devono atterrare su un elenco gia' ristretto. Da qui in
   * poi lo stato e' del componente: e' una partenza, non un vincolo.
   */
  initialSearch?: string;
  /** razze e caratteristiche coi nomi nella lingua della pagina; senza, niente filtri per quelle */
  traits?: {
    races: readonly { code: number; label: string; iconKey?: string }[];
    factions: readonly { code: number; label: string }[];
  };
  /** razza e caratteristica gia' scelte all'arrivo, come `initialSearch` */
  initialRace?: number | null;
  initialFaction?: number | null;
}) {
  const locale = useLocale();
  const t = TESTI[locale];

  const [search, setSearch] = useState(initialSearch);
  const [rarity, setRarity] = useState<string | null>(null);
  const [affinity, setAffinity] = useState<string | null>(null);
  const [obtainable, setObtainable] = useState<string | null>(null);
  const [race, setRace] = useState<number | null>(initialRace);
  const [faction, setFaction] = useState<number | null>(initialFaction);
  const [order, setOrder] = useState<HeroOrder>("roster");

  const heroes = roster.heroes;

  const visible = useMemo(
    () => sortHeroes(filterHeroes(heroes, { search, rarity, affinity, obtainable, race, faction }), order, locale),
    [heroes, search, rarity, affinity, obtainable, race, faction, order, locale],
  );

  // Ogni gruppo di pulsanti si conta escludendo se stesso dal filtro: il numero
  // sul pulsante deve dire quante voci si otterrebbero premendolo, non quante
  // ce ne sono adesso. Contarle tutte allo stesso modo darebbe zero su ogni
  // pulsante non attivo - vero, e inutile.
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

  const byAffinity = useMemo(
    () => new Map(roster.affinities.map((item) => [item.id, item])),
    [roster.affinities],
  );

  // «Caratteristica» non entra nei 74px delle altre etichette: con quella fila
  // tutte si allargano a 124, come nei Set artefatto, e le colonne restano in
  // fila. Sul telefono 124px sono un terzo della riga: l'etichetta va sopra i
  // suoi pulsanti, invece di spingerli a capo a meta'.
  const labelWidth = traits && traits.factions.length > 0 ? "w-full sm:w-[124px]" : undefined;

  const filtered =
    rarity !== null || affinity !== null || obtainable !== null || race !== null || faction !== null || search !== "";

  /** L'icona del gioco per un valore, solo se e' stata estratta. */
  const iconFor = (family: IconFamily, key: string | undefined) =>
    key && icons?.[family]?.includes(key) ? gameIconSrc(game, family, key) : undefined;

  function reset() {
    setSearch("");
    setRarity(null);
    setAffinity(null);
    setObtainable(null);
    setRace(null);
    setFaction(null);
  }

  return (
    <>
      <div className="p5-corner mb-5 grid gap-3.5 border border-l-4 border-rule border-l-brand bg-paper-2 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* la ricerca e' un campo bianco tagliato: CONTROL lo darebbe nero, da qui gli `!` */}
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.cercaSegnaposto}
            aria-label={t.cercaEtichetta}
            className="p5-cut h-9 max-w-[320px] flex-1 border-ink! bg-ink! px-4 text-sm font-semibold text-paper! placeholder:text-paper/60 focus:shadow-[inset_0_-3px_0_var(--color-brand)]"
          />

          <div className="flex items-center gap-1.5">
            <span className={eyebrow}>{t.ordina}</span>
            {ORDERS.map((id) => (
              <Chip
                key={id}
                active={order === id}
                onClick={() => setOrder(id)}
                label={t.ordini[id]}
              />
            ))}
          </div>
        </div>

        <FilterRow label={t.rarita} labelClassName={labelWidth}>
          <Chip
            active={rarity === null}
            onClick={() => setRarity(null)}
            label={t.tutte}
            count={heroes.length}
          />
          {roster.rarities.map((value) => (
            <Chip
              key={value}
              active={rarity === value}
              onClick={() => setRarity(rarity === value ? null : value)}
              label={value}
              iconSrc={iconFor("rarita", value)}
              count={rarityCounts.get(value) ?? 0}
            />
          ))}
        </FilterRow>

        <FilterRow label={t.attributo} labelClassName={labelWidth}>
          <Chip active={affinity === null} onClick={() => setAffinity(null)} label={t.tutti} />
          {roster.affinities.map((item) => (
            <Chip
              key={item.id}
              active={affinity === item.id}
              onClick={() => setAffinity(affinity === item.id ? null : item.id)}
              label={item.label}
              iconSrc={iconFor("attributo", item.iconKey)}
              count={affinityCounts.get(item.id) ?? 0}
              swatch={item}
            />
          ))}
        </FilterRow>

        <FilterRow label={t.esceCome} labelClassName={labelWidth}>
          <Chip active={obtainable === null} onClick={() => setObtainable(null)} label={t.tutte} />
          {roster.obtainable.map((value) => (
            <Chip
              key={value}
              active={obtainable === value}
              onClick={() => setObtainable(obtainable === value ? null : value)}
              label={value}
              iconSrc={iconFor("rarita", value)}
              count={obtainableCounts.get(value) ?? 0}
            />
          ))}
        </FilterRow>

        {/*
          La razza con l'icona E il nome, come nella scheda: i sei simboli si
          riconoscono meno delle sigle di rarita'. Le caratteristiche col nome,
          perche' il gioco un'icona per loro non ce l'ha.
        */}
        {traits && traits.races.length > 0 ? (
          <FilterRow label={t.razza} labelClassName={labelWidth}>
            <Chip active={race === null} onClick={() => setRace(null)} label={t.tutte} />
            {traits.races.map((item) => (
              <Chip
                key={item.code}
                active={race === item.code}
                onClick={() => setRace(race === item.code ? null : item.code)}
                label={item.label}
                iconSrc={iconFor("razza", item.iconKey)}
                withLabel
                count={raceCounts.get(item.code) ?? 0}
              />
            ))}
          </FilterRow>
        ) : null}

        {traits && traits.factions.length > 0 ? (
          <FilterRow label={t.caratteristica} labelClassName={labelWidth}>
            <Chip active={faction === null} onClick={() => setFaction(null)} label={t.tutte} />
            {traits.factions.map((item) => (
              <Chip
                key={item.code}
                active={faction === item.code}
                onClick={() => setFaction(faction === item.code ? null : item.code)}
                label={item.label}
                count={factionCounts.get(item.code) ?? 0}
              />
            ))}
          </FilterRow>
        ) : null}
      </div>

      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <p className="m-0 text-[13px] text-ink-2">
          <strong className={cx(numeric, "p5-cut-sm inline-block bg-brand px-2 font-bold text-paper")}>
            {visible.length}
          </strong>{" "}
          {t.eroi(visible.length)}
          {filtered ? t.suTotale(heroes.length) : null}
        </p>

        {filtered ? (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer border-0 bg-transparent p-0 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-ink-2 underline-offset-2 hover:text-brand hover:underline"
          >
            {t.azzera}
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <Empty>{t.nessunEroe}</Empty>
      ) : (
        <ul
          className="m-0 grid list-none gap-x-3 gap-y-4 p-0"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(104px, 128px))" }}
        >
          {visible.map((hero) => (
            <HeroCard
              key={hero.id}
              game={game}
              locale={locale}
              hero={hero}
              affinity={byAffinity.get(hero.affinity)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ card -- */

function HeroCard({
  game,
  locale,
  hero,
  affinity,
}: {
  game: string;
  locale: Locale;
  hero: HeroEntry;
  affinity: HeroAffinity | undefined;
}) {
  const name = heroName(hero, locale);
  const epithet = heroEpithet(hero, locale);

  return (
    <li className="min-w-0">
      {/*
        Tutta la card e' il bersaglio del clic, immagine compresa: un bersaglio
        di 128px si centra al primo colpo anche col pollice, il nome sotto no.
      */}
      <Link
        href={`/${game}/eroi/${hero.id}`}
        className="group block rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <figure className="m-0">
          {/*
          Immagine nuda invece di next/image: le card sono grafica di interfaccia
          a 128px esatti, gia' pronte in due densita'. L'ottimizzatore le
          ricomprimerebbe senza guadagno, e con `unoptimized` next/image non
          emette srcSet, quindi la variante 2x andrebbe persa.
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
            className="block w-full rounded-[3px] bg-paper-2 transition duration-150 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0_var(--color-brand)]"
          />

          <figcaption className="mt-1.5">
            <p
              className="m-0 truncate text-[11px] leading-tight text-ink-3"
              title={epithet}
              style={affinity ? { color: affinity.color } : undefined}
            >
              {epithet}
            </p>
            <p
              className="m-0 font-display text-[13px] font-black uppercase leading-tight tracking-[0.01em] [font-variation-settings:'wdth'_75] group-hover:text-brand"
              title={name}
            >
              {name}
            </p>
          </figcaption>
        </figure>
      </Link>
    </li>
  );
}
