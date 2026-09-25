import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { DistributionChart } from "@/components/distribution-chart";
import { cx, display, Empty, eyebrow, Notice, Stat, StatGrid, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { localName, REFERENCE_LEVEL, simulateTeam } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Simulatore di squadra.
 *
 * La selezione vive nell'indirizzo, non in uno stato del browser: cosi' una
 * squadra si condivide incollando il link, e chi lo apre vede esattamente gli
 * stessi numeri. E' la stessa ragione per cui il motore e' seedato.
 *
 * E' l'abbozzo del calcolatore vero: quando arrivera' il costruttore di
 * rotazioni prendera' il posto di questa pagina, ma il contratto non cambia.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Simulatore squadra — ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Componi una squadra di ${gioco} e vedi quanto danno fa, in quanti turni e con che probabilità.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    strumenti: "Strumenti",
    simulatoreSquadra: "Simulatore squadra",
    introduzione:
      "Scegli i personaggi e il bersaglio. La squadra finisce nell'indirizzo, quindi puoi condividere il link e chi lo apre vede gli stessi numeri.",
    avvisoPrima: "Dati dei personaggi",
    avvisoEvidenza: "segnaposto",
    avvisoDopo:
      ". Il costruttore di rotazioni — dove scegli l'ordine delle azioni invece di lasciarlo alla priorità automatica — arriva dopo.",
    squadra: "Squadra",
    svuota: "Svuota la squadra",
    bersaglio: "Bersaglio",
    scegli: "Scegli almeno un personaggio per calcolare.",
    dannoMediano: "Danno mediano",
    noveSuDieci: "Nove su dieci",
    turniAlKo: "Turni al KO",
    turni: "turni",
    mai: "mai",
    riuscita: "Riuscita",
    tentativi: (quanti: string, livello: number) => `${quanti} tentativi · livello ${livello}`,
    squadraElenco: "Squadra:",
  },
  en: {
    titoloPagina: (gioco: string) => `Team simulator — ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Build a ${gioco} team and see how much damage it deals, in how many turns and how reliably.`,
    gioco: "game",
    questoGioco: "this game",
    strumenti: "Tools",
    simulatoreSquadra: "Team simulator",
    introduzione:
      "Pick the characters and the target. The team is saved in the address, so you can share the link and whoever opens it sees the same numbers.",
    avvisoPrima: "Character data is a",
    avvisoEvidenza: "placeholder",
    avvisoDopo:
      ". The rotation builder — where you choose the order of actions instead of leaving it to automatic priority — comes later.",
    squadra: "Team",
    svuota: "Clear the team",
    bersaglio: "Target",
    scegli: "Pick at least one character to calculate.",
    dannoMediano: "Median damage",
    noveSuDieci: "Nine in ten",
    turniAlKo: "Turns to KO",
    turni: "turns",
    mai: "never",
    riuscita: "Success rate",
    tentativi: (quanti: string, livello: number) => `${quanti} attempts · level ${livello}`,
    squadraElenco: "Team:",
  },
});

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ squadra?: string; bersaglio?: string }>;
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

export default async function ToolsPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { squadra, bersaglio } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const numbers = intlLocale(locale);

  const gameModule = requireGameModule(game);
  const valid = new Set(gameModule.characters.map((character) => character.id));

  const selected = (squadra ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => valid.has(id));

  const target = gameModule.targets.find((item) => item.id === bersaglio) ?? gameModule.targets[0];
  const result = selected.length > 0 ? simulateTeam(gameModule, selected, target?.id) : null;
  const unit = gameModule.timeUnit === "turns" ? t.turni : "s";

  const teamLink = (ids: readonly string[], targetId?: string) => {
    const search = new URLSearchParams();
    if (ids.length > 0) search.set("squadra", ids.join(","));
    if (targetId && targetId !== gameModule.targets[0]?.id) search.set("bersaglio", targetId);
    const suffix = search.toString();
    return suffix ? `/${game}/strumenti?${suffix}` : `/${game}/strumenti`;
  };

  return (
    <>
      <main className="pt-6 pb-20">
        <Breadcrumb
          items={[{ label: entry.shortName, href: `/${game}` }, { label: t.strumenti }]}
        />

        <header className="mb-5 border-b border-rule pb-5">
          <p className={eyebrow}>{entry.shortName}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>
            {t.simulatoreSquadra}
          </h1>
          <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">{t.introduzione}</p>
        </header>

        <Notice className="mb-5">
          <span>
            {t.avvisoPrima} <strong>{t.avvisoEvidenza}</strong>
            {t.avvisoDopo}
          </span>
        </Notice>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="grid gap-4">
            <section className="rounded-card border border-rule bg-paper p-4">
              <h2 className={cx(display, "mb-3 text-[15px] [font-variation-settings:'wdth'_92]")}>
                {t.squadra}
              </h2>

              <ul className="m-0 grid list-none gap-1.5 p-0">
                {gameModule.characters.map((character) => {
                  const active = selected.includes(character.id);
                  const next = active
                    ? selected.filter((id) => id !== character.id)
                    : [...selected, character.id];

                  return (
                    <li key={character.id}>
                      <Link
                        href={teamLink(next, target?.id)}
                        aria-pressed={active}
                        className={cx(
                          "flex items-center gap-2.5 rounded-card border px-3 py-2 text-sm transition-colors",
                          active
                            ? "border-brand bg-brand-soft font-medium"
                            : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                        )}
                      >
                        <span
                          className={cx(
                            "grid size-4 place-items-center rounded-sm border text-[9px]",
                            active ? "border-brand bg-brand text-white" : "border-rule",
                          )}
                          aria-hidden
                        >
                          {active ? "✓" : ""}
                        </span>
                        <span className="flex-1">{character.name}</span>
                        <Tag>{character.role}</Tag>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {selected.length > 0 ? (
                <Link
                  href={teamLink([], target?.id)}
                  className="mt-3 inline-block text-xs text-ink-3 hover:text-ink"
                >
                  {t.svuota}
                </Link>
              ) : null}
            </section>

            <section className="rounded-card border border-rule bg-paper p-4">
              <h2 className={cx(display, "mb-3 text-[15px] [font-variation-settings:'wdth'_92]")}>
                {t.bersaglio}
              </h2>
              <ul className="m-0 grid list-none gap-1.5 p-0">
                {gameModule.targets.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={teamLink(selected, item.id)}
                      className={cx(
                        "flex items-baseline justify-between gap-2 rounded-card border px-3 py-2 text-sm transition-colors",
                        item.id === target?.id
                          ? "border-brand bg-brand-soft font-medium"
                          : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                      )}
                    >
                      <span>{localName(item, locale)}</span>
                      <span className="font-mono text-[10px] text-ink-3">
                        lv {item.level} · {Math.round(item.maxHp / 1000)}k HP
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="min-w-0">
            {result === null ? (
              <Empty>{t.scegli}</Empty>
            ) : (
              <div className="grid gap-5">
                <StatGrid>
                  <Stat
                    label={t.dannoMediano}
                    value={Math.round(result.damage.median).toLocaleString(numbers)}
                  />
                  <Stat
                    label={t.noveSuDieci}
                    small
                    value={`${Math.round(result.damage.p10).toLocaleString(numbers)} – ${Math.round(
                      result.damage.p90,
                    ).toLocaleString(numbers)}`}
                  />
                  <Stat
                    label={t.turniAlKo}
                    value={result.timeToKill === null ? "—" : result.timeToKill.median}
                    unit={result.timeToKill === null ? t.mai : unit}
                  />
                  <Stat label={t.riuscita} value={Math.round(result.killRate * 100)} unit="%" />
                </StatGrid>

                <DistributionChart
                  histogram={result.damageHistogram}
                  stats={result.damage}
                  title={t.tentativi(result.iterations.toLocaleString(numbers), REFERENCE_LEVEL)}
                  caption={`seed ${result.seed}`}
                />

                <p className="text-[13px] text-ink-3">
                  {t.squadraElenco}{" "}
                  {selected
                    .map((id) => gameModule.characters.find((c) => c.id === id)?.name ?? id)
                    .join(" · ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
