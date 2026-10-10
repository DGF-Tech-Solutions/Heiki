"use client";

/**
 * Composizione di un nuovo post.
 *
 * Sta chiuso finche' non serve: un modulo sempre aperto in cima al feed occupa
 * lo spazio del contenuto, che e' la ragione per cui si e' arrivati qui.
 */

import { useActionState, useState } from "react";
import { createPostAction, type ActionState } from "@/lib/community/actions";
import { HUBS, hubLabel } from "@/lib/community/types";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { Button, buttonClass, Field, Input, Notice, Select, Textarea } from "../ui";

const INITIAL: ActionState = {};

const TESTI = testi({
  it: {
    invito: "Hai trovato qualcosa che funziona? Raccontalo.",
    scrivi: "Scrivi",
    sezione: "Sezione",
    titolo: "Titolo",
    titoloPlaceholder: "Cosa hai scoperto, in una riga",
    testo: "Testo",
    testoHint: "i numeri battono le opinioni",
    testoPlaceholder: "Che squadra hai provato, contro cosa, e cosa è cambiato nei risultati.",
    pubblico: "Pubblico…",
    pubblica: "Pubblica",
    annulla: "Annulla",
  },
  en: {
    invito: "Found something that works? Tell everyone.",
    scrivi: "Write",
    sezione: "Section",
    titolo: "Title",
    titoloPlaceholder: "What you found, in one line",
    testo: "Text",
    testoHint: "numbers beat opinions",
    testoPlaceholder: "Which team you tried, against what, and what changed in the results.",
    pubblico: "Publishing…",
    pubblica: "Publish",
    annulla: "Cancel",
  },
});

export function Composer({ game, defaultHub }: { game: string; defaultHub: string }) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createPostAction, INITIAL);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p5-corner flex w-full cursor-pointer items-center gap-3.5 border border-rule bg-paper-2 px-3.5 py-3 text-left transition-colors hover:border-brand"
      >
        <span className="flex-1 text-sm text-ink-3">{t.invito}</span>
        <span className={buttonClass("primary", "sm")} aria-hidden>
          {t.scrivi}
        </span>
      </button>
    );
  }

  return (
    <form action={action} className="p5-corner border border-brand bg-paper-2 p-5">
      <input type="hidden" name="game" value={game} />
      {state.error ? (
        <Notice tone="error" className="mb-3.5">
          {state.error}
        </Notice>
      ) : null}

      <div className="flex flex-wrap gap-3.5">
        <Field label={t.sezione} className="mb-0 basis-[190px]">
          <Select name="hub" defaultValue={defaultHub}>
            {HUBS.map((hub) => (
              <option key={hub.slug} value={hub.slug}>
                {hubLabel(hub.slug, locale, hub.name)}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={t.titolo} className="mb-0 flex-1">
          <Input name="title" maxLength={140} required placeholder={t.titoloPlaceholder} />
        </Field>
      </div>

      <Field label={t.testo} hint={t.testoHint} className="mt-3.5">
        <Textarea name="body" rows={6} maxLength={8000} required placeholder={t.testoPlaceholder} />
      </Field>

      <div className="mt-3.5 flex gap-2.5">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? t.pubblico : t.pubblica}
        </Button>
        <Button type="button" onClick={() => setOpen(false)} disabled={pending}>
          {t.annulla}
        </Button>
      </div>
    </form>
  );
}
