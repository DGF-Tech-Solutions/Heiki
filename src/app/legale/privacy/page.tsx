import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContactEmail, LastUpdated, Missing, Summary, TableScroll } from "@/components/legal/legal-parts";
import { PageHeader } from "@/components/ui";
import { DELETE_PHRASES } from "@/lib/auth/account";
import { enabledOauthProviders } from "@/lib/auth/config";
import { databaseReachable, db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { MAX_REROLLS, VERIFICATION_COOLDOWN_DAYS } from "@/lib/games/game-account";
import { testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { BACKUP_COPIES, MIN_AGE, PRIVACY_RESPONSE_MONTHS } from "@/lib/legal/commitments";
import { legalDocument, type LegalDocumentKey } from "@/lib/legal/documents";
import { HOSTING, OPERATOR } from "@/lib/legal/operator";
import { RETENTION } from "@/lib/legal/retention";
import { FAVORITES_LIMIT } from "@/lib/profile/favorites";
import { RULES } from "@/lib/rate-limit";

/**
 * L'informativa privacy (art. 13 GDPR): una pagina sola, con «In breve» in cima
 * e il testo completo sotto, in tredici sezioni numerate (brief del 25/10, §10).
 *
 * Due blocchi JSX interi, uno per lingua, che dicono le stesse cose nello
 * stesso ordine: una sezione che manca da una parte si vede subito.
 *
 * Quello che dipende dalla configurazione si legge a ogni richiesta, cosi' la
 * pagina non dice mai che il sito fa una cosa spenta:
 * - il pulsante di Discord e Google compare solo per i fornitori accesi
 *   (`enabledOauthProviders`); quello che il sito tiene di chi e' entrato cosi'
 *   compare anche per un fornitore spento di cui restano collegamenti nel
 *   database (`linkedProviders`);
 * - l'avviso ai moderatori su Discord solo se c'e' `DISCORD_WEBHOOK_MODERAZIONE`.
 *
 * I numeri vengono dalle costanti (durate, eta' minima, tempi di risposta, copie
 * di sicurezza, finestre dei limiti di tentativi): cambiata una costante, la
 * pagina dice il numero nuovo. I dati del gestore e dell'hosting vengono da
 * operator.ts, e dove mancano compare «da completare».
 */

type ProviderId = "discord" | "google";

interface DocProps {
  /** i fornitori accesi, nell'ordine di `enabledOauthProviders`: c'e' il pulsante */
  providers: readonly ProviderId[];
  /** i fornitori accesi piu' quelli spenti di cui restano collegamenti: il sito ne tiene i dati */
  linked: readonly ProviderId[];
  /** l'avviso ai moderatori su Discord e' acceso */
  moderatorAlert: boolean;
}

const TESTI = testi({
  it: { Documento: PrivacyIt },
  en: { Documento: PrivacyEn },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const doc = legalDocument("privacy");
  return { title: doc.title[locale], description: doc.description[locale] };
}

export default async function PrivacyPage() {
  const { Documento } = TESTI[await getLocale()];
  const providers = enabledOauthProviders()
    .map((provider) => provider.id)
    .filter(isProviderId);
  const stored = await linkedProviders();
  const linked = PROVIDER_ORDER.filter((id) => providers.includes(id) || stored.includes(id));
  return (
    <Documento
      providers={providers}
      linked={linked}
      moderatorAlert={Boolean(process.env.DISCORD_WEBHOOK_MODERAZIONE)}
    />
  );
}

/* ------------------------------------------------------------ pezzi -- */

const PROVIDER_LABELS: Readonly<Record<ProviderId, string>> = { discord: "Discord", google: "Google" };
const PROVIDER_ORDER: readonly ProviderId[] = ["discord", "google"];

function isProviderId(id: string): id is ProviderId {
  return id === "discord" || id === "google";
}

/**
 * I fornitori di cui il database tiene ancora collegamenti. Un accesso spento
 * dopo essere stato usato lascia i dati di chi l'ha usato (collegamento, email,
 * nome e immagine del fornitore): l'informativa deve continuare a dirlo, e a
 * dire come elimina l'account chi non puo' piu' entrare. Senza database
 * nessuno: restano i fornitori accesi.
 */
async function linkedProviders(): Promise<ProviderId[]> {
  try {
    if (!(await databaseReachable())) return [];
    const rows = await db.selectDistinct({ provider: accounts.provider }).from(accounts);
    return rows.map((row) => row.provider).filter(isProviderId);
  } catch {
    return [];
  }
}

/** «Discord o Google», o il solo fornitore acceso. */
function providerNames(providers: readonly ProviderId[], or: string): string {
  return providers.map((id) => PROVIDER_LABELS[id]).join(` ${or} `);
}

/**
 * I limiti di tentativi contano su finestre diverse secondo l'azione
 * (src/lib/rate-limit.ts): la pagina dice la piu' corta e la piu' lunga.
 */
const WINDOW_MINUTES = Object.values(RULES).map((rule) => rule.windowSeconds / 60);
const SHORTEST_WINDOW = Math.min(...WINDOW_MINUTES);
const LONGEST_WINDOW = Math.max(...WINDOW_MINUTES);

const mesi = (n: number) => `${n} ${n === 1 ? "mese" : "mesi"}`;
const giorni = (n: number) => `${n} ${n === 1 ? "giorno" : "giorni"}`;
const months = (n: number) => `${n} ${n === 1 ? "month" : "months"}`;
const days = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

function durata(minuti: number): string {
  if (minuti % 60 === 0) return minuti === 60 ? "1 ora" : `${minuti / 60} ore`;
  return `${minuti} ${minuti === 1 ? "minuto" : "minuti"}`;
}

function duration(minutes: number): string {
  if (minutes % 60 === 0) return minutes === 60 ? "1 hour" : `${minutes / 60} hours`;
  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

/** Un altro documento legale, col titolo che ha ovunque (LEGAL_DOCUMENTS). */
function DocLink({ doc, locale }: { doc: LegalDocumentKey; locale: Locale }) {
  const { href, title } = legalDocument(doc);
  return <Link href={href}>{title[locale]}</Link>;
}

function OperatorName({ locale }: { locale: Locale }) {
  return OPERATOR.name ? <>{OPERATOR.name}</> : <Missing field="name" locale={locale} />;
}

function OperatorOffice({ locale }: { locale: Locale }) {
  return OPERATOR.registeredOffice ? <>{OPERATOR.registeredOffice}</> : <Missing field="registeredOffice" locale={locale} />;
}

function HostingName({ locale }: { locale: Locale }) {
  return HOSTING ? <>{HOSTING.name}</> : <Missing field="hosting" locale={locale} />;
}

/**
 * Un dato che operator.ts non ha ancora un campo per dire: si vede come
 * `Missing`. Serve per il servizio di posta del gestore, che conserva le email
 * che gli si scrivono (chi e', in che paese), e per la garanzia del
 * trasferimento se l'hosting scelto sta fuori dallo Spazio economico europeo.
 */
function ToComplete({ children }: { children: ReactNode }) {
  return <span className="border border-dashed border-gold px-1.5 text-ink">{children}</span>;
}

/**
 * Il riquadro dell'opposizione: l'art. 21, par. 4 GDPR vuole che il diritto sia
 * presentato «chiaramente e separatamente da qualsiasi altra informazione».
 * I colori del `Notice` informativo, con la tipografia del testo lungo.
 */
function ObjectionBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby="opposizione" className="p5-corner my-6 border border-brand bg-brand-soft px-5 pt-4 pb-1">
      <h3 id="opposizione" className="mt-0!">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** L'intestazione del sito e' fissa in alto: un'ancora non deve finirci sotto. */
const ANCHORS = "[&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20 [&_section]:scroll-mt-20";

const DISCORD_PRIVACY = "https://discord.com/privacy";
const GOOGLE_PRIVACY = "https://policies.google.com/privacy";
const GOOGLE_FRAMEWORKS = "https://policies.google.com/privacy/frameworks";
const GARANTE = "https://www.garanteprivacy.it";
const GARANTE_RECLAMO = "https://www.garanteprivacy.it/diritti/come-agire-per-tutelare-i-tuoi-dati-personali/reclamo";

/* ---------------------------------------------------------- italiano -- */

function PrivacyIt({ providers, linked, moderatorAlert }: DocProps) {
  // oauth: c'e' almeno un pulsante; held: il sito tiene collegamenti, anche di un fornitore spento
  const oauth = providers.length > 0;
  const held = linked.length > 0;
  const off = linked.filter((id) => !providers.includes(id));
  const discord = providers.includes("discord");
  const google = providers.includes("google");
  const nomi = providerNames(providers, "o");
  const nomiTutti = providerNames(linked, "o");
  const nomiSpenti = providerNames(off, "o");

  return (
    <div className={ANCHORS}>
      <PageHeader title="Privacy">{legalDocument("privacy").description.it}</PageHeader>
      <LastUpdated document="privacy" locale="it" />

      <Summary title="In breve">
        <ul>
          <li>
            <strong>Chi decide sui tuoi dati.</strong> È la società che gestisce Heiki, il «titolare del
            trattamento»: <OperatorName locale="it" />. Per qualsiasi domanda scrivi a <ContactEmail locale="it" />.
          </li>
          <li>
            <strong>Leggere non chiede dati.</strong> Puoi usare Heiki senza account. Niente pubblicità, niente
            statistiche sulle visite, niente servizi di altre aziende caricati nella pagina. Come ogni sito, il server
            vede il tuo indirizzo IP (il numero che identifica la tua connessione a internet) e la pagina che apri.
          </li>
          <li>
            <strong>Se ti iscrivi</strong> ci dai email, password, handle (il nome che compare nell&apos;indirizzo del
            tuo profilo) e nome visualizzato. La password la salviamo solo come impronta: un codice da cui è molto
            difficile risalire alla password. Tutto il resto è facoltativo.
          </li>
          <li>
            <strong>Cosa vedono tutti.</strong> Il tuo profilo e quello che pubblichi li vede chiunque, anche senza
            account, e i motori di ricerca possono mostrarli. Sul profilo ci sono anche gli account di gioco che salvi:
            nickname, server, Codice amico e classe. La tua email non è mai pubblica.
          </li>
          <li>
            <strong>Se verifichi la classe.</strong> Solo tu e i moderatori vedete la schermata che carichi, e si
            cancella quando decidono, o dopo {giorni(RETENTION.pendingScreenshotDays)} se nessuno decide. Per{" "}
            {mesi(RETENTION.verificationHistoryMonths)} teniamo un&apos;impronta del file: il sito rifiuta la stessa
            immagine se viene ricaricata da un altro account o in un altro giorno.
          </li>
          <li>
            <strong>Niente pubblicità né vendita.</strong> Non vendiamo i tuoi dati, non li usiamo per la pubblicità e
            non costruiamo profili dei tuoi gusti.
          </li>
          <li>
            <strong>Quanto teniamo le cose.</strong> L&apos;account e quello che ci salvi (profilo, account di gioco,
            voti, tier list) restano finché esiste l&apos;account. Post, commenti, guide e strategie restano anche dopo,
            con il nome «Account eliminato», finché non chiedi di toglierli. Altri dati hanno una durata fissa e il sito
            li cancella da solo quando scade, per esempio le notifiche dopo {mesi(RETENTION.notificationsMonths)}. Le
            email che scrivi al gestore e le copie di sicurezza le cancella lui. Tutte le durate sono nella{" "}
            <a href="#durate">sezione 7</a>.
          </li>
          <li>
            <strong>Come cancellare e a chi scrivere.</strong> Elimini l&apos;account dalla pagina{" "}
            <Link href="/impostazioni/account">Impostazioni dell&apos;account</Link>. Per avere una copia dei tuoi
            dati, correggerli o opporti a un uso scrivi a <ContactEmail locale="it" />: rispondiamo entro{" "}
            {mesi(PRIVACY_RESPONSE_MONTHS)}.
          </li>
        </ul>
      </Summary>

      <h2 id="titolare">1. Chi è il titolare</h2>
      <p>
        Il titolare del trattamento è chi decide perché e come si usano i tuoi dati. Per Heiki è la società che
        gestisce il sito: <strong><OperatorName locale="it" /></strong>, con sede legale in{" "}
        <OperatorOffice locale="it" />.
      </p>
      <p>
        Per tutto quello che riguarda i tuoi dati scrivi a <ContactEmail locale="it" />
        {OPERATOR.pec ? (
          <>
            , oppure alla PEC (posta elettronica certificata){" "}
            <a href={`mailto:${OPERATOR.pec}`}>{OPERATOR.pec}</a>
          </>
        ) : null}
        . L&apos;email è la stessa per tutto: privacy, segnalazioni e richieste dei titolari dei diritti. Gli altri dati
        della società sono nelle <DocLink doc="note-legali" locale="it" />.
      </p>
      <p>
        Heiki non ha un responsabile della protezione dei dati (DPO): per un sito come questo la legge non lo chiede
        (art. 37 GDPR).
      </p>

      <h2 id="dati">2. Quali dati, perché e su quale base</h2>
      <p>
        La tabella dice, per ogni cosa che fai su Heiki, quali dati usiamo, a cosa servono e quale regola del GDPR lo
        permette (la «base giuridica», art. 6 GDPR). Le basi sono tre:
      </p>
      <ul>
        <li>
          <strong>Contratto</strong>: i dati servono a darti il servizio che chiedi iscrivendoti, quello descritto nei{" "}
          <DocLink doc="termini" locale="it" /> (art. 6, par. 1, lett. b).
        </li>
        <li>
          <strong>Legittimo interesse</strong>: i dati servono a uno scopo preciso del gestore, scritto in tabella. La
          legge lo permette solo se i tuoi interessi e diritti non pesano di più (lett. f). Puoi chiederci come abbiamo
          pesato il nostro interesse e i tuoi diritti, e puoi opporti: vedi il{" "}
          <a href="#opposizione">riquadro dell&apos;opposizione</a>.
        </li>
        <li>
          <strong>Obbligo di legge</strong>: una legge ci chiede di farlo (lett. c).
        </li>
      </ul>
      <p>
        Nessun trattamento si basa sul tuo consenso: oggi non serve, perché Heiki non ha pubblicità, statistiche o
        newsletter.
      </p>

      <TableScroll>
        <table>
          <thead>
            <tr>
              <th>Cosa</th>
              <th>Perché</th>
              <th>Base giuridica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Visitare il sito</strong>, anche senza account: indirizzo IP, pagina richiesta, data e ora. Li
                vede il server e li registra il fornitore di hosting.
              </td>
              <td>Mandarti le pagine e proteggere il sito da abusi e attacchi.</td>
              <td>Legittimo interesse: far funzionare il sito e tenerlo sicuro.</td>
            </tr>
            <tr>
              <td>
                <strong>Account</strong>: email, password, handle, nome visualizzato, ruolo, data di iscrizione.
              </td>
              <td>
                Creare l&apos;account, farti entrare e mostrare chi ha scritto cosa. La password si salva solo come
                impronta (bcrypt).
              </td>
              <td>Contratto.</td>
            </tr>
            {held ? (
              <tr>
                <td>
                  <strong>Accesso con {nomiTutti}</strong>: il collegamento con il tuo account {nomiTutti}, e
                  l&apos;email, il nome e l&apos;immagine del profilo che il fornitore ci manda.
                </td>
                <td>Farti entrare senza una password di Heiki.</td>
                <td>Contratto.</td>
              </tr>
            ) : null}
            <tr>
              <td>
                <strong>Profilo</strong>: bio, paese o regione, eroi preferiti, personalizzazione (accento, cornice,
                sfondo, impaginazione).
              </td>
              <td>Mostrare la tua pagina pubblica.</td>
              <td>Contratto.</td>
            </tr>
            <tr>
              <td>
                <strong>Contenuti</strong>: post, commenti e risposte, voti, guide, strategie dell&apos;Endgame,
                valutazioni degli eroi, tier list.
              </td>
              <td>
                Pubblicarli con il tuo nome e contare i voti. Le strategie con un testo le controlla un moderatore prima
                che escano.
              </td>
              <td>Contratto.</td>
            </tr>
            <tr>
              <td>
                <strong>Seguire e notifiche</strong>: chi segui e chi ti segue, le notifiche che ricevi.
              </td>
              <td>Avvisarti di risposte, nuovi seguaci, esiti delle verifiche e delle revisioni.</td>
              <td>Contratto.</td>
            </tr>
            <tr>
              <td>
                <strong>Account di gioco e box</strong> (facoltativi): nickname, Codice amico, server, classe
                dell&apos;account, costellazioni, box degli eroi.
              </td>
              <td>
                Calcolare le statistiche degli eroi con i tuoi dati, mostrare nickname, server, Codice amico e classe sul
                profilo, ritrovare tutto su un altro dispositivo.
              </td>
              <td>Contratto: è una funzione che chiedi tu.</td>
            </tr>
            <tr>
              <td>
                <strong>Verifica della classe</strong> (facoltativa): la schermata dell&apos;Elenco eroi, la classe
                dichiarata, l&apos;eroe del giorno e quelli scartati con «non ce l&apos;ho», l&apos;esito, il moderatore
                che ha deciso, il motivo di un rifiuto.
              </td>
              <td>Far confermare a un moderatore la classe che mostri sul profilo.</td>
              <td>Contratto.</td>
            </tr>
            <tr>
              <td>
                <strong>Impronta della schermata</strong>: un codice ricavato dal file (SHA-256), da cui
                l&apos;immagine non si ricostruisce.
              </td>
              <td>Rifiutare in automatico una schermata già usata da un altro account o in un altro giorno.</td>
              <td>Legittimo interesse: evitare che la stessa schermata valga per account diversi o per un altro giorno.</td>
            </tr>
            <tr>
              <td>
                <strong>Segnalazioni</strong>: chi segnala, il contenuto segnalato, il motivo e i dettagli.
              </td>
              <td>Far controllare il contenuto a un moderatore.</td>
              <td>
                Obbligo di legge per i contenuti illegali (artt. 16 e 17 DSA). Per le altre violazioni delle regole,
                legittimo interesse: far rispettare le regole della community e proteggere gli altri utenti.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Moderazione</strong>: contenuti nascosti, strategie respinte con il motivo, sospensioni con
                motivo e durata, registro di ogni azione dei moderatori (chi, su cosa, quale azione, perché).
              </td>
              <td>Far rispettare le regole, gestire le contestazioni, riconoscere chi ripete una violazione.</td>
              <td>
                Legittimo interesse: far rispettare le regole della community e proteggere gli altri utenti. Obbligo di
                legge per le decisioni sui contenuti illegali (art. 17 DSA).
              </td>
            </tr>
            <tr>
              <td>
                <strong>Limiti di tentativi</strong>: un&apos;impronta dell&apos;indirizzo IP, dell&apos;email con cui
                provi a entrare, a iscriverti o a recuperare la password, o del tuo identificativo, con l&apos;ora dei
                tentativi. Solo nella memoria del server.
              </td>
              <td>Fermare chi prova password a raffica, crea account in serie o manda spam.</td>
              <td>Legittimo interesse: proteggere gli account e il sito dagli abusi.</td>
            </tr>
            <tr>
              <td>
                <strong>Recupero della password</strong>: la richiesta, collegata al tuo account, con l&apos;impronta
                del collegamento e la scadenza. Nel registro del server, che tiene l&apos;hosting, resta una riga con
                l&apos;identificativo interno del tuo account (mai l&apos;email né il collegamento).
              </td>
              <td>Reimpostare la password. Oggi il collegamento non parte: il sito non manda email.</td>
              <td>Contratto.</td>
            </tr>
            <tr>
              <td>
                <strong>Email al gestore</strong>: il tuo indirizzo, quello che scrivi e i dati che servono alla
                richiesta (per una segnalazione il contenuto e il motivo, per un titolare dei diritti il diritto che fa
                valere).
              </td>
              <td>Rispondere, gestire la richiesta e tenerne traccia in caso di contestazioni.</td>
              <td>
                Obbligo di legge per le richieste sui tuoi dati (artt. 12-22 GDPR) e per le segnalazioni di contenuti
                illegali (art. 16 DSA). Per le altre, legittimo interesse: rispondere a chi scrive e potersi difendere in
                una contestazione.
              </td>
            </tr>
          </tbody>
        </table>
      </TableScroll>

      <p>
        Quello che cerchi nella pagina di ricerca (<code>/cerca</code>) finisce nell&apos;indirizzo della pagina, e
        quindi anche nei registri dell&apos;hosting come ogni indirizzo; il sito non salva le ricerche. La ricerca
        rapida filtra nel tuo browser un elenco scaricato dal sito. Mentre scrivi, però, il browser chiede in anticipo
        al sito le pagine che compaiono nel pannello: i risultati e la pagina di ricerca con nell&apos;indirizzo il
        testo scritto fin lì. Così una parte di quello che scrivi arriva al server, e nei registri dell&apos;hosting,
        anche se non apri niente.
      </p>
      <p>
        I cookie e i dati che il sito salva nel tuo browser sono spiegati uno per uno in{" "}
        <DocLink doc="cookie" locale="it" />: servono solo a far funzionare il sito e a ricordare le tue scelte.
      </p>

      {held ? (
        <>
          <h3 id="discord-google">{off.length === 0 ? <>Se entri con {nomi}</> : <>Accesso con {nomiTutti}</>}</h3>
          <ul>
            {discord ? (
              <li>
                <strong>Discord.</strong> Il pulsante ti porta su <code>discord.com</code>, che ti chiede il permesso
                di dirci chi sei e la tua email (<code>identify email</code>). Con questo permesso Discord ci manda i
                dati del tuo account: identificativo, nome utente e nome che mostri, immagine, banner e colore del
                profilo, lingua, email e se è verificata, tipo di abbonamento Nitro, se usi la verifica in due passaggi
                e i distintivi dell&apos;account. Come Discord tratta i tuoi dati:{" "}
                <a href={DISCORD_PRIVACY}>discord.com/privacy</a>.
              </li>
            ) : null}
            {google ? (
              <li>
                <strong>Google.</strong> Il pulsante ti porta su <code>accounts.google.com</code>, che ti chiede il
                permesso di dirci chi sei, il tuo nome, l&apos;immagine del profilo e la tua email (
                <code>openid profile email</code>). Riceviamo l&apos;identificativo del tuo account Google, il nome (di
                solito nome e cognome veri), l&apos;email e se è verificata, l&apos;indirizzo dell&apos;immagine del
                profilo e, quando Google li aggiunge, la lingua e il dominio dell&apos;organizzazione (per un account di
                scuola o di lavoro). Come Google tratta i tuoi dati:{" "}
                <a href={GOOGLE_PRIVACY}>policies.google.com/privacy</a>.
              </li>
            ) : null}
            {off.length > 0 ? (
              <li>
                L&apos;accesso con {nomiSpenti} oggi è spento. Di chi è entrato così in passato teniamo ancora i dati
                scritti qui sotto, finché esiste l&apos;account.
              </li>
            ) : null}
            {oauth ? (
              <>
                <li>
                  Il fornitore sa che stai entrando in Heiki e tratta i tuoi dati per conto suo, come titolare
                  autonomo, secondo la sua informativa.
                </li>
                <li>Entri solo se il fornitore ha già verificato la tua email.</li>
              </>
            ) : null}
            <li>
              Salviamo solo il collegamento (quale fornitore e il tuo identificativo presso di lui), l&apos;email, il
              nome e l&apos;indirizzo dell&apos;immagine: gli altri dati che il fornitore ci manda non li salviamo. Nome
              e immagine non si mostrano da nessuna parte nel sito. Non salviamo i gettoni di accesso, cioè i codici che
              servono a chiedere al fornitore i tuoi dati in un secondo momento.
            </li>
            {oauth ? (
              <li>
                La prima volta che entri così, il sito ti crea un handle neutro, «giocatore-» seguito da caratteri a
                caso, e lo usa anche come nome pubblico: il nome che hai presso il fornitore non diventa pubblico.
                Handle e nome li cambi dalle <Link href="/impostazioni/profilo">impostazioni del profilo</Link>; se il
                tuo account è sospeso, scrivi al gestore.
              </li>
            ) : null}
          </ul>
        </>
      ) : null}

      <h2 id="pubblico">3. Cosa è pubblico</h2>
      <p>
        Pubblico vuol dire che lo vede chiunque apra la pagina, anche senza account, e che i motori di ricerca come
        Google possono mostrarlo nei loro risultati.
      </p>
      <ul>
        <li>
          <strong>Il tuo profilo</strong>, all&apos;indirizzo <code>/u/</code> seguito dal tuo handle: handle, nome
          visualizzato, bio, paese o regione, ruolo nel sito, mese e anno di iscrizione, quante persone ti seguono e
          quante ne segui, quanti post hai scritto, fino a {FAVORITES_LIMIT} eroi preferiti, la personalizzazione
          (accento, cornice, sfondo, impaginazione), le tier list pubbliche e gli ultimi post.
        </li>
        <li>
          <strong>Gli account di gioco che salvi</strong>: nickname, server, Codice amico, la classe dell&apos;account
          che dichiari e quella verificata, con la data. Si vedono sempre sul profilo: oggi non c&apos;è un interruttore
          per nasconderli, né un pulsante per toglierli una volta salvati (per toglierli scrivi al gestore). Quello che
          salvi senza essere collegato resta nel browser, ma quando entri e apri da quel browser una pagina del gioco o
          la pagina <Link href="/profilo">Il tuo profilo</Link>, si copia nel tuo account e quindi sul profilo. Vale
          anche per la classe che muovi con lo slider di una scheda eroe, prima o dopo l&apos;accesso. Se non vuoi che si vedano, non inserirli nel browser con cui entri, oppure
          cancella i dati del sito dal browser prima di entrare.
        </li>
        <li>
          <strong>Quello che pubblichi</strong>: post, commenti, guide, strategie dell&apos;Endgame e valutazioni degli
          eroi, con il tuo nome e il collegamento al profilo. La home mostra a tutti i post più votati, con nome, handle
          e ruolo di chi li ha scritti. Sotto ogni guida c&apos;è l&apos;elenco pubblico delle modifiche: chi
          l&apos;ha modificata (handle), quando, la patch e la nota.
        </li>
        <li>
          <strong>Le tier list</strong> che salvi sono di serie «Visibile nel profilo»: pubbliche sul profilo e per
          chiunque abbia il collegamento. Se togli la spunta, le vedi solo tu.
        </li>
      </ul>
      <p>
        <strong>Non sono pubblici</strong>: l&apos;email, la password, il box degli eroi e le costellazioni, il singolo
        voto che dai (si vede solo il punteggio), chi segui e chi ti segue (si vedono solo i numeri, ma chi inizi a
        seguire riceve una notifica con il tuo nome), le segnalazioni, la schermata della verifica.
      </p>
      <p>
        Quello che è pubblico lo può leggere e copiare chiunque, e un motore di ricerca può continuare a mostrarlo per
        un po&apos; anche dopo che è stato tolto. Pensaci prima di scrivere dati personali tuoi, e non scrivere quelli
        di altre persone: «Dati personali di qualcuno» è uno dei motivi per segnalare un contenuto.
      </p>

      <h2 id="obbligatori">4. Dati obbligatori e facoltativi</h2>
      <ul>
        <li>Per leggere il sito non serve nessun dato.</li>
        <li>
          Per iscriverti servono email, password, handle e nome visualizzato. Senza, non possiamo creare
          l&apos;account; il sito resta comunque leggibile.
          {oauth ? <> Con {nomi} basta il tuo account presso il fornitore, con un&apos;email verificata.</> : null}
        </li>
        <li>
          L&apos;email non la verifichiamo con un collegamento: il sito controlla solo che abbia la forma giusta. Usa un
          indirizzo tuo: è quello da cui ci scrivi per le richieste sul tuo account (
          <a href="#diritti">sezione 9</a>).
        </li>
        <li>
          Tutto il resto è facoltativo: bio, paese, eroi preferiti, account di gioco, box, verifica della classe e,
          naturalmente, quello che pubblichi. Se non li dai, non usi quella funzione; il resto del sito funziona lo
          stesso.
        </li>
      </ul>

      <h2 id="destinatari">5. Chi riceve i dati</h2>
      <ul>
        <li>
          <strong>Lo staff di Heiki</strong>: persone autorizzate dal gestore, ognuna per il suo compito. I moderatori
          vedono le segnalazioni con il nome di chi le ha fatte (chi viene segnalato non lo sa), le schermate delle
          verifiche, le strategie in revisione e le sospensioni. I redattori possono modificare le guide degli altri e
          vederne le bozze. Gli amministratori vedono anche l&apos;elenco degli utenti con l&apos;email, e possono
          cercarli per email. Ogni azione dei moderatori resta nel registro.
        </li>
        <li>
          <strong>Il fornitore di hosting</strong> (<HostingName locale="it" />): tiene il sito e il database per conto
          del gestore, con un contratto che lo obbliga a usare i dati solo per questo (art. 28 GDPR). Tiene anche i
          registri tecnici del server.
        </li>
        <li>
          <strong>Il servizio di posta del gestore</strong> (
          <ToComplete>da completare: chi ospita la casella email del gestore</ToComplete>): conserva per conto del
          gestore le email che gli scrivi, con un contratto che lo obbliga a usarle solo per questo (art. 28 GDPR).
        </li>
        <li>
          <strong>Chi visita il sito</strong> vede quello che è pubblico (<a href="#pubblico">sezione 3</a>).
        </li>
        <li>
          <strong>Le autorità</strong>, solo quando la legge lo impone: per esempio l&apos;ordine di un giudice, o
          informazioni su un reato che minaccia la vita o la sicurezza di qualcuno, che Heiki deve segnalare subito
          (art. 18 DSA).
        </li>
        {moderatorAlert ? (
          <li>
            <strong>Avviso ai moderatori su Discord.</strong> Quando arriva una schermata da verificare o una strategia
            dell&apos;Endgame da rivedere, il server manda un messaggio in un canale Discord dei moderatori. Il
            messaggio non contiene dati personali: dice solo che c&apos;è qualcosa da guardare, con il collegamento alla
            coda del sito (per le strategie anche modalità e difficoltà). Chi l&apos;ha mandata e cosa dichiara, i
            moderatori lo leggono solo nel sito, dopo l&apos;accesso.
          </li>
        ) : null}
        {oauth ? (
          <li>
            <strong>{nomi}</strong>: il fornitore non riceve dati da Heiki. Sei tu a entrare con il tuo account presso
            di lui, ed è lui a mandarci i dati elencati nella <a href="#discord-google">sezione 2</a>.
          </li>
        ) : null}
      </ul>
      <p>
        Non vendiamo i tuoi dati e non li diamo ad altre aziende per i loro scopi. Il sito non manda email: oggi non
        usa nessun servizio per spedirle. Quando lo userà, per esempio per il recupero della password, lo scriveremo
        qui con il suo nome prima di attivarlo.
      </p>

      <h2 id="estero">6. Fuori dall&apos;Unione europea</h2>
      <p>
        Lo Spazio economico europeo è l&apos;Unione europea più Islanda, Liechtenstein e Norvegia: lì vale il GDPR.
        Ecco dove vanno i tuoi dati.
      </p>
      <ul>
        <li>
          <strong>Hosting.</strong>{" "}
          {!HOSTING ? (
            <>
              I dati stanno sui server del fornitore di hosting: <Missing field="hosting" locale="it" />.
            </>
          ) : HOSTING.outsideEea ? (
            <>
              I dati stanno sui server di {HOSTING.name}, in {HOSTING.location.it}, fuori dallo Spazio economico
              europeo. Il trasferimento si basa su{" "}
              <ToComplete>da completare: la garanzia del trasferimento (art. 45 o 46 GDPR)</ToComplete>.
            </>
          ) : (
            <>
              I dati stanno sui server di {HOSTING.name}, in {HOSTING.location.it}, dentro lo Spazio economico europeo.
            </>
          )}
        </li>
        <li>
          <strong>Posta del gestore.</strong>{" "}
          <ToComplete>
            da completare: in che paese stanno le email che scrivi al gestore e, se è fuori dallo Spazio economico
            europeo, su quale garanzia si basa il trasferimento (art. 45 o 46 GDPR)
          </ToComplete>
          .
        </li>
        {discord ? (
          <li>
            <strong>Discord.</strong> Discord dice che per chi vive nello Spazio economico europeo il titolare è Discord
            Netherlands BV.
          </li>
        ) : null}
        {google ? (
          <li>
            <strong>Google.</strong> Google dice che per chi vive nello Spazio economico europeo il titolare è Google
            Ireland Limited. Google LLC, la società del gruppo negli Stati Uniti, aderisce al Data Privacy Framework
            UE-USA, che la Commissione europea riconosce come protezione adeguata (art. 45 GDPR):{" "}
            <a href={GOOGLE_FRAMEWORKS}>policies.google.com/privacy/frameworks</a>.
          </li>
        ) : null}
        {oauth ? (
          <li>
            In ogni caso è il fornitore a mandare i dati a Heiki, non il contrario: Heiki non manda dati personali al
            fornitore.
          </li>
        ) : null}
        {moderatorAlert ? (
          <li>
            <strong>Avviso ai moderatori su Discord.</strong> Non contiene dati personali.
          </li>
        ) : null}
      </ul>

      <h2 id="durate">7. Per quanto tempo</h2>
      <p>
        Per ogni dato la tabella dice quanto resta. Le durate in mesi e giorni le applica il server da solo: una volta
        al giorno cancella quello che è scaduto. Fanno eccezione le email e le copie di sicurezza, che cancella a mano
        il gestore, e i registri dell&apos;hosting, che cancella il fornitore.
      </p>
      <TableScroll>
        <table>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Per quanto tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Account e profilo{held ? <>, collegamento con {nomiTutti}</> : null}</td>
              <td>
                Finché esiste l&apos;account. Lo elimini dalla pagina{" "}
                <Link href="/impostazioni/account">Impostazioni dell&apos;account</Link>.
                {held ? <> I gettoni di accesso di {nomiTutti} non si salvano.</> : null}
              </td>
            </tr>
            <tr>
              <td>Account di gioco, box, classe e costellazioni</td>
              <td>Finché esiste l&apos;account. Nel browser, finché non li cancelli tu.</td>
            </tr>
            <tr>
              <td>Voti, valutazioni degli eroi, tier list, chi segui e chi ti segue</td>
              <td>Finché esiste l&apos;account.</td>
            </tr>
            <tr>
              <td>Notifiche, lette o no</td>
              <td>{mesi(RETENTION.notificationsMonths)} dalla notifica, o prima se elimini l&apos;account.</td>
            </tr>
            <tr>
              <td>Post, commenti, guide e strategie dell&apos;Endgame</td>
              <td>
                Non scadono: restano anche se elimini l&apos;account, sotto «Account eliminato» (
                <a href="#eliminazione">sezione 8</a>). Per toglierne uno scrivi al gestore.
              </td>
            </tr>
            <tr>
              <td>Versioni precedenti delle guide</td>
              <td>{mesi(RETENTION.guideRevisionsMonths)} dalla modifica.</td>
            </tr>
            <tr>
              <td>Segnalazioni</td>
              <td>
                Chiuse (risolte o archiviate): {mesi(RETENTION.closedReportsMonths)} dalla segnalazione. Aperte: finché
                un moderatore decide. Quelle che hai fatto tu se ne vanno anche con il tuo account.
              </td>
            </tr>
            <tr>
              <td>Registro delle azioni dei moderatori</td>
              <td>{mesi(RETENTION.moderationLogMonths)} dall&apos;azione.</td>
            </tr>
            <tr>
              <td>Sospensioni</td>
              <td>
                Finite (scadute o revocate): {mesi(RETENTION.endedSuspensionsMonths)} dalla fine. In corso: finché
                durano.
              </td>
            </tr>
            <tr>
              <td>Schermata della verifica</td>
              <td>
                Si cancella appena un moderatore decide, se ritiri la richiesta, se cambi Codice amico o server, se
                elimini l&apos;account, o dopo {giorni(RETENTION.pendingScreenshotDays)} senza una decisione: la
                richiesta si chiude e puoi farne un&apos;altra.
              </td>
            </tr>
            <tr>
              <td>
                Storico delle verifiche: esito, eroe del giorno, eroi scartati, classe dichiarata, impronta della
                schermata
              </td>
              <td>
                {mesi(RETENTION.verificationHistoryMonths)} dalla richiesta, o prima se elimini l&apos;account.
              </td>
            </tr>
            <tr>
              <td>Richieste di recupero della password</td>
              <td>{giorni(RETENTION.passwordResetDays)} dalla richiesta.</td>
            </tr>
            <tr>
              <td>Limiti di tentativi</td>
              <td>
                Solo nella memoria del server, mai su disco né nel database: contano i tentativi di una finestra da{" "}
                {durata(SHORTEST_WINDOW)} a {durata(LONGEST_WINDOW)}, secondo l&apos;azione, e si perdono quando il
                server si riavvia.
              </td>
            </tr>
            <tr>
              <td>
                Registri tecnici del server: visite (IP, pagina, ora) e richieste di recupero della password
                (identificativo dell&apos;account)
              </td>
              <td>
                {HOSTING ? (
                  <>{giorni(HOSTING.logRetentionDays)}. Li tiene e li cancella il fornitore di hosting.</>
                ) : (
                  <Missing field="hosting" locale="it" />
                )}
              </td>
            </tr>
            <tr>
              <td>Email al gestore: richieste sui dati, segnalazioni, titolari dei diritti</td>
              <td>
                {mesi(RETENTION.emailRequestsMonths)} dalla chiusura della richiesta. Le cancella il gestore a mano.
              </td>
            </tr>
            <tr>
              <td>Copie di sicurezza del database</td>
              <td>
                Il gestore le fa a mano e tiene le ultime {BACKUP_COPIES}. Un dato cancellato resta nelle copie fatte
                prima, finché non vengono sostituite da copie nuove.
              </td>
            </tr>
            <tr>
              <td>Cookie e dati nel browser</td>
              <td>
                Vedi <DocLink doc="cookie" locale="it" />. I dati nel browser restano finché non li cancelli tu.
              </td>
            </tr>
          </tbody>
        </table>
      </TableScroll>

      <h2 id="eliminazione">8. Se elimini l&apos;account</h2>
      <p>
        Lo elimini da solo dalla pagina <Link href="/impostazioni/account">Impostazioni dell&apos;account</Link>: scrivi{" "}
        <code>{DELETE_PHRASES.it}</code> (o <code>{DELETE_PHRASES.en}</code>) e confermi con la password.
        {oauth ? (
          <>
            {" "}
            Se sei entrato solo con {nomi} e non hai una password, esci e rientra con {nomi}: da quel momento hai 10
            minuti per eliminare l&apos;account.
          </>
        ) : null}
        {off.length > 0 ? (
          <>
            {" "}
            Se sei entrato solo con {nomiSpenti} e oggi quell&apos;accesso è spento, per eliminare l&apos;account
            scrivi al gestore.
          </>
        ) : null}{" "}
        Moderatori e amministratori devono prima farsi togliere il ruolo da un amministratore.
      </p>
      <h3>Cosa si cancella subito</h3>
      <p>
        Il profilo, {held ? <>il collegamento con {nomiTutti}, </> : null}gli account di gioco con le verifiche e le
        schermate, il box, i voti, le valutazioni degli eroi, le tier list, le segnalazioni che hai fatto, chi segui e
        chi ti segue, le notifiche, le richieste di recupero della password e le sospensioni che hai ricevuto. Del
        registro della moderazione resta la riga di ogni azione che ti riguarda, fino ai suoi{" "}
        {mesi(RETENTION.moderationLogMonths)}.
      </p>
      <h3>Cosa resta</h3>
      <ul>
        <li>
          <strong>Post, commenti, guide con le loro versioni e strategie dell&apos;Endgame.</strong> Passano a un utente
          segnaposto con il nome «Account eliminato» e un handle «eliminato-» seguito da una parte di un codice interno,
          che non contiene il tuo nome né il tuo handle. Il testo resta com&apos;era, e la pagina del segnaposto mostra
          gli ultimi post. Restano perché cancellarli spezzerebbe le discussioni degli altri. Se vuoi togliere anche
          questi, scrivi al gestore indicando quali (basta l&apos;indirizzo della pagina): li toglie lui a mano.
        </li>
        <li>
          <strong>Le copie nel tuo browser</strong> (account di gioco, box, bozze): finché non le cancelli, come spiega{" "}
          <DocLink doc="cookie" locale="it" />.
        </li>
        <li>
          <strong>Le copie di sicurezza del database</strong>: finché non vengono sostituite (
          <a href="#durate">sezione 7</a>).
        </li>
      </ul>
      <p>
        Se eri collegato su altri dispositivi, lì l&apos;accesso smette di valere. Non c&apos;è un pulsante per
        scaricare tutti i tuoi dati: se li vuoi, chiedili per email prima di eliminare l&apos;account. Le tier list puoi
        già scaricarle da solo, come file JSON o immagine PNG.
      </p>

      <h2 id="diritti">9. I tuoi diritti e il reclamo</h2>
      <p>
        Il GDPR ti dà questi diritti (artt. 15-22 GDPR). Quello che puoi fare da solo è scritto accanto a ogni diritto;
        per il resto scrivi a <ContactEmail locale="it" />.
      </p>
      <ul>
        <li>
          <strong>Accesso</strong>: sapere quali dati abbiamo su di te e averne una copia.
        </li>
        <li>
          <strong>Rettifica</strong>: correggere i dati sbagliati. Profilo e account di gioco li correggi da solo,
          l&apos;email dalla pagina <Link href="/impostazioni/account">Impostazioni dell&apos;account</Link>. Se il tuo
          account è sospeso, profilo e account di gioco non si possono modificare: scrivi al gestore e li corregge lui.
          {held ? (
            <> Chi è entrato solo con {nomiTutti} non ha una password, e per cambiare l&apos;email scrive al gestore.</>
          ) : null}
        </li>
        <li>
          <strong>Cancellazione</strong>: eliminare l&apos;account (<a href="#eliminazione">sezione 8</a>) o far
          togliere un singolo dato, per esempio un post.
        </li>
        <li>
          <strong>Limitazione</strong>: chiedere che un dato resti ma non venga usato, per esempio mentre controlliamo
          una tua contestazione.
        </li>
        <li>
          <strong>Portabilità</strong>: ricevere i dati che ci hai dato in un formato che un computer sa leggere (per
          esempio JSON), per portarli altrove. Oggi si chiede per email.
        </li>
        <li>
          <strong>Opposizione</strong>: vedi il riquadro qui sotto.
        </li>
      </ul>
      <p>
        Rispondiamo entro {mesi(PRIVACY_RESPONSE_MONTHS)}, gratis. Se la richiesta è complicata il termine si allunga al
        massimo di altri due mesi: in quel caso te lo diciamo entro il primo mese, con il motivo (art. 12 GDPR). Scrivi
        dall&apos;indirizzo email del tuo account: è il modo più semplice per riconoscerti. Da solo però non prova che
        l&apos;account è tuo, perché il sito non verifica l&apos;email con un collegamento (
        <a href="#obbligatori">sezione 4</a>): ti chiediamo anche di confermare la richiesta dal sito, mentre sei
        collegato, per esempio con una piccola modifica al profilo che ti indichiamo. Se non puoi, ti chiediamo solo
        quello che serve a capire che sei tu.
      </p>

      <ObjectionBox title="Il diritto di opporti">
        <p>
          Puoi opporti in ogni momento, per motivi legati alla tua situazione, ai trattamenti basati sul legittimo
          interesse (art. 21 GDPR). Su Heiki sono:
        </p>
        <ul>
          <li>i registri tecnici del server e i limiti di tentativi, per la sicurezza;</li>
          <li>l&apos;impronta della schermata della verifica;</li>
          <li>la moderazione delle violazioni delle regole: segnalazioni, contenuti nascosti, sospensioni e il loro registro;</li>
          <li>le email che scrivi al gestore, quando non c&apos;è un obbligo di legge.</li>
        </ul>
        <p>
          Scrivi a <ContactEmail locale="it" /> e spiega perché. Il gestore smette, a meno che abbia motivi legittimi
          più forti dei tuoi interessi, diritti e libertà, o che i dati servano a difendere un diritto in giudizio. Se
          continua, ti scrive perché.
        </p>
      </ObjectionBox>

      <h3>Il reclamo</h3>
      <p>
        Se pensi che trattiamo i tuoi dati in modo sbagliato, puoi fare reclamo al Garante per la protezione dei dati
        personali, Piazza Venezia 11, 00187 Roma (<a href={GARANTE}>garanteprivacy.it</a>). Come fare lo spiega la{" "}
        <a href={GARANTE_RECLAMO}>pagina del reclamo</a>. Se vivi o lavori in un altro paese dell&apos;Unione europea,
        puoi rivolgerti anche all&apos;autorità di quel paese (art. 77 GDPR). Puoi anche andare da un giudice (art. 79
        GDPR).
      </p>

      <h2 id="minori">10. Minori</h2>
      <p>
        Per avere un account devi avere almeno {MIN_AGE} anni: è l&apos;età da cui, in Italia, puoi decidere da solo
        sui tuoi dati nei servizi online (art. 2-quinquies del Codice privacy). Iscrivendoti lo dichiari; non chiediamo
        la data di nascita né documenti. Sotto i {MIN_AGE} anni puoi leggere il sito, ma non iscriverti.
      </p>
      <p>
        Se veniamo a sapere che un account è di una persona con meno di {MIN_AGE} anni, il gestore lo chiude e ne
        cancella i dati. Se sei un genitore e pensi che sia il caso di tuo figlio o di tua figlia, scrivi a{" "}
        <ContactEmail locale="it" />.
      </p>

      <h2 id="automatiche">11. Decisioni automatiche</h2>
      <p>
        Nessuna decisione su di te la prende solo un programma (art. 22 GDPR), e non facciamo profilazione. Sui
        contenuti e sugli account decidono persone: i moderatori e il gestore.
      </p>
      <p>
        Il sito fa solo controlli automatici semplici, che fermano una singola azione e non decidono niente su di te:
      </p>
      <ul>
        <li>
          un limite al numero di azioni in un tempo da {durata(SHORTEST_WINDOW)} a {durata(LONGEST_WINDOW)}, secondo
          l&apos;azione, contro lo spam;
        </li>
        <li>
          le regole della verifica della classe: puoi cambiare l&apos;eroe del giorno al massimo {MAX_REROLLS} volte, e
          dopo una verifica approvata aspetti {giorni(VERIFICATION_COOLDOWN_DAYS)} prima di chiederne un&apos;altra;
        </li>
        <li>
          il confronto dell&apos;impronta della schermata, che rifiuta un&apos;immagine già usata da un altro account o
          in un altro giorno (puoi caricarne una nuova);
        </li>
        <li>
          controlli di forma, come la lunghezza dei testi, i caratteri invisibili e i nomi riservati (per esempio
          «admin»).
        </li>
      </ul>

      <h2 id="sicurezza">12. Sicurezza</h2>
      <ul>
        <li>La password si salva solo come impronta bcrypt, mai in chiaro.</li>
        <li>La sessione sta in un cookie cifrato.</li>
        <li>
          Sul sito pubblicato il server chiede al browser di usare sempre il collegamento protetto (https): dopo la
          prima visita in https, il browser non apre più il sito senza protezione (HSTS).
        </li>
        <li>Una regola mandata al browser (Content-Security-Policy) blocca script e risorse di altri siti.</li>
        <li>Ci sono limiti ai tentativi di accesso, di iscrizione e di recupero della password.</li>
        <li>
          Ai dati accedono solo le persone autorizzate, ognuna per il suo compito, e le azioni dei moderatori restano nel
          registro.
        </li>
        <li>
          La schermata della verifica la vedono solo tu e i moderatori, e il server chiede ai browser e alle cache di non
          conservarne copie.
        </li>
      </ul>
      <p>
        Se succede una violazione dei dati che mette a rischio i tuoi diritti, il gestore la comunica al Garante entro 72
        ore e, se il rischio è alto, avvisa anche te (artt. 33 e 34 GDPR).
      </p>

      <h2 id="modifiche">13. Se questa informativa cambia</h2>
      <p>
        In cima trovi la data dell&apos;ultimo aggiornamento. Se cambia qualcosa di importante, come un nuovo scopo, un
        nuovo destinatario o un trasferimento fuori dall&apos;Unione europea, lo diciamo con un avviso nel sito prima
        che il cambiamento valga.
      </p>
      <p>
        Se un giorno arriveranno la pubblicità o statistiche non anonime, prima di attivarle comparirà un avviso che ti
        chiede il consenso: senza il tuo sì non partono.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------- english -- */

function PrivacyEn({ providers, linked, moderatorAlert }: DocProps) {
  const oauth = providers.length > 0;
  const held = linked.length > 0;
  const off = linked.filter((id) => !providers.includes(id));
  const discord = providers.includes("discord");
  const google = providers.includes("google");
  const names = providerNames(providers, "or");
  const namesAll = providerNames(linked, "or");
  const namesOff = providerNames(off, "or");

  return (
    <div className={ANCHORS}>
      <PageHeader title="Privacy">{legalDocument("privacy").description.en}</PageHeader>
      <LastUpdated document="privacy" locale="en" />

      <Summary title="In short">
        <ul>
          <li>
            <strong>Who decides about your data.</strong> It is the company that runs Heiki, the “data
            controller”: <OperatorName locale="en" />. For any question, write to <ContactEmail locale="en" />.
          </li>
          <li>
            <strong>Reading asks for no data.</strong> You can use Heiki without an account. No advertising, no visit
            statistics, no services from other companies loaded in the page. Like any website, the server sees your IP
            address (the number that identifies your internet connection) and the page you open.
          </li>
          <li>
            <strong>If you sign up</strong> you give us an email, a password, a handle (the name in your profile&apos;s
            address) and a display name. We store the password only as a fingerprint: a code from which it is very hard
            to work out the password. Everything else is optional.
          </li>
          <li>
            <strong>What everyone sees.</strong> Anyone can see your profile and what you publish, even without an
            account, and search engines can show them. Your profile also shows the game accounts you save: nickname,
            server, Friend Code and class. Your email is never public.
          </li>
          <li>
            <strong>If you verify your class.</strong> Only you and the moderators see the screenshot you upload, and it
            is deleted when they decide, or after {days(RETENTION.pendingScreenshotDays)} if nobody decides. For{" "}
            {months(RETENTION.verificationHistoryMonths)} we keep a fingerprint of the file: the site refuses the same
            image if it is uploaded again from another account or on another day.
          </li>
          <li>
            <strong>No advertising, no selling.</strong> We don&apos;t sell your data, we don&apos;t use it for
            advertising and we don&apos;t build profiles of your tastes.
          </li>
          <li>
            <strong>How long we keep things.</strong> Your account and what you save in it (profile, game accounts,
            votes, tier lists) stay as long as the account exists. Posts, comments, guides and strategies stay even
            after that, under the name “Account eliminato” (Italian for “deleted account”), until you ask for them to be
            removed. Other data has a fixed duration and the site deletes it on its own when it expires, for example
            notifications after {months(RETENTION.notificationsMonths)}. The operator deletes the emails you write to it,
            and the backups. All durations are in <a href="#durate">section 7</a>.
          </li>
          <li>
            <strong>How to delete and whom to write to.</strong> You delete your account from the{" "}
            <Link href="/impostazioni/account">Account settings</Link> page. To get a copy of your data, correct it or
            object to a use, write to <ContactEmail locale="en" />: we answer within {months(PRIVACY_RESPONSE_MONTHS)}.
          </li>
        </ul>
      </Summary>

      <h2 id="titolare">1. Who the controller is</h2>
      <p>
        The data controller is whoever decides why and how your data is used. For Heiki it is the company that runs the
        site: <strong><OperatorName locale="en" /></strong>, with its registered office in{" "}
        <OperatorOffice locale="en" />.
      </p>
      <p>
        For anything about your data, write to <ContactEmail locale="en" />
        {OPERATOR.pec ? (
          <>
            , or to the certified email address (PEC) <a href={`mailto:${OPERATOR.pec}`}>{OPERATOR.pec}</a>
          </>
        ) : null}
        . The email address is the same for everything: privacy, reports and requests from rights holders. The
        company&apos;s other details are in the <DocLink doc="note-legali" locale="en" />.
      </p>
      <p>
        Heiki has no data protection officer (DPO): for a site like this one the law doesn&apos;t require one (Art. 37
        GDPR).
      </p>

      <h2 id="dati">2. What data, why, and on what basis</h2>
      <p>
        For each thing you do on Heiki, the table says which data we use, what it is for and which GDPR rule allows it
        (the “legal basis”, Art. 6 GDPR). There are three bases:
      </p>
      <ul>
        <li>
          <strong>Contract</strong>: the data is needed to give you the service you ask for when you sign up, the one
          described in the <DocLink doc="termini" locale="en" /> (Art. 6(1)(b)).
        </li>
        <li>
          <strong>Legitimate interest</strong>: the data serves a specific purpose of the operator, written in the
          table. The law allows it only if your interests and rights don&apos;t weigh more (point (f)). You can ask us
          how we weighed our interest against your rights, and you can object: see the{" "}
          <a href="#opposizione">box on objecting</a>.
        </li>
        <li>
          <strong>Legal obligation</strong>: a law requires us to do it (point (c)).
        </li>
      </ul>
      <p>
        No processing is based on your consent: today none is needed, because Heiki has no advertising, statistics or
        newsletters.
      </p>

      <TableScroll>
        <table>
          <thead>
            <tr>
              <th>What</th>
              <th>Why</th>
              <th>Legal basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Visiting the site</strong>, even without an account: IP address, requested page, date and time.
                The server sees them and the hosting provider logs them.
              </td>
              <td>Sending you the pages and protecting the site from abuse and attacks.</td>
              <td>Legitimate interest: running the site and keeping it secure.</td>
            </tr>
            <tr>
              <td>
                <strong>Account</strong>: email, password, handle, display name, role, sign-up date.
              </td>
              <td>
                Creating the account, letting you log in and showing who wrote what. The password is stored only as a
                fingerprint (bcrypt).
              </td>
              <td>Contract.</td>
            </tr>
            {held ? (
              <tr>
                <td>
                  <strong>Sign-in with {namesAll}</strong>: the link with your {namesAll} account, and the email, name
                  and profile picture the provider sends us.
                </td>
                <td>Letting you log in without a Heiki password.</td>
                <td>Contract.</td>
              </tr>
            ) : null}
            <tr>
              <td>
                <strong>Profile</strong>: bio, country or region, favorite heroes, customization (accent, frame,
                background, layout).
              </td>
              <td>Showing your public page.</td>
              <td>Contract.</td>
            </tr>
            <tr>
              <td>
                <strong>Content</strong>: posts, comments and replies, votes, guides, Endgame strategies, hero ratings,
                tier lists.
              </td>
              <td>
                Publishing them under your name and counting votes. A moderator checks strategies with text before they
                go live.
              </td>
              <td>Contract.</td>
            </tr>
            <tr>
              <td>
                <strong>Following and notifications</strong>: who you follow and who follows you, the notifications you
                receive.
              </td>
              <td>Telling you about replies, new followers and the results of verifications and reviews.</td>
              <td>Contract.</td>
            </tr>
            <tr>
              <td>
                <strong>Game account and box</strong> (optional): nickname, Friend Code, server, Account Combat Class,
                constellations, hero box.
              </td>
              <td>
                Calculating hero stats with your data, showing nickname, server, Friend Code and class on your profile,
                finding everything again on another device.
              </td>
              <td>Contract: it is a feature you ask for.</td>
            </tr>
            <tr>
              <td>
                <strong>Class verification</strong> (optional): the Hero List screenshot, the declared class, the hero of
                the day and the ones skipped with “I don&apos;t have it”, the result, the moderator who decided, the
                reason for a rejection.
              </td>
              <td>Having a moderator confirm the class you show on your profile.</td>
              <td>Contract.</td>
            </tr>
            <tr>
              <td>
                <strong>Screenshot fingerprint</strong>: a code worked out from the file (SHA-256), from which the image
                can&apos;t be rebuilt.
              </td>
              <td>Automatically refusing a screenshot already used by another account or on another day.</td>
              <td>
                Legitimate interest: preventing the same screenshot from counting for different accounts or for another
                day.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Reports</strong>: who reports, the reported content, the reason and the details.
              </td>
              <td>Having a moderator check the content.</td>
              <td>
                Legal obligation for illegal content (Arts. 16 and 17 DSA). For other rule breaches, legitimate
                interest: enforcing the community rules and protecting other users.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Moderation</strong>: hidden content, strategies rejected with the reason, suspensions with
                reason and duration, a log of every moderator action (who, on what, which action, why).
              </td>
              <td>Enforcing the rules, handling disputes, recognizing people who break the rules again.</td>
              <td>
                Legitimate interest: enforcing the community rules and protecting other users. Legal obligation for
                decisions on illegal content (Art. 17 DSA).
              </td>
            </tr>
            <tr>
              <td>
                <strong>Attempt limits</strong>: a fingerprint of the IP address, of the email you use to log in, sign
                up or recover your password, or of your identifier, with the time of the attempts. Only in the
                server&apos;s memory.
              </td>
              <td>Stopping people who try passwords in bulk, create accounts in series or send spam.</td>
              <td>Legitimate interest: protecting accounts and the site from abuse.</td>
            </tr>
            <tr>
              <td>
                <strong>Password recovery</strong>: the request, linked to your account, with the fingerprint of the
                link and its expiry. The server log, kept by the hosting provider, gets a line with your account&apos;s
                internal identifier (never the email or the link).
              </td>
              <td>Resetting the password. Today the link isn&apos;t sent: the site sends no emails.</td>
              <td>Contract.</td>
            </tr>
            <tr>
              <td>
                <strong>Emails to the operator</strong>: your address, what you write and the data the request needs
                (for a report, the content and the reason; for a rights holder, the right they claim).
              </td>
              <td>Answering, handling the request and keeping track of it in case of disputes.</td>
              <td>
                Legal obligation for requests about your data (Arts. 12-22 GDPR) and for reports of illegal content
                (Art. 16 DSA). For the others, legitimate interest: answering people who write and being able to defend
                ourselves in a dispute.
              </td>
            </tr>
          </tbody>
        </table>
      </TableScroll>

      <p>
        What you search for on the search page (<code>/cerca</code>) ends up in the page address, and so also in the
        hosting logs like any address; the site doesn&apos;t save searches. The quick search filters inside your
        browser a list downloaded from the site. While you type, though, the browser asks the site in advance for the
        pages that appear in the panel: the results, and the search page with the text typed so far in its address. So
        part of what you type reaches the server, and the hosting logs, even if you don&apos;t open anything.
      </p>
      <p>
        The cookies and the data the site saves in your browser are explained one by one in{" "}
        <DocLink doc="cookie" locale="en" />: they are only used to run the site and remember your choices.
      </p>

      {held ? (
        <>
          <h3 id="discord-google">
            {off.length === 0 ? <>If you sign in with {names}</> : <>Sign-in with {namesAll}</>}
          </h3>
          <ul>
            {discord ? (
              <li>
                <strong>Discord.</strong> The button takes you to <code>discord.com</code>, which asks your permission
                to tell us who you are and your email (<code>identify email</code>). With this permission Discord sends
                us your account data: identifier, username and the name you show, profile picture, banner and color,
                language, email and whether it is verified, Nitro subscription type, whether you use two-factor
                authentication, and your account badges. How Discord handles your data:{" "}
                <a href={DISCORD_PRIVACY}>discord.com/privacy</a>.
              </li>
            ) : null}
            {google ? (
              <li>
                <strong>Google.</strong> The button takes you to <code>accounts.google.com</code>, which asks your
                permission to tell us who you are, your name, your profile picture and your email (
                <code>openid profile email</code>). We receive your Google account identifier, your name (usually your
                real first and last name), your email and whether it is verified, the address of your profile picture
                and, when Google adds them, your language and your organization&apos;s domain (for a school or work
                account). How Google handles your data: <a href={GOOGLE_PRIVACY}>policies.google.com/privacy</a>.
              </li>
            ) : null}
            {off.length > 0 ? (
              <li>
                Sign-in with {namesOff} is turned off today. For people who signed in that way in the past, we still
                keep the data listed below, as long as the account exists.
              </li>
            ) : null}
            {oauth ? (
              <>
                <li>
                  The provider knows you are signing in to Heiki and handles your data on its own account, as an
                  independent controller, according to its privacy policy.
                </li>
                <li>You can only sign in if the provider has already verified your email.</li>
              </>
            ) : null}
            <li>
              We only store the link (which provider and your identifier with it), the email, the name and the picture
              address: we don&apos;t store the other data the provider sends us. The name and picture aren&apos;t shown
              anywhere on the site. We don&apos;t store access tokens, the codes used to ask the provider for your data
              later on.
            </li>
            {oauth ? (
              <li>
                The first time you sign in this way, the site creates a neutral handle for you, “giocatore-” followed by
                random characters, and also uses it as your public name: the name you have with the provider
                doesn&apos;t become public. You can change handle and name in the{" "}
                <Link href="/impostazioni/profilo">profile settings</Link>; if your account is suspended, write to the
                operator.
              </li>
            ) : null}
          </ul>
        </>
      ) : null}

      <h2 id="pubblico">3. What is public</h2>
      <p>
        Public means that anyone who opens the page can see it, even without an account, and that search engines like
        Google can show it in their results.
      </p>
      <ul>
        <li>
          <strong>Your profile</strong>, at the address <code>/u/</code> followed by your handle: handle, display name,
          bio, country or region, role on the site, month and year you joined, how many people follow you and how many
          you follow, how many posts you have written, up to {FAVORITES_LIMIT} favorite heroes, the customization
          (accent, frame, background, layout), public tier lists and your latest posts.
        </li>
        <li>
          <strong>The game accounts you save</strong>: nickname, server, Friend Code, the Account Combat Class you
          declare and the verified one, with the date. They always show on your profile: today there is no switch to
          hide them, and no button to remove them once saved (to remove them, write to the operator). What you save
          while logged out stays in your browser, but when you log in and open a game page or the{" "}
          <Link href="/profilo">Your profile</Link> page from that browser, it is copied to your account, and so to
          your profile. This also applies to the class you move with the slider on a hero page, before or after logging
          in.
          If you don&apos;t want them seen, don&apos;t enter them in the browser you log in with, or clear the
          site&apos;s data in your browser before logging in.
        </li>
        <li>
          <strong>What you publish</strong>: posts, comments, guides, Endgame strategies and hero ratings, with your name
          and a link to your profile. The home page shows everyone the most voted posts, with the name, handle and role
          of whoever wrote them. Under every guide there is a public list of edits: who edited it (handle), when, the
          patch and the note.
        </li>
        <li>
          <strong>Tier lists</strong> you save are “Visible on profile” by default: public on your profile and for
          anyone with the link. If you untick it, only you see them.
        </li>
      </ul>
      <p>
        <strong>Not public</strong>: your email, your password, your hero box and constellations, each single vote you
        cast (only the score shows), who you follow and who follows you (only the numbers show, but someone you start
        following gets a notification with your name), reports, and the verification screenshot.
      </p>
      <p>
        Anyone can read and copy what is public, and a search engine can keep showing it for a while even after it has
        been removed. Think before writing your own personal data, and don&apos;t write other people&apos;s: “Someone&apos;s
        personal data” is one of the reasons for reporting content.
      </p>

      <h2 id="obbligatori">4. Required and optional data</h2>
      <ul>
        <li>You don&apos;t need to give any data to read the site.</li>
        <li>
          To sign up you need an email, a password, a handle and a display name. Without them we can&apos;t create the
          account; the site stays readable anyway.
          {oauth ? <> With {names}, your account with the provider is enough, with a verified email.</> : null}
        </li>
        <li>
          We don&apos;t verify your email with a link: the site only checks that it looks right. Use an address of your
          own: it is the one you write to us from for requests about your account (<a href="#diritti">section 9</a>).
        </li>
        <li>
          Everything else is optional: bio, country, favorite heroes, game accounts, box, class verification and, of
          course, what you publish. If you don&apos;t give them, you don&apos;t use that feature; the rest of the site
          works the same.
        </li>
      </ul>

      <h2 id="destinatari">5. Who receives the data</h2>
      <ul>
        <li>
          <strong>Heiki&apos;s staff</strong>: people authorized by the operator, each for their own task. Moderators see
          reports with the name of whoever made them (the reported person doesn&apos;t learn it), verification
          screenshots, strategies under review and suspensions. Editors can edit other people&apos;s guides and see their
          drafts. Administrators also see the list of users with their email, and can search them by email. Every
          moderator action stays in the log.
        </li>
        <li>
          <strong>The hosting provider</strong> (<HostingName locale="en" />): keeps the site and the database on behalf
          of the operator, under a contract that requires it to use the data only for this (Art. 28 GDPR). It also keeps
          the technical server logs.
        </li>
        <li>
          <strong>The operator&apos;s email service</strong> (
          <ToComplete>to be completed: who hosts the operator&apos;s mailbox</ToComplete>): keeps the emails you write to
          the operator on its behalf, under a contract that requires it to use them only for this (Art. 28 GDPR).
        </li>
        <li>
          <strong>Visitors to the site</strong> see what is public (<a href="#pubblico">section 3</a>).
        </li>
        <li>
          <strong>Authorities</strong>, only when the law requires it: for example a court order, or information about a
          crime that threatens someone&apos;s life or safety, which Heiki must report immediately (Art. 18 DSA).
        </li>
        {moderatorAlert ? (
          <li>
            <strong>Moderator alert on Discord.</strong> When a screenshot to verify or an Endgame strategy to review
            arrives, the server sends a message to a moderators&apos; Discord channel. The message contains no personal
            data: it only says there is something to look at, with the link to the site&apos;s queue (for strategies
            also the mode and difficulty). Who sent it and what they declare, moderators read only on the site, after
            logging in.
          </li>
        ) : null}
        {oauth ? (
          <li>
            <strong>{names}</strong>: the provider receives no data from Heiki. You are the one signing in with your
            account there, and it is the provider that sends us the data listed in <a href="#discord-google">section 2</a>
            .
          </li>
        ) : null}
      </ul>
      <p>
        We don&apos;t sell your data and we don&apos;t give it to other companies for their own purposes. The site sends
        no emails: today it uses no service to send them. When it does, for example for password recovery, we will name
        the service here before turning it on.
      </p>

      <h2 id="estero">6. Outside the European Union</h2>
      <p>
        The European Economic Area is the European Union plus Iceland, Liechtenstein and Norway: the GDPR applies there.
        This is where your data goes.
      </p>
      <ul>
        <li>
          <strong>Hosting.</strong>{" "}
          {!HOSTING ? (
            <>
              The data is on the servers of the hosting provider: <Missing field="hosting" locale="en" />.
            </>
          ) : HOSTING.outsideEea ? (
            <>
              The data is on the servers of {HOSTING.name}, in {HOSTING.location.en}, outside the European Economic
              Area. The transfer relies on{" "}
              <ToComplete>to be completed: the transfer safeguard (Art. 45 or 46 GDPR)</ToComplete>.
            </>
          ) : (
            <>
              The data is on the servers of {HOSTING.name}, in {HOSTING.location.en}, inside the European Economic Area.
            </>
          )}
        </li>
        <li>
          <strong>Operator&apos;s email.</strong>{" "}
          <ToComplete>
            to be completed: in which country the emails you write to the operator are kept and, if it is outside the
            European Economic Area, which safeguard the transfer relies on (Art. 45 or 46 GDPR)
          </ToComplete>
          .
        </li>
        {discord ? (
          <li>
            <strong>Discord.</strong> Discord says that for people living in the European Economic Area the controller
            is Discord Netherlands BV.
          </li>
        ) : null}
        {google ? (
          <li>
            <strong>Google.</strong> Google says that for people living in the European Economic Area the controller is
            Google Ireland Limited. Google LLC, the group&apos;s company in the United States, takes part in the EU-US
            Data Privacy Framework, which the European Commission recognizes as adequate protection (Art. 45 GDPR):{" "}
            <a href={GOOGLE_FRAMEWORKS}>policies.google.com/privacy/frameworks</a>.
          </li>
        ) : null}
        {oauth ? (
          <li>
            In any case it is the provider that sends the data to Heiki, not the other way round: Heiki sends no personal
            data to the provider.
          </li>
        ) : null}
        {moderatorAlert ? (
          <li>
            <strong>Moderator alert on Discord.</strong> It contains no personal data.
          </li>
        ) : null}
      </ul>

      <h2 id="durate">7. How long</h2>
      <p>
        For each piece of data, the table says how long it stays. The server applies the durations in months and days
        by itself: once a day it deletes what has expired. The exceptions are emails and backups, which the operator
        deletes by hand, and the hosting logs, which the provider deletes.
      </p>
      <TableScroll>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>How long</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Account and profile{held ? <>, link with {namesAll}</> : null}</td>
              <td>
                As long as the account exists. You delete it from the{" "}
                <Link href="/impostazioni/account">Account settings</Link> page.
                {held ? <> {namesAll} access tokens aren&apos;t stored.</> : null}
              </td>
            </tr>
            <tr>
              <td>Game account, box, class and constellations</td>
              <td>As long as the account exists. In your browser, until you delete them yourself.</td>
            </tr>
            <tr>
              <td>Votes, hero ratings, tier lists, who you follow and who follows you</td>
              <td>As long as the account exists.</td>
            </tr>
            <tr>
              <td>Notifications, read or not</td>
              <td>{months(RETENTION.notificationsMonths)} from the notification, or earlier if you delete your account.</td>
            </tr>
            <tr>
              <td>Posts, comments, guides and Endgame strategies</td>
              <td>
                They don&apos;t expire: they stay even if you delete your account, under “Account eliminato” (
                <a href="#eliminazione">section 8</a>). To remove one, write to the operator.
              </td>
            </tr>
            <tr>
              <td>Previous versions of guides</td>
              <td>{months(RETENTION.guideRevisionsMonths)} from the edit.</td>
            </tr>
            <tr>
              <td>Reports</td>
              <td>
                Closed (resolved or archived): {months(RETENTION.closedReportsMonths)} from the report. Open: until a
                moderator decides. The ones you made also go with your account.
              </td>
            </tr>
            <tr>
              <td>Log of moderator actions</td>
              <td>{months(RETENTION.moderationLogMonths)} from the action.</td>
            </tr>
            <tr>
              <td>Suspensions</td>
              <td>
                Ended (expired or lifted): {months(RETENTION.endedSuspensionsMonths)} from the end. Ongoing: as long as
                they last.
              </td>
            </tr>
            <tr>
              <td>Verification screenshot</td>
              <td>
                Deleted as soon as a moderator decides, if you withdraw the request, if you change Friend Code or server,
                if you delete your account, or after {days(RETENTION.pendingScreenshotDays)} without a decision: the
                request closes and you can make a new one.
              </td>
            </tr>
            <tr>
              <td>
                Verification history: result, hero of the day, skipped heroes, declared class, screenshot fingerprint
              </td>
              <td>
                {months(RETENTION.verificationHistoryMonths)} from the request, or earlier if you delete your account.
              </td>
            </tr>
            <tr>
              <td>Password recovery requests</td>
              <td>{days(RETENTION.passwordResetDays)} from the request.</td>
            </tr>
            <tr>
              <td>Attempt limits</td>
              <td>
                Only in the server&apos;s memory, never on disk or in the database: they count the attempts in a window
                of {duration(SHORTEST_WINDOW)} to {duration(LONGEST_WINDOW)}, depending on the action, and are lost when
                the server restarts.
              </td>
            </tr>
            <tr>
              <td>
                Technical server logs: visits (IP, page, time) and password recovery requests (account identifier)
              </td>
              <td>
                {HOSTING ? (
                  <>{days(HOSTING.logRetentionDays)}. The hosting provider keeps them and deletes them.</>
                ) : (
                  <Missing field="hosting" locale="en" />
                )}
              </td>
            </tr>
            <tr>
              <td>Emails to the operator: requests about data, reports, rights holders</td>
              <td>
                {months(RETENTION.emailRequestsMonths)} from when the request is closed. The operator deletes them by
                hand.
              </td>
            </tr>
            <tr>
              <td>Database backups</td>
              <td>
                The operator makes them by hand and keeps the latest {BACKUP_COPIES}. Deleted data stays in the copies
                made earlier, until they are replaced by new ones.
              </td>
            </tr>
            <tr>
              <td>Cookies and data in your browser</td>
              <td>
                See <DocLink doc="cookie" locale="en" />. Data in your browser stays until you delete it yourself.
              </td>
            </tr>
          </tbody>
        </table>
      </TableScroll>

      <h2 id="eliminazione">8. If you delete your account</h2>
      <p>
        You delete it yourself from the <Link href="/impostazioni/account">Account settings</Link> page: type{" "}
        <code>{DELETE_PHRASES.en}</code> (or <code>{DELETE_PHRASES.it}</code>) and confirm with your password.
        {oauth ? (
          <>
            {" "}
            If you only signed in with {names} and have no password, log out and sign in again with {names}: from then
            on you have 10 minutes to delete the account.
          </>
        ) : null}
        {off.length > 0 ? (
          <>
            {" "}
            If you only signed in with {namesOff} and that sign-in is now turned off, write to the operator to delete
            your account.
          </>
        ) : null}{" "}
        Moderators and administrators must first have their role removed by an administrator.
      </p>
      <h3>What is deleted right away</h3>
      <p>
        Your profile, {held ? <>the link with {namesAll}, </> : null}your game accounts with their verifications and
        screenshots, your box, votes, hero ratings, tier lists, the reports you made, who you follow and who follows
        you, notifications, password recovery requests and the suspensions you received. In the moderation log, the
        line of each action concerning you stays, until its {months(RETENTION.moderationLogMonths)} are up.
      </p>
      <h3>What stays</h3>
      <ul>
        <li>
          <strong>Posts, comments, guides with their versions, and Endgame strategies.</strong> They move to a
          placeholder user named “Account eliminato” (Italian for “deleted account”) with a handle “eliminato-” followed
          by part of an internal code, which contains neither your name nor your handle. The text stays as it was, and
          the placeholder&apos;s page shows the latest posts. They stay because deleting them would break other
          people&apos;s discussions. If you want these removed too, write to the operator saying which ones (the page
          address is enough): the operator removes them by hand.
        </li>
        <li>
          <strong>The copies in your browser</strong> (game account, box, drafts): until you delete them, as explained
          in <DocLink doc="cookie" locale="en" />.
        </li>
        <li>
          <strong>Database backups</strong>: until they are replaced (<a href="#durate">section 7</a>).
        </li>
      </ul>
      <p>
        If you were logged in on other devices, the login stops working there. There is no button to download all your
        data: if you want it, ask for it by email before deleting your account. You can already download your tier lists
        yourself, as a JSON file or a PNG image.
      </p>

      <h2 id="diritti">9. Your rights and complaints</h2>
      <p>
        The GDPR gives you these rights (Arts. 15-22 GDPR). What you can do yourself is written next to each right; for
        everything else, write to <ContactEmail locale="en" />.
      </p>
      <ul>
        <li>
          <strong>Access</strong>: knowing what data we have about you and getting a copy.
        </li>
        <li>
          <strong>Rectification</strong>: correcting wrong data. You correct your profile and game accounts yourself,
          and your email from the <Link href="/impostazioni/account">Account settings</Link> page. If your account is
          suspended, profile and game accounts can&apos;t be edited: write to the operator, who corrects them.
          {held ? (
            <> If you only signed in with {namesAll} you have no password, and to change your email you write to the operator.</>
          ) : null}
        </li>
        <li>
          <strong>Erasure</strong>: deleting your account (<a href="#eliminazione">section 8</a>) or having a single
          piece of data removed, for example a post.
        </li>
        <li>
          <strong>Restriction</strong>: asking that a piece of data stays but isn&apos;t used, for example while we check
          a complaint of yours.
        </li>
        <li>
          <strong>Portability</strong>: receiving the data you gave us in a format a computer can read (for example
          JSON), to take it elsewhere. Today you ask for it by email.
        </li>
        <li>
          <strong>Objection</strong>: see the box below.
        </li>
      </ul>
      <p>
        We answer within {months(PRIVACY_RESPONSE_MONTHS)}, free of charge. If the request is complicated, the deadline
        is extended by at most two more months: in that case we tell you within the first month, with the reason (Art.
        12 GDPR). Write from your account&apos;s email address: it is the simplest way for us to recognize you. On its
        own, though, it doesn&apos;t prove the account is yours, because the site doesn&apos;t verify emails with a link
        (<a href="#obbligatori">section 4</a>): we also ask you to confirm the request on the site, while logged in, for
        example with a small change to your profile that we specify. If you can&apos;t, we only ask for what we need to
        know it&apos;s you.
      </p>

      <ObjectionBox title="Your right to object">
        <p>
          You can object at any time, on grounds relating to your situation, to processing based on legitimate interest
          (Art. 21 GDPR). On Heiki that is:
        </p>
        <ul>
          <li>technical server logs and attempt limits, for security;</li>
          <li>the verification screenshot fingerprint;</li>
          <li>moderation of rule breaches: reports, hidden content, suspensions and their log;</li>
          <li>emails you write to the operator, when there is no legal obligation.</li>
        </ul>
        <p>
          Write to <ContactEmail locale="en" /> and explain why. The operator stops, unless it has legitimate grounds
          stronger than your interests, rights and freedoms, or the data is needed to defend a legal claim. If it
          continues, it writes to you explaining why.
        </p>
      </ObjectionBox>

      <h3>Complaints</h3>
      <p>
        If you think we handle your data wrongly, you can lodge a complaint with the Italian Data Protection Authority
        (Garante per la protezione dei dati personali), Piazza Venezia 11, 00187 Rome (
        <a href={GARANTE}>garanteprivacy.it</a>). The <a href={GARANTE_RECLAMO}>complaint page</a> explains how. If you
        live or work in another European Union country, you can also turn to that country&apos;s authority (Art. 77
        GDPR). You can also go to court (Art. 79 GDPR).
      </p>

      <h2 id="minori">10. Minors</h2>
      <p>
        To have an account you must be at least {MIN_AGE} years old: it is the age from which, in Italy, you can decide
        on your own about your data in online services (Art. 2-quinquies of the Italian Privacy Code). You declare it
        when you sign up; we don&apos;t ask for your date of birth or for documents. Under {MIN_AGE} you can read the
        site, but not sign up.
      </p>
      <p>
        If we learn that an account belongs to someone under {MIN_AGE}, the operator closes it and deletes its data. If
        you are a parent and think this is your child&apos;s case, write to <ContactEmail locale="en" />.
      </p>

      <h2 id="automatiche">11. Automated decisions</h2>
      <p>
        No decision about you is made by a program alone (Art. 22 GDPR), and we don&apos;t do profiling. People decide
        about content and accounts: the moderators and the operator.
      </p>
      <p>The site only runs simple automatic checks, which stop a single action and decide nothing about you:</p>
      <ul>
        <li>
          a limit on the number of actions in a time from {duration(SHORTEST_WINDOW)} to {duration(LONGEST_WINDOW)},
          depending on the action, against spam;
        </li>
        <li>
          the class verification rules: you can change the hero of the day at most {MAX_REROLLS} times, and after an
          approved verification you wait {days(VERIFICATION_COOLDOWN_DAYS)} before requesting another one;
        </li>
        <li>
          the comparison of the screenshot fingerprint, which refuses an image already used by another account or on
          another day (you can upload a new one);
        </li>
        <li>format checks, such as text length, invisible characters and reserved names (for example “admin”).</li>
      </ul>

      <h2 id="sicurezza">12. Security</h2>
      <ul>
        <li>The password is stored only as a bcrypt fingerprint, never in plain text.</li>
        <li>The session is kept in an encrypted cookie.</li>
        <li>
          On the published site the server tells the browser to always use the protected connection (https): after the
          first visit over https, the browser no longer opens the site without protection (HSTS).
        </li>
        <li>A rule sent to the browser (Content-Security-Policy) blocks scripts and resources from other sites.</li>
        <li>There are limits on login, sign-up and password recovery attempts.</li>
        <li>
          Only authorized people access the data, each for their own task, and moderator actions stay in the log.
        </li>
        <li>
          Only you and the moderators see the verification screenshot, and the server asks browsers and caches not to
          keep copies of it.
        </li>
      </ul>
      <p>
        If a data breach happens that puts your rights at risk, the operator reports it to the Garante within 72 hours
        and, if the risk is high, tells you too (Arts. 33 and 34 GDPR).
      </p>

      <h2 id="modifiche">13. If this policy changes</h2>
      <p>
        At the top you will find the date of the last update. If something important changes, such as a new purpose, a
        new recipient or a transfer outside the European Union, we say so with a notice on the site before the change
        applies.
      </p>
      <p>
        If advertising or non-anonymous statistics ever arrive, before turning them on a notice will appear asking for
        your consent: without your yes they don&apos;t start.
      </p>
    </div>
  );
}
