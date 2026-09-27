import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { HeroEndgameLine } from "@/components/endgame/hero-endgame";
import { GameText } from "@/components/heroes/game-text";
import { HeroAbilities } from "@/components/heroes/hero-abilities";
import { GameIcon, hasIcon, localized } from "@/components/heroes/hero-parts";
import { Relics } from "@/components/heroes/hero-relics";
import { HeroTermPopovers, termResolver } from "@/components/heroes/hero-terms";
import { HeroTabs, type HeroTab } from "@/components/heroes/hero-tabs";
import { StatCalculator } from "@/components/heroes/calculator/stat-calculator";
import { STAT_ROWS, formatStat } from "@/components/heroes/calculator/stat-rows";
import { HeroAssociations } from "@/components/heroes/hero-associations";
import { HeroCostumes } from "@/components/heroes/hero-costumes";
import { cx, display, eyebrow, Notice, numeric, Tag } from "@/components/ui";
import { sliderData } from "@/lib/games/account-buff";
import type { AccountBuffIndex } from "@/lib/games/account-buff-types";
import { findGame } from "@/lib/games/catalog";
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
    eroeNonTrovato: "Eroe non trovato · GachaZone",
    titoloPagina: (eroe: string, gioco: string) => `${eroe} · Eroi di ${gioco} · GachaZone`,
    descrizionePagina: (eroe: string, rarita: string, attributo: string, gioco: string) =>
      `${eroe}, eroe ${rarita} di attributo ${attributo} in ${gioco}.`,
    eroi: "Eroi",
    altCard: (eroe: string) => `Card di ${eroe}`,
    nelGioco: "Nel gioco:",
    uscita: "Uscita",
    giapponeCorea: "Giappone e Corea",
    globale: "Globale",
    evoluzioneLr: "evoluzione LR",
    nelCalendario: "nel calendario",
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
    rarita: (rarita: string) => `rarità ${rarita}`,
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
    eroeNonTrovato: "Hero not found · GachaZone",
    titoloPagina: (eroe: string, gioco: string) => `${eroe} · ${gioco} Heroes · GachaZone`,
    descrizionePagina: (eroe: string, rarita: string, attributo: string, gioco: string) =>
      `${eroe}, ${rarita} hero with the ${attributo} attribute in ${gioco}.`,
    eroi: "Heroes",
    altCard: (eroe: string) => `${eroe} card`,
    nelGioco: "In game:",
    uscita: "Release",
    giapponeCorea: "Japan and Korea",
    globale: "Global",
    evoluzioneLr: "LR evolution",
    nelCalendario: "in the calendar",
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
    rarita: (rarita: string) => `rarity ${rarita}`,
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
  const epithet = heroEpithet(hero, locale);
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
          che rarita', quando e' uscito. Sul telefono la card sta accanto al
          nome e non sopra: 80px invece di 128, e 150px di pagina in meno prima
          delle schede.
        */}
        <header className="mb-5 grid items-start gap-4 grid-cols-[80px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroCardSrc(game, hero.id)}
            srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
            alt={t.altCard(name)}
            width={128}
            height={128}
            className="w-20 rounded-card bg-paper-2 sm:w-32"
          />

          <div className="min-w-0">
            <p className={eyebrow} style={affinity ? { color: affinity.color } : undefined}>
              {epithet}
            </p>
            <h1 className={cx(display, "mt-2 text-[clamp(24px,3.4vw,34px)]")}>{name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/*
                "LR" da solo era comodo e falso. Il numero da cui viene - il
                `rating` del gioco - e' il TETTO che l'eroe puo' raggiungere,
                non la rarita' che ha adesso: un eroe che esce SSR e arriva a LR
                non e' un LR, lo diventa. Lo dicono l'enum RatingType del client
                (UR=6, LR=7), la colonna hero_lr_special che esiste, e le
                statistiche massime dei 32 eroi con rating 7, che sono quelle di
                un UR. Qui si scrive quello che il dato dice davvero.
              */}
              {/*
                L'attributo con l'icona del gioco al posto della pastiglia
                colorata: chi gioca la riconosce prima di leggere. Tristan no -
                il gioco non ha un'icona per l'attributo doppio - e per lui
                resta il quadrato bicolore, che il progetto disegna da se'.
              */}
              {affinity?.iconKey && hasIcon(icons, "attributo", affinity.iconKey) ? (
                <GameIcon
                  game={game}
                  family="attributo"
                  iconKey={affinity.iconKey}
                  label={affinityLabel(affinity.id, locale)}
                  size={34}
                />
              ) : (
                <AffinityTag affinity={affinity} fallback={hero.affinity} locale={locale} />
              )}

              <RarityPath
                game={game}
                locale={locale}
                icons={icons}
                from={hero.obtainedAs}
                to={hero.rarity}
                canReachLr={context?.rarity.canReachLr ?? false}
              />

              {/*
                La razza tiene icona E testo: i sei simboli sono meno familiari
                delle sigle di rarita', e da soli direbbero poco a chi arriva
                da una ricerca senza conoscere il gioco.
              */}
              {raceLabel ? (
                <Tag>
                  {context?.race != null && hasIcon(icons, "razza", String(context.race)) ? (
                    <GameIcon
                      game={game}
                      family="razza"
                      iconKey={String(context.race)}
                      label={raceLabel}
                      size={20}
                      className="mr-1.5 -ml-1 inline-block align-text-bottom"
                    />
                  ) : null}
                  {raceLabel}
                </Tag>
              ) : null}

              {/*
                Le fazioni restano testo: il gioco non ha un'icona per loro.
                Cercata su ogni pista - la famiglia icon_filter_*, icon_job,
                icon_group, icon_category, hero_category, characteristic,
                emblem e i nomi delle nove fazioni - zero risultati.
              */}
              {factionLabels.map((value) => (
                <Tag key={value}>{value}</Tag>
              ))}
              <Link
                href={`/${game}/eroi?cerca=${encodeURIComponent(hero.group)}`}
                className="text-[13px] text-ink-2 hover:text-brand"
              >
                {hero.group}
              </Link>
            </div>

            {release ? <ReleaseLine game={game} release={release} locale={locale} /> : null}
          </div>
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
              <h2 className={cx(eyebrow, "mb-2.5")}>{t.descrizione}</h2>
              <GameText text={description} className="max-w-[70ch] text-[15px] leading-relaxed" />
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
            <h2 className={cx(eyebrow, "mb-1.5")}>{t.identificativo}</h2>
            <p className={cx(numeric, "m-0 text-sm text-ink-2")}>
              {hero.id}
              <span className="ml-2 font-body text-[13px] text-ink-3">{t.spiegaId}</span>
            </p>
          </div>
        </div>
      </div>

      {others.length > 0 ? (
        <section className="mt-7 border-t border-rule-2 pt-5">
          <h2 className={cx(eyebrow, "mb-3")}>{t.altreVersioni(hero.group, others.length)}</h2>
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
 * Quando e' uscito: globale, Giappone e Corea, e il collegamento alla sua riga
 * nel calendario.
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
function ReleaseLine({ game, release, locale }: { game: string; release: HeroRelease; locale: Locale }) {
  const t = TESTI[locale];
  const format = new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const day = (value: string) => (
    <time dateTime={value} className={numeric}>
      {format.format(new Date(`${value}T00:00:00Z`))}
    </time>
  );
  const parts: { key: string; node: React.ReactNode }[] = [];
  if (release.global) parts.push({ key: "gb", node: <>{t.globale} {day(release.global)}</> });
  if (release.jp) parts.push({ key: "jp", node: <>{t.giapponeCorea} {day(release.jp)}</> });
  const lr = release.lrGlobal ?? release.lrJp;
  if (lr) parts.push({ key: "lr", node: <>{t.evoluzioneLr} {day(lr)}</> });
  // La riga nel calendario globale, che e' quello da cui la pagina parte; se
  // l'eroe li' non c'e', quella giapponese.
  const calendar = release.updateGlobal
    ? `/${game}/uscite#u-${release.updateGlobal}`
    : release.updateJp
      ? `/${game}/uscite?server=giappone#u-${release.updateJp}`
      : null;
  if (calendar) {
    parts.push({
      key: "cal",
      node: (
        <Link href={calendar} className="text-ink hover:text-brand">
          {t.nelCalendario}
        </Link>
      ),
    });
  }
  if (parts.length === 0) return null;

  return (
    <p className="m-0 mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-ink-2">
      <span className={eyebrow}>{t.uscita}</span>
      {parts.map((part, index) => (
        <span key={part.key}>
          {index > 0 ? "· " : null}
          {part.node}
        </span>
      ))}
      {release.festival ? <Tag tone="gold">{t.festival}</Tag> : null}
    </p>
  );
}

/** La rarita': l'icona del gioco dove c'e', la sigla dove manca. */
function Rarity({
  game,
  icons,
  rarity,
  size,
}: {
  game: string;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  rarity: string;
  size: number;
}) {
  if (!hasIcon(icons, "rarita", rarity)) {
    return <Tag tone={rarity === "LR" ? "gold" : "brand"}>{rarity}</Tag>;
  }
  return <GameIcon game={game} family="rarita" iconKey={rarity} label={rarity} size={size} />;
}

/**
 * Da dove parte l'eroe e dove puo' arrivare: due icone e una freccia.
 *
 * Le parole "esce come" e "arriva a" erano li' perche' due icone nude non
 * dicono quale delle due sia la rarita' d'uscita e quale il tetto - ed e'
 * esattamente l'affermazione che questa scheda prima sbagliava, dichiarando
 * "LR" un eroe che LR puo' soltanto diventarlo. La freccia porta quella
 * relazione meglio di quanto la portassero le parole, e in molto meno spazio.
 *
 * Il significato pero' non sparisce: resta nel `title`, che lo mostra col
 * mouse fermo, e nell'`aria-label`, che lo detta a chi usa un lettore di
 * schermo. Il `role="img"` fa leggere l'etichetta al posto del contenuto, cosi'
 * le due sigle non vengono annunciate due volte.
 *
 * Quando partenza e tetto coincidono - 17 eroi escono UR e UR restano - la
 * freccia sparisce insieme alla seconda icona: "UR -> UR" e' una relazione che
 * non dice niente.
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
  const same = from === to;
  const label = same ? t.rarita(from) : t.percorsoRarita(from, to, canReachLr);

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5"
    >
      <Rarity game={game} icons={icons} rarity={from} size={34} />
      {same ? null : (
        <>
          <span aria-hidden className="text-[15px] leading-none text-ink-3">
            →
          </span>
          <Rarity game={game} icons={icons} rarity={to} size={34} />
        </>
      )}
    </span>
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
        "inline-flex h-5 items-center rounded-[2px] px-[7px] text-white",
        "font-mono text-[10px] font-medium uppercase tracking-[0.06em]",
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
      <h2 className={cx(eyebrow, "mb-2.5")}>{t.statisticheTitolo}</h2>
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
      <p className="mt-3 max-w-[70ch] text-[13px] text-ink-3">
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
          className="block w-full rounded-[3px] bg-paper-2"
        />
        <p className="m-0 mt-1.5 text-[12px] font-semibold leading-tight group-hover:text-brand">
          {heroName(hero, locale)}
        </p>
      </Link>
    </li>
  );
}
