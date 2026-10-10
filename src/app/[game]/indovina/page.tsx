import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuessHeader } from "@/components/hero-guess/guess-header";
import { HeroGuess, type GuessEntry, type GuessLabels } from "@/components/hero-guess/hero-guess";
import { HowItWorks } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { guessHeroes, HINTS } from "@/lib/games/hero-guess";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * «Indovina l'eroe»: il gioco degli indizi sul modello di Loldle e Genshindle.
 *
 * Richiesta dell'utente del 27/09, nel gruppo Strumenti. Il gioco lo fa il
 * browser; qui si preparano gli eroi con i loro indizi (hero-guess.ts, dal
 * roster, dal contesto, dal calendario delle uscite e dalle abilita' speciali), i
 * nomi dei codici nella lingua della pagina, e la spiegazione di ogni categoria.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Indovina l'eroe di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: il gioco degli indizi. Indovina l'eroe del giorno da attributo, razza, caratteristiche, grado e data d'uscita.`,
    introduzione:
      "Il gioco degli indizi, come Loldle: scrivi il nome di un eroe, e ogni casella dice cosa ha in comune con quello da indovinare. Verde uguale, giallo in parte, rosso diverso; la freccia dice dove cercare. Vince chi ci arriva col minor numero di tentativi.",
    comeSiGioca: "Gli indizi",
    indizi: [
      ["Personaggio", "Lo stesso personaggio: tutte le versioni di Meliodas sono «Meliodas». Another Ban e Another Meliodas per il gioco sono personaggi a sé."],
      ["Attributo", "Forza, PS, Velocità, Luce, Oscurità. Tristan è Luce e Oscurità insieme: con l'una o l'altra la casella è gialla."],
      ["Razza", "Umani, Fate, Giganti, Demoni, Dee, razza sconosciuta."],
      ["Caratteristiche", "Seven Deadly Sins, Comandamenti, Ragnarok, collaborazioni… Verde se sono le stesse (anche nessuna), giallo se almeno una è in comune."],
      ["Esce come", "Il grado con cui l'eroe esce dal gacha: R, SR, SSR, UR. La freccia dice se cercare più in alto o più in basso."],
      ["Grado massimo", "UR, o LR per chi può diventarlo."],
      ["Abilità speciale", "Comandamento, Grazia, Unità, Talento, o nessuna."],
      ["Uscita", "La data d'uscita nel server globale. Verde la stessa uscita, giallo lo stesso anno; la freccia dice se cercare prima o dopo."],
    ] satisfies [string, string][],
    aiuti: (primo: number, secondo: number) =>
      `Aiuti: dopo ${primo} tentativi sbagliati si può scoprire l'icona dell'Unica, dopo ${secondo} il suo nome.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Guess the Hero`,
    descrizione: (gioco: string) =>
      `${gioco}: the clue game. Guess the hero of the day from attribute, race, characteristics, grade and release date.`,
    introduzione:
      "The clue game, like Loldle: type a hero's name, and each tile tells what it has in common with the one to guess. Green the same, yellow partly, red different; the arrow says where to look. The fewer guesses, the better.",
    comeSiGioca: "The clues",
    indizi: [
      ["Character", "The same character: every version of Meliodas is «Meliodas». Another Ban and Another Meliodas are characters of their own for the game."],
      ["Attribute", "Strength, HP, Speed, Light, Darkness. Tristan is Light and Darkness together: with either one the tile is yellow."],
      ["Race", "Humans, Fairies, Giants, Demons, Goddesses, unknown race."],
      ["Characteristics", "The Seven Deadly Sins, Commandments, Ragnarok, collaborations… Green if they are the same (none included), yellow if at least one is shared."],
      ["Obtained as", "The grade the hero comes out of the gacha with: R, SR, SSR, UR. The arrow says whether to look higher or lower."],
      ["Max grade", "UR, or LR for those who can become one."],
      ["Special ability", "Commandment, Grace, Unity, Talent, or none."],
      ["Release", "The release date on the global server. Green the same release, yellow the same year; the arrow says whether to look earlier or later."],
    ] satisfies [string, string][],
    aiuti: (primo: number, secondo: number) =>
      `Hints: after ${primo} wrong guesses you can reveal the Unique's icon, after ${secondo} its name.`,
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? "Grand Cross"),
    description: t.descrizione(entry?.name ?? "Grand Cross"),
  };
}

export default async function HeroGuessPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const { roster, heroContext, releases, heroSpecials, heroAbilities, heroAssets, icons } = requireGameModule(game);
  // La voce di menu non compare senza calendario, ma l'indirizzo si puo' digitare.
  if (!roster || !heroContext || !releases) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const clues = guessHeroes(roster.heroes, heroContext, releases, heroSpecials);
  const heroes: GuessEntry[] = roster.heroes.map((hero, i) => {
    const passive = heroAbilities?.[hero.id]?.passive;
    return {
      ...hero,
      ...clues[i]!,
      unique: inLingua(passive?.nameI18n, locale) ?? passive?.name ?? null,
      uniqueIcon: !!heroAssets?.[hero.id]?.skill,
    };
  });
  const names = (codes: Readonly<Record<string, { it: string | null; en: string | null }>>) =>
    Object.fromEntries(Object.entries(codes).map(([code, label]) => [code, inLingua(label, locale) ?? code]));
  const labels: GuessLabels = {
    attribute: names(heroContext.codes.attribute),
    race: names(heroContext.codes.race),
    faction: names(heroContext.codes.faction),
    special: Object.fromEntries(
      Object.entries(heroSpecials?.kinds ?? {}).map(([kind, value]) => [kind, inLingua(value.label, locale) ?? kind]),
    ),
  };

  return (
    <main className="pt-6 pb-20">
      <GuessHeader game={game} shortName={entry.shortName} variant="classico" intro={t.introduzione} locale={locale} />

      <HeroGuess game={game} heroes={heroes} labels={labels} icons={icons} />

      {/* gli indizi in fondo, chiusi: prima si gioca (10/10) */}
      <HowItWorks summary={t.comeSiGioca} className="mt-12 max-w-[860px]">
        <dl className="m-0 grid gap-x-4 gap-y-2 sm:grid-cols-[150px_minmax(0,1fr)]">
          {t.indizi.map(([name, text]) => (
            <div key={name} className="contents">
              <dt className="font-semibold text-ink">{name}</dt>
              <dd className="m-0 mb-1 sm:mb-0">{text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3!">{t.aiuti(HINTS[0].after, HINTS[1].after)}</p>
      </HowItWorks>
    </main>
  );
}
