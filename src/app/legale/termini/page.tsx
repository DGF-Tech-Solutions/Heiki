import type { Metadata } from "next";
import { cx, display, eyebrow, Notice } from "@/components/ui";

export const metadata: Metadata = {
  title: "Termini di servizio · GachaZone",
  description: "Regole d'uso di GachaZone, contenuti degli utenti, acquisti e diritto di recesso.",
};

export default function TermsPage() {
  return (
    <>
      <p className={eyebrow}>Condizioni</p>
      <h1 className={cx(display, "mt-3 mb-6 text-[clamp(28px,4.4vw,42px)]")}>
        Termini di servizio
      </h1>

      <Notice className="mb-8">
        <span>
          <strong>Bozza tecnica.</strong> Descrive come funziona il sito e quali regole applica il
          software; va rivista da un legale prima della pubblicazione.
        </span>
      </Notice>

      <h2>Cos&apos;è GachaZone</h2>
      <p>
        Uno strumento di calcolo e una community per giochi gacha. Le simulazioni sono stime
        prodotte da un motore nostro su dati di gioco raccolti dalla community:{" "}
        <strong>non sono numeri ufficiali</strong> e possono divergere dal gioco reale.
      </p>

      <h2>Nessun rapporto con i publisher</h2>
      <p>
        GachaZone <strong>non è affiliato, sponsorizzato né approvato</strong> da Netmarble,
        HoYoverse, Kuro Games o altri editori. Marchi, nomi e contenuti di gioco appartengono ai
        rispettivi proprietari e vengono citati per identificare ciò di cui si parla.
      </p>

      <h2>Il tuo account</h2>
      <ul>
        <li>Un account per persona; serve un indirizzo email valido.</li>
        <li>Sei responsabile di quello che accade con le tue credenziali.</li>
        <li>
          Non chiediamo né vogliamo le credenziali del tuo account di gioco. Se qualcuno te le
          chiede a nome nostro, non siamo noi.
        </li>
      </ul>

      <h2>Cosa puoi pubblicare</h2>
      <p>
        Resti proprietario di ciò che scrivi. Pubblicandolo ci concedi il diritto, non esclusivo e
        gratuito, di mostrarlo sul sito e nelle anteprime di condivisione.
      </p>
      <p>Non è ammesso:</p>
      <ul>
        <li>Insultare o molestare qualcuno. Si critica la build, non chi l&apos;ha costruita.</li>
        <li>Pubblicare dati personali altrui.</li>
        <li>Spam, pubblicità occulta, link di affiliazione non dichiarati.</li>
        <li>
          Dichiarare numeri falsi come propri risultati. Il sito riverifica gli allegati e lo
          segnala pubblicamente.
        </li>
        <li>Caricare materiale protetto da copyright su cui non hai diritti.</li>
      </ul>
      <p>
        Chi modera può nascondere un contenuto o sospendere un account. Le decisioni sono
        contestabili scrivendo al titolare.
      </p>

      <h2>Acquisti</h2>
      <p>
        Gli oggetti in vendita sono <strong>cosmetici di nostra creazione</strong>: cornici,
        sfondi, accenti, impaginazioni. Non vendiamo vantaggi, non vendiamo badge, e non vendiamo
        nulla che appartenga a un editore di giochi.
      </p>
      <h3>Diritto di recesso</h3>
      <p>
        Sono beni digitali a fruizione immediata. Al momento dell&apos;acquisto ti viene chiesto di
        rinunciare espressamente al diritto di recesso di quattordici giorni: senza quella
        rinuncia, il recesso resta valido e puoi chiedere il rimborso entro quattordici giorni.
      </p>

      <h2>Interruzioni e modifiche</h2>
      <p>
        Il servizio è fornito così com&apos;è. Può essere interrotto per manutenzione, e le
        funzioni possono cambiare. I dati di gioco cambiano a ogni patch: una build calcolata mesi
        fa può non valere più, ed è il motivo per cui ogni risultato porta la versione dei dati con
        cui è stato prodotto.
      </p>

      <h2>Legge applicabile</h2>
      <p>
        Si applica la legge italiana. Il foro competente va indicato qui prima della
        pubblicazione.
      </p>
    </>
  );
}
