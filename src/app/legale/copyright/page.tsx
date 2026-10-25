import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, EmailTemplate, LastUpdated, Summary } from "@/components/legal/legal-parts";
import { PageHeader } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { RIGHTS_RESPONSE_WORKING_DAYS } from "@/lib/legal/commitments";
import { legalDocument } from "@/lib/legal/documents";
import { RETENTION } from "@/lib/legal/retention";
import { reportReasonLabel } from "@/lib/moderation/reasons";
import { siteUrl } from "@/lib/site";

/**
 * Copyright e rimozioni: la pagina per chi ha diritti su un contenuto del sito
 * e per chi segnala un contenuto illegale pubblicato da un utente (art. 16 del
 * Reg. UE 2022/2065, DSA).
 *
 * Le due strade restano separate perche' sono due cose diverse. Immagini, testi
 * e dati dei giochi li pubblica Heiki stesso: su richiesta credibile del
 * titolare si tolgono senza discutere, entro RIGHTS_RESPONSE_WORKING_DAYS
 * (scelta dell'utente del 25/10). Testi e dati stanno anche nel repository
 * pubblico su GitHub (le immagini no: /public/eroi/ e' escluso da git), e la
 * pagina lo dice. Quello che pubblicano gli utenti invece si esamina, si decide
 * e si motiva.
 *
 * I giorni lavorativi valgono solo per i titolari dei diritti, come dice il
 * commento della costante in commitments.ts: agli altri si risponde senza
 * ritardo (art. 16, par. 4 DSA), senza un numero.
 *
 * Niente modulo nel sito: un'email sola (OPERATOR.email) e due testi gia'
 * scritti da copiare, con gli elementi che l'art. 16, par. 2 chiede a una
 * segnalazione e quelli che i titolari dei diritti si aspettano (opera,
 * indirizzi, richiesta, dichiarazione, firma). Tutto quello che succede dopo
 * l'email lo fa il gestore a mano, e la pagina lo dice cosi'.
 *
 * Un blocco JSX intero per lingua, come nelle altre pagine legali: anche il
 * testo delle email e' nella lingua di chi legge.
 */

const DOCUMENTO = legalDocument("copyright");
const TERMINI = legalDocument("termini");
const PRIVACY = legalDocument("privacy");
const NOTE_LEGALI = legalDocument("note-legali");

const TESTI = testi({
  it: { Documento: CopyrightIt },
  en: { Documento: CopyrightEn },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: DOCUMENTO.title[locale], description: DOCUMENTO.description[locale] };
}

export default async function CopyrightPage() {
  const { Documento } = TESTI[await getLocale()];
  return <Documento />;
}

// I numeri vengono dalle costanti: se uno diventa 1, la frase resta giusta.
function giorniLavorativi(n: number): string {
  return n === 1 ? "1 giorno lavorativo" : `${n} giorni lavorativi`;
}

function workingDays(n: number): string {
  return n === 1 ? "1 working day" : `${n} working days`;
}

function mesi(n: number): string {
  return n === 1 ? "1 mese" : `${n} mesi`;
}

function months(n: number): string {
  return n === 1 ? "1 month" : `${n} months`;
}

/* ------------------------------------------------- testi delle email -- */

// Gli indirizzi d'esempio cominciano con quello vero del sito, cosi' chi scrive
// vede che forma devono avere.

function richiestaTitolariIt(base: string): string {
  return [
    "Chi sono: [nome e cognome, o nome della società]",
    "Per conto di: [il titolare dei diritti, se non sei tu]",
    "",
    "L'opera protetta:",
    "[titolo e tipo: illustrazione, carta, icona, testo, dati, marchio...]",
    "[collegamento all'opera originale, se c'è]",
    "",
    "Gli indirizzi esatti su Heiki, uno per riga:",
    `${base}/...`,
    `${base}/...`,
    "",
    "Perché questo uso non è permesso:",
    "[per esempio: è una copia dell'opera, pubblicata senza il permesso del titolare]",
    "",
    "Cosa chiedo:",
    "[togliere i contenuti, sostituirli con una versione ridotta, aggiungere i crediti, altro]",
    "",
    "Dichiaro in buona fede che le informazioni di questa richiesta sono esatte e complete, e che sono il titolare dei diritti o ho l'autorizzazione ad agire per suo conto.",
    "",
    "Firma: [nome e cognome]",
  ].join("\n");
}

function segnalazioneIt(base: string): string {
  return [
    "Perché è illegale:",
    "[spiega perché pensi che sia illegale, con i fatti che conosci]",
    "",
    "Gli indirizzi esatti su Heiki, uno per riga:",
    `${base}/...`,
    "[se serve, come trovarlo nella pagina: autore, data, prime parole]",
    "",
    "Nome e cognome: [il tuo nome]",
    "Email: [il tuo indirizzo email]",
    "",
    "Dichiaro in buona fede che le informazioni e le dichiarazioni di questa segnalazione sono esatte e complete.",
  ].join("\n");
}

function rightsRequestEn(base: string): string {
  return [
    "Who I am: [full name, or company name]",
    "On behalf of: [the rights holder, if not you]",
    "",
    "The protected work:",
    "[title and type: illustration, card, icon, text, data, trademark...]",
    "[link to the original work, if there is one]",
    "",
    "The exact addresses on Heiki, one per line:",
    `${base}/...`,
    `${base}/...`,
    "",
    "Why this use is not allowed:",
    "[for example: it is a copy of the work, published without the rights holder's permission]",
    "",
    "What I am asking for:",
    "[remove the content, replace it with a reduced version, add credits, other]",
    "",
    "I declare in good faith that the information in this request is accurate and complete, and that I am the rights holder or am authorized to act on their behalf.",
    "",
    "Signature: [full name]",
  ].join("\n");
}

function reportEn(base: string): string {
  return [
    "Why it is illegal:",
    "[explain why you think it is illegal, with the facts you know]",
    "",
    "The exact addresses on Heiki, one per line:",
    `${base}/...`,
    "[if needed, how to find it on the page: author, date, first words]",
    "",
    "Full name: [your name]",
    "Email: [your email address]",
    "",
    "I declare in good faith that the information and statements in this report are accurate and complete.",
  ].join("\n");
}

/* ------------------------------------------------------------ italiano -- */

function CopyrightIt() {
  const giorni = giorniLavorativi(RIGHTS_RESPONSE_WORKING_DAYS);
  const base = siteUrl();
  const protetto = reportReasonLabel("copyright", "it");

  return (
    <>
      <PageHeader title={DOCUMENTO.title.it}>
        <p>
          Per chi ha diritti su un contenuto pubblicato su Heiki e per chi vuole segnalare un
          contenuto illegale.
        </p>
      </PageHeader>
      <LastUpdated document="copyright" locale="it" />

      <Summary title="In breve">
        <ul>
          <li>
            Se hai diritti su immagini, testi o dati dei giochi pubblicati su Heiki, scrivici. Se la
            richiesta è credibile, entro {giorni} li togliamo senza contestarla, o mettiamo una
            versione ridotta (per esempio un&apos;immagine più piccola) se preferisci.
          </li>
          <li>
            Se un utente ha pubblicato qualcosa di illegale o che viola i tuoi diritti, segnalalo: dal
            sito con «Segnala» (post e commenti, serve un account) o per email (qualsiasi contenuto,
            anche senza account).
          </li>
          <li>
            Al <a href="#cosa-scrivere">punto 3</a> trovi due testi pronti da copiare: uno per i
            titolari dei diritti, uno per i contenuti illegali.
          </li>
          <li>
            Se ci scrivi per email ti rispondiamo: entro {giorni} se sei titolare dei diritti, senza
            ritardo negli altri casi. Puoi scrivere in italiano o in inglese: leggono e rispondono
            persone, non programmi.
          </li>
          <li>
            Se togliamo un contenuto di un utente, chi l&apos;ha pubblicato riceve il motivo e può
            contestare la decisione.
          </li>
          <li>
            Puoi rivolgerti anche all&apos;AGCOM, l&apos;autorità italiana per le comunicazioni, o al
            giudice: il <a href="#altre-strade">punto 6</a> spiega quando.
          </li>
          <li>
            Scrivi a: <ContactEmail locale="it" />
          </li>
        </ul>
      </Summary>

      <h2 id="titolari" className="scroll-mt-24">
        1. Se hai diritti su un contenuto di Heiki
      </h2>
      <p>
        Heiki è un sito di fan, gratuito e non ufficiale: non è affiliato, sponsorizzato né approvato
        da Netmarble, Kodansha o dagli altri titolari dei diritti. Pubblica materiale di{" "}
        <em>The Seven Deadly Sins: Grand Cross</em> preso dai file del gioco:
      </p>
      <ul>
        <li>
          immagini: illustrazioni e card degli eroi, primi piani della Mossa finale, abilità, costumi,
          equipaggiamento, Reliquie sacre, carte artefatto, boss, mostri e bestie dell&apos;Endgame,
          icone dell&apos;interfaccia e degli oggetti, simboli delle costellazioni;
        </li>
        <li>testi: nomi, descrizioni e abilità, in italiano e in inglese;</li>
        <li>dati: statistiche, valori e probabilità ricavati dalle tabelle del gioco.</li>
      </ul>
      <p>
        Lo usiamo per informare e discutere del gioco. Oggi Heiki non vende niente e non mostra
        pubblicità. I diritti restano ai titolari: Netmarble per il gioco; Nakaba Suzuki e Kodansha
        per l&apos;opera originale; i comitati di produzione delle serie animate; per gli eroi delle
        collaborazioni, i titolari di quelle opere. I crediti completi sono nelle{" "}
        <Link href={NOTE_LEGALI.href}>{NOTE_LEGALI.title.it}</Link>.
      </p>
      <p>
        Testi e dati stanno anche nel codice del sito, che è pubblico su GitHub; le immagini no. Se
        hai diritti su uno di questi contenuti, o agisci per conto di chi li ha, scrivici con il
        testo del <a href="#cosa-scrivere">punto 3</a>. Se la richiesta viene davvero dal titolare
        (vedi il <a href="#segnalazioni-false">punto 5</a>) e indica i contenuti, entro {giorni} li
        togliamo dal sito e dal codice, o li riduciamo se è questo che chiedi (per esempio
        un&apos;immagine più piccola), senza contestare la richiesta. Le versioni passate del codice
        restano nella sua cronologia su GitHub.
      </p>
      <p>
        Se hai diritti su un altro contenuto di Heiki, per esempio un testo scritto da noi, scrivici
        allo stesso modo: lo controlliamo e ti rispondiamo entro {giorni}.
      </p>

      <h2 id="utenti" className="scroll-mt-24">
        2. Se un utente ha pubblicato qualcosa di illegale o che viola i tuoi diritti
      </h2>
      <p>
        Su Heiki gli utenti scrivono post e commenti, guide (anche dell&apos;Endgame), valutazioni
        degli eroi, tier list e profili.
      </p>
      <ul>
        <li>
          Post, commenti, valutazioni, tier list e profili vanno online subito, senza un nostro
          controllo prima: la legge non ce lo chiede (art. 8 del Regolamento UE 2022/2065 sui servizi
          digitali, detto DSA).
        </li>
        <li>
          Le guide dell&apos;Endgame con un testo vanno online solo dopo che le ha approvate un
          moderatore; quelle con la sola squadra vanno online subito.
        </li>
        <li>
          Le guide della sezione «Guide e rotazioni» le scrive un collaboratore e vanno online solo
          quando le pubblica un redattore.
        </li>
      </ul>
      <p>
        Quando veniamo a sapere che un contenuto è illegale, per esempio da una segnalazione precisa,
        lo togliamo senza ritardo (art. 6 DSA).
      </p>
      <p>Puoi segnalarlo in due modi.</p>
      <ul>
        <li>
          <strong>Dal sito.</strong> Sotto ogni post e ogni commento, anche nelle guide
          dell&apos;Endgame, c&apos;è «Segnala». Serve un account non sospeso. Scegli il motivo (se
          viola i tuoi diritti, «{protetto}») e spiega nei dettagli. La segnalazione arriva ai
          moderatori. Oggi chi segnala dal sito non riceve l&apos;esito: se vuoi una risposta, scrivi
          per email.
        </li>
        <li>
          <strong>Per email.</strong> Per qualsiasi contenuto, anche senza account. È l&apos;unico
          modo per le guide della sezione «Guide e rotazioni», le valutazioni degli eroi, le tier list
          e i profili. Usa il testo del <a href="#cosa-scrivere">punto 3</a>: contiene quello che
          serve a una segnalazione (art. 16 DSA).
        </li>
      </ul>

      <h2 id="cosa-scrivere" className="scroll-mt-24">
        3. Cosa scrivere
      </h2>
      <p>
        Copia il testo adatto, completa le parti tra parentesi quadre e mandalo a{" "}
        <ContactEmail locale="it" />. Il collegamento sotto ogni testo apre il tuo programma di posta
        con oggetto e testo già scritti. Puoi scrivere in italiano o in inglese.
      </p>
      <p>
        Va bene anche un avviso scritto con un altro modello (per esempio quello previsto dal DMCA,
        una legge americana sul diritto d&apos;autore), se contiene le stesse informazioni. I dati del
        gestore (ragione sociale e sede) sono nelle{" "}
        <Link href={NOTE_LEGALI.href}>{NOTE_LEGALI.title.it}</Link>.
      </p>

      <h3>Per i titolari dei diritti</h3>
      <p>Per un contenuto pubblicato da Heiki o da un utente che viola i tuoi diritti.</p>
      <EmailTemplate
        locale="it"
        subject="Richiesta di rimozione: titolare dei diritti"
        body={richiestaTitolariIt(base)}
        action="Apri l'email con questo testo"
      />

      <h3>Per un contenuto illegale pubblicato da un utente</h3>
      <p>Lo può usare chiunque, anche senza account.</p>
      <EmailTemplate
        locale="it"
        subject="Segnalazione di un contenuto illegale"
        body={segnalazioneIt(base)}
        action="Apri l'email con questo testo"
      />
      <p>
        Se segnali contenuti di abuso o sfruttamento sessuale di minori, nome ed email non sono
        obbligatori (art. 16 DSA): puoi lasciare vuote quelle righe. L&apos;indirizzo da cui scrivi lo
        vediamo comunque: se non vuoi dirci chi sei, scrivi da un indirizzo che non contiene il tuo
        nome.
      </p>

      <h2 id="dopo" className="scroll-mt-24">
        4. Cosa succede dopo
      </h2>
      <p>
        Ecco cosa succede quando ci scrivi. Le segnalazioni fatte dal sito seguono gli stessi passi,
        con una differenza: chi le manda vede sullo schermo solo il messaggio «Segnalazione inviata»
        e oggi non riceve da noi né la risposta del passo 1 né la decisione del passo 3.
      </p>
      <ol>
        <li>
          <strong>Risposta.</strong> Confermiamo che la richiesta è arrivata e, se manca qualcosa per
          decidere, te lo chiediamo: entro {giorni} (dal lunedì al venerdì, esclusi i festivi in
          Italia) se sei titolare dei diritti, senza ritardo negli altri casi. Risponde una persona:
          non c&apos;è una conferma automatica.
        </li>
        <li>
          <strong>Immagini, testi e dati dei giochi.</strong> Se la richiesta è credibile, entro{" "}
          {giorni} togliamo o riduciamo i contenuti, senza contestarla, e ti scriviamo quando è fatto.
          Per gli altri contenuti di Heiki (per esempio un testo scritto da noi) controlliamo la
          richiesta e ti scriviamo cosa abbiamo deciso e perché.
        </li>
        <li>
          <strong>Contenuti degli utenti.</strong> Una persona controlla il contenuto e decide se è
          illegale o va contro i <Link href={TERMINI.href}>{TERMINI.title.it}</Link>: non usiamo
          programmi automatici per decidere. Se sì, lo togliamo: lo nasconde un moderatore o lo
          cancella il gestore. Se no, resta online. In tutti e due i casi ti scriviamo cosa abbiamo
          deciso, perché e come puoi contestarlo.
        </li>
        <li>
          <strong>Avviso a chi l&apos;ha pubblicato.</strong> Se togliamo un contenuto, chi l&apos;ha
          pubblicato riceve un avviso con: cosa abbiamo fatto e per quanto tempo, il motivo, la regola
          dei Termini o la norma violata, se è partito da una segnalazione, se abbiamo usato strumenti
          automatici, e come contestare (art. 17 DSA). Il nome di chi ha segnalato lo diamo solo se è
          strettamente necessario (vedi il <a href="#dati">punto 7</a>).
        </li>
        <li>
          <strong>Contestare.</strong> Se non sei d&apos;accordo con la decisione, che tu abbia
          segnalato o pubblicato il contenuto, scrivi allo stesso indirizzo e spiega perché. Una
          persona riesamina la decisione, gratis, e ti risponde con l&apos;esito. Restano sempre aperte
          le strade del <a href="#altre-strade">punto 6</a>.
        </li>
        <li>
          <strong>Pericolo per qualcuno.</strong> Se una segnalazione fa sospettare un reato che mette
          in pericolo la vita o la sicurezza di qualcuno, informiamo subito le autorità (art. 18 DSA).
          Se qualcuno è in pericolo adesso, chiama il numero di emergenza (in Europa il 112).
        </li>
      </ol>

      <h2 id="segnalazioni-false" className="scroll-mt-24">
        5. Segnalazioni false o abusive
      </h2>
      <ul>
        <li>
          Manda una richiesta solo se credi davvero che sia fondata. Con la dichiarazione alla fine del
          testo dici che quello che scrivi è esatto e completo.
        </li>
        <li>
          Se una richiesta dice di venire da un titolare, come Netmarble o Kodansha, ma non è chiaro
          che sia così (per esempio arriva da un indirizzo che non è della società), prima di agire ti
          chiediamo una prova: che hai i diritti, o che agisci per conto di chi li ha. Il termine di{" "}
          {giorni} per togliere i contenuti parte da quando riceviamo la prova.
        </li>
        <li>
          Una segnalazione falsa fatta apposta può far togliere un contenuto in regola. Chi la manda
          risponde dei danni che causa; se ha un account su Heiki, viola anche la{" "}
          <Link href={`${TERMINI.href}#r10`}>regola R10 dei {TERMINI.title.it}</Link>.
        </li>
        <li>«Segnala» non serve a dire che non sei d&apos;accordo con un contenuto: per quello c&apos;è il voto.</li>
      </ul>

      <h2 id="altre-strade" className="scroll-mt-24">
        6. Altre strade
      </h2>
      <ul>
        <li>
          <strong>Diritto d&apos;autore.</strong> Chi ha i diritti su un&apos;opera può rivolgersi
          anche direttamente all&apos;AGCOM (Autorità per le garanzie nelle comunicazioni), con la
          procedura del suo regolamento sul diritto d&apos;autore online (delibera 680/13/CONS e
          successive modifiche). Scriverci prima non è obbligatorio.
        </li>
        <li>
          <strong>Rispetto del DSA.</strong> Se pensi che Heiki non rispetti il Regolamento UE
          2022/2065, per esempio perché non hai avuto risposta, puoi presentare un reclamo al
          Coordinatore dei servizi digitali del paese in cui vivi o hai sede (art. 53 DSA). In Italia è
          l&apos;AGCOM (art. 15 del D.L. 15 settembre 2023, n. 123, convertito dalla L. 13 novembre
          2023, n. 159): <a href="https://www.agcom.it">www.agcom.it</a>. Il reclamo riguarda il
          rispetto delle regole: non annulla una singola decisione su un contenuto.
        </li>
        <li>
          <strong>Giudice.</strong> Puoi sempre rivolgerti al giudice, anche senza passare prima da noi
          o dall&apos;AGCOM.
        </li>
      </ul>

      <h2 id="dati" className="scroll-mt-24">
        7. I dati di chi segnala
      </h2>
      <ul>
        <li>
          Usiamo i dati che ci scrivi (nome, email, società, il testo della richiesta) solo per gestire
          la richiesta, risponderti, informare le autorità quando la legge lo chiede e, se serve,
          dimostrare cosa abbiamo fatto.
        </li>
        <li>
          Le email restano nella casella del gestore per {mesi(RETENTION.emailRequestsMonths)} dalla
          chiusura della richiesta: poi le cancella il gestore, a mano.
        </li>
        <li>
          Le segnalazioni fatte dal sito le vedono solo i moderatori e gli amministratori; chi ha
          pubblicato il contenuto non vede chi l&apos;ha segnalato. Una segnalazione chiusa si
          cancella da sola {mesi(RETENTION.closedReportsMonths)} dopo l&apos;invio; quelle aperte
          restano finché un moderatore decide. Se elimini l&apos;account, le tue segnalazioni si cancellano subito.
        </li>
        <li>
          Il tuo nome lo diciamo a chi ha pubblicato il contenuto solo se è strettamente necessario
          (art. 17 DSA).
        </li>
        <li>
          Se dobbiamo informare le autorità (<a href="#dopo">punto 4</a>), passiamo loro anche la
          segnalazione.
        </li>
        <li>
          Chi tratta i dati, su quale base e quali sono i tuoi diritti:{" "}
          <Link href={PRIVACY.href}>{PRIVACY.title.it}</Link>.
        </li>
      </ul>
    </>
  );
}

/* ------------------------------------------------------------- inglese -- */

function CopyrightEn() {
  const days = workingDays(RIGHTS_RESPONSE_WORKING_DAYS);
  const base = siteUrl();
  const protectedLabel = reportReasonLabel("copyright", "en");

  return (
    <>
      <PageHeader title={DOCUMENTO.title.en}>
        <p>
          For anyone who holds rights in content published on Heiki, and for anyone who wants to
          report illegal content.
        </p>
      </PageHeader>
      <LastUpdated document="copyright" locale="en" />

      <Summary title="In short">
        <ul>
          <li>
            If you hold rights in game images, texts or data published on Heiki, write to us. If the
            request is credible, within {days} we remove them without disputing it, or put up a
            reduced version (for example a smaller image) if you prefer.
          </li>
          <li>
            If a user has published something illegal or that infringes your rights, report it: on the
            site with “Report” (posts and comments, you need an account) or by email (any content, even
            without an account).
          </li>
          <li>
            In <a href="#cosa-scrivere">section 3</a> you will find two ready-made texts to copy: one
            for rights holders, one for illegal content.
          </li>
          <li>
            If you email us, we reply: within {days} if you are a rights holder, without delay in the
            other cases. You can write in Italian or English: people read and reply, not programs.
          </li>
          <li>
            If we remove a user&apos;s content, whoever published it is told why and can dispute the
            decision.
          </li>
          <li>
            You can also turn to AGCOM, the Italian communications authority, or a court:{" "}
            <a href="#altre-strade">section 6</a> explains when.
          </li>
          <li>
            Write to: <ContactEmail locale="en" />
          </li>
        </ul>
      </Summary>

      <h2 id="titolari" className="scroll-mt-24">
        1. If you hold rights in content on Heiki
      </h2>
      <p>
        Heiki is a free, unofficial fan site: it is not affiliated with, sponsored or endorsed by
        Netmarble, Kodansha or the other rights holders. It publishes material from{" "}
        <em>The Seven Deadly Sins: Grand Cross</em> taken from the game files:
      </p>
      <ul>
        <li>
          images: hero illustrations and cards, Ultimate Move close-ups, skills, costumes, equipment,
          Holy Relics, Artifact Cards, Endgame bosses, monsters and beasts, interface and item icons,
          constellation symbols;
        </li>
        <li>texts: names, descriptions and skills, in Italian and English;</li>
        <li>data: stats, values and probabilities taken from the game&apos;s tables.</li>
      </ul>
      <p>
        We use it to inform people about the game and to discuss it. Today Heiki sells nothing and
        shows no ads. The rights remain with their holders: Netmarble for the game; Nakaba Suzuki and
        Kodansha for the original work; the production committees of the anime series; for
        collaboration heroes, the holders of those works. The full credits are in the{" "}
        <Link href={NOTE_LEGALI.href}>{NOTE_LEGALI.title.en}</Link>.
      </p>
      <p>
        The texts and data are also in the site&apos;s code, which is public on GitHub; the images are
        not. If you hold rights in any of this content, or act on behalf of whoever does, write to us
        with the text in <a href="#cosa-scrivere">section 3</a>. If the request really comes from the
        rights holder (see <a href="#segnalazioni-false">section 5</a>) and identifies the content,
        within {days} we remove it from the site and from the code, or reduce it if that is what you
        ask (for example a smaller image), without disputing the request. Earlier versions of the code
        remain in its history on GitHub.
      </p>
      <p>
        If you hold rights in other content on Heiki, for example a text we wrote, write to us the
        same way: we check it and reply within {days}.
      </p>

      <h2 id="utenti" className="scroll-mt-24">
        2. If a user has published something illegal or that infringes your rights
      </h2>
      <p>
        On Heiki, users write posts and comments, guides (Endgame guides included), hero ratings,
        tier lists and profiles.
      </p>
      <ul>
        <li>
          Posts, comments, ratings, tier lists and profiles go online straight away, without us
          checking them first: the law does not require us to (Art. 8 of Regulation (EU) 2022/2065 on
          digital services, known as the DSA).
        </li>
        <li>
          Endgame guides with text go online only after a moderator has approved them; those with
          only a team go online straight away.
        </li>
        <li>
          Guides in the “Guides and rotations” section are written by a contributor and go online only
          when an editor publishes them.
        </li>
      </ul>
      <p>
        When we learn that content is illegal, for example from a precise report, we remove it
        without delay (Art. 6 DSA).
      </p>
      <p>You can report it in two ways.</p>
      <ul>
        <li>
          <strong>On the site.</strong> Under every post and every comment, Endgame guides included,
          there is “Report”. You need an account that is not suspended. Pick the reason (if it
          infringes your rights, “{protectedLabel}”) and explain in the details. The report goes to the
          moderators. Today whoever reports on the site does not receive the outcome: if you want a
          reply, write by email.
        </li>
        <li>
          <strong>By email.</strong> For any content, even without an account. It is the only way for
          guides in the “Guides and rotations” section, hero ratings, tier lists and profiles. Use the
          text in <a href="#cosa-scrivere">section 3</a>: it contains what a report needs (Art. 16
          DSA).
        </li>
      </ul>

      <h2 id="cosa-scrivere" className="scroll-mt-24">
        3. What to write
      </h2>
      <p>
        Copy the text that fits, fill in the parts in square brackets and send it to{" "}
        <ContactEmail locale="en" />. The link under each text opens your email program with the
        subject and text already filled in. You can write in Italian or English.
      </p>
      <p>
        A notice written with another template (for example a notice under the DMCA, a US copyright
        law) is fine too, as long as it contains the same information. The operator&apos;s details
        (company name and registered office) are in the{" "}
        <Link href={NOTE_LEGALI.href}>{NOTE_LEGALI.title.en}</Link>.
      </p>

      <h3>For rights holders</h3>
      <p>For content published by Heiki or by a user that infringes your rights.</p>
      <EmailTemplate
        locale="en"
        subject="Removal request: rights holder"
        body={rightsRequestEn(base)}
        action="Open an email with this text"
      />

      <h3>For illegal content published by a user</h3>
      <p>Anyone can use it, even without an account.</p>
      <EmailTemplate
        locale="en"
        subject="Report of illegal content"
        body={reportEn(base)}
        action="Open an email with this text"
      />
      <p>
        If you are reporting content involving the sexual abuse or exploitation of children, your name
        and email are not required (Art. 16 DSA): you can leave those lines blank. We still see the
        address you write from: if you do not want to tell us who you are, write from an address that
        does not contain your name.
      </p>

      <h2 id="dopo" className="scroll-mt-24">
        4. What happens next
      </h2>
      <p>
        This is what happens when you write to us. Reports made on the site follow the same steps,
        with one difference: whoever sends one only sees the “Report sent” message on screen, and
        today gets from us neither the reply in step 1 nor the decision in step 3.
      </p>
      <ol>
        <li>
          <strong>Reply.</strong> We confirm that the request has arrived and, if something is missing
          for a decision, we ask you for it: within {days} (Monday to Friday, excluding public holidays
          in Italy) if you are a rights holder, without delay in the other cases. A person replies:
          there is no automatic confirmation.
        </li>
        <li>
          <strong>Game images, texts and data.</strong> If the request is credible, within {days} we
          remove or reduce the content, without disputing the request, and write to you when it is
          done. For other Heiki content (for example a text we wrote) we check the request and write to
          you with what we decided and why.
        </li>
        <li>
          <strong>Users&apos; content.</strong> A person checks the content and decides whether it is
          illegal or breaks the <Link href={TERMINI.href}>{TERMINI.title.en}</Link>: we do not use
          automated programs to decide. If so, we remove it: a moderator hides it or the operator
          deletes it. If not, it stays online. Either way we write to you with what we decided, why,
          and how you can dispute it.
        </li>
        <li>
          <strong>Notice to whoever published it.</strong> If we remove content, whoever published it
          receives a notice with: what we did and for how long, the reason, the rule of the Terms or
          the law it breaks, whether it started from a report, whether we used automated tools, and
          how to dispute it (Art. 17 DSA). We give the name of whoever reported it only if strictly
          necessary (see <a href="#dati">section 7</a>).
        </li>
        <li>
          <strong>Disputing.</strong> If you disagree with the decision, whether you reported the
          content or published it, write to the same address and explain why. A person reviews the
          decision, free of charge, and replies with the outcome. The routes in{" "}
          <a href="#altre-strade">section 6</a> always remain open.
        </li>
        <li>
          <strong>Danger to someone.</strong> If a report suggests a crime that threatens someone&apos;s
          life or safety, we inform the authorities immediately (Art. 18 DSA). If someone is in danger
          right now, call your local emergency number (112 in Europe).
        </li>
      </ol>

      <h2 id="segnalazioni-false" className="scroll-mt-24">
        5. False or abusive reports
      </h2>
      <ul>
        <li>
          Send a request only if you truly believe it is well-founded. With the declaration at the end
          of the text you state that what you write is accurate and complete.
        </li>
        <li>
          If a request claims to come from a rights holder, such as Netmarble or Kodansha, but it is
          not clear that it does (for example it comes from an address that is not the company&apos;s),
          before acting we ask you for proof: that you hold the rights, or that you act on behalf of
          whoever does. We count the {days} for removing the content from when we receive the proof.
        </li>
        <li>
          A deliberately false report can get content removed that breaks no rules. Whoever sends it is
          liable for the damage it causes; if they have a Heiki account, they also break{" "}
          <Link href={`${TERMINI.href}#r10`}>rule R10 of the {TERMINI.title.en}</Link>.
        </li>
        <li>“Report” is not for saying you disagree with something: that is what votes are for.</li>
      </ul>

      <h2 id="altre-strade" className="scroll-mt-24">
        6. Other routes
      </h2>
      <ul>
        <li>
          <strong>Copyright.</strong> Whoever holds the rights in a work can also go directly to AGCOM
          (the Italian Communications Authority), using the procedure of its regulation on online
          copyright (resolution 680/13/CONS, as amended). Writing to us first is not required.
        </li>
        <li>
          <strong>Compliance with the DSA.</strong> If you think Heiki does not comply with Regulation
          (EU) 2022/2065, for example because you got no reply, you can file a complaint with the
          Digital Services Coordinator of the country where you live or are established (Art. 53 DSA).
          In Italy it is AGCOM (Art. 15 of Decree-Law no. 123 of 15 September 2023, converted into law
          by Law no. 159 of 13 November 2023): <a href="https://www.agcom.it">www.agcom.it</a>. The
          complaint is about compliance with the rules: it does not overturn a single decision on a
          piece of content.
        </li>
        <li>
          <strong>Court.</strong> You can always go to court, even without going through us or AGCOM
          first.
        </li>
      </ul>

      <h2 id="dati" className="scroll-mt-24">
        7. Data of people who report
      </h2>
      <ul>
        <li>
          We use the data you write to us (name, email, company, the text of the request) only to
          handle the request, reply to you, inform the authorities when the law requires it and, if
          needed, show what we did.
        </li>
        <li>
          Emails stay in the operator&apos;s mailbox for {months(RETENTION.emailRequestsMonths)} after
          the request is closed: then the operator deletes them by hand.
        </li>
        <li>
          Reports made on the site are seen only by moderators and administrators; whoever published
          the content does not see who reported it. A closed report is deleted automatically{" "}
          {months(RETENTION.closedReportsMonths)} after it was sent; open ones stay until a moderator
          decides. If you delete your account, your reports are deleted at once.
        </li>
        <li>
          We give your name to whoever published the content only if strictly necessary (Art. 17 DSA).
        </li>
        <li>
          If we have to inform the authorities (<a href="#dopo">section 4</a>), we pass the report on
          to them too.
        </li>
        <li>
          Who processes the data, on what basis, and what your rights are:{" "}
          <Link href={PRIVACY.href}>{PRIVACY.title.en}</Link>.
        </li>
      </ul>
    </>
  );
}
