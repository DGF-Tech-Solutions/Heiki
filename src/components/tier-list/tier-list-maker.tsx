"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { FilterRow } from "@/components/filter-chips";
import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconClose,
  IconDownload,
  IconEraser,
  IconFilters,
  IconLink,
  IconMore,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUndo,
} from "@/components/icons";
import { buttonClass, chipClass, cx, eyebrow, Input, Tag } from "@/components/ui";
import { MenuButton, menuItemClass } from "@/components/tier-list/menu-button";
import { labelInk } from "@/lib/tier-list/colors";
import { exportTierListToImage } from "@/lib/tier-list/export-image";
import {
  deleteTierListAction,
  getTierListBackupAction,
  saveTierListAction,
} from "@/lib/tier-list/actions";
import {
  defaultTiers,
  nextTierColor,
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
    titoloPredefinito: "La mia tier list",
    tierListDelGioco: (gioco: string) => `Tier list · ${gioco}`,
    nomeLista: "Nome della tier list",
    titoloPlaceholder: "Nome della lista, per esempio PvP di ottobre",
    righe: "Righe della tier list",
    aggiungiRiga: "Aggiungi riga",
    righeMassime: (n: number) => `Al massimo ${n} righe: per aggiungerne una, eliminane un'altra.`,
    nuovaRiga: "NUOVA",
    svuotaTutto: "Svuota tutto",
    ripristina: "Ripristina predefiniti",
    altreAzioni: "Altre azioni",
    comandiRiga: (riga: string) => `Comandi della riga ${riga}`,
    rinomina: "Rinomina",
    nomeRiga: (riga: string) => `Nome della riga ${riga}`,
    colore: "Colore",
    spostaSu: "Sposta su",
    spostaGiu: "Sposta giù",
    svuotaRiga: "Svuota riga",
    eliminaRiga: "Elimina riga",
    esportaImmagine: "Scarica immagine",
    esportazioneInCorso: "Creo l'immagine…",
    immagineFallita:
      "L'immagine non si è potuta creare su questo dispositivo. Riprova; se non va, prova da un altro browser o da un computer.",
    diAutore: (autore: string) => `di @${autore}`,
    copiaLink: "Copia link",
    suggerimentoLink: "Copia un link che apre questa lista",
    linkCopiato: "Link copiato",
    linkPrivato: "Link copiato. La lista è privata: il link si apre solo dal tuo account.",
    copiaFallita:
      "Copia non riuscita: il browser ha bloccato gli appunti. Permetti l'accesso agli appunti e riprova.",
    poolEroi: "Eroi disponibili",
    cerca: "Cerca per nome",
    filtri: "Filtri",
    rarita: "Rarità",
    attributo: "Attributo",
    togliFiltri: "Togli i filtri",
    trascinaQui: "Trascina qui un eroe dall'elenco, o cliccalo e scegli la riga.",
    toccaQui: "Tocca un eroe nell'elenco in basso e scegli questa riga.",
    nessunEroeTrovato: "Nessun eroe con questi filtri.",
    tuttiInRiga: "Tutti gli eroi sono in una riga.",
    eroiAssegnati: (n: number, tot: number) => `${n} di ${tot} in riga`,
    eroiPosizionati: (n: number) => `${n} eroi in riga`,
    suggerimentoInRiga: (eroe: string) => `${eroe}: clicca per spostarlo o toglierlo`,
    suggerimentoPool: (eroe: string) => `${eroe}: clicca per scegliere la riga`,
    rimuoviDalTier: "Togli dalla riga",
    rimuoviEroe: (eroe: string) => `Togli ${eroe} dalla riga`,
    assegnaATier: "Metti nella riga",
    rigaAttuale: "(qui ora)",
    chiudi: "Chiudi",
    salva: "Salva",
    salvaModifiche: "Salva modifiche",
    salvaComeNuova: "Salva come nuova",
    visibileNelProfilo: "Visibile nel profilo",
    suggerimentoVisibile:
      "Se togli la spunta la lista resta solo tua: non compare nel profilo e il link non si apre per gli altri.",
    nelProfilo: "Nel profilo",
    privata: "Privata",
    leMieTierList: (n: number) => `Le mie liste (${n})`,
    titoloLeMieTierList: "Le mie tier list",
    nuovaTierList: "Nuova tier list",
    salvataggioInCorso: "Salvo…",
    salvatoConSuccesso: "Salvata sul tuo account.",
    erroreRete: "Non salvata: il server non ha risposto. Controlla la connessione e riprova.",
    erroreSalvataggio: "Non salvata. Riprova tra poco: intanto la lista resta in questa pagina.",
    salvataSuAccount: "Salvata sul tuo account",
    modificaLocale: "Non ancora salvata: la bozza resta in questo browser.",
    bozzaLocale: "La bozza resta in questo browser.",
    spiegazioneEntra: "Entra per salvare le liste sul tuo account e condividerle con un link.",
    entraPerSalvare: "Entra per salvare",
    elimina: (titolo: string) => `Elimina ${titolo}`,
    apri: "Apri",
    copiaLinkDi: (titolo: string) => `Copia il link di ${titolo}`,
    confermaElimina: (titolo: string) => `Eliminare «${titolo}»? Non si può annullare.`,
    eliminazioneFallita: "Non eliminata: il server non ha risposto. Riprova.",
    scaricaBackup: "Scarica backup (JSON)",
    backupFallito: "Backup non scaricato: il server non ha risposto. Riprova.",
    visualizzandoDi: (autore: string) => `Tier list di @${autore}`,
    salvaUnaCopia: "Salva una copia",
    suffissoCopia: " (Copia)",
    nessunaTierListSalvata: "Non hai ancora tier list salvate per questo gioco.",
    annulla: "Annulla",
    conferma: "Salva",
    nomeTierList: "Nome della nuova lista",
    annullaAzione: "Annulla",
    svuotatoTutto: "Righe svuotate: gli eroi sono tornati nell'elenco.",
    rigaSvuotata: (riga: string) => `Riga «${riga}» svuotata.`,
    rigaEliminata: (riga: string) => `Riga «${riga}» eliminata.`,
    ripristinato: "Righe predefinite ripristinate.",
  },
  en: {
    titoloPredefinito: "My tier list",
    tierListDelGioco: (gioco: string) => `Tier list · ${gioco}`,
    nomeLista: "Tier list name",
    titoloPlaceholder: "List name, for example October PvP",
    righe: "Tier list rows",
    aggiungiRiga: "Add row",
    righeMassime: (n: number) => `At most ${n} rows: delete one to add another.`,
    nuovaRiga: "NEW",
    svuotaTutto: "Clear all",
    ripristina: "Reset to default",
    altreAzioni: "More actions",
    comandiRiga: (riga: string) => `Commands for row ${riga}`,
    rinomina: "Rename",
    nomeRiga: (riga: string) => `Name of row ${riga}`,
    colore: "Color",
    spostaSu: "Move up",
    spostaGiu: "Move down",
    svuotaRiga: "Clear row",
    eliminaRiga: "Delete row",
    esportaImmagine: "Download image",
    esportazioneInCorso: "Creating image…",
    immagineFallita:
      "The image couldn't be created on this device. Try again; if it still fails, try another browser or a computer.",
    diAutore: (autore: string) => `by @${autore}`,
    copiaLink: "Copy link",
    suggerimentoLink: "Copy a link that opens this list",
    linkCopiato: "Link copied",
    linkPrivato: "Link copied. The list is private: the link only opens from your account.",
    copiaFallita:
      "Copy failed: the browser blocked the clipboard. Allow clipboard access and try again.",
    poolEroi: "Available heroes",
    cerca: "Search by name",
    filtri: "Filters",
    rarita: "Rarity",
    attributo: "Attribute",
    togliFiltri: "Clear filters",
    trascinaQui: "Drag a hero here from the list, or click it and pick the row.",
    toccaQui: "Tap a hero in the list below and pick this row.",
    nessunEroeTrovato: "No hero matches these filters.",
    tuttiInRiga: "Every hero is in a row.",
    eroiAssegnati: (n: number, tot: number) => `${n} of ${tot} ranked`,
    eroiPosizionati: (n: number) => `${n} heroes ranked`,
    suggerimentoInRiga: (eroe: string) => `${eroe}: click to move or remove`,
    suggerimentoPool: (eroe: string) => `${eroe}: click to pick a row`,
    rimuoviDalTier: "Remove from row",
    rimuoviEroe: (eroe: string) => `Remove ${eroe} from the row`,
    assegnaATier: "Put in row",
    rigaAttuale: "(here now)",
    chiudi: "Close",
    salva: "Save",
    salvaModifiche: "Save changes",
    salvaComeNuova: "Save as new",
    visibileNelProfilo: "Visible on profile",
    suggerimentoVisibile:
      "Untick it to keep the list to yourself: it won't appear on your profile and the link won't open for others.",
    nelProfilo: "On profile",
    privata: "Private",
    leMieTierList: (n: number) => `My lists (${n})`,
    titoloLeMieTierList: "My tier lists",
    nuovaTierList: "New tier list",
    salvataggioInCorso: "Saving…",
    salvatoConSuccesso: "Saved to your account.",
    erroreRete: "Not saved: the server didn't respond. Check your connection and try again.",
    erroreSalvataggio: "Not saved. Try again shortly: the list stays on this page meanwhile.",
    salvataSuAccount: "Saved to your account",
    modificaLocale: "Not saved yet: the draft stays in this browser.",
    bozzaLocale: "The draft stays in this browser.",
    spiegazioneEntra: "Log in to save lists to your account and share them with a link.",
    entraPerSalvare: "Log in to save",
    elimina: (titolo: string) => `Delete ${titolo}`,
    apri: "Open",
    copiaLinkDi: (titolo: string) => `Copy the link to ${titolo}`,
    confermaElimina: (titolo: string) => `Delete “${titolo}”? This can't be undone.`,
    eliminazioneFallita: "Not deleted: the server didn't respond. Try again.",
    scaricaBackup: "Download backup (JSON)",
    backupFallito: "Backup not downloaded: the server didn't respond. Try again.",
    visualizzandoDi: (autore: string) => `@${autore}'s tier list`,
    salvaUnaCopia: "Save a copy",
    suffissoCopia: " (Copy)",
    nessunaTierListSalvata: "You don't have any saved tier lists for this game yet.",
    annulla: "Cancel",
    conferma: "Save",
    nomeTierList: "Name of the new list",
    annullaAzione: "Undo",
    svuotatoTutto: "Rows cleared: the heroes are back in the list.",
    rigaSvuotata: (riga: string) => `Row “${riga}” cleared.`,
    rigaEliminata: (riga: string) => `Row “${riga}” deleted.`,
    ripristinato: "Default rows restored.",
  },
});

/**
 * Quanto resta l'avviso con «Annulla» dopo Svuota, Elimina riga e Ripristina
 * (24/10): fino a quel giorno agivano subito e per sempre, uno accanto all'altro.
 * Col puntatore o il fuoco sopra l'avviso il tempo si ferma.
 */
const UNDO_MS = 8000;
const UNDO_AFTER_PAUSE_MS = 4000;

/**
 * Almeno 44 px sul tocco (24/10): i comandi della riga erano da 8 a 20 px. Con
 * min-height, che vince sull'altezza fissa dei bottoni `sm` (32 px) senza
 * dipendere dall'ordine delle classi.
 */
const TOUCH = "max-lg:min-h-11 pointer-coarse:min-h-11";
const TOUCH_SQUARE = "max-lg:min-h-11 max-lg:min-w-11 pointer-coarse:min-h-11 pointer-coarse:min-w-11";

/** La misura della scritta della riga: le lettere grandi, i nomi lunghi piu' piccoli. */
function labelSize(label: string): string {
  const length = Array.from(label).length;
  if (length <= 2) return "text-[30px] sm:text-[36px]";
  if (length <= 4) return "text-[20px] sm:text-[24px]";
  return "text-[13px] sm:text-[15px] wrap-break-word";
}

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

/** Il tabellone com'era prima di un'azione che si puo' annullare, bozza del browser compresa. */
interface BoardSnapshot {
  tiers: TierRow[];
  edited: boolean;
  draft: string | null;
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
  const poolHeadingId = useId();
  const filtersId = useId();

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

  // Filtri e ricerca; sul telefono i filtri stanno chiusi sotto un pulsante
  const [search, setSearch] = useState<string>("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedAffinity, setSelectedAffinity] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  // Rinomina di una riga, e il pulsante dei comandi di ogni riga (per rimetterci il fuoco)
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");
  const rowMenus = useRef(new Map<string, HTMLButtonElement>());

  const [selectedHeroForAction, setSelectedHeroForAction] = useState<{
    heroId: string;
    fromTierId: string | null;
  } | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Modali gestione account
  const [showSavedListsModal, setShowSavedListsModal] = useState<boolean>(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState<boolean>(false);
  const [saveAsTitle, setSaveAsTitle] = useState<string>("");

  // L'avviso con «Annulla»: il messaggio si vede, il ripristino resta qui
  const [undo, setUndo] = useState<{ key: number; message: string } | null>(null);
  const undoAction = useRef<(() => void) | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // La riga su cui si sta trascinando un eroe: si accende il bordo
  const [dragOverTierId, setDragOverTierId] = useState<string | null>(null);

  /** Un messaggio sotto il titolo, che se ne va da solo; uno nuovo sostituisce il vecchio. */
  const flash = useCallback((message: string, { ms = 3500, error = false } = {}) => {
    setStatus({ message, error });
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(null), ms);
  }, []);

  const dismissUndo = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = null;
    undoAction.current = null;
    setUndo(null);
  }, []);

  const armUndoTimer = useCallback(
    (ms: number) => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(dismissUndo, ms);
    },
    [dismissUndo],
  );

  // i timer non sopravvivono alla pagina
  useEffect(
    () => () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
      if (undoTimer.current) clearTimeout(undoTimer.current);
    },
    [],
  );

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

  const filtersActive = (selectedRarity ? 1 : 0) + (selectedAffinity ? 1 : 0);

  /** Rimette il fuoco sul pulsante dei comandi di una riga, dopo che React l'ha disegnata. */
  const focusRowMenu = (tierId: string | undefined) => {
    if (!tierId) return;
    requestAnimationFrame(() => rowMenus.current.get(tierId)?.focus());
  };

  /* ------------------------------------------------------------ annulla -- */

  const readDraft = (): string | null => {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const snapshotBoard = (): BoardSnapshot => ({
    tiers,
    edited: boardEdited.current,
    draft: readDraft(),
  });

  /**
   * Il tabellone di prima, e anche la bozza di prima: Svuota e Ripristina la
   * sovrascrivono, e senza rimetterla l'annullamento lascerebbe nel browser il
   * tabellone vuoto.
   */
  const restoreBoard = (snapshot: BoardSnapshot) => {
    boardEdited.current = snapshot.edited;
    setTiers(snapshot.tiers);
    try {
      if (snapshot.draft === null) localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, snapshot.draft);
    } catch {
      // localStorage disabilitato
    }
  };

  /** Mostra l'avviso con «Annulla»; un'azione nuova prende il posto della vecchia. */
  const offerUndo = (message: string, restore: () => void) => {
    undoAction.current = restore;
    setUndo({ key: Date.now(), message });
    armUndoTimer(UNDO_MS);
  };

  const runUndo = () => {
    const restore = undoAction.current;
    dismissUndo();
    restore?.();
  };

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

  const handleDragEnd = () => {
    dragItem.current = null;
    setDragOverTierId(null);
  };

  const handleDropOnTier = (targetTierId: string) => {
    setDragOverTierId(null);
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
      color: nextTierColor(tiers.length),
      heroIds: [],
    };
    editTiers((prev) => (prev.length < TIER_LIST_LIMITS.rows ? [...prev, newTier] : prev));
    focusRowMenu(newTier.id);
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

  const handleClearTier = (tier: TierRow) => {
    if (tier.heroIds.length === 0) return;
    const before = snapshotBoard();
    editTiers((prev) => prev.map((row) => (row.id === tier.id ? { ...row, heroIds: [] } : row)));
    offerUndo(t.rigaSvuotata(tier.label), () => {
      restoreBoard(before);
      focusRowMenu(tier.id);
    });
  };

  const handleDeleteTier = (tier: TierRow, index: number) => {
    if (tiers.length <= 1) return;
    const before = snapshotBoard();
    const remaining = tiers.filter((row) => row.id !== tier.id);
    editTiers((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== tier.id) : prev));
    offerUndo(t.rigaEliminata(tier.label), () => {
      restoreBoard(before);
      focusRowMenu(tier.id);
    });
    // il pulsante premuto se n'e' andato con la riga: il fuoco va alla riga che ne prende il posto
    focusRowMenu((remaining[index] ?? remaining[index - 1])?.id);
  };

  const startRename = (tier: TierRow) => {
    setEditingTierId(tier.id);
    setEditingLabel(tier.label);
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
  };

  const handleClearAll = () => {
    if (assignedHeroIds.size === 0) return;
    const before = snapshotBoard();
    editTiers((prev) => prev.map((tier) => ({ ...tier, heroIds: [] })));
    offerUndo(t.svuotatoTutto, () => {
      restoreBoard(before);
      focusRowMenu(before.tiers[0]?.id);
    });
  };

  // Ricominciare e' una modifica: il tabellone vuoto diventa la bozza. Si
  // annulla tutto insieme: righe, titolo, lista aperta e indirizzo.
  const handleResetDefault = () => {
    const before = {
      board: snapshotBoard(),
      title,
      currentId,
      authorInfo,
      isOwner,
      isPublic,
      url: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    };
    editTiers(() => defaultTiers());
    setCurrentId(null);
    setAuthorInfo(null);
    setIsOwner(viewer !== null);
    setIsPublic(true);
    setTitle(t.titoloPredefinito);
    window.history.replaceState({ ...window.history.state }, "", window.location.pathname);
    offerUndo(t.ripristinato, () => {
      restoreBoard(before.board);
      setTitle(before.title);
      setCurrentId(before.currentId);
      setAuthorInfo(before.authorInfo);
      setIsOwner(before.isOwner);
      setIsPublic(before.isPublic);
      window.history.replaceState({ ...window.history.state }, "", before.url);
      focusRowMenu(before.board.tiers[0]?.id);
    });
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

      // l'azione dice il perche' (database, limite, riga non valida); senza, il generico
      if (!res.ok || !res.tierListId) {
        flash(res.error ?? t.erroreSalvataggio, { ms: 7000, error: true });
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
      // l'azione non e' arrivata o non ha risposto: rete
      flash(t.erroreRete, { ms: 7000, error: true });
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

  // Elimina tier list salvata: l'unica cosa che chiede conferma, perche' non si annulla
  const handleDeleteSavedTierList = async (item: SavedTierListSummary) => {
    if (!window.confirm(t.confermaElimina(item.title))) return;

    try {
      const res = await deleteTierListAction(item.id);
      if (!res.ok) {
        flash(res.error ?? t.eliminazioneFallita, { ms: 7000, error: true });
        return;
      }
      setSavedLists((prev) => prev.filter((saved) => saved.id !== item.id));
      if (currentId === item.id) {
        setCurrentId(null);
        window.history.replaceState({ ...window.history.state }, "", window.location.pathname);
      }
    } catch {
      // rete: la lista resta dov'era, e lo si dice
      flash(t.eliminazioneFallita, { ms: 7000, error: true });
    }
  };

  // Scarica Backup JSON
  const handleDownloadBackup = async () => {
    try {
      const backup = await getTierListBackupAction();
      if (!backup) {
        flash(t.backupFallito, { ms: 7000, error: true });
        return;
      }

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
      flash(t.backupFallito, { ms: 7000, error: true });
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
      flash(t.immagineFallita, { ms: 8000, error: true });
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
      flash(t.copiaFallita, { ms: 7000, error: true });
      return;
    }
    if (currentId && isOwner && isSavedPrivate(currentId)) flash(t.linkPrivato, { ms: 5000 });
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopySavedLink = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}?id=${id}`;
    if (!(await copyToClipboard(url))) {
      flash(t.copiaFallita, { ms: 7000, error: true });
      return;
    }
    flash(isSavedPrivate(id) ? t.linkPrivato : t.linkCopiato, { ms: isSavedPrivate(id) ? 5000 : 2500 });
  };

  const statusLine = (
    <span role="status" className={cx("font-semibold", status?.error ? "text-brand-deep" : "text-ink-2")}>
      {status?.message}
    </span>
  );

  /*
   * Un solo comando rosso per volta (24/10): erano rossi «Aggiungi riga»,
   * «Scarica immagine» e «Salva» insieme. Chi e' entrato salva (e l'immagine
   * passa in seconda fila); chi non e' entrato scarica l'immagine. Guardando la
   * lista di un altro, il rosso e' «Salva una copia» nell'avviso in cima.
   */
  const canSave = viewer !== null && authorInfo === null;
  const exportVariant = viewer ? "outline" : "primary";
  const savedHere = currentId !== null && isOwner;

  return (
    <div className="grid gap-4">
      {/* La tier list condivisa di un altro: chi e' e cosa si puo' fare */}
      {authorInfo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-paper-2 px-4 py-3">
          <p className="m-0 text-[15px] text-ink">
            {t.visualizzandoDi(authorInfo.username)}: <strong>{title}</strong>
          </p>
          {viewer ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveToAccount(null, copyTitle(title, t.suffissoCopia))}
              className={buttonClass("primary", "sm", TOUCH)}
            >
              {isSaving ? t.salvataggioInCorso : t.salvaUnaCopia}
            </button>
          ) : (
            <Link href="/entra" className={buttonClass("outline", "sm", TOUCH)}>
              {t.entraPerSalvare}
            </Link>
          )}
        </div>
      ) : null}

      {/* Il nome della lista e l'account */}
      <div className="p5-corner grid gap-2 border border-rule bg-paper-2 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.titoloPlaceholder}
            aria-label={t.nomeLista}
            maxLength={TIER_LIST_LIMITS.title}
            className="h-10 min-w-0 flex-1 basis-32 border border-rule bg-paper px-3 font-display text-[17px] font-extrabold text-ink [font-variation-settings:'wdth'_85] placeholder:font-body placeholder:text-[15px] placeholder:font-normal placeholder:text-ink-3 hover:border-ink-3 focus:border-brand focus:outline-none max-lg:h-11"
          />
          {viewer ? (
            <>
              {canSave ? (
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveToAccount(savedHere ? currentId : null)}
                  className={buttonClass("primary", "sm", TOUCH)}
                >
                  {isSaving ? t.salvataggioInCorso : savedHere ? t.salvaModifiche : t.salva}
                </button>
              ) : null}
              {canSave && savedHere ? (
                <button
                  type="button"
                  onClick={() => {
                    setSaveAsTitle(copyTitle(title, t.suffissoCopia));
                    setShowSaveAsModal(true);
                  }}
                  className={buttonClass("ghost", "sm", TOUCH)}
                >
                  {t.salvaComeNuova}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowSavedListsModal(true)}
                className={buttonClass("ghost", "sm", TOUCH)}
              >
                {t.leMieTierList(savedLists.length)}
              </button>
            </>
          ) : authorInfo ? null : (
            <Link href="/entra" className={buttonClass("outline", "sm", TOUCH)}>
              {t.entraPerSalvare}
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-3">
          {authorInfo ? null : savedHere ? (
            <span className="inline-flex items-center gap-1.5 text-ink-2">
              <IconCheck size={14} />
              {t.salvataSuAccount}
            </span>
          ) : (
            <span>{viewer ? t.modificaLocale : t.bozzaLocale}</span>
          )}
          {viewer && canSave ? (
            <label
              className="inline-flex cursor-pointer items-center gap-2 text-ink-2 max-lg:min-h-11 pointer-coarse:min-h-11"
              title={t.suggerimentoVisibile}
            >
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="size-4 accent-brand"
              />
              {t.visibileNelProfilo}
            </label>
          ) : null}
          {viewer || authorInfo ? null : <span className="max-md:hidden">{t.spiegazioneEntra}</span>}
          {showSavedListsModal ? null : statusLine}
        </div>
      </div>

      {/*
        La barra: sul telefono una fila sola (24/10), prima andava a capo in
        quattro righe prima del tabellone. Restano fuori l'immagine e il link,
        Svuota e Ripristina stanno sotto «Altre azioni». «Aggiungi riga» e'
        sotto l'ultima riga, dove la riga nuova compare.
      */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleClearAll}
          disabled={assignedHeroIds.size === 0}
          className={buttonClass("ghost", "sm", "max-sm:hidden")}
        >
          <IconEraser />
          {t.svuotaTutto}
        </button>
        <button type="button" onClick={handleResetDefault} className={buttonClass("ghost", "sm", "max-sm:hidden")}>
          {t.ripristina}
        </button>

        <div className="ml-auto flex items-center gap-2 max-sm:ml-0 max-sm:flex-1">
          <button
            type="button"
            onClick={handleShareLink}
            title={t.suggerimentoLink}
            className={buttonClass("ghost", "sm", cx(TOUCH_SQUARE, "max-sm:order-2 max-sm:px-0"))}
          >
            {linkCopied ? <IconCheck /> : <IconLink />}
            <span className="max-sm:sr-only">{linkCopied ? t.linkCopiato : t.copiaLink}</span>
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportImage}
            className={buttonClass(exportVariant, "sm", cx(TOUCH, "max-sm:order-1"))}
          >
            <IconDownload />
            {isExporting ? t.esportazioneInCorso : t.esportaImmagine}
          </button>
          <div className="max-sm:order-3 max-sm:ml-auto sm:hidden">
            <MenuButton
              label={t.altreAzioni}
              content={<IconMore size={20} />}
              className={buttonClass("ghost", "sm", cx(TOUCH_SQUARE, "px-0"))}
              panelClassName="w-64"
            >
              {(close) => (
                <>
                  <button
                    type="button"
                    aria-disabled={assignedHeroIds.size === 0}
                    onClick={() => {
                      close();
                      handleClearAll();
                    }}
                    className={menuItemClass}
                  >
                    <IconEraser />
                    {t.svuotaTutto}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      handleResetDefault();
                    }}
                    className={menuItemClass}
                  >
                    <IconUndo />
                    {t.ripristina}
                  </button>
                </>
              )}
            </MenuButton>
          </div>
        </div>
      </div>

      {/*
        Tabellone ed eroi (24/10). Prima l'elenco degli eroi cominciava a ~1.150
        px, sotto sei righe vuote, in una scatola che scorreva per conto suo: si
        scendeva a prendere un eroe e si risaliva a lasciarlo. Sul computer ora e'
        una colonna ferma accanto alle righe; sul telefono una striscia ferma in
        fondo allo schermo (sopra la barra), che si tocca e da' la scelta della
        riga. Nel codice viene dopo le righe, come si legge.
      */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-2">
          <h2 className="sr-only">{t.righe}</h2>
          <ol aria-label={t.righe} className="m-0 grid list-none gap-2 p-0">
            {tiers.map((tier, index) => {
              const isEditing = editingTierId === tier.id;
              const ink = labelInk(tier.color);
              const isFirst = index === 0;
              const isLast = index === tiers.length - 1;

              return (
                <li
                  key={tier.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverTierId !== tier.id) setDragOverTierId(tier.id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOverTierId(null);
                  }}
                  onDrop={() => handleDropOnTier(tier.id)}
                  className={cx(
                    "flex min-h-[84px] border bg-paper-2 transition-colors",
                    dragOverTierId === tier.id ? "border-ink" : "border-rule",
                  )}
                >
                  {/*
                    La scritta della riga: l'inchiostro lo sceglie il colore (24/10),
                    prima era sempre bianco con un'ombra (1,4:1 sull'oro). Il bordo
                    destro tagliato in obliquo come i comandi del sito.
                  */}
                  <div
                    className="flex w-[72px] shrink-0 items-center justify-center py-2 pr-3 pl-2 text-center [clip-path:polygon(0_0,100%_0,calc(100%_-_10px)_100%,0_100%)] sm:w-24"
                    style={{ backgroundColor: tier.color, color: ink }}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingLabel}
                        autoFocus
                        aria-label={t.nomeRiga(tier.label)}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onBlur={() => handleRenameTier(tier.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenameTier(tier.id);
                            focusRowMenu(tier.id);
                          } else if (e.key === "Escape") {
                            setEditingTierId(null);
                            focusRowMenu(tier.id);
                          }
                        }}
                        maxLength={TIER_LIST_LIMITS.label}
                        className="h-10 w-full min-w-0 border-2 border-ink bg-paper px-1 text-center font-display text-[15px] font-extrabold text-ink focus:outline-none"
                      />
                    ) : (
                      <span
                        className={cx(
                          "block max-w-full font-display leading-[0.95] font-black tracking-[-0.01em] [font-variation-settings:'wdth'_80]",
                          labelSize(tier.label),
                        )}
                      >
                        {tier.label}
                      </span>
                    )}
                  </div>

                  {/* Gli eroi della riga, che vanno a capo dentro la riga */}
                  <div
                    className={cx(
                      "flex min-w-0 flex-1 flex-wrap gap-1.5 p-2",
                      tier.heroIds.length === 0 ? "items-center" : "content-start items-start",
                    )}
                  >
                    {tier.heroIds.length === 0 ? (
                      <p className="m-0 px-1 text-[13px] leading-snug text-ink-3 select-none">
                        <span className="lg:hidden">{t.toccaQui}</span>
                        <span className="max-lg:hidden">{t.trascinaQui}</span>
                      </p>
                    ) : (
                      tier.heroIds.map((heroId) => {
                        const hero = heroesMap.get(heroId);
                        if (!hero) return null;

                        // Un pulsante e non un div: con la tastiera ci si arriva e
                        // si apre la scelta della riga; il nome e' quello dell'eroe
                        return (
                          <div key={hero.id} className="group relative size-16 shrink-0">
                            <button
                              type="button"
                              draggable
                              onDragStart={() => handleDragStart(hero.id, tier.id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => setSelectedHeroForAction({ heroId: hero.id, fromTierId: tier.id })}
                              aria-label={hero.name}
                              title={t.suggerimentoInRiga(hero.name)}
                              className="block size-full cursor-grab border border-rule-2 bg-paper transition-transform select-none hover:z-10 hover:scale-105 active:cursor-grabbing motion-reduce:transition-none"
                            >
                              <Image
                                src={hero.cardSrc}
                                alt=""
                                width={64}
                                height={64}
                                unoptimized
                                className="size-full object-cover"
                              />
                            </button>
                            {/* togliere al volo col mouse; sul tocco lo fa la finestra della riga */}
                            <button
                              type="button"
                              onClick={() => handleRemoveHero(hero.id)}
                              title={t.rimuoviDalTier}
                              aria-label={t.rimuoviEroe(hero.name)}
                              className="absolute -top-1.5 -right-1.5 z-20 hidden size-6 cursor-pointer place-items-center bg-ink text-paper group-focus-within:grid group-hover:grid hover:bg-brand hover:text-white pointer-coarse:hidden!"
                            >
                              <IconClose size={12} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* I comandi della riga, in un menu sul bordo (24/10) */}
                  <div className="flex w-11 shrink-0 items-center justify-center border-l border-rule-2">
                    <MenuButton
                      label={t.comandiRiga(tier.label)}
                      content={<IconMore size={20} />}
                      buttonRef={(element) => {
                        if (element) rowMenus.current.set(tier.id, element);
                        else rowMenus.current.delete(tier.id);
                      }}
                      className="grid size-11 cursor-pointer place-items-center text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink aria-expanded:bg-ink aria-expanded:text-paper"
                      panelClassName="w-60"
                    >
                      {(close) => (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              close(false);
                              startRename(tier);
                            }}
                            className={menuItemClass}
                          >
                            <IconPencil />
                            {t.rinomina}
                          </button>

                          <div role="group" aria-label={t.colore} className="px-1 pt-1.5 pb-2">
                            <p className={cx(eyebrow, "m-0 mb-1.5 px-2")}>{t.colore}</p>
                            <div className="grid grid-cols-6 gap-1 max-lg:grid-cols-4 pointer-coarse:grid-cols-4">
                              {TIER_COLORS.map((c) => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  title={c.label[locale]}
                                  aria-label={c.label[locale]}
                                  aria-pressed={tier.color === c.hex}
                                  onClick={() => handleSetColor(tier.id, c.hex)}
                                  className="grid h-8 cursor-pointer place-items-center border border-white/15 max-lg:h-11 pointer-coarse:h-11"
                                  style={{ backgroundColor: c.hex, color: labelInk(c.hex) }}
                                >
                                  {tier.color === c.hex ? <IconCheck size={14} /> : null}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* aria-disabled e non disabled: il pulsante premuto resta col fuoco */}
                          <button
                            type="button"
                            aria-disabled={isFirst}
                            onClick={(e) => {
                              if (isFirst) return;
                              const button = e.currentTarget;
                              handleMoveTier(index, "up");
                              requestAnimationFrame(() => button.focus());
                            }}
                            className={menuItemClass}
                          >
                            <IconArrowUp size={16} />
                            {t.spostaSu}
                          </button>
                          <button
                            type="button"
                            aria-disabled={isLast}
                            onClick={(e) => {
                              if (isLast) return;
                              const button = e.currentTarget;
                              handleMoveTier(index, "down");
                              requestAnimationFrame(() => button.focus());
                            }}
                            className={menuItemClass}
                          >
                            <IconArrowDown size={16} />
                            {t.spostaGiu}
                          </button>

                          <div className="my-1 border-t border-rule" />
                          <button
                            type="button"
                            aria-disabled={tier.heroIds.length === 0}
                            onClick={() => {
                              close();
                              handleClearTier(tier);
                            }}
                            className={menuItemClass}
                          >
                            <IconEraser />
                            {t.svuotaRiga}
                          </button>
                          {tiers.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => {
                                close(false);
                                handleDeleteTier(tier, index);
                              }}
                              className={cx(menuItemClass, "text-brand-deep")}
                            >
                              <IconTrash />
                              {t.eliminaRiga}
                            </button>
                          ) : null}
                        </>
                      )}
                    </MenuButton>
                  </div>
                </li>
              );
            })}
          </ol>

          {canAddTier ? (
            <button
              type="button"
              onClick={handleAddTier}
              className={buttonClass("ghost", "sm", cx(TOUCH, "justify-self-start"))}
            >
              <IconPlus />
              {t.aggiungiRiga}
            </button>
          ) : (
            <p className="m-0 text-[13px] text-ink-3">{t.righeMassime(TIER_LIST_LIMITS.rows)}</p>
          )}
        </div>

        {/*
          Gli eroi da mettere in riga. Sul computer la colonna e' alta quanto le
          righe (almeno 36rem) e l'elenco ci sta fermo dentro: se fosse l'elenco a
          dare l'altezza, con poche righe sarebbe lui il piu' alto e scorrerebbe
          via con la pagina invece di restare fermo (`contain: size` gli toglie
          l'altezza propria). Sul telefono la colonna non c'e' (`contents`), e la
          striscia resta ferma in fondo per tutto il tabellone.
        */}
        <div className="max-lg:contents lg:min-h-[36rem] lg:self-stretch lg:[contain:size]">
          <section
            aria-labelledby={poolHeadingId}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnPool}
            className={cx(
              "min-w-0 border border-rule bg-paper-2 p-3",
              // telefono: ferma in fondo, sopra la barra del sito (58 px, misurata il
              // 24/10): 56 la fa passare 2 px sotto la barra, invece di lasciare una fessura
              "max-lg:sticky max-lg:bottom-[calc(56px+env(safe-area-inset-bottom))] max-lg:z-10 max-lg:border-t-2 max-lg:border-t-brand max-lg:shadow-[0_-10px_24px_rgba(0,0,0,0.55)]",
              // computer: ferma sotto l'intestazione (61 px), alta quanto la colonna e al massimo quanto lo schermo
              "lg:sticky lg:top-[77px] lg:flex lg:h-full lg:max-h-[calc(100dvh-93px)] lg:flex-col lg:p-4",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 max-lg:sr-only">
              <h2
                id={poolHeadingId}
                className="m-0 font-display text-[15px] font-extrabold tracking-[0.03em] text-ink uppercase [font-variation-settings:'wdth'_82]"
              >
                {t.poolEroi}
              </h2>
              <span className="text-[13px] text-ink-3">{t.eroiAssegnati(assignedHeroIds.size, heroes.length)}</span>
            </div>

            <div className="flex items-center gap-2 lg:mt-3">
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.cerca}
                aria-label={t.cerca}
                className="min-w-0 flex-1 max-lg:h-11"
              />
              <button
                type="button"
                aria-expanded={filtersOpen}
                aria-controls={filtersId}
                onClick={() => setFiltersOpen((open) => !open)}
                // la lama dei filtri: rossa se un filtro restringe l'elenco, anche a pannello chiuso
                className={chipClass(filtersActive > 0, false, cx(TOUCH_SQUARE, "justify-center px-0 lg:hidden"))}
              >
                <IconFilters />
                <span className="sr-only">
                  {t.filtri}
                  {filtersActive ? ` (${filtersActive})` : ""}
                </span>
              </button>
            </div>

            <div id={filtersId} className={cx("grid gap-2 pt-3", filtersOpen ? null : "max-lg:hidden")}>
              <FilterRow label={t.rarita} labelClassName="w-[74px]">
                {rarities.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRarity(selectedRarity === r ? null : r)}
                    aria-pressed={selectedRarity === r}
                    className={chipClass(selectedRarity === r, false, TOUCH)}
                  >
                    {r}
                  </button>
                ))}
              </FilterRow>
              {/* Attributi: si filtra per id, si mostra il nome nella lingua */}
              <FilterRow label={t.attributo} labelClassName="w-[74px]">
                {affinities.map((aff) => (
                  <button
                    key={aff.id}
                    type="button"
                    onClick={() => setSelectedAffinity(selectedAffinity === aff.id ? null : aff.id)}
                    aria-pressed={selectedAffinity === aff.id}
                    className={chipClass(selectedAffinity === aff.id, false, TOUCH)}
                  >
                    {aff.name}
                  </button>
                ))}
              </FilterRow>
            </div>

            <div className="mt-3 max-lg:-mx-3 max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:px-3 max-lg:pb-1 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1 [scrollbar-color:var(--color-rule)_transparent] [scrollbar-width:thin]">
              {availableHeroes.length === 0 ? (
                <div className="flex flex-wrap items-center gap-3 py-3 text-[13px] text-ink-2 lg:py-8">
                  <p className="m-0">
                    {assignedHeroIds.size === heroes.length ? t.tuttiInRiga : t.nessunEroeTrovato}
                  </p>
                  {filtersActive || search ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRarity(null);
                        setSelectedAffinity(null);
                        setSearch("");
                      }}
                      className={buttonClass("ghost", "sm", TOUCH)}
                    >
                      {t.togliFiltri}
                    </button>
                  ) : null}
                </div>
              ) : (
                <ul className="m-0 flex list-none gap-1.5 p-0 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(56px,1fr))]">
                  {availableHeroes.map((hero) => (
                    <li key={hero.id} className="shrink-0 max-lg:size-14">
                      <button
                        type="button"
                        draggable
                        onDragStart={() => handleDragStart(hero.id, null)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedHeroForAction({ heroId: hero.id, fromTierId: null })}
                        aria-label={hero.name}
                        title={t.suggerimentoPool(hero.name)}
                        className="block aspect-square w-full cursor-grab border border-rule-2 bg-paper transition-[border-color,scale] select-none hover:z-10 hover:scale-105 hover:border-ink-3 active:cursor-grabbing motion-reduce:transition-none"
                      >
                        <Image
                          src={hero.cardSrc}
                          alt=""
                          width={64}
                          height={64}
                          unoptimized
                          className="size-full object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      {/*
        L'avviso con «Annulla» (24/10). La regione aria-live c'e' sempre, cosi'
        il lettore di schermo annuncia il messaggio quando compare; il fuoco non
        si sposta. Sul telefono in alto, perche' in basso c'e' la striscia degli
        eroi; sul computer in basso.
      */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-[69px] right-4 left-4 z-40 flex justify-center lg:top-auto lg:right-auto lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2"
      >
        {undo ? (
          <div
            key={undo.key}
            onPointerEnter={() => {
              if (undoTimer.current) clearTimeout(undoTimer.current);
            }}
            onPointerLeave={() => armUndoTimer(UNDO_AFTER_PAUSE_MS)}
            onFocus={() => {
              if (undoTimer.current) clearTimeout(undoTimer.current);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) armUndoTimer(UNDO_AFTER_PAUSE_MS);
            }}
            className="pointer-events-auto flex max-w-[34rem] items-center gap-3 border-2 border-ink bg-paper py-1.5 pr-1.5 pl-4 text-[14px] leading-snug text-ink shadow-[6px_6px_0_0_var(--color-brand)]"
          >
            <span className="min-w-0">{undo.message}</span>
            <button
              type="button"
              onClick={runUndo}
              className={buttonClass("outline", "sm", cx(TOUCH, "shrink-0"))}
            >
              <IconUndo />
              {t.annullaAzione}
            </button>
          </div>
        ) : null}
      </div>

      {/* Finestra: Elenco delle mie Tier List salvate */}
      {showSavedListsModal ? (
        <Finestra
          label={t.titoloLeMieTierList}
          onClose={() => setShowSavedListsModal(false)}
          className="w-[min(32rem,calc(100vw-2rem))]"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-rule-2 pb-3">
              <h2 className="m-0 font-display text-[20px] font-extrabold uppercase [font-variation-settings:'wdth'_82]">
                {t.titoloLeMieTierList}
              </h2>
              <button
                type="button"
                onClick={() => setShowSavedListsModal(false)}
                aria-label={t.chiudi}
                title={t.chiudi}
                className="grid size-10 cursor-pointer place-items-center text-ink-3 hover:bg-paper-3 hover:text-ink max-lg:size-11"
              >
                <IconClose />
              </button>
            </div>

            <ul className="m-0 my-4 grid max-h-80 list-none gap-2 overflow-y-auto p-0 [scrollbar-width:thin]">
              {savedLists.length === 0 ? (
                <li className="py-8 text-center text-[14px] text-ink-2">{t.nessunaTierListSalvata}</li>
              ) : (
                savedLists.map((item) => (
                  <li
                    key={item.id}
                    className={cx(
                      "grid gap-2 border p-3",
                      item.id === currentId ? "border-ink bg-paper-3" : "border-rule bg-paper",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="m-0 min-w-0 truncate text-[15px] font-bold text-ink">{item.title}</h3>
                      <span suppressHydrationWarning className="shrink-0 text-[12px] text-ink-3">
                        {new Date(item.updatedAt).toLocaleDateString(locale)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <span>{t.eroiPosizionati(item.heroCount)}</span>
                        {item.isPublic ? <span>{t.nelProfilo}</span> : <Tag>{t.privata}</Tag>}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadSavedTierList(item)}
                          className={buttonClass("outline", "sm", TOUCH)}
                        >
                          {t.apri}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopySavedLink(item.id)}
                          className={buttonClass("ghost", "sm", cx(TOUCH_SQUARE, "px-2.5"))}
                          title={t.copiaLinkDi(item.title)}
                          aria-label={t.copiaLinkDi(item.title)}
                        >
                          <IconLink />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedTierList(item)}
                          className={buttonClass("ghost", "sm", cx(TOUCH_SQUARE, "px-2.5 text-brand-deep"))}
                          title={t.elimina(item.title)}
                          aria-label={t.elimina(item.title)}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>

            <p className="m-0 mb-2 min-h-5 text-[13px]">{statusLine}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule-2 pt-3">
              <button type="button" onClick={handleDownloadBackup} className={buttonClass("ghost", "sm", TOUCH)}>
                <IconDownload />
                {t.scaricaBackup}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleResetDefault();
                  setShowSavedListsModal(false);
                }}
                className={buttonClass("ghost", "sm", TOUCH)}
              >
                <IconPlus />
                {t.nuovaTierList}
              </button>
            </div>
          </div>
        </Finestra>
      ) : null}

      {/* Finestra: Salva con nuovo nome */}
      {showSaveAsModal ? (
        <Finestra
          label={t.salvaComeNuova}
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
            <h2 className="m-0 mb-3 font-display text-[18px] font-extrabold uppercase [font-variation-settings:'wdth'_82]">
              {t.salvaComeNuova}
            </h2>
            <label className={cx(eyebrow, "mb-1.5 block")} htmlFor="tierlist-salva-come">
              {t.nomeTierList}
            </label>
            <Input
              id="tierlist-salva-come"
              type="text"
              value={saveAsTitle}
              autoFocus
              onChange={(e) => setSaveAsTitle(e.target.value)}
              className="mb-4 max-lg:h-11"
              maxLength={TIER_LIST_LIMITS.title}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSaveAsModal(false)}
                className={buttonClass("ghost", "sm", TOUCH)}
              >
                {t.annulla}
              </button>
              <button
                type="submit"
                disabled={!saveAsTitle.trim() || isSaving}
                className={buttonClass("primary", "sm", TOUCH)}
              >
                {isSaving ? t.salvataggioInCorso : t.conferma}
              </button>
            </div>
          </form>
        </Finestra>
      ) : null}

      {/* Finestra: scelta rapida della riga al clic (o Invio) sull'eroe */}
      {selectedHeroForAction
        ? (() => {
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
                      width={56}
                      height={56}
                      unoptimized
                      className="size-14 border border-rule-2"
                    />
                    <div className="min-w-0">
                      <h2 className="m-0 font-display text-[18px] leading-tight font-extrabold uppercase [font-variation-settings:'wdth'_82]">
                        {hero.name}
                      </h2>
                      {hero.epithet ? <p className="m-0 text-[13px] text-ink-3">{hero.epithet}</p> : null}
                    </div>
                  </div>

                  <p className={cx(eyebrow, "mt-5 mb-2")}>{t.assegnaATier}</p>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-1.5">
                    {tiers.map((tier) => {
                      const here = tier.id === selectedHeroForAction.fromTierId;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => handleAssignHeroToTier(hero.id, tier.id)}
                          aria-pressed={here}
                          className="p5-cut-sm p5-press flex h-11 min-w-0 cursor-pointer items-center justify-center gap-1 px-2 font-display text-[17px] leading-none font-black [font-variation-settings:'wdth'_80]"
                          style={{ backgroundColor: tier.color, color: labelInk(tier.color) }}
                        >
                          <span className="truncate">{tier.label}</span>
                          {here ? (
                            <>
                              <IconCheck size={14} className="shrink-0" />
                              <span className="sr-only">{t.rigaAttuale}</span>
                            </>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-rule-2 pt-3">
                    {selectedHeroForAction.fromTierId ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveHero(hero.id)}
                        className={buttonClass("ghost", "sm", TOUCH)}
                      >
                        <IconClose size={16} />
                        {t.rimuoviDalTier}
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedHeroForAction(null)}
                      className={buttonClass("ghost", "sm", TOUCH)}
                    >
                      {t.chiudi}
                    </button>
                  </div>
                </div>
              </Finestra>
            );
          })()
        : null}
    </div>
  );
}
