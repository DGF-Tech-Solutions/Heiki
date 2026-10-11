"use client";

/**
 * L'Unica segue il rango scelto sulla carta dell'ultimate.
 *
 * Dall'11/10 l'Unica ha pulsanti suoi, uno per ogni rango dell'ultimate in cui il
 * suo testo cambia (richiesta dell'utente): sono radio, e senza JavaScript
 * funzionano da soli. Prima il legame era solo CSS (la passiva guardava i radio
 * dell'ultimate), e con due gruppi di radio il CSS non sa quale e' stato toccato
 * per ultimo: per questo il legame passa da qui. Scegliendo un rango
 * sull'ultimate, si accende la versione dell'Unica che vale a quel rango;
 * scegliendo sull'Unica, l'ultimate non si muove.
 *
 * Ogni radio dell'Unica dice in `data-ranks` i ranghi in cui vale la sua
 * versione; quelli dell'ultimate portano la classe `ult<N>` (hero-abilities.tsx).
 */

import { useEffect, useRef } from "react";

export function FollowUltimate({ group }: { group: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const scope = ref.current?.closest("article") ?? document;
    const onChange = (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
      const rank = /(?:^|\s)ult(\d)(?:\s|$)/.exec(input.className)?.[1];
      if (!rank) return;
      const target = scope.querySelector<HTMLInputElement>(`input[name="${group}"][data-ranks~="${rank}"]`);
      if (target) target.checked = true;
    };
    scope.addEventListener("change", onChange);
    return () => scope.removeEventListener("change", onChange);
  }, [group]);

  return <span ref={ref} hidden />;
}
