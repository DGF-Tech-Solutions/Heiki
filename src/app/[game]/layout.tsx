import { notFound } from "next/navigation";
import { AccountSync } from "@/components/game-account/account-sync";
import { GameMenu } from "@/components/game-menu";
import { GameSwitcher } from "@/components/game-nav";
import { GameSidebar } from "@/components/game-sidebar";
import { MobileBar } from "@/components/mobile-bar";
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
        {/*
          Ferma sotto l'intestazione (61px) e alta al massimo quanto lo schermo,
          con lo scorrimento suo: prima era ferma a 110px e alta ~900, e su uno
          schermo da 900 le ultime voci non si vedevano mai (10/10).
        */}
        <aside className="hidden pt-6 lg:sticky lg:top-[61px] lg:block lg:max-h-[calc(100dvh-61px)] lg:overflow-x-hidden lg:overflow-y-auto lg:pr-2 lg:pb-6 lg:[scrollbar-color:var(--color-rule)_transparent] lg:[scrollbar-width:thin]">
          <GameSidebar game={game} groups={groups} />
        </aside>

        {/* sul telefono la barra in basso: lo spazio sotto il contenuto e' suo */}
        <div className="min-w-0 max-lg:pb-16">{children}</div>
      </div>
      <MobileBar game={game} hasReleases={Boolean(getGameModule(game)?.releases)} />
    </>
  );
}
