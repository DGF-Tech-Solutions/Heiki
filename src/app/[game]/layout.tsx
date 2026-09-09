import { notFound } from "next/navigation";
import { findGame, isPlayable } from "@/lib/games/catalog";

/**
 * Ogni pagina dentro un gioco passa da qui: se lo slug non e' un gioco
 * conosciuto, o e' conosciuto ma senza modulo, non esiste una pagina da
 * mostrare. Meglio un 404 di una schermata a meta'.
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

  return <>{children}</>;
}
