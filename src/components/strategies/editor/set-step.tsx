"use client";

/**
 * Il passo del set artefatto: facoltativo, e solo fra i set che valgono nella
 * modalita' scelta (il filtro «Contenuto» del gioco, `TemplateSet.modes`).
 *
 * Chiuso mostra la scelta; aperto l'elenco con la ricerca. L'elenco non sta
 * sempre aperto perche' sono sessanta set con il loro bonus: sul telefono
 * sarebbero quattro schermi fra la squadra e la guida. Ogni voce e' un pulsante
 * con `aria-pressed`, e sceglierla chiude l'elenco: con dei radio le frecce
 * cambierebbero la scelta a ogni passo e l'elenco si chiuderebbe al primo.
 *
 * Se si cambia modalita' e il set scelto non vale piu', resta scelto e segnato:
 * lo toglie o lo cambia chi scrive, come gli eroi.
 */

import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { buttonClass, cx, Input, numeric } from "@/components/ui";
import { searchText } from "@/lib/games/hero-terms";
import type { TemplateMode, TemplateSet } from "@/lib/strategies/types";
import type { Texts } from "./editor-texts";

export function SetStep({
  t,
  sets,
  mode,
  chosen,
  invalid,
  onChoose,
}: {
  t: Texts;
  sets: readonly TemplateSet[];
  mode: TemplateMode | null;
  chosen: string | null;
  /** il set scelto non vale nella modalita' */
  invalid: boolean;
  onChoose: (set: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = chosen ? sets.find((set) => set.id === chosen) : undefined;

  if (!mode) return <p className="m-0 text-[13px] text-ink-3">{t.setPrimaModalita}</p>;

  const valid = sets.filter((set) => set.modes.includes(mode.mode));
  const words = searchText(query);
  const found = words ? valid.filter((set) => searchText(`${set.code} ${set.number} ${set.name}`).includes(words)) : valid;
  const choose = (set: string | null) => {
    onChoose(set);
    setOpen(false);
    // il fuoco torna al pulsante che ha aperto l'elenco, che resta
    window.requestAnimationFrame(() => document.getElementById("strategia-set")?.focus());
  };

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cx(
            "p5-corner min-w-0 flex-1 basis-[300px] border bg-paper-2 p-2.5",
            invalid ? "border-hot" : current ? "border-brand" : "border-rule",
          )}
        >
          {current ? (
            <SetSummary t={t} set={current} />
          ) : (
            <p className="m-0 px-1 text-[13px]">
              <span className="font-semibold">{t.nessunSet}</span>
              <span className="text-ink-3"> · {t.nessunSetSpiega}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            id="strategia-set"
            aria-expanded={open}
            aria-controls="strategia-set-elenco"
            onClick={() => setOpen(!open)}
            className={cx(buttonClass("outline", "sm"), "scroll-mt-28 scroll-mb-48")}
          >
            {current ? t.cambiaSet : t.scegliSet}
          </button>
          {current ? (
            <button type="button" onClick={() => onChoose(null)} className={buttonClass("ghost", "sm")}>
              {t.nessunSet}
            </button>
          ) : null}
        </div>
      </div>
      {invalid ? (
        <p role="status" className="mt-2 mb-0 text-[12px] text-hot">
          {t.setNonVale(mode.name)}
        </p>
      ) : null}

      {open ? (
        <div id="strategia-set-elenco" className="p5-corner mt-3 border border-rule border-t-[3px] border-t-brand bg-paper-2 p-3">
          <label htmlFor="strategia-cerca-set" className="sr-only">
            {t.cercaSetEtichetta}
          </label>
          <Input
            id="strategia-cerca-set"
            type="search"
            autoComplete="off"
            value={query}
            placeholder={t.cercaSet}
            onChange={(event) => setQuery(event.target.value)}
            className="max-w-[340px] placeholder:text-ink-3"
          />
          <ul className="m-0 mt-3 grid max-h-[min(560px,65vh)] list-none grid-cols-1 gap-1.5 overflow-y-auto overscroll-contain p-0 pr-1 md:grid-cols-2">
            {!words ? (
              <li>
                <SetButton pressed={!chosen} onClick={() => choose(null)}>
                  <span className="grid h-[52px] w-11 shrink-0 place-items-center bg-paper-3 text-[18px] text-ink-3" aria-hidden>
                    –
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[13px] font-black uppercase [font-variation-settings:'wdth'_80]">{t.nessunSet}</span>
                    <span className="block text-[12px] text-ink-3">{t.nessunSetSpiega}</span>
                  </span>
                </SetButton>
              </li>
            ) : null}
            {found.map((set) => (
              <li key={set.id}>
                <SetButton pressed={set.id === chosen} onClick={() => choose(set.id)}>
                  <SetSummary t={t} set={set} compact />
                </SetButton>
              </li>
            ))}
          </ul>
          {found.length === 0 ? <p className="mt-2 mb-0 text-[13px] text-ink-3">{t.nessunSetTrovato}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function SetButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "relative flex h-full w-full cursor-pointer items-start gap-2.5 border p-1.5 pr-8 text-left text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink",
        pressed ? "border-brand bg-brand-soft" : "border-rule bg-paper hover:border-ink-3 hover:bg-paper-3",
      )}
    >
      {children}
      {pressed ? <IconCheck size={16} className="absolute top-2 right-2 text-brand-deep" /> : null}
    </button>
  );
}

/** Un set: la prima carta, «No. N», il nome, quante carte, e il bonus al livello massimo. */
function SetSummary({ t, set, compact = false }: { t: Texts; set: TemplateSet; compact?: boolean }) {
  return (
    <span className="flex min-w-0 flex-1 items-start gap-2.5">
      {set.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- le carte piccole gia' pronte
        <img src={set.image} alt="" width={44} height={52} loading="lazy" decoding="async" className="h-[52px] w-11 shrink-0 bg-paper-3 object-cover" />
      ) : (
        <span aria-hidden className="h-[52px] w-11 shrink-0 bg-paper-3" />
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className={cx(numeric, "text-[12px] text-brand-deep")}>{set.code}</span>
          <span className="font-display text-[13px] leading-tight font-black uppercase [font-variation-settings:'wdth'_80]">{set.name}</span>
          <span className="text-[12px] text-ink-3">{t.carte(set.cards)}</span>
        </span>
        {set.bonus ? (
          <span className={cx("mt-0.5 block text-[12px] leading-snug text-ink-2", compact && "line-clamp-3")}>
            <span className="text-ink-3">{t.alMassimo}: </span>
            {set.bonus}
          </span>
        ) : null}
      </span>
    </span>
  );
}
