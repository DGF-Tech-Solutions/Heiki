import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameNav } from "@/components/game-nav";
import { PostCard } from "@/components/community/post-card";
import { cx, display, Empty, eyebrow, numeric, Stat, StatGrid, Tag } from "@/components/ui";
import { DistributionChart } from "@/components/distribution-chart";
import { findGame } from "@/lib/games/catalog";
import { findCharacter, resolveCharacter, simulateSolo, REFERENCE_LEVEL } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";
import { getStore } from "@/lib/community/store";
import { sortFeed } from "@/lib/community/ranking";

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

interface Props {
  params: Promise<{ game: string; characterId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, characterId } = await params;
  const entry = findGame(game);
  const module = entry ? requireGameModule(game) : null;
  const character = module ? findCharacter(module, characterId) : undefined;

  if (!character) return { title: "Personaggio · GachaZone" };

  return {
    title: `${character.name} — build, statistiche e danno · GachaZone`,
    description: `Statistiche, abilità e danno simulato di ${character.name} in ${entry?.name}. Build della community con seed verificabile.`,
  };
}

const SECTIONS = [
  { id: "sintesi", label: "Sintesi" },
  { id: "simulazione", label: "Danno simulato" },
  { id: "statistiche", label: "Statistiche" },
  { id: "abilita", label: "Abilità" },
  { id: "buff", label: "Effetti" },
  { id: "community", label: "Dalla community" },
  { id: "collegati", label: "Altri personaggi" },
] as const;

export default async function CharacterPage({ params }: Props) {
  const { game, characterId } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const module = requireGameModule(game);
  const character = findCharacter(module, characterId);
  const actor = resolveCharacter(module, characterId);
  if (!character || !actor) notFound();

  const result = simulateSolo(module, characterId);
  const target = module.targets[0];
  const unit = module.timeUnit === "turns" ? "turni" : "s";

  const actions = Object.values(actor.actions);
  const ultimate = actions.find((action) => action.meta?.["isUltimate"] === true);
  const skills = actions.filter((action) => action.meta?.["isUltimate"] !== true);
  const buffs = Object.values(actor.buffs);

  const store = await getStore();
  const posts = sortFeed(await store.listPosts(game, null, null), "hot")
    .filter((post) => post.attachment?.character === character.name)
    .slice(0, 3);

  const others = module.characters.filter((item) => item.id !== character.id);

  return (
    <>
      <GameNav game={game} section="/personaggi" />

      <main className="mx-auto w-full max-w-[1200px] px-6 pt-6 pb-20">
        <Link
          href={`/${game}/personaggi`}
          className="mb-4 inline-block font-mono text-xs text-ink-3 hover:text-ink"
        >
          ← Personaggi
        </Link>

        <header className="flex flex-wrap items-end gap-4 border-b-2 border-ink pb-5">
          <div>
            <p className={eyebrow}>{entry.shortName}</p>
            <h1 className={cx(display, "mt-2 text-[clamp(28px,4.2vw,44px)]")}>{character.name}</h1>
          </div>
          <div className="mb-1 flex flex-wrap gap-2">
            <Tag tone="brand">{character.affinity}</Tag>
            <Tag>{character.role}</Tag>
            <Tag tone="gold">{character.rarity}★</Tag>
            <Tag>dati {module.dataset.patch}</Tag>
          </div>
        </header>

        <div className="grid items-start gap-10 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,220px)]">
          <div className="min-w-0">
            <Section id="sintesi" title="Sintesi">
              {result ? (
                <>
                  <p className="max-w-[68ch] text-[15px] text-ink-2">
                    Da solo contro {target?.name ?? "il bersaglio di riferimento"}, al livello{" "}
                    {REFERENCE_LEVEL}, {character.name} produce una mediana di{" "}
                    <strong className="text-ink">
                      {Math.round(result.damage.median).toLocaleString("it-IT")}
                    </strong>{" "}
                    danni.{" "}
                    {result.timeToKill === null
                      ? "Da solo non arriva ad abbattere il bersaglio entro il limite di turni."
                      : `Lo abbatte in ${result.timeToKill.median} ${unit} nella metà dei tentativi.`}
                  </p>
                  <StatGrid className="mt-4">
                    <Stat
                      label="Danno mediano"
                      value={Math.round(result.damage.median).toLocaleString("it-IT")}
                    />
                    <Stat
                      label="Nove su dieci"
                      small
                      value={`${Math.round(result.damage.p10).toLocaleString("it-IT")} – ${Math.round(
                        result.damage.p90,
                      ).toLocaleString("it-IT")}`}
                    />
                    <Stat
                      label="Turni al KO"
                      value={result.timeToKill === null ? "—" : result.timeToKill.median}
                      unit={result.timeToKill === null ? "mai" : unit}
                    />
                    <Stat label="Riuscita" value={Math.round(result.killRate * 100)} unit="%" />
                  </StatGrid>
                </>
              ) : (
                <Empty>Nessuna simulazione disponibile per questo personaggio.</Empty>
              )}
            </Section>

            {result ? (
              <Section id="simulazione" title="Danno simulato">
                <DistributionChart
                  histogram={result.damageHistogram}
                  stats={result.damage}
                  title={`${result.iterations.toLocaleString("it-IT")} tentativi`}
                  caption={`seed ${result.seed}`}
                />
                <p className="mt-3 text-[13px] text-ink-3">
                  Stesso seed, stesso dataset: chiunque riapra questa pagina ottiene gli stessi
                  numeri.
                </p>
              </Section>
            ) : null}

            <Section id="statistiche" title="Statistiche">
              <p className="mb-3 text-[13px] text-ink-3">
                Valori base al livello {REFERENCE_LEVEL}, senza equipaggiamento.
              </p>
              <DataTable
                head={["Statistica", "Valore"]}
                rows={module.statModel.map((definition) => [
                  definition.label,
                  formatStat(actor.stats[definition.key] ?? definition.defaultValue, definition.kind),
                ])}
              />
            </Section>

            <Section id="abilita" title="Abilità">
              <DataTable
                head={["Abilità", "Tipo", "Moltiplicatore"]}
                rows={skills.map((action) => [
                  action.name,
                  action.hits[0]?.category ?? "—",
                  action.hits.length > 0
                    ? `${action.hits.reduce((sum, hit) => sum + hit.motionValue, 0)}%`
                    : "—",
                ])}
              />

              {ultimate ? (
                <div className="mt-4 rounded-card border border-rule border-l-4 border-l-brand bg-brand-soft px-4 py-3">
                  <p className={cx(eyebrow, "m-0")}>Ultimate</p>
                  <p className="m-0 mt-1.5 text-sm">
                    <strong>{ultimate.name}</strong> ·{" "}
                    <span className={numeric}>
                      {ultimate.hits.reduce((sum, hit) => sum + hit.motionValue, 0)}%
                    </span>
                  </p>
                </div>
              ) : null}
            </Section>

            <Section id="buff" title="Effetti concessi">
              {buffs.length === 0 ? (
                <Empty>Questo personaggio non concede effetti.</Empty>
              ) : (
                <DataTable
                  head={["Effetto", "Durata", "A chi", "Cumuli"]}
                  rows={buffs.map((buff) => [
                    buff.name,
                    `${buff.duration} ${unit}`,
                    buff.appliesTo === "self"
                      ? "se stesso"
                      : buff.appliesTo === "party"
                        ? "squadra"
                        : "bersaglio",
                    String(buff.maxStacks),
                  ])}
                />
              )}
            </Section>

            <Section id="community" title="Dalla community">
              {posts.length === 0 ? (
                <Empty>
                  Nessuno ha ancora condiviso una build con {character.name}.{" "}
                  <Link href={`/${game}`} className="font-semibold text-brand hover:underline">
                    Puoi essere il primo
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

            <Section id="collegati" title="Altri personaggi">
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
            aria-label="Indice"
            className="hidden lg:sticky lg:top-[78px] lg:block lg:rounded-card lg:border lg:border-rule lg:p-4"
          >
            <p className={cx(eyebrow, "mb-2.5")}>In questa pagina</p>
            <ul className="m-0 grid list-none gap-1.5 p-0">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-[13px] text-ink-2 hover:text-brand">
                    {section.label}
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

function formatStat(value: number, kind: "flat" | "percent"): string {
  return kind === "percent"
    ? `${(value * 100).toFixed(1)}%`
    : Math.round(value).toLocaleString("it-IT");
}
