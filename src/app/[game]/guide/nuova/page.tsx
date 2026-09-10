import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideEditor } from "../guide-editor";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, eyebrow, Notice } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { can } from "@/lib/auth/permissions";
import { currentViewer } from "@/lib/community/actions";
import { getGuideStore } from "@/lib/guides/store";

export const metadata: Metadata = {
  title: "Scrivi una guida",
  robots: { index: false, follow: false },
};

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

  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const viewer = await currentViewer();
  const store = await getGuideStore();
  const role = store.volatile ? "EDITOR" : viewer?.role;

  return (
    <main className="pt-6 pb-24">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: "Guide", href: `/${game}/guide` },
          { label: "Nuova" },
        ]}
      />

      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(24px,3.2vw,34px)]")}>Scrivi una guida</h1>
        <p className="mt-2.5 max-w-[64ch] text-sm text-ink-2">
          Nasce come bozza. Quando la ritieni finita la mandi in revisione, e un redattore decide
          se pubblicarla e per quale patch i numeri valgono.
        </p>
      </header>

      {!can(role, "submitGuide") ? (
        <Notice tone="warn">
          <span>
            Per proporre una guida serve il ruolo di collaboratore. Si ottiene partecipando alla
            community: chi risponde in modo utile e pubblica build che il sito riesce a
            riverificare viene promosso da un redattore.
          </span>
        </Notice>
      ) : (
        <GuideEditor game={game} characters={gameModule.characters} />
      )}
    </main>
  );
}
