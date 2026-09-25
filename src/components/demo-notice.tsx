import Link from "next/link";
import { databaseReachable } from "@/lib/db";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { buttonClass, Code, eyebrow } from "./ui";

export const DEMO_PROFILE_PATH = "/anteprima/profilo";

const TESTI = testi({
  it: {
    modalita: "Modalità dimostrativa",
    spiegazione:
      "Il database non è ancora acceso, quindi gli account veri non funzionano. Entra lo stesso: ti facciamo vedere un profilo di esempio.",
    guardaProfilo: "Guarda il profilo",
    perAttivare: "Per attivare gli account:",
    e: "e",
  },
  en: {
    modalita: "Demo mode",
    spiegazione:
      "The database isn't running yet, so real accounts don't work. Log in anyway: we'll show you a sample profile.",
    guardaProfilo: "See the profile",
    perAttivare: "To enable accounts:",
    e: "and",
  },
});

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
  const t = TESTI[await getLocale()];

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3.5 rounded-card border border-rule border-l-4 border-l-brand bg-brand-soft px-4 py-3.5">
      <div className="flex-1 basis-60">
        <p className={`${eyebrow} m-0`}>{t.modalita}</p>
        <p className="m-0 mt-2 text-sm text-ink-2">{t.spiegazione}</p>
      </div>

      <Link href={DEMO_PROFILE_PATH} className={buttonClass("primary")}>
        {t.guardaProfilo}
      </Link>
    </div>
  );
}

/** Nota tecnica, per chi vuole attivare gli account veri. */
export async function SetupHint() {
  if (await databaseReachable()) return null;
  const t = TESTI[await getLocale()];

  return (
    <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-3">
      {t.perAttivare} <Code>docker compose up -d</Code> {t.e} <Code>npm run db:migrate</Code>.
    </p>
  );
}
