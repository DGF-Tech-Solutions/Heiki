import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RoleForm, SponsorToggle, UserSearch } from "./admin-forms";
import { auth } from "@/lib/auth";
import { hasRole, roleLabel } from "@/lib/auth/permissions";
import { databaseReachable } from "@/lib/db";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { findUsers, listSponsorPlacements, roleCounts } from "@/lib/admin/actions";
import { formatDate } from "@/components/freshness";
import { listGames } from "@/lib/games/catalog";
import { listGameModules } from "@/lib/games/registry";
import { ENGINE_VERSION } from "@/lib/community/verify";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { cx, display, Empty, eyebrow, SectionHead, Stat, StatGrid, Tag } from "@/components/ui";

const TESTI = testi({
  it: {
    titoloPagina: "Amministrazione",
    riservato: "Riservato",
    titolo: "Amministrazione",
    introduzione:
      "Ruoli, slot sponsorizzati e stato dei dataset. Dataset e migrazioni si gestiscono dagli script del repository: le operazioni che cambiano i dati devono restare ripetibili e registrate in git.",
    persone: "Persone",
    nessunRisultato: (query: string) => `Nessun risultato per «${query}».`,
    nessunAccount: "Nessun account registrato.",
    utente: "Utente",
    iscritto: "Iscritto",
    ruolo: "Ruolo",
    slotSponsorizzati: "Slot sponsorizzati",
    nessunoSlot:
      "Nessuno slot registrato. Gli slot sono una tabella separata dai post: il feed organico non può essere riordinato pagando, e la separazione è imposta dallo schema.",
    inCorso: "in corso",
    programmato: "programmato",
    inPausa: "in pausa",
    statoDelSito: "Stato del sito",
    motoreDiCalcolo: "Motore di calcolo",
    giochiPrevisti: "Giochi previsti",
    giochiNavigabili: "Giochi navigabili",
    patch: (patch: string) => `patch ${patch}`,
    contenuti: (personaggi: number, bersagli: number) =>
      `${personaggi} personaggi · ${bersagli} bersagli`,
    inArrivo: "in arrivo",
    datasetPrima: "I dataset stanno in file versionati sotto",
    datasetDopo:
      ", non nel database: si aggiornano con un commit, e ogni calcolo può essere ricondotto alla versione con cui è stato prodotto.",
  },
  en: {
    titoloPagina: "Administration",
    riservato: "Restricted",
    titolo: "Administration",
    introduzione:
      "Roles, sponsored slots and dataset status. Datasets and migrations are managed with the repository scripts: operations that change data must stay repeatable and recorded in git.",
    persone: "People",
    nessunRisultato: (query: string) => `No results for “${query}”.`,
    nessunAccount: "No registered accounts.",
    utente: "User",
    iscritto: "Joined",
    ruolo: "Role",
    slotSponsorizzati: "Sponsored slots",
    nessunoSlot:
      "No slots registered. Slots live in a table separate from posts: the organic feed can't be reordered by paying, and the schema enforces the separation.",
    inCorso: "live",
    programmato: "scheduled",
    inPausa: "paused",
    statoDelSito: "Site status",
    motoreDiCalcolo: "Calculation engine",
    giochiPrevisti: "Planned games",
    giochiNavigabili: "Browsable games",
    patch: (patch: string) => `patch ${patch}`,
    contenuti: (personaggi: number, bersagli: number) =>
      `${personaggi} characters · ${bersagli} targets`,
    inArrivo: "coming soon",
    datasetPrima: "Datasets live in versioned files under",
    datasetDopo:
      ", not in the database: they're updated with a commit, and every calculation can be traced back to the version that produced it.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

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

  const locale = await getLocale();
  const t = TESTI[locale];

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-9 pb-24">
      <header className="mb-8">
        <p className={eyebrow}>{t.riservato}</p>
        <h1 className={cx(display, "mt-2.5 text-[32px]")}>{t.titolo}</h1>
        <p className="mt-3 max-w-[48ch] text-sm text-ink-2">{t.introduzione}</p>
      </header>

      <section className="mb-12">
        <SectionHead title={t.persone} />

        <StatGrid className="mb-6">
          {counts.map((entry) => (
            <Stat
              key={entry.role}
              label={roleLabel(entry.role, locale)}
              value={entry.count}
              small
            />
          ))}
        </StatGrid>

        <UserSearch initial={query} />

        {people.length === 0 ? (
          <Empty>{query.length > 0 ? t.nessunRisultato(query) : t.nessunAccount}</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th className="pb-2 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
                    {t.utente}
                  </th>
                  <th className="pb-2 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
                    {t.iscritto}
                  </th>
                  <th className="pb-2 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
                    {t.ruolo}
                  </th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr key={person.id} className="border-b border-rule-2 align-middle">
                    <td className="py-2.5 pr-4">
                      <Link href={`/u/${person.username}`} className="font-medium hover:text-brand-deep">
                        {person.username}
                      </Link>
                      <span className="ml-2 font-mono text-[11px] text-ink-3">{person.email}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-[11px] text-ink-3">
                      {formatDate(person.createdAt, locale)}
                    </td>
                    <td className="py-2.5">
                      {/* al componente del browser solo cio' che gli serve: l'email
                          finirebbe nei dati serializzati della pagina */}
                      <RoleForm
                        user={{ id: person.id, username: person.username, role: person.role }}
                        self={person.id === session.user.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-12">
        <SectionHead title={t.slotSponsorizzati} />

        {sponsors.length === 0 ? (
          <Empty>{t.nessunoSlot}</Empty>
        ) : (
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.id}
                className="flex flex-wrap items-center gap-3 rounded-card border border-rule bg-paper px-4 py-3 text-sm"
              >
                <Tag tone={sponsor.live ? "gold" : "neutral"}>
                  {sponsor.live ? t.inCorso : sponsor.active ? t.programmato : t.inPausa}
                </Tag>
                <span className="font-medium">{sponsor.advertiser}</span>
                <span className="text-ink-2">{sponsor.title}</span>
                <span className="ml-auto font-mono text-[11px] text-ink-3">
                  {formatDate(sponsor.startsAt, locale)} → {formatDate(sponsor.endsAt, locale)}
                </span>
                <SponsorToggle id={sponsor.id} active={sponsor.active} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionHead title={t.statoDelSito} />

        <StatGrid className="mb-5">
          <Stat label={t.motoreDiCalcolo} value={ENGINE_VERSION} small />
          <Stat label={t.giochiPrevisti} value={games.length} small />
          <Stat label={t.giochiNavigabili} value={modules.length} small />
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
                    <Tag tone="brand">{t.patch(gameModule.dataset.patch)}</Tag>
                    <span className="font-mono text-[11px] text-ink-3">
                      {t.contenuti(gameModule.characters.length, gameModule.targets.length)}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-ink-3">
                      {gameModule.dataset.checksum.slice(0, 12)}
                    </span>
                  </>
                ) : (
                  <Tag>{t.inArrivo}</Tag>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[13px] text-ink-3">
          {t.datasetPrima} <code className="font-mono">src/lib/games</code>
          {t.datasetDopo}
        </p>
      </section>
    </main>
  );
}
