import Link from "next/link";
import { IconChevronRight } from "@/components/icons";
import { cx, eyebrow } from "@/components/ui";
import { patchAnchor, type HeroHistoryEntry } from "@/lib/games/changes";
import type { HeroEntry } from "@/lib/games/types";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { HeroChangeList } from "./hero-change-list";

/**
 * I cambiamenti di un eroe, nella scheda Info: le patch in cui e' arrivato o
 * cambiato, dalla piu' recente, ognuna col collegamento al suo blocco nella
 * pagina «Cambiamenti». Se non e' mai cambiato lo dice, con la data da cui
 * comincia l'archivio: «nessun cambiamento» senza la data farebbe credere che
 * non sia cambiato mai.
 */

const TESTI = testi({
  it: {
    titolo: "Cambiamenti",
    patchDel: (data: string) => `Patch del ${data}`,
    arrivato: "È arrivato con questa patch.",
    mai: (data: string) => `Nessun cambiamento da quando comincia l'archivio delle patch, il ${data}.`,
    tutti: "Tutti i cambiamenti",
  },
  en: {
    titolo: "Changes",
    patchDel: (data: string) => `Patch of ${data}`,
    arrivato: "Arrived with this patch.",
    mai: (data: string) => `No changes since the patch archive starts, on ${data}.`,
    tutti: "All changes",
  },
});

export function HeroChanges({
  game,
  locale,
  history,
  firstPatch,
  heroes,
}: {
  game: string;
  locale: Locale;
  history: readonly HeroHistoryEntry[];
  firstPatch: string;
  heroes: ReadonlyMap<string, HeroEntry>;
}) {
  const t = TESTI[locale];
  const format = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const day = (value: string) => format.format(new Date(`${value}T00:00:00Z`));

  return (
    <section className="mt-7 border-t border-rule-2 pt-5">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className={cx(eyebrow, "m-0")}>{t.titolo}</h3>
        <Link href={`/${game}/cambiamenti`} className="inline-flex items-center gap-1 text-[13px] text-ink-3 hover:text-brand-deep">
          {t.tutti}
          <IconChevronRight size={14} />
        </Link>
      </div>
      {history.length === 0 ? (
        <p className="m-0 text-sm text-ink-2">{t.mai(day(firstPatch))}</p>
      ) : (
        <ol className="m-0 grid list-none gap-5 p-0">
          {history.map((entry) => (
            <li key={entry.comparison.to}>
              <Link
                href={`/${game}/cambiamenti#${patchAnchor(entry.comparison)}`}
                className="mb-2 inline-block font-display text-[14px] font-extrabold uppercase tracking-[0.02em] text-ink hover:text-brand-deep [font-variation-settings:'wdth'_85]"
              >
                {t.patchDel(day(entry.comparison.to))}
              </Link>
              {entry.isNew ? <p className="m-0 mb-2 text-sm text-ink-2">{t.arrivato}</p> : null}
              {entry.changes.length > 0 || entry.touchups.length > 0 ? (
                <HeroChangeList
                  changes={entry.changes}
                  touchups={entry.touchups}
                  game={game}
                  locale={locale}
                  heroes={heroes}
                />
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
