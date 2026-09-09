/**
 * La schermata del profilo, come presentazione pura.
 *
 * Non sa da dove arrivano i dati: la pagina pubblica glieli passa dal database,
 * l'editor glieli passa dal proprio stato React a ogni battuta di tasto. Un solo
 * componente per entrambi, cosi' l'anteprima dal vivo non e' una
 * approssimazione di com'e' fatta la pagina vera: e' la pagina vera.
 */

import { ROLE_LABELS, type Role } from "@/lib/auth/permissions";
import { levelProgress } from "@/lib/profile/level";
import {
  BADGE_SHOWCASE_LIMIT,
  DEFAULT_CUSTOMIZATION,
  type ProfileCustomization,
} from "@/lib/profile/customization";

export type BadgeTrust = "VERIFIED" | "IMPORTED" | "DECLARED";

export interface ProfileBadge {
  id: string;
  name: string;
  description?: string | null;
  trust: BadgeTrust;
  icon?: string | null;
  /** false = posseduto ma non esposto in vetrina */
  shown?: boolean;
}

export interface ProfileGameAccount {
  id: string;
  game: string;
  uid: string;
  nickname?: string | null;
  trust: BadgeTrust;
  shown?: boolean;
}

export interface ProfileBuild {
  id: string;
  name: string;
  game: string;
  character: string;
  median: number;
  patch: string;
  isPublic?: boolean;
}

export interface ProfileViewData {
  username: string;
  displayName: string;
  role: Role;
  bio?: string | null;
  country?: string | null;
  xp: number;
  favorites: readonly string[];
  badges: readonly ProfileBadge[];
  gameAccounts: readonly ProfileGameAccount[];
  builds: readonly ProfileBuild[];
  customization?: ProfileCustomization;
}

const TRUST_LABEL: Readonly<Record<BadgeTrust, string>> = {
  VERIFIED: "verificato",
  IMPORTED: "importato",
  DECLARED: "dichiarato",
};

export function ProfileView({ data }: { data: ProfileViewData }) {
  const custom = data.customization ?? DEFAULT_CUSTOMIZATION;
  const progress = levelProgress(data.xp);

  const shownBadges = data.badges.filter((b) => b.shown !== false).slice(0, BADGE_SHOWCASE_LIMIT);
  const shownAccounts = data.gameAccounts.filter((a) => a.shown !== false);
  const publicBuilds = data.builds.filter((b) => b.isPublic !== false);
  const verified = shownBadges.filter((b) => b.trust === "VERIFIED").length;

  return (
    <div
      className="profile-canvas"
      data-accent={custom.accent}
      data-frame={custom.frame}
      data-background={custom.background}
      data-layout={custom.layout}
    >
      <header className="profile__head">
        <div className="avatar" aria-hidden>
          {(data.displayName || data.username || "?").slice(0, 1).toUpperCase()}
        </div>

        <div>
          <h1 className="profile__name">{data.displayName || data.username}</h1>
          <p className="profile__handle" style={{ margin: "6px 0 0" }}>
            @{data.username}
            <span className="tag" style={{ marginLeft: 10 }}>
              {ROLE_LABELS[data.role]}
            </span>
            {data.country ? (
              <span style={{ marginLeft: 10, color: "var(--faint)" }}>{data.country}</span>
            ) : null}
          </p>
        </div>

        <div className="level">
          <span className="eyebrow">Livello {progress.level}</span>
          <span className="level__bar">
            <span className="level__fill" style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
          </span>
          <span className="mono" style={{ fontSize: 11, color: "var(--faint)" }}>
            {progress.maxed
              ? "livello massimo"
              : `${data.xp.toLocaleString("it-IT")} XP · ${progress.needed - progress.current} al prossimo`}
          </span>
        </div>
      </header>

      {data.bio ? (
        <p className="lede" style={{ marginTop: 26, maxWidth: "62ch", whiteSpace: "pre-line" }}>
          {data.bio}
        </p>
      ) : null}

      <dl className="readout" style={{ borderTop: "none", marginTop: 26, paddingTop: 0 }}>
        <div>
          <dt>Badge verificati</dt>
          <dd>{verified}</dd>
        </div>
        <div>
          <dt>Build pubbliche</dt>
          <dd>{publicBuilds.length}</dd>
        </div>
        <div>
          <dt>Profili collegati</dt>
          <dd>{shownAccounts.length}</dd>
        </div>
        <div>
          <dt>Esperienza</dt>
          <dd>{data.xp.toLocaleString("it-IT")}</dd>
        </div>
      </dl>

      {data.favorites.length > 0 ? (
        <section className="section">
          <div className="section__head">
            <h2 className="section__title">Preferiti</h2>
          </div>
          <ul className="badges">
            {data.favorites.map((name) => (
              <li key={name} className="badge">
                <span className="badge__mark" aria-hidden>
                  ♥
                </span>
                <span className="badge__name">{name}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Badge</h2>
          <span className="eyebrow">
            {verified} verificati su {shownBadges.length}
          </span>
        </div>

        {shownBadges.length === 0 ? (
          <p className="empty">
            Nessun badge in vetrina. Collega un profilo di gioco per sbloccare quelli verificati.
          </p>
        ) : (
          <ul className="badges">
            {shownBadges.map((badge) => (
              <li
                key={badge.id}
                className={`badge ${badge.trust === "VERIFIED" ? "badge--verified" : "badge--declared"}`}
                title={badge.description ?? undefined}
              >
                <span className="badge__mark" aria-hidden>
                  {badge.icon ?? (badge.trust === "VERIFIED" ? "✦" : "◇")}
                </span>
                <span>
                  <span className="badge__name">{badge.name}</span>
                  <br />
                  <span className="badge__trust">{TRUST_LABEL[badge.trust]}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Profili di gioco</h2>
          <span className="eyebrow">solo UID pubblici</span>
        </div>

        {shownAccounts.length === 0 ? (
          <p className="empty">Nessun profilo collegato.</p>
        ) : (
          <ul className="rows">
            {shownAccounts.map((account) => (
              <li key={account.id} className="row">
                <span className="row__main">
                  <strong>{account.game}</strong>
                  {account.nickname ? (
                    <span style={{ color: "var(--mute)" }}> · {account.nickname}</span>
                  ) : null}
                </span>
                <span className="mono" style={{ fontSize: 12, color: "var(--faint)" }}>
                  UID {account.uid}
                </span>
                <span className={account.trust === "VERIFIED" ? "tag tag--gold" : "tag"}>
                  {TRUST_LABEL[account.trust]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Build pubbliche</h2>
          <span className="eyebrow">{publicBuilds.length} condivise</span>
        </div>

        {publicBuilds.length === 0 ? (
          <p className="empty">Nessuna build pubblica.</p>
        ) : (
          <div className="build-grid">
            {publicBuilds.map((build) => (
              <article key={build.id} className="card">
                <div className="card__head">
                  <h3 className="card__title" style={{ fontSize: 16 }}>
                    {build.name}
                  </h3>
                  <span className="tag">{build.patch}</span>
                </div>
                <p className="mono" style={{ fontSize: 12, color: "var(--faint)", margin: "8px 0 0" }}>
                  {build.game} · {build.character}
                </p>
                <dl className="readout" style={{ gridTemplateColumns: "1fr" }}>
                  <div>
                    <dt>Danno mediano</dt>
                    <dd>{Math.round(build.median).toLocaleString("it-IT")}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
