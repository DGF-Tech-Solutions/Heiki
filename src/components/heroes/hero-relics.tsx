/**
 * La scheda «Reliquia» della pagina di un eroe: la Reliquia sacra, con effetto,
 * statistiche dei potenziamenti e materiali.
 *
 * In un file suo dal 26/09, quando la pagina e' passata alle schede.
 */

import Link from "next/link";
import { GameText } from "@/components/heroes/game-text";
import { PassiveConditions, PassiveText } from "@/components/heroes/hero-abilities";
import type { TermIds } from "@/components/heroes/hero-terms";
import { cx, eyebrow, numeric } from "@/components/ui";
import { gameItemSrc, heroRelicSrc } from "@/lib/games/heroes";
import type { HeroLabel, HeroRelic, HeroRelicAmount, HeroRelicsIndex } from "@/lib/games/types";
import { inLingua, intlLocale, testi, type Bilingual, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    reliquiaTitolo: (quante: number) => (quante > 1 ? `Reliquie sacre · ${quante}` : "Reliquia sacra"),
    dueReliquie:
      "Un eroe con due reliquie ne attiva una alla volta, e i loro effetti non si sommano. Nelle statistiche conta la prima.",
    bestia: "Battaglia Bestia demoniaca:",
    effettoReliquia: "Effetto Reliquia sacra",
    statistica: "Statistica",
    base: "Base",
    potenziamento: (n: number) => `Potenziamento ${n}`,
    totale: "Totale",
    materiali: "Materiali",
    creazione: "Creazione",
    fonteReliquia:
      "Nome, effetto, statistiche, potenziamenti e materiali vengono dalle tabelle del client: la reliquia è un costume d’arma con una passiva sua.",
  },
  en: {
    reliquiaTitolo: (quante: number) => (quante > 1 ? `Holy Relics · ${quante}` : "Holy Relic"),
    dueReliquie:
      "A hero with two relics activates one at a time, and their effects don't stack. The stats count the first one.",
    bestia: "Demonic Beast Battle:",
    effettoReliquia: "Holy Relic Effect",
    statistica: "Stat",
    base: "Base",
    potenziamento: (n: number) => `Enhancement ${n}`,
    totale: "Total",
    materiali: "Materials",
    creazione: "Crafting",
    fonteReliquia:
      "Name, effect, stats, enhancements and materials come from the client's tables: the relic is a weapon costume with a passive of its own.",
  },
});

/**
 * `useGrouping: "always"` e non il default.
 *
 * In italiano il raggruppamento automatico salta i numeri di quattro cifre:
 * nella stessa colonna uscivano `7412` e `10.002`, e due migliaia scritte in
 * due modi diversi si leggono come due unita' di misura diverse.
 */
const numero = (n: number, locale: Locale) =>
  n.toLocaleString(intlLocale(locale), { useGrouping: "always" });

const RELIC_STATS: readonly { key: string; label: Bilingual }[] = [
  { key: "atk", label: { it: "Attacco", en: "Attack" } },
  { key: "def", label: { it: "Difesa", en: "Defense" } },
  { key: "hp", label: { it: "Salute", en: "HP" } },
];

/**
 * Le Reliquie sacre dell'eroe.
 *
 * Una sola quasi sempre; due per Freyja (1929501 e 1929502), che ha la
 * classica e quella di Surtr. Il gioco ne attiva una alla volta e gli effetti
 * non si sommano (l'ha chiarito l'utente il 25/09): la pagina lo dice, e nelle
 * statistiche conta la prima, la classica.
 */
export function Relics({
  game,
  locale,
  relics,
  index,
  conditions,
  icons,
  beastPages,
  termIds,
}: {
  game: string;
  locale: Locale;
  relics: readonly { id: string; relic: HeroRelic }[];
  index: HeroRelicsIndex | undefined;
  conditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  beastPages: Readonly<Record<string, string>>;
  /** le tendine delle parole blu dell'effetto (hero-terms.tsx) */
  termIds?: TermIds;
}) {
  if (relics.length === 0) return null;
  const t = TESTI[locale];

  return (
    <section>
      <h2 className={cx(eyebrow, "mb-2.5")}>{t.reliquiaTitolo(relics.length)}</h2>
      {relics.length > 1 ? <p className="m-0 mb-2.5 text-[13px] text-ink-3">{t.dueReliquie}</p> : null}
      <ul className="m-0 grid list-none gap-3 p-0">
        {relics.map(({ id, relic }) => (
          <li key={id}>
            <RelicCard
              game={game}
              locale={locale}
              id={id}
              relic={relic}
              index={index}
              conditions={conditions}
              icons={icons}
              beastPages={beastPages}
              termIds={termIds}
            />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-ink-3">{t.fonteReliquia}</p>
    </section>
  );
}

/**
 * Una reliquia: immagine, nome, bestia, descrizione, effetto, statistiche coi
 * tre potenziamenti, e i materiali per crearla e potenziarla.
 *
 * L'immagine e' l'icona grande del gioco (<arma>_c, 256px): DB_item_info da'
 * la piccola (<arma>_s), la grande sta accanto con lo stesso disegno, per 180
 * reliquie su 180.
 */
function RelicCard({
  game,
  locale,
  id,
  relic,
  index,
  conditions,
  icons,
  beastPages,
  termIds,
}: {
  game: string;
  locale: Locale;
  id: string;
  relic: HeroRelic;
  index: HeroRelicsIndex | undefined;
  conditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  /** gruppo della bestia -> la chiave della sua pagina: /<gioco>/bestie-demoniache/<chiave> */
  beastPages: Readonly<Record<string, string>>;
  termIds?: TermIds;
}) {
  const t = TESTI[locale];
  const name = inLingua(relic.name, locale);
  const description = inLingua(relic.description, locale);
  const beasts = relic.beasts.flatMap((beast) => {
    const label = inLingua(index?.beasts[beast], locale);
    return label ? [{ label, page: beastPages[beast] }] : [];
  });
  const passiveName = relic.passive ? inLingua(relic.passive.name, locale) : null;
  const passiveText = relic.passive ? inLingua(relic.passive.text, locale) : null;
  const rows = RELIC_STATS.filter(
    (row) => relic.stats[row.key] !== undefined || relic.upgrades.some((u) => u.stats[row.key]),
  );
  const total = (key: string) =>
    (relic.stats[key] ?? 0) + relic.upgrades.reduce((sum, u) => sum + (u.stats[key] ?? 0), 0);
  const cell = cx(numeric, "py-1.5 pl-2.5 text-right");

  return (
    <div
      className={cx(
        "grid items-start gap-4 rounded-card border border-rule bg-paper-2 p-4",
        relic.image && "sm:grid-cols-[88px_minmax(0,1fr)]",
      )}
    >
      {relic.image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={heroRelicSrc(game, id)}
          alt=""
          width={256}
          height={256}
          loading="lazy"
          className="block h-[88px] w-[88px] rounded-card border border-rule bg-paper"
        />
      ) : null}

      <div className="min-w-0">
        {name ? <GameText text={name} className="m-0 font-semibold [&>p]:m-0" /> : null}
        {beasts.length > 0 ? (
          <p className="m-0 mt-0.5 text-[12px] text-ink-3">
            {t.bestia}{" "}
            {beasts.map((beast, position) => (
              <span key={beast.label}>
                {position > 0 ? ", " : null}
                {/* la bestia porta alla sua pagina, dove si vedono piani, drop e le altre reliquie */}
                {beast.page ? (
                  <Link href={`/${game}/bestie-demoniache/${beast.page}`} className="text-ink-2 hover:text-brand">
                    {beast.label}
                  </Link>
                ) : (
                  beast.label
                )}
              </span>
            ))}
          </p>
        ) : null}
        {description ? (
          <GameText text={description} className="mt-2 text-sm leading-relaxed text-ink-2" />
        ) : null}

        {relic.passive && passiveText ? (
          <div className="mt-3 border-t border-rule pt-3">
            <p className={cx(eyebrow, "m-0 mb-1.5")}>
              {t.effettoReliquia}
              {passiveName && passiveName !== name ? ` · ${passiveName}` : ""}
            </p>
            <PassiveConditions
              game={game}
              locale={locale}
              codes={relic.passive.conditions}
              conditions={conditions}
              icons={icons}
            />
            <PassiveText
              game={game}
              locale={locale}
              text={passiveText}
              icons={icons}
              terms={relic.passive.text.en ? [termIds?.(relic.passive.text.en, passiveText)] : undefined}
            />
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className="mt-3 overflow-x-auto border-t border-rule pt-2">
            <table className="w-full max-w-[460px] border-collapse text-[13px]">
              <thead>
                <tr className="text-[11px] text-ink-3">
                  <th className="py-1 pr-2.5 text-left font-normal">
                    <span className="sr-only">{t.statistica}</span>
                  </th>
                  <th className="py-1 pl-2.5 text-right font-normal">{t.base}</th>
                  {relic.upgrades.map((_, i) => (
                    <th key={i} className="py-1 pl-2.5 text-right font-normal" title={t.potenziamento(i + 1)}>
                      <span aria-hidden>+{i + 1}</span>
                      <span className="sr-only">{t.potenziamento(i + 1)}</span>
                    </th>
                  ))}
                  {relic.upgrades.length > 0 ? (
                    <th className="py-1 pl-2.5 text-right font-normal">{t.totale}</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-t border-rule/60">
                    <td className="py-1.5 pr-2.5 text-ink-2">{row.label[locale]}</td>
                    <td className={cell}>{numero(relic.stats[row.key] ?? 0, locale)}</td>
                    {relic.upgrades.map((u, i) => (
                      <td key={i} className={cx(cell, "text-ink-3")}>
                        {u.stats[row.key] ? `+${numero(u.stats[row.key]!, locale)}` : "—"}
                      </td>
                    ))}
                    {relic.upgrades.length > 0 ? (
                      <td className={cx(cell, "font-medium")}>{numero(total(row.key), locale)}</td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {relic.materials.length > 0 || relic.upgrades.some((u) => u.materials.length > 0) ? (
          <div className="mt-3 border-t border-rule pt-3">
            <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.materiali}</p>
            <dl className="m-0 grid gap-2 text-[12px]">
              <Materials
                game={game}
                locale={locale}
                label={t.creazione}
                amounts={[...relic.materials, ...(relic.cost ? [relic.cost] : [])]}
                index={index}
              />
              {relic.upgrades.map((u, i) => (
                <Materials
                  key={i}
                  game={game}
                  locale={locale}
                  label={t.potenziamento(i + 1)}
                  amounts={[...u.materials, ...(u.cost ? [u.cost] : [])]}
                  index={index}
                />
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Una riga di materiali: icona e quantita', col nome dell'oggetto al passaggio e per i lettori di schermo. */
function Materials({
  game,
  locale,
  label,
  amounts,
  index,
}: {
  game: string;
  locale: Locale;
  label: string;
  amounts: readonly HeroRelicAmount[];
  index: HeroRelicsIndex | undefined;
}) {
  if (amounts.length === 0) return null;

  return (
    <div className="grid gap-1 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center">
      <dt className="text-ink-3">{label}</dt>
      <dd className="m-0 flex flex-wrap gap-x-3 gap-y-1">
        {amounts.map((amount) => {
          const item = index?.items[amount.id];
          const itemName = inLingua(item?.name, locale) ?? amount.id;
          return (
            <span key={amount.id} className="inline-flex items-center gap-1" title={itemName}>
              {item?.icon ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={gameItemSrc(game, amount.id)}
                  alt=""
                  width={128}
                  height={128}
                  loading="lazy"
                  className="h-6 w-6 object-contain"
                />
              ) : null}
              <span className={item?.icon ? "sr-only" : "text-ink-2"}>{itemName}</span>
              <span className={cx(numeric, "text-ink-2")}>×{numero(amount.count, locale)}</span>
            </span>
          );
        })}
      </dd>
    </div>
  );
}
