"use client";

/**
 * «Su»: torna in cima, dopo due schermi di pagina (10/10). Le pagine lunghe del
 * sito lo chiedevano: Uscite e' alta 49.000 px sul computer e il doppio sul
 * telefono, Meccaniche 5.000, la griglia Eroi 12.000. Sul telefono sta sopra la
 * barra in basso. Con «riduci movimento» il salto e' immediato.
 */

import { useEffect, useState } from "react";
import { IconArrowUp } from "@/components/icons";
import { useLocale } from "@/lib/i18n/client";

export function BackToTop() {
  const label = useLocale() === "en" ? "Back to top" : "Torna su";
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!shown) return null;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
      }
      className="p5-cut fixed right-4 bottom-[calc(72px+env(safe-area-inset-bottom))] z-30 grid h-11 w-12 cursor-pointer place-items-center border-0 bg-ink text-paper shadow-[4px_4px_0_var(--color-brand)] hover:bg-brand hover:text-white lg:bottom-6"
    >
      <IconArrowUp size={20} />
    </button>
  );
}
