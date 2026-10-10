"use client";

/**
 * Le schede di una sezione fatta di poche pagine sorelle (i documenti legali,
 * le impostazioni): la lama dei filtri, bianca sulla pagina in cui sei.
 *
 * Componente client solo per sapere l'indirizzo: i gusci di quelle pagine sono
 * del server e non lo conoscono, e fino al 10/10 le schede non dicevano dove si
 * era (tre o due collegamenti tutti uguali).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chipClass } from "@/components/ui";

export function SectionTabs({
  label,
  tabs,
  className,
}: {
  label: string;
  tabs: readonly { href: string; label: string }[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={className ?? "flex flex-wrap gap-1.5"}>
      {tabs.map((tab) => {
        const current = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} aria-current={current ? "page" : undefined} className={chipClass(current, true)}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
