import Link from "next/link";
import { cx } from "./ui";

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
 */

export interface Crumb {
  label: string;
  /** assente sull'ultimo elemento: la pagina corrente non e' un link */
  href?: string;
}

export function Breadcrumb({ items, className }: { items: readonly Crumb[]; className?: string }) {
  if (items.length === 0) return null;

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
      <nav aria-label="Percorso" className={cx("mb-4", className)}>
        <ol className="m-0 flex flex-wrap items-center gap-1.5 p-0 font-mono text-[11px] text-ink-3">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {item.href ? (
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink-2">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
