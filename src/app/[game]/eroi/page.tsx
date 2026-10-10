import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { DEFAULT_STAGE_ART, stageArtOf, type StageArt } from "@/components/heroes/hero-stage";
import { EMPTY_QUERY, RosterBrowser, type RosterQuery } from "@/components/heroes/roster-browser";
import { cx, display } from "@/components/ui";
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

interface Props {
  params: Promise<{ game: string }>;
  /**
   * I filtri della griglia (roster-browser.tsx li scrive mentre si cliccano):
   * `?razza=3`, `?caratteristica=6` ci portano anche le tendine delle parole blu
   */
  searchParams: Promise<{
    cerca?: string;
    razza?: string;
    caratteristica?: string;
    rarita?: string;
    attributo?: string;
    esce?: string;
    ordine?: string;
    miei?: string;
  }>;
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

export default async function HeroesPage({ params, searchParams }: Props) {
  const { game } = await params;
  const query = await searchParams;

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
  // un codice nell'indirizzo vale solo se e' fra quelli offerti
  const chosen = (value: string | undefined, offered: readonly { code: number }[] | undefined) =>
    offered?.find((item) => String(item.code) === value)?.code ?? null;

  // un valore dell'indirizzo vale solo se e' fra quelli che la griglia offre
  const one = (value: string | undefined, offered: readonly string[]) =>
    value !== undefined && offered.includes(value) ? value : null;
  const initial: RosterQuery = {
    ...EMPTY_QUERY,
    search: (query.cerca ?? "").slice(0, 80),
    rarity: one(query.rarita, roster.rarities),
    affinity: one(query.attributo, roster.affinities.map((a) => a.id)),
    obtainable: one(query.esce, roster.obtainable),
    race: chosen(query.razza, traits?.races),
    faction: chosen(query.caratteristica, traits?.factions),
    order: query.ordine === "name" || query.ordine === "group" ? query.ordine : "roster",
    mine: query.miei === "1",
  };

  // Per il palco: dove sta il volto di ogni eroe, e il tipo d'illustrazione solo
  // per chi non l'ha scontornata (poche). Al browser arriva questo, non l'elenco
  // degli asset di tutti gli eroi
  const stageKinds: Record<string, StageArt["art"]> = {};
  const stageFaces: Record<string, StageArt["face"]> = {};
  for (const hero of roster.heroes) {
    const stage = stageArtOf(heroAssets?.[hero.id]);
    if (stage.art !== DEFAULT_STAGE_ART.art) stageKinds[hero.id] = stage.art;
    stageFaces[hero.id] = stage.face;
  }

  const rarest = roster.rarities[0];
  const counted = roster.heroes.filter((hero) => hero.rarity === rarest).length;

  // Briciole e titolo nella colonna della griglia: il palco accanto parte
  // dall'alto della pagina (roster-browser.tsx, `intro`). Niente etichetta sopra
  // il titolo: la striscia del gioco e le briciole dicono gia' dove sei (10/10).
  const intro = (
    <div className="pt-6">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.eroi }]} />
      <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-brand pb-4">
        <h1 className={cx(display, "text-[clamp(34px,5vw,58px)]")}>{t.eroi}</h1>
        <p className="m-0 max-w-[48ch] text-sm text-ink-2">
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
      </header>
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
        initial={initial}
        art={stageKinds}
        faces={stageFaces}
      />

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        {t.card} {t.diritti(entry.publisher)}
      </p>
    </main>
  );
}
