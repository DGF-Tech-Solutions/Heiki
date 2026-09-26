import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { EndgameCard } from "@/components/endgame/endgame-card";
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
  PassiveList,
  RaceLabel,
  Said,
  endgameScope,
  say,
  sayPlain,
  type EndgameScope,
} from "@/components/endgame/endgame-parts";
import { cx, display, eyebrow, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { chosenLevel, endgameImageSrc, formatNumber, levelHref, type PageSearchParams } from "@/lib/games/endgame";
import type { DeathMatchBoss, DeathMatchDifficulty, DeathMatchIndex } from "@/lib/games/endgame-types";
import { requireGameModule } from "@/lib/games/registry";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Uno Scontro finale: un boss, le sue difficolta', le fasi, le ricompense.
 *
 * Una pagina per boss, come la scheda di un eroe (scelta dell'utente, 26/09):
 * prima i sei boss stavano tutti nella pagina della sezione, e c'era troppo da
 * scorrere. La difficolta' scelta sta nell'indirizzo (`?difficolta=4`) e il
 * server rende solo quel pannello; senza, si parte dalla piu' difficile.
 *
 * Quello che il client non scrive e la pipeline ha dedotto si vede come tale:
 * le statistiche del boss sono una stima dichiarata, l'attributo che lo batte
 * viene dal triangolo del gioco, e dove la finestra «Info mostro» contraddice le
 * passive del boss (Indura) la pagina lo dice invece di scegliere.
 */

const TESTI = testi({
  it: {
    titoloPagina: (boss: string, gioco: string) => `${boss} · Scontri finali di ${gioco} · GachaZone`,
    descrizione: (boss: string) =>
      `${boss}, Scontro finale: difficoltà, fasi, abilità, restrizioni della squadra e ricompense con le probabilità.`,
    sezione: "Scontri finali",
    stelle: (n: number) => `Battaglie boss ${n}☆`,
    stelleSpiega: (n: number) =>
      `Compare vincendo le Battaglie boss ${n}☆ del capitolo: ognuna alza il «Tasso scontro finale», e al 100% il boss invade il villaggio.`,
    loBatte: "Lo batte",
    loBatteSpiega:
      "L'attributo che batte il boss nel triangolo del gioco (Velocità batte Forza, Forza batte PS, PS batte Velocità). Il client non lo scrive per il boss: lo calcola.",
    regioni: "Dove compare",
    materiale: "Materiale",
    mammaHawk: "Scacciato con Mamma Hawk",
    avviso: "Attenzione",
    stima: "Le statistiche del boss sono stimate: il client non le scrive.",
    difficolta: "Difficoltà",
    livello: "Livello",
    energia: "Energia",
    potenza: "Potenza consigliata",
    fasi: "Fasi",
    squadra: "Squadra",
    sblocco: "Si sblocca con",
    tutti: "tutti gli attributi",
    soloAttributi: "solo questi attributi",
    esclusi: (n: number) => (n === 1 ? "1 eroe escluso" : `${n} eroi esclusi`),
    scegli: "Difficoltà",
    fase: (n: number) => `Fase ${n}`,
    ricompense: "Ricompense",
    garantita: "Vittoria garantita",
    drop: "A chi vince",
    leader: "Al leader del party",
    oro: "Oro",
    eroiEsclusi: "Eroi esclusi da questa difficoltà",
    squadraIa: "Squadra di supporto IA",
    potenzaMostrata: (n: string) => `potenza mostrata ${n}`,
    setArtefatti: "Set di artefatti",
    carte: "Carte",
    livelliSet: "Effetto per livello del set",
    costumi: "Costumi set",
    costumiEroi: (n: number) => (n === 1 ? "1 eroe" : `${n} eroi`),
    altri: "Gli altri Scontri finali",
    stelleBreve: (n: number) => `${n}☆`,
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (boss: string, gioco: string) => `${boss} · ${gioco} Death Match · GachaZone`,
    descrizione: (boss: string) =>
      `${boss}, Death Match: difficulties, phases, skills, team restrictions and rewards with their chances.`,
    sezione: "Death Match",
    stelle: (n: number) => `${n}☆ Boss Battles`,
    stelleSpiega: (n: number) =>
      `Appears by winning the chapter's ${n}☆ Boss Battles: each one raises the Death Match Rate, and at 100% the boss invades the village.`,
    loBatte: "Beaten by",
    loBatteSpiega:
      "The attribute that beats the boss in the game's triangle (Speed beats Strength, Strength beats HP, HP beats Speed). The client does not store it for the boss: it computes it.",
    regioni: "Where it appears",
    materiale: "Material",
    mammaHawk: "Repelled with Hawk's Mama",
    avviso: "Warning",
    stima: "The boss's stats are estimated: the client does not store them.",
    difficolta: "Difficulty",
    livello: "Level",
    energia: "Stamina",
    potenza: "Recommended power",
    fasi: "Phases",
    squadra: "Team",
    sblocco: "Unlocked by",
    tutti: "all attributes",
    soloAttributi: "only these attributes",
    esclusi: (n: number) => (n === 1 ? "1 hero banned" : `${n} heroes banned`),
    scegli: "Difficulty",
    fase: (n: number) => `Phase ${n}`,
    ricompense: "Rewards",
    garantita: "Guaranteed victory reward",
    drop: "For the winners",
    leader: "For the party leader",
    oro: "Gold",
    eroiEsclusi: "Heroes banned from this difficulty",
    squadraIa: "AI support team",
    potenzaMostrata: (n: string) => `shown power ${n}`,
    setArtefatti: "Artifact set",
    carte: "Cards",
    livelliSet: "Effect per set level",
    costumi: "Costume sets",
    costumiEroi: (n: number) => (n === 1 ? "1 hero" : `${n} heroes`),
    altri: "The other Death Matches",
    stelleBreve: (n: number) => `${n}☆`,
    diritti: (editore: string) => `Images and names belong to ${editore} and are here for reference.`,
  },
});

type T = (typeof TESTI)["it"];

const LEVEL_PARAM = "difficolta";

interface Props {
  params: Promise<{ game: string; boss: string }>;
  searchParams: Promise<PageSearchParams>;
}

function lookup(game: string, key: string) {
  const entry = findGame(game);
  if (!entry) return null;
  const gameModule = requireGameModule(game);
  const data = gameModule.deathMatch;
  const boss = data?.bosses.find((candidate) => candidate.key === key);
  if (!data || !boss) return null;
  return { entry, gameModule, data, boss };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, boss: key } = await params;
  const locale = await getLocale();
  const t = TESTI[locale];
  const found = lookup(game, key);
  if (!found) return {};
  const name = found.boss.name[locale] ?? found.boss.name.en ?? key;
  return { title: t.titoloPagina(name, found.entry.shortName), description: t.descrizione(name) };
}

export default async function DeathMatchBossPage({ params, searchParams }: Props) {
  const { game, boss: key } = await params;
  const query = await searchParams;
  const found = lookup(game, key);
  if (!found) notFound();

  const { entry, gameModule, data, boss } = found;
  const locale = await getLocale();
  const t = TESTI[locale];
  const scope = endgameScope(game, locale, gameModule, data);
  const regionNames = boss.regions.map((region) => say(data.regions[region]?.name, scope)).filter(Boolean);
  const current = chosenLevel(query, LEVEL_PARAM, boss.difficulties.map((level) => level.level));
  const chosen = boss.difficulties[current];
  const name = sayPlain(boss.name, scope);

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb
        items={[
          { label: entry.shortName, href: `/${game}` },
          { label: t.sezione, href: `/${game}/scontri-finali` },
          { label: name },
        ]}
      />

      <header className="mb-6 grid gap-5 border-b border-rule pb-6 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        {boss.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={endgameImageSrc(game, `scontri/${boss.key}.png`)}
            alt=""
            width={220}
            height={220}
            className="h-auto w-full max-w-[220px] rounded-card bg-paper-2"
          />
        ) : null}
        <div className="min-w-0">
          <p className={cx(eyebrow, "m-0")}>
            <span title={t.stelleSpiega(boss.stars)} className="cursor-help">
              {t.stelle(boss.stars)}
            </span>
          </p>
          <h1 className={cx(display, "mt-2 text-[clamp(24px,3.4vw,34px)]")}>{name}</h1>
          <p className="m-0 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <AttributeIcon code={boss.attribute} scope={scope} size={20} />
            <RaceLabel code={boss.race} scope={scope} />
            {boss.advantage ? (
              <span className="inline-flex items-center gap-1 text-[12px] text-ink-2" title={t.loBatteSpiega}>
                <span className="text-ink-3">{t.loBatte}</span>
                <AttributeIcon code={boss.advantage} scope={scope} size={18} />
              </span>
            ) : null}
          </p>

          <div className="mt-3">
            <Facts
              rows={[
                regionNames.length > 0 && [t.regioni, regionNames.join(" · ")],
                boss.material !== null && [t.materiale, <ItemLabel key="m" id={boss.material} scope={scope} />],
                boss.repulse.length > 0 && [t.mammaHawk, <Repulse key="r" boss={boss} scope={scope} />],
              ]}
            />
          </div>

          {boss.guide.length > 0 ? (
            <div className="mt-3 grid gap-1.5 text-[13px] text-ink-2">
              {boss.guide.map((line, index) => (
                <Said key={index} value={line} scope={scope} />
              ))}
            </div>
          ) : null}

          {boss.warnings.map((warning, index) => (
            <div key={index} className="mt-3 rounded-card border border-hot bg-hot-soft p-3 text-[13px] text-ink-2">
              <Tag className="mr-2">{t.avviso}</Tag>
              {say(warning, scope)}
            </div>
          ))}
          <p className="m-0 mt-3 text-[12px] text-ink-3">{t.stima}</p>
        </div>
      </header>

      <section id="difficolta" className="scroll-mt-20">
        <LevelsTable boss={boss} scope={scope} t={t} />
        <div className="mt-6">
          <DifficultyLinks
            legend={t.scegli}
            current={current}
            tabs={boss.difficulties.map((level) => ({
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

      <BossExtras
        boss={boss}
        scope={scope}
        t={t}
        // il set ha la sua pagina nella sezione Set artefatto: lo stesso nome del client
        setHref={(() => {
          const set = gameModule.artifacts?.sets.find(
            (entry) => boss.artifactSet && entry.name.en === boss.artifactSet.name.en,
          );
          return set ? `/${game}/set-artefatto/${set.number}` : null;
        })()}
      />

      <section className="mt-10 border-t border-rule pt-6">
        <PartTitle>{t.altri}</PartTitle>
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {data.bosses.map((other) => (
            <li key={other.key} className="min-w-0">
              <EndgameCard
                href={`/${game}/scontri-finali/${other.key}`}
                image={other.icon ? endgameImageSrc(game, `scontri/${other.key}-icona.png`) : null}
                kicker={t.stelleBreve(other.stars)}
                title={sayPlain(other.name, scope)}
                compact
                current={other.key === boss.key}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 grid gap-1 border-t border-rule-2 pt-4">
        <DropNote scope={scope} />
        <p className="m-0 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
      </div>
    </main>
  );
}

/**
 * Cosa si riceve scacciando il boss con Mamma Hawk: l'oggetto e l'aggiunta.
 *
 * Il client le scrive in due campi (`repulse_drop` e `add_repulse_drop`) e
 * quasi sempre sono lo stesso oggetto: «Corno ×4, Corno ×1» in fila sembrava un
 * doppione. Diventa «Corno ×4 (+1)»; se un giorno fossero oggetti diversi,
 * restano due.
 */
function Repulse({ boss, scope }: { boss: DeathMatchBoss; scope: EndgameScope }) {
  const [main, extra, ...rest] = boss.repulse;
  if (!main) return null;
  if (!extra || extra.id !== main.id || rest.length > 0) return <Amounts amounts={boss.repulse} scope={scope} />;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <ItemLabel id={main.id} count={main.count} scope={scope} />
      <span className={cx(numeric, "text-ink-3")}>(+{formatNumber(extra.count, scope.locale)})</span>
    </span>
  );
}

/** Le difficolta' a confronto, in una tabella: si legge prima di scegliere il pulsante. */
function LevelsTable({ boss, scope, t }: { boss: DeathMatchBoss; scope: EndgameScope; t: T }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-rule text-left">
            {[t.difficolta, t.livello, t.energia, t.potenza, t.fasi, t.squadra, t.sblocco].map((head) => (
              <th key={head} className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {boss.difficulties.map((level) => (
            <tr key={level.level} className="border-b border-rule-2">
              <td className="py-1.5 pr-3 font-semibold">{say(level.name, scope)}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.bossLevel}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.energy}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{formatNumber(level.power, scope.locale)}</td>
              <td className={cx(numeric, "py-1.5 pr-3")}>{level.phases.length}</td>
              <td className="py-1.5 pr-3">
                <TeamRule level={level} scope={scope} t={t} />
              </td>
              <td className="py-1.5 pr-3 text-ink-2">{level.unlock ? sayPlain(level.unlock, scope) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamRule({ level, scope, t }: { level: DeathMatchDifficulty; scope: EndgameScope; t: T }) {
  if (!level.allowedAttributes && level.bannedHeroes.length === 0) {
    return <span className="text-ink-3">{t.tutti}</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {level.allowedAttributes ? (
        <span className="inline-flex items-center gap-1" title={t.soloAttributi}>
          {level.allowedAttributes.map((code) => (
            <AttributeIcon key={code} code={code} scope={scope} size={16} />
          ))}
        </span>
      ) : null}
      {level.bannedHeroes.length > 0 ? <span className="text-ink-2">{t.esclusi(level.bannedHeroes.length)}</span> : null}
    </span>
  );
}

/** Una difficolta': le fasi coi loro nemici, poi le ricompense. */
function LevelPanel({
  level,
  data,
  scope,
  t,
}: {
  level: DeathMatchDifficulty;
  data: DeathMatchIndex;
  scope: EndgameScope;
  t: T;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 xl:grid-cols-2">
        {level.phases.map((phase, index) => (
          <FoeCard key={index} foe={phase.foe} scope={scope} heading={t.fase(index + 1)} />
        ))}
      </div>

      {level.bannedHeroes.length > 0 ? (
        <div>
          <PartTitle>{t.eroiEsclusi}</PartTitle>
          <HeroGrid ids={level.bannedHeroes} scope={scope} />
        </div>
      ) : null}

      <div>
        <PartTitle>{t.ricompense}</PartTitle>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            {level.guaranteed.length > 0 ? (
              <div>
                <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.garantita}</p>
                <Amounts amounts={level.guaranteed} scope={scope} />
              </div>
            ) : null}
            <DropTable drops={level.leader} scope={scope} regions={data.regions} title={t.leader} />
            <Facts rows={[[t.oro, <span key="o" className={numeric}>{formatNumber(level.gold, scope.locale)}</span>]]} />
          </div>
          <DropTable drops={level.drops} scope={scope} regions={data.regions} title={t.drop} />
        </div>
      </div>
    </div>
  );
}

/** Quello che non cambia con la difficolta': squadra IA, set di artefatti, costumi. */
function BossExtras({
  boss,
  scope,
  t,
  setHref,
}: {
  boss: DeathMatchBoss;
  scope: EndgameScope;
  t: T;
  /** la pagina del set nella sezione Set artefatto, se c'e' */
  setHref: string | null;
}) {
  if (!boss.aiTeam && !boss.artifactSet && boss.costumeSets.length === 0) return null;
  return (
    <div className="mt-8 grid gap-5 border-t border-rule pt-6 lg:grid-cols-2">
      {boss.aiTeam ? (
        <div className="min-w-0">
          <PartTitle>
            {t.squadraIa}{" "}
            <span className={cx(numeric, "text-[12px] font-normal text-ink-3")}>
              · {t.potenzaMostrata(formatNumber(boss.aiTeam.power, scope.locale))}
            </span>
          </PartTitle>
          <HeroGrid ids={boss.aiTeam.heroes} scope={scope} />
        </div>
      ) : null}

      {boss.artifactSet ? (
        <div className="min-w-0">
          <PartTitle>
            {t.setArtefatti}:{" "}
            {setHref ? (
              <Link href={setHref} className="text-brand underline-offset-2 hover:underline">
                {sayPlain(boss.artifactSet.name, scope)}
              </Link>
            ) : (
              sayPlain(boss.artifactSet.name, scope)
            )}
          </PartTitle>
          <Facts rows={[[t.carte, boss.artifactSet.cards.map((card) => sayPlain(card, scope)).join(" · ")]]} />
          {boss.artifactSet.levels.length > 0 ? (
            <div className="mt-3">
              <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.livelliSet}</p>
              <PassiveList ids={boss.artifactSet.levels} scope={scope} />
            </div>
          ) : null}
        </div>
      ) : null}

      {boss.costumeSets.length > 0 ? (
        <div className="min-w-0 lg:col-span-2">
          <PartTitle>{t.costumi}</PartTitle>
          <ul className="m-0 grid list-none gap-3 p-0 lg:grid-cols-2">
            {boss.costumeSets.map((set, index) => (
              <li key={index} className="min-w-0 rounded-card border border-rule p-3">
                <p className="m-0 text-[13px] font-semibold">{sayPlain(set.name, scope)}</p>
                <Said value={set.effect} scope={scope} className="mt-1 text-[13px] text-ink-2 [&>p]:m-0" />
                {set.heroes.length > 0 ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[13px] text-ink-2 hover:text-brand">
                      {t.costumiEroi(set.heroes.length)}
                    </summary>
                    <div className="mt-2">
                      <HeroGrid ids={set.heroes} scope={scope} />
                    </div>
                  </details>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
