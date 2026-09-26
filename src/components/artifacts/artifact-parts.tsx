/**
 * Pezzi comuni delle pagine degli artefatti: il grado di una carta, la carta in
 * piccolo, le statistiche, le etichette dei filtri di un set.
 *
 * Niente import del server: le griglie (componenti client) usano gli stessi
 * pezzi delle pagine, cosi' una carta ha la stessa faccia ovunque.
 */

import Link from "next/link";
import { cx, numeric } from "@/components/ui";
import type { ArtifactCard, ArtifactIndex, ArtifactSet } from "@/lib/games/artifact-types";
import { artifactImageSrc, cardCode, cardImageSrc } from "@/lib/games/artifacts";
import { formatNumber } from "@/lib/games/endgame";
import { gameIconSrc } from "@/lib/games/heroes";
import type { HeroLabel } from "@/lib/games/types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    attacco: "Attacco",
    difesa: "Difesa",
    ps: "PS",
  },
  en: {
    attacco: "Attack",
    difesa: "Defense",
    ps: "HP",
  },
});

/**
 * Il colore di ogni grado, preso dalle cornici delle carte del gioco
 * (Artifact_Frame_C ... _UR): bruno, bronzo, argento, oro, viola, rosa. Serve
 * alla sigla del grado e al riquadro di una carta senza immagine; le carte vere
 * hanno la cornice del gioco dentro l'immagine.
 */
export const GRADE_COLORS: Readonly<Record<number, string>> = {
  1: "#a08c6a",
  2: "#c0875a",
  3: "#a9b4bf",
  4: "#e0ac2a",
  5: "#a07af0",
  6: "#ec62a6",
};

/** La sigla del grado nel colore della sua cornice. */
export function GradeBadge({ grade, index, className }: { grade: number; index: ArtifactIndex; className?: string }) {
  const color = GRADE_COLORS[grade];
  const code = index.grades[String(grade)]?.code ?? String(grade);
  return (
    <span
      className={cx(numeric, "inline-block rounded-[3px] border px-1 text-[10px] font-bold leading-[15px]", className)}
      style={color ? { color, borderColor: color } : undefined}
    >
      {code}
    </span>
  );
}

/**
 * Una carta come nel gioco: l'illustrazione dentro la cornice del suo grado, gia'
 * composta dalla pipeline, verticale. `frame` sono le misure dell'immagine
 * (ArtifactIndex.images): da li' viene la proporzione, cosi' il riquadro ha la
 * sua altezza prima che l'immagine arrivi. Senza immagine un riquadro vuoto
 * della stessa forma, col bordo del colore del grado.
 */
export function CardImage({
  game,
  card,
  frame,
  size,
  small,
  eager,
  className,
}: {
  game: string;
  card: Pick<ArtifactCard, "id" | "grade" | "image">;
  frame: { readonly width: number; readonly height: number };
  /** la larghezza massima: sul telefono la carta si stringe invece di uscire dallo schermo */
  size: number;
  /** la carta delle liste (cornice piccola); senza, la carta grande della pagina */
  small?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const style = { width: "100%", maxWidth: size, height: "auto", aspectRatio: `${frame.width} / ${frame.height}` };
  if (!card.image) {
    return (
      <span
        aria-hidden
        className={cx("block rounded-[6px] border-2 bg-paper-2", className)}
        style={{ ...style, borderColor: GRADE_COLORS[card.grade] }}
      />
    );
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={cardImageSrc(game, card.id, small)}
      alt=""
      width={frame.width}
      height={frame.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cx("block", className)}
      style={style}
    />
  );
}

/**
 * Una carta in piccolo, che porta alla sua pagina: immagine, sigla e nome. Il
 * grado non si ripete sotto: lo dice gia' la cornice.
 * `current` la segna come quella della pagina, senza collegamento.
 */
export function CardTile({
  game,
  card,
  index,
  locale,
  size = 112,
  current,
}: {
  game: string;
  card: ArtifactCard;
  index: ArtifactIndex;
  locale: Locale;
  size?: number;
  current?: boolean;
}) {
  const name = inLingua(card.name, locale) ?? card.id;
  const body = (
    <>
      <CardImage game={game} card={card} frame={index.images.small} size={size} small />
      <span className={cx(numeric, "mt-1.5 block text-[11px] text-ink-3")}>{cardCode(index, card, locale)}</span>
      <span className={cx("mt-0.5 block text-[12px] font-semibold leading-tight", !current && "group-hover:text-brand")}>
        {name}
      </span>
    </>
  );
  return current ? (
    <div aria-current="page" className="block rounded-[6px] outline outline-2 outline-offset-2 outline-brand" style={{ width: size }}>
      {body}
    </div>
  ) : (
    <Link
      href={`/${game}/carte-artefatto/${card.id}`}
      className="group block rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      style={{ width: size }}
    >
      {body}
    </Link>
  );
}

/** Attacco, Difesa e PS di una carta o di un set, in una riga. */
export function StatRow({
  stats,
  locale,
  className,
}: {
  stats: { atk: number; def: number; hp: number };
  locale: Locale;
  className?: string;
}) {
  const t = TESTI[locale];
  const rows: [string, number][] = [
    [t.attacco, stats.atk],
    [t.difesa, stats.def],
    [t.ps, stats.hp],
  ];
  return (
    <dl className={cx("m-0 flex flex-wrap gap-x-5 gap-y-1 text-[13px]", className)}>
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <dt className="text-ink-3">{label}</dt>
          <dd className={cx(numeric, "m-0", value === 0 ? "text-ink-3" : "text-ink")}>
            {value === 0 ? "—" : formatNumber(value, locale)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** I nomi dei codici degli eroi che servono ai filtri dei set: razze e caratteristiche. */
export interface HeroCodes {
  readonly race: Readonly<Record<string, HeroLabel>>;
  readonly faction: Readonly<Record<string, HeroLabel>>;
}

/**
 * I filtri del gioco a cui un set risponde: contenuto (con l'icona delle
 * condizioni delle passive), razza (con l'icona del gioco), caratteristica,
 * varie. Sono le etichette con cui il gioco lo trova nel suo menu, e dicono in
 * breve dove e per chi vale.
 */
export function SetTags({
  game,
  set,
  index,
  codes,
  locale,
  raceIcons,
}: {
  game: string;
  set: ArtifactSet;
  index: ArtifactIndex;
  codes: HeroCodes;
  locale: Locale;
  /** le razze che hanno l'icona estratta */
  raceIcons: readonly string[];
}) {
  const tags: { key: string; label: string; icon: string | null }[] = [
    ...set.filters.contents.map((code) => {
      const entry = index.filters.contents[String(code)];
      return {
        key: `c${code}`,
        label: inLingua(entry?.name, locale) ?? String(code),
        icon: entry?.icon ? artifactImageSrc(game, `filtri/${entry.icon}.png`) : null,
      };
    }),
    ...set.filters.races.map((code) => ({
      key: `r${code}`,
      label: inLingua(codes.race[String(code)], locale) ?? String(code),
      icon: raceIcons.includes(String(code)) ? gameIconSrc(game, "razza", code) : null,
    })),
    ...set.filters.factions.map((code) => ({
      key: `f${code}`,
      label: inLingua(codes.faction[String(code)], locale) ?? String(code),
      icon: null,
    })),
    ...set.filters.misc.map((code) => ({
      key: `m${code}`,
      label: inLingua(index.filters.misc[String(code)]?.name, locale) ?? String(code),
      icon: null,
    })),
  ];
  if (tags.length === 0) return null;
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {tags.map((tag) => (
        <li
          key={tag.key}
          className="inline-flex items-center gap-1 rounded-card border border-rule bg-paper px-1.5 py-0.5 text-[12px] text-ink-2"
        >
          {tag.icon ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={tag.icon} alt="" width={16} height={16} className="block shrink-0" style={{ width: 16, height: "auto" }} />
          ) : null}
          {tag.label}
        </li>
      ))}
    </ul>
  );
}
