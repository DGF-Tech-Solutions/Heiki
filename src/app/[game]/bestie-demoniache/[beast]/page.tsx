import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { EndgameCard } from "@/components/endgame/endgame-card";
import {
  Amounts,
  ConditionIcon,
  DifficultyLinks,
  DropNote,
  DropTable,
  Facts,
  FoeCard,
  HeroGrid,
  HeroPassiveGrid,
  ItemLabel,
  PartTitle,
  PassiveList,
  LevelCell,
  Said,
  SectionTitle,
  Summary,
  endgameScope,
  say,
  sayPlain,
  type EndgameScope,
} from "@/components/endgame/endgame-parts";
import { EndgameStage, StageBadge } from "@/components/endgame/endgame-stage";
import { cx, display, eyebrow, HowItWorks, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import {
  chosenLevel,
  countFoes,
  endgameImageSrc,
  formatNumber,
  levelHref,
  type PageSearchParams,
} from "@/lib/games/endgame";
import type { NestBeast, NestFloor, NestPhase } from "@/lib/games/endgame-types";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Una Bestia demoniaca: i suoi piani, le fasi, le meccaniche, le ricompense,
 * le Reliquie sacre e gli eroi legati.
 *
 * Una pagina per bestia, come la scheda di un eroe (scelta dell'utente, 26/09).
 * Il piano scelto sta nell'indirizzo (`?piano=4`) e il server rende solo quello;
 * senza, si parte dal piu' alto. Per ogni piano le fasi con la descrizione che
 * il gioco scrive, i nemici, le passive fra cui il gioco ne sceglie una a caso,
 * e le meccaniche proprie: la barra di Nidhoggr, Laevateinn, Kenaz e le rune di
 * Surtr. Surtr non ha una classe di combattimento consigliata (il client
 * scrive 0), e la pagina non ne inventa una.
 */

const TESTI = testi({
  it: {
    titoloPagina: (bestia: string, gioco: string) => `${bestia} · Bestie demoniache di ${gioco}`,
    descrizione: (bestia: string) =>
      `${bestia}, Bestia demoniaca: i piani, le fasi, i nemici, le meccaniche, le ricompense, le Reliquie sacre e gli eroi legati.`,
    sezione: "Bestie demoniache",
    kicker: "Bestia demoniaca",
    potenza: "Classe di combattimento consigliata",
    nonImpostata: "non impostata nel client",
    materialePrincipale: "Materiale principale",
    stima: "Le statistiche della bestia sono stimate: il client non le scrive.",
    piano: "Piano",
    difficolta: "Difficoltà",
    livello: "Livello",
    energia: "Energia",
    fasi: "Fasi",
    primoCompletamento: "Primo completamento",
    scegli: "Piano",
    fase: (n: number) => `Fase ${n}`,
    turni: (n: number) => `limite di ${n} turni`,
    casuali: "Una di queste passive, a caso",
    barra: "La barra",
    laevateinn: "Laevateinn",
    laevateinnSpiega: "Surtr risponde al tipo di abilità che usi contro Laevateinn, e ogni tipo aggiunge un effetto.",
    kenaz: "Incantesimo di Kenaz",
    kenazSpiega: "Il gioco chiede uno di questi tipi di abilità.",
    kenazPenalita: "Se sbagli tipo",
    rune: "Incantesimi runici",
    ricarica: (n: number) => (n === 1 ? "ricarica 1 turno" : `ricarica ${n} turni`),
    ricompense: "Ricompense",
    completamento: "A ogni completamento",
    drop: "Drop",
    reliquie: (n: number) =>
      n === 1 ? "1 Reliquia sacra si fabbrica coi suoi materiali" : `${n} Reliquie sacre si fabbricano coi suoi materiali`,
    soloBestia: "Passive che valgono solo contro questa bestia",
    sangueCattivo: "Sangue cattivo",
    sangueSpiega:
      "Il client lega questa bestia a questi eroi («Sangue cattivo»): il legame è scritto nel gioco, cosa comporti in battaglia no.",
    altre: "Le altre Bestie demoniache",
    pianiSezione: "Piani",
    pianiConta: (n: number) => (n === 1 ? "1 piano" : `${n} piani`),
    datiDa: "Da dove vengono i dati",
    vicine: "Le altre bestie",
    precedente: (nome: string) => `Bestia precedente: ${nome}`,
    successiva: (nome: string) => `Bestia successiva: ${nome}`,
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (bestia: string, gioco: string) => `${bestia} · ${gioco} Demonic Beasts`,
    descrizione: (bestia: string) =>
      `${bestia}, Demonic Beast: floors, phases, enemies, mechanics, rewards, Holy Relics and related heroes.`,
    sezione: "Demonic Beasts",
    kicker: "Demonic Beast",
    potenza: "Recommended combat class",
    nonImpostata: "not set in the client",
    materialePrincipale: "Main material",
    stima: "The beast's stats are estimated: the client does not store them.",
    piano: "Floor",
    difficolta: "Difficulty",
    livello: "Level",
    energia: "Stamina",
    fasi: "Phases",
    primoCompletamento: "First clear",
    scegli: "Floor",
    fase: (n: number) => `Phase ${n}`,
    turni: (n: number) => `${n}-turn limit`,
    casuali: "One of these passives, at random",
    barra: "The gauge",
    laevateinn: "Laevateinn",
    laevateinnSpiega: "Surtr responds to the skill type you use against Laevateinn, and each type adds an effect.",
    kenaz: "Spell of Kenaz",
    kenazSpiega: "The game asks for one of these skill types.",
    kenazPenalita: "If you use the wrong type",
    rune: "Rune Spells",
    ricarica: (n: number) => (n === 1 ? "1-turn cooldown" : `${n}-turn cooldown`),
    ricompense: "Rewards",
    completamento: "On every clear",
    drop: "Drops",
    reliquie: (n: number) =>
      n === 1 ? "1 Holy Relic is crafted from its materials" : `${n} Holy Relics are crafted from its materials`,
    soloBestia: "Passives that only work against this beast",
    sangueCattivo: "Bad Blood",
    sangueSpiega:
      "The client ties this beast to these heroes («Bad Blood»): the link is written in the game, what it does in battle is not.",
    altre: "The other Demonic Beasts",
    pianiSezione: "Floors",
    pianiConta: (n: number) => (n === 1 ? "1 floor" : `${n} floors`),
    datiDa: "Where the data comes from",
    vicine: "The other beasts",
    precedente: (nome: string) => `Previous beast: ${nome}`,
    successiva: (nome: string) => `Next beast: ${nome}`,
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

type T = (typeof TESTI)["it"];

const LEVEL_PARAM = "piano";

interface Props {
  params: Promise<{ game: string; beast: string }>;
  searchParams: Promise<PageSearchParams>;
}

function lookup(game: string, key: string) {
  const entry = findGame(game);
  if (!entry) return null;
  const gameModule = requireGameModule(game);
  const data = gameModule.creatureNest;
  const beast = data?.beasts.find((candidate) => candidate.key === key);
  if (!data || !beast) return null;
  return { entry, gameModule, data, beast };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, beast: key } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];
  const found = lookup(game, key);
  if (!found) return {};
  const name = found.beast.name[locale] ?? found.beast.name.en ?? key;
  return { title: t.titoloPagina(name, found.entry.shortName), description: t.descrizione(name) };
}

export default async function CreatureNestBeastPage({ params, searchParams }: Props) {
  const { game, beast: key } = await params;
  const query = await searchParams;
  const found = lookup(game, key);
  if (!found) notFound();

  const { entry, gameModule, data, beast } = found;
  const locale = await getLocale();
  const t = TESTI[locale];
  const scope = endgameScope(game, locale, gameModule, data);
  const current = chosenLevel(query, LEVEL_PARAM, beast.floors.map((floor) => floor.floor));
  const chosen = beast.floors[current];
  const name = sayPlain(beast.name, scope);

  // la bestia prima e dopo nell'ordine dell'indice, a giro: si scorrono come le schede eroe
  const position = data.beasts.findIndex((candidate) => candidate.key === beast.key);
  const neighbour = (step: number) => data.beasts[(position + step + data.beasts.length) % data.beasts.length];
  const prev = data.beasts.length > 1 ? neighbour(-1) : undefined;
  const next = data.beasts.length > 1 ? neighbour(1) : undefined;
  const floorLink = (floor: number) => levelHref(query, LEVEL_PARAM, floor, "piani");

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.sezione, href: `/${game}/bestie-demoniache` },
          { label: name },
        ]}
      />

      {/*
        Il ritratto a colori sul palco (10/10); la scheda color seppia resta in
        testa, accanto ai fatti.
      */}
      <EndgameStage
        title={name}
        word={name}
        mode="cutout"
        image={beast.image ? { src: endgameImageSrc(game, `bestie/${beast.key}.png`), width: 256, height: 256 } : null}
        navLabel={t.vicine}
        prev={prev ? { href: `/${game}/bestie-demoniache/${prev.key}`, label: t.precedente(sayPlain(prev.name, scope)) } : null}
        next={next ? { href: `/${game}/bestie-demoniache/${next.key}`, label: t.successiva(sayPlain(next.name, scope)) } : null}
      >
        <StageBadge>{t.kicker}</StageBadge>
        <StageBadge>{t.pianiConta(beast.floors.length)}</StageBadge>
      </EndgameStage>

      <div className="mb-14 grid grid-cols-[96px_minmax(0,1fr)] gap-x-5 gap-y-4 sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-x-6">
        {beast.info ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={endgameImageSrc(game, `bestie/${beast.key}-info.png`)}
            alt=""
            width={168}
            height={168}
            className="p5-corner h-auto w-full bg-paper-2"
          />
        ) : (
          <span aria-hidden />
        )}
        <div className="min-w-0 self-center">
          <Facts
            rows={[
              [
                t.potenza,
                beast.power !== null ? (
                  <span key="p" className={numeric}>
                    {formatNumber(beast.power, scope.locale)}
                  </span>
                ) : (
                  <span key="p" className="text-ink-3">
                    {t.nonImpostata}
                  </span>
                ),
              ],
              beast.material !== null && [t.materialePrincipale, <ItemLabel key="m" id={beast.material} scope={scope} />],
            ]}
          />
        </div>
        {/* Said avvolge il testo in un suo div: la colonna va data al contenitore */}
        {beast.guaranteed ? (
          <div className="col-span-2 max-w-[80ch]">
            <Said value={beast.guaranteed} scope={scope} className="text-[14px] text-ink-2" />
          </div>
        ) : null}
      </div>

      <section id="piani" className="scroll-mt-20">
        <SectionTitle>{t.pianiSezione}</SectionTitle>
        <FloorsTable beast={beast} scope={scope} t={t} current={current} href={floorLink} />
        <div className="mt-6">
          <DifficultyLinks
            legend={t.scegli}
            current={current}
            tabs={beast.floors.map((floor) => ({
              label: say(floor.name, scope),
              color: floor.color,
              href: floorLink(floor.floor),
            }))}
          />
          {chosen ? (
            <div className="mt-6">
              <FloorPanel floor={chosen} scope={scope} t={t} />
            </div>
          ) : null}
        </div>
      </section>

      <BeastHeroes beast={beast} scope={scope} t={t} />

      <section className="mt-14 border-t border-rule pt-8">
        <PartTitle>{t.altre}</PartTitle>
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {data.beasts.map((other) => (
            <li key={other.key} className="min-w-0">
              <EndgameCard
                href={`/${game}/bestie-demoniache/${other.key}`}
                image={other.image ? endgameImageSrc(game, `bestie/${other.key}.png`) : null}
                title={sayPlain(other.name, scope)}
                compact
                current={other.key === beast.key}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* il metodo in fondo, chiuso: le stime e le probabilita' (10/10) */}
      <HowItWorks summary={t.datiDa} className="mt-12">
        <p>{t.stima}</p>
        <DropNote scope={scope} />
      </HowItWorks>
      <p className="m-0 mt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}

/** I piani a confronto; il nome della difficolta' di ogni riga porta al piano, come i pulsanti. */
function FloorsTable({
  beast,
  scope,
  t,
  current,
  href,
}: {
  beast: NestBeast;
  scope: EndgameScope;
  t: T;
  current: number;
  href: (floor: number) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-rule text-left">
            {[t.piano, t.difficolta, t.livello, t.energia, t.fasi, t.primoCompletamento].map((head) => (
              <th key={head} className={cx(eyebrow, "py-2 pr-3 font-medium first:pl-2")}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {beast.floors.map((floor, index) => (
            <tr key={floor.floor} className={cx("border-b border-rule-2", index === current && "bg-paper-2")}>
              <td className="py-1.5 pr-3 pl-2 text-ink-2">{sayPlain(floor.title, scope)}</td>
              <td className="py-0.5 pr-3">
                <LevelCell label={say(floor.name, scope)} color={floor.color} href={href(floor.floor)} active={index === current} />
              </td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{floor.phases[0]?.foes[0]?.level ?? "—"}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{floor.energy}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{floor.phases.length}</td>
              <td className="py-1.5 pr-3">
                <Amounts amounts={floor.firstClear} scope={scope} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FloorPanel({ floor, scope, t }: { floor: NestFloor; scope: EndgameScope; t: T }) {
  return (
    <div className="grid gap-10">
      {floor.phases.map((phase, index) => (
        <PhaseBlock key={index} phase={phase} index={index} scope={scope} t={t} />
      ))}

      <div>
        <PartTitle>{t.ricompense}</PartTitle>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            {floor.firstClear.length > 0 ? (
              <div>
                <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.primoCompletamento}</p>
                <Amounts amounts={floor.firstClear} scope={scope} />
              </div>
            ) : null}
            {floor.clear.length > 0 ? (
              <div>
                <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.completamento}</p>
                <Amounts amounts={floor.clear} scope={scope} />
              </div>
            ) : null}
          </div>
          <DropTable drops={floor.drops} scope={scope} title={t.drop} />
        </div>
      </div>
    </div>
  );
}

function PhaseBlock({ phase, index, scope, t }: { phase: NestPhase; index: number; scope: EndgameScope; t: T }) {
  const foes = countFoes(phase.foes);
  return (
    <div className="min-w-0">
      {/* la fase come titolo, non come etichetta: e' l'ordine in cui si combatte */}
      <h3 className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className={cx(display, "text-[22px]")}>{t.fase(index + 1)}</span>
        {phase.turnLimit ? <Tag>{t.turni(phase.turnLimit)}</Tag> : null}
      </h3>
      {phase.description ? (
        <Said value={phase.description} scope={scope} className="mt-2 max-w-[80ch] text-[13px] leading-relaxed text-ink-2" />
      ) : null}

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {foes.map(({ foe, count }, position) => (
          <FoeCard key={position} foe={foe} scope={scope} heading={count > 1 ? `×${count}` : undefined} />
        ))}
      </div>

      {phase.gauge ? (
        <div className="p5-corner mt-3 border border-rule bg-paper-2 p-4 text-[13px]">
          <p className={cx(eyebrow, "m-0")}>{t.barra}</p>
          <p className="m-0 mt-1 font-semibold">{sayPlain(phase.gauge.name, scope)}</p>
          <Said value={phase.gauge.text} scope={scope} className="text-ink-2" />
        </div>
      ) : null}

      {phase.randomPassives.length > 0 ? (
        <details className="mt-3">
          <Summary>
            {t.casuali} ({phase.randomPassives.length})
          </Summary>
          <div className="mt-2">
            <PassiveList ids={phase.randomPassives} scope={scope} />
          </div>
        </details>
      ) : null}

      {phase.surtr ? <SurtrBlock surtr={phase.surtr} scope={scope} t={t} /> : null}
    </div>
  );
}

/** Le meccaniche di Surtr nella fase: Laevateinn, Kenaz, rune. */
function SurtrBlock({ surtr, scope, t }: { surtr: NonNullable<NestPhase["surtr"]>; scope: EndgameScope; t: T }) {
  return (
    <div className="mt-3 grid gap-3 lg:grid-cols-2">
      {surtr.laevateinn.length > 0 ? (
        <div className="p5-corner min-w-0 border border-rule bg-paper-2 p-4 text-[13px]">
          <p className={cx(eyebrow, "m-0")}>{t.laevateinn}</p>
          <p className="m-0 mt-1 text-[12px] text-ink-3">{t.laevateinnSpiega}</p>
          <dl className="m-0 mt-2 grid gap-x-3 gap-y-1.5 sm:grid-cols-[max-content_minmax(0,1fr)]">
            {surtr.laevateinn.map((row, index) => (
              <div key={index} className="contents">
                <dt className="font-semibold">{say(row.type, scope)}</dt>
                <dd className="m-0 text-ink-2">{row.effect ? <Said value={row.effect} scope={scope} className="[&>p]:m-0" /> : "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {surtr.kenaz.length > 0 ? (
        <div className="p5-corner min-w-0 border border-rule bg-paper-2 p-4 text-[13px]">
          <p className={cx(eyebrow, "m-0")}>{t.kenaz}</p>
          <p className="m-0 mt-1 text-[12px] text-ink-3">{t.kenazSpiega}</p>
          <p className="m-0 mt-1.5 text-ink-2">{surtr.kenaz.map((type) => say(type, scope)).join(" · ")}</p>
          {surtr.kenazPenalty ? (
            <div className="mt-2">
              <p className={cx(eyebrow, "m-0")}>{t.kenazPenalita}</p>
              <Said value={surtr.kenazPenalty} scope={scope} className="text-ink-2 [&>p]:m-0" />
            </div>
          ) : null}
        </div>
      ) : null}

      {surtr.runes.length > 0 ? (
        <div className="p5-corner min-w-0 border border-rule bg-paper-2 p-4 text-[13px] lg:col-span-2">
          <p className={cx(eyebrow, "m-0")}>{t.rune}</p>
          <ul className="m-0 mt-2 grid list-none gap-2 p-0 md:grid-cols-2">
            {surtr.runes.map((rune, index) => (
              <li key={index} className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Said value={rune.name} scope={scope} className="font-semibold [&>p]:m-0" />
                  <span className={cx(numeric, "text-[12px] text-ink-3")}>{t.ricarica(rune.cooldown)}</span>
                </div>
                <Said value={rune.text} scope={scope} className="text-ink-2 [&>p]:m-0" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Reliquie, passive per questa bestia sola, Sangue cattivo. */
function BeastHeroes({ beast, scope, t }: { beast: NestBeast; scope: EndgameScope; t: T }) {
  if (beast.relics.length === 0 && beast.heroesOnly.length === 0 && beast.badBlood.length === 0) return null;
  return (
    <div className="mt-14 grid gap-10 border-t border-rule pt-10">
      {beast.heroesOnly.length > 0 ? (
        <div>
          <PartTitle>
            <span className="inline-flex items-center gap-2">
              <ConditionIcon condition="creaturenest" scope={scope} size={20} />
              {t.soloBestia}
            </span>
          </PartTitle>
          <HeroPassiveGrid entries={beast.heroesOnly} scope={scope} />
        </div>
      ) : null}

      {beast.badBlood.length > 0 ? (
        <div>
          <PartTitle>{t.sangueCattivo}</PartTitle>
          <p className="m-0 mb-2 text-[12px] text-ink-3">{t.sangueSpiega}</p>
          <HeroGrid ids={beast.badBlood} scope={scope} />
        </div>
      ) : null}

      {beast.relics.length > 0 ? (
        <details>
          <Summary className="font-display text-[17px] font-extrabold uppercase tracking-[0.02em] text-ink [font-variation-settings:'wdth'_85]">
            {t.reliquie(beast.relics.length)}
          </Summary>
          <ul className="m-0 mt-3 grid list-none gap-3 p-0">
            {beast.relics.map((relic, index) => (
              <li key={index} className="min-w-0">
                <p className="m-0 mb-1.5 text-[13px] font-semibold">{sayPlain(relic.name, scope)}</p>
                <HeroGrid ids={relic.heroes} scope={scope} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
