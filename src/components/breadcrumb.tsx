import Link from "next/link";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { cx } from "./ui";

const TESTI = testi({
  it: { percorso: "Percorso" },
  en: { percorso: "Breadcrumb" },
});

/**
 * Briciole di pane.
 *
 * Servono a due pubblici diversi allo stesso tempo:
 *  - a chi legge, per capire dove si trova e risalire di un livello;
 *  - ai motori di ricerca, tramite il BreadcrumbList in JSON-LD, che e' quello
 *    che fa comparire la gerarchia sotto il titolo nei risultati.
 *
 * Un semplice link "torna indietro" copre il primo caso e non il secondo, ed e'
 * il motivo per cui questo componente esiste al posto di quello.
 *
 * La lista visibile e quella strutturata sono generate dagli STESSI dati: non
 * possono divergere, che e' l'errore classico dei dati strutturati scritti a
 * mano.
 *
 * E' un componente server asincrono: legge la lingua dal cookie per l'etichetta
 * della navigazione. Lo usano solo pagine server.
 */

export interface Crumb {
  label: string;
  /** assente sull'ultimo elemento: la pagina corrente non e' un link */
  href?: string;
}

export async function Breadcrumb({
  items,
  className,
}: {
  items: readonly Crumb[];
  className?: string;
}) {
  if (items.length === 0) return null;

  const t = TESTI[await getLocale()];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <nav aria-label={t.percorso} className={cx("mb-4", className)}>
        {/* nel testo e non in monospaziato (10/10): sono nomi, non numeri; la barra
            obliqua rossa e' il taglio dei comandi del sito */}
        <ol className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 p-0 text-[13px] leading-snug text-ink-3">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="font-display font-black text-brand [font-variation-settings:'wdth'_80]">
                  /
                </span>
              ) : null}
              {item.href ? (
                <Link href={item.href} className="no-underline underline-offset-4 hover:text-ink hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-semibold text-ink-2">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        // «<» scritto come \u003c: i nomi arrivano anche dai titoli dei post, e un
        // titolo con «</script>» chiuderebbe lo script e farebbe eseguire quello
        // che segue (11/10)
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
