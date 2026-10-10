import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/artifacts/artifact-parts";
import { SetBrowser, type SetFilterNames } from "@/components/artifacts/set-browser";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
import { Card, cx, display, eyebrow, numeric, PageHeader } from "@/components/ui";
import type { ArtifactSet } from "@/lib/games/artifact-types";
import { artifactImageSrc, type ArtifactSetSummary } from "@/lib/games/artifacts";
import { findGame } from "@/lib/games/catalog";
import { formatNumber } from "@/lib/games/endgame";
import { gameIconSrc } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Set artefatto: l'indice.
 *
 * Una griglia dei 78 set coi filtri del gioco, e ogni set porta alla sua pagina
 * (scelta dell'utente, 26/09: due voci, Set e Carte, una pagina per ogni set e
 * ogni carta, come gli eroi). Sotto, come funzionano: il tutorial del gioco, le
 * Carte placcate e i punti di potenziamento. La fonte sta in fondo, coi
 * diritti: in testa veniva prima della griglia, che e' quello che si cerca (10/10).
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Set artefatto di ${gioco}`,
    descrizione: (gioco: string) =>
      `I Set artefatto di ${gioco}: le carte di ogni set, l'effetto livello per livello, dove vale e quanto costa potenziarlo.`,
    titolo: "Set artefatto",
    filtri: { contents: "Contenuto", races: "Razza", factions: "Caratteristica", misc: "Varie" },
    introduzione: (set: number, carte: number) =>
      `${set} set. Un set è un gruppo di tre o cinque Carte artefatto precise: con tutte le sue carte equipaggiate su una squadra aggiunge un effetto, che nel gioco si chiama «Set Bonus Artefatto» e sale di livello con le Carte placcate. In tutto le carte dei set sono ${carte}.`,
    fonte: "Fonte: le tabelle e i testi del client del gioco. I filtri sono quelli del menu del gioco.",
    carte: "Tutte le carte, anche quelle fuori dai set, stanno in",
    carteVoce: "Carte artefatto",
    comeFunziona: "Come funziona",
    sblocco: "Sblocco",
    placcate: "Carte placcate",
    placcateIntro:
      "Una carta che si possiede già diventa una Carta placcata del suo grado: è il materiale per potenziare i set. Ogni Carta placcata vale dei punti.",
    grado: "Grado",
    punti: "Punti",
    potenziamento: "Punti per livello",
    potenziamentoIntro: (carte: number) =>
      `Quanti punti servono in tutto per portare un set a ogni livello. Ogni set ha una classe, che moltiplica i punti; in un potenziamento si usano fino a ${carte} carte.`,
    potenziamentoNota:
      "Dedotto: il client ha una riga per livello, e la leggiamo come totale. Lo confermano tutte le 306 squadre del computer che usano un set: hanno esattamente il totale del livello massimo del loro set.",
    classe: "Classe",
    set: (n: number) => (n === 1 ? "1 set" : `${n} set`),
    livello: (n: number) => `Liv. ${n}`,
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Artifact Sets`,
    descrizione: (gioco: string) =>
      `${gioco} Artifact Sets: the cards of each set, the effect level by level, where it works and what it costs to enhance.`,
    titolo: "Artifact Sets",
    filtri: { contents: "Content", races: "Race", factions: "Characteristic", misc: "Misc" },
    introduzione: (set: number, carte: number) =>
      `${set} sets. A set is a group of three or five specific Artifact Cards: with all its cards equipped on a team it adds an effect, which the game calls «Artifact Set Bonus» and which levels up with Plate Cards. The sets hold ${carte} cards in all.`,
    fonte: "Source: the game client's tables and texts. The filters are the ones in the game's menu.",
    carte: "Every card, including the ones outside sets, is in",
    carteVoce: "Artifact Cards",
    comeFunziona: "How it works",
    sblocco: "Unlock",
    placcate: "Plate Cards",
    placcateIntro:
      "A card you already own becomes a Plate Card of its grade: it is the material for enhancing sets. Each Plate Card is worth some points.",
    grado: "Grade",
    punti: "Points",
    potenziamento: "Points per level",
    potenziamentoIntro: (carte: number) =>
      `How many points it takes in all to bring a set to each level. Each set has a class, which multiplies the points; one enhancement uses up to ${carte} cards.`,
    potenziamentoNota:
      "Deduced: the client has one row per level, and we read it as a total. All 306 computer teams that use a set confirm it: they have exactly the total of their set's maximum level.",
    classe: "Class",
    set: (n: number) => (n === 1 ? "1 set" : `${n} sets`),
    livello: (n: number) => `Lv. ${n}`,
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const t = TESTI[await getLocale()];
  const entry = findGame(game);
  return { title: t.titoloPagina(entry?.shortName ?? game), description: t.descrizione(entry?.name ?? game) };
}

export default async function ArtifactSetsPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.artifacts;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const say = (value: Parameters<typeof inLingua>[0]) => inLingua(value, locale) ?? "";
  const cards = new Map(data.cards.map((card) => [card.id, card]));
  const races = gameModule.heroContext?.codes.race ?? {};
  const factions = gameModule.heroContext?.codes.faction ?? {};
  const raceIcons = gameModule.icons?.razza ?? [];

  const summaries: ArtifactSetSummary[] = data.sets.map((set) => ({
    number: set.number,
    name: say(set.name),
    event: set.event ? say(set.event) : null,
    cards: set.cards.map((id) => ({ id, grade: cards.get(id)?.grade ?? 1, image: cards.get(id)?.image ?? false })),
    effect: say(set.levels.at(-1)),
    levels: set.levels.length,
    contents: set.filters.contents,
    races: set.filters.races,
    factions: set.filters.factions,
    misc: set.filters.misc,
  }));

  // nei filtri solo i codici che almeno un set usa, nell'ordine del gioco
  const used = (pick: (set: ArtifactSet) => readonly number[]) =>
    [...new Set(data.sets.flatMap(pick))].sort((a, b) => a - b);
  const names: SetFilterNames = {
    titles: t.filtri,
    contents: used((set) => set.filters.contents).map((code) => {
      const content = data.filters.contents[String(code)];
      return {
        code,
        name: say(content?.name) || String(code),
        icon: content?.icon ? artifactImageSrc(game, `filtri/${content.icon}.png`) : null,
      };
    }),
    races: used((set) => set.filters.races).map((code) => ({
      code,
      name: say(races[String(code)]) || String(code),
      icon: raceIcons.includes(String(code)) ? gameIconSrc(game, "razza", code) : null,
    })),
    factions: used((set) => set.filters.factions).map((code) => ({ code, name: say(factions[String(code)]) || String(code) })),
    misc: used((set) => set.filters.misc).map((code) => ({ code, name: say(data.filters.misc[String(code)]?.name) || String(code) })),
  };

  const setCards = data.sets.reduce((sum, set) => sum + set.cards.length, 0);
  const classes = Object.entries(data.enhancement.classes).filter(([code]) =>
    data.sets.some((set) => String(set.enhanceClass) === code && set.levels.length > 1),
  );
  const maxLevel = Math.max(...data.sets.map((set) => set.levels.length));
  const unlock = say(data.unlock.text).replace("{0}", String(data.unlock.rank));

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <PageHeader title={t.titolo}>
        <p>{t.introduzione(data.sets.length, setCards)}</p>
        <p className="mt-1">
          {t.carte}{" "}
          <Link href={`/${game}/carte-artefatto`} className="text-ink underline decoration-brand underline-offset-2 hover:text-brand-deep">
            {t.carteVoce}
          </Link>
          .
        </p>
      </PageHeader>

      <SetBrowser game={game} sets={summaries} names={names} frame={data.images.small} />

      <section id="come-funziona" className="mt-16 scroll-mt-20 border-t border-rule pt-10">
        <h2 className={cx(display, "text-[30px]")}>{t.comeFunziona}</h2>
        <div className="mt-5 grid items-start gap-x-10 gap-y-8 lg:grid-cols-2">
          <Card className="min-w-0 text-[13px] leading-relaxed text-ink-2">
            {data.guide.map((page, position) => (
              <GameText key={position} text={say(page)} className={cx(position > 0 && "mt-3")} />
            ))}
            {unlock ? (
              <p className="m-0 mt-3 text-ink-3">
                {t.sblocco}: {unlock}
              </p>
            ) : null}
          </Card>

          <div className="min-w-0">
            <h3 className={cx(display, "m-0 text-[19px]")}>{t.placcate}</h3>
            <p className="m-0 mt-2 max-w-[48ch] text-[13px] leading-relaxed text-ink-2">{t.placcateIntro}</p>
            <table className="mt-3 w-full max-w-[360px] border-collapse border border-rule bg-paper text-[13px]">
              <thead className="bg-paper-2">
                <tr className="border-b border-rule text-left">
                  <th className={cx(eyebrow, "px-3 py-2 font-medium")}>{t.grado}</th>
                  <th className={cx(eyebrow, "px-3 py-2 text-right font-medium")}>{t.punti}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.grades).map(([code, grade]) => (
                  <tr key={code} className="border-b border-rule-2 last:border-b-0">
                    <td className="px-3 py-1">
                      <span className="inline-flex items-center gap-2">
                        {grade.plate.icon ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={artifactImageSrc(game, `placcate/${code}.png`)}
                            alt=""
                            width={28}
                            height={28}
                            loading="lazy"
                            className="block shrink-0"
                          />
                        ) : null}
                        <GradeBadge grade={Number(code)} index={data} />
                      </span>
                    </td>
                    <td className={cx(numeric, "px-3 py-1 text-right")}>{formatNumber(grade.plate.points, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <h3 className={cx(display, "m-0 text-[19px]")}>{t.potenziamento}</h3>
          <p className="m-0 mt-2 max-w-[48ch] text-[13px] leading-relaxed text-ink-2">{t.potenziamentoIntro(data.enhancement.cardsPerRound)}</p>
          <div className="mt-3 overflow-x-auto border border-rule bg-paper">
            <table className="w-full min-w-[420px] border-collapse text-[13px]">
              <thead className="bg-paper-2">
                <tr className="border-b border-rule text-left">
                  <th className={cx(eyebrow, "px-3 py-2 font-medium")}>{t.classe}</th>
                  {Array.from({ length: maxLevel - 1 }, (_, position) => (
                    <th key={position} className={cx(eyebrow, "px-3 py-2 text-right font-medium")}>
                      {t.livello(position + 2)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map(([code, totals]) => (
                  <tr key={code} className="border-b border-rule-2 last:border-b-0">
                    <td className="px-3 py-1.5">
                      <span className={numeric}>{code}</span>{" "}
                      <span className="text-[12px] text-ink-3">
                        · {t.set(data.sets.filter((set) => String(set.enhanceClass) === code && set.levels.length > 1).length)}
                      </span>
                    </td>
                    {Array.from({ length: maxLevel - 1 }, (_, position) => (
                      <td key={position} className={cx(numeric, "px-3 py-1.5 text-right")}>
                        {totals[position] !== undefined ? formatNumber(totals[position]!, locale) : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 max-w-[72ch] text-[12px] text-ink-3">{t.potenziamentoNota}</p>
        </div>
      </section>

      <div className="mt-12 grid gap-1 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        <p className="m-0">{t.fonte}</p>
        <p className="m-0">{t.diritti(entry.publisher)}</p>
      </div>
    </main>
  );
}
