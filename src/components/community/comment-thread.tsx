"use client";

/**
 * Discussione sotto un post.
 *
 * Le risposte annidate si fermano a due livelli. Piu' in profondita' una
 * conversazione diventa illeggibile su schermo stretto e la gente smette di
 * seguirla: chi vuole continuare risponde al ramo, non alla foglia.
 */

import { useActionState, useState } from "react";
import Link from "next/link";
import { VoteControl } from "./vote-control";
import { createCommentAction, type ActionState } from "@/lib/community/actions";
import { relativeTime } from "@/lib/community/ranking";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import type { CommentNode } from "@/lib/community/types";
import { Button, Empty, Textarea } from "../ui";

const INITIAL: ActionState = {};
const MAX_DEPTH = 2;

export function CommentThread({
  postId,
  comments,
  canWrite,
}: {
  postId: string;
  comments: readonly CommentNode[];
  canWrite: boolean;
}) {
  return (
    <div>
      {canWrite ? <CommentForm postId={postId} parentId={null} autoFocus={false} /> : null}

      {comments.length === 0 ? (
        <div className="mt-5">
          <Empty>Nessuno ha ancora risposto. La prima risposta fa partire la discussione.</Empty>
        </div>
      ) : (
        <ul className="m-0 mt-5 grid list-none gap-4 p-0">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              postId={postId}
              comment={comment}
              depth={0}
              canWrite={canWrite}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CommentItem({
  postId,
  comment,
  depth,
  canWrite,
}: {
  postId: string;
  comment: CommentNode;
  depth: number;
  canWrite: boolean;
}) {
  const [replying, setReplying] = useState(false);

  return (
    <li data-accent={comment.author.accent}>
      <div className="flex gap-2.5">
        <VoteControl
          targetType="COMMENT"
          targetId={comment.id}
          score={comment.score}
          myVote={comment.myVote}
          compact
        />

        <div className="min-w-0 flex-1">
          <p className="m-0 mb-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-3">
            <Link
              href={`/u/${comment.author.username}`}
              className="inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-ink"
            >
              <span className="size-[7px] flex-none rounded-full bg-[var(--accent)]" aria-hidden />
              {comment.author.displayName}
            </Link>
            {comment.author.role !== "USER" ? (
              <span className="font-mono text-[9px] uppercase tracking-[0.09em] text-[var(--accent)]">
                {ROLE_LABELS[comment.author.role]}
              </span>
            ) : null}
            <span className="font-mono">{relativeTime(comment.createdAt)}</span>
          </p>

          <p className="m-0 text-sm leading-relaxed">{comment.body}</p>

          {canWrite && depth < MAX_DEPTH ? (
            <button
              type="button"
              className="mt-1.5 cursor-pointer border-0 bg-transparent p-0 text-xs text-ink-3 hover:text-ink"
              onClick={() => setReplying((open) => !open)}
            >
              {replying ? "Annulla" : "Rispondi"}
            </button>
          ) : null}

          {replying ? (
            <CommentForm
              postId={postId}
              parentId={comment.id}
              autoFocus
              onDone={() => setReplying(false)}
            />
          ) : null}
        </div>
      </div>

      {comment.replies.length > 0 ? (
        <ul className="m-0 mt-3.5 ml-4.5 grid list-none gap-3.5 border-l border-rule-2 p-0 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              postId={postId}
              comment={reply}
              depth={depth + 1}
              canWrite={canWrite}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function CommentForm({
  postId,
  parentId,
  autoFocus,
  onDone,
}: {
  postId: string;
  parentId: string | null;
  autoFocus: boolean;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState(
    async (previous: ActionState, formData: FormData) => {
      const result = await createCommentAction(previous, formData);
      if (!result.error) onDone?.();
      return result;
    },
    INITIAL,
  );

  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="parentId" value={parentId ?? ""} />

      {state.error ? (
        <p className="mb-1.5 text-xs text-hot" role="alert">
          {state.error}
        </p>
      ) : null}

      <Textarea
        name="body"
        rows={parentId ? 2 : 3}
        maxLength={4000}
        required
        autoFocus={autoFocus}
        placeholder={parentId ? "La tua risposta" : "Aggiungi qualcosa alla discussione"}
      />

      <div className="mt-2 flex gap-2.5">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "Invio…" : parentId ? "Rispondi" : "Commenta"}
        </Button>
      </div>
    </form>
  );
}
