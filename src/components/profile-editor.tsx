"use client";

/**
 * Pannello dei controlli del profilo.
 *
 * E' un componente CONTROLLATO: non possiede lo stato, lo riceve e notifica le
 * modifiche. Lo stato vive in ProfileWorkspace, che e' anche l'unico a sapere se
 * si sta modificando o solo guardando. Cosi' uscire dalla modalita' modifica non
 * perde nulla di quello che si stava scrivendo.
 *
 * Due cose restano deliberatamente NON modificabili, ed e' una scelta di
 * prodotto, non una mancanza:
 *  - il nome di un badge, perche' i badge si guadagnano e non si scelgono;
 *  - il livello di fiducia di un badge o di un account, perche' lo assegna la
 *    verifica automatica. Se fossero modificabili a mano, la spunta "verificato"
 *    non varrebbe piu' niente per nessuno.
 * Si puo' decidere cosa esporre e in che ordine: quella e' presentazione.
 */

import type { ProfileViewData } from "./profile-view";
import {
  ACCENTS,
  BADGE_SHOWCASE_LIMIT,
  CUSTOMIZATION_GROUPS,
  DEFAULT_CUSTOMIZATION,
  type CustomizationKey,
  type ProfileCustomization,
} from "@/lib/profile/customization";

const ACCENT_SWATCH: Readonly<Record<string, string>> = {
  gold: "#e5b24c",
  violet: "#9b7bf0",
  cyan: "#4fd6e0",
  lime: "#b8e04f",
  rose: "#f07ba8",
  ember: "linear-gradient(135deg, #f0824c, #e5b24c)",
};

export const BIO_LIMIT = 280;
export const NAME_LIMIT = 40;

export type ProfileDraft = Omit<
  ProfileViewData,
  "favorites" | "badges" | "gameAccounts" | "builds" | "customization"
> & {
  favorites: string[];
  badges: ProfileViewData["badges"][number][];
  gameAccounts: ProfileViewData["gameAccounts"][number][];
  builds: ProfileViewData["builds"][number][];
  customization: ProfileCustomization;
};

export function toDraft(data: ProfileViewData): ProfileDraft {
  return {
    ...data,
    bio: data.bio ?? "",
    country: data.country ?? "",
    favorites: [...data.favorites],
    badges: data.badges.map((badge) => ({ ...badge })),
    gameAccounts: data.gameAccounts.map((account) => ({ ...account })),
    builds: data.builds.map((build) => ({ ...build })),
    customization: { ...(data.customization ?? DEFAULT_CUSTOMIZATION) },
  };
}

interface Props {
  value: ProfileDraft;
  onChange: (next: ProfileDraft) => void;
  /** false = le opzioni premium restano visibili ma non selezionabili */
  canUsePremium: boolean;
}

export function ProfileEditorPanel({ value, onChange, canUsePremium }: Props) {
  const patch = (changes: Partial<ProfileDraft>) => onChange({ ...value, ...changes });

  const setCustom = (key: CustomizationKey, option: string) =>
    onChange({ ...value, customization: { ...value.customization, [key]: option } });

  const shownBadges = value.badges.filter((badge) => badge.shown !== false).length;

  return (
    <div className="editor__panel">
      {/* --------------------------------------------------------- identita' */}
      <section className="group">
        <div className="group__head">
          <h2 className="group__title">Identita&apos;</h2>
          <span className="group__hint">Come ti trovano e come ti presenti</span>
        </div>

        <label className="field">
          <span className="field__label">
            Nome visualizzato
            <Counter value={value.displayName.length} limit={NAME_LIMIT} />
          </span>
          <input
            className="input"
            value={value.displayName}
            maxLength={NAME_LIMIT}
            onChange={(event) => patch({ displayName: event.target.value })}
          />
        </label>

        <label className="field">
          <span className="field__label">
            Handle
            <span className="field__hint">/u/{value.username || "…"}</span>
          </span>
          <input
            className="input input--mono"
            value={value.username}
            maxLength={20}
            onChange={(event) => patch({ username: slugify(event.target.value) })}
          />
        </label>

        <label className="field">
          <span className="field__label">
            Paese o regione
            <span className="field__hint">facoltativo</span>
          </span>
          <input
            className="input"
            value={value.country ?? ""}
            maxLength={40}
            placeholder="Italia"
            onChange={(event) => patch({ country: event.target.value })}
          />
        </label>

        <label className="field" style={{ marginBottom: 0 }}>
          <span className="field__label">
            Bio
            <Counter value={(value.bio ?? "").length} limit={BIO_LIMIT} />
          </span>
          <textarea
            className="textarea"
            value={value.bio ?? ""}
            maxLength={BIO_LIMIT}
            onChange={(event) => patch({ bio: event.target.value })}
          />
        </label>
      </section>

      {/* ----------------------------------------------------------- aspetto */}
      <section className="group">
        <div className="group__head">
          <h2 className="group__title">Aspetto</h2>
          <span className="group__hint">
            Tutti i cosmetici sono disegni nostri: nessun asset dei giochi
          </span>
        </div>

        <div className="subgroup">
          <span className="subgroup__label">
            Accento
            <span className="field__hint">colora livello, badge e dettagli</span>
          </span>
          <div className="swatches">
            {ACCENTS.map((option) => {
              const locked = option.premium && !canUsePremium;
              return (
                <button
                  key={option.id}
                  type="button"
                  className="swatch-btn"
                  style={{ ["--swatch-color" as string]: ACCENT_SWATCH[option.id] ?? "#e5b24c" }}
                  data-premium={option.premium || undefined}
                  aria-pressed={value.customization.accent === option.id}
                  aria-label={`${option.label}${option.premium ? " (premium)" : ""}`}
                  title={locked ? `${option.label} — richiede il premium` : option.description}
                  disabled={locked}
                  onClick={() => setCustom("accent", option.id)}
                />
              );
            })}
          </div>
        </div>

        {CUSTOMIZATION_GROUPS.filter((group) => group.key !== "accent").map((group) => (
          <div className="subgroup" key={group.key}>
            <span className="subgroup__label">
              {group.label}
              <span className="field__hint">{group.hint}</span>
            </span>
            <div className="chips">
              {group.options.map((option) => {
                const locked = option.premium && !canUsePremium;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className="chip"
                    aria-pressed={value.customization[group.key] === option.id}
                    title={locked ? `${option.label} — richiede il premium` : option.description}
                    disabled={locked}
                    onClick={() => setCustom(group.key, option.id)}
                  >
                    {option.label}
                    {option.premium ? <span className="chip__star">★</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* --------------------------------------------------------- preferiti */}
      <ListGroup
        title="Personaggi preferiti"
        hint="Compaiono in cima al profilo, nell'ordine che scegli"
        items={value.favorites}
        onChange={(favorites) => patch({ favorites })}
        create={() => ""}
        addLabel="Aggiungi preferito"
        renderFields={(item, update) => (
          <input
            className="mini-input"
            value={item}
            placeholder="Nome del personaggio"
            maxLength={40}
            onChange={(event) => update(event.target.value)}
          />
        )}
      />

      {/* ------------------------------------------------------------- badge */}
      <section className="group">
        <div className="group__head">
          <h2 className="group__title">Vetrina dei badge</h2>
          <span className="group__hint">
            {shownBadges} esposti su {BADGE_SHOWCASE_LIMIT} posti. I badge si guadagnano: puoi
            scegliere quali mostrare e in che ordine, non rinominarli.
          </span>
        </div>

        {value.badges.length === 0 ? (
          <p className="empty" style={{ padding: 16, fontSize: 13 }}>
            Nessun badge ancora.
          </p>
        ) : (
          <div className="editor-list">
            {value.badges.map((badge, index) => {
              const shown = badge.shown !== false;
              const atLimit = !shown && shownBadges >= BADGE_SHOWCASE_LIMIT;
              return (
                <div className="editor-row" key={badge.id}>
                  <Reorder
                    index={index}
                    length={value.badges.length}
                    onMove={(from, to) => patch({ badges: move(value.badges, from, to) })}
                  />
                  <span className="editor-row__body" style={{ gap: 2 }}>
                    <span style={{ fontSize: 13 }}>
                      {badge.icon ?? "◇"} {badge.name}
                    </span>
                    <span className="badge__trust">{badge.trust.toLowerCase()}</span>
                  </span>
                  <label className="toggle" title={atLimit ? "Vetrina piena" : undefined}>
                    <input
                      type="checkbox"
                      checked={shown}
                      disabled={atLimit}
                      onChange={(event) =>
                        patch({
                          badges: replace(value.badges, index, {
                            ...badge,
                            shown: event.target.checked,
                          }),
                        })
                      }
                    />
                    esponi
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* -------------------------------------------------- profili di gioco */}
      <ListGroup
        title="Profili di gioco"
        hint="Solo UID pubblici. Non chiediamo mai le credenziali del tuo account di gioco, e il livello di fiducia lo assegna la verifica automatica."
        items={value.gameAccounts}
        onChange={(gameAccounts) => patch({ gameAccounts })}
        create={() => ({
          id: `acc-${Date.now()}`,
          game: "",
          uid: "",
          nickname: "",
          trust: "DECLARED" as const,
          shown: true,
        })}
        addLabel="Collega un profilo"
        renderFields={(account, update) => (
          <>
            <input
              className="mini-input"
              value={account.game}
              placeholder="Gioco"
              maxLength={40}
              onChange={(event) => update({ ...account, game: event.target.value })}
            />
            <span style={{ display: "flex", gap: 6 }}>
              <input
                className="mini-input mini-input--mono"
                value={account.uid}
                placeholder="UID"
                maxLength={24}
                onChange={(event) => update({ ...account, uid: event.target.value })}
              />
              <input
                className="mini-input"
                value={account.nickname ?? ""}
                placeholder="Nickname"
                maxLength={30}
                onChange={(event) => update({ ...account, nickname: event.target.value })}
              />
            </span>
          </>
        )}
        renderAside={(account, update) => (
          <label className="toggle">
            <input
              type="checkbox"
              checked={account.shown !== false}
              onChange={(event) => update({ ...account, shown: event.target.checked })}
            />
            mostra
          </label>
        )}
      />

      {/* ------------------------------------------------------------- build */}
      <ListGroup
        title="Build"
        hint="Decidi quali rendere pubbliche sul profilo"
        items={value.builds}
        onChange={(builds) => patch({ builds })}
        create={() => ({
          id: `build-${Date.now()}`,
          name: "Nuova build",
          game: "",
          character: "",
          median: 0,
          patch: "—",
          isPublic: true,
        })}
        addLabel="Aggiungi build"
        renderFields={(build, update) => (
          <>
            <input
              className="mini-input"
              value={build.name}
              placeholder="Nome della build"
              maxLength={50}
              onChange={(event) => update({ ...build, name: event.target.value })}
            />
            <span style={{ display: "flex", gap: 6 }}>
              <input
                className="mini-input"
                value={build.character}
                placeholder="Personaggio"
                maxLength={40}
                onChange={(event) => update({ ...build, character: event.target.value })}
              />
              <input
                className="mini-input mini-input--mono"
                value={build.median || ""}
                placeholder="Danno"
                inputMode="numeric"
                onChange={(event) =>
                  update({ ...build, median: Number(event.target.value.replace(/\D/g, "")) || 0 })
                }
              />
            </span>
          </>
        )}
        renderAside={(build, update) => (
          <label className="toggle">
            <input
              type="checkbox"
              checked={build.isPublic !== false}
              onChange={(event) => update({ ...build, isPublic: event.target.checked })}
            />
            pubblica
          </label>
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------- ausiliari */

function Counter({ value, limit }: { value: number; limit: number }) {
  return (
    <span className={value > limit * 0.9 ? "counter counter--over" : "counter"}>
      {value}/{limit}
    </span>
  );
}

function Reorder({
  index,
  length,
  onMove,
}: {
  index: number;
  length: number;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <span className="editor-row__grip">
      <button
        type="button"
        className="icon-btn"
        aria-label="Sposta su"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        ▲
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label="Sposta giu'"
        disabled={index === length - 1}
        onClick={() => onMove(index, index + 1)}
      >
        ▼
      </button>
    </span>
  );
}

/**
 * Gruppo di elementi riordinabili, aggiungibili e rimovibili.
 * Generico perche' preferiti, account e build hanno la stessa meccanica e
 * cambiano solo i campi da mostrare.
 */
function ListGroup<T>({
  title,
  hint,
  items,
  onChange,
  create,
  addLabel,
  renderFields,
  renderAside,
}: {
  title: string;
  hint: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  addLabel: string;
  renderFields: (item: T, update: (next: T) => void) => React.ReactNode;
  renderAside?: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <section className="group">
      <div className="group__head">
        <h2 className="group__title">{title}</h2>
        <span className="group__hint">{hint}</span>
      </div>

      {items.length === 0 ? (
        <p className="empty" style={{ padding: 16, fontSize: 13 }}>
          Niente qui, per ora.
        </p>
      ) : (
        <div className="editor-list">
          {items.map((item, index) => {
            const update = (next: T) => onChange(replace(items, index, next));
            return (
              <div className="editor-row" key={index}>
                <Reorder
                  index={index}
                  length={items.length}
                  onMove={(from, to) => onChange(move(items, from, to))}
                />
                <span className="editor-row__body">{renderFields(item, update)}</span>
                {renderAside?.(item, update)}
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  aria-label="Rimuovi"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="btn"
        style={{ marginTop: 12, height: 32 }}
        onClick={() => onChange([...items, create()])}
      >
        + {addLabel}
      </button>
    </section>
  );
}

function replace<T>(items: readonly T[], index: number, next: T): T[] {
  const copy = items.slice();
  copy[index] = next;
  return copy;
}

function move<T>(items: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items.slice();
  const copy = items.slice();
  const [moved] = copy.splice(from, 1);
  if (moved === undefined) return copy;
  copy.splice(to, 0, moved);
  return copy;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 20);
}
