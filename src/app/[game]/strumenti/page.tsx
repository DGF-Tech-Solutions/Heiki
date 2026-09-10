import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameNav } from "@/components/game-nav";
import { Breadcrumb } from "@/components/breadcrumb";
import { DistributionChart } from "@/components/distribution-chart";
import { cx, display, Empty, eyebrow, Notice, Stat, StatGrid, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { REFERENCE_LEVEL, simulateTeam } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";

/**
 * Simulatore di squadra.
 *
 * La selezione vive nell'indirizzo, non in uno stato del browser: cosi' una
 * squadra si condivide incollando il link, e chi lo apre vede esattamente gli
 * stessi numeri. E' la stessa ragione per cui il motore e' seedato.
 *
 * E' l'abbozzo del calcolatore vero: quando arrivera' il costruttore di
 * rotazioni prendera' il posto di questa pagina, ma il contratto non cambia.
 */

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ squadra?: string; bersaglio?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  return {
    title: `Simulatore squadra — ${entry?.shortName ?? "gioco"} · GachaZone`,
    description: `Componi una squadra di ${entry?.name ?? "questo gioco"} e vedi quanto danno fa, in quanti turni e con che probabilità.`,
  };
}

export default async function ToolsPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { squadra, bersaglio } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const module = requireGameModule(game);
  const valid = new Set(module.characters.map((character) => character.id));

  const selected = (squadra ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => valid.has(id));

  const target = module.targets.find((item) => item.id === bersaglio) ?? module.targets[0];
  const result = selected.length > 0 ? simulateTeam(module, selected, target?.id) : null;
  const unit = module.timeUnit === "turns" ? "turni" : "s";

  const teamLink = (ids: readonly string[], targetId?: string) => {
    const search = new URLSearchParams();
    if (ids.length > 0) search.set("squadra", ids.join(","));
    if (targetId && targetId !== module.targets[0]?.id) search.set("bersaglio", targetId);
    const suffix = search.toString();
    return suffix ? `/${game}/strumenti?${suffix}` : `/${game}/strumenti`;
  };

  return (
    <>
      <GameNav game={game} section="/strumenti" />

      <main className="mx-auto w-full max-w-[1200px] px-6 pt-6 pb-20">
        <Breadcrumb
          items={[{ label: entry.shortName, href: `/${game}` }, { label: "Strumenti" }]}
        />

        <header className="mb-5 border-b border-rule pb-5">
          <p className={eyebrow}>{entry.shortName}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>Simulatore squadra</h1>
          <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">
            Scegli i personaggi e il bersaglio. La squadra finisce nell&apos;indirizzo, quindi puoi
            condividere il link e chi lo apre vede gli stessi numeri.
          </p>
        </header>

        <Notice className="mb-5">
          <span>
            Dati dei personaggi <strong>segnaposto</strong>. Il costruttore di rotazioni — dove
            scegli l&apos;ordine delle azioni invece di lasciarlo alla priorità automatica — arriva
            dopo.
          </span>
        </Notice>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="grid gap-4">
            <section className="rounded-card border border-rule bg-paper p-4">
              <h2 className={cx(display, "mb-3 text-[15px] [font-variation-settings:'wdth'_92]")}>
                Squadra
              </h2>

              <ul className="m-0 grid list-none gap-1.5 p-0">
                {module.characters.map((character) => {
                  const active = selected.includes(character.id);
                  const next = active
                    ? selected.filter((id) => id !== character.id)
                    : [...selected, character.id];

                  return (
                    <li key={character.id}>
                      <Link
                        href={teamLink(next, target?.id)}
                        aria-pressed={active}
                        className={cx(
                          "flex items-center gap-2.5 rounded-card border px-3 py-2 text-sm transition-colors",
                          active
                            ? "border-brand bg-brand-soft font-medium"
                            : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                        )}
                      >
                        <span
                          className={cx(
                            "grid size-4 place-items-center rounded-sm border text-[9px]",
                            active ? "border-brand bg-brand text-white" : "border-rule",
                          )}
                          aria-hidden
                        >
                          {active ? "✓" : ""}
                        </span>
                        <span className="flex-1">{character.name}</span>
                        <Tag>{character.role}</Tag>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {selected.length > 0 ? (
                <Link
                  href={teamLink([], target?.id)}
                  className="mt-3 inline-block text-xs text-ink-3 hover:text-ink"
                >
                  Svuota la squadra
                </Link>
              ) : null}
            </section>

            <section className="rounded-card border border-rule bg-paper p-4">
              <h2 className={cx(display, "mb-3 text-[15px] [font-variation-settings:'wdth'_92]")}>
                Bersaglio
              </h2>
              <ul className="m-0 grid list-none gap-1.5 p-0">
                {module.targets.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={teamLink(selected, item.id)}
                      className={cx(
                        "flex items-baseline justify-between gap-2 rounded-card border px-3 py-2 text-sm transition-colors",
                        item.id === target?.id
                          ? "border-brand bg-brand-soft font-medium"
                          : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                      )}
                    >
                      <span>{item.name}</span>
                      <span className="font-mono text-[10px] text-ink-3">
                        lv {item.level} · {Math.round(item.maxHp / 1000)}k HP
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="min-w-0">
            {result === null ? (
              <Empty>Scegli almeno un personaggio per calcolare.</Empty>
            ) : (
              <div className="grid gap-5">
                <StatGrid>
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

                <DistributionChart
                  histogram={result.damageHistogram}
                  stats={result.damage}
                  title={`${result.iterations.toLocaleString("it-IT")} tentativi · livello ${REFERENCE_LEVEL}`}
                  caption={`seed ${result.seed}`}
                />

                <p className="text-[13px] text-ink-3">
                  Squadra:{" "}
                  {selected
                    .map((id) => module.characters.find((c) => c.id === id)?.name ?? id)
                    .join(" · ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
