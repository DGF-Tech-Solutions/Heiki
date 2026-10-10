import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { CardStamp, EndgameCard } from "@/components/endgame/endgame-card";
import {
  AttributeIcon,
  ConditionIcon,
  Facts,
  HeroPassiveGrid,
  PartTitle,
  RaceLabel,
  RankStars,
  Said,
  SectionTitle,
  Summary,
  endgameScope,
  sayPlain,
} from "@/components/endgame/endgame-parts";
import { HowItWorks, PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { endgameImageSrc } from "@/lib/games/endgame";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Scontri finali («Death Match»): l'indice.
 *
 * Un pulsante per boss che porta alla sua pagina, come la griglia degli eroi
 * (scelta dell'utente, 26/09: prima i boss stavano tutti qui, e c'era troppo da
 * scorrere). Qui resta quello che vale per tutta la modalita': le regole del
 * gioco, i limiti, gli eroi con passive legate agli Scontri finali.
 *
 * Solo i sei boss fissi: Lamek, lo Scontro finale d'evento, resta fuori.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Scontri finali di ${gioco}`,
    descrizione: (gioco: string) =>
      `Gli Scontri finali di ${gioco}: i boss, le fasi, le abilità, le restrizioni della squadra e le ricompense con le probabilità.`,
    titolo: "Scontri finali",
    introduzione: (boss: number, difficolta: number) =>
      `I ${boss} boss che invadono i villaggi dei capitoli 1-6 dopo le Battaglie boss, ${difficolta} difficoltà in tutto. Scegli un boss per vedere le fasi coi nemici, le carte e le passive, le restrizioni della squadra e le ricompense con le loro probabilità.`,
    fonte:
      "Fonte: le tabelle e i testi del client del gioco. Le statistiche dei boss sono stimate, e lo dice accanto al numero: il client non le scrive.",
    datiDa: "Da dove vengono i dati",
    indice: "Boss",
    stelle: "Battaglie boss",
    stelleN: (n: number) => (n === 1 ? "1 stella" : `${n} stelle`),
    difficolta: (n: number, da: number, a: number) => `${n} difficoltà · livello ${da}-${a}`,
    comeFunziona: "Come funziona",
    regole: (n: number) => `Le regole del gioco (${n})`,
    limite: "Tempo limite",
    minuti: (n: number) => `${n} minuti`,
    caos: "Indura (Caos)",
    alGiorno: (n: number) => `fino a ${n} volte al giorno`,
    eroi: "Eroi e Scontri finali",
    eroiIntro:
      "Passive di eroi che il client lega agli Scontri finali: quelle che valgono solo qui, e quelle che qui non si attivano. Un eroe compare una volta per passiva.",
    soloQui: (n: number) => `Valgono solo negli Scontri finali (${n})`,
    esclusePassive: (n: number) => `Non si attivano negli Scontri finali (${n})`,
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Death Match`,
    descrizione: (gioco: string) =>
      `${gioco} Death Match: the bosses, phases, skills, team restrictions and rewards with their chances.`,
    titolo: "Death Match",
    introduzione: (boss: number, difficolta: number) =>
      `The ${boss} bosses that invade the villages of chapters 1-6 after Boss Battles, ${difficolta} difficulties in all. Pick a boss to see the phases with their enemies, the cards and passives, the team restrictions and the rewards with their chances.`,
    fonte:
      "Source: the game client's tables and texts. The bosses' stats are estimated, and it says so next to the number: the client does not store them.",
    datiDa: "Where the data comes from",
    indice: "Bosses",
    stelle: "Boss Battles",
    stelleN: (n: number) => (n === 1 ? "1 star" : `${n} stars`),
    difficolta: (n: number, da: number, a: number) => `${n} difficulties · level ${da}-${a}`,
    comeFunziona: "How it works",
    regole: (n: number) => `The game's rules (${n})`,
    limite: "Time limit",
    minuti: (n: number) => `${n} minutes`,
    caos: "Indura (Chaos)",
    alGiorno: (n: number) => `up to ${n} times a day`,
    eroi: "Heroes and Death Match",
    eroiIntro:
      "Hero passives that the client ties to Death Match: the ones that only work here, and the ones that do not activate here. A hero appears once per passive.",
    soloQui: (n: number) => `Only work in Death Match (${n})`,
    esclusePassive: (n: number) => `Do not activate in Death Match (${n})`,
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const t = TESTI[await getLocale()];
  const entry = findGame(game);
  return {
    title: t.titoloPagina(entry?.shortName ?? game),
    description: t.descrizione(entry?.name ?? game),
  };
}

export default async function DeathMatchPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.deathMatch;
  // La voce di menu non compare senza dati, ma l'indirizzo si puo' digitare.
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const scope = endgameScope(game, locale, gameModule, data);
  const levels = data.bosses.reduce((sum, boss) => sum + boss.difficulties.length, 0);

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      {/* il titolo e la riga di cosa c'e'; la fonte in «Da dove vengono i dati» (10/10) */}
      <PageHeader title={t.titolo}>
        <p>{t.introduzione(data.bosses.length, levels)}</p>
      </PageHeader>
      <HowItWorks summary={t.datiDa} className="mb-8">
        <p>{t.fonte}</p>
      </HowItWorks>

      <nav aria-label={t.indice} className="mb-14">
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {data.bosses.map((boss) => {
            const bossLevels = boss.difficulties.map((level) => level.bossLevel);
            return (
              <li key={boss.key} className="min-w-0">
                {/*
                  Il cut-in del boss e non la sua scheda color seppia: scelta
                  dell'utente (26/09). La scheda resta in testa alla pagina del
                  boss, accanto ai fatti, sotto il cut-in grande (10/10).
                */}
                <EndgameCard
                  href={`/${game}/scontri-finali/${boss.key}`}
                  image={
                    boss.cutIn
                      ? endgameImageSrc(game, `scontri/${boss.key}-cutin.png`)
                      : boss.image
                        ? endgameImageSrc(game, `scontri/${boss.key}.png`)
                        : null
                  }
                  stamp={
                    <CardStamp>
                      {t.stelle}
                      <RankStars rank={boss.stars} scope={scope} label={t.stelleN(boss.stars)} />
                    </CardStamp>
                  }
                  title={sayPlain(boss.name, scope)}
                >
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <AttributeIcon code={boss.attribute} scope={scope} size={16} />
                    <RaceLabel code={boss.race} scope={scope} />
                  </span>
                  <span className="mt-1.5 block">
                    {t.difficolta(boss.difficulties.length, Math.min(...bossLevels), Math.max(...bossLevels))}
                  </span>
                </EndgameCard>
              </li>
            );
          })}
        </ul>
      </nav>

      <section id="come-funziona" className="mb-14 scroll-mt-20">
        <SectionTitle>{t.comeFunziona}</SectionTitle>
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          <details className="p5-corner border border-rule bg-paper-2 px-4 py-3">
            <Summary className="text-[14px] font-semibold text-ink">{t.regole(data.rules.length)}</Summary>
            <div className="mt-2 grid max-w-[48ch] gap-3 pb-1 text-[13px] leading-relaxed text-ink-2">
              {data.rules.map((rule, index) => (
                <Said key={index} value={rule} scope={scope} />
              ))}
            </div>
          </details>
          <div className="border border-rule p-4">
            <Facts
              rows={[
                [t.limite, t.minuti(data.limits.minutes)],
                [t.caos, t.alGiorno(data.limits.chaosPerDay)],
              ]}
            />
          </div>
        </div>
      </section>

      <section id="eroi" className="scroll-mt-20 border-t border-rule pt-10">
        <SectionTitle>{t.eroi}</SectionTitle>
        <p className="-mt-2 mb-0 max-w-[48ch] text-sm text-ink-2">{t.eroiIntro}</p>

        <div className="mt-6">
          <PartTitle>
            <span className="inline-flex items-center gap-2">
              <ConditionIcon condition="destroy_only" scope={scope} size={20} />
              {t.soloQui(data.heroesOnly.length)}
            </span>
          </PartTitle>
          <HeroPassiveGrid entries={data.heroesOnly} scope={scope} />
        </div>

        {/* Chiuse di partenza: sono quasi settanta, e aperte allungherebbero la pagina di tre schermi. */}
        <details className="mt-8">
          <Summary className="font-display text-[17px] font-extrabold uppercase tracking-[0.02em] text-ink [font-variation-settings:'wdth'_85]">
            <span className="inline-flex items-center gap-2 align-middle">
              <ConditionIcon condition="destroy_except" scope={scope} size={20} />
              {t.esclusePassive(data.heroesExcluded.length)}
            </span>
          </Summary>
          <div className="mt-3">
            <HeroPassiveGrid entries={data.heroesExcluded} scope={scope} />
          </div>
        </details>
      </section>

      <p className="mt-12 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}
