/**
 * L'intestazione comune alle sottosezioni di «Indovina l'eroe»: le briciole, il
 * titolo, e le schede delle modalita' (Classico, Carta, Unica, Testo), come i
 * pulsanti delle modalita' in cima a Loldle. Componente del server: le schede
 * sono collegamenti, ogni modalita' e' una pagina sua.
 */

import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, eyebrow } from "@/components/ui";
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
      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>{shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{TITLE[locale]}</h1>
        <nav aria-label={TABS_LABEL[locale]} className="mt-4 flex flex-wrap gap-1.5">
          {GUESS_VARIANTS.map((tab) => (
            <Link
              key={tab}
              href={guessPath(game, tab)}
              aria-current={tab === variant ? "page" : undefined}
              className={cx(
                "grid h-9 place-items-center rounded-[3px] border px-4 text-[14px]",
                tab === variant
                  ? "border-brand bg-brand-soft font-semibold text-ink"
                  : "border-rule text-ink-3 hover:border-ink-3 hover:text-ink",
              )}
            >
              {VARIANT_LABELS[tab][locale]}
            </Link>
          ))}
        </nav>
        <p className="mt-3 max-w-[68ch] text-sm text-ink-2">{intro}</p>
      </header>
    </>
  );
}
