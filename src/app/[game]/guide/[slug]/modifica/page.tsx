import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideEditor } from "../../guide-editor";
import { Breadcrumb } from "@/components/breadcrumb";
import { Notice, PageHeader } from "@/components/ui";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { getGuideStore } from "@/lib/guides/store";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Modifica guida",
    guide: "Guide",
    modifica: "Modifica",
    intro:
      "La versione precedente resta in cronologia. Se cambi i numeri, aggiorna anche la patch di verifica: altrimenti la guida continua a dichiarare un controllo che non c'è più.",
    soloTue: "Puoi modificare solo le guide che hai scritto.",
  },
  en: {
    titoloPagina: "Edit guide",
    guide: "Guides",
    modifica: "Edit",
    intro:
      "The previous version stays in the history. If you change the numbers, update the verification patch too: otherwise the guide keeps declaring a check that no longer holds.",
    soloTue: "You can only edit guides you wrote.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

interface Props {
  params: Promise<{ game: string; slug: string }>;
}

/**
 * Modifica di una guida esistente.
 *
 * Il controllo dei permessi c'e' anche qui, non solo nell'azione: mostrare il
 * modulo a chi non puo' salvare gli farebbe scrivere per niente.
 */
export default async function EditGuidePage({ params }: Props) {
  const { game, slug } = await params;
  const t = TESTI[await getLocale()];

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

  return (
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.guide, href: `/${game}/guide` },
          { label: guide.title, href: `/${game}/guide/${guide.slug}` },
          { label: t.modifica },
        ]}
      />

      <PageHeader title={t.modifica}>
        <p>{t.intro}</p>
      </PageHeader>

      {!own && !canReview ? (
        <Notice tone="warn">{t.soloTue}</Notice>
      ) : (
        <GuideEditor
          game={game}
          characters={gameModule.characters}
          existing={{
            id: guide.id,
            slug: guide.slug,
            title: guide.title,
            body: guide.body,
            characterId: guide.characterId,
          }}
        />
      )}
    </main>
  );
}
