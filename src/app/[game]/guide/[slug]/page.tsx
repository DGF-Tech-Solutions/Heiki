import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusControls, VerifiedPatchForm } from "./guide-controls";
import { Breadcrumb } from "@/components/breadcrumb";
import { Freshness, formatDate } from "@/components/freshness";
import { headingsOf, Markdown, TableOfContents } from "@/components/markdown";
import { buttonClass, cx, display, eyebrow, Notice, Tag } from "@/components/ui";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { getGuideStore } from "@/lib/guides/store";
import { isStale, STATUS_LABELS } from "@/lib/guides/types";

interface Props {
  params: Promise<{ game: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, slug } = await params;
  const store = await getGuideStore();
  const guide = await store.get(game, slug);

  if (!guide) return { title: "Guida · GachaZone" };

  return {
    title: `${guide.title} · GachaZone`,
    description: guide.excerpt,
    // Una bozza raggiungibile per indirizzo non deve finire negli indici: e'
    // pubblica per errore, non per scelta.
    robots: guide.status === "PUBLISHED" ? undefined : { index: false, follow: false },
  };
}

/**
 * Una guida.
 *
 * La dichiarazione di freschezza sta in cima e non in fondo. E' l'informazione
 * che decide se il resto della pagina vale il tempo di leggerlo, e metterla
 * sotto l'articolo significherebbe darla a chi ha gia' finito.
 */
export default async function GuidePage({ params }: Props) {
  const { game, slug } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const store = await getGuideStore();
  const guide = await store.get(game, slug);
  if (!guide) notFound();

  const viewer = await currentViewer();
  const role = store.volatile ? "EDITOR" : viewer?.role;
  const canReview = can(role, "publishGuide");
  const own = store.volatile || (viewer !== null && viewer.username === guide.author.username);

  // Una guida non pubblicata la vedono solo l'autore e chi la deve revisionare.
  if (guide.status !== "PUBLISHED" && !canReview && !own) notFound();

  const currentPatch = gameModule.dataset.patch;
  const stale = isStale(guide.verifiedPatch, currentPatch);
  const headings = headingsOf(guide.body);

  const character = guide.characterId
    ? gameModule.characters.find((item) => item.id === guide.characterId)
    : undefined;

  return (
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: "Guide", href: `/${game}/guide` },
          { label: guide.title },
        ]}
      />

      {guide.status !== "PUBLISHED" ? (
        <Notice tone="warn" className="mb-5">
          Questa guida è {STATUS_LABELS[guide.status].toLowerCase()}: la vedi perché è tua o perché
          la stai revisionando. Non compare nell&apos;elenco pubblico.
        </Notice>
      ) : null}

      <header className="mb-6 border-b border-rule pb-6" data-accent={guide.author.accent}>
        <p className={eyebrow}>
          {entry.shortName}
          {character ? ` · ${character.name}` : ""}
        </p>

        <h1 className={cx(display, "mt-3 text-[clamp(26px,4vw,40px)]")}>{guide.title}</h1>

        <p className="mt-3 max-w-[70ch] text-base text-ink-2">{guide.excerpt}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-[7px] rounded-full bg-[var(--accent)]" aria-hidden />
            <Link href={`/u/${guide.author.username}`} className="text-ink-2 hover:text-brand">
              {guide.author.displayName}
            </Link>
          </span>
          {guide.publishedAt ? <span>pubblicata il {formatDate(guide.publishedAt)}</span> : null}
          <span>aggiornata il {formatDate(guide.updatedAt)}</span>
          {(own || canReview) && !store.volatile ? (
            <Link
              href={`/${game}/guide/${guide.slug}/modifica`}
              className={cx(buttonClass("ghost", "sm"), "ml-auto")}
            >
              Modifica
            </Link>
          ) : null}
        </div>
      </header>

      <Freshness
        className="mb-8"
        entries={[
          {
            label: "Dati verificati",
            value: guide.verifiedPatch ?? "non dichiarato",
            stale,
          },
          { label: "Dataset in uso", value: `patch ${currentPatch}` },
          { label: "Rilascio dataset", value: formatDate(gameModule.dataset.releasedAt) },
        ]}
      />

      {stale ? (
        <Notice tone="warn" className="mb-8">
          <span>
            {guide.verifiedPatch === null
              ? "Nessuno ha dichiarato in quale patch questi numeri sono stati controllati."
              : `I numeri di questa guida sono stati controllati sulla patch ${guide.verifiedPatch}, il dataset attuale è ${currentPatch}.`}{" "}
            Le indicazioni di metodo restano valide, i valori potrebbero non esserlo più. Il{" "}
            <Link href={`/${game}/strumenti`} className="font-semibold text-brand hover:underline">
              simulatore
            </Link>{" "}
            usa sempre il dataset corrente.
          </span>
        </Notice>
      ) : null}

      <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,200px)]">
        <article className="min-w-0">
          <Markdown source={guide.body} />

          {character ? (
            <p className="mt-9 rounded-card border border-rule bg-paper-2 p-4 text-sm text-ink-2">
              Questa guida è agganciata a{" "}
              <Link
                href={`/${game}/personaggi/${character.id}`}
                className="font-semibold text-brand hover:underline"
              >
                {character.name}
              </Link>
              : lì trovi i numeri calcolati dal motore sul dataset corrente.
            </p>
          ) : null}

          {guide.revisions.length > 0 ? (
            <section className="mt-10 border-t border-rule pt-6">
              <h2 className={cx(display, "mb-3 text-lg")}>Cronologia</h2>
              <ol className="m-0 grid list-none gap-1.5 p-0 text-[13px] text-ink-2">
                {guide.revisions.map((revision) => (
                  <li key={revision.id} className="flex flex-wrap gap-2.5">
                    <span className="font-mono text-[11px] text-ink-3">
                      {formatDate(revision.createdAt)}
                    </span>
                    <span>{revision.editor}</span>
                    {revision.patch ? <Tag>{revision.patch}</Tag> : null}
                    {revision.note ? <span className="text-ink-3">{revision.note}</span> : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </article>

        <aside className="lg:sticky lg:top-[110px]">
          <TableOfContents headings={headings} />

          {own || canReview ? (
            <div className="mt-6 rounded-card border border-dashed border-rule bg-paper-2 p-4">
              <StatusControls
                guideId={guide.id}
                game={game}
                status={guide.status}
                canReview={canReview}
                canSubmit={own}
              />

              {canReview ? (
                <VerifiedPatchForm
                  guideId={guide.id}
                  game={game}
                  slug={guide.slug}
                  currentPatch={currentPatch}
                  verifiedPatch={guide.verifiedPatch}
                />
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
