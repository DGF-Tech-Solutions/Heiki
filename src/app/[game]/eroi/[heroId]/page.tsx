import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameNotes, GameText } from "@/components/heroes/game-text";
import { cx, display, eyebrow, Notice, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { plainHeroText } from "@/lib/games/hero-markup";
import {
  gameIconSrc,
  heroCardArtSrc,
  heroUltimateArtSrc,
  heroCardSrc,
  heroSkillIconSrc,
  heroSpecialIconSrc,
  heroSplashSrc,
  type IconFamily,
} from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import type {
  HeroAffinity,
  HeroCard,
  HeroCardContext,
  HeroContext,
  HeroEffect,
  HeroEntry,
  HeroLabel,
  HeroSpecialAbility,
  HeroSpecialKind,
  HeroSpecialsIndex,
  HeroStats,
} from "@/lib/games/types";

/**
 * Scheda del singolo eroe.
 *
 * Mostra due cose con garanzie diverse, e la differenza resta visibile fino
 * qui: dal client vengono nome, epiteto, attributo e i testi: sono estratti dal
 * gioco. Da 7dshub vengono statistiche, carte, ultimate e passiva: il client
 * non le ha - le tiene il server del gioco - e la pagina lo dichiara invece di
 * far sembrare tutto ugualmente certo.
 *
 * I testi delle carte sono in inglese perche' il client ne spedisce 285 in
 * tutto, e sono modelli coi segnaposto che il server riempie. Il nome della
 * carta invece e' in italiano dove il gioco l'ha tradotto.
 *
 * Renderizzata sul server: e' l'unico posto che legge i testi lunghi, e cosi'
 * non finiscono nel bundle di chi sfoglia soltanto la griglia.
 */

interface Props {
  params: Promise<{ game: string; heroId: string }>;
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
    icons: gameModule.icons,
    context: gameModule.heroContext?.heroes[heroId],
    affinity: roster.affinities.find((item) => item.id === hero.affinity),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, heroId } = await params;
  const found = lookup(game, heroId);
  if (!found) return { title: "Eroe non trovato · GachaZone" };

  const { hero, entry, text } = found;
  const description = text?.description
    ? plainHeroText(text.description)
    : `${hero.name}, eroe ${hero.rarity} di attributo ${hero.affinity} in ${entry.name}.`;

  return {
    title: `${hero.name} · Eroi di ${entry.shortName} · GachaZone`,
    description: description.slice(0, 180),
  };
}

export default async function HeroPage({ params }: Props) {
  const { game, heroId } = await params;

  const found = lookup(game, heroId);
  if (!found) notFound();

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
    context,
    icons,
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
  const label = (value: HeroLabel | undefined) => value?.it ?? value?.en ?? null;
  const raceLabel = context?.race != null ? label(codes?.race[String(context.race)]) : null;
  const factionLabels = (context?.factions ?? [])
    .map((code) => label(codes?.faction[String(code)]))
    .filter((value): value is string => value !== null);

  // Quante carte mostrare quando NON c'e' il database delle abilita': e' il
  // ripiego per un modulo che abbia gli sprite e non ancora i testi. Con il
  // database si usa `abilities.cards`, che sono quelle di QUESTA versione,
  // mentre gli sprite dedotti dallo slug sono tutti quelli del personaggio.
  const cardCount = assets?.cards ?? 0;

  // Lo stesso personaggio esiste in piu' versioni: e' il tratto che definisce
  // questo gioco, e da una scheda e' la cosa che si vuole di piu' dopo averla
  // letta. Meglio qui che una ricerca a mano nella griglia.
  const others = roster.heroes.filter(
    (candidate) => candidate.group === hero.group && candidate.id !== hero.id,
  );

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: "Eroi", href: `/${game}/eroi` },
          { label: hero.name },
        ]}
      />

      {/*
        `group/scheda` e' l'antenato comune di ultimate e passiva: il rango si
        sceglie in una sezione e la passiva che ne dipende sta in un'altra.
      */}
      <article className="group/scheda">
        <header className="mb-6 grid gap-5 border-b border-rule pb-6 sm:grid-cols-[128px_minmax(0,1fr)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroCardSrc(game, hero.id)}
            srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
            alt={`Card di ${hero.name}`}
            width={128}
            height={128}
            className="w-32 rounded-card bg-paper-2"
          />

          <div className="min-w-0">
            <p className={eyebrow} style={affinity ? { color: affinity.color } : undefined}>
              {hero.epithet}
            </p>
            <h1 className={cx(display, "mt-2 text-[clamp(24px,3.4vw,34px)]")}>{hero.name}</h1>

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
                  label={affinity.label}
                  size={34}
                />
              ) : (
                <AffinityTag affinity={affinity} fallback={hero.affinity} />
              )}

              <RarityPath
                game={game}
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

            {text?.title && text.title !== hero.name ? (
              // Un <div> e non un <p>: GameText disegna un <div> di <p>, e un <p>
              // dentro un <p> non e' HTML valido. Il browser chiudeva il primo in
              // anticipo, l'albero non combaciava piu' con quello del server e
              // ogni scheda con un titolo nel gioco dava un errore di hydration:
              // le "5 Issues" del pallino di Next.
              <div className="mt-3 text-sm text-ink-2">
                Nel gioco: <GameText text={text.title} className="inline [&>p]:inline" />
              </div>
            ) : null}
          </div>
        </header>

        {assets?.splash ? (
          <section className="mb-7 grid items-start gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            {/*
              L'illustrazione e' collegata all'eroe con certezza: il suo heroId
              e' scritto nel nome del file. Le icone dei ritratti no, e infatti
              non compaiono qui - lo slug restringe al personaggio ma non alla
              variante, e una posa sbagliata su una scheda non si nota finche'
              non la guarda qualcuno che conosce il personaggio.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroSplashSrc(game, hero.id)}
              alt={`Illustrazione di ${hero.name}`}
              width={1024}
              height={1024}
              className="w-full rounded-card border border-rule bg-paper-2"
            />

            <div className="min-w-0">
              {text?.description ? (
                <>
                  <h2 className={cx(eyebrow, "mb-2.5")}>Descrizione</h2>
                  <GameText
                    text={text.description}
                    className="max-w-[70ch] text-[15px] leading-relaxed"
                  />
                </>
              ) : null}

              {/*
                L'icona dell'abilita' esclusiva stava qui, con la didascalia
                "il nome e gli effetti arrivano dal server". Ora nome ed effetti
                ci sono, e stanno nella sezione Passiva: l'icona e' scesa li',
                accanto a cio' che descrive. Un'icona senza il suo testo era
                l'unica cosa che potevamo mostrare allora, non una scelta.
              */}
            </div>
          </section>
        ) : text?.description ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>Descrizione</h2>
            <GameText text={text.description} className="max-w-[70ch] text-[15px] leading-relaxed" />
          </section>
        ) : (
          <Notice className="mb-7">
            Di questo eroe il client non porta una descrizione. Restano nome, rarità e attributo.
          </Notice>
        )}

        {abilities && abilities.cards.length > 0 ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>Carte d’attacco · {abilities.cards.length}</h2>

            {/*
              Una riga per carta, con la sua illustrazione. L'accostamento non
              si ricava dai nomi dei file: lo decide la pipeline
              (accosta_carte.py) fra wiki, scelte a mano e regole misurate
              contro il wiki, e ogni carta dice da quale delle tre viene.
            */}
            <ul className="m-0 grid list-none gap-3 p-0">
              {abilities.cards.map((card, index) => (
                <li key={index}>
                  <CardRow
                    game={game}
                    heroId={hero.id}
                    card={card}
                    context={card.slot ? context?.cards[card.slot] : undefined}
                    glossary={glossary}
                    icons={icons}
                  />
                </li>
              ))}
            </ul>

            {/*
              Quando l'accostamento non si sa, le immagini restavano invisibili:
              il testo aveva la sua riga e gli sprite non comparivano da nessuna
              parte. Mostrarli qui sotto, staccati e dichiarati come non
              attribuiti, li rende consultabili senza affermare il falso -
              metterli accanto a un testo a caso sarebbe stata l'unica cosa
              peggiore del non mostrarli.

              MA NON SONO TUTTE SUE, e prima lo si diceva. Gli sprite stanno in
              una cartella per PERSONAGGIO, che le versioni si spartiscono due a
              due: nella cartella `ban_nunchaku` il wiki assegna 04 e 01 a un
              Ban e 02 e 03 a un altro. Risultato: 170 eroi ne ricevono piu' di
              quante carte abbiano - fino a 10 per 3 carte - e la frase «le N
              illustrazioni di quest'eroe» era falsa per tutti loro.

              Ridurle a due non si puo' senza indovinare: la regola posizionale
              cade su Diane, Drole, Gil Thunder e Griamore, e la carta A ha
              l'indice minore solo in 92 casi su 110. Anche l'eliminazione fra
              fratelli non regge, perche' due versioni sconosciute nella stessa
              cartella si contenderebbero gli stessi avanzi. L'unica fonte che
              lo dichiari e' il wiki, e copre 114 eroi: allargare quello e' il
              vero rimedio. Qui si dice come stanno le cose.
            */}
            {cardCount > 0 && abilities.cards.every((card) => card.sprite === undefined) ? (
              <div className="mt-3">
                <p className="m-0 mb-2 text-[13px] text-ink-3">
                  {cardCount > abilities.cards.length ? (
                    <>
                      La cartella di questo personaggio contiene {cardCount} illustrazioni, ma
                      l’eroe ha {abilities.cards.length} carte: le altre sono delle sue altre
                      versioni. Quali siano le sue non si ricava dal client
                    </>
                  ) : (
                    <>
                      Le {cardCount} illustrazioni delle carte di quest’eroe. Quale appartenga a
                      quale carta non si ricava dal client
                    </>
                  )}
                  {assets?.cardsApprox ? ", e il grado di uscita non combacia" : null}.
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                  {Array.from({ length: cardCount }, (_, index) => (
                    <li key={index}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroCardArtSrc(game, hero.id, index + 1)}
                        alt=""
                        width={128}
                        height={256}
                        loading="lazy"
                        className="block w-[84px] rounded-[3px] bg-paper-2"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-3 text-[13px] text-ink-3">
              Quali carte ha l’eroe e cosa fanno a ogni rango vengono da una fonte esterna: il
              client tiene le descrizioni ma non il legame con l’eroe, che sta sul server del
              gioco.
              {abilities.textsInEnglish ? (
                <> I testi restano in inglese — il client ne ha solo i modelli, senza i valori.</>
              ) : null}
            </p>
          </section>
        ) : cardCount > 0 ? (
          /* Ripiego: ci sono gli sprite ma nessun testo. Vale per un modulo che
             abbia le immagini e non ancora il database delle abilita'. */
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>
              Carte d’attacco · {cardCount}
              {assets?.cardsApprox ? (
                <span className="ml-2 normal-case tracking-normal text-ink-3">
                  (stesso personaggio, grado di uscita diverso: da verificare)
                </span>
              ) : null}
            </h2>
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
              {Array.from({ length: cardCount }, (_, index) => (
                <li key={index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroCardArtSrc(game, hero.id, index + 1)}
                    alt=""
                    width={128}
                    height={256}
                    loading="lazy"
                    className="block w-[84px] rounded-[3px] bg-paper-2"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {abilities?.ultimate ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>Ultimate</h2>
            {/*
              La carta dell'ultimate accanto al testo, come per le carte
              d'attacco. Un'ultimate per eroe, quindi niente accostamento per
              nome: basta sapere che l'illustrazione e' sua, e `assets.ultimate`
              c'e' solo quando lo si sa.
            */}
            <CardRow
              game={game}
              heroId={hero.id}
              card={abilities.ultimate}
              context={context?.cards["ultimate"]}
              glossary={glossary}
              icons={icons}
              artSrc={assets?.ultimate ? heroUltimateArtSrc(game, hero.id) : undefined}
            />
          </section>
        ) : null}

        {abilities?.passive?.text || assets?.skill ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>Passiva</h2>
            {/*
              L'icona e' l'unico pezzo di passiva che il client dia con certezza:
              il file si chiama col proprio heroId (`icon_exclusive_skill_<id>`),
              quindi non c'e' accostamento da indovinare. Il testo invece viene
              da 7dshub. Se manca uno dei due si mostra l'altro: un'icona senza
              testo resta un'informazione, e un testo senza icona pure.
            */}
            <div
              className="grid items-start gap-4 rounded-card border border-rule border-l-[3px] border-l-gold bg-paper-2 p-4"
              style={assets?.skill ? { gridTemplateColumns: "56px minmax(0, 1fr)" } : undefined}
            >
              {assets?.skill ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={heroSkillIconSrc(game, hero.id)}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  className="block w-full rounded-card border border-rule bg-paper"
                />
              ) : null}

              <div className="min-w-0">
                {abilities?.passive?.name ? (
                  <p className="m-0 mb-1 font-semibold">{abilities.passive.name}</p>
                ) : null}
                <PassiveConditions
                  game={game}
                  codes={context?.passiveConditions}
                  conditions={passiveConditions}
                  icons={icons}
                />
                {abilities?.passive?.text ? (
                  <PassiveText
                    game={game}
                    text={abilities.passive.text}
                    // Senza i pulsanti dell'ultimate non c'e' un rango da seguire:
                    // resta il testo del rango 1, e nessun pannello resta spento.
                    steps={
                      (abilities.ultimate?.ranks.length ?? 0) > 1
                        ? abilities.passive.ultimateSteps
                        : undefined
                    }
                    context={context?.cards["passiva"]}
                    glossary={glossary}
                    icons={icons}
                  />
                ) : (
                  <p className="m-0 text-sm text-ink-3">
                    Di questa passiva abbiamo l’icona dal client, non ancora il testo.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/*
          Comandamenti, Grazie, Unita' e Talenti: una sezione per abilita', col
          nome del suo tipo come titolo, subito dopo la passiva a cui si
          aggiungono. Nessun eroe ne ha piu' di una, ma la lista regge anche quel
          caso.
        */}
        {specials.map(({ id, ability }) => {
          const kind = specialKinds?.[ability.kind];
          return (
            <section key={id} className="mb-7">
              <h2 className={cx(eyebrow, "mb-2.5")}>
                {kind?.label.it ?? kind?.label.en ?? ability.kind}
              </h2>
              <SpecialAbility
                game={game}
                id={id}
                ability={ability}
                kind={kind}
                conditions={passiveConditions}
                icons={icons}
                reactive={(abilities?.ultimate?.ranks.length ?? 0) > 1}
              />
            </section>
          );
        })}

        <section className="mb-7">
          <h2 className={cx(eyebrow, "mb-2.5")}>Identificativo</h2>
          <p className={cx(numeric, "m-0 text-sm text-ink-2")}>
            {hero.id}
            <span className="ml-2 font-body text-[13px] text-ink-3">
              è l’id del gioco: nomina anche il file della card e le sue voci di testo.
            </span>
          </p>
        </section>

        {others.length > 0 ? (
          <section className="border-t border-rule-2 pt-5">
            <h2 className={cx(eyebrow, "mb-3")}>
              Altre versioni di {hero.group} · {others.length}
            </h2>
            <ul
              className="m-0 grid list-none gap-x-3 gap-y-4 p-0"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 116px))" }}
            >
              {others.map((other) => (
                <Sibling key={other.id} game={game} hero={other} />
              ))}
            </ul>
          </section>
        ) : null}
        <Stats stats={stats} />
      </article>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        Testi e immagini provengono dal client di {entry.name} e appartengono a {entry.publisher}.
      </p>
    </main>
  );
}

/**
 * Un'icona del gioco, se e' stata estratta.
 *
 * `icons` e' l'elenco di quelle disponibili, e senza questo controllo chi clona
 * il repo senza lanciare `npm run eroi:import` vedrebbe un riquadro rotto su
 * ogni scheda: le immagini sono asset di Netmarble e non sono versionate.
 *
 * L'`alt` porta il nome e non e' decorativo: qui l'icona SOSTITUISCE una
 * parola, quindi senza di esso l'informazione sparirebbe per chi usa un lettore
 * di schermo. Dove invece l'icona accompagna un testo gia' scritto - la razza -
 * il chiamante passa la stessa parola e il `title` la ripete al passaggio del
 * mouse.
 */
function hasIcon(
  icons: Readonly<Record<string, readonly string[]>> | undefined,
  family: IconFamily,
  key: string,
): boolean {
  return icons?.[family]?.includes(key) ?? false;
}

function GameIcon({
  game,
  family,
  iconKey,
  label,
  size,
  className,
}: {
  game: string;
  family: IconFamily;
  iconKey: string;
  label: string;
  size: number;
  className?: string;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={gameIconSrc(game, family, iconKey)}
      alt={label}
      title={label}
      width={size}
      height={size}
      className={cx("inline-block", className)}
      style={{ width: size, height: "auto" }}
    />
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
  icons,
  from,
  to,
  canReachLr,
}: {
  game: string;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  from: string;
  to: string;
  canReachLr: boolean;
}) {
  const same = from === to;
  const label = same
    ? `rarità ${from}`
    : `esce come ${from}, ${canReachLr ? "può arrivare a" : "arriva a"} ${to}`;

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
}: {
  affinity: HeroAffinity | undefined;
  fallback: string;
}) {
  if (!affinity) return <Tag>{fallback}</Tag>;

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
      {affinity.label}
    </span>
  );
}

/**
 * Cosa fa una carta, detto con i termini del gioco.
 *
 * Il testo del rango e' inglese e pieno di meccaniche evidenziate che non si
 * spiegano da sole. Qui ci sono le stesse meccaniche come termini, con la
 * definizione che il GIOCO ne da': quelle che si scrive nelle note dentro
 * l'abilita', il suo dizionario dei buff, la tassonomia con cui filtra gli
 * effetti.
 *
 * Un termine DEDOTTO si vede che lo e'. Il gioco quelle operazioni - "Removes
 * Buffs", "depletes" - non le definisce in nessun posto in chiaro, e
 * l'accostamento viene dal vocabolario interno del client: e' una garanzia
 * diversa da una definizione scritta, e chi legge ha diritto di distinguerle.
 */
function Effects({
  context,
  glossary,
}: {
  context: HeroCardContext | undefined;
  glossary: Readonly<Record<string, HeroEffect>> | undefined;
}) {
  if (!context || !glossary) return null;

  // Prima quelli di tutta la carta, poi quelli che compaiono salendo di rango.
  // Tenerli separati evita di dire che al rango 1 la carta fa gia' quello che
  // impara al 3.
  const common = context.effects
    .map((key) => glossary[key])
    .filter((effect): effect is HeroEffect => effect !== undefined);

  const later = Object.entries(context.onlyAtRanks ?? {}).flatMap(([rank, keys]) =>
    keys
      .map((key) => ({ rank, effect: glossary[key] }))
      .filter((item): item is { rank: string; effect: HeroEffect } => item.effect !== undefined),
  );

  if (common.length === 0 && later.length === 0) return null;

  return (
    <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0">
      {common.map((effect, index) => (
        <EffectTag key={`c${index}`} effect={effect} />
      ))}
      {later.map((item, index) => (
        <EffectTag key={`l${index}`} effect={item.effect} rank={item.rank} />
      ))}
    </ul>
  );
}

function EffectTag({ effect, rank }: { effect: HeroEffect; rank?: string }) {
  const label = effect.label.it ?? effect.label.en;
  if (!label) return null;

  const definition = effect.definition.it ?? effect.definition.en;
  const dedotto = effect.certainty === "dedotto";

  return (
    <li
      className={cx(
        "inline-flex items-baseline gap-1 rounded-[2px] border px-1.5 py-0.5 text-[12px]",
        dedotto ? "border-dashed border-rule-2 text-ink-3" : "border-rule text-ink-2",
      )}
      title={
        // Il titolo porta la definizione del gioco e, quando serve, il fatto
        // che l'accostamento sia dedotto. Non e' il posto ideale per una
        // spiegazione, ma e' quello che non allunga la scheda di 30 righe.
        [definition, dedotto ? "(accostamento dedotto dal vocabolario del client)" : null]
          .filter(Boolean)
          .join(" ") || undefined
      }
    >
      {rank ? <span className={cx(numeric, "text-[10px] text-ink-3")}>R{rank}</span> : null}
      <span>{label}</span>
      {dedotto ? <span className="text-ink-3">?</span> : null}
    </li>
  );
}

/**
 * Come si sa che un'illustrazione e' di quella carta.
 *
 * In pagina la parola breve, al passaggio del puntatore la regola con la sua
 * misura: le misure sono contro gli accostamenti che il wiki dichiara.
 */
const FONTE_SPRITE: Readonly<Record<string, { breve: string; spiega: string }>> = {
  wiki: {
    breve: "dal wiki",
    spiega: "Il wiki di community cita il file dell'illustrazione accanto a questa carta.",
  },
  manuale: {
    breve: "verificata a mano",
    spiega:
      "Scelta a mano confrontando le carte del gioco. Dove il wiki la dichiara anche, coincide 25 volte su 25.",
  },
  cartella_propria: {
    breve: "dedotta",
    spiega:
      "L'eroe è l'unico della sua cartella di carte: le prime due, ordinate per id d'abilità. Esatta 53 volte su 53 sulle carte che il wiki dichiara.",
  },
  ordine_uscita: {
    breve: "dedotta",
    spiega:
      "Le versioni del personaggio, in ordine di uscita, prendono le carte a coppie. Esatta 55 volte su 57 sulle carte che il wiki dichiara.",
  },
  famiglia: {
    breve: "dedotta",
    spiega:
      "Le versioni di un personaggio condividono la carta dell'ultimate. Esatta 139 volte su 145 sulle ultimate che il wiki dichiara.",
  },
};

/**
 * Le classi dei sei ranghi, scritte per esteso una per una.
 *
 * Sembra ripetizione ed e' invece l'unico modo che funziona: Tailwind legge il
 * SORGENTE per sapere quali regole generare, quindi una classe costruita con
 * un template - `peer/r${n}` - non finirebbe mai nel CSS e il selettore non
 * cambierebbe niente, senza dare errore da nessuna parte. Sei perche' tanti
 * sono i ranghi dell'ultimate; le carte A e B ne hanno tre.
 */
const RANK_CLASSES = [
  {
    hook: "rk1",
    chip: "group-has-[.rk1:checked]:border-brand group-has-[.rk1:checked]:bg-brand-soft group-has-[.rk1:checked]:text-ink group-has-[.rk1:checked]:opacity-100",
    show: "group-has-[.rk1:checked]:block",
  },
  {
    hook: "rk2",
    chip: "group-has-[.rk2:checked]:border-brand group-has-[.rk2:checked]:bg-brand-soft group-has-[.rk2:checked]:text-ink group-has-[.rk2:checked]:opacity-100",
    show: "group-has-[.rk2:checked]:block",
  },
  {
    hook: "rk3",
    chip: "group-has-[.rk3:checked]:border-brand group-has-[.rk3:checked]:bg-brand-soft group-has-[.rk3:checked]:text-ink group-has-[.rk3:checked]:opacity-100",
    show: "group-has-[.rk3:checked]:block",
  },
  {
    hook: "rk4",
    chip: "group-has-[.rk4:checked]:border-brand group-has-[.rk4:checked]:bg-brand-soft group-has-[.rk4:checked]:text-ink group-has-[.rk4:checked]:opacity-100",
    show: "group-has-[.rk4:checked]:block",
  },
  {
    hook: "rk5",
    chip: "group-has-[.rk5:checked]:border-brand group-has-[.rk5:checked]:bg-brand-soft group-has-[.rk5:checked]:text-ink group-has-[.rk5:checked]:opacity-100",
    show: "group-has-[.rk5:checked]:block",
  },
  {
    hook: "rk6",
    chip: "group-has-[.rk6:checked]:border-brand group-has-[.rk6:checked]:bg-brand-soft group-has-[.rk6:checked]:text-ink group-has-[.rk6:checked]:opacity-100",
    show: "group-has-[.rk6:checked]:block",
  },
] as const;

/** Cosa porta il pulsante del rango: stelle (carte A e B), pietre (ultimate), o la sigla. */
type RankMark = "stelle" | "pietre" | "sigle";

/**
 * Il rango dell'ultimate letto da FUORI della sua carta: lo usa la passiva.
 *
 * Il radio dell'ultimate porta due agganci. `rkN` lo legge la carta, per il
 * testo del rango; `ultN` la passiva, che sta in un'altra sezione e quindi
 * chiede all'`<article>` (`group/scheda`). L'articolo contiene anche le carte A
 * e B coi loro `rk1`-`rk3`: chiedendogli `.rk3:checked` risponderebbe pure la
 * carta A, e la passiva seguirebbe il rango sbagliato.
 *
 * Scritte per esteso per la stessa ragione di RANK_CLASSES: Tailwind legge il
 * sorgente.
 */
const ULTIMATE_LINK = [
  {
    hook: "ult1",
    show: "group-has-[.ult1:checked]/scheda:block",
    inline: "group-has-[.ult1:checked]/scheda:inline-flex",
  },
  {
    hook: "ult2",
    show: "group-has-[.ult2:checked]/scheda:block",
    inline: "group-has-[.ult2:checked]/scheda:inline-flex",
  },
  {
    hook: "ult3",
    show: "group-has-[.ult3:checked]/scheda:block",
    inline: "group-has-[.ult3:checked]/scheda:inline-flex",
  },
  {
    hook: "ult4",
    show: "group-has-[.ult4:checked]/scheda:block",
    inline: "group-has-[.ult4:checked]/scheda:inline-flex",
  },
  {
    hook: "ult5",
    show: "group-has-[.ult5:checked]/scheda:block",
    inline: "group-has-[.ult5:checked]/scheda:inline-flex",
  },
  {
    hook: "ult6",
    show: "group-has-[.ult6:checked]/scheda:block",
    inline: "group-has-[.ult6:checked]/scheda:inline-flex",
  },
] as const;

/** L'articolo davanti al tipo, nella riga "... segue il rango scelto": l'Unita', la Grazia. */
const ARTICOLO_SPECIALE: Readonly<Record<string, string>> = {
  comandamento: "il ",
  grazia: "la ",
  unita: "l'",
  talento: "il ",
};

/** Come si sa che l'icona di un'abilita' speciale e' sua: la parola breve e la spiegazione. */
const FONTE_ICONA_SPECIALE: Readonly<Record<string, { breve: string; spiega: string }>> = {
  wiki: {
    breve: "dal wiki",
    spiega: "Il wiki di community cita questo file nella pagina dell'eroe, accanto all'abilità.",
  },
  schema: {
    breve: "dedotta",
    spiega:
      "Nessuna fonte la cita, ma segue lo schema dei nomi delle icone dichiarate per le altre abilità dello stesso tipo.",
  },
  "a vista": {
    breve: "riconosciuta a vista",
    spiega:
      "Un'icona del personaggio che nessun'altra abilità reclama, riconosciuta dal disegno: le sfere contano i comandamenti, il volto dice la versione.",
  },
  "id nel nome": {
    breve: "dal client",
    spiega: "Il file dell'icona porta l'id dell'eroe nel nome: nessun accostamento da indovinare.",
  },
  generica: {
    breve: "generica",
    spiega: "L'icona propria non si trova fra quelle estratte: resta il simbolo del tipo.",
  },
};

/**
 * Un Comandamento, una Grazia, un'Unita' o un Talento.
 *
 * L'icona arriva gia' nella cornice del suo tipo, com'e' nel gioco. Accanto al
 * nome si dice come si sa che l'icona e' sua, perche' per tre tipi su quattro il
 * file non porta l'heroId e le fonti hanno forza diversa. Sotto il testo, le
 * regole con cui il gioco fa convivere i tipi in squadra: sono la cosa che
 * decide se l'abilita' si attiva davvero.
 */
function SpecialAbility({
  game,
  id,
  ability,
  kind,
  conditions,
  icons,
  reactive,
}: {
  game: string;
  id: string;
  ability: HeroSpecialAbility;
  kind: HeroSpecialKind | undefined;
  conditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  /** c'e' un rango dell'ultimate da seguire */
  reactive: boolean;
}) {
  const name = ability.name.it ?? ability.name.en;
  const source = FONTE_ICONA_SPECIALE[ability.iconSource];
  const rules = (kind?.rules ?? [])
    .map((rule) => rule.it ?? rule.en)
    .filter((rule): rule is string => rule !== null);

  return (
    <div
      className="grid items-start gap-4 rounded-card border border-rule bg-paper-2 p-4"
      style={ability.icon ? { gridTemplateColumns: "76px minmax(0, 1fr)" } : undefined}
    >
      {ability.icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={heroSpecialIconSrc(game, id)}
          alt=""
          width={122}
          height={127}
          loading="lazy"
          className="block h-auto w-full"
        />
      ) : null}

      <div className="min-w-0">
        {name ? (
          <GameText text={name} className="m-0 font-semibold [&>p]:m-0" />
        ) : null}
        {ability.icon && source ? (
          <p
            className="m-0 mb-1.5 text-[12px] text-ink-3"
            title={`${source.spiega} Cornice: ${ability.frameSource}.`}
          >
            icona {source.breve}
          </p>
        ) : null}

        <PassiveConditions game={game} codes={ability.conditions} conditions={conditions} icons={icons} />
        <PassiveText
          game={game}
          text={ability.text}
          steps={reactive ? ability.ultimateSteps : undefined}
          icons={icons}
          subject={kind?.label.it ? `${ARTICOLO_SPECIALE[ability.kind] ?? "l'abilità: "}${kind.label.it}` : "l'abilità"}
        />

        {rules.length > 0 ? (
          <ul className="m-0 mt-2.5 list-none border-t border-rule p-0 pt-2 text-[12px] leading-snug text-ink-3 [&>li+li]:mt-1">
            {rules.map((rule) => (
              <li key={rule}>
                <GameText text={rule} className="[&>p]:m-0" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Dove si attiva la passiva, con le icone del gioco.
 *
 * Sono quelle del riquadro dell'abilita' unica - la spada nel quadrato rosso,
 * la mano bianca nel cerchio blu - e servono a capire a colpo d'occhio se una
 * passiva vale in battaglia o anche dallo slot secondario, in tutti i contenuti
 * o solo in PvP.
 *
 * Icona E frase, non l'icona da sola: le frasi sono quelle del gioco, e le
 * icone dell'esclusione (la croce rossa sulla bestia, sul demone) non si
 * leggono al primo sguardo per chi il gioco non lo conosce ancora. Dove l'icona
 * manca - chi clona senza asset - resta la frase.
 */
function PassiveConditions({
  game,
  codes,
  conditions,
  icons,
}: {
  game: string;
  codes: readonly number[] | undefined;
  conditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
}) {
  const rows = (codes ?? [])
    .map((code) => conditions?.[String(code)])
    .filter((condition): condition is { icon: string; description: HeroLabel } => !!condition)
    .map((condition) => ({
      icon: condition.icon,
      text: condition.description.it ?? condition.description.en,
    }))
    .filter((row): row is { icon: string; text: string } => row.text !== null);

  if (rows.length === 0) return null;

  return (
    <ul className="m-0 mb-2.5 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
      {rows.map((row) => (
        <li
          key={row.icon}
          className="inline-flex items-center gap-1.5 text-[12px] leading-snug text-ink-2"
        >
          {hasIcon(icons, "condizione", row.icon) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={gameIconSrc(game, "condizione", row.icon)}
              alt=""
              width={64}
              height={64}
              className="h-5 w-5 shrink-0"
            />
          ) : null}
          {row.text}
        </li>
      ))}
    </ul>
  );
}

/**
 * Il testo della passiva, che in 42 eroi segue il rango dell'ultimate.
 *
 * Come i ranghi delle carte, senza JavaScript: un pannello per versione del
 * testo, e ogni pannello si accende sui ranghi in cui vale. La versione che
 * vale dal rango 2 al 4 porta le classi dei ranghi 2, 3 e 4. Parte dal rango
 * che l'ultimate ha scelto da sola, il sesto.
 *
 * Le note in fondo seguono il rango anche loro: in 21 di queste 42 passive il
 * valore che sale sta anche dentro la definizione di un termine (`※Cold Snap:
 * Attack-related stats 15%`), e in 8 cambia SOLTANTO li'. Una nota ferma al
 * primo rango direbbe un numero sbagliato proprio dove la passiva cambia.
 */
function PassiveText({
  game,
  text,
  steps,
  context,
  glossary,
  icons,
  subject = "la passiva",
}: {
  game: string;
  text: string;
  /** chi segue il rango, nella riga sopra il testo: "la passiva", "il Talento" */
  subject?: string;
  /** assenti quando la passiva non cambia, o quando non c'e' un rango da scegliere */
  steps?: readonly { fromUltimateRank: number; text: string }[];
  context?: HeroCardContext;
  glossary?: Readonly<Record<string, HeroEffect>>;
  icons?: Readonly<Record<string, readonly string[]>>;
}) {
  const body = "text-sm leading-relaxed text-ink-2";

  if (!steps || steps.length === 0) {
    return (
      <>
        <GameText text={text} omitNotes className={body} />
        <Effects context={context} glossary={glossary} />
        <GameNotes texts={[text]} className="mt-2.5" />
      </>
    );
  }

  const versions = [{ fromUltimateRank: 1, text }, ...steps];
  // Ogni versione vale dal suo rango fino a quello prima della seguente.
  const shows = versions.map((version, index) => {
    const until = versions[index + 1]?.fromUltimateRank ?? ULTIMATE_LINK.length + 1;
    return ULTIMATE_LINK.slice(version.fromUltimateRank - 1, until - 1).map((link) => link.show);
  });
  const gems = ULTIMATE_LINK.every((link) => hasIcon(icons, "carta", `pietra_${link.hook.slice(3)}`));
  const orange = versions.some((version) => version.text.includes("[FF8000]"));

  return (
    <>
      <p className="m-0 mb-2 flex flex-wrap items-center gap-x-1.5 text-[12px] leading-snug text-ink-3">
        {ULTIMATE_LINK.map((link, index) => (
          <span
            key={link.hook}
            className={cx("hidden items-center gap-1 font-semibold text-ink-2", link.inline)}
          >
            {gems ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={gameIconSrc(game, "carta", `pietra_${index + 1}`)}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 object-contain"
              />
            ) : null}
            Ultimate al rango {index + 1}
          </span>
        ))}
        <span>
          · {subject} segue il rango scelto qui sopra
          {orange ? ": i valori in arancione sono quelli legati al rango" : ""}
        </span>
      </p>

      {versions.map((version, index) => (
        <div key={`testo-${version.fromUltimateRank}`} className={cx("hidden", ...shows[index]!)}>
          <GameText text={version.text} omitNotes className={body} />
        </div>
      ))}

      <Effects context={context} glossary={glossary} />

      {versions.map((version, index) => (
        <div key={`note-${version.fromUltimateRank}`} className={cx("hidden", ...shows[index]!)}>
          <GameNotes texts={[version.text]} className="mt-2.5" />
        </div>
      ))}
    </>
  );
}

/**
 * I pulsanti per scegliere il rango.
 *
 * I tre ranghi stavano uno sotto l'altro e differivano quasi solo nella
 * percentuale: tre righe da leggere per trovare un numero diverso. Qui se ne
 * legge una alla volta.
 *
 * SENZA JAVASCRIPT, ed e' una scelta. Radio nascosti e regole CSS fanno
 * esattamente la stessa cosa di uno stato React, ma questa scheda pesa 186 byte
 * di script proprio perche' e' tutta renderizzata sul server: un `useState` qui
 * la trasformerebbe in un componente client e si porterebbe dietro nel bundle i
 * testi di tutti i ranghi di tutte le carte. Funziona anche a JavaScript
 * disattivato, e la tastiera lo tratta come il gruppo di radio che e'.
 *
 * I pulsanti stanno SOTTO l'illustrazione e il testo nell'altra colonna: il
 * legame passa da `group-has-[]` sulla carta intera, non da `peer-checked`,
 * che guarda solo i fratelli precedenti.
 *
 * Il pulsante segna il rango come lo segna il gioco. Sulle carte A e B porta
 * le stelle - una, due, tre. L'ultimate ha sei ranghi e il gioco li segna con
 * una pietra incastonata in cima alla carta, un colore per rango: verdina,
 * azzurra, gialla, arancione, rossa, e al sesto la goccia verde chiaro. Alle
 * sigle R1-R6 si torna senza i PNG, per chi clona senza gli asset.
 *
 * Parte dal rango PIU' ALTO: e' la carta com'e' quando conta, e chi vuole
 * vedere da dove parte scende di uno.
 */
function RankButtons({
  game,
  group,
  card,
  mark,
  fill,
}: {
  game: string;
  group: string;
  card: HeroCard;
  mark: RankMark;
  /** sotto l'illustrazione: la riga e' larga quanto la carta, e i pulsanti crescono fino ai bordi */
  fill: boolean;
}) {
  // Sotto la carta i pulsanti stanno in una riga sola. I tre a stelle crescono
  // fino ai bordi. Le sei pietre le mette in fila la griglia, a 18px l'una -
  // 120 meno cinque spazi da 2px, diviso sei - e la pietra ne occupa 14. Le sei
  // sigle invece in 120px non ci stanno - 25px l'una piu' gli spazi fanno 170 -
  // quindi vanno tre per riga.
  const layout = !fill
    ? "mt-2 flex flex-wrap gap-1.5"
    : mark === "stelle"
      ? "mt-1.5 flex gap-1"
      : mark === "pietre"
        ? "mt-1.5 grid grid-cols-6 gap-0.5"
        : "mt-1.5 grid grid-cols-3 gap-1";

  return (
    <div className={layout}>
      {card.ranks.map((rank, index) => (
        <input
          key={`radio-${rank.rank}`}
          type="radio"
          name={group}
          id={`${group}-${rank.rank}`}
          defaultChecked={index === card.ranks.length - 1}
          className={cx(
            "sr-only",
            RANK_CLASSES[index]?.hook,
            card.slot === "ultimate" && ULTIMATE_LINK[rank.rank - 1]?.hook,
          )}
        />
      ))}

      {card.ranks.map((rank, index) => (
        <label
          key={`label-${rank.rank}`}
          htmlFor={`${group}-${rank.rank}`}
          title={`Rango ${rank.rank}`}
          className={cx(
            numeric,
            "flex cursor-pointer items-center justify-center rounded-[2px] border border-rule bg-paper-2",
            "text-[10px] text-ink-3 transition hover:text-ink",
            // Le insegne spente a meta' dicono quale rango NON e' scelto meglio
            // del solo bordo: le stelle sono tutte dello stesso giallo, e sei
            // pietre accese di sei colori non ne farebbero risaltare nessuna.
            mark === "sigle" ? "px-1.5" : "h-5 opacity-50 hover:opacity-100",
            // nella griglia delle sei pietre restano 16px dentro il bordo: niente margini
            mark !== "sigle" && (mark === "pietre" && fill ? "px-0" : "px-1"),
            fill && "flex-auto",
            RANK_CLASSES[index]?.chip,
          )}
        >
          {mark === "stelle" ? (
            <>
              {Array.from({ length: rank.rank }, (_, star) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={star}
                  src={gameIconSrc(game, "carta", "stella")}
                  alt=""
                  width={39}
                  height={41}
                  loading="lazy"
                  className="h-auto w-[13px]"
                />
              ))}
              {/* le stelle sono immagini decorative: il nome del radio sta qui */}
              <span className="sr-only">Rango {rank.rank}</span>
            </>
          ) : mark === "pietre" ? (
            <>
              {/*
                Una casella quadrata e `object-contain`: le pietre hanno misure
                diverse (dalla 62x71 della prima alla 96x128 della sesta), e
                cosi' stanno tutte alla stessa altezza senza scrivere qui le
                misure dell'atlas.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gameIconSrc(game, "carta", `pietra_${rank.rank}`)}
                alt=""
                width={14}
                height={14}
                loading="lazy"
                className="h-3.5 w-3.5 object-contain"
              />
              <span className="sr-only">Rango {rank.rank}</span>
            </>
          ) : (
            `R${rank.rank}`
          )}
        </label>
      ))}
    </div>
  );
}

/** Il testo del rango scelto: uno solo alla volta, e lo decide il radio. */
function RankPanels({ card }: { card: HeroCard }) {
  const ranks = card.ranks;
  if (ranks.length === 0) return null;

  // Un rango solo: non c'e' niente da scegliere, e il testo si vede e basta.
  if (ranks.length === 1) {
    return (
      <div className="mt-2 text-[13px] leading-snug">
        <GameText text={ranks[0]!.text} omitNotes className="[&>p]:m-0" />
      </div>
    );
  }

  return (
    <div className="mt-2 text-[13px] leading-snug">
      {ranks.map((rank, index) => (
        <div key={`panel-${rank.rank}`} className={cx("hidden", RANK_CLASSES[index]?.show)}>
          <GameText text={rank.text} omitNotes className="[&>p]:m-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * Una carta con i suoi ranghi.
 *
 * Lo sprite compare solo se `card.sprite` dice quale: senza, la colonna
 * dell'immagine sparisce e il testo si prende tutta la riga. Accostare uno
 * sprite qualsiasi riempirebbe meglio lo spazio e direbbe una cosa falsa.
 */
function CardRow({
  game,
  heroId,
  card,
  context,
  glossary,
  icons,
  artSrc,
}: {
  game: string;
  heroId: string;
  card: HeroCard;
  context?: HeroCardContext;
  glossary?: Readonly<Record<string, HeroEffect>>;
  icons?: Readonly<Record<string, readonly string[]>>;
  /** l'illustrazione quando non e' uno sprite numerato: l'ultimate ha la sua cartella */
  artSrc?: string;
}) {
  const art =
    artSrc ?? (card.sprite !== undefined ? heroCardArtSrc(game, heroId, card.sprite) : null);

  // Il rango si segna come lo segna il gioco: stelle sulle carte d'attacco, che
  // hanno tre ranghi, e una pietra per rango sull'ultimate, che ne ha sei. Se
  // manca anche una sola pietra si torna alle sigle per tutta la carta: meta'
  // pulsanti a pietre e meta' a sigle non si leggerebbero come la stessa scala.
  const mark: RankMark =
    (card.slot === "A" || card.slot === "B") && hasIcon(icons, "carta", "stella")
      ? "stelle"
      : card.slot === "ultimate" &&
          card.ranks.every((rank) => hasIcon(icons, "carta", `pietra_${rank.rank}`))
        ? "pietre"
        : "sigle";
  // Con un rango solo non c'e' niente da scegliere, quindi nessun pulsante.
  const picker = card.ranks.length > 1;
  const group = `${heroId}-${card.slot ?? "carta"}`;

  // La colonna dell'immagine e' larga 120px, e non 84, per la riga dei tre
  // pulsanti a stelle che le sta sotto: al minimo ne occupa 116 (23 + 36 + 49
  // piu' gli spazi). A 84 le stelle scenderebbero a 9px, e non si leggerebbero.
  const columns = art ? { gridTemplateColumns: "120px minmax(0, 1fr)" } : undefined;

  return (
    // `group` serve a :has(): i pulsanti stanno nella colonna dell'immagine e
    // il testo del rango nell'altra, quindi il legame passa dall'antenato
    // comune.
    <div
      className="group grid items-start gap-4 rounded-card border border-rule bg-paper p-3"
      style={columns}
    >
      {art ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={art}
            alt=""
            width={128}
            height={256}
            loading="lazy"
            className="block w-full rounded-[3px] bg-paper-2"
          />

          {picker ? (
            <RankButtons game={game} group={group} card={card} mark={mark} fill />
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0">
        <p className={cx(eyebrow, "m-0")}>
          {card.name}
          {card.slot === "A" || card.slot === "B" ? (
            <span className="ml-2 text-ink-3">carta {card.slot}</span>
          ) : null}
          {art && card.spriteSource ? (
            <span className="ml-2 text-ink-3" title={FONTE_SPRITE[card.spriteSource]?.spiega}>
              · illustrazione {FONTE_SPRITE[card.spriteSource]?.breve ?? card.spriteSource}
            </span>
          ) : null}
        </p>

        {/* Senza illustrazione non c'e' una carta sotto cui metterli: stanno sopra il testo. */}
        {art === null && picker ? (
          <RankButtons game={game} group={group} card={card} mark={mark} fill={false} />
        ) : null}

        <RankPanels card={card} />

        {/*
          Le definizioni dei termini stanno in fondo, una volta per carta. Il
          gioco le ripete in ogni rango identiche: lasciarle li' significava
          stampare tre volte la stessa spiegazione sotto tre righe che
          differiscono per una percentuale.
        */}
        <Effects context={context} glossary={glossary} />

        <GameNotes texts={card.ranks.map((rank) => rank.text)} className="mt-2.5" />
      </div>
    </div>
  );
}

/**
 * Le statistiche al massimo livello, senza equipaggiamento.
 *
 * Si mostrano le sei che si guardano davvero. Le altre quindici esistono nel
 * dataset e non qui: una tabella di ventuno numeri non e' piu' informativa, e'
 * solo piu' lunga.
 *
 * La colonna con l'equipaggiamento e' stata tolta il 15/09, su richiesta
 * dell'utente, e aggiungeva poco: la differenza fra le due colonne e' lo stesso
 * pacchetto per tutti i 373 eroi, quindi non diceva niente dell'eroe. Il dato
 * resta in `maxGeared`.
 *
 * Sta in fondo alla scheda: carte, ultimate e passiva sono il motivo per cui la
 * si apre.
 */
const STAT_ROWS: readonly { key: string; label: string; percent?: boolean }[] = [
  { key: "atk", label: "Attacco" },
  { key: "def", label: "Difesa" },
  { key: "hp", label: "Salute" },
  { key: "critPer", label: "Tasso critico", percent: true },
  { key: "critAtkPer", label: "Danno critico", percent: true },
  { key: "fPower", label: "Potenza combattimento" },
];

/**
 * `useGrouping: "always"` e non il default.
 *
 * In italiano il raggruppamento automatico salta i numeri di quattro cifre:
 * nella stessa colonna uscivano `7412` e `10.002`, e due migliaia scritte in
 * due modi diversi si leggono come due unita' di misura diverse.
 */
const numero = (n: number) => n.toLocaleString("it-IT", { useGrouping: "always" });

function Stats({ stats }: { stats: HeroStats | undefined }) {
  if (!stats) return null;

  return (
    <section className="mb-7">
      <h2 className={cx(eyebrow, "mb-2.5")}>Statistiche al massimo, senza equipaggiamento</h2>

      {/* Una colonna di numeri: stretta, perche' larga quanto la scheda il
          valore finirebbe a mille pixel dalla sua etichetta. */}
      <table className="w-full max-w-[420px] border-collapse text-[13px]">
        <tbody>
          {STAT_ROWS.filter((row) => stats.max[row.key] !== undefined).map((row) => (
            <tr key={row.key} className="border-b border-rule/60">
              <td className="py-1.5 pr-3 text-ink-2">{row.label}</td>
              <td className={cx(numeric, "py-1.5 text-right font-medium")}>
                {numero(stats.max[row.key]!)}
                {row.percent ? "%" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-[13px] text-ink-3">
        Nel client non ci sono: le tiene il server del gioco.
      </p>
    </section>
  );
}

function Sibling({ game, hero }: { game: string; hero: HeroEntry }) {
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
          {hero.name}
        </p>
      </Link>
    </li>
  );
}

