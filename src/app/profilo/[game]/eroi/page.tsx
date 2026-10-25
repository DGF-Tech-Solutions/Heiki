import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoxBrowser, type BoxArt } from "@/components/game-account/box-browser";
import { hasIcon } from "@/components/heroes/hero-parts";
import { cx, display } from "@/components/ui";
import { affinityLabel } from "@/lib/games/grand-cross/roster";
import { boxLimitsFrom } from "@/lib/games/hero-box";
import { gameIconSrc } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { profileGame } from "@/lib/profile/games";

/**
 * «I tuoi eroi»: il box (box-browser.tsx). La pagina passa al browser il roster,
 * i tetti di ogni eroe e le immagini dei comandi; il box sta nel browser e, per
 * chi e' entrato, nel database con l'account.
 *
 * Dal 25/10 nel profilo del sito (/profilo/<gioco>/eroi); /<gioco>/account/eroi
 * reindirizza qui.
 */

const TESTI = testi({
  it: {
    titolo: "I tuoi eroi",
    titoloPagina: (gioco: string) => `I tuoi eroi di ${gioco}`,
    descrizione: (gioco: string) => `Il tuo box di ${gioco}: chi hai e a che punto è.`,
    intro:
      "Segna gli eroi che hai nel gioco e a che punto sono. La scheda di ogni eroe parte dai tuoi numeri, e la griglia Eroi ha il filtro «I miei».",
  },
  en: {
    titolo: "Your heroes",
    titoloPagina: (game: string) => `Your ${game} heroes`,
    descrizione: (game: string) => `Your ${game} box: who you have and how far along.`,
    intro:
      "Mark the heroes you have in the game and how far along they are. Every hero page starts from your numbers, and the Heroes grid has the “Mine” filter.",
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const t = TESTI[await getLocale()];
  const name = profileGame(game)?.shortName ?? game;
  return { title: t.titoloPagina(name), description: t.descrizione(name), robots: { index: false } };
}

export default async function ProfileBoxPage({ params }: Props) {
  const { game } = await params;
  const entry = profileGame(game);
  if (!entry?.heroes) notFound();
  const gameModule = getGameModule(game);
  const roster = gameModule?.roster;
  const heroStats = gameModule?.heroStats;
  const icons = gameModule?.icons;
  if (!roster || !heroStats) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const localized = {
    ...roster,
    affinities: roster.affinities.map((affinity) => ({ ...affinity, label: affinityLabel(affinity.id, locale) })),
  };
  const art: BoxArt = {
    star: hasIcon(icons, "carta", "stella") ? gameIconSrc(game, "carta", "stella") : undefined,
    superStar: hasIcon(icons, "risveglio", "super_stella") ? gameIconSrc(game, "risveglio", "super_stella") : undefined,
    gems: [1, 2, 3, 4, 5, 6].every((rank) => hasIcon(icons, "carta", `pietra_${rank}`))
      ? [1, 2, 3, 4, 5, 6].map((rank) => gameIconSrc(game, "carta", `pietra_${rank}`))
      : undefined,
    exceed: [1, 2].every((n) => hasIcon(icons, "risveglio", `vero_${n}`))
      ? [gameIconSrc(game, "risveglio", "vero_1"), gameIconSrc(game, "risveglio", "vero_2")]
      : undefined,
  };

  return (
    <>
      <header className="mb-5">
        <h2 className={cx(display, "text-[clamp(26px,3.4vw,38px)]")}>{t.titolo}</h2>
        <p className="m-0 mt-2 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">{t.intro}</p>
      </header>
      <BoxBrowser game={game} roster={localized} icons={icons} limits={boxLimitsFrom(heroStats)} art={art} />
    </>
  );
}
