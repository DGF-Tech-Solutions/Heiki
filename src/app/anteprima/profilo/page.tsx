import type { Metadata } from "next";
import Link from "next/link";
import { ProfileWorkspace } from "@/components/profile-workspace";
import type { ProfileViewData } from "@/components/profile-view";
import { buttonClass, Tag } from "@/components/ui";
import { DEFAULT_CUSTOMIZATION } from "@/lib/profile/customization";
import { resolveFavorites } from "@/lib/profile/favorite-heroes";
import { SERVER_NAMES } from "@/lib/games/game-account";
import { pickableGames } from "@/lib/profile/load";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

const TESTI = testi({
  it: {
    titoloPagina: "Personalizza il profilo",
    anteprima: "Anteprima",
    esempioPrima: "Dati di esempio, nessun account vero. Premi",
    modificaProfilo: "Modifica profilo",
    esempioDopo: "e cambia quello che vuoi: si salva in questo browser finché non accendi il database.",
    creaIlTuo: "Crea il tuo",
  },
  en: {
    titoloPagina: "Customize your profile",
    anteprima: "Preview",
    esempioPrima: "Sample data, no real account. Press",
    modificaProfilo: "Edit profile",
    esempioDopo: "and change whatever you like: it's saved in this browser until you turn on the database.",
    creaIlTuo: "Create yours",
  },
});

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

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

/** Le copertine di prova: tre eroi veri del roster, il primo va in copertina. */
const SAMPLE_FAVORITES = ["grand-cross:2017501", "grand-cross:2007501", "grand-cross:1575001"];

/** Tutto tranne i preferiti risolti, che dipendono dalla lingua: li aggiunge la pagina. */
const SAMPLE: Omit<ProfileViewData, "favoriteHeroes" | "cover"> = {
  username: "franz",
  displayName: "Franz",
  role: "EDITOR",
  bio: "Theorycrafting su Grand Cross. Scrivo rotazioni, misuro tutto due volte e pubblico solo quello che regge alla prova.",
  country: "Italia",
  memberSince: "2025-03-14T10:00:00.000Z",
  stats: { followers: 128, following: 41, posts: 17 },
  favorites: SAMPLE_FAVORITES,
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
      uid: "394188201",
      nickname: "franz",
      trust: "VERIFIED",
      power: 15_240_000,
      verifiedPower: 15_240_000,
      verifiedAt: "2026-10-02T09:00:00.000Z",
      shown: true,
    },
  ],
};

export default async function ProfilePreviewPage() {
  const locale = await getLocale();
  const t = TESTI[locale];
  // il roster arriva da qui come al proprietario: l'anteprima serve proprio a provare l'editor
  const heroes = pickableGames();
  const sample: ProfileViewData = {
    ...SAMPLE,
    ...resolveFavorites(SAMPLE.favorites, heroes, locale),
    gameAccounts: SAMPLE.gameAccounts.map((account) => ({ ...account, server: SERVER_NAMES.global[locale] })),
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-8">
      {/* l'avviso con l'angolo tagliato e l'etichetta rossa, non il filo a sinistra (10/10) */}
      <div className="p5-corner mb-6 flex flex-wrap items-center gap-3.5 border border-rule bg-paper-2 px-4 py-3.5 text-[13px] text-ink-2">
        <Tag tone="brand">{t.anteprima}</Tag>
        <span className="flex-1 basis-72">
          {t.esempioPrima} <strong>{t.modificaProfilo}</strong> {t.esempioDopo}
        </span>
        <Link href="/registrati" className={buttonClass("outline", "sm")}>
          {t.creaIlTuo}
        </Link>
      </div>

      <ProfileWorkspace initial={sample} canEdit canUsePremium demoMode heroes={heroes} />
    </main>
  );
}
