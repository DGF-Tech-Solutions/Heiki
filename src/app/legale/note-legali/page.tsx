import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactEmail, LastUpdated, Missing, OperatorDetails, TableScroll } from "@/components/legal/legal-parts";
import { PageHeader } from "@/components/ui";
import { enabledOauthProviders } from "@/lib/auth/config";
import { roleLabel } from "@/lib/auth/permissions";
import { listGames, type GameEntry } from "@/lib/games/catalog";
import { isCollab } from "@/lib/games/randomizer";
import { getGameModule } from "@/lib/games/registry";
import type { ReleaseCalendar, ReleaseRegion } from "@/lib/games/types";
import { intlLocale, testi, type Bilingual, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { RIGHTS_RESPONSE_WORKING_DAYS } from "@/lib/legal/commitments";
import { legalDocument, type LegalDocumentKey } from "@/lib/legal/documents";
import { HOSTING } from "@/lib/legal/operator";
import { RETENTION } from "@/lib/legal/retention";
import { SITE_NAME } from "@/lib/site";

/**
 * Note legali: chi gestisce Heiki, come raggiungerlo, di chi sono i giochi di
 * cui parla e da dove vengono i dati.
 *
 * E' la pagina che l'art. 7 del D.Lgs. 70/2003 vuole raggiungibile «in modo
 * diretto e permanente» (sta nel pie' di pagina, da LEGAL_DOCUMENTS), con i
 * punti di contatto del DSA (artt. 11 e 12 del Reg. UE 2022/2065).
 *
 * Un blocco JSX intero per lingua, come gli altri documenti legali: l'inglese
 * dice le stesse cose nello stesso ordine. Quello che il codice sa gia' non e'
 * scritto a mano: i dati del gestore e dell'hosting vengono da operator.ts (o
 * il segno che mancano), i tempi da commitments.ts e retention.ts, il foglio
 * delle uscite, le date che non vengono dal foglio e il numero degli eroi
 * delle collaborazioni dal modulo del gioco, i giochi in arrivo dal catalogo,
 * Discord e Google solo se sono accesi.
 *
 * Restano scritte qui perche' il codice non le ha: la riga di copyright del
 * gioco, le opere delle collaborazioni, le licenze dei programmi e l'origine
 * delle date che il foglio non ha (l'archivio di 7dshub congelato in
 * data/grand-cross/manuali/uscite_storiche.json, da cui date_uscita.py
 * riconosce anche gli eroi del lancio). Vanno ricontrollate quando si
 * aggiornano i testi del gioco, arriva una collaborazione, cambia una libreria
 * importante o cambia il modo in cui la pipeline data gli eroi; e quando un
 * gioco «in arrivo» diventa disponibile, la sua riga di copyright va aggiunta
 * qui.
 *
 * Le ancore delle sezioni sono le stesse nelle due lingue: gli altri documenti
 * possono rimandare a /legale/note-legali#contenuti-dei-giochi e simili.
 */

const GRAND_CROSS = "grand-cross";

/**
 * La riga di copyright di Grand Cross com'e' nella schermata iniziale del
 * client (testo UI_main_title_copylight_001, estratto il 22/10/2026): si
 * riporta uguale, coi suoi ©, senza tradurla. Nel tempo cambia (al lancio
 * globale era un'altra): si ricontrolla a ogni aggiornamento dei testi.
 */
const GRAND_CROSS_COPYRIGHT = [
  "©NS,K/TSDSRP,M ©NS,K/TSDSDJP,TX ©NS,K/TSDSFKAP",
  "©Netmarble Corp. & Netmarble F&C Inc. 2020 All Rights Reserved.",
] as const;

/** La riga che il gioco aggiunge durante la collaborazione con GACHIAKUTA (testo _002). */
const GACHIAKUTA_COPYRIGHT = "© KU, HA&KGACHI";

/**
 * Le opere da cui vengono gli eroi delle collaborazioni, coi nomi delle note
 * della pagina Uscite (TenSura anche col titolo intero, quello che chi ha i
 * diritti riconosce). Il numero degli eroi si conta dai dati; questo elenco
 * no: una collaborazione nuova va aggiunta qui. Devono tornare tutti gli eroi
 * che isCollab conta: al 25/10 sono 71, 70 delle quattordici opere e Zena
 * (1932501) di MAVE:, un gruppo pop virtuale e non un'opera, che per questo
 * ha la sua spiegazione nelle due lingue.
 */
const COLLAB_WORKS: readonly (string | Bilingual)[] = [
  "Overlord",
  "Re:ZERO",
  "That Time I Got Reincarnated as a Slime (TenSura)",
  "KonoSuba",
  "The King of Fighters '98",
  "Attack on Titan",
  "The Rising of the Shield Hero",
  "Mushoku Tensei",
  { it: "MAVE: (il gruppo pop virtuale)", en: "MAVE: (the virtual pop group)" },
  "Tower of God",
  "Solo Leveling",
  "The Eminence in Shadow",
  "Stranger Things",
  "Fire Force",
  "GACHIAKUTA",
];

function collabWorks(locale: Locale): string[] {
  return COLLAB_WORKS.map((work) => (typeof work === "string" ? work : work[locale]));
}

/**
 * Programmi, caratteri e icone principali, con la licenza letta nei loro
 * pacchetti (node_modules/<nome>/package.json); per i caratteri la SIL Open
 * Font License con cui sono distribuiti. Una tabella sola per le due lingue:
 * le righe non possono divergere.
 */
const SOFTWARE: readonly { name: string; use: Bilingual; license: string }[] = [
  { name: "Next.js", use: { it: "costruisce e serve le pagine", en: "builds and serves the pages" }, license: "MIT" },
  { name: "React", use: { it: "disegna l'interfaccia delle pagine", en: "draws the page interface" }, license: "MIT" },
  { name: "Tailwind CSS", use: { it: "gli stili grafici", en: "the visual styles" }, license: "MIT" },
  { name: "Auth.js", use: { it: "l'accesso e la sessione", en: "sign-in and sessions" }, license: "ISC" },
  {
    name: "Drizzle ORM",
    use: { it: "legge e scrive i dati nel database", en: "reads and writes data in the database" },
    license: "Apache 2.0",
  },
  { name: "Phosphor Icons", use: { it: "le icone", en: "the icons" }, license: "MIT" },
  {
    name: "Archivo",
    use: { it: "il carattere dei titoli", en: "the typeface for headings" },
    license: "SIL Open Font License 1.1",
  },
  {
    name: "Atkinson Hyperlegible Next",
    use: { it: "il carattere del testo", en: "the typeface for body text" },
    license: "SIL Open Font License 1.1",
  },
  {
    name: "Geist Mono",
    use: { it: "il carattere dei numeri", en: "the typeface for numbers" },
    license: "SIL Open Font License 1.1",
  },
];

/** I fatti della pagina che vengono dal codice, gli stessi per le due lingue. */
interface Facts {
  /** i giochi con pagine (oggi Grand Cross) */
  playable: readonly GameEntry[];
  /** i giochi annunciati sulla home: del sito hanno solo il nome */
  upcoming: readonly GameEntry[];
  /** il nome per esteso di Grand Cross, dal catalogo */
  grandCrossName: string;
  /** quanti eroi di Grand Cross vengono dalle collaborazioni, contati nei dati del gioco */
  collabHeroes: number | null;
  /** il foglio delle uscite della community e le date che non vengono da li' */
  releases: ReleaseFacts | null;
  /** i fornitori di accesso accesi (Discord, Google): vuoto se nessuno */
  oauth: readonly string[];
}

/**
 * Da dove vengono le date d'uscita, contato nei dati: se la pipeline smette di
 * usare l'archivio di 7dshub o gli stendardi, le frasi che li citano spariscono
 * da sole alla prossima importazione.
 */
interface ReleaseFacts {
  /** il foglio, lo stesso che cita la pagina Uscite */
  source: ReleaseCalendar["source"];
  /** il giorno dell'allineamento: prima, le date globali sono quelle della scheda globale del foglio */
  sync: string | null;
  /** gli eroi del lancio di ogni calendario: il foglio non li elenca, la pipeline li riconosce dalle date dell'archivio */
  launch: Readonly<Record<ReleaseRegion, number>>;
  /** eroi con una data (d'uscita o dell'evoluzione LR) senza una riga nel foglio: viene dall'archivio */
  archiveHeroes: number;
  /** eroi appena usciti con la data dello stendardo di debutto del client, finche' il foglio non li aggiunge */
  bannerHeroes: number;
}

const TESTI = testi({
  it: { Documento: DocIt },
  en: { Documento: DocEn },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { title, description } = legalDocument("note-legali");
  return { title: title[locale], description: description[locale] };
}

export default async function LegalNoticePage() {
  const { Documento } = TESTI[await getLocale()];
  return <Documento facts={pageFacts()} />;
}

function pageFacts(): Facts {
  const games = listGames();
  const grandCross = getGameModule(GRAND_CROSS);
  const heroes = grandCross?.heroContext ? Object.values(grandCross.heroContext.heroes) : null;
  return {
    playable: games.filter((game) => game.available),
    upcoming: games.filter((game) => !game.available),
    grandCrossName: games.find((game) => game.slug === GRAND_CROSS)?.name ?? GRAND_CROSS,
    collabHeroes: heroes ? heroes.filter(isCollab).length : null,
    releases: grandCross?.releases ? releaseFacts(grandCross.releases) : null,
    oauth: enabledOauthProviders().map((provider) => provider.label),
  };
}

/**
 * Le regole sono quelle di import-heroes.mts: una data e' del foglio se l'eroe
 * ha la sua riga nel calendario (updateJp, updateGlobal) o la sua evoluzione
 * LR e' in una riga; se no viene dall'archivio, o dallo stendardo (banner).
 */
function releaseFacts(calendar: ReleaseCalendar): ReleaseFacts {
  const { schedules } = calendar;
  const launchOf = (region: ReleaseRegion) =>
    schedules[region]?.find((update) => update.launch)?.launchHeroes?.length ?? 0;
  const lrRows = (region: ReleaseRegion) =>
    new Set(
      (schedules[region] ?? []).flatMap((update) =>
        (update.lrEvolutions ?? []).flatMap((lr) => (lr.heroId ? [lr.heroId] : [])),
      ),
    );
  const lrJp = lrRows("jp");
  const lrGlobal = lrRows("global");
  let archiveHeroes = 0;
  let bannerHeroes = 0;
  for (const [id, hero] of Object.entries(calendar.heroes)) {
    if (hero.banner) {
      bannerHeroes++;
      continue;
    }
    const offSheet =
      (hero.jp && !hero.updateJp) ||
      (hero.global && !hero.updateGlobal) ||
      (hero.lrJp && !lrJp.has(id)) ||
      (hero.lrGlobal && !lrGlobal.has(id));
    if (offSheet) archiveHeroes++;
  }
  return {
    source: calendar.source,
    sync: calendar.sync ?? null,
    launch: { jp: launchOf("jp"), global: launchOf("global") },
    archiveHeroes,
    bannerHeroes,
  };
}

/** Vero se ogni data viene da una riga del foglio: allora non c'e' niente da precisare. */
function allFromSheet(releases: ReleaseFacts): boolean {
  return (
    releases.launch.jp === 0 &&
    releases.launch.global === 0 &&
    releases.archiveHeroes === 0 &&
    releases.bannerHeroes === 0
  );
}

function DocIt({ facts }: { facts: Facts }) {
  const { releases } = facts;
  const giochi = list(
    facts.playable.map((game) => game.name),
    "it",
  );
  return (
    <>
      <PageHeader title="Note legali">
        <p>Chi gestisce {SITE_NAME}, come scriverci, di chi sono i giochi di cui parla e da dove vengono i dati.</p>
      </PageHeader>
      <LastUpdated document="note-legali" locale="it" />

      <SectionTitle id="gestore">1. Chi gestisce {SITE_NAME}</SectionTitle>
      <p>
        {SITE_NAME} è gestito dalla società qui sotto, che offre il servizio ed è titolare del trattamento dei
        dati personali: decide come e perché si usano (vedi l&apos;<DocLink doc="privacy" locale="it" />). Questi
        sono i dati che la legge chiede di mostrare (art. 7 del D.Lgs. 70/2003 e art. 2250 del codice civile):
      </p>
      <OperatorDetails locale="it" />
      <p>
        Il sito e il suo database stanno sui server di{" "}
        {HOSTING ? `${HOSTING.name} (paese dei server: ${HOSTING.location.it})` : <Missing field="hosting" locale="it" />}.
      </p>

      <SectionTitle id="contatti">2. Contatti</SectionTitle>
      <p>
        Per qualsiasi cosa scrivi a <ContactEmail locale="it" />: è l&apos;indirizzo per tutte le richieste (dati
        personali, segnalazioni, titolari dei diritti, autorità). Non serve un account. Puoi scrivere in italiano o in
        inglese, e ti risponde una persona, non un programma.
      </p>
      <p>Quale pagina leggere prima di scrivere:</p>
      <ul>
        <li>
          i tuoi dati personali (per esempio vedere, correggere o cancellare quello che sappiamo di te):{" "}
          <DocLink doc="privacy" locale="it" />;
        </li>
        <li>
          segnalare un contenuto illegale, o chiedere di togliere un contenuto su cui hai dei diritti:{" "}
          <DocLink doc="copyright" locale="it" />;
        </li>
        <li>
          contestare una decisione dei moderatori su un tuo contenuto o sul tuo account:{" "}
          <DocLink doc="termini" locale="it" />.
        </li>
      </ul>
      <p>
        Le email con le richieste restano nella casella di posta del gestore per{" "}
        {months(RETENTION.emailRequestsMonths, "it")} da quando la richiesta è chiusa: poi il gestore le cancella a
        mano.
      </p>

      <h3>Punto di contatto per il Digital Services Act</h3>
      <p>
        Questo indirizzo è anche il punto di contatto unico di {SITE_NAME} previsto dal Digital Services Act (DSA),
        la legge europea sui servizi digitali (Regolamento UE 2022/2065): per le autorità degli Stati
        dell&apos;Unione europea, la Commissione europea e il Comitato europeo per i servizi digitali (art. 11 DSA),
        e per chi usa il sito (art. 12 DSA). Lingue: italiano e inglese.
      </p>

      <h3>Chi vigila su {SITE_NAME}</h3>
      <p>
        Per il DSA vigila su {SITE_NAME} l&apos;Autorità per le garanzie nelle comunicazioni (AGCOM), che è il
        Coordinatore dei servizi digitali per l&apos;Italia (art. 15 del D.L. 15 settembre 2023, n. 123, convertito
        dalla L. 13 novembre 2023, n. 159): <a href="https://www.agcom.it">www.agcom.it</a>. Per i dati personali
        vigila invece il Garante per la protezione dei dati personali: come presentargli un reclamo lo spiega
        l&apos;<DocLink doc="privacy" locale="it" />.
      </p>
      <p>
        Se pensi che {SITE_NAME} non rispetti il DSA, puoi presentare un reclamo al Coordinatore dei servizi
        digitali del paese dell&apos;Unione europea in cui ti trovi: in Italia è AGCOM (art. 53 DSA). AGCOM non può
        intervenire sulla singola decisione, per esempio la rimozione di un tuo contenuto o la sospensione del tuo
        account: per quella puoi scrivere a noi o rivolgerti al giudice.
      </p>

      <SectionTitle id="sito-di-fan">3. Un sito di fan non ufficiale</SectionTitle>
      <p>
        {SITE_NAME} è un sito di fan, gratuito e non ufficiale, sui giochi gacha: schede degli eroi, dati, strumenti
        e una community.{" "}
        {facts.playable.length === 1
          ? `Oggi copre un solo gioco, ${giochi}.`
          : `Oggi copre ${facts.playable.length} giochi: ${giochi}.`}
      </p>
      <p>
        {SITE_NAME} non è affiliato a Netmarble, Kodansha, HoYoverse, KURO GAMES né agli altri titolari dei diritti dei
        giochi e delle opere di cui parla, e non è sponsorizzato né approvato da loro. Moderatori e redattori sono
        persone autorizzate dal gestore a moderare il sito e a curare le guide: non parlano a nome dei giochi né dei
        loro editori.
      </p>
      <p>
        {SITE_NAME} non entra nel tuo account del gioco e non ti chiede mai la password o gli altri dati con cui entri
        nel gioco: per l&apos;Account di gioco su {SITE_NAME} bastano nickname, server e Codice amico, che non servono a
        entrare. Se qualcuno ti chiede i dati per entrare nel gioco a nome di {SITE_NAME}, non siamo noi. Per un
        problema con il gioco (il tuo account del gioco, un acquisto, un errore) scrivi all&apos;assistenza
        dell&apos;editore del gioco.
      </p>

      <SectionTitle id="marchi">4. Marchi e diritti dei giochi</SectionTitle>
      <p>
        Nomi, marchi, immagini e testi dei giochi appartengono ai rispettivi titolari, e {SITE_NAME} non rivendica
        nessun diritto su di loro.
      </p>

      <h3>{facts.grandCrossName}</h3>
      <p>
        Questa è la riga di copyright ufficiale del gioco, come compare nella sua schermata iniziale. La riportiamo
        uguale, senza tradurla:
      </p>
      <CopyrightNotice />
      <p>
        Durante la collaborazione con GACHIAKUTA il gioco aggiunge{" "}
        <span lang="en" translate="no">
          {GACHIAKUTA_COPYRIGHT}
        </span>
        .
      </p>
      <p>
        Detto per esteso: i diritti su The Seven Deadly Sins sono di Nakaba Suzuki, l&apos;autore del manga, di
        Kodansha, che lo pubblica, e dei comitati di produzione delle serie animate; quelli sul gioco sono di
        Netmarble Corp. e Netmarble F&amp;C Inc. Le carte artefatto «Autografo di Nakaba Suzuki» e «Illustrazione
        speciale di Nakaba Suzuki» riproducono la firma e i disegni dell&apos;autore.
      </p>

      <h3>Gli eroi delle collaborazioni</h3>
      <p>
        {facts.collabHeroes === null
          ? "Fra gli eroi del gioco ci sono personaggi di altre opere, arrivati con le collaborazioni: "
          : `Fra gli eroi del gioco, ${facts.collabHeroes} vengono da altre opere, con le collaborazioni: `}
        {list(collabWorks("it"), "it")}. Questi personaggi appartengono ai titolari delle rispettive opere.
      </p>

      {facts.upcoming.length > 0 ? (
        <>
          <h3>I giochi in arrivo</h3>
          <p>
            La home annuncia che {facts.upcoming.length === 1 ? "è" : "sono"} in arrivo anche{" "}
            {list(
              facts.upcoming.map((game) => `${game.name} (${game.publisher})`),
              "it",
            )}
            . Per ora di questi giochi {SITE_NAME} mostra solo il nome: nessuna immagine, nessun testo, nessun dato.
          </p>
        </>
      ) : null}

      <h3>Gli altri nomi</h3>
      <p>
        Anche gli altri nomi e marchi citati nel sito, come Discord e Google, sono dei rispettivi titolari.{" "}
        {SITE_NAME} usa i nomi dei giochi, delle opere e dei servizi solo per dire di cosa parla.
      </p>

      <SectionTitle id="contenuti-dei-giochi">5. I contenuti dei giochi su {SITE_NAME}</SectionTitle>
      <p>
        Per spiegare il gioco, {SITE_NAME} pubblica materiale preso dai file di {facts.grandCrossName} (il «client»,
        il programma che installi per giocare):
      </p>
      <ul>
        <li>
          immagini: le illustrazioni degli eroi, i primi piani della Mossa finale, le card, le illustrazioni e le
          icone delle abilità, i costumi, l&apos;equipaggiamento, le Reliquie sacre, le icone di oggetti e materiali
          (anche i regali dei compleanni), le carte e i set artefatto, le immagini dell&apos;Endgame (modalità, boss,
          mostri, bestie e le loro abilità), le icone dell&apos;interfaccia (per esempio razza, attributo, rarità e
          stelle) e i simboli delle costellazioni;
        </li>
        <li>
          testi: nomi, descrizioni, abilità, regole delle modalità e battute dei personaggi, in inglese e in italiano,
          come li scrive il gioco;
        </li>
        <li>dati: statistiche, valori e probabilità, ricavati dalle tabelle del gioco.</li>
      </ul>
      <p>
        Lo scopo è informare sul gioco e permettere di discuterne. Oggi {SITE_NAME} non vende niente e non mostra
        pubblicità.
      </p>
      <p>
        Questi contenuti li pubblica {SITE_NAME}, non gli utenti, e ne risponde direttamente. Restano dei loro
        titolari.
      </p>

      <h3>Se sei titolare dei diritti</h3>
      <p>
        Se hai dei diritti su uno di questi contenuti e vuoi che lo togliamo o lo riduciamo (per esempio con
        un&apos;immagine più piccola), scrivici a <ContactEmail locale="it" />. Rispondiamo entro {workingDays(RIGHTS_RESPONSE_WORKING_DAYS, "it")} e, se la
        richiesta è credibile, togliamo o riduciamo quello che chiedi entro{" "}
        {workingDays(RIGHTS_RESPONSE_WORKING_DAYS, "it")} dalla richiesta, senza contestarla. Cosa scrivere è nella
        pagina <DocLink doc="copyright" locale="it" />.
      </p>

      <SectionTitle id="esattezza-dei-dati">6. Esattezza dei dati</SectionTitle>
      <ul>
        <li>
          Nessun dato di {SITE_NAME} è ufficiale. Statistiche e valori li leggiamo dai file del gioco, e i calcoli
          del sito (per esempio il calcolatore nella scheda di un eroe) seguono le regole del gioco come le abbiamo
          ricostruite: possono contenere errori.
        </li>
        <li>
          Dove il gioco non scrive un numero, come le statistiche dei boss e dei nemici dell&apos;Endgame, lo
          stimiamo, e la pagina lo dice.
        </li>
        <li>
          I dati non si aggiornano da soli: dopo un aggiornamento del gioco li aggiorniamo noi, e fino ad allora
          possono essere vecchi.
        </li>
        {releases ? (
          <li>
            Le date d&apos;uscita vengono {allFromSheet(releases) ? "" : "quasi tutte "}dal foglio della community (
            <a href="#fonti">sezione 7</a>): se il foglio sbaglia una data, la sbagliamo anche noi.
          </li>
        ) : null}
        <li>
          Post, commenti, squadre e guide dell&apos;Endgame, valutazioni e tier list li scrivono le persone iscritte al
          sito: sono le opinioni di chi li scrive e possono contenere errori.
        </li>
        <li>
          Le guide della sezione «Guide e rotazioni» le propone chi ha il ruolo «{roleLabel("CONTRIBUTOR", "it")}» e le
          pubblica chi ha il ruolo «{roleLabel("EDITOR", "it")}» o superiore, che può anche correggerle: sotto ogni guida
          c&apos;è l&apos;elenco delle modifiche. Di queste guide rispondiamo noi, come dicono i{" "}
          <DocLink doc="termini" locale="it" />, ma anche loro possono contenere errori.
        </li>
      </ul>
      <p>
        Se trovi un errore, scrivici a <ContactEmail locale="it" />. Di cosa risponde {SITE_NAME} quando un dato è
        sbagliato lo dicono i <DocLink doc="termini" locale="it" />.
      </p>

      <SectionTitle id="fonti">7. Fonti e ringraziamenti</SectionTitle>
      {releases ? (
        <>
          <p>
            Le date d&apos;uscita degli eroi, nella pagina <Link href={`/${GRAND_CROSS}/uscite`}>Uscite</Link>, nelle
            schede degli eroi e in <Link href={`/${GRAND_CROSS}/indovina`}>Indovina l&apos;eroe</Link>, vengono dal
            foglio della community «
            <a href={releases.source.url} lang="en">
              {releases.source.title}
            </a>
            » di {releases.source.authors}.{" "}
            {releases.source.globalTitle && releases.sync ? (
              <>
                Per il server globale, le date di prima del {longDate(releases.sync, "it")} vengono dalla scheda
                globale dello stesso foglio, «<span lang="en">{releases.source.globalTitle}</span>».{" "}
              </>
            ) : null}
            Anche le note sugli eventi della pagina Uscite sono quelle del foglio, in inglese. La copia che usiamo è
            del {longDate(releases.source.downloaded, "it")}.
          </p>
          {allFromSheet(releases) ? null : (
            <>
              <p>Non tutte le date vengono dal foglio:</p>
              <ul>
                {releases.launch.jp > 0 || releases.launch.global > 0 ? (
                  <li>
                    Il foglio non elenca uno per uno gli eroi del lancio ({launchCounts(releases.launch, "it")}): quali
                    sono l&apos;abbiamo ricavato da un archivio di date copiato una volta dal sito di fan 7dshub.
                  </li>
                ) : null}
                {releases.archiveHeroes > 0 ? (
                  <li>
                    Le date che il foglio non riporta, che oggi riguardano {heroCount(releases.archiveHeroes, "it")},
                    vengono dall&apos;archivio di 7dshub.
                  </li>
                ) : null}
                {releases.bannerHeroes > 0 ? (
                  <li>
                    Un eroe appena uscito, finché il foglio non lo aggiunge, ha la data del suo stendardo di debutto nel
                    gioco, e la sua scheda lo dice (oggi succede a {heroCount(releases.bannerHeroes, "it")}).
                  </li>
                ) : null}
              </ul>
            </>
          )}
          <p>
            Grazie ai suoi autori: senza il loro lavoro non avremmo le date delle uscite. Se sei uno di loro e vuoi che
            cambiamo qualcosa in questa citazione, scrivici a <ContactEmail locale="it" />.
          </p>
        </>
      ) : null}
      <p>
        Immagini, testi e dati dei giochi vengono invece dai file del gioco (
        <a href="#contenuti-dei-giochi">sezione 5</a>).
      </p>

      <SectionTitle id="software">8. Software, caratteri e icone</SectionTitle>
      <p>
        Il codice di {SITE_NAME} è pubblico su GitHub, con licenza MIT. Chi ha scritto il codice può dare in licenza
        solo quello che è suo: la licenza MIT copre il codice scritto per {SITE_NAME}, non le immagini, i testi e i
        dati dei giochi, né i loro nomi e marchi, che restano dei loro titolari anche dove si trovano
        nell&apos;archivio del codice.
      </p>
      <p>{SITE_NAME} è costruito con questi programmi, caratteri e icone, ognuno con la sua licenza:</p>
      <SoftwareTable locale="it" />
      <p>
        Le altre librerie usate, ognuna con la sua licenza, sono elencate nel file <code>package.json</code> del
        codice. I caratteri li serve {SITE_NAME} stesso: il tuo browser non li chiede ad altri siti.
      </p>

      <SectionTitle id="collegamenti">9. Collegamenti ad altri siti</SectionTitle>
      <p>{SITE_NAME} porta ad altri siti in questi casi:</p>
      <ul>
        <li>
          il foglio delle uscite della community (<a href="#fonti">sezione 7</a>);
        </li>
        <li>
          i siti delle autorità citate nei documenti legali, come AGCOM e il Garante per la protezione dei dati
          personali;
        </li>
        {facts.oauth.length > 0 ? (
          <li>
            l&apos;accesso con {list(facts.oauth, "it", "disjunction")}: il sito ti manda alla pagina di accesso del
            servizio che scegli, e i documenti legali portano{" "}
            {facts.oauth.length === 1
              ? "alla sua informativa privacy"
              : `alle informative privacy di ${list(facts.oauth, "it")}`}
            ;
          </li>
        ) : null}
        <li>i collegamenti che chi scrive una guida mette nel testo.</li>
      </ul>
      <p>
        Quei siti non li gestiamo noi: quello che pubblicano e come trattano i tuoi dati dipende da loro e dalle loro
        regole. Se un collegamento su {SITE_NAME} porta a un contenuto illegale, segnalacelo come spiegato nella
        pagina <DocLink doc="copyright" locale="it" />.
      </p>
    </>
  );
}

function DocEn({ facts }: { facts: Facts }) {
  const { releases } = facts;
  const games = list(
    facts.playable.map((game) => game.name),
    "en",
  );
  return (
    <>
      <PageHeader title="Legal notice">
        <p>Who runs {SITE_NAME}, how to reach us, who owns the games it covers and where the data comes from.</p>
      </PageHeader>
      <LastUpdated document="note-legali" locale="en" />

      <SectionTitle id="gestore">1. Who runs {SITE_NAME}</SectionTitle>
      <p>
        {SITE_NAME} is run by the company below, which provides the service and is the controller of personal data:
        it decides how and why the data is used (see the <DocLink doc="privacy" locale="en" />). These are the
        details the law requires us to show (Art. 7 of Italian Legislative Decree 70/2003 and Art. 2250 of the
        Italian Civil Code):
      </p>
      <OperatorDetails locale="en" />
      <p>
        The site and its database are on the servers of{" "}
        {HOSTING ? `${HOSTING.name} (server location: ${HOSTING.location.en})` : <Missing field="hosting" locale="en" />}.
      </p>

      <SectionTitle id="contatti">2. Contact</SectionTitle>
      <p>
        For anything, write to <ContactEmail locale="en" />: it is the address for every request (personal data,
        reports, rights holders, authorities). You don&apos;t need an account. You can write in Italian or English, and
        a person will answer you, not a program.
      </p>
      <p>Which page to read before you write:</p>
      <ul>
        <li>
          your personal data (for example seeing, correcting or deleting what we know about you):{" "}
          <DocLink doc="privacy" locale="en" />;
        </li>
        <li>
          reporting illegal content, or asking us to remove content you hold rights to:{" "}
          <DocLink doc="copyright" locale="en" />;
        </li>
        <li>
          challenging a moderation decision about your content or your account:{" "}
          <DocLink doc="termini" locale="en" />.
        </li>
      </ul>
      <p>
        Emails with requests stay in the operator&apos;s mailbox for {months(RETENTION.emailRequestsMonths, "en")}{" "}
        after the request is closed: then the operator deletes them by hand.
      </p>

      <h3>Point of contact under the Digital Services Act</h3>
      <p>
        This address is also {SITE_NAME}&apos;s single point of contact under the Digital Services Act (DSA), the EU
        law on digital services (EU Regulation 2022/2065): for the authorities of the EU Member States, the European
        Commission and the European Board for Digital Services (Art. 11 DSA), and for the people who use the site
        (Art. 12 DSA). Languages: Italian and English.
      </p>

      <h3>Who supervises {SITE_NAME}</h3>
      <p>
        Under the DSA, {SITE_NAME} is supervised by the Italian Communications Regulatory Authority (Autorità per le
        garanzie nelle comunicazioni, AGCOM), the Digital Services Coordinator for Italy (Art. 15 of Italian
        Decree-Law No. 123 of 15 September 2023, converted by Law No. 159 of 13 November 2023):{" "}
        <a href="https://www.agcom.it">www.agcom.it</a>. For personal data, the supervisor is instead the Italian Data
        Protection Authority (Garante per la protezione dei dati personali): the{" "}
        <DocLink doc="privacy" locale="en" /> explains how to lodge a complaint with it.
      </p>
      <p>
        If you think {SITE_NAME} does not comply with the DSA, you can lodge a complaint with the Digital Services
        Coordinator of the EU country where you are located: in Italy it is AGCOM (Art. 53 DSA). AGCOM cannot
        intervene in an individual decision, for example the removal of your content or the suspension of your
        account: for that you can write to us or go to court.
      </p>

      <SectionTitle id="sito-di-fan">3. An unofficial fan site</SectionTitle>
      <p>
        {SITE_NAME} is a free, unofficial fan site about gacha games: hero pages, data, tools and a community.{" "}
        {facts.playable.length === 1
          ? `Today it covers one game, ${games}.`
          : `Today it covers ${facts.playable.length} games: ${games}.`}
      </p>
      <p>
        {SITE_NAME} is not affiliated with Netmarble, Kodansha, HoYoverse, KURO GAMES or the other rights holders of the
        games and works it talks about, and is not sponsored or endorsed by them. Moderators and editors are people the
        operator has authorised to moderate the site and look after the guides: they do not speak for the games or their
        publishers.
      </p>
      <p>
        {SITE_NAME} does not sign in to your account in the game and never asks for the password or other details you
        use to sign in to the game: for the Game account on {SITE_NAME}, your nickname, server and Friend Code are
        enough, and they cannot be used to sign in. If someone asks you for your game sign-in details on behalf of{" "}
        {SITE_NAME}, it isn&apos;t us. For a problem with the game (your account in the game, a purchase, a bug)
        contact the game publisher&apos;s support.
      </p>

      <SectionTitle id="marchi">4. Trademarks and game rights</SectionTitle>
      <p>
        Game names, trademarks, images and text belong to their respective owners, and {SITE_NAME} claims no rights
        over them.
      </p>

      <h3>{facts.grandCrossName}</h3>
      <p>
        This is the game&apos;s official copyright line, as it appears on its title screen. We copy it exactly as it
        is, untranslated:
      </p>
      <CopyrightNotice />
      <p>
        During the GACHIAKUTA collaboration the game adds{" "}
        <span lang="en" translate="no">
          {GACHIAKUTA_COPYRIGHT}
        </span>
        .
      </p>
      <p>
        In full: the rights to The Seven Deadly Sins belong to Nakaba Suzuki, the author of the manga, to Kodansha,
        its publisher, and to the production committees of the anime series; the rights to the game belong to
        Netmarble Corp. and Netmarble F&amp;C Inc. The artifact cards “Nakaba Suzuki&apos;s Autograph” and
        “Nakaba Suzuki&apos;s Special Illustration” reproduce the author&apos;s signature and drawings.
      </p>

      <h3>Collaboration heroes</h3>
      <p>
        {facts.collabHeroes === null
          ? "Among the game's heroes there are characters from other works, who arrived with the collaborations: "
          : `Among the game's heroes, ${facts.collabHeroes} come from other works, through the collaborations: `}
        {list(collabWorks("en"), "en")}. These characters belong to the rights holders of their respective works.
      </p>

      {facts.upcoming.length > 0 ? (
        <>
          <h3>Upcoming games</h3>
          <p>
            The home page announces that{" "}
            {list(
              facts.upcoming.map((game) => `${game.name} (${game.publisher})`),
              "en",
            )}{" "}
            {facts.upcoming.length === 1 ? "is" : "are"} also on the way. For now {SITE_NAME} shows only their names:
            no images, no text, no data.
          </p>
        </>
      ) : null}

      <h3>Other names</h3>
      <p>
        The other names and trademarks mentioned on the site, such as Discord and Google, also belong to their
        respective owners. {SITE_NAME} uses the names of games, works and services only to say what it is talking
        about.
      </p>

      <SectionTitle id="contenuti-dei-giochi">5. Game content on {SITE_NAME}</SectionTitle>
      <p>
        To explain the game, {SITE_NAME} publishes material taken from the files of {facts.grandCrossName} (the
        “client”, the program you install to play):
      </p>
      <ul>
        <li>
          images: hero illustrations, Ultimate Move close-ups, cards, skill illustrations and icons, costumes, gear,
          Holy Relics, item and material icons (birthday gifts included), artifact cards and sets, Endgame images
          (modes, bosses, monsters, beasts and their skills), interface icons (for example race, attribute, rarity and
          stars) and constellation symbols;
        </li>
        <li>
          text: names, descriptions, skills, game mode rules and character lines, in English and Italian, as the game
          writes them;
        </li>
        <li>data: stats, values and probabilities, taken from the game&apos;s tables.</li>
      </ul>
      <p>
        The purpose is to inform about the game and let people discuss it. Today {SITE_NAME} sells nothing and shows
        no ads.
      </p>
      <p>
        This content is published by {SITE_NAME}, not by users, and {SITE_NAME} is directly responsible for it. It
        still belongs to its rights holders.
      </p>

      <h3>If you are a rights holder</h3>
      <p>
        If you hold rights to any of this content and want us to remove or reduce it (for example with a smaller
        image), write to us at <ContactEmail locale="en" />. We reply within {workingDays(RIGHTS_RESPONSE_WORKING_DAYS, "en")} and, if the
        request is credible, we remove or reduce what you ask within{" "}
        {workingDays(RIGHTS_RESPONSE_WORKING_DAYS, "en")} of the request, without disputing it. What to write is on
        the <DocLink doc="copyright" locale="en" /> page.
      </p>

      <SectionTitle id="esattezza-dei-dati">6. Data accuracy</SectionTitle>
      <ul>
        <li>
          None of {SITE_NAME}&apos;s data is official. We read stats and values from the game files, and the
          site&apos;s calculations (for example the calculator on a hero&apos;s page) follow the game&apos;s rules as
          we have reconstructed them: they may contain errors.
        </li>
        <li>
          Where the game does not state a number, such as the stats of Endgame bosses and enemies, we estimate it,
          and the page says so.
        </li>
        <li>
          The data does not update by itself: after a game update we update it ourselves, and until then it may be
          out of date.
        </li>
        {releases ? (
          <li>
            {allFromSheet(releases) ? "Release dates come" : "Almost all release dates come"} from the community
            spreadsheet (<a href="#fonti">section 7</a>): if the spreadsheet gets a date wrong, so do we.
          </li>
        ) : null}
        <li>
          Posts, comments, Endgame teams and guides, ratings and tier lists are written by the people registered on the
          site: they are the opinions of whoever writes them and may contain errors.
        </li>
        <li>
          The guides in the “Guides and rotations” section are proposed by people with the “
          {roleLabel("CONTRIBUTOR", "en")}” role and published by people with the “{roleLabel("EDITOR", "en")}” role or
          above, who can also correct them: each guide lists its changes below it. We are responsible for these guides,
          as the <DocLink doc="termini" locale="en" /> say, but they may contain errors too.
        </li>
      </ul>
      <p>
        If you find an error, write to us at <ContactEmail locale="en" />. What {SITE_NAME} is liable for when data
        is wrong is set out in the <DocLink doc="termini" locale="en" />.
      </p>

      <SectionTitle id="fonti">7. Sources and thanks</SectionTitle>
      {releases ? (
        <>
          <p>
            The heroes&apos; release dates, on the <Link href={`/${GRAND_CROSS}/uscite`}>Releases</Link> page, on the
            hero pages and in <Link href={`/${GRAND_CROSS}/indovina`}>Guess the Hero</Link>, come from the community
            spreadsheet “<a href={releases.source.url}>{releases.source.title}</a>” by {releases.source.authors}.{" "}
            {releases.source.globalTitle && releases.sync ? (
              <>
                For the global server, the dates before {longDate(releases.sync, "en")} come from the same
                spreadsheet&apos;s global tab, “{releases.source.globalTitle}”.{" "}
              </>
            ) : null}
            The event notes on the Releases page are also the spreadsheet&apos;s own, in English. The copy we use is
            from {longDate(releases.source.downloaded, "en")}.
          </p>
          {allFromSheet(releases) ? null : (
            <>
              <p>Not all dates come from the spreadsheet:</p>
              <ul>
                {releases.launch.jp > 0 || releases.launch.global > 0 ? (
                  <li>
                    The spreadsheet does not list the launch heroes one by one ({launchCounts(releases.launch, "en")}
                    ): we worked out which they are from an archive of dates copied once from the fan site 7dshub.
                  </li>
                ) : null}
                {releases.archiveHeroes > 0 ? (
                  <li>
                    The dates the spreadsheet does not have, which today concern{" "}
                    {heroCount(releases.archiveHeroes, "en")}, come from the 7dshub archive.
                  </li>
                ) : null}
                {releases.bannerHeroes > 0 ? (
                  <li>
                    A hero that has just come out has the date of its debut banner in the game until the spreadsheet
                    adds it, and its page says so (today this applies to {heroCount(releases.bannerHeroes, "en")}).
                  </li>
                ) : null}
              </ul>
            </>
          )}
          <p>
            Thanks to its authors: without their work we would not have the release dates. If you are one of them and
            want us to change something in this credit, write to us at <ContactEmail locale="en" />.
          </p>
        </>
      ) : null}
      <p>
        Game images, text and data instead come from the game files (<a href="#contenuti-dei-giochi">section 5</a>).
      </p>

      <SectionTitle id="software">8. Software, fonts and icons</SectionTitle>
      <p>
        {SITE_NAME}&apos;s code is public on GitHub, under the MIT license. Whoever wrote the code can only license
        what is theirs: the MIT license covers the code written for {SITE_NAME}, not the games&apos; images, text and
        data, nor their names and trademarks, which remain their owners&apos; even where they are in the code
        repository.
      </p>
      <p>{SITE_NAME} is built with these programs, fonts and icons, each with its own license:</p>
      <SoftwareTable locale="en" />
      <p>
        The other libraries used, each with its own license, are listed in the code&apos;s <code>package.json</code>{" "}
        file. {SITE_NAME} serves the fonts itself: your browser does not request them from other sites.
      </p>

      <SectionTitle id="collegamenti">9. Links to other sites</SectionTitle>
      <p>{SITE_NAME} takes you to other sites in these cases:</p>
      <ul>
        <li>
          the community release spreadsheet (<a href="#fonti">section 7</a>);
        </li>
        <li>
          the websites of the authorities mentioned in the legal documents, such as AGCOM and the Italian Data
          Protection Authority (Garante per la protezione dei dati personali);
        </li>
        {facts.oauth.length > 0 ? (
          <li>
            signing in with {list(facts.oauth, "en", "disjunction")}: the site sends you to the sign-in page of the
            service you choose, and the legal documents link to{" "}
            {facts.oauth.length === 1 ? "its privacy policy" : `the privacy policies of ${list(facts.oauth, "en")}`};
          </li>
        ) : null}
        <li>the links that guide authors put in their text.</li>
      </ul>
      <p>
        We don&apos;t run those sites: what they publish and how they handle your data depends on them and their
        rules. If a link on {SITE_NAME} leads to illegal content, report it to us as explained on the{" "}
        <DocLink doc="copyright" locale="en" /> page.
      </p>
    </>
  );
}

/* ------------------------------------------------------------- pezzi -- */

type SectionId =
  | "gestore"
  | "contatti"
  | "sito-di-fan"
  | "marchi"
  | "contenuti-dei-giochi"
  | "esattezza-dei-dati"
  | "fonti"
  | "software"
  | "collegamenti";

/** Il titolo di una sezione con la sua ancora; scroll-mt perche' l'intestazione del sito resta fissa in alto. */
function SectionTitle({ id, children }: { id: SectionId; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24">
      {children}
    </h2>
  );
}

/** Un altro documento legale, col titolo di LEGAL_DOCUMENTS: lo stesso nome delle schede in cima. */
function DocLink({ doc, locale }: { doc: LegalDocumentKey; locale: Locale }) {
  const { href, title } = legalDocument(doc);
  return <Link href={href}>{title[locale]}</Link>;
}

/**
 * La riga di copyright com'e' nel gioco, una riga per riga del gioco.
 * `translate="no"`: nemmeno il traduttore del browser la deve cambiare.
 */
function CopyrightNotice() {
  return (
    <p lang="en" translate="no" className="border-l-2 border-rule pl-4">
      {GRAND_CROSS_COPYRIGHT[0]}
      <br />
      {GRAND_CROSS_COPYRIGHT[1]}
    </p>
  );
}

function SoftwareTable({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <TableScroll>
      <table>
        <thead>
          <tr>
            <th>{en ? "Name" : "Nome"}</th>
            <th>{en ? "What it does" : "A cosa serve"}</th>
            <th>{en ? "License" : "Licenza"}</th>
          </tr>
        </thead>
        <tbody>
          {SOFTWARE.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.use[locale]}</td>
              <td>{item.license}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableScroll>
  );
}

/* ------------------------------------------------------------ parole -- */

/** «A, B e C» o «A o B», come li scrive la lingua. */
function list(items: readonly string[], locale: Locale, type: "conjunction" | "disjunction" = "conjunction"): string {
  return new Intl.ListFormat(intlLocale(locale), { type }).format(items);
}

/** Una data AAAA-MM-GG per esteso; a mezzogiorno UTC, come LastUpdated, resta la stessa a ogni fuso orario. */
function longDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function workingDays(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "1 working day" : `${n} working days`;
  return n === 1 ? "1 giorno lavorativo" : `${n} giorni lavorativi`;
}

function months(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "1 month" : `${n} months`;
  return n === 1 ? "1 mese" : `${n} mesi`;
}

function heroCount(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "1 hero" : `${n} heroes`;
  return n === 1 ? "1 eroe" : `${n} eroi`;
}

/** «52 in Giappone e Corea, 60 nel server globale»: solo i calendari che hanno un lancio. */
function launchCounts(launch: ReleaseFacts["launch"], locale: Locale): string {
  const en = locale === "en";
  const parts: string[] = [];
  if (launch.jp > 0) parts.push(en ? `${launch.jp} in Japan and Korea` : `${launch.jp} in Giappone e Corea`);
  if (launch.global > 0) parts.push(en ? `${launch.global} on the global server` : `${launch.global} nel server globale`);
  return parts.join(", ");
}
