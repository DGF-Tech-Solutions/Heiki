import { eyebrow } from "@/components/ui";

/**
 * Attesa del simulatore.
 *
 * Il simulatore gira migliaia di iterazioni: senza un segno, lo schermo
 * fermo sembra un blocco.
 *
 * Il confine di attesa sta QUI e non nella radice del sito. Un `loading.tsx`
 * nella radice avvolgerebbe anche il layout del gioco, e una volta iniziato lo
 * streaming lo stato 200 e' gia' partito: `notFound()` non potrebbe piu'
 * restituire 404, e un motore di ricerca indicizzerebbe le pagine inesistenti
 * come valide. Qui il layout ha gia' deciso, quindi lo stato e' salvo.
 */
export default function Loading() {
  return (
    <div className="pt-6 pb-20">
      <p className={eyebrow}>Simulazione in corso</p>
      <div className="mt-4 grid gap-2" aria-hidden>
        {[0, 1, 2].map((row) => (
          <span key={row} className="h-12 w-full animate-pulse rounded-card bg-paper-2" />
        ))}
      </div>
      <span className="sr-only">Calcolo della simulazione in corso</span>
    </div>
  );
}
