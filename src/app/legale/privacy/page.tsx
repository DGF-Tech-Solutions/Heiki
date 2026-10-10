import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Il testo di un documento legale e' prosa con tabelle e collegamenti: tenerlo
 * in due blocchi JSX interi, uno per lingua, lo lascia leggibile e fa vedere
 * subito se una sezione manca da una delle due parti.
 */
const TESTI = testi({
  it: {
    titoloPagina: "Informativa privacy",
    descrizione: "Quali dati raccoglie GachaZone, perché, per quanto tempo e cosa puoi chiedere.",
    Documento: PrivacyIt,
  },
  en: {
    titoloPagina: "Privacy policy",
    descrizione: "What data GachaZone collects, why, for how long, and what you can request.",
    Documento: PrivacyEn,
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina, description: t.descrizione };
}

export default async function PrivacyPage() {
  const { Documento } = TESTI[await getLocale()];
  return <Documento />;
}

function PrivacyIt() {
  return (
    <>
      <PageHeader title="Privacy" />

      <Notice className="mb-8">
        <span>
          Questa è una <strong>bozza tecnica</strong>: descrive fedelmente cosa fa il software
          oggi, ma non sostituisce un&apos;informativa redatta da un legale. Va rivista prima di
          aprire il sito al pubblico o attivare la pubblicità.
        </span>
      </Notice>

      <h2>Chi tratta i dati</h2>
      <p>
        Il titolare del trattamento è il gestore di GachaZone. I dati di contatto vanno inseriti
        qui prima della pubblicazione: senza un riferimento raggiungibile, l&apos;informativa non è
        conforme.
      </p>

      <h2>Quali dati raccogliamo</h2>
      <table>
        <thead>
          <tr>
            <th>Dato</th>
            <th>Perché</th>
            <th>Base giuridica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email</td>
            <td>Identificare l&apos;account e permettere il recupero della password</td>
            <td>Esecuzione del contratto</td>
          </tr>
          <tr>
            <td>Password (solo l&apos;impronta)</td>
            <td>Verificare l&apos;accesso</td>
            <td>Esecuzione del contratto</td>
          </tr>
          <tr>
            <td>Handle, nome, bio, paese</td>
            <td>Costruire il profilo pubblico</td>
            <td>Esecuzione del contratto</td>
          </tr>
          <tr>
            <td>Post, commenti, voti</td>
            <td>Far funzionare la community</td>
            <td>Esecuzione del contratto</td>
          </tr>
          <tr>
            <td>UID di gioco pubblici</td>
            <td>Verificare i badge legati al gioco</td>
            <td>Consenso — li inserisci tu</td>
          </tr>
          <tr>
            <td>Account di gioco: nickname, Codice amico, server, classe dell&apos;account, costellazioni</td>
            <td>Le statistiche delle schede degli eroi e il profilo pubblico</td>
            <td>Consenso — li inserisci tu</td>
          </tr>
          <tr>
            <td>Schermata per la verifica della classe</td>
            <td>Permettere a un moderatore di confermare la classe dell&apos;account</td>
            <td>Consenso — la carichi tu</td>
          </tr>
          <tr>
            <td>Dati di pagamento</td>
            <td>Gestire abbonamento e acquisti</td>
            <td>Esecuzione del contratto</td>
          </tr>
        </tbody>
      </table>

      <h3>Cosa non raccogliamo</h3>
      <p>
        <strong>Non chiediamo mai le credenziali del tuo account di gioco.</strong> I profili si
        collegano tramite UID pubblico o tramite un file che generi tu sul tuo computer. Non
        abbiamo modo di accedere al tuo account HoYoverse, Netmarble o Kuro Games, e non lo
        vogliamo: ti esporrebbe al rischio di sospensione.
      </p>
      <p>
        La password non viene conservata: si conserva un&apos;impronta crittografica da cui non si
        può risalire al testo originale.
      </p>

      <h2>Pubblicità e statistiche</h2>
      <p>
        Quando la pubblicità sarà attiva, la rete pubblicitaria potrà installare cookie di
        profilazione. Questo avviene <strong>solo dopo il tuo consenso</strong>, raccolto tramite
        il banner e revocabile in qualsiasi momento dalla pagina cookie. Senza consenso il sito
        funziona comunque.
      </p>

      <h2>Per quanto tempo</h2>
      <ul>
        <li>Dati dell&apos;account: finché l&apos;account esiste.</li>
        <li>
          Post e commenti: restano dopo l&apos;eliminazione dell&apos;account, ma privati del
          collegamento alla tua identità. Cancellarli spezzerebbe discussioni altrui.
        </li>
        <li>
          Schermate della verifica della classe: finché un moderatore decide, o finché ritiri la
          richiesta. Poi si cancellano; resta solo un&apos;impronta del file, da cui l&apos;immagine
          non si ricostruisce, per riconoscere chi ricarica la stessa schermata.
        </li>
        <li>Documenti fiscali degli acquisti: per il periodo imposto dalla legge.</li>
      </ul>

      <h2>Cosa puoi chiedere</h2>
      <p>
        Accesso, rettifica, cancellazione, limitazione, opposizione e portabilità. La cancellazione
        dell&apos;account è già disponibile in autonomia da{" "}
        <Link href="/impostazioni/account">Impostazioni → Account</Link>. Per il resto, scrivi
        all&apos;indirizzo del titolare.
      </p>
      <p>
        Hai anche il diritto di rivolgerti al Garante per la protezione dei dati personali.
      </p>

      <h2>Trasferimenti e fornitori</h2>
      <p>
        I dati risiedono sul fornitore di hosting e sul database gestito. L&apos;elenco dei
        fornitori — hosting, rete pubblicitaria, gestore dei pagamenti — va completato qui con i
        nomi effettivi prima della pubblicazione.
      </p>
    </>
  );
}

function PrivacyEn() {
  return (
    <>
      <PageHeader title="Privacy" />

      <Notice className="mb-8">
        <span>
          This is a <strong>technical draft</strong>: it faithfully describes what the software
          does today, but it does not replace a privacy notice drafted by a lawyer. It must be
          reviewed before opening the site to the public or turning on advertising.
        </span>
      </Notice>

      <h2>Who processes the data</h2>
      <p>
        The data controller is the operator of GachaZone. Contact details must be added here
        before publication: without a reachable contact, the notice is not compliant.
      </p>

      <h2>What data we collect</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Why</th>
            <th>Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email</td>
            <td>Identify the account and allow password recovery</td>
            <td>Performance of the contract</td>
          </tr>
          <tr>
            <td>Password (fingerprint only)</td>
            <td>Verify sign-in</td>
            <td>Performance of the contract</td>
          </tr>
          <tr>
            <td>Handle, name, bio, country</td>
            <td>Build the public profile</td>
            <td>Performance of the contract</td>
          </tr>
          <tr>
            <td>Posts, comments, votes</td>
            <td>Run the community</td>
            <td>Performance of the contract</td>
          </tr>
          <tr>
            <td>Public game UIDs</td>
            <td>Verify game-related badges</td>
            <td>Consent — you enter them yourself</td>
          </tr>
          <tr>
            <td>Game account: nickname, Friend Code, server, Account Combat Class, constellations</td>
            <td>The hero pages&apos; stats and the public profile</td>
            <td>Consent — you enter them yourself</td>
          </tr>
          <tr>
            <td>Screenshot for the class verification</td>
            <td>Let a moderator confirm the Account Combat Class</td>
            <td>Consent — you upload it yourself</td>
          </tr>
          <tr>
            <td>Payment data</td>
            <td>Manage subscriptions and purchases</td>
            <td>Performance of the contract</td>
          </tr>
        </tbody>
      </table>

      <h3>What we don&apos;t collect</h3>
      <p>
        <strong>We never ask for your game account credentials.</strong> Profiles are linked
        through a public UID or through a file you generate yourself on your computer. We have no
        way to access your HoYoverse, Netmarble or Kuro Games account, and we don&apos;t want one:
        it would expose you to the risk of suspension.
      </p>
      <p>
        Your password is not stored: we store a cryptographic fingerprint from which the original
        text cannot be recovered.
      </p>

      <h2>Advertising and statistics</h2>
      <p>
        Once advertising is active, the ad network may set profiling cookies. This happens{" "}
        <strong>only after your consent</strong>, collected through the banner and revocable at
        any time from the cookie page. Without consent, the site works all the same.
      </p>

      <h2>For how long</h2>
      <ul>
        <li>Account data: for as long as the account exists.</li>
        <li>
          Posts and comments: they remain after the account is deleted, but no longer linked to
          your identity. Deleting them would break other people&apos;s discussions.
        </li>
        <li>
          Class verification screenshots: until a moderator decides, or until you withdraw the
          request. Then they are deleted; only a fingerprint of the file remains, from which the
          image cannot be rebuilt, to recognize someone uploading the same screenshot again.
        </li>
        <li>Tax records of purchases: for the period required by law.</li>
      </ul>

      <h2>What you can request</h2>
      <p>
        Access, rectification, erasure, restriction, objection and portability. You can already
        delete your account on your own from{" "}
        <Link href="/impostazioni/account">Settings → Account</Link>. For everything else, write
        to the controller&apos;s address.
      </p>
      <p>
        You also have the right to lodge a complaint with the Italian Data Protection Authority
        (Garante per la protezione dei dati personali).
      </p>

      <h2>Transfers and providers</h2>
      <p>
        The data resides with the hosting provider and the managed database. The list of
        providers — hosting, ad network, payment processor — must be completed here with their
        actual names before publication.
      </p>
    </>
  );
}
