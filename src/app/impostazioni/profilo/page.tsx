import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProfileWorkspace } from "@/components/profile-workspace";
import { saveProfileAction } from "@/lib/profile/actions";
import { hasActivePremium, loadProfile, pickableGames } from "@/lib/profile/load";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Personalizza il profilo",
    intro:
      "Cambi nei controlli, vedi il risultato nell'anteprima: è la pagina vera. Diventa pubblico solo quando salvi. La tua pagina è",
  },
  en: {
    titoloPagina: "Customize your profile",
    intro:
      "Make changes in the controls, see the result in the preview: it's the real page. It only goes public when you save. Your page is",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

/**
 * L'editor del profilo nelle impostazioni.
 *
 * Il guscio (layout.tsx) ha gia' il `<main>`, il titolo «Il tuo account» e il
 * controllo del database e della sessione: fino all'11/10 questa pagina li
 * ripeteva, con un secondo `<main>` dentro il primo e due titoli uno sotto
 * l'altro. Qui resta solo una riga che dice cosa si fa e dov'e' la pagina.
 */
export default async function ProfileSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/entra");

  const locale = await getLocale();
  const t = TESTI[locale];

  const loaded = await loadProfile({ by: "id", value: session.user.id }, locale);
  if (loaded === null) redirect("/entra");
  const { ownerId, data } = loaded;

  return (
    // data-impostazioni-larghe: il guscio si allarga per affiancare controlli e anteprima
    <div data-impostazioni-larghe="">
      <p className="m-0 mb-2 max-w-[60ch] text-[15px] text-ink-2">
        {t.intro}{" "}
        <Link
          href={`/u/${data.username}`}
          className="font-mono font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep"
        >
          /u/{data.username}
        </Link>
        .
      </p>

      <ProfileWorkspace
        initial={data}
        canEdit
        startEditing
        canUsePremium={await hasActivePremium(ownerId)}
        demoMode={false}
        heroes={pickableGames()}
        headingLevel="h2"
        saveAction={saveProfileAction}
      />
    </div>
  );
}
