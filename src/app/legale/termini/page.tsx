import type { Metadata } from "next";
import Link from "next/link";
import { ContactEmail, EmailTemplate, LastUpdated, OperatorDetails, Summary } from "@/components/legal/legal-parts";
import { PageHeader } from "@/components/ui";
import { DELETE_PHRASES } from "@/lib/auth/account";
import { enabledOauthProviders } from "@/lib/auth/config";
import { roleLabel } from "@/lib/auth/permissions";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { MIN_AGE, RIGHTS_RESPONSE_WORKING_DAYS } from "@/lib/legal/commitments";
import { legalDocument } from "@/lib/legal/documents";
import { RETENTION } from "@/lib/legal/retention";

/**
 * Termini di servizio: chi offre Heiki, l'account, i contenuti degli utenti, le
 * regole della community e la moderazione (art. 14 del Reg. UE 2022/2065).
 *
 * Le regole sono numerate e ognuna ha un'ancora (#r1, #r2...), uguale nelle due
 * lingue: l'avviso a chi subisce una misura (art. 17) cita la regola con il suo
 * indirizzo. Una regola nuova si aggiunge in fondo: se i numeri scorressero, gli
 * avvisi gia' mandati punterebbero alla regola sbagliata.
 *
 * Un blocco JSX intero per lingua, come le altre pagine legali: l'inglese dice
 * le stesse cose dell'italiano, nello stesso ordine. I numeri vengono dalle
 * costanti (eta' minima, durate, giorni di risposta), i dati del gestore da
 * OPERATOR attraverso i pezzi di legal-parts. Discord e Google si nominano solo
 * se sono accesi (enabledOauthProviders).
 *
 * Un numero e' scritto qui a mano, perche' la sua costante non si puo'
 * importare: RECENT_AUTH_MINUTES, sotto.
 */

const TERMINI = legalDocument("termini");
const PRIVACY = legalDocument("privacy");
const COPYRIGHT = legalDocument("copyright");
const NOTE_LEGALI = legalDocument("note-legali");

/**
 * I minuti che ha chi entra solo con Discord o Google per eliminare l'account
 * dopo essere rientrato: RECENT_AUTH_SECONDS / 60 in
 * src/lib/auth/account-actions.ts. Quel file e' "use server" e puo' esportare
 * solo funzioni asincrone. Se il numero cambia la', va cambiato qui e nella
 * privacy (sezione 8).
 */
const RECENT_AUTH_MINUTES = 10;

interface DocProps {
  /** i nomi dei fornitori di accesso accesi; vuoto se non ce n'e' nessuno */
  oauth: readonly string[];
}

/** «Discord», «Discord o Google»: i nomi dei fornitori dentro una frase. */
function inFrase(nomi: readonly string[], congiunzione: string): string {
  if (nomi.length < 2) return nomi.join("");
  return `${nomi.slice(0, -1).join(", ")} ${congiunzione} ${nomi[nomi.length - 1]}`;
}

/** La richiesta di riesame da copiare: chi contesta sa subito cosa scrivere. */
const RIESAME = testi({
  it: {
    subject: "Riesame di una decisione di moderazione",
    body: `Il mio handle su Heiki (se ho un account):

La decisione che contesto (per esempio contenuto nascosto, guida respinta, account sospeso, esito di una mia segnalazione):

L'indirizzo del contenuto, se c'è:

Perché penso che la decisione sia sbagliata:`,
  },
  en: {
    subject: "Review of a moderation decision",
    body: `My Heiki handle (if I have an account):

The decision I am contesting (for example hidden content, rejected guide, suspended account, outcome of a report I made):

The address of the content, if there is one:

Why I think the decision is wrong:`,
  },
});

const TESTI = testi({
  it: { Documento: TerminiIt },
  en: { Documento: TerminiEn },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: TERMINI.title[locale], description: TERMINI.description[locale] };
}

export default async function TermsPage() {
  const { Documento } = TESTI[await getLocale()];
  const oauth = enabledOauthProviders().map((provider) => provider.label);
  return <Documento oauth={oauth} />;
}

function TerminiIt({ oauth }: DocProps) {
  return (
    <>
      <PageHeader title={TERMINI.title.it}>
        Le regole per usare Heiki: cosa puoi fare, cosa non puoi fare e cosa succede se una regola non viene rispettata.
      </PageHeader>
      <LastUpdated document="termini" locale="it" />

      <Summary title="In breve">
        <ul>
          <li>Heiki è un sito di fan, gratuito e non ufficiale: non appartiene a Netmarble né ad altri editori di giochi.</li>
          <li>Leggere non richiede un account. Per scrivere serve un account, e per aprirlo devi avere almeno {MIN_AGE} anni.</li>
          <li>
            Quello che pubblichi resta tuo, e ci dai il permesso di mostrarlo su Heiki. Post, commenti e guide restano anche
            dopo che elimini l&apos;account, con «Account eliminato» al posto del tuo nome.
          </li>
          <li>
            Le <a href="#regole">regole della community</a> sono numerate (R1, R2 e così via): niente insulti, dati personali
            degli altri, spam, numeri falsi, materiale copiato o contenuti illegali.
          </li>
          <li>
            Nascondere un contenuto, respingere una guida o una verifica e sospendere un account lo decide sempre una persona,
            non un programma. Se lo facciamo con un tuo contenuto o con il tuo account, ti diciamo cosa abbiamo fatto, perché e
            come contestarlo.
          </li>
          <li>Dati e calcoli possono essere sbagliati o vecchi: prima di spendere risorse nel gioco, controlla.</li>
          <li>
            Per segnalare, contestare una decisione o chiedere qualcosa scrivi a <ContactEmail locale="it" />.
          </li>
        </ul>
      </Summary>

      <h2 id="gestore" className="scroll-mt-24">1. Chi offre il servizio</h2>
      <p>Heiki è un servizio della società indicata qui sotto. In questi Termini «noi» e «il gestore» vogliono dire questa società.</p>
      <OperatorDetails locale="it" />
      <p>
        Questi Termini valgono per chiunque usi Heiki. Quando crei un account li accetti, e da quel momento sono il contratto
        fra te e noi. Ci sono in italiano e in inglese, con lo stesso contenuto.
      </p>

      <h2 id="heiki" className="scroll-mt-24">2. Cos&apos;è Heiki</h2>
      <p>
        Heiki è un sito di fan, gratuito e non ufficiale, sui giochi gacha. Oggi c&apos;è un gioco, The Seven Deadly Sins:
        Grand Cross di Netmarble; altri sono annunciati nella home, per ora solo con il nome. Trovi le schede degli eroi,
        strumenti di calcolo, tier list, guide e una community dove parlare del gioco.
      </p>
      <ul>
        <li>Le schede e i dati vengono dai file del gioco: le sue tabelle e i suoi testi, letti con programmi nostri.</li>
        <li>
          Le date d&apos;uscita degli eroi vengono da un foglio di calcolo curato da giocatori della community: la pagina{" "}
          <Link href="/grand-cross/uscite">Uscite</Link> dice quale.
        </li>
        <li>
          Niente di tutto questo è ufficiale. Heiki non è affiliato a Netmarble né agli altri titolari dei giochi, e non è
          sponsorizzato né approvato da loro (<a href="#giochi">sezione 8</a>).
        </li>
      </ul>

      <h2 id="account" className="scroll-mt-24">3. Chi può usarlo e l&apos;account</h2>
      <p>
        Leggere Heiki non richiede un account. Per pubblicare, commentare, votare, segnalare o salvare dati nel tuo profilo
        serve un account.
      </p>
      <ul>
        <li>
          <strong>Età.</strong> Per aprire un account devi avere almeno {MIN_AGE} anni. Se scopriamo un account di una persona
          con meno di {MIN_AGE} anni, il gestore lo chiude a mano e cancella i suoi dati.
        </li>
        <li>
          <strong>Iscrizione.</strong> Ti iscrivi con email e password
          {oauth.length > 0 ? `, oppure con il tuo account ${inFrase(oauth, "o")}` : ""}.
        </li>
        <li>
          <strong>Un account a persona.</strong> L&apos;account è tuo: non darlo ad altri e non usare quello di qualcun altro
          (regola <a href="#r8">R8</a>).
        </li>
        <li>
          <strong>Password.</strong> Tienila per te. Se pensi che qualcuno sia entrato nel tuo account, cambia la password (se
          ne usi una) dalle <Link href="/impostazioni/account">Impostazioni dell&apos;account</Link> e scrivici.
        </li>
        <li>
          <strong>Il gioco.</strong> Heiki non ti chiede mai la password o i dati di accesso del tuo account del gioco. Per
          l&apos;account di gioco su Heiki bastano nickname, server e Codice amico, che non servono a entrare nel gioco. Se
          qualcuno ti chiede le credenziali a nome di Heiki, non siamo noi: non dargliele.
        </li>
      </ul>

      <h2 id="contenuti" className="scroll-mt-24">4. Quello che pubblichi</h2>
      <p>
        Post, commenti, guide (quelle della sezione «Guide e rotazioni» e quelle dell&apos;Endgame), valutazioni degli eroi,
        tier list e il tuo profilo restano tuoi. Pubblica solo cose che hai il diritto di pubblicare e che rispettano le{" "}
        <a href="#regole">regole della sezione 5</a>: di quello che pubblichi rispondi tu.
      </p>
      <p>Pubblicando ci dai un permesso (una licenza) gratuito e non esclusivo:</p>
      <ul>
        <li>
          di conservare i tuoi contenuti e di mostrarli su Heiki: nella loro pagina, negli elenchi, nella ricerca, nel tuo
          profilo e nella home;
        </li>
        <li>di mostrarne il titolo e le prime righe nelle anteprime dei collegamenti, quando qualcuno condivide un indirizzo di Heiki;</li>
        <li>
          di continuare a mostrare post, commenti e guide anche dopo che elimini l&apos;account: restano, con «Account
          eliminato» come autore al posto del tuo nome;
        </li>
        <li>
          per le guide della sezione «Guide e rotazioni», anche di modificarle: chi ha il ruolo «{roleLabel("EDITOR", "it")}» o
          superiore può correggere titolo e testo delle guide degli altri, e sotto ogni guida c&apos;è l&apos;elenco pubblico
          delle modifiche.
        </li>
      </ul>
      <p>«Non esclusivo» vuol dire che puoi pubblicare le stesse cose anche altrove.</p>
      <p>Cosa puoi cambiare da solo:</p>
      <ul>
        <li>valutazioni e tier list: le modifichi e le cancelli quando vuoi, tranne durante una sospensione;</li>
        <li>guide: le modifichi ma non le cancelli; se cambi il testo di una guida già pubblicata, torna in revisione;</li>
        <li>post e commenti: una volta pubblicati non si modificano e non si cancellano dal sito.</li>
      </ul>
      <p>
        Per togliere un tuo post, un tuo commento o una tua guida scrivici (<a href="#contatti">sezione 15</a>): lo
        cancelliamo noi.
      </p>
      <p>
        Anche il profilo e l&apos;account di gioco che inserisci (nickname, server, Codice amico, classe) sono visibili a tutti:
        cosa vede chi visita il tuo profilo lo spiega l&apos;<Link href={`${PRIVACY.href}#pubblico`}>{PRIVACY.title.it}</Link>.
      </p>

      <h2 id="regole" className="scroll-mt-24">5. Regole della community</h2>
      <p>
        Valgono per tutto quello che scrivi o carichi su Heiki: post, commenti, guide, valutazioni, tier list, profilo, account
        di gioco e schermate per la verifica della classe. Ogni regola ha un numero: se interveniamo, l&apos;avviso dice quale
        regola è stata violata.
      </p>

      <h3 id="r1" className="scroll-mt-24">R1. Rispetta le persone</h3>
      <p>
        Niente insulti, minacce o molestie. Niente odio o discriminazione per origine, religione, genere, orientamento sessuale,
        disabilità o altre caratteristiche di una persona. Critica le idee e le squadre, non chi le propone.
      </p>

      <h3 id="r2" className="scroll-mt-24">R2. Niente dati personali degli altri</h3>
      <p>
        Non pubblicare dati di un&apos;altra persona senza il suo permesso: nome e cognome, indirizzo, telefono, email, foto,
        profili social, il suo Codice amico, i suoi messaggi privati.
      </p>

      <h3 id="r3" className="scroll-mt-24">R3. Niente spam né pubblicità</h3>
      <p>
        Non pubblicare lo stesso messaggio più volte, né messaggi a raffica senza senso o fuori tema. Niente pubblicità, nemmeno
        nascosta (per esempio link che ti fanno guadagnare quando qualcuno compra). Non vendere, comprare o scambiare account
        del gioco.
      </p>

      <h3 id="r4" className="scroll-mt-24">R4. Niente numeri falsi</h3>
      <p>
        Non presentare come veri numeri, risultati o notizie sul gioco che sai falsi: statistiche ritoccate, risultati che non
        hai ottenuto, novità inventate. Sbagliare in buona fede non viola questa regola.
      </p>

      <h3 id="r5" className="scroll-mt-24">R5. Solo materiale che puoi pubblicare</h3>
      <p>
        Non spacciare per tuo il lavoro di altri e non copiare guide, testi, immagini o video di altre persone o di altri siti
        senza il loro permesso. Non mettere link a copie illegali di giochi, film, libri o musica.
      </p>

      <h3 id="r6" className="scroll-mt-24">R6. Niente contenuti illegali o pericolosi</h3>
      <p>
        Niente truffe e niente richieste di password o dati di accesso (di Heiki, del gioco o di altro). Niente programmi
        dannosi o link che li scaricano. Niente istigazione alla violenza, al terrorismo o al suicidio, niente abusi sui minori
        e nessun altro contenuto vietato dalla legge.
      </p>

      <h3 id="r7" className="scroll-mt-24">R7. Niente contenuti per adulti</h3>
      <p>
        Niente contenuti sessuali espliciti e niente violenza mostrata in modo crudo. Su Heiki ci sono anche ragazzi dai {MIN_AGE} anni.
      </p>

      <h3 id="r8" className="scroll-mt-24">R8. Un account, il tuo</h3>
      <p>
        Usa un solo account, e usalo solo tu: non darlo ad altri e non usare quello di qualcun altro. Non fingerti
        un&apos;altra persona, lo staff di Heiki, Netmarble o un altro editore di giochi. Non aprire un altro account per
        aggirare una sospensione.
      </p>

      <h3 id="r9" className="scroll-mt-24">R9. Verifiche oneste</h3>
      <p>Per la verifica della classe carica solo schermate fatte da te, del tuo account di gioco, senza ritocchi.</p>

      <h3 id="r10" className="scroll-mt-24">R10. Non abusare degli strumenti</h3>
      <p>
        Non usare programmi per pubblicare, votare o segnalare in automatico. Non metterti d&apos;accordo con altri per alzare o
        abbassare i voti di un contenuto. Non fare segnalazioni false o per dispetto. Non cercare di entrare in account o parti
        del sito che non sono tuoi, e non cercare di bloccare il sito.
      </p>
      <p>
        Cosa succede se una regola non viene rispettata lo spiega la <a href="#moderazione">sezione 6</a>.
      </p>

      <h2 id="moderazione" className="scroll-mt-24">6. Come moderiamo</h2>

      <h3 id="chi-decide" className="scroll-mt-24">Chi decide</h3>
      <p>
        Su post, commenti, guide dell&apos;Endgame, verifiche e account decidono i moderatori e gli amministratori; sulle guide
        della sezione «Guide e rotazioni» chi ha il ruolo «{roleLabel("EDITOR", "it")}» o superiore. Moderatori,
        amministratori e redattori sono persone autorizzate dal gestore. Le cancellazioni e la chiusura di un account le fa il
        gestore stesso, a mano. Ogni decisione di moderazione la prende una persona: nessun programma nasconde contenuti o
        sospende account da solo.
      </p>

      <h3 id="quando" className="scroll-mt-24">Quando interveniamo</h3>
      <p>
        Quando arriva una segnalazione (dal pulsante «Segnala» o per email) e quando qualcuno dello staff vede da sé un
        contenuto contrario alle regole o alla legge. Post e commenti compaiono subito, senza un controllo prima. Passano invece
        da un controllo prima di comparire:
      </p>
      <ul>
        <li>
          le guide dell&apos;Endgame con un testo: le pubblica o le respinge un moderatore diverso dall&apos;autore (quelle con
          la sola squadra compaiono subito);
        </li>
        <li>
          le guide della sezione «Guide e rotazioni»: le propone chi ha il ruolo «{roleLabel("CONTRIBUTOR", "it")}» e le
          pubblica chi ha il ruolo «{roleLabel("EDITOR", "it")}» o superiore. Chi ha questo ruolo può pubblicare anche le
          proprie guide, senza il controllo di un&apos;altra persona.
        </li>
      </ul>

      <h3 id="misure" className="scroll-mt-24">Le misure</h3>
      <ul>
        <li>
          <strong>Nascondere un post o un commento.</strong> Il post nascosto sparisce dagli elenchi e dalla ricerca, e la sua
          pagina la aprono solo moderatori e amministratori. Il commento nascosto sparisce dalla discussione per tutti.
          Nascondere non cancella: se la decisione era sbagliata, il contenuto torna visibile. Se un commento nascosto non ha
          una segnalazione aperta, lo rimette visibile il gestore, a mano.
        </li>
        <li>
          <strong>Respingere una guida dell&apos;Endgame o una verifica della classe.</strong> Il moderatore scrive il motivo:
          ricevi una notifica, e il motivo lo leggi nella pagina della guida o del tuo account di gioco. Una guida respinta la
          puoi correggere e rimandare.
        </li>
        <li>
          <strong>Togliere dal sito o respingere una guida della sezione «Guide e rotazioni».</strong> Chi ha il ruolo
          «{roleLabel("EDITOR", "it")}» o superiore può archiviare una guida, o rimetterla in bozza o in revisione, anche
          quando è già pubblicata. Una guida non pubblicata la vedono solo l&apos;autore e chi può pubblicare le guide.
        </li>
        <li>
          <strong>Cancellare un contenuto.</strong> Lo fa il gestore, a mano: per i contenuti che dal sito non si possono
          nascondere (valutazioni, tier list, testi del profilo) e per quelli che vanno tolti del tutto, per esempio perché
          illegali.
        </li>
        <li>
          <strong>Sospendere un account</strong>, per un periodo o a tempo indeterminato, con un motivo scritto. Durante la
          sospensione puoi entrare e leggere, ma non puoi pubblicare, commentare, votare, segnalare, seguire, valutare, salvare
          tier list o modificare il profilo e l&apos;account di gioco. Quello che hai già pubblicato resta.
        </li>
        <li>
          <strong>Chiudere un account.</strong> Lo fa il gestore, a mano, quando scopriamo che l&apos;account è di una persona
          con meno di {MIN_AGE} anni (<a href="#account">sezione 3</a>).
        </li>
      </ul>
      <p>
        Scegliamo la misura in proporzione alla violazione, allo stesso modo per tutti e rispettando la libertà di espressione
        (art. 14 del Reg. UE 2022/2065, il Regolamento europeo sui servizi digitali, che qui chiamiamo DSA). Per una violazione
        che riguarda un solo contenuto, togliamo quel contenuto. Per violazioni gravi (per esempio minacce, contenuti illegali,
        dati personali di altri) o ripetute sospendiamo anche l&apos;account, più a lungo quanto più sono gravi o frequenti. La
        sospensione a tempo indeterminato è per le violazioni più gravi e per chi continua dopo una sospensione.
      </p>
      <p>
        Il registro della moderazione tiene per {RETENTION.moderationLogMonths} mesi chi ha deciso, su cosa e quando. Ci
        finiscono:
      </p>
      <ul>
        <li>
          le decisioni che moderatori e amministratori prendono nel sito: nascondere un contenuto o rimetterlo visibile,
          chiudere una segnalazione, sospendere un account o togliere la sospensione, decidere su guide dell&apos;Endgame e
          verifiche, cambiare il ruolo di qualcuno;
        </li>
        <li>
          le scelte di chi ha il ruolo «{roleLabel("EDITOR", "it")}» o superiore sulle guide degli altri: pubblicarle,
          archiviarle, rimetterle in bozza o in revisione.
        </li>
      </ul>
      <p>
        Non ci finiscono le correzioni al testo delle guide, che stanno nell&apos;elenco pubblico delle modifiche sotto ogni
        guida, né le cancellazioni e i cambi di ruolo che il gestore fa a mano, fuori dal sito.
      </p>

      <h3 id="automatici" className="scroll-mt-24">Strumenti automatici</h3>
      <p>
        I controlli automatici sono di tre tipi. Fermano un&apos;azione nel momento in cui la fai e ti dicono perché; non
        nascondono contenuti e non sospendono account.
      </p>
      <ul>
        <li>
          Limiti di quantità: quante azioni dello stesso tipo puoi fare in poco tempo (post, commenti, voti, segnalazioni,
          persone seguite, valutazioni, verifiche) e quante tier list puoi salvare per ogni gioco. Quando arrivi a un limite il
          sito ti dice perché e, se devi aspettare, quanto.
        </li>
        <li>
          Controlli sui moduli: per esempio la lunghezza dei testi, i caratteri invisibili nei nomi, i nomi riservati o che
          imitano lo staff («admin», «moderatore»).
        </li>
        <li>
          Per la verifica della classe il sito confronta l&apos;impronta della schermata (un codice ricavato dal file, da cui
          l&apos;immagine non si ricostruisce) con quelle già caricate, e rifiuta un&apos;immagine già usata da un altro account
          o in un altro giorno.
        </li>
      </ul>

      <h3 id="avviso" className="scroll-mt-24">L&apos;avviso con il motivo</h3>
      <p>
        Quando nascondiamo un tuo contenuto, respingiamo una tua guida o una tua verifica della classe, togliamo dal sito una
        tua guida o sospendiamo il tuo account, ricevi un avviso nelle tue <Link href="/notifiche">notifiche</Link> (art. 17
        DSA). Se il gestore cancella un tuo contenuto o chiude il tuo account, ti scrive all&apos;email del tuo account.
        L&apos;avviso dice:
      </p>
      <ul>
        <li>quale misura abbiamo preso e, se ha una durata, fino a quando;</li>
        <li>quale contenuto o comportamento riguarda, e i fatti;</li>
        <li>se è partita da una segnalazione o da un controllo dello staff;</li>
        <li>se sono stati usati strumenti automatici;</li>
        <li>quale regola di questi Termini (R1, R2 e così via) o quale legge è stata violata, e perché;</li>
        <li>come contestare la decisione.</li>
      </ul>
      <p>Il nome di chi ha segnalato non lo diciamo, tranne quando è strettamente necessario.</p>

      <h3 id="riesame" className="scroll-mt-24">Se non sei d&apos;accordo</h3>
      <p>
        Puoi chiedere un riesame della decisione, gratis, scrivendo al gestore. Vale anche se hai segnalato un contenuto e non
        sei d&apos;accordo con com&apos;è finita. Una persona dello staff riguarda la decisione e ti risponde con l&apos;esito
        e il motivo. Se hai ragione, annulliamo la decisione: un contenuto nascosto torna visibile, una sospensione finisce.
      </p>
      <EmailTemplate
        locale="it"
        subject={RIESAME.it.subject}
        body={RIESAME.it.body}
        action="Scrivi la richiesta di riesame"
      />
      <p>
        Puoi sempre rivolgerti anche a un giudice. Se pensi che Heiki non rispetti il DSA, per esempio perché non hai ricevuto
        l&apos;avviso con il motivo, puoi presentare un reclamo al Coordinatore dei servizi digitali del paese
        dell&apos;Unione europea in cui vivi: è l&apos;autorità che controlla che i siti rispettino il DSA (art. 53 DSA). In
        Italia è l&apos;AGCOM, l&apos;Autorità per le garanzie nelle comunicazioni:{" "}
        <a href="https://www.agcom.it">www.agcom.it</a>. Il reclamo riguarda il rispetto delle regole: non annulla una singola
        decisione su un contenuto o su un account.
      </p>

      <h3 id="autorita" className="scroll-mt-24">Pericoli per le persone e ordini delle autorità</h3>
      <p>
        Se un contenuto fa pensare a un reato che mette in pericolo la vita o la sicurezza di qualcuno, avvisiamo subito le
        autorità (art. 18 DSA). Se un giudice o un&apos;altra autorità ci ordina di togliere un contenuto o di dare
        informazioni su un utente, eseguiamo l&apos;ordine e lo diciamo all&apos;utente interessato quando lo eseguiamo,
        oppure nel momento che l&apos;autorità indica nell&apos;ordine (artt. 9 e 10 DSA).
      </p>

      <h2 id="segnalare" className="scroll-mt-24">7. Segnalare un contenuto</h2>
      <p>Se vedi un contenuto che viola queste regole o la legge, puoi segnalarlo in due modi.</p>
      <ul>
        <li>
          <strong>Con il pulsante «Segnala»</strong> sotto un post (anche una guida dell&apos;Endgame) o un commento: scegli il
          motivo e aggiungi i dettagli. Serve un account non sospeso. I moderatori vedono chi ha segnalato, la persona
          segnalata no. Con il pulsante non ricevi l&apos;esito.
        </li>
        <li>
          <strong>Per email</strong>, anche senza account: per tutto il resto (guide della sezione «Guide e rotazioni»,
          valutazioni, tier list, profili) e quando vuoi sapere com&apos;è finita.
        </li>
      </ul>
      <p>
        Cosa scrivere nell&apos;email, con un testo già pronto, e cosa succede dopo lo spiega la pagina{" "}
        <Link href={`${COPYRIGHT.href}#cosa-scrivere`}>{COPYRIGHT.title.it}</Link>: vale per qualsiasi contenuto illegale, non solo per il
        diritto d&apos;autore. Le segnalazioni false o fatte per dispetto violano la regola <a href="#r10">R10</a>.
      </p>

      <h2 id="giochi" className="scroll-mt-24">8. Contenuti dei giochi</h2>
      <p>
        Su Heiki trovi immagini, testi e dati di The Seven Deadly Sins: Grand Cross. Non sono nostri: appartengono ai
        rispettivi titolari, cioè Netmarble per il gioco; Nakaba Suzuki e Kodansha per l&apos;opera originale; i comitati di
        produzione per le serie animate; i titolari delle opere da cui vengono gli eroi delle collaborazioni. Heiki non è
        affiliato a loro e non è sponsorizzato né approvato da loro.
      </p>
      <p>
        Questi Termini quindi non ti danno nessun diritto su quei contenuti. Chi sono i titolari e perché li mostriamo lo
        spiegano le <Link href={NOTE_LEGALI.href}>{NOTE_LEGALI.title.it}</Link>. Se sei un titolare e vuoi che togliamo
        qualcosa, scrivici come spiega la pagina <Link href={`${COPYRIGHT.href}#titolari`}>{COPYRIGHT.title.it}</Link>: ti rispondiamo
        entro {RIGHTS_RESPONSE_WORKING_DAYS} giorni lavorativi.
      </p>

      <h2 id="dati" className="scroll-mt-24">9. Dati e calcoli</h2>
      <p>Facciamo attenzione, ma schede, statistiche, calcoli e date possono essere sbagliati o vecchi:</p>
      <ul>
        <li>il gioco cambia a ogni aggiornamento, e i dati su Heiki si aggiornano dopo;</li>
        <li>
          leggere i file del gioco può portare a errori, e quando un valore non è nei file e lo mostriamo lo stesso, è una
          stima;
        </li>
        <li>i calcolatori seguono le regole del gioco come le capiamo noi, e possono dare numeri diversi da quelli del gioco;</li>
        <li>le date d&apos;uscita sono quelle del foglio della community e possono cambiare;</li>
        <li>tier list e valutazioni degli utenti sono opinioni.</li>
      </ul>
      <p>Prima di spendere risorse nel gioco basandoti su Heiki, controlla nel gioco. Se trovi un errore, scrivici.</p>

      <h2 id="servizio" className="scroll-mt-24">10. Il servizio e i suoi cambiamenti</h2>
      <p>
        Heiki è gratuito. Cambia nel tempo: aggiungiamo, modifichiamo o togliamo funzioni e giochi, per esempio quando il
        gioco cambia, per un obbligo di legge, per sicurezza o perché una funzione non serve più. Può fermarsi per
        manutenzione o per un guasto, anche senza preavviso.
      </p>
      <p>
        Se togliamo una funzione in cui hai salvato dei dati, o se chiudiamo Heiki, lo annunciamo prima nel sito, così hai il
        tempo di salvare quello che ti serve (per esempio le tue tier list, che puoi scaricare in un file).
      </p>

      <h2 id="responsabilita" className="scroll-mt-24">11. Responsabilità</h2>
      <p>Heiki è gratuito e non garantiamo che sia sempre raggiungibile, senza interruzioni o senza errori.</p>
      <p>
        Di quello che pubblicano gli utenti risponde chi lo pubblica. Heiki non ne risponde finché non sa che un contenuto è
        illegale; quando lo viene a sapere, anche da una segnalazione precisa, lo toglie senza ritardo (art. 6 DSA). Heiki non
        ha l&apos;obbligo di controllare tutto quello che si pubblica (art. 8 DSA). Questo vale solo per i contenuti degli
        utenti: delle schede, dei dati e delle guide della sezione «Guide e rotazioni» rispondiamo noi.
      </p>
      <p>
        Non rispondiamo dei danni causati da errori nei dati o nei calcoli o da un&apos;interruzione del servizio, tranne
        quando il danno l&apos;abbiamo causato apposta o per una negligenza grave (dolo o colpa grave, art. 1229 c.c.).
        Restano sempre i diritti che la legge dà ai consumatori e che un contratto non può togliere.
      </p>

      <h2 id="chiusura" className="scroll-mt-24">12. Chiusura dell&apos;account</h2>
      <p>
        Puoi eliminare il tuo account quando vuoi, dalle <Link href="/impostazioni/account">Impostazioni dell&apos;account</Link>:
        scrivi <code>{DELETE_PHRASES.it}</code> e confermi con la password.
        {oauth.length > 0
          ? ` Se entri solo con ${inFrase(oauth, "o")} non hai una password: esci, rientra con ${inFrase(oauth, "o")} e da quel momento hai ${RECENT_AUTH_MINUTES} minuti per eliminare l'account.`
          : ""}{" "}
        Chi ha il ruolo «{roleLabel("MODERATOR", "it")}» o «{roleLabel("ADMIN", "it")}» deve prima farsi togliere il ruolo.
      </p>
      <p>
        Si cancellano subito profilo, account di gioco, voti, valutazioni, tier list, chi segui e chi ti segue, notifiche e
        segnalazioni fatte. Restano post, commenti e guide, con «Account eliminato» come autore. Cosa resta ancora per un
        po&apos;, per esempio nelle copie di sicurezza, lo spiega l&apos;
        <Link href={`${PRIVACY.href}#eliminazione`}>{PRIVACY.title.it}</Link>.
      </p>
      <p>
        Da parte nostra: se violi le regole in modo grave o ripetuto sospendiamo il tuo account, per un periodo o a tempo
        indeterminato (<a href="#moderazione">sezione 6</a>), e chiudiamo l&apos;account di chi ha meno di {MIN_AGE} anni (<a href="#account">sezione 3</a>).
      </p>

      <h2 id="modifiche" className="scroll-mt-24">13. Se cambiano i Termini</h2>
      <p>Cambiamo questi Termini solo per uno di questi motivi:</p>
      <ul>
        <li>una legge nuova, o la decisione di un giudice o di un&apos;autorità;</li>
        <li>una funzione o un gioco che aggiungiamo, cambiamo o togliamo;</li>
        <li>un problema di sicurezza o di abusi;</li>
        <li>una regola da scrivere in modo più chiaro.</li>
      </ul>
      <p>
        Quando li cambiamo aggiorniamo la data in cima alla pagina. Se il cambiamento è importante, per esempio una regola nuova
        o un cambiamento a quello che puoi fare con il tuo account, mettiamo un avviso nel sito prima che valga (art. 14 DSA).
        Se non sei d&apos;accordo, puoi eliminare l&apos;account quando vuoi (<a href="#chiusura">sezione 12</a>).
      </p>

      <h2 id="legge" className="scroll-mt-24">14. Legge applicabile e foro</h2>
      <p>
        Questi Termini seguono la legge italiana. Se sei un consumatore (usi Heiki per te, non per un&apos;attività
        professionale), restano le tutele del paese in cui vivi che un contratto non può togliere (art. 6 Reg. CE 593/2008).
      </p>
      <p>
        Per una causa con un consumatore che vive in Italia decide il giudice del luogo in cui il consumatore vive o ha
        domicilio (artt. 33, comma 2, lettera u, e 66-bis del Codice del consumo). Se vivi in un altro paese dell&apos;Unione
        europea, puoi fare causa anche davanti ai giudici del tuo paese (artt. 17-19 Reg. UE 1215/2012).
      </p>

      <h2 id="contatti" className="scroll-mt-24">15. Contatti</h2>
      <p>
        Per qualsiasi cosa (domande, segnalazioni, riesami, i tuoi dati, richieste dei titolari dei diritti) scrivi a{" "}
        <ContactEmail locale="it" />. È anche il punto di contatto unico per gli utenti e per le autorità (artt. 11 e 12
        DSA). Ti risponde una persona, non un programma, in italiano o in inglese.
      </p>
    </>
  );
}

function TerminiEn({ oauth }: DocProps) {
  return (
    <>
      <PageHeader title={TERMINI.title.en}>
        The rules for using Heiki: what you can do, what you can&apos;t, and what happens when a rule is broken.
      </PageHeader>
      <LastUpdated document="termini" locale="en" />

      <Summary title="In short">
        <ul>
          <li>Heiki is a free, unofficial fan site: it doesn&apos;t belong to Netmarble or to any other game publisher.</li>
          <li>
            Reading doesn&apos;t require an account. To write you need one, and to open it you must be at least {MIN_AGE} years
            old.
          </li>
          <li>
            What you publish stays yours, and you give us permission to show it on Heiki. Posts, comments and guides stay even
            after you delete your account, with “Account eliminato” (“deleted account”) in place of your name.
          </li>
          <li>
            The <a href="#regole">community rules</a> are numbered (R1, R2 and so on): no insults, no other people&apos;s
            personal data, no spam, no false numbers, no copied material, no illegal content.
          </li>
          <li>
            Hiding content, rejecting a guide or a verification and suspending an account are always decided by a person, not
            a program. If we do this to your content or your account, we tell you what we did, why, and how to contest it.
          </li>
          <li>Data and calculations can be wrong or out of date: check before you spend resources in the game.</li>
          <li>
            To report something, contest a decision or ask anything, write to <ContactEmail locale="en" />.
          </li>
        </ul>
      </Summary>

      <h2 id="gestore" className="scroll-mt-24">1. Who provides the service</h2>
      <p>Heiki is a service of the company shown below. In these Terms, “we” and “the operator” mean this company.</p>
      <OperatorDetails locale="en" />
      <p>
        These Terms apply to anyone who uses Heiki. When you create an account you accept them, and from then on they are the
        contract between you and us. They exist in Italian and in English, with the same content.
      </p>

      <h2 id="heiki" className="scroll-mt-24">2. What Heiki is</h2>
      <p>
        Heiki is a free, unofficial fan site about gacha games. Today it covers one game, The Seven Deadly Sins: Grand Cross by
        Netmarble; others are announced on the home page, for now by name only. You&apos;ll find hero pages, calculation tools,
        tier lists, guides and a community where you can talk about the game.
      </p>
      <ul>
        <li>Hero pages and data come from the game&apos;s files: its tables and texts, read with our own programs.</li>
        <li>
          Hero release dates come from a spreadsheet kept by players in the community: the{" "}
          <Link href="/grand-cross/uscite">Releases</Link> page says which one.
        </li>
        <li>
          None of this is official. Heiki is not affiliated with Netmarble or with the other rights holders of the games, and
          is not sponsored or endorsed by them (<a href="#giochi">section 8</a>).
        </li>
      </ul>

      <h2 id="account" className="scroll-mt-24">3. Who can use it, and your account</h2>
      <p>
        Reading Heiki doesn&apos;t require an account. To post, comment, vote, report or save data to your profile you need an
        account.
      </p>
      <ul>
        <li>
          <strong>Age.</strong> To open an account you must be at least {MIN_AGE} years old. If we find out that an account
          belongs to someone under {MIN_AGE}, the operator closes it by hand and deletes its data.
        </li>
        <li>
          <strong>Signing up.</strong> You sign up with an email and a password
          {oauth.length > 0 ? `, or with your ${inFrase(oauth, "or")} account` : ""}.
        </li>
        <li>
          <strong>One account per person.</strong> Your account is yours: don&apos;t give it to anyone else and don&apos;t use
          someone else&apos;s (rule <a href="#r8">R8</a>).
        </li>
        <li>
          <strong>Password.</strong> Keep it to yourself. If you think someone has got into your account, change your password
          (if you use one) from <Link href="/impostazioni/account">Account settings</Link> and write to us.
        </li>
        <li>
          <strong>The game.</strong> Heiki never asks for the password or login details of your game account. For your game
          account on Heiki, nickname, server and Friend Code are enough, and they can&apos;t be used to log into the game. If
          someone asks for your login details on Heiki&apos;s behalf, it isn&apos;t us: don&apos;t give them.
        </li>
      </ul>

      <h2 id="contenuti" className="scroll-mt-24">4. What you publish</h2>
      <p>
        Posts, comments, guides (those in the “Guides and rotations” section and Endgame guides), hero ratings, tier lists and
        your profile remain yours. Only publish things you have the right to publish and that follow the{" "}
        <a href="#regole">rules in section 5</a>: you are responsible for what you publish.
      </p>
      <p>By publishing, you give us a free, non-exclusive permission (a licence):</p>
      <ul>
        <li>
          to store your content and show it on Heiki: on its own page, in lists, in search, on your profile and on the home
          page;
        </li>
        <li>to show its title and first lines in link previews, when someone shares a Heiki address;</li>
        <li>
          to keep showing posts, comments and guides after you delete your account: they stay, with “Account eliminato”
          (Italian for “deleted account”) as the author instead of your name;
        </li>
        <li>
          for guides in the “Guides and rotations” section, also to edit them: anyone with the “{roleLabel("EDITOR", "en")}”
          role or above can correct the title and text of other people&apos;s guides, and every guide shows a public list of
          its changes.
        </li>
      </ul>
      <p>“Non-exclusive” means you can publish the same things elsewhere too.</p>
      <p>What you can change yourself:</p>
      <ul>
        <li>ratings and tier lists: you can edit and delete them whenever you want, except during a suspension;</li>
        <li>guides: you can edit them but not delete them; if you change the text of a guide that was already published, it goes back to review;</li>
        <li>posts and comments: once published, they can&apos;t be edited or deleted from the site.</li>
      </ul>
      <p>
        To remove one of your posts, comments or guides, write to us (<a href="#contatti">section 15</a>): we delete it.
      </p>
      <p>
        Your profile and the game account you enter (nickname, server, Friend Code, class) are visible to everyone too: the{" "}
        <Link href={`${PRIVACY.href}#pubblico`}>{PRIVACY.title.en}</Link> explains what visitors to your profile see.
      </p>

      <h2 id="regole" className="scroll-mt-24">5. Community rules</h2>
      <p>
        They apply to everything you write or upload on Heiki: posts, comments, guides, ratings, tier lists, your profile, your
        game account and screenshots for the class verification. Each rule has a number: if we act, the notice says which rule
        was broken.
      </p>

      <h3 id="r1" className="scroll-mt-24">R1. Respect people</h3>
      <p>
        No insults, threats or harassment. No hatred or discrimination based on origin, religion, gender, sexual orientation,
        disability or any other characteristic of a person. Criticise ideas and teams, not the people who suggest them.
      </p>

      <h3 id="r2" className="scroll-mt-24">R2. No other people&apos;s personal data</h3>
      <p>
        Don&apos;t publish another person&apos;s data without their permission: full name, address, phone number, email,
        photos, social media profiles, their Friend Code, their private messages.
      </p>

      <h3 id="r3" className="scroll-mt-24">R3. No spam or advertising</h3>
      <p>
        Don&apos;t post the same message over and over, or strings of meaningless or off-topic messages. No advertising, not
        even hidden advertising (for example links that earn you money when someone buys something). Don&apos;t sell, buy or
        trade game accounts.
      </p>

      <h3 id="r4" className="scroll-mt-24">R4. No false numbers</h3>
      <p>
        Don&apos;t present as true any numbers, results or news about the game that you know are false: edited stats, results
        you didn&apos;t get, made-up news. Getting something wrong in good faith doesn&apos;t break this rule.
      </p>

      <h3 id="r5" className="scroll-mt-24">R5. Only material you may publish</h3>
      <p>
        Don&apos;t pass off other people&apos;s work as your own, and don&apos;t copy guides, texts, images or videos from
        other people or other sites without their permission. Don&apos;t post links to illegal copies of games, films, books or
        music.
      </p>

      <h3 id="r6" className="scroll-mt-24">R6. No illegal or dangerous content</h3>
      <p>
        No scams and no requests for passwords or login details (for Heiki, the game or anything else). No malicious software
        or links that download it. No incitement to violence, terrorism or suicide, no child abuse, and no other content that
        the law forbids.
      </p>

      <h3 id="r7" className="scroll-mt-24">R7. No adult content</h3>
      <p>
        No explicit sexual content and no graphic violence. Heiki is also used by teenagers from the age of {MIN_AGE}.
      </p>

      <h3 id="r8" className="scroll-mt-24">R8. One account, your own</h3>
      <p>
        Use only one account, and keep it to yourself: don&apos;t give it to anyone else and don&apos;t use someone
        else&apos;s. Don&apos;t pretend to be someone else, Heiki&apos;s staff, Netmarble or another game publisher. Don&apos;t
        open another account to get around a suspension.
      </p>

      <h3 id="r9" className="scroll-mt-24">R9. Honest verifications</h3>
      <p>For the class verification, only upload screenshots you took yourself, of your own game account, without edits.</p>

      <h3 id="r10" className="scroll-mt-24">R10. Don&apos;t abuse the tools</h3>
      <p>
        Don&apos;t use programs to post, vote or report automatically. Don&apos;t team up with others to push a piece of
        content&apos;s votes up or down. Don&apos;t make false or spiteful reports. Don&apos;t try to get into accounts or parts
        of the site that aren&apos;t yours, and don&apos;t try to bring the site down.
      </p>
      <p>
        What happens when a rule is broken is explained in <a href="#moderazione">section 6</a>.
      </p>

      <h2 id="moderazione" className="scroll-mt-24">6. How we moderate</h2>

      <h3 id="chi-decide" className="scroll-mt-24">Who decides</h3>
      <p>
        Moderators and administrators decide on posts, comments, Endgame guides, verifications and accounts; anyone with the
        “{roleLabel("EDITOR", "en")}” role or above decides on guides in the “Guides and rotations” section. Moderators,
        administrators and editors are people authorised by the operator. Deletions and account closures are done by the
        operator directly, by hand. Every moderation decision is made by a person: no program hides content or suspends
        accounts on its own.
      </p>

      <h3 id="quando" className="scroll-mt-24">When we act</h3>
      <p>
        When a report comes in (from the “Report” button or by email) and when someone on the staff notices content that
        breaks the rules or the law. Posts and comments appear straight away, without a check beforehand. These, instead, are
        checked before they appear:
      </p>
      <ul>
        <li>
          Endgame guides with text: a moderator other than the author publishes or rejects them (those with only a team appear
          straight away);
        </li>
        <li>
          guides in the “Guides and rotations” section: people with the “{roleLabel("CONTRIBUTOR", "en")}” role propose them,
          and people with the “{roleLabel("EDITOR", "en")}” role or above publish them. People with that role can also publish
          their own guides, without anyone else checking them.
        </li>
      </ul>

      <h3 id="misure" className="scroll-mt-24">The measures</h3>
      <ul>
        <li>
          <strong>Hiding a post or a comment.</strong> A hidden post disappears from lists and search, and only moderators and
          administrators can open its page. A hidden comment disappears from the discussion for everyone. Hiding doesn&apos;t
          delete: if the decision was wrong, the content becomes visible again. If a hidden comment has no open report, the
          operator makes it visible again by hand.
        </li>
        <li>
          <strong>Rejecting an Endgame guide or a class verification.</strong> The moderator writes the reason: you get a
          notification, and you can read the reason on the page of the guide or of your game account. You can correct a
          rejected guide and send it again.
        </li>
        <li>
          <strong>Taking a guide in the “Guides and rotations” section off the site, or rejecting it.</strong> Anyone with the
          “{roleLabel("EDITOR", "en")}” role or above can archive a guide, or put it back into draft or review, even when it is
          already published. A guide that isn&apos;t published can only be seen by its author and by the people who can publish
          guides.
        </li>
        <li>
          <strong>Deleting content.</strong> The operator does this by hand: for content that can&apos;t be hidden from the
          site (ratings, tier lists, profile texts) and for content that has to be removed entirely, for example because it is
          illegal.
        </li>
        <li>
          <strong>Suspending an account</strong>, for a set period or indefinitely, with a written reason. While suspended you
          can log in and read, but you can&apos;t post, comment, vote, report, follow, rate, save tier lists or edit your
          profile and game account. What you have already published stays.
        </li>
        <li>
          <strong>Closing an account.</strong> The operator does this by hand when we find out that the account belongs to
          someone under {MIN_AGE} (<a href="#account">section 3</a>).
        </li>
      </ul>
      <p>
        We choose the measure in proportion to the violation, in the same way for everyone and respecting freedom of
        expression (Art. 14 of Regulation (EU) 2022/2065, the European Digital Services Act, which we call DSA here). For a
        violation that concerns a single piece of content, we remove that content. For serious violations (for example
        threats, illegal content, other people&apos;s personal data) or repeated ones, we also suspend the account, for longer
        the more serious or frequent they are. Indefinite suspension is for the most serious violations and for people who
        carry on after a suspension.
      </p>
      <p>
        The moderation log keeps who decided, on what, and when, for {RETENTION.moderationLogMonths} months. It records:
      </p>
      <ul>
        <li>
          the decisions moderators and administrators take on the site: hiding content or making it visible again, closing a
          report, suspending an account or lifting the suspension, deciding on Endgame guides and verifications, changing
          someone&apos;s role;
        </li>
        <li>
          the choices made by people with the “{roleLabel("EDITOR", "en")}” role or above about other people&apos;s guides:
          publishing them, archiving them, putting them back into draft or review.
        </li>
      </ul>
      <p>
        It doesn&apos;t record corrections to the text of guides, which are in the public list of changes under each guide, or
        the deletions and role changes that the operator makes by hand, outside the site.
      </p>

      <h3 id="automatici" className="scroll-mt-24">Automated tools</h3>
      <p>
        The automatic checks are of three kinds. They stop an action the moment you try it and tell you why; they don&apos;t
        hide content and don&apos;t suspend accounts.
      </p>
      <ul>
        <li>
          Quantity limits: how many actions of the same kind you can take in a short time (posts, comments, votes, reports,
          follows, ratings, verifications) and how many tier lists you can save for each game. When you reach a limit, the site
          tells you why and, if you need to wait, for how long.
        </li>
        <li>
          Form checks: for example text length, invisible characters in names, and names that are reserved or imitate the
          staff (“admin”, “moderator”).
        </li>
        <li>
          For the class verification, the site compares the screenshot&apos;s fingerprint (a code computed from the file, from
          which the image can&apos;t be rebuilt) with those already uploaded, and refuses an image already used by another
          account or on another day.
        </li>
      </ul>

      <h3 id="avviso" className="scroll-mt-24">The notice with the reasons</h3>
      <p>
        When we hide one of your pieces of content, reject one of your guides or class verifications, take one of your guides
        off the site or suspend your account, you get a notice in your <Link href="/notifiche">notifications</Link> (Art. 17
        DSA). If the operator deletes your content or closes your account, they write to the email address of your account.
        The notice says:
      </p>
      <ul>
        <li>which measure we took and, if it has a duration, until when;</li>
        <li>which content or behaviour it concerns, and the facts;</li>
        <li>whether it started from a report or from a staff check;</li>
        <li>whether automated tools were used;</li>
        <li>which rule of these Terms (R1, R2 and so on) or which law was broken, and why;</li>
        <li>how to contest the decision.</li>
      </ul>
      <p>We don&apos;t give the name of the person who reported, except when strictly necessary.</p>

      <h3 id="riesame" className="scroll-mt-24">If you disagree</h3>
      <p>
        You can ask for a review of the decision, free of charge, by writing to the operator. This also applies if you
        reported content and disagree with the outcome. A person on the staff looks at the decision again and replies with the
        outcome and the reason. If you are right, we reverse the decision: hidden content becomes visible again, a suspension
        ends.
      </p>
      <EmailTemplate
        locale="en"
        subject={RIESAME.en.subject}
        body={RIESAME.en.body}
        action="Write the review request"
      />
      <p>
        You can always go to a court as well. If you think Heiki doesn&apos;t comply with the DSA, for example because you
        didn&apos;t get the notice with the reasons, you can file a complaint with the Digital Services Coordinator of the EU
        country you live in: the authority that checks that sites comply with the DSA (Art. 53 DSA). In Italy that is AGCOM,
        the Italian communications authority: <a href="https://www.agcom.it">www.agcom.it</a>. The complaint is about
        compliance with the rules: it does not overturn a single decision about content or an account.
      </p>

      <h3 id="autorita" className="scroll-mt-24">Danger to people and orders from authorities</h3>
      <p>
        If content suggests a crime that puts someone&apos;s life or safety at risk, we inform the authorities straight away
        (Art. 18 DSA). If a court or another authority orders us to remove content or to provide information about a user, we
        carry out the order and tell the user concerned when we carry it out, or at the time the authority sets in its order
        (Arts. 9 and 10 DSA).
      </p>

      <h2 id="segnalare" className="scroll-mt-24">7. Reporting content</h2>
      <p>If you see content that breaks these rules or the law, you can report it in two ways.</p>
      <ul>
        <li>
          <strong>With the “Report” button</strong> under a post (Endgame guides included) or a comment: choose the reason and
          add details. You need an account that isn&apos;t suspended. Moderators see who reported, the reported person
          doesn&apos;t. With the button you don&apos;t receive the outcome.
        </li>
        <li>
          <strong>By email</strong>, even without an account: for everything else (guides in the “Guides and rotations”
          section, ratings, tier lists, profiles) and when you want to know the outcome.
        </li>
      </ul>
      <p>
        What to write in the email, with a ready-made text, and what happens next is explained on the{" "}
        <Link href={`${COPYRIGHT.href}#cosa-scrivere`}>{COPYRIGHT.title.en}</Link> page: it covers any illegal content, not just copyright. False
        or spiteful reports break rule <a href="#r10">R10</a>.
      </p>

      <h2 id="giochi" className="scroll-mt-24">8. Game content</h2>
      <p>
        On Heiki you&apos;ll find images, texts and data from The Seven Deadly Sins: Grand Cross. They aren&apos;t ours: they
        belong to their respective rights holders, namely Netmarble for the game; Nakaba Suzuki and Kodansha for the original
        work; the production committees for the anime series; the rights holders of the works the collaboration heroes come
        from.
        Heiki is not affiliated with them and is not sponsored or endorsed by them.
      </p>
      <p>
        So these Terms don&apos;t give you any rights over that content. The{" "}
        <Link href={NOTE_LEGALI.href}>{NOTE_LEGALI.title.en}</Link> explains who the rights holders are and why we show this
        content. If you are a rights holder and want us to remove something, write to us as explained on the{" "}
        <Link href={`${COPYRIGHT.href}#titolari`}>{COPYRIGHT.title.en}</Link> page: we reply within {RIGHTS_RESPONSE_WORKING_DAYS} working
        days.
      </p>

      <h2 id="dati" className="scroll-mt-24">9. Data and calculations</h2>
      <p>We are careful, but hero pages, stats, calculations and dates can be wrong or out of date:</p>
      <ul>
        <li>the game changes with every update, and the data on Heiki is updated afterwards;</li>
        <li>
          reading the game&apos;s files can introduce errors, and when a value isn&apos;t in the files and we show it anyway,
          it is an estimate;
        </li>
        <li>the calculators follow the game&apos;s rules as we understand them, and can give numbers that differ from the game&apos;s;</li>
        <li>release dates are those of the community spreadsheet and can change;</li>
        <li>users&apos; tier lists and ratings are opinions.</li>
      </ul>
      <p>Before spending resources in the game based on Heiki, check in the game. If you find a mistake, write to us.</p>

      <h2 id="servizio" className="scroll-mt-24">10. The service and how it changes</h2>
      <p>
        Heiki is free. It changes over time: we add, change or remove features and games, for example when the game changes,
        because of a legal obligation, for security, or because a feature is no longer needed. It can stop for maintenance or
        because of a fault, even without notice.
      </p>
      <p>
        If we remove a feature where you have saved data, or if we close Heiki, we announce it on the site beforehand, so you
        have time to save what you need (for example your tier lists, which you can download as a file).
      </p>

      <h2 id="responsabilita" className="scroll-mt-24">11. Liability</h2>
      <p>Heiki is free, and we don&apos;t guarantee that it is always reachable, uninterrupted or free of errors.</p>
      <p>
        Whoever publishes content is responsible for it. Heiki is not liable for users&apos; content until it knows that the
        content is illegal; once it knows, including from a precise report, it removes it without delay (Art. 6 DSA). Heiki
        has no obligation to check everything that is published (Art. 8 DSA). This only applies to users&apos; content: we are
        responsible for the hero pages, the data and the guides in the “Guides and rotations” section.
      </p>
      <p>
        We are not liable for damage caused by errors in data or calculations or by an interruption of the service, except
        when we caused the damage on purpose or through serious negligence (wilful misconduct or gross negligence, Art. 1229
        of the Italian Civil Code). The rights that the law gives consumers and that a contract cannot take away always
        remain.
      </p>

      <h2 id="chiusura" className="scroll-mt-24">12. Closing your account</h2>
      <p>
        You can delete your account whenever you want, from <Link href="/impostazioni/account">Account settings</Link>: type{" "}
        <code>{DELETE_PHRASES.en}</code> and confirm with your password.
        {oauth.length > 0
          ? ` If you only sign in with ${inFrase(oauth, "or")} you have no password: sign out, sign in again with ${inFrase(oauth, "or")}, and from then on you have ${RECENT_AUTH_MINUTES} minutes to delete the account.`
          : ""}{" "}
        Anyone with the “{roleLabel("MODERATOR", "en")}” or “{roleLabel("ADMIN", "en")}” role must first have the role
        removed.
      </p>
      <p>
        Your profile, game account, votes, ratings, tier lists, who you follow and who follows you, notifications and the
        reports you made are deleted immediately. Posts, comments and guides stay, with “Account eliminato” as the author.
        What remains for a while longer, for example in backup copies, is explained in the{" "}
        <Link href={`${PRIVACY.href}#eliminazione`}>{PRIVACY.title.en}</Link>.
      </p>
      <p>
        On our side: if you break the rules seriously or repeatedly, we suspend your account, for a set period or indefinitely
        (<a href="#moderazione">section 6</a>), and we close the accounts of people under {MIN_AGE} (<a href="#account">section 3</a>).
      </p>

      <h2 id="modifiche" className="scroll-mt-24">13. If these Terms change</h2>
      <p>We only change these Terms for one of these reasons:</p>
      <ul>
        <li>a new law, or a decision by a court or an authority;</li>
        <li>a feature or a game that we add, change or remove;</li>
        <li>a security or abuse problem;</li>
        <li>a rule that needs to be worded more clearly.</li>
      </ul>
      <p>
        When we change them we update the date at the top of the page. If the change is important, for example a new rule or a
        change to what you can do with your account, we put a notice on the site before it applies (Art. 14 DSA). If you
        don&apos;t agree, you can delete your account at any time (<a href="#chiusura">section 12</a>).
      </p>

      <h2 id="legge" className="scroll-mt-24">14. Governing law and courts</h2>
      <p>
        These Terms are governed by Italian law. If you are a consumer (you use Heiki for yourself, not for a business or a
        profession), you keep the protections of the country you live in that a contract cannot take away (Art. 6 of
        Regulation (EC) 593/2008).
      </p>
      <p>
        For a dispute with a consumer who lives in Italy, the court of the place where the consumer lives or is domiciled
        decides (Arts. 33(2)(u) and 66-bis of the Italian Consumer Code). If you live in another EU country, you can also take
        legal action before the courts of your own country (Arts. 17-19 of Regulation (EU) 1215/2012).
      </p>

      <h2 id="contatti" className="scroll-mt-24">15. Contact</h2>
      <p>
        For anything (questions, reports, review requests, your data, requests from rights holders) write to{" "}
        <ContactEmail locale="en" />. It is also the single point of contact for users and for authorities (Arts. 11 and 12
        DSA). A person replies, not a program, in Italian or English.
      </p>
    </>
  );
}
