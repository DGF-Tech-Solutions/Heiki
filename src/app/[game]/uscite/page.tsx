import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { cx, display, eyebrow, numeric, Tag } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { gameIconSrc, heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { daysBetween, heroesIn, launchDate, pickRegion, releaseYears, type ReleaseOrder } from "@/lib/games/releases";
import { requireGameModule } from "@/lib/games/registry";
import type { HeroAffinity, HeroEntry, ReleaseHero, ReleaseRegion, ReleaseUpdate } from "@/lib/games/types";
import { inLingua, intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Uscite.
 *
 * Il calendario del gioco com'e' scritto nella sua fonte: un aggiornamento per
 * riga, con la data, gli eroi del banner, la rarita' e il modo di ottenerli, e
 * accanto le novita' della settimana. Per Grand Cross la fonte e' il foglio
 * delle uscite della community, indicato dall'utente: il client PC non porta
 * date. Per questo la fonte e' dichiarata in pagina.
 *
 * I calendari sono due, come nel foglio: il globale, il server di chi legge in
 * italiano, e quello di Giappone e Corea. Si parte dal globale. Fino al 26/09 la
 * pagina mostrava solo il giapponese, e prima dell'allineamento del novembre
 * 2024 date e ordine non erano quelli che un giocatore globale ricorda.
 *
 * Componente server, senza JavaScript nel browser: server, ordine e filtro
 * passano dall'indirizzo, come nella pagina Personaggi. Sono tre scelte, e si
 * cambiano di rado.
 *
 * Ogni eroe legato al roster porta alla sua scheda. Il legame lo fa la pipeline
 * (colore, rarita', personaggio e data del client), e dove non e' certo manca:
 * l'eroe resta scritto col nome del foglio, senza collegamento.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Uscite di ${gioco} · GachaZone`,
    descrizione: (gioco: string) =>
      `Il calendario delle uscite di ${gioco}: banner, date, eroi, rarità ed eventi, aggiornamento per aggiornamento.`,
    gioco: "gioco",
    questoGioco: "questo gioco",
    uscite: "Uscite",
    introduzione: (aggiornamenti: number, eroi: number, lancio: string) =>
      `${aggiornamenti} aggiornamenti e ${eroi} eroi dal lancio del ${lancio}: banner, eroi, rarità, come si ottengono ed eventi. Tocca un eroe per aprire la sua scheda.`,
    dateGlobale: (allineamento: string) =>
      `Le date sono quelle del server globale. Fino a novembre 2024 vengono dalla scheda globale del foglio, che da allora non si aggiorna più: le patch uscivano il martedì. Dal ${allineamento} il globale è allineato al Giappone ed esce lo stesso giorno, di solito il giovedì; i rari aggiornamenti arrivati il mercoledì prima riportano anche la data giapponese.`,
    dateGiappone: "Le date sono quelle di Giappone e Corea.",
    server: "Server",
    globale: "Globale",
    giappone: "Giappone e Corea",
    fonte: "Fonte",
    fonteTesto: (titolo: string, autori: string, data: string) =>
      `il foglio «${titolo}» di ${autori}, copia del ${data}. Le note sugli eventi sono quelle del foglio, in inglese.`,
    ordina: "Ordina",
    recenti: "Più recenti",
    primi: "Dal lancio",
    mostra: "Mostra",
    tutte: "Tutte le settimane",
    soloEroi: "Solo con eroi nuovi",
    anni: "Vai all'anno",
    eroiAnno: (n: number) => (n === 1 ? "1 eroe nuovo" : `${n} eroi nuovi`),
    numero: (n: string) => `n. ${n}`,
    numeroGiappone: (n: string) => `n. ${n} JP`,
    numeroGiapponeTitolo: "La numerazione del calendario giapponese",
    inGiappone: (data: string) => `JP ${data}`,
    inGiapponeTitolo: "Nel globale è uscito il giorno prima: questa è la data in Giappone e Corea",
    giorno: (n: string) => `giorno ${n}`,
    previsto: "in programma",
    lancio: "Lancio del gioco",
    eroiLancio: (n: number) => `I ${n} eroi del lancio`,
    lancioNota: "Il foglio non li elenca: vengono dalle date del roster.",
    nessunEroe: "Nessun eroe nuovo",
    nessunBanner: "Nessun eroe nuovo, nessun banner",
    armaUr: "Arma UR",
    reliquia: "Reliquia sacra",
    evoluzioneLr: "Evoluzione LR",
    tornano: "Tornano",
    cavalieri: "Ordine dei Cavalieri",
    guerra: (valore: string) => `Guerra d'élite ${valore}`,
    guerraTitolo: "Giappone / globale",
    boss: (nome: string) => `boss ${nome}`,
    arena: "Arena e Labirinto",
    stamina: "Stamina",
    dimezzata: "dimezzata",
    novita: "Novità",
    nelFoglio: (nome: string) => `Nel foglio: ${nome}`,
    diritti: (editore: string) =>
      `Immagini e nomi appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Releases · GachaZone`,
    descrizione: (gioco: string) =>
      `The ${gioco} release calendar: banners, dates, heroes, rarities and events, update by update.`,
    gioco: "game",
    questoGioco: "this game",
    uscite: "Releases",
    introduzione: (aggiornamenti: number, eroi: number, lancio: string) =>
      `${aggiornamenti} updates and ${eroi} heroes since launch on ${lancio}: banners, heroes, rarities, how to get them and events. Tap a hero to open their page.`,
    dateGlobale: (allineamento: string) =>
      `Dates are the global server's. Until November 2024 they come from the spreadsheet's global tab, no longer updated since then: patches came out on Tuesdays. From ${allineamento} global is in sync with Japan and releases the same day, usually Thursday; the few updates that arrived the Wednesday before also show the Japanese date.`,
    dateGiappone: "Dates are the Japanese and Korean ones.",
    server: "Server",
    globale: "Global",
    giappone: "Japan and Korea",
    fonte: "Source",
    fonteTesto: (titolo: string, autori: string, data: string) =>
      `the "${titolo}" spreadsheet by ${autori}, copy of ${data}. Event notes are the spreadsheet's own.`,
    ordina: "Sort",
    recenti: "Newest",
    primi: "From launch",
    mostra: "Show",
    tutte: "All weeks",
    soloEroi: "Only with new heroes",
    anni: "Jump to year",
    eroiAnno: (n: number) => (n === 1 ? "1 new hero" : `${n} new heroes`),
    numero: (n: string) => `no. ${n}`,
    numeroGiappone: (n: string) => `no. ${n} JP`,
    numeroGiapponeTitolo: "The Japanese calendar's numbering",
    inGiappone: (data: string) => `JP ${data}`,
    inGiapponeTitolo: "Global got it the day before: this is the date in Japan and Korea",
    giorno: (n: string) => `day ${n}`,
    previsto: "scheduled",
    lancio: "Game launch",
    eroiLancio: (n: number) => `The ${n} launch heroes`,
    lancioNota: "The spreadsheet does not list them: they come from the roster's dates.",
    nessunEroe: "No new heroes",
    nessunBanner: "No new heroes, no banner",
    armaUr: "UR gear",
    reliquia: "Holy Relic",
    evoluzioneLr: "LR evolution",
    tornano: "Returning",
    cavalieri: "Knighthood",
    guerra: (valore: string) => `Elite War ${valore}`,
    guerraTitolo: "Japan / global",
    boss: (nome: string) => `boss ${nome}`,
    arena: "Arena and Labyrinth",
    stamina: "Stamina",
    dimezzata: "halved",
    novita: "What's new",
    nelFoglio: (nome: string) => `In the spreadsheet: ${nome}`,
    diritti: (editore: string) =>
      `Images and names belong to ${editore} and are shown here for reference.`,
  },
});

type T = (typeof TESTI)[Locale];

interface Props {
  params: Promise<{ game: string }>;
  searchParams: Promise<{ server?: string; ordine?: string; solo?: string }>;
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

/** L'indirizzo della pagina con server, ordine e filtro: i default non si scrivono. */
function pageHref(game: string, region: ReleaseRegion, order: ReleaseOrder, onlyHeroes: boolean): string {
  const query = new URLSearchParams();
  if (region === "jp") query.set("server", "giappone");
  if (order !== "recenti") query.set("ordine", order);
  if (onlyHeroes) query.set("solo", "eroi");
  const search = query.toString();
  return `/${game}/uscite${search ? `?${search}` : ""}`;
}

export default async function ReleasesPage({ params, searchParams }: Props) {
  const { game } = await params;
  const { server, ordine, solo } = await searchParams;

  const entry = findGame(game);
  if (!entry) notFound();

  const { releases, roster, icons } = requireGameModule(game);
  // La voce di menu non compare senza calendario, ma l'indirizzo si puo' digitare.
  if (!releases || !roster) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];

  const region = pickRegion(releases, server === "giappone" ? "jp" : "global");
  const updates = region ? releases.schedules[region] : undefined;
  if (!region || !updates) notFound();
  const regions = (["global", "jp"] as const).filter((candidate) => releases.schedules[candidate]);

  const order: ReleaseOrder = ordine === "primi" ? "primi" : "recenti";
  const onlyHeroes = solo === "eroi";
  const years = releaseYears(updates, order, onlyHeroes);

  const heroes = new Map(roster.heroes.map((hero) => [hero.id, hero]));
  const affinities = new Map(roster.affinities.map((affinity) => [affinity.id, affinity]));
  const launch = launchDate(updates);
  // Oggi, per segnare le settimane che la fonte ha gia' scritto ma non sono
  // ancora arrivate. La pagina si costruisce a ogni richiesta (legge il cookie
  // della lingua), quindi la data e' sempre quella del giorno.
  const today = new Date().toISOString().slice(0, 10);

  const dateFormat = new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const shortDate = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", timeZone: "UTC" });
  const asDate = (value: string) => new Date(`${value}T00:00:00Z`);
  const count = (value: number) => value.toLocaleString(intlLocale(locale));

  const totalHeroes = updates.reduce((sum, update) => sum + heroesIn(update), 0);
  // Il giorno dell'allineamento nel globale: la prima riga presa dal calendario
  // giapponese.
  const syncGlobal = updates.find((update) => update.fromJp)?.date;

  const hasIcon = (family: string, key: string) => icons?.[family]?.includes(key) ?? false;

  const view: HeroView = { game, locale, t, heroes, affinities, hasIcon };

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.uscite }]} />

      <header className="mb-5 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>{t.uscite}</h1>
        <p className="mt-2.5 max-w-[72ch] text-sm text-ink-2">
          {t.introduzione(updates.length, totalHeroes, launch ? dateFormat.format(asDate(launch)) : "—")}
        </p>
        <p className="mt-1.5 max-w-[72ch] text-sm text-ink-2">
          {region === "global" ? t.dateGlobale(syncGlobal ? dateFormat.format(asDate(syncGlobal)) : "—") : t.dateGiappone}
        </p>
        <p className="mt-1.5 max-w-[72ch] text-[13px] text-ink-3">
          {t.fonte}:{" "}
          <a href={releases.source.url} className="text-ink-2 underline-offset-2 hover:text-brand hover:underline" rel="noopener noreferrer" target="_blank">
            {t.fonteTesto(
              region === "global" ? (releases.source.globalTitle ?? releases.source.title) : releases.source.title,
              releases.source.authors,
              dateFormat.format(asDate(releases.source.downloaded)),
            )}
          </a>
        </p>
      </header>

      <div className="mb-6 grid gap-3 rounded-card border border-rule bg-paper-2 p-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {regions.length > 1 ? (
            <ChipRow label={t.server}>
              {regions.map((candidate) => (
                <ChipLink
                  key={candidate}
                  href={pageHref(game, candidate, order, onlyHeroes)}
                  active={region === candidate}
                  label={candidate === "global" ? t.globale : t.giappone}
                />
              ))}
            </ChipRow>
          ) : null}
          <ChipRow label={t.ordina}>
            <ChipLink href={pageHref(game, region, "recenti", onlyHeroes)} active={order === "recenti"} label={t.recenti} />
            <ChipLink href={pageHref(game, region, "primi", onlyHeroes)} active={order === "primi"} label={t.primi} />
          </ChipRow>
          <ChipRow label={t.mostra}>
            <ChipLink href={pageHref(game, region, order, false)} active={!onlyHeroes} label={t.tutte} />
            <ChipLink href={pageHref(game, region, order, true)} active={onlyHeroes} label={t.soloEroi} />
          </ChipRow>
        </div>
        <nav aria-label={t.anni}>
          <ChipRow label={t.anni}>
            {years.map((group) => (
              <a
                key={group.year}
                href={`#anno-${group.year}`}
                className={cx(numeric, "rounded-card border border-rule bg-paper px-2.5 py-1.5 text-[12px] text-ink-2 hover:border-ink-3 hover:text-ink")}
              >
                {group.year}
              </a>
            ))}
          </ChipRow>
        </nav>
      </div>

      {years.map((group) => (
        <section key={group.year} id={`anno-${group.year}`} className="mb-8 scroll-mt-16">
          <div className="sticky top-[60px] z-10 mb-1 flex items-baseline gap-3 border-b border-rule bg-paper py-2">
            <h2 className={cx(display, numeric, "text-2xl")}>{group.year}</h2>
            <p className="m-0 text-[13px] text-ink-3">{t.eroiAnno(group.heroes)}</p>
          </div>

          <ol className="m-0 list-none p-0">
            {group.updates.map((update) => (
              <li
                key={update.date}
                id={`u-${update.date}`}
                className="grid scroll-mt-28 gap-x-5 gap-y-3 border-b border-rule-2 py-4 target:bg-brand-soft/40 sm:grid-cols-[104px_minmax(0,1fr)]"
              >
                <div>
                  <time dateTime={update.date} className={cx(numeric, "block text-[15px] font-semibold text-ink")}>
                    {shortDate.format(asDate(update.date))}
                  </time>
                  {/* Due righe e non una: nella colonna stretta "n. 380 · giorno 2655" andava a capo a meta'. */}
                  {update.number ? (
                    // Nel globale, dopo l'allineamento, le righe vengono dal
                    // calendario giapponese e ne tengono il numero: lo si dice,
                    // perche' salta dal 251 del globale al 284 del Giappone.
                    <p
                      className={cx(numeric, "m-0 mt-0.5 text-[11px] text-ink-3")}
                      title={update.fromJp ? t.numeroGiapponeTitolo : undefined}
                    >
                      {update.fromJp ? t.numeroGiappone(update.number) : t.numero(update.number)}
                    </p>
                  ) : null}
                  {update.jpDate ? (
                    // "JP" e non "in Giappone": nella colonna stretta andava a capo.
                    <p className={cx(numeric, "m-0 text-[11px] text-ink-3")} title={t.inGiapponeTitolo}>
                      {t.inGiappone(shortDate.format(asDate(update.jpDate)))}
                    </p>
                  ) : null}
                  {launch ? (
                    <p className={cx(numeric, "m-0 text-[11px] text-ink-3")}>
                      {t.giorno(count(daysBetween(launch, update.date)))}
                    </p>
                  ) : null}
                  {update.date > today ? <Tag className="mt-1.5">{t.previsto}</Tag> : null}
                </div>

                <div className="grid min-w-0 gap-x-6 gap-y-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                  <UpdateHeroes update={update} view={view} />
                  <UpdateNotes update={update} view={view} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">{t.diritti(entry.publisher)}</p>
    </main>
  );
}

/* ------------------------------------------------------------- eroi -- */

interface HeroView {
  game: string;
  locale: Locale;
  t: T;
  heroes: ReadonlyMap<string, HeroEntry>;
  affinities: ReadonlyMap<string, HeroAffinity>;
  hasIcon: (family: string, key: string) => boolean;
}

/** Gli eroi della riga, o cosa dice la riga quando non ce ne sono. */
function UpdateHeroes({ update, view }: { update: ReleaseUpdate; view: HeroView }) {
  const { t } = view;

  if (update.launch) {
    const launchHeroes = update.launchHeroes ?? [];
    return (
      <div className="min-w-0">
        <p className="m-0 text-[15px] font-semibold">{t.lancio}</p>
        {update.detail ? (
          <p lang="en" className="m-0 mt-1 text-[13px] text-ink-3">
            {update.detail}
          </p>
        ) : null}
        {launchHeroes.length > 0 ? (
          // Chiusi di partenza: sono 52, e aperti allungherebbero la pagina di
          // uno schermo e mezzo proprio in fondo, dove si arriva per altro.
          <details className="mt-3">
            <summary className="cursor-pointer text-[13px] text-ink-2 hover:text-brand">
              {t.eroiLancio(launchHeroes.length)}
            </summary>
            <p className="m-0 mt-1 text-[12px] text-ink-3">{t.lancioNota}</p>
            <ul className="m-0 mt-3 grid list-none gap-2 p-0 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
              {launchHeroes.map((id) => (
                <li key={id} className="min-w-0">
                  <HeroLink id={id} view={view} />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    );
  }

  if (update.heroes.length === 0) {
    return (
      <div className="min-w-0">
        {update.noHeroes ? (
          <p className="m-0 text-[13px] text-ink-3">{update.noHeroes === "banner" ? t.nessunBanner : t.nessunEroe}</p>
        ) : null}
        {update.detail || update.note ? (
          <p lang="en" className="m-0 mt-0.5 text-[13px] text-ink-2">
            {update.detail ?? update.note}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="m-0 grid min-w-0 list-none content-start gap-2 p-0 sm:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
      {update.heroes.map((hero, index) => (
        <li key={`${hero.name}-${index}`} className="min-w-0">
          <ReleaseHeroCard hero={hero} view={view} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Un eroe del banner: card, epiteto, nome, e sotto rarita' e modo di ottenerlo.
 *
 * Nome ed epiteto sono quelli del roster, nella lingua della pagina, e non
 * quelli del foglio: "Merlin (Kid)" dice il personaggio, "Merlin figlia di
 * Belialuin" dice quale delle sue versioni. Il nome del foglio resta nel
 * `title`, perche' e' quello con cui la riga si ritrova nella fonte.
 */
function ReleaseHeroCard({ hero, view }: { hero: ReleaseHero; view: HeroView }) {
  const { game, locale, heroes, hasIcon } = view;
  const entry = hero.heroId ? heroes.get(hero.heroId) : undefined;
  const method = inLingua(hero.method, locale);

  const meta = (
    <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] leading-tight text-ink-3">
      {hasIcon("rarita", hero.rarity) ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={gameIconSrc(game, "rarita", hero.rarity)}
          alt={hero.rarity}
          title={hero.rarity}
          width={18}
          height={18}
          className="inline-block h-[18px] w-auto"
        />
      ) : (
        <span className={cx(numeric, "font-semibold text-ink-2")}>{hero.rarity}</span>
      )}
      {/*
        Il Festival e' il banner piu' raro, e lo dice gia' il modo: diventa
        l'etichetta dorata AL POSTO del testo, non accanto. Accanto si leggeva
        "FESTIVAL Festival".
      */}
      {hero.festival ? (
        <Tag tone="gold">{method}</Tag>
      ) : (
        <span lang={hero.method.it && locale === "it" ? undefined : "en"}>{method}</span>
      )}
    </span>
  );

  if (!entry) {
    return (
      <div className="flex min-w-0 items-center gap-3 rounded-card border border-dashed border-rule p-2">
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold leading-tight">{hero.name}</span>
          {meta}
        </span>
      </div>
    );
  }

  return <HeroLink id={entry.id} view={view} meta={meta} sourceName={hero.name} />;
}

/** Il collegamento alla scheda: card piccola, epiteto nel colore dell'attributo, nome. */
function HeroLink({
  id,
  view,
  meta,
  sourceName,
}: {
  id: string;
  view: HeroView;
  meta?: React.ReactNode;
  sourceName?: string;
}) {
  const { game, locale, t, heroes, affinities } = view;
  const entry = heroes.get(id);
  if (!entry) return null;

  const name = heroName(entry, locale);
  const epithet = heroEpithet(entry, locale);
  const affinity = affinities.get(entry.affinity);

  return (
    <Link
      href={`/${game}/eroi/${entry.id}`}
      title={sourceName ? t.nelFoglio(sourceName) : undefined}
      className="group flex min-w-0 items-center gap-3 rounded-card border border-rule bg-paper p-2 transition-colors hover:border-ink-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {/* Immagine nuda come nella griglia: la card e' gia' pronta in due densita'. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroCardSrc(game, entry.id)}
        srcSet={`${heroCardSrc(game, entry.id)} 1x, ${heroCardSrc(game, entry.id, 2)} 2x`}
        alt=""
        width={52}
        height={52}
        loading="lazy"
        decoding="async"
        className="h-[52px] w-[52px] shrink-0 rounded-[3px] bg-paper-2"
      />
      <span className="min-w-0">
        <span
          className="block truncate text-[11px] leading-tight text-ink-3"
          style={affinity ? { color: affinity.color } : undefined}
        >
          {epithet}
        </span>
        <span className="block text-[13px] font-semibold leading-tight group-hover:text-brand">{name}</span>
        {meta}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------ novita' -- */

/**
 * Le colonne del foglio accanto agli eroi: armi UR, reliquie, evoluzioni LR,
 * ritorni, Ordine dei Cavalieri, arena, e le novita' della settimana.
 *
 * I testi sono quelli del foglio, in inglese, e lo dichiarano con `lang`: un
 * lettore di schermo li pronuncia con la voce giusta anche sul sito in
 * italiano. Solo le evoluzioni LR diventano collegamenti, perche' solo li' la
 * pipeline ha legato il nome a un eroe; armi e reliquie nominano personaggi, non
 * versioni, e un collegamento sarebbe una scelta nostra.
 */
function UpdateNotes({ update, view }: { update: ReleaseUpdate; view: HeroView }) {
  const { t, heroes, locale, game } = view;

  const rows: { label: string; value: React.ReactNode; title?: string }[] = [];
  if (update.lrEvolutions?.length) {
    rows.push({
      label: t.evoluzioneLr,
      value: update.lrEvolutions.map((lr, index) => {
        const entry = lr.heroId ? heroes.get(lr.heroId) : undefined;
        return (
          <span key={`${lr.name}-${index}`}>
            {index > 0 ? ", " : null}
            {entry ? (
              <Link href={`/${game}/eroi/${entry.id}`} className="text-ink hover:text-brand" title={t.nelFoglio(lr.name)}>
                {heroName(entry, locale)}
              </Link>
            ) : (
              <span lang="en">{lr.name}</span>
            )}
          </span>
        );
      }),
    });
  }
  if (update.urGear) rows.push({ label: t.armaUr, value: <span lang="en">{update.urGear}</span> });
  if (update.holyRelics) rows.push({ label: t.reliquia, value: <span lang="en">{update.holyRelics}</span> });
  if (update.reruns) rows.push({ label: t.tornano, value: <span lang="en">{update.reruns}</span> });
  if (update.knighthoodWar || update.knighthoodBoss) {
    rows.push({
      label: t.cavalieri,
      value: (
        <>
          {update.knighthoodWar ? <span title={t.guerraTitolo}>{t.guerra(update.knighthoodWar)}</span> : null}
          {update.knighthoodWar && update.knighthoodBoss ? " · " : null}
          {update.knighthoodBoss ? t.boss(update.knighthoodBoss) : null}
        </>
      ),
    });
  }
  if (update.arena) rows.push({ label: t.arena, value: <span lang="en">{update.arena}</span> });
  if (update.halfStamina) rows.push({ label: t.stamina, value: t.dimezzata });

  // Nelle righe con eroi la nota del foglio (un banner speciale) sta qui; nelle
  // altre l'ha gia' detta la colonna degli eroi.
  const note = update.heroes.length > 0 ? update.note : undefined;

  if (!update.events?.length && rows.length === 0 && !note) return null;

  return (
    <div className="min-w-0 text-[13px]">
      {note ? (
        <p lang="en" className="m-0 mb-2 text-ink-2">
          {note}
        </p>
      ) : null}

      {update.events?.length ? (
        <>
          <p className={cx(eyebrow, "m-0 mb-1")}>{t.novita}</p>
          <ul lang="en" className="m-0 grid list-none gap-0.5 p-0 text-ink-2">
            {update.events.map((event, index) => (
              <li key={`${event}-${index}`} className="relative pl-3.5 before:absolute before:left-0 before:text-ink-3 before:content-['·']">
                {event}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {rows.length > 0 ? (
        <dl className={cx("m-0 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3 gap-y-1", update.events?.length ? "mt-2.5" : "")}>
          {rows.map((row) => (
            <div key={row.label} className="contents">
              <dt className={cx(eyebrow, "pt-px")}>{row.label}</dt>
              <dd className="m-0 text-ink-2">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ comandi -- */

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className={eyebrow}>{label}</span>
      {children}
    </div>
  );
}

/**
 * Un pulsante che e' un collegamento: ordine e filtro stanno nell'indirizzo,
 * quindi si condividono e sopravvivono al ricaricamento senza JavaScript.
 */
function ChipLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      scroll={false}
      className={cx(
        "inline-flex h-9 items-center rounded-card border px-2.5 text-[12px] transition-colors",
        active
          ? "border-brand bg-brand-soft font-semibold text-ink"
          : "border-rule bg-paper text-ink-2 hover:border-ink-3 hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}
