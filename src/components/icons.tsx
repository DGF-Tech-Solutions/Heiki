/**
 * Le icone dell'interfaccia, disegnate qui: un tratto solo (2px, spigoli vivi
 * come il resto del mondo «Persona»), nessuna libreria. Sono poche e servono ai
 * comandi (cerca, menu, frecce, su, chiudi); le icone del GIOCO (attributi,
 * rarita', razze) restano le sue, da public/eroi.
 *
 * Decorative di proposito: il nome lo da' il comando che le contiene
 * (`aria-label` o testo `sr-only`).
 */

import type { SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Svg({ size = 18, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconChevronLeft = (props: IconProps) => (
  <Svg {...props}>
    <path d="M15 5 8 12l7 7" />
  </Svg>
);

export const IconChevronRight = (props: IconProps) => (
  <Svg {...props}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);

export const IconSearch = (props: IconProps) => (
  <Svg {...props}>
    <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15.5 15.5 20 20" />
  </Svg>
);

export const IconArrowUp = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 19V6M6 11l6-6 6 6" />
  </Svg>
);

export const IconClose = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

/** Tre lame oblique, come il pulsante del menu del telefono. */
export const IconMenu = (props: IconProps) => (
  <Svg {...props}>
    <path d="M5 7h15M3 12h15M5 17h15" />
  </Svg>
);

export const IconHeroes = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
  </Svg>
);

export const IconCalendar = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
  </Svg>
);

export const IconSword = (props: IconProps) => (
  <Svg {...props}>
    <path d="M14 4h6v6L10 20l-6-6L14 4ZM7 17l-3 3" />
  </Svg>
);

export const IconCard = (props: IconProps) => (
  <Svg {...props}>
    <path d="M7 3h10v18H7zM10 8h4M10 12h4" />
  </Svg>
);

export const IconPage = (props: IconProps) => (
  <Svg {...props}>
    <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6" />
  </Svg>
);

/*
 * Piu', spunta, cuore, collegamento: dove prima c'erano «+», «✓», «♥», che
 * cambiano forma da un font all'altro e che un lettore di schermo legge ad alta
 * voce. Tratto 2,8: stanno piccole (14-16px) dentro le lame.
 */

export const IconPlus = (props: IconProps) => (
  <Svg size={16} strokeWidth={2.8} {...props}>
    <path d="M12 4v16M4 12h16" />
  </Svg>
);

export const IconCheck = (props: IconProps) => (
  <Svg size={16} strokeWidth={2.8} {...props}>
    <path d="M4 12.5 9.5 18 20 6" />
  </Svg>
);

export const IconHeart = (props: IconProps) => (
  <Svg size={16} strokeWidth={2.8} {...props}>
    <path d="M12 20 4.5 12.5a4.2 4.2 0 0 1 6-6L12 8l1.5-1.5a4.2 4.2 0 0 1 6 6Z" />
  </Svg>
);

export const IconLink = (props: IconProps) => (
  <Svg size={16} strokeWidth={2.8} {...props}>
    <path d="M10 14 14 10M8.5 11.5 6 14a3.5 3.5 0 0 0 5 5l2.5-2.5M15.5 12.5 18 10a3.5 3.5 0 0 0-5-5l-2.5 2.5" />
  </Svg>
);
