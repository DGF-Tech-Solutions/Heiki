import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RoleForm, SponsorToggle, UserSearch } from "./admin-forms";
import { auth } from "@/lib/auth";
import { hasRole, ROLE_LABELS } from "@/lib/auth/permissions";
import { databaseReachable } from "@/lib/db";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { findUsers, listSponsorPlacements, roleCounts } from "@/lib/admin/actions";
import { formatDate } from "@/components/freshness";
import { listGames } from "@/lib/games/catalog";
import { listGameModules } from "@/lib/games/registry";
import { ENGINE_VERSION } from "@/lib/community/verify";
import { cx, display, Empty, eyebrow, SectionHead, Stat, StatGrid, Tag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Amministrazione",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

/**
 * Pannello di amministrazione.
 *
 * Tre cose e non di piu': chi ha quale ruolo, quali slot sponsorizzati sono
 * attivi, e con quali dataset sta girando il sito. Il resto - dataset,
 * migrazioni, contenuti - si fa dagli script, dove le operazioni sono
 * ripetibili e restano in git. Un pannello che fa tutto e' un pannello di cui
 * nessuno conosce lo stato.
 */
export default async function AdminPage({ searchParams }: Props) {
  if (!(await databaseReachable())) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-6 py-12">
        <DemoNotice />
        <SetupHint />
      </main>
    );
  }

  const session = await auth();
  if (!session?.user?.id) redirect("/entra");
  if (!hasRole(session.user.role, "ADMIN")) notFound();

  const { q } = await searchParams;
  const query = q ?? "";

  const [people, counts, sponsors] = await Promise.all([
    findUsers(query),
    roleCounts(),
    listSponsorPlacements(),
  ]);

  const games = listGames();
  const modules = listGameModules();

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-9 pb-24">
      <header className="mb-8">
        <p className={eyebrow}>Riservato</p>
        <h1 className={cx(display, "mt-2.5 text-[32px]")}>Amministrazione</h1>
        <p className="mt-3 max-w-[62ch] text-sm text-ink-2">
          Ruoli, slot sponsorizzati e stato dei dataset. Dataset e migrazioni si gestiscono dagli
          script del repository: le operazioni che cambiano i dati devono restare ripetibili e
          registrate in git.
        </p>
      </header>

      <section className="mb-12">
        <SectionHead title="Persone" />

        <StatGrid className="mb-6">
          {counts.map((entry) => (
            <Stat key={entry.role} label={ROLE_LABELS[entry.role]} value={entry.count} small />
          ))}
        </StatGrid>

        <UserSearch initial={query} />

        {people.length === 0 ? (
          <Empty>
            {query.length > 0
              ? `Nessun risultato per «${query}».`
              : "Nessun account registrato."}
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th className="pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                    Utente
                  </th>
                  <th className="pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                    Iscritto
                  </th>
                  <th className="pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                    Ruolo
                  </th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id} className="border-b border-rule-2 align-middle">
                    <td className="py-2.5 pr-4">
                      <Link href={`/u/${person.username}`} className="font-medium hover:text-brand">
                        {person.username}
                      </Link>
                      <span className="ml-2 font-mono text-[11px] text-ink-3">{person.email}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-[11px] text-ink-3">
                      {formatDate(person.createdAt)}
                    </td>
                    <td className="py-2.5">
                      <RoleForm user={person} self={person.id === session.user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-12">
        <SectionHead title="Slot sponsorizzati" />

        {sponsors.length === 0 ? (
          <Empty>
            Nessuno slot registrato. Gli slot sono una tabella separata dai post: il feed organico
            non può essere riordinato pagando, e la separazione è imposta dallo schema.
          </Empty>
        ) : (
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.id}
                className="flex flex-wrap items-center gap-3 rounded-card border border-rule bg-paper px-4 py-3 text-sm"
              >
                <Tag tone={sponsor.live ? "gold" : "neutral"}>
                  {sponsor.live ? "in corso" : sponsor.active ? "programmato" : "in pausa"}
                </Tag>
                <span className="font-medium">{sponsor.advertiser}</span>
                <span className="text-ink-2">{sponsor.title}</span>
                <span className="ml-auto font-mono text-[11px] text-ink-3">
                  {formatDate(sponsor.startsAt)} → {formatDate(sponsor.endsAt)}
                </span>
                <SponsorToggle id={sponsor.id} active={sponsor.active} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHead title="Stato del sito" />

        <StatGrid className="mb-5">
          <Stat label="Motore di calcolo" value={ENGINE_VERSION} small />
          <Stat label="Giochi previsti" value={games.length} small />
          <Stat label="Giochi navigabili" value={modules.length} small />
        </StatGrid>

        <ul className="m-0 grid list-none gap-2 p-0">
          {games.map((game) => {
            const gameModule = modules.find((item) => item.slug === game.slug);
            return (
              <li
                key={game.slug}
                className="flex flex-wrap items-center gap-3 rounded-card border border-rule bg-paper px-4 py-2.5 text-sm"
              >
                <span className="font-medium">{game.name}</span>
                {gameModule ? (
                  <>
                    <Tag tone="brand">patch {gameModule.dataset.patch}</Tag>
                    <span className="font-mono text-[11px] text-ink-3">
                      {gameModule.characters.length} personaggi · {gameModule.targets.length}{" "}
                      bersagli
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-ink-3">
                      {gameModule.dataset.checksum.slice(0, 12)}
                    </span>
                  </>
                ) : (
                  <Tag>in arrivo</Tag>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[13px] text-ink-3">
          I dataset stanno in file versionati sotto <code className="font-mono">src/lib/games</code>
          , non nel database: si aggiornano con un commit, e ogni calcolo può essere ricondotto alla
          versione con cui è stato prodotto.
        </p>
      </section>
    </main>
  );
}
