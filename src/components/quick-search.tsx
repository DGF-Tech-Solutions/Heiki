"use client";

/**
 * La ricerca rapida: un pannello che si apre dall'intestazione (o coi tasti «/»
 * e Ctrl+K) e trova mentre si scrive eroi, pagine, boss, bestie e artefatti del
 * gioco in cui si e'. Richiesta del 10/10 («migliora la navigabilita'»): prima la
 * ricerca in alto mandava un modulo a /cerca, che cercava solo eroi e post e solo
 * dopo l'invio, e sul telefono stava dentro il menu.
 *
 *   - l'indice arriva una volta (/api/cerca-rapida) alla prima apertura, poi si
 *     filtra nel browser (quick-search.ts)
 *   - frecce su e giu', Invio apre, Esc chiude (il <dialog> del browser tiene il
 *     fuoco dentro e lo restituisce alla chiusura)
 *   - a campo vuoto, gli ultimi eroi aperti (`rememberHero`, dalla scheda)
 *   - in fondo, «cerca anche nelle discussioni» porta alla ricerca di sempre
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconCard, IconPage, IconSearch, IconSword } from "@/components/icons";
import { OPEN_SEARCH_EVENT } from "@/components/mobile-bar";
import { cx, eyebrow, MoreArrow } from "@/components/ui";
import { heroCardSrc } from "@/lib/games/heroes";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { quickSearch, type QuickIndex, type QuickResult } from "@/lib/quick-search";

const TESTI = testi({
  it: {
    apri: "Cerca",
    segnaposto: "Eroi, boss, artefatti, pagine…",
    etichetta: "Cerca nel gioco",
    eroi: "Eroi",
    pagine: "Pagine",
    altro: "Endgame e artefatti",
    recenti: "Aperti di recente",
    nessuno: "Niente con queste parole.",
    caricamento: "Carico l'indice…",
    discussioni: (q: string) => `Cerca «${q}» anche nelle discussioni`,
    tipo: { boss: "Scontro finale", bestia: "Bestia demoniaca", set: "Set artefatto", carta: "Carta artefatto", pagina: "Pagina", eroe: "Eroe" },
    scorciatoia: "Premi / per aprirla da qualunque pagina",
  },
  en: {
    apri: "Search",
    segnaposto: "Heroes, bosses, artifacts, pages…",
    etichetta: "Search the game",
    eroi: "Heroes",
    pagine: "Pages",
    altro: "Endgame and artifacts",
    recenti: "Recently opened",
    nessuno: "Nothing matches these words.",
    caricamento: "Loading the index…",
    discussioni: (q: string) => `Search “${q}” in the discussions too`,
    tipo: { boss: "Death Match", bestia: "Demonic Beast", set: "Artifact Set", carta: "Artifact Card", pagina: "Page", eroe: "Hero" },
    scorciatoia: "Press / to open it from any page",
  },
});

const cache = new Map<string, Promise<QuickIndex>>();
function loadIndex(game: string): Promise<QuickIndex> {
  let promise = cache.get(game);
  if (!promise) {
    promise = fetch(`/api/cerca-rapida?gioco=${encodeURIComponent(game)}`).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<QuickIndex>;
    });
    promise.catch(() => cache.delete(game));
    cache.set(game, promise);
  }
  return promise;
}

const recentKey = (game: string) => `heiki:${game}:recenti`;

/** La scheda di un eroe lo segna fra i recenti (hero-arrow-keys.tsx lo chiama). */
export function rememberHero(game: string, heroId: string): void {
  try {
    const key = recentKey(game);
    const list = (JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[]).filter(
      (id): id is string => typeof id === "string" && id !== heroId,
    );
    window.localStorage.setItem(key, JSON.stringify([heroId, ...list].slice(0, 8)));
  } catch {
    // senza localStorage niente recenti: la ricerca funziona lo stesso
  }
}

function readRecent(game: string): string[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(recentKey(game)) ?? "[]") as unknown[];
    return list.filter((id): id is string => typeof id === "string").slice(0, 6);
  } catch {
    return [];
  }
}

export function QuickSearch({ games }: { games: readonly string[] }) {
  const t = TESTI[useLocale()];
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<QuickIndex | null>(null);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  // il gioco dell'indirizzo; fuori da un gioco, il primo che ha dati
  const first = pathname.split("/")[1] ?? "";
  const game = games.includes(first) ? first : games[0];

  const open = useCallback(() => {
    if (!game || !dialog.current) return;
    setRecent(readRecent(game));
    setActive(0);
    if (!dialog.current.open) dialog.current.showModal();
    input.current?.select();
    loadIndex(game).then(setIndex, () => setIndex(null));
  }, [game]);

  // «/» e Ctrl+K da qualunque pagina, se non si sta scrivendo altrove
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable=true]");
      if ((event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey)) {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    // la barra in basso del telefono (mobile-bar.tsx) la apre con un evento
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, open);
    };
  }, [open]);

  // cambiando pagina il pannello si chiude
  useEffect(() => {
    if (dialog.current?.open) dialog.current.close();
  }, [pathname]);

  const results = useMemo(() => (index ? quickSearch(index, query, locale) : null), [index, query, locale]);
  const recentResults: QuickResult[] = useMemo(() => {
    if (!index || query.trim()) return [];
    const byId = new Map(index.heroes.map((h) => [h[0], h]));
    return recent.flatMap((id) => {
      const h = byId.get(id);
      return h ? [{ kind: "eroe" as const, id, title: locale === "it" ? h[1] : h[3], subtitle: locale === "it" ? h[2] : h[4], path: `/eroi/${id}` }] : [];
    });
  }, [index, query, recent, locale]);

  const sections: { title: string; list: QuickResult[] }[] = query.trim()
    ? [
        { title: t.eroi, list: results?.heroes ?? [] },
        { title: t.pagine, list: results?.pages ?? [] },
        { title: t.altro, list: results?.items ?? [] },
      ].filter((s) => s.list.length > 0)
    : [
        { title: t.recenti, list: recentResults },
        {
          title: t.pagine,
          list: (index?.pages ?? []).slice(0, 6).map(([it, en, path]) => ({ kind: "pagina" as const, id: path, title: locale === "it" ? it : en, subtitle: "", path })),
        },
      ].filter((s) => s.list.length > 0);
  const flat = sections.flatMap((s) => s.list);
  const go = (result: QuickResult | undefined) => {
    if (!result || !game) return;
    dialog.current?.close();
    router.push(`/${game}${result.path}`);
  };

  if (!game) return null;
  let position = -1;

  return (
    <>
      {/* sul computer sembra un campo; sul telefono e' l'icona */}
      <button
        type="button"
        onClick={open}
        aria-label={t.etichetta}
        aria-keyshortcuts="/ Control+K"
        title={t.scorciatoia}
        className="p5-cut ml-auto flex h-8 shrink-0 cursor-pointer items-center gap-2 bg-ink px-3 text-[13px] font-semibold text-paper/70 hover:bg-white hover:text-paper md:w-56 max-md:w-9 max-md:justify-center max-md:px-0"
      >
        <IconSearch size={16} className="shrink-0 text-paper" />
        <span className="hidden flex-1 text-left md:inline">{t.apri}</span>
        <kbd className="hidden border border-paper/30 px-1.5 font-mono text-[11px] text-paper/70 md:inline">/</kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label={t.etichetta}
        onClick={(event) => {
          // il clic sul fondo (fuori dal riquadro) chiude
          if (event.target === dialog.current) dialog.current?.close();
        }}
        className="quick-search m-0 mx-auto mt-[8vh] w-[min(640px,calc(100vw-24px))] max-w-none overflow-hidden border border-rule bg-paper-2 p-0 text-ink backdrop:bg-black/70"
      >
        <div className="flex items-center gap-3 border-b-2 border-brand px-4">
          <IconSearch size={20} className="shrink-0 text-ink-3" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((n) => Math.min(flat.length - 1, n + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((n) => Math.max(0, n - 1));
              } else if (event.key === "Enter") {
                event.preventDefault();
                go(flat[active]);
              }
            }}
            placeholder={t.segnaposto}
            aria-label={t.etichetta}
            aria-controls="ricerca-rapida-risultati"
            aria-activedescendant={flat[active] ? `rr-${active}` : undefined}
            // niente cornice del fuoco: nel pannello il campo e' l'unico, e la linea
            // rossa sotto lo dice gia'
            className="h-14 min-w-0 flex-1 border-0 bg-transparent text-[17px] text-ink placeholder:text-ink-3 focus:outline-none focus-visible:shadow-none focus-visible:outline-none"
          />
          <kbd className="hidden border border-rule px-1.5 font-mono text-[11px] text-ink-3 sm:inline">Esc</kbd>
        </div>

        <div id="ricerca-rapida-risultati" role="listbox" className="max-h-[min(60vh,520px)] overflow-y-auto p-2">
          {!index ? <p className="m-0 px-3 py-4 text-sm text-ink-3">{t.caricamento}</p> : null}
          {index && query.trim() && flat.length === 0 ? <p className="m-0 px-3 py-4 text-sm text-ink-3">{t.nessuno}</p> : null}
          {sections.map((section) => (
            <section key={section.title} className="mb-1.5">
              <p className={cx(eyebrow, "m-0 px-3 pt-2 pb-1")}>{section.title}</p>
              <ul className="m-0 list-none p-0">
                {section.list.map((result) => {
                  position++;
                  const mine = position;
                  return (
                    <li key={`${result.kind}-${result.id}`}>
                      <Link
                        id={`rr-${mine}`}
                        role="option"
                        aria-selected={mine === active}
                        href={`/${game}${result.path}`}
                        onMouseEnter={() => setActive(mine)}
                        onClick={() => dialog.current?.close()}
                        className={cx(
                          "flex min-h-11 items-center gap-3 px-3 py-1.5",
                          mine === active ? "bg-brand text-white" : "text-ink hover:bg-paper-3",
                        )}
                      >
                        {result.kind === "eroe" ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={heroCardSrc(game, result.id)} alt="" width={40} height={40} className="h-10 w-10 shrink-0 bg-paper" loading="lazy" />
                        ) : (
                          <span className={cx("grid h-10 w-10 shrink-0 place-items-center", mine === active ? "text-white" : "text-ink-3")}>
                            {result.kind === "boss" || result.kind === "bestia" ? (
                              <IconSword size={20} />
                            ) : result.kind === "pagina" ? (
                              <IconPage size={20} />
                            ) : (
                              <IconCard size={20} />
                            )}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate font-display text-[15px] font-extrabold uppercase leading-tight [font-variation-settings:'wdth'_80]">
                            {result.title}
                          </span>
                          <span className={cx("block truncate text-[12px]", mine === active ? "text-white/85" : "text-ink-3")}>
                            {result.subtitle || t.tipo[result.kind]}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {query.trim() ? (
            <Link
              href={`/cerca?q=${encodeURIComponent(query.trim())}`}
              onClick={() => dialog.current?.close()}
              className="group/more mt-1 flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-brand-deep hover:underline"
            >
              {/* nella frase c'e' quello che hai scritto: resta nel testo, non nel maiuscolo di MoreLink */}
              <span className="min-w-0 break-words">{t.discussioni(query.trim())}</span>
              <MoreArrow />
            </Link>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
