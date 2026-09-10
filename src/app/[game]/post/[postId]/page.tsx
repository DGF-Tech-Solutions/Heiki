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
import { cachedCheck } from "@/lib/community/verify";
import { can, ROLE_LABELS } from "@/lib/auth/permissions";

interface Props {
  params: Promise<{ game: string; postId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const store = await getStore();
  const post = await store.getPost(postId, null);
  return {
    title: post ? `${post.title} · GachaZone` : "Discussione · GachaZone",
    description: post?.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { game, postId } = await params;
  const viewer = await currentViewer();
  const store = await getStore();
  const post = await store.getPost(postId, viewer);

  if (!post) notFound();

  const isModerator = can(viewer?.role, "moderate");

  // Un post nascosto resta leggibile solo a chi modera: serve per rivedere la
  // decisione. Per tutti gli altri e' come se non esistesse - 404 e non un
  // messaggio, perche' dire "esiste ma e' nascosto" e' comunque pubblicarlo.
  if (post.hidden && !isModerator) notFound();

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
            { label: findGame(game)?.shortName ?? "Gioco", href: `/${game}` },
            { label: post.hubName, href: `/${game}?hub=${post.hub}` },
            { label: post.title },
          ]}
        />

        {post.hidden ? (
          <Notice tone="warn" className="mb-5">
            Questo contenuto è nascosto: lo vedi perché moderi. Chi non modera trova una pagina
            inesistente.
          </Notice>
        ) : null}

        <article data-accent={post.author.accent} className="flex gap-3.5 border-b border-rule pb-6">
          <VoteControl
            targetType="POST"
            targetId={post.id}
            score={post.score}
            myVote={post.myVote}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
              <Link
                href={`/u/${post.author.username}`}
                className="inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-ink"
              >
                <span className="size-[7px] flex-none rounded-full bg-[var(--accent)]" aria-hidden />
                {post.author.displayName}
              </Link>
              {post.author.role !== "USER" ? (
                <span className="font-mono text-[9px] uppercase tracking-[0.09em] text-[var(--accent)]">
                  {ROLE_LABELS[post.author.role]}
                </span>
              ) : null}
              <span className="font-mono text-[11px]">{relativeTime(post.createdAt)}</span>
            </div>

            <h1 className={cx(display, "mb-3.5 text-[clamp(24px,3.4vw,34px)]")}>{post.title}</h1>

            <div className="text-[15px] leading-[1.68]">
              {post.body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index} className="m-0 mb-3.5">
                  {paragraph}
                </p>
              ))}
            </div>

            {post.attachment ? <AttachmentCard data={post.attachment} check={check} /> : null}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ReportButton targetType="POST" targetId={post.id} canReport={viewer !== null} />
              {isModerator ? (
                <ModControls targetType="POST" targetId={post.id} hidden={post.hidden ?? false} />
              ) : null}
            </div>
          </div>
        </article>

        <section className="pt-9">
          <SectionHead
            title={
              post.commentCount === 0
                ? "Risposte"
                : `${post.commentCount} ${post.commentCount === 1 ? "risposta" : "risposte"}`
            }
          />

          {viewer === null ? (
            <Notice className="mb-4">
              <span>
                Per rispondere e votare serve un profilo:{" "}
                <Link href="/registrati" className="font-semibold text-brand hover:underline">
                  creane uno
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
      </main>
    </>
  );
}
