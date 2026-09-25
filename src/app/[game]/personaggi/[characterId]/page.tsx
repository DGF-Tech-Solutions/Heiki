import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { Freshness, formatDate } from "@/components/freshness";
import { PostCard } from "@/components/community/post-card";
import { cx, display, Empty, eyebrow, numeric, Stat, StatGrid, Tag } from "@/components/ui";
import { DistributionChart } from "@/components/distribution-chart";
import { findGame } from "@/lib/games/catalog";
import {
  findCharacter,
  localName,
  resolveCharacter,
  simulateSolo,
  REFERENCE_LEVEL,
} from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";
import { getStore } from "@/lib/community/store";
import { getGuideStore } from "@/lib/guides/store";
import { isStale } from "@/lib/guides/types";
import { sortFeed } from "@/lib/community/ranking";
import { inLingua, intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Scheda personaggio.
 *
 * E' la pagina che porta traffico dai motori di ricerca, quindi e' anche quella
 * con la struttura piu' rigida: stessi blocchi, stesso ordine, per tutti i
 * personaggi di tutti i giochi. Un template ripetibile si riempie in fretta; una
 * pagina disegnata su misura per ogni personaggio non si riempie mai.
 *
 * L'ordine dei blocchi ricalca quello dei siti di riferimento: prima il verdetto
 * sintetico, poi i numeri, poi i dettagli, e in fondo i collegamenti.
 */

const TESTI = testi({
  it: {
    titoloGenerico: "Personaggio · GachaZone",
    titoloPagina: (nome: string) => `${nome} — build, statistiche e danno · GachaZone`,
    descrizione: (nome: string, gioco: string) =>
      `Statistiche, abilità e danno simulato di ${nome} in ${gioco}. Build della community con seed verificabile.`,
    sezioni: {
      sintesi: "Sintesi",
      simulazione: "Danno simulato",
      statistiche: "Statistiche",
      abilita: "Abilità",
      buff: "Effetti",
      guide: "Guide",
      community: "Dalla community",
      collegati: "Altri personaggi",
    },
    personaggi: "Personaggi",
    dati: (patch: string) => `dati ${patch}`,
    datiDiGioco: "Dati di gioco",
    calcoli: "Calcoli",
    motore: (seed: string) => `motore v0.1 · seed ${seed}`,
    bersaglioRiferimento: "il bersaglio di riferimento",
    sintesiPrima: (bersaglio: string, livello: number, nome: string) =>
      `Da solo contro ${bersaglio}, al livello ${livello}, ${nome} produce una mediana di`,
    sintesiDopo: "danni.",
    nonAbbatte: "Da solo non arriva ad abbattere il bersaglio entro il limite di turni.",
    abbatte: (quanti: number, unita: string) =>
      `Lo abbatte in ${quanti} ${unita} nella metà dei tentativi.`,
    dannoMediano: "Danno mediano",
    noveSuDieci: "Nove su dieci",
    turniAlKo: "Turni al KO",
    turni: "turni",
    mai: "mai",
    riuscita: "Riuscita",
    nessunaSimulazione: "Nessuna simulazione disponibile per questo personaggio.",
    tentativi: (quanti: string) => `${quanti} tentativi`,
    stessoSeed:
      "Stesso seed, stesso dataset: chiunque riapra questa pagina ottiene gli stessi numeri.",
    valoriBase: (livello: number) => `Valori base al livello ${livello}, senza equipaggiamento.`,
    statistica: "Statistica",
    valore: "Valore",
    abilita: "Abilità",
    tipo: "Tipo",
    moltiplicatore: "Moltiplicatore",
    ultimate: "Ultimate",
    effettiConcessi: "Effetti concessi",
    nessunEffetto: "Questo personaggio non concede effetti.",
    effetto: "Effetto",
    durata: "Durata",
    aChi: "A chi",
    cumuli: "Cumuli",
    seStesso: "se stesso",
    squadra: "squadra",
    bersaglio: "bersaglio",
    guide: "Guide",
    nessunaGuida: (nome: string) =>
      `Nessuna guida agganciata a ${nome}. I numeri qui sopra li calcola il motore sul dataset corrente: una guida serve per il metodo, non per i valori.`,
    daRivedere: "da rivedere",
    nessunaBuild: (nome: string) => `Nessuno ha ancora condiviso una build con ${nome}.`,
    primo: "Puoi essere il primo",
    indice: "Indice",
    inQuestaPagina: "In questa pagina",
  },
  en: {
    titoloGenerico: "Character · GachaZone",
    titoloPagina: (nome: string) => `${nome} — builds, stats and damage · GachaZone`,
    descrizione: (nome: string, gioco: string) =>
      `Stats, skills and simulated damage for ${nome} in ${gioco}. Community builds with a verifiable seed.`,
    sezioni: {
      sintesi: "Summary",
      simulazione: "Simulated damage",
      statistiche: "Stats",
      abilita: "Skills",
      buff: "Effects",
      guide: "Guides",
      community: "From the community",
      collegati: "Other characters",
    },
    personaggi: "Characters",
    dati: (patch: string) => `data ${patch}`,
    datiDiGioco: "Game data",
    calcoli: "Calculations",
    motore: (seed: string) => `engine v0.1 · seed ${seed}`,
    bersaglioRiferimento: "the reference target",
    sintesiPrima: (bersaglio: string, livello: number, nome: string) =>
      `Solo against ${bersaglio}, at level ${livello}, ${nome} deals a median of`,
    sintesiDopo: "damage.",
    nonAbbatte: "On their own they can't bring the target down within the turn limit.",
    abbatte: (quanti: number, unita: string) =>
      `They bring it down in ${quanti} ${unita} in half of the attempts.`,
    dannoMediano: "Median damage",
    noveSuDieci: "Nine in ten",
    turniAlKo: "Turns to KO",
    turni: "turns",
    mai: "never",
    riuscita: "Success rate",
    nessunaSimulazione: "No simulation available for this character.",
    tentativi: (quanti: string) => `${quanti} attempts`,
    stessoSeed: "Same seed, same dataset: anyone who reopens this page gets the same numbers.",
    valoriBase: (livello: number) => `Base values at level ${livello}, without gear.`,
    statistica: "Stat",
    valore: "Value",
    abilita: "Skill",
    tipo: "Type",
    moltiplicatore: "Multiplier",
    ultimate: "Ultimate Move",
    effettiConcessi: "Effects granted",
    nessunEffetto: "This character grants no effects.",
    effetto: "Effect",
    durata: "Duration",
    aChi: "Applies to",
    cumuli: "Stacks",
    seStesso: "self",
    squadra: "team",
    bersaglio: "target",
    guide: "Guides",
    nessunaGuida: (nome: string) =>
      `No guides linked to ${nome}. The numbers above are calculated by the engine on the current dataset: a guide is for the method, not the values.`,
    daRivedere: "needs review",
    nessunaBuild: (nome: string) => `Nobody has shared a build with ${nome} yet.`,
    primo: "Be the first",
    indice: "Contents",
    inQuestaPagina: "On this page",
  },
});

interface Props {
  params: Promise<{ game: string; characterId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, characterId } = await params;
  const entry = findGame(game);
  const gameModule = entry ? requireGameModule(game) : null;
  const character = gameModule ? findCharacter(gameModule, characterId) : undefined;
  const t = TESTI[await getLocale()];

  if (!character) return { title: t.titoloGenerico };

  return {
    title: t.titoloPagina(character.name),
    description: t.descrizione(character.name, entry?.name ?? ""),
  };
}

/** Gli id sono le ancore della pagina; i nomi arrivano da TESTI.sezioni. */
const SECTIONS = [
  "sintesi",
  "simulazione",
  "statistiche",
  "abilita",
  "buff",
  "guide",
  "community",
  "collegati",
] as const;

export default async function CharacterPage({ params }: Props) {
  const { game, characterId } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const numbers = intlLocale(locale);

  const gameModule = requireGameModule(game);
  const character = findCharacter(gameModule, characterId);
  const actor = resolveCharacter(gameModule, characterId);
  if (!character || !actor) notFound();

  const result = simulateSolo(gameModule, characterId);
  const target = gameModule.targets[0];
  const unit = gameModule.timeUnit === "turns" ? t.turni : "s";

  const actions = Object.values(actor.actions);
  const ultimate = actions.find((action) => action.meta?.["isUltimate"] === true);
  const skills = actions.filter((action) => action.meta?.["isUltimate"] !== true);
  const buffs = Object.values(actor.buffs);

  const store = await getStore();
  const posts = sortFeed(await store.listPosts(game, null, null), "hot")
    .filter((post) => post.attachment?.character === character.name)
    .slice(0, 3);

  const guideStore = await getGuideStore();
  const guides = (await guideStore.list(game)).filter(
    (guide) => guide.characterId === character.id,
  );

  const others = gameModule.characters.filter((item) => item.id !== character.id);

  return (
    <>
      <main className="pt-6 pb-20">
        <Breadcrumb
          items={[
            { label: entry.shortName, href: `/${game}` },
            { label: t.personaggi, href: `/${game}/personaggi` },
            { label: character.name },
          ]}
        />

        <header className="flex flex-wrap items-end gap-4 border-b-2 border-ink pb-5">
          <div>
            <p className={eyebrow}>{entry.shortName}</p>
            <h1 className={cx(display, "mt-2 text-[clamp(28px,4.2vw,44px)]")}>{character.name}</h1>
          </div>
          <div className="mb-1 flex flex-wrap gap-2">
            <Tag tone="brand">{character.affinity}</Tag>
            <Tag>{character.role}</Tag>
            <Tag tone="gold">{character.rarity}★</Tag>
            <Tag>{t.dati(gameModule.dataset.patch)}</Tag>
          </div>
        </header>

        <Freshness
          className="mt-5"
          entries={[
            {
              label: t.datiDiGioco,
              value: `patch ${gameModule.dataset.patch} · ${formatDate(gameModule.dataset.releasedAt, locale)}`,
            },
            { label: t.calcoli, value: t.motore(String(result?.seed ?? "—")) },
          ]}
        />

        <div className="grid items-start gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,220px)]">
          <div className="min-w-0">
            <Section id="sintesi" title={t.sezioni.sintesi}>
              {result ? (
                <>
                  <p className="max-w-[68ch] text-[15px] text-ink-2">
                    {t.sintesiPrima(
                      target ? localName(target, locale) : t.bersaglioRiferimento,
                      REFERENCE_LEVEL,
                      character.name,
                    )}{" "}
                    <strong className="text-ink">
                      {Math.round(result.damage.median).toLocaleString(numbers)}
                    </strong>{" "}
                    {t.sintesiDopo}{" "}
                    {result.timeToKill === null
                      ? t.nonAbbatte
                      : t.abbatte(result.timeToKill.median, unit)}
                  </p>
                  <StatGrid className="mt-4">
                    <Stat
                      label={t.dannoMediano}
                      value={Math.round(result.damage.median).toLocaleString(numbers)}
                    />
                    <Stat
                      label={t.noveSuDieci}
                      small
                      value={`${Math.round(result.damage.p10).toLocaleString(numbers)} – ${Math.round(
                        result.damage.p90,
                      ).toLocaleString(numbers)}`}
                    />
                    <Stat
                      label={t.turniAlKo}
                      value={result.timeToKill === null ? "—" : result.timeToKill.median}
                      unit={result.timeToKill === null ? t.mai : unit}
                    />
                    <Stat label={t.riuscita} value={Math.round(result.killRate * 100)} unit="%" />
                  </StatGrid>
                </>
              ) : (
                <Empty>{t.nessunaSimulazione}</Empty>
              )}
            </Section>

            {result ? (
              <Section id="simulazione" title={t.sezioni.simulazione}>
                <DistributionChart
                  histogram={result.damageHistogram}
                  stats={result.damage}
                  title={t.tentativi(result.iterations.toLocaleString(numbers))}
                  caption={`seed ${result.seed}`}
                />
                <p className="mt-3 text-[13px] text-ink-3">{t.stessoSeed}</p>
              </Section>
            ) : null}

            <Section id="statistiche" title={t.sezioni.statistiche}>
              <p className="mb-3 text-[13px] text-ink-3">{t.valoriBase(REFERENCE_LEVEL)}</p>
              <DataTable
                head={[t.statistica, t.valore]}
                rows={gameModule.statModel.map((definition) => [
                  inLingua(definition.labels, locale) ?? definition.label,
                  formatStat(
                    actor.stats[definition.key] ?? definition.defaultValue,
                    definition.kind,
                    locale,
                  ),
                ])}
              />
            </Section>

            <Section id="abilita" title={t.sezioni.abilita}>
              <DataTable
                head={[t.abilita, t.tipo, t.moltiplicatore]}
                rows={skills.map((action) => [
                  localName(action, locale),
                  action.hits[0]?.category ?? "—",
                  action.hits.length > 0
                    ? `${action.hits.reduce((sum, hit) => sum + hit.motionValue, 0)}%`
                    : "—",
                ])}
              />

              {ultimate ? (
                <div className="mt-4 rounded-card border border-rule border-l-4 border-l-brand bg-brand-soft px-4 py-3">
                  <p className={cx(eyebrow, "m-0")}>{t.ultimate}</p>
                  <p className="m-0 mt-1.5 text-sm">
                    <strong>{localName(ultimate, locale)}</strong> ·{" "}
                    <span className={numeric}>
                      {ultimate.hits.reduce((sum, hit) => sum + hit.motionValue, 0)}%
                    </span>
                  </p>
                </div>
              ) : null}
            </Section>

            <Section id="buff" title={t.effettiConcessi}>
              {buffs.length === 0 ? (
                <Empty>{t.nessunEffetto}</Empty>
              ) : (
                <DataTable
                  head={[t.effetto, t.durata, t.aChi, t.cumuli]}
                  rows={buffs.map((buff) => [
                    localName(buff, locale),
                    `${buff.duration} ${unit}`,
                    buff.appliesTo === "self"
                      ? t.seStesso
                      : buff.appliesTo === "party"
                        ? t.squadra
                        : t.bersaglio,
                    String(buff.maxStacks),
                  ])}
                />
              )}
            </Section>

            {/*
              Le guide agganciate a questo personaggio, con la stessa
              dichiarazione di patch che portano nel loro elenco: se il collegamento
              qui non dicesse che una guida e' vecchia, la scheda personaggio
              diventerebbe il posto da cui si arriva ai numeri scaduti.
            */}
            <Section id="guide" title={t.guide}>
              {guides.length === 0 ? (
                <Empty>{t.nessunaGuida(character.name)}</Empty>
              ) : (
                <ul className="m-0 grid list-none gap-2.5 p-0">
                  {guides.map((guide) => {
                    const stale = isStale(guide.verifiedPatch, gameModule.dataset.patch);
                    return (
                      <li
                        key={guide.id}
                        className="rounded-card border border-rule bg-paper px-4 py-3"
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2.5">
                          <Link
                            href={`/${game}/guide/${guide.slug}`}
                            className="text-sm font-semibold hover:text-brand"
                          >
                            {guide.title}
                          </Link>
                          {stale ? (
                            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-hot">
                              {t.daRivedere}
                            </span>
                          ) : (
                            <Tag tone="brand">patch {guide.verifiedPatch}</Tag>
                          )}
                        </div>
                        <p className="m-0 text-[13px] text-ink-2">{guide.excerpt}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Section>

            <Section id="community" title={t.sezioni.community}>
              {posts.length === 0 ? (
                <Empty>
                  {t.nessunaBuild(character.name)}{" "}
                  <Link href={`/${game}`} className="font-semibold text-brand hover:underline">
                    {t.primo}
                  </Link>
                  .
                </Empty>
              ) : (
                <div className="grid gap-3.5">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </Section>

            <Section id="collegati" title={t.sezioni.collegati}>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {others.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/${game}/personaggi/${item.id}`}
                      className="inline-flex h-8 items-center rounded-card border border-rule px-3 text-[13px] text-ink-2 hover:border-ink-3 hover:text-ink"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Indice con link di salto: le schede sono lunghe e senza indice
              nessuno arriva in fondo. */}
          <nav
            aria-label={t.indice}
            className="hidden lg:sticky lg:top-[78px] lg:block lg:rounded-card lg:border lg:border-rule lg:p-4"
          >
            <p className={cx(eyebrow, "mb-2.5")}>{t.inQuestaPagina}</p>
            <ul className="m-0 grid list-none gap-1.5 p-0">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-[13px] text-ink-2 hover:text-brand">
                    {t.sezioni[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-rule py-8 first:pt-0 last:border-0">
      <h2 className={cx(display, "mb-4 text-xl [font-variation-settings:'wdth'_92]")}>{title}</h2>
      {children}
    </section>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-rule">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-rule bg-paper-2 text-left">
            {head.map((label) => (
              <th
                key={label}
                className="px-3.5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-rule-2 last:border-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cx("px-3.5 py-2.5", cellIndex === 0 ? "font-medium" : numeric)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatStat(value: number, kind: "flat" | "percent", locale: Locale): string {
  return kind === "percent"
    ? `${(value * 100).toFixed(1)}%`
    : Math.round(value).toLocaleString(intlLocale(locale));
}
