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
        setStatus("Salvato in questo browser. Con il database attivo finira' sul tuo account.");
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
        <div className="workbar">
          <span className="workbar__label">
            <span className="eyebrow">{editing ? "Modalita' modifica" : "Il tuo profilo"}</span>
            <span className="mono workbar__handle">/u/{draft.username || "…"}</span>
          </span>

          <span className="workbar__actions">
            {editing ? (
              <>
                <span className="editor__status">
                  {status ?? (dirty ? "Modifiche non salvate" : "Nessuna modifica")}
                </span>
                <button type="button" className="btn" onClick={discard} disabled={!dirty}>
                  Annulla
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={save}
                  disabled={pending || !dirty}
                >
                  {pending ? "Salvataggio…" : "Salva"}
                </button>
                <button type="button" className="btn btn--ghost" onClick={close}>
                  Chiudi
                </button>
              </>
            ) : (
              <>
                {status ? <span className="editor__status">{status}</span> : null}
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    setStatus(null);
                    setEditing(true);
                  }}
                >
                  Modifica profilo
                </button>
              </>
            )}
          </span>
        </div>
      ) : null}

      {editing ? (
        <div className="editor">
          <ProfileEditorPanel value={draft} onChange={update} canUsePremium={canUsePremium} />
          <div className="editor__preview">
            <div className="editor__preview-tag">
              <span className="eyebrow">Anteprima dal vivo</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>
                /u/{draft.username || "…"}
              </span>
            </div>
            <ProfileView data={draft} />
          </div>
        </div>
      ) : (
        <div className="profile">
          <ProfileView data={draft} />
        </div>
      )}
    </>
  );
}
