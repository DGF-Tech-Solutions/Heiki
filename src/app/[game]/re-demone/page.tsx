import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { BattleBrief, BriefLink, compareClass } from "@/components/endgame/endgame-brief";
import {
  Amounts,
  AttributeIcon,
  DifficultyLinks,
  DropNote,
  DropTable,
  Facts,
  FoeCard,
  HeroGrid,
  ItemLabel,
  PartTitle,
  LevelCell,
  PassiveList,
  RankStars,
  Said,
  SectionTitle,
  Summary,
  endgameScope,
  say,
  sayPlain,
  skillKindLabel,
  type EndgameScope,
} from "@/components/endgame/endgame-parts";
import { EndgameStage, StageBadge } from "@/components/endgame/endgame-stage";
import { SectionIndex } from "@/components/section-index";
import { StrategySection } from "@/components/strategies/strategy-section";
import { cx, eyebrow, HowItWorks, numeric } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { chosenLevel, endgameImageSrc, formatNumber, levelHref, type PageSearchParams } from "@/lib/games/endgame";
import { heroName } from "@/lib/games/heroes";
import type { DemonKingDifficulty, DemonKingIndex, DemonKingPhase, DemonKingRuleStep } from "@/lib/games/endgame-types";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * La Battaglia del Re Demone.
 *
 * Un boss solo, quattro difficolta' in catena, due fasi ciascuna. Il cuore della
 * modalita' sono le Regole: ogni tot turni il Re Demone ne impone tre, da
 * rispettare nell'ordine usando abilita' di un certo attributo, rango o tipo.
 * La pagina le mostra come le scrive il client (DB_demonlord_rule): per ogni
 * fase il tipo di regola e tutte le sequenze possibili; quale ne scelga il
 * gioco a ogni turno non si legge nel client.
 *
 * La difficolta' scelta sta nell'indirizzo (`?difficolta=4`), come negli
 * Scontri finali: il server rende solo quel pannello.
 *
 * L'ordine (11/10): prima la difficolta' col suo riassunto (i numeri, il tipo
 * di regola di ogni fase, gli esclusi), le squadre consigliate, le fasi con le
 * regole, il Verdetto e le ricompense; «Come funziona» (la guida del gioco, i
 * tentativi, i Punti Purgatorio, gli esclusi per esteso) dopo. Prima stava in
 * testa, e la difficolta' cominciava a uno schermo e mezzo dal titolo.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Re Demone di ${gioco}`,
    descrizione: (gioco: string) =>
      `La Battaglia del Re Demone di ${gioco}: le regole, il Verdetto, le quattro difficoltà, le ricompense e gli eroi esclusi.`,
    titolo: "Re Demone",
    introduzione: (difficolta: number) =>
      `Un boss solo in ${difficolta} difficoltà, ognuna con due fasi. Il Re Demone impone delle regole sull'ordine delle abilità: rispettarle indebolisce lui, infrangerle fa salire il suo Verdetto fino alla Sentenza di eliminazione. Qui le regole di ogni fase, il Verdetto, il boss e le ricompense.`,
    fonte:
      "Fonte: le tabelle e i testi del client del gioco. Le statistiche del boss sono stimate: il client non le scrive.",
    comeFunziona: "Come funziona",
    datiDa: "Da dove vengono i dati",
    inPagina: "In questa pagina",
    difficoltaSezione: "Difficoltà",
    difficoltaConta: (n: number) => `${n} difficoltà`,
    inBreve: "La difficoltà scelta in breve",
    confronta: (n: number) => `Confronta le ${n} difficoltà`,
    squadre: "Squadre consigliate",
    fasiRegole: "Fasi e regole",
    regoleBreve: "Regole",
    guida: "La guida del gioco",
    sblocco: "Si sblocca con",
    tentativi: "Tentativi",
    passiveAlleati: "Passiva data alla tua squadra",
    esclusi: "Eroi esclusi",
    esclusiBreve: "Esclusi",
    punti: "Punti Purgatorio",
    puntiSpiega:
      "Dopo il tentativo gratuito della settimana si rigioca con le Monete eroe, convertite in Punti Purgatorio. Spendere il triplo dei punti (x3) vale ricompense per tre completamenti.",
    moneta: (rarita: string) => `Moneta eroe ${rarita}`,
    puntiValore: (n: string) => `${n} punti`,
    difficolta: "Difficoltà",
    livello: "Livello",
    energia: "Energia",
    potenza: "Potenza consigliata",
    puntiX1: "Punti x1",
    puntiX3: "Punti x3",
    regoleFase: (n: number) => `Regole fase ${n}`,
    nessuna: "nessuna",
    scegli: "Difficoltà",
    fase: (n: number) => `Fase ${n}`,
    regole: "Le regole di questa fase",
    senzaRegole: "In questa fase il Re Demone non impone regole.",
    tipoRegola: {
      attribute_type: "Attributo delle abilità",
      card_rank: "Rango delle abilità",
      attack_type: "Tipo di abilità",
    },
    sequenze: (n: number) => `${n} sequenze possibili`,
    sequenzeSpiega:
      "Ogni riga è una sequenza di tre richieste, da rispettare nell'ordine. Il client le elenca tutte; quale scelga il gioco a ogni turno non è scritto.",
    tipiSpiega: "Come nelle icone delle regole del gioco, «Debuff» vale anche per l'Attacco debuff e «Atteggiamento» per Difesa e Contrattacco.",
    richiesta: (n: number) => `${n}ª`,
    tipiCorti: { debuff: "Debuff", atteggiamento: "Atteggiamento" },
    verdetto: "Il Verdetto",
    verdettoPasso: (n: number, soglia: number) => `Passo ${n} · dopo ${soglia} regole infrante`,
    verdettoSpiega:
      "Quante regole infrante servono per salire di un passo: il numero è del client, il significato è dedotto dai testi del gioco.",
    ricompense: "Ricompense",
    completamento: "Al completamento",
    drop: "Drop",
    contenutoCassa: "Contenuto",
    oro: "Oro",
    scambio: "Scambio dei Cristalli",
    scambioSpiega: (n: number) => `Fino a ${n} scambi a settimana per tipo di Cristallo.`,
    dai: "Dai",
    ricevi: "Ricevi uno fra",
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Demon King`,
    descrizione: (gioco: string) =>
      `${gioco} Demon King Battle: the rules, the Verdict, the four difficulties, the rewards and the banned heroes.`,
    titolo: "Demon King",
    introduzione: (difficolta: number) =>
      `A single boss in ${difficolta} difficulties, each with two phases. The Demon King imposes rules on the order of your skills: following them weakens him, breaking them raises his Verdict up to the Annihilation Sentence. Here are each phase's rules, the Verdict, the boss and the rewards.`,
    fonte: "Source: the game client's tables and texts. The boss's stats are estimated: the client does not store them.",
    comeFunziona: "How it works",
    datiDa: "Where the data comes from",
    inPagina: "On this page",
    difficoltaSezione: "Difficulties",
    difficoltaConta: (n: number) => (n === 1 ? "1 difficulty" : `${n} difficulties`),
    inBreve: "The chosen difficulty at a glance",
    confronta: (n: number) => `Compare the ${n} difficulties`,
    squadre: "Recommended teams",
    fasiRegole: "Phases and rules",
    regoleBreve: "Rules",
    guida: "The game's guide",
    sblocco: "Unlocked by",
    tentativi: "Attempts",
    passiveAlleati: "Passive given to your team",
    esclusi: "Banned heroes",
    esclusiBreve: "Banned",
    punti: "Purgatory Points",
    puntiSpiega:
      "After the week's free attempt you replay with Hero Coins, converted into Purgatory Points. Spending three times the points (x3) gives the rewards of three clears.",
    moneta: (rarita: string) => `${rarita} Hero Coin`,
    puntiValore: (n: string) => `${n} points`,
    difficolta: "Difficulty",
    livello: "Level",
    energia: "Stamina",
    potenza: "Recommended power",
    puntiX1: "Points x1",
    puntiX3: "Points x3",
    regoleFase: (n: number) => `Phase ${n} rules`,
    nessuna: "none",
    scegli: "Difficulty",
    fase: (n: number) => `Phase ${n}`,
    regole: "This phase's rules",
    senzaRegole: "In this phase the Demon King imposes no rules.",
    tipoRegola: {
      attribute_type: "Skill attribute",
      card_rank: "Skill rank",
      attack_type: "Skill type",
    },
    sequenze: (n: number) => `${n} possible sequences`,
    sequenzeSpiega:
      "Each row is a sequence of three requests, to be followed in order. The client lists them all; which one the game picks each turn is not stored.",
    tipiSpiega: "As in the game's rule icons, «Debuff» also covers Debuff Atk and «Stance» covers Defense and Counter.",
    richiesta: (n: number) => (n === 1 ? "1st" : n === 2 ? "2nd" : "3rd"),
    tipiCorti: { debuff: "Debuff", atteggiamento: "Stance" },
    verdetto: "The Verdict",
    verdettoPasso: (n: number, soglia: number) => `Step ${n} · after ${soglia} broken rules`,
    verdettoSpiega:
      "How many broken rules it takes to go up a step: the number is the client's, its meaning is deduced from the game's texts.",
    ricompense: "Rewards",
    completamento: "On clear",
    drop: "Drops",
    contenutoCassa: "Contents",
    oro: "Gold",
    scambio: "Crystal Exchange",
    scambioSpiega: (n: number) => `Up to ${n} exchanges a week per Crystal type.`,
    dai: "Give",
    ricevi: "Get one of",
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

type T = (typeof TESTI)["it"];

/** I codici di ATTACK_TYPE che le regole «tipo di abilita'» usano. */
const ATTACK_TYPES: Readonly<Record<number, string>> = {
  1: "atk",
  2: "buff",
  3: "debuff",
  4: "debuff_atk",
  5: "heal",
  6: "defence_pose",
  7: "counter_pose",
};

const LEVEL_PARAM = "difficolta";

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<PageSearchParams>;
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

export default async function DemonKingPage({ params, searchParams }: Props) {
  const { game } = await params;
  const query = await searchParams;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.demonKing;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const scope = endgameScope(game, locale, gameModule, data);
  const current = chosenLevel(query, LEVEL_PARAM, data.difficulties.map((level) => level.level));
  const chosen = data.difficulties[current];

  const levelLink = (level: number) => levelHref(query, LEVEL_PARAM, level, "difficolta");

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      {/*
        La scheda color seppia del Re Demone sul palco, come una carta: ha un
        fondo e una cornice suoi, e non si scontorna (10/10). Prima stava a
        destra del titolo, e sul telefono spariva.
      */}
      <EndgameStage
        title={t.titolo}
        word={t.titolo}
        mode="card"
        image={{ src: endgameImageSrc(game, "re-demone/info.png"), width: 512, height: 512 }}
        subtitle={sayPlain(data.name, scope)}
      >
        <StageBadge>{t.difficoltaConta(data.difficulties.length)}</StageBadge>
      </EndgameStage>
      <p className="m-0 mb-6 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">{t.introduzione(data.difficulties.length)}</p>

      <SectionIndex
        label={t.inPagina}
        numbered={false}
        entries={[
          { id: "difficolta", label: t.difficoltaSezione },
          { id: "squadre", label: t.squadre },
          ...(chosen
            ? [
                { id: "fasi", label: t.fasiRegole },
                { id: "verdetto", label: t.verdetto },
                { id: "ricompense", label: t.ricompense },
              ]
            : []),
          { id: "come-funziona", label: t.comeFunziona },
          ...(data.exchange.length > 0 ? [{ id: "scambio", label: t.scambio }] : []),
        ]}
      />

      <section id="difficolta" className="scroll-mt-[120px]">
        <SectionTitle>{t.difficoltaSezione}</SectionTitle>
        <DifficultyLinks
          legend={t.scegli}
          current={current}
          tabs={data.difficulties.map((level) => ({
            label: say(level.name, scope),
            color: level.color,
            href: levelLink(level.level),
          }))}
        />
        {chosen ? <LevelBrief level={chosen} data={data} scope={scope} t={t} /> : null}
        <LevelsTable
          data={data}
          scope={scope}
          t={t}
          current={current}
          href={levelLink}
          summary={t.confronta(data.difficulties.length)}
        />
      </section>

      {/* le squadre dipendono dalla difficolta': subito sotto il suo riassunto */}
      <StrategySection game={game} mode="demon-king" level={chosen?.level ?? null} className="mt-14" />

      {chosen ? <LevelPanel level={chosen} data={data} scope={scope} t={t} /> : null}

      <section id="come-funziona" className="mt-16 scroll-mt-[120px]">
        <SectionTitle>{t.comeFunziona}</SectionTitle>
        {/*
          I fatti e i Punti Purgatorio affiancati, la guida del gioco sotto a
          tutta riga e chiusa (10/10: aperta erano diciassette paragrafi). Prima
          la guida chiusa stava a sinistra dei due riquadri, e lasciava mezza
          colonna vuota.
        */}
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <div className="min-w-0 border border-rule p-4">
            <Facts
              rows={[
                data.unlock !== null && [t.sblocco, sayPlain(data.unlock, scope)],
                data.attempts !== null && [t.tentativi, <Said key="a" value={data.attempts} scope={scope} />],
              ]}
            />
            {data.allyPassives.length > 0 ? (
              <div className="mt-4">
                <p className={cx(eyebrow, "m-0 mb-1")}>{t.passiveAlleati}</p>
                <PassiveList ids={data.allyPassives} scope={scope} />
              </div>
            ) : null}
          </div>
          <div className="min-w-0 border border-rule p-4">
            <p className={cx(eyebrow, "m-0")}>{t.punti}</p>
            <p className="m-0 mt-1 text-[13px] text-ink-2">{t.puntiSpiega}</p>
            <ul className="m-0 mt-3 grid list-none gap-1 p-0 text-[13px]">
              {data.coinPoints.map((row) => (
                <li key={row.rarity} className="flex justify-between gap-3">
                  <span>{t.moneta(row.rarity)}</span>
                  <span className={cx(numeric, "text-ink-2")}>{t.puntiValore(formatNumber(row.points, locale))}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <details className="p5-corner mt-4 border border-rule bg-paper-2 px-4 py-3">
          <Summary className="text-[14px] font-semibold text-ink">{t.guida}</Summary>
          <div className="mt-2 grid max-w-[80ch] gap-3 pb-1 text-[13px] leading-relaxed text-ink-2">
            {data.guide.map((line, index) => (
              <Said key={index} value={line} scope={scope} />
            ))}
          </div>
        </details>

        {data.banned.length > 0 ? (
          <div className="mt-10">
            <PartTitle id="esclusi">{t.esclusi}</PartTitle>
            <HeroGrid ids={data.banned} scope={scope} />
          </div>
        ) : null}
      </section>

      {data.exchange.length > 0 ? (
        <section id="scambio" className="mt-16 scroll-mt-[120px]">
          <SectionTitle>{t.scambio}</SectionTitle>
          <p className="-mt-2 mb-0 text-sm text-ink-2">{t.scambioSpiega(data.exchange[0]!.weekly)}</p>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            {data.exchange.map((row) => (
              <li
                key={row.give.id}
                className="grid gap-x-4 gap-y-1.5 border border-rule bg-paper-2 p-3 text-[13px] md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
              >
                <span className="inline-flex items-center gap-2">
                  <span className={eyebrow}>{t.dai}</span>
                  <ItemLabel id={row.give.id} count={row.give.count} scope={scope} />
                </span>
                <span className="inline-flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={eyebrow}>{t.ricevi}</span>
                  {row.choices.map((choice) => (
                    <ItemLabel key={choice} id={choice} scope={scope} size={20} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* il metodo in fondo, chiuso: la fonte e le probabilita' (10/10) */}
      <HowItWorks summary={t.datiDa} className="mt-12">
        <p>{t.fonte}</p>
        <DropNote scope={scope} />
      </HowItWorks>
      <p className="m-0 mt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}

/**
 * La difficolta' scelta in breve: i numeri, il tipo di regola di ogni fase (il
 * cuore della modalita', prima in due colonne della tabella fuori schermo sul
 * telefono), e chi non entra in squadra, col salto all'elenco per esteso.
 */
function LevelBrief({ level, data, scope, t }: { level: DemonKingDifficulty; data: DemonKingIndex; scope: EndgameScope; t: T }) {
  const banned = data.banned.flatMap((id) => {
    const hero = scope.heroes.get(id);
    return hero ? [heroName(hero, scope.locale)] : [];
  });
  return (
    <BattleBrief
      label={t.inBreve}
      title={say(level.name, scope)}
      color={level.color}
      stats={[
        [t.livello, level.bossLevel],
        [t.potenza, formatNumber(level.power, scope.locale)],
        [t.energia, level.energy],
        [t.puntiX1, level.points.x1 ?? "—"],
        [t.puntiX3, level.points.x3 ?? "—"],
      ]}
      rows={[
        [
          t.regoleBreve,
          <span key="r" className="inline-flex flex-wrap gap-x-4 gap-y-1">
            {level.phases.map((phase, index) => (
              <span key={index}>
                <span className="text-ink-3">{t.fase(index + 1)}: </span>
                <span className="font-semibold text-ink">{phase.rules ? t.tipoRegola[phase.rules.type] : t.nessuna}</span>
              </span>
            ))}
          </span>,
        ],
        data.banned.length > 0 && [
          t.esclusiBreve,
          <BriefLink key="e" href="#esclusi">
            {banned.length === data.banned.length && banned.length <= 3 ? banned.join(" · ") : data.banned.length}
          </BriefLink>,
        ],
      ]}
    />
  );
}

/**
 * Le quattro difficolta' a confronto, chiuse sotto il riassunto (vedi
 * compareClass); il nome di ogni riga porta alla difficolta', come i pulsanti.
 */
function LevelsTable({
  data,
  scope,
  t,
  current,
  href,
  summary,
}: {
  data: DemonKingIndex;
  scope: EndgameScope;
  t: T;
  current: number;
  /** il titolo della parte chiusa: «Confronta le 4 difficoltà» */
  summary: string;
  href: (level: number) => string;
}) {
  const ruleName = (phase: DemonKingPhase | undefined) =>
    phase?.rules ? t.tipoRegola[phase.rules.type] : t.nessuna;
  return (
    <details className={compareClass.details}>
      <Summary className={compareClass.summary}>{summary}</Summary>
      <div className={compareClass.body}>
        <table className="w-full min-w-[720px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-rule text-left">
              {[t.difficolta, t.livello, t.energia, t.potenza, t.puntiX1, t.puntiX3, t.regoleFase(1), t.regoleFase(2)].map((head) => (
                <th key={head} className={cx(eyebrow, "py-2 pr-3 font-medium first:pl-2")}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.difficulties.map((level, index) => (
              <tr key={level.level} className={cx("border-b border-rule-2", index === current && "bg-paper-2")}>
                <td className="py-0.5 pr-3 pl-2">
                  <LevelCell label={say(level.name, scope)} color={level.color} href={href(level.level)} active={index === current} />
                </td>
                <td className={cx(numeric, "py-1.5 pr-3")}>{level.bossLevel}</td>
                <td className={cx(numeric, "py-1.5 pr-3")}>{level.energy}</td>
                <td className={cx(numeric, "py-1.5 pr-3")}>{formatNumber(level.power, scope.locale)}</td>
                <td className={cx(numeric, "py-1.5 pr-3")}>{level.points.x1 ?? "—"}</td>
                <td className={cx(numeric, "py-1.5 pr-3")}>{level.points.x3 ?? "—"}</td>
                <td className="py-1.5 pr-3 text-ink-2">{ruleName(level.phases[0])}</td>
                <td className="py-1.5 pr-3 text-ink-2">{ruleName(level.phases[1])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/**
 * Una difficolta': le due fasi con le loro regole, una per colonna e nell'ordine
 * in cui si combattono, il Verdetto, le ricompense. I consigli del gioco uguali
 * nelle due fasi si leggono una volta.
 */
function LevelPanel({ level, data, scope, t }: { level: DemonKingDifficulty; data: DemonKingIndex; scope: EndgameScope; t: T }) {
  const boxes = level.clear.filter((amount) => data.boxes[amount.id]);
  const firstTips = data.monsters[level.phases[0]?.foe.monster ?? ""]?.tips;
  return (
    <>
      <section id="fasi" className="mt-16 scroll-mt-[120px]">
        <SectionTitle>{t.fasiRegole}</SectionTitle>
        <ol className="m-0 grid list-none gap-4 p-0 xl:grid-cols-2">
          {level.phases.map((phase, index) => (
            <li key={index} className="grid min-w-0 content-start gap-3">
              <FoeCard
                foe={phase.foe}
                scope={scope}
                heading={t.fase(index + 1)}
                id={`fase-${index + 1}`}
                tipsLike={index > 0 && firstTips ? { tips: firstTips, href: "#fase-1", where: t.fase(1) } : undefined}
              />
              <Rules phase={phase} scope={scope} t={t} />
            </li>
          ))}
        </ol>
      </section>

      <section id="verdetto" className="mt-16 scroll-mt-[120px]">
        <SectionTitle>{t.verdetto}</SectionTitle>
        <p className="-mt-2 mb-4 max-w-[48ch] text-[13px] text-ink-3">{t.verdettoSpiega}</p>
        <ol className="m-0 grid list-none gap-3 p-0 lg:grid-cols-3">
          {level.verdict.map((step, index) => (
            <li key={index} className="p5-corner min-w-0 border border-rule bg-paper-2 p-4">
              <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.verdettoPasso(index + 1, step.threshold)}</p>
              <PassiveList ids={[step.passive]} scope={scope} />
            </li>
          ))}
        </ol>
      </section>

      <section id="ricompense" className="mt-16 scroll-mt-[120px]">
        <SectionTitle>{t.ricompense}</SectionTitle>
        <div className="grid gap-x-8 gap-y-5 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <div>
              <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.completamento}</p>
              <Amounts amounts={level.clear} scope={scope} />
            </div>
            {boxes.map((box) => (
              <DropTable
                key={box.id}
                drops={{ draws: 1, entries: data.boxes[box.id]! }}
                scope={scope}
                relative
                title={
                  <>
                    {t.contenutoCassa}: {sayPlain(data.items[box.id]?.name, scope)}
                  </>
                }
              />
            ))}
            <Facts rows={[[t.oro, <span key="o" className={numeric}>{formatNumber(level.gold, scope.locale)}</span>]]} />
          </div>
          <DropTable drops={level.drops} scope={scope} title={t.drop} />
        </div>
      </section>
    </>
  );
}

/** Le regole di una fase: il tipo, e tutte le sequenze in un elenco richiudibile. */
function Rules({ phase, scope, t }: { phase: DemonKingPhase; scope: EndgameScope; t: T }) {
  const rules = phase.rules;
  if (!rules) return <p className="m-0 border border-dashed border-rule p-4 text-[13px] text-ink-3">{t.senzaRegole}</p>;
  return (
    <div className="p5-corner border border-rule bg-paper-2 p-4">
      <p className={cx(eyebrow, "m-0")}>{t.regole}</p>
      <p className="m-0 mt-1 text-[14px] font-semibold">{t.tipoRegola[rules.type]}</p>
      <details className="mt-2">
        <Summary>{t.sequenze(rules.sequences.length)}</Summary>
        <p className="m-0 mt-1.5 text-[12px] text-ink-3">{t.sequenzeSpiega}</p>
        {rules.type === "attack_type" ? <p className="m-0 mt-1 text-[12px] text-ink-3">{t.tipiSpiega}</p> : null}
        <table className="mt-2 w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-rule text-left">
              {[1, 2, 3].map((n) => (
                <th key={n} className={cx(eyebrow, "py-1 pr-2 font-medium")}>
                  {t.richiesta(n)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.sequences.map((sequence, index) => (
              <tr key={index} className="border-b border-rule-2 last:border-b-0">
                {sequence.map((step, position) => (
                  <td key={position} className="py-1 pr-2 align-middle">
                    {ruleStep(step, rules.type, scope, t)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

/**
 * Una richiesta: le icone degli attributi, le stelle del rango o il nome del
 * tipo di carta. I tipi a coppie ([3, 4] e [6, 7]) prendono il nome corto delle
 * icone delle regole del gioco (DB_demonlord_ruleinfo: «Abilità Debuff e
 * Abilità Att. debuff», «Abilità Atteggiamento»).
 *
 * Una funzione e non un componente: sono cento celle per pagina, e in sviluppo
 * ogni componente server porta nella pagina le sue informazioni di debug
 * (11/10).
 */
function ruleStep(
  step: DemonKingRuleStep,
  type: "attribute_type" | "card_rank" | "attack_type",
  scope: EndgameScope,
  t: T,
) {
  if (type === "attribute_type") {
    return (
      <span className="inline-flex items-center gap-0.5">
        {step.map((code) => (
          <AttributeIcon key={code} code={code} scope={scope} size={16} />
        ))}
      </span>
    );
  }
  if (type === "card_rank") {
    return (
      <span className="inline-flex items-center gap-1">
        {step.map((rank) => (
          <RankStars key={rank} rank={rank} scope={scope} />
        ))}
      </span>
    );
  }
  const key = step.join(",");
  const text =
    key === "3,4"
      ? t.tipiCorti.debuff
      : key === "6,7"
        ? t.tipiCorti.atteggiamento
        : step.map((code) => skillKindLabel(ATTACK_TYPES[code] ?? String(code), scope)).join(" / ");
  return <span className="p5-cut-sm inline-block bg-paper-3 px-2 py-0.5 text-[12px] text-ink-2">{text}</span>;
}
