import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Amounts,
  AttributeIcon,
  DifficultyLinks,
  DropNote,
  DropTable,
  Facts,
  FoeCard,
  HeroGrid,
  PartTitle,
  PassiveList,
  Said,
  endgameScope,
  say,
  sayPlain,
  type EndgameScope,
} from "@/components/endgame/endgame-parts";
import { cx, display, eyebrow, numeric } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import {
  chosenLevel,
  countFoes,
  endgameImageSrc,
  formatNumber,
  levelHref,
  type PageSearchParams,
} from "@/lib/games/endgame";
import type { DeityGroup, SupremeDeityDifficulty, SupremeDeityIndex } from "@/lib/games/endgame-types";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * La Battaglia della Divinita' Suprema.
 *
 * Non un boss ma una serie di Giudizi: quattro ondate fisse di messaggeri, poi
 * un Giudizio finale scelto dalla «magia» della Divinita' (piu' messaggeri
 * sopravvivono al limite di turni, piu' sale), e a Inferno un Giudizio nascosto
 * contro uno dei Quattro Arcangeli. La pagina segue quest'ordine.
 *
 * Il client scrive i gruppi possibili, non come il gioco li sceglie: per il
 * finale dice «fino a questa magia, uno di questi due», e la pagina lo scrive
 * cosi'. I campi della riga copiati da Hraesvelgr (ritratto, fasi, gruppo delle
 * passive) l'import li ha gia' lasciati fuori.
 *
 * La difficolta' scelta sta nell'indirizzo (`?difficolta=3`), come nelle altre
 * pagine del gruppo.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Divinità Suprema di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `La Battaglia della Divinità Suprema di ${gioco}: i Giudizi, la magia, gli Editti, le Maledizioni, le Stigmate e gli Arcangeli.`,
    endgame: "Endgame",
    titolo: "Divinità Suprema",
    introduzione: (difficolta: number) =>
      `Una serie di Giudizi contro i messaggeri della Divinità Suprema, in ${difficolta} difficoltà. Quattro ondate fisse, poi un Giudizio finale che dipende da quanto è salita la magia della Divinità, e a Inferno un Giudizio nascosto contro uno dei Quattro Arcangeli.`,
    fonte:
      "Fonte: le tabelle e i testi del client del gioco. Le statistiche dei nemici sono stimate: il client non le scrive.",
    comeFunziona: "Come funziona",
    sblocco: "Si sblocca con",
    tentativi: "Tentativi",
    maledizioni: "Le Maledizioni",
    maledizioniSpiega: "Si applicano una dopo l'altra, nell'ordine, quando un Editto divino fallisce.",
    stigmate: "Le Stigmate",
    esclusi: "Eroi esclusi",
    esclusiSpiega: "Gli Arcangeli ed Estarossa: sono loro i boss del Giudizio nascosto.",
    difficolta: "Difficoltà",
    energia: "Energia",
    potenza: "Potenza consigliata",
    turni: "Turni per Giudizio",
    puntiX1: "Punti x1",
    puntiX3: "Punti x3",
    nascosto: "Giudizio nascosto",
    si: "sì",
    no: "no",
    scegli: "Difficoltà",
    regole: "Le regole della difficoltà",
    passivaModalita: "Passiva della modalità",
    passiveEroi: "Passiva data ai tuoi eroi",
    magia: "Magia della Divinità",
    magiaTesto: (per: number, eredita: number) =>
      `+${per}% per ogni messaggero sopravvissuto al limite di turni. I nemici sopravvissuti passano ai successivi parte delle loro statistiche (il client scrive ${eredita}; quanto valga davvero non è verificato).`,
    giudizi: "I quattro Giudizi",
    turniLimite: (n: number) => (n === 1 ? "1 turno" : `limite di ${n} turni`),
    finale: "Il Giudizio finale",
    finaleSpiega:
      "Il gruppo dipende dalla magia accumulata: fino a quella soglia, il gioco sceglie uno dei due gruppi della riga.",
    finoA: (n: number) => `Magia fino al ${n}%`,
    oppure: "oppure",
    nascostoTitolo: "Il Giudizio nascosto",
    nascostoSpiega: (soglia: number) =>
      `Si apre se il Giudizio finale si chiude con la magia sotto il ${soglia}%. Contro uno dei Quattro Arcangeli, a caso.`,
    vantaggio: "In vantaggio",
    svantaggio: "In svantaggio",
    vantaggioSpiega:
      "Gli attributi che il client segna contro questo gruppo: il primo è forte contro di lui, il secondo debole. Il verso viene dal triangolo degli attributi, che il gioco calcola nel codice del combattimento.",
    abilitaEfficaci: "Abilità efficaci",
    passiveSquadra: "Passive del gruppo",
    nemici: (n: number) => (n === 1 ? "1 nemico" : `${n} nemici`),
    editti: "Gli Editti divini",
    edittiSpiega: "Un Editto per Giudizio, a caso fra quelli del livello di magia raggiunto.",
    ricompense: "Ricompense",
    completamento: "Al completamento",
    contenutoCassa: "Contenuto",
    drop: "Drop",
    oro: "Oro",
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Supreme Deity · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco} Supreme Deity Battle: the Judgments, the magic, the Edicts, the Curses, the Stigmata and the Archangels.`,
    endgame: "Endgame",
    titolo: "Supreme Deity",
    introduzione: (difficolta: number) =>
      `A series of Judgments against the Supreme Deity's messengers, in ${difficolta} difficulties. Four fixed waves, then a Final Judgment that depends on how high the Deity's magic has risen, and on Hell a hidden Judgment against one of the Four Archangels.`,
    fonte: "Source: the game client's tables and texts. The enemies' stats are estimated: the client does not store them.",
    comeFunziona: "How it works",
    sblocco: "Unlocked by",
    tentativi: "Attempts",
    maledizioni: "The Curses",
    maledizioniSpiega: "Applied one after another, in order, when a Divine Edict fails.",
    stigmate: "The Stigmata",
    esclusi: "Banned heroes",
    esclusiSpiega: "The Archangels and Estarossa: they are the bosses of the hidden Judgment.",
    difficolta: "Difficulty",
    energia: "Stamina",
    potenza: "Recommended power",
    turni: "Turns per Judgment",
    puntiX1: "Points x1",
    puntiX3: "Points x3",
    nascosto: "Hidden Judgment",
    si: "yes",
    no: "no",
    scegli: "Difficulty",
    regole: "This difficulty's rules",
    passivaModalita: "Mode passive",
    passiveEroi: "Passive given to your heroes",
    magia: "The Deity's magic",
    magiaTesto: (per: number, eredita: number) =>
      `+${per}% for each messenger that survives the turn limit. Surviving enemies pass part of their stats to the next ones (the client stores ${eredita}; its real value is not verified).`,
    giudizi: "The four Judgments",
    turniLimite: (n: number) => (n === 1 ? "1 turn" : `${n}-turn limit`),
    finale: "The Final Judgment",
    finaleSpiega: "The group depends on the magic accumulated: up to that threshold, the game picks one of the two groups in the row.",
    finoA: (n: number) => `Magic up to ${n}%`,
    oppure: "or",
    nascostoTitolo: "The hidden Judgment",
    nascostoSpiega: (soglia: number) =>
      `Opens if the Final Judgment ends with the magic below ${soglia}%. Against one of the Four Archangels, at random.`,
    vantaggio: "Advantaged",
    svantaggio: "Disadvantaged",
    vantaggioSpiega:
      "The attributes the client marks against this group: the first is strong against it, the second weak. The direction comes from the attribute triangle, which the game computes in its combat code.",
    abilitaEfficaci: "Effective skills",
    passiveSquadra: "Group passives",
    nemici: (n: number) => (n === 1 ? "1 enemy" : `${n} enemies`),
    editti: "The Divine Edicts",
    edittiSpiega: "One Edict per Judgment, at random among those of the magic level reached.",
    ricompense: "Rewards",
    completamento: "On clear",
    contenutoCassa: "Contents",
    drop: "Drops",
    oro: "Gold",
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

type T = (typeof TESTI)["it"];

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

export default async function SupremeDeityPage({ params, searchParams }: Props) {
  const { game } = await params;
  const query = await searchParams;
  const entry = findGame(game);
  if (!entry) notFound();

  const gameModule = requireGameModule(game);
  const data = gameModule.supremeDeity;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const scope = endgameScope(game, locale, gameModule, data);
  const current = chosenLevel(query, LEVEL_PARAM, data.difficulties.map((level) => level.level));
  const chosen = data.difficulties[current];

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <header className="mb-6 grid gap-5 border-b border-rule pb-5 md:grid-cols-[minmax(0,1fr)_minmax(0,200px)]">
        <div className="min-w-0">
          <p className={eyebrow}>{t.endgame}</p>
          <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.titolo}</h1>
          <p className="m-0 mt-1 text-[15px] text-ink-2">{sayPlain(data.name, scope)}</p>
          <p className="mt-2.5 max-w-[72ch] text-sm text-ink-2">{t.introduzione(data.difficulties.length)}</p>
          <p className="mt-1.5 max-w-[72ch] text-[13px] text-ink-3">{t.fonte}</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={endgameImageSrc(game, "divinita/copertina.png")}
          alt=""
          width={200}
          height={200}
          className="hidden h-auto w-full max-w-[200px] rounded-card bg-paper-2 md:block"
        />
      </header>

      <section id="come-funziona" className="mb-10 scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.comeFunziona}</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {data.guide.map((section, index) => (
            <div key={index} className="min-w-0 rounded-card border border-rule bg-paper-2 p-4">
              <p className="m-0 text-[14px] font-semibold">{sayPlain(section.title, scope)}</p>
              <div className="mt-2 grid gap-2 text-[13px] leading-relaxed text-ink-2">
                {section.texts.map((text, position) => (
                  <Said key={position} value={text} scope={scope} />
                ))}
              </div>
            </div>
          ))}
          <div className="min-w-0 rounded-card border border-rule p-4">
            <Facts
              rows={[
                data.unlock !== null && [t.sblocco, sayPlain(data.unlock, scope)],
                data.attempts !== null && [t.tentativi, <Said key="a" value={data.attempts} scope={scope} />],
              ]}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <PartTitle>{t.maledizioni}</PartTitle>
            <p className="m-0 mb-2 text-[12px] text-ink-3">{t.maledizioniSpiega}</p>
            <PassiveList ids={data.curses.map((curse) => curse.passive)} scope={scope} />
          </div>
          <div className="min-w-0">
            <PartTitle>{t.stigmate}</PartTitle>
            <ul className="m-0 grid list-none gap-2.5 p-0">
              {data.stigmata.map((stigma, index) => (
                <li key={index} className="flex min-w-0 gap-3 text-[13px]">
                  {stigma.icon ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={endgameImageSrc(game, `abilita/${stigma.icon}.png`)}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-[3px] bg-paper-2"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="m-0 font-semibold">{sayPlain(stigma.name, scope)}</p>
                    <Said value={stigma.ranks[0]} scope={scope} className="text-ink-2 [&>p]:m-0" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.banned.length > 0 ? (
          <div className="mt-6">
            <PartTitle>{t.esclusi}</PartTitle>
            <p className="m-0 mb-2 text-[12px] text-ink-3">{t.esclusiSpiega}</p>
            <HeroGrid ids={data.banned} scope={scope} />
          </div>
        ) : null}
      </section>

      <section id="difficolta" className="scroll-mt-20 border-t border-rule pt-8">
        <LevelsTable data={data} scope={scope} t={t} />
        <div className="mt-6">
          <DifficultyLinks
            legend={t.scegli}
            current={current}
            tabs={data.difficulties.map((level) => ({
              label: say(level.name, scope),
              color: level.color,
              href: levelHref(query, LEVEL_PARAM, level.level, "difficolta"),
            }))}
          />
          {chosen ? (
            <div className="mt-4">
              <LevelPanel level={chosen} data={data} scope={scope} t={t} />
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-8 grid gap-1 border-t border-rule-2 pt-4">
        <DropNote scope={scope} />
        <p className="m-0 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
      </div>
    </main>
  );
}

function LevelsTable({ data, scope, t }: { data: SupremeDeityIndex; scope: EndgameScope; t: T }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-rule text-left">
            {[t.difficolta, t.energia, t.potenza, t.turni, t.puntiX1, t.puntiX3, t.nascosto].map((head) => (
              <th key={head} className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.difficulties.map((level) => (
            <tr key={level.level} className="border-b border-rule-2">
              <td className="py-1.5 pr-3 font-semibold">{say(level.name, scope)}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.energy}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{formatNumber(level.power, scope.locale)}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.turns}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.points.x1 ?? "—"}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.points.x3 ?? "—"}</td>
              <td className="py-1.5 pr-3 text-ink-2">{level.hidden ? t.si : t.no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LevelPanel({ level, data, scope, t }: { level: SupremeDeityDifficulty; data: SupremeDeityIndex; scope: EndgameScope; t: T }) {
  const boxes = level.clear.filter((amount) => data.boxes[amount.id]);
  return (
    <div className="grid gap-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-card border border-rule p-4">
          <p className={cx(eyebrow, "m-0 mb-2")}>{t.regole}</p>
          {level.modePassive ? (
            <div>
              <p className={cx(eyebrow, "m-0 mb-1 text-[10px]")}>{t.passivaModalita}</p>
              <PassiveList ids={[level.modePassive]} scope={scope} />
            </div>
          ) : null}
          {level.heroPassives.length > 0 ? (
            <div className="mt-3">
              <p className={cx(eyebrow, "m-0 mb-1 text-[10px]")}>{t.passiveEroi}</p>
              <PassiveList ids={level.heroPassives} scope={scope} />
            </div>
          ) : null}
        </div>
        <div className="min-w-0 rounded-card border border-rule p-4">
          <p className={cx(eyebrow, "m-0 mb-2")}>{t.magia}</p>
          <p className="m-0 text-[13px] text-ink-2">{t.magiaTesto(level.magic.perSurvivor, level.magic.inherited)}</p>
        </div>
      </div>

      <div>
        <PartTitle>{t.giudizi}</PartTitle>
        <div className="grid gap-4">
          {level.judgments.map((judgment, index) => (
            <GroupBlock
              key={index}
              group={judgment.group}
              scope={scope}
              t={t}
              heading={
                <>
                  {sayPlain(judgment.name, scope)} · {t.turniLimite(judgment.turns)}
                </>
              }
            />
          ))}
        </div>
      </div>

      <div>
        <PartTitle>{t.finale}</PartTitle>
        <p className="m-0 mb-3 text-[12px] text-ink-3">{t.finaleSpiega}</p>
        <div className="grid gap-4">
          {level.final.map((step) => (
            <div key={step.upTo} className="rounded-card border border-rule p-3">
              <p className={cx(eyebrow, "m-0 mb-2")}>{t.finoA(step.upTo)}</p>
              <div className="grid gap-3 xl:grid-cols-2">
                {step.groups.map((group, index) => (
                  <GroupBlock key={index} group={group} scope={scope} t={t} compact />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {level.hidden ? (
        <div>
          <PartTitle>{t.nascostoTitolo}</PartTitle>
          <p className="m-0 mb-3 text-[12px] text-ink-3">{t.nascostoSpiega(level.hidden.opensBelow)}</p>
          <div className="grid gap-4 xl:grid-cols-2">
            {level.hidden.groups.map((group, index) => (
              <GroupBlock key={index} group={group} scope={scope} t={t} />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <PartTitle>{t.editti}</PartTitle>
        <p className="m-0 mb-3 text-[12px] text-ink-3">{t.edittiSpiega}</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {level.edicts.map((step) => (
            <div key={step.upTo} className="min-w-0 rounded-card border border-rule p-3">
              <p className={cx(eyebrow, "m-0 mb-2")}>{t.finoA(step.upTo)}</p>
              <ul className="m-0 grid list-none gap-1.5 p-0 text-[13px] text-ink-2">
                {step.edicts.map((edict, index) => (
                  <li key={index}>
                    <Said value={edict} scope={scope} className="[&>p]:m-0" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <PartTitle>{t.ricompense}</PartTitle>
        <div className="grid gap-5 lg:grid-cols-2">
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
      </div>
    </div>
  );
}

/**
 * Un gruppo di nemici: nome, cosa lo rende diverso, e i nemici contati.
 *
 * `compact` per i gruppi del Giudizio finale, due per riga: lo stesso contenuto,
 * con i nemici chiusi in un `<details>`, perche' le righe sono cinque e i gruppi
 * dieci.
 */
function GroupBlock({
  group,
  scope,
  t,
  heading,
  compact,
}: {
  group: DeityGroup;
  scope: EndgameScope;
  t: T;
  heading?: React.ReactNode;
  compact?: boolean;
}) {
  const name = sayPlain(group.name, scope);
  const foes = countFoes(group.foes);
  const foeCards = (
    <div className={cx("grid gap-3", compact ? "" : "lg:grid-cols-2")}>
      {foes.map(({ foe, count }, index) => (
        <FoeCard key={index} foe={foe} scope={scope} heading={count > 1 ? `×${count}` : undefined} fallbackName={name} />
      ))}
    </div>
  );
  return (
    <div className="min-w-0 rounded-card border border-rule bg-paper-2 p-3">
      <div className="flex min-w-0 gap-3">
        {group.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={endgameImageSrc(scope.game, `divinita/${group.image}.png`)}
            alt=""
            width={96}
            height={96}
            loading="lazy"
            className="h-24 w-24 shrink-0 rounded-[3px] bg-paper-3"
          />
        ) : null}
        <div className="min-w-0">
          {heading ? <p className={cx(eyebrow, "m-0")}>{heading}</p> : null}
          <p className="m-0 text-[14px] font-semibold">{name}</p>
          {group.description ? <Said value={group.description} scope={scope} className="mt-1 text-[13px] text-ink-2 [&>p]:m-0" /> : null}
          {group.strong !== null || group.weak !== null ? (
            <p className="m-0 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-2" title={t.vantaggioSpiega}>
              {group.strong !== null ? (
                <span className="inline-flex items-center gap-1">
                  <span className="text-ink-3">{t.vantaggio}</span>
                  <AttributeIcon code={group.strong} scope={scope} size={16} />
                </span>
              ) : null}
              {group.weak !== null ? (
                <span className="inline-flex items-center gap-1">
                  <span className="text-ink-3">{t.svantaggio}</span>
                  <AttributeIcon code={group.weak} scope={scope} size={16} />
                </span>
              ) : null}
            </p>
          ) : null}
          {group.skills ? (
            <p className="m-0 mt-1 text-[12px] text-ink-2">
              <span className="text-ink-3">{t.abilitaEfficaci}: </span>
              {say(group.skills, scope)}
            </p>
          ) : null}
        </div>
      </div>

      {group.teamPassives.length > 0 ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-[13px] text-ink-2 hover:text-brand">
            {t.passiveSquadra} ({group.teamPassives.length})
          </summary>
          <div className="mt-2">
            <PassiveList ids={group.teamPassives} scope={scope} />
          </div>
        </details>
      ) : null}

      {compact ? (
        <details className="mt-1.5">
          <summary className="cursor-pointer text-[13px] text-ink-2 hover:text-brand">{t.nemici(group.foes.length)}</summary>
          <div className="mt-2">{foeCards}</div>
        </details>
      ) : (
        <div className="mt-3">{foeCards}</div>
      )}
    </div>
  );
}
