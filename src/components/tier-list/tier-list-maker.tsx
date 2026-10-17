"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonClass, cx, eyebrow } from "@/components/ui";
import { exportTierListToImage } from "@/lib/tier-list/export-image";
import {
  deleteTierListAction,
  getTierListBackupAction,
  saveTierListAction,
} from "@/lib/tier-list/actions";
import {
  defaultTiers,
  TIER_COLORS,
  type SavedTierListDetail,
  type SavedTierListSummary,
  type TierHeroItem,
  type TierRow,
} from "@/lib/tier-list/types";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    titolo: "Tier List Maker",
    aggiungiTier: "+ Aggiungi riga",
    svuotaTutto: "Svuota tutto",
    svuotaRiga: "Svuota riga",
    eliminaRiga: "Elimina riga",
    spostaSu: "Sposta su",
    spostaGiu: "Sposta giù",
    cambiaColore: "Cambia colore",
    rinominaTier: "Rinomina tier",
    ripristina: "Ripristina predefiniti",
    esportaImmagine: "Scarica immagine PNG",
    esportazioneInCorso: "Generazione PNG...",
    copiaLink: "Condividi link",
    linkCopiato: "Link copiato!",
    poolEroi: "Eroi disponibili",
    cercaPlaceholder: "Cerca eroe per nome...",
    tuttiGliAttributi: "Tutti gli attributi",
    tutteLeRarita: "Tutte le rarità",
    trascinaQui: "Trascina qui gli eroi o clicca una card per assegnarla",
    nessunEroeTrovato: "Nessun eroe corrisponde ai filtri selezionati",
    eroiAssegnati: (n: number, tot: number) => `${n} di ${tot} eroi posizionati`,
    rimuoviDalTier: "Rimuovi dal tier",
    assegnaATier: "Assegna a:",
    chiudi: "Chiudi",
    salvaSuAccount: "Salva su Account",
    salvaModifiche: "Salva modifiche",
    salvaComeNuova: "Salva con nuovo nome...",
    leMieTierList: (n: number) => `Le mie Tier List (${n})`,
    nuovaTierList: "+ Nuova Tier List",
    salvataggioInCorso: "Salvataggio...",
    salvatoConSuccesso: "Tier List salvata sul tuo profilo!",
    accediPerSalvare:
      "Accedi per salvare più tier list con nomi diversi sul tuo account, visualizzarle nel profilo e condividerle con un link permanente.",
    entra: "Accedi",
    elimina: "Elimina",
    carica: "Carica",
    confermaElimina: "Sei sicuro di voler eliminare questa tier list?",
    scaricaBackup: "Scarica Backup JSON",
    visualizzandoDi: (autore: string) => `Stai visualizzando la Tier List di @${autore}`,
    copiaNelTuoMaker: "Clona nel tuo account",
    titoloPlaceholder: "Nome della Tier List (es. PvP Meta Ottobre)",
    nessunaTierListSalvata: "Non hai ancora tier list salvate su questo account per questo gioco.",
    salvaNuovaCopia: "Salva nuova copia",
    annulla: "Annulla",
    conferma: "Salva",
    nomeTierList: "Nome della nuova Tier List:",
  },
  en: {
    titolo: "Tier List Maker",
    aggiungiTier: "+ Add row",
    svuotaTutto: "Clear all",
    svuotaRiga: "Clear row",
    eliminaRiga: "Delete row",
    spostaSu: "Move up",
    spostaGiu: "Move down",
    cambiaColore: "Change color",
    rinominaTier: "Rename tier",
    ripristina: "Reset to default",
    esportaImmagine: "Download PNG image",
    esportazioneInCorso: "Generating PNG...",
    copiaLink: "Share link",
    linkCopiato: "Link copied!",
    poolEroi: "Available heroes",
    cercaPlaceholder: "Search hero by name...",
    tuttiGliAttributi: "All attributes",
    tutteLeRarita: "All rarities",
    trascinaQui: "Drag heroes here or click a card to assign",
    nessunEroeTrovato: "No heroes match the selected filters",
    eroiAssegnati: (n: number, tot: number) => `${n} of ${tot} heroes ranked`,
    rimuoviDalTier: "Remove from tier",
    assegnaATier: "Assign to:",
    chiudi: "Close",
    salvaSuAccount: "Save to Account",
    salvaModifiche: "Save changes",
    salvaComeNuova: "Save as new...",
    leMieTierList: (n: number) => `My Tier Lists (${n})`,
    nuovaTierList: "+ New Tier List",
    salvataggioInCorso: "Saving...",
    salvatoConSuccesso: "Tier list saved to your profile!",
    accediPerSalvare:
      "Log in to save multiple tier lists under your account, keep backups in your profile, and share permanent links.",
    entra: "Log in",
    elimina: "Delete",
    carica: "Load",
    confermaElimina: "Are you sure you want to delete this tier list?",
    scaricaBackup: "Download JSON Backup",
    visualizzandoDi: (autore: string) => `Viewing @${autore}'s Tier List`,
    copiaNelTuoMaker: "Clone into your account",
    titoloPlaceholder: "Tier List name (e.g. October PvP Meta)",
    nessunaTierListSalvata: "You don't have any saved tier lists for this game yet.",
    salvaNuovaCopia: "Save as new copy",
    annulla: "Cancel",
    conferma: "Save",
    nomeTierList: "Name for the new Tier List:",
  },
});

interface TierListMakerProps {
  game: string;
  gameName: string;
  locale: Locale;
  heroes: readonly TierHeroItem[];
  rarities: readonly string[];
  affinities: readonly { id: string; name: string }[];
  viewer?: { id: string; username: string; displayName: string } | null;
  initialTierList?: SavedTierListDetail | null;
  initialSavedLists?: SavedTierListSummary[];
}

export function TierListMaker({
  game,
  gameName,
  locale,
  heroes,
  rarities,
  affinities,
  viewer = null,
  initialTierList = null,
  initialSavedLists = [],
}: TierListMakerProps) {
  const t = TESTI[locale];
  const storageKey = `gz_tierlist_${game}`;

  const heroesMap = useMemo(() => new Map(heroes.map((h) => [h.id, h])), [heroes]);

  // Stato principale della Tier List
  const [currentId, setCurrentId] = useState<string | null>(initialTierList?.id ?? null);
  const [title, setTitle] = useState<string>(
    initialTierList?.title || (locale === "it" ? "La mia Tier List" : "My Tier List"),
  );
  const [tiers, setTiers] = useState<TierRow[]>(() =>
    initialTierList ? initialTierList.tiers : defaultTiers(),
  );
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    if (initialTierList) return Boolean(initialTierList.isOwner);
    return viewer !== null;
  });
  const [authorInfo, setAuthorInfo] = useState<{ username: string; displayName: string } | null>(
    initialTierList && !initialTierList.isOwner
      ? {
          username: initialTierList.author?.username ?? "user",
          displayName: initialTierList.author?.displayName ?? "User",
        }
      : null,
  );

  // Lista delle tier list salvate dell'utente per questo gioco
  const [savedLists, setSavedLists] = useState<SavedTierListSummary[]>(initialSavedLists);

  // Filtri e ricerca
  const [search, setSearch] = useState<string>("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedAffinity, setSelectedAffinity] = useState<string | null>(null);

  // UI modali ed editor
  const [activeColorPickerTierId, setActiveColorPickerTierId] = useState<string | null>(null);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");

  const [selectedHeroForAction, setSelectedHeroForAction] = useState<{
    heroId: string;
    fromTierId: string | null;
  } | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Modali gestione account
  const [showSavedListsModal, setShowSavedListsModal] = useState<boolean>(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState<boolean>(false);
  const [saveAsTitle, setSaveAsTitle] = useState<string>("");

  // Caricamento iniziale da URL hash o localStorage se non stiamo caricando una tier list salvata da DB
  useEffect(() => {
    if (initialTierList) return;

    try {
      const hash = window.location.hash;
      if (hash.startsWith("#data=")) {
        const decoded = JSON.parse(decodeURIComponent(hash.slice(6)));
        if (Array.isArray(decoded)) {
          setTiers(decoded);
          return;
        }
      }

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTiers(parsed);
        }
      }
    } catch {
      // Ignora errori di parsing su dati corrotti
    }
  }, [storageKey, initialTierList]);

  // Salvataggio automatico locale in localStorage come backup immediato
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tiers));
    } catch {
      // localStorage disabilitato
    }
  }, [tiers, storageKey]);

  // Set di ID eroi già posizionati
  const assignedHeroIds = useMemo(() => {
    const set = new Set<string>();
    for (const tier of tiers) {
      for (const id of tier.heroIds) set.add(id);
    }
    return set;
  }, [tiers]);

  // Eroi disponibili nel pool (filtrati)
  const availableHeroes = useMemo(() => {
    const term = search.trim().toLowerCase();
    return heroes.filter((hero) => {
      if (assignedHeroIds.has(hero.id)) return false;
      if (selectedRarity && hero.rarity !== selectedRarity) return false;
      if (selectedAffinity && hero.affinity !== selectedAffinity) return false;
      if (term) {
        const matchName = hero.name.toLowerCase().includes(term);
        const matchEpithet = hero.epithet?.toLowerCase().includes(term);
        if (!matchName && !matchEpithet) return false;
      }
      return true;
    });
  }, [heroes, assignedHeroIds, search, selectedRarity, selectedAffinity]);

  // Drag and Drop
  const dragItem = useRef<{ heroId: string; fromTierId: string | null } | null>(null);

  const handleDragStart = (heroId: string, fromTierId: string | null) => {
    dragItem.current = { heroId, fromTierId };
  };

  const handleDropOnTier = (targetTierId: string) => {
    if (!dragItem.current) return;
    const { heroId, fromTierId } = dragItem.current;

    setTiers((prev) =>
      prev.map((tier) => {
        if (tier.id === targetTierId) {
          if (fromTierId === targetTierId) return tier;
          return { ...tier, heroIds: [...tier.heroIds, heroId] };
        }
        if (fromTierId && tier.id === fromTierId) {
          return { ...tier, heroIds: tier.heroIds.filter((id) => id !== heroId) };
        }
        return tier;
      }),
    );
    dragItem.current = null;
  };

  const handleDropOnPool = () => {
    if (!dragItem.current) return;
    const { heroId, fromTierId } = dragItem.current;
    if (fromTierId) {
      setTiers((prev) =>
        prev.map((tier) =>
          tier.id === fromTierId
            ? { ...tier, heroIds: tier.heroIds.filter((id) => id !== heroId) }
            : tier,
        ),
      );
    }
    dragItem.current = null;
  };

  // Azioni sulle righe
  const handleAddTier = () => {
    const newTier: TierRow = {
      id: `tier-${Date.now()}`,
      label: "NEW",
      color: TIER_COLORS[tiers.length % TIER_COLORS.length]!.hex,
      heroIds: [],
    };
    setTiers((prev) => [...prev, newTier]);
  };

  const handleMoveTier = (index: number, direction: "up" | "down") => {
    setTiers((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index]!;
      next[index] = next[targetIndex]!;
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleClearTier = (tierId: string) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === tierId ? { ...tier, heroIds: [] } : tier)),
    );
  };

  const handleDeleteTier = (tierId: string) => {
    setTiers((prev) => prev.filter((tier) => tier.id !== tierId));
  };

  const handleClearAll = () => {
    setTiers((prev) => prev.map((tier) => ({ ...tier, heroIds: [] })));
  };

  const handleResetDefault = () => {
    setTiers(defaultTiers());
    setCurrentId(null);
    setAuthorInfo(null);
    setIsOwner(viewer !== null);
    setTitle(locale === "it" ? "La mia Tier List" : "My Tier List");
    localStorage.removeItem(storageKey);
  };

  const handleAssignHeroToTier = (heroId: string, targetTierId: string) => {
    setTiers((prev) =>
      prev.map((tier) => {
        if (tier.id === targetTierId) {
          if (tier.heroIds.includes(heroId)) return tier;
          return { ...tier, heroIds: [...tier.heroIds, heroId] };
        }
        return { ...tier, heroIds: tier.heroIds.filter((id) => id !== heroId) };
      }),
    );
    setSelectedHeroForAction(null);
  };

  const handleRemoveHero = (heroId: string) => {
    setTiers((prev) =>
      prev.map((tier) => ({
        ...tier,
        heroIds: tier.heroIds.filter((id) => id !== heroId),
      })),
    );
    setSelectedHeroForAction(null);
  };

  // Salva sul database account
  const handleSaveToAccount = async (targetId?: string | null, customTitle?: string) => {
    if (!viewer) return;

    try {
      setIsSaving(true);
      const effectiveTitle = (customTitle ?? title).trim() || "Tier List";

      const res = await saveTierListAction({
        id: targetId !== undefined ? (targetId ?? undefined) : (isOwner && currentId ? currentId : undefined),
        game,
        title: effectiveTitle,
        tiers,
      });

      if (res.ok && res.tierListId) {
        setCurrentId(res.tierListId);
        setTitle(effectiveTitle);
        setIsOwner(true);
        setAuthorInfo(null);

        // Aggiorna l'URL nel browser con il nuovo ID senza ricaricare la pagina
        const newUrl = `${window.location.pathname}?id=${res.tierListId}`;
        window.history.replaceState({ ...window.history.state }, "", newUrl);

        setStatusMessage(t.salvatoConSuccesso);
        setTimeout(() => setStatusMessage(null), 3500);

        // Aggiorna l'elenco locale dei salvataggi
        if (res.tierList) {
          const summary: SavedTierListSummary = {
            id: res.tierList.id,
            title: res.tierList.title,
            description: res.tierList.description,
            game: res.tierList.game,
            isPublic: res.tierList.isPublic,
            heroCount: res.tierList.heroCount,
            tierCount: res.tierList.tierCount,
            topHeroIds: res.tierList.topHeroIds,
            createdAt: res.tierList.createdAt,
            updatedAt: res.tierList.updatedAt,
            author: res.tierList.author,
            isOwner: true,
          };
          setSavedLists((prev) => {
            const filtered = prev.filter((item) => item.id !== summary.id);
            return [summary, ...filtered];
          });
        }
      } else if (res.error) {
        setStatusMessage(res.error);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch {
      setStatusMessage("Errore durante il salvataggio.");
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Carica una tier list dalla lista salvata
  const handleLoadSavedTierList = (item: SavedTierListSummary) => {
    if (Array.isArray(item.tiers)) {
      setTiers(item.tiers);
    }
    setTitle(item.title);
    setCurrentId(item.id);
    setIsOwner(true);
    setAuthorInfo(null);

    const newUrl = `${window.location.pathname}?id=${item.id}`;
    window.history.replaceState({ ...window.history.state }, "", newUrl);
    setShowSavedListsModal(false);
  };

  // Elimina tier list
  const handleDeleteSavedTierList = async (id: string) => {
    if (!window.confirm(t.confermaElimina)) return;

    try {
      const res = await deleteTierListAction(id);
      if (res.ok) {
        setSavedLists((prev) => prev.filter((item) => item.id !== id));
        if (currentId === id) {
          setCurrentId(null);
          window.history.replaceState({ ...window.history.state }, "", window.location.pathname);
        }
      }
    } catch {
      // Errore
    }
  };

  // Scarica Backup JSON
  const handleDownloadBackup = async () => {
    try {
      const backup = await getTierListBackupAction();
      if (!backup) return;

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gachazone-tierlists-backup-${backup.username}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Ignora
    }
  };

  // Esportazione Immagine
  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      await exportTierListToImage({
        title: title || `Tier List · ${gameName}`,
        subtitle: authorInfo ? `di @${authorInfo.username} · GachaZone` : "GachaZone",
        tiers,
        heroesMap,
        filename: `tierlist-${game}.png`,
      });
    } catch {
      // Fallback
    } finally {
      setIsExporting(false);
    }
  };

  // Condividi Link permanente o fallback hash
  const handleShareLink = () => {
    try {
      let url: string;
      if (currentId) {
        url = `${window.location.origin}${window.location.pathname}?id=${currentId}`;
      } else {
        const minimalData = tiers.map((t) => ({
          id: t.id,
          label: t.label,
          color: t.color,
          heroIds: t.heroIds,
        }));
        const serialized = encodeURIComponent(JSON.stringify(minimalData));
        url = `${window.location.origin}${window.location.pathname}#data=${serialized}`;
      }

      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Ignora errori clipboard
    }
  };

  return (
    <div className="grid gap-6">
      {/* Banner se si sta visualizzando la tier list condivisa di un altro utente */}
      {authorInfo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-brand/40 bg-brand/10 p-4">
          <div className="flex items-center gap-2">
            <span className="text-brand font-bold">ℹ</span>
            <p className="text-sm text-ink">
              {t.visualizzandoDi(authorInfo.username)}:{" "}
              <strong className="text-brand">{title}</strong>
            </p>
          </div>
          {viewer ? (
            <button
              type="button"
              onClick={() => handleSaveToAccount(null, `${title} (Copia)`)}
              className={buttonClass("primary", "sm")}
            >
              {t.copiaNelTuoMaker}
            </button>
          ) : (
            <Link href="/entra" className={buttonClass("outline", "sm")}>
              {t.entra} per salvare
            </Link>
          )}
        </div>
      ) : null}

      {/* Intestazione Titolo Tier List e Barra Account */}
      <div className="p5-corner flex flex-col gap-3 border border-rule bg-paper-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titoloPlaceholder}
              className="w-full bg-paper px-3 py-1.5 text-base font-bold text-ink border border-rule focus:border-brand focus:outline-none"
              maxLength={80}
            />
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-ink-3">
            {currentId && isOwner ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span>☁</span> Salvata sul tuo account
              </span>
            ) : viewer ? (
              <span>Modifica in corso (locale)</span>
            ) : null}
            {statusMessage ? (
              <span className="font-semibold text-brand animate-pulse">{statusMessage}</span>
            ) : null}
          </div>
        </div>

        {/* Pulsanti Account e Backup */}
        <div className="flex flex-wrap items-center gap-2">
          {viewer ? (
            <>
              {currentId && isOwner ? (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveToAccount(currentId)}
                  className={buttonClass("primary", "sm")}
                >
                  {isSaving ? t.salvataggioInCorso : t.salvaModifiche}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveToAccount(null)}
                  className={buttonClass("primary", "sm")}
                >
                  {isSaving ? t.salvataggioInCorso : t.salvaSuAccount}
                </button>
              )}

              {currentId && isOwner ? (
                <button
                  type="button"
                  onClick={() => {
                    setSaveAsTitle(`${title} (Copia)`);
                    setShowSaveAsModal(true);
                  }}
                  className={buttonClass("outline", "sm")}
                >
                  {t.salvaComeNuova}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setShowSavedListsModal(true)}
                className={buttonClass("ghost", "sm")}
              >
                {t.leMieTierList(savedLists.length)}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-3 hidden md:inline">{t.accediPerSalvare}</span>
              <Link href="/entra" className={buttonClass("outline", "sm")}>
                {t.entra}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Barra comandi globale */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-paper-2 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAddTier}
            className={buttonClass("primary", "sm")}
          >
            {t.aggiungiTier}
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className={buttonClass("outline", "sm")}
          >
            {t.svuotaTutto}
          </button>
          <button
            type="button"
            onClick={handleResetDefault}
            className={buttonClass("ghost", "sm")}
          >
            {t.ripristina}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleShareLink}
            className={buttonClass("outline", "sm")}
            title="Copia link permanente o snapshot condivisibile"
          >
            {linkCopied ? `✓ ${t.linkCopiato}` : t.copiaLink}
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportImage}
            className={buttonClass("primary", "sm")}
          >
            {isExporting ? t.esportazioneInCorso : t.esportaImmagine}
          </button>
        </div>
      </div>

      {/* Tabellone Tier List */}
      <div className="grid gap-2">
        {tiers.map((tier, index) => {
          const isColorPickerOpen = activeColorPickerTierId === tier.id;
          const isEditing = editingTierId === tier.id;

          return (
            <div
              key={tier.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOnTier(tier.id)}
              className="flex min-h-[90px] border border-rule bg-paper-2 transition-colors"
            >
              {/* Etichetta Tier colorata a sinistra */}
              <div
                className="relative flex w-28 shrink-0 flex-col items-center justify-between p-2 select-none sm:w-32"
                style={{ backgroundColor: tier.color }}
              >
                {/* Controlli riga (sposta, colore, opzioni) */}
                <div className="flex w-full items-center justify-between text-white/90">
                  <div className="flex items-center gap-0.5">
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleMoveTier(index, "up")}
                        title={t.spostaSu}
                        className="rounded p-0.5 hover:bg-black/30 text-[10px] leading-none"
                      >
                        ▲
                      </button>
                    ) : null}
                    {index < tiers.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => handleMoveTier(index, "down")}
                        title={t.spostaGiu}
                        className="rounded p-0.5 hover:bg-black/30 text-[10px] leading-none"
                      >
                        ▼
                      </button>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveColorPickerTierId(isColorPickerOpen ? null : tier.id)
                      }
                      title={t.cambiaColore}
                      className="rounded p-0.5 hover:bg-black/30 text-xs"
                    >
                      🎨
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTierId(isEditing ? null : tier.id);
                        setEditingLabel(tier.label);
                      }}
                      title={t.rinominaTier}
                      className="rounded p-0.5 hover:bg-black/30 text-xs"
                    >
                      ✎
                    </button>
                  </div>
                </div>

                {/* Testo etichetta Tier (o input di rinomina) */}
                <div className="my-auto text-center w-full px-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingLabel}
                      autoFocus
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onBlur={() => {
                        const trimmed = editingLabel.trim();
                        if (trimmed) {
                          setTiers((prev) =>
                            prev.map((r) =>
                              r.id === tier.id ? { ...r, label: trimmed } : r,
                            ),
                          );
                        }
                        setEditingTierId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const trimmed = editingLabel.trim();
                          if (trimmed) {
                            setTiers((prev) =>
                              prev.map((r) =>
                                r.id === tier.id ? { ...r, label: trimmed } : r,
                              ),
                            );
                          }
                          setEditingTierId(null);
                        } else if (e.key === "Escape") {
                          setEditingTierId(null);
                        }
                      }}
                      className="w-full bg-black/60 px-1 py-0.5 text-center font-extrabold text-sm text-white focus:outline-none"
                      maxLength={12}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingTierId(tier.id);
                        setEditingLabel(tier.label);
                      }}
                      className="cursor-pointer font-black text-lg tracking-wider text-white drop-shadow-md hover:underline"
                    >
                      {tier.label}
                    </span>
                  )}
                </div>

                {/* Pulizia o eliminazione riga */}
                <div className="flex w-full items-center justify-between text-[10px] text-white/80">
                  <button
                    type="button"
                    onClick={() => handleClearTier(tier.id)}
                    title={t.svuotaRiga}
                    className="hover:text-white"
                  >
                    CLR
                  </button>
                  {tiers.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteTier(tier.id)}
                      title={t.eliminaRiga}
                      className="hover:text-white"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                {/* Color picker a scomparsa */}
                {isColorPickerOpen ? (
                  <div
                    className="absolute top-full left-0 z-30 mt-1 grid grid-cols-4 gap-1.5 border border-rule bg-paper-2 p-2 shadow-xl"
                    onMouseLeave={() => setActiveColorPickerTierId(null)}
                  >
                    {TIER_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.label}
                        onClick={() => {
                          setTiers((prev) =>
                            prev.map((r) =>
                              r.id === tier.id ? { ...r, color: c.hex } : r,
                            ),
                          );
                          setActiveColorPickerTierId(null);
                        }}
                        className="h-5 w-5 rounded border border-white/20 transition-transform hover:scale-125"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Area di drop e contenitore delle card eroi posizionate */}
              <div className="flex flex-1 flex-wrap items-center content-start gap-1.5 p-2 min-h-[90px] overflow-x-auto">
                {tier.heroIds.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink-3/60 italic select-none">
                    {t.trascinaQui}
                  </div>
                ) : (
                  tier.heroIds.map((heroId, heroIdx) => {
                    const hero = heroesMap.get(heroId);
                    if (!hero) return null;

                    return (
                      <div
                        key={`${tier.id}-${hero.id}-${heroIdx}`}
                        draggable
                        onDragStart={() => handleDragStart(hero.id, tier.id)}
                        onClick={() =>
                          setSelectedHeroForAction({ heroId: hero.id, fromTierId: tier.id })
                        }
                        title={`${hero.name} · Clicca per spostare o rimuovere`}
                        className="group relative h-16 w-16 shrink-0 cursor-grab active:cursor-grabbing border border-rule-2 bg-paper transition-transform hover:scale-105 hover:z-10 select-none"
                      >
                        <Image
                          src={hero.cardSrc}
                          alt={hero.name}
                          width={64}
                          height={64}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveHero(hero.id);
                          }}
                          className="absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white group-hover:flex"
                          title={t.rimuoviDalTier}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Banco degli eroi disponibili (Hero Pool) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnPool}
        className="p5-corner border border-rule bg-paper-2 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule-2 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
              {t.poolEroi}
            </h3>
            <span className={eyebrow}>
              {t.eroiAssegnati(assignedHeroIds.size, heroes.length)}
            </span>
          </div>

          {/* Campo di ricerca rapida */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.cercaPlaceholder}
              className="w-full border border-rule bg-paper px-3 py-1.5 text-xs text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {/* Filtri combinati per rarità e attributo */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {/* Rarità */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRarity(null)}
              className={cx(
                "rounded px-2 py-1 font-semibold transition-colors",
                selectedRarity === null
                  ? "bg-brand text-white"
                  : "bg-paper text-ink-3 hover:text-ink",
              )}
            >
              {t.tutteLeRarita}
            </button>
            {rarities.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRarity(selectedRarity === r ? null : r)}
                className={cx(
                  "rounded px-2 py-1 font-semibold transition-colors",
                  selectedRarity === r
                    ? "bg-brand text-white"
                    : "bg-paper text-ink-3 hover:text-ink",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-rule-2" />

          {/* Attributi */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedAffinity(null)}
              className={cx(
                "rounded px-2 py-1 font-semibold transition-colors",
                selectedAffinity === null
                  ? "bg-brand text-white"
                  : "bg-paper text-ink-3 hover:text-ink",
              )}
            >
              {t.tuttiGliAttributi}
            </button>
            {affinities.map((aff) => (
              <button
                key={aff.id}
                type="button"
                onClick={() =>
                  setSelectedAffinity(selectedAffinity === aff.name ? null : aff.name)
                }
                className={cx(
                  "rounded px-2 py-1 font-semibold transition-colors",
                  selectedAffinity === aff.name
                    ? "bg-brand text-white"
                    : "bg-paper text-ink-3 hover:text-ink",
                )}
              >
                {aff.name}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia delle miniature eroi nel pool */}
        <div className="mt-4 max-h-[460px] overflow-y-auto rounded border border-rule-2 bg-paper/40 p-3 [scrollbar-width:thin]">
          {availableHeroes.length === 0 ? (
            <p className="py-12 text-center text-xs text-ink-3">{t.nessunEroeTrovato}</p>
          ) : (
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14">
              {availableHeroes.map((hero) => (
                <div
                  key={hero.id}
                  draggable
                  onDragStart={() => handleDragStart(hero.id, null)}
                  onClick={() =>
                    setSelectedHeroForAction({ heroId: hero.id, fromTierId: null })
                  }
                  title={`${hero.name} · Clicca per assegnare`}
                  className="group relative aspect-square cursor-grab active:cursor-grabbing border border-rule-2 bg-paper transition-transform hover:scale-110 hover:z-10 select-none"
                >
                  <Image
                    src={hero.cardSrc}
                    alt={hero.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Elenco delle mie Tier List salvate */}
      {showSavedListsModal ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowSavedListsModal(false)}
        >
          <div
            className="p5-corner max-w-lg w-full border border-rule bg-paper-2 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rule-2 pb-3">
              <h3 className="text-base font-bold text-ink">
                {t.leMieTierList(savedLists.length)}
              </h3>
              <button
                type="button"
                onClick={() => setShowSavedListsModal(false)}
                className="text-ink-3 hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="my-4 max-h-80 overflow-y-auto space-y-2 [scrollbar-width:thin]">
              {savedLists.length === 0 ? (
                <p className="py-8 text-center text-xs text-ink-3">
                  {t.nessunaTierListSalvata}
                </p>
              ) : (
                savedLists.map((item) => (
                  <div
                    key={item.id}
                    className={cx(
                      "flex flex-col gap-2 rounded border p-3 transition-colors",
                      item.id === currentId
                        ? "border-brand bg-brand/5"
                        : "border-rule bg-paper hover:border-rule-2",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-ink truncate max-w-[280px]">
                        {item.title}
                      </h4>
                      <span suppressHydrationWarning className="text-[11px] text-ink-3">
                        {new Date(item.updatedAt).toLocaleDateString(locale)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-ink-3">
                      <span>{item.heroCount} eroi posizionati</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleLoadSavedTierList(item)}
                          className={buttonClass("primary", "sm")}
                        >
                          {t.carica}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = `${window.location.origin}${window.location.pathname}?id=${item.id}`;
                            navigator.clipboard.writeText(url);
                            setStatusMessage(t.linkCopiato);
                            setTimeout(() => setStatusMessage(null), 2500);
                          }}
                          className={buttonClass("outline", "sm")}
                          title="Copia link diretto"
                        >
                          🔗
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedTierList(item.id)}
                          className="rounded px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-500/10"
                          title="Elimina"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-rule-2 pt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className={buttonClass("outline", "sm")}
              >
                💾 {t.scaricaBackup}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleResetDefault();
                  setShowSavedListsModal(false);
                }}
                className={buttonClass("ghost", "sm")}
              >
                {t.nuovaTierList}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal: Salva con nuovo nome */}
      {showSaveAsModal ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowSaveAsModal(false)}
        >
          <div
            className="p5-corner max-w-sm w-full border border-rule bg-paper-2 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-base text-ink mb-3">{t.salvaNuovaCopia}</h4>
            <p className="text-xs text-ink-3 mb-2">{t.nomeTierList}</p>
            <input
              type="text"
              value={saveAsTitle}
              onChange={(e) => setSaveAsTitle(e.target.value)}
              className="w-full border border-rule bg-paper px-3 py-2 text-sm text-ink mb-4 focus:border-brand focus:outline-none"
              maxLength={80}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSaveAsModal(false)}
                className={buttonClass("ghost", "sm")}
              >
                {t.annulla}
              </button>
              <button
                type="button"
                disabled={!saveAsTitle.trim() || isSaving}
                onClick={async () => {
                  await handleSaveToAccount(null, saveAsTitle.trim());
                  setShowSaveAsModal(false);
                }}
                className={buttonClass("primary", "sm")}
              >
                {isSaving ? t.salvataggioInCorso : t.conferma}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal: Action sheet rapido al click sull'eroe (Touch / mobile friendly) */}
      {selectedHeroForAction ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedHeroForAction(null)}
        >
          <div
            className="p5-corner max-w-sm w-full border border-rule bg-paper-2 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const hero = heroesMap.get(selectedHeroForAction.heroId);
              if (!hero) return null;

              return (
                <div>
                  <div className="flex items-center gap-3">
                    <Image
                      src={hero.cardSrc}
                      alt={hero.name}
                      width={52}
                      height={52}
                      unoptimized
                      className="border border-rule-2"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-ink">{hero.name}</h4>
                      {hero.epithet ? (
                        <p className="text-xs text-ink-3">{hero.epithet}</p>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-2">
                    {t.assegnaATier}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tiers.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleAssignHeroToTier(hero.id, tier.id)}
                        className="rounded px-3 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105"
                        style={{ backgroundColor: tier.color }}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>

                  {selectedHeroForAction.fromTierId ? (
                    <div className="mt-4 border-t border-rule-2 pt-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveHero(hero.id)}
                        className={buttonClass("outline", "sm")}
                      >
                        {t.rimuoviDalTier}
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedHeroForAction(null)}
                      className={buttonClass("ghost", "sm")}
                    >
                      {t.chiudi}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : null}
    </div>
  );
}
