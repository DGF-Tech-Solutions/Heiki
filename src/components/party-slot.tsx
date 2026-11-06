/**
 * I posti di una squadra: la cornice resta ferma e cambia chi ci sta sopra.
 *
 * Li usano Squadra e Randomizer: due copie dello stesso posto avrebbero preso due
 * strade al primo ritocco. Qui c'e' solo l'aspetto; chi lo usa decide se il posto
 * e' un pulsante (Squadra), un collegamento alla scheda (Randomizer pieno) o
 * niente (Randomizer prima della pesca). Per questo sono `span`: stanno dentro un
 * pulsante o un collegamento senza rompere l'HTML.
 *
 * Gli stati sono quelli del sito: fermo la piastra del fondo, al passaggio quella piu'
 * chiara, scelto la piu' forte. Niente fili attorno.
 *
 * Compatti di proposito (06/11): fino a 328x411 px con la card a 194, e i ritratti del gioco
 * sono 128x128. La card non passa `--card-eroe` (pulito.css), e il posto le sta attorno.
 *
 * Il movimento e' uno solo, ed e' la scelta: l'eroe appena messo entra (le animazioni
 * `stage-*` di globals.css). Lo decide chi usa il posto con `enter`, cosi' una squadra
 * ripresa dall'indirizzo o dal browser non si anima al caricamento; con «riduci
 * movimento» compare e basta.
 */

import type { ReactNode } from "react";
import { IconPlus } from "@/components/icons";
import { cx, eyebrow, heroEpithetClass, heroNameClass, numeric } from "@/components/ui";
import { heroCardSrc } from "@/lib/games/heroes";

/** Quello che serve di un eroe per metterlo in un posto, gia' nella lingua della pagina. */
export interface PartyHero {
  readonly id: string;
  readonly name: string;
  readonly epithet: string;
  /** il colore dell'attributo: l'epiteto dell'associato */
  readonly color: string | null;
}

/** La fila dei quattro posti: uguale in Squadra, Randomizer ed editor delle strategie. */
export const partyGridClass = "m-0 grid max-w-[840px] list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:grid-cols-4 sm:gap-x-4";

const ENTER_CARD = "motion-safe:animate-[stage-figure-in_380ms_cubic-bezier(0.16,1,0.3,1)_both]";
const ENTER_PLATE = "motion-safe:animate-[stage-plate-in_240ms_cubic-bezier(0.16,1,0.3,1)_70ms_both]";

/**
 * Il posto in campo: pieno la card dell'eroe col nome, vuoto quello che passa chi lo usa
 * (`empty`). In alto a destra sta il pulsante per togliere l'eroe.
 */
export function PartyPanel({
  game,
  number,
  label,
  bench = false,
  benchNote,
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
  /** il quarto in panchina: dice il suo nome, come nel resoconto */
  bench?: boolean;
  /** cosa vuol dire stare nello slot secondario */
  benchNote?: string;
  hero: PartyHero | undefined;
  /** il contenuto del posto vuoto */
  empty?: ReactNode;
  /** `next`: il primo posto libero, quello da cui cominciare; `active`: si sta scegliendo */
  state?: "next" | "active";
  enter?: boolean;
}) {
  return (
    <span
      className={cx(
        "relative flex h-full min-h-[calc(var(--card-eroe)+6.5rem)] w-full flex-col gap-1.5 p-2.5 transition-colors",
        state === "active" ? "bg-piastra-forte" : "bg-piastra-fondo group-hover:bg-piastra",
      )}
    >
      {/*
        La riga in alto, dove a destra sta la croce: il numero, o il nome se il posto e' lo
        slot secondario, che e' diverso dagli altri. Per gli altri il nome resta a chi usa un
        lettore di schermo
      */}
      <span className="flex h-7 shrink-0 items-center pr-9">
        {bench ? (
          <span title={benchNote} className="truncate font-display text-[13px] font-semibold text-ink">
            {label}
          </span>
        ) : (
          <>
            <span aria-hidden className={cx(numeric, "text-[13px] text-ink-3")}>
              {number}
            </span>
            <span className="sr-only">{label}</span>
          </>
        )}
      </span>

      {hero ? (
        <>
          {/* dall'alto e non al centro: card e nomi restano sulla stessa riga nei quattro posti */}
          <span className="grid justify-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={hero.id}
              src={heroCardSrc(game, hero.id, 2)}
              alt=""
              width={256}
              height={256}
              decoding="async"
              className={cx("block aspect-square w-[min(var(--card-eroe),72%)] bg-paper-2", enter && ENTER_CARD)}
            />
          </span>
          <span key={`${hero.id}-targa`} className={cx("grid min-w-0 gap-0.5", enter && ENTER_PLATE)}>
            <span className={heroEpithetClass}>{hero.epithet}</span>
            <span className={heroNameClass}>{hero.name}</span>
          </span>
        </>
      ) : (
        <>
          <span className="grid flex-1 place-items-center">{empty}</span>
          {/* serve a chi sceglie: col posto pieno resta nel `title`, e la dice il comando sotto */}
          {bench && benchNote ? <span className="text-[12px] leading-tight text-ink-3">{benchNote}</span> : null}
        </>
      )}
    </span>
  );
}

/** Il segno del posto vuoto da scegliere: il «+» e la parola. Bianco il posto da cui cominciare. */
export function ChooseMark({ text, strong }: { text: string; strong: boolean }) {
  return (
    <span className="grid justify-items-center gap-2">
      <span
        className={cx(
          "grid h-11 w-14 place-items-center transition-colors",
          strong ? "bg-brand text-on-brand" : "bg-piastra text-ink group-hover:bg-piastra-forte",
        )}
      >
        <IconPlus size={20} />
      </span>
      <span className="font-display text-[13px] font-medium text-ink-2 group-hover:text-ink">{text}</span>
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
        "flex h-full min-h-[62px] w-full items-center gap-2 p-1.5 transition-colors sm:gap-2.5",
        // a destra il posto per la croce che toglie l'eroe (solo dove si sceglie)
        choosable ? "pr-10" : "pr-2",
        active ? "bg-piastra-forte" : "bg-piastra-fondo",
        (choosable || hero) && !active && "group-hover:bg-piastra",
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
          className="grid h-10 w-10 shrink-0 place-items-center bg-piastra text-ink-2 transition-colors group-hover:text-ink sm:h-12 sm:w-12"
        >
          {choosable ? <IconPlus size={16} /> : null}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cx(eyebrow, "block text-[11px] leading-tight sm:text-[11px]")}>{label}</span>
        {hero ? (
          <>
            {/* sul telefono la striscia e' larga 170px: l'epiteto lascia il posto al nome, su due righe */}
            <span className="hidden truncate text-[12px] leading-tight sm:block" style={hero.color ? { color: hero.color } : undefined}>
              {hero.epithet}
            </span>
            <span className="line-clamp-2 font-display text-[12px] leading-[1.1] font-semibold sm:text-[13px]">{hero.name}</span>
          </>
        ) : emptyText ? (
          <span className="mt-0.5 block truncate text-[13px] text-ink-2 group-hover:text-ink">{emptyText}</span>
        ) : null}
      </span>
    </span>
  );
}
