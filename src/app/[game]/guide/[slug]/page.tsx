import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusControls, VerifiedPatchForm } from "./guide-controls";
import { Breadcrumb } from "@/components/breadcrumb";
import { Freshness, formatDate } from "@/components/freshness";
import { headingsOf, Markdown, TableOfContents } from "@/components/markdown";
import { buttonClass, cx, display, Notice, Tag } from "@/components/ui";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { getGuideStore } from "@/lib/guides/store";
import { isStale, statusLabel } from "@/lib/guides/types";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    guidaTitolo: "Guida",
    guide: "Guide",
    nonPubblicata: (stato: string) =>
      `Questa guida è ${stato}: la vedi perché è tua o perché la stai revisionando. Non compare nell'elenco pubblico.`,
    pubblicataIl: (data: string) => `pubblicata il ${data}`,
    aggiornataIl: (data: string) => `aggiornata il ${data}`,
    modifica: "Modifica",
    datiVerificati: "Dati verificati",
    nonDichiarato: "non dichiarato",
    datasetInUso: "Dataset in uso",
    rilascioDataset: "Rilascio dataset",
    nessunaPatch: "Nessuno ha dichiarato in quale patch questi numeri sono stati controllati.",
    patchVecchia: (verificata: string, corrente: string) =>
      `I numeri di questa guida sono stati controllati sulla patch ${verificata}, il dataset attuale è ${corrente}.`,
    metodoValido: "Le indicazioni di metodo restano valide, i valori potrebbero non esserlo più.",
    cronologia: "Cronologia",
  },
  en: {
    guidaTitolo: "Guide",
    guide: "Guides",
    nonPubblicata: (stato: string) =>
      `Status of this guide: ${stato}. You can see it because it's yours or because you're reviewing it. It doesn't appear in the public list.`,
    pubblicataIl: (data: string) => `published ${data}`,
    aggiornataIl: (data: string) => `updated ${data}`,
    modifica: "Edit",
    datiVerificati: "Verified data",
    nonDichiarato: "not declared",
    datasetInUso: "Dataset in use",
    rilascioDataset: "Dataset release",
    nessunaPatch: "Nobody has declared which patch these numbers were checked on.",
    patchVecchia: (verificata: string, corrente: string) =>
      `The numbers in this guide were checked on patch ${verificata}; the current dataset is ${corrente}.`,
    metodoValido: "The method advice still holds, but the values may not.",
    cronologia: "History",
  },
});

interface Props {
  params: Promise<{ game: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, slug } = await params;
  const store = await getGuideStore();
  const guide = await store.get(game, slug);

  if (!guide) return { title: TESTI[await getLocale()].guidaTitolo };

  return {
    title: `${guide.title}`,
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
  const locale = await getLocale();
  const t = TESTI[locale];

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

  return (
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.guide, href: `/${game}/guide` },
          { label: guide.title },
        ]}
      />

      {guide.status !== "PUBLISHED" ? (
        <Notice tone="warn" className="mb-5">
          {t.nonPubblicata(statusLabel(guide.status, locale).toLowerCase())}
        </Notice>
      ) : null}

      {/*
        Il titolo senza l'etichetta del gioco sopra (le briciole dicono gia' dove
        sei, 10/10), col filo rosso di PageHeader; l'estratto e chi l'ha scritta
        sotto, perche' una guida si legge dall'alto in basso come un articolo.
      */}
      <header className="mb-6 border-b-2 border-brand pb-5" data-accent={guide.author.accent}>
        <h1 className={cx(display, "text-[clamp(30px,4.4vw,50px)]")}>{guide.title}</h1>

        <p className="mt-3 max-w-[48ch] text-base text-ink-2">{guide.excerpt}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-[7px] bg-[var(--accent)] [clip-path:polygon(2px_0,100%_0,calc(100%-2px)_100%,0_100%)]" aria-hidden />
            <Link href={`/u/${guide.author.username}`} className="text-ink-2 hover:text-brand-deep">
              {guide.author.displayName}
            </Link>
          </span>
          {guide.publishedAt ? (
            <span>{t.pubblicataIl(formatDate(guide.publishedAt, locale))}</span>
          ) : null}
          <span>{t.aggiornataIl(formatDate(guide.updatedAt, locale))}</span>
          {(own || canReview) && !store.volatile ? (
            <Link
              href={`/${game}/guide/${guide.slug}/modifica`}
              className={cx(buttonClass("ghost", "sm"), "ml-auto")}
            >
              {t.modifica}
            </Link>
          ) : null}
        </div>
      </header>

      <Freshness
        className="mb-8"
        entries={[
          {
            label: t.datiVerificati,
            value: guide.verifiedPatch ?? t.nonDichiarato,
            stale,
          },
          { label: t.datasetInUso, value: `patch ${currentPatch}` },
          { label: t.rilascioDataset, value: formatDate(gameModule.dataset.releasedAt, locale) },
        ]}
      />

      {stale ? (
        <Notice tone="warn" className="mb-8">
          <span>
            {guide.verifiedPatch === null
              ? t.nessunaPatch
              : t.patchVecchia(guide.verifiedPatch, currentPatch)}{" "}
            {t.metodoValido}
          </span>
        </Notice>
      ) : null}

      <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,200px)]">
        <article className="min-w-0">
          <Markdown source={guide.body} />

          {guide.revisions.length > 0 ? (
            <section className="mt-10 border-t border-rule pt-6">
              <h2 className={cx(display, "mb-3 text-lg")}>{t.cronologia}</h2>
              <ol className="m-0 grid list-none gap-1.5 p-0 text-[13px] text-ink-2">
                {guide.revisions.map((revision) => (
                  <li key={revision.id} className="flex flex-wrap gap-2.5">
                    <span className="font-mono text-[11px] text-ink-3">
                      {formatDate(revision.createdAt, locale)}
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
          <TableOfContents headings={headings} locale={locale} />

          {own || canReview ? (
            <div className="p5-corner mt-6 border border-rule bg-paper-2 p-4">
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
