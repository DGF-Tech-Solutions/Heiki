import { eyebrow } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    inCorso: "Simulazione in corso",
    calcolo: "Calcolo della simulazione in corso",
  },
  en: {
    inCorso: "Simulation running",
    calcolo: "Running the simulation",
  },
});

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
export default async function Loading() {
  const t = TESTI[await getLocale()];

  return (
    <div className="pt-6 pb-20">
      <p className={eyebrow}>{t.inCorso}</p>
      <div className="mt-4 grid gap-2" aria-hidden>
        {[0, 1, 2].map((row) => (
          <span key={row} className="h-12 w-full animate-pulse rounded-card bg-paper-2" />
        ))}
      </div>
      <span className="sr-only">{t.calcolo}</span>
    </div>
  );
}
