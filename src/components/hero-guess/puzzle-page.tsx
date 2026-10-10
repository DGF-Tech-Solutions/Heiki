/**
 * La pagina delle modalita' Carta, Unica e Testo di «Indovina l'eroe»: una sola,
 * che le tre pagine chiamano con la loro modalita'. Prepara sul server quello che
 * la modalita' mostra (le carte A e B con l'illustrazione, l'icona dell'Unica, il
 * testo dell'Unica col nome dell'eroe nascosto) e spiega come si gioca.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuessHeader, guessTitle } from "@/components/hero-guess/guess-header";
import { PuzzleGuess, type PuzzleEntry, type PuzzleKind } from "@/components/hero-guess/puzzle-guess";
import { HowItWorks } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { maskWords, VARIANT_HINTS, VARIANT_LABELS } from "@/lib/games/hero-guess";
import { heroName } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    descrizione: {
      carta:
        "Indovina l'eroe dall'illustrazione di una sua carta: parte ingrandita e a mosaico, e si schiarisce a ogni tentativo sbagliato.",
      unica: "Indovina l'eroe dall'icona della sua Unica: parte a mosaico, e si schiarisce a ogni tentativo sbagliato.",
      testo: "Indovina l'eroe dal testo della sua Unica.",
    },
    comeSiGioca: "Come si gioca",
    regole: {
      carta:
        "La carta è la A o la B dell'eroe (le carte dell'ultimate no: molte le condividono più versioni dello stesso personaggio). Parte ingrandita su un punto a caso e a mosaico, e ogni tentativo sbagliato la allarga e rimpicciolisce i quadretti; a fine partita si vede intera e nitida. Il mosaico si può spegnere, e il browser ricorda la scelta.",
      unica:
        "L'icona è quella che il gioco mostra accanto all'Unica dell'eroe: ognuna è di un eroe solo. Parte a mosaico, e i quadretti si rimpiccioliscono a ogni tentativo sbagliato; il mosaico si può spegnere, e il browser ricorda la scelta.",
      testo:
        "Il testo è quello dell'Unica al rango 1 dell'ultimate, come nella scheda dell'eroe. Dove l'Unica nomina l'eroe stesso, il nome è nascosto. Due eroi hanno lo stesso testo: valgono tutti e due.",
    },
    aiuti: (primo: string, dopo1: number, secondo: string, dopo2: number) =>
      `Aiuti: dopo ${dopo1} tentativi sbagliati si può scoprire ${primo}, dopo ${dopo2} ${secondo}.`,
    nomiAiuti: {
      carta: "il nome della carta",
      attributo: "l'attributo",
      nome: "il nome dell'Unica",
      icona: "l'icona dell'Unica",
    },
  },
  en: {
    descrizione: {
      carta: "Guess the hero from the art of one of their cards: it starts zoomed in and as a mosaic, and clears up at every wrong guess.",
      unica: "Guess the hero from their Unique's icon: it starts as a mosaic, and clears up at every wrong guess.",
      testo: "Guess the hero from their Unique's text.",
    },
    comeSiGioca: "How to play",
    regole: {
      carta:
        "The card is the hero's A or B card (not the Ultimate: many versions of the same character share it). It starts zoomed in on a random spot and as a mosaic, and every wrong guess widens it and makes the tiles smaller; at the end you see it whole and sharp. The mosaic can be turned off, and the browser remembers the choice.",
      unica:
        "The icon is the one the game shows next to the hero's Unique: each belongs to one hero only. It starts as a mosaic, and the tiles get smaller at every wrong guess; the mosaic can be turned off, and the browser remembers the choice.",
      testo:
        "The text is the Unique's at Ultimate rank 1, as on the hero page. Where the Unique names the hero, the name is hidden. Two heroes share the same text: both count.",
    },
    aiuti: (primo: string, dopo1: number, secondo: string, dopo2: number) =>
      `Hints: after ${dopo1} wrong guesses you can reveal ${primo}, after ${dopo2} ${secondo}.`,
    nomiAiuti: {
      carta: "the card's name",
      attributo: "the attribute",
      nome: "the Unique's name",
      icona: "the Unique's icon",
    },
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function puzzleMetadata({ params }: Props, kind: PuzzleKind): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const locale = await getLocale();
  return {
    title: `${guessTitle(locale)} (${VARIANT_LABELS[kind][locale]}) · ${entry?.shortName ?? "Grand Cross"} · GachaZone`,
    description: TESTI[locale].descrizione[kind],
  };
}

export async function PuzzlePage({ params, kind }: Props & { kind: PuzzleKind }) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const { roster, heroContext, heroAbilities, heroAssets, icons } = requireGameModule(game);
  if (!roster || !heroContext || !heroAbilities) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const heroes: PuzzleEntry[] = roster.heroes.map((hero) => {
    const own = heroAbilities[hero.id];
    const context = heroContext.heroes[hero.id];
    const passive = own?.passive;
    const base: PuzzleEntry = {
      ...hero,
      factions: context?.factions ?? [],
      attribute: context?.attribute ?? null,
      unique: inLingua(passive?.nameI18n, locale) ?? passive?.name ?? null,
      uniqueIcon: !!heroAssets?.[hero.id]?.skill,
    };
    if (kind === "carta") {
      const cards = (own?.cards ?? []).flatMap((card): NonNullable<PuzzleEntry["cards"]>[number][] => {
        const slot = card.slot === "A" || card.slot === "B" ? card.slot : null;
        return slot && card.sprite ? [{ slot, sprite: card.sprite, name: inLingua(card.nameI18n, locale) ?? card.name }] : [];
      });
      return { ...base, cards };
    }
    if (kind === "testo") {
      const text = locale === "it" ? (passive?.textIt ?? passive?.text) : passive?.text;
      // le parole del nome nelle due lingue e il personaggio: Odino, Freyja, Salos citano se stessi
      const words = [heroName(hero, "it"), heroName(hero, "en"), hero.group].flatMap((name) => name.split(/[\s,&]+/));
      return { ...base, text: text ? maskWords(text, words) : undefined };
    }
    return base;
  });
  // oggi tutti e 375 hanno carte, icona e testo: il filtro tiene fuori un eroe nuovo che una patch portasse senza
  const playable = heroes.filter((hero) =>
    kind === "carta" ? (hero.cards?.length ?? 0) > 0 : kind === "unica" ? hero.uniqueIcon : !!hero.text,
  );
  const attributes = Object.fromEntries(
    Object.entries(heroContext.codes.attribute).map(([code, label]) => [code, inLingua(label, locale) ?? code]),
  );
  const [first, second] = VARIANT_HINTS[kind];

  return (
    <main className="pt-6 pb-20">
      <GuessHeader game={game} shortName={entry.shortName} variant={kind} intro={t.descrizione[kind]} locale={locale} />

      <PuzzleGuess game={game} kind={kind} heroes={playable} attributes={attributes} icons={icons} />

      {/* le regole in fondo, chiuse: prima si gioca (10/10) */}
      <HowItWorks summary={t.comeSiGioca} className="mt-12 max-w-[860px]">
        <p>{t.regole[kind]}</p>
        {first && second ? (
          <p>{t.aiuti(t.nomiAiuti[first.key], first.after, t.nomiAiuti[second.key], second.after)}</p>
        ) : null}
      </HowItWorks>
    </main>
  );
}
