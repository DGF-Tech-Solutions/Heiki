"use client";

/**
 * Il calcolatore delle statistiche, solo nel browser.
 *
 * Sta nella scheda Statistiche, che all'apertura della pagina e' nascosta (si
 * apre su Abilita'): disegnato dal server erano 120-135 KB di HTML e 1.200
 * elementi da idratare in ogni scheda eroe, per un pannello che quasi nessuno
 * vede subito (misurato l'11/10). E i suoi numeri dipendono comunque dalla
 * configurazione salvata nel browser. Il posto resta della sua altezza, cosi'
 * chi apre la pagina direttamente su `?scheda=statistiche` non vede saltare niente.
 */

import dynamic from "next/dynamic";

export const StatCalculatorLazy = dynamic(() => import("./stat-calculator").then((m) => m.StatCalculator), {
  ssr: false,
  loading: () => <div aria-busy="true" className="min-h-[640px]" />,
});
