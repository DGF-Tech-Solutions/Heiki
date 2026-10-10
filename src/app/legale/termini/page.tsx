import type { Metadata } from "next";
import { Notice, PageHeader } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/** Un blocco JSX intero per lingua: vedi la nota nella pagina privacy. */
const TESTI = testi({
  it: {
    titoloPagina: "Termini di servizio",
    descrizione: "Regole d'uso di GachaZone, contenuti degli utenti, acquisti e diritto di recesso.",
    Documento: TerminiIt,
  },
  en: {
    titoloPagina: "Terms of service",
    descrizione: "GachaZone's rules of use, user content, purchases and right of withdrawal.",
    Documento: TerminiEn,
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina, description: t.descrizione };
}

export default async function TermsPage() {
  const { Documento } = TESTI[await getLocale()];
  return <Documento />;
}

function TerminiIt() {
  return (
    <>
      <PageHeader title="Termini di servizio" />

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

function TerminiEn() {
  return (
    <>
      <PageHeader title="Terms of service" />

      <Notice className="mb-8">
        <span>
          <strong>Technical draft.</strong> It describes how the site works and which rules the
          software enforces; it must be reviewed by a lawyer before publication.
        </span>
      </Notice>

      <h2>What GachaZone is</h2>
      <p>
        A calculation tool and a community for gacha games. Simulations are estimates produced by
        our own engine from game data collected by the community:{" "}
        <strong>they are not official numbers</strong> and may differ from the actual game.
      </p>

      <h2>No relationship with publishers</h2>
      <p>
        GachaZone <strong>is not affiliated with, sponsored by or endorsed by</strong> Netmarble,
        HoYoverse, Kuro Games or other publishers. Trademarks, names and game content belong to
        their respective owners and are mentioned to identify what is being discussed.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>One account per person; a valid email address is required.</li>
        <li>You are responsible for what happens with your credentials.</li>
        <li>
          We neither ask for nor want the credentials of your game account. If someone asks you
          for them on our behalf, it isn&apos;t us.
        </li>
      </ul>

      <h2>What you can publish</h2>
      <p>
        You remain the owner of what you write. By publishing it, you grant us the non-exclusive,
        free right to display it on the site and in share previews.
      </p>
      <p>The following is not allowed:</p>
      <ul>
        <li>Insulting or harassing anyone. Criticize the build, not the person who made it.</li>
        <li>Publishing other people&apos;s personal data.</li>
        <li>Spam, hidden advertising, undisclosed affiliate links.</li>
        <li>
          Claiming false numbers as your own results. The site re-checks attachments and flags it
          publicly.
        </li>
        <li>Uploading copyrighted material you have no rights to.</li>
      </ul>
      <p>
        Moderators can hide content or suspend an account. Decisions can be appealed by writing
        to the operator.
      </p>

      <h2>Purchases</h2>
      <p>
        The items for sale are <strong>cosmetics of our own making</strong>: frames, backgrounds,
        accents, layouts. We don&apos;t sell advantages, we don&apos;t sell badges, and we
        don&apos;t sell anything that belongs to a game publisher.
      </p>
      <h3>Right of withdrawal</h3>
      <p>
        These are digital goods delivered immediately. At the time of purchase you are asked to
        expressly waive the fourteen-day right of withdrawal: without that waiver, the right of
        withdrawal remains valid and you can request a refund within fourteen days.
      </p>

      <h2>Interruptions and changes</h2>
      <p>
        The service is provided as is. It may be interrupted for maintenance, and features may
        change. Game data changes with every patch: a build calculated months ago may no longer
        hold, which is why every result carries the version of the data it was produced with.
      </p>

      <h2>Governing law</h2>
      <p>
        Italian law applies. The competent court must be specified here before publication.
      </p>
    </>
  );
}
