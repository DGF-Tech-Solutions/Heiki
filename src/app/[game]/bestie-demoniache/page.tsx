import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { EndgameCard } from "@/components/endgame/endgame-card";
import {
  ConditionIcon,
  HeroPassiveGrid,
  ItemLabel,
  PartTitle,
  Said,
  endgameScope,
  sayPlain,
} from "@/components/endgame/endgame-parts";
import { cx, display, eyebrow, numeric } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { endgameImageSrc, formatNumber } from "@/lib/games/endgame";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Bestie demoniache («Creature Nest», nel gioco «Battaglia Bestia demoniaca»):
 * l'indice.
 *
 * Un pulsante per bestia che porta alla sua pagina, come la griglia degli eroi
 * (scelta dell'utente, 26/09). Qui resta quello che vale per tutta la nest: le
 * guide del gioco, lo scambio dei materiali, gli eroi con passive per tutta la
 * nest o escluse. Il colosseo («Prova di coraggio») non c'e': nel client non ha
 * stagioni.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Bestie demoniache di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Le Bestie demoniache di ${gioco}: i piani, le fasi, i nemici, le meccaniche, le ricompense, le Reliquie sacre e gli eroi legati.`,
    endgame: "Endgame",
    titolo: "Bestie demoniache",
    introduzione: (bestie: number, piani: number) =>
      `Le ${bestie} bestie della Creature Nest, ${piani} piani in tutto. Scegli una bestia per vedere i piani con le fasi e i nemici, le passive che prende a caso, le sue meccaniche, le ricompense, le Reliquie sacre che si fabbricano coi suoi materiali e gli eroi con passive fatte per lei.`,
    fonte:
      "Fonte: le tabelle e i testi del client del gioco. Le statistiche delle bestie sono stimate: il client non le scrive.",
    indice: "Bestie",
    piani: (n: number, da: number, a: number) => `${n} piani · livello ${da}-${a}`,
    potenza: (n: string) => `classe consigliata ${n}`,
    comeFunziona: "Come funziona",
    scambio: "Scambio dei materiali",
    materiale: "Materiale",
    punti: "Punti",
    ricompensa: "Ricompensa",
    limite: "A settimana",
    eroi: "Eroi e Bestie demoniache",
    eroiIntro:
      "Passive che valgono in tutta la Battaglia Bestia demoniaca, e passive che lì non si attivano. Quelle per una bestia sola stanno nella sua pagina.",
    soloNest: (n: number) => `Valgono in tutte le Battaglie Bestia demoniaca (${n})`,
    esclusiNest: (n: number) => `Non si attivano nella Battaglia Bestia demoniaca (${n})`,
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Demonic Beasts · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco} Demonic Beasts: floors, phases, enemies, mechanics, rewards, Holy Relics and related heroes.`,
    endgame: "Endgame",
    titolo: "Demonic Beasts",
    introduzione: (bestie: number, piani: number) =>
      `The ${bestie} Creature Nest beasts, ${piani} floors in all. Pick a beast to see its floors with their phases and enemies, the passives it picks at random, its mechanics, the rewards, the Holy Relics crafted from its materials and the heroes with passives made for it.`,
    fonte: "Source: the game client's tables and texts. The beasts' stats are estimated: the client does not store them.",
    indice: "Beasts",
    piani: (n: number, da: number, a: number) => `${n} floors · level ${da}-${a}`,
    potenza: (n: string) => `recommended class ${n}`,
    comeFunziona: "How it works",
    scambio: "Material exchange",
    materiale: "Material",
    punti: "Points",
    ricompensa: "Reward",
    limite: "Per week",
    eroi: "Heroes and Demonic Beasts",
    eroiIntro:
      "Passives that work throughout the Demonic Beast Battle, and passives that do not activate there. The ones for a single beast are on its page.",
    soloNest: (n: number) => `Work in every Demonic Beast Battle (${n})`,
    esclusiNest: (n: number) => `Do not activate in the Demonic Beast Battle (${n})`,
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

export default async function CreatureNestPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.creatureNest;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const scope = endgameScope(game, locale, gameModule, data);
  const floors = data.beasts.reduce((sum, beast) => sum + beast.floors.length, 0);

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>{t.endgame}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.titolo}</h1>
        <p className="m-0 mt-1 text-[15px] text-ink-2">{sayPlain(data.name, scope)}</p>
        <p className="mt-2.5 max-w-[72ch] text-sm text-ink-2">{t.introduzione(data.beasts.length, floors)}</p>
        <p className="mt-1.5 max-w-[72ch] text-[13px] text-ink-3">{t.fonte}</p>
      </header>

      <nav aria-label={t.indice} className="mb-10">
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {data.beasts.map((beast) => {
            const levels = beast.floors.map((floor) => floor.phases[0]?.foes[0]?.level ?? 0).filter(Boolean);
            return (
              <li key={beast.key} className="min-w-0">
                <EndgameCard
                  href={`/${game}/bestie-demoniache/${beast.key}`}
                  image={beast.image ? endgameImageSrc(game, `bestie/${beast.key}.png`) : null}
                  title={sayPlain(beast.name, scope)}
                >
                  <span className="block">
                    {t.piani(beast.floors.length, Math.min(...levels), Math.max(...levels))}
                  </span>
                  {beast.power !== null ? (
                    <span className={cx(numeric, "mt-0.5 block text-ink-3")}>{t.potenza(formatNumber(beast.power, locale))}</span>
                  ) : null}
                </EndgameCard>
              </li>
            );
          })}
        </ul>
      </nav>

      <section id="come-funziona" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.comeFunziona}</h2>
        <div className="mt-3 grid items-start gap-3 lg:grid-cols-3">
          {data.guide.map((section, index) => (
            <details key={index} className="min-w-0 rounded-card border border-rule bg-paper-2 p-4" open={index === 0}>
              <summary className="cursor-pointer text-[14px] font-semibold hover:text-brand">{sayPlain(section.title, scope)}</summary>
              <Said value={section.text} scope={scope} className="mt-2 text-[13px] leading-relaxed text-ink-2" />
            </details>
          ))}
        </div>

        <div className="mt-6">
          <PartTitle>{t.scambio}</PartTitle>
          {data.exchange.text ? <Said value={data.exchange.text} scope={scope} className="mb-3 text-[13px] text-ink-2" /> : null}
          <div className="grid gap-5 lg:grid-cols-2">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-rule text-left">
                  <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.materiale}</th>
                  <th className={cx(eyebrow, "py-1.5 text-right font-medium")}>{t.punti}</th>
                </tr>
              </thead>
              <tbody>
                {data.exchange.points.map((row) => (
                  <tr key={row.id} className="border-b border-rule-2">
                    <td className="py-1 pr-3">
                      <ItemLabel id={row.id} scope={scope} />
                    </td>
                    <td className={cx(numeric, "py-1 text-right")}>{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-rule text-left">
                  <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.ricompensa}</th>
                  <th className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>{t.punti}</th>
                  <th className={cx(eyebrow, "py-1.5 text-right font-medium")}>{t.limite}</th>
                </tr>
              </thead>
              <tbody>
                {data.exchange.rewards.map((row) => (
                  <tr key={row.id} className="border-b border-rule-2">
                    <td className="py-1 pr-3">
                      <ItemLabel id={row.id} scope={scope} />
                    </td>
                    <td className={cx(numeric, "py-1 pr-3 text-right")}>{formatNumber(row.points, locale)}</td>
                    <td className={cx(numeric, "py-1 text-right")}>{row.weekly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="eroi" className="scroll-mt-20 border-t border-rule pt-8">
        <h2 className={cx(display, "text-2xl")}>{t.eroi}</h2>
        <p className="mt-2 max-w-[72ch] text-sm text-ink-2">{t.eroiIntro}</p>
        <div className="mt-5">
          <PartTitle>
            <span className="inline-flex items-center gap-2">
              <ConditionIcon condition="creaturenest" scope={scope} size={20} />
              {t.soloNest(data.heroesOnly.length)}
            </span>
          </PartTitle>
          <HeroPassiveGrid entries={data.heroesOnly} scope={scope} />
        </div>
        <div className="mt-6">
          <PartTitle>
            <span className="inline-flex items-center gap-2">
              <ConditionIcon condition="creaturenest_except" scope={scope} size={20} />
              {t.esclusiNest(data.heroesExcluded.length)}
            </span>
          </PartTitle>
          <HeroPassiveGrid entries={data.heroesExcluded} scope={scope} />
        </div>
      </section>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}
