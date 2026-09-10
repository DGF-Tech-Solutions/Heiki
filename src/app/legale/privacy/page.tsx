import type { Metadata } from "next";
import Link from "next/link";
import { cx, display, eyebrow, Notice } from "@/components/ui";

export const metadata: Metadata = {
  title: "Informativa privacy · GachaZone",
  description: "Quali dati raccoglie GachaZone, perché, per quanto tempo e cosa puoi chiedere.",
};

export default function PrivacyPage() {
  return (
    <>
      <p className={eyebrow}>Informativa</p>
      <h1 className={cx(display, "mt-3 mb-6 text-[clamp(28px,4.4vw,42px)]")}>Privacy</h1>

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
