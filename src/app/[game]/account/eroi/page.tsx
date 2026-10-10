import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { BoxBrowser, type BoxArt } from "@/components/game-account/box-browser";
import { hasIcon } from "@/components/heroes/hero-parts";
import { cx, display } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { affinityLabel } from "@/lib/games/grand-cross/roster";
import { boxLimitsFrom } from "@/lib/games/hero-box";
import { gameIconSrc } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * «I tuoi eroi»: il box (box-browser.tsx). La pagina passa al browser il roster,
 * i tetti di ogni eroe e le immagini dei comandi; il box sta nel browser e, per
 * chi e' entrato, nel database con l'account.
 */

const TESTI = testi({
  it: {
    titolo: "I tuoi eroi",
    account: "Il mio account",
    descrizione: (gioco: string) => `Il tuo box di ${gioco}: chi hai e a che punto è.`,
    intro:
      "Segna gli eroi che hai nel gioco e a che punto sono. La scheda di ogni eroe parte dai tuoi numeri, e la griglia Eroi ha il filtro «I miei».",
  },
  en: {
    titolo: "Your heroes",
    account: "My account",
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
  return { title: t.titolo, description: t.descrizione(findGame(game)?.shortName ?? game), robots: { index: false } };
}

export default async function BoxPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();
  const { roster, heroStats, icons } = requireGameModule(game);
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
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.account, href: `/${game}/account` },
          { label: t.titolo },
        ]}
      />
      <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-brand pb-4">
        <h1 className={cx(display, "text-[clamp(34px,5vw,58px)]")}>{t.titolo}</h1>
        <p className="m-0 max-w-[48ch] text-sm text-ink-2">{t.intro}</p>
      </header>
      <BoxBrowser game={game} roster={localized} icons={icons} limits={boxLimitsFrom(heroStats)} art={art} />
    </main>
  );
}
