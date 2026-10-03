import { notFound } from "next/navigation";
import { AccountSync } from "@/components/game-account/account-sync";
import { GameMenu } from "@/components/game-menu";
import { GameSwitcher } from "@/components/game-nav";
import { GameSidebar } from "@/components/game-sidebar";
import { auth } from "@/lib/auth";
import { accountCopy } from "@/lib/game-account/server";
import { findGame, gameGroups, isPlayable } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
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
  const entry = findGame(game);
  if (!entry || !isPlayable(game)) notFound();

  const locale = await getLocale();
  const groups = gameGroups(game, locale);

  // Il tuo account di gioco segue chi e' entrato su ogni dispositivo: la copia del
  // database arriva qui, e AccountSync la confronta con quella del browser.
  const session = getGameModule(game)?.accountBuff ? await auth().catch(() => null) : null;
  const userId = session?.user?.id;
  const server = userId ? await accountCopy(userId, game) : null;

  return (
    <>
      {userId ? <AccountSync gameSlug={game} userId={userId} server={server} /> : null}
      <GameSwitcher game={game} />
      {/* sul telefono la barra laterale non c'e': le stesse voci in un pannello */}
      <GameMenu game={game} title={entry.shortName} groups={groups} />

      {/*
        La barra laterale sale da 180 a 210px e il guscio si allarga: dentro
        1200px centrati, su un monitor largo, restavano due fasce vuote ai lati
        e la barra sembrava staccata dal bordo. Lo spazio recuperato va tutto
        al contenuto, che qui sono griglie di card e schede fitte di dati.
      */}
      <div className="mx-auto grid w-full max-w-shell items-start gap-9 px-6 lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)]">
        <aside className="hidden pt-6 lg:sticky lg:top-[110px] lg:block">
          <GameSidebar game={game} groups={groups} />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
