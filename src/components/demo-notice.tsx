import Link from "next/link";
import { databaseReachable } from "@/lib/db";
import { buttonClass, Code, eyebrow } from "./ui";

export const DEMO_PROFILE_PATH = "/anteprima/profilo";

/**
 * Modalita' dimostrativa.
 *
 * Senza database gli account non possono funzionare, ma un modulo che fallisce
 * al primo invio non fa vedere niente a nessuno. Finche' Postgres non risponde,
 * l'accesso porta al profilo di esempio: si vede com'e' fatta la schermata senza
 * dover installare nulla.
 *
 * La modalita' e' sempre dichiarata: non si finge mai un accesso riuscito.
 */
export async function DemoNotice() {
  if (await databaseReachable()) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3.5 rounded-card border border-rule border-l-4 border-l-brand bg-brand-soft px-4 py-3.5">
      <div className="flex-1 basis-60">
        <p className={`${eyebrow} m-0`}>Modalità dimostrativa</p>
        <p className="m-0 mt-2 text-sm text-ink-2">
          Il database non è ancora acceso, quindi gli account veri non funzionano. Entra lo stesso:
          ti facciamo vedere un profilo di esempio.
        </p>
      </div>

      <Link href={DEMO_PROFILE_PATH} className={buttonClass("primary")}>
        Guarda il profilo
      </Link>
    </div>
  );
}

/** Nota tecnica, per chi vuole attivare gli account veri. */
export async function SetupHint() {
  if (await databaseReachable()) return null;

  return (
    <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-3">
      Per attivare gli account: <Code>docker compose up -d</Code> e{" "}
      <Code>npm run db:migrate</Code>.
    </p>
  );
}
