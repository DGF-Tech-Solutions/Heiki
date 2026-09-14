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
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { cx, Empty, eyebrow, Input, numeric } from "@/components/ui";
import {
  countHeroes,
  filterHeroes,
  gameIconSrc,
  heroCardSrc,
  sortHeroes,
  type HeroOrder,
  type IconFamily,
} from "@/lib/games/heroes";
import type { HeroAffinity, HeroEntry, HeroRoster } from "@/lib/games/types";

const ORDERS: readonly { id: HeroOrder; label: string }[] = [
  { id: "roster", label: "Recenti" },
  { id: "name", label: "Nome" },
  { id: "group", label: "Personaggio" },
];

export function RosterBrowser({
  game,
  roster,
  icons,
  initialSearch = "",
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
}) {
  const [search, setSearch] = useState(initialSearch);
  const [rarity, setRarity] = useState<string | null>(null);
  const [affinity, setAffinity] = useState<string | null>(null);
  const [obtainable, setObtainable] = useState<string | null>(null);
  const [order, setOrder] = useState<HeroOrder>("roster");

  const heroes = roster.heroes;

  const visible = useMemo(
    () => sortHeroes(filterHeroes(heroes, { search, rarity, affinity, obtainable }), order),
    [heroes, search, rarity, affinity, obtainable, order],
  );

  // Ogni gruppo di pulsanti si conta escludendo se stesso dal filtro: il numero
  // sul pulsante deve dire quante voci si otterrebbero premendolo, non quante
  // ce ne sono adesso. Contarle tutte allo stesso modo darebbe zero su ogni
  // pulsante non attivo - vero, e inutile.
  const rarityCounts = useMemo(
    () => countHeroes(filterHeroes(heroes, { search, affinity, obtainable }), "rarity"),
    [heroes, search, affinity, obtainable],
  );
  const affinityCounts = useMemo(
    () => countHeroes(filterHeroes(heroes, { search, rarity, obtainable }), "affinity"),
    [heroes, search, rarity, obtainable],
  );
  const obtainableCounts = useMemo(
    () => countHeroes(filterHeroes(heroes, { search, rarity, affinity }), "obtainedAs"),
    [heroes, search, rarity, affinity],
  );

  const byAffinity = useMemo(
    () => new Map(roster.affinities.map((item) => [item.id, item])),
    [roster.affinities],
  );

  const filtered = rarity !== null || affinity !== null || obtainable !== null || search !== "";

  /** L'icona del gioco per un valore, solo se e' stata estratta. */
  const iconFor = (family: IconFamily, key: string | undefined) =>
    key && icons?.[family]?.includes(key) ? gameIconSrc(game, family, key) : undefined;

  function reset() {
    setSearch("");
    setRarity(null);
    setAffinity(null);
    setObtainable(null);
  }

  return (
    <>
      <div className="mb-5 grid gap-3.5 rounded-card border border-rule bg-paper-2 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cerca per nome, epiteto o personaggio…"
            aria-label="Cerca un eroe"
            className="h-9 max-w-[320px] flex-1 bg-paper text-sm"
          />

          <div className="flex items-center gap-1.5">
            <span className={eyebrow}>Ordina</span>
            {ORDERS.map((item) => (
              <Chip
                key={item.id}
                active={order === item.id}
                onClick={() => setOrder(item.id)}
                label={item.label}
              />
            ))}
          </div>
        </div>

        <FilterRow label="Rarità">
          <Chip
            active={rarity === null}
            onClick={() => setRarity(null)}
            label="Tutte"
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

        <FilterRow label="Attributo">
          <Chip active={affinity === null} onClick={() => setAffinity(null)} label="Tutti" />
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

        <FilterRow label="Esce come">
          <Chip active={obtainable === null} onClick={() => setObtainable(null)} label="Tutte" />
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
      </div>

      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <p className="m-0 text-[13px] text-ink-2">
          <strong className={cx(numeric, "font-semibold text-ink")}>{visible.length}</strong>{" "}
          {visible.length === 1 ? "eroe" : "eroi"}
          {filtered ? ` su ${heroes.length}` : null}
        </p>

        {filtered ? (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-ink-3 underline-offset-2 hover:text-brand hover:underline"
          >
            Azzera i filtri
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <Empty>Nessun eroe con questi filtri.</Empty>
      ) : (
        <ul
          className="m-0 grid list-none gap-x-3 gap-y-4 p-0"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(104px, 128px))" }}
        >
          {visible.map((hero) => (
            <HeroCard
              key={hero.id}
              game={game}
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
  hero,
  affinity,
}: {
  game: string;
  hero: HeroEntry;
  affinity: HeroAffinity | undefined;
}) {
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
            className="block w-full rounded-[3px] bg-paper-2 transition-transform group-hover:-translate-y-0.5"
          />

          <figcaption className="mt-1.5">
            <p
              className="m-0 truncate text-[11px] leading-tight text-ink-3"
              title={hero.epithet}
              style={affinity ? { color: affinity.color } : undefined}
            >
              {hero.epithet}
            </p>
            <p
              className="m-0 text-[12px] font-semibold leading-tight group-hover:text-brand"
              title={hero.name}
            >
              {hero.name}
            </p>
          </figcaption>
        </figure>
      </Link>
    </li>
  );
}

/* --------------------------------------------------------------- filtri -- */

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className={cx(eyebrow, "w-[74px] shrink-0")}>{label}</span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  label,
  count,
  swatch,
  iconSrc,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  /** quadrato del colore dell'attributo: il ripiego dove il gioco non da' l'icona */
  swatch?: HeroAffinity;
  /**
   * L'icona del gioco. Quando c'e' prende il posto della scritta, non le si
   * affianca: sono le stesse icone che il gioco mette sui propri filtri, e una
   * fila di pulsanti si scorre a colpo d'occhio.
   *
   * La parola non sparisce davvero: resta nell'`alt`, nel `title` e
   * nell'`aria-label` del pulsante, quindi il filtro si legge col mouse fermo
   * e funziona con un lettore di schermo.
   */
  iconSrc?: string;
}) {
  const empty = count === 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={empty}
      aria-pressed={active}
      aria-label={iconSrc ? label : undefined}
      title={iconSrc ? label : undefined}
      className={cx(
        // h-9 e non h-7: i pulsanti dei filtri portano le icone del gioco, e a
        // 22px in un pulsante da 28 non respiravano. L'altezza e' la stessa per
        // tutti - anche per "Tutte" e per la riga Ordina, che di icona non ne
        // hanno - perche' pulsanti di altezze diverse nella stessa fila si
        // leggono come due gruppi diversi.
        "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-card border px-2.5",
        "text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-35",
        active
          ? "border-brand bg-brand-soft font-semibold text-ink"
          : "border-rule bg-paper text-ink-2 hover:border-ink-3 hover:text-ink",
      )}
    >
      {iconSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={iconSrc} alt={label} width={22} height={22} className="block h-[22px] w-auto" />
      ) : (
        <>
          {swatch ? (
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-[1px]"
              style={{
                background: swatch.colorAlt
                  ? `linear-gradient(135deg, ${swatch.color} 50%, ${swatch.colorAlt} 50%)`
                  : swatch.color,
              }}
            />
          ) : null}
          {label}
        </>
      )}

      {count === undefined ? null : (
        <span className={cx(numeric, "text-[10px] text-ink-3")}>{count}</span>
      )}
    </button>
  );
}
