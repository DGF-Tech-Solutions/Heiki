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
 *    verifica automatica. Se fossero modificabili a mano, la spunta
 *    "verificato" non varrebbe piu' niente per nessuno.
 * Si puo' decidere cosa esporre e in che ordine: quella e' presentazione.
 */

import type { ReactNode } from "react";
import type { ProfileViewData } from "./profile-view";
import {
  ACCENTS,
  BADGE_SHOWCASE_LIMIT,
  CUSTOMIZATION_GROUPS,
  DEFAULT_CUSTOMIZATION,
  type CustomizationKey,
  type ProfileCustomization,
} from "@/lib/profile/customization";
import { Button, cx, display, Empty, Field, Input, Textarea } from "./ui";

const ACCENT_SWATCH: Readonly<Record<string, string>> = {
  brand: "#6425ff",
  magenta: "#e0169a",
  ocean: "#0870d8",
  forest: "#12805a",
  sunset: "#e2510f",
  gold: "#b07d05",
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
    <div className="grid gap-5">
      <Group title="Chi sei" hint="Come ti trovano e come ti presenti">
        <Field
          label="Nome visualizzato"
          hint={<Counter value={value.displayName.length} limit={NAME_LIMIT} />}
        >
          <Input
            value={value.displayName}
            maxLength={NAME_LIMIT}
            onChange={(event) => patch({ displayName: event.target.value })}
          />
        </Field>

        <Field label="Handle" hint={`/u/${value.username || "…"}`}>
          <Input
            className="font-mono"
            value={value.username}
            maxLength={20}
            onChange={(event) => patch({ username: slugify(event.target.value) })}
          />
        </Field>

        <Field label="Paese o regione" hint="facoltativo">
          <Input
            value={value.country ?? ""}
            maxLength={40}
            placeholder="Italia"
            onChange={(event) => patch({ country: event.target.value })}
          />
        </Field>

        <Field
          label="Bio"
          hint={<Counter value={(value.bio ?? "").length} limit={BIO_LIMIT} />}
          className="mb-0"
        >
          <Textarea
            value={value.bio ?? ""}
            maxLength={BIO_LIMIT}
            onChange={(event) => patch({ bio: event.target.value })}
          />
        </Field>
      </Group>

      <Group title="Aspetto" hint="Tutti i cosmetici sono disegni nostri: nessun asset dei giochi">
        <Subgroup label="Accento" hint="colora livello, badge e dettagli">
          <div className="flex flex-wrap gap-2.5">
            {ACCENTS.map((option) => {
              const locked = option.premium && !canUsePremium;
              const active = value.customization.accent === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={locked}
                  aria-pressed={active}
                  aria-label={`${option.label}${option.premium ? " (premium)" : ""}`}
                  title={locked ? `${option.label} — richiede il premium` : option.description}
                  onClick={() => setCustom("accent", option.id)}
                  style={{ background: ACCENT_SWATCH[option.id] ?? "#6425ff" }}
                  className={cx(
                    "relative size-8 cursor-pointer rounded-full border border-rule transition-transform",
                    "hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40",
                    active && "ring-2 ring-ink ring-offset-2",
                  )}
                >
                  {option.premium ? (
                    <span className="absolute -top-1 -right-1 grid size-3.5 place-items-center rounded-full bg-paper text-[8px] leading-none text-gold">
                      ★
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Subgroup>

        {CUSTOMIZATION_GROUPS.filter((group) => group.key !== "accent").map((group) => (
          <Subgroup key={group.key} label={group.label} hint={group.hint}>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const locked = option.premium && !canUsePremium;
                const active = value.customization[group.key] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={locked}
                    aria-pressed={active}
                    title={locked ? `${option.label} — richiede il premium` : option.description}
                    onClick={() => setCustom(group.key, option.id)}
                    className={cx(
                      "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-card border px-3 text-[13px] transition-colors",
                      "disabled:cursor-not-allowed disabled:opacity-40",
                      active
                        ? "border-brand bg-brand-soft font-medium text-ink"
                        : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                    )}
                  >
                    {option.label}
                    {option.premium ? <span className="text-[9px] text-gold">★</span> : null}
                  </button>
                );
              })}
            </div>
          </Subgroup>
        ))}
      </Group>

      <ListGroup
        title="Personaggi preferiti"
        hint="Compaiono in cima al profilo, nell'ordine che scegli"
        items={value.favorites}
        onChange={(favorites) => patch({ favorites })}
        create={() => ""}
        addLabel="Aggiungi preferito"
        renderFields={(item, update) => (
          <MiniInput
            value={item}
            placeholder="Nome del personaggio"
            maxLength={40}
            onChange={(next) => update(next)}
          />
        )}
      />

      <Group
        title="Vetrina dei badge"
        hint={`${shownBadges} esposti su ${BADGE_SHOWCASE_LIMIT} posti. I badge si guadagnano: scegli quali mostrare e in che ordine, non come si chiamano.`}
      >
        {value.badges.length === 0 ? (
          <Empty>Nessun badge ancora.</Empty>
        ) : (
          <div className="grid gap-2">
            {value.badges.map((badge, index) => {
              const shown = badge.shown !== false;
              const atLimit = !shown && shownBadges >= BADGE_SHOWCASE_LIMIT;
              return (
                <Row key={badge.id}>
                  <Reorder
                    index={index}
                    length={value.badges.length}
                    onMove={(from, to) => patch({ badges: move(value.badges, from, to) })}
                  />
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block text-[13px]">
                      {badge.icon ?? "◇"} {badge.name}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.09em] text-ink-3">
                      {badge.trust.toLowerCase()}
                    </span>
                  </span>
                  <label
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs whitespace-nowrap text-ink-2"
                    title={atLimit ? "Vetrina piena" : undefined}
                  >
                    <input
                      type="checkbox"
                      className="size-3.5 accent-brand"
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
                </Row>
              );
            })}
          </div>
        )}
      </Group>

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
            <MiniInput
              value={account.game}
              placeholder="Gioco"
              maxLength={40}
              onChange={(game) => update({ ...account, game })}
            />
            <span className="flex gap-1.5">
              <MiniInput
                mono
                value={account.uid}
                placeholder="UID"
                maxLength={24}
                onChange={(uid) => update({ ...account, uid })}
              />
              <MiniInput
                value={account.nickname ?? ""}
                placeholder="Nickname"
                maxLength={30}
                onChange={(nickname) => update({ ...account, nickname })}
              />
            </span>
          </>
        )}
        renderAside={(account, update) => (
          <Toggle
            checked={account.shown !== false}
            label="mostra"
            onChange={(shown) => update({ ...account, shown })}
          />
        )}
      />

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
            <MiniInput
              value={build.name}
              placeholder="Nome della build"
              maxLength={50}
              onChange={(name) => update({ ...build, name })}
            />
            <span className="flex gap-1.5">
              <MiniInput
                value={build.character}
                placeholder="Personaggio"
                maxLength={40}
                onChange={(character) => update({ ...build, character })}
              />
              <MiniInput
                mono
                value={build.median || ""}
                placeholder="Danno"
                inputMode="numeric"
                onChange={(raw) =>
                  update({ ...build, median: Number(String(raw).replace(/\D/g, "")) || 0 })
                }
              />
            </span>
          </>
        )}
        renderAside={(build, update) => (
          <Toggle
            checked={build.isPublic !== false}
            label="pubblica"
            onChange={(isPublic) => update({ ...build, isPublic })}
          />
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------- ausiliari */

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-rule bg-paper p-5">
      <div className="mb-3.5">
        <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>{title}</h2>
        <span className="mt-1 block text-xs text-ink-3">{hint}</span>
      </div>
      {children}
    </section>
  );
}

function Subgroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4 border-t border-rule-2 pt-4 first:mt-0 first:border-0 first:pt-0">
      <span className="mb-2.5 flex items-baseline justify-between gap-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
        {label}
        <span className="text-[11px] normal-case tracking-normal">{hint}</span>
      </span>
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-rule-2 bg-paper-2 px-3 py-2.5">
      {children}
    </div>
  );
}

function MiniInput({
  value,
  onChange,
  mono = false,
  ...props
}: {
  value: string | number;
  onChange: (value: string) => void;
  mono?: boolean;
  placeholder?: string;
  maxLength?: number;
  inputMode?: "numeric";
}) {
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cx(
        "h-[30px] w-full rounded-sm border border-rule bg-paper px-2.5 text-[13px] text-ink",
        "focus:border-brand focus:outline-none",
        mono && "font-mono text-xs",
      )}
    />
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs whitespace-nowrap text-ink-2">
      <input
        type="checkbox"
        className="size-3.5 accent-brand"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function Counter({ value, limit }: { value: number; limit: number }) {
  return (
    <span className={cx("font-mono", value > limit * 0.9 ? "text-hot" : "text-ink-3")}>
      {value}/{limit}
    </span>
  );
}

const ICON_BTN =
  "grid place-items-center rounded-sm border border-rule text-[9px] text-ink-3 cursor-pointer " +
  "hover:border-ink-3 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed";

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
    <span className="flex flex-col gap-0.5">
      <button
        type="button"
        className={cx(ICON_BTN, "h-4.5 w-6")}
        aria-label="Sposta su"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        ▲
      </button>
      <button
        type="button"
        className={cx(ICON_BTN, "h-4.5 w-6")}
        aria-label="Sposta giù"
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
  renderFields: (item: T, update: (next: T) => void) => ReactNode;
  renderAside?: (item: T, update: (next: T) => void) => ReactNode;
}) {
  return (
    <Group title={title} hint={hint}>
      {items.length === 0 ? (
        <Empty>Niente qui, per ora.</Empty>
      ) : (
        <div className="grid gap-2">
          {items.map((item, index) => {
            const update = (next: T) => onChange(replace(items, index, next));
            return (
              <Row key={index}>
                <Reorder
                  index={index}
                  length={items.length}
                  onMove={(from, to) => onChange(move(items, from, to))}
                />
                <span className="grid min-w-0 flex-1 basis-36 gap-1.5">
                  {renderFields(item, update)}
                </span>
                {renderAside?.(item, update)}
                <button
                  type="button"
                  className={cx(ICON_BTN, "size-6 text-xs hover:border-hot hover:text-hot")}
                  aria-label="Rimuovi"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </Row>
            );
          })}
        </div>
      )}

      <Button size="sm" className="mt-3" onClick={() => onChange([...items, create()])}>
        + {addLabel}
      </Button>
    </Group>
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
