"use client";

/**
 * Contenitore del profilo: decide se si sta guardando o modificando.
 *
 * Il profilo si apre sempre in sola lettura - e' la sua forma normale, quella
 * che vede chiunque apra il link. La modifica e' una modalita' che si accende
 * con un tasto, e mentre e' accesa la pagina si divide in controlli e anteprima.
 *
 * Lo stato della bozza vive qui e non nel pannello: uscire dalla modalita'
 * modifica non deve buttare via quello che si stava scrivendo. Chiudere con
 * modifiche non salvate lo dice, invece di farle sparire in silenzio.
 */

import { useCallback, useMemo, useState, useTransition } from "react";
import { ProfileView } from "./profile-view";
import type { ProfileViewData } from "./profile-view";
import { ProfileEditorPanel, toDraft, type ProfileDraft } from "./profile-editor";
import { Button, cx, eyebrow, numeric } from "./ui";

const DRAFT_KEY = "gachazone:profile-draft";

export interface SaveResult {
  ok: boolean;
  error?: string;
}

interface Props {
  initial: ProfileViewData;
  /** false = si puo' solo guardare: il tasto di modifica non compare */
  canEdit: boolean;
  /** false = le opzioni premium restano visibili ma non selezionabili */
  canUsePremium: boolean;
  /** true = nessun database: si salva solo nel browser */
  demoMode: boolean;
  /** entra gia' in modalita' modifica (pagina impostazioni) */
  startEditing?: boolean;
  saveAction?: (payload: ProfileViewData) => Promise<SaveResult>;
}

export function ProfileWorkspace({
  initial,
  canEdit,
  canUsePremium,
  demoMode,
  startEditing = false,
  saveAction,
}: Props) {
  const baseline = useMemo(() => toDraft(initial), [initial]);
  const [draft, setDraft] = useState<ProfileDraft>(baseline);
  const [editing, setEditing] = useState(canEdit && startEditing);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  );

  const update = useCallback((next: ProfileDraft) => {
    setStatus(null);
    setDraft(next);
  }, []);

  function save() {
    if (demoMode || !saveAction) {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setStatus("Salvato in questo browser. Col database acceso finirà sul tuo account.");
      } catch {
        setStatus("Il browser non consente il salvataggio locale.");
      }
      return;
    }

    startTransition(async () => {
      const result = await saveAction(draft);
      setStatus(result.ok ? "Profilo aggiornato." : (result.error ?? "Salvataggio non riuscito."));
      if (result.ok) setEditing(false);
    });
  }

  function discard() {
    setDraft(baseline);
    setStatus("Modifiche annullate.");
  }

  function close() {
    // Perdere il lavoro senza avvisare e' il modo piu' rapido per far smettere
    // qualcuno di personalizzare il proprio profilo.
    if (dirty && !window.confirm("Ci sono modifiche non salvate. Chiudere comunque?")) return;
    setDraft(baseline);
    setEditing(false);
    setStatus(null);
  }

  return (
    <>
      {canEdit ? (
        <div className="sticky top-[58px] z-15 mb-1 flex flex-wrap items-center gap-3.5 border-b border-rule bg-paper py-3.5">
          <span className="grid gap-0.5">
            <span className={eyebrow}>{editing ? "Stai modificando" : "Il tuo profilo"}</span>
            <span className={cx(numeric, "text-xs text-ink-3")}>/u/{draft.username || "…"}</span>
          </span>

          <span className="ml-auto flex flex-wrap items-center gap-2.5">
            {editing ? (
              <>
                <span className={cx(numeric, "text-[11px] text-ink-3")}>
                  {status ?? (dirty ? "Modifiche non salvate" : "Nessuna modifica")}
                </span>
                <Button onClick={discard} disabled={!dirty}>
                  Annulla
                </Button>
                <Button variant="primary" onClick={save} disabled={pending || !dirty}>
                  {pending ? "Salvo…" : "Salva"}
                </Button>
                <Button variant="ghost" onClick={close}>
                  Chiudi
                </Button>
              </>
            ) : (
              <>
                {status ? (
                  <span className={cx(numeric, "text-[11px] text-ink-3")}>{status}</span>
                ) : null}
                <Button
                  variant="primary"
                  onClick={() => {
                    setStatus(null);
                    setEditing(true);
                  }}
                >
                  Modifica profilo
                </Button>
              </>
            )}
          </span>
        </div>
      ) : null}

      {editing ? (
        <div className="grid items-start gap-10 pt-6 pb-20 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          <ProfileEditorPanel value={draft} onChange={update} canUsePremium={canUsePremium} />

          <div className="overflow-hidden rounded-card border border-rule bg-paper px-7 pt-6 pb-8 lg:sticky lg:top-[124px]">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-rule-2 pb-3.5">
              <span className={eyebrow}>Anteprima dal vivo</span>
              <span className={cx(numeric, "text-[11px] text-ink-3")}>
                /u/{draft.username || "…"}
              </span>
            </div>
            <ProfileView data={draft} />
          </div>
        </div>
      ) : (
        <div className="pt-6 pb-16">
          <ProfileView data={draft} />
        </div>
      )}
    </>
  );
}
