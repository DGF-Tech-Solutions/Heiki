"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { setTheme } from "@/lib/theme/actions";
import { THEME_COLORS, THEMES, type Theme } from "@/lib/theme/themes";
import { IconCheck, IconPalette } from "./icons";
import { cx, eyebrow } from "./ui";

const TESTI = testi({
  it: {
    apri: (nome: string) => `Tema del sito: ${nome}`,
    titolo: "Tema",
    gruppo: "Tema del sito",
    nota: "Cambiano solo i colori. La scelta resta in questo browser.",
    nomi: { persona: "Rosso", notte: "Notte", giada: "Giada", viola: "Viola", ambra: "Ambra" } satisfies Record<Theme, string>,
  },
  en: {
    apri: (nome: string) => `Site theme: ${nome}`,
    titolo: "Theme",
    gruppo: "Site theme",
    nota: "Only the colors change. Your choice stays in this browser.",
    nomi: { persona: "Red", notte: "Midnight", giada: "Jade", viola: "Violet", ambra: "Amber" },
  },
});

// larga fissa: il pannello si mette a posto prima di aprirsi, quando non si puo' ancora misurare
const LARGHEZZA = 232;
const MARGINE = 12;

/**
 * Il tema del sito, accanto a IT | EN nell'intestazione (11/10).
 *
 * Un pulsante e un pannello e non i campioni in fila: i temi sono cinque, e
 * sul telefono l'intestazione non ha posto (misurato a 390: marchio, ricerca,
 * lingua ed «Entra» lasciano 91 pixel, cinque campioni ne chiedono 160). Il
 * pulsante ne prende 30, alto quanto IT | EN (27). Nel pannello ogni tema
 * e' un pulsante col suo campione e il suo nome, e dichiara se e' quello scelto
 * (`aria-pressed`), come i pulsanti della lingua. Il pannello resta aperto dopo
 * la scelta: si passa da un tema all'altro e la pagina dietro cambia subito.
 *
 * La scelta tocca `data-theme` su `<html>` direttamente, senza aspettare il
 * server: e' un attributo, e il CSS fa il resto. Il cookie (setTheme) serve
 * alla richiesta dopo, quando il layout lo rilegge e la pagina arriva gia' nei
 * colori giusti.
 */
export function ThemeSwitch({ current }: { current: Theme }) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [scelto, setScelto] = useState(current);
  const pulsante = useRef<HTMLButtonElement>(null);
  const pannello = useRef<HTMLDivElement>(null);

  function scegli(tema: Theme) {
    if (tema === scelto) return;
    setScelto(tema);
    document.documentElement.dataset.theme = tema;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[tema].paper);
    void setTheme(tema);
  }

  // sotto il pulsante, allineato al suo bordo destro, mai fuori dallo schermo
  function posiziona() {
    const b = pulsante.current?.getBoundingClientRect();
    const p = pannello.current;
    if (!b || !p) return;
    const left = Math.max(MARGINE, Math.min(b.right - LARGHEZZA, document.documentElement.clientWidth - LARGHEZZA - MARGINE));
    p.style.top = `${Math.round(b.bottom + 10)}px`;
    p.style.left = `${Math.round(left)}px`;
  }

  return (
    <>
      <button
        ref={pulsante}
        type="button"
        popoverTarget="menu-tema"
        aria-label={t.apri(t.nomi[scelto])}
        title={t.apri(t.nomi[scelto])}
        className="grid h-[27px] w-[30px] shrink-0 cursor-pointer place-items-center rounded-card border border-rule text-ink-3 transition-colors hover:text-ink"
      >
        <IconPalette size={16} />
      </button>

      <div
        ref={pannello}
        id="menu-tema"
        popover="auto"
        onBeforeToggle={(event) => {
          if (event.newState === "open") posiziona();
        }}
        style={{ width: LARGHEZZA }}
        className="inset-auto m-0 border-2 border-ink bg-paper p-0 whitespace-normal text-ink shadow-[6px_6px_0_0_var(--color-brand)]"
      >
        <p className={cx(eyebrow, "m-0 border-b border-rule px-4 py-2.5")}>{t.titolo}</p>
        <div role="group" aria-label={t.gruppo} className="grid gap-0.5 p-2">
          {THEMES.map((tema) => (
            <button
              key={tema}
              type="button"
              aria-pressed={tema === scelto}
              onClick={() => scegli(tema)}
              // `hover:text-paper` scritto qui: il colore del passaggio di .p5-menu-item sta
              // in globals.css, e il colore di riposo, un'utility, lo scavalcherebbe (testo
              // chiaro sulla lama bianca)
              className={cx(
                "p5-menu-item flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left font-display text-[14px] font-extrabold uppercase tracking-[0.02em] [font-variation-settings:'wdth'_82] hover:text-paper",
                tema === scelto ? "text-ink" : "text-ink-2",
              )}
            >
              {/* il campione: l'accento del tema, tagliato come le etichette */}
              <span aria-hidden className="p5-cut-sm h-4 w-7 shrink-0" style={{ backgroundColor: THEME_COLORS[tema].brand }} />
              <span className="min-w-0 flex-1">{t.nomi[tema]}</span>
              {tema === scelto ? <IconCheck className="shrink-0" /> : null}
            </button>
          ))}
        </div>
        <p className="m-0 border-t border-rule px-4 py-2.5 text-[12px] leading-snug text-ink-3">{t.nota}</p>
      </div>
    </>
  );
}
