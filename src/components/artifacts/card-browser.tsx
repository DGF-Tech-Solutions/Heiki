"use client";

/**
 * Sfoglia le Carte artefatto: tipo, grado, e se la carta fa parte di un set.
 *
 * Come la griglia degli eroi: le voci arrivano gia' tutte (sigla, nome, tipo,
 * grado: pochi KB per 499 carte) e si filtrano in locale; le immagini le carica
 * il browser quando entrano nello schermo.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { GRADE_COLORS } from "@/components/artifacts/artifact-parts";
import { Chip, FilterRow } from "@/components/filter-chips";
import { cx, Empty, Input, numeric } from "@/components/ui";
import { cardImageSrc, countBy, filterCards, type ArtifactCardSummary } from "@/lib/games/artifacts";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    cercaSegnaposto: "Cerca per nome, sigla o set…",
    cercaEtichetta: "Cerca una carta",
    tipo: "Tipo",
    grado: "Grado",
    set: "Set",
    tutti: "Tutti",
    inUnSet: "In un set",
    fuori: "Fuori dai set",
    carte: (n: number): string => (n === 1 ? "carta" : "carte"),
    suTotale: (n: number) => ` su ${n}`,
    azzera: "Azzera i filtri",
    nessuna: "Nessuna carta con questi filtri.",
  },
  en: {
    cercaSegnaposto: "Search by name, code or set…",
    cercaEtichetta: "Search for a card",
    tipo: "Type",
    grado: "Grade",
    set: "Set",
    tutti: "All",
    inUnSet: "In a set",
    fuori: "Not in a set",
    carte: (n: number) => (n === 1 ? "card" : "cards"),
    suTotale: (n: number) => ` of ${n}`,
    azzera: "Clear filters",
    nessuna: "No cards match these filters.",
  },
});

export function CardBrowser({
  game,
  cards,
  types,
  grades,
}: {
  game: string;
  cards: readonly ArtifactCardSummary[];
  /** in ordine: codice e nome del tipo */
  types: readonly { readonly code: number; readonly name: string }[];
  grades: readonly { readonly code: number; readonly name: string }[];
}) {
  const t = TESTI[useLocale()];
  const [search, setSearch] = useState("");
  const [type, setType] = useState<number | null>(null);
  const [grade, setGrade] = useState<number | null>(null);
  const [inSet, setInSet] = useState<boolean | null>(null);

  const visible = useMemo(() => filterCards(cards, { search, type, grade, inSet }), [cards, search, type, grade, inSet]);
  const typeCounts = useMemo(
    () => countBy(filterCards(cards, { search, grade, inSet }), (card) => [card.type]),
    [cards, search, grade, inSet],
  );
  const gradeCounts = useMemo(
    () => countBy(filterCards(cards, { search, type, inSet }), (card) => [card.grade]),
    [cards, search, type, inSet],
  );
  const setCounts = useMemo(
    () => countBy(filterCards(cards, { search, type, grade }), (card) => [card.set !== null ? "si" : "no"]),
    [cards, search, type, grade],
  );

  const filtered = search !== "" || type !== null || grade !== null || inSet !== null;

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
        <FilterRow label={t.tipo}>
          <Chip active={type === null} onClick={() => setType(null)} label={t.tutti} />
          {types.map((entry) => (
            <Chip
              key={entry.code}
              active={type === entry.code}
              onClick={() => setType(type === entry.code ? null : entry.code)}
              label={entry.name}
              count={typeCounts.get(entry.code) ?? 0}
            />
          ))}
        </FilterRow>
        <FilterRow label={t.grado}>
          <Chip active={grade === null} onClick={() => setGrade(null)} label={t.tutti} />
          {grades.map((entry) => (
            <Chip
              key={entry.code}
              active={grade === entry.code}
              onClick={() => setGrade(grade === entry.code ? null : entry.code)}
              label={entry.name}
              count={gradeCounts.get(entry.code) ?? 0}
            />
          ))}
        </FilterRow>
        <FilterRow label={t.set}>
          <Chip active={inSet === null} onClick={() => setInSet(null)} label={t.tutti} />
          <Chip
            active={inSet === true}
            onClick={() => setInSet(inSet === true ? null : true)}
            label={t.inUnSet}
            count={setCounts.get("si") ?? 0}
          />
          <Chip
            active={inSet === false}
            onClick={() => setInSet(inSet === false ? null : false)}
            label={t.fuori}
            count={setCounts.get("no") ?? 0}
          />
        </FilterRow>
      </div>

      <div className="mb-3.5 flex items-baseline justify-between gap-3">
        <p className="m-0 text-[13px] text-ink-2">
          <strong className={cx(numeric, "font-semibold text-ink")}>{visible.length}</strong> {t.carte(visible.length)}
          {filtered ? t.suTotale(cards.length) : null}
        </p>
        {filtered ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setType(null);
              setGrade(null);
              setInSet(null);
            }}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-ink-3 underline-offset-2 hover:text-brand hover:underline"
          >
            {t.azzera}
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <Empty>{t.nessuna}</Empty>
      ) : (
        <ul
          className="m-0 grid list-none gap-x-3 gap-y-4 p-0"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}
        >
          {visible.map((card) => (
            <li key={card.id} className="min-w-0">
              <Link
                href={`/${game}/carte-artefatto/${card.id}`}
                className="group block rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {card.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cardImageSrc(game, card.id, true)}
                    alt=""
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-square w-full rounded-[4px] border-2 bg-paper-2 object-cover transition-transform group-hover:-translate-y-0.5"
                    style={{ borderColor: GRADE_COLORS[card.grade] }}
                  />
                ) : (
                  <span
                    aria-hidden
                    className="block aspect-square w-full rounded-[4px] border-2 bg-paper-2"
                    style={{ borderColor: GRADE_COLORS[card.grade] }}
                  />
                )}
                <span className="mt-1.5 flex items-center gap-1.5">
                  <span className={cx(numeric, "text-[11px] text-ink-3")}>{card.code}</span>
                  <span
                    className={cx(numeric, "rounded-[3px] border px-1 text-[10px] font-bold leading-[15px]")}
                    style={{ color: GRADE_COLORS[card.grade], borderColor: GRADE_COLORS[card.grade] }}
                  >
                    {grades.find((entry) => entry.code === card.grade)?.name}
                  </span>
                </span>
                <span className="mt-0.5 block text-[12px] font-semibold leading-tight group-hover:text-brand">
                  {card.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
