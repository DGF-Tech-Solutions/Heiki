import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
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
import type { HeroAffinity, HeroEntry } from "@/lib/games/types";

/**
 * Scheda del singolo eroe.
 *
 * Mostra quello che il client del gioco sa davvero: nome, epiteto, rarita',
 * attributo e i testi che il gioco stesso gli assegna. Non ci sono statistiche
 * perche' non sono nel client - le scarica il gioco - e inventarle qui
 * significherebbe pubblicare numeri falsi su una pagina che sembra autorevole.
 * Quando ci saranno, andranno qui sotto.
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

  const { entry, roster, hero, text, assets, affinity } = found;

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

              {assets.skill ? (
                <div className="mt-6 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroSkillIconSrc(game, hero.id)}
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 rounded-card border border-rule bg-paper-2"
                  />
                  <div>
                    <p className={cx(eyebrow, "m-0")}>Abilità esclusiva</p>
                    <p className="m-0 mt-1 text-[13px] text-ink-3">
                      L’icona è nel client; il nome e gli effetti arrivano dal server.
                    </p>
                  </div>
                </div>
              ) : null}
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
          sono gli unici testi sulle abilita' che il client lega all'heroId.

          Le descrizioni della singola abilita' esistono - 3.187 passive e 463
          attacchi - ma sono indicizzate con id propri, e la tabella che li
          associa a un eroe sta sul server. Cercare di indovinare
          l'accostamento produrrebbe schede autorevoli e sbagliate.
        */}
        {text?.loading || text?.summon ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>In combattimento</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Ability label="Cosa fanno le sue abilità" text={text.loading} />
              <Ability label="Ruolo in squadra" text={text.summon} />
            </div>

            <p className="mt-3 text-[13px] text-ink-3">
              Il client descrive l’eroe nell’insieme. Le descrizioni della singola abilità stanno sul
              server del gioco, non qui.
            </p>
          </section>
        ) : null}

        {assets?.cards ? (
          <section className="mb-7">
            <h2 className={cx(eyebrow, "mb-2.5")}>
              Carte d’attacco · {assets.cards}
              {assets.cardsApprox ? (
                <span className="ml-2 normal-case tracking-normal text-ink-3">
                  (stesso personaggio, grado di uscita diverso: da verificare)
                </span>
              ) : null}
            </h2>

            {/*
              Sprite e descrizione affiancati, una riga per carta: e' la forma
              che serve, ed e' gia' quella giusta anche adesso che la colonna di
              destra ha poco da dire.

              Quel poco e' esatto. Il testo che il gioco stampa sulla carta si
              compone di un modello - "Inflicts damage equal to {melee_val} of
              Attack on {target_val}" - piu' i valori, e nel client c'e' solo il
              modello, senza il legame con l'eroe. Mettere qui il riassunto
              generale dell'eroe farebbe sembrare descritta ogni singola carta:
              sarebbe una nostra interpretazione travestita da dato.
            */}
            <ul className="m-0 grid list-none gap-3 p-0">
              {Array.from({ length: assets.cards }, (_, index) => (
                <li
                  key={index}
                  className="grid items-start gap-4 rounded-card border border-rule bg-paper p-3"
                  style={{ gridTemplateColumns: "84px minmax(0, 1fr)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroCardArtSrc(game, hero.id, index + 1)}
                    alt=""
                    width={128}
                    height={256}
                    loading="lazy"
                    className="block w-full rounded-[3px] bg-paper-2"
                  />

                  <div className="min-w-0">
                    <p className={cx(eyebrow, "m-0")}>Carta {index + 1}</p>
                    <p className="m-0 mt-1.5 text-[13px] text-ink-3">
                      Descrizione non presente nel client.
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Hits hits={assets.hits} />
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

