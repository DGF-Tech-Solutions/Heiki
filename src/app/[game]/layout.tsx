import { notFound } from "next/navigation";
import { GameSwitcher } from "@/components/game-nav";
import { GameSidebar } from "@/components/game-sidebar";
import { findGame, gameGroups, isPlayable } from "@/lib/games/catalog";
import { getLocale } from "@/lib/i18n/server";

/**
 * Guscio di tutte le pagine di un gioco.
 *
 * Selettore del gioco in cima, barra laterale con i gruppi a sinistra,
 * contenuto a destra. Sta nel layout e non nelle pagine perche' e' identico per
 * tutte: se ogni pagina se lo disegnasse da sola, prima o poi una divergerebbe.
 *
 * Se lo slug non e' un gioco conosciuto, o e' conosciuto ma senza modulo, non
 * esiste una pagina da mostrare: meglio un 404 di una schermata a meta'.
 *
 * Le voci della barra arrivano gia' nella lingua di chi legge: le risolve qui
 * il server, come il filtro sulle sezioni che il modulo non sa riempire.
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

  const locale = await getLocale();

  return (
    <>
      <GameSwitcher game={game} />

      {/*
        La barra laterale sale da 180 a 210px e il guscio si allarga: dentro
        1200px centrati, su un monitor largo, restavano due fasce vuote ai lati
        e la barra sembrava staccata dal bordo. Lo spazio recuperato va tutto
        al contenuto, che qui sono griglie di card e schede fitte di dati.
      */}
      <div className="mx-auto grid w-full max-w-shell items-start gap-9 px-6 lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)]">
        <aside className="hidden pt-6 lg:sticky lg:top-[110px] lg:block">
          <GameSidebar game={game} groups={gameGroups(game, locale)} />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
