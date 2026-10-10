import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { HeroChanges } from "@/components/changes/hero-changes";
import { HeroEndgameLine } from "@/components/endgame/hero-endgame";
import { GameText } from "@/components/heroes/game-text";
import { HeroAbilities } from "@/components/heroes/hero-abilities";
import { boxTitle, GameIcon, hasIcon, localized } from "@/components/heroes/hero-parts";
import { Relics } from "@/components/heroes/hero-relics";
import { HeroTermPopovers, termResolver } from "@/components/heroes/hero-terms";
import { HeroTabs, type HeroTab } from "@/components/heroes/hero-tabs";
import { StatCalculator } from "@/components/heroes/calculator/stat-calculator";
import { STAT_ROWS, formatStat } from "@/components/heroes/calculator/stat-rows";
import { HeroAssociations } from "@/components/heroes/hero-associations";
import { HeroCostumes } from "@/components/heroes/hero-costumes";
import { HeroArrowKeys } from "@/components/heroes/hero-arrow-keys";
import { IconArrowRight, IconChevronLeft, IconChevronRight } from "@/components/icons";
import { HeroStage, stageArtOf } from "@/components/heroes/hero-stage";
import { buttonClass, cx, eyebrow, MoreArrow, MoreLink, Notice, numeric, Tag } from "@/components/ui";
import { sliderData } from "@/lib/games/account-buff";
import type { AccountBuffIndex } from "@/lib/games/account-buff-types";
import { findGame } from "@/lib/games/catalog";
import { heroHistory } from "@/lib/games/changes";
import type { EndgameHeroLink } from "@/lib/games/endgame-types";
import { calculatorDataFor, type CalculatorData } from "@/lib/games/hero-build";
import { plainHeroText } from "@/lib/games/hero-markup";
import { gameIconSrc, heroCardSrc, heroEpithet, heroName, heroSplashSrc } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import type {
  HeroAffinity,
  HeroContext,
  HeroEffect,
  HeroEntry,
  HeroLabel,
  HeroRelease,
  HeroRelic,
  HeroRelicsIndex,
  HeroSpecialAbility,
  HeroSpecialsIndex,
  HeroStats,
} from "@/lib/games/types";
import { affinityLabel } from "@/lib/games/grand-cross/roster";
import { inLingua, intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    eroeNonTrovato: "Eroe non trovato",
    titoloPagina: (eroe: string, gioco: string) => `${eroe} · Eroi di ${gioco}`,
    descrizionePagina: (eroe: string, rarita: string, attributo: string, gioco: string) =>
      `${eroe}, eroe ${rarita} di attributo ${attributo} in ${gioco}.`,
    eroi: "Eroi",
    altCard: (eroe: string) => `Card di ${eroe}`,
    altriEroi: "Altri eroi",
    precedente: "Eroe precedente",
    successivo: "Eroe successivo",
    nelGioco: "Nel gioco:",
    attributo: "Attributo",
    raritaCampo: "Rarità",
    razza: "Razza",
    caratteristiche: "Caratteristiche",
    personaggio: "Personaggio",
    versioniPersonaggio: (personaggio: string) => `Tutte le versioni di ${personaggio} nella griglia Eroi`,
    uscitaGlobale: "Uscita globale",
    giapponeCorea: "Giappone e Corea",
    evoluzioneLr: "Evoluzione LR",
    nelCalendario: "Nel calendario",
    dalloStendardo: "Data dello stendardo di debutto nel gioco: il calendario non ha ancora la sua riga",
    festival: "Festival",
    altIllustrazione: (eroe: string) => `Illustrazione di ${eroe}`,
    descrizione: "Descrizione",
    senzaDescrizione:
      "Di questo eroe il client non porta una descrizione. Restano nome, rarità e attributo.",
    identificativo: "Identificativo",
    spiegaId: "è l’id del gioco: nomina anche il file della card e le sue voci di testo.",
    altreVersioni: (personaggio: string, quante: number) =>
      `Altre versioni di ${personaggio} · ${quante}`,
    crediti: (gioco: string, editore: string) =>
      `Testi e immagini provengono dal client di ${gioco} e appartengono a ${editore}.`,
    percorsoRarita: (da: string, a: string, puoArrivare: boolean) =>
      `esce come ${da}, ${puoArrivare ? "può arrivare a" : "arriva a"} ${a}`,
    statisticheTitolo: "Calcolatore delle statistiche",
    statisticheFonte:
      "Calcolate dalle tabelle del client, come le somma il gioco (SkinData.GetTotalStatWithoutPassive e GetApplyPassiveStat): base e crescita per livello, Risvegli, Super risvegli, Reliquia sacra, costumi registrati, e l’equipaggiamento pezzo per pezzo. Si parte da tutto al massimo, coi cinque costumi migliori per tipo e l’equipaggiamento PS/Difesa. Il Vero risveglio aggiunge resistenza ai danni e non tocca queste righe.",
    statisticheFonteMassimo:
      "Calcolate dalle tabelle del client: livello massimo, Risvegli, Super risvegli, Reliquia sacra e i cinque costumi migliori per tipo.",
    schede: "Parti della scheda",
    schedaAbilita: "Abilità",
    schedaStatistiche: "Statistiche",
    schedaReliquia: (quante: number): string => (quante > 1 ? "Reliquie" : "Reliquia"),
    schedaCostumi: "Costumi",
    schedaAssociazioni: "Associazioni",
    schedaInfo: "Info",
  },
  en: {
    eroeNonTrovato: "Hero not found",
    titoloPagina: (eroe: string, gioco: string) => `${eroe} · ${gioco} Heroes`,
    descrizionePagina: (eroe: string, rarita: string, attributo: string, gioco: string) =>
      `${eroe}, ${rarita} hero with the ${attributo} attribute in ${gioco}.`,
    eroi: "Heroes",
    altCard: (eroe: string) => `${eroe} card`,
    altriEroi: "Other heroes",
    precedente: "Previous hero",
    successivo: "Next hero",
    nelGioco: "In game:",
    attributo: "Attribute",
    raritaCampo: "Rarity",
    razza: "Race",
    caratteristiche: "Characteristics",
    personaggio: "Character",
    versioniPersonaggio: (personaggio: string) => `All versions of ${personaggio} in the Heroes grid`,
    uscitaGlobale: "Global release",
    giapponeCorea: "Japan and Korea",
    evoluzioneLr: "LR evolution",
    nelCalendario: "In the calendar",
    dalloStendardo: "Date of its debut banner in the game: the calendar doesn't have its row yet",
    festival: "Festival",
    altIllustrazione: (eroe: string) => `Illustration of ${eroe}`,
    descrizione: "Description",
    senzaDescrizione:
      "The client has no description for this hero. Name, rarity and attribute remain.",
    identificativo: "ID",
    spiegaId: "is the game's id: it also names the card file and its text entries.",
    altreVersioni: (personaggio: string, quante: number) =>
      `Other versions of ${personaggio} · ${quante}`,
    crediti: (gioco: string, editore: string) =>
      `Texts and images come from the ${gioco} client and belong to ${editore}.`,
    percorsoRarita: (da: string, a: string, puoArrivare: boolean) =>
      `starts as ${da}, ${puoArrivare ? "can reach" : "reaches"} ${a}`,
    statisticheTitolo: "Stats calculator",
    statisticheFonte:
      "Computed from the client's tables the way the game adds them up (SkinData.GetTotalStatWithoutPassive and GetApplyPassiveStat): base and growth per level, Awakenings, Super Awakenings, Holy Relic, registered costumes, and gear piece by piece. It starts with everything maxed, the five best costumes of each type and HP/Defense gear. True Awakening adds damage resistance and doesn't touch these rows.",
    statisticheFonteMassimo:
      "Computed from the client's tables: max level, Awakenings, Super Awakenings, Holy Relic and the five best costumes of each type.",
    schede: "Hero page sections",
    schedaAbilita: "Skills",
    schedaStatistiche: "Stats",
    schedaReliquia: (quante: number) => (quante > 1 ? "Holy Relics" : "Holy Relic"),
    schedaCostumi: "Costumes",
    schedaAssociazioni: "Associations",
    schedaInfo: "Info",
  },
});

/**
 * Scheda del singolo eroe.
 *
 * Dal 25/09 tutto viene dal client del gioco: nome, epiteto, attributo e testi,
 * ma anche carte, ultimate, passiva e statistiche, che prima venivano da 7dshub
 * perche' il legame eroe-abilita' stava nelle tabelle cifrate. Le statistiche
 * massime sono calcolate, e la pagina dice come. Quello che resta dedotto (quale
 * illustrazione e' di quale carta, la cornice di un Comandamento multiplo) lo
 * dice accanto alla cosa, invece di far sembrare tutto ugualmente certo.
 *
 * I TESTI SEGUONO LA LINGUA DELLA PAGINA. Il dataset li porta in due lingue -
 * `text` inglese e `textIt` italiano per ranghi, passiva e abilita' speciali,
 * `nameI18n` per i nomi, `i18n` per i testi dell'eroe - e la scelta si fa qui,
 * sul server, con le funzioni qui sotto. Dove l'italiano manca resta l'inglese,
 * e la nota "i testi restano in inglese" compare solo quando serve davvero:
 * quando l'eroe non ha `textsInItalian`.
 *
 * Renderizzata sul server: e' l'unico posto che legge i testi lunghi, e cosi'
 * non finiscono nel bundle di chi sfoglia soltanto la griglia.
 *
 * A SCHEDE DAL 26/09 (scelta dell'utente): l'intestazione in cima, sotto
 * Abilita', Statistiche, Reliquia e Info, una alla volta (`HeroTabs`). Prima era
 * una colonna sola di 4.600px a 1400 e 6.100 sul telefono. Le schede lunghe
 * stanno nei loro file in src/components/heroes/ (hero-abilities, hero-relics);
 * Statistiche e Info, corte, qui sotto. Una funzione nuova si aggiunge come una
 * voce in piu' di `tabs`, nel suo file.
 */

interface Props {
  params: Promise<{ game: string; heroId: string }>;
  /** `?scheda=statistiche`: la scheda da aprire, per i collegamenti da altre pagine */
  searchParams: Promise<{ scheda?: string | string[] }>;
}

/** Le abilita' speciali dell'eroe, risolte dall'indice: l'id serve per l'icona. */
function specialsOf(
  index: HeroSpecialsIndex | undefined,
  heroId: string,
): { id: string; ability: HeroSpecialAbility }[] {
  return (index?.heroes[heroId] ?? []).flatMap((id) => {
    const ability = index?.abilities[id];
    return ability ? [{ id, ability }] : [];
  });
}

/** Le Reliquie sacre dell'eroe, risolte dall'indice: l'id serve per l'immagine. */
function relicsOf(
  index: HeroRelicsIndex | undefined,
  heroId: string,
): { id: string; relic: HeroRelic }[] {
  return (index?.heroes[heroId] ?? []).flatMap((id) => {
    const relic = index?.relics[id];
    return relic ? [{ id, relic }] : [];
  });
}

/**
 * Le sole voci del glossario che l'eroe cita, invece del glossario intero.
 *
 * Le 460 voci arrivavano a ogni carta, a ogni blocco di effetti e alla passiva.
 * Sono componenti server, ma in sviluppo React mette nel payload le props dei
 * componenti server per i propri strumenti di debug: ogni scheda si portava
 * dietro tutto il glossario - 460 chiavi su 460, fra 280 e 505 KB di pagina per
 * l'86-89% script - per usarne una ventina.
 */
function glossaryFor(
  glossary: Readonly<Record<string, HeroEffect>> | undefined,
  context: HeroContext | undefined,
): Readonly<Record<string, HeroEffect>> | undefined {
  if (!glossary || !context) return undefined;

  const keys = new Set<string>();
  for (const card of Object.values(context.cards)) {
    for (const key of card.effects) keys.add(key);
    for (const list of Object.values(card.onlyAtRanks ?? {})) {
      for (const key of list) keys.add(key);
    }
  }

  return Object.fromEntries(
    [...keys].flatMap((key) => (glossary[key] ? [[key, glossary[key]] as const] : [])),
  );
}

function lookup(game: string, heroId: string) {
  const entry = findGame(game);
  if (!entry) return null;

  const gameModule = requireGameModule(game);
  const roster = gameModule.roster;
  if (!roster) return null;

  const hero = roster.heroes.find((candidate) => candidate.id === heroId);
  if (!hero) return null;

  return {
    entry,
    roster,
    hero,
    text: gameModule.heroTexts?.[heroId],
    assets: gameModule.heroAssets?.[heroId],
    abilities: gameModule.heroAbilities?.[heroId],
    stats: gameModule.heroStats?.[heroId],
    // Due cose e non una: il glossario vale per tutti gli eroi e si legge una
    // volta, il contesto e' di questo eroe soltanto.
    glossary: glossaryFor(gameModule.heroContext?.glossary, gameModule.heroContext?.heroes[heroId]),
    codes: gameModule.heroContext?.codes,
    passiveConditions: gameModule.heroContext?.passiveConditions,
    specials: specialsOf(gameModule.heroSpecials, heroId),
    specialKinds: gameModule.heroSpecials?.kinds,
    relics: relicsOf(gameModule.heroRelics, heroId),
    relicIndex: gameModule.heroRelics,
    release: gameModule.releases?.heroes[heroId],
    endgame: gameModule.endgameHeroes?.[heroId],
    // gruppo della bestia -> la chiave della sua pagina fra le Bestie demoniache,
    // per il nome della bestia nelle Reliquie sacre
    beastPages: Object.fromEntries((gameModule.creatureNest?.beasts ?? []).map((beast) => [beast.group, beast.key])),
    icons: gameModule.icons,
    accountBuff: gameModule.accountBuff,
    // il calcolatore: l'equipaggiamento, i costumi, i legami, e le statistiche di
    // tutti gli eroi per scegliere l'associato
    gear: gameModule.gear,
    costumes: gameModule.costumes,
    fates: gameModule.heroFates,
    allStats: gameModule.heroStats,
    // pesca delle carte A e B, effetto di squadra Luce/Oscurita', cumulo per le tendine
    mechanics: gameModule.mechanics,
    // le parole blu, e gli indici interi che servono alle loro tendine: gli
    // elenchi nominano le carte, le abilita' speciali e le reliquie degli ALTRI eroi
    heroTerms: gameModule.heroTerms,
    abilityIndex: gameModule.heroAbilities,
    specialIndex: gameModule.heroSpecials,
    contextIndex: gameModule.heroContext,
    // le patch in cui e' arrivato o cambiato, per la scheda Info
    changes: gameModule.changes
      ? { history: heroHistory(gameModule.changes, heroId), firstPatch: gameModule.changes.patches[0] }
      : undefined,
    context: gameModule.heroContext?.heroes[heroId],
    affinity: roster.affinities.find((item) => item.id === hero.affinity),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, heroId } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];
  const found = lookup(game, heroId);
  if (!found) return { title: t.eroeNonTrovato };

  const { hero, entry, text } = found;
  const name = heroName(hero, locale);
  const heroDescription = localized(text?.i18n?.description, text?.description, locale);
  const description = heroDescription
    ? plainHeroText(heroDescription)
    : t.descrizionePagina(name, hero.rarity, affinityLabel(hero.affinity, locale), entry.name);

  return {
    title: t.titoloPagina(name, entry.shortName),
    description: description.slice(0, 180),
  };
}

export default async function HeroPage({ params, searchParams }: Props) {
  const { game, heroId } = await params;
  const { scheda } = await searchParams;

  const found = lookup(game, heroId);
  if (!found) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const {
    entry,
    roster,
    hero,
    text,
    assets,
    abilities,
    stats,
    affinity,
    glossary,
    codes,
    passiveConditions,
    specials,
    specialKinds,
    relics,
    relicIndex,
    release,
    endgame,
    beastPages,
    context,
    icons,
    accountBuff,
    gear,
    costumes,
    fates,
    allStats,
    mechanics,
    heroTerms,
    abilityIndex,
    specialIndex,
    contextIndex,
    changes,
  } = found;

  /**
   * Razza e fazioni, coi nomi che il gioco da' ai propri codici.
   *
   * Sono i due assi su cui il gioco costruisce le sinergie di squadra - una
   * passiva che aiuta "gli alleati Umani" o "[Ragnarok]" parla di questi - e
   * fino a ora la scheda non li mostrava affatto.
   *
   * Dove il client non consegna il nome in nessuna delle due lingue si TACE:
   * "razza 5" non dice niente a nessuno, e inventare "Dea" perche' l'enum si
   * chiama GODDESS sarebbe una traduzione nostra spacciata per dato del gioco.
   */
  const label = (value: HeroLabel | undefined) => inLingua(value, locale);
  const raceLabel = context?.race != null ? label(codes?.race[String(context.race)]) : null;
  const factionLabels = (context?.factions ?? [])
    .map((code) => label(codes?.faction[String(code)]))
    .filter((value): value is string => value !== null);

  // Lo stesso personaggio esiste in piu' versioni: e' il tratto che definisce
  // questo gioco, e da una scheda e' la cosa che si vuole di piu' dopo averla
  // letta. Meglio qui che una ricerca a mano nella griglia.
  const others = roster.heroes.filter(
    (candidate) => candidate.group === hero.group && candidate.id !== hero.id,
  );

  // Nome, epiteto e testi dell'eroe nella lingua della pagina: nome ed epiteto
  // dal roster, titolo e descrizione dal client, e dove una lingua manca l'altra.
  const name = heroName(hero, locale);
  // l'eroe prima e dopo nell'ordine della griglia (l'uscita)
  const position = roster.heroes.findIndex((entry) => entry.id === hero.id);
  const prev = position > 0 ? roster.heroes[position - 1] : undefined;
  const next = position >= 0 && position < roster.heroes.length - 1 ? roster.heroes[position + 1] : undefined;
  const title = localized(text?.i18n?.title, text?.title, locale);
  const description = localized(text?.i18n?.description, text?.description, locale);

  // Le parole blu: quale tendina apre ognuna, e quali tendine servono alla
  // pagina. I testi sono quelli inglesi (il legame e' su quelli) di tutto
  // quello che la pagina mostra, anche i ranghi e le versioni nascosti: si
  // scelgono coi pulsanti, e le loro parole devono aprire qualcosa.
  const terms = heroTerms ? termResolver(heroTerms) : null;
  const termTargets = new Set(
    terms
      ? [
          ...(abilities?.cards ?? []).flatMap((card) => card.ranks.map((rank) => rank.text)),
          ...(abilities?.ultimate?.ranks ?? []).map((rank) => rank.text),
          ...(abilities?.passive?.text ? [abilities.passive.text] : []),
          ...(abilities?.passive?.ultimateSteps ?? []).map((step) => step.text),
          ...specials.flatMap(({ ability }) => [ability.text, ...(ability.ultimateSteps ?? []).map((step) => step.text)]),
          ...relics.flatMap(({ relic }) => (relic.passive?.text.en ? [relic.passive.text.en] : [])),
        ].flatMap(terms.targetsOf)
      : [],
  );

  // Il calcolatore: i dati di questo eroe soltanto, e di ogni altro eroe quanto
  // basta a sceglierlo come associato
  const calculator = calculatorDataFor({
    heroId: hero.id,
    steps: stats?.steps,
    gear,
    costumes,
    relics,
    fates,
    roster: roster.heroes.map((entry) => ({
      id: entry.id,
      rarity: entry.rarity,
      obtainedAs: entry.obtainedAs,
      // l'epiteto distingue le versioni: «Demone Meliodas» sono tre eroi diversi
      name: [heroName(entry, locale), heroEpithet(entry, locale)].filter(Boolean).join(" · "),
    })),
    heroStats: allStats,
  });

  // Le schede, nell'ordine in cui compaiono. Una scheda senza niente da dire
  // non c'e': 80 eroi non hanno una reliquia, e una scheda vuota da aprire per
  // scoprirlo farebbe perdere tempo. Info c'e' sempre: nome, id e altre
  // versioni li ha ogni eroe.
  const tabs: HeroTab[] = [];
  if (
    (abilities?.cards.length ?? 0) > 0 ||
    (assets?.cards ?? 0) > 0 ||
    abilities?.ultimate ||
    abilities?.passive?.text ||
    assets?.skill ||
    specials.length > 0
  ) {
    tabs.push({
      key: "abilita",
      label: t.schedaAbilita,
      content: (
        <HeroAbilities
          game={game}
          locale={locale}
          heroId={hero.id}
          abilities={abilities}
          assets={assets}
          context={context}
          glossary={glossary}
          passiveConditions={passiveConditions}
          specials={specials}
          specialKinds={specialKinds}
          icons={icons}
          termIds={terms?.ids}
          draw={mechanics?.draw[hero.id]}
          teamEffect={mechanics?.teamEffects[hero.id]}
        />
      ),
    });
  }
  if (stats) {
    tabs.push({
      key: "statistiche",
      label: t.schedaStatistiche,
      content: (
        <Stats game={game} stats={stats} locale={locale} icons={icons} accountBuff={accountBuff} calculator={calculator} />
      ),
    });
  }
  if (relics.length > 0) {
    tabs.push({
      key: "reliquia",
      label: t.schedaReliquia(relics.length),
      content: (
        <Relics
          game={game}
          locale={locale}
          relics={relics}
          index={relicIndex}
          conditions={passiveConditions}
          icons={icons}
          beastPages={beastPages}
          termIds={terms?.ids}
        />
      ),
    });
  }
  if (gear && costumes?.heroes[hero.id]) {
    tabs.push({
      key: "costumi",
      label: t.schedaCostumi,
      content: <HeroCostumes game={game} locale={locale} heroId={hero.id} costumes={costumes} icons={gear.icons} />,
    });
  }
  if (fates) {
    tabs.push({
      key: "associazioni",
      label: t.schedaAssociazioni,
      content: <HeroAssociations game={game} locale={locale} hero={hero} name={name} fates={fates} roster={roster.heroes} />,
    });
  }
  tabs.push({
    key: "info",
    label: t.schedaInfo,
    content: (
      <HeroInfo
        game={game}
        locale={locale}
        hero={hero}
        name={name}
        title={title}
        description={description}
        splash={assets?.splash ?? false}
        endgame={endgame}
        icons={icons}
        others={others}
        changes={
          changes?.firstPatch ? (
            <HeroChanges
              game={game}
              locale={locale}
              history={changes.history}
              firstPatch={changes.firstPatch}
              heroes={new Map(roster.heroes.map((entry) => [entry.id, entry]))}
            />
          ) : null
        }
      />
    ),
  });

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.eroi, href: `/${game}/eroi` },
          { label: name },
        ]}
      />

      {/*
        `group/scheda` e' l'antenato comune di ultimate e passiva: il rango si
        sceglie in una sezione e la passiva che ne dipende sta in un'altra.
      */}
      <article className="group/scheda">
        {/*
          L'intestazione resta sopra le schede, qualunque sia aperta: chi e',
          che rarita', quando e' uscito. Dal 10/10 e' un palco (hero-stage.tsx):
          l'illustrazione grande, che prima stava nell'ultima scheda a 340px, e
          il nome in targa. Sotto, la fascia dei dati (HeroFacts); in alto a
          destra l'eroe prima e dopo nell'ordine della griglia (anche coi tasti
          freccia).
        */}
        <header className="mb-5">
          <div className="relative">
            <HeroStage
              game={game}
              hero={hero}
              locale={locale}
              affinity={affinity}
              size="hero"
              priority
              headingLevel="h1"
              art={stageArtOf(assets)}
              className="p5-corner"
            />
            {prev || next ? (
              <nav aria-label={t.altriEroi} className="absolute top-3 right-3 z-10 flex gap-1.5">
                {prev ? (
                  <Link href={`/${game}/eroi/${prev.id}`} rel="prev" title={`${t.precedente}: ${heroName(prev, locale)}`} className={buttonClass("outline", "sm")}>
                    <IconChevronLeft />
                    <span className="sr-only">{t.precedente}: {heroName(prev, locale)}</span>
                  </Link>
                ) : null}
                {next ? (
                  <Link href={`/${game}/eroi/${next.id}`} rel="next" title={`${t.successivo}: ${heroName(next, locale)}`} className={buttonClass("outline", "sm")}>
                    <span className="sr-only">{t.successivo}: {heroName(next, locale)}</span>
                    <IconChevronRight />
                  </Link>
                ) : null}
              </nav>
            ) : null}
            <HeroArrowKeys game={game} heroId={hero.id} prev={prev ? `/${game}/eroi/${prev.id}` : null} next={next ? `/${game}/eroi/${next.id}` : null} />
          </div>

          <HeroFacts
            game={game}
            locale={locale}
            icons={icons}
            hero={hero}
            affinity={affinity}
            race={context?.race != null && raceLabel ? { code: String(context.race), label: raceLabel } : null}
            factions={factionLabels}
            canReachLr={context?.rarity.canReachLr ?? false}
            release={release}
          />
        </header>

        <HeroTabs tabs={tabs} initial={typeof scheda === "string" ? scheda : undefined} label={t.schede} />

        {/*
          Le tendine delle parole blu stanno fuori dalle schede: una scheda
          chiusa e' display:none, e una tendina dentro non si potrebbe aprire
          da nessuna parte. Aperte stanno nel top layer, quindi il loro posto
          nel documento non conta.
        */}
        {heroTerms ? (
          <HeroTermPopovers
            game={game}
            locale={locale}
            heroId={hero.id}
            targets={termTargets}
            index={heroTerms}
            heroes={roster.heroes}
            context={contextIndex}
            abilities={abilityIndex}
            specials={specialIndex}
            relics={relicIndex}
            stacking={mechanics?.stacking}
          />
        ) : null}
      </article>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        {t.crediti(entry.name, entry.publisher)}
      </p>
    </main>
  );
}

/**
 * La scheda «Info»: illustrazione, descrizione, il titolo nel gioco, i legami
 * con l'Endgame, l'id, e le altre versioni del personaggio.
 *
 * Fino al 26/09 illustrazione e descrizione stavano in cima alla pagina, fra
 * l'intestazione e le carte: 360px d'immagine con la descrizione accanto e poi
 * niente, prima di arrivare a quello per cui la scheda si apre. Qui sono la
 * parte "chi e'", insieme al resto che non si consulta a ogni visita.
 */
function HeroInfo({
  game,
  locale,
  hero,
  name,
  title,
  description,
  splash,
  endgame,
  icons,
  others,
  changes,
}: {
  game: string;
  locale: Locale;
  hero: HeroEntry;
  name: string;
  title: string | undefined;
  description: string | undefined;
  splash: boolean;
  endgame: readonly EndgameHeroLink[] | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  others: readonly HeroEntry[];
  /** la sezione dei cambiamenti di patch, gia' pronta */
  changes: React.ReactNode;
}) {
  const t = TESTI[locale];

  return (
    <>
      <div className={cx("grid items-start gap-6", splash && "@2xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]")}>
        {/*
          L'illustrazione e' collegata all'eroe con certezza: il suo heroId
          e' scritto nel nome del file. Le icone dei ritratti no, e infatti
          non compaiono qui - lo slug restringe al personaggio ma non alla
          variante, e una posa sbagliata su una scheda non si nota finche'
          non la guarda qualcuno che conosce il personaggio.
        */}
        {splash ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroSplashSrc(game, hero.id)}
            alt={t.altIllustrazione(name)}
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full max-w-[340px] rounded-card border border-rule bg-paper-2"
          />
        ) : null}

        <div className="grid min-w-0 gap-5">
          {description ? (
            <div>
              <h3 className={cx(eyebrow, "mb-2.5")}>{t.descrizione}</h3>
              <GameText text={description} className="max-w-[48ch] text-[15px] leading-relaxed" />
            </div>
          ) : (
            <Notice>{t.senzaDescrizione}</Notice>
          )}

          {title && title !== name ? (
            // Un <div> e non un <p>: GameText disegna un <div> di <p>, e un <p>
            // dentro un <p> non e' HTML valido. Il browser chiudeva il primo in
            // anticipo, l'albero non combaciava piu' con quello del server e
            // ogni scheda con un titolo nel gioco dava un errore di hydration:
            // le "5 Issues" del pallino di Next.
            <div className="text-sm text-ink-2">
              {t.nelGioco} <GameText text={title} className="inline [&>p]:inline" />
            </div>
          ) : null}

          <HeroEndgameLine game={game} locale={locale} links={endgame} icons={icons} />

          <div>
            <h3 className={cx(eyebrow, "mb-1.5")}>{t.identificativo}</h3>
            <p className={cx(numeric, "m-0 text-sm text-ink-2")}>
              {hero.id}
              <span className="ml-2 font-body text-[13px] text-ink-3">{t.spiegaId}</span>
            </p>
          </div>
        </div>
      </div>

      {changes}

      {others.length > 0 ? (
        <section className="mt-7 border-t border-rule-2 pt-5">
          <h3 className={cx(eyebrow, "mb-3")}>{t.altreVersioni(hero.group, others.length)}</h3>
          <ul
            className="m-0 grid list-none gap-x-3 gap-y-4 p-0"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 116px))" }}
          >
            {others.map((other) => (
              <Sibling key={other.id} game={game} locale={locale} hero={other} />
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

/**
 * Il valore di un dato della fascia: stretto e maiuscolo come le voci dei menu,
 * un gradino sopra l'etichetta che lo nomina. Senza colore: lo sceglie chi lo
 * usa (bianco il dato, rosso il collegamento).
 */
const factValue =
  "font-display text-[15px] font-extrabold uppercase leading-tight tracking-[0.02em] [font-variation-settings:'wdth'_85]";

/**
 * Le celle della fascia: una griglia di riquadri divisi da un filo. Il filo e'
 * il fondo della griglia che passa fra le celle (`gap-px`), non un bordo per
 * cella: cosi' c'e' solo fra due celle, mai doppio, e la cella sola dell'ultima
 * riga si allarga alle due colonne invece di lasciare un buco grigio.
 * Sul telefono due colonne; dalla larghezza di un tablet (`@xl` sulla fascia)
 * una riga sola, celle larghe uguali.
 */
const factGrid =
  "m-0 grid grid-cols-2 gap-px bg-rule @xl:grid-flow-col @xl:auto-cols-fr @xl:grid-cols-none @max-xl:[&>div:last-child:nth-child(odd)]:col-span-2";

/** Un dato: il suo nome sopra, il valore sotto. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 bg-paper-2 px-3.5 py-3">
      <dt className={eyebrow}>{label}</dt>
      <dd className="m-0 mt-1.5">{children}</dd>
    </div>
  );
}

/**
 * La fascia dei dati sotto il palco: attributo, rarita', razza,
 * caratteristiche, personaggio, e sotto le uscite col calendario.
 *
 * Fino al 10/10 era una fila di icone e pastiglie senza nomi (l'icona
 * dell'attributo, due icone di rarita', «DEMONE», «COMANDAMENTI», «Derieri»)
 * seguita da una riga di date, e sul telefono andava a capo dove capitava: chi
 * non conosce il gioco non sapeva cosa fosse «Derieri» accanto a «Demone».
 * Ora ogni dato ha il suo nome sopra, come in una scheda, e sul telefono le
 * celle stanno in due colonne fisse.
 */
function HeroFacts({
  game,
  locale,
  icons,
  hero,
  affinity,
  race,
  factions,
  canReachLr,
  release,
}: {
  game: string;
  locale: Locale;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  hero: HeroEntry;
  affinity: HeroAffinity | undefined;
  race: { code: string; label: string } | null;
  factions: readonly string[];
  canReachLr: boolean;
  release: HeroRelease | undefined;
}) {
  const t = TESTI[locale];

  return (
    <div className="@container mt-3 border border-rule bg-paper-2">
      <dl className={factGrid}>
        {/*
          L'attributo con l'icona del gioco: chi gioca la riconosce prima di
          leggere, e il nome accanto la spiega a chi non gioca (l'icona e'
          decorativa, il nome lo dice il testo). Tristan no - il gioco non ha
          un'icona per l'attributo doppio - e per lui resta il quadrato
          bicolore, che il progetto disegna da se'.
        */}
        <Fact label={t.attributo}>
          {affinity?.iconKey && hasIcon(icons, "attributo", affinity.iconKey) ? (
            <span className={cx(factValue, "flex items-center gap-2 text-ink")}>
              <GameIcon game={game} family="attributo" iconKey={affinity.iconKey} label="" size={26} className="shrink-0" />
              {affinityLabel(affinity.id, locale)}
            </span>
          ) : (
            <AffinityTag affinity={affinity} fallback={hero.affinity} locale={locale} />
          )}
        </Fact>

        {/*
          "LR" da solo era comodo e falso. Il numero da cui viene - il
          `rating` del gioco - e' il TETTO che l'eroe puo' raggiungere, non la
          rarita' che ha adesso: un eroe che esce SSR e arriva a LR non e' un
          LR, lo diventa. Lo dicono l'enum RatingType del client (UR=6, LR=7),
          la colonna hero_lr_special che esiste, e le statistiche massime dei
          32 eroi con rating 7, che sono quelle di un UR. Qui si scrive quello
          che il dato dice davvero.
        */}
        <Fact label={t.raritaCampo}>
          <RarityPath game={game} locale={locale} icons={icons} from={hero.obtainedAs} to={hero.rarity} canReachLr={canReachLr} />
        </Fact>

        {/*
          La razza tiene icona E testo: i sei simboli sono meno familiari delle
          sigle di rarita', e da soli direbbero poco a chi arriva da una
          ricerca senza conoscere il gioco.
        */}
        {race ? (
          <Fact label={t.razza}>
            <span className={cx(factValue, "flex items-center gap-2 text-ink")}>
              {hasIcon(icons, "razza", race.code) ? (
                <GameIcon game={game} family="razza" iconKey={race.code} label="" size={22} className="shrink-0" />
              ) : null}
              {race.label}
            </span>
          </Fact>
        ) : null}

        {/*
          Le caratteristiche (le fazioni) restano testo: il gioco non ha
          un'icona per loro. Cercata su ogni pista - la famiglia icon_filter_*,
          icon_job, icon_group, icon_category, hero_category, characteristic,
          emblem e i nomi delle nove fazioni - zero risultati. Una per riga:
          sono al massimo due, e certi nomi sono lunghi.
        */}
        {factions.length > 0 ? (
          <Fact label={t.caratteristiche}>
            {factions.map((value) => (
              <span key={value} className={cx(factValue, "block text-ink [&+&]:mt-1")}>
                {value}
              </span>
            ))}
          </Fact>
        ) : null}

        {/* il personaggio porta alla griglia cercata per nome: tutte le sue versioni */}
        <Fact label={t.personaggio}>
          <Link
            href={`/${game}/eroi?cerca=${encodeURIComponent(hero.group)}`}
            title={t.versioniPersonaggio(hero.group)}
            className={cx(factValue, "group/more inline-flex items-center gap-1.5 text-brand-deep no-underline hover:text-ink")}
          >
            {hero.group}
            <MoreArrow />
          </Link>
        </Fact>
      </dl>

      {release ? <ReleaseFacts game={game} release={release} locale={locale} /> : null}
    </div>
  );
}

/**
 * Quando e' uscito: globale, Giappone e Corea, e il collegamento alla sua riga
 * nel calendario. Le date sono dati come gli altri della fascia: una cella
 * ciascuna, col nome sopra.
 *
 * Il globale prima: e' il server di chi legge in italiano. Le due date e non
 * una: fino a novembre 2024 il globale arrivava mesi dopo il Giappone, e in un
 * altro ordine (i 52 eroi del lancio giapponese, 4 giugno 2019, sono fra i 60
 * del lancio globale, 2 marzo 2020). Da allora escono lo stesso giorno, di
 * solito il giovedi' (Odino il mercoledi' prima, nel globale). Le date sono
 * quelle delle righe del calendario:
 * fino al 26/09 quella globale veniva da 7dshub, che scrive spesso il lunedi'
 * dove il foglio scrive il martedi', e in qualche caso sbaglia di mesi
 * (Cardinal Helbram: marzo 2023 contro agosto 2020).
 */
function ReleaseFacts({ game, release, locale }: { game: string; release: HeroRelease; locale: Locale }) {
  const t = TESTI[locale];
  const format = new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const days: { key: string; label: string; value: string }[] = [];
  if (release.global) days.push({ key: "gb", label: t.uscitaGlobale, value: release.global });
  if (release.jp) days.push({ key: "jp", label: t.giapponeCorea, value: release.jp });
  const lr = release.lrGlobal ?? release.lrJp;
  if (lr) days.push({ key: "lr", label: t.evoluzioneLr, value: lr });
  // La riga nel calendario globale, che e' quello da cui la pagina parte; se
  // l'eroe li' non c'e', quella giapponese.
  const calendar = release.updateGlobal
    ? `/${game}/uscite#u-${release.updateGlobal}`
    : release.updateJp
      ? `/${game}/uscite?server=giappone#u-${release.updateJp}`
      : null;
  if (days.length === 0 && !calendar) return null;

  return (
    <div className="border-t border-rule @xl:flex @xl:items-center">
      {days.length > 0 ? (
        // largo quanto le sue celle, non quanto la fascia: le date sono corte,
        // e allargate a tutta riga si allontanerebbero dai loro nomi
        <dl className={cx(factGrid, "@xl:border-r @xl:border-rule")}>
          {days.map((item, index) => (
            <Fact key={item.key} label={item.label}>
              <span className="flex flex-wrap items-center gap-2">
                <time dateTime={item.value} className={cx(numeric, "text-[15px] font-medium text-ink")}>
                  {format.format(new Date(`${item.value}T00:00:00Z`))}
                </time>
                {/* il Festival e' un modo d'uscita: sta con la prima data */}
                {index === 0 && release.festival ? <Tag tone="gold">{t.festival}</Tag> : null}
              </span>
            </Fact>
          ))}
        </dl>
      ) : null}
      {calendar ? (
        <p className={cx("m-0 px-3.5 py-3 @xl:ml-auto", days.length > 0 && "@max-xl:border-t @max-xl:border-rule")}>
          <MoreLink href={calendar}>{t.nelCalendario}</MoreLink>
        </p>
      ) : release.banner ? (
        // senza riga nel calendario la data viene dal client: si dice da dove
        <p
          className={cx(
            "m-0 max-w-[48ch] px-3.5 py-3 text-[13px] text-ink-2 @xl:ml-auto",
            days.length > 0 && "@max-xl:border-t @max-xl:border-rule",
          )}
        >
          {t.dalloStendardo}
        </p>
      ) : null}
    </div>
  );
}

/** La rarita': l'icona del gioco dove c'e', la sigla dove manca. */
function Rarity({
  game,
  icons,
  rarity,
}: {
  game: string;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  rarity: string;
}) {
  if (!hasIcon(icons, "rarita", rarity)) {
    return <Tag tone={rarity === "LR" ? "gold" : "brand"}>{rarity}</Tag>;
  }
  return <GameIcon game={game} family="rarita" iconKey={rarity} label={rarity} size={30} />;
}

/**
 * Da dove parte l'eroe e dove puo' arrivare: le due icone con una freccia, e
 * sotto la stessa cosa in parole.
 *
 * Le parole servono: due icone nude non dicono quale delle due sia la rarita'
 * d'uscita e quale il tetto - ed e' esattamente l'affermazione che questa
 * scheda prima sbagliava, dichiarando "LR" un eroe che LR puo' soltanto
 * diventarlo. Dal 10/10 si vedono («esce come SR, arriva a UR»): prima stavano
 * solo nel `title` e nell'`aria-label`, e chi non passava col mouse leggeva
 * due sigle e una freccia. Le icone, con le parole sotto, sono decorative.
 *
 * Quando partenza e tetto coincidono - 17 eroi escono UR e UR restano - resta
 * l'icona sola, col suo nome: "UR -> UR" e' una relazione che non dice niente.
 */
function RarityPath({
  game,
  locale,
  icons,
  from,
  to,
  canReachLr,
}: {
  game: string;
  locale: Locale;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  from: string;
  to: string;
  canReachLr: boolean;
}) {
  const t = TESTI[locale];
  if (from === to) return <Rarity game={game} icons={icons} rarity={from} />;

  return (
    <>
      <span aria-hidden className="flex items-center gap-1.5">
        <Rarity game={game} icons={icons} rarity={from} />
        <IconArrowRight className="shrink-0 text-ink-3" />
        <Rarity game={game} icons={icons} rarity={to} />
      </span>
      <span className="mt-1 block text-[12px] leading-snug text-ink-2">{t.percorsoRarita(from, to, canReachLr)}</span>
    </>
  );
}

function AffinityTag({
  affinity,
  fallback,
  locale,
}: {
  affinity: HeroAffinity | undefined;
  fallback: string;
  locale: Locale;
}) {
  if (!affinity) return <Tag>{affinityLabel(fallback, locale)}</Tag>;

  return (
    <span
      className={cx(
        "inline-flex h-5 items-center px-[7px] text-white",
        "font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em]",
      )}
      style={{
        background: affinity.colorAlt
          ? `linear-gradient(135deg, ${affinity.color} 50%, ${affinity.colorAlt} 50%)`
          : affinity.color,
      }}
    >
      {affinityLabel(affinity.id, locale)}
    </span>
  );
}

/**
 * Le statistiche dell'eroe: dal 27/09 il calcolatore (scelta dell'utente), con
 * livello e risvegli come lo slider di prima, l'equipaggiamento pezzo per pezzo
 * coi set pronti, i costumi registrati, l'associato e l'account; la tabella dice
 * senza, con e differenza. Lo disegna StatCalculator nel browser coi dati di
 * questo eroe (calculatorDataFor). Se il dataset non ha i pezzi resta la tabella
 * del massimo.
 *
 * La colonna con l'equipaggiamento era stata tolta il 15/09: allora era lo stesso
 * pacchetto per tutti gli eroi (quello di 7dshub), e non diceva niente dell'eroe.
 * Ora l'equipaggiamento si sceglie, e PS/Difesa al massimo ridà quel numero.
 *
 * Stava in fondo alla pagina, dopo reliquia e altre versioni: sul telefono a
 * 5.000px dall'alto. Dal 26/09 e' la seconda scheda, subito dopo le abilita',
 * che restano la prima perche' sono il motivo per cui la pagina si apre.
 */
function Stats({
  game,
  stats,
  locale,
  icons,
  accountBuff,
  calculator,
}: {
  game: string;
  stats: HeroStats | undefined;
  locale: Locale;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  accountBuff: AccountBuffIndex | undefined;
  calculator: CalculatorData | null;
}) {
  if (!stats) return null;
  const t = TESTI[locale];
  // Le stelle del Risveglio sono le stesse dei ranghi delle carte: il gioco usa
  // una stella gialla per tutti e due.
  const star = hasIcon(icons, "carta", "stella") ? gameIconSrc(game, "carta", "stella") : undefined;
  // e il rango dell'ultimate, per la classe di combattimento, con le pietre della
  // sua cornice: tutte e sei o nessuna, come nelle carte
  const gems = [1, 2, 3, 4, 5, 6].every((rank) => hasIcon(icons, "carta", `pietra_${rank}`))
    ? [1, 2, 3, 4, 5, 6].map((rank) => gameIconSrc(game, "carta", `pietra_${rank}`))
    : undefined;
  // i risvegli con le insegne del gioco: la stella rossa del Super risveglio, le due
  // sfere del Vero risveglio (Re Demone, Divinita' Suprema)
  const superStar = hasIcon(icons, "risveglio", "super_stella") ? gameIconSrc(game, "risveglio", "super_stella") : undefined;
  const exceed = [1, 2].every((n) => hasIcon(icons, "risveglio", `vero_${n}`))
    ? ([gameIconSrc(game, "risveglio", "vero_1"), gameIconSrc(game, "risveglio", "vero_2")] as const)
    : undefined;

  return (
    <section>
      {/* il titolo del calcolatore, come quelli dei riquadri delle altre schede */}
      <h3 className={cx(boxTitle, "mb-3")}>{t.statisticheTitolo}</h3>
      {calculator ? (
        <StatCalculator
          game={game}
          data={calculator}
          starSrc={star}
          superStarSrc={superStar}
          trueAwakeningSrcs={exceed}
          // i buff dell'account ridotti ai totali: poche centinaia di numeri invece delle 1.463 pietre
          account={accountBuff ? sliderData(accountBuff, game, locale) : undefined}
          accountHref={`/${game}/buff-account`}
          gemSrcs={gems}
        />
      ) : (
        <MaxTable max={stats.max} locale={locale} />
      )}
      <p className="mt-3 max-w-[48ch] text-[13px] text-ink-3">
        {calculator ? t.statisticheFonte : t.statisticheFonteMassimo}
      </p>
    </section>
  );
}

/** Il massimo senza equipaggiamento, quando il dataset non ha i pezzi del calcolatore. */
function MaxTable({ max, locale }: { max: Readonly<Record<string, number>>; locale: Locale }) {
  return (
    <table className="w-full max-w-[460px] border-collapse text-[13px]">
      <tbody>
        {STAT_ROWS.filter((row) => !row.extra && max[row.key] !== undefined).map((row) => (
          <tr key={row.key} className="border-b border-rule/60">
            <td className="py-1.5 pr-3 text-ink-2">{row.label[locale]}</td>
            <td className={cx(numeric, "py-1.5 text-right font-medium")}>
              {formatStat(max[row.key]!, locale)}
              {row.percent ? "%" : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Sibling({ game, locale, hero }: { game: string; locale: Locale; hero: HeroEntry }) {
  return (
    <li className="min-w-0">
      <Link href={`/${game}/eroi/${hero.id}`} className="group block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroCardSrc(game, hero.id)}
          srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
          alt=""
          width={128}
          height={128}
          loading="lazy"
          className="block w-full bg-paper-2"
        />
        <p className="m-0 mt-1.5 text-[12px] font-semibold leading-tight group-hover:text-brand-deep">
          {heroName(hero, locale)}
        </p>
      </Link>
    </li>
  );
}
