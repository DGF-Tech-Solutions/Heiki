import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { DEFAULT_STAGE_ART, stageArtOf, type StageArt } from "@/components/heroes/hero-stage";
import { RosterBrowser } from "@/components/heroes/roster-browser";
import { PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { affinityLabel } from "@/lib/games/grand-cross/roster";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Eroi.
 *
 * Il roster completo, quello che si sfoglia. E' diverso da Personaggi, che
 * elenca le unita' che il motore sa simulare: quelle hanno moltiplicatori
 * calibrati a mano e per ora sono una manciata. Qui ci sono tutte, perche' per
 * riconoscere un eroe e sapere che attributo ha non serve aver calibrato niente.
 *
 * Le due sezioni convergeranno man mano che il dataset cresce.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Eroi di ${gioco}`,
    descrizione: (gioco: string) => `Roster completo di ${gioco}, filtrabile per rarità e attributo.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    eroi: "Eroi",
    introduzione: (eroi: number, contati: number, grado: string) => `${eroi} eroi, ${contati} di grado ${grado}.`,
    card: "Le card sono quelle del gioco, ricostruite dagli asset del client: cornice, sfondo di rarità e bollino dell'attributo.",
    diritti: (editore: string) =>
      `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
    ordine: "In ordine d'uscita sul server globale, dal più recente. Banner, date ed eventi:",
    uscite: "Uscite",
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Heroes`,
    descrizione: (gioco: string) => `Full ${gioco} roster, filterable by rarity and attribute.`,
    gioco: "game",
    questoGioco: "this game",
    eroi: "Heroes",
    introduzione: (eroi: number, contati: number, grado: string) => `${eroi} heroes, ${contati} of them ${grado}.`,
    card: "The cards are the game's own, rebuilt from the client assets: frame, rarity background and attribute badge.",
    diritti: (editore: string) =>
      `Images and names belong to ${editore} and are shown here for reference.`,
    ordine: "In global release order, newest first. Banners, dates and events:",
    uscite: "Releases",
  },
});

/**
 * I filtri della griglia (`?rarita=UR`, `?razza=3`...) non passano di qui: li
 * legge e li scrive roster-browser.tsx dall'indirizzo vivo. Letti qui, tornando
 * con Indietro arrivavano quelli del primo arrivo (11/10).
 */
interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? t.gioco),
    description: t.descrizione(entry?.name ?? t.questoGioco),
  };
}

export default async function HeroesPage({ params }: Props) {
  const { game } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const { roster, icons, releases, heroContext, heroAssets } = requireGameModule(game);
  // La voce di menu non compare senza roster, ma l'indirizzo si puo' digitare.
  if (!roster) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  // I nomi degli attributi si traducono qui, sul server: il componente client
  // riceve il roster gia' nella lingua giusta e non deve importare i nomi.
  //
  // I nomi e gli epiteti degli eroi NO, e non per dimenticanza: la ricerca deve
  // trovare un eroe in tutte e due le lingue, quindi ogni voce arriva al browser
  // con `name` inglese e `nameIt` italiano. Sostituire qui `name` con l'italiano
  // toglierebbe l'inglese dalla ricerca. Quale dei due mostrare lo sceglie
  // heroName nella griglia: una riga, su dati che la voce ha gia'.
  //
  // Razza e caratteristiche il roster generato non le porta: stanno nel contesto
  // degli eroi, e si aggiungono qui a ogni voce (un numero e una lista corta),
  // coi nomi nella lingua della pagina per i pulsanti. Si offrono solo i codici
  // che almeno un eroe ha e che il gioco sa nominare.
  const localized = {
    ...roster,
    affinities: roster.affinities.map((affinity) => ({
      ...affinity,
      label: affinityLabel(affinity.id, locale),
    })),
    heroes: heroContext
      ? roster.heroes.map((hero) => {
          const context = heroContext.heroes[hero.id];
          return context ? { ...hero, race: context.race, factions: context.factions } : hero;
        })
      : roster.heroes,
  };
  const present = (pick: (id: string) => readonly number[]) =>
    [...new Set(roster.heroes.flatMap((hero) => pick(hero.id)))].sort((a, b) => a - b);
  const traits = heroContext
    ? {
        races: present((id) => {
          const race = heroContext.heroes[id]?.race;
          return race != null ? [race] : [];
        }).flatMap((code) => {
          const label = inLingua(heroContext.codes.race[String(code)], locale);
          return label ? [{ code, label, iconKey: String(code) }] : [];
        }),
        factions: present((id) => heroContext.heroes[id]?.factions ?? []).flatMap((code) => {
          const label = inLingua(heroContext.codes.faction[String(code)], locale);
          return label ? [{ code, label }] : [];
        }),
      }
    : undefined;

  // Per il palco: volto e cima della sagoma di ogni eroe, e solo per le eccezioni (poche)
  // il tipo d'illustrazione e la mancanza del cut-in. Al browser arriva questo,
  // non l'elenco degli asset di tutti gli eroi
  const stageKinds: Record<string, StageArt["art"]> = {};
  const stageFigures: Record<string, StageArt["figure"]> = {};
  const withoutCutIn: string[] = [];
  for (const hero of roster.heroes) {
    const stage = stageArtOf(heroAssets?.[hero.id]);
    if (stage.art !== DEFAULT_STAGE_ART.art) stageKinds[hero.id] = stage.art;
    if (!stage.cutIn) withoutCutIn.push(hero.id);
    stageFigures[hero.id] = stage.figure;
  }

  const rarest = roster.rarities[0];
  const counted = roster.heroes.filter((hero) => hero.rarity === rarest).length;

  // Briciole e titolo nella colonna della griglia: il palco accanto parte
  // dall'alto della pagina (roster-browser.tsx, `intro`). Niente etichetta sopra
  // il titolo: la striscia del gioco e le briciole dicono gia' dove sei (10/10).
  const intro = (
    <div className="pt-6">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.eroi }]} />
      <PageHeader title={t.eroi}>
        <p>
          {t.introduzione(roster.heroes.length, counted, rarest ?? "")}{" "}
          {/*
            L'ordine di partenza e' quello d'uscita solo se il modulo ha il
            calendario: senza, dirlo "d'uscita" sarebbe falso.
          */}
          {releases ? (
            <>
              {t.ordine}{" "}
              <Link
                href={`/${game}/uscite`}
                className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-deep"
              >
                {t.uscite}
              </Link>
            </>
          ) : null}
        </p>
      </PageHeader>
    </div>
  );

  return (
    <main className="pb-20">
      <RosterBrowser
        intro={intro}
        game={game}
        roster={localized}
        icons={icons}
        traits={traits}
        art={stageKinds}
        figures={stageFigures}
        withoutCutIn={withoutCutIn}
      />

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        {t.card} {t.diritti(entry.publisher)}
      </p>
    </main>
  );
}
