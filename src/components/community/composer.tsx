"use client";

/**
 * Composizione di un nuovo post.
 *
 * Sta chiuso finche' non serve: un modulo sempre aperto in cima al feed occupa
 * lo spazio del contenuto, che e' la ragione per cui si e' arrivati qui.
 */

import { useActionState, useState } from "react";
import { createPostAction, type ActionState } from "@/lib/community/actions";
import { HUBS } from "@/lib/community/types";
import { Button, buttonClass, Field, Input, Notice, Select, Textarea } from "../ui";

const INITIAL: ActionState = {};

export function Composer({ game, defaultHub }: { game: string; defaultHub: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createPostAction, INITIAL);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full cursor-pointer items-center gap-3.5 rounded-card border border-rule bg-paper px-3.5 py-3 text-left transition-colors hover:border-brand"
      >
        <span className="flex-1 text-sm text-ink-3">
          Hai trovato qualcosa che funziona? Raccontalo.
        </span>
        <span className={buttonClass("primary", "sm")} aria-hidden>
          Scrivi
        </span>
      </button>
    );
  }

  return (
    <form action={action} className="rounded-card border border-brand bg-paper p-5">
      <input type="hidden" name="game" value={game} />
      {state.error ? (
        <Notice tone="error" className="mb-3.5">
          {state.error}
        </Notice>
      ) : null}

      <div className="flex flex-wrap gap-3.5">
        <Field label="Sezione" className="mb-0 basis-[190px]">
          <Select name="hub" defaultValue={defaultHub}>
            {HUBS.map((hub) => (
              <option key={hub.slug} value={hub.slug}>
                {hub.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Titolo" className="mb-0 flex-1">
          <Input name="title" maxLength={140} required placeholder="Cosa hai scoperto, in una riga" />
        </Field>
      </div>

      <Field
        label="Testo"
        hint="i numeri battono le opinioni"
        className="mt-3.5"
      >
        <Textarea
          name="body"
          rows={6}
          maxLength={8000}
          required
          placeholder="Che squadra hai provato, contro cosa, e cosa è cambiato nei risultati."
        />
      </Field>

      <div className="mt-3.5 flex gap-2.5">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Pubblico…" : "Pubblica"}
        </Button>
        <Button type="button" onClick={() => setOpen(false)} disabled={pending}>
          Annulla
        </Button>
      </div>
    </form>
  );
}
