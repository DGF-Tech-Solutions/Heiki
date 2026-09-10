import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, Empty, eyebrow, numeric, Stat, StatGrid, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { REFERENCE_LEVEL, simulateTeam } from "@/lib/games/preview";

/**
 * Nemici.
 *
 * Completa il gruppo Database, e non e' riempitivo: sono i bersagli contro cui
 * girano tutti i calcoli del sito. Chi legge una classifica ha il diritto di
 * sapere contro cosa e' stata misurata - altrimenti il numero non significa
 * niente.
 *
 * Per ogni bersaglio si mostra anche quanto ci mette il roster intero: e' il
 * modo piu' diretto per capire quanto e' duro.
 */

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  return {
    title: `Nemici di ${entry?.shortName ?? "gioco"} · GachaZone`,
    description: `Bersagli usati nei calcoli di ${entry?.name ?? "questo gioco"}: punti vita, difesa, resistenze.`,
  };
}

export default async function EnemiesPage({ params }: Props) {
  const { game } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const roster = gameModule.characters.map((character) => character.id);
  const unit = gameModule.timeUnit === "turns" ? "turni" : "s";

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: "Nemici" }]} />

      <header className="mb-5 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>Nemici</h1>
        <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">
          {gameModule.targets.length} bersagli. Sono quelli contro cui girano le simulazioni del
          sito: la classifica e le schede personaggio misurano contro questi.
        </p>
      </header>

      {gameModule.targets.length === 0 ? (
        <Empty>Nessun bersaglio nel dataset.</Empty>
      ) : (
        <div className="grid gap-4">
          {gameModule.targets.map((target) => {
            const result = simulateTeam(gameModule, roster, target.id);
            const resistances = Object.entries(target.resistances);

            return (
              <article key={target.id} className="rounded-card border border-rule bg-paper p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2.5">
                  <h2 className={cx(display, "text-lg [font-variation-settings:'wdth'_92]")}>
                    {target.name}
                  </h2>
                  <span className="flex flex-wrap gap-2">
                    <Tag>livello {target.level}</Tag>
                    {target.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </span>
                </div>

                <StatGrid className="mt-4">
                  <Stat label="Punti vita" value={target.maxHp.toLocaleString("it-IT")} />
                  <Stat label="Difesa" value={target.defense.toLocaleString("it-IT")} />
                  <Stat
                    label={`Roster intero: KO in`}
                    value={result?.timeToKill === null || !result ? "—" : result.timeToKill.median}
                    unit={result?.timeToKill ? unit : "mai"}
                  />
                  <Stat
                    label="Riuscita"
                    value={result ? Math.round(result.killRate * 100) : "—"}
                    unit={result ? "%" : undefined}
                  />
                </StatGrid>

                {resistances.length > 0 ? (
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
                    {resistances.map(([kind, value]) => (
                      <div key={kind} className="flex items-baseline gap-2">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                          {kind}
                        </dt>
                        <dd className={cx(numeric, "m-0 text-[13px]")}>
                          {(value * 100).toFixed(0)}%
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2.5 border-t border-rule-2 pt-3.5">
                  <Link
                    href={`/${game}/classifica?bersaglio=${target.id}`}
                    className="text-[13px] font-semibold text-brand hover:underline"
                  >
                    Classifica su questo bersaglio →
                  </Link>
                  <Link
                    href={`/${game}/strumenti?bersaglio=${target.id}`}
                    className="text-[13px] text-ink-2 hover:text-brand"
                  >
                    Provaci una squadra
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-[13px] text-ink-3">
        I tempi indicati usano tutti i {roster.length} personaggi del dataset al livello{" "}
        {REFERENCE_LEVEL}, con la priorità automatica delle azioni.
      </p>
    </main>
  );
}
