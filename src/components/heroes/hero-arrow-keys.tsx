"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { rememberHero } from "@/components/quick-search";

/**
 * Le frecce della tastiera nella scheda eroe: ← l'eroe prima, → quello dopo,
 * e la scheda fra gli eroi aperti di recente (ricerca rapida). Frecce:
 * nell'ordine della griglia (10/10, per chi scorre gli eroi uno dopo l'altro).
 * Non mentre si scrive, e non con un modificatore (Alt+← e' «indietro» del
 * browser).
 */
export function HeroArrowKeys({
  game,
  heroId,
  prev,
  next,
}: {
  game: string;
  heroId: string;
  prev: string | null;
  next: string | null;
}) {
  const router = useRouter();
  // la scheda aperta va fra i recenti della ricerca rapida
  useEffect(() => rememberHero(game, heroId), [game, heroId]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true], [popover]:popover-open")) return;
      const href = event.key === "ArrowLeft" ? prev : event.key === "ArrowRight" ? next : null;
      if (!href) return;
      event.preventDefault();
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);
  return null;
}
