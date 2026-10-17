import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { TierListMaker } from "@/components/tier-list/tier-list-maker";
import { PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import type { TierHeroItem } from "@/lib/tier-list/types";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Tier List Maker · ${gioco}`,
    descrizione: (gioco: string) =>
      `Crea, personalizza e scarica la tua tier list degli eroi di ${gioco}. Trascina gli eroi, assegna i tier e condividi l'immagine con la community.`,
    titolo: "Tier List Maker",
    introduzione:
      "Trascina gli eroi nei diversi livelli o clicca su una miniatura per assegnarla al volo. Personalizza i nomi delle righe, i colori, svuota o aggiungi nuovi tier, e scarica la tua tier list in alta risoluzione per condividerla ovunque.",
    strumenti: "Strumenti",
  },
  en: {
    titoloPagina: (gioco: string) => `Tier List Maker · ${gioco}`,
    descrizione: (gioco: string) =>
      `Create, customize and download your hero tier list for ${gioco}. Drag and drop heroes, configure tiers, and share high-res images with the community.`,
    titolo: "Tier List Maker",
    introduzione:
      "Drag and drop heroes into the tier rows or tap any portrait to quickly rank them. Customize row names, colors, add or clear tiers, and export your tier list as a crisp PNG image ready to share.",
    strumenti: "Tools",
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

export default async function TierListPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const roster = gameModule.roster;
  if (!roster) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  // Prepara l'elenco completo degli eroi serializzabile
  const heroes: TierHeroItem[] = roster.heroes.map((hero) => ({
    id: hero.id,
    name: heroName(hero, locale),
    epithet: heroEpithet(hero, locale),
    rarity: hero.rarity,
    affinity: hero.affinity,
    cardSrc: heroCardSrc(game, hero.id),
  }));

  // Estrai le rarità presenti (ordinate per importanza convenzionale)
  const allRarities = Array.from(new Set(heroes.map((h) => h.rarity)));
  const rarityOrder = ["LR", "UR", "SSR", "SR", "R"];
  allRarities.sort((a, b) => {
    const ia = rarityOrder.indexOf(a);
    const ib = rarityOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    return a.localeCompare(b);
  });

  // Estrai le affinità
  const affinities = (roster.affinities ?? []).map((aff) => ({
    id: aff.id,
    name: aff.label,
  }));

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.strumenti, href: `/${game}/squadra` },
          { label: "Tier List" },
        ]}
      />

      <PageHeader title={t.titolo} className="mb-6">
        <p>{t.introduzione}</p>
      </PageHeader>

      <TierListMaker
        game={game}
        gameName={entry.shortName}
        locale={locale}
        heroes={heroes}
        rarities={allRarities}
        affinities={affinities}
      />
    </main>
  );
}

