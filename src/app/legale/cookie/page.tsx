import type { Metadata } from "next";
import { cx, display, eyebrow, Notice } from "@/components/ui";
import { CookiePreferences } from "@/components/cookie-preferences";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/** Un blocco JSX intero per lingua: vedi la nota nella pagina privacy. */
const TESTI = testi({
  it: {
    titoloPagina: "Cookie · GachaZone",
    descrizione: "Quali cookie usa GachaZone e come cambiare le tue scelte.",
    Documento: CookieIt,
  },
  en: {
    titoloPagina: "Cookies · GachaZone",
    descrizione: "Which cookies GachaZone uses and how to change your choices.",
    Documento: CookieEn,
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return { title: t.titoloPagina, description: t.descrizione };
}

export default async function CookiePage() {
  const { Documento } = TESTI[await getLocale()];
  return <Documento />;
}

function CookieIt() {
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
            <td>lingua</td>
            <td>
              Ricordare la lingua del sito che hai scelto con il selettore IT/EN
              nell&apos;intestazione. Contiene solo “it” o “en”. Non richiede consenso: ricorda
              soltanto una scelta che hai fatto tu.
            </td>
            <td>1 anno</td>
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

function CookieEn() {
  return (
    <>
      <p className={eyebrow}>Cookies</p>
      <h1 className={cx(display, "mt-3 mb-6 text-[clamp(28px,4.4vw,42px)]")}>
        Cookies and choices
      </h1>

      <Notice className="mb-8">
        <span>
          <strong>Technical draft.</strong> The list must be completed with the ad network&apos;s
          actual cookies once it is turned on.
        </span>
      </Notice>

      <h2>Technical cookies</h2>
      <p>
        They are needed for the site to work and don&apos;t require consent. They are the only
        thing active today.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>What it&apos;s for</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>authjs.session-token</td>
            <td>Keep you logged in after you sign in</td>
            <td>30 days</td>
          </tr>
          <tr>
            <td>authjs.csrf-token</td>
            <td>Prevent another site from submitting forms on your behalf</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>lingua</td>
            <td>
              Remember the site language you picked with the IT/EN switch in the header. It
              contains only “it” or “en”. It needs no consent: it only remembers a choice you
              made.
            </td>
            <td>1 year</td>
          </tr>
          <tr>
            <td>gachazone:cookie-consent</td>
            <td>Remember the choice you make below</td>
            <td>6 months</td>
          </tr>
        </tbody>
      </table>

      <h2>Profiling cookies</h2>
      <p>
        Once advertising is active, the ad network may set cookies to show relevant ads.{" "}
        <strong>They are not set without your consent.</strong> If you decline, the site works
        exactly as before.
      </p>

      <h2>Your choices</h2>
      <p>
        You can change your mind whenever you like. Your choice stays in your browser, not on our
        server: clearing the site&apos;s data takes you back to the initial state.
      </p>

      <CookiePreferences />

      <h2>Local storage</h2>
      <p>
        Besides cookies, we use the browser&apos;s local storage for convenience: the profile
        draft when the database isn&apos;t active, and remembering your cookie choice. It never
        leaves your device.
      </p>
    </>
  );
}
