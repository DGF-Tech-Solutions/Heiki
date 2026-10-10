"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  createGuideAction,
  updateGuideAction,
  type GuideActionState,
} from "@/lib/guides/actions";
import { Markdown } from "@/components/markdown";
import { Button, chipClass, Field, Input, Notice, Select, Textarea } from "@/components/ui";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi } from "@/lib/i18n/locale";

const INITIAL: GuideActionState = {};

const TESTI = testi({
  it: {
    titolo: "Titolo",
    titoloHint: "da 10 a 140 caratteri",
    titoloSegnaposto: "Rotazione base per una squadra fisica",
    personaggio: "Personaggio collegato",
    personaggioHint: "opzionale: la guida comparirà nella sua scheda",
    nessuno: "Nessuno",
    scrivi: "Scrivi",
    anteprima: "Anteprima",
    caratteri: (_quanti: number, scritto: string) => `${scritto} caratteri`,
    testoSegnaposto:
      "## Turno 1\n\nFondi tutto quello che puoi fondere...\n\n- primo punto\n- secondo punto",
    vuoto: "Non c'è ancora niente da vedere.",
    sintassi: "Cosa si può usare nel testo",
    esempioTitolo: "## Titolo",
    esempioSottotitolo: "### Sottotitolo",
    e: "e",
    finisconoIndice: "— finiscono nell'indice",
    esempioGrassetto: "**grassetto**",
    esempioCorsivo: "*corsivo*",
    esempioCodice: "`codice`",
    elenchi: "elenchi con",
    oppure: "oppure",
    citazioni: "citazioni con",
    blocchiCodice: ", blocchi di codice con tre apici inversi",
    collegamenti: "collegamenti",
    esempioCollegamento: "[testo](indirizzo)",
    soloHttp: "— solo http, https o percorsi interni",
    noTabelle:
      "Tabelle e immagini non sono supportate: l'HTML scritto a mano non viene interpretato, per non trasformare il testo di chi scrive in codice eseguito da chi legge.",
    nota: "Nota sulla modifica",
    notaHint: "opzionale, finisce nella cronologia",
    notaSegnaposto: "Corretto il moltiplicatore del turno 3",
    salvo: "Salvo…",
    salvaModifiche: "Salva le modifiche",
    creaBozza: "Crea la bozza",
    annulla: "Annulla",
    nasceBozza: "Nasce come bozza: la pubblicazione la decide un redattore.",
  },
  en: {
    titolo: "Title",
    titoloHint: "10 to 140 characters",
    titoloSegnaposto: "Basic rotation for a physical team",
    personaggio: "Linked character",
    personaggioHint: "optional: the guide will appear on their page",
    nessuno: "None",
    scrivi: "Write",
    anteprima: "Preview",
    caratteri: (quanti: number, scritto: string) =>
      `${scritto} ${quanti === 1 ? "character" : "characters"}`,
    testoSegnaposto:
      "## Turn 1\n\nMerge everything you can merge...\n\n- first point\n- second point",
    vuoto: "There's nothing to see yet.",
    sintassi: "What you can use in the text",
    esempioTitolo: "## Heading",
    esempioSottotitolo: "### Subheading",
    e: "and",
    finisconoIndice: "— they go into the table of contents",
    esempioGrassetto: "**bold**",
    esempioCorsivo: "*italic*",
    esempioCodice: "`code`",
    elenchi: "lists with",
    oppure: "or",
    citazioni: "quotes with",
    blocchiCodice: ", code blocks with three backticks",
    collegamenti: "links",
    esempioCollegamento: "[text](address)",
    soloHttp: "— only http, https or internal paths",
    noTabelle:
      "Tables and images aren't supported: hand-written HTML isn't interpreted, so the writer's text can't turn into code run by the reader.",
    nota: "Edit note",
    notaHint: "optional, goes into the history",
    notaSegnaposto: "Fixed the turn 3 multiplier",
    salvo: "Saving…",
    salvaModifiche: "Save changes",
    creaBozza: "Create the draft",
    annulla: "Cancel",
    nasceBozza: "It starts as a draft: an editor decides whether it gets published.",
  },
});

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
  const locale = useLocale();
  const t = TESTI[locale];
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

      <Field label={t.titolo} hint={t.titoloHint}>
        <Input
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          minLength={10}
          maxLength={140}
          placeholder={t.titoloSegnaposto}
        />
      </Field>

      {characters.length > 0 && !existing ? (
        <Field label={t.personaggio} hint={t.personaggioHint}>
          <Select name="characterId" defaultValue="">
            <option value="">{t.nessuno}</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      {/* scrivere o guardare: la lama dei filtri, quieta (una delle due c'e' sempre) */}
      <div className="mb-2 flex items-center gap-1.5 border-b border-rule pb-2">
        {(["scrivi", "anteprima"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            aria-pressed={tab === name}
            className={chipClass(tab === name, true, "border-0")}
          >
            {name === "scrivi" ? t.scrivi : t.anteprima}
          </button>
        ))}
        <span className="ml-auto font-mono text-[11px] text-ink-3">
          {t.caratteri(chars, chars.toLocaleString(intlLocale(locale)))}
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
          placeholder={t.testoSegnaposto}
        />
      </div>

      {tab === "anteprima" ? (
        <div className="p5-corner border border-rule bg-paper-2 p-5">
          {chars === 0 ? (
            <p className="m-0 text-sm text-ink-3">{t.vuoto}</p>
          ) : (
            <Markdown source={body} />
          )}
        </div>
      ) : null}

      <details className="mt-4 border border-rule bg-paper-2 p-4">
        <summary className="cursor-pointer font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
          {t.sintassi}
        </summary>
        <ul className="m-0 mt-3 grid list-none gap-1.5 p-0 text-[13px] text-ink-2">
          <li>
            <code className="font-mono text-xs">{t.esempioTitolo}</code> {t.e}{" "}
            <code className="font-mono text-xs">{t.esempioSottotitolo}</code> {t.finisconoIndice}
          </li>
          <li>
            <code className="font-mono text-xs">{t.esempioGrassetto}</code>,{" "}
            <code className="font-mono text-xs">{t.esempioCorsivo}</code>,{" "}
            <code className="font-mono text-xs">{t.esempioCodice}</code>
          </li>
          <li>
            {t.elenchi} <code className="font-mono text-xs">-</code> {t.oppure}{" "}
            <code className="font-mono text-xs">1.</code>
          </li>
          <li>
            {t.citazioni} <code className="font-mono text-xs">&gt;</code>
            {t.blocchiCodice}
          </li>
          <li>
            {t.collegamenti} <code className="font-mono text-xs">{t.esempioCollegamento}</code>{" "}
            {t.soloHttp}
          </li>
        </ul>
        <p className="m-0 mt-3 text-[12px] text-ink-3">{t.noTabelle}</p>
      </details>

      {existing ? (
        <Field label={t.nota} hint={t.notaHint} className="mt-5">
          <Input name="note" maxLength={300} placeholder={t.notaSegnaposto} />
        </Field>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? t.salvo : existing ? t.salvaModifiche : t.creaBozza}
        </Button>
        <Link
          href={existing ? `/${game}/guide/${existing.slug}` : `/${game}/guide`}
          className="text-[13px] text-ink-2 underline decoration-rule underline-offset-2 hover:text-ink"
        >
          {t.annulla}
        </Link>
        {!existing ? <span className="text-[12px] text-ink-3">{t.nasceBozza}</span> : null}
      </div>
    </form>
  );
}
