import type { Metadata } from "next";
import Link from "next/link";
import { ProfileWorkspace } from "@/components/profile-workspace";
import type { ProfileViewData } from "@/components/profile-view";
import { buttonClass } from "@/components/ui";
import { DEFAULT_CUSTOMIZATION } from "@/lib/profile/customization";

/**
 * Editor del profilo in modalita' dimostrativa.
 *
 * Stesso componente della pagina impostazioni, ma senza database: si modifica
 * tutto e si salva nel browser. Serve a far vedere e provare la
 * personalizzazione prima ancora di avere un account.
 *
 * Le opzioni premium sono sbloccate qui di proposito: chi guarda deve poter
 * capire cosa comprerebbe. Il controllo vero resta lato server, nel salvataggio.
 */

export const metadata: Metadata = {
  title: "Personalizza il profilo · GachaZone",
  robots: { index: false, follow: false },
};

const SAMPLE: ProfileViewData = {
  username: "franz",
  displayName: "Franz",
  role: "EDITOR",
  bio: "Theorycrafting su Grand Cross e Star Rail. Scrivo rotazioni, misuro tutto due volte e pubblico solo quello che regge alla simulazione.",
  country: "Italia",
  xp: 2480,
  favorites: ["Unità Forza", "Unità Destrezza"],
  customization: DEFAULT_CUSTOMIZATION,
  badges: [
    { id: "b1", name: "Roster completo", trust: "VERIFIED", icon: "✦", shown: true },
    { id: "b2", name: "Prima guida pubblicata", trust: "VERIFIED", icon: "✎", shown: true },
    { id: "b3", name: "100 voti ricevuti", trust: "VERIFIED", icon: "▲", shown: true },
    { id: "b4", name: "Beta tester", trust: "VERIFIED", icon: "◆", shown: true },
    { id: "b5", name: "Set con roll perfetti", trust: "IMPORTED", icon: "◈", shown: true },
    { id: "b6", name: "Clear piano 12", trust: "DECLARED", icon: "◇", shown: false },
  ],
  gameAccounts: [
    {
      id: "g1",
      game: "Grand Cross",
      uid: "3941 8820",
      nickname: "franz",
      trust: "VERIFIED",
      shown: true,
    },
    {
      id: "g2",
      game: "Honkai Star Rail",
      uid: "700412955",
      nickname: "franz",
      trust: "IMPORTED",
      shown: true,
    },
  ],
  builds: [
    {
      id: "s1",
      name: "Apertura a 3 turni",
      game: "Grand Cross",
      character: "Unità Forza",
      median: 186_400,
      patch: "0.0.0",
      isPublic: true,
    },
    {
      id: "s2",
      name: "Sostegno prolungato",
      game: "Grand Cross",
      character: "Unità Destrezza",
      median: 94_150,
      patch: "0.0.0",
      isPublic: true,
    },
    {
      id: "s3",
      name: "Difensiva lunga",
      game: "Grand Cross",
      character: "Unità Vita",
      median: 61_300,
      patch: "0.0.0",
      isPublic: false,
    },
  ],
};

export default function ProfilePreviewPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-8">
      <div className="mb-6 flex flex-wrap items-center gap-3.5 rounded-card border border-rule border-l-4 border-l-brand bg-brand-soft px-4 py-3.5 text-[13px] text-ink-2">
        <strong className="text-brand">Anteprima</strong>
        <span className="flex-1 basis-72">
          Dati di esempio, nessun account vero. Premi <strong>Modifica profilo</strong> e cambia
          quello che vuoi: si salva in questo browser finché non accendi il database.
        </span>
        <Link href="/registrati" className={buttonClass("outline", "sm")}>
          Crea il tuo
        </Link>
      </div>

      <ProfileWorkspace initial={SAMPLE} canEdit canUsePremium demoMode />
    </main>
  );
}
