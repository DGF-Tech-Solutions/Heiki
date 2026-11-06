import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ContactEmail, LastUpdated, Summary, TableScroll } from "@/components/legal/legal-parts";
import { PageHeader } from "@/components/ui";
import { enabledOauthProviders, SESSION_ABSOLUTE_MAX_DAYS, SESSION_DAYS } from "@/lib/auth/config";
import { CONSENT_KEY } from "@/lib/consent";
import { listGames } from "@/lib/games/catalog";
import { GUESS_VARIANTS, VARIANT_LABELS } from "@/lib/games/hero-guess";
import { intlLocale, LOCALE_COOKIE, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { legalDocument } from "@/lib/legal/documents";
import { siteUrl } from "@/lib/site";
import { THEME_COOKIE } from "@/lib/theme/themes";

/**
 * Cookie e dati nel browser, uno per uno (riscritta il 25/10).
 *
 * La pagina dice quello che il codice fa oggi: sei cookie tecnici, nessuno di
 * altri siti, e le chiavi del localStorage con il momento in cui si tolgono.
 * Il banner e il pannello delle preferenze non ci sono: CONSENT_REQUIRED e'
 * false (src/lib/consent.ts). Se diventa true, questa pagina va riscritta con
 * i cookie nuovi e il pannello CookiePreferences, prima che si installi niente.
 *
 * I fatti che dipendono dall'ambiente si leggono a ogni richiesta, cosi' la
 * pagina non puo' dire una cosa e il sito farne un'altra:
 * - i nomi dei cookie di Auth.js: in https prendono __Secure- (e __Host- quello
 *   contro le richieste false), su http no. Auth.js lo decide dall'indirizzo
 *   delle sue richieste (node_modules/@auth/core/lib/init.js, defaultCookies in
 *   lib/utils/cookie.js); siteUrl() e' lo stesso indirizzo
 * - il cookie pkce e i rimandi a Discord e Google solo se quei fornitori sono
 *   accesi (enabledOauthProviders)
 * - le durate della sessione da SESSION_DAYS e SESSION_ABSOLUTE_MAX_DAYS
 *
 * Il tetto dei 60 giorni e l'impronta della password li controlla solo il
 * callback jwt di src/lib/auth/index.ts; il middleware (Edge, config.ts senza
 * quel callback) rinnova il cookie a ogni pagina anche quando il sito lo
 * rifiuta. Per questo la pagina non dice «al massimo 60 giorni» del cookie, ma
 * che dopo non ti tiene piu' collegato e resta finche' non passano 14 giorni
 * senza pagine. Il nome nel cookie e' users.name all'ultimo accesso: il nome
 * visualizzato (lo riscrive il salvataggio del profilo) o, per chi e' nato con
 * Discord o Google e non l'ha ancora salvato, il nome che aveva li'.
 *
 * Numeri scritti a mano perche' non hanno una costante esportata: i 15 minuti
 * del pkce e i circa 4 KB oltre i quali la sessione si divide (Auth.js), l'anno
 * di lingua e tema (maxAge in src/lib/i18n/actions.ts e src/lib/theme/actions.ts),
 * gli 8 eroi recenti (src/components/quick-search.tsx).
 */

interface AuthCookieNames {
  session: string;
  csrf: string;
  callback: string;
  pkce: string;
}

interface Facts {
  /** i nomi dei cookie di Auth.js come li vede il browser di chi legge */
  cookies: AuthCookieNames;
  /** i fornitori di accesso accesi: Discord, Google, o nessuno */
  providers: readonly { id: string; label: string }[];
  /** l'indirizzo del sito senza https://, da cercare nelle impostazioni del browser */
  host: string;
  /** i giochi con pagine: spiegano `<gioco>` nelle chiavi del browser */
  games: readonly { slug: string; name: string }[];
}

function authCookieNames(https: boolean): AuthCookieNames {
  const prefix = https ? "__Secure-" : "";
  return {
    session: `${prefix}authjs.session-token`,
    csrf: `${https ? "__Host-" : ""}authjs.csrf-token`,
    callback: `${prefix}authjs.callback-url`,
    pkce: `${prefix}authjs.pkce.code_verifier`,
  };
}

function readFacts(): Facts {
  const url = siteUrl();
  return {
    cookies: authCookieNames(url.startsWith("https://")),
    providers: enabledOauthProviders(),
    host: url.replace(/^https?:\/\//, ""),
    games: listGames().filter((game) => game.available),
  };
}

/** Le informative dei fornitori di accesso, gli stessi indirizzi della privacy. */
const PROVIDER_PRIVACY: Readonly<Record<string, string>> = {
  discord: "https://discord.com/privacy",
  google: "https://policies.google.com/privacy",
};

function providerPolicies(providers: Facts["providers"]): { id: string; label: string; href: string }[] {
  return providers.flatMap((provider) => {
    const href = PROVIDER_PRIVACY[provider.id];
    return href ? [{ ...provider, href }] : [];
  });
}

/** Le modalita' di «Indovina l'eroe» con una chiave propria: la classica tiene quella di prima. */
const OTHER_VARIANTS = GUESS_VARIANTS.filter((variant) => variant !== "classico");

/** Un elenco nella lingua giusta: «a, b e c», «a o b», «a, b, and c». */
function Elenco({
  items,
  locale,
  tipo = "conjunction",
}: {
  items: readonly ReactNode[];
  locale: Locale;
  tipo?: "conjunction" | "disjunction";
}) {
  const parti = new Intl.ListFormat(intlLocale(locale), { type: tipo }).formatToParts(items.map((_, i) => String(i)));
  return (
    <>
      {parti.map((parte, i) => (
        <Fragment key={i}>{parte.type === "element" ? items[Number(parte.value)] : parte.value}</Fragment>
      ))}
    </>
  );
}

/** Un blocco JSX intero per lingua: le due versioni dicono le stesse cose nello stesso ordine. */
const TESTI = testi({
  it: { Documento: CookieIt },
  en: { Documento: CookieEn },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const doc = legalDocument("cookie");
  return { title: doc.title[locale], description: doc.description[locale] };
}

export default async function CookiePage() {
  const { Documento } = TESTI[await getLocale()];
  return <Documento {...readFacts()} />;
}

function CookieIt({ cookies, providers, host, games }: Facts) {
  const doc = legalDocument("cookie");
  const privacy = legalDocument("privacy");
  const oauth = providers.length > 0;
  const fornitori = <Elenco items={providers.map((provider) => provider.label)} locale="it" tipo="disjunction" />;
  const informative = providerPolicies(providers);

  return (
    <>
      <PageHeader title={doc.label.it}>{doc.description.it}</PageHeader>
      <LastUpdated document="cookie" locale="it" />

      <Summary title="In breve">
        <ul>
          <li>
            Heiki usa solo cookie tecnici, tutti suoi: servono a tenerti collegato al tuo account, a
            proteggere l&apos;accesso e a ricordare la lingua e i colori che scegli. Nessuno serve a
            pubblicità, a statistiche o a seguire quello che fai per capire i tuoi gusti.
          </li>
          <li>Per questi cookie la legge non chiede il consenso: per questo non vedi un avviso sui cookie.</li>
          <li>Nessun altro sito mette cookie mentre leggi Heiki: le pagine non caricano niente da altri siti.</li>
          <li>
            Il sito salva anche dei dati nel tuo browser, come l&apos;account di gioco, il box e le bozze.
            Non scadono: restano finché non li cancelli tu o li toglie il sito nei casi della{" "}
            <a href="#browser">sezione 2</a>. Se hai un account Heiki, account di gioco, classe,
            costellazioni e box si copiano anche nell&apos;account.
          </li>
          <li>
            Su un computer che usano anche altre persone, «Esci» non toglie questi dati dal browser: chi
            viene dopo di te li può vedere.
          </li>
          <li>
            Puoi cancellare cookie e dati dalle impostazioni del browser: la <a href="#cancellare">sezione 4</a>{" "}
            spiega come.
          </li>
          <li>Se un giorno servirà il tuo consenso, te lo chiederemo con un avviso prima di installare qualsiasi cosa.</li>
          <li>
            Per domande scrivi a <ContactEmail locale="it" />. L&apos;
            <Link href={privacy.href}>{privacy.title.it}</Link> spiega chi è responsabile dei tuoi dati (il
            «titolare del trattamento») e quali sono i tuoi diritti.
          </li>
        </ul>
      </Summary>

      <h2 id="cookie" className="scroll-mt-24">
        1. I cookie
      </h2>
      <p>
        Un cookie è un piccolo file di testo che un sito lascia nel tuo browser. Il browser lo rimanda al
        sito a ogni pagina che apri: così il sito si ricorda, per esempio, che sei entrato nel tuo account.
      </p>
      <p>
        Heiki usa solo i cookie di questa tabella. Li crea tutti il server di Heiki: sono cookie «di prima
        parte», cioè del sito che stai visitando. Le pagine non ne creano altri.
      </p>
      <TableScroll>
        <table className="min-w-[560px]">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quando si crea</th>
              <th>A cosa serve</th>
              <th>Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>{cookies.session}</code>
              </td>
              <td>Quando entri nel tuo account, anche appena iscritto; poi si rinnova a ogni pagina che apri</td>
              <td>Tenerti collegato al tuo account</td>
              <td>
                {SESSION_DAYS} giorni dall&apos;ultima pagina aperta. Dopo {SESSION_ABSOLUTE_MAX_DAYS} giorni
                dall&apos;ultimo accesso non ti tiene più collegato (vedi sotto la tabella)
              </td>
            </tr>
            <tr>
              <td>
                <code>{cookies.csrf}</code>
              </td>
              <td>Alla prima pagina che apri, anche senza account</td>
              <td>
                Impedire che un altro sito mandi a tuo nome una richiesta di accesso o di uscita. Contiene un
                codice casuale
              </td>
              <td>Finché chiudi il browser</td>
            </tr>
            <tr>
              <td>
                <code>{cookies.callback}</code>
              </td>
              <td>Alla prima pagina che apri, e quando entri</td>
              <td>
                Ricordare a quale pagina tornare dopo l&apos;accesso o l&apos;uscita. Contiene un indirizzo di
                Heiki
              </td>
              <td>Finché chiudi il browser</td>
            </tr>
            {oauth ? (
              <tr>
                <td>
                  <code>{cookies.pkce}</code>
                </td>
                <td>Quando scegli di entrare con {fornitori}</td>
                <td>
                  Completare l&apos;accesso in sicurezza: lega la partenza verso {fornitori} al ritorno su Heiki.
                  Contiene un codice casuale
                </td>
                <td>
                  15 minuti al massimo. Se accetti su {fornitori}, si cancella quando torni su Heiki; se
                  annulli, scade da solo
                </td>
              </tr>
            ) : null}
            <tr>
              <td>
                <code>{LOCALE_COOKIE}</code>
              </td>
              <td>Quando premi IT o EN</td>
              <td>Ricordare la lingua che hai scelto. Contiene «it» o «en»</td>
              <td>1 anno dall&apos;ultima scelta</td>
            </tr>
            <tr>
              <td>
                <code>{THEME_COOKIE}</code>
              </td>
              <td>Quando scegli i colori del sito (il tema)</td>
              <td>Ricordare i colori che hai scelto. Contiene il nome del tema</td>
              <td>1 anno dall&apos;ultima scelta</td>
            </tr>
            <tr>
              <td>
                <code>menu-chiuse</code>
              </td>
              <td>Quando apri o chiudi una sezione del menu</td>
              <td>Ricordare quali sezioni hai chiuso. Contiene i loro indirizzi</td>
              <td>1 anno dall&apos;ultima scelta</td>
            </tr>
          </tbody>
        </table>
      </TableScroll>
      <p>
        Sono tutti cookie tecnici: servono a far funzionare il sito o a ricordare una scelta che hai fatto
        tu, come la lingua e il tema. Per questi cookie la legge non chiede il consenso (art. 122 del Codice
        privacy, D.Lgs. 196/2003, e linee guida sui cookie del Garante per la protezione dei dati personali
        del 10 giugno 2021): per questo il sito non mostra un avviso sui cookie.
      </p>

      <h3>Il cookie di accesso</h3>
      <p>Contiene, cifrati con una chiave che ha solo il server:</p>
      <ul>
        <li>
          il tuo identificativo interno, email, handle, ruolo e nome visualizzato, come erano quando sei
          entrato: se poi cambiano, nel cookie restano quelli di prima fino al prossimo accesso;
        </li>
        {oauth ? (
          <li>
            se il tuo account è nato con {fornitori}, l&apos;indirizzo dell&apos;immagine del profilo che
            avevi lì e, finché non salvi il tuo profilo su Heiki, il nome che avevi lì al posto del nome
            visualizzato;
          </li>
        ) : null}
        <li>l&apos;ora in cui sei entrato e le date che servono a farlo scadere;</li>
        <li>un controllo che cambia quando cambi la password (non la password).</li>
      </ul>
      <p>
        Se diventa più grande di circa 4 KB, il server lo divide in più cookie con lo stesso nome e{" "}
        <code>.0</code>, <code>.1</code> e così via alla fine.
      </p>
      <p>Smette di valere, e devi entrare di nuovo:</p>
      <ul>
        <li>quando premi «Esci»: lo cancella da quel browser;</li>
        <li>dopo {SESSION_DAYS} giorni senza aprire una pagina di Heiki;</li>
        <li>
          {SESSION_ABSOLUTE_MAX_DAYS} giorni dopo l&apos;ultimo accesso{" "}
          <Elenco
            items={["con la password", ...providers.map((provider) => `con ${provider.label}`)]}
            locale="it"
            tipo="disjunction"
          />
          , anche se nel frattempo usi il sito tutti i giorni;
        </li>
        <li>quando cambi la password: sugli altri dispositivi esci, in quello dove l&apos;hai cambiata resti dentro;</li>
        <li>quando elimini l&apos;account.</li>
      </ul>
      <p>
        Dopo i {SESSION_ABSOLUTE_MAX_DAYS} giorni, e sugli altri dispositivi dopo un cambio di password o
        l&apos;eliminazione dell&apos;account, il cookie resta nel browser ma non ti fa più entrare: se ne va
        dopo {SESSION_DAYS} giorni senza pagine aperte, quando entri di nuovo o quando cancelli i cookie.
      </p>

      <h2 id="browser" className="scroll-mt-24">
        2. Dati salvati nel browser
      </h2>
      <p>
        Oltre ai cookie, il sito salva dei dati nell&apos;archiviazione locale del browser (
        <code>localStorage</code>): uno spazio del browser dove le pagine di un sito tengono delle
        informazioni. A differenza dei cookie, il browser non li manda al server a ogni pagina: li leggono
        le pagine di Heiki, sul tuo dispositivo.
      </p>
      <p>
        Non hanno una scadenza: restano finché non li cancelli (<a href="#cancellare">sezione 4</a>) o finché
        il sito non li toglie nei casi scritti nella tabella. Se hai un account Heiki, account di gioco,
        classe, costellazioni e box si copiano anche nell&apos;account poco dopo ogni modifica, e da lì
        tornano nel browser degli altri dispositivi quando entri e apri una pagina del gioco o di «Il tuo
        profilo». Come li trattiamo lo spiega l&apos;
        <Link href={privacy.href}>{privacy.title.it}</Link>.
      </p>
      <p>
        Ogni dato ha un nome, la «chiave». Nelle chiavi <code>{"<gioco>"}</code> è il gioco come compare
        negli indirizzi del sito
        {games.length > 0 ? (
          <>
            {" "}
            (
            <Elenco
              items={games.map((game) => (
                <Fragment key={game.slug}>
                  <code>{game.slug}</code> per {game.name}
                </Fragment>
              ))}
              locale="it"
            />
            )
          </>
        ) : null}
        , <code>{"<eroe>"}</code> è il codice di un eroe, <code>{"<data>"}</code> è il giorno (AAAA-MM-GG)
        e <code>{"<modalità>"}</code> è una modalità di «Indovina l&apos;eroe» (
        <Elenco items={OTHER_VARIANTS.map((variant) => <code key={variant}>{variant}</code>)} locale="it" tipo="disjunction" />
        ).
      </p>
      <TableScroll>
        <table className="min-w-[560px]">
          <thead>
            <tr>
              <th>Chiave</th>
              <th>Cosa contiene e a cosa serve</th>
              <th>Quando si toglie</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>{"heiki:<gioco>:account"}</code>
              </td>
              <td>
                Nickname, Codice amico e server del tuo account di gioco, per ritrovarli in «Il tuo profilo»,
                anche senza un account Heiki
              </td>
              <td>
                Quando in questo browser un account Heiki diverso da quello dell&apos;ultima volta apre una
                pagina del gioco o di «Il tuo profilo» (vedi la <a href="#cancellare">sezione 4</a>), o quando
                cancelli i dati del sito. Non quando esci
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:account-stamp"}</code>
              </td>
              <td>
                L&apos;ora dell&apos;ultima modifica, per capire quale copia è più recente fra il browser e il tuo
                account
              </td>
              <td>Come la riga sopra</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:account-owner"}</code>
              </td>
              <td>
                L&apos;identificativo interno (un codice, non il nome) dell&apos;ultimo account Heiki che ha
                aperto in questo browser una pagina del gioco o di «Il tuo profilo»: serve ad accorgersi se
                arriva un account diverso
              </td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:buff-account"}</code>
              </td>
              <td>
                La classe dell&apos;account e le costellazioni, per calcolare i buff dell&apos;account e le
                statistiche in battaglia nelle schede degli eroi
              </td>
              <td>
                Come <code>{"heiki:<gioco>:account"}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:box"}</code>
              </td>
              <td>
                Il tuo box: quali eroi hai e a che punto sono, per la pagina «I tuoi eroi», per i filtri che
                mostrano solo i tuoi eroi e per partire dai tuoi numeri nel calcolatore
              </td>
              <td>
                Come <code>{"heiki:<gioco>:account"}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:calcolatore:<eroe>"}</code>
              </td>
              <td>
                Le scelte che hai fatto nel calcolatore delle statistiche di quell&apos;eroe, per ritrovarle
                quando torni sulla sua scheda
              </td>
              <td>
                Quando riporti il calcolatore alla configurazione di partenza (tutto al massimo, o i numeri del
                tuo box), o quando cancelli i dati del sito
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:squadra"}</code>
              </td>
              <td>L&apos;ultima squadra che hai composto nella pagina Squadra, per ritrovarla quando ci torni</td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>{"gz_tierlist_<gioco>"}</code>
              </td>
              <td>La bozza della tier list che stai preparando, per non perderla se chiudi la pagina</td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:strategia-bozza"}</code>
              </td>
              <td>
                La bozza di una nuova strategia per l&apos;Endgame, compreso il testo che hai scritto, per non
                perderla se chiudi la pagina
              </td>
              <td>Quando la invii o svuoti il modulo (se l&apos;invio non riesce, la bozza torna)</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:indovina:<data>"}</code> e{" "}
                <code>{"heiki:<gioco>:indovina-<modalità>:<data>"}</code>
              </td>
              <td>
                Gli eroi che hai già provato nella partita del giorno di «Indovina l&apos;eroe», per riprendere
                la partita se torni: una chiave per ogni giorno e modalità che giochi
              </td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>heiki:indovina:mosaico</code>
              </td>
              <td>Se il mosaico di «Indovina l&apos;eroe» è acceso o spento, per ricordare la tua scelta</td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<gioco>:recenti"}</code>
              </td>
              <td>Gli ultimi 8 eroi che hai aperto, per «Aperti di recente» nella ricerca</td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>heiki:profile-draft</code>
              </td>
              <td>
                La bozza del profilo d&apos;esempio, se premi Salva nella pagina di prova{" "}
                <code>/anteprima/profilo</code>: lì non c&apos;è un account, e il salvataggio finisce qui. Il
                sito non la rilegge
              </td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
            <tr>
              <td>
                <code>{CONSENT_KEY}</code>
              </td>
              <td>
                La risposta che hai dato al vecchio avviso sui cookie, se l&apos;hai data prima del 25 ottobre
                2026. Oggi non serve a niente
              </td>
              <td>Quando cancelli i dati del sito</td>
            </tr>
          </tbody>
        </table>
      </TableScroll>
      <p>
        Se il browser non permette di salvare questi dati, non restano: le pagine li tengono al massimo finché
        sono aperte.
      </p>
      <p>
        Le chiavi che cominciavano con <code>gachazone:</code> (il nome di prima del sito) passano a{" "}
        <code>heiki:</code> alla prima visita, e quelle vecchie si cancellano.
      </p>
      <p>
        Il sito non usa altri modi di salvare dati nel browser: niente <code>sessionStorage</code>,{" "}
        <code>IndexedDB</code>, Cache API o service worker.
      </p>
      <p>
        Come i cookie tecnici, anche questi dati non chiedono il consenso: li salva una funzione che usi tu, e
        non servono a seguirti né a fare pubblicità.
      </p>

      <h2 id="altri-siti" className="scroll-mt-24">
        3. Niente cookie di altri siti
      </h2>
      <p>
        Mentre leggi Heiki, nessun altro sito mette cookie nel tuo browser. Le pagine non caricano niente da
        altri siti: niente pubblicità, statistiche di visita, pulsanti dei social, video, mappe o caratteri
        presi da altri server. Caratteri e immagini arrivano da Heiki stesso, e una regola di sicurezza che il
        sito manda al browser (la <code>Content-Security-Policy</code>) gli fa bloccare script, immagini e
        caratteri di altri siti.
      </p>
      {oauth ? (
        <p>
          Se entri con {fornitori}, per il tempo dell&apos;accesso sei sul sito che hai scelto: lì valgono i
          cookie e le regole di quel sito
          {informative.length > 0 ? (
            <>
              {" "}
              (
              <Elenco
                items={informative.map((provider) => (
                  <a key={provider.id} href={provider.href}>
                    informativa di {provider.label}
                  </a>
                ))}
                locale="it"
              />
              )
            </>
          ) : null}
          .
        </p>
      ) : null}
      <p>Quando apri un collegamento verso un altro sito, lì valgono i cookie e le regole di quel sito.</p>

      <h2 id="cancellare" className="scroll-mt-24">
        4. Come cancellarli
      </h2>
      <p>
        Puoi cancellare i cookie e i dati di Heiki quando vuoi, dalle impostazioni del browser. I nomi delle
        voci cambiano da un browser all&apos;altro, ma la strada è questa:
      </p>
      <ol>
        <li>apri le impostazioni del browser e cerca la parte sulla privacy, o la voce «cookie e dati dei siti»;</li>
        <li>
          cerca nell&apos;elenco l&apos;indirizzo di Heiki, <code>{host}</code>;
        </li>
        <li>
          scegli di cancellarne i dati: vanno via insieme i cookie (sezione 1) e i dati salvati nel browser
          (sezione 2).
        </li>
      </ol>
      <p>
        Sul computer, Chrome, Edge e Firefox hanno anche una scorciatoia: mentre sei su Heiki, premi il
        simbolo a sinistra dell&apos;indirizzo e cerca i cookie e i dati del sito.
      </p>
      <p>Cosa succede dopo:</p>
      <ul>
        <li>
          senza i cookie esci dal tuo account in quel browser, e il sito torna in italiano e con i colori di
          partenza;
        </li>
        <li>
          senza i dati del sito, dal browser spariscono account di gioco, box, bozze e partite di «Indovina
          l&apos;eroe». Se hai un account Heiki, account di gioco, classe, costellazioni e box restano
          nell&apos;account, e tornano nel browser quando rientri e apri una pagina del gioco o di «Il tuo
          profilo».
        </li>
      </ul>
      <p>In una finestra privata (o anonima) il browser cancella da solo cookie e dati del sito quando la chiudi.</p>
      <p>
        Puoi anche bloccare i cookie e i dati di Heiki dalle impostazioni del browser. Con i cookie bloccati il
        sito si legge lo stesso, ma non puoi restare collegato al tuo account né cambiare la lingua, e il tema
        che scegli si perde quando ricarichi la pagina. Con i dati del sito bloccati le pagine funzionano, ma
        dimenticano account di gioco, box e bozze quando le chiudi.
      </p>
      <h3>Su un computer che usano anche altre persone</h3>
      <p>
        «Esci» chiude il tuo accesso, ma i dati della sezione 2 restano nel browser, e chi lo usa dopo di te
        li può vedere: account di gioco, classe, costellazioni, box, bozze (anche il testo di una strategia),
        squadra, calcolatore, eroi aperti di recente e partite di «Indovina l&apos;eroe».
      </p>
      <p>
        Il sito segna nel browser l&apos;ultimo account Heiki che ha aperto una pagina del gioco o di «Il tuo
        profilo» (la chiave <code>{"heiki:<gioco>:account-owner"}</code>). Quando lo fa un account diverso, il
        sito toglie account di gioco, classe, costellazioni e box. Il resto non lo toglie mai.
      </p>
      <p>
        Se invece l&apos;account è lo stesso dell&apos;ultima volta, o nel browser non è ancora segnato
        nessun account, vince la copia più recente. Se i dati del browser sono più recenti della copia
        nell&apos;account, o l&apos;account non ne ha una, passano nell&apos;account, anche se li ha scritti
        qualcun altro senza entrare: nickname, server, Codice amico e classe compaiono allora sul suo profilo
        pubblico. Se sono più vecchi, la copia dell&apos;account prende il loro posto.
      </p>
      <p>
        Per togliere tutto subito cancella i dati del sito come spiegato sopra, oppure usa una finestra
        privata.
      </p>

      <h2 id="consenso" className="scroll-mt-24">
        5. Se un giorno servirà il tuo consenso
      </h2>
      <p>
        Oggi niente su Heiki chiede il tuo consenso. Se un giorno arriveranno pubblicità o statistiche di
        visita che non siano anonime, prima di attivarle:
      </p>
      <ul>
        <li>
          aggiorneremo questa pagina con i cookie nuovi, chi li mette, a cosa servono e quanto durano, e
          cambierà la data in cima;
        </li>
        <li>comparirà un avviso che ti chiede se accetti, e rifiutare sarà facile come accettare;</li>
        <li>
          quei cookie si installeranno solo dopo che avrai accettato, e potrai cambiare idea quando vuoi da
          questa pagina.
        </li>
      </ul>
      <p>È quello che chiede la legge per i cookie che non sono tecnici (art. 122 del Codice privacy).</p>
    </>
  );
}

function CookieEn({ cookies, providers, host, games }: Facts) {
  const doc = legalDocument("cookie");
  const privacy = legalDocument("privacy");
  const oauth = providers.length > 0;
  const fornitori = <Elenco items={providers.map((provider) => provider.label)} locale="en" tipo="disjunction" />;
  const informative = providerPolicies(providers);

  return (
    <>
      <PageHeader title={doc.label.en}>{doc.description.en}</PageHeader>
      <LastUpdated document="cookie" locale="en" />

      <Summary title="In short">
        <ul>
          <li>
            Heiki only uses technical cookies, all of them its own: they keep you logged in to your account,
            protect logging in, and remember the language and colors you pick. None is used for advertising,
            for statistics or for following what you do to work out what you like.
          </li>
          <li>The law does not require consent for these cookies: that is why you see no cookie notice.</li>
          <li>No other site sets cookies while you read Heiki: the pages load nothing from other sites.</li>
          <li>
            The site also saves data in your browser, such as your game account, your box and your drafts. It
            does not expire: it stays until you delete it or the site removes it in the cases in{" "}
            <a href="#browser">section 2</a>. If you have a Heiki account, your game account, class,
            constellations and box are also copied to that account.
          </li>
          <li>
            On a computer other people use too, “Log out” does not remove this data from the browser: whoever
            comes after you can see it.
          </li>
          <li>
            You can delete cookies and data from your browser settings: <a href="#cancellare">section 4</a>{" "}
            explains how.
          </li>
          <li>If your consent is ever needed, we will ask for it with a notice before installing anything.</li>
          <li>
            For questions write to <ContactEmail locale="en" />. The{" "}
            <Link href={privacy.href}>{privacy.title.en}</Link> explains who is responsible for your data (the
            “data controller”) and what your rights are.
          </li>
        </ul>
      </Summary>

      <h2 id="cookie" className="scroll-mt-24">
        1. Cookies
      </h2>
      <p>
        A cookie is a small text file that a site leaves in your browser. The browser sends it back to the
        site with every page you open: that way the site remembers, for example, that you are logged in to
        your account.
      </p>
      <p>
        Heiki only uses the cookies in this table. Heiki&apos;s server creates all of them: they are
        “first-party” cookies, meaning they belong to the site you are visiting. The pages do not create any
        others.
      </p>
      <TableScroll>
        <table className="min-w-[560px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>When it is set</th>
              <th>What it is for</th>
              <th>How long it lasts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>{cookies.session}</code>
              </td>
              <td>
                When you log in to your account, including right after signing up; then it is renewed with every
                page you open
              </td>
              <td>Keeping you logged in to your account</td>
              <td>
                {SESSION_DAYS} days from the last page you opened. {SESSION_ABSOLUTE_MAX_DAYS} days after your
                last login it no longer keeps you logged in (see below the table)
              </td>
            </tr>
            <tr>
              <td>
                <code>{cookies.csrf}</code>
              </td>
              <td>On the first page you open, even without an account</td>
              <td>
                Stopping another site from sending a login or logout request in your name. It holds a random
                code
              </td>
              <td>Until you close the browser</td>
            </tr>
            <tr>
              <td>
                <code>{cookies.callback}</code>
              </td>
              <td>On the first page you open, and when you log in</td>
              <td>Remembering which page to go back to after logging in or out. It holds a Heiki address</td>
              <td>Until you close the browser</td>
            </tr>
            {oauth ? (
              <tr>
                <td>
                  <code>{cookies.pkce}</code>
                </td>
                <td>When you choose to log in with {fornitori}</td>
                <td>
                  Completing the login safely: it ties your trip to {fornitori} to your return to Heiki. It
                  holds a random code
                </td>
                <td>
                  15 minutes at most. If you accept on {fornitori}, it is deleted when you come back to Heiki;
                  if you cancel, it expires on its own
                </td>
              </tr>
            ) : null}
            <tr>
              <td>
                <code>{LOCALE_COOKIE}</code>
              </td>
              <td>When you press IT or EN</td>
              <td>Remembering the language you chose. It holds “it” or “en”</td>
              <td>1 year from your last choice</td>
            </tr>
            <tr>
              <td>
                <code>{THEME_COOKIE}</code>
              </td>
              <td>When you pick the site&apos;s colors (the theme)</td>
              <td>Remembering the colors you chose. It holds the theme&apos;s name</td>
              <td>1 year from your last choice</td>
            </tr>
            <tr>
              <td>
                <code>menu-chiuse</code>
              </td>
              <td>When you open or close a menu section</td>
              <td>Remembering which sections you closed. It holds their addresses</td>
              <td>1 year from your last choice</td>
            </tr>
          </tbody>
        </table>
      </TableScroll>
      <p>
        They are all technical cookies: they make the site work or remember a choice you made, such as the
        language and the theme. The law does not require consent for these cookies (art. 122 of the Italian
        Privacy Code, Legislative Decree 196/2003, and the cookie guidelines of the Italian data protection
        authority, the Garante per la protezione dei dati personali, of June 10, 2021): that is why the site
        shows no cookie notice.
      </p>

      <h3>The login cookie</h3>
      <p>It holds, encrypted with a key that only the server has:</p>
      <ul>
        <li>
          your internal ID, email, handle, role and display name, as they were when you logged in: if they
          change later, the cookie keeps the old ones until your next login;
        </li>
        {oauth ? (
          <li>
            if your account was created with {fornitori}, the address of the profile picture you had there
            and, until you save your profile on Heiki, the name you had there instead of your display name;
          </li>
        ) : null}
        <li>the time you logged in and the dates used to make it expire;</li>
        <li>a check that changes when you change your password (not the password).</li>
      </ul>
      <p>
        If it grows beyond about 4 KB, the server splits it into several cookies with the same name and{" "}
        <code>.0</code>, <code>.1</code> and so on at the end.
      </p>
      <p>It stops working, and you have to log in again:</p>
      <ul>
        <li>when you press “Log out”: it is deleted from that browser;</li>
        <li>after {SESSION_DAYS} days without opening a Heiki page;</li>
        <li>
          {SESSION_ABSOLUTE_MAX_DAYS} days after your last login{" "}
          <Elenco
            items={["with your password", ...providers.map((provider) => `with ${provider.label}`)]}
            locale="en"
            tipo="disjunction"
          />
          , even if you use the site every day in the meantime;
        </li>
        <li>
          when you change your password: you are logged out on your other devices, and you stay logged in on
          the one where you changed it;
        </li>
        <li>when you delete your account.</li>
      </ul>
      <p>
        After the {SESSION_ABSOLUTE_MAX_DAYS} days, and on your other devices after a password change or after
        deleting your account, the cookie stays in the browser but no longer lets you in: it goes away
        after {SESSION_DAYS} days without opening a page, when you log in again or when you delete your
        cookies.
      </p>

      <h2 id="browser" className="scroll-mt-24">
        2. Data saved in your browser
      </h2>
      <p>
        Besides cookies, the site saves data in the browser&apos;s local storage (<code>localStorage</code>): a
        space in the browser where a site&apos;s pages keep information. Unlike cookies, the browser does not
        send this data to the server with every page: Heiki&apos;s pages read it, on your device.
      </p>
      <p>
        It has no expiry: it stays until you delete it (<a href="#cancellare">section 4</a>) or until the site
        removes it in the cases listed in the table. If you have a Heiki account, your game account, class,
        constellations and box are also copied to that account shortly after each change, and from there they
        come back to the browser on your other devices when you log in and open a game page or a “Your
        profile” page. The{" "}
        <Link href={privacy.href}>{privacy.title.en}</Link> explains how we handle them.
      </p>
      <p>
        Each item has a name, the “key”. In the keys, <code>{"<game>"}</code> is the game as it appears in the
        site&apos;s addresses
        {games.length > 0 ? (
          <>
            {" "}
            (
            <Elenco
              items={games.map((game) => (
                <Fragment key={game.slug}>
                  <code>{game.slug}</code> for {game.name}
                </Fragment>
              ))}
              locale="en"
            />
            )
          </>
        ) : null}
        , <code>{"<hero>"}</code> is a hero&apos;s code, <code>{"<date>"}</code> is the day (YYYY-MM-DD) and{" "}
        <code>{"<mode>"}</code> is a mode of “Guess the Hero” (
        <Elenco
          items={OTHER_VARIANTS.map((variant) => (
            <Fragment key={variant}>
              <code>{variant}</code> for {VARIANT_LABELS[variant].en}
            </Fragment>
          ))}
          locale="en"
          tipo="disjunction"
        />
        ).
      </p>
      <TableScroll>
        <table className="min-w-[560px]">
          <thead>
            <tr>
              <th>Key</th>
              <th>What it holds and what it is for</th>
              <th>When it is removed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>{"heiki:<game>:account"}</code>
              </td>
              <td>
                Nickname, Friend Code and server of your game account, so you find them in “Your profile”, even
                without a Heiki account
              </td>
              <td>
                When a Heiki account other than the one from last time opens a game page or a “Your profile” page
                in this browser (see <a href="#cancellare">section 4</a>), or when you delete the site&apos;s
                data. Not when you log out
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:account-stamp"}</code>
              </td>
              <td>The time of the last change, to tell which copy is newer between the browser and your account</td>
              <td>Same as the row above</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:account-owner"}</code>
              </td>
              <td>
                The internal ID (a code, not the name) of the last Heiki account that opened a game page or a
                “Your profile” page in this browser: it is used to notice when a different account arrives
              </td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:buff-account"}</code>
              </td>
              <td>
                Your Account Combat Class and constellations, to work out your account buffs and the in-battle
                stats on the hero pages
              </td>
              <td>
                Same as <code>{"heiki:<game>:account"}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:box"}</code>
              </td>
              <td>
                Your box: which heroes you have and how far along they are, for the “Your heroes” page, for the
                filters that show only your heroes and to start from your numbers in the calculator
              </td>
              <td>
                Same as <code>{"heiki:<game>:account"}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:calcolatore:<hero>"}</code>
              </td>
              <td>
                The choices you made in that hero&apos;s stat calculator, so you find them again when you come
                back to the hero&apos;s page
              </td>
              <td>
                When you put the calculator back to its starting setup (everything maxed, or your box&apos;s
                numbers), or when you delete the site&apos;s data
              </td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:squadra"}</code>
              </td>
              <td>The last team you put together in the Team Builder, so you find it again when you come back</td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>{"gz_tierlist_<game>"}</code>
              </td>
              <td>The draft of the tier list you are working on, so you don&apos;t lose it if you close the page</td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:strategia-bozza"}</code>
              </td>
              <td>
                The draft of a new Endgame strategy, including the text you wrote, so you don&apos;t lose it if
                you close the page
              </td>
              <td>When you submit it or empty the form (if submitting fails, the draft comes back)</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:indovina:<date>"}</code> and{" "}
                <code>{"heiki:<game>:indovina-<mode>:<date>"}</code>
              </td>
              <td>
                The heroes you already tried in the daily game of “Guess the Hero”, so you can pick the game up
                again if you come back: one key for each day and mode you play
              </td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>heiki:indovina:mosaico</code>
              </td>
              <td>Whether the mosaic of “Guess the Hero” is on or off, to remember your choice</td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>{"heiki:<game>:recenti"}</code>
              </td>
              <td>The last 8 heroes you opened, for “Recently opened” in the search</td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>heiki:profile-draft</code>
              </td>
              <td>
                The draft of the sample profile, if you press Save on the test page <code>/anteprima/profilo</code>:
                there is no account there, so the save ends up here. The site never reads it back
              </td>
              <td>When you delete the site&apos;s data</td>
            </tr>
            <tr>
              <td>
                <code>{CONSENT_KEY}</code>
              </td>
              <td>
                The answer you gave to the old cookie notice, if you gave it before October 25, 2026. It no
                longer does anything
              </td>
              <td>When you delete the site&apos;s data</td>
            </tr>
          </tbody>
        </table>
      </TableScroll>
      <p>
        If the browser does not allow saving this data, it does not stay: the pages keep it at most while they
        are open.
      </p>
      <p>
        Keys that started with <code>gachazone:</code> (the site&apos;s former name) move to <code>heiki:</code>{" "}
        on the first visit, and the old ones are deleted.
      </p>
      <p>
        The site uses no other way to save data in the browser: no <code>sessionStorage</code>,{" "}
        <code>IndexedDB</code>, Cache API or service worker.
      </p>
      <p>
        Like technical cookies, this data needs no consent: a feature you use saves it, and it is not used to
        track you or for advertising.
      </p>

      <h2 id="altri-siti" className="scroll-mt-24">
        3. No cookies from other sites
      </h2>
      <p>
        While you read Heiki, no other site sets cookies in your browser. The pages load nothing from other
        sites: no ads, visit statistics, social buttons, videos, maps or fonts from other servers. Fonts and
        images come from Heiki itself, and a security rule the site sends to the browser (the{" "}
        <code>Content-Security-Policy</code>) makes it block scripts, images and fonts from other sites.
      </p>
      {oauth ? (
        <p>
          If you log in with {fornitori}, during the login you are on the site you picked: that site&apos;s
          cookies and rules apply there
          {informative.length > 0 ? (
            <>
              {" "}
              (
              <Elenco
                items={informative.map((provider) => (
                  <a key={provider.id} href={provider.href}>
                    {provider.label}&apos;s privacy policy
                  </a>
                ))}
                locale="en"
              />
              )
            </>
          ) : null}
          .
        </p>
      ) : null}
      <p>When you open a link to another site, that site&apos;s cookies and rules apply there.</p>

      <h2 id="cancellare" className="scroll-mt-24">
        4. How to delete them
      </h2>
      <p>
        You can delete Heiki&apos;s cookies and data whenever you like, from your browser settings. The names
        of the options change from one browser to another, but the path is this:
      </p>
      <ol>
        <li>open your browser settings and look for the privacy section, or the “cookies and site data” option;</li>
        <li>
          find Heiki&apos;s address in the list, <code>{host}</code>;
        </li>
        <li>
          choose to delete its data: the cookies (section 1) and the data saved in the browser (section 2) go
          away together.
        </li>
      </ol>
      <p>
        On a computer, Chrome, Edge and Firefox also have a shortcut: while you are on Heiki, press the symbol
        to the left of the address and look for the site&apos;s cookies and data.
      </p>
      <p>What happens next:</p>
      <ul>
        <li>
          without the cookies you are logged out of your account in that browser, and the site goes back to
          Italian and to the starting colors;
        </li>
        <li>
          without the site&apos;s data, your game account, box, drafts and “Guess the Hero” games disappear from
          the browser. If you have a Heiki account, your game account, class, constellations and box stay in
          that account, and come back to the browser when you log in again and open a game page or a “Your
          profile” page.
        </li>
      </ul>
      <p>In a private (or incognito) window the browser deletes cookies and site data by itself when you close it.</p>
      <p>
        You can also block Heiki&apos;s cookies and data in your browser settings. With cookies blocked you can
        still read the site, but you cannot stay logged in to your account or change the language, and the
        theme you pick is lost when you reload the page. With site data blocked the pages work, but they forget
        your game account, box and drafts when you close them.
      </p>
      <h3>On a computer other people use too</h3>
      <p>
        “Log out” ends your login, but the data in section 2 stays in the browser, and whoever uses it after
        you can see it: game account, class, constellations, box, drafts (including the text of a strategy),
        team, calculator, recently opened heroes and “Guess the Hero” games.
      </p>
      <p>
        The site marks in the browser the last Heiki account that opened a game page or a “Your profile” page
        (the <code>{"heiki:<game>:account-owner"}</code> key). When a different account does, the site removes
        the game account, class, constellations and box. It never removes the rest.
      </p>
      <p>
        If instead it is the same account as last time, or no account is marked in the browser yet, the newer
        copy wins. If the browser&apos;s data is newer than the copy in the account, or the account has no
        copy, it moves into the account, even if someone else wrote it without logging in: the nickname,
        server, Friend Code and class then show on that account&apos;s public profile. If it is older, the
        account&apos;s copy takes its place.
      </p>
      <p>
        To remove everything right away, delete the site&apos;s data as explained above, or use a private
        window.
      </p>

      <h2 id="consenso" className="scroll-mt-24">
        5. If your consent is ever needed
      </h2>
      <p>
        Today nothing on Heiki needs your consent. If advertising or visit statistics that are not anonymous
        ever arrive, before turning them on:
      </p>
      <ul>
        <li>
          we will update this page with the new cookies, who sets them, what they are for and how long they
          last, and the date at the top will change;
        </li>
        <li>a notice will ask whether you accept, and refusing will be as easy as accepting;</li>
        <li>
          those cookies will be installed only after you accept, and you will be able to change your mind at
          any time from this page.
        </li>
      </ul>
      <p>This is what the law requires for cookies that are not technical (art. 122 of the Italian Privacy Code).</p>
    </>
  );
}
