import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { TeamRandomizer, type RandomizerHero } from "@/components/randomizer/team-randomizer";
import { HowItWorks, PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { heroEpithet, heroName } from "@/lib/games/heroes";
import { isCollab, unicaLeaders } from "@/lib/games/randomizer";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Randomizer: un pulsante, quattro eroi in campo e quattro nei loro Slot
 * associazione, pescati a caso; oppure coi quattro in campo in sinergia.
 *
 * Richiesta dell'utente del 27/09, precisata la stessa sera: la sinergia e' fra i
 * quattro in campo (le loro Uniche valgono l'una per l'altra), gli associati non
 * c'entrano; e una scelta per togliere le collaborazioni. Il sorteggio lo fa il
 * browser (e' un clic, e non deve passare dal server); qui si prepara quello che
 * gli serve: il roster nella lingua della pagina, con razza, caratteristiche e
 * attributo per sapere chi fa parte di un gruppo, le Uniche che nominano alleati
 * applicabili, e i legami per mostrare l'Effetto associazione quando capita. Le
 * regole stanno in src/lib/games/randomizer.ts.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Randomizer di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: quattro eroi e i loro eroi associati pescati a caso, anche con le Uniche dei quattro in campo in sinergia.`,
    titolo: "Randomizer",
    introduzione:
      "Premi «Pesca»: escono quattro eroi da mettere in campo e, sotto ognuno, l'eroe da mettere nel suo Slot associazione. Otto personaggi diversi, perché il gioco non ne accetta due uguali nella stessa squadra, nemmeno fra gli associati.",
    comeFunziona: "Come funziona",
    sinergia: (uniche: number) =>
      `Con «Sinergia» nessuna Unica resta senza i suoi alleati. Almeno tre dei quattro eroi in campo hanno un'Unica che nomina degli «alleati applicabili», e ognuna vale per tutti gli altri in campo; il quarto ha un'Unica così anche lui, oppure una non specifica (vale per tutti, o solo per lui) ed è fra gli alleati delle altre tre. Le Uniche che nominano alleati sono ${uniche}. Gli associati sono pescati a caso: la sinergia è fra i quattro in campo.`,
    esclusi:
      "Una razza o una caratteristica in comune da sola non conta: senza un'Unica che la nomini, in battaglia non fa niente. Another Ban e Another Meliodas per il gioco sono personaggi a parte, e possono uscire insieme a Ban e Meliodas.",
    collab: (eroi: number, personaggi: number) =>
      `«Senza collaborazioni» toglie da tutti e otto i posti gli eroi che il gioco segna come collaborazione: ${eroi} eroi, ${personaggi} personaggi.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Randomizer`,
    descrizione: (gioco: string) =>
      `${gioco}: four heroes and their associated heroes drawn at random, also with the Uniques of the four on the field in synergy.`,
    titolo: "Randomizer",
    introduzione:
      "Press «Draw»: four heroes come out to put on the field and, under each one, the hero for its Association Slot. Eight different characters, because the game doesn't accept the same one twice in a team, associates included.",
    comeFunziona: "How it works",
    sinergia: (uniche: number) =>
      `With «Synergy» no Unique is left without its allies. At least three of the four heroes on the field have a Unique that names some «Applicable Allies», and each one applies to all the others on the field; the fourth has such a Unique too, or a non-specific one (it applies to everyone, or only to the hero) and is among the other three's allies. ${uniche} Uniques name allies. Associates are drawn at random: the synergy is among the four on the field.`,
    esclusi:
      "A shared race or characteristic on its own doesn't count: unless a Unique names it, it does nothing in battle. Another Ban and Another Meliodas are separate characters for the game, and can come out together with Ban and Meliodas.",
    collab: (eroi: number, personaggi: number) =>
      `«No collaborations» removes from all eight slots the heroes the game marks as collaboration: ${eroi} heroes, ${personaggi} characters.`,
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

export default async function RandomizerPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const { roster, heroFates, heroTerms, heroAbilities, heroContext } = requireGameModule(game);
  // La voce di menu non compare senza legami, ma l'indirizzo si puo' digitare.
  if (!roster || !heroFates || !heroTerms || !heroAbilities || !heroContext) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const affinities = new Map(roster.affinities.map((affinity) => [affinity.id, affinity]));
  const heroes: RandomizerHero[] = roster.heroes.map((hero) => {
    const context = heroContext.heroes[hero.id];
    const affinity = affinities.get(hero.affinity);
    const passive = heroAbilities[hero.id]?.passive;
    return {
      id: hero.id,
      group: hero.group,
      name: heroName(hero, locale),
      epithet: heroEpithet(hero, locale),
      color: affinity?.color ?? null,
      unique: inLingua(passive?.nameI18n, locale) ?? passive?.name ?? null,
      race: context?.race ?? null,
      factions: context?.factions ?? [],
      attribute: context?.attribute ?? null,
    };
  });
  const leaders = unicaLeaders(heroAbilities, heroTerms);
  // Solo i gruppi che un'Unica nomina: gli altri al browser non servono.
  const groups = heroTerms.groups.map((group, i) => (leaders.some((leader) => leader.group === i) ? group : null));
  const collab = heroes.filter(isCollab);

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      {/* il titolo e cosa fa; poi subito il sorteggio, e le regole in fondo, chiuse (10/10) */}
      <PageHeader title={t.titolo}>
        <p>{t.introduzione}</p>
      </PageHeader>

      <TeamRandomizer game={game} heroes={heroes} leaders={leaders} groups={groups} fates={heroFates} />

      <HowItWorks summary={t.comeFunziona} className="mt-12 max-w-[1100px]">
        <p>{t.sinergia(new Set(leaders.map((leader) => leader.hero)).size)}</p>
        <p>{t.esclusi}</p>
        <p>{t.collab(collab.length, new Set(collab.map((hero) => hero.group)).size)}</p>
      </HowItWorks>
    </main>
  );
}
