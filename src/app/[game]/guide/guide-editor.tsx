"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createGuideAction,
  updateGuideAction,
  type GuideActionState,
} from "@/lib/guides/actions";
import { Markdown } from "@/components/markdown";
import { Button, Field, Input, Notice, Select, Textarea } from "@/components/ui";

const INITIAL: GuideActionState = {};

/**
 * Editor delle guide.
 *
 * Due schede, non due riquadri affiancati: su una guida lunga l'anteprima
 * affiancata dimezza lo spazio di scrittura proprio quando serve tutto, e su
 * telefono non ci sta comunque.
 *
 * L'anteprima usa lo stesso componente della pagina pubblicata. Se usasse una
 * resa semplificata, il "com'e' venuta" mostrato qui sarebbe una promessa che
 * la pagina vera puo' non mantenere.
 */
export function GuideEditor({
  game,
  characters,
  existing,
}: {
  game: string;
  characters: readonly { id: string; name: string }[];
  /** assente = nuova guida */
  existing?: {
    id: string;
    slug: string;
    title: string;
    body: string;
    characterId: string | null;
  };
}) {
  const [state, action, pending] = useActionState(
    existing ? updateGuideAction : createGuideAction,
    INITIAL,
  );

  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [tab, setTab] = useState<"scrivi" | "anteprima">("scrivi");

  const chars = body.trim().length;

  return (
    <form action={action}>
      <input type="hidden" name="game" value={game} />
      {existing ? (
        <>
          <input type="hidden" name="id" value={existing.id} />
          <input type="hidden" name="slug" value={existing.slug} />
        </>
      ) : null}

      {state.error ? (
        <Notice tone="error" className="mb-5">
          {state.error}
        </Notice>
      ) : null}
      {state.success ? <Notice className="mb-5">{state.success}</Notice> : null}

      <Field label="Titolo" hint="da 10 a 140 caratteri">
        <Input
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          minLength={10}
          maxLength={140}
          placeholder="Rotazione base per una squadra fisica"
        />
      </Field>

      {characters.length > 0 && !existing ? (
        <Field
          label="Personaggio collegato"
          hint="opzionale: la guida comparirà nella sua scheda"
        >
          <Select name="characterId" defaultValue="">
            <option value="">Nessuno</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <div className="mb-2 flex items-center gap-4 border-b border-rule">
        {(["scrivi", "anteprima"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            aria-pressed={tab === name}
            className={
              tab === name
                ? "-mb-px border-b-2 border-brand pb-2 text-sm font-semibold text-ink"
                : "-mb-px border-b-2 border-transparent pb-2 text-sm text-ink-3 hover:text-ink"
            }
          >
            {name === "scrivi" ? "Scrivi" : "Anteprima"}
          </button>
        ))}
        <span className="ml-auto pb-2 font-mono text-[11px] text-ink-3">
          {chars.toLocaleString("it-IT")} caratteri
        </span>
      </div>

      {/*
        Il campo di testo resta nel DOM anche in anteprima, solo nascosto: se lo
        smontassimo, il suo valore non arriverebbe nell'invio fatto dalla scheda
        anteprima, e si perderebbe tutto il testo scritto.
      */}
      <div hidden={tab !== "scrivi"}>
        <Textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          minLength={200}
          maxLength={60000}
          rows={22}
          className="min-h-[420px] font-mono text-[13px]"
          placeholder={"## Turno 1\n\nFondi tutto quello che puoi fondere...\n\n- primo punto\n- secondo punto"}
        />
      </div>

      {tab === "anteprima" ? (
        <div className="rounded-card border border-rule bg-paper p-5">
          {chars === 0 ? (
            <p className="m-0 text-sm text-ink-3">Non c&apos;è ancora niente da vedere.</p>
          ) : (
            <Markdown source={body} />
          )}
        </div>
      ) : null}

      <details className="mt-4 rounded-card border border-rule bg-paper-2 p-4">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
          Cosa si può usare nel testo
        </summary>
        <ul className="m-0 mt-3 grid list-none gap-1.5 p-0 text-[13px] text-ink-2">
          <li>
            <code className="font-mono text-xs">## Titolo</code> e{" "}
            <code className="font-mono text-xs">### Sottotitolo</code> — finiscono nell&apos;indice
          </li>
          <li>
            <code className="font-mono text-xs">**grassetto**</code>,{" "}
            <code className="font-mono text-xs">*corsivo*</code>,{" "}
            <code className="font-mono text-xs">`codice`</code>
          </li>
          <li>
            elenchi con <code className="font-mono text-xs">-</code> oppure{" "}
            <code className="font-mono text-xs">1.</code>
          </li>
          <li>
            citazioni con <code className="font-mono text-xs">&gt;</code>, blocchi di codice con
            tre apici inversi
          </li>
          <li>
            collegamenti <code className="font-mono text-xs">[testo](indirizzo)</code> — solo http,
            https o percorsi interni
          </li>
        </ul>
        <p className="m-0 mt-3 text-[12px] text-ink-3">
          Tabelle e immagini non sono supportate: l&apos;HTML scritto a mano non viene interpretato,
          per non trasformare il testo di chi scrive in codice eseguito da chi legge.
        </p>
      </details>

      {existing ? (
        <Field label="Nota sulla modifica" hint="opzionale, finisce nella cronologia" className="mt-5">
          <Input name="note" maxLength={300} placeholder="Corretto il moltiplicatore del turno 3" />
        </Field>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Salvo…" : existing ? "Salva le modifiche" : "Crea la bozza"}
        </Button>
        <Link
          href={existing ? `/${game}/guide/${existing.slug}` : `/${game}/guide`}
          className="text-[13px] text-ink-2 hover:text-brand"
        >
          Annulla
        </Link>
        {!existing ? (
          <span className="text-[12px] text-ink-3">
            Nasce come bozza: la pubblicazione la decide un redattore.
          </span>
        ) : null}
      </div>
    </form>
  );
}
