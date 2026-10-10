import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/artifacts/artifact-parts";
import { CardBrowser } from "@/components/artifacts/card-browser";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
import { IconChevronRight } from "@/components/icons";
import { Card, cx, display, numeric, PageHeader } from "@/components/ui";
import {
  artifactImageSrc,
  cardCode,
  isSingleCardPack,
  packChance,
  type ArtifactCardSummary,
} from "@/lib/games/artifacts";
import { findGame } from "@/lib/games/catalog";
import { formatPercent } from "@/lib/games/endgame";
import { plainHeroText } from "@/lib/games/hero-markup";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Carte artefatto: l'indice.
 *
 * La griglia delle 499 carte coi filtri per tipo, grado e set; ogni carta porta
 * alla sua pagina (scelta dell'utente, 26/09). Sotto, i pacchetti di carte del
 * gioco con quello che contengono, e il Pacchetto di carte del tempo. I
 * pacchetti di una carta sola (quelli degli eventi) stanno nella pagina della
 * carta: qui sarebbero 242 righe da una carta ciascuna. La fonte sta in fondo,
 * coi diritti: in testa veniva prima della griglia (10/10).
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Carte artefatto di ${gioco}`,
    descrizione: (gioco: string) =>
      `Le Carte artefatto di ${gioco}: statistiche, grado, set di cui fanno parte e pacchetti da cui si trovano.`,
    titolo: "Carte artefatto",
    introduzione: (carte: number, tipi: string) =>
      `${carte} carte, di cinque tipi (${tipi}) e sei gradi, da C a UR. Equipaggiate su una squadra ne alzano Attacco, Difesa e PS; tre o cinque carte precise fanno un set, che aggiunge un effetto.`,
    set: "I set, col loro effetto, stanno in",
    setVoce: "Set artefatto",
    fonte: "Fonte: le tabelle e i testi del client del gioco.",
    pacchetti: "Pacchetti di carte",
    pacchettiIntro:
      "I pacchetti del gioco che danno una carta a caso fra molte. La probabilità è il peso della carta sulla somma dei pesi del pacchetto: l'estrazione la fa il server. I pacchetti di una carta sola, quelli degli eventi, stanno nella pagina della carta.",
    carteNelPacchetto: (n: number) => `${n} carte`,
    elenco: "Le carte e la probabilità",
    tempo: "Pacchetto di carte del tempo",
    tempoIntro: (n: number, costo: string | null) =>
      `${n} carte, tutte quelle degli eventi passati, con lo stesso peso.${costo ? ` Si apre con: ${costo}.` : ""}`,
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Artifact Cards`,
    descrizione: (gioco: string) =>
      `${gioco} Artifact Cards: stats, grade, the set they belong to and the packs they come from.`,
    titolo: "Artifact Cards",
    introduzione: (carte: number, tipi: string) =>
      `${carte} cards, of five types (${tipi}) and six grades, from C to UR. Equipped on a team they raise its Attack, Defense and HP; three or five specific cards make a set, which adds an effect.`,
    set: "The sets, with their effect, are in",
    setVoce: "Artifact Sets",
    fonte: "Source: the game client's tables and texts.",
    pacchetti: "Card packs",
    pacchettiIntro:
      "The game's packs that give one card at random out of many. The chance is the card's weight over the sum of the pack's weights: the server makes the draw. Single-card packs, the event ones, are on the card's page.",
    carteNelPacchetto: (n: number) => `${n} cards`,
    elenco: "The cards and their chance",
    tempo: "Card Pack of Time",
    tempoIntro: (n: number, costo: string | null) =>
      `${n} cards, all the ones from past events, with the same weight.${costo ? ` It is opened with: ${costo}.` : ""}`,
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

export default async function ArtifactCardsPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const data = requireGameModule(game).artifacts;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const say = (value: Parameters<typeof inLingua>[0]) => inLingua(value, locale) ?? "";
  const sets = new Map(data.sets.map((set) => [set.id, set]));
  const byId = new Map(data.cards.map((card) => [card.id, card]));

  const summaries: ArtifactCardSummary[] = data.cards.map((card) => {
    const set = card.set ? sets.get(card.set) : undefined;
    return {
      id: card.id,
      code: cardCode(data, card, locale),
      name: plainHeroText(say(card.name)),
      type: card.type,
      grade: card.grade,
      set: set?.number ?? null,
      setName: set ? plainHeroText(say(set.name)) : null,
      image: card.image,
    };
  });
  const types = Object.entries(data.types).map(([code, type]) => ({ code: Number(code), name: say(type.name) }));
  const grades = Object.entries(data.grades).map(([code, grade]) => ({ code: Number(code), name: grade.code }));
  const typeCounts = types
    .map((type) => `${type.name} ${data.cards.filter((card) => card.type === type.code).length}`)
    .join(", ");
  const packs = Object.entries(data.packs).filter(([, pack]) => !isSingleCardPack(pack));

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <PageHeader title={t.titolo}>
        <p>{t.introduzione(data.cards.length, typeCounts)}</p>
        <p className="mt-1">
          {t.set}{" "}
          <Link href={`/${game}/set-artefatto`} className="text-ink underline decoration-brand underline-offset-2 hover:text-brand-deep">
            {t.setVoce}
          </Link>
          .
        </p>
      </PageHeader>

      <CardBrowser game={game} cards={summaries} types={types} grades={grades} frame={data.images.small} />

      <section id="pacchetti" className="mt-16 scroll-mt-20 border-t border-rule pt-10">
        <h2 className={cx(display, "text-[30px]")}>{t.pacchetti}</h2>
        <p className="m-0 mt-2.5 max-w-[48ch] text-sm leading-relaxed text-ink-2">{t.pacchettiIntro}</p>
        <ul className="m-0 mt-5 grid list-none items-start gap-3 p-0 lg:grid-cols-2">
          {packs.map(([id, pack]) => {
            const perGrade = new Map<number, number>();
            for (const entry of pack.cards) {
              const grade = byId.get(entry.card)?.grade;
              if (grade) perGrade.set(grade, (perGrade.get(grade) ?? 0) + 1);
            }
            return (
              <li key={id} className="p5-corner min-w-0 border border-rule bg-paper-2 p-4">
                <div className="flex items-start gap-3">
                  {pack.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={artifactImageSrc(game, `pacchetti/${pack.icon}`)}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      className="block shrink-0"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="m-0 font-display text-[16px] font-extrabold uppercase leading-snug tracking-[0.01em] [font-variation-settings:'wdth'_85]">
                      {say(pack.name)}
                    </p>
                    {pack.description ? <p className="m-0 mt-0.5 text-[12px] text-ink-3">{say(pack.description)}</p> : null}
                    <p className="m-0 mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] text-ink-2">
                      <span className="mr-1">{t.carteNelPacchetto(pack.cards.length)}</span>
                      {[...perGrade.entries()]
                        .sort(([a], [b]) => a - b)
                        .map(([grade, count]) => (
                          <span key={grade} className="inline-flex items-center gap-1">
                            <GradeBadge grade={grade} index={data} />
                            <span className={numeric}>{count}</span>
                          </span>
                        ))}
                    </p>
                  </div>
                </div>
                <details className="group/elenco mt-3 border-t border-rule-2 pt-2">
                  <summary className="flex min-h-9 cursor-pointer list-none items-center gap-1.5 text-[13px] font-semibold text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden">
                    <IconChevronRight size={14} className="transition-transform group-open/elenco:rotate-90" />
                    {t.elenco}
                  </summary>
                  <table className="mt-1.5 w-full border-collapse text-[13px]">
                    <tbody>
                      {[...pack.cards]
                        .sort((a, b) => b.weight - a.weight)
                        .map((entry) => {
                          const card = byId.get(entry.card);
                          const chance = packChance(pack, entry.weight);
                          if (!card) return null;
                          return (
                            <tr key={entry.card} className="border-b border-rule-2 last:border-b-0">
                              <td className="py-1 pr-2">
                                <Link
                                  href={`/${game}/carte-artefatto/${card.id}`}
                                  className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-brand-deep hover:underline"
                                >
                                  <span className={cx(numeric, "text-[12px] text-ink-3")}>{cardCode(data, card, locale)}</span>
                                  {say(card.name)}
                                </Link>
                              </td>
                              <td className="w-[1%] py-1 pr-2">
                                <GradeBadge grade={card.grade} index={data} />
                              </td>
                              <td className={cx(numeric, "w-[1%] whitespace-nowrap py-1 text-right text-ink-2")}>
                                {chance !== null ? formatPercent(chance, locale) : "—"}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </details>
              </li>
            );
          })}
        </ul>

        {data.timePack ? (
          <Card className="mt-8 max-w-[72ch]">
            <h3 className={cx(display, "m-0 text-[19px]")}>{t.tempo}</h3>
            {data.timePack.title ? <p className="m-0 mt-0.5 text-[12px] text-ink-3">{say(data.timePack.title)}</p> : null}
            <p className="m-0 mt-2 text-[13px] text-ink-2">
              {t.tempoIntro(data.timePack.cards, data.timePack.cost ? say(data.timePack.cost) : null)}
            </p>
            <div className="mt-3 grid gap-2 text-[13px] leading-relaxed text-ink-2">
              {data.timePack.rules.map((rule, position) => (
                <GameText key={position} text={say(rule)} />
              ))}
            </div>
          </Card>
        ) : null}
      </section>

      <div className="mt-12 grid gap-1 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        <p className="m-0">{t.fonte}</p>
        <p className="m-0">{t.diritti(entry.publisher)}</p>
      </div>
    </main>
  );
}
