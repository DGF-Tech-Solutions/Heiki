import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardTile, SetTags, StatRow } from "@/components/artifacts/artifact-parts";
import { CardSources } from "@/components/artifacts/card-sources";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
import { cx, display, eyebrow, numeric } from "@/components/ui";
import type { ArtifactCard } from "@/lib/games/artifact-types";
import { artifactImageSrc, cardCode, enhancementSteps, platesFor, setCode, setStats } from "@/lib/games/artifacts";
import { findGame } from "@/lib/games/catalog";
import { formatNumber } from "@/lib/games/endgame";
import { plainHeroText } from "@/lib/games/hero-markup";
import { getGameModule, requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Un Set artefatto: le sue carte, l'effetto livello per livello, il
 * potenziamento e dove si trovano le carte.
 *
 * I livelli si scelgono coi pulsanti come i ranghi della scheda eroe, senza
 * JavaScript (radio nascosti e :has()), partendo dal livello massimo: sono al
 * piu' cinque testi brevi, e renderli tutti costa meno di un giro sul server.
 */

const TESTI = testi({
  it: {
    titoloPagina: (set: string, gioco: string) => `${set} · Set artefatto di ${gioco} · GachaZone`,
    descrizione: (set: string, effetto: string) => `Set artefatto «${set}»: ${effetto}`,
    sezione: "Set artefatto",
    evento: "Nato dall'evento",
    effetto: "Effetto",
    unLivello: "Il set ha un livello solo: non si potenzia.",
    livello: (n: number) => `Liv. ${n}`,
    livelloTitolo: (n: number) => `Livello ${n}`,
    massimo: "massimo",
    carte: "Carte del set",
    carteIntro: (n: number) =>
      `Le ${n} carte da equipaggiare insieme sulla squadra. Da sole danno le loro statistiche; tutte insieme aggiungono l'effetto.`,
    totale: "Con tutte le carte",
    potenziamento: "Potenziamento",
    potenziamentoIntro: (classe: number) =>
      `Classe ${classe}. Punti totali per arrivare a ogni livello, e quante Carte placcate servono se sono tutte dello stesso grado (UR, SSR o SR).`,
    potenziamentoNota:
      "Dedotto: i punti sono totali, non per passo. Lo confermano le 306 squadre del computer che usano un set.",
    livelloCol: "Livello",
    punti: "Punti",
    dove: "Dove si trovano le carte",
    altri: "Altri set",
    precedente: "Set precedente",
    successivo: "Set successivo",
    tutti: "Tutti i set",
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (set: string, gioco: string) => `${set} · ${gioco} Artifact Set · GachaZone`,
    descrizione: (set: string, effetto: string) => `Artifact Set «${set}»: ${effetto}`,
    sezione: "Artifact Sets",
    evento: "From the event",
    effetto: "Effect",
    unLivello: "The set has a single level: it cannot be enhanced.",
    livello: (n: number) => `Lv. ${n}`,
    livelloTitolo: (n: number) => `Level ${n}`,
    massimo: "maximum",
    carte: "Cards in the set",
    carteIntro: (n: number) =>
      `The ${n} cards to equip together on the team. On their own they give their stats; all together they add the effect.`,
    totale: "With all the cards",
    potenziamento: "Enhancement",
    potenziamentoIntro: (classe: number) =>
      `Class ${classe}. Total points to reach each level, and how many Plate Cards it takes if they are all of the same grade (UR, SSR or SR).`,
    potenziamentoNota: "Deduced: the points are totals, not per step. The 306 computer teams that use a set confirm it.",
    livelloCol: "Level",
    punti: "Points",
    dove: "Where the cards come from",
    altri: "Other sets",
    precedente: "Previous set",
    successivo: "Next set",
    tutti: "All sets",
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

/**
 * Le classi dei cinque livelli, scritte per esteso: Tailwind legge il sorgente,
 * e una classe costruita con un template (`lv${n}`) non finirebbe nel CSS (la
 * stessa ragione dei ranghi della scheda eroe).
 */
const LEVEL_CLASSES = [
  {
    hook: "lv1",
    chip: "group-has-[.lv1:checked]:border-brand group-has-[.lv1:checked]:bg-brand-soft group-has-[.lv1:checked]:text-ink",
    show: "group-has-[.lv1:checked]:block",
  },
  {
    hook: "lv2",
    chip: "group-has-[.lv2:checked]:border-brand group-has-[.lv2:checked]:bg-brand-soft group-has-[.lv2:checked]:text-ink",
    show: "group-has-[.lv2:checked]:block",
  },
  {
    hook: "lv3",
    chip: "group-has-[.lv3:checked]:border-brand group-has-[.lv3:checked]:bg-brand-soft group-has-[.lv3:checked]:text-ink",
    show: "group-has-[.lv3:checked]:block",
  },
  {
    hook: "lv4",
    chip: "group-has-[.lv4:checked]:border-brand group-has-[.lv4:checked]:bg-brand-soft group-has-[.lv4:checked]:text-ink",
    show: "group-has-[.lv4:checked]:block",
  },
  {
    hook: "lv5",
    chip: "group-has-[.lv5:checked]:border-brand group-has-[.lv5:checked]:bg-brand-soft group-has-[.lv5:checked]:text-ink",
    show: "group-has-[.lv5:checked]:block",
  },
] as const;

/** Le Carte placcate nelle colonne del potenziamento: i tre gradi che si usano davvero. */
const PLATE_COLUMNS = [6, 5, 4] as const;

interface Props {
  params: Promise<{ game: string; set: string }>;
}

function findSet(game: string, number: string) {
  const data = getGameModule(game)?.artifacts;
  return data?.sets.find((set) => String(set.number) === number) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, set: number } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];
  const set = findSet(game, number);
  const entry = findGame(game);
  if (!set) return { title: t.sezione };
  const name = plainHeroText(inLingua(set.name, locale) ?? "");
  return {
    title: t.titoloPagina(name, entry?.shortName ?? game),
    description: t.descrizione(name, plainHeroText(inLingua(set.levels.at(-1), locale) ?? "")),
  };
}

export default async function ArtifactSetPage({ params }: Props) {
  const { game, set: number } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.artifacts;
  const set = findSet(game, number);
  if (!data || !set) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const say = (value: Parameters<typeof inLingua>[0]) => inLingua(value, locale) ?? "";
  const byId = new Map(data.cards.map((card) => [card.id, card]));
  const cards = set.cards.map((id) => byId.get(id)).filter((card): card is ArtifactCard => card !== undefined);
  const steps = enhancementSteps(data, set);
  const position = data.sets.indexOf(set);
  const previous = data.sets[position - 1];
  const next = data.sets[position + 1];
  const codes = {
    race: gameModule.heroContext?.codes.race ?? {},
    faction: gameModule.heroContext?.codes.faction ?? {},
  };
  const name = plainHeroText(say(set.name));
  const event = set.event ? plainHeroText(say(set.event)) : null;

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.sezione, href: `/${game}/set-artefatto` },
          { label: name },
        ]}
      />

      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>
          {t.sezione} · <span className={numeric}>{setCode(set)}</span>
        </p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{name}</h1>
        {event && event !== name ? (
          <p className="m-0 mt-1 text-[14px] text-ink-2">
            {t.evento}: {event}
          </p>
        ) : null}
        <div className="mt-3">
          <SetTags game={game} set={set} index={data} codes={codes} locale={locale} raceIcons={gameModule.icons?.razza ?? []} />
        </div>
      </header>

      <section id="effetto" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.effetto}</h2>
        {set.levels.length === 1 ? (
          <div className="mt-3 max-w-[72ch] rounded-card border border-rule bg-paper-2 p-4">
            <GameText text={say(set.levels[0])} className="text-[14px] leading-relaxed" />
            <p className="m-0 mt-2 text-[12px] text-ink-3">{t.unLivello}</p>
          </div>
        ) : (
          <div className="group mt-3 max-w-[72ch] rounded-card border border-rule bg-paper-2 p-4">
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t.effetto}>
              {set.levels.map((_, level) => (
                <input
                  key={`radio-${level}`}
                  type="radio"
                  name="livello"
                  id={`livello-${level + 1}`}
                  defaultChecked={level === set.levels.length - 1}
                  className={cx("sr-only", LEVEL_CLASSES[level]?.hook)}
                />
              ))}
              {set.levels.map((_, level) => (
                <label
                  key={`label-${level}`}
                  htmlFor={`livello-${level + 1}`}
                  className={cx(
                    numeric,
                    "cursor-pointer rounded-card border border-rule bg-paper px-2.5 py-1 text-[12px] text-ink-2 transition hover:text-ink",
                    LEVEL_CLASSES[level]?.chip,
                  )}
                >
                  {t.livello(level + 1)}
                </label>
              ))}
            </div>
            {set.levels.map((text, level) => (
              <div key={level} className={cx("mt-3 hidden", LEVEL_CLASSES[level]?.show)}>
                <p className="m-0 mb-1 text-[12px] text-ink-3">
                  {t.livelloTitolo(level + 1)}
                  {level === set.levels.length - 1 ? ` · ${t.massimo}` : null}
                </p>
                <GameText text={say(text)} className="text-[14px] leading-relaxed" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="carte" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.carte}</h2>
        <p className="mt-2 max-w-[72ch] text-sm text-ink-2">{t.carteIntro(cards.length)}</p>
        <ul className="m-0 mt-4 flex list-none flex-wrap gap-4 p-0">
          {cards.map((card) => (
            <li key={card.id}>
              <CardTile game={game} card={card} index={data} locale={locale} size={132} />
              <StatRow stats={card.stats} locale={locale} className="mt-1 max-w-[132px] flex-col gap-y-0 text-[12px]" />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[13px] font-semibold">{t.totale}</span>
          <StatRow stats={setStats(cards)} locale={locale} />
        </div>
      </section>

      {steps.length > 0 ? (
        <section id="potenziamento" className="mb-10 scroll-mt-20">
          <h2 className={cx(display, "text-2xl")}>{t.potenziamento}</h2>
          <p className="mt-2 max-w-[72ch] text-sm text-ink-2">{t.potenziamentoIntro(set.enhanceClass)}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full max-w-[560px] min-w-[380px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-rule text-left">
                  <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.livelloCol}</th>
                  <th className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>{t.punti}</th>
                  {PLATE_COLUMNS.map((grade) => {
                    const plate = data.grades[String(grade)];
                    return (
                      <th key={grade} className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>
                        <span className="inline-flex items-center justify-end gap-1">
                          {plate?.plate.icon ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={artifactImageSrc(game, `placcate/${grade}.png`)}
                              alt=""
                              width={20}
                              height={20}
                              className="block"
                            />
                          ) : null}
                          {plate?.code ?? String(grade)}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => (
                  <tr key={step.level} className="border-b border-rule-2">
                    <td className={cx(numeric, "py-1 pr-3")}>{t.livello(step.level)}</td>
                    <td className={cx(numeric, "py-1 pr-3 text-right")}>{formatNumber(step.points, locale)}</td>
                    {PLATE_COLUMNS.map((grade) => (
                      <td key={grade} className={cx(numeric, "py-1 pr-3 text-right text-ink-2")}>
                        {formatNumber(platesFor(step.points, data.grades[String(grade)]?.plate.points ?? 0), locale)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 max-w-[72ch] text-[12px] text-ink-3">{t.potenziamentoNota}</p>
        </section>
      ) : null}

      <section id="dove" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.dove}</h2>
        <ul className="m-0 mt-3 grid list-none gap-3 p-0 lg:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id} className="min-w-0 rounded-card border border-rule bg-paper-2 p-3.5">
              <Link
                href={`/${game}/carte-artefatto/${card.id}`}
                className="mb-2 block text-[14px] font-semibold underline-offset-2 hover:text-brand hover:underline"
              >
                <span className={cx(numeric, "mr-1.5 text-[12px] font-normal text-ink-3")}>{cardCode(data, card, locale)}</span>
                {say(card.name)}
              </Link>
              <CardSources game={game} card={card} data={data} gameModule={gameModule} locale={locale} compact />
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label={t.altri} className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5 text-[14px]">
        {previous ? (
          <Link href={`/${game}/set-artefatto/${previous.number}`} className="text-brand underline-offset-2 hover:underline">
            ← {t.precedente}: {plainHeroText(say(previous.name))}
          </Link>
        ) : (
          <span />
        )}
        <Link href={`/${game}/set-artefatto`} className="text-ink-2 underline-offset-2 hover:text-brand hover:underline">
          {t.tutti}
        </Link>
        {next ? (
          <Link href={`/${game}/set-artefatto/${next.number}`} className="text-brand underline-offset-2 hover:underline">
            {t.successivo}: {plainHeroText(say(next.name))} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}
