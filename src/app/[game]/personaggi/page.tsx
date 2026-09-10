import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameNav } from "@/components/game-nav";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, Empty, eyebrow, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { rankCharacters } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ ruolo?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  return {
    title: `Personaggi di ${entry?.shortName ?? "gioco"} · GachaZone`,
    description: `Elenco dei personaggi di ${entry?.name ?? "questo gioco"} con statistiche e danno simulato.`,
  };
}

export default async function CharacterListPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { ruolo } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const module = requireGameModule(game);
  const ranked = rankCharacters(module);
  const roles = [...new Set(module.characters.map((character) => character.role))].sort();
  const visible = ruolo ? ranked.filter((row) => row.character.role === ruolo) : ranked;

  return (
    <>
      <GameNav game={game} section="/personaggi" />

      <main className="mx-auto w-full max-w-[1200px] px-6 pt-6 pb-20">
        <Breadcrumb
          items={[{ label: entry.shortName, href: `/${game}` }, { label: "Personaggi" }]}
        />

        <header className="mb-5 border-b border-rule pb-5">
          <p className={eyebrow}>{entry.shortName}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>Personaggi</h1>
          <p className="mt-2.5 max-w-[64ch] text-sm text-ink-2">
            {module.characters.length} personaggi nel dataset {module.dataset.patch}. Il danno è
            simulato da solo contro {module.targets[0]?.name ?? "il bersaglio di riferimento"}, a
            parità di livello.
          </p>
        </header>

        <nav className="mb-4 flex flex-wrap gap-2" aria-label="Ruolo">
          <FilterLink game={game} value={null} active={!ruolo} label="Tutti" />
          {roles.map((role) => (
            <FilterLink key={role} game={game} value={role} active={ruolo === role} label={role} />
          ))}
        </nav>

        {visible.length === 0 ? (
          <Empty>Nessun personaggio con questo ruolo.</Empty>
        ) : (
          <div className="overflow-x-auto rounded-card border border-rule">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-2 text-left">
                  <Th className="w-10">#</Th>
                  <Th>Personaggio</Th>
                  <Th>Ruolo</Th>
                  <Th className="text-right">Danno mediano</Th>
                  <Th className="text-right">Turni al KO</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row, index) => (
                  <tr key={row.character.id} className="border-b border-rule-2 last:border-0">
                    <Td className={cx(numeric, "text-ink-3")}>{index + 1}</Td>
                    <Td>
                      <Link
                        href={`/${game}/personaggi/${row.character.id}`}
                        className="font-semibold hover:text-brand"
                      >
                        {row.character.name}
                      </Link>
                      <span className="ml-2">
                        <Tag>{row.character.affinity}</Tag>
                      </span>
                    </Td>
                    <Td className="text-ink-2">{row.character.role}</Td>
                    <Td className={cx(numeric, "text-right font-medium")}>
                      {Math.round(row.result.damage.median).toLocaleString("it-IT")}
                    </Td>
                    <Td className={cx(numeric, "text-right text-ink-2")}>
                      {row.result.timeToKill === null ? "—" : row.result.timeToKill.median}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

function FilterLink({
  game,
  value,
  active,
  label,
}: {
  game: string;
  value: string | null;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={value ? `/${game}/personaggi?ruolo=${value}` : `/${game}/personaggi`}
      className={cx(
        "inline-flex h-8 items-center rounded-card border px-3 text-[13px] transition-colors",
        active
          ? "border-brand bg-brand-soft font-medium text-ink"
          : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cx(
        "px-3.5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cx("px-3.5 py-3", className)}>{children}</td>;
}
