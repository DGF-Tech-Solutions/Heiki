"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { buttonClass, cx, eyebrow } from "@/components/ui";
import { exportTierListToImage } from "@/lib/tier-list/export-image";
import {
  defaultTiers,
  TIER_COLORS,
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
  },
});

interface TierListMakerProps {
  game: string;
  gameName: string;
  locale: Locale;
  heroes: readonly TierHeroItem[];
  rarities: readonly string[];
  affinities: readonly { id: string; name: string }[];
}

export function TierListMaker({
  game,
  gameName,
  locale,
  heroes,
  rarities,
  affinities,
}: TierListMakerProps) {
  const t = TESTI[locale];
  const storageKey = `gz_tierlist_${game}`;

  const heroesMap = useMemo(() => new Map(heroes.map((h) => [h.id, h])), [heroes]);

  const [tiers, setTiers] = useState<TierRow[]>(() => defaultTiers());
  const [search, setSearch] = useState<string>("");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedAffinity, setSelectedAffinity] = useState<string | null>(null);

  const [activeColorPickerTierId, setActiveColorPickerTierId] = useState<string | null>(null);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");

  const [selectedHeroForAction, setSelectedHeroForAction] = useState<{
    heroId: string;
    fromTierId: string | null;
  } | null>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Caricamento iniziale da URL hash o localStorage
  useEffect(() => {
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
  }, [storageKey]);

  // Salvataggio automatico su localStorage ad ogni modifica
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tiers));
    } catch {
      // localStorage pieno o disabilitato
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
        // Se l'eroe era già in questo tier, non duplichiamo
        if (tier.id === targetTierId) {
          if (fromTierId === targetTierId) return tier;
          return { ...tier, heroIds: [...tier.heroIds, heroId] };
        }
        // Se proviene da un altro tier, rimuovilo dal vecchio
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

  // Esportazione Immagine
  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      await exportTierListToImage({
        title: `Tier List · ${gameName}`,
        subtitle: "Creata su GachaZone",
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

  // Condividi Link
  const handleShareLink = () => {
    try {
      const minimalData = tiers.map((t) => ({
        id: t.id,
        label: t.label,
        color: t.color,
        heroIds: t.heroIds,
      }));
      const serialized = encodeURIComponent(JSON.stringify(minimalData));
      const url = `${window.location.origin}${window.location.pathname}#data=${serialized}`;
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Ignora errori clipboard
    }
  };

  return (
    <div className="grid gap-6">
      {/* Barra comandi globale */}
      <div className="p5-corner flex flex-wrap items-center justify-between gap-3 border border-rule bg-paper-2 p-4">
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
                        title={t.spostaSu}
                        onClick={() => handleMoveTier(index, "up")}
                        className="rounded p-0.5 hover:bg-black/30 text-xs font-bold leading-none"
                      >
                        ▲
                      </button>
                    ) : null}
                    {index < tiers.length - 1 ? (
                      <button
                        type="button"
                        title={t.spostaGiu}
                        onClick={() => handleMoveTier(index, "down")}
                        className="rounded p-0.5 hover:bg-black/30 text-xs font-bold leading-none"
                      >
                        ▼
                      </button>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    title={t.cambiaColore}
                    onClick={() =>
                      setActiveColorPickerTierId(isColorPickerOpen ? null : tier.id)
                    }
                    className="rounded px-1 text-xs hover:bg-black/30 font-mono"
                  >
                    🎨
                  </button>
                </div>

                {/* Titolo Tier (cliccabile per rinominare) */}
                {isEditing ? (
                  <input
                    type="text"
                    value={editingLabel}
                    autoFocus
                    maxLength={10}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    onBlur={() => {
                      if (editingLabel.trim()) {
                        setTiers((prev) =>
                          prev.map((item) =>
                            item.id === tier.id
                              ? { ...item, label: editingLabel.trim() }
                              : item,
                          ),
                        );
                      }
                      setEditingTierId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (editingLabel.trim()) {
                          setTiers((prev) =>
                            prev.map((item) =>
                              item.id === tier.id
                                ? { ...item, label: editingLabel.trim() }
                                : item,
                            ),
                          );
                        }
                        setEditingTierId(null);
                      } else if (e.key === "Escape") {
                        setEditingTierId(null);
                      }
                    }}
                    className="w-full rounded bg-black/60 px-1 py-0.5 text-center font-display text-lg font-black text-white outline-hidden"
                  />
                ) : (
                  <button
                    type="button"
                    title={t.rinominaTier}
                    onClick={() => {
                      setEditingLabel(tier.label);
                      setEditingTierId(tier.id);
                    }}
                    className="group flex items-center justify-center gap-1 font-display text-xl font-black uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    <span>{tier.label}</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      ✏️
                    </span>
                  </button>
                )}

                {/* Pulsanti svuota ed elimina riga */}
                <div className="flex w-full items-center justify-between text-[11px] text-white/80">
                  <button
                    type="button"
                    title={t.svuotaRiga}
                    onClick={() => handleClearTier(tier.id)}
                    className="rounded px-1 hover:bg-black/30"
                  >
                    ↺
                  </button>
                  <button
                    type="button"
                    title={t.eliminaRiga}
                    onClick={() => handleDeleteTier(tier.id)}
                    className="rounded px-1 hover:bg-black/30"
                  >
                    ✕
                  </button>
                </div>

                {/* Popover selezione colore */}
                {isColorPickerOpen ? (
                  <div className="absolute top-8 left-2 z-30 flex flex-wrap gap-1 rounded border border-rule bg-paper p-2 shadow-2xl w-40">
                    {TIER_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        title={col.label}
                        onClick={() => {
                          setTiers((prev) =>
                            prev.map((item) =>
                              item.id === tier.id ? { ...item, color: col.hex } : item,
                            ),
                          );
                          setActiveColorPickerTierId(null);
                        }}
                        className="h-6 w-6 rounded border border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Area carte del Tier */}
              <div className="flex flex-1 flex-wrap items-center content-start gap-1.5 p-2 bg-paper/60">
                {tier.heroIds.length === 0 ? (
                  <div className="flex h-full w-full items-center justify-center p-4 text-xs text-ink-3 italic select-none">
                    {t.trascinaQui}
                  </div>
                ) : (
                  tier.heroIds.map((heroId) => {
                    const hero = heroesMap.get(heroId);
                    if (!hero) return null;

                    return (
                      <div
                        key={heroId}
                        draggable
                        onDragStart={() => handleDragStart(heroId, tier.id)}
                        onClick={() =>
                          setSelectedHeroForAction({ heroId, fromTierId: tier.id })
                        }
                        title={`${hero.name} · Clicca per rimuovere o spostare`}
                        className="group relative h-16 w-16 cursor-grab active:cursor-grabbing border border-rule-2 bg-paper transition-transform hover:scale-105 hover:z-10 select-none"
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
                          title={t.rimuoviDalTier}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveHero(heroId);
                          }}
                          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* Sezione Banco Eroi (Hero Pool) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnPool}
        className="p5-corner border border-rule bg-paper-2 p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule-2 pb-4">
          <div>
            <h3 className={cx(eyebrow, "text-ink")}>{t.poolEroi}</h3>
            <p className="text-xs text-ink-3 mt-0.5">
              {t.eroiAssegnati(assignedHeroIds.size, heroes.length)}
            </p>
          </div>

          {/* Filtro ricerca testo */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.cercaPlaceholder}
              className="w-full rounded border border-rule bg-paper px-3 py-1.5 text-xs text-ink placeholder:text-ink-3 focus:border-brand focus:outline-hidden"
            />
          </div>
        </div>

        {/* Filtri rapidi per Rarità e Attributo */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {/* Rarità */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedRarity(null)}
              className={cx(
                "p5-cut p5-btn px-2.5 py-1 text-[11px] font-bold",
                selectedRarity === null
                  ? "[--btn-bg:var(--color-brand)] [--btn-fg:var(--color-ink)]"
                  : "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink-3)]",
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
                  "p5-cut p5-btn px-2.5 py-1 text-[11px] font-bold",
                  selectedRarity === r
                    ? "[--btn-bg:var(--color-brand)] [--btn-fg:var(--color-ink)]"
                    : "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink-3)]",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <span className="text-ink-4">|</span>

          {/* Attributi */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedAffinity(null)}
              className={cx(
                "p5-cut p5-btn px-2.5 py-1 text-[11px] font-bold",
                selectedAffinity === null
                  ? "[--btn-bg:var(--color-brand)] [--btn-fg:var(--color-ink)]"
                  : "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink-3)]",
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
                className={cx(
                  "p5-cut p5-btn px-2.5 py-1 text-[11px] font-bold",
                  selectedAffinity === aff.id
                    ? "[--btn-bg:var(--color-brand)] [--btn-fg:var(--color-ink)]"
                    : "[--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink-3)]",
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

      {/* Modal / Action sheet rapido al click sull'eroe (Touch friendly) */}
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

