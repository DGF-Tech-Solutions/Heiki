"use client";

/**
 * Il menu del gioco sul telefono.
 *
 * Sotto i 1024px la barra laterale non c'e' (non ci sta accanto al contenuto), e
 * fino al 03/10 non c'era nient'altro: dal telefono si arrivava a una sezione solo
 * per link. Qui le stesse voci, in un pannello che entra da sinistra.
 *
 * Lo apre il pulsante dell'intestazione con `popovertarget`: lo apre e lo chiude
 * il browser (anche col tasto Esc o toccando fuori). Il pulsante sta
 * nell'intestazione e non qui perche' sotto l'intestazione le pagine hanno gia' le
 * loro barre ferme (schede dell'eroe, calcolatore, Uscite): una striscia in piu'
 * le avrebbe spinte giu' tutte. L'intestazione sta nel layout radice, che non sa
 * in che gioco si e': il pulsante compare solo se nella pagina c'e' questo
 * pannello (`body:has(#menu-sezioni)` in site-header.tsx), quindi l'id si scrive
 * uguale in tutti e due i file.
 *
 * La ricerca sta qui perche' nell'intestazione compare solo da 768px in su.
 */

import type { GameSectionGroup } from "@/lib/games/catalog";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { GameSidebar } from "./game-sidebar";
import { PopoverPanel } from "./popover-panel";
import { cx, display } from "./ui";

const TESTI = testi({
  it: { chiudi: "Chiudi il menu", cerca: "Cerca" },
  en: { chiudi: "Close the menu", cerca: "Search" },
});

export function GameMenu({
  game,
  title,
  groups,
}: {
  game: string;
  title: string;
  groups: readonly GameSectionGroup[];
}) {
  const t = TESTI[useLocale()];

  return (
    <PopoverPanel
      id="menu-sezioni"
      className={cx(
        // il popover del browser sta al centro: qui diventa una colonna alta
        // quanto lo schermo, attaccata a sinistra
        "inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-[min(86vw,340px)] flex-col border-0 border-r-[3px] border-brand bg-paper p-0 text-ink open:flex",
        // entra da sinistra; con «riduci movimento» compare e basta
        "-translate-x-full transition-[translate,display,overlay] transition-discrete duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] open:translate-x-0 starting:open:-translate-x-full motion-reduce:transition-none",
        "backdrop:bg-black/70",
      )}
    >
      <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
        <p className={cx(display, "m-0 min-w-0 flex-1 truncate text-[22px]")}>{title}</p>
        <button
          type="button"
          popoverTarget="menu-sezioni"
          popoverTargetAction="hide"
          aria-label={t.chiudi}
          className="p5-cut grid h-8 w-9 shrink-0 cursor-pointer place-items-center bg-ink text-paper transition-colors hover:bg-brand hover:text-white"
        >
          <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
          </svg>
        </button>
      </div>

      <form action="/cerca" className="border-b border-rule px-4 py-3">
        <input
          name="q"
          type="search"
          placeholder={t.cerca}
          aria-label={t.cerca}
          className="p5-cut h-9 w-full bg-ink px-3.5 text-[14px] font-semibold text-paper placeholder:text-paper/55 focus:bg-white focus:outline-none"
        />
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-8 [scrollbar-width:thin]">
        <GameSidebar game={game} groups={groups} />
      </div>
    </PopoverPanel>
  );
}
