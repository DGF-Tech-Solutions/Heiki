import { notFound } from "next/navigation";
import { GameSwitcher } from "@/components/game-nav";
import { GameSidebar } from "@/components/game-sidebar";
import { findGame, isPlayable } from "@/lib/games/catalog";

/**
 * Guscio di tutte le pagine di un gioco.
 *
 * Selettore del gioco in cima, barra laterale con i gruppi a sinistra,
 * contenuto a destra. Sta nel layout e non nelle pagine perche' e' identico per
 * tutte: se ogni pagina se lo disegnasse da sola, prima o poi una divergerebbe.
 *
 * Se lo slug non e' un gioco conosciuto, o e' conosciuto ma senza modulo, non
 * esiste una pagina da mostrare: meglio un 404 di una schermata a meta'.
 */
export default async function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  if (!findGame(game) || !isPlayable(game)) notFound();

  return (
    <>
      <GameSwitcher game={game} />

      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-8 px-6 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
        <aside className="hidden pt-6 lg:sticky lg:top-[110px] lg:block">
          <GameSidebar game={game} />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
