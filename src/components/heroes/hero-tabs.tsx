/**
 * Le schede della pagina di un eroe: Abilita', Statistiche, Reliquia, Info.
 *
 * Scelta dell'utente (26/09): la pagina era una colonna sola, lunga 4.600px a
 * 1400 e 6.100 sul telefono, con le statistiche in fondo, sotto reliquia e
 * altre versioni. Ora l'intestazione resta in cima e sotto si vede una parte
 * alla volta. Una funzione nuova e' una scheda nuova: una voce in piu'
 * nell'elenco che la pagina passa qui, e la pagina non si allunga.
 *
 * SENZA JAVASCRIPT per cambiare scheda, come i ranghi delle carte: un radio per
 * scheda e regole CSS con `:has()`. Tutte le schede sono nell'HTML, quindi
 * cambiare non ricarica niente e non azzera lo slider delle statistiche. La
 * scheda di partenza la dice l'indirizzo (`?scheda=statistiche`), letto sul
 * server: un collegamento da un'altra pagina apre quella giusta. `HeroTabUrl`
 * fa il contrario, ed e' l'unico pezzo client: scelta una scheda, la scrive
 * nell'indirizzo, cosi' ricaricare o condividere la pagina la ritrova.
 *
 * La barra resta sotto l'intestazione del sito scorrendo (60px: 58 di altezza
 * piu' il bordo di 2), cosi' da in fondo alle carte si passa alle statistiche
 * senza risalire.
 */

import type { ReactNode } from "react";
import { HeroTabUrl } from "@/components/heroes/hero-tab-url";
import { cx } from "@/components/ui";

export interface HeroTab {
  /** la parola dell'indirizzo, `?scheda=<key>`: non si traduce, cosi' i collegamenti valgono in tutte e due le lingue */
  key: string;
  label: string;
  content: ReactNode;
}

/**
 * Le classi delle schede, per POSIZIONE e scritte per esteso.
 *
 * Tailwind legge il SORGENTE: una classe costruita con un template non finisce
 * nel CSS (la stessa ragione di RANK_CLASSES nelle abilita'). Sei posizioni,
 * due libere oggi; una settima scheda e' una riga in piu' qui.
 *
 * Il gruppo ha un nome, `group/schede`, e DEVE averlo. Le carte usano
 * `group-has-[.rk1:checked]` senza nome, che in Tailwind 4 diventa
 * `:where(.group):has(...)`: guarda QUALUNQUE antenato con la classe `group`.
 * Un `group` senza nome qui intorno conterrebbe i radio di tutte le carte, e
 * scegliere il rango 3 sulla carta A accenderebbe il rango 3 anche sulla B.
 */
const TAB_CLASSES = [
  {
    hook: "tab1",
    chip: "group-has-[.tab1:checked]/schede:[--btn-bg:var(--color-brand)] group-has-[.tab1:checked]/schede:[--btn-hi:var(--color-brand)] group-has-[.tab1:checked]/schede:[--btn-hi-fg:var(--color-ink)] group-has-[.tab1:focus-visible]/schede:outline-2",
    show: "group-has-[.tab1:checked]/schede:block",
  },
  {
    hook: "tab2",
    chip: "group-has-[.tab2:checked]/schede:[--btn-bg:var(--color-brand)] group-has-[.tab2:checked]/schede:[--btn-hi:var(--color-brand)] group-has-[.tab2:checked]/schede:[--btn-hi-fg:var(--color-ink)] group-has-[.tab2:focus-visible]/schede:outline-2",
    show: "group-has-[.tab2:checked]/schede:block",
  },
  {
    hook: "tab3",
    chip: "group-has-[.tab3:checked]/schede:[--btn-bg:var(--color-brand)] group-has-[.tab3:checked]/schede:[--btn-hi:var(--color-brand)] group-has-[.tab3:checked]/schede:[--btn-hi-fg:var(--color-ink)] group-has-[.tab3:focus-visible]/schede:outline-2",
    show: "group-has-[.tab3:checked]/schede:block",
  },
  {
    hook: "tab4",
    chip: "group-has-[.tab4:checked]/schede:[--btn-bg:var(--color-brand)] group-has-[.tab4:checked]/schede:[--btn-hi:var(--color-brand)] group-has-[.tab4:checked]/schede:[--btn-hi-fg:var(--color-ink)] group-has-[.tab4:focus-visible]/schede:outline-2",
    show: "group-has-[.tab4:checked]/schede:block",
  },
  {
    hook: "tab5",
    chip: "group-has-[.tab5:checked]/schede:[--btn-bg:var(--color-brand)] group-has-[.tab5:checked]/schede:[--btn-hi:var(--color-brand)] group-has-[.tab5:checked]/schede:[--btn-hi-fg:var(--color-ink)] group-has-[.tab5:focus-visible]/schede:outline-2",
    show: "group-has-[.tab5:checked]/schede:block",
  },
  {
    hook: "tab6",
    chip: "group-has-[.tab6:checked]/schede:[--btn-bg:var(--color-brand)] group-has-[.tab6:checked]/schede:[--btn-hi:var(--color-brand)] group-has-[.tab6:checked]/schede:[--btn-hi-fg:var(--color-ink)] group-has-[.tab6:focus-visible]/schede:outline-2",
    show: "group-has-[.tab6:checked]/schede:block",
  },
] as const;

/** Il nome dei radio e il parametro dell'indirizzo: uno solo per pagina. */
const NAME = "scheda";
const ID = "schede";

export function HeroTabs({
  tabs,
  initial,
  label,
}: {
  tabs: readonly HeroTab[];
  /** la scheda chiesta dall'indirizzo; se non esiste, la prima */
  initial: string | undefined;
  /** il nome del gruppo per chi usa un lettore di schermo */
  label: string;
}) {
  if (tabs.length > TAB_CLASSES.length) {
    throw new Error(`HeroTabs: ${tabs.length} schede, le classi sono scritte per ${TAB_CLASSES.length}`);
  }
  const start = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === initial),
  );

  return (
    <div id={ID} className="group/schede scroll-mt-[60px]">
      {/*
        I radio stanno DENTRO la barra: chi usa la tastiera ci arriva col tasto
        Tab e le frecce cambiano scheda, e il browser, portando il fuoco sul
        radio, non scorre via dalla barra che resta in vista.
      */}
      <div
        role="radiogroup"
        aria-label={label}
        // la sfumatura a destra dice che la fila continua: sul telefono le schede
        // non ci stanno tutte, e la sesta tagliata a meta' non lo diceva (10/10)
        className="sticky top-[60px] z-10 mb-5 flex gap-1 overflow-x-auto border-b-2 border-brand bg-paper py-1.5 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,#000_82%,transparent)] max-sm:pr-10"
      >
        {tabs.map((tab, index) => (
          <input
            key={`radio-${tab.key}`}
            type="radio"
            name={NAME}
            id={`${ID}-${tab.key}`}
            value={tab.key}
            defaultChecked={index === start}
            className={cx("sr-only", TAB_CLASSES[index]!.hook)}
          />
        ))}
        {tabs.map((tab, index) => (
          <label
            key={`label-${tab.key}`}
            htmlFor={`${ID}-${tab.key}`}
            className={cx(
              // la lama che spazza al passaggio e l'affondo alla pressione: p5-btn
              "p5-cut p5-btn shrink-0 cursor-pointer px-4 py-2 whitespace-nowrap [--btn-bg:transparent] [--btn-fg:var(--color-ink)]",
              "font-display text-[15px] font-black uppercase tracking-[0.04em] [font-variation-settings:'wdth'_75] outline-offset-[-4px] outline-ink",
              TAB_CLASSES[index]!.chip,
            )}
          >
            {tab.label}
          </label>
        ))}
      </div>

      {/*
        `@container`: le colonne dentro le schede (carte a coppie, comandi e
        tabella delle statistiche affiancati) le decide la larghezza della
        scheda, non quella della finestra.
      */}
      {tabs.map((tab, index) => (
        <section
          key={tab.key}
          aria-label={tab.label}
          className={cx("@container hidden", TAB_CLASSES[index]!.show)}
        >
          {tab.content}
        </section>
      ))}

      <HeroTabUrl name={NAME} first={tabs[0]?.key ?? ""} wrapperId={ID} />
    </div>
  );
}
