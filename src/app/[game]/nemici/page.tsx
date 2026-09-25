import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, Empty, eyebrow, numeric, Stat, StatGrid, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { localName, REFERENCE_LEVEL, simulateTeam } from "@/lib/games/preview";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Nemici.
 *
 * Completa il gruppo Database, e non e' riempitivo: sono i bersagli contro cui
 * girano tutti i calcoli del sito. Chi legge una classifica ha il diritto di
 * sapere contro cosa e' stata misurata - altrimenti il numero non significa
 * niente.
 *
 * Per ogni bersaglio si mostra anche quanto ci mette il roster intero: e' il
 * modo piu' diretto per capire quanto e' duro.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Nemici di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Bersagli usati nei calcoli di ${gioco}: punti vita, difesa, resistenze.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    nemici: "Nemici",
    introduzione: (quanti: number) =>
      `${quanti} bersagli. Sono quelli contro cui girano le simulazioni del sito: la classifica e le schede personaggio misurano contro questi.`,
    nessunBersaglio: "Nessun bersaglio nel dataset.",
    livello: (livello: number) => `livello ${livello}`,
    puntiVita: "Punti vita",
    difesa: "Difesa",
    rosterIntero: "Roster intero: KO in",
    turni: "turni",
    mai: "mai",
    riuscita: "Riuscita",
    classificaBersaglio: "Classifica su questo bersaglio →",
    provaSquadra: "Provaci una squadra",
    nota: (personaggi: number, livello: number) =>
      `I tempi indicati usano tutti i ${personaggi} personaggi del dataset al livello ${livello}, con la priorità automatica delle azioni.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Enemies · GachaZone`,
    descrizione: (gioco: string) => `Targets used in ${gioco} calculations: HP, defense, resistances.`,
    gioco: "game",
    questoGioco: "this game",
    nemici: "Enemies",
    introduzione: (quanti: number) =>
      `${quanti} ${quanti === 1 ? "target" : "targets"}. These are what the site's simulations run against: the ranking and the character pages are measured against them.`,
    nessunBersaglio: "No targets in the dataset.",
    livello: (livello: number) => `level ${livello}`,
    puntiVita: "HP",
    difesa: "Defense",
    rosterIntero: "Full roster: KO in",
    turni: "turns",
    mai: "never",
    riuscita: "Success rate",
    classificaBersaglio: "Ranking against this target →",
    provaSquadra: "Try a team against it",
    nota: (personaggi: number, livello: number) =>
      `The times shown use all ${personaggi} characters in the dataset at level ${livello}, with automatic action priority.`,
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina(entry?.shortName ?? t.gioco),
    description: t.descrizione(entry?.name ?? t.questoGioco),
  };
}

export default async function EnemiesPage({ params }: Props) {
  const { game } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const numbers = intlLocale(locale);

  const gameModule = requireGameModule(game);
  const roster = gameModule.characters.map((character) => character.id);
  const unit = gameModule.timeUnit === "turns" ? t.turni : "s";

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.nemici }]} />

      <header className="mb-5 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.nemici}</h1>
        <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">
          {t.introduzione(gameModule.targets.length)}
        </p>
      </header>

      {gameModule.targets.length === 0 ? (
        <Empty>{t.nessunBersaglio}</Empty>
      ) : (
        <div className="grid gap-4">
          {gameModule.targets.map((target) => {
            const result = simulateTeam(gameModule, roster, target.id);
            const resistances = Object.entries(target.resistances);

            return (
              <article key={target.id} className="rounded-card border border-rule bg-paper p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2.5">
                  <h2 className={cx(display, "text-lg [font-variation-settings:'wdth'_92]")}>
                    {localName(target, locale)}
                  </h2>
                  <span className="flex flex-wrap gap-2">
                    <Tag>{t.livello(target.level)}</Tag>
                    {target.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </span>
                </div>

                <StatGrid className="mt-4">
                  <Stat label={t.puntiVita} value={target.maxHp.toLocaleString(numbers)} />
                  <Stat label={t.difesa} value={target.defense.toLocaleString(numbers)} />
                  <Stat
                    label={t.rosterIntero}
                    value={result?.timeToKill === null || !result ? "—" : result.timeToKill.median}
                    unit={result?.timeToKill ? unit : t.mai}
                  />
                  <Stat
                    label={t.riuscita}
                    value={result ? Math.round(result.killRate * 100) : "—"}
                    unit={result ? "%" : undefined}
                  />
                </StatGrid>

                {resistances.length > 0 ? (
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
                    {resistances.map(([kind, value]) => (
                      <div key={kind} className="flex items-baseline gap-2">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                          {kind}
                        </dt>
                        <dd className={cx(numeric, "m-0 text-[13px]")}>
                          {(value * 100).toFixed(0)}%
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2.5 border-t border-rule-2 pt-3.5">
                  <Link
                    href={`/${game}/classifica?bersaglio=${target.id}`}
                    className="text-[13px] font-semibold text-brand hover:underline"
                  >
                    {t.classificaBersaglio}
                  </Link>
                  <Link
                    href={`/${game}/strumenti?bersaglio=${target.id}`}
                    className="text-[13px] text-ink-2 hover:text-brand"
                  >
                    {t.provaSquadra}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-[13px] text-ink-3">{t.nota(roster.length, REFERENCE_LEVEL)}</p>
    </main>
  );
}
