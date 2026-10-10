import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { hasIcon } from "@/components/heroes/hero-parts";
import { TeamBuilder } from "@/components/team-builder/team-builder";
import type { BuilderData, BuilderHero } from "@/components/team-builder/team-labels";
import { HowItWorks, PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { heroEpithet, heroName } from "@/lib/games/heroes";
import { searchText } from "@/lib/games/hero-terms";
import { isCollab } from "@/lib/games/randomizer";
import { requireGameModule } from "@/lib/games/registry";
import { parseSetup, teamHeroesOf } from "@/lib/games/team";
import type { TeamIndex } from "@/lib/games/team-types";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Squadra: si formano quattro eroi e i loro associati, e il sito dice come si
 * influenzano con le passive (Unica, Reliquia sacra, abilita' speciali), e chi si
 * incastra meglio in un posto.
 *
 * Richiesta dell'utente del 03/10. Scelte sue, fra le anteprime: il resoconto
 * «per eroe: da' / riceve»; i suggerimenti «basandoti prettamente sulle passive e
 * su come i personaggi sinergizzano tra loro» (non la classe di combattimento,
 * non un ruolo delle carte); la scelta del contenuto, che spegne le passive che
 * li' non valgono; la squadra nell'indirizzo e nel browser.
 *
 * La squadra si forma nel browser, in tempo reale (team-builder.tsx); qui si
 * prepara quello che gli serve, nella lingua della pagina: il roster con razza,
 * caratteristiche, attributo e Unita', l'indice della squadra (team.generated.ts)
 * con le frasi solo nella lingua della pagina, i legami, i nomi dei codici. La
 * squadra di partenza la dice l'indirizzo, cosi' il primo disegno del server e
 * quello del browser coincidono.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Squadra di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: forma una squadra e guarda come si influenzano gli eroi con le Uniche, le Reliquie sacre e le abilità speciali, e chi si incastra meglio.`,
    titolo: "Squadra",
    introduzione:
      "Scegli quattro eroi e i loro associati: per ognuno il sito dice cosa dà ai compagni e cosa riceve da loro, con le Uniche, le Reliquie sacre, i Comandamenti, le Grazie e le Unità, e quali passive restano spente e perché. Per un posto libero suggerisce chi si incastra meglio con le passive degli altri.",
    comeFunziona: "Come funziona",
    lettura:
      "Le passive si leggono dal testo del gioco, frase per frase: a chi va l'effetto («alleati applicabili», «alleati Giganti», «tutti gli alleati») e quali compagni lo fanno scattare («per ogni alleato applicabile in battaglia», «se gli alleati in battaglia sono tutti Demoni»). Le razze e le caratteristiche lette nelle Uniche coincidono con i dati del client in 111 casi; nei 7 che non coincidono è il testo del gioco a nominarne di più.",
    suggerimenti:
      "I suggerimenti contano soltanto le passive: quanti effetti in più vanno ai compagni, quante passive in più si accendono, le condizioni «tutti» rispettate o rotte, le abilità speciali che si spengono a vicenda. È un conteggio, non un giudizio: non dice quanto vale un eroe.",
    panchina:
      "Chi è nello slot secondario non partecipa alla battaglia finché non entra: non conta per le condizioni dei compagni, e le sue passive aspettano, tranne quelle che il gioco segna «Si attiva anche in uno slot secondario». Il quarto eroe parte in panchina nella storia e nel PvP normale, in campo nei boss e nelle Bestie demoniache.",
    speciali:
      "Se in squadra ci sono due Comandamenti vale quello dell'eroe più a sinistra; due Grazie o due Unità dello stesso tipo, lo stesso. «Con un effetto Unità» vuol dire chi ha un'Unità fra le abilità speciali. Delle Reliquie sacre si conta la classica: un eroe che ne ha due ne attiva una alla volta.",
    frasi:
      "Le frasi sono quelle del gioco; dove la frase italiana non si appaia a quella inglese si legge l'inglese. «Alleati» comprende l'eroe stesso, salvo dove la frase dice il contrario.",
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Team Builder`,
    descrizione: (gioco: string) =>
      `${gioco}: build a team and see how the heroes affect each other with their Uniques, Holy Relics and special abilities, and who fits best.`,
    titolo: "Team Builder",
    introduzione:
      "Choose four heroes and their associates: for each one the site tells what it gives to its teammates and what it receives from them, with the Uniques, Holy Relics, Commandments, Graces and Unities, and which passives stay off and why. For a free slot it suggests who fits best with the others' passives.",
    comeFunziona: "How it works",
    lettura:
      "Passives are read from the game's text, sentence by sentence: who gets the effect («Applicable Allies», «Giant allies», «all allies») and which teammates trigger it («for each Applicable Ally participating in battle», «if allies in battle are all Demons»). The races and characteristics read in the Uniques match the client's data in 111 cases; in the 7 that don't, it's the game's text that names more.",
    suggerimenti:
      "Suggestions count only the passives: how many more effects go to teammates, how many more passives light up, the «all» conditions met or broken, the special abilities that turn each other off. It's a count, not a judgment: it doesn't say how good a hero is.",
    panchina:
      "The hero in the Sub slot doesn't take part in the battle until it enters: it doesn't count for its teammates' conditions, and its passives wait, except those the game marks «Active even in Sub slot». The fourth hero starts on the bench in the story and normal PvP, on the field in bosses and Demonic Beasts.",
    speciali:
      "If the team has two Commandments, the one of the hero furthest left applies; two Graces or two Unities of the same type, the same. «With a Unity effect» means whoever has a Unity among its special abilities. Of the Holy Relics the classic one counts: a hero that has two activates one at a time.",
    frasi:
      "The sentences are the game's own. «Allies» includes the hero itself, except where the sentence says otherwise.",
  },
});

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export default async function TeamPage({ params, searchParams }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const { roster, team, heroContext, heroSpecials, heroFates, mechanics, icons } = requireGameModule(game);
  // La voce di menu non compare senza la squadra, ma l'indirizzo si puo' digitare.
  if (!roster || !team || !heroContext || !heroFates) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const base = teamHeroesOf(roster.heroes, heroContext, heroSpecials);
  const affinities = new Map(roster.affinities.map((affinity) => [affinity.id, affinity]));
  const heroes: BuilderHero[] = roster.heroes.map((hero) => {
    const own = base.get(hero.id)!;
    return {
      ...own,
      name: heroName(hero, locale),
      epithet: heroEpithet(hero, locale),
      color: affinities.get(hero.affinity)?.color ?? null,
      collab: isCollab(own),
      search: searchText([hero.name, hero.nameIt, hero.epithet, hero.epithetIt].filter(Boolean).join(" ")),
    };
  });

  // Le frasi solo nella lingua della pagina: l'altra al browser non serve. In
  // italiano si tiene l'inglese dove la frase italiana non si e' appaiata.
  const localTeam: TeamIndex = {
    ...team,
    sentences: team.sentences.map((s) =>
      locale === "en" ? { it: null, en: s.en } : { it: s.it, en: s.it ? null : s.en },
    ),
  };

  const label = (codes: Readonly<Record<string, { it: string | null; en: string | null }>>) =>
    Object.fromEntries(Object.entries(codes).map(([code, value]) => [code, inLingua(value, locale) ?? code]));

  const data: BuilderData = {
    game,
    heroes,
    team: localTeam,
    fates: heroFates,
    labels: {
      race: label(heroContext.codes.race),
      attribute: label(heroContext.codes.attribute),
      faction: label(heroContext.codes.faction),
    },
    conditions: Object.fromEntries(
      Object.entries(heroContext.passiveConditions).map(([code, c]) => [
        code,
        { icon: c.icon, text: inLingua(c.description, locale) ?? "" },
      ]),
    ),
    specials: Object.fromEntries(
      Object.entries(heroSpecials?.kinds ?? {}).map(([kind, k]) => [
        kind,
        {
          label: inLingua(k.label, locale) ?? kind,
          rules: k.rules.map((rule) => inLingua(rule, locale)).filter((rule): rule is string => !!rule),
        },
      ]),
    ),
    lightDark: Object.fromEntries(
      Object.entries(mechanics?.teamEffects ?? {}).filter(([, effect]) => effect.light || effect.dark),
    ),
    stones: [1, 2, 3, 4, 5, 6].every((n) => hasIcon(icons, "carta", `pietra_${n}`)),
    conditionIcons: Object.values(heroContext.passiveConditions).every((c) => hasIcon(icons, "condizione", c.icon)),
  };

  const query = await searchParams;
  const first = (key: string) => {
    const value = query[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const initial = parseSetup(first, (id) => base.has(id));

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      {/* il titolo e cosa fa la pagina; poi subito la squadra, e il metodo in fondo, chiuso (10/10) */}
      <PageHeader title={t.titolo}>
        <p>{t.introduzione}</p>
      </PageHeader>

      <TeamBuilder data={data} initial={initial} />

      <HowItWorks summary={t.comeFunziona} className="mt-12 max-w-[1100px]">
        <p>{t.lettura}</p>
        <p>{t.suggerimenti}</p>
        <p>{t.panchina}</p>
        <p>{t.speciali}</p>
        <p>{t.frasi}</p>
      </HowItWorks>
    </main>
  );
}
