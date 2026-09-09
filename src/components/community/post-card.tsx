import Link from "next/link";
import { VoteControl } from "./vote-control";
import { AttachmentCard } from "./attachment-card";
import { relativeTime } from "@/lib/community/ranking";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import type { FeedPost } from "@/lib/community/types";
import { display, Tag } from "../ui";

/**
 * Una voce del feed.
 *
 * L'accento del profilo dell'autore compare qui come piccolo segno colorato: il
 * cosmetico che si compra non serve solo sulla propria pagina, si porta dietro
 * ovunque quella persona scriva. E' quello che gli da' valore.
 */
export function PostCard({ post }: { post: FeedPost }) {
  return (
    <article
      data-accent={post.author.accent}
      className="flex gap-3.5 rounded-card border border-rule bg-paper p-4 transition-colors hover:border-ink-3"
    >
      <VoteControl targetType="POST" targetId={post.id} score={post.score} myVote={post.myVote} />

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
          <Link href={`/${post.game}?hub=${post.hub}`}>
            <Tag>{post.hubName}</Tag>
          </Link>

          <Link
            href={`/u/${post.author.username}`}
            className="inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-ink"
          >
            <span
              className="size-[7px] flex-none rounded-full bg-[var(--accent)]"
              aria-hidden
            />
            {post.author.displayName}
          </Link>

          {post.author.role !== "USER" ? (
            <span className="font-mono text-[9px] uppercase tracking-[0.09em] text-[var(--accent)]">
              {ROLE_LABELS[post.author.role]}
            </span>
          ) : null}

          <span className="ml-auto font-mono text-[11px]">{relativeTime(post.createdAt)}</span>
        </div>

        <h2
          className={`${display} mb-1.5 text-[19px] leading-[1.2] [font-variation-settings:'wdth'_92]`}
        >
          <Link href={`/${post.game}/post/${post.id}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h2>

        <p className="m-0 text-sm leading-relaxed text-ink-2">{post.excerpt}</p>

        {post.attachment ? <AttachmentCard data={post.attachment} /> : null}

        <Link
          href={`/${post.game}/post/${post.id}`}
          className="mt-3 inline-block text-xs text-ink-3 hover:text-ink"
        >
          {post.commentCount === 0
            ? "Rispondi per primo"
            : post.commentCount === 1
              ? "1 risposta"
              : `${post.commentCount} risposte`}
        </Link>
      </div>
    </article>
  );
}
