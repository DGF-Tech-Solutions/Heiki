/**
 * Le icone dell'interfaccia: Phosphor, una famiglia sola, nel peso «bold».
 *
 * Fino al 10/10 erano disegnate qui a mano, tracciato per tracciato, e altre
 * quattro stavano sparse nei componenti (la X del menu, l'omino dell'utente, la
 * spunta del box, il dado del Randomizer), ognuna col suo spessore. Una libreria
 * da' lo stesso tratto e la stessa misura ottica a tutte, e ha gia' le icone
 * che serviranno (non vanno disegnate una alla volta). «bold» e non «regular»:
 * accanto ai titoli neri e stretti del mondo «Persona» il tratto sottile spariva.
 *
 * Si importa la versione «ssr» di ogni icona, un file per icona: non usa il
 * contesto di React, quindi va bene nei componenti del server e in quelli del
 * browser, e nel pacchetto finisce solo quello che si usa.
 *
 * Le icone del GIOCO (attributi, rarita', razze, stelle delle carte) restano le
 * sue, da public/eroi. Queste sono decorative: il nome lo da' il comando che le
 * contiene (`aria-label` o testo `sr-only`).
 */

import type { ComponentType, SVGProps } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CardsThreeIcon } from "@phosphor-icons/react/dist/ssr/CardsThree";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { DiceFiveIcon } from "@phosphor-icons/react/dist/ssr/DiceFive";
import { FileTextIcon } from "@phosphor-icons/react/dist/ssr/FileText";
import { HeartIcon } from "@phosphor-icons/react/dist/ssr/Heart";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/ssr/LinkSimple";
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/ssr/SlidersHorizontal";
import { StarIcon } from "@phosphor-icons/react/dist/ssr/Star";
import { SwordIcon } from "@phosphor-icons/react/dist/ssr/Sword";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/ssr/UsersThree";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";

type Weight = "regular" | "bold" | "fill";

/**
 * `strokeWidth` resta accettato perche' qualche chiamata lo passava alle icone
 * disegnate a mano: Phosphor disegna pieni e non tratti, e lo ignora. Lo
 * spessore si sceglie con `weight`.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "ref"> & {
  size?: number;
  weight?: Weight;
};

type PhosphorIcon = ComponentType<Omit<SVGProps<SVGSVGElement>, "ref"> & { size?: number; weight?: Weight }>;

function make(Base: PhosphorIcon, defaults: { size?: number; weight?: Weight } = {}) {
  function Icon({ size, weight, strokeWidth: _ignored, ...props }: IconProps) {
    void _ignored;
    return (
      <Base
        size={size ?? defaults.size ?? 18}
        weight={weight ?? defaults.weight ?? "bold"}
        aria-hidden
        focusable="false"
        {...props}
      />
    );
  }
  return Icon;
}

export const IconChevronLeft = make(CaretLeftIcon);
export const IconChevronRight = make(CaretRightIcon);
export const IconArrowRight = make(ArrowRightIcon, { size: 14 });
export const IconArrowUp = make(ArrowUpIcon);
export const IconSearch = make(MagnifyingGlassIcon);
export const IconClose = make(XIcon);
export const IconMenu = make(ListIcon);
export const IconFilters = make(SlidersHorizontalIcon);

export const IconHeroes = make(UsersThreeIcon);
export const IconCalendar = make(CalendarBlankIcon);
export const IconSword = make(SwordIcon);
export const IconCard = make(CardsThreeIcon);
export const IconPage = make(FileTextIcon);
export const IconUser = make(UserIcon, { weight: "fill" });
export const IconDice = make(DiceFiveIcon);
export const IconStar = make(StarIcon, { size: 12, weight: "fill" });

/* piccole, dentro le lame dei comandi: 16 di partenza */
export const IconPlus = make(PlusIcon, { size: 16 });
export const IconCheck = make(CheckIcon, { size: 16 });
export const IconHeart = make(HeartIcon, { size: 16, weight: "fill" });
export const IconLink = make(LinkSimpleIcon, { size: 16 });
