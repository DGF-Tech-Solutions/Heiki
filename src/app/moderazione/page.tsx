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
import { cx, display, Empty, eyebrow, SectionHead, Tag } from "@/components/ui";

export const metadata: Metadata = {
  title: "Moderazione",
  // La coda non deve finire negli indici: non e' contenuto, ed espone
  // frammenti di cio' che e' stato segnalato.
  robots: { index: false, follow: false },
};

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{children}</span>
  );
}

function queueLabel(count: number): string {
  if (count === 0) return "vuota";
  return count === 1 ? "1 da guardare" : `${count} da guardare`;
}

const ACTION_LABELS: Record<string, string> = {
  hide: "ha nascosto",
  unhide: "ha ripristinato",
  resolve: "ha chiuso",
  dismiss: "ha archiviato",
};

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

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-9 pb-24">
      <header className="mb-8">
        <p className={eyebrow}>Riservato</p>
        <h1 className={cx(display, "mt-2.5 text-[32px]")}>Moderazione</h1>
        <p className="mt-3 max-w-[62ch] text-sm text-ink-2">
          Nascondere non cancella: la riga resta nel database con chi ha deciso e quando, e la
          decisione si può revocare. Ogni azione compare nel registro in fondo alla pagina.
        </p>
      </header>

      <section className="mb-12">
        <SectionHead title="Coda" aside={<Meta>{queueLabel(queue.length)}</Meta>} />

        {queue.length === 0 ? (
          <Empty>Nessuna segnalazione aperta. È il risultato migliore possibile.</Empty>
        ) : (
          <ul className="m-0 grid list-none gap-3.5 p-0">
            {queue.map((item) => (
              <li
                key={item.id}
                className="rounded-card border border-rule border-l-[3px] border-l-hot bg-paper p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
                  <Tag>{item.targetType === "POST" ? "Post" : "Commento"}</Tag>
                  <Tag tone="brand">{reportReasonLabel(item.reason)}</Tag>
                  <span>
                    segnalato da{" "}
                    <Link href={`/u/${item.reporter}`} className="text-ink-2 hover:text-brand">
                      {item.reporter}
                    </Link>
                  </span>
                  <span className="ml-auto font-mono text-[11px]">
                    {relativeTime(item.createdAt)}
                  </span>
                </div>

                {item.preview ? (
                  <p className="m-0 mb-2 border-l border-rule-2 pl-3 text-sm leading-relaxed text-ink-2">
                    {item.preview}
                  </p>
                ) : (
                  <p className="m-0 mb-2 text-sm text-ink-3">
                    Il contenuto non esiste più: la segnalazione si può archiviare.
                  </p>
                )}

                {item.details ? (
                  <p className="m-0 mb-2.5 text-[13px] text-ink-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                      dettagli:{" "}
                    </span>
                    {item.details}
                  </p>
                ) : null}

                <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-3">
                  {item.authorUsername ? (
                    <span>
                      autore:{" "}
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
                      Apri nel contesto
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
          title="Sospensioni attive"
          aside={<Meta>{suspended.length === 0 ? "nessuna" : String(suspended.length)}</Meta>}
        />

        {suspended.length === 0 ? (
          <Empty>Nessun account sospeso.</Empty>
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
                    ? `fino al ${new Date(entry.until).toLocaleDateString("it-IT")}`
                    : "a tempo indeterminato"}
                </span>
                <LiftButton suspensionId={entry.id} />
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-card border border-rule bg-paper-2 p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
            Sospendi un account
          </p>
          <SuspendForm />
        </div>
      </section>

      <section>
        <SectionHead title="Registro" aside={<Meta>ultime 30 azioni</Meta>} />

        {log.length === 0 ? (
          <Empty>Nessuna azione registrata.</Empty>
        ) : (
          <ol className="m-0 grid list-none gap-1.5 p-0">
            {log.map((entry) => (
              <li key={entry.id} className="flex gap-2.5 py-1 text-[13px] text-ink-2">
                <span className="font-mono text-[11px] text-ink-3">
                  {relativeTime(entry.createdAt)}
                </span>
                <span>
                  <strong className="font-semibold text-ink">{entry.moderator}</strong>{" "}
                  {ACTION_LABELS[entry.action] ?? entry.action}{" "}
                  {entry.targetType === "POST" ? "un post" : "un commento"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
