import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, eyebrow, Notice, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { localName, rankCharacters, REFERENCE_LEVEL } from "@/lib/games/preview";
import { requireGameModule } from "@/lib/games/registry";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Classifica per danno simulato.
 *
 * Non e' una tier list di opinioni. Ogni personaggio gira contro lo stesso
 * bersaglio, allo stesso livello, con lo stesso seed e lo stesso numero di
 * iterazioni: cambia solo il personaggio. I presupposti sono dichiarati in cima,
 * cosi' si puo' discutere di quelli invece che dei gusti di chi ha compilato
 * l'elenco.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Classifica danno — ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Personaggi di ${gioco} ordinati per danno mediano simulato, a parità di condizioni.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    classifica: "Classifica",
    classificaDanno: "Classifica danno",
    introduzione: (simulazioni: string, livello: number) =>
      `Ordinata per danno mediano su ${simulazioni} simulazioni. Stesso livello (${livello}), stesso bersaglio, stesso seed per tutti: cambia solo il personaggio.`,
    avvisoPrima: "Questi numeri escono da",
    avvisoEvidenza: "dati segnaposto",
    avvisoDopo:
      ": il motore è corretto, i valori dei personaggi no. Servono a mostrare come funziona la classifica, non a decidere chi potenziare.",
    bersaglio: "Bersaglio",
    turni: "turni",
    nessunKo: "nessun KO",
  },
  en: {
    titoloPagina: (gioco: string) => `Damage ranking — ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco} characters ranked by simulated median damage, under the same conditions.`,
    gioco: "game",
    questoGioco: "this game",
    classifica: "Ranking",
    classificaDanno: "Damage ranking",
    introduzione: (simulazioni: string, livello: number) =>
      `Ranked by median damage over ${simulazioni} simulations. Same level (${livello}), same target, same seed for everyone: only the character changes.`,
    avvisoPrima: "These numbers come from",
    avvisoEvidenza: "placeholder data",
    avvisoDopo:
      ": the engine is correct, the character values are not. They show how the ranking works, not who to invest in.",
    bersaglio: "Target",
    turni: "turns",
    nessunKo: "no KO",
  },
});

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ bersaglio?: string }>;
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

export default async function RankingPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { bersaglio } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const numbers = intlLocale(locale);

  const gameModule = requireGameModule(game);
  const target =
    gameModule.targets.find((item) => item.id === bersaglio) ?? gameModule.targets[0];
  const ranked = rankCharacters(gameModule, target?.id);
  const best = ranked[0]?.result.damage.median ?? 1;
  const unit = gameModule.timeUnit === "turns" ? t.turni : "s";

  return (
    <>
      <main className="pt-6 pb-20">
        <Breadcrumb
          items={[{ label: entry.shortName, href: `/${game}` }, { label: t.classifica }]}
        />

        <header className="mb-5 border-b border-rule pb-5">
          <p className={eyebrow}>{entry.shortName}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.classificaDanno}</h1>
          <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">
            {t.introduzione(
              ranked[0]?.result.iterations.toLocaleString(numbers) ?? "0",
              REFERENCE_LEVEL,
            )}
          </p>
        </header>

        <Notice className="mb-5">
          <span>
            {t.avvisoPrima} <strong>{t.avvisoEvidenza}</strong>
            {t.avvisoDopo}
          </span>
        </Notice>

        {gameModule.targets.length > 1 ? (
          <nav className="mb-4 flex flex-wrap items-center gap-2" aria-label={t.bersaglio}>
            <span className={cx(eyebrow, "mr-1")}>{t.bersaglio}</span>
            {gameModule.targets.map((item) => (
              <Link
                key={item.id}
                href={`/${game}/classifica?bersaglio=${item.id}`}
                className={cx(
                  "inline-flex h-8 items-center rounded-card border px-3 text-[13px] transition-colors",
                  item.id === target?.id
                    ? "border-brand bg-brand-soft font-medium text-ink"
                    : "border-rule text-ink-2 hover:border-ink-3 hover:text-ink",
                )}
              >
                {localName(item, locale)}
              </Link>
            ))}
          </nav>
        ) : null}

        <ol className="m-0 grid list-none gap-2 p-0">
          {ranked.map((row, index) => {
            const share = Math.max(4, Math.round((row.result.damage.median / best) * 100));
            return (
              <li
                key={row.character.id}
                className="relative overflow-hidden rounded-card border border-rule bg-paper"
              >
                {/* La barra e' la classifica: si legge la distanza fra i primi
                    e gli altri senza dover confrontare cifre. */}
                <span
                  className="absolute inset-y-0 left-0 bg-brand-soft"
                  style={{ width: `${share}%` }}
                  aria-hidden
                />
                <div className="relative flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className={cx(numeric, "w-6 text-ink-3")}>{index + 1}</span>

                  <Link
                    href={`/${game}/personaggi/${row.character.id}`}
                    className="font-semibold hover:text-brand"
                  >
                    {row.character.name}
                  </Link>

                  <Tag>{row.character.affinity}</Tag>
                  <Tag>{row.character.role}</Tag>

                  <span className="ml-auto flex flex-wrap items-baseline gap-4">
                    <span className={cx(numeric, "text-lg font-medium")}>
                      {Math.round(row.result.damage.median).toLocaleString(numbers)}
                    </span>
                    <span className={cx(numeric, "text-xs text-ink-3")}>
                      {row.result.timeToKill === null
                        ? t.nessunKo
                        : `${row.result.timeToKill.median} ${unit}`}
                    </span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </>
  );
}
