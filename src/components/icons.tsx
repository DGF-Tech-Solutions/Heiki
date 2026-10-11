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

// `/*#__PURE__*/` davanti a ogni make(): senza, il bundler non puo' sapere che
// una chiamata non usata non ha effetti, e tutte le icone finivano in ogni pagina
// (47 KB, misurato l'11/10)
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

export const IconChevronLeft = /*#__PURE__*/ make(CaretLeftIcon);
export const IconChevronRight = /*#__PURE__*/ make(CaretRightIcon);
export const IconArrowRight = /*#__PURE__*/ make(ArrowRightIcon, { size: 14 });
export const IconArrowUp = /*#__PURE__*/ make(ArrowUpIcon);
export const IconSearch = /*#__PURE__*/ make(MagnifyingGlassIcon);
export const IconClose = /*#__PURE__*/ make(XIcon);
export const IconMenu = /*#__PURE__*/ make(ListIcon);
export const IconFilters = /*#__PURE__*/ make(SlidersHorizontalIcon);

export const IconHeroes = /*#__PURE__*/ make(UsersThreeIcon);
export const IconCalendar = /*#__PURE__*/ make(CalendarBlankIcon);
export const IconSword = /*#__PURE__*/ make(SwordIcon);
export const IconCard = /*#__PURE__*/ make(CardsThreeIcon);
export const IconPage = /*#__PURE__*/ make(FileTextIcon);
export const IconUser = /*#__PURE__*/ make(UserIcon, { weight: "fill" });
export const IconDice = /*#__PURE__*/ make(DiceFiveIcon);
export const IconStar = /*#__PURE__*/ make(StarIcon, { size: 12, weight: "fill" });

/* piccole, dentro le lame dei comandi: 16 di partenza */
export const IconPlus = /*#__PURE__*/ make(PlusIcon, { size: 16 });
export const IconCheck = /*#__PURE__*/ make(CheckIcon, { size: 16 });
export const IconHeart = /*#__PURE__*/ make(HeartIcon, { size: 16, weight: "fill" });
export const IconLink = /*#__PURE__*/ make(LinkSimpleIcon, { size: 16 });
