"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
import { copyTitle, parseTierRows, TIER_LIST_LIMITS } from "@/lib/tier-list/validation";
import { testi, type Locale } from "@/lib/i18n/locale";
import { SITE_NAME } from "@/lib/site";

const TESTI = testi({
  it: {
    titolo: "Tier List Maker",
    titoloPredefinito: "La mia Tier List",
    tierListDelGioco: (gioco: string) => `Tier List · ${gioco}`,
    nomeLista: "Nome della Tier List",
    aggiungiTier: "+ Aggiungi riga",
    righeMassime: (n: number) => `Al massimo ${n} righe`,
    nuovaRiga: "NUOVA",
    svuotaTutto: "Svuota tutto",
    svuotaRiga: "Svuota riga",
    svuotaRigaBreve: "Svuota",
    eliminaRiga: "Elimina riga",
    spostaSu: "Sposta su",
    spostaGiu: "Sposta giù",
    cambiaColore: "Cambia colore",
    coloriRiga: (riga: string) => `Colori della riga ${riga}`,
    rinominaTier: "Rinomina tier",
    ripristina: "Ripristina predefiniti",
    esportaImmagine: "Scarica immagine PNG",
    esportazioneInCorso: "Generazione PNG...",
    immagineFallita: "Non è stato possibile creare l'immagine su questo dispositivo.",
    diAutore: (autore: string) => `di @${autore}`,
    copiaLink: "Condividi link",
    suggerimentoLink: "Copia il link permanente o un'istantanea condivisibile",
    linkCopiato: "Link copiato!",
    linkPrivato: "Link copiato: la lista è privata, si apre solo dal tuo account.",
    copiaFallita: "Copia non riuscita: il browser non ha dato accesso agli appunti.",
    poolEroi: "Eroi disponibili",
    cercaPlaceholder: "Cerca eroe per nome...",
    tuttiGliAttributi: "Tutti gli attributi",
    tutteLeRarita: "Tutte le rarità",
    trascinaQui: "Trascina qui gli eroi o clicca una card per assegnarla",
    nessunEroeTrovato: "Nessun eroe corrisponde ai filtri selezionati",
    eroiAssegnati: (n: number, tot: number) => `${n} di ${tot} eroi posizionati`,
    eroiPosizionati: (n: number) => `${n} eroi posizionati`,
    suggerimentoInRiga: (eroe: string) => `${eroe} · Clicca per spostare o rimuovere`,
    suggerimentoPool: (eroe: string) => `${eroe} · Clicca per assegnare`,
    rimuoviDalTier: "Rimuovi dal tier",
    rimuoviEroe: (eroe: string) => `Rimuovi ${eroe} dal tier`,
    assegnaATier: "Assegna a:",
    chiudi: "Chiudi",
    salvaSuAccount: "Salva su Account",
    salvaModifiche: "Salva modifiche",
    salvaComeNuova: "Salva con nuovo nome...",
    visibileNelProfilo: "Visibile nel profilo",
    suggerimentoVisibile:
      "Se togli la spunta la lista resta solo tua: non compare nel profilo e il link non si apre per gli altri.",
    nelProfilo: "Nel profilo",
    privata: "Privata",
    leMieTierList: (n: number) => `Le mie Tier List (${n})`,
    nuovaTierList: "+ Nuova Tier List",
    salvataggioInCorso: "Salvataggio...",
    salvatoConSuccesso: "Tier List salvata sul tuo profilo!",
    erroreSalvataggio: "Errore durante il salvataggio.",
    salvataSuAccount: "Salvata sul tuo account",
    modificaLocale: "Modifica in corso (locale)",
    accediPerSalvare:
      "Accedi per salvare più tier list con nomi diversi sul tuo account, visualizzarle nel profilo e condividerle con un link permanente.",
    entra: "Accedi",
    entraPerSalvare: "Accedi per salvare",
    elimina: "Elimina",
    carica: "Carica",
    copiaLinkDiretto: "Copia link diretto",
    confermaElimina: "Sei sicuro di voler eliminare questa tier list?",
    scaricaBackup: "Scarica Backup JSON",
    visualizzandoDi: (autore: string) => `Stai visualizzando la Tier List di @${autore}`,
    copiaNelTuoMaker: "Clona nel tuo account",
    suffissoCopia: " (Copia)",
    titoloPlaceholder: "Nome della Tier List (es. PvP Meta Ottobre)",
    nessunaTierListSalvata: "Non hai ancora tier list salvate su questo account per questo gioco.",
    salvaNuovaCopia: "Salva nuova copia",
    annulla: "Annulla",
    conferma: "Salva",
    nomeTierList: "Nome della nuova Tier List:",
  },
  en: {
    titolo: "Tier List Maker",
    titoloPredefinito: "My Tier List",
    tierListDelGioco: (gioco: string) => `Tier List · ${gioco}`,
    nomeLista: "Tier List name",
    aggiungiTier: "+ Add row",
    righeMassime: (n: number) => `At most ${n} rows`,
    nuovaRiga: "NEW",
    svuotaTutto: "Clear all",
    svuotaRiga: "Clear row",
    svuotaRigaBreve: "Clear",
    eliminaRiga: "Delete row",
    spostaSu: "Move up",
    spostaGiu: "Move down",
    cambiaColore: "Change color",
    coloriRiga: (riga: string) => `Colors for row ${riga}`,
    rinominaTier: "Rename tier",
    ripristina: "Reset to default",
    esportaImmagine: "Download PNG image",
    esportazioneInCorso: "Generating PNG...",
    immagineFallita: "The image couldn't be created on this device.",
    diAutore: (autore: string) => `by @${autore}`,
    copiaLink: "Share link",
    suggerimentoLink: "Copy the permanent link or a shareable snapshot",
    linkCopiato: "Link copied!",
    linkPrivato: "Link copied: the list is private, it only opens from your account.",
    copiaFallita: "Copy failed: the browser denied access to the clipboard.",
    poolEroi: "Available heroes",
    cercaPlaceholder: "Search hero by name...",
    tuttiGliAttributi: "All attributes",
    tutteLeRarita: "All rarities",
    trascinaQui: "Drag heroes here or click a card to assign",
    nessunEroeTrovato: "No heroes match the selected filters",
    eroiAssegnati: (n: number, tot: number) => `${n} of ${tot} heroes ranked`,
    eroiPosizionati: (n: number) => `${n} heroes ranked`,
    suggerimentoInRiga: (eroe: string) => `${eroe} · Click to move or remove`,
    suggerimentoPool: (eroe: string) => `${eroe} · Click to assign`,
    rimuoviDalTier: "Remove from tier",
    rimuoviEroe: (eroe: string) => `Remove ${eroe} from the tier`,
    assegnaATier: "Assign to:",
    chiudi: "Close",
    salvaSuAccount: "Save to Account",
    salvaModifiche: "Save changes",
    salvaComeNuova: "Save as new...",
    visibileNelProfilo: "Visible on profile",
    suggerimentoVisibile:
      "Untick it to keep the list to yourself: it won't appear on your profile and the link won't open for others.",
    nelProfilo: "On profile",
    privata: "Private",
    leMieTierList: (n: number) => `My Tier Lists (${n})`,
    nuovaTierList: "+ New Tier List",
    salvataggioInCorso: "Saving...",
    salvatoConSuccesso: "Tier list saved to your profile!",
    erroreSalvataggio: "Error while saving.",
    salvataSuAccount: "Saved to your account",
    modificaLocale: "Editing (local only)",
    accediPerSalvare:
      "Log in to save multiple tier lists under your account, keep backups in your profile, and share permanent links.",
    entra: "Log in",
    entraPerSalvare: "Log in to save",
    elimina: "Delete",
    carica: "Load",
    copiaLinkDiretto: "Copy direct link",
    confermaElimina: "Are you sure you want to delete this tier list?",
    scaricaBackup: "Download JSON Backup",
    visualizzandoDi: (autore: string) => `Viewing @${autore}'s Tier List`,
    copiaNelTuoMaker: "Clone into your account",
    suffissoCopia: " (Copy)",
    titoloPlaceholder: "Tier List name (e.g. October PvP Meta)",
    nessunaTierListSalvata: "You don't have any saved tier lists for this game yet.",
    salvaNuovaCopia: "Save as new copy",
    annulla: "Cancel",
    conferma: "Save",
    nomeTierList: "Name for the new Tier List:",
  },
});

/**
 * Una finestra modale col <dialog> del browser: Esc la chiude, il fuoco ci entra
 * all'apertura e resta dentro finche' e' aperta (il resto della pagina diventa
 * inerte), e alla chiusura torna dove era. Fino al 24/10 erano div sopra la
 * pagina: niente Esc, e con la tastiera si continuava a girare dietro.
 */
function Finestra({
  label,
  onClose,
  className,
  children,
}: {
  label: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    // chiusa prima che React la tolga dalla pagina: cosi' il browser rimette il
    // fuoco sul comando che l'aveva aperta
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={label}
      onClose={() => {
        // l'evento arriva dopo: in sviluppo React monta, smonta e rimonta, e la
        // chiusura del finto smontaggio arriva quando la finestra e' gia' riaperta
        if (!dialog.current?.open) onClose();
      }}
      onClick={(event) => {
        // il clic sul fondo (fuori dal riquadro) chiude
        if (event.target === dialog.current) dialog.current?.close();
      }}
      className={cx(
        "p5-corner m-auto max-w-none border border-rule bg-paper-2 p-0 text-ink shadow-2xl backdrop:bg-black/75",
        className,
      )}
    >
      {children}
    </dialog>
  );
}

/** Copia negli appunti e dice se e' riuscito: senza permesso, o fuori da https, fallisce. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

interface TierListMakerProps {
  game: string;
  gameName: string;
  locale: Locale;
  heroes: readonly TierHeroItem[];
  rarities: readonly string[];
  /** `id` e' il valore degli eroi (`hero.affinity`), `name` l'etichetta nella lingua */
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
  // gli eroi che una tier list puo' contenere: con questi si controllano link e bozza
  const roster = useMemo(() => new Set(heroes.map((h) => h.id)), [heroes]);

  // Stato principale della Tier List
  const [currentId, setCurrentId] = useState<string | null>(initialTierList?.id ?? null);
  const [title, setTitle] = useState<string>(initialTierList?.title || t.titoloPredefinito);
  const [tiers, setTiers] = useState<TierRow[]>(() =>
    initialTierList ? initialTierList.tiers : defaultTiers(),
  );
  const [isPublic, setIsPublic] = useState<boolean>(initialTierList?.isPublic ?? true);
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

  /*
   * La bozza locale si scrive solo quando si modifica il tabellone. Fino al 24/10
   * si scriveva a ogni cambio, anche quello dell'apertura: chi apriva la lista di
   * un altro (link condiviso) perdeva la propria bozza senza aver toccato niente.
   * Aprire una lista, un link `#data=` o la bozza stessa non conta come modifica;
   * e mentre si guarda la lista di un altro la bozza non si scrive mai.
   */
  const boardEdited = useRef(false);

  /** Le modifiche di chi usa il Maker: le sole che finiscono nella bozza. */
  const editTiers = useCallback((update: (prev: TierRow[]) => TierRow[]) => {
    boardEdited.current = true;
    setTiers(update);
  }, []);

  /** Un tabellone arrivato da fuori (lista salvata, link, bozza): non e' una modifica. */
  const showBoard = useCallback((next: TierRow[]) => {
    boardEdited.current = false;
    setTiers(next);
  }, []);

  // Lista delle tier list salvate dell'utente per questo gioco
  const [savedLists, setSavedLists] = useState<SavedTierListSummary[]>(initialSavedLists);

  // Filtri e ricerca
  const [search, setSearch] = useState<string>("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedAffinity, setSelectedAffinity] = useState<string | null>(null);

  // UI modali ed editor
  const [activeColorPickerTierId, setActiveColorPickerTierId] = useState<string | null>(null);
  const colorButtons = useRef(new Map<string, HTMLButtonElement>());
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");

  const [selectedHeroForAction, setSelectedHeroForAction] = useState<{
    heroId: string;
    fromTierId: string | null;
  } | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Modali gestione account
  const [showSavedListsModal, setShowSavedListsModal] = useState<boolean>(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState<boolean>(false);
  const [saveAsTitle, setSaveAsTitle] = useState<string>("");

  /** Un messaggio sotto il titolo, che se ne va da solo; uno nuovo sostituisce il vecchio. */
  const flash = useCallback((message: string, ms = 3500) => {
    setStatusMessage(message);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusMessage(null), ms);
  }, []);

  // Caricamento iniziale da `#data=` o dalla bozza, se non si sta aprendo una
  // tier list salvata. Una volta sola: dopo un salvataggio la pagina si
  // aggiorna dal server con props nuove, e rileggere la bozza cambierebbe il
  // tabellone sotto le mani.
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    if (initialTierList) return;

    // Tutti e due passano dallo stesso schema del salvataggio: `[{}]` faceva
    // cadere la pagina. Un link non valido si ignora e si apre la bozza.
    try {
      const hash = window.location.hash;
      if (hash.startsWith("#data=")) {
        const shared = parseTierRows(JSON.parse(decodeURIComponent(hash.slice(6))), roster);
        if (shared) {
          showBoard(shared);
          return;
        }
      }
    } catch {
      // link troncato o non decodificabile
    }

    try {
      const saved = localStorage.getItem(storageKey);
      const draft = saved ? parseTierRows(JSON.parse(saved), roster) : null;
      if (draft) showBoard(draft);
    } catch {
      // bozza corrotta o localStorage disabilitato
    }
  }, [storageKey, initialTierList, roster, showBoard]);

  // Salvataggio automatico locale in localStorage come backup immediato
  useEffect(() => {
    if (authorInfo || !boardEdited.current) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(tiers));
    } catch {
      // localStorage disabilitato
    }
  }, [tiers, storageKey, authorInfo]);

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

  /**
   * Mette un eroe in una riga togliendolo da qualunque altra: un eroe sta al
   * massimo in un posto, ed e' la stessa regola che il salvataggio controlla.
   */
  const moveHeroToTier = (heroId: string, targetTierId: string) => {
    editTiers((prev) =>
      prev.map((tier) => {
        if (tier.id === targetTierId) {
          if (tier.heroIds.includes(heroId)) return tier;
          return { ...tier, heroIds: [...tier.heroIds, heroId] };
        }
        if (!tier.heroIds.includes(heroId)) return tier;
        return { ...tier, heroIds: tier.heroIds.filter((id) => id !== heroId) };
      }),
    );
  };

  // Drag and Drop
  const dragItem = useRef<{ heroId: string; fromTierId: string | null } | null>(null);

  const handleDragStart = (heroId: string, fromTierId: string | null) => {
    dragItem.current = { heroId, fromTierId };
  };

  const handleDropOnTier = (targetTierId: string) => {
    if (!dragItem.current) return;
    moveHeroToTier(dragItem.current.heroId, targetTierId);
    dragItem.current = null;
  };

  const handleDropOnPool = () => {
    if (!dragItem.current) return;
    const { heroId, fromTierId } = dragItem.current;
    if (fromTierId) handleRemoveHero(heroId);
    dragItem.current = null;
  };

  // Azioni sulle righe
  const canAddTier = tiers.length < TIER_LIST_LIMITS.rows;

  const handleAddTier = () => {
    if (!canAddTier) return;
    const newTier: TierRow = {
      // due righe aggiunte nello stesso millisecondo avrebbero avuto lo stesso id
      id: `tier-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      label: t.nuovaRiga,
      color: TIER_COLORS[tiers.length % TIER_COLORS.length]!.hex,
      heroIds: [],
    };
    editTiers((prev) => (prev.length < TIER_LIST_LIMITS.rows ? [...prev, newTier] : prev));
  };

  const handleMoveTier = (index: number, direction: "up" | "down") => {
    editTiers((prev) => {
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
    editTiers((prev) =>
      prev.map((tier) => (tier.id === tierId ? { ...tier, heroIds: [] } : tier)),
    );
  };

  const handleDeleteTier = (tierId: string) => {
    editTiers((prev) => (prev.length > 1 ? prev.filter((tier) => tier.id !== tierId) : prev));
  };

  const handleRenameTier = (tierId: string) => {
    const trimmed = editingLabel.trim().slice(0, TIER_LIST_LIMITS.label);
    if (trimmed) {
      editTiers((prev) => prev.map((r) => (r.id === tierId ? { ...r, label: trimmed } : r)));
    }
    setEditingTierId(null);
  };

  const handleSetColor = (tierId: string, hex: string) => {
    editTiers((prev) => prev.map((r) => (r.id === tierId ? { ...r, color: hex } : r)));
    closeColorPicker(tierId);
  };

  /** Chiude la tavolozza e rimette il fuoco sul suo pulsante, invece di perderlo. */
  const closeColorPicker = (tierId: string) => {
    setActiveColorPickerTierId(null);
    colorButtons.current.get(tierId)?.focus();
  };

  const handleClearAll = () => {
    editTiers((prev) => prev.map((tier) => ({ ...tier, heroIds: [] })));
  };

  // Ricominciare e' una modifica: il tabellone vuoto diventa la bozza
  const handleResetDefault = () => {
    editTiers(() => defaultTiers());
    setCurrentId(null);
    setAuthorInfo(null);
    setIsOwner(viewer !== null);
    setIsPublic(true);
    setTitle(t.titoloPredefinito);
    window.history.replaceState({ ...window.history.state }, "", window.location.pathname);
  };

  const handleAssignHeroToTier = (heroId: string, targetTierId: string) => {
    moveHeroToTier(heroId, targetTierId);
    setSelectedHeroForAction(null);
  };

  function handleRemoveHero(heroId: string) {
    editTiers((prev) =>
      prev.map((tier) =>
        tier.heroIds.includes(heroId)
          ? { ...tier, heroIds: tier.heroIds.filter((id) => id !== heroId) }
          : tier,
      ),
    );
    setSelectedHeroForAction(null);
  }

  /**
   * Salva sul database account: `targetId` e' la lista da sovrascrivere, null
   * per crearne una nuova. Dice se e' andata, per chi deve chiudere una finestra.
   */
  const handleSaveToAccount = async (targetId: string | null, customTitle?: string) => {
    if (!viewer) return false;

    setIsSaving(true);
    try {
      const effectiveTitle = (customTitle ?? title).trim() || t.titoloPredefinito;

      const res = await saveTierListAction({
        id: targetId ?? undefined,
        game,
        title: effectiveTitle,
        tiers,
        isPublic,
      });

      if (!res.ok || !res.tierListId) {
        flash(res.error ?? t.erroreSalvataggio, 5000);
        return false;
      }

      setCurrentId(res.tierListId);
      setTitle(effectiveTitle);
      setIsOwner(true);
      setAuthorInfo(null);

      // Aggiorna l'URL nel browser con il nuovo ID senza ricaricare la pagina
      const newUrl = `${window.location.pathname}?id=${res.tierListId}`;
      window.history.replaceState({ ...window.history.state }, "", newUrl);

      flash(t.salvatoConSuccesso);

      // Aggiorna l'elenco locale dei salvataggi. La voce porta le righe: senza,
      // ricaricarla dall'elenco cambiava titolo e id ma lasciava il tabellone
      // di prima, e «Salva modifiche» scriveva una lista sopra l'altra.
      if (res.tierList) {
        const summary: SavedTierListSummary = { ...res.tierList, isOwner: true };
        setSavedLists((prev) => [summary, ...prev.filter((item) => item.id !== summary.id)]);
      }
      return true;
    } catch {
      flash(t.erroreSalvataggio);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Carica una tier list dalla lista salvata
  const handleLoadSavedTierList = (item: SavedTierListSummary) => {
    // Senza righe non si cambia lista sul posto: la si apre dal server
    if (!item.tiers) {
      window.location.assign(`${window.location.pathname}?id=${item.id}`);
      return;
    }
    showBoard(item.tiers);
    setTitle(item.title);
    setCurrentId(item.id);
    setIsPublic(item.isPublic);
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
      if (!res.ok) {
        if (res.error) flash(res.error, 5000);
        return;
      }
      setSavedLists((prev) => prev.filter((item) => item.id !== id));
      if (currentId === id) {
        setCurrentId(null);
        window.history.replaceState({ ...window.history.state }, "", window.location.pathname);
      }
    } catch {
      // rete: la lista resta dov'era
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
      a.download = `heiki-tierlists-backup-${backup.username}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Ignora
    }
  };

  // Esportazione Immagine: se il dispositivo non riesce a crearla, lo si dice
  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportTierListToImage({
        title: title.trim() || t.tierListDelGioco(gameName),
        subtitle: authorInfo ? `${t.diAutore(authorInfo.username)} · ${SITE_NAME}` : SITE_NAME,
        tiers,
        heroesMap,
        filename: `tierlist-${game}.png`,
      });
    } catch {
      flash(t.immagineFallita, 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // Una lista salvata come privata si apre col link solo da chi l'ha fatta
  const isSavedPrivate = (id: string) => savedLists.find((item) => item.id === id)?.isPublic === false;

  // Condividi Link permanente o fallback hash. «Copiato» solo se la copia e' riuscita.
  const handleShareLink = async () => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = currentId
      ? `${base}?id=${currentId}`
      : `${base}#data=${encodeURIComponent(JSON.stringify(tiers))}`;

    if (!(await copyToClipboard(url))) {
      flash(t.copiaFallita, 5000);
      return;
    }
    if (currentId && isOwner && isSavedPrivate(currentId)) flash(t.linkPrivato, 5000);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopySavedLink = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
    if (!(await copyToClipboard(url))) {
      flash(t.copiaFallita, 5000);
      return;
    }
    flash(isSavedPrivate(id) ? t.linkPrivato : t.linkCopiato, isSavedPrivate(id) ? 5000 : 2500);
  };

  const statusLine = (
    <span role="status" className="font-semibold text-brand">
      {statusMessage}
    </span>
  );

  return (
    <div className="grid gap-6">
      {/* Banner se si sta visualizzando la tier list condivisa di un altro utente */}
      {authorInfo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-brand/40 bg-brand/10 p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-brand font-bold">ℹ</span>
            <p className="text-sm text-ink">
              {t.visualizzandoDi(authorInfo.username)}:{" "}
              <strong className="text-brand">{title}</strong>
            </p>
          </div>
          {viewer ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveToAccount(null, copyTitle(title, t.suffissoCopia))}
              className={buttonClass("primary", "sm")}
            >
              {t.copiaNelTuoMaker}
            </button>
          ) : (
            <Link href="/entra" className={buttonClass("outline", "sm")}>
              {t.entraPerSalvare}
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
              aria-label={t.nomeLista}
              className="w-full bg-paper px-3 py-1.5 text-base font-bold text-ink border border-rule focus:border-brand focus:outline-none"
              maxLength={TIER_LIST_LIMITS.title}
            />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-3">
            {currentId && isOwner ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span aria-hidden>☁</span> {t.salvataSuAccount}
              </span>
            ) : viewer ? (
              <span>{t.modificaLocale}</span>
            ) : null}
            {showSavedListsModal ? null : statusLine}
          </div>
        </div>

        {/* Pulsanti Account e Backup */}
        <div className="flex flex-wrap items-center gap-2">
          {viewer ? (
            <>
              <label
                className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-2"
                title={t.suggerimentoVisibile}
              >
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="accent-brand"
                />
                {t.visibileNelProfilo}
              </label>

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
                    setSaveAsTitle(copyTitle(title, t.suffissoCopia));
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
            disabled={!canAddTier}
            title={canAddTier ? undefined : t.righeMassime(TIER_LIST_LIMITS.rows)}
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
            title={t.suggerimentoLink}
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
                        aria-label={t.spostaSu}
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
                        aria-label={t.spostaGiu}
                        className="rounded p-0.5 hover:bg-black/30 text-[10px] leading-none"
                      >
                        ▼
                      </button>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      ref={(element) => {
                        if (element) colorButtons.current.set(tier.id, element);
                        else colorButtons.current.delete(tier.id);
                      }}
                      onClick={() =>
                        setActiveColorPickerTierId(isColorPickerOpen ? null : tier.id)
                      }
                      title={t.cambiaColore}
                      aria-label={t.cambiaColore}
                      aria-expanded={isColorPickerOpen}
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
                      aria-label={t.rinominaTier}
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
                      aria-label={t.rinominaTier}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onBlur={() => handleRenameTier(tier.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameTier(tier.id);
                        } else if (e.key === "Escape") {
                          setEditingTierId(null);
                        }
                      }}
                      className="w-full bg-black/60 px-1 py-0.5 text-center font-extrabold text-sm text-white focus:outline-none"
                      maxLength={TIER_LIST_LIMITS.label}
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
                    aria-label={t.svuotaRiga}
                    className="hover:text-white"
                  >
                    {t.svuotaRigaBreve}
                  </button>
                  {tiers.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteTier(tier.id)}
                      title={t.eliminaRiga}
                      aria-label={t.eliminaRiga}
                      className="hover:text-white"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                {/* Color picker a scomparsa: Esc lo chiude, il fuoco entra sul primo colore */}
                {isColorPickerOpen ? (
                  <div
                    role="group"
                    aria-label={t.coloriRiga(tier.label)}
                    className="absolute top-full left-0 z-30 mt-1 grid grid-cols-4 gap-1.5 border border-rule bg-paper-2 p-2 shadow-xl"
                    onMouseLeave={() => setActiveColorPickerTierId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.stopPropagation();
                        closeColorPicker(tier.id);
                      }
                    }}
                  >
                    {TIER_COLORS.map((c, colorIndex) => (
                      <button
                        key={c.hex}
                        type="button"
                        autoFocus={colorIndex === 0}
                        title={c.label[locale]}
                        aria-label={c.label[locale]}
                        aria-pressed={tier.color === c.hex}
                        onClick={() => handleSetColor(tier.id, c.hex)}
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

                    // Un pulsante e non un div: con la tastiera ci si arriva e
                    // si apre la scelta della riga; il nome e' quello dell'eroe
                    return (
                      <div
                        key={`${tier.id}-${hero.id}-${heroIdx}`}
                        className="group relative h-16 w-16 shrink-0"
                      >
                        <button
                          type="button"
                          draggable
                          onDragStart={() => handleDragStart(hero.id, tier.id)}
                          onClick={() =>
                            setSelectedHeroForAction({ heroId: hero.id, fromTierId: tier.id })
                          }
                          aria-label={hero.name}
                          title={t.suggerimentoInRiga(hero.name)}
                          className="block h-full w-full cursor-grab active:cursor-grabbing border border-rule-2 bg-paper transition-transform hover:scale-105 hover:z-10 select-none"
                        >
                          <Image
                            src={hero.cardSrc}
                            alt=""
                            width={64}
                            height={64}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveHero(hero.id)}
                          className="absolute -top-1 -right-1 z-20 hidden h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white group-hover:flex group-focus-within:flex"
                          title={t.rimuoviDalTier}
                          aria-label={t.rimuoviEroe(hero.name)}
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
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.cercaPlaceholder}
              aria-label={t.cercaPlaceholder}
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
              aria-pressed={selectedRarity === null}
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
                aria-pressed={selectedRarity === r}
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

          {/* Attributi: si filtra per id, si mostra il nome nella lingua */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedAffinity(null)}
              aria-pressed={selectedAffinity === null}
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
                  setSelectedAffinity(selectedAffinity === aff.id ? null : aff.id)
                }
                aria-pressed={selectedAffinity === aff.id}
                className={cx(
                  "rounded px-2 py-1 font-semibold transition-colors",
                  selectedAffinity === aff.id
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
                <button
                  key={hero.id}
                  type="button"
                  draggable
                  onDragStart={() => handleDragStart(hero.id, null)}
                  onClick={() =>
                    setSelectedHeroForAction({ heroId: hero.id, fromTierId: null })
                  }
                  aria-label={hero.name}
                  title={t.suggerimentoPool(hero.name)}
                  className="group relative block aspect-square cursor-grab active:cursor-grabbing border border-rule-2 bg-paper transition-transform hover:scale-110 hover:z-10 select-none"
                >
                  <Image
                    src={hero.cardSrc}
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Finestra: Elenco delle mie Tier List salvate */}
      {showSavedListsModal ? (
        <Finestra
          label={t.leMieTierList(savedLists.length)}
          onClose={() => setShowSavedListsModal(false)}
          className="w-[min(32rem,calc(100vw-2rem))]"
        >
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-rule-2 pb-3">
              <h3 className="text-base font-bold text-ink">
                {t.leMieTierList(savedLists.length)}
              </h3>
              <button
                type="button"
                onClick={() => setShowSavedListsModal(false)}
                aria-label={t.chiudi}
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
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-ink truncate max-w-[260px]">
                        {item.title}
                      </h4>
                      <span suppressHydrationWarning className="shrink-0 text-[11px] text-ink-3">
                        {new Date(item.updatedAt).toLocaleDateString(locale)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs text-ink-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span>{t.eroiPosizionati(item.heroCount)}</span>
                        <span
                          className={cx(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            item.isPublic ? "bg-emerald-500/15 text-emerald-400" : "bg-rule text-ink-2",
                          )}
                        >
                          {item.isPublic ? t.nelProfilo : t.privata}
                        </span>
                      </span>
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
                          onClick={() => handleCopySavedLink(item.id)}
                          className={buttonClass("outline", "sm")}
                          title={t.copiaLinkDiretto}
                          aria-label={t.copiaLinkDiretto}
                        >
                          🔗
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedTierList(item.id)}
                          className="rounded px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-500/10"
                          title={t.elimina}
                          aria-label={t.elimina}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className="mb-2 min-h-4 text-xs">{statusLine}</p>

            <div className="border-t border-rule-2 pt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className={buttonClass("outline", "sm")}
              >
                <span aria-hidden>💾</span> {t.scaricaBackup}
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
        </Finestra>
      ) : null}

      {/* Finestra: Salva con nuovo nome */}
      {showSaveAsModal ? (
        <Finestra
          label={t.salvaNuovaCopia}
          onClose={() => setShowSaveAsModal(false)}
          className="w-[min(24rem,calc(100vw-2rem))]"
        >
          <form
            className="p-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!saveAsTitle.trim() || isSaving) return;
              await handleSaveToAccount(null, saveAsTitle.trim());
              setShowSaveAsModal(false);
            }}
          >
            <h4 className="font-bold text-base text-ink mb-3">{t.salvaNuovaCopia}</h4>
            <label className="block text-xs text-ink-3 mb-2" htmlFor="tierlist-salva-come">
              {t.nomeTierList}
            </label>
            <input
              id="tierlist-salva-come"
              type="text"
              value={saveAsTitle}
              autoFocus
              onChange={(e) => setSaveAsTitle(e.target.value)}
              className="w-full border border-rule bg-paper px-3 py-2 text-sm text-ink mb-4 focus:border-brand focus:outline-none"
              maxLength={TIER_LIST_LIMITS.title}
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
                type="submit"
                disabled={!saveAsTitle.trim() || isSaving}
                className={buttonClass("primary", "sm")}
              >
                {isSaving ? t.salvataggioInCorso : t.conferma}
              </button>
            </div>
          </form>
        </Finestra>
      ) : null}

      {/* Finestra: scelta rapida della riga al clic (o Invio) sull'eroe */}
      {selectedHeroForAction ? (
        (() => {
          const hero = heroesMap.get(selectedHeroForAction.heroId);
          if (!hero) return null;

          return (
            <Finestra
              label={hero.name}
              onClose={() => setSelectedHeroForAction(null)}
              className="w-[min(24rem,calc(100vw-2rem))]"
            >
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <Image
                    src={hero.cardSrc}
                    alt=""
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
                      aria-pressed={tier.id === selectedHeroForAction.fromTierId}
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
            </Finestra>
          );
        })()
      ) : null}
    </div>
  );
}
