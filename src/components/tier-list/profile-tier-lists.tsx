"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass, cx, Empty, eyebrow, SectionHead } from "@/components/ui";
import { heroCardSrc } from "@/lib/games/heroes";
import type { SavedTierListSummary } from "@/lib/tier-list/types";
import { getTierListBackupAction } from "@/lib/tier-list/actions";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    titolo: "Tier List",
    totale: (n: number) => `${n} ${n === 1 ? "tier list creata" : "tier list create"}`,
    nessunaTierListOwner: "Non hai ancora salvato alcuna tier list.",
    nessunaTierListVisitatore: "Nessuna tier list condivisa.",
    creaTierList: "Crea la tua prima Tier List",
    apriNelMaker: "Apri nel Maker",
    copiaLink: "Copia link",
    linkCopiato: "Link copiato!",
    copiaFallita: "Copia non riuscita",
    scaricaBackup: "Scarica Backup JSON",
    suggerimentoBackup: "Scarica un file JSON con tutti i salvataggi",
    backupScaricato: "Backup scaricato!",
    eroiPosizionati: (n: number) => `${n} eroi posizionati`,
    livelli: (n: number) => `${n} ${n === 1 ? "livello" : "livelli"}`,
    altriEroi: (n: number) => `altri ${n} eroi`,
    aggiornatoIl: (data: string) => `Aggiornato il ${data}`,
    privata: "Privata",
    suggerimentoPrivata: "La vedi solo tu: chi visita il profilo non la trova.",
  },
  en: {
    titolo: "Tier Lists",
    totale: (n: number) => `${n} ${n === 1 ? "tier list created" : "tier lists created"}`,
    nessunaTierListOwner: "You haven't saved any tier lists yet.",
    nessunaTierListVisitatore: "No shared tier lists.",
    creaTierList: "Create your first Tier List",
    apriNelMaker: "Open in Maker",
    copiaLink: "Copy link",
    linkCopiato: "Link copied!",
    copiaFallita: "Copy failed",
    scaricaBackup: "Download JSON Backup",
    suggerimentoBackup: "Download a JSON file with all your saved lists",
    backupScaricato: "Backup downloaded!",
    eroiPosizionati: (n: number) => `${n} heroes ranked`,
    livelli: (n: number) => `${n} ${n === 1 ? "tier" : "tiers"}`,
    altriEroi: (n: number) => `${n} more heroes`,
    aggiornatoIl: (data: string) => `Updated on ${data}`,
    privata: "Private",
    suggerimentoPrivata: "Only you can see it: visitors to your profile won't find it.",
  },
});

interface ProfileTierListsProps {
  tierLists: readonly SavedTierListSummary[];
  isOwner: boolean;
  username: string;
  locale: Locale;
  /**
   * Il gioco del Maker per chi non ha ancora liste: con delle liste, ogni
   * collegamento usa il gioco della sua. Prima era fisso su Grand Cross.
   */
  defaultGame?: string;
}

export function ProfileTierLists({
  tierLists,
  isOwner,
  username,
  locale,
  defaultGame,
}: ProfileTierListsProps) {
  const t = TESTI[locale];
  // l'esito della copia per lista: «copiato» solo se il browser l'ha fatta davvero
  const [copied, setCopied] = useState<{ id: string; ok: boolean } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleCopy = async (id: string, game: string) => {
    const url = `${window.location.origin}/${game}/tierlist?id=${id}`;
    let ok = true;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // senza permesso o fuori da https la copia fallisce
      ok = false;
    }
    setCopied({ id, ok });
    setTimeout(() => setCopied((current) => (current?.id === id ? null : current)), 2500);
  };

  const handleDownloadBackup = async () => {
    try {
      setIsExporting(true);
      const backup = await getTierListBackupAction();
      if (!backup) return;

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `heiki-backup-tierlists-${username}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Ignora
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="mt-12 border-t border-rule pt-8">
      <SectionHead
        title={t.titolo}
        aside={
          <div className="flex items-center gap-3">
            <span className={eyebrow}>{t.totale(tierLists.length)}</span>
            {isOwner && tierLists.length > 0 ? (
              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className={buttonClass("ghost", "sm")}
                title={t.suggerimentoBackup}
              >
                <span aria-hidden>💾</span> {t.scaricaBackup}
              </button>
            ) : null}
          </div>
        }
      />

      {tierLists.length === 0 ? (
        <Empty>
          <div className="py-2 text-center">
            <p className="text-sm text-ink-3">
              {isOwner ? t.nessunaTierListOwner : t.nessunaTierListVisitatore}
            </p>
            {isOwner && defaultGame ? (
              <div className="mt-4">
                <Link
                  href={`/${defaultGame}/tierlist`}
                  className={buttonClass("primary", "sm")}
                >
                  {t.creaTierList}
                </Link>
              </div>
            ) : null}
          </div>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tierLists.map((item) => (
            <div
              key={item.id}
              className="p5-corner group relative flex flex-col justify-between border border-rule bg-paper-2 p-4 transition-all hover:border-rule-2 hover:bg-paper"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand">
                    {item.gameName ?? item.game}
                    {/* solo il proprietario vede le private: gli altri non le ricevono nemmeno */}
                    {!item.isPublic ? (
                      <span
                        title={t.suggerimentoPrivata}
                        className="rounded bg-rule px-1.5 py-0.5 text-[10px] text-ink-2"
                      >
                        {t.privata}
                      </span>
                    ) : null}
                  </span>
                  <span suppressHydrationWarning className="text-[11px] text-ink-3">
                    {new Date(item.updatedAt).toLocaleDateString(locale)}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-ink line-clamp-1 group-hover:text-brand transition-colors">
                  {item.title}
                </h3>

                {item.description ? (
                  <p className="mt-1 text-xs text-ink-3 line-clamp-2">
                    {item.description}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between text-xs text-ink-2">
                  <span>{t.eroiPosizionati(item.heroCount)}</span>
                  <span className="text-ink-3">{t.livelli(item.tierCount)}</span>
                </div>

                {/* Anteprima miniature eroi dei primi tier */}
                {item.topHeroIds && item.topHeroIds.length > 0 ? (
                  <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
                    {item.topHeroIds.slice(0, 5).map((heroId) => (
                      <div
                        key={heroId}
                        className="relative h-9 w-9 shrink-0 overflow-hidden border border-rule-2 bg-paper"
                      >
                        <Image
                          src={heroCardSrc(item.game, heroId)}
                          alt=""
                          width={36}
                          height={36}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {item.topHeroIds.length > 5 ? (
                      <div
                        aria-label={t.altriEroi(item.heroCount - 5)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center bg-rule text-[11px] font-bold text-ink-3"
                      >
                        +{item.heroCount - 5}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Azioni card */}
              <div className="mt-4 flex items-center justify-between border-t border-rule-2 pt-3">
                <Link
                  href={`/${item.game}/tierlist?id=${item.id}`}
                  className={buttonClass("primary", "sm")}
                >
                  {t.apriNelMaker}
                </Link>

                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.game)}
                  className={cx(buttonClass("outline", "sm"), copied?.id === item.id && !copied.ok && "text-red-500")}
                >
                  {copied?.id === item.id
                    ? copied.ok
                      ? `✓ ${t.linkCopiato}`
                      : t.copiaFallita
                    : t.copiaLink}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
