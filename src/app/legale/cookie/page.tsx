import type { Metadata } from "next";
import { cx, display, eyebrow, Notice } from "@/components/ui";
import { CookiePreferences } from "@/components/cookie-preferences";

export const metadata: Metadata = {
  title: "Cookie · GachaZone",
  description: "Quali cookie usa GachaZone e come cambiare le tue scelte.",
};

export default function CookiePage() {
  return (
    <>
      <p className={eyebrow}>Cookie</p>
      <h1 className={cx(display, "mt-3 mb-6 text-[clamp(28px,4.4vw,42px)]")}>Cookie e scelte</h1>

      <Notice className="mb-8">
        <span>
          <strong>Bozza tecnica.</strong> L&apos;elenco va completato con i cookie effettivi della
          rete pubblicitaria quando verrà attivata.
        </span>
      </Notice>

      <h2>Cookie tecnici</h2>
      <p>
        Servono a far funzionare il sito e non richiedono consenso. Sono l&apos;unica cosa attiva
        oggi.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>A cosa serve</th>
            <th>Durata</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>authjs.session-token</td>
            <td>Tenerti collegato dopo l&apos;accesso</td>
            <td>30 giorni</td>
          </tr>
          <tr>
            <td>authjs.csrf-token</td>
            <td>Impedire che un altro sito invii moduli a tuo nome</td>
            <td>Sessione</td>
          </tr>
          <tr>
            <td>gachazone:cookie-consent</td>
            <td>Ricordare la scelta che fai qui sotto</td>
            <td>6 mesi</td>
          </tr>
        </tbody>
      </table>

      <h2>Cookie di profilazione</h2>
      <p>
        Quando la pubblicità sarà attiva, la rete pubblicitaria potrà installare cookie per
        mostrare annunci pertinenti. <strong>Non vengono installati senza il tuo consenso.</strong>{" "}
        Se rifiuti, il sito funziona esattamente come prima.
      </p>

      <h2>Le tue scelte</h2>
      <p>
        Puoi cambiare idea quando vuoi. La scelta resta nel tuo browser, non sul nostro server:
        cancellando i dati del sito torni allo stato iniziale.
      </p>

      <CookiePreferences />

      <h2>Archiviazione locale</h2>
      <p>
        Oltre ai cookie usiamo l&apos;archiviazione locale del browser per comodità: la bozza del
        profilo quando il database non è attivo, e ricordare la scelta sui cookie. Non lascia mai
        il tuo dispositivo.
      </p>
    </>
  );
}
