import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { Notice, PageHeader } from "@/components/ui";
import { strategyAttributes } from "@/components/strategies/editor/page-data";
import { StrategyLoginInvite, StrategyNeedsDatabase } from "@/components/strategies/editor/page-notices";
import { StrategyEditor } from "@/components/strategies/editor/strategy-editor";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable } from "@/lib/db";
import { findGame } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { availableModes, strategyKind } from "@/lib/strategies/rules";
import { getStrategy } from "@/lib/strategies/server";
import { strategyTemplate } from "@/lib/strategies/template";
import type { StrategyDraft } from "@/lib/strategies/types";
import { strategyTitle } from "@/lib/strategies/view";

const TESTI = testi({
  it: {
    titolo: "Modifica la strategia",
    discussioni: "Discussioni",
    modifica: "Modifica",
    intro:
      "Cambia la squadra, il set o il testo. Solo la squadra è un consiglio e si pubblica subito; con un testo è una guida e la rivede un moderatore.",
    respinta: "Un moderatore l'ha respinta.",
    motivo: "Il motivo:",
    respintaDopo: "Correggila e mandala di nuovo: torna in revisione.",
    inRevisione: "È in revisione: puoi ancora correggerla prima che un moderatore la legga.",
    pubblicataGuida:
      "È pubblicata. Se modifichi il testo torna in revisione, e un moderatore la rilegge prima di pubblicare le modifiche.",
  },
  en: {
    titolo: "Edit strategy",
    discussioni: "Discussions",
    modifica: "Edit",
    intro:
      "Change the team, the set or the text. The team alone is a suggestion and goes live right away; with some text it's a guide, and a moderator reviews it.",
    respinta: "A moderator rejected it.",
    motivo: "The reason:",
    respintaDopo: "Fix it and send it again: it goes back to review.",
    inRevisione: "It's in review: you can still fix it before a moderator reads it.",
    pubblicataGuida:
      "It's published. If you change the text it goes back to review, and a moderator reads it again before the changes go live.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titolo, robots: { index: false, follow: false } };
}

interface Props {
  params: Promise<{ game: string; postId: string }>;
}

/**
 * Modificare una strategia: lo stesso modulo, partendo da quella salvata. Solo
 * l'autore la trova; per tutti gli altri la pagina non esiste (404 e non «non
 * puoi», come i post nascosti: dire che c'e' e' gia' dire qualcosa). Chi non e'
 * entrato trova l'invito a entrare: potrebbe essere l'autore da un altro
 * dispositivo.
 */
export default async function EditStrategyPage({ params }: Props) {
  const { game, postId } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];

  const entry = findGame(game);
  const gameModule = getGameModule(game);
  if (!entry || !gameModule || availableModes(gameModule).length === 0) notFound();

  const database = await databaseReachable();
  const header = (crumbs: { label: string; href?: string }[]) => (
    <>
      <Breadcrumb
        items={[{ label: entry.shortName, href: `/${game}` }, { label: t.discussioni, href: `/${game}/discussioni` }, ...crumbs]}
      />
      <PageHeader title={t.titolo}>
        <p>{t.intro}</p>
      </PageHeader>
    </>
  );

  if (!database) {
    return (
      <main className="pt-6 pb-24">
        {header([{ label: t.modifica }])}
        <StrategyNeedsDatabase />
      </main>
    );
  }

  const record = await getStrategy(postId);
  if (!record || record.game !== game) notFound();
  const viewer = await currentViewer();
  if (!viewer) {
    return (
      <main className="pt-6 pb-24">
        {header([{ label: t.modifica }])}
        <StrategyLoginInvite />
      </main>
    );
  }
  if (record.authorUsername !== viewer.username) notFound();

  // al modulo va solo la bozza: stato e revisione li dice la pagina
  const initial: StrategyDraft = {
    mode: record.mode,
    target: record.target,
    level: record.level,
    transcendent: record.transcendent,
    team: record.team,
    artifactSet: record.artifactSet,
    title: record.title,
    notes: record.notes,
    phases: record.phases,
  };
  const guide = strategyKind(record) === "guide";

  return (
    <main className="pt-6 pb-24">
      {header([{ label: strategyTitle(gameModule, record, locale), href: `/${game}/post/${postId}` }, { label: t.modifica }])}

      {record.status === "REJECTED" ? (
        <Notice tone="warn" className="mb-6 max-w-[1100px] flex-col gap-1">
          <p className="m-0 font-bold">{t.respinta}</p>
          {record.reviewNote ? (
            <p className="m-0">
              {t.motivo} <q>{record.reviewNote}</q>
            </p>
          ) : null}
          <p className="m-0">{t.respintaDopo}</p>
        </Notice>
      ) : record.status === "IN_REVIEW" ? (
        <Notice className="mb-6 max-w-[1100px]">{t.inRevisione}</Notice>
      ) : guide ? (
        <Notice className="mb-6 max-w-[1100px]">{t.pubblicataGuida}</Notice>
      ) : null}

      <StrategyEditor
        template={strategyTemplate(gameModule, locale)}
        game={game}
        initial={initial}
        postId={postId}
        status={record.status}
        attributes={strategyAttributes(gameModule, locale)}
      />
    </main>
  );
}
