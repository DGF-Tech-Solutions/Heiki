import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { TierListMaker } from "@/components/tier-list/tier-list-maker";
import { PageHeader } from "@/components/ui";
import { currentViewer } from "@/lib/community/actions";
import { findGame } from "@/lib/games/catalog";
import { affinityLabel } from "@/lib/games/grand-cross/roster";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import { getTierListById, getUserTierLists } from "@/lib/tier-list/server";
import type { TierHeroItem } from "@/lib/tier-list/types";
import { parseTierListId } from "@/lib/tier-list/validation";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { SITE_NAME } from "@/lib/site";

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Tier List Maker · ${gioco}`,
    descrizione: (gioco: string) =>
      `Crea, personalizza e scarica la tua tier list degli eroi di ${gioco}. Trascina gli eroi, assegna i tier e condividi l'immagine con la community.`,
    titoloLista: (titolo: string, autore: string, gioco: string) =>
      `${titolo} · Tier List di ${autore} · ${gioco}`,
    descrizioneLista: (titolo: string, autore: string) =>
      `Guarda e personalizza la tier list "${titolo}" creata da ${autore} su ${SITE_NAME}.`,
    titolo: "Tier List Maker",
    introduzione:
      "Trascina gli eroi nei diversi livelli o clicca su una miniatura per assegnarla al volo. Personalizza i nomi delle righe, i colori, svuota o aggiungi nuovi tier, e scarica la tua tier list in alta risoluzione per condividerla ovunque.",
    strumenti: "Strumenti",
  },
  en: {
    titoloPagina: (gioco: string) => `Tier List Maker · ${gioco}`,
    descrizione: (gioco: string) =>
      `Create, customize and download your hero tier list for ${gioco}. Drag and drop heroes, configure tiers, and share high-res images with the community.`,
    titoloLista: (titolo: string, autore: string, gioco: string) =>
      `${titolo} · ${autore}'s Tier List · ${gioco}`,
    descrizioneLista: (titolo: string, autore: string) =>
      `View and customize the tier list "${titolo}" made by ${autore} on ${SITE_NAME}.`,
    titolo: "Tier List Maker",
    introduzione:
      "Drag and drop heroes into the tier rows or tap any portrait to quickly rank them. Customize row names, colors, add or clear tiers, and export your tier list as a crisp PNG image ready to share.",
    strumenti: "Tools",
  },
});

interface Props {
  params: Promise<{ game: string }>;
  // `?id=a&id=b` arriva come elenco: parseTierListId lo tratta come un id non valido
  searchParams?: Promise<{ id?: string | string[] }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { game } = await params;
  const search = await searchParams;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];

  // Senza chi guarda: i metadati di una lista privata restano quelli generici
  const id = parseTierListId(search?.id);
  const tierList = id ? await getTierListById(id) : null;
  if (tierList) {
    const authorName = tierList.author?.displayName ?? tierList.author?.username ?? "Community";
    return {
      title: t.titoloLista(tierList.title, authorName, entry?.shortName ?? "Grand Cross"),
      description: tierList.description || t.descrizioneLista(tierList.title, authorName),
    };
  }

  return {
    title: t.titoloPagina(entry?.shortName ?? "Grand Cross"),
    description: t.descrizione(entry?.name ?? "Grand Cross"),
  };
}

export default async function TierListPage({ params, searchParams }: Props) {
  const { game } = await params;
  const search = await searchParams;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const roster = gameModule.roster;
  if (!roster) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const viewer = await currentViewer();

  // Carica eventuale tier list condivisa tramite URL (?id=...). Un id non valido
  // vale come una lista che non c'e', e una lista di un altro gioco anche: i suoi
  // eroi non sarebbero nel roster di questa pagina.
  const id = parseTierListId(search?.id);
  const found = id ? await getTierListById(id, viewer?.id) : null;
  const initialTierList = found?.game === game ? found : null;

  // Carica le tier list salvate dell'utente per questo gioco
  const userSavedLists = viewer ? await getUserTierLists(viewer.id, game) : [];

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

  // Gli attributi: il filtro confronta l'id (quello che hanno gli eroi), il nome
  // e' nella lingua di chi legge. Fino al 24/10 passava l'etichetta italiana come
  // valore, e Velocità, Oscurità e Luce/Oscurità non trovavano nessun eroe.
  const affinities = (roster.affinities ?? []).map((aff) => ({
    id: aff.id,
    name: affinityLabel(aff.id, locale),
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
        viewer={viewer ? { id: viewer.id, username: viewer.username, displayName: viewer.displayName } : null}
        initialTierList={initialTierList}
        initialSavedLists={userSavedLists}
      />
    </main>
  );
}
