import Link from "next/link";
import { VoteControl } from "./vote-control";
import { AttachmentCard } from "./attachment-card";
import { relativeTime } from "@/lib/community/ranking";
import { roleLabel } from "@/lib/auth/permissions";
import { hubLabel, type FeedPost } from "@/lib/community/types";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { display, Tag } from "../ui";

const TESTI = testi({
  it: {
    rispondiPerPrimo: "Rispondi per primo",
    risposte: (n: number) => (n === 1 ? "1 risposta" : `${n} risposte`),
  },
  en: {
    rispondiPerPrimo: "Be the first to reply",
    risposte: (n: number) => (n === 1 ? "1 reply" : `${n} replies`),
  },
});

/**
 * Una voce del feed.
 *
 * L'accento del profilo dell'autore compare qui come piccolo segno colorato: il
 * cosmetico che si compra non serve solo sulla propria pagina, si porta dietro
 * ovunque quella persona scriva. E' quello che gli da' valore.
 */
export async function PostCard({ post }: { post: FeedPost }) {
  const locale = await getLocale();
  const t = TESTI[locale];

  return (
    <article
      data-accent={post.author.accent}
      className="p5-corner flex gap-3.5 border border-rule bg-paper-2 p-4 transition-colors hover:border-ink-3"
    >
      <VoteControl targetType="POST" targetId={post.id} score={post.score} myVote={post.myVote} />

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2.5 text-xs text-ink-3">
          <Link href={`/${post.game}/discussioni?hub=${post.hub}`}>
            <Tag>{hubLabel(post.hub, locale, post.hubName)}</Tag>
          </Link>

          <Link
            href={`/u/${post.author.username}`}
            className="inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-ink"
          >
            <span
              className="size-[7px] flex-none bg-[var(--accent)] [clip-path:polygon(2px_0,100%_0,calc(100%-2px)_100%,0_100%)]"
              aria-hidden
            />
            {post.author.displayName}
          </Link>

          {post.author.role !== "USER" ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-[var(--accent)]">
              {roleLabel(post.author.role, locale)}
            </span>
          ) : null}

          <span className="ml-auto font-mono text-[11px]">
            {relativeTime(post.createdAt, new Date(), locale)}
          </span>
        </div>

        <h2
          className={`${display} mb-1.5 text-[19px] leading-[1.2] [font-variation-settings:'wdth'_92]`}
        >
          <Link href={`/${post.game}/post/${post.id}`} className="hover:text-brand-deep">
            {post.title}
          </Link>
        </h2>

        <p className="m-0 text-sm leading-relaxed text-ink-2">{post.excerpt}</p>

        {post.attachment ? <AttachmentCard data={post.attachment} /> : null}

        <Link
          href={`/${post.game}/post/${post.id}`}
          className="mt-3 inline-block text-xs text-ink-2 underline decoration-rule underline-offset-2 hover:text-ink"
        >
          {post.commentCount === 0 ? t.rispondiPerPrimo : t.risposte(post.commentCount)}
        </Link>
      </div>
    </article>
  );
}
