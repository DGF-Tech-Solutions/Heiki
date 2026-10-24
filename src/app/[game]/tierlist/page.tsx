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

/*
 * I testi (24/10): prima parlavano da pubblicita' («Crea, personalizza e
 * scarica... condividi l'immagine con la community», «in alta risoluzione per
 * condividerla ovunque»). Ora dicono cosa fa la pagina e come si usa, e il nome
 * e' quello della voce di menu: «Tier list».
 */
const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Tier list · ${gioco}`,
    descrizione: (gioco: string) =>
      `Metti in ordine gli eroi di ${gioco}, dal più forte al più debole, e scarica il risultato come immagine.`,
    titoloLista: (titolo: string, autore: string, gioco: string) =>
      `${titolo} · Tier list di ${autore} · ${gioco}`,
    descrizioneLista: (titolo: string, autore: string) =>
      `La tier list «${titolo}» di ${autore} su ${SITE_NAME}.`,
    titolo: "Tier list",
    introduzione:
      "Trascina un eroe in una riga, o toccalo e scegli dove metterlo. Nome, colore e ordine delle righe si cambiano dal menu di ciascuna.",
  },
  en: {
    titoloPagina: (gioco: string) => `Tier list · ${gioco}`,
    descrizione: (gioco: string) =>
      `Rank the ${gioco} heroes from strongest to weakest and download the result as an image.`,
    titoloLista: (titolo: string, autore: string, gioco: string) =>
      `${titolo} · ${autore}'s tier list · ${gioco}`,
    descrizioneLista: (titolo: string, autore: string) =>
      `“${titolo}”, a tier list by ${autore} on ${SITE_NAME}.`,
    titolo: "Tier list",
    introduzione:
      "Drag a hero into a row, or tap it and pick where it goes. Each row's menu changes its name, color and position.",
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
      {/* Gioco e pagina: «Strumenti» portava a /squadra, che non e' il gruppo (24/10) */}
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <PageHeader title={t.titolo} className="mb-6">
        {/* righe sotto i 75 caratteri: con la misura della testata ne facevano 87 */}
        <p className="max-w-[50ch]">{t.introduzione}</p>
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
