import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountEditor, type EditorData } from "@/components/account-buff/account-editor";
import { Breadcrumb } from "@/components/breadcrumb";
import { GameText } from "@/components/heroes/game-text";
import { cx, display, eyebrow, numeric } from "@/components/ui";
import type { AccountStatKey, StatBag, StoneColor } from "@/lib/games/account-buff-types";
import { STAT_ORDER, buffImageSrc, constellationTotals } from "@/lib/games/account-buff";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Buff dell'account: la classe di combattimento dell'account e le costellazioni.
 *
 * Richiesta dell'utente del 26/09: «tenere conto della classe di combattimento
 * dei personaggi e dell'account, e delle costellazioni: riesci a trovarne i
 * funzionamenti in gioco? Se sì vorrei implementarle nel sito». Scelte: una
 * pagina che spiega i due sistemi, le costellazioni pietra per pietra, e nello
 * slider della scheda eroe comandi come quelli di livello e Risveglio.
 *
 * In cima l'editor del tuo account (salvato nel browser, lo stesso che legge lo
 * slider di ogni scheda); sotto come funziona, con le tabelle del client. Quello
 * che viene dal CODICE del client e non dalle tabelle (come si sommano, dove
 * contano) l'ha letto la pipeline, e lo studio sta in BUFF_ACCOUNT.md.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Buff dell'account di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco}: la classe di combattimento dell'account e i suoi titoli, le costellazioni pietra per pietra, e come cambiano le statistiche in battaglia di ogni eroe.`,
    database: "Database",
    titolo: "Buff dell'account",
    introduzione:
      "Due sistemi del gioco alzano le statistiche di tutti i tuoi eroi: i titoli della classe di combattimento dell'account e le costellazioni. Né la schermata delle statistiche dell'eroe né la sua classe di combattimento li mostrano: contano in battaglia. Qui sotto scegli i tuoi, e le schede degli eroi li aggiungono.",
    fonte:
      "Fonte: le tabelle, i testi e il codice del client del gioco. Le posizioni delle pietre sono quelle delle mappe del gioco.",
    tuo: "Il tuo account",
    tuoIntro:
      "Si salva in questo browser e vale per tutte le schede degli eroi, dove le statistiche prendono una seconda colonna, «In battaglia».",
    eroiLink: "Vai agli eroi",
    classeTitolo: "La classe di combattimento dell'account",
    classeIntro: (soglie: number) =>
      `È la somma delle classi di combattimento di tutti i tuoi eroi, con equipaggiamento, costumi e risvegli. Superata una soglia si ottiene un titolo: le soglie sono ${soglie}, da 500.000 a 25.000.000, e ognuna aumenta Attacco, Difesa o PS in percentuale.`,
    classeRegola:
      "Vale un titolo solo, il più alto raggiunto: i titoli precedenti non si sommano. La percentuale si calcola sulla statistica dell'eroe prima delle passive, cioè livello, risvegli, equipaggiamento, costumi e reliquia.",
    classeDifetto:
      "Un difetto del gioco: i titoli da 750.000 e 1.250.000 dicono «PS», ma le loro passive sono di Difesa. Il gioco applica la passiva: a quelle due soglie si ottiene Difesa, e niente PS.",
    soglia: "Soglia",
    attacco: "Attacco",
    difesa: "Difesa",
    ps: "PS",
    punti: "Punti Crescita",
    ilTestoDice: (testo: string) => `il testo dice: ${testo}`,
    costellazioniTitolo: "Le costellazioni",
    costellazioniIntro: (eroi: number) =>
      `Undici mappe di pietre: prima le Sette Costellazioni, poi quelle dei Quattro Cavalieri, da completare in ordine. Si aprono con ${eroi} eroi e si attivano coi Punti Crescita. Ogni mappa ha pietre fisse, che danno una statistica in percentuale, quindici pietre del mana (Attacco, Difesa o PS, con un valore casuale) e un bonus quando è completa.`,
    costellazioniRegola:
      "Si sommano alle statistiche in battaglia dopo la percentuale del titolo, come valori fissi: il titolo non le moltiplica. Non valgono nella squadra registrata per la classe dell'Ordine dei Cavalieri.",
    costellazione: "Costellazione",
    pietre: "Pietre",
    pietreFisse: "Le pietre fisse, tutte attivate",
    pietreMana: "Pietre del mana (5 per tipo)",
    completamento: "Bonus di completamento",
    manaTitolo: "Pietre del mana e Caos",
    manaIntro:
      "Ogni pietra del mana ha tre fasce di valori, e il Caos delle Costellazioni le ritira. Salendo di livello il Caos rende più probabile la fascia alta. La tabella vale per tutte le pietre del mana.",
    livello: (n: number) => `Caos liv. ${n}`,
    fascia: (n: number) => `Fascia ${n}`,
    eroeTitolo: "La classe di combattimento di un eroe",
    eroeIntro:
      "Il gioco moltiplica ogni statistica per un peso e somma; le percentuali contano per punto (18% di Possibilità critico vale 18 × 5 = 90). Poi aggiunge 500 per la passiva unica, 400 per ogni rango dell'ultimate, 1.500 col Vero risveglio (una volta sola, anche coi due tipi) e 1.000 col legame attivo in squadra, e arrotonda per eccesso.",
    eroeNota:
      "Titoli e costellazioni non entrano nella classe. Resistenza ai danni e Amplificazione danni pesano 0: il gioco cerca un peso che la configurazione non ha.",
    statistica: "Statistica",
    peso: "Peso",
    perPunto: "per punto %",
    perUnita: "per unità",
    doveTitolo: "Dove contano",
    dove: [
      "In battaglia: sì, tutti e due, in ogni contenuto (la costellazione tranne la squadra per la classe dell'Ordine dei Cavalieri).",
      "Nella schermata delle statistiche dell'eroe: no. Il gioco mostra le statistiche senza titoli né costellazioni.",
      "Nella classe di combattimento dell'eroe e dell'account: no.",
    ],
    diritti: (editore: string) => `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Account Buffs · GachaZone`,
    descrizione: (gioco: string) =>
      `${gioco}: the account Combat Class and its titles, the constellations stone by stone, and how they change every hero's stats in battle.`,
    database: "Database",
    titolo: "Account Buffs",
    introduzione:
      "Two game systems raise the stats of all your heroes: the account Combat Class titles and the constellations. Neither the hero's stat screen nor their Combat Class shows them: they count in battle. Pick yours below, and the hero pages add them.",
    fonte:
      "Source: the game client's tables, texts and code. The stone positions are those of the game's maps.",
    tuo: "Your account",
    tuoIntro:
      "It is saved in this browser and applies to every hero page, where the stats get a second column, «In battle».",
    eroiLink: "Go to the heroes",
    classeTitolo: "The account Combat Class",
    classeIntro: (soglie: number) =>
      `It is the sum of the Combat Class of all your heroes, with gear, costumes and awakenings. Passing a threshold grants a title: there are ${soglie} thresholds, from 500,000 to 25,000,000, and each raises Attack, Defense or HP by a percentage.`,
    classeRegola:
      "Only one title applies, the highest reached: earlier titles don't add up. The percentage is taken on the hero's stat before passives, that is level, awakenings, gear, costumes and relic.",
    classeDifetto:
      "A game bug: the 750,000 and 1,250,000 titles say «HP», but their passives are Defense. The game applies the passive: at those two thresholds you get Defense, and no HP.",
    soglia: "Threshold",
    attacco: "Attack",
    difesa: "Defense",
    ps: "HP",
    punti: "Growth Points",
    ilTestoDice: (testo: string) => `the text says: ${testo}`,
    costellazioniTitolo: "The constellations",
    costellazioniIntro: (eroi: number) =>
      `Eleven maps of stones: first the Seven Constellations, then the Four Knights ones, to be completed in order. They open with ${eroi} heroes and are activated with Growth Points. Each map has fixed stones, which grant a percentage stat, fifteen Mana Stones (Attack, Defense or HP, with a random value) and a bonus once complete.`,
    costellazioniRegola:
      "They are added to the stats in battle after the title's percentage, as flat values: the title doesn't multiply them. They don't apply to the team registered for the Knighthood Combat Class.",
    costellazione: "Constellation",
    pietre: "Stones",
    pietreFisse: "Fixed stones, all activated",
    pietreMana: "Mana Stones (5 per type)",
    completamento: "Completion bonus",
    manaTitolo: "Mana Stones and Chaos",
    manaIntro:
      "Every Mana Stone has three value tiers, and Chaos of Constellations rerolls them. As Chaos levels up the high tier gets more likely. The table holds for every Mana Stone.",
    livello: (n: number) => `Chaos Lv. ${n}`,
    fascia: (n: number) => `Tier ${n}`,
    eroeTitolo: "A hero's Combat Class",
    eroeIntro:
      "The game multiplies each stat by a weight and adds up; percentages count per point (18% Crit Chance is 18 × 5 = 90). Then it adds 500 for the Unique passive, 400 per Ultimate Move rank, 1,500 with True Awakening (once, even with both types) and 1,000 with the bond active in the team, and rounds up.",
    eroeNota:
      "Titles and constellations don't enter Combat Class. Damage Resistance and Damage Amplification weigh 0: the game looks up a weight the configuration doesn't have.",
    statistica: "Stat",
    peso: "Weight",
    perPunto: "per % point",
    perUnita: "per unit",
    doveTitolo: "Where they count",
    dove: [
      "In battle: yes, both, in every content (the constellations except for the Knighthood Combat Class team).",
      "On the hero's stat screen: no. The game shows the stats without titles or constellations.",
      "In the hero's and the account's Combat Class: no.",
    ],
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
  return { title: t.titoloPagina(entry?.shortName ?? game), description: t.descrizione(entry?.name ?? game) };
}

const numero = (n: number, locale: Locale) =>
  n.toLocaleString(intlLocale(locale), { useGrouping: "always", maximumFractionDigits: 2 });

const COLORS: readonly StoneColor[] = ["red", "blue", "green"];

export default async function AccountBuffPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();

  const data = requireGameModule(game).accountBuff;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const say = (value: Parameters<typeof inLingua>[0]) => inLingua(value, locale) ?? "";
  const stats = Object.fromEntries(data.stats.map((stat) => [stat.key, { name: say(stat.name), percent: stat.percent }])) as Record<
    AccountStatKey,
    { name: string; percent: boolean }
  >;
  const icon = (name: string) => (data.icons.includes(name) ? buffImageSrc(game, `icone/${name}.png`) : null);
  const symbolSrc = (id: number, has: boolean) => (has ? buffImageSrc(game, `simboli/${id}.png`) : null);

  const editor: EditorData = {
    version: data.version,
    tiers: data.accountPower.tiers.map(({ threshold, atk, def, hp }) => ({ threshold, atk, def, hp })),
    constellations: data.constellations.map((c) => ({
      ...c,
      label: say(c.name),
      short: say(c.shortName),
      symbolSrc: symbolSrc(c.id, c.symbol),
    })),
    mana: data.mana,
    stats,
    stoneNames: Object.fromEntries(COLORS.map((color) => [color, say(data.names.stones[color])])) as Record<StoneColor, string>,
    manaNames: Object.fromEntries(COLORS.map((color) => [color, say(data.names.manaStones[color])])) as Record<StoneColor, string>,
    stoneSrc: Object.fromEntries(COLORS.map((color) => [color, icon(`constellation_${color}stone`)])) as Record<StoneColor, string | null>,
    manaSrc: Object.fromEntries(COLORS.map((color) => [color, icon(`constellation_${color}manastone`)])) as Record<
      StoneColor,
      string | null
    >,
  };

  const totals = data.constellations.map((c) => ({
    constellation: c,
    totals: constellationTotals(c, data.mana, say(c.name), symbolSrc(c.id, c.symbol)),
  }));
  const fixedKeys = STAT_ORDER.filter((key) => totals.some(({ totals: sums }) => sums.stones[key]));
  const bag = (sums: StatBag) =>
    STAT_ORDER.filter((key) => sums[key])
      .map((key) => `${stats[key].name} +${numero(sums[key]!, locale)}${stats[key].percent ? "%" : ""}`)
      .join(" · ");
  const manaRanges = (sums: { min: StatBag; max: StatBag }) =>
    (["atk", "def", "hp"] as const)
      .filter((key) => sums.max[key])
      .map((key) => `${stats[key].name} ${numero(sums.min[key]!, locale)}-${numero(sums.max[key]!, locale)}`)
      .join(" · ");
  const rates = Object.values(data.mana)[0]?.tiers ?? [];
  const levels = [1, 5, 10, 15, 20];
  const bugged = data.accountPower.tiers.filter((tier) => tier.textSays);

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      <header className="mb-6 border-b border-rule pb-5">
        <p className={eyebrow}>{t.database}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.titolo}</h1>
        <p className="mt-2.5 max-w-[72ch] text-sm text-ink-2">{t.introduzione}</p>
        <p className="mt-1.5 max-w-[72ch] text-[13px] text-ink-3">{t.fonte}</p>
      </header>

      <section id="il-tuo-account" className="scroll-mt-20">
        <h2 className={cx(display, "text-2xl")}>{t.tuo}</h2>
        <p className="mt-1.5 max-w-[72ch] text-[13px] text-ink-2">
          {t.tuoIntro}{" "}
          <Link href={`/${game}/eroi`} className="text-brand underline-offset-2 hover:underline">
            {t.eroiLink}
          </Link>
          .
        </p>
        <div className="mt-4">
          <AccountEditor game={game} data={editor} />
        </div>
      </section>

      <section id="classe-account" className="mt-12 scroll-mt-20 border-t border-rule pt-8">
        <h2 className={cx(display, "text-2xl")}>{t.classeTitolo}</h2>
        <div className="mt-3 grid max-w-[72ch] gap-2 text-[13px] text-ink-2">
          <p className="m-0">{t.classeIntro(data.accountPower.tiers.length)}</p>
          <p className="m-0">{t.classeRegola}</p>
          {data.texts.powerRule ? (
            <GameText text={say(data.texts.powerRule)} className="rounded-card border border-rule bg-paper-2 px-3 py-2 text-ink-3" />
          ) : null}
          {bugged.length ? <p className="m-0">{t.classeDifetto}</p> : null}
        </div>
        <div className="mt-4 max-h-[520px] max-w-[640px] overflow-auto rounded-card border border-rule">
          <table className="w-full border-collapse text-[13px]">
            <thead className="sticky top-0 bg-paper-2">
              <tr className="border-b border-rule text-left">
                <th className={cx(eyebrow, "px-3 py-1.5 font-medium")}>{t.soglia}</th>
                <th className={cx(eyebrow, "px-3 py-1.5 text-right font-medium")}>{t.attacco}</th>
                <th className={cx(eyebrow, "px-3 py-1.5 text-right font-medium")}>{t.difesa}</th>
                <th className={cx(eyebrow, "px-3 py-1.5 text-right font-medium")}>{t.ps}</th>
                <th className={cx(eyebrow, "px-3 py-1.5 text-right font-medium")}>{t.punti}</th>
              </tr>
            </thead>
            <tbody>
              {data.accountPower.tiers.map((tier) => (
                <tr key={tier.threshold} className="border-b border-rule-2 align-top">
                  <td className={cx(numeric, "px-3 py-1")}>
                    {numero(tier.threshold, locale)}
                    {tier.textSays ? (
                      <span className="block text-[11px] text-ink-3">
                        {t.ilTestoDice(say(tier.textSays).replace("{0}", numero(tier.def || tier.hp, locale)))}
                      </span>
                    ) : null}
                  </td>
                  <td className={cx(numeric, "px-3 py-1 text-right")}>{tier.atk ? `${numero(tier.atk, locale)}%` : "—"}</td>
                  <td className={cx(numeric, "px-3 py-1 text-right")}>{tier.def ? `${numero(tier.def, locale)}%` : "—"}</td>
                  <td className={cx(numeric, "px-3 py-1 text-right")}>{tier.hp ? `${numero(tier.hp, locale)}%` : "—"}</td>
                  <td className={cx(numeric, "px-3 py-1 text-right text-ink-3")}>{tier.growthPoints || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="costellazioni" className="mt-12 scroll-mt-20 border-t border-rule pt-8">
        <h2 className={cx(display, "text-2xl")}>{t.costellazioniTitolo}</h2>
        <div className="mt-3 grid max-w-[72ch] gap-2 text-[13px] text-ink-2">
          <p className="m-0">{t.costellazioniIntro(data.rules.heroesToOpen)}</p>
          <p className="m-0">{t.costellazioniRegola}</p>
          {data.texts.guide ? (
            <GameText text={say(data.texts.guide)} className="rounded-card border border-rule bg-paper-2 px-3 py-2 text-ink-3" />
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-rule text-left">
                <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.costellazione}</th>
                <th className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>{t.pietre}</th>
                <th className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>{t.punti}</th>
                <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.pietreMana}</th>
                <th className={cx(eyebrow, "py-1.5 font-medium")}>{t.completamento}</th>
              </tr>
            </thead>
            <tbody>
              {totals.map(({ constellation, totals: sums }) => (
                <tr key={constellation.id} className="border-b border-rule-2 align-top">
                  <td className="py-1.5 pr-3">
                    <span className="inline-flex items-center gap-2">
                      {sums.symbol ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={sums.symbol} alt="" width={140} height={140} loading="lazy" className="h-7 w-7 shrink-0" />
                      ) : null}
                      {sums.name}
                    </span>
                  </td>
                  <td className={cx(numeric, "py-1.5 pr-3 text-right")}>{constellation.stones.length - 1}</td>
                  <td className={cx(numeric, "py-1.5 pr-3 text-right")}>{numero(constellation.growthPoints, locale)}</td>
                  <td className="py-1.5 pr-3 text-ink-2">{manaRanges(sums.mana)}</td>
                  <td className="py-1.5 text-ink-2">{bag(sums.completion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-[15px] font-semibold">{t.pietreFisse}</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-rule text-left">
                <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.costellazione}</th>
                {fixedKeys.map((key) => (
                  <th key={key} className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>
                    {stats[key].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {totals.map(({ constellation, totals: sums }) => (
                <tr key={constellation.id} className="border-b border-rule-2">
                  <td className="py-1 pr-3">{sums.name}</td>
                  {fixedKeys.map((key) => (
                    <td key={key} className={cx(numeric, "py-1 pr-3 text-right")}>
                      {sums.stones[key] ? `${numero(sums.stones[key]!, locale)}%` : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-[15px] font-semibold">{t.manaTitolo}</h3>
        <div className="mt-1 grid max-w-[72ch] gap-2 text-[13px] text-ink-2">
          <p className="m-0">{t.manaIntro}</p>
          {data.texts.chaos.map((text, position) => (
            <GameText key={position} text={say(text)} className="text-ink-3" />
          ))}
          {data.texts.rates ? <GameText text={say(data.texts.rates)} className="text-ink-3" /> : null}
        </div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full max-w-[520px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-rule text-left">
                <th className="py-1.5 pr-3" />
                {rates.map((_, position) => (
                  <th key={position} className={cx(eyebrow, "py-1.5 pr-3 text-right font-medium")}>
                    {t.fascia(position + 1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => (
                <tr key={level} className="border-b border-rule-2">
                  <td className="py-1 pr-3 text-ink-2">{t.livello(level)}</td>
                  {rates.map((tier, position) => (
                    <td key={position} className={cx(numeric, "py-1 pr-3 text-right")}>
                      {tier.rates[level - 1]}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="classe-eroe" className="mt-12 scroll-mt-20 border-t border-rule pt-8">
        <h2 className={cx(display, "text-2xl")}>{t.eroeTitolo}</h2>
        <div className="mt-3 grid max-w-[72ch] gap-2 text-[13px] text-ink-2">
          {data.texts.heroPower ? <GameText text={say(data.texts.heroPower)} className="text-ink-3" /> : null}
          <p className="m-0">{t.eroeIntro}</p>
          <p className="m-0">{t.eroeNota}</p>
        </div>
        <table className="mt-3 w-full max-w-[420px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-rule text-left">
              <th className={cx(eyebrow, "py-1.5 pr-3 font-medium")}>{t.statistica}</th>
              <th className={cx(eyebrow, "py-1.5 text-right font-medium")}>{t.peso}</th>
            </tr>
          </thead>
          <tbody>
            {data.stats.map((stat) => (
              <tr key={stat.key} className="border-b border-rule-2">
                <td className="py-1 pr-3">{say(stat.name)}</td>
                <td className={cx(numeric, "py-1 text-right")}>
                  {numero(stat.weight, locale)}{" "}
                  <span className="text-[12px] text-ink-3">{stat.percent ? t.perPunto : t.perUnita}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="dove-contano" className="mt-12 scroll-mt-20 border-t border-rule pt-8">
        <h2 className={cx(display, "text-2xl")}>{t.doveTitolo}</h2>
        <ul className="mt-3 grid max-w-[72ch] list-disc gap-1.5 pl-5 text-[13px] text-ink-2">
          {t.dove.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}
