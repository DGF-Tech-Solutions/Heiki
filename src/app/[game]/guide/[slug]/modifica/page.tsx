import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideEditor } from "../../guide-editor";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, eyebrow, Notice } from "@/components/ui";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { getGuideStore } from "@/lib/guides/store";

export const metadata: Metadata = {
  title: "Modifica guida",
  robots: { index: false, follow: false },
};

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
          { label: "Guide", href: `/${game}/guide` },
          { label: guide.title, href: `/${game}/guide/${guide.slug}` },
          { label: "Modifica" },
        ]}
      />

      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(24px,3.2vw,34px)]")}>Modifica</h1>
        <p className="mt-2.5 max-w-[64ch] text-sm text-ink-2">
          La versione precedente resta in cronologia. Se cambi i numeri, aggiorna anche la patch di
          verifica: altrimenti la guida continua a dichiarare un controllo che non c&apos;è più.
        </p>
      </header>

      {!own && !canReview ? (
        <Notice tone="warn">Puoi modificare solo le guide che hai scritto.</Notice>
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
