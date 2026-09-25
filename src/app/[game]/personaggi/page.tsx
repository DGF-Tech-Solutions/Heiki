import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, Empty, eyebrow, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { localName, rankCharacters } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Personaggi di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Elenco dei personaggi di ${gioco} con statistiche e danno simulato.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    personaggi: "Personaggi",
    introduzione: (quanti: number, patch: string, bersaglio: string) =>
      `${quanti} personaggi nel dataset ${patch}. Il danno è simulato da solo contro ${bersaglio}, a parità di livello.`,
    bersaglioRiferimento: "il bersaglio di riferimento",
    ruolo: "Ruolo",
    tutti: "Tutti",
    nessunPersonaggio: "Nessun personaggio con questo ruolo.",
    personaggio: "Personaggio",
    dannoMediano: "Danno mediano",
    turniAlKo: "Turni al KO",
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Characters · GachaZone`,
    descrizione: (gioco: string) => `List of ${gioco} characters with stats and simulated damage.`,
    gioco: "game",
    questoGioco: "this game",
    personaggi: "Characters",
    introduzione: (quanti: number, patch: string, bersaglio: string) =>
      `${quanti} ${quanti === 1 ? "character" : "characters"} in dataset ${patch}. Damage is simulated solo against ${bersaglio}, at the same level.`,
    bersaglioRiferimento: "the reference target",
    ruolo: "Role",
    tutti: "All",
    nessunPersonaggio: "No characters with this role.",
    personaggio: "Character",
    dannoMediano: "Median damage",
    turniAlKo: "Turns to KO",
  },
});

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ ruolo?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? t.gioco),
    description: t.descrizione(entry?.name ?? t.questoGioco),
  };
}

export default async function CharacterListPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { ruolo } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const gameModule = requireGameModule(game);
  const ranked = rankCharacters(gameModule);
  const roles = [...new Set(gameModule.characters.map((character) => character.role))].sort();
  const visible = ruolo ? ranked.filter((row) => row.character.role === ruolo) : ranked;
  const reference = gameModule.targets[0];

  return (
    <>
      <main className="pt-6 pb-20">
        <Breadcrumb
          items={[{ label: entry.shortName, href: `/${game}` }, { label: t.personaggi }]}
        />

        <header className="mb-5 border-b border-rule pb-5">
          <p className={eyebrow}>{entry.shortName}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.personaggi}</h1>
          <p className="mt-2.5 max-w-[64ch] text-sm text-ink-2">
            {t.introduzione(
              gameModule.characters.length,
              gameModule.dataset.patch,
              reference ? localName(reference, locale) : t.bersaglioRiferimento,
            )}
          </p>
        </header>

        <nav className="mb-4 flex flex-wrap gap-2" aria-label={t.ruolo}>
          <FilterLink game={game} value={null} active={!ruolo} label={t.tutti} />
          {roles.map((role) => (
            <FilterLink key={role} game={game} value={role} active={ruolo === role} label={role} />
          ))}
        </nav>

        {visible.length === 0 ? (
          <Empty>{t.nessunPersonaggio}</Empty>
        ) : (
          <div className="overflow-x-auto rounded-card border border-rule">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper-2 text-left">
                  <Th className="w-10">#</Th>
                  <Th>{t.personaggio}</Th>
                  <Th>{t.ruolo}</Th>
                  <Th className="text-right">{t.dannoMediano}</Th>
                  <Th className="text-right">{t.turniAlKo}</Th>
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
                      {Math.round(row.result.damage.median).toLocaleString(intlLocale(locale))}
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
