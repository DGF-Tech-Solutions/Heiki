import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardImage, CardTile, GradeBadge, SetTags, StatRow } from "@/components/artifacts/artifact-parts";
import { CardSources } from "@/components/artifacts/card-sources";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
import { cx, display, eyebrow, numeric } from "@/components/ui";
import type { ArtifactCard } from "@/lib/games/artifact-types";
import { artifactImageSrc, cardCode, setCode } from "@/lib/games/artifacts";
import { findGame } from "@/lib/games/catalog";
import { formatNumber } from "@/lib/games/endgame";
import { plainHeroText } from "@/lib/games/hero-markup";
import { getGameModule, requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Una Carta artefatto: l'immagine, il grado, le statistiche, il set di cui fa
 * parte e da dove si ottiene.
 */

const TESTI = testi({
  it: {
    titoloPagina: (carta: string, gioco: string) => `${carta} · Carta artefatto di ${gioco} · GachaZone`,
    descrizione: (carta: string, codice: string, grado: string) => `Carta artefatto ${codice} «${carta}», grado ${grado}.`,
    sezione: "Carte artefatto",
    carta: "Carta artefatto",
    tipo: "Tipo",
    numero: "Numero",
    grado: "Grado",
    statistiche: "Statistiche",
    statisticheNota: "Le dà alla squadra su cui è equipaggiata.",
    doppione: "Se la si ha già",
    doppioneTesto: (grado: string, punti: string) =>
      `diventa una Carta placcata ${grado}, che vale ${punti} punti per potenziare un set.`,
    set: "Il suo set",
    fuoriSet: "Questa carta non fa parte di nessun set: dà solo le sue statistiche.",
    effetto: (n: number) => (n === 1 ? "Effetto" : `Effetto al livello ${n}, il massimo`),
    vaiAlSet: "Tutti i livelli e il potenziamento",
    dove: "Dove si ottiene",
    altre: "Altre carte",
    precedente: "Carta precedente",
    successiva: "Carta successiva",
    tutte: "Tutte le carte",
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (carta: string, gioco: string) => `${carta} · ${gioco} Artifact Card · GachaZone`,
    descrizione: (carta: string, codice: string, grado: string) => `Artifact Card ${codice} «${carta}», grade ${grado}.`,
    sezione: "Artifact Cards",
    carta: "Artifact Card",
    tipo: "Type",
    numero: "Number",
    grado: "Grade",
    statistiche: "Stats",
    statisticheNota: "It gives them to the team it is equipped on.",
    doppione: "If you already own it",
    doppioneTesto: (grado: string, punti: string) =>
      `it becomes a ${grado} Plate Card, worth ${punti} points toward enhancing a set.`,
    set: "Its set",
    fuoriSet: "This card is not part of any set: it only gives its stats.",
    effetto: (n: number) => (n === 1 ? "Effect" : `Effect at level ${n}, the maximum`),
    vaiAlSet: "Every level and the enhancement",
    dove: "Where to get it",
    altre: "Other cards",
    precedente: "Previous card",
    successiva: "Next card",
    tutte: "All cards",
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

interface Props {
  params: Promise<{ game: string; card: string }>;
}

function findCard(game: string, id: string) {
  const data = getGameModule(game)?.artifacts;
  return data?.cards.find((card) => card.id === id) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, card: id } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];
  const data = getGameModule(game)?.artifacts;
  const card = findCard(game, id);
  const entry = findGame(game);
  if (!data || !card) return { title: t.sezione };
  const name = plainHeroText(inLingua(card.name, locale) ?? "");
  return {
    title: t.titoloPagina(name, entry?.shortName ?? game),
    description: t.descrizione(name, cardCode(data, card, locale), data.grades[String(card.grade)]?.code ?? ""),
  };
}

export default async function ArtifactCardPage({ params }: Props) {
  const { game, card: id } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.artifacts;
  const card = findCard(game, id);
  if (!data || !card) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const say = (value: Parameters<typeof inLingua>[0]) => inLingua(value, locale) ?? "";
  const name = plainHeroText(say(card.name));
  const grade = data.grades[String(card.grade)];
  const set = card.set ? data.sets.find((entry) => entry.id === card.set) : undefined;
  const byId = new Map(data.cards.map((entry) => [entry.id, entry]));
  const setCards = (set?.cards ?? []).map((cid) => byId.get(cid)).filter((entry): entry is ArtifactCard => entry !== undefined);
  const sameType = data.cards.filter((entry) => entry.type === card.type);
  const position = sameType.indexOf(card);
  const previous = sameType[position - 1];
  const next = sameType[position + 1];
  const codes = {
    race: gameModule.heroContext?.codes.race ?? {},
    faction: gameModule.heroContext?.codes.faction ?? {},
  };

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.sezione, href: `/${game}/carte-artefatto` },
          { label: name },
        ]}
      />

      <div className="mb-10 grid gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="min-w-0">
          <CardImage game={game} card={card} size={360} eager />
        </div>

        <div className="min-w-0">
          <p className={eyebrow}>
            {t.carta} · <span className={numeric}>{cardCode(data, card, locale)}</span>
          </p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{name}</h1>
          {card.description ? (
            <GameText text={say(card.description)} className="mt-2 max-w-[60ch] text-[14px] text-ink-2" />
          ) : null}

          <dl className="m-0 mt-5 grid max-w-[520px] grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 text-[14px]">
            <dt className="text-ink-3">{t.tipo}</dt>
            <dd className="m-0">{say(data.types[String(card.type)]?.name)}</dd>
            <dt className="text-ink-3">{t.numero}</dt>
            <dd className={cx(numeric, "m-0")}>{cardCode(data, card, locale)}</dd>
            <dt className="text-ink-3">{t.grado}</dt>
            <dd className="m-0">
              <GradeBadge grade={card.grade} index={data} className="text-[12px] leading-[18px]" />
            </dd>
            <dt className="text-ink-3">{t.statistiche}</dt>
            <dd className="m-0">
              <StatRow stats={card.stats} locale={locale} />
              <span className="mt-0.5 block text-[12px] text-ink-3">{t.statisticheNota}</span>
            </dd>
            {grade ? (
              <>
                <dt className="text-ink-3">{t.doppione}</dt>
                <dd className="m-0 flex items-start gap-2 text-ink-2">
                  {grade.plate.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={artifactImageSrc(game, `placcate/${card.grade}.png`)}
                      alt=""
                      width={28}
                      height={28}
                      className="block shrink-0"
                    />
                  ) : null}
                  <span>{t.doppioneTesto(grade.code, formatNumber(grade.plate.points, locale))}</span>
                </dd>
              </>
            ) : null}
          </dl>
        </div>
      </div>

      <section id="set" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.set}</h2>
        {set ? (
          <div className="mt-3 rounded-card border border-rule bg-paper-2 p-4">
            <Link
              href={`/${game}/set-artefatto/${set.number}`}
              className="text-[16px] font-semibold underline-offset-2 hover:text-brand hover:underline"
            >
              <span className={cx(numeric, "mr-2 text-[13px] font-normal text-ink-3")}>{setCode(set)}</span>
              {plainHeroText(say(set.name))}
            </Link>
            <div className="mt-2">
              <SetTags game={game} set={set} index={data} codes={codes} locale={locale} raceIcons={gameModule.icons?.razza ?? []} />
            </div>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-4 p-0">
              {setCards.map((entry) => (
                <li key={entry.id}>
                  <CardTile game={game} card={entry} index={data} locale={locale} size={104} current={entry.id === card.id} />
                </li>
              ))}
            </ul>
            <p className="m-0 mt-4 text-[11px] font-medium uppercase tracking-wide text-ink-3">{t.effetto(set.levels.length)}</p>
            <GameText text={say(set.levels.at(-1))} className="mt-1 max-w-[72ch] text-[14px] leading-relaxed" />
            <Link
              href={`/${game}/set-artefatto/${set.number}#effetto`}
              className="mt-3 inline-block text-[13px] text-brand underline-offset-2 hover:underline"
            >
              {t.vaiAlSet} →
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-2">{t.fuoriSet}</p>
        )}
      </section>

      <section id="dove" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.dove}</h2>
        <div className="mt-3 max-w-[72ch]">
          <CardSources game={game} card={card} data={data} gameModule={gameModule} locale={locale} />
        </div>
      </section>

      <nav aria-label={t.altre} className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-5 text-[14px]">
        {previous ? (
          <Link href={`/${game}/carte-artefatto/${previous.id}`} className="text-brand underline-offset-2 hover:underline">
            ← {cardCode(data, previous, locale)} {plainHeroText(say(previous.name))}
          </Link>
        ) : (
          <span />
        )}
        <Link href={`/${game}/carte-artefatto`} className="text-ink-2 underline-offset-2 hover:text-brand hover:underline">
          {t.tutte}
        </Link>
        {next ? (
          <Link href={`/${game}/carte-artefatto/${next.id}`} className="text-brand underline-offset-2 hover:underline">
            {cardCode(data, next, locale)} {plainHeroText(say(next.name))} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}
