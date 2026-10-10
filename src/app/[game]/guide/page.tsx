import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { buttonClass, cx, display, Empty, Notice, PageHeader, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { getGuideStore } from "@/lib/guides/store";
import { isStale, statusLabel } from "@/lib/guides/types";
import { formatDate } from "@/components/freshness";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Elenco delle guide di un gioco.
 *
 * Ogni riga dichiara la patch in cui e' stata verificata, e quelle scadute lo
 * dicono in elenco - non solo aprendole. E' l'informazione che serve prima di
 * decidere se leggere: scoprirlo in fondo alla pagina significa aver perso
 * cinque minuti su numeri vecchi.
 *
 * Le bozze e le guide in revisione compaiono solo a chi le puo' toccare, e
 * marcate: un elenco che mescola contenuto pubblicato e lavori in corso non e'
 * un indice, e' un cassetto.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Guide di ${gioco}`,
    descrizione: (gioco: string) =>
      `Guide e rotazioni per ${gioco}, con la patch in cui i numeri sono stati verificati.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    guide: "Guide",
    intro: (patch: string) =>
      `Ogni guida dice in quale patch è stata controllata. Quando il dataset supera quella patch, la guida si segna da sola come da rivedere: patch corrente ${patch}.`,
    scrivi: "Scrivi una guida",
    demo: "Modalità dimostrativa: queste guide vivono in memoria e si azzerano al riavvio del server.",
    nessunaGuida: (gioco: string) =>
      `Nessuna guida pubblicata per ${gioco}. È la sezione più lenta da riempire e la più difficile da falsificare: una guida sbagliata si vede subito.`,
    patchNonDichiarata: "patch non dichiarata",
    verificataSu: (patch: string) => `verificata su ${patch}`,
    daRivedere: "da rivedere",
    di: "di",
    nonPubblicate: "Non pubblicate",
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} guides`,
    descrizione: (gioco: string) =>
      `Guides and rotations for ${gioco}, with the patch the numbers were verified on.`,
    gioco: "Game",
    questoGioco: "this game",
    guide: "Guides",
    intro: (patch: string) =>
      `Every guide states which patch it was checked on. When the dataset moves past that patch, the guide flags itself for review: current patch ${patch}.`,
    scrivi: "Write a guide",
    demo: "Demo mode: these guides live in memory and reset when the server restarts.",
    nessunaGuida: (gioco: string) =>
      `No published guides for ${gioco} yet. It's the slowest section to fill and the hardest to fake: a wrong guide shows right away.`,
    patchNonDichiarata: "patch not declared",
    verificataSu: (patch: string) => `verified on ${patch}`,
    daRivedere: "needs review",
    di: "by",
    nonPubblicate: "Unpublished",
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? t.gioco),
    description: t.descrizione(entry?.name ?? t.questoGioco),
  };
}

export default async function GuidesPage({ params }: Props) {
  const { game } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];

  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const currentPatch = gameModule.dataset.patch;

  const viewer = await currentViewer();
  const store = await getGuideStore();

  // Senza database si vede tutto il percorso: scrivere, mandare in revisione,
  // pubblicare. Mostrare solo l'elenco vorrebbe dire far valutare la sezione
  // dalla sua parte meno interessante.
  const role = store.volatile ? "EDITOR" : viewer?.role;
  const canWrite = can(role, "submitGuide");
  const canReview = can(role, "publishGuide");

  const all = await store.list(game, { includeUnpublished: canReview });

  const published = all.filter((guide) => guide.status === "PUBLISHED");
  const inProgress = all.filter((guide) => guide.status !== "PUBLISHED");

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.guide }]} />

      {/* la testata di tutte le pagine (10/10); il comando per scrivere sotto, a destra */}
      <PageHeader title={t.guide}>
        <p>{t.intro(currentPatch)}</p>
      </PageHeader>

      {canWrite ? (
        <div className="mb-5 flex justify-end">
          <Link href={`/${game}/guide/nuova`} className={buttonClass("primary")}>
            {t.scrivi}
          </Link>
        </div>
      ) : null}

      {store.volatile ? (
        <Notice tone="warn" className="mb-6">
          {t.demo}
        </Notice>
      ) : null}

      {published.length === 0 ? (
        <Empty>{t.nessunaGuida(entry.shortName)}</Empty>
      ) : (
        <ul className="m-0 grid list-none gap-3.5 p-0">
          {published.map((guide) => {
            const stale = isStale(guide.verifiedPatch, currentPatch);
            return (
              <li
                key={guide.id}
                className="p5-corner border border-rule bg-paper-2 p-4 transition-colors hover:border-ink-3 sm:p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2.5">
                  {guide.verifiedPatch === null ? (
                    <Tag>{t.patchNonDichiarata}</Tag>
                  ) : (
                    <Tag tone={stale ? "neutral" : "brand"}>
                      {stale ? t.verificataSu(guide.verifiedPatch) : `patch ${currentPatch}`}
                    </Tag>
                  )}
                  {stale ? (
                    <span className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-hot">
                      {t.daRivedere}
                    </span>
                  ) : null}
                  <span className="ml-auto font-mono text-[11px] text-ink-3">
                    {guide.publishedAt ? formatDate(guide.publishedAt, locale) : "—"}
                  </span>
                </div>

                <h2
                  className={cx(display, "mb-1.5 text-[clamp(19px,2.2vw,24px)] leading-[1.1]")}
                  data-accent={guide.author.accent}
                >
                  <Link href={`/${game}/guide/${guide.slug}`} className="hover:text-brand-deep">
                    {guide.title}
                  </Link>
                </h2>

                <p className="m-0 text-sm leading-relaxed text-ink-2">{guide.excerpt}</p>

                <p className="m-0 mt-2.5 text-xs text-ink-3">
                  {t.di}{" "}
                  <Link href={`/u/${guide.author.username}`} className="text-ink-2 hover:text-brand-deep">
                    {guide.author.displayName}
                  </Link>
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {canReview && inProgress.length > 0 ? (
        <section className="mt-10">
          <h2 className={cx(display, "mb-3 text-lg")}>{t.nonPubblicate}</h2>
          <ul className="m-0 grid list-none gap-2 p-0">
            {inProgress.map((guide) => (
              <li
                key={guide.id}
                className="flex flex-wrap items-center gap-3 border border-rule-2 bg-paper-2 px-4 py-3 text-sm"
              >
                <Tag>{statusLabel(guide.status, locale)}</Tag>
                <Link
                  href={`/${game}/guide/${guide.slug}`}
                  className="font-medium hover:text-brand-deep"
                >
                  {guide.title}
                </Link>
                <span className="ml-auto font-mono text-[11px] text-ink-3">
                  {guide.author.username}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
