/**
 * I posti di una squadra come in una schermata di scelta del personaggio: la
 * cornice resta ferma e cambia chi ci sta sopra, lo stesso linguaggio del palco
 * della griglia Eroi (hero-stage.tsx). Chiesto dall'utente il 10/10 («grande
 * enfasi sulla selezione dei personaggi»): prima i posti erano quadrati grigi
 * tratteggiati con un «+».
 *
 * Li usano Squadra e Randomizer: due copie dello stesso posto avrebbero preso due
 * strade al primo ritocco. Qui c'e' solo l'aspetto; chi lo usa decide se il posto
 * e' un pulsante (Squadra), un collegamento alla scheda (Randomizer pieno) o
 * niente (Randomizer prima della pesca). Per questo sono `span`: stanno dentro un
 * pulsante o un collegamento senza rompere l'HTML.
 *
 * Il movimento e' uno solo, ed e' la scelta: l'eroe appena messo entra col
 * taglio diagonale del palco (le animazioni `stage-*` di globals.css). Lo decide
 * chi usa il posto con `enter`, cosi' una squadra ripresa dall'indirizzo o dal
 * browser non si anima al caricamento; con «riduci movimento» compare e basta.
 */

import type { ReactNode } from "react";
import { IconPlus } from "@/components/icons";
import { cx, eyebrow } from "@/components/ui";
import { heroCardSrc } from "@/lib/games/heroes";

/** Quello che serve di un eroe per metterlo in un posto, gia' nella lingua della pagina. */
export interface PartyHero {
  readonly id: string;
  readonly name: string;
  readonly epithet: string;
  /** il colore dell'attributo: la lama sottile del posto, come nel palco */
  readonly color: string | null;
}

const ENTER_CARD = "motion-safe:animate-[stage-figure-in_380ms_cubic-bezier(0.16,1,0.3,1)_both]";
const ENTER_PLATE = "motion-safe:animate-[stage-plate-in_240ms_cubic-bezier(0.16,1,0.3,1)_70ms_both]";

/**
 * Il posto in campo: retino rosso, lama obliqua, il numero enorme a contorno,
 * l'etichetta del posto; pieno, la card dell'eroe con la targa (epiteto sulla
 * lama bianca, nome con l'ombra rossa); vuoto, quello che passa chi lo usa
 * (`empty`). L'angolo tagliato e' in basso a sinistra: in alto a destra sta il
 * pulsante per togliere l'eroe.
 */
export function PartyPanel({
  game,
  number,
  label,
  bench = false,
  hero,
  empty,
  state,
  enter = false,
}: {
  game: string;
  /** il numero del posto, da 1 */
  number: number;
  /** «Eroe 1», «Slot secondario» */
  label: string;
  /** il quarto in panchina: etichetta dorata, come nel resoconto */
  bench?: boolean;
  hero: PartyHero | undefined;
  /** il contenuto del posto vuoto */
  empty?: ReactNode;
  /** `next`: il primo posto libero, quello da cui cominciare; `active`: si sta scegliendo */
  state?: "next" | "active";
  enter?: boolean;
}) {
  const lit = !!hero || state !== undefined;
  return (
    <span
      className={cx(
        "relative isolate flex aspect-[4/5] w-full flex-col overflow-hidden border bg-paper-2 p-2.5 transition-colors",
        "[clip-path:polygon(0_0,100%_0,100%_100%,16px_100%,0_calc(100%-16px))]",
        state === "active" ? "border-brand ring-2 ring-brand ring-inset" : "border-rule group-hover:border-ink-3",
      )}
    >
      {/* il fondo: retino, lama dell'attributo, lama rossa (spenta se il posto e' vuoto) */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_srgb,var(--color-brand)_34%,transparent)_1.1px,transparent_1.8px)] bg-[length:8px_8px] [mask-image:linear-gradient(200deg,#000_0%,transparent_72%)]"
      />
      <span
        aria-hidden
        className={cx(
          "absolute inset-0 -z-10 transition-colors [clip-path:polygon(64%_0,100%_0,100%_100%,40%_100%)]",
          hero ? "bg-brand" : lit ? "bg-brand-soft" : "bg-paper-3 group-hover:bg-brand-soft",
        )}
      />
      {hero?.color ? (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 opacity-85 [clip-path:polygon(57%_0,61%_0,37%_100%,33%_100%)]"
          style={{ background: hero.color }}
        />
      ) : null}
      {/* il numero del posto, enorme e a contorno: e' la grafica delle schermate di scelta */}
      <span
        aria-hidden
        className="absolute -right-1 bottom-[18%] -z-10 font-display text-[clamp(84px,10vw,150px)] leading-[0.8] font-black text-transparent [-webkit-text-stroke:2px_color-mix(in_srgb,var(--color-ink)_15%,transparent)] [font-variation-settings:'wdth'_62]"
      >
        {number}
      </span>
      {/* la base scura sotto la targa: il nome resta leggibile sopra la lama rossa */}
      {hero ? (
        <span aria-hidden className="absolute inset-x-0 bottom-0 -z-[5] h-[42%] bg-[linear-gradient(to_top,var(--color-paper)_12%,transparent)]" />
      ) : null}

      <span
        className={cx(
          "p5-cut-sm self-start px-2 font-mono text-[11px] leading-5 font-medium tracking-[0.08em] uppercase",
          bench ? "bg-gold text-paper" : "bg-ink text-paper",
        )}
      >
        {label}
      </span>

      {hero ? (
        <>
          <span className="grid min-h-0 flex-1 place-items-center py-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita', come nella griglia Eroi */}
            <img
              key={hero.id}
              src={heroCardSrc(game, hero.id)}
              srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
              alt=""
              width={128}
              height={128}
              decoding="async"
              className={cx("block aspect-square w-[60%] max-w-[168px] bg-paper-2 shadow-[5px_5px_0_var(--color-paper)]", enter && ENTER_CARD)}
            />
          </span>
          <span key={`${hero.id}-targa`} className={cx("grid min-w-0 justify-items-start gap-1", enter && ENTER_PLATE)}>
            <span className="p5-cut-sm max-w-full origin-left -rotate-2 truncate bg-ink px-2 py-px font-display text-[11px] leading-tight font-extrabold text-paper uppercase [font-variation-settings:'wdth'_85]">
              {hero.epithet}
            </span>
            <span className="p5-title line-clamp-2 max-w-full font-display text-[clamp(15px,1.5vw,20px)] leading-[0.98] font-black uppercase [font-variation-settings:'wdth'_72]">
              {hero.name}
            </span>
          </span>
        </>
      ) : (
        <span className="grid flex-1 place-items-center">{empty}</span>
      )}
    </span>
  );
}

/** Il segno del posto vuoto da scegliere: il «+» in una lama, e la parola. Rosso il posto da cui cominciare. */
export function ChooseMark({ text, strong }: { text: string; strong: boolean }) {
  return (
    <span className="grid justify-items-center gap-2">
      <span
        className={cx(
          "p5-cut grid h-11 w-14 place-items-center transition-colors",
          strong ? "bg-brand text-white" : "bg-ink text-paper group-hover:bg-brand group-hover:text-white",
        )}
      >
        <IconPlus size={20} />
      </span>
      <span className="font-display text-[13px] font-extrabold tracking-[0.04em] text-ink-2 uppercase [font-variation-settings:'wdth'_85] group-hover:text-ink">
        {text}
      </span>
    </span>
  );
}

/**
 * Il posto dell'associato, sotto quello in campo: una striscia con la card
 * piccola e il nome. Piu' basso del posto in campo di proposito: l'associato
 * non combatte, presta una parte delle statistiche.
 */
export function AssociateStrip({
  game,
  label,
  hero,
  emptyText,
  choosable,
  active = false,
  enter = false,
}: {
  game: string;
  /** «Associato» */
  label: string;
  hero: PartyHero | undefined;
  /** la riga sotto l'etichetta quando il posto e' vuoto */
  emptyText?: string;
  /** il posto vuoto si puo' scegliere (Squadra): mostra il «+» */
  choosable: boolean;
  active?: boolean;
  enter?: boolean;
}) {
  return (
    <span
      className={cx(
        "flex min-h-[62px] w-full items-center gap-2 border bg-paper-2 p-1.5 transition-colors sm:gap-2.5",
        // a destra il posto per la croce che toglie l'eroe (solo dove si sceglie)
        choosable ? "pr-10" : "pr-2",
        active ? "border-brand ring-2 ring-brand ring-inset" : "border-rule",
        (choosable || hero) && !active && "group-hover:border-ink-3",
      )}
    >
      {hero ? (
        // eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita'
        <img
          key={hero.id}
          src={heroCardSrc(game, hero.id)}
          srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
          alt=""
          width={48}
          height={48}
          decoding="async"
          className={cx("h-10 w-10 shrink-0 bg-paper-3 sm:h-12 sm:w-12", enter && ENTER_CARD)}
        />
      ) : (
        <span
          aria-hidden
          className={cx(
            "grid h-10 w-10 shrink-0 place-items-center bg-paper-3 text-ink-2 transition-colors sm:h-12 sm:w-12",
            choosable && "group-hover:bg-brand group-hover:text-white",
            active && "bg-brand text-white",
          )}
        >
          {choosable ? <IconPlus size={16} /> : null}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cx(eyebrow, "block text-[11px] leading-tight tracking-[0.08em] sm:text-[11px]")}>{label}</span>
        {hero ? (
          <>
            {/* sul telefono la striscia e' larga 170px: l'epiteto lascia il posto al nome, su due righe */}
            <span className="hidden truncate text-[12px] leading-tight sm:block" style={hero.color ? { color: hero.color } : undefined}>
              {hero.epithet}
            </span>
            <span className="line-clamp-2 font-display text-[12px] leading-[1.05] font-black uppercase [font-variation-settings:'wdth'_78] sm:text-[13px]">
              {hero.name}
            </span>
          </>
        ) : emptyText ? (
          <span className="mt-0.5 block truncate text-[13px] text-ink-2 group-hover:text-ink">{emptyText}</span>
        ) : null}
      </span>
    </span>
  );
}
