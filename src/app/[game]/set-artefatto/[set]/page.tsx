import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardImage, CardTile, Pager, SetTags, StatRow, StatTiles } from "@/components/artifacts/artifact-parts";
import { CardSources } from "@/components/artifacts/card-sources";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
import { Card, chipClass, cx, display, eyebrow, numeric, PageHeader } from "@/components/ui";
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
 *
 * Le carte sono il contenuto del set, e dal 10/10 stanno in grande accanto
 * all'effetto, con le loro statistiche e il totale: prima erano miniature sotto,
 * dopo il testo.
 */

const TESTI = testi({
  it: {
    titoloPagina: (set: string, gioco: string) => `${set} · Set artefatto di ${gioco}`,
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
    titoloPagina: (set: string, gioco: string) => `${set} · ${gioco} Artifact Set`,
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
 * stessa ragione dei ranghi della scheda eroe). Il livello scelto e' bianco come
 * le scelte «quiet» del sito (chipClass): un livello c'e' sempre, non restringe
 * niente.
 */
const LEVEL_CLASSES = [
  {
    hook: "lv1",
    chip: "group-has-[.lv1:checked]:bg-ink group-has-[.lv1:checked]:font-bold group-has-[.lv1:checked]:text-paper",
    show: "group-has-[.lv1:checked]:block",
  },
  {
    hook: "lv2",
    chip: "group-has-[.lv2:checked]:bg-ink group-has-[.lv2:checked]:font-bold group-has-[.lv2:checked]:text-paper",
    show: "group-has-[.lv2:checked]:block",
  },
  {
    hook: "lv3",
    chip: "group-has-[.lv3:checked]:bg-ink group-has-[.lv3:checked]:font-bold group-has-[.lv3:checked]:text-paper",
    show: "group-has-[.lv3:checked]:block",
  },
  {
    hook: "lv4",
    chip: "group-has-[.lv4:checked]:bg-ink group-has-[.lv4:checked]:font-bold group-has-[.lv4:checked]:text-paper",
    show: "group-has-[.lv4:checked]:block",
  },
  {
    hook: "lv5",
    chip: "group-has-[.lv5:checked]:bg-ink group-has-[.lv5:checked]:font-bold group-has-[.lv5:checked]:text-paper",
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
  const th = cx(eyebrow, "px-3 py-2 text-right font-medium");

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.sezione, href: `/${game}/set-artefatto` },
          { label: name },
        ]}
      />

      {/* il numero del set accanto all'evento e alle etichette, non sopra il titolo (10/10) */}
      <PageHeader title={name}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p>
            <span className={cx(numeric, "text-ink")}>{setCode(set)}</span>
            {event && event !== name ? (
              <>
                {" · "}
                {t.evento}: {event}
              </>
            ) : null}
          </p>
          <SetTags game={game} set={set} index={data} codes={codes} locale={locale} raceIcons={gameModule.icons?.razza ?? []} />
        </div>
      </PageHeader>

      {/*
        Sul telefono prima l'effetto (cosa fa il set, poche righe), poi le carte;
        sul computer le carte grandi a sinistra e l'effetto accanto.
      */}
      <div className="mt-10 mb-14 grid items-start gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <section id="effetto" className="min-w-0 scroll-mt-20 lg:col-start-2 lg:row-start-1">
          <h2 className={cx(display, "text-[26px]")}>{t.effetto}</h2>
          {set.levels.length === 1 ? (
            <Card className="mt-3">
              <GameText text={say(set.levels[0])} className="text-[15px] leading-relaxed" />
              <p className="m-0 mt-2 text-[12px] text-ink-3">{t.unLivello}</p>
            </Card>
          ) : (
            <Card className="group mt-3">
              <div
                className="flex flex-wrap gap-1.5 has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-brand"
                role="radiogroup"
                aria-label={t.effetto}
              >
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
                  <label key={`label-${level}`} htmlFor={`livello-${level + 1}`} className={chipClass(false, true, cx(numeric, LEVEL_CLASSES[level]?.chip))}>
                    {t.livello(level + 1)}
                  </label>
                ))}
              </div>
              {set.levels.map((text, level) => (
                <div key={level} className={cx("mt-4 hidden", LEVEL_CLASSES[level]?.show)}>
                  <p className={cx(eyebrow, "m-0 mb-1.5")}>
                    {t.livelloTitolo(level + 1)}
                    {level === set.levels.length - 1 ? ` · ${t.massimo}` : null}
                  </p>
                  <GameText text={say(text)} className="text-[15px] leading-relaxed" />
                </div>
              ))}
            </Card>
          )}
        </section>

        <section id="carte" className="min-w-0 scroll-mt-20 lg:col-start-1 lg:row-start-1">
          <h2 className={cx(display, "text-[26px]")}>{t.carte}</h2>
          <p className="m-0 mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-2">{t.carteIntro(cards.length)}</p>
          {/* tre colonne anche col set da cinque: le carte restano grandi, su due file */}
          <ul className="m-0 mt-5 grid list-none grid-cols-3 gap-x-4 gap-y-6 p-0 sm:gap-x-6">
            {cards.map((card) => (
              <li key={card.id} className="min-w-0">
                <CardTile game={game} card={card} index={data} locale={locale} size={200} fluid />
                <StatRow stats={card.stats} locale={locale} className="mt-1.5 flex-col gap-y-0 text-[12px]" />
              </li>
            ))}
          </ul>
          <div className="mt-6 max-w-[520px]">
            <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.totale}</p>
            <StatTiles stats={setStats(cards)} locale={locale} />
          </div>
        </section>
      </div>

      {steps.length > 0 ? (
        <section id="potenziamento" className="mb-14 scroll-mt-20">
          <h2 className={cx(display, "text-[26px]")}>{t.potenziamento}</h2>
          <p className="m-0 mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-2">{t.potenziamentoIntro(set.enhanceClass)}</p>
          <div className="mt-4 max-w-[560px] overflow-x-auto border border-rule bg-paper">
            <table className="w-full min-w-[380px] border-collapse text-[13px]">
              <thead className="bg-paper-2">
                <tr className="border-b border-rule text-left">
                  <th className={cx(eyebrow, "px-3 py-2 font-medium")}>{t.livelloCol}</th>
                  <th className={th}>{t.punti}</th>
                  {PLATE_COLUMNS.map((grade) => {
                    const plate = data.grades[String(grade)];
                    return (
                      <th key={grade} className={th}>
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
                  <tr key={step.level} className="border-b border-rule-2 last:border-b-0">
                    <td className={cx(numeric, "px-3 py-1.5")}>{t.livello(step.level)}</td>
                    <td className={cx(numeric, "px-3 py-1.5 text-right text-ink")}>{formatNumber(step.points, locale)}</td>
                    {PLATE_COLUMNS.map((grade) => (
                      <td key={grade} className={cx(numeric, "px-3 py-1.5 text-right text-ink-2")}>
                        {formatNumber(platesFor(step.points, data.grades[String(grade)]?.plate.points ?? 0), locale)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="m-0 mt-2 max-w-[72ch] text-[12px] text-ink-3">{t.potenziamentoNota}</p>
        </section>
      ) : null}

      <section id="dove" className="mb-14 scroll-mt-20">
        <h2 className={cx(display, "text-[26px]")}>{t.dove}</h2>
        <ul className="m-0 mt-4 grid list-none gap-3 p-0 lg:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id} className="min-w-0">
              <div className="p5-corner grid h-full grid-cols-[48px_minmax(0,1fr)] gap-x-3.5 border border-rule bg-paper-2 p-3.5">
                <CardImage game={game} card={card} frame={data.images.small} size={48} small />
                <div className="min-w-0">
                  <Link
                    href={`/${game}/carte-artefatto/${card.id}`}
                    className="mb-2 block text-[14px] font-semibold underline-offset-2 hover:text-brand-deep hover:underline"
                  >
                    <span className={cx(numeric, "mr-1.5 text-[12px] font-normal text-ink-3")}>{cardCode(data, card, locale)}</span>
                    {say(card.name)}
                  </Link>
                  <CardSources game={game} card={card} data={data} gameModule={gameModule} locale={locale} compact />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Pager
        label={t.altri}
        previous={
          previous
            ? { href: `/${game}/set-artefatto/${previous.number}`, label: t.precedente, name: plainHeroText(say(previous.name)) }
            : undefined
        }
        next={next ? { href: `/${game}/set-artefatto/${next.number}`, label: t.successivo, name: plainHeroText(say(next.name)) } : undefined}
        all={{ href: `/${game}/set-artefatto`, label: t.tutti }}
      />

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}
