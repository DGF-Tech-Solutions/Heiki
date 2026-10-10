/**
 * L'intestazione comune alle sottosezioni di «Indovina l'eroe»: le briciole, il
 * titolo, e le schede delle modalita' (Classico, Carta, Unica, Testo), come i
 * pulsanti delle modalita' in cima a Loldle. Componente del server: le schede
 * sono collegamenti, ogni modalita' e' una pagina sua.
 *
 * Dal 10/10 la testata e' quella di tutte le pagine (PageHeader, senza
 * l'etichetta del gioco sopra il titolo) e le schede hanno la lama dei filtri.
 */

import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { chipClass, PageHeader } from "@/components/ui";
import { GUESS_VARIANTS, VARIANT_LABELS, type GuessVariant } from "@/lib/games/hero-guess";
import type { Locale } from "@/lib/i18n/locale";

const TITLE = { it: "Indovina l'eroe", en: "Guess the Hero" } as const;
const TABS_LABEL = { it: "Modalità", en: "Modes" } as const;

export function guessTitle(locale: Locale): string {
  return TITLE[locale];
}

export function guessPath(game: string, variant: GuessVariant): string {
  return variant === "classico" ? `/${game}/indovina` : `/${game}/indovina/${variant}`;
}

export function GuessHeader({
  game,
  shortName,
  variant,
  intro,
  locale,
}: {
  game: string;
  shortName: string;
  variant: GuessVariant;
  intro: string;
  locale: Locale;
}) {
  const crumbs =
    variant === "classico"
      ? [{ label: shortName, href: `/${game}` }, { label: TITLE[locale] }]
      : [
          { label: shortName, href: `/${game}` },
          { label: TITLE[locale], href: guessPath(game, "classico") },
          { label: VARIANT_LABELS[variant][locale] },
        ];
  return (
    <>
      <Breadcrumb items={crumbs} />
      <PageHeader title={TITLE[locale]}>
        <p>{intro}</p>
      </PageHeader>
      {/* quieta e non rossa: una modalita' c'e' sempre, non restringe niente */}
      <nav aria-label={TABS_LABEL[locale]} className="mb-5 flex flex-wrap gap-1.5">
        {GUESS_VARIANTS.map((tab) => (
          <Link
            key={tab}
            href={guessPath(game, tab)}
            aria-current={tab === variant ? "page" : undefined}
            className={chipClass(tab === variant, true, "px-4")}
          >
            {VARIANT_LABELS[tab][locale]}
          </Link>
        ))}
      </nav>
    </>
  );
}
