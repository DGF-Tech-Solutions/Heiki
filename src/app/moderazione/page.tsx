import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LiftButton, QueueRowActions, SuspendForm } from "./queue-actions";
import { auth } from "@/lib/auth";
import { can } from "@/lib/auth/permissions";
import { databaseReachable } from "@/lib/db";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { activeSuspensions, recentModActions, reportQueue } from "@/lib/moderation/actions";
import { reportReasonLabel } from "@/lib/moderation/reasons";
import { relativeTime } from "@/lib/community/ranking";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { cx, display, Empty, eyebrow, SectionHead, Tag } from "@/components/ui";

const TESTI = testi({
  it: {
    titoloPagina: "Moderazione",
    riservato: "Riservato",
    titolo: "Moderazione",
    introduzione:
      "Nascondere non cancella: la riga resta nel database con chi ha deciso e quando, e la decisione si può revocare. Ogni azione compare nel registro in fondo alla pagina.",
    coda: "Coda",
    codaVuota: "vuota",
    daGuardare: (n: number) => (n === 1 ? "1 da guardare" : `${n} da guardare`),
    nessunaSegnalazione: "Nessuna segnalazione aperta. È il risultato migliore possibile.",
    post: "Post",
    commento: "Commento",
    segnalatoDa: "segnalato da",
    contenutoInesistente: "Il contenuto non esiste più: la segnalazione si può archiviare.",
    dettagli: "dettagli:",
    autore: "autore:",
    apriNelContesto: "Apri nel contesto",
    sospensioniAttive: "Sospensioni attive",
    nessuna: "nessuna",
    nessunAccountSospeso: "Nessun account sospeso.",
    finoAl: (data: string) => `fino al ${data}`,
    aTempoIndeterminato: "a tempo indeterminato",
    sospendiUnAccount: "Sospendi un account",
    registro: "Registro",
    ultimeAzioni: "ultime 30 azioni",
    nessunaAzione: "Nessuna azione registrata.",
    azioni: {
      hide: "ha nascosto",
      unhide: "ha ripristinato",
      resolve: "ha chiuso",
      dismiss: "ha archiviato",
    },
    unPost: "un post",
    unCommento: "un commento",
  },
  en: {
    titoloPagina: "Moderation",
    riservato: "Restricted",
    titolo: "Moderation",
    introduzione:
      "Hiding doesn't delete: the row stays in the database with who decided and when, and the decision can be reversed. Every action shows up in the log at the bottom of the page.",
    coda: "Queue",
    codaVuota: "empty",
    daGuardare: (n: number) => `${n} to review`,
    nessunaSegnalazione: "No open reports. That's the best possible outcome.",
    post: "Post",
    commento: "Comment",
    segnalatoDa: "reported by",
    contenutoInesistente: "The content no longer exists: the report can be dismissed.",
    dettagli: "details:",
    autore: "author:",
    apriNelContesto: "Open in context",
    sospensioniAttive: "Active suspensions",
    nessuna: "none",
    nessunAccountSospeso: "No suspended accounts.",
    finoAl: (data: string) => `until ${data}`,
    aTempoIndeterminato: "indefinitely",
    sospendiUnAccount: "Suspend an account",
    registro: "Log",
    ultimeAzioni: "last 30 actions",
    nessunaAzione: "No actions logged.",
    azioni: {
      hide: "hid",
      unhide: "restored",
      resolve: "closed",
      dismiss: "dismissed",
    },
    unPost: "a post",
    unCommento: "a comment",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    // La coda non deve finire negli indici: non e' contenuto, ed espone
    // frammenti di cio' che e' stato segnalato.
    robots: { index: false, follow: false },
  };
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{children}</span>
  );
}

export default async function ModerationPage() {
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

  // 404 e non 403: chi non modera non deve nemmeno sapere che questa pagina
  // esiste. Un "non hai i permessi" e' un indizio su dove attaccare.
  if (!can(session.user.role, "moderate")) notFound();

  const [queue, suspended, log] = await Promise.all([
    reportQueue(),
    activeSuspensions(),
    recentModActions(),
  ]);

  const locale = await getLocale();
  const t = TESTI[locale];
  const actionLabels: Record<string, string> = t.azioni;
  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-9 pb-24">
      <header className="mb-8">
        <p className={eyebrow}>{t.riservato}</p>
        <h1 className={cx(display, "mt-2.5 text-[32px]")}>{t.titolo}</h1>
        <p className="mt-3 max-w-[62ch] text-sm text-ink-2">{t.introduzione}</p>
      </header>

      <section className="mb-12">
        <SectionHead
          title={t.coda}
          aside={<Meta>{queue.length === 0 ? t.codaVuota : t.daGuardare(queue.length)}</Meta>}
        />

        {queue.length === 0 ? (
          <Empty>{t.nessunaSegnalazione}</Empty>
        ) : (
          <ul className="m-0 grid list-none gap-3.5 p-0">
            {queue.map((item) => (
              <li
                key={item.id}
                className="rounded-card border border-rule border-l-[3px] border-l-hot bg-paper p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
                  <Tag>{item.targetType === "POST" ? t.post : t.commento}</Tag>
                  <Tag tone="brand">{reportReasonLabel(item.reason, locale)}</Tag>
                  <span>
                    {t.segnalatoDa}{" "}
                    <Link href={`/u/${item.reporter}`} className="text-ink-2 hover:text-brand">
                      {item.reporter}
                    </Link>
                  </span>
                  <span className="ml-auto font-mono text-[11px]">
                    {relativeTime(item.createdAt, now, locale)}
                  </span>
                </div>

                {item.preview ? (
                  <p className="m-0 mb-2 border-l border-rule-2 pl-3 text-sm leading-relaxed text-ink-2">
                    {item.preview}
                  </p>
                ) : (
                  <p className="m-0 mb-2 text-sm text-ink-3">{t.contenutoInesistente}</p>
                )}

                {item.details ? (
                  <p className="m-0 mb-2.5 text-[13px] text-ink-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                      {t.dettagli}{" "}
                    </span>
                    {item.details}
                  </p>
                ) : null}

                <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-3">
                  {item.authorUsername ? (
                    <span>
                      {t.autore}{" "}
                      <Link
                        href={`/u/${item.authorUsername}`}
                        className="text-ink-2 hover:text-brand"
                      >
                        {item.authorUsername}
                      </Link>{" "}
                      <code className="font-mono text-[10px] text-ink-3">{item.authorId}</code>
                    </span>
                  ) : null}
                  {item.gameSlug && item.postId ? (
                    <Link
                      href={`/${item.gameSlug}/post/${item.postId}`}
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-brand hover:underline"
                    >
                      {t.apriNelContesto}
                    </Link>
                  ) : null}
                </div>

                <QueueRowActions
                  reportId={item.id}
                  targetType={item.targetType}
                  targetId={item.targetId}
                  hidden={item.hidden}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-12">
        <SectionHead
          title={t.sospensioniAttive}
          aside={<Meta>{suspended.length === 0 ? t.nessuna : String(suspended.length)}</Meta>}
        />

        {suspended.length === 0 ? (
          <Empty>{t.nessunAccountSospeso}</Empty>
        ) : (
          <ul className="m-0 mb-6 grid list-none gap-2.5 p-0">
            {suspended.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center gap-3 rounded-card border border-rule bg-paper px-4 py-3 text-sm"
              >
                <Link href={`/u/${entry.username}`} className="font-medium hover:text-brand">
                  {entry.username}
                </Link>
                <span className="text-ink-2">{entry.reason}</span>
                <span className="ml-auto font-mono text-[11px] text-ink-3">
                  {entry.until
                    ? t.finoAl(new Date(entry.until).toLocaleDateString(intlLocale(locale)))
                    : t.aTempoIndeterminato}
                </span>
                <LiftButton suspensionId={entry.id} />
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-card border border-rule bg-paper-2 p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
            {t.sospendiUnAccount}
          </p>
          <SuspendForm />
        </div>
      </section>

      <section>
        <SectionHead title={t.registro} aside={<Meta>{t.ultimeAzioni}</Meta>} />

        {log.length === 0 ? (
          <Empty>{t.nessunaAzione}</Empty>
        ) : (
          <ol className="m-0 grid list-none gap-1.5 p-0">
            {log.map((entry) => (
              <li key={entry.id} className="flex gap-2.5 py-1 text-[13px] text-ink-2">
                <span className="font-mono text-[11px] text-ink-3">
                  {relativeTime(entry.createdAt, now, locale)}
                </span>
                <span>
                  <strong className="font-semibold text-ink">{entry.moderator}</strong>{" "}
                  {Object.hasOwn(actionLabels, entry.action)
                    ? actionLabels[entry.action]
                    : entry.action}{" "}
                  {entry.targetType === "POST" ? t.unPost : t.unCommento}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
