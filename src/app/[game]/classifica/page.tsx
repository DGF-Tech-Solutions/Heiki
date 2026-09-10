import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameNav } from "@/components/game-nav";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, eyebrow, Notice, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { rankCharacters, REFERENCE_LEVEL } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";

/**
 * Classifica per danno simulato.
 *
 * Non e' una tier list di opinioni. Ogni personaggio gira contro lo stesso
 * bersaglio, allo stesso livello, con lo stesso seed e lo stesso numero di
 * iterazioni: cambia solo il personaggio. I presupposti sono dichiarati in cima,
 * cosi' si puo' discutere di quelli invece che dei gusti di chi ha compilato
 * l'elenco.
 */

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ bersaglio?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  return {
    title: `Classifica danno — ${entry?.shortName ?? "gioco"} · GachaZone`,
    description: `Personaggi di ${entry?.name ?? "questo gioco"} ordinati per danno mediano simulato, a parità di condizioni.`,
  };
}

export default async function RankingPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { bersaglio } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const module = requireGameModule(game);
  const target =
    module.targets.find((item) => item.id === bersaglio) ?? module.targets[0];
  const ranked = rankCharacters(module, target?.id);
  const best = ranked[0]?.result.damage.median ?? 1;
  const unit = module.timeUnit === "turns" ? "turni" : "s";

  return (
    <>
      <GameNav game={game} section="/classifica" />

      <main className="mx-auto w-full max-w-[1200px] px-6 pt-6 pb-20">
        <Breadcrumb
          items={[{ label: entry.shortName, href: `/${game}` }, { label: "Classifica" }]}
        />

        <header className="mb-5 border-b border-rule pb-5">
          <p className={eyebrow}>{entry.shortName}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>Classifica danno</h1>
          <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">
            Ordinata per danno mediano su {ranked[0]?.result.iterations.toLocaleString("it-IT") ?? 0}{" "}
            simulazioni. Stesso livello ({REFERENCE_LEVEL}), stesso bersaglio, stesso seed per tutti:
            cambia solo il personaggio.
          </p>
        </header>

        <Notice className="mb-5">
          <span>
            Questi numeri escono da <strong>dati segnaposto</strong>: il motore è corretto, i valori
            dei personaggi no. Servono a mostrare come funziona la classifica, non a decidere chi
            potenziare.
          </span>
        </Notice>

        {module.targets.length > 1 ? (
          <nav className="mb-4 flex flex-wrap items-center gap-2" aria-label="Bersaglio">
            <span className={cx(eyebrow, "mr-1")}>Bersaglio</span>
            {module.targets.map((item) => (
              <Link
                key={item.id}
                href={`/${game}/classifica?bersaglio=${item.id}`}
                className={cx(
                  "inline-flex h-8 items-center rounded-card border px-3 text-[13px] transition-colors",
                  item.id === target?.id
                    ? "border-brand bg-brand-soft font-medium text-ink"
                    : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        ) : null}

        <ol className="m-0 grid list-none gap-2 p-0">
          {ranked.map((row, index) => {
            const share = Math.max(4, Math.round((row.result.damage.median / best) * 100));
            return (
              <li
                key={row.character.id}
                className="relative overflow-hidden rounded-card border border-rule bg-paper"
              >
                {/* La barra e' la classifica: si legge la distanza fra i primi
                    e gli altri senza dover confrontare cifre. */}
                <span
                  className="absolute inset-y-0 left-0 bg-brand-soft"
                  style={{ width: `${share}%` }}
                  aria-hidden
                />
                <div className="relative flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className={cx(numeric, "w-6 text-ink-3")}>{index + 1}</span>

                  <Link
                    href={`/${game}/personaggi/${row.character.id}`}
                    className="font-semibold hover:text-brand"
                  >
                    {row.character.name}
                  </Link>

                  <Tag>{row.character.affinity}</Tag>
                  <Tag>{row.character.role}</Tag>

                  <span className="ml-auto flex flex-wrap items-baseline gap-4">
                    <span className={cx(numeric, "text-lg font-medium")}>
                      {Math.round(row.result.damage.median).toLocaleString("it-IT")}
                    </span>
                    <span className={cx(numeric, "text-xs text-ink-3")}>
                      {row.result.timeToKill === null
                        ? "nessun KO"
                        : `${row.result.timeToKill.median} ${unit}`}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </>
  );
}
