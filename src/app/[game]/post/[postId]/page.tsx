import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VoteControl } from "@/components/community/vote-control";
import { AttachmentCard } from "@/components/community/attachment-card";
import { CommentThread } from "@/components/community/comment-thread";
import { ReportButton } from "@/components/community/report-button";
import { ModControls } from "@/components/moderation/mod-controls";
import { Breadcrumb } from "@/components/breadcrumb";
import { findGame } from "@/lib/games/catalog";
import { cx, display, Notice, SectionHead } from "@/components/ui";
import { currentViewer } from "@/lib/community/actions";
import { relativeTime } from "@/lib/community/ranking";
import { getStore } from "@/lib/community/store";
import { hubLabel } from "@/lib/community/types";
import { cachedCheck } from "@/lib/community/verify";
import { can, roleLabel } from "@/lib/auth/permissions";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { getGameModule } from "@/lib/games/registry";
import { getStrategy } from "@/lib/strategies/server";
import { strategyTitle } from "@/lib/strategies/view";
import { StrategyView } from "@/components/strategies/strategy-view";
import { StrategyReview } from "@/components/strategies/strategy-review";

const TESTI = testi({
  it: {
    discussioneTitolo: "Discussione",
    discussioni: "Discussioni",
    gioco: "Gioco",
    nascosto:
      "Questo contenuto è nascosto: lo vedi perché moderi. Chi non modera trova una pagina inesistente.",
    risposte: (n: number) =>
      n === 0 ? "Risposte" : `${n} ${n === 1 ? "risposta" : "risposte"}`,
    serveProfilo: "Per rispondere e votare serve un profilo:",
    creaneUno: "creane uno",
    inRevisioneAutore:
      "La tua guida è in revisione: per ora la vedete solo tu e i moderatori. Quando un moderatore la pubblica ti arriva una notifica, e da lì si vota e si commenta.",
    inRevisioneModeratore: "Guida in revisione: decidi qui o nella coda della moderazione.",
    respinta: "La guida non è stata accettata. Il motivo del moderatore:",
    respintaSenzaMotivo: "La guida non è stata accettata.",
    correggi: "Correggila e mandala di nuovo",
    modifica: "Modifica la strategia",
    modificaGuida: "Modifica (se cambi il testo torna in revisione)",
  },
  en: {
    discussioneTitolo: "Discussion",
    discussioni: "Discussions",
    gioco: "Game",
    nascosto:
      "This content is hidden: you can see it because you moderate. Everyone else gets a page that doesn't exist.",
    risposte: (n: number) => (n === 0 ? "Replies" : `${n} ${n === 1 ? "reply" : "replies"}`),
    serveProfilo: "You need a profile to reply and vote:",
    creaneUno: "create one",
    inRevisioneAutore:
      "Your guide is under review: for now only you and the moderators can see it. You'll get a notification when a moderator publishes it, and from then on it can be voted and discussed.",
    inRevisioneModeratore: "Guide under review: decide here or in the moderation queue.",
    respinta: "The guide was not accepted. The moderator's reason:",
    respintaSenzaMotivo: "The guide was not accepted.",
    correggi: "Fix it and send it again",
    modifica: "Edit the strategy",
    modificaGuida: "Edit (changing the text sends it back to review)",
  },
});

interface Props {
  params: Promise<{ game: string; postId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const store = await getStore();
  const post = await store.getPost(postId, null);
  const locale = await getLocale();
  const t = TESTI[locale];
  const strategy = post ? await getStrategy(postId) : null;
  // una guida in revisione non e' ancora pubblica: nemmeno il titolo nella scheda del browser
  if (!post || (strategy && strategy.status !== "PUBLISHED")) return { title: t.discussioneTitolo };
  const gameModule = strategy ? getGameModule(strategy.game) : undefined;
  return {
    title: strategy && gameModule ? strategyTitle(gameModule, { ...strategy, title: post.title }, locale) : post.title,
    description: post.excerpt || undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { game, postId } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];
  const viewer = await currentViewer();
  const store = await getStore();
  const post = await store.getPost(postId, viewer);

  if (!post) notFound();

  const isModerator = can(viewer?.role, "moderate");

  // Un post nascosto resta leggibile solo a chi modera: serve per rivedere la
  // decisione. Per tutti gli altri e' come se non esistesse - 404 e non un
  // messaggio, perche' dire "esiste ma e' nascosto" e' comunque pubblicarlo.
  if (post.hidden && !isModerator) notFound();

  // Una strategia dell'Endgame: la guida non ancora pubblicata la vedono solo
  // l'autore e chi modera, come un post nascosto
  const strategy = await getStrategy(post.id);
  const gameModule = strategy ? getGameModule(strategy.game) : undefined;
  const isAuthor = viewer !== null && viewer.username === post.author.username;
  const published = !strategy || strategy.status === "PUBLISHED";
  if (!published && !isAuthor && !isModerator) notFound();
  const title = strategy && gameModule ? strategyTitle(gameModule, { ...strategy, title: post.title }, locale) : post.title;
  const editHref = strategy ? `/${game}/strategie/${post.id}/modifica` : null;

  // La riverifica gira qui e non nel feed: e' costosa, e serve nel punto in cui
  // qualcuno valuta davvero l'affermazione invece di scorrere una lista.
  const check = post.attachment
    ? await cachedCheck(post.id, post.game, post.attachment)
    : undefined;

  return (
    <>
      <main className="max-w-[820px] pt-6 pb-20">
        <Breadcrumb
          items={[
            { label: findGame(game)?.shortName ?? t.gioco, href: `/${game}` },
            // il feed sta in /discussioni dal 10/10: /${game} e' diventata la pagina del gioco
            { label: t.discussioni, href: `/${game}/discussioni` },
            { label: hubLabel(post.hub, locale, post.hubName), href: `/${game}/discussioni?hub=${post.hub}` },
            { label: post.title },
          ]}
        />

        {post.hidden ? (
          <Notice tone="warn" className="mb-5">
            {t.nascosto}
          </Notice>
        ) : null}

        {strategy?.status === "IN_REVIEW" ? (
          <Notice tone="warn" className="mb-5">
            {isAuthor ? t.inRevisioneAutore : t.inRevisioneModeratore}
          </Notice>
        ) : null}

        {strategy?.status === "REJECTED" ? (
          <Notice tone="warn" className="mb-5">
            <span>
              {strategy.reviewNote ? t.respinta : t.respintaSenzaMotivo}
              {strategy.reviewNote ? <q className="mx-1 font-semibold text-ink">{strategy.reviewNote}</q> : null}
              {isAuthor && editHref ? (
                <Link href={editHref} className="ml-1 font-semibold text-ink underline decoration-brand underline-offset-2 hover:text-brand-deep">
                  {t.correggi}
                </Link>
              ) : null}
            </span>
          </Notice>
        ) : null}

        <article data-accent={post.author.accent} className="flex gap-3.5 border-b border-rule pb-6">
          {published ? (
            <VoteControl
              targetType="POST"
              targetId={post.id}
              score={post.score}
              myVote={post.myVote}
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
              <Link
                href={`/u/${post.author.username}`}
                className="inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-ink"
              >
                <span className="size-[7px] flex-none bg-[var(--accent)] [clip-path:polygon(2px_0,100%_0,calc(100%-2px)_100%,0_100%)]" aria-hidden />
                {post.author.displayName}
              </Link>
              {post.author.role !== "USER" ? (
                <span className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-[var(--accent)]">
                  {roleLabel(post.author.role, locale)}
                </span>
              ) : null}
              <span className="font-mono text-[11px]">
                {relativeTime(post.createdAt, new Date(), locale)}
              </span>
            </div>

            <h1 className={cx(display, "mb-3.5 text-[clamp(24px,3.4vw,34px)]")}>{title}</h1>

            {strategy && gameModule ? (
              <StrategyView strategy={strategy} module={gameModule} locale={locale} />
            ) : (
              <div className="text-[15px] leading-[1.68]">
                {post.body.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index} className="m-0 mb-3.5">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {post.attachment ? <AttachmentCard data={post.attachment} check={check} /> : null}

            {strategy?.status === "IN_REVIEW" && isModerator && !isAuthor ? (
              <div className="p5-corner mt-6 border border-hot/60 bg-paper-2 p-4">
                <StrategyReview postId={post.id} />
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {isAuthor && editHref && strategy?.status !== "REJECTED" ? (
                <Link
                  href={editHref}
                  className="text-xs text-ink-2 underline decoration-rule underline-offset-2 hover:text-ink"
                >
                  {strategy?.status === "PUBLISHED" && !strategy.autoTitle ? t.modificaGuida : t.modifica}
                </Link>
              ) : null}
              <ReportButton targetType="POST" targetId={post.id} canReport={viewer !== null} />
              {isModerator ? (
                <ModControls targetType="POST" targetId={post.id} hidden={post.hidden ?? false} />
              ) : null}
            </div>
          </div>
        </article>

        {published ? (
        <section className="pt-9">
          <SectionHead title={t.risposte(post.commentCount)} />

          {viewer === null ? (
            <Notice className="mb-4">
              <span>
                {t.serveProfilo}{" "}
                <Link href="/registrati" className="font-semibold text-ink underline decoration-brand underline-offset-2 hover:text-brand-deep">
                  {t.creaneUno}
                </Link>
                .
              </span>
            </Notice>
          ) : null}

          <CommentThread
            postId={post.id}
            comments={post.comments}
            canWrite={viewer !== null}
            canModerate={isModerator}
          />
        </section>
        ) : null}
      </main>
    </>
  );
}
