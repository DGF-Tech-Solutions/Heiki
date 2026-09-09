import type { Metadata } from "next";
import Link from "next/link";
import { ProfileWorkspace } from "@/components/profile-workspace";
import type { ProfileViewData } from "@/components/profile-view";
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
  favorites: ["Unita' Forza", "Unita' Destrezza"],
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
    { id: "g1", game: "Grand Cross", uid: "3941 8820", nickname: "franz", trust: "VERIFIED", shown: true },
    { id: "g2", game: "Honkai Star Rail", uid: "700412955", nickname: "franz", trust: "IMPORTED", shown: true },
  ],
  builds: [
    {
      id: "s1",
      name: "Apertura a 3 turni",
      game: "Grand Cross",
      character: "Unita' Forza",
      median: 186_400,
      patch: "0.0.0",
      isPublic: true,
    },
    {
      id: "s2",
      name: "Sostegno prolungato",
      game: "Grand Cross",
      character: "Unita' Destrezza",
      median: 94_150,
      patch: "0.0.0",
      isPublic: true,
    },
    {
      id: "s3",
      name: "Difensiva lunga",
      game: "Grand Cross",
      character: "Unita' Vita",
      median: 61_300,
      patch: "0.0.0",
      isPublic: false,
    },
  ],
};

export default function ProfilePreviewPage() {
  return (
    <main className="shell" style={{ paddingTop: 34 }}>
      <div className="preview-flag">
        <strong style={{ color: "var(--violet)" }}>Anteprima</strong>
        <span>
          Dati di esempio, nessun account reale. Premi <strong>Modifica profilo</strong> per
          personalizzare tutto: il salvataggio resta in questo browser finche&apos; non attivi il
          database.
        </span>
        <Link href="/registrati" className="btn" style={{ marginLeft: "auto", height: 32 }}>
          Crea il tuo
        </Link>
      </div>

      <ProfileWorkspace initial={SAMPLE} canEdit canUsePremium demoMode />
    </main>
  );
}
