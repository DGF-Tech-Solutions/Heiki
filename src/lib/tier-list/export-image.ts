import type { TierHeroItem, TierRow } from "./types";

/**
 * Esporta la tier list come immagine PNG ad alta risoluzione tramite HTML5 Canvas.
 */
export async function exportTierListToImage({
  title,
  subtitle,
  tiers,
  heroesMap,
  filename = "tierlist.png",
}: {
  title: string;
  subtitle?: string;
  tiers: readonly TierRow[];
  heroesMap: ReadonlyMap<string, TierHeroItem>;
  filename?: string;
}): Promise<void> {
  const CARD_SIZE = 80;
  const TIER_LABEL_WIDTH = 120;
  const ROW_MIN_HEIGHT = 88;
  const PADDING = 24;
  const HEADER_HEIGHT = 70;
  const FOOTER_HEIGHT = 36;
  const GAP = 6;

  // Calcola quante card per riga al massimo per dimensionare la larghezza
  const maxCardsInRow = Math.max(
    8,
    ...tiers.map((t) => t.heroIds.length),
  );
  const contentWidth = TIER_LABEL_WIDTH + maxCardsInRow * (CARD_SIZE + GAP) + 16;
  const totalWidth = Math.max(960, contentWidth + PADDING * 2);

  // Calcola altezze delle righe (se un tier ha molte card, va a capo)
  const availableRowWidth = totalWidth - PADDING * 2 - TIER_LABEL_WIDTH - 16;
  const cardsPerRow = Math.max(1, Math.floor(availableRowWidth / (CARD_SIZE + GAP)));

  const rowHeights = tiers.map((tier) => {
    const cardCount = tier.heroIds.length;
    if (cardCount === 0) return ROW_MIN_HEIGHT;
    const numRows = Math.ceil(cardCount / cardsPerRow);
    return Math.max(ROW_MIN_HEIGHT, numRows * (CARD_SIZE + GAP) + 12);
  });

  const totalHeight =
    PADDING +
    HEADER_HEIGHT +
    rowHeights.reduce((acc, h) => acc + h + 8, 0) +
    FOOTER_HEIGHT +
    PADDING;

  const canvas = document.createElement("canvas");
  const scale = 2; // 2x per nitidezza Retina
  canvas.width = totalWidth * scale;
  canvas.height = totalHeight * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossibile inizializzare il contesto Canvas 2D");

  ctx.scale(scale, scale);

  // 1. Sfondo generale
  ctx.fillStyle = "#0b0a0a";
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // 2. Testata
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.fillText(title, PADDING, PADDING + 30);

  if (subtitle) {
    ctx.fillStyle = "#a59e95";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(subtitle, PADDING, PADDING + 52);
  }

  // Pre-caricamento di tutte le immagini degli eroi usati
  const uniqueHeroIds = Array.from(new Set(tiers.flatMap((t) => t.heroIds)));
  const loadedImages = new Map<string, HTMLImageElement>();

  await Promise.all(
    uniqueHeroIds.map(async (heroId) => {
      const hero = heroesMap.get(heroId);
      if (!hero) return;
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = hero.cardSrc;
        });
        loadedImages.set(heroId, img);
      } catch {
        // Se una miniatura fallisce il caricamento, procediamo senza bloccare
      }
    }),
  );

  // 3. Disegna le righe dei Tier
  let currentY = PADDING + HEADER_HEIGHT;

  for (let tIndex = 0; tIndex < tiers.length; tIndex++) {
    const tier = tiers[tIndex]!;
    const rowHeight = rowHeights[tIndex]!;

    // Etichetta del Tier (rettangolo colorato)
    ctx.fillStyle = tier.color;
    ctx.fillRect(PADDING, currentY, TIER_LABEL_WIDTH, rowHeight);

    // Testo del Tier
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Aggiungi ombra al testo per leggibilità
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 4;
    ctx.fillText(tier.label, PADDING + TIER_LABEL_WIDTH / 2, currentY + rowHeight / 2);
    ctx.shadowBlur = 0;

    // Sfondo dell'area carte del Tier
    ctx.fillStyle = "#151313";
    ctx.fillRect(
      PADDING + TIER_LABEL_WIDTH,
      currentY,
      totalWidth - PADDING * 2 - TIER_LABEL_WIDTH,
      rowHeight,
    );

    // Bordo separatore
    ctx.strokeStyle = "#332e2d";
    ctx.lineWidth = 1;
    ctx.strokeRect(PADDING, currentY, totalWidth - PADDING * 2, rowHeight);

    // Disegna le card degli eroi nel tier
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    tier.heroIds.forEach((heroId, index) => {
      const col = index % cardsPerRow;
      const row = Math.floor(index / cardsPerRow);

      const cardX = PADDING + TIER_LABEL_WIDTH + 8 + col * (CARD_SIZE + GAP);
      const cardY = currentY + 6 + row * (CARD_SIZE + GAP);

      const img = loadedImages.get(heroId);
      if (img) {
        ctx.drawImage(img, cardX, cardY, CARD_SIZE, CARD_SIZE);
      } else {
        // Fallback rettangolo con nome
        ctx.fillStyle = "#221f1f";
        ctx.fillRect(cardX, cardY, CARD_SIZE, CARD_SIZE);
        const hero = heroesMap.get(heroId);
        if (hero) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px system-ui, sans-serif";
          ctx.fillText(hero.name.slice(0, 10), cardX + 4, cardY + CARD_SIZE / 2);
        }
      }

      // Cornice sottile per ogni card
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cardX, cardY, CARD_SIZE, CARD_SIZE);
    });

    currentY += rowHeight + 8;
  }

  // 4. Footer con firma GachaZone
  ctx.fillStyle = "#e61421";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("GachaZone", totalWidth - PADDING, totalHeight - PADDING);

  ctx.fillStyle = "#777169";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("· gachazone.it", totalWidth - PADDING - 80, totalHeight - PADDING);

  // 5. Download dell'immagine
  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

