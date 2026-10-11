import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideEditor } from "../guide-editor";
import { Breadcrumb } from "@/components/breadcrumb";
import { Notice, PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { getGuideStore, isGuideDemo } from "@/lib/guides/store";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    scriviGuida: "Scrivi una guida",
    guide: "Guide",
    nuova: "Nuova",
    intro:
      "Nasce come bozza. Quando la ritieni finita la mandi in revisione, e un redattore decide se pubblicarla e per quale patch i numeri valgono.",
    serveRuolo:
      "Per proporre una guida serve il ruolo di collaboratore. Si ottiene partecipando alla community: chi risponde in modo utile e pubblica build che il sito riesce a riverificare viene promosso da un redattore.",
  },
  en: {
    scriviGuida: "Write a guide",
    guide: "Guides",
    nuova: "New",
    intro:
      "It starts as a draft. When you think it's finished you send it to review, and an editor decides whether to publish it and which patch the numbers hold for.",
    serveRuolo:
      "Proposing a guide requires the contributor role. You earn it by taking part in the community: people who give useful answers and post builds the site can re-verify get promoted by an editor.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.scriviGuida,
    robots: { index: false, follow: false },
  };
}

interface Props {
  params: Promise<{ game: string }>;
}

/**
 * Pagina di scrittura.
 *
 * Chi non ha il ruolo non trova un modulo disabilitato ma una spiegazione di
 * come si ottiene: un campo grigio non dice a nessuno cosa fare.
 */
export default async function NewGuidePage({ params }: Props) {
  const { game } = await params;
  const t = TESTI[await getLocale()];

  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const viewer = await currentViewer();
  const store = await getGuideStore();
  // redattore solo nella modalita' dimostrativa vera, non a database fermo
  const role = isGuideDemo(store) ? "EDITOR" : viewer?.role;

  return (
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.guide, href: `/${game}/guide` },
          { label: t.nuova },
        ]}
      />

      <PageHeader title={t.scriviGuida}>
        <p>{t.intro}</p>
      </PageHeader>

      {!can(role, "submitGuide") ? (
        <Notice tone="warn">
          <span>{t.serveRuolo}</span>
        </Notice>
      ) : (
        <GuideEditor game={game} characters={gameModule.characters} />
      )}
    </main>
  );
}
