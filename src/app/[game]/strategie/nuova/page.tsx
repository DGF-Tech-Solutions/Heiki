import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageHeader } from "@/components/ui";
import { strategyAttributes } from "@/components/strategies/editor/page-data";
import { StrategyLoginInvite, StrategyNeedsDatabase } from "@/components/strategies/editor/page-notices";
import { StrategyEditor } from "@/components/strategies/editor/strategy-editor";
import { currentViewer } from "@/lib/community/actions";
import { databaseReachable } from "@/lib/db";
import { findGame } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { availableModes, selectionFromParams } from "@/lib/strategies/rules";
import { strategyTemplate } from "@/lib/strategies/template";

const TESTI = testi({
  it: {
    titolo: "Nuova strategia",
    discussioni: "Discussioni",
    intro:
      "Una squadra per un boss, una bestia o una battaglia dell'Endgame. Solo la squadra è un consiglio e si pubblica subito; con un testo diventa una guida e la rivede un moderatore.",
  },
  en: {
    titolo: "New strategy",
    discussioni: "Discussions",
    intro:
      "A team for an Endgame boss, beast or battle. The team alone is a suggestion and goes live right away; with some text it becomes a guide, and a moderator reviews it.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titolo, robots: { index: false, follow: false } };
}

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Scrivere una strategia: il modulo vuoto, con la scelta che porta l'indirizzo
 * (le pagine dell'Endgame ci arrivano con modalita', bersaglio e difficolta'
 * gia' scelti). Il modello del modulo si fa qui, nella lingua della pagina: al
 * browser vanno nomi e indirizzi, non gli indici dell'Endgame.
 */
export default async function NewStrategyPage({ params, searchParams }: Props) {
  const { game } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];

  const entry = findGame(game);
  const gameModule = getGameModule(game);
  if (!entry || !gameModule || availableModes(gameModule).length === 0) notFound();

  // senza database currentViewer() da' l'ospite: qui non basta, la strategia si salva nel database
  const database = await databaseReachable();
  const viewer = database ? await currentViewer() : null;

  return (
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.discussioni, href: `/${game}/discussioni` },
          { label: t.titolo },
        ]}
      />

      <PageHeader title={t.titolo}>
        <p>{t.intro}</p>
      </PageHeader>

      {!database ? (
        <StrategyNeedsDatabase />
      ) : !viewer ? (
        <StrategyLoginInvite />
      ) : (
        <StrategyEditor
          template={strategyTemplate(gameModule, locale)}
          game={game}
          selection={selectionFromParams(await searchParams)}
          attributes={strategyAttributes(gameModule, locale)}
        />
      )}
    </main>
  );
}
