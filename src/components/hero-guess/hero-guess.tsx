"use client";

/**
 * «Indovina l'eroe», modalita' classica: la tabella dei tentativi con una
 * casella colorata per indizio (personaggio, attributo, razza, caratteristiche,
 * grado d'uscita e massimo, abilita' speciale, data d'uscita).
 *
 * La partita, i comandi, la ricerca, gli aiuti e la fine stanno in
 * guess-game.tsx, comuni a tutte le modalita'; le regole delle caselle in
 * hero-guess.ts, coi test. Qui ci sono la tabella e le sue caselle.
 */

import Link from "next/link";
import {
  GuessControls,
  guessCount,
  GuessEnd,
  GuessHints,
  GuessSearch,
  GuessYesterday,
  useGuessGame,
} from "@/components/hero-guess/guess-game";
import { cx } from "@/components/ui";
import {
  CLUES,
  compareHeroes,
  HINTS,
  shareGrid,
  type Clue,
  type ClueKey,
  type GuessHero,
  type Verdict,
} from "@/lib/games/hero-guess";
import { gameIconSrc, heroCardSrc, heroName, heroSkillIconSrc } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

/** Un eroe del gioco: la voce del roster (per nome, epiteto e ricerca nelle due lingue) e gli indizi. */
export type GuessEntry = HeroEntry &
  GuessHero & {
    /** il nome della sua Unica nella lingua della pagina, per l'ultimo aiuto */
    readonly unique: string | null;
    /** c'e' l'icona dell'Unica, per il primo aiuto */
    readonly uniqueIcon: boolean;
  };

/** I nomi dei codici nella lingua della pagina. */
export interface GuessLabels {
  readonly attribute: Readonly<Record<string, string>>;
  readonly race: Readonly<Record<string, string>>;
  readonly faction: Readonly<Record<string, string>>;
  readonly special: Readonly<Record<string, string>>;
}

const TESTI = testi({
  it: {
    colonne: {
      eroe: "Eroe",
      personaggio: "Personaggio",
      attributo: "Attributo",
      razza: "Razza",
      caratteristiche: "Caratteristiche",
      uscita: "Esce come",
      massimo: "Grado massimo",
      speciale: "Abilità speciale",
      data: "Uscita",
    } satisfies Record<ClueKey | "eroe", string>,
    nessunaCaratteristica: "Nessuna",
    nessunaSpeciale: "Nessuna",
    verdetti: { giusto: "giusto", vicino: "in parte", sbagliato: "sbagliato" } satisfies Record<Verdict, string>,
    freccia: { su: "più in alto o più tardi", giu: "più in basso o prima" },
    aiuto: { icona: "Icona dell'Unica", nome: "Nome dell'Unica" },
    legenda: "Verde: uguale. Giallo: in parte (una caratteristica in comune, lo stesso anno d'uscita). Rosso: diverso. La freccia dice dove cercare: un grado più alto o più basso, un'uscita dopo o prima.",
  },
  en: {
    colonne: {
      eroe: "Hero",
      personaggio: "Character",
      attributo: "Attribute",
      razza: "Race",
      caratteristiche: "Characteristics",
      uscita: "Obtained as",
      massimo: "Max grade",
      speciale: "Special ability",
      data: "Release",
    } satisfies Record<ClueKey | "eroe", string>,
    nessunaCaratteristica: "None",
    nessunaSpeciale: "None",
    verdetti: { giusto: "right", vicino: "partly", sbagliato: "wrong" } satisfies Record<Verdict, string>,
    freccia: { su: "higher or later", giu: "lower or earlier" },
    aiuto: { icona: "Unique's icon", nome: "Unique's name" },
    legenda: "Green: the same. Yellow: partly (a characteristic in common, the same release year). Red: different. The arrow says where to look: a higher or lower grade, a later or earlier release.",
  },
});

/** I colori delle caselle: scuri abbastanza da tenere il testo bianco leggibile (contrasto 5:1 e oltre). */
const VERDICT_CLASS: Record<Verdict, string> = {
  giusto: "bg-[#237a3f] border-[#2f9a52]",
  vicino: "bg-[#8c650c] border-[#b8891a]",
  sbagliato: "bg-[#7d2230] border-[#a3333f]",
};

export function HeroGuess({
  game,
  heroes,
  labels,
  icons,
}: {
  game: string;
  heroes: readonly GuessEntry[];
  labels: GuessLabels;
  /** quali icone del gioco esistono: senza, attributo, razza e grado restano scritti */
  icons?: Readonly<Record<string, readonly string[]>>;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const g = useGuessGame({ game, variant: "classico", heroes });
  const answer = g.answer;
  const rows = answer ? g.guesses.map((hero) => compareHeroes(hero, answer)) : [];

  return (
    <div>
      <GuessControls g={g} />
      <GuessSearch game={game} g={g} />
      <GuessEnd game={game} g={g} variant="classico" grid={shareGrid(rows)} />
      <GuessHints
        g={g}
        items={HINTS.map(({ key, after }) => ({
          key,
          after,
          label: t.aiuto[key],
          content:
            key === "nome" ? (
              `«${answer?.unique ?? "?"}»`
            ) : answer?.uniqueIcon ? (
              // eslint-disable-next-line @next/next/no-img-element -- icona gia' pronta, come nella scheda eroe
              <img src={heroSkillIconSrc(game, answer.id)} alt="" width={48} height={48} className="mt-1" />
            ) : (
              "?"
            ),
        }))}
      />

      {/* i tentativi, dal piu' recente */}
      {g.guesses.length > 0 && answer ? (
        <section className="mt-6">
          <p className="m-0 mb-2 text-[13px] text-ink-2">{guessCount(locale, g.guesses.length)}</p>
          <div className="overflow-x-auto pb-2">
            <table className="border-separate border-spacing-1.5 text-center">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-[52px] bg-paper align-bottom text-left text-[11px] font-medium text-ink-3 shadow-[6px_0_0_0_var(--color-paper)] sm:static sm:w-[150px] sm:shadow-none">
                    {t.colonne.eroe}
                  </th>
                  {CLUES.map((key) => (
                    // carattere normale e non il maiuscolo monospaziato: «CARATTERISTICHE» non ci stava in 80px
                    <th
                      key={key}
                      className="w-[64px] max-w-[64px] align-bottom text-[10px] leading-tight font-medium text-ink-3 sm:w-[80px] sm:max-w-[80px] sm:text-[11px]"
                    >
                      {t.colonne[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...g.guesses].reverse().map((hero, row) => {
                  const clues = compareHeroes(hero, answer);
                  return (
                    <tr key={hero.id}>
                      {/* la colonna dell'eroe resta ferma sul telefono; l'ombra piena copre i 6px fra le celle */}
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-paper text-left font-normal shadow-[6px_0_0_0_var(--color-paper)] sm:static sm:shadow-none"
                      >
                        <Link href={`/${game}/eroi/${hero.id}`} className="flex w-[52px] items-center gap-2 hover:text-brand sm:w-[150px]">
                          {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte, come nella griglia Eroi */}
                          <img
                            src={heroCardSrc(game, hero.id)}
                            srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
                            alt=""
                            width={52}
                            height={52}
                            className="h-[48px] w-[48px] shrink-0 rounded-[3px] sm:h-[52px] sm:w-[52px]"
                          />
                          {/* sul telefono solo la card: il nome resta per chi legge con lo screen reader */}
                          <span className="sr-only min-w-0 text-[12px] leading-tight font-semibold sm:not-sr-only">
                            {heroName(hero, locale)}
                          </span>
                        </Link>
                      </th>
                      {CLUES.map((key, i) => (
                        <td key={key} className="p-0">
                          <Tile
                            clue={clues[key]}
                            label={`${t.colonne[key]}: ${t.verdetti[clues[key].verdict]}${
                              clues[key].direction ? `, ${t.freccia[clues[key].direction!]}` : ""
                            }`}
                            // si gira solo l'ultimo tentativo, una casella dopo l'altra
                            delay={row === 0 ? i * 110 : null}
                          >
                            <ClueValue clueKey={key} hero={hero} game={game} labels={labels} icons={icons} locale={locale} t={t} />
                          </Tile>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-[80ch] text-[12px] text-ink-3">{t.legenda}</p>
        </section>
      ) : null}

      <GuessYesterday game={game} g={g} />
    </div>
  );
}

/* ------------------------------------------------------------- caselle -- */

function Tile({
  clue,
  label,
  delay,
  children,
}: {
  clue: Clue;
  label: string;
  delay: number | null;
  children: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className={cx(
        "relative flex h-[64px] w-[64px] flex-col items-center justify-center gap-0.5 rounded-[4px] border px-0.5 text-[10px] leading-tight text-white sm:h-[80px] sm:w-[80px] sm:gap-1 sm:px-1 sm:text-[11px]",
        VERDICT_CLASS[clue.verdict],
        delay !== null && "motion-safe:animate-[indovina-gira_0.45s_ease-out_both]",
      )}
      style={delay !== null ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
      {clue.direction ? (
        <span aria-hidden className="text-[15px] leading-none">
          {clue.direction === "su" ? "▲" : "▼"}
        </span>
      ) : null}
    </div>
  );
}

function ClueValue({
  clueKey,
  hero,
  game,
  labels,
  icons,
  locale,
  t,
}: {
  clueKey: ClueKey;
  hero: GuessEntry;
  game: string;
  labels: GuessLabels;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  locale: Locale;
  t: (typeof TESTI)[Locale];
}) {
  const icon = (family: "attributo" | "razza" | "rarita", key: string | number | null) =>
    key !== null && icons?.[family]?.includes(String(key)) ? (
      // eslint-disable-next-line @next/next/no-img-element -- icone del gioco gia' pronte
      <img key={key} src={gameIconSrc(game, family, key)} alt="" width={26} height={26} className="h-[22px] w-[22px] object-contain sm:h-[26px] sm:w-[26px]" />
    ) : null;

  switch (clueKey) {
    case "personaggio":
      return <span className="font-semibold">{hero.group}</span>;
    case "attributo": {
      const codes = hero.attribute === 6 ? [4, 5] : hero.attribute !== null ? [hero.attribute] : [];
      return (
        <>
          <span className="flex gap-0.5">{codes.map((code) => icon("attributo", code))}</span>
          <span>{hero.attribute !== null ? labels.attribute[String(hero.attribute)] : "?"}</span>
        </>
      );
    }
    case "razza":
      return (
        <>
          {icon("razza", hero.race)}
          <span>{hero.race !== null ? labels.race[String(hero.race)] : "?"}</span>
        </>
      );
    case "caratteristiche":
      return hero.factions.length === 0 ? (
        <span>{t.nessunaCaratteristica}</span>
      ) : (
        <span className="line-clamp-4 text-[10px]">
          {hero.factions.map((code) => labels.faction[String(code)] ?? code).join(" · ")}
        </span>
      );
    case "uscita":
      return icon("rarita", hero.obtainedAs) ?? <span className="font-semibold">{hero.obtainedAs}</span>;
    case "massimo":
      return icon("rarita", hero.max) ?? <span className="font-semibold">{hero.max}</span>;
    case "speciale":
      return <span>{hero.special ? (labels.special[hero.special] ?? hero.special) : t.nessunaSpeciale}</span>;
    case "data":
      return (
        <span className="font-semibold">
          {hero.date
            ? new Intl.DateTimeFormat(intlLocale(locale), { month: "short", year: "numeric", timeZone: "UTC" }).format(
                new Date(`${hero.date}T00:00:00Z`),
              )
            : "?"}
        </span>
      );
  }
}
