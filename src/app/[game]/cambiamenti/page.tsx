import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { HeroChangeList } from "@/components/changes/hero-change-list";
import { SectionIndex } from "@/components/section-index";
import { Card, cx, display, eyebrow, HowItWorks, Notice, numeric, PageHeader } from "@/components/ui";
import { patchAnchor } from "@/lib/games/changes";
import type { PatchChanges } from "@/lib/games/changes-types";
import { findGame } from "@/lib/games/catalog";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { requireGameModule } from "@/lib/games/registry";
import type { HeroEntry } from "@/lib/games/types";
import { inLingua, intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Cambiamenti.
 *
 * Cosa cambia negli eroi a ogni patch, letto confrontando i dati del client di
 * una patch con quelli della precedente (script/cambiamenti.py nella pipeline).
 * Scelte dell'utente (03/10): un blocco per patch, conta quello che cambia gli
 * eroi, il resto del gioco solo come conteggio; la stessa storia sta anche nella
 * scheda Info di ogni eroe.
 *
 * L'archivio comincia il 23/09/2026 e la pagina lo dice: le patch prima non sono
 * state conservate, e una pagina che sembrasse completa direbbe il falso.
 *
 * Componente server, senza JavaScript: ogni patch ha la sua ancora (#p-AAAA-MM-GG),
 * a cui porta la scheda dell'eroe.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Cambiamenti di ${gioco}`,
    descrizione: (gioco: string) =>
      `Cosa cambia negli eroi di ${gioco} a ogni patch: carte, Unica, statistiche, reliquie, letti nei dati del gioco.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    cambiamenti: "Cambiamenti",
    introduzione: "Cosa cambia negli eroi a ogni patch: carte, Unica, abilità speciali, statistiche, reliquie, legami e costumi.",
    metodo:
      "Si legge confrontando i dati del gioco della patch con quelli della precedente, nelle due lingue; il resto del gioco (eventi, missioni, negozio) è solo contato.",
    comeFunziona: "Come si leggono i cambiamenti",
    vaiAllaPatch: "Vai alla patch",
    archivio: (data: string) =>
      `L'archivio comincia il ${data}: le patch di prima non sono state conservate, e i loro cambiamenti non si possono ricostruire.`,
    date: "Le date sono quelle in cui il gioco ha scaricato la patch (server globale).",
    patchDel: (data: string) => `Patch del ${data}`,
    rispetto: (data: string) => `rispetto a quella del ${data}`,
    sintesi: (nuovi: number, cambiati: number) =>
      [
        nuovi === 1 ? "1 eroe nuovo" : `${nuovi} eroi nuovi`,
        cambiati === 1 ? "1 eroe cambiato" : `${cambiati} eroi cambiati`,
      ].join(" · "),
    eroiNuovi: "Eroi nuovi",
    eroiCambiati: "Eroi cambiati",
    nessunEroe: "Nessun eroe è cambiato in questa patch.",
    soloRitocchi: "Ritocchi di formattazione",
    soloRitocchiSpiega:
      "Testi cambiati solo nei codici di colore o di stile del gioco: si leggono uguali, e non sono un cambiamento dell'eroe.",
    resto: "Nelle tabelle del gioco",
    restoSpiega:
      "Righe cambiate per gruppo di tabelle, comprese quelle dietro i cambiamenti degli eroi qui sopra.",
    righe: (aggiunte: number, tolte: number, cambiate: number) =>
      [
        aggiunte ? `${aggiunte} ${aggiunte === 1 ? "riga aggiunta" : "righe aggiunte"}` : "",
        tolte ? `${tolte} ${tolte === 1 ? "riga tolta" : "righe tolte"}` : "",
        cambiate ? `${cambiate} ${cambiate === 1 ? "riga cambiata" : "righe cambiate"}` : "",
      ]
        .filter(Boolean)
        .join(", "),
    testi: (nuovi: number, cambiati: number) => `Testi del gioco: ${nuovi} nuovi, ${cambiati} cambiati`,
    nienteAltro: "Nient'altro.",
    vuota: (data: string) =>
      `Per ora c'è una sola patch nell'archivio, quella del ${data}: i cambiamenti compariranno dalla prossima.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} changes`,
    descrizione: (gioco: string) =>
      `What changes for the heroes of ${gioco} with every patch: cards, Unique, stats, relics, read in the game data.`,
    gioco: "game",
    questoGioco: "this game",
    cambiamenti: "Changes",
    introduzione: "What changes for the heroes with every patch: cards, Unique, special abilities, stats, relics, associations and costumes.",
    metodo:
      "It is read by comparing the game data of the patch with the previous one, in both languages; the rest of the game (events, missions, shop) is only counted.",
    comeFunziona: "How the changes are read",
    vaiAllaPatch: "Jump to patch",
    archivio: (data: string) =>
      `The archive starts on ${data}: earlier patches were not kept, and their changes cannot be rebuilt.`,
    date: "Dates are the day the game downloaded the patch (global server).",
    patchDel: (data: string) => `Patch of ${data}`,
    rispetto: (data: string) => `compared with the one of ${data}`,
    sintesi: (nuovi: number, cambiati: number) =>
      [
        nuovi === 1 ? "1 new hero" : `${nuovi} new heroes`,
        cambiati === 1 ? "1 hero changed" : `${cambiati} heroes changed`,
      ].join(" · "),
    eroiNuovi: "New heroes",
    eroiCambiati: "Heroes changed",
    nessunEroe: "No hero changed in this patch.",
    soloRitocchi: "Formatting touch-ups",
    soloRitocchiSpiega:
      "Texts that changed only in the game's color or style codes: they read the same, and are not a change to the hero.",
    resto: "In the game tables",
    restoSpiega: "Rows changed by group of tables, including those behind the hero changes above.",
    righe: (aggiunte: number, tolte: number, cambiate: number) =>
      [
        aggiunte ? `${aggiunte} ${aggiunte === 1 ? "row added" : "rows added"}` : "",
        tolte ? `${tolte} ${tolte === 1 ? "row removed" : "rows removed"}` : "",
        cambiate ? `${cambiate} ${cambiate === 1 ? "row changed" : "rows changed"}` : "",
      ]
        .filter(Boolean)
        .join(", "),
    testi: (nuovi: number, cambiati: number) => `Game texts: ${nuovi} new, ${cambiati} changed`,
    nienteAltro: "Nothing else.",
    vuota: (data: string) =>
      `For now the archive holds a single patch, the one of ${data}: changes will show up from the next one.`,
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

export default async function ChangesPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const { changes, roster } = requireGameModule(game);
  // La voce di menu non compare senza cambiamenti, ma l'indirizzo si puo' digitare.
  if (!changes || !roster) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const format = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const day = (value: string) => format.format(new Date(`${value}T00:00:00Z`));
  const short = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const shortDay = (value: string) => short.format(new Date(`${value}T00:00:00Z`));
  const heroes = new Map(roster.heroes.map((hero) => [hero.id, hero]));
  const first = changes.patches[0];

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.cambiamenti }]} />

      {/*
        Il titolo, cosa c'e' e da quando: l'inizio dell'archivio resta in vista,
        perche' senza la data la pagina sembrerebbe completa. Come si legge e le
        date in «Come funziona» (10/10).
      */}
      <PageHeader title={t.cambiamenti}>
        <p>{t.introduzione}</p>
        {first ? <p className="mt-1">{t.archivio(day(first))}</p> : null}
      </PageHeader>
      <HowItWorks summary={t.comeFunziona} className="mb-6">
        <p>{t.metodo}</p>
        <p>{t.date}</p>
      </HowItWorks>

      {changes.comparisons.length === 0 && first ? <Notice>{t.vuota(day(first))}</Notice> : null}

      {/* con piu' patch, le date ferme sotto l'intestazione: la pagina cresce di una patch a settimana */}
      {changes.comparisons.length > 1 ? (
        <SectionIndex
          label={t.vaiAllaPatch}
          numbered={false}
          entries={changes.comparisons.map((comparison) => ({ id: patchAnchor(comparison), label: shortDay(comparison.to) }))}
        />
      ) : null}

      <div className="grid gap-16">
        {changes.comparisons.map((comparison) => (
          <Patch
            key={comparison.to}
            comparison={comparison}
            game={game}
            locale={locale}
            heroes={heroes}
            day={day}
          />
        ))}
      </div>
    </main>
  );
}

function Patch({
  comparison,
  game,
  locale,
  heroes,
  day,
}: {
  comparison: PatchChanges;
  game: string;
  locale: Locale;
  heroes: ReadonlyMap<string, HeroEntry>;
  day: (value: string) => string;
}) {
  const t = TESTI[locale];
  const changed = Object.keys(comparison.heroes);
  const touchedOnly = Object.keys(comparison.touchups).filter((id) => !comparison.heroes[id]);

  const subhead = cx(display, "m-0 text-[17px]");

  return (
    <section id={patchAnchor(comparison)} className="scroll-mt-[120px]">
      <header className="mb-6 flex flex-wrap items-end gap-x-4 gap-y-1.5 border-b-2 border-brand pb-3">
        <h2 className={cx(display, "m-0 text-[clamp(24px,3vw,32px)]")}>{t.patchDel(day(comparison.to))}</h2>
        <p className="m-0 pb-0.5 text-[13px] text-ink-3">{t.rispetto(day(comparison.from))}</p>
        <p className={cx(eyebrow, "m-0 pb-1 text-ink-2 sm:ml-auto")}>{t.sintesi(comparison.newHeroes.length, changed.length)}</p>
      </header>

      <div className="grid gap-9">
        {comparison.newHeroes.length > 0 ? (
          <div>
            <h3 className={subhead}>{t.eroiNuovi}</h3>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-3 p-0">
              {comparison.newHeroes.map((id) => {
                const hero = heroes.get(id);
                return hero ? (
                  <li key={id}>
                    <HeroChip game={game} hero={hero} locale={locale} />
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        ) : null}

        <div>
          <h3 className={subhead}>{t.eroiCambiati}</h3>
          {changed.length === 0 ? (
            <p className="m-0 mt-2 text-sm text-ink-2">{t.nessunEroe}</p>
          ) : (
            <div className="mt-3 grid gap-3">
              {changed.map((id) => {
                const hero = heroes.get(id);
                if (!hero) return null;
                return (
                  <Card key={id} className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-6">
                    <HeroChip game={game} hero={hero} locale={locale} />
                    <HeroChangeList
                      changes={comparison.heroes[id] ?? []}
                      touchups={comparison.touchups[id] ?? []}
                      game={game}
                      locale={locale}
                      heroes={heroes}
                    />
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {touchedOnly.length > 0 ? (
          <div>
            <h3 className={subhead}>{t.soloRitocchi}</h3>
            <p className="m-0 mt-1.5 max-w-[48ch] text-[13px] text-ink-3">{t.soloRitocchiSpiega}</p>
            <ul className="m-0 mt-3 grid max-w-[880px] list-none border border-rule p-0">
              {touchedOnly.map((id) => {
                const hero = heroes.get(id);
                if (!hero) return null;
                return (
                  <li key={id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rule-2 px-3 py-2.5 text-sm last:border-b-0">
                    <Link href={`/${game}/eroi/${id}`} className="font-semibold text-ink underline-offset-2 hover:text-brand-deep hover:underline">
                      {[heroName(hero, locale), heroEpithet(hero, locale)].filter(Boolean).join(" · ")}
                    </Link>
                    <HeroChangeList changes={[]} touchups={comparison.touchups[id] ?? []} game={game} locale={locale} heroes={heroes} />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div>
          <h3 className={subhead}>{t.resto}</h3>
          <p className="m-0 mt-1.5 max-w-[48ch] text-[13px] text-ink-3">{t.restoSpiega}</p>
          {comparison.other.length === 0 && comparison.texts.added === 0 && comparison.texts.changed === 0 ? (
            <p className="m-0 mt-3 text-sm text-ink-2">{t.nienteAltro}</p>
          ) : (
            // una riga per gruppo, il nome a sinistra e i conteggi a destra: si scorre come una tabella
            <ul className="m-0 mt-3 grid max-w-[640px] list-none border border-rule p-0 text-sm">
              {comparison.other.map((group) => (
                <li key={group.group} className="flex flex-wrap justify-between gap-x-4 border-b border-rule-2 px-3 py-2 last:border-b-0">
                  <span className="font-semibold text-ink">{inLingua(group.name, locale)}</span>
                  <span className={cx(numeric, "text-[13px] text-ink-2")}>{t.righe(group.added, group.removed, group.changed)}</span>
                </li>
              ))}
              {comparison.texts.added || comparison.texts.changed ? (
                <li className="px-3 py-2 text-[13px] text-ink-2">{t.testi(comparison.texts.added, comparison.texts.changed)}</li>
              ) : null}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroChip({ game, hero, locale }: { game: string; hero: HeroEntry; locale: Locale }) {
  const name = heroName(hero, locale);
  const epithet = heroEpithet(hero, locale);
  return (
    <Link
      href={`/${game}/eroi/${hero.id}`}
      className="group grid w-[120px] gap-1.5 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroCardSrc(game, hero.id)}
        alt=""
        width={120}
        height={120}
        loading="lazy"
        className="aspect-square w-full border border-rule bg-paper-3 object-cover transition-colors group-hover:border-brand"
      />
      <span className="text-[12px] leading-tight text-ink-2">
        {epithet ? <span className="block text-ink-3">{epithet}</span> : null}
        <span className="font-semibold text-ink group-hover:text-brand-deep">{name}</span>
      </span>
    </Link>
  );
}
