import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameNotes, GameText } from "@/components/heroes/game-text";
import { cx, display, eyebrow, Notice, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { plainHeroText } from "@/lib/games/hero-markup";
import {
  heroCardArtSrc,
  heroCardSrc,
  heroSkillIconSrc,
  heroSplashSrc,
} from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import type { HeroAffinity, HeroCard, HeroEntry, HeroStats } from "@/lib/games/types";

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

  const { entry, roster, hero, text, assets, abilities, stats, affinity } = found;

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

      <article>
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
              <Tag tone={hero.rarity === "LR" ? "gold" : "brand"}>{hero.rarity}</Tag>
              <AffinityTag affinity={affinity} fallback={hero.affinity} />
              <Tag>esce come {hero.obtainedAs}</Tag>
              <Link
                href={`/${game}/eroi?cerca=${encodeURIComponent(hero.group)}`}
                className="text-[13px] text-ink-2 hover:text-brand"
              >
                {hero.group}
              </Link>
            </div>

            {text?.title && text.title !== hero.name ? (
              <p className="mt-3 text-sm text-ink-2">
                Nel gioco: <GameText text={text.title} className="inline [&>p]:inline" />
              </p>
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

        {/*
          Questi due testi sembravano decorazione e li avevo messi come
          citazioni. Non lo sono: descrivono cosa fa l'eroe in combattimento, e
          sono i soli testi sulle abilita' che il CLIENT lega all'heroId.

          Restano anche adesso che le singole abilita' ci sono, perche' dicono
          una cosa diversa: qui c'e' il ruolo dell'eroe nell'insieme, scritto
          dal gioco e in italiano, mentre le carte qui sotto sono meccaniche in
          inglese. La riga in fondo diceva che le descrizioni delle abilita'
          stavano sul server e basta: era vero prima di avere gli id da 7dshub,
          adesso non lo e' piu' ed e' stata tolta.
        */}
        {text?.loading || text?.summon ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>In combattimento</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Ability label="Cosa fanno le sue abilità" text={text.loading} />
              <Ability label="Ruolo in squadra" text={text.summon} />
            </div>

            <p className="mt-3 text-[13px] text-ink-3">
              Come il gioco descrive l’eroe nell’insieme. Le singole carte sono qui sotto.
            </p>
          </section>
        ) : null}

        <Stats stats={stats} />

        {abilities && abilities.cards.length > 0 ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>Carte d’attacco · {abilities.cards.length}</h2>

            {/*
              Una riga per carta, sprite a sinistra dove sappiamo qual e'.
              L'accostamento fra un'immagine e il suo testo NON si ricava dai
              nomi dei file: il numero nello sprite non ha relazione con l'id
              dell'abilita' (1 caso su 232 controllati). Lo dichiara il wiki,
              che scrive il nome del file accanto al nome della carta, e vale
              per 232 carte. Per le altre si mostra il testo senza immagine:
              meglio una colonna vuota di una carta accostata a caso.
            */}
            <ul className="m-0 grid list-none gap-3 p-0">
              {abilities.cards.map((card, index) => (
                <li key={index}>
                  <CardRow game={game} heroId={hero.id} card={card} />
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
            */}
            {cardCount > 0 && abilities.cards.every((card) => card.sprite === undefined) ? (
              <div className="mt-3">
                <p className="m-0 mb-2 text-[13px] text-ink-3">
                  Le {cardCount} illustrazioni delle carte di quest’eroe. Quale appartenga a
                  quale carta non si ricava dal client
                  {assets?.cardsApprox ? " e la cartella è condivisa con altre versioni" : null}.
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

            <Hits hits={assets?.hits} />

            <p className="mt-3 text-[13px] text-ink-3">
              Quali carte ha l’eroe e cosa fanno a ogni rango viene da {abilities.source}: il
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
            <Hits hits={assets?.hits} />
          </section>
        ) : null}

        {abilities?.ultimate ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>Ultimate</h2>
            <CardRow game={game} heroId={hero.id} card={abilities.ultimate} />
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
                {abilities?.passive?.text ? (
                  <>
                    <GameText
                      text={abilities.passive.text}
                      omitNotes
                      className="text-sm leading-relaxed text-ink-2"
                    />
                    <GameNotes texts={[abilities.passive.text]} className="mt-2.5" />
                    <p className="m-0 mt-2 text-[12px] text-ink-3">Fonte: {abilities.source}</p>
                  </>
                ) : (
                  <p className="m-0 text-sm text-ink-3">
                    Di questa passiva abbiamo l’icona dal client, non ancora il testo.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}

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
      </article>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        Testi e immagini provengono dal client di {entry.name} e appartengono a {entry.publisher}.
      </p>
    </main>
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
 * Colpi per carta.
 *
 * Il client li nomina `skill_a_1_atk`: abilita' A, rango 1. Il rango puo'
 * valerne piu' d'uno - `skill_b_2_3_atk` copre il 2 e il 3 - perche' il gioco
 * cambia il numero di colpi solo quando cambia davvero.
 *
 * E' l'unico dato numerico di combattimento che il client contenga: tutto il
 * resto lo scarica dal server. Vale la pena mostrarlo proprio per questo.
 */
function Hits({ hits }: { hits: Readonly<Record<string, number>> | undefined }) {
  if (!hits) return null;

  const rows = Object.entries(hits)
    .map(([key, value]) => {
      const match = /^skill_([a-z])_([\d_]+)_atk$/.exec(key);
      if (!match) return { label: key, value };
      const ranks = match[2]!.split("_").join("–");
      return { label: `Abilità ${match[1]!.toUpperCase()} · rango ${ranks}`, value };
    })
    .filter((row) => row.value > 0);

  if (rows.length === 0) return null;

  return (
    <dl className="m-0 mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline gap-2">
          <dt className="text-[13px] text-ink-2">{row.label}</dt>
          <dd className={cx(numeric, "m-0 text-[13px] font-medium")}>
            {row.value} {row.value === 1 ? "colpo" : "colpi"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Una carta con i suoi ranghi.
 *
 * Lo sprite compare solo se `card.sprite` dice quale: senza, la colonna
 * dell'immagine sparisce e il testo si prende tutta la riga. Accostare uno
 * sprite qualsiasi riempirebbe meglio lo spazio e direbbe una cosa falsa.
 */
function CardRow({ game, heroId, card }: { game: string; heroId: string; card: HeroCard }) {
  const art = card.sprite !== undefined ? heroCardArtSrc(game, heroId, card.sprite) : null;

  return (
    <div
      className="grid items-start gap-4 rounded-card border border-rule bg-paper p-3"
      style={art ? { gridTemplateColumns: "84px minmax(0, 1fr)" } : undefined}
    >
      {art ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={art}
          alt=""
          width={128}
          height={256}
          loading="lazy"
          className="block w-full rounded-[3px] bg-paper-2"
        />
      ) : null}

      <div className="min-w-0">
        <p className={cx(eyebrow, "m-0")}>
          {card.name}
          {card.slot === "A" || card.slot === "B" ? (
            <span className="ml-2 text-ink-3">carta {card.slot}</span>
          ) : null}
        </p>

        <dl className="m-0 mt-2 grid gap-1.5">
          {card.ranks.map((rank) => (
            <div key={rank.rank} className="flex items-baseline gap-2.5">
              <dt
                className={cx(
                  numeric,
                  "shrink-0 rounded-[2px] bg-paper-3 px-1.5 text-[10px] text-ink-2",
                )}
              >
                R{rank.rank}
              </dt>
              <dd className="m-0 min-w-0 text-[13px] leading-snug">
                <GameText text={rank.text} omitNotes className="[&>p]:m-0" />
              </dd>
            </div>
          ))}
        </dl>

        {/*
          Le definizioni dei termini stanno in fondo, una volta per carta. Il
          gioco le ripete in ogni rango identiche: lasciarle li' significava
          stampare tre volte la stessa spiegazione sotto tre righe che
          differiscono per una percentuale.
        */}
        <GameNotes texts={card.ranks.map((rank) => rank.text)} className="mt-2.5" />
      </div>
    </div>
  );
}

/**
 * Le statistiche al massimo livello, nude e equipaggiate.
 *
 * Si mostrano le sei che si guardano davvero. Le altre - quindici per colonna -
 * esistono nel dataset e non qui: una tabella di trenta numeri non e' piu'
 * informativa, e' solo piu' lunga.
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
      <h2 className={cx(eyebrow, "mb-2.5")}>Statistiche al massimo</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-rule text-left">
              <th className="py-1.5 pr-3 font-normal text-ink-3">&nbsp;</th>
              <th className="py-1.5 pr-3 font-normal text-ink-3">Senza equipaggiamento</th>
              <th className="py-1.5 font-normal text-ink-3">Equipaggiato</th>
            </tr>
          </thead>
          <tbody>
            {STAT_ROWS.filter((row) => stats.max[row.key] !== undefined).map((row) => (
              <tr key={row.key} className="border-b border-rule/60">
                <td className="py-1.5 pr-3 text-ink-2">{row.label}</td>
                <td className={cx(numeric, "py-1.5 pr-3")}>
                  {numero(stats.max[row.key]!)}
                  {row.percent ? "%" : ""}
                </td>
                <td className={cx(numeric, "py-1.5 font-medium")}>
                  {stats.maxGeared[row.key] !== undefined
                    ? numero(stats.maxGeared[row.key]!)
                    : "—"}
                  {row.percent && stats.maxGeared[row.key] !== undefined ? "%" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[13px] text-ink-3">
        Da 7dshub.com: nel client non ci sono, le tiene il server del gioco.
      </p>
    </section>
  );
}

function Ability({ label, text }: { label: string; text: string | undefined }) {
  if (!text) return null;

  return (
    <div className="rounded-card border border-rule border-l-[3px] border-l-brand bg-paper-2 p-4">
      <p className={cx(eyebrow, "m-0 mb-1.5")}>{label}</p>
      <GameText text={text} className="text-sm leading-relaxed text-ink-2" />
    </div>
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

