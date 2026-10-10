import Link from "next/link";
import { cx, eyebrow } from "@/components/ui";
import { formatStat, isPercentStat, statName } from "@/components/heroes/calculator/stat-rows";
import type { ChangePart, HeroChange, HeroTouchup } from "@/lib/games/changes-types";
import { compressRanges, groupChanges, touchupParts, type ChangeGroup } from "@/lib/games/changes";
import { heroEpithet, heroName } from "@/lib/games/heroes";
import type { HeroEntry, HeroLabel } from "@/lib/games/types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

/**
 * Le voci cambiate di un eroe in una patch, come le mostrano la pagina
 * «Cambiamenti» e la scheda Info.
 *
 * Un testo cambiato si legge per intero, con le parole tolte barrate e quelle
 * nuove evidenziate: il confronto e' parola per parola sul testo come si legge
 * (senza i codici di colore del gioco), fatto dalla pipeline. Un numero mostra
 * prima, dopo e la differenza.
 */

const TESTI = testi({
  it: {
    parti: {
      nome: "Nome",
      passive: "Unica",
      skillsA: "Carta A",
      skillsB: "Carta B",
      skillsSpecial: "Mossa finale",
      taboo: "Comandamento",
      grace: "Grazia",
      solidarity: "Unità",
      ability: "Talento",
      stats: "Statistiche al massimo",
      craft: "Reliquia sacra",
      fates: "Legame",
      costume: "Costume",
    } satisfies Record<ChangePart, string>,
    rango: (n: number) => `Rango ${n}`,
    ranghi: (r: string) => `ranghi ${r}`,
    dalRango: (n: number) => `con la Mossa finale dal rango ${n}`,
    nomeCampo: "nome",
    epiteto: "epiteto",
    totale: "totale coi potenziamenti",
    nuovo: "Nuovo",
    tolto: "Tolto",
    legameCon: "Legame con",
    eroeSconosciuto: (id: string) => `eroe ${id}`,
    soloFormattazione: "Solo formattazione, il testo si legge uguale",
    tolteNote: "parole tolte",
    aggiunteNote: "parole aggiunte",
  },
  en: {
    parti: {
      nome: "Name",
      passive: "Unique",
      skillsA: "Card A",
      skillsB: "Card B",
      skillsSpecial: "Ultimate Move",
      taboo: "Commandment",
      grace: "Grace",
      solidarity: "Unity",
      ability: "Talent",
      stats: "Max stats",
      craft: "Holy Relic",
      fates: "Association",
      costume: "Costume",
    },
    rango: (n: number) => `Rank ${n}`,
    ranghi: (r: string) => `ranks ${r}`,
    dalRango: (n: number) => `with the Ultimate Move from rank ${n}`,
    nomeCampo: "name",
    epiteto: "epithet",
    totale: "total with upgrades",
    nuovo: "New",
    tolto: "Removed",
    legameCon: "Association with",
    eroeSconosciuto: (id: string) => `hero ${id}`,
    soloFormattazione: "Formatting only, the text reads the same",
    tolteNote: "removed words",
    aggiunteNote: "added words",
  },
});

type Testi = (typeof TESTI)[Locale];

function textOf(value: HeroChange["before"], locale: Locale): string | null {
  if (value === null || typeof value === "number") return null;
  return inLingua(value as HeroLabel, locale) ?? null;
}

function nameOf(change: HeroChange | undefined, locale: Locale): string | null {
  if (!change) return null;
  return textOf(change.after, locale) ?? textOf(change.before, locale);
}

/** Il titolo di un gruppo: «Carta A», «Legame con Meliodas», «Costume «...»». */
function GroupTitle({
  group,
  game,
  locale,
  heroes,
}: {
  group: ChangeGroup;
  game: string;
  locale: Locale;
  heroes: ReadonlyMap<string, HeroEntry>;
}) {
  const t = TESTI[locale];
  if (group.part === "fates" && group.id !== null) {
    const other = heroes.get(String(group.id));
    return (
      <>
        {t.legameCon}{" "}
        {other ? (
          <Link href={`/${game}/eroi/${other.id}`} className="text-brand-deep hover:underline">
            {[heroName(other, locale), heroEpithet(other, locale)].filter(Boolean).join(" · ")}
          </Link>
        ) : (
          t.eroeSconosciuto(String(group.id))
        )}
      </>
    );
  }
  const named = group.part === "craft" || group.part === "costume" ? nameOf(group.changes.find((c) => c.field === "name"), locale) : null;
  return (
    <>
      {t.parti[group.part]}
      {named ? <span className="font-normal normal-case"> «{named}»</span> : null}
    </>
  );
}

/** Dove sta la voce dentro la parte: il rango, il livello, il campo. */
function where(change: HeroChange, t: Testi, locale: Locale): string | null {
  const bits: string[] = [];
  if (change.part === "skillsA" || change.part === "skillsB" || change.part === "skillsSpecial") {
    if (change.which !== null) bits.push(t.rango(change.which));
  } else if ((change.part === "passive" || change.part === "ability") && change.which) {
    // il livello speciale k vale dal rango k+1 della Mossa finale (la regola della scheda)
    bits.push(t.dalRango(change.which + 1));
  }
  if (change.field === "name" && change.part !== "craft" && change.part !== "costume") bits.push(t.nomeCampo);
  if (change.field === "nickname") bits.push(t.epiteto);
  if (change.part === "stats") bits.push(statName(change.field, locale));
  if (change.field.startsWith("stat:")) bits.push(`${statName(change.field.slice(5), locale)} (${t.totale})`);
  return bits.length > 0 ? bits.join(" · ") : null;
}

function NumberChange({ change, locale }: { change: HeroChange; locale: Locale }) {
  const before = typeof change.before === "number" ? change.before : null;
  const after = typeof change.after === "number" ? change.after : null;
  const key = change.field.startsWith("stat:") ? change.field.slice(5) : change.field;
  const unit = isPercentStat(key) ? "%" : "";
  const show = (n: number | null) => (n === null ? "—" : `${formatStat(n, locale)}${unit}`);
  const delta = before !== null && after !== null ? after - before : null;
  return (
    <span className="font-mono tabular-nums">
      {show(before)} → <strong className="text-ink">{show(after)}</strong>
      {delta ? (
        <span className={cx("ml-1.5", delta > 0 ? "text-up" : "text-down")}>
          ({delta > 0 ? "+" : "−"}
          {formatStat(Math.abs(delta), locale)}
          {unit})
        </span>
      ) : null}
    </span>
  );
}

function TextChange({ change, locale }: { change: HeroChange; locale: Locale }) {
  const t = TESTI[locale];
  if (change.kind === "cambiato" && change.segments) {
    return (
      <span className="whitespace-pre-line">
        {change.segments[locale].map(([op, text], i) =>
          op === "=" ? (
            <span key={i}>{text}</span>
          ) : op === "-" ? (
            <del key={i} title={t.tolteNote} className="text-down decoration-2">
              {text}
            </del>
          ) : (
            <ins key={i} title={t.aggiunteNote} className="bg-up/15 font-semibold text-up no-underline">
              {text}
            </ins>
          ),
        )}
      </span>
    );
  }
  if (change.kind === "aggiunto") {
    return (
      <span className="whitespace-pre-line">
        <span className="font-semibold text-up">{t.nuovo}: </span>
        {textOf(change.after, locale)}
      </span>
    );
  }
  return (
    <span className="whitespace-pre-line">
      <span className="font-semibold text-down">{t.tolto}: </span>
      <del className="decoration-2">{textOf(change.before, locale)}</del>
    </span>
  );
}

export function HeroChangeList({
  changes,
  touchups,
  game,
  locale,
  heroes,
}: {
  changes: readonly HeroChange[];
  touchups: readonly HeroTouchup[];
  game: string;
  locale: Locale;
  heroes: ReadonlyMap<string, HeroEntry>;
}) {
  const t = TESTI[locale];
  // il nome di un costume o di una reliquia sta gia' nel titolo del gruppo
  const shown = (group: ChangeGroup) =>
    group.part === "craft" || group.part === "costume"
      ? group.changes.filter((c) => c.field !== "name" || c.kind === "cambiato")
      : group.changes;

  return (
    <div className="grid gap-3.5">
      {groupChanges(changes).map((group) => (
        <div key={`${group.part}:${group.id ?? ""}`}>
          <h4 className="m-0 mb-1.5 font-display text-[13px] font-extrabold uppercase tracking-[0.02em] text-ink [font-variation-settings:'wdth'_85]">
            <GroupTitle group={group} game={game} locale={locale} heroes={heroes} />
          </h4>
          {/* le voci separate da un filo intero, non da una riga colorata a lato (10/10) */}
          <ul className="m-0 grid list-none border-y border-rule-2 p-0 text-[14px] leading-relaxed text-ink-2">
            {shown(group).map((change, i) => {
              const place = where(change, t, locale);
              const isNumber = typeof change.before === "number" || typeof change.after === "number";
              return (
                <li key={i} className="border-b border-rule-2 py-1.5 last:border-b-0">
                  {place ? <span className={cx(eyebrow, "mr-2 text-[12px]")}>{place}</span> : null}
                  {isNumber ? (
                    <NumberChange change={change} locale={locale} />
                  ) : group.part === "costume" && change.field === "name" && change.kind !== "cambiato" ? (
                    <span className={change.kind === "aggiunto" ? "font-semibold text-up" : "text-down"}>
                      {change.kind === "aggiunto" ? t.nuovo : t.tolto}
                    </span>
                  ) : (
                    <TextChange change={change} locale={locale} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {touchups.length > 0 ? (
        <p className="m-0 text-[13px] text-ink-3">
          {t.soloFormattazione}:{" "}
          {touchupParts(touchups)
            .map(({ part, which }) =>
              which.length > 0 && (part === "skillsA" || part === "skillsB" || part === "skillsSpecial")
                ? `${t.parti[part]}, ${which.length === 1 ? t.rango(which[0]!).toLowerCase() : t.ranghi(compressRanges(which))}`
                : t.parti[part],
            )
            .join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
