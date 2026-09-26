"use client";

/**
 * Sfoglia i Set artefatto, coi filtri del gioco.
 *
 * I filtri sono quelli del menu del gioco (DB_artifact_union_filter_group):
 * contenuto, razza, caratteristica, varie. Come la griglia degli eroi si filtra
 * in locale: 78 set con l'effetto al livello massimo sono pochi KB, e un giro
 * sul server a ogni clic non varrebbe niente. I testi di tutti i livelli restano
 * sulla pagina del set.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { GRADE_COLORS } from "@/components/artifacts/artifact-parts";
import { Chip, FilterRow } from "@/components/filter-chips";
import { GameText } from "@/components/heroes/game-text";
import { cx, Empty, Input, numeric } from "@/components/ui";
import { cardImageSrc, countBy, filterSets, type ArtifactSetSummary } from "@/lib/games/artifacts";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    cercaSegnaposto: "Cerca per nome o evento…",
    cercaEtichetta: "Cerca un set",
    tutti: "Tutti",
    // in italiano «set» non cambia al plurale; la funzione c'e' per l'inglese
    set: (n: number): string => (n === 1 ? "set" : "set"),
    suTotale: (n: number) => ` su ${n}`,
    azzera: "Azzera i filtri",
    nessuno: "Nessun set con questi filtri.",
    livelloMassimo: (n: number) => (n === 1 ? "Effetto (un livello solo)" : `Effetto al livello ${n}, il massimo`),
    evento: "Evento",
  },
  en: {
    cercaSegnaposto: "Search by name or event…",
    cercaEtichetta: "Search for a set",
    tutti: "All",
    set: (n: number) => (n === 1 ? "set" : "sets"),
    suTotale: (n: number) => ` of ${n}`,
    azzera: "Clear filters",
    nessuno: "No sets match these filters.",
    livelloMassimo: (n: number) => (n === 1 ? "Effect (a single level)" : `Effect at level ${n}, the maximum`),
    evento: "Event",
  },
});

export interface SetFilterNames {
  readonly titles: { readonly contents: string; readonly races: string; readonly factions: string; readonly misc: string };
  /** codice -> nome e icona, in ordine */
  readonly contents: readonly { readonly code: number; readonly name: string; readonly icon: string | null }[];
  readonly races: readonly { readonly code: number; readonly name: string; readonly icon: string | null }[];
  readonly factions: readonly { readonly code: number; readonly name: string }[];
  readonly misc: readonly { readonly code: number; readonly name: string }[];
}

type Group = "content" | "race" | "faction" | "misc";

export function SetBrowser({
  game,
  sets,
  names,
  frame,
}: {
  game: string;
  sets: readonly ArtifactSetSummary[];
  names: SetFilterNames;
  /** le misure della carta delle liste (ArtifactIndex.images.small) */
  frame: { readonly width: number; readonly height: number };
}) {
  const t = TESTI[useLocale()];
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState<Record<Group, number | null>>({ content: null, race: null, faction: null, misc: null });

  const visible = useMemo(() => filterSets(sets, { search, ...chosen }), [sets, search, chosen]);

  // Ogni fila si conta togliendo il suo filtro: il numero sul pulsante dice
  // quanti set si avrebbero premendolo (come nella griglia degli eroi).
  const counts = useMemo(() => {
    const without = (group: Group) => filterSets(sets, { search, ...chosen, [group]: null });
    return {
      content: countBy(without("content"), (set) => set.contents),
      race: countBy(without("race"), (set) => set.races),
      faction: countBy(without("faction"), (set) => set.factions),
      misc: countBy(without("misc"), (set) => set.misc),
    };
  }, [sets, search, chosen]);

  const filtered = search !== "" || Object.values(chosen).some((value) => value !== null);
  const pick = (group: Group, code: number | null) =>
    setChosen((current) => ({ ...current, [group]: current[group] === code ? null : code }));

  const row = (group: Group, title: string, values: readonly { code: number; name: string; icon?: string | null }[]) =>
    values.length === 0 ? null : (
      <FilterRow label={title} labelClassName="w-[124px]">
        <Chip active={chosen[group] === null} onClick={() => pick(group, null)} label={t.tutti} />
        {values.map((value) => (
          <Chip
            key={value.code}
            active={chosen[group] === value.code}
            onClick={() => pick(group, value.code)}
            label={value.name}
            count={counts[group].get(value.code) ?? 0}
            iconSrc={value.icon ?? undefined}
            withLabel
          />
        ))}
      </FilterRow>
    );

  return (
    <>
      <div className="mb-5 grid gap-3.5 rounded-card border border-rule bg-paper-2 p-4">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.cercaSegnaposto}
          aria-label={t.cercaEtichetta}
          className="h-9 max-w-[320px] bg-paper text-sm"
        />
        {row("content", names.titles.contents, names.contents)}
        {row("race", names.titles.races, names.races)}
        {row("faction", names.titles.factions, names.factions)}
        {row("misc", names.titles.misc, names.misc)}
      </div>

      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <p className="m-0 text-[13px] text-ink-2">
          <strong className={cx(numeric, "font-semibold text-ink")}>{visible.length}</strong> {t.set(visible.length)}
          {filtered ? t.suTotale(sets.length) : null}
        </p>
        {filtered ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setChosen({ content: null, race: null, faction: null, misc: null });
            }}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-ink-3 underline-offset-2 hover:text-brand hover:underline"
          >
            {t.azzera}
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <Empty>{t.nessuno}</Empty>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((set) => (
            <li key={set.number} className="min-w-0">
              <SetCard
                game={game}
                set={set}
                names={names}
                frame={frame}
                levelLabel={t.livelloMassimo(set.levels)}
                eventLabel={t.evento}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function SetCard({
  game,
  set,
  names,
  frame,
  levelLabel,
  eventLabel,
}: {
  game: string;
  set: ArtifactSetSummary;
  names: SetFilterNames;
  frame: { readonly width: number; readonly height: number };
  levelLabel: string;
  eventLabel: string;
}) {
  const contents = set.contents
    .map((code) => names.contents.find((entry) => entry.code === code))
    .filter((entry) => entry !== undefined);
  // le carte in miniatura, verticali come nel gioco
  const width = 56;
  const height = Math.round((width * frame.height) / frame.width);
  return (
    <Link
      href={`/${game}/set-artefatto/${set.number}`}
      className="group flex h-full flex-col rounded-card border border-rule bg-paper-2 p-3.5 transition-colors hover:border-ink-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="flex items-baseline gap-2">
        <span className={cx(numeric, "shrink-0 text-[12px] text-ink-3")}>No.{set.number}</span>
        <span className="min-w-0 text-[15px] font-semibold leading-snug group-hover:text-brand">{set.name}</span>
      </span>
      {set.event && set.event !== set.name ? (
        <span className="mt-0.5 block text-[12px] text-ink-3">
          {eventLabel}: {set.event}
        </span>
      ) : null}

      <span className="mt-2.5 flex flex-wrap gap-1.5">
        {set.cards.map((card) =>
          card.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={card.id}
              src={cardImageSrc(game, card.id, true)}
              alt=""
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              className="block"
              style={{ width, height }}
            />
          ) : (
            <span
              key={card.id}
              aria-hidden
              className="block rounded-[4px] border-2 bg-paper"
              style={{ width, height, borderColor: GRADE_COLORS[card.grade] }}
            />
          ),
        )}
      </span>

      <span className="mt-2.5 block text-[11px] font-medium uppercase tracking-wide text-ink-3">{levelLabel}</span>
      <GameText text={set.effect} omitNotes={false} className="mt-1 text-[13px] leading-snug text-ink-2" />

      {contents.length > 0 ? (
        <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2.5 text-[12px] text-ink-3">
          {contents.map((entry) => (
            <span key={entry.code} className="inline-flex items-center gap-1">
              {entry.icon ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={entry.icon} alt="" width={16} height={16} className="block" style={{ width: 16, height: "auto" }} />
              ) : null}
              {entry.name}
            </span>
          ))}
        </span>
      ) : null}
    </Link>
  );
}
