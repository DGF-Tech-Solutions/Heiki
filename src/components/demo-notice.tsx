import Link from "next/link";
import { databaseReachable } from "@/lib/db";

export const DEMO_PROFILE_PATH = "/anteprima/profilo";

/**
 * Modalita' dimostrativa.
 *
 * Senza database gli account non possono funzionare, ma un modulo che fallisce
 * al primo invio non fa vedere niente a nessuno. Finche' Postgres non risponde,
 * l'accesso porta al profilo di esempio: si vede com'e' fatta la schermata
 * senza dover installare nulla.
 *
 * La modalita' e' sempre dichiarata: non si finge mai un'autenticazione
 * riuscita, si dice che si sta guardando un esempio.
 */
export async function DemoNotice() {
  if (await databaseReachable()) return null;

  return (
    <div className="demo-panel">
      <div>
        <p className="eyebrow">Modalita&apos; dimostrativa</p>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--mute)" }}>
          Il database non e&apos; ancora avviato, quindi gli account reali non sono attivi.
          Entrando adesso vedi un profilo di esempio, con dati inventati.
        </p>
      </div>

      <Link href={DEMO_PROFILE_PATH} className="btn btn--primary">
        Guarda il profilo
      </Link>
    </div>
  );
}

/** Nota tecnica, per chi vuole attivare gli account veri. */
export async function SetupHint() {
  if (await databaseReachable()) return null;

  return (
    <p className="setup-hint mono">
      Per attivare gli account: <code>docker compose up -d</code> e{" "}
      <code>npm run db:migrate</code>.
    </p>
  );
}
