import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LiftButton, QueueRowActions, SuspendForm } from "./queue-actions";
import { VerificationReview, type ReviewItem } from "./verification-review";
import { auth } from "@/lib/auth";
import { can, isRole, roleLabel } from "@/lib/auth/permissions";
import { databaseReachable } from "@/lib/db";
import { DemoNotice, SetupHint } from "@/components/demo-notice";
import { activeSuspensions, recentModActions, reportQueue } from "@/lib/moderation/actions";
import { verificationQueue } from "@/lib/game-account/server";
import { SERVER_NAMES, isServer } from "@/lib/games/game-account";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { getGameModule } from "@/lib/games/registry";
import { reportReasonLabel } from "@/lib/moderation/reasons";
import { relativeTime } from "@/lib/community/ranking";
import { inLingua, intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { Empty, PageHeader, SectionHead, Tag } from "@/components/ui";
import { strategyQueue } from "@/lib/strategies/server";
import { canLiftSuspension, suspensionFor } from "@/lib/moderation/suspension";
import { selectionLabel, strategyTitle } from "@/lib/strategies/view";
import { modeName } from "@/lib/strategies/rules";
import { StrategyView } from "@/components/strategies/strategy-view";
import { StrategyReview } from "@/components/strategies/strategy-review";

const TESTI = testi({
  it: {
    titoloPagina: "Moderazione",
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
    // il registro: verbo per azione, oggetto per bersaglio; dove l'accoppiata
    // dice di piu' (una decisione su un post e' una guida dell'Endgame) la frase intera
    azioni: {
      hide: "ha nascosto",
      unhide: "ha ripristinato",
      resolve: "ha chiuso",
      dismiss: "ha archiviato",
      approve: "ha approvato",
      reject: "ha respinto",
      suspend: "ha sospeso",
      lift_suspension: "ha tolto la sospensione a",
      set_role: "ha cambiato il ruolo di",
      sponsor_on: "ha attivato",
      sponsor_off: "ha spento",
      status_published: "ha pubblicato",
      status_archived: "ha archiviato",
      status_in_review: "ha rimesso in revisione",
      status_draft: "ha riportato in bozza",
      status_rejected: "ha respinto",
      verified_patch: "ha dichiarato la patch di",
    },
    oggetti: {
      POST: "un post",
      COMMENT: "un commento",
      GUIDE: "una guida",
      BUILD: "una build",
      USER: "un account",
      SPONSOR: "uno sponsor",
      VERIFICATION: "una verifica della classe",
      STRATEGY: "una guida dell'Endgame",
    },
    frasi: {
      "POST:approve": "ha pubblicato una guida dell'Endgame",
      "POST:reject": "ha respinto una guida dell'Endgame",
      "VERIFICATION:approve": "ha confermato una verifica della classe",
    },
    verifiche: "Verifiche della classe dell'account",
    verificheIntro:
      "Schermate dell'Elenco eroi con l'eroe del giorno nei preferiti. Scrivi la classe che leggi e conferma, o rifiuta con un motivo. La schermata si cancella alla decisione.",
    nessunaVerifica: "Nessuna schermata da guardare.",
    guide: "Guide dell'Endgame",
    guideIntro:
      "Le squadre senza testo si pubblicano da sole; le guide (con titolo, note o fasi) aspettano qui. Pubblica, o respingi con un motivo: l'autore lo legge e può correggerla.",
    nessunaGuida: "Nessuna guida da rivedere.",
    di: "di",
    modifica: "modifica di una guida già decisa",
    apri: "Apri la pagina",
    leggi: "Leggi la guida",
  },
  en: {
    titoloPagina: "Moderation",
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
      approve: "approved",
      reject: "rejected",
      suspend: "suspended",
      lift_suspension: "lifted the suspension of",
      set_role: "changed the role of",
      sponsor_on: "turned on",
      sponsor_off: "turned off",
      status_published: "published",
      status_archived: "archived",
      status_in_review: "sent back to review",
      status_draft: "moved back to draft",
      status_rejected: "rejected",
      verified_patch: "declared the patch of",
    },
    oggetti: {
      POST: "a post",
      COMMENT: "a comment",
      GUIDE: "a guide",
      BUILD: "a build",
      USER: "an account",
      SPONSOR: "a sponsor",
      VERIFICATION: "a class verification",
      STRATEGY: "an Endgame guide",
    },
    frasi: {
      "POST:approve": "published an Endgame guide",
      "POST:reject": "rejected an Endgame guide",
      "VERIFICATION:approve": "confirmed a class verification",
    },
    verifiche: "Account Combat Class verifications",
    verificheIntro:
      "Hero List screenshots with the hero of the day in the favorites. Enter the class you read and confirm, or reject with a reason. The screenshot is deleted on decision.",
    nessunaVerifica: "No screenshots to review.",
    guide: "Endgame guides",
    guideIntro:
      "Teams without text go live on their own; guides (with a title, notes or phases) wait here. Publish, or reject with a reason: the author reads it and can fix the guide.",
    nessunaGuida: "No guides to review.",
    di: "by",
    modifica: "edit of an already decided guide",
    apri: "Open the page",
    leggi: "Read the guide",
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
    <span className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">{children}</span>
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

  // un moderatore sospeso non modera (le azioni lo respingono gia'): e non deve
  // nemmeno leggere le code, che portano codici amico e nickname (11/10)
  if ((await suspensionFor(session.user.id)).active) notFound();

  const [queue, suspended, log, verifications, guides] = await Promise.all([
    reportQueue(),
    activeSuspensions(),
    recentModActions(),
    verificationQueue(),
    strategyQueue(),
  ]);

  const locale = await getLocale();
  const t = TESTI[locale];
  const actionLabels: Record<string, string> = t.azioni;
  const targetLabels: Record<string, string> = t.oggetti;
  const phrases: Record<string, string> = t.frasi;
  // una riga del registro: la frase intera se c'e', se no verbo e oggetto; un
  // nome che il sito non conosce si mostra cosi' com'e', invece di sparire
  const logLine = (targetType: string, action: string) => {
    // le righe vecchie del cambio di ruolo: bersaglio POST e azione «role:<RUOLO>»
    if (action.startsWith("role:")) return `${actionLabels["set_role"]} ${targetLabels["USER"]}`;
    return (
      (Object.hasOwn(phrases, `${targetType}:${action}`) ? phrases[`${targetType}:${action}`] : undefined) ??
      `${Object.hasOwn(actionLabels, action) ? actionLabels[action] : action} ${Object.hasOwn(targetLabels, targetType) ? targetLabels[targetType] : targetType.toLowerCase()}`
    );
  };
  // il dettaglio accanto: il motivo, o i ruoli «prima → dopo» nella lingua della pagina
  const role = (value: string) => (isRole(value) ? roleLabel(value, locale) : value);
  const logDetail = (action: string, reason: string | null) => {
    if (action.startsWith("role:")) return role(action.slice(5));
    if (action === "set_role" && reason?.includes("->")) return reason.split("->").map(role).join(" → ");
    return reason;
  };
  const now = new Date();

  const reviewItems: ReviewItem[] = verifications.map((item) => {
    const roster = getGameModule(item.gameSlug)?.roster?.heroes ?? [];
    const label = (id: string) => {
      const hero = roster.find((entry) => entry.id === id);
      return hero ? `[${heroEpithet(hero, locale)}] ${heroName(hero, locale)}` : id;
    };
    const server = isServer(item.server) ? SERVER_NAMES[item.server][locale] : item.server;
    return {
      id: item.id,
      requester: item.displayName,
      profileHref: `/u/${item.username}`,
      account: [item.nickname, item.friendCode && `#${item.friendCode}`, server].filter(Boolean).join(" · "),
      declaredPower: item.declaredPower,
      previous: item.previousPower && item.previousAt ? { power: item.previousPower, at: item.previousAt } : null,
      hero: { name: label(item.challengeHeroId), card: heroCardSrc(item.gameSlug, item.challengeHeroId) },
      skipped: item.skippedHeroIds.map(label),
      challengeDay: item.challengeDay,
    };
  });

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-9 pb-24">
      <PageHeader title={t.titolo} className="mb-8">
        <p>{t.introduzione}</p>
      </PageHeader>

      <section id="guide" className="mb-12 scroll-mt-24">
        <SectionHead
          title={t.guide}
          aside={<Meta>{guides.length === 0 ? t.codaVuota : t.daGuardare(guides.length)}</Meta>}
        />
        <p className="mt-0 mb-4 max-w-[48ch] text-sm text-ink-2">{t.guideIntro}</p>
        {guides.length === 0 ? (
          <Empty>{t.nessunaGuida}</Empty>
        ) : (
          <ul className="m-0 grid list-none gap-3.5 p-0">
            {guides.map((item) => {
              const gameModule = getGameModule(item.game);
              const own = item.authorId === session.user.id;
              return (
                <li key={item.postId} className="p5-corner grid gap-3 border border-rule bg-paper-2 p-4">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
                    {item.resubmitted ? <Tag tone="gold">{t.modifica}</Tag> : null}
                    <span>
                      {t.di}{" "}
                      <Link href={`/u/${item.author.username}`} className="text-ink-2 hover:text-brand-deep">
                        {item.author.displayName}
                      </Link>
                    </span>
                    <span className="ml-auto font-mono text-[11px]">{relativeTime(item.submittedAt, now, locale)}</span>
                  </div>
                  <p className="m-0 font-display text-[18px] leading-tight font-black uppercase [font-variation-settings:'wdth'_85]">
                    {gameModule ? strategyTitle(gameModule, { ...item, autoTitle: false }, locale) : item.title}
                  </p>
                  {gameModule ? (
                    <p className="m-0 -mt-1.5 text-sm text-ink-2">
                      {item.target ? `${inLingua(modeName(gameModule, item.mode), locale) ?? ""} · ` : ""}
                      {selectionLabel(gameModule, item, locale)}
                    </p>
                  ) : null}
                  {gameModule ? (
                    <details className="group/guida border-y border-rule-2 py-2">
                      <summary className="cursor-pointer font-display text-[13px] font-extrabold tracking-[0.04em] text-ink-2 uppercase [font-variation-settings:'wdth'_85] hover:text-ink">
                        {t.leggi}
                      </summary>
                      <div className="mt-3">
                        <StrategyView
                          strategy={{
                            ...item,
                            status: "IN_REVIEW",
                            autoTitle: false,
                            reviewNote: null,
                            reviewedAt: null,
                            authorUsername: item.author.username,
                          }}
                          module={gameModule}
                          locale={locale}
                        />
                      </div>
                    </details>
                  ) : null}
                  <div className="flex flex-wrap items-start gap-4">
                    {own ? null : <StrategyReview postId={item.postId} className="min-w-0 flex-1" />}
                    <Link
                      href={`/${item.game}/post/${item.postId}`}
                      className="font-display text-[12px] font-bold tracking-[0.06em] text-brand-deep uppercase underline-offset-2 [font-variation-settings:'wdth'_82] hover:underline"
                    >
                      {t.apri}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mb-12">
        <SectionHead
          title={t.verifiche}
          aside={<Meta>{reviewItems.length === 0 ? t.codaVuota : t.daGuardare(reviewItems.length)}</Meta>}
        />
        <p className="mt-0 mb-4 max-w-[48ch] text-sm text-ink-2">{t.verificheIntro}</p>
        {reviewItems.length === 0 ? (
          <Empty>{t.nessunaVerifica}</Empty>
        ) : (
          <ul className="m-0 grid list-none gap-3.5 p-0">
            {reviewItems.map((item) => (
              <VerificationReview key={item.id} item={item} locale={locale} />
            ))}
          </ul>
        )}
      </section>

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
                // la segnalazione si riconosce dall'angolo tagliato e dal bordo intero, non
                // da un filo rosa a sinistra (10/10)
                className="p5-corner border border-hot/60 bg-paper-2 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
                  <Tag>{item.targetType === "POST" ? t.post : t.commento}</Tag>
                  <Tag tone="brand">{reportReasonLabel(item.reason, locale)}</Tag>
                  <span>
                    {t.segnalatoDa}{" "}
                    <Link href={`/u/${item.reporter}`} className="text-ink-2 hover:text-brand-deep">
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
                    <span className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
                      {t.dettagli}{" "}
                    </span>
                    {item.details}
                  </p>
                ) : null}

                <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px] text-ink-3">
                  {item.authorUsername ? (
                    <span>
                      {t.autore}{" "}
                      <Link
                        href={`/u/${item.authorUsername}`}
                        className="text-ink-2 hover:text-brand-deep"
                      >
                        {item.authorUsername}
                      </Link>{" "}
                      <code className="font-mono text-[11px] text-ink-3">{item.authorId}</code>
                    </span>
                  ) : null}
                  {item.gameSlug && item.postId ? (
                    <Link
                      href={`/${item.gameSlug}/post/${item.postId}`}
                      className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] tracking-[0.06em] text-brand-deep uppercase underline-offset-2 hover:underline"
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
                className="flex flex-wrap items-center gap-3 border border-rule bg-paper-2 px-4 py-3 text-sm"
              >
                <Link href={`/u/${entry.username}`} className="font-medium hover:text-brand-deep">
                  {entry.username}
                </Link>
                <span className="text-ink-2">{entry.reason}</span>
                <span className="ml-auto font-mono text-[11px] text-ink-3">
                  {entry.until
                    ? t.finoAl(new Date(entry.until).toLocaleDateString(intlLocale(locale)))
                    : t.aTempoIndeterminato}
                </span>
                {/* «Revoca» solo a chi puo' usarlo: fra moderatori, e per chi ha sospeso un
                    amministratore, decide un amministratore (l'azione lo respinge comunque) */}
                {canLiftSuspension({
                  actor: { id: session.user.id, role: session.user.role },
                  suspended: { id: entry.userId, role: entry.userRole },
                  issuerRole: entry.issuerRole,
                }).ok ? (
                  <LiftButton suspensionId={entry.id} />
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-card border border-rule bg-paper-2 p-5">
          <p className="mb-4 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
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
                  {logLine(entry.targetType, entry.action)}
                  {logDetail(entry.action, entry.reason) ? (
                    <span className="text-ink-3"> · {logDetail(entry.action, entry.reason)}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
